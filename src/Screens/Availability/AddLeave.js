import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity, Image, Alert, KeyboardAvoidingView } from "react-native"
import Colors from '../../Util/Colors';
import CommonDropDown from '../../Components/CommonDropDown';
import { CheckBox } from 'react-native-elements';
import UploadComponent from '../../Components/UploadComponent';
import DateTimePickerSelect from './components/DateTimePickerSelect';
import { FileFun, getInitials, normalizeSize } from '../../Util/CommonFun';
import { store } from '../../redux/Store';
import Feather from 'react-native-vector-icons/Feather';
import Config from '../../Util/Config';
import { callGetRestApis, globalPostApi } from '../../Services/Api';
import { showMessage } from 'react-native-flash-message';
import Loader from '../../Components/Loader';
import moment from 'moment';
import { DrawerIconComponent, HeaderLogoComponent } from '../../Components/PageLayoutComponents';

const leaveTypesListData = [
    { id: 1, label: 'Annual Leave', value: 'Annual Leave' },
    { id: 2, label: 'Medical Leave', value: 'Medical Leave' }
];

const { width, height } = Dimensions.get('window');
const AddLeave = (props) => {
    const { route } = props
    const userData = store.getState()?.HomeDetails?.UserDetails
    const facilityName = store.getState().loginStatus.facility;
    const userName = `${userData?.first_name} ${userData?.last_name}`
    const userInitials = getInitials(userName)

    const [data, setData] = useState({
        employee: userName,
        leaveType: '',
        startDateTime: new Date(),
        endDateTime: new Date(),
        isAllDay: false,
        isTimeZones: false,
        fileData: ''
    });
    const [loading, setLoading] = useState(false)
    const [commentValue, setCommentValue] = useState("")
    const [leaveTypes, setLeaveTypes] = useState([])
    const [leaveStatusList, setLeaveStatusList] = useState([])
    const [leaveStatus, setLeaveStatus] = useState("")

    useEffect(() => {
        getLeaveTypesApi()
        getLeaveStatusesApi()

    }, [])

    useEffect(() => {
        if (route?.params?.leaveData) {
            console.log("leaveData", route?.params?.leaveData)
            const prefillData = route?.params?.leaveData
            const updatedData = { ...data }
            updatedData.leaveType = prefillData?.leave_type
            updatedData.startDateTime = prefillData?.start
            updatedData.endDateTime = prefillData?.finish
            updatedData.leaveType = prefillData?.leave_type
            setData(updatedData)
            setCommentValue(prefillData?.description)
        }
    }, [route, leaveTypes])

    useLayoutEffect(() => {
        props.navigation.setOptions({
            header: props => (
                <SafeAreaView style={{ backgroundColor: '#ffffff' }}>
                    <View>
                        <View
                            style={styles.headerWrapper}>
                            {DrawerIconComponent(props)}
                            <HeaderLogoComponent />
                            <View />
                        </View>
                        <View
                            style={styles.pageTitleView}>
                            <Text
                                style={{
                                    fontSize: normalizeSize(15),
                                    textAlign: 'center',
                                    color: '#fff',
                                }}>
                                {facilityName}
                            </Text>
                            <View />
                        </View>
                        <View
                            style={styles.backBtnWrapper}>
                            <TouchableOpacity
                                onPress={() => props.navigation.goBack()}
                                style={{ flex: 0.5 }}>
                                <Feather color={'#111'} size={32} name="chevron-left" />
                            </TouchableOpacity>
                            <Text
                                style={{
                                    fontSize: normalizeSize(18),
                                    flex: 1.5,
                                    textAlign: 'center'
                                }}>
                                Leave Request
                            </Text>
                            <View style={{ flex: 0.5, flexDirection: "row", alignItems: "flex-end", justifyContent: "flex-end", paddingRight: 10, }}>
                                {route?.params?.leaveData ?
                                    <View style={{ marginRight: 5 }}>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            underlayColor="white"
                                            onPress={() => onClickCancel()}
                                            style={styles.headerBtnWrapper}>
                                            <View
                                                style={[styles.headerBtnView, { borderColor: "red" }]}>
                                                <Image
                                                    style={{ width: 15, height: 15, tintColor: 'red' }}
                                                    resizeMode={'contain'}
                                                    source={require('../../Assets/Icons/redcross.png')}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    : null}
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        underlayColor="white"
                                            onPress={() => addLeaveRequestApi()}
                                        style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                        <View
                                            style={{
                                            alignSelf: 'flex-end',
                                            borderRadius: 10,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#1c78ba',
                                            paddingHorizontal:16,
                                            paddingVertical:6
                                            }}>
                                            <Text style={{color:"#fff",fontSize: height / 48}}>Save</Text>
                                        </View>
                                    </TouchableOpacity>
                            </View>
                            <View />
                        </View>
                    </View>
                </SafeAreaView>
            ),
        });
    }, [data]);

    const getLeaveTypesApi = async () => {
        setLoading(true)
        let URL = Config().getLeaveTypes
        await callGetRestApis(URL)
            .then((res) => {
                setLoading(false)
                if (res?.leave_types) {
                    const respData = res?.leave_types.map((item, index) => { return { id: index, label: item, value: item } })
                    console.log("respData", respData);

                    setLeaveTypes([...respData])
                }
                console.log('getLeaveTypesApi res :- ', res)

            })
            .catch((error) => {
                setLoading(false)
                console.log('getLeaveTypesApi error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })
    }

    const getLeaveStatusesApi = async () => {
        setLoading(true)
        let URL = Config().getLeaveStatus
        await callGetRestApis(URL)
            .then((res) => {
                setLoading(false)
                if (res?.statuses) {
                    const respStatusData = res?.statuses
                    setLeaveStatusList([...respStatusData])
                }
                console.log('getLeaveStatusesApi res :- ', res)
            })
            .catch((error) => {
                setLoading(false)
                console.log('getLeaveStatusesApi error :- ', error)
            })
    }

    useEffect(()=>{
       if(leaveStatusList?.length){
        let statusCode = "New Request"
        if(route?.params?.leaveData){
            const filterStatus = leaveStatusList.filter((el)=> el?.code == route?.params?.leaveData?.is_approved)
            statusCode = filterStatus[0]?.description
        }
        setLeaveStatus(statusCode)
       }
    },[leaveStatusList])

    const validateForm = () => {
        if (!data.employee) {
            Alert.alert('Alert', 'Please select Employee')
            return false
        }
        else if (!data.leaveType) {
            Alert.alert('Alert', 'Please select Leave Type')
            return false
        }
        else if (!data.startDateTime) {
            Alert.alert('Alert', 'Please select Start Time')
            return false
        }
        else if (!data.endDateTime) {
            Alert.alert('Alert', 'Please select End Time')
            return false
        }
        else if (!route?.params?.leaveData && !data.fileData) {
            Alert.alert('Alert', 'Please select a File')
            return false
        }
        else {
            return true
        }
    }

    const addLeaveRequestApi = async () => {
        console.log("data", data);
        const isFormValid = validateForm()
        if (isFormValid) {
            setLoading(true)
            try {
                let Url = Config().createLeaveRequest
                let formdata = new FormData();
                formdata.append("start", data.startDateTime)
                formdata.append("finish", data.endDateTime)
                formdata.append("leave_type", data.leaveType)
                formdata.append("description", commentValue)
                if (route?.params?.leaveData) {
                    Url = Config().updateLeaveRequest
                    formdata.append("leave_request_id", route?.params?.leaveData?.leave_request_id)
                }
                else {
                    let file = FileFun(data?.fileData)
                    formdata.append("medical_certificate", file)
                }


                console.log("ADD / UPDATE LEAVE REQUEST PARAMS:-", Url, formdata)

                await globalPostApi(Url, formdata)
                    .then((res) => {
                        setLoading(false)
                        console.log('addLeaveRequest res :- ', res);
                        if (res && res.success) {
                            showMessage({ message: 'Success', description: 'Leave Request added successfully.', type: "success", });
                            props.navigation.goBack()
                        }
                    })
                    .catch((error) => {
                        setLoading(false)
                        console.log('addLeaveRequest error :- ', error)
                        showMessage({ message: 'Error', description: error, type: "warning", });
                        props.navigation.goBack()
                    })
            } catch (error) {
                setLoading(false)
            }
        }
    }

    const onClickCancel = async () => {
        Alert.alert(
            'Cancel Request',
            'Are you sure you want to cancel this request?',
            [
                {
                    text: 'Cancel'
                },
                {
                    text: 'Submit',
                    onPress: () => onCancelLeaveApi(),
                },
            ],
            { cancelable: false },
        );
    }

    const onCancelLeaveApi = async () => {
        try {
            setLoading(true)
            const Url = Config().cancelLeaveRequest + '/' + route?.params?.leaveData?.leave_request_id
            await globalPostApi(Url)
                .then((res) => {
                    setLoading(false)
                    console.log('onCancelLeaveApi res :- ', res);
                    if (res && res?.message == "Leave request cancelled successfully") {
                        showMessage({ message: 'Success', description: res?.message, type: "success", });
                        props.navigation.goBack()
                    }
                })
                .catch((error) => {
                    setLoading(false)
                    console.log('onCancelLeaveApi error :- ', error)
                    showMessage({ message: 'Error', description: error, type: "warning", });
                })
        }
        catch (error) {
            setLoading(false)
        }
    }

    const handleCheckbox = (type) => {
        if (type === "All Day") {
            setData({ ...data, isAllDay: !data.isAllDay })
        }
        else {
            setData({ ...data, isTimeZones: !data.isTimeZones })
        }
    }

    const convertTimeFormat = (isoDateStr) => {
        return moment(isoDateStr).format("YYYY-MM-DD HH:mm:ss");
    };

    const onSelectDates = (dates) => {
        const start = convertTimeFormat(dates?.startDate)
        const finish = convertTimeFormat(dates?.endDate)

        setData({ ...data, startDateTime: start, endDateTime: finish })
    }
    const handleCommentChange = (text) => {
        setCommentValue(text)
    }

    return (
        <ScrollView
            contentContainerStyle={{ padding: 20, flexGrow: 1 }}
            keyboardShouldPersistTaps="handled" >
            {loading ? <Loader /> : null}
            {/* <CommonDropDown
                dropdownTitle="Employee"
                dropDownData={sampleDropdownData}
                onSelectItem={(val) => setData(prev => ({ ...prev, employee: val }))}
            /> */}
            <KeyboardAvoidingView style={{ flex: 1, }}>
                <View>
                    <Text style={styles.employeeTitle}>Employee</Text>
                    <View style={styles.employeeWrapper}>
                        <View style={styles.initialsWrapper}>
                            <Text style={styles.initialLabel}>{userInitials}</Text>
                        </View>
                        <Text style={styles.userLabel}>{userName}</Text>
                    </View>
                </View>
                <CommonDropDown
                    dropdownTitle="Leave Type"
                    defaultValue={route?.params?.leaveData?.leave_type}
                    dropDownData={leaveTypes}
                    zIndex={1000}
                    onSelectItem={(val) => setData(prev => ({ ...prev, leaveType: val?.value }))}
                />
                <View>
                    <Text style={{ fontSize: 15, fontWeight: "500", color: '#808080', marginTop: 10, marginBottom: 10 }}>
                        Comments
                    </Text>
                    <TextInput
                        style={{
                            fontSize: height / 45,
                            paddingVertical: height / 90,
                            paddingHorizontal: 10,
                            backgroundColor: 'white',
                            color: 'black',
                            borderColor: '#c5baba',
                            borderWidth: 2,
                            borderRadius: 5,
                        }}
                        placeholderTextColor="#7A7A7A"
                        keyboardShouldPersistTaps
                        value={commentValue}
                        onChangeText={handleCommentChange}
                    />
                </View>
                <View style={styles.requestTimeWrapper}>
                    <DateTimePickerSelect
                        onDateSelectSuccess={onSelectDates}
                        defaultStartTime={route?.params?.leaveData?.start}
                        defaultEndTime={route?.params?.leaveData?.finish} />
                </View>
                <View style={styles.checkBoxWrapper}>
                    <CheckBox
                        onPress={() => handleCheckbox('All Day')}
                        checked={data?.isAllDay}
                        checkedColor={Colors.APP_COLOR}
                        containerStyle={{ backgroundColor: "#666666", borderWidth: 0, }}
                        title={"All day"}
                        titleProps={{
                            style: { color: "#fff" }
                        }}
                    />
                    <CheckBox
                        onPress={() => handleCheckbox('Time Zones')}
                        checked={data?.isTimeZones}
                        checkedColor={Colors.APP_COLOR}
                        containerStyle={{ backgroundColor: "#666666", borderWidth: 0, }}
                        title={"Time zones"}
                        titleProps={{
                            style: { color: "#fff" }
                        }}
                    />
                </View>
                {!route?.params?.leaveData ?
                    <UploadComponent
                        onSuccessCallback={(resp) => setData(prev => ({ ...prev, fileData: resp }))}
                        onFileDeleteCallback={() => setData(prev => ({ ...prev, fileData: '' }))}
                    /> : null}

                <View style={styles.currentStateWrapper}>
                    <Text style={{ color: "#fff", fontWeight: "600" }}>Current State of Request : {leaveStatus}</Text>
                </View>

                <View style={styles.balanceWrapper}>
                    <Text style={{ color: "#fff", fontWeight: "600" }}>Current Leave Balance</Text>
                </View>
                <View style={styles.hoursWrapper}>
                    <Text style={{ color: "#000", fontWeight: "600" }}>Annul Leave : 150 Hrs</Text>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    requestTimeWrapper: {
        backgroundColor: "#666666",
        paddingVertical: 10,
        paddingVertical: 5,
        marginTop: 30
    },
    checkBoxWrapper: {
        marginTop: 15,
        backgroundColor: "#666666",
        paddingVertical: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
    },
    currentStateWrapper: {
        backgroundColor: "#000066",
        padding: 10,
        marginTop: 40,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 20
    },
    balanceWrapper: {
        backgroundColor: "#7ea6e0",
        padding: 10,
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    hoursWrapper: {
        backgroundColor: "#fff",
        padding: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    employeeTitle: {
        fontSize: 15,
        fontWeight: "500",
        color: '#808080',
        marginTop: 10,
        marginBottom: 10
    },
    employeeWrapper: {
        borderWidth: 2,
        borderRadius: 5,
        minHeight: 45,
        marginBottom: 20,
        backgroundColor: Colors.White,
        borderColor: Colors.Border,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    userLabel: {
        fontSize: 15,
        fontWeight: "500",
        color: '#000',
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 10
    },
    initialsWrapper: {
        backgroundColor: "#9eeefd",
        width: 25,
        height: 25,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    initialLabel: {
        fontSize: 12,
        color: '#000'
    },
    headerBtnWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerBtnView: {
        alignSelf: 'flex-end',
        width: 30,
        height: 30,
        borderRadius: 30 / 2,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#5cb85c',
    },
    headerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    pageTitleView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: '#1c78ba',
    },
    backBtnWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        paddingVertical: 4,
        backgroundColor: '#d9d9d9',
    }
})

export default AddLeave