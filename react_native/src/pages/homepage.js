import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Profile from './profile';
import Statistic from './statistic';
import Plan from './plan';
import AddExpense from './addExpense';
import Card from '../components/card';


const Tab = createBottomTabNavigator();

// Auxiliary function to change date format to UTC
function getBeforeDate(n) {
  var n = n;
  var d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

// Change date to user-friendly expression
function gettime(m_time){
  const m_date = new Date(m_time)
  const n_date = new Date();
  if (m_date.getDate() == n_date.getDate() && m_date.getMonth() == n_date.getMonth() && m_date.getFullYear() == n_date.getFullYear()){
    return "Today";
  }
  else{
    var t_date = new Date();
    t_date.setDate(n_date.getDate() - 1);
    if (m_date.getDate() == t_date.getDate() && m_date.getMonth() == t_date.getMonth() && t_date.getFullYear() == t_date.getFullYear()){
      return "Yesterday";
    }
    else{
      var date = m_date.toDateString();
      var list = date.split(' ');
      var formal_date = list[1] + ' ' + list[2] + ', ' + list[3];
      return formal_date;
    }
  }
}

// Home page implemented (the first page)
const Homescreen = ({ navigation, route }) => {
  var date = new Date();
  var accountId = global.accountId;
  var username = global.username;
  const [records, setRecords] = useState();
  const [expense, OnchangeExpense] = useState(0);
  const [test, OnchangeTest] = useState(true);
  const [income, OnchangeIncome] = useState(0);
  const [balance, OnchangeBalance] = useState(0);
  const [welcome, OnchangeWelcome] = useState('');
  const [len, OnchangeLen] = useState(0);

  // welcome language changes according to the day time
  useEffect(() => {
    if (date.getHours() < 12){
      OnchangeWelcome('Good morning, ');
    }
    else if (date.getHours() < 18) {
      OnchangeWelcome('Good afternoon, ');
    } else {
      OnchangeWelcome('Good evening, ');
    }
    date = new Date();
  },[test])
  
  // Get account information and record details from database
  useEffect(() => {
    var is_many = true;
    var is_many_time = true;
    var url = 'http://10.0.2.2:8000/app/record/';
    var end_time = new Date().toISOString();
    var start_time = getBeforeDate(7);
    fetch(`${url}?is_many=${is_many}&is_many_time=${is_many_time}&start_time=${start_time}&end_time=${end_time}&account_id=${global.accountId}`)
    .then(response => response.json())
      .then(function(data){
          const income_records = data["income_records"]; //[i];
          const outcome_records = data["outcome_records"];
          var amount = 0;
          for (let i = 0; i < income_records.length; i++) {
            const element = income_records[i];
            amount += element["amount"];
          }
          OnchangeIncome(amount);
          amount = 0;
          for (let i = 0; i < outcome_records.length; i++) {
            const element = outcome_records[i];
            amount += element["amount"];
          }
          OnchangeExpense(amount);
      }
    )
    is_many = true;
    var record_max_num = 4;
    fetch(`${url}?is_many=${is_many}&record_max_num=${record_max_num}&account_id=${global.accountId}`)
      .then(response => {
        if (response.status == 201){
          return response.json();
        }
        else{
          const n_arr = new Array();
          for (let i = 0; i < 4; i++){
            n_arr.push({"account": -1, "amount": 0, "created_time": "", "description": "", "id":-1, "is_income": true, "modified_time": "", "name": "", "plans": []});
          }
          OnchangeLen(0);
          setRecords(n_arr);
          return null
        }
      })
      .then(
        data => {
          if (data!=null){
            for (let i = 0; i < data.length; i++) {
              data[i]["modified_time"] = gettime(data[i]["modified_time"]);
            }
            let n_arr = data;
            let len_income = data.length > 4 ? 4 : data.length;
            if (len_income < 4){
              for (let i = 0; i < 4-len_income; i++){
                n_arr.push({"account": -1, "amount": 0, "created_time": "", "description": "", "id":-1, "is_income": true, "modified_time": "", "name": "", "plans": []});
              }
            }
            OnchangeLen(len_income);
            setRecords(n_arr);
          }
        }
      )
    is_many = false;
    url = 'http://10.0.2.2:8000/app/account/'
    fetch(`${url}?is_many=${is_many}&account_id=${global.accountId}`)
    .then(response => response.json())
      .then(function(data){
          var bal = data["balance"];
          OnchangeBalance(bal);
      }
    )
  },[test])

  return (
    <View>
      <View style={group1.rectangle1}>
        <View style={group1.ellipse1} />
        <View style={group1.ellipse2} />
        <View style={group1.ellipse3} />
        <Text style={group1.text1}> {welcome} </Text>
        <Text style={group1.text2}> {username} </Text>
        <TouchableOpacity
          style={group1.refresh}
          onPress={() => OnchangeTest(!test)}
        >
          <Image style={group1.refreshImg} source={require('./imgs/refresh.png')}/>
        </TouchableOpacity>
      </View>
      <View style={group2.rectangle2} />
      <View style={group2.rectangle1}>
      </View>
      <Text style={group2.total}>Total Balance</Text>
      <Text style={group2.totalBalance}>$ {balance} </Text>
      <Text style={group3.transactions}>Transactions History</Text>
      <Text style={group2.expense}>Expenses</Text>
      <Text style={group2.expenseNum}>$ {expense}</Text>
      <Text style={group2.income}>Income</Text>
      <Text style={group2.incomeNum}>$ {income}</Text>
      <Text style={group3.latest}>Latest 4 records</Text>
      {records ? 
      <View>
        <Card navigation={navigation} 
          isExist={len >= 1} 
          name={records[0]["name"]} 
          time={records[0]["modified_time"]} 
          cost={records[0]["amount"]} 
          type={records[0]["is_income"]} 
          top={422} 
          description={records[0]["description"]}
          id={records[0]["id"]}/>
        <Card navigation={navigation} 
          isExist={len >= 2} 
          name={records[1]["name"]} 
          time={records[1]["modified_time"]} 
          cost={records[1]["amount"]} 
          type={records[1]["is_income"]} 
          top={502} 
          description={records[1]["description"]}
          id={records[1]["id"]}/>
        <Card navigation={navigation} 
          isExist={len >= 3} 
          name={records[2]["name"]} 
          time={records[2]["modified_time"]} 
          cost={records[2]["amount"]} 
          type={records[2]["is_income"]} 
          top={582} 
          description={records[2]["description"]}
          id={records[2]["id"]}/>
        <Card navigation={navigation} 
          isExist={len >= 4} 
          name={records[3]["name"]} 
          time={records[3]["modified_time"]} 
          cost={records[3]["amount"]} 
          type={records[3]["is_income"]} 
          top={662} 
          description={records[3]["description"]}
          id={records[3]["id"]}/>
      </View> : <Text style={group1.noRecord}> No record yet !</Text>}
    </View>
  );
};

// Tab navigation inplemented
const Homepage = (navigation, route) => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          let icon;
          if (route.name === 'Home') {
            icon = focused ? (
              <Image style={group1.barImg} source={require('./imgs/Vector1.png')} />
            ) : (
              <Image style={group1.barImg1} source={require('./imgs/Vector.png')} />
            );
          } else if (route.name === 'Statistic') {
            icon = focused ? (
              <Image style={group1.barImg} source={require('./imgs/Vector3.png')} />
            ) : (
              <Image style={group1.barImg} source={require('./imgs/Vector2.png')} />
            );
          } else if (route.name === 'Add Expense') {
            icon = focused ? (
              <Image style={group1.barImg2} source={require('./imgs/add.png')} />
            ) : (
              <Image style={group1.barImg2} source={require('./imgs/add1.png')} />
            );
          } else if (route.name === 'Plan') {
            icon = focused ? (
              <Image style={group1.barImg} source={require('./imgs/Vector5.png')} />
            ) : (
              <Image style={group1.barImg} source={require('./imgs/Vector4.png')} />
            );
          } else if (route.name === 'Profile') {
            icon = focused ? (
              <Image style={group1.barImg} source={require('./imgs/Vector7.png')} />
            ) : (
              <Image style={group1.barImg} source={require('./imgs/Vector6.png')} />
            );
          }
          return icon;
        },
      })}>
      <Tab.Screen
        name="Home"
        component={Homescreen}
        options={{headerShown: false}}
        initialParams={{accountId:1}}
      />
      <Tab.Screen
        name="Statistic"
        component={Statistic}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Add Expense"
        component={AddExpense}
        options={{headerShown: false, showLabel: false}}
      />
      <Tab.Screen
        name="Plan"
        component={Plan}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

// Homepage UI style
const group1 = StyleSheet.create({
  noRecord: {
    /* Transactions history */
    position: 'absolute',
    width: 200,
    height: 30,
    top: 420,
    left: 140,

    color: 'rgb(102, 102, 102)',
    fontFamily: 'Inter',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 30,
    textAlign: 'left',
  },
  barImg1: {
    width: 35,
    height: 35,
  },
  barImg1: {
    width: 25,
    height: 25,
  },
  barImg: {
    width: 30,
    height: 30,
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
  rectangle1: {
    /* Rectangle 1 */
    position: 'absolute',
    width: 414,
    height: 247,
    backgroundColor: 'rgba(66,150,144,255)',
  },
  ellipse1: {
    /* Ellipse 1 */
    position: 'absolute',
    width: 212,
    height: 212,
    top: -15,
    left: 157,

    backgroundColot: 'rgba(255,255,255,22)',
    opacity: 0.1,
    // transform: -180.00,
  },
  ellipse2: {
    /* Ellipse 1 */
    position: 'absolute',
    width: 127,
    height: 127,
    top: -15,
    left: 186,

    backgroundColot: 'rgba(255,255,255,22)',
    opacity: 0.1,
  },
  ellipse3: {
    /* Ellipse 1 */
    position: 'absolute',
    width: 85,
    height: 85,
    top: -22,
    left: 127,

    backgroundColot: 'rgba(255,255,255,22)',
    opacity: 0.1,
    // transform: -180.00,
  },
  text1: {
    /* Good afternoon */
    position: 'absolute',
    width: 150,
    height: 20,
    top: 50,
    left: 44,

    color: 'rgb(255, 255, 255)',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    textAlign: 'left',
  },
  text2: {
    /* Jared Dai */
    position: 'absolute',
    width: 167,
    height: 30,
    top: 70,
    left: 44,

    color: 'rgb(255, 255, 255)',
    fontFamily: 'Inter',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 30,
    textAlign: 'left',
  },
});

const group2 = StyleSheet.create({
  rectangle1: {
    /* Rectangle 1 */
    position: 'absolute',
    width: 374,
    height: 201,
    top: 135,
    left: 20,

    backgroundColor: 'rgb(47, 126, 121)',
    borderRadius: 20,
  },
  rectangle2: {
    /* Rectangle 2 */
    position: 'absolute',
    width: 378,
    height: 113.42,
    top: 233.58,
    left: 29,

    backgroundColor: 'rgba(27, 92, 88, 0.2)',
    opacity: 0.8,
    borderRadius: 20,
  },
  expense: {
    /* Expenses */
    position: 'absolute',
    width: 90,
    height: 22,
    top: 246,
    left: 260,

    color: 'rgb(208, 230, 228)',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    textAlign: 'left',
  },
  income: {
    /* Income */
    position: 'absolute',
    width: 90,
    height: 19,
    top: 246,
    left: 48,

    color: 'rgb(208, 230, 228)',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    textAlign: 'left',
  },
  total: {
    /* total */
    position: 'absolute',
    width: 141,
    height: 19,
    top: 166,
    left: 48,

    color: 'rgb(255, 255, 255)',
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 19,
    textAlign: 'left',
  },
  expenseNum: {
    /* Expenses */
    position: 'absolute',
    width: 120,
    height: 24,
    top: 266,
    left: 260,

    color: 'rgb(255, 255, 255)',
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
    textAlign: 'left',
  },
  incomeNum: {
    /* income */
    position: 'absolute',
    width: 120,
    height: 24,
    top: 266,
    left: 48,

    color: 'rgb(255, 255, 255)',
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
    textAlign: 'left',
  },
  totalBalance: {
    /* Total balance */
    position: 'absolute',
    width: 160,
    height: 36,
    top: 188,
    left: 48,

    color: 'rgb(255, 255, 255)',
    fontFamily: 'Inter',
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 36,
    textAlign: 'left',
  },
});

const group3 = StyleSheet.create({
  transactions: {
    /* Transactions history */
    position: 'absolute',
    width: 200,
    height: 22,
    top: 376,
    left: 28,

    color: 'rgb(34, 34, 34)',
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'left',
  },
  latest: {
    /* Latest 5 records */
    position: 'absolute',
    width: 123,
    height: 17,
    top: 382,
    left: 288,

    color: 'rgb(34, 34, 34)',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 17,
    textAlign: 'left',
  },
});

export default Homepage;
