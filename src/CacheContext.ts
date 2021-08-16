export type AsyncStorageCacheOptions = {
  type: 'asyncStorage';
};

export type BlobStorageCacheOptions = {
  type: 'blob';
  contentVersion?: string;
  cacheDirPath?: string;
};

export type CacheOptions = AsyncStorageCacheOptions | BlobStorageCacheOptions;

export default class CacheContext {
  options: CacheOptions;

  constructor(options: CacheOptions) {
    this.options = options;
  }
}
