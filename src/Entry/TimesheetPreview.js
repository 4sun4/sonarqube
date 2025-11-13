import React, { useRef, useEffect } from 'react'
import { View, Text, Button, Image, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Dimensions, SafeAreaView } from 'react-native'
import { useState } from 'react';
import { connect } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { timeDiffCalc } from '../Util/CommonFun';
import Types from '../redux/Types';
import Loader from '../Components/Loader';
import Colors from '../Util/Colors';

const TimesheetPreview = (props) => {
    const AddTimeSheetData = useSelector(S => { let D = ''; if (S && S.TimeSheetStore) { D = S.TimeSheetStore.AddTimeSheetData; if (D) { } } return D })

    let { SelectedTimeSheet, WeekEnd, api, shiftArr } = AddTimeSheetData
    const dispatch = useDispatch()

    console.log('api', api);
    const screenwidth = Dimensions.get('window').width
    const screenheight = Dimensions.get('window').height
    const [data, setData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        iconAnimating: false,
        isPasswordShow: true
    });
    const [TotalHrs, setTotalHrs] = useState('');
    const [Meal, setMeal] = useState('');
    const [Payroll, setPayroll] = useState('');
    const [ShiftArray, setShiftArray] = useState([]);

    const [selectedIndex, setSelectedIndex] = useState(null);


    useEffect(() => {
        let TotalHours = 0,breakHours = 0
        let abc = shiftArr.map((item) => {
            let ArrShift = []
            item.shifts.map(val => {
                console.log('valval',val);
                if (val.start) {
                    ArrShift.push(val)
                    let min = (moment(val.finish).diff(val.start, 'minutes'))
                    TotalHours += Math.abs(min)
                    if (val.breaks[0].start) {
                        val.breaks.forEach(el => {
                            let breakMin = (moment(el.finish).diff(el.start, 'minutes'))
                            breakHours += Math.abs(breakMin)
          
                        });
                    }
                  

                }
            })
            return { ...item, shifts: ArrShift }
        })
        setShiftArray(abc)
        console.log((TotalHours / 60).toFixed(2),'breakHours',(breakHours/ 60).toFixed(2));
        let break_thresh=(breakHours/ 60).toFixed(2)
        let hour_thresh=(TotalHours / 60).toFixed(2)
        setTotalHrs(hour_thresh-break_thresh)



    }, [])
    const Details = () => {
        return (
            <View style={{ justifyContent: 'space-between', flex: 1, paddingHorizontal: 25, backgroundColor: '#FFF' }}>
                {
                    details.length > 0 ? details.map((item, index) => {
                        return (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, flex: 1, borderTopColor: "#DCDCDC", borderTopWidth: 1, }}>
                                <View>
                                    <Text style={{ color: '#000', fontSize: 14, fontWeight: '600' }}>Mon 22nd</Text>
                                    <Text style={{ color: '#808080', fontSize: 13, paddingTop: 5, paddingBottom: 5 }}>Shift: 08:00am - 06:00pm</Text>
                                    <Text style={{ color: '#808080', fontSize: 13 }}>Break: 12:00pm - 12:30pm</Text>
                                </View>
                                <View style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 14 }}>
                                        9.5 hrs
                                    </Text>


                                </View>
                            </View>
                        )
                    }) : null
                }


            </View>
        )
    }


    const handlePreview = () => {

        let data = {
            apiData: api,
            WeekEnd: WeekEnd,
            SelectedTimeSheet: SelectedTimeSheet,
            TotalHrs: TotalHrs,
            Meal: Meal,
            PayrollNote: Payroll
        }
        dispatch({ type: Types.TIME_SHEET_PREVIEW, data: data })

        props.navigation.navigate('SubmitTimesheet')
    }



    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <KeyboardAvoidingView>
                        <View style={{ width: '100%', paddingVertical: 20 }}>

                            <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: '700' }}>
                                {SelectedTimeSheet && SelectedTimeSheet.client_name ? SelectedTimeSheet.client_name : ''}
                            </Text>
                            <Text style={{ fontSize: 16 }}>
                                Week Ending: {WeekEnd ? moment(WeekEnd).format("dddd, Do MMMM") : ''}
                            </Text>
                            <Text style={{ fontSize: 16 }}>
                                Working as {SelectedTimeSheet && SelectedTimeSheet.Job ? SelectedTimeSheet.Job : ''}
                            </Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10 }}>
                                Total {TotalHrs} hrs
                            </Text>

                            {
                                ShiftArray.length > 0 ? ShiftArray.map((item, index) => {
                                    if (item.shifts.length) {
                                        return (
                                            <View key={index} style={{}}>
                                                <View style={{ justifyContent: 'space-between', flex: 1, paddingVertical: 15, paddingHorizontal: 20, backgroundColor: '#FFF' }}>

                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#DCDCDC', flex: 1, paddingBottom: 5 }}>
                                                        <View style={{ flex: 1, }}>
                                                            <Text style={{ color: '#000', fontSize: 18, fontWeight: '600' }}>{item.date ? moment(item.date).format('DD/MM/YYYY') : ''}</Text>

                                                            {item.shifts.map((shiftItem, shiftInd) => {
                                                                let matches = [], acronym = ''
                                                                if (shiftItem.shift_type) {
                                                                    matches = shiftItem.shift_type.match(/\b(\w)/g)
                                                                    acronym = matches.join('');
                                                                }

                                                                return (
                                                                    <View key={shiftInd} style={{ flex: 1 }}>
                                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>

                                                                            <Text style={{ color: '#000', fontSize: 14, paddingVertical: 10, }}>Shift: {shiftItem.start ? moment(shiftItem.start).format('hh:mm A') : ''} - {shiftItem.finish ? moment(shiftItem.finish).format('hh:mm A') : ''} </Text>
                                                                            <Text style={{ fontWeight: 'bold', color: '#0090FF', fontSize: 15 }}>{acronym} </Text>

                                                                        </View>

                                                                        {shiftItem.breaks.map((breakItem, breakInd) => breakItem.start ?
                                                                            <Text key={breakInd} style={{ color: '#000', fontSize: 14, paddingBottom: 5 }}>{breakItem.start ? `Break: ${moment(breakItem.start).format('hh:mm A')} - ${breakItem.finish ? moment(breakItem.finish).format('hh:mm A') : ''}` : ''}</Text> : null)

                                                                        }
                                                                    </View>
                                                                )
                                                            })}
                                                        </View>
                                                    </View>
                                                </View>
                                                {
                                                    index === selectedIndex ? <Details /> : null
                                                }
                                            </View>
                                        )
                                    }


                                }) : null
                            }

                            <View style={{ marginVertical: 20 }}>
                                <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: '600' }}>
                                    Allowances
                                </Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
                                    <View style={{ flex: 1 }}>
                                        <TextInput
                                            style={{ color: Colors.Black,borderBottomWidth: 1, height: 40, borderColor: '#D8D8D8', fontSize: 18, backgroundColor: '#F6F6F6' }}
                                            value={Meal}
                                            placeholder="Meals"
                                            placeholderTextColor="#808080"
                                            keyboardShouldPersistTaps
                                            onChangeText={(value) => setMeal(value)}
                                        />
                                    </View>

                                    <View>
                                        <TouchableOpacity
                                            style={{ paddingHorizontal: 20, marginLeft: 10, paddingVertical: 10, backgroundColor: '#22D2B4', alignItems: 'center', justifyContent: 'center', borderRadius: 30 }}
                                            onPress={() => props.navigation.navigate('')}
                                        >
                                            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Save</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
                                    <View style={{ flex: 1 }}>
                                        <TextInput
                                            style={{ borderBottomWidth: 1, height: 40, borderColor: '#D8D8D8', fontSize: 18, backgroundColor: '#F6F6F6' }}
                                            textValue={Payroll}
                                            placeholder="Payroll Note"
                                            placeholderTextColor="#808080"
                                            keyboardShouldPersistTaps
                                            onChangeText={(value) => setPayroll(value)}
                                        />
                                    </View>

                                    <View>
                                        <Image
                                            style={{ width: 25, height: 25 }}
                                            resizeMode={'contain'}
                                            source={require('../Assets/Icons/Info.png')} />

                                    </View>
                                </View>

                            </View>


                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
                <View style={{ justifyContent: 'flex-end', marginBottom: 20, alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{ width: screenwidth - 40, height: 60, backgroundColor: '#D02530', marginTop: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 30 }}
                        onPress={handlePreview}
                    >
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>CONTINUE</Text>
                    </TouchableOpacity>
                </View>

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

export default TimesheetPreview
