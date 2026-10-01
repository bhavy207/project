import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry: client.Registry;

  public readonly httpRequestCounter: client.Counter<string>;
  public readonly sandboxExecutionCounter: client.Counter<string>;
  public readonly llmDurationHistogram: client.Histogram<string>;

  constructor() {
    this.registry = new client.Registry();
    client.collectDefaultMetrics({ register: this.registry });

    this.httpRequestCounter = new client.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests processed by DevPilot API',
      labelNames: ['method', 'handler', 'status'],
      registers: [this.registry],
    });

    this.sandboxExecutionCounter = new client.Counter({
      name: 'sandbox_executions_total',
      help: 'Total number of sandbox test runner executions',
      labelNames: ['provider', 'status'],
      registers: [this.registry],
    });

    this.llmDurationHistogram = new client.Histogram({
      name: 'llm_inference_duration_seconds',
      help: 'Duration of LLM calls in seconds',
      labelNames: ['provider'],
      buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
      registers: [this.registry],
    });
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  getContentType(): string {
    return this.registry.contentType;
  }
}
