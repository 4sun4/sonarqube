package com.workforcemgr;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent intent = new Intent(this, MainActivity.class);
         Bundle extras = getIntent().getExtras();

            if (extras != null) {
                // this line is critical for Push Notifications to call
                // onNotificationOpenedApp
                intent.putExtras(extras);
            }
        startActivity(intent);
        finish();
    }
}
