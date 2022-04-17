import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function LevelSeparator({ label, height }) {
  return (
    <View style={[styles.container, { height }]}>
      <Text style={styles.label}>
        {label.toFixed(0)}
      </Text>
      <View style={styles.separatorRow}/>
    </View>
  );
}

// LevelSeparator.propTypes = {
//   label: React.PropTypes.number.isRequired,
//   height: React.PropTypes.number.isRequired
// };

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    // textAlign: 'right',
    // width: 20,
    // position: 'absolute',
    // left: -30,

    color: 'rgb(102, 102, 102)',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 14,
    textAlign: 'left',
  },
  separatorRow: {
    width: 300,
    height: 1,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginHorizontal: 5,
  }
});
