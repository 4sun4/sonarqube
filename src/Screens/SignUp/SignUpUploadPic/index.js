import React, { useRef } from 'react';
import { View, Text, Platform, Image, PermissionsAndroid, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Dimensions, SafeAreaView } from 'react-native'
import { useState } from 'react';
import Config from '../../../Util/Config';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Colors from '../../../Util/Colors';
import Types from '../../../redux/Types';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'react-native-flash-message';

import { callUploadMyAvatar } from '../../../Services/Api';
import Loader from '../../../Components/Loader';
import { normalizeSize } from '../../../Util/CommonFun';
const backBtn = require('../../../Assets/Icons/BackScreen.png');
const LogoNew = require('../../../Assets/Icons/LogoNew.png');
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const options = {
  saveToPhotos: true,
  mediaType: 'photo',
  includeBase64: false,
  maxWidth: 300,
  maxHeight: 300,
};

const SignUpUploadPic = props => {
  const [changedPhoto, setChangedPhoto] = useState({});

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector(S => S.loginStatus.loginData.token);
  const [image, setImage] = useState(undefined);
  console.log('image:', image);

  const submit = async () => {
    if (image) {
      var URL = Config().profileUploadMyAvatar;
      let body = {
        changedPhoto: changedPhoto,
      };

      setLoading(true);
      try {
        await callUploadMyAvatar(URL, body, token)
          .then(async res => {
            console.log('Profile res :- ', res);
            setLoading(false);

            if (res) {
              showMessage({
                message: 'Success',
                description: 'Profile Image Uploaded successfully.',
                type: 'success',
              });
              await dispatch({ type: Types.Profile_Upload_My_Avatar, data: res });
              setTimeout(() => { }, 300);
              await goToSignUpCurrentJob();
            }
          })
          .catch(error => {
            setLoading(false);
            console.log('Upload Profile Avatar error :- ', error);
            showMessage({
              message: 'Error',
              description: error,
              type: 'warning',
            });
          });
      } catch (error) {
        console.log('Error', error);
      }
    } else {
      // showMessage({message: 'Error', description: 'You have not uploaded profile image.', type: 'warning'});
      showMessage({
        message: 'Error',
        description: 'Please upload profile picture',
        type: 'warning',
      });
      // await goToSignUpCurrentJob();
    }
  };

  const goToSignUpCurrentJob = async () => {
    props.navigation.navigate('SignUpMyFiles');
  };

  const ChooseOption = () => {
    Alert.alert(
      'Alert',
      'Upload profile image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Gallery',
          onPress: () => getProductImages(true),
        },
        {
          text: 'Camera', onPress: () => {
            if (Platform.OS === 'android') { requestCameraPermission(); }
            else { getProductImages() }
          }
        },

      ],
      { cancelable: false },
    );
  }

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
        getProductImages()
        console.log("You can use the camera");
      }
      else { console.log("Camera permission denied"); }
    } catch (err) { console.warn(err); }
  };

  const getProductImages = async (Gallery) => {
    let methodName = launchImageLibrary
    if (!Gallery) { methodName = launchCamera }
    try {
      methodName(options, (res) => {
        if (res.didCancel) {
          console.log('User cancelled image picker');
        } else if (res.error) {
          console.log('ImagePicker Error: ', res.error);
        } else if (res.customButton) {
          console.log('User tapped custom button: ', res.customButton);
          alert(res.customButton);
        } else {
          let source = res;
          console.log('source:', source);
          let photoData = {
            uri: source.assets[0].uri,
            name: source.assets[0].fileName,
            type: source.assets[0].type,
          };

          setChangedPhoto(photoData);
          setImage({ uri: source.assets[0].uri });
        }
      });
    } catch (error) {
      console.log('captureImage Error', error);
    }
  };


  const BackNextBtn = ({ }) => {
    return (
      <View style={styles.touchCont}>
        <TouchableOpacity
          style={styles.halfBtn}
          onPress={() => props.navigation.goBack()}>
          <Text style={styles.halfText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.halfBtn2} onPress={() => submit()}>
          <Text style={styles.halfText2}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  };


  console.log('image test in upload pic', image);


  return (
    <View style={styles.container}>
      {loading ? <Loader /> : null}

      {/* <Image source={backBtn} style={styles.imgStyle} /> */}
      <View style={styles.view1}>
        <Text style={styles.text}>Upload your profile picture</Text>

        <View style={styles.manView}>

          <Image style={styles.manImg} resizeMode={'cover'}
            source={image ? image : require('../../../Assets/Icons/man.jpg')}></Image>

          <TouchableOpacity onPress={() => ChooseOption()} style={styles.touchCam}>
            <Image style={styles.img} resizeMode={'contain'}
              source={require('../../../Assets/Icons/Camera.png')}></Image>
          </TouchableOpacity>

        </View>
      </View>

      <View style={{ width: screenWidth, position: 'absolute', left: 0, right: 0, bottom: 10 }}>
        <BackNextBtn />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  manView: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: normalizeSize(140),
    height: normalizeSize(140),
    marginTop: 60,
    backgroundColor: '#F6F6F6',
    borderRadius: normalizeSize(280),
  },
  manImg: {
    width: normalizeSize(100),
    height: normalizeSize(100),
    borderRadius: normalizeSize(200),
    alignSelf: 'center',
  },
  touchCam: {
    height: normalizeSize(40),
    width: normalizeSize(40),
    borderRadius: normalizeSize(90),
    // marginLeft: 140,
    zIndex: 999,
    position: 'absolute',
    top: 10,
    right: 10,
    // backgroundColor: '#D02530',
    backgroundColor: '#1c78ba',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: { height: normalizeSize(25), width: normalizeSize(25) },
  touchCont: {
    flexDirection: 'row',
    // marginTop: 30,
    justifyContent: 'space-around',
  },
  halfBtn: {
    width: (screenWidth - 60) / 2.5,
    height: 60,
    backgroundColor: Colors.Trans,
    borderWidth: 1,
    borderColor: Colors.halfBlack,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  halfBtn2: {
    width: (screenWidth - 60) / 2.5,
    height: 60,
    // backgroundColor: '#D02530',
    backgroundColor: '#1c78ba',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  halfText: {
    color: Colors.Black,
    fontSize: normalizeSize(16),
    fontWeight: '600',
  },
  halfText2: {
    color: 'white',
    fontSize: normalizeSize(16),
    fontWeight: '600',
  },
  container: {
    flex: 1,
    // paddingHorizontal: 20,
    backgroundColor: Colors.White,
  },
  imgStyle: {
    marginTop: -70,
    marginLeft: -60,
  },
  view1: {
    flex: 1,
    position: 'absolute',
    alignSelf: 'center',
  },
  view3: {
    height: screenHeight,
    width: '100%',
  },
  text: {
    alignSelf: 'center',
    fontSize: normalizeSize(19),
    marginTop: 40,
    fontWeight: '600',
  },
});

export default SignUpUploadPic;
