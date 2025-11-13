
import React, { useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet, Keyboard, KeyboardAvoidingView, ScrollView, FlatList, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Text } from 'react-native-elements';

import SearchHeader from '../../Components/SearchHeader';

const { height, width } = Dimensions.get("window");
let FlatData = []
export default function SelectData(props) {

    const [RouteName, setRouteName] = useState("")
    const [Type, setType] = useState("")
    const [DataShow, setDataShow] = useState([])
    const [TextVal, setTextVal] = useState("")
    const [Bool, setBool] = useState(false)




    useEffect(() => {
        const { navigation, route } = props;
        console.log("navigation", navigation, "route", route)
        if (route && route.params && route.params.data) {
            FlatData = route.params.data
            setDataShow(route.params.data)
        }
        let routeName = route && route.params && route.params.RouteName ? route.params.RouteName : ""
        let type = route && route.params && route.params.type ? route.params.type : ""
        setType(type)
        setRouteName(routeName)
    }, [])



    const GoToBackScreen = (RouteName, item, val) => {
        console.log(item);
        if (RouteName) {
            props.navigation.navigate(RouteName, { item: item, type: val, RouteName: 'SelectData' })
            // alert(Type)
        }
    }


    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                key={index}
                style={[{ minHeight: height / 10, borderBottomColor: 'rgb(228,228,228)', borderBottomWidth: 2, justifyContent: 'center', }, { marginBottom: DataShow.length - 1 == index ? (width / 40) : 0 }]}
                onPress={() => GoToBackScreen(RouteName, item, Type)}
            >
                <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ alignItems: 'flex-start', width: '100%', justifyContent: 'center' }}>
                        <Text style={{ color: "rgba(0,0,0,0.9)", fontSize: height / 40, }}>{item}</Text>

                    </View>
                </View>
            </TouchableOpacity>
        )
    }




    const handleSearch = () => {
        if (DataShow && DataShow != "") {
            FlatData = []

            FlatData = DataShow
            if (TextVal != "") {
                let searchString = TextVal.trim().toLowerCase();
                if (searchString.length > 0) {

                    FlatData = DataShow.filter(function (i) {
                        console.log("iiiiiiiii", i, TextVal);
                        if (i.toLowerCase().match(searchString)) {
                            return i.toLowerCase().match(searchString);

                        }
                    })


                }
            }
            setBool(!Bool)
        }
    }



    if (TextVal == "") {
        FlatData = DataShow

    }



    const handleRemove = () => {
        setTextVal('')
        Keyboard.dismiss()

    }
    const handleChange = (e) => {
        setTextVal(e)
    }
    return (
        <View style={[{ flex: 1, backgroundColor: '#F1F1F1', }]}>
            <ScrollView>
                <SearchHeader OnSubmit={() => handleSearch()} Search={() => handleSearch()}
                    ClearSearch={() => handleRemove()} type={"Back"} BackPress={() => props.navigation.goBack(null)}
                    HolderName={` Search ${Type}...`} ChangeText={(e) => handleChange(e)} Val={TextVal} />

                {/* <StatusBar backgroundColor={"black"} barStyle="light-content" /> */}
                <View style={{ backgroundColor: 'rgb(228,228,228)', flex: 1, width: width }}>
                    <View style={{ backgroundColor: '#fff', flex: 1, margin: (width / 40), padding: (width / 40), borderRadius: 5, alignItems: 'center' }}>
                        <View style={{ width: width / 1.15, }}>

                            {FlatData && FlatData.length > 0 ?
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={FlatData}
                                    scrollEnabled={false}
                                    renderItem={renderItem}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                                : null
                            }
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
