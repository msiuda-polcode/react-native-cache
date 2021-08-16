import type CacheContext from './CacheContext';
import type { Connector } from './connectors/ConnectorFactory';
import ConnectorFactory from './connectors/ConnectorFactory';

export type LoadFunctionType<T> = (connector: Connector<T>) => Promise<T>;
export type StoreFunctionType<T> = (
  value: T,
  connector: Connector<T>
) => Promise<void>;

export default class Cache<T> {
  value: T | null = null;
  connector: Connector<T>;
  context: CacheContext;
  load: LoadFunctionType<T>;
  store: StoreFunctionType<T>;

  constructor(
    context: CacheContext,
    load: LoadFunctionType<T>,
    store: StoreFunctionType<T>
  ) {
    this.context = context;
    this.connector = new ConnectorFactory<T>(context).createConnector();
    this.load = load;
    this.store = store;
  }

  async get() {
    const value = this.value;

    if (!value) {
      const newValue = await this.load(this.connector);
      this.value = newValue;
      return newValue;
    }

    return value;
  }

  async cache(value: T) {
    await this.store(value, this.connector);
  }
}
