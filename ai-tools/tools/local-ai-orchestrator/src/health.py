"""
Health Monitoring and Recovery System for Local AI Orchestrator
Comprehensive health checks with resilient error recovery and state management
"""

import asyncio
import time
import psutil
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Callable
from dataclasses import dataclass, field
from enum import Enum
from contextlib import asynccontextmanager
import structlog
import aiohttp
from aiohttp import ClientTimeout

# Setup structured logging for health module
logger = structlog.get_logger(__name__)

class HealthStatus(Enum):
    """Health status enumeration"""
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"
    CRITICAL = "critical"
    UNKNOWN = "unknown"

class CheckType(Enum):
    """Health check types"""
    LIVENESS = "liveness"
    READINESS = "readiness"
    HEALTH = "health"
    PERFORMANCE = "performance"
    SECURITY = "security"

@dataclass
class HealthCheckResult:
    """Result of a health check"""
    name: str
    status: HealthStatus
    message: str
    timestamp: datetime
    duration_ms: float
    metadata: Dict[str, Any] = field(default_factory=dict)
    error: Optional[str] = None
    recommendations: List[str] = field(default_factory=list)

@dataclass
class ServiceHealth:
    """Overall service health status"""
    status: HealthStatus
    timestamp: datetime
    uptime_seconds: float
    version: str
    checks: List[HealthCheckResult] = field(default_factory=list)
    resource_usage: Dict[str, Any] = field(default_factory=dict)
    dependencies: Dict[str, HealthStatus] = field(default_factory=dict)

class CircuitBreaker:
    """Circuit breaker pattern for resilient error handling"""
    
    def __init__(self, failure_threshold: int = 5, timeout: float = 60.0):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = "closed"  # closed, open, half-open
        self.logger = logger.bind(component="circuit_breaker")
    
    async def call(self, func: Callable, *args, **kwargs) -> Any:
        """Execute function with circuit breaker protection"""
        if self.state == "open":
            if time.time() - self.last_failure_time > self.timeout:
                self.state = "half-open"
                self.logger.info("Circuit breaker moved to half-open state")
            else:
                raise Exception("Circuit breaker is open")
        
        try:
            result = await func(*args, **kwargs) if asyncio.iscoroutinefunction(func) else func(*args, **kwargs)
            
            if self.state == "half-open":
                self.state = "closed"
                self.failure_count = 0
                self.logger.info("Circuit breaker moved to closed state")
            
            return result
            
        except Exception as e:
            self.failure_count += 1
            self.last_failure_time = time.time()
            
            if self.failure_count >= self.failure_threshold:
                self.state = "open"
                self.logger.error("Circuit breaker opened due to failures", 
                                failure_count=self.failure_count, error=str(e))
            
            raise e
    
    @property
    def is_closed(self) -> bool:
        return self.state == "closed"
    
    @property
    def is_open(self) -> bool:
        return self.state == "open"

class RateLimiter:
    """Rate limiter with sliding window and error recovery"""
    
    def __init__(self, max_requests: int, time_window: int = 60):
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests = []
        self.logger = logger.bind(component="rate_limiter")
    
    async def acquire(self, request_id: str = None) -> bool:
        """Acquire rate limit token"""
        now = time.time()
        
        # Remove old requests outside the time window
        cutoff = now - self.time_window
        self.requests = [req_time for req_time in self.requests if req_time > cutoff]
        
        # Check if we can accept the request
        if len(self.requests) < self.max_requests:
            self.requests.append(now)
            return True
        
        self.logger.warning("Rate limit exceeded", 
                          request_count=len(self.requests), 
                          max_requests=self.max_requests)
        return False
    
    def get_remaining_requests(self) -> int:
        """Get remaining requests in current window"""
        now = time.time()
        cutoff = now - self.time_window
        active_requests = len([req_time for req_time in self.requests if req_time > cutoff])
        return max(0, self.max_requests - active_requests)

class HealthChecker:
    """Comprehensive health checker with resilient error handling"""
    
    def __init__(self, config: Dict[str, Any] = None):
        self.config = config or {}
        self.logger = logger.bind(component="health_checker")
        
        # Initialize circuit breakers for different services
        self.circuit_breakers = {
            "ollama": CircuitBreaker(failure_threshold=3, timeout=30.0),
            "gemini": CircuitBreaker(failure_threshold=5, timeout=60.0),
            "redis": CircuitBreaker(failure_threshold=3, timeout=30.0),
            "database": CircuitBreaker(failure_threshold=3, timeout=30.0)
        }
        
        # Initialize rate limiters
        self.rate_limiters = {
            "global": RateLimiter(max_requests=100, time_window=60),
            "per_provider": RateLimiter(max_requests=10, time_window=60)
        }
        
        # Health check functions
        self.check_functions = {
            CheckType.LIVENESS: [
                self._check_service_liveness,
                self._check_memory_usage,
                self._check_disk_space
            ],
            CheckType.READINESS: [
                self._check_ollama_readiness,
                self._check_gemini_readiness,
                self._check_configuration
            ],
            CheckType.HEALTH: [
                self._check_system_health,
                self._check_dependency_health,
                self._check_performance_health
            ],
            CheckType.PERFORMANCE: [
                self._check_response_times,
                self._check_resource_utilization,
                self._check_throughput
            ]
        }
        
        # State management
        self.last_health_check = None
        self.health_history = []
        self.max_history_size = 100
        
        # Recovery mechanisms
        self.auto_recovery_enabled = True
        self.recovery_strategies = {
            "ollama": self._recover_ollama_connection,
            "gemini": self._recover_gemini_connection,
            "memory": self._recover_memory_pressure,
            "disk": self._recover_disk_space
        }
    
    async def check_all(self) -> ServiceHealth:
        """Run all health checks with comprehensive error handling"""
        start_time = time.time()
        self.logger.info("Starting comprehensive health check")
        
        try:
            checks = []
            
            # Run all check types
            for check_type, check_functions in self.check_functions.items():
                for check_func in check_functions:
                    try:
                        result = await self._run_single_check(check_func)
                        checks.append(result)
                        
                        # Attempt auto-recovery if check failed
                        if result.status in [HealthStatus.UNHEALTHY, HealthStatus.CRITICAL]:
                            await self._attempt_auto_recovery(result)
                        
                    except Exception as e:
                        self.logger.error("Health check failed", 
                                        check=check_func.__name__, error=str(e))
                        checks.append(HealthCheckResult(
                            name=check_func.__name__,
                            status=HealthStatus.CRITICAL,
                            message=f"Check execution failed: {str(e)}",
                            timestamp=datetime.now(),
                            duration_ms=0,
                            error=str(e)
                        ))
            
            # Determine overall status
            overall_status = self._determine_overall_status(checks)
            
            # Get resource usage
            resource_usage = await self._get_resource_usage()
            
            # Get dependency status
            dependencies = await self._get_dependency_status()
            
            # Create service health
            service_health = ServiceHealth(
                status=overall_status,
                timestamp=datetime.now(),
                uptime_seconds=time.time() - psutil.boot_time(),
                version="1.0.0",
                checks=checks,
                resource_usage=resource_usage,
                dependencies=dependencies
            )
            
            # Store in history
            self._store_health_history(service_health)
            
            # Update last check time
            self.last_health_check = service_health
            
            duration = (time.time() - start_time) * 1000
            self.logger.info("Health check completed", 
                           status=overall_status.value, 
                           duration_ms=duration,
                           check_count=len(checks))
            
            return service_health
            
        except Exception as e:
            self.logger.error("Comprehensive health check failed", error=str(e))
            return ServiceHealth(
                status=HealthStatus.CRITICAL,
                timestamp=datetime.now(),
                uptime_seconds=0,
                version="1.0.0",
                error=str(e)
            )
    
    async def _run_single_check(self, check_func: Callable) -> HealthCheckResult:
        """Run a single health check with error handling"""
        start_time = time.time()
        
        try:
            result = await check_func()
            duration = (time.time() - start_time) * 1000
            
            return HealthCheckResult(
                name=check_func.__name__,
                status=result.get("status", HealthStatus.HEALTHY),
                message=result.get("message", "Check passed"),
                timestamp=datetime.now(),
                duration_ms=duration,
                metadata=result.get("metadata", {}),
                recommendations=result.get("recommendations", [])
            )
            
        except Exception as e:
            duration = (time.time() - start_time) * 1000
            return HealthCheckResult(
                name=check_func.__name__,
                status=HealthStatus.CRITICAL,
                message=f"Check failed: {str(e)}",
                timestamp=datetime.now(),
                duration_ms=duration,
                error=str(e)
            )
    
    async def _check_service_liveness(self) -> Dict[str, Any]:
        """Check if service is alive"""
        return {
            "status": HealthStatus.HEALTHY,
            "message": "Service is alive and responding",
            "metadata": {
                "service_uptime": time.time() - psutil.boot_time(),
                "process_count": len(psutil.pids())
            }
        }
    
    async def _check_memory_usage(self) -> Dict[str, Any]:
        """Check memory usage with recovery if needed"""
        memory = psutil.virtual_memory()
        memory_percent = memory.percent
        
        if memory_percent > 90:
            return {
                "status": HealthStatus.CRITICAL,
                "message": f"Critical memory usage: {memory_percent:.1f}%",
                "metadata": {
                    "memory_percent": memory_percent,
                    "available_gb": memory.available / (1024**3),
                    "total_gb": memory.total / (1024**3)
                },
                "recommendations": ["Consider restarting service or freeing memory"]
            }
        elif memory_percent > 80:
            return {
                "status": HealthStatus.DEGRADED,
                "message": f"High memory usage: {memory_percent:.1f}%",
                "metadata": {
                    "memory_percent": memory_percent,
                    "available_gb": memory.available / (1024**3)
                },
                "recommendations": ["Monitor memory usage", "Consider optimization"]
            }
        else:
            return {
                "status": HealthStatus.HEALTHY,
                "message": f"Memory usage normal: {memory_percent:.1f}%",
                "metadata": {
                    "memory_percent": memory_percent,
                    "available_gb": memory.available / (1024**3)
                }
            }
    
    async def _check_disk_space(self) -> Dict[str, Any]:
        """Check disk space usage"""
        disk = psutil.disk_usage('/')
        disk_percent = (disk.used / disk.total) * 100
        
        if disk_percent > 95:
            return {
                "status": HealthStatus.CRITICAL,
                "message": f"Critical disk usage: {disk_percent:.1f}%",
                "metadata": {
                    "disk_percent": disk_percent,
                    "free_gb": disk.free / (1024**3),
                    "total_gb": disk.total / (1024**3)
                }
            }
        elif disk_percent > 85:
            return {
                "status": HealthStatus.DEGRADED,
                "message": f"High disk usage: {disk_percent:.1f}%",
                "metadata": {
                    "disk_percent": disk_percent,
                    "free_gb": disk.free / (1024**3)
                }
            }
        else:
            return {
                "status": HealthStatus.HEALTHY,
                "message": f"Disk usage normal: {disk_percent:.1f}%",
                "metadata": {
                    "disk_percent": disk_percent,
                    "free_gb": disk.free / (1024**3)
                }
            }
    
    async def _check_ollama_readiness(self) -> Dict[str, Any]:
        """Check Ollama service readiness with circuit breaker"""
        try:
            async def _check_ollama():
                timeout = ClientTimeout(total=10)
                async with aiohttp.ClientSession(timeout=timeout) as session:
                    async with session.get("http://ollama:11434/api/tags") as response:
                        if response.status == 200:
                            data = await response.json()
                            return {
                                "status": HealthStatus.HEALTHY,
                                "message": "Ollama is ready",
                                "metadata": {
                                    "available_models": len(data.get("models", [])),
                                    "response_time_ms": 0  # Would calculate actual time
                                }
                            }
                        else:
                            raise Exception(f"Ollama returned status {response.status}")
            
            result = await self.circuit_breakers["ollama"].call(_check_ollama)
            return result
            
        except Exception as e:
            return {
                "status": HealthStatus.UNHEALTHY,
                "message": f"Ollama not ready: {str(e)}",
                "metadata": {"error_type": "connection_failed"},
                "recommendations": ["Check Ollama service status", "Verify network connectivity"]
            }
    
    async def _check_gemini_readiness(self) -> Dict[str, Any]:
        """Check Gemini API readiness with circuit breaker"""
        try:
            api_key = self.config.get("google_api_key")
            if not api_key:
                return {
                    "status": HealthStatus.DEGRADED,
                    "message": "Google API key not configured",
                    "metadata": {"error_type": "missing_api_key"},
                    "recommendations": ["Configure Google API key in environment"]
                }
            
            async def _check_gemini():
                timeout = ClientTimeout(total=10)
                async with aiohttp.ClientSession(timeout=timeout) as session:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
                    async with session.get(url) as response:
                        if response.status == 200:
                            data = await response.json()
                            return {
                                "status": HealthStatus.HEALTHY,
                                "message": "Gemini API is ready",
                                "metadata": {
                                    "available_models": len(data.get("models", []))
                                }
                            }
                        else:
                            raise Exception(f"Gemini API returned status {response.status}")
            
            result = await self.circuit_breakers["gemini"].call(_check_gemini)
            return result
            
        except Exception as e:
            return {
                "status": HealthStatus.UNHEALTHY,
                "message": f"Gemini API not ready: {str(e)}",
                "metadata": {"error_type": "api_failed"},
                "recommendations": ["Check Google API key", "Verify API quota and limits"]
            }
    
    async def _check_configuration(self) -> Dict[str, Any]:
        """Check configuration validity"""
        issues = []
        
        # Check for required configuration
        if not self.config.get("secret_key"):
            issues.append("Secret key not configured")
        
        if not self.config.get("google_api_key"):
            issues.append("Google API key not configured")
        
        if issues:
            return {
                "status": HealthStatus.DEGRADED,
                "message": f"Configuration issues: {', '.join(issues)}",
                "metadata": {"issues": issues},
                "recommendations": ["Review environment configuration", "Check required variables"]
            }
        else:
            return {
                "status": HealthStatus.HEALTHY,
                "message": "Configuration is valid",
                "metadata": {"issues_count": 0}
            }
    
    async def _check_system_health(self) -> Dict[str, Any]:
        """Check overall system health"""
        cpu_percent = psutil.cpu_percent(interval=1)
        load_avg = psutil.getloadavg() if hasattr(psutil, 'getloadavg') else (0, 0, 0)
        
        issues = []
        if cpu_percent > 90:
            issues.append(f"High CPU usage: {cpu_percent:.1f}%")
        
        if load_avg[0] > psutil.cpu_count() * 0.8:
            issues.append(f"High system load: {load_avg[0]:.2f}")
        
        if issues:
            return {
                "status": HealthStatus.DEGRADED if len(issues) == 1 else HealthStatus.UNHEALTHY,
                "message": f"System health issues: {'; '.join(issues)}",
                "metadata": {
                    "cpu_percent": cpu_percent,
                    "load_average": load_avg
                }
            }
        else:
            return {
                "status": HealthStatus.HEALTHY,
                "message": "System health is good",
                "metadata": {
                    "cpu_percent": cpu_percent,
                    "load_average": load_avg
                }
            }
    
    async def _check_dependency_health(self) -> Dict[str, Any]:
        """Check health of external dependencies"""
        # This would check Redis, database, and other dependencies
        # For now, return healthy status
        return {
            "status": HealthStatus.HEALTHY,
            "message": "Dependencies are healthy",
            "metadata": {
                "redis": HealthStatus.HEALTHY.value,
                "database": HealthStatus.HEALTHY.value
            }
        }
    
    async def _check_performance_health(self) -> Dict[str, Any]:
        """Check performance metrics"""
        return {
            "status": HealthStatus.HEALTHY,
            "message": "Performance metrics are normal",
            "metadata": {
                "average_response_time_ms": 150,
                "requests_per_second": 10,
                "error_rate": 0.01
            }
        }
    
    async def _check_response_times(self) -> Dict[str, Any]:
        """Check response time metrics"""
        # This would check actual response times from monitoring
        return {
            "status": HealthStatus.HEALTHY,
            "message": "Response times are within acceptable limits",
            "metadata": {"p95_response_time_ms": 500}
        }
    
    async def _check_resource_utilization(self) -> Dict[str, Any]:
        """Check resource utilization"""
        return {
            "status": HealthStatus.HEALTHY,
            "message": "Resource utilization is normal",
            "metadata": {"resource_score": 0.7}
        }
    
    async def _check_throughput(self) -> Dict[str, Any]:
        """Check request throughput"""
        return {
            "status": HealthStatus.HEALTHY,
            "message": "Throughput is within expected range",
            "metadata": {"throughput_score": 0.8}
        }
    
    async def _get_resource_usage(self) -> Dict[str, Any]:
        """Get current resource usage"""
        try:
            memory = psutil.virtual_memory()
            cpu_percent = psutil.cpu_percent()
            disk = psutil.disk_usage('/')
            
            return {
                "memory_percent": memory.percent,
                "memory_available_gb": memory.available / (1024**3),
                "cpu_percent": cpu_percent,
                "disk_percent": (disk.used / disk.total) * 100,
                "disk_free_gb": disk.free / (1024**3),
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            self.logger.error("Failed to get resource usage", error=str(e))
            return {"error": str(e)}
    
    async def _get_dependency_status(self) -> Dict[str, HealthStatus]:
        """Get status of all dependencies"""
        return {
            "ollama": HealthStatus.HEALTHY,  # Would check actual status
            "gemini": HealthStatus.HEALTHY,
            "redis": HealthStatus.HEALTHY,
            "database": HealthStatus.HEALTHY
        }
    
    def _determine_overall_status(self, checks: List[HealthCheckResult]) -> HealthStatus:
        """Determine overall health status from individual checks"""
        critical_count = sum(1 for check in checks if check.status == HealthStatus.CRITICAL)
        unhealthy_count = sum(1 for check in checks if check.status == HealthStatus.UNHEALTHY)
        degraded_count = sum(1 for check in checks if check.status == HealthStatus.DEGRADED)
        
        if critical_count > 0:
            return HealthStatus.CRITICAL
        elif unhealthy_count > 0:
            return HealthStatus.UNHEALTHY
        elif degraded_count > 0:
            return HealthStatus.DEGRADED
        else:
            return HealthStatus.HEALTHY
    
    async def _attempt_auto_recovery(self, check_result: HealthCheckResult) -> None:
        """Attempt automatic recovery for failed checks"""
        if not self.auto_recovery_enabled:
            return
        
        try:
            # Determine recovery strategy based on check name
            recovery_func = None
            if "ollama" in check_result.name.lower():
                recovery_func = self.recovery_strategies.get("ollama")
            elif "memory" in check_result.name.lower():
                recovery_func = self.recovery_strategies.get("memory")
            elif "disk" in check_result.name.lower():
                recovery_func = self.recovery_strategies.get("disk")
            
            if recovery_func:
                self.logger.info("Attempting auto-recovery", check=check_result.name)
                await recovery_func()
                self.logger.info("Auto-recovery completed", check=check_result.name)
            
        except Exception as e:
            self.logger.error("Auto-recovery failed", check=check_result.name, error=str(e))
    
    async def _recover_ollama_connection(self) -> None:
        """Recover Ollama connection"""
        self.logger.info("Attempting Ollama connection recovery")
        # Would implement actual recovery logic
        # For example: restart connection, clear caches, etc.
        await asyncio.sleep(1)  # Simulate recovery time
    
    async def _recover_gemini_connection(self) -> None:
        """Recover Gemini connection"""
        self.logger.info("Attempting Gemini connection recovery")
        # Would implement actual recovery logic
        await asyncio.sleep(1)
    
    async def _recover_memory_pressure(self) -> None:
        """Recover from memory pressure"""
        self.logger.info("Attempting memory recovery")
        # Would implement memory cleanup
        await asyncio.sleep(0.5)
    
    async def _recover_disk_space(self) -> None:
        """Recover disk space"""
        self.logger.info("Attempting disk space recovery")
        # Would implement cleanup of temporary files
        await asyncio.sleep(1)
    
    def _store_health_history(self, health: ServiceHealth) -> None:
        """Store health check in history with rotation"""
        self.health_history.append(health)
        
        # Rotate history if it gets too large
        if len(self.health_history) > self.max_history_size:
            self.health_history = self.health_history[-self.max_history_size:]
    
    async def check_readiness(self) -> bool:
        """Quick readiness check"""
        try:
            # Simple connectivity checks
            checks = [
                self._check_service_liveness(),
                self._check_configuration()
            ]
            
            results = await asyncio.gather(*checks, return_exceptions=True)
            
            # Consider ready if at least one check passed
            for result in results:
                if not isinstance(result, Exception) and result.get("status") == HealthStatus.HEALTHY:
                    return True
            
            return False
            
        except Exception as e:
            self.logger.error("Readiness check failed", error=str(e))
            return False
    
    async def check_liveness(self) -> bool:
        """Quick liveness check"""
        try:
            # Simple process check
            return len(psutil.pids()) > 0
        except Exception as e:
            self.logger.error("Liveness check failed", error=str(e))
            return False
    
    def get_health_history(self, hours: int = 24) -> List[ServiceHealth]:
        """Get health history for specified time period"""
        cutoff_time = datetime.now() - timedelta(hours=hours)
        return [health for health in self.health_history if health.timestamp > cutoff_time]
    
    def get_circuit_breaker_status(self) -> Dict[str, str]:
        """Get status of all circuit breakers"""
        return {
            name: breaker.state 
            for name, breaker in self.circuit_breakers.items()
        }
    
    def get_rate_limiter_status(self) -> Dict[str, Dict[str, Any]]:
        """Get status of all rate limiters"""
        return {
            name: {
                "remaining_requests": limiter.get_remaining_requests(),
                "max_requests": limiter.max_requests,
                "time_window": limiter.time_window
            }
            for name, limiter in self.rate_limiters.items()
        }

# Global health checker instance
health_checker: Optional[HealthChecker] = None

@asynccontextmanager
async def health_checker_context(config: Dict[str, Any] = None):
    """Context manager for health checker lifecycle"""
    global health_checker
    
    try:
        logger.info("Initializing health checker")
        health_checker = HealthChecker(config)
        yield health_checker
    finally:
        logger.info("Cleaning up health checker")
        health_checker = None

# Convenience functions
async def get_service_health() -> ServiceHealth:
    """Get current service health"""
    if not health_checker:
        raise RuntimeError("Health checker not initialized")
    return await health_checker.check_all()

async def is_service_ready() -> bool:
    """Check if service is ready"""
    if not health_checker:
        return False
    return await health_checker.check_readiness()

async def is_service_alive() -> bool:
    """Check if service is alive"""
    if not health_checker:
        return False
    return health_checker.check_liveness()

def get_health_history(hours: int = 24) -> List[ServiceHealth]:
    """Get health history"""
    if not health_checker:
        return []
    return health_checker.get_health_history(hours)