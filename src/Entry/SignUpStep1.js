import React, { useRef } from 'react'
import { View, Text, Button, Image, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Dimensions, Icon } from 'react-native'
// import { COLOR } from '../../Util/constant';
import { CommonInputBox } from '../Components/CommonInputText';
import { useState } from 'react';
import { connect } from 'react-redux';
import { addLoginStatus, addRouteName } from '../redux/CommonAction';
import Colors from '../Util/Colors';

const SignUpStep1 = (props) => {

    const screenwidth = Dimensions.get('window').width
    const screenheight = Dimensions.get('window').height

    const [data, setData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        iconAnimating: false,
        isPasswordShow: true
    });

    const submit = async () => {

        // if (!data.username) {
        //     Alert.alert('Alert','Please enter email address')
        //     return false;
        // }

        // if (!data.password) {
        //     Alert.alert('Alert','Please enter password')
        //     return false;
        // }

        // if (!data.confirmPassword) {
        //     Alert.alert('Alert','Please enter confirm password')
        //     return false;
        // }

        // if(data.password !== data.confirmPassword) {
        //     Alert.alert('Alert','Password and Confirm password didn`t match. Please enter again.')
        //     setData({password:""})
        //     setData({confirmPassword:""})
        //     return false;
        // }

        props.navigation.navigate('SignUpStep2')

    }

    const goToLogin = async () => {
        // props.navigation.navigate("AuthStackScreen", { screen: "Login"});
        props.navigation.navigate("Login");
    };


    return (

        <View style={styles.container}>
            <Image source={require('../Assets/Icons/BackScreen.png')} style={{ marginTop: -70, marginLeft: -60 }} />
            <View style={{ flex: 1, position: 'absolute', alignSelf: 'center' }}>
                <ScrollView>
                    <KeyboardAvoidingView>
                        <Image source={require('../Assets/Icons/LogoNew.png')} style={{ alignSelf: 'center', marginTop: 100 }} />
                        <View style={{ height: screenheight, width: '100%' }}>
                            <Text style={{ alignSelf: 'center', fontSize: 22, marginTop: 60 }}>Looking for work?</Text>
                            <Text style={{ alignSelf: 'center', fontSize: 30, marginTop: 10 }}>Create your account!</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 50 }}>

                                <TextInput
                                    style={{ width: 350, height: 50, borderWidth: 2.0, borderColor: 'white',color: Colors.Black, borderRadius: 30, fontSize: 18, backgroundColor: 'white', paddingHorizontal: 5 }}
                                    placeholder="     Email address"
                                    placeholderTextColor='#7A7A7A'
                                    textValue={data.username}
                                    keyboardShouldPersistTaps
                                    onChangeText={(value) => setData({ ...data, username: value })}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30 }}>
                                <TextInput
                                    style={{ width: 350, height: 50, borderWidth: 2.0, borderColor: 'white',color: Colors.Black, borderRadius: 30, fontSize: 18, backgroundColor: 'white' }}
                                    placeholder="    Password"
                                    placeholderTextColor='#7A7A7A'
                                    textValue={data.password}
                                    secureTextEntry={true}
                                    keyboardShouldPersistTaps
                                    onChangeText={(value) => setData({ ...data, password: value })}
                                />
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30 }}>
                                <TextInput
                                    style={{ width: 350, height: 50, borderWidth: 2.0, borderColor: 'white',color: Colors.Black, borderRadius: 30, fontSize: 18, backgroundColor: 'white' }}
                                    placeholder="    Confirm Password"
                                    placeholderTextColor='#7A7A7A'
                                    textValue={data.password}
                                    secureTextEntry={true}
                                    keyboardShouldPersistTaps
                                    onChangeText={(value) => setData({ ...data, password: value })}
                                />
                            </View>

                            <TouchableOpacity
                                style={{ width: screenwidth - 60, height: 60, backgroundColor: '#D02530', marginTop: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 30 }}
                                onPress={() => submit()}
                            >
                                <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>SIGN UP</Text>
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ marginTop: 15, marginBottom: 15, alignSelf: 'center', fontSize: 17, fontWeight: '400' }}>
                                    Already have an account? </Text>
                                <TouchableOpacity
                                    style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 30 }}
                                    onPress={() => goToLogin()}
                                >
                                    <Text style={{ color: '#D02530', fontSize: 17, fontWeight: '600' }}>  Login</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#F6F6F6',
    }
});

export default SignUpStep1
