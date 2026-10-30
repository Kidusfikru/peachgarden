package com.games.wenzi.taoyuan;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import fi.iki.elonen.NanoHTTPD;

/**
 * One-time archive migrator: read localStorage from the old http://localhost:8080,
 * Injected into Capacitor's https://localhost WebView.
 */
public class SaveMigrator {

    private static final String TAG = "SaveMigrator";
    private static final String PREFS_NAME = "save_migration";
    private static final String KEY_DONE = "migration_done_v2";
    private static final int OLD_PORT = 8080;

    private final Context context;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private MigrationServer server;
    private WebView hiddenWebView;
    private final ConcurrentHashMap<String, String> collectedSaves = new ConcurrentHashMap<>();
    private OnMigrationListener listener;
    private boolean finished = false;

    public interface OnMigrationListener {
        void onMigrationComplete(Map<String, String> saves);
        void onMigrationSkipped(String reason);
    }

    public SaveMigrator(Context context) {
        this.context = context;
    }

    /** Check if migration is required */
    public boolean needsMigration() {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        return !prefs.getBoolean(KEY_DONE, false);
    }

    /** Mark migration completed */
    public static void markDone(Context context) {
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .edit().putBoolean(KEY_DONE, true).apply();
    }

    /** Start the migration process */
    public void migrate(OnMigrationListener listener) {
        this.listener = listener;

        if (!needsMigration()) {
            listener.onMigrationSkipped("Migrated, skipped");
            return;
        }

        Log.d(TAG, "Start archive migration...");
        showToast("Detecting old archives...");

        try {
            // Start NanoHTTPD and provide the migration page
            server = new MigrationServer(OLD_PORT);
            server.start();
            Log.d(TAG, "Migration server starts on port " + OLD_PORT);

            //Create a hidden WebView to access the old origin
            handler.post(() -> {
                hiddenWebView = new WebView(context);
                WebSettings settings = hiddenWebView.getSettings();
                settings.setJavaScriptEnabled(true);
                settings.setDomStorageEnabled(true);

                hiddenWebView.addJavascriptInterface(new MigrationBridge(), "MigrationBridge");
                hiddenWebView.setWebViewClient(new WebViewClient() {
                    @Override
                    public void onPageFinished(WebView view, String url) {
                        Log.d(TAG, "Migration page loading completed: " + url);
                    }

                    @Overridepublic void onReceivedError(WebView view, int errorCode,
                                                String description, String failingUrl) {
                        Log.e(TAG, "The migration page failed to load: " + description);
                        finish("Page loading failed: " + description);
                    }
                });

                hiddenWebView.loadUrl("http://localhost:" + OLD_PORT + "/migration");
            });

            // 10 seconds timeout protection
            handler.postDelayed(() -> {
                if (!finished) {
                    Log.w(TAG, "Migration timed out, skipped");
                    finish("Migration timeout");
                }
            }, 10000);

        } catch (Exception e) {
            Log.e(TAG, "Migration startup failed", e);
            finish("Server startup failed: " + e.getMessage());
        }
    }

    /** Complete migration and clean up resources */
    private synchronized void finish(String skipReason) {
        if (finished) return;
        finished = true;
        cleanup();
        if (listener != null) {
            if (skipReason != null || collectedSaves.isEmpty()) {
                String reason = skipReason != null ? skipReason : "Old version has no archived data";
                Log.d(TAG, "Migration skipped: " + reason);
                // Mark completion only when no data is confirmed. Errors/timeouts are not marked. Try again next time.
                if ("Old version has no archived data".equals(reason)) {
                    markDone(context);
                }
                showToast("Old version archive not found (" + reason + ")");
                listener.onMigrationSkipped(reason);
            } else {
                // Found old archive, but not here markDone()
                // markDone is called by injectSaves after the actual injection is successful.
                Log.d(TAG, "Migration successful, total " + collectedSaves.size() + " archives");
                showToast("Found " + collectedSaves.size() + " old version archives, migrating...");
                listener.onMigrationComplete(collectedSaves);
            }
        }
    }

    /** Display Toast prompt */
    private void showToast(String message) {
        handler.post(() -> Toast.makeText(context, message, Toast.LENGTH_LONG).show());
    }

    /** Clean up resources */
    public void cleanup() {
        if (server != null) {
            server.stop();
            server = null;
        }
        handler.post(() -> {
            if (hiddenWebView != null) {
                hiddenWebView.destroy();
                hiddenWebView = null;
            }
        });
    }

    /** NanoHTTPD migration server, only returns a migration HTML page */
    private static class MigrationServer extends NanoHTTPD {
        MigrationServer(int port) {
            super(port);
        }

        @Override
        public Response serve(IHTTPSession session) {
            String html = "<!DOCTYPE html><html><body><script>"
                + "try {"
                + "var saves = {};"
                + " for (var i = 0; i < localStorage.length; i++) {"
                + "var key = localStorage.key(i);"
                + " if (key.indexOf('taoyuanxiang_save_') === 0) {"
                + " saves[key] = localStorage.getItem(key);"
                + " }"
                + " }"+ "var keys = Object.keys(saves);"
                + " if (keys.length === 0) {"
                + "MigrationBridge.onNoData();"
                + " } else {"
                + " for (var j = 0; j < keys.length; j++) {"
                + "MigrationBridge.onSaveData(keys[j], saves[keys[j]]);"
                + " }"
                + "MigrationBridge.onComplete(keys.length);"
                + " }"
                + "} catch(e) {"
                + "MigrationBridge.onError(e.message);"
                + "}"
                + "</script></body></html>";

            return newFixedLengthResponse(Response.Status.OK, "text/html", html);
        }
    }

    /** JS Bridge, receives archived data from old origin */
    private class MigrationBridge {
        @JavascriptInterface
        public void onSaveData(String key, String value) {
            Log.d(TAG, "Received archive: " + key + " (" + value.length() + " characters)");
            collectedSaves.put(key, value);
        }

        @JavascriptInterface
        public void onComplete(int count) {
            Log.d(TAG, "Migration reading completed, total " + count + " archives");
            handler.post(() -> finish(null));
        }

        @JavascriptInterface
        public void onNoData() {
            Log.d(TAG, "Old origin has no archived data");
            handler.post(() -> finish("Old version has no archived data"));
        }

        @JavascriptInterface
        public void onError(String message) {
            Log.e(TAG, "Migration JS error: " + message);
            handler.post(() -> finish("JS error: " + message));
        }
    }

    /**
     * Check if the new version already has an archive, if not, inject the old archive and refresh the page
     */
    public static void injectSaves(WebView webView, Map<String, String> saves, Context context) {
        if (saves == null || saves.isEmpty()) return;

        // First check whether the new version of localStorage already has an archive
        webView.evaluateJavascript(
            "(function(){" +
            " for(var i=0;i<localStorage.length;i++){" +
            " if(localStorage.key(i).indexOf('taoyuanxiang_save_')===0) return 'has_data';" +
            " }" +
            " return 'empty';" +
            "})();",
            result -> {
                // evaluateJavascript returns a value with quotes, such as "\"has_data\""
                if (result != null && result.contains("has_data")) {
                    Log.d(TAG, "The new version has been archived, skip migration injection and avoid overwriting");
                    new Handler(Looper.getMainLooper()).post(() ->
                        Toast.makeText(context, "The new version has been archived, skip the migration of the old version", Toast.LENGTH_LONG).show()
                    );
                    return;
                }

                // The new version has no archive, safe injection
                StringBuilder js = new StringBuilder("(function(){");
                for (Map.Entry<String, String> entry : saves.entrySet()) {
                    String key = escapeJs(entry.getKey());
                    String value = escapeJs(entry.getValue());
                    js.append("localStorage.setItem('").append(key).append("','").append(value).append("');");
                }
                js.append("location.reload();");js.append("})();");

                webView.evaluateJavascript(js.toString(), r -> {
                    Log.d(TAG, "Archive injection completed, total " + saves.size() + " items, the page has been refreshed");
                    // Mark the completion only when the injection is successful, and it will not be migrated next time.
                    markDone(context);
                });
            }
        );
    }

    /** Escape special characters in JS single quoted strings */
    private static String escapeJs(String s) {
        return s.replace("\\", "\\\\")
                .replace("'", "\\'")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
    }
}