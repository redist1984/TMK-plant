package com.tmkplant.app;

import android.annotation.SuppressLint;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Bundle;
import android.os.Message;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.WindowManager;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.FileProvider;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

/**
 * Единственная активность приложения: полноэкранный WebView с сайтом
 * (3D-модель завода, схема технологических потоков, блокировки, анализы,
 * КИП, чертежи, PDF-документация).
 *
 * Контент — статический слепок репозитория: app/src/main/assets/www/
 * собирается из корня репозитория скриптом tools/build-android-assets.py
 * при сборке APK (в git он не хранится). Внутри себя приложение ничего не
 * скачивает — сеть не используется, разрешение INTERNET не запрошено.
 *
 * При первом запуске (и при каждом обновлении APK — по смене versionCode)
 * содержимое assets/www/ копируется во внутреннее хранилище
 * (getFilesDir()/www/), потому что из assets файлы только читаются, а WebView
 * должен уметь отдавать PDF системному просмотрщику через FileProvider.
 */
public class MainActivity extends AppCompatActivity {

    private static final String TAG = "TMK";

    // Имена настроек сохранены прежними, чтобы не потерять уже выбранную
    // пользователем яркость экрана.
    private static final String PREFS = "tmk_sync";
    private static final String PREF_SEEDED_VERSION_CODE = "seeded_version_code";
    private static final String PREF_DATA_INSTALLED_AT = "last_sync_time_millis";
    private static final String PREF_BRIGHTNESS_PERCENT = "brightness_percent";

    private WebView webView;
    private File wwwDir;

    // Включён ли сейчас режим «во весь экран» (кнопка в model.html / flow.html).
    // Нужно, чтобы аппаратная кнопка «Назад» сначала выходила из него.
    private boolean fullscreenActive = false;

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
        // Нужно, чтобы onCreateWindow срабатывал для ссылок с target="_blank"
        // (иначе WebView молча проглатывает клик).
        s.setSupportMultipleWindows(true);
        s.setJavaScriptCanOpenWindowsAutomatically(true);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return handleLink(request.getUrl());
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            // Пробрасывает console.log/warn/error и необработанные ошибки JS
            // в Logcat под нашим тегом — по умолчанию вывод WebView не виден.
            @Override
            public boolean onConsoleMessage(ConsoleMessage cm) {
                Log.d(TAG, "JS[" + cm.messageLevel() + "] " + cm.message()
                    + " (" + cm.sourceId() + ":" + cm.lineNumber() + ")");
                return true;
            }

            // Ссылки с target="_blank" (и window.open) не проходят через
            // shouldOverrideUrlLoading, потому что просят новое окно, а не
            // навигацию в текущем. Создаём одноразовый WebView, ловим его URL
            // и отдаём в тот же handleLink().
            @Override
            public boolean onCreateWindow(WebView view, boolean isDialog,
                                          boolean isUserGesture, Message resultMsg) {
                WebView popup = new WebView(MainActivity.this);
                popup.setWebViewClient(new WebViewClient() {
                    @Override
                    public boolean shouldOverrideUrlLoading(WebView popupView,
                                                            WebResourceRequest request) {
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
    }

    // ---------------------------------------------------------------------
    // Слепок контента: assets/www/ -> внутренняя память приложения.
    //
    // Копируется заново (поверх, не стирая) при каждой смене versionCode,
    // а не только при первом запуске: иначе после установки более новой APK
    // приложение продолжало бы показывать старый встроенный контент.
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
                .putLong(PREF_DATA_INSTALLED_AT, System.currentTimeMillis()).apply();
        } catch (Exception e) {
            Toast.makeText(this, "Не удалось подготовить данные приложения: " + e.getMessage(),
                Toast.LENGTH_LONG).show();
        }
    }

    /**
     * Яркость, сохранённая на вкладке «Настройки» (или ничего не делает,
     * оставляя системную яркость, если пользователь её не задавал).
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
            // это файл, а не каталог
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
     * Мост в JS. Только то, что нужно вебу: поворот экрана в полноэкранном
     * просмотре чертежей, системные панели, яркость и актуальные списки
     * файлов на устройстве.
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
         * «Во весь экран»: прячем системные панели (sticky immersive) поверх
         * того, как веб-слой прячет свои шапку и вкладки. Вызывается из
         * index.html, который ретранслирует запрос из нужной вкладки.
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
         * Яркость в процентах, сохранённая в «Настройках», или -1, если
         * пользователь её не переопределял.
         */
        @JavascriptInterface
        public String getBrightness() {
            return String.valueOf(
                getSharedPreferences(PREFS, MODE_PRIVATE).getInt(PREF_BRIGHTNESS_PERCENT, -1));
        }

        /** percent 1-100 — задать яркость, -1 — вернуться к системной. */
        @JavascriptInterface
        public void setBrightness(int percent) {
            final int clamped = percent < 0 ? -1 : Math.max(1, Math.min(100, percent));
            getSharedPreferences(PREFS, MODE_PRIVATE).edit()
                .putInt(PREF_BRIGHTNESS_PERCENT, clamped).apply();
            runOnUiThread(MainActivity.this::applySavedBrightness);
        }

        /**
         * JSON-массив путей (относительно wwwDir) для всех .pdf, реально
         * лежащих в docs_pdf/ на устройстве. Вызывается из docs.html, чтобы
         * страница показывала актуальный набор файлов.
         */
        @JavascriptInterface
        public String listDocsPdf() {
            JSONArray arr = new JSONArray();
            File dir = new File(wwwDir, "docs_pdf");
            File[] files = dir.listFiles();
            if (files != null) {
                Arrays.sort(files, (a, b) -> a.getName().compareToIgnoreCase(b.getName()));
                for (File f : files) {
                    if (f.isFile() && f.getName().toLowerCase(Locale.ROOT).endsWith(".pdf")) {
                        arr.put("docs_pdf/" + f.getName());
                    }
                }
            }
            return arr.toString();
        }

        /**
         * JSON-массив имён картинок из sec_img/ на устройстве — чтобы только
         * что добавленное фото аппарата попало в нужную галерею, а не только
         * зашитое в таблицу IMGS при сборке.
         */
        @JavascriptInterface
        public String listSecImages() {
            JSONArray arr = new JSONArray();
            File dir = new File(wwwDir, "sec_img");
            File[] files = dir.listFiles();
            if (files != null) {
                Arrays.sort(files, (a, b) -> a.getName().compareToIgnoreCase(b.getName()));
                for (File f : files) {
                    String n = f.getName().toLowerCase(Locale.ROOT);
                    if (f.isFile()
                        && (n.endsWith(".jpg") || n.endsWith(".jpeg") || n.endsWith(".png"))) {
                        arr.put(f.getName());
                    }
                }
            }
            return arr.toString();
        }

        /**
         * Короткая сводка для вкладки «Документы»: версия приложения и когда
         * встроенный контент был развёрнут на устройстве.
         */
        @JavascriptInterface
        public String getDataInfo() {
            SharedPreferences prefs = getSharedPreferences(PREFS, MODE_PRIVATE);
            long installedAt = prefs.getLong(PREF_DATA_INSTALLED_AT, 0);
            JSONObject o = new JSONObject();
            try {
                o.put("appVersionName", getAppVersionName());
                o.put("lastSyncMillis", installedAt);
            } catch (Exception ignore) {
                // JSONObject.put не бросает на строках и long; страховка на будущее
            }
            return o.toString();
        }
    }

    // ---------------------------------------------------------------------
    // Обработка ссылок
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
            // Внешние ссылки отдаём браузеру — WebView не для этого.
            try {
                startActivity(new Intent(Intent.ACTION_VIEW, uri));
            } catch (ActivityNotFoundException e) {
                Toast.makeText(this, "Не найдено приложение, чтобы открыть эту ссылку",
                    Toast.LENGTH_LONG).show();
            }
            return true;
        }
        return false; // свои страницы пусть грузит сам WebView
    }

    /**
     * Копирует PDF из внутреннего хранилища в кэш (FileProvider отдаёт только
     * этот каталог), затем открывает через ACTION_VIEW — штатный способ,
     * без доступа сторонних приложений к файлам приложения.
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

            Uri contentUri = FileProvider.getUriForFile(this,
                "com.tmkplant.app.fileprovider", outFile);
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(contentUri, "application/pdf");
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            if (intent.resolveActivity(getPackageManager()) != null) {
                // createChooser показывает выбор приложения каждый раз,
                // даже если для PDF уже назначен обработчик по умолчанию.
                Intent chooser = Intent.createChooser(intent, "Открыть PDF с помощью");
                chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                List<ResolveInfo> resInfoList =
                    getPackageManager().queryIntentActivities(intent, 0);
                for (ResolveInfo ri : resInfoList) {
                    grantUriPermission(ri.activityInfo.packageName, contentUri,
                        Intent.FLAG_GRANT_READ_URI_PERMISSION);
                }
                startActivity(chooser);
            } else {
                Toast.makeText(this, "На устройстве не найдено приложение для просмотра PDF",
                    Toast.LENGTH_LONG).show();
            }
        } catch (Exception e) {
            Toast.makeText(this, "Не удалось открыть PDF: " + e.getMessage(),
                Toast.LENGTH_LONG).show();
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
