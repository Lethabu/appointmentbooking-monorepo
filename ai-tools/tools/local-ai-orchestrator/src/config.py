"""
Configuration Management for Local AI Orchestrator
Robust configuration handling with error recovery and validation
"""

import os
import json
import logging
from typing import Dict, Any, Optional, List
from pathlib import Path
from dataclasses import dataclass, field
from functools import lru_cache
import structlog

# Setup structured logging for config module
logger = structlog.get_logger(__name__)

@dataclass
class AIProviderConfig:
    """Configuration for AI providers"""
    name: str
    endpoint: str
    timeout: int = 60
    max_retries: int = 3
    rate_limit_per_minute: int = 60
    rate_limit_per_hour: int = 1000
    enabled: bool = True
    priority: int = 1
    max_concurrent: int = 5
    health_check_interval: int = 30

@dataclass
class ModelConfig:
    """Configuration for AI models"""
    name: str
    provider: str
    context_length: int
    max_tokens: int
    memory_requirement_gb: float
    cpu_requirement: int
    temperature_range: tuple = (0.0, 2.0)
    enabled: bool = True
    priority: int = 1
    cost_per_token: float = 0.0

@dataclass
class ServiceConfig:
    """Main service configuration"""
    environment: str = "production"
    port: int = 8004
    host: str = "0.0.0.0"
    workers: int = 1
    log_level: str = "info"
    log_format: str = "json"
    cors_origins: List[str] = field(default_factory=lambda: ["*"])
    rate_limit_per_minute: int = 60
    rate_limit_per_hour: int = 1000
    request_timeout: int = 300
    max_concurrent_requests: int = 10
    health_check_interval: int = 30
    secret_key: str = ""
    allowed_hosts: List[str] = field(default_factory=lambda: ["localhost", "127.0.0.1"])

@dataclass
class MonitoringConfig:
    """Monitoring and observability configuration"""
    sentry_dsn: str = ""
    sentry_environment: str = "production"
    sentry_traces_sample_rate: float = 0.1
    prometheus_port: int = 9090
    metrics_enabled: bool = True
    health_endpoint_enabled: bool = True
    detailed_metrics: bool = True

@dataclass
class SecurityConfig:
    """Security configuration"""
    enable_auth: bool = False
    enable_rate_limiting: bool = True
    enable_cors: bool = True
    enable_https_only: bool = False
    session_timeout: int = 3600
    api_key_required: bool = False
    allowed_ip_ranges: List[str] = field(default_factory=list)

class ConfigManager:
    """Robust configuration manager with error recovery"""
    
    def __init__(self, config_dir: Optional[str] = None):
        self.config_dir = Path(config_dir or os.getenv("CONFIG_DIR", "/app/config"))
        self.config_file = self.config_dir / "orchestrator.json"
        self.logger = logger.bind(component="config_manager")
        
        # Ensure config directory exists
        self.config_dir.mkdir(parents=True, exist_ok=True)
        
        # Initialize configuration
        self._service_config = None
        self._provider_configs = {}
        self._model_configs = {}
        self._monitoring_config = None
        self._security_config = None
        
        # Load configuration with error recovery
        self._load_configuration()
    
    def _load_configuration(self) -> None:
        """Load configuration with comprehensive error handling"""
        try:
            if self.config_file.exists():
                with open(self.config_file, 'r') as f:
                    config_data = json.load(f)
                
                self._load_from_dict(config_data)
                self.logger.info("Configuration loaded from file", config_file=str(self.config_file))
            else:
                self.logger.info("Configuration file not found, using defaults")
                self._load_defaults()
                
        except json.JSONDecodeError as e:
            self.logger.error("Invalid JSON in configuration file", error=str(e))
            self._load_defaults()
            
        except Exception as e:
            self.logger.error("Failed to load configuration", error=str(e))
            self._load_defaults()
    
    def _load_from_dict(self, config_data: Dict[str, Any]) -> None:
        """Load configuration from dictionary"""
        try:
            # Service configuration
            service_data = config_data.get("service", {})
            self._service_config = ServiceConfig(**service_data)
            
            # Provider configurations
            provider_data = config_data.get("providers", {})
            for name, data in provider_data.items():
                self._provider_configs[name] = AIProviderConfig(name=name, **data)
            
            # Model configurations
            model_data = config_data.get("models", {})
            for name, data in model_data.items():
                self._model_configs[name] = ModelConfig(name=name, **data)
            
            # Monitoring configuration
            monitoring_data = config_data.get("monitoring", {})
            self._monitoring_config = MonitoringConfig(**monitoring_data)
            
            # Security configuration
            security_data = config_data.get("security", {})
            self._security_config = SecurityConfig(**security_data)
            
        except Exception as e:
            self.logger.error("Failed to parse configuration data", error=str(e))
            self._load_defaults()
    
    def _load_defaults(self) -> None:
        """Load default configuration with robust fallbacks"""
        try:
            # Default service configuration
            self._service_config = ServiceConfig(
                environment=os.getenv("ENVIRONMENT", "production"),
                port=int(os.getenv("PORT", "8004")),
                host=os.getenv("HOST", "0.0.0.0"),
                log_level=os.getenv("LOG_LEVEL", "info"),
                cors_origins=os.getenv("CORS_ORIGINS", "*").split(","),
                secret_key=os.getenv("SECRET_KEY", "default-secret-key-change-in-production")
            )
            
            # Default provider configurations
            self._provider_configs = {
                "ollama": AIProviderConfig(
                    name="ollama",
                    endpoint=os.getenv("OLLAMA_ENDPOINT", "http://ollama:11434"),
                    timeout=int(os.getenv("OLLAMA_TIMEOUT", "300")),
                    enabled=True,
                    priority=1
                ),
                "gemini": AIProviderConfig(
                    name="gemini",
                    endpoint="https://generativelanguage.googleapis.com/v1beta",
                    timeout=int(os.getenv("GEMINI_TIMEOUT", "60")),
                    enabled=bool(os.getenv("GOOGLE_API_KEY")),
                    priority=2
                )
            }
            
            # Default model configurations
            self._model_configs = {
                "llama2": ModelConfig(
                    name="llama2",
                    provider="ollama",
                    context_length=4096,
                    max_tokens=2048,
                    memory_requirement_gb=4.0,
                    cpu_requirement=4,
                    priority=1
                ),
                "phi3": ModelConfig(
                    name="phi3",
                    provider="ollama",
                    context_length=128000,
                    max_tokens=4096,
                    memory_requirement_gb=2.0,
                    cpu_requirement=2,
                    priority=1
                ),
                "gemini-2-flash": ModelConfig(
                    name="gemini-2-flash",
                    provider="gemini",
                    context_length=1048576,
                    max_tokens=8192,
                    memory_requirement_gb=0.0,
                    cpu_requirement=0,
                    priority=2,
                    cost_per_token=0.001
                )
            }
            
            # Default monitoring configuration
            self._monitoring_config = MonitoringConfig(
                sentry_dsn=os.getenv("SENTRY_DSN", ""),
                sentry_environment=os.getenv("ENVIRONMENT", "production"),
                prometheus_port=int(os.getenv("PROMETHEUS_PORT", "9090"))
            )
            
            # Default security configuration
            self._security_config = SecurityConfig(
                enable_rate_limiting=os.getenv("ENABLE_RATE_LIMITING", "true").lower() == "true",
                enable_cors=os.getenv("ENABLE_CORS", "true").lower() == "true"
            )
            
            self.logger.info("Default configuration loaded")
            
        except Exception as e:
            self.logger.error("Failed to load default configuration", error=str(e))
            # Use minimal fallback configuration
            self._service_config = ServiceConfig()
            self._provider_configs = {}
            self._model_configs = {}
            self._monitoring_config = MonitoringConfig()
            self._security_config = SecurityConfig()
    
    def save_configuration(self) -> bool:
        """Save current configuration to file with error handling"""
        try:
            config_data = {
                "service": self._service_config.__dict__,
                "providers": {name: config.__dict__ for name, config in self._provider_configs.items()},
                "models": {name: config.__dict__ for name, config in self._model_configs.items()},
                "monitoring": self._monitoring_config.__dict__,
                "security": self._security_config.__dict__
            }
            
            # Create backup of existing configuration
            if self.config_file.exists():
                backup_file = self.config_file.with_suffix(".json.backup")
                self.config_file.rename(backup_file)
                self.logger.info("Configuration backed up", backup_file=str(backup_file))
            
            # Write new configuration
            with open(self.config_file, 'w') as f:
                json.dump(config_data, f, indent=2)
            
            self.logger.info("Configuration saved", config_file=str(self.config_file))
            return True
            
        except Exception as e:
            self.logger.error("Failed to save configuration", error=str(e))
            return False
    
    @property
    def service(self) -> ServiceConfig:
        """Get service configuration with error recovery"""
        if self._service_config is None:
            self._load_configuration()
        return self._service_config
    
    @property
    def providers(self) -> Dict[str, AIProviderConfig]:
        """Get provider configurations with error recovery"""
        if not self._provider_configs:
            self._load_configuration()
        return self._provider_configs
    
    @property
    def models(self) -> Dict[str, ModelConfig]:
        """Get model configurations with error recovery"""
        if not self._model_configs:
            self._load_configuration()
        return self._model_configs
    
    @property
    def monitoring(self) -> MonitoringConfig:
        """Get monitoring configuration with error recovery"""
        if self._monitoring_config is None:
            self._load_configuration()
        return self._monitoring_config
    
    @property
    def security(self) -> SecurityConfig:
        """Get security configuration with error recovery"""
        if self._security_config is None:
            self._load_configuration()
        return self._security_config
    
    def get_provider_config(self, provider_name: str) -> Optional[AIProviderConfig]:
        """Get specific provider configuration with error handling"""
        try:
            return self.providers.get(provider_name)
        except Exception as e:
            self.logger.error("Failed to get provider config", provider=provider_name, error=str(e))
            return None
    
    def get_model_config(self, model_name: str) -> Optional[ModelConfig]:
        """Get specific model configuration with error handling"""
        try:
            return self.models.get(model_name)
        except Exception as e:
            self.logger.error("Failed to get model config", model=model_name, error=str(e))
            return None
    
    def update_provider_config(self, provider_name: str, config: AIProviderConfig) -> bool:
        """Update provider configuration with validation"""
        try:
            if not isinstance(config, AIProviderConfig):
                raise ValueError("Invalid provider configuration")
            
            self._provider_configs[provider_name] = config
            self.logger.info("Provider configuration updated", provider=provider_name)
            return self.save_configuration()
            
        except Exception as e:
            self.logger.error("Failed to update provider config", provider=provider_name, error=str(e))
            return False
    
    def update_model_config(self, model_name: str, config: ModelConfig) -> bool:
        """Update model configuration with validation"""
        try:
            if not isinstance(config, ModelConfig):
                raise ValueError("Invalid model configuration")
            
            self._model_configs[model_name] = config
            self.logger.info("Model configuration updated", model=model_name)
            return self.save_configuration()
            
        except Exception as e:
            self.logger.error("Failed to update model config", model=model_name, error=str(e))
            return False
    
    def validate_configuration(self) -> Dict[str, Any]:
        """Validate current configuration and return validation results"""
        validation_results = {
            "valid": True,
            "errors": [],
            "warnings": [],
            "recommendations": []
        }
        
        try:
            # Validate service configuration
            if self._service_config:
                if not self._service_config.secret_key or self._service_config.secret_key == "default-secret-key-change-in-production":
                    validation_results["warnings"].append("Using default secret key - change in production")
                
                if self._service_config.environment == "production" and not self._service_config.allowed_hosts:
                    validation_results["errors"].append("No allowed hosts configured for production")
            
            # Validate provider configurations
            enabled_providers = [name for name, config in self._provider_configs.items() if config.enabled]
            if not enabled_providers:
                validation_results["errors"].append("No enabled AI providers configured")
            
            # Validate model configurations
            enabled_models = [name for name, config in self._model_configs.items() if config.enabled]
            if not enabled_models:
                validation_results["errors"].append("No enabled AI models configured")
            
            # Check for resource requirements
            for name, config in self._model_configs.items():
                if config.memory_requirement_gb > 8:
                    validation_results["recommendations"].append(f"Model {name} requires high memory ({config.memory_requirement_gb}GB)")
            
            # Set overall validation status
            if validation_results["errors"]:
                validation_results["valid"] = False
            
        except Exception as e:
            validation_results["valid"] = False
            validation_results["errors"].append(f"Validation failed: {str(e)}")
        
        return validation_results
    
    def get_resource_requirements(self) -> Dict[str, Any]:
        """Calculate total resource requirements for all enabled models"""
        try:
            total_memory = 0.0
            total_cpu = 0
            enabled_models = []
            
            for name, config in self._model_configs.items():
                if config.enabled:
                    total_memory += config.memory_requirement_gb
                    total_cpu += config.cpu_requirement
                    enabled_models.append(name)
            
            return {
                "total_memory_gb": total_memory,
                "total_cpu_cores": total_cpu,
                "enabled_models": enabled_models,
                "model_count": len(enabled_models)
            }
            
        except Exception as e:
            self.logger.error("Failed to calculate resource requirements", error=str(e))
            return {
                "total_memory_gb": 0.0,
                "total_cpu_cores": 0,
                "enabled_models": [],
                "model_count": 0
            }

@lru_cache(maxsize=1)
def get_config_manager() -> ConfigManager:
    """Get singleton config manager instance"""
    return ConfigManager()

# Global config manager instance
config_manager: ConfigManager = get_config_manager()

# Convenience functions for accessing configuration
def get_service_config() -> ServiceConfig:
    """Get service configuration"""
    return config_manager.service

def get_provider_configs() -> Dict[str, AIProviderConfig]:
    """Get all provider configurations"""
    return config_manager.providers

def get_model_configs() -> Dict[str, ModelConfig]:
    """Get all model configurations"""
    return config_manager.models

def get_monitoring_config() -> MonitoringConfig:
    """Get monitoring configuration"""
    return config_manager.monitoring

def get_security_config() -> SecurityConfig:
    """Get security configuration"""
    return config_manager.security

def validate_current_config() -> Dict[str, Any]:
    """Validate current configuration"""
    return config_manager.validate_configuration()