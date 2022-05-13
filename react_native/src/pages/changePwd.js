import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  Image,
  TextInput,
  Alert,
} from 'react-native';

var {width, height, scale} = Dimensions.get('window');

// Change password page implemented
const ChangePwd = ({navigation}) => {
  const [email, onChangeEmail] = useState('');
  const [pwd, onChangePwd] = useState('');
  const [pwdConfirm, onChangePwdConfirm] = useState('');
  const [border1, onChangeBorder1] = React.useState(false);
  const [border2, onChangeBorder2] = React.useState(false);
  const [border3, onChangeBorder3] = React.useState(false);

  // Submit new password after checking whether it's empty
  function submit(pwd, pwdConfirm) {
    if (pwd === '') {
        Alert.alert('New password cannot be empty!');
        return;
      }
    if (pwd !== pwdConfirm) {
      Alert.alert('Incorrect password confirmation!');
      return;
    }
    fetch('http://10.0.2.2:8000/auth/resetSend/', {
      method: 'post',
      body: JSON.stringify({
        email: email,
        pw1: pwd,
        pw2: pwdConfirm
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response=>response.json())
    .then(function(data) {
      success = data["success"];
      if (success){
        uname = data["username"]
        Alert.alert(
          "Welcome, " + uname + "!",
          "A confirmation email is sent...",
          [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate('Login');
              }
            }
          ]
        );
      }
      else{
        Alert.alert("sorry! \n Your account does not exit!");
      }      
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.rectangular1}>
        <Text style={styles.email}>Your email</Text>
        <TextInput
          placeholder={'Enter your email'}
          clearButtonMode={'while-editing'}
          secureTextEntry={false}
          selectionColor={'black'}
          keyboardAppearance={'dark'}
          style={[
            styles.emailenter,
            {
              borderColor: border3
                ? 'rgba(66,150,144,255)'
                : 'rgb(211, 211, 211)',
              borderWidth: border3 ? 2 : 1,
            },
          ]}
          onChangeText={text => onChangeEmail(text)}
          onFocus={() => onChangeBorder3(true)}
          onBlur={() => onChangeBorder3(false)}
          value={email}
        />
        <Text style={styles.name}>New Password</Text>
        <TextInput
          placeholder={'Enter your new password'}
          clearButtonMode={'while-editing'}
          secureTextEntry={true}
          selectionColor={'black'}
          keyboardAppearance={'dark'}
          style={[
            styles.username,
            {
              borderColor: border1
                ? 'rgba(66,150,144,255)'
                : 'rgb(211, 211, 211)',
              borderWidth: border1 ? 2 : 1,
            },
          ]}
          onChangeText={text => onChangePwd(text)}
          onFocus={() => onChangeBorder1(true)}
          onBlur={() => onChangeBorder1(false)}
          value={pwd}
        />
        <Text style={styles.pass}>Password Confirmation</Text>
        <TextInput
          placeholder={'Enter your password again'}
          clearButtonMode={'while-editing'}
          secureTextEntry={true}
          selectionColor={'black'}
          keyboardAppearance={'dark'}
          style={[
            styles.password,
            {
              borderColor: border2
                ? 'rgba(66,150,144,255)'
                : 'rgb(211, 211, 211)',
              borderWidth: border2 ? 2 : 1,
            },
          ]}
          onChangeText={text => onChangePwdConfirm(text)}
          onFocus={() => onChangeBorder2(true)}
          onBlur={() => onChangeBorder2(false)}
          value={pwdConfirm}
        />
        <View style={styles.button}>
          <Button
            onPress={() => submit(pwd, pwdConfirm)}
            color="#BCBCBC"
            title="Change password"
          />
        </View>
        <Text style={styles.notice}>* We will send a password change confirmation mail. Please check in your mailbox.</Text>
      </View>
      <Image source={require('./imgs/icon.jpeg')} style={styles.iconStyle} />
    </View>
  );
};

// Change password page  UI style
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'rgba(66,150,144,0.6)',
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
  email: {
    /* EMAIL */
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
  emailenter: {
    /* email enter*/
    position: 'absolute',
    width: 290,
    height: 40,
    top: 110,
    left: 30,
    borderColor: 'rgb(211, 211, 211)',
    borderWidth: 1,
    borderRadius: 8,
  },
  name: {
    /* NAME */
    position: 'absolute',
    width: 400,
    height: 40,
    top: 180,
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
    top: 210,
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
    top: 280,
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
    top: 310,
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
    top: 400,
    left: 70,

    backgroundColor: 'rgba(62, 124, 120, 0.1)',
    borderRadius: 40,
  },
  notice: {
    /* Notice */
    position: 'absolute',
    width: 280,
    height: 40,
    top: 460,
    left: 45,

    color: 'rgb(102, 102, 102)',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 14,
    textAlign: 'left',
  },
});

export default ChangePwd;