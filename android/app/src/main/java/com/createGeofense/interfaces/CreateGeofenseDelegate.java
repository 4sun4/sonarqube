package com.createGeofense.interfaces;

import java.util.ArrayList;

public interface CreateGeofenseDelegate {

    /**
     * This delegate will be called when MobileJourney_GIS start successfully.
     */
    void didStartSuccessfully();

    /**
     * This method invoked when MobileJourney_GIS failed during startup.
     */
    void didFailStarting(String errorMessage);

    /**
     * Method for notifying publisher when user has entered a polygon.
     */
    void userDidEnteredPolygon(ArrayList<String> ids);

    /**
     * Method for notifying publisher when user exit a polygon.
     */
    void userDidExitPolygon(ArrayList<String> ids);





  }
