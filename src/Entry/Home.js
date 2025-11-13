import React, { useRef, useEffect, useState } from 'react'
import { View, Text, Platform, Image,ActivityIndicator, Linking, StyleSheet, TouchableOpacity, ToastAndroid, PermissionsAndroid, ScrollView, SafeAreaView, Alert, Dimensions, Icon } from 'react-native'
import { connect, useDispatch, useSelector } from 'react-redux'
import { showMessage, hideMessage } from "react-native-flash-message";
import { callGetBodyApis, callGetRestApis, CallPostRestApi, globalPostApi } from '../Services/Api';
import Loader from '../Components/Loader';
import Types from '../redux/Types';
import { store } from '../redux/Store';
import Colors from '../Util/Colors';
import Config from '../Util/Config';
import { CheckNet, ImageUploadFun, normalizeSize, updateNotificationBadge } from '../Util/CommonFun';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'rn-fetch-blob';
import { JobArr, Working_status } from '../Util/DumyJson';
import moment from 'moment';
import Geolocation from 'react-native-geolocation-service';
import { navigationRef } from '../Navigation/RootNavigation';
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { useFocusEffect } from '@react-navigation/native';
import { getBadgeCountApi } from '../Services/Queries';
import { Badge } from 'react-native-elements'


let ID = 0
let LoginData = ''
const Home = (props) => {
    console.log(props,"---------------------------------------")

    const screenwidth = Dimensions.get('window').width
    const screenheight = Dimensions.get('window').height
    const [loading, setLoading] = useState(false)
    const [inAppMessage, setInAppMessage] = useState(true)
    const [JobData, setJobData] = useState(JobArr)
    const [TodayJobData, setTodayJobData] = useState([])
    const [clockObj, setClockObj] = useState(undefined)
    const [MyTimesheetData, setMyTimeSheetData] = useState([])
    
    const dispatch = useDispatch()
    let Vissible = store.getState().HomeDetails.ClockPopup
    const UserDetail = useSelector(S => { let D = ''; if (S && S.loginStatus && S.loginStatus.loginData && Object.keys(S.loginStatus.loginData).length != 0) { D = S.loginStatus.loginData; if (D) { LoginData = D } } return D })
    const UserToken = useSelector(S => S && S.loginStatus && S.loginStatus.loginData && Object.keys(S.loginStatus.loginData).length != 0 && S.loginStatus.loginData.token ? S.loginStatus.loginData.token : '')
    // selectors.js
    const selectTodayShiftData = (state) => state && state?.JobStore &&state?.JobStore?.TodayShiftObj;
        // Get today's date in YYYY-MM-DD format
        const todayDate = new Date().toISOString().split('T')[0];
    
        // Use the selector to access the shift data
        const todayShiftData = useSelector(selectTodayShiftData);
        
        // Check if there are any shifts for today
        // const hasShifts = todayShiftData&& todayShiftData[todayDate] && todayShiftData[todayDate].length > 0;

         const selectAllTimeSheet = (state) => state.TimeSheetStore.AllTimeSheet || [];
         const allTimeSheet = useSelector(selectAllTimeSheet);
         const selectOfflineClockIn = (state) => state.offlineApiStore.offlineClockinObj || [];
         const allOfflineClockin = useSelector(selectOfflineClockIn);
    
         // Safely handle undefined or empty data
         const clockInValue = allTimeSheet.length > 0 ? allTimeSheet[0]?.clock_in : 'No Data';
         console.log(clockInValue,"clockInValueclockInValueclockInValueclockInValue",allOfflineClockin)

    let newUSer =  useSelector(s => s?.loginStatus?.newUser)
    const unReadMsgCount = useSelector(S => S && S.HomeDetails && S.HomeDetails.unreadMessageCount ? S.HomeDetails.unreadMessageCount : 0)

    const [ImageBase64, setImageBase64] = useState('')
    const [state, setState] = useState({ UserData: null, locationStatus: false, lat: 0, long: 0, ImgUri: null });
    const [allTabs, setAllTabs] = useState([
        {
            name: "Profile",
            navigateUrl: "Profile",
            stack: ""
        },
        {
            name: "My Leave & Availability",
            navigateUrl: "Availability",
            stack: ""
        },
        {
            name: "Roster",
            navigateUrl: "Roster",
            stack: ""
        },
        {
            name: "Payslips",
            navigateUrl: "PaySlip",
            stack: ""
        },
        {
            name: "Messages",
            navigateUrl: "Messages",
            stack: ""
        },
         {
            name: "My Compliances",
            navigateUrl: "MyCompliance",
            stack: ""
        },
        {
            name: "Documents",
            navigateUrl: "MyFile",
            stack: ""
        }
    ])
    const [selectedTabIndex, setSelectedTabIndex] = useState(null);
    const [clockInObj, setclockInObj] = useState(null)
    const [clock_in, setClock_in] = useState(0)
    const [clockInLoader,setClockInLoader] = useState(false)
    const isNetAvailable = useSelector(s => s?.appStore?.isNetAvailable)
    

    const tabActionBtn = (index, navigateUrl, stack) => {
        // console.log(index, navigateUrl,"stack",stack,"naigation")
        if(navigateUrl== 'Documents'){
            return
        }
        console.log(navigationRef.current.getState(),"navigation ref")

        setSelectedTabIndex(index)
        if (stack != "") { 
            console.log("if--------------------",index, navigateUrl,"stack",stack,"naigation",props,)
            props.navigation.navigate(stack, { screen: navigateUrl })
         }
        else if(navigateUrl == 'MyCompliance'){
             props.navigation.navigate('Profile',{screen:navigateUrl})
        }
        else {
            console.log("else---------------------",index, navigateUrl,"stack",stack,"naigation",props)
             props.navigation.navigate(navigateUrl,{screen:navigateUrl} ) 
            }
    }


    const AllTabs = () => {
        return (
            <>
                {allTabs.length > 0 ? allTabs.map((item, index) => {
                    return (
                        <TouchableOpacity key={index} activeOpacity={1} style={{marginTop: 15 ,marginHorizontal:10,borderRadius:8,backgroundColor:'#007bbf'}} onPress={() => tabActionBtn(index, item.navigateUrl, item.stack)}>
                            <View style={{ width: "100%",alignItems:'center', padding: 15,flexDirection:"row",justifyContent:"center"}}>
                              <Text style={{ fontSize: normalizeSize(15), color:  "#FFF" }}>{item.name}</Text>
                              {item?.name === "Messages" && unReadMsgCount != 0?
                               <Badge value={unReadMsgCount} status="error" containerStyle={{marginLeft:5}}/>
                              :null}
                            </View>
                        </TouchableOpacity>
                    )
                }) : null
                }
            </>
        )
    }

    useEffect(() => { 
        // handleInit();
        hasLocationPermission() 
    }, [])

    useFocusEffect(
        React.useCallback(() => {
         handleInit();
        // Do something when the screen is focused
        return () => {};
        }, [isNetAvailable,props.navigation])
    );

    const handleInit = () => {
        if (newUSer) { callSendSignUpConfirmationEmailApi() }
        getmyWorkHistory()
        let user_data = store.getState().HomeDetails.UserDetails
        setState({ UserData: user_data })
        if (Object.keys(user_data).length == 0) { getUserDetails() }
        getCandidateStatus()
        uploadImageFun()
        getCandidateTimesheet()
        let Conn = isNetAvailable
        console.log("ConnisNetAvailable",Conn)
        if (!Conn) {
            updateSetClockObjOffline()
        }
        else{
           handleOfflineData()
        }
    }

    // useEffect(async() => {
    //   console.log("offline>>>>>>>>>>>>>>>>>>>>>>>>isNetAvailable>>>>>>>>>>",isNetAvailable)
    //     if (isNetAvailable) {
    //         console.log("offline>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    //         // return
    //         handleOfflineData()
    //     }
    //   }, [isNetAvailable])
      
      
      const offlineApiData = useSelector((state) => state.offlineApiStore.offlineApiData || []);
      console.log(offlineApiData,"offlineApiDataofflineApiData")
      
       const sendApiRequest = async (method, url, data) => {
        console.log(data,"datadatadata")
        const response = await CallPostRestApi(data, url).then(async res => {
          console.log('handleOFFLINE CLOCK InApi res :- ', res);
          if (res && res.success) {
          return res
          }
        })
        .catch(error => {
          console.log('handleOFFLINEClockInApi error :- ', error);
        });
        return response
      };
      
       const processOfflineData = async (offlineApiData) => {
        let clockInId = ''; // Variable to store clockInId
      
        for (const request of offlineApiData) {
            console.log(request,"requestrequestrequestrequestrequestrequest")
            if (request.method === 'POST' && request.url.includes('clockIn')) {
                // Handle clockIn request
                const clockInResponse = await sendApiRequest(request.method, request.url, request.data);
                console.log(clockInResponse,"clockInResponseclockInResponseclockInResponse")
                clockInId = clockInResponse?.clock_in_id; // Assuming response contains clock_in_id
            } else if (request.method === 'POST' && request.url.includes('clockOut')) {
                // Handle clockOut request
                if (clockInId) {
                    request.data.clock_in_id = clockInId; // Add clockInId to clockOut request
                }
                const clockOutResponse = await sendApiRequest(request.method, request.url, request.data);
                console.log(clockOutResponse,"clockOutResponseclockOutResponseclockOutResponse")
                clockInId = ''; // Reset clockInId after use
            }
        }
      };
      
      // Function to process offline data
      const handleOfflineData = async () => {
        if (offlineApiData.length > 0) {
            try {
                await processOfflineData(offlineApiData);
                await dispatch({ type: Types.CLEAR_OFFLINE_API, data:null})
                await dispatch({ type: Types.TODAY_SHIFTS_OBJ, data: [] })
                await getmyWorkHistory()
                // Clear the offlineApiData after successful processing if needed
                // Example: dispatch(clearOfflineData()); or similar action
            } catch (error) {
                console.error('Error processing offline data:', error);
            }
        }
      };

    const hasLocationPermission = async () => {
        if(Platform.OS ==='ios'){
            const status = await Geolocation.requestAuthorization('whenInUse')
            if(status == 'granted'){
                return true
            }else{
               return false
            }
        }
        if (Platform.OS === 'android' || Platform.Version < 23) {
            return true;
        }
        const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        );
        if (hasPermission) { return true; }
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

    const updateSetClockObjOffline = async()=>{
        const todayShift = store.getState().JobStore.TodayShiftObj
        const currentDate = moment().format('YYYY-MM-DD');
        // const copy_arr = todayShift[currentDate]
        const copy_arr = todayShift

        console.log("chla mai ya nhi--",copy_arr)
        const find_offline_obj = copy_arr && copy_arr.find((val) => (Working_status.NOTCLOCKEDIN !== val.shift_working_status) && Working_status.CLOCKEDOUT !== val.shift_working_status)
        console.log(copy_arr,"-offline cop",find_offline_obj)
        setClockObj(find_offline_obj)
        setTodayJobData(copy_arr)  
    }

    const callSendSignUpConfirmationEmailApi = async () => {
        setLoading(true)
        let URL = Config().sendSignUpConfirmationEmail
        await callGetRestApis(URL)
            .then((res) => {
                setLoading(false)
                    console.log('callSendSignUpConfirmationEmailApi res :- ', res)
                     dispatch({ type: Types.NEWUSER, data: false });
            })
            .catch((error) => {
                setLoading(false)
                console.log('callSendSignUpConfirmationEmailApi error :- ', error)
                // showMessage({ message: 'Error', description: error, type: "warning", });
            })
    }

    const getCandidateTimesheet = async () => {
        let SteetStoreData = store.getState().TimeSheetStore.AllTimeSheet
        if (LoginData && LoginData.token) {
            let URL = Config().getCandidateTimesheetBookings
            console.log('URL', URL);
            setLoading(true)
            await callGetRestApis(URL)
                .then((res) => {
                    if (res) {

                        setMyTimeSheetData(res)
                        let arrRes = res.map(item => {
                            let status = true, obj = {}

                            SteetStoreData && SteetStoreData.length && SteetStoreData.map(val => {
                                if (item.order_id == val.order_id) {
                                    obj = { ...item, savedTimeSheet: val.savedTimeSheet }
                                    status = false
                                }
                            })
                            if (status) { return { ...item, savedTimeSheet: [] } }
                            return obj
                        })
                        console.log('getCandidateTimesheetBookings Home arrRes :- ', arrRes)

                        dispatch({ type: Types.ALL_TIME_SHEET, data: arrRes })
                        let clockIn = 0
                        arrRes.map((i) => { if (i.clock_in == 1) clockIn = 1 })
                        setClock_in(clockIn)
                        // console.log('getCandidateTimesheetBookings Home obj :- ', arrRes)
                        console.log('getCandidateTimesheetBookings Home res :- ', res)

                    }
                    setLoading(false)

                })
                .catch((error) => {
                    setLoading(false)

                    console.log('getCandidateTimesheetBookings error :- ', error)
                    // showMessage({ message: 'Error', description: error, type: "warning", });
                })

        }

    }

    const getCandidateStatus = async () => {
        let URL = Config().getCandidateStatus
        console.log('URL', URL);
        setLoading(true)
        await callGetRestApis(URL)
            .then((res) => {
                setLoading(false)
                if (res) { setInAppMessage(res.status) }
                console.log('getCandidateStatus res :- ', res)

            })
            .catch((error) => {
                setLoading(false)
                console.log('getCandidateStatus error :- ', error)
                // showMessage({ message: 'Error', description: error, type: "warning", });
            })

    }

    const handleToggle = async () => {
        await setInAppMessage(!inAppMessage)
        updateCandidateStatus()

    }
    const updateCandidateStatus = async () => {
        setLoading(true)
        let formdata = new FormData();
        formdata.append("status", !inAppMessage ? 1 : 0),
            console.log('formdata', formdata);
        let Url = Config().updateCandidateStatus
        await globalPostApi(Url, formdata)
            .then((res) => {
                setLoading(false)
                console.log('updateCandidateStatus res :- ', res);
                showMessage({ message: 'Success', description: "Candidate status updated successfully.", type: "success", });

            })
            .catch((error) => {
                setLoading(false)
                console.log('updateCandidateStatus error :- ', error)
                // showMessage({ message: 'Error', description: error, type: "warning", });
            })

    }
   

    const options = {
        mediaType: 'photo',
        includeBase64: false,
        // maxHeight: 500,
        // maxWidth: 500,
    };

    const ChooseOption = () => {

        Alert.alert(
            'Alert',
            'Upload avatar?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Gallery',
                    onPress: () => requestGalleryPermission(),
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

     const requestGalleryPermission = () => {
        if (Platform.OS === 'android'&& Platform.Version < 33) {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: 'Gallery Permission',
                    message: 'App needs access to your gallery to upload images.',
                    buttonPositive: 'OK',
                },
            ).then((granted) => {
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getProductImages(true);
                } else {
                    console.log('Gallery permission denied');
                }
            });
        } else {
            getProductImages(true);
        }
    }

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
                if (FileSize && FileSize > 409600) {
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
        let Url = Config().uploadMyAvatar
        await globalPostApi(Url, formdata)
            .then((res) => {
                setLoading(false)

                if (res) {
                    console.log('uploadMyAvatar res :- ', res);
                    showMessage({ message: 'Success', description: 'Avatar Uploaded successfully.', type: "success", });
                    uploadImageFun()

                } else {
                    showMessage({ message: 'Error', description: 'Error in uploading image', type: "warning", });

                }
            })
            .catch((error) => {
                setLoading(false)
                console.log('uploadMyAvatar error :- ', error)
                // showMessage({ message: 'Error', description: error, type: "warning", });
            })

    }

    const uploadImageFun = () => {
        setLoading(true)
        return new Promise((RESOLVE, REJECT) => {
            // Fetch attachment
            RNFetchBlob.fetch('GET', Config().DownloadCandidateAvatar, { Authorization: `Bearer ${UserToken}` })
                .then((response) => {
                    let base64Str = response.data;
                    const imageBase64 = base64Str.includes('Unable to Download the Candidate Avatar') ? undefined : `data:image/png;base64,` + base64Str;
                    // Return base64 image
                    setImageBase64(imageBase64)
                    RESOLVE(imageBase64)
                    setLoading(false)
                    dispatch({ type: Types.PROFILE_PIC, data: imageBase64 })
                    // console.log('imageBase64', imageBase64);
                    // console.log('base64Str.error', base64Str.error);
                })

        }).catch((error) => {
            // error handling
            console.log("Error: ", error)
            setLoading(false)
        });

    }

    const CheckJobDateTime = async (paramArr) => {
        let todayShift = store.getState().JobStore.TodayShiftObj
        console.log("tidayshift store--",todayShift);
        console.log("paramArr--",paramArr);
        
        if (paramArr && paramArr.length > 0) {
            const currentDate = moment().format('YYYY-MM-DD');
            const job_arr = [], job_obj = {}
            for (let i = 0; i < paramArr.length; i++) {
                let item = paramArr[i];
                if (item['start_date'] != "0000-00-00" && item['finish_date'] != "0000-00-00") {
                    const isPublished = item?.is_published && item?.is_published == 1     
                    if(isPublished){
                        job_arr.push(item);
                        getClockIns(item.order_id);
                    }
                }
            }
            console.log("job_arrlen",job_arr);

            if (job_arr.length) {
                // if (todayShift && Object.keys(todayShift).length > 0) {
                //     let check_date = todayShift.hasOwnProperty(currentDate)
                //     let copy_arr = todayShift[currentDate]
                //     let find_obj = copy_arr && copy_arr.find((val) => (Working_status.NOTCLOCKEDIN !== val.shift_working_status) && Working_status.CLOCKEDOUT !== val.shift_working_status)
                //     console.log(find_obj,"Finding working-----------------",check_date,"--------=============<<<<<<>>>>>>",copy_arr)
                //     if (find_obj) {
                //          console.log("Checking checking checking----------------------")
                //          getClockIns(find_obj.order_id)
                //     }
                //     console.log('find_obj', find_obj);
                //     setClockObj(find_obj)
                //     if (!check_date) {
                //         console.log("if check in-->"); 
                //         let find_two_day_working = job_arr && job_arr.find((val) => (Working_status.NOTCLOCKEDIN !== val.shift_working_status) && Working_status.CLOCKEDOUT !== val.shift_working_status)
                //         console.log(find_two_day_working,"Finding two day working----api:")
                //         if (find_two_day_working) {
                //             console.log("Checking checking checking----------------------")
                //             getClockIns(find_two_day_working.order_id)
                //         }
                //         console.log('find_working--2', find_two_day_working);
                //         setClockObj(find_two_day_working)

                //         let copy_obj = {}
                //         copy_obj[currentDate] = job_arr
                //         dispatch({ type: Types.TODAY_SHIFTS_OBJ, data: copy_obj })
                //     } else {
                //         console.log("if not check in-->");
                //         let copyArr = todayShift[currentDate]
                //         let new_Arr = []
                //         job_arr.forEach(item => {
                //             let xyz = todayShift[currentDate] && todayShift[currentDate].find((val) => item.order_id == val.order_id)
                //             if (xyz && xyz.order_id) {
                //                 copyArr.forEach(it => {
                //                     if (xyz.order_id == it.order_id) {
                //                         console.log("updating existing shift status-->",it.shift_working_status);
                //                         new_Arr.push({ ...item, shift_working_status: it.shift_working_status })
                //                     }
                //                 })
                //             }
                //             else { new_Arr.push({ ...item }) } //data from api
                //         })
                //         let copy_obj1 = {}
                //         copy_obj1[currentDate] = new_Arr
                //         dispatch({ type: Types.TODAY_SHIFTS_OBJ, data: copy_obj1 })
                //     }
                // } else {
                //     // initial login status update
                //     let find_working = job_arr && job_arr.find((val) => (Working_status.NOTCLOCKEDIN !== val.shift_working_status) && Working_status.CLOCKEDOUT !== val.shift_working_status)
                //     console.log(find_working,"Finding working----api:")
                //     if (find_working) {
                //          console.log("Checking checking checking----------------------")
                //          getClockIns(find_working.order_id)
                //     }
                //     console.log('find_working--2', find_working);
                //     setClockObj(find_working)
                //     job_obj[currentDate] = job_arr
                //     dispatch({ type: Types.TODAY_SHIFTS_OBJ, data: job_obj })
                // }
                console.log("INSIDE JOBARRAY");
                
                 if (todayShift && todayShift?.length > 0) {
                     console.log("INSIDE todayShift");
                    let copy_arr = todayShift
                    let find_obj = copy_arr && copy_arr.find((val) => (Working_status.NOTCLOCKEDIN !== val.shift_working_status) && Working_status.CLOCKEDOUT !== val.shift_working_status)
                    console.log(find_obj,"Finding working-----------------","--------=============<<<<<<>>>>>>",copy_arr)
                    if (find_obj) {
                         console.log("Checking checking checking----------------------")
                        // getClockIns(find_obj.order_id)
                        // setClockObj(find_obj)
                        // dispatch({ type: Types.TODAY_SHIFTS_OBJ, data: copy_arr })
                         const find_shift_working = job_arr && job_arr.find((val) => val?.order_id == find_obj.order_id && val?.is_auto_clocked_out == 0)
                         if(find_shift_working){
                           getClockIns(find_obj.order_id)
                           setClockObj(find_obj)
                           dispatch({ type: Types.TODAY_SHIFTS_OBJ, data: copy_arr })
                         }
                         else{
                            // shift gets auto clocked out
                            console.log("find_shift_working",find_shift_working);
                            
                         }
                    }
                    else {
                        console.log("ELSE API CHECK IN-->");
                        let find_working_api = job_arr && job_arr.find((val) => (Working_status.NOTCLOCKEDIN !== val.shift_working_status) && Working_status.CLOCKEDOUT !== val.shift_working_status)
                        if (find_working_api) {
                            getClockIns(find_working_api.order_id)
                        }
                        console.log('find_working_api2', find_working_api);
                        setClockObj(find_working_api)
                        // job_obj[currentDate] = job_arr
                        dispatch({ type: Types.TODAY_SHIFTS_OBJ, data: job_arr })
                    }
                } else {
                    // initial login status update
                    let find_working = job_arr && job_arr.find((val) => (Working_status.NOTCLOCKEDIN !== val.shift_working_status) && Working_status.CLOCKEDOUT !== val.shift_working_status)
                    console.log(find_working,"Finding working----api:")
                    if (find_working) {
                         console.log("Checking checking checking----------------------")
                         getClockIns(find_working.order_id)
                    }
                    console.log('find_working--2', find_working);
                    setClockObj(find_working)
                    // job_obj[currentDate] = job_arr
                    dispatch({ type: Types.TODAY_SHIFTS_OBJ, data: job_arr })
                }
            }
            setClockInLoader(false)
            setTodayJobData(job_arr)
        }
    }

    const getmyWorkHistory = async () => {
        setLoading(true)
        setClockInLoader(true)
        let URL = Config().myShiftToday
        console.log('URL', URL);
        await callGetRestApis(URL)
            .then(async(res) => {          
                getBadgeCountApi()
                if (res) {
                    console.log(res,"Shift Data response")
                    // let Arr = res.map((item) => ({ ...item, shift_working_status: Working_status.NOTCLOCKEDIN }))
                    // setJobData(Arr)
                    // console.log("Jobdata",Arr);
                    // CheckJobDateTime(Arr)
                    setJobData(res)
                    CheckJobDateTime(res)
                }
                setClockInLoader(false)
            })
            .catch((error) => {
                setLoading(false)
                setClockInLoader(false)
                console.log('myShiftToday error :- ', error)
                // showMessage({ message: 'Error', description: error, type: "warning", });
            })
    }
    
    const getUserDetails = async () => {
        if (LoginData && LoginData.token) {
            let URL = Config().getDetails
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
                    // showMessage({ message: 'Error', description: error, type: "warning", });
                })

        } else {

        }
    }

    const { UserData, ImgUri } = state
    let name = ''
    if (UserData) {
        if (UserData.first_name) { name = UserData.first_name }
        if (UserData.last_name) { name = name + ' ' + UserData.last_name }
    }

    const handleStatus = (type,ClockData) => {
        let todayShift = store.getState().JobStore.TodayShiftObj
        const currentDate = moment().format('YYYY-MM-DD');
        // let shift_arr = todayShift[currentDate]
        let shift_arr = todayShift
        let arr = shift_arr?.map((el, index) => {
            if (ClockData.order_id == el.order_id) {
                el.shift_working_status =type 
            }
            return el
        })
        let copy_obj = todayShift
        // copy_obj[currentDate] = arr
        dispatch({ type: Types.TODAY_SHIFTS_OBJ, data: arr })
    }

    const getClockIns = async (orderId) => {
        console.log(orderId,"------orderId<<<<<<<<<>>>>>>>>>>>>>>>>>>")
        setLoading(true)
        let URL = Config().getClockIns
        let data = {
            "order_id": orderId ? orderId : 0,
            "week_ending": moment().clone().endOf('isoWeek').format("YYYY-MM-DD"),
        }
        await callGetBodyApis(URL, data)
            .then(async (res) => {
                setLoading(false)
                if (res && res.length) {
                    res.forEach(el => {
                        dispatch({ type: Types.OFF_CLOCK_IN_OBJ, data:[el] })
                        let today = moment().format('YYYY-MM-DD');
                        let clockTime = moment(el.time_in).format('YYYY-MM-DD')                
                        // if (today == clockTime) {
                            if (orderId == el.order_id) {                    
                                setclockInObj(el)
                                if ((today == clockTime) && el.time_out) {
                                    // handleStatus(Working_status.CLOCKEDOUT,el) //data from api
                                }
                                else if ((today == clockTime))
                                {
                                    // handleStatus(Working_status.NOTCLOCKOUT,el) //data from api
                                }
                            }
                        // }
                    });
                }
                console.log('getClockIns res :- ', res)
            })
            .catch((error) => {
                setLoading(false)
                console.log('getClockIns error :- ', error)
                // showMessage({ message: 'Error', description: error, type: "warning", });
            })

    }

    const handleClockOption = () => {
        if (clockObj) {
            let jobdata = { myjob: clockObj, clockData: clockInObj?clockInObj:allOfflineClockin }
            props.navigation.navigate('ClockOutScreen', { jobdata: jobdata })
        } else {
            const currentDate = moment().format('YYYY-MM-DD');
            // props.navigation.navigate('JobShifts', { JobShiftData: props.TodayShiftObj[currentDate] })
            props.navigation.navigate('JobShifts', { JobShiftData: props.TodayShiftObj })
        }
    }

    const renderClockText = () => {
        return (
            <>
                {Array.isArray(TodayJobData) && TodayJobData?.length > 0 ?
                    <TouchableOpacity onPress={() =>{
                        clockObj?.shift_working_status == 'On Break' || clockObj?.shift_working_status == 'Clock Out' ||clock_in || clockInValue ? handleClockOption():null
                        }}
                        style={{
                            borderColor: clockObj?.shift_working_status == 'On Break' ? Colors.ThemeBlue : clockObj?.shift_working_status == 'Clock Out' ? Colors.ThemeRed : clock_in || clockInValue ? Colors.APP_COLOR : Colors.Trans,
                            width: screenwidth / 1.5, alignSelf: 'center', padding: normalizeSize(10), borderWidth: 1, borderRadius: 20
                        }}>
                        <Text onPress={() =>{ 
                            clockObj?.shift_working_status == 'On Break' || clockObj?.shift_working_status == 'Clock Out' ||clock_in || clockInValue ?handleClockOption():null
                        }}
                            style={{
                                color: clockObj?.shift_working_status == 'On Break' ? Colors.ThemeBlue : clockObj?.shift_working_status == 'Clock Out' ? Colors.ThemeRed : clock_in || clockInValue ? Colors.APP_COLOR : Colors.Trans,
                                fontSize: normalizeSize(15), fontWeight: '700', textAlign: 'center'
                            }}>{clockObj && clockObj.shift_working_status ? clockObj.shift_working_status : clock_in || clockInValue ? 'Clock In' : ''}</Text>
                    </TouchableOpacity>
                    : null
                }
            </>
        )
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            {loading ? <Loader /> : null}
            <View style={styles.container}>
                <ScrollView>
                    <View style={{ justifyContent: "center", alignItems: "center", flex: 1,paddingTop: 60, paddingBottom: 60 }}>
                        <TouchableOpacity onPress={ChooseOption} style={{ backgroundColor: "#007bbf", borderRadius: normalizeSize(200), width: normalizeSize(100), height: normalizeSize(100), justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                style={{ width: normalizeSize(95), height: normalizeSize(95), borderRadius: normalizeSize(160), }}
                                resizeMode={'cover'}
                                source={ImgUri && ImgUri.uri ? { uri: ImgUri.uri } : !UserToken ? require('../Assets/Icons/man.jpg') : ImageBase64 ? { uri: ImageBase64 } : require('../Assets/Icons/man.jpg')} />
                        </TouchableOpacity>
                        <View style={{ alignItems: "center", paddingTop: 10 }}>
                            <Text style={{ fontSize: normalizeSize(15) }}>
                                Welcome,
                            </Text>
                            <Text style={{ fontSize: normalizeSize(15), fontWeight: "bold" }}>
                                {name}
                            </Text>
                        </View>
                    </View>

                    <View style={{ width: '100%', paddingHorizontal: 20, marginBottom: 50 }}>
                        {/* <View style={{ marginTop: -28, marginBottom: 30, alignItems: "center" }}>
                            <TouchableOpacity onPress={() => handleToggle()}
                                style={{ width: screenwidth / 1.5, height: normalizeSize(50), backgroundColor: inAppMessage == 1 ? '#22D2B4' : Colors.ThemeRed, alignItems: 'center', justifyContent: 'center', borderRadius: 30 }} >
                                <Text style={{ color: 'white', fontSize: normalizeSize(17), fontWeight: '600' }}>{inAppMessage ? 'Available Now' : 'Not Available'}</Text>
                            </TouchableOpacity>
                        </View> */}
                        {clockInLoader ?
                         <View style={{}}>
                         <Text style={styles.fetchText}>Fetching clock in details</Text>
                         {/* <ActivityIndicator size="small" color={'#1c78ba'}/> */}
                     </View>:
                        renderClockText()
                        }
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
    },
    fetchText:{
        color:"black",
        fontSize:15,
        fontWeight:"500",
        alignSelf:"center",
        marginVertical:10
    }
});


const mapStateToProps = (state) => {
    const { JobStore: { TodayShiftObj } } = state;
    return { TodayShiftObj };
};

const mapDispatchToProps = dispatch => { return { DispatchTodayShiftObj: data => dispatch({ type: Types.TODAY_SHIFTS_OBJ, data: data }) } };
export default connect(mapStateToProps, mapDispatchToProps)(Home);