import { ILLMProvider, LLMResponse } from './llm-provider.interface';

export class MockProvider implements ILLMProvider {
  public readonly name = 'mock';

  constructor(private readonly model: string = 'mock-developer-v1') {}

  async generate(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
    const promptLower = prompt.toLowerCase();
    let content = '';

    if (promptLower.includes('plan')) {
      content = JSON.stringify({
        task: 'DevPilot Task Breakdown',
        steps: [
          { step: 1, title: 'Analyze Spec', description: 'Analyze codebase context & types' },
          { step: 2, title: 'Write Implementation', description: 'Generate robust modular code' },
          { step: 3, title: 'Security Audit', description: 'Scan for OWASP top 10 risks' },
          { step: 4, title: 'Execute Tests', description: 'Validate in Docker sandbox' },
        ],
        confidence_score: 0.99,
      }, null, 2);
    } else if (promptLower.includes('review')) {
      content = JSON.stringify({
        status: 'APPROVED',
        summary: 'Code is well-structured, follows SOLID principles, and exhibits no memory leaks.',
        issues: [],
        security_score: 100,
      }, null, 2);
    } else {
      content = `// DevPilot Mock Generated Source
export function devpilotHandler(payload: { id: string; active: boolean }) {
  if (!payload.id) {
    throw new Error('Identifier is required');
  }
  return { success: true, timestamp: Date.now() };
}`;
    }

    const words = content.split(/\s+/).length;
    return {
      content,
      provider: 'mock',
      model: this.model,
      tokens: {
        prompt: prompt.split(/\s+/).length,
        completion: words,
        total: prompt.split(/\s+/).length + words,
      },
    };
  }
}
