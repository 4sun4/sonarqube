import React, { useState } from 'react'
import { View, Text, Button, Image, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Dimensions, SafeAreaView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../Components/Loader'
import Types from '../redux/Types'
import { callGetRestApis } from '../Services/Api'
import Colors from '../Util/Colors'
import Config from '../Util/Config'
const {width,height}=Dimensions.get('window')

let LoginData = ''
const EmergencyContact = (props) => {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    // const ContactDetail = useSelector(S => {let D = '';if (S && S.HomeDetails && S.HomeDetails.EmergencyContact && Object.keys(S.HomeDetails.EmergencyContact).length != 0) { D = S.HomeDetails.EmergencyContact; if (D) { } } return D})
    const UserDetail = useSelector(S => {let D = '';if (S && S.loginStatus && S.loginStatus.loginData && Object.keys(S.loginStatus.loginData).length != 0) { D = S.loginStatus.loginData; if (D) { LoginData = D } } return D})


    const [data, setData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        iconAnimating: false,
        isPasswordShow: true,
        ContactDetail:null
    });
const {ContactDetail}=data

React.useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", async () => {
        getContactDetails()
    });
    return unsubscribe;

}, [])

    const getContactDetails = async () => {
        if (LoginData && LoginData.token) {
            let URL = Config().getEmergencyContact
            console.log('URL', URL);
            setLoading(true)
            await callGetRestApis(URL)
                .then((res) => {
                    setLoading(false)
                    if (res && res[0]) {
                        dispatch({ type: Types.EMERGENCY_CONTACT, data: res[0] })
                        setData({ ContactDetail: res[0] })
                    }
                    console.log('getEmergencyContact res :- ', res)

                })
                .catch((error) => {
                    setLoading(false)

                    console.log('getEmergencyContact error :- ', error)
                    showMessage({ message: 'Error', description: error, type: "warning", });
                })

        } else {

        }
    }




    let contact_details,
        contact_name, relationship, secondary_contact_details,
        secondary_contact_name, secondary_relationship = ''

    if (ContactDetail) {
        console.log('ContactDetail', ContactDetail);
        if (ContactDetail.contact_details) { contact_details = ContactDetail.contact_details }
        if (ContactDetail.contact_name) { contact_name = ContactDetail.contact_name }
        if (ContactDetail.relationship) { relationship = ContactDetail.relationship }
        if (ContactDetail.secondary_contact_details) { secondary_contact_details = ContactDetail.secondary_contact_details }
        if (ContactDetail.secondary_contact_name) { secondary_contact_name = ContactDetail.secondary_contact_name }
        if (ContactDetail.secondary_relationship) { secondary_relationship = ContactDetail.secondary_relationship }

    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
                        {loading ? <Loader /> : null}

            <View style={styles.container}>
                <ScrollView>
                    <KeyboardAvoidingView>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                {/* <Text style={{fontSize: 17}}>My Details</Text> */}
                <View>
                  <TouchableOpacity
                    style={{marginTop:15}}
                    onPress={() =>
                      props.navigation.navigate('EditEmergencyContact')
                    }>
                    <Image
                      style={{width: 20, height: 20}}
                      resizeMode={'contain'}
                      source={require('../Assets/Icons/HeaderEdit.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>

                        <View style={{ shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1
    },
    elevation:4,
                            width: '100%',borderWidth:2 ,borderColor: '#D8D8D8',
                            backgroundColor: '#FFF', paddingHorizontal: 20, 
                            paddingVertical: 20, marginVertical: 10, marginTop: 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 18 }}>
                                    {contact_name}
                                </Text>

                            </View>
                            <View style={{ marginTop: 20 }}>
                                <Text style={{ fontSize: height/43, color: '#808080' }}>Contact Relationship</Text>
                                <TextInput
                                    style={{fontSize: height/45, paddingVertical:height/90, backgroundColor: 'white', color: Colors.Black }}
                                    placeholderTextColor='#7A7A7A'
                                    value={relationship}
                                    keyboardShouldPersistTaps
                                    editable={false}
                                    onChangeText={(value) => setData({ ...data, username: value })}
                                />
                            </View>

                            <View style={{ marginTop: 20 }}>
                                <Text style={{ fontSize: height/43, color: '#808080' }}>Phone Number</Text>
                                <TextInput
                                    style={{fontSize: height/45, paddingVertical:height/90, backgroundColor: 'white', color: Colors.Black }}
                                    placeholderTextColor='#7A7A7A'
                                    value={contact_details}
                                    keyboardShouldPersistTaps
                                    editable={false}
                                    onChangeText={(value) => setData({ ...data, username: value })}
                                />
                            </View>
                        </View>

                        <View style={{shadowColor: "#000000",  shadowOpacity: 0.8,shadowRadius: 2,
                            shadowOffset: {height: 1,width: 1},elevation:4, width: '100%',borderWidth:2 ,borderColor: '#D8D8D8', backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 20, marginVertical: 10 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 18 }}>
                                    {secondary_contact_name}
                                </Text>

                            </View>
                            <View style={{ marginTop: 20 }}>
                                <Text style={{ fontSize: height/43, color: '#808080' }}>Contact Relationship</Text>
                                <TextInput
                                    style={{fontSize: height/45, paddingVertical:height/90, backgroundColor: 'white', color: Colors.Black }}
                                    placeholderTextColor='#7A7A7A'
                                    value={secondary_relationship}
                                    keyboardShouldPersistTaps
                                    editable={false}
                                    onChangeText={(value) => setData({ ...data, username: value })}
                                />
                            </View>

                            <View style={{ marginTop: 20 }}>
                                <Text style={{ fontSize: height/43, color: '#808080' }}>Phone Number</Text>
                                <TextInput
                                    style={{fontSize: height/45, paddingVertical:height/90, backgroundColor: 'white', color: Colors.Black }}
                                    placeholderTextColor='#7A7A7A'
                                    value={secondary_contact_details}
                                    keyboardShouldPersistTaps
                                    editable={false}
                                    onChangeText={(value) => setData({ ...data, username: value })}
                                />
                            </View>
                        </View>





                    </KeyboardAvoidingView>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
    }
});

export default EmergencyContact
