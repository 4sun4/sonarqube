import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { useState } from 'react';
import Colors from '../../../Util/Colors';
import { CallPostRestApi, callVerify } from '../../../Services/Api';
const backBtn = require('../../../Assets/Icons/BackScreen.png');
const LogoNew = require('../../../Assets/Icons/LogoNew.png');
const LogoWorkForce = require('../../../Assets/Icons/WorkForceWhiteLogo.png');
import Types from '../../../redux/Types';
import { useDispatch } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import Config from '../../../Util/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../Components/Loader';
import { normalizeSize } from '../../../Util/CommonFun';
import messaging from '@react-native-firebase/messaging';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const SignUpEnterCode = (props, route) => {
  const [data, setData] = useState({
    verification_code: '',
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  console.log('Props', props);
  console.log('Route', route);

  const submit = async () => {
    console.log('Data', data);
    if (!data.verification_code) {
      Alert.alert('Alert', 'Please enter verification_code');
      return false;
    }

    if (data.verification_code && data.verification_code.length < 3) {
      Alert.alert('Alert', 'Minimum 4 Characters allowed');
      return false;
    }
    console.log('Props', props);
    console.log('Route', route);
    var URL = Config().verify;
    let body = {
      candidate_id: props.route.params.candidate_id,
      verification_code: data.verification_code,
    };

    setLoading(true);
    let token;
    await callVerify(URL, body)
      .then(async res => {
        console.log('Verify res :- ', res);
        setLoading(false);

        await AsyncStorage.setItem('token', res.token);

        token = res.token;
        if (res && res.token) {
          showMessage({
            message: 'Success',
            description: 'User Verified successfully.',
            type: 'success',
          });
          await dispatch({ type: Types.LOGIN_STATUS, data: res });
          await dispatch({ type: Types.VERIFY_STATUS, data: res });
          setTimeout(() => { setFcmTokenApi(token) }, 300);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log('callForgotPassApi error :- ', error);
        showMessage({ message: 'Error', description: error, type: 'warning' });
      });
  };

  const setFcmTokenApi = async (token) => {
    setLoading(true);
    try {
      console.log('\n---globalThis---', globalThis?.FCMToken);
      let body = {
        device_token:
          globalThis && globalThis?.FCMToken ? globalThis?.FCMToken : null,
        device_type: Platform.OS,
      };
      let url = Config().setCandidateDeviceToken;
      if (globalThis && globalThis?.FCMToken) {
        await CallPostRestApi(body, url)
          .then(res => {
            console.log('\n---setFcmTokenApi res---', res);
          })
          .catch(error => {
            console.log('\n----setFcmTokenApi error----', error);
            showMessage({message: 'Error', description: error, type: 'warning'});
          });
        }
    } catch (error) {}
    setLoading(false);
    setTimeout(()=>{});
    goToSignUpEnterDetail(token);
  };

  const goToLogin = async () => {
    // props.navigation.navigate("AuthStackScreen", { screen: "Login"});
    props.navigation.navigate("Login");
  };

  const goToSignUpEnterDetail = token => {
    props.navigation.navigate('SignUpEnterDetail', { token: token });
  };
  return (
    <View style={styles.container}>
      {loading ? <Loader /> : null}
      <ScrollView
        style={styles.innerContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* <Image source={backBtn} style={styles.imgBackButton} /> */}
        <Image source={LogoWorkForce} style={{width:400,height:200,resizeMode:"contain",marginTop:-25}}/>
        <View style={styles.middleWrapper}>
          <Text style={styles.text1}>Ok, we sent you a code</Text>

          <Text style={styles.useText}>
            Please enter the code we sent to {props?.route?.params?.res?.email} within the next 10 minutes
          </Text>

          <TextInput
            style={styles.passInput}
            placeholder="Enter Code"
            placeholderTextColor={Colors.Placeholder}
            textValue={data.verification_code}
            keyboardShouldPersistTaps
            maxLength={15}
            autoCapitalize={'none'}
            onChangeText={value =>
              setData({ ...data, verification_code: value })
            }
          />

          <TouchableOpacity style={styles.btn} onPress={() => submit()}>
            <Text style={styles.btnText}>Done</Text>
          </TouchableOpacity>
          <View style={styles.flRowAlCenterJCenter}>
            <Text style={styles.alreadyText}>Already have an account? </Text>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => goToLogin()}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F6F6F6',
    backgroundColor: '#FFF',
  },
  innerContainer: {
    flex: 1,
  },
  imgBackButton: {
    // resizeMode:'contain',
    marginTop: -70,
    marginLeft: -60,
  },
  middleWrapper: {
    width: '100%',
    alignItems: 'center'
  },
  useText: {
    color: Colors.halfBlack,
    fontSize: 15,
    marginTop: normalizeSize(10),
    alignSelf: 'center',
    width: screenWidth - 60,
    fontWeight: '600',
  },
  passInput: {
    width: screenWidth - 60,
    height: 50,
    borderWidth: 2.0,
    // borderColor: 'white',
    borderColor: '#c5baba',
    borderRadius: 30,
    fontSize: 18,
    paddingLeft: 20,
    marginTop: 30,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    color: Colors.Black,
  },
  btn: {
    width: screenWidth - 60,
    height: 60,
    // backgroundColor: '#D02530',
    backgroundColor:'#1c78ba',
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  btnText: {
    color: 'white',
    fontSize: normalizeSize(16),
    fontWeight: '600',
  },
  flRowAlCenterJCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alreadyText: {
    marginTop: 15,
    marginBottom: 15,
    alignSelf: 'center',
    fontSize: normalizeSize(15),
    fontWeight: '400',
  },
  loginBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  loginText: {
    // color: '#D02530',
    color: '#1c78ba',
    fontSize: normalizeSize(15),
    fontWeight: '600',
  },
  imgStyle: {
    marginTop: -70,
    marginLeft: -60,
  },
  view1: {
    flex: 1,
    position: 'absolute',
    alignSelf: 'center',
  },
  view2: {
    alignSelf: 'center',
    marginTop: 100,
  },
  view3: {
    // height: screenHeight,
    width: '100%',
  },
  text: {
    alignSelf: 'center',
    fontSize: normalizeSize(15),
    textAlign: 'center',
    marginTop: 10,
  },
  text1: {
    alignSelf: 'center',
    fontSize: normalizeSize(25),
    textAlign: 'center',
    marginTop: normalizeSize(5),
    width: screenWidth - 60,
  }


});

export default SignUpEnterCode;
