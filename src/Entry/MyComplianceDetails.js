import React, { useEffect } from 'react'
import { View, Text, Platform, Image, Linking, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Dimensions, SafeAreaView } from 'react-native'
import { useState } from 'react';
import { callGetRestApis, isFileExist } from '../Services/Api';
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../Components/Loader';
import { showMessage, hideMessage } from "react-native-flash-message";
import moment from 'moment'
import { CONSTRAINT_TEXT } from '../Util/String';
import Config from '../Util/Config';
import { getExtention, isImage } from '../Util/CommonFun';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePopUp from '../Components/ImagePopUp';
const { height, width } = Dimensions.get('window');

const MyComplianceDetails = (props) => {
    const { route, navigation } = props
    const [ComplianceDetail, setComplianceDetail] = useState(null)
    const [loading, setLoading] = useState(false)
    const UserToken = useSelector(S => S && S.loginStatus && S.loginStatus.loginData && Object.keys(S.loginStatus.loginData).length != 0 && S.loginStatus.loginData.token ? S.loginStatus.loginData.token : '')
    const [ShowImage, setShowImage] = useState(false)
    const [SelectedImage, setSelectedImage] = useState('')

    React.useEffect(() => {
        getRouteData()
    }, [route])
    const getRouteData = () => {
        console.log("navigation", navigation, "route testing log", route)
        if (route && route.params) {
            let rout = route.params
            let compliance_data = rout.data ? rout.data : null
            let sname = rout.ScreenName && rout.ScreenName != "" ? rout.ScreenName : ""
            setComplianceDetail(compliance_data)
        }
    }
    React.useLayoutEffect(() => {
        props.navigation.setOptions({
            headerShown: ShowImage ? false : true
        });
    }, [ShowImage]);

    const { attribute_id, attribute_name, can_id, compliance_id, document_id,
        due_date, expire_date, filename, filetype, notes, start_date, status } = ComplianceDetail ? ComplianceDetail : {}




    const uploadImageFun = async () => {
        console.log('----------',Config().downloadComplianceDocument + `?compliance_id=${compliance_id}`,);
        setLoading(true)
        return new Promise((RESOLVE, REJECT) => {
            // Fetch attachment
            RNFetchBlob.fetch('GET', Config().downloadComplianceDocument + `?compliance_id=${compliance_id}`,
                { Authorization: `Bearer ${UserToken}` })
                .then(async (response) => {
                    let base64Str = response.data;
                    const imageBase64 = `data:image/png;base64,` + base64Str;
                    await setSelectedImage(imageBase64)
                    console.log('base64Str', base64Str);

                    setShowImage(true)
                    // Return base64 image
                    // setImageBase64(imageBase64)
                    RESOLVE(imageBase64)
                    setLoading(false)
                })
                .catch((error) => {
                    console.log("Error: ", error)
                    setLoading(false)
                });

        }).catch((error) => {
            // error handling
            console.log("Error: ", error)
            setLoading(false)
        });


    }

    const closeImagePopup = () => { setShowImage(false) }

    
    const handleViewFile =async () => {
        setLoading(true)
        let CheckVal = true
        await isFileExist(Config().downloadComplianceDocument + `?compliance_id= ${compliance_id}`).then(val => {
            setLoading(false)
                console.log('ImgUrl', val);
                CheckVal = val
            });
            console.log("step2")
        if (CheckVal) {
            console.log("step3",filename)
            if (filename && isImage(filename)) {
                console.log("Step4")
                uploadImageFun()
            }
            else if (filename && filename.endsWith('.pdf')) {
                console.log("step5")
                setLoading(false)
                props.navigation.navigate('PdfView', { data: ComplianceDetail })
            }
            else if (filename && (filename.endsWith('.doc')||filename.endsWith('.docx'))) {
                setLoading(false)
                if (Platform.OS === "android") {
                  let MyURL1 = Config().GDriveOpenURL 
                  console.log(MyURL1,"MyURL1MyURL1")
                //   props.navigation.navigate('PdfView', { data: ComplianceDetail })
                } else {
                    // GoToURL('')
                 }
              }
            else{
                console.log("step6")
                setLoading(false)
            }
        }
        
        else {
            setLoading(false)
            showMessage({ message: 'Error', description: "Unable to Download the Candidate Document. Either the document is not accessible/published for this candidate or it does not exist in this server", type: "danger", });
        }
    }


    return (

        <SafeAreaView style={{ flex: 1 }}>
            {loading ? <Loader /> : null}
            <View style={styles.container}>
                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                    <View style={{ padding: 20, flex: 1, marginTop: 20 }}>
                        <Text style={{ fontSize: height / 30, fontWeight: '700', textAlign: 'center' }}>{`${attribute_name ? attribute_name : ''}`}</Text>
                        <View style={{ marginTop: 30, flex: 1, }}>
                            <Text style={{ fontSize: height / 45, fontWeight: '700', marginTop: 20 }}>
                                Start Date: <Text style={{ fontWeight: 'normal' }}>{start_date ? moment(start_date).format("DD/MM/YYYY") : ''}</Text>
                            </Text>
                            <Text style={{ fontSize: height / 45, fontWeight: '700', marginTop: 20 }}>
                                Expiry Date: <Text style={{ fontWeight: 'normal' }}>{expire_date ? moment(expire_date).format("DD/MM/YYYY") : ''}</Text>
                            </Text>
                            <Text style={{ fontSize: height / 45, fontWeight: '700', marginTop: 20 }}>
                                Due Date: <Text style={{ fontWeight: 'normal' }}>{due_date ? moment(due_date).format("DD/MM/YYYY") : ''}</Text>
                            </Text>

                            <Text style={{ fontSize: height / 45, fontWeight: '700', marginTop: 20 }}>
                                Status: <Text style={{ fontWeight: 'normal' }}>{status ? status : ''}</Text>
                            </Text>
                            <Text style={{ fontSize: height / 45, fontWeight: '700', marginTop: 20 }}>
                                Notes: <Text style={{ fontWeight: 'normal' }}>{notes ? notes : ''}</Text>
                            </Text>
                        </View>


                        <View style={{ justifyContent: 'flex-end', marginTop: 20, alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => handleViewFile()} style={{ width: width / 2, height: 60, backgroundColor: '#007bbf', marginTop: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
                                <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>View File</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
            </View>
            {ShowImage ? <ImagePopUp fileUrl={SelectedImage} PressPopUp={closeImagePopup} /> : null}

        </SafeAreaView>
    )
}
export default MyComplianceDetails


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
    }
});

