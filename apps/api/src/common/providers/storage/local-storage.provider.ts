import * as fs from 'fs';
import * as path from 'path';
import { IStorageProvider } from './storage-provider.interface';

export class LocalStorageProvider implements IStorageProvider {
  public readonly name = 'local';
  private basePath: string;

  constructor(basePath?: string) {
    this.basePath = path.resolve(basePath || process.env.LOCAL_STORAGE_PATH || './uploads');
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath, { recursive: true });
    }
  }

  async upload(key: string, fileBuffer: Buffer): Promise<string> {
    const fullPath = path.join(this.basePath, key);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    await fs.promises.writeFile(fullPath, fileBuffer);
    return `/uploads/${key}`;
  }

  async download(key: string): Promise<Buffer> {
    const fullPath = path.join(this.basePath, key);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${key}`);
    }
    return fs.promises.readFile(fullPath);
  }

  async delete(key: string): Promise<void> {
    const fullPath = path.join(this.basePath, key);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  }

  getUrl(key: string): string {
    return `/uploads/${key}`;
  }
}
