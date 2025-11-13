import {Platform, NetInfo, navigation, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CheckNet, GetStoreData} from '../Util/CommonFun';
import moment from 'moment';
import {store, persistor} from '../redux/Store';
import Type from '../redux/Types';
import Config from '../Util/Config';
import {showMessage, hideMessage} from 'react-native-flash-message';

import axios from 'axios';

export default class Api {
  constructor(name) {
    this._name = name;
  }
} //end of class

export const isFileExist = async filePath => {
  let token = GetStoreData().token;

  const config = {
    method: 'get',
    url: filePath,
    headers: {Authorization: `Bearer ${token}`},
  };
console.log("config",config);
  return await axios(config)
    .then(function (response) {
      // console.log(response, "Response <<<<<");
      if (response.status === 200) return true;
      else return false;
    })
    .catch(function (error) {
      // console.log(error);
      return false;
    });
};

export const CallPostRestApi = async (Data, URI) => {
  let token = GetStoreData().token;
  let Conn = await CheckNet();
  if (!Conn) {
    throw 'No internet connection.';
  } else {
    let authOptions = {
      method: 'POST',
      mode: 'cors',
      url: URI,
      data: Data,
      headers: {Authorization: `Bearer ${token}`},
    };
    console.log('authOptions  ', authOptions);
    return axios(authOptions)
      .then(res => {
        console.log('CallPostRestApi res', res);
        return res ? res.data : res;
      })
      .catch(err => {
        console.log('.catch((err) CallGraphQlTokenApi', err);
        handleErrors(err);
      });
  }
};


export const CallPostChangeRestApi = async (Data, URI,token) => {

  let Conn = await CheckNet();
  if (!Conn) {
    throw 'No internet connection.';
  } else {
    let authOptions = {
      method: 'POST',
      mode: 'cors',
      url: URI,
      data: Data,
      headers: {Authorization: `Bearer ${token}`},
    };
    console.log('authOptions  ', authOptions);
    return axios(authOptions)
      .then(res => {
        console.log('CallPostRestApi res', res);
        return res ? res.data : res;
      })
      .catch(err => {
        console.log('.catch((err) CallGraphQlTokenApi', err);
        throw err;
      });
  }
};

export const globalPostApi = async (URL, formdata) => {
  let token = GetStoreData().token;
  var authOptions = {
    method: 'POST',
    url: URL,
    data: formdata,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  };
  console.log('authOptions globalPostApi :-  ', authOptions);
  return axios(authOptions)
    .then(response => {
      console.log('responseresponse ', URL, ' =>', response);
      return response.data;
    })
    .catch(err => {
      console.log('.catch((err) responseresponse', err);
      handleErrors(err);
    });
};

export const callPostRest = async (URL, Data) => {
  let Conn = await CheckNet();
  if (!Conn) {
    throw 'No internet connection.';
  } else {
    let authOptions = {
      method: 'POST',
      mode: 'cors',
      url: URL,
      data: Data,
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
    };
    console.log('authOptions CallGraphQlTokenApi ', authOptions);
    return axios(authOptions)
      .then(res => {
        console.log('CallGraphQlTokenApi res', res);
        return res ? res.data : res;
      })
      .catch(err => {
        console.log('.catch((err) CallGraphQlTokenApi', err);
        handleErrors(err);
      });
  }
};

export const callSignup = async (URL, Data) => {
  let Conn = await CheckNet();
  if (!Conn) {
    throw 'No internet connection.';
  } else {
    let authOptions = {
      method: 'POST',
      mode: 'cors',
      url: URL,
      data: Data,
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
    };
    console.log('authOptions CallGraphQlTokenApi ', authOptions);
    return axios(authOptions)
      .then(res => {
        console.log('CallGraphQlTokenApi res', res);
        return res ? res.data : res;
      })
      .catch(err => {
        console.log('.catch((err) CallGraphQlTokenApi', err);
        handleErrors(err);
      });
  }
};

export const callVerify = async (URL, Data) => {
  let Conn = await CheckNet();
  if (!Conn) {
    throw 'No internet connection.';
  } else {
    let authOptions = {
      method: 'POST',
      mode: 'cors',
      url: URL,
      data: Data,
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
    };
    console.log('authOptions CallGraphQlTokenApi ', authOptions);
    return axios(authOptions)
      .then(res => {
        console.log('CallGraphQlTokenApi res', res);
        return res ? res.data : res;
      })
      .catch(err => {
        console.log('.catch((err) CallGraphQlTokenApi', err);
        handleErrors(err);
      });
  }
};

export const callProfileDetail = async (URL, Data, token) => {
  let Conn = await CheckNet();
  if (!Conn) {
    throw 'No internet connection.';
  } else {
    let authOptions = {
      method: 'POST',
      mode: 'cors',
      url: URL,
      data: Data,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    console.log('authOptions CallGraphQlTokenApi ', authOptions);
    return axios(authOptions)
      .then(res => {
        console.log('CallGraphQlTokenApi res', res);
        return res ? res.data : res;
      })
      .catch(err => {
        console.log('.catch((err) CallGraphQlTokenApi', err);
        handleErrors(err);
      });
  }
};

export const callUploadMyAvatar = async (URL, Data, token) => {
  console.log('Data:', Data);
  const photoData = new FormData();
  photoData.append('upload_file', Data.changedPhoto);
  console.log('PhotoData:', photoData);

  let Conn = await CheckNet();
  if (!Conn) {
    throw 'No internet connection.';
  } else {
    let authOptions = {
      method: 'POST',
      mode: 'cors',
      url: URL,
      data: photoData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    console.log('authOptions CallGraphQlTokenApi ', authOptions);
    return axios(authOptions)
      .then(res => {
        console.log('CallGraphQlTokenApi res', res);
        return res ? res.data : res;
      })
      .catch(err => {
        console.log('.catch((err) CallGraphQlTokenApi', err);
        handleErrors(err);
      });
  }
};

export const callGetWorkTypes = async (URL, token) => {
  console.log('Token', token);
  let Conn = await CheckNet();
  if (!Conn) {
    throw 'No internet connection.';
  } else {
    let authOptions = {
      method: 'GET',
      mode: 'cors',
      url: URL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    console.log('authOptions CallGraphQlTokenApi ', authOptions);
    return axios(authOptions)
      .then(res => {
        console.log('CallGraphQlTokenApi res', res);
        return res ? res.data : res;
      })
      .catch(err => {
        console.log('.catch((err) CallGraphQlTokenApi', err);
        handleErrors(err);
      });
  }
};

export const callGetSalaryTypes = async (salaryURL, token) => {
  console.log('Token', token);
  let Conn = await CheckNet();
  if (!Conn) {
    throw 'No internet connection.';
  } else {
    let authOptions = {
      method: 'GET',
      mode: 'cors',
      url: salaryURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    console.log('authOptions CallGraphQlTokenApi ', authOptions);
    return axios(authOptions)
      .then(res => {
        console.log('CallGraphQlTokenApi res', res);
        return res ? res.data : res;
      })
      .catch(err => {
        console.log('.catch((err) CallGraphQlTokenApi', err);
        handleErrors(err);
      });
  }
};

export const callGetNoticePeriods = async (NoticeURL, token) => {
  console.log('Token', token);
  let Conn = await CheckNet();
  if (!Conn) {
    throw 'No internet connection.';
  } else {
    let authOptions = {
      method: 'GET',
      mode: 'cors',
      url: NoticeURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    console.log('authOptions CallGraphQlTokenApi ', authOptions);
    return axios(authOptions)
      .then(res => {
        console.log('CallGraphQlTokenApi res', res);
        return res ? res.data : res;
      })
      .catch(err => {
        console.log('.catch((err) CallGraphQlTokenApi', err);
        handleErrors(err);
      });
  }
};

export const callAddCurrentJob = async (addCurrentJobUrl, Data, token) => {
  let Conn = await CheckNet();
  if (!Conn) {
    throw 'No internet connection.';
  } else {
    let authOptions = {
      method: 'POST',
      mode: 'cors',
      url: addCurrentJobUrl,
      data: Data,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    console.log('authOptions CallGraphQlTokenApi ', authOptions);
    return axios(authOptions)
      .then(res => {
        console.log('CallGraphQlTokenApi res', res);
        return res ? res.data : res;
      })
      .catch(err => {
        console.log('.catch((err) CallGraphQlTokenApi', err);
        handleErrors(err);
      });
  }
};

export const callGetJobGroups = async (getJobGroupUrl, token) => {
  console.log('Token', token);
  let Conn = await CheckNet();
  if (!Conn) {
    throw 'No internet connection.';
  } else {
    let authOptions = {
      method: 'GET',
      mode: 'cors',
      url: getJobGroupUrl,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    console.log('authOptions CallGraphQlTokenApi ', authOptions);
    return axios(authOptions)
      .then(res => {
        console.log('CallGraphQlTokenApi res', res);
        return res ? res.data : res;
      })
      .catch(err => {
        console.log('.catch((err) CallGraphQlTokenApi', err);
        handleErrors(err);
      });
  }
};

export const callGetJobTypes = async (getJobTypesUrl, Data, token) => {
  console.log('Token', token);
  let Conn = await CheckNet();
  if (!Conn) {
    throw 'No internet connection.';
  } else {
    console.log('Get Job Types--->>>', getJobTypesUrl, Data, token);

    let authOptions = {
      method: 'GET',
      //mode: 'cors',
      url: getJobTypesUrl + '?' + 'job_group_id=' + Data.job_group_id,
      Data,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    console.log('authOptions CallGraphQlTokenApi ', authOptions);
    return axios(authOptions)
      .then(res => {
        console.log('CallGraphQlTokenApi res', res);
        return res ? res.data : res;
      })
      .catch(err => {
        console.log('.catch((err) CallGraphQlTokenApi', err);
        handleErrors(err);
      });
  }
};

export const callAddIdealJobs = async (addIdealJobUrl, Data, token) => {
  let Conn = await CheckNet();
  if (!Conn) {
    throw 'No internet connection.';
  } else {
    let authOptions = {
      method: 'POST',
      mode: 'cors',
      url: addIdealJobUrl,
      data: Data,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };
    console.log('authOptions CallGraphQlTokenApi ', authOptions);
    return axios(authOptions)
      .then(res => {
        console.log('CallGraphQlTokenApi res', res);
        return res ? res.data : res;
      })
      .catch(err => {
        console.log('.catch((err) CallGraphQlTokenApi', err);
        handleErrors(err);
      });
  }
};

export const callUploadMyFiles = async (URL, Data, token) => {
  let formData = new FormData();
  formData.append('fileType', 'Resume');
  formData.append('file', Data);
  console.log('Data:--->>API', JSON.stringify(Data));
  console.log('formData:--->>API', JSON.stringify(formData));

  let Conn = await CheckNet();
  if (!Conn) {
    throw '.No internet connection.';
  } else {
    let authOptions = {
      method: 'POST',
      mode: 'cors',
      url: URL,
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    };
    console.log('authOptions CallGraphQlTokenApi ', authOptions);
    return axios(authOptions)
      .then(res => {
        console.log('CallGraphQlTokenApi res', res);
        return res ? res.data : res;
      })
      .catch(err => {
        console.log('.catch((err) CallGraphQlTokenApi', err);
        handleErrors(err);
      });
  }
};

export const callGetRestApis = async URL => {
  let token = GetStoreData().token;
  let Conn = await CheckNet();
  if (!Conn) {
    throw 'No internet connection.';
  } else {
    let authOptions = {
      method: 'GET',
      url: URL,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };
    console.log('url callGetRestApis ', authOptions);

    return axios(authOptions)
      .then(res => {
        //console.log("callGetRestApis res", res);
        return res.data ? res.data : res;
      })
      .catch(err => {
        console.log('.catch((err) callGetRestApis',URL, err);
        handleErrors(err);
      });
  }
};

export const CallDocUploadApi = response => {
  let ResponseUri = response.uri;
  let ret = String(response.uri);
  if (ret.includes('//file:///')) {
    ret = String(response.uri).replace('//file:///', '');
  }
  if (ret.includes('file:///')) {
    ret = String(response.uri).replace('file:///', '');
  }
  let Filename = '';
  let FileType = response.type; //'image/jpeg'
  let imgName = response.name;
  if (ResponseUri) {
    if (typeof imgName === 'undefined' || !imgName) {
      // on iOS, using camera returns undefined fileName. This fixes that issue, so API can work.
      var getFilename = ResponseUri.split('/');
      Filename = moment() + '_' + getFilename[getFilename.length - 1];
    } else {
      Filename = moment() + '_' + response.name;
    }
    if (!response.type) {
      let Start = 'image/';
      var getFileType = ResponseUri.split('.');
      FileType = Start + getFileType[getFileType.length - 1];
    } else {
      FileType = response.type;
    }

    console.log('CallImageUploadApi', FileType, Filename, ret, ResponseUri);
  }

  let formData = new FormData();
  if (ResponseUri) {
    formData.append('file', {uri: ResponseUri, name: Filename, type: FileType});
  }
  var authOptions = {
    method: 'POST',
    url: Config().IUpload,
    data: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  };
  console.log('authOptions CallImageUploadApi :-  ', authOptions);

  return axios(authOptions)
    .then(response => {
      console.log('response.data CallImageUploadApi :-  ', response.data);
      return response.data;
    })
    .catch(error => {
      console.log('error CallImageUploadApi in fetch method :-  ', error);
      handleErrors(error);
    });
};

export const CallImageUploadApi = response => {
  let ResponseUri = response.uri;
  let ret = String(response.uri);
  if (ret.includes('//file:///')) {
    ret = String(response.uri).replace('//file:///', '');
  }
  if (ret.includes('file:///')) {
    ret = String(response.uri).replace('file:///', '');
  }
  let Filename = '';
  let FileType = response.type; //'image/jpeg'
  let imgName = response.fileName;
  if (ResponseUri) {
    if (typeof imgName === 'undefined' || !imgName) {
      // on iOS, using camera returns undefined fileName. This fixes that issue, so API can work.
      var getFilename = ResponseUri.split('/');
      Filename = moment() + '_' + getFilename[getFilename.length - 1];
    } else {
      Filename = moment() + '_' + response.fileName;
    }
    if (!response.type) {
      let Start = 'image/';
      var getFileType = ResponseUri.split('.');
      FileType = Start + getFileType[getFileType.length - 1];
    } else {
      FileType = response.type;
    }

    console.log('CallImageUploadApi', FileType, Filename, ret, ResponseUri);
  }

  let formData = new FormData();
  if (ResponseUri) {
    formData.append('file', {uri: ResponseUri, name: Filename, type: FileType});
  }
  var authOptions = {
    method: 'POST',
    url: Config().IUpload,
    data: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  };
  console.log('authOptions CallImageUploadApi :-  ', authOptions);

  return axios(authOptions)
    .then(response => {
      console.log('response.data CallImageUploadApi :-  ', response.data);
      return response.data;
    })
    .catch(error => {
      console.log('error CallImageUploadApi in fetch method :-  ', error);
      handleErrors(error);
    });
};

export const callGetBodyApis = async (URL, data) => {
  let token = GetStoreData().token;
  let Conn = await CheckNet();
  if (!Conn) {
    throw 'No internet connection.';
  } else {
    let authOptions = {
      method: 'GET',
      url: URL,
      params: data,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };
    console.log('url callGetBodyApis ', authOptions);
    return axios(authOptions)
      .then(res => {
        //console.log("callGetBodyApis res", res);
        return res.data ? res.data : res;
      })
      .catch(err => {
        console.log('.catch((err) callGetRestApis', err);
        handleErrors(err);
      });
  }
};

export const callGetPlacesApi = async (URL, data) => {
  let Conn = await CheckNet();
  if (!Conn) {
    throw 'No internet connection.';
  } else {
    let authOptions = {
      method: 'GET',
      url: URL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };
    console.log('url callGetPlacesApi ', authOptions);
    return axios(authOptions)
      .then(res => {
        //console.log("callGetBodyApis res", res);
        return res.data ? res.data : res;
      })
      .catch(err => {
        console.log('.catch((err) callGetPlacesApi', err);
        handleErrors(err);
      });
  }
};

function handleErrors(error) {
  console.log('Error====> :- ', error);
  if (!error.response) {
    // network error
    throw 'Please check your network connection.';
  } else {
    // http status code
    const code = error?.response?.status;
    // response data
    const response = error?.response?.data;
    console.log('code :- ' + code + ' response :- ', response);
    

    if (code && code == 400 || code && code == 401) {
      if (response && response.error) { throw response.error; }
       else { throw 'Please Provide valid credential.'; }
    } 
    // else if (code == 401) { throw response.error; } 
    else { throw 'Oops server error occurred'; }
  }
}
