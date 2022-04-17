import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  Button,
  TouchableOpacity,
} from 'react-native';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';


function Card({navigation, name, time, cost, type, top }) {
  let str = type ? '+' : '-';
  return (
    <TouchableOpacity 
      style={[group1.item, {top: top}]}
      onPress={() => navigation.navigate('CardInfo')}
    >
      <Text style={group1.itemName}>{name}</Text>
      <Image style={group1.img} source={require('../pages/imgs/image3.png')} />
      <Text style={group1.itemDate}>{time}</Text>
      <Text style={[group1.itemMoney, {color: type ? 'rgb(249, 91, 81)' : 'rgb(37, 169, 105)'}]}>{str + ' $ ' + cost}</Text>
    </TouchableOpacity>
  );
};

const group1 = StyleSheet.create({
  img: {
    width: 40,
    height: 36,
    top: 16,
    left: 16,
  },
  item: {
    /* item */
    position: 'absolute',
    width: 374,
    height: 70,
    left: 20,

    backgroundColor: 'rgba(27, 92, 88, 0.1)',
    borderRadius: 12,
  },
  itemName: {
    /* item1 name*/
    position: 'absolute',
    width: 88,
    height: 19,
    top: 10,
    left: 78,

    color: 'rgb(0, 0, 0)',
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'left',
  },
  itemDate: {
    /* Today */
    position: 'absolute',
    width: 120,
    height: 16,
    top: 35,
    left: 78,

    color: 'rgb(102, 102, 102)',
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 16,
    textAlign: 'left',
  },
  itemMoney: {
    /* Today */
    position: 'absolute',
    width: 120,
    height: 24,
    top: 25,
    right: 15,

    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'right',
  },
});

export default Card;