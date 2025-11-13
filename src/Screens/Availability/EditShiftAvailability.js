import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, FlatList } from 'react-native'
const { height, width } = Dimensions.get('window');
const Margin = width / 20


const EditShiftAvailability = () => {
    return (
        <View style={styles.container}>
            <View style={{ flex:1,justifyContent: 'center', alignItems: 'center' }}>

                <Text style={{fontSize:height/40}}>Need Content / Fields</Text>
            </View>

        </View>
    )
}

export default EditShiftAvailability
const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: '#F6F6F6',
    }
});
