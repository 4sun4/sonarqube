import React, { useState, useEffect, useRef } from 'react'
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, ScrollView, Image,Alert, Linking } from 'react-native'
import MapView, { Marker, ProviderPropType, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import Colors from '../Util/Colors';
import MapViewDirections from 'react-native-maps-directions';
import Config, { GOOGLE_MAPS_APIKEY } from '../Util/Config';
import moment from 'moment'
import { getDistance } from 'geolib';
import { checkPermission } from '../Screens/permission';
import Geolocation from 'react-native-geolocation-service';
import { PERMISSIONS, request } from "react-native-permissions";
import { callGetBodyApis, CallPostRestApi } from '../Services/Api';
import ShiftNotes from '../Components/Popups/ShiftNotes';
import Loader from '../Components/Loader';
import { CheckNet, checkUserWithInRadius, getCurrentLatLong, getCurrentTime, normalizeSize } from '../Util/CommonFun';
import { showMessage, hideMessage } from "react-native-flash-message";
import { connect, useDispatch, useSelector } from 'react-redux'
import Types from '../redux/Types';
import { store } from '../redux/Store';
import AddShiftNotes from '../Components/Popups/AddShiftNotes';
import { Working_status } from '../Util/DumyJson';
import { Icon } from 'react-native-elements'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Feather from 'react-native-vector-icons/Feather';
import ConfirmClockInOut from './ConfirmClockInOut';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;

const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const clockgreen = require('../Assets/Icons/clockgreen.png')
const clockRed = require('../Assets/Icons/clockRed.png')
const clockblue = require('../Assets/Icons/clockblue.png')

const ClockOutScreen = (props) => {
    const { route, navigation } = props
    console.log(props,"prooooooopppppppppssssssss")
    const [JobData, setJobData] = useState(null)
    const [ClockData, setClockData] = useState(null)
    const [disCovered, setDisCovered] = useState(null)
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const mapRef = useRef(null);

    const [shiftNotes, setShiftNotes] = useState('');
    const [addNotes, setAddNotes] = useState('');

    const [Lat, setLat] = useState(0.00)
    const [Long, setLong] = useState(0.00)
    const [checkLocation, setCheckLocation] = useState(false)
    const [loading, setLoading] = useState(false)
    const [timeSt, setTimeSt] = useState('')
    const [allClockInData, setAllClockInData] = useState([]);
    const dispatch = useDispatch()
    const [clockInStoreData, setClockInStoreData] = useState([])
    const [breakStart, setBreakStart] = useState({
        isStart:false,
        breakStartTime:"",
    });
    const [orderBreaks, setOrderBreaks] = useState([])
         const allOfflineClockin = useSelector((state) => state.offlineApiStore.offlineApiData || []);
         const offlineClockinObj = useSelector((state) => state.offlineApiStore.offlineClockinObj || []);
console.log(allOfflineClockin,"allOfflineClockinallOfflineClockin",route?.params?.jobdata?.myjob?.order_id)
let data = allOfflineClockin?.length>0? allOfflineClockin && allOfflineClockin[allOfflineClockin?.length-1]?.data:offlineClockinObj[0]
let ClockOffStoreData = [
    {
        "clockin_id":data?.clockin_id?data?.clockin_id: "",
        "order_id": route && route?.params?route?.params?.jobdata?.myjob?.order_id : data?.order_id,
        "week_ending": data?.week_ending,
        "time_in": data?.clock_in_time?data?.clock_in_time:data?.time_in,
        "time_out": null,
        "ip_in": "",
        "ip_out": null,
        "latitude_in": data?.latitude_in,
        "longitude_in": data?.longitude_in,
        "latitude_out": null,
        "longitude_out": null,
        "note": null,
        "geolocate_error_in": null,
        "geolocate_error_out": null,
        "created_by": "",
        "created_at": "",
        "modified_by": "Auto",
        "modified_on": "",
        breaks: [], 
        shiftnote: "" 
    }]
    const [coordinates, setCoordinates] = useState([
        { latitude: 48.8587741, longitude: 2.2069771, },
        { latitude: 48.8323785, longitude: 2.3361663, },
    ]);
    const [region, setRegion] = useState({
        latitude: coordinates[0].latitude,
        longitude: coordinates[0].longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    })


    const toggleOverlay = () => { setShow(false) };


    React.useEffect(() => {
        getRouteData()

    }, [route])
console.log(allClockInData,"allClockInDataallClockInData")

    const getRouteData = async() => {
        console.log("navigation", navigation, "route testing log", route)
        if (route && route.params) {
            let rout = route.params
            let jobData = rout.jobdata && rout.jobdata != "" ? rout.jobdata : ""
            let sname = rout.ScreenName && rout.ScreenName != "" ? rout.ScreenName : ""
            if (jobData) {
                const { clockData, myjob } = jobData
                setJobData(myjob)
                getClockIns(myjob)
                let Conn = await CheckNet();
                if (!Conn) {
                    setClockData(ClockOffStoreData[0])
                }else{
                    setClockData(clockData)

                }


            }

        }
    }

console.log(orderBreaks,"orderBreaksorderBreaksorderBreaks",ClockData)

    const handleJobLatLong = async (myjob, clockData) => {
        console.log('myjob', myjob, 'clockData', clockData);
        let joblat = myjob && myjob.latitude ? Number(myjob.latitude) : 0.00,
            joblong = myjob && myjob.latitude ? Number(myjob.longitude) : 0.00,
            clocklat = clockData && clockData.latitude_in ? Number(clockData.latitude_in) : 0.00,
            clocklong = clockData && clockData.longitude_in ? Number(clockData.longitude_in) : 0.00
        setRegion({ ...region, latitude: joblat, longitude: joblong })
        const currentRegion = { latitude: joblat, longitude: joblong, latitudeDelta: 0.01, longitudeDelta: 0.01, }
        if (mapRef?.current?.animateToRegion) {mapRef.current.animateToRegion(currentRegion, 3 * 1000);}

        setCoordinates([{ latitude: joblat, longitude: joblong }, { latitude: clocklat, longitude: clocklong }])
        let totalDis = getDistance(
            { latitude: clocklat, longitude: clocklong, },
            { latitude: joblat, longitude: joblong },
        );
        console.log('totalDis', totalDis);
        setDisCovered(totalDis / 1000)

    }

    const getLocation = async () => {
        Geolocation.getCurrentPosition(
            (position) => {
                console.log(position);
                let myLat = parseFloat(position.coords.latitude);
                let myLong = parseFloat(position.coords.longitude);
                setLat(myLat); setLong(myLong)
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
                if (error.message && error.message.includes('Location permission not granted.')) {
                    //  handleLocationPopup()
                }
            },
            { enableHighAccuracy: true, timeout: 5000, }
        );
    };
    const checkForPermissions = async () => {
        const permissions =
            Platform.OS === 'ios'
                ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION

        // Call our permission service and check for permissions
        const isPermissionGranted = await checkPermission(permissions);

        return isPermissionGranted;
    }


    const checkUserWithInRadiusFuc = async () => {
        try {
          let check_ = await checkForPermissions();
          setCheckLocation(check_);
          if (!check_) {
            Alert.alert(
              "Permission Request",
              "Please allow permission to access the Location.",
              [
                {
                  text: "Go to Settings",
                  onPress: () => {
                    Linking.openSettings();
                  },
                },
                { text: "Cancel", style: "cancel" },
              ],
              { cancelable: false },
            );
            return {
              isInRadius: false,
              latitude: "",
              longitude: "",
            };
          }
          const currentLocation = await getCurrentLatLong();
          console.log("currentLocation", currentLocation, "\n", {
            radius: JobData?.job_radius,
          });
          setLat(currentLocation.latitude);
          setLong(currentLocation.longitude);
          const isWithInGivenRadius = await checkUserWithInRadius(
            {
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            },
            { latitude: JobData?.latitude, longitude: JobData?.longitude },
            JobData?.job_radius,
          );
          if (!isWithInGivenRadius) {
            showMessage({
              message: "Warning",
              description: "You are not within the Geofence Radius for this shift. Please move to within range and try again. To see information about the clock in location, click back to the shift details and click on the Info icon.",
              type: "warning",
            });
            return {
              isInRadius: false,
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            };
          }
          return {
            isInRadius: true,
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          };
        } catch (error) {
          return {
            isInRadius: false,
            latitude: "",
            longitude: "",
          };
        }
      };      

    React.useEffect(async () => {
        // 2020-04-13 09:30:34
        let check_ = await checkForPermissions()
        setCheckLocation(check_)
        if (check_) { getLocation() }
        else {
            Alert.alert('Permission Request', 'Please allow permission to access the Location.',
                [{ text: 'Go to Settings', onPress: () => { Linking.openSettings() } }, { text: 'Cancel', style: 'cancel', }],
                { cancelable: false })
        }

    }, [])

    const SubmitNotes = (item) => {
        // if (!shiftNotes) {
        //     alert('Please add notes first!')
        // } else { clockOutApiCall(item, 'save') }
    }

    const SkipNotes = () => { 
        // clockOutApiCall("skip") 
        setShow1(true)
    }


    const handleClockOutApi = async () => {
        console.log(ClockData,"--------------------")

        const breakTempData = [...orderBreaks]
        const breakData = breakTempData.pop()
        console.log(breakData,"----breakData----------------")

        const lastBreakFinishTime = moment(breakData?.finish);
        let twoMinAfterBreak = lastBreakFinishTime.clone().add(2, 'minutes');

        let twoMin = moment(ClockData.time_in).add(2, 'minutes').format('HH:mm:ss');
        let check = (new Date("01/01/2000 " + twoMin) <= new Date("01/01/2000 " + getCurrentTime()))

        const clockIn = moment(ClockData.time_in);
        const twoMinutesAfter = clockIn.clone().add(2, 'minutes');
        const now = moment();

        if (breakData?.finish && now.isBefore(twoMinAfterBreak)) {
            alert('Clock-out is not permitted within 2 minutes of ending a break.')
            return;
         }

        else if (now.isBefore(twoMinutesAfter)) {
            alert('Clock-out is not permitted within 2 minutes of clock-in.')
            return;
         }
        // if (!check) {
        //     alert('Clock out time have to be more than 2 min of clock in.')
        // } 
        
        else {
            if (JobData.finish_time) {
                let fiveMin = 300000
                let finishTime = new Date("01/01/2000 " + JobData.finish_time)
                let current = new Date("01/01/2000 " + getCurrentTime())
                console.log('current', (finishTime - current) < fiveMin, 'finishTime',(finishTime - current) > 0);
                if (finishTime.getTime() === current.getTime()) {
                     setShow(true)
                     return
                }
                else if (((finishTime - current) < fiveMin && (finishTime - current) > 0)){
                    setShow(true)
                    return
                }
                else if (current > finishTime) {
                    setTimeSt('Late'); 
                    setShow(true)
                } else { 
                    setTimeSt('Early'); 
                    setShow(true) 
                }

            } else {

            }
        }
    }

    const clockOutApiCall = async (type) => {
        const userRadiusData = await checkUserWithInRadiusFuc();
        if(!userRadiusData.isInRadius) {
            return;
        }
        let body = {
            "clock_in_id": ClockData.clockin_id,
            // "clock_in_id": 164,
            "clock_out_time": moment().format("YYYY-MM-DD HH:mm:ss"),
            "latitude_out": userRadiusData.latitude, // optional
            "longitude_out": userRadiusData.longitude, // optional
            "note": addNotes, //optional
            "clockin_breaks":orderBreaks?orderBreaks:[],
            "order_id": ClockData?.order_id ? ClockData?.order_id : 0,
            // "order_id": 1212,
        }
        setLoading(true)

        var URL = Config().clockOut
       
        console.log(body,URL,"============clockout breks",addNotes,type,shiftNotes)
        let Conn = await CheckNet();
        if(!Conn){

        dispatch({ type: Types.OFFLINE_API_SAVE, data: {
            method: 'POST',
            url: URL,
            data:body
          } })
          showMessage({ message: 'Success', description: 'Clocked Out Successfully.', type: 'success', });
          
          await handleEndBreak('clockout')
          await handleStatus(Working_status.CLOCKEDOUT);
          dispatch({ type: Types.CLOCK_IN_LIST, data: [] })
          setTimeout(() => { setLoading(false) ,props.navigation.navigate('Home')}, 300);
        }else{
            await CallPostRestApi(body, URL)
            .then(async (res) => {
                console.log('handleClockOutApi res :- ', res);
                setLoading(false)
                if (res && res.success) {
                    showMessage({ message: 'Success', description: 'Clocked Out Successfully.', type: 'success', });
                    let rout = route.params
                    let jobData = rout.jobdata && rout.jobdata != "" ? rout.jobdata : ""
                    const { clockData, myjob } = jobData
                    await getClockIns(myjob)
                    await handleEndBreak('clockout')
                    await handleStatus(Working_status.CLOCKEDOUT);
                    dispatch({ type: Types.CLOCK_IN_LIST, data: [] })
                    setTimeout(() => { props.navigation.navigate('Home')}, 300);

                } else if (res && res.error) {
                    alert(res.error_message)
                }

            })
            .catch((error) => {
                setLoading(false)
                console.log('handleClockOutApi error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });

            })
        }
      
    }


    const getClockIns = async (myjob) => {
        const orderId = myjob.order_id
        let ClockStoreData = store.getState().JobStore.AllClockInData
        setClockInStoreData(ClockStoreData)

        let URL = Config().getClockIns
        setLoading(true)
        let data = {
            "order_id": orderId ? orderId : 0,
            "week_ending": moment().clone().endOf('isoWeek').format("YYYY-MM-DD"),
        }
        let Conn = await CheckNet();
        if (!Conn) {
            let data = allOfflineClockin && allOfflineClockin?.data
            let ClockStoreData = props.AllClockInData && props?.AllClockInData.length>0 ?props?.AllClockInData?.slice(0, 1):ClockOffStoreData
            console.log(ClockStoreData,"i am runnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn")
            dispatch({ type: Types.CLOCK_IN_LIST, data: ClockStoreData })
            setLoading(false)
        }else{
            await callGetBodyApis(URL, data)
            .then(async (res) => {
                setLoading(false)
                if (res && res.length) {
                    console.log(res,"get clock in in clocut")
                    let result = [], abc = [], copyArr = ClockStoreData
                    setAllClockInData(res)
                    if (ClockStoreData.length) {
                        res.forEach(item => {
                            let today = moment().format('YYYY-MM-DD');
                            let clockTime = moment(item.time_in).format('YYYY-MM-DD')
                             setClockData(item); 
                             handleJobLatLong(myjob, item)
                            // if (today == clockTime) {  }
                            let xyz = ClockStoreData.find((val) => item.clockin_id == val.clockin_id)
                            if (xyz && xyz.clockin_id) {
                                copyArr = copyArr.map(it => {
                                    if (xyz.clockin_id == it.clockin_id) {
                                        it = { ...item, breaks: xyz.breaks && xyz.breaks.length ? xyz.breaks : [], shiftnote: xyz.shiftnote ? xyz.shiftnote : '' }
                                    }
                                    return it
                                })
                            }
                            else { copyArr.push({ ...item, breaks: [], shiftnote: "" }) }
                        })
                        dispatch({ type: Types.CLOCK_IN_LIST, data: copyArr })
                        console.log('resultresultresultresult', result, 'abc', copyArr);
                    } else {
                        result = []
                        result = res.map(el => {
                            if (orderId == el.order_id) {
                                let today = moment().format('YYYY-MM-DD');
                                let clockTime = moment(el.time_in).format('YYYY-MM-DD')
                                //  setClockData(el)
                                // if (today == clockTime) {
                                    handleJobLatLong(myjob, el)
                                    setClockData(el)
                                    return { ...el, breaks: [], shiftnote: '' }
                                // }
                            }
                            return { ...el, breaks: [], shiftnote: '' }
                        });
                        dispatch({ type: Types.CLOCK_IN_LIST, data: result })
                    }
                }
                console.log('getClockIns res :- ', res)

            })
            .catch((error) => {
                setLoading(false)
                console.log('getClockIns error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })
        }
      

    }




    useEffect(() => {
        setBreakStart({isStart:false, breakStartTime:""})
        console.log('clockData-------------', ClockData,ClockOffStoreData[0]);
        let ClockDataNew = ClockData?ClockData:ClockOffStoreData[0]

        if (ClockDataNew) {
            props?.AllClockInData?.slice(0, 1).map(el => {
                if (ClockDataNew.order_id == el.order_id) {
                    setOrderBreaks(el?.breaks)
                    if (el?.breaks?.length) {
                        el.breaks.map(brkItm => {
                            if (brkItm && brkItm.finish == "") {
                                console.log('BRKITM',brkItm)
                                
                                setBreakStart({isStart:true,breakStartTime:brkItm?.start}) }
                        })
                    }
                }
            });
        }

    }, [props.AllClockInData])




    const handleStartBreak = async() => {
        const userRadiusData = await checkUserWithInRadiusFuc();
        if(!userRadiusData.isInRadius) {
            return;
        }
        let ClockStoreData = store.getState().JobStore.AllClockInData
        // let Conn = await CheckNet();
        // if (!Conn) {
        //     let data = allOfflineClockin && allOfflineClockin?.data
        //      ClockStoreData = props.AllClockInData && props.AllClockInData.length>0?props?.AllClockInData?.slice(0, 1):ClockOffStoreData
        // } 
        console.log("=============",ClockOffStoreData,props.AllClockInData,'ClockStoreData i am running', ClockStoreData,ClockStoreData.length,ClockData);
        console.log(ClockData.order_id,"iiiiiiiiiiii",ClockData)
        const clockIn = moment(ClockData.time_in);
        const twoMinutesAfter = clockIn.clone().add(2, 'minutes');
        const now = moment();

        if (now.isBefore(twoMinutesAfter)) {
            alert('Breaks cannot be started within 2 minutes of clock-in.');
            return;
         }
        if (ClockStoreData.length) {
            setLoading(true)
            let clockarr = ClockStoreData.map(el => {
                let today = moment().format('YYYY-MM-DD');
                let clockTime = moment(el.time_in).format('YYYY-MM-DD')

                // if (today == clockTime) {
                    console.log( ClockData.order_id," i am in step 1",el.order_id)
                    if (ClockData.order_id == el.order_id) {
                        console.log("i am in step 2")
                        if (el.breaks.length) {
                            let brkSt = false
                            el.breaks.map((brkItm, Ind) => {
                                if (brkItm && brkItm.finish) { brkSt = true }
                            })
                            if (brkSt) {
                                return {
                                    ...el, breaks: [...el.breaks, {
                                        start: moment().format('YYYY-MM-DD HH:mm:ss'),
                                        finish: ''
                                    }]
                                }
                            }
                            return el
                        }
                        else {
                            return {
                                ...el, breaks: [{
                                    start: moment().format('YYYY-MM-DD HH:mm:ss'),
                                    finish: ''
                                }]
                            }
                        }
                    }
                // }

                return el
            });
            console.log('clockarr', clockarr);
            dispatch({ type: Types.CLOCK_IN_LIST, data: clockarr })
            handleStatus(Working_status.ONBREAK)
        }
        setLoading(false)
    }

    const handleEndBreak = async(type = '') => {
        const userRadiusData = await checkUserWithInRadiusFuc();
        if(!userRadiusData.isInRadius) {
            return;
        }
        let ClockStoreData = store.getState().JobStore.AllClockInData
        if (ClockStoreData.length) {
             setLoading(true)
            let clockarr = ClockStoreData.map(el => {
                let today = moment().format('YYYY-MM-DD');
                let clockTime = moment(el.time_in).format('YYYY-MM-DD')
                // if (today == clockTime) {
                    if (ClockData.order_id == el.order_id) {
                        if (el.breaks.length) {
                            const brk = el.breaks.map((brkItm, Ind) => {
                                if (brkItm && !brkItm.finish) {
                                    // let twoMin = moment(brkItm.start).add(2, 'minutes').format('HH:mm:ss');
                                    // let check = (new Date("01/01/2000 " + twoMin) <= new Date("01/01/2000 " + getCurrentTime()))

                                    // if (!check) {
                                    //     alert('Breaks cannot be ended within 2 minutes of starting.')
                                    // } 
                                    const brkStartMoment = moment(brkItm.start);
                                    const twoMinutesAfterBrek = brkStartMoment.clone().add(2, 'minutes');
                                    const now = moment();

                                    if (now.isBefore(twoMinutesAfterBrek)) {
                                        alert('Breaks cannot be ended within 2 minutes of starting.')
                                    }
                                    else {
                                        handleStatus(Working_status.NOTCLOCKOUT)
                                        let subTwoMin = moment().subtract(5, 'minutes').format('YYYY-MM-DD HH:mm:ss');
                                        return {
                                            ...brkItm,
                                            finish: type == 'clockout' ? subTwoMin : moment().format('YYYY-MM-DD HH:mm:ss')
                                        }
                                    }
                                }
                                return brkItm
                            })
                            return { ...el, breaks: brk }
                        }
                    }
                // }
                return el
            });
            console.log('clockarr', clockarr);
            dispatch({ type: Types.CLOCK_IN_LIST, data: clockarr })
        }
         setLoading(false)
    }
console.log(addNotes)

    const handleSubmitNotes = () => {
        if (ClockData && props?.AllClockInData?.length) {
            let arr = props?.AllClockInData?.map(el => {
                let today = moment().format('YYYY-MM-DD');
                let clockTime = moment(el?.time_in).format('YYYY-MM-DD')
                // if (today == clockTime) {
                    if (ClockData?.order_id == el?.order_id) {
                        return { ...el, shiftnote: el?.shiftnote ? el?.shiftnote + ' ' + addNotes : addNotes }
                    }
                // }
                return el
            });

            console.log('arrarr', arr);
            dispatch({ type: Types.CLOCK_IN_LIST, data: arr })
            setShow1(false)
            // calling clock out api after saving shift note
            clockOutApiCall("skip") 
        }

    }

    const handleSkipNotes =()=>{
        setShow1(false)
        clockOutApiCall("skip")
    }


    const handleStatus = (type) => {
        const currentDate = moment().format('YYYY-MM-DD');
        // let shift_arr = props.TodayShiftObj[currentDate]
        let shift_arr = props.TodayShiftObj

        console.log(shift_arr,"shift arr wale bhai",ClockData)
        let arr = shift_arr?.map((el, index) => {
            if (ClockData.order_id == el.order_id) {
                el.shift_working_status = type
            }
            return el
        })
        let copy_obj = props.TodayShiftObj
        // copy_obj[currentDate] = arr
        dispatch({ type: Types.TODAY_SHIFTS_OBJ, data: arr })
    }


    return (
        <View style={{ flex: 1}}>
            {loading ? <Loader /> : null}
            <View style={{flexDirection:'row',alignItems:'center',paddingHorizontal:10,justifyContent:"space-between",paddingVertical:4,backgroundColor:'#d9d9d9'}}>
                <TouchableOpacity onPress={()=>props?.navigation?.navigate('Home')}>
                    <Feather color={'#111'} size={32} name="chevron-left" />
                </TouchableOpacity>
                <Text style={{ fontSize:normalizeSize(18) ,textAlign:"center"}}>{breakStart.isStart?"On Break":"Clocked In"}</Text>
                <View/>
            </View>

            {!show?<><View style={{ flex: 1,padding: 20,paddingTop:10}}>
            <ScrollView style={{ flex: 1}} showsVerticalScrollIndicator={false}>
                <View style={{ flexDirection:"row",alignItems:'flex-start',justifyContent:"space-between"}}>
                    <FontAwesome5 color={'#1c78ba'} name="tasks" size={Config().height / 28} onPress={()=>props.navigation.navigate('ShiftTasks', { JobData: JobData })}/>
                    <Text style={{ fontSize: normalizeSize(18), fontWeight: '700', textAlign: 'center',flex:1,marginHorizontal:16}}>
                        {`${JobData?.company_name ? JobData?.company_name : ''}`}
                    </Text>
                    <Icon color={Colors.ThemeRed} name='first-aid' type='foundation' size={Config().height / 24} onPress={() => props.navigation.navigate('WHSInfoDetail', { JobData: JobData })} />
                </View>
                <Text style={{ fontSize: normalizeSize(12),color:'#818589',textAlign:"center",marginBottom:10,marginTop:5}}>
                    Shift scheduled {JobData?.start_time ? moment(JobData?.start_time, 'hh:mm A').format('hh:mm A') : ''} to {JobData?.finish_time ? moment(JobData?.finish_time, 'hh:mm A').format('hh:mm A'):''}
                </Text>
            <View style={{width: '90%',alignSelf:"center",}}>
                {/* <View style={[styles.container]}>
                    <MapView
                        ref={mapRef}
                       provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        loadingEnabled
                        zoomControlEnabled
                        zoomEnabled
                        initialRegion={{
                            latitude: region.latitude,
                            longitude: region.longitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }}>
                        <Polyline
                            coordinates={coordinates}
                            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                            strokeColors={['#7F0000']}
                            strokeWidth={6}
                            geodesic={true}
                        />
                        <Marker coordinate={coordinates[0]} />
                        <Marker coordinate={coordinates[1]} />
                    </MapView>
                </View> */}
                <View style={{marginTop:5}}>
                    {/* <Text style={{ fontSize: normalizeSize(12), flex: 1,textAlign:"center" }}>
                        {disCovered}{' '}km from location
                    </Text> */}
                    {/* <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <Text style={{ fontSize: height / 45, fontWeight: '700' }}>Location:</Text>
                    </View> */}
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <Text style={{ fontSize: normalizeSize(12), fontWeight: '700' }}>Clocked In:</Text>
                        <Text style={{ fontSize: normalizeSize(12), flex: 1}}>
                        {' '}
                        {JobData?.address}
                        </Text>
                    </View>
                   
                    <Text style={{ fontSize: normalizeSize(12), fontWeight: '700', marginTop: 5,alignSelf:"center" }}>
                        Start Time: <Text style={{ fontWeight: 'normal' }}>
                         {' '}
                         {ClockData && ClockData.time_in ? moment(ClockData.time_in).format('hh:mm A') : ''}
                        </Text>
                    </Text>
                   
                    {breakStart.isStart?<Text style={{ fontSize: normalizeSize(12), fontWeight: '700', marginTop: 10,alignSelf:"center" }}>
                        Break Start: <Text style={{ fontWeight: 'normal' }}>
                         {' '}
                         {breakStart.isStart && breakStart.breakStartTime ? moment(breakStart.breakStartTime,'YYYY-MM-DD HH:mm:ss').format('hh:mm A') : ''}
                        </Text>
                    </Text>:null}
                </View>
            </View>


                    <View style={{ flexDirection: 'column', marginTop: 40, justifyContent:breakStart.isStart?"center": 'space-between' }}>
                        <TouchableOpacity onPress={breakStart.isStart ? handleEndBreak : handleStartBreak}
                            style={{ borderRadius: 20, paddingVertical: 14,paddingHorizontal:45, backgroundColor: '#1c78ba' }}>
                            <Text style={{ alignSelf: 'center', fontSize: height / 45, color: Colors.White,fontWeight:"700" }}>{breakStart.isStart ? 'End Break' : 'Start Break'}</Text>
                        </TouchableOpacity>

                        {/* {!breakStart.isStart?<TouchableOpacity onPress={() => setShow1(true)}  style={{ borderRadius: 20, marginVertical:15,paddingVertical: 14,paddingHorizontal:28, backgroundColor: '#1c78ba',justifyContent:"center" }}>
                            <Text style={{ textAlign: 'center', fontSize: height / 45, color: Colors.White,fontWeight:"700"}}>Add Shift Note</Text>
                        </TouchableOpacity>:null} */}

                    </View>

                    {!breakStart.isStart?<TouchableOpacity onPress={() => handleClockOutApi(true)} style={{ marginTop: width / 10,alignSelf:"center" }}>
                        {/* <Image source={clockRed} style={{ width: 130, height: 130, alignSelf: 'center' }} resizeMode={'contain'} /> */}
                        <View 
                            style={{
                                backgroundColor:"red",
                                width:160,
                                height:160,
                                borderRadius:80,
                                justifyContent:"center",
                                alignItems:"center",
                                borderWidth:4,
                                borderColor:"#111"
                            }}>
                            <Text style={{color:"#fff",fontSize: height / 40,fontWeight:"700"}}>Clock Out</Text>
                        </View>
                    </TouchableOpacity>:null}

                    <View style={{ marginTop:15 }}>
                        {orderBreaks && orderBreaks.length ?
                            orderBreaks.map((it, ind) => {
                                if (it && (it.start && it.finish)) {
                                    return <Text key={ind} style={{ fontSize: normalizeSize(12), fontWeight: '700', marginTop: 15 }}>
                                        Break #{ind + 1}: <Text style={{ fontWeight: 'normal' }}>
                                            {moment(it.start).format('hh:mm A')} to  {moment(it.finish).format('hh:mm A')}
                                        </Text>
                                    </Text>
                                }
                            })
                            : null
                        }

                    </View>
                    
            </ScrollView>
            </View></>:<ConfirmClockInOut
            loading={loading}
            visible={show}
            Value={shiftNotes}
            toggleOverlay={toggleOverlay}
            handleChange={(e) => setShiftNotes(e)}
            AddNotes={SubmitNotes}
            SkipNotes={SkipNotes}
            ClockSt={`out.`}
            TimeSt={timeSt}
            JobDetailData={JobData}
        />}

            {show1 ?
                <AddShiftNotes
                    visible={show1}
                    Value={addNotes}
                    toggleOverlay={() => setShow1(false)}
                    handleChange={(e) => setAddNotes(e)}
                    AddNotes={handleSubmitNotes}
                    handleSkipNotes={handleSkipNotes}
                />
                : null
            }



            {/* {show ?
                <ShiftNotes
                    loading={loading}
                    visible={show}
                    Value={shiftNotes}
                    toggleOverlay={toggleOverlay}
                    handleChange={(e) => setShiftNotes(e)}
                    AddNotes={SubmitNotes}
                    SkipNotes={SkipNotes}
                    ClockSt={`out.`}
                    TimeSt={timeSt}
                />
                : null
            } */}
        </View>
    )
}

const mapStateToProps = (state) => {
    const { JobStore: { AllClockInData, TodayShiftObj } } = state;

    return { AllClockInData, TodayShiftObj };
};
const mapDispatchToProps = dispatch => {
    return {
        DispatchUser: data => dispatch({ type: Types.GET_DETAILS, data: data }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClockOutScreen);


const styles = StyleSheet.create({
    container: {
        height: height / 4.5,
    },
    scrollview: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.8
    },
});








 // ClockStoreData.forEach(val => {
                                // if (item.clockin_id == val.clockin_id) {
                                //     abc.push({ ...item, breaks: val.breaks, shiftnote: val.shiftnote ? val.shiftnote : '' })
                                //     console.log('valvalvalval', val);
                                //     obj = val; status = true
                                // }

                            // })
                            // if (!status) {
                            //     abc.push({ ...item, breaks: '', shiftnote: "" })

                            // }