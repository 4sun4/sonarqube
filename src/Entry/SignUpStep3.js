import React, { useRef } from 'react'
import { View, Text, Button, Image, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Dimensions, SafeAreaView } from 'react-native'
import { useState } from 'react';
import ImagePicker from 'react-native-image-picker';    
import { connect } from 'react-redux';
import Colors from '../Util/Colors';
const options = { saveToPhotos: true, mediaType: 'photo', includeBase64: false, maxWidth: 300, maxHeight: 300 };

const SignUpStep3 = (props) => {

    const screenwidth = Dimensions.get('window').width
    const screenheight = Dimensions.get('window').height

    const [data, setData] = useState({
        userDescription: '',
        iconAnimating: false
    });

    const submit = async() => {
        
        if (!data.username) {
            Alert.alert('Alert','Please enter username')
            return false;
        }

        if (!data.password) {
            Alert.alert('Alert','Please enter password')
            return false;
        }
    }

    const captureImage = async() => {
        ImagePicker.showImagePicker(options, res => {
            console.log('Response = ', res);
      
            if (res.didCancel) {
              console.log('User cancelled image picker');
            } else if (res.error) {
              console.log('ImagePicker Error: ', res.error);
            } else if (res.customButton) {
              console.log('User tapped custom button: ', res.customButton);
              alert(res.customButton);
            } else {
              let source = res;
              this.setState({
                resourcePath: source,
              });
            }
          });
    }


    return (
        <SafeAreaView style={{flex:1}}>
        <View style={styles.container}>
            <ScrollView>
            <KeyboardAvoidingView>
            <Image source={require('../Assets/Icons/BackScreen.png')} style={{ marginTop:-120, marginLeft:-80 }} />
            <Text style={{alignSelf:'center',position:'absolute',zindex:999, marginTop:10, fontSize:18, fontWeight:'600'}}>Step 2 of 2</Text>
            <Text style={{alignSelf:'center',position:'absolute',zindex:999, marginTop:120, fontSize:28, fontWeight:'600'}}>Upload your profile picture</Text>

            <View style={{alignSelf:'center', width:180, height:180, marginTop:50, backgroundColor:'#F6F6F6', borderRadius:90}}>
                <Image 
                    style={{width:120, height:120, borderRadius:60, alignSelf:'center', marginTop:20}}
                    resizeMode={'contain'}
                    source={require('../Assets/Icons/man.jpg')}>
                </Image>
                <TouchableOpacity style={{height:56, width:56,marginLeft:140, zindex:999, position:'absolute', backgroundColor:'#D02530', borderRadius:28, alignItems:'center', justifyContent:'center'}}>
                <Image 
                    style={{height:30, width:30}}
                    resizeMode={'contain'}
                    source={require('../Assets/Icons/Camera.png')}
                ></Image>
                </TouchableOpacity>
            </View>
            <TextInput
                style={{color: Colors.Black,fontSize:18,borderColor:'#42435b', height:200, backgroundColor:'#F6F6F6', borderRadius:7, marginTop:30}}
                textValue={data.userDescription}
                onChangeText={(value) => setData({ ...data, userDescription: value })}
                multiline={true}
                numberOfLines={20}
                placeholder="  Enter short description"
                underlineColorAndroid='transparent'
                require={true}
            />
                <TouchableOpacity style={{width:screenwidth-40, height:60, backgroundColor:'#D02530', marginTop:30, alignItems:'center', justifyContent:'center', borderRadius:30}}>
                    <Text style={{color:'white', fontSize:20, fontWeight:'600'}}>FINISH</Text>
                </TouchableOpacity>
            
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
        backgroundColor:'white',
    }   
});

export default SignUpStep3
