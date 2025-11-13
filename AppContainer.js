
import React, { useEffect } from "react";
import RootStack from "./src/Navigation/Route";
import NetInfo from "@react-native-community/netinfo";
import Types from "./src/redux/Types";
import { useDispatch } from "react-redux";

const AppContainer = () => {
  
    return (
        <RootStack />
    )
}

export default AppContainer