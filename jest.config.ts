import { defaults as tsjPreset } from 'ts-jest/presets';

const transformNodeModules = [
  'react-native',
  '@react-native-community',
  'rn-fetch-blob',
];

export default {
  preset: 'react-native',
  verbose: true,
  automock: false,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/src/@types/**',
    '!**/src/index.ts',
  ],
  modulePathIgnorePatterns: ['<rootDir>/example/node_modules', '<rootDir>/lib'],
  setupFiles: ['<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: [
    `node_modules/(?!${transformNodeModules.join('|')})`,
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  modulePaths: ['<rootDir>/src'],
  moduleDirectories: ['node_modules'],
  coverageDirectory: '<rootDir>/coverage',
  transform: {
    ...tsjPreset.transform,
    '\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
  },
};
