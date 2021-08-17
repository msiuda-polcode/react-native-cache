import BlobStorageConnector from '../BlobStorageConnector';
import RNFetchBlob from '../../__mocks__/rn-fetch-blob';
import { data } from '../../__mocks__/data.mock';

describe('BlobStorageConnector', () => {
  let blobStorageConnector: BlobStorageConnector<typeof data>;

  beforeEach(() => {
    RNFetchBlob.fs._reset();
    blobStorageConnector = new BlobStorageConnector({ type: 'blob' });
  });

  it('should set default options', () => {
    expect(blobStorageConnector.options).toStrictEqual({
      type: 'blob',
      contentVersion: 'v1',
      cacheDirPath: RNFetchBlob.fs.dirs.DocumentDir,
    });
  });

  it('checks if the data is persisted', async () => {
    const existsSpy = jest
      .spyOn(RNFetchBlob.fs, 'exists')
      .mockResolvedValue(true);

    await blobStorageConnector.isPersisted('user');

    expect(existsSpy).toHaveBeenCalled();
    expect(existsSpy).toHaveBeenCalledWith('user');
  });

  it('clears data', async () => {
    const unlinkSpy = jest.spyOn(RNFetchBlob.fs, 'unlink');

    await blobStorageConnector.clearStorage();

    expect(unlinkSpy).toHaveBeenCalled();
    expect(unlinkSpy).toHaveBeenCalledWith(RNFetchBlob.fs.dirs.DocumentDir);
  });

  it('stores data', async () => {
    const writeFileSpy = jest.spyOn(RNFetchBlob.fs, 'writeFile');

    await blobStorageConnector.store(data, 'users');

    expect(writeFileSpy).toHaveBeenCalled();
    expect(writeFileSpy).toHaveBeenCalledWith(
      `${RNFetchBlob.fs.dirs.DocumentDir}/content/v1/users.json`,
      JSON.stringify(data),
      'utf8'
    );
  });

  describe('load', () => {
    it('loads data properly', async () => {
      const readFileSpy = jest
        .spyOn(RNFetchBlob.fs, 'readFile')
        .mockResolvedValue(JSON.stringify(data));

      const existsSpy = jest
        .spyOn(RNFetchBlob.fs, 'exists')
        .mockResolvedValue(true);

      const result = await blobStorageConnector.load('users');

      expect(result).toStrictEqual(data);
      expect(readFileSpy).toHaveBeenCalled();
      expect(readFileSpy).toHaveBeenCalledWith(
        `${RNFetchBlob.fs.dirs.DocumentDir}/content/v1/users.json`,
        'utf8'
      );

      expect(existsSpy).toHaveBeenCalled();
      expect(existsSpy).toHaveBeenCalledWith(
        `${RNFetchBlob.fs.dirs.DocumentDir}/content/v1/users.json`
      );
    });

    it('throws not found error', async () => {
      const existsSpy = jest
        .spyOn(RNFetchBlob.fs, 'exists')
        .mockResolvedValue(false);

      try {
        await blobStorageConnector.load('users');
      } catch (err) {
        expect(err.message).toEqual(
          `File ${RNFetchBlob.fs.dirs.DocumentDir}/content/v1/users.json does not exist`
        );
        expect(err).toBeInstanceOf(Error);
        expect(existsSpy).toHaveBeenCalled();
        expect(existsSpy).toHaveBeenCalledWith(
          `${RNFetchBlob.fs.dirs.DocumentDir}/content/v1/users.json`
        );
      }
    });

    it('throws wrong type error', async () => {
      const existsSpy = jest
        .spyOn(RNFetchBlob.fs, 'exists')
        .mockResolvedValue(true);

      const readFileSpy = jest
        .spyOn(RNFetchBlob.fs, 'readFile')
        .mockResolvedValue(null);

      try {
        await blobStorageConnector.load('users');
      } catch (err) {
        expect(err.message).toEqual('readFile did not return a string');
        expect(err).toBeInstanceOf(Error);
        expect(existsSpy).toHaveBeenCalled();
        expect(existsSpy).toHaveBeenCalledWith(
          `${RNFetchBlob.fs.dirs.DocumentDir}/content/v1/users.json`
        );
        expect(readFileSpy).toHaveBeenCalled();
        expect(readFileSpy).toHaveBeenCalledWith(
          `${RNFetchBlob.fs.dirs.DocumentDir}/content/v1/users.json`,
          'utf8'
        );
      }
    });
  });

  // it('stores data', async () => {
  //   const storageSpy = jest.spyOn(RNFetchBlob.fs, '');
  // });
});
