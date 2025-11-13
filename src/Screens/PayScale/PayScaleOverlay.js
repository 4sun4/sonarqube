import React, { useState } from 'react'
import { View, Text, Image, Dimensions, StatusBar, FlatList, TouchableOpacity } from 'react-native'
import { Overlay, Input, Button } from 'react-native-elements';
import Loader from '../../Components/Loader';
const { height, width } = Dimensions.get('window');
const Margin = width / 20
const MinMargin = width / 40
const cross = require('../../Assets/Icons/cross.png')

export default function PayScaleOverlay(props) {

    const {visible,toggleOverlay,handleChange,InputValue,onSubmit,loading}=props
    return (
        <Overlay overlayStyle={{ width: width / 1.05 }} isVisible={visible} onBackdropPress={toggleOverlay}>
               <View style={{}}>
               {loading ? <Loader /> : null}

        <View style={{ padding: MinMargin, }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: height / 32, fontWeight: 'bold' }}>Lodge Pay Query</Text>
                <TouchableOpacity onPress={toggleOverlay}>
                    <Image source={cross} height={1000} width={500} style={{ height: height / 40, width: width / 20 }} />
                </TouchableOpacity>
            </View>
            <Text style={{ fontSize: height / 45, marginVertical: Margin }}>If you have any questions regarding your pay, you can raise a pay query here.</Text>
            <View style={{}}>
                <Input
                    inputContainerStyle={{ paddingHorizontal: height / 95, borderRadius: height / 200, borderBottomWidth: 1, borderColor: 'grey', }}
                    multiline={true}
                    inputStyle={{ textAlignVertical: "top", color: 'black', fontSize: height / 40, height: height / 5, width: width }}
                    value={InputValue} secureTextEntry={false} keyboardAppearance="light"
                    autoCapitalize="none" autoCorrect={false} keyboardType={"default"}
                    returnKeyType={"done"} blurOnSubmit={true} placeholder={'Your Query'}
                    placeholderTextColor={"rgba(0,0,0,0.5)"} onChangeText={(e) => { handleChange(e) }}
                />
                <View style={{}}>
                    <Button
                        title={'SUBMIT'}
                        onPress={onSubmit}
                        titleStyle={{ fontSize: height / 35 }}
                        buttonStyle={{ backgroundColor: '#D2222A', paddingVertical:15, borderRadius: height / 20, }}
                        containerStyle={{}}
                    />
                </View>
            </View>
        </View>
        </View>

    </Overlay>
)
}
