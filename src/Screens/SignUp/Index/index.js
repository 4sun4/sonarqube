import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState } from 'react';
import { normalizeSize, validateEmail } from '../../../Util/CommonFun';
import Colors from '../../../Util/Colors';
const backBtn = require('../../../Assets/Icons/BackScreen.png');
const LogoNew = require('../../../Assets/Icons/LogoNew.png');
const LogoWorkForce = require('../../../Assets/Icons/WorkForceWhiteLogo.png');
import Config from '../../../Util/Config'
import useKeyboardHeight from '../../../Hooks/useKeyboardHeight';

const SignUp = props => {
  const KeyboardHeight = useKeyboardHeight();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: '',
    firstName: '',
    confirmLastName: '',
    iconAnimating: false,
  });

  const submit = async () => {
    if (!data.firstName) {
      Alert.alert('Alert', 'Please enter first name');
      return false;
    }
    if (!data.lastName) {
      Alert.alert('Alert', 'Please enter last name');
      return false;
    }
    if (!data.email) {
      Alert.alert('Alert', 'Please enter email address');
      return false;
    }
    if (!validateEmail(data.email)) {
      Alert.alert('Alert', 'Please enter valid email address');
      return false;
    }
    setLoading(true);
    goToSignUpSetPass();
  };

  const goToLogin = async () => {
    // props.navigation.navigate("AuthStackScreen", { screen: "Login"});
    props.navigation.navigate("Login");
  };

  const goToSignUpSetPass = async () => {
    props.navigation.navigate('SignUpSetPass', {
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <ScrollView
        style={styles.innerContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom:Platform.OS === "ios" ? 0:KeyboardHeight}}
        keyboardShouldPersistTaps="handled">
        {/* <Image source={backBtn} style={styles.imgBackButton} /> */}
        {/* <Image source={LogoNew} style={styles.imgLogo} /> */}
        <Image source={LogoWorkForce} style={{width:400,height:200,resizeMode:"contain",marginTop:-25}}/>
        <View style={styles.middleWrapper}>
          <Text style={styles.titleText}>Looking for work?</Text>
          <Text style={styles.mainTitleText}>Create your account!</Text>

          <View style={styles.informationWrapper}>
            <TextInput
              style={styles.textInputName}
              placeholder="First Name"
              placeholderTextColor={Colors.Placeholder}
              textValue={data.firstName}
              keyboardShouldPersistTaps
              onChangeText={value => setData({ ...data, firstName: value })}
            />
          </View>

          <View style={styles.informationWrapper}>
            <TextInput
              style={styles.textInputName}
              placeholder="Last Name"
              placeholderTextColor={Colors.Placeholder}
              textValue={data.lastName}
              keyboardShouldPersistTaps
              onChangeText={value => setData({ ...data, lastName: value })}
            />
          </View>

          <View style={styles.informationWrapper}>
            <TextInput
              style={styles.textInputName}
              placeholder="Email address"
              placeholderTextColor={Colors.Placeholder}
              textValue={data.email}
              keyboardType="email-address"
              returnKeyLabel="Done"
              returnKeyType="done"
              keyboardShouldPersistTaps
              onChangeText={value => setData({ ...data, email: value })}
            />
          </View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => submit()}>
            <Text style={styles.continueText}>CONTINUE</Text>
          </TouchableOpacity>
          <View style={styles.bottomWrapper}>
            <Text style={styles.textAccount}>Already have an account? </Text>
            <TouchableOpacity
              style={styles.loginWrapper}
              onPress={() => goToLogin()}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F6F6F6',
    backgroundColor: '#Fff',
  },
  innerContainer: {
    flex: 1,
  },
  imgBackButton: {
    marginTop: -70,
    marginLeft: -60,
  },
  imgLogo: {
    alignSelf: 'center',
    marginTop: -100,
  },
  middleWrapper: {
    width: '100%',
    alignItems: 'center'
  },
  titleText: {
    alignSelf: 'center',
    fontSize: normalizeSize(20),
    // marginTop: normalizeSize(50),
  },
  mainTitleText: {
    alignSelf: 'center',
    fontSize: normalizeSize(28),
    marginTop: normalizeSize(10),
  },
  informationWrapper: {
    width: Config().width - 60,
    alignSelf: 'center',
    marginTop: normalizeSize(20),
  },
  textInputName: {
    // width: 350,
    borderWidth:1,
    height: normalizeSize(48),
    borderColor: '#c5baba',
    borderRadius: 30,
    fontSize: normalizeSize(16),
    paddingHorizontal: 10,
    backgroundColor: 'white',
    color: Colors.Black,
  },
  submitButton: {
    height: normalizeSize(48),
    width: Config().width - 60,
    // backgroundColor: '#D02530',
    backgroundColor: '#1c78ba',
    marginTop: normalizeSize(16),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  continueText: {
    color: 'white',
    fontSize: normalizeSize(16),
    fontWeight: '600',
  },
  bottomWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textAccount: {
    marginTop: 15,
    marginBottom: 15,
    alignSelf: 'center',
    fontSize: normalizeSize(15),
    fontWeight: '400',
  },
  loginWrapper: {
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
});

export default SignUp;
