import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AsyncStorageCacheOptions } from '../CacheContext';

export default class AsyncStorageConnector<T> {
  options: AsyncStorageCacheOptions;
  asyncStorage: typeof AsyncStorage;

  constructor(options: AsyncStorageCacheOptions) {
    this.options = options;
    this.asyncStorage = AsyncStorage;
  }

  async isPersisted(key: string) {
    return !!this.asyncStorage.getItem(key);
  }

  async clearStorage() {
    await this.asyncStorage.clear();
  }

  async load(key: string) {
    if (!this.isPersisted(key)) {
      throw new Error(`Key ${key} does not exist`);
    }

    const data = await this.asyncStorage.getItem(key);

    if (typeof data !== 'string') {
      throw new Error(`load did not return a string`);
    }

    return JSON.parse(data) as T;
  }

  async store(data: T, key: string) {
    await this.asyncStorage.setItem(key, JSON.stringify(data));
  }
}
