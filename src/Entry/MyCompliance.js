import React, { useEffect } from 'react'
import { View, Text, Platform, Image, PermissionsAndroid, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Dimensions, SafeAreaView } from 'react-native'
import { useState } from 'react';
import { callGetRestApis, isFileExist } from '../Services/Api';
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../Components/Loader';
import { showMessage, hideMessage } from "react-native-flash-message";
import moment from 'moment'
import { CONSTRAINT_TEXT } from '../Util/String';
import Config from '../Util/Config';
import { getExtention, requestExtenalStoragePermissionsAndroid } from '../Util/CommonFun';
import RNFetchBlob from 'rn-fetch-blob';

let LoginData = ''

const MyCompliance = (props) => {

    const UserDetail = useSelector(S => { let D = ''; if (S && S.loginStatus && S.loginStatus.loginData && Object.keys(S.loginStatus.loginData).length != 0) { D = S.loginStatus.loginData; if (D) { LoginData = D } } return D })
    const [loading, setLoading] = useState(false)

    const [data, setData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        iconAnimating: false,
        isPasswordShow: true
    });
    const [compliances, setCompliance] = useState([])

    useEffect(() => {
        const unsubscribe = props.navigation.addListener("focus", async () => {
            getCompliance()
        });
        return unsubscribe;

    }, [])


    const getCompliance = async () => {
        if (LoginData && LoginData.token) {
            let URL = Config().getCompliance
            console.log('URL', URL);
            setLoading(true)
            let sorted = []
            await callGetRestApis(URL)
                .then((res) => {
                    setLoading(false)
                    if (res) {
                        sorted = res.sort(function (a, b) {
                            return new Date(a.expire_date) - new Date(b.expire_date);
                        });
                        setCompliance(sorted)
                    }
                    console.log('getCompliance res :- ', res)

                })
                .catch((error) => {
                    setLoading(false)

                    console.log('getCompliance error :- ', error)
                    showMessage({ message: 'Error', description: error, type: "warning", });
                })

        } else {

        }
    }






    const ChooseOption = (item) => {
        Alert.alert(
            'Alert', 'Do you want to download this file?',
            [{ text: 'Yes', onPress: () => checkPermission(item), style: 'cancel' },
            { text: 'No', style: 'cancel', }],
            { cancelable: false },
        );
    }


    const checkPermission = async (item) => {
        if (Platform.OS === 'ios') {
            downloadFile(item);
        } else {
            try {

                const isGranted = await requestExtenalStoragePermissionsAndroid();
                if (isGranted) {
                    downloadFile(item);
                    console.log('Storage Permission Granted.');
                } else {
                    Alert.alert('Error', 'Storage Permission Not Granted');
                }
            } catch (err) {
                console.log("++++" + err);
            }
        }
    };


      const getExtention = filename => {
        // To get the file extension
        return /[.]/.exec(filename) ?
                 /[^.]+$/.exec(filename) : undefined;
      };

    const downloadFile = async (item) => {
        let CheckVal = true
        setLoading(true);
        await isFileExist(Config().downloadComplianceDocument + `?compliance_id= ${item.compliance_id}`).then(val => {
                console.log('ImgUrl', val);
                CheckVal = val
            }).catch((err) => {
                setLoading(false);
            });

        if (CheckVal) {
            let ext = ''
            if (item.filename) {
                ext = getExtention(item.filename);
                ext = '.' + ext;
            }

            var Fname = ''
            let date = new Date()
            if (item.filename) { Fname = item.filename.split("."); }
            if (Fname) { Fname = `/${Fname[0]}` + ext }
            else { Fname = '/file_' + Math.floor(date.getTime() + date.getSeconds() / 2) + ext }

            const { config, fs } = RNFetchBlob
            let PictureDir = fs.dirs.DownloadDir
            let options = {
                fileCache: true,
                addAndroidDownloads: {
                    useDownloadManager: true, notification: true,
                    path: PictureDir + Fname,
                    description: 'Downloading file.'
                }
            }
            if(Platform.OS === "ios"){
                options = {
                        fileCache: true,
                        path: `${fs.dirs.DocumentDir}${Fname}`
                }
            }
            setLoading(true)
            config(options).fetch("GET",Config().downloadComplianceDocument + `?compliance_id=${item.compliance_id}`,{ Authorization: `Bearer ${LoginData && LoginData.token}` })
            .then((res) => {
                    let status = res.info().status;
                    console.log('resres', res);
                    if (Platform.OS === 'ios') {
                        RNFetchBlob.ios.openDocument(res.path());
                    }
                    setLoading(false)
                    showMessage({ message: 'Success', description: "Compliance Downloaded Successfully", type: "success", });
                })
                .catch((error) => {
                    setLoading(false)
                    showMessage({ message: 'Error', description: "Compliance Not downloaded", type: "danger", });
                })
        } else {
            setLoading(false)
            showMessage({ message: 'Error', description: "Unable to Download the Candidate Document. Either the document is not accessible/published for this candidate or it does not exist in this server", type: "danger", });
        }
    }




    return (
        <SafeAreaView style={{ flex: 1 }}>
            {loading ? <Loader /> : null}

            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <KeyboardAvoidingView>
                        <View style={{ width: '100%', paddingVertical: 20 }}>
                            <View style={{alignSelf:'flex-end'}}>
                            <TouchableOpacity 
                                onPress={() => {props.navigation.navigate('AddCompliance')}}
                                style={{ borderRadius:100, padding: 12,backgroundColor:'#E8E8E8',alignSelf:'center' }}>
                                <Image
                                    style={{ width: 18, height: 18, alignSelf: 'center' }}
                                    resizeMode={'contain'}
                                    source={require('../Assets/Icons/HeaderAdd.png')} />
                             </TouchableOpacity>
                            </View>
                        
                            {
                                compliances.length > 0 ? compliances.map((item, index) => {
                                    return (
                                        <TouchableOpacity onPress={() => props.navigation.navigate('MyComplianceDetails', { data: item })}
                                            key={index} style={{ marginVertical: 10, paddingHorizontal: 25, borderWidth: 2, borderColor: item.status == CONSTRAINT_TEXT.Expired ? '#D2222A' : item.status == CONSTRAINT_TEXT.Pending ? "#FFBF00" : '#22D2B4', }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',marginTop:8 }}>
                                                <View>
                                                    <Text style={{ color: item.status == CONSTRAINT_TEXT.Expired ? '#D2222A' : item.status == CONSTRAINT_TEXT.Pending ? "#FFBF00" : '#22D2B4', fontSize: 18, paddingBottom: 5,fontWeight:'bold'}}>{item.attribute_name ? item.attribute_name : ''}</Text>
                                                </View>
                                                <View>
                                                    <Image
                                                        style={{ width: 16, height: 16 }}
                                                        resizeMode={'contain'}
                                                        source={require('../Assets/Icons/ArrowFwd.png')} />
                                                </View>



                                            </View>
                                            <View>
                                            <Text style={{ color: '#000', fontSize: 15 }}>Expires {'\n'}{item.expire_date ? moment(item.expire_date).format('DD/MM/YYYY') : ''}</Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end',paddingBottom:8 }}>
                    
                                                <TouchableOpacity onPress={() => ChooseOption(item)}>
                                                    <Image
                                                        style={{ width: 20, height: 20, marginHorizontal: 0 }}
                                                        resizeMode={'contain'}
                                                        source={require('../Assets/Icons/Download.png')} />
                                                </TouchableOpacity>
                                                {/* <TouchableOpacity onPress={() => props.navigation.navigate('AddCompliance', { updateData: item, screenParam: 'edit' })}>
                                                    <Image
                                                        style={{ width: 20, height: 20 }}
                                                        resizeMode={'contain'}
                                                        source={require('../Assets/Icons/HeaderEdit.png')} />
                                                </TouchableOpacity> */}
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }) : null
                            }
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
        backgroundColor: '#F6F6F6',
    }
});

export default MyCompliance
