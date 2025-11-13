package com.workforcemgr;

import android.util.Log;

import com.createGeofense.CreateGeoFence;
import com.createGeofense.GeofenseJourneyActivity;
import com.createGeofense.models.API.LocationData;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableArray;

import com.facebook.react.uimanager.IllegalViewOperationException;
//import com.mobilejourney.MobileJourney_GIS;
import com.facebook.react.module.annotations.ReactModule;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.util.ArrayList;

@ReactModule(name = GeoFenceModule.NAME)
public class GeoFenceModule extends ReactContextBaseJavaModule {

    public static final String NAME = "GeoFenceModule";

//    private final ReactApplicationContext reactContext;

    public GeoFenceModule(ReactApplicationContext reactContext) {
        super(reactContext);
//        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void startSDK(ReadableMap readableMap) {
        try {
            if (readableMap != null) {
                boolean isAllow = readableMap.getBoolean("isAllow");
                GeofenseJourneyActivity currentActivity = (GeofenseJourneyActivity) getCurrentActivity();
                if (currentActivity != null)
                    currentActivity.startSDK(isAllow);
            }
        } catch (Exception e) {
           // e.getMessage();
        }
    }

    @ReactMethod
    public void SDKInitialize(ReadableMap readableMap) {
        Log.d(NAME, "SDKInitialize: ");
        try {
            if (readableMap == null) {
                return;
            }
           String geofenceArray = readableMap.getString("geofenceArray");
            Log.d(NAME, "geofenceArray: "+ geofenceArray);
            ArrayList<LocationData> locationDatas = new Gson().fromJson(geofenceArray, new TypeToken<ArrayList<LocationData>>() {
            }.getType());

            GeofenseJourneyActivity currentActivity = (GeofenseJourneyActivity) getCurrentActivity();
            if (currentActivity != null) {
                CreateGeoFence.CreateGeofenseBuilder mobileJourney_gis = new  CreateGeoFence.CreateGeofenseBuilder(currentActivity);

                currentActivity.setLocationArrayData(locationDatas);
                currentActivity.SdkIntilaize(mobileJourney_gis);

            }

        } catch (IllegalViewOperationException e) {
//            errorCallback.invoke(e.getMessage());
        }
    }

}
