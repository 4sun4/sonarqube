import React, { useCallback, useState } from 'react';
import Thumb from './Thumb';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CustomLabel from './CustomLabel';
import Colors from '../../Util/Colors';
const { height, width } = Dimensions.get('window');

const SliderComp = (props) => {
    const { LowVal, HighVal, sliderVal } = props
    const renderThumb = useCallback(() => <Thumb sliderVal={sliderVal} />, [sliderVal]);
    let LowProp = LowVal && HighVal && LowVal == HighVal ? LowVal - 1 : LowVal
    console.log('sliderVal--------', sliderVal);

    return (
        <View style={{ alignItems: 'center' }}>
            <MultiSlider
                selectedStyle={{ backgroundColor: Colors.Border }}
                unselectedStyle={{ backgroundColor: Colors.Border }}
                values={[sliderVal]}
                onValuesChange={(l) => props.handleValue(l)}
                min={LowProp}
                max={HighVal}
                step={1}
                allowOverlap
                snapped
                trackStyle={{ height: 4, borderRadius: 2, }}
                customMarker={renderThumb}
                customLabel={CustomLabel}
                sliderLength={width / 1.3}
            />
        </View>
    )
}

export default SliderComp