/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { useEffect, useState } from "react";
import "react-native-gesture-handler";
import RootStack from "./src/Navigation/Route";
import * as RootNavigation from "./src/Navigation/RootNavigation";
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from './src/redux/Store'
import { Provider as StoreProvider, useDispatch, useSelector } from 'react-redux';
import FlashMessage from 'react-native-flash-message';
import SplashScreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging';
import { showMessage } from "react-native-flash-message";
import { Alert, StyleSheet, Text, View } from "react-native";
import AppContainer from "./AppContainer";
import { getBadgeCountApi } from "./src/Services/Queries";
import NetInfo from "@react-native-community/netinfo";
import { updateNetworkStatusAction, verifyInternet } from "./src/Util/CommonFun";
import appConfig from "./src/Util/Config";

NetInfo.configure({
  reachabilityUrl: appConfig.defaultBaseUrl,
  reachabilityTest: async response => response.status === 404,
  reachabilityLongTimeout: 5 * 1000,
  reachabilityShortTimeout: 1 * 1000,
  reachabilityRequestTimeout: 15 * 1000,
  reachabilityShouldRun: () => true,
  shouldFetchWiFiSSID: true,
  useNativeReachability: false,
});

 const App = (props) => {
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
        if (!globalThis.FCMToken) {
          globalThis.FCMToken = token;
        }
        console.log('\n--getDeviceToken--in App.js--', token);
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
 const runFunctionOnNavigationReady = (callback = ()=>{})=>{
    const id = setInterval(async () => {
      if (RootNavigation.isReadyRef.current == true && RootNavigation.navigationRef.current) {
        clearInterval(id);
        callback();
      }
    }, 250);
  }

  const getRemoteMessage = async () => {
    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('\n---remoteMessage back---', remoteMessage);
      // sentOnThatScreen(remoteMessage)
    });


    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('\n---remoteMessage open from background---', remoteMessage);
      sentOnThatScreen(remoteMessage)
    });

    messaging().getInitialNotification().then(remoteMessage => {
      console.log('\n---getInitialNotification---',remoteMessage);
      if(remoteMessage){
        runFunctionOnNavigationReady(()=>sentOnThatScreen(remoteMessage));
      }
    });

    messaging().onMessage(async remoteMessage => {
      console.log('remoteMessage :- ', remoteMessage);
       const { notification:{ title, body}, data } = remoteMessage;
     
        const isRoosterUpdate = data?.type === "roster_published"
        const isRosterRoute = RootNavigation.getCurrentRouteName() === "Roster"
        console.log("currentRoute",isRosterRoute);
        
        if(data && isRoosterUpdate){
          Alert.alert(
                'Alert',
                body,
                [
                  { text: isRosterRoute ? 'Cancel' :'Go to Roster', onPress: () => routeToRoster(remoteMessage)},
                  { text: 'Ok', onPress: () => {isRosterRoute ? routeToRoster(remoteMessage) : null} }
                ],
                { cancelable: false }
            );
        }
        else{
            // common alert for other notifications
            Alert.alert(
                title ?? 'New Message',
                body,
                [{ text: 'Ok', onPress: () => {} }],
                { cancelable: false },
            );

            // handle message count api if logined
        }

      getBadgeCountApi()
      showMessage({ message: 'You have received a new message', description: '', type: "success", duration: 3000 });
    });

  }

  const routeToRoster =(messageData)=>{
    RootNavigation.navigate('Roster',{notification:messageData})
  }

  const sentOnThatScreen = async (message) => {
    try {
      if (message && message.notification) {
        const { notification:{ title, body}, data } = message;
        let getNoString = body ? body.match(/\d+/g) : '';
        console.log('\n---data----',data);
        if (data && data.from_user_id) {
          RootNavigation.navigate('AppStackScreen_2', {
              screen: 'ChatList_2', params: {
                Id: Number(data.from_user_id)
              }
          });
        }
        else if(data && data?.type){
           routeToRoster(message)
        }
      }
    }
    catch (err) {
      console.log('\n----Error in navigating to screen while getting notification.---');
    }
  };

  const getData = async () => {
    try {
      await requestUserPermission();
     
      checkApplicationPermission();
      getRemoteMessage();

    } catch (error) {
      console.log("error firebase=->>", error);
    }
  };

    // const updateNetworkStatus = (state) => {
    //     console.log("network state", JSON.stringify(state, null, 2));

    //     const isOnline =
    //         state.isInternetReachable !== null
    //             ? state.isInternetReachable
    //             : state.isConnected;
    //     console.log("network state isOnline", isOnline);

    //     updateNetworkStatusAction(isOnline)
    // };

    const updateNetworkStatus = async (state) => {
      console.log("network state", JSON.stringify(state, null, 2));

      let isOnline = state.isConnected;
      if (!state.isConnected) {
          isOnline = await verifyInternet();
      }

      console.log("network state isOnline", isOnline);

      updateNetworkStatusAction(isOnline);
    };

    useEffect(() => {
        NetInfo.fetch().then(updateNetworkStatus);
        const unsubscribe = NetInfo.addEventListener(updateNetworkStatus);

        return () => unsubscribe();
    }, []);

useEffect(async() => {
  SplashScreen.hide();
  await getData()

}, )

   useEffect(() => {
     //getData();
   }, []);

   const checkString = (str)=>{
    return typeof str === 'string'?str:''
   }

   const CustomFlashMessage = (props) => {
    const {message} = props
    if(message?.type == "success"){
      return(
        <View style={[styles.flashContainer,{backgroundColor:"#5cb85c"}]}>
          <Text style={styles.flashTitle}>{checkString(message?.message)}</Text>
          {message?.description ? <Text style={styles.flashDescription}>{checkString(message?.description)}</Text>:null}
        </View>
      )
    }
    else if(message?.type == "warning"){
      return (
        <View style={[styles.flashContainer,{backgroundColor:"#f5e6ba"}]}>
          <Text style={[styles.flashTitle,{color:"#000"}]}>{checkString(message.message)}</Text>
          {message.description ? <Text style={[styles.flashDescription,{color:"#000"}]}>{checkString(message.description)}</Text>:null}
        </View>
      );
    }
    else if(message?.type == "danger"){
     return(
      <View style={[styles.flashContainer,{backgroundColor:"#d9534f"}]}>
       <Text style={styles.flashTitle}>{checkString(message.message)}</Text>
          {message.description ? <Text style={styles.flashDescription}>{checkString(message.description)}</Text>:null}
      </View>
     )
    }
    else{
      return(
        <View style={[styles.flashContainer,{backgroundColor:"grey"}]}>
          <Text style={styles.flashTitle}>{checkString(message.message)}</Text>
          {message?.description ? <Text style={styles.flashDescription}>{checkString(message.description)}</Text>:null}
        </View>
      )
    }
  };

   return (
    <StoreProvider store={store}>
      <PersistGate persistor={persistor}>
        <AppContainer />
        <FlashMessage position="bottom" duration={2000} MessageComponent={CustomFlashMessage}/>
      </PersistGate>
    </StoreProvider>
  )
 
 };
 
 const styles = StyleSheet.create({
  flashContainer:{
    padding:20,
    backgroundColor:"green"
  },
  flashTitle:{
    fontWeight:"600",
    color:"#fff",
    fontSize:15
  },
  flashDescription:{
    color:"#fff",
    fontSize:14,
    marginTop:5
  }
 })
 export default App;



