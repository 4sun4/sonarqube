package com.createGeofense.Util;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkInfo;
import android.os.Build;
import android.util.Base64;

import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.Objects;

public class Utility {

    /**
     * get current date and time....
     *
     * @return date time string format
     */
    public static String getDateTime() {
        SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy hh:mm a");
        Date date = new Date();
        return formatter.format(date);
    }

    /**
     * get current time
     *
     * @return long value
     */
    public static long getTime() {
        //  SimpleDateFormat formatter = new SimpleDateFormat("hh:mm:ss a");
        Date date = new Date();
        return date.getTime();
    }

//    public static String fromTime(String value) {
//        SimpleDateFormat formatter = new SimpleDateFormat("HH:mm:ss");
//        Date date = null;
//        try {
//            date = formatter.parse(value);
//        } catch (ParseException e) {
//            e.printStackTrace();
//        }
//
//        return formatter.format(new Date(value));
//    }

    public static String fromDateTimeForServer(long value) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault());
        // formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
        return formatter.format(new Date(value));
    }


    /**
     * Check Network Connectivity
     *
     * @param context context
     * @return if true,then network available and if false,then network not available..
     */
    public static boolean isNetworkAvailable(Context context) {
        ConnectivityManager connectivityManager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
            NetworkInfo networkInfo = Objects.requireNonNull(connectivityManager).getActiveNetworkInfo();
            return networkInfo != null && networkInfo.isConnected();
        }

        Network[] networks = Objects.requireNonNull(connectivityManager).getAllNetworks();
        boolean hasInternet = false;
        if (networks.length > 0) {
            for (Network network : networks) {
                NetworkCapabilities nc = connectivityManager.getNetworkCapabilities(network);
                if (Objects.requireNonNull(nc).hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET))
                    hasInternet = true;
            }
        }
        return hasInternet;
    }

    /**
     * get decode String ...
     * @param value encode string..
     * @return
     */
    public static String getDecodeString(String value) {
        byte[] decodekeymain = Base64.decode(value.getBytes(StandardCharsets.UTF_8), Base64.DEFAULT);
        return new String(decodekeymain, StandardCharsets.UTF_8);
    }




}
