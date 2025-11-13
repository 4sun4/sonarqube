import React, { createRef, useEffect } from 'react';
import {
  View,
  Text,
  // Image,
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
// import DateTimePickerComp from '../../../Components/DateTimePickerComp';
import DropDownPicker from 'react-native-dropdown-picker';
import Config from '../../../Util/Config';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import Types from '../../../redux/Types';
// const backBtn = require('../../../Assets/Icons/BackScreen.png');
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
import { Icon } from 'react-native-elements';
import { MinMargin } from '../../../Util/Styles';
import {
  callGetJobGroups,
  callGetJobTypes,
  callGetSalaryTypes,
  callGetWorkTypes,
  callAddIdealJobs,
} from '../../../Services/Api';
import Loader from '../../../Components/Loader';
import { normalizeSize, numberWithCommas } from '../../../Util/CommonFun';
import _ from 'lodash';
import { StackActions } from '@react-navigation/native';

const SignUpIdealJob = props => {
  const fromInput = createRef();
  const toInput = createRef();
  const locationInput = createRef();

  // const [Show, setShow] = useState(false);
  // const [endShow, setEndShow] = useState(false);
  // const [DateString, SetDateString] = useState('');
  // const [EndDateString, SetEndDateString] = useState('');
  // const [availableString, setAvailableString] = useState('');
  // const [availableShow, setAvailableShow] = useState(false);
  // const [startDate, setStartDate] = useState(new Date());
  // const [gender, setGender] = useState(null);
  const [jobData, setJobData] = useState({ jobs: [] });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  // const [items, setItems] = useState([]);

  const [salaryOpen, setSalaryOpen] = useState(false);
  const [workOpen, setWorkOpen] = useState(false);
  const [salaryValue, setSalaryValue] = useState('');
  // const [salaryItems, setSalaryItems] = useState([]);

  // const [noticeOpen, setNoticeOpen] = useState(false);
  // const [noticeValue, setNoticeValue] = useState(null);
  // const [noticeItems, setNoticeItems] = useState([]);
  const [workType, setWorkType] = useState([]);
  const [salary, setSalary] = useState([]);

  const [jobGroup, setJobGroup] = useState([]);
  const [jobGroupValue, setJobGroupValue] = useState([]);
  const [jobType, setJobType] = useState([]);
  const [jobGroupId, setJobGroupId] = useState('');
  // const [jobGroupOpen, setJobGroupOpen] = useState(false);
  const [jobTypeOpen, setJobTypeOpen] = useState(false);

  const [jobTypeValue, setJobTypeValue] = useState('');

  const [jobTypeID, setJobTypeID] = useState('');

  const [data, setData] = useState({
    jobGroupId: '',
    jobTypeId: '',
    location: '',
    workTypeData: '',
    salaryTypeData: '',
    minimumSalaryRange: '',
    to: ''
  });

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector(S => S.loginStatus.loginData.token);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    let getJobGroupUrl = Config().getJobGroups;

    let URL = Config().getWorkTypes;
    let salaryURL = Config().getSalaryTypes;

    setLoading(true);
    await callGetJobGroups(getJobGroupUrl, token)
      .then(async res => {
        console.log('Job Groups res :- ', res);
        setLoading(false);

        if (res) {
          const dropDownJobGroup = [];
          res.map(m => {
            dropDownJobGroup.push({
              item: m.job_group_id,
              label: m.job_group_name,
              value: m.job_group_name,
            });
          });
          console.log('dropDown', dropDownJobGroup);
          setJobGroup(dropDownJobGroup);
          await dispatch({ type: Types.Get_Job_Groups, data: res });
          setTimeout(() => { }, 300);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log('Get Job Groups error :- ', error);
        showMessage({ message: 'Error', description: error, type: 'warning' });
      });

    // setLoading(true);
    await callGetWorkTypes(URL, token)
      .then(async res => {
        console.log('Work type response :- ', res);
        setLoading(false);

        if (res) {
          const dropDownArr = [];
          const valueArr = Object.values(res);
          console.log('valueArr:', valueArr);
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

    // setLoading(true);
    await callGetSalaryTypes(salaryURL, token)
      .then(async res => {
        console.log('Profile res :- ', res);
        setLoading(false);

        if (res) {
          const dropDown = [];
          res.map((item, index) => {
            dropDown.push({ label: item, value: item, testID: item });
          });
          console.log('drp>>>>', dropDown);
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
  };

  // useEffect(() => {
  //   getJobType();
  // }, [jobGroupId]);

  const getJobType = async (ID) => {
    let getJobTypesUrl = Config().getJobTypes;
    //'https://testapi.recruitonline.com.au/api/settings/getJobTypes?job_group_id=1';
    let body = { job_group_id: ID };
    console.log('jobGroupId:', ID);
    setLoading(true);
    await callGetJobTypes(getJobTypesUrl, body, token)
      .then(async res => {
        console.log('Job Types res :- ', res);
        setLoading(false);

        if (res) {
          const dropDownJobType = [];
          res.map(m => {
            dropDownJobType.push({
              item: m.job_type_id,
              label: m.job_type,
              value: m.job_type,
            });
          });
          console.log('dropDown', dropDownJobType);
          setJobType(dropDownJobType);
          await dispatch({ type: Types.Get_Job_Types, data: res });
          setTimeout(() => { }, 100);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log('Job Types error :- ', error);
        showMessage({ message: 'Error', description: error, type: 'warning' });
      });
  };

  const submit = async () => {

      let bodyAddIdealJob = jobData
    
      if (!jobGroupId) {
        Alert.alert('Alert', 'Please select job group');
        return false;
      }
      if (!jobTypeID) {
        Alert.alert('Alert', 'Please select job type');
        return false;
      }
      if (!data.location) {
        Alert.alert('Alert', 'Please enter location');
        return false;
      }
      if (!data.workTypeData) {
        Alert.alert('Alert', 'Please select work type');
        return false;
      }
      if (!data.salaryTypeData) {
        Alert.alert('Alert', 'Please select salary type');
        return false;
      }
      if (!data.minimumSalaryRange) {
        Alert.alert('Alert', 'Please enter minimum salary range');
        return false;
      }
      let temp = {
        job_group_id: jobGroupId, job_type_id: jobTypeID, location: data.location,
        work_type: data.workTypeData, salary_type: data.salaryTypeData, minimum_salary_range: data.minimumSalaryRange
      }
      setLoading(true)
      let isExist = _.find(jobData.jobs, temp)
      if (isExist) { Alert.alert('You have already added this job') }
      else { bodyAddIdealJob.jobs.push(temp); setJobData(bodyAddIdealJob) }
      setTimeout(() => { setLoading(false),callNextApi() }, 500);

  };


const callNextApi=async()=>{
  console.log('Body add Ideal Job', jobData);

  let addIdealJobUrl = Config().addIdealJobs;

  setLoading(true);
  await callAddIdealJobs(addIdealJobUrl, jobData, token)
    .then(async res => {
      console.log('Add Ideal Job res :- ', res);
      setLoading(false);

      if (res) {
        showMessage({
          message: 'Success',
          description: 'Ideal job added successfully.',
          type: 'success',
        });
        await dispatch({ type: Types.Add_Ideal_Jobs, data: res });
        setTimeout(() => {  goToHome()}, 500);
        // goToSignUpMyFiles();
       
      }
    })
    .catch(error => {
      setLoading(false);
      console.log('Add Ideal Job error :- ', error);
      showMessage({ message: 'Error', description: error, type: 'warning' });
    });
}

  // const goToSignUpMyFiles = async () => {
  //   props.navigation.navigate('SignUpMyFiles');
  // };
  const goToHome = async () => {
    props.navigation.dispatch(StackActions.replace('Home', { screen: 'Home' }));
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


  const validateFields = () => {
    let bodyAddIdealJob = jobData
    if (bodyAddIdealJob.jobs.length == 5) {
      alert('Max 5 jobs allowed at a time')
      return
    }

    if (!jobGroupId) {
      Alert.alert('Alert', 'Please select job group');
      return false;
    }
    if (!jobTypeID) {
      Alert.alert('Alert', 'Please select job type');
      return false;
    }
    if (!data.location) {
      Alert.alert('Alert', 'Please enter location');
      return false;
    }
    if (!data.workTypeData) {
      Alert.alert('Alert', 'Please select work type');
      return false;
    }
    if (!data.salaryTypeData) {
      Alert.alert('Alert', 'Please select salary type');
      return false;
    }
    if (!data.minimumSalaryRange) {
      Alert.alert('Alert', 'Please enter minimum salary range');
      return false;
    }
    let temp = {
      job_group_id: jobGroupId, job_type_id: jobTypeID, location: data.location,
      work_type: data.workTypeData, salary_type: data.salaryTypeData, minimum_salary_range: data.minimumSalaryRange
    }
    setLoading(true)
    let isExist = _.find(jobData.jobs, temp)
    if (isExist) { Alert.alert('You have already added this job') }
    else { bodyAddIdealJob.jobs.push(temp); setJobData(bodyAddIdealJob); clearCurrentData() }
    setTimeout(() => { setLoading(false) }, 500);
  }


  const clearCurrentData = () => {
    setData({
      jobGroupId: '', jobTypeId: '', location: '',
      workTypeData: '', salaryTypeData: '', minimumSalaryRange: '', to: ''
    });
    setJobGroupId(''); setJobTypeID(''); setJobGroupValue('');
    locationInput.current.clear();
    fromInput.current.clear();
    toInput.current.clear();
    locationInput.current.blur();
    fromInput.current.blur();
    toInput.current.blur();
    setJobTypeValue(''); setValue(''); setSalaryValue('');
    // setData({ ...data, location: '' }); setData({ ...data, minimumSalaryRange: '' }); setData({ ...data, to: '' })
  }

  const handleSalaryRate=(val)=>{
    if(val !==''){
      let rate=val
      if(data.salaryTypeData == 'Annual Salary' || data.salaryTypeData == 'Annual and Commission'){
        rate = numberWithCommas(val)
        return rate 
      }
      else{
        return rate 
      }
    }
  }

  const handleMinInputBlur=()=>{
   if(data.salaryTypeData == 'Hourly Rate'){
    let inputValue=Number(data.minimumSalaryRange).toFixed(2).toString()
    setData({...data,minimumSalaryRange:inputValue})
   }
  }

  const handleMaxInputBlur=()=>{
    if(data.salaryTypeData == 'Hourly Rate'){
     let inputValue=Number(data.to).toFixed(2).toString()
     setData({...data,to:inputValue})
    }
   }

   const onChangeMinSalaryRate=(val)=>{
      let value = val.split(',').join('')
      setData({...data,minimumSalaryRange:value})  
  }

  const onChangeMaxSalaryRate=(val)=>{
    let value = val.split(',').join('')
    setData({...data,to:value})  
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
          <Text style={styles.text}>
            Tell us what you are ideally looking for
          </Text>

          <Text style={{ fontSize: normalizeSize(16), marginVertical: normalizeSize(10) }}>No of added ideal jobs: <Text style={{ fontWeight: '600' }}>{jobData.jobs.length}</Text></Text>

          {jobData.jobs.length == 5 ? null :
            <>
              <DropDownPicker
                testID={'signUpDropGender'}
                open={open}
                value={jobGroupValue}
                items={jobGroup}
                zIndex={jobTypeOpen || workOpen || salaryOpen ? -9999 : 9999}
                maxHeight={Config().height / 3}
                setOpen={setOpen}
                disabled={jobTypeOpen || workOpen || salaryOpen ? true : false}
                itemKey={(item, index) => String(index)}
                setValue={setJobGroupValue}
                setItems={setJobGroup}
                listMode="FLATLIST"
                placeholder="Select job group*"
                listItemContainerStyle={{ marginVertical: 5 }}
                selectedItemLabelStyle={{ fontWeight: 'bold' }}
                dropDownContainerStyle={{
                  zIndex: open ? 9999 : -9999,
                  backgroundColor: Colors.White,
                  borderColor: Colors.Border,
                }}
                placeholderStyle={{ borderColor: Colors.Border }}
                style={styles.dpStyle}
                onChangeValue={value => {
                  setJobGroupValue(value);
                  console.log('value:', value);
                  setData({ ...data, jobGroupId: value });
                }}
                onSelectItem={item => {
                  console.log('item:', item);
                  setJobGroupId(item.item);
                  getJobType(item.item);
                }}
                onPress={open => setOpen(false)}
              />

              <DropDownPicker
                testID={'signUpDropGender'}
                open={jobTypeOpen}
                value={jobTypeValue}
                items={jobType}
                zIndex={open || workOpen || salaryOpen ? -9999 : 9999}
                maxHeight={Config().height / 3}
                setOpen={setJobTypeOpen}
                disabled={open || workOpen || salaryOpen ? true : false}
                itemKey={(item, index) => String(index)}
                setValue={setJobTypeValue}
                setItems={setJobType}
                listMode="FLATLIST"
                placeholder="Select job type*"
                listItemContainerStyle={{ marginVertical: 5 }}
                selectedItemLabelStyle={{ fontWeight: 'bold' }}
                dropDownContainerStyle={{
                  zIndex: jobTypeOpen ? 9999 : -9999,
                  backgroundColor: Colors.White,
                  borderColor: Colors.Border,
                }}
                placeholderStyle={{ borderColor: Colors.Border }}
                style={styles.dpStyle}
                onChangeValue={value => {
                  setData({ ...data, jobTypeId: value });
                  setJobTypeValue(value);
                }}
                onSelectItem={item => {
                  console.log('item:', item);
                  setJobTypeID(item.item);
                }}
                onPress={open => setJobTypeOpen(false)}
              />


              <TextInput
                style={styles.locationText}
                placeholder="Location*"
                placeholderTextColor="#7A7A7A"
                value={data.location}
                ref={locationInput}
                defaultValue={data.location}
                keyboardShouldPersistTaps
                clearButtonMode="always"
                onChangeText={value => setData({ ...data, location: value })}
              />

              <DropDownPicker
                testID={'signUpDropGender'}
                open={workOpen}
                value={value}
                items={workType}
                zIndex={open || jobTypeOpen || salaryOpen ? -9999 : 9999}
                maxHeight={Config().height / 3}
                setOpen={setWorkOpen}
                itemKey={(item, index) => String(index)}
                setValue={setValue}
                setItems={setWorkType}
                listMode="FLATLIST"
                placeholder="Select work type*"
                disabled={open || jobTypeOpen || salaryOpen ? true : false}
                listItemContainerStyle={{ marginVertical: 5 }}
                selectedItemLabelStyle={{ fontWeight: 'bold' }}
                dropDownContainerStyle={{
                  marginTop: 10,
                  zIndex: workOpen ? 9999 : -9999,
                  backgroundColor: Colors.White,
                  borderColor: Colors.Border,
                }}
                placeholderStyle={{ borderColor: Colors.Border }}
                style={styles.dpStyle}
                onChangeValue={value => {
                  setData({ ...data, workTypeData: value });
                }}
                onPress={open => setWorkOpen(false)}
              />

              <DropDownPicker
                testID={'signUpDropGender'}
                open={salaryOpen}
                value={salaryValue}
                items={salary}
                zIndex={open || jobTypeOpen || workOpen ? -9999 : 9999}
                maxHeight={Config().height / 3}
                setOpen={setSalaryOpen}
                itemKey={(item, index) => String(index)}
                setValue={setSalaryValue}
                setItems={setSalary}
                listMode="FLATLIST"
                placeholder="Select salary type*"
                listItemContainerStyle={{ marginVertical: 5 }}
                selectedItemLabelStyle={{ fontWeight: 'bold' }}
                dropDownContainerStyle={{
                  zIndex: salaryOpen ? 9999 : -9999,
                  backgroundColor: Colors.White,
                  borderColor: Colors.Border,
                }}
                disabled={open || jobTypeOpen || workOpen ? true : false}
                placeholderStyle={{ borderColor: Colors.Border }}
                style={styles.dpStyle}
                onChangeValue={value => {
                  setData({ ...data, salaryTypeData: value });
                }}
                onPress={open => setSalaryOpen(false)}
              />

              <View
                style={styles.salaryRange}>
                <Text style={{ fontSize: normalizeSize(16), color: Colors.halfBlack }}>Salary Range</Text>
                <View
                  style={{
                    width: Config().width - 40,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <TextInput
                    style={[styles.fromTextInput, { width: Config().width / 2.5 }]}
                    placeholder="From*"
                    ref={fromInput}
                    placeholderTextColor="#7A7A7A"
                    value={handleSalaryRate(data.minimumSalaryRange)}
                    // defaultValue={data.minimumSalaryRange}
                    keyboardType="number-pad"
                    keyboardShouldPersistTaps
                    clearButtonMode="always"
                    onChangeText={value => onChangeMinSalaryRate(value)}
                    onBlur={handleMinInputBlur}
                  />

                  <TextInput
                    style={[styles.toTextInput, { width: Config().width / 2.5 }]}
                    placeholder="To"
                    ref={toInput}
                    placeholderTextColor="#7A7A7A"
                    value={handleSalaryRate(data.to)}
                    // defaultValue={data.to}
                    keyboardType="number-pad"
                    keyboardShouldPersistTaps
                    clearButtonMode="always"
                    onChangeText={value => onChangeMaxSalaryRate(value)}
                    onBlur={handleMaxInputBlur}
                  />
                </View>
              </View>

              <View style={[styles.wrapper, { width: Config().width - 40 }]}>
                <TouchableOpacity onPress={() => validateFields()} style={styles.plusIcon}>
                  <Icon
                    name={'plus'}
                    type="entypo"
                    color={Colors.ThemeRed}
                    size={Config().height / 30}
                    iconStyle={{ marginHorizontal: MinMargin }}
                  />
                  <Text style={{ color: 'grey', marginTop: 10, fontSize: normalizeSize(14), }}>
                    {'Add another ideal Job (Optional)'}
                  </Text>
                </TouchableOpacity>
              </View>


              <View style={{ bottom: 20 }}>
                <BackNextBtn />
              </View>
            </>}
        </View>

      </ScrollView>
      {jobData.jobs.length == 5 ? <View style={styles.btnCont}>
        <BackNextBtn />
      </View> : null}
    </KeyboardAvoidingView>
  );
};



const styles = StyleSheet.create({
  touchCont: {
    flexDirection: 'row',
    zIndex: -9999,
    marginTop: 20,
    justifyContent: 'space-around',
  },
  btnCont: { position: 'absolute', left: 0, right: 0, bottom: 20 },
  dpStyle: {
    marginVertical: 10,
    borderColor: Colors.Border,
    width: Config().width - 40,
    height: normalizeSize(50)
  },
  salaryRange: {
    marginTop: 5,
    zIndex: -9999,
    // zIndex: workOpen || salaryOpen ? -9999 : 9999,
    width: Config().width - 40,
    paddingBottom: normalizeSize(10),
    marginBottom: normalizeSize(5),
    padding: normalizeSize(5),
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 1,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.salaryBG
  },
  halfBtn: {
    width: (screenWidth - 60) / 2.5,
    height: normalizeSize(50),
    backgroundColor: Colors.Trans,
    borderWidth: 1,
    borderColor: Colors.halfBlack,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  halfBtn2: {
    width: (screenWidth - 60) / 2.5,
    height: normalizeSize(50),
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
    fontSize: normalizeSize(16),
    marginTop: 30,
    fontWeight: '600',
  },
  passInput: {
    width: 350,
    height: 50,
    borderWidth: 2.0,
    borderColor: 'white',
    borderRadius: 30,
    fontSize: normalizeSize(16),
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
    fontSize: normalizeSize(16),
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
    fontSize: normalizeSize(16),
    fontWeight: '400',
  },
  loginBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  loginText: {
    color: '#D02530',
    fontSize: normalizeSize(16),
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
    // height: screenHeight,
    width: '100%',
  },
  // salaryRange: {
  //   marginTop: 5,
  //   zIndex: -9999,
  // },
  positionTextInput: {
    height: normalizeSize(50),
    borderWidth: 2.0,
    borderColor: 'white',
    fontSize: normalizeSize(16),
    backgroundColor: 'white',
    paddingHorizontal: 5,
    marginTop: 30,
  },
  locationText: {
    height: normalizeSize(50),
    borderWidth: 2.0,
    borderColor: 'white',
    fontSize: normalizeSize(16),
    borderRadius: 10,
    paddingLeft: 10,
    backgroundColor: 'white',
    paddingHorizontal: 5,
    marginTop: 15,
    zIndex: -9999,
    color: Colors.Black,
  },
  fromTextInput: {
    height: normalizeSize(50),
    borderWidth: 2.0,
    borderColor: 'white',
    fontSize: normalizeSize(16),
    backgroundColor: 'white',
    paddingHorizontal: 10,
    marginTop: 15,
    borderRadius: 10,
    paddingLeft: 10,
    color: Colors.Black,
  },
  toTextInput: {
    height: normalizeSize(50),
    borderWidth: 2.0,
    borderColor: 'white',
    fontSize: normalizeSize(16),
    backgroundColor: 'white',
    paddingHorizontal: 10,
    marginTop: 15,
    borderRadius: 10,
    paddingLeft: 10,
    color: Colors.Black,
  },
  wrapper: {
    marginVertical: 15,
    zIndex: -9999,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  plusIcon: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  text: {
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: normalizeSize(18),
    marginTop: 20,
    marginBottom: 10,
    fontWeight: '600',
  },
  text1: {
    alignSelf: 'center',
    fontSize: 20,
    marginTop: 10,
  },
  view4: {
    alignItems: 'center',
    marginTop: 70,
  },
});


export default SignUpIdealJob;