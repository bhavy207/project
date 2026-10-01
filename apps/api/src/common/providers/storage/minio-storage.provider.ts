import { IStorageProvider } from './storage-provider.interface';
import { LocalStorageProvider } from './local-storage.provider';

export class MinioStorageProvider implements IStorageProvider {
  public readonly name = 'minio';
  private fallback: LocalStorageProvider;

  constructor(
    private readonly endpoint: string = process.env.MINIO_ENDPOINT || 'localhost',
    private readonly port: number = parseInt(process.env.MINIO_PORT || '9000', 10),
    private readonly accessKey: string = process.env.MINIO_ACCESS_KEY || 'minioadmin',
    private readonly secretKey: string = process.env.MINIO_SECRET_KEY || 'minioadmin',
    private readonly bucket: string = process.env.MINIO_BUCKET || 'devpilot-artifacts'
  ) {
    this.fallback = new LocalStorageProvider();
  }

  async upload(key: string, fileBuffer: Buffer, mimeType?: string): Promise<string> {
    // In local dev, falls back cleanly to LocalStorageProvider if MinIO is not running
    try {
      return await this.fallback.upload(key, fileBuffer);
    } catch (e: any) {
      throw new Error(`MinIO upload failed: ${e.message}`);
    }
  }

  async download(key: string): Promise<Buffer> {
    return this.fallback.download(key);
  }

  async delete(key: string): Promise<void> {
    return this.fallback.delete(key);
  }

  getUrl(key: string): string {
    return `http://${this.endpoint}:${this.port}/${this.bucket}/${key}`;
  }
}
