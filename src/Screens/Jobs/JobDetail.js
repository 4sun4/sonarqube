import React, {useState} from 'react';
import {
  View,
  Text,
  Alert,
  PermissionsAndroid,
  Image,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Linking,
  ScrollView,
} from 'react-native';
import Loader from '../../Components/Loader';
import {callGetBodyApis, CallPostRestApi} from '../../Services/Api';
import Colors from '../../Util/Colors';
import {showMessage, hideMessage} from 'react-native-flash-message';
import moment from 'moment';
import {Icon} from 'react-native-elements';
import Geolocation from 'react-native-geolocation-service';
import AndroidOpenSettings from 'react-native-android-open-settings';
import {PERMISSIONS, request} from 'react-native-permissions';
import {connect} from 'react-redux';
import {useDispatch, useSelector} from 'react-redux';
import { showLocation } from "react-native-map-link";

const clockgreen = require('../../Assets/Icons/clockgreen.png');
const clockblue = require('../../Assets/Icons/clockblue.png');
const clockRed = require('../../Assets/Icons/clockRed.png');

import Config from '../../Util/Config';
import {checkMultiplePermissions, checkPermission} from '../permission';
import {
  CheckNet,
  checkUserWithInRadius,
  getCurrentLatLong,
  getCurrentTime,
  getTimesheetTypeBg,
  normalizeSize,
} from '../../Util/CommonFun';
import ShiftNotes from '../../Components/Popups/ShiftNotes';
import Types from '../../redux/Types';
import {Working_status} from '../../Util/DumyJson';
import ConfirmClockInOut from '../../Entry/ConfirmClockInOut';
const {height, width} = Dimensions.get('window');
const Margin = width / 20;
let latitude = '',
  longitude = '',
  report_to = '',
  pay_rate = [],
  address = '',
  company_name = '',
  job = '',
  order_id = '',
  order_status = '',
  start_date = '',
  finish_date = '',
  start_time = '',
  finish_time = '';
  timesheet_shift_type = '';
  shift_working_status = '';

let JobDocuments = [
  {
    title: 'Job Info',
    url: 'http://www.africau.edu/images/default/sample.pdf',
  },
  {
    title: 'Another Doc',
    url: 'http://www.africau.edu/images/default/sample.pdf',
  },
];

const JobDetail = props => {
  const {route, navigation} = props;
  const [loading, setLoading] = useState(false);
  const [JobDetailData, setJobDetailData] = useState(null);
  const [Lat, setLat] = useState(0.0);
  const [Long, setLong] = useState(0.0);
  const [data, setData] = useState({BackData: null});

  const [checkLocation, setCheckLocation] = useState(false);
  const [show, setShow] = useState(false);
  const [shiftNotes, setShiftNotes] = useState('');
  const [allClockInData, setAllClockInData] = useState([]);
  const [checkClockedIn, setCheckClockedIn] = useState(false);
  const [clockInObj, setclockInObj] = useState(null);
  const [timeSt, setTimeSt] = useState('');
  const [screenName, setScreenName] = useState('');
  const [shiftInd, setShiftInd] = useState(0);
  const [showGeoWarning,setShowGeoWarning] = useState(false)

  const dispatch = useDispatch();
  const currentDate = moment().format('ddd Do MMM');
  if (JobDetailData) {
    if (JobDetailData.latitude) {
      latitude = JobDetailData.latitude;
    }
    if (JobDetailData.longitude) {
      longitude = JobDetailData.longitude;
    }
    if (JobDetailData.report_to) {
      report_to = JobDetailData.report_to;
    }
    if (JobDetailData.pay_rate) {
      pay_rate = JobDetailData.pay_rate;
    }
    if (JobDetailData.address) {
      address = JobDetailData.address;
    }
    if (JobDetailData.company_name) {
      company_name = JobDetailData.company_name;
    }
    if (JobDetailData.job) {
      job = JobDetailData.job;
    }
    if (JobDetailData.order_id) {
      order_id = JobDetailData.order_id;
    }
    if (JobDetailData.order_status) {
      order_status = JobDetailData.order_status;
    }
    if (JobDetailData.start_date) {
      start_date = JobDetailData.start_date;
    }
    if (JobDetailData.finish_date) {
      finish_date = JobDetailData.finish_date;
    }
    if (JobDetailData.start_time) {
      start_time = JobDetailData.start_time;
    }
    if (JobDetailData.finish_time) {
      finish_time = JobDetailData.finish_time;
    }
    if (JobDetailData.timesheet_shift_type) {
      timesheet_shift_type = JobDetailData.timesheet_shift_type;
    }
    if (JobDetailData.shift_working_status) {
      shift_working_status = JobDetailData.shift_working_status;
    }
  }

  React.useEffect(() => {
    console.log('getCurrentTime()', getCurrentTime());
    const unsubscribe = props.navigation.addListener('focus', async () => {
      getRouteData();
    });
    return unsubscribe;
  }, [route]);


  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // When the screen is focused, we don't need to do anything specific
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      hideMessage();
    });

    return () => {
      unsubscribe();
      unsubscribeBlur();
    };
  }, [navigation]);

  const GoToURL = URL => {
    console.log('URL:- ', URL);
    Linking.openURL(URL).catch(err => {
      console.log(err + '   Linking.openURL');
    });
  };

  const getRouteData = () => {
    console.log('navigation', navigation, 'route testing log', route);
    if (route && route.params) {
      let rout = route.params;
      let jobData = rout.JobData && rout.JobData != '' ? rout.JobData : '';
      let sname =
        rout.ScreenName && rout.ScreenName != '' ? rout.ScreenName : '';
      let shift_ind = rout.shift_ind ? rout.shift_ind : 0;
      setShiftInd(shift_ind);
      setData({...data, BackData: jobData});
      setJobDetailData(jobData ? jobData : null);
      getClockIns(jobData.order_id);
      setScreenName(sname);
      if (jobData && jobData.order_id) {
        getJobDetails(jobData.order_id);
      }
    }
  };
console.log("JobDetailData",JobDetailData);
  const getJobDetails = async id => {
    setLoading(true);
    let body = {order_id: id};
    let url = Config().LIVE + 'myWorkHistoryByID';
    console.log("getJobDetails",body);
    
    await CallPostRestApi(body, url)
      .then(res => {
        setLoading(false);
        console.log('myWorkHistoryByID res :- ', res);
        setJobDetailData(res && res.length ? res[0] : null);
      })
      .catch(error => {
        setLoading(false);
        console.log('myWorkHistoryByID error :- ', error);
        // showMessage({message: 'Error', description: error, type: 'warning'});
      });
  };

  React.useEffect(async () => {
    // 2020-04-13 09:30:34
    var weekEnd = moment().clone().endOf('isoWeek').format('YYYY-MM-DD');
    console.log('weekEnd', weekEnd);
    let check_ = await checkForPermissions();
    setCheckLocation(check_);
    if (check_) {
      getLocation();
    } else {
      Alert.alert(
        'Permission Request',
        'Please allow permission to access the Location.',
        [
          {
            text: 'Go to Settings',
            onPress: () => {
              Linking.openSettings();
            },
          },
          {text: 'Cancel', style: 'cancel'},
        ],
        {cancelable: false},
      );
    }
  }, []);

  const getClockIns = async orderId => {
    let URL = Config().getClockIns;
    setLoading(true);
    let data = {
      order_id: orderId ? orderId : 0,
      week_ending: moment().clone().endOf('isoWeek').format('YYYY-MM-DD'),
    };
    await callGetBodyApis(URL, data)
      .then(async res => {
        setLoading(false);
        if (res && res.length) {
          setAllClockInData(res);
          res.forEach(el => {
            let today = moment().format('YYYY-MM-DD');
            let clockTime = moment(el.time_in).format('YYYY-MM-DD');
            // if (today == clockTime) {
              if (orderId == el.order_id) {
                setclockInObj(el);
                setCheckClockedIn(true);
              }
            // }
          });
        }
        console.log('getClockIns res :- ', res);
      })
      .catch(error => {
        setLoading(false);
        console.log('getClockIns error :- ', error);
        // showMessage({message: 'Error', description: error, type: 'warning'});
      });
  };

  const getLocation = async () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        let myLat = parseFloat(position.coords.latitude);
        let myLong = parseFloat(position.coords.longitude);
        setLat(myLat);
        setLong(myLong);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
        if (
          error.message &&
          error.message.includes('Location permission not granted.')
        ) {
          //  handleLocationPopup()
        }
      },
      {enableHighAccuracy: true, timeout: 5000},
    );
  };

  const toggleOverlay = () => {
    setShow(false);
  };

  const checkForPermissions = async () => {
    const permissions =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    // Call our permission service and check for permissions
    const isPermissionGranted = await checkPermission(permissions);

    return isPermissionGranted;
  };

  const handleClockIn = async item => {
    // handleStatus()
    // return
    console.log(clockInObj,"clockInObj-----",item)
    if (clockInObj) {
      let today = moment().format('YYYY-MM-DD');
      let clockTime = moment(clockInObj.time_in).format('YYYY-MM-DD');
      if (today != clockTime) {
        console.log(today,clockTime,"--------eeeeeeeeeeeeeeeee")
        handleGenericClockIn(item);
      } else {
        if (clockInObj.time_out) {
          alert('You have already clocked in and out of this shift today.');
        } else {
          let jobdata = {myjob: JobDetailData, clockData: clockInObj};
          console.log('clockInObj', clockInObj);
          props.navigation.navigate('ClockOutScreen', {jobdata: jobdata});
        }
      }
    } else {
      console.log("else-------------")
      handleGenericClockIn(item);
    }
  };

  const handleGenericClockIn = async item => {
    console.log(item,"aslskdosd handleGenericClockIn")
    if (item) {
      const currentDate = moment().format('YYYY-MM-DD');
      if (item['start_date'] && item['start_date'] != '0000-00-00') {
        if (
          item['finish_date'] != '0000-00-00' &&
          item['start_date'] <= currentDate &&
          item['finish_date'] >= currentDate ||  item['finish_date'] ==null
        ) {
          console.log("if clock in valid format")
          clockInValidation(item);
        } else if (
          item['finish_date'] == '0000-00-00' &&
          item['start_date'] <= currentDate
        ) {
          console.log("else clockInValidation")
          clockInValidation(item);
        }
        else if ((item['start_date'] < currentDate && item['finish_date'] < currentDate)&&(item['start_time'] > item['finish_time']) ){
          clockInValidation(item);
        }
      } else {
        alert('start date not given');
      }
    }
  };

  const clockInValidation = async item => {
    let startTime = new Date('01/01/2000 ' + item.start_time);
    let current = new Date('01/01/2000 ' + getCurrentTime());
    // let fiveMin = 300000

    let fiveMin = moment(new Date('01/01/2000 ' + item.start_time))
      .add(5, 'minutes')
      .format('HH:mm:ss');
      // let fifteenMinAfterFinish = moment(new Date('01/01/2000 ' + item.finish_time)).add(15, 'minutes').toDate();
        // Define the end of the day for the finish time
      let endOfDay = moment(`${item.finish_date} 23:59:59`, 'YYYY-MM-DD HH:mm:ss').toDate();
      // console.log(endOfDay,"========",item.finish_date)
      // return
    let check =
      new Date('01/01/2000 ' + fiveMin) <=
      new Date('01/01/2000 ' + getCurrentTime());

    if (startTime.getTime() === current.getTime()) {
      handleClockInApi(item, 'skip');
    } else if (startTime > current) {
      setTimeSt('Early');
      await props.DispatchClockPopData({...item, shift_status: 'Early'});
      setShow(true);
      return;
    }

    // else if (((startTime - current) < fiveMin && (startTime - current) > 0)) {
    // handleClockInApi(item, 'skip');
    // return
    // }
    else if (!check) {
      handleClockInApi(item, 'skip');
      return;
    } else if (
      new Date('01/01/2000 ' + item.start_time) <=
        new Date('01/01/2000 ' + getCurrentTime()) &&
      new Date('01/01/2000 ' + item.finish_time) >
        new Date('01/01/2000 ' + getCurrentTime())
    ) {
      setTimeSt('Late');
      await props.DispatchClockPopData({...item, shift_status: 'On Going'});
      setShow(true);
      return;
    } else if (current > new Date('01/01/2000 ' + item.finish_time) && current <= endOfDay) {
      setTimeSt('Late');
      await props.DispatchClockPopData({...item, shift_status: 'Late with Grace'});
      setShow(true);
      return;
  }
    else {
      alert('No available shift for today');
    }
  };

  const SubmitNotes = item => {
    if (!shiftNotes) {
      alert('Please add notes first!');
    } else {
      handleClockInApi(item, 'save');
    }
  };

  const SkipNotes = item => {
    handleClockInApi(item, 'skip');
  };

  const handleClockInApi = async (item, type) => {
    let check_ = await checkForPermissions();
    setCheckLocation(check_);
    if (!check_) {
      Alert.alert(
        'Permission Request',
        'Please allow permission to access the Location.',
        [
          {
            text: 'Go to Settings',
            onPress: () => {
              Linking.openSettings();
            },
          },
          {text: 'Cancel', style: 'cancel'},
        ],
        {cancelable: false},
      );

      return;
    }
    const currentLocation = await getCurrentLatLong();
    console.log('currentLocation', currentLocation, '\n', {
      radius: JobDetailData?.job_radius,
    });
    setLat(currentLocation.latitude);
    setLong(currentLocation.longitude);
    const isWithInGivenRadius = await checkUserWithInRadius(
      {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      },
      {latitude: JobDetailData?.latitude, longitude: JobDetailData?.longitude},
      JobDetailData?.job_radius,
    );
    if (!isWithInGivenRadius) {
      // if(!show){
        showMessage({
          message: 'Warning',
          description:
            'You are not within the Geofence Radius for this shift. Please move to within range and try again. To see information about the clock in location, click back to the shift details and click on the Info icon',
          type: 'warning',
          autoHide:false,
          hideOnPress:true,
          onPress: () => {
            hideMessage();
          },
        });
      // }
      setShowGeoWarning(true)
      return;
    }
    let body = {
      order_id: item.order_id,
      week_ending: moment().clone().endOf('isoWeek').format('YYYY-MM-DD'),
      clock_in_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      latitude_in: currentLocation.latitude, // optional
      longitude_in: currentLocation.longitude, // optional
      note: type == 'skip' ? '' : shiftNotes, //optional
    };

    var URL = Config().clockIn;

    setLoading(true);
    let Conn = await CheckNet();
    if(!Conn){

      dispatch({ type: Types.OFFLINE_API_SAVE, data: {
        method: 'POST',
        url: URL,
        data:body
      } })
    setLoading(false);

      showMessage({
        message: 'Success',
        description: 'Clocked In Successfully.',
        type: 'success',
      });
      handleStatus();
      let jobdata = {myjob: JobDetailData, clockData: clockInObj};
      console.log(jobdata,"job daa")
      props.navigation.navigate('ClockOutScreen', {jobdata: jobdata});
    }else{
      await CallPostRestApi(body, URL)
      .then(async res => {
        console.log('handleClockInApi res :- ', res);
        setLoading(false);
        if (res && res.success) {
          showMessage({
            message: 'Success',
            description: 'Clocked In Successfully.',
            type: 'success',
          });
          handleStatus();
          let jobdata = {myjob: JobDetailData, clockData: clockInObj};
          props.navigation.navigate('ClockOutScreen', {jobdata: jobdata});
        }
      })
      .catch(error => {
        setLoading(false);
        console.log('handleClockInApi error :- ', error);
        showMessage({message: 'Error', description: error, type: 'warning'});
      });
    }
  };

  const handleAddress =(item)=>{
    if(JobDetailData?.latitude && JobDetailData?.longitude){
      showLocation({
        latitude: JobDetailData.latitude??0,
        longitude: JobDetailData.longitude?? 0,
        googleForceLatLon: false,
        alwaysIncludeGoogle: false,
      });
    }
    else{
      showMessage({message: 'Error', description: "Couldn't fetch coordinates", type: 'warning'});
    }
  }

  const handleInfo =()=>{
    if(JobDetailData?.clockin_instructions){
      Alert.alert("Alert",JobDetailData?.clockin_instructions)
  }
  else{
      showMessage({message: '', description:"Couldn't fetch info", type: 'warning'});
  }
  }

  const handleStatus = () => {
    const currentDate = moment().format('YYYY-MM-DD');
    // let shift_arr = props.TodayShiftObj[currentDate];
    let shift_arr = props.TodayShiftObj;

    let arr = shift_arr?.map((el, index) => {
      if (index == shiftInd) {
        el.shift_working_status = Working_status.NOTCLOCKOUT;
      }
      return el;
    });
    let copy_obj = props.TodayShiftObj;
    // copy_obj[currentDate] = arr;
    dispatch({type: Types.TODAY_SHIFTS_OBJ, data: arr});
  };
  const momentStart = JobDetailData && JobDetailData?.start_time ? moment(`${JobDetailData?.start_date} ${JobDetailData?.start_time}`, 'YYYY-MM-DD HH:mm:ss'):""
  const momentEnd = JobDetailData && JobDetailData?.finish_time ? moment(`${JobDetailData?.finish_date} ${JobDetailData?.finish_time}`, 'YYYY-MM-DD HH:mm:ss'):""
  // Check if the end time is earlier than the start time on the same day
  if (momentEnd && momentEnd.isBefore(momentStart)) {
    momentEnd.add(1, 'day'); // Add one day to the end time
  }

  const startTime = JobDetailData && JobDetailData.start_time
  ? moment(JobDetailData.start_time, 'HH:mm:ss').format('hh:mm A')
  : '';
    const endTime =
    JobDetailData && JobDetailData.finish_time && JobDetailData.finish_time != '0000-00-00'
        ? moment(JobDetailData.finish_time, 'HH:mm:ss').format('hh:mm A')
        : '';
        const diffInMinutes = momentEnd ? momentEnd.diff(momentStart, 'minutes'):""
        const hoursLength = diffInMinutes / 60
    // const hoursLength = momentEnd ? momentEnd.diff(momentStart, 'hours'):""
    const timeDiff = JobDetailData && hoursLength && hoursLength > JobDetailData?.hours_threshold ? hoursLength - JobDetailData?.break_length : hoursLength
  return (
    <SafeAreaView style={{flex: 1}}>
      {loading ? <Loader /> : null}
      {/* <View style={styles.container}> */}
        <ScrollView
          contentContainerStyle={styles.container}
          
          // onTouchStart={()=>showGeoWarning ? setShowGeoWarning(false):null}
          showsVerticalScrollIndicator={false}>
          {!show ? (
            <View style={{padding: 20, flex: 1, marginTop: 0, paddingTop: 5}}>
              <Text
                style={{
                  fontSize: height / 30,
                  fontWeight: '700',
                  textAlign: 'center',
                }}>{company_name}</Text>
              <Text style={styles.scheduleText}>
                Shift scheduled{' '}
                {start_time
                  ? moment(start_time, 'hh:mm A').format('hh:mm A')
                  : ''}{' '}
                to{' '}
                {finish_time
                  ? moment(finish_time, 'hh:mm A').format('hh:mm A')
                  : ''}
              </Text>

              <Text
                style={[styles.scheduleText,{fontSize:14,marginTop:15,color:"#000",marginBottom:5}]}>Current Time</Text>
              <Text style={[styles.scheduleText,{fontSize:14,color:"#000"}]}>
                {moment().format('hh:mm A')} {currentDate}
              </Text>
              {screenName === 'JobShifts' ? (
                <TouchableOpacity
                  onPress={() => handleClockIn(JobDetailData)}
                  style={{marginTop: 20, alignSelf: 'center'}}>
                  {/* <Image source={JobDetailData.shift_working_status == 'On Break' ? clockblue : JobDetailData.shift_working_status == 'Clock Out' ? clockRed : clockgreen} style={{ width: 130, height: 130, alignSelf: 'center' }} resizeMode={'contain'} /> */}
                  <View
                    style={{
                      backgroundColor: '#00da9b',
                      width: 160,
                      height: 160,
                      borderRadius: 80,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 4,
                      borderColor: '#111',
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: height / 40,
                        fontWeight: '700',
                      }}>
                      Clock In
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : null}

              {/* <View style={{ marginTop: 10, alignItems: 'flex-end' }}>
                            <Icon color={Colors.ThemeRed} name='first-aid' type='foundation' size={Config().height / 20} onPress={() => props.navigation.navigate('WHSInfoDetail', { JobData: JobDetailData })} />
                        </View> */}

              <View style={{flex: 1}}>
                {/* <Text style={{ fontSize: height / 45, fontWeight: '700', marginTop: 20 }}>
                                Company name: <Text style={{ fontWeight: 'normal' }}>{company_name ? company_name : ''}</Text>
                            </Text> */}

                {/* <Text style={{ fontSize: height / 45, fontWeight: '700', marginTop: 20 }}>
                                Country: <Text style={{ fontWeight: 'normal' }}>{'Australia'}</Text>
                            </Text> */}
                {/* <View style={{marginTop: 20}}>
                  <Text style={{fontSize: height / 45, fontWeight: '700'}}>
                    Address:
                  </Text>
                  <Text
                    style={{
                      fontSize: height / 45,
                      flex: 1,
                      color: Colors.Grey58,
                      marginTop: 5,
                    }}>
                    {address ? address : ''}
                  </Text>
                  <Icon name='location' type='entypo' onPress={() => props.navigation.navigate('JobMap', { JobData: JobDetailData })} />
                </View> */}
                {/* <Text style={{ fontSize: height / 45, fontWeight: '700', marginTop: 20 }}>
                                Job: <Text style={{ fontWeight: 'normal', }}>{job ? job : ''}</Text>
                            </Text>
                            <Text style={{ fontSize: height / 45, fontWeight: '700', marginTop: 20 }}>
                                Job Status: <Text style={{ fontWeight: 'normal' }}>{order_status ? order_status : ''}</Text>
                            </Text>

                            <Text style={{ fontSize: height / 45, fontWeight: '700', marginTop: 20 }}>
                                Report to: <Text style={{ fontWeight: 'normal' }}>{report_to ? report_to : ''}</Text>
                            </Text>
                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <Text style={{ fontSize: height / 45, fontWeight: '700' }}>Start Shift:</Text>
                                <Text style={{ fontSize: height / 45, flex: 1 }}> {start_date ? moment(start_date).format("dddd, Do MMMM YYYY") : ''} {start_time ? `at ${moment(start_time, 'hh:mm A').format('hh:mm A')}` : ''}</Text>

                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <Text style={{ fontSize: height / 45, fontWeight: '700' }}>End Shift:</Text>
                                <Text style={{ fontSize: height / 45, flex: 1 }}> {finish_date && finish_date != "0000-00-00" ? moment(finish_date).format("dddd, Do MMMM YYYY") : ''} {finish_time ? `at ${moment(finish_time, 'hh:mm A').format('hh:mm A')}` : ''}</Text>
                            </View>
                            {pay_rate && pay_rate.length ?
                                <Text style={{ fontSize: height / 30, fontWeight: '700', textAlign: 'center', marginTop: 20 }}>{`Pay Rates`}</Text>
                                : null
                            }

                            {pay_rate && pay_rate.length ?
                                Object.keys(pay_rate[0]).map((it, ind) => {
                                    return <Text key={ind} style={{ fontSize: height / 45, fontWeight: '700', marginTop: 20 }}>
                                        {it}: <Text style={{ fontWeight: 'normal' }}>{pay_rate[0][it]}</Text>
                                    </Text>
                                })
                                : null
                            }



                            {JobDocuments && JobDocuments.length ?
                                <Text style={{ fontSize: height / 30, fontWeight: '700', textAlign: 'center', marginTop: 20 }}>{`Job Documents`}</Text>
                                : null
                            }

                            {JobDocuments && JobDocuments.length ?
                                <Text style={{ fontSize: height / 40, fontWeight: '700', marginTop: 20 }}>{`File :`}</Text>
                                : null
                            }

                            {JobDocuments && JobDocuments.length ?
                                JobDocuments.map((it, ind) => {
                                    return (
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ width: '50%', justifyContent: 'flex-end' }}>
                                                <Text key={ind} style={{ fontSize: height / 50, }}>{it.title}</Text>
                                            </View>
                                            <View style={{ width: '48%', alignItems: 'flex-end' }}>
                                                <Icon onPress={() => it.url ? GoToURL(it.url) : null} color={Colors.ThemeRed} name='download' type='foundation' size={Config().height / 25} />
                                            </View>
                                        </View>
                                    )
                                })
                                : null
                            } */}
              </View>
              {/* CARD DESIGN */}
              <View style={styles.cardContainer} >
                <View style={styles.cardContainerLeft}>
                  <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                    {moment(JobDetailData?.start_date).format('ddd Do MMM')}
                  </Text>
                  <Text style={{marginTop: 10, fontSize: 14}}>{startTime}</Text>
                  <Text style={{marginTop: 4, marginBottom: 10, fontSize: 14}}>
                    {endTime}
                  </Text>
                  <View style={{flexDirection: 'row', marginTop: 18}}>
                    <Icon
                      size={20}
                      color={'#007bbf'}
                      type={'feather'}
                      name={'clock'}
                    />
                    <Text style={{padding: 2}}>{timeDiff.toFixed(2)} hr/s</Text>
                  </View>
                </View>
                <View
                  style={{flex: 0.7, paddingHorizontal: 8, paddingVertical: 4}}>
                  <Text style={{fontWeight: 'bold'}}>{company_name}</Text>
                  <Text style={styles.rightText2}>{job}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={[styles.rightText3,{backgroundColor:getTimesheetTypeBg(timesheet_shift_type)}]}>{timesheet_shift_type}</Text>
                    <Text style={styles.clockText}>{shift_working_status}</Text>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 10,flex:1}}>
                    <TouchableOpacity  
                      onPress={handleAddress}
                      style={{flexDirection: 'row',flex:1,}}>
                      <Icon
                        size={22}
                        color={'#007bbf'}
                        type={'ionicon'}
                        name={'location-outline'}
                      />
                      <Text style={{flex:1}}>{address}</Text>
                    </TouchableOpacity>
                    {JobDetailData && JobDetailData?.clockin_instructions ? 
                    <TouchableOpacity onPress={handleInfo}>
                    <Image 
                      style={{width:20,height:20,tintColor:"#007bbf"}}
                      resizeMode='contain'
                      source={require('../../Assets/Icons/SidebarInformation.png')}/>
                    </TouchableOpacity>:null}
                  </View>
                </View>
              </View>
              
            </View>
          ) : (
            <>
            <ConfirmClockInOut
              loading={loading}
              visible={show}
              Value={shiftNotes}
              toggleOverlay={toggleOverlay}
              handleChange={e => setShiftNotes(e)}
              AddNotes={SubmitNotes}
              SkipNotes={SkipNotes}
              ClockSt={`in.`}
              TimeSt={timeSt}
              JobDetailData={JobDetailData}
            />
            {/* {showGeoWarning ?
              <View style={[styles.warningCard]}>
              <TouchableOpacity onPress={()=>setShowGeoWarning(false)} style={{paddingTop:10,paddingBottom:10,alignSelf:"flex-end"}}>
               <Image source={require("../../Assets/Icons/redcross.png")} style={{width:15,height:15,tintColor:"#848071"}}/>
              </TouchableOpacity>
              <Text style={[styles.warningText1]}><Text style={styles.warningTextHeader}>Warning: </Text>You are not within the Geofence Radius for this shift. Please move to within range and try again. To see information about the clock in location, click back to the shift details and click on the Info icon</Text>
           </View>:null} */}
           </>
          )}
        </ScrollView>
      {/* </View> */}

      {/* {show ?
                <ShiftNotes
                    loading={loading}
                    visible={show}
                    Value={shiftNotes}
                    toggleOverlay={toggleOverlay}
                    handleChange={(e) => setShiftNotes(e)}
                    AddNotes={SubmitNotes}
                    SkipNotes={SkipNotes}
                    ClockSt={`in.`}
                    TimeSt={timeSt}

                />
                : null
            } */}
    </SafeAreaView>
  );
};

const mapStateToProps = state => {
  const {
    JobStore: {TodayShiftObj},
  } = state;

  return {TodayShiftObj};
};

const mapDispatchToProps = dispatch => {
  return {
    DispatchClockPopData: data =>
      dispatch({type: Types.CLOCK_POP_DATA, data: data}),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(JobDetail);

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#F6F6F6',
    paddingBottom:30
  },
  scheduleText: {
    fontSize: height / 52,
    color: Colors.Grey58,
    // fontWeight:"700",
    textAlign: 'center',
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: '#0082c2',
    marginTop: 20,
    flexDirection: 'row',
    borderRadius: 8,
  },
  cardContainerLeft: {
    flex: 0.3,
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: '#e6e6e6',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rightText2: {
    marginTop: 4,
    backgroundColor: '#7ebedf',
    paddingLeft: 10,
    paddingVertical: 10,
    borderRadius: 8,
    color: '#fff',
  },
  rightText3: {
    marginTop: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#00da9b',
    paddingHorizontal: 20,
    paddingVertical: 2,
    borderRadius: 100,
    color: '#000',
  },
  clockText:{
    color:'#00da9b',
    marginTop: 4,
    fontWeight:"700",
    fontSize:14
  },
  text: {
    marginTop: Platform.OS == 'android' ? 4 : 6,
    fontSize: 16,
    fontFamily: 'System',
    fontWeight: '300',
    color: '#2d4150',
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  warningCard: {
    backgroundColor: '#f8f3d6',
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginTop:30,
    marginBottom:30
    // alignItems: 'center',
  },
  warningTextHeader: {
    fontSize: normalizeSize(12),
    fontWeight: '600',
    color: '#848071',
  },
  warningText1: {
    fontSize: normalizeSize(12),
    // fontWeight: '700',
    color: '#848071',
    textAlign: 'center',
    lineHeight:19
  },
});

// let clockData = {
//     ...item,
//     clock_in_time: new Date(),
//     shift_working_status: Working_status.STARTED,
//     currentLat: Lat,
//     currentLong: Long,
//     note: shiftNotes,
//     week_ending: moment().clone().endOf('isoWeek').format("YYYY-MM-DD")
// }
