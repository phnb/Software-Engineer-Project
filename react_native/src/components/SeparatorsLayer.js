import React from 'react';
import { View, StyleSheet } from 'react-native';
import LevelSeparator from './LevelSeparator';


// Implemented for chart component
export const range = (n) => {
  return [...Array(n).keys()];
};

function createSeparator(totalCount, topValue, index, height) {
  return (
    <LevelSeparator
      key={index}
      label={topValue * (totalCount - index) / totalCount}
      height={height / totalCount}
    />
  );
}

function SeparatorsLayer({ topValue, separators, height, children, style }) {
  return (
    <View style={[styles.container, style]}>
      {range(separators + 1).map((separatorNumber) => {
        return createSeparator(separators, topValue, separatorNumber, height);
      })}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute'
  }
});

export default SeparatorsLayer;
