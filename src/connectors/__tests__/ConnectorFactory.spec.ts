import AsyncStorageConnector from '../AsyncStorageConnector';
import BlobStorageConnector from '../BlobStorageConnector';
import ConnectorFactory from '../ConnectorFactory';
import CacheContext from '../../CacheContext';

describe('ConnectorFactory', () => {
  let connectorFactory: ConnectorFactory<number>;

  it('creates blob connector', () => {
    connectorFactory = new ConnectorFactory(new CacheContext({ type: 'blob' }));

    const connector = connectorFactory.createConnector();

    expect(connector).toBeDefined();
    expect(connector).toBeInstanceOf(BlobStorageConnector);
  });

  it('creates async storage connector', () => {
    connectorFactory = new ConnectorFactory(
      new CacheContext({ type: 'asyncStorage' })
    );

    const connector = connectorFactory.createConnector();

    expect(connector).toBeDefined();
    expect(connector).toBeInstanceOf(AsyncStorageConnector);
  });
});
