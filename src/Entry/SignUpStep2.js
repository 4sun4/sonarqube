import React, { useRef } from 'react'
import { View, Text, Button, Image, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Dimensions, SafeAreaView } from 'react-native'
import { useState } from 'react';
import { connect } from 'react-redux';
import Colors from '../Util/Colors';

const SignUpStep2 = (props) => {

    const screenwidth = Dimensions.get('window').width
    const screenheight = Dimensions.get('window').height

    const [data, setData] = useState({
        username: '',
        password: '',
        confirmPassword:'',
        iconAnimating: false,
        isPasswordShow: true
    });

    const submit = async() => {
        
        // if (!data.username) {
        //     Alert.alert('Alert','Please enter username')
        //     return false;
        // }

        // if (!data.password) {
        //     Alert.alert('Alert','Please enter password')
        //     return false;
        // }

        props.navigation.navigate('SignUpStep3')
    }

    return (
        <SafeAreaView style={{flex:1}}>
        <View style={styles.container}>
            <ScrollView>
            <KeyboardAvoidingView>
            <Image source={require('../Assets/Icons/BackScreen.png')} style={{ marginTop:-120, marginLeft:-80 }} />
            <Text style={{alignSelf:'center',position:'absolute',zindex:999, marginTop:10, fontSize:18, fontWeight:'600'}}>Step 1 of 2</Text>
            <Text style={{alignSelf:'flex-start',position:'absolute',zindex:999, marginTop:120, fontSize:28, fontWeight:'600'}}>Tell us about yourself</Text>


            <View style={{ width:'100%'}}>
                    <TextInput
                        style={{width:350, height:58, borderWidth:2.0, borderColor:'white',color: Colors.Black, fontSize:18, backgroundColor:'white', paddingHorizontal:5, marginTop:30}}
                        placeholder="  First name"
                        placeholderTextColor='#7A7A7A'
                        textValue={data.username}
                        keyboardShouldPersistTaps
                        onChangeText={(value) => setData({ ...data, username: value })}
                    />
                    <TextInput
                        style={{width:350, height:58, borderWidth:2.0, borderColor:'white',color: Colors.Black, fontSize:18, backgroundColor:'white', paddingHorizontal:5, marginTop:15}}
                        placeholder=" Last name"
                        placeholderTextColor='#7A7A7A'
                        textValue={data.username}
                        keyboardShouldPersistTaps
                        onChangeText={(value) => setData({ ...data, username: value })}
                    />
                    <TextInput
                        style={{width:350, height:58, borderWidth:2.0, borderColor:'white',color: Colors.Black, fontSize:18, backgroundColor:'white', paddingHorizontal:5, marginTop:15}}
                        placeholder="  Mobile number"
                        keyboardType = 'numeric'
                        placeholderTextColor='#7A7A7A'
                        textValue={data.username}
                        keyboardShouldPersistTaps
                        onChangeText={(value) => setData({ ...data, username: value })}
                    />
                    <TextInput
                        style={{width:350, height:58, borderWidth:2.0, borderColor:'white',color: Colors.Black, fontSize:18, backgroundColor:'white', paddingHorizontal:5, marginTop:15}}
                        placeholder="  Street"
                        placeholderTextColor='#7A7A7A'
                        textValue={data.username}
                        keyboardShouldPersistTaps
                        onChangeText={(value) => setData({ ...data, username: value })}
                    />
                    <TextInput
                        style={{width:350, height:58, borderWidth:2.0, borderColor:'white',color: Colors.Black, fontSize:18, backgroundColor:'white', paddingHorizontal:5, marginTop:15}}
                        placeholder="  Suburb"
                        placeholderTextColor='#7A7A7A'
                        textValue={data.username}
                        keyboardShouldPersistTaps
                        onChangeText={(value) => setData({ ...data, username: value })}
                    />
                    <TextInput
                        style={{width:350, height:58, borderWidth:2.0, borderColor:'white',color: Colors.Black, fontSize:18, backgroundColor:'white', paddingHorizontal:5, marginTop:15}}
                        placeholder="  Post code"
                        placeholderTextColor='#7A7A7A'
                        textValue={data.username}
                        keyboardShouldPersistTaps
                        onChangeText={(value) => setData({ ...data, username: value })}
                    />
                    <TextInput
                        style={{width:350, height:58, borderWidth:2.0, borderColor:'white',color: Colors.Black, fontSize:18, backgroundColor:'white', paddingHorizontal:5, marginTop:15}}
                        placeholder="  Country"
                        placeholderTextColor='#7A7A7A'
                        textValue={data.username}
                        keyboardShouldPersistTaps
                        onChangeText={(value) => setData({ ...data, username: value })}
                    />
                <TouchableOpacity 
                    style={{width:screenwidth-60, height:60, backgroundColor:'#D02530', marginTop:30, alignItems:'center', justifyContent:'center', borderRadius:30}}
                    onPress={() => submit()}
                    >
                    <Text style={{color:'white', fontSize:20, fontWeight:'600'}}>CONTINUE</Text>
                </TouchableOpacity>
            </View>
            </KeyboardAvoidingView>
            </ScrollView>
        </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor:'#F6F6F6',
    }   
});

export default SignUpStep2
