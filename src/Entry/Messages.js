import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {callGetRestApis} from '../Services/Api';
import Config from '../Util/Config';
import _ from 'lodash';
import Colors from '../Util/Colors';
import Loader from '../Components/Loader';
import {Badge, Icon} from 'react-native-elements';
import {MinMargin} from '../Util/Styles';
import {showMessage} from 'react-native-flash-message';

const {height, width} = Dimensions.get('window');
let avtar = require('../Assets/Icons/profile.png');

const Messages = props => {
  const [loading, setLoading] = useState(false);
  const [DATA, setData] = useState([]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', async () => {
      getUsersForMessages();
    });
    return unsubscribe;
  }, []);

  const getUsersForMessages = async () => {
    let URL = Config().getUsersForMessages;
    console.log('URL', URL);
    setLoading(true);
    await callGetRestApis(URL)
      .then(res => {
        setLoading(false);
        if (res && res.length) {
          setData(res);
        }
        console.log('getUsersForMessages res :- ', res);
      })
      .catch(error => {
        setLoading(false);
        console.log('getUsersForMessages error :- ', error);
        showMessage({message: 'Error', description: error, type: 'warning'});
      });
  };

  const renderItemUserList = ({item, index}) => {
    let Name =
      _.get(item, 'first_name', '') + ' ' + _.get(item, 'last_name', '');
    return (
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('ChatList', {
            Id: item.user_id,
            name: Name.match(/\b([A-Za-z0-9])/g)
              .join('')
              .toUpperCase(),
            fullName:Name  
          })
        }>
        <View
          style={{
            flexDirection: 'row',
            marginTop: hp('3.5%'),
            marginLeft: 15,
            paddingBottom: 5,
            alignItems: 'center'
          }}>
          <View style={styles.chatListImg}>
            <Text style={{fontWeight:"600"}}>
              {Name &&
                Name.match(/\b([A-Za-z0-9])/g)
                  .join('')
                  .toUpperCase()}
            </Text>
          </View>
          <View style={{marginLeft: 15,flex:1,flexDirection:"row"}}>
            <Text style={[styles.chatListname]}>{Name}</Text>
            {item?.unreadMessageCount > 0?
                <Badge value={item?.unreadMessageCount} status="error" containerStyle={{marginLeft:5}}/>
            :null}
          </View>
          <View style={styles.chatTime}>
            <Icon
              name={'plus'}
              type="font-awesome"
              size={24}
              color={Colors.green_2}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{backgroundColor: '#F1EAF555', flex: 1}}>
      {loading ? <Loader /> : null}
      <View style={styles.btnWrapper}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Chat')}
          style={styles.btnSubWrapper}>
          <Icon
            name={'plus'}
            type="antdesign"
            size={12}
            color={Colors.ThemeGreen}
            iconStyle={{marginHorizontal: MinMargin}}
          />
          <Text style={styles.newConversation}>New Conversation</Text>
        </TouchableOpacity>
      </View>
      <View style={{}}>
      {DATA && DATA?.length >0 ? <Text style={{fontSize: 15, fontWeight:"500",color: '#808080',marginTop:20,marginLeft:15}}>
        Existing Conversations
       </Text>:null}
        <FlatList
          data={DATA}
          renderItem={renderItemUserList}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

export default Messages;

const styles = StyleSheet.create({
  headerView: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    shadowColor: '#00000019',
    paddingBottom: hp('2%'),
    borderColor: '#00000019',
    borderBottomWidth: 3,
    // height: "15%",
  },
  header: {
    color: '#000000',
    fontSize: 18,
    marginTop: hp('2%'),
    paddingLeft: 15,
    textAlign: 'left',
  },
  chatListImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:Colors.blue_2
  },
  chatListname: {
    color: '#000000',
    fontSize: 15,
  },
  chatListMessage: {
    color: '#000000',
    fontSize: 14,

    marginTop: 2,
  },
  chatTime: {
    width:40,
    height:40,
    borderRadius:20,
    backgroundColor:Colors.Border,
    marginHorizontal:15,
    alignItems: 'center',
    justifyContent:"center"
  },
  btnWrapper: {
    borderBottomWidth: 1,
    borderColor: 'grey',
    marginHorizontal: 15,
    paddingVertical: 10,
  },
  btnSubWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  newConversation: {
    color: Colors.ThemeGreen,
    fontSize: 14,
  },
});
