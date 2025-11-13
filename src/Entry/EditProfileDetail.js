  import React, { useRef } from 'react'
import { View, Text, Button, Image, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Dimensions, SafeAreaView, Platform } from 'react-native'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Config from '../Util/Config';
import { CallPostRestApi, globalPostApi } from '../Services/Api';
import { showMessage, hideMessage } from "react-native-flash-message";
import Loader from '../Components/Loader';
import Types from '../redux/Types';
import Colors from '../Util/Colors';
import DateTime from '../Components/DateTimePickes';
import DateTimePickerComp from '../Components/DateTimePickerComp';
import moment from 'moment'
import { Country_Obj, State_Obj } from '../Util/DumyJson';
import { normalizeSize, validateMobile, validateTenNo } from '../Util/CommonFun';
import Dropdown from '../Components/SelectPicker';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import { store } from '../redux/Store';

let typeArr = [{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]
const { width, height } = Dimensions.get('window')

const EditProfileDetail = (props) => {
    const ProfileDetail = useSelector(S => { let D = ''; if (S && S.HomeDetails && S.HomeDetails.UserDetails && Object.keys(S.HomeDetails.UserDetails).length != 0) { D = S.HomeDetails.UserDetails; if (D) { } } return D })

    const [loading, setLoading] = useState(false)
    const { navigation, route } = props;
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const [Item, setItem] = useState([{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }, { label: 'Not Specified', value: 'Not Specified' }]);

    const [openTemp, setOpenTemp] = useState(false);
    const [valueTemp, setValueTemp] = useState('');

    const [openPerm, setOpenPerm] = useState(false);
    const [valuePerm, setValuePerm] = useState('');

    const [openPartTime, setOpenPartTime] = useState(false);
    const [valuePartTime, setValuePartTime] = useState('');

    const [Items, setItems] = useState(typeArr);
    const [DropDownTypeData, setDropDownTypeData] = useState(['Yes', 'No'])
    const [DropDownGenderData, setDropDownGenderData] = useState(['Male', 'Female', 'Not Specified'])

    const [EndingDate, setEndingDate] = useState(new Date());
    const [Show, setShow] = useState(false)

    const [CountryArr, setCountryArr] = useState([])
    const [StateArr, setStateArr] = useState([])

    const [Country_Code, setCountry_Code] = useState(0)
    const facilityName = store.getState().loginStatus.facility;

    const [data, setData] = useState({
        username: '',
        valuePerm: valuePerm,
        valuePartTime: valuePartTime,
        valueTemp: valueTemp,
        value: value,
        Temp: ProfileDetail ? (ProfileDetail.Temp === 1 ? 'Yes' : ProfileDetail.Temp === 0 ? 'No' : '') : '',
        Perm: ProfileDetail ? (ProfileDetail.Perm === 1 ? 'Yes' : ProfileDetail.Perm === 0 ? 'No' : '') : '',
        PartTime: ProfileDetail ? (ProfileDetail.PartTime === 1 ? 'Yes' : ProfileDetail.PartTime === 0 ? 'No' : '') : '',
        email: ProfileDetail && ProfileDetail.email ? ProfileDetail.email : '',
        mobile: ProfileDetail && ProfileDetail.mobile ? ProfileDetail.mobile : '',
        tel: ProfileDetail && ProfileDetail.tel ? ProfileDetail.tel : '',
        first_name: ProfileDetail && ProfileDetail.first_name ? ProfileDetail.first_name : '',
        last_name: ProfileDetail && ProfileDetail.last_name ? ProfileDetail.last_name : '',
        alternate_number: ProfileDetail && ProfileDetail.alternate_number ? ProfileDetail.alternate_number : '',
        street_address: ProfileDetail && ProfileDetail.street_address ? ProfileDetail.street_address : '',
        suburb: ProfileDetail && ProfileDetail.suburb ? ProfileDetail.suburb : '',
        state: ProfileDetail && ProfileDetail.state ? ProfileDetail.state : '',
        pc: ProfileDetail && ProfileDetail.pc ? ProfileDetail.pc : '',
        dob: ProfileDetail && ProfileDetail.dob ? ProfileDetail.dob : '',
        street_address_line_2: ProfileDetail && ProfileDetail.street_address_line_2 ? ProfileDetail.street_address_line_2 : '',
        Country: ProfileDetail && ProfileDetail.Country ? ProfileDetail.Country : '',
        other_name: ProfileDetail && ProfileDetail.other_name ? ProfileDetail.other_name : '',
        gender: ProfileDetail && ProfileDetail.gender ? ProfileDetail.gender : '',
        indigenous_status: ProfileDetail && ProfileDetail.indigenous_status ? ProfileDetail.indigenous_status : '',
        EditVal: '',

    });
    const { PartTime, Perm, Temp, username, EditVal, mobile, email, tel, first_name, last_name, alternate_number, street_address, suburb, state, pc, dob, street_address_line_2, Country, other_name, gender, indigenous_status } = data
    const [DateObj, SetDateObj] = useState(dob ? new Date(dob) : new Date())

    // React.useLayoutEffect(() => {
    //     props.navigation.setOptions({
    //         headerRight: () => (<TouchableOpacity activeOpacity={1} underlayColor="white" onPress={() => callDetailApi()}
    //             style={{ alignItems: 'center', justifyContent: 'center', paddingLeft: 10, paddingRight: 10 }}>
    //             <Image style={{ width: 18, height: 18, alignSelf: 'center' }} resizeMode={'contain'} source={require('../Assets/Icons/HeaderCheck.png')} />
    //         </TouchableOpacity>
    //         ),
    //     });
    // }, [data, valueTemp, value, valuePerm, valuePartTime]);


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
                style={{}}>
                <Feather color={'#111'} size={32} name="chevron-left" />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: normalizeSize(18),
                  flex: 1,
                  textAlign: 'center',
                }}>
                Edit My Details
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                underlayColor="white"
                onPress={() =>callDetailApi()}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center'
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
                  <Text style={{color:"#fff",fontSize:height / 48}}>Save</Text>
                </View>
              </TouchableOpacity>
              <View />
            </View>
          </View>
        </SafeAreaView>
      ),
    });
  }, [data]);

    React.useEffect(() => {
        getRouteData()
    }, [route])

    React.useEffect(() => {
        let country_arr = Object.values(Country_Obj).sort()
        setCountryArr(country_arr)
        if (data.Country) {
            const getKey = getKeyByValue(Country_Obj, data.Country)
            const state_arr = getStateByCountryId(getKey)
            setStateArr(state_arr.length ? state_arr.sort() : [])
        }

    }, [])


    const getKeyByValue = (object, value) => {
        return Object.keys(object).find(key => object[key] === value);
    }
    const getStateByCountryId = (getKey) => {
        let state_arr = []
        for (const [key, value] of Object.entries(State_Obj)) {
            if (value == getKey) {
                state_arr.push(key)
            }
        }
        return state_arr
    }




    const getRouteData = () => {
        console.log("navigation", navigation, "route testing log", route)
        if (route && route.params) {
            let rout = route.params

            let title = rout.EditVal && rout.EditVal != "" ? rout.EditVal : ""
            let sname = rout.ScreenName && rout.ScreenName != "" ? rout.ScreenName : ""

            setData({ ...data, EditVal: title })

            let gen = ProfileDetail && ProfileDetail.gender ? ProfileDetail.gender : ''
            let temp = ProfileDetail ? (ProfileDetail.Temp === 1 ? 'Yes' : ProfileDetail.Temp === 0 ? 'No' : '') : ''
            let perm = ProfileDetail ? (ProfileDetail.Perm === 1 ? 'Yes' : ProfileDetail.Perm === 0 ? 'No' : '') : ''
            let part = ProfileDetail ? (ProfileDetail.PartTime === 1 ? 'Yes' : ProfileDetail.PartTime === 0 ? 'No' : '') : ''


            let name = props.route && props.route.params && props.route.params.item ? props.route.params.item : ""
            let type = props.route && props.route.params && props.route.params.type ? props.route.params.type : ""
            let routeName = route && route.params && route.params.RouteName ? route.params.RouteName : ""

            if (type === "Country") {
                setData({ ...data, Country: name, state: '' })
                let getKey = getKeyByValue(Country_Obj, name)
                if (getKey) {
                    setCountry_Code(getKey)
                    let state_arr = getStateByCountryId(getKey)

                    setStateArr(state_arr.length ? state_arr.sort() : [])
                    console.log('state_arr', state_arr);
                }
            }
            else if (type === "State") {
                setData({ ...data, state: name })
            }


            if (title === 'Sought') {
                if (temp) { handleChange(temp, 'Temp') }
                if (perm) { handleChange(perm, 'Perm') }; if (part) { handleChange(part, 'PartTime') }
            } else if (title === 'Diversity') { if (gen) { handleChange(gen, title) } }
        }
    }




    const callDetailApi = async () => {

        if (EditVal == 'Detail') {

            if (!first_name?.trim()) {
                Alert.alert('Alert', 'Please enter first name')
                return
            }
            else if (!last_name?.trim()) {
                Alert.alert('Alert', 'Please enter last name')
                return
            }


            else if (dob && new Date(dob) > new Date()) {
                Alert.alert('Alert', 'Please enter valid date of birth')
                return
            }
            else {
                handleContactApi()
            }
        }
        else if (EditVal == 'Sought') {

            if (!valueTemp) {
                Alert.alert('Alert', 'Please enter Temp/Casual Employment')
                return
            }
            else if (!valuePerm) {
                Alert.alert('Alert', 'Please enter Permanent Employment')
                return
            }
            else if (!valuePartTime) {
                Alert.alert('Alert', 'Please enter Part Time Employment')
                return
            }
            else {
                handleContactApi()

            }
        }
        else if (EditVal == 'Diversity') {
            if (!value) {
                Alert.alert('Alert', 'Please enter gender')
                return
            }
            else {
                handleContactApi()

            }
        }
    }



    const handleSelect = (type) => {
        if (type == "Country") {
            if (CountryArr == '') {
                return showMessage({ message: 'Alert', description: `No ${type} Available`, type: "warning", });
            }
            props.navigation.navigate("SelectData", { data: CountryArr, RouteName: "EditProfileDetail", type: type })
        }
        else if (Country != '' && type == "State") {
            if (StateArr == '') {
                return showMessage({ message: 'Alert', description: `No ${type} Available`, type: "warning", });
            }
            props.navigation.navigate("SelectData", { data: StateArr, RouteName: "EditProfileDetail", type: type })
        }

    }




    const handleContactApi = async () => {
        let formdata = new FormData();
        if (EditVal == 'Detail') {
            formdata.append("first_name", first_name),
                formdata.append("last_name", last_name),
                formdata.append("alternate_number", alternate_number),
                formdata.append("street_address", street_address),
                formdata.append("suburb", suburb),
                formdata.append("state", state),
                formdata.append("pc", pc),
                formdata.append("dob", dob),
                formdata.append("street_address_line_2", street_address_line_2),
                formdata.append("Country", Country),
                formdata.append("other_name", other_name),
                formdata.append("indigenous_status", indigenous_status)
            formdata.append("mobile", mobile)
            formdata.append("tel", tel)

        }
        else if (EditVal == 'Sought') {
            formdata.append("Temp", valueTemp == 'Yes' ? 1 : 0)
            formdata.append("Perm", valuePerm == 'Yes' ? 1 : 0)
            formdata.append("PartTime", valuePartTime == 'Yes' ? 1 : 0)

        }
        else {
            formdata.append("gender", value)
        }
        setLoading(true)
        let Url = Config().updateDetails
        await globalPostApi(Url, formdata)
            .then((res) => {
                setLoading(false)
                console.log('callContactApi res :- ', res);
                if (res && res.length > 0) {
                    dispatch({ type: Types.GET_DETAILS, data: res[0] })
                    props.navigation.navigate('ProfileDetail')
                    showMessage({ message: 'Success', description: 'Profile Updated successfully.', type: "success", });

                }


            })
            .catch((error) => {
                setLoading(false)
                console.log('callContactApi error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })

    }
    const handleChange = (e, type) => {
        console.log('e', e, 'type', type);
        if (type == 'Temp') { setValueTemp(e) }
        else if (type == 'Perm') { setValuePerm(e) }
        else if (type == 'PartTime') { setValuePartTime(e) }
        else { setValue(e) }

    }
    const onChange = (event, selectedDate) => {
        if (Platform.OS == "ios") {
            setShow(false);
            const currentDate = selectedDate || new Date();
            setData({ ...data, dob: moment(currentDate).format('YYYY-MM-DD') })
            SetDateObj(currentDate)

        } else {
            if (event.type == 'set') {
                setShow(false);
                const currentDate = selectedDate || new Date();
                setData({ ...data, dob: moment(currentDate).format('YYYY-MM-DD') })
                SetDateObj(currentDate)
            } else { setShow(false); }
        }

    };


    const getShiftTypendex = (val, Arr) => {
        if (Arr) {
            return Arr.map(i => i).indexOf(val);
        }
        return 0;
    }

    const hideDatePicker = () => { setShow(false) };

    const handleConfirm = (date) => {
        const currentDate = date || new Date();
        setShow(false);
        setData({ ...data, dob: moment(currentDate).format('YYYY-MM-DD') })
        SetDateObj(currentDate)
        hideDatePicker();
    };


    return (
        <SafeAreaView style={{ flex: 1,backgroundColor:"#fff" }}>
            {loading ? <Loader /> : null}
             <View style={{flex:1,paddingHorizontal:20}}>


                {EditVal == 'Detail' ?
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>

                        <KeyboardAvoidingView>

                            <View style={{ width: '100%', backgroundColor: '#FFF' }}>
                                {Show && EditVal == 'Detail' ?
                                    <DateTimePickerComp
                                        isDatePickerVisible={Show}
                                        handleConfirm={handleConfirm}
                                        hideDatePicker={hideDatePicker}
                                        mode={'date'}
                                        DateVal={DateObj}
                                        MaxDate={new Date()}
                                    />
                                    : null
                                }

                                <View style={{ marginTop: 20 }}>
                                    <Text style={{ fontSize: height / 43, color: '#808080' }}>First Name <Text style={{ color: 'red' }}>*</Text></Text>
                                    <TextInput
                                        style={{ borderBottomWidth: 1, borderColor: '#D8D8D8', fontSize: height / 45, paddingVertical: height / 90, backgroundColor: 'white', color: '#000' }}
                                        placeholderTextColor='#7A7A7A'
                                        value={first_name}
                                        keyboardShouldPersistTaps
                                        onChangeText={(value) => {
                                            setData({ ...data, first_name: value.replace(/[^A-Za-z ]/gi, "") })

                                        }}
                                    />
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={{ fontSize: height / 43, color: '#808080' }}>Last Name <Text style={{ color: 'red' }}>*</Text></Text>
                                    <TextInput
                                        style={{ borderBottomWidth: 1, borderColor: '#D8D8D8', fontSize: height / 45, paddingVertical: height / 90, backgroundColor: 'white', color: '#000' }}
                                        placeholderTextColor='#7A7A7A'
                                        value={last_name}
                                        keyboardShouldPersistTaps
                                        onChangeText={(value) => setData({ ...data, last_name: value.replace(/[^A-Za-z ]/gi, "") })}
                                    />
                                </View>

                                <View style={{ marginTop: 20 }}>
                                    <Text style={{ fontSize: height / 43, color: '#808080' }}>Other Name</Text>
                                    <TextInput
                                        style={{ borderBottomWidth: 1, borderColor: '#D8D8D8', fontSize: height / 45, paddingVertical: height / 90, backgroundColor: 'white', color: '#000' }}
                                        placeholderTextColor='#7A7A7A'
                                        value={other_name}
                                        keyboardShouldPersistTaps
                                        onChangeText={(value) => setData({ ...data, other_name: value.replace(/[^A-Za-z ]/gi, "") })}
                                    />
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={{ fontSize: height / 43, color: '#808080' }}>Mobile Number/Cell Number</Text>
                                    <TextInput
                                        style={{ borderBottomWidth: 1, borderColor: '#D8D8D8', fontSize: height / 45, paddingVertical: height / 90, backgroundColor: 'white', color: '#000' }}
                                        placeholderTextColor='#7A7A7A'
                                        value={mobile}
                                        maxLength={10}
                                        keyboardType="phone-pad"
                                        keyboardShouldPersistTaps
                                        onChangeText={(value) => setData({ ...data, mobile: value.replace(/[^0-9]/gi, "") })}
                                    />
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={{ fontSize: height / 43, color: '#808080' }}>Phone Number</Text>
                                    <TextInput
                                        style={{ borderBottomWidth: 1, borderColor: '#D8D8D8', fontSize: height / 45, paddingVertical: height / 90, backgroundColor: 'white', color: '#000' }}
                                        placeholderTextColor='#7A7A7A'
                                        value={tel}
                                        maxLength={10}
                                        keyboardType="phone-pad"
                                        keyboardShouldPersistTaps
                                        onChangeText={(value) => setData({ ...data, tel: value.replace(/[^0-9]/gi, "") })}
                                    />
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={{ fontSize: height / 43, color: '#808080' }}>Alternate Number</Text>
                                    <TextInput
                                        style={{ borderBottomWidth: 1, borderColor: '#D8D8D8', fontSize: height / 45, paddingVertical: height / 90, backgroundColor: 'white', color: '#000' }}
                                        placeholderTextColor='#7A7A7A'
                                        value={data.alternate_number}
                                        // maxLength={10}
                                        keyboardType="phone-pad"
                                        keyboardShouldPersistTaps
                                        onChangeText={(value) => setData({ ...data, alternate_number: value.replace(/[^0-9]/gi, "") })}
                                    />
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={{ fontSize: height / 43, color: '#808080' }}>Address Line 1</Text>
                                    <TextInput
                                        style={{ borderBottomWidth: 1, borderColor: '#D8D8D8', fontSize: height / 45, paddingVertical: height / 90, backgroundColor: 'white', color: '#000' }}
                                        placeholderTextColor='#7A7A7A'
                                        value={data.street_address}
                                        keyboardShouldPersistTaps
                                        onChangeText={(value) => setData({ ...data, street_address: value })}
                                    />
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={{ fontSize: height / 43, color: '#808080' }}>Address Line 2</Text>
                                    <TextInput
                                        style={{ borderBottomWidth: 1, borderColor: '#D8D8D8', fontSize: height / 45, paddingVertical: height / 90, backgroundColor: 'white', color: '#000' }}
                                        placeholderTextColor='#7A7A7A'
                                        value={data.street_address_line_2}
                                        keyboardShouldPersistTaps
                                        onChangeText={(value) => setData({ ...data, street_address_line_2: value })}
                                    />
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={{ fontSize: height / 43, color: '#808080' }}>Suburb</Text>
                                    <TextInput
                                        style={{ borderBottomWidth: 1, borderColor: '#D8D8D8', fontSize: height / 45, paddingVertical: height / 90, backgroundColor: 'white', color: '#000' }}
                                        placeholderTextColor='#7A7A7A'
                                        value={data.suburb}
                                        keyboardShouldPersistTaps
                                        onChangeText={(value) => setData({ ...data, suburb: value })}
                                    />
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={{ fontSize: height / 43, color: '#808080' }}>Postcode</Text>
                                    <TextInput
                                        style={{ borderBottomWidth: 1, borderColor: '#D8D8D8', fontSize: height / 45, paddingVertical: height / 90, backgroundColor: 'white', color: '#000' }}
                                        placeholderTextColor='#7A7A7A'
                                        value={data.pc}
                                        keyboardShouldPersistTaps
                                        onChangeText={(value) => setData({ ...data, pc: value })}
                                    />
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={{ fontSize: height / 43, color: '#808080' }}>Country</Text>
                                    <TouchableOpacity onPress={() => handleSelect("Country")} style={{ borderBottomWidth: 1, flex: 1, borderColor: '#D8D8D8', }}>
                                        <Text style={{ fontSize: height / 45, paddingVertical: height / 90, color: 'black', paddingVertical: 12 }}>{data.Country ? data.Country : 'Select Country'}</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ marginTop: 20 }}>
                                    <Text style={{ fontSize: height / 43, color: '#808080' }}>State</Text>
                                    <TouchableOpacity onPress={() => handleSelect("State")} style={{ borderBottomWidth: 1, flex: 1, borderColor: '#D8D8D8', }}>
                                        <Text style={{ fontSize: height / 45, paddingVertical: height / 90, color: 'black', paddingVertical: 12 }}>{data.state ? data.state : 'Select State'}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginVertical: 20 }}>
                                    <Text style={{ fontSize: height / 43, color: '#808080' }}>Date of Birth</Text>
                                    <TouchableOpacity onPress={() => setShow(true)} style={{ borderBottomWidth: 1, flex: 1, borderColor: '#D8D8D8', }}>
                                        <Text style={{ fontSize: height / 45, paddingVertical: height / 90, color: 'black', paddingVertical: 12 }}>{dob ? moment(dob).format('DD/MM/YYYY') : 'Shift Ends'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </KeyboardAvoidingView>
                    </ScrollView>
                    : EditVal == 'Sought' ?

                        <View style={{ flex: 1, width: '100%', backgroundColor: '#FFF' }}>

                            <View style={{ marginTop: 20, paddingHorizontal: 5 }}>
                                <Text style={{fontSize: height / 43, color: '#808080',marginBottom:10}}>
                                    Temp/Casual Employment
                                </Text>
                                <Dropdown
                                    defaultButtonText={'Temp/Casual Employment'}
                                    statusBarTranslucent={true}
                                    dropdownButton={{ borderColor: '#D8D8D8', backgroundColor: Colors.Trans, borderWidth: 0, borderBottomWidth: 1, alignSelf: 'center', }}
                                    dropdownTextStyle={{ color: 'grey', fontSize: 18, }}
                                    dropdownData={DropDownTypeData}
                                    selectedDropdownItem={(item, index) => setValueTemp(item)}
                                    isIcon={true}
                                    defaultSelection={true}
                                    selectedItemIndex={getShiftTypendex(Temp, DropDownTypeData)}

                                />
                            </View>

                            <View style={{ marginTop: 20, paddingHorizontal: 5 }}>
                                <Text style={{fontSize: height / 43, color: '#808080',marginBottom:10}}>
                                    Permanent Employment
                                </Text>
                                <Dropdown
                                    defaultButtonText={'Permanent Employment'}
                                    statusBarTranslucent={true}
                                    dropdownButton={{ borderColor: '#D8D8D8', backgroundColor: Colors.Trans, borderWidth: 0, borderBottomWidth: 1, alignSelf: 'center', }}
                                    dropdownTextStyle={{ color: 'grey', fontSize: 18, }}
                                    dropdownData={DropDownTypeData}
                                    selectedDropdownItem={(item, index) => setValuePerm(item)}
                                    isIcon={true}
                                    defaultSelection={true}
                                    selectedItemIndex={getShiftTypendex(Perm, DropDownTypeData)}

                                />
                            </View>
                            <View style={{ marginTop: 20, paddingHorizontal: 5 }}>
                                <Text style={{fontSize: height / 43, color: '#808080',marginBottom:10}}>
                                    Part Time Employment
                                </Text>
                                <Dropdown
                                    defaultButtonText={'Part Time Employment'}
                                    statusBarTranslucent={true}
                                    dropdownButton={{ borderColor: '#D8D8D8', backgroundColor: Colors.Trans, borderWidth: 0, borderBottomWidth: 1, alignSelf: 'center', }}
                                    dropdownTextStyle={{ color: 'grey', fontSize: 18, }}
                                    dropdownData={DropDownTypeData}
                                    selectedDropdownItem={(item, index) => setValuePartTime(item)}
                                    isIcon={true}
                                    defaultSelection={true}
                                    selectedItemIndex={getShiftTypendex(PartTime, DropDownTypeData)}

                                />
                            </View>
                        </View>
                        :
                        <View style={{ flex: 1, marginTop: 20 }}>
                            <Dropdown
                                defaultButtonText={'Gender'}
                                statusBarTranslucent={true}
                                dropdownButton={{ borderColor: '#D8D8D8', backgroundColor: Colors.Trans, borderWidth: 0, borderBottomWidth: 1, alignSelf: 'center', }}
                                dropdownTextStyle={{ color: 'grey', fontSize: 18, }}
                                dropdownData={DropDownGenderData}
                                selectedDropdownItem={(item, index) => setValue(item)}
                                isIcon={true}
                                defaultSelection={true}
                                selectedItemIndex={getShiftTypendex(gender, DropDownGenderData)}

                            />
                        </View>

                }
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
    }
});

export default EditProfileDetail
