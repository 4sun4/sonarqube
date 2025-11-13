
import React, { memo } from 'react';
import { View, Text,Dimensions } from 'react-native';
import Styles from '../../Util/Styles';

const { height, width } = Dimensions.get('window');

const Thumb = (props) => {
  const {sliderVal}=props
  console.log('sliderVal',sliderVal);
  return (
      <View>
      <Text style={{fontSize:height/55}}>{sliderVal}Km</Text>
    <View style={[Styles().ThumbRoot,{marginBottom:15}]}/>
    </View>
  );};


export default memo(Thumb);