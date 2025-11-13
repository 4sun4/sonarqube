import React, { useState } from 'react';
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
} from 'react-native';
import Colors from '../../../Util/Colors';
import { useDispatch } from 'react-redux';
import Types from '../../../redux/Types';
const backBtn = require('../../../Assets/Icons/BackScreen.png');
const LogoNew = require('../../../Assets/Icons/LogoNew.png');
const LogoWorkForce = require('../../../Assets/Icons/WorkForceWhiteLogo.png');
import Config from '../../../Util/Config';
import { callSignup } from '../../../Services/Api';
import { showMessage } from 'react-native-flash-message';
import Loader from '../../../Components/Loader';
import { normalizeSize } from '../../../Util/CommonFun';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const SignUpSetPass = (props, route) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [data, setData] = useState({
    password: '',
  });

  const submit = async () => {
    if (!data.password) {
      Alert.alert('Alert', 'Please enter password');
      return false;
    }
    if(data.password.startsWith(' ') ||data.password.endsWith(' ')){
      Alert.alert('Alert', "Please remove suffix and prefix space in password.");
      return false;
    }

    var regex = new RegExp("^(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
    if(!regex.test(data.password)){
      Alert.alert('Alert', "Password should be minimum 8 Characters with mix of letters, numbers & symbols");
      return false;
    }
    if (data.password && data.password.length < 8) {
      Alert.alert('Alert', 'Password should be minimum 8 Characters');
      return false;
    }
    console.log('Route', props);

    console.log('Route', route);
    var URL = Config().signup;
    let body = {
      first_name: props.route.params.first_name,
      last_name: props.route.params.last_name,
      email: props.route.params.email,
      password: data.password,
    };
    setLoading(true);
    await callSignup(URL, body)
      .then(async res => {
        console.log('SignUpApi response', res);
        setLoading(false);
        if (res) {
          // showMessage({
          //   message: 'Success',
          //   description: 'Signup successfully.',
          //   type: 'success',
          // });
          goToSignUpEnterCode(res);
          console.log('Repo', res);
          await dispatch({ type: Types.SIGN_UP, data: res });
        }
      })
      .catch(error => {
        setLoading(false);
        console.log('CallSignUp Error', error);
        showMessage({
          message: 'Error Occurred',
          description: error,
          type: 'warning',
        });
      });
  };

  const goToLogin = async () => {
    // props.navigation.navigate("AuthStackScreen", { screen: "Login"});
    props.navigation.navigate("Login");
  };

  const goToSignUpEnterCode = async res => {
    props.navigation.navigate('SignUpEnterCode', {
      res: res,
      candidate_id: res.candidate_id,
    });
  };

  return (
    <View style={styles.container}>
      {loading ? <Loader /> : null}
      <ScrollView
        style={styles.innerContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* <Image source={backBtn} style={styles.imgBackButton} /> */}
        {/* <Image source={LogoNew} style={styles.imgLogo} /> */}
        <Image source={LogoWorkForce} style={{width:400,height:200,resizeMode:"contain",marginTop:-25}}/>
        <View style={styles.middleWrapper}>
          <Text style={styles.text}>Looking for work?</Text>
          <Text style={styles.text1}>Create your account!</Text>

          <TextInput
            style={styles.passInput}
            placeholder="Password"
            placeholderTextColor={Colors.Placeholder}
            textValue={data.password}
            secureTextEntry={true}
            autoCapitalize='none'
            keyboardShouldPersistTaps
            returnKeyLabel="Done"
            returnKeyType="done"
            onChangeText={value => setData({ ...data, password: value })}
          />

          <Text style={styles.useText}>
            Use 8 or more characters with a mix of letters, numbers &
            symbols.
          </Text>

          <TouchableOpacity style={styles.btn} onPress={() => submit()}>
            <Text style={styles.btnText}>Get started, it's free!</Text>
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
  imgLogo: {
    alignSelf: 'center',
    marginTop: -normalizeSize(100),
  },
  middleWrapper: {
    width: '100%',
    alignItems: 'center'
  },
  useText: {
    color: Colors.halfBlack,
    fontSize: normalizeSize(14),
    marginTop: 20,
    paddingHorizontal: 20,
    fontWeight: '600',
  },
  passInput: {
    width: screenWidth - 60,
    height: normalizeSize(45),
    borderWidth: 2.0,
    borderColor: '#c5baba',
    borderRadius: 30,
    fontSize: normalizeSize(16),
    paddingLeft: 20,
    marginTop: 30,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    color: Colors.Black,
  },
  btn: {
    width: screenWidth - 60,
    height: normalizeSize(50),
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
    fontSize: normalizeSize(20),
    marginTop: normalizeSize(20),
  },
  text1: {
    alignSelf: 'center',
    fontSize: normalizeSize(24),
    marginTop: 10,
  },
  view4: {
    alignItems: 'center',
    marginTop: 30,
  },
});

export default SignUpSetPass;
