import CacheContext from '../CacheContext';
import Cache from '../Cache';

describe('Cache', () => {
  let cache: Cache<number>;

  beforeEach(() => {
    cache = new Cache(
      new CacheContext({ type: 'asyncStorage' }),
      (connector) => connector.load('number'),
      (val, connector) => connector.store(val, 'number')
    );
  });

  it('should return value', async () => {
    const loadSpy = jest.spyOn(cache.connector, 'load').mockResolvedValue(2);

    const result = await cache.get();

    expect(result).toEqual(2);
    expect(loadSpy).toHaveBeenCalled();
    expect(loadSpy).toHaveBeenCalledWith('number');
  });

  it('should return saved value', async () => {
    cache.value = 2;

    const result = await cache.get();

    expect(result).toEqual(2);
  });

  it('should store value', async () => {
    const storeSpy = jest.spyOn(cache.connector, 'store');

    await cache.cache(2);

    expect(storeSpy).toHaveBeenCalled();
    expect(storeSpy).toBeCalledWith(2, 'number');
  });
});
