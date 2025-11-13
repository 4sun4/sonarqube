import React, { useRef } from 'react'
import { View, Text, Platform, Image, Linking, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, PermissionsAndroid, SafeAreaView } from 'react-native'
import { useState } from 'react';
import { connect } from 'react-redux';
import Config from '../Util/Config';
import { callGetBodyApis, CallPostRestApi, globalPostApi } from '../Services/Api';
import Loader from '../Components/Loader';
import { showMessage, hideMessage } from "react-native-flash-message";
import { useDispatch, useSelector } from 'react-redux'
import Types from '../redux/Types';
import Geolocation from 'react-native-geolocation-service';
import AndroidOpenSettings from 'react-native-android-open-settings'
import ShiftPopup from '../Components/Popups/ShiftPopup';
import { store } from '../redux/Store';
import { Icon } from 'react-native-elements';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { ImageUploadFun, normalizeSize } from '../Util/CommonFun';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Setting = (props) => {
    const [loading, setLoading] = useState(false)
    const LocationStatus = useSelector(S => { let D = ''; if (S && S.SettingDetails) { D = S.SettingDetails.LocationStatus; if (D) { } } return D })
    let Vissible = store.getState().HomeDetails.ClockPopup
    const [Bool, setBool] = useState(false)
    const [SettingApiRes, setSettingApiRes] = useState(null)

    const UserDetail = useSelector(S => { let D = ''; if (S && S.HomeDetails && S.HomeDetails.UserDetails && Object.keys(S.HomeDetails.UserDetails).length != 0) { return S.HomeDetails.UserDetails } })

    const watchId = useRef(null);
    const dispatch = useDispatch()
    const [state, setState] = useState({
        latitudeAndroid: 0.00,
        longitudeAndroid: 0.00,
        permissionstatus: 0, PERMISSIONS_Allowed: false,
    });


    const [data, setData] = useState({
        inAppMessage: UserDetail && UserDetail.in_app_messages == "YES" ? true : false,
        geolocation: UserDetail && UserDetail.geolocation == "YES" ? true : false,
        notifyJobCloseBy: UserDetail && UserDetail.notify_jobs_close_by == "YES" ? true : false,
        subscribeNewsletter: UserDetail && UserDetail.newsletter == "YES" ? true : false,
    });


    React.useLayoutEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (<TouchableOpacity activeOpacity={1} underlayColor="white" onPress={() => getAndUpdateCandidateAppSettings()}
                style={{ alignItems: 'center', justifyContent: 'center', paddingLeft: 10, paddingRight: 10 }}>
                <Image style={{ width: 18, height: 18, alignSelf: 'center' }} resizeMode={'contain'} source={require('../Assets/Icons/HeaderCheck.png')} />
            </TouchableOpacity>
            ),
        });
    }, [data]);


    const hasLocationPermission = async () => {


        if (Platform.OS === 'android' && Platform.Version < 23) {
            return true;
        }

        const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        );

        if (hasPermission) {
            return true;
        }

        const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (status === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        }

        if (status === PermissionsAndroid.RESULTS.DENIED) {
            ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG,);
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG,);
        }

        return false;
    };


    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener("focus", async () => {
            // setLoading(true)
            // setTimeout(mapPermission, 50);

        });
        return unsubscribe;
    }, [])



    const mapPermission = () => {
        Geolocation.getCurrentPosition(
            position => {
                console.log("position==6=1=>", position);
                setLoading(false)

                dispatch({ type: Types.LOCATION_PERMISSION, data: true })
                setState({
                    ...state, PERMISSIONS_Allowed: true, latitudeAndroid: parseFloat(position.coords.latitude),
                    longitudeAndroid: parseFloat(position.coords.longitude),
                });

            },
            error => {
                setLoading(false)
                console.log("ooooo=1>", error);
                console.log("ooooo=2>", JSON.stringify(error));
                dispatch({ type: Types.LOCATION_PERMISSION, data: false })
                setState({ ...state, PERMISSIONS_Allowed: false, permissionstatus: error.code });
                console.log("ooooo=3>")
            },
            {
                enableHighAccuracy: true, timeout: 5000,
            }
        );


    }

    const getAndUpdateCandidateAppSettings = async () => {
        let URL = Config().getAndUpdateCandidateAppSettings
        console.log('URL', URL);
        setLoading(true)
        let param = {
            "newsletter": data.subscribeNewsletter ? "YES" : "NO",
            "in_app_messages": data.inAppMessage ? "YES" : "NO",
            "geolocation": data.geolocation ? "YES" : "NO",
            "notify_jobs_close_by": data.notifyJobCloseBy ? "YES" : "NO",
        }
        await callGetBodyApis(URL, param)
            .then(async (res) => {
                setLoading(false)
                if (res && res.success) { 
                    setSettingApiRes(res)
                    showMessage({ message: 'Success', description: 'Settings Updated Successfully.', type: "success", });

                    if (res.geolocation=="YES") {
                        dispatch({ type: Types.LOCATION_STATUS, data: true })
                        // showMessage({ message: 'Success', description: 'GeoLocation Enabled Successfully.', type: "success", });
                        dispatch({ type: Types.LOCATION_FLAG, data: true })
                    }
                    else {
                        dispatch({ type: Types.LOCATION_STATUS, data: false })
                        dispatch({ type: Types.LOCATION_CORDS, data: null })
                        dispatch({ type: Types.LOCATION_FLAG, data: false })
                    }
                }
                console.log('getAndUpdateCandidateAppSettings res :- ', res)
            })
            .catch((error) => {
                setLoading(false)
                console.log('getAndUpdateCandidateAppSettings error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })

    }

    const options = {
        // title: "Upload Your Profile Picture",
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 500,
        maxWidth: 500,
    };

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
                    if (response && response.uri) { saveProductImages(response) }
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

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {loading ? <Loader /> : null}
            <View 
                style={{
                    flexDirection:'row',
                    alignItems:'center',
                    paddingHorizontal: Platform.OS=="android"? 14:8,
                    justifyContent:"space-between",
                    paddingVertical:8,
                    backgroundColor:'#d9d9d9'
                }}>
                <TouchableOpacity onPress={()=>props?.navigation?.pop()}>
                {Platform.OS=="android" ? <AntDesign name="arrowleft" size={22}/>:
                    <MaterialIcons name="arrow-back-ios" size={26}/>}
                </TouchableOpacity>
                <Text style={styles.title}>Settings</Text>
                <TouchableOpacity activeOpacity={1} underlayColor="white" onPress={() => getAndUpdateCandidateAppSettings()}
                    style={{ paddingLeft: 10}}>
                    <Image style={{ width: 18, height: 18}} resizeMode={'contain'} source={require('../Assets/Icons/HeaderCheck.png')} />
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <ScrollView>
                    <KeyboardAvoidingView>



                        <View style={{ width: '100%', paddingVertical: 20 }}>
                            <View style={{ marginVertical: 10 }}>
                                <TouchableOpacity onPress={() => props.navigation.navigate('ChangePassword')} activeOpacity={1}>
                                    <View style={{ borderWidth: 1, borderColor: '#DDD', paddingVertical: 15, paddingHorizontal: 25, backgroundColor: '#007bbf' }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                            <View>
                                                <Text style={{ color: '#fff', fontSize: 16 }}>Change Password</Text>
                                            </View>
                                            <View >
                                            <Icon
                                                name={"arrow-forward-ios"}
                                                size={18}
                                                color={'#fff'}
                                                type={"material-icons"}
                                                iconStyle={{alignSelf: 'center'}}
                                                onPress={() => {
                                                }}
                                            />
                                                {/* <Image
                                                    style={{ width: 10, height: 16 }}
                                                    resizeMode={'contain'}
                                                    source={require('../Assets/Icons/ArrowFwd.png')} /> */}

                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginVertical: 10 }}>
                                <TouchableOpacity onPress={() => ChooseOption()} activeOpacity={1}>
                                    <View style={{ borderWidth: 1, borderColor: '#DDD', paddingVertical: 15, paddingHorizontal: 25, backgroundColor: '#007bbf' }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                            <View>
                                                <Text style={{ color: '#fff', fontSize: 16 }}>Change Profile Picture</Text>
                                            </View>
                                            <View >
                                            <Icon
                                                name={"arrow-forward-ios"}
                                                size={18}
                                                color={'#fff'}
                                                type={"material-icons"}
                                                iconStyle={{alignSelf: 'center'}}
                                                onPress={() => {
                                                }}
                                            />
                                                {/* <Image
                                                    style={{ width: 10, height: 16 }}
                                                    resizeMode={'contain'}
                                                    source={require('../Assets/Icons/ArrowFwd.png')} /> */}

                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginVertical: 10 }}>
                                <View style={{ borderWidth: 1, borderColor: '#DDD', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 25, backgroundColor: '#007bbf' }}>
                                    <View>
                                        <Text style={{ color: '#fff', fontSize: 16 }}>In-App Messages</Text>
                                    </View>
                                    <View>
                                        <TouchableOpacity activeOpacity={1} onPress={() => setData({ ...data, inAppMessage: !data.inAppMessage })}>
                                            <Image
                                                style={{ width: 50, height: 25 }}
                                                resizeMode={'contain'}
                                                source={data.inAppMessage ? require('../Assets/Icons/SwitchOn.png') : require('../Assets/Icons/SwitchOff.png')} />
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </View>

                            <View style={{ marginVertical: 10 }}>
                                <View style={{ borderWidth: 1, borderColor: '#DDD', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 25, backgroundColor: '#007bbf' }}>
                                    <View>
                                        <Text style={{ color: '#fff', fontSize: 16 }}>Enable Geolocation</Text>
                                    </View>
                                    <View>
                                        <TouchableOpacity activeOpacity={1} onPress={() => setData({ ...data, geolocation: !data.geolocation })}>
                                            <Image
                                                style={{ width: 50, height: 25 }}
                                                resizeMode={'contain'}
                                                source={data.geolocation ? require('../Assets/Icons/SwitchOn.png') : require('../Assets/Icons/SwitchOff.png')} />
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </View>
                            <View style={{ marginVertical: 10 }}>
                                <View style={{ borderWidth: 1, borderColor: '#DDD', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 25, backgroundColor: '#007bbf' }}>
                                    <View>
                                        <Text style={{ color: '#fff', fontSize: 16 }}>Jobs Close By Notification</Text>
                                    </View>
                                    <View>
                                        <TouchableOpacity activeOpacity={1} onPress={() => setData({ ...data, notifyJobCloseBy: !data.notifyJobCloseBy })}>
                                            <Image
                                                style={{ width: 50, height: 25 }}
                                                resizeMode={'contain'}
                                                source={data.notifyJobCloseBy ? require('../Assets/Icons/SwitchOn.png') : require('../Assets/Icons/SwitchOff.png')} />
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </View>
                            <View style={{ marginVertical: 10 }}>
                                <View style={{ borderWidth: 1, borderColor: '#DDD', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 25, backgroundColor: '#007bbf' }}>
                                    <View>
                                        <Text style={{ color: '#fff', fontSize: 16 }}>Newsletter</Text>
                                    </View>
                                    <View>
                                        <TouchableOpacity activeOpacity={1} onPress={() => setData({ ...data, subscribeNewsletter: !data.subscribeNewsletter })}>
                                            <Image
                                                style={{ width: 50, height: 25 }}
                                                resizeMode={'contain'}
                                                source={data.subscribeNewsletter ? require('../Assets/Icons/SwitchOn.png') : require('../Assets/Icons/SwitchOff.png')} />
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
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
        backgroundColor: '#F6F6F6',
    }
});



const mapStateToProps = (state) => { const { HomeDetails: { ClockPopup } } = state; return { ClockPopup }; };


export default connect(mapStateToProps, null)(Setting);
