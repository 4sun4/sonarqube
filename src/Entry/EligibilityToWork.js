import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import Config from '../Util/Config';
import Colors from '../Util/Colors';
import { Country_Obj } from '../Util/DumyJson';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { showMessage } from 'react-native-flash-message';
import DocumentPicker from 'react-native-document-picker';
import { FileFun, isVideo, normalizeSize } from '../Util/CommonFun';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { callGetRestApis, callPostRest, globalPostApi } from '../Services/Api';
import DateTimePickerComp from '../Components/DateTimePickerComp';
import moment from 'moment';
import Loader from '../Components/Loader';
import { useSelector } from 'react-redux';
const screenwidth = Dimensions.get('window').width
const sampleDropdownData = [
  {id: 1, label: 'Australian/New Zealand Citizen', value: 'nz_au_citizen'},
  {id: 2, label: 'Visa Holder', value: 'visa_holder'},
];
let LoginData = ''
const EligibilityToWork = (props) => {
  const ProfileDetail = useSelector(S => { let D = ''; if (S && S.HomeDetails && S.HomeDetails.UserDetails && Object.keys(S.HomeDetails.UserDetails).length != 0) { D = S.HomeDetails.UserDetails; if (D) { } } return D })

    const selectNationality = (nationalty)=>{
      const backendString = nationalty;
      let prefixLength = 4;
      let country_arr = Object.values(Country_Obj).sort()
        country_arr = country_arr.map((_country,index)=>({id: index, label: _country, value: _country}))
        let matchingCountries = country_arr.filter(country => 
          country?.label?.slice(0, prefixLength).toLowerCase() === 
          backendString?.slice(0, prefixLength).toLowerCase()
      );
      while (matchingCountries.length > 1 && prefixLength < backendString?.length) {
        prefixLength++;
        matchingCountries = country_arr?.filter(country => 
            country?.label?.slice(0, prefixLength).toLowerCase() === 
            backendString?.slice(0, prefixLength).toLowerCase()
        );
    }
  
      const firstMatchingCountry = matchingCountries?.length === 1 ? matchingCountries[0] : null;
      return firstMatchingCountry?.label
    }
  const [workEntitlementOpen, setWorkEntitlementOpen] = useState(false);
  const [workEntitlementValue, setWorkEntitlementValue] = useState(null);
  const [workEntitlementData, setWorkEntitlement] = useState(sampleDropdownData);
  const [nationalityOpen, setNationalityOpen] = useState(false);
  // const [nationalityValue, setNationalityValue] = useState(ProfileDetail && ProfileDetail?.work_entitlement === 'visa_holder' &&  ProfileDetail?.passport_nationality ? ProfileDetail?.passport_nationality.slice(0, -1) :ProfileDetail?.passport_nationality === "Australian"?'Australia':'New Zealand');
  const [nationalityValue, setNationalityValue] = useState(ProfileDetail && ProfileDetail?.work_entitlement === 'visa_holder' &&  ProfileDetail?.passport_nationality ?selectNationality(ProfileDetail?.passport_nationality) :selectNationality(ProfileDetail?.passport_nationality));
  const [nationalityFullData, setNationalityFullData] = useState([]);
  const [nationalityData, setNationalityData] = useState([]);
  const [prefillData,setPrefillData] = useState(null)
  const [loading, setLoading] = useState(false);
  const UserDetail = useSelector(S => { let D = ''; if (S && S.loginStatus && S.loginStatus.loginData && Object.keys(S.loginStatus.loginData).length != 0) { D = S.loginStatus.loginData; if (D) { LoginData = D } } return D })

  const {width, height} = Dimensions.get('window');
  const [data, setData] = useState({
    VisaAttribute_id:'',
    visaNo: '',
    visaType: '',
    visaStartDate: "",
    visaEndDate: "",
    visaEndDateIndefiniteStay: false,
    VisaFileName: '',
    VisaDoc: '',
    Show: false, Show1: false,
  });
  const {Show, Show1, } = data

  const isShowVisa = workEntitlementValue == "visa_holder";

  useEffect(() => {
    getAttributeList();
    getCountryListApi();
  }, [])
  
 useEffect(()=>{
    if(nationalityFullData){
      getWorkEntitlement()
    }
 },[nationalityFullData])
 
  const getAttributeList = async () => {
    if (LoginData && LoginData.token) {
        let URL = Config().candidateAttributeList
        console.log('URL', URL);
        setLoading(true)
        await callGetRestApis(URL)
            .then((res) => {
                setLoading(false)
                if (res && res.length > 0) {
                 res =  res.filter(attribute => 
                    attribute.attribute_name.includes("Visa"))
                    // console.log(res,"--------response--")
                    setData({ ...data, VisaAttribute_id:res[0] && res[0].attribute_id  })
                }
                console.log('getAttributeList res :- ', res)

            })
            .catch((error) => {
                setLoading(false)
                console.log('getAttributeList error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })

    } else {

    }
}

const getCountryListApi =async()=>{
    if (LoginData && LoginData.token) {
      let URL = Config().getCountryList
      console.log('URL', URL);
      setLoading(true)
      await callGetRestApis(URL)
          .then((res) => {
              setLoading(false)
              if (res && res.length > 0) {
                let country_arr = Object.values(res).sort()
                country_arr = country_arr.map((item,index)=>({id: item?.nationality_id, label: item?.nationality, value: item?.nationality}))
                setNationalityFullData(country_arr)
                setNationalityData(country_arr);
              }
              // console.log('getCountryListApi res :- ', res)

          })
          .catch((error) => {
              setLoading(false)
              console.log('getCountryListApi error :- ', error)
              showMessage({ message: 'Error', description: error, type: "warning", });
          })
  }
}

  const getWorkEntitlement = async()=>{
    try {
        let URL = Config().getWorkEligibilityDetails
        console.log('URL', URL);
        setLoading(true)
        await callGetRestApis(URL)
            .then((res) => {
              if(res?.data){
                setPrefillData(res?.data)
                 if(nationalityFullData?.length >0){
                    const selectedCountry = nationalityFullData?.filter((el)=> el.value === res?.data?.passport_nationality)
                    const selectedEntitlement = sampleDropdownData?.filter((el)=> el.value === res?.data?.work_entitlement)
                    setNationalityValue(selectedCountry[0]?.value)
                    setWorkEntitlementValue(selectedEntitlement[0]?.value)
                 }
                 const indefiniteValue = res?.data?.indefinite === 1
                  setData(prev => ({
                    ...prev,
                    visaStartDate: res?.data?.visa_start_date ?? "",
                    visaEndDate: res?.data?.visa_end_date ?? "",
                    visaNo: res?.data?.visa_number,
                    visaType: res?.data?.visa_type,
                    VisaFileName: res?.data?.filename,
                    VisaDoc:res?.data?.filename,
                    visaEndDateIndefiniteStay: indefiniteValue
                  }));
                }
                setLoading(false)
                console.log('getWorkEntitlement res :-', res)

            })
            .catch((error) => {
                setLoading(false)
                console.log('getWorkEntitlement error :-', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })
    } catch (error) {
      
    }
  }

  const ChooseOption = () => {
    Alert.alert(
        'Alert',
        'Upload file?',
        [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Gallery',
                onPress: () => selectOneFile(),
            },
            {
                text: 'Camera', onPress: () => {
                    if (Platform.OS === 'android') { requestCameraPermission(); }
                    else { getProductImages() }
                }
            },

        ],
        { cancelable: false },
    );
  }

  const requestCameraPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: "App Camera Permission",
                message: "Needs access to your camera to update profile image",
                buttonPositive: "OK"
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getProductImages()
            console.log("You can use the camera");
        }
        else { console.log("Camera permission denied"); }
    } catch (err) { console.warn(err); }
  };

  
  const selectOneFile = async () => {
    setLoading(true)

    try {
        const resp = await DocumentPicker.pick({
            type: [DocumentPicker.types.allFiles],
        });
        const res = resp[0]
        console.log('res : ', res);
        console.log('URI : ' + res.uri);
        console.log('Type : ' + res.type);
        console.log('File Name : ' + res.name);
        console.log('File Size : ' + res.size);
        let name = res && res.name ? res.name : ""
        let type = res && res.type ? res.type : ""
        setLoading(false)

        if (isVideo(type) || isVideo(name)) {
            showMessage({ message: 'Alert', description: "Please Select Valid FileType", type: "warning", });
        }
        else {
            if (res && res.uri) {
                setData({ ...data, VisaDoc: res,VisaFileName: name })
                showMessage({ message: 'Success', description: 'Document Picked Successfully.', type: "success", });

            }
        }
    } catch (err) {
        setLoading(false)

        if (DocumentPicker.isCancel(err)) {
        } else {
            showMessage({ message: 'Error', description: err, type: "warning", });

            throw err;
        }
      }
  };
  const options = {
    mediaType: 'photo',
    includeBase64: false,
    // maxHeight: 500,
    // maxWidth: 500,
};

  const getProductImages = async (Gallery) => {
    let methodName = launchImageLibrary
    if (!Gallery) { methodName = launchCamera }
    setLoading(true)

    methodName(options, (res) => {
        let response = res.hasOwnProperty('assets') ? res.assets[0] : res
        if (response.didCancel) {
            console.log("User cancelled image picker ");
            setLoading(false)

        } else if (response.error) {
            console.log("ImagePicker Error:  ", response.error);
            setLoading(false)

        } else {
            console.log('Profile image  =>  ', response)
            setData({ ...data, VisaDoc: response,VisaFileName:response.fileName })
            setLoading(false)
            showMessage({ message: 'Success', description: 'Document Picked Successfully.', type: "success", });

            let FileSize = 0
            if (response.fileSize) { FileSize = response.fileSize }
            if (FileSize && FileSize > 2500000) {
                let widthN = 400
                let heightN = 300
                if (response.height) { heightN = response.height / 4 }
                if (response.width) { widthN = response.width / 4 }
                let Rot = 0
                if (response.originalRotation) { Rot = response.originalRotation }

            } else {
                if (response && response.uri) {
                    setData({ ...data, VisaDoc: response,VisaFileName:response.fileName })
                }
            }
        }
    });
  }

  const checkValidation =()=>{
    if(!workEntitlementValue){
      alert("Please select any work entitlement")
      return false
    }
    else if(!nationalityValue){
      alert("Please select any work nationalty")
      return false
    }
    else if(isShowVisa){
      if(!data?.visaNo){
        alert("Please enter Visa Number")
        return false
      }
      else if(!data?.visaType){
        alert("Please enter Visa Type")
        return false
      }
      else if(data.visaEndDateIndefiniteStay){
        if(!data?.VisaDoc && !prefillData?.document_id){
          alert("Please select document")
          return false
        }
        return true
      }
      else{
        const momentVisStartData =moment(data?.visaStartDate)
        const isVisaNotValid = moment(data?.visaEndDate).isBefore(momentVisStartData)
        
        if(!data?.visaStartDate){
          alert("Please select Visa Start Date")
          return false
        }
        else if(!data?.visaEndDate){
          alert("Please select Visa End Date")
          return false
        }
        else if(isVisaNotValid){
          alert("Visa End Date is not valid")
          return false
        }
        else if(!data?.VisaDoc && !prefillData?.document_id){
          alert("Please select document")
          return false
        }
        else {
          return true
        }
      }
    }
    else{
      return true
    }
  }

  const onPressSubmit = ()=>{
    const isValid = checkValidation()
    if(!isValid){
      return
    }
    sendWorkData()
  };

  const sendWorkData=async()=>{
    let formdata = new FormData();
    formdata.append("work_entitlement",workEntitlementValue)
    formdata.append("passport_nationality",nationalityValue)
    if(isShowVisa){
      const yesterday = moment().subtract(1, 'days').format("YYYY-MM-DD")
      const tomorrow = moment().add(1, 'days').format("YYYY-MM-DD")
      let file = FileFun(data?.VisaDoc)

      const indefiniteValue = data?.visaEndDateIndefiniteStay ? 1 : 0 
      formdata.append("visa_number",data?.visaNo)
      formdata.append("visa_type",data?.visaType)
      formdata.append("indefinite",indefiniteValue)
      formdata.append("attribute_id",data?.VisaAttribute_id)
      formdata.append("start_date", data?.visaStartDate)
      formdata.append("expire_date", data?.visaEndDate)
      if(!prefillData?.document_id){
        formdata.append("file",file)
      }
    }
    console.log("params",formdata);
    setLoading(true)
    let URL = Config().workEligibility
    console.log('URL', URL);
    await globalPostApi(URL,formdata)
        .then((res) => {
            setLoading(false)
            if (res && res.success) {
                console.log('eligibity to work res :- ', res)
                showMessage({ message: 'Success', description: 'Eligibity to work added successfully.', type: "success", });
                props.navigation.goBack()
            }
        })
        .catch((error) => {
            setLoading(false)
            console.log('eligibity to work error :- ', error)
            // showMessage({ message: 'Error', description: error, type: "warning", });
        })
  }
  
  useEffect(()=>{
    if(nationalityFullData?.length > 0){
      let country_arr = Object.values(nationalityFullData)
      const filteredCountries = country_arr.filter((e)=> !isShowVisa ? e?.value == "Australian" || e?.value == "New Zealand" : e)
      setNationalityData(filteredCountries);
    }
  },[isShowVisa]);

  const handleConfirm = (date, type) => {
    const newDate = moment(date).format("YYYY-MM-DD")
   if(type == "Start"){
    setData({...data,Show: false,visaStartDate:newDate})
   }
   else{
    console.log("visaStartDate",data);
    setData({...data,Show1: false,visaEndDate:newDate})
   }
   setTimeout(() => {
    // hideDatePicker(type)
   }, 200);
 };

const hideDatePicker = (type) => {
  if (type == 'Start') {
      setData({ ...data,Show: false, })
  }
  else {
      setData({ ...data,Show1: false, })
  }
};


  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingVertical: 16,
        backgroundColor: '#fff',
      }}>
         {loading ? <Loader /> : null}
      <ScrollView 
        keyboardShouldPersistTaps="handled" 
        contentContainerStyle={{paddingHorizontal: 16,flexGrow:1,}}>
        <KeyboardAvoidingView style={{flex:1,}}>
          <View
            style={{
              backgroundColor: '#d8e4f6',
              borderRadius: 12,
              marginBottom: 20,
              marginHorizontal: 30,
              paddingLeft: 15,
              paddingRight: 15,
              paddingVertical: 8,
              shadowColor: '#000',
              shadowOffset: {width: 1, height: 1},
              shadowOpacity: 0.6,
              shadowRadius: 3,
              elevation: 5,
              marginTop:15
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 14,
                paddingVertical: 4,
                color: '#111',
              }}>
              Provide details about your eligibility to work. To view any previously submitted information, visit the My Compliances page.
            </Text>
          </View>
  
            <Text style={[{marginTop: 8, marginBottom: 8, color: '#808080'}]}>
              What is your Work Entitlement ?
            </Text>
            <DropDownPicker
              open={workEntitlementOpen}
              value={workEntitlementValue}
              items={workEntitlementData}
              // zIndex={1000}
              maxHeight={Config().height / 3}
              setOpen={(val)=>{
                setNationalityOpen(false);
                setWorkEntitlementOpen(val);
              }}
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}
              autoScroll={true}
              setValue={setWorkEntitlementValue}
              setItems={setWorkEntitlement}
              listMode="SCROLLVIEW"
              placeholder="Please select..."
              listItemContainerStyle={{marginVertical: 3}}
              selectedItemLabelStyle={{fontWeight: 'bold'}}
              labelStyle={{fontSize: 16}}
              itemSeparator={true}
              itemSeparatorStyle={{backgroundColor: '#c5baba'}}
              dropDownContainerStyle={{
                backgroundColor: Colors.White,
                borderColor: Colors.Border
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
            />

            <Text style={[{marginTop: 8, marginBottom: 8, color: '#808080'}]}>
              What is your Passport Nationality ?
            </Text>
            <DropDownPicker
              open={nationalityOpen}
              value={nationalityValue}
              items={nationalityData}
              zIndex={1000}
              maxHeight={Config().height / 3}
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}
              setOpen={(val)=>{
                setWorkEntitlementOpen(false);
                setNationalityOpen(val);
              }}
              autoScroll={true}
              setValue={setNationalityValue}
              setItems={setNationalityData}
              listMode="SCROLLVIEW"
              placeholder="Please select..."
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
            />

          {isShowVisa ? (
            <>
              <View
                style={{
                  backgroundColor: '#d8e4f6',
                  borderRadius: 12,
                  marginBottom: 20,
                  marginHorizontal: 30,
                  paddingLeft: 15,
                  paddingRight: 15,
                  paddingVertical: 8,
                  marginTop: 15,
                  shadowColor: '#000',
                  shadowOffset: {width: 1, height: 1},
                  shadowOpacity: 0.6,
                  shadowRadius: 3
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 14,
                    paddingVertical: 4,
                    color: '#111',
                  }}>
                  Provide enter your visa details
                </Text>
              </View>
              <View>
                <Text style={{fontSize: height / 43, color: '#808080'}}>
                  Visa Number
                </Text>
                <TextInput
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#D8D8D8',
                    fontSize: height / 45,
                    paddingVertical: height / 90,
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  placeholderTextColor="#7A7A7A"
                  keyboardShouldPersistTaps
                  value={data.visaNo}
                  keyboardType='number-pad'
                  onChangeText={value => setData(prev=>({...prev,visaNo:value}))}
                />
              </View>
              <View style={{marginTop: 16}}>
                <Text style={{fontSize: height / 43, color: '#808080'}}>
                  Visa Type
                </Text>
                <TextInput
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#D8D8D8',
                    fontSize: height / 45,
                    paddingVertical: height / 90,
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  placeholderTextColor="#7A7A7A"
                  keyboardShouldPersistTaps
                  value={data.visaType}
                  onChangeText={value => setData(prev=>({...prev,visaType:value}))}
                />
              </View>
              <View style={{marginTop: 16}}>
                <Text style={{fontSize: height / 43, color: '#808080'}}>
                  Visa Start Date
                </Text>
                    <TouchableOpacity 
                     onPress={()=> setData({ ...data, Show: true })}  
                     disabled={data?.visaEndDateIndefiniteStay}
                     style={{
                      borderBottomWidth: 1,
                      borderColor: '#D8D8D8',
                      paddingVertical:  20,
                      backgroundColor: 'white',
                      color: 'black',
                    }}>
                      <Text style={{ fontSize: height / 45, color: 'black',}}>{data.visaStartDate}</Text>
                    </TouchableOpacity>
              </View>
              <View style={{marginTop: 16}}>
                <Text style={{fontSize: height / 43, color: '#808080'}}>
                  Visa End Date
                </Text>
                <View style={{
                  flexDirection:"row",
                  alignItems:"center",  
                  borderBottomWidth: 1,
                  borderColor: '#D8D8D8',}}>
                    <TouchableOpacity 
                      disabled={data?.visaEndDateIndefiniteStay}
                      onPress={()=> setData({ ...data, Show1: true })}  
                      style={{
                      paddingVertical:  20,
                      backgroundColor: 'white',
                      color: 'black',
                      flex:0.6
                    }}>
                      <Text style={{ fontSize: height / 45, color: 'black',}}>{data.visaEndDate}</Text>
                    </TouchableOpacity>
                <View style={{flexDirection:"row",alignItems:"center",flex:0.4,justifyContent:'flex-end',marginRight:10}}>
                    <MaterialCommunityIcons 
                      size={24} 
                      name={data.visaEndDateIndefiniteStay?'checkbox-marked-outline':"checkbox-blank-outline"} 
                      color={data.visaEndDateIndefiniteStay?'#22D2B4':'#808080'} 
                      onPress={()=>{
                        setData(prev=>({...prev,visaEndDateIndefiniteStay:!prev.visaEndDateIndefiniteStay}))
                      }}
                    />
                    <Text style={{fontSize: height / 45, color: '#808080'}}>{' '}Indefinite Stay</Text>
                  </View>
                </View>
              </View>
              <View style={{marginTop: 16}}>
                <Text style={{fontSize: height / 43, color: '#808080'}}>
                  Upload Visa
                </Text>
                {data.VisaDoc ?
                  <View style={{ 
                    marginTop:20,
                    borderWidth: 2,  
                    shadowColor: "#000000",
                    shadowOpacity: 0.8,
                    shadowRadius: 2,
                    shadowOffset: {
                      height: 1,
                      width: 1
                    },
                    elevation:4,
                    borderColor: '#DDD' , paddingVertical: 10, paddingHorizontal: 25, backgroundColor: '#FFF' }}>
                      <View style={{ flexDirection: 'row',justifyContent:'space-between', paddingTop: 5 }}>
                        <Text style={{ color: '#22D2B4' , fontSize: 18, paddingBottom: 5,flex:0.85 }}>{data.VisaFileName}</Text>
                      <TouchableOpacity onPress={() => {
                        setData(prev=>({...prev,VisaDoc:"",VisaFileName:""}))
                        setPrefillData(prev=>({...prev,document_id:null}))
                      }} style={{flex:0.15}}>
                          <Image
                              style={{ width: 24, height: 24, marginHorizontal: 20 }}
                              resizeMode={'contain'}
                              source={require('../Assets/Icons/Delete.png')} />
                      </TouchableOpacity>
                      </View>
                  </View>
                  :
                  <>
                    <View style={{ marginTop: 20, backgroundColor: '#F6F6F6', justifyContent: 'center', alignItems: 'center', borderRadius: 10, paddingTop: 30, paddingBottom: 60 }}>
                        <Image
                            style={{ width: 60, height: 60, marginBottom: 10 }}
                            resizeMode={'contain'}
                            source={require('../Assets/Icons/UploadImage.png')} />
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Upload</Text>
                        <Text style={{ fontSize: 16 }}>Document/Image</Text>
                    </View>
                    <View style={{ marginTop: -60, alignItems: 'center' }}>
                      <TouchableOpacity
                          style={{ width: width / 1.5, height: 60, backgroundColor: '#1c78ba', marginTop: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 30 }}
                          onPress={() => ChooseOption()}
                      >
                          <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>BROWSE</Text>
                      </TouchableOpacity>
                    </View>
                  </>}
              </View>
            </>
          ) : null}
          <TouchableOpacity style={styles.submitBtn} onPress={() => onPressSubmit()}>
            <Text style={styles.submitBtnText}>Submit</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
        <DateTimePickerComp
            isDatePickerVisible={Show}
            handleConfirm={(date) => handleConfirm(date, 'Start')}
            hideDatePicker={() => hideDatePicker('Start')}
            mode={'date'}
            DateVal={data.visaStartDate !="" ?new Date(data.visaStartDate):new Date() }
        />

        <DateTimePickerComp
            isDatePickerVisible={Show1}
            handleConfirm={(date) =>  handleConfirm(date, 'expire')}
            hideDatePicker={() => hideDatePicker('expire')}
            mode={'date'}
            DateVal={data.visaEndDate !="" ? new Date(data.visaEndDate):new Date() }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EligibilityToWork;

const styles = StyleSheet.create({
  submitBtn: {
    backgroundColor: '#1c78ba',
    // backgroundColor: '#d8e4f6',
    alignItems: 'center',
    borderRadius: 30,
    marginTop:40,
    marginBottom:10,
    padding:15,
    // width: screenwidth / 1.5,
  },
  submitBtnText: {
    color: Colors.White,
    // color:Colors.Black,
    fontSize: normalizeSize(17),
    fontWeight: 'bold',
  },
});
