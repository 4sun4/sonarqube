package com.createGeofense.interfaces;

import android.location.Location;

public interface GetLocationListener {
    void onSuccesfulLocation(Location location);
    void onFailedLocation(String errorMassage);
}
