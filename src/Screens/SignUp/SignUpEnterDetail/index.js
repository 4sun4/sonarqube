import React, { useEffect } from 'react';
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
  BackgroundImage,
  Platform,
  FlatList,
} from 'react-native';
import { useState } from 'react';
import Colors from '../../../Util/Colors';
import {
  CapitalizeName,
  normalizeSize,
  validateEmail,
  validateMobile,
  validatePin,
  validateTenNo,
} from '../../../Util/CommonFun';
import KeyBoardWrapper from '../../../Components/KeyBoardWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import { callGetRestApis, callProfileDetail ,callGetPlacesApi} from '../../../Services/Api';
import Config, { PLACES_APIKEY } from '../../../Util/Config';
import Types from '../../../redux/Types';
import Loader from '../../../Components/Loader';
import _ from 'lodash';
import DropDownPicker from 'react-native-dropdown-picker';
import { getCountry, getFilteredCountries, getStates } from 'country-state-picker';
import useKeyboardHeight from '../../../Hooks/useKeyboardHeight';

const backBtn = require('../../../Assets/Icons/BackScreen.png');
const LogoNew = require('../../../Assets/Icons/LogoNew.png');
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
let filteredCountries = getFilteredCountries(['au', 'New Zealand'])
const SignUpEnterDetail = (props, route) => {
  const KeyboardHeight = useKeyboardHeight();
  const [data, setData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    address: '',
    address2: '',
    suburb: '',
    postcode: '',
    UserData: null,
    Country: '',
    selectedCountry: {},
    state: '',
    selectedState: {},
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [openState, setOpenState] = useState(false);
  const [valueState, setValueState] = useState(null);
  const [stateList, setStateList] = useState([]);
  const [placesData,setPlacesData] = useState([]);
  const [autoSearchEnabled,setAutosearchEnabled] = useState(false);

  const dispatch = useDispatch();
  const UData = useSelector(S =>
    S &&
      S.loginStatus &&
      S.loginStatus.loginData &&
      Object.keys(S.loginStatus.loginData).length != 0
      ? S.loginStatus.loginData
      : '',
  );
  // console.log('Props data', data);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', async () => {
      setCountryData()
      getUserDetails();

    });
    return unsubscribe;
  }, []);



  const setStateData = async (code) => {
    let states = getStates(code);
    let arr = states.map((i) => ({label:i,value:i}) )
    if (arr && arr != '') {setStateList(arr)}}


  const getUserDetails = async () => {
    if (UData && UData.token) {
      let URL = Config().getDetails;
      console.log('URL', URL);
      setLoading(true);
      await callGetRestApis(URL)
        .then(res => {
          setLoading(false);
          if (res && res != '') {
            let DATA = { ...UData, ...res[0] };
            dispatch({ type: Types.LOGIN_STATUS, data: DATA });
            setData({
              ...data,
              UserData: DATA,
              email: DATA?.email,
              first_name: CapitalizeName(DATA?.first_name),
              last_name: CapitalizeName(DATA?.last_name),
              mobile: DATA?.mobile,
              Country: CapitalizeName(DATA?.Country),
              state: CapitalizeName(DATA?.state),
              postcode: DATA?.pc,
              suburb: DATA?.suburb,
              address: CapitalizeName(DATA?.street_address),
              address2: CapitalizeName(DATA?.street_address_line_2),
            });
          }
          console.log('getUserDetails res :- ', res);
        })
        .catch(error => {
          setLoading(false);
          console.log('getUserDetails error :- ', error);
          showMessage({ message: 'Error', description: error, type: 'warning' });
        });
    } else {
      console.log('token not available');
    }
  };

  const handleAutosearch=async(value)=>{
    setData({...data,address:value})
   if(value !=''){
    setAutosearchEnabled(true)
     setTimeout(async()=>{
      let placeURL=Config().PlacesApiURL + value + '&apiKey='+PLACES_APIKEY
      await callGetPlacesApi(placeURL)
        .then((res)=>{
          setPlacesData(res?.features)
        })
        .catch((err)=>{
          console.log('autosearch error :- ', err);
          setAutosearchEnabled(false)
        })
     },1000)
   }
  }

  const setCountryData = async () => {
    let arr = filteredCountries.map((i) => ({ 
      label: i.name, value: i.name, 
      testID: i.code, code: i.code,
      dial_code: i.dial_code }));
    if (arr && arr != '') {setCountryList(arr); /*setStateList([]);*/
      setData({ ...data, Country: '', selectedCountry: {}, state: '', selectedState: {}})}}

  const onSelectAddress=(place)=>{
    setAutosearchEnabled(false)
    let countrydetails=countryList.filter((e)=> e.code == place?.country_code)
    let statedetails=getStates(place?.country_code)
    let arr = statedetails.map((i) => ({label:i,value:i}) )
    let filteredState=[]

    if (arr && arr != '') {
     filteredState=arr.filter((i)=>i.value == place?.state)
    }

    setValue(place?.country)
    setStateData(place?.country_code)
    setValueState(place?.state)
    setData({...data,address:place?.address_line1,address2:place?.address_line2,suburb:place?.city,postcode:place?.postcode,Country:place.country,state:place?.state,selectedCountry:countrydetails.length>0?countrydetails[0]:{},selectedState:filteredState.length>0?filteredState[0]:{}})
    
  }
  
  const submit = async () => {
    if (!data.first_name) {
      Alert.alert('Alert', 'Please enter first name');
      return false;
    }

    if (!data.mobile) {
      Alert.alert('Alert', 'Please enter mobile number');
      return false;
    }

    if (!validateMobile(data.mobile) && !validateTenNo(data.mobile)) {
      Alert.alert('Alert', 'Please enter valid mobile number');
      return false;
    }

    if (!data.address) {
      Alert.alert('Alert', 'Please enter address line 1');
      return false;
    }
    if (!data.Country) {
      Alert.alert('Alert', 'Please select country');
      return false;
    }
    if (!data.state) {
      Alert.alert('Alert', 'Please select state');
      return false;
    }
    if (!data.postcode) {
      Alert.alert('Alert', 'Please enter post code');
      return false;
    }

    // if (!validatePin(data.postcode)) {
    //   Alert.alert('Alert', 'Please enter valid post code');
    //   return false;
    // }


    var URL = Config().profileUpdateDetails;
    let body = {
      first_name: data?.first_name,
      last_name: data?.last_name,
      mobile: data?.mobile,
      street_address: data?.address,
      street_address_line_2: data?.address2,
      suburb: data?.suburb,
      state: data?.state,
      Country: data?.Country,
      pc: data?.postcode,
    };
    let token = props.route.params.token;

    setLoading(true);
    await callProfileDetail(URL, body, token)
      .then(async res => {
        console.log('Profile res :- ', res);
        setLoading(false);

        if (res) {
          showMessage({
            message: 'Success',
            description: 'Profile Details updated successfully.',
            type: 'success',
          });
          await dispatch({ type: Types.Profile_Update_Details, data: res });
          setTimeout(() => { }, 300);
          goToSignUpUploadPic();
        }
      })
      .catch(error => {
        setLoading(false);
        console.log('callProfileDetails error :- ', error);
        showMessage({ message: 'Error', description: error, type: 'warning' });
      });
  };

  const goToSignUpUploadPic = async () => {
    props.navigation.navigate('SignUpUploadPic');
  };

  const BackNextBtn = ({ }) => {
    return (
      <View style={styles.touchCont}>
        <TouchableOpacity
          style={styles.halfBtn}
          onPress={() => props.navigation.goBack()}>
          <Text style={styles.halfText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.halfBtn2} onPress={() => submit()}>
          <Text style={styles.halfText2}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPlacesData=({item,index})=>{
    // console.log('--places item:',item?.properties)
    return(
      <TouchableOpacity key={index} style={styles.placeListWrapper} activeOpacity={0.7} onPress={()=>onSelectAddress(item.properties)}>
        <Text>{item?.properties.address_line1 +" "+ item?.properties.address_line2}</Text>
        {/* {item.properties.country !=''&&( <Text> ,{item?.properties.country}</Text>)} */}
      </TouchableOpacity>
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      {loading ? <Loader /> : null}
      <ScrollView
        scrollEnabled={open || openState ? false : true}
        style={{ marginBottom:10}}
        contentContainerStyle={{ paddingBottom:Platform.OS === "ios" ? 0:KeyboardHeight}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={[styles.view3]}>
          <Text style={styles.text}>Please enter your details</Text>
          <Text style={styles.text1}>My Details</Text>

          <TextInput
            value={data.first_name}
            style={styles.inputStyle}
            placeholder="First name"
            placeholderTextColor={Colors.Placeholder}
            textValue={data.first_name}
            keyboardShouldPersistTaps
            onChangeText={value => setData({ ...data, first_name: value })}
          />
          <TextInput
            value={data.last_name}
            style={styles.inputStyle}
            placeholder="Last name"
            placeholderTextColor={Colors.Placeholder}
            textValue={data.last_name}
            keyboardShouldPersistTaps
            onChangeText={value => setData({ ...data, last_name: value })}
          />
          <TextInput
            value={data.email}
            style={styles.inputStyle}
            placeholder="Email"
            editable={false}
            placeholderTextColor={Colors.Placeholder}
            textValue={data.email}
            keyboardShouldPersistTaps
            onChangeText={value => setData({ ...data, email: value })}
          />
          <TextInput
            value={data.mobile}
            style={styles.inputStyle}
            placeholder="Mobile number"
            placeholderTextColor={Colors.Placeholder}
            textValue={data.mobile}
            keyboardType={'number-pad'}
            maxLength={10}
            returnKeyLabel="Done"
            returnKeyType="done"
            keyboardShouldPersistTaps
            onChangeText={value => setData({ ...data, mobile: value })}
          />

          <TextInput
            value={data.address}
            style={styles.inputStyle}
            placeholder="Address Line 1"
            placeholderTextColor={Colors.Placeholder}
            // textValue={data.address}
            keyboardShouldPersistTaps
            onChangeText={(val)=>handleAutosearch(val)}
          />
          {autoSearchEnabled&&(
            <FlatList
              data={placesData}
              style={{marginTop:3,borderRadius:5}}
              renderItem={renderPlacesData}
              keyExtractor={(index) => JSON.stringify(index)}
            />
          )}
        
          <TextInput
            value={data.address2}
            style={styles.inputStyle}
            placeholder="Address Line 2"
            placeholderTextColor={Colors.Placeholder}
            textValue={data.address2}
            keyboardShouldPersistTaps
            onChangeText={value => setData({ ...data, address2: value })}
          />
          <TextInput
            value={data.suburb}
            style={styles.inputStyle}
            placeholder="Suburb"
            placeholderTextColor={Colors.Placeholder}
            textValue={data.suburb}
            keyboardShouldPersistTaps
            onChangeText={value => setData({ ...data, suburb: value })}
          />
          <DropDownPicker
              open={open}
              value={value}
              items={countryList}
              zIndex={openState ? -99999 : 99999}
              maxHeight={Config().height / 3}
              setOpen={setOpen}
              itemKey={(item, index) => String(index)}
              setValue={setValue}
              disabled={openState ? true : false}
              setItems={setCountryList}
              listMode="FLATLIST"
              placeholder="Select Country*"
              listItemContainerStyle={{ paddingVertical: 5 }}
              selectedItemLabelStyle={{ fontWeight: 'bold' }}
              dropDownContainerStyle={[styles.dpListCont,{zIndex: openState ? -9999 : 9999}]}
              placeholderStyle={{ borderColor: Colors.Border }}
              style={[styles.dpStyle,{zIndex: openState ? -9999 : 9999}]}
              onSelectItem={val => {
                setData({ ...data, selectedCountry: val,Country: val?.value });
                setStateData(val.code);console.log('-Selected cntr-',val)
              }}
              // onChangeValue={value => {
              //   setData(prev=>({ ...prev, Country: value }));
              //   console.log('- couJny-',value)
              // }}
              onPress={open => setOpen(false)}
            />



           <DropDownPicker
              open={openState}
              value={valueState}
              items={stateList}
              zIndex={open ? -99999 : 99999}
              maxHeight={Config().height / 3}
              setOpen={setOpenState}
              itemKey={(item, index) => String(index)}
              setValue={setValueState}
              disabled={open ? true : false}
              setItems={setStateList}
              listMode="FLATLIST"
              placeholder="Select State*"
              listItemContainerStyle={{ paddingVertical: 5 }}
              selectedItemLabelStyle={{ fontWeight: 'bold' }}
              dropDownContainerStyle={[styles.dpListCont,{zIndex: open ? -9999 : 9999}]}
              placeholderStyle={{ borderColor: Colors.Border }}
              style={[styles.dpStyle,{zIndex: open ? -9999 : 9999}]}
              onSelectItem={val => {setData({ ...data, selectedState: val })}}
              onChangeValue={value => {setData({ ...data, state: value }) }}
              onPress={open => setOpenState(false)}
            />




        {/* <TextInput
            value={data.Country}
            style={styles.inputStyle}
            placeholder="Country"
            placeholderTextColor={Colors.Placeholder}
            textValue={data.Country}
            keyboardShouldPersistTaps
            onChangeText={value => setData({ ...data, Country: value })}
          />

          <TextInput
            value={data.state}
            style={styles.inputStyle}
            placeholder="State"
            placeholderTextColor={Colors.Placeholder}
            textValue={data.state}
            keyboardShouldPersistTaps
            onChangeText={value => setData({ ...data, state: value })}
          /> */}


          <TextInput
            value={data.postcode}
            style={styles.inputStyle}
            placeholder="Post code"
            placeholderTextColor={Colors.Placeholder}
            textValue={data.postcode}
            keyboardShouldPersistTaps
            keyboardType="number-pad"
            maxLength={10}
            returnKeyLabel="Done"
            returnKeyType="done"
            onChangeText={value => setData({ ...data, postcode: value })}
          />

          <BackNextBtn />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  touchCont: {
    flexDirection: 'row',
    margin: 30,
    width: '100%',
    justifyContent: 'space-around',
  },
  halfBtn: {
    width: (screenWidth - 60) / 2.5,
    height: 60,
    backgroundColor: Colors.Trans,
    borderWidth: 1,
    borderColor: Colors.halfBlack,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  dpStyle:{
    marginTop: 30,
    alignSelf:'center',
    borderColor: Colors.Border,
    width: screenWidth - 60,
    height: normalizeSize(50),
  },
  dpListCont: { 
    backgroundColor: Colors.White,
    borderColor: Colors.Border,
    marginTop:normalizeSize(25),
  },
  halfBtn2: {
    width: (screenWidth - 60) / 2.5,
    height: 60,
    // backgroundColor: '#D02530',
    backgroundColor: '#1c78ba',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  halfText: {
    color: Colors.Black,
    fontSize: normalizeSize(17),
    fontWeight: '600',
  },
  halfText2: {
    color: 'white',
    fontSize: normalizeSize(17),
    fontWeight: '600',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F6F6F6',
  },
  useText: {
    color: Colors.halfBlack,
    fontSize: 15,
    marginTop: 30,
    fontWeight: '600',
  },
  btn: {
    width: screenWidth - 60,
    height: 60,
    backgroundColor: '#D02530',
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  btnText: { color: 'white', fontSize: 20, fontWeight: '600' },
  flRowAlCenterJCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alreadyText: {
    marginTop: 15,
    marginBottom: 15,
    alignSelf: 'center',
    fontSize: 17,
    fontWeight: '400',
  },
  loginBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  loginText: {
    color: '#D02530',
    fontSize: 17,
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
    width: '100%',
    alignItems: 'center',
  },
  text: {
    alignSelf: 'center',
    fontSize: normalizeSize(19),
    marginTop: 20,
  },
  text1: {
    alignSelf: 'center',
    fontSize: normalizeSize(17),
    marginTop: 10,
    fontWeight: '700',
  },
  inputStyle: {
    width: screenWidth - 60,
    height: normalizeSize(50),
    backgroundColor: 'white',
    marginTop: 30,
    borderRadius: 10,
    fontSize: normalizeSize(15),
    paddingLeft: 20,
    paddingHorizontal: 10,
    color: Colors.Black,
  },
  view4: {
    alignItems: 'center',
    marginTop: 70,
  },
  placeListWrapper:{
    padding:10,
    backgroundColor:'white',
    width:screenWidth-60,
    flexDirection:'row',
    alignItems:'center'
  }
});

export default SignUpEnterDetail;
