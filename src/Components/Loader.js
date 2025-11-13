import React from "react";
import { ActivityIndicator, View } from "react-native";
import Colors from '../Util/Colors'
import Styles from '../Util/Styles'

//Loader Component
const Loader = (props) => {
  return (
    <View style={[Styles().LoaderCont, props.viewStyle]}>
      <View style={Styles().LoaderCircle}>
      <ActivityIndicator size="large" color={'#1c78ba'} />
      </View>
    </View>
  );
}
export default Loader;