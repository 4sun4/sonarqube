import React, { useRef } from 'react'
import { View, Text, Button, Image, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Dimensions, SafeAreaView } from 'react-native'
import { useState } from 'react';
import ImagePicker from 'react-native-image-picker';
import { connect } from 'react-redux';

const Job = (props) => {

    const screenwidth = Dimensions.get('window').width
    const screenheight = Dimensions.get('window').height

    const [jobTabs, setJobTab] = useState([
        {
            name: 'My Jobs',
            uri: require('../Assets/Icons/SidebarPortfolio.png'),
            navigateUrl: "MyJobs"
        },
        {
            name: 'My Applications',
            uri: require('../Assets/Icons/SidebarPortfolio.png'),
            navigateUrl: ""
        },
        {
            name: 'My Job Alerts',
            uri: require('../Assets/Icons/SidebarPortfolio.png'),
            navigateUrl: ""
        },
        {
            name: 'Search Jobs',
            uri: require('../Assets/Icons/SidebarPortfolio.png'),
            navigateUrl: ""
        }
    ])


    const tabActionBtn = (index, navigateUrl) => {
        // setSelectedTabIndex(index)
        if (navigateUrl!='') {
            props.navigation.navigate(navigateUrl)
        } else {
            alert("Coming soon!!")
        }

    }





    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 30 }}>
                    {
                        jobTabs.length > 0 ? jobTabs.map((item, index) => {

                            return (
                                <TouchableOpacity key={index} style={{ width: '50%' }} activeOpacity={1} onPress={() => tabActionBtn(index, item.navigateUrl)}>

                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: 10, borderRadius: 8, padding: 20, marginTop: 15, borderColor: '#D2222A21', borderWidth: 1 }}>
                                        <Image
                                            style={{ marginBottom: 10, width: 36, height: 36 }}
                                            resizeMode={'contain'}
                                            source={item.uri}
                                        />
                                        <Text style={{ fontSize: 15,textAlign:'center' }}>{item.name}</Text>

                                        {
                                            item.icon
                                        }
                                    </View>

                                </TouchableOpacity>
                            )


                        }) : null
                    }
                </View>


            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: 'white',
    }
});

export default Job
