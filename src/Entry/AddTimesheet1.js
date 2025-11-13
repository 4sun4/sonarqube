import React, { useRef, useEffect, memo } from 'react'
import { View, Text, Button, Image, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Dimensions, SafeAreaView } from 'react-native'
import { useState } from 'react';
import { connect } from 'react-redux';
import { callGetBodyApis, callGetRestApis } from '../Services/Api';
import { showMessage, hideMessage } from "react-native-flash-message";
import Loader from '../Components/Loader';
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { getDaysBetweenDates, populate_week_range_options, startOfWeek, sundaysInMonth } from '../Util/CommonFun';
import Config from '../Util/Config';
import Dropdown from '../Components/SelectPicker';
import Colors from '../Util/Colors';
import Types from '../redux/Types';
import { store } from '../redux/Store';

const HeaderAdd = require('../Assets/Icons/HeaderAdd.png')
const BlueEye = require('../Assets/Icons/BlueEye.png')

const AddTimesheet1 = (props) => {
    const [loading, setLoading] = useState(false)
    const [MyTimesheetData, setMyTimeSheetData] = useState([])
    const SelectedStoreTimeSheet = useSelector(S => { let D = ''; if (S && S.TimeSheetStore) { D = S.TimeSheetStore.SelectedTimeSheet; if (D) { } } return D })
    const [ShiftData, setShiftData] = useState([])
    const [SelectedTimeSheet, setSelectedTimeSheet] = useState(null)

    const dispatch = useDispatch()
    const screenwidth = Dimensions.get('window').width
    const screenheight = Dimensions.get('window').height
    const [data, setData] = useState({ username: '', password: '', confirmPassword: '', iconAnimating: false, isPasswordShow: true });
    const [AllTimeSheet, setAllTimeSheet] = useState([]);
    const [SavedFlag, setSavedFlag] = useState(false)
    const [DropdownData, setDropdownData] = useState([])
    const [allClockInData, setAllClockInData] = useState([]);

    const AllStoreTimeSheets = useSelector(S => { let D = ''; if (S && S.TimeSheetStore) { D = S.TimeSheetStore.AllTimeSheet; if (D) { } } return D })




    useEffect(async () => {
        const { TimeSheetStore: { SelectedTimeSheet } } = store.getState();
        const { route: { params } } = props
        setSavedFlag(params && params.SavedFlag)
        if (params && params.SavedFlag) {
            let arr = [], dateList = []
            if (AllStoreTimeSheets && AllStoreTimeSheets.length) {
                AllStoreTimeSheets.map((it, ind) => {
                    if (it.savedTimeSheet && it.savedTimeSheet.length) {
                        arr.push(`${it.client_name} #${it.order_id}`)
                        dateList.push(it)
                    }
                })
                setDropdownData(arr)
                setSelectedTimeSheet(dateList[0])
                getSelectedTimeSheet(dateList[0])
                let saveSheet = dateList.length ? dateList[0].savedTimeSheet : []
                setShiftData(saveSheet)
                dispatch({ type: Types.SELECTED_TIME_SHEET, data: dateList[0] })
            }

        } else {
            let DD = SelectedTimeSheet && SelectedTimeSheet.start_date ? moment(SelectedTimeSheet.start_date).format("DD") : 0
            let MM = SelectedTimeSheet && SelectedTimeSheet.start_date ? moment(SelectedTimeSheet.start_date).format("MM") : 0
            let YY = SelectedTimeSheet && SelectedTimeSheet.start_date ? moment(SelectedTimeSheet.start_date).format("YYYY") : 0
            let FDD = SelectedTimeSheet && SelectedTimeSheet.finish_date ? moment(SelectedTimeSheet.finish_date).format("DD") : 0
            let FMM = SelectedTimeSheet && SelectedTimeSheet.finish_date ? moment(SelectedTimeSheet.finish_date).format("MM") : 0
            let FYY = SelectedTimeSheet && SelectedTimeSheet.finish_date ? moment(SelectedTimeSheet.finish_date).format("YYYY") : 0
            let currentMnth = MM ? Number(MM) : new Date().getMonth() + 1
            let currentYear = YY ? Number(YY) : new Date().getFullYear()
            let finishMnth = FMM ? Number(FMM) : new Date().getMonth() + 1
            let finishYear = FYY ? Number(FYY) : new Date().getFullYear()
            let dateList = []
            if (SelectedTimeSheet && (SelectedTimeSheet.finish_date == "0000-00-00" || !SelectedTimeSheet.finish_date)) {
                // dateList = sundaysInMonth(currentMnth, currentYear, DD)
                FDD = moment().clone().endOf('isoWeek').format("DD")
                FMM = moment().clone().endOf('isoWeek').format("MM")
                FYY = moment().clone().endOf('isoWeek').format("YYYY")
                finishMnth = FMM ? Number(FMM) : new Date().getMonth() + 1
                finishYear = FYY ? Number(FYY) : new Date().getFullYear()

                let listData = {
                    startMnth: currentMnth, startYear: currentYear, DD: DD,
                    finishMnth: finishMnth, finishYear: finishYear, FDD: FDD,
                }
                dateList = populate_week_range_options(listData)
            } else {
                let listData = {
                    startMnth: currentMnth, startYear: currentYear, DD: DD,
                    finishMnth: finishMnth, finishYear: finishYear, FDD: FDD,
                }
                dateList = populate_week_range_options(listData)
            }
            // var dateList = sundaysInMonth(currentMnth, currentYear, DD)
            // console.log('dateListdateList', dateList,);
            await setShiftData(dateList)
            setSelectedTimeSheet(SelectedStoreTimeSheet)
            getSelectedTimeSheet(SelectedStoreTimeSheet)
        }
    }, [])


    const getSelectedTimeSheet = async (data) => {
        if (data) {
            const { order_id } = data
            await getTimesheets(order_id)
        }

    }


    const getTimesheets = async (orderId) => {
        let URL = Config().GetTimesheets
        // console.log('URL', URL);
        setLoading(true)
        let data = { "order_id": orderId ? orderId : 0 }
        await callGetBodyApis(URL, data)
            .then(async (res) => {
                setLoading(false)
                if (res) { setAllTimeSheet(res) }
                // console.log('getTimesheets res :- ', res)
            })
            .catch((error) => {
                setLoading(false)
                console.log('getTimesheets error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })

    }



    const getClockIns = async (end) => {
        let ClockStoreData = store.getState().JobStore.AllClockInData
        let orderId = SelectedTimeSheet && SelectedTimeSheet.order_id ? SelectedTimeSheet.order_id : 0
        let URL = Config().getClockIns
        let arr = []

        setLoading(true)
        let data = {
            "order_id": orderId ? orderId : 0,
            "week_ending": end,
            // "week_ending": moment().clone().endOf('isoWeek').format("YYYY-MM-DD"),

        }
        return callGetBodyApis(URL, data)
            .then(async (res) => {
                setLoading(false)
                // console.log('getClockIns res :- ', res, 'ClockStoreData', ClockStoreData)

                if (res && res.length) {
                    setAllClockInData(res)
                    if (ClockStoreData.length) {
                        res.forEach(el => {
                            arr = []
                            ClockStoreData.map(val => {
                                if (el.order_id == val.order_id) {
                                    arr.push(val)
                                    return arr
                                }
                            })

                        });
                        return arr
                    } else {
                        // console.log('resresresres', res);
                        return [...res]

                    }

                }
                return arr
            })
            .catch((error) => {
                setLoading(false)
                console.log('getClockIns error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })

    }



    const CheckSaveSheet = async (resArr, end, clockInData) => {
        const { order_id } = SelectedTimeSheet
        let arr = []
        clockInData.length && clockInData.forEach((val, index) => {
            if (order_id == val.order_id) {
                let Start_d = moment(val.time_in)
                let Finish_d = moment(val.time_out)
                arr.push({
                    date: moment(val.time_in).format('YYYY-MM-DD'),
                    dayname: moment(val.time_in).format('dddd'),
                    shifts: [{
                        editable: true,
                        shift_notes: val.note ? val.note + " " : val.shiftnote ? '' + val.shiftnote : '', shift_type_ind: 0, shift_type: '', shift_type_id: 1, shift_status_id: 1,
                        start: val && val.time_in ? new Date(Start_d) : null, finish: val && val.time_out ? new Date(Finish_d) : null, startdateStatus: false, finishdateStatus: false,
                        breaks: val.breaks && val.breaks.length ? val.breaks : [{ start: null, finish: null, startdateStatus: false, finishdateStatus: false, }]
                    }]

                })

            }
        })


        let obj = {}
        for (let i = 0; i < arr.length; i++) {
            const el = arr[i];
            let Arr = []
            el.shifts.forEach(item => {
                if (item.start && item.finish) {

                    let shift_start = new Date(item.start)
                    let shift_finish = new Date(item.finish)


                    let brk = item.breaks.length && item.breaks[0].start ? item.breaks.map(it => {
                        let break_start = new Date(it.start)
                        let break_finish = new Date(it.finish)

                        return {
                            start: break_start ? moment(break_start, 'hh:mm A').format('YYYY-MM-DD HH:mm:ss') : '',
                            finish: break_finish ? moment(break_finish, 'hh:mm A').format('YYYY-MM-DD HH:mm:ss') : ''
                        }
                    }) : { start: null, finish: null, startdateStatus: false, finishdateStatus: false, }
                    // console.log('item.start', shift_start);
                    Arr.push({
                        shift_notes: item.shift_notes,
                        start: shift_start ? moment(shift_start, 'hh:mm A').format('YYYY-MM-DD HH:mm:ss') : '',
                        finish: shift_finish ? moment(shift_finish, 'hh:mm A').format('YYYY-MM-DD HH:mm:ss') : '',
                        breaks: brk, shift_type_id: item.shift_type_id, shift_status_id: item.shift_status_id,
                    })

                }

            })

            if (Arr.length) {
                obj[el.date] = { shifts: Arr }
            }
        }

        if (AllStoreTimeSheets && AllStoreTimeSheets.length) {
            const { order_id } = SelectedTimeSheet
            let sheetArr = []
            const date = moment(end, 'YYYY-MM-DD').format('DD')

            let alldata = AllStoreTimeSheets.map((item, index) => {
                if (item.order_id == order_id) {
                    let status = false
                    item.savedTimeSheet.length ? item.savedTimeSheet.filter(it => {
                        const storeDate = moment(it.date, 'DD/MM/YYYY').format('DD')
                        if (storeDate == date) { status = true }
                    }) : []
                    if (status) {
                        return { ...item, savedTimeSheet: [{ date: moment(end, 'YYYY-MM-DD').format('DD/MM/YYYY'), shiftArr: arr, api: obj }] }
                    } else {
                        return { ...item, savedTimeSheet: [...item.savedTimeSheet, { date: moment(end, 'YYYY-MM-DD').format('DD/MM/YYYY'), shiftArr: arr, api: obj }] }
                    }
                }
                return item
            })

            // console.log('alldata', alldata);
            dispatch({ type: Types.ALL_TIME_SHEET, data: alldata })
        }



    }




    const handleEffectFun = async (selitem, index) => {
        let today = moment();
        let week_ending = selitem.date ? selitem.date : ''
        let end = moment(week_ending, 'DD/MM/YYYY').format('YYYY-MM-DD')

        // console.log('endendend', end);


        let isWeekendGreater = moment(end) > today
        let weekendDate = moment(end)
        let start = startOfWeek(new Date(weekendDate))
        let startDate = moment(start).format('YYYY-MM-DD')
        const OrderDate = SelectedTimeSheet && SelectedTimeSheet.start_date ? moment(SelectedTimeSheet.start_date).format("DD/MM/YYYY") : selitem.date
        let orderStart = moment(OrderDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
        var input = moment(orderStart);
        var isThisWeek = (weekendDate.isoWeek() == input.isoWeek())
        const weekStart = isThisWeek ? moment(orderStart) : moment(startDate);
        let dateList = getDaysBetweenDates(weekStart, weekendDate);
        // console.log('dateList', dateList);
        let obj = {}
        AllTimeSheet.map((item, index) => {
            obj[item.week_ending] = { start: item.start, finish: item.finish }
        })
        let SelctedDate = moment(selitem.date, 'DD/MM/YYYY').format('YYYY-MM-DD')
        let getSubmitData = obj[SelctedDate]

        // console.log('getSubmitData', getSubmitData);

        if (getSubmitData) {
            var startDate1 = new Date(getSubmitData.start);
            var endDate1 = new Date(getSubmitData.finish);
            let resultData = []
            dateList.filter(function (a) {
                let date = new Date(a.date)
                if (date < startDate1 || date > endDate1) { resultData.push(a) }
            });
            // console.log('resultData', resultData);
            if (!resultData.length) {
                alert('You have already submited for this week')
            } else {
                const OrderDate = SelectedTimeSheet && SelectedTimeSheet.start_date ? moment(SelectedTimeSheet.start_date).format("DD/MM/YYYY") : selitem.date
                let clockInData = await getClockIns(end)
                if (clockInData.length) { await CheckSaveSheet(resultData, end, clockInData) }
                props.navigation.navigate('AddTimesheet2', { timeSheetData: selitem, Ind: index, OrderDate: OrderDate, isThisWeek: isThisWeek })


            }
        }
        else {
            const OrderDate = SelectedTimeSheet && SelectedTimeSheet.start_date ? moment(SelectedTimeSheet.start_date).format("DD/MM/YYYY") : selitem.date
            let clockInData = await getClockIns(end)
            if (clockInData.length) { await CheckSaveSheet(dateList, end, clockInData) }
            props.navigation.navigate('AddTimesheet2', { timeSheetData: selitem, Ind: index, OrderDate: OrderDate, isThisWeek: isThisWeek })

            // console.log('abcabc', clockInData);

        }
    }

    const handleSelectedDropdownItem = (item, index) => {
        // console.log('---item--', item, index);
        let it = AllStoreTimeSheets && AllStoreTimeSheets.length ? AllStoreTimeSheets[index] : null
        setSelectedTimeSheet(it)
        getSelectedTimeSheet(it)
        setShiftData(it.savedTimeSheet)
        dispatch({ type: Types.SELECTED_TIME_SHEET, data: it })
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            {loading ? <Loader /> : null}

            <View style={styles.container}>
                {SavedFlag && !DropdownData.length ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontWeight: '700', fontSize: 18 }}>No Time Sheet Saved</Text>
                    </View>
                    :

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <KeyboardAvoidingView>
                            <View style={{ width: '100%', paddingVertical: 20 }}>
                                <Text style={{ fontSize: 14 }}>
                                    Company
                                </Text>
                                <View>

                                    {!SavedFlag ?
                                        <TextInput
                                            style={{ borderBottomWidth: 1, height: 40, borderColor: '#D8D8D8', fontSize: 18, backgroundColor: '#F6F6F6', color: 'black' }}
                                            value={SelectedTimeSheet && SelectedTimeSheet.client_name ? SelectedTimeSheet.client_name : ''}
                                            keyboardShouldPersistTaps
                                            editable={false}
                                            onChangeText={(value) => setData({ ...data, username: value })}
                                        />
                                        : <Dropdown
                                            defaultButtonText={'Select Value'}
                                            statusBarTranslucent={true}
                                            defaultSelection={true}
                                            dropdownButton={{
                                                borderColor: '#D8D8D8', backgroundColor: '#F6F6F6',
                                                borderWidth: 0, borderBottomWidth: 1, alignSelf: 'center',
                                            }}
                                            dropdownTextStyle={{ color: Colors.Black, fontSize: 18, }}
                                            isIcon={true}
                                            dropdownData={DropdownData}
                                            selectedDropdownItem={(item, index) => handleSelectedDropdownItem(item, index)}
                                        />
                                    }
                                </View>
                                <View style={{ paddingVertical: 20 }}>
                                    <Text style={{ fontSize: 16 }}>
                                        As {SelectedTimeSheet && SelectedTimeSheet.Job ? SelectedTimeSheet.Job : ''}
                                    </Text>
                                </View>

                                <View style={{ backgroundColor: '#FFF', borderRadius: 10, paddingVertical: 20, paddingHorizontal: 20 }}>
                                    <View style={{ paddingBottom: 20, borderBottomColor: '#DCDCDC', borderBottomWidth: 1 }}>
                                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                            Week Ending
                                        </Text>
                                    </View>

                                    <View>
                                        {
                                            ShiftData.length > 0 ? ShiftData.map((item, index) => {

                                                let week_ends = moment(item.date, 'DD/MM/YYYY').format('YYYY-MM-DD')
                                                var input = moment(week_ends);
                                                const isThisWeek = (input.isoWeek() > moment().isoWeek())

                                                if (!isThisWeek) {
                                                    return (
                                                        <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 20, borderBottomColor: '#DCDCDC', borderBottomWidth: 1 }}>
                                                            <Text style={{ fontWeight: 'bold', fontSize: 16, opacity: isThisWeek ? 0.5 : 1 }}>
                                                                {item.date}
                                                            </Text>
                                                            <TouchableOpacity disabled={isThisWeek} onPress={() => handleEffectFun(item, index)}>
                                                                {/* props.navigation.navigate(SavedFlag ?'SavedTimeSheet':'AddTimesheet2', { timeSheetData: item })}> */}
                                                                <Image
                                                                    style={{ width: 20, height: 20, opacity: isThisWeek ? 0.5 : 1 }} resizeMode={'contain'}
                                                                    source={SavedFlag ? BlueEye : HeaderAdd} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    )
                                                }


                                            }) : null
                                        }
                                    </View>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </ScrollView>
                }
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

export default memo(AddTimesheet1)




// if (index==0) {
//     let dateobj={date:SelectedTimeSheet&&SelectedTimeSheet.start_date? moment(SelectedTimeSheet.start_date).format("DD/MM/YYYY"):selitem.date}
// } else {
// props.navigation.navigate('AddTimesheet2', { timeSheetData: selitem })
// }