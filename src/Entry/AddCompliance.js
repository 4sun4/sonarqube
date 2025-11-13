import React, { useEffect } from 'react'
import { View, Text, Platform, Image, PermissionsAndroid, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Dimensions, SafeAreaView } from 'react-native'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import Colors from '../Util/Colors';
import { callGetRestApis, globalPostApi } from '../Services/Api';
import Loader from '../Components/Loader';
import DateTime from '../Components/DateTimePickes';
import { FileFun, isVideo, normalizeSize } from '../Util/CommonFun';
import DocumentPicker from 'react-native-document-picker';
import moment from 'moment';
import { showMessage, hideMessage } from "react-native-flash-message";
import { ImageUploadFun } from '../Util/CommonFun';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import Config from '../Util/Config';
import Dropdown from '../Components/SelectPicker';
import { Icon, Overlay } from 'react-native-elements'
import { MinMargin } from '../Util/Styles';
import DateTimePickerComp from '../Components/DateTimePickerComp';
import DropDownPicker from 'react-native-dropdown-picker';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { store } from '../redux/Store';

const { height, width } = Dimensions.get('window');

let LoginData = ''
const AddCompliance = (props) => {
    const { route, navigation } = props
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [Item, setItem] = useState([]);
    const [ScreenParam, setScreenParam] = useState('');
    const [EditData, setEditData] = useState(null);
    const [DropDownTypeData, setDropDownTypeData] = useState([])
    const [documentOpen, setDocumentOpen] = useState(false);
    const [documentValue, setDocumentValue] = useState(null);
    const [documentData, setDocumentData] = useState([]);
    const UserDetail = useSelector(S => { let D = ''; if (S && S.loginStatus && S.loginStatus.loginData && Object.keys(S.loginStatus.loginData).length != 0) { D = S.loginStatus.loginData; if (D) { LoginData = D } } return D })
    const dispatch = useDispatch()

    const [StartDate, setStartDate] = useState(new Date());
    const [ExpiryDate, setExpiryDate] = useState(new Date());
    const [DateString, setDateString] = useState('');
    const [DateString1, setDateString1] = useState('');

    const [data, setData] = useState({
        open: false,
        value: '',
        Item: [],
        attribute_id: 0,
        Show: false, Show1: false,
        FileName: '', Doc: ''
    });
    const { attribute_id, Show, Show1, FileName, Doc, } = data
    const facilityName = store.getState().loginStatus.facility;

    const HeaderLogo = () => {
        return (
          <Image
            style={{width: 350, height: 45}}
            resizeMode={'contain'}
            source={require('../Assets/Icons/WorkFoceWhiteSmallLogo.png')}
          />
        );
      };
    
      const showDrawerIcon = props => {
        return (
          <EvilIcons
            name="navicon"
            color={'#111'}
            style={{paddingLeft: 10, paddingRight: 0}}
            onPress={() => props.navigation.openDrawer()}
            size={26}
          />
        );
      };
    
      React.useLayoutEffect(() => {
        props.navigation.setOptions({
          header: props => (
            <SafeAreaView style={{backgroundColor: '#ffffff'}}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                  }}>
                  {showDrawerIcon(props)}
                  {HeaderLogo()}
                  <View />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    justifyContent: 'center',
                    paddingVertical: 10,
                    backgroundColor: '#1c78ba',
                  }}>
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
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    justifyContent: 'space-between',
                    paddingVertical: 4,
                    backgroundColor: '#d9d9d9',
                  }}>
                  <TouchableOpacity
                    onPress={() => props.navigation.goBack()}
                    style={{flex: 0.5}}>
                    <Feather color={'#111'} size={32} name="chevron-left" />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: normalizeSize(18),
                      flex: 1.5,
                      textAlign: 'center'
                    }}>
                    Add Compliance
                  </Text>
                 <TouchableOpacity
                    activeOpacity={0.8}
                    underlayColor="white"
                    onPress={() => addComplienceFun()}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 0.5
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
                  <View />
                </View>
              </View>
            </SafeAreaView>
          ),
        });
      }, [data, Item, value]);


    // React.useLayoutEffect(() => {
    //     props.navigation.setOptions({
    //         headerRight: () => (<TouchableOpacity activeOpacity={1} underlayColor="white" onPress={() => addComplienceFun()}
    //             style={{ alignItems: 'center', justifyContent: 'center', paddingLeft: 10, paddingRight: 10 }}>
    //             <Image style={{ width: 18, height: 18, alignSelf: 'center' }} resizeMode={'contain'} source={require('../Assets/Icons/HeaderCheck.png')} />
    //         </TouchableOpacity>
    //         ),
    //     });
    // }, [data, Item, value]);





    const selectOneFile = async () => {
        setLoading(true)
        try {
            const resp = await DocumentPicker.pick({ type: [DocumentPicker.types.allFiles], });
            const res = resp[0]
            console.log('res : ', res);
            console.log('URI : ' + res.uri);
            console.log('Type : ' + res.type);
            console.log('File Name : ' + res.name);
            console.log('File Size : ' + res.size);
            let name = res && res.name ? res.name : ""
            let type = res && res.type ? res.type : ""
            setLoading(false)

            if (isVideo(type) || isVideo(name)) {
                showMessage({ message: 'Alert', description: "Please Select Valid FileType", type: "warning", });
            }
            else {
                // setData({ ...data, FileName: name })
                if (res && res.uri) {
                    setData({ ...data, Doc: res,FileName: name  })
                    showMessage({ message: 'Success', description: 'Document Picked Successfully.', type: "success", });

                }
            }
        } catch (err) {
            setLoading(false)

            if (DocumentPicker.isCancel(err)) {
            } else {
                showMessage({ message: 'Error', description: err, type: "warning", });
                throw err;
            }
        }
    };






    useEffect(() => {
        const unsubscribe = props.navigation.addListener("focus", async () => {
            getRouteData()
        });
        return unsubscribe;

    }, [])


    const getRouteData = () => {
        console.log("navigation", navigation, "route testing log", route)
        if (route && route.params) {
            let rout = route.params
            let screenParam = rout.screenParam && rout.screenParam != "" ? rout.screenParam : ""
            let editData = rout.updateData ? rout.updateData : null

            console.log('editData', editData, 'screenParam', screenParam);

            if (screenParam && screenParam == 'edit') {
                setScreenParam(screenParam)
                setEditData(editData)
                setData({
                    ...data, ExpiryDate: new Date(editData.expire_date), StartDate: new Date(editData.start_date),
                    DateString1: new Date(editData.expire_date), DateString: new Date(editData.start_date),
                })

            }
            else { getAttributeList() }
        } else { getAttributeList() }
    }



    const getAttributeList = async () => {
        if (LoginData && LoginData.token) {
            let URL = Config().candidateAttributeList
            console.log('URL', URL);
            setLoading(true)
            await callGetRestApis(URL)
                .then((res) => {
                    setLoading(false)
                    if (res && res.length > 0) {
                        let dup = res.filter((v, i, a) => a.findIndex((t) => t.attribute_name === v.attribute_name) === i)
                        let arr = []
                        dup.map((it, ind) => { arr.push({ label: it.attribute_name, value: it.attribute_name, id: it.attribute_id }) })
                        // let ArrVal = dup.map(item => item.attribute_name ? `${item.attribute_name}` : '')
                        // setDropDownTypeData(ArrVal)
                        setDocumentData(arr)
                        // setItem(arr)
                        // setData({...data,Item:arr})
                    }
                    console.log('getAttributeList res :- ', res)

                })
                .catch((error) => {
                    setLoading(false)
                    console.log('getAttributeList error :- ', error)
                    showMessage({ message: 'Error', description: error, type: "warning", });
                })

        } else {

        }
    }

    const addComplienceFun = async () => {
        console.log('ScreenParam', documentValue);
        if (!ScreenParam && !documentValue) {
            Alert.alert('Alert', 'Please Select Document Type')
            return
        }
        else if (!DateString) {
            Alert.alert('Alert', 'Please enter Start/From Date')
            return
        }

        else if (!DateString1) {
            Alert.alert('Alert', 'Please enter Expiry Date')
            return
        }
        else if (!Doc) {
            Alert.alert('Alert', 'Please Upload Document')
            return
        }
        else {
            handleComplienceApi()
        }


    }

    const handleComplienceApi = async () => {
        let file = FileFun(Doc)
        setLoading(true)
        let formdata = new FormData();
        if (ScreenParam && ScreenParam == 'edit') { formdata.append("compliance_id", EditData && EditData.compliance_id) }
        else { formdata.append("attribute_id", attribute_id) }
        formdata.append("file", file),
            formdata.append("start_date", moment(StartDate).format("YYYY-MM-DD")),
            formdata.append("expire_date", moment(ExpiryDate).format("YYYY-MM-DD"))
        let Url = !ScreenParam ? Config().uploadmyCompliance : Config().updateComplianceDocument
        console.log('\n---formdata-----', formdata);
        await globalPostApi(Url, formdata)
            .then((res) => {
                setLoading(false)
                console.log('handleComplienceApi res :- ', res);
                if (res && res.success) {
                    showMessage({ message: 'Success', description: 'Compliance document uploaded successfully.', type: "success", });
                    props.navigation.navigate('MyCompliance')
                }
            })
            .catch((error) => {
                setLoading(false)
                console.log('handleComplienceApi error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })

    }



    const options = { mediaType: 'photo', includeBase64: false, };


    const ChooseOption = () => {
        Alert.alert(
            'Alert',
            'Upload Compliance?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Gallery',
                    onPress: () => selectOneFile(),
                },
                {
                    text: 'Camera', onPress: () => {
                        if (Platform.OS === 'android') { requestCameraPermission(); }
                        else { getProductImages() }
                    }
                },

            ],
            { cancelable: false },
        );
    }

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "App Camera Permission",
                    message: "Needs access to your camera to update profile image",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                getProductImages()
                console.log("You can use the camera");
            }
            else { console.log("Camera permission denied"); }
        } catch (err) { console.warn(err); }
    };

    const getProductImages = async (Gallery) => {
        let methodName = launchImageLibrary
        if (!Gallery) { methodName = launchCamera }
        setLoading(true)

        methodName(options, (res) => {
            let response = res.hasOwnProperty('assets') ? res.assets[0] : res
            if (response.didCancel) {
                console.log("User cancelled image picker ");
                setLoading(false)

            } else if (response.error) {
                console.log("ImagePicker Error:  ", response.error);
                setLoading(false)

            } else {
                console.log('Profile image  =>  ', response)
                setData({ ...data, Doc: response ,FileName: response?.fileName})
                showMessage({ message: 'Success', description: 'Document Picked Successfully.', type: "success", });
                setLoading(false)

                let FileSize = 0
                if (response.fileSize) { FileSize = response.fileSize }
                if (FileSize && FileSize > 2500000) {
                    let widthN = 400
                    let heightN = 300
                    if (response.height) { heightN = response.height / 4 }
                    if (response.width) { widthN = response.width / 4 }
                    let Rot = 0
                    if (response.originalRotation) { Rot = response.originalRotation }

                } else {
                    if (response && response.uri) {
                        setData({ ...data, Doc: response ,FileName:response?.fileName})

                    }
                }
            }
        });

    }




    const hideDatePicker = (type) => {
        if (type == 'Start') {
            setData({ ...data,Show: false, })
        }
        else {
            setData({ ...data,Show1: false, })
        }
    };

    const handleConfirm = (date, type) => {
        if (type == 'Start') {
            const currentDate = date || StartDate;
            console.log('date', date, 'StartDate', StartDate);
            setStartDate(currentDate)
            setExpiryDate(new Date())
            setDateString(currentDate)
            setDateString1('')
            setData({...data, Show: false, StartDate: currentDate, DateString: currentDate, ExpiryDate: new Date(), DateString1: '' })
            setTimeout(() => {
                hideDatePicker(type);
            }, 200);
        } else {
            const currentDate = date || ExpiryDate;
            setExpiryDate(currentDate)
            setDateString1(currentDate)
            setData({ ...data,Show1: false, ExpiryDate: currentDate, DateString1: currentDate, })
            setTimeout(() => {
                hideDatePicker(type);
            }, 200);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {loading ? <Loader /> : null}


            <View style={styles.container}>
                <ScrollView contentContainerStyle={{flexGrow:1,paddingTop:10}}>
        
                        <View style={{ width: '100%', paddingVertical: 20 }}>
                            <View
                                style={{
                                backgroundColor: '#d8e4f6',
                                borderRadius: 12,
                                marginHorizontal: 30,
                                paddingLeft: 15,
                                paddingRight: 15,
                                paddingVertical: 8,
                                shadowColor: '#000',
                                shadowOffset: {width: 1, height: 1},
                                shadowOpacity: 0.6,
                                shadowRadius: 3,
                                elevation: 5,
                                }}>
                                <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 14,
                                    paddingVertical: 4,
                                    color: '#111',
                                }}>
                                Use the form below to add compliances such as licenses, &amp; certificates that you have
                                </Text>
                            </View>
                            {!ScreenParam ?  
                            <>
                             <Text style={{fontSize: 15, fontWeight:"500",color: '#808080',marginTop:30,marginBottom:10}}>
                             Document Type
                           </Text>
                              <DropDownPicker
                                open={documentOpen}
                                value={documentValue}
                                items={documentData}
                                zIndex={1000}
                                maxHeight={Config().height / 3}
                                setOpen={val => {
                                   setDocumentOpen(val);
                                }}
                                scrollViewProps={{
                                   nestedScrollEnabled: true,
                                }}
                                autoScroll={true}
                                setValue={setDocumentValue}
                                setItems={setDocumentData}
                                listMode="SCROLLVIEW"
                                placeholder="Please select..."
                                listItemContainerStyle={{marginVertical: 3}}
                                selectedItemLabelStyle={{fontWeight: 'bold'}}
                                labelStyle={{fontSize: 16}}
                                itemSeparator={true}
                                itemSeparatorStyle={{backgroundColor: '#c5baba'}}
                                dropDownContainerStyle={{
                                    backgroundColor: Colors.White,
                                    borderColor: Colors.Border
                                }}
                                placeholderStyle={{
                                    color: '#7d7979',
                                    fontSize: 16,
                                }}
                                style={{
                                    borderColor: '#c5baba',
                                    borderWidth: 2,
                                    borderRadius: 5,
                                    minHeight: 45,
                                    marginBottom:20
                                }}
                                onSelectItem={(item) => {
                                    console.log("on items:",item);
                                    setData({...data,attribute_id:item.id})
                                  }}
                               />
                               </> 
                                : null
                            }

                            <View style={{ marginTop: 30, }}>
                                <TouchableOpacity 
                                    onPress={() => { 
                                        //console.log('\n---in Show---',{ ...data, Show: true });
                                        setData({ ...data, Show: true })
                                    } 
                                    }
                                    style={{ borderBottomWidth: 1, borderColor: Colors.L_Border }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: width / 40 }}>
                                        <Text style={{ color: 'grey', fontSize: height / 45, marginLeft: width / 40 }}>{DateString ? moment(DateString).format("D MMM, YYYY") : 'Start/From Date'}</Text>
                                        <Icon name={"calendar"} type='antdesign' color={'grey'} size={height / 30} iconStyle={{ marginHorizontal: MinMargin }} />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={{ marginTop: 30, }}>
                                <TouchableOpacity onPress={() => setData({ ...data, Show1: true })} style={{ borderBottomWidth: 1, borderColor: Colors.L_Border }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: width / 40 }}>
                                        <Text style={{ color: 'grey', fontSize: height / 45, marginLeft: width / 40 }}>{DateString1 ? moment(DateString1).format("D MMM, YYYY") : 'Expiry Date'}</Text>
                                        <Icon name={"calendar"} type='antdesign' color={'grey'} size={height / 30} iconStyle={{ marginHorizontal: MinMargin }} />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {data?.Doc?
                            <View style={{ 
                                    marginTop:20,
                                    borderWidth: 2,  
                                    shadowColor: "#000000",
                                    shadowOpacity: 0.8,
                                    shadowRadius: 2,
                                    shadowOffset: {
                                    height: 1,
                                    width: 1
                                    },
                                    elevation:4,
                                    borderColor: '#DDD' , paddingVertical: 10, paddingHorizontal: 25, backgroundColor: '#FFF' }}>
                                    <View style={{ flexDirection: 'row',justifyContent:'space-between', paddingTop: 5 }}>
                                        <Text style={{ color: '#22D2B4' , fontSize: 18, paddingBottom: 5,flex:0.85 }}>{data?.FileName}</Text>
                                    <TouchableOpacity onPress={() => {
                                        setData(prev=>({...prev,Doc:"",FileName:""}))
                                    }} style={{flex:0.15}}>
                                        <Image
                                            style={{ width: 24, height: 24, marginHorizontal: 20 }}
                                            resizeMode={'contain'}
                                            source={require('../Assets/Icons/Delete.png')} />
                                    </TouchableOpacity>
                                    </View>
                            </View>
                            :<>
                            <View style={{ marginTop: 20, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderRadius: 10, paddingTop: 30, paddingBottom: 60 }}>
                                <Image
                                    style={{ width: 60, height: 60, marginBottom: 10,tintColor:"#007bbf" }}
                                    resizeMode={'contain'}
                                    source={require('../Assets/Icons/UploadImage.png')} />
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Upload</Text>
                                <Text style={{ fontSize: 16 }}>Document/Image</Text>
                            </View>
                            <View style={{ marginTop: -60, alignItems: 'center' }}>
                                <TouchableOpacity
                                    style={{ width: width / 1.5, height: 60,  backgroundColor: '#007bbf', marginTop: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}
                                    onPress={() => ChooseOption()}
                                >
                                    <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>BROWSE</Text>
                                </TouchableOpacity>
                            </View>
                            </>}


                        </View>
                    <DateTimePickerComp
                        isDatePickerVisible={Show}
                        handleConfirm={(date) => handleConfirm(date, 'Start')}
                        hideDatePicker={() => hideDatePicker('Start')}
                        mode={'date'}
                        DateVal={StartDate}
                    />

                    <DateTimePickerComp
                        isDatePickerVisible={Show1}
                        handleConfirm={(date) => handleConfirm(date, 'expire')}
                        hideDatePicker={() => hideDatePicker('expire')}
                        mode={'date'}
                        DateVal={ExpiryDate}
                        MinDate={new Date(StartDate)}
                    />
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

export default AddCompliance
















