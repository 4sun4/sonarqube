import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  SafeAreaView,
  Linking,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { Icon } from 'react-native-elements';
import moment from 'moment';
import CalendarStrip from 'react-native-calendar-strip';
import { getTimesheetTypeBg, normalizeSize, updateNotificationBadge } from '../Util/CommonFun';
import _ from 'lodash';
import DayComponent from './DayComponent';
import { callGetRestApis } from '../Services/Api';
import Config from '../Util/Config';
import Loader from '../Components/Loader';
import { useFocusEffect } from '@react-navigation/native';
import { showLocation } from "react-native-map-link";
import { showMessage } from 'react-native-flash-message';
import * as RootNavigation from "../Navigation/RootNavigation";
import { getBadgeCountApi } from '../Services/Queries';

const Roaster = (props) => {
  const { route } = props
  const EVENT_TYPE = {
    MONTH: 'MONTH',
    WEEK: 'WEEK',
    DAY: 'DAY',
  };

  const [selectedEventType, setSelectedEventType] = useState(EVENT_TYPE.DAY);
  const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));
  const [weekdate, setWeekDate] = useState(moment().format('MMMM, YYYY'));
  const [JobData, setJobData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);

  const weekRef = useRef();

  useEffect(()=> {
     if(route?.params?.notification) {
        getWorkHistory();
     }
  }, [route?.params])

  useFocusEffect(
    useCallback(() => {
      getWorkHistory();

      return () => {
        setSelectedEventType(EVENT_TYPE.DAY)
        setCurrentDate(moment(new Date()).format('YYYY-MM-DD'))
        setJobData([])
        setAllData([])
      };
    }, [])
  );


  const sortJobData = (data) => {

    return data.sort((a, b) => {
      // Combine start_date and start_time to create a comparable DateTime string
      const dateTimeA = `${a.start_date}T${a.start_time}`;
      const dateTimeB = `${b.start_date}T${b.start_time}`;
      // Convert the DateTime strings to Date objects and compare them
      return new Date(dateTimeA) - new Date(dateTimeB);
    })
  }

  const getWorkHistory = async () => {
    setLoading(true);
    let URL = Config().getRoster;
    console.log('URL', URL);
    await callGetRestApis(URL)
      .then(res => {
        setLoading(false);
        getBadgeCountApi()
        if (res) {
          const formatedData = formatHistoryData(res, selectedEventType, currentDate);
          console.log('myWorkHistory RES=>', JSON.stringify(res));
          setAllData(res);
          setJobData(sortJobData(formatedData));
          setLoading(false)
        }
      })
      .catch(error => {
        setLoading(false);
        console.log('myWorkHistory error :- ', error);
      });
  };

  const isInCurrentMonth = (date, currentD) => {
    if (date) {
      const yourDateMoment = moment(date);
      const isCurrentMonth = yourDateMoment.isSame(new Date(currentD), 'month');
      return isCurrentMonth;
    } else {
      return false;
    }
  };

  const filterEvents = (events, view, selectedDate) => {
    const date = moment(selectedDate);

    return events.filter((event) => {
      const startDate = moment(event.start_date, "YYYY-MM-DD");
      const finishDate =
        event.finish_date && event.finish_date !== "0000-00-00"
          ? moment(event.finish_date, "YYYY-MM-DD")
          : null;
      
      switch (view) {
        case "month":
          return (
            startDate.isSameOrBefore(date.endOf("month")) &&
            (!startDate || startDate.isSameOrAfter(date.startOf("month")))
          );

        case "week":
          const startOfWeek = date.clone().startOf("isoWeek"); //monday
          const endOfWeek = date.clone().endOf("isoWeek");  //sunday
          return (
            startDate.isSameOrBefore(endOfWeek, "day") &&
            (!startDate || startDate.isSameOrAfter(startOfWeek, "day"))
        );

        case "day":
          // return (
          //   startDate.isSameOrBefore(date, "day") &&
          //   (!finishDate || finishDate.isSameOrAfter(date, "day"))
          // );
           return (
            startDate.isSame(date));

        default:
          return false;
      }
    });
  };

  const formatHistoryData = (tempData, type, currentDay) => {
    console.log("currentDay", currentDay)
    if (tempData?.length) {
      if (type == EVENT_TYPE.DAY) {
        const newData = filterEvents(tempData, "day", currentDay);
        console.log(newData, "newData", newData?.length);
        return newData;
      }
      else if (type == EVENT_TYPE.WEEK) {
        const newWeekData = filterEvents(tempData, "week", currentDay);
        console.log("newWeekData", newWeekData?.length);
        return newWeekData;
      }
      else if (type == EVENT_TYPE.MONTH) {
        const newMonthData = filterEvents(tempData, "month", currentDay);
        console.log('newMonthData ---', newMonthData?.length);
        return newMonthData;
      }
    } else {
      return [];
    }
  };

  const onPressLeftArrow = () => {
    if (selectedEventType == EVENT_TYPE.MONTH) {
      const oneMonthInDate = moment(currentDate, 'YYYY-MM-DD')
        .subtract(1, 'month')
        .format('YYYY-MM-DD');
      setCurrentDate(oneMonthInDate);
      handleCalendarData(EVENT_TYPE.MONTH, oneMonthInDate);
    } else if (selectedEventType == EVENT_TYPE.WEEK) {
      const oneMonthInDate = moment(currentDate, 'YYYY-MM-DD').subtract(
        1,
        'week',
      );
      setCurrentDate(oneMonthInDate.format('YYYY-MM-DD'));
      weekRef.current.getPreviousWeek();
      handleCalendarData(EVENT_TYPE.WEEK, oneMonthInDate);
    } else {
      const oneMonthInDate = moment(currentDate, 'YYYY-MM-DD').subtract(
        1,
        'day',
      );
      setCurrentDate(oneMonthInDate.format('YYYY-MM-DD'));
      handleCalendarData(EVENT_TYPE.DAY, oneMonthInDate);
    }
  };

  const onPressRightArrow = () => {
    if (selectedEventType == EVENT_TYPE.MONTH) {
      const oneMonthInDate = moment(currentDate, 'YYYY-MM-DD')
        .add(1, 'month')
        .format('YYYY-MM-DD');
      setCurrentDate(oneMonthInDate);
      handleCalendarData(EVENT_TYPE.MONTH, oneMonthInDate);
    } else if (selectedEventType == EVENT_TYPE.WEEK) {
      const oneMonthInDate = moment(currentDate, 'YYYY-MM-DD').add(1, 'week');
      setCurrentDate(oneMonthInDate.format('YYYY-MM-DD'));
      weekRef.current.getNextWeek();
      handleCalendarData(EVENT_TYPE.WEEK, oneMonthInDate);
    } else {
      const oneMonthInDate = moment(currentDate, 'YYYY-MM-DD').add(1, 'day');
      setCurrentDate(oneMonthInDate.format('YYYY-MM-DD'));
      handleCalendarData(EVENT_TYPE.DAY, oneMonthInDate);
    }
  };

  const onWeekChanged = (start, end) => {
    let startMonth = start.format('MMM');
    let endMonth = end.format('MMM');
    if (startMonth != endMonth) {
      let updatedWeekFormat = '';
      updatedWeekFormat = `${startMonth} - ${endMonth}, ${start.format(
        'YYYY',
      )}`;
      setWeekDate(updatedWeekFormat);
      return;
    } else {
      setWeekDate(moment(currentDate).format('MMMM, YYYY'));
    }
  };

  const handleCalendarData = (eventType, currentD) => {
    const data = formatHistoryData(allData, eventType, currentD);
    setJobData(sortJobData(data));
  };

  const handleAddress = (item) => {
    if (item?.latitude && item?.longitude) {
      showLocation({
        latitude: item.latitude ?? 0,
        longitude: item.longitude ?? 0,
        googleForceLatLon: false,
        alwaysIncludeGoogle: false,
      });
    }
    else {
      showMessage({ message: 'Error', description: "Couldn't fetch coordinates", type: 'warning' });
    }
  }

  const checkCalendarEventStatus = (eventData, curDate) => {
    if (eventData) {
      const startDate = moment(eventData.start_date, "YYYY-MM-DD");
      // const finishDate =
      //   !eventData.finish_date || eventData.finish_date === "0000-00-00"
      //     ? moment("2300-12-31", "YYYY-MM-DD")
      //     : moment(eventData.finish_date, "YYYY-MM-DD");
      return moment(curDate).isSame(startDate);
    }
    return false
  }

  const CardComponent = ({ item, index }) => {
    const {
      start_date,
      finish_date,
      job,
      budget_name,
      company_name,
      address,
      start_time,
      finish_time,
      timesheet_shift_type,
      shift_working_status,
      site_name
    } = item;
    // console.log('--itme', finish_date, currentDate);
    const momentStart = moment(`${start_date} ${start_time}`, 'YYYY-MM-DD HH:mm:ss');
    const momentEnd = moment(`${finish_date} ${finish_time}`, 'YYYY-MM-DD HH:mm:ss');
    // Check if the end time is earlier than the start time on the same day
    if (momentEnd.isBefore(momentStart)) {
      momentEnd.add(1, 'day'); // Add one day to the end time
    }

    const startTime = start_time
      ? moment(start_time, 'HH:mm:ss').format('hh:mm A')
      : '';
    const endTime =
      finish_time && finish_time != '0000-00-00'
        ? moment(finish_time, 'HH:mm:ss').format('hh:mm A')
        : '';

    const diffInMinutes = momentEnd.diff(momentStart, 'minutes');
    const hoursLength = diffInMinutes / 60
    // const hoursLength = momentEnd.diff(momentStart, 'hours');
    // console.log(hoursLength,momentStart,momentEnd,"hoursLengthhoursLengthhoursLength")
    const timeDiff = hoursLength > item?.hours_threshold ? hoursLength - item?.break_length : hoursLength
    const currentD = moment(start_date).format("ddd Do MMM")
      if (item?.is_published && item?.is_published == 1) {
        return (
          <View style={styles.cardContainer} key={index}>
            <View style={styles.cardContainerLeft}>
              <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{currentD}</Text>
              <Text style={{ marginTop: 10, fontSize: 14 }}>{startTime}</Text>
              <Text style={{ marginTop: 4, marginBottom: 10, fontSize: 14 }}>
                {endTime}
              </Text>
              <View style={{ flexDirection: 'row', marginTop: 18 }}>
                <Icon size={20} color={'#007bbf'} type={'feather'} name={'clock'} />
                <Text style={{ padding: 2 }}>{timeDiff.toFixed(2)} hr/s</Text>
              </View>
            </View>
            <View style={{ flex: 0.7, paddingHorizontal: 8, paddingVertical: 4 }}>
              <Text style={{ fontWeight: 'bold' }}>{company_name}</Text>
              <Text style={styles.rightText2}>{budget_name}</Text>
              <View style={{ }}>
                <Text numberOfLines={1} style={[styles.rightText3, { backgroundColor: getTimesheetTypeBg(timesheet_shift_type) }]}>{timesheet_shift_type}</Text>
                <Text style={styles.clockText}>{shift_working_status}</Text>
              </View>
               {site_name ? <Text style={{flex:1,marginTop:2}}>{site_name}</Text>:null}
              <TouchableOpacity
                onPress={() => handleAddress(item)}
                style={{ flexDirection: 'row', marginTop: 10 }}>
                <Icon
                  size={22}
                  color={'#007bbf'}
                  type={'ionicon'}
                  name={'location-outline'}
                />
                <Text style={{flex:1}}>{address}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }
      else
        return null
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {loading ? <Loader /> : null}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View>
            <Icon
              name="arrow-back-ios"
              size={28}
              color={'#007bbf'}
              type="material-icons"
              iconStyle={{ alignSelf: 'center' }}
              onPress={() => {
                onPressLeftArrow();
              }}
            />
          </View>

          <Text
            style={{
              alignItems: 'center',
              fontSize: 18,
              fontWeight: 'bold',
            }}>
            {selectedEventType == EVENT_TYPE.MONTH
              ? moment(currentDate).format('MMMM, YYYY')
              : selectedEventType == EVENT_TYPE.WEEK
                ? weekdate
                : moment(currentDate).format('MMMM D, YYYY')}
          </Text>
          <View>
            <Icon
              name="arrow-forward-ios"
              size={28}
              color={'#007bbf'}
              type="material-icons"
              iconStyle={{ alignSelf: 'center' }}
              onPress={() => {
                onPressRightArrow();
              }}
            />
          </View>
        </View>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => {
              setSelectedEventType(EVENT_TYPE.MONTH);
              handleCalendarData(EVENT_TYPE.MONTH, currentDate);
            }}
            style={styles.btnstyle(selectedEventType == EVENT_TYPE.MONTH)}>
            <Text
              style={styles.txtcolor(selectedEventType == EVENT_TYPE.MONTH)}>
              Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedEventType(EVENT_TYPE.WEEK);
              handleCalendarData(EVENT_TYPE.WEEK, currentDate);
            }}
            style={styles.btnstyle(selectedEventType == EVENT_TYPE.WEEK)}>
            <Text style={styles.txtcolor(selectedEventType == EVENT_TYPE.WEEK)}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedEventType(EVENT_TYPE.DAY);
              handleCalendarData(EVENT_TYPE.DAY, currentDate);
            }}
            style={styles.btnstyle(selectedEventType == EVENT_TYPE.DAY)}>
            <Text style={styles.txtcolor(selectedEventType == EVENT_TYPE.DAY)}>
              Day
            </Text>
          </TouchableOpacity>
        </View>
        {selectedEventType == EVENT_TYPE.MONTH ? (
          <View
            style={{marginTop: 20,marginHorizontal: 15}}>
            <Calendar
              headerStyle={{backgroundColor: '#e6e6e6'}}
              style={{paddingLeft: 0,paddingRight: 0,}}
              theme={calendarTheme}
              marking={{
                selected: true,
                selectedColor: 'green',
              }}
              state="selected"
              markingType={'multi-dot'}
              dayComponent={props => {
                let date = moment(props?.date?.dateString, 'YYYY-MM-DD').format(
                  'D',
                );
                const calDate = props?.date?.dateString;
                return (
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor:
                        calDate == currentDate ? '#ffe46c' : '#fff',
                    }}>
                    <View
                      style={{
                        paddingTop: 4,
                        paddingBottom: 4,
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: isInCurrentMonth(calDate, currentDate)
                            ? 'black'
                            : '#d9e1e8',
                        }}>
                        {date}
                      </Text>
                    </View>
                    <View
                      style={styles.monthDayView}>
                      {JobData?.map((el, ind) => {
                        const hasEvent = checkCalendarEventStatus(el, calDate)
                        if (hasEvent && el?.is_published && el?.is_published == 1) {
                          return (
                            <View
                              key={ind}
                              style={styles.eventIndicator}
                            />
                          )
                        }
                      })}
                    </View>
                  </TouchableOpacity>
                );
              }}
              hideArrows={true}
              monthFormat={''}
              firstDay={1}
              initialDate={currentDate}
              disableAllTouchEventsForDisabledDays={false}
              onDayPress={day => {
                // console.log('day press', day);
                // setCurrentDate(
                //   moment(day?.dateString).format('YYYY-MM-DD'),
                // );
              }}
            />
          </View>
        ) : selectedEventType == EVENT_TYPE.WEEK ? (
          <View style={{ marginHorizontal: 15 }}>
            <CalendarStrip
              style={{ height: 100, paddingBottom: 10 }}
              showMonth={false}
              ref={weekRef}
              selectedDate={currentDate}
              scrollToOnSetSelectedDate={true}
              leftSelector={[]}
              onWeekChanged={(start, end) => {
                onWeekChanged(start, end);
              }}
              rightSelector={[]}
              onDateSelected={date => {
                setCurrentDate(date.format('YYYY-MM-DD'));
              }}
              dayComponent={props => {
                let date = props?.date?.format('DD/MM');
                let day = props?.date?.format('ddd');
                const calDate = props?.date?.format('YYYY-MM-DD');
                return (
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      height: normalizeSize(140),
                      marginTop: 6,
                    }}
                    onPress={() => {
                      // props?.onDateSelected(props?.date);
                    }}>
                    <View
                      style={{
                        paddingTop: 4,
                        paddingBottom: 8,
                        borderWidth: 1,
                        alignItems: 'center',
                        backgroundColor: props?.selected ? 'yellow' : '#e6e6e6',
                      }}>
                      <Text style={{ fontSize: 10 }}>{day}</Text>
                      <Text style={{ fontSize: 10 }}>{date}</Text>
                      {props?.selected ? <View style={{}}></View> : null}
                    </View>
                    <View
                      style={styles.weekIndicatorView}>
                      {JobData?.map((el, ind) => {
                        const hasEvent = checkCalendarEventStatus(el, calDate)
                        if (hasEvent && el?.is_published && el?.is_published == 1) {
                          return (
                            <View
                              key={ind}
                              style={styles.eventIndicator}
                            />
                          )
                        }
                        return null
                      })}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        ) : (
          <View style={{ borderColor: 'lightgrey', alignSelf: 'center' }}>
            <View style={styles.dayTxtConatiner}>
              <Text>{moment(currentDate).format('dddd')}</Text>
              <Text>{moment(currentDate).format('DD/MM')}</Text>
            </View>
            <View style={styles.dayBtmContainer}>
              {JobData?.map((e, ind) => {
                 const hasEvent = checkCalendarEventStatus(e, currentDate)
                if(hasEvent && e?.is_published && e?.is_published == 1){
                  return (
                      <View
                        key={ind}
                        style={styles.eventIndicator}
                      />
                  )
                }
              })}
            </View>
          </View>
        )}
        {/* <CalendarComponent/> */}
        <FlatList
          style={{ marginVertical: 15, paddingHorizontal: 16 }}
          data={JobData}
          showsVerticalScrollIndicator={false}
          renderItem={CardComponent}
          keyExtractor={index => JSON.stringify(index)}
        // ListHeaderComponent={HeaderComponent}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Roaster;

const styles = StyleSheet.create({
  btnstyle: isSelected => ({
    flex: 0.2,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: isSelected ? '#007bbf' : 'lightgrey',
    borderRadius: 10,
  }),
  txtcolor: isSelected => ({
    color: isSelected ? 'white' : 'black',
  }),
  cardContainer: {
    borderWidth: 1,
    borderColor: '#0082c2',
    marginTop: 20,
    flexDirection: 'row',
    borderRadius: 8,
  },
  cardContainerLeft: {
    flex: 0.3,
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: '#e6e6e6',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rightText2: {
    marginTop: 4,
    backgroundColor: '#7ebedf',
    paddingLeft: 10,
    paddingVertical: 10,
    borderRadius: 8,
    color: '#fff',
  },
  rightText3: {
    marginTop: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#00da9b',
    paddingHorizontal: 20,
    paddingVertical: 2,
    borderRadius: 100,
    color: '#000',
  },
  clockText: {
    color: '#00da9b',
    marginTop: 4,
    fontWeight: "700",
    fontSize: 14
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  dayTxtConatiner: {
    backgroundColor: 'yellow',
    paddingHorizontal: 30,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  dayBtmContainer: {
    backgroundColor: 'white',
    minHeight: 50,
    borderColor: 'lightgrey',
    borderWidth: 1,
    alignItems: 'center',
  },
  text: {
    marginTop: Platform.OS == 'android' ? 4 : 6,
    fontSize: 16,
    fontFamily: 'System',
    fontWeight: '300',
    color: '#2d4150',
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },

  selectedText: {
    color: '#111',
  },
  todayText: {
    color: '#00BBF2',
  },
  disabledText: {
    color: '#d9e1e8',
  },
  inactiveText: {
    color: '#d9e1e8',
  },
  monthDayView:{
    height: 50,
    borderTopWidth: 0,
    alignContent: 'center',
    flexWrap: 'wrap'
  },
  eventIndicator:{
    width: 10,
    backgroundColor: '#00da9b',
    height: 10,
    marginTop: 4,
    marginHorizontal: 1,
    borderRadius: 5,
  },
  weekIndicatorView:{
    height: 50,
    borderWidth: 1,
    borderTopWidth: 0,
    alignContent: 'center',
    flexWrap: 'wrap'
  }
});

const calendarTheme = {
  'stylesheet.calendar.header': {
    header: {
      height: 0,
      opacity: 0,
    },
    dayHeader: {
      borderColor: '#757575',
      borderWidth: 1,
      margin: 0,
      padding: 10,
      flex: 1,
    },
    week: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
  },
  'stylesheet.calendar.main': {
    dayContainer: {
      borderColor: '#757575',
      borderWidth: 1,
      flex: 1,
      //   padding: 10,
    },
    emptyDayContainer: {
      borderColor: '#757575',
      borderWidth: 1,
      flex: 1,
      //   padding: 10,
    },
    week: {
      marginTop: 0,
      marginBottom: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
  },
  'stylesheet.day.basic': {
    selected: {
      backgroundColor: 'yellow',
      borderRadius: 0,
      color: 'black',
      // padding:10,
    },
    base: {
      // padding:10,
      width: '100%',
      height: 50,
      alignItems: 'center',
    },
    selectedText: {
      color: 'black',
    },
  },
  textMonthFontSize: 0,
  dayTextColor: 'black',
  textDayFontSize: 10,
  selectedDayBackgroundColor: 'yellow',

}