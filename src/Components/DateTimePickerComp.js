import React from 'react'
import { View } from 'react-native'
import DateTimePickerModal from "react-native-modal-datetime-picker";

const DateTimePickerComp = ({ isDatePickerVisible, hideDatePicker, handleConfirm, MinDate, DateVal, MaxDate, onBackdropPress, onChange, mode }) => {
    return (
        <View style={{ flex: 1 }}>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode={mode}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                is24Hour={false}
                date={DateVal}
                minimumDate={MinDate}
                maximumDate={MaxDate}
            />
        </View>
    )
}

export default DateTimePickerComp
