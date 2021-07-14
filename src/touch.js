import React, { useEffect, useState } from 'react';
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

import TouchID from 'react-native-touch-id';

const Touch = () => {
    const [vertify, setVertify] = useState('지문 인증 필요')

    const optionalConfigObject = {
        title: 'Authentication Required', // Android
        imageColor: '#e00606', // Android
        imageErrorColor: '#ff0000', // Android
        sensorDescription: 'Touch sensor', // Android
        sensorErrorDescription: 'Failed', // Android
        cancelText: 'Cancel', // Android
        fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
        unifiedErrors: false, // use unified error messages (default false)
        passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
    };

    function touch() {
        TouchID.authenticate('to demo this react-native component', optionalConfigObject)
            .then(success => {
                setVertify('인증완료!')
                console.log(success)
            })
            .catch(error => {
                // Failure code
                Alert.alert('오류 발생!')
            });
    }

    useEffect(() => {
        touch()
    }, [])


    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Text>{vertify}</Text>

        </View>
    )
}

export default Touch