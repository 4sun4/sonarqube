import React, { useState } from 'react'
import { View, Text, SafeAreaView, Dimensions, StyleSheet, Platform, TouchableOpacity } from 'react-native'
const { height, width } = Dimensions.get('window');
import { Icon, Overlay } from 'react-native-elements'
import Colors from '../Util/Colors';
import { MinMargin } from '../Util/Styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'

const DateTime = (props) => {

    const { Show, onChange, Date, onPress, ToDate, Label,MAX,MIN ,onBackdropPress} = props
    console.log('Show', Show);
    return (
        <>
            {Platform.OS != 'android' && Show ?
                // <Overlay onBackdropPress={false}>
                    <View style={{alignItems: 'center', justifyContent: 'center', padding: height / 100 }}>
                        <DateTimePicker
                            maximumDate={MAX}
                            minimumDate={MIN}
                            value={Date}
                            onChange={(e,d)=>onChange(e,d)} />
                    </View>
                // </Overlay> 
                :
                Show ?
                    <View style={{ position: 'absolute' }}>
                        <DateTimePicker
                            maximumDate={MAX}
                            minimumDate={MIN}

                            value={Date}
                            onChange={(e,d)=>onChange(e,d)} />
                    </View>
                    : null}

            <TouchableOpacity onPress={onPress} style={{ borderBottomWidth: 1, borderColor: Colors.L_Border }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: MinMargin }}>

                    <Text style={{ color: 'grey', fontSize: height / 45, marginLeft: MinMargin }}>{ToDate ? moment(ToDate).format("D MMM, YYYY") : Label}</Text>
                    <Icon name={"calendar"} type='antdesign' color={'grey'} size={height / 30} iconStyle={{ marginHorizontal: MinMargin }} />
                </View>

            </TouchableOpacity>
        </>
    )
}

export default DateTime