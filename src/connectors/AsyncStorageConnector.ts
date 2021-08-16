import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AsyncStorageCacheOptions } from '../CacheContext';

export default class AsyncStorageConnector {
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

  /**
   * TODO: Add generic type
   * Can return object or array
   */
  async load(key: string) {
    if (!this.isPersisted(key)) {
      throw new Error(`Key ${key} does not exist`);
    }

    const data = await this.asyncStorage.getItem(key);

    if (typeof data !== 'string') {
      throw new Error(`load did not return a string`);
    }

    const parsedData = JSON.parse(data);

    if (Array.isArray(parsedData)) return parsedData as any[];

    return parsedData as any;
  }

  /**
   * TODO: Add generic type
   * can handle object or array
   */
  async store(data: any | any[], key: string) {
    await this.asyncStorage.setItem(key, JSON.stringify(data));
  }
}
