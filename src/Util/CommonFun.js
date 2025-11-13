import { Dimensions, Linking, PixelRatio, Alert, Platform, PermissionsAndroid } from "react-native";
import {request, check,PERMISSIONS, RESULTS} from 'react-native-permissions';
const { height, width } = Dimensions.get('window');
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT, } = Dimensions.get('window');
import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import { store } from '../redux/Store'
import Geolocation from 'react-native-geolocation-service';
import { isPointWithinRadius,getDistance } from 'geolib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee from '@notifee/react-native';
import Types from "../redux/Types";
import { showMessage } from "react-native-flash-message";

// based on iphone 5s's scale
let scale = SCREEN_WIDTH / 320;

export const normalizeSize = (size) => {
  const newSize = size * scale
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else if (Platform.OS === 'web') {
    scale = SCREEN_WIDTH / 1024;
    return size + 2
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}

export const CheckNet = async () => {
  try {
    const isNetAvailable = store.getState().appStore.isNetAvailable
    // const state = await NetInfo.fetch();
    console.log("NET VALUE:", isNetAvailable);
    return isNetAvailable;
  } catch (error) {
    console.error("Error fetching network state:", error);
    return false;
  }
};



export const validateEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

//Valdation for testing the Mobile "\\A[0-9]{10}\\z"  
export const validateMobile = (mobile_number) => {
  // var re = /^[6-9][0-9]{9}$/;
  var re = /^[0-9]{9}$/;
  return re.test(mobile_number);
};


export const validateTenNo = (mobile_number) => {
  var re = /^\d{10}$/;
  return re.test(mobile_number);
};


export const validateDigit = (val) => {
  var re = /^\d+$/;
  return re.test(val);
};

export const validatePin = (val) => {
  var re = /^\d{6}$/;
  return re.test(val);
};

export const validateYear = (valN) => {
  let val = 0
  if (valN) { val = valN.trim() }
  let result = false
  console.log('validateYear', val);
  var reg = /^\d{4}$/;
  result = reg.test(val) && (1900 <= val && val <= (new Date()).getFullYear())
  // console.log('validateYear1', reg.test(val), 1900 <= val, val <= (new Date()).getFullYear());
  // result = String(val).length == 4 && !isNaN(val) && (1900 <= val && val <= (new Date()).getFullYear())
  // console.log('validateYear1',String(val).length , String(val).length == 4, !isNaN(val), 1900 <= val, val <= (new Date()).getFullYear());
  return result;
};



export const RemoveDec = (value) => {
  return value.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, '')
};


export const validateName = (value) => {
  var Name_REGEX = re = /[*|\":<>[\]{}`\\()';@&$]/;
  return Name_REGEX.test(value);
};

export const validateAlphabet = (value) => {
  var REG = re = /^[a-zA-Z]+$/;
  return REG.test(value);
};
export const validatePass = (value) => {
  // var Pass_REGEX = re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/;
  var Pass_REGEX = re = /^(?=.*[a-z0-9A-Z]+)(?=.*[!@#\$%\^&\*])(?=.{8,30})/;
  return Pass_REGEX.test(value);
};




//.webm,.m4v,.mpv,.mkv,.mp4,.m4p,.mpg,.mp2,.mpeg,.mpe,.flv,.swf,.avchd,.ogg,.avi,.wmv,.mov,.qt
export const isVideo = (URL) => {
  let VideoAvailable = false
  if (URL.includes('.webm') || URL.includes('.m4v') || URL.includes('.mpv') || URL.includes('.mkv') || URL.includes('.mp4') || URL.includes('.m4p') || URL.includes('.mpg') || URL.includes('.mp2') || URL.includes('.mpeg') || URL.includes('.mpe') || URL.includes('.flv') || URL.includes('.swf') || URL.includes('.avchd') || URL.includes('.ogg') || URL.includes('.avi') || URL.includes('.wmv') || URL.includes('.mov') || URL.includes('.qt') || URL.includes('audio/mpeg')) {
    VideoAvailable = true
  } else { VideoAvailable = false }
  return VideoAvailable;
};

//.jpeg , .jpg, .png, .gif, .tiff
export const isImage = (URL) => {
  let ImageAvailable = false
  if (URL.includes('.jpeg') || URL.includes('.JPEG') || URL.includes('.jpg') || URL.includes('.JPG') || URL.includes('.png') || URL.includes('.PNG') || URL.includes('.gif') || URL.includes('.tiff') || URL.includes('.HEIC')) {
    ImageAvailable = true
  } else { ImageAvailable = false }
  return ImageAvailable;
};




export const showOKAlert = (Title, Content) => {
  Alert.alert(
    Title,
    Content,
    [
      { text: 'OK', onPress: () => console.log("aaa") },
    ],
    { cancelable: false }
  )
}

//removing duplicates form the array using set
export function removeDuplicates(a) {
  return Array.from(new Set(a.map(JSON.stringify))).map(JSON.parse);
}



export const findMinMax = (arr) => {
  let min = arr[0].package_amount, max = arr[0].package_amount;
  for (let i = 1, len = arr.length; i < len; i++) {
    let v = arr[i].package_amount;
    min = (v < min) ? v : min;
    max = (v > max) ? v : max;
  }

  return [min, max];
}

export const sortBy = (FTRIres, SortBy) => {
  var instituteList = FTRIres;
  var FinalList = []
  if (SortBy && SortBy === 'low_to_high') {
    var instituteListLowToHigh = instituteList.sort((a, b) => parseInt(a.package_min_amount) - parseInt(b.package_min_amount));
    FinalList = instituteListLowToHigh
  }
  else if (SortBy && SortBy === 'high_to_low') {
    var instituteListHighToLow = instituteList.sort((a, b) => parseInt(b.package_min_amount) - parseInt(a.package_min_amount));
    FinalList = instituteListHighToLow
  }
  else { FinalList = FTRIres }
  return FinalList;
}

export const CapitalizeName = (name) => {
  let i = 0;
  let val = true;
  let localname = '';
  let Name = ''
  if (name) {
    Name = name.toString()
  }
  if (Name) {
    for (i = 0; i < Name.length; i++) {
      if (val) {
        let v = Name.substring(i, i + 1).charAt(0).toUpperCase();
        localname = localname + v;
        val = false;
      }
      else {
        localname = localname + Name.substring(i, i + 1)
      }
      if (Name.substring(i, i + 1) == ' ') {
        val = true;
      }
    }
  }
  else {
    localname = ''
  }
  return localname;
}

export const calculateDistance = (instiLat, instiLong, Lat, Long, unit) => {
  var lat1 = Lat;
  var lon1 = Long;
  var lat2 = instiLat;
  var lon2 = instiLong;
  // let lat1 = "28.6428915"//T9L
  // let lon1 = "77.2190894"
  // var lat2  = "28.4040854";//NDLS
  // var lon2  = "77.2996861";
  // let unit = "K"
  var radlat1 = Math.PI * lat1 / 180
  var radlat2 = Math.PI * lat2 / 180
  var theta = lon1 - lon2
  var radtheta = Math.PI * theta / 180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist)
  dist = dist * 180 / Math.PI
  dist = dist * 60 * 1.1515
  if (unit == "K") { dist = dist * 1.609344 }
  if (unit == "M") { dist = dist * 0.8684 }
  console.log('distance is ', dist);
  return Math.round(dist)
}

// NameN = Name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});



export function getFormatedDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate();
  let year = "" + d.getFullYear();
  if (day.length < 2) day = "0" + day;
  if (month.length < 2) month = "0" + month;
  // let s = month + ' ' + day;
  return [day, month, year].join("/");
}

export const getformateTime = (date) => {
  var date1 = new Date(date);
  var tz = date1.getTimezoneOffset();
  var data = new Date(date1.getTime() + tz * 60000);
  let hours = data.getHours();

  let min = data.getMinutes();

  let aa = "PM";

  if (hours < 12) {
    aa = "AM";
  }

  if (min < 10) {
    min = "0" + min;
  }

  if (hours > 12) {
    hours = hours - 12;
  }

  let time = hours + ":" + min + aa;

  return time;
};






export function LoadMore(Arr, until) {
  let arr = []
  Arr.map((item, index) => {
    if (index < until) {
      arr.push(item)
    }
  })
  return arr
}



export const FivePercent = (givenPrice) => {
  if (givenPrice > 0) {
    let price = givenPrice
    let div = 0.05
    let res = price * div
    let dis = price - res
    return dis

  }
  return givenPrice

}


export const CalCulateHour = (value, sessionduration) => {
  var Hours = "";
  if (parseFloat(sessionduration) == 30) {
    if (value.includes(":30")) {
      Hours = 1.0;
    } else {
      Hours = parseFloat(sessionduration) / 100;
    }
  } else if (parseFloat(sessionduration) == 90) {
    if (value.includes(":30")) {
      Hours = 2.0;
    } else {
      Hours = 1.3;
    }
  } else if (parseFloat(sessionduration) == 60) {
    if (value.includes(":30")) {
      Hours = 1.3;
    } else {
      Hours = 1.0;
    }
  } else {
    if (value.includes(":30")) {
      Hours = 2.3;
    } else {
      Hours = 2.0;
    }
  }
  return Hours;
};


export const getDay = (date) => {
  var days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const d = new Date(date);
  const dayName = days[d.getDay()];
  return dayName
}



export const formatDate = (date, format) => {
  if (date !== null && date !== undefined) {
    let date1 = new Date(date);
    let dd = date1.getDate();
    let mm = date1.getMonth() + 1;
    let mmm = date1.toLocaleString('default', { month: 'short' })
    let yyyy = date1.getFullYear();
    console.log(dd, mmm, yyyy)
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    switch (format) {
      case "YYYY-MM-DD":
        date1 = yyyy + "-" + mm + "-" + dd;
        break;
      case "DD-MMM,YYYY": {
        console.log("Worked Hwerree", dd + " " + mmm + "," + yyyy)
        date1 = dd + " " + mmm + "," + yyyy;
      }
        break;
      case "DD,MMM-YYYY":
        date1 = dd + "," + mmm + " " + yyyy;
        break;
      default:
        date1 = mm + "/" + dd + "/" + yyyy;
    }
    console.log(date1, "dattetet")
    return date1;
    // return (date1 = mm + "/" + dd + "/" + yyyy);
  }
}

export const RemoveHtmlTag = (htmlString) => {
  var stripedHtml = htmlString.replace(/<[^>]+>/g, '');
  return stripedHtml
}
// let res=ReplaceMethod(d,'&nbsp;')


export const ReplaceMethod = (htmlString, n) => {
  var re = new RegExp(n, "g");
  var stripedHtml = htmlString.replace(re, " ");
  return stripedHtml
}



export const RemoveSpaceTag = (htmlString) => {
  let space = '&nbsp;';
  let space1 = '&quot;';
  let space2 = '&#39;';

  var stripedHtml = htmlString.replace(/<[^>]+>/g, '');
  var re = new RegExp(space, "g");
  var re1 = new RegExp(space1, "g");
  var re2 = new RegExp(space2, "g");
  var final = stripedHtml.replace(re, " ");
  final = final.replace(re1, " ");
  final = final.replace(re2, "'");
  return final
}



export const SortDateFunc = (Arr, temp) => {
  Arr.sort(function (a, b) {
    return new Date(a.temp) - new Date(b.temp);
  });
  return Arr
}

export const GetStoreData = () => {
  const S = store.getState();
  //console.log('S.login', S.loginStatus.loginData);
  if (S && S.loginStatus && S.loginStatus.loginData && Object.keys(S.loginStatus.loginData).length != 0)
    return S.loginStatus.loginData
}


export const GetParentStoreData = () => {
  const S = store.getState();
  if (S && S.Child && S.Child.ChildData && S.Child.ChildData.length != 0)
    return S.Child.ChildData
}




export const DateValid = (date) => {
  let conDate = moment(date).format("YYYY-MM-DD")
  var d1 = new Date(conDate); //yyyy-mm-dd  
  var d2 = new Date(); //yyyy-mm-dd  
  if (d1 > d2) { return false }
  else if (d1 < d2) { return true }
}


const checkTime = (i) => {
  return (i < 10) ? "0" + i : i;
}

export const getCurrentTime = () => {
  var today = new Date(),
    h = checkTime(today.getHours()),
    m = checkTime(today.getMinutes()),
    s = checkTime(today.getSeconds());
  var time = h + ":" + m + ":" + s;
  return time;
}

export const FilterDupArr = (res, name) => {
  let result = res.filter(
    (v, i, a) => a.findIndex((t) => t.name === v.name) === i
  )
  return result
}






export const FileFun = (response) => {
  let ResponseUri = response.uri
  let ret = String(response.uri);
  if (ret.includes("//file:///")) {
    ret = String(response.uri).replace("//file:///", "");
  }
  if (ret.includes("file:///")) {
    ret = String(response.uri).replace("file:///", "");
  }
  let Filename = ''
  let FileType = response.type; //'image/jpeg'
  let imgName = response.name;
  if (ResponseUri) {
    if (typeof imgName === "undefined" || !imgName) {
      // on iOS, using camera returns undefined fileName. This fixes that issue, so API can work.
      var getFilename = ResponseUri.split("/");
      Filename = moment() + '_' + getFilename[getFilename.length - 1];
    } else {
      Filename = moment() + '_' + response.name;
    }
    if (!response.type) {
      let Start = 'image/'
      var getFileType = ResponseUri.split(".");
      FileType = Start + getFileType[getFileType.length - 1];
    } else { FileType = response.type }

    console.log('CallImageUploadApi', FileType, Filename, ret, ResponseUri);
  }


  if (ResponseUri) {
    return { uri: ResponseUri, name: Filename, type: FileType, }

  }
}






export const ImageUploadFun = (response) => {
  let ResponseUri = response.uri
  let ret = String(response.uri);
  if (ret.includes("//file:///")) {
    ret = String(response.uri).replace("//file:///", "");
  }
  if (ret.includes("file:///")) {
    ret = String(response.uri).replace("file:///", "");
  }
  let Filename = ''
  let FileType = response.type; //'image/jpeg'
  let imgName = response.fileName;
  if (ResponseUri) {
    if (typeof imgName === "undefined" || !imgName) {
      // on iOS, using camera returns undefined fileName. This fixes that issue, so API can work.
      var getFilename = ResponseUri.split("/");
      Filename = moment() + '_' + getFilename[getFilename.length - 1];
    } else {
      Filename = moment() + '_' + response.fileName;
    }
    if (!response.type) {
      let Start = 'image/'
      var getFileType = ResponseUri.split(".");
      FileType = Start + getFileType[getFileType.length - 1];
    } else { FileType = response.type }

    console.log('CallImageUploadApi', FileType, Filename, ret, ResponseUri);
  }


  if (ResponseUri) {
    return { uri: ResponseUri, name: Filename, type: FileType, };
  }


}






export const secondsToTime = (secs) => {
  let hours = Math.floor(secs / (60 * 60));

  let divisor_for_minutes = secs % (60 * 60);
  let minutes = Math.floor(divisor_for_minutes / 60);
  minutes = ("0" + minutes).slice(-2);
  let divisor_for_seconds = divisor_for_minutes % 60;
  let seconds = Math.ceil(divisor_for_seconds);
  seconds = ("0" + seconds).slice(-2);

  let obj = { h: hours, m: minutes, s: seconds, };
  return obj;
};


export function timeDiffCalc(dateFuture, dateNow) {
  let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;
  console.log('calculated hours', hours);

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;
  console.log('minutes', minutes);


  return [hours, minutes];
}




export function ordinal_suffix_of(i) {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}



export const timeConvert = (n) => {
  var num = n;
  var hours = (num / 60);
  var rhours = Math.floor(hours);
  var minutes = (hours - rhours) * 60;
  var rminutes = Math.round(minutes);
  return rhours + " hrs" + rminutes + " min";
}




export const getDaysBetweenDates = function (startDate, endDate) {
  var now = startDate.clone(), dates = [];
  while (now.isSameOrBefore(endDate)) {
    dates.push({ date: now.format('YYYY-MM-DD'), dayname: moment(now).format('dddd') })
    now.add(1, 'days');
  }
  return dates;
};

function weekOfMonth(date) {
  let weekInYearIndex = date.week();
  if (date.year() !== date.weekYear()) {
    weekInYearIndex = date.clone().subtract(1, 'week').week() + 1;
  }
  const weekIndex = weekInYearIndex - moment(date).startOf('month').week() + 1;
  return weekIndex
}

export function sundaysInMonth(m, y, d) {
  var days = new Date(y, m, 0).getDate();
  let Arr = []
  let week = weekOfMonth(moment());
  let day = new Date().getDate();
  // console.log('week',week,'day',day);
  var sundays = [8 - (new Date(m + '/01/' + y).getDay())];
  for (var i = sundays[0] + 7; i <= days; i += 7) {
    console.log();
    sundays.push(i);
  }
  console.log('sundays', sundays);
  for (var i = 0; i < sundays.length; i++) {
    let el = sundays[i]
    week = el == day ? week - 1 : week

    console.log('i<weeki<week', i < week, i, week);
    // if (i<week) {
    if (d) { if (el > d) { Arr.push({ date: `${el}/${m}/${y}` }); } }
    else { Arr.push({ date: `${el}/${m}/${y}` }); }
  }
  // }
  return Arr;
}


export function startOfWeek(date) {
  var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
  return new Date(date.setDate(diff));

}



export const getExtention = filename => {
  // To get the file extension
  return /[.]/.exec(filename) ?
    /[^.]+$/.exec(filename) : undefined;
};




export function populate_week_range_options(data) {

  const { startMnth, startYear, DD,
    finishMnth, finishYear, FDD,
  } = data


  var start_week_date = new Date(startYear, startMnth - 1, DD); // no queries exist before this
  var todays_date = new Date(finishYear, finishMnth - 1, FDD);

  // array to hold week commencing dates
  var week_commencing_dates = new Array();

  while (start_week_date <= todays_date) {
    var next_date = start_week_date.setDate(start_week_date.getDate() + 1);

    var next_days_date = new Date(next_date);
    let day_index = next_days_date.getDay();


    if (day_index == 0) {
      // week_commencing_dates.push(next_days_date.getDate());
      week_commencing_dates.push({ date: moment(next_days_date).format("D/M/YYYY") });
    }
    // increment the date
    start_week_date = new Date(next_date);
  }
  return week_commencing_dates;
}

export const numberWithCommas=(value)=>{
  if(value !== null){
    if(value?.length>3){
      let str=value.split(',').join('')
      return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
   else{
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
 
}

export const requestExtenalStoragePermissionsAndroid = async()=>{
  if (Platform.OS === "android" && Platform.Version < 33) {
    const granted = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,{
      title: 'Storage Permission Required',
      message:
          'Application needs access to your storage to download File',
    })
    return granted == RESULTS.GRANTED;
  }
  return true;
};

export const hasLocationPermission = async () => {
  if(Platform.OS ==='ios'){
    const status = await Geolocation.requestAuthorization('whenInUse')
    if(status == 'granted'){
        return true
    }else{
        return false
    }
}
  if (Platform.OS === 'android' || Platform.Version < 23) {
      return true;
  }
  const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  );
  if (hasPermission) { return true; }
  const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
  }
  if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG,);
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG,);
  }
  return false;
};

export const getCurrentLatLong = ()=> new Promise((resolve, reject) => {
  Geolocation.getCurrentPosition(
      (position) => {
          console.log(position);
          let myLat = parseFloat(position.coords.latitude);
          let myLong = parseFloat(position.coords.longitude);
          resolve({
              latitude: myLat,
              longitude:myLong
          });
      },
      (error) => {
          reject(error.message);
      },
      { enableHighAccuracy: true, timeout: 5000, }
  );
});

export const checkUserWithInRadius = async (currentLocation,jobLocation,radius = 5000)=>{
  console.log({
    currentLocation:{ latitude: currentLocation.latitude, longitude: currentLocation.longitude },
    jobLocation:{ latitude: jobLocation?.latitude, longitude: jobLocation?.longitude },
  })
  try {
      const isWithInRadius = isPointWithinRadius(
        { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
        { latitude: jobLocation?.latitude, longitude: jobLocation?.longitude },
        radius
        ); 
        console.log({isWithInRadius:isWithInRadius});
    return isWithInRadius;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getBaseUrl = ()=>{
   const newUrl = store.getState().loginStatus.baseUrl
   return newUrl
}
export const getTimesheetTypeBg = (type) => {
  const lowerCaseType = type.toLowerCase();
  return ["annual leave", "sick leave", "public holiday"].includes(lowerCaseType) ? "#ffe46c" : "#00da9b";
};
//  export const getTimesheetTypeBg =(type) => type == "Annual Leave" ? "#ffe46c" : "#00da9b"

export const requestNotificationPermission = async () => {
  if (Platform.OS === 'android') {
    const version = parseInt(Platform.Version, 10);

    if (version >= 33) { // Android 13 (API 33) and above
      const status = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      console.log(status,"status notification")
      if (status === RESULTS.DENIED) {
        const newStatus = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
        console.log(newStatus,"status neee for notification")
        
      } else {
        
      }
    }else {
      // For Android versions lower than 12, permissions are granted automatically
     
    }
  }
};

export const getInitials = (name) => {
  if (!name || typeof name !== "string" || name.trim() === "") return "";

  return (name.match(/\b\w/g) || [])
    .slice(0, 2) 
    .join('')
    .toUpperCase();
};

export const updateNotificationBadge =(count)=>{
  if(Platform.OS === "ios"){
      notifee.setBadgeCount(count).then(() => console.log('Badge count set!'));
  }
}

export const updateNetworkStatusAction=(status)=>{
  // console.log("store updating--",status);
  //   if (status) {
  //       showMessage({ message: 'Online', description: "Connected to Internet", type: "success" });
  //   }
  //   else {
  //       showMessage({ message: 'Offline', description: "No Internet Connection", type: "danger" });
  //   }
   store.dispatch({ type: Types.SAVE_NETWORK_STATUS, data: status });
}

export const verifyInternet = async () => {
  try {
    const res = await fetch("https://clients3.google.com/generate_204");
    console.log("verifying internet",res?.status === 204);
    
    return res.status === 204;
  } catch {
    return false;
  }
};