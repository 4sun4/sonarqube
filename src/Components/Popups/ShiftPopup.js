import React, { Component, useState, useRef, useEffect, useCallback } from "react";
import {
    TouchableOpacity,
    StatusBar,
    View,
    Share,
    Image,
    Text,
    Dimensions,
} from "react-native";
import { Overlay, Input, Button } from 'react-native-elements';
import Colors from '../../Util/Colors';
import { connect } from "react-redux";
import { secondsToTime, timeConvert } from '../../Util/CommonFun';
import Types from '../../redux/Types';
import moment from 'moment'

const { height, width } = Dimensions.get('window');
const Margin = width / 20
const MinMargin = width / 40
const clockgreen = require('../../Assets/Icons/clockgreen.png')
const cross = require('../../Assets/Icons/cross.png')
const clockRed = require('../../Assets/Icons/clockRed.png')
const clockblue = require('../../Assets/Icons/clockblue.png')



class ShiftPopup extends Component {

    constructor(props) {
        super(props);
        this.watchId = React.createRef();
        this.state = {
            TimeObj: null,
            min_dif: 0,
        }
    }

    render() {
        const { min_dif, TimeObj, } = this.state
        const { visible, toggleOverlay, clickIn, clockOut, ClockPopUpData, TakeBrake, StartBrakeTime ,ShiftState} = this.props
        const {minutes_Counter } = ShiftState
        let company_name = '', start_date = '', job = '', order_id = '', order_status = '', address = '', shift_status = ''

        if (ClockPopUpData) {
            if (ClockPopUpData.company_name) { company_name = ClockPopUpData.company_name }
            if (ClockPopUpData.start_date) { start_date = ClockPopUpData.start_date }
            if (ClockPopUpData.job) { job = ClockPopUpData.job }
            if (ClockPopUpData.order_id) { order_id = ClockPopUpData.order_id }
            if (ClockPopUpData.order_status) { order_status = ClockPopUpData.order_status }
            if (ClockPopUpData.address) { address = ClockPopUpData.address }
            if (ClockPopUpData.shift_status) { shift_status = ClockPopUpData.shift_status }

        }

        return (
            <Overlay overlayStyle={{ width: width / 1.05 }} isVisible={visible}>
                <View style={{ padding: MinMargin, }}>

                    <View style={{ flexDirection: 'row', }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text onPress={() => this.props.onButtonStart1()} style={{ fontSize: height / 32, fontWeight: 'bold', marginLeft: Margin }}>{clickIn ? 'Start Shift' : clockOut ? 'End Shift' : 'On Break'}</Text>
                        </View>
                        <TouchableOpacity style={{ justifyContent: 'center' }} onPress={toggleOverlay}>
                            <Image source={cross} height={1000} width={500} style={{ height: height / 40, width: width / 20 }} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                        <Text style={{ fontSize: height / 40, color: Colors.ThemeRed, marginTop: Margin }}>On Site Now </Text>
                        {!clickIn && !clockOut ?
                            <Text style={{ fontSize: height / 40, color: Colors.ThemeRed, marginTop: 2 }}>on break since {StartBrakeTime ? moment(StartBrakeTime).format('LT') : ''}</Text>
                            : null
                        }
                        {clickIn ?
                            <Text style={{ fontSize: height / 40, color: Colors.Black, marginTop: Margin, textAlign: 'center' }}>Labourer @ {company_name ? company_name : ''}{shift_status == "On Going" ? `Shift is ${shift_status}` : `Shift due to start in ${shift_status} minutes`}</Text>
                            : clockOut ?
                                <Text style={{ fontSize: height / 40, color: Colors.Black, marginTop: Margin, textAlign: 'center' }}>Labourer @ {company_name ? company_name : ''} Shift End's in {minutes_Counter ? timeConvert(minutes_Counter) : ''}</Text>
                                : <Text style={{ fontSize: height / 40, color: Colors.Black, marginTop: Margin, textAlign: 'center' }}>Labourer @ {company_name ? company_name : ''} Shift End's in  {minutes_Counter ? timeConvert(minutes_Counter) : ''}</Text>

                        }

                        <TouchableOpacity onPress={() => clickIn ? this.props.onButtonStart() : this.props.onButtonStop('clockout')} style={{ marginTop: Margin, }}>
                            <Image source={clickIn ? clockgreen : clockOut ? clockRed : clockblue} style={{ width: 130, height: 130, }} resizeMode={'contain'} />
                        </TouchableOpacity>
                        {clickIn ?
                            <Text onPress={toggleOverlay} style={{ fontSize: height / 40, color: Colors.Black, marginTop: Margin, textAlign: 'center' }}>No Thanks, Close!</Text>
                            : clockOut ?
                                <Text onPress={() => this.props.onButtonStop('takebreake')} style={{ fontSize: height / 40, color: Colors.ThemeBlue, marginTop: Margin, textAlign: 'center' }}>Take a Break!</Text>
                                : <Text onPress={() => this.props.onEndBreak()} style={{ fontSize: height / 40, color: Colors.ThemeRed, marginTop: Margin, textAlign: 'center' }}>End Break</Text>
                        }
                    </View>
                </View>
            </Overlay>
        )
    }
}


const mapStateToProps = (state) => {
    const { HomeDetails: { ClockPopup, ClockPopUpData, TakeBrake, EndBrake, StartBrakeTime, EndBrakeTime },
        SettingDetails: { LocationStatus }
    } = state;

    return { ClockPopup, ClockPopUpData, TakeBrake, StartBrakeTime, EndBrakeTime, LocationStatus };
};

const mapDispatchToProps = dispatch => {
    return {
        DispatchBrake: data => dispatch({ type: Types.TAKE_BRAKE, data: data }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShiftPopup);






























