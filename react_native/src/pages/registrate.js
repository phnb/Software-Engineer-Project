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
  Alert,
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
// var {width, height, scale} = Dimensions.get('window');

const Registration = ({navigation}) => {
  const [username, onChangeUsername] = useState('');
  const [email, onChangEmail] = useState('');
  const [pwd, onChangePwd] = useState('');
  const [pwdConfirm, onChangePwdConfirm] = useState('');
  const [border1, onChangeBorder1] = React.useState(false);
  const [border2, onChangeBorder2] = React.useState(false);
  const [border3, onChangeBorder3] = React.useState(false);
  const [border4, onChangeBorder4] = React.useState(false);

  function submit(username, email, pwd, pwdConfirm) {
    if (username === '') {
      Alert.alert('Username cannot be empty!');
      return;
    }
    if (email === '') {
      Alert.alert('Email cannot be empty!');
      return;
    }
    var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (!reg.test(email)) {
      Alert.alert('Invaid email!');
      return;
    }
    if (pwd === '') {
      Alert.alert('Password cannot be empty!');
      return;
    }
    if (pwd !== pwdConfirm) {
      Alert.alert('Incorrect password confirmation!');
      return;
    }
      fetch('http://10.0.2.2:8000/auth/register/', {
      method: 'post',
      body: JSON.stringify({
        username: username,
        email: email,
        firstname: "ddg",
        lastname: "nb",
        password: pwd,
        confirmpassword: pwdConfirm
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(data) {
      Alert.alert(
        "Welcome!",
        "A confirmation email is sent...",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate('Login');
              console.log(username);
            }
          }
        ]
      );
    })
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.login}>Login</Text> */}
      <View style={styles.rectangular1}>
        <Text style={styles.name}>Username</Text>
        <TextInput
          placeholder={'Enter your nickname'}
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
          onChangeText={text => onChangeUsername(text)}
          onFocus={() => onChangeBorder1(true)}
          onBlur={() => onChangeBorder1(false)}
          value={username}
        />
        <Text style={styles.emailAddress}>Email Address</Text>
        <TextInput
          placeholder={'Enter your email address'}
          clearButtonMode={'while-editing'}
          style={[
            styles.email,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              borderColor: border2
                ? 'rgba(66,150,144,255)'
                : 'rgb(211, 211, 211)',
              borderWidth: border2 ? 2 : 1,
            },
          ]}
          onChangeText={text => onChangEmail(text)}
          onFocus={() => onChangeBorder2(true)}
          onBlur={() => onChangeBorder2(false)}
          value={email}
        />
        <Text style={styles.pass}>Password</Text>
        <TextInput
          placeholder={'Enter your password'}
          clearButtonMode={'while-editing'}
          secureTextEntry={true}
          selectionColor={'black'}
          keyboardAppearance={'dark'}
          style={[
            styles.password,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              borderColor: border3
                ? 'rgba(66,150,144,255)'
                : 'rgb(211, 211, 211)',
              borderWidth: border3 ? 2 : 1,
            },
          ]}
          onChangeText={text => onChangePwd(text)}
          onFocus={() => onChangeBorder3(true)}
          onBlur={() => onChangeBorder3(false)}
          value={pwd}
        />
        <Text style={styles.passConfirm}>Password Confirmation</Text>
        <TextInput
          placeholder={'Enter your password again'}
          clearButtonMode={'while-editing'}
          secureTextEntry={true}
          selectionColor={'black'}
          keyboardAppearance={'dark'}
          style={[
            styles.passwordConfirm,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              borderColor: border4
                ? 'rgba(66,150,144,255)'
                : 'rgb(211, 211, 211)',
              borderWidth: border4 ? 2 : 1,
            },
          ]}
          onChangeText={text => onChangePwdConfirm(text)}
          onFocus={() => onChangeBorder4(true)}
          onBlur={() => onChangeBorder4(false)}
          value={pwdConfirm}
        />
        <View style={styles.button}>
          <Button
            onPress={() => submit(username, email, pwd, pwdConfirm)}
            color="rgba(63,135,130,255)"
            title="register"
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
    backgroundColor: 'rgba(66,150,144,0.2)',
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
  emailAddress: {
    /* email */
    position: 'absolute',
    width: 400,
    height: 40,
    top: 170,
    left: 30,

    color: 'rgb(0, 0, 0)',
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'left',
  },
  email: {
    /* password */
    position: 'absolute',
    width: 290,
    height: 40,
    top: 200,
    left: 30,
    borderColor: 'rgb(211, 211, 211)',
    borderWidth: 1,
    borderRadius: 8,
  },
  pass: {
    /* passwordText */
    position: 'absolute',
    width: 400,
    height: 40,
    top: 260,
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
    top: 290,
    left: 30,
    borderColor: 'rgb(211, 211, 211)',
    borderWidth: 1,
    borderRadius: 8,
  },
  passConfirm: {
    /* passwordText */
    position: 'absolute',
    width: 400,
    height: 40,
    top: 350,
    left: 30,

    color: 'rgb(0, 0, 0)',
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'left',
  },
  passwordConfirm: {
    /* password */
    position: 'absolute',
    width: 290,
    height: 40,
    top: 380,
    left: 30,
    borderColor: 'rgb(211, 211, 211)',
    borderWidth: 1,
    borderRadius: 8,
  },
  button: {
    /* Submit */
    position: 'absolute',
    width: 200,
    height: 48,
    top: 470,
    left: 70,

    backgroundColor: 'rgba(62, 124, 120, 0.1)',
    borderRadius: 40,
  },
  // submitButton: {
  //   borderRadius: 40,
  // },
});

export default Registration;
