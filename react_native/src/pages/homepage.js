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
} from 'react-native';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Profile from './profile';
import Statistic from './statistic';
import Wallet from './wallet';
import AddExpense from './addExpense';
import { StackRouter } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const Homescreen = ({ navigation, route }) => {
  // const { accountId } = route.params;
  // const { username } = route.params;
  var accountId = global.accountId;
  var username = global.username;

  const [expense, OnchangeExpense] = useState(0);
  const [income, OnchangeIncome] = useState(0);
  const [balance, OnchangeBalance] = useState(0);
  // const [username, OnchangeUsername] = useState('');
  const [welcome, OnchangeWelcome] = useState('');

  var date = new Date();
  useEffect(() => {
    if (date.getHours() < 12){
      OnchangeWelcome('Good morning, ');
    }
    else if (date.getHours() < 18) {
      OnchangeWelcome('Good afternoon, ');
    } else {
      OnchangeWelcome('Good evening, ');
    }
    // console.log("start");
    // console.log(welcome);
  },[date])
  

  // console.log(cookie);
  // wzdnb 123
  // fetch('http://10.0.2.2:8000/app/record/', {
  //     method: 'post',
  //     // body: JSON.stringify({
  //     //   name: "wzd's psssresent",
  //     //   description: "wzdssssssss's real present",
  //     //   balance: 500
  //     // }),
  //     body: JSON.stringify({
  //       // is_many: true,
  //       is_income: true,
  //       name: "wzd's present",
  //       description: "wzd's real present",
  //       account_id: accountId,
  //       amount: 500
  //     }),
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Cookie': cookie,
  //     }
  //   }).then(response => {
  //     // let token = response.headers;
  //     // console.log("account");
  //     // console.log(token);
  //     return response.json();
  //   })
  //     .then(function(data){
  //       console.log("here");
  //       // for (let i = 0; i < data.length; i++) {
  //         const element = data; //[i];
  //         amount = element["amount"];
  //         is_income = element["is_income"];
  //         if (is_income) {
  //           amount += income;
  //           OnchangeIncome(amount);
  //         }
  //         else{
  //           amount += expense;
  //           OnchangeExpense(amount);
  //         }
  //       // }
  //     })

      // fetch('http://10.0.2.2:8000/auth/signout/').then(response => response.json())
      // .then(function(data){
      //   console.log(data);
      // })
  // fetch('http://10.0.2.2:8000/app/account/', {
  //   method: 'get',
  //   body: JSON.stringify({
  //     is_many: false,
  //     account_id: accountId
  //   }),
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // }).then(response => response.json())
  //   .then(function(data){
  //     bal = data["balance"];
  //     OnchangeBalance(bal);
  //   })
  return (
    <View>
      <View style={group1.rectangle1}>
        <View style={group1.ellipse1} />
        <View style={group1.ellipse2} />
        <View style={group1.ellipse3} />
        <Text style={group1.text1}> {welcome} </Text>
        <Text style={group1.text2}> {username} </Text>
      </View>
      <View style={group2.rectangle2} />
      <View style={group2.rectangle1}>
        {/* <View style={group2.frame1}>
          <View style={group2.arrayDown1}>
            <Image
              style={group2.Vector1}
              source={require('./imgs/Vector8.png')}
            />
            <Image
              style={group2.Vector2}
              source={require('./imgs/Vector9.png')}
            />
          </View>
        </View>
        <View style={group2.frame1}>
          <View style={group2.arrayDown2}>
            <Image
              style={group2.Vector3}
              source={require('./imgs/Vector8.png')}
            />
            <Image
              style={group2.Vector4}
              source={require('./imgs/Vector9.png')}
            />
          </View>
        </View> */}
      </View>
      <Text style={group2.expense}>Expenses</Text>
      <Text style={group2.expenseNum}>$ {expense}</Text>
      <Text style={group2.income}>Income</Text>
      <Text style={group2.incomeNum}>$ {income}</Text>
      <Text style={group2.total}>Total Balance</Text>
      <Text style={group2.totalBalance}>$ {balance} </Text>
      <Text style={group3.transactions}>Transactions History</Text>
      <Text style={group3.latest}>Latest 4 records</Text>
      <View style={group4.item1}>
        <Text style={group4.itemName}>Youtube</Text>
        <Image style={group4.img} source={require('./imgs/image1.png')} />
        <Text style={group4.itemDate}>Today</Text>
        <Text style={group4.itemMoney}> - $ 40.00</Text>
      </View>
      <View style={group4.item2}>
        <Text style={group4.itemName}>Paypal</Text>
        <Image style={group4.img} source={require('./imgs/image3.png')} />
        <Text style={group4.itemDate}>Yesterday</Text>
        <Text style={group4.itemMoney1}> + $ 240.00</Text>
      </View>
      <View style={group4.item3}>
        <Text style={group4.itemName}>Starbucks</Text>
        <Image style={group4.img} source={require('./imgs/image2.png')} />
        <Text style={group4.itemDate}>April 10, 2022</Text>
        <Text style={group4.itemMoney}> - $ 20.00</Text>
      </View>
      <View style={group4.item4}>
        <Text style={group4.itemName}>Paypal</Text>
        <Image style={group4.img} source={require('./imgs/image3.png')} />
        <Text style={group4.itemDate}>April 8, 2022</Text>
        <Text style={group4.itemMoney}> - $ 3000.00</Text>
      </View>
    </View>
  );
};

const Homepage = (navigation, route) => {
  // navigation.navigate('Homepage', {
  //   screen: 'Home',
  //   params: { accountId: 1 },
  // });
  // const accountId = route.params;
  // // const [acc, OnchangeAcc] = useState(0);
  // // OnchangeAcc(accountId);
  // const username = route.params;
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          let icon;
          if (route.name === 'Home') {
            icon = focused ? (
              <Image source={require('./imgs/Vector1.png')} />
            ) : (
              <Image source={require('./imgs/Vector.png')} />
            );
          } else if (route.name === 'Statistic') {
            icon = focused ? (
              <Image source={require('./imgs/Vector3.png')} />
            ) : (
              <Image source={require('./imgs/Vector2.png')} />
            );
          } else if (route.name === 'Add Expense') {
            icon = focused ? (
              <Image source={require('./imgs/Vector.png')} />
            ) : (
              <Image source={require('./imgs/Vector.png')} />
            );
          } else if (route.name === 'Wallet') {
            icon = focused ? (
              <Image source={require('./imgs/Vector5.png')} />
            ) : (
              <Image source={require('./imgs/Vector4.png')} />
            );
          } else if (route.name === 'Profile') {
            icon = focused ? (
              <Image source={require('./imgs/Vector7.png')} />
            ) : (
              <Image source={require('./imgs/Vector6.png')} />
            );
          }
          return icon;
        },
      })}>
      <Tab.Screen
        name="Home"
        component={Homescreen}
        options={{headerShown: false}}
        // initialParams={{accountId:1}}
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
        name="Wallet"
        component={Wallet}
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

const group1 = StyleSheet.create({
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
    // transform: -180.00,
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
    width: 110,
    height: 17,
    top: 54,
    left: 44,

    color: 'rgb(255, 255, 255)',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 17,
    textAlign: 'left',
  },
  text2: {
    /* Jared Dai */
    position: 'absolute',
    width: 167,
    height: 24,
    top: 78,
    left: 44,

    color: 'rgb(255, 255, 255)',
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
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
    // filter: blur(48px),
  },
  //   frame1: {
  //     /* Frame 1 */
  //     position: 'absolute',
  //     width: 24,
  //     height: 24,
  //     top: 236,
  //     left: 280,

  //     backgroundColor: 'rgba(255, 255, 255, 0.15)',
  //     borderRadius: 40,

  //     // /* 自动布局 */
  //     // display: 'flex',
  //     // flexDirection: 'row',
  //     // justifyContent: 'center',
  //     // alignItems: 'center',
  //   },
  //   arrayDown1: {
  //     /* arrow-down 1 */
  //     position: 'relative',
  //     width: 18,
  //     height: 18,

  //     // /* Inside Auto Layout */
  //     // order: 0,
  //     // flex-grow: 0,
  //     // margin: 0px 10px,
  //   },
  //   Vector1: {
  //     /* Vector */
  //     position: 'absolute',
  //     width: 7.88,
  //     height: 4.5,
  //     top: 7.31,
  //     left: 5.06,
  //   },
  //   Vector2: {
  //     /* Vector */
  //     position: 'absolute',
  //     width: 1.13,
  //     height: 11.25,
  //     top: 15.19,
  //     left: 8.44,
  //   },
  expense: {
    /* Expenses */
    position: 'absolute',
    width: 77,
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
    width: 53,
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
    width: 81,
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

const group4 = StyleSheet.create({
  img: {
    width: 40,
    height: 36,
    top: 16,
    left: 16,
  },
  item1: {
    /* item1 */
    position: 'absolute',
    width: 374,
    height: 70,
    top: 422,
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

    color: 'rgb(249, 91, 81)',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'right',
  },
  itemMoney1: {
    /* Today */
    position: 'absolute',
    width: 120,
    height: 24,
    top: 25,
    right: 15,

    color: 'rgb(37, 169, 105)',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'right',
  },
  item2: {
    /* item1 */
    position: 'absolute',
    width: 374,
    height: 70,
    top: 502,
    left: 20,

    backgroundColor: 'rgba(27, 92, 88, 0.1)',
    borderRadius: 12,
  },
  item3: {
    /* item1 */
    position: 'absolute',
    width: 374,
    height: 70,
    top: 582,
    left: 20,

    backgroundColor: 'rgba(27, 92, 88, 0.1)',
    borderRadius: 12,
  },
  item4: {
    /* item1 */
    position: 'absolute',
    width: 374,
    height: 70,
    top: 662,
    left: 20,

    backgroundColor: 'rgba(27, 92, 88, 0.1)',
    borderRadius: 12,
  },
});

export default Homepage;
