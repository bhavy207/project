export interface VectorRecord {
  id: string;
  projectId: string;
  filePath: string;
  content: string;
  embedding: number[];
  metadata?: Record<string, any>;
}

export interface VectorSearchResult {
  id: string;
  filePath: string;
  content: string;
  score: number;
  metadata?: Record<string, any>;
}

export interface IVectorProvider {
  readonly name: string;
  insert(record: VectorRecord): Promise<void>;
  search(projectId: string, queryEmbedding: number[], limit?: number): Promise<VectorSearchResult[]>;
}
