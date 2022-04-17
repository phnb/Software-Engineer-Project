import React from 'react';
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
  TextInput,
  Icon,
} from 'react-native';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
// import LevelSeparator from './LevelSeparator';

import Card from '../components/card';
import SeparatorsLayer from '../components/SeparatorsLayer';
import PointsPath from '../components/PointsPath';
import { Point } from '../components/pointUtils';
import { startingPoint, vectorTransform } from '../components/Scaler';

const Statistic = ({navigation}) => {
  const lightBlue = '#40C4FE';
  const green = '#53E69D';
  const MAX_VALUE = 20;
  const Y_LEVELS = 4;
  const X_LEVELS = 7;
  
  const incomePoints = [Point(0, 0), Point(1, 2), Point(2, 3), Point(3, 6), Point(4, 6), Point(5, 3.4), Point(6, 10)];
  const expensePoints = [Point(0, 2), Point(1, 4), Point(2, 7), Point(3, 10), Point(4, 12), Point(5, 6), Point(6, 0)];

  return (
    <View>
      <View style={group1.rectangle1}>
        <Text style={group1.statistic}>STATISTIC</Text>
      </View>
      <View style={styles.rectangular}>
        <View style={styles.container}>
          <SeparatorsLayer topValue={MAX_VALUE} separators={Y_LEVELS} height={100}>
            <PointsPath
              color='rgba(37, 169, 105, 1)'
              pointList={incomePoints.map(
                (point) => vectorTransform(point, MAX_VALUE, X_LEVELS)
              )}
              opacity={0.5}
              startingPoint={startingPoint}
            />
            <PointsPath
              color='rgba(249, 91, 81, 1)'
              pointList={expensePoints.map(
                (point) => vectorTransform(point, MAX_VALUE, X_LEVELS)
              )}
              opacity={0.5}
              startingPoint={startingPoint}
            />
          </SeparatorsLayer>
          <View style={styles.horizontalScale}>
            <Text style={styles.date}>Mon</Text>
            <Text style={styles.date}>Tue</Text>
            <Text style={styles.date}>Wen</Text>
            <Text style={styles.date}>Thur</Text>
            <Text style={styles.date}>Fri</Text>
            <Text style={styles.date}>Sat</Text>
            <Text style={styles.date}>Sun</Text>
          </View>
        </View>
        <Text style={styles.expense}>Expense</Text>
        <View style={styles.expenseSign}/>
        <Text style={styles.income}>Income</Text>
        <View style={styles.incomeSign}/>
      </View>
      <Card navigation={navigation} name={'Youtube'} time={'Today'} cost={240.00} type={true} top={422} />
      <Card navigation={navigation} name={'Starbucks'} time={'Today'} cost={80.00} type={false} top={502} />
      <Card navigation={navigation} name={'Transfer'} time={'Today'} cost={20000.00} type={true} top={582} />
      <Card navigation={navigation} name={'Paypal'} time={'Today'} cost={20.00} type={true} top={662} />
    </View>
  );
};

const group1 = StyleSheet.create({
  rectangle1: {
    /* Rectangle 1 */
    position: 'absolute',
    width: 414,
    height: 247,

    backgroundColor: 'rgb(238, 248, 247)',
  },
  statistic: {
    /* statistic */
    position: 'absolute',
    width: 150,
    height: 30,
    top: 44,
    left: 130,

    color: 'rgb(0, 0, 0)',
    fontFamily: 'Inter',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    textAlign: 'center',
  },
});



const styles = StyleSheet.create({
  rectangular: {
    position: 'absolute',
    width: 380,
    height: 220,
    top: 160,
    left: 15,

    backgroundColor: 'rgb(255, 255, 255)',
    elevation: 4,
    // box-shadow: 0px 22px 35px rgba(0, 0, 0, 0.08),
    borderRadius: 10,
  },
  date: {
    color: 'rgb(102, 102, 102)',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 14,
    textAlign: 'left',
  },
  container: {
    top: -20,
    // height: 100,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalScale: {
    top: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 20,
    width: 290,
  },
  expense: {
    position: 'absolute',
    width: 80,
    height: 30,
    top: 180,
    left: 110,

    color: 'rgb(102, 102, 102)',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'left',
  },
  expenseSign: {
    position: 'absolute',
    width: 10,
    height: 10,
    top: 185,
    left: 90,

    backgroundColor: 'rgba(249, 91, 81, 0.7)',
    position: 'absolute',
    borderRadius: 50,
  },
  income: {
    position: 'absolute',
    width: 80,
    height: 30,
    top: 180,
    left: 210,

    color: 'rgb(102, 102, 102)',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'left',
  },
  incomeSign: {
    position: 'absolute',
    width: 10,
    height: 10,
    top: 185,
    left: 190,

    backgroundColor: 'rgba(37, 169, 105, 0.7)',
    position: 'absolute',
    borderRadius: 50,
  },
});

export default Statistic;
