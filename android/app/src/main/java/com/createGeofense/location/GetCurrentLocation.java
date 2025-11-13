package com.createGeofense.location;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Looper;
import android.util.Log;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.common.api.ResolvableApiException;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.location.LocationSettingsResponse;
import com.google.android.gms.location.LocationSettingsStatusCodes;
import com.google.android.gms.location.SettingsClient;
import com.google.android.gms.tasks.Task;
import com.createGeofense.interfaces.GetLocationListener;

public class GetCurrentLocation {

    private Context mActivity;
    private GetLocationListener getLocationListener;
    private String TAG = "CurrentLocation";
    private LocationCallback mLocationCallback;
    private FusedLocationProviderClient mFusedLocationClient;
    private LocationRequest mLocationRequest;
    public static boolean isGPS = false;


    private GetCurrentLocation(Context mActivity, int priority, boolean isGPS, GetLocationListener getLocationListener, long interval, long fastInterval) {
        this.mActivity = mActivity;
        this.getLocationListener = getLocationListener;
        createLocationRequest(priority, interval, fastInterval);
        getCurrentLocation(isGPS);
    }

    //check play services available.....
    private boolean isGooglePlayServicesAvailable(Context activity) {
        GoogleApiAvailability googleApiAvailability = GoogleApiAvailability.getInstance();
        int status = googleApiAvailability.isGooglePlayServicesAvailable(activity);
        if (status != ConnectionResult.SUCCESS) {
            if (googleApiAvailability.isUserResolvableError(status)) {
                googleApiAvailability.getErrorDialog((Activity) activity, status, 2404).show();
            }
            return false;
        }
        return true;
    }

    //get current location and tracking
    private void getCurrentLocation(boolean isGPS) {

        if (!isGooglePlayServicesAvailable(mActivity)) {
            Log.d(TAG, "getCurrentLocation: Google Play Services not available this mobile!");
            if (getLocationListener != null)
                getLocationListener.onFailedLocation("Google Play Services not available this mobile!");
            return;
        }

        if (ContextCompat.checkSelfPermission(mActivity, Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED
                && ContextCompat.checkSelfPermission(mActivity
                , Manifest.permission.ACCESS_COARSE_LOCATION)
                != PackageManager.PERMISSION_GRANTED
        ) {

            Log.d(TAG, "getCurrentLocation: Please Provide these permissions in menifest file\\n\" +\n" +
                    "                    \" ACCESS_FINE_LOCATION and ACCESS_COARSE_LOCATION!");
            if (getLocationListener != null)
                getLocationListener.onFailedLocation("Please allow these permissions in menifest file\n" +
                        "ACCESS_FINE_LOCATION and ACCESS_COARSE_LOCATION!");

            return;
        }

        mFusedLocationClient = LocationServices.getFusedLocationProviderClient(mActivity);

        getLastLocation();

        mLocationCallback = new LocationCallback() {
            @Override
            public void onLocationResult(LocationResult locationResult) {
                super.onLocationResult(locationResult);
                if (locationResult == null) {
                    return;
                }

                for (Location location : locationResult.getLocations()) {
                    // Update UI with location data
                    double latitude = location.getLatitude();
                    double longitude = location.getLongitude();
                    Log.d(TAG, "onSuccess: lat:" + latitude + ",lng:" + longitude);
                    getLocationListener.onSuccesfulLocation(location);
                }
            }
        };

        if (isGPS)
            setLocationSetting();

    }

    private void setLocationSetting() {
        LocationSettingsRequest.Builder builder = new LocationSettingsRequest.Builder()
                .addLocationRequest(mLocationRequest);

        SettingsClient client = LocationServices.getSettingsClient(mActivity);
        Task<LocationSettingsResponse> task = client.checkLocationSettings(builder.build());

        task.addOnSuccessListener((Activity) mActivity, locationSettingsResponse -> {
            // All location settings are satisfied. The client can initialize
            // location requests here.
            // ...
            startLocationUpdates();
        });

        task.addOnFailureListener((Activity) mActivity, e -> {
            int statusCode = ((ApiException) e).getStatusCode();
            switch (statusCode) {
                case LocationSettingsStatusCodes.RESOLUTION_REQUIRED:
                    Log.i(TAG, "Location settings are not satisfied. Attempting to upgrade " +
                            "location settings ");
                    try {
                        // Show the dialog by calling startResolutionForResult(), and check the
                        // result in onActivityResult().
                        ResolvableApiException rae = (ResolvableApiException) e;
                        rae.startResolutionForResult((Activity) mActivity, 100);
                        isGPS = true;

                    } catch (Exception sie) {
                        Log.i(TAG, "PendingIntent unable to execute request.");
                    }
                    break;
                case LocationSettingsStatusCodes.SETTINGS_CHANGE_UNAVAILABLE:
                    String errorMessage = "Location settings are inadequate, and cannot be " +
                            "fixed here. Fix in Settings.";
                    Log.e(TAG, errorMessage);
            }
        });
    }

    private void getLastLocation() {
        try {
            mFusedLocationClient.getLastLocation()
                    .addOnCompleteListener(task -> {
                        if (task.isSuccessful() && task.getResult() != null) {
                            getLocationListener.onSuccesfulLocation(task.getResult());
                        } else {
                            Log.w(TAG, "Failed to get location.");
                        }
                    });
        } catch (SecurityException unlikely) {
            Log.e(TAG, "Lost location permission." + unlikely);
        }
    }

    // request location updates...
    public void startLocationUpdates() {
        if (mFusedLocationClient != null && mLocationCallback != null) {
            if (ActivityCompat.checkSelfPermission(mActivity, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(mActivity, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                // TODO: Consider calling
                //    ActivityCompat#requestPermissions
                // here to request the missing permissions, and then overriding
                //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                //                                          int[] grantResults)
                // to handle the case where the user grants the permission. See the documentation
                // for ActivityCompat#requestPermissions for more details.
                return;
            }
            mFusedLocationClient.requestLocationUpdates(mLocationRequest,
                    mLocationCallback,
                    Looper.getMainLooper());
        }
    }

    //  stop location updates...
    public void stopLocationUpdates() {
        if (mFusedLocationClient != null && mLocationCallback != null)
            mFusedLocationClient.removeLocationUpdates(mLocationCallback);
    }

    //create location request every 5-10 second
    private void createLocationRequest(int priority, long interval, long fastInterval) {
        mLocationRequest = LocationRequest.create();
        mLocationRequest.setInterval(interval);
        mLocationRequest.setFastestInterval(fastInterval);
        mLocationRequest.setPriority(priority);

    }

    public static class Builder {
        private Context context;
        private GetLocationListener getLocationListener;
        private int priority;
        private boolean isGPS;
        private long interval;
        private long fastInterval;

        public Builder(Context context) {
            this.context = context;
        }

        public Builder setGetLocationListener(GetLocationListener getLocationListener) {
            this.getLocationListener = getLocationListener;
            return this;
        }


        public Builder setGPS(boolean GPS) {
            isGPS = GPS;
            return this;
        }

        public Builder setPriority(int priority) {
            this.priority = priority;
            return this;
        }

        public Builder setInterval(long interval) {
            this.interval = interval;
            return this;
        }

        public Builder setFastInterval(long fastInterval) {
            this.fastInterval = fastInterval;
            return this;
        }

        public GetCurrentLocation build() {
            return new GetCurrentLocation(context, priority, isGPS, getLocationListener, interval, fastInterval);
        }
    }

}
