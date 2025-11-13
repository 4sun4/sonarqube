import React from "react";
import { TouchableOpacity, View, Image, Dimensions, StatusBar, Text, ImageBackground } from "react-native";
import { Icon, } from 'react-native-elements'
import Colors from "../Util/Colors";
import GlobalInput from "./GlobalInput";

const { height, width } = Dimensions.get('window');
const HeaderIconSize = height / 32

// =================Props of Header===================
const SearchHeader = (props) => {
    let { ChangeText,ClearSearch, Search, BackPress, HolderName, Val, OnSubmit } = props;

    // =================Views===================
    return (
        <View style={{top: -((height / (height / 7)) / 2), width: width, height: height / 8,backgroundColor:Colors.APP_COLOR }}>
        <View style={{ position: 'absolute', bottom: width / 40, flexDirection: 'row', alignItems: 'center', padding: width / 40 }}>
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
                <TouchableOpacity style={{}} onPress={BackPress}>
                    <Icon onPress={BackPress} name="left" type="antdesign" size={height / 32} color={'#fff'} style={{ zIndex: 1 }}  />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 9, backgroundColor: '#fff', borderRadius: height / 90, justifyContent: 'center' }}>

                <GlobalInput
                    RightIcon={
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon onPress={() => ClearSearch()} containerStyle={{ width: width / 18, marginHorizontal: (width / 40) / 2, }} type="entypo" name="cross" color={"#878787"} size={height / 35} />
                            <TouchableOpacity onPress={() =>Search()} style={{ padding: (width / 40) / 2, backgroundColor: Colors.APP_COLOR, borderRadius: height / 120, justifyContent: 'center', alignItems: 'center' }}>
                                <Icon containerStyle={{ width: width / 18 }} type="antdesign" name="search1" color={"#fff"} size={height / 40} />
                            </TouchableOpacity>
                        </View>
                    }

                    Value={Val} AutoCapitalize={"none"} ReturnType={'done'}
                    InputStyle={{ fontSize: height / 50, color: "black", marginLeft: width / 40 }}
                    PlaceholderTextColor={'#d1d3d4'}
                    Placeholder={HolderName}
                    OnChangeText={(name) =>ChangeText(name)}
                    ContainerStyle={{ borderRadius: height / 70 }}
                    InputMainStyle={{ padding: 0, }}
                    inputContainerStyle={{ borderColor: 'transparent', borderWidth: 0, height: height / 20, borderRadius: height / 10 }}
                    OnSubmitEditing={OnSubmit}
                />

            </View>

        </View>
    </View>
    );
}

export default SearchHeader;