import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { WebView } from 'react-native-webview';
import Loader from './Loader';


export default function WebViewComp(props) {
  const IndicatorLoadingView = () => {
    return <Loader />
  }


  const { webViewData } = props
  return (<WebView
    source={{ html: webViewData }}
    scalesPageToFit={false}
    scrollEnabled={false}
    style={{paddingVertical: 150, width: '100%'}}
  />
  )
}
