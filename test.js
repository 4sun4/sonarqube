import React, { useState, useCallback, useEffect, FunctionComponent } from 'react'
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import { StyleSheet, Dimensions, View, Alert, Keyboard, Text } from 'react-native'
import _, { set } from 'lodash'
import { showMessage } from 'react-native-flash-message'
import { useDispatch, useSelector, useStore } from 'react-redux'
import Colors from '../Util/Colors'
import Config from '../Util/Config'
import { callGetRestApis, CallPostRestApi } from '../Services/Api'


let avtar = require('../Assets/Icons/profile.png')

const Chat = (props) => {
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


    useEffect(() => {
        CallChatApi();
    }, []);


    const onSend = useCallback((message) => {
        // let msg = store.getState().messageStore.messageData
        Keyboard.dismiss()
        // let abc = [...message, ...msg]
        setMessages(message)
        sendChatMessage(message)
        // dispatch({ type: Type.MESSAGE_TYPE, data: message[0] })
    }, [])


    const renderBubble = (props) => {
        return (
            <View >
                <Bubble
                    {...props}
                    wrapperStyle={{
                        right: {
                            backgroundColor: '#FFFFFF',
                            justifyContent: 'center',
                            alignItems: 'center',
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2, borderRadius: 5 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                            // paddingVertical: 10,
                            paddingHorizontal: 5,
                        },
                        left: {
                            // paddingVertical: 10,
                            paddingHorizontal: 5,
                            backgroundColor: Colors.ThemeRed,
                        }
                    }}

                    timeTextStyle={{ left: { color: 'white' }, right: { color: 'black' } }}
                    textStyle={{ right: { color: 'black', }, left: { color: '#fff', } }}
                />
            </View>
        );
    }


    const CallChatApi = async () => {
        setLoading(true)
        callGetRestApis(Config().getCandidateReceivedMessages)
            .then((res) => {
                setLoading(false)
                let Data = res
                if (Data) {
                    // let sort_data = Data.sort((a: any, b: any) => {
                    //     let _a: any = new Date(a.dateSent)
                    //     let _b: any = new Date(b.dateSent)
                    //     return _b - _a
                    // })
                    let chat_data = Data.map((item) => (
                        {
                            _id: item.message_id,
                            text: item.body,
                            createdAt: item.created_at ? new Date(item.created_at) : new Date(),
                            user: {
                                _id: item.from_id,
                                name: item.received_from ? item.received_from : 'User',
                                avatar: avtar,
                            },
                        }
                    ))
                    console.log('chat_data', res);
                    // dispatch({ type: Type.MESSAGE_DATA, data: chat_data })
                    setMessages(chat_data)
                    setData(chat_data)

                }
            })
            .catch((error) => {
                setLoading(false)
                console.log('Get all Chats Api error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })
    }
    const  sendChatMessage = async(messageText) => {
        setLoading(true)
        let body = {
            "title": "veniam",
            "body": messageText.length ? messageText[0].text : 'Hardcorded',
            "user_id": 2
        }
        let url = Config().sendMessage
        await CallPostRestApi(body, url)
            .then((res) => {
                setLoading(false)
                console.log('sendChatMessage res :- ', res);

            })
            .catch((error) => {
                setLoading(false)
                console.log('sendChatMessage error :- ', error)
                showMessage({ message: 'Error', description: error, type: "warning", });
            })
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.globalContainerBg, }}>
            <GiftedChat
                messages={messages}
                onSend={onSend}
                // isTyping={true}
                user={{ _id: 1, name: Name, avatar: '' }}
                placeholder={'Type your message...'}
                alwaysShowSend
                showUserAvatar
                renderBubble={renderBubble}
                messagesContainerStyle={{ paddingVertical: 20 }}
                // renderAvatarOnTop={true}
                scrollToBottom
            />
        </View>
    )

}

export default Chat
