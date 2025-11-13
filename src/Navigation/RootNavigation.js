// RootNavigation.js
import * as React from 'react';

export const navigationRef = React.createRef();
export const isReadyRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function getCurrentRouteName(){
  if (navigationRef?.current) {
    return navigationRef?.current?.getCurrentRoute()?.name;
  }
  return null;
};
export function dispatchMethod(obj) {
  navigationRef.current?.dispatch(obj);
}

// add other navigation functions that you need and export them