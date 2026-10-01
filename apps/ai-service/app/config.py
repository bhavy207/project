import os
from pydantic import BaseModel

class Settings(BaseModel):
    # Core
    APP_NAME: str = "DevPilot AI Service"
    PORT: int = int(os.getenv("PORT", 8000))
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    # Provider Abstraction: "ollama" | "gemini" | "mock"
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "ollama").lower()
    
    # Local Ollama Settings (100% Free & Open Source)
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "deepseek-coder:6.7b")
    
    # Google Gemini Free Tier Settings (Optional free tier, no billing required)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    
    # Vector Search
    VECTOR_PROVIDER: str = os.getenv("VECTOR_PROVIDER", "pgvector")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/devpilot")

settings = Settings()
