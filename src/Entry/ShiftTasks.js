import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {normalizeSize} from '../Util/CommonFun';
import moment from 'moment';

const ShiftTasks = props => {
  const {route, navigation} = props;
  const [JobDetailData, setJobDetailData] = useState(null);
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

  if (JobDetailData) {
    if (JobDetailData?.latitude) {
      latitude = JobDetailData?.latitude;
    }
    if (JobDetailData?.longitude) {
      longitude = JobDetailData?.longitude;
    }
    if (JobDetailData?.report_to) {
      report_to = JobDetailData?.report_to;
    }
    if (JobDetailData?.pay_rate) {
      pay_rate = JobDetailData?.pay_rate;
    }
    if (JobDetailData?.address) {
      address = JobDetailData?.address;
    }
    if (JobDetailData?.company_name) {
      company_name = JobDetailData?.company_name;
    }
    if (JobDetailData?.job) {
      job = JobDetailData?.job;
    }
    if (JobDetailData?.order_id) {
      order_id = JobDetailData?.order_id;
    }
    if (JobDetailData?.order_status) {
      order_status = JobDetailData?.order_status;
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

  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', async () => {
      getRouteData();
    });
    return unsubscribe;
  }, [route]);

  const getRouteData = () => {
    if (route && route.params) {
      let rout = route.params;
      let jobData = rout.JobData && rout.JobData != '' ? rout.JobData : '';
      setJobDetailData(jobData ? jobData : null);
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={{alignItems: 'center', marginTop: 10, marginHorizontal: 20}}>
        <Text
          style={{
            fontSize: normalizeSize(18),
            fontWeight: '700',
            marginHorizontal: 16,
            textAlign: 'center',
          }}>
          {`${company_name ? company_name : ''}`}
        </Text>
        <Text
          style={{
            fontSize: normalizeSize(12),
            color: '#818589',
            textAlign: 'center',
            marginBottom: 10,
            marginTop: 5,
          }}>
          Shift scheduled{' '}
          {start_time ? moment(start_time, 'hh:mm A').format('hh:mm A') : ''} to{' '}
          {finish_time ? moment(finish_time, 'hh:mm A').format('hh:mm A') : ''}
        </Text>
      </View>
    </View>
  );
};

export default ShiftTasks;

const styles = StyleSheet.create({});
