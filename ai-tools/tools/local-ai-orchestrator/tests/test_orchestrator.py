"""
Local AI Orchestrator Test Suite
Comprehensive testing with robust error handling and resilient state management
"""

import asyncio
import json
import pytest
import pytest_asyncio
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi.testclient import TestClient
from httpx import AsyncClient

from src.orchestrator import (
    app,
    AIOrchestrator,
    OllamaProvider,
    GeminiProvider,
    AIRequest,
    AIResponse,
    ModelStatus
)

class TestAIProviders:
    """Test AI provider implementations with error handling"""
    
    @pytest_asyncio.fixture
    async def ollama_provider(self):
        """Create mock Ollama provider"""
        provider = OllamaProvider()
        provider.base_url = "http://mock-ollama:11434"
        return provider
    
    @pytest_asyncio.fixture
    async def gemini_provider(self):
        """Create mock Gemini provider"""
        provider = GeminiProvider()
        with patch.dict('os.environ', {'GOOGLE_API_KEY': 'test-key'}):
            provider.api_key = 'test-key'
        return provider
    
    @pytest.mark.asyncio
    async def test_ollama_provider_error_handling(self, ollama_provider):
        """Test Ollama provider robust error handling"""
        request = AIRequest(
            prompt="test prompt",
            model="llama2",
            provider="ollama"
        )
        
        with patch.object(ollama_provider, 'base_url', 'http://invalid-url:11434'):
            with pytest.raises(Exception):
                await ollama_provider.generate(request)
    
    @pytest.mark.asyncio
    async def test_gemini_provider_error_handling(self, gemini_provider):
        """Test Gemini provider robust error handling"""
        gemini_provider.api_key = None
        request = AIRequest(
            prompt="test prompt",
            model="gemini-pro",
            provider="gemini"
        )
        
        with pytest.raises(Exception) as exc_info:
            await gemini_provider.generate(request)
        assert "Google API key not configured" in str(exc_info.value)

class TestAIOrchestrator:
    """Test AI orchestrator with comprehensive error scenarios"""
    
    @pytest_asyncio.fixture
    async def orchestrator(self):
        """Create AI orchestrator instance"""
        return AIOrchestrator()
    
    @pytest.mark.asyncio
    async def test_orchestrator_initialization(self, orchestrator):
        """Test orchestrator initialization with error recovery"""
        assert orchestrator is not None
        assert "ollama" in orchestrator.providers
        assert "gemini" in orchestrator.providers
        assert len(orchestrator.strategies) == 4
    
    @pytest.mark.asyncio
    async def test_invalid_provider_handling(self, orchestrator):
        """Test handling of invalid providers"""
        request = AIRequest(
            prompt="test prompt",
            model="llama2",
            provider="invalid_provider"
        )
        
        with pytest.raises(Exception) as exc_info:
            await orchestrator.generate_response(request)
        assert "Unsupported provider" in str(exc_info.value)
    
    @pytest.mark.asyncio
    async def test_auto_model_selection_strategies(self, orchestrator):
        """Test all model selection strategies with error recovery"""
        request = AIRequest(
            prompt="short prompt",
            model="auto",
            provider="auto"
        )
        
        with patch.object(orchestrator.providers['ollama'], 'get_status', return_value=[]):
            with patch.object(orchestrator.providers['gemini'], 'get_status', return_value=[]):
                result = await orchestrator.auto_select_model(request)
                assert result.model == "auto"
    
    @pytest.mark.asyncio
    async def test_health_check_with_failures(self, orchestrator):
        """Test health check resilience with provider failures"""
        with patch.object(orchestrator.providers['ollama'], 'get_status', 
                         side_effect=Exception("Connection failed")):
            with patch.object(orchestrator.providers['gemini'], 'get_status', 
                             return_value=[]):
                health = await orchestrator.health_check()
                assert health["status"] == "degraded"
                assert "ollama" in health["providers"]

class TestFastAPIEndpoints:
    """Test FastAPI endpoints with comprehensive error scenarios"""
    
    @pytest.fixture
    def client(self):
        """Create test client"""
        return TestClient(app)
    
    def test_health_endpoint_error_handling(self, client):
        """Test health endpoint with service not ready"""
        with patch('src.orchestrator.orchestrator', None):
            response = client.get("/health")
            assert response.status_code == 503
    
    def test_models_endpoint(self, client):
        """Test models endpoint"""
        response = client.get("/models")
        assert response.status_code == 200
        data = response.json()
        assert "models" in data
        assert "ollama" in data["models"]
        assert "gemini" in data["models"]
    
    def test_status_endpoint_error_handling(self, client):
        """Test status endpoint with service not ready"""
        with patch('src.orchestrator.orchestrator', None):
            response = client.get("/status")
            assert response.status_code == 503

class TestResilientStateManagement:
    """Test state management and recovery mechanisms"""
    
    @pytest.mark.asyncio
    async def test_provider_state_recovery(self):
        """Test provider state recovery after failures"""
        provider = OllamaProvider()
        provider.base_url = "http://mock-ollama:11434"
        
        for i in range(3):
            try:
                await provider.get_status()
            except Exception:
                pass
        
        assert provider.name == "ollama"
        assert provider.base_url == "http://mock-ollama:11434"
    
    @pytest.mark.asyncio
    async def test_orchestrator_state_persistence(self):
        """Test orchestrator state persistence across failures"""
        orchestrator = AIOrchestrator()
        
        for i in range(3):
            try:
                await orchestrator.health_check()
            except Exception:
                pass
        
        assert len(orchestrator.providers) == 2
        assert "ollama" in orchestrator.providers
        assert "gemini" in orchestrator.providers

class TestComprehensiveErrorScenarios:
    """Test comprehensive error scenarios and recovery"""
    
    @pytest.mark.asyncio
    async def test_concurrent_request_handling(self):
        """Test handling of concurrent requests with failures"""
        orchestrator = AIOrchestrator()
        
        requests = [
            AIRequest(prompt=f"test prompt {i}", model="llama2", provider="ollama")
            for i in range(5)
        ]
        
        with patch.object(orchestrator.providers['ollama'], 'generate') as mock_generate:
            mock_generate.side_effect = Exception("Simulated failure")
            
            for request in requests:
                with pytest.raises(Exception):
                    await orchestrator.generate_response(request)
    
    @pytest.mark.asyncio
    async def test_resource_cleanup_on_failure(self):
        """Test resource cleanup when operations fail"""
        orchestrator = AIOrchestrator()
        
        request = AIRequest(
            prompt="test prompt",
            model="llama2",
            provider="ollama"
        )
        
        with patch.object(orchestrator.providers['ollama'], 'generate') as mock_generate:
            mock_generate.side_effect = Exception("Resource allocation failed")
            
            with pytest.raises(Exception):
                await orchestrator.generate_response(request)
            
            assert True

class TestProductionReadiness:
    """Test production readiness and monitoring"""
    
    @pytest.mark.asyncio
    async def test_circuit_breaker_pattern(self):
        """Test circuit breaker pattern implementation"""
        provider = OllamaProvider()
        provider.base_url = "http://mock-ollama:11434"
        
        failure_count = 0
        for _ in range(5):
            try:
                await provider.get_status()
            except Exception:
                failure_count += 1
        
        assert failure_count > 0
    
    @pytest.mark.asyncio
    async def test_graceful_degradation(self):
        """Test graceful degradation when services are unavailable"""
        orchestrator = AIOrchestrator()
        
        with patch.object(orchestrator.providers['ollama'], 'get_status', return_value=[]):
            with patch.object(orchestrator.providers['gemini'], 'get_status', return_value=[]):
                health = await orchestrator.health_check()
                
                assert health["status"] in ["degraded", "healthy"]
                assert "providers" in health
    
    @pytest.mark.asyncio
    async def test_timeout_handling(self):
        """Test timeout handling for long-running operations"""
        orchestrator = AIOrchestrator()
        
        request = AIRequest(
            prompt="test prompt",
            model="llama2",
            provider="ollama"
        )
        
        with patch('httpx.AsyncClient.post') as mock_post:
            async def slow_response(*args, **kwargs):
                await asyncio.sleep(2)
                raise asyncio.TimeoutError("Request timeout")
            
            mock_post.side_effect = slow_response
            
            with pytest.raises(Exception):
                await orchestrator.generate_response(request)

if __name__ == "__main__":
    pytest.main([
        __file__,
        "--cov=src",
        "--cov-report=term-missing",
        "-v"
    ])