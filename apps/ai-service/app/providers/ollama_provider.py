import httpx
from typing import Dict, Any, List, Optional
from app.providers.base import BaseLLMProvider
from app.config import settings

class OllamaProvider(BaseLLMProvider):
    """
    Local Open-Source LLM Provider powered by Ollama.
    Classification: FREE / OPEN SOURCE
    Requires: Locally installed Ollama running 'ollama serve'
    """

    def __init__(self, base_url: Optional[str] = None, model: Optional[str] = None):
        self.base_url = (base_url or settings.OLLAMA_BASE_URL).rstrip("/")
        self.model = model or settings.OLLAMA_MODEL

    async def generate(self, prompt: str, system_prompt: Optional[str] = None, **kwargs) -> Dict[str, Any]:
        url = f"{self.base_url}/api/generate"
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": kwargs.get("temperature", 0.2),
                "top_p": kwargs.get("top_p", 0.95),
            }
        }
        if system_prompt:
            payload["system"] = system_prompt

        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                res = await client.post(url, json=payload)
                res.raise_for_status()
                data = res.json()
                
                content = data.get("response", "")
                prompt_eval_count = data.get("prompt_eval_count", 0)
                eval_count = data.get("eval_count", 0)

                return {
                    "content": content,
                    "provider": "ollama",
                    "model": self.model,
                    "tokens": {
                        "prompt": prompt_eval_count,
                        "completion": eval_count,
                        "total": prompt_eval_count + eval_count
                    }
                }
        except httpx.ConnectError:
            raise ConnectionError(
                f"Could not connect to Ollama at {self.base_url}. "
                f"Please ensure Ollama is installed and running (`ollama serve`). "
                f"Alternatively, switch to LLM_PROVIDER=mock for instant zero-dependency testing."
            )
        except Exception as e:
            raise RuntimeError(f"Ollama generation error: {str(e)}")

    async def get_embedding(self, text: str) -> List[float]:
        url = f"{self.base_url}/api/embeddings"
        payload = {
            "model": self.model,
            "prompt": text
        }
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(url, json=payload)
                res.raise_for_status()
                return res.json().get("embedding", [])
        except Exception:
            # Fallback deterministic pseudo-embedding with 384 dimensions if model doesn't support embeddings
            import hashlib
            seed = int(hashlib.md5(text.encode()).hexdigest(), 16)
            import random
            rng = random.Random(seed)
            return [rng.uniform(-1.0, 1.0) for _ in range(384)]
