package com.createGeofense;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationManager;
import android.os.Build;
import android.os.CountDownTimer;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.Keep;
import androidx.core.content.ContextCompat;
import androidx.lifecycle.Lifecycle;
import androidx.lifecycle.LifecycleObserver;
import androidx.lifecycle.OnLifecycleEvent;

//import com.google.gson.Gson;
import com.createGeofense.Util.Constraints;
import com.createGeofense.Util.Utility;
import com.createGeofense.broadcastReceiver.BuildingBroadCastReceiver;
import com.createGeofense.geofence.CreateGeoFences;
import com.createGeofense.interfaces.GeofenceListener;
import com.createGeofense.interfaces.GetLocationListener;
import com.createGeofense.interfaces.CreateGeofenseDelegate;
import com.createGeofense.location.CurrentLocation;
import com.createGeofense.location.GetCurrentLocation;
import com.createGeofense.models.API.LocationData;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;


public class CreateGeoFence implements LifecycleObserver {

    private String TAG ="CreateGeoFence";
    private CurrentLocation currentLocation = null;
    private final Activity mActivity;
    @Keep
    private final CreateGeofenseBuilder createGeofenseBuilder;
    private Location mLastLocation = null;
    private BuildingBroadCastReceiver mBuildingBroadCastReceiver;
    private boolean isGetAPICall = true;
    private CreateGeoFences createGeoFences;
    private boolean CREATE_GEOFENCE_REQUEST = false;
    private boolean isGeofenceCreate = false;
    private CountDownTimer geofenceCountDownTime;


    /**
     * create Constructor and call start Service method...
     *
     * @param createGeofenseBuilder builder class reference.
     * @param context                  Activity reference.
     */
    private CreateGeoFence(CreateGeofenseBuilder createGeofenseBuilder, Context context) {
        mActivity = (Activity) context;

        this.createGeofenseBuilder = createGeofenseBuilder;
    }



    /**
     * activtiy lifecycle OnResume method...
     */
    @OnLifecycleEvent(Lifecycle.Event.ON_RESUME)
    public void OnResume() {
        //when GPS is not turn on ,then for location refesh call startServices second time.
        if (currentLocation != null) {
            currentLocation.destroyService();
            if (GetCurrentLocation.isGPS) {
                currentLocation.startLocationUpdates();
                GetCurrentLocation.isGPS = false;
                isGeofenceCreate = true;
            }
        } else {
            startServices();

        }

        if (isGeofenceCreate) {
            isGPSOnThenCreateGeofence();
            isGeofenceCreate = false;
        }


    }


    /**
     * activtiy lifecycle onStop method...
     */
    @OnLifecycleEvent(Lifecycle.Event.ON_STOP)
    public void OnStop() {
        if (currentLocation != null) {
            try {
                currentLocation.createForegroundService();
            } catch (Exception e) {
                e.printStackTrace();
                Log.d(TAG, "OnStop: " + e.getMessage());
            }
        }
        isGetAPICall = true;
    }


    /**
     * activtiy lifecycle onDestroy method...
     */
    @OnLifecycleEvent(Lifecycle.Event.ON_DESTROY)
    public void OnDestroy() {
        distroyService();
    }

    @Keep
    public void startSDK(boolean isAllow) {
        Log.d(TAG, "startSDK:-- ");

        startServices();

    }

    /**
     * call Start service method from publisher App
     */
    private void startServices() {
        isGetAPICall = false;
        Log.d(TAG, "startServices:-- "+ createGeofenseBuilder.createGeofenseDelegate);
        if (createGeofenseBuilder.createGeofenseDelegate == null) {
            return;
        }


        Log.d(TAG, "startServices:arterrere-- ");


        startProcess();

    }


    private void startProcess() {
        //get start current location...
        Log.d(TAG, "startProcess:-- ");
        getCurrentLocation();

        isGPSOnThenCreateGeofence();

    }


    /**
     * find accurate location...
     *
     * @param location location
     * @return if false,then location not accurate. if true,then location accurate.
     */
    private boolean showAccurateLocation(Location location) {
        if (location == null) {
            return false;
        }
        if (location.getAccuracy() < 0) {
            return false;
        }
        if (location.getAccuracy() > 100.0) {
            return false;
        }
        long a = Utility.getTime() - location.getTime();
        int age = (int) (Math.abs(a) / (1000 * 60));

        if (age > 10) {
            return false;
        }

        if (mLastLocation == null) {
            mLastLocation = location;
            return true;
        }

        double dis = location.distanceTo(mLastLocation);
        if (dis <= (location.getAccuracy() * 0.4)) {
            return false;
        }

        mLastLocation = location;
        return true;
    }


    /**
     * Get current location and tracking...
     */
    private void getCurrentLocation() {
        if (currentLocation == null)
            currentLocation = new CurrentLocation.CurrentLocationBuilder(mActivity)
                    .setGetLocationListener(new GetLocationListener() {
                        @Override
                        public void onSuccesfulLocation(final Location location) {
                            Log.d(TAG, "onReceive: currentLocation start");

                            if (showAccurateLocation(location)) {
                                Log.d(TAG, "onSuccesfulLocation: location Aquricy " + CREATE_GEOFENCE_REQUEST);
                                if (CREATE_GEOFENCE_REQUEST) {
                                    isGPSOnThenCreateGeofence();
                                }
                            }

                        }

                        @Override
                        public void onFailedLocation(String errorMassage) {
                            Log.d(TAG, "onFailedLocation: " + errorMassage);
                            Objects.requireNonNull(createGeofenseBuilder.createGeofenseDelegate).didFailStarting(errorMassage);
                        }
                    })
                    .build();

    }


    /**
     * get store data for geofence create...
     */
    private void getStoreDataForGeofenceCreate() {

        new Thread(() -> {
            try {

                if (mBuildingBroadCastReceiver == null) {
                    mBuildingBroadCastReceiver = new BuildingBroadCastReceiver(createGeofenseBuilder, mActivity);
                    mActivity.registerReceiver(mBuildingBroadCastReceiver,
                            new IntentFilter(Constraints.CUSTOM_BROADCAST_NAME));
                    if (currentLocation != null)
                        mBuildingBroadCastReceiver.setCurrentLocation(currentLocation);
                }
                ArrayList<LocationData> locationArrayData = getNearestTwientyGeofenceData(this.createGeofenseBuilder.locationArrayData);
                if (locationArrayData != null) {
//                        buildingAndStoreDataList.clear();
//                        buildingAndStoreDataList.addAll(storeAndBuildingData);
                    if (locationArrayData.size() != 0) {
                        createGeofence(locationArrayData);
                        //  Log.d(TAG, "run: nearest createGeofence " + buildingAndStoreDataList.size());
                    }

                } else {
                    mActivity.runOnUiThread(() -> {
                        if (!Utility.isNetworkAvailable(mActivity))
                            Objects.requireNonNull(createGeofenseBuilder.createGeofenseDelegate).didFailStarting("failled--");
                    });
                }

            } catch (Exception e) {
                e.printStackTrace();
                Log.d(TAG, "run: getStoresFromLocalDB " + e.getMessage());
            }
        }).start();
    }


    private ArrayList<LocationData> getNearestTwientyGeofenceData(ArrayList<LocationData> locationArrayData) {
        //   ArrayList<StoreAndBuildingData> nearTwintyGeofenceData = new ArrayList<>();

        if (mLastLocation != null && locationArrayData != null)
            for (int i = 0; i < locationArrayData.size(); i++) {
                LocationData locationData = locationArrayData.get(i);
                Location location = new Location("");
                location.setLatitude(locationData.getLatitude());
                location.setLongitude(locationData.getLongitude());
                double dis = mLastLocation.distanceTo(location);
                locationData.setDistance(dis);

            }
        if (locationArrayData != null)
            Collections.sort(locationArrayData, (o1, o2) -> (int) (o1.getDistance() - o2.getDistance()));
        return locationArrayData;
    }



    /**
     * generate  multiple Geofence request data.
     *
     * @param locationArrayDataList store and Building polygone coordinate data
     */
    private void createGeofence(List<LocationData> locationArrayDataList) {

        if (ContextCompat.checkSelfPermission(mActivity, Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {

            Log.d(TAG, "createGeofence: Please Provide ACCESS_FINE_LOCATION permissions");
            mActivity.runOnUiThread(() -> Objects.requireNonNull(createGeofenseBuilder).createGeofenseDelegate.didFailStarting("Please Provide ACCESS_FINE_LOCATION Permission!"));

            return;
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            if (ContextCompat.checkSelfPermission(mActivity, Manifest.permission.ACCESS_BACKGROUND_LOCATION)
                    != PackageManager.PERMISSION_GRANTED) {

                Log.d(TAG, "createGeofence: Please Provide ACCESS_BACKGROUND_LOCATION permissions");
                mActivity.runOnUiThread(() -> Objects.requireNonNull(createGeofenseBuilder).createGeofenseDelegate.didFailStarting("Please Provide ACCESS_BACKGROUND_LOCATION Permission!"));

                return;
            }
        }

        try {
            if (createGeoFences != null) {
                createGeoFences.removeGeofense();
            } else {
                createGeoFences = new CreateGeoFences(mActivity);
            }
            if (locationArrayDataList.size() != 0) {

                int count_geofence = Math.min(locationArrayDataList.size(), 20);

                for (int i = 0; i < count_geofence; i++) {

                    LocationData locationData;
                    try {

                        locationData = locationArrayDataList.get(i);
                        createGeoFences.addGeofence(String.valueOf(locationData.getOrder_id())
                                , locationData.getLatitude(),
                                locationData.getLongitude(),
                                Float.parseFloat(locationData.getJob_radius()));
                    } catch (Exception e) {
                        e.printStackTrace();
                        Log.d(TAG, "createGeofence: " + e.getMessage());
                        // continue;
                    }
                }

                createGeoFences.createGeofenseBuildingAndStore(new GeofenceListener() {
                    @Override
                    public void onSuccess(String s) {
                        Log.d(TAG, "onSuccess: Geofence created");
                        if (!CREATE_GEOFENCE_REQUEST) {
                            Objects.requireNonNull(createGeofenseBuilder.createGeofenseDelegate).didStartSuccessfully();
                        }
                        CREATE_GEOFENCE_REQUEST = false;

                        createGeofenceCountDownTime();

                    }

                    @Override
                    public void onFailed(String s) {
                        Log.d(TAG, "onFailed: Geofence " + s);
                        Objects.requireNonNull(createGeofenseBuilder.createGeofenseDelegate).didFailStarting("Error Geofence create fail. " + s);
                    }
                });


            }


        } catch (
                final Exception e) {
            e.printStackTrace();
            Log.d(TAG, "createGeofence: " + e.getMessage());
        }
    }

    private void createGeofenceCountDownTime() {
        if (geofenceCountDownTime == null) {
            geofenceCountDownTime = new CountDownTimer(30 * 60 * 1000, 30 * 60 * 1000) {
                public void onTick(long millisUntilFinished) {

                }

                public void onFinish() {
                    CREATE_GEOFENCE_REQUEST = true;
                    Log.d(TAG, "onFinish: " + CREATE_GEOFENCE_REQUEST);
                }
            }.start();
            if (mBuildingBroadCastReceiver != null) {
                mBuildingBroadCastReceiver.setGeofenceCountDownTime(geofenceCountDownTime);
            }
        } else {
            geofenceCountDownTime.start();
        }
    }


    /**
     * Is GPS On then Create Geofence...
     */
    private void isGPSOnThenCreateGeofence() {
        LocationManager manager = (LocationManager) mActivity.getSystemService(Context.LOCATION_SERVICE);
        if (manager != null)
            if (manager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                getStoreDataForGeofenceCreate();
            }
//        else {
//             //   MyPrefences.getInstance(mActivity).setBoolean(Constraints.CREATE_GEOFENCE_REQUEST, true);
//            }
    }




    /**
     * destroy service...
     */
    private void distroyService() {

        //unregister broadcast receiver..
        if (mBuildingBroadCastReceiver != null && mActivity != null) {
            mBuildingBroadCastReceiver.stopGetCurrentLocation();

            mActivity.unregisterReceiver(mBuildingBroadCastReceiver);
        }

        if (currentLocation != null) {
            currentLocation.destroyService();
            currentLocation.stopLocationUpdates();

            Log.d(TAG, ": currentLocation  stop");
        }

        if (createGeoFences != null)
            createGeoFences.removeGeofense();

    }


    /**
     * Create Builder class for get publisher data...
     */
    public static class CreateGeofenseBuilder {


        @Keep
        private CreateGeofenseDelegate createGeofenseDelegate;
        private ArrayList<LocationData> locationArrayData;
        private Context mContext;

        public CreateGeofenseDelegate getCreateGeofenseDelegate() {
            return createGeofenseDelegate;
        }

        public CreateGeofenseBuilder(Context context) {
            this.mContext = context;
        }

        public CreateGeofenseBuilder setCreateGeofenseDelegate(CreateGeofenseDelegate CreateFence) {
            this.createGeofenseDelegate = CreateFence;
            return this;
        }

        public CreateGeofenseBuilder setLocationData(ArrayList<LocationData> locationArrayData) {
            this.locationArrayData = locationArrayData;
            return this;
        }

        public CreateGeoFence build() {
            return new CreateGeoFence(this, mContext);
        }
    }
}
