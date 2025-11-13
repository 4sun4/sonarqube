import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {callGetRestApis} from '../Services/Api';
import Loader from '../Components/Loader';
import Types from '../redux/Types';
import moment from 'moment';
import Config from '../Util/Config';
const {width, height} = Dimensions.get('window');
let LoginData = '';
const ProfileDetail = props => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const [state, setState] = useState({
    UserData: null,
  });
  const UserDetail = useSelector(S => {
    let D = '';
    if (
      S &&
      S.loginStatus &&
      S.loginStatus.loginData &&
      Object.keys(S.loginStatus.loginData).length != 0
    ) {
      D = S.loginStatus.loginData;
      if (D) {
        LoginData = D;
      }
    }
    return D;
  });

  const [data, setData] = useState({
    username: '',
  });

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', async () => {
      getUserDetails();
    });
    return unsubscribe;
  }, []);

  const getUserDetails = async () => {
    if (LoginData && LoginData.token) {
      let URL = Config().getDetails;
      console.log('URL', URL);
      setLoading(true);
      await callGetRestApis(URL)
        .then(res => {
          setLoading(false);
          if (res && res[0]) {
            dispatch({type: Types.GET_DETAILS, data: res[0]});
            setState({UserData: res[0]});
          }
          console.log('getUserDetails res :- ', res);
        })
        .catch(error => {
          setLoading(false);

          console.log('getUserDetails error :- ', error);
          showMessage({message: 'Error', description: error, type: 'warning'});
        });
    } else {
    }
  };

  const {UserData} = state;
  console.log('UserDataUserData', UserData);

  let name,
    Country,
    PartTime,
    Perm,
    Temp,
    alternate_number,
    date_applied,
    dob,
    email,
    gender,
    indigenous_status,
    mobile,
    mod_by,
    modified,
    other_name,
    pc,
    permission_group,
    permission_group_delete,
    permission_group_edit,
    permission_group_view,
    street_address,
    street_address_line_2,
    suburb,
    tel = '';

  if (UserData) {
    if (UserData.first_name) {
      name = UserData.first_name;
    }
    if (UserData.last_name) {
      name = name + ' ' + UserData.last_name;
    }
    if (UserData.Country) {
      Country = UserData.Country;
    }
    if (UserData.PartTime) {
      PartTime = UserData.PartTime;
    }
    if (UserData.Perm) {
      Perm = UserData.Perm;
    }
    if (UserData.Temp) {
      Temp = UserData.Temp;
    }
    if (UserData.alternate_number) {
      alternate_number = UserData.alternate_number;
    }
    if (UserData.date_applied) {
      date_applied = UserData.date_applied;
    }
    if (UserData.dob) {
      dob = moment(UserData.dob).format('DD/MM/YYYY');
    }
    if (UserData.email) {
      email = UserData.email;
    }
    if (UserData.gender) {
      gender = UserData.gender;
    }
    if (UserData.indigenous_status) {
      indigenous_status = UserData.indigenous_status;
    }
    if (UserData.mobile) {
      mobile = UserData.mobile;
    }
    if (UserData.mod_by) {
      mod_by = UserData.mod_by;
    }
    if (UserData.modified) {
      modified = UserData.modified;
    }
    if (UserData.other_name) {
      other_name = UserData.other_name;
    }
    if (UserData.pc) {
      pc = UserData.pc;
    }
    if (UserData.permission_group) {
      permission_group = UserData.permission_group;
    }
    if (UserData.permission_group_delete) {
      permission_group_delete = UserData.permission_group_delete;
    }
    if (UserData.permission_group_edit) {
      permission_group_edit = UserData.permission_group_edit;
    }
    if (UserData.permission_group_view) {
      permission_group_view = UserData.permission_group_view;
    }
    if (UserData.street_address) {
      street_address = UserData.street_address;
    }
    if (UserData.street_address_line_2) {
      street_address_line_2 = UserData.street_address_line_2;
    }
    if (UserData.suburb) {
      suburb = UserData.suburb;
    }
    if (UserData.tel) {
      tel = UserData.tel;
    }
  }
  return (
    <SafeAreaView style={{flex: 1}}>
      {loading ? <Loader /> : null}

      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView>
            <View
              style={{
                width: '100%',
                backgroundColor: '#FFF',
                paddingHorizontal: 20,
                paddingVertical: 20,
              }}>
              <View
                style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                {/* <Text style={{fontSize: 17}}>My Details</Text> */}
                <View>
                  <TouchableOpacity
                    onPress={() =>
                      props.navigation.navigate('EditProfileDetail', {
                        EditVal: 'Detail',
                      })
                    }>
                    <Image
                      style={{width: 20, height: 20}}
                      resizeMode={'contain'}
                      source={require('../Assets/Icons/HeaderEdit.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <Text style={{fontSize: height / 43, color: '#808080'}}>
                  Name <Text style={{color: 'red'}}>*</Text>
                </Text>
                <TextInput
                  editable={false}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#D8D8D8',
                    fontSize: height / 45,
                    paddingVertical: height / 90,
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  placeholderTextColor="#7A7A7A"
                  textValue={name ? name : ''}
                  value={name ? name : ''}
                  keyboardShouldPersistTaps
                  onChangeText={value => setData({...data, username: value})}
                />
              </View>

              <View style={{marginTop: 20}}>
                <Text style={{fontSize: height / 43, color: '#808080'}}>
                  Other Name
                </Text>
                <TextInput
                  editable={false}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#D8D8D8',
                    fontSize: height / 45,
                    paddingVertical: height / 90,
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  placeholderTextColor="#7A7A7A"
                  textValue={other_name ? other_name : ''}
                  value={other_name ? other_name : ''}
                  keyboardShouldPersistTaps
                  onChangeText={value => setData({...data, username: value})}
                />
              </View>

              <View style={{marginTop: 20}}>
                <Text style={{fontSize: height / 43, color: '#808080'}}>
                  Email Address <Text style={{color: 'red'}}>*</Text>
                </Text>
                <View
                  style={{
                    borderBottomWidth: 1,
                    flex: 1,
                    borderColor: '#D8D8D8',
                  }}>
                  <Text
                    numberOfLines={3}
                    style={{
                      fontSize: height / 45,
                      paddingVertical: height / 90,
                      color: 'black',
                      paddingVertical: height / 90,
                    }}>
                    {email ? email : ''}
                  </Text>
                </View>
              </View>
              <View style={{marginTop: 20}}>
                <Text style={{fontSize: height / 43, color: '#808080'}}>
                  Mobile/Cell Number
                </Text>
                <TextInput
                  editable={false}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#D8D8D8',
                    fontSize: height / 45,
                    paddingVertical: height / 90,
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  placeholderTextColor="#7A7A7A"
                  textValue={mobile ? mobile : ''}
                  value={mobile ? mobile : ''}
                  keyboardShouldPersistTaps
                  onChangeText={value => setData({...data, username: value})}
                />
              </View>
              <View style={{marginTop: 20}}>
                <Text style={{fontSize: height / 43, color: '#808080'}}>
                  Phone Number
                </Text>
                <TextInput
                  editable={false}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#D8D8D8',
                    fontSize: height / 45,
                    paddingVertical: height / 90,
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  placeholderTextColor="#7A7A7A"
                  textValue={tel ? tel : ''}
                  value={tel ? tel : ''}
                  keyboardShouldPersistTaps
                  onChangeText={value => setData({...data, username: value})}
                />
              </View>
              <View style={{marginTop: 20}}>
                <Text style={{fontSize: height / 43, color: '#808080'}}>
                  Alternate Number
                </Text>
                <TextInput
                  editable={false}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#D8D8D8',
                    fontSize: height / 45,
                    paddingVertical: height / 90,
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  placeholderTextColor="#7A7A7A"
                  textValue={alternate_number ? alternate_number : ''}
                  value={alternate_number ? alternate_number : ''}
                  keyboardShouldPersistTaps
                  onChangeText={value => setData({...data, username: value})}
                />
              </View>
              <View style={{marginTop: 20}}>
                <Text style={{fontSize: height / 43, color: '#808080'}}>
                  Address Line 1
                </Text>
                <TextInput
                  editable={false}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#D8D8D8',
                    fontSize: height / 45,
                    paddingVertical: height / 90,
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  placeholderTextColor="#7A7A7A"
                  textValue={street_address ? street_address : street_address}
                  value={street_address ? street_address : street_address}
                  keyboardShouldPersistTaps
                  onChangeText={value => setData({...data, username: value})}
                />
              </View>
              <View style={{marginTop: 20}}>
                <Text style={{fontSize: height / 43, color: '#808080'}}>
                  Address Line 2
                </Text>
                <TextInput
                  editable={false}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#D8D8D8',
                    fontSize: height / 45,
                    paddingVertical: height / 90,
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  placeholderTextColor="#7A7A7A"
                  textValue={
                    street_address_line_2
                      ? street_address_line_2
                      : street_address_line_2
                  }
                  value={
                    street_address_line_2
                      ? street_address_line_2
                      : street_address_line_2
                  }
                  keyboardShouldPersistTaps
                  onChangeText={value => setData({...data, username: value})}
                />
              </View>
              <View style={{marginTop: 20}}>
                <Text style={{fontSize: height / 43, color: '#808080'}}>
                  Suburb
                </Text>
                <TextInput
                  editable={false}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#D8D8D8',
                    fontSize: height / 45,
                    paddingVertical: height / 90,
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  placeholderTextColor="#7A7A7A"
                  textValue={suburb ? suburb : ''}
                  value={suburb ? suburb : ''}
                  keyboardShouldPersistTaps
                  onChangeText={value => setData({...data, username: value})}
                />
              </View>
              <View style={{marginTop: 20}}>
                <Text style={{fontSize: height / 43, color: '#808080'}}>
                  Postcode
                </Text>
                <TextInput
                  editable={false}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#D8D8D8',
                    fontSize: height / 45,
                    paddingVertical: height / 90,
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  placeholderTextColor="#7A7A7A"
                  textValue={pc ? pc : ''}
                  value={pc ? pc : ''}
                  keyboardShouldPersistTaps
                  onChangeText={value => setData({...data, username: value})}
                />
              </View>
              <View style={{marginTop: 20}}>
                <Text style={{fontSize: height / 43, color: '#808080'}}>
                  State
                </Text>
                <TextInput
                  editable={false}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#D8D8D8',
                    fontSize: height / 45,
                    paddingVertical: height / 90,
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  placeholderTextColor="#7A7A7A"
                  textValue={UserData && UserData.state ? UserData.state : ''}
                  value={UserData && UserData.state ? UserData.state : ''}
                  keyboardShouldPersistTaps
                  onChangeText={value => setData({...data, username: value})}
                />
              </View>
              <View style={{marginTop: 20}}>
                <Text style={{fontSize: height / 43, color: '#808080'}}>
                  Country
                </Text>
                <TextInput
                  editable={false}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#D8D8D8',
                    fontSize: height / 45,
                    paddingVertical: height / 90,
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  placeholderTextColor="#7A7A7A"
                  textValue={Country ? Country : ''}
                  value={Country ? Country : ''}
                  keyboardShouldPersistTaps
                  onChangeText={value => setData({...data, username: value})}
                />
              </View>
              <View style={{marginTop: 20}}>
                <Text style={{fontSize: height / 43, color: '#808080'}}>
                  Date of Birth
                </Text>
                <TextInput
                  editable={false}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#D8D8D8',
                    fontSize: height / 45,
                    paddingVertical: height / 90,
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  placeholderTextColor="#7A7A7A"
                  textValue={dob ? dob : ''}
                  value={dob ? dob : ''}
                  keyboardShouldPersistTaps
                  onChangeText={value => setData({...data, username: value})}
                />
              </View>
            </View>

            {/* <View
              style={{
                width: '100%',
                backgroundColor: '#FFF',
                paddingHorizontal: 20,
                paddingVertical: 20,
                marginVertical: 20,
              }}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 17}}>Employment Type Sought</Text>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('EditProfileDetail', {
                      EditVal: 'Sought',
                    })
                  }>
                  <Image
                    style={{width: 20, height: 20}}
                    resizeMode={'contain'}
                    source={require('../Assets/Icons/HeaderEdit.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={{marginTop: 20}}>
                <Text style={{fontSize: height / 43, color: '#808080'}}>
                  Temp/Casual Employment
                </Text>
                <TextInput
                  editable={false}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#D8D8D8',
                    fontSize: height / 45,
                    paddingVertical: height / 90,
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  placeholderTextColor="#7A7A7A"
                  textValue={Temp ? 'Yes' : 'No'}
                  value={Temp ? 'Yes' : 'No'}
                  keyboardShouldPersistTaps
                  onChangeText={value => setData({...data, username: value})}
                />
              </View>

              <View style={{marginTop: 20}}>
                <Text style={{fontSize: height / 43, color: '#808080'}}>
                  Permanent Employment
                </Text>
                <TextInput
                  editable={false}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#D8D8D8',
                    fontSize: height / 45,
                    paddingVertical: height / 90,
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  placeholderTextColor="#7A7A7A"
                  textValue={Perm ? 'Yes' : 'No'}
                  value={Perm ? 'Yes' : 'No'}
                  keyboardShouldPersistTaps
                  onChangeText={value => setData({...data, username: value})}
                />
              </View>

              <View style={{marginTop: 20}}>
                <Text style={{fontSize: height / 43, color: '#808080'}}>
                  Part Time Employment
                </Text>
                <TextInput
                  editable={false}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#D8D8D8',
                    fontSize: height / 45,
                    paddingVertical: height / 90,
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  placeholderTextColor="#7A7A7A"
                  textValue={PartTime ? 'Yes' : 'No'}
                  value={PartTime ? 'Yes' : 'No'}
                  keyboardShouldPersistTaps
                  onChangeText={value => setData({...data, username: value})}
                />
              </View>
            </View> */}

            <View
              style={{
                width: '100%',
                backgroundColor: '#FFF',
                paddingHorizontal: 20,
                paddingVertical: 20,
                marginVertical: 20,
              }}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 17}}>Diversity</Text>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('EditProfileDetail', {
                      EditVal: 'Diversity',
                    })
                  }>
                  <Image
                    style={{width: 20, height: 20}}
                    resizeMode={'contain'}
                    source={require('../Assets/Icons/HeaderEdit.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={{marginTop: 20}}>
                <Text style={{fontSize: height / 43, color: '#808080'}}>
                  Gender
                </Text>
                <TextInput
                  editable={false}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#D8D8D8',
                    fontSize: height / 45,
                    paddingVertical: height / 90,
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  placeholderTextColor="#7A7A7A"
                  textValue={gender}
                  value={gender}
                  keyboardShouldPersistTaps
                  onChangeText={value => setData({...data, username: value})}
                />
              </View>

              {/* <View style={{marginTop:20}}>
                    <Text style={{fontSize:14,color:'#808080'}}>Do you identify as Aboriginal and/or Torres Strait Islander?</Text>
                  <TextInput
                     editable={false}
                        style={{borderBottomWidth:1,height:40, borderColor:'#D8D8D8', fontSize:18, backgroundColor:'white',color:'black'}}
                        placeholderTextColor='#7A7A7A'
                        textValue={dob}
                        value={dob}
                        keyboardShouldPersistTaps
                        onChangeText={(value) => setData({ ...data, username: value })}
                    />
                </View> */}
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 20,
    backgroundColor: '#F6F6F6',
  },
});

export default ProfileDetail;
