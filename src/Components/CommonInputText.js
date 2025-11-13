import React from 'react';
import { View, Text, TextInput } from 'react-native';


export const CommonInputBox = (props) => {
    let { icon, placeholederName, textValue, onvalueChange, textStyle, secureTextEntry, edit, keyboardType, maxLength,placeholderTextColor,textcolor,isBorderblack,isAstricSymbol } = props
  
  
  return (
  <View style={{ marginTop: 30, marginLeft: 10, marginRight: 10 }}>
      <View  style={{flexDirection:'row'}}> 
       {<Text style={[textcolor,{
            opacity: textValue.length != 0 ? 1 : 0,
            fontSize: 13,
            
        }]}>{placeholederName.replace('*','')}</Text>}
      {!isAstricSymbol?  <Text style={{color:'red', opacity: textValue.length != 0 ? 1 : 0}}>*</Text>:null}
        </View>
        <View style={{ flexDirection: 'row' }}>
            <TextInput
                editable={edit}
                secureTextEntry={secureTextEntry}
                placeholder={placeholederName}
                placeholderTextColor={placeholderTextColor}
                style={[textStyle,{ paddingBottom: 5,flex:1, borderBottomWidth: 0.5,fontSize:16}]}
                value={textValue}
                selectionColor={placeholderTextColor}
                onChangeText={onvalueChange}
                keyboardType={keyboardType}
                maxLength={maxLength}
            />
        </View>
    </View>
    )
}