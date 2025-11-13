import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import moment from 'moment'
import DateTimePickerComp from '../../../Components/DateTimePickerComp'

const DateTimePickerSelect = (props) => {
    const { onDateSelectSuccess, defaultStartTime, defaultEndTime } = props;
    const [startDateString, setStartDateString] = useState('');
    const [endDateString, setEndDateString] = useState('');

    const [data, setData] = useState({
        startDate: new Date(),
        endDate: new Date(),
        show: false,
        show1: false,
    });

    useEffect(() => {
        if (defaultStartTime) {
            const formattedStartDate = convertToISOFormat(defaultStartTime);
            setData({ ...data, startDate: formattedStartDate })
            setStartDateString(defaultStartTime)
        }
        if (defaultEndTime) {
            const formattedEndDate = convertToISOFormat(defaultEndTime);

            setData({ ...data, endDate: formattedEndDate })
            setEndDateString(defaultEndTime)
        }
    }, [defaultStartTime, defaultEndTime])

    const convertToISOFormat = (dateTimeStr) => {
        const date = new Date(dateTimeStr?.replace(" ", "T") + "Z");
        return date
      };

    const handleConfirm = (date, type) => {
        
        if (date) {
            let newData = {...data}
            if (type === 'Start') {
                setStartDateString(date)
                newData = {...newData,startDate: date, show: false}
                setData(newData)
            }
            else if (type === 'End') {
                setEndDateString(date)
                newData = {...newData,endDate: date, show1: false}
                setData(newData)
            }
            if (onDateSelectSuccess) {
                onDateSelectSuccess(newData)
            }
        }
        else {
            hideDatePicker(type)
        }
    };

    const hideDatePicker = (type) => {
        if (type === 'Start') {
            setData({ ...data, show: false })
        }
        else {
            setData({ ...data, show1: false })
        }
    };

    const DateComponent = ({ dateString, type }) => {
        return (
            <View style={{ flexDirection: "row", flex: 1 }}>
                <TouchableOpacity
                    onPress={() => {
                        if (type == "Start") {
                            setData({ ...data, show: true })
                        }
                        else {
                            setData({ ...data, show1: true })
                        }
                    }}
                    style={styles.timeContainer}>
                    <View style={styles.timeSubContainer}>
                        <Text style={styles.dateLabel}>{dateString ? moment(dateString).format("D , DD/MM/YYYY") : ''}</Text>
                        <Icon name={"calendar"} type='antdesign' color={'#000'} size={20} style={{ marginRight: 5 }} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                   disabled
                    style={[styles.timeContainer, { flex: 0.3 }]}>
                    <View style={styles.timeSubContainer}>
                        <Text style={styles.dateLabel}>{dateString ? moment(dateString).format("HH:MM:a") : ''}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <>
            <View style={styles.rowWrapper}>
                <Text style={{ color: "#fff", flex: 0.2 }}>Start Time</Text>
                <View style={{ flex: 0.8 }}>
                    <DateComponent type="Start" dateString={startDateString} />
                </View>
            </View>

            <View style={[styles.rowWrapper, { marginTop: 5 }]}>
                <Text style={{ color: "#fff", flex: 0.2 }}>End Time</Text>
                <View style={{ flex: 0.8 }}>
                    <DateComponent type="End" dateString={endDateString} />
                </View>
            </View>

            <DateTimePickerComp
                isDatePickerVisible={data.show}
                handleConfirm={(date) => handleConfirm(date, 'Start')}
                hideDatePicker={() => hideDatePicker('Start')}
                mode={'datetime'}
                DateVal={data.startDate}
            />
            <DateTimePickerComp
                isDatePickerVisible={data.show1}
                handleConfirm={(date) => handleConfirm(date, 'End')}
                hideDatePicker={() => hideDatePicker('End')}
                mode={'datetime'}
                DateVal={data.endDate}
            />
        </>
    )
}

const styles = StyleSheet.create({
    rowWrapper: {
        flexDirection: "row",
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    timeContainer: {
        borderRadius: 5,
        backgroundColor: "#d4d4d4",
        marginHorizontal: 5,
        flex: 0.7
    },
    timeSubContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40
    },
    dateLabel: {
        color: '#000',
        fontSize: 14,
        marginLeft: 10,
    }
})
export default DateTimePickerSelect