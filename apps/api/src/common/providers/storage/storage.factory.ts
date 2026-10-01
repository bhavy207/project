import { IStorageProvider } from './storage-provider.interface';
import { LocalStorageProvider } from './local-storage.provider';
import { MinioStorageProvider } from './minio-storage.provider';

export class StorageFactory {
  static create(providerName?: string): IStorageProvider {
    const target = (providerName || process.env.STORAGE_PROVIDER || 'local').toLowerCase();

    switch (target) {
      case 'minio':
        return new MinioStorageProvider();
      case 'local':
      default:
        return new LocalStorageProvider();
    }
  }
}
