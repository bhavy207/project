import time
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from app.agent.engine import DeveloperAgentEngine
from app.providers.factory import get_llm_provider
from prometheus_client import Counter, Histogram

# Prometheus Metrics
AI_REQUESTS = Counter("ai_service_requests_total", "Total requests to AI Service", ["endpoint", "provider"])
INFERENCE_DURATION = Histogram("llm_inference_duration_seconds", "LLM inference latency in seconds", ["provider"])
TOKENS_GENERATED = Counter("llm_tokens_total", "Total tokens processed by LLM", ["provider", "type"])

router = APIRouter(prefix="/api/ai", tags=["AI Agent"])

class PlanRequest(BaseModel):
    task: str = Field(..., description="Developer task or bug fix request")
    repo_context: Optional[str] = Field(None, description="Repository overview or file tree")
    provider: Optional[str] = Field(None, description="Optional override: 'ollama', 'gemini', 'mock'")

class CodeGenRequest(BaseModel):
    task: str
    file_path: str = Field(default="src/index.ts")
    plan_context: Optional[str] = None
    provider: Optional[str] = None

class CodeReviewRequest(BaseModel):
    code: str
    file_path: str = Field(default="src/index.ts")
    provider: Optional[str] = None

class TestGenRequest(BaseModel):
    code: str
    file_path: str = Field(default="src/index.ts")
    provider: Optional[str] = None

class WorkflowRequest(BaseModel):
    task: str
    target_file: str = Field(default="src/feature.ts")
    provider: Optional[str] = None

@router.post("/plan")
async def plan_task(req: PlanRequest):
    agent = DeveloperAgentEngine(req.provider)
    start_time = time.time()
    try:
        result = await agent.plan_task(req.task, req.repo_context)
        duration = time.time() - start_time
        AI_REQUESTS.labels(endpoint="plan", provider=result["provider"]).inc()
        INFERENCE_DURATION.labels(provider=result["provider"]).observe(duration)
        if "tokens" in result:
            TOKENS_GENERATED.labels(provider=result["provider"], type="total").inc(result["tokens"].get("total", 0))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-code")
async def generate_code(req: CodeGenRequest):
    agent = DeveloperAgentEngine(req.provider)
    start_time = time.time()
    try:
        result = await agent.generate_code(req.task, req.file_path, req.plan_context)
        duration = time.time() - start_time
        AI_REQUESTS.labels(endpoint="generate-code", provider=result["provider"]).inc()
        INFERENCE_DURATION.labels(provider=result["provider"]).observe(duration)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/review-code")
async def review_code(req: CodeReviewRequest):
    agent = DeveloperAgentEngine(req.provider)
    try:
        result = await agent.review_code(req.code, req.file_path)
        AI_REQUESTS.labels(endpoint="review-code", provider=result["provider"]).inc()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-tests")
async def generate_tests(req: TestGenRequest):
    agent = DeveloperAgentEngine(req.provider)
    try:
        result = await agent.generate_tests(req.code, req.file_path)
        AI_REQUESTS.labels(endpoint="generate-tests", provider=result["provider"]).inc()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/run-workflow")
async def run_full_workflow(req: WorkflowRequest):
    agent = DeveloperAgentEngine(req.provider)
    try:
        result = await agent.run_full_workflow(req.task, req.target_file)
        AI_REQUESTS.labels(endpoint="run-workflow", provider=result["provider_used"]).inc()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
