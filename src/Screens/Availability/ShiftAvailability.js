import React from 'react'
import { View, Text, FlatList, Dimensions, StyleSheet, ScrollView } from 'react-native'
import Colors from '../../Util/Colors';
import CommonSwitch from '../../Components/CommonSwitch';
import GlobalInput from '../../Components/GlobalInput';

const { height, width } = Dimensions.get('window');
const Margin = width / 20
const MinMargin = width / 40
let DateJson = [
    { date: '30/05/2020', TimeLabel: {}, notes: '' },
    { date: '30/05/2020', TimeLabel: {}, notes: '' },
    { date: '30/05/2020', TimeLabel: {}, notes: '' },
    { date: '30/05/2020', TimeLabel: {}, notes: '' },
    { date: '30/05/2020', TimeLabel: {}, notes: '' },
    { date: '30/05/2020', TimeLabel: {}, notes: '' },
    { date: '30/05/2020', TimeLabel: {}, notes: '' },

]

const ShiftAvailability = (props) => {
    const [fields, setFields] = React.useState(DateJson)
    const [Bool, setBool] = React.useState(false)

    const toggleChecked = (field, e, i) => {
        let fieldsT = fields[i].TimeLabel
        fieldsT[field] = e
        setBool(!Bool);
    }

    const renderItem = ({ item, index }) => {
        console.log('jkj', item.TimeLabel.hasOwnProperty('switch_Pm') && item.TimeLabel['switch_Pm']);
        return (
            <View style={{ marginTop: height / 50, flex: 1, backgroundColor: '#FFFFFF' }}>
                <View style={{ flex: 1, padding: Margin, }}>
                    <View style={{ flex: 1, justifyContent: 'center', }}>
                        <Text style={{ fontSize: height / 40, fontWeight: '700' }}>{'Tuesday 5 May'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: height / 80 }}>

                        <CommonSwitch Val={item.TimeLabel['switch_Am']} Label={'AM'} onValueChange={(e) => { toggleChecked("switch_Am", e, index) }} />
                        <CommonSwitch Val={item.TimeLabel['switch_Pm']} Label={'PM'} onValueChange={(e) => { toggleChecked("switch_Pm", e, index) }} />
                        <CommonSwitch Val={item.TimeLabel['switch_Nd']} Label={'ND'} onValueChange={(e) => { toggleChecked("switch_Nd", e, index) }} />

                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', marginTop: height / 40 }}>
                        {item.TimeLabel.hasOwnProperty('switch_Pm') && item.TimeLabel['switch_Pm'] ?
                            <View style={styles.BottomBox}>
                                <Text style={{ fontSize: height / 45, lineHeight: 25,color:Colors.ThemeRed }}>Note available for afternoon shift</Text>

                            </View>

                            : <GlobalInput
                                Value={''} AutoCapitalize={"none"} ReturnType={'done'}
                                InputStyle={{ color: Colors.Black,  fontSize: height / 50, }}
                                PlaceholderTextColor={'grey'}
                                Placeholder={`Availability notes`}
                                OnChangeText={name => console.log()}
                                inputContainerStyle={{ paddingHorizontal: height / 95, borderRadius: height / 80, borderWidth: 1, borderColor: Colors.Border }}
                                AutoCapitalize="none" KeyboardType={"default"} ReturnType={"done"} />


                        }
                    </View>

                </View>

            </View>
        )
    }
    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={{ flex: 1, padding: Margin, }}>

                    <View style={styles.topBox}>
                        <Text style={{ fontSize: height / 48, lineHeight: 25 }}>Permanent availability Notes</Text>
                        <Text style={{ fontSize: height / 40, fontWeight: '700', lineHeight: 25 }}>I am not available Wednesday afternoons as have Uni.</Text>

                    </View>
                    <View style={{}}>
                        <FlatList
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                            data={fields}
                            renderItem={renderItem}
                        />
                    </View>

                </View>
            </ScrollView>
        </View>
    )
}

export default ShiftAvailability
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.ThemeBackground,
    },
    topBox: {
        padding: Margin,
        borderWidth: 1,
        borderRadius: height / 90,
        borderColor: Colors.ThemeGreen,
        backgroundColor: Colors.Lt_Green
    },
    BottomBox: {
        padding: Margin/1.2,
        borderWidth: 1,
        borderRadius: height / 90,
        borderColor: Colors.ThemeRed,
        backgroundColor: Colors.Lt_Red,
        justifyContent:'center',
        alignItems:'center'
    },
});