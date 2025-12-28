"""
Local AI Orchestrator - Main Application Entry Point
Production-ready implementation with robust error handling and resilient state management
"""

import asyncio
import os
import signal
import sys
import time
from contextlib import asynccontextmanager
from pathlib import Path

import structlog
import uvicorn
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST

# Import local modules with error handling
try:
    from .config import get_config_manager, get_service_config, validate_current_config
    from .health import health_checker_context, get_service_health, is_service_ready
    from .logging_config import initialize_logging, get_logger, log_error_with_context
    from .orchestrator import (
        app as orchestrator_app,
        AIOrchestrator,
        AIRequest,
        AIResponse,
        ModelStatus
    )
except ImportError as e:
    # Fallback for direct execution
    try:
        from config import get_config_manager, get_service_config, validate_current_config
        from health import health_checker_context, get_service_health, is_service_ready
        from logging_config import initialize_logging, get_logger, log_error_with_context
        from orchestrator import (
            app as orchestrator_app,
            AIOrchestrator,
            AIRequest,
            AIResponse,
            ModelStatus
        )
    except ImportError as fallback_e:
        print(f"CRITICAL: Failed to import required modules: {e}, {fallback_e}")
        sys.exit(1)

# Initialize logging system
initialize_logging()
logger = get_logger(__name__)

# Global application state
app_state = {
    "initialized": False,
    "shutdown": False,
    "start_time": None,
    "health_checker": None,
    "orchestrator": None
}

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle management with robust error handling"""
    global app_state
    
    logger.info("Starting Local AI Orchestrator application...")
    
    try:
        # Initialize configuration
        config_manager = get_config_manager()
        service_config = get_service_config()
        
        # Validate configuration
        validation_results = validate_current_config()
        if not validation_results["valid"]:
            logger.error("Configuration validation failed", 
                        errors=validation_results["errors"],
                        warnings=validation_results["warnings"])
            raise RuntimeError("Invalid configuration")
        
        # Initialize health checker
        async with health_checker_context(config_manager.config) as health_checker:
            app_state["health_checker"] = health_checker
            
            # Initialize AI orchestrator
            orchestrator = AIOrchestrator()
            app_state["orchestrator"] = orchestrator
            
            # Store start time
            app_state["start_time"] = time.time()
            app_state["initialized"] = True
            
            logger.info("Application startup completed successfully",
                       service_config=service_config.__dict__,
                       validation_results=validation_results)
            
            yield
            
    except Exception as e:
        logger.error("Application startup failed", error=str(e))
        log_error_with_context(e, {"phase": "startup"})
        raise
    
    finally:
        logger.info("Shutting down Local AI Orchestrator application...")
        app_state["shutdown"] = True
        
        try:
            # Perform cleanup
            if app_state["health_checker"]:
                logger.info("Cleaning up health checker")
            
            if app_state["orchestrator"]:
                logger.info("Cleaning up orchestrator")
            
            logger.info("Application shutdown completed")
            
        except Exception as e:
            logger.error("Error during shutdown", error=str(e))

# Create main FastAPI application
app = FastAPI(
    title="Local AI Orchestrator",
    description="Production-ready hybrid AI orchestration service with Ollama and Gemini 2 Flash integration",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add CORS middleware
@app.middleware("http")
async def cors_middleware(request: Request, call_next):
    """CORS middleware with error handling"""
    try:
        response = await call_next(request)
        
        # Add CORS headers
        origin = request.headers.get("origin")
        if origin:
            response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization"
        
        return response
        
    except Exception as e:
        logger.error("CORS middleware error", error=str(e))
        return JSONResponse(
            status_code=500,
            content={"detail": "CORS processing failed"}
        )

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with service information"""
    return {
        "service": "Local AI Orchestrator",
        "version": "1.0.0",
        "status": "running",
        "timestamp": time.time(),
        "uptime_seconds": time.time() - app_state["start_time"] if app_state["start_time"] else 0,
        "endpoints": {
            "health": "/health",
            "ready": "/ready",
            "live": "/live",
            "status": "/status",
            "models": "/models",
            "generate": "/generate",
            "metrics": "/metrics",
            "docs": "/docs"
        }
    }

# Health check endpoints
@app.get("/health")
async def health_check():
    """Comprehensive health check endpoint"""
    try:
        if not app_state["initialized"]:
            return JSONResponse(
                status_code=503,
                content={"status": "not_initialized", "error": "Service not ready"}
            )
        
        # Get health from health checker
        if app_state["health_checker"]:
            health = await get_service_health()
            status_code = 200 if health.status.value in ["healthy", "degraded"] else 503
            
            return JSONResponse(
                status_code=status_code,
                content={
                    "status": health.status.value,
                    "timestamp": health.timestamp.isoformat(),
                    "uptime_seconds": health.uptime_seconds,
                    "version": health.version,
                    "checks": [
                        {
                            "name": check.name,
                            "status": check.status.value,
                            "message": check.message,
                            "duration_ms": check.duration_ms
                        }
                        for check in health.checks
                    ],
                    "resource_usage": health.resource_usage,
                    "dependencies": {k: v.value for k, v in health.dependencies.items()}
                }
            )
        else:
            return JSONResponse(
                status_code=503,
                content={"status": "health_checker_not_available"}
            )
            
    except Exception as e:
        logger.error("Health check failed", error=str(e))
        return JSONResponse(
            status_code=500,
            content={"status": "error", "error": str(e)}
        )

@app.get("/ready")
async def readiness_check():
    """Readiness check for Kubernetes/Docker health checks"""
    try:
        if not app_state["initialized"]:
            return JSONResponse(
                status_code=503,
                content={"ready": False, "reason": "Service not initialized"}
            )
        
        # Quick readiness check
        ready = await is_service_ready()
        
        if ready:
            return JSONResponse(
                status_code=200,
                content={"ready": True, "timestamp": time.time()}
            )
        else:
            return JSONResponse(
                status_code=503,
                content={"ready": False, "reason": "Service not ready"}
            )
            
    except Exception as e:
        logger.error("Readiness check failed", error=str(e))
        return JSONResponse(
            status_code=500,
            content={"ready": False, "error": str(e)}
        )

@app.get("/live")
async def liveness_check():
    """Liveness check for Kubernetes/Docker health checks"""
    try:
        if app_state["shutdown"]:
            return JSONResponse(
                status_code=503,
                content={"alive": False, "reason": "Service shutting down"}
            )
        
        return JSONResponse(
            status_code=200,
            content={"alive": True, "timestamp": time.time()}
        )
        
    except Exception as e:
        logger.error("Liveness check failed", error=str(e))
        return JSONResponse(
            status_code=500,
            content={"alive": False, "error": str(e)}
        )

# Service status endpoint
@app.get("/status")
async def service_status():
    """Detailed service status endpoint"""
    try:
        if not app_state["initialized"]:
            return JSONResponse(
                status_code=503,
                content={"status": "not_initialized"}
            )
        
        # Get orchestrator status
        orchestrator = app_state["orchestrator"]
        if orchestrator:
            model_statuses = await orchestrator.get_all_model_status()
            
            return {
                "status": "operational",
                "timestamp": time.time(),
                "uptime_seconds": time.time() - app_state["start_time"],
                "version": "1.0.0",
                "models": [
                    {
                        "model": status.model,
                        "provider": status.provider,
                        "status": status.status,
                        "available": status.available
                    }
                    for status in model_statuses
                ],
                "orchestrator": {
                    "providers": list(orchestrator.providers.keys()),
                    "strategies": list(orchestrator.strategies.keys())
                }
            }
        else:
            return JSONResponse(
                status_code=503,
                content={"status": "orchestrator_not_available"}
            )
            
    except Exception as e:
        logger.error("Status check failed", error=str(e))
        return JSONResponse(
            status_code=500,
            content={"status": "error", "error": str(e)}
        )

# Metrics endpoint for Prometheus
@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    try:
        return Response(
            generate_latest(),
            media_type=CONTENT_TYPE_LATEST,
            headers={"Cache-Control": "no-store"}
        )
    except Exception as e:
        logger.error("Metrics generation failed", error=str(e))
        return JSONResponse(
            status_code=500,
            content={"error": "Failed to generate metrics"}
        )

# Configuration validation endpoint
@app.get("/config/validate")
async def validate_config():
    """Configuration validation endpoint"""
    try:
        validation_results = validate_current_config()
        return validation_results
    except Exception as e:
        logger.error("Configuration validation failed", error=str(e))
        return JSONResponse(
            status_code=500,
            content={"valid": False, "error": str(e)}
        )

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Custom HTTP exception handler with logging"""
    logger.warning(
        "HTTP exception occurred",
        path=request.url.path,
        method=request.method,
        status_code=exc.status_code,
        detail=exc.detail
    )
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "type": "http_exception",
                "status_code": exc.status_code,
                "detail": exc.detail,
                "path": str(request.url.path),
                "method": request.method
            }
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """General exception handler with comprehensive logging"""
    logger.error(
        "Unhandled exception occurred",
        error=str(exc),
        error_type=type(exc).__name__,
        path=request.url.path,
        method=request.method,
        exc_info=True
    )
    
    log_error_with_context(exc, {
        "path": str(request.url.path),
        "method": request.method
    })
    
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "type": "internal_server_error",
                "message": "An internal error occurred",
                "error_id": f"ERR-{int(time.time())}"
            }
        }
    )

# Signal handlers for graceful shutdown
def signal_handler(signum, frame):
    """Handle shutdown signals gracefully"""
    logger.info(f"Received signal {signum}, initiating graceful shutdown...")
    app_state["shutdown"] = True
    
    # Set an event to signal shutdown completion
    if hasattr(signal_handler, 'shutdown_event'):
        signal_handler.shutdown_event.set()

# Register signal handlers
signal_handler.shutdown_event = asyncio.Event()
signal.signal(signal.SIGTERM, signal_handler)
signal.signal(signal.SIGINT, signal_handler)

async def run_with_graceful_shutdown():
    """Run application with graceful shutdown handling"""
    config = get_service_config()
    
    # Configure uvicorn
    server_config = uvicorn.Config(
        app,
        host=config.host,
        port=config.port,
        log_level=config.log_level.lower(),
        access_log=True,
        loop="auto",
        reload=False,  # Disable reload in production
        workers=1 if config.environment == "production" else 1
    )
    
    server = uvicorn.Server(server_config)
    
    try:
        # Start server
        logger.info("Starting server", host=config.host, port=config.port, environment=config.environment)
        await server.serve()
        
    except KeyboardInterrupt:
        logger.info("Received keyboard interrupt")
    except Exception as e:
        logger.error("Server error", error=str(e))
        raise
    finally:
        logger.info("Server shutting down...")
        # Wait for graceful shutdown
        try:
            await asyncio.wait_for(signal_handler.shutdown_event.wait(), timeout=30.0)
        except asyncio.TimeoutError:
            logger.warning("Graceful shutdown timeout, forcing exit")
        
        logger.info("Server shutdown complete")

def main():
    """Main entry point"""
    try:
        # Set environment variables
        os.environ.setdefault("PYTHONPATH", str(Path(__file__).parent.parent))
        
        # Run application
        asyncio.run(run_with_graceful_shutdown())
        
    except KeyboardInterrupt:
        logger.info("Application interrupted by user")
        sys.exit(0)
    except Exception as e:
        logger.error("Application failed to start", error=str(e))
        log_error_with_context(e, {"phase": "main"})
        sys.exit(1)

if __name__ == "__main__":
    main()