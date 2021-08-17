import RNFetchBlob from 'rn-fetch-blob';

import type { BlobStorageCacheOptions } from '../CacheContext';

export const DEFAULT_BLOB_STORAGE_OPTIONS: BlobStorageCacheOptions = {
  type: 'blob',
  contentVersion: 'v1',
  cacheDirPath: RNFetchBlob.fs.dirs.DocumentDir,
};

export default class BlobStorageConnector<T> {
  options: BlobStorageCacheOptions;

  constructor(options: BlobStorageCacheOptions) {
    this.options = { ...DEFAULT_BLOB_STORAGE_OPTIONS, ...options };
  }

  private getContentPath(key: string) {
    const { cacheDirPath, contentVersion } = this.options;

    return `${cacheDirPath}/content/${contentVersion}/${key}.json`;
  }

  async isPersisted(key: string) {
    return RNFetchBlob.fs.exists(key);
  }

  async clearStorage() {
    await RNFetchBlob.fs.unlink(this.options.cacheDirPath!);
  }

  async load(key: string) {
    const path = this.getContentPath(key);

    const isPersisted = await this.isPersisted(path);

    if (!isPersisted) {
      throw new Error(`File ${path} does not exist`);
    }

    const data = await this.readFile(path);

    return JSON.parse(data) as T;
  }

  async store(data: T, key: string) {
    await this.writeFile(this.getContentPath(key), JSON.stringify(data));
  }

  private async readFile(path: string) {
    const json = await RNFetchBlob.fs.readFile(path, 'utf8');

    if (typeof json !== 'string') {
      throw new Error(`readFile did not return a string`);
    }

    return json;
  }

  private async writeFile(path: string, data: string) {
    return RNFetchBlob.fs.writeFile(path, data, 'utf8');
  }
}
