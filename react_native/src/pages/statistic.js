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
  TouchableOpacity,
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
  const MAX_VALUE = 3000;
  const Y_LEVELS = 4;
  const X_LEVELS = 7;
  
  const incomePoints = [Point(0, 300), Point(1, 2), Point(2, 3), Point(3, 6), Point(4, 6), Point(5, 3.4), Point(6, 10)];
  const expensePoints = [Point(0, 2), Point(1, 4), Point(2, 7), Point(3, 10), Point(4, 12), Point(5, 6), Point(6, 0)];

  const [type, onChangeType] = React.useState(true);

  let displayType = type ? 'Income' : 'Expense';
  const incomeName = ['Transfer', 'Transfer', 'Paypal'];
  const expenseName = ['Starbucks', 'Youtube', 'Transfer', 'Transfer'];
  let incomeLength = incomeName.length;
  let expenseLength = expenseName.length;

  return (
    <View>
      <View style={group1.rectangle1}>
        <Text style={group1.statistic}>STATISTIC</Text>
      </View>
      <TouchableOpacity style={group1.wallet}>
        <Text style={group1.walletText}>Default Wallet </Text>
      </TouchableOpacity>
      <Text style={group1.startTime}>Apr 12, 2022</Text>
      <View style={group1.array} />
      <Text style={group1.endTime}>Apr 18, 2022</Text>
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
      <Text style={group1.records}>Top Spending</Text>
      <TouchableOpacity 
        style={group1.displayType}
        onPress={() => onChangeType(!type)}
      >
        <View style={[group1.displaySign, {backgroundColor: type ? 'rgb(37, 169, 105)' : 'rgb(249, 91, 81)'}]}/>
        <Text style={group1.displayText}>{displayType}</Text>
      </TouchableOpacity>
      {type ? 
        <View>
          <Card navigation={navigation} isExist={incomeLength >= 1} name={incomeName[0]} time={'Today'} cost={80.00} type={type} top={442} />
          <Card navigation={navigation} isExist={incomeLength >= 2} name={incomeName[1]} time={'Today'} cost={20000.00} type={type} top={522} />
          <Card navigation={navigation} isExist={incomeLength >= 3} name={incomeName[2]} time={'Today'} cost={20.00} type={type} top={602} />
          <Card navigation={navigation} isExist={incomeLength >= 4} name={incomeName[2]} time={'Today'} cost={240.00} type={type} top={682} />
        </View>  : 
        <View>
          <Card navigation={navigation} isExist={expenseLength >= 1} name={'Starbucks'} time={'Today'} cost={80.00} type={type} top={442} />
          <Card navigation={navigation} isExist={expenseLength >= 2} name={'Transfer'} time={'Today'} cost={20000.00} type={type} top={522} />
          <Card navigation={navigation} isExist={expenseLength >= 3} name={'Paypal'} time={'Today'} cost={20.00} type={type} top={602} />
          <Card navigation={navigation} isExist={expenseLength >= 4} name={'Youtube'} time={'Today'} cost={240.00} type={type} top={682} />
        </View>
      }
    </View>
  );
};

const group1 = StyleSheet.create({
  records: {
    /* Transactions records */
    position: 'absolute',
    width: 200,
    height: 22,
    top: 410,
    left: 28,

    color: 'rgb(34, 34, 34)',
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'left',
  },
  displayType: {
    /* Types */
    position: 'absolute',
    width: 80,
    height: 20,
    top: 410,
    left: 310,

    // backgroundColor: 'rgb(0, 0, 0)',
  },
  displayText: {
    left: 20,
    color: 'rgb(102, 102, 102)',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'left',
  },
  displaySign: {
    width: 10,
    height: 10,
    left: 5,
    top: 5,
    // backgroundColor: 'rgba(37, 169, 105, 0.7)',
    position: 'absolute',
    borderRadius: 50,
  },
  wallet: {
    position: 'absolute',
    width: 120,
    height: 30,
    top: 80,
    left: 145,

    backgroundColor: 'rgb(238, 248, 247)',
    // elevation: 2,
    borderRadius: 10,
  },
  walletText: {
    position: 'absolute',
    left: 11,
    top: 5,
    color: 'rgb(102, 102, 102)',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    textAlign: 'left',
  },
  startTime: {
    position: 'absolute',
    width: 120,
    height: 30,
    top: 130,
    left: 70,

    color: 'rgb(102, 102, 102)',
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'left',
  },
  endTime: {
    position: 'absolute',
    width: 120,
    height: 30,
    top: 130,
    left: 240,

    color: 'rgb(102, 102, 102)',
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'left',
  },
  array: {
    position: 'absolute',
    width: 50,
    height: 1,
    top: 140,
    left: 180,

    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    opacity: 20,
    // borderBottomColor: 'red',
    // color: 'rgb(0, 0, 0)',
  },
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
