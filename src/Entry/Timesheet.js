import React, { useRef, useEffect, useState } from 'react'
import { View, Text, Button, Image, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Dimensions, SafeAreaView } from 'react-native'
import { callGetRestApis } from '../Services/Api';
import { showMessage, hideMessage } from "react-native-flash-message";
import Loader from '../Components/Loader';
import { useDispatch, useSelector } from 'react-redux'
import Types from '../redux/Types';
import { store } from '../redux/Store';
import moment from 'moment'
import Config from '../Util/Config';
import { JobArr } from '../Util/DumyJson';

let LoginData = ''
const Timesheet = (props) => {
    const UserDetail = useSelector(S => { let D = ''; if (S && S.loginStatus && S.loginStatus.loginData && Object.keys(S.loginStatus.loginData).length != 0) { D = S.loginStatus.loginData; if (D) { LoginData = D } } return D })
    const [loading, setLoading] = useState(false)
    const [MyTimesheetData, setMyTimeSheetData] = useState([])
    const dispatch = useDispatch()
    const screenwidth = Dimensions.get('window').width

    useEffect(() => {
        const unsubscribe = props.navigation.addListener("focus", async () => {
            getCandidateTimesheet()
        });
        return unsubscribe;

    }, [])


    const getCandidateTimesheet = async () => {
        let SteetStoreData = store.getState().TimeSheetStore.AllTimeSheet
        if (LoginData && LoginData.token) {
            let URL = Config().getCandidateTimesheetBookings
            console.log('URL', URL);
            setLoading(true)
            await callGetRestApis(URL)
                .then((res) => {
                    setLoading(false)
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
                        dispatch({ type: Types.ALL_TIME_SHEET, data: arrRes })

                    }
                    console.log('getCandidateTimesheetBookings res :- ', res)
                })
                .catch((error) => {
                    setLoading(false)

                    console.log('getCandidateTimesheetBookings error :- ', error)
                    showMessage({ message: 'Error', description: error, type: "warning", });
                })

        }

    }

    // clock_in: 1
    // co_id: 824
    // order_date: "2021-12-07"
    // pcc: "185"
    // site_id: 0
    // timesheet_count: 6
    
//https://testapi.recruitonline.com.au/api/candidate/myWorkHistory
// address: "42 Export St, Lytton, QLD, 4178"
// break_length: "0.50"//
// company_name: "Mega Industries"//client_name
// finish_date: "0000-00-00"//
// finish_time: "17:00:00"
// hours_threshold: "5.00"//
// job: "Boilermaker"//
// job_radius: 500
// latitude: "-27.4267737"
// longitude: "153.1537871"
// order_id: 8412//
// order_status: "In Progress"//
// pay_rate: [{…}]//
// report_to: "Austine Cagalingan"
// shift_working_status: "Not Clocked In"
// start_date: "2021-12-07"//
// start_time: "08:00:00"
   

    const goToNextScreen = (item) => {
        dispatch({ type: Types.SELECTED_TIME_SHEET, data: item })
        props.navigation.navigate('TimesheetDetail', { TimesheetData: item })
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            {loading ? <Loader /> : null}

            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <KeyboardAvoidingView>
                        <View style={{ width: '100%', paddingVertical: 20 }}>
                            <TouchableOpacity activeOpacity={1} onPress={() => props.navigation.navigate('AddTimesheet1', { SavedFlag: true })}>
                                <View style={{ alignItems: 'center', marginBottom: 15 }}>
                                    <View style={{ width: "100%", backgroundColor: '#FF9900', justifyContent: "space-between", flexDirection: "row", padding: 20, borderWidth: 1, borderRadius: 8, borderColor: "#DDDDDD" }}>
                                        <View>
                                            <Text style={{ fontSize: 18, color: '#FFF' }}>Timesheets to Submit</Text>
                                        </View>
                                        <View>
                                            <Image
                                                style={{ width: 10, height: 16 }}
                                                resizeMode={'contain'}
                                                source={require('../Assets/Icons/ArrowFwdWhite.png')} />
                                        </View>

                                    </View>
                                </View>
                            </TouchableOpacity>

                            <Text style={{ fontSize: 18, color: 'black', textAlign: 'center', fontWeight: 'bold' }}>Select Assignment</Text>
                            

                            {
                            // JobArr.length > 0 ? JobArr.map((item, index) => {

                                MyTimesheetData.length > 0 ? MyTimesheetData.map((item, index) => {
                                        return (
                                            <TouchableOpacity activeOpacity={1} onPress={() => goToNextScreen(item)} key={index} style={{ marginVertical: 8 }}>
                                                <View style={{ borderLeftWidth: 2, borderLeftColor: item.order_status == "In Progress" ? '#22D2B4' : item.order_status == "Completed" ? '#D2222A' : '#0090FF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 25, paddingHorizontal: 25, backgroundColor: '#FFF' }}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                                                        <View>
                                                            <Text style={{ color: '#000', fontSize: 18, fontWeight: '600' }}>{item.client_name ? item.client_name : ''}</Text>
                                                            <Text style={{ color: '#000', fontSize: 15, paddingTop: 5, paddingBottom: 5 }}>as {item.Job ? item.Job : ''}</Text>
                                                            <Text style={{ color: '#000', fontSize: 15 }}>{item.start_date ? `Start - ${moment(item.start_date).format('DD/MM/YYYY')}` : ''}</Text>
                                                        </View>
                                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                            <Text style={{ fontWeight: 'bold', color: item.order_status == "In Progress" ? '#22D2B4' : item.order_status == "Completed" ? '#D2222A' : '#0090FF', fontSize: 18 }}>
                                                                {item.timesheet_count ? item.timesheet_count : 0}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }) : null
                                }
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
                {/* <View style={{ justifyContent: 'flex-end', marginBottom: 20, alignItems: 'center' }}>
                    <TouchableOpacity style={{ width: screenwidth - 100, height: 60, backgroundColor: '#22D2B4', marginTop: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 30 }}>
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>Clock In</Text>
                    </TouchableOpacity>
                </View> */}
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

export default Timesheet
































// React.useLayoutEffect(() => {
    //     props.navigation.setOptions({
    //         headerRight: () => (<TouchableOpacity activeOpacity={1} underlayColor="white" onPress={() => alert('comming soon!')}
    //             style={{ alignItems: 'center', justifyContent: 'center', paddingLeft: 10, paddingRight: 10 }}>
    //             <Image style={{ width: 18, height: 18, alignSelf: 'center' }} resizeMode={'contain'} source={require('../Assets/Icons/HeaderAdd.png')} />
    //         </TouchableOpacity>
    //         ),
    //     });
    // }, []);