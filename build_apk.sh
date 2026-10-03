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
mkdir -p "$BUILD_DIR"/{gen,bin,res/values,res/mipmap-hdpi,src/com/sangalo/family,assets}

# Copy web assets
cp -r "$DIR/public"/* "$BUILD_DIR/assets/"
python3 "$DIR/generate_icon.py" "$BUILD_DIR/res/mipmap-hdpi/ic_launcher.png"

# 4. Create Android Manifest and Resources
cat << 'EOF' > "$BUILD_DIR/AndroidManifest.xml"
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.sangalo.family"
    android:versionCode="4"
    android:versionName="2.3.0">

    <uses-sdk android:minSdkVersion="24" android:targetSdkVersion="34" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

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
        public void showStickyNotification(final String title, final String body) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                        if (nm == null) return;

                        Intent intent = new Intent(MainActivity.this, MainActivity.class);
                        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
                        if (Build.VERSION.SDK_INT >= 23) {
                            flags |= PendingIntent.FLAG_IMMUTABLE;
                        }
                        PendingIntent pi = PendingIntent.getActivity(MainActivity.this, 0, intent, flags);

                        Notification.Builder builder;
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                            builder = new Notification.Builder(MainActivity.this, CHANNEL_STICKY_ID);
                        } else {
                            builder = new Notification.Builder(MainActivity.this);
                            builder.setPriority(Notification.PRIORITY_LOW);
                        }

                        builder.setContentTitle(title)
                               .setContentText(body)
                               .setSmallIcon(R.mipmap.ic_launcher)
                               .setContentIntent(pi)
                               .setOngoing(true)
                               .setAutoCancel(false);

                        nm.notify(1001, builder.build());
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
                if (url != null && (url.startsWith("tel:") || url.startsWith("mailto:") || url.startsWith("sms:") || url.startsWith("intent:"))) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true;
                    } catch (Exception e) {
                        return true;
                    }
                }
                return false;
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
    "$BUILD_DIR/src/com/sangalo/family/MainActivity.java"

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
