import axios from 'axios';
import { ILLMProvider, LLMResponse } from './llm-provider.interface';

export class OllamaProvider implements ILLMProvider {
  public readonly name = 'ollama';

  constructor(
    private readonly baseUrl: string = process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    private readonly model: string = process.env.OLLAMA_MODEL || 'deepseek-coder:6.7b'
  ) {}

  async generate(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/generate`, {
        model: this.model,
        prompt,
        system: systemPrompt,
        stream: false,
      }, { timeout: 120000 });

      const data = response.data;
      return {
        content: data.response,
        provider: 'ollama',
        model: this.model,
        tokens: {
          prompt: data.prompt_eval_count || 0,
          completion: data.eval_count || 0,
          total: (data.prompt_eval_count || 0) + (data.eval_count || 0),
        },
      };
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error(`Cannot connect to Ollama at ${this.baseUrl}. Ensure 'ollama serve' is running or set LLM_PROVIDER=mock.`);
      }
      throw new Error(`Ollama generation failed: ${error.message}`);
    }
  }
}
