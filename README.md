# सँगालो (Sangalo) 🇳🇵 — The Everyday Nepali Household Companion

A minimalist, high-signal, privacy-first everyday utility app designed specifically for Nepali families. Runs completely offline on mobile browsers, progressive web app (PWA), and native Android APK.

---

## ✨ Features

### 1. 📅 100% Authentic Bikram Sambat (BS) & AD Dual Calendar
- Official 91-year month calendar database (**BS 2000 to BS 2090**) verified against the Nepal Panchanga Nirnayak Samiti standards.
- Exact days in month (including variable 29–32 day leap calculations).
- Year-specific lunar festival mapping (**2080, 2081, 2082, 2083, 2084**) for Dashain (Ghatasthapana, Phulpati, Ashtami, Navami, Vijaya Dashami), Tihar (Kaag, Kukur, Laxmi, Govardhan, Bhai Tika), Chhath, Teej, Janai Purnima, Maha Shivaratri, Holi, and Lhosar.
- Solar fixed national holidays (Nepali New Year, Constitution Day, Maghe Sankranti, Martyrs' Day, etc.).
- Event details modal with Devanagari numerals, AD conversions, and custom personal event notes.
- Pinned notification bar calendar integration.

### 2. 🐕 Interactive Physics Pet Companion ("पुकु" / Puku)
- **Direct Touch & Drag:** Pick up Puku, carry him across the screen with dangling paws and wagging tail.
- **Fling & Gravity Physics:** Throw him with momentum to see elastic bouncing off the floor and edges.
- **Tricks & Gestures:** 
  - **Single Tap:** Playful bark + 360° backflip somersault.
  - **Double Tap:** Sits up on hind legs and begs with sparkling heart particles.
- **Fetch Toy (🎾 Tennis Ball):** Toss a tennis ball on screen; Puku chases, catches, and brings it back.
- **Auto-Docking:** Smoothly trots back to the bottom-right corner when idle so content is never blocked.
- **Puku's Den (खेल्ने कोठा):** Dedicated playground to feed treats, play fetch, and pet love.

### 3. 💊 Daily Medicine & Health Routine
- Morning (बिहान), Afternoon (दिउँसो), Evening (साँझ), and Bedtime (सुत्ने बेला) dosage tracking.
- "खाना अघि" (Before Food) and "खाना पछि" (After Food) badges.
- One-tap dosage checkboxes, adherence streak counter, and audio reminders.

### 4. 🏍️🚗 Multi-Vehicle Fleet Log
- Track multiple household motorcycles, scooters, and cars independently.
- Mileage, fuel logs, service reminders, servicing alert flags, and km tracking.

### 5. 💰 Fair Bill & Expense Splitter
- Equal and unequal bill sharing with individual participant breakdown.
- Borrowing and lending ledger ("तिर्न बाँकी" / "पाउनु पर्ने").
- One-tap structured clipboard copy for SMS/messaging.

### 6. 🐅 Bagh-Chal (बाघचाल) & Traditional Nepali Games
- Authentic 5×5 grid Bagh-Chal engine (4 Tigers vs 20 Goats).
- Play Pass-and-Play or Play vs Bot (AI Tiger).
- Smooth SVG board and traditional rules.

---

## 🚀 Getting Started

### Run Locally (Web)
```bash
# Clone the repository
git clone https://github.com/your-username/sangalo.git
cd sangalo

# Start local server
python3 server.py
# Or use run.sh
./run.sh
```
Open `http://localhost:8090` in your mobile or desktop browser.

### Build Android APK
```bash
./build_apk.sh
```
The compiled, signed APK will be output to `/sdcard/Documents/Projects/Sangalo.apk`.

---

## 🎨 UI/UX Design Standard
Built following the [`clean-uiux`](file:///root/workspace/.agents/skills/clean-uiux/SKILL.md) industrial design standard:
- Default clean light mode with high-contrast slate typography.
- Industrial dark mode (`#09090b` canvas).
- Zero emoji spam in buttons and headers (crisp inline SVGs and functional glyphs).
- Full bilingual parity: Nepali (नेपाली) and English.

---

## 📄 License
MIT License. Built for Nepali families with love.
