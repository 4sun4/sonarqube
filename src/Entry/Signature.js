// import React in our code
import React, { createRef, useState } from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableHighlight, Alert, Platform
} from 'react-native';

import SignatureCapture from 'react-native-signature-capture';

const Signature = (props) => {
  const sign = createRef();
  const [isSignature, setIsSignature] = useState(false);

  const saveSign = () => {
    sign.current.saveImage();

  };

  const resetSign = () => {
    sign.current.resetImage();
    setIsSignature(false)
  };

  const _onSaveEvent = (result) => {
    //result.encoded - for the base64 encoded png
    //result.pathName - for the file path name
    const base64Sign = `data:image/png;base64,` + result.encoded;
    if (Platform.OS == "ios") { genericCheck(result, base64Sign) }
    else { genericCheck(isSignature, base64Sign) }

  };


  const genericCheck = (check, base64Sign) => {
    if (check) {
      Alert.alert(
        'Alert',
        'Signature Captured Successfully.',
        [{
          text: 'Ok', onPress: () =>
            props.navigation.navigate("SubmitTimesheet", { base64Sign: base64Sign })
        }],
        { cancelable: false },
      );
    } else {
      alert('Please add signature first.')
    }
  }


  const _onDragEvent = (e) => {
    // This callback will be called when the user enters signature
    console.log('dragged', e);
    setIsSignature(true)
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* <Text style={styles.titleStyle}>
          Please enter your digital signature
        </Text> */}
        <SignatureCapture
          style={styles.signature}
          ref={sign}
          onSaveEvent={_onSaveEvent}
          onDragEvent={_onDragEvent}
          showNativeButtons={false}
          showTitleLabel={false}
          viewMode={'portrait'}
        />
        <View style={{ flexDirection: 'row' }}>
          <TouchableHighlight
            style={styles.buttonStyle}
            onPress={() => {
              resetSign();
            }}>
            <Text>Reset</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.buttonStyle}
            onPress={() => {
              saveSign();
            }}>
            <Text>Save</Text>
          </TouchableHighlight>

        </View>
      </View>
    </SafeAreaView>
  );
};
export default Signature;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleStyle: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  signature: {
    flex: 1,
    borderColor: '#000033',
    borderWidth: 1,
  },
  buttonStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#eeeeee',
    margin: 10,
  },
});