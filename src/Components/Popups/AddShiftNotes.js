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

const AddShiftNotes = (props) => {

    const { visible, toggleOverlay, handleChange, Value, AddNotes, loading, SkipNotes,TimeSt,ClockSt ,handleSkipNotes} = props
    return (
        <Overlay overlayStyle={{ width: width / 1.1 }} isVisible={visible} onBackdropPress={toggleOverlay}>
            <View style={{ padding: MinMargin, }}>

                {loading ? <Loader /> : null}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: height / 32, fontWeight: 'bold' }}>{`Add Shift Notes`}</Text>
                    <TouchableOpacity onPress={toggleOverlay}>
                        <Image source={cross} height={1000} width={500} style={{ height: height / 40, width: width / 20 }} />
                    </TouchableOpacity>
                </View>
                {/* <Text style={{ fontSize: height / 45, marginVertical: Margin, lineHeight: 30 }}>{`You are before the time if you want to add shift notes click save otherwise click skip to clock ${ClockSt}.`}</Text> */}
                <View style={{marginTop:30}}>
                    <Input
                        inputContainerStyle={{ borderRadius: height / 200, borderBottomWidth: 1, borderColor: 'grey', }}
                        multiline={true}
                        inputStyle={{ textAlignVertical: "top", color: 'black', fontSize: height / 40, width: width }}
                        value={Value} secureTextEntry={false} keyboardAppearance="light"
                        autoCapitalize="none" autoCorrect={false} keyboardType={"default"}
                        returnKeyType={"done"} blurOnSubmit={true} placeholder={'Shift notes'}
                        placeholderTextColor={"rgba(0,0,0,0.5)"} onChangeText={(e) => { handleChange(e) }}
                    />
                    <View style={{marginTop:30,flexDirection:"row",alignItems: 'center',justifyContent:"space-between"}}>
                        <Button
                            onPress={()=>handleSkipNotes()}
                            title={'SKIP & CLOCK OUT'}
                            titleStyle={{ fontSize: height / 45 }}
                            buttonStyle={{ backgroundColor: Colors.ThemeBlue, paddingVertical: 10,paddingHorizontal:15, borderRadius: 10, }}
                            containerStyle={{}}
                        />
                         <Button
                            onPress={()=>AddNotes(props.ClockPopUpData)}
                            title={'SUBMIT'}
                            titleStyle={{ fontSize: height / 45 }}
                            buttonStyle={{ backgroundColor: Colors.ThemeRed, paddingVertical: 10,paddingHorizontal:15, borderRadius: 10, }}
                            containerStyle={{}}
                        />
                    </View>
                </View>
            </View>
        </Overlay>
    )
}


export default AddShiftNotes;