package com.games.wenzi.taoyuan;

import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.widget.Toast;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

import java.util.Map;

public class MainActivity extends BridgeActivity {

    private static final String TAG = "MainActivity";
    private View loadingOverlay;
    private View enterButton;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private boolean loadingDismissed = false;
    private SaveMigrator migrator;
    private Runnable enterButtonRunnable;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Register Capacitor Plugin (must be before super.onCreate)
        registerPlugin(CloudSavePlugin.class);

        super.onCreate(savedInstanceState);

        // Immersive status bar
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        WindowInsetsControllerCompat controller = new WindowInsetsControllerCompat(getWindow(), getWindow().getDecorView());
        controller.setAppearanceLightStatusBars(false);
        getWindow().setStatusBarColor(Color.TRANSPARENT);

        // BridgeActivity has created its own WebView layout, and manually inflate the mask layer onto it
        loadingOverlay = getLayoutInflater().inflate(R.layout.activity_main, null);
        addContentView(loadingOverlay, new ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ));

        enterButton = loadingOverlay.findViewById(R.id.enterButton);

        //Click "Enter Game" to manually close the mask
        enterButton.setOnClickListener(v -> dismissLoading());

        //If loading has not been completed after 5 seconds, display the enter button
        enterButtonRunnable = () -> {
            if (!loadingDismissed && enterButton != null) {
                enterButton.setVisibility(View.VISIBLE);
                enterButton.setAlpha(0f);
                enterButton.animate().alpha(1f).setDuration(300).start();
            }
        };
        handler.postDelayed(enterButtonRunnable, 5000);

        WebView webView = getBridge().getWebView();
        if (webView != null) {
            //Register the JS interface so that WebView can notify Native to hide the mask
            webView.addJavascriptInterface(new Object() {
                @android.webkit.JavascriptInterface
                public void hideLoading() {
                    runOnUiThread(() -> dismissLoading());
                }
            }, "NativeApp");

            // Delay the injection of the polling script and wait until Capacitor loads the page to detect that Vue rendering is completed.
            handler.postDelayed(() -> {
                WebView wv = getBridge().getWebView();
                if (wv != null) {
                    wv.evaluateJavascript(
                        "(function check() {" +
                        "var app = document.getElementById('app');" +" if (app && app.children.length > 0) {" +
                        "NativeApp.hideLoading();" +
                        " } else {" +
                        " setTimeout(check, 200);" +
                        " }" +
                        "})();",
                        null
                    );
                }
            }, 500);

            // Archive migration: Migrate from the old http://localhost:8080 to Capacitor's https://localhost
            migrator = new SaveMigrator(this);
            migrator.migrate(new SaveMigrator.OnMigrationListener() {
                @Override
                public void onMigrationComplete(Map<String, String> saves) {
                    Log.d(TAG, "Archive migration successful, total " + saves.size() + " items, waiting for injection...");
                    // Delay injection to ensure that the Capacitor WebView page is loaded
                    handler.postDelayed(() -> {
                        WebView wv = getBridge().getWebView();
                        if (wv != null) {
                            SaveMigrator.injectSaves(wv, saves, MainActivity.this);
                            Toast.makeText(MainActivity.this,
                                "Archive migration completed! Reloading...", Toast.LENGTH_LONG).show();
                        }
                    }, 2000);
                }

                @Override
                public void onMigrationSkipped(String reason) {
                    Log.d(TAG, "Archive migration skipped: " + reason);
                }
            });
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        handler.removeCallbacksAndMessages(null);
        // Clean up migrator resources
        if (migrator != null) {
            migrator.cleanup();
            migrator = null;
        }
    }

    private void dismissLoading() {
        if (loadingDismissed || loadingOverlay == null) return;
        loadingDismissed = true;
        // Only remove the timeout callback of the enter button, do not clear all callbacks (to avoid accidental migration injection callbacks)
        if (enterButtonRunnable != null) {
            handler.removeCallbacks(enterButtonRunnable);
        }
        loadingOverlay.animate()
            .alpha(0f)
            .setDuration(300)
            .withEndAction(() -> loadingOverlay.setVisibility(View.GONE))
            .start();
    }
}