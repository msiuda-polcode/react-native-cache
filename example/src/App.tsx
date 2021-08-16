import * as React from 'react';

import { StyleSheet, Text, SafeAreaView } from 'react-native';
import { DataContainer, CacheOptions } from 'react-native-cache';
import DataBlock from './DataBlock';

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

export default function App() {
  const [numbers, setNumbers] = React.useState<number[]>([]);
  const [strings, setStrings] = React.useState<string[]>([]);
  const [custom, setCustom] = React.useState<{
    firstName: string | null;
    lastName: string | null;
  }>({ firstName: null, lastName: null });
  const [customArray, setCustomArray] = React.useState<
    {
      firstName: string;
      lastName: string;
    }[]
  >([]);

  React.useEffect(() => {
    (async () => {
      try {
        await dataContainer.set('numbers', [1, 2, 3, 4, 5, 5, 6]);
        await dataContainer.set('strings', ['1', '2', '3', '4', '5']);
        await dataContainer.set('custom', {
          firstName: 'John',
          lastName: 'Doe',
        });
        await dataContainer.set('customArray', [
          { firstName: 'John', lastName: 'Doe' },
          { firstName: 'Albert', lastName: 'Einstein' },
        ]);
      } catch (err) {
        console.log('err: ', err);
      }
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      try {
        const num = await dataContainer.get('numbers');
        const str = await dataContainer.get('strings');
        const cust = await dataContainer.get('custom');
        const custArr = await dataContainer.get('customArray');

        setNumbers(num);
        setStrings(str);
        setCustom(cust);
        setCustomArray(custArr);
      } catch (err) {
        console.log('err: ', err);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <DataBlock data={numbers} label="Numbers" />

      <DataBlock data={strings} label="Strings" />

      <DataBlock
        data={[custom]}
        label="Custom"
        renderItem={({ firstName, lastName }) => (
          <Text>{`${firstName} ${lastName}`}</Text>
        )}
      />

      <DataBlock
        data={customArray}
        label="Custom Array"
        renderItem={({ firstName, lastName }) => (
          <Text>{`${firstName} ${lastName}`}</Text>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
