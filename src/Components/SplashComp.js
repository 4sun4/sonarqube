import React, { useRef, useState } from 'react'
import { View, Text, Button, Image, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Dimensions, Icon } from 'react-native'
import Loader from '../Components/Loader';

const Splash = (props) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('../Assets/Icons/BackScreen.png')} style={{ position: 'absolute', top: -90, left: 0, marginLeft: -60 }} />
            <Image source={require('../Assets/Icons/BackScreen.png')} style={{ position: 'absolute', bottom: 0, right: -90, marginBottom: -70, marginLeft: -60 }} />
            <Image source={require('../Assets/Icons/WorkForceWhiteLogo.png')} style={{ alignSelf: 'center', marginTop: 40,width:400,height:200 }} />
        </View>
    )
}
export default Splash
