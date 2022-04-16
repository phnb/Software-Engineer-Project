import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Dimensions,
  Image,
  TextInput,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Homepage from './homepage';
var {width, height, scale} = Dimensions.get('window');
const Reg = ({navigation}) => {
  const [username, OnchangeUsername] = useState('');
  const [fname, OnchangeFname] = useState('');
  const [lname, OnchangeLname] = useState('');
  const [pwd, OnchangePwd] = useState('');
  const [email, OnchangeEmail] = useState('');
  const [pwdcon, OnchangePwdcon] = useState('');
  function submit(username, fname, lname, pwd, email, pwdcon){
    navigation.navigate('Login');
    // console.log(username);
  //   fetch('http://10.0.2.2:8000/auth/signin/', {
  //   method: 'post',
  //   body: JSON.stringify({
  //     username: username,
  //     password: pwd
  //   }),
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // }).then(function(data) {
  //   console.log(username);
  // })
  }
  return (
    <View style={styles.container}>
      <Image source={require('./imgs/icon.jpeg')} style={styles.iconStyle} />
      <TextInput placeholder={'please enter your username'} 
                clearButtonMode={'while-editing'} 
                style={styles.textInputStyle} 
                onChangeText={text => OnchangeUsername(text)}/>
      <TextInput placeholder={'Please enter your password'}
                 clearButtonMode={'while-editing'}
                 secureTextEntry={true}
                 selectionColor={'black'}
                 keyboardAppearance={'dark'} style={styles.textInputStyle} 
                 onChangeText={text => OnchangePwd(text)}/>
      {/* <View style={styles.loginBtnStyle}> */}
        {/* <Text style={{color: 'white'}}>sign in</Text> */}
      {/* </View> */}
      <Button 
        title="Sign in" 
        onPress={() => submit(username, pwd)}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'rgba(63, 135, 130, 255)',
  },
  iconStyle: {
    width: 120,
    height: 120,
    marginTop: 50,
    marginBottom: 100,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'white',
  },
  textInputStyle: {
    height: 38,
    width: width * 0.9,
    backgroundColor: 'white',
    marginBottom: 60,
    paddingLeft: 10,
    textAlign: 'left',
  },
  loginBtnStyle: {
    height: 35,
    width: width * 0.9,
    backgroundColor: 'blue',
    marginTop: 30,
    marginBottom: 20,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});
//输出类
export default Reg;