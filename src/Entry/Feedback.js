import React, { useRef } from 'react'
import { View, Text, Button, Image, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Dimensions, SafeAreaView } from 'react-native'
import { useState } from 'react';
import ImagePicker from 'react-native-image-picker';    
import { connect } from 'react-redux';
import Colors from '../Util/Colors';

const Feedback = (props) => {

    const screenwidth = Dimensions.get('window').width
    const screenheight = Dimensions.get('window').height

    const [data, setData] = useState({
        userDescription: '',
        iconAnimating: false
    });


    return (
        <SafeAreaView style={{flex:1}}>
        <View style={styles.container}>
            <ScrollView>
                <KeyboardAvoidingView>
                    <View style={{paddingVertical:30}}>
                        <Text style={{fontSize:16,lineHeight:22}}>Please use the below form to share your feedback with us!</Text>
                        <TextInput
                            style={{color: Colors.Black,fontSize:18,borderColor:'#42435b', height:200, backgroundColor:'#F6F6F6', borderRadius:7, marginTop:30}}
                            textValue={data.userDescription}
                            onChangeText={(value) => setData({ ...data, userDescription: value })}
                            multiline={true}
                            numberOfLines={20}
                            placeholder="  Enter your comments"
                            underlineColorAndroid='transparent'
                            require={true}
                        />
                    
                    </View>
            </KeyboardAvoidingView>
            </ScrollView>
            <View style={{justifyContent:'flex-end',marginBottom:20}}>
                <TouchableOpacity style={{width:screenwidth-40, height:60, backgroundColor:'#D02530', marginTop:30, alignItems:'center', justifyContent:'center', borderRadius:30}}>
                    <Text style={{color:'white', fontSize:20, fontWeight:'600'}}>CONTINUE</Text>
                </TouchableOpacity>
            </View>
        </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor:'white',
    }   
});

export default Feedback
