import React, { useEffect, useRef } from 'react'
import { View, Text, Button, Image, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Dimensions, SafeAreaView } from 'react-native'
import { useState } from 'react';
import ImagePicker from 'react-native-image-picker';
import { connect } from 'react-redux';
import { callGetRestApis } from '../Services/Api';
import Config from '../Util/Config';
import Loader from '../Components/Loader';
import WebViewComp from '../Components/WebViewComp';
import { showMessage, hideMessage } from "react-native-flash-message";
import AutoHeightWebView from 'react-native-autoheight-webview'
const screenwidth = Dimensions.get('window').width
const screenheight = Dimensions.get('window').height

const About = (props) => {

    const [loading, setLoading] = useState(false)
    const [AboutUsData, setAboutUsData] = useState(null)



    useEffect(() => {
        const unsubscribe = props.navigation.addListener("focus", async () => {
            getAboutUs()
        });
        return unsubscribe;


    }, [])

     useEffect(() => {
        const unsubscribe = props.navigation.addListener("blur", async () => {
            setAboutUsData(null)
        });
        return unsubscribe;


    }, [])

    const getAboutUs = async () => {
        let URL = Config().getAboutUs
        setLoading(true)
        await callGetRestApis(URL)
            .then((res) => {
                setLoading(false)
                if (res) {
                    setAboutUsData(res)
                }
                console.log('getAboutUs res :- ', res)

            })
            .catch((error) => {
                setLoading(false)

                console.log('getAboutUs error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })


    }

    console.log(AboutUsData,"aboutUs")


    return (
        <View style={{ flex: 1 }}>
            {loading ? <Loader /> : null}
            <View style={styles.container}>
                <AutoHeightWebView
                    style={{ width: screenwidth - 35,  marginTop: 35 }}
                    customStyle={`
                              * { font-family: 'Times New Roman';}
                               video {display:block; max-width:100%;height:auto }
                               iframe {display:block; max-width:100%;height:auto; max-height:100%;}`}
                    onSizeUpdated={size => console.log(size.height)}
                    source={{ html: AboutUsData && AboutUsData.about?AboutUsData.about :'' }}
                    scalesPageToFit={true}
                    allowsFullscreenVideo={true}
                    viewportContent={'width=device-width, user-scalable=no'}
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
    },
    backButton: {
        padding: 10,
        backgroundColor: '#eee',
    },
    backButtonText: {
        fontSize: 16,
        color: '#333',
    },
});

export default About
