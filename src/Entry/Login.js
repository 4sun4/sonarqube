import React, {useRef, useState, useEffect} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {showMessage, hideMessage} from 'react-native-flash-message';
import Config from '../Util/Config';
import {callPostRest, CallPostRestApi} from '../Services/Api';
import Loader from '../Components/Loader';
import {useDispatch, useSelector} from 'react-redux';
import {StackActions} from '@react-navigation/native';
import {Input, Icon} from 'react-native-elements';
import messaging from '@react-native-firebase/messaging';

import Types from '../redux/Types';
import Colors from '../Util/Colors';
import CommonInput from '../Components/CommonInput';
import {RecruitOnline_GISBuilder} from '../../Geofence';
import {normalizeSize} from '../Util/CommonFun';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


const {height, width} = Dimensions.get('window');
const screenwidth = Dimensions.get('window').width;
const screenheight = Dimensions.get('window').height;

const Login = props => {
  let MobileJourney_GIS = null;

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [securePass, setSecurePass] = useState(true);

  const [data, setData] = useState({
    username: '',
    password: '',
    iconAnimating: false,
    isPasswordShow: true,
  });

  const [token, setToken] = useState('');

  useEffect(() => {
    // checkApplicationPermission();
  }, []);

  const submit = async () => {
    // Email validation regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // props.navigation.navigate("Home", { screen: "Home" })
    console.log('The submit button clicked' + props);
    if (!data.username) {
      Alert.alert('Alert', 'Please enter Email');
      return false;
    }
    if (!emailPattern.test(data.username)) {
       Alert.alert('Alert',"Please enter a valid email address");
       return false;
    }

    if (!data.password) {
      Alert.alert('Alert', 'Please enter password');
      return false;
    }

    var URL = Config().login;
    let body = {
      email: data.username,
      password: data.password,
      loginType:"candidate"
    };
    setLoading(true);
    await callPostRest(URL, body)
      .then(async res => {
        // console.log('LoginApi res :- ', res?.data?.companies);
        setLoading(false);

        if (res && res?.data?.token) {
          showMessage({
            message: 'Success',
            description: 'Login successfully.',
            type: 'success',
          });
          await dispatch({type: Types.LOGIN_STATUS, data: res?.data});
          await dispatch({type: Types.CHANGE_PASSWORD_TOKEN, data:res?.data});
          await dispatch({type: Types.NEWUSER, data: false});
          setTimeout(() => {
            // setFcmTokenApi();
            props.navigation.dispatch(
              StackActions.replace('Home', {screen: 'SelectEmployer',params:{data:res?.data?.companies,email:data.username}}),
            );
          }, 300);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log('callForgotPassApi error :- ', error);
        showMessage({message: 'Error', description: error, type: 'warning'});
      });
  };

  const checkApplicationPermission = async () => {
    const authorizationStatus = await messaging().requestPermission();
    console.log('\n---authorizationStatus----', authorizationStatus);
    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      console.log('User has notification permissions enabled.');
      Getthedevicetoken();
    } else if (
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      Getthedevicetoken();
      console.log('User has provisional notification permissions.');
    } else {
      console.log('User has notification permissions disabled');
    }
  };
  const Getthedevicetoken = async () => {
    // Get the device token
    try {
      await messaging()
        .getToken()
        .then(token => {
          console.log('\n----loginGetToken----', token);
          if (!globalThis.FCMToken) {
            globalThis.FCMToken = token;
          }
          // setToken(token)
        });
    } catch (error) {
      console.log('Getthedevicetoken getToken error', error);
    }
    try {
      await messaging().onTokenRefresh(val => {
        console.log('onTokenRefresh :- ', val);
      });
    } catch (error) {
      console.log('Getthedevicetoken onTokenRefresh error', error);
    }
  };
  const setFcmTokenApi = async () => {
    setLoading(true);
    console.log('\n---globalThis---', globalThis.FCMToken);
    let body = {
      device_token:
        globalThis && globalThis.FCMToken ? globalThis.FCMToken : null,
      device_type: Platform.OS,
    };
    let url = Config().setCandidateDeviceToken;
    if (globalThis && !globalThis.FCMToken) {
      props.navigation.dispatch(StackActions.replace('Home', {screen: 'SelectEmployer'}));
    } else {
      await CallPostRestApi(body, url)
        .then(res => {
          setLoading(false);
          console.log('\n---setFcmTokenApi res---', res);
          props.navigation.dispatch(
            StackActions.replace('Home', {screen: 'SelectEmployer'}),
          );
        })
        .catch(error => {
          setLoading(false);
          console.log('\n----setFcmTokenApi error----', error);
          showMessage({message: 'Error', description: error, type: 'warning'});
        });
    }
  };

  const goToSignUp = async () => {
    props.navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#1c78ba'} />
      {loading ? <Loader /> : null}
      <View style={{flex: 1}}>
        <KeyboardAwareScrollView contentContainerStyle={{flex:1}} keyboardShouldPersistTaps="handled">
        <View
          style={{
            flex: 0.36,
            backgroundColor: '#1c78ba',
            height: 800,
            justifyContent: 'center',
          }}>
          <Image
            source={require('../Assets/Icons/WorkForceBlueLogo.png')}
            style={{
              width: '60%',
              height: '60%',
              resizeMode: 'contain',
              borderColor: '#111',
              alignSelf: 'center',
            }}
          />
        </View>
        <View style={{flex: 0.64}}>
          <View style={{flex: 1,
              padding: 15,
              flexDirection: 'column',
              justifyContent: 'space-between',}}>
        {/* <KeyboardAwareScrollView 
          // enableAutomaticScroll={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableResetScrollToCoords
          contentContainerStyle={{ flex: 1,
              padding: 15,
              flexDirection: 'column',
              justifyContent: 'space-between',}}> */}
          {/* <ScrollView
            contentContainerStyle={{
              flex: 1,
              padding: 15,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}> */}
            <View>
              <Text style={[styles.loginTxt, {marginTop: 8}]}>Log in</Text>
              <TextInput
                value={data.username}
                onChangeText={value => setData({...data, username: value})}
                style={[styles.textInputStyle]}
                placeholder="Email Address"
                keyboardType="email-address"
                placeholderTextColor={'#848484'}
              />
              <View style={styles.passwordContainer}>
                <TextInput
                  value={data.password}
                  onChangeText={value => setData({...data, password: value})}
                  style={[
                    styles.textInputStyle,
                    {borderBottomWidth: 0, flex: 1},
                  ]}
                  autoCorrect={false}
                  secureTextEntry={securePass}
                  placeholder="Password"
                />
                <TouchableOpacity onPress={() => setSecurePass(!securePass)}>
                  <Text
                    style={{color: '#a4a4a4', paddingBottom: 5, fontSize: 13}}>
                    {securePass ? 'Show Password' : 'Hide Password'}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('ForgotPassword');
                }}
                style={{alignSelf: 'flex-end'}}>
                <Text
                  style={[
                    {
                      fontSize: normalizeSize(15),
                      color: '#1c78ba',
                      fontWeight: 'bold',
                      marginTop: 20,
                    },
                  ]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{}}>
              <TouchableOpacity
                style={[styles.buttonContainer]}
                onPress={() => {
                  submit();
                }}>
                <Text style={[styles.buttonText]}>Log In</Text>
              </TouchableOpacity>
              {/* <Text
                style={{
                  marginVertical: 30,
                  textAlign: 'center',
                  color: '#848484',
                  fontWeight: 'bold',
                }}>
                Don't have an account?
                <Text
                  onPress={() => {
                    goToSignUp();
                  }}
                  style={{
                    color: '#111',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  {' '}
                  Find out more
                </Text>
              </Text> */}
            </View>
          {/* </ScrollView> */}
          </View>
          {/* </KeyboardAwareScrollView> */}
        </View>
        </KeyboardAwareScrollView>
      </View>
      
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputStyle: {
    borderColor: 'white',
    borderRadius: 30,
    backgroundColor: 'white',
    height: normalizeSize(50),
  },
  btn: {
    width: screenwidth - 40,
    height: normalizeSize(50),
    backgroundColor: Colors.btnRed,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  middleWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 10,
  },
  btn2: {
    width: screenwidth - 40,
    height: normalizeSize(50),
    backgroundColor: Colors.ThemeBlue,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  btnText: {color: 'white', fontSize: normalizeSize(16), fontWeight: '600'},
  forgotText: {
    color: Colors.ThemeBlue,
    marginTop: 20,
    fontSize: normalizeSize(14),
    alignSelf: 'center',
    textDecorationLine: 'underline',
  },
  innerContentContainer: {
    flexGrow: 1,
    borderColor: 'green',
    borderWidth: 5,
  },
  loginTxt: {
    fontSize: normalizeSize(24),
    fontWeight: 'bold',
  },
  textInputStyle: {
    borderBottomWidth: 1,
    borderBottomColor: '#b4b4b4',
    // borderBottomColor: '#848484',
    fontSize: normalizeSize(13),
    // fontWeight: 'bold',
    marginTop: 10,
    paddingBottom: 5,
    color:Colors.Black
  },
  passwordContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#b4b4b4',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  buttonContainer: {
    backgroundColor: '#1c78ba',
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: normalizeSize(15),
    color: '#FFFFFF',
    fontWeight: '900',
  },
});

export default Login;
