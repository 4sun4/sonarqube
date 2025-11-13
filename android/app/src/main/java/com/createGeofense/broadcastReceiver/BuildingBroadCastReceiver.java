package com.createGeofense.broadcastReceiver;

//import static android.content.ContentValues.TAG;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.os.CountDownTimer;
import android.util.Log;

import com.google.android.gms.location.LocationRequest;
import com.createGeofense.CreateGeoFence;
import com.createGeofense.Util.Constraints;
import com.createGeofense.Util.Utility;
import com.createGeofense.interfaces.GetLocationListener;
import com.createGeofense.location.CurrentLocation;
import com.createGeofense.location.GetCurrentLocation;
import com.createGeofense.service.GeofenceTransitionsIntentService;

import java.util.ArrayList;
import java.util.Objects;

/**
 * this class monitoring geofence enter/exit...
 */

public class BuildingBroadCastReceiver extends BroadcastReceiver {
    public  String TAG = "BuildingBroadCastReceiver";

    private Activity mActivity;
    private CreateGeoFence.CreateGeofenseBuilder createGeofenseBuilder;
    private double latitude = 0.0;
    private double longitude = 0.0;
    private Location mLastLocation = null;
    //private CurrentLocation currentLocation;
    private GetCurrentLocation getCurrentLocation;
    private CurrentLocation currentLocation;
    private boolean isLocationAvailableUnderGeofence = false;
    private ArrayList<String> activeGeofenceRequestId;
    private CountDownTimer geofenceCountDownTime;

    public BuildingBroadCastReceiver(CreateGeoFence.CreateGeofenseBuilder createGeofenseBuilder, Context context) {
        mActivity = (Activity) context;
        this.createGeofenseBuilder = createGeofenseBuilder;

        activeGeofenceRequestId = new ArrayList<>();

    }

    public void setCurrentLocation(CurrentLocation currentLocation) {
        this.currentLocation = currentLocation;
    }

    public void setGeofenceCountDownTime(CountDownTimer geofenceCountDownTime) {
        this.geofenceCountDownTime = geofenceCountDownTime;
    }


    @Override
    public void onReceive(Context context, Intent intent) {
        if (Objects.requireNonNull(intent.getAction()).equals(Constraints.CUSTOM_BROADCAST_NAME)) {

            //Get Geofence request list...
            if (activeGeofenceRequestId != null) {
                activeGeofenceRequestId.clear();
                activeGeofenceRequestId.addAll(Objects.requireNonNull(intent.getStringArrayListExtra(GeofenceTransitionsIntentService.ACTIVE_GEOFENCE_LIST)));
            }
            //Get Message Geofece Enter,Exit and Fail...
            String msg = intent.getStringExtra(GeofenceTransitionsIntentService.MASSAGE);

            // Test that the reported transition was of interest.
            if (Objects.requireNonNull(msg).equals(Constraints.GEOFENCE_TRANSITION_ENTER)) {
                Objects.requireNonNull(createGeofenseBuilder.getCreateGeofenseDelegate()).userDidEnteredPolygon(activeGeofenceRequestId);
                Log.d(TAG, "onReceive: Geofence Enter " + activeGeofenceRequestId);

                try {
                    if (currentLocation != null) {
                        currentLocation.stopLocationUpdates();
                        Log.d(TAG, "onReceive: currentLocation stop");
                    }
                    if (geofenceCountDownTime != null) {
                        geofenceCountDownTime.cancel();
                    }
                    getCurrentLocation();



                } catch (Exception e) {
                    e.printStackTrace();
                    Log.d(TAG, "onReceive: " + e.getMessage());
                    // Objects.requireNonNull(mobileJourney_gisBuilder.mobileJourneyDelegate).didFailStarting("Error:" + e.getMessage());
                }


            } else if (Objects.requireNonNull(msg).equals(Constraints.GEOFENCE_TRANSITION_EXIT)) {
                Log.d(TAG, "onReceive: Geofence Exits");
                try {

                    Objects.requireNonNull(createGeofenseBuilder.getCreateGeofenseDelegate()).userDidExitPolygon(activeGeofenceRequestId);

                } catch (Exception e) {
                    if (createGeofenseBuilder != null)
                        Log.d(TAG, "onReceive: " + e.getMessage());
                    // Objects.requireNonNull(mobileJourney_gisBuilder.mobileJourneyDelegate).didFailStarting("Error :" + e.getMessage());
                }


            } else {
                Log.d(TAG, "onReceive: other");
                // Objects.requireNonNull(mobileJourney_gisBuilder.mobileJourneyDelegate).didFailStarting("Error GeofencingEvent" + msg);

            }
        }
    }


    /**
     * find accurate location...
     *
     * @param location location
     * @return if false,then location not accurate. if true,then location accurate.
     */
    private boolean showAccurateLocation(Location location) {
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
        if (getCurrentLocation == null) {
            getCurrentLocation = new GetCurrentLocation.Builder(mActivity)
                    .setGPS(true)
                    .setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY)
                    .setInterval(5 * 1000)
                    .setFastInterval(5 * 1000)
                    .setGetLocationListener(new GetLocationListener() {
                        @Override
                        public void onSuccesfulLocation(Location location) {
                            // getLocationListener.onSuccesfulLocation(location);

                            Log.d(TAG, "onSuccesfulLocation: getCurrentLocation start");
                            if (showAccurateLocation(location)) {

                            }
                        }

                        @Override
                        public void onFailedLocation(String errorMassage) {

                        }

                    })
                    .build();
        } else {
            getCurrentLocation.startLocationUpdates();
        }
    }


    public void stopGetCurrentLocation() {
        if (getCurrentLocation != null) {
            getCurrentLocation.stopLocationUpdates();
            Log.d(TAG, "onReceive: getCurrentLocation stop");
        }
    }



}
