import React, {useState, useEffect, FunctionComponent} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import _, {set} from 'lodash';
import {showMessage} from 'react-native-flash-message';
import {useDispatch, useSelector, useStore} from 'react-redux';
import Colors from '../Util/Colors';
import Config from '../Util/Config';
import {callGetRestApis, CallPostRestApi} from '../Services/Api';
import Loader from '../Components/Loader';
import DropDownPicker from 'react-native-dropdown-picker';

const {height, width} = Dimensions.get('window');

let avtar = require('../Assets/Icons/profile.png');

const Chat = props => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [DATA, setData] = useState([]);
  const [newText, setNewText] = useState('Paste Text Here....');
  const dispatch = useDispatch();
  const Store = useStore();
  const S = Store.getState();
  const Profile_Data = _.get(S.HomeDetails, 'UserDetails', '');
  let profilePic = _.get(S.HomeDetails, 'ProfilePic', undefined);
  let Name = _.get(Profile_Data, 'first_name', '');
  const [DropdownData, setDropdownData] = useState([]);
  const [documentOpen, setDocumentOpen] = useState(false);
  const [documentValue, setDocumentValue] = useState(null);
  const [documentData, setDocumentData] = useState([]);
  const [Value, setValue] = useState('');
  const [userID, setUserID] = useState(0);

  const [UserDescription, setUserDescription] = useState('');

  useEffect(() => {
    getUsersForMessages();
  }, []);

  const handleSelectedDropdownItem = (item, index) => {
    // console.log('---item--', item, index);
    let it = DATA && DATA.length ? DATA[index] : 0;
    setUserID(it.user_id);
  };

  const CallChatApi = async () => {
    setLoading(true);
    callGetRestApis(Config().getCandidateReceivedMessages)
      .then(res => {
        setLoading(false);
        let Data = res;
        if (Data) {
          let chat_data = Data.map(item => ({
            _id: item.message_id,
            text: item.body,
            createdAt: item.created_at ? new Date(item.created_at) : new Date(),
            user: {
              _id: item.from_id,
              name: item.received_from ? item.received_from : 'User',
              avatar: avtar,
            },
          }));
          console.log('chat_data', res);
          setMessages(chat_data);
          setData(chat_data);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log('Get all Chats Api error :- ', error);
        showMessage({message: 'Error', description: error, type: 'warning'});
      });
  };
  const sendChatMessage = async messageText => {
    if (!documentValue) {
      Alert.alert('Alert', 'Please select user');
      return false;
    }
    if (!UserDescription) {
      Alert.alert('Alert', 'Please enter message');
      return false;
    }
    setLoading(true);
    let body = {
      title: documentValue,
      body: UserDescription,
      user_id: userID,
    };
    let url = Config().sendMessage;
    await CallPostRestApi(body, url)
      .then(res => {
        setLoading(false);
        console.log('sendChatMessage res :- ', res);
        showMessage({
          message: 'Success',
          description: res?.message,
          type: 'success',
        });
        props.navigation.navigate('Messages');
      })
      .catch(error => {
        setLoading(false);
        console.log('sendChatMessage error :- ', error);
        showMessage({message: 'Error', description: error, type: 'warning'});
      });
  };

  const getUsersForMessages = async () => {
    let URL = Config().getUsersForMessages_2;
    console.log('URL', URL);
    setLoading(true);
    await callGetRestApis(URL)
      .then(res => {
        setLoading(false);
        if (res && res.length) {
          setData(res);
          let arr = res.map((it, ind) => ({
            id: _.get(it, 'user_id', ''),
            label:
              _.get(it, 'first_name', '') + ' ' + _.get(it, 'last_name', ''),
            value:
              _.get(it, 'first_name', '') + ' ' + _.get(it, 'last_name', ''),
          }));
          setDocumentData(arr);
          console.log('arrarrarr', arr);
        }
        console.log('getUsersForMessages res :- ', res);
      })
      .catch(error => {
        setLoading(false);
        console.log('getUsersForMessages error :- ', error);
        showMessage({message: 'Error', description: error, type: 'warning'});
      });
  };

  return (
    <View style={styles.container}>
      {loading ? <Loader /> : null}

      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView>
          <View style={{marginTop: 30}}>
            <DropDownPicker
              open={documentOpen}
              value={documentValue}
              items={documentData}
              zIndex={1000}
              maxHeight={Config().height / 3}
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
              placeholder="Please select..."
              listItemContainerStyle={{marginVertical: 3}}
              selectedItemLabelStyle={{fontWeight: 'bold'}}
              labelStyle={{fontSize: 16}}
              itemSeparator={true}
              itemSeparatorStyle={{backgroundColor: '#c5baba'}}
              dropDownContainerStyle={{
                backgroundColor: Colors.White,
                borderColor: Colors.Border,
              }}
              placeholderStyle={{
                color: '#7d7979',
                fontSize: 16,
              }}
              style={{
                borderColor: '#c5baba',
                borderWidth: 2,
                borderRadius: 5,
                minHeight: 45,
              }}
              onChangeValue={value => {
                console.log(value);
              }}
              onSelectItem={(item,index)=>{
                setUserID(item?.id);
              }}
            />

            {/* <View style={{ marginTop: 20 }}>
                            <Text style={{ fontSize: height / 43, color: '#808080' }}>Title</Text>
                            <TextInput
                                style={{ borderBottomWidth: 1, borderColor: '#D8D8D8', fontSize: height / 45, paddingVertical: height / 90, color: '#000' }}
                                placeholderTextColor='#7A7A7A'
                                value={Value}
                                keyboardShouldPersistTaps
                                onChangeText={(value) => setValue(value)}
                            />
                        </View> */}
            <View style={{marginTop: 20}}>
              <Text
                style={{
                  fontSize: height / 50,
                  fontWeight: '500',
                  color: '#808080',
                  marginBottom: 10,
                }}>
                Message <Text style={{color: 'red'}}>*</Text>
              </Text>
              <TextInput
                style={{
                  textAlignVertical: 'top',
                  fontSize: 18,
                  borderColor: '#42435b',
                  height: 200,
                  backgroundColor: '#D7DBDD',
                  borderRadius: 7,
                  padding: 10,
                  color: Colors.Black,
                }}
                value={UserDescription}
                onChangeText={value => setUserDescription(value)}
                multiline={true}
                placeholder="  Enter your message"
                underlineColorAndroid="transparent"
                require={true}
              />
            </View>
            <View style={{justifyContent: 'flex-end', marginBottom: 20}}>
              <TouchableOpacity
                onPress={sendChatMessage}
                style={{
                  width: 200,
                  height: 60,
                  backgroundColor: '#007bbf',
                  marginTop: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 20,
                  alignSelf: 'center',
                }}>
                <Text style={{color: 'white', fontSize: 20, fontWeight: '600'}}>
                  Send
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

export default Chat;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
});
