import { createStore, applyMiddleware } from 'redux';
import appreducer from './MainReducer'
import thunk from 'redux-thunk'
import logger from "redux-logger";
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
    key: 'root',
    storage:AsyncStorage,
    timeout: null, 
    // blacklist: ['navigation', 'isLoading', 'hasErrored'],
    whitelist:['loginStatus','TimeSheetStore',"offlineApiStore","SettingReducer","JobStore","HomeDetails"]
  }

  const persistedReducer = persistReducer(persistConfig, appreducer)

export const store = createStore(persistedReducer, applyMiddleware(logger,thunk));
export const persistor = persistStore(store);
