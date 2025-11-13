import React, { useState } from 'react'
import { View, Text, SafeAreaView, Dimensions, StyleSheet, ScrollView, TextInput } from 'react-native'
import Loader from '../../Components/Loader';
import { connect } from "react-redux";
import { getCurrentTime } from '../../Util/CommonFun';
import Types from '../../redux/Types';
const { height, width } = Dimensions.get('window');

let JobDocuments = 
    {
Client:'Amazon',
job:'ForkLift Driver',
tasks:'tasks',
plant:'plant',
ppe:'PPE',
Substances:'Substances',
Induction:'Induction',
Supervision:'Supervision',
QualificationRequired:'Qualification Required',
ExperienceRequired:'ExperienceRequired',
AdditionalInfo:'AdditionalInfo',
HazardIndentified:'HazardIndentified',
    }

const WHSInfoDetail = (props) => {
    const { route, navigation } = props
    const [loading, setLoading] = useState(false)
    const [JobDetailData, setJobDetailData] = useState(null)
    const [screenName, setScreenName] = useState(null)
    const [data, setData] = useState({ 
        BackData: null,
        tasks:'',
        plant:'',
        ppe:'',
        Substances:'',
        Induction:'',
        Supervision:'',
        QualificationRequired:'',
        ExperienceRequired:'',
        AdditionalInfo:'',
        HazardIndentified:'', 
    });

    let latitude = '', longitude = '', report_to = "", pay_rate = [], address = '',
    company_name = '', job = "", order_id = "", order_status = "", start_date = "",
    finish_date = "", start_time = "", finish_time = ""
console.log("JobDetailData WHS",JobDetailData);

    if (JobDetailData) {
        if (JobDetailData?.latitude) { latitude = JobDetailData?.latitude }
        if (JobDetailData?.longitude) { longitude = JobDetailData?.longitude }
        if (JobDetailData?.report_to) { report_to = JobDetailData?.report_to }
        if (JobDetailData?.pay_rate) { pay_rate = JobDetailData?.pay_rate }
        if (JobDetailData?.address) { address = JobDetailData?.address }
        if (JobDetailData?.company_name) { company_name = JobDetailData?.company_name }
        if (JobDetailData?.job) { job = JobDetailData?.job }
        if (JobDetailData?.order_id) { order_id = JobDetailData?.order_id }
        if (JobDetailData?.order_status) { order_status = JobDetailData?.order_status }
        if (JobDetailData?.start_date) { start_date = JobDetailData?.start_date }
        if (JobDetailData?.finish_date) { finish_date = JobDetailData?.finish_date }
        if (JobDetailData?.start_time) { start_time = JobDetailData?.start_time }
        if (JobDetailData?.finish_time) { finish_time = JobDetailData?.finish_time }

    }

    console.log('JobDetailData',JobDetailData)



    React.useEffect(() => {
        console.log('getCurrentTime()', getCurrentTime());
        const unsubscribe = props.navigation.addListener("focus", async () => {
            getRouteData()
        });
        return unsubscribe;
    }, [route])


    const getRouteData = () => {
        console.log("navigation", navigation, "route testing log", route)
        if (route && route.params) {
            let rout = route.params
            let jobData = rout.JobData && rout.JobData != "" ? rout.JobData : ""
            let whsData = jobData?.whs_info && jobData?.whs_info != "" ? jobData?.whs_info : ""
            let sname = rout.ScreenName && rout.ScreenName != "" ? rout.ScreenName : ""
            console.log(whsData,"whsDatawhsData")
            // let shift_ind = rout.shift_ind ? rout.shift_ind : 0
            // setShiftInd(shift_ind)
            setData({ ...data, 
                BackData: jobData,
                tasks:whsData.tasks??'',
                plant:whsData.plant??'',
                ppe:whsData.ppe??'',
                Substances:whsData.substances??'',
                Induction:whsData.induction??'',
                Supervision:whsData.supervision??'',
                QualificationRequired:whsData.qualifications_required??'',
                ExperienceRequired:whsData.experience_required??'',
                AdditionalInfo:whsData.additional_info??'',
                HazardIndentified:whsData.hazards_identified??'',
             })
            setJobDetailData(jobData ? jobData : null)
            setScreenName(sname)
        }
    }
console.log(data,"WHS data =====================")
    return (

        <SafeAreaView style={{ flex: 1 }}>
            {loading ? <Loader /> : null}
            <View style={styles.container}>
                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                    <View style={{ padding: 20, flex: 1,  }}>

                        <View style={{  flex: 1, }}>
                            <Text style={{ fontSize: height / 45, fontWeight: '700' }}>
                                Client: <Text style={{ fontWeight: 'normal' }}>{company_name ? company_name : ''}</Text>
                            </Text>

                            <Text style={{ fontSize: height / 45, fontWeight: '700', marginTop: 5 }}>
                            Job: <Text style={{ fontWeight: 'normal' }}>{job ? job : ''}</Text>
                            </Text>

                            {data?.tasks != "" && (
                                <>
                                <Text style={[styles.text,{marginTop: 20}]}>
                            Tasks 
                            </Text>
                            <Text style={{ paddingVertical:5, fontSize: height / 45,color: 'black'}}>{data.tasks}</Text>
                            {/* <TextInput
                                editable={false}
                                style={styles.textInput}
                                placeholderTextColor="#7A7A7A"
                                keyboardShouldPersistTaps
                                value={data.tasks}
                                onChangeText={value => setData(prev=>({...prev,tasks:value}))}
                            /> */}
                                </>
                            )}

                            {data.plant != "" && (
                                <View>
                                    <Text style={styles.text}>
                            Plant
                            </Text>
                            <Text style={{ paddingVertical:5, fontSize: height / 45,color: 'black'}}>{data.plant}</Text>
                            {/* <TextInput
                                editable={false}
                                style={styles.textInput}
                                placeholderTextColor="#7A7A7A"
                                keyboardShouldPersistTaps
                                value={data.plant}
                                onChangeText={value => setData(prev=>({...prev,plant:value}))}
                            /> */}
                          
                        </View>
                            )}
                            
                            {data.ppe != "" &&(
                                <View>
                                 <Text style={styles.text}>
                                PPE
                            </Text>
                            <Text style={{ paddingVertical:5, fontSize: height / 45,color: 'black'}}>{data.ppe}</Text>
                            {/* <TextInput
                                editable={false}
                                style={styles.textInput}
                                placeholderTextColor="#7A7A7A"
                                keyboardShouldPersistTaps
                                value={data.ppe}
                                onChangeText={value => setData(prev=>({...prev,ppe:value}))}
                            /> */}
                            </View>   
                            )}
                            
                            {data?.Substances != "" &&(
                                <View>
                                    <View style={{ flexDirection: 'row', marginTop: 2 }}>
                                <Text style={styles.text}>Substances</Text>
                                

                            </View>
                            <Text style={{ paddingVertical:5, fontSize: height / 45,color: 'black'}}>{data.Substances}</Text>
                            {/* <TextInput
                                editable={false}
                                style={styles.textInput}
                                placeholderTextColor="#7A7A7A"
                                keyboardShouldPersistTaps
                                value={data.Substances}
                                onChangeText={value => setData(prev=>({...prev,Substances:value}))}
                            /> */}
                            </View>
                            )}

                            {data.Induction != "" &&(
                                <View>
                                    <View style={{ flexDirection: 'row', marginTop: 2 }}>
                                <Text style={styles.text}>Induction</Text>
                            </View>
                            <Text style={{ paddingVertical:5, fontSize: height / 45,color: 'black'}}>{data.Induction}</Text>
                            {/* <TextInput
                                editable={false}
                                style={styles.textInput}
                                placeholderTextColor="#7A7A7A"
                                keyboardShouldPersistTaps
                                value={data.Induction}
                                onChangeText={value => setData(prev=>({...prev,Induction:value}))}
                            /> */}
                            </View>
                            )}

                            {data.Supervision != "" &&(
                                <View>
                                    <View style={{ flexDirection: 'row', marginTop: 2 }}>
                                <Text style={styles.text}>Supervision</Text>
                            </View>
                            <Text style={{ paddingVertical:5, fontSize: height / 45,color: 'black'}}>{data.Supervision}</Text>
                            {/* <TextInput
                                editable={false}
                                style={styles.textInput}
                                placeholderTextColor="#7A7A7A"
                                keyboardShouldPersistTaps
                                value={data.Supervision}
                                onChangeText={value => setData(prev=>({...prev,Supervision:value}))}
                            /> */}
                            </View>
                            )}

                            {data.QualificationRequired != "" &&(
                                <View>
                                    <View style={{ flexDirection: 'row', marginTop: 2 }}>
                                <Text style={styles.text}>Qualification(s) Required</Text>
                            </View>
                            <Text style={{ paddingVertical:5, fontSize: height / 45,color: 'black'}}>{data.QualificationRequired}</Text>
                            {/* <TextInput
                                editable={false}
                                style={styles.textInput}
                                placeholderTextColor="#7A7A7A"
                                keyboardShouldPersistTaps
                                value={data.QualificationRequired}
                                onChangeText={value => setData(prev=>({...prev,QualificationRequired:value}))}
                            /> */}
                            </View>
                            )}

                            {data.ExperienceRequired != "" &&(
                            <View>
                                    <View style={{ flexDirection: 'row', marginTop: 2 }}>
                                <Text style={styles.text}>Experience Required</Text>
                               </View>
                               <Text style={{paddingVertical:5,  fontSize: height / 45,color: 'black'}}>{data.ExperienceRequired}</Text>
                            {/* <TextInput
                                editable={false}
                                style={styles.textInput}
                                placeholderTextColor="#7A7A7A"
                                keyboardShouldPersistTaps
                                value={data.ExperienceRequired}
                                onChangeText={value => setData(prev=>({...prev,ExperienceRequired:value}))}
                            /> */}
                                    </View>
                            )}

                            {data.AdditionalInfo != "" &&(
                                <View>
                                    <View style={{ flexDirection: 'row', marginTop: 2 }}>
                                <Text style={styles.text}>Additional Info</Text>
                            </View>
                            <Text style={{ paddingVertical:5, fontSize: height / 45,color: 'black'}}>{data.AdditionalInfo}</Text>
                            {/* <TextInput
                                editable={false}
                                style={styles.textInput}
                                placeholderTextColor="#7A7A7A"
                                keyboardShouldPersistTaps
                                value={data.AdditionalInfo}
                                onChangeText={value => setData(prev=>({...prev,AdditionalInfo:value}))}
                            /> */}
                            </View>
                            )}

                            {data.HazardIndentified != ""&&(
                                <View>
                                    <View style={{ flexDirection: 'row', marginTop: 2 }}>
                                <Text style={styles.text}>Hazard Indentified</Text>
                            </View>
                            <Text style={{ paddingVertical:5, fontSize: height / 45,color: 'black'}}>{data.HazardIndentified}</Text>
                            {/* <TextInput
                                editable={false}
                                style={styles.textInput}
                                placeholderTextColor="#7A7A7A"
                                keyboardShouldPersistTaps
                                value={data.HazardIndentified}
                                onChangeText={value => setData(prev=>({...prev,HazardIndentified:value}))}
                            /> */}
                            </View>
                            )}
                            
      </View>
       </View>   
       </ScrollView>           
</View>
        </SafeAreaView>
    )
}

const mapStateToProps = (state) => {
    const { JobStore: { TodayShiftObj } } = state;

    return { TodayShiftObj };
};


const mapDispatchToProps = dispatch => {
    return {

        DispatchClockPopData: data => dispatch({ type: Types.CLOCK_POP_DATA, data: data }),


    };
};
export default connect(mapStateToProps, mapDispatchToProps)(WHSInfoDetail);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#F6F6F6',
        backgroundColor: '#FFF',
    },
    textInput:{
        borderBottomWidth: 2,
        borderColor: '#D8D8D8',
        fontSize: height / 45,
        color: 'black',
        paddingVertical:5,
        backgroundColor: 'white',
        
    },
    text:{ 
        fontSize: height / 45, 
        fontWeight: '700',
        color: '#808080' 
    }
});




// let clockData = {
//     ...item,
//     clock_in_time: new Date(),
//     shift_working_status: Working_status.STARTED,
//     currentLat: Lat,
//     currentLong: Long,
//     note: shiftNotes,
//     week_ending: moment().clone().endOf('isoWeek').format("YYYY-MM-DD")
// }