import React, { useState } from 'react'
import { View, Text, Image, Dimensions, StatusBar, FlatList, TouchableOpacity } from 'react-native'
import { Overlay, Input, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import Colors from '../../Util/Colors';
import Loader from '../Loader';
const { height, width } = Dimensions.get('window');
const Margin = width / 20
const MinMargin = width / 40
const cross = require('../../Assets/Icons/cross.png')

const ShiftNotes = (props) => {

    const { visible, toggleOverlay, handleChange, Value, AddNotes, loading, SkipNotes, TimeSt, ClockSt } = props


    const renderClockInOutText = () => {
        if (ClockSt.includes('in') && TimeSt == 'Early') {
            return <Text style={{ fontSize: height / 45, marginVertical: Margin, lineHeight: 30 }}>You are clocking in early for the sheduled shift. If you want to and any shift notes, add the note and click Submit. Otherwise just click Skip Notes.</Text>
        } else if (ClockSt.includes('in') && TimeSt == 'Late') {
            return <Text style={{ fontSize: height / 45, marginVertical: Margin, lineHeight: 30 }}>You are clocking in late for the sheduled shift. If you want to and any shift notes, add the note and click Submit. Otherwise just click Skip Notes.</Text>
        }
        else if (ClockSt.includes('out.') && TimeSt == 'Early') {
            return <Text style={{ fontSize: height / 45, marginVertical: Margin, lineHeight: 30 }}>You are clocking out early for the sheduled shift. If you want to and any shift notes, add the note and click Submit. Otherwise just click Skip Notes.</Text>
        }
        else if (ClockSt.includes('out.') && TimeSt == 'Late') {
            return <Text style={{ fontSize: height / 45, marginVertical: Margin, lineHeight: 30 }}>You are clocking out late for the sheduled shift. If you want to and any shift notes, add the note and click Submit. Otherwise just click Skip Notes.</Text>
        }
    }


    return (
        <Overlay overlayStyle={{ width: width / 1.1 }} isVisible={visible} onBackdropPress={toggleOverlay}>
            <View style={{ padding: MinMargin, }}>

                {loading ? <Loader /> : null}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: height / 32, fontWeight: 'bold' }}>{`You Are ${TimeSt}`}</Text>
                    <TouchableOpacity onPress={toggleOverlay}>
                        <Image source={cross} height={1000} width={500} style={{ height: height / 40, width: width / 20 }} />
                    </TouchableOpacity>
                </View>

                {renderClockInOutText()}
                <View style={{}}>
                    <Input
                        inputContainerStyle={{ borderRadius: height / 200, borderBottomWidth: 1, borderColor: 'grey', }}
                        multiline={true}
                        inputStyle={{ textAlignVertical: "top", color: 'black', fontSize: height / 40, width: width }}
                        value={Value} secureTextEntry={false} keyboardAppearance="light"
                        autoCapitalize="none" autoCorrect={false} keyboardType={"default"}
                        returnKeyType={"done"} blurOnSubmit={true} placeholder={'Shift notes'}
                        placeholderTextColor={"rgba(0,0,0,0.5)"} onChangeText={(e) => { handleChange(e) }}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Button
                            onPress={() => AddNotes(props.ClockPopUpData)}
                            title={'SUBMIT'}
                            titleStyle={{ fontSize: height / 45 }}
                            buttonStyle={{ backgroundColor: Colors.ThemeRed, padding: 10, width: width / 3, borderRadius: 10, }}
                            containerStyle={{}}
                        />
                        <Button
                            onPress={() => SkipNotes(props.ClockPopUpData)}
                            title={'SKIP NOTES'}
                            titleStyle={{ fontSize: height / 45 }}
                            buttonStyle={{ backgroundColor: Colors.ThemeRed, padding: 10, width: width / 3, borderRadius: 10, }}
                            containerStyle={{}}
                        />
                    </View>
                </View>
            </View>
        </Overlay>
    )
}
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

export default connect(mapStateToProps, mapDispatchToProps)(ShiftNotes);