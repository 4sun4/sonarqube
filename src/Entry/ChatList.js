

import React, { useState, useCallback, useEffect, FunctionComponent } from 'react'
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import {  View, Alert, Keyboard, Text, TouchableOpacity,Image, StyleSheet, SafeAreaView } from 'react-native'
import _, { set } from 'lodash'
import { showMessage } from 'react-native-flash-message'
import { useDispatch, useSelector, useStore } from 'react-redux'
import Colors from '../Util/Colors'
import Config from '../Util/Config'
import { callGetRestApis, CallPostRestApi } from '../Services/Api'
import { useRoute } from '@react-navigation/native'
import Loader from '../Components/Loader'
import Types from '../redux/Types'
import { store } from '../redux/Store'
import moment from 'moment'
import _moment from 'moment-timezone';
import { Icon } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { updateNotificationBadge } from '../Util/CommonFun'
import { getBadgeCountApi } from '../Services/Queries'


let avtar = require('../Assets/Icons/profile.png')

const ChatList = (props) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false)
    const [DATA, setData] = useState([])
    const [newText, setNewText] = useState('Paste Text Here....');
    const dispatch = useDispatch()
    const Store = useStore()
    const S = Store.getState();
    const Profile_Data = _.get(S.HomeDetails, 'UserDetails', '')
    let profilePic = _.get(S.HomeDetails, 'ProfilePic', undefined)
    let Name = _.get(Profile_Data, 'first_name', '')
    const Route = useRoute()
    const insets = useSafeAreaInsets();

    let U_ID = 279

    useEffect(() => {
        CallChatApi();
    }, []);


    const onSend = useCallback((message) => {
        // console.log('message-------', message);
        let msg = store.getState().messageStore.messageData
        Keyboard.dismiss()
        let msgarr = [
            {
                _id: message[0].message_id,
                text: message[0].text,
                createdAt: message[0].createdAt ? new Date(`${moment(message[0].createdAt, "YYYY-MM-DD HH:mm:ss").format('ddd MMM DD YYYY HH:mm:ss')}`) : new Date(),
                user: {
                    _id: message[0].user._id,
                    name: message[0].user.name,
                    avatar: message[0].user.avtar,
                },
            }
        ]
        let abc = [...message, ...msg]
        setMessages(abc)
        sendChatMessage(message)
        dispatch({ type: Types.MESSAGE_TYPE, data: message[0] })
    }, [])

    function countString(str) {
        const re = new RegExp('/', 'g');
        const count = str.match(re).length;
        return count;
    }
    function test(words) {
        var n = words.split("/");
        return n[n.length - 1];
    
    }
    const handleBubblePress = (msg) => {
        if (msg.text.includes('/')) {
            const result = countString(msg.text);
            let last_word=!isNaN(test(msg.text)) 
            // console.log('--------------cccc', result,'abc',last_word);
            if (result == 2&&last_word) {
                // let getNoString = msg?.text ? msg.text.match(/\d+/g) : ''
                let orderid = test(msg.text) ? Number(test(msg.text)) : 0
                props.navigation.navigate('JobDetail', { JobData: { order_id: orderid }, ScreenName: 'ChatList' })
            }

        }
    }

    const renderBubble = (props) => {
        return (
            <TouchableOpacity onPress={() => handleBubblePress(props.currentMessage)}>
                <Bubble
                    {...props}
                    wrapperStyle={{
                        right: {
                            backgroundColor: '#FFFFFF',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingHorizontal: 5,
                            borderWidth:1,
                            borderColor:"#626567",
                            marginRight:10,
                            borderRadius:10
                        },
                        left: {
                            paddingHorizontal: 5,
                            backgroundColor: Colors.blue_2,
                            borderRadius:10,
                            marginLeft:10,
                        }
                    }}
                    touchableProps={{ disabled: true }} // <= put this in to fix!
                    timeTextStyle={{ left: { color: '#000' }, right: { color: '#626567' } }}
                    textStyle={{ right: { color: '#626567', }, left: { color: '#000', } }}
                />
            </TouchableOpacity>
        );
    }

    
    const CallChatApi = async () => {
        console.log('\n--Route.params.Id---',Route.params.Id);
        setLoading(true)
        callGetRestApis(Config().getCandidateReceivedMessages+`?user_id=${Route.params.Id ? Route.params.Id : 0}`)
            .then((res) => {
                setLoading(false)
                let Data = res
                 console.log('Get all Chats Api resp :- ', res)
                if (Data) {
                    let filter_arr = Data.filter((it, ind) => it.from_id == Route.params.Id)
                    // "2022-01-31 21:52:01"
                    let chat_data = Data.map((item) => { 
                        let rr = new Date(moment(item.created_at).add(item.message_type == 'received' ? 1 : 0, 'hours').local().format())
                        let stillUtc = moment.utc(rr).toDate();
                        let local = moment(stillUtc).format('YYYY-MM-DD HH:mm:ss');
                        let createdAtTime=new Date(`${_moment.tz(local, "YYYY-MM-DD HH:mm:ss", 'Australia/Sydney').format()}`);
                        return{
                            _id: item.message_id,
                            text: item.body,
                            //createdAt: item.created_at ? new Date(`${moment(item.created_at, "YYYY-MM-DD HH:mm:ss").format('ddd MMM DD YYYY HH:mm:ss')}`) : new Date(),
                            // createdAt: item.created_at ? new Date(`${_moment.tz(item.created_at, "YYYY-MM-DD HH:mm:ss", 'Australia/Sydney').format()}`) : new Date(),
                            createdAt: item.created_at ? createdAtTime : new Date(),
                            user: {
                                _id: item.message_type == 'received' ? item.message_type : Route.params.Id,//item.from_id,
                                name: item.received_from ? item.received_from : 'User',
                                avatar: item.message_type == 'received' ? avtar : 'VS',
                            },
                        }
                    })
                    let sort_data = chat_data.sort(function (a, b) {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    })
                    dispatch({ type: Types.MESSAGE_DATA, data: sort_data })
                    setMessages(sort_data);
                    getBadgeCountApi()
                }
            })
            .catch((error) => {
                setLoading(false)
                console.log('Get all Chats Api error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })
    }

    const sendChatMessage = async (messageText) => {
        // setLoading(true)
        let body = {
            "title": "",
            "body": messageText.length ? messageText[0].text : 'Hardcorded',
            "user_id": Route.params.Id
        }
        let url = Config().sendMessage
        await CallPostRestApi(body, url)
            .then((res) => {
                console.log('\n--res-----',res);
                // setLoading(false)
                // console.log('sendChatMessage res :- ', res);
               
                // handle read status api here
            })
            .catch((error) => {
                // setLoading(false)
                console.log('sendChatMessage error in ChatList :- ', error)
                //showMessage({ message: 'Error', description: error, type: "warning", });
            })
    }


    const getCandidateSentMessages = async (revieve_data) => {
        let URL = Config().getUsersForMessages
        // console.log('URL', URL);
        setLoading(true)
        callGetRestApis(Config().getCandidateSentMessages)
            .then((res) => {
                console.log('\n---getCandidateSentMessages----',res);
                setLoading(false)
                if (res && res.length) {
                    let filter_arr = res.filter((it, ind) => it.user_id == U_ID)

                    // "Tue Feb 01 2022 11:27:52"
                    let vik = "2022-01-31 11:27:52"
                    let abc = moment(vik, "YYYY-MM-DD HH:mm:ss").format('ddd MMM DD YYYY HH:mm:ss')

                    console.log('\n---abcabc----', abc);
                    let chat_data = filter_arr.map((item) => (
                        {
                            _id: item.message_id,
                            text: item.body,
                            // createdAt: item.created_at ? new Date(`${moment(item.created_at, "YYYY-MM-DD HH:mm:ss").format('ddd MMM DD YYYY HH:mm:ss')}`) : new Date(),
                            createdAt: item.created_at ? new Date(`${_moment.tz(item.created_at, "YYYY-MM-DD HH:mm:ss", 'Australia/Sydney').format()}`) : new Date(),

                            user: {
                                _id: item.user_id,
                                name: item.sent_to ? item.sent_to : 'User',
                                avatar: avtar,
                            },
                        }
                    ))
                    let new_data = [...revieve_data, ...chat_data]
                    let sort_data = new_data.sort(function (a, b) {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    })
                    console.log('sort_data', sort_data, 'filter_arr', filter_arr);
                    setMessages(sort_data)
                    dispatch({ type: Types.MESSAGE_DATA, data: sort_data })

                }
                // console.log('getCandidateSentMessages res :- ', res)
            })
            .catch((error) => {
                setLoading(false)
                console.log('getCandidateSentMessages error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })
    }

    function scrollToBottomComponent() {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Icon
                    size={30}
                    color={Colors.Theme_D_Grey}
                    type={'ionicon'}
                    name={"chevron-down-outline"}
                />
            </View>
        );
    }
    const avatarComponent = (props) => {
        let userName = _.get(Profile_Data, 'first_name', '') + " " + _.get(Profile_Data, 'last_name', '');
        console.log(userName,Profile_Data,"props.currentMessage",props.currentMessage,"Route.params",Route.params)
        if (props && props.currentMessage && props.currentMessage.user._id == Route.params.Id) {
            return (
                <View style={styles.avatarView}>
                    <Text>{typeof userName === "string"? userName && userName.match(/\b([A-Za-z0-9])/g).join('').toUpperCase():''}</Text>
                </View>
            );
        }
        else {
            return (
                <View style={[styles.avatarView,{borderWidth:0,backgroundColor:Colors.blue_2}]}>
                    <Text>{Route.params.name}</Text>
                </View>
            );
        }
    }
    const customtInputToolbar = props => {
        return (
          <InputToolbar
            {...props}
            containerStyle={{
              backgroundColor: "#d9d9d9",
            }}
          />
        );
      };
    return (
        <View style={{ flex: 1, backgroundColor: "#d9d9d9"}}>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#d9d9d9",bottom:insets.bottom }}>
            {loading ? <Loader /> : null}
            <Text style={[styles.userText,{top:insets?.top > 10 ? 40:15}]}>{Route?.params?.fullName}</Text>
            <GiftedChat
                messages={messages}
                onSend={onSend}
                // isTyping={true}
                user={{ _id: Route.params.Id, name: Name, avatar: '' }}
                placeholder={'Type your message'}
                
                alwaysShowSend
                showUserAvatar
                renderBubble={renderBubble}
                messagesContainerStyle={{ paddingVertical: 20,backgroundColor:"white" }}
                // renderAvatarOnTop={true}
                scrollToBottom
                scrollToBottomComponent={scrollToBottomComponent}
                renderAvatar={avatarComponent}
                // onPressAvatar={(e)=>console.log('--------------',e)}
                onPress={(context, message) => {
                    Alert.alert('Bubble pressed');
                }}
                renderInputToolbar={customtInputToolbar}
            />
            </SafeAreaView>
        </View>
    )

}

export default ChatList;

const styles = StyleSheet.create({
    avatarView: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        height: 32,
        width: 32,
        backgroundColor: "#fff",
        borderWidth:1
    },
    userText:{
        position:"absolute",
        // top:40,
        zIndex:1000,
        left:0,right:0,
        textAlign:"center",
        fontSize:15,
        fontWeight:"500"
    }
})
