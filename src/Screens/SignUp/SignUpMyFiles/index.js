import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { useState } from 'react';
import Colors from '../../../Util/Colors';
import Config from '../../../Util/Config';
const backBtn = require('../../../Assets/Icons/BackScreen.png');
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
import { Icon } from 'react-native-elements';
import { MinMargin } from '../../../Util/Styles';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import Types from '../../../redux/Types';
import {
  callGetRestApis,
  callPostRest,
  callUploadMyFiles,
} from '../../../Services/Api';
import Loader from '../../../Components/Loader';
import { StackActions } from '@react-navigation/native';
import DocumentPicker, { types } from 'react-native-document-picker';
import { normalizeSize } from '../../../Util/CommonFun';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  callAddCurrentJob,
  callGetNoticePeriods,
  callGetSalaryTypes,
  callGetWorkTypes,
} from '../../../Services/Api';
import DateTimePickerComp from '../../../Components/DateTimePickerComp';

let Gender = [
  { label: 'Male', value: 'male', testID: 'male' },
  { label: 'Female', value: 'female', testID: 'female' },
];

const SignUpMyFiles = props => {

  const [MyFileData, setMyFileData] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector(S => S.loginStatus.loginData.token);
  const [changedFile, setChangedFile] = useState({});
  const [availableString, SetAvailableString] = useState('');
  const [availableShow, setAvailableShow] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [noticeValue, setNoticeValue] = useState(null);
  const [noticeItems, setNoticeItems] = useState([]);
  const [noticePeriod, setNoticePeriod] = useState([]);
  const [salaryOpen, setSalaryOpen] = useState(false);
  const [salaryValue, setSalaryValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [data, setData] = useState({
    title: '',
    companyName: '',
    salaryRate: '',
    workType: '',
    startDate: '',
    endDate: '',
    salaryType: '',
    noticePeriod: '',
    availableFrom: '',
  });
  const [endShow, setEndShow] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [EndDateString, SetEndDateString] = useState('');

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    let NoticeURL = Config().getNoticePeriods;

    setLoading(true);
    await callGetNoticePeriods(NoticeURL, token)
      .then(async res => {
        console.log('Profile res :- ', res);
        setLoading(false);

        if (res) {
          const dropDownNotice = [];
          res.map((item, index) => {
            dropDownNotice.push({ label: item, value: item, testID: item });
          });
          console.log('drp>>>>>', dropDownNotice);
          setNoticePeriod(dropDownNotice);
          await dispatch({ type: Types.Get_Notice_Periods, data: res });
          setTimeout(() => { }, 300);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log('Get Work Types error :- ', error);
        showMessage({ message: 'Error', description: error, type: 'warning' });
      });
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', async () => {
      getMyFile();
    });
    return unsubscribe;
  }, []);

  const getMyFile = async () => {
    let URL = Config().getCandidateFiles;
    console.log('URL', URL);
    let sorted = [];
    setLoading(true);
    await callGetRestApis(URL)
      .then(res => {
        setLoading(false);
        if (res) {
          sorted = res.sort(function (a, b) {
            return new Date(b.created_date) - new Date(a.created_date);
          });
          setMyFileData(sorted);
        }
        console.log('getCandidateFiles res :- ', res);
      })
      .catch(error => {
        setLoading(false);
        console.log('getCandidateFiles error :- ', error);
        showMessage({ message: 'Error', description: error, type: 'warning' });
      });
  };


  // const goToHome = async () => {
  //   props.navigation.dispatch(StackActions.replace('Home', { screen: 'Home' }));
  // };
  const goToIdealJob = async () => {
    props.navigation.navigate('SignUpIdealJob');
  };

  const BackNextBtn = ({ }) => {
    return (
      <View style={styles.touchCont}>
        <TouchableOpacity
          style={styles.halfBtn}
          onPress={() => props.navigation.goBack()}>
          <Text style={styles.halfText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.halfBtn2} onPress={() => submit()}>
          <Text style={styles.halfText2}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const RenderFiles = ({ fileName, uploadDate }) => {
    return (
      <>
        <View style={styles.dateSaved}>
          <Text style={styles.text1}>File Name: </Text>
          <Text style={styles.text2}>{fileName}</Text>
        </View>

        <View style={styles.dateSaved}>
          <Text style={styles.text1}>Date Saved: </Text>
          <Text style={styles.text2}>{uploadDate}</Text>
        </View>
        <View style={styles.wrapper} />
      </>
    );
  };

  const sendResumeData = async (val) => {
    if (Object.keys(val).length === 0) {
      showMessage({ message: 'Alert', description: 'Please upload file first.', type: 'warning' });
      return false
    }
    let uploadMyFileUrl = Config().profileUploadMyFiles;
    setLoading(true);
    await callUploadMyFiles(uploadMyFileUrl, val, token)
      .then(async res => {
        console.log('Upload Files response', res);

        setLoading(false);
        if (res) {
          showMessage({
            message: 'Success',
            description: 'Upload Files successfully.',
            type: 'success',
          });
          console.log('Repo', res);
          await dispatch({ type: Types.Profile_Upload_My_Files, data: res });
          getMyFile();
        }
      })
      .catch(error => {
        setLoading(false);
        console.log('Upload Files Error', error);
        showMessage({
          message: 'Error Occurred',
          description: error,
          type: 'warning',
        });
      });
  };

  const submit = async () => {
    if (!data.noticePeriod) {
      Alert.alert('Alert', 'Please select notice period');
      return false;
    }
    // setLoading(true);
    // await dispatch({ type: Types.NEWUSER, data: true });
    // setTimeout(() => { setLoading(false);
    //   //  goToHome() 
    //   goToIdealJob()
    //   }, 2000);
    let addCurrentJobUrl = Config().addCurrentJob;
    let body = {
      title: "",
      company_name: "",
      start_date: "",
      end_date: "",
      work_type: "",
      salary_type: "",
      salary_rate: "",
      notice_period: data?.noticePeriod,
      available_from: data?.availableFrom,
    };
    console.log('req params:',body)
    setLoading(true);
    await callAddCurrentJob(addCurrentJobUrl, body, token)
      .then(async res => {
        console.log('Add Availability res', res);
        setLoading(false);
        if (res) {
          showMessage({
            message: 'Success',
            description: 'Data added successfully.',
            type: 'success',
          });
          console.log('Repo', res);
          await dispatch({ type: Types.NEWUSER, data: true });
        }
      })
      .catch(error => {
        setLoading(false);
        console.log('Add Resume & Availability Error', error);
        showMessage({
          message: 'Error Occurred',
          description: error,
          type: 'warning',
        });
      });
      goToIdealJob(token);
  };

  const getFile = async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        type: [types.allFiles],
        copyTo: 'documentDirectory',
        mode: 'open',
      });
      console.log('response:', response);
      if (response && response != '') {
        // let fileuri =
        // response.fileCopyUri.length > 0
        //   ? response.fileCopyUri.replace('file:', 'file:/')
        //   : response.fileCopyUri;
        let fileuri = response.uri
        let fileData = {
          type: response.type,
          uri: fileuri,
          name: response.name,
        };
        console.log('fileData:', fileData);
        setChangedFile(fileData);
        sendResumeData(fileData);
      } else {
        console.log('Response not came');
      }
    } catch (error) {
      showMessage({
        message: 'Warning',
        description: 'User Cancelled the Document Picker.',
        type: 'warning',
      });
    }
  };

  const handleEndConfirm = date => {
    SetEndDateString(date);
    const dateFormat = moment(date).format('YYYY-MM-DD');
    console.log('Date Format', dateFormat);
    setData({ ...data, endDate: dateFormat });
    setEndShow(false);
  };

  const hideAvailableDatePicker = () => {
    setAvailableShow(false);
  };

  const handleAvailableConfirm = date => {
    SetAvailableString(date);
    const dateFormat = moment(date).format('YYYY-MM-DD');
    console.log('Date Format', dateFormat);
    setData({ ...data, availableFrom: dateFormat });
    setAvailableShow(false);
  };



  return (
    <View style={styles.container}>
      {loading ? <Loader /> : null}
      <ScrollView
        style={{ flex: 1 }}
        scrollEnabled={MyFileData && MyFileData != '' ? true : false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.view3}>
          <View style={[styles.innerWrapper, { width: Config().width - 40 }]}>
            <TouchableOpacity onPress={() => getFile()} style={styles.plus}>
              <Icon
                name={'plus'}
                type="entypo"
                color={Colors.ThemeRed}
                size={Config().height / 30}
                iconStyle={{ marginHorizontal: MinMargin }}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.text}>Upload your resume</Text>

          <Text style={styles.text0}>Files:</Text>

          {MyFileData && MyFileData != '' ? (
            <View style={styles.mainWrapper}>

              {MyFileData.map((item, i) => {
                return (
                  <RenderFiles
                    uploadDate={moment(item.modified_on).format(
                      'DD MMM YYYY hh:mm A',
                    )}
                    fileName={item.filename}
                  />
                );
              })}

            </View>
          ) : (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: normalizeSize(14) }}>No Data Available</Text>
            </View>
          )}
           <DropDownPicker
              testID={'signUpDropgender'}
              open={noticeOpen}
              value={noticeValue}
              items={noticePeriod}
              zIndex={1000}
              maxHeight={Config().height / 3}
              setOpen={setNoticeOpen}
              itemKey={(item, index) => String(index)}
              setValue={setNoticeValue}
              setItems={setNoticePeriod}
              listMode="FLATLIST"
              placeholder="Select notice period*"
              disabled={open || salaryOpen ? true : false}
              listItemContainerStyle={{ marginVertical: 5 }}
              selectedItemLabelStyle={{ fontWeight: 'bold' }}
              dropDownContainerStyle={{
                zIndex: open || salaryOpen ? -9999 : 9999,
                backgroundColor: Colors.White,
                borderColor: Colors.Border,
              }}
              placeholderStyle={{ borderColor: Colors.Border }}
              style={
                Platform.OS === 'android'
                  ? {
                    marginVertical: 10,
                    marginTop: 20,
                    borderColor: Colors.Border,
                    width: Config().width - 40,
                    height: 58,
                  }
                  : {
                    marginVertical: 10,
                    marginTop: 20,
                    borderColor: Colors.Border,
                    width: Config().width - 40,
                    height: 58,
                  }
              }
              // containerStyle={GlobalStyles.globalBorder}
              onChangeValue={value => {
                setData({ ...data, noticePeriod: value });
              }}
              onPress={open => setNoticeOpen(false)}
            />
             <TouchableOpacity
                onPress={() => setAvailableShow(!availableShow)}
                style={{
                  marginVertical: 15,
                  zIndex: -9999,
                  borderRadius: 10,
                  width: Config().width - 40,
                  backgroundColor: Colors.White,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  height: 58,
                }}>
                <Text
                  style={{
                    color: 'grey',
                    fontSize: normalizeSize(16),
                    marginLeft: Config().width / 40,
                  }}>
                  {availableString
                    ? moment(availableString).format('D MMM, YYYY')
                    : 'Available Date'}
                </Text>
                <Icon
                  name={'calendar'}
                  type="antdesign"
                  color={'grey'}
                  size={Config().height / 30}
                  iconStyle={{ marginHorizontal: MinMargin }}
                />
              </TouchableOpacity>
           <DateTimePickerComp
              isDatePickerVisible={availableShow}
              handleConfirm={date => handleAvailableConfirm(date)}
              hideDatePicker={() => handleEndConfirm()}
              mode={'date'}
              DateVal={startDate}
            />
             
        </View>
      </ScrollView>
      <View style={{ marginTop: 20 }}>
        <BackNextBtn />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  touchCont: {
    flexDirection: 'row',
    zIndex: -9999,
    bottom: normalizeSize(10),
    left: 0,
    right: 0,
    justifyContent: 'space-around',
  },
  halfBtn: {
    width: (screenWidth - 60) / 2.5,
    height: 60,
    backgroundColor: Colors.Trans,
    borderWidth: 1,
    borderColor: Colors.halfBlack,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  halfBtn2: {
    width: (screenWidth - 60) / 2.5,
    height: 60,
    // backgroundColor: '#D02530',
    backgroundColor: '#1c78ba',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  halfText: {
    color: Colors.Black,
    fontSize: normalizeSize(16),
    fontWeight: '600',
  },
  halfText2: {
    color: 'white',
    fontSize: normalizeSize(16),
    fontWeight: '600',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F6F6F6',
  },
  useText: {
    color: Colors.halfBlack,
    fontSize: 15,
    marginTop: 30,
    fontWeight: '600',
  },
  passInput: {
    width: 350,
    height: 50,
    borderWidth: 2.0,
    borderColor: 'white',
    borderRadius: 30,
    fontSize: 18,
    backgroundColor: 'white',
  },
  btn: {
    width: screenWidth - 60,
    height: 60,
    backgroundColor: '#D02530',
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  btnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  flRowAlCenterJCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alreadyText: {
    marginTop: 15,
    marginBottom: 15,
    alignSelf: 'center',
    fontSize: 17,
    fontWeight: '400',
  },
  loginBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  loginText: {
    color: '#D02530',
    fontSize: 17,
    fontWeight: '600',
  },
  imgStyle: {
    marginTop: -70,
    marginLeft: -60,
  },
  view1: {
    flex: 1,
    position: 'absolute',
    alignSelf: 'center',
  },
  view2: {
    alignSelf: 'center',
    marginTop: 100,
  },
  view3: {
    height: screenHeight,
    width: '100%',
  },
  innerWrapper: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  plus: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 58,
  },
  mainWrapper: {
    width: '100%',
  },
  text: {
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: normalizeSize(20),
    fontWeight: '600',
  },

  text0: {
    fontSize: normalizeSize(20),
    fontWeight: '600',
    marginTop: 20,
  },
  text1: {
    alignSelf: 'center',
    fontSize: normalizeSize(16),
    marginTop: 10,
  },
  wrapper: {
    borderWidth: 1,
    marginVertical: 10,
    borderStyle: 'dashed',
    borderRadius: 1,
    borderColor: Colors.halfBlack,
  },
  text2: {
    alignSelf: 'center',
    fontSize: normalizeSize(18),
    marginTop: 10,
    fontWeight: '600',
  },
  dateSaved: {
    width: '100%',
    flexDirection: 'row',
  },
  view4: {
    alignItems: 'center',
    marginTop: 70,
  },
});

export default SignUpMyFiles;
