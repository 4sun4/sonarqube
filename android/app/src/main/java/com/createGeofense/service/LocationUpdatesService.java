/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.createGeofense.service;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.content.res.Configuration;
import android.location.Location;
import android.os.Binder;
import android.os.Build;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.IBinder;
import android.util.Log;

import androidx.core.app.NotificationCompat;
//import androidx.localbroadcastmanager.content.LocalBroadcastManager;

//import com.createGeofense.R;
import com.createGeofense.interfaces.GetLocationListener;
import com.createGeofense.location.GetCurrentLocation;
import com.google.android.gms.location.LocationRequest;
import com.workforcemgr.R;

import java.util.Objects;


/**
 * A bound and started service that is promoted to a foreground service when location updates have
 * been requested and all clients unbind.
 * <p>
 * For apps running in the background on "O" devices, location is computed only once every 10
 * minutes and delivered batched every 30 minutes. This restriction applies even to apps
 * targeting "N" or lower which are run on "O" devices.
 * <p>
 * This sample show how to use a long-running service for location updates. When an activity is
 * bound to this service, frequent location updates are permitted. When the activity is removed
 * from the foreground, the service promotes itself to a foreground service, and location updates
 * continue. When the activity comes back to the foreground, the foreground service stops, and the
 * notification assocaited with that service is removed.
 */
public class LocationUpdatesService extends Service {

    private static final String PACKAGE_NAME =
            "com.mobilejourney.service.locationupdatesforegroundservice";

    private final String TAG = LocationUpdatesService.class.getSimpleName();

    /**
     * The name of the channel for notifications.
     */
    private final String CHANNEL_ID = "channel_01";
//
//    public static final String ACTION_BROADCAST = PACKAGE_NAME + ".broadcast";
//
//    public static final String EXTRA_LOCATION = PACKAGE_NAME + ".location";

    private final IBinder mBinder = new LocalBinder();


    /**
     * Used to check whether the bound activity has really gone away and not unbound as part of an
     * orientation change. We create a foreground service notification only if the former takes
     * place.
     */
    private boolean mChangingConfiguration = false;


    private Handler mServiceHandler;

    /**
     * The current location.
     */
    //  private Location mLocation;

    GetCurrentLocation currentLocation;

    public LocationUpdatesService() {
    }

    @Override
    public void onCreate() {

        getCurrentLocation();

        HandlerThread handlerThread = new HandlerThread(TAG);
        handlerThread.start();
        mServiceHandler = new Handler(handlerThread.getLooper());
        NotificationManager mNotificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);

        // Android O requires a Notification Channel.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = getString(R.string.app_name);
            // Create the channel for the notification
            NotificationChannel mChannel =
                    new NotificationChannel(CHANNEL_ID, name, NotificationManager.IMPORTANCE_LOW);

            // Set the Notification Channel for the Notification Manager.
            Objects.requireNonNull(mNotificationManager).createNotificationChannel(mChannel);
        }
    }

    private void getCurrentLocation() {

        currentLocation = new GetCurrentLocation.Builder(this)
                .setGPS(false)
                .setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY)
                .setInterval(5*1000)
                .setFastInterval(5*1000)
                .setGetLocationListener(new GetLocationListener() {
                    @Override
                    public void onSuccesfulLocation(Location location) {
                      //  onNewLocation(location);
                    }

                    @Override
                    public void onFailedLocation(String errorMassage) {
                    }

                })
                .build();


    }


    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.i(TAG, "Service started");
        String EXTRA_STARTED_FROM_NOTIFICATION = PACKAGE_NAME +
                ".started_from_notification";
        boolean startedFromNotification = intent.getBooleanExtra(EXTRA_STARTED_FROM_NOTIFICATION,
                false);

        // We got here because the user decided to remove location updates from the notification.
        if (startedFromNotification) {
            currentLocation.stopLocationUpdates();
            stopSelf();
        }
        // Tells the system to not try to recreate the service after it has been killed.
        return START_NOT_STICKY;
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        mChangingConfiguration = true;
    }

    @Override
    public IBinder onBind(Intent intent) {
        // Called when a client (MainActivity in case of this sample) comes to the foreground
        // and binds with this service. The service should cease to be a foreground service
        // when that happens.
        Log.i(TAG, "in onBind()");
        stopForeground(true);
        mChangingConfiguration = false;
        return mBinder;
    }

    @Override
    public void onRebind(Intent intent) {
        // Called when a client (MainActivity in case of this sample) returns to the foreground
        // and binds once again with this service. The service should cease to be a foreground
        // service when that happens.
        Log.i(TAG, "in onRebind()");
        stopForeground(true);
        mChangingConfiguration = false;
        super.onRebind(intent);
    }

    @Override
    public boolean onUnbind(Intent intent) {
        Log.i(TAG, "Last client unbound from service");

        // Called when the last client (MainActivity in case of this sample) unbinds from this
        // service. If this method is called due to a configuration change in MainActivity, we
        // do nothing. Otherwise, we make this service a foreground service.
        //  if (!mChangingConfiguration && Utils.requestingLocationUpdates(this)) {
        if (!mChangingConfiguration) {
            Log.i(TAG, "Starting foreground service");

            /*
              The identifier for the notification displayed for the foreground service.
             */
            int NOTIFICATION_ID = 12345678;
            startForeground(NOTIFICATION_ID, getNotification());

        }
        return true; // Ensures onRebind() is called when a client re-binds.
    }

    @Override
    public void onDestroy() {
        if (currentLocation != null)
            currentLocation.stopLocationUpdates();

        mServiceHandler.removeCallbacksAndMessages(null);
    }

    /**
     * Makes a request for location updates. Note that in this sample we merely log the
     * {@link SecurityException}.
     */
    public void requestLocationUpdates() {
        Log.i(TAG, "Requesting location updates");
        startService(new Intent(getApplicationContext(), LocationUpdatesService.class));
        try {
            currentLocation.startLocationUpdates();
        } catch (SecurityException unlikely) {
            Log.e(TAG, "Lost location permission. Could not request updates. " + unlikely);
        }
    }

    /**
     * Returns the {@link NotificationCompat} used as part of the foreground service.
     */
    private Notification getNotification() {
        //Intent intent = new Intent(this, LocationUpdatesService.class);

        CharSequence text = "Process Running...";

        // Extra to help us figure out if we arrived in onStartCommand via the notification or not.
        //  intent.putExtra(EXTRA_STARTED_FROM_NOTIFICATION, true);

        // The PendingIntent that leads to a call to onStartCommand() in this service.
//        PendingIntent servicePendingIntent = PendingIntent.getService(this, 0, intent,
//                PendingIntent.FLAG_UPDATE_CURRENT);

        // The PendingIntent to launch activity.
//        PendingIntent activityPendingIntent = PendingIntent.getActivity(this, 0,
//                new Intent(this, MainActivity.class), 0);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this)
//                .addAction(R.drawable.ic_launch, getString(R.string.launch_activity),
//                        activityPendingIntent)
//                .addAction(R.drawable.ic_launcher_background,
//                        "Remove Updates",
//                        servicePendingIntent)
                .setContentText(text)
                .setContentTitle("Updates")
                .setOngoing(true)
                .setSound(null)
                // .setPriority(Notification.PRIORITY_HIGH)
                .setSmallIcon(R.drawable.common_google_signin_btn_icon_dark)
                // .setTicker(text)
                //.setWhen(System.currentTimeMillis())
                ;

        // Set the Channel ID for Android O.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            builder.setChannelId(CHANNEL_ID); // Channel ID
        }

        return builder.build();
    }

    private void onNewLocation(Location location) {
        Log.i(TAG, "New location: " + location);

        // Notify anyone listening for broadcasts about the new location.

//        Intent intent = new Intent(ACTION_BROADCAST);
//        intent.putExtra(EXTRA_LOCATION, location);
//        LocalBroadcastManager.getInstance(getApplicationContext()).sendBroadcast(intent);

        // Update notification content if running as a foreground service.

    }


    /**
     * Class used for the client Binder.  Since this service runs in the same process as its
     * clients, we don't need to deal with IPC.
     */
    public class LocalBinder extends Binder {
        public LocationUpdatesService getService() {
            return LocationUpdatesService.this;
        }
    }


}
