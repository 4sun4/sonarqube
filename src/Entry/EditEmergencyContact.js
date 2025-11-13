import React, { useRef,useEffect } from 'react'
import { View, Text, Button, Image, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Dimensions, SafeAreaView, Platform } from 'react-native'
import { useState } from 'react';
import { connect } from 'react-redux';
import Loader from '../Components/Loader';
import Config from '../Util/Config';
import { CallPostRestApi } from '../Services/Api';
import { showMessage, hideMessage } from "react-native-flash-message";
import { useDispatch, useSelector } from 'react-redux'
import Types from '../redux/Types';
import Dropdown from '../Components/SelectPicker';
import Colors from '../Util/Colors';
import { normalizeSize, validateMobile, validateTenNo } from '../Util/CommonFun';
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { store } from '../redux/Store';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const {width,height}=Dimensions.get('window')

const EditEmergencyContact = (props) => {
    const [loading, setLoading] = useState(false)
    const [RelativeData, setRelativeData] = useState(['Friend', 'Parent', 'Relative', 'Wife', 'Husband'])
    const [SelectedRelativeInd, setSelectedRelativeInd] = useState(0)
    const [SecondRelativeInd, setSecondRelativeInd] = useState(0)

    const dispatch = useDispatch()
    const ContactDetail = useSelector(S => {
        let D = ''
        if (S && S.HomeDetails && S.HomeDetails.EmergencyContact && Object.keys(S.HomeDetails.EmergencyContact).length != 0) { D = S.HomeDetails.EmergencyContact; if (D) { } } return D

    })
  const facilityName = store.getState().loginStatus.facility;
   

    const [data, setData] = useState({
        contact_name: ContactDetail && ContactDetail.contact_name ? ContactDetail.contact_name : '',
        contact_details: ContactDetail && ContactDetail.contact_details ? ContactDetail.contact_details : '',
        relationship: ContactDetail && ContactDetail.relationship ? ContactDetail.relationship : '',
        secondary_contact_name: ContactDetail && ContactDetail.secondary_contact_name ? ContactDetail.secondary_contact_name : '',
        secondary_contact_details: ContactDetail && ContactDetail.secondary_contact_details ? ContactDetail.secondary_contact_details : '',
        secondary_relationship: ContactDetail && ContactDetail.secondary_relationship ? ContactDetail.secondary_relationship : ''
    });
    const { contact_name, contact_details, relationship, secondary_contact_name, secondary_contact_details, secondary_relationship } = data


    useEffect(() => {
        // let  relationship=ContactDetail && ContactDetail.relationship ? ContactDetail.relationship : ''
        
        RelativeData.map((item,index)=>{
            if (item==relationship) {setSelectedRelativeInd(index)}
            if (item==secondary_relationship) {setSecondRelativeInd(index)}
        })
         
        
       }, [])

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
                Edit Emergency Contacts
              </Text>
             <TouchableOpacity
                activeOpacity={0.8}
                underlayColor="white"
                 onPress={() =>callContactApi()}
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

    // React.useLayoutEffect(() => {
    //     props.navigation.setOptions({
    //         headerRight: () => (<TouchableOpacity activeOpacity={1} underlayColor="white" onPress={() => callContactApi()}
    //             style={{ alignItems: 'center', justifyContent: 'center', paddingLeft: 10, paddingRight: 10 }}>
    //             <Image style={{ width: 18, height: 18, alignSelf: 'center' }} resizeMode={'contain'} source={require('../Assets/Icons/HeaderCheck.png')} />
    //         </TouchableOpacity>
    //         ),
    //     });
    // }, [data]);


    const callContactApi = async () => {
        console.log(contact_name,"contact_namecontact_nam")
        const trimmedContactName = contact_name.trim();
        const trimmedSecondaryContactName = secondary_contact_name.trim();
        if (!trimmedContactName) {
            Alert.alert('Alert', 'Please enter Primary contact name')
            return
        }
        else if (!contact_details) {
            Alert.alert('Alert', 'Please enter Primary phone number')
            return
        }
        else if (!validateTenNo(contact_details)) {
            Alert.alert('Alert', 'Please enter valid primary phone number')
            return
        }
        else if (!relationship) {
            Alert.alert('Alert', 'Please enter Primary Relationship')
            return
        }
        else if (!trimmedSecondaryContactName) {
            Alert.alert('Alert', 'Please enter Secondary contact name')
            return
        }
        else if (!secondary_contact_details) {
            Alert.alert('Alert', 'Please enter secondary phone number')
            return
        }
        else if (!validateTenNo(secondary_contact_details)) {
            Alert.alert('Alert', 'Please enter valid secondary phone number')
            return
        }
        else if (!secondary_relationship) {
            Alert.alert('Alert', 'Please enter Secondary Relationship')
            return
        }

        else {
            setLoading(true)
            let body = {
                "contact_name": contact_name,
                "contact_details": contact_details,
                "relationship": relationship,
                "secondary_contact_name": secondary_contact_name,
                "secondary_contact_details": secondary_contact_details,
                "secondary_relationship": secondary_relationship
            }
            let url = Config().LIVE + 'emergencyContact'
            await CallPostRestApi(body, url)
                .then((res) => {
                    setLoading(false)
                    console.log('callContactApi res :- ', res);
                    if (res && res != '') {
                        dispatch({ type: Types.EMERGENCY_CONTACT, data: res[0] })
                        showMessage({ message: 'Success', description: 'Emergency Contacts Updated Successfully.', type: "success", });
                        props.navigation.navigate('EmergencyContact')
                    }

                })
                .catch((error) => {
                    setLoading(false)
                    console.log('callContactApi error :- ', error)
                    showMessage({ message: 'Error', description: error, type: "warning", });
                })
        }
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF', }}>
            {loading ? <Loader /> : null}

               {/* <View style={{ flexDirection:"row",justifyContent:"space-between",paddingHorizontal: Platform.OS=="android"? 15:8,paddingVertical:16,backgroundColor:"#D8D8D8" }}>
                    <TouchableOpacity onPress={()=>{props?.navigation?.pop()}}>
                        {Platform.OS=="android" ? <AntDesign name="arrowleft" size={22}/>:
                        <MaterialIcons name="arrow-back-ios" size={26}/>}
                    </TouchableOpacity>
                    <Text style={[styles.title]}>Edit Emergency Contacts</Text>
                    <TouchableOpacity activeOpacity={1} underlayColor="white" onPress={() => callContactApi()}
                    style={{ alignItems: 'center', justifyContent: 'center', }}>
                        <Image style={{ width: 22, height: 22, alignSelf: 'center' }} resizeMode={'contain'} source={require('../Assets/Icons/HeaderCheck.png')} />
                    </TouchableOpacity>
                </View> */}
                <View style={styles.container}>
                  <KeyboardAwareScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{flexGrow:1}}>
                        <View style={{  backgroundColor: '#FFF',  }}>
                            <View style={{ marginVertical: 20 }}>
                                <Text style={{ fontSize: 18 }}>Contact1</Text>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={{ fontSize: height/43, color: '#808080' }}>Contact Name</Text>
                                    <TextInput
                                        style={{ borderBottomWidth: 1,color: Colors.Black,  borderColor: '#D8D8D8', fontSize: height/45, paddingVertical:height/90, backgroundColor: 'white' }}
                                        placeholderTextColor='#7A7A7A'
                                        value={data.contact_name}
                                        keyboardShouldPersistTaps
                                        onChangeText={(value) => setData({ ...data, contact_name: value.replace(/[^A-Za-z ]/gi, "") })}
                                    />
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={{ fontSize: height/43, color: '#808080' }}>Phone Number</Text>
                                    <TextInput
                                        style={{ borderBottomWidth: 1,color: Colors.Black,  borderColor: '#D8D8D8', fontSize: height/45, paddingVertical:height/90, backgroundColor: 'white' }}
                                        placeholderTextColor='#7A7A7A'
                                        value={data.contact_details}
                                        keyboardShouldPersistTaps
                                        maxLength={10}
                                        keyboardType={'phone-pad'}

                                        onChangeText={(value) => setData({ ...data, contact_details: value.replace(/[^0-9]/gi, "") })}
                                    />
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={{ fontSize: height/43, color: '#808080' }}>Contact Relationship</Text>
                                    
                                    <Dropdown
                                           selectedItemIndex={SelectedRelativeInd}
                                            defaultButtonText={'Select Value'}
                                            statusBarTranslucent={true}
                                            defaultSelection={true}
                                            dropdownButton={{
                                                borderColor: '#D8D8D8',
                                                backgroundColor: Colors.White,
                                                borderWidth: 0,
                                                borderBottomWidth: 1,
                                                alignSelf: 'center',
                                            }}
                                            dropdownTextStyle={{ color: Colors.Black, fontSize: height/45, paddingVertical:height/90, }}
                                            dropdownData={RelativeData}
                                            selectedDropdownItem={(item, index) =>setData({...data,relationship:item})}
                                        />
                                </View>
                            </View>

                            <View style={{ marginVertical: 20 }}>
                                <Text style={{ fontSize: 18 }}>Contact2</Text>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={{ fontSize: height/43, color: '#808080' }}>Contact Name</Text>
                                    <TextInput
                                        style={{ borderBottomWidth: 1,color: Colors.Black,  borderColor: '#D8D8D8', fontSize: height/45, paddingVertical:height/90, backgroundColor: 'white' }}
                                        placeholderTextColor='#7A7A7A'
                                        value={data.secondary_contact_name}
                                        keyboardShouldPersistTaps
                                        onChangeText={(value) => setData({ ...data, secondary_contact_name: value.replace(/[^A-Za-z ]/gi, "") })}
                                    />
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={{ fontSize: height/43, color: '#808080' }}>Phone Number</Text>
                                    <TextInput
                                        style={{ borderBottomWidth: 1,color: Colors.Black,  borderColor: '#D8D8D8', fontSize: height/45, paddingVertical:height/90, backgroundColor: 'white' }}
                                        placeholderTextColor='#7A7A7A'
                                        value={data.secondary_contact_details}
                                        keyboardShouldPersistTaps
                                        // maxLength={10}
                                        keyboardType={'phone-pad'}
                                        onChangeText={(value) => setData({ ...data, secondary_contact_details: value.replace(/[^0-9]/gi, "") })}
                                    />
                                </View>
                                <View style={{ marginTop: 20,marginBottom:20 }}>
                                    <Text style={{ fontSize: height/43, color: '#808080' }}>Contact Relationship</Text>
                                    <Dropdown
                                           selectedItemIndex={SecondRelativeInd}
                                            defaultButtonText={'Select Value'}
                                            statusBarTranslucent={true}
                                            defaultSelection={true}
                                            dropdownButton={{
                                                borderColor: '#D8D8D8',
                                                backgroundColor: Colors.White,
                                                borderWidth: 0,
                                                borderBottomWidth: 1,
                                                alignSelf: 'center',
                                            }}
                                            dropdownTextStyle={{ color: Colors.Black, fontSize: height/45, paddingVertical:height/90, }}
                                            dropdownData={RelativeData}
                                            selectedDropdownItem={(item, index) =>setData({...data,secondary_relationship:item})}
                                        />
                                </View>
                            </View>
                        </View>
              </KeyboardAwareScrollView>
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
        backgroundColor: '#FFF',
    }
});

export default EditEmergencyContact
