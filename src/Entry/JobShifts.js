import React, { useState, useEffect } from 'react'
import { View, Text,RefreshControl , TouchableOpacity, Dimensions, StyleSheet, FlatList, SafeAreaView, Alert ,Image} from 'react-native'
import DateTime from '../Components/DateTimePickes';
import Colors from '../Util/Colors';
import { connect, useDispatch, useSelector } from 'react-redux'
import Loader from '../Components/Loader';
import { callGetBodyApis, callGetRestApis } from '../Services/Api';
import { showMessage, hideMessage } from "react-native-flash-message";
import moment from 'moment'
import Config from '../Util/Config';
import { JobArr, Working_status } from '../Util/DumyJson';
import Types from '../redux/Types';
import { store } from '../redux/Store';
import Feather from 'react-native-vector-icons/Feather'
import { CheckNet, getTimesheetTypeBg, normalizeSize } from '../Util/CommonFun';
import {Icon} from 'react-native-elements';
import { showLocation } from "react-native-map-link";

let LoginData = ''
const { height, width } = Dimensions.get('window');
const Margin = width / 20
const MinMargin = width / 15
let FlatData = []
const JobShifts = (props) => {
    const UserDetail = useSelector(S => { let D = ''; if (S && S.loginStatus && S.loginStatus.loginData && Object.keys(S.loginStatus.loginData).length != 0) { D = S.loginStatus.loginData; if (D) { LoginData = D } } return D })
    const [loading, setLoading] = useState(false)
    const [JobData, setJobData] = useState([])
    const { route, navigation } = props
    const dispatch = useDispatch()
    const [refreshing, setRefreshing] = React.useState(false);

    const tabActionBtn = (item, navigateUrl, index) => {
        getClockIns(item, navigateUrl, index)
    }


    useEffect(() => {
        const unsubscribe = props.navigation.addListener("focus", async () => {
            getRouteData()
        });
        return unsubscribe;
    }, [])

    const sortJobData = (data)=>{
    
        return data.sort((a, b) => {
          // Combine start_date and start_time to create a comparable DateTime string
          const dateTimeA = `${a.start_date}T${a.start_time}`;
          const dateTimeB = `${b.start_date}T${b.start_time}`;
          // Convert the DateTime strings to Date objects and compare them
          return new Date(dateTimeA) - new Date(dateTimeB);
        })
      } 



    const getRouteData = () => {
        console.log("navigation", navigation, "route", route)
        if (route && route.params) {
            let rout = route.params
            let jobData = rout.JobShiftData ? rout.JobShiftData : ""
            let sname = rout.ScreenName && rout.ScreenName != "" ? rout.ScreenName : ""
            // setJobData(jobData ? jobData : null)
            // if (jobData && jobData.order_id) { getJobDetails(jobData.order_id) }

        }
        const currentDate = moment().format('YYYY-MM-DD');
        // let shift_arr = props.TodayShiftObj[currentDate]
        let shift_arr = props.TodayShiftObj
        setJobData(sortJobData(shift_arr))
    }

    const handleAddress =(item)=>{
        console.log("i am amp item",item)
        if(item?.latitude && item?.longitude){
            console.log(" i am map",{
                latitude: item.latitude??0,
                longitude: item.longitude?? 0,
                googleForceLatLon: false,
                alwaysIncludeGoogle: false,
              })
          showLocation({
            latitude: item.latitude??0,
            longitude: item.longitude?? 0,
            googleForceLatLon: false,
            alwaysIncludeGoogle: false,
          });
        }
        else{
          showMessage({message: 'Error', description: "Couldn't fetch coordinates", type: 'warning'});
        }
      }

      const handleInfo =(value)=>{
        if(value?.clockin_instructions){
            Alert.alert("Alert",value?.clockin_instructions)
        }
        else{
            showMessage({message: '', description:"Couldn't fetch info", type: 'warning'});
        }
      }

    const renderItem = ({ item, index }) => {
        const {
            start_date,
            finish_date,
            job,
            budget_name,
            company_name,
            address,
            start_time,
            finish_time,
            timesheet_shift_type,
            shift_working_status,
            site_name
          } = item;

          const momentStart = moment(`${start_date} ${start_time}`, 'YYYY-MM-DD HH:mm:ss');
          const momentEnd = moment(`${finish_date} ${finish_time}`, 'YYYY-MM-DD HH:mm:ss');
      
          // Check if the end time is earlier than the start time on the same day
            if (momentEnd?.isBefore(momentStart)) {
                momentEnd?.add(1, 'day'); // Add one day to the end time
            }
          const startTime = start_time
            ? moment(start_time, 'HH:mm:ss').format('hh:mm A')
            : '';
          const endTime =
            finish_time && finish_time != '0000-00-00'
              ? moment(finish_time, 'HH:mm:ss').format('hh:mm A')
              : '';

          const currentDate = moment().format('YYYY-MM-DD');
          const currentD = moment(start_date).format("ddd Do MMM")
          const diffInMinutes = momentEnd.diff(momentStart, 'minutes');
          const hoursLength = diffInMinutes / 60
        //   const hoursLength = momentEnd.diff(momentStart, 'hours');
        //   console.log(hoursLength,"hoursLengthhoursLength")
          const timeDiff = hoursLength > item?.hours_threshold ? hoursLength - item?.break_length : hoursLength
        if(item?.is_published && item?.is_published == 1){
            return (
                <TouchableOpacity  activeOpacity={1} onPress={() => tabActionBtn(item, 'JobDetail', index)} style={styles.cardContainer} key={index}>
                <View style={styles.cardContainerLeft}>
                  <Text style={{fontSize: 14, fontWeight: 'bold'}}>{currentD}</Text>
                  <Text style={{marginTop: 10, fontSize: 14}}>{startTime}</Text>
                  <Text style={{marginTop: 4, marginBottom: 10, fontSize: 14}}>
                    {endTime}
                  </Text>
                  <View style={{flexDirection: 'row', marginTop: 18}}>
                    <Icon size={20} color={'#007bbf'} type={'feather'} name={'clock'} />
                    <Text style={{padding: 2}}>{timeDiff.toFixed(2)} hr/s</Text>
                  </View>
                </View>
                <View style={{flex: 0.7, paddingHorizontal: 8, paddingVertical: 4}}>
                  <Text style={{fontWeight: 'bold'}}>{company_name}</Text>
                  <Text style={styles.rightText2}>{budget_name}</Text>
                  <View style={{}}>
                    <Text numberOfLines={1} style={[styles.rightText3,{backgroundColor:getTimesheetTypeBg(timesheet_shift_type)}]}>{timesheet_shift_type}</Text>
                    <Text style={styles.clockText}>{shift_working_status}</Text>
                  </View>
                   {site_name ? <Text style={{flex:1,marginTop:2}}>{site_name}</Text>:null}
                  <View style={{flexDirection: 'row', marginTop: 10,flex:1}}>
                    <TouchableOpacity  
                    onPress={()=>handleAddress(item)}
                      style={{flexDirection: 'row',flex:1,}}>
                      <Icon
                        size={22}
                        color={'#007bbf'}
                        type={'ionicon'}
                        name={'location-outline'}
                      />
                      <Text style={{flex:1}}>{address}</Text>
                    </TouchableOpacity>
                    {item?.clockin_instructions ? 
                    <TouchableOpacity onPress={()=>handleInfo(item)}>
                    <Image 
                      style={{width:20,height:20,tintColor:"#007bbf"}}
                      resizeMode='contain'
                      source={require('../Assets/Icons/SidebarInformation.png')}/>
                    </TouchableOpacity>:null}
                  </View>
                  {/* <TouchableOpacity 
                   onPress={()=>handleAddress(item)}
                   style={{flexDirection: 'row', marginTop: 10}}>
                    <Icon
                      size={22}
                      color={'#007bbf'}
                      type={'ionicon'}
                      name={'location-outline'}
                    />
                    <Text style={{flex:1}}>{address}</Text>
                  </TouchableOpacity> */}
                </View>
              </TouchableOpacity>
            )
        }
        else {
            return null
        }
    }




    const getClockIns = async (item, navigateUrl, index) => {
        console.log(item,"-------=>>>>>>>>>>>>>>>>>>")
        let orderId = item.order_id
        let URL = Config().getClockIns
        setLoading(true)
        let data = {
            "order_id": orderId ? orderId : 0,
            "week_ending": moment().clone().endOf('isoWeek').format("YYYY-MM-DD"),
        }
        let Conn = await CheckNet();
        if (!Conn) {
            setLoading(false)
            if(item && item?.shift_working_status != "Clocked Out" && navigateUrl){
                props.navigation.navigate(navigateUrl, { JobData: item, ScreenName: 'JobShifts', shift_ind: index })
            }else{
                alert('You have already clocked in and out of this shift today.')
            }
        }else{
            await callGetBodyApis(URL, data)
            .then(async (res) => {
                setLoading(false)
                let checkStatus = false, clockInObj = {}
console.log(res,"resresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresresres")
                if (res && res.length) {
                    // setAllClockInData(res)
                    res.forEach(el => {
                        let today = moment().format('YYYY-MM-DD');
                        let clockTime = moment(el.time_in).format('YYYY-MM-DD')
                        // if (today == clockTime) {
                            if (orderId == el.order_id) {
                                checkStatus = true;
                                clockInObj = el

                            }
                        // }
                    });
                    console.log("checkStatus",checkStatus);
                    
                    if (checkStatus) {
                        let today = moment().format('YYYY-MM-DD');
                        let clockTime = moment(clockInObj.time_in).format('YYYY-MM-DD')
                        if (clockInObj.time_out) {
                            alert('You have already clocked in and out of this shift today.')
                            handleStatus(Working_status.CLOCKEDOUT,item)
                        }
                        else if ((today == clockTime))
                         {
                            handleStatus(Working_status.NOTCLOCKOUT,item)
                            if(navigateUrl){
                                props.navigation.navigate(navigateUrl, { JobData: item, ScreenName: 'JobShifts', shift_ind: index })
                            }
                        }
                    }
                    else {
                        if(navigateUrl){
                            props.navigation.navigate(navigateUrl, { JobData: item, ScreenName: 'JobShifts', shift_ind: index })
                        }
                    }


                }
                else{
                    if(navigateUrl){
                        props.navigation.navigate(navigateUrl, { JobData: item, ScreenName: 'JobShifts', shift_ind: index })
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



    const handleStatus = (type,ClockData) => {
        const currentDate = moment().format('YYYY-MM-DD');
        // let shift_arr = props.TodayShiftObj[currentDate]
        let shift_arr = props.TodayShiftObj

        let arr = shift_arr.map((el, index) => {
            if (ClockData.order_id == el.order_id) {
                el.shift_working_status =type 
            }
            return el
        })
        let copy_obj = props.TodayShiftObj
        // copy_obj[currentDate] = arr
        setJobData(sortJobData(arr))

        dispatch({ type: Types.TODAY_SHIFTS_OBJ, data: arr })
    }




    const CheckJobDateTime =  React.useCallback(async (paramArr) => {
        let todayShift = store.getState().JobStore.TodayShiftObj
        if (paramArr && paramArr.length > 0) {
            const currentDate = moment().format('YYYY-MM-DD');
            const job_arr = [], job_obj = {}
            for (let i = 0; i < paramArr.length; i++) {
                let item = paramArr[i];
                if (item['start_date'] != "0000-00-00" && item['finish_date'] != "0000-00-00") {
                    
                    // const startDate = moment(`${item?.start_date}`, "YYYY-MM-DD");
                    // const finishDate = moment(`${item?.finish_date}`, "YYYY-MM-DD");
                    
                    // const currentDay = moment().format("YYYY-MM-DD");
                    
                    // const isShiftAvailable = moment(currentDay).isBetween(startDate, finishDate, undefined, '[]')
                    const isPublished = item?.is_published && item?.is_published == 1
                    
                    if(isPublished){
                        job_arr.push(item);
                        getClockIns(item.order_id);
                    }
                }
            }

            if (job_arr.length) {
                // if (todayShift && Object.keys(todayShift).length > 0) {
                //     let check_date = todayShift.hasOwnProperty(currentDate)
                //     let copy_arr = todayShift[currentDate]
                //     let find_obj = copy_arr.find((val) => (Working_status.NOTCLOCKEDIN !== val.shift_working_status) && Working_status.CLOCKEDOUT !== val.shift_working_status)
                //     if (find_obj) { getClockIns(find_obj.order_id) }
                //     if (!check_date) {
                //         let copy_obj = {}
                //         copy_obj[currentDate] = job_arr
                //         dispatch({ type: Types.TODAY_SHIFTS_OBJ, data: copy_obj })
                //         setJobData(sortJobData(job_arr))

                //     } else {
                //         let copyArr = todayShift[currentDate]
                //         let new_Arr=[]
                //         job_arr.forEach(item => {
                //             let xyz = todayShift[currentDate].find((val) => item.order_id == val.order_id)
                //             if (xyz && xyz.order_id) {
                //                copyArr.forEach(it => {
                //                     if (xyz.order_id == it.order_id) {
                //                         new_Arr.push({ ...item, shift_working_status: it.shift_working_status })
                //                     }             
                //                 })
                //             }
                //             else { 
                //                 // new_Arr.push({ ...item, shift_working_status: Working_status.NOTCLOCKEDIN })
                //                 new_Arr.push({ ...item})
                //             }
                //         })
                //         let copy_obj1 = {}
                //         copy_obj1[currentDate] = new_Arr
                //         setJobData(sortJobData(new_Arr))
                //         dispatch({ type: Types.TODAY_SHIFTS_OBJ, data: copy_obj1 })
                //     }
                // } else {
                //     job_obj[currentDate] = job_arr
                //     dispatch({ type: Types.TODAY_SHIFTS_OBJ, data: job_obj })
                //     setJobData(sortJobData(job_arr))

                // }
                    if (todayShift && todayShift?.length > 0) {
                    // let check_date = todayShift.hasOwnProperty(currentDate)
                    let copy_arr = todayShift
                    let find_obj = copy_arr.find((val) => (Working_status.NOTCLOCKEDIN !== val.shift_working_status) && Working_status.CLOCKEDOUT !== val.shift_working_status)
                    if (find_obj) { 
                        getClockIns(find_obj.order_id) 
                    }
                    else {
                        dispatch({ type: Types.TODAY_SHIFTS_OBJ, data: job_arr })
                        setJobData(sortJobData(job_arr))
                    }
                } else {
                    // job_obj[currentDate] = job_arr
                    dispatch({ type: Types.TODAY_SHIFTS_OBJ, data: job_arr })
                    setJobData(sortJobData(job_arr))

                }
            }
        }
    },[JobData])



    const getmyWorkHistory = async () => {
        setRefreshing(true)
        let URL = Config().myShiftToday
        console.log('URL', URL);
        await callGetRestApis(URL)
            .then((res) => {
                setRefreshing(false)
                if (res) {
                    // let Arr = res.map((item) => ({ ...item, shift_working_status: Working_status.NOTCLOCKEDIN }))
                      CheckJobDateTime(res)
                    // CheckJobDateTime(JobArr)
                }
                console.log('myWorkHistory res :- ', res)
            })
            .catch((error) => {
                setRefreshing(false)
                console.log('myWorkHistory error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            {loading ||refreshing? <Loader /> : null}
            <View style={styles.container}>
                <View style={{ flex: 1, padding: width / 20, }}>
                    <View style={styles.headerCard}>
                        <Text style={{ fontSize: height / 45, fontWeight: '600', textAlign: 'center' }}>{`Select which shift you want to clock in to`}</Text>
                    </View>
                    <View style={{ flex: 1, zIndex: 1 }}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={JobData}
                            renderItem={renderItem}
                            keyExtractor={(index) => JSON.stringify(index)}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={getmyWorkHistory} />
                              } 
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        // backgroundColor: '#fff',
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
    },
    headerCard:{
        backgroundColor:"#d8e4f6",
        paddingHorizontal:width / 33,
        paddingVertical:width / 40,
        marginBottom:15,
        borderRadius:width / 33,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 8,
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
});
const mapStateToProps = (state) => {
    const { JobStore: { TodayShiftObj } } = state;

    return { TodayShiftObj };
};

const mapDispatchToProps = dispatch => {
    return {
        DispatchTodayShiftObj: data => dispatch({ type: Types.TODAY_SHIFTS_OBJ, data: data }),

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(JobShifts);