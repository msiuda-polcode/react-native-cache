import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AsyncStorageCacheOptions } from '../CacheContext';

export default class AsyncStorageConnector<T> {
  options: AsyncStorageCacheOptions;
  asyncStorage: typeof AsyncStorage;

  constructor(options: AsyncStorageCacheOptions) {
    this.options = options;
    this.asyncStorage = AsyncStorage;
  }

  async clearStorage() {
    await this.asyncStorage.clear();
  }

  async load(key: string) {
    const data = await this.asyncStorage.getItem(key);

    if (typeof data !== 'string') {
      throw new Error(`Key ${key} does not exist`);
    }

    return JSON.parse(data) as T;
  }

  async store(data: T, key: string) {
    await this.asyncStorage.setItem(key, JSON.stringify(data));
  }
}
