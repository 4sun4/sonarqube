import React, { useEffect, useState } from 'react'
import { View, Text, Button, Image, PermissionsAndroid, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, SafeAreaView, Alert, Dimensions, Icon } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { showMessage, hideMessage } from "react-native-flash-message";
import { callGetRestApis, globalPostApi } from '../Services/Api';
import Loader from '../Components/Loader';
import Types from '../redux/Types';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { ImageUploadFun } from '../Util/CommonFun';
import Config from '../Util/Config';
import RNFetchBlob from 'rn-fetch-blob';
import { navigationRef } from '../Navigation/RootNavigation';

let LoginData = ''
const Profile = (props) => {
    const [loading, setLoading] = useState(false)

    const [ImageBase64, setImageBase64] = useState('')
    const ProfilePic = useSelector(S => S && S.HomeDetails && S.HomeDetails.ProfilePic ? S.HomeDetails.ProfilePic : '')

    const dispatch = useDispatch()

    const [state, setState] = useState({
        UserData: null,
        ImgUri: ''
    });
    const UserDetail = useSelector(S => {
        let D = ''
        if (S && S.loginStatus && S.loginStatus.loginData && Object.keys(S.loginStatus.loginData).length != 0) { D = S.loginStatus.loginData; if (D) { LoginData = D } } return D

    })
    const UserToken = useSelector(S => S && S.loginStatus && S.loginStatus.loginData && Object.keys(S.loginStatus.loginData).length != 0 && S.loginStatus.loginData.token ? S.loginStatus.loginData.token : '')

    const [allTabs, setAllTabs] = useState([
        {
            name: "My Details",
            navigateUrl: "ProfileDetail"
        },
        {
            name: "Emergency Contacts",
            navigateUrl: "EmergencyContact"
        },
        {
            name: "My Compliances",
            navigateUrl: "MyCompliance"
        },
        {
            name: "Eligibility to Work",
            navigateUrl: "EligibilityToWork"
        },
        {
            name: "My Files",
            navigateUrl: "MyFile"
        },
        {
            name: "Settings",
            navigateUrl: "Setting"
        },
    ])
    const [selectedTabIndex, setSelectedTabIndex] = useState(null);


    const tabActionBtn = (index, navigateUrl) => {
        setSelectedTabIndex(index)
         console.log(navigationRef.current,"navigation ref profile")

        props.navigation.navigate(navigateUrl)
    }

    const AllTabs = () => {
        return (
            <>
                {
                    allTabs.length > 0 ? allTabs.map((item, index) => {
                        return (
                            <TouchableOpacity key={index} activeOpacity={1} style={{marginTop: 15 ,marginHorizontal:10,borderRadius:8,backgroundColor:'#007bbf'}} onPress={() => tabActionBtn(index, item.navigateUrl)}>
                                {/* <View style={{ alignItems: 'center', marginTop: 15 }}> */}

                                    <View style={{ width: "100%", alignItems:'center', padding: 15,}}>

                                        {/* <View> */}
                                            <Text style={{ fontSize: 16, color: "#FFF" }}>{item.name}</Text>
                                        {/* </View> */}
                                        {/* <View>
                                            <Image
                                                style={{ width: 10, height: 16 }}
                                                resizeMode={'contain'}
                                                source={selectedTabIndex === index ? require('../Assets/Icons/ArrowFwdWhite.png') : require('../Assets/Icons/ArrowFwd.png')} />
                                        </View> */}

                                    </View>
                                {/* </View> */}
                            </TouchableOpacity>
                        )
                    }) : null
                }
            </>
        )
    }


    useEffect(() => {
      
        const unsubscribe = props.navigation.addListener("focus", async () => {
            setImageBase64("")
            getUserDetails()
            uploadImageFun();
        });
        return unsubscribe;

    }, [])

    const getUserDetails = async () => {
        if (LoginData && LoginData.token) {
            let URL = Config().getDetails
            console.log('URL', URL);
            setLoading(true)
            await callGetRestApis(URL)
                .then((res) => {
                    setLoading(false)
                    if (res && res[0]) {
                        dispatch({ type: Types.GET_DETAILS, data: res[0] })
                        setState({ UserData: res[0] })
                    }
                    console.log('getUserDetails res :- ', res)

                })
                .catch((error) => {
                    setLoading(false)

                    console.log('getUserDetails error :- ', error)
                    showMessage({ message: 'Error', description: error, type: "warning", });
                })

        } else {

        }
    }




    const options = {
        // title: "Upload Your Profile Picture",
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 500,
        maxWidth: 500,
    };


    const ChooseOption = () => {

        Alert.alert(
            'Alert',
            'Upload avatar?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Gallery',
                    onPress: () => getProductImages(true),
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

    const getProductImages = async (Gallery) => {
        let methodName = launchImageLibrary
        if (!Gallery) { methodName = launchCamera }

        methodName(options, (res) => {
            let response = res.hasOwnProperty('assets') ? res.assets[0] : res
            if (response.didCancel) {
                console.log("User cancelled image picker ");
            } else if (response.error) {
                console.log("ImagePicker Error:  ", response.error);
            } else {
                console.log('Profile image  =>  ', response)
                setState({ ...state, ImgUri: response })

                let FileSize = 0
                if (response.fileSize) { FileSize = response.fileSize }
                if (FileSize && FileSize > 409600 ) {
                    let widthN = 1024
                    let heightN = 1024
                    // if (response.height) { heightN = response.height / 4 }
                    // if (response.width) { widthN = response.width / 4 }
                    let Rot = 0
                    if (response.originalRotation) { Rot = response.originalRotation }
                    ImageResizer.createResizedImage(response.uri, widthN, heightN, 'JPEG', 100, Rot)
                        .then(response => {
                            console.log('response resized ', response);
                            saveProductImages(response)
                        })
                        .catch(err => {
                            console.log('error ', err);
                        });

                } else {
                    if (response && response.uri) { setState({ ...state, ImgUri: response }); saveProductImages(response) }
                }
            }
        });

    }

    const saveProductImages = async (response) => {
        let file = ImageUploadFun(response)
        setLoading(true)
        let formdata = new FormData();
        formdata.append("upload_file", file),
            console.log('formdata', formdata);
        let Uri = Config().uploadMyAvatar
        await globalPostApi(Uri, formdata)
            .then((res) => {
                setLoading(false)
                if (res) {
                    console.log('uploadMyAvatar res :- ', res);
                    showMessage({ message: 'Success', description: 'Avatar Uploaded successfully.', type: "success", });
                    uploadImageFun()
    
                }else{
                    showMessage({ message: 'Error', description: 'Error in uploading image', type: "warning", });

                }
            })
            .catch((error) => {
                setLoading(false)
                console.log('uploadMyAvatar error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })

    }







    const { UserData, ImgUri } = state

    let name = ''
    if (UserData) {
        if (UserData.first_name) { name = UserData.first_name }
        if (UserData.last_name) { name = name + ' ' + UserData.last_name }

    }

    const uploadImageFun = () => {
        setLoading(true)
        return new Promise((RESOLVE, REJECT) => {
            // Fetch attachment
            RNFetchBlob.fetch('GET', Config().DownloadCandidateAvatar, { Authorization: `Bearer ${UserToken}` })
                .then((response) => {
                    let base64Str = response.data;
                    const imageBase64 = `data:image/png;base64,` + base64Str;
                    // Return base64 image
                    setImageBase64(imageBase64)
                    RESOLVE(imageBase64)
                    setLoading(false)
                    dispatch({ type: Types.PROFILE_PIC, data: imageBase64 })

                })

        }).catch((error) => {
            console.log("Error in Profile:", error)
            setLoading(false)
        });

    }

console.log('imageBase64imageBase64',ImageBase64);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            {loading ? <Loader /> : null}


            <View style={styles.container}>
                <ScrollView>

                    <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
                        <View style={{marginTop:40, marginBottom: 30, alignItems: "center" }}>
                            <View style={{
                                elevation: 3,
                                borderWidth: 1,
                                borderColor: '#FFF',
                                borderBottomWidth: 1,
                                shadowColor: '#DCDCDC',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.9,
                                alignSelf: 'center', justifyContent: 'center', alignItems: 'center', width: 120, height: 120, backgroundColor: '#FFF', borderRadius: 120
                            }}>

                                <Image
                                    style={{ width: 100, height: 100, borderRadius: 100, }}
                                    source={ImgUri && ImgUri.uri ? { uri: ImgUri.uri } : !UserToken ? require('../Assets/Icons/man.jpg') : { uri: ImageBase64 ? ImageBase64 : ProfilePic }} />


                                <TouchableOpacity onPress={ChooseOption} style={{ height: 46, width: 46, right: 0, top: 0, bottom: 0, zindex: 999, position: 'absolute', backgroundColor: '#D02530', borderRadius: 28, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image
                                        style={{ height: 20, width: 30 }}
                                        resizeMode={'contain'}
                                        source={require('../Assets/Icons/Camera.png')}
                                    ></Image>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{backgroundColor:"#d8e4f6",borderRadius:12,marginBottom:20,marginHorizontal:10,paddingLeft:15,paddingRight:15,paddingVertical:8}}>
                            <Text style={{ textAlign: 'center', fontSize: 16 }}>
                                Select from the following options to manage your profile
                            </Text>
                        </View>

                        <AllTabs />

                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: '#FFF',
    }
});

export default Profile
