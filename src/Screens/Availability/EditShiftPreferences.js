import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Dimensions, StyleSheet, ScrollView, Image, TouchableOpacity, } from 'react-native'
import Colors from '../../Util/Colors';
import CommonSwitch from '../../Components/CommonSwitch';
import GlobalInput from '../../Components/GlobalInput';
import Config from '../../Util/Config';
import { callGetRestApis, CallPostRestApi } from '../../Services/Api';
import { showMessage, hideMessage } from "react-native-flash-message";
import Loader from '../../Components/Loader';

const { height, width } = Dimensions.get('window');
const Margin = width / 20
const MinMargin = width / 40

let DateJson = [
    { name: 'Monday', obj: { am: false, pm: false, nd: false }, },
    { name: 'Tuesday', obj: { am: false, pm: false, nd: false }, },
    { name: 'Wednesday', obj: { am: false, pm: false, nd: false }, },
    { name: 'Thursday', obj: { am: false, pm: false, nd: false }, },
    { name: 'Friday', obj: { am: false, pm: false, nd: false }, },
    { name: 'Saturday', obj: { am: false, pm: false, nd: false }, },
    { name: 'Sunday', obj: { am: false, pm: false, nd: false }, },

]
const EditShiftPreferences = (props) => {
    const [fields, setFields] = React.useState(DateJson)
    const [Bool, setBool] = React.useState(false)
    const [loading, setLoading] = useState(false)

    const toggleChecked = (field, e, i) => {
        let fieldsT = fields[i].obj
        fieldsT[field] = e?1:0 
        setBool(!Bool);
    }



    React.useLayoutEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (<TouchableOpacity activeOpacity={1} underlayColor="white" onPress={() => EditShiftPreferences()}
                style={{ alignItems: 'center', justifyContent: 'center', paddingLeft: 10, paddingRight: 10 }}>
                <Image style={{ width: 18, height: 18, alignSelf: 'center' }} resizeMode={'contain'} source={require('../../Assets/Icons/HeaderCheck.png')} />
            </TouchableOpacity>
            ),
        });
    }, [fields]);

    const renderItem = ({ item, index }) => {
        return (
            <View style={{ marginTop: height / 50, flex: 1, backgroundColor: '#FFFFFF' }}>
                <View style={{ flex: 1, padding: Margin, }}>
                    <View style={{ flex: 1, justifyContent: 'center', }}>
                        <Text style={{ fontSize: height / 40, fontWeight: '700' }}>{item.name}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: height / 80 }}>
                        <CommonSwitch Val={item.obj['am'] ? true : false} Label={'AM'} onValueChange={(e) => { toggleChecked("am", e, index) }} />
                        <CommonSwitch Val={item.obj['pm'] ? true : false} Label={'PM'} onValueChange={(e) => { toggleChecked("pm", e, index) }} />
                        <CommonSwitch Val={item.obj['nd'] ? true : false} Label={'Night'} onValueChange={(e) => { toggleChecked("nd", e, index) }} />
                    </View>

                </View>

            </View>
        )
    }



    const getValue = (ind, time) => {
        return fields[ind].obj[time] ? 1 : 0
    }

    console.log('fields',fields);

    const EditShiftPreferences = async (id) => {
        setLoading(true)
        let body = {
            "am_fri": getValue(4, 'am'),
            "am_mon": getValue(0, 'am'),
            "am_sat": getValue(5, 'am'),
            "am_sun": getValue(6, 'am'),
            "am_thu": getValue(3, 'am'),
            "am_tue": getValue(1, 'am'),
            "am_wed": getValue(2, 'am'),
            "nd_fri": getValue(4, 'nd'),
            "nd_mon": getValue(0, 'nd'),
            "nd_sat": getValue(5, 'nd'),
            "nd_sun": getValue(6, 'nd'),
            "nd_thu": getValue(3, 'nd'),
            "nd_tue": getValue(1, 'nd'),
            "nd_wed": getValue(2, 'nd'),

            "pm_fri": getValue(4, 'pm'),
            "pm_mon": getValue(0, 'pm'),
            "pm_sat": getValue(5, 'pm'),
            "pm_sun": getValue(6, 'pm'),
            "pm_thu": getValue(3, 'pm'),
            "pm_tue": getValue(1, 'pm'),
            "pm_wed": getValue(2, 'pm')
        }
        console.log('body', body);
        let url = Config().saveCandidateShiftPreferences
        await CallPostRestApi(body, url)
            .then((res) => {
                setLoading(false)
                console.log('saveCandidateShiftPreferences res :- ', res);
                if (res && res.success == true) {
                    props.navigation.navigate('ShiftPreferences')
                    showMessage({ message: 'Success', description: 'Shift Preferences successfully updated!', type: "success", });

                } else if (res && res.error) {
                    showMessage({ message: 'Error', description: res.error_message, type: "danger", });

                }

            })
            .catch((error) => {
                setLoading(false)
                console.log('deleteCandidateFile error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })

    }




    useEffect(() => {
        const unsubscribe = props.navigation.addListener("focus", async () => {
            getShiftPreferences()
        });
        return unsubscribe;

    }, [])


    const getShiftPreferences = async () => {
        let URL =Config().getCandidateShiftPreferences 
        console.log('URL', URL);
        setLoading(true)
        await callGetRestApis(URL)
            .then((res) => {
                setLoading(false)
                if (res) {
                    let obj = [{ name: 'Monday', obj: {} }, { name: 'Tuesday', obj: {} }, { name: 'Wednesday', obj: {} },
                    { name: 'Thursday', obj: {} }, { name: 'Friday', obj: {} }, { name: 'Saturday', obj: {} }, { name: 'Sunday', obj: {} },]

                    for (let i = 0; i < obj.length; i++) {
                        let ele = obj[i];
                        for (const [key, value] of Object.entries(res)) {

                            if (ele.name.includes('Monday') && key.includes('mon')) { let k = key.slice(0, 2); ele.obj[k] = value }
                            else if (ele.name.includes('Tuesday') && key.includes('tue')) { let k = key.slice(0, 2); ele.obj[k] = value }
                            else if (ele.name.includes('Wednesday') && key.includes('wed')) { let k = key.slice(0, 2); ele.obj[k] = value }
                            else if (ele.name.includes('Thursday') && key.includes('thu')) { let k = key.slice(0, 2); ele.obj[k] = value }
                            else if (ele.name.includes('Friday') && key.includes('fri')) { let k = key.slice(0, 2); ele.obj[k] = value }
                            else if (ele.name.includes('Saturday') && key.includes('sat')) { let k = key.slice(0, 2); ele.obj[k] = value }
                            else if (ele.name.includes('Sunday') && key.includes('sun')) { let k = key.slice(0, 2); ele.obj[k] = value }

                        }
                    }
                    console.log('obj', obj);
                    setFields(obj)
                }
                console.log('getCandidateShiftPreferences res :- ', res)

            })
            .catch((error) => {
                setLoading(false)

                console.log('getCandidateShiftPreferences error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })

    }

    console.log('fields', fields);
    return (
        <View style={styles.container}>
            {loading ? <Loader /> : null}
            <ScrollView>
                <View style={{ flex: 1, padding: Margin, }}>

                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            style={{ width: 24, height: 24, alignSelf: 'center' }}
                            resizeMode={'contain'}
                            source={require('../../Assets/Icons/Information.png')} />
                        <Text style={{ fontSize: height / 40, fontWeight: '700', marginHorizontal: MinMargin }}>Shift Timings</Text>

                    </View>
                    <View style={{}}>
                        <FlatList
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                            data={fields}
                            renderItem={renderItem}
                        />
                    </View>

                </View>
            </ScrollView>
        </View>

    )
}

export default EditShiftPreferences
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.ThemeBackground,
    },
    topBox: {
        padding: Margin,
        borderWidth: 1,
        borderRadius: height / 90,
        borderColor: Colors.ThemeGreen,
        backgroundColor: Colors.Lt_Green
    },
    BottomBox: {
        padding: Margin / 1.2,
        borderWidth: 1,
        borderRadius: height / 90,
        borderColor: Colors.ThemeRed,
        backgroundColor: Colors.Lt_Red,
        justifyContent: 'center',
        alignItems: 'center'
    },
});