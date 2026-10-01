export interface IStorageProvider {
  readonly name: string;
  upload(key: string, fileBuffer: Buffer, mimeType?: string): Promise<string>;
  download(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  getUrl(key: string): string;
}
