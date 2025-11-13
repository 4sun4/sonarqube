package com.createGeofense.location;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.location.Location;
import android.os.IBinder;

import com.google.android.gms.location.LocationRequest;
import com.createGeofense.interfaces.GetLocationListener;
import com.createGeofense.service.LocationUpdatesService;


public class CurrentLocation {

    private Activity mActivity;
   // private GetLocationListener getLocationListener;
    private String TAG = "CurrentLocation";

    /**
     * Provides access to the Fused Location Provider API.
     */
    private GetCurrentLocation currentLocation;

    private ServiceConnection mServiceConnection;

   // private MyReceiver myReceiver;

    // A reference to the service used to get location updates.
    private LocationUpdatesService mService = null;

    // Tracks the bound state of the service.
    private boolean mBound = false;

//    private class MyReceiver extends BroadcastReceiver {
//        @Override
//        public void onReceive(Context context, Intent intent) {
//            Location location = intent.getParcelableExtra(LocationUpdatesService.EXTRA_LOCATION);
//           // if (location != null) {
////                if (getLocationListener != null)
////                    getLocationListener.onSuccesfulLocation(location);
//          //  }
//        }
//    }

    private CurrentLocation(Context context, final GetLocationListener getLocationListener) {
        this.mActivity = (Activity) context;
        //this.getLocationListener = getLocationListener;

        // getCurrentLocation();

        currentLocation = new GetCurrentLocation.Builder(mActivity)
                .setGPS(true)
                .setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY)
                .setInterval(5*1000)
                .setFastInterval(5*1000)
                .setGetLocationListener(new GetLocationListener() {
                    @Override
                    public void onSuccesfulLocation(Location location) {
                        getLocationListener.onSuccesfulLocation(location);
                    }

                    @Override
                    public void onFailedLocation(String errorMassage) {

                    }

                })
                .build();
    }

    public void createForegroundService() {
        mServiceConnection = new ServiceConnection() {

            @Override
            public void onServiceConnected(ComponentName name, IBinder service) {
                LocationUpdatesService.LocalBinder binder = (LocationUpdatesService.LocalBinder) service;
                mService = binder.getService();
                mBound = true;
                if (mService != null) {
                    mService.requestLocationUpdates();
                    unbindService();
                }
            }

            @Override
            public void onServiceDisconnected(ComponentName name) {
                mService = null;
                mBound = false;
            }
        };


//        myReceiver = new MyReceiver();
//        // that since this activity is in the foreground, the service can exit foreground mode.
        mActivity.bindService(new Intent(mActivity, LocationUpdatesService.class), mServiceConnection,
                Context.BIND_AUTO_CREATE);
//
//        registerReceiver();


    }

//    private void registerReceiver() {
//        LocalBroadcastManager.getInstance(mActivity).registerReceiver(myReceiver,
//                new IntentFilter(LocationUpdatesService.ACTION_BROADCAST));
//    }
//
//    private void unregisterReceiver() {
//        LocalBroadcastManager.getInstance(mActivity).unregisterReceiver(myReceiver);
//    }

    private void unbindService() {

        if (mBound) {
            // Unbind from the service. This signals to the service that this activity is no longer
            // in the foreground, and the service can respond by promoting itself to a foreground
            // service.
            mActivity.unbindService(mServiceConnection);
            mBound = false;
        } else {
            if (mServiceConnection != null && mService != null)
                mBound = true;
        }

    }

    private void destroyUnbindService() {
        if (mServiceConnection != null)
            mActivity.unbindService(mServiceConnection);
    }

    public void destroyService() {
        try {
            if (mService != null && mServiceConnection != null) {
                // unregisterReceiver();
                //  stopLocationUpdates();
                unbindService();
                mActivity.stopService(new Intent(mActivity, LocationUpdatesService.class));
            } else
                destroyUnbindService();
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    // request location updates...
    public void startLocationUpdates() {
        if (currentLocation != null)
            currentLocation.startLocationUpdates();
    }

    //  stop location updates...
    public void stopLocationUpdates() {
        if (currentLocation != null)
            currentLocation.stopLocationUpdates();
    }

    public static class CurrentLocationBuilder {
        private Context context;
        private GetLocationListener getLocationListener;


        public CurrentLocationBuilder(Context context) {
            this.context = context;
        }

        public CurrentLocationBuilder setGetLocationListener(GetLocationListener getLocationListener) {
            this.getLocationListener = getLocationListener;
            return this;
        }


        public CurrentLocation build() {
            return new CurrentLocation(context, getLocationListener);
        }
    }

}
