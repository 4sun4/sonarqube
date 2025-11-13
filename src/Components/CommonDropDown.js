import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from "react-native"
import DropDownPicker from "react-native-dropdown-picker";
import appConfig from "../Util/Config";
import Colors from "../Util/Colors";

const CommonDropDown = (props) => {
    const { dropDownData, dropdownTitle, defaultValue, onSelectItem, placeholder = "Please select...", zIndex } = props

    const [documentOpen, setDocumentOpen] = useState(false);
    const [documentValue, setDocumentValue] = useState(null);
    const [documentData, setDocumentData] = useState([]);

    useEffect(() => {
        if (defaultValue) {
            setDocumentValue(defaultValue)
        }
        if(dropDownData){
            setDocumentData(dropDownData)
        }
    }, [defaultValue,dropDownData])

    return (
        <View>
            <Text style={styles.dropDownTitle}>{dropdownTitle}</Text>
            <DropDownPicker
                open={documentOpen}
                value={documentValue}
                items={documentData}
                zIndex={zIndex}
                maxHeight={appConfig().height / 3}
                setOpen={val => {
                    setDocumentOpen(val);
                }}
                scrollViewProps={{
                    nestedScrollEnabled: true,
                }}
                autoScroll={true}
                setValue={setDocumentValue}
                setItems={setDocumentData}
                listMode="SCROLLVIEW"
                placeholder={placeholder}
                listItemContainerStyle={{ marginVertical: 3 }}
                selectedItemLabelStyle={{ fontWeight: 'bold' }}
                labelStyle={{ fontSize: 16 }}
                itemSeparator={true}
                itemSeparatorStyle={{ backgroundColor: '#c5baba' }}
                dropDownContainerStyle={styles.dropDownContainer}
                placeholderStyle={styles.placeholderStyle}
                style={styles.dropdown}
                onSelectItem={(item) => {
                    if (onSelectItem) {
                        onSelectItem(item)
                    }
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    dropDownTitle: {
        fontSize: 15,
        fontWeight: "500",
        color: '#808080',
        marginTop: 10,
        marginBottom: 10
    },
    dropdown: {
        borderColor: '#c5baba',
        borderWidth: 2,
        borderRadius: 5,
        minHeight: 45,
        marginBottom: 20
    },
    dropDownContainer: {
        backgroundColor: Colors.White,
        borderColor: Colors.Border
    },
    placeholderStyle: {
        color: '#7d7979',
        fontSize: 16
    }
})
export default CommonDropDown