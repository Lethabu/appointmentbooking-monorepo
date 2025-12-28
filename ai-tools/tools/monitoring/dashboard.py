"""
AI Tools Monitoring Dashboard
Real-time monitoring and performance validation for AI tools infrastructure
"""

import asyncio
import json
import os
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from pathlib import Path

import httpx
import pandas as pd
import structlog
from fastapi import FastAPI, HTTPException, BackgroundTasks, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import uvicorn
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
import psutil

# Setup logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Service endpoints
AI_TOOLS_SERVICES = {
    "excel-ai-agent": "http://localhost:8000",
    "csv-ai-analyzer": "http://localhost:8001", 
    "real-time-translator": "http://localhost:8002"
}

class ServiceHealth(BaseModel):
    name: str
    status: str  # healthy, unhealthy, unknown
    response_time: float
    last_check: datetime
    error_message: Optional[str] = None
    uptime: Optional[float] = None
    version: Optional[str] = None

class PerformanceMetrics(BaseModel):
    service: str
    cpu_usage: float
    memory_usage: float
    disk_usage: float
    active_connections: int
    requests_per_minute: float
    error_rate: float
    avg_response_time: float
    timestamp: datetime

class SystemMetrics(BaseModel):
    total_cpu: float
    total_memory: float
    total_disk: float
    network_io: Dict[str, float]
    load_average: List[float]
    timestamp: datetime

class MonitoringDashboard:
    """Comprehensive monitoring dashboard for AI tools"""
    
    def __init__(self):
        self.services = AI_TOOLS_SERVICES
        self.health_history = {}
        self.performance_history = {}
        self.logger = logger.bind(component="monitoring_dashboard")
        
    async def check_service_health(self, service_name: str, url: str) -> ServiceHealth:
        """Check health of a specific service"""
        start_time = time.time()
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{url}/health")
                response_time = time.time() - start_time
                
                if response.status_code == 200:
                    health_data = response.json()
                    return ServiceHealth(
                        name=service_name,
                        status="healthy",
                        response_time=response_time,
                        last_check=datetime.now(),
                        uptime=health_data.get("service_uptime"),
                        version=health_data.get("version")
                    )
                else:
                    return ServiceHealth(
                        name=service_name,
                        status="unhealthy",
                        response_time=response_time,
                        last_check=datetime.now(),
                        error_message=f"HTTP {response.status_code}"
                    )
                    
        except Exception as e:
            response_time = time.time() - start_time
            return ServiceHealth(
                name=service_name,
                status="unhealthy",
                response_time=response_time,
                last_check=datetime.now(),
                error_message=str(e)
            )
    
    async def get_performance_metrics(self, service_name: str, url: str) -> Optional[PerformanceMetrics]:
        """Get performance metrics from service"""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                # Get service stats
                stats_response = await client.get(f"{url}/stats")
                if stats_response.status_code != 200:
                    return None
                
                stats = stats_response.json()
                
                # Get Prometheus metrics
                metrics_response = await client.get(f"{url}/metrics")
                metrics_text = metrics_response.text if metrics_response.status_code == 200 else ""
                
                return PerformanceMetrics(
                    service=service_name,
                    cpu_usage=psutil.cpu_percent(),
                    memory_usage=psutil.virtual_memory().percent,
                    disk_usage=psutil.disk_usage('/').percent,
                    active_connections=stats.get("active_websockets", 0),
                    requests_per_minute=stats.get("requests_per_minute", 0),
                    error_rate=stats.get("error_rate", 0),
                    avg_response_time=stats.get("avg_response_time", 0),
                    timestamp=datetime.now()
                )
                
        except Exception as e:
            self.logger.error("Failed to get performance metrics", service=service_name, error=str(e))
            return None
    
    async def get_system_metrics(self) -> SystemMetrics:
        """Get overall system metrics"""
        try:
            # Network I/O
            net_io = psutil.net_io_counters()
            
            return SystemMetrics(
                total_cpu=psutil.cpu_percent(),
                total_memory=psutil.virtual_memory().percent,
                total_disk=psutil.disk_usage('/').percent,
                network_io={
                    "bytes_sent": net_io.bytes_sent,
                    "bytes_recv": net_io.bytes_recv,
                    "packets_sent": net_io.packets_sent,
                    "packets_recv": net_io.packets_recv
                },
                load_average=psutil.getloadavg() if hasattr(psutil, 'getloadavg') else [0, 0, 0],
                timestamp=datetime.now()
            )
            
        except Exception as e:
            self.logger.error("Failed to get system metrics", error=str(e))
            return SystemMetrics(
                total_cpu=0, total_memory=0, total_disk=0,
                network_io={}, load_average=[0, 0, 0],
                timestamp=datetime.now()
            )
    
    async def run_health_checks(self) -> Dict[str, ServiceHealth]:
        """Run health checks for all services"""
        health_results = {}
        
        tasks = []
        for service_name, url in self.services.items():
            task = self.check_service_health(service_name, url)
            tasks.append((service_name, task))
        
        # Execute all health checks concurrently
        for service_name, task in tasks:
            try:
                health_result = await task
                health_results[service_name] = health_result
                
                # Store in history
                if service_name not in self.health_history:
                    self.health_history[service_name] = []
                
                self.health_history[service_name].append(health_result)
                
                # Keep only last 100 entries
                if len(self.health_history[service_name]) > 100:
                    self.health_history[service_name] = self.health_history[service_name][-100:]
                    
            except Exception as e:
                self.logger.error("Health check failed", service=service_name, error=str(e))
                health_results[service_name] = ServiceHealth(
                    name=service_name,
                    status="unknown",
                    response_time=0,
                    last_check=datetime.now(),
                    error_message=str(e)
                )
        
        return health_results
    
    async def collect_performance_data(self) -> Dict[str, PerformanceMetrics]:
        """Collect performance data from all services"""
        performance_results = {}
        
        tasks = []
        for service_name, url in self.services.items():
            task = self.get_performance_metrics(service_name, url)
            tasks.append((service_name, task))
        
        # Execute all performance checks
        for service_name, task in tasks:
            try:
                metrics = await task
                if metrics:
                    performance_results[service_name] = metrics
                    
                    # Store in history
                    if service_name not in self.performance_history:
                        self.performance_history[service_name] = []
                    
                    self.performance_history[service_name].append(metrics)
                    
                    # Keep only last 200 entries
                    if len(self.performance_history[service_name]) > 200:
                        self.performance_history[service_name] = self.performance_history[service_name][-200:]
                        
            except Exception as e:
                self.logger.error("Performance check failed", service=service_name, error=str(e))
        
        return performance_results
    
    def generate_alerts(self, health_results: Dict[str, ServiceHealth], 
                       performance_results: Dict[str, PerformanceMetrics]) -> List[Dict]:
        """Generate alerts based on health and performance data"""
        alerts = []
        current_time = datetime.now()
        
        for service_name, health in health_results.items():
            # Service down alert
            if health.status != "healthy":
                alerts.append({
                    "type": "service_down",
                    "severity": "critical",
                    "service": service_name,
                    "message": f"Service {service_name} is {health.status}",
                    "timestamp": current_time.isoformat(),
                    "details": {
                        "error_message": health.error_message,
                        "response_time": health.response_time
                    }
                })
            
            # High response time alert
            if health.response_time > 5.0:  # 5 seconds
                alerts.append({
                    "type": "high_response_time",
                    "severity": "warning",
                    "service": service_name,
                    "message": f"High response time: {health.response_time:.2f}s",
                    "timestamp": current_time.isoformat(),
                    "details": {"response_time": health.response_time}
                })
        
        # Performance-based alerts
        for service_name, metrics in performance_results.items():
            if metrics.cpu_usage > 80:
                alerts.append({
                    "type": "high_cpu_usage",
                    "severity": "warning",
                    "service": service_name,
                    "message": f"High CPU usage: {metrics.cpu_usage:.1f}%",
                    "timestamp": current_time.isoformat(),
                    "details": {"cpu_usage": metrics.cpu_usage}
                })
            
            if metrics.memory_usage > 85:
                alerts.append({
                    "type": "high_memory_usage",
                    "severity": "warning",
                    "service": service_name,
                    "message": f"High memory usage: {metrics.memory_usage:.1f}%",
                    "timestamp": current_time.isoformat(),
                    "details": {"memory_usage": metrics.memory_usage}
                })
            
            if metrics.error_rate > 5:  # 5% error rate
                alerts.append({
                    "type": "high_error_rate",
                    "severity": "critical",
                    "service": service_name,
                    "message": rate: {metrics.error f"High error_rate:.1f}%",
                    "timestamp": current_time.isoformat(),
                    "details": {"error_rate": metrics.error_rate}
                })
        
        return alerts
    
    def get_dashboard_data(self) -> Dict[str, Any]:
        """Get comprehensive dashboard data"""
        return {
            "timestamp": datetime.now().isoformat(),
            "services": self.services,
            "health_status": {name: health.dict() for name, health in self.get_latest_health().items()},
            "performance_metrics": {name: metrics.dict() for name, metrics in self.get_latest_performance().items()},
            "system_metrics": self.get_latest_system_metrics().dict(),
            "alerts": self.generate_alerts(self.get_latest_health(), self.get_latest_performance()),
            "summary": self.generate_summary()
        }
    
    def get_latest_health(self) -> Dict[str, ServiceHealth]:
        """Get latest health status for each service"""
        latest_health = {}
        for service_name, history in self.health_history.items():
            if history:
                latest_health[service_name] = history[-1]
        return latest_health
    
    def get_latest_performance(self) -> Dict[str, PerformanceMetrics]:
        """Get latest performance metrics for each service"""
        latest_performance = {}
        for service_name, history in self.performance_history.items():
            if history:
                latest_performance[service_name] = history[-1]
        return latest_performance
    
    def get_latest_system_metrics(self) -> SystemMetrics:
        """Get latest system metrics (synchronous)"""
        # This would typically be updated asynchronously
        return SystemMetrics(
            total_cpu=psutil.cpu_percent(),
            total_memory=psutil.virtual_memory().percent,
            total_disk=psutil.disk_usage('/').percent,
            network_io={},
            load_average=[0, 0, 0],
            timestamp=datetime.now()
        )
    
    def generate_summary(self) -> Dict[str, Any]:
        """Generate monitoring summary"""
        latest_health = self.get_latest_health()
        latest_performance = self.get_latest_performance()
        
        # Calculate summary stats
        total_services = len(self.services)
        healthy_services = len([h for h in latest_health.values() if h.status == "healthy"])
        avg_response_time = sum(h.response_time for h in latest_health.values()) / len(latest_health) if latest_health else 0
        total_errors = sum(p.error_rate for p in latest_performance.values()) if latest_performance else 0
        
        return {
            "total_services": total_services,
            "healthy_services": healthy_services,
            "unhealthy_services": total_services - healthy_services,
            "overall_health_score": (healthy_services / total_services * 100) if total_services > 0 else 0,
            "average_response_time": round(avg_response_time, 2),
            "total_error_rate": round(total_errors, 2),
            "monitoring_status": "operational" if healthy_services == total_services else "degraded"
        }

# Global dashboard instance
dashboard: Optional[MonitoringDashboard] = None

# FastAPI application
app = FastAPI(
    title="AI Tools Monitoring Dashboard",
    description="Real-time monitoring and performance validation dashboard",
    version="1.0.0"
)

# Add background task for continuous monitoring
monitoring_task: Optional[asyncio.Task] = None

@app.on_event("startup")
async def startup_event():
    """Initialize monitoring dashboard and start background monitoring"""
    global dashboard, monitoring_task
    
    logger.info("Starting AI Tools Monitoring Dashboard...")
    dashboard = MonitoringDashboard()
    
    # Start background monitoring task
    monitoring_task = asyncio.create_task(continuous_monitoring())
    
    logger.info("Monitoring Dashboard ready")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup monitoring tasks"""
    global monitoring_task
    
    if monitoring_task:
        monitoring_task.cancel()
        try:
            await monitoring_task
        except asyncio.CancelledError:
            pass
    
    logger.info("Monitoring Dashboard shutdown complete")

async def continuous_monitoring():
    """Background task for continuous monitoring"""
    while True:
        try:
            if dashboard:
                # Run health checks
                health_results = await dashboard.run_health_checks()
                
                # Collect performance metrics
                performance_results = await dashboard.collect_performance_data()
                
                # Generate alerts
                alerts = dashboard.generate_alerts(health_results, performance_results)
                
                # Log any critical alerts
                for alert in alerts:
                    if alert["severity"] == "critical":
                        logger.critical("Critical alert generated", alert=alert)
                
            # Wait before next check (30 seconds)
            await asyncio.sleep(30)
            
        except asyncio.CancelledError:
            break
        except Exception as e:
            logger.error("Continuous monitoring error", error=str(e))
            await asyncio.sleep(10)  # Shorter wait on error

@app.get("/")
async def dashboard_home(request: Request):
    """Main dashboard HTML page"""
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Tools Monitoring Dashboard</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
            .status-healthy { @apply bg-green-100 border-green-500 text-green-700; }
            .status-unhealthy { @apply bg-red-100 border-red-500 text-red-700; }
            .status-unknown { @apply bg-yellow-100 border-yellow-500 text-yellow-700; }
        </style>
    </head>
    <body class="bg-gray-100">
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold mb-8">AI Tools Monitoring Dashboard</h1>
            
            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="text-lg font-semibold mb-2">Services Status</h3>
                    <div id="services-summary" class="text-2xl font-bold">Loading...</div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="text-lg font-semibold mb-2">Overall Health</h3>
                    <div id="health-score" class="text-2xl font-bold">Loading...</div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="text-lg font-semibold mb-2">Avg Response Time</h3>
                    <div id="avg-response-time" class="text-2xl font-bold">Loading...</div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="text-lg font-semibold mb-2">Error Rate</h3>
                    <div id="error-rate" class="text-2xl font-bold">Loading...</div>
                </div>
            </div>
            
            <!-- Service Health -->
            <div class="bg-white rounded-lg shadow mb-8">
                <div class="p-6">
                    <h2 class="text-2xl font-bold mb-4">Service Health</h2>
                    <div id="services-health" class="space-y-4">
                        Loading...
                    </div>
                </div>
            </div>
            
            <!-- Performance Charts -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-bold mb-4">CPU Usage</h2>
                    <canvas id="cpu-chart" width="400" height="200"></canvas>
                </div>
                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-bold mb-4">Memory Usage</h2>
                    <canvas id="memory-chart" width="400" height="200"></canvas>
                </div>
            </div>
            
            <!-- Alerts -->
            <div class="bg-white rounded-lg shadow">
                <div class="p-6">
                    <h2 class="text-2xl font-bold mb-4">Active Alerts</h2>
                    <div id="alerts" class="space-y-2">
                        Loading...
                    </div>
                </div>
            </div>
        </div>
        
        <script>
            // Auto-refresh dashboard every 30 seconds
            setInterval(updateDashboard, 30000);
            
            // Initial load
            updateDashboard();
            
            async function updateDashboard() {
                try {
                    const response = await fetch('/api/dashboard');
                    const data = await response.json();
                    
                    updateSummary(data.summary);
                    updateServicesHealth(data.health_status);
                    updatePerformanceCharts(data.performance_metrics);
                    updateAlerts(data.alerts);
                } catch (error) {
                    console.error('Failed to update dashboard:', error);
                }
            }
            
            function updateSummary(summary) {
                document.getElementById('services-summary').textContent = 
                    `${summary.healthy_services}/${summary.total_services}`;
                document.getElementById('health-score').textContent = 
                    `${summary.overall_health_score.toFixed(1)}%`;
                document.getElementById('avg-response-time').textContent = 
                    `${summary.average_response_time}s`;
                document.getElementById('error-rate').textContent = 
                    `${summary.total_error_rate.toFixed(1)}%`;
            }
            
            function updateServicesHealth(healthStatus) {
                const container = document.getElementById('services-health');
                container.innerHTML = '';
                
                Object.entries(healthStatus).forEach(([service, health]) => {
                    const statusClass = `status-${health.status}`;
                    const statusIcon = health.status === 'healthy' ? '✓' : 
                                     health.status === 'unhealthy' ? '✗' : '?';
                    
                    const serviceCard = document.createElement('div');
                    serviceCard.className = `p-4 border-l-4 ${statusClass}`;
                    serviceCard.innerHTML = `
                        <div class="flex justify-between items-center">
                            <div>
                                <h3 class="font-semibold">${service}</h3>
                                <p class="text-sm">${statusIcon} ${health.status}</p>
                            </div>
                            <div class="text-right text-sm">
                                <div>Response: ${health.response_time.toFixed(2)}s</div>
                                <div>Version: ${health.version || 'N/A'}</div>
                            </div>
                        </div>
                        ${health.error_message ? `<p class="text-sm mt-2 text-red-600">${health.error_message}</p>` : ''}
                    `;
                    container.appendChild(serviceCard);
                });
            }
            
            function updatePerformanceCharts(performanceMetrics) {
                // Update CPU chart
                const cpuData = Object.values(performanceMetrics).map(m => m.cpu_usage);
                updateChart('cpu-chart', cpuData);
                
                // Update Memory chart
                const memoryData = Object.values(performanceMetrics).map(m => m.memory_usage);
                updateChart('memory-chart', memoryData);
            }
            
            function updateChart(canvasId, data) {
                const ctx = document.getElementById(canvasId).getContext('2d');
                // Simple chart update logic would go here
                // For now, just log the data
                console.log(`Chart ${canvasId} data:`, data);
            }
            
            function updateAlerts(alerts) {
                const container = document.getElementById('alerts');
                
                if (alerts.length === 0) {
                    container.innerHTML = '<p class="text-green-600">No active alerts</p>';
                    return;
                }
                
                container.innerHTML = '';
                
                alerts.forEach(alert => {
                    const alertDiv = document.createElement('div');
                    const severityClass = alert.severity === 'critical' ? 'border-red-500 bg-red-50' : 
                                         alert.severity === 'warning' ? 'border-yellow-500 bg-yellow-50' : 
                                         'border-blue-500 bg-blue-50';
                    
                    alertDiv.className = `p-3 border-l-4 ${severityClass}`;
                    alertDiv.innerHTML = `
                        <div class="flex justify-between">
                            <div>
                                <span class="font-semibold">${alert.type}</span>
                                <span class="ml-2">${alert.message}</span>
                            </div>
                            <span class="text-sm text-gray-500">${new Date(alert.timestamp).toLocaleTimeString()}</span>
                        </div>
                    `;
                    container.appendChild(alertDiv);
                });
            }
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@app.get("/api/dashboard")
async def get_dashboard_data():
    """API endpoint for dashboard data"""
    if not dashboard:
        raise HTTPException(status_code=503, detail="Dashboard not ready")
    
    return JSONResponse(dashboard.get_dashboard_data())

@app.get("/api/health")
async def get_health_status():
    """API endpoint for service health status"""
    if not dashboard:
        raise HTTPException(status_code=503, detail="Dashboard not ready")
    
    health_results = await dashboard.run_health_checks()
    return {name: health.dict() for name, health in health_results.items()}

@app.get("/api/performance")
async def get_performance_metrics():
    """API endpoint for performance metrics"""
    if not dashboard:
        raise HTTPException(status_code=503, detail="Dashboard not ready")
    
    performance_results = await dashboard.collect_performance_data()
    return {name: metrics.dict() for name, metrics in performance_results.items()}

@app.get("/api/system")
async def get_system_metrics():
    """API endpoint for system metrics"""
    if not dashboard:
        raise HTTPException(status_code=503, detail="Dashboard not ready")
    
    return JSONResponse(dashboard.get_latest_system_metrics().dict())

@app.get("/api/alerts")
async def get_active_alerts():
    """API endpoint for active alerts"""
    if not dashboard:
        raise HTTPException(status_code=503, detail="Dashboard not ready")
    
    health_results = await dashboard.run_health_checks()
    performance_results = await dashboard.collect_performance_data()
    alerts = dashboard.generate_alerts(health_results, performance_results)
    
    return JSONResponse(alerts)

@app.get("/metrics")
async def get_prometheus_metrics():
    """Prometheus metrics endpoint"""
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

if __name__ == "__main__":
    uvicorn.run(
        "dashboard:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8003)),
        reload=os.getenv("ENVIRONMENT") == "development",
        log_level="info"
    )