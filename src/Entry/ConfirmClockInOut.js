import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {normalizeSize} from '../Util/CommonFun';
import Colors from '../Util/Colors';
import moment from 'moment';
import { connect } from 'react-redux';

let latitude = '',
  longitude = '',
  report_to = '',
  pay_rate = [],
  address = '',
  company_name = '',
  job = '',
  order_id = '',
  order_status = '',
  start_date = '',
  finish_date = '',
  start_time = '',
  finish_time = '';

const ConfirmClockInOut = props => {
  const {
    visible,
    toggleOverlay,
    handleChange,
    Value,
    AddNotes,
    loading,
    SkipNotes,
    TimeSt,
    ClockSt,
    JobDetailData,
  } = props;

  if (JobDetailData) {
    if (JobDetailData?.company_name) {
      company_name = JobDetailData?.company_name;
    }
    if (JobDetailData?.job) {
      job = JobDetailData?.job;
    }
    if (JobDetailData?.start_date) {
      start_date = JobDetailData?.start_date;
    }
    if (JobDetailData?.finish_date) {
      finish_date = JobDetailData?.finish_date;
    }
    if (JobDetailData?.start_time) {
      start_time = JobDetailData?.start_time;
    }
    if (JobDetailData?.finish_time) {
      finish_time = JobDetailData?.finish_time;
    }
  }

  const renderClockInOutText = () => {
    const statTime = moment(start_time, 'hh:mm A');
    const finishTime = moment(finish_time, 'hh:mm A');
    const currentTime = moment();
    const startTimeDiff = Math.abs(currentTime.diff(statTime, 'minutes'));
    const finishTimeDiff = Math.abs(currentTime.diff(finishTime, 'minutes'));
    if (ClockSt.includes('in') && TimeSt == 'Early') {
      return {
        textHeader: 'Early Clock In Warning',
        text1: `Your shift was due to start at ${
          start_time ? moment(start_time, 'hh:mm A').format('hh:mma') : ''
        }`,
        text2: `Please note you have clocked in over ${startTimeDiff} minutes before shift start, do you want to clock in early?`,
      };
    } else if (ClockSt.includes('in') && TimeSt == 'Late') {
      return {
        textHeader: 'Late Clock In Warning',
        text1: `Your shift was due to start at ${
          start_time ? moment(start_time, 'hh:mm A').format('hh:mma') : ''
        }`,
        text2: `Please note you have clocked in over ${startTimeDiff} minutes after shift start, do you want to clock in late?`,
      };
    } else if (ClockSt.includes('out.') && TimeSt == 'Early') {
      return {
        textHeader: 'Early Clock Out Warning',
        text1: `Your shift was due to end at ${
          finish_time ? moment(finish_time, 'hh:mm A').format('hh:mma') : ''
        }`,
        text2: `Please note you have clocked out over ${finishTimeDiff} minutes before shift end, do you want to clock out early?`,
      };
    } else if (ClockSt.includes('out.') && TimeSt == 'Late') {
      return {
        textHeader: 'Late Clock Out Warning',
        text1: `Your shift was due to end at ${
          finish_time ? moment(finish_time, 'hh:mm A').format('hh:mma') : ''
        }`,
        text2: `Please note you have clocked out over ${finishTimeDiff} minutes after shift end, do you want to clock out late?`,
      };
    }
    else{
      return null
    }
  };

  let cardTexts = renderClockInOutText();

  return (
    <View style={{paddingTop: 30, paddingHorizontal: 20}}>
      <View style={[styles.warningCard]}>
        <Text style={styles.warningTextHeader}>{cardTexts?.textHeader}</Text>
        <Text style={[styles.warningText1]}>{cardTexts?.text1}</Text>
        <Text style={styles.warningText2}>{cardTexts?.text2}</Text>
      </View>

      <View style={styles.childContainer}>
        <Text style={styles.companyName}>{company_name}</Text>
        <Text style={styles.scheduleText}>
          Shift scheduled{' '}
          {start_time ? moment(start_time, 'hh:mm A').format('hh:mm A') : ''} to{' '}
          {finish_time ? moment(finish_time, 'hh:mm A').format('hh:mm A') : ''}
        </Text>
      </View>
      <View style={styles.yesNoContainer}>
        <TouchableOpacity
          style={styles.yesContainer}
          onPress={() => {
            // toggleOverlay();
            SkipNotes(props.ClockPopUpData)
          }}>
          <Text style={styles.yesNoText}>YES</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.noContainer}
          onPress={() => {
            toggleOverlay();
          }}>
          <Text style={styles.yesNoText}>NO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const mapStateToProps = (state) => {
    const { HomeDetails: { ClockPopup, ClockPopUpData },
        SettingDetails: { LocationStatus }
    } = state;

    return { ClockPopup, ClockPopUpData, };
};

const mapDispatchToProps = dispatch => {
    return {
        DispatchBrake: data => dispatch({ type: Types.TAKE_BRAKE, data: data }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmClockInOut);

const styles = StyleSheet.create({
  warningCard: {
    backgroundColor: '#f8f3d6',
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    alignItems: 'center',
  },
  warningTextHeader: {
    fontSize: normalizeSize(18),
    fontWeight: '700',
    color: '#848071',
    textAlign: 'center',
  },
  warningText1: {
    fontSize: normalizeSize(12),
    // fontWeight: '700',
    color: '#848071',
    textAlign: 'center',
    paddingVertical: 10,
  },
  warningText2: {
    fontSize: normalizeSize(12),
    // fontWeight: '700',
    color: '#808080',
    textAlign: 'center',
  },
  childContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  companyName: {
    fontSize: normalizeSize(20),
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  scheduleText: {
    color: '#808080',
  },
  yesNoContainer: {
    flexDirection: 'row',
    marginTop: 25,
    // marginHorizontal: 25,
    // flex:1,
    justifyContent:'space-around'
  },
  yesContainer: {
    backgroundColor: '#08dc9c',
    // paddingHorizontal: 50,
    paddingVertical: 20,
    flex:0.4,
    alignItems:'center'
    
    
  },
  noContainer: {
    backgroundColor: 'red',
    // paddingHorizontal: 50,
    paddingVertical: 20,
    flex:0.4,
    alignItems:'center'
  },
  yesNoText: {
    color: '#fff',
    fontSize: normalizeSize(18),
  },
});
