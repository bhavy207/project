import { IVectorProvider } from './vector-provider.interface';
import { PgVectorProvider } from './pgvector.provider';
import { MemoryVectorProvider } from './memory-vector.provider';

export class VectorFactory {
  static create(providerName?: string): IVectorProvider {
    const target = (providerName || process.env.VECTOR_PROVIDER || 'pgvector').toLowerCase();

    switch (target) {
      case 'pgvector':
        try {
          return new PgVectorProvider();
        } catch (e) {
          console.warn('[VectorFactory] pgvector connection unavailable, falling back to MemoryVectorProvider');
          return new MemoryVectorProvider();
        }
      case 'memory':
      default:
        return new MemoryVectorProvider();
    }
  }
}
