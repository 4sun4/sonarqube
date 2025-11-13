import { NativeModules, NativeEventEmitter } from 'react-native';
var CallSDKInitialize = NativeModules.GeoFenceModule;

const moduleEvent = new NativeEventEmitter(CallSDKInitialize);


let RecruitOnline__GIS = function (geofenceArray, succesCallback = null, errorCallback = null
    , showDialogCallback = null, userDidEnteredPolygon = null, userDidExitPolygon = null) {
    console.log('publisherIdpublisherId', geofenceArray);
    let initialSDK = function () {
        console.log("initialSDK");

        if (!geofenceArray) {
            errorCallback("Invalid Publisher Id " + this.geofenceArray)
            return;
        }
        let arrayData = {
            geofenceArray: geofenceArray,

        }

        try {
            CallSDKInitialize.SDKInitialize(arrayData);

        } catch (err) {
            console.log("error" + err);
        }
        this.didStartSuccessfullyListener = moduleEvent.addListener('didStartSuccessfully', (Event) => {
            if (!succesCallback) {
                console.log('didStartSuccessfully is null');
                return;
            }
            succesCallback(Event)
        });
        this.didFailStartingListener = moduleEvent.addListener('didFailStarting', (Event) => {
            if (!errorCallback) {
                console.log('didFailStarting is null');
                return;
            }
            errorCallback(Event)
        });

        this.userDidEnteredPolygonListener = moduleEvent.addListener('userDidEnteredPolygon', (Event) => {
            if (!userDidEnteredPolygon) {
                console.log('userDidEnteredPolygon is null');
                return;
            }
            userDidEnteredPolygon(Event)
        });

        this.userDidExitPolygonListener = moduleEvent.addListener('userDidExitPolygon', (Event) => {
            if (!userDidExitPolygon) {
                console.log('userDidExitPolygon is null');
                return;
            }
            userDidExitPolygon(Event)
        });

    }


    return {
        initializationSDK: initialSDK,
        removeListner() {
            if (this.userDidEnteredPolygonListener){ this.userDidEnteredPolygonListener.remove()}
            if (this.userDidExitPolygonListener){ this.userDidExitPolygonListener.remove()}
            if (this.didStartSuccessfullyListener){ this.didStartSuccessfullyListener.remove()}
            if (this.didFailStartingListener){ this.didFailStartingListener.remove()}
        },
        startSDK(isAllow) {

            let arrayData = {
                isAllow: isAllow
            };

            CallSDKInitialize.startSDK(arrayData);
        }
    }
}



export let RecruitOnline_GISBuilder = function () {
    let succesCallback = null;
    let errorCallback = null;
    let userDidEnteredPolygon = null;
    let userDidExitPolygon = null;
    let recruitOnline__GIS = null;
    let showDialogCallback = null;
    let geofenceArray = null
    return {
        setGeofenceArrayId(publisherId1) {
            console.log('publisherIdpublisherId', publisherId1);

            geofenceArray = publisherId1;
            return this;
        },
        setRecruitOnlineDelegate(errorCallback1, succesCallback1, userDidEnteredPolygon1, userDidExitPolygon1) {
            succesCallback = succesCallback1;
            errorCallback = errorCallback1;
            userDidEnteredPolygon = userDidEnteredPolygon1;
            userDidExitPolygon = userDidExitPolygon1;

            return this;
        },


        build() {
           
            recruitOnline__GIS = RecruitOnline__GIS(geofenceArray,
                succesCallback, errorCallback, showDialogCallback
                , userDidEnteredPolygon, userDidExitPolygon);
            recruitOnline__GIS.initializationSDK();
            recruitOnline__GIS.startSDK(true);
            return this;
        },

        removeListner() {
            console.log('ffffffffffffffffffffffffffff');
            recruitOnline__GIS.removeListner();
        },
        startSDK(isAllow) {
            recruitOnline__GIS.startSDK(isAllow);
        }

    }
}
