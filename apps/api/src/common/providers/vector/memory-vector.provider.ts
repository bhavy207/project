import { IVectorProvider, VectorRecord, VectorSearchResult } from './vector-provider.interface';

export class MemoryVectorProvider implements IVectorProvider {
  public readonly name = 'memory';
  private storage: Map<string, VectorRecord> = new Map();

  async insert(record: VectorRecord): Promise<void> {
    this.storage.set(record.id, record);
  }

  async search(projectId: string, queryEmbedding: number[], limit = 5): Promise<VectorSearchResult[]> {
    const projectRecords = Array.from(this.storage.values()).filter(
      (r) => r.projectId === projectId
    );

    const scored = projectRecords.map((record) => {
      const score = this.cosineSimilarity(queryEmbedding, record.embedding);
      return {
        id: record.id,
        filePath: record.filePath,
        content: record.content,
        score,
        metadata: record.metadata,
      };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit);
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * (vecB[i] || 0);
      normA += vecA[i] * vecA[i];
      normB += (vecB[i] || 0) * (vecB[i] || 0);
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
