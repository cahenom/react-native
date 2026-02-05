package com.punya_kios;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Pindah ke MainActivity setelah splash
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
        finish();
    }
}