import React, { useEffect } from 'react'
import { View, Text, Button, Image, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Dimensions, SafeAreaView } from 'react-native'
import { useState } from 'react';
import { callGetRestApis } from '../Services/Api';
import Config from '../Util/Config';
import Loader from '../Components/Loader';
import WebViewComp from '../Components/WebViewComp';
import { showMessage, hideMessage } from "react-native-flash-message";
import { WebView } from 'react-native-webview';

const Support = (props) => {

    const screenwidth = Dimensions.get('window').width
    const screenheight = Dimensions.get('window').height
    const [loading, setLoading] = useState(false)
    const [SupportData, setSupportData] = useState(null)



    useEffect(() => {
        const unsubscribe = props.navigation.addListener("focus", async () => {
            getSupportHelpText()
        });
        return unsubscribe;


    }, [])


    const getSupportHelpText = async () => {
        let URL = Config().getSupportHelpText
        setLoading(true)
        await callGetRestApis(URL)
            .then((res) => {
                setLoading(false)
                if (res) {
                    setSupportData(res)
                }
                console.log('getSupportHelpText res :- ', res)

            })
            .catch((error) => {
                setLoading(false)

                console.log('getSupportHelpText error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })


    }



    return (
        <View style={{ flex: 1 }}>
            {loading ? <Loader /> : null}
            <View style={styles.container}>
                <WebViewComp
                    webViewData={SupportData&&SupportData.support_help_text?SupportData.support_help_text:'' }
                />

            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    }
});

export default Support
