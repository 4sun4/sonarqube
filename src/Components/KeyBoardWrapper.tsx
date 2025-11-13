import React from 'react';
import {KeyboardAvoidingView, Platform} from 'react-native';
const KeyBoardWrapper = (props:any) => {
  return <KeyboardAvoidingView style = {{flex:1}} behavior={Platform.OS === "ios" ? 'position' : undefined}>{props.children}</KeyboardAvoidingView>      
};
export default KeyBoardWrapper;