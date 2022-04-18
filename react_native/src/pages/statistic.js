import React, { useState, useEffect }  from 'react';
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

function getBeforeDate(n) {
  var n = n;
  var d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function getDateInfo(n){
  const date = new Date();
  date.setDate(date.getDate()-n);
  var s_date = date.toDateString();
  var list = s_date.split(' ');
  // var formal_date = list[1] + ' ' + list[2] + ', ' + list[3];
  // console.log(formal_date);
  return list[2];
}
function getendInfo(n){
  const date = new Date();
  date.setDate(date.getDate()-n);
  var s_date = date.toDateString();
  var list = s_date.split(' ');
  var formal_date = list[1] + ' ' + list[2] + ', ' + list[3];
  // console.log(formal_date);
  return formal_date;
}

function gettime(m_time){
  const m_date = new Date(m_time)
  const n_date = new Date();
  // n_date.setDate(n_date.getDate()+1)
  if (m_date.getDate() == n_date.getDate() && m_date.getMonth() == n_date.getMonth() && m_date.getFullYear() == n_date.getFullYear()){
    // console.log("Today");
    return "Today";
  }
  else{
    var t_date = new Date();
    t_date.setDate(n_date.getDate() - 1);
    if (m_date.getDate() == t_date.getDate() && m_date.getMonth() == t_date.getMonth() && t_date.getFullYear() == t_date.getFullYear()){
      // console.log("Yesterday");
      return "Yesterday";
    }
    else{
      console.log(m_date.toDateString())
      var date = m_date.toDateString();
      var list = date.split(' ');
      var formal_date = list[1] + ' ' + list[2] + ', ' + list[3];
      console.log(formal_date);
      return formal_date;
    }
  }
}

const Statistic = ({navigation}) => {
  const [test, OnchangeTest] = useState(true);
  const lightBlue = '#40C4FE';
  const green = '#53E69D';
  const [MAX_VALUE, OnchangeMAX_VALUE] = React.useState(10);
  const Y_LEVELS = 4;
  const X_LEVELS = 7;
  
  // const incomePoints = [Point(0, 300), Point(1, 2), Point(2, 3), Point(3, 6), Point(4, 6), Point(5, 3.4), Point(6, 10)];
  const [expensePoints, setExpensePoints] = React.useState([Point(0, 0), Point(1, 0), Point(2, 0), Point(3, 0), Point(4, 0), Point(5, 0), Point(6, 0)]);
  const [incomePoints, setIncomePoints] = React.useState([Point(0, 0), Point(1, 0), Point(2, 0), Point(3, 0), Point(4, 0), Point(5, 0), Point(6, 0)]);

  const [len, OnchangeLen] = React.useState(0);

  const [type, onChangeType] = React.useState(true);

  let displayType = type ? 'Income' : 'Expense';
  const [incomeRecords, setIncomeRecords] = React.useState();
  // const [expenseRecords, setExpenseRecords] = React.useState();

  React.useEffect(() => {
    console.log("new");
    var is_many = true;
    var is_many_time = true;
    var url = 'http://10.0.2.2:8000/app/record/';
    var end_time = new Date().toISOString();
    var start_time = getBeforeDate(7);
    fetch(`${url}?is_many=${is_many}&is_many_time=${is_many_time}&start_time=${start_time}&end_time=${end_time}&account_id=${global.accountId}`)
    .then(response => response.json())
      .then(function(data){
          // console.log(data);
          let in_arr = new Array();
          let ele;
          if (type){
            ele = data["income_records"];
          }
          else{
            ele = data["outcome_records"]
          }
          // console.log(ele);
          // let out_arr = new Array();
          let len_income = ele.length > 4 ? 4 : ele.length;
          OnchangeLen(len_income);
          for (let i = 0; i < len_income; i++) {
            ele[i]["modified_time"] = gettime(ele[i]["modified_time"]);
            in_arr.push(ele[i]);
          }
          if (len_income < 4){
            for (let i = 0; i < 4-len_income; i++){
              in_arr.push({"account": -1, "amount": 0, "created_time": "", "description": "", "id":-1, "is_income": true, "modified_time": "", "name": "", "plans": []});
            }
          }
          // let len_outcome = data["outcome_records"].length > 4 ? 4 : data["outcome_records"].length;
          // for (let i = 0; i < len_outcome; i++) {
          //   data["outcome_records"][i]["modified_time"] = gettime(data["outcome_records"][i]["modified_time"]);
          //   out_arr.push(data["outcome_records"][i]);
          // }
          setIncomeRecords(in_arr); //[i];
          // setExpenseRecords(out_arr);
      }
    )

      // {"incomerecords", "income": [{"x": 0, "y": 500},{"x": 1, "y": 500}]}
  }, [type])

  React.useEffect(() => {
    var is_many = true;
    var is_many_time = true;
    var url = 'http://10.0.2.2:8000/app/record/';
    // var end_time = new Date().toISOString();
    // var start_time = getBeforeDate(7);
    const in_P = [Point(0, 0), Point(1, 0), Point(2, 0), Point(3, 0), Point(4, 0), Point(5, 0), Point(6, 0)];
    const out_P = [Point(0, 0), Point(1, 0), Point(2, 0), Point(3, 0), Point(4, 0), Point(5, 0), Point(6, 0)];

    for (let m = 0; m < 7; m++) {
      var start_time = getBeforeDate(7-m);
      var end_time = getBeforeDate(6-m);
      fetch(`${url}?is_many=${is_many}&is_many_time=${is_many_time}&start_time=${start_time}&end_time=${end_time}&account_id=${global.accountId}`)
      .then(response => response.json())
        .then(function(data){
          var amount = 0;
          for (let i = 0; i < data["income_records"].length; i++) {
            const element = data["income_records"][i]["amount"];
            amount += element;
          }
          if (amount > MAX_VALUE){
            OnchangeMAX_VALUE(amount);
          }
          in_P[m] = Point(m, amount);
          // console.log(in_P);
          setIncomePoints(in_P);
          amount = 0;
          for (let i = 0; i < data["outcome_records"].length; i++) {
            const element = data["outcome_records"][i]["amount"];
            amount += element;
          }
          if (amount > MAX_VALUE){
            OnchangeMAX_VALUE(amount);
          }
          out_P[m] = Point(m, amount);
          // console.log(in_P);
          setExpensePoints(out_P);
        }
      )
    }
  }, [])

  return (
    <View>
      <View style={group1.rectangle1}>
        <Text style={group1.statistic}>STATISTIC</Text>
      </View>
      <TouchableOpacity
          style={group1.refresh}
          onPress={() => OnchangeTest(!test)}
        >
          <Image style={group1.refreshImg} source={require('./imgs/refresh.png')}/>
        </TouchableOpacity>
      <TouchableOpacity style={group1.wallet}>
        <Text style={group1.walletText}>Default Wallet </Text>
      </TouchableOpacity>
      <Text style={group1.startTime}>{getendInfo(6)}</Text>
      <View style={group1.array} />
      <Text style={group1.endTime}>{getendInfo(0)}</Text>
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
            <Text style={styles.date}>{getDateInfo(6)}</Text>
            <Text style={styles.date}>{getDateInfo(5)}</Text>
            <Text style={styles.date}>{getDateInfo(4)}</Text>
            <Text style={styles.date}>{getDateInfo(3)}</Text>
            <Text style={styles.date}>{getDateInfo(2)}</Text>
            <Text style={styles.date}>{getDateInfo(1)}</Text>
            <Text style={styles.date}>{getDateInfo(0)}</Text>
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
      {incomeRecords ? 
        <View>
          <Card navigation={navigation} 
            isExist={len >= 1} 
            name={incomeRecords[0]["name"]} 
            time={incomeRecords[0]["modified_time"]} 
            cost={incomeRecords[0]["amount"]} 
            type={type} 
            top={442} 
            description={incomeRecords[0]["description"]}
            id={incomeRecords[0]["id"]} />
          <Card navigation={navigation} 
            isExist={len >= 2} 
            name={incomeRecords[1]["name"]} 
            time={incomeRecords[1]["modified_time"]} 
            cost={incomeRecords[1]["amount"]} 
            type={type} 
            top={522} 
            description={incomeRecords[1]["description"]}
            id={incomeRecords[1]["id"]} />
          <Card navigation={navigation} 
            isExist={len >= 3} 
            name={incomeRecords[2]["name"]} 
            time={incomeRecords[2]["modified_time"]} 
            cost={incomeRecords[2]["amount"]} 
            type={type} 
            top={602} 
            description={incomeRecords[2]["description"]} 
            id={incomeRecords[2]["id"]}/>
          <Card navigation={navigation} 
            isExist={len >= 4} 
            name={incomeRecords[3]["name"]} 
            time={incomeRecords[3]["modified_time"]} 
            cost={incomeRecords[3]["amount"]} 
            type={type} 
            top={682} 
            description={incomeRecords[3]["description"]} 
            id={incomeRecords[3]["id"]}/>
          {/* <Card navigation={navigation} isExist={incomeRecords.length >= 2} name={incomeRecords[incomeRecords.length > 1 ? 1 : incomeRecords.length]["name"]} time={incomeRecords[1]["modified_time"]} cost={incomeRecords[1]["amount"]} type={type} top={522} description={incomeRecords[1]["description"]} />
          <Card navigation={navigation} isExist={incomeRecords.length >= 3} name={incomeRecords[incomeRecords.length > 2 ? 2 : incomeRecords.length]["name"]} time={incomeRecords[2]["modified_time"]} cost={incomeRecords[2]["amount"]} type={type} top={602} description={incomeRecords[2]["description"]} />
          <Card navigation={navigation} isExist={incomeRecords.length >= 4} name={incomeRecords[incomeRecords.length > 3 ? 3 : incomeRecords.length]["name"]} time={incomeRecords[3]["modified_time"]} cost={incomeRecords[3]["amount"]} type={type} top={682} description={incomeRecords[3]["description"]}/> */}
        </View>  : <Text style={group1.noRecord}> No record yet !</Text>}
    </View>
  );
};

const group1 = StyleSheet.create({
  noRecord: {
    /* Transactions history */
    position: 'absolute',
    width: 200,
    height: 30,
    top: 450,
    left: 140,

    color: 'rgb(102, 102, 102)',
    fontFamily: 'Inter',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 30,
    textAlign: 'left',
  },
  refresh: {
    /* Refersh */
    position: 'absolute',
    width: 20,
    height: 20,
    top: 50,
    left: 350,

    color: 'rgb(255, 255, 255)',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    textAlign: 'left',

  },
  refreshImg: {
    width: 20,
    height: 20,
  },
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
