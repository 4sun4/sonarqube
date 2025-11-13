import { combineReducers } from 'redux';
import { appReducer, HomeReducer, JobReducer, loginReducer, messageReducer, offlineApiReducer, SettingReducer, TimeSheetReducer } from './CommonReducer';

export default combineReducers({
    loginStatus: loginReducer,
    HomeDetails:HomeReducer,
    SettingDetails:SettingReducer,
    TimeSheetStore:TimeSheetReducer,
    JobStore:JobReducer,
    messageStore:messageReducer,
    offlineApiStore:offlineApiReducer,
    appStore:appReducer

});