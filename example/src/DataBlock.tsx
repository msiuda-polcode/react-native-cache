import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

type Props<T> = {
  label: string;
  data: T[];
  renderItem?: (item: T) => JSX.Element;
};

function DataBlock<T>({ data, label, renderItem }: Props<T>) {
  return (
    <View style={styles.box}>
      <Text style={styles.label}>{label}</Text>
      <FlatList
        data={data}
        renderItem={({ item }) =>
          renderItem ? renderItem(item) : <Text>{item}</Text>
        }
        keyExtractor={() => Math.random().toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    margin: 5,
    padding: 10,
    borderWidth: 1,
  },
  label: {
    fontSize: 18,
    marginBottom: 16,
  },
});

export default DataBlock;
