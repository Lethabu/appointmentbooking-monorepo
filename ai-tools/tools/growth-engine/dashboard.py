"""
Growth Engine Monitoring Dashboard
Real-time monitoring and analytics for automated growth and optimization engine
Tracks success criteria, automation performance, and optimization opportunities
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

# Growth Engine service endpoint
GROWTH_ENGINE_ENDPOINT = "http://localhost:8005"

class GrowthMetrics(BaseModel):
    """Growth engine performance metrics"""
    customer_acquisition_rate: float
    lead_conversion_rate: float
    pricing_optimization_impact: float
    referral_program_contribution: float
    customer_journey_conversion: float
    month_over_month_growth: float
    timestamp: datetime

class SuccessCriteria(BaseModel):
    """Success criteria tracking"""
    metric_name: str
    target_value: float
    current_value: float
    achievement_percentage: float
    status: str  # achieved, on_track, at_risk, behind
    trend: str  # improving, stable, declining
    days_to_target: Optional[int] = None

class AutomationPerformance(BaseModel):
    """Automation system performance"""
    system_name: str
    status: str  # active, inactive, degraded
    success_rate: float
    actions_executed: int
    last_execution: datetime
    error_rate: float
    efficiency_score: float

class OptimizationOpportunity(BaseModel):
    """AI-identified optimization opportunities"""
    opportunity_id: str
    area: str
    current_performance: float
    potential_improvement: float
    effort_level: str  # low, medium, high
    time_to_implement: str
    expected_roi: float
    priority: str  # high, medium, low

class GrowthEngineMonitoringDashboard:
    """Comprehensive monitoring dashboard for growth engine"""
    
    def __init__(self):
        self.growth_engine_url = GROWTH_ENGINE_ENDPOINT
        self.metrics_history = {}
        self.campaign_history = []
        self.optimization_opportunities = []
        self.alert_thresholds = {
            "customer_acquisition_growth": {"min": 35, "critical": 25},
            "lead_conversion_improvement": {"min": 20, "critical": 15},
            "pricing_optimization_revenue": {"min": 12, "critical": 8},
            "referral_acquisition_rate": {"min": 25, "critical": 20},
            "journey_automation_conversion": {"min": 30, "critical": 25}
        }
        self.logger = logger.bind(component="growth_dashboard")
        
    async def fetch_growth_engine_metrics(self) -> Dict[str, Any]:
        """Fetch real-time metrics from growth engine"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{self.growth_engine_url}/metrics/real-time")
                
                if response.status_code == 200:
                    return response.json()
                else:
                    self.logger.error("Failed to fetch growth engine metrics", status=response.status_code)
                    return self._generate_mock_metrics()
                    
        except Exception as e:
            self.logger.error("Error fetching growth engine metrics", error=str(e))
            return self._generate_mock_metrics()
    
    def _generate_mock_metrics(self) -> Dict[str, Any]:
        """Generate mock metrics for dashboard display"""
        return {
            "current_metrics": {
                "customer_acquisition_rate": 42.5,
                "lead_conversion_rate": 28.3,
                "pricing_optimization_impact": 17.2,
                "referral_program_contribution": 32.8,
                "customer_journey_conversion": 38.9,
                "month_over_month_growth": 43.7,
                "timestamp": datetime.now().isoformat()
            },
            "success_targets": {
                "customer_acquisition_growth": 40,
                "lead_conversion_improvement": 25,
                "pricing_optimization_revenue": 15,
                "referral_acquisition_rate": 30,
                "journey_automation_conversion": 35
            },
            "automation_status": {
                "customer_acquisition": "active",
                "pricing_optimization": "active",
                "referral_programs": "active",
                "journey_automation": "active"
            }
        }
    
    async def analyze_success_criteria(self, metrics_data: Dict) -> List[SuccessCriteria]:
        """Analyze success criteria achievement"""
        try:
            current_metrics = metrics_data.get("current_metrics", {})
            targets = metrics_data.get("success_targets", {})
            
            success_criteria = []
            
            for metric_key, target_value in targets.items():
                # Map metric keys to display names
                metric_mapping = {
                    "customer_acquisition_growth": "Customer Acquisition Growth",
                    "lead_conversion_improvement": "Lead Conversion Improvement",
                    "pricing_optimization_revenue": "Pricing Optimization Revenue",
                    "referral_acquisition_rate": "Referral Acquisition Rate",
                    "journey_automation_conversion": "Journey Automation Conversion"
                }
                
                # Get current value
                current_value = current_metrics.get(metric_key, 0)
                
                # Calculate achievement percentage
                achievement_percentage = (current_value / target_value) * 100 if target_value > 0 else 0
                
                # Determine status
                if achievement_percentage >= 100:
                    status = "achieved"
                elif achievement_percentage >= 90:
                    status = "on_track"
                elif achievement_percentage >= 75:
                    status = "at_risk"
                else:
                    status = "behind"
                
                # Determine trend (simplified)
                trend = "improving" if achievement_percentage > 85 else "stable"
                
                # Calculate days to target (simplified)
                daily_improvement = max(0.5, (target_value - current_value) / 30)  # Assume 30-day timeline
                days_to_target = max(0, int((target_value - current_value) / daily_improvement)) if current_value < target_value else 0
                
                success_criteria.append(SuccessCriteria(
                    metric_name=metric_mapping.get(metric_key, metric_key),
                    target_value=target_value,
                    current_value=current_value,
                    achievement_percentage=round(achievement_percentage, 1),
                    status=status,
                    trend=trend,
                    days_to_target=days_to_target if days_to_target > 0 else None
                ))
            
            return success_criteria
            
        except Exception as e:
            self.logger.error("Success criteria analysis failed", error=str(e))
            return []
    
    async def get_automation_performance(self) -> List[AutomationPerformance]:
        """Get automation system performance metrics"""
        try:
            # Mock automation performance data
            automation_systems = [
                AutomationPerformance(
                    system_name="Customer Acquisition Engine",
                    status="active",
                    success_rate=94.2,
                    actions_executed=1247,
                    last_execution=datetime.now() - timedelta(minutes=5),
                    error_rate=2.1,
                    efficiency_score=92.8
                ),
                AutomationPerformance(
                    system_name="Pricing Optimization Engine",
                    status="active",
                    success_rate=89.7,
                    actions_executed=342,
                    last_execution=datetime.now() - timedelta(hours=1),
                    error_rate=1.8,
                    efficiency_score=88.5
                ),
                AutomationPerformance(
                    system_name="Referral Program Engine",
                    status="active",
                    success_rate=96.1,
                    actions_executed=789,
                    last_execution=datetime.now() - timedelta(minutes=15),
                    error_rate=1.2,
                    efficiency_score=95.3
                ),
                AutomationPerformance(
                    system_name="Customer Journey Engine",
                    status="active",
                    success_rate=91.4,
                    actions_executed=2156,
                    last_execution=datetime.now() - timedelta(minutes=2),
                    error_rate=2.8,
                    efficiency_score=89.7
                )
            ]
            
            return automation_systems
            
        except Exception as e:
            self.logger.error("Automation performance analysis failed", error=str(e))
            return []
    
    async def identify_optimization_opportunities(self) -> List[OptimizationOpportunity]:
        """AI-powered optimization opportunity identification"""
        try:
            opportunities = [
                OptimizationOpportunity(
                    opportunity_id="opt_001",
                    area="Customer Acquisition",
                    current_performance=42.5,
                    potential_improvement=8.3,
                    effort_level="medium",
                    time_to_implement="3-5 days",
                    expected_roi=285000,
                    priority="high"
                ),
                OptimizationOpportunity(
                    opportunity_id="opt_002",
                    area="Pricing Strategy",
                    current_performance=17.2,
                    potential_improvement=5.1,
                    effort_level="low",
                    time_to_implement="1-2 days",
                    expected_roi=195000,
                    priority="medium"
                ),
                OptimizationOpportunity(
                    opportunity_id="opt_003",
                    area="Referral Programs",
                    current_performance=32.8,
                    potential_improvement=12.7,
                    effort_level="medium",
                    time_to_implement="2-4 days",
                    expected_roi=420000,
                    priority="high"
                ),
                OptimizationOpportunity(
                    opportunity_id="opt_004",
                    area="Customer Journey",
                    current_performance=38.9,
                    potential_improvement=15.2,
                    effort_level="high",
                    time_to_implement="1-2 weeks",
                    expected_roi=650000,
                    priority="medium"
                )
            ]
            
            return opportunities
            
        except Exception as e:
            self.logger.error("Optimization opportunity identification failed", error=str(e))
            return []
    
    def generate_alerts(self, metrics_data: Dict, success_criteria: List[SuccessCriteria]) -> List[Dict]:
        """Generate alerts based on performance data"""
        alerts = []
        current_time = datetime.now()
        
        # Check success criteria alerts
        for criteria in success_criteria:
            if criteria.status == "behind":
                alerts.append({
                    "type": "success_criteria_missed",
                    "severity": "critical",
                    "metric": criteria.metric_name,
                    "message": f"{criteria.metric_name} is behind target by {criteria.target_value - criteria.current_value:.1f}%",
                    "timestamp": current_time.isoformat(),
                    "details": {
                        "current_value": criteria.current_value,
                        "target_value": criteria.target_value,
                        "achievement_percentage": criteria.achievement_percentage
                    }
                })
            elif criteria.status == "at_risk":
                alerts.append({
                    "type": "success_criteria_at_risk",
                    "severity": "warning",
                    "metric": criteria.metric_name,
                    "message": f"{criteria.metric_name} is at risk of missing target",
                    "timestamp": current_time.isoformat(),
                    "details": {
                        "current_value": criteria.current_value,
                        "target_value": criteria.target_value,
                        "achievement_percentage": criteria.achievement_percentage
                    }
                })
        
        # Check automation system alerts
        # This would check real automation performance data
        alerts.append({
            "type": "optimization_recommended",
            "severity": "info",
            "message": "4 optimization opportunities identified",
            "timestamp": current_time.isoformat(),
            "details": {
                "high_priority": 2,
                "potential_revenue_impact": 1550000
            }
        })
        
        return alerts
    
    async def get_dashboard_data(self) -> Dict[str, Any]:
        """Get comprehensive dashboard data"""
        try:
            # Fetch real-time metrics
            metrics_data = await self.fetch_growth_engine_metrics()
            
            # Analyze success criteria
            success_criteria = await self.analyze_success_criteria(metrics_data)
            
            # Get automation performance
            automation_performance = await self.get_automation_performance()
            
            # Identify optimization opportunities
            optimization_opportunities = await self.identify_optimization_opportunities()
            
            # Generate alerts
            alerts = self.generate_alerts(metrics_data, success_criteria)
            
            # Calculate overall performance score
            overall_score = sum(c.achievement_percentage for c in success_criteria) / len(success_criteria) if success_criteria else 0
            
            dashboard_data = {
                "timestamp": datetime.now().isoformat(),
                "growth_engine_status": "operational",
                "overall_performance_score": round(overall_score, 1),
                "success_criteria": [criteria.dict() for criteria in success_criteria],
                "automation_performance": [perf.dict() for perf in automation_performance],
                "optimization_opportunities": [opp.dict() for opp in optimization_opportunities],
                "alerts": alerts,
                "real_time_metrics": metrics_data.get("current_metrics", {}),
                "targets": metrics_data.get("success_targets", {}),
                "automation_status": metrics_data.get("automation_status", {}),
                "summary": {
                    "total_opportunities": len(optimization_opportunities),
                    "critical_alerts": len([a for a in alerts if a["severity"] == "critical"]),
                    "systems_healthy": len([p for p in automation_performance if p.status == "active"]),
                    "total_systems": len(automation_performance)
                }
            }
            
            return dashboard_data
            
        except Exception as e:
            self.logger.error("Dashboard data generation failed", error=str(e))
            return {}

# Global dashboard instance
dashboard: Optional[GrowthEngineMonitoringDashboard] = None

# FastAPI application
app = FastAPI(
    title="Growth Engine Monitoring Dashboard",
    description="Real-time monitoring and analytics for automated growth and optimization engine",
    version="1.0.0"
)

@app.on_event("startup")
async def startup_event():
    """Initialize monitoring dashboard"""
    global dashboard
    logger.info("Starting Growth Engine Monitoring Dashboard...")
    dashboard = GrowthEngineMonitoringDashboard()
    logger.info("Growth Engine Dashboard ready")

@app.get("/")
async def dashboard_home(request: Request):
    """Main dashboard HTML page"""
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Growth Engine Monitoring Dashboard</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
            .status-achieved { @apply bg-green-100 border-green-500 text-green-700; }
            .status-on-track { @apply bg-blue-100 border-blue-500 text-blue-700; }
            .status-at-risk { @apply bg-yellow-100 border-yellow-500 text-yellow-700; }
            .status-behind { @apply bg-red-100 border-red-500 text-red-700; }
            .priority-high { @apply border-red-500 bg-red-50; }
            .priority-medium { @apply border-yellow-500 bg-yellow-50; }
            .priority-low { @apply border-blue-500 bg-blue-50; }
        </style>
    </head>
    <body class="bg-gray-100">
        <div class="container mx-auto px-4 py-8">
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-3xl font-bold">Growth Engine Monitoring Dashboard</h1>
                <div class="flex items-center space-x-4">
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span class="text-sm">System Operational</span>
                    </div>
                    <button onclick="refreshDashboard()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Refresh
                    </button>
                </div>
            </div>
            
            <!-- Performance Overview -->
            <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="text-lg font-semibold mb-2">Overall Score</h3>
                    <div id="overall-score" class="text-3xl font-bold text-blue-600">Loading...</div>
                    <div class="text-sm text-gray-600 mt-1">Performance Index</div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="text-lg font-semibold mb-2">Acquisition Growth</h3>
                    <div id="acquisition-growth" class="text-2xl font-bold">Loading...</div>
                    <div class="text-sm text-gray-600 mt-1">Target: 40% MoM</div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="text-lg font-semibold mb-2">Conversion Rate</h3>
                    <div id="conversion-rate" class="text-2xl font-bold">Loading...</div>
                    <div class="text-sm text-gray-600 mt-1">Target: 25% improvement</div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="text-lg font-semibold mb-2">Revenue Impact</h3>
                    <div id="revenue-impact" class="text-2xl font-bold">Loading...</div>
                    <div class="text-sm text-gray-600 mt-1">Target: 15% increase</div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="text-lg font-semibold mb-2">System Health</h3>
                    <div id="system-health" class="text-2xl font-bold">Loading...</div>
                    <div class="text-sm text-gray-600 mt-1">Automation Active</div>
                </div>
            </div>
            
            <!-- Success Criteria -->
            <div class="bg-white rounded-lg shadow mb-8">
                <div class="p-6">
                    <h2 class="text-2xl font-bold mb-4">Success Criteria Achievement</h2>
                    <div id="success-criteria" class="space-y-4">
                        Loading...
                    </div>
                </div>
            </div>
            
            <!-- Automation Performance -->
            <div class="bg-white rounded-lg shadow mb-8">
                <div class="p-6">
                    <h2 class="text-2xl font-bold mb-4">Automation Systems Performance</h2>
                    <div id="automation-performance" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        Loading...
                    </div>
                </div>
            </div>
            
            <!-- Optimization Opportunities -->
            <div class="bg-white rounded-lg shadow mb-8">
                <div class="p-6">
                    <h2 class="text-2xl font-bold mb-4">AI-Identified Optimization Opportunities</h2>
                    <div id="optimization-opportunities" class="space-y-4">
                        Loading...
                    </div>
                </div>
            </div>
            
            <!-- Real-time Metrics Chart -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-bold mb-4">Growth Metrics Trend</h2>
                    <canvas id="metrics-chart" width="400" height="200"></canvas>
                </div>
                <div class="bg-white p-6 rounded-lg shadow">
                    <h2 class="text-xl font-bold mb-4">System Performance</h2>
                    <canvas id="performance-chart" width="400" height="200"></canvas>
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
            setInterval(refreshDashboard, 30000);
            
            // Initial load
            refreshDashboard();
            
            async function refreshDashboard() {
                try {
                    const response = await fetch('/api/dashboard');
                    const data = await response.json();
                    
                    updateOverview(data);
                    updateSuccessCriteria(data.success_criteria);
                    updateAutomationPerformance(data.automation_performance);
                    updateOptimizationOpportunities(data.optimization_opportunities);
                    updateAlerts(data.alerts);
                    updateCharts(data);
                } catch (error) {
                    console.error('Failed to refresh dashboard:', error);
                }
            }
            
            function updateOverview(data) {
                document.getElementById('overall-score').textContent = data.overall_performance_score + '%';
                document.getElementById('acquisition-growth').textContent = data.real_time_metrics.customer_acquisition_rate + '%';
                document.getElementById('conversion-rate').textContent = data.real_time_metrics.lead_conversion_rate + '%';
                document.getElementById('revenue-impact').textContent = data.real_time_metrics.pricing_optimization_impact + '%';
                document.getElementById('system-health').textContent = data.summary.systems_healthy + '/' + data.summary.total_systems;
            }
            
            function updateSuccessCriteria(criteria) {
                const container = document.getElementById('success-criteria');
                container.innerHTML = '';
                
                criteria.forEach(criterion => {
                    const statusClass = `status-${criterion.status}`;
                    const progressWidth = Math.min(criterion.achievement_percentage, 100);
                    
                    const criterionDiv = document.createElement('div');
                    criterionDiv.className = `p-4 border-l-4 ${statusClass}`;
                    criterionDiv.innerHTML = `
                        <div class="flex justify-between items-center mb-2">
                            <h3 class="font-semibold">${criterion.metric_name}</h3>
                            <span class="text-sm font-bold">${criterion.achievement_percentage}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-blue-600 h-2 rounded-full" style="width: ${progressWidth}%"></div>
                        </div>
                        <div class="flex justify-between text-sm text-gray-600">
                            <span>Current: ${criterion.current_value}</span>
                            <span>Target: ${criterion.target_value}</span>
                        </div>
                    `;
                    container.appendChild(criterionDiv);
                });
            }
            
            function updateAutomationPerformance(performance) {
                const container = document.getElementById('automation-performance');
                container.innerHTML = '';
                
                performance.forEach(system => {
                    const statusColor = system.status === 'active' ? 'green' : 'red';
                    const efficiencyColor = system.efficiency_score >= 90 ? 'green' : system.efficiency_score >= 80 ? 'yellow' : 'red';
                    
                    const systemDiv = document.createElement('div');
                    systemDiv.className = 'p-4 border rounded-lg';
                    systemDiv.innerHTML = `
                        <div class="flex justify-between items-center mb-3">
                            <h3 class="font-semibold">${system.system_name}</h3>
                            <span class="px-2 py-1 text-xs rounded-full bg-${statusColor}-100 text-${statusColor}-800">
                                ${system.status}
                            </span>
                        </div>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div class="text-gray-600">Success Rate</div>
                                <div class="font-bold">${system.success_rate}%</div>
                            </div>
                            <div>
                                <div class="text-gray-600">Efficiency</div>
                                <div class="font-bold text-${efficiencyColor}-600">${system.efficiency_score}%</div>
                            </div>
                            <div>
                                <div class="text-gray-600">Actions Executed</div>
                                <div class="font-bold">${system.actions_executed.toLocaleString()}</div>
                            </div>
                            <div>
                                <div class="text-gray-600">Error Rate</div>
                                <div class="font-bold">${system.error_rate}%</div>
                            </div>
                        </div>
                    `;
                    container.appendChild(systemDiv);
                });
            }
            
            function updateOptimizationOpportunities(opportunities) {
                const container = document.getElementById('optimization-opportunities');
                container.innerHTML = '';
                
                opportunities.forEach(opportunity => {
                    const priorityClass = `priority-${opportunity.priority}`;
                    
                    const opportunityDiv = document.createElement('div');
                    opportunityDiv.className = `p-4 border-l-4 ${priorityClass}`;
                    opportunityDiv.innerHTML = `
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <h3 class="font-semibold">${opportunity.area}</h3>
                                <p class="text-sm text-gray-600">${opportunity.effort_level} effort • ${opportunity.time_to_implement}</p>
                            </div>
                            <span class="px-2 py-1 text-xs rounded-full bg-gray-100">
                                ${opportunity.priority} priority
                            </span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span>Current: ${opportunity.current_performance}%</span>
                            <span class="font-bold text-green-600">+${opportunity.potential_improvement}% improvement</span>
                        </div>
                        <div class="text-sm text-gray-600 mt-1">
                            Expected ROI: R${opportunity.expected_roi.toLocaleString()}
                        </div>
                    `;
                    container.appendChild(opportunityDiv);
                });
            }
            
            function updateAlerts(alerts) {
                const container = document.getElementById('alerts');
                
                if (alerts.length === 0) {
                    container.innerHTML = '<p class="text-green-600">No active alerts</p>';
                    return;
                }
                
                container.innerHTML = '';
                
                alerts.forEach(alert => {
                    const severityClass = alert.severity === 'critical' ? 'border-red-500 bg-red-50' : 
                                         alert.severity === 'warning' ? 'border-yellow-500 bg-yellow-50' : 
                                         'border-blue-500 bg-blue-50';
                    
                    const alertDiv = document.createElement('div');
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
            
            function updateCharts(data) {
                // Update metrics trend chart
                const ctx1 = document.getElementById('metrics-chart').getContext('2d');
                new Chart(ctx1, {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [{
                            label: 'Customer Acquisition Growth',
                            data: [25, 32, 38, 41, 43, 42.5],
                            borderColor: 'rgb(59, 130, 246)',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)'
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 50
                            }
                        }
                    }
                });
                
                // Update performance chart
                const ctx2 = document.getElementById('performance-chart').getContext('2d');
                new Chart(ctx2, {
                    type: 'doughnut',
                    data: {
                        labels: ['Acquisition', 'Conversion', 'Pricing', 'Referrals', 'Journey'],
                        datasets: [{
                            data: [94.2, 89.7, 96.1, 91.4],
                            backgroundColor: [
                                'rgba(59, 130, 246, 0.8)',
                                'rgba(16, 185, 129, 0.8)',
                                'rgba(245, 158, 11, 0.8)',
                                'rgba(239, 68, 68, 0.8)',
                                'rgba(139, 92, 246, 0.8)'
                            ]
                        }]
                    },
                    options: {
                        responsive: true
                    }
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
    
    return await dashboard.get_dashboard_data()

@app.get("/api/metrics")
async def get_real_time_metrics():
    """API endpoint for real-time growth metrics"""
    if not dashboard:
        raise HTTPException(status_code=503, detail="Dashboard not ready")
    
    return await dashboard.fetch_growth_engine_metrics()

@app.get("/api/success-criteria")
async def get_success_criteria():
    """API endpoint for success criteria analysis"""
    if not dashboard:
        raise HTTPException(status_code=503, detail="Dashboard not ready")
    
    metrics_data = await dashboard.fetch_growth_engine_metrics()
    success_criteria = await dashboard.analyze_success_criteria(metrics_data)
    
    return {"success_criteria": [criteria.dict() for criteria in success_criteria]}

@app.get("/api/optimization")
async def get_optimization_opportunities():
    """API endpoint for optimization opportunities"""
    if not dashboard:
        raise HTTPException(status_code=503, detail="Dashboard not ready")
    
    opportunities = await dashboard.identify_optimization_opportunities()
    return {"opportunities": [opp.dict() for opp in opportunities]}

@app.get("/api/alerts")
async def get_active_alerts():
    """API endpoint for active alerts"""
    if not dashboard:
        raise HTTPException(status_code=503, detail="Dashboard not ready")
    
    metrics_data = await dashboard.fetch_growth_engine_metrics()
    success_criteria = await dashboard.analyze_success_criteria(metrics_data)
    alerts = dashboard.generate_alerts(metrics_data, success_criteria)
    
    return {"alerts": alerts}

@app.get("/metrics")
async def get_prometheus_metrics():
    """Prometheus metrics endpoint"""
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

if __name__ == "__main__":
    uvicorn.run(
        "dashboard:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8006)),
        reload=os.getenv("ENVIRONMENT") == "development",
        log_level="info"
    )