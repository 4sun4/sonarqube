import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  Platform,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {useState} from 'react';
import {connect} from 'react-redux';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import DateTimePickerComp from '../Components/DateTimePickerComp';
import Types from '../redux/Types';
import {ordinal_suffix_of, startOfWeek} from '../Util/CommonFun';
import {showMessage, hideMessage} from 'react-native-flash-message';
import Colors from '../Util/Colors';
import Dropdown from '../Components/SelectPicker';
import {callGetBodyApis, callGetRestApis} from '../Services/Api';
import Config from '../Util/Config';
import Loader from '../Components/Loader';
import {LogBox} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import {Icon} from 'react-native-elements';

import _ from 'lodash';
import {store} from '../redux/Store';
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);
const screenwidth = Dimensions.get('window').width;
const screenheight = Dimensions.get('window').height;
let LoginData = '';
let copyCount = 0;
let DropDownStatelessData = [];
const AddTimesheet2 = props => {
  const SelectedTimeSheet = useSelector(S => {
    let D = '';
    if (S && S.TimeSheetStore) {
      D = S.TimeSheetStore.SelectedTimeSheet;
      if (D) {
      }
    }
    return D;
  });
  const AllStoreTimeSheets = useSelector(S => {
    let D = '';
    if (S && S.TimeSheetStore) {
      D = S.TimeSheetStore.AllTimeSheet;
      if (D) {
      }
    }
    return D;
  });
  const [data, setData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    iconAnimating: false,
    isPasswordShow: true,
  });
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [WeekEnd, setWeekEnd] = useState('2021-08-18');
  const [Bool, setBool] = useState(false);
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
  const [loading, setLoading] = useState(false);
  const [ShiftData, setShiftData] = useState([]);
  const dispatch = useDispatch();
  const [SelectedTypeValue, setSelectedTypeValue] = useState(1);
  const [DropDownTypeData, setDropDownTypeData] = useState([]);
  const [SelectedType, setSelectedType] = useState([]);
  const [toolTipVisible, setToolTipVisible] = useState(false);
  const [getSubmitedTimeSheet, setGetSubmitedTimeSheet] = useState(null);
  const [SavedFlag, setSavedFlag] = useState(false);
  const [allClockInData, setAllClockInData] = useState([]);

  const [BackCount, setBackCount] = useState(0);

  const {
    route: {
      params: {timeSheetData, Ind, OrderDate, isThisWeek},
    },
  } = props;

  const getDaysBetweenDates = function (startDate, endDate) {
    let typeVal = DropDownStatelessData.length ? DropDownStatelessData[0] : '';
    var now = startDate.clone(),
      dates = [];
    while (now.isSameOrBefore(endDate)) {
      dates.push({
        date: now.format('YYYY-MM-DD'),
        dayname: moment(now).format('dddd'),
        shifts: [
          {
            shift_notes: '',
            shift_type_ind: 0,
            shift_type: typeVal,
            shift_type_id: SelectedTypeValue,
            shift_status_id: SelectedTypeValue,
            start: null,
            finish: null,
            startdateStatus: false,
            finishdateStatus: false,
            breaks: [
              {
                start: null,
                finish: null,
                startdateStatus: false,
                finishdateStatus: false,
              },
            ],
          },
        ],
      });
      now.add(1, 'days');
    }
    return dates;
  };

  const getTimesheets = async orderId => {
    let URL = Config().GetTimesheets;
    console.log('URL', URL);
    setLoading(true);
    let data = {order_id: orderId ? orderId : 0};
    callGetBodyApis(URL, data)
      .then(async res => {
        if (res) {
          setLoading(false);
          let obj = {};
          res.map((item, index) => {
            obj[item.week_ending] = {start: item.start, finish: item.finish};
          });
          let end = moment(
            timeSheetData && timeSheetData.date,
            'DD/MM/YYYY',
          ).format('YYYY-MM-DD');
          setGetSubmitedTimeSheet(obj[end]);
          console.log('objobj', obj[end]);
          handleEffectFun(obj[end]);
        }
        console.log('getTimesheets res :- ', res);
      })
      .catch(error => {
        setLoading(false);
        console.log('getTimesheets error :- ', error);
        showMessage({message: 'Error', description: error, type: 'warning'});
      });
  };

  useEffect(async () => {
    const {
      route: {params},
    } = props;
    setSavedFlag(params && params.SavedFlag);

    copyCount = 0;
    DropDownStatelessData = [];
    await getShiftTypeList();
    if (SelectedTimeSheet) {
      const {order_id} = SelectedTimeSheet;
      getTimesheets(order_id);
      // getClockIns(order_id)
    }
  }, []);

  console.log('ShiftData', ShiftData);

  const handleEffectFun = async getSubmitData => {
    if (timeSheetData) {
      let today = moment();
      let week_ending = timeSheetData.date ? timeSheetData.date : '';
      let end = moment(week_ending, 'DD/MM/YYYY').format('YYYY-MM-DD');
      let isWeekendGreater = moment(end) > today;
      let weekendDate = isWeekendGreater ? moment() : moment(end);
      // let weekendDate = moment('2021-09-11').subtract(1, 'days')

      let start = startOfWeek(new Date(weekendDate));
      let startDate = moment(start).format('YYYY-MM-DD');
      let orderStart = moment(OrderDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
      const weekStart = isThisWeek ? moment(orderStart) : moment(startDate);

      let dateList = getDaysBetweenDates(weekStart, weekendDate);

      console.log('dateListdateList', dateList);
      if (getSubmitData) {
        var startDate1 = new Date(getSubmitData.start);
        var endDate1 = new Date(getSubmitData.finish);
        let resultData = [];
        dateList.filter(function (a) {
          let date = new Date(a.date);
          if (date < startDate1 || date > endDate1) {
            resultData.push(a);
          }
        });
        console.log('resultData', resultData);
        setWeekEnd(end);
        CheckSaveSheet(resultData, end);
      } else {
        setWeekEnd(end);
        CheckSaveSheet(dateList, end);
      }
    }
  };

  const CheckSaveSheet = async (resArr, end) => {
    if (AllStoreTimeSheets && AllStoreTimeSheets.length) {
      setLoading(true);
      const {order_id} = SelectedTimeSheet;
      let Arr = [];
      const date = moment(end, 'YYYY-MM-DD').format('DD');
      AllStoreTimeSheets.map((item, index) => {
        if (item.order_id == order_id) {
          item.savedTimeSheet.length &&
            item.savedTimeSheet.map(it => {
              const storeDate = moment(it.date, 'DD/MM/YYYY').format('DD');
              if (storeDate == date) {
                Arr = [...it.shiftArr];
              }
            });
        }
      });

      if (Arr.length) {
        let res = resArr.map((val, ind) => {
          const resDate = moment(val.date, 'YYYY-MM-DD').format('DD');
          Arr.filter((it, ind) => {
            const saveDate = moment(it.date, 'YYYY-MM-DD').format('DD');
            if (resDate == saveDate) {
              val = it;
            }
          });
          return val;
        });
        setShiftData(res);
      } else {
        setShiftData(resArr);
      }
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const handleAddMoreShift = (shiftItem, shiftInd, Item, Ind) => {
    let typeVal = DropDownTypeData.length ? DropDownTypeData[0] : '';
    let addShiftStatus = true,
      addShiftInd = 0;
    Item.shifts.forEach((it, ind) => {
      if (!it.start && !it.finish && addShiftStatus) {
        addShiftStatus = false;
        addShiftInd = ind;
      }
    });
    if (addShiftStatus) {
      if (Item.shifts.length < 10) {
        Item.shifts.push({
          shift_notes: '',
          shift_type_id: SelectedTypeValue,
          shift_type_ind: 0,
          shift_type: typeVal,
          shift_status_id: SelectedTypeValue,
          start: null,
          startdateStatus: false,
          finishdateStatus: false,
          finish: null,
          breaks: [
            {
              start: null,
              finish: null,
              startdateStatus: false,
              finishdateStatus: false,
            },
          ],
        });
        setBool(!Bool);
      } else {
        alert('You can not add more than ten shift');
      }
    } else {
      alert(
        `please add details of ${ordinal_suffix_of(
          addShiftInd + 1,
        )} sheet first`,
      );
    }
  };

  const handleAddMoreBreak = (shiftItem, shiftInd) => {
    if (shiftItem.breaks[0].start && shiftItem.breaks[0].finish) {
      if (shiftItem.breaks.length < 2) {
        shiftItem.breaks.push({start: null, finish: null});
        setBool(!Bool);
      } else {
        alert('You can not add more than two break');
      }
    } else {
      alert(`please add details of 1st break first`);
    }
  };
  const handleBackPressDrop = (Item, type) => {
    Item.startdateStatus = false;
    setBool(!Bool);
  };

  const onChange = (event, selectedDate, Item, Ind, type) => {
    if (Platform.OS == 'ios') {
      if (type == 'startshift') {
        Item.startdateStatus = false;
        const currentDate = selectedDate || new Date();
        Item.start = currentDate;
        console.log('startdateStatus', currentDate);
      } else if (type == 'finishshift') {
        Item.finishdateStatus = false;
        const currentDate = selectedDate || new Date();
        Item.finish = currentDate;
        console.log('finishdateStatus', currentDate);
      }
    } else {
      if (event.type == 'set') {
        console.log('ItemItem', Item);
        if (type == 'startshift') {
          Item.startdateStatus = false;
          const currentDate = selectedDate || new Date();
          Item.start = currentDate;

          console.log('startdateStatus', currentDate);
        } else if (type == 'finishshift') {
          Item.finishdateStatus = false;
          const currentDate = selectedDate || new Date();
          Item.finish = currentDate;
          console.log('finishdateStatus', currentDate);
        }
      } else {
        Item.startdateStatus = false;
        Item.finishdateStatus = false;
      }
    }
    setBool(!Bool);
  };

  const hideDatePicker = (Item, type) => {
    if (type == 'startshift') {
      Item.startdateStatus = false;
    } else {
      Item.finishdateStatus = false;
    }
    setBool(!Bool);
  };

  const handleConfirm = (date, Item, Ind, type) => {
    if (type == 'startshift') {
      Item.startdateStatus = false;
      const currentDate = date || new Date();
      Item.start = currentDate;
    } else if (type == 'finishshift') {
      Item.finishdateStatus = false;
      const currentDate = date || new Date();
      Item.finish = currentDate;
    }
    setBool(!Bool);
  };

  const handleTimeShow = (Item, index, type) => {
    if (type == 'startshift') {
      Item.startdateStatus = !Item.startdateStatus;
    } else if (type == 'finishshift') {
      Item.finishdateStatus = !Item.finishdateStatus;
    }
    setBool(!Bool);
  };

  const getShiftTypeList = async () => {
    if (LoginData && LoginData.token) {
      let URL = Config().getShiftTypeList;
      setLoading(true);
      callGetRestApis(URL)
        .then(async res => {
          setLoading(false);
          if (res && res.length > 0) {
            setSelectedType(res);
            setSelectedTypeValue(res[0].timesheet_shift_type_id);
            let arr = res.map(item => (item.value ? `${item.value}` : ''));
            DropDownStatelessData = arr;
            setDropDownTypeData(arr);
          }
          console.log('getShiftTypeList res :- ', res);
        })
        .catch(error => {
          setLoading(false);
          console.log('getFileTypes error :- ', error);
          showMessage({message: 'Error', description: error, type: 'warning'});
        });
    } else {
    }
  };

  const handlePreviewButton = () => {
    let brkstatus = true,
      brkday = '',
      brkSelInd = 0;
    let ValidArr = [],
      shift_type_status = true;
    for (let i = 0; i < ShiftData.length; i++) {
      const el = ShiftData[i];
      let arr = el.shifts.map((item, ind) => {
        item.breaks.map((it, brkind) => {
          if (it.start && !it.finish && brkstatus) {
            brkstatus = false;
            brkday = el.dayname;
            brkSelInd = brkind;
          }
        });

        if (item.start && item.finish) {
          return true;
        } else {
          return false;
        }
      });
      ValidArr.push(...arr);
    }
    let status = ValidArr.some(el => el);
    if (!status) {
      alert(`Please enter atleast one shift start and end time`);
    } else if (!brkstatus) {
      alert(
        `Please enter ${ordinal_suffix_of(brkSelInd + 1)} break on ${brkday}`,
      );
    } else {
      handlePreviewValidation();
    }
  };

  const handlePreviewValidation = () => {
    var format = 'hh:mm a';
    let shiftStatus = true,
      brkStatus = true,
      shift_type_status = true;
    for (let i = 0; i < ShiftData.length; i++) {
      const el = ShiftData[i];
      el.shifts.map((item, ind) => {
        if (item.start && item.finish) {
          let beforeTime = moment(item.start, format);
          let afterTime = moment(item.finish, format);

          let start_x = moment(item.start);
          let end_x = moment(item.finish);

          let check_eq = start_x.isSame(end_x);

          if (!item.shift_type && shift_type_status) {
            shift_type_status = false;
            alert('Please select shift type.');
          }
          if (new Date(item.start) > new Date(item.finish) && shiftStatus) {
            shiftStatus = false;
            alert(
              `End shift time should be greater than start in shift ${ordinal_suffix_of(
                ind + 1,
              )} on ${el.dayname}`,
            );
          } else if (check_eq && shiftStatus) {
            shiftStatus = false;
            alert(
              `Both shift time should be different in shift ${ordinal_suffix_of(
                ind + 1,
              )} on ${el.dayname}`,
            );
          } else if (
            (el.shifts.filter((val, i) =>
              moment(val.start, format).isBetween(beforeTime, afterTime),
            ).length ||
              el.shifts.filter((val, i) =>
                moment(val.finish, format).isBetween(beforeTime, afterTime),
              ).length) &&
            shiftStatus
          ) {
            shiftStatus = false;
            alert(
              `This time is already selected or the time you have selected is in b/w another shift on ${el.dayname}`,
            );
          }
        }

        item.breaks.map((it, brkind) => {
          if (it.start && it.finish) {
            let time = moment(it.start, format);
            let end = moment(it.finish, format);
            let beforeTime = moment(item.start, format);
            let afterTime = moment(item.finish, format);

            console.log('ind', ind, brkStatus, 'it', it, 'timetime');
            if (new Date(it.start) > new Date(it.finish) && brkStatus) {
              brkStatus = false;
              alert(
                `End break time should be greater than start in shift ${ordinal_suffix_of(
                  ind + 1,
                )} on ${el.dayname}`,
              );
            } else if (
              moment(it.start).format('hh:mm') ==
                moment(it.finish).format('hh:mm') &&
              brkStatus
            ) {
              brkStatus = false;
              alert(
                `Both break time should be different in shift ${ordinal_suffix_of(
                  ind + 1,
                )} on ${el.dayname}`,
              );
            } else if (
              (!time.isBetween(beforeTime, afterTime) ||
                !end.isBetween(beforeTime, afterTime)) &&
              brkStatus
            ) {
              brkStatus = false;
              alert(
                `Start and End break time should be in b/w shift time in shift ${ordinal_suffix_of(
                  ind + 1,
                )} on ${el.dayname}`,
              );
            }
          }
        });
      });
    }
    if (shiftStatus && brkStatus && shift_type_status) {
      handlePreview();
    }
  };

  const handlePreview = async () => {
    console.log('ShiftData', ShiftData);
    let obj = {};
    for (let i = 0; i < ShiftData.length; i++) {
      const el = ShiftData[i];
      let Arr = [];
      el.shifts.forEach(item => {
        if (item.start && item.finish) {
          let shift_start = new Date(item.start);
          let shift_finish = new Date(item.finish);

          let brk =
            item.breaks.length && item.breaks[0].start
              ? item.breaks.map(it => {
                  let break_start = new Date(it.start);
                  let break_finish = new Date(it.finish);

                  return {
                    start: break_start
                      ? moment(break_start, 'hh:mm A').format(
                          'YYYY-MM-DD HH:mm:ss',
                        )
                      : '',
                    finish: break_finish
                      ? moment(break_finish, 'hh:mm A').format(
                          'YYYY-MM-DD HH:mm:ss',
                        )
                      : '',
                  };
                })
              : [];
          console.log('item.start', shift_start);
          Arr.push({
            shift_notes: item.shift_notes,
            start: shift_start
              ? moment(shift_start, 'hh:mm A').format('YYYY-MM-DD HH:mm:ss')
              : '',
            finish: shift_finish
              ? moment(shift_finish, 'hh:mm A').format('YYYY-MM-DD HH:mm:ss')
              : '',
            breaks: brk,
            shift_type_id: item.shift_type_id,
            shift_status_id: item.shift_status_id,
          });
        }
      });

      console.log('ArrArr', Arr);
      if (Arr.length) {
        obj[el.date] = {shifts: Arr};
      }
    }
    console.log(obj);
    let data = {
      api: obj,
      shiftArr: ShiftData,
      WeekEnd: WeekEnd,
      SelectedTimeSheet: SelectedTimeSheet,
    };
    dispatch({type: Types.ADD_TIME_SHEET, data: data});
    if (AllStoreTimeSheets && AllStoreTimeSheets.length) {
      const {order_id} = SelectedTimeSheet;
      let sheetArr = [];
      const date = moment(WeekEnd, 'YYYY-MM-DD').format('DD');

      let alldata = AllStoreTimeSheets.map((item, index) => {
        if (item.order_id == order_id) {
          let status = false;
          item.savedTimeSheet.length
            ? item.savedTimeSheet.filter(it => {
                const storeDate = moment(it.date, 'DD/MM/YYYY').format('DD');
                if (storeDate == date) {
                  status = true;
                }
              })
            : [];
          if (status) {
            return {
              ...item,
              savedTimeSheet: [
                {
                  date: moment(WeekEnd, 'YYYY-MM-DD').format('DD/MM/YYYY'),
                  shiftArr: ShiftData,
                  api: obj,
                },
              ],
            };
          } else {
            return {
              ...item,
              savedTimeSheet: [
                ...item.savedTimeSheet,
                {
                  date: moment(WeekEnd, 'YYYY-MM-DD').format('DD/MM/YYYY'),
                  shiftArr: ShiftData,
                  api: obj,
                },
              ],
            };
          }
        }
        return item;
      });

      console.log('alldata', alldata);
      dispatch({type: Types.ALL_TIME_SHEET, data: alldata});
    }
    props.navigation.navigate('TimesheetPreview');
  };

  const getShiftTypendex = val => {
    if (DropDownTypeData) {
      return DropDownTypeData.map(i => i).indexOf(val);
    }
    return 0;
  };

  const ShiftDetail = (shiftItem, shiftInd, Item, Ind) => {
    console.log(
      'shiftItem.start',
      shiftItem.start,
      'shiftItem',
      shiftItem.start,
    );
    let start_date = moment(Item.date).format('ddd MMM DD YYYY');
    let checkEdit = shiftItem.hasOwnProperty('editable');
    return (
      <View
        key={shiftInd + 1}
        style={{
          justifyContent: 'space-between',
          flex: 1,
          padding: 25,
          backgroundColor: '#fff',
        }}>
        <DateTimePickerComp
          MinDate={new Date(Item.date)}
          isDatePickerVisible={shiftItem.startdateStatus}
          handleConfirm={date =>
            handleConfirm(date, shiftItem, shiftInd, 'startshift')
          }
          hideDatePicker={() => hideDatePicker(shiftItem, 'startshift')}
          mode={'time'}
          // DateVal={
          //   new Date(
          //     shiftItem.start ? shiftItem.start : `${start_date} 08:00:00`,
          //   )
          // }
        />

        <DateTimePickerComp
          MinDate={new Date(Item.date)}
          isDatePickerVisible={shiftItem.finishdateStatus}
          handleConfirm={date =>
            handleConfirm(date, shiftItem, shiftInd, 'finishshift')
          }
          hideDatePicker={() => hideDatePicker(shiftItem, 'finishshift')}
          mode={'time'}
          // DateVal={
          //   new Date(
          //     shiftItem.finish ? shiftItem.finish : `${start_date} 17:00:00`,
          //   )
          // }
        />

        <Text style={{fontSize: 14}}>Shift</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flex: 1,
          }}>
          <View style={{flex: 1}}>
            <Dropdown
              defaultButtonText={'Select Value'}
              statusBarTranslucent={true}
              defaultSelection={true}
              selectedItemIndex={getShiftTypendex(shiftItem.shift_type)}
              dropdownButton={{
                borderColor: '#D8D8D8',
                backgroundColor: Colors.White,
                borderWidth: 0,
                borderBottomWidth: 1,
                alignSelf: 'center',
              }}
              dropdownTextStyle={{color: Colors.Black, fontSize: 18}}
              dropdownData={DropDownTypeData}
              selectedDropdownItem={(item, index) => {
                // console.log('---item--', item, index);
                let {timesheet_shift_type_id, value} =
                  SelectedType && SelectedType.length
                    ? SelectedType[index]
                    : {};
                shiftItem.shift_type_id = timesheet_shift_type_id
                  ? timesheet_shift_type_id
                  : 1;
                shiftItem.shift_status_id = timesheet_shift_type_id
                  ? timesheet_shift_type_id
                  : 1;
                shiftItem.shift_type = value ? value : '';
                shiftItem.shift_type_ind = index;
              }}
            />
          </View>
          {shiftInd == 0 ? (
            <TouchableOpacity
              onPress={() =>
                handleAddMoreShift(shiftItem, shiftInd, Item, Ind)
              }>
              <Image
                style={{width: 15, height: 15}}
                resizeMode={'contain'}
                source={require('../Assets/Icons/HeaderAdd.png')}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 10,
            justifyContent: 'space-between',
            flex: 1,
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              disabled={checkEdit && shiftItem.start ? true : false}
              onPress={() => handleTimeShow(shiftItem, shiftInd, 'startshift')}
              style={{
                borderBottomWidth: 1,
                height: 40,
                flex: 1,
                borderColor: '#D8D8D8',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: shiftItem.start ? 'black' : '#DCDCDC',
                  marginTop: 5,
                }}>
                {shiftItem.start
                  ? moment(shiftItem.start).format('hh:mm A')
                  : 'Shift Starts'}
              </Text>
            </TouchableOpacity>
            <View style={{marginHorizontal: 15}}></View>
            <TouchableOpacity
              disabled={checkEdit && shiftItem.finish ? true : false}
              onPress={() => handleTimeShow(shiftItem, shiftInd, 'finishshift')}
              style={{
                borderBottomWidth: 1,
                height: 40,
                flex: 1,
                borderColor: '#D8D8D8',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: shiftItem.finish ? 'black' : '#DCDCDC',
                  marginTop: 5,
                }}>
                {shiftItem.finish
                  ? moment(shiftItem.finish).format('hh:mm A')
                  : 'Shift Ends'}
              </Text>
            </TouchableOpacity>
          </View>
          <View></View>
        </View>
        <View style={{paddingVertical: 10}}>
          <Text style={{fontSize: 14}}>Break</Text>
        </View>
        {shiftItem.breaks.length
          ? shiftItem.breaks.map((breakItem, breakInd) => {
              return (
                <View
                  key={breakInd}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flex: 1,
                    alignItems: 'center',
                    marginTop: 20,
                  }}>
                  <DateTimePickerComp
                    MinDate={new Date(Item.date)}
                    isDatePickerVisible={breakItem.startdateStatus}
                    handleConfirm={date =>
                      handleConfirm(date, breakItem, breakInd, 'startshift')
                    }
                    hideDatePicker={() =>
                      hideDatePicker(breakItem, 'startshift')
                    }
                    mode={'time'}
                    // DateVal={
                    //   new Date(breakItem.start ? breakItem.start : Item.date)
                    // }
                  />
                  <DateTimePickerComp
                    MinDate={new Date(Item.date)}
                    isDatePickerVisible={breakItem.finishdateStatus}
                    handleConfirm={date =>
                      handleConfirm(date, breakItem, breakInd, 'finishshift')
                    }
                    hideDatePicker={() =>
                      hideDatePicker(breakItem, 'finishshift')
                    }
                    mode={'time'}
                    // DateVal={
                    //   new Date(breakItem.finish ? breakItem.finish : Item.date)
                    // }
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      disabled={checkEdit && breakItem.start ? true : false}
                      onPress={() =>
                        handleTimeShow(breakItem, breakInd, 'startshift')
                      }
                      style={{
                        borderBottomWidth: 1,
                        height: 40,
                        flex: 1,
                        borderColor: '#D8D8D8',
                      }}>
                      <Text
                        style={{
                          fontSize: 18,
                          color: breakItem.start ? 'black' : '#DCDCDC',
                          marginTop: 5,
                        }}>
                        {breakItem.start
                          ? moment(breakItem.start).format('hh:mm A')
                          : 'Break Starts'}
                      </Text>
                    </TouchableOpacity>
                    <View style={{marginHorizontal: 15}}></View>
                    <TouchableOpacity
                      disabled={checkEdit && breakItem.finish ? true : false}
                      onPress={() =>
                        handleTimeShow(breakItem, breakInd, 'finishshift')
                      }
                      style={{
                        borderBottomWidth: 1,
                        height: 40,
                        flex: 1,
                        borderColor: '#D8D8D8',
                      }}>
                      <Text
                        style={{
                          fontSize: 18,
                          color: breakItem.finish ? 'black' : '#DCDCDC',
                          marginTop: 5,
                        }}>
                        {breakItem.finish
                          ? moment(breakItem.finish).format('hh:mm A')
                          : 'Break Ends'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {breakInd == 0 ? (
                    <TouchableOpacity
                      onPress={() => handleAddMoreBreak(shiftItem, shiftInd)}>
                      <Image
                        style={{width: 15, height: 15}}
                        resizeMode={'contain'}
                        source={require('../Assets/Icons/HeaderAdd.png')}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              );
            })
          : null}

        <View style={{paddingVertical: 10}}>
          <TextInput
            style={{
              borderBottomWidth: 1,
              width: '100%',
              borderColor: '#D8D8D8',
              fontSize: 18,
              color: Colors.Black,
            }}
            value={shiftItem.shift_notes}
            editable={shiftItem.shift_notes ? false : true}
            placeholder="Comments"
            placeholderTextColor="#DCDCDC"
            keyboardShouldPersistTaps
            onChangeText={value => {
              shiftItem.shift_notes = value;
              setData({...data, username: value});
            }}
          />
        </View>
      </View>
    );
  };

  const handleClickClear = () => {
    let typeVal = DropDownStatelessData.length ? DropDownStatelessData[0] : '';
    const shifts12 = [
      {
        shift_notes: '',
        shift_type_ind: 0,
        shift_type: typeVal,
        shift_type_id: SelectedTypeValue,
        shift_status_id: SelectedTypeValue,
        start: null,
        finish: null,
        startdateStatus: false,
        finishdateStatus: false,
        breaks: [
          {
            start: null,
            finish: null,
            startdateStatus: false,
            finishdateStatus: false,
          },
        ],
      },
    ];
    const cloned_arr = _.cloneDeep(ShiftData);
    const shiftArr = cloned_arr.map((item, index) => {
      console.log('itemitem', item);
      return {...item, shifts: _.cloneDeep(shifts12)};
    });
    setShiftData(shiftArr);
    copyCount = 0;
  };

  const genericCopyFun = copyTill => {
    const cloned_arr = _.cloneDeep(ShiftData);
    const shiftArr = cloned_arr.map((item, index) => {
      const date = moment(item.date).format('ddd MMM DD YYYY');
      const shift_arr = ShiftData[0].shifts.map(it => {
        const Start = it.start ? moment(it.start).format('hh:mm:ss a') : '';
        const Finish = it.finish ? moment(it.finish).format('hh:mm:ss a') : '';
        let Start_Date = Start ? new Date(`${date} ${Start}`) : '';
        let Finish_Date = Finish ? new Date(`${date} ${Finish}`) : '';

        const break_arr = it.breaks.map(break_it => {
          const break_start = break_it.start
            ? moment(break_it.start).format('hh:mm:ss a')
            : '';
          const break_Finish = break_it.finish
            ? moment(break_it.finish).format('hh:mm:ss a')
            : '';
          let break_start_Date = break_start
            ? new Date(`${date} ${break_start}`)
            : '';
          let break_finish_Date = break_Finish
            ? new Date(`${date} ${break_Finish}`)
            : '';
          return {
            ...break_it,
            start: break_start_Date,
            finish: break_finish_Date,
          };
        });

        return {
          ...it,
          start: Start_Date,
          finish: Finish_Date,
          breaks: break_arr,
        };
      });
      const newArry = _.cloneDeep(shift_arr);

      if (copyTill) {
        if (index <= copyTill) {
          return {...item, shifts: newArry};
        }
      } else {
        return {...item, shifts: newArry};
      }

      return item;
    });
    setShiftData(shiftArr);
  };

  const handleClickCopy = () => {
    copyCount = copyCount + 1;
    setBackCount(copyCount);
    console.log('copyCount', copyCount);
    if (copyCount == 1) {
      genericCopyFun(4);
    }
    if (copyCount == 2) {
      genericCopyFun();
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {loading ? <Loader /> : null}
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView>
            <View style={{width: '100%', paddingVertical: 20}}>
              <Text style={{fontSize: 14}}>Company</Text>
              <View>
                <TextInput
                  style={{
                    borderBottomWidth: 1,
                    height: 40,
                    borderColor: '#D8D8D8',
                    fontSize: 18,
                    backgroundColor: '#F6F6F6',
                    color: 'black',
                  }}
                  value={
                    SelectedTimeSheet && SelectedTimeSheet.client_name
                      ? SelectedTimeSheet.client_name
                      : ''
                  }
                  keyboardShouldPersistTaps
                  editable={false}
                  onChangeText={value => setData({...data, username: value})}
                />
              </View>
              <View style={{paddingVertical: 20}}>
                <Text style={{fontSize: 16}}>
                  Week Ending: {moment(WeekEnd).format('dddd, Do MMMM')}
                </Text>
              </View>
              {ShiftData.length > 1 &&
              ShiftData[0].shifts[0].start &&
              ShiftData[0].shifts[0].finish ? (
                <View
                  style={{
                    paddingVertical: 10,
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity onPress={() => handleClickCopy()}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: Colors.ThemeRed,
                          textDecorationLine: 'underline',
                          marginRight: 8,
                        }}>
                        Copyall
                      </Text>
                    </TouchableOpacity>
                    <Tooltip
                      arrowSize={{width: 16, height: 8}}
                      backgroundColor="rgba(0,0,0,0.5)"
                      isVisible={toolTipVisible}
                      content={
                        <View style={{}}>
                          <Text>
                            Click once,it copies the 1st day to the 5th day.
                          </Text>
                          <Text>
                            Click twice,it copies the 1st day to the 7th day.
                          </Text>
                        </View>
                      }
                      placement="bottom"
                      onClose={() => setToolTipVisible(false)}>
                      <Icon
                        name="tooltip"
                        size={15}
                        type="material-community"
                        iconStyle={{alignSelf: 'center', marginTop: 3}}
                        onPress={() => setToolTipVisible(true)}
                      />
                    </Tooltip>
                  </View>
                  {ShiftData.length > 1 &&
                  ShiftData[0].shifts[0].start &&
                  ShiftData[0].shifts[0].finish ? (
                    <TouchableOpacity onPress={() => handleClickClear()}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontSize: 15,
                          color: Colors.ThemeRed,
                          textDecorationLine: 'underline',
                        }}>
                        Clearall
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              ) : null}

              <View style={{borderRadius: 10}}>
                {ShiftData.length
                  ? ShiftData.map((item, index) => {
                      return (
                        <View key={index} style={{marginVertical: 10}}>
                          <View
                            style={{
                              justifyContent: 'space-between',
                              flex: 1,
                              paddingVertical: 20,
                              paddingHorizontal: 20,
                              backgroundColor: '#FFF',
                            }}>
                            <TouchableOpacity
                              activeOpacity={1}
                              onPress={() =>
                                setSelectedIndex(
                                  index == selectedIndex ? null : index,
                                )
                              }>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  flex: 1,
                                }}>
                                <View>
                                  <Text
                                    style={{
                                      color: '#000',
                                      fontSize: 18,
                                      fontWeight: '600',
                                    }}>
                                    {item.dayname}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}>
                                  <Image
                                    style={{width: 15, height: 15}}
                                    resizeMode={'contain'}
                                    source={
                                      index === selectedIndex
                                        ? require('../Assets/Icons/AccordionUp.png')
                                        : require('../Assets/Icons/AccordionDown.png')
                                    }
                                  />
                                </View>
                              </View>
                            </TouchableOpacity>
                          </View>
                          {index === selectedIndex
                            ? item.shifts.map((shiftItem, shiftInd) => {
                                return ShiftDetail(
                                  shiftItem,
                                  shiftInd,
                                  item,
                                  index,
                                );
                                // <ShiftDetail shiftItem={shiftItem} shiftInd={shiftInd} Item={item} Ind={index} />
                              })
                            : null}
                        </View>
                      );
                    })
                  : null}
                <View style={{paddingVertical: 10}}>
                  <Text style={{fontSize: 14}}>Code</Text>
                  <TextInput
                    style={{
                      borderBottomWidth: 1,
                      height: 40,
                      width: '100%',
                      borderColor: '#D8D8D8',
                      fontSize: 18,
                      color: Colors.Black,
                    }}
                    textValue={data.username}
                    placeholder="* optional"
                    placeholderTextColor="#DCDCDC"
                    keyboardShouldPersistTaps
                    onChangeText={value => setData({...data, username: value})}
                  />
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        <View
          style={{
            justifyContent: 'flex-end',
            marginBottom: 20,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => handlePreviewButton()}
            style={{
              width: screenwidth - 40,
              height: 60,
              backgroundColor: '#D02530',
              marginTop: 30,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 30,
            }}>
            <Text style={{color: 'white', fontSize: 20, fontWeight: '600'}}>
              PREVIEW
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  FilterPickerStyle: {width: screenwidth / 3, alignSelf: 'center'},
  DateOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: screenheight / 100,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F6F6F6',
  },
  buttonTextStyle: {
    color: 'black',
    textAlign: 'center',
  },
});

export default AddTimesheet2;
