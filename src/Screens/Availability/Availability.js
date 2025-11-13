import React, { useState, useEffect, Children } from 'react'
import { View, Text, FlatList, Dimensions, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import Loader from '../../Components/Loader';
import SliderComp from '../../Components/Slider';
import { callGetRestApis, CallPostRestApi, globalPostApi } from '../../Services/Api';
import Colors from '../../Util/Colors';
import Config from '../../Util/Config';
import Styles from '../../Util/Styles';
import { showMessage, hideMessage } from "react-native-flash-message";
import moment from 'moment';

const { height, width } = Dimensions.get('window');
const Margin = width / 20
const MinMargin = width / 40
const ArrowFwd = require('../../Assets/Icons/ArrowFwd.png')

const Availability = (props) => {
    const [loading, setLoading] = useState(false)
    const [MyFileData, setMyFileData] = useState([])
    const [SliderVal, setSliderVal] = useState(0)
    const [leaveBalance,setLeaveBalance] = useState("")

    const [data, setData] = useState({
        inAppMessage: true,
        geolocation: false,
        notifyJobCloseBy: true,
        subscribeNewsletter: true,
    });
    const [leaveRequests, setLeaveRequests] = useState([])

    const tabActionBtn = (navigateUrl) => {
        props.navigation.navigate(navigateUrl)
    }

    useEffect(() => {
        const unsubscribe = props.navigation.addListener("focus", async () => {
            getCandidateTravelDistance()
            getCandidateStatus()
            getCandidateLeaveRequests()
            getCandidateLeaveBalance()
        });
        return unsubscribe;
    }, [])

    const getCandidateLeaveRequests = async () => {
        let URL = Config().getLeaveRequests
        console.log('URL', URL);
        setLoading(true)
        await globalPostApi(URL)
            .then((res) => {
                setLoading(false)
                if (res?.leave_requests) {
                    setLeaveRequests(res?.leave_requests)
                }
                console.log('getCandidateLeaveRequests res :- ', res)
            })
            .catch((error) => {
                setLoading(false)
                console.log('getCandidateLeaveRequests error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })
    }

      const getCandidateLeaveBalance = async () => {
        let URL = Config().getLeaveBalance
        console.log('URL', URL);
        setLoading(true)
        await callGetRestApis(URL)
            .then((res) => {
                setLoading(false)
                if (res?.leave_balance) {
                    const balance = res?.leave_balance['Annual Leave']?.Balance ? res?.leave_balance['Annual Leave']?.Balance?.toFixed(2) : 0
                    setLeaveBalance(balance)
                }
                console.log('getCandidateLeaveBalance res :-', res)
            })
            .catch((error) => {
                setLoading(false)
                console.log('getCandidateLeaveBalance error :- ', error)
            })
    }

    const handleValueChange = (val) => {
        let [l] = val ? val : []
        setSliderVal(l)
        updateCandidateTravelDistance(l)
    };

    const updateCandidateStatus = async () => {
        setLoading(true)
        let formdata = new FormData();
        formdata.append("status", !data.inAppMessage ? 1 : 0),
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
                showMessage({ message: 'Error', description: error, type: "warning", });
            })

    }

    const updateCandidateTravelDistance = async (l) => {
        setLoading(true)
        let formdata = new FormData();
        formdata.append("travelDistance", l),
            console.log('formdata', formdata);
        let Url = Config().updateCandidateTravelDistance
        await globalPostApi(Url, formdata)
            .then((res) => {
                setLoading(false)
                console.log('updateCandidateTravelDistance res :- ', res);
                // showMessage({ message: 'Success', description: "Candidate Travel Distance successfully updated!", type: "success", });
            })
            .catch((error) => {
                setLoading(false)
                console.log('updateCandidateTravelDistance error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })
    }

    const handleToggle = async () => {
        await setData({ ...data, inAppMessage: !data.inAppMessage })
        updateCandidateStatus()

    }
    const getCandidateTravelDistance = async () => {
        let URL = Config().getCandidateTravelDistance
        console.log('URL', URL);
        setLoading(true)
        await callGetRestApis(URL)
            .then((res) => {
                setLoading(false)
                if (res) {
                    setSliderVal(Number(res.travelDistance))
                }
                console.log('getCandidateTravelDistance res :- ', res)

            })
            .catch((error) => {
                setLoading(false)

                console.log('getCandidateTravelDistance error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })

    }

    const getCandidateStatus = async () => {
        let URL = Config().getCandidateStatus
        console.log('URL', URL);
        setLoading(true)
        await callGetRestApis(URL)
            .then((res) => {
                setLoading(false)
                if (res) {
                    setData({ ...data, inAppMessage: res.status ? true : false })
                }
                console.log('getCandidateStatus res :- ', res)

            })
            .catch((error) => {
                setLoading(false)
                console.log('getCandidateStatus error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })

    }

    const getLeaveStatusImage = (approvalStatus) => {
        if (approvalStatus == 3) {
            return require('../../Assets/Icons/HeaderCheck.png')
        }
        else {
            return require('../../Assets/Icons/SidebarInformation.png')
        }
    }
    return (
        <View style={styles.container}>
            {loading ? <Loader /> : null}
            <ScrollView>
                <View style={{ flex: 1, padding: Margin, }}>
                    {/* <View style={{ marginTop: MinMargin, borderWidth: 1, borderColor: '#DDD', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 25, paddingHorizontal: 25, backgroundColor: '#FFF' }}>
                        <TouchableOpacity activeOpacity={1} onPress={() => handleToggle()}>
                            <Image
                                style={{ width: 50, height: 25 }}
                                resizeMode={'contain'}
                                source={data.inAppMessage ? require('../../Assets/Icons/SwitchOn.png') : require('../../Assets/Icons/SwitchOff.png')} />
                        </TouchableOpacity>

                        <View style={{ flex: 1, marginHorizontal: Margin }}>
                            <Text style={{ color: '#000', fontSize: height / 40 }}>I am currently available forwork!</Text>
                        </View>
                        <View>

                        </View>
                    </View> */}

                    <View style={{
                        marginTop: MinMargin, borderWidth: 2, backgroundColor: '#fff', shadowColor: '#000',
                        shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.4, shadowRadius: 3, elevation: 5,
                        borderColor: '#DDD', padding: Margin, backgroundColor: '#FFF'
                    }}>
                        <Text style={{ color: '#000', fontSize: height / 40 }}>Maximum travel from home</Text>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: Margin }}>
                            <SliderComp sliderVal={SliderVal} CheckRating={true} rangeDisabled={true} handleValue={(l, h) => handleValueChange(l)} LowVal={0} HighVal={200} {...props} />
                        </View>
                        <View style={Styles().horizontalContainer}>
                            <Text style={Styles().valueText}>{0} Km</Text>
                            <Text style={Styles().valueText}>{200} Km</Text>
                        </View>

                    </View>
                    <TouchableOpacity onPress={() => tabActionBtn('ShiftPreferences')} style={{ backgroundColor: '#FFFFFF', marginTop: 30, paddingLeft: 16, paddingRight: 8, paddingVertical: 12, borderWidth: 2, borderRadius: height / 90, borderColor: Colors.Border, justifyContent: 'space-between', flexDirection: 'row' }}>
                        <Text style={{ color: 'black', fontSize: height / 45, }}>{'Shift Preference'}</Text>
                        <Image
                            style={{ width: 22, height: 18, alignSelf: 'center' }}
                            resizeMode={'contain'}
                            source={ArrowFwd} />
                    </TouchableOpacity>


                    <View style={{ backgroundColor: "#7ea6e0", padding: 10, marginTop: 40, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: "#fff", fontWeight: "600" }}>Current Leave Balance</Text>
                    </View>
                    <View style={{ borderWidth: 1, padding: 10, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: "#000", fontWeight: "600" }}>Annul Leave : {leaveBalance ? `${leaveBalance}hrs`: '0hrs'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, borderBottomColor: 'grey', borderBottomWidth: 1 }}>
                        <Text style={{
                            fontSize: 18, fontWeight: 'bold', textAlignVertical: 'bottom',
                        }}>Leave Requests</Text>
                        <TouchableOpacity
                            onPress={() => { props.navigation.navigate('AddLeave') }}
                            style={{ borderRadius: 100, padding: 12, backgroundColor: '#E8E8E8', alignSelf: 'center' }}>
                            <Image
                                style={{ width: 18, height: 18, alignSelf: 'center' }}
                                resizeMode={'contain'}
                                source={require('../../Assets/Icons/HeaderAdd.png')} />
                        </TouchableOpacity>
                    </View>

                    {leaveRequests?.length > 0 && leaveRequests.map((item) => {
                        const startDate = item?.start ? moment(item?.start, "YYYY-MM-DD HH:mm:ss").format("Do MMMM, YYYY") : ""
                        const endDate = item?.finish ? moment(item?.finish, "YYYY-MM-DD HH:mm:ss").format("Do MMMM, YYYY") : ""
                        const sudmittedDate = item?.created_at ? moment(item?.created_at, "YYYY-MM-DD HH:mm:ss").format("D MMM YYYY") : ""
                        return (
                            <TouchableOpacity
                                key={item?.leave_request_id}
                                activeOpacity={1}
                                onPress={() => props.navigation.navigate('AddLeave',{leaveData:item})}>
                                <View
                                    style={styles.leaveItemCard}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={styles.itemImageWrapper}>
                                            <Image
                                                style={{ width: 16, height: 20 }}
                                                resizeMode={'contain'}
                                                source={getLeaveStatusImage(item?.is_approved)} />
                                        </View>
                                        <View style={{ flex: 1, paddingHorizontal: 10 }}>
                                            <Text style={{ fontSize: 12, color: '#aca591' }}>{startDate} to {endDate}</Text>
                                            <Text>{item?.leave_type}</Text>
                                        </View>
                                        <View style={{}}>
                                            <TouchableOpacity activeOpacity={8} underlayColor="white"
                                               onPress={() => props.navigation.navigate('AddLeave',{leaveData:item})}
                                                style={{ alignItems: 'flex-end', justifyContent: 'flex-end', paddingRight: 10 }}>
                                                <Image
                                                    style={{ width: 22, height: 18, alignSelf: 'center' }}
                                                    resizeMode={'contain'}
                                                    source={require('../../Assets/Icons/HeaderEdit.png')} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    {sudmittedDate ?
                                        <View style={{ flexDirection: "row", marginTop: 5 }}>
                                            <View style={{ paddingHorizontal: 8, paddingVertical: 6, borderRadius: 4, alignSelf: 'center' }}>
                                                <Image
                                                    style={{ width: 16, height: 20 }}
                                                    resizeMode={'contain'}
                                                    source={require('../../Assets/Icons/ArrowCurve.png')} />
                                            </View>
                                            <Text style={{ paddingLeft: 10, marginTop: 5 }}>Submitted on {sudmittedDate}</Text>
                                        </View>
                                        : null}
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                    {/* <TouchableOpacity onPress={() => tabActionBtn('ShiftAvailability')} style={{ backgroundColor: '#FFFFFF', marginTop: MinMargin, padding: Margin, borderWidth: 1, borderRadius: height / 90, borderColor: Colors.Border, justifyContent: 'space-between', flexDirection: 'row' }}>
                        <Text style={{ fontSize: height / 45, }}>{'Shift Availability'}</Text>
                        <Image
                            style={{ width: 22, height: 18, alignSelf: 'center' }}
                            resizeMode={'contain'}
                            source={ArrowFwd} />
                    </TouchableOpacity> */}
                </View>

            </ScrollView>

        </View>
    )
}

export default Availability
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.ThemeBackground,
    },
    leaveItemCard: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 10,
        backgroundColor: '#ffe26e'
    },
    itemImageWrapper: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 4,
        backgroundColor: '#fff',
        alignSelf: 'center'
    }
});