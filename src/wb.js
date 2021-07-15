
import React, { useRef, useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    BackHandler,
    ActivityIndicator
} from 'react-native';

import { WebView } from 'react-native-webview';

import RNExitApp from 'react-native-exit-app';

import TouchID from 'react-native-touch-id';

import DeviceInfo from 'react-native-device-info';


var rnw
var cbc = false;

const Wb = () => {

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hwbp",
            function () {
                if (cbc && rnw) {
                    rnw.goBack();
                    return true;
                } else if (cbc == false) {
                    Alert.alert('앱을 종료하시겠습니까?', '', [
                        {
                            text: "No",
                            onPress: () => console.log("Cancel Pressed")
                        },
                        { text: "Yes", onPress: () => RNExitApp.exitApp() }
                    ])
                    return true;
                }
            }
        );
        return () => backHandler.remove();
    }, []);

    const optionalConfigObject = {
        title: '지문인식 필요', // Android
        imageColor: '#e00606', // Android
        imageErrorColor: '#ff0000', // Android
        sensorDescription: '터치 센서', // Android
        sensorErrorDescription: '실패', // Android
        cancelText: '취소', // Android
        fallbackLabel: '비밀번호 입력', // iOS (if empty, then label is hidden)
        unifiedErrors: false, // use unified error messages (default false)
        passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
    };

    function touch(id) {
        TouchID.authenticate('지문 인식', optionalConfigObject)
            .then(success => {
                console.log(success)
                rnw.postMessage(id + '/1')
                console.log('전송 : ' + id + '/1')

            }).catch(error => {
                // Failure code
                // Alert.alert('지문 인식 오류 발생!')
                console.log(success)
                rnw.postMessage(id + '/0')
                console.log('전송 : ' + id + '/0')

            });
    }

    function onMessage(event) {
        console.log(event.nativeEvent.data);

        if (event.nativeEvent.data == 'touchid') {

        }

        if (event.nativeEvent.data == 'deviceid') {
            try {
                let uniqueId = DeviceInfo.getUniqueId();
                rnw.postMessage(uniqueId)
                console.log('전송 : ' + uniqueId)
            } catch (error) {
                console.log(error)
                Alert.alert('나중에 다시 시도해주세요.', '증상이 계속되면 고객센터로 연락주세요.', [
                    { text: "확인", onPress: () => RNExitApp.exitApp() }
                ])
            }
        }

        if (event.nativeEvent.data == 'deviceid/check') {
            try {
                let uniqueId = DeviceInfo.getUniqueId();
                touch(uniqueId)
                // rnw.postMessage(uniqueId + '/1')
                // console.log('전송 : ' + uniqueId + '/1')
            } catch (error) {
                console.log(error)
                Alert.alert('나중에 다시 시도해주세요.', '증상이 계속되면 고객센터로 연락주세요.', [
                    { text: "확인", onPress: () => RNExitApp.exitApp() }
                ])
            }
        }


    }

    useEffect(() => {
        // touch()
        let uniqueId = DeviceInfo.getUniqueId();
        console.log(uniqueId)
    }, [])

    return (
        <SafeAreaView style={{flex:1}}>
        <WebView
            ref={wb => { rnw = wb }}
            onMessage={event => {
                onMessage(event)
            }}
            onLoadEnd={() => {
                // rnw.postMessage('hello')
            }}
            source={{ uri: 'http://homegreencare001.cafe24.com/' }}
            style={{ width: '100%', height: '100%' }}
            onNavigationStateChange={(navState) => { cbc = navState.canGoBack; }}
            renderLoading={() => (
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <ActivityIndicator size="large" />
                </View>
            )}
        />
        </SafeAreaView>
    )
}



export default Wb;
