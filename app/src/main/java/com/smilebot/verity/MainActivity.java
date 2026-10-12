package com.smilebot.verity;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.graphics.Color;
import android.view.View;

public class MainActivity extends Activity {
    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(Color.rgb(10, 8, 15));
        getWindow().setNavigationBarColor(Color.rgb(10, 8, 15));
        getWindow().getDecorView().setSystemUiVisibility(0);
        WebView web = new WebView(this);
        web.setBackgroundColor(Color.rgb(10, 8, 15));
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        web.setWebViewClient(new WebViewClient());
        setContentView(web);
        web.loadUrl("file:///android_asset/index.html");
    }
    @Override public void onBackPressed() {
        super.onBackPressed();
    }
}
