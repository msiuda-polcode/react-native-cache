# react-native-cache

Cache module for React Native

## Installation

```sh
npm install react-native-cache @react-native-community/async-storage rn-fetch-blob
```

## Usage

```ts
import { DataContainer, CacheOptions } from 'react-native-cache';

type CachedValues = {
  numbers: number[];
  strings: string[];
  custom: { firstName: string; lastName: string };
  customArray: { firstName: string; lastName: string }[];
};

const cacheOptions: CacheOptions = {
  type: 'blob',
};

const dataContainer = new DataContainer<CachedValues>(
  ['custom', 'customArray', 'numbers', 'strings'],
  {
    options: cacheOptions,
  }
);
```

### Cache value

```ts
// ...

await dataContainer.set('numbers', [1, 2, 3, 4, 5, 6]);

// ...
```

### Get value

```ts
// ...

const numbers = await dataContainer.get('numbers');

// ...
```

## Example

Full example is available [here](https://github.com/msiuda-polcode/react-native-cache/tree/main/example).

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
