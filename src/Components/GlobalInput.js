import React, { Component } from 'react'
import { Input } from "react-native-elements";
import Styles from '../Util/Styles';

export default class GlobalInput extends Component {
    render() {
        const { ContainerStyle, AutoCapitalize, InputStyle,PlaceholderTextColor, OnChangeText, Value,AutoFocus, KeyboardType, Label,
             ReturnType, MaxLength, Ref, InputMainStyle,Placeholder, ErrorMessage, RightIcon, RightText, LeftIcon, inputContainerStyle, SecureTextEntry, OnSubmitEditing, Multiline, DisableEdit } = this.props
        return (
            <Input
                containerStyle={[{ paddingHorizontal:0, },ContainerStyle]}
                autoCapitalize={AutoCapitalize}
                style={[InputMainStyle]}
                inputStyle={[Styles().input_style, InputStyle,]}
                placeholderTextColor={PlaceholderTextColor}
                onChangeText={OnChangeText}
                value={Value}
                keyboardType={KeyboardType}
                multiline={Multiline}
                label={Value ? Label : ''}
                labelStyle={[Styles().LabelStyle,{ height : Label ? 'auto' : 0}]}
                returnKeyType={ReturnType}
                maxLength={MaxLength}
                ref={Ref}
                editable={DisableEdit ? false : true}
                // textAlignVertical="bottom"
                placeholder={Placeholder}
                errorMessage={ErrorMessage}
                errorStyle={Styles().DefaultErrorStyle}
                inputContainerStyle={[inputContainerStyle]}
                rightIcon={RightIcon}
                leftIcon={LeftIcon}
                rightText={RightText}
                autoFocus={AutoFocus}
                secureTextEntry={SecureTextEntry}
                leftIconContainerStyle={Styles().IPIconDefaultContainerStyle}
                rightIconContainerStyle={Styles().IPIconDefaultContainerStyle}
                onSubmitEditing={OnSubmitEditing}
            />
        );
    }
}
