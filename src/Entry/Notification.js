import React, { useState } from 'react'
import { View, Text, Alert, PermissionsAndroid, Platform, SafeAreaView, Dimensions, StyleSheet, FlatList, ScrollView } from 'react-native'
import Loader from '../Components/Loader';
import { CallPostRestApi } from '../../Services/Api';
import Colors from '../Util/Colors';
import { showMessage, hideMessage } from "react-native-flash-message";
import moment from 'moment'
import { Icon, CheckBox } from 'react-native-elements'
const { height, width } = Dimensions.get('window');
let Arr = [{ check: true, title: 'e' }, { check: false, title: 'u' }, { check: false, title: 'i' }, { check: false, title: 'p' }, { check: false },]

const Messages = (props) => {
    const [check, setCheck] = useState(false);
    const [MessagesArr, setMessagesArr] = useState(Arr);






    const handleCheckbox = (item) => {
        item.check = !item.check
        setCheck(!check)
    }

    const renderItem = ({ item, index }) => {
        return (
            <View style={{ borderBottomWidth: 1, padding: 20, elevation: 1, borderColor: Colors.Grey59 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <CheckBox
                        onPress={() => handleCheckbox(item)}
                        checked={item.check}
                        checkedColor={Colors.APP_COLOR}
                        containerStyle={{ padding: 0, marginLeft: 0, marginTop: 5 }}
                    />
                    <View style={{ justifyContent: 'flex-start',flex:1 }}>
                        <Text style={{ flex:1,color: Colors.APP_COLOR, fontSize: height / 40, fontWeight: 'bold' }}>Introduction to  javasc</Text>
                        <Text style={{ marginTop: 10 }} numberOfLines={1}>Mon 23 Dec, 2020 at 10:00AM </Text>
                        {item.check ?
                            <Text style={{ marginTop: 10,flex:1 ,textAlign:"justify"}} >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Bibendum est ultricies integer quis. Iaculis urna id volutpat lacus laoreet. Mauris vitae ultricies leo integer malesuada. Ac</Text>
                            : null}
                    </View>

                </View>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ padding: 20 }}>
                <View style={{ marginTop: 20 }}>
                    <FlatList
                        data={MessagesArr}
                        showsVerticalScrollIndicator={false}
                        renderItem={renderItem}
                        keyExtractor={(index) => JSON.stringify(index)}
                    />
                </View>
            </View>
        </View>
    )
}

export default Messages
