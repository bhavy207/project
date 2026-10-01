import { ILLMProvider } from './llm-provider.interface';
import { OllamaProvider } from './ollama.provider';
import { GeminiProvider } from './gemini.provider';
import { MockProvider } from './mock.provider';

export class LLMFactory {
  static create(providerName?: string): ILLMProvider {
    const target = (providerName || process.env.LLM_PROVIDER || 'ollama').toLowerCase();

    switch (target) {
      case 'ollama':
        return new OllamaProvider();
      case 'gemini':
        return new GeminiProvider();
      case 'mock':
        return new MockProvider();
      default:
        console.warn(`[LLMFactory] Unknown provider '${target}', falling back to MockProvider.`);
        return new MockProvider();
    }
  }
}
