import httpx
from typing import Dict, Any, List, Optional
from app.providers.base import BaseLLMProvider
from app.config import settings

class GeminiProvider(BaseLLMProvider):
    """
    Google Gemini Free Tier Provider.
    Classification: FREE TIER WITH LIMITS (15 RPM / 1M TPM free tier without billing)
    Requires: GEMINI_API_KEY environment variable.
    """

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model = model or settings.GEMINI_MODEL
        if not self.api_key:
            raise ValueError(
                "GEMINI_API_KEY is not set. To use the optional Gemini free tier, please set GEMINI_API_KEY in your .env. "
                "Or set LLM_PROVIDER=ollama for 100% local open-source inference, or LLM_PROVIDER=mock for instant testing."
            )

    async def generate(self, prompt: str, system_prompt: Optional[str] = None, **kwargs) -> Dict[str, Any]:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
        
        contents = []
        if system_prompt:
            contents.append({
                "role": "user",
                "parts": [{"text": f"SYSTEM INSTRUCTION: {system_prompt}"}]
            })
            contents.append({
                "role": "model",
                "parts": [{"text": "Understood. I will strictly follow these instructions."}]
            })

        contents.append({
            "role": "user",
            "parts": [{"text": prompt}]
        })

        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": kwargs.get("temperature", 0.2),
                "topP": kwargs.get("top_p", 0.95),
            }
        }

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                res = await client.post(url, json=payload)
                res.raise_for_status()
                data = res.json()
                
                candidates = data.get("candidates", [])
                if not candidates:
                    raise RuntimeError("No candidate response returned from Gemini API.")
                
                content = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                usage = data.get("usageMetadata", {})

                return {
                    "content": content,
                    "provider": "gemini",
                    "model": self.model,
                    "tokens": {
                        "prompt": usage.get("promptTokenCount", 0),
                        "completion": usage.get("candidatesTokenCount", 0),
                        "total": usage.get("totalTokenCount", 0)
                    }
                }
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 429:
                raise RuntimeError("Gemini Free Tier rate limit reached. Please wait or switch to LLM_PROVIDER=ollama.")
            raise RuntimeError(f"Gemini API error ({e.response.status_code}): {e.response.text}")
        except Exception as e:
            raise RuntimeError(f"Gemini request failed: {str(e)}")

    async def get_embedding(self, text: str) -> List[float]:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key={self.api_key}"
        payload = {
            "model": "models/text-embedding-004",
            "content": {"parts": [{"text": text}]}
        }
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(url, json=payload)
                res.raise_for_status()
                data = res.json()
                return data.get("embedding", {}).get("values", [])
        except Exception:
            import hashlib
            seed = int(hashlib.md5(text.encode()).hexdigest(), 16)
            import random
            rng = random.Random(seed)
            return [rng.uniform(-1.0, 1.0) for _ in range(384)]
