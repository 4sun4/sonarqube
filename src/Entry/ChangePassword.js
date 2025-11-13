import React, { useCallback, useEffect, useRef } from 'react'
import { View, Text, Button, Image, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Dimensions, SafeAreaView, Platform } from 'react-native'
import { useState } from 'react';
import { normalizeSize, validatePass } from '../Util/CommonFun';
import { CallPostChangeRestApi, CallPostRestApi } from '../Services/Api';
import Loader from '../Components/Loader';
import CommonInput from '../Components/CommonInput';
import Colors from '../Util/Colors';
import { Input, Icon } from 'react-native-elements'
import Config from '../Util/Config';
import { showMessage, hideMessage } from "react-native-flash-message";
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Keyboard } from 'react-native';
import { useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { store } from '../redux/Store';

const { height, width } = Dimensions.get('window');

const ChangePassword = (props) => {
    const UserDetail = useSelector(S => {
        let D = '';
        if (
          S &&
          S.loginStatus &&
          S.loginStatus.changePassword &&
          Object.keys(S.loginStatus.changePassword).length != 0
        ) {
          D = S.loginStatus.changePassword;
        }
        return D;
      });
      console.log(UserDetail,"UserDetailUserDetail")
    const facilityName = store.getState().loginStatus.facility;

    const [securePass, setSecurePass] = useState(true)
    const [pass, setPass] = useState('');
  
    const [NewSecurePass, setNewSecurePass] = useState(true)
    const [NewPass, setNewPass] = useState('');
  
    const [CSecurePass, setCSecurePass] = useState(true)
    const [CPass, setCPass] = useState('');
    const [loading, setLoading] = useState(false)

    const passRef = useRef(pass);
const newPassRef = useRef(NewPass);
const cPassRef = useRef(CPass);

useEffect(() => { passRef.current = pass }, [pass]);
useEffect(() => { newPassRef.current = NewPass }, [NewPass]);
useEffect(() => { cPassRef.current = CPass }, [CPass]);

    // React.useLayoutEffect(() => {
    //     props.navigation.setOptions({
    //         headerRight: () => (<TouchableOpacity activeOpacity={1} underlayColor="white" onPress={() => callFPassApiAfterValidate()}
    //             style={{ alignItems: 'center', justifyContent: 'center', paddingLeft: 10, paddingRight: 10 }}>
    //             <Image style={{ width: 18, height: 18, alignSelf: 'center' }} resizeMode={'contain'} source={require('../Assets/Icons/HeaderCheck.png')} />
    //         </TouchableOpacity>
    //         ),
    //     });
    // }, [pass,NewPass,CPass]);

        const HeaderLogo = () => {
            return (
              <Image
                style={{width: 350, height: 45}}
                resizeMode={'contain'}
                source={require('../Assets/Icons/WorkFoceWhiteSmallLogo.png')}
              />
            );
          };
        
          const showDrawerIcon = props => {
            return (
              <EvilIcons
                name="navicon"
                color={'#111'}
                style={{paddingLeft: 10, paddingRight: 0}}
                onPress={() => props.navigation.openDrawer()}
                size={26}
              />
            );
          };

          React.useLayoutEffect(() => {
            props.navigation.setOptions({
              header: props => (
                <SafeAreaView style={{backgroundColor: '#ffffff'}}>
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#fff',
                      }}>
                      {showDrawerIcon(props)}
                      {HeaderLogo()}
                      <View />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 10,
                        justifyContent: 'center',
                        paddingVertical: 10,
                        backgroundColor: '#1c78ba',
                      }}>
                      <Text
                        style={{
                          fontSize: normalizeSize(15),
                          textAlign: 'center',
                          color: '#fff',
                        }}>
                        {facilityName}
                      </Text>
                      <View />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 10,
                        justifyContent: 'space-between',
                        paddingVertical: 4,
                        backgroundColor: '#d9d9d9',
                      }}>
                      <TouchableOpacity
                        onPress={() => props.navigation.goBack()}
                        style={{flex: 0.5}}>
                        <Feather color={'#111'} size={32} name="chevron-left" />
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: normalizeSize(18),
                          flex: 1.5,
                          textAlign: 'center'
                        }}>
                        Change Password
                      </Text>
                     <TouchableOpacity
                        activeOpacity={0.8}
                        underlayColor="white"
                        onPress={() => callFPassApiAfterValidate(passRef.current,
    newPassRef.current,
    cPassRef.current)}
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 0.5
                        }}>
                        <View
                          style={{
                            alignSelf: 'flex-end',
                            borderRadius: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#1c78ba',
                            paddingHorizontal:16,
                            paddingVertical:6
                          }}>
                          <Text style={{color:"#fff",fontSize: height / 48}}>Save</Text>
                        </View>
                      </TouchableOpacity>
                      <View />
                    </View>
                  </View>
                </SafeAreaView>
              ),
            });
          }, []);

    const callFPassApiAfterValidate = async(pass,NewPass,CPass) => {
        Keyboard.dismiss();

        console.log('Old pass', pass, ' New pass', NewPass, ' CPass', CPass);

        if (!pass) {
            Alert.alert('Alert', 'Please enter current Password')
            return
        }



        else if (!NewPass) {
            Alert.alert('Alert', 'Please enter New Password')
            return
        }
        // else if (NewPass && !validatePass(NewPass)) {
        //     Alert.alert('Alert', 'Please enter valid New password')

        //     return
        // }

        else if (!CPass) {
            Alert.alert('Alert', 'Please enter Confirm Password')

            return
        }

        // else if (CPass && !validatePass(CPass)) {
        //     Alert.alert('Alert', 'Please enter valid Confirm password')
        //     return
        // }

        else if (NewPass !== CPass) {
            Alert.alert('Alert', 'New password & Confirm password must be same')
            return
        }

        else {
            setLoading(true)
            let body = {
                "current_password":pass,
                "password": NewPass,
                "password_confirmation": NewPass
                
            }
            let url = Config().changePassword;
            let token = UserDetail && UserDetail?.token
            await CallPostChangeRestApi(body,url,token)
                .then((res) => {
                    setLoading(false)
                    console.log('changePassword res :- ', res);
                    showMessage({ message: 'success', description: "Password updated successfully", type: 'success',autoHide: true ,duration:3000 });
                })
                .catch((error) => {
                    setLoading(false)
                    const code = error?.response?.status;
                    // response data
                    const response = error?.response?.data;
                    console.log('code :- ' + code + ' response :- ', response,"raw response",error?.response);
                    console.log('changePassword error :- ', error)
                    console.log("response message",response?.message);
                    
                    if(response?.errors){
                        let passwordError = response && response?.errors?.password && response?.errors?.password.length>0 ? response?.errors?.password :null
                        showMessage({ message: 'Error', description: passwordError? passwordError[0] : error, type: "warning", autoHide: true,duration:3000});
                    }else{
                        showMessage({ message: 'Error', description: response?.message ?? "Something went wrong", type: "warning", autoHide: true,duration:3000}); 
                    }
                })
        }


    }




    console.log('CPass', CPass);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {loading ? <Loader /> : null}
            {/* <View style={{ flexDirection:"row",justifyContent:"space-between",paddingHorizontal: Platform.OS=="android"? 14:8,paddingVertical:15}}>
                <TouchableOpacity onPress={()=>{props?.navigation?.pop()}}>
                    {Platform.OS=="android" ? <AntDesign name="arrowleft" size={22}/>:
                    <MaterialIcons name="arrow-back-ios" size={26}/>}
                </TouchableOpacity>
                <Text style={[styles.title]}>Change Password</Text>
                <TouchableOpacity activeOpacity={1} underlayColor="white" onPress={() => callFPassApiAfterValidate()}
                style={{ alignItems: 'center', justifyContent: 'center', }}>
                    <Image style={{ width: 22, height: 22, alignSelf: 'center' }} resizeMode={'contain'} source={require('../Assets/Icons/HeaderCheck.png')} />
                </TouchableOpacity>
            </View> */}

            <View style={styles.container}>
                <ScrollView>
                    <KeyboardAvoidingView>


                        <View style={{ width: '100%', paddingVertical: 0 }}>

                            <View style={{ marginTop: 20, }}>
                                <CommonInput
                                    value={pass}
                                    maxLength={20}
                                    placeholder={!pass ? "Current Password" : ''}
                                    secureTextEntry={securePass}
                                    onChangeText={val =>setPass(val)}
                                    rightIcon={
                                        <Icon
                                            underlayColor='transparent'
                                            type={!securePass ? "feather" : 'material-community'}
                                            name={!securePass ? "eye" : 'eye-off-outline'}
                                            color={!securePass ? Colors.ThemeGreen : Colors.Black}
                                            size={height / 30}
                                            onPress={() => setSecurePass(!securePass)}
                                            />}
                                />

                            </View>
                            <View style={{}}>
                                <CommonInput
                                    value={NewPass}
                                    maxLength={20}
                                    placeholder={!NewPass ? "New Password" : ''}
                                    secureTextEntry={NewSecurePass}
                                    onChangeText={val =>{setNewPass(val)}}
                                    rightIcon={
                                        <Icon
                                            underlayColor='transparent'
                                            type={!NewSecurePass ? "feather" : 'material-community'}
                                            name={!NewSecurePass ? "eye" : 'eye-off-outline'}
                                            color={!NewSecurePass ? Colors.ThemeGreen : Colors.Black}
                                            size={height / 30}
                                            onPress={() => setNewSecurePass(!NewSecurePass)}
                                            />}
                                />

                            </View>
                            <View style={{}}>
                                <CommonInput
                                    value={CPass}
                                    maxLength={20}
                                    placeholder={!CPass ? "Confirm Password" : ''}
                                    secureTextEntry={CSecurePass}
                                    onChangeText={val =>{setCPass(val)}}
                                    rightIcon={
                                        <Icon
                                            underlayColor='transparent'
                                            type={!CSecurePass ? "feather" : 'material-community'}
                                            name={!CSecurePass ? "eye" : 'eye-off-outline'}
                                            color={!CSecurePass ? Colors.ThemeGreen : Colors.Black}
                                            size={height / 30}
                                            onPress={() => setCSecurePass(!CSecurePass)}
                                            />}
                                />

                            </View>




                        </View>
                    </KeyboardAvoidingView>
                    {/* <View style={{ justifyContent: 'flex-end', marginTop: 10, alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => callFPassApiAfterValidate()} style={{ width: width / 2, height: 60, backgroundColor: '#007bbf', marginTop: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
                            <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>Save</Text>
                        </TouchableOpacity>
                    </View> */}
                </ScrollView>

            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    title: Platform.select({
        ios: {
          fontSize: 18,
          fontWeight: '600',
          color:"#111"
        },
        android: {
          fontSize: 18,
          fontFamily: 'sans-serif-medium',
          fontWeight: 'normal',
          color:"#111"
        },
        default: {
          fontSize: 18,
          fontWeight: '500',
          color:"#111"
        },
    }),
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#F6F6F6',
    }
});

export default ChangePassword
