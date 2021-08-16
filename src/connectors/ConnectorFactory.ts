import AsyncStorageConnector from './AsyncStorageConnector';
import BlobStorageConnector from './BlobStorageConnector';

import type { BlobStorageCacheOptions, CacheOptions } from '../CacheContext';
import type CacheContext from '../CacheContext';

export type Connector = AsyncStorageConnector | BlobStorageConnector;

export default class ConnectorFactory {
  context: CacheContext;

  constructor(context: CacheContext) {
    this.context = context;
  }

  private isBlobOptions(
    options: CacheOptions
  ): options is BlobStorageCacheOptions {
    if (options.type === 'blob') return true;

    return false;
  }

  createConnector() {
    const { options } = this.context;

    if (this.isBlobOptions(options)) {
      return new BlobStorageConnector(options);
    }

    return new AsyncStorageConnector(options);
  }
}
