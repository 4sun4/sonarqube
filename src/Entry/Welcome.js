import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {normalizeSize} from '../Util/CommonFun';
import { StackActions } from '@react-navigation/native';

const Welcome = props => {
  const LOGO = require('../Assets/Icons/WorkForceWhiteLogo.png');
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 15,
        backgroundColor: '#fff',
        flex: 1,
      }}>
      <View style={{height: 100, flex: 0.9}}>
        <Image
          source={LOGO}
          style={{width: '100%', height: '100%', resizeMode: 'contain'}}
        />
      </View>
      <View style={{flex: 0.4, justifyContent: 'center'}}>
        <TouchableOpacity
          style={[styles.buttonContainer]}
          onPress={() => {
            props.navigation.dispatch(
              StackActions.replace('Login'),
            );
          }}>
          <Text style={[styles.buttonText]}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#1a79ba',
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: normalizeSize(15),
    color: '#FFFFFF',
    fontWeight: '900',
  },
});
