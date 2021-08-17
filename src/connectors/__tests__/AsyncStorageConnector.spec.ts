import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorageConnector from '../AsyncStorageConnector';
import { data } from '../../__mocks__/data.mock';

describe('AsyncStorageConnector', () => {
  let asyncStorageConnector: AsyncStorageConnector<typeof data>;

  beforeEach(() => {
    asyncStorageConnector = new AsyncStorageConnector({ type: 'asyncStorage' });
  });

  it('stores data', async () => {
    const storageSpy = jest.spyOn(AsyncStorage, 'setItem');

    await asyncStorageConnector.store(data, 'user');

    expect(storageSpy).toHaveBeenCalled();
    expect(storageSpy).toHaveBeenCalledWith('user', JSON.stringify(data));
  });

  describe('load', () => {
    it('loads data properly', async () => {
      const storageSpy = jest
        .spyOn(AsyncStorage, 'getItem')
        .mockResolvedValue(JSON.stringify(data));

      const result = await asyncStorageConnector.load('user');

      expect(storageSpy).toHaveBeenCalled();
      expect(storageSpy).toHaveBeenCalledWith('user');
      expect(result).toEqual(data);
    });

    it('throws not found error', async () => {
      const storageSpy = jest
        .spyOn(AsyncStorage, 'getItem')
        .mockResolvedValue(null);

      try {
        await asyncStorageConnector.load('user');
      } catch (err) {
        expect(err.message).toEqual('Key user does not exist');
        expect(err).toBeInstanceOf(Error);
        expect(storageSpy).toHaveBeenCalled();
        expect(storageSpy).toHaveBeenCalledWith('user');
      }
    });
  });

  it('clears data', async () => {
    const storageSpy = jest.spyOn(AsyncStorage, 'clear');

    await asyncStorageConnector.clearStorage();

    expect(storageSpy).toHaveBeenCalled();
  });

  describe('Cache flow', () => {
    it('adds data and displays it', async () => {
      const storageSetSpy = jest.spyOn(AsyncStorage, 'setItem');
      const storageGetSpy = jest
        .spyOn(AsyncStorage, 'getItem')
        .mockResolvedValue(JSON.stringify(data));

      await asyncStorageConnector.store(data, 'users');

      expect(storageSetSpy).toHaveBeenCalled();
      expect(storageSetSpy).toHaveBeenCalledWith('users', JSON.stringify(data));

      const result = await asyncStorageConnector.load('users');

      expect(storageGetSpy).toHaveBeenCalled();
      expect(storageGetSpy).toHaveBeenCalledWith('users');
      expect(result).toStrictEqual(JSON.parse(JSON.stringify(data)));
    });
  });
});
