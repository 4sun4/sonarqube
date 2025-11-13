import React, { useState } from 'react'
import { View, Text, Image, Dimensions, StatusBar, FlatList, TouchableOpacity } from 'react-native'
import { Overlay, Input, Button } from 'react-native-elements';
import Loader from '../Loader';
const { height, width } = Dimensions.get('window');
const Margin = width / 20
const MinMargin = width / 40
const cross = require('../../Assets/Icons/cross.png')

export default function InjuryonAssignment(props) {

    const { visible, toggleOverlay, handleChange, Value, InjurySubmit, loading } = props
    return (
        <Overlay overlayStyle={{ width: width / 1.1 }} isVisible={visible} onBackdropPress={toggleOverlay}>
            <View style={{ padding: MinMargin, }}>

                {loading ? <Loader /> : null}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: height / 32, fontWeight: 'bold' }}>Injury on Assignment</Text>
                    <TouchableOpacity onPress={toggleOverlay}>
                        <Image source={cross} height={1000} width={500} style={{ height: height / 40, width: width / 20 }} />
                    </TouchableOpacity>
                </View>
                <Text style={{ fontSize: height / 45, marginVertical: Margin, lineHeight: 30 }}>You have not checked the box, "I acknowledge that I have not been injured whilst on assignment." Either check the box indicating that you were not injured on assignment or enter the details of the injury below.</Text>
                <View style={{}}>
                    <Input
                        inputContainerStyle={{ borderRadius: height / 200, borderBottomWidth: 1, borderColor: 'grey', }}
                        multiline={true}
                        inputStyle={{ textAlignVertical: "top", color: 'black', fontSize: height / 40, width: width }}
                        value={Value} secureTextEntry={false} keyboardAppearance="light"
                        autoCapitalize="none" autoCorrect={false} keyboardType={"default"}
                        returnKeyType={"done"} blurOnSubmit={true} placeholder={'Details of Injury'}
                        placeholderTextColor={"rgba(0,0,0,0.5)"} onChangeText={(e) => { handleChange(e) }}
                    />
                    <View style={{}}>
                        <Button
                            onPress={InjurySubmit}
                            title={'SUBMIT'}
                            titleStyle={{ fontSize: height / 35 }}
                            buttonStyle={{ backgroundColor: '#D2222A', paddingVertical: 20, borderRadius: height / 20, }}
                            containerStyle={{}}
                        />
                    </View>
                </View>
            </View>
        </Overlay>
    )
}
