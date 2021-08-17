import Cache from './Cache';
import type CacheContext from './CacheContext';
import _ from 'lodash';

type TCache<T> = {
  [K in keyof T]: Cache<T[K]>;
};

type CacheKeys<T> = keyof TCache<T>;

export default class DataContainer<T> {
  context: CacheContext;
  caches: TCache<T>;

  constructor(cacheNames: CacheKeys<T>[], context: CacheContext) {
    this.context = context;
    this.caches = _.fromPairs(
      this.createCache(cacheNames)
    ) as unknown as TCache<T>;
  }

  private createCache<K extends keyof T>(cacheNames: K[]) {
    return cacheNames.map((name) => {
      return [
        name,
        new Cache(
          this.context,
          (connector) => connector.load(String(name)),
          (value, connector) => connector.store(value, String(name))
        ),
      ];
    }) as [string, Cache<T[K]>][];
  }

  async set<K extends keyof T>(key: K, data: T[K]) {
    return this.caches[key].cache(data);
  }

  async get<K extends keyof T>(key: K) {
    return this.caches[key].get();
  }
}
