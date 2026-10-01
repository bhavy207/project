from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional

class BaseLLMProvider(ABC):
    """
    Abstract Base Class for LLM Providers in DevPilot.
    Enforces unified interfaces so switching between Ollama, Gemini, and Mock
    requires ZERO changes to agent business logic.
    """

    @abstractmethod
    async def generate(self, prompt: str, system_prompt: Optional[str] = None, **kwargs) -> Dict[str, Any]:
        """
        Generate completion response.
        Returns:
            {
                "content": str,
                "provider": str,
                "model": str,
                "tokens": {"prompt": int, "completion": int, "total": int}
            }
        """
        pass

    @abstractmethod
    async def get_embedding(self, text: str) -> List[float]:
        """Generate vector embedding for semantic search / RAG."""
        pass
