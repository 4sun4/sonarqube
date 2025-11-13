import React, { useEffect } from 'react'
import { View, Text, Button, Image, PermissionsAndroid, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Dimensions, SafeAreaView, Platform } from 'react-native'
import { useState } from 'react';
import { connect } from 'react-redux';
import { callGetRestApis, CallPostRestApi } from '../Services/Api';
import { showMessage, hideMessage } from "react-native-flash-message";
import Loader from '../Components/Loader';
import { useDispatch, useSelector } from 'react-redux'
import { CapitalizeName, getExtention, isImage, requestExtenalStoragePermissionsAndroid } from '../Util/CommonFun';
import Config from '../Util/Config';
import RNFetchBlob from 'rn-fetch-blob';

import moment from 'moment'
import Colors from '../Util/Colors';

let LoginData = ''
const MyFile = (props) => {
    const UserDetail = useSelector(S => { let D = ''; if (S && S.loginStatus && S.loginStatus.loginData && Object.keys(S.loginStatus.loginData).length != 0) { D = S.loginStatus.loginData; if (D) { LoginData = D } } return D })
    const [loading, setLoading] = useState(false)
    const [MyFileData, setMyFileData] = useState([])
    const [sharedFileData, setSharedFileData] = useState([])
    const screenwidth = Dimensions.get('window').width
    const screenheight = Dimensions.get('window').height
    const UserToken = useSelector(S => S && S.loginStatus && S.loginStatus.loginData && Object.keys(S.loginStatus.loginData).length != 0 && S.loginStatus.loginData.token ? S.loginStatus.loginData.token : '')



    useEffect(() => {
        const unsubscribe = props.navigation.addListener("focus", async () => {
            getMyFile();
            getSharedFiles();
        });
        return unsubscribe;

    }, [])

    const getMyFile = async () => {
        let URL = Config().getCandidateFiles
        console.log('URL', URL);
        let sorted = []
        setLoading(true)
        await callGetRestApis(URL)
            .then((res) => {
                setLoading(false)
                if (res) {
                    sorted = res.sort(function (a, b) {
                        return new Date(b.created_date) - new Date(a.created_date);
                    });
                    setMyFileData(sorted)
                }
                console.log('getCandidateFiles res :- ', res)
            })
            .catch((error) => {
                setLoading(false)
                console.log('getCandidateFiles error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })

    }
    const getSharedFiles = async () => {
        let URL = Config().getSharedFiles
        console.log('URL', URL);
        let sorted = []
        setLoading(true)
        await callGetRestApis(URL)
            .then((res) => {
                setLoading(false)
                setSharedFileData(res)
                console.log('getSharedFiles res :- ', res)
            })
            .catch((error) => {
                setLoading(false)
                console.log('getSharedFiles error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })

    }


    const deleteMyFile = async (id) => {
        setLoading(true)
        let body = {
            "document_id": id,
        }
        let url = Config().LIVE + 'deleteCandidateFile'
        await CallPostRestApi(body, url)
            .then((res) => {
                setLoading(false)
                console.log('deleteCandidateFile res :- ', res);
                if (res && res.success == true) {
                    getMyFile()
                    showMessage({ message: 'Success', description: 'Candidate Document successfully deleted!', type: "success", });

                } else if (res && res.error) {
                    showMessage({ message: 'Error', description: res.error_message, type: "danger", });

                }

            })
            .catch((error) => {
                setLoading(false)
                console.log('deleteCandidateFile error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })

    }

    const handleOption = (id) => {

        Alert.alert(
            'Alert',
            'Do you want to delete your file?',
            [{ text: 'YES', onPress: () => deleteMyFile(id) },
            { text: 'NO', onPress: () => { console.log('no') } },],
            { cancelable: false });
    }


    const ChooseOption = (item,type) => {
        Alert.alert(
            'Alert', 'Do you want to download this file?',
            [{ text: 'Yes', onPress: () => checkPermission(item,type), style: 'cancel' },
            { text: 'No', style: 'cancel', }],
            { cancelable: false },
        );
    }


    const checkPermission = async (item,type) => {
        if (Platform.OS === 'ios') {
            downloadFile(item,type);
        } else {
            try {
                const isGranted = await requestExtenalStoragePermissionsAndroid();
                if (isGranted) {
                    downloadFile(item,type);
                    console.log('Storage Permission Granted.');
                } else {
                    Alert.alert('Error', 'Storage Permission Not Granted');
                }
            } catch (err) {
                console.log("++++" + err);
            }
        }
    };





    const downloadFile = (item,type) => {
        console.log(item,"-----item-----")
        let ext = getExtention(item.filename);
        ext = '.' + ext;
        var Fname = ''
        let date=new Date
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
        const fileLink = type === "sharedFile" ? item?.link : Config().DownloadCandidateFile + `?document_id= ${item.document_id}`
        config(options).fetch("GET",
            fileLink,
            { Authorization: `Bearer ${LoginData && LoginData.token}` }
        )
            .then((res) => {
                let status = res.info().status;
                if (Platform.OS === 'ios') {
                    RNFetchBlob.ios.openDocument(res.path());
                }
                console.log('resres', res);
                setLoading(false)
                showMessage({ message: 'Success', description: "File Downloaded Successfully", type: "success", });
            })
            .catch((error) => {
                setLoading(false)
                showMessage({ message: 'Error', description: "File Not downloaded", type: "danger", });
            })

    }





    return (
        <SafeAreaView style={{ flex: 1 }}>
            {loading ? <Loader /> : null}

            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <KeyboardAvoidingView>
                        <View style={{ width: '100%', paddingVertical: 20 }}>
                            
                                 
                             <View style={{ marginVertical: 10 }}>
                                      
                             { sharedFileData.length > 0 ?  <Text style={{fontSize:20,paddingBottom:16,fontWeight:'bold'}}>Shared Files</Text>:null}
                                       { sharedFileData.length > 0 ? sharedFileData.map((item, index) => {
                                    return (
                                        <View key={index} style={{ borderWidth: 2,  
                                                                shadowColor: "#000000",
                                                                shadowOpacity: 0.8,
                                                                shadowRadius: 2,
                                                                shadowOffset: {
                                                                height: 1,
                                                                width: 1
                                                                },
                                                                elevation:4,
                                                                borderColor: '#DDD' , paddingVertical: 10, paddingHorizontal: 25, backgroundColor: '#FFF',marginBottom:10,
                                                                
                                                                 }}>
                                                
                                                    <View style={{flexDirection: 'row',justifyContent:'space-between', paddingTop: 5}}>
                                                    <View style={{flex:1}}>
                                                        <Text style={{ color: '#22D2B4' , fontSize: 18, paddingBottom: 5 }}>{item?.filename}</Text>
                                                    </View>
                                                        <TouchableOpacity style={{alignSelf:'center'}} onPress={() => {ChooseOption(item,"sharedFile")}}>
                                                            <Image
                                                                style={{ width: 24, height: 24, marginHorizontal: 20 }}
                                                                resizeMode={'contain'}
                                                                source={require('../Assets/Icons/Download.png')} />
                                                        </TouchableOpacity>
                                                    
                                                    </View>
                                        </View>
                                         )}):null
                            }

                            </View> 
                                   

                             {sharedFileData.length > 0?<View style={{marginVertical:20,borderBottomWidth:3,borderBottomColor:'#DDD'}}></View>:null}
                                                            
                            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                            <Text style={{fontSize:20,paddingBottom:16,fontWeight:'bold'}}>My Files</Text>
                            <TouchableOpacity 
                                onPress={() => {props.navigation.navigate('AddFile')}}
                                style={{ borderRadius:100, padding: 12,backgroundColor:'#E8E8E8',alignSelf:'center' }}>
                                <Image
                                    style={{ width: 18, height: 18, alignSelf: 'center' }}
                                    resizeMode={'contain'}
                                    source={require('../Assets/Icons/HeaderAdd.png')} />
                                </TouchableOpacity>
                            </View>

                            {
                                
                                MyFileData.length > 0 ? MyFileData.map((item, index) => {
                                    return (
                                        <View key={index} style={{ marginVertical: 10 }}>
                                            <View style={{  shadowColor: "#000000", shadowOpacity: 0.8,shadowRadius: 2,shadowOffset: {height: 1,width: 1},
                                                            elevation:4, borderWidth: 2, borderColor: '#DDD' , paddingVertical: 15, paddingHorizontal: 25, backgroundColor: '#FFF' }}>
                                                <View>
                                                    <Text style={{ color: '#22D2B4' , fontSize: 18, }}>{item.description ? CapitalizeName(item.description) : ''}</Text>
                                                    <Text style={{ color: '#000', fontSize: 15 }}>Uploaded on {'\n'}{item.created_date ? moment(item.created_date).format('DD/MM/YYYY') : ''}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end',alignItems: 'flex-end',  }}>
                                                    
                                                    <TouchableOpacity onPress={() => ChooseOption(item,"file")}>
                                                        <Image
                                                            style={{ width: 24, height: 24, }}
                                                            resizeMode={'contain'}
                                                            source={require('../Assets/Icons/Download.png')} />
                                                    </TouchableOpacity>
                                                    {/* <TouchableOpacity onPress={() => handleOption(item.document_id)}>
                                                        <Image
                                                            style={{ width: 24, height: 24 }}
                                                            resizeMode={'contain'}
                                                            source={require('../Assets/Icons/Delete.png')} />
                                                    </TouchableOpacity> */}
                                                </View>
                                            </View>
                                        </View>
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

export default MyFile




