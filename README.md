# सँगालो (Sangalo) 🇳🇵

> **The Lightweight, Privacy-First Everyday Digital Companion for Nepali Households.**

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Platform: Web / PWA / Android](https://img.shields.io/badge/Platform-Web%20%7C%20PWA%20%7C%20Android-blue.svg)](#)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero%20NPM%20Bloat-success.svg)](#)
[![100% Offline](https://img.shields.io/badge/Offline-100%25%20Functional-purple.svg)](#)
[![APK Size: ~216 KB](https://img.shields.io/badge/APK%20Size-%7E216%20KB-orange.svg)](#)

---

## 📖 Overview

**सँगालो (Sangalo)** is an all-in-one, local-first utility suite designed specifically for Nepali families. Most calendar and utility apps today are bloated with intrusive ads, heavy tracking scripts, carnival-neon gradients, and multi-megabyte dependencies.

Sangalo takes a fundamentally different approach:
- **Zero Ads & Zero Telemetry:** Your family's data, finances, medical routines, and photos never leave your device.
- **100% Offline-First:** Runs completely offline on mobile web browsers, as a Progressive Web App (PWA), or as a standalone lightweight native Android APK (~216 KB).
- **Industrial, High-Signal Design:** Strict Linear/Geist design aesthetic—deep neutral canvas, crisp typography, functional accents, and zero emoji spam.
- **Elder & Youth Friendly:** High-contrast text, clear bilingual support (नेपाली / English), and clean touch interfaces.

---

## ✨ Features

### 1. 📅 91-Year Authentic Bikram Sambat (BS) & AD Dual Calendar
- **Official Astronomical Database:** 91-year database spanning **BS 2000 to BS 2090** verified against Nepal Panchanga Nirnayak Samiti standards.
- **Precise Leap Calculations:** Dynamic month day counts (29 to 32 days).
- **Lunar Festival Calculation:** Accurate tracking of Dashain (Ghatasthapana to Vijaya Dashami), Tihar (Kaag Tihar to Bhai Tika), Chhath, Teej, Janai Purnima, Maha Shivaratri, Holi, and Lhosar.
- **Fixed National Holidays:** Nepali New Year, Constitution Day, Maghe Sankranti, Martyrs' Day, and more.
- **Pinned Status Bar Date (Hamro Patro Style):** 
  - Ongoing native Android notification with swipe resistance (`FLAG_NO_CLEAR`) and `DeleteIntent` auto-repinning.
  - Automatically updates to the next day at midnight (`00:00:00`) via native Android `AlarmManager` and `CalendarReceiver` even when the app is completely closed.
  - True Gregorian A.D. date parity (`📅 २०८३ असोज १७ गते, शनिबार • ई.सं. (AD): 3 Oct 2026`).

### 2. 💊 Daily Medicine Routine & Alarms
- **Custom Time Picker:** Schedule exact alarm times (`HH:MM`) for each medicine with quick slot defaults (Morning, Afternoon, Night).
- **Real Alarm Experience:** High-priority heads-up status bar notification, native alarm ringtone audio (`RingtoneManager.TYPE_ALARM`), and physical device vibration.
- **Interactive Alarm Modal:**
  - **✅ खाएँ (Mark as Taken):** Automatically checks off the dose for today, records adherence, and stops the alarm.
  - **⏰ ५ मिनेट पछि (Snooze):** Silences the alarm and automatically re-triggers after 5 minutes.
- **Meal Timing Badges:** Clear tags for "खानाअघि" (Before Food) and "खानापछि" (After Food).

### 3. 🐕 Interactive Physics Pet Companion ("पुकु" / Puku)
- **Verlet Physics & Drag:** Pick up Puku with your finger, carry him across the screen with dangling paws and wagging tail, and fling him with real momentum and elastic bouncing.
- **Playful Gestures:**
  - Single tap: Playful bark and full 360° backflip somersault.
  - Double tap: Sits up on hind legs and begs with sparkling heart particles.
- **Fetch Mini-Game:** Throw a tennis ball (🎾) onto the screen; Puku tracks, chases, catches, and brings it back.
- **Puku's Den (खेल्ने कोठा):** Dedicated playground to feed treats, play fetch, and care for your companion.

### 4. 💰 Fair Bill & Expense Splitter
- **Equal & Unequal Splitting:** Split household expenses, grocery runs, and dinners equally or by custom amounts per person.
- **Borrowing & Lending Ledger:** Keep track of who paid and who owes ("तिर्न बाँकी" / "पाउनु पर्ने").
- **One-Tap Clipboard Export:** Format balances into structured text for instant sharing via WhatsApp, SMS, or Messenger.

### 5. 🏍️🚗 Multi-Vehicle Fleet Log
- Track multiple household motorcycles, scooters, and cars independently.
- Log fuel expenses, odometer mileage, servicing dates, and periodic maintenance reminders.
- Modal specifications for engine oil grade, tyre pressure, and insurance dates.

### 6. 🔐 Encrypted Document & Photo Vault
- **Client-Side Storage:** Store citizenship cards, vehicle bluebooks, utility bill receipts, and family health records inside browser IndexedDB.
- **Automatic Compression:** Large photos are compressed client-side before storage to conserve device RAM and flash storage.
- **Guest Wi-Fi Sharing:** Generate clean QR codes for household guests to join your home Wi-Fi instantly.
- **Emergency Directory:** Essential helpline numbers (Police 100, Fire 101, Ambulance 102, Blood Bank, NEA, KUKL) with one-tap native phone dialer integration.

### 7. 🐅 Bagh-Chal (बाघचाल) & Traditional Nepali Games
- Authentic 5×5 grid Bagh-Chal engine (4 Tigers vs 20 Goats).
- Play Pass-and-Play (2 Players) or Challenge the Bot (AI Tiger).
- Smooth SVG vector board with zero touch delay (`pointerdown`).

---

## 🛠️ Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────┐
│                   सँगालो (Sangalo)                      │
├──────────────────────────┬─────────────────────────────┤
│  Frontend (Web / PWA)    │  Android Native Bridge      │
├──────────────────────────┼─────────────────────────────┤
│ • HTML5 / CSS3 / ES6+    │ • Java 8 SDK (No Gradle)    │
│ • Local Tailwind Bundle  │ • NotificationManager       │
│ • HTML5 Canvas (Physics) │ • Ringtone & Vibrator API   │
│ • IndexedDB & Storage    │ • AlarmManager & Receivers  │
│ • Service Worker (sw.js) │ • Standalone APK (216 KB)   │
└──────────────────────────┴─────────────────────────────┘
```

- **Frontend:** Pure Vanilla JavaScript (ES6+), HTML5 Canvas, and offline-bundled Tailwind CSS. Zero `npm install`, zero bundler overhead, instant sub-millisecond cold starts.
- **Android APK Build Pipeline:** Custom lightweight build script (`build_apk.sh`) utilizing native Android SDK tools (`aapt`, `javac`, `dx`, `apksigner`). Builds complete standalone APKs in ~5 seconds directly on ARM64 Linux or mobile PRoot without needing a multi-gigabyte Gradle daemon!

---

## 🚀 Getting Started

### 1. Run Locally in Browser (Web / PWA)

Sangalo requires no build tools or package managers. Any static HTTP server works:

```bash
# Clone the repository
git clone https://github.com/<your-username>/sangalo.git
cd sangalo

# Start local server with Python
python3 server.py
# Or use the runner script
./run.sh
```

Open `http://localhost:8090` in your browser (Chrome, Brave, or Safari). Tap **"Add to Home screen"** or **"Install"** to use it as a standalone Progressive Web App.

---

### 2. Build the Android Standalone APK

To compile the native Android APK directly:

```bash
# Prerequisites: aapt, javac (Java 8+), dx, apksigner, python3
./build_apk.sh
```

The script compiles resources, builds Java classes with UTF-8 support, packages assets, signs the APK with v2/v3 signature schemes, and outputs the final `.apk` file:

```
==================================================
 SUCCESS! सँगालो (Sangalo) APK compiled and signed!
 Primary: /root/workspace/phone_storage/Sangalo.apk
 Size: ~216 KB
==================================================
```

---

## 📁 Repository Structure

```
sangalo/
├── build_apk.sh           # Native Android APK compilation & signing pipeline
├── server.py              # Lightweight local HTTP server with MIME configuration
├── run.sh                 # Quick dev server start script
├── generate_icon.py       # Programmatic launcher icon generator
├── LICENSE                # MIT License
├── README.md              # Project documentation
└── public/
    ├── index.html         # Single-page application markup & modals
    ├── app.js             # Core application engine, BS calendar & state
    ├── sw.js              # Offline PWA Service Worker cache engine
    ├── tailwind.min.js    # Bundled standalone Tailwind CSS engine (offline)
    ├── manifest.json      # PWA Web App Manifest
    ├── icon.svg           # High-resolution vector brand icon
    └── icon.png           # Raster launcher icon
```

---

## 🤝 Contributing

Contributions to **सँगालो (Sangalo)** are warmly welcome! Whether you are:
- Adding verified festival dates or astronomical data.
- Improving accessibility for elderly users.
- Submitting bug reports or UI polish.

### Development Guidelines
1. **Preserve Zero-Dependency Principle:** Do not add heavyweight npm dependencies or third-party web fonts. Keep assets local and fast.
2. **Follow `clean-uiux` Standards:** Maintain the minimalist, high-signal industrial design (neutral canvas `#09090b` / `#ffffff`, high-contrast typography, zero emoji spam in headings/buttons).
3. **Keep Code Readable:** Vanilla JS functions with clear separation of concerns.

---

## ⚡ Built Entirely on Mobile (Pair-Programmed with AI)

This entire application—from the 91-year Bikram Sambat dual calendar algorithms, custom physics pet engine, interactive medicine routine alarms, native Android APK build pipeline, and bilingual UI/UX—was vibe-coded, compiled, and published entirely on a mobile phone!

- **Host Device:** Xiaomi Redmi Note 15 Pro 5G (`lapis`)
- **SoC:** MediaTek Dimensity 7300 (MT6878), Octa-core ARM64
- **Operating Environment:** Ubuntu 26.04 aarch64 (PRoot-Distro) on Android 16 (HyperOS) via Termux
- **AI Pair Programmer:** Google DeepMind **Antigravity CLI Agent (AGY)** powered by **Gemini 3.8 Flash**
- **Android Compilation:** Native SDK toolchain (`aapt`, `javac`, `dx`, `apksigner`) running directly on ARM64 Linux without heavyweight Gradle/Maven daemons

> *"Proof that production-grade full-stack web applications and native Android APKs can be engineered, tested, and published to GitHub entirely from a smartphone in your pocket."*

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <b>सँगालो</b> — नेपाली घरपरिवारका लागि माया र सरलताका साथ बनाइएको।<br/>
  <i>Crafted with care for Nepali households worldwide.</i>
</p>
