import React, { useState } from 'react'
import DocumentPicker from 'react-native-document-picker';
import Loader from './Loader';
import { Alert, Dimensions, Image, StyleSheet, Text, View } from "react-native"
import { TouchableOpacity } from 'react-native'
import { isVideo } from '../Util/CommonFun';
import { showMessage } from 'react-native-flash-message';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const { width, height } = Dimensions.get('window');
const UploadComponent = (props) => {
    const { onSuccessCallback, onFileDeleteCallback } = props

    const [loading, setLoading] = useState(false)
    const [fileData, setFileData] = useState({
        fileName: '',
        fileDoc: ''
    });

    const chooseUploadOptions = () => {
        Alert.alert(
            'Alert',
            'Upload file?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Gallery',
                    onPress: () => chooseFromGallery(),
                },
                {
                    text: 'Camera',
                    onPress: () => {
                        if (Platform.OS === 'android') {
                            requestCameraPermission();
                        } else {
                            getAllImages();
                        }
                    },
                },
            ],
            { cancelable: false },
        );
    };

    const chooseFromGallery = async () => {
        setLoading(true);
        try {
            const resp = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            const res = resp[0];
            console.log('res : ', res);
            console.log('URI : ' + res.uri);
            console.log('Type : ' + res.type);
            console.log('File Name : ' + res.name);
            console.log('File Size : ' + res.size);
            let name = res && res.name ? res.name : '';
            let type = res && res.type ? res.type : '';
            setLoading(false);

            if (isVideo(type) || isVideo(name)) {
                showMessage({
                    message: 'Alert',
                    description: 'Please Select Valid FileType',
                    type: 'warning',
                });
            } else {
                if (res && res.uri) {
                    onFilePickSuccess(res)
                }
            }
        } catch (err) {
            setLoading(false);
            if (DocumentPicker.isCancel(err)) {
            } else {
                showMessage({ message: 'Error', description: err, type: 'warning' });
                throw err;
            }
        }
    };

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "App Camera Permission",
                    message: "Needs access to your camera to update profile image",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                getAllImages()
                console.log("You can use the camera");
            }
            else { console.log("Camera permission denied"); }
        } catch (err) { console.warn(err); }
    };

    const getAllImages = async (Gallery) => {
        let methodName = launchImageLibrary
        if (!Gallery) { methodName = launchCamera }
        setLoading(true)

        methodName(options, (res) => {
            let response = res.hasOwnProperty('assets') ? res.assets[0] : res
            if (response.didCancel) {
                console.log("User cancelled image picker ");
                setLoading(false)

            } else if (response.error) {
                console.log("ImagePicker Error:  ", response.error);
                setLoading(false)

            } else {
                console.log('Profile image  =>  ', response)
                onFilePickSuccess(response)
                setLoading(false)

                let FileSize = 0
                if (response.fileSize) { FileSize = response.fileSize }
                if (FileSize && FileSize > 2500000) {
                    let widthN = 400
                    let heightN = 300
                    if (response.height) { heightN = response.height / 4 }
                    if (response.width) { widthN = response.width / 4 }
                    let Rot = 0
                    if (response.originalRotation) { Rot = response.originalRotation }

                } else {
                    if (response && response.uri) {
                        onFilePickSuccess(response)
                        onFilePickSuccess()
                    }
                }
            }
        });
    }

    const onFilePickSuccess = (responseData) => {
        setFileData({ ...fileData, fileDoc: responseData, fileName: responseData?.name })
        showMessage({ message: 'Success', description: 'Document Picked Successfully.', type: "success" });

        if (onSuccessCallback) {
            onSuccessCallback(responseData)
        }
    }

    const onDelete = () => {
        setFileData(prev => ({ ...prev, fileDoc: "", fileName: "" }))
        if (onFileDeleteCallback) {
            onFileDeleteCallback()
        }
    }
    return (
        <View>
            {loading ? <Loader /> : null}

            {fileData?.fileDoc ?
                <View style={styles.fileNameContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5 }}>
                        <Text style={styles.fileLabel}>{fileData?.fileName}</Text>
                        <TouchableOpacity onPress={onDelete} style={{ flex: 0.15 }}>
                            <Image
                                style={{ width: 24, height: 24, marginHorizontal: 20 }}
                                resizeMode={'contain'}
                                source={require('../Assets/Icons/Delete.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                :
                <>
                    <View style={styles.uploadContainer}>
                        <Image
                            style={{ width: 60, height: 60, marginBottom: 10, tintColor: "#007bbf" }}
                            resizeMode={'contain'}
                            source={require('../Assets/Icons/UploadImage.png')} />
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Upload</Text>
                        <Text style={{ fontSize: 16 }}>Document/Image</Text>
                    </View>
                    <View style={{ marginTop: -60, alignItems: 'center' }}>
                        <TouchableOpacity
                            style={styles.browseButtonWrapper}
                            onPress={() => chooseUploadOptions()}>
                            <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>BROWSE</Text>
                        </TouchableOpacity>
                    </View>
                </>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    fileNameContainer: {
        marginTop: 20,
        borderWidth: 2,
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        },
        elevation: 4,
        borderColor: '#DDD',
        paddingVertical: 10,
        paddingHorizontal: 25,
        backgroundColor: '#FFF'
    },
    fileLabel: {
        color: '#22D2B4',
        fontSize: 18,
        paddingBottom: 5,
        flex: 0.85
    },
    uploadContainer: {
        marginTop: 20,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        paddingTop: 30,
        paddingBottom: 60
    },
    browseButtonWrapper: {
        width: width / 1.5,
        height: 60,
        backgroundColor: '#007bbf',
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20
    }
})
export default UploadComponent