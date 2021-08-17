import DataContainer from '../DataContainer';
import { data } from '../__mocks__/data.mock';

type TestData = {
  users: typeof data;
  numbers: number[];
};

describe('DataContainer', () => {
  let dataContainer: DataContainer<TestData>;

  const keys: (keyof TestData)[] = ['numbers', 'users'];

  beforeEach(() => {
    dataContainer = new DataContainer(keys, {
      options: { type: 'asyncStorage' },
    });
  });

  it('should set cache', () => {
    keys.forEach(async (key) => {
      const storeSpy = jest.spyOn(dataContainer.caches[key], 'cache');

      await dataContainer.set(key, key === 'numbers' ? [1, 3, 4, 5] : data);

      expect(storeSpy).toHaveBeenCalled();
      expect(storeSpy).toHaveBeenCalledWith(
        key === 'numbers' ? [1, 3, 4, 5] : data
      );
    });
  });

  it('should get cache', () => {
    keys.forEach(async (key) => {
      const loadSpy = jest
        .spyOn(dataContainer.caches[key], 'load')
        .mockResolvedValue(key === 'numbers' ? [1, 2, 3] : data);

      const result = await dataContainer.get(key);

      expect(result).toStrictEqual(key === 'numbers' ? [1, 2, 3] : data);
      expect(loadSpy).toHaveBeenCalled();
      expect(loadSpy).toHaveBeenCalledWith(dataContainer.caches[key].connector);
    });
  });
});
