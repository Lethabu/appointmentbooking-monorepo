"""
Local AI Orchestrator - Production Implementation
Hybrid AI orchestration service with Ollama and Gemini 2 Flash integration
"""

import asyncio
import json
import logging
import os
import time
import uuid
from datetime import datetime
from typing import Dict, List, Optional, Union, Any, AsyncGenerator
from pathlib import Path

import httpx
import structlog
from fastapi import FastAPI, HTTPException, BackgroundTasks, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse, JSONResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.logging import LoggingIntegration
import uvicorn
from contextlib import asynccontextmanager
from tenacity import retry, stop_after_attempt, wait_exponential

# Initialize Sentry for error tracking
sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN", ""),
    integrations=[
        FastApiIntegration(auto_enabling=True),
        LoggingIntegration(
            level=logging.INFO,
            event_level=logging.ERROR,
        ),
    ],
    traces_sample_rate=0.1,
    environment=os.getenv("ENVIRONMENT", "production"),
    release="local-ai-orchestrator@1.0.0"
)

# Prometheus metrics
LOCAL_AI_REQUESTS = Counter('local_ai_requests_total', 'Total AI requests', ['model', 'provider'])
AI_PROCESSING_TIME = Histogram('ai_processing_seconds', 'Time spent processing AI requests', ['model', 'provider'])
AI_ERRORS = Counter('ai_errors_total', 'Total AI errors', ['model', 'provider', 'error_type'])
MODEL_USAGE = Gauge('ai_model_usage_active', 'Active model usage count', ['model', 'provider'])
ACTIVE_CONNECTIONS = Gauge('active_websocket_connections', 'Active WebSocket connections')

# Setup structured logging
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
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# AI Model configurations
AI_MODELS = {
    "ollama": {
        "llama2": {
            "name": "llama2",
            "provider": "ollama",
            "description": "Meta's Llama 2 model",
            "context_length": 4096,
            "max_tokens": 2048,
            "memory_requirement_gb": 4,
            "cpu_requirement": 4,
            "endpoint": "http://ollama:11434/api/generate"
        },
        "codellama": {
            "name": "codellama",
            "provider": "ollama",
            "description": "Code-specialized Llama model",
            "context_length": 16384,
            "max_tokens": 4096,
            "memory_requirement_gb": 8,
            "cpu_requirement": 6,
            "endpoint": "http://ollama:11434/api/generate"
        },
        "mistral": {
            "name": "mistral",
            "provider": "ollama",
            "description": "Mistral 7B instruction-tuned model",
            "context_length": 32768,
            "max_tokens": 4096,
            "memory_requirement_gb": 4,
            "cpu_requirement": 4,
            "endpoint": "http://ollama:11434/api/generate"
        },
        "phi3": {
            "name": "phi3",
            "provider": "ollama",
            "description": "Microsoft Phi-3 Mini model",
            "context_length": 128000,
            "max_tokens": 4096,
            "memory_requirement_gb": 2,
            "cpu_requirement": 2,
            "endpoint": "http://ollama:11434/api/generate"
        }
    },
    "gemini": {
        "gemini-2-flash": {
            "name": "gemini-2-flash",
            "provider": "gemini",
            "description": "Google Gemini 2 Flash - Latest fast model",
            "context_length": 1_048_576,  # 1M tokens
            "max_tokens": 8192,
            "memory_requirement_gb": 0,
            "cpu_requirement": 0,
            "endpoint": "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"
        },
        "gemini-pro": {
            "name": "gemini-pro",
            "provider": "gemini",
            "description": "Google Gemini Pro - Balanced performance",
            "context_length": 32768,
            "max_tokens": 4096,
            "memory_requirement_gb": 0,
            "cpu_requirement": 0,
            "endpoint": "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
        }
    }
}

class AIRequest(BaseModel):
    prompt: str
    model: str = Field(..., description="AI model to use")
    provider: str = Field(..., description="AI provider: 'ollama' or 'gemini'")
    max_tokens: Optional[int] = None
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    stream: bool = Field(default=False)
    system_prompt: Optional[str] = None
    context: Optional[str] = None
    priority: str = Field(default="normal", description="Priority: low, normal, high")

class AIResponse(BaseModel):
    response: str
    model: str
    provider: str
    tokens_used: int
    processing_time: float
    timestamp: datetime
    request_id: str
    confidence_score: Optional[float] = None

class ModelStatus(BaseModel):
    model: str
    provider: str
    status: str  # online, offline, loading, error
    available: bool
    memory_usage: Optional[float] = None
    cpu_usage: Optional[float] = None
    last_used: Optional[datetime] = None
    total_requests: int = 0

class AIProvider:
    """Base class for AI providers"""
    
    def __init__(self, name: str):
        self.name = name
        self.logger = logger.bind(provider=name)
    
    async def generate(self, request: AIRequest) -> AIResponse:
        raise NotImplementedError
    
    async def get_status(self) -> ModelStatus:
        raise NotImplementedError

class OllamaProvider(AIProvider):
    """Ollama local AI provider"""
    
    def __init__(self):
        super().__init__("ollama")
        self.base_url = "http://ollama:11434"
    
    async def generate(self, request: AIRequest) -> AIResponse:
        start_time = time.time()
        request_id = str(uuid.uuid4())
        
        try:
            # Prepare the prompt
            full_prompt = request.prompt
            if request.system_prompt:
                full_prompt = f"System: {request.system_prompt}\n\nHuman: {full_prompt}\n\nAssistant:"
            
            # Ollama API request
            payload = {
                "model": request.model,
                "prompt": full_prompt,
                "stream": request.stream,
                "options": {
                    "temperature": request.temperature,
                    "num_predict": request.max_tokens or AI_MODELS["ollama"][request.model]["max_tokens"]
                }
            }
            
            async with httpx.AsyncClient(timeout=300.0) as client:
                response = await client.post(
                    f"{self.base_url}/api/generate",
                    json=payload
                )
                response.raise_for_status()
                
                if request.stream:
                    return await self._handle_streaming_response(response, request, start_time, request_id)
                else:
                    result = response.json()
                    processing_time = time.time() - start_time
                    
                    return AIResponse(
                        response=result.get("response", ""),
                        model=request.model,
                        provider="ollama",
                        tokens_used=result.get("eval_count", 0),
                        processing_time=processing_time,
                        timestamp=datetime.now(),
                        request_id=request_id
                    )
                    
        except Exception as e:
            self.logger.error("Ollama generation failed", error=str(e), request_id=request_id)
            AI_ERRORS.labels(model=request.model, provider="ollama", error_type="generation_failed").inc()
            raise HTTPException(status_code=500, detail=f"Ollama generation failed: {str(e)}")
    
    async def _handle_streaming_response(self, response, request: AIRequest, start_time: float, request_id: str) -> AIResponse:
        """Handle streaming response from Ollama"""
        content = ""
        token_count = 0
        
        async for line in response.aiter_lines():
            if line:
                try:
                    data = json.loads(line)
                    if "response" in data:
                        content += data["response"]
                    if "eval_count" in data:
                        token_count = data["eval_count"]
                except json.JSONDecodeError:
                    continue
        
        processing_time = time.time() - start_time
        
        return AIResponse(
            response=content,
            model=request.model,
            provider="ollama",
            tokens_used=token_count,
            processing_time=processing_time,
            timestamp=datetime.now(),
            request_id=request_id
        )
    
    async def get_status(self) -> List[ModelStatus]:
        """Get status of all Ollama models"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                response.raise_for_status()
                data = response.json()
                
                statuses = []
                for model_info in data.get("models", []):
                    model_name = model_info["name"]
                    
                    # Check if model is in our config
                    if model_name in AI_MODELS["ollama"]:
                        statuses.append(ModelStatus(
                            model=model_name,
                            provider="ollama",
                            status="online",
                            available=True,
                            total_requests=0  # Would track this in production
                        ))
                
                return statuses
                
        except Exception as e:
            self.logger.error("Failed to get Ollama status", error=str(e))
            return []

class GeminiProvider(AIProvider):
    """Gemini cloud AI provider"""
    
    def __init__(self):
        super().__init__("gemini")
        self.api_key = os.getenv("GOOGLE_API_KEY")
        self.base_url = "https://generativelanguage.googleapis.com/v1beta"
    
    async def generate(self, request: AIRequest) -> AIResponse:
        start_time = time.time()
        request_id = str(uuid.uuid4())
        
        if not self.api_key:
            raise HTTPException(status_code=500, detail="Google API key not configured")
        
        try:
            # Prepare the prompt
            full_prompt = request.prompt
            if request.system_prompt:
                full_prompt = f"System: {request.system_prompt}\n\nUser: {full_prompt}"
            
            # Gemini API request
            payload = {
                "contents": [{
                    "parts": [{"text": full_prompt}]
                }],
                "generationConfig": {
                    "temperature": request.temperature,
                    "maxOutputTokens": request.max_tokens or AI_MODELS["gemini"][request.model]["max_tokens"]
                }
            }
            
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"{self.base_url}/models/{request.model}:generateContent?key={self.api_key}",
                    json=payload,
                    headers={"Content-Type": "application/json"}
                )
                response.raise_for_status()
                
                result = response.json()
                processing_time = time.time() - start_time
                
                # Extract response text
                response_text = ""
                tokens_used = 0
                
                if "candidates" in result and result["candidates"]:
                    candidate = result["candidates"][0]
                    if "content" in candidate and "parts" in candidate["content"]:
                        for part in candidate["content"]["parts"]:
                            if "text" in part:
                                response_text += part["text"]
                
                # Get usage metadata
                if "usageMetadata" in result:
                    tokens_used = result["usageMetadata"].get("totalTokenCount", 0)
                
                return AIResponse(
                    response=response_text,
                    model=request.model,
                    provider="gemini",
                    tokens_used=tokens_used,
                    processing_time=processing_time,
                    timestamp=datetime.now(),
                    request_id=request_id
                )
                
        except Exception as e:
            self.logger.error("Gemini generation failed", error=str(e), request_id=request_id)
            AI_ERRORS.labels(model=request.model, provider="gemini", error_type="generation_failed").inc()
            raise HTTPException(status_code=500, detail=f"Gemini generation failed: {str(e)}")
    
    async def get_status(self) -> List[ModelStatus]:
        """Get status of Gemini models"""
        if not self.api_key:
            return []
        
        try:
            statuses = []
            for model_name, config in AI_MODELS["gemini"].items():
                statuses.append(ModelStatus(
                    model=model_name,
                    provider="gemini",
                    status="online",
                    available=True,
                    total_requests=0
                ))
            return statuses
            
        except Exception as e:
            self.logger.error("Failed to get Gemini status", error=str(e))
            return []

class AIOrchestrator:
    """Main AI orchestration service"""
    
    def __init__(self):
        self.providers = {
            "ollama": OllamaProvider(),
            "gemini": GeminiProvider()
        }
        self.logger = logger.bind(component="ai_orchestrator")
        
        # Model selection strategies
        self.strategies = {
            "fastest": self._select_fastest_model,
            "highest_quality": self._select_highest_quality_model,
            "cost_optimized": self._select_cost_optimized_model,
            "auto": self._select_auto_model
        }
    
    async def generate_response(self, request: AIRequest) -> AIResponse:
        """Generate AI response using specified or optimal model"""
        start_time = time.time()
        
        # Update metrics
        LOCAL_AI_REQUESTS.labels(model=request.model, provider=request.provider).inc()
        MODEL_USAGE.labels(model=request.model, provider=request.provider).inc()
        
        try:
            # Get provider
            provider = self.providers.get(request.provider)
            if not provider:
                raise HTTPException(status_code=400, detail=f"Unsupported provider: {request.provider}")
            
            # Validate model
            if request.model not in AI_MODELS.get(request.provider, {}):
                raise HTTPException(status_code=400, detail=f"Model {request.model} not available for provider {request.provider}")
            
            # Generate response
            response = await provider.generate(request)
            
            # Update processing time metric
            processing_time = time.time() - start_time
            AI_PROCESSING_TIME.labels(model=request.model, provider=request.provider).observe(processing_time)
            
            self.logger.info(
                "AI response generated",
                model=request.model,
                provider=request.provider,
                processing_time=processing_time,
                request_id=response.request_id
            )
            
            return response
            
        except Exception as e:
            self.logger.error("AI generation failed", error=str(e))
            raise
        finally:
            MODEL_USAGE.labels(model=request.model, provider=request.provider).dec()
    
    async def auto_select_model(self, request: AIRequest, strategy: str = "auto") -> AIRequest:
        """Automatically select the best model based on strategy"""
        selected_model = await self.strategies[strategy](request)
        
        if selected_model:
            request.model = selected_model["name"]
            request.provider = selected_model["provider"]
        
        return request
    
    async def _select_fastest_model(self, request: AIRequest) -> Optional[Dict]:
        """Select the fastest available model"""
        for provider_name, provider in self.providers.items():
            statuses = await provider.get_status()
            for status in statuses:
                if status.available:
                    model_config = AI_MODELS[provider_name].get(status.model)
                    if model_config:
                        return {
                            "name": status.model,
                            "provider": provider_name,
                            "priority": "speed"
                        }
        return None
    
    async def _select_highest_quality_model(self, request: AIRequest) -> Optional[Dict]:
        """Select the highest quality available model"""
        # Prioritize Gemini models for quality, then Ollama models
        quality_priority = ["gemini-2-flash", "gemini-pro", "codellama", "llama2", "mistral", "phi3"]
        
        for model_name in quality_priority:
            for provider_name, provider in self.providers.items():
                if model_name in AI_MODELS.get(provider_name, {}):
                    statuses = await provider.get_status()
                    for status in statuses:
                        if status.available and status.model == model_name:
                            return {
                                "name": status.model,
                                "provider": provider_name,
                                "priority": "quality"
                            }
        return None
    
    async def _select_cost_optimized_model(self, request: AIRequest) -> Optional[Dict]:
        """Select the most cost-effective model"""
        # Prefer local models (Ollama) over cloud models (Gemini)
        for provider_name, provider in self.providers.items():
            if provider_name == "ollama":
                statuses = await provider.get_status()
                for status in statuses:
                    if status.available:
                        model_config = AI_MODELS["ollama"].get(status.model)
                        if model_config:
                            return {
                                "name": status.model,
                                "provider": "ollama",
                                "priority": "cost"
                            }
        
        # Fallback to cloud if no local models available
        for provider_name, provider in self.providers.items():
            if provider_name == "gemini":
                statuses = await provider.get_status()
                for status in statuses:
                    if status.available:
                        model_config = AI_MODELS["gemini"].get(status.model)
                        if model_config:
                            return {
                                "name": status.model,
                                "provider": "gemini",
                                "priority": "cost"
                            }
        return None
    
    async def _select_auto_model(self, request: AIRequest) -> Optional[Dict]:
        """Intelligent auto-selection based on request characteristics"""
        prompt_length = len(request.prompt)
        
        # Short prompts -> Fast models
        if prompt_length < 500:
            return await self._select_fastest_model(request)
        
        # Long prompts or complex tasks -> High quality models
        elif prompt_length > 5000 or "analyze" in request.prompt.lower() or "code" in request.prompt.lower():
            return await self._select_highest_quality_model(request)
        
        # Medium prompts -> Balanced approach
        else:
            return await self._select_cost_optimized_model(request)
    
    async def get_all_model_status(self) -> List[ModelStatus]:
        """Get status of all models across all providers"""
        all_statuses = []
        
        for provider_name, provider in self.providers.items():
            try:
                statuses = await provider.get_status()
                all_statuses.extend(statuses)
            except Exception as e:
                self.logger.error(f"Failed to get status for {provider_name}", error=str(e))
        
        return all_statuses
    
    async def health_check(self) -> Dict[str, Any]:
        """Comprehensive health check of the orchestrator"""
        health_status = {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "providers": {},
            "total_models": 0,
            "available_models": 0
        }
        
        for provider_name, provider in self.providers.items():
            try:
                statuses = await provider.get_status()
                provider_health = {
                    "status": "online" if statuses else "offline",
                    "models": len(statuses),
                    "available": len([s for s in statuses if s.available])
                }
                health_status["providers"][provider_name] = provider_health
                health_status["total_models"] += len(statuses)
                health_status["available_models"] += provider_health["available"]
                
            except Exception as e:
                health_status["providers"][provider_name] = {
                    "status": "error",
                    "error": str(e)
                }
                health_status["status"] = "degraded"
        
        return health_status

# Global orchestrator instance
orchestrator: Optional[AIOrchestrator] = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    global orchestrator
    # Startup
    logger.info("Starting Local AI Orchestrator service...")
    orchestrator = AIOrchestrator()
    logger.info("Local AI Orchestrator service ready")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Local AI Orchestrator service...")

# Create FastAPI application
app = FastAPI(
    title="Local AI Orchestrator",
    description="Hybrid AI orchestration service with Ollama and Gemini 2 Flash integration",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    if not orchestrator:
        raise HTTPException(status_code=503, detail="Service not ready")
    
    health = await orchestrator.health_check()
    return health

@app.get("/models")
async def get_available_models():
    """Get all available AI models"""
    return {"models": AI_MODELS}

@app.get("/status")
async def get_model_status():
    """Get status of all AI models"""
    if not orchestrator:
        raise HTTPException(status_code=503, detail="Service not ready")
    
    statuses = await orchestrator.get_all_model_status()
    return {"models": [status.dict() for status in statuses]}

@app.post("/generate", response_model=AIResponse)
async def generate_ai_response(request: AIRequest):
    """Generate AI response using specified model"""
    if not orchestrator:
        raise HTTPException(status_code=503, detail="Service not ready")
    
    try:
        # Auto-select model if requested
        if request.model == "auto":
            request = await orchestrator.auto_select_model(request)
        
        response = await orchestrator.generate_response(request)
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("AI generation failed", error=str(e), exc_info=True)
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

@app.post("/generate/stream")
async def generate_ai_response_stream(request: AIRequest):
    """Generate AI response with streaming"""
    if not orchestrator:
        raise HTTPException(status_code=503, detail="Service not ready")
    
    request.stream = True
    
    try:
        # Auto-select model if requested
        if request.model == "auto":
            request = await orchestrator.auto_select_model(request)
        
        response = await orchestrator.generate_response(request)
        
        async def generate_stream():
            yield f"data: {response.json()}\n\n"
        
        return StreamingResponse(
            generate_stream(),
            media_type="text/plain",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("AI streaming generation failed", error=str(e))
        raise HTTPException(status_code=500, detail=f"AI streaming generation failed: {str(e)}")

@app.websocket("/ws/generate")
async def websocket_generate(websocket: WebSocket):
    """WebSocket endpoint for real-time AI generation"""
    if not orchestrator:
        await websocket.close(code=1003, reason="Service not ready")
        return
    
    await websocket.accept()
    ACTIVE_CONNECTIONS.inc()
    
    try:
        while True:
            # Receive request
            data = await websocket.receive_text()
            request_data = json.loads(data)
            
            # Create request
            request = AIRequest(**request_data)
            
            # Generate response
            response = await orchestrator.generate_response(request)
            
            # Send response
            await websocket.send_text(json.dumps(response.dict()))
            
    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected")
    except Exception as e:
        logger.error("WebSocket error", error=str(e))
        await websocket.close(code=1011, reason="Internal server error")
    finally:
        ACTIVE_CONNECTIONS.dec()

@app.get("/metrics")
async def get_metrics():
    """Prometheus metrics endpoint"""
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

if __name__ == "__main__":
    uvicorn.run(
        "orchestrator:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8004)),
        reload=os.getenv("ENVIRONMENT") == "development",
        log_level=os.getenv("LOG_LEVEL", "info")
    )