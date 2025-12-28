"""
Comprehensive Logging Configuration for Local AI Orchestrator
Structured logging with error recovery and resilient state management
"""

import logging
import logging.handlers
import json
import sys
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional
from functools import wraps
import structlog
from pythonjsonlogger import jsonlogger
import asyncio
import traceback
from contextlib import contextmanager
from dataclasses import dataclass, field
from enum import Enum

class LogLevel(Enum):
    """Logging levels"""
    DEBUG = "debug"
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"

@dataclass
class LogConfig:
    """Logging configuration"""
    level: str = "INFO"
    format: str = "json"
    file_path: Optional[str] = None
    max_file_size: int = 100 * 1024 * 1024  # 100MB
    backup_count: int = 5
    enable_console: bool = True
    enable_file: bool = True
    enable_structured: bool = True
    sensitive_fields: list = field(default_factory=lambda: ["password", "token", "api_key", "secret"])
    correlation_id_header: str = "X-Correlation-ID"
    request_id_field: str = "request_id"
    user_id_field: str = "user_id"

class ResilientLogHandler(logging.Handler):
    """Logging handler with error recovery and resilient state management"""
    
    def __init__(self, config: LogConfig):
        super().__init__()
        self.config = config
        self.failure_count = 0
        self.max_failures = 10
        self.last_failure = None
        self.logger = logging.getLogger(self.__class__.__name__)
        
        # Ensure log directory exists
        if self.config.file_path:
            log_dir = Path(self.config.file_path).parent
            log_dir.mkdir(parents=True, exist_ok=True)
    
    def emit(self, record: logging.LogRecord) -> None:
        """Emit log record with error recovery"""
        try:
            # Check if we should drop the record due to repeated failures
            if self._should_drop_record():
                return
            
            # Format the record
            formatted_record = self._format_record(record)
            
            # Write to appropriate output
            if self.config.format == "json":
                self._write_json_record(formatted_record)
            else:
                self._write_plain_record(formatted_record)
            
            # Reset failure count on success
            self.failure_count = 0
            
        except Exception as e:
            self._handle_log_failure(e, record)
    
    def _should_drop_record(self) -> bool:
        """Determine if we should drop the record due to failures"""
        if self.failure_count >= self.max_failures:
            # Check if enough time has passed to retry
            if self.last_failure:
                time_since_failure = datetime.now().timestamp() - self.last_failure
                if time_since_failure < 60:  # Wait 1 minute before retrying
                    return True
                else:
                    # Reset failure count after waiting period
                    self.failure_count = 0
                    self.last_failure = None
        return False
    
    def _format_record(self, record: logging.LogRecord) -> Dict[str, Any]:
        """Format log record for output"""
        if self.config.format == "json":
            # Create structured log entry
            log_entry = {
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "level": record.levelname.lower(),
                "logger": record.name,
                "message": record.getMessage(),
                "module": record.module,
                "function": record.funcName,
                "line": record.lineno
            }
            
            # Add exception info if present
            if record.exc_info:
                log_entry["exception"] = self._format_exception(record.exc_info)
            
            # Add extra fields
            for key, value in record.__dict__.items():
                if key not in ["name", "msg", "args", "levelname", "levelno", "pathname",
                              "filename", "module", "lineno", "funcName", "created", "msecs",
                              "relativeCreated", "thread", "threadName", "processName",
                              "process", "getMessage", "exc_info", "exc_text", "stack_info"]:
                    # Sanitize sensitive fields
                    if key.lower() in [field.lower() for field in self.config.sensitive_fields]:
                        log_entry[key] = "***REDACTED***"
                    else:
                        log_entry[key] = value
            
            return log_entry
        else:
            # Plain text format
            return {
                "timestamp": datetime.utcnow().isoformat(),
                "level": record.levelname,
                "logger": record.name,
                "message": record.getMessage(),
                "location": f"{record.module}:{record.lineno}"
            }
    
    def _format_exception(self, exc_info) -> str:
        """Format exception info"""
        return "".join(traceback.format_exception(*exc_info))
    
    def _write_json_record(self, record: Dict[str, Any]) -> None:
        """Write JSON formatted record"""
        if self.config.enable_console and sys.stdout.isatty():
            print(json.dumps(record, default=str), file=sys.stdout)
        
        if self.config.enable_file and self.config.file_path:
            try:
                with open(self.config.file_path, 'a', encoding='utf-8') as f:
                    f.write(json.dumps(record, default=str) + '\n')
            except Exception:
                # Fallback to stderr if file write fails
                print(json.dumps(record, default=str), file=sys.stderr)
    
    def _write_plain_record(self, record: Dict[str, Any]) -> None:
        """Write plain text formatted record"""
        formatted = f"{record['timestamp']} [{record['level'].upper()}] {record['logger']}: {record['message']}"
        
        if self.config.enable_console:
            print(formatted, file=sys.stdout)
        
        if self.config.enable_file and self.config.file_path:
            try:
                with open(self.config.file_path, 'a', encoding='utf-8') as f:
                    f.write(formatted + '\n')
            except Exception:
                print(formatted, file=sys.stderr)
    
    def _handle_log_failure(self, error: Exception, record: logging.LogRecord) -> None:
        """Handle logging failures with resilient state management"""
        self.failure_count += 1
        self.last_failure = datetime.now().timestamp()
        
        # Try to log the failure to stderr as fallback
        try:
            fallback_message = f"LOGGING FAILURE #{self.failure_count}: {str(error)}"
            print(f"{datetime.utcnow().isoformat()} CRITICAL logging: {fallback_message}", file=sys.stderr)
            print(f"Original log: {record.getMessage()}", file=sys.stderr)
        except Exception:
            # If even stderr fails, we're in a bad state
            pass
        
        # If we've failed too many times, just give up to prevent cascading failures
        if self.failure_count >= self.max_failures:
            self.logger.critical("Logging system failure threshold exceeded", 
                               failures=self.failure_count, error=str(error))

class CorrelationIdFilter(logging.Filter):
    """Filter to add correlation IDs to log records"""
    
    def __init__(self, config: LogConfig):
        super().__init__()
        self.config = config
        self.correlation_id_context = {}
    
    def filter(self, record: logging.LogRecord) -> bool:
        """Add correlation ID to log record"""
        # Get correlation ID from context variable if available
        try:
            correlation_id = getattr(record, 'correlation_id', None)
            if correlation_id:
                record.correlation_id = correlation_id
            else:
                record.correlation_id = "no-correlation-id"
        except Exception:
            record.correlation_id = "error-correlation-id"
        
        return True

class RequestContextFilter(logging.Filter):
    """Filter to add request context to log records"""
    
    def __init__(self, config: LogConfig):
        super().__init__()
        self.config = config
    
    def filter(self, record: logging.LogRecord) -> bool:
        """Add request context to log record"""
        try:
            # Add request ID if available
            record.request_id = getattr(record, 'request_id', 'no-request-id')
            
            # Add user ID if available
            record.user_id = getattr(record, 'user_id', 'no-user-id')
            
            # Add endpoint info if available
            record.endpoint = getattr(record, 'endpoint', 'no-endpoint')
            
            # Add method info if available
            record.method = getattr(record, 'method', 'no-method')
            
        except Exception:
            pass
        
        return True

class LoggerManager:
    """Comprehensive logger manager with error recovery"""
    
    def __init__(self, config: LogConfig = None):
        self.config = config or LogConfig()
        self.logger = logging.getLogger(self.__class__.__name__)
        self._initialized = False
        self._error_count = 0
        self._max_errors = 5
        
        # Correlation ID context
        self._correlation_context = {}
        
        # Request context storage
        self._request_context = {}
    
    def initialize(self) -> None:
        """Initialize logging system with comprehensive error handling"""
        try:
            if self._initialized:
                return
            
            # Configure root logger
            root_logger = logging.getLogger()
            root_logger.setLevel(getattr(logging, self.config.level.upper()))
            
            # Clear existing handlers
            root_logger.handlers.clear()
            
            # Add our resilient handler
            handler = ResilientLogHandler(self.config)
            root_logger.addHandler(handler)
            
            # Add correlation ID filter
            correlation_filter = CorrelationIdFilter(self.config)
            root_logger.addFilter(correlation_filter)
            
            # Add request context filter
            request_filter = RequestContextFilter(self.config)
            root_logger.addFilter(request_filter)
            
            # Configure structlog if enabled
            if self.config.enable_structured:
                self._configure_structlog()
            
            # Set specific logger levels
            self._configure_logger_levels()
            
            self._initialized = True
            self.logger.info("Logging system initialized successfully")
            
        except Exception as e:
            self._handle_initialization_error(e)
    
    def _configure_structlog(self) -> None:
        """Configure structlog for structured logging"""
        try:
            structlog.configure(
                processors=[
                    structlog.stdlib.filter_by_level,
                    structlog.stdlib.add_logger_name,
                    structlog.stdlib.add_log_level,
                    structlog.stdlib.PositionalArgumentsFormatter(),
                    structlog.processors.TimeStamper(fmt="iso"),
                    structlog.processors.StackInfoRenderer(),
                    structlog.processors.format_exc_info,
                    structlog.processors.UnicodeDecoder(),
                    structlog.processors.JSONRenderer() if self.config.format == "json"
                    else structlog.dev.ConsoleRenderer()
                ],
                context_class=dict,
                logger_factory=structlog.stdlib.LoggerFactory(),
                cache_logger_on_first_use=True,
            )
        except Exception as e:
            self.logger.warning("Failed to configure structlog", error=str(e))
    
    def _configure_logger_levels(self) -> None:
        """Configure specific logger levels"""
        # Set specific logger levels for better observability
        loggers_to_configure = {
            "urllib3": logging.WARNING,
            "requests": logging.WARNING,
            "httpx": logging.WARNING,
            "aiohttp": logging.WARNING,
            "asyncio": logging.WARNING,
            "aioredis": logging.WARNING,
            "sqlalchemy": logging.WARNING,
            "alembic": logging.WARNING,
        }
        
        for logger_name, level in loggers_to_configure.items():
            logging.getLogger(logger_name).setLevel(level)
    
    def _handle_initialization_error(self, error: Exception) -> None:
        """Handle logging initialization errors"""
        self._error_count += 1
        
        # Try basic console logging as fallback
        try:
            print(f"LOGGING ERROR #{self._error_count}: {str(error)}", file=sys.stderr)
            print("Using basic logging fallback", file=sys.stderr)
            
            # Configure minimal fallback logging
            logging.basicConfig(
                level=logging.INFO,
                format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                stream=sys.stderr
            )
            
            self._initialized = True
            
        except Exception:
            # Last resort - just print to stderr
            print("CRITICAL: Logging system completely failed to initialize", file=sys.stderr)
    
    def get_logger(self, name: str) -> structlog.BoundLogger:
        """Get a logger instance"""
        if not self._initialized:
            self.initialize()
        
        return structlog.get_logger(name)
    
    @contextmanager
    def correlation_context(self, correlation_id: str):
        """Context manager for correlation ID"""
        old_correlation_id = self._correlation_context.get('current')
        self._correlation_context['current'] = correlation_id
        
        try:
            yield
        finally:
            if old_correlation_id:
                self._correlation_context['current'] = old_correlation_id
            else:
                self._correlation_context.pop('current', None)
    
    @contextmanager
    def request_context(self, request_id: str, user_id: str = None, endpoint: str = None, method: str = None):
        """Context manager for request context"""
        context = {
            'request_id': request_id,
            'user_id': user_id,
            'endpoint': endpoint,
            'method': method
        }
        
        old_context = self._request_context.get('current', {}).copy()
        self._request_context['current'] = context
        
        try:
            yield
        finally:
            if old_context:
                self._request_context['current'] = old_context
            else:
                self._request_context.pop('current', None)
    
    def get_current_correlation_id(self) -> Optional[str]:
        """Get current correlation ID"""
        return self._correlation_context.get('current')
    
    def get_current_request_context(self) -> Dict[str, Any]:
        """Get current request context"""
        return self._request_context.get('current', {})
    
    def log_structured(self, level: str, message: str, **kwargs) -> None:
        """Log structured message with error handling"""
        try:
            logger = self.get_logger("structured")
            log_method = getattr(logger, level.lower(), logger.info)
            
            # Add correlation context
            correlation_id = self.get_current_correlation_id()
            if correlation_id:
                kwargs['correlation_id'] = correlation_id
            
            # Add request context
            request_context = self.get_current_request_context()
            kwargs.update(request_context)
            
            log_method(message, **kwargs)
            
        except Exception as e:
            # Fallback to basic logging
            self.logger.error("Structured logging failed", error=str(e), message=message)
    
    def log_error_with_context(self, error: Exception, context: Dict[str, Any] = None) -> None:
        """Log error with comprehensive context"""
        try:
            logger = self.get_logger("error")
            
            error_context = {
                "error_type": type(error).__name__,
                "error_message": str(error),
                "correlation_id": self.get_current_correlation_id(),
                "request_context": self.get_current_request_context(),
            }
            
            if context:
                error_context.update(context)
            
            # Add traceback if available
            import traceback
            error_context["traceback"] = traceback.format_exc()
            
            logger.error("Application error", **error_context)
            
        except Exception as e:
            # Fallback logging
            print(f"ERROR LOGGING FAILED: {str(e)}", file=sys.stderr)
            print(f"Original error: {str(error)}", file=sys.stderr)
    
    def get_health_status(self) -> Dict[str, Any]:
        """Get logging system health status"""
        return {
            "initialized": self._initialized,
            "error_count": self._error_count,
            "max_errors": self._max_errors,
            "config": {
                "level": self.config.level,
                "format": self.config.format,
                "enable_structured": self.config.enable_structured,
                "enable_console": self.config.enable_console,
                "enable_file": self.config.enable_file
            },
            "correlation_context_active": bool(self._correlation_context),
            "request_context_active": bool(self._request_context)
        }

# Global logger manager instance
_logger_manager: Optional[LoggerManager] = None

def get_logger_manager() -> LoggerManager:
    """Get global logger manager instance"""
    global _logger_manager
    if _logger_manager is None:
        _logger_manager = LoggerManager()
    return _logger_manager

def initialize_logging(config: LogConfig = None) -> None:
    """Initialize the global logging system"""
    manager = get_logger_manager()
    if config:
        manager.config = config
    manager.initialize()

def get_logger(name: str) -> structlog.BoundLogger:
    """Get a logger instance"""
    return get_logger_manager().get_logger(name)

def log_structured(level: str, message: str, **kwargs) -> None:
    """Log structured message"""
    get_logger_manager().log_structured(level, message, **kwargs)

def log_error_with_context(error: Exception, context: Dict[str, Any] = None) -> None:
    """Log error with context"""
    get_logger_manager().log_error_with_context(error, context)

@contextmanager
def correlation_context(correlation_id: str):
    """Context manager for correlation ID"""
    yield get_logger_manager().correlation_context(correlation_id)

@contextmanager
def request_context(request_id: str, user_id: str = None, endpoint: str = None, method: str = None):
    """Context manager for request context"""
    yield get_logger_manager().request_context(request_id, user_id, endpoint, method)

def log_execution_time(func):
    """Decorator to log function execution time"""
    @wraps(func)
    async def async_wrapper(*args, **kwargs):
        start_time = time.time()
        logger = get_logger(func.__module__)
        
        try:
            result = await func(*args, **kwargs)
            execution_time = time.time() - start_time
            
            logger.info(
                "Function execution completed",
                function=func.__name__,
                execution_time_ms=execution_time * 1000,
                success=True
            )
            
            return result
            
        except Exception as e:
            execution_time = time.time() - start_time
            
            logger.error(
                "Function execution failed",
                function=func.__name__,
                execution_time_ms=execution_time * 1000,
                error=str(e),
                error_type=type(e).__name__,
                success=False
            )
            
            raise
    
    @wraps(func)
    def sync_wrapper(*args, **kwargs):
        start_time = time.time()
        logger = get_logger(func.__module__)
        
        try:
            result = func(*args, **kwargs)
            execution_time = time.time() - start_time
            
            logger.info(
                "Function execution completed",
                function=func.__name__,
                execution_time_ms=execution_time * 1000,
                success=True
            )
            
            return result
            
        except Exception as e:
            execution_time = time.time() - start_time
            
            logger.error(
                "Function execution failed",
                function=func.__name__,
                execution_time_ms=execution_time * 1000,
                error=str(e),
                error_type=type(e).__name__,
                success=False
            )
            
            raise
    
    return async_wrapper if asyncio.iscoroutinefunction(func) else sync_wrapper

# Initialize default logging
initialize_logging()