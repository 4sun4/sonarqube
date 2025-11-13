import { combineReducers } from 'redux';
import { CONSTRAINT_TEXT } from '../Util/String';
import Types from './Types';

const INITIAL_STATE = {
    loginData: {},
    changePassword:{},
    postId: 0,
    tabName: CONSTRAINT_TEXT.FOCUS_LIST,
    routeName: CONSTRAINT_TEXT.AuthStack,
    baseUrl:"",
    facility:""
};
export const loginReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case Types.LOGIN_STATUS:
            return {
                ...state,
                loginData: action.data,
            };
        case Types.CHANGE_PASSWORD_TOKEN:
            return {
                ...state,
                changePassword: action.data,
            };
        case Types.NEWUSER:
            return {
                ...state,
                newUser: action.data,
    
        };
        case Types.POST_ID:
            return {
                ...state,
                postId: action.postId,

            };
        case Types.ROUTE_NAME:
            return {
                ...state,
                routeName: action.routeName,

            };
        case Types.SET_BASE_URL:
            return {
                ...state,
                baseUrl: action?.data?.url,
                facility:action?.data?.facility
            };  
        case "persist/REHYDRATE":
            // handling the initial conditions when no persisted data 
            const loginDetail = action.payload ? action.payload.loginStatus.loginData : {};
            const changePasswordDetail = action.payload ? action.payload.loginStatus.changePassword : {};
            const url = action.payload ? action.payload.loginStatus.baseUrl : "";
            const facilityName = action.payload ? action.payload.loginStatus.facility : "";
 
            return {
                ...state,
                loginData: loginDetail,
                baseUrl: url,
                facility:facilityName,
                changePassword:changePasswordDetail
            };
            case Types.LOG_OUT:
            return {
                ...INITIAL_STATE,

            };
        default:
            return state;
    }
}

const HOME_INITIAL_STATE = {
    UserDetails: {},
    EmergencyContact: {},
    ClockPopUpData: {},
    ClockPopup: false,
    ClockInTime: null,
    ClockOutTime: null,
    StartBrakeTime: null,
    EndBrakeTime: null,
    TakeBrake: { time: '', Bool: false },
    EndBrake: { time: '', Bool: false },
    ShowClockIn: { time: '', Bool: true },
    ShowClockOut: { time: '', Bool: false },
    ProfilePic:'',
    unreadMessageCount:0
};


export const HomeReducer = (state = HOME_INITIAL_STATE, action) => {
    
    switch (action.type) {
        case Types.GET_DETAILS:
            return {
                ...state,
                UserDetails: action.data,

            };
        case Types.PROFILE_PIC:
                return {
                    ...state,
                    ProfilePic: action.data,
    
                };
        case Types.EMERGENCY_CONTACT:
            return {
                ...state,
                EmergencyContact: action.data,

            };
        case Types.CLOCK_POPUP:
            return {
                ...state,
                ClockPopup: action.data,

            };
        case Types.CLOCK_POP_DATA:
            return {
                ...state,
                ClockPopUpData: action.data,

            };
        case Types.SHOW_CLOCK_IN:
            return {
                ...state,
                ShowClockIn: action.data,

            }; case Types.SHOW_CLOCK_OUT:
            return {
                ...state,
                ShowClockOut: action.data,

            };
        case Types.TAKE_BRAKE:
            return {
                ...state,
                TakeBrake: action.data,

            };
        case Types.END_BRAKE:
            return {
                ...state,
                EndBrake: action.data,

            };
        case Types.END_BRAKE_TIME:
            return {
                ...state,
                EndBrakeTime: action.data,

            };
        case Types.START_BRAKE_TIME:
            return {
                ...state,
                StartBrakeTime: action.data,

            };
        case Types.CLOCK_OUT_TIME:
            return {
                ...state,
                ClockOutTime: action.data,

            };
        case Types.CLOCK_IN_TIME:
            return {
                ...state,
                ClockInTime: action.data,

            };
        case Types.SAVE_UNREAD_MSG_COUNT:
                return {
                    ...state,
                    unreadMessageCount: action.data,
                };
        case Types.LOG_OUT:
            return {
                ...HOME_INITIAL_STATE,

            };
            case "persist/REHYDRATE":
                // handling the initial conditions when no persisted data 
                if (action.payload&&action.payload.HomeDetails) {
                    const { UserDetails } = action.payload ? action.payload.HomeDetails : null;
                    return {
                        ...state,
                        UserDetails:UserDetails?UserDetails:false
                    };
                }
                case Types.LOG_OUT:
                    return {
                        ...HOME_INITIAL_STATE,
                    };
        default:
            return state;
    }
}

const SEETING_INITIAL_STATE = {
    LocationStatus: false,
    LocationPermission: false,
    LocationFlag: true,
    Cordinates: null,
};

export const SettingReducer = (state = SEETING_INITIAL_STATE, action) => {
    switch (action.type) {
        case Types.LOCATION_STATUS:
            return {
                ...state,
                LocationStatus: action.data,
            };
        case Types.LOCATION_PERMISSION:
            return {
                ...state,
                LocationPermission: action.data,
            };

        case Types.LOCATION_FLAG:
            return {
                ...state,
                LocationFlag: action.data,
            };

        case Types.LOCATION_CORDS:
            return {
                ...state,
                Cordinates: action.data,
            };
       
            case "persist/REHYDRATE":
                // handling the initial conditions when no persisted data 
                if (action.payload&&action.payload.SettingDetails) {
                    const { LocationStatus } = action.payload ? action.payload.SettingDetails : null;
                    return {
                        ...state,
                        LocationStatus:LocationStatus?LocationStatus:false
                    };
                }
                case Types.LOG_OUT:
                    return {
                        ...SEETING_INITIAL_STATE,
        
                    };
        default:
            return state;
    }
}


const TimeSheet_INITIAL_STATE = {
    SelectedTimeSheet: null,
    AddTimeSheetData: null,
    TimeSheetPreviewData: null,
    AllTimeSheet: null
};

export const TimeSheetReducer = (state = TimeSheet_INITIAL_STATE, action) => {
    switch (action.type) {
        case Types.SELECTED_TIME_SHEET:
            return {
                ...state,
                SelectedTimeSheet: action.data,
            };
        case Types.ADD_TIME_SHEET:
            return {
                ...state,
                AddTimeSheetData: action.data,
            };
        case Types.TIME_SHEET_PREVIEW:
            return {
                ...state,
                TimeSheetPreviewData: action.data,
            };
        case Types.ALL_TIME_SHEET:
            return {
                ...state,
                AllTimeSheet: action.data,
            };
        case "persist/REHYDRATE":
            // handling the initial conditions when no persisted data 
            if (action.payload) {
                const { AddTimeSheetData, AllTimeSheet, TimeSheetPreviewData,
                    SelectedTimeSheet } = action.payload ? action.payload.TimeSheetStore : null;
                return {
                    ...state,
                    AddTimeSheetData: AddTimeSheetData ? AddTimeSheetData : null,
                    AllTimeSheet: AllTimeSheet ? AllTimeSheet : null,
                    SelectedTimeSheet: SelectedTimeSheet ? SelectedTimeSheet : null,
                    TimeSheetPreviewData: TimeSheetPreviewData ? TimeSheetPreviewData : null,
                };
            }
            case Types.LOG_OUT:
            return {
                ...TimeSheet_INITIAL_STATE,

            };
        default:
            return state;
    }
}


const JOB_INITIAL_STATE = {
    AllClockInData: [],
    TodayShiftData:[],
    TodayShiftObj: []
};

export const JobReducer = (state = JOB_INITIAL_STATE, action) => {
    switch (action.type) {
        case Types.CLOCK_IN_LIST:
            return {
                ...state,
                AllClockInData: action.data,
            };
            case Types.TODAY_SHIFTS:
                return {
                    ...state,
                    TodayShiftData: action.data,
                };
                case Types.TODAY_SHIFTS_OBJ:
                return {
                    ...state,
                    TodayShiftObj: action.data,
                };
            case "persist/REHYDRATE":
                // handling the initial conditions when no persisted data 
                if (action.payload&&action.payload.JobStore) {
                    //console.log('action.payload',action.payload);
                    const {AllClockInData,TodayShiftData,TodayShiftObj}=action.payload.JobStore
                    return {
                        ...state,
                        AllClockInData:AllClockInData?AllClockInData:[],
                        TodayShiftData:TodayShiftData?TodayShiftData:[],
                        TodayShiftObj:TodayShiftObj?TodayShiftObj:null
                    };
                }
                case Types.LOG_OUT:
                    return {
                        ...JOB_INITIAL_STATE,
        
                    };
        default:
            return state;
    }
}

const MESSAGE_INITIAL_STATE = {
    messageData: [],
};

export const messageReducer = (state = MESSAGE_INITIAL_STATE, action) => {
    switch (action.type) {
        case Types.MESSAGE_DATA:
            return {
                ...state,
                messageData: action.data,
            };

        case Types.MESSAGE_TYPE:
            return {
                ...state,
                messageData: [action.data, ...state.messageData],
            };
        case "persist/REHYDRATE":
            const resBool = action.payload && action.payload.messageStore ? action.payload.messageStore.messageData : [];
            return {
                ...state,
                messageData: resBool
            };
        default:
            return state;
    }
}

const OFFLINE_API = {
    offlineApiData:[],
    offlineClockinObj:[]
}

export const offlineApiReducer = (state = OFFLINE_API, action) => {
    switch (action.type) {
        case Types.OFFLINE_API_SAVE:
            return {
                ...state,
                offlineApiData: [...state.offlineApiData, action.data],
            };
        case Types.OFF_CLOCK_IN_OBJ:
            return {
                    ...state,
                    offlineClockinObj: action.data,
            };
        case Types.CLEAR_OFFLINE_API:
                return {
                    ...OFFLINE_API,
    
            };
        case "persist/REHYDRATE":
            if (action.payload) {
                const { offlineApiData, offlineClockinObj, } = action.payload ? action.payload.offlineApiStore : null;
                return {
                    ...state,
                    offlineApiData: offlineApiData ? offlineApiData : null,
                    offlineClockinObj: offlineClockinObj ? offlineClockinObj : null,
                };
            }
        default:
            return state;
    }
}

const APP_INITIAL_STATE = {
    isNetAvailable: true
}
export const appReducer = (state = APP_INITIAL_STATE, action) => {
    switch (action.type) {
        case Types.SAVE_NETWORK_STATUS:
            return {
                ...state,
                isNetAvailable: action.data,
            };
        case "persist/REHYDRATE":
            if (action.payload) {
                return {
                    ...state,
                    isNetAvailable: false
                };
            }
        default:
            return state;
    }
}