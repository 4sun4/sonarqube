import React, {useEffect, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Feather from 'react-native-vector-icons/Feather';
import Loader from '../Components/Loader';
import Colors from '../Util/Colors';
import {GetStoreData, normalizeSize, requestNotificationPermission} from '../Util/CommonFun';
import Config from '../Util/Config';
import {StackActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import Types from '../redux/Types';
import { CallPostRestApi, callPostRest } from '../Services/Api';
import { showMessage } from 'react-native-flash-message';

const data = [
  {id: 1, label: 'Spain', value: 'spain'},
  {id: 2, label: 'Madrid', value: 'madrid'},
  {id: 3, label: 'Barcelona', value: 'barcelona'},

  {id: 4, label: 'Italy', value: 'italy'},
  {id: 5, label: 'Rome', value: 'rome'},

  {id: 6, label: 'Finland', value: 'finland'},
];
 

const SelectEmployer = props => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const [selectEmpOpen, setSelectEmpOpen] = useState(false);
  const [selectEmpValue, setSelectEmpValue] = useState(null);
  const [empData, setEmpData] = useState([]);

  useEffect(()=>{
    if(props?.route?.params){
      const employeeData = props?.route?.params?.data
      const newData = employeeData?.map((e)=>{
        const obj ={
          id:e?.id,
          label:e?.name,
          value:e?.apiLink,
          secret:e?.secretKey
        }
        return obj
      })
      setEmpData(newData)
    }
     requestNotificationPermission();
  },[props?.route?.params])

  const handleLogout = async () => {
    try {
        await AsyncStorage.clear()
        dispatch({ type: Types.LOGIN_STATUS, data: null })
        dispatch({ type: Types.LOG_OUT, data: null })
        dispatch({ type: Types.NEWUSER, data: null });
        props.navigation.dispatch(
            StackActions.replace("AuthStackScreen", { screen: "Login" })
        )

    } catch (error) {
        console.log(error)
    }
  }
  const setFcmTokenApi = async () => {
    setLoading(true);
    console.log('\n---globalThis---', globalThis.FCMToken);
    let body = {
      device_token:
        globalThis && globalThis.FCMToken ? globalThis.FCMToken : null,
      device_type: Platform.OS,
    };
    let url = Config().setCandidateDeviceToken;
   
      await CallPostRestApi(body, url)
        .then(res => {
          setLoading(false);
          console.log('\n---setFcmTokenApi res---', res);
          // props.navigation.dispatch(
          //   StackActions.replace('Home', {screen: 'Home'}),
          // );
        })
        .catch(error => {
          setLoading(false);
          console.log('\n----setFcmTokenApi error----', error);
          // showMessage({message: 'Error', description: error, type: 'warning'});
        });
    
  };

  const handleContinue =async()=>{
    if(!selectEmpValue){
     alert("Please select any employer")
     return
    }
    setLoading(true);
    let url = selectEmpValue
    let lastSlashIndex = url?.lastIndexOf('/');
    if (lastSlashIndex !== -1 && lastSlashIndex === url.length - 1) {
      url = url.slice(0, lastSlashIndex);
    }
    const routeData = props?.route?.params
    const selectedItem = routeData?.data?.filter((e)=>e?.apiLink == selectEmpValue)
     const URL = url + "/api/sso/login"
     let token = GetStoreData().token;
     const params ={
      SSO_SECRET:selectedItem[0].secretKey,
      SSO_TOKEN:token,
      email:routeData?.email,
      login_type:"candidate"
     }
     console.log("SSO PARAMS",params,"URL:",URL);
     await callPostRest(URL, params)
     .then(async res => {
       console.log('SSO LOGIN res :- ', res);
       setLoading(false);

       if (res && res?.token) {
        const facilityData = {
          url:url,
          facility:selectedItem[0]?.name
        }
        console.log("facility dat",facilityData);
        await dispatch({type: Types.LOGIN_STATUS, data: res});
        await dispatch({type: Types.SET_BASE_URL, data: facilityData});
        setFcmTokenApi();
        setTimeout(() => {
          props.navigation.dispatch(
            StackActions.replace('Home', {screen: 'Home'}),
          );
        }, 200);
       }
     })
     .catch(error => {
       setLoading(false);
       console.log('SSO LOGIN error :- ', error);
     });
  }


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#1c78ba'} />
      {loading ? <Loader /> : null}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            handleLogout();
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
              // fontWeight: 'bold',
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
            flex: 0.38,
            backgroundColor: '#1c78ba',
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
              backgroundColor: '#fff',
            }}>
            <View>
              <Text style={[styles.loginTxt, {marginTop: 8, marginBottom: 30}]}>
                Select Employer
              </Text>
              <DropDownPicker
                open={selectEmpOpen}
                value={selectEmpValue}
                items={empData}
                zIndex={1000}
                maxHeight={Config().height / 3}
                setOpen={setSelectEmpOpen}
                autoScroll={true}
                setValue={setSelectEmpValue}
                setItems={setEmpData}
                listMode="FLATLIST"
                placeholder="Select Employer"
                listItemContainerStyle={{marginVertical: 3}}
                selectedItemLabelStyle={{fontWeight: 'bold'}}
                labelStyle={{fontSize: 16}}
                itemSeparator={true}
                itemSeparatorStyle={{backgroundColor: '#c5baba'}}
                dropDownContainerStyle={{
                  zIndex: 9999,
                  backgroundColor: Colors.White,
                  borderColor: Colors.Border,
                }}
                placeholderStyle={{
                  color: '#7d7979',
                  fontSize: 16,
                }}
                style={{
                  borderColor: '#c5baba',
                  borderWidth: 2,
                  borderRadius: 5,
                  minHeight: 45,
                }}
                onChangeValue={value => {
                  console.log(value);
                }}
                onPress={open => setSelectEmpOpen(false)}
              />
            </View>
            <View style={{marginBottom: 6}}>
              <TouchableOpacity
                style={[styles.buttonContainer]}
                onPress={handleContinue}>
                <Text style={[styles.buttonText]}>Continue</Text>
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
    top:50,
    left: 0,
    zIndex: 999,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.ThemeBackground,
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
    fontSize: normalizeSize(14),
    fontWeight: 'bold',
    marginTop: 10,
    paddingBottom: 5,
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

export default SelectEmployer;
