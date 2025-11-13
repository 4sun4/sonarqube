import React, { useRef, useEffect } from 'react'
import { View, Text, Platform, Image, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Dimensions, SafeAreaView } from 'react-native'
import { useState } from 'react';
import { connect } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import Types from '../redux/Types';
import { ordinal_suffix_of, startOfWeek } from '../Util/CommonFun';
import { showMessage, hideMessage } from "react-native-flash-message";
import Colors from '../Util/Colors';
import Dropdown from '../Components/SelectPicker';
import {callGetRestApis } from '../Services/Api';
import Config from '../Util/Config';
import Loader from '../Components/Loader';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Non-serializable values were found in the navigation state',]);
const screenwidth = Dimensions.get('window').width
const screenheight = Dimensions.get('window').height
let LoginData = ''

const SavedTimeSheet = (props) => {
    const SelectedTimeSheet = useSelector(S => { let D = ''; if (S && S.TimeSheetStore) { D = S.TimeSheetStore.SelectedTimeSheet; if (D) { } } return D })
    const [data, setData] = useState({ username: '', password: '', confirmPassword: '', iconAnimating: false, isPasswordShow: true });
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [WeekEnd, setWeekEnd] = useState("2021-08-18");
    const [Bool, setBool] = useState(false);
    const UserDetail = useSelector(S => { let D = ''; if (S && S.loginStatus && S.loginStatus.loginData && Object.keys(S.loginStatus.loginData).length != 0) { D = S.loginStatus.loginData; if (D) { LoginData = D } } return D })
    const [loading, setLoading] = useState(false)
    const [ShiftData, setShiftData] = useState([])
    const dispatch = useDispatch()
    const [SelectedTypeValue, setSelectedTypeValue] = useState(0);
    const [DropDownTypeData, setDropDownTypeData] = useState([])
    const [SelectedType, setSelectedType] = useState([]);
    const { route: { params: { timeSheetData:{date,shiftArr,api } } } } = props
  
  console.log(props);
    useEffect(async () => {
        setShiftData(shiftArr) 
        getShiftTypeList()
    }, [])

    const getShiftTypeList = async () => {
        if (LoginData && LoginData.token) {
            let URL =Config().getShiftTypeList 
            setLoading(true)
            await callGetRestApis(URL)
                .then((res) => {
                    setLoading(false)
                    if (res && res.length > 0) {
                        setSelectedType(res)
                        setSelectedTypeValue(res[0].timesheet_shift_type_id)
                        let arr = res.map(item => item.value ? `${item.value}` : '')
                        setDropDownTypeData(arr)

                    }
                    // console.log('getShiftTypeList res :- ', res)

                })
                .catch((error) => {
                    setLoading(false)
                    console.log('getFileTypes error :- ', error)
                    showMessage({ message: 'Error', description: error, type: "warning", });
                })

        } else {

        }
    }
    const ShiftDetail = (shiftItem, shiftInd, Item, Ind) => {
        return (
            <View key={shiftInd + 1} style={{ justifyContent: 'space-between', flex: 1, padding: 25, backgroundColor: '#fff', }}>
                <Text style={{ fontSize: 14 }}>
                    Shift
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                    <View style={{ flex: 1, }}>
                    <TextInput
                        style={{ borderBottomWidth: 1, height: 40, width: "100%", borderColor: '#D8D8D8', fontSize: 18,color:'black' }}
                        value={shiftItem.shift_type?shiftItem.shift_type:''}
                        placeholder="Shift"
                        editable={false}
                        placeholderTextColor="#DCDCDC"
                        keyboardShouldPersistTaps
                    />
                    </View>
                </View>

                <View style={{ flexDirection: 'row', paddingVertical: 10, justifyContent: 'space-between', flex: 1, alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center' }}>
                        <View  style={{ borderBottomWidth: 1, height: 40, flex: 1, borderColor: '#D8D8D8', }}>
                            <Text style={{ fontSize: 18, color: shiftItem.start ? 'black' : "#DCDCDC", marginTop: 5 }}>{shiftItem.start ? moment(shiftItem.start, 'hh:mm A').format('hh:mm A') : 'Shift Starts'}</Text>
                        </View>
                        <View style={{ marginHorizontal: 15 }}></View>
                        <View  style={{ borderBottomWidth: 1, height: 40, flex: 1, borderColor: '#D8D8D8', }}>
                            <Text style={{ fontSize: 18, color: shiftItem.finish ? 'black' : "#DCDCDC", marginTop: 5 }}>{shiftItem.finish ? moment(shiftItem.finish, 'hh:mm A').format('hh:mm A') : 'Shift Ends'}</Text>
                        </View>
                    </View>
                    <View></View>
                </View>
                <View style={{ paddingTop: 10 }}>
                    <Text style={{ fontSize: 14 }}>
                        Break
                    </Text>
                </View>
                {shiftItem.breaks.length && shiftItem.breaks.map((breakItem, breakInd) => {
                    return (
                        <View key={breakInd} style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center', marginTop: 20 }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View  style={{ borderBottomWidth: 1, height: 40, flex: 1, borderColor: '#D8D8D8', }}>
                                    <Text style={{ fontSize: 18, color: breakItem.start ? 'black' : "#DCDCDC", marginTop: 5 }}>{breakItem.start ? moment(breakItem.start, 'hh:mm A').format('hh:mm A') : 'Break Starts'}</Text>
                                </View>
                                <View style={{ marginHorizontal: 15 }}></View>
                                <View  style={{ borderBottomWidth: 1, height: 40, flex: 1, borderColor: '#D8D8D8', }}>
                                    <Text style={{ fontSize: 18, color: breakItem.finish ? 'black' : "#DCDCDC", marginTop: 5 }}>{breakItem.finish ? moment(breakItem.finish, 'hh:mm A').format('hh:mm A') : 'Break Ends'}</Text>
                                </View>
                            </View>
                        </View>
                    )
                })

                }
                <View style={{ paddingVertical: 10 }}>
                    <TextInput
                        style={{ borderBottomWidth: 1, height: 40, width: "100%", borderColor: '#D8D8D8', fontSize: 18,color:'black' }}
                        value={shiftItem.shift_notes?shiftItem.shift_notes:''}
                        placeholder="Comments"
                        placeholderTextColor="#DCDCDC"
                        keyboardShouldPersistTaps
                        editable={false}
                    />
                </View>
            </View>
        )
    }
    const handlePreviewButton = () => {
        handlePreview()
    }
    const handlePreview = async () => {
        let end = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')
            let data = {
            api: api,
            shiftArr: ShiftData,
            WeekEnd: end,
            SelectedTimeSheet: SelectedTimeSheet
        }
        await dispatch({ type: Types.ADD_TIME_SHEET, data: data })
        props.navigation.navigate('TimesheetPreview')
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {loading ? <Loader /> : null}
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <KeyboardAvoidingView>
                        <View style={{ width: '100%', paddingVertical: 20 }}>
                            <Text style={{ fontSize: 14 }}>
                                Company
                            </Text>
                            <View>
                                <TextInput
                                    style={{ borderBottomWidth: 1, height: 40, borderColor: '#D8D8D8', fontSize: 18, backgroundColor: '#F6F6F6', color: 'black' }}
                                    value={SelectedTimeSheet && SelectedTimeSheet.client_name ? SelectedTimeSheet.client_name : ''}
                                    keyboardShouldPersistTaps
                                    editable={false}
                                    onChangeText={(value) => setData({ ...data, username: value })}
                                />
                            </View>
                            <View style={{ paddingVertical: 20 }}>
                                <Text style={{ fontSize: 16 }}>
                                    Week Ending: {moment(date,'DD/MM/YYYY').format("dddd, Do MMMM")}
                                </Text>
                            </View>
                            <View style={{ borderRadius: 10, }}>
                                {
                                    ShiftData.length > 0 ? ShiftData.map((item, index) => {
                                        let { date, dayname, shift_notes, shifts } = item
                                        return (
                                            <View key={index} style={{ marginVertical: 10 }}>
                                                <View style={{ justifyContent: 'space-between', flex: 1, paddingVertical: 20, paddingHorizontal: 20, backgroundColor: '#FFF' }}>
                                                    <TouchableOpacity activeOpacity={1} onPress={() => setSelectedIndex(index == selectedIndex ? null : index)}>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                                                            <View>
                                                                <Text style={{ color: '#000', fontSize: 18, fontWeight: '600' }}>{item.dayname}</Text>
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
                                                {index === selectedIndex ?
                                                    shifts.map((shiftItem, shiftInd) => {
                                                        return (
                                                            ShiftDetail(shiftItem, shiftInd, item, index)
                                                            // <ShiftDetail shiftItem={shiftItem} shiftInd={shiftInd} Item={item} Ind={index} />
                                                        )
                                                    })
                                                    : null
                                                }
                                            </View>
                                        )
                                    }) : null
                                }
                                <View style={{ paddingVertical: 10 }}>
                                    <Text style={{ fontSize: 14 }}>
                                        Code
                                    </Text>
                                    <TextInput
                                        style={{ borderBottomWidth: 1, height: 40, width: "100%", borderColor: '#D8D8D8', fontSize: 18 }}
                                        textValue={data.username}
                                        placeholder="* optional"
                                        placeholderTextColor="#DCDCDC"
                                        keyboardShouldPersistTaps
                                        onChangeText={(value) => setData({ ...data, username: value })}
                                    />
                                </View>

                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
                <View style={{ justifyContent: 'flex-end', marginBottom: 20, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => handlePreviewButton()}
                        style={{ width: screenwidth - 40, height: 60, backgroundColor: '#D02530', marginTop: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 30 }}
                    >
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>PREVIEW</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    FilterPickerStyle: { width: screenwidth / 3, alignSelf: 'center' },
    DateOverlay: { alignItems: 'center', justifyContent: 'center', padding: screenheight / 100 },

    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#F6F6F6',
    }
});

export default SavedTimeSheet







