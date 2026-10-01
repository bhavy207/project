import axios from 'axios';
import { ILLMProvider, LLMResponse } from './llm-provider.interface';

export class GeminiProvider implements ILLMProvider {
  public readonly name = 'gemini';

  constructor(
    private readonly apiKey: string = process.env.GEMINI_API_KEY || '',
    private readonly model: string = process.env.GEMINI_MODEL || 'gemini-1.5-flash'
  ) {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is required for GeminiProvider. Set LLM_PROVIDER=ollama or LLM_PROVIDER=mock for zero-cost operation.');
    }
  }

  async generate(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    
    const contents: any[] = [];
    if (systemPrompt) {
      contents.push({ role: 'user', parts: [{ text: `SYSTEM: ${systemPrompt}` }] });
      contents.push({ role: 'model', parts: [{ text: 'Understood.' }] });
    }
    contents.push({ role: 'user', parts: [{ text: prompt }] });

    try {
      const response = await axios.post(url, {
        contents,
        generationConfig: { temperature: 0.2, topP: 0.95 },
      }, { timeout: 60000 });

      const data = response.data;
      const candidate = data.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text || '';
      const usage = data.usageMetadata || {};

      return {
        content: text,
        provider: 'gemini',
        model: this.model,
        tokens: {
          prompt: usage.promptTokenCount || 0,
          completion: usage.candidatesTokenCount || 0,
          total: usage.totalTokenCount || 0,
        },
      };
    } catch (error: any) {
      throw new Error(`Gemini API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}
