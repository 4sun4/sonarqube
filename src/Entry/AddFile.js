import React, {useEffect,useState} from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Dimensions,
  SafeAreaView,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Colors from '../Util/Colors';
import {callGetRestApis, globalPostApi} from '../Services/Api';
import Loader from '../Components/Loader';
import {FileFun, isVideo, normalizeSize} from '../Util/CommonFun';
import DocumentPicker from 'react-native-document-picker';
import {showMessage} from 'react-native-flash-message';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Config from '../Util/Config';
import DropDownPicker from 'react-native-dropdown-picker';
import {store} from '../redux/Store';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const {height, width} = Dimensions.get('window');
let LoginData = '';

const sampleDropdownData = [
  {
    id: 1,
    label: 'Australian/New Zealand Citizen',
    value: 'Australian/New Zealand Citizen',
  },
  {id: 2, label: 'Visa Holder', value: 'Visa Holder'},
];
const AddFile = props => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [Item, setItem] = useState([]);
  const [DropDownTypeData, setDropDownTypeData] = useState([]);
  const [documentOpen, setDocumentOpen] = useState(false);
  const [documentValue, setDocumentValue] = useState(null);
  const [documentData, setDocumentData] = useState([]);

  const dispatch = useDispatch();
  const [data, setData] = useState({
    FileName: '',
    Doc: '',
  });
  const {FileName, Doc} = data;
  const facilityName = store.getState().loginStatus.facility;
  const UserDetail = useSelector(S => {
    let D = '';
    if (
      S &&
      S.loginStatus &&
      S.loginStatus.loginData &&
      Object.keys(S.loginStatus.loginData).length != 0
    ) {
      D = S.loginStatus.loginData;
      if (D) {
        LoginData = D;
      }
    }
    return D;
  });

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
                  textAlign: 'center',
                }}>
                Add File
              </Text>

             <TouchableOpacity
                activeOpacity={0.8}
                underlayColor="white"
                onPress={() => UploadFileFun()}
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

  const selectOneFile = async () => {
    setLoading(true);

    try {
      const resp = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const res = resp[0];
      console.log('res : ', res);
      console.log('URI : ' + res.uri);
      console.log('Type : ' + res.type);
      console.log('File Name : ' + res.name);
      console.log('File Size : ' + res.size);
      let name = res && res.name ? res.name : '';
      let type = res && res.type ? res.type : '';
      setLoading(false);

      if (isVideo(type) || isVideo(name)) {
        showMessage({
          message: 'Alert',
          description: 'Please Select Valid FileType',
          type: 'warning',
        });
      } else {
        // setData({...data, FileName: name});
        if (res && res.uri) {
          setData({...data, Doc: res,FileName: name});
          showMessage({
            message: 'Success',
            description: 'Document Picked Successfully.',
            type: 'success',
          });
        }
      }
    } catch (err) {
      setLoading(false);

      if (DocumentPicker.isCancel(err)) {
      } else {
        showMessage({message: 'Error', description: err, type: 'warning'});

        throw err;
      }
    }
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', async () => {
      getFileTypes();
    });
    return unsubscribe;
  }, []);

  const getFileTypes = async () => {
    if (LoginData && LoginData.token) {
      let URL = Config().getFileTypes;
      console.log('URL', URL);
      setLoading(true);
      await callGetRestApis(URL)
        .then(res => {
          setLoading(false);
          if (res && res.length > 0) {
            let dup = res.filter(
              (v, i, a) => a.findIndex(t => t.fileType === v.fileType) === i,
            );
            let arr = [];
            dup.map((it, ind) => {
              arr.push({label: it.fileType, value: it.fileType, id: ind});
            });
            setDocumentData(arr);
            console.log('getFileTypes res arr :- ', arr);
          }
          console.log('getFileTypes res :- ', res);
        })
        .catch(error => {
          setLoading(false);
          console.log('getFileTypes error :- ', error);
          showMessage({message: 'Error', description: error, type: 'warning'});
        });
    } else {
    }
  };

  const UploadFileFun = async () => {
    if (!documentValue) {
      Alert.alert('Alert', 'Please Select Document Type');
      return;
    }
    // else if (!FileName) {
    //     Alert.alert('Alert', 'Please enter Document Name')
    //     return
    // }
    else if (!Doc) {
      Alert.alert('Alert', 'Please Select Document');
      return;
    } else {
      handleUploadFileApi();
    }
  };
  const handleUploadFileApi = async () => {
    let file = FileFun(Doc);
    setLoading(true);
    let formdata = new FormData();
    formdata.append('file', file), formdata.append('fileType', documentValue);
    console.log('formdata', formdata);
    let Url = Config().uploadMyFiles;

    await globalPostApi(Url, formdata)
      .then(res => {
        setLoading(false);
        console.log('uploadMyFiles res :- ', res);
        if (res && res.success == true) {
          props.navigation.navigate('MyFile');
          showMessage({
            message: 'Success',
            description: 'File  Added successfully.',
            type: 'success',
          });
        } else {
          alert(res.message);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log('uploadMyFiles error :- ', error);
        showMessage({
          message: 'Error',
          description:
            typeof error == 'string' ? error : 'Failed to upload file.',
          type: 'warning',
        });
      });
  };

  const options = {
    mediaType: 'photo',
    includeBase64: false,
  };

  const ChooseOption = () => {
    Alert.alert(
      'Alert',
      'Upload file?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Gallery',
          onPress: () => selectOneFile(),
        },
        {
          text: 'Camera',
          onPress: () => {
            if (Platform.OS === 'android') {
              requestCameraPermission();
            } else {
              getProductImages();
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'Needs access to your camera to update profile image',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getProductImages();
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getProductImages = async Gallery => {
    let methodName = launchImageLibrary;
    if (!Gallery) {
      methodName = launchCamera;
    }
    setLoading(true);

    methodName(options, res => {
      let response = res.hasOwnProperty('assets') ? res.assets[0] : res;
      console.log(response,"reps")
      if (response.didCancel) {
        console.log('User cancelled image picker ');
        setLoading(false);
      } else if (response.error) {
        console.log('ImagePicker Error:  ', response.error);
        setLoading(false);
      } else {
        console.log('Profile image  =>  ', response);
        setData({...data, Doc: response,FileName: response?.fileName});
        setLoading(false);
        showMessage({
          message: 'Success',
          description: 'Document Picked Successfully.',
          type: 'success',
        });

        let FileSize = 0;
        if (response.fileSize) {
          FileSize = response.fileSize;
        }
        if (FileSize && FileSize > 2500000) {
          let widthN = 400;
          let heightN = 300;
          if (response.height) {
            heightN = response.height / 4;
          }
          if (response.width) {
            widthN = response.width / 4;
          }
          let Rot = 0;
          if (response.originalRotation) {
            Rot = response.originalRotation;
          }
        } else {
          if (response && response.uri) {
            setData({...data, Doc: response,FileName: response?.fileName});
          }
        }
      }
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {loading ? <Loader /> : null}

      <View style={styles.container}>
        <ScrollView>
          <KeyboardAvoidingView>
            <View style={{width: '100%', paddingVertical: 20}}>
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
                  Use the form below to add file such as resume, application
                  letter, etc.
                </Text>
              </View>
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
                }}
                onChangeValue={value => {
                  console.log(value);
                }}
              />
              {data?.Doc?<View style={{ 
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
              :
              <>
              <View
                style={{
                  marginTop: 20,
                  backgroundColor: '#FFF',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  paddingTop: 30,
                  paddingBottom: 60,
                }}>
                <Image
                  style={{
                    width: 60,
                    height: 60,
                    marginBottom: 10,
                    tintColor: '#007bbf',
                  }}
                  resizeMode={'contain'}
                  source={require('../Assets/Icons/UploadImage.png')}
                />
                <Text style={{fontWeight: 'bold', fontSize: 16}}>Upload</Text>
                <Text style={{fontSize: 16}}>Document/Image</Text>
              </View>
              <View style={{marginTop: -60, alignItems: 'center'}}>
                <TouchableOpacity
                  style={{
                    width: width / 1.5,
                    height: 60,
                    backgroundColor: '#007bbf',
                    marginTop: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 20,
                  }}
                  onPress={() => ChooseOption()}>
                  <Text
                    style={{color: 'white', fontSize: 20, fontWeight: '600'}}>
                    BROWSE
                  </Text>
                </TouchableOpacity>
              </View>
              </>}
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F6F6F6',
  },
});

export default AddFile;
