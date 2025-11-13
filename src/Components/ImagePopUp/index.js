import React, { useState, useEffect } from 'react'
import { View, Text, Dimensions, ActivityIndicator } from 'react-native'
import { Icon, Image } from 'react-native-elements';
import Styles from '../../Util/Styles';



const { height, width } = Dimensions.get('window');

export default function ImagePopUp(props) {
    const [ScreenName, setScreenName] = useState('')
    const [ImageHeight, setImageHeight] = useState(0)
    const [ImageWidth, setImageWidth] = useState(0)
    const [loading, setLoading] = useState(true)
    const [Img, setImg] = useState('')

    useEffect(() => {
        getRoute()
    }, [])

    const getRoute = () => {
        console.log('props====', props)
        if (props && props.fileUrl) {
            // getImageSize(props.fileUrl)
            setImg(props.fileUrl)
        }
    }

    const getImageSize = (url) => {
        let ImgUri = url

        let ww = 0
        let hh = 0
        if (url) {
            // ImgUri = Config.IBase + filename;
            Image.getSize(ImgUri, (w, h) => {
                console.log("Realwidth", w, "Realheight", h)

                if (w >= h) {
                    if (w < width - (width / 20) - (width / 40)) {
                        ww = w
                        hh = h
                    }
                    else {
                        ww = width - (width / 20) - (width / 40)
                        hh = ((width - (width / 20) - (width / 40)) * h) / w
                    }
                }
                else {
                    if (h < height / 1.4) {
                        ww = w
                        hh = h
                        if (ww > (width - (width / 20) - (width / 40))) {
                            ww = width - (width / 20) - (width / 40)
                            hh = ((width - (width / 20) - (width / 40)) * h) / w
                        }
                        else {
                            ww = w;
                            hh = h
                        }
                    }
                    else {

                        hh = height / 1.4
                        ww = ((height / 1.4) * w) / h
                        if (ww > (width - (width / 20) - (width / 40))) {
                            ww = width - (width / 20) - (width / 40)
                            hh = ((width - (width / 20) - (width / 40)) * h) / w
                        }
                        else {
                            hh = height / 1.4
                            ww = ((height / 1.4) * w) / h
                        }
                    }
                }
                setImageHeight(hh)
                setImageWidth(ww)

                console.log("width------", ww, "height------", hh)

            });
        }


    }


    return (
        <View style={Styles().IPopUp}>
            <View style={Styles().IPopUpView}>
                {/* <View style={Styles().IPopUpView1}>
                </View> */}
                <View style={Styles().AlcJcc}>
                    <View style={Styles().IPopUpView2}>
                        <View style={Styles().IPopUpView3}>
                            <Icon
                                name="cross"
                                type="entypo"
                                size={height / 25}
                                containerStyle={Styles().IPopUpView4}
                                color={'#fff'}
                                underlayColor="transparent"
                                onPress={props.PressPopUp}
                            />
                        </View>
                        <View
                            style={[{
                                width: width / 1.2,
                                height: height / 2
                                // width: (ImageWidth != 0 ? ImageWidth : (width - (width / 20))),
                                // height: (ImageHeight != 0 ? ImageHeight : (width - (width / 20)))
                            }, Styles().IPopUpView5]}>

                            {Img ?
                                <Image source={{ uri: Img }}
                                    resizeMode='contain'
                                    PlaceholderContent={<ActivityIndicator />}
                                    placeholderStyle={Styles().IPopUpView6}
                                    style={{
                                        width: width / 2,
                                        height: height / 2
                                        // width: ImageWidth != 0 ? ImageWidth : (width - (width / 20) - (width / 40)),
                                        // height: ImageHeight != 0 ? ImageHeight : (width - (width / 20) - (width / 40)),

                                    }}
                                />
                                : null
                            }
                        </View>
                    </View>
                </View>
            </View>
        </View>

    )
}
