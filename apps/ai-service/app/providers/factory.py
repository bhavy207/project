import os
from app.providers.base import BaseLLMProvider
from app.providers.ollama_provider import OllamaProvider
from app.providers.gemini_provider import GeminiProvider
from app.providers.mock_provider import MockLLMProvider
from app.config import settings

def get_llm_provider(provider_name: str = None) -> BaseLLMProvider:
    """
    Factory function returning the active LLMProvider instance.
    Defaults to settings.LLM_PROVIDER ("ollama", "gemini", or "mock").
    """
    target = (provider_name or settings.LLM_PROVIDER).lower()

    if target == "ollama":
        return OllamaProvider()
    elif target == "gemini":
        return GeminiProvider()
    elif target == "mock":
        return MockLLMProvider()
    else:
        # Graceful fallback to mock provider with a warning
        print(f"[AI Service Warning] Unknown LLM_PROVIDER '{target}', falling back to MockLLMProvider.")
        return MockLLMProvider()
