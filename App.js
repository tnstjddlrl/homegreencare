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


async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}


function App() {

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  const [pushToken, setPushToken] = useState('')
  const [isAuthorized, setIsAuthorized] = useState(false)

  const handlePushToken = useCallback(async () => {
    const enabled = await messaging().hasPermission()
    if (enabled) {
      const fcmToken = await messaging().getToken()
      if (fcmToken) setPushToken(fcmToken)
    } else {
      const authorized = await messaging.requestPermission()
      if (authorized) setIsAuthorized(true)
    }
  }, [])


  const saveDeviceToken = useCallback(async () => {
    if (isAuthorized) {
      const currentFcmToken = await firebase.messaging().getToken()
      if (currentFcmToken !== pushToken) {
        return saveTokenToDatabase(currentFcmToken)
      }
      return messaging().onTokenRefresh((token) => saveTokenToDatabase(token))
    }
  }, [pushToken, isAuthorized])

  useEffect(() => {
    requestUserPermission()
    try {
      handlePushToken()
      saveDeviceToken()

      setTimeout(() => {
        console.log(pushToken)
      }, 1000);
    } catch (error) {
      console.log(error)
      Alert.alert('토큰 받아오기 실패')
    }

  }, [])

  useEffect(() => {
    console.log(pushToken)
  }, [pushToken])


  return (
    <NavigationContainer>
      <Stack.Navigator headerMode={'none'}>
        <Stack.Screen name="메인웹뷰" component={Wb} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;