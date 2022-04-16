import React, {useState} from 'react';
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
// import TouchableButton from '../components/button';
var {width, height, scale} = Dimensions.get('window');

const LoginView = ({navigation}) => {
  const [username, OnchangeUsername] = useState('');
  const [pwd, OnchangePwd] = useState('');
  const [border1, onChangeBorder1] = React.useState(false);
  const [border2, onChangeBorder2] = React.useState(false);

  // function submit(username, pwd) {
  //   navigation.navigate('Homepage');
  //   //   fetch('http://10.0.2.2:8000/auth/signin/', {
  //   //   method: 'post',
  //   //   body: JSON.stringify({
  //   //     username: username,
  //   //     password: pwd
  //   //   }),
  //   //   headers: {
  //   //     'Content-Type': 'application/json'
  //   //   }
  //   // }).then(function(data) {
  //   // navigation.navigate('Homepage');
  //   //   console.log(username);
  function submit(username, pwd) {
    navigation.navigate('Homepage');
    fetch('http://10.0.2.2:8000/auth/signin/', {
      method: 'post',
      body: JSON.stringify({
        username: username,
        password: pwd,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(function (data) {
        if (!data.success) {
          navigation.navigate('OnBoarding');
        }
        else{
          let account_id = data["default_account_id"];
          console.log(account_id);
          OnchangeAccountId(account_id)
          // navigation.setParams(accountId);
          navigation.navigate('Homepage', {accountId:accountId});
        }
      });
    // .then(function(data) {
    //   console.log(data.json);
    //   // navigation.navigate('Homepage');
    //   // console.log(username);
    // })
  }
  return (
    <View style={styles.container}>
      {/* <Text style={styles.login}>Login</Text> */}
      <View style={styles.rectangular1}>
        <Text style={styles.name}>Username or email address</Text>
        <TextInput
          // placeholder={'Enter your username or email address'}
          clearButtonMode={'while-editing'}
          style={[
            styles.username,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              borderColor: border1
                ? 'rgba(66,150,144,255)'
                : 'rgb(211, 211, 211)',
              borderWidth: border1 ? 2 : 1,
            },
          ]}
          // style={styles.username}
          onChangeText={text => OnchangeUsername(text)}
          onFocus={() => onChangeBorder1(true)}
          onBlur={() => onChangeBorder1(false)}
          value={username}
        />
        <Text style={styles.pass}>Password</Text>
        <TextInput
          // placeholder={'Enter your password'}
          clearButtonMode={'while-editing'}
          secureTextEntry={true}
          selectionColor={'black'}
          keyboardAppearance={'dark'}
          style={[
            styles.password,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              borderColor: border2
                ? 'rgba(66,150,144,255)'
                : 'rgb(211, 211, 211)',
              borderWidth: border2 ? 2 : 1,
            },
          ]}
          onChangeText={text => OnchangePwd(text)}
          onFocus={() => onChangeBorder2(true)}
          onBlur={() => onChangeBorder2(false)}
          value={pwd}
        />
        {/* <View style={styles.loginBtnStyle}> */}
        {/* <Text style={{color: 'white'}}>sign in</Text> */}
        {/* </View> */}
        <View style={styles.button}>
          <Button
            onPress={() => submit(username, pwd)}
            color="rgba(63,135,130,255)"
            title="Sign in"
          />
        </View>
        <View style={styles.forgetButton}>
          <Button
            // onPress={() => submit(username, pwd)}
            color="#BCBCBC"
            title="Forget password?"
          />
        </View>
      </View>
      <Image source={require('./imgs/icon.jpeg')} style={styles.iconStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'rgba(66,150,144,1)',
  },
  login: {
    /* login */
    position: 'absolute',
    width: 301,
    height: 60,
    top: 20,
    left: 56,

    color: 'rgb(0, 0, 0)',
    fontFamily: 'Inter',
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 38,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  rectangular1: {
    /* Rectangle 1 */
    position: 'absolute',
    width: 360,
    height: 550,
    top: 150,
    left: 25,

    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 40,
    elevation: 8,
    // box-shadow: 0px 22px 35px rgba(0, 0, 0, 0.08),
  },
  iconStyle: {
    width: 120,
    height: 120,
    marginTop: 70,
    marginBottom: 100,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'white',
  },
  name: {
    /* NAME */
    position: 'absolute',
    width: 400,
    height: 40,
    top: 80,
    left: 30,

    color: 'rgb(0, 0, 0)',
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'left',
  },
  username: {
    /* userneame*/
    position: 'absolute',
    width: 290,
    height: 40,
    top: 110,
    left: 30,
    borderColor: 'rgb(211, 211, 211)',
    borderWidth: 1,
    borderRadius: 8,

    // position: 'absolute',
    // width: 270,
    // height: 38,
    // top: 50,
    // left: 25,

    // backgroundColor: 'white',
    // marginBottom: 60,
    // paddingLeft: 10,
    // textAlign: 'left',
  },
  pass: {
    /* passwordText */
    position: 'absolute',
    width: 400,
    height: 40,
    top: 190,
    left: 30,

    color: 'rgb(0, 0, 0)',
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'left',
  },
  password: {
    /* password */
    position: 'absolute',
    width: 290,
    height: 40,
    top: 220,
    left: 30,
    borderColor: 'rgb(211, 211, 211)',
    borderWidth: 1,
    borderRadius: 8,
    // height: 35,
    // width: width * 0.9,
    // backgroundColor: 'blue',
    // marginTop: 30,
    // marginBottom: 20,
    // paddingLeft: 10,
    // justifyContent: 'center',
    // alignItems: 'center',
    // borderRadius: 8,
  },
  button: {
    /* Submit */
    position: 'absolute',
    width: 200,
    height: 48,
    top: 300,
    left: 70,

    backgroundColor: 'rgba(62, 124, 120, 0.1)',
    borderRadius: 40,
  },
  // submitButton: {
  //   borderRadius: 40,
  // },
  forgetButton: {
    /* Submit */
    position: 'absolute',
    width: 200,
    height: 48,
    top: 360,
    left: 70,

    backgroundColor: 'rgba(188,188,188,0.2)',
    borderRadius: 40,
  },
});

export default LoginView;
