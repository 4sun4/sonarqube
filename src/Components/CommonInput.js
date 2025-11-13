import React from "react";
import { View } from "react-native";
import { Input } from 'react-native-elements'
import Colors from "../Util/Colors";
import Styles from "../Util/Styles";

// =================Props of Input===================
const CommonInput = (props) => {
  let { placeholder, label, editable, value, multiline, secureTextEntry, autoCapitalize, labelStyle,
    placeholderTextColor, inputStyle, inputContainerStyle, leftIconContainerStyle, leftIcon, rightIcon,
    errorMessage, onChangeText, onSubmitEditing, maxLength, keyboardType, returnKeyType, inputRef } = props;

  // =================Button===================
  return (
    // <View style={Styles().mt80}>
    <Input
      ref={inputRef}
      placeholder={placeholder}
      label={label}
      editable={editable}
      value={value}
      multiline={multiline ? multiline : false}
      secureTextEntry={secureTextEntry ? secureTextEntry : false}
      blurOnSubmit={true}
      autoCorrect={false}
      maxLength={maxLength}
      keyboardType={keyboardType}
      returnKeyType={returnKeyType}
      autoCapitalize={autoCapitalize ? autoCapitalize : "none"}
      keyboardAppearance="light"
      labelStyle={[Styles().InputLabel, labelStyle]}
      placeholderTextColor={placeholderTextColor ? placeholderTextColor : Colors.IText}
      errorStyle={Styles().InputError}
      errorMessage={errorMessage}
      leftIcon={leftIcon}
      leftIconContainerStyle={[Styles().InputLIcon, leftIconContainerStyle]}
      inputContainerStyle={[Styles().InputCont, inputContainerStyle]}
      inputStyle={[Styles().InputStyle, inputStyle]}
      rightIcon={rightIcon}
      onSubmitEditing={onSubmitEditing}
      onChangeText={onChangeText}
    />
    // </View>
  );
}


export default CommonInput;