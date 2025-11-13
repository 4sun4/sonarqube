import React, { useEffect, useState } from 'react';
import { View, } from 'react-native';
import Styles from '../../Util/Styles'
import { Image } from 'react-native-elements'
import { StackActions } from '@react-navigation/native';
import { GetStoreData } from '../../Util/CommonFun';
import Splash from '../../Components/SplashComp';
import messaging from '@react-native-firebase/messaging';


// let splash = require("../../../Assets/Icons/splash.png")

const Auth = ({ navigation, route }) => {
  const checkData = async () => {
    let data = GetStoreData()
    if (data) {
      // goToSignUpEnterDetail()
      navigation.dispatch(StackActions.replace("Home", { screen: "Home" }))
    } else {
      navigation.dispatch(StackActions.replace("AuthStackScreen", { screen: "Welcome" }))
    }
  };

  useEffect(async () => {
    //await getData()
    checkData();



  }, []);



  const goToSignUpEnterDetail = async () => { navigation.navigate("AuthStackScreen", { screen: "SignUpIdealJob" })}
  const getData = async () => {
    try {
      await requestUserPermission();
     
      checkApplicationPermission();
      getRemoteMessage();

    } catch (error) {
      console.log("error firebase=->>", error);
    }
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };

  const checkApplicationPermission = async () => {
    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      console.log('User has notification permissions enabled.');
      Getthedevicetoken();
    } else if (authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
      Getthedevicetoken();
      console.log('User has provisional notification permissions.');
    } else {
      console.log('User has notification permissions disabled');
    }
  }


  const Getthedevicetoken = async () => {
    // Get the device token
    try {
      await messaging().getToken().then(token => {
        console.log('getToken :- ', token);
        // store.dispatch({ type: FCM_TOKEN, payload: token })
      });
    } catch (error) {
      console.log('Getthedevicetoken getToken error', error);
    }


    // If using other push notification providers (ie Amazon SNS, etc)
    // you may need to get the APNs token instead for iOS:
    // if(Platform.OS == 'ios') { messaging().getAPNSToken().then(token => { return saveTokenToDatabase(token); }); }

    // Listen to whether the token changes
    try {
      await messaging().onTokenRefresh(val => {
        console.log('onTokenRefresh :- ', val);
      });
    } catch (error) {
      console.log('Getthedevicetoken onTokenRefresh error', error);
    }

  }



  const getRemoteMessage = async () => {
    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('remoteMessage back:- ', remoteMessage);
      sentOnThatScreen(remoteMessage)
    });


    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('remoteMessage  open from background :', remoteMessage,);
      sentOnThatScreen(remoteMessage)
    });

    messaging().getInitialNotification().then(remoteMessage => {
      console.log('abc :- ',remoteMessage);
      sentOnThatScreen(remoteMessage);
    });

    messaging().onMessage(async remoteMessage => {
      console.log('remoteMessage :- ', remoteMessage);
      sentOnThatScreen(remoteMessage);
    });

  }

  const sentOnThatScreen = async (message) => {
    try {
      if (message && message.notification) {
        const { title, body } = message.notification
        let getNoString = body ? body.match(/\d+/g) : ''
        if (title) {
          // RootNavigation.navigate('MainStack', {screen: 'TabStack'});
        }
      }
    }
    catch (err) {
      console.log('\n----Error in navigating to screen while getting notification.---');
    }
  };




  return (
    <View style={Styles().Container}>
      <Splash />
    </View>
  );
}

export default Auth;