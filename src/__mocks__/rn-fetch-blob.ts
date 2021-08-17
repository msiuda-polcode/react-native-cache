import path from 'path';

type MockFilesType = Record<string, string>;
const mockFiles: MockFilesType = {};

function deleteAllMockFiles() {
  for (const p in mockFiles) {
    delete mockFiles[p];
  }
}

function writeMockFile(
  file: string,
  content: string,
  _unusedEncoding: string
): Promise<void> {
  const filePath = path.normalize(file);
  mockFiles[filePath] = content;
  return Promise.resolve();
}

function readMockFile(file: string, _unusedEncoding: string): Promise<string> {
  const filePath = path.normalize(file);
  return Promise.resolve(mockFiles[filePath]);
}

function existsMock(file: string): Promise<boolean> {
  const filePath = path.normalize(file);
  const exists = filePath in mockFiles;
  const isParentOfExisting = Object.keys(mockFiles).some((fp) =>
    fp.startsWith(file)
  );
  return Promise.resolve(exists || isParentOfExisting);
}

function lsMock(p: string): Promise<Array<string>> {
  const filesInPath = Object.keys(mockFiles).filter((filePath) =>
    filePath.startsWith(p)
  );
  return Promise.resolve(filesInPath);
}

function unlink(file: string): Promise<void> {
  const filePath = path.normalize(file);
  Object.keys(mockFiles).forEach((p) => {
    const slicedPath = p.slice(0, filePath.length);

    if (
      filePath === p ||
      (filePath === slicedPath && p[filePath.length] === '/')
    ) {
      delete mockFiles[p];
    }
  });
  return Promise.resolve();
}

export default {
  DocumentDir: (): void => {},
  ImageCache: {
    get: {
      clear: (): void => {},
    },
  },
  fs: {
    ls: jest.fn<Promise<Array<string>>, [string]>(lsMock),
    exists: jest.fn<Promise<boolean>, [string]>(existsMock),
    writeFile: jest.fn<Promise<void>, [string, string, string]>(writeMockFile),
    readFile: jest.fn<Promise<any>, [string, string]>(readMockFile),
    unlink: jest.fn<Promise<void>, [string]>(unlink),
    _reset: jest.fn<void, []>(deleteAllMockFiles),
    dirs: {
      MainBundleDir: 'path/to/mainBundleDir',
      CacheDir: 'path/to/cacheDir',
      DocumentDir: 'path/to/documentDir',
    },
  },
};
