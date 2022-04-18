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
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const Plan = () => {
  var days = 14;
  var remainBudget = 5000;
  var dailyRemain = remainBudget / days;
  const [press, OnchangePress] = useState(true);
  const [budget, OnchangeBudget] = useState(0);
  const [confirm, OnchangeConfirm] = useState(false);

  return (
    <View>
      <View style={group1.rectangle1}>
        <Text style={group1.plan}>PLAN</Text>
      </View>
      <Text style={group1.planNote}>* Make your monthly budget plan !</Text>
      <View style={group1.dashboard}>
        <Image style={group1.dashboardImg} source={require('./imgs/dashboard.png')}/>
        <Text style={group1.dashboardText}>Budget Dashboard</Text>
      </View>
      <View style={[group1.rectangle2, {borderColor: remainBudget >= 0 ? 'rgba(37, 169, 105, 0.1)' : 'rgba(249, 91, 81, 0.5)'}]}>
        <Text style={[group1.month, {color: remainBudget >= 0 ? 'rgb(67, 136, 131)' : 'rgb(249, 91, 81)'}]}>April</Text>
        <Text style={group1.remainBudget}>Remaining Budget</Text>
        <Text style={group1.remainBudget1}>$ {remainBudget}</Text>
        <Text style={group1.remainDay}>This month remains {days} days</Text>
        <Text style={group1.remainDaily}>Daily remaining is less than $ {dailyRemain.toFixed(0)}</Text>
      </View>
      {remainBudget >= 0 ? <Text style={group1.remain1}>Yay~ You still have spare money to buy latiao !</Text>
      : <Text style={group1.remain2}>Oops, it seems you have gone bankrupt this month !</Text>}
      <TouchableOpacity
        style={group1.add}
        onPress={() => OnchangePress(!press)}
      >
        <Image style={group1.addImg} source={require('./imgs/add2.png')}/>
        <Text style={group1.addBudget}>Add Budget</Text>
      </TouchableOpacity>
      {press ? <View></View> :
      <View>
        <TextInput
          placeholder={'Budget for this month'}
          selectionColor={'rgba(0, 0, 0, 0.5)'}
          style={group1.inputBudget}
          onChangeText={text => OnchangeBudget(text)}
          value={budget}
        />
        <TouchableOpacity
          style={group1.confirm}
          onPress={() => OnchangeConfirm(!confirm)}
        >
          {remainBudget >= 0 ?  
          <Image style={group1.confirmImg} source={require('./imgs/confirm.png')}/>
          : <Image style={group1.confirmImg} source={require('./imgs/confirm2.png')}/>}
        </TouchableOpacity>
      </View>
      }
    </View>
  );
};

const group1 = StyleSheet.create({
  confirm: {
    position: 'absolute',
    width: 25,
    height: 25,
    top: 547,
    left: 280,
    borderRadius: 40,
  },
  confirmImg: {
    width: 25,
    height: 25,
  },
  inputBudget: {
    position: 'absolute',
    width: 150,
    height: 40,
    top: 540,
    left: 120,
    borderColor: 'rgb(211, 211, 211)',
    borderWidth: 1,
    borderRadius: 8,
  },
  add: {
    /* add */
    position: 'absolute',
    width: 160,
    height: 30,
    top: 500,
    left: 120,
  },
  addImg: {
    left: 20,
    width: 20,
    height: 20,
  },
  addBudget: {
    top: -30,
    left: 20,
    color: "rgba(0,0,0,0.5)",
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 38,
    textAlign: 'center',
  },
  remain1: {
    position: 'absolute',
    width: 330,
    height: 30,
    top: 405,
    right: 40,

    fontFamily: 'Inter',
    color: 'rgb(67, 136, 131)',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 30,
    textAlign: 'right',
  },
  remain2: {
    /* month */
    position: 'absolute',
    width: 330,
    height: 30,
    top: 405,
    right: 40,

    fontFamily: 'Inter',
    color: 'rgb(249, 91, 81)',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 30,
    textAlign: 'right',
  },
  month: {
    /* month */
    position: 'absolute',
    width: 330,
    height: 30,
    top: 20,

    fontFamily: 'Inter',
    // color: 'rgb(67, 136, 131)',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    textAlign: 'center',
  },
  remainDaily: {
    /* remainBudget */
    position: 'absolute',
    width: 360,
    height: 30,
    top: 150,
    // left: 50,

    color: "rgba(0,0,0,0.5)",
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 38,
    textAlign: 'center',
  },
  remainDay: {
    /* remainBudget */
    position: 'absolute',
    width: 330,
    height: 30,
    top: 120,
    // left: 50,

    color: "rgba(0,0,0,0.5)",
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 38,
    textAlign: 'center',
  },
  remainBudget1: {
    /* remainBudget */
    position: 'absolute',
    width: 330,
    height: 45,
    top: 90,

    color: "rgb(0,0,0)",
    fontFamily: 'Inter',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 38,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  remainBudget: {
    /* remainBudget */
    position: 'absolute',
    width: 330,
    height: 30,
    top: 60,
    // left: 50,

    color: "rgba(0,0,0,0.5)",
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 38,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  rectangle2: {
    position: 'absolute',
    top: 200,
    left: 40,
    width: 340,
    height: 200,

    backgroundColor: 'rgb(255, 255, 255)',
    borderWidth: 2,
    // borderColor: 'rgba(0, 0, 0, 0.01)',
    borderColor: 'rgba(37, 169, 105, 0.1)',
    borderRadius: 20,
    elevation: 1,
  },
  dashboardText: {
    left: 15,
    top: -24,

    fontFamily: 'Inter',
    color: 'rgb(67, 136, 131)',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 30,
    textAlign: 'center',
  },
  dashboard: {
    position: 'absolute',
    width: 200,
    height: 30,
    top: 140,
    left: 110,
  },
  dashboardImg: {
    width: 20,
    height: 20,
  },
  rectangle1: {
    /* Rectangle 1 */
    position: 'absolute',
    width: 414,
    height: 247,

    backgroundColor: 'rgb(238, 248, 247)',
  },
  plan: {
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
  planNote: {
    /* Connect your bank account to deposit & fund */
    position: 'absolute',
    width: 200,
    height: 30,
    top: 80,
    left: 120,

    color: 'rgb(67, 136, 131)',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 14,
    textAlign: 'left',
  }
});

export default Plan;
