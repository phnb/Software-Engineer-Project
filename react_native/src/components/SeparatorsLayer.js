
import React from 'react';
import { View, StyleSheet } from 'react-native';

import LevelSeparator from './LevelSeparator';

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

// SeparatorsLayer.propTypes = {
//   topValue: React.PropTypes.number.isRequired,
//   separators: React.PropTypes.number.isRequired,
//   height: React.PropTypes.number.isRequired
// };

const styles = StyleSheet.create({
  container: {
    position: 'absolute'
  }
});

export default SeparatorsLayer;
