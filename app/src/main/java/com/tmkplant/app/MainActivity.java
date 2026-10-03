package com.tmkplant.app;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.net.Uri;
import android.os.Bundle;
import android.os.ConditionVariable;
import android.os.Message;
import android.content.pm.ResolveInfo;
import android.util.Log;
import android.util.TypedValue;
import android.view.KeyEvent;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.MimeTypeMap;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.FileProvider;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Единственная активность приложения: полноэкранный WebView с сайтом
 * (3D-модель завода, схема технологических потоков, чертежи, PDF-документация
 * и данные проекта).
 *
 * Контент живёт не в assets/ (это часть APK, только для чтения), а в
 * внутреннем хранилище приложения ({@link #getFilesDir()}/www/) — при первом
 * запуске он копируется туда из assets/, а дальше может обновляться поверх
 * из папки на Google Диске (см. {@link #checkForUpdates(boolean)}), без
 * переустановки самого приложения. Приложение скачивает ВСЁ, что найдёт в
 * этой папке (включая вложенные подпапки — их структура повторяется и
 * локально), так что никакого отдельного файла-описи вести не нужно:
 * положили файл в папку на Диске — он появится в приложении при следующей
 * синхронизации. Перед скачиванием пользователь видит размер и число файлов
 * и может отказаться или отменить процесс на середине.
 */
public class MainActivity extends AppCompatActivity {

    /**
     * ID папки на Google Диске, чьё содержимое (рекурсивно, со всеми
     * вложенными подпапками) приложение скачивает целиком. Берётся из
     * ссылки на папку вида
     * https://drive.google.com/drive/folders/ИДЕНТИФИКАТОР?usp=sharing —
     * нужен именно ИДЕНТИФИКАТОР. Сама папка (и все файлы в ней) должна
     * быть расшарена с доступом "Все, у кого есть ссылка".
     */
    private static final String DRIVE_FOLDER_ID = "1DECKUECCdEx9kyAcufOAhrcgdLlXrwP9";

    /**
     * API-ключ Google Cloud, ограниченный Google Drive API — без него нельзя
     * получить список файлов в папке (это единственное, для чего он нужен;
     * сами файлы скачиваются той же публичной ссылкой доступа). Получить:
     * console.cloud.google.com → создать проект (если ещё нет) → APIs &
     * Services → Library → найти "Google Drive API" → Enable → Credentials →
     * Create Credentials → API key. См. README.md — подробная инструкция.
     */
    private static final String DRIVE_API_KEY = "AIzaSyBbhdeYRqQ_Jp5zEVCLWfKcMGx1dhS5Wnw";

    private static final String TAG = "TMKSync";
    private static final String PREFS = "tmk_sync";
    private static final String PREF_VERSION = "synced_version";
    private static final String PREF_SEEDED_VERSION_CODE = "seeded_version_code";
    private static final String PREF_LAST_SYNC_TIME = "last_sync_time_millis";
    // -1 = follow the system's own brightness/auto-brightness (no app override);
    // 1..100 = an explicit percentage this app forces while it's in the foreground.
    private static final String PREF_BRIGHTNESS_PERCENT = "brightness_percent";

    private WebView webView;
    private File wwwDir;
    // Tracks whether the web layer's "во весь экран" toggle (model.html /
    // flow.html, relayed through index.html) is currently on, so the
    // hardware Back button can exit fullscreen first instead of its usual
    // behaviour (navigate back / close the app) — see onKeyDown below.
    private boolean fullscreenActive = false;

    private final AtomicBoolean cancelRequested = new AtomicBoolean(false);
    // Separate cancel flag for the "Скачать всё" button in the "Архив" tab
    // (downloadAllInFolder), independent of the auto-sync one above.
    private final AtomicBoolean archiveBulkCancelRequested = new AtomicBoolean(false);
    private AlertDialog progressDialog;
    private TextView progressText;
    private ProgressBar progressBar;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        wwwDir = new File(getFilesDir(), "www");
        seedWwwDirIfNeeded();
        applySavedBrightness();

        webView = new WebView(this);
        setContentView(webView);

        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        s.setLoadWithOverviewMode(true);
        s.setUseWideViewPort(true);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);
        s.setMediaPlaybackRequiresUserGesture(false);
        // needed so onCreateWindow below actually fires for target="_blank" links
        // instead of the WebView silently swallowing the click
        s.setSupportMultipleWindows(true);
        s.setJavaScriptCanOpenWindowsAutomatically(true);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return handleLink(request.getUrl());
            }
        });
        webView.setWebChromeClient(new WebChromeClient() {
            // Forward JS console.log/warn/error and uncaught JS errors into
            // Logcat under our own tag, so they show up next to the native
            // TMKSync lines — by default WebView JS console output is
            // invisible unless this is overridden.
            @Override
            public boolean onConsoleMessage(android.webkit.ConsoleMessage cm) {
                Log.d(TAG, "JS[" + cm.messageLevel() + "] " + cm.message()
                    + " (" + cm.sourceId() + ":" + cm.lineNumber() + ")");
                return true;
            }
            // Handles links with target="_blank" (or window.open(...)): normal
            // WebViewClient.shouldOverrideUrlLoading is never invoked for those,
            // since they ask for a *new* window rather than navigating the
            // current one, and this app doesn't have real tabs/windows. We spin
            // up a throwaway, never-attached WebView just to catch the URL the
            // popup wanted to load, then hand it to the same handleLink() logic
            // (open the PDF viewer, or the URL in an external app/browser).
            @Override
            public boolean onCreateWindow(WebView view, boolean isDialog, boolean isUserGesture, Message resultMsg) {
                WebView popup = new WebView(MainActivity.this);
                popup.setWebViewClient(new WebViewClient() {
                    @Override
                    public boolean shouldOverrideUrlLoading(WebView popupView, WebResourceRequest request) {
                        handleLink(request.getUrl());
                        return true;
                    }
                });
                WebView.WebViewTransport transport = (WebView.WebViewTransport) resultMsg.obj;
                transport.setWebView(popup);
                resultMsg.sendToTarget();
                return true;
            }
        });
        webView.addJavascriptInterface(new TmkNative(), "TmkNative");

        webView.loadUrl("file://" + wwwDir.getAbsolutePath() + "/index.html");

        // NOTE: this used to also call checkForUpdates(false) here to silently
        // check for updates on every launch. Removed: the configured Drive
        // folder is a huge, deeply-nested tree (the full drawing archive),
        // and a full recursive walk of it on every single app start wasted
        // time/battery/data for no visible benefit (it's a silent check, so
        // failures were invisible too). Browsing/downloading from that Drive
        // folder is now done on demand from the "Архив" tab instead (see
        // TmkNative.browseDriveFolder / downloadAndOpenDriveFile below),
        // which only ever looks at one folder level at a time. The manual
        // "⟳" button (TmkNative.checkForUpdates) still works if a smaller,
        // dedicated folder is ever configured for it.
    }

    // ---------------------------------------------------------------------
    // Seeding: copy the site bundled in assets/www/ into internal storage,
    // so from then on the app can freely overwrite individual files there
    // with newer ones fetched from Google Drive. Re-copied (on top of
    // whatever's already there, not wiped first) whenever the installed
    // app's own versionCode changes — not just on the very first run —
    // so that installing an updated APK (with different bundled content,
    // e.g. a tab added or removed) actually takes effect. Without this,
    // once wwwDir was seeded once it would never be touched again, and an
    // app update would silently keep showing the OLD bundled content.
    // ---------------------------------------------------------------------
    private void seedWwwDirIfNeeded() {
        boolean alreadySeeded = wwwDir.exists() && wwwDir.list() != null && wwwDir.list().length > 0;
        SharedPreferences prefs = getSharedPreferences(PREFS, MODE_PRIVATE);
        int currentVersionCode = getAppVersionCode();
        int seededVersionCode = prefs.getInt(PREF_SEEDED_VERSION_CODE, -1);

        if (alreadySeeded && seededVersionCode == currentVersionCode) return;

        try {
            copyAssetDir("www", wwwDir);
            prefs.edit().putInt(PREF_SEEDED_VERSION_CODE, currentVersionCode)
                .putLong(PREF_LAST_SYNC_TIME, System.currentTimeMillis()).apply();
        } catch (Exception e) {
            Toast.makeText(this, "Не удалось подготовить данные приложения: " + e.getMessage(), Toast.LENGTH_LONG).show();
        }
    }

    /**
     * Applies whatever brightness percentage was last saved from the
     * "Настройки" tab (or does nothing, leaving the system's own brightness
     * in effect, if the person never set one / chose "как в системе").
     * Called once at startup so the choice survives an app restart, and
     * again immediately whenever the person changes it (see
     * TmkNative.setBrightness below) so the change is visible right away.
     */
    private void applySavedBrightness() {
        int percent = getSharedPreferences(PREFS, MODE_PRIVATE).getInt(PREF_BRIGHTNESS_PERCENT, -1);
        WindowManager.LayoutParams attrs = getWindow().getAttributes();
        attrs.screenBrightness = percent >= 1 && percent <= 100
            ? Math.max(0.02f, percent / 100f)
            : WindowManager.LayoutParams.BRIGHTNESS_OVERRIDE_NONE;
        getWindow().setAttributes(attrs);
    }

    private int getAppVersionCode() {
        try {
            return getPackageManager().getPackageInfo(getPackageName(), 0).versionCode;
        } catch (Exception e) {
            return -1;
        }
    }

    private String getAppVersionName() {
        try {
            return getPackageManager().getPackageInfo(getPackageName(), 0).versionName;
        } catch (Exception e) {
            return "?";
        }
    }

    private void copyAssetDir(String assetPath, File destDir) throws Exception {
        String[] children = getAssets().list(assetPath);
        if (children == null || children.length == 0) {
            // it's a file, not a directory
            destDir.getParentFile().mkdirs();
            try (InputStream in = getAssets().open(assetPath);
                 OutputStream out = new FileOutputStream(destDir)) {
                byte[] buf = new byte[8192];
                int n;
                while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            }
            return;
        }
        destDir.mkdirs();
        for (String child : children) {
            copyAssetDir(assetPath + "/" + child, new File(destDir, child));
        }
    }

    /**
     * Bridge called from JS: the app's rotation-follow behaviour for the
     * full-screen drawing viewer, the manual "Обновить данные" button, and
     * a live listing of docs_pdf/ so the "Документы" tab always reflects
     * whatever PDFs are actually on the device (bundled at install time,
     * or pulled down later from Google Drive) without needing a code change.
     */
    private class TmkNative {
        @JavascriptInterface
        public void enterImageView() {
            runOnUiThread(() -> setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR));
        }

        @JavascriptInterface
        public void exitImageView() {
            runOnUiThread(() -> setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED));
        }

        /**
         * "Во весь экран" for the 3D model / flow diagram screens: hides the
         * Android status bar and navigation bar (sticky immersive — they can
         * still be pulled back briefly with a swipe from the edge) on top of
         * the web layer hiding its own header/tabs. Called from index.html,
         * which is the page that relays the request up from whichever tab's
         * fullscreen button was pressed.
         */
        @JavascriptInterface
        public void enterFullscreen() {
            runOnUiThread(() -> {
                fullscreenActive = true;
                View decor = getWindow().getDecorView();
                decor.setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
            });
        }

        @JavascriptInterface
        public void exitFullscreen() {
            runOnUiThread(() -> {
                fullscreenActive = false;
                getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
            });
        }

        /**
         * The screen-brightness percentage last set from "Настройки", or -1
         * if the person hasn't overridden it (screen follows the system's
         * own brightness/auto-brightness). Called from settings.html on load
         * so its slider starts at whatever is actually in effect.
         */
        @JavascriptInterface
        public String getBrightness() {
            return String.valueOf(getSharedPreferences(PREFS, MODE_PRIVATE).getInt(PREF_BRIGHTNESS_PERCENT, -1));
        }

        /**
         * percent: 1–100 to force the screen to that brightness while this
         * app is in the foreground, or -1 to go back to following the
         * system's own brightness. Applied immediately AND saved, so it's
         * still in effect the next time the app is opened (see
         * applySavedBrightness(), called from onCreate).
         */
        @JavascriptInterface
        public void setBrightness(int percent) {
            final int clamped = percent < 0 ? -1 : Math.max(1, Math.min(100, percent));
            getSharedPreferences(PREFS, MODE_PRIVATE).edit().putInt(PREF_BRIGHTNESS_PERCENT, clamped).apply();
            runOnUiThread(MainActivity.this::applySavedBrightness);
        }

        @JavascriptInterface
        public void checkForUpdates() {
            Log.d(TAG, "JS bridge: checkForUpdates() invoked from the ⟳ button");
            MainActivity.this.checkForUpdates(true);
        }

        /**
         * Returns a JSON array of paths (relative to wwwDir, e.g.
         * "docs_pdf/foo.pdf") for every .pdf currently sitting in
         * docs_pdf/ on the device, sorted by name. Called from docs.html
         * on load so the page always shows the real, current set of files
         * instead of a list baked in at build time.
         */
        @JavascriptInterface
        public String listDocsPdf() {
            JSONArray arr = new JSONArray();
            File dir = new File(wwwDir, "docs_pdf");
            File[] files = dir.listFiles();
            if (files != null) {
                java.util.Arrays.sort(files, (a, b) -> a.getName().compareToIgnoreCase(b.getName()));
                for (File f : files) {
                    if (f.isFile() && f.getName().toLowerCase(Locale.ROOT).endsWith(".pdf")) {
                        arr.put("docs_pdf/" + f.getName());
                    }
                }
            }
            return arr.toString();
        }

        /**
         * Returns a JSON array of every image filename currently sitting in
         * sec_img/ on the device (bundled at install time, or pulled down
         * later from Google Drive), sorted by name. Called from flow.html /
         * model.html so a newly-synced equipment photo can show up in the
         * right gallery automatically, instead of only the photos that were
         * baked into the page's IMGS table at build time.
         */
        @JavascriptInterface
        public String listSecImages() {
            JSONArray arr = new JSONArray();
            File dir = new File(wwwDir, "sec_img");
            File[] files = dir.listFiles();
            if (files != null) {
                java.util.Arrays.sort(files, (a, b) -> a.getName().compareToIgnoreCase(b.getName()));
                for (File f : files) {
                    String n = f.getName().toLowerCase(Locale.ROOT);
                    if (f.isFile() && (n.endsWith(".jpg") || n.endsWith(".jpeg") || n.endsWith(".png"))) {
                        arr.put(f.getName());
                    }
                }
            }
            return arr.toString();
        }

        /**
         * Small status blob for display in the UI (currently shown at the
         * top of "Документы"): the app's own version name/number, and when
         * the on-device data was last actually updated — either the initial
         * install/app-update seed, or the last time the "⟳" sync applied
         * changes, whichever happened more recently.
         */
        @JavascriptInterface
        public String getDataInfo() {
            SharedPreferences prefs = getSharedPreferences(PREFS, MODE_PRIVATE);
            long lastSync = prefs.getLong(PREF_LAST_SYNC_TIME, 0);
            JSONObject o = new JSONObject();
            try {
                o.put("appVersionName", getAppVersionName());
                o.put("lastSyncMillis", lastSync);
            } catch (Exception ignore) {}
            return o.toString();
        }

        /** The Drive folder ID the whole app is configured with, or "" if not configured. */
        @JavascriptInterface
        public String driveRootFolderId() {
            if (DRIVE_FOLDER_ID == null || DRIVE_FOLDER_ID.startsWith("PUT_")
                    || DRIVE_API_KEY == null || DRIVE_API_KEY.startsWith("PUT_")) return "";
            return DRIVE_FOLDER_ID;
        }

        /**
         * Lists the immediate contents (files AND subfolders, one level —
         * NOT recursive, so this is fast even for a huge Drive tree) of a
         * folder, for the "Архив чертежей" browser. Runs on a background
         * thread; the result (or an error) comes back asynchronously via
         * window.tmkDriveEvent('list', requestId, {...}) in drive.html.
         */
        @JavascriptInterface
        public void browseDriveFolder(String folderId, String requestId) {
            Log.d(TAG, "browseDriveFolder folderId=" + folderId + " requestId=" + requestId);
            new Thread(() -> {
                JSONObject payload = new JSONObject();
                try {
                    List<DriveEntry> entries = listDriveFolderShallow(folderId);
                    JSONArray arr = new JSONArray();
                    for (DriveEntry e : entries) {
                        JSONObject o = new JSONObject();
                        o.put("id", e.id);
                        o.put("name", e.name);
                        o.put("isFolder", e.isFolder);
                        o.put("size", e.size);
                        arr.put(o);
                    }
                    payload.put("ok", true);
                    payload.put("entries", arr);
                } catch (Exception e) {
                    Log.e(TAG, "browseDriveFolder failed", e);
                    try { payload.put("ok", false); payload.put("error", e.getMessage()); } catch (Exception ignore) {}
                }
                fireDriveEvent("list", requestId, payload);
            }).start();
        }

        /**
         * Downloads a single file from Drive into a permanent app storage
         * folder (getFilesDir(), NOT getCacheDir() — Android is free to wipe
         * the cache dir under storage pressure, but never touches this one),
         * re-using it if that exact file was already downloaded before — no
         * re-download just to reopen something. Runs on a background thread;
         * success or failure is reported back via
         * window.tmkDriveEvent('download', requestId, {...}).
         */
        @JavascriptInterface
        public void downloadAndOpenDriveFile(String fileId, String fileName, String requestId) {
            Log.d(TAG, "downloadAndOpenDriveFile fileId=" + fileId + " fileName=" + fileName + " requestId=" + requestId);
            new Thread(() -> {
                JSONObject payload = new JSONObject();
                File outFile = null;
                try {
                    File cacheDir = new File(getFilesDir(), "drive_files");
                    if (!cacheDir.exists()) cacheDir.mkdirs();
                    migrateOldCachedDriveFilesOnce();
                    // fileId is unique per Drive file, so prefixing with it avoids
                    // name collisions between same-named files in different folders
                    outFile = new File(cacheDir, fileId + "_" + fileName);
                    if (!outFile.exists() || outFile.length() == 0) {
                        String url = "https://www.googleapis.com/drive/v3/files/" + fileId + "?alt=media&key=" + DRIVE_API_KEY;
                        downloadToFile(url, outFile);
                    } else {
                        Log.d(TAG, "already cached locally, skipping re-download: " + outFile.getName());
                    }
                    payload.put("ok", true);
                } catch (Exception e) {
                    Log.e(TAG, "downloadAndOpenDriveFile failed", e);
                    try { payload.put("ok", false); payload.put("error", e.getMessage()); } catch (Exception ignore) {}
                    outFile = null;
                }
                final File toOpen = outFile;
                fireDriveEvent("download", requestId, payload);
                if (toOpen != null) {
                    runOnUiThread(() -> openLocalFile(toOpen));
                }
            }).start();
        }

        /**
         * One-time cleanup: earlier builds stored "Архив" downloads under
         * getCacheDir()/drive_files (which Android may wipe), before this
         * was switched to permanent storage (getFilesDir()/drive_files).
         * Moves anything still sitting in the old cache location over, so
         * files already downloaded during testing aren't silently lost.
         */
        private void migrateOldCachedDriveFilesOnce() {
            File oldDir = new File(getCacheDir(), "drive_files");
            File newDir = new File(getFilesDir(), "drive_files");
            File[] oldFiles = oldDir.exists() ? oldDir.listFiles() : null;
            if (oldFiles == null) return;
            for (File f : oldFiles) {
                File dest = new File(newDir, f.getName());
                if (!dest.exists()) {
                    if (!f.renameTo(dest)) {
                        Log.w(TAG, "migrateOldCachedDriveFiles: failed to move " + f.getName());
                    }
                } else {
                    f.delete();
                }
            }
        }

        /**
         * Downloads everything inside a Drive folder (recursively, including
         * all subfolders — this can genuinely mean the whole configured
         * archive if called on the root) into permanent app storage,
         * preserving the folder structure. Unlike the single-file download
         * above, this is a long-running, multi-step operation, so progress
         * comes back as a series of window.tmkDriveEvent(kind, requestId, ...)
         * calls rather than one: 'bulk-status' (stage:"listing", then
         * stage:"confirm" with the file count/size for the page to show),
         * 'bulk-progress' (done/total/failed/currentName as each file
         * finishes), 'bulk-cancelled', 'bulk-error', or 'bulk-done' at the
         * end. archiveBulkCancelRequested lets the "Отмена" button in
         * drive.html stop it early via cancelDownloadAll() below.
         */
        @JavascriptInterface
        public void downloadAllInFolder(String folderId, String requestId) {
            Log.d(TAG, "downloadAllInFolder folderId=" + folderId + " requestId=" + requestId);
            archiveBulkCancelRequested.set(false);
            new Thread(() -> {
                try {
                    fireDriveEvent("bulk-status", requestId, jsonOf("stage", "listing"));
                    List<DriveFile> files;
                    try {
                        // Generous but still bounded folder-count budget: this is an
                        // explicit, user-initiated "download everything" action (not
                        // an automatic background sync), so it's fine for it to take
                        // a while — it just shouldn't be able to loop forever.
                        files = listDriveFolderRecursive(folderId, "", new java.util.concurrent.atomic.AtomicInteger(5000));
                    } catch (Exception e) {
                        Log.e(TAG, "downloadAllInFolder: listing failed", e);
                        fireDriveEvent("bulk-error", requestId, jsonOfError(e));
                        return;
                    }
                    if (archiveBulkCancelRequested.get()) {
                        fireDriveEvent("bulk-cancelled", requestId, new JSONObject());
                        return;
                    }

                    long totalBytes = 0;
                    boolean sizeKnown = true;
                    for (DriveFile f : files) {
                        if (f.size < 0) sizeKnown = false; else totalBytes += f.size;
                    }
                    JSONObject confirmPayload = new JSONObject();
                    confirmPayload.put("stage", "confirm");
                    confirmPayload.put("count", files.size());
                    confirmPayload.put("totalBytes", totalBytes);
                    confirmPayload.put("sizeKnown", sizeKnown);
                    fireDriveEvent("bulk-status", requestId, confirmPayload);

                    if (files.isEmpty()) {
                        fireDriveEvent("bulk-done", requestId, bulkDonePayload(0, 0, 0));
                        return;
                    }
                    boolean proceed = askUserToDownloadAll(files.size(), totalBytes, sizeKnown);
                    if (!proceed || archiveBulkCancelRequested.get()) {
                        fireDriveEvent("bulk-cancelled", requestId, new JSONObject());
                        return;
                    }

                    File baseDir = new File(getFilesDir(), "drive_files_all");
                    int done = 0, failed = 0;
                    for (DriveFile f : files) {
                        if (archiveBulkCancelRequested.get()) {
                            fireDriveEvent("bulk-cancelled", requestId, bulkDonePayload(done, failed, files.size()));
                            return;
                        }
                        File outFile = new File(baseDir, f.path);
                        try {
                            File parent = outFile.getParentFile();
                            if (parent != null) parent.mkdirs();
                            if (!outFile.exists() || outFile.length() == 0) {
                                String url = "https://www.googleapis.com/drive/v3/files/" + f.id + "?alt=media&key=" + DRIVE_API_KEY;
                                // Downloads are already strictly one-at-a-time (this is a
                                // single background thread walking the list in order) —
                                // that alone wasn't enough, so on top of that: up to 4
                                // attempts with a growing pause (5s/15s/40s) whenever the
                                // failure looks like Google's "Sorry..." anti-abuse block
                                // page rather than a real error, before giving up on this
                                // one file and moving on to the next.
                                int[] backoffSeconds = {5, 15, 40};
                                Exception lastError = null;
                                boolean ok = false;
                                for (int attempt = 0; attempt <= backoffSeconds.length; attempt++) {
                                    try {
                                        downloadToFile(url, outFile);
                                        // Verify the file actually landed intact before treating
                                        // it as done and moving on — if Drive reported a size for
                                        // it and what we got doesn't match (truncated/corrupted
                                        // transfer), don't keep the bad file: delete it and treat
                                        // this like any other retryable failure below.
                                        if (f.size >= 0 && outFile.length() != f.size) {
                                            long got = outFile.length();
                                            outFile.delete();
                                            throw new Exception("файл повреждён при скачивании: получено "
                                                + got + " байт из " + f.size);
                                        }
                                        ok = true;
                                        break;
                                    } catch (Exception attemptErr) {
                                        lastError = attemptErr;
                                        boolean retryable = looksLikeGoogleRateLimit(attemptErr)
                                            || (attemptErr.getMessage() != null && attemptErr.getMessage().contains("повреждён"));
                                        if (attempt < backoffSeconds.length && retryable) {
                                            Log.w(TAG, "downloadAllInFolder: retryable failure on " + f.path
                                                + " (" + attemptErr.getMessage() + "), waiting " + backoffSeconds[attempt]
                                                + "s before retry " + (attempt + 1));
                                            Thread.sleep(backoffSeconds[attempt] * 1000L);
                                        } else {
                                            break;
                                        }
                                    }
                                }
                                if (!ok) throw lastError;
                            }
                            done++;
                        } catch (Exception e) {
                            Log.e(TAG, "downloadAllInFolder: failed on " + f.path, e);
                            failed++;
                        }
                        JSONObject progress = new JSONObject();
                        progress.put("done", done + failed);
                        progress.put("total", files.size());
                        progress.put("failed", failed);
                        progress.put("currentName", f.path);
                        fireDriveEvent("bulk-progress", requestId, progress);
                        // Bigger self-throttle between every file (not just after a
                        // detected block) so a big folder is less likely to trip
                        // Google's rate limiting in the first place.
                        try { Thread.sleep(700); } catch (InterruptedException ignore) {}
                    }
                    fireDriveEvent("bulk-done", requestId, bulkDonePayload(done, failed, files.size()));
                } catch (Exception e) {
                    Log.e(TAG, "downloadAllInFolder failed", e);
                    try { fireDriveEvent("bulk-error", requestId, jsonOfError(e)); } catch (Exception ignore) {}
                }
            }).start();
        }

        @JavascriptInterface
        public void cancelDownloadAll(String requestId) {
            Log.d(TAG, "cancelDownloadAll requestId=" + requestId);
            archiveBulkCancelRequested.set(true);
        }

        /**
         * Total size + file count of everything downloaded so far from
         * "Архив" (both single-file downloads and "Скачать всё" runs), so
         * the page can show how much space it's using.
         */
        @JavascriptInterface
        public String getDriveStorageUsage() {
            long[] totals = {0, 0}; // bytes, count
            addDirStats(new File(getFilesDir(), "drive_files"), totals);
            addDirStats(new File(getFilesDir(), "drive_files_all"), totals);
            JSONObject o = new JSONObject();
            try { o.put("bytes", totals[0]); o.put("count", totals[1]); } catch (Exception ignore) {}
            return o.toString();
        }

        /** Deletes everything downloaded via "Архив" (both storage folders) to free up space. */
        @JavascriptInterface
        public String clearDriveStorage() {
            long[] totals = {0, 0};
            File a = new File(getFilesDir(), "drive_files");
            File b = new File(getFilesDir(), "drive_files_all");
            addDirStats(a, totals);
            addDirStats(b, totals);
            deleteDirContents(a);
            deleteDirContents(b);
            JSONObject o = new JSONObject();
            try { o.put("ok", true); o.put("freedBytes", totals[0]); } catch (Exception ignore) {}
            return o.toString();
        }

        private void addDirStats(File dir, long[] totals) {
            File[] files = dir.listFiles();
            if (files == null) return;
            for (File f : files) {
                if (f.isDirectory()) addDirStats(f, totals);
                else { totals[0] += f.length(); totals[1] += 1; }
            }
        }

        private void deleteDirContents(File dir) {
            File[] files = dir.listFiles();
            if (files == null) return;
            for (File f : files) {
                if (f.isDirectory()) { deleteDirContents(f); f.delete(); }
                else f.delete();
            }
        }

        /** Heuristic: does this exception look like Google's "Sorry..." anti-abuse block page rather than a real Drive API error? */
        private boolean looksLikeGoogleRateLimit(Exception e) {
            String msg = e.getMessage();
            if (msg == null) return false;
            return msg.contains("403") && (msg.contains("Sorry") || msg.contains("unusual traffic"));
        }

        private JSONObject jsonOf(String key, String value) throws Exception {
            JSONObject o = new JSONObject();
            o.put(key, value);
            return o;
        }

        private JSONObject jsonOfError(Exception e) {
            JSONObject o = new JSONObject();
            try { o.put("ok", false); o.put("error", e.getMessage()); } catch (Exception ignore) {}
            return o;
        }

        private JSONObject bulkDonePayload(int done, int failed, int total) throws Exception {
            JSONObject o = new JSONObject();
            o.put("done", done);
            o.put("failed", failed);
            o.put("total", total);
            return o;
        }

        private void fireDriveEvent(String kind, String requestId, JSONObject payload) {
            final String json = payload.toString();
            Log.d(TAG, "fireDriveEvent kind=" + kind + " requestId=" + requestId + " payload=" + json);
            runOnUiThread(() -> {
                if (webView == null) { Log.w(TAG, "fireDriveEvent: webView is null, dropping"); return; }
                String js = "(function(){ try { if (window.tmkDriveEvent) { window.tmkDriveEvent("
                    + JSONObject.quote(kind) + "," + JSONObject.quote(requestId) + "," + json + "); return 'relayed'; } "
                    + "return 'no-tmkDriveEvent-on-window'; } catch(e) { return 'error:'+e; } })()";
                webView.evaluateJavascript(js, result -> Log.d(TAG, "fireDriveEvent eval result=" + result));
            });
        }
    }

    // ---------------------------------------------------------------------
    // Google Drive sync: recursively list everything inside DRIVE_FOLDER_ID
    // (files + subfolders, via the Drive API), build a signature of that
    // listing (paths + Drive file ids + modified times + sizes), and if it
    // differs from what was last applied, ask the user for permission —
    // showing how many files and roughly how many MB — before downloading
    // anything. Every file in the tree gets downloaded, preserving the
    // folder structure, so there is no separate manifest to hand-maintain:
    // whatever is in the Drive folder is what ends up in the app.
    // ---------------------------------------------------------------------
    private void checkForUpdates(boolean manual) {
        Log.d(TAG, "checkForUpdates() called, manual=" + manual);
        if (DRIVE_FOLDER_ID == null || DRIVE_FOLDER_ID.startsWith("PUT_")
                || DRIVE_API_KEY == null || DRIVE_API_KEY.startsWith("PUT_")) {
            Log.d(TAG, "aborting: DRIVE_FOLDER_ID/DRIVE_API_KEY not configured");
            if (manual) {
                Toast.makeText(this, "Синхронизация с Google Диском ещё не настроена в приложении", Toast.LENGTH_LONG).show();
                notifyJsSyncDone(false);
            }
            return;
        }

        cancelRequested.set(false);

        // Hard safety cap: whatever happens in the background (a network call
        // that somehow ignores its own timeout, a confirmation dialog that
        // fails to actually render, anything unforeseen), the sync spinner
        // must stop and the person must see SOMETHING within a bounded time
        // instead of spinning forever with zero feedback.
        final AtomicBoolean finished = new AtomicBoolean(false);
        final android.os.Handler watchdog = new android.os.Handler(android.os.Looper.getMainLooper());
        Runnable timeoutTask = () -> {
            Log.w(TAG, "60s watchdog fired — background thread hasn't reported back");
            if (finished.compareAndSet(false, true)) {
                if (manual) {
                    Toast.makeText(this, "Проверка обновлений не завершилась за 60 секунд — прервано. "
                        + "Проверьте интернет и настройки API-ключа в Google Cloud, затем попробуйте ещё раз.",
                        Toast.LENGTH_LONG).show();
                }
                notifyJsSyncDone(false);
            }
        };
        watchdog.postDelayed(timeoutTask, 60000);

        Log.d(TAG, "background thread starting, listing Drive folder " + DRIVE_FOLDER_ID);
        new Thread(() -> {
            boolean changed = false;
            boolean userDeclinedOrCancelled = false;
            String errorMsg = null;
            try {
                List<DriveFile> allFiles = listDriveFolderRecursive(DRIVE_FOLDER_ID, "");
                Log.d(TAG, "listDriveFolderRecursive returned " + allFiles.size() + " files");
                Collections.sort(allFiles, (a, b) -> a.path.compareTo(b.path));

                StringBuilder sig = new StringBuilder();
                long totalBytes = 0;
                boolean sizeKnown = true;
                for (DriveFile f : allFiles) {
                    sig.append(f.path).append('|').append(f.id).append('|').append(f.modifiedTime).append('|').append(f.size).append(';');
                    if (f.size >= 0) totalBytes += f.size; else sizeKnown = false;
                }
                String remoteVersion = sha256(sig.toString());

                SharedPreferences prefs = getSharedPreferences(PREFS, MODE_PRIVATE);
                String localVersion = prefs.getString(PREF_VERSION, "");
                boolean versionChanged = !remoteVersion.equals(localVersion);
                Log.d(TAG, "remoteVersion=" + remoteVersion + " localVersion=" + localVersion + " versionChanged=" + versionChanged);

                if (versionChanged) {
                    if (allFiles.isEmpty()) {
                        // folder is empty — nothing to fetch, just record the signature
                        Log.d(TAG, "Drive folder is empty, just recording signature");
                        prefs.edit().putString(PREF_VERSION, remoteVersion).apply();
                    } else {
                        Log.d(TAG, "asking user to confirm download of " + allFiles.size() + " files, ~" + totalBytes + " bytes");
                        boolean proceed = askUserToDownload(allFiles.size(), totalBytes, sizeKnown);
                        Log.d(TAG, "askUserToDownload returned proceed=" + proceed);

                        if (proceed) {
                            showProgressDialog(allFiles.size());
                            int downloaded = 0;
                            for (DriveFile f : allFiles) {
                                if (cancelRequested.get()) break;
                                Log.d(TAG, "downloading " + f.path);
                                downloadDriveFile(f.id, f.path);
                                downloaded++;
                                updateProgressDialog(downloaded, allFiles.size());
                            }
                            Log.d(TAG, "download loop finished, downloaded=" + downloaded + " cancelled=" + cancelRequested.get());
                            dismissProgressDialog();

                            if (cancelRequested.get()) {
                                userDeclinedOrCancelled = true;
                                // leave the stored version as-is so the app offers the
                                // same update again next time instead of silently
                                // treating a half-applied update as "done"
                            } else {
                                prefs.edit().putString(PREF_VERSION, remoteVersion)
                                    .putLong(PREF_LAST_SYNC_TIME, System.currentTimeMillis()).apply();
                                changed = downloaded > 0;
                            }
                        } else {
                            userDeclinedOrCancelled = true;
                        }
                    }
                }
            } catch (Exception e) {
                Log.e(TAG, "checkForUpdates background thread threw", e);
                errorMsg = e.getMessage();
            }
            Log.d(TAG, "background thread finished: changed=" + changed + " declined=" + userDeclinedOrCancelled + " err=" + errorMsg);

            final boolean didChange = changed;
            final boolean declined = userDeclinedOrCancelled;
            final String err = errorMsg;
            runOnUiThread(() -> {
                watchdog.removeCallbacks(timeoutTask);
                if (!finished.compareAndSet(false, true)) {
                    Log.d(TAG, "watchdog already fired before background thread finished — ignoring late result");
                    return;
                }
                if (err != null) {
                    if (manual) Toast.makeText(this, "Не удалось проверить обновления: " + err, Toast.LENGTH_LONG).show();
                } else if (didChange) {
                    Toast.makeText(this, "Данные приложения обновлены с Google Диска", Toast.LENGTH_LONG).show();
                } else if (declined) {
                    if (cancelRequested.get() || manual) {
                        Toast.makeText(this, "Обновление отменено", Toast.LENGTH_SHORT).show();
                    }
                } else if (manual) {
                    Toast.makeText(this, "Обновлений нет — уже последняя версия", Toast.LENGTH_SHORT).show();
                }
                notifyJsSyncDone(didChange);
            });
        }).start();
    }

    /** One file found while walking the Drive folder tree. */
    private static class DriveFile {
        final String path;   // relative path under wwwDir, mirroring the Drive folder structure
        final String id;     // Drive file id, used both to download it and as part of the version signature
        final long size;     // bytes, or -1 if Drive didn't report one
        final String modifiedTime;

        DriveFile(String path, String id, long size, String modifiedTime) {
            this.path = path;
            this.id = id;
            this.size = size;
            this.modifiedTime = modifiedTime;
        }
    }

    /** One immediate child of a folder, for the on-demand "Архив чертежей" browser. */
    private static class DriveEntry {
        final String id, name;
        final boolean isFolder;
        final long size;

        DriveEntry(String id, String name, boolean isFolder, long size) {
            this.id = id;
            this.name = name;
            this.isFolder = isFolder;
            this.size = size;
        }
    }

    /**
     * Lists just the immediate children of a Drive folder — one API call
     * (or a couple, if there are more than 1000 entries), no recursion into
     * subfolders. Used by the "Архив чертежей" browser so opening a folder
     * with a huge tree underneath it is instant instead of walking the
     * whole tree up front (that's what checkForUpdates()'s
     * listDriveFolderRecursive is for, and why it can be slow on a big
     * Drive folder).
     */
    private List<DriveEntry> listDriveFolderShallow(String folderId) throws Exception {
        List<DriveEntry> result = new ArrayList<>();
        String pageToken = null;
        int page_n = 0;
        do {
            if (++page_n > 50) throw new Exception("Слишком много страниц списка (>50)");
            StringBuilder url = new StringBuilder("https://www.googleapis.com/drive/v3/files");
            url.append("?q=").append(URLEncoder.encode("'" + folderId + "' in parents and trashed = false", "UTF-8"));
            url.append("&fields=").append(URLEncoder.encode("nextPageToken,files(id,name,mimeType,size)", "UTF-8"));
            url.append("&orderBy=").append(URLEncoder.encode("folder,name", "UTF-8"));
            url.append("&pageSize=1000");
            url.append("&key=").append(DRIVE_API_KEY);
            if (pageToken != null) url.append("&pageToken=").append(URLEncoder.encode(pageToken, "UTF-8"));

            JSONObject page = new JSONObject(httpGetString(url.toString()));
            if (page.has("error")) {
                throw new Exception(page.getJSONObject("error").optString("message", "Google Drive API error"));
            }
            JSONArray files = page.optJSONArray("files");
            if (files != null) {
                for (int i = 0; i < files.length(); i++) {
                    JSONObject f = files.getJSONObject(i);
                    String name = f.optString("name", "");
                    String id = f.optString("id", "");
                    String mime = f.optString("mimeType", "");
                    if (name.isEmpty() || id.isEmpty()) continue;
                    boolean isFolder = "application/vnd.google-apps.folder".equals(mime);
                    if (!isFolder && mime.startsWith("application/vnd.google-apps.")) continue; // Google Docs/Sheets etc — no real bytes to download
                    long size = f.has("size") ? f.optLong("size", -1) : -1;
                    result.add(new DriveEntry(id, name, isFolder, size));
                }
            }
            pageToken = page.has("nextPageToken") ? page.optString("nextPageToken", null) : null;
        } while (pageToken != null && !pageToken.isEmpty());
        return result;
    }

    /**
     * Walks a Drive folder and all its subfolders via the Drive API v3
     * files.list endpoint, returning every regular file found with a
     * relative path that mirrors the folder nesting (so a file inside a
     * "docs_pdf" subfolder on Drive ends up at "docs_pdf/name.pdf" locally).
     * Google-native files (Docs/Sheets/Slides — anything without real bytes
     * to download via alt=media) are skipped.
     */
    private List<DriveFile> listDriveFolderRecursive(String folderId, String pathPrefix) throws Exception {
        return listDriveFolderRecursive(folderId, pathPrefix, new java.util.concurrent.atomic.AtomicInteger(300));
    }

    /**
     * foldersVisitedBudget is shared across the WHOLE recursive walk (not
     * per-call) so a huge, deeply-nested Drive folder fails fast with a
     * clear message instead of silently taking minutes — this is the full
     * auto-sync used by checkForUpdates()/the "⟳" button, meant for a
     * small, dedicated folder; the "Архив" tab (browseDriveFolder /
     * listDriveFolderShallow) is the one built for browsing a huge tree.
     */
    private List<DriveFile> listDriveFolderRecursive(String folderId, String pathPrefix, java.util.concurrent.atomic.AtomicInteger foldersVisitedBudget) throws Exception {
        if (foldersVisitedBudget.decrementAndGet() < 0) {
            throw new Exception("Папка на Google Диске слишком большая для автообновления (>300 вложенных папок). "
                + "Используйте вкладку «Архив» для просмотра и скачивания, либо настройте автообновление на отдельную небольшую папку.");
        }
        List<DriveFile> result = new ArrayList<>();
        String pageToken = null;
        int page_n = 0;
        do {
            if (++page_n > 50) throw new Exception("Слишком много страниц списка (>50) — похоже на зацикливание");
            StringBuilder url = new StringBuilder("https://www.googleapis.com/drive/v3/files");
            url.append("?q=").append(URLEncoder.encode("'" + folderId + "' in parents and trashed = false", "UTF-8"));
            url.append("&fields=").append(URLEncoder.encode("nextPageToken,files(id,name,mimeType,modifiedTime,size)", "UTF-8"));
            url.append("&pageSize=1000");
            url.append("&key=").append(DRIVE_API_KEY);
            if (pageToken != null) url.append("&pageToken=").append(URLEncoder.encode(pageToken, "UTF-8"));

            Log.d(TAG, "listing folder=" + folderId + " path='" + pathPrefix + "' page=" + page_n);
            JSONObject page = new JSONObject(httpGetString(url.toString()));
            if (page.has("error")) {
                String msg = page.getJSONObject("error").optString("message", "Google Drive API error");
                Log.e(TAG, "Drive API returned error JSON: " + msg);
                throw new Exception(msg);
            }
            JSONArray files = page.optJSONArray("files");
            if (files != null) {
                for (int i = 0; i < files.length(); i++) {
                    JSONObject f = files.getJSONObject(i);
                    String name = f.optString("name", "");
                    String id = f.optString("id", "");
                    String mime = f.optString("mimeType", "");
                    if (name.isEmpty() || id.isEmpty() || name.contains("..")) continue;
                    String path = pathPrefix.isEmpty() ? name : pathPrefix + "/" + name;

                    if ("application/vnd.google-apps.folder".equals(mime)) {
                        result.addAll(listDriveFolderRecursive(id, path, foldersVisitedBudget));
                    } else if (!mime.startsWith("application/vnd.google-apps.")) {
                        long size = f.has("size") ? f.optLong("size", -1) : -1;
                        String modified = f.optString("modifiedTime", "");
                        result.add(new DriveFile(path, id, size, modified));
                    }
                }
            }
            pageToken = page.has("nextPageToken") ? page.optString("nextPageToken", null) : null;
        } while (pageToken != null && !pageToken.isEmpty());
        return result;
    }

    private void downloadDriveFile(String fileId, String relativePath) throws Exception {
        String url = "https://www.googleapis.com/drive/v3/files/" + fileId + "?alt=media&key=" + DRIVE_API_KEY;
        downloadToWww(url, relativePath);
    }

    private static String sha256(String s) throws Exception {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] digest = md.digest(s.getBytes("UTF-8"));
        StringBuilder sb = new StringBuilder();
        for (byte b : digest) sb.append(String.format("%02x", b));
        return sb.toString();
    }

    /** Blocks the calling (background) thread until the user answers the dialog. */
    private boolean askUserToDownload(int fileCount, long totalBytes, boolean sizeKnown) {
        ConditionVariable gate = new ConditionVariable();
        final boolean[] answer = {false};
        runOnUiThread(() -> {
            String sizeStr = sizeKnown ? formatBytes(totalBytes) : "размер неизвестен";
            String fileWord = pluralFiles(fileCount);
            new AlertDialog.Builder(this)
                .setTitle("Доступно обновление данных")
                .setMessage("На Google Диске есть новая версия данных проекта.\n\n"
                    + "Нужно скачать: " + fileCount + " " + fileWord + "\n"
                    + "Ориентировочный размер: " + sizeStr + "\n\n"
                    + "Скачать сейчас? Потребуется подключение к интернету.")
                .setCancelable(false)
                .setPositiveButton("Скачать", (d, w) -> { answer[0] = true; gate.open(); })
                .setNegativeButton("Отмена", (d, w) -> { answer[0] = false; gate.open(); })
                .show();
        });
        gate.block(50000); // matches the outer 60s watchdog with margin to spare — if the dialog never actually rendered for some reason, don't block this thread forever
        return answer[0];
    }

    /** Same shape as askUserToDownload above, but worded for the explicit "Скачать всё" button in "Архив" rather than an automatic update check. No 50s cap here — this is a manual action, so it's fine to just wait for the person to answer. */
    private boolean askUserToDownloadAll(int fileCount, long totalBytes, boolean sizeKnown) {
        ConditionVariable gate = new ConditionVariable();
        final boolean[] answer = {false};
        runOnUiThread(() -> {
            String sizeStr = sizeKnown ? formatBytes(totalBytes) : "размер неизвестен";
            String fileWord = pluralFiles(fileCount);
            new AlertDialog.Builder(this)
                .setTitle("Скачать всю папку?")
                .setMessage("Файлов: " + fileCount + " " + fileWord + "\n"
                    + "Ориентировочный размер: " + sizeStr + "\n\n"
                    + "Это может занять много времени и трафика. Скачивание можно будет отменить в процессе.")
                .setCancelable(false)
                .setPositiveButton("Скачать всё", (d, w) -> { answer[0] = true; gate.open(); })
                .setNegativeButton("Отмена", (d, w) -> { answer[0] = false; gate.open(); })
                .show();
        });
        gate.block();
        return answer[0];
    }

    private void showProgressDialog(int totalFiles) {
        ConditionVariable ready = new ConditionVariable();
        runOnUiThread(() -> {
            LinearLayout layout = new LinearLayout(this);
            layout.setOrientation(LinearLayout.VERTICAL);
            int pad = dp(20);
            layout.setPadding(pad, pad, pad, pad);

            progressText = new TextView(this);
            progressText.setText("Скачивание файлов: 0 из " + totalFiles);
            layout.addView(progressText);

            progressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
            progressBar.setMax(totalFiles);
            progressBar.setProgress(0);
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
            lp.topMargin = dp(14);
            layout.addView(progressBar, lp);

            progressDialog = new AlertDialog.Builder(this)
                .setTitle("Обновление данных")
                .setView(layout)
                .setCancelable(false)
                .setNegativeButton("Отмена", (d, w) -> cancelRequested.set(true))
                .show();
            ready.open();
        });
        ready.block(); // make sure the dialog exists before the download loop starts
    }

    private void updateProgressDialog(int done, int total) {
        runOnUiThread(() -> {
            if (progressText != null) progressText.setText("Скачивание файлов: " + done + " из " + total);
            if (progressBar != null) progressBar.setProgress(done);
        });
    }

    private void dismissProgressDialog() {
        runOnUiThread(() -> {
            if (progressDialog != null && progressDialog.isShowing()) progressDialog.dismiss();
            progressDialog = null;
            progressText = null;
            progressBar = null;
        });
    }

    private int dp(int value) {
        return (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, value, getResources().getDisplayMetrics());
    }

    private static String pluralFiles(int n) {
        int n10 = n % 10, n100 = n % 100;
        if (n10 == 1 && n100 != 11) return "файл";
        if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return "файла";
        return "файлов";
    }

    private static String formatBytes(long bytes) {
        if (bytes < 1024) return bytes + " Б";
        double kb = bytes / 1024.0;
        if (kb < 1024) return String.format(Locale.getDefault(), "%.0f КБ", kb);
        double mb = kb / 1024.0;
        return String.format(Locale.getDefault(), "%.1f МБ", mb);
    }

    private void notifyJsSyncDone(boolean changed) {
        if (webView != null) {
            webView.evaluateJavascript(
                "window.tmkSyncDone && window.tmkSyncDone(" + changed + ")", null);
        }
    }

    /**
     * Opens a connection to a direct-download URL, transparently getting past
     * Google Drive's "Google Drive can't scan this file for viruses" HTML
     * interstitial (shown for larger or often-downloaded files) by pulling
     * the confirm token out of that page and retrying once with it appended.
     * For a plain direct link (small file, or a host other than Drive) this
     * is a no-op — the first response is returned as-is.
     */
    private HttpURLConnection openDirect(String urlStr, int connectTimeout, int readTimeout) throws Exception {
        Log.d(TAG, "HTTP GET " + urlStr.replaceAll("key=[^&]+", "key=***"));
        HttpURLConnection conn = (HttpURLConnection) new URL(urlStr).openConnection();
        conn.setConnectTimeout(connectTimeout);
        conn.setReadTimeout(readTimeout);
        conn.setInstanceFollowRedirects(true);
        // Without a normal browser-looking User-Agent, Google's abuse
        // detection is quicker to flag a burst of back-to-back file
        // downloads (e.g. from "Скачать всё") as suspicious automated
        // traffic and answer with its "Sorry..." block page instead of the
        // file — this doesn't fix that on its own but makes it less likely.
        conn.setRequestProperty("User-Agent",
            "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36");
        int code = conn.getResponseCode();
        Log.d(TAG, "HTTP response code=" + code);
        if (code != 200) {
            // Surface Google's own error message (e.g. "API key not valid",
            // "Requests from this Android client application <package> are
            // blocked", "Daily Limit Exceeded") instead of a bare status
            // code, since that's what actually explains a 403/400 and what
            // tells us which setting in Google Cloud Console needs fixing.
            String detail = null;
            try {
                InputStream errStream = conn.getErrorStream();
                if (errStream != null) {
                    String body = readAllAsString(errStream);
                    try {
                        JSONObject err = new JSONObject(body).optJSONObject("error");
                        if (err != null) detail = err.optString("message", null);
                    } catch (Exception ignore) { /* body wasn't JSON */ }
                    if (detail == null && !body.isEmpty()) {
                        detail = body.length() > 200 ? body.substring(0, 200) : body;
                    }
                }
            } catch (Exception ignore) { /* fall back to bare code below */ }
            Log.e(TAG, "non-200 response, code=" + code + " detail=" + detail);
            throw new Exception("HTTP " + code + (detail != null ? ": " + detail : ""));
        }

        String contentType = conn.getContentType();
        if (contentType != null && contentType.contains("text/html")) {
            String html = readAllAsString(conn.getInputStream());
            conn.disconnect();
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("confirm=([0-9A-Za-z_-]+)").matcher(html);
            if (m.find()) {
                String sep = urlStr.contains("?") ? "&" : "?";
                String retryUrl = urlStr + sep + "confirm=" + m.group(1);
                HttpURLConnection conn2 = (HttpURLConnection) new URL(retryUrl).openConnection();
                conn2.setConnectTimeout(connectTimeout);
                conn2.setReadTimeout(readTimeout);
                conn2.setInstanceFollowRedirects(true);
                int code2 = conn2.getResponseCode();
                if (code2 != 200) throw new Exception("HTTP " + code2 + " после подтверждения Google Диска");
                return conn2;
            }
            throw new Exception("Google Диск вернул страницу вместо файла — проверьте, что для файла включён доступ \"Все, у кого есть ссылка\"");
        }
        return conn;
    }

    private static String readAllAsString(InputStream in) throws Exception {
        StringBuilder sb = new StringBuilder();
        byte[] buf = new byte[8192];
        int n;
        while ((n = in.read(buf)) > 0) sb.append(new String(buf, 0, n, "UTF-8"));
        return sb.toString();
    }

    private String httpGetString(String urlStr) throws Exception {
        HttpURLConnection conn = openDirect(urlStr, 15000, 15000);
        try {
            return readAllAsString(conn.getInputStream());
        } finally {
            conn.disconnect();
        }
    }

    private void downloadToWww(String urlStr, String relativePath) throws Exception {
        HttpURLConnection conn = openDirect(urlStr, 20000, 30000);
        try {
            File outFile = new File(wwwDir, relativePath);
            File parent = outFile.getParentFile();
            if (parent != null) parent.mkdirs();
            File tmp = new File(parent, outFile.getName() + ".part");
            try (InputStream in = conn.getInputStream();
                 OutputStream out = new FileOutputStream(tmp)) {
                byte[] buf = new byte[8192];
                int n;
                while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            }
            if (outFile.exists()) outFile.delete();
            tmp.renameTo(outFile);
        } finally {
            conn.disconnect();
        }
    }

    /** Like downloadToWww, but writes to an arbitrary absolute File instead of a path under wwwDir/. */
    private void downloadToFile(String urlStr, File outFile) throws Exception {
        HttpURLConnection conn = openDirect(urlStr, 20000, 60000);
        try {
            File parent = outFile.getParentFile();
            if (parent != null) parent.mkdirs();
            File tmp = new File(parent, outFile.getName() + ".part");
            try (InputStream in = conn.getInputStream();
                 OutputStream out = new FileOutputStream(tmp)) {
                byte[] buf = new byte[8192];
                int n;
                while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            }
            if (outFile.exists()) outFile.delete();
            tmp.renameTo(outFile);
        } finally {
            conn.disconnect();
        }
    }

    // ---------------------------------------------------------------------
    // Link handling (unchanged behaviour, just pointed at internal storage
    // instead of assets/ now that content can live there too)
    // ---------------------------------------------------------------------

    private boolean handleLink(Uri uri) {
        String url = uri.toString();
        String wwwPrefix = "file://" + wwwDir.getAbsolutePath() + "/";
        if (url.toLowerCase().endsWith(".pdf") && url.startsWith(wwwPrefix)) {
            openLocalPdf(url.substring(wwwPrefix.length()));
            return true;
        }
        String scheme = uri.getScheme();
        if (scheme != null && (scheme.equals("http") || scheme.equals("https"))) {
            // links to the outside world (e.g. the PWA link) — hand off to
            // whatever browser/app the phone has, the in-app WebView isn't for this
            try {
                startActivity(new Intent(Intent.ACTION_VIEW, uri));
            } catch (ActivityNotFoundException e) {
                Toast.makeText(this, "Не найдено приложение, чтобы открыть эту ссылку", Toast.LENGTH_LONG).show();
            }
            return true;
        }
        return false; // let the WebView load everything else (our own pages) normally
    }

    /**
     * Copies a PDF from internal storage into the app's cache dir (FileProvider
     * is set up to share only that cache subfolder), then launches
     * ACTION_VIEW with a content:// URI so any installed PDF viewer can open it.
     */
    private void openLocalPdf(String relativePath) {
        try {
            File srcFile = new File(wwwDir, relativePath);
            String fileName = srcFile.getName();
            File cacheDir = new File(getCacheDir(), "docs_pdf");
            if (!cacheDir.exists()) cacheDir.mkdirs();
            File outFile = new File(cacheDir, fileName);

            if (!outFile.exists() || outFile.length() != srcFile.length()) {
                try (InputStream in = new java.io.FileInputStream(srcFile);
                     OutputStream out = new FileOutputStream(outFile)) {
                    byte[] buf = new byte[8192];
                    int n;
                    while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
                }
            }

            Uri contentUri = FileProvider.getUriForFile(this, "com.tmkplant.app.fileprovider", outFile);
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(contentUri, "application/pdf");
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            if (intent.resolveActivity(getPackageManager()) != null) {
                // Intent.createChooser always shows the "Open with…" picker,
                // even when the user has set a default PDF app for this
                // system-wide "open a PDF" action — so every tap lets them
                // pick which app opens this particular file.
                Intent chooser = Intent.createChooser(intent, "Открыть PDF с помощью");
                chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                // the granted read permission on the content:// URI must be
                // extended to every app the chooser could hand the intent to
                List<android.content.pm.ResolveInfo> resInfoList =
                        getPackageManager().queryIntentActivities(intent, 0);
                for (android.content.pm.ResolveInfo ri : resInfoList) {
                    grantUriPermission(ri.activityInfo.packageName, contentUri,
                            Intent.FLAG_GRANT_READ_URI_PERMISSION);
                }
                startActivity(chooser);
            } else {
                Toast.makeText(this, "На устройстве не найдено приложение для просмотра PDF", Toast.LENGTH_LONG).show();
            }
        } catch (Exception e) {
            Toast.makeText(this, "Не удалось открыть PDF: " + e.getMessage(), Toast.LENGTH_LONG).show();
        }
    }

    /**
     * Generic version of openLocalPdf() for the "Архив чертежей" browser,
     * where a downloaded file could be a PDF, a JPEG, or something else
     * entirely (e.g. a .rar) — guesses the MIME type from the extension and
     * lets the person pick whatever app on their phone can open it.
     */
    private void openLocalFile(File file) {
        try {
            Uri contentUri = FileProvider.getUriForFile(this, "com.tmkplant.app.fileprovider", file);
            String ext = MimeTypeMap.getFileExtensionFromUrl(file.getName());
            String mime = ext != null ? MimeTypeMap.getSingleton().getMimeTypeFromExtension(ext.toLowerCase(Locale.ROOT)) : null;
            if (mime == null) mime = "*/*";

            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(contentUri, mime);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            if (intent.resolveActivity(getPackageManager()) != null) {
                Intent chooser = Intent.createChooser(intent, "Открыть с помощью");
                chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                List<ResolveInfo> resInfoList = getPackageManager().queryIntentActivities(intent, 0);
                for (ResolveInfo ri : resInfoList) {
                    grantUriPermission(ri.activityInfo.packageName, contentUri, Intent.FLAG_GRANT_READ_URI_PERMISSION);
                }
                startActivity(chooser);
            } else {
                Toast.makeText(this, "На устройстве нет приложения, чтобы открыть «" + file.getName() + "»", Toast.LENGTH_LONG).show();
            }
        } catch (Exception e) {
            Toast.makeText(this, "Не удалось открыть файл: " + e.getMessage(), Toast.LENGTH_LONG).show();
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && fullscreenActive) {
            fullscreenActive = false;
            getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
            if (webView != null) {
                webView.evaluateJavascript(
                    "window.tmkExitFullscreen && window.tmkExitFullscreen()", null);
            }
            return true;
        }
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}
