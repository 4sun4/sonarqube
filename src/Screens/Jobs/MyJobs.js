import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, FlatList, SafeAreaView, Platform } from 'react-native'
import DateTime from '../../Components/DateTimePickes';
import Colors from '../../Util/Colors';
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../../Components/Loader';
import { callGetRestApis } from '../../Services/Api';
import { showMessage, hideMessage } from "react-native-flash-message";
import moment from 'moment'
import Config from '../../Util/Config';
import { Icon } from 'react-native-elements';
import DateTimePickerComp from '../../Components/DateTimePickerComp';

let LoginData = ''
const { height, width } = Dimensions.get('window');
const Margin = width / 20
const MinMargin = width / 40
let FlatData = []
const MyJobs = (props) => {
    const [EndingDate, setEndingDate] = useState(new Date());
    const [Show, setShow] = useState(false)
    const [DateString, SetDateString] = useState('')
    const UserDetail = useSelector(S => { let D = ''; if (S && S.loginStatus && S.loginStatus.loginData && Object.keys(S.loginStatus.loginData).length != 0) { D = S.loginStatus.loginData; if (D) { LoginData = D } } return D })
    const [loading, setLoading] = useState(false)
    const [JobData, setJobData] = useState([])
    const [TextVal, setTextVal] = useState("")
    const [Bool, setBool] = useState(false)



    const onChange = (event, selectedDate) => {
        if (Platform.OS == "ios") {
            setShow(false);
            const currentDate = selectedDate || EndingDate;
            setEndingDate(currentDate)
            SetDateString(currentDate)
            setTextVal(moment(currentDate).format('YYYY-MM-DD'))
            handleSearch(currentDate)
        }
        else {
            if (event.type == 'set') {
                setShow(false);
                const currentDate = selectedDate || EndingDate;
                setEndingDate(currentDate)
                SetDateString(currentDate)
                setTextVal(moment(currentDate).format('YYYY-MM-DD'))
                handleSearch(currentDate)
            } else { setShow(false); return null }

        }
    };

    const tabActionBtn = (item, navigateUrl) => {
        props.navigation.navigate(navigateUrl, { JobData: item,ScreenName:'MyJobs' })
    }


    const handleSearch = (currentDate) => {
        if (JobData && JobData != "") {
            FlatData = []
            let TextVal = moment(currentDate).format('YYYY-MM-DD')
            FlatData = JobData
            if (TextVal != "") {
                FlatData = JobData.filter(function (i) {
                    if (i.start_date >= TextVal) {
                        return i
                    }
                })
            }
            setBool(!Bool)
        }
    }

    if (TextVal == "") { FlatData = JobData }

    useEffect(() => {
        const unsubscribe = props.navigation.addListener("focus", async () => {
            getmyWorkHistory()
        });
        return unsubscribe;

    }, [])


    const getmyWorkHistory = async () => {
        if (LoginData && LoginData.token) {
            let URL = Config().myWorkHistory
            console.log('URL', URL);
            setLoading(true)
            await callGetRestApis(URL)
                .then((res) => {
                    setLoading(false)
                    if (res) {
                        setJobData(res)
                    }
                    console.log('myWorkHistory res :- ', res)

                })
                .catch((error) => {
                    setLoading(false)

                    console.log('myWorkHistory error :- ', error)
                    showMessage({ message: 'Error', description: error, type: "warning", });
                })

        } else {

        }
    }

    const renderItem = ({ item, index }) => {
        let col = item.order_status != 'Completed' ? Colors.ThemeGreen : Colors.ThemeBlue
        return (

            <TouchableOpacity activeOpacity={1} onPress={() => tabActionBtn(item, 'JobDetail')} style={{ marginTop: height / 50, flex: 1, flexDirection: 'row', backgroundColor: '#FFFFFF' }}>
                <View style={{ padding: 2, backgroundColor: col }}></View>
                <View style={{ padding: MinMargin, flex: 1, }}>
                    <Text style={{ fontSize: height / 38, }}>{item.company_name}</Text>
                    <View style={{ flex: 1, padding: MinMargin, flexDirection: 'row', }}>
                        <View style={{ flex: 1, justifyContent: 'center', }}>
                            <Text style={{ fontSize: height / 50 }}>{item.start_date ? moment(item.start_date).format('DD/MM/YYYY') : ''} - {item.finish_date && item.finish_date != "0000-00-00" ? moment(item.finish_date).format('DD/MM/YYYY') : ''}</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: height / 40, color: col }}>{item.order_status}</Text>

                        </View>
                    </View>
                    <Text style={{ fontSize: height / 45, }}>as <Text style={{ fontSize: height / 45, }}>{item.job}</Text></Text>
                </View>

            </TouchableOpacity>
        )
    }

    const handleRemove = () => {
        setTextVal('')
        SetDateString('')
        setEndingDate(new Date())
    }



    const hideDatePicker = () => { setShow(false) };

    const handleConfirm = (date) => {
        const currentDate = date || EndingDate;
        setEndingDate(currentDate)
        SetDateString(currentDate)
        setTextVal(moment(currentDate).format('YYYY-MM-DD'))
        handleSearch(currentDate)
        hideDatePicker();
    };



    return (
        <SafeAreaView style={{ flex: 1 }}>
            {loading ? <Loader /> : null}

            <View style={styles.container}>
                <View style={{ flex: 1, padding: width / 20, }}>
                    <View style={{ marginVertical: MinMargin }}>
                        <TouchableOpacity onPress={() => setShow(true)} style={{ borderBottomWidth: 1, borderColor: Colors.L_Border }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: width / 40 }}>
                                <Text style={{ color: 'grey', fontSize: height / 45, marginLeft: width / 40 }}>{DateString ? moment(EndingDate).format("D MMM, YYYY") : 'Search for Jobs started since'}</Text>
                                <Icon name={"calendar"} type='antdesign' color={'grey'} size={height / 30} iconStyle={{ marginHorizontal: MinMargin }} />
                            </View>

                        </TouchableOpacity>
                    </View>


                    {TextVal ?
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ color: 'red', fontSize: 15 }} onPress={() => handleRemove()}> Clear Search</Text>
                        </View>
                        : null
                    }
                    <View style={{ flex: 1, }}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={FlatData}
                            renderItem={renderItem}
                            keyExtractor={(index)=>JSON.stringify(index)}
                        />
                        <DateTimePickerComp
                            isDatePickerVisible={Show}
                            handleConfirm={handleConfirm}
                            hideDatePicker={hideDatePicker}
                            mode={'date'}
                            DateVal={EndingDate}
                            onBackdropPress={() => setShow(true)}
                        />

                    </View>
                </View>

            </View>



        </SafeAreaView>
    )
}

export default MyJobs
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
    }
});
