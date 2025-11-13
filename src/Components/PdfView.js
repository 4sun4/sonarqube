import React, { useState, useEffect } from 'react'
import { View, Text, Dimensions, StyleSheet, ScrollView, Image } from 'react-native'
import Styles, { Margin, MinMargin } from '../Util/Styles'
import Pdf from 'react-native-pdf';
import Config from '../Util/Config'
import { CapitalizeName, isImage } from '../Util/CommonFun'
import Loader from './Loader'
import moment from 'moment'
import RNFetchBlob from 'rn-fetch-blob';
import { useDispatch, useSelector } from 'react-redux'
import { WebView } from 'react-native-webview';

const { height, width } = Dimensions.get('window');


export default function PdfView(props) {
    const [Title, setTitle] = useState('')
    const [ScreenName, setScreenName] = useState('')
    const [DetailData, setDetailData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [ImageBase64, setImageBase64] = useState('')

    const UserToken = useSelector(S => S && S.loginStatus && S.loginStatus.loginData && Object.keys(S.loginStatus.loginData).length != 0 && S.loginStatus.loginData.token ? S.loginStatus.loginData.token : '')



    useEffect(() => {
        getRoute()
    }, [])

    const getRoute = () => {
        const { navigation, route } = props;
        console.log("navigation", navigation, "route", route)
        if (route && route.params) {
            let rout = route.params
            let title = rout.HeaderTitle && rout.HeaderTitle != "" ? rout.HeaderTitle : ""
            let sname = rout.ScreenName && rout.ScreenName != "" ? rout.ScreenName : ""
            if (route.params.data) {
                let data = route.params.data
                setDetailData(data)
                uploadImageFun(data)
                if (data.filename && !isImage(data.filename)) {
                    setTimeout(() => {
                        setLoading(false)
                    }, 4000);
                } else { setLoading(false) }
            }
            setTitle(title)
            setScreenName(sname)
        }

    }




    const uploadImageFun = (item) => {
        setLoading(true)
        return new Promise((RESOLVE, REJECT) => {
            // Fetch attachment
            RNFetchBlob.fetch('GET', Config().downloadComplianceDocument + `?compliance_id= ${item.compliance_id}`,
                { Authorization: `Bearer ${UserToken}` })
                .then((response) => {
                    let base64Str = response.data;
                    const imageBase64 = `data:${item.filetype};base64,` + base64Str;

                    console.log('base64Str', base64Str);
                    // Return base64 image
                    setImageBase64(imageBase64)
                    RESOLVE(imageBase64)
                    setLoading(false)
                })

        }).catch((error) => {
            // error handling
            console.log("Error: ", error)
            setLoading(false)
        });

    }



    const source = { uri: ImageBase64, cache: true };

    return (
        <View style={Styles().Container}>
            {loading ? <Loader /> :
                <>
                    <View style={Styles().PdfView}>
                        <Text style={Styles().PdfViewTitle}>{Title ? CapitalizeName(Title) : ""}</Text>
                        <>

                       
                        {/* <WebView source={{ uri: `http://docs.google.com/gview?embedded=true&url=${ImageBase64}` }} /> */}


                            <Pdf
                                source={source}

                                // source={{ uri: Src }}
                                onLoadComplete={(numberOfPages, filePath) => {
                                    console.log(`number of pages: ${numberOfPages}`);
                                }}
                                onPageChanged={(page, numberOfPages) => {
                                    console.log(`current page: ${page}`);
                                }}
                                onError={(error) => {
                                    console.log(error);
                                }}
                                onPressLink={(uri) => {
                                    console.log(`Link presse: ${uri}`)
                                }}
                                style={Styles().fl1} />

                        </>

                    </View>


                </>
            }
        </View>
    )
}
