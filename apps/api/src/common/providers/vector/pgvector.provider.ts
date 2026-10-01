import { Pool } from 'pg';
import { IVectorProvider, VectorRecord, VectorSearchResult } from './vector-provider.interface';

export class PgVectorProvider implements IVectorProvider {
  public readonly name = 'pgvector';
  private pool: Pool;

  constructor(connectionString?: string) {
    this.pool = new Pool({
      connectionString: connectionString || process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/devpilot',
      max: 10,
    });
  }

  async insert(record: VectorRecord): Promise<void> {
    const vectorString = `[${record.embedding.join(',')}]`;
    const query = `
      INSERT INTO code_embeddings (id, project_id, file_path, content_chunk, embedding, metadata)
      VALUES ($1, $2, $3, $4, $5::vector, $6)
      ON CONFLICT (id) DO UPDATE SET
        content_chunk = EXCLUDED.content_chunk,
        embedding = EXCLUDED.embedding,
        metadata = EXCLUDED.metadata;
    `;
    await this.pool.query(query, [
      record.id,
      record.projectId,
      record.filePath,
      record.content,
      vectorString,
      JSON.stringify(record.metadata || {}),
    ]);
  }

  async search(projectId: string, queryEmbedding: number[], limit = 5): Promise<VectorSearchResult[]> {
    const vectorString = `[${queryEmbedding.join(',')}]`;
    const query = `
      SELECT 
        id, 
        file_path AS "filePath", 
        content_chunk AS "content", 
        1 - (embedding <=> $1::vector) AS score,
        metadata
      FROM code_embeddings
      WHERE project_id = $2
      ORDER BY embedding <=> $1::vector ASC
      LIMIT $3;
    `;
    const res = await this.pool.query(query, [vectorString, projectId, limit]);
    return res.rows.map((row) => ({
      id: row.id,
      filePath: row.filePath,
      content: row.content,
      score: parseFloat(row.score),
      metadata: row.metadata,
    }));
  }
}
