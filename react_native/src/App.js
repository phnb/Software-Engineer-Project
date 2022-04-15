import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
// import LinearGradient from "react-native-linear-gradient";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnBoarding from './pages/onBoarding';
import Homepage from './pages/homepage';

const splashScreen = () => {
  return (
    <View style={styles.background}>
      <Text style={styles.text}>Monager</Text>
    </View>
  );
};

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen
          name="splashScreen"
          component={splashScreen}
          options={{headerShown: false}}
        /> */}
        {/* <Stack.Screen
          name="OnBoarding"
          component={OnBoarding}
          options={{headerShown: false}}
        /> */}
        <Stack.Screen
          name="Homepage"
          component={Homepage}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  background: {
    /* Rectangle */
    position: 'absolute',
    width: 420,
    height: 890,
    top: 2.61,
    left: -3,
    backgroundColor: 'rgba(63, 135, 130, 255)',

    // background: url(),
    // opacity: 0.99,
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