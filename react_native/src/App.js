import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnBoarding from './pages/onBoarding';
import Homepage from './pages/homepage';
import LoginView from './pages/login';
import Registration from './pages/registrate';
import ChangePwd from './pages/changePwd';
import CardInfo from './pages/cardInfo';

// SplashScreen implemented
const SplashScreen = () => {
  return (
    <View style={styles.background}>
      <Text style={styles.text}>Monager</Text>
    </View>
  );
};

const Stack = createNativeStackNavigator();

// Navigation to different page
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="OnBoarding">
        {/* <Stack.Navigator initialRouteName='Homepage'> */}
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OnBoarding"
          component={OnBoarding}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Homepage"
          component={Homepage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={LoginView}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Registration"
          component={Registration}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ChangePwd"
          component={ChangePwd}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CardInfo"
          component={CardInfo}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Splashscreen UI style
const styles = StyleSheet.create({
  background: {
    /* Rectangle */
    position: 'absolute',
    width: 420,
    height: 890,
    top: 2.61,
    left: -3,
    backgroundColor: 'rgba(63, 135, 130, 255)',
  },
  text: {
    position: 'absolute',
    width: 220,
    height: 60,
    top: 300,
    left: 100,
    color: 'white',
    fontFamily: 'Inter',
    fontSize: 40,
    fontWeight: '800',
    lineHeight: 60,
    textAlign: 'center',
  },
});

export default App;
