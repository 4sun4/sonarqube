import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Loader from '../Components/Loader';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../Util/Colors';
import {normalizeSize} from '../Util/CommonFun';
import Config from '../Util/Config';
import { callPostRest } from '../Services/Api';
import { showMessage } from 'react-native-flash-message';
const {height, width} = Dimensions.get('window');
const screenwidth = Dimensions.get('window').width;
const screenheight = Dimensions.get('window').height;

const ForgotPassword = (props) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const onPressSubmit = async() => {
    // Email validation regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email){
      alert("Please enter your email address associated with your WorkforceMgr account")
    } else if (!emailPattern.test(email)) {
      alert("Please enter a valid email address");
    }
    else {
      const URL = Config().forgotPassword;
      let body = {
        email: email,
        userType:"candidate"
      };
      setLoading(true);
      await callPostRest(URL, body)
        .then(async res => {
          console.log('callForgotPassApi res :- ',res);
          setLoading(false);
  
          if (res && res?.status == "success") {
            showMessage({
              message: 'Success',
              description: 'Email sent successfully.',
              type: 'success',
            });
            props.navigation.goBack()
          }
        })
        .catch(error => {
          setLoading(false);
          console.log('callForgotPassApi error :- ', error);
          showMessage({message: 'Error', description: error, type: 'warning'});
        });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#1c78ba'} />
      {loading ? <Loader /> : null}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={()=>{
            props?.navigation?.pop();
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 8,
          }}>
          <Feather color={'#111'} size={27} name="chevron-left" />
          <Text
            style={{
              color: '#111',
              fontSize: 16,
            //   fontWeight: '800',
              paddingLeft: 6,
              paddingBottom: 2,
              //   borderWidth:1
            }}>
            Back
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1}}>
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
          <KeyboardAvoidingView
            style={{
              flex: 1,
              padding: 15,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={[styles.loginTxt, {marginTop: 8}]}>Forgot</Text>
              <Text style={[styles.loginTxt, {marginTop: 0}]}>
                your Password?
              </Text>
              <Text
                style={{
                  marginTop: 14,
                  color: '#848484',
                }}>
                Please enter your email address associated with your WorkforceMgr
                account
              </Text>
              <TextInput
                value={email}
                onChangeText={value => setEmail(value)}
                style={[styles.textInputStyle]}
                placeholder="Email Address"
                keyboardType="email-address"
                placeholderTextColor={'#848484'}
              />
            </View>
            <View style={{marginBottom:6}}>
              <TouchableOpacity
                style={[styles.buttonContainer]}
                onPress={() => onPressSubmit()}>
                <Text style={[styles.buttonText]}>Submit</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: Platform.OS == "ios" ? 40 : 0,
    left: 0,
    zIndex: 999,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.ThemeBackground,
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
    color: Colors.Black,
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
    paddingVertical: 11,
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

export default ForgotPassword;
