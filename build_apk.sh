#!/bin/bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="$DIR/.build"
PHONE_STORAGE="/root/workspace/phone_storage"
OUTPUT_APK="$PHONE_STORAGE/Sangalo.apk"
FALLBACK_APK="$PHONE_STORAGE/Haven.apk"
ANDROID_JAR="$DIR/.android_sdk/android.jar"

echo "=================================================="
echo "   सँगालो (Sangalo) — Android APK Build Pipeline   "
echo "=================================================="

# 1. Check tools
echo "[1/7] Verifying build dependencies..."
MISSING_TOOLS=()
for tool in aapt zipalign apksigner javac keytool; do
    if ! command -v "$tool" >/dev/null 2>&1; then
        MISSING_TOOLS+=("$tool")
    fi
done

if [ ${#MISSING_TOOLS[@]} -gt 0 ]; then
    echo "Error: Missing required build tools: ${MISSING_TOOLS[*]}"
    echo "Install them via: apt-get install -y aapt zipalign apksigner openjdk-17-jdk-headless"
    exit 1
fi

# Detect D8/DX
D8_CMD=""
if command -v d8 >/dev/null 2>&1; then
    D8_CMD="d8"
elif [ -f "/usr/lib/android-sdk/build-tools/debian/d8" ]; then
    D8_CMD="/usr/lib/android-sdk/build-tools/debian/d8"
elif command -v dx >/dev/null 2>&1; then
    D8_CMD="dx"
fi

# 2. Ensure android.jar is present
echo "[2/7] Checking Android SDK Platform..."
if [ ! -f "$ANDROID_JAR" ]; then
    mkdir -p "$DIR/.android_sdk"
    echo "Downloading minimal android.jar (API 30)..."
    curl -fsSL -o "$ANDROID_JAR" "https://raw.githubusercontent.com/Sable/android-platforms/master/android-30/android.jar" || \
    curl -fsSL -o "$ANDROID_JAR" "https://dl.google.com/android/repository/platform-30_r03.zip"
fi

if [ ! -f "$ANDROID_JAR" ] || [ $(wc -c < "$ANDROID_JAR") -lt 1000000 ]; then
    echo "Warning: android.jar download failed or is incomplete. Checking system fallback..."
    SYS_JAR=$(find /usr -name "android.jar" 2>/dev/null | head -n 1 || true)
    if [ -n "$SYS_JAR" ]; then
        cp "$SYS_JAR" "$ANDROID_JAR"
    else
        echo "Please provide a valid android.jar in $DIR/.android_sdk/android.jar"
        exit 1
    fi
fi

# 3. Prepare workspace
echo "[3/7] Setting up build workspace..."
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"/{gen,bin,res/values,res/mipmap-mdpi,res/mipmap-hdpi,res/mipmap-xhdpi,res/mipmap-xxhdpi,src/com/sangalo/family,assets}

# Copy web assets
cp -r "$DIR/public"/* "$BUILD_DIR/assets/"
python3 "$DIR/generate_icon.py" "$BUILD_DIR/res/mipmap-mdpi/ic_launcher.png" 48
python3 "$DIR/generate_icon.py" "$BUILD_DIR/res/mipmap-hdpi/ic_launcher.png" 72
python3 "$DIR/generate_icon.py" "$BUILD_DIR/res/mipmap-xhdpi/ic_launcher.png" 96
python3 "$DIR/generate_icon.py" "$BUILD_DIR/res/mipmap-xxhdpi/ic_launcher.png" 144

# 4. Create Android Manifest and Resources
cat << 'EOF' > "$BUILD_DIR/AndroidManifest.xml"
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.sangalo.family"
    android:versionCode="6"
    android:versionName="1.2.0">

    <uses-sdk android:minSdkVersion="24" android:targetSdkVersion="34" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />

    <application
        android:label="@string/app_name"
        android:hardwareAccelerated="true"
        android:icon="@mipmap/ic_launcher"
        android:theme="@android:style/Theme.Light.NoTitleBar"
        android:usesCleartextTraffic="true">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <receiver
            android:name=".CalendarReceiver"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
                <action android:name="android.intent.action.DATE_CHANGED" />
                <action android:name="android.intent.action.TIME_SET" />
                <action android:name="android.intent.action.TIMEZONE_CHANGED" />
                <action android:name="com.sangalo.family.ACTION_NOTIFICATION_DISMISSED" />
                <action android:name="com.sangalo.family.ACTION_MIDNIGHT_TICK" />
            </intent-filter>
        </receiver>
    </application>
</manifest>
EOF

cat << 'EOF' > "$BUILD_DIR/res/values/strings.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">सँगालो</string>
</resources>
EOF

cat << 'EOF' > "$BUILD_DIR/res/values/styles.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="@android:style/Theme.Light.NoTitleBar">
        <item name="android:windowBackground">#ffffff</item>
    </style>
</resources>
EOF

# 5. Create Android MainActivity.java
cat << 'EOF' > "$BUILD_DIR/src/com/sangalo/family/MainActivity.java"
package com.sangalo.family;

import android.app.Activity;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.media.AudioAttributes;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Vibrator;
import android.view.KeyEvent;
import android.view.Window;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

public class MainActivity extends Activity {
    private WebView webView;
    private ValueCallback<Uri[]> uploadMessage;
    private final static int FILECHOOSER_RESULTCODE = 1001;

    public static final String CHANNEL_STICKY_ID = "sangalo_sticky";
    public static final String CHANNEL_ALARM_ID = "sangalo_alarms";
    public static final String CHANNEL_UPDATE_ID = "sangalo_updates";

    private Ringtone currentRingtone = null;
    private Vibrator currentVibrator = null;

    public class WebAppInterface {
        Context mContext;
        WebAppInterface(Context c) {
            mContext = c;
        }

        @JavascriptInterface
        public boolean isNativeApp() {
            return true;
        }

        @JavascriptInterface
        public void showNativeToast(String message) {
            Toast.makeText(mContext, message, Toast.LENGTH_SHORT).show();
        }

        @JavascriptInterface
        public boolean hasNotificationPermission() {
            if (Build.VERSION.SDK_INT >= 33) {
                return checkSelfPermission("android.permission.POST_NOTIFICATIONS") == PackageManager.PERMISSION_GRANTED;
            }
            return true;
        }

        @JavascriptInterface
        public void requestNotificationPermission() {
            if (Build.VERSION.SDK_INT >= 33) {
                if (checkSelfPermission("android.permission.POST_NOTIFICATIONS") != PackageManager.PERMISSION_GRANTED) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            requestPermissions(new String[]{"android.permission.POST_NOTIFICATIONS"}, 1002);
                        }
                    });
                }
            }
        }

        @JavascriptInterface
        public void syncCalendarSchedule(final String jsonSchedule) {
            try {
                android.content.SharedPreferences prefs = getSharedPreferences(CalendarReceiver.PREFS_NAME, Context.MODE_PRIVATE);
                prefs.edit().putString(CalendarReceiver.KEY_SCHEDULE, jsonSchedule).apply();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        @JavascriptInterface
        public void showStickyNotification(final String title, final String body) {
            showStickyNotification(title, body, 0);
        }

        @JavascriptInterface
        public void showStickyNotification(final String title, final String body, final int dayNumber) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        String todayKey = new java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.US).format(new java.util.Date());
                        android.content.SharedPreferences prefs = getSharedPreferences(CalendarReceiver.PREFS_NAME, Context.MODE_PRIVATE);
                        prefs.edit()
                             .putBoolean(CalendarReceiver.KEY_STICKY_ENABLED, true)
                             .putString(CalendarReceiver.KEY_LAST_DATE, todayKey)
                             .putString(CalendarReceiver.KEY_LAST_TITLE, title)
                             .putString(CalendarReceiver.KEY_LAST_BODY, body)
                             .putInt(CalendarReceiver.KEY_LAST_DAY, dayNumber)
                             .apply();

                        CalendarReceiver.postDailyNotification(MainActivity.this);
                        CalendarReceiver.scheduleMidnightAlarm(MainActivity.this);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });
        }

        @JavascriptInterface
        public void cancelStickyNotification() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        android.content.SharedPreferences prefs = getSharedPreferences(CalendarReceiver.PREFS_NAME, Context.MODE_PRIVATE);
                        prefs.edit().putBoolean(CalendarReceiver.KEY_STICKY_ENABLED, false).apply();
                        CalendarReceiver.cancelMidnightAlarm(MainActivity.this);

                        NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                        if (nm != null) {
                            nm.cancel(1001);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });
        }

        @JavascriptInterface
        public void triggerAlarm(final String title, final String body, final String type) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        startAlarmSound();
                        vibrateDevice();

                        NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                        if (nm == null) return;

                        Intent intent = new Intent(MainActivity.this, MainActivity.class);
                        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
                        if (Build.VERSION.SDK_INT >= 23) {
                            flags |= PendingIntent.FLAG_IMMUTABLE;
                        }
                        PendingIntent pi = PendingIntent.getActivity(MainActivity.this, 1, intent, flags);

                        Notification.Builder builder;
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                            builder = new Notification.Builder(MainActivity.this, CHANNEL_ALARM_ID);
                        } else {
                            builder = new Notification.Builder(MainActivity.this);
                            builder.setPriority(Notification.PRIORITY_MAX);
                        }

                        builder.setContentTitle(title)
                               .setContentText(body)
                               .setSmallIcon(R.mipmap.ic_launcher)
                               .setContentIntent(pi)
                               .setAutoCancel(true);

                        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
                            builder.setVibrate(new long[]{0, 500, 250, 500, 250, 500});
                        }

                        nm.notify(1002, builder.build());
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });
        }

        @JavascriptInterface
        public void stopAlarmSound() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    stopActiveAlarm();
                }
            });
        }

        @JavascriptInterface
        public void openExternalUrl(final String url) {
            if (url == null || url.trim().isEmpty()) return;
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        mContext.startActivity(intent);
                    } catch (Exception e) {
                        e.printStackTrace();
                        Toast.makeText(mContext, "लिंक खोल्न सकिएन: " + url, Toast.LENGTH_SHORT).show();
                    }
                }
            });
        }

        @JavascriptInterface
        public void notifyAppUpdate(final String newVersion, final String title, final String apkUrl) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                        if (nm == null) return;

                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(apkUrl));
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
                        if (Build.VERSION.SDK_INT >= 23) {
                            flags |= PendingIntent.FLAG_IMMUTABLE;
                        }
                        PendingIntent pi = PendingIntent.getActivity(MainActivity.this, 1005, intent, flags);

                        Notification.Builder builder;
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                            builder = new Notification.Builder(MainActivity.this, CHANNEL_UPDATE_ID);
                        } else {
                            builder = new Notification.Builder(MainActivity.this);
                            builder.setPriority(Notification.PRIORITY_HIGH);
                        }

                        String notifTitle = "🚀 नयाँ अपडेट उपलब्ध छ: " + (newVersion != null ? newVersion : "");
                        String notifBody = (title != null && !title.isEmpty()) ? title : "नयाँ सुधार तथा पात्रो सटीकता सहित नवीनतम संस्करण उपलब्ध छ। ट्याप गरी डाउनलोड गर्नुहोस्।";

                        builder.setContentTitle(notifTitle)
                               .setContentText(notifBody)
                               .setSmallIcon(R.mipmap.ic_launcher)
                               .setContentIntent(pi)
                               .setAutoCancel(true);

                        nm.notify(1005, builder.build());
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });
        }
    }

    private synchronized void startAlarmSound() {
        try {
            stopActiveAlarm();
            Uri alert = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
            if (alert == null) {
                alert = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
            }
            if (alert == null) {
                alert = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE);
            }
            if (alert != null) {
                currentRingtone = RingtoneManager.getRingtone(getApplicationContext(), alert);
                if (currentRingtone != null) {
                    if (Build.VERSION.SDK_INT >= 21) {
                        AudioAttributes audioAttributes = new AudioAttributes.Builder()
                                .setUsage(AudioAttributes.USAGE_ALARM)
                                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                                .build();
                        currentRingtone.setAudioAttributes(audioAttributes);
                    }
                    currentRingtone.play();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private synchronized void vibrateDevice() {
        try {
            if (currentVibrator == null) {
                currentVibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
            }
            if (currentVibrator != null && currentVibrator.hasVibrator()) {
                long[] pattern = {0, 600, 300, 600, 300, 800};
                if (Build.VERSION.SDK_INT >= 26) {
                    currentVibrator.vibrate(android.os.VibrationEffect.createWaveform(pattern, -1));
                } else {
                    currentVibrator.vibrate(pattern, -1);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private synchronized void stopActiveAlarm() {
        try {
            if (currentRingtone != null && currentRingtone.isPlaying()) {
                currentRingtone.stop();
                currentRingtone = null;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            if (currentVibrator != null) {
                currentVibrator.cancel();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void initNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try {
                NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                if (nm != null) {
                    NotificationChannel stickyChannel = new NotificationChannel(
                            CHANNEL_STICKY_ID,
                            "दैनिक पात्रो (Daily Calendar)",
                            NotificationManager.IMPORTANCE_LOW
                    );
                    stickyChannel.setDescription("नोटिफिकेसन बारमा आजको मिति (Today's date pinned)");
                    stickyChannel.setShowBadge(false);
                    nm.createNotificationChannel(stickyChannel);

                    NotificationChannel alarmChannel = new NotificationChannel(
                            CHANNEL_ALARM_ID,
                            "औषधि तथा सम्झना अलार्म (Medicine & Reminders)",
                            NotificationManager.IMPORTANCE_HIGH
                    );
                    alarmChannel.setDescription("औषधि खाने समय तथा सम्झना अलार्म");
                    alarmChannel.enableVibration(true);
                    alarmChannel.setVibrationPattern(new long[]{0, 500, 250, 500, 250, 500});
                    nm.createNotificationChannel(alarmChannel);

                    NotificationChannel updateChannel = new NotificationChannel(
                            CHANNEL_UPDATE_ID,
                            "एप अपडेट तथा नयाँ संस्करण (App Updates)",
                            NotificationManager.IMPORTANCE_HIGH
                    );
                    updateChannel.setDescription("सँगालोको नयाँ संस्करण उपलब्ध हुँदा जानकारी");
                    updateChannel.setShowBadge(true);
                    nm.createNotificationChannel(updateChannel);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        webView = new WebView(this);
        setContentView(webView);

        initNotificationChannels();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            WebView.setWebContentsDebuggingEnabled(true);
        }

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            settings.setMediaPlaybackRequiresUserGesture(false);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        webView.addJavascriptInterface(new WebAppInterface(this), "AndroidBridge");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url == null) return false;
                if (url.startsWith("file:///android_asset/")) {
                    return false; // let webview load internal assets
                }
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                    return true;
                } catch (Exception e) {
                    e.printStackTrace();
                    return true;
                }
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                android.util.Log.d("SangaloApp", consoleMessage.message() + " -- Line "
                        + consoleMessage.lineNumber() + " of "
                        + consoleMessage.sourceId());
                return true;
            }

            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, WebChromeClient.FileChooserParams fileChooserParams) {
                if (uploadMessage != null) {
                    uploadMessage.onReceiveValue(null);
                    uploadMessage = null;
                }
                uploadMessage = filePathCallback;
                Intent intent = fileChooserParams.createIntent();
                try {
                    startActivityForResult(intent, FILECHOOSER_RESULTCODE);
                } catch (Exception e) {
                    uploadMessage = null;
                    return false;
                }
                return true;
            }
        });

        webView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILECHOOSER_RESULTCODE) {
            if (uploadMessage == null) return;
            uploadMessage.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, data));
            uploadMessage = null;
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onDestroy() {
        stopActiveAlarm();
        super.onDestroy();
    }
}
EOF

# 5.1 Create Android CalendarReceiver.java
cat << 'EOF' > "$BUILD_DIR/src/com/sangalo/family/CalendarReceiver.java"
package com.sangalo.family;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Typeface;
import android.graphics.drawable.Icon;
import android.os.Build;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import org.json.JSONObject;
import android.net.Uri;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CalendarReceiver extends BroadcastReceiver {
    public static final String PREFS_NAME = "SangaloPrefs";
    public static final String KEY_STICKY_ENABLED = "sticky_notif_enabled";
    public static final String KEY_LAST_DATE = "last_date_key";
    public static final String KEY_LAST_TITLE = "last_title";
    public static final String KEY_LAST_BODY = "last_body";
    public static final String KEY_LAST_DAY = "last_day_number";
    public static final String KEY_SCHEDULE = "calendar_schedule";

    public static final String ACTION_DISMISSED = "com.sangalo.family.ACTION_NOTIFICATION_DISMISSED";
    public static final String ACTION_MIDNIGHT_TICK = "com.sangalo.family.ACTION_MIDNIGHT_TICK";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (context == null || intent == null) return;
        String action = intent.getAction();
        if (action == null) return;

        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        boolean enabled = prefs.getBoolean(KEY_STICKY_ENABLED, false);

        if (!enabled) return;

        // Repost or update notification with today's date tag
        postDailyNotification(context);

        // Schedule next midnight tick
        scheduleMidnightAlarm(context);

        // Check for app updates in background
        checkAppUpdateInBackground(context);
    }

    public static Icon createDateIcon(Context context, int dayNumber) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            try {
                int size = 96;
                Bitmap bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888);
                Canvas canvas = new Canvas(bitmap);

                // Draw crisp circular border ring (badge outline)
                Paint ringPaint = new Paint();
                ringPaint.setAntiAlias(true);
                ringPaint.setColor(Color.WHITE);
                ringPaint.setStyle(Paint.Style.STROKE);
                ringPaint.setStrokeWidth(5f);
                canvas.drawCircle(size / 2f, size / 2f, (size / 2f) - 6f, ringPaint);

                // Draw centered bold date number
                Paint paint = new Paint();
                paint.setAntiAlias(true);
                paint.setColor(Color.WHITE);
                paint.setTextAlign(Paint.Align.CENTER);
                paint.setTypeface(Typeface.create(Typeface.SANS_SERIF, Typeface.BOLD));

                String text = String.valueOf(dayNumber);
                paint.setTextSize(text.length() > 2 ? 38f : 50f);

                Paint.FontMetrics fm = paint.getFontMetrics();
                float y = (size / 2f) - ((fm.descent + fm.ascent) / 2f);
                canvas.drawText(text, size / 2f, y, paint);

                return Icon.createWithBitmap(bitmap);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    public static void postDailyNotification(Context context) {
        try {
            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            boolean enabled = prefs.getBoolean(KEY_STICKY_ENABLED, false);
            if (!enabled) return;

            NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm == null) return;

            String todayKey = new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date());
            String lastDateKey = prefs.getString(KEY_LAST_DATE, "");
            boolean isLiveToday = todayKey.equals(lastDateKey);

            String title = prefs.getString(KEY_LAST_TITLE, "सँगालो दैनिक पात्रो");
            String body = prefs.getString(KEY_LAST_BODY, "");
            int dayNumber = prefs.getInt(KEY_LAST_DAY, 0);

            // Only fallback to static schedule if we don't already have live data explicitly pushed for today
            if (!isLiveToday) {
                String scheduleJson = prefs.getString(KEY_SCHEDULE, null);
                if (scheduleJson != null && scheduleJson.length() > 0) {
                    try {
                        JSONObject obj = new JSONObject(scheduleJson);
                        if (obj.has(todayKey)) {
                            JSONObject dayObj = obj.getJSONObject(todayKey);
                            title = dayObj.optString("title", title);
                            body = dayObj.optString("body", body);
                            if (dayObj.has("day")) {
                                dayNumber = dayObj.optInt("day", dayNumber);
                            }
                            prefs.edit()
                                 .putString(KEY_LAST_DATE, todayKey)
                                 .putString(KEY_LAST_TITLE, title)
                                 .putString(KEY_LAST_BODY, body)
                                 .putInt(KEY_LAST_DAY, dayNumber)
                                 .apply();
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }

            if (dayNumber <= 0 && title != null) {
                dayNumber = extractDayNumber(title);
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                NotificationChannel channel = new NotificationChannel(
                    MainActivity.CHANNEL_STICKY_ID,
                    "Daily Calendar",
                    NotificationManager.IMPORTANCE_LOW
                );
                channel.setDescription("Pinned daily calendar date");
                channel.setShowBadge(false);
                nm.createNotificationChannel(channel);
            }

            Intent tapIntent = new Intent(context, MainActivity.class);
            tapIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            int flags = PendingIntent.FLAG_UPDATE_CURRENT;
            if (Build.VERSION.SDK_INT >= 23) {
                flags |= PendingIntent.FLAG_IMMUTABLE;
            }
            PendingIntent tapPi = PendingIntent.getActivity(context, 0, tapIntent, flags);

            // DeleteIntent to catch swipe and immediately re-pin
            Intent deleteIntent = new Intent(context, CalendarReceiver.class);
            deleteIntent.setAction(ACTION_DISMISSED);
            int dFlags = PendingIntent.FLAG_UPDATE_CURRENT;
            if (Build.VERSION.SDK_INT >= 23) {
                dFlags |= PendingIntent.FLAG_IMMUTABLE;
            }
            PendingIntent deletePi = PendingIntent.getBroadcast(context, 0, deleteIntent, dFlags);

            Notification.Builder builder;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                builder = new Notification.Builder(context, MainActivity.CHANNEL_STICKY_ID);
            } else {
                builder = new Notification.Builder(context);
                builder.setPriority(Notification.PRIORITY_LOW);
            }

            builder.setContentTitle(title)
                   .setContentIntent(tapPi)
                   .setDeleteIntent(deletePi)
                   .setOngoing(true)
                   .setAutoCancel(false);

            // Set body text with BigTextStyle so multi-line festival/tithi/weather never truncates
            if (body != null && body.trim().length() > 0) {
                builder.setContentText(body.trim());
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
                    builder.setStyle(new Notification.BigTextStyle().bigText(body.trim()));
                }
            }

            // Dynamic date number icon (shows e.g. "18" in status bar when shade is closed)
            boolean iconSet = false;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && dayNumber > 0) {
                Icon dateIcon = createDateIcon(context, dayNumber);
                if (dateIcon != null) {
                    builder.setSmallIcon(dateIcon);
                    iconSet = true;
                }
            }
            if (!iconSet) {
                builder.setSmallIcon(R.mipmap.ic_launcher);
            }

            Notification notif = builder.build();
            notif.flags |= Notification.FLAG_NO_CLEAR | Notification.FLAG_ONGOING_EVENT;
            nm.notify(1001, notif);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static int extractDayNumber(String title) {
        if (title == null) return 0;
        try {
            StringBuilder sb = new StringBuilder();
            boolean inside = false;
            for (char c : title.toCharArray()) {
                if (c >= '\u0966' && c <= '\u096F') {
                    sb.append((char)('0' + (c - '\u0966')));
                    inside = true;
                } else if (Character.isDigit(c)) {
                    sb.append(c);
                    inside = true;
                } else if (inside) {
                    if (sb.length() > 0) {
                        int val = Integer.parseInt(sb.toString());
                        if (val >= 1 && val <= 32) return val;
                        sb.setLength(0);
                        inside = false;
                    }
                }
            }
            if (sb.length() > 0) {
                int val = Integer.parseInt(sb.toString());
                if (val >= 1 && val <= 32) return val;
            }
        } catch (Exception e) {}
        return 0;
    }

    public static void scheduleMidnightAlarm(Context context) {
        try {
            AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            if (am == null) return;

            Intent intent = new Intent(context, CalendarReceiver.class);
            intent.setAction(ACTION_MIDNIGHT_TICK);
            int flags = PendingIntent.FLAG_UPDATE_CURRENT;
            if (Build.VERSION.SDK_INT >= 23) {
                flags |= PendingIntent.FLAG_IMMUTABLE;
            }
            PendingIntent pi = PendingIntent.getBroadcast(context, 2001, intent, flags);

            Calendar nextMidnight = Calendar.getInstance();
            nextMidnight.add(Calendar.DAY_OF_YEAR, 1);
            nextMidnight.set(Calendar.HOUR_OF_DAY, 0);
            nextMidnight.set(Calendar.MINUTE, 0);
            nextMidnight.set(Calendar.SECOND, 5);
            nextMidnight.set(Calendar.MILLISECOND, 0);

            if (Build.VERSION.SDK_INT >= 23) {
                am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, nextMidnight.getTimeInMillis(), pi);
            } else if (Build.VERSION.SDK_INT >= 19) {
                am.setExact(AlarmManager.RTC_WAKEUP, nextMidnight.getTimeInMillis(), pi);
            } else {
                am.set(AlarmManager.RTC_WAKEUP, nextMidnight.getTimeInMillis(), pi);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void cancelMidnightAlarm(Context context) {
        try {
            AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            if (am == null) return;

            Intent intent = new Intent(context, CalendarReceiver.class);
            intent.setAction(ACTION_MIDNIGHT_TICK);
            int flags = PendingIntent.FLAG_UPDATE_CURRENT;
            if (Build.VERSION.SDK_INT >= 23) {
                flags |= PendingIntent.FLAG_IMMUTABLE;
            }
            PendingIntent pi = PendingIntent.getBroadcast(context, 2001, intent, flags);
            am.cancel(pi);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void checkAppUpdateInBackground(final Context context) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
                    long lastCheck = prefs.getLong("last_update_check_bg", 0);
                    long now = System.currentTimeMillis();
                    if (now - lastCheck < 12 * 3600 * 1000) return; // at most once every 12h

                    URL url = new URL("https://api.github.com/repos/dahalsandesh/sangalo/releases/latest");
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setConnectTimeout(5000);
                    conn.setReadTimeout(5000);
                    conn.setRequestProperty("User-Agent", "SangaloApp");
                    conn.setRequestProperty("Accept", "application/vnd.github.v3+json");
                    if (conn.getResponseCode() == 200) {
                        prefs.edit().putLong("last_update_check_bg", now).apply();
                        BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                        StringBuilder sb = new StringBuilder();
                        String line;
                        while ((line = reader.readLine()) != null) {
                            sb.append(line);
                        }
                        reader.close();
                        String json = sb.toString();

                        Pattern p = Pattern.compile("\"tag_name\"\\s*:\\s*\"([^\"]+)\"");
                        Matcher m = p.matcher(json);
                        if (m.find()) {
                            String latestTag = m.group(1);
                            if (isNewerVersion(latestTag, "1.2.0")) {
                                postUpdateNotification(context, latestTag, "https://github.com/dahalsandesh/sangalo/releases/latest/download/Sangalo.apk");
                            }
                        }
                    }
                } catch (Exception ignored) {
                    // Silently ignore network or offline exceptions in background
                }
            }
        }).start();
    }

    private static boolean isNewerVersion(String remote, String current) {
        try {
            String rClean = remote.replaceAll("[^0-9.]", "");
            String cClean = current.replaceAll("[^0-9.]", "");
            String[] rParts = rClean.split("\\.");
            String[] cParts = cClean.split("\\.");
            int max = Math.max(rParts.length, cParts.length);
            for (int i = 0; i < max; i++) {
                int r = i < rParts.length ? Integer.parseInt(rParts[i]) : 0;
                int c = i < cParts.length ? Integer.parseInt(cParts[i]) : 0;
                if (r > c) return true;
                if (r < c) return false;
            }
        } catch (Exception ignored) {}
        return false;
    }

    public static void postUpdateNotification(Context context, String newVersion, String apkUrl) {
        try {
            NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm == null) return;

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                NotificationChannel channel = new NotificationChannel(
                    MainActivity.CHANNEL_UPDATE_ID,
                    "एप अपडेट (App Updates)",
                    NotificationManager.IMPORTANCE_HIGH
                );
                channel.setDescription("सँगालोको नयाँ संस्करण उपलब्ध हुँदा जानकारी");
                channel.setShowBadge(true);
                nm.createNotificationChannel(channel);
            }

            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(apkUrl));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            int flags = PendingIntent.FLAG_UPDATE_CURRENT;
            if (Build.VERSION.SDK_INT >= 23) {
                flags |= PendingIntent.FLAG_IMMUTABLE;
            }
            PendingIntent pi = PendingIntent.getActivity(context, 1005, intent, flags);

            Notification.Builder builder;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                builder = new Notification.Builder(context, MainActivity.CHANNEL_UPDATE_ID);
            } else {
                builder = new Notification.Builder(context);
                builder.setPriority(Notification.PRIORITY_HIGH);
            }

            builder.setContentTitle("🚀 सँगालो नयाँ संस्करण उपलब्ध छ (" + newVersion + ")")
                   .setContentText("नयाँ पात्रो सटीकता र सुविधाहरूका लागि ट्याप गरी अपडेट गर्नुहोस्।")
                   .setSmallIcon(R.mipmap.ic_launcher)
                   .setContentIntent(pi)
                   .setAutoCancel(true);

            nm.notify(1005, builder.build());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
EOF

# 6. Compilation
echo "[4/7] Compiling Android resources with AAPT..."
aapt package -f -m \
    -J "$BUILD_DIR/gen" \
    -M "$BUILD_DIR/AndroidManifest.xml" \
    -S "$BUILD_DIR/res" \
    -I "$ANDROID_JAR"

echo "[5/7] Compiling Java classes (Java 8 compatibility)..."
javac -encoding UTF-8 -source 8 -target 8 -d "$BUILD_DIR/bin" \
    -cp "$ANDROID_JAR" \
    "$BUILD_DIR/gen/com/sangalo/family/R.java" \
    "$BUILD_DIR/src/com/sangalo/family/MainActivity.java" \
    "$BUILD_DIR/src/com/sangalo/family/CalendarReceiver.java"

echo "[6/7] Converting bytecode to Dalvik DEX with DX..."
dx --dex --output="$BUILD_DIR/bin/classes.dex" "$BUILD_DIR/bin"

echo "[7/7] Packaging and signing APK..."
# Package unaligned APK
aapt package -f \
    -M "$BUILD_DIR/AndroidManifest.xml" \
    -S "$BUILD_DIR/res" \
    -A "$BUILD_DIR/assets" \
    -I "$ANDROID_JAR" \
    -F "$BUILD_DIR/bin/Sangalo.unaligned.apk"

# Add classes.dex
cd "$BUILD_DIR/bin"
aapt add "Sangalo.unaligned.apk" classes.dex
cd "$DIR"

# Zipalign
zipalign -f -p 4 "$BUILD_DIR/bin/Sangalo.unaligned.apk" "$BUILD_DIR/bin/Sangalo.aligned.apk"

# Generate debug keystore if not exists
KEYSTORE="$DIR/debug.keystore"
if [ ! -f "$KEYSTORE" ]; then
    echo "Generating debug signing keystore..."
    keytool -genkey -v -keystore "$KEYSTORE" \
        -alias androiddebugkey \
        -storepass android -keypass android \
        -keyalg RSA -keysize 2048 -validity 10000 \
        -dname "CN=Sangalo, OU=Family, O=Home, L=Kathmandu, ST=Bagmati, C=NP"
fi

# Sign APK
apksigner sign --ks "$KEYSTORE" --ks-pass pass:android --out "$OUTPUT_APK" "$BUILD_DIR/bin/Sangalo.aligned.apk"

# Also copy to FALLBACK_APK for backwards compatibility
cp "$OUTPUT_APK" "$FALLBACK_APK"

# Verify signature
apksigner verify "$OUTPUT_APK"

echo "=================================================="
echo " SUCCESS! सँगालो (Sangalo) APK compiled and signed!"
echo " Primary: $OUTPUT_APK"
echo " Size: $(du -h "$OUTPUT_APK" | cut -f1)"
echo " Exported to internal storage: /sdcard/Documents/Projects/Sangalo.apk"
echo "=================================================="
