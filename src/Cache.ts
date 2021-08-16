import type CacheContext from './CacheContext';
import type { Connector } from './connectors/ConnectorFactory';
import ConnectorFactory from './connectors/ConnectorFactory';

/**
 * TODO: Add generic to the load and store functions
 */
export type LoadFunctionType = (connector: Connector) => Promise<any>;
export type StoreFunctionType = (
  value: any,
  connector: Connector
) => Promise<void>;

export default class Cache {
  value: any | null = null; // TODO: Add generic
  connector: Connector;
  context: CacheContext;
  load: LoadFunctionType;
  store: StoreFunctionType;

  constructor(
    context: CacheContext,
    load: LoadFunctionType,
    store: StoreFunctionType
  ) {
    this.context = context;
    this.connector = new ConnectorFactory(context).createConnector();
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

  async cache(value: any | any[]) {
    await this.store(value, this.connector);
  }
}
