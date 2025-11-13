import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Text, Alert, Image, Share, TouchableOpacity } from 'react-native';
let deviceWidth = Dimensions.get('window').width;
import { persistStore } from 'redux-persist';

import {
    DrawerItem,
    DrawerContentScrollView,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';

import { useDispatch, useSelector } from 'react-redux';
import { callGetRestApis, CallPostRestApi } from '../Services/Api'
import Types from '../redux/Types';
import { store } from '../redux/Store';
import Config from '../Util/Config';
import { Icon } from 'react-native-elements'
import { updateNotificationBadge } from '../Util/CommonFun';
import { Badge } from 'react-native-elements'

let ID = 0
let UserData = ''
export const persistor = persistStore(store);

export function DrawerContent(props) {
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)

    const UserDetail = useSelector(S => { let D = ''; if (S && S.HomeDetails && S.HomeDetails.UserDetails && Object.keys(S.HomeDetails.UserDetails).length != 0) { D = S.HomeDetails.UserDetails; if (D) { UserData = D } } })
    const UserToken = useSelector(S => S && S.loginStatus && S.loginStatus.loginData && Object.keys(S.loginStatus.loginData).length != 0 && S.loginStatus.loginData.token ? S.loginStatus.loginData.token : '')
    const ProfilePic = useSelector(S => S && S.HomeDetails && S.HomeDetails.ProfilePic ? S.HomeDetails.ProfilePic : '')
    const facilityName = useSelector(S=> S.loginStatus.facility)
    const unReadMsgCount = useSelector(S => S && S.HomeDetails && S.HomeDetails.unreadMessageCount ? S.HomeDetails.unreadMessageCount : 0)

    useEffect(() => {

        const unsubscribe = props.navigation.addListener("focus", () => {

        });
        return unsubscribe;
    }, []);



    const deleteData = () => {
        Alert.alert('Logout', 'Do you want to Logout?',
            [{ text: 'Cancel', onPress: () => props.navigation.toggleDrawer(), style: 'cancel', },
            { text: 'Confirm', onPress: () => { handleLogout(); props.navigation.toggleDrawer() } },
            ], { cancelable: false });
    }

    const deleteAccount = () => {
        Alert.alert('Delete Account', 'Are you sure you want to delete your account?',
            [{ text: 'Cancel', onPress: () => props.navigation.toggleDrawer(), style: 'cancel', },
            { text: 'Confirm', onPress: () => { handleAccountDelete(); props.navigation.toggleDrawer() } },
            ], { cancelable: false });
    }



    const handleLogout = async () => {
        try {
            await AsyncStorage.clear()
            dispatch({ type: Types.LOGIN_STATUS, data: null })
            dispatch({ type: Types.LOG_OUT, data: null })
            dispatch({ type: Types.NEWUSER, data: null });
            updateNotificationBadge(0)
            props.navigation.dispatch(
                StackActions.replace("AuthStackScreen", { screen: "Login" })
            )

        } catch (error) {
            console.log(error)
        }
    }


    const clearUserData = async () => {
        try {
            await AsyncStorage.clear()
            dispatch({ type: Types.LOGIN_STATUS, data: null })
            dispatch({ type: Types.LOG_OUT, data: null })
            dispatch({ type: Types.NEWUSER, data: null });

            Alert.alert("Delete Account","Your account has been deleted.")

            props.navigation.dispatch(
                StackActions.replace("AuthStackScreen", { screen: "Login" })
            )
        } catch (error) {
            console.log(error)
        }
    }

    const handleAccountDelete = async () => {

        setLoading(true)
        let body = {}
        let url = Config().deleteAccount
        await CallPostRestApi(body,url)
            .then((res) => {
                setLoading(false)
                clearUserData();
            })
            .catch((error) => {
                setLoading(false)
            })
    }



    let name = ''
    if (UserData) {
        if (UserData.first_name) { name = UserData.first_name }
        if (UserData.last_name) { name = name + ' ' + UserData.last_name }
    }

    return (
        <DrawerContentScrollView {...props} style={{backgroundColor: "#E0E0E0"}} >
            <View style={{ backgroundColor: "#e4e4e4", flex: 1, justifyContent: 'flex-start', width: '100%' }}>
                <View style={{ flexDirection:'row', marginLeft: 20, marginRight: 20, alignItems: "flex-start", paddingTop: 10, paddingBottom: 20, marginBottom: 10, borderBottomColor: "#c3b6b7", borderBottomWidth: 2 }}>
                    <View style={{ padding: 20, backgroundColor: "#DCDCDC", borderRadius: 100, width: 60, height: 60, marginBottom: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            style={{ width: 40, height: 40, borderRadius: 100, }}
                            resizeMode={'cover'}
                            source={!UserToken ? require('../Assets/Icons/man.jpg') : ProfilePic ? { uri: ProfilePic } : require('../Assets/Icons/man.jpg')} />

                    </View>
                    <View style={{ flex:1,alignItems: "flex-start", paddingTop: 10,paddingLeft:20 }}>
                        <Text style={{ fontSize: 16, fontWeight: "bold", paddingTop: 3, paddingBottom: 10 }}>
                            {name}
                        </Text>
                        <Text style={{ fontSize: 16 }}>
                            {facilityName}
                        </Text>
                    </View>
                </View>

                <DrawerItem
                    icon={({ color, size }) => (

                        <Icon
                            name='home-outline'
                            type='ionicon'
                            color='#EFB2B5'
                            size={16}
                        />

                    )}
                    label={
                        () => (
                            <View style={{ flex: 1, flexDirection: "row", width: deviceWidth / 2, alignItems: "center", justifyContent: "space-between" }}>
                                <Text style={{ fontSize: 16 }}>Home</Text>
                                {/* <Image
                                    style={{ width: 8, height: 14, }}
                                    resizeMode={'contain'}
                                    source={require('../Assets/Icons/ArrowFwd.png')} /> */}
                            </View>

                        )
                    }
                    onPress={() => { props.navigation.navigate("Home",{screen:"Home"}) }}
                />

                <DrawerItem
                    icon={({ color, size }) => (
                        <Image
                            style={{ width: 16, height: 20 }}
                            resizeMode={'contain'}
                            source={require('../Assets/Icons/SidebarUser.png')} />
                    )}
                    label={
                        () => (
                            <View style={{ flex: 1, flexDirection: "row", width: deviceWidth / 2, alignItems: "center", justifyContent: "space-between" }}>
                                <Text style={{ fontSize: 16 }}>My Profile</Text>

                                {/* <Image
                                    style={{ width: 8, height: 14, }}
                                    resizeMode={'contain'}
                                    source={require('../Assets/Icons/ArrowFwd.png')} /> */}
                            </View>

                        )
                    }
                    onPress={() => { props.navigation.navigate("Profile",{screen:"Profile"}) }}
                />
                <DrawerItem
                    icon={({ color, size }) => (
                        <Image
                            style={{ width: 16, height: 20 }}
                            resizeMode={'contain'}
                            source={require('../Assets/Icons/SidebarDate.png')} />
                    )}
                    label={
                        () => (
                            <View style={{ flex: 1, flexDirection: "row", width: deviceWidth / 2, alignItems: "center", justifyContent: "space-between" }}>
                                <Text style={{ fontSize: 16 }}>My Leave & Availability</Text>
                                {/* <Image
                                    style={{ width: 8, height: 14, }}
                                    resizeMode={'contain'}
                                    source={require('../Assets/Icons/ArrowFwd.png')} /> */}
                            </View>

                        )
                    }
                    onPress={() => { props.navigation.navigate("Availability") }}
                />
                {/* <DrawerItem
                    icon={({ color, size }) => (
                        <Image
                            style={{ width: 16, height: 20 }}
                            resizeMode={'contain'}
                            source={require('../Assets/Icons/SidebarWallClock.png')} />
                    )}
                    label={
                        () => (
                            <View style={{ flex: 1, flexDirection: "row", width: deviceWidth / 2, alignItems: "center", justifyContent: "space-between" }}>
                                <Text style={{ fontSize: 16 }}>Timesheets</Text>
                                
                            </View>

                        )
                    }
                    onPress={() => { props.navigation.navigate("Timesheet") }}
                /> */}
                <DrawerItem
                    icon={({ color, size }) => (
                        <Image
                            style={{ width: 16, height: 20 }}
                            resizeMode={'contain'}
                            source={require('../Assets/Icons/SidebarPortfolio.png')} />
                    )}
                    label={
                        () => (
                            <View style={{ flex: 1, flexDirection: "row", width: deviceWidth / 2, alignItems: "center", justifyContent: "space-between" }}>
                                <Text style={{ fontSize: 16 }}>Roster</Text>
                                {/* <Image
                                    style={{ width: 8, height: 14, }}
                                    resizeMode={'contain'}
                                    source={require('../Assets/Icons/ArrowFwd.png')} /> */}
                            </View>

                        )
                    }
                    onPress={() => { props.navigation.navigate("Roster") }}
                />
                <DrawerItem
                    icon={({ color, size }) => (
                        <Image
                            style={{ width: 16, height: 20 }}
                            resizeMode={'contain'}
                            source={require('../Assets/Icons/SidebarBill.png')} />
                    )}
                    label={
                        () => (
                            <View style={{ flex: 1, flexDirection: "row", width: deviceWidth / 2, alignItems: "center", justifyContent: "space-between" }}>
                                <Text style={{ fontSize: 16 }}>Payslips</Text>
                                {/* <Image
                                    style={{ width: 8, height: 14, }}
                                    resizeMode={'contain'}
                                    source={require('../Assets/Icons/ArrowFwd.png')} /> */}
                            </View>

                        )
                    }
                    onPress={() => { props.navigation.navigate("PaySlip") }}
                />
                <DrawerItem
                    icon={({ color, size }) => (
                        <Image
                            style={{ width: 16, height: 20 }}
                            resizeMode={'contain'}
                            source={require('../Assets/Icons/SidebarMessenger.png')} />
                    )}
                    label={
                        () => (
                            <View style={{ flex: 1, flexDirection: "row", width: deviceWidth / 2, alignItems: "center", justifyContent: "space-between" }}>
                                <View style={{flexDirection:"row"}}>
                                    <Text style={{ fontSize: 16 }}>Messages</Text>
                                  {unReadMsgCount != 0?
                                    <Badge value={unReadMsgCount} status="error" containerStyle={{marginLeft:5}}/>
                                :null}
                              </View>
                                {/* <Image
                                    style={{ width: 8, height: 14, }}
                                    resizeMode={'contain'}
                                    source={require('../Assets/Icons/ArrowFwd.png')} /> */}
                            </View>

                        )
                    }
                    onPress={() => { props.navigation.navigate("Messages") }}
                />
                <DrawerItem
                    icon={({ color, size }) => (
                        <Image
                            style={{ width: 16, height: 20 }}
                            resizeMode={'contain'}
                            source={require('../Assets/Icons/SidebarInformation.png')} />
                    )}
                    label={
                        () => (
                            <View style={{ flex: 1, flexDirection: "row", width: deviceWidth / 2, alignItems: "center", justifyContent: "space-between" }}>
                                <Text style={{ fontSize: 16 }}>About Us</Text>
                                {/* <Image
                                    style={{ width: 8, height: 14, }}
                                    resizeMode={'contain'}
                                    source={require('../Assets/Icons/ArrowFwd.png')} /> */}
                            </View>

                        )
                    }
                    onPress={() => { props.navigation.navigate("About") }}
                />
                <DrawerItem
                    icon={({ color, size }) => (
                        <Image
                            style={{ width: 16, height: 20 }}
                            resizeMode={'contain'}
                            source={require('../Assets/Icons/SidebarCall.png')} />
                    )}
                    label={
                        () => (
                            <View style={{ flex: 1, flexDirection: "row", width: deviceWidth / 2, alignItems: "center", justifyContent: "space-between" }}>
                                <Text style={{ fontSize: 16 }}>Contact Us</Text>
                                {/* <Image
                                    style={{ width: 8, height: 14, }}
                                    resizeMode={'contain'}
                                    source={require('../Assets/Icons/ArrowFwd.png')} /> */}
                            </View>

                        )
                    }
                    onPress={() => { props.navigation.navigate("Contact") }}
                />
                <DrawerItem
                    icon={({ color, size }) => (
                        <Image
                            style={{ width: 16, height: 20 }}
                            resizeMode={'contain'}
                            source={require('../Assets/Icons/SidebarSwitch.png')} />
                    )}
                    label={
                        () => (
                            <View style={{ flex: 1, flexDirection: "row", width: deviceWidth / 2, alignItems: "center", justifyContent: "space-between" }}>
                                <Text style={{ fontSize: 16 }}>Logout</Text>
                                {/* <Image
                                    style={{ width: 8, height: 14, }}
                                    resizeMode={'contain'}
                                    source={require('../Assets/Icons/ArrowFwd.png')} /> */}
                            </View>

                        )
                    }
                    onPress={deleteData}
                />

                <View>
                </View>
            </View>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 0,
    },
    title: {
        marginTop: 0,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});
