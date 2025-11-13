import React, { useRef, useEffect } from 'react'
import { View, Text, Button, Image, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Dimensions, SafeAreaView } from 'react-native'
import { useState } from 'react';
import { connect } from 'react-redux';
import Loader from '../Components/Loader';
import { callGetBodyApis, callGetRestApis } from '../Services/Api';
import moment from 'moment'
import Config from '../Util/Config';
import { showMessage, hideMessage } from "react-native-flash-message";
const { height, width } = Dimensions.get('window');

const TimesheetDetail = ({ navigation, route: { params } }) => {
    const [MyTimesheetData, setMyTimeSheetData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [TimesheetDetail, setTimesheetDetail] = useState(null)
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [details, setTimesheetDetails] = useState([])
    const [TimesheetStatus, setTimesheetStatus] = useState([])
    const [ApproverData, setApproverData] = useState([]);
    const [ApproverType, setApproverType] = useState('');
    const [ApproverName, setApproverName] = useState('');

    useEffect(async () => {
        console.log('params', params);

        const unsubscribe = navigation.addListener("focus", async () => {
            getTimesheetStatuses()
            if (params && params.TimesheetData) {
                const { order_id } = params.TimesheetData
                await setMyTimeSheetData(params.TimesheetData)
                getTimesheets(order_id)
                getTimesheetApprovers(order_id)
            }
        });
        return unsubscribe;
    }, [])

    const getTimesheets = async (orderId) => {
        let URL = Config().GetTimesheets
        console.log('URL', URL);
        setLoading(true)
        let data = {
            "order_id": orderId ? orderId : 0
        }
        await callGetBodyApis(URL, data)
            .then((res) => {
                setLoading(false)
                if (res) { setTimesheetDetails(res) }
                console.log('getTimesheets res :- ', res)
            })
            .catch((error) => {
                setLoading(false)
                console.log('getTimesheets error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })

    }

    const Details = () => {
        return (
            <View style={{ justifyContent: 'space-between', flex: 1, paddingHorizontal: 25, backgroundColor: '#FFF' }}>
                <Text style={{ color: '#000', fontSize: 15, paddingBottom: 5 }}>{ApproverType ? ApproverType : ''} {ApproverName ? ApproverName : ''}</Text>

                {
                    TimesheetDetail && TimesheetDetail.shiftArr.length > 0 ? TimesheetDetail.shiftArr.map((item, index) => {
                        let fixedHrs = 0, TotalHours = 0
                        return (
                            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, flex: 1, borderTopColor: "#DCDCDC", borderTopWidth: 1, }}>
                                <View>
                                    <Text style={{ color: '#000', fontSize: 14, fontWeight: '600' }}>{moment(item.date).format("ddd, Do")}</Text>
                                    {item.shiftdata.map((shiftItem, shiftInd) => {
                                        let min = (moment(shiftItem.finish).diff(shiftItem.start, 'minutes'))
                                        TotalHours = TotalHours + Math.abs(min)
                                        fixedHrs = (TotalHours / 60).toFixed(2)
                                        return (
                                            <View key={shiftInd} style={{ flex: 1 }}>
                                                <Text style={{ color: '#000', fontSize: 14, paddingVertical: 8, }}>Shift: {shiftItem.start ? moment(shiftItem.start).format('hh:mm A') : ''} - {shiftItem.finish ? moment(shiftItem.finish).format('hh:mm A') : ''} </Text>
                                                {shiftItem.breaksArr && shiftItem.breaksArr.length && shiftItem.breaksArr.map((breakItem, breakInd) => breakItem.start ?
                                                    <Text key={breakInd} style={{ color: '#000', fontSize: 14, paddingBottom: 5 }}>{breakItem.start ? `Break: ${moment(breakItem.start).format('hh:mm A')} - ${breakItem.finish ? moment(breakItem.finish).format('hh:mm A') : ''}` : ''}</Text> : null)

                                                }
                                            </View>
                                        )
                                    })}

                                </View>
                                <View style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 14 }}>
                                        {fixedHrs ? fixedHrs : 0} hrs
                                    </Text>


                                </View>
                            </View>
                        )
                    }) : null
                }


            </View>
        )
    }


    const handletoggle = async (item, index) => {
        setTimesheetDetail(null)
        await setSelectedIndex(index == selectedIndex ? null : index)

        if (index != selectedIndex && item.timesheet_id) {
            getTimesheetsToggleData(item.timesheet_id)
        }
    }
    const getTimesheetsToggleData = async (timesheet_id) => {
        let URL = Config().GetTimesheetData
        console.log('URL', URL);
        setLoading(true)
        let data = { "timesheet_id": timesheet_id ? timesheet_id : 0 }
        await callGetBodyApis(URL, data)
            .then((res) => {
                setLoading(false)
                if (res) {
                    let arr = []
                    if (res.shifts) {
                        for (const [key, value] of Object.entries(res.shifts)) {
                            let val = Object.values(value).length != 0 ? Object.values(value) : []

                            val.length && val.map((item, ind) => {
                                if (item.breaks) {
                                    let breakValue = Object.values(item.breaks).length ? Object.values(item.breaks) : []
                                    item['breaksArr'] = breakValue
                                }
                            })
                            arr.push({ date: key, shiftdata: val })
                        }
                    }
                    setTimesheetDetail({ ...res, shiftArr: arr })

                    let approver_arr = TimesheetStatus.filter(el => el.timesheet_shift_status_id == res.status_id)
                    let approver_obj = approver_arr.length ? approver_arr[0] : {}
                    let appr_name = approver_obj.value && (approver_obj.value.includes('Approved - Supervisor') ? 'Approved - Supervisor' : approver_obj.value.includes('Approved - Manager') ? 'Approved - Manager' : '')
                    let appr_id = appr_name.includes('Approved - Supervisor') ? res.supervisor_approver_id : appr_name.includes('Approved - Manager') ? res.manager_approver_id : 0

                    //    appr_name="Approved - Manager"
                    //    appr_id="6"
                    if (approver_obj && approver_obj.value) {
                        if ((appr_name.includes('Approved - Supervisor') || appr_name.includes('Approved - Manager')) && appr_id) {
                            let apprType_arr = ApproverData.length && ApproverData.filter(el => el.approver_id == appr_id)
                            let { approver_name } = apprType_arr.length ? apprType_arr[0] : {}
                            setApproverName(approver_name ? approver_name : '')
                        }
                    }
                    setApproverType(approver_obj.value ? approver_obj.value : '')

                }
                console.log('GetTimesheetData res :- ', res)
            })
            .catch((error) => {
                setLoading(false)
                console.log('GetTimesheetData error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })

    }


    const getTimesheetStatuses = async () => {
        let URL = Config().getTimesheetStatuses
        setLoading(true)
        await callGetRestApis(URL)
            .then((res) => {
                setLoading(false)
                if (res) { setTimesheetStatus(res) }
                console.log('getTimesheetStatuses res :- ', res)

            })
            .catch((error) => {
                setLoading(false)
                console.log('getTimesheetStatuses error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })

    }


    const getTimesheetApprovers = async (order_id) => {
        let URL = Config().getTimesheetApprovers
        console.log('URL', URL,order_id);
        setLoading(true)
        let data = { "order_id": order_id }
        await callGetBodyApis(URL, data)
            .then((res) => {
                setLoading(false)
                if (res && res.length) { setApproverData(res) }
                console.log('getTimesheetApprovers res :- ', res)
            })
            .catch((error) => {
                setLoading(false)
                console.log('getTimesheetApprovers error :- ', error)
                // showMessage({ message: 'Error', description: error, type: "warning", });
            })

    }

    console.log('ApproverType', ApproverType);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {loading ? <Loader /> : null}
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <KeyboardAvoidingView>
                        <View style={{ width: '100%', paddingVertical: 20 }}>
                            <View style={{}}>
                                <Text style={{ fontSize: 20, marginTop: 5 }}>
                                    Company name - {MyTimesheetData && MyTimesheetData.client_name ? MyTimesheetData.client_name : ''}
                                </Text>

                                <Text style={{ fontSize: 18, marginVertical: 10 }}>
                                    Start Date - {MyTimesheetData && MyTimesheetData.start_date ? moment(MyTimesheetData.start_date).format("DD/MM/YYYY") : ''}
                                </Text>

                                <Text style={{ fontSize: 20 }}>
                                    Job - {MyTimesheetData && MyTimesheetData.Job ? MyTimesheetData.Job : ''}

                                </Text>
                            </View>
                            {details.length > 0 ? details.map((item, index) => {
                                return (
                                    <View key={index} style={{ marginVertical: 8 }}>
                                        <View style={{ justifyContent: 'space-between', flex: 1, paddingVertical: 20, paddingHorizontal: 20, backgroundColor: '#FFF' }}>
                                            <TouchableOpacity activeOpacity={1} onPress={() => handletoggle(item, index)}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                                                    <View>
                                                        <Text style={{ color: '#000', fontSize: 18, fontWeight: '700' }}>{item.start ? moment(item.start).format('DD/MM/YYYY') : ''} {item.finish ? `- ${moment(item.finish).format('DD/MM/YYYY')}` : ''}</Text>
                                                        <Text style={{ color: '#000', fontSize: 15, marginTop: 18 }}>{item.shift_count ? item.shift_count : '0'} Shifts</Text>
                                                    </View>
                                                    <View style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Image
                                                            style={{ width: 15, height: 15 }}
                                                            resizeMode={'contain'}
                                                            source={index === selectedIndex ? require('../Assets/Icons/AccordionUp.png') : require('../Assets/Icons/AccordionDown.png')} />


                                                    </View>
                                                </View>
                                            </TouchableOpacity>

                                        </View>
                                        {index === selectedIndex ? <Details /> : null}
                                    </View>
                                )
                            }) : !loading&&  <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: height / 3 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: height / 40 }}>No Data Found</Text>
                            </View>
                            }
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>

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

export default TimesheetDetail
