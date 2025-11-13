import React, { useEffect } from 'react'
import { View, Text, Button, Image, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Dimensions, SafeAreaView } from 'react-native'
import { useState } from 'react';
import { callGetRestApis, CallPostRestApi } from '../Services/Api';
import Config from '../Util/Config';
import Loader from '../Components/Loader';
import WebViewComp from '../Components/WebViewComp';
import { showMessage, hideMessage } from "react-native-flash-message";
import Colors from '../Util/Colors';

const Contact = (props) => {

    const screenwidth = Dimensions.get('window').width
    const screenheight = Dimensions.get('window').height
    const [loading, setLoading] = useState(false)
    const [ContactData, setContactData] = useState(null)
    const [UserDescription, setUserDescription] = useState('');



    useEffect(() => {
        const unsubscribe = props.navigation.addListener("focus", async () => {
            setUserDescription('')
            getContactInstructions()
        });
        return unsubscribe;
    }, [])


    const getContactInstructions = async () => {
        let URL = Config().getContactInstructions
        setLoading(true)
        await callGetRestApis(URL)
            .then((res) => {
                setLoading(false)
                if (res) { setContactData(res) }
                console.log('getContactInstructions res :- ', res)
            })
            .catch((error) => {
                setLoading(false)
                console.log('getContactInstructions error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })
    }

    const ChooseOption = () => {


    }


    const submit = async () => {
        const trimmedComment = UserDescription.trim();
        if (!trimmedComment) {
            Alert.alert('Alert', 'Please enter query')
            return false;
        }
        var URL = Config().sendFeedback
        let body = {
            "feedback_message": UserDescription
        }
        setLoading(true)
        await CallPostRestApi(body, URL)
            .then(async (res) => {
                console.log('sendFeedback res :- ', res);
                setLoading(false)
                if (res && res.success) {
                    setUserDescription('')
                    Alert.alert(
                        'Alert',
                        'Message sent.',
                        [{ text: 'Ok', onPress: () => props.navigation.navigate("Home") }],
                        { cancelable: false },
                    );
                }
            })
            .catch((error) => {
                setLoading(false)
                console.log('sendFeedback error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });

            })

    }

    return (
        <View style={{ flex: 1 }}>
            {loading ? <Loader /> : null}

            <View style={styles.container}>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

                    <View style={{ marginVertical: 20 }}>
                        <TextInput
                            style={{ textAlignVertical: 'top', fontSize: 18, borderColor: '#42435b', color: Colors.Black,height: 200, backgroundColor: '#F6F6F6', borderRadius: 7, }}
                            value={UserDescription}
                            onChangeText={(value) => setUserDescription(value)}
                            multiline={true}
                            placeholder="  Enter your comments"
                            underlineColorAndroid='transparent'
                            require={true}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate('Messages')}>
                        <Text style={styles.MsgLinkTxt}>
                            Go to Messages
                        </Text>
                    </TouchableOpacity>
                    {/* <WebViewComp
                    webViewData={ContactData && ContactData.contact_instructions?ContactData.contact_instructions:''}
                /> */}


                    <View style={{ justifyContent: 'flex-end', marginBottom: 20 }}>
                        <TouchableOpacity onPress={submit} style={{ width: screenwidth - 40, height: 60, backgroundColor: '#D02530', marginTop: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 30 }}>
                            <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>CONTINUE</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>


        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    MsgLinkTxt: {
        textAlign: 'center', 
        textDecorationLine: 'underline',
        color:'black'
    }
});

export default Contact
