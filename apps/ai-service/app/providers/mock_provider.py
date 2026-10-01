import json
import random
import hashlib
from typing import Dict, Any, List, Optional
from app.providers.base import BaseLLMProvider

class MockLLMProvider(BaseLLMProvider):
    """
    Mock LLM Provider for zero-dependency offline testing, CI, and low-spec machines.
    Classification: FREE / OPEN SOURCE
    Requires: Zero GPU, Zero RAM, Zero External Services.
    """

    def __init__(self, model: str = "mock-gpt-4o-mini"):
        self.model = model

    async def generate(self, prompt: str, system_prompt: Optional[str] = None, **kwargs) -> Dict[str, Any]:
        prompt_lower = prompt.lower()
        
        # Scenario 1: Planning
        if "plan" in prompt_lower or "steps" in prompt_lower:
            content = json.dumps({
                "task": "DevPilot Autonomous Task Execution",
                "steps": [
                    {
                        "step": 1,
                        "title": "Analyze Repository & Requirements",
                        "description": "Inspect existing project contracts, schemas, and dependencies.",
                        "estimated_seconds": 2
                    },
                    {
                        "step": 2,
                        "title": "Generate Implementation Code",
                        "description": "Synthesize modular TypeScript / Python code following best practices.",
                        "estimated_seconds": 4
                    },
                    {
                        "step": 3,
                        "title": "Perform Security & Quality Review",
                        "description": "Scan code for OWASP vulnerabilities, secret leaks, and type mismatches.",
                        "estimated_seconds": 3
                    },
                    {
                        "step": 4,
                        "title": "Execute Unit & Integration Tests in Sandbox",
                        "description": "Run tests inside unprivileged Docker container and verify exit code 0.",
                        "estimated_seconds": 5
                    }
                ],
                "confidence_score": 0.98
            }, indent=2)

        # Scenario 2: Code Review
        elif "review" in prompt_lower or "diff" in prompt_lower:
            content = json.dumps({
                "status": "APPROVED_WITH_SUGGESTIONS",
                "summary": "Code passes security scanning with 0 critical vulnerabilities. Architecture follows clean provider abstraction.",
                "issues": [
                    {
                        "severity": "INFO",
                        "file": "src/auth/auth.service.ts",
                        "line": 42,
                        "message": "Consider setting bcrypt salt rounds to 12 for heightened resistance."
                    }
                ],
                "security_score": 95,
                "coverage_estimate": "92%"
            }, indent=2)

        # Scenario 3: Test Generation
        elif "test" in prompt_lower:
            content = """import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from './auth.service';

describe('AuthService (DevPilot Isolated Tests)', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  it('should hash passwords securely without exposing plaintext', async () => {
    const rawPassword = 'superSecretPassword123!';
    const hash = await authService.hashPassword(rawPassword);
    
    expect(hash).toBeDefined();
    expect(hash).not.toEqual(rawPassword);
    expect(hash.length).toBeGreaterThan(20);
  });

  it('should authenticate valid credentials correctly', async () => {
    const isValid = await authService.validateCredentials('admin@devpilot.local', 'password');
    expect(isValid).toBeTruthy();
  });
});"""

        # Scenario 4: Default Code Generation
        else:
            content = """/**
 * DevPilot Autonomous Generated Module
 * Architecture: Clean Provider Abstraction ($0 Budget)
 */

export class RateLimiterMiddleware {
  private requestCounts: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(
    private readonly windowMs: number = 60 * 1000,
    private readonly maxRequests: number = 100
  ) {}

  public isAllowed(clientId: string): boolean {
    const now = Date.now();
    const clientRecord = this.requestCounts.get(clientId);

    if (!clientRecord || now > clientRecord.resetTime) {
      this.requestCounts.set(clientId, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (clientRecord.count >= this.maxRequests) {
      return false;
    }

    clientRecord.count += 1;
    return true;
  }
}"""

        prompt_tokens = len(prompt.split())
        completion_tokens = len(content.split())

        return {
            "content": content,
            "provider": "mock",
            "model": self.model,
            "tokens": {
                "prompt": prompt_tokens,
                "completion": completion_tokens,
                "total": prompt_tokens + completion_tokens
            }
        }

    async def get_embedding(self, text: str) -> List[float]:
        seed = int(hashlib.md5(text.encode()).hexdigest(), 16)
        rng = random.Random(seed)
        return [rng.uniform(-1.0, 1.0) for _ in range(384)]
