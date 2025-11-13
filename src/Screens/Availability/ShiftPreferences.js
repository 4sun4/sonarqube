import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, Dimensions, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import Colors from '../../Util/Colors';
import CommonSwitch from '../../Components/CommonSwitch';
import GlobalInput from '../../Components/GlobalInput';
import { callGetRestApis } from '../../Services/Api';
import Loader from '../../Components/Loader';
import { showMessage, hideMessage } from "react-native-flash-message";
import Config from '../../Util/Config';


const Information = require('../../Assets/Icons/Information.png')
const HeaderCheck = require('../../Assets/Icons/HeaderCheck.png')
const HeaderCheck_G = require('../../Assets/Icons/HeaderCheck_G.png')
const ArrowFwd = require('../../Assets/Icons/ArrowFwd.png')

const { height, width } = Dimensions.get('window');
const Margin = width / 20
const MinMargin = width / 40
let DateJson = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const ShiftPreferences = (props) => {
    const [fields, setFields] = React.useState(DateJson)
    const [Bool, setBool] = React.useState(false)
    const [loading, setLoading] = useState(false)
    const [ShiftPreferencesData, setShiftPreferencesData] = useState([])



    const renderItem = ({ item, index }) => {
        let { obj } = item
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: height / 90 }}>
                <View style={{ flex: 1, padding: Margin, }}>
                    <View style={{ flex: 1, justifyContent: 'center', }}>
                        <Text style={{ fontSize: height / 40, fontWeight: '700' }}>{item.name}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: height / 80 }}>
                        <CommonSwitch HeaderCheck={obj.am ? HeaderCheck : HeaderCheck_G} IsIcon Label={'AM'} />
                        <CommonSwitch HeaderCheck={obj.pm ? HeaderCheck : HeaderCheck_G} IsIcon Label={'PM'} />
                        <CommonSwitch HeaderCheck={obj.nd ? HeaderCheck : HeaderCheck_G} IsIcon Label={'Night'} />
                    </View>

                </View>

            </View>
        )
    }
    const tabActionBtn = (navigateUrl) => {
        props.navigation.navigate(navigateUrl)
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
                    setShiftPreferencesData(obj)
                }
                console.log('getCandidateShiftPreferences res :- ', res)

            })
            .catch((error) => {
                setLoading(false)

                console.log('getCandidateShiftPreferences error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })

    }


    return (
        <View style={styles.container}>
            {loading ? <Loader /> : null}
            <ScrollView>
                <View style={{ flex: 1, padding: Margin, }}>
                    <View style={{}}>
                        <View style={{alignItems:'flex-end'}}>
                            <TouchableOpacity activeOpacity={1} underlayColor="white"
                                    onPress={() => props.navigation.navigate('EditShiftPreferences')}
                                    style={{ alignItems: 'flex-end', justifyContent: 'flex-end', paddingRight: 10 }}>
                                    <Image
                                        style={{ width: 22, height: 18, alignSelf: 'center' }}
                                        resizeMode={'contain'}
                                        source={require('../../Assets/Icons/HeaderEdit.png')} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                            data={ShiftPreferencesData}
                            renderItem={renderItem}
                        />
                    </View>

                    {/* <TouchableOpacity onPress={() => tabActionBtn('ShiftAvailability')} style={{ backgroundColor: '#FFFFFF', marginVertical: Margin, padding: Margin, borderWidth: 1, borderRadius: height / 90, borderColor: Colors.Border, justifyContent: 'space-between', flexDirection: 'row' }}>
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

export default ShiftPreferences
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
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