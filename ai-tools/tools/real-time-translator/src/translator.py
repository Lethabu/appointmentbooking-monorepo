"""
Real Time Translator - Production Implementation
Multi-engine real-time translation service with enterprise features
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
import langdetect
from googletrans import Translator as GoogleTranslator
from deep_translator import GoogleTranslator as DeepGoogleTranslator, LibreTranslator
from cachetools import TTLCache
from fastapi import FastAPI, HTTPException, BackgroundTasks, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from openai import AsyncOpenAI
from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST
import structlog
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.logging import LoggingIntegration
import uvicorn
from contextlib import asynccontextmanager
import re

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
    release="real-time-translator@1.0.0"
)

# Prometheus metrics
TRANSLATION_REQUESTS = Counter('translation_requests_total', 'Total translation requests', ['engine', 'source_lang', 'target_lang'])
TRANSLATION_DURATION = Histogram('translation_duration_seconds', 'Time spent translating', ['engine'])
TRANSLATION_ERRORS = Counter('translation_errors_total', 'Total translation errors', ['engine', 'error_type'])
LANGUAGE_DETECTION = Counter('language_detection_total', 'Total language detections', ['detected_lang', 'confidence'])
TRANSLATION_CACHE_HITS = Counter('translation_cache_hits_total', 'Cache hits', ['engine'])
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

# Supported languages mapping
LANGUAGE_CODES = {
    'af': 'Afrikaans', 'ar': 'Arabic', 'bg': 'Bulgarian', 'bn': 'Bengali',
    'ca': 'Catalan', 'cs': 'Czech', 'cy': 'Welsh', 'da': 'Danish',
    'de': 'German', 'el': 'Greek', 'en': 'English', 'es': 'Spanish',
    'et': 'Estonian', 'fa': 'Persian', 'fi': 'Finnish', 'fil': 'Filipino',
    'fr': 'French', 'gu': 'Gujarati', 'he': 'Hebrew', 'hi': 'Hindi',
    'hr': 'Croatian', 'hu': 'Hungarian', 'id': 'Indonesian', 'it': 'Italian',
    'ja': 'Japanese', 'kn': 'Kannada', 'ko': 'Korean', 'lt': 'Lithuanian',
    'lv': 'Latvian', 'mk': 'Macedonian', 'ml': 'Malayalam', 'mr': 'Marathi',
    'ms': 'Malay', 'nl': 'Dutch', 'no': 'Norwegian', 'pl': 'Polish',
    'pt': 'Portuguese', 'ro': 'Romanian', 'ru': 'Russian', 'sk': 'Slovak',
    'sl': 'Slovenian', 'sr': 'Serbian', 'sv': 'Swedish', 'sw': 'Swahili',
    'ta': 'Tamil', 'te': 'Telugu', 'th': 'Thai', 'tr': 'Turkish',
    'uk': 'Ukrainian', 'ur': 'Urdu', 'vi': 'Vietnamese', 'zh': 'Chinese'
}

class TranslationRequest(BaseModel):
    text: str
    source_lang: Optional[str] = None
    target_lang: str = Field(..., description="Target language code (e.g., 'en', 'es', 'fr')")
    engine: str = Field(default="google", description="Translation engine: 'google', 'deepl', 'openai', 'auto'")
    detect_language: bool = Field(default=True, description="Auto-detect source language")
    batch_id: Optional[str] = None
    priority: str = Field(default="normal", description="Priority: 'low', 'normal', 'high'")

class BatchTranslationRequest(BaseModel):
    texts: List[str]
    source_lang: Optional[str] = None
    target_lang: str
    engine: str = Field(default="google")
    batch_id: Optional[str] = None

class TranslationResult(BaseModel):
    original_text: str
    translated_text: str
    source_lang: str
    target_lang: str
    engine: str
    confidence: float
    processing_time: float
    timestamp: datetime
    translation_id: str
    detected_language: Optional[str] = None

class WebSocketMessage(BaseModel):
    type: str  # 'translate', 'batch', 'status', 'error'
    data: Dict[str, Any]
    message_id: Optional[str] = None

class TranslationEngine:
    """Base class for translation engines"""
    
    def __init__(self, name: str):
        self.name = name
        self.logger = logger.bind(engine=name)
    
    async def translate(self, text: str, source_lang: str, target_lang: str) -> TranslationResult:
        raise NotImplementedError
    
    async def detect_language(self, text: str) -> tuple[str, float]:
        raise NotImplementedError

class GoogleTranslateEngine(TranslationEngine):
    """Google Translate implementation"""
    
    def __init__(self):
        super().__init__("google")
        self.translator = GoogleTranslator()
    
    async def translate(self, text: str, source_lang: str, target_lang: str) -> TranslationResult:
        start_time = time.time()
        
        try:
            # Handle auto-detection
            if source_lang == "auto":
                source_lang, confidence = await self.detect_language(text)
            else:
                confidence = 1.0
            
            # Translate using Google Translate
            result = self.translator.translate(text, src=source_lang, dest=target_lang)
            
            processing_time = time.time() - start_time
            
            return TranslationResult(
                original_text=text,
                translated_text=result.text,
                source_lang=source_lang,
                target_lang=target_lang,
                engine=self.name,
                confidence=confidence,
                processing_time=processing_time,
                timestamp=datetime.now(),
                translation_id=str(uuid.uuid4()),
                detected_language=source_lang if source_lang != "auto" else None
            )
            
        except Exception as e:
            self.logger.error("Google translation failed", error=str(e), text=text[:100])
            TRANSLATION_ERRORS.labels(engine=self.name, error_type="translation_failed").inc()
            raise HTTPException(status_code=500, detail=f"Google translation failed: {str(e)}")
    
    async def detect_language(self, text: str) -> tuple[str, float]:
        try:
            detection = langdetect.detect(text)
            # Get confidence score
            probabilities = langdetect.detect_langs(text)
            confidence = next((prob.prob for prob in probabilities if prob.lang == detection), 0.0)
            
            LANGUAGE_DETECTION.labels(detected_lang=detection, confidence=confidence).inc()
            
            return detection, confidence
            
        except Exception as e:
            self.logger.error("Language detection failed", error=str(e))
            return "en", 0.5  # Default to English

class DeepLTranslateEngine(TranslationEngine):
    """DeepL Translate implementation"""
    
    def __init__(self):
        super().__init__("deepl")
        # Note: DeepL requires API key, using free tier as example
        self.translator = LibreTranslator(source='auto', target='en')
    
    async def translate(self, text: str, source_lang: str, target_lang: str) -> TranslationResult:
        start_time = time.time()
        
        try:
            # Handle auto-detection
            if source_lang == "auto":
                source_lang, confidence = await self.detect_language(text)
            else:
                confidence = 1.0
            
            # Set target language
            self.translator.target = target_lang
            
            # Translate
            result = self.translator.translate(text)
            
            processing_time = time.time() - start_time
            
            return TranslationResult(
                original_text=text,
                translated_text=result,
                source_lang=source_lang,
                target_lang=target_lang,
                engine=self.name,
                confidence=confidence,
                processing_time=processing_time,
                timestamp=datetime.now(),
                translation_id=str(uuid.uuid4()),
                detected_language=source_lang if source_lang != "auto" else None
            )
            
        except Exception as e:
            self.logger.error("DeepL translation failed", error=str(e), text=text[:100])
            TRANSLATION_ERRORS.labels(engine=self.name, error_type="translation_failed").inc()
            raise HTTPException(status_code=500, detail=f"DeepL translation failed: {str(e)}")
    
    async def detect_language(self, text: str) -> tuple[str, float]:
        # Use Google Translate's detection for consistency
        google_engine = GoogleTranslateEngine()
        return await google_engine.detect_language(text)

class OpenAITranslateEngine(TranslationEngine):
    """OpenAI GPT-based translation"""
    
    def __init__(self, api_key: str):
        super().__init__("openai")
        self.client = AsyncOpenAI(api_key=api_key)
    
    async def translate(self, text: str, source_lang: str, target_lang: str) -> TranslationResult:
        start_time = time.time()
        
        try:
            # Handle auto-detection
            if source_lang == "auto":
                source_lang, confidence = await self.detect_language(text)
            else:
                confidence = 1.0
            
            # Create translation prompt
            source_name = LANGUAGE_CODES.get(source_lang, source_lang)
            target_name = LANGUAGE_CODES.get(target_lang, target_lang)
            
            prompt = f"""Translate the following text from {source_name} to {target_name}. 
            
            Text: "{text}"
            
            Translation:"""
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a professional translator. Provide accurate, natural translations while preserving the original meaning and tone."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.1
            )
            
            translated_text = response.choices[0].message.content.strip()
            processing_time = time.time() - start_time
            
            return TranslationResult(
                original_text=text,
                translated_text=translated_text,
                source_lang=source_lang,
                target_lang=target_lang,
                engine=self.name,
                confidence=confidence,
                processing_time=processing_time,
                timestamp=datetime.now(),
                translation_id=str(uuid.uuid4()),
                detected_language=source_lang if source_lang != "auto" else None
            )
            
        except Exception as e:
            self.logger.error("OpenAI translation failed", error=str(e), text=text[:100])
            TRANSLATION_ERRORS.labels(engine=self.name, error_type="translation_failed").inc()
            raise HTTPException(status_code=500, detail=f"OpenAI translation failed: {str(e)}")
    
    async def detect_language(self, text: str) -> tuple[str, float]:
        # Use Google Translate's detection for consistency
        google_engine = GoogleTranslateEngine()
        return await google_engine.detect_language(text)

class TranslationService:
    """Main translation service with caching and engine management"""
    
    def __init__(self, openai_api_key: str):
        self.engines = {
            "google": GoogleTranslateEngine(),
            "deepl": DeepLTranslateEngine(),
            "openai": OpenAITranslateEngine(openai_api_key)
        }
        
        # Cache for translations (1 hour TTL)
        self.cache = TTLCache(maxsize=10000, ttl=3600)
        
        # Rate limiting
        self.request_counts = {}
        self.rate_limits = {
            "google": 100,  # requests per minute
            "deepl": 50,
            "openai": 60
        }
        
        self.logger = logger.bind(component="translation_service")
    
    def _get_cache_key(self, text: str, source_lang: str, target_lang: str, engine: str) -> str:
        """Generate cache key for translation"""
        return f"{engine}:{source_lang}:{target_lang}:{hash(text)}"
    
    def _check_rate_limit(self, engine: str, client_ip: str = "default") -> bool:
        """Check if request is within rate limits"""
        current_time = time.time()
        minute_window = int(current_time // 60)
        
        key = f"{engine}:{client_ip}:{minute_window}"
        
        if key not in self.request_counts:
            self.request_counts[key] = 0
        
        if self.request_counts[key] >= self.rate_limits.get(engine, 100):
            return False
        
        self.request_counts[key] += 1
        return True
    
    async def translate_text(self, request: TranslationRequest, client_ip: str = "default") -> TranslationResult:
        """Translate single text"""
        
        # Rate limiting check
        if not self._check_rate_limit(request.engine, client_ip):
            TRANSLATION_ERRORS.labels(engine=request.engine, error_type="rate_limited").inc()
            raise HTTPException(status_code=429, detail="Rate limit exceeded")
        
        # Check cache
        cache_key = self._get_cache_key(request.text, request.source_lang or "auto", request.target_lang, request.engine)
        if cache_key in self.cache:
            TRANSLATION_CACHE_HITS.labels(engine=request.engine).inc()
            return self.cache[cache_key]
        
        # Get appropriate engine
        engine = self.engines.get(request.engine)
        if not engine:
            raise HTTPException(status_code=400, detail=f"Unsupported engine: {request.engine}")
        
        # Perform translation
        start_time = time.time()
        result = await engine.translate(request.text, request.source_lang or "auto", request.target_lang)
        processing_time = time.time() - start_time
        
        # Update metrics
        TRANSLATION_REQUESTS.labels(
            engine=request.engine,
            source_lang=result.source_lang,
            target_lang=result.target_lang
        ).inc()
        TRANSLATION_DURATION.labels(engine=request.engine).observe(processing_time)
        
        # Cache result
        self.cache[cache_key] = result
        
        self.logger.info(
            "Translation completed",
            engine=request.engine,
            source_lang=result.source_lang,
            target_lang=result.target_lang,
            processing_time=processing_time
        )
        
        return result
    
    async def batch_translate(self, request: BatchTranslationRequest, client_ip: str = "default") -> List[TranslationResult]:
        """Translate multiple texts in batch"""
        
        results = []
        for text in request.texts:
            try:
                translation_request = TranslationRequest(
                    text=text,
                    source_lang=request.source_lang,
                    target_lang=request.target_lang,
                    engine=request.engine,
                    batch_id=request.batch_id
                )
                
                result = await self.translate_text(translation_request, client_ip)
                results.append(result)
                
                # Small delay to respect rate limits
                await asyncio.sleep(0.1)
                
            except Exception as e:
                self.logger.error("Batch translation item failed", error=str(e), text=text[:100])
                # Add error result
                error_result = TranslationResult(
                    original_text=text,
                    translated_text="",
                    source_lang=request.source_lang or "unknown",
                    target_lang=request.target_lang,
                    engine=request.engine,
                    confidence=0.0,
                    processing_time=0.0,
                    timestamp=datetime.now(),
                    translation_id=str(uuid.uuid4())
                )
                results.append(error_result)
        
        return results

# Global service instance
translation_service: Optional[TranslationService] = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    global translation_service
    # Startup
    logger.info("Starting Real Time Translator service...")
    translation_service = TranslationService(openai_api_key=os.getenv("OPENAI_API_KEY"))
    logger.info("Real Time Translator service ready")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Real Time Translator service...")

# Create FastAPI application
app = FastAPI(
    title="Real Time Translator",
    description="Multi-engine real-time translation service with enterprise features",
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
    return {
        "status": "healthy",
        "service": "real-time-translator",
        "version": "1.0.0",
        "engines": list(translation_service.engines.keys()) if translation_service else [],
        "timestamp": datetime.now().isoformat()
    }

@app.get("/metrics")
async def get_metrics():
    """Prometheus metrics endpoint"""
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.get("/languages")
async def get_supported_languages():
    """Get supported languages"""
    return {
        "languages": LANGUAGE_CODES,
        "engines": list(translation_service.engines.keys()) if translation_service else []
    }

@app.post("/translate", response_model=TranslationResult)
async def translate_text(request: TranslationRequest):
    """Translate single text"""
    if not translation_service:
        raise HTTPException(status_code=503, detail="Service not ready")
    
    try:
        result = await translation_service.translate_text(request)
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Translation failed", error=str(e), exc_info=True)
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")

@app.post("/batch-translate")
async def batch_translate(request: BatchTranslationRequest):
    """Translate multiple texts in batch"""
    if not translation_service:
        raise HTTPException(status_code=503, detail="Service not ready")
    
    try:
        results = await translation_service.batch_translate(request)
        return {
            "results": results,
            "batch_id": request.batch_id or str(uuid.uuid4()),
            "total_texts": len(request.texts),
            "successful_translations": len([r for r in results if r.translated_text])
        }
        
    except Exception as e:
        logger.error("Batch translation failed", error=str(e), exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch translation failed: {str(e)}")

@app.post("/detect-language")
async def detect_language(text: str):
    """Detect language of text"""
    if not translation_service:
        raise HTTPException(status_code=503, detail="Service not ready")
    
    try:
        engine = translation_service.engines["google"]  # Use Google for detection
        detected_lang, confidence = await engine.detect_language(text)
        
        return {
            "language": detected_lang,
            "language_name": LANGUAGE_CODES.get(detected_lang, detected_lang),
            "confidence": confidence,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error("Language detection failed", error=str(e))
        raise HTTPException(status_code=500, detail=f"Language detection failed: {str(e)}")

@app.websocket("/realtime")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time translation"""
    if not translation_service:
        await websocket.close(code=1003, reason="Service not ready")
        return
    
    await websocket.accept()
    ACTIVE_CONNECTIONS.inc()
    
    try:
        while True:
            # Receive message
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message["type"] == "translate":
                # Create translation request
                request = TranslationRequest(
                    text=message["data"]["text"],
                    source_lang=message["data"].get("source_lang"),
                    target_lang=message["data"]["target_lang"],
                    engine=message["data"].get("engine", "google")
                )
                
                # Translate
                result = await translation_service.translate_text(request)
                
                # Send result
                await websocket.send_text(json.dumps({
                    "type": "translation_result",
                    "data": result.dict(),
                    "message_id": message.get("message_id")
                }))
                
            elif message["type"] == "batch_translate":
                # Batch translation
                request = BatchTranslationRequest(
                    texts=message["data"]["texts"],
                    source_lang=message["data"].get("source_lang"),
                    target_lang=message["data"]["target_lang"],
                    engine=message["data"].get("engine", "google"),
                    batch_id=message["data"].get("batch_id")
                )
                
                results = await translation_service.batch_translate(request)
                
                await websocket.send_text(json.dumps({
                    "type": "batch_result",
                    "data": {
                        "results": [r.dict() for r in results],
                        "batch_id": request.batch_id
                    },
                    "message_id": message.get("message_id")
                }))
                
    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected")
    except Exception as e:
        logger.error("WebSocket error", error=str(e))
        await websocket.close(code=1011, reason="Internal server error")
    finally:
        ACTIVE_CONNECTIONS.dec()

@app.get("/stats")
async def get_service_stats():
    """Get service statistics"""
    if not translation_service:
        raise HTTPException(status_code=503, detail="Service not ready")
    
    return {
        "engines": list(translation_service.engines.keys()),
        "cache_size": len(translation_service.cache),
        "supported_languages": len(LANGUAGE_CODES),
        "rate_limits": translation_service.rate_limits,
        "active_websockets": int(ACTIVE_CONNECTIONS._value._value),
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run(
        "translator:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8002)),
        reload=os.getenv("ENVIRONMENT") == "development",
        log_level=os.getenv("LOG_LEVEL", "info")
    )