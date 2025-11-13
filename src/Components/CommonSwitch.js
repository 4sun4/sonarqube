
import React, { useState } from 'react'
import { View, Text, SafeAreaView, Dimensions, Switch ,Image} from 'react-native'
import Colors from '../Util/Colors';
const { height, width } = Dimensions.get('window');
const MinMargin = width / 40;

const CommonSwitch = (props) => {
    const { Label, Val, onValueChange,IsIcon,HeaderCheck } = props
    return (

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {IsIcon ?
                <Image
                    style={{ width: 22, height: 18, alignSelf: 'center' }}
                    resizeMode={'contain'}
                    source={HeaderCheck} />
                :
                <Switch
                    trackColor={{ false: Colors.Theme_D_Grey, true: Colors.ThemeGreen }}
                    thumbColor={Colors.White}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={onValueChange}
                    value={Val}
                    
                />
                }
            <Text style={{ fontSize: height / 45,marginLeft:IsIcon?MinMargin:0 }}>{Label}</Text>
        </View>





    )
}

export default CommonSwitch