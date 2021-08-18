import React, { useEffect, useState, useCallback } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Wb from './src/wb';

const Stack = createStackNavigator();

import messaging from '@react-native-firebase/messaging';





function App() {

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(JSON.stringify(remoteMessage.notification.title).replace(/"/gi, ""), JSON.stringify(remoteMessage.notification.body).replace(/"/gi, ""));
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator headerMode={'none'}>
        <Stack.Screen name="메인웹뷰" component={Wb} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;