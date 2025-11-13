import React, { useRef, useEffect } from 'react'
import { View, Text, Button, Image, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Dimensions, SafeAreaView } from 'react-native'
import { useState } from 'react';
import { connect } from 'react-redux';
import { callGetBodyApis, callGetRestApis, callPostRest, CallPostRestApi } from '../Services/Api';
import { showMessage, hideMessage } from "react-native-flash-message";
import { useDispatch, useSelector } from 'react-redux'
import Colors from '../Util/Colors';
import moment from 'moment'
import Loader from '../Components/Loader';
import InjuryonAssignment from '../Components/Popups/Assignment';
import Config from '../Util/Config';
import Dropdown from '../Components/SelectPicker';
import Types from '../redux/Types';
import { CheckBox } from 'react-native-elements'

let LoginData = ''
const SubmitTimesheet = (props) => {
    const UserDetail = useSelector(S => { let D = ''; if (S && S.loginStatus && S.loginStatus.loginData && Object.keys(S.loginStatus.loginData).length != 0) { D = S.loginStatus.loginData; if (D) { LoginData = D } } return D })
    const [loading, setLoading] = useState(false)
    const [Item, setItem] = useState([]);
    const [ApproverData, setApproverData] = useState([]);
    const [ApproverName, setApproverName] = useState('');
    const [ApproverId, setApproverId] = useState(0);
    const [UserSign, setUserSign] = useState('');

    const TimeSheetPreviewData = useSelector(S => { let D = ''; if (S && S.TimeSheetStore) { D = S.TimeSheetStore.TimeSheetPreviewData; if (D) { } } return D })
    const AllStoreTimeSheets = useSelector(S => { let D = ''; if (S && S.TimeSheetStore) { D = S.TimeSheetStore.AllTimeSheet; if (D) { } } return D })


    console.log('AllStoreTimeSheets', AllStoreTimeSheets);

    let { SelectedTimeSheet, WeekEnd, apiData, PayrollNote, TotalHrs } = TimeSheetPreviewData
    const dispatch = useDispatch()

    const screenwidth = Dimensions.get('window').width
    const screenheight = Dimensions.get('window').height

    const [check1, setCheck1] = useState(false);
    const [check2, setCheck2] = useState(false);
    const [value, setValue] = useState(null);
    const [Show, setShow] = useState(false);

    const [Injuey, setInjuey] = useState('');
    const [Message, setMessage] = useState('');
    const [FullName, setFullName] = useState('');


    useEffect(() => {
        const unsubscribe = props.navigation.addListener("focus", async () => {
            getTimesheetApprovers()
        });
        return unsubscribe;

    }, [])


    useEffect(() => {
        let { route } = props
        if (route && route.params) {
            let rout = route.params
            setUserSign(rout.base64Sign)
        }

    }, [props.route])


    const getTimesheetApprovers = async () => {
        if (LoginData && LoginData.token) {
            let URL = Config().getTimesheetApprovers
            console.log('URL', URL);
            setLoading(true)
            let data = {
                "order_id": SelectedTimeSheet && SelectedTimeSheet.order_id ? SelectedTimeSheet.order_id : 0
            }
            await callGetBodyApis(URL, data)
                .then((res) => {
                    setLoading(false)
                    if (res && res.length) {
                        let arr = []
                        setApproverData(res)
                        res.map((it, ind) => { arr.push(`${it.approver_name}`) })
                        setItem(arr)
                        // setApproverName(name); setApproverId(app_id)

                    }
                    console.log('getTimesheetApprovers res :- ', res)

                })
                .catch((error) => {
                    setLoading(false)
                    console.log('getTimesheetApprovers error :- ', error)
                    showMessage({ message: 'Error', description: error, type: "warning", });
                })

        } else {

        }
    }

    const handleChange = (e) => {
        console.log('eeeeee', e);
        setValue(e)

    }

    const toggleOverlay = () => {setShow(false)};


    const handleSubmit = () => {
        if (!ApproverName) {
            alert('Please select supervisor')
        }
        else if (!check1) {
            alert('Please tick checkbox first.')
        }
        else if (!check2 && !Injuey) {
            setShow(true)
        }
        else if (!UserSign) {
            alert('Please add signature.')
        }
        else {
            submit()
        }

    };

    const handleInjuryChange = (e) => {setInjuey(e)}


    const submit = async () => {
        var URL = Config().SubmitTimesheet
        let body = {
            "order_id": SelectedTimeSheet && SelectedTimeSheet.order_id ? SelectedTimeSheet.order_id : 0,
            "payroll_notes": PayrollNote,
            "injury_details": Injuey,
            "rol_manager_id": ApproverId,
            "signature": UserSign,
            "approver_message": Message,
            // "timesheet_id": 1,
            "week_ending": moment(WeekEnd).format('YYYY-MM-DD'),
            "days": apiData
        }

        console.log('body', body, WeekEnd);
        setLoading(true)
        await CallPostRestApi(body, URL)
            .then(async (res) => {
                console.log('submit timesheetres :- ', res);
                setLoading(false)
                let { external_timesheet_id, message, success, timesheet_id } = res
                if (success) {
                    showMessage({ message: 'Success', description: message, type: "success", });
                    setShow(false)
                    props.navigation.navigate('Timesheet')
                    if (AllStoreTimeSheets && AllStoreTimeSheets.length) {
                        const { order_id } = SelectedTimeSheet
                        const date = moment(WeekEnd, 'YYYY-MM-DD').format('DD')
                        let alldata = AllStoreTimeSheets.map((item, index) => {
                            if (item.order_id == order_id) {
                                let filteredSaveData = item.savedTimeSheet.length ? item.savedTimeSheet.filter(it => {
                                    const storeDate = moment(it.date, 'DD/MM/YYYY').format('DD')
                                    if (storeDate != date) { return it }
                                }) : []
                                return { ...item, savedTimeSheet: filteredSaveData }
                            }
                            return item
                        })
                        console.log('alldata', alldata);
                        await dispatch({ type: Types.ALL_TIME_SHEET, data: alldata })

                    }
                }
            })
            .catch((error) => {
                setLoading(false)
                console.log('submit timesheeterror :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })
    }
    const handleInjurySubmit = () => {
        if (!Injuey) {
            alert('Please enter injury detail.')
        }
        else if (!UserSign) {
            Alert.alert(
                'Alert',
                'Please add signature.',
                [{ text: 'Ok', onPress: () => setShow(false) }],
                { cancelable: false },
            );

        }
        else {
            submit()
        }

    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {loading ? <Loader /> : null}

            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <KeyboardAvoidingView>
                        <View style={{ width: '100%', paddingVertical: 20 }}>
                            <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: '600' }}>
                                {SelectedTimeSheet && SelectedTimeSheet.client_name ? SelectedTimeSheet.client_name : ''}
                            </Text>
                            <Text style={{ fontSize: 16 }}>
                                Week Ending: {WeekEnd ? moment(WeekEnd).format("dddd, Do MMMM") : ''}
                            </Text>
                            <Text style={{ fontSize: 16 }}>
                                Working as {SelectedTimeSheet && SelectedTimeSheet.Job ? SelectedTimeSheet.Job : ''}
                            </Text>
                            <View style={{ justifyContent: 'space-between', flex: 1, paddingVertical: 20, paddingHorizontal: 20, marginVertical: 20, backgroundColor: '#FFF' }}>
                                <View style={{ paddingVertical: 10 }}>
                                    <View style={{ paddingBottom: 10 }}>
                                        <Dropdown
                                            defaultButtonText={'Select Supervisor/Approver'}
                                            statusBarTranslucent={true}
                                            defaultSelection={false}
                                            dropdownButton={{
                                                borderColor: '#D8D8D8', backgroundColor: Colors.White,
                                                borderWidth: 0, borderBottomWidth: 1, alignSelf: 'center',
                                            }}
                                            dropdownTextStyle={{ color: Colors.Black, fontSize: 18, }}
                                            dropdownData={Item}
                                            selectedDropdownItem={(item, index) => {
                                                console.log('---item--', item, index);
                                                let it = ApproverData && ApproverData.length ? ApproverData[index] : null
                                                if (it) {
                                                    let { approver_id, approval_type, approver_name, approver_email } = it
                                                    setApproverName(approver_name); setApproverId(approver_id)
                                                }
                                            }}
                                        />
                                    </View>
                                </View>
                                <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: '600' }}>
                                    Employee Acknowledgment
                                </Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, }}>
                                    <View style={{ justifyContent: 'flex-start' }}>
                                        <CheckBox
                                            onPress={() => setCheck1(!check1)}
                                            checked={check1}
                                            checkedColor={Colors.APP_COLOR}
                                            containerStyle={{ padding: 0, width: 20, height: 20, margin: 2 }}
                                        />
                                    </View>
                                    <Text style={{ flexWrap: 'wrap', flex: 1, }}>
                                        I acknowledge that the hours and/or allowances submitted on this time sheet are true and correct.
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
                                    <View style={{ justifyContent: 'flex-start', }}>
                                        <CheckBox
                                            onPress={() => setCheck2(!check2)}
                                            checked={check2}
                                            checkedColor={Colors.APP_COLOR}
                                            containerStyle={{ padding: 0, width: 20, height: 20, margin: 2 }}
                                        />

                                    </View>
                                    <Text style={{ flexWrap: 'wrap', flex: 1, marginLeft: 5 }}>
                                        I acknowledge that I have not been injured whilst on assignment. Edit details of injury.
                                    </Text>
                                </View>

                                <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: '600' }}>
                                    Message To Supervisor/Approver
                                </Text>
                                <TextInput
                                    style={{color: Colors.Black, borderBottomWidth: 1, height: 40, borderColor: '#D8D8D8', fontSize: 18, backgroundColor: '#FFF' }}
                                    textValue={Message}
                                    placeholder="* optional"
                                    placeholderTextColor="#808080"
                                    keyboardShouldPersistTaps
                                    onChangeText={(value) => setMessage(value)}
                                />

                                <TouchableOpacity onPress={() => props.navigation.navigate("Signature")} style={{ marginTop: 20, borderBottomWidth: 1, height: 40, flex: 1, borderColor: '#D8D8D8', }}>
                                    <Text style={{ fontSize: 18, color: UserSign ? "black" : "#808080", marginTop: 5 }}>{UserSign ? 'Signature Captured' : 'Click here to sign'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
                <View style={{ justifyContent: 'flex-end', marginBottom: 20, alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{ width: screenwidth - 40, height: 60, backgroundColor: '#D02530', marginTop: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 30 }}
                        onPress={() => handleSubmit()}
                    >
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>SUBMIT</Text>
                    </TouchableOpacity>
                </View>

            </View>

            {Show ?
                <InjuryonAssignment
                    loading={loading}
                    visible={Show}
                    Value={Injuey}
                    toggleOverlay={toggleOverlay}
                    handleChange={(e) => handleInjuryChange(e)}
                    InjurySubmit={handleInjurySubmit}
                />
                : null
            }
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

export default SubmitTimesheet
