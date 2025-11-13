import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { useState } from 'react';
import Colors from '../../../Util/Colors';
import DateTimePickerComp from '../../../Components/DateTimePickerComp';
import DropDownPicker from 'react-native-dropdown-picker';
import Config from '../../../Util/Config';
const backBtn = require('../../../Assets/Icons/BackScreen.png');
const LogoNew = require('../../../Assets/Icons/LogoNew.png');
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const { width, height } = Dimensions.get('window');

import { Icon, Overlay } from 'react-native-elements';
import Styles, { MinMargin } from '../../../Util/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import Types from '../../../redux/Types';
import KeyBoardWrapper from '../../../Components/KeyBoardWrapper';
import {
  callAddCurrentJob,
  callGetNoticePeriods,
  callGetSalaryTypes,
  callGetWorkTypes,
} from '../../../Services/Api';
import Loader from '../../../Components/Loader';
import { normalizeSize, numberWithCommas } from '../../../Util/CommonFun';

const SignUpCurrentJob = props => {
  const [Show, setShow] = useState(false);
  const [endShow, setEndShow] = useState(false);
  const [DateString, SetDateString] = useState('');
  const [EndDateString, SetEndDateString] = useState('');
  const [availableString, SetAvailableString] = useState('');
  const [availableShow, setAvailableShow] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [gender, setGender] = useState(null);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);

  const [salaryOpen, setSalaryOpen] = useState(false);
  const [salaryValue, setSalaryValue] = useState(null);
  const [salaryItems, setSalaryItems] = useState(null);

  const [noticeOpen, setNoticeOpen] = useState(false);
  const [noticeValue, setNoticeValue] = useState(null);
  const [noticeItems, setNoticeItems] = useState([]);
  const [workType, setWorkType] = useState([]);
  const [salary, setSalary] = useState([]);
  const [noticePeriod, setNoticePeriod] = useState([]);

  const [data, setData] = useState({
    title: '',
    companyName: '',
    salaryRate: '',
    // workType: 'Perm',
    workType: '',
    startDate: '',
    endDate: '',
    salaryType: '',
    // salaryType: 'Annual Salary',
    // noticePeriod: '2 Weeks',
    noticePeriod: '',
    availableFrom: '',
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector(S => S.loginStatus.loginData.token);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    let URL = Config().getWorkTypes;
    let salaryURL = Config().getSalaryTypes;
    let NoticeURL = Config().getNoticePeriods;

    setLoading(true);
    await callGetWorkTypes(URL, token)
      .then(async res => {
        console.log('Profile res :- ', res);
        setLoading(false);

        if (res) {
          const dropDownArr = [];
          const valueArr = Object.values(res);
          Object.keys(res).map((item, index) => {
            dropDownArr.push({
              label: valueArr[index],
              value: item,
              testID: item,
            });
          });
          console.log('Array >>>>>>>', dropDownArr);
          setWorkType(dropDownArr);
          await dispatch({ type: Types.Get_Work_Types, data: res });
          setTimeout(() => { }, 300);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log('Get Work Types error :- ', error);
        showMessage({ message: 'Error', description: error, type: 'warning' });
      });
    await callGetSalaryTypes(salaryURL, token)
      .then(async res => {
        console.log('Profile res :- ', res);
        setLoading(false);

        if (res) {
          const dropDown = [];
          res.map((item, index) => {
            dropDown.push({ label: item, value: item, testID: item });
          });
          console.log('drp', dropDown);
          setSalary(dropDown);
          await dispatch({ type: Types.Get_Salary_Types, data: res });
          setTimeout(() => { }, 300);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log('Get Work Types error :- ', error);
        showMessage({ message: 'Error', description: error, type: 'warning' });
      });
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
  const submit = async () => {
    if (!data.title) {
      Alert.alert('Alert', 'Please enter job title');
      return false;
    }
    if (!data.companyName) {
      Alert.alert('Alert', 'Please enter company name');
      return false;
    }
    if (!data.startDate) {
      Alert.alert('Alert', 'Please select start date');
      return false;
    }
    if (!data.workType) {
      Alert.alert('Alert', 'Please select work type');
      return false;
    }
    // if (!data.salaryType) {
    //   Alert.alert('Alert', 'Please select salary type');
    //   return false;
    // }
    // if (!data.salaryRate) {
    //   Alert.alert('Alert', 'Please enter salary rate');
    //   return false;
    // }
    if (!data.noticePeriod) {
      Alert.alert('Alert', 'Please select notice period');
      return false;
    }
    let addCurrentJobUrl = Config().addCurrentJob;
    let body = {
      title: data.title,
      company_name: data.companyName,
      start_date: data.startDate,
      end_date: data.endDate,
      work_type: data.workType,
      salary_type: data.salaryType,
      salary_rate: data.salaryRate,
      notice_period: data.noticePeriod,
      available_from: data.availableFrom,
    };
    setLoading(true);
    await callAddCurrentJob(addCurrentJobUrl, body, token)
      .then(async res => {
        console.log('submit current job response', res);
        setLoading(false);
        if (res) {
          showMessage({
            message: 'Success',
            description: 'Current job added successfully.',
            type: 'success',
          });
          console.log('Repo', res);
          await dispatch({ type: Types.Add_Current_Job, data: res });
        }
      })
      .catch(error => {
        setLoading(false);
        console.log('Add Current Job Error', error);
        showMessage({
          message: 'Error Occurred',
          description: error,
          type: 'warning',
        });
      });
    goToSignUpIdealJob(token);
  };

  const goToSignUpIdealJob = async () => {
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

  const hideDatePicker = () => {
    setShow(false);
  };

  const handleConfirm = date => {
    SetDateString(date);
    const dateFormat = moment(date).format('YYYY-MM-DD');
    console.log('Date Format', dateFormat);
    setData({ ...data, startDate: dateFormat });
    setShow(false);
    if (date > EndDateString) SetEndDateString('');
  };

  const hideEndDatePicker = () => {
    setEndShow(false);
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

  const handleSalaryRate=(val)=>{
    if(val !==''){
      let rate=val
      if(data.salaryType == 'Annual Salary' || data.salaryType == 'Annual and Commission'){
        rate = numberWithCommas(val)
        return rate 
      }
      else{
        return rate
      }
    }
  }

  const handleInputBlur=()=>{
   if(data.salaryType == 'Hourly Rate'){
    let inputValue=Number(data.salaryRate).toFixed(2).toString()
    setData({...data,salaryRate:inputValue})
   }
  }

  const onChangeSalaryRate=(val)=>{
      let value = val.split(',').join('')
      setData({...data,salaryRate:value})  
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      {loading ? <Loader /> : null}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.view3}>
          <Text style={styles.text}>Enter details of current or last job</Text>

          <View style={{ width: '100%' }}>
            <TextInput
              style={styles.inputStyle}
              placeholder="Job Title*"
              placeholderTextColor="#7A7A7A"
              textValue={data.title}
              keyboardShouldPersistTaps
              onChangeText={value => setData({ ...data, title: value })}
            />
            <TextInput
              style={styles.inputStyle}
              placeholder="Company Name*"
              placeholderTextColor="#7A7A7A"
              textValue={data.companyName}
              keyboardShouldPersistTaps
              onChangeText={value => setData({ ...data, companyName: value })}
            />

            <DateTimePickerComp
              isDatePickerVisible={Show}
              handleConfirm={date => handleConfirm(date)}
              hideDatePicker={() => hideDatePicker()}
              mode={'date'}
              DateVal={startDate}
              MaxDate={new Date()}
            />

            <DateTimePickerComp
              isDatePickerVisible={endShow}
              handleConfirm={date => handleEndConfirm(date)}
              hideDatePicker={() => hideEndDatePicker()}
              mode={'date'}
              DateVal={startDate}
              MinDate={DateString ? DateString : null}
              MaxDate={new Date()}
            />

            <DateTimePickerComp
              isDatePickerVisible={availableShow}
              handleConfirm={date => handleAvailableConfirm(date)}
              hideDatePicker={() => handleEndConfirm()}
              mode={'date'}
              DateVal={startDate}
            />

              <TouchableOpacity
                onPress={() => setShow(!Show)}
                style={{               
                  marginVertical: 15,
                  borderRadius: 10,
                  width: Config().width - 40,
                  zIndex: -9999,
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
                  {DateString
                    ? moment(DateString).format('D MMM, YYYY')
                    : 'Start Date*'}
                </Text>
                <Icon
                  name={'calendar'}
                  type="antdesign"
                  color={'grey'}
                  size={Config().height / 30}
                  iconStyle={{ marginHorizontal: MinMargin }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setEndShow(!endShow)}
                style={{
                  marginBottom: 10,
                  marginTop: 5,
                  borderRadius: 10,
                  width: Config().width - 40,
                  zIndex: -9999,
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
                  {EndDateString
                    ? moment(EndDateString).format('D MMM, YYYY')
                    : 'Finish Date (If applicable)'}
                </Text>
                <Icon
                  name={'calendar'}
                  type="antdesign"
                  color={'grey'}
                  size={Config().height / 30}
                  iconStyle={{ marginHorizontal: MinMargin }}
                />
              </TouchableOpacity>

            <DropDownPicker
              testID={'signUpDropgender'}
              open={open}
              value={value}
              items={workType}
              zIndex={1000}
              maxHeight={Config().height / 3}
              setOpen={setOpen}
              itemKey={(item, index) => String(index)}
              setValue={setValue}
              disabled={salaryOpen || noticeOpen ? true : false}
              setItems={setWorkType}
              listMode="FLATLIST"
              placeholder="Select work type*"
              listItemContainerStyle={{ paddingVertical: 5 }}
              selectedItemLabelStyle={{ fontWeight: 'bold' }}
              dropDownContainerStyle={{
                zIndex: salaryOpen || noticeOpen ? -9999 : 9999,
                backgroundColor: Colors.White,
                borderColor: Colors.Border,
              }}
              placeholderStyle={{ borderColor: Colors.Border }}
              style={
                Platform.OS === 'android'
                  ? {
                    marginVertical: 10,
                    borderColor: Colors.Border,
                    width: Config().width - 40,
                    height: 58,
                  }
                  : {
                    marginVertical: 10,
                    borderColor: Colors.Border,
                    width: Config().width - 40,
                    height: 58,
                  }
              }
              // containerStyle={GlobalStyles.globalBorder}
              onChangeValue={value => {
                setData({ ...data, workType: value });
              }}
              onPress={open => setOpen(false)}
            />

            {/* //salary dropDown */}

            <DropDownPicker
              testID={'signUpDropgender'}
              open={salaryOpen}
              value={salaryValue}
              items={salary}
              zIndex={1000}
              maxHeight={Config().height / 3}
              setOpen={setSalaryOpen}
              disabled={open || noticeOpen ? true : false}
              itemKey={(item, index) => String(index)}
              setValue={setSalaryValue}
              setItems={setSalary}
              listMode="FLATLIST"
              placeholder="Select salary type"
              listItemContainerStyle={{ marginVertical: 5 }}
              selectedItemLabelStyle={{ fontWeight: 'bold' }}
              dropDownContainerStyle={{
                zIndex: open || noticeOpen ? -9999 : 9999,
                backgroundColor: Colors.White,
                borderColor: Colors.Border,
              }}
              placeholderStyle={{ borderColor: Colors.Border }}
              style={
                Platform.OS === 'android'
                  ? {
                    marginVertical: 10,
                    borderColor: Colors.Border,
                    width: Config().width - 40,
                    height: 58,
                  }
                  : {
                    marginVertical: 10,
                    borderColor: Colors.Border,
                    width: Config().width - 40,
                    height: 58,
                  }
              }
              // containerStyle={GlobalStyles.globalBorder}
              onChangeValue={value => {
                setData({ ...data, salaryType: value });
              }}
              onPress={open => setSalaryOpen(false)}
            />

            <TextInput
              style={styles.inputStyle}
              placeholder="Salary Rate"
              placeholderTextColor="#7A7A7A"
              value={handleSalaryRate(data.salaryRate)}
              keyboardType="number-pad"
              keyboardShouldPersistTaps
              onChangeText={value =>onChangeSalaryRate(value)}
              onBlur={handleInputBlur}
            />

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

            <View style={{ marginBottom: 20 }}>
              <BackNextBtn />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  inputStyle: {
    width: screenWidth - 40,
    height: 58,
    backgroundColor: 'white',
    marginTop: 15,
    borderRadius: 10,
    fontSize: normalizeSize(16),
    paddingLeft: 10,
    paddingHorizontal: 5,
    zIndex: -9999,
    color: Colors.Black,
  },
  touchCont: {
    flexDirection: 'row',
    zIndex: -9999,
    marginTop: 30,
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
    backgroundColor: '#D02530',
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
  view3: {
    width: '100%',
  },
  text: {
    alignSelf: 'center',
    fontSize: normalizeSize(18),
    marginTop: 20,
    fontWeight: '600',
  },
});

export default SignUpCurrentJob;
