package com.createGeofense;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.createGeofense.interfaces.CreateGeofenseDelegate;
import com.createGeofense.models.API.LocationData;
import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.Callback;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.ArrayList;


public abstract class GeofenseJourneyActivity extends ReactActivity {
    private int PERMISSION_REQEST_CODE = 100;

    private  CreateGeoFence createGeoFence;
    private CreateGeoFence.CreateGeofenseBuilder createGeofenseBuilder;
    private ArrayList<LocationData> locationArrayData;



    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        Log.d("MainActivity", "onCreate: jitendra");

    }


    public ArrayList<LocationData> getLocationArrayData() {
        return locationArrayData;
    }

    public void setLocationArrayData(ArrayList<LocationData> locationArrayData) {
        this.locationArrayData = locationArrayData;
    }


    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        if (permissions.length > 0 && grantResults.length > 0)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                if (requestCode == PERMISSION_REQEST_CODE &&
                        permissions[0].equals(Manifest.permission.ACCESS_FINE_LOCATION) &&
                        permissions[1].equals(Manifest.permission.ACCESS_COARSE_LOCATION) &&
                        permissions[2].equals(Manifest.permission.ACCESS_BACKGROUND_LOCATION)
                        &&
                        grantResults[0] == 0
                        && grantResults[1] == 0
                        && grantResults[2] == 0
                ) {

                    initSDK();

                }
            } else {
                if (requestCode == PERMISSION_REQEST_CODE &&
                        permissions[0].equals(Manifest.permission.ACCESS_FINE_LOCATION)
                        && permissions[1].equals(Manifest.permission.ACCESS_COARSE_LOCATION)
                        &&
                        grantResults[0] == 0
                        && grantResults[1] == 0
                ) {

                    initSDK();

                }
            }
    }

    private String getDeviceId(Context context) {
        return Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ANDROID_ID);
    }

    public void initSDK() {
        createGeoFence = createGeofenseBuilder.setLocationData(locationArrayData)
                .setCreateGeofenseDelegate(new CreateGeofenseDelegate() {
                    @Override
                    public void didStartSuccessfully() {
                        //  successCallback.invoke("Success");
                        Log.d("MobileJourneyActivity", "didStartSuccessfully: ");

                        getReactInstanceManager().getCurrentReactContext()
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("didStartSuccessfully", "Success");
                    }

                    @Override
                    public void didFailStarting(String s) {
                        //   errorCallback.invoke(s);
                        Log.d("MobileJourneyActivity", "didFailStarting: " +s);

                        getReactInstanceManager().getCurrentReactContext()
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("didFailStarting", s);
                    }

                    @Override
                    public void userDidEnteredPolygon(ArrayList<String> ids) {
                        Log.d("MobileJourneyActivity", "userDidEnteredPolygon: " + ids);
                        getReactInstanceManager().getCurrentReactContext()
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("userDidEnteredPolygon", ids.toString());
                    }

                    @Override
                    public void userDidExitPolygon(ArrayList<String> ids) {
                        Log.d("MobileJourneyActivity", "userDidExitPolygon: " + ids);
                        getReactInstanceManager().getCurrentReactContext()
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("userDidExitPolygon",  ids.toString());
                    }





                })
                .build();

        getLifecycle().addObserver(createGeoFence);

    }

    public void startSDK(boolean isAllow){
        if(createGeoFence!=null){
            createGeoFence.startSDK(isAllow);
        }
    }

    public void SdkIntilaize(CreateGeoFence.CreateGeofenseBuilder createGeofenseBuilder) {
        this.createGeofenseBuilder = createGeofenseBuilder;


        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                    != PackageManager.PERMISSION_GRANTED ||
                    ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION)
                            != PackageManager.PERMISSION_GRANTED ||
                    ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_BACKGROUND_LOCATION)
                            != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.ACCESS_FINE_LOCATION,
                                Manifest.permission.ACCESS_COARSE_LOCATION,
                                Manifest.permission.ACCESS_BACKGROUND_LOCATION
                        },
                        PERMISSION_REQEST_CODE);
                return;
            }
        } else {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                    != PackageManager.PERMISSION_GRANTED ||
                    ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION)
                            != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.ACCESS_FINE_LOCATION,
                                Manifest.permission.ACCESS_COARSE_LOCATION
                        },
                        PERMISSION_REQEST_CODE);
                return;
            }
        }


        initSDK();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        if (createGeoFence != null)
            getLifecycle().removeObserver(createGeoFence);
    }

}
