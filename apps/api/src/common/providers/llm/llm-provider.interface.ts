export interface LLMTokenUsage {
  prompt: number;
  completion: number;
  total: number;
}

export interface LLMResponse {
  content: string;
  provider: 'ollama' | 'gemini' | 'mock' | string;
  model: string;
  tokens: LLMTokenUsage;
}

export interface ILLMProvider {
  readonly name: string;
  generate(prompt: string, systemPrompt?: string): Promise<LLMResponse>;
}
