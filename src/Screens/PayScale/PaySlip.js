import React, { useState, useEffect } from 'react'
import { View, Text, Image, Dimensions, Alert, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { callGetRestApis, callPostRest, CallPostRestApi } from '../../Services/Api';
import PayScaleOverlay from './PayScaleOverlay';
import { showMessage, hideMessage } from "react-native-flash-message";
import Config from '../../Util/Config';
import Loader from '../../Components/Loader';
import RNFetchBlob from 'rn-fetch-blob'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

const download = require('../../Assets/Icons/Download.png')

const { height, width } = Dimensions.get('window');
const Margin = width / 20
const MinMargin = width / 40
// const hasNotch = DeviceInfo.hasNotch();

let DateJson = [{ date: '30/05/2020' }, { date: '30/05/2020' }, { date: '30/05/2020' }, { date: '30/05/2020' }, { date: '30/05/2020' }, { date: '30/05/2020' }, { date: '30/05/2020' }, { date: '30/05/2020' }, { date: '30/05/2020' }, { date: '30/05/2020' }, { date: '30/05/2020' },]
let LoginData = ''
const screenwidth = Dimensions.get('window').width
const screenheight = Dimensions.get('window').height

export default function PaySlip(props) {
    const [visible, setVisible] = useState(false);
    const { navigation } = props
    // let paddingTop = Platform.OS === 'ios' ? hasNotch ? 37 : 22 :  10
    const [loading, setLoading] = useState(false)
    const [Query, setQuery] = useState('')

    const [PaySlipData, setPaySlipData] = useState([])
    const UserDetail = useSelector(S => { let D = ''; if (S && S.loginStatus && S.loginStatus.loginData && Object.keys(S.loginStatus.loginData).length != 0) { D = S.loginStatus.loginData; if (D) { LoginData = D } } return D })

    // React.useLayoutEffect(() => {
    //     navigation.setOptions({
    //         headerRight: () => (<TouchableOpacity activeOpacity={1} underlayColor="white" onPress={toggleOverlay}
    //             style={{ alignItems: 'center', justifyContent: 'center', paddingLeft: 10, paddingRight: 10 }}>
    //             <Image style={{ width: 18, height: 18, alignSelf: 'center' }} resizeMode={'contain'} source={require('../../Assets/Icons/HeaderAdd.png')} />
    //         </TouchableOpacity>
    //         ),
    //     });
    // }, [navigation]);


    const renderItem = ({ item, index }) => {
        return (
            <View key={index} style={{ marginTop: height / 50, flex: 1, flexDirection: 'row', backgroundColor: '#FFFFFF' }}>
                <View style={{ padding: 2, backgroundColor: '#22D2B4' }}></View>
                <View style={{ flex: 1, padding: MinMargin, flexDirection: 'row', }}>
                    <View style={{ flex: 1, marginLeft: MinMargin, justifyContent: 'center', }}>
                        <Text style={{ fontSize: height / 35 }}>{item.period_end ?moment(item.period_end).format('DD/MM/YY')  : ''}</Text>
                    </View>
                    <TouchableOpacity onPress={() => ChooseOption(item.payslip_id, item.employee_id)} style={{ marginRight: MinMargin, justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={{ width: 24, height: 24, }} resizeMode={'contain'} source={download} />
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
    const toggleOverlay = () => { setVisible(!visible); };
    const handleChange = (e) => {
        console.log(e);
        setQuery(e)
    }

    useEffect(() => {
        const unsubscribe = props.navigation.addListener("focus", async () => {
            getPayslips()
        });
        return unsubscribe;
    }, [])


    const getPayslips = async () => {
        let URL =Config().getPayslips 
        setLoading(true)
        await callGetRestApis(URL)
            .then((res) => {
                setLoading(false)
                if (res && res.length) { setPaySlipData(res) }
                console.log('getPayslips res :- ', res)
            })
            .catch((error) => {
                setLoading(false)
                console.log('getPayslips error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })

    }

    const ChooseOption = (payslip_id, employee_id) => {
        Alert.alert(
            'Alert', 'Do You Want To Download?',
            [{ text: 'Yes', onPress: () => downloadPayslip(payslip_id, employee_id), style: 'cancel' },
            { text: 'No', style: 'cancel', }],
            { cancelable: false },
        );
    }


    const downloadPayslip = (payslip_id, employee_id) => {
        console.log('payslip_id',payslip_id,'employee_id',employee_id);
        const { config, fs } = RNFetchBlob
        let PictureDir = fs.dirs.DownloadDir
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true, notification: true,
                path: PictureDir + "/payslip_" + Math.floor(new Date().getTime() + new Date().getSeconds() / 2),
                description: 'Downloading image.'
            }
        }
        setLoading(true)
        config(options).fetch("GET",
            Config().DownloadPayslip + `?payslip_id=${Number(payslip_id)}&employee_id=${Number(employee_id)}`,
            { Authorization: `Bearer ${LoginData && LoginData.token}` }
        )
            .then((res) => {
                setLoading(false)
                console.log('resres', res);
                showMessage({ message: 'Success', description: "File Downloaded Successfully", type: "success", });
            })
            .catch((error) => { setLoading(false)
                showMessage({ message: 'Error', description: "File Not downloaded", type: "danger", });

            })

    }



    const submit = async () => {
        if (!Query) {
            Alert.alert('Alert', 'Please enter query')
            return false;
        }
        var URL = Config().SendPayQuery
        let body = {
            "pay_query_message": Query
        }
        setLoading(true)
        await CallPostRestApi(body, URL)
            .then(async (res) => {
                console.log('SendPayQuery res :- ', res);
                setLoading(false)
                if (res && res.success) {
                  
                    showMessage({ message: 'Success', description: 'Query send successfully.', type: "success", });
                    toggleOverlay()
                    setQuery('')
                }
            })
            .catch((error) => {
                setLoading(false)
                console.log('SendPayQuery error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });

            })

    }




    return (
        <View style={styles.container}>
            {loading ? <Loader /> : null}

            {/* <StatusBar barStyle="dark-content" translucent={true} backgroundColor={'transparent'} /> */}
            <View style={{ flex: 1, padding: width / 20, }}>
                <View style={{ flex: 1, zIndex: 1 }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={PaySlipData}
                        renderItem={renderItem}
                        keyExtractor={(index)=>JSON.stringify(index)}
                    />
                </View>
                {PaySlipData.length ?
                    <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{ width: screenwidth - 70, height: 60, backgroundColor: '#D02530', marginTop: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 30 }}
                            onPress={toggleOverlay}
                        >
                            <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>Lodge Pay Query</Text>
                        </TouchableOpacity>
                    </View>
                    : null
                }
            </View>
            <PayScaleOverlay
                visible={visible}
                toggleOverlay={toggleOverlay}
                handleChange={handleChange}
                InputValue={Query}
                onSubmit={submit}
                loading={loading}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
    }
});