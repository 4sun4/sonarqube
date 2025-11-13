package com.createGeofense.models.API;

import androidx.annotation.NonNull;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;


public class LocationData implements Serializable {

    private double latitude;
    private double longitude;
    private  String order_id;
    private  String job_radius;
    private double distance;

    public LocationData(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public String getOrder_id() {
        return order_id;
    }

    public void setOrder_id(String order_id) {
        this.order_id = order_id;
    }

    public String getJob_radius() {
        return job_radius;
    }

    public void setJob_radius(String job_radius) {
        this.job_radius = job_radius;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }

    @NonNull
    @Override
    public String toString() {
        return "{" +
                "latitude:" + latitude +
                ",longitude:" + longitude +
                '}';
    }
}
