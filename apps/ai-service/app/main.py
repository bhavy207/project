from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
from app.config import settings
from app.api.routes import router as ai_router

app = FastAPI(
    title=settings.APP_NAME,
    description="DevPilot AI Reasoning Engine with Zero Mandatory Paid Services",
    version="1.0.0"
)

# CORS configuration for Next.js frontend and NestJS API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router)

@app.get("/")
def root():
    return {
        "service": settings.APP_NAME,
        "status": "online",
        "active_llm_provider": settings.LLM_PROVIDER,
        "zero_cost_budget": "VERIFIED_100_PERCENT_FREE"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "llm_provider": settings.LLM_PROVIDER,
        "vector_provider": settings.VECTOR_PROVIDER
    }

@app.get("/metrics")
def metrics():
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=settings.DEBUG)
