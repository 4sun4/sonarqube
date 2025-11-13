import React, { useState } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import MapView, { Marker, ProviderPropType, PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;

const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const JobMap = (props) => {
    const { route, navigation } = props
    const [JobData, setJobData] = useState(null)

    const [region, setRegion] = useState({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    })


    React.useEffect(() => {
        getRouteData()
    }, [route])


    const getRouteData = () => {
        console.log("navigation", navigation, "route testing log", route)
        if (route && route.params) {
            let rout = route.params
            let job = rout.JobData && rout.JobData != "" ? rout.JobData : ""
            let sname = rout.ScreenName && rout.ScreenName != "" ? rout.ScreenName : ""
            setJobData(job)
            if (job && job.latitude) { setRegion({ ...region, latitude: Number(job.latitude), longitude: Number(job.longitude) }) }

        }
    }

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <View style={styles.container}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    loadingEnabled
                    initialRegion={region}>
                    <Marker  coordinate={region}/>
                </MapView>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: height / 1.2
    },
    scrollview: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.8
    },
});

export default JobMap
