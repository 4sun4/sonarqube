package com.createGeofense.service;

import android.app.IntentService;
import android.content.Intent;
import android.util.Log;

import com.createGeofense.Util.Constraints;
import com.createGeofense.geofence.GeofenceErrorMessages;
import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.GeofencingEvent;

import java.util.ArrayList;
import java.util.List;

//import static com.createGeofense.Util.Constraints.TAG;

/**
 * An {@link IntentService} subclass for handling asynchronous task requests in
 * a service on a separate handler thread.
 * <p>
 * TODO: Customize class - update intent actions, extra parameters and static
 * helper methods.
 */
public class GeofenceTransitionsIntentService extends IntentService {

    public static final String MASSAGE="Massage";
    public static final String ACTIVE_GEOFENCE_LIST="Active_Geofence_List";


    public GeofenceTransitionsIntentService() {
        super("");
    }

    @Override
    protected void onHandleIntent(Intent intent) {

        GeofencingEvent geofencingEvent = GeofencingEvent.fromIntent(intent);
        Intent customIntent = new Intent(Constraints.CUSTOM_BROADCAST_NAME);
        if (geofencingEvent.hasError()) {
            String errorMessage = GeofenceErrorMessages.getErrorString(this,
                    geofencingEvent.getErrorCode());
            Log.d("creategeofence", "onReceive: Geofence error code :" + geofencingEvent.getErrorCode());
            customIntent.putExtra(MASSAGE,errorMessage);
            sendBroadcast(customIntent);
            return;
        }

        // Get the transition type.
        int geofenceTransition = geofencingEvent.getGeofenceTransition();

        ArrayList<String> strings = new ArrayList<>();
        List<Geofence> activeGeofenceList = geofencingEvent.getTriggeringGeofences();

        for (int i = 0; i < activeGeofenceList.size(); i++) {
            strings.add(activeGeofenceList.get(i).getRequestId());
        }

        customIntent.putStringArrayListExtra(ACTIVE_GEOFENCE_LIST, strings);


        // Test that the reported transition was of interest.
        if (geofenceTransition == Geofence.GEOFENCE_TRANSITION_ENTER) {
            //Log.d(TAG, "onReceive: Geofence Enter");
            customIntent.putExtra(MASSAGE,Constraints.GEOFENCE_TRANSITION_ENTER);

        } else if (geofenceTransition == Geofence.GEOFENCE_TRANSITION_EXIT) {
           // Log.d(TAG, "onReceive: Geofence Exits");

            customIntent.putExtra(MASSAGE,Constraints.GEOFENCE_TRANSITION_EXIT);
        } else {
            Log.d("creategeofence", "onReceive: other");
        }
        sendBroadcast(customIntent);
    }


}
