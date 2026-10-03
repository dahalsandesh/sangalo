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
    android:versionCode="3"
    android:versionName="2.2.0">

    <uses-sdk android:minSdkVersion="24" android:targetSdkVersion="34" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:label="@string/app_name"
        android:hardwareAccelerated="true"
        android:icon="@mipmap/ic_launcher"
        android:theme="@android:style/Theme.Light.NoTitleBar">
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
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.Window;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private WebView webView;
    private ValueCallback<Uri[]> uploadMessage;
    private final static int FILECHOOSER_RESULTCODE = 1001;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient() {
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
javac -source 8 -target 8 -d "$BUILD_DIR/bin" \
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
