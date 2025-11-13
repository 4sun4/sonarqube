package com.createGeofense.geofence;

import android.Manifest;
import android.app.Activity;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.util.Log;

import androidx.core.app.ActivityCompat;

import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.GeofencingClient;
import com.google.android.gms.location.GeofencingRequest;
import com.google.android.gms.location.LocationServices;
import com.createGeofense.interfaces.GeofenceListener;
import com.createGeofense.service.GeofenceTransitionsIntentService;

import java.util.ArrayList;


public class CreateGeoFences {

    private Activity mActivity;
    private GeofencingClient mGeofencingClient;
    private GeofenceListener mGeofenceListener;
    private ArrayList<Geofence> mBuildingGeofenceList;
    private PendingIntent geofencePendingIntent;

    public CreateGeoFences(Activity mActivity) {
        this.mActivity = mActivity;
        mGeofencingClient = LocationServices.getGeofencingClient(mActivity);
        mBuildingGeofenceList = new ArrayList<>();

    }

    /**
     * create multiple geofence object...
     *
     * @param requestId requestId
     * @param latitude latitude
     * @param longitude longitude
     * @param radius radius
     */
    public void addGeofence(String requestId,
                            double latitude,
                            double longitude, float radius) {
        mBuildingGeofenceList.add(new Geofence.Builder()
                // Set the request ID of the geofence. This is a string to identify this
                // geofence.
                .setRequestId(requestId)
                .setCircularRegion(
                        latitude,
                        longitude,
                        radius
                )
                .setExpirationDuration(Geofence.NEVER_EXPIRE)
                .setTransitionTypes(Geofence.GEOFENCE_TRANSITION_ENTER | Geofence.GEOFENCE_TRANSITION_EXIT)
                .build());

    }

    //create geofense
    public void createGeofenseBuildingAndStore(GeofenceListener geofenceListener) {
        this.mGeofenceListener = geofenceListener;

        if (mBuildingGeofenceList.size() != 0) {
            if (ActivityCompat.checkSelfPermission(mActivity, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                // TODO: Consider calling
                //    ActivityCompat#requestPermissions
                // here to request the missing permissions, and then overriding
                //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                //                                          int[] grantResults)
                // to handle the case where the user grants the permission. See the documentation
                // for ActivityCompat#requestPermissions for more details.
                return;
            }
            mGeofencingClient.addGeofences(getGeofencingRequest(mBuildingGeofenceList),
                    getGeofencePendingIntent())
                    .addOnSuccessListener(mActivity, aVoid -> {
                        mGeofenceListener.onSuccess("Geofence create Successfully");
                        //  Toast.makeText(mActivity, "add geofence", Toast.LENGTH_SHORT).show();
                        Log.d("Success fencebuilding", "onSuccess:  Building geofense create");
                    })
                    .addOnFailureListener(mActivity, e -> {
                        e.printStackTrace();
                        // Failed to add geofences
                        // ...
                        Log.d("onSuccess not create", "onSuccess:  Building geofense not create");
                        //   Toast.makeText(mActivity, "not add geofence", Toast.LENGTH_SHORT).show();
                        mGeofenceListener.onFailed(e.getMessage());
                    });
        }else {
            mGeofenceListener.onFailed("Geofence lat lng not available");

        }

    }

    /**
     * create Geofencing request...
     * @param mBuildingGeofenceList geofence multiple object
     * @return
     */
    private GeofencingRequest getGeofencingRequest(ArrayList<Geofence> mBuildingGeofenceList) {
        GeofencingRequest.Builder builder = new GeofencingRequest.Builder();
        builder.setInitialTrigger(GeofencingRequest.INITIAL_TRIGGER_ENTER);
//        builder.setInitialTrigger(GeofencingRequest.INITIAL_TRIGGER_ENTER |
//                GeofencingRequest.INITIAL_TRIGGER_EXIT);
        builder.addGeofences(mBuildingGeofenceList);
        return builder.build();
    }

    /**
     * remove geofence...
     */
    public void removeGeofense() {
        if (mGeofencingClient != null)
            mGeofencingClient.removeGeofences(getGeofencePendingIntent())
                    .addOnSuccessListener(mActivity, aVoid -> {
                        // Geofences removed
                        // ...
                       // Toast.makeText(mActivity, "remove geofence", Toast.LENGTH_SHORT).show();
                    })
                    .addOnFailureListener(mActivity, e -> {
                        // Failed to remove geofences
                        // ...
                     //   Toast.makeText(mActivity, "remove geofense error", Toast.LENGTH_SHORT).show();
                    });
    }

    //Create pending Intent...
    private PendingIntent getGeofencePendingIntent() {
        // Re-use the Pending Intent if it already exists
// Reuse the PendingIntent if we already have it.
        if (geofencePendingIntent != null) {
            return geofencePendingIntent;
        }
        // The intent for the IntentService to receive the transitions

        Intent intent = new Intent(mActivity, GeofenceTransitionsIntentService.class);
        // We use FLAG_UPDATE_CURRENT so that we get the same pending intent back when
        // calling addGeofences() and removeGeofences().
        geofencePendingIntent=PendingIntent.getService(mActivity, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);


        return geofencePendingIntent;
    }

//    public static class Builder {
//        private Activity mActivity;
//        private String reqestId;
//        private double latitude;
//        private double longitude;
//        private float radius;
//        private ArrayList<Geofence> mBuildingGeofenceList;
//        private GeofenceListener geofenceListener;
//
//        public Builder(Activity mActivity) {
//            this.mActivity = mActivity;
//            mBuildingGeofenceList=new ArrayList<>();
//        }
//
//        public void setmBuildingGeofenceList(ArrayList<Geofence> mBuildingGeofenceList) {
//            this.mBuildingGeofenceList = mBuildingGeofenceList;
//        }
//
//        public Builder setReqestId(String reqestId) {
//            this.reqestId = reqestId;
//            return this;
//        }
//
//        public Builder setGeofenceListener(GeofenceListener geofenceListener) {
//            this.geofenceListener = geofenceListener;
//            return this;
//        }
//
//        public Builder setLatitude(double latitude) {
//            this.latitude = latitude;
//            return this;
//        }
//
//        public Builder setLongitude(double longitude) {
//            this.longitude = longitude;
//            return this;
//        }
//
//        public Builder setRadius(float radius) {
//            this.radius = radius;
//            return this;
//        }
//
//        public CreateGeoFences build() {
//            return new CreateGeoFences(mActivity, reqestId, latitude, longitude, radius, geofenceListener);
//        }
//    }
}
