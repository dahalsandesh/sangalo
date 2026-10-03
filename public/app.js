// =====================================================================
// सँगालो (Sangalo) — हाम्रो पारिवारिक साथी (Family Life Companion)
// Core JavaScript Engine v5.0
// 100% Offline-Safe, Bilingual, Full BS Calendar, Bagh-Chal, & Companion
// =====================================================================

const STORAGE_KEY = 'sangalo_data_v6';
const LANG_KEY = 'sangalo_lang_v6';

// ---------------------------------------------------------------------
// 1. WEB AUDIO SYNTHESIZER (No external audio files needed)
// ---------------------------------------------------------------------
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx && AudioCtx) {
    audioCtx = new AudioCtx();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSound(type) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'pop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'bark') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'coin') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === 'chime') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'happy') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'roar') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(70, now + 0.25);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {
    // Audio context may be restricted by autoplay policy
  }
}

// ---------------------------------------------------------------------
// 2. CENTRALIZED 100% BILINGUAL I18N DICTIONARY
// ---------------------------------------------------------------------
const i18n = {
  ne: {
    appTitle: "सँगालो",
    appSub: "हाम्रो पारिवारिक साथी",
    shoppingTab: "किनमेल",
    budgetTab: "खर्च",
    calendarTab: "पात्रो",
    chautariTab: "चौतारी",
    vaultTab: "भण्डार",

    // Shopping
    shoppingTitle: "घरको किनमेल सूची",
    shareListBtn: "सूची कपी गर्नुहोस्",
    copyListBtn: "सूची कपी गर्नुहोस्",
    quickAddHeader: "दैनिक उपभोग्य सामग्री (१-ट्याप थप्नुहोस्)",
    addItemPlaceholder: "सामानको नाम लेख्नुहोस्...",
    qtyPlaceholder: "परिमाण",
    addItemBtn: "सूचीमा थप्नुहोस्",
    completedHeader: "किनिसकेका सामान",
    clearBtn: "हटाउनुहोस्",
    emptyShopping: "तपाईंको किनमेल सूची खाली छ।\nमाथिबाट सामान थप्नुहोस्!",

    // Quick Adds
    itemRice: "चामल",
    itemDaal: "दाल",
    itemOil: "तोरीको तेल",
    itemChiura: "चिउरा",
    itemTea: "चियापत्ती",
    itemMilk: "दूध",
    itemPotato: "आलु",
    itemOnion: "प्याज",
    itemMasala: "नुन र मसला",
    itemSoap: "साबुन र सरफ",

    // Categories
    catGrocery: "किराना",
    catVeggies: "तरकारी र फलफूल",
    catDairy: "डेरी र दूध",
    catBakery: "खाजा र बेकरी",
    catMeat: "मासु र माछा",
    catCleaning: "सरसफाइ",
    catPharmacy: "औषधि",
    catOther: "अन्य",
    catBills: "इन्टरनेट/बिजुली",
    catFood: "खाजा/खाना",
    catTravel: "गाडीभाडा/पेट्रोल",
    catFestivals: "चाडपर्व/पुजा",

    // Budget & Split
    monthlySpend: "यो महिनाको कुल खर्च",
    recordExpense: "नयाँ खर्च दर्ता गर्नुहोस्",
    amountPlaceholder: "रकम (रू)",
    payerPlaceholder: "कसले तिर्यो?",
    notePlaceholder: "विवरण / पसल...",
    saveExpenseBtn: "खर्च सेभ गर्नुहोस्",
    equalSplitTab: "बराबर बाँडफाँड",
    borrowTab: "सापटी हिसाब (Borrow / Lend)",
    splitTitle: "बिल बाँडफाँड हिसाब",
    billAmount: "कुल बिल रकम (रू)",
    peopleCount: "जना",
    splitBtn: "हिसाब",
    borrowTitle: "सापटी तथा लेनदेन हिसाब",
    borrowSub: "कसलाई कति दियो वा कसबाट कति लिन बाँकी छ",
    totalLent: "मैले लिन बाँकी",
    totalBorrowed: "मैले तिर्न बाँकी",
    recentExpenses: "हालैका खर्चहरू",
    emptyExpenses: "अहिलेसम्म कुनै खर्च लेखिएको छैन।\nमाथिबाट नयाँ खर्च दर्ता गर्नुहोस्!",

    // Calendar & Reminders
    calendarTitle: "नेपाली पात्रो (Bikram Sambat)",
    calendarSub: "वि.सं. पात्रो (गतेमा छोएर सम्झना थप्नुहोस्)",
    addEventQuickBtn: "नयाँ सम्झना थप्नुहोस्",
    addEventTitle: "नयाँ सम्झना वा कार्यक्रम थप्नुहोस्:",
    eventPlaceholder: "कार्यक्रम / सम्झना (e.g. मामाको जन्मदिन, बिल तिर्ने)",
    saveEventBtn: "सुरक्षित गर्नुहोस्",
    upcomingReminders: "आगामी सम्झना तथा चाडपर्व",
    top5Notes: "आगामी सम्झनाहरू",
    noReminders: "कुनै सम्झना दर्ता छैन।\nपात्रोमा कुनै पनि गतेमा छोएर नयाँ सम्झना थप्नुहोस्!",
    modalDateHeader: "पात्रो विवरण (Date Details)",
    modalRegisteredEvents: "दर्ता भएका सम्झनाहरू:",
    weekdaySun: "आइत",
    weekdayMon: "सोम",
    weekdayTue: "मंगल",
    weekdayWed: "बुध",
    weekdayThu: "बिही",
    weekdayFri: "शुक्र",
    weekdaySat: "शनि",

    // Daily Medicine Routine
    medRoutineTitle: "दैनिक औषधि तालिका (Medicine Routine)",
    medRoutineSub: "घरका ज्येष्ठ नागरिक तथा परिवारका लागि दैनिक औषधि र समय",

    // Health ICE
    iceTitle: "आपतकालीन स्वास्थ्य कार्ड (ICE)",
    emergencyContacts: "आपतकालीन नम्बरहरू",
    copyCardBtn: "कार्ड कपी",
    bloodType: "रक्त समूह (Blood Group)",
    allergies: "एलर्जी (Allergies)",
    conditions: "दीर्घरोग / स्वास्थ्य अवस्था",
    medications: "दैनिक खाने औषधिहरू",
    insurance: "स्वास्थ्य बीमा #",
    hospital: "आकस्मिक अस्पताल",
    addContactBtn: "थप्नुहोस्",
    contactNamePlaceholder: "नाम",
    contactRelPlaceholder: "सम्बन्ध (e.g. बुबा)",
    contactPhonePlaceholder: "फोन नम्बर",

    // Bagh-Chal & Games
    baghchalTitle: "बाघचाल (Bagh-Chal)",
    baghchalDesc: "नेपालको मौलिक परम्परागत खेल: ४ बाघ र २० बाख्रा",
    playGoats: "बाख्रा खेल्ने",
    playTigers: "बाघ खेल्ने",
    twoPlayer: "२ जना खेल्ने",
    tigersTurn: "बाघको पालो (Tiger's Turn)",
    goatsTurn: "बाख्राको पालो (Goat's Turn)",
    goatsInHand: "बाँकी बाख्रा",
    goatsCaptured: "खाएको बाख्रा",
    tigersTrapped: "थुनिएका बाघ",
    restartGame: "नयाँ खेल",
    undoMove: "१ चाल फिर्ता",
    rulesTitle: "नियमहरू (Bagh-Chal Rules):",
    rule1: "• बाख्राले २० वटा बाख्रा बोर्डमा पालैपालो राख्छ। बाघले १ कदम हिँड्छ वा बाख्रामाथि फड्को मारेर खान्छ।",
    rule2: "• ५ वटा बाख्रा खाएमा बाघको जीत हुन्छ। चारै वटा बाघलाई चारैतिरबाट थुनेमा बाख्राको जीत हुन्छ!",
    diceGameTitle: "साँप र भर्‍याङ पासा (Dice Roll)",
    diceGameSub: "लुडो वा साँप र भर्‍याङ खेल्दा पासा फाल्नुहोस्",
    rollDiceBtn: "पासा फाल्नुहोस्",
    pukuPlayTitle: "पुकुसँग खेल्नुहोस् (Play with Puku)",
    pukuPlaySub: "घरको साथीलाई मुसार्नुहोस् वा treat दिनुहोस्",

    // Vault
    petToggleTitle: "पुकु साथी (Pet Companion)",
    petToggleDesc: "स्क्रिनमा हिँड्ने साथी देखाउने वा हटाउने",
    stickyNotifTitle: "नोटिफिकेसन बारमा आजको मिति राख्नुहोस्",
    stickyNotifDesc: "हाम्रो पात्रो जस्तै फोनको माथिल्लो नोटिफिकेसनमा दैनिक नेपाली मिति देखाउनुहोस्।",
    wifiTitle: "पाहुना वाई-फाई QR कोड",
    scanQr: "स्क्यान गर्नुहोस्",
    wifiSsidLabel: "वाई-फाईको नाम (SSID)",
    wifiPassLabel: "पासवर्ड (Password)",
    vehicleTitle: "घरका सवारी साधनहरू (Vehicles)",
    vehicleSub: "स्कुटर, मोटरसाइकल तथा गाडी विवरण",
    saveVehicleBtn: "सेभ",
    vehModelLabel: "गाडी / स्कुटर मोडल",
    vehPlateLabel: "नम्बर प्लेट",
    vehVinLabel: "इन्जिन नम्बर / ब्लुबुक विवरण",
    vehNotesLabel: "सर्भिसिङ र मोबिल विवरण",
    modelPlaceholder: "e.g. Honda Shine",
    platePlaceholder: "बा २ प ९८७६",
    vinPlaceholder: "इन्जिन नम्बर...",
    notesPlaceholder: "e.g. 10W-30 मोबिल, टायर हावा ३२ PSI",
    homeServices: "घरायसी सेवा सम्पर्क",
    homeServicesSub: "प्लम्बर, इलेक्ट्रिसियन तथा मिस्त्रीहरूको नम्बर",
    serviceRolePlaceholder: "काम (e.g. प्लम्बर)",
    serviceNamePlaceholder: "नाम",
    servicePhonePlaceholder: "फोन नम्बर",
    apkTitle: "मोबाइल एप (.apk) सेयर गर्नुहोस्",
    apkDesc: "इन्टरनेट नभए पनि चल्ने गरी परिवारका सदस्यहरूको एन्ड्रोइड फोनमा यो एप इन्स्टल गर्न सक्नुहुन्छ।",
    downloadApkBtn: "Sangalo.apk डाउनलोड",
    backupTitle: "डाटा ब्याकअप र सुरक्षा",
    exportBackup: "ब्याकअप डाउनलोड (.json)",
    importBackup: "ब्याकअप रिस्टोर",
    cancelBtn: "रद्द (Cancel)",
    confirmDeleteBtn: "हटाउनुहोस् (Delete)",
    docVaultTitle: "कागजात तथा परिचयपत्र भण्डार",
    docVaultSub: "नागरिकता, ब्लुबुक, लाइसेन्स र स्वास्थ्य बीमा फोटो",
    addDocBtn: "कागजात थप्नुहोस्",
    addDocTitle: "कागजात वा फोटो थप्नुहोस्",
    saveDocBtn: "सुरक्षित भण्डारमा सेभ गर्नुहोस्",
    alarmToggleTitle: "औषधि तथा सम्झना अलार्म (Medicine & Reminder Alarms)",
    alarmToggleDesc: "औषधिको समय र पात्रोका सम्झनाहरूमा घण्टी (Chime) तथा सूचना बज्नेछ।",
    customizeQuickAdd: "मिलाउनुहोस्",
    quickAddModalTitle: "१-ट्याप सामान अनुकूलन",
    quickAddModalSub: "बारम्बार चाहिने सामान थप्नुहोस् वा हटाउनुहोस्",
    quickItemNamePlaceholder: "सामानको नाम (e.g. अण्डा, स्याउ)",
    addQuickItemBtn: "+ १-ट्यापमा थप्नुहोस्",
    activeQuickItems: "हालका १-ट्याप सामग्रीहरू:",
    resetDefaultsBtn: "पूर्वनिर्धारित रिसेट (Reset)",
    doneBtn: "सकियो (Done)"
  },
  en: {
    appTitle: "Sangalo",
    appSub: "Family Life Companion",
    shoppingTab: "Shopping",
    budgetTab: "Budget",
    calendarTab: "Calendar",
    chautariTab: "Chautari",
    vaultTab: "Vault",

    // Shopping
    shoppingTitle: "Household Shopping List",
    shareListBtn: "Copy Shopping List",
    copyListBtn: "Copy Shopping List",
    quickAddHeader: "Quick Add Essentials (1-Tap)",
    addItemPlaceholder: "Enter item name...",
    qtyPlaceholder: "Qty",
    addItemBtn: "Add to List",
    completedHeader: "Completed Items",
    clearBtn: "Clear Done",
    emptyShopping: "Your shopping list is empty.\nTap quick add above or type an item!",

    // Quick Adds
    itemRice: "Rice",
    itemDaal: "Daal",
    itemOil: "Mustard Oil",
    itemChiura: "Chiura",
    itemTea: "Tea",
    itemMilk: "Milk",
    itemPotato: "Potato",
    itemOnion: "Onion",
    itemMasala: "Salt & Masala",
    itemSoap: "Soap & Powder",

    // Categories
    catGrocery: "Groceries",
    catVeggies: "Veggies & Fruits",
    catDairy: "Dairy & Milk",
    catBakery: "Bakery & Snacks",
    catMeat: "Meat & Fish",
    catCleaning: "Cleaning",
    catPharmacy: "Pharmacy",
    catOther: "Other",
    catBills: "Bills & Utilities",
    catFood: "Food & Dining",
    catTravel: "Travel & Fuel",
    catFestivals: "Festivals & Pooja",

    // Budget & Split
    monthlySpend: "This Month's Spending",
    recordExpense: "Record New Expense",
    amountPlaceholder: "Amount (Rs.)",
    payerPlaceholder: "Who paid?",
    notePlaceholder: "Store / description...",
    saveExpenseBtn: "Save Expense",
    equalSplitTab: "Equal Split",
    borrowTab: "Borrow / Lend",
    splitTitle: "Fair Bill Splitter",
    billAmount: "Total Bill (Rs.)",
    peopleCount: "People",
    splitBtn: "Calculate",
    borrowTitle: "Borrow & Lend Tracker",
    borrowSub: "Track money lent to or borrowed from others",
    totalLent: "I am Owed (Lent)",
    totalBorrowed: "I Owe (Borrowed)",
    recentExpenses: "Recent Expenses",
    emptyExpenses: "No expenses recorded yet.\nAdd an expense above to track spending!",

    // Calendar & Reminders
    calendarTitle: "Nepali Calendar (Bikram Sambat)",
    calendarSub: "B.S. Calendar (Tap any date to add reminder)",
    addEventQuickBtn: "Add Reminder",
    addEventTitle: "Add New Reminder or Note:",
    eventPlaceholder: "Event / reminder (e.g. Birthday, Bill payment)",
    saveEventBtn: "Save Reminder",
    upcomingReminders: "Upcoming Reminders & Festivals",
    top5Notes: "Upcoming Notes",
    noReminders: "No reminders recorded.\nTap any date on the calendar grid to add one!",
    modalDateHeader: "Date Details & Reminders",
    modalRegisteredEvents: "Registered Reminders:",
    weekdaySun: "Sun",
    weekdayMon: "Mon",
    weekdayTue: "Tue",
    weekdayWed: "Wed",
    weekdayThu: "Thu",
    weekdayFri: "Fri",
    weekdaySat: "Sat",

    // Daily Medicine Routine
    medRoutineTitle: "Daily Medicine Routine",
    medRoutineSub: "Daily medication schedule and alarms for family elders",

    // Health ICE
    iceTitle: "In Case of Emergency (ICE)",
    emergencyContacts: "Emergency Contacts",
    copyCardBtn: "Copy Card",
    bloodType: "Blood Group",
    allergies: "Known Allergies",
    conditions: "Medical Conditions",
    medications: "Daily Medications",
    insurance: "Health Insurance #",
    hospital: "Emergency Hospital",
    addContactBtn: "Add",
    contactNamePlaceholder: "Name",
    contactRelPlaceholder: "Relation (e.g. Dad)",
    contactPhonePlaceholder: "Phone number",

    // Bagh-Chal & Games
    baghchalTitle: "Bagh-Chal (Tigers & Goats)",
    baghchalDesc: "Traditional Nepali strategy game: 4 Tigers vs 20 Goats",
    playGoats: "Play Goats",
    playTigers: "Play Tigers",
    twoPlayer: "2 Players",
    tigersTurn: "Tiger's Turn",
    goatsTurn: "Goat's Turn",
    goatsInHand: "Goats in Hand",
    goatsCaptured: "Goats Captured",
    tigersTrapped: "Tigers Trapped",
    restartGame: "New Game",
    undoMove: "Undo Move",
    rulesTitle: "Rules of Bagh-Chal:",
    rule1: "• Goats place 20 pieces first. Tigers move 1 step along grid lines or jump over goats to capture them.",
    rule2: "• Tigers win by capturing 5 goats. Goats win by surrounding and trapping all 4 tigers so they cannot move!",
    diceGameTitle: "Ludo & Snakes Dice Roller",
    diceGameSub: "Roll for Ludo or Snakes & Ladders family games",
    rollDiceBtn: "Roll Dice",
    pukuPlayTitle: "Play with Puku",
    pukuPlaySub: "Pet your puppy or feed delicious treats",

    // Vault
    petToggleTitle: "Puku Pet Companion",
    petToggleDesc: "Show or hide the interactive walking pet companion",
    stickyNotifTitle: "Pin Today's Date in Notification Bar",
    stickyNotifDesc: "Show daily Bikram Sambat date persistently like Hamro Patro.",
    wifiTitle: "Guest Wi-Fi QR Card",
    scanQr: "Scan with Camera",
    wifiSsidLabel: "Wi-Fi Name (SSID)",
    wifiPassLabel: "Password",
    vehicleTitle: "Household Vehicles",
    vehicleSub: "Scooters, bikes & car specs",
    saveVehicleBtn: "Save",
    vehModelLabel: "Vehicle Model",
    vehPlateLabel: "License Plate #",
    vehVinLabel: "Engine / Bluebook VIN",
    vehNotesLabel: "Service & Oil Specs",
    modelPlaceholder: "e.g. Honda Shine",
    platePlaceholder: "Ba 2 Pa 9876",
    vinPlaceholder: "Engine / VIN details...",
    notesPlaceholder: "e.g. 10W-30 Oil, 32 PSI Tire Pressure",
    homeServices: "Home Service Directory",
    homeServicesSub: "Electrician, plumber & technician contacts",
    serviceRolePlaceholder: "Role (e.g. Plumber)",
    serviceNamePlaceholder: "Name",
    servicePhonePlaceholder: "Phone number",
    apkTitle: "Share Standalone App (.apk)",
    apkDesc: "Install and run 100% offline on any family member's Android device without internet.",
    downloadApkBtn: "Download Sangalo.apk",
    backupTitle: "Data Backup & Recovery",
    exportBackup: "Export Backup (.json)",
    importBackup: "Import Backup",
    cancelBtn: "Cancel",
    confirmDeleteBtn: "Delete",
    docVaultTitle: "Document & Photo Vault",
    docVaultSub: "Citizenship, Bluebook, License & Insurance Photos",
    addDocBtn: "Add Document",
    addDocTitle: "Add Document or Photo",
    saveDocBtn: "Save to Secure Vault",
    alarmToggleTitle: "Medicine & Reminder Alarms",
    alarmToggleDesc: "Play audio chime and notification for medication schedules and calendar reminders.",
    customizeQuickAdd: "Customize",
    quickAddModalTitle: "Customize 1-Tap Quick Add",
    quickAddModalSub: "Add or remove frequent household essentials",
    quickItemNamePlaceholder: "Item name (e.g. Eggs, Apples)",
    addQuickItemBtn: "+ Add to Quick List",
    activeQuickItems: "Active 1-Tap Essentials:",
    resetDefaultsBtn: "Reset to Defaults",
    doneBtn: "Done"
  }
};

let currentLang = localStorage.getItem(LANG_KEY) || 'ne';

function t(key) {
  return (i18n[currentLang] && i18n[currentLang][key]) || (i18n['ne'] && i18n['ne'][key]) || key;
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
  updateAllTranslations();
}

function toggleLanguage() {
  setLanguage(currentLang === 'ne' ? 'en' : 'ne');
}

// ---------------------------------------------------------------------
// 3. PERSISTENT STATE MANAGEMENT
// ---------------------------------------------------------------------
let state = {
  theme: 'light',
  petEnabled: true,
  petHappiness: 90,
  stickyNotifEnabled: false,
  shopping: [
    { id: 1, name: 'चामल (Rice)', category: 'किराना', qty: '1 बोरा', done: false },
    { id: 2, name: 'तोरीको तेल (Oil)', category: 'किराना', qty: '2 लिटर', done: false },
    { id: 3, name: 'आलु र प्याज', category: 'तरकारी र फलफूल', qty: '3 केजी', done: true }
  ],
  budget: {
    monthlyLimit: 30000,
    expenses: [
      { id: 1, amount: 2400, category: 'किराना (Grocery)', payer: 'बुबा', note: 'महिनाको चामल र दाल', date: '२०८३-०६-१०' },
      { id: 2, amount: 1200, category: 'इन्टरनेट/बिजुली', payer: 'म', note: 'घरको फाइबर नेट', date: '२०८३-०६-१२' }
    ]
  },
  borrowLend: [
    { id: 1, type: 'lent', name: 'रमेश साथी', amount: 2500, note: 'खाजा खर्च', date: '२०८३-०६-०१', settled: false },
    { id: 2, type: 'borrowed', name: 'शर्मा जी', amount: 1000, note: 'किराना सामान', date: '२०८३-०६-०५', settled: false }
  ],
  events: {
    '2083-6-20': [{ id: 101, title: 'बुबाको स्वास्थ्य परीक्षण (Doctor Checkup)', time: '10:00' }],
    '2083-6-28': [{ id: 102, title: 'बिजुलीको महसुल बुझाउने (Electricity Bill)', time: '14:00' }]
  },
  health: {
    bloodType: 'O+',
    allergies: 'None',
    conditions: 'Normal',
    medications: 'Daily Vitamin C',
    insurance: 'HI-984123',
    hospital: 'Bir Hospital',
    medicines: [
      { id: 1, name: 'प्रेसरको औषधि (Amlodipine 5mg)', slot: 'morning', dosage: '१ चक्की', food: 'after', takenDates: [] },
      { id: 2, name: 'सुगरको औषधि (Metformin 500mg)', slot: 'morning', dosage: '१ चक्की', food: 'before', takenDates: [] },
      { id: 3, name: 'ग्यास्ट्रिकको क्याप्सुल (Pantoprazole)', slot: 'night', dosage: '१ क्याप्सुल', food: 'before', takenDates: [] }
    ]
  },
  emergencyContacts: [
    { id: 1, name: 'नेपाल प्रहरी (Nepal Police)', relation: 'आकस्मिक', phone: '100' },
    { id: 2, name: 'एम्बुलेन्स (Ambulance)', relation: 'स्वास्थ्य', phone: '102' },
    { id: 3, name: 'दमकल (Fire Brigade)', relation: 'विपद्', phone: '101' }
  ],
  vault: {
    wifi: { ssid: 'Sangalo_Fiber_5G', pass: 'Family123' },
    vehicles: [
      { id: 1, type: 'scooter', name: 'Honda Dio', plate: 'बा २ प ९८७६', notes: '10W-30 मोबिल, टायर ३० PSI', engine: 'JF19E-50123', vin: 'ME4JF19-8812', taxDue: '२०८३ चैत' },
      { id: 2, type: 'bike', name: 'Bajaj Pulsar 150', plate: 'बा ४ प १२३४', notes: '20W-50 इन्जिन आयल, २५ PSI अगाडि', engine: 'DH15-44912', vin: 'MD2DH15-7761', taxDue: '२०८३ फागुन' }
    ],
    homeServices: [
      { id: 1, role: 'प्लम्बर (Plumber)', name: 'राम श्रेष्ठ', phone: '9841000001' },
      { id: 2, role: 'इलेक्ट्रिसियन (Electrician)', name: 'हरि थापा', phone: '9851000002' },
      { id: 3, role: 'ग्यास डिलर (Gas Delivery)', name: 'सूर्य ग्यास डिपो', phone: '01-4412345' }
    ]
  }
};

function loadState() {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem('sangalo_data_v5') || localStorage.getItem('sangalo_data_v4');
    }
    if (raw) {
      const parsed = JSON.parse(raw);
      state = { ...state, ...parsed };
      if (parsed.health) state.health = { ...state.health, ...parsed.health };
      if (parsed.vault) state.vault = { ...state.vault, ...parsed.vault };
      if (parsed.budget) state.budget = { ...state.budget, ...parsed.budget };
    }
  } catch (e) {}

  // Sanitize any legacy mock festivals accidentally stored in state.events
  if (state.events && typeof state.events === 'object') {
    for (const k of Object.keys(state.events)) {
      if (Array.isArray(state.events[k])) {
        state.events[k] = state.events[k].filter(ev => {
          const title = (ev.title || '').toLowerCase();
          return !(title.includes('dashain') || title.includes('दशैं') || 
                   title.includes('tihar') || title.includes('तिहार') ||
                   title.includes('tika') || title.includes('टीका'));
        });
        if (state.events[k].length === 0) {
          delete state.events[k];
        }
      }
    }
    saveState();
  }

  if (!state.borrowLend || !Array.isArray(state.borrowLend)) {
    state.borrowLend = [
      { id: 1, type: 'lent', name: 'रमेश साथी', amount: 2500, note: 'खाजा खर्च', date: '२०८३-०६-०१', settled: false },
      { id: 2, type: 'borrowed', name: 'शर्मा जी', amount: 1000, note: 'किराना सामान', date: '२०८३-०६-०५', settled: false }
    ];
  }
  if (!state.health) state.health = {};
  if (!state.health.medicines || !Array.isArray(state.health.medicines)) {
    state.health.medicines = [
      { id: 1, name: 'प्रेसरको औषधि (Amlodipine 5mg)', slot: 'morning', dosage: '१ चक्की', food: 'after', takenDates: [] },
      { id: 2, name: 'सुगरको औषधि (Metformin 500mg)', slot: 'morning', dosage: '१ चक्की', food: 'before', takenDates: [] },
      { id: 3, name: 'ग्यास्ट्रिकको क्याप्सुल (Pantoprazole)', slot: 'night', dosage: '१ क्याप्सुल', food: 'before', takenDates: [] }
    ];
  }
  if (!state.vault) state.vault = {};
  if (!state.vault.vehicles || !Array.isArray(state.vault.vehicles)) {
    if (state.vault.vehicle && state.vault.vehicle.model) {
      state.vault.vehicles = [{
        id: 1,
        type: 'scooter',
        name: state.vault.vehicle.model,
        plate: state.vault.vehicle.plate || '',
        notes: state.vault.vehicle.notes || '',
        vin: state.vault.vehicle.vin || '',
        engine: '',
        taxDue: '२०८३ चैत'
      }];
    } else {
      state.vault.vehicles = [
        { id: 1, type: 'scooter', name: 'Honda Dio', plate: 'बा २ प ९८७६', notes: '10W-30 मोबिल, टायर ३० PSI', engine: 'JF19E-50123', vin: 'ME4JF19-8812', taxDue: '२०८३ चैत' },
        { id: 2, type: 'bike', name: 'Bajaj Pulsar 150', plate: 'बा ४ प १२३४', notes: '20W-50 इन्जिन आयल, २५ PSI अगाडि', engine: 'DH15-44912', vin: 'MD2DH15-7761', taxDue: '२०८३ फागुन' }
      ];
    }
  }
  if (!state.vault.homeServices || !Array.isArray(state.vault.homeServices)) {
    state.vault.homeServices = [
      { id: 1, role: 'प्लम्बर (Plumber)', name: 'राम श्रेष्ठ', phone: '9841000001' },
      { id: 2, role: 'इलेक्ट्रिसियन (Electrician)', name: 'हरि थापा', phone: '9851000002' },
      { id: 3, role: 'ग्यास डिलर (Gas Delivery)', name: 'सूर्य ग्यास डिपो', phone: '01-4412345' }
    ];
  }
  if (typeof state.petHappiness !== 'number') {
    state.petHappiness = 90;
  }
  if (!state.quickAddItems || !Array.isArray(state.quickAddItems) || state.quickAddItems.length === 0) {
    state.quickAddItems = [
      { id: 'qa-1', name: 'चामल', enName: 'Rice', cat: 'किराना' },
      { id: 'qa-2', name: 'दाल', enName: 'Daal', cat: 'किराना' },
      { id: 'qa-3', name: 'तोरीको तेल', enName: 'Oil', cat: 'किराना' },
      { id: 'qa-4', name: 'दूध', enName: 'Milk', cat: 'डेरी र दूध' },
      { id: 'qa-5', name: 'आलु', enName: 'Potato', cat: 'तरकारी र फलफूल' },
      { id: 'qa-6', name: 'प्याज', enName: 'Onion', cat: 'तरकारी र फलफूल' },
      { id: 'qa-7', name: 'चियापत्ती', enName: 'Tea', cat: 'किराना' },
      { id: 'qa-8', name: 'चिउरा', enName: 'Chiura', cat: 'किराना' },
      { id: 'qa-9', name: 'साबुन र सरफ', enName: 'Soap & Powder', cat: 'सरसफाइ' }
    ];
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

loadState();

// ---------------------------------------------------------------------
// 4. BIKRAM SAMBAT (वि.सं.) CALENDAR ENGINE
// ---------------------------------------------------------------------
const nepaliMonths = ['बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 'कात्तिक', 'मंसिर', 'पुस', 'माघ', 'फागुन', 'चैत'];
const nepaliMonthsEn = ['Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Asoj', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'];
const nepaliWeekdays = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];
const nepaliWeekdaysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const bsMonthDays = [
  /* 2000 */ [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  /* 2001 */ [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2002 */ [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  /* 2003 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  /* 2004 */ [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  /* 2005 */ [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2006 */ [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  /* 2007 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  /* 2008 */ [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  /* 2009 */ [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2010 */ [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  /* 2011 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  /* 2012 */ [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  /* 2013 */ [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2014 */ [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  /* 2015 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  /* 2016 */ [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  /* 2017 */ [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2018 */ [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  /* 2019 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  /* 2020 */ [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2021 */ [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2022 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  /* 2023 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  /* 2024 */ [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2025 */ [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2026 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  /* 2027 */ [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  /* 2028 */ [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2029 */ [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
  /* 2030 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  /* 2031 */ [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  /* 2032 */ [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2033 */ [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  /* 2034 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  /* 2035 */ [30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  /* 2036 */ [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2037 */ [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  /* 2038 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  /* 2039 */ [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  /* 2040 */ [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2041 */ [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  /* 2042 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  /* 2043 */ [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  /* 2044 */ [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2045 */ [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  /* 2046 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  /* 2047 */ [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2048 */ [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2049 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  /* 2050 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  /* 2051 */ [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2052 */ [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2053 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  /* 2054 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  /* 2055 */ [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2056 */ [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
  /* 2057 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  /* 2058 */ [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  /* 2059 */ [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2060 */ [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  /* 2061 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  /* 2062 */ [30, 32, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31],
  /* 2063 */ [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2064 */ [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  /* 2065 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  /* 2066 */ [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  /* 2067 */ [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2068 */ [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  /* 2069 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  /* 2070 */ [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  /* 2071 */ [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2072 */ [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  /* 2073 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  /* 2074 */ [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2075 */ [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2076 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  /* 2077 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  /* 2078 */ [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2079 */ [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2080 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  /* 2081 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  /* 2082 */ [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2083 */ [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2084 */ [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  /* 2085 */ [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  /* 2086 */ [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  /* 2087 */ [31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30],
  /* 2088 */ [30, 31, 32, 32, 30, 31, 30, 30, 29, 30, 30, 30],
  /* 2089 */ [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  /* 2090 */ [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
];

// Fixed Solar Holidays across all Bikram Sambat years
const nepaliSolarFestivals = {
  "1-1": "नयाँ वर्ष (Nepali New Year)",
  "1-18": "अन्तर्राष्ट्रिय श्रमिक दिवस (Labour Day)",
  "3-15": "राष्ट्रिय धान दिवस / असार १५ (Dhan Diwas)",
  "4-15": "खीर खाने दिन (Kheer Khane Din)",
  "6-3": "संविधान दिवस (National Constitution Day)",
  "9-15": "तमु ल्होसार (Tamu Lhosar)",
  "10-1": "माघे संक्रान्ति / माघी पर्व (Maghe Sankranti)",
  "10-16": "शहीद दिवस (Martyrs Day)",
  "11-7": "राष्ट्रिय प्रजातन्त्र दिवस (Democracy Day)",
  "11-24": "अन्तर्राष्ट्रिय नारी दिवस (Women's Day)"
};

// Official Year-Specific Festivals (Nepal Panchanga Nirnayak Samiti)
const nepaliFestivalsByYear = {
  "2080": {
    "1-22": "बुद्ध जयन्ती",
    "5-14": "जनैपूर्णिमा / रक्षाबन्धन",
    "5-15": "गाईजात्रा (Gai Jatra)",
    "5-20": "श्रीकृष्ण जन्माष्टमी",
    "6-1": "हरितालिका तीज (Teej)",
    "6-3": "ऋषि पञ्चमी",
    "6-11": "इन्द्रजात्रा (Indra Jatra)",
    "6-28": "घटस्थापना (Ghatasthapana)",
    "7-4": "फूलपाती (Phulpati)",
    "7-5": "महाअष्टमी (Maha Ashtami)",
    "7-6": "महानवमी (Maha Navami)",
    "7-7": "विजया दशमी (Dashain Tika)",
    "7-11": "कोजाग्रत पूर्णिमा",
    "7-24": "काग तिहार (Kaag Tihar)",
    "7-25": "कुकुर तिहार (Kukur Tihar)",
    "7-26": "लक्ष्मीपूजा (Laxmi Puja)",
    "7-28": "गोवर्धन पूजा / म्हःपूजा",
    "7-29": "भाइटीका (Bhai Tika)",
    "8-3": "छठ पर्व (Chhath Parva)",
    "8-25": "बाला चतुर्दशी",
    "9-1": "विवाह पञ्चमी",
    "9-10": "उधौली पर्व / योमरी पुन्ही",
    "10-27": "सोनाम ल्होसार",
    "11-2": "सरस्वती पूजा (श्रीपञ्चमी)",
    "11-25": "महाशिवरात्रि (Maha Shivaratri)",
    "11-27": "ग्याल्पो ल्होसार",
    "12-11": "फागु पूर्णिमा - पहाड (Holi Hill)",
    "12-12": "फागु पूर्णिमा - तराई (Holi Terai)",
    "12-26": "घोडेजात्रा (Ghode Jatra)",
    "12-30": "रामनवमी (Ram Navami)"
  },
  "2081": {
    "2-10": "बुद्ध जयन्ती / उभौली पर्व",
    "5-3": "जनैपूर्णिमा / रक्षाबन्धन",
    "5-4": "गाईजात्रा (Gai Jatra)",
    "5-10": "श्रीकृष्ण जन्माष्टमी",
    "5-21": "हरितालिका तीज (Teej)",
    "5-23": "ऋषि पञ्चमी",
    "6-1": "इन्द्रजात्रा (Indra Jatra)",
    "6-17": "घटस्थापना (Ghatasthapana)",
    "6-24": "फूलपाती (Phulpati)",
    "6-25": "महाअष्टमी (Maha Ashtami)",
    "6-26": "विजया दशमी (Dashain Tika)",
    "6-30": "कोजाग्रत पूर्णिमा",
    "7-13": "धनतेरस (Dhanteras)",
    "7-14": "काग तिहार (Kaag Tihar)",
    "7-15": "कुकुर तिहार र लक्ष्मीपूजा (Laxmi Puja)",
    "7-17": "गोवर्धन पूजा / म्हःपूजा",
    "7-18": "भाइटीका (Bhai Tika)",
    "7-22": "छठ पर्व (Chhath Parva)",
    "8-14": "बाला चतुर्दशी",
    "8-21": "विवाह पञ्चमी",
    "8-30": "उधौली पर्व / योमरी पुन्ही",
    "10-17": "सोनाम ल्होसार",
    "10-21": "सरस्वती पूजा / श्रीपञ्चमी",
    "11-14": "महाशिवरात्रि (Maha Shivaratri)",
    "11-16": "ग्याल्पो ल्होसार",
    "11-29": "फागु पूर्णिमा - पहाड (Holi Hill)",
    "12-1": "फागु पूर्णिमा - तराई (Holi Terai)",
    "12-15": "घोडेजात्रा (Ghode Jatra)",
    "12-23": "चैते दशैं",
    "12-24": "रामनवमी (Ram Navami)"
  },
  "2082": {
    "1-29": "बुद्ध जयन्ती / उभौली पर्व",
    "4-24": "जनैपूर्णिमा / रक्षाबन्धन",
    "4-25": "गाईजात्रा (Gai Jatra)",
    "4-31": "श्रीकृष्ण जन्माष्टमी",
    "5-10": "हरितालिका तीज (Teej)",
    "5-12": "ऋषि पञ्चमी",
    "5-20": "इन्द्रजात्रा (Indra Jatra)",
    "6-6": "घटस्थापना (Ghatasthapana)",
    "6-13": "फूलपाती (Phulpati)",
    "6-14": "महाअष्टमी (Maha Ashtami)",
    "6-15": "महानवमी (Maha Navami)",
    "6-16": "विजया दशमी (Dashain Tika)",
    "6-20": "कोजाग्रत पूर्णिमा",
    "7-1": "धनतेरस (Dhanteras)",
    "7-2": "काग तिहार (Kaag Tihar)",
    "7-3": "कुकुर तिहार र लक्ष्मीपूजा",
    "7-4": "गाई पूजा",
    "7-5": "गोवर्धन पूजा / म्हःपूजा",
    "7-6": "भाइटीका (Bhai Tika)",
    "7-10": "छठ पर्व (Chhath Parva)",
    "8-3": "बाला चतुर्दशी",
    "8-9": "विवाह पञ्चमी",
    "8-19": "उधौली पर्व / योमरी पुन्ही",
    "10-5": "सोनाम ल्होसार",
    "10-10": "सरस्वती पूजा / श्रीपञ्चमी",
    "11-4": "महाशिवरात्रि (Maha Shivaratri)",
    "11-6": "ग्याल्पो ल्होसार",
    "11-18": "फागु पूर्णिमा - पहाड (Holi Hill)",
    "11-19": "फागु पूर्णिमा - तराई (Holi Terai)",
    "12-4": "घोडेजात्रा (Ghode Jatra)",
    "12-12": "रामनवमी (Ram Navami)"
  },
  "2083": {
    "1-18": "बुद्ध जयन्ती / उभौली",
    "5-12": "जनैपूर्णिमा / रक्षाबन्धन",
    "5-13": "गाईजात्रा (Gai Jatra)",
    "5-19": "श्रीकृष्ण जन्माष्टमी",
    "5-30": "हरितालिका तीज (Teej)",
    "6-25": "घटस्थापना (Ghatasthapana)",
    "7-2": "फूलपाती (Phulpati)",
    "7-3": "महाअष्टमी (Maha Ashtami)",
    "7-4": "विजया दशमी (Dashain Tika)",
    "7-21": "लक्ष्मीपूजा (Laxmi Puja)",
    "7-24": "भाइटीका (Bhai Tika)",
    "7-28": "छठ पर्व (Chhath Parva)",
    "11-23": "महाशिवरात्रि (Maha Shivaratri)",
    "12-8": "फागु पूर्णिमा (होली)"
  },
  "2084": {
    "2-7": "बुद्ध जयन्ती / उभौली",
    "5-1": "जनैपूर्णिमा / रक्षाबन्धन",
    "5-2": "गाईजात्रा (Gai Jatra)",
    "5-8": "श्रीकृष्ण जन्माष्टमी",
    "5-19": "हरितालिका तीज (Teej)",
    "6-15": "घटस्थापना (Ghatasthapana)",
    "6-22": "फूलपाती (Phulpati)",
    "6-23": "महाअष्टमी (Maha Ashtami)",
    "6-24": "विजया दशमी (Dashain Tika)",
    "7-12": "लक्ष्मीपूजा (Laxmi Puja)",
    "7-15": "भाइटीका (Bhai Tika)",
    "7-19": "छठ पर्व (Chhath Parva)",
    "11-13": "महाशिवरात्रि (Maha Shivaratri)",
    "11-27": "फागु पूर्णिमा (होली)"
  }
};

function getFestival(year, month, day) {
  const yStr = String(year);
  const mDStr = month + "-" + day;
  if (nepaliFestivalsByYear[yStr] && nepaliFestivalsByYear[yStr][mDStr]) {
    return nepaliFestivalsByYear[yStr][mDStr];
  }
  return nepaliSolarFestivals[mDStr] || null;
}

// Transparent Proxy fallback so legacy nepaliFestivals[key] lookup stays compatible
const nepaliFestivals = new Proxy(nepaliSolarFestivals, {
  get(target, prop) {
    if (typeof prop === "string") {
      const currentYear = (typeof calendarState !== "undefined" && calendarState.currentBsYear) || 2081;
      const parts = prop.split("-").map(Number);
      if (parts.length === 2 && parts[0] && parts[1]) {
        const found = getFestival(currentYear, parts[0], parts[1]);
        if (found) return found;
      }
      return target[prop] || undefined;
    }
    return target[prop];
  }
});

function toDevanagariDigits(num) {
  const devDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return String(num).replace(/\d/g, d => devDigits[d]);
}

const bsEpochYear = 2000;
let bsTotalPassedDays = 0;
const bsYearDaysMapping = bsMonthDays.map(mArr => {
  const sum = mArr.reduce((a, b) => a + b, 0);
  const entry = [sum, bsTotalPassedDays];
  bsTotalPassedDays += sum;
  return entry;
});

const bsMonthDaysMapping = bsMonthDays.map(mArr => {
  let mPassed = 0;
  return mArr.map(d => {
    const entry = [d, mPassed];
    mPassed += d;
    return entry;
  });
});

function findPassedDaysBS(year, monthIndex, date) {
  const yIdx = year - bsEpochYear;
  if (yIdx < 0 || yIdx >= bsYearDaysMapping.length) return 0;
  return bsYearDaysMapping[yIdx][1] + bsMonthDaysMapping[yIdx][monthIndex][1] + date;
}

function mapDaysToDateBS(daysPassed) {
  const yIdx = bsYearDaysMapping.findIndex(y => daysPassed > y[1] && daysPassed <= y[1] + y[0]);
  if (yIdx === -1) return { year: 2081, month: 0, date: 1 };
  const rem = daysPassed - bsYearDaysMapping[yIdx][1];
  const mIdx = bsMonthDaysMapping[yIdx].findIndex(m => rem > m[1] && rem <= m[1] + m[0]);
  const date = rem - bsMonthDaysMapping[yIdx][mIdx][1];
  return { year: yIdx + bsEpochYear, month: mIdx, date };
}

function getBikramSambatDate(adDate = new Date()) {
  const timeDiff = Date.UTC(adDate.getFullYear(), adDate.getMonth(), adDate.getDate()) - Date.UTC(1943, 3, 13);
  const diffDays = Math.ceil(timeDiff / 86400000);
  const bs = mapDaysToDateBS(diffDays);
  const month = bs.month + 1; // 1-indexed (1=Baisakh .. 12=Chaitra)
  const day = bs.date;
  const weekdayIndex = adDate.getDay();
  const nepMonth = nepaliMonths[bs.month];
  const nepMonthEn = nepaliMonthsEn[bs.month];
  const nepWeekday = nepaliWeekdays[weekdayIndex];
  const nepWeekdayEn = nepaliWeekdaysEn[weekdayIndex];

  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weekdaysFullEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const adDay = adDate.getDate();
  const adMonthEn = monthsEn[adDate.getMonth()];
  const adYear = adDate.getFullYear();
  const adWeekdayEn = weekdaysFullEn[weekdayIndex];
  const adFormatted = `${adDay} ${adMonthEn} ${adYear}`;

  return {
    year: bs.year,
    month,
    day,
    weekdayIndex,
    nepMonth,
    nepMonthEn,
    nepWeekday,
    nepWeekdayEn,
    adDay,
    adMonthEn,
    adYear,
    adWeekdayEn,
    adFormatted,
    devanagariFormatted: toDevanagariDigits(bs.year) + " " + nepMonth + " " + toDevanagariDigits(day) + ", " + nepWeekday,
    devanagariGateFormatted: toDevanagariDigits(bs.year) + " " + nepMonth + " " + toDevanagariDigits(day) + " गते, " + nepWeekday,
    englishFormatted: nepMonthEn + " " + day + ", " + bs.year + " (" + nepWeekdayEn + ")"
  };
}

function bsToAdDate(bsYear, bsMonth, bsDay) {
  const mIdx = Math.max(0, Math.min(11, bsMonth - 1));
  const daysPassed = findPassedDaysBS(bsYear, mIdx, bsDay);
  const mappedDate = new Date(Date.UTC(1943, 3, 13 + daysPassed));
  return new Date(mappedDate.getUTCFullYear(), mappedDate.getUTCMonth(), mappedDate.getUTCDate());
}

function getBsMonthDays(bsYear, bsMonth) {
  const yIdx = bsYear - bsEpochYear;
  if (yIdx >= 0 && yIdx < bsMonthDays.length) {
    const mIdx = Math.max(0, Math.min(11, bsMonth - 1));
    return bsMonthDays[yIdx][mIdx];
  }
  return 30;
}


// ---------------------------------------------------------------------
// 5. CALENDAR MONTH NAVIGATION & FUTURE REMINDERS ENGINE
// ---------------------------------------------------------------------
let calendarState = {
  currentBsYear: 2083,
  currentBsMonth: 6,
  selectedDay: null
};

function initCalendarState() {
  const todayBs = getBikramSambatDate();
  calendarState.currentBsYear = todayBs.year;
  calendarState.currentBsMonth = todayBs.month;
  calendarState.selectedDay = todayBs.day;
}

function prevCalendarMonth() {
  calendarState.currentBsMonth--;
  if (calendarState.currentBsMonth < 1) {
    calendarState.currentBsMonth = 12;
    calendarState.currentBsYear--;
  }
  renderFullCalendarGrid();
  renderRemindersList();
  playSound('pop');
}

function nextCalendarMonth() {
  calendarState.currentBsMonth++;
  if (calendarState.currentBsMonth > 12) {
    calendarState.currentBsMonth = 1;
    calendarState.currentBsYear++;
  }
  renderFullCalendarGrid();
  renderRemindersList();
  playSound('pop');
}

function jumpCalendarYear(yearVal) {
  calendarState.currentBsYear = parseInt(yearVal, 10);
  renderFullCalendarGrid();
  renderRemindersList();
  playSound('pop');
}

function jumpCalendarMonth(monthVal) {
  calendarState.currentBsMonth = parseInt(monthVal, 10);
  renderFullCalendarGrid();
  renderRemindersList();
  playSound('pop');
}

function jumpToTodayCalendar() {
  const todayBs = getBikramSambatDate();
  calendarState.currentBsYear = todayBs.year;
  calendarState.currentBsMonth = todayBs.month;
  calendarState.selectedDay = todayBs.day;
  renderFullCalendarGrid();
  renderRemindersList();
  playSound('pop');
  showToast(currentLang === 'ne' ? 'आजको मितिमा पुग्यो' : 'Jumped to today');
}

function renderWeekdayHeaders() {
  const container = document.getElementById('calendarWeekdayHeaders');
  if (!container) return;
  const isNe = currentLang === 'ne';
  const labels = isNe 
    ? ['आइत', 'सोम', 'मंगल', 'बुध', 'बिही', 'शुक्र', 'शनि']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  container.innerHTML = labels.map((l, i) => {
    const isSat = i === 6;
    return `<div class="${isSat ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-zinc-400'} font-bold">${l}</div>`;
  }).join('');
}

function renderFullCalendarGrid() {
  const container = document.getElementById('calendarMonthGrid');
  const titleEl = document.getElementById('calendarMonthTitle');
  const subtitleEl = document.getElementById('calendarMonthSubtitle');
  const dualDisplayEl = document.getElementById('calendarDualDisplay');
  if (!container) return;

  renderWeekdayHeaders();

  const year = calendarState.currentBsYear;
  const month = calendarState.currentBsMonth;
  const daysInMonth = getBsMonthDays(year, month);

  const firstDayAd = bsToAdDate(year, month, 1);
  const startCol = firstDayAd.getDay(); // 0 for Sunday ... 6 for Saturday

  const todayBs = getBikramSambatDate();
  const isCurrentMonth = (todayBs.year === year && todayBs.month === month);

  const adFirst = bsToAdDate(year, month, 1);
  const adLast = bsToAdDate(year, month, daysInMonth);
  const adMonth1 = adFirst.toLocaleDateString('en-US', { month: 'short' });
  const adMonth2 = adLast.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const adRange = adMonth1 === adMonth2.split(' ')[0] ? adMonth2 : `${adMonth1} / ${adMonth2}`;

  const monthName = currentLang === 'ne' ? nepaliMonths[month - 1] : nepaliMonthsEn[month - 1];
  const yearName = currentLang === 'ne' ? toDevanagariDigits(year) : year;
  const yearSelect = document.getElementById('calendarYearSelect');
  const monthSelect = document.getElementById('calendarMonthSelect');
  if (yearSelect) yearSelect.value = String(year);
  if (monthSelect) monthSelect.value = String(month);

  if (titleEl) {
    titleEl.innerText = `${monthName} ${yearName}`;
  }
  if (subtitleEl) {
    subtitleEl.innerText = currentLang === 'ne' 
      ? `नेपाली पात्रो (वि.सं.) • ${adRange}` 
      : `Bikram Sambat (BS) • ${adRange}`;
  }

  let html = '';

  // Empty leading cells
  for (let i = 0; i < startCol; i++) {
    html += `<div class="h-12 rounded-xl bg-slate-50/40 dark:bg-[#111722]/30 border border-transparent"></div>`;
  }

  // Active day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const adDate = bsToAdDate(year, month, day);
    const weekday = adDate.getDay();
    const isSaturday = weekday === 6;
    const isToday = isCurrentMonth && (todayBs.day === day);

    const festKey = `${month}-${day}`;
    const festName = getFestival(year, month, day);

    const dateKey = `${year}-${month}-${day}`;
    const userEvents = (state.events && state.events[dateKey]) || [];

    const devDay = toDevanagariDigits(day);
    const dayDisplay = currentLang === 'ne' ? devDay : day;
    const adDayNum = adDate.getDate();

    let borderClass = 'border-slate-200 dark:border-[#283347]';
    let bgClass = 'bg-white dark:bg-[#18202d]';
    let textClass = 'text-slate-900 dark:text-slate-100 font-bold';

    if (isSaturday) {
      borderClass = 'border-rose-200/80 dark:border-rose-900/40';
      bgClass = 'bg-rose-50/70 dark:bg-rose-950/25';
      textClass = 'text-rose-600 dark:text-rose-400 font-extrabold';
    }

    if (festName) {
      borderClass = 'border-amber-300/90 dark:border-amber-700/60';
      bgClass = isSaturday ? 'bg-amber-50/80 dark:bg-amber-950/30' : 'bg-amber-50/75 dark:bg-amber-950/25';
      textClass = isSaturday ? 'text-rose-600 dark:text-rose-400 font-extrabold' : 'text-amber-900 dark:text-amber-200 font-extrabold';
    }

    if (isToday) {
      borderClass = 'border-emerald-500 ring-2 ring-emerald-500/25';
      bgClass = 'bg-emerald-50/70 dark:bg-emerald-950/40';
      textClass = 'text-emerald-900 dark:text-emerald-100 font-black';
    }

    html += `
      <div onclick="openDateDetails('${dateKey}', ${day}, '${festKey}')" 
           class="h-12 p-1 rounded-xl border ${borderClass} ${bgClass} cursor-pointer hover:border-emerald-400 flex flex-col justify-between transition-all select-none relative group active:scale-95">
        <div class="flex justify-between items-start leading-none">
          <span class="text-xs ${textClass}">${dayDisplay}</span>
          <span class="text-[9px] ${isSaturday ? 'text-rose-400 dark:text-rose-500 font-bold' : 'text-slate-400 dark:text-slate-300 font-mono'}">${adDayNum}</span>
        </div>
        <div class="flex items-center space-x-0.5 truncate leading-none">
          ${festName ? `<span class="inline-block px-1 py-0.5 text-[8px] font-bold bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 rounded truncate max-w-full" title="${escapeHtml(festName)}">${festName.length > 5 ? escapeHtml(festName.substring(0, 4)) + '..' : escapeHtml(festName)}</span>` : ''}
          ${userEvents.length > 0 ? `<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" title="${userEvents.length} सम्झना"></span>` : ''}
        </div>
      </div>
    `;
  }

  container.innerHTML = html;

  if (dualDisplayEl) {
    dualDisplayEl.innerHTML = `
      <div class="flex justify-between items-center text-[11px] font-medium text-slate-500 dark:text-slate-400">
        <span>${currentLang === 'ne' ? 'ई.सं. (AD) समकक्षी महिना:' : 'Gregorian (AD) equivalent:'}</span>
        <span class="font-mono font-bold text-slate-800 dark:text-slate-200">${adRange}</span>
      </div>
    `;
  }

  renderRemindersList();
}

function openAddEventModalQuick() {
  const todayBs = getBikramSambatDate();
  const dateKey = `${todayBs.year}-${todayBs.month}-${todayBs.day}`;
  openDateDetails(dateKey, todayBs.day, `${todayBs.month}-${todayBs.day}`);
}

function openDateDetails(dateKey, dayNum, festKey) {
  calendarState.selectedDateKey = dateKey;
  const parts = dateKey.split('-');
  const y = parts[0];
  const m = parts[1];
  const d = parts[2];

  const modal = document.getElementById('calendarEventModal');
  const titleEl = document.getElementById('modalSelectedDate');
  const festEl = document.getElementById('modalFestivalDesc');

  const mName = currentLang === 'ne' ? nepaliMonths[m - 1] : nepaliMonthsEn[m - 1];
  const dDev = currentLang === 'ne' ? toDevanagariDigits(d) : d;
  const yDev = currentLang === 'ne' ? toDevanagariDigits(y) : y;

  const adDate = bsToAdDate(parseInt(y), parseInt(m), parseInt(d));
  const adFormatted = adDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });

  titleEl.innerText = `${mName} ${dDev}, ${yDev} (${adFormatted})`;

  const festName = getFestival(parseInt(y), parseInt(m), parseInt(d));
  if (festName) {
    festEl.innerText = `🎉 ${festName}`;
    festEl.classList.remove('hidden');
  } else {
    festEl.classList.add('hidden');
  }

  renderModalEvents(dateKey);
  modal.classList.remove('hidden');
}

function closeDateDetails() {
  const modal = document.getElementById('calendarEventModal');
  if (modal) modal.classList.add('hidden');
}

function renderModalEvents(dateKey) {
  const listEl = document.getElementById('modalEventsList');
  if (!listEl) return;
  const events = (state.events && state.events[dateKey]) || [];

  if (events.length === 0) {
    listEl.innerHTML = `<div class="text-xs text-slate-400 py-1.5">${currentLang === 'ne' ? 'कुनै कार्यक्रम दर्ता छैन' : 'No reminders for this day'}</div>`;
    return;
  }

  listEl.innerHTML = events.map(e => `
    <div class="p-2 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 rounded-xl flex items-center justify-between text-xs">
      <div>
        <span class="font-bold text-slate-900 dark:text-zinc-100">${escapeHtml(e.title)}</span>
        ${e.time ? `<span class="text-emerald-600 dark:text-emerald-400 font-mono ml-2">${e.time}</span>` : ''}
      </div>
      <button onclick="deleteEvent('${dateKey}', ${e.id})" class="text-slate-400 hover:text-rose-500 p-1">✕</button>
    </div>
  `).join('');
}

function saveCalendarEvent(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('eventTitleInput');
  const timeInput = document.getElementById('eventTimeInput');
  const dateKey = calendarState.selectedDateKey;

  if (!input || !input.value.trim() || !dateKey) return;

  if (!state.events) state.events = {};
  if (!state.events[dateKey]) state.events[dateKey] = [];

  state.events[dateKey].push({
    id: Date.now(),
    title: input.value.trim(),
    time: timeInput ? timeInput.value : ''
  });

  saveState();
  playSound('coin');
  input.value = '';
  renderModalEvents(dateKey);
  renderRemindersList();
  renderFullCalendarGrid();
  showToast(currentLang === 'ne' ? 'सम्झना सुरक्षित भयो' : 'Reminder saved');
}

function deleteEvent(dateKey, id) {
  requestConfirm(
    currentLang === 'ne' ? 'सम्झना हटाउने?' : 'Delete Reminder?',
    currentLang === 'ne' ? 'यो सम्झना पात्रोबाट हट्नेछ।' : 'This reminder will be removed from your calendar.',
    () => {
      if (state.events && state.events[dateKey]) {
        state.events[dateKey] = state.events[dateKey].filter(e => e.id !== id);
        if (state.events[dateKey].length === 0) delete state.events[dateKey];
        saveState();
        renderModalEvents(dateKey);
        renderRemindersList();
        renderFullCalendarGrid();
        showToast(currentLang === 'ne' ? 'सम्झना हटाइयो' : 'Reminder deleted');
      }
    }
  );
}

function renderRemindersList() {
  const container = document.getElementById('upcomingRemindersList');
  if (!container) return;

  const todayAd = new Date();
  todayAd.setHours(0, 0, 0, 0);

  const currentYear = (calendarState && calendarState.currentBsYear) || 2081;
  const currentMonth = (calendarState && calendarState.currentBsMonth) || 1;
  const items = [];

  // 1. Gather verified official festivals for current month and next 2 months
  for (let mOffset = 0; mOffset <= 2; mOffset++) {
    let y = currentYear;
    let m = currentMonth + mOffset;
    while (m > 12) {
      m -= 12;
      y++;
    }
    const days = getBsMonthDays(y, m);
    for (let d = 1; d <= days; d++) {
      const fest = getFestival(y, m, d);
      if (fest) {
        const evAd = bsToAdDate(y, m, d);
        evAd.setHours(0, 0, 0, 0);
        const diffDays = Math.round((evAd.getTime() - todayAd.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 40) {
          items.push({
            type: 'festival',
            year: y,
            month: m,
            day: d,
            title: fest,
            dateKey: `${y}-${m}-${d}`,
            diffDays: diffDays
          });
        }
      }
    }
  }

  // 2. Gather user personal events
  if (state.events) {
    Object.keys(state.events).forEach(key => {
      const parts = key.split('-').map(Number);
      if (parts.length === 3) {
        const y = parts[0], m = parts[1], d = parts[2];
        const evAd = bsToAdDate(y, m, d);
        evAd.setHours(0, 0, 0, 0);
        const diffDays = Math.round((evAd.getTime() - todayAd.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 40) {
          state.events[key].forEach(ev => {
            items.push({
              type: 'user',
              id: ev.id,
              year: y,
              month: m,
              day: d,
              title: ev.title,
              time: ev.time,
              dateKey: key,
              diffDays: diffDays
            });
          });
        }
      }
    });
  }

  // Sort by diffDays ascending (nearest first)
  items.sort((a, b) => a.diffDays - b.diffDays);

  if (items.length === 0) {
    container.innerHTML = `<div class="text-xs text-slate-500 dark:text-slate-400 py-3 text-center">${currentLang === 'ne' ? 'आगामी कुनै सम्झना वा चाडपर्व छैन' : 'No upcoming reminders or festivals'}</div>`;
    return;
  }

  // Nearest 4 items only to keep view clean and compact
  const nearestItems = items.slice(0, 4);

  container.innerHTML = nearestItems.map(it => {
    const mName = currentLang === 'ne' ? nepaliMonths[it.month - 1] : nepaliMonthsEn[it.month - 1];
    const dDev = currentLang === 'ne' ? toDevanagariDigits(it.day) : it.day;
    const yDev = currentLang === 'ne' ? toDevanagariDigits(it.year) : it.year;
    const dateFormatted = `${mName} ${dDev}, ${yDev}`;

    let countdownBadge = '';
    if (it.diffDays === 0) {
      countdownBadge = `<span class="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 rounded-md shadow-2xs whitespace-nowrap">${currentLang === 'ne' ? 'आज' : 'Today'}</span>`;
    } else if (it.diffDays === 1) {
      countdownBadge = `<span class="px-2 py-0.5 text-[10px] font-extrabold bg-sky-100 dark:bg-sky-950/90 text-sky-800 dark:text-sky-300 rounded-md shadow-2xs whitespace-nowrap">${currentLang === 'ne' ? 'भोलि' : 'Tomorrow'}</span>`;
    } else {
      const daysDev = currentLang === 'ne' ? toDevanagariDigits(it.diffDays) : it.diffDays;
      countdownBadge = `<span class="px-2 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-[#111722] text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-[#334158] rounded-md font-mono whitespace-nowrap">${daysDev} ${currentLang === 'ne' ? 'दिन बाँकी' : 'days left'}</span>`;
    }

    if (it.type === 'festival') {
      return `
        <div onclick="openDateDetails('${it.dateKey}', ${it.day}, '${it.month}-${it.day}')" 
             class="p-2.5 bg-white dark:bg-[#18202d] border border-amber-200/80 dark:border-amber-900/40 rounded-xl flex items-center justify-between shadow-2xs cursor-pointer hover:border-amber-400 transition active:scale-95">
          <div class="flex-1 min-w-0 pr-2">
            <div class="flex items-center space-x-1.5 truncate">
              <span class="px-1.5 py-0.5 text-[9px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 rounded-md flex-shrink-0">🎉 चाडपर्व</span>
              <span class="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">${escapeHtml(it.title)}</span>
            </div>
            <div class="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">${dateFormatted}</div>
          </div>
          <div class="flex items-center space-x-2 flex-shrink-0">
            ${countdownBadge}
            <span class="text-xs text-slate-400">→</span>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="p-2.5 bg-white dark:bg-[#18202d] border border-slate-200 dark:border-[#283347] rounded-xl flex items-center justify-between shadow-2xs">
          <div class="flex-1 min-w-0 pr-2">
            <div class="flex items-center space-x-1.5 truncate">
              <span class="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-md flex-shrink-0">📌 सम्झना</span>
              <span class="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">${escapeHtml(it.title)}</span>
            </div>
            <div class="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">${dateFormatted} ${it.time ? '• ' + it.time : ''}</div>
          </div>
          <div class="flex items-center space-x-1.5 flex-shrink-0">
            ${countdownBadge}
            <button onclick="deleteEvent('${it.dateKey}', ${it.id})" class="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition" title="Delete">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      `;
    }
  }).join('');
}

// ---------------------------------------------------------------------
// 6. FLOATING INTERACTIVE PET COMPANION ("पुकु" / PUKU) & PLAYGROUND
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// 6. FLOATING INTERACTIVE PET COMPANION ("पुकु" / PUKU) & PLAYGROUND
// ---------------------------------------------------------------------
let pet = {
  screenX: -999,
  screenY: -999,
  vx: 0,
  vy: 0,
  isDragging: false,
  dragStartX: 0,
  dragStartY: 0,
  dragStartPetX: 0,
  dragStartPetY: 0,
  lastPointerX: 0,
  lastPointerY: 0,
  pointerHistory: [],
  lastTapTime: 0,
  state: "walk",
  flipAngle: 0,
  tilt: 0,
  direction: 1,
  walkFrame: 0,
  tailAngle: 0,
  carryingItem: null,
  actionTimer: 0,
  idleCounter: 0,
  particles: []
};

let activeTennisBall = null;
let petAnimationId = null;
let petListenersAttached = false;

function getPetDockCoordinates() {
  const floorY = Math.max(10, window.innerHeight - 150);
  const dockX = Math.max(10, window.innerWidth - 110);
  return { dockX, floorY };
}

function initPetEngine() {
  const container = document.getElementById("floatingPetContainer");
  const toggle = document.getElementById("petMasterToggle");
  
  if (toggle) {
    toggle.checked = !!state.petEnabled;
  }

  if (!state.petEnabled) {
    if (container) container.classList.add("hidden");
    if (petAnimationId) cancelAnimationFrame(petAnimationId);
    return;
  }

  if (container) {
    container.classList.remove("hidden");
    const { dockX, floorY } = getPetDockCoordinates();
    if (pet.screenX < 0 || pet.screenY < 0) {
      pet.screenX = dockX;
      pet.screenY = floorY;
    }
    container.style.transform = "translate3d(" + Math.round(pet.screenX) + "px, " + Math.round(pet.screenY) + "px, 0)";
  }

  const canvas = document.getElementById("floatingPetCanvas");
  if (canvas && !petListenersAttached) {
    attachPetPointerListeners(canvas);
    petListenersAttached = true;
  }

  function loop() {
    if (!state.petEnabled) return;
    updatePet();
    drawPet();
    petAnimationId = requestAnimationFrame(loop);
  }

  if (petAnimationId) cancelAnimationFrame(petAnimationId);
  petAnimationId = requestAnimationFrame(loop);
}

function attachPetPointerListeners(canvas) {
  const container = document.getElementById("floatingPetContainer");

  canvas.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    try { canvas.setPointerCapture(e.pointerId); } catch(err) {}

    if (container) container.style.transition = "none";
    const bubble = document.getElementById("pukuBubble");
    if (bubble) bubble.classList.add("hidden");

    pet.isDragging = true;
    pet.dragStartX = e.clientX;
    pet.dragStartY = e.clientY;
    pet.dragStartPetX = pet.screenX;
    pet.dragStartPetY = pet.screenY;
    pet.lastPointerX = e.clientX;
    pet.lastPointerY = e.clientY;
    pet.pointerHistory = [{ x: e.clientX, y: e.clientY, t: Date.now() }];
    pet.idleCounter = 0;
    pet.state = "held";
    pet.vx = 0;
    pet.vy = 0;
    pet.tilt = 0;

    playSound("bark");
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!pet.isDragging) return;
    const dx = e.clientX - pet.dragStartX;
    const dy = e.clientY - pet.dragStartY;

    const maxX = Math.max(10, window.innerWidth - 100);
    const maxY = Math.max(10, window.innerHeight - 100);

    pet.screenX = Math.max(10, Math.min(maxX, pet.dragStartPetX + dx));
    pet.screenY = Math.max(10, Math.min(maxY, pet.dragStartPetY + dy));

    if (container) {
      container.style.transform = `translate3d(${Math.round(pet.screenX)}px, ${Math.round(pet.screenY)}px, 0)`;
    }

    const pDx = e.clientX - pet.lastPointerX;
    if (Math.abs(pDx) > 1) {
      pet.direction = pDx > 0 ? 1 : -1;
      pet.tilt = Math.max(-0.35, Math.min(0.35, pDx * 0.04));
    }

    pet.lastPointerX = e.clientX;
    pet.lastPointerY = e.clientY;

    pet.pointerHistory.push({ x: e.clientX, y: e.clientY, t: Date.now() });
    if (pet.pointerHistory.length > 5) pet.pointerHistory.shift();
  });

  const onPointerEnd = (e) => {
    if (!pet.isDragging) return;
    pet.isDragging = false;
    try { canvas.releasePointerCapture(e.pointerId); } catch(err) {}
    if (container) container.style.transition = "";

    const totalDist = Math.hypot(e.clientX - pet.dragStartX, e.clientY - pet.dragStartY);

    if (totalDist < 12) {
      const now = Date.now();
      if (now - pet.lastTapTime < 320) {
        pet.state = "beg";
        pet.actionTimer = 90;
        playSound("happy");
        spawnPetParticles("❤️", 6);
        showPetSpeech(currentLang === "ne" ? "म तपाईंको असल साथी हुँ! 🐾" : "I love you so much! 🐾");
        pet.lastTapTime = 0;
      } else {
        pet.state = "flip";
        pet.flipAngle = 0;
        pet.vy = -8.5;
        pet.vx = pet.direction * 1.5;
        playSound("bark");
        spawnPetParticles("✨", 6);
        pet.lastTapTime = now;
      }
    } else {
      if (pet.pointerHistory.length >= 2) {
        const first = pet.pointerHistory[0];
        const last = pet.pointerHistory[pet.pointerHistory.length - 1];
        const dt = Math.max(16, last.t - first.t);
        pet.vx = Math.max(-16, Math.min(16, ((last.x - first.x) / dt) * 16));
        pet.vy = Math.max(-16, Math.min(16, ((last.y - first.y) / dt) * 16));
      } else {
        pet.vx = 0;
        pet.vy = 0;
      }
      pet.state = "tossed";
      playSound("pop");
    }
  };

  canvas.addEventListener("pointerup", onPointerEnd);
  canvas.addEventListener("pointercancel", onPointerEnd);
}

function spawnPetParticles(char, count = 5) {
  for (let i = 0; i < count; i++) {
    pet.particles.push({
      x: 48 + (Math.random() * 26 - 13),
      y: 35 + (Math.random() * 10 - 5),
      vx: (Math.random() - 0.5) * 2.2,
      vy: -1.5 - Math.random() * 1.8,
      alpha: 1.0,
      size: 13 + Math.random() * 6,
      char: char
    });
  }
}

function showPetSpeech(text) {
  const bubble = document.getElementById("pukuBubble");
  if (!bubble) return;
  bubble.innerText = text;
  bubble.classList.remove("hidden");
  bubble.onclick = openPukuPlayModal;
  setTimeout(() => {
    bubble.classList.add("hidden");
  }, 3500);
}

function tossTennisBall(event) {
  if (event) event.stopPropagation();
  playSound("pop");

  const { floorY } = getPetDockCoordinates();
  const startX = pet.direction === 1 ? Math.min(window.innerWidth - 80, pet.screenX + 120) : Math.max(40, pet.screenX - 120);

  activeTennisBall = {
    x: startX,
    y: pet.screenY - 30,
    vx: (pet.direction === 1 ? 4 : -4) + (Math.random() * 2 - 1),
    vy: -6,
    bounces: 4,
    active: true
  };

  pet.state = "chase";
  pet.idleCounter = 0;
  pet.direction = activeTennisBall.x > pet.screenX ? 1 : -1;
  showPetSpeech(currentLang === "ne" ? "बल आयो! म समात्छु! 🎾" : "Catching the ball! 🎾");
}

function updatePet() {
  const container = document.getElementById("floatingPetContainer");
  if (!container) return;

  const { dockX, floorY } = getPetDockCoordinates();
  pet.idleCounter = (pet.idleCounter || 0) + 1;

  if (activeTennisBall && activeTennisBall.active) {
    activeTennisBall.x += activeTennisBall.vx;
    activeTennisBall.y += activeTennisBall.vy;
    activeTennisBall.vy += 0.45;

    if (activeTennisBall.y >= floorY + 20) {
      activeTennisBall.y = floorY + 20;
      activeTennisBall.vy = -activeTennisBall.vy * 0.6;
      activeTennisBall.vx *= 0.85;
      activeTennisBall.bounces--;
      if (activeTennisBall.bounces <= 0 && Math.abs(activeTennisBall.vy) < 1) {
        activeTennisBall.vy = 0;
        activeTennisBall.vx = 0;
      }
    }
  }

  if (pet.isDragging) {
    pet.tilt *= 0.9;
    pet.tailAngle = Math.sin(Date.now() / 90) * 0.6;
  } else if (pet.state === "tossed" || pet.state === "flip") {
    pet.vy += 0.55;
    pet.screenX += pet.vx;
    pet.screenY += pet.vy;
    pet.vx *= 0.985;

    if (pet.state === "flip") {
      pet.flipAngle += (Math.PI * 2) / 20;
    }

    if (pet.screenX <= 10) {
      pet.screenX = 10;
      pet.vx = -pet.vx * 0.6;
      pet.direction = 1;
    } else if (pet.screenX >= window.innerWidth - 105) {
      pet.screenX = window.innerWidth - 105;
      pet.vx = -pet.vx * 0.6;
      pet.direction = -1;
    }

    if (pet.screenY >= floorY) {
      pet.screenY = floorY;
      pet.vy = -pet.vy * 0.52;
      pet.vx *= 0.75;
      if (Math.abs(pet.vy) < 1.2) {
        pet.vy = 0;
        pet.vx = 0;
        pet.state = "walk";
        pet.flipAngle = 0;
        spawnPetParticles("✨", 4);
      }
    }
  } else if (pet.state === "beg") {
    pet.actionTimer--;
    pet.tailAngle = Math.sin(Date.now() / 110) * 0.5;
    if (pet.actionTimer <= 0) {
      pet.state = "walk";
    }
  } else if (pet.state === "chase") {
    if (activeTennisBall && activeTennisBall.active) {
      const dx = activeTennisBall.x - pet.screenX;
      pet.direction = dx >= 0 ? 1 : -1;
      pet.screenX += Math.sign(dx) * 4.2;
      pet.walkFrame += 0.4;
      pet.tailAngle = Math.sin(Date.now() / 80) * 0.7;

      if (Math.abs(dx) < 22) {
        activeTennisBall.active = false;
        activeTennisBall = null;
        pet.carryingItem = "ball";
        pet.state = "walk";
        pet.direction = -1;
        playSound("bark");
        spawnPetParticles("🎾", 5);
        state.petHappiness = Math.min(100, (state.petHappiness || 90) + 5);
        saveState();
        showPetSpeech(currentLang === "ne" ? "बल समातें! 🎾" : "Caught it! 🎾");
        setTimeout(() => {
          pet.carryingItem = null;
          spawnPetParticles("✨", 3);
        }, 3500);
      }
    } else {
      pet.state = "walk";
    }
  } else if (pet.state === "walk") {
    pet.screenY = floorY;
    pet.flipAngle = 0;
    pet.tilt = 0;
    pet.tailAngle = Math.sin(Date.now() / 150) * 0.45;

    if (pet.idleCounter > 420) {
      const distToDock = Math.abs(pet.screenX - dockX);
      if (distToDock > 12) {
        pet.direction = dockX > pet.screenX ? 1 : -1;
        pet.screenX += pet.direction * 1.8;
        pet.walkFrame += 0.25;
      } else {
        if (pet.idleCounter > 1500) {
          pet.state = "sleep";
          if (pet.idleCounter % 150 === 0) {
            pet.particles.push({
              x: 55,
              y: 35,
              vx: 0.2,
              vy: -0.6,
              alpha: 0.9,
              size: 11,
              char: "Zzz"
            });
          }
        }
      }
    }
  }

  container.style.transform = "translate3d(" + Math.round(pet.screenX) + "px, " + Math.round(pet.screenY) + "px, 0)";

  for (let i = pet.particles.length - 1; i >= 0; i--) {
    const p = pet.particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.025;
    if (p.alpha <= 0) pet.particles.splice(i, 1);
  }
}

function drawPet() {
  const canvas = document.getElementById("floatingPetCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  pet.particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.font = p.size + "px sans-serif";
    ctx.fillText(p.char, p.x, p.y);
    ctx.restore();
  });

  ctx.save();
  ctx.translate(48, 48);
  ctx.rotate(pet.flipAngle + pet.tilt);
  ctx.scale(pet.direction * 0.92, 0.92);

  const bodyColor = "#f59e0b";
  const earColor = "#d97706";
  const bellyColor = "#fef3c7";

  ctx.save();
  ctx.translate(-14, -2);
  ctx.rotate(pet.tailAngle);
  ctx.fillStyle = earColor;
  ctx.beginPath();
  ctx.ellipse(-6, -4, 4, 10, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (pet.state === "sleep") {
    ctx.fillStyle = earColor;
    ctx.fillRect(-8, 9, 8, 4);
    ctx.fillRect(4, 9, 8, 4);
  } else if (pet.state === "held") {
    const dangle = Math.sin(Date.now() / 120) * 2;
    ctx.fillStyle = earColor;
    ctx.fillRect(-10, 8 + dangle, 4, 10);
    ctx.fillRect(-6, 8 - dangle, 4, 10);
    ctx.fillRect(8, 8 + dangle, 4, 10);
    ctx.fillRect(12, 8 - dangle, 4, 10);
  } else if (pet.state === "beg") {
    ctx.fillStyle = earColor;
    ctx.fillRect(-12, 10, 8, 5);
    const wave = Math.sin(Date.now() / 90) * 3;
    ctx.fillRect(6, -2 + wave, 5, 8);
    ctx.fillRect(12, -2 - wave, 5, 8);
  } else {
    const leg1 = Math.sin(pet.walkFrame) * 4;
    const leg2 = Math.cos(pet.walkFrame) * 4;
    ctx.fillStyle = earColor;
    ctx.fillRect(-10, 8 + leg1, 4, 8);
    ctx.fillRect(-6, 8 - leg1, 4, 8);
    ctx.fillRect(8, 8 + leg2, 4, 8);
    ctx.fillRect(12, 8 - leg2, 4, 8);
  }

  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(0, 4, 16, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = bellyColor;
  ctx.beginPath();
  ctx.ellipse(1, 6, 10, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.arc(14, -6, 11, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = bellyColor;
  ctx.beginPath();
  ctx.ellipse(20, -4, 6, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.arc(23, -5, 2.5, 0, Math.PI * 2);
  ctx.fill();

  if (pet.state === "sleep") {
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(16, -8, 2.5, 0, Math.PI, false);
    ctx.stroke();
  } else if (pet.state === "held" || pet.state === "beg") {
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(16, -9, 2.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(17, -9.5, 1.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f43f5e";
    ctx.globalAlpha = 0.45;
    ctx.beginPath();
    ctx.ellipse(15, -4, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  } else {
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(16, -9, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(16.5, -9.5, 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = earColor;
  ctx.beginPath();
  ctx.ellipse(8, -8, 4, 8, 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ef4444";
  ctx.fillRect(8, 0, 6, 3);
  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.arc(11, 4, 2, 0, Math.PI * 2);
  ctx.fill();

  if (pet.carryingItem === "bag") {
    ctx.font = "14px sans-serif";
    ctx.fillText("🛍️", 20, 4);
  } else if (pet.carryingItem === "coin") {
    ctx.font = "14px sans-serif";
    ctx.fillText("🪙", 20, 2);
  } else if (pet.carryingItem === "ball") {
    ctx.font = "14px sans-serif";
    ctx.fillText("🎾", 20, 2);
  }

  ctx.restore();
}

function dismissPet() {
  state.petEnabled = false;
  saveState();
  initPetEngine();
  showToast(currentLang === "ne" ? "पुकु साथी हटाइयो (भण्डारबाट पुनः खोल्न सक्नुहुन्छ)" : "Pet dismissed (re-enable in Vault anytime)");
}

function togglePetCompanion(e) {
  const enabled = e.target.checked;
  state.petEnabled = enabled;
  saveState();
  initPetEngine();
  showToast(enabled 
    ? (currentLang === "ne" ? "पुकु साथी सक्रिय भयो 🐾" : "Pet companion enabled 🐾")
    : (currentLang === "ne" ? "पुकु साथी हटाइयो" : "Pet companion disabled")
  );
}

function interactWithPet(event) {
  if (event) event.stopPropagation();
  pet.idleCounter = 0;
  pet.vy = -7.5;
  pet.state = "flip";
  playSound("bark");
  spawnPetParticles("✨", 6);
  const greetings = currentLang === "ne" 
    ? ["भोउ भोउ! म सधैं यहाँ छु! 🐾", "चिया पिउनुभयो? ☕", "आजको दिन फलदायी रहोस्! 🌸", "पुकुसँग खेल्ने? (यहाँ छोएर खेल्नुहोस् 🎾)", "तपाईंको परिवार धेरै प्यारो छ! ❤️"]
    : ["Woof woof! I am here! 🐾", "Did you have tea yet? ☕", "Have a wonderful day! 🌸", "Tap here to play with me! 🎾", "Family is treasure! ❤️"];
  showPetSpeech(greetings[Math.floor(Math.random() * greetings.length)]);
}

function petCelebrate(action) {
  if (!state.petEnabled) return;
  pet.idleCounter = 0;
  pet.vy = -7.5;
  pet.state = "tossed";
  pet.carryingItem = action === "shopping" ? "bag" : "coin";

  playSound(action === "shopping" ? "pop" : "coin");
  spawnPetParticles(action === "shopping" ? "🥦" : "🪙", 6);

  showPetSpeech(action === "shopping" 
    ? (currentLang === "ne" ? "सपिङ झोला तयार छ! 🛍️" : "Shopping bag ready! 🛍️")
    : (currentLang === "ne" ? "खर्च सुरक्षित भयो! 🪙" : "Expense saved! 🪙"));

  setTimeout(() => {
    pet.carryingItem = null;
  }, 3500);
}

// ---------------------------------------------------------------------
// 6.1 PUKU PLAYGROUND ENGINE (पुकुको खेल कोठा)
// ---------------------------------------------------------------------
let pukuPlayLoopId = null;
let pukuPlayDog = {
  x: 70,
  y: 60,
  vx: 0,
  state: 'idle', // 'idle', 'run', 'eat', 'pet', 'sleep'
  direction: 1,
  frame: 0,
  targetX: 70,
  actionTimer: 0,
  idleTimer: 0
};
let pukuPlayItems = []; // { type: 'treat'|'ball', x, y, vx, vy, bounces, active: true }
let pukuPlayParticles = []; // { x, y, vx, vy, alpha, char, size }

function updatePukuHappinessDisplay() {
  const el = document.getElementById('pukuHappinessText');
  if (!el) return;
  const h = Math.min(100, Math.max(30, state.petHappiness || 90));
  const devH = toDevanagariDigits(h);
  if (currentLang === 'ne') {
    let desc = 'खुशी (Happy)';
    if (h >= 95) desc = 'अत्यन्त खुशी (Ecstatic)';
    else if (h >= 75) desc = 'धेरै खुशी (Very Happy)';
    else if (h >= 50) desc = 'सन्तुष्ट (Content)';
    else desc = 'अलिक भोकाएको (Hungry)';
    el.innerText = `💖 ${devH}% ${desc}`;
  } else {
    let desc = 'Happy';
    if (h >= 95) desc = 'Ecstatic';
    else if (h >= 75) desc = 'Very Happy';
    else if (h >= 50) desc = 'Content';
    else desc = 'Hungry';
    el.innerText = `💖 ${h}% ${desc}`;
  }
}

function openPukuPlayModal() {
  const modal = document.getElementById('pukuPlayModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  updatePukuHappinessDisplay();

  const canvas = document.getElementById('pukuPlaygroundCanvas');
  if (canvas && !canvas._pukuTapAttached) {
    canvas._pukuTapAttached = true;
    canvas.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const tapX = (e.clientX - rect.left) * scaleX;
      const tapY = (e.clientY - rect.top) * scaleY;

      pukuPlayDog.idleTimer = 0;
      if (pukuPlayDog.state === 'sleep') {
        pukuPlayDog.state = 'idle';
        playSound('bark');
        return;
      }

      const distToDog = Math.hypot(tapX - pukuPlayDog.x, tapY - pukuPlayDog.y);
      if (distToDog < 42) {
        // Tapped directly on Puku -> Love & Pet!
        petPukuLove();
      } else {
        // Tapped anywhere else on den floor/air -> Drop a treat or ball!
        const isTreat = Math.random() > 0.45;
        pukuPlayDog.state = 'run';
        pukuPlayDog.targetX = Math.max(30, Math.min(canvas.width - 30, tapX));
        pukuPlayDog.direction = tapX > pukuPlayDog.x ? 1 : -1;
        pukuPlayItems = [{
          type: isTreat ? 'treat' : 'ball',
          x: tapX,
          y: Math.max(20, Math.min(65, tapY)),
          vx: (Math.random() - 0.5) * 1.5,
          vy: -1.5,
          bounces: isTreat ? 1 : 4,
          active: true
        }];
        playSound(isTreat ? 'bark' : 'pop');
        state.petHappiness = Math.min(100, (state.petHappiness || 90) + 5);
        saveState();
        updatePukuHappinessDisplay();
      }
    });
  }

  function playgroundLoop() {
    updatePukuPlayground();
    drawPukuPlayground();
    pukuPlayLoopId = requestAnimationFrame(playgroundLoop);
  }

  if (pukuPlayLoopId) cancelAnimationFrame(pukuPlayLoopId);
  pukuPlayLoopId = requestAnimationFrame(playgroundLoop);
}

function closePukuPlayModal() {
  const modal = document.getElementById('pukuPlayModal');
  if (modal) modal.classList.add('hidden');
  if (pukuPlayLoopId) cancelAnimationFrame(pukuPlayLoopId);
}

function feedPukuTreat() {
  pukuPlayDog.idleTimer = 0;
  pukuPlayDog.state = 'run';
  pukuPlayDog.targetX = 210;
  pukuPlayDog.direction = 1;

  pukuPlayItems = [{ type: 'treat', x: 220, y: 65, active: true }];
  playSound('bark');

  state.petHappiness = Math.min(100, (state.petHappiness || 90) + 5);
  saveState();
  updatePukuHappinessDisplay();
  showToast(currentLang === 'ne' ? 'पुकुले मीठो Treat खायो! 🍖' : 'Puku loved the treat! 🍖');
}

function playFetchBall() {
  pukuPlayDog.idleTimer = 0;
  pukuPlayDog.state = 'run';
  pukuPlayDog.targetX = 220;
  pukuPlayDog.direction = 1;

  pukuPlayItems = [{ type: 'ball', x: 40, y: 40, vx: 5.5, vy: -2, bounces: 4, active: true }];
  playSound('pop');

  state.petHappiness = Math.min(100, (state.petHappiness || 90) + 5);
  saveState();
  updatePukuHappinessDisplay();
  showToast(currentLang === 'ne' ? 'पुकुले बल समात्यो! 🎾' : 'Puku caught the ball! 🎾');
}

function petPukuLove() {
  pukuPlayDog.idleTimer = 0;
  pukuPlayDog.state = 'pet';
  pukuPlayDog.actionTimer = 160;

  for (let i = 0; i < 8; i++) {
    pukuPlayParticles.push({
      x: pukuPlayDog.x + (Math.random() * 30 - 15),
      y: pukuPlayDog.y - 15,
      vx: (Math.random() - 0.5) * 2,
      vy: -1.5 - Math.random() * 1.5,
      alpha: 1.0,
      size: 14 + Math.random() * 6,
      char: '❤️'
    });
  }

  playSound('chime');
  state.petHappiness = Math.min(100, (state.petHappiness || 90) + 5);
  saveState();
  updatePukuHappinessDisplay();
  showToast(currentLang === 'ne' ? 'पुकु खुशीले रमायो! ❤️' : 'Puku feels loved! ❤️');
}

function updatePukuPlayground() {
  const canvas = document.getElementById('pukuPlaygroundCanvas');
  if (!canvas) return;

  pukuPlayDog.idleTimer = (pukuPlayDog.idleTimer || 0) + 1;

  // Idle Sleep Cycle in den after ~12s
  if (pukuPlayDog.idleTimer > 750 && pukuPlayItems.length === 0 && pukuPlayDog.state !== 'pet') {
    pukuPlayDog.state = 'sleep';
    if (pukuPlayDog.idleTimer % 120 === 0) {
      pukuPlayParticles.push({
        x: pukuPlayDog.x + 10,
        y: pukuPlayDog.y - 10,
        vx: 0.2,
        vy: -0.5,
        alpha: 0.9,
        size: 12,
        char: 'Zzz'
      });
    }
  }

  // Ball physics
  pukuPlayItems.forEach(item => {
    if (item.type === 'ball' && item.active) {
      item.x += item.vx;
      item.y += item.vy;
      item.vy += 0.35; // gravity
      if (item.y >= 68) {
        item.y = 68;
        item.vy = -item.vy * 0.65;
        item.vx *= 0.85;
      }
      if (item.x > 320) {
        item.x = 320;
        item.vx = -item.vx;
      }
      if (item.x < 15) {
        item.x = 15;
        item.vx = -item.vx;
      }
    }
  });

  // Dog movement towards target or items
  if (pukuPlayDog.state === 'run') {
    const dx = pukuPlayDog.targetX - pukuPlayDog.x;
    pukuPlayDog.direction = dx >= 0 ? 1 : -1;
    pukuPlayDog.vx = Math.sign(dx) * 2.2;
    pukuPlayDog.x += pukuPlayDog.vx;
    pukuPlayDog.frame += 0.35;

    if (Math.abs(dx) < 6) {
      pukuPlayDog.vx = 0;
      if (pukuPlayItems.length > 0) {
        const item = pukuPlayItems[0];
        if (item.type === 'treat') {
          pukuPlayDog.state = 'eat';
          pukuPlayDog.actionTimer = 90;
          pukuPlayItems = [];
          playSound('happy');
        } else if (item.type === 'ball') {
          pukuPlayDog.state = 'run';
          pukuPlayDog.targetX = 90; // Bring ball back
          pukuPlayItems = [];
        }
      } else {
        pukuPlayDog.state = 'idle';
      }
    }
  } else if (pukuPlayDog.state === 'eat') {
    pukuPlayDog.actionTimer--;
    if (pukuPlayDog.actionTimer % 15 === 0) {
      pukuPlayParticles.push({
        x: pukuPlayDog.x + 18,
        y: pukuPlayDog.y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -1,
        alpha: 0.8,
        size: 9,
        char: '✨'
      });
    }
    if (pukuPlayDog.actionTimer <= 0) {
      pukuPlayDog.state = 'idle';
    }
  } else if (pukuPlayDog.state === 'pet') {
    pukuPlayDog.actionTimer--;
    if (pukuPlayDog.actionTimer <= 0) {
      pukuPlayDog.state = 'idle';
    }
  }

  // Update particles
  for (let i = pukuPlayParticles.length - 1; i >= 0; i--) {
    const p = pukuPlayParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.02;
    if (p.alpha <= 0) pukuPlayParticles.splice(i, 1);
  }
}

function drawPukuPlayground() {
  const canvas = document.getElementById('pukuPlaygroundCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // Floor Line / Mat
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(10, 78, w - 20, 2);

  // Sleeping mat / cushion
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.ellipse(75, 75, 32, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw Items (Treat / Ball)
  pukuPlayItems.forEach(item => {
    ctx.font = '18px sans-serif';
    ctx.fillText(item.type === 'treat' ? '🍖' : '🎾', item.x - 9, item.y + 6);
  });

  // Draw Particles
  pukuPlayParticles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.font = `${p.size}px sans-serif`;
    ctx.fillText(p.char, p.x, p.y);
    ctx.restore();
  });

  // Draw Dog
  ctx.save();
  ctx.translate(pukuPlayDog.x, pukuPlayDog.y);
  ctx.scale(pukuPlayDog.direction * 1.1, 1.1);

  const bodyColor = '#f59e0b';
  const earColor = '#d97706';
  const bellyColor = '#fef3c7';

  if (pukuPlayDog.state === 'sleep') {
    // Sleeping curled up
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(0, 4, 18, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = earColor;
    ctx.beginPath();
    ctx.ellipse(10, -2, 6, 8, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Closed peaceful eye
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(12, -2, 2.5, 0, Math.PI, false);
    ctx.stroke();
  } else if (pukuPlayDog.state === 'pet') {
    // Rolling on back happily
    ctx.rotate(Math.PI * 0.85);
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(0, 4, 16, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = bellyColor;
    ctx.beginPath();
    ctx.ellipse(1, 6, 10, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    // Paws in air
    ctx.fillStyle = earColor;
    ctx.fillRect(-8, -12, 4, 8);
    ctx.fillRect(4, -12, 4, 8);
  } else {
    // Standing / Running
    const legOffset1 = Math.sin(pukuPlayDog.frame) * 4;
    const legOffset2 = Math.cos(pukuPlayDog.frame) * 4;

    // Tail
    ctx.save();
    ctx.translate(-14, -2);
    ctx.rotate(Math.sin(Date.now() / 120) * 0.5);
    ctx.fillStyle = earColor;
    ctx.beginPath();
    ctx.ellipse(-6, -4, 4, 10, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Legs
    ctx.fillStyle = earColor;
    ctx.fillRect(-10, 8 + legOffset1, 4, 8);
    ctx.fillRect(-6, 8 - legOffset1, 4, 8);
    ctx.fillRect(8, 8 + legOffset2, 4, 8);
    ctx.fillRect(12, 8 - legOffset2, 4, 8);

    // Body & Head
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(0, 4, 16, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = bellyColor;
    ctx.beginPath();
    ctx.ellipse(1, 6, 10, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.arc(14, -6, 11, 0, Math.PI * 2);
    ctx.fill();

    // Snout & Nose
    ctx.fillStyle = bellyColor;
    ctx.beginPath();
    ctx.ellipse(20, -4, 6, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(23, -5, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(16, -9, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(16.5, -9.5, 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Floppy Ear
    ctx.fillStyle = earColor;
    ctx.beginPath();
    ctx.ellipse(8, -8, 4, 8, 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// ---------------------------------------------------------------------
// 7. BAGH-CHAL (बाघचाल) ENGINE WITH POINTERDOWN TOUCH & UNDO
// ---------------------------------------------------------------------
let baghGame = {
  mode: 'vs_tiger_bot', // 'vs_tiger_bot', 'vs_goat_bot', 'two_player'
  turn: 'goat', // 'goat' or 'tiger'
  phase: 'placing', // 'placing' or 'moving'
  goatsPlaced: 0,
  goatsCaptured: 0,
  board: Array(25).fill(null),
  selectedPos: null,
  validMoves: [],
  history: []
};

function getAdjNeighbors(pos) {
  const r = Math.floor(pos / 5);
  const c = pos % 5;
  const neighbors = [];

  const deltas = [
    [-1, 0], [1, 0], [0, -1], [0, 1]
  ];

  if ((r + c) % 2 === 0) {
    deltas.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
  }

  for (let [dr, dc] of deltas) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5) {
      neighbors.push(nr * 5 + nc);
    }
  }
  return neighbors;
}

function initBaghChal(mode = 'vs_tiger_bot') {
  baghGame.mode = mode;
  baghGame.turn = 'goat';
  baghGame.phase = 'placing';
  baghGame.goatsPlaced = 0;
  baghGame.goatsCaptured = 0;
  baghGame.selectedPos = null;
  baghGame.validMoves = [];
  baghGame.history = [];

  baghGame.board = Array(25).fill(null);
  // Place 4 tigers at corners
  baghGame.board[0] = 'T';
  baghGame.board[4] = 'T';
  baghGame.board[20] = 'T';
  baghGame.board[24] = 'T';

  recordBaghHistory();
  updateBaghStats();
  drawBaghBoard();

  if (baghGame.mode === 'vs_goat_bot' && baghGame.turn === 'goat') {
    setTimeout(makeGoatBotMove, 400);
  }
}

function recordBaghHistory() {
  baghGame.history.push({
    board: [...baghGame.board],
    turn: baghGame.turn,
    phase: baghGame.phase,
    goatsPlaced: baghGame.goatsPlaced,
    goatsCaptured: baghGame.goatsCaptured
  });
  if (baghGame.history.length > 25) baghGame.history.shift();
}

function undoBaghMove() {
  if (baghGame.history.length <= 1) {
    showToast(currentLang === 'ne' ? 'फिर्ता गर्न चाल छैन' : 'No move to undo');
    return;
  }
  baghGame.history.pop(); // Remove current state
  const prev = baghGame.history[baghGame.history.length - 1];

  baghGame.board = [...prev.board];
  baghGame.turn = prev.turn;
  baghGame.phase = prev.phase;
  baghGame.goatsPlaced = prev.goatsPlaced;
  baghGame.goatsCaptured = prev.goatsCaptured;
  baghGame.selectedPos = null;
  baghGame.validMoves = [];

  updateBaghStats();
  drawBaghBoard();
  playSound('pop');
  showToast(currentLang === 'ne' ? '१ चाल फिर्ता भयो' : '1 move undone');
}

function getTigerMoves(pos) {
  const moves = [];
  const r = Math.floor(pos / 5);
  const c = pos % 5;
  const adj = getAdjNeighbors(pos);

  // 1. Regular 1-step moves to empty adjacent positions
  for (let n of adj) {
    if (baghGame.board[n] === null) {
      moves.push({ to: n, jump: null });
    }
  }

  // 2. Jumps over a goat along valid lines
  for (let n of adj) {
    if (baghGame.board[n] === 'G') {
      const nr = Math.floor(n / 5);
      const nc = n % 5;
      const dr = nr - r;
      const dc = nc - c;

      const destR = nr + dr;
      const destC = nc + dc;

      if (destR >= 0 && destR < 5 && destC >= 0 && destC < 5) {
        const destPos = destR * 5 + destC;
        if (baghGame.board[destPos] === null) {
          moves.push({ to: destPos, jump: n });
        }
      }
    }
  }
  return moves;
}

// Mobile-Optimized Pointerdown Touch Handler
function handleBaghBoardClick(event) {
  const canvas = document.getElementById('baghCanvas');
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const clientX = event.clientX || (event.touches && event.touches[0].clientX);
  const clientY = event.clientY || (event.touches && event.touches[0].clientY);

  const x = (clientX - rect.left) * scaleX;
  const y = (clientY - rect.top) * scaleY;

  const pad = 36;
  const step = (canvas.width - pad * 2) / 4;

  let clickedPos = null;
  let minDist = step * 0.45;

  for (let i = 0; i < 25; i++) {
    const r = Math.floor(i / 5);
    const c = i % 5;
    const px = pad + c * step;
    const py = pad + r * step;
    const dist = Math.hypot(x - px, y - py);
    if (dist < minDist) {
      clickedPos = i;
      minDist = dist;
    }
  }

  if (clickedPos === null) return;

  if (baghGame.turn === 'goat') {
    handleGoatClick(clickedPos);
  } else if (baghGame.turn === 'tiger') {
    handleTigerClick(clickedPos);
  }
}

function handleGoatClick(pos) {
  if (baghGame.phase === 'placing') {
    if (baghGame.board[pos] === null) {
      baghGame.board[pos] = 'G';
      baghGame.goatsPlaced++;
      playSound('pop');
      if (baghGame.goatsPlaced >= 20) {
        baghGame.phase = 'moving';
      }
      endTurn('tiger');
    }
  } else {
    if (baghGame.selectedPos === null) {
      if (baghGame.board[pos] === 'G') {
        baghGame.selectedPos = pos;
        baghGame.validMoves = getAdjNeighbors(pos).filter(n => baghGame.board[n] === null);
        drawBaghBoard();
        playSound('pop');
      }
    } else {
      if (pos === baghGame.selectedPos) {
        baghGame.selectedPos = null;
        baghGame.validMoves = [];
        drawBaghBoard();
      } else if (baghGame.validMoves.includes(pos)) {
        baghGame.board[baghGame.selectedPos] = null;
        baghGame.board[pos] = 'G';
        baghGame.selectedPos = null;
        baghGame.validMoves = [];
        playSound('pop');
        endTurn('tiger');
      } else if (baghGame.board[pos] === 'G') {
        baghGame.selectedPos = pos;
        baghGame.validMoves = getAdjNeighbors(pos).filter(n => baghGame.board[n] === null);
        drawBaghBoard();
      }
    }
  }
}

function handleTigerClick(pos) {
  if (baghGame.selectedPos === null) {
    if (baghGame.board[pos] === 'T') {
      baghGame.selectedPos = pos;
      baghGame.validMoves = getTigerMoves(pos);
      drawBaghBoard();
      playSound('pop');
    }
  } else {
    if (pos === baghGame.selectedPos) {
      baghGame.selectedPos = null;
      baghGame.validMoves = [];
      drawBaghBoard();
    } else {
      const match = baghGame.validMoves.find(m => m.to === pos);
      if (match) {
        baghGame.board[baghGame.selectedPos] = null;
        baghGame.board[pos] = 'T';

        if (match.jump !== null) {
          baghGame.board[match.jump] = null;
          baghGame.goatsCaptured++;
          playSound('roar');
        } else {
          playSound('pop');
        }

        baghGame.selectedPos = null;
        baghGame.validMoves = [];
        endTurn('goat');
      } else if (baghGame.board[pos] === 'T') {
        baghGame.selectedPos = pos;
        baghGame.validMoves = getTigerMoves(pos);
        drawBaghBoard();
      }
    }
  }
}

function endTurn(nextTurn) {
  recordBaghHistory();
  baghGame.turn = nextTurn;
  updateBaghStats();
  drawBaghBoard();

  if (baghGame.goatsCaptured >= 5) {
    setTimeout(() => {
      showToast(currentLang === 'ne' ? 'बाघको जीत भयो! (५ बाख्रा खाइयो) 🐯' : 'Tigers Win! (5 goats captured) 🐯');
    }, 200);
    return;
  }

  const trappedTigers = getTrappedTigersCount();
  if (trappedTigers === 4) {
    setTimeout(() => {
      showToast(currentLang === 'ne' ? 'बाख्राको जीत भयो! (सबै बाघ थुनिए) 🐐' : 'Goats Win! (All 4 tigers trapped) 🐐');
    }, 200);
    return;
  }

  if (baghGame.mode === 'vs_tiger_bot' && baghGame.turn === 'tiger') {
    setTimeout(makeTigerBotMove, 450);
  } else if (baghGame.mode === 'vs_goat_bot' && baghGame.turn === 'goat') {
    setTimeout(makeGoatBotMove, 450);
  }
}

function makeTigerBotMove() {
  const tigers = [];
  for (let i = 0; i < 25; i++) {
    if (baghGame.board[i] === 'T') tigers.push(i);
  }

  let jumpMoves = [];
  for (let tPos of tigers) {
    const moves = getTigerMoves(tPos);
    for (let m of moves) {
      if (m.jump !== null) {
        jumpMoves.push({ from: tPos, ...m });
      }
    }
  }

  if (jumpMoves.length > 0) {
    const choice = jumpMoves[Math.floor(Math.random() * jumpMoves.length)];
    baghGame.board[choice.from] = null;
    baghGame.board[choice.to] = 'T';
    baghGame.board[choice.jump] = null;
    baghGame.goatsCaptured++;
    playSound('roar');
    endTurn('goat');
    return;
  }

  let regMoves = [];
  for (let tPos of tigers) {
    const moves = getTigerMoves(tPos);
    for (let m of moves) {
      if (m.jump === null) {
        regMoves.push({ from: tPos, ...m });
      }
    }
  }

  if (regMoves.length > 0) {
    const choice = regMoves[Math.floor(Math.random() * regMoves.length)];
    baghGame.board[choice.from] = null;
    baghGame.board[choice.to] = 'T';
    playSound('pop');
    endTurn('goat');
  } else {
    endTurn('goat');
  }
}

function makeGoatBotMove() {
  if (baghGame.phase === 'placing') {
    const empties = [];
    for (let i = 0; i < 25; i++) {
      if (baghGame.board[i] === null) empties.push(i);
    }
    if (empties.length > 0) {
      const choice = empties[Math.floor(Math.random() * empties.length)];
      baghGame.board[choice] = 'G';
      baghGame.goatsPlaced++;
      playSound('pop');
      if (baghGame.goatsPlaced >= 20) {
        baghGame.phase = 'moving';
      }
      endTurn('tiger');
    }
  } else {
    const goats = [];
    for (let i = 0; i < 25; i++) {
      if (baghGame.board[i] === 'G') goats.push(i);
    }

    const availableMoves = [];
    for (let gPos of goats) {
      const emptyNeighbors = getAdjNeighbors(gPos).filter(n => baghGame.board[n] === null);
      for (let n of emptyNeighbors) {
        availableMoves.push({ from: gPos, to: n });
      }
    }

    if (availableMoves.length > 0) {
      const choice = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      baghGame.board[choice.from] = null;
      baghGame.board[choice.to] = 'G';
      playSound('pop');
      endTurn('tiger');
    }
  }
}

function getTrappedTigersCount() {
  let trapped = 0;
  for (let i = 0; i < 25; i++) {
    if (baghGame.board[i] === 'T') {
      const moves = getTigerMoves(i);
      if (moves.length === 0) trapped++;
    }
  }
  return trapped;
}

function updateBaghStats() {
  const turnEl = document.getElementById('baghStatus') || document.getElementById('baghTurnText');
  const inHandEl = document.getElementById('baghInHand') || document.getElementById('baghGoatsInHand');
  const capturedEl = document.getElementById('baghCaptured') || document.getElementById('baghGoatsCaptured');
  const trappedEl = document.getElementById('baghTrapped') || document.getElementById('baghTigersTrapped');

  const inHand = 20 - baghGame.goatsPlaced;
  const captured = baghGame.goatsCaptured;
  const trapped = getTrappedTigersCount();

  if (inHandEl) inHandEl.innerText = currentLang === 'ne' ? toDevanagariDigits(inHand) : inHand;
  if (capturedEl) capturedEl.innerText = currentLang === 'ne' ? `${toDevanagariDigits(captured)} / ५` : `${captured} / 5`;
  if (trappedEl) trappedEl.innerText = currentLang === 'ne' ? `${toDevanagariDigits(trapped)} / ४` : `${trapped} / 4`;

  if (turnEl) {
    if (baghGame.turn === 'goat') {
      turnEl.innerText = currentLang === 'ne' ? 'बाख्राको पालो (Goat\'s Turn)' : 'Goat\'s Turn';
      turnEl.className = 'text-xs font-bold text-emerald-600 dark:text-emerald-400';
    } else {
      turnEl.innerText = currentLang === 'ne' ? 'बाघको पालो (Tiger\'s Turn)' : 'Tiger\'s Turn';
      turnEl.className = 'text-xs font-bold text-amber-600 dark:text-amber-400';
    }
  }
}

function drawBaghBoard() {
  const canvas = document.getElementById('baghCanvas');
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const size = Math.min(rect.width || 320, 360);

  canvas.width = size * dpr;
  canvas.height = size * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const pad = 36;
  const step = (size - pad * 2) / 4;

  ctx.clearRect(0, 0, size, size);

  ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#18181b' : '#fafaf9';
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = document.documentElement.classList.contains('dark') ? '#3f3f46' : '#a8a29e';
  ctx.lineWidth = 2.5;

  for (let i = 0; i < 5; i++) {
    const pos = pad + i * step;
    ctx.beginPath();
    ctx.moveTo(pad, pos);
    ctx.lineTo(size - pad, pos);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(pos, pad);
    ctx.lineTo(pos, size - pad);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.moveTo(pad, pad);
  ctx.lineTo(size - pad, size - pad);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(size - pad, pad);
  ctx.lineTo(pad, size - pad);
  ctx.stroke();

  const mid = pad + 2 * step;
  ctx.beginPath();
  ctx.moveTo(mid, pad);
  ctx.lineTo(size - pad, mid);
  ctx.lineTo(mid, size - pad);
  ctx.lineTo(pad, mid);
  ctx.closePath();
  ctx.stroke();

  const corners = [
    [pad, pad + step], [pad + step, pad],
    [size - pad - step, pad], [size - pad, pad + step],
    [size - pad, size - pad - step], [size - pad - step, size - pad],
    [pad + step, size - pad], [pad, size - pad - step]
  ];
  for (let i = 0; i < 8; i += 2) {
    ctx.beginPath();
    ctx.moveTo(corners[i][0], corners[i][1]);
    ctx.lineTo(corners[i + 1][0], corners[i + 1][1]);
    ctx.stroke();
  }

  if (baghGame.validMoves.length > 0) {
    ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
    for (let mv of baghGame.validMoves) {
      const targetPos = typeof mv === 'number' ? mv : mv.to;
      const r = Math.floor(targetPos / 5);
      const c = targetPos % 5;
      const px = pad + c * step;
      const py = pad + r * step;
      ctx.beginPath();
      ctx.arc(px, py, step * 0.28, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < 25; i++) {
    const r = Math.floor(i / 5);
    const c = i % 5;
    const px = pad + c * step;
    const py = pad + r * step;

    const piece = baghGame.board[i];
    const isSelected = (baghGame.selectedPos === i);

    if (isSelected) {
      ctx.fillStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.beginPath();
      ctx.arc(px, py, step * 0.38, 0, Math.PI * 2);
      ctx.fill();
    }

    if (piece === 'T') {
      ctx.font = `${Math.floor(step * 0.65)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐯', px, py + 1);
    } else if (piece === 'G') {
      ctx.font = `${Math.floor(step * 0.62)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐐', px, py + 1);
    } else {
      ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#52525b' : '#d6d3d1';
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// ---------------------------------------------------------------------
// 8. CASUAL GAME: SNAKES & LADDERS / LUDO DICE ROLLER
// ---------------------------------------------------------------------
let diceScore = 6;
function rollDice() {
  const cube = document.getElementById('diceFace') || document.getElementById('diceCubeDisplay');
  if (!cube) return;

  cube.classList.add('animate-bounce');
  playSound('pop');

  let rolls = 0;
  const interval = setInterval(() => {
    rolls++;
    const temp = Math.floor(Math.random() * 6) + 1;
    cube.innerText = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][temp - 1];
    if (rolls > 8) {
      clearInterval(interval);
      cube.classList.remove('animate-bounce');
      diceScore = Math.floor(Math.random() * 6) + 1;
      cube.innerText = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][diceScore - 1];
      const resultText = document.getElementById('diceResultText');
      if (resultText) {
        resultText.innerText = currentLang === 'ne' 
          ? `पासा पर्यो: ${toDevanagariDigits(diceScore)}!` 
          : `Rolled: ${diceScore}!`;
      } else {
        showToast(currentLang === 'ne' ? `पासा पर्यो: ${toDevanagariDigits(diceScore)}! 🎲` : `Rolled: ${diceScore}! 🎲`);
      }
      playSound('coin');
    }
  }, 75);
}

// ---------------------------------------------------------------------
// 9. SHOPPING & ESSENTIALS
// ---------------------------------------------------------------------
const defaultQuickAddItems = [
  { id: 'qa-1', name: 'चामल', enName: 'Rice', cat: 'किराना' },
  { id: 'qa-2', name: 'दाल', enName: 'Daal', cat: 'किराना' },
  { id: 'qa-3', name: 'तोरीको तेल', enName: 'Oil', cat: 'किराना' },
  { id: 'qa-4', name: 'दूध', enName: 'Milk', cat: 'डेरी र दूध' },
  { id: 'qa-5', name: 'आलु', enName: 'Potato', cat: 'तरकारी र फलफूल' },
  { id: 'qa-6', name: 'प्याज', enName: 'Onion', cat: 'तरकारी र फलफूल' },
  { id: 'qa-7', name: 'चियापत्ती', enName: 'Tea', cat: 'किराना' },
  { id: 'qa-8', name: 'चिउरा', enName: 'Chiura', cat: 'किराना' },
  { id: 'qa-9', name: 'साबुन र सरफ', enName: 'Soap & Powder', cat: 'सरसफाइ' }
];

function getQuickAddItems() {
  if (!state.quickAddItems || !Array.isArray(state.quickAddItems) || state.quickAddItems.length === 0) {
    state.quickAddItems = JSON.parse(JSON.stringify(defaultQuickAddItems));
    saveState();
  }
  return state.quickAddItems;
}

function renderQuickAddTray() {
  const container = document.getElementById('quickAddContainer');
  if (!container) return;

  const items = getQuickAddItems();
  container.innerHTML = items.map(item => {
    const label = currentLang === 'ne' ? item.name : (item.enName || item.name);
    return `
      <button type="button" onclick="quickAddShopping('${escapeHtml(label)}', '${escapeHtml(item.cat || 'किराना')}')" 
              class="px-2.5 py-1 bg-white dark:bg-[#18202d] border border-slate-200 dark:border-[#283347] hover:border-emerald-500 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition shadow-2xs active:scale-95">
        + ${escapeHtml(label)}
      </button>
    `;
  }).join('');
}

function openQuickAddModal() {
  const modal = document.getElementById('quickAddModal');
  if (!modal) return;
  modal.classList.remove('hidden');

  const catSelect = document.getElementById('quickAddItemCat');
  if (catSelect) {
    const categories = [
      { ne: 'किराना', en: 'Groceries' },
      { ne: 'तरकारी र फलफूल', en: 'Veggies & Fruits' },
      { ne: 'डेरी र दूध', en: 'Dairy & Milk' },
      { ne: 'खाजा र बेकरी', en: 'Bakery & Snacks' },
      { ne: 'मासु र माछा', en: 'Meat & Fish' },
      { ne: 'सरसफाइ', en: 'Cleaning' },
      { ne: 'औषधि', en: 'Pharmacy' },
      { ne: 'अन्य', en: 'Other' }
    ];
    catSelect.innerHTML = categories.map(c => `
      <option value="${c.ne}">${currentLang === 'ne' ? c.ne : c.en}</option>
    `).join('');
  }

  renderQuickAddModalChips();
}

function closeQuickAddModal() {
  const modal = document.getElementById('quickAddModal');
  if (modal) modal.classList.add('hidden');
}

function renderQuickAddModalChips() {
  const chipsContainer = document.getElementById('quickAddModalChips');
  if (!chipsContainer) return;

  const items = getQuickAddItems();
  if (items.length === 0) {
    chipsContainer.innerHTML = `<span class="text-xs text-slate-400 py-1">${currentLang === 'ne' ? 'कुनै सामान छैन, माथिबाट नयाँ थप्नुहोस्' : 'No items. Add new above'}</span>`;
    return;
  }

  chipsContainer.innerHTML = items.map(it => {
    const label = currentLang === 'ne' ? it.name : (it.enName || it.name);
    return `
      <div class="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-slate-100 dark:bg-[#111722] border border-slate-200 dark:border-[#334158] rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200">
        <span>${escapeHtml(label)}</span>
        <button type="button" onclick="deleteQuickAddItem('${it.id}')" class="text-slate-400 hover:text-rose-500 font-black p-0.5 ml-0.5 transition" title="Delete">✕</button>
      </div>
    `;
  }).join('');
}

function addCustomQuickAddItem(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('quickAddItemInput');
  const catSelect = document.getElementById('quickAddItemCat');
  if (!input || !input.value.trim()) return;

  const name = input.value.trim();
  const cat = catSelect ? catSelect.value : 'किराना';
  const items = getQuickAddItems();

  items.push({
    id: 'qa-' + Date.now(),
    name: name,
    enName: name,
    cat: cat
  });

  saveState();
  playSound('coin');
  input.value = '';
  renderQuickAddModalChips();
  renderQuickAddTray();
  showToast(currentLang === 'ne' ? '१-ट्याप सामान थपियो' : 'Quick add item added');
}

function deleteQuickAddItem(id) {
  state.quickAddItems = getQuickAddItems().filter(i => String(i.id) !== String(id));
  saveState();
  playSound('pop');
  renderQuickAddModalChips();
  renderQuickAddTray();
  showToast(currentLang === 'ne' ? 'सामान हटाइयो' : 'Item removed');
}

function resetQuickAddDefaults() {
  requestConfirm(
    currentLang === 'ne' ? 'पूर्वनिर्धारित रिसेट गर्ने?' : 'Reset to Defaults?',
    currentLang === 'ne' ? 'सबै १-ट्याप सामानहरू सुरुको अवस्थामा फर्कनेछन्।' : 'All quick-add items will be restored to initial defaults.',
    () => {
      state.quickAddItems = JSON.parse(JSON.stringify(defaultQuickAddItems));
      saveState();
      playSound('magic');
      renderQuickAddModalChips();
      renderQuickAddTray();
      showToast(currentLang === 'ne' ? 'सुरुको सामान सूची रिसेट भयो' : 'Default essentials restored');
    }
  );
}

function populateCategoryDropdowns() {
  const shopCat = document.getElementById('shopItemCat');
  const expCat = document.getElementById('expCategory');

  const categories = [
    { key: 'catGrocery', ne: 'किराना', en: 'Groceries' },
    { key: 'catVeggies', ne: 'तरकारी र फलफूल', en: 'Veggies & Fruits' },
    { key: 'catDairy', ne: 'डेरी र दूध', en: 'Dairy & Milk' },
    { key: 'catBakery', ne: 'खाजा र बेकरी', en: 'Bakery & Snacks' },
    { key: 'catMeat', ne: 'मासु र माछा', en: 'Meat & Fish' },
    { key: 'catCleaning', ne: 'सरसफाइ', en: 'Cleaning' },
    { key: 'catPharmacy', ne: 'औषधि', en: 'Pharmacy' },
    { key: 'catBills', ne: 'इन्टरनेट/बिजुली', en: 'Bills & Utilities' },
    { key: 'catTravel', ne: 'गाडीभाडा/पेट्रोल', en: 'Travel & Fuel' },
    { key: 'catOther', ne: 'अन्य', en: 'Other' }
  ];

  const html = categories.map(c => {
    const label = currentLang === 'ne' ? c.ne : c.en;
    return `<option value="${c.ne}">${label}</option>`;
  }).join('');

  if (shopCat) shopCat.innerHTML = html;
  if (expCat) expCat.innerHTML = html;
}

function renderShopping() {
  const container = document.getElementById('shoppingListContainer');
  const badge = document.getElementById('shoppingCountBadge');
  if (!container) return;

  renderQuickAddTray();
  populateCategoryDropdowns();

  const pending = state.shopping.filter(i => !i.done);
  const completed = state.shopping.filter(i => i.done);

  if (badge) {
    const count = pending.length;
    badge.innerText = currentLang === 'ne' 
      ? `${toDevanagariDigits(count)} बाँकी` 
      : `${count} pending`;
  }

  if (state.shopping.length === 0) {
    container.innerHTML = `
      <div class="py-8 text-center text-xs text-slate-400 dark:text-zinc-500 font-medium">
        ${t('emptyShopping').replace(/\n/g, '<br>')}
      </div>
    `;
    return;
  }

  let html = '';

  if (pending.length > 0) {
    html += `<div class="space-y-2">`;
    pending.forEach(item => {
      html += `
        <div class="p-3 bg-white dark:bg-[#18202d] border border-slate-200 dark:border-[#283347] rounded-2xl flex items-center justify-between gap-2 shadow-2xs transition">
          <div class="flex items-center space-x-3 min-w-0">
            <button onclick="toggleShoppingItem(${item.id})" class="w-6 h-6 flex-shrink-0 rounded-lg border-2 border-slate-300 dark:border-[#334158] hover:border-emerald-500 flex items-center justify-center transition">
            </button>
            <div class="min-w-0">
              <span class="text-xs font-bold text-slate-900 dark:text-slate-100 truncate block">${escapeHtml(item.name)}</span>
              <span class="text-[10px] text-slate-500 dark:text-slate-300 font-medium">${escapeHtml(item.category)} ${item.qty ? '• ' + escapeHtml(item.qty) : ''}</span>
            </div>
          </div>
          <button onclick="deleteShoppingItem(${item.id})" class="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg">
            ✕
          </button>
        </div>
      `;
    });
    html += `</div>`;
  }

  if (completed.length > 0) {
    html += `
      <div class="pt-4 space-y-2">
        <div class="flex items-center justify-between px-1">
          <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">${t('completedHeader')} (${completed.length})</span>
          <button onclick="clearCompletedShopping()" class="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline">
            ${t('clearBtn')}
          </button>
        </div>
        <div class="space-y-1.5 opacity-60">
    `;
    completed.forEach(item => {
      html += `
        <div class="p-2.5 bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-[#283347] rounded-xl flex items-center justify-between gap-2">
          <div class="flex items-center space-x-2.5 min-w-0">
            <button onclick="toggleShoppingItem(${item.id})" class="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
              ✓
            </button>
            <span class="text-xs line-through text-slate-500 dark:text-slate-400 truncate">${escapeHtml(item.name)}</span>
          </div>
          <button onclick="deleteShoppingItem(${item.id})" class="text-slate-400 hover:text-rose-500 text-xs">✕</button>
        </div>
      `;
    });
    html += `</div></div>`;
  }

  container.innerHTML = html;
}

function addShoppingItem(e) {
  if (e) e.preventDefault();
  const nameInput = document.getElementById('shopItemInput');
  const qtyInput = document.getElementById('shopItemQty');
  const catInput = document.getElementById('shopItemCat');

  const name = nameInput.value.trim();
  if (!name) return;

  state.shopping.unshift({
    id: Date.now(),
    name: name,
    category: catInput ? catInput.value : 'किराना',
    qty: qtyInput ? qtyInput.value.trim() : '',
    done: false
  });

  saveState();
  renderShopping();
  petCelebrate('shopping');

  nameInput.value = '';
  if (qtyInput) qtyInput.value = '';
  showToast(currentLang === 'ne' ? 'सूचीमा थपियो' : 'Item added');
}

function quickAddShopping(name, category) {
  state.shopping.unshift({
    id: Date.now(),
    name: name,
    category: category,
    qty: '',
    done: false
  });
  saveState();
  renderShopping();
  petCelebrate('shopping');
  showToast(currentLang === 'ne' ? `${name} थपियो` : `Added ${name}`);
}

function toggleShoppingItem(id) {
  const item = state.shopping.find(i => i.id === id);
  if (item) {
    item.done = !item.done;
    saveState();
    renderShopping();
    if (item.done) {
      petCelebrate('shopping');
    } else {
      playSound('pop');
    }
  }
}

function deleteShoppingItem(id) {
  requestConfirm(
    currentLang === 'ne' ? 'सामान हटाउने?' : 'Delete Item?',
    currentLang === 'ne' ? 'यो सामान किनमेल सूचीबाट हट्नेछ।' : 'This item will be removed from your shopping list.',
    () => {
      state.shopping = state.shopping.filter(i => i.id !== id);
      saveState();
      renderShopping();
      playSound('pop');
    }
  );
}

function clearCompletedShopping() {
  const doneCount = state.shopping.filter(i => i.done).length;
  if (doneCount === 0) return;

  requestConfirm(
    currentLang === 'ne' ? 'किनिसकेका सामान हटाउने?' : 'Clear Completed Items?',
    currentLang === 'ne' ? `किनिसकिएका ${toDevanagariDigits(doneCount)} वटा सामान सूचीबाट हट्नेछन्।` : `All ${doneCount} completed items will be removed.`,
    () => {
      state.shopping = state.shopping.filter(i => !i.done);
      saveState();
      renderShopping();
      playSound('pop');
      showToast(currentLang === 'ne' ? 'सामानहरू हटाइयो' : 'Completed items cleared');
    }
  );
}

function copyShoppingList() {
  const pending = state.shopping.filter(i => !i.done);
  if (pending.length === 0) {
    showToast(currentLang === 'ne' ? 'सूची खाली छ' : 'Shopping list is empty');
    return;
  }

  const lines = pending.map((item, idx) => {
    const num = currentLang === 'ne' ? toDevanagariDigits(idx + 1) : (idx + 1);
    return `${num}. ${item.name}${item.qty ? ' - ' + item.qty : ''}`;
  });
  const header = currentLang === 'ne' ? '🛒 घरको किनमेल सूची (सँगालो):\n' : '🛒 Household Shopping List (Sangalo):\n';
  const text = header + lines.join('\n');

  copyToClipboard(text, currentLang === 'ne' ? 'सूची कपी भयो! (SMS, Viber, WhatsApp मा पेस्ट गर्नुहोस्)' : 'Shopping list copied to clipboard!');
}

// ---------------------------------------------------------------------
// 10. BUDGET, SUGGESTION CHIPS & BORROW/LEND TRACKER
// ---------------------------------------------------------------------
function renderBudget() {
  const container = document.getElementById('expenseListContainer');
  const totalSpentEl = document.getElementById('budgetTotalSpent');
  const limitEl = document.getElementById('budgetLimitText');
  const pctEl = document.getElementById('budgetPctText');
  const barEl = document.getElementById('budgetProgressBar');
  if (!container) return;

  const expenses = state.budget.expenses || [];
  const totalSpent = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const limit = state.budget.monthlyLimit || 30000;
  const pct = Math.min(100, Math.round((totalSpent / limit) * 100));

  if (totalSpentEl) {
    const formatted = totalSpent.toLocaleString('en-IN');
    totalSpentEl.innerText = currentLang === 'ne' ? `रू ${toDevanagariDigits(formatted)}` : `Rs. ${formatted}`;
  }

  if (limitEl) {
    const limitFormatted = limit.toLocaleString('en-IN');
    limitEl.innerText = currentLang === 'ne' 
      ? `लक्ष्य: रू ${toDevanagariDigits(limitFormatted)}` 
      : `Target: Rs. ${limitFormatted}`;
  }

  if (pctEl) {
    pctEl.innerText = currentLang === 'ne' ? `${toDevanagariDigits(pct)}%` : `${pct}%`;
  }

  if (barEl) {
    barEl.style.width = `${pct}%`;
    if (pct > 90) barEl.className = 'bg-rose-500 h-2.5 rounded-full transition-all duration-300';
    else if (pct > 70) barEl.className = 'bg-amber-500 h-2.5 rounded-full transition-all duration-300';
    else barEl.className = 'bg-emerald-500 h-2.5 rounded-full transition-all duration-300';
  }

  if (expenses.length === 0) {
    container.innerHTML = `
      <div class="py-6 text-center text-xs text-slate-400 dark:text-zinc-500 font-medium">
        ${t('emptyExpenses').replace(/\n/g, '<br>')}
      </div>
    `;
    return;
  }

  container.innerHTML = expenses.map(e => {
    const amtFormatted = (e.amount || 0).toLocaleString('en-IN');
    const displayAmt = currentLang === 'ne' ? `रू ${toDevanagariDigits(amtFormatted)}` : `Rs. ${amtFormatted}`;

    return `
      <div class="p-3.5 bg-white dark:bg-[#18202d] border border-slate-200 dark:border-[#283347] rounded-2xl flex items-center justify-between shadow-2xs">
        <div class="space-y-0.5">
          <div class="flex items-center space-x-2">
            <span class="text-xs font-bold text-slate-900 dark:text-slate-100">${escapeHtml(e.category)}</span>
            ${e.payer ? `<span class="px-1.5 py-0.2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded text-[9px] font-bold">${escapeHtml(e.payer)}</span>` : ''}
          </div>
          <div class="text-[11px] text-slate-600 dark:text-slate-300">
            ${escapeHtml(e.note || '')} <span class="text-[10px] text-slate-400 dark:text-slate-400">• ${escapeHtml(e.date || '')}</span>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-xs font-extrabold text-slate-900 dark:text-slate-100">${displayAmt}</span>
          <button onclick="deleteExpense(${e.id})" class="p-1 text-slate-400 hover:text-rose-500 text-xs">✕</button>
        </div>
      </div>
    `;
  }).join('');
}

function selectExpCat(catName) {
  const select = document.getElementById('expCategory');
  if (!select) return;

  for (let i = 0; i < select.options.length; i++) {
    if (select.options[i].value.includes(catName) || select.options[i].text.includes(catName)) {
      select.selectedIndex = i;
      break;
    }
  }
  showToast(currentLang === 'ne' ? `वर्ग: ${catName}` : `Category: ${catName}`);
}

function setExpPayer(payerName) {
  const payerInput = document.getElementById('expPayer');
  if (payerInput) {
    payerInput.value = payerName;
    showToast(currentLang === 'ne' ? `खर्च गर्ने: ${payerName}` : `Paid by: ${payerName}`);
  }
}

function addExpense(e) {
  if (e) e.preventDefault();
  const amtInput = document.getElementById('expAmount');
  const catInput = document.getElementById('expCategory');
  const payerInput = document.getElementById('expPayer');
  const noteInput = document.getElementById('expNote');

  const amount = parseFloat(amtInput.value);
  if (!amount || amount <= 0) return;

  const todayBs = getBikramSambatDate();
  const dateStr = `${todayBs.year}-${todayBs.month}-${todayBs.day}`;

  const newExp = {
    id: Date.now(),
    amount: amount,
    category: catInput ? catInput.value : 'किराना',
    payer: payerInput ? payerInput.value.trim() : '',
    note: noteInput ? noteInput.value.trim() : '',
    date: dateStr
  };

  state.budget.expenses.unshift(newExp);
  saveState();
  renderBudget();
  petCelebrate('money');

  amtInput.value = '';
  if (noteInput) noteInput.value = '';
  showToast(currentLang === 'ne' ? 'खर्च सुरक्षित भयो' : 'Expense recorded');
}

function deleteExpense(id) {
  requestConfirm(
    currentLang === 'ne' ? 'खर्च हटाउने?' : 'Delete Expense?',
    currentLang === 'ne' ? 'यो खर्च विवरण सधैंका लागि हट्नेछ।' : 'This expense record will be permanently deleted.',
    () => {
      state.budget.expenses = state.budget.expenses.filter(e => e.id !== id);
      saveState();
      renderBudget();
      playSound('pop');
      showToast(currentLang === 'ne' ? 'खर्च हटाइयो' : 'Expense deleted');
    }
  );
}

function setBudgetLimit() {
  const promptText = currentLang === 'ne' ? 'यो महिनाको कुल बजेट लक्ष्य (रू):' : 'Monthly spending target limit (Rs.):';
  const val = prompt(promptText, state.budget.monthlyLimit || 30000);
  if (val) {
    const num = parseFloat(val);
    if (num > 0) {
      state.budget.monthlyLimit = num;
      saveState();
      renderBudget();
      showToast(currentLang === 'ne' ? 'बजेट लक्ष्य परिवर्तन भयो' : 'Budget target updated');
    }
  }
}

function calculateBillSplit() {
  const amount = parseFloat(document.getElementById('splitAmount').value);
  const people = parseInt(document.getElementById('splitPeople').value);
  const resultBox = document.getElementById('splitResult');

  if (!amount || !people || people <= 0) {
    resultBox.innerHTML = '';
    return;
  }

  const perPerson = Math.ceil(amount / people);
  const formatted = perPerson.toLocaleString('en-IN');
  const display = currentLang === 'ne' ? `रू ${toDevanagariDigits(formatted)}` : `Rs. ${formatted}`;

  resultBox.innerHTML = `
    <div class="mt-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-center text-xs font-bold text-emerald-800 dark:text-emerald-300">
      ${currentLang === 'ne' ? `प्रति व्यक्ति हिसाब: ${display}` : `Each person pays: ${display}`}
    </div>
  `;
}

// ---------------------------------------------------------------------
// 10.1 BORROW & LEND TRACKER ENGINE (सापटी तथा लेनदेन हिसाब)
// ---------------------------------------------------------------------
function setSplitSubTab(tab) {
  const btnEqual = document.getElementById('splitTabBtn-equal');
  const btnBorrow = document.getElementById('splitTabBtn-borrow');
  const viewEqual = document.getElementById('subView-split-equal');
  const viewBorrow = document.getElementById('subView-split-borrow');

  if (tab === 'equal') {
    if (btnEqual) btnEqual.className = 'flex-1 py-1.5 rounded-lg bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 shadow-2xs transition';
    if (btnBorrow) btnBorrow.className = 'flex-1 py-1.5 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-slate-900 transition';
    if (viewEqual) viewEqual.classList.remove('hidden');
    if (viewBorrow) viewBorrow.classList.add('hidden');
  } else {
    if (btnBorrow) btnBorrow.className = 'flex-1 py-1.5 rounded-lg bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 shadow-2xs transition';
    if (btnEqual) btnEqual.className = 'flex-1 py-1.5 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-slate-900 transition';
    if (viewEqual) viewEqual.classList.add('hidden');
    if (viewBorrow) viewBorrow.classList.remove('hidden');
    renderBorrowLend();
  }
}

function renderBorrowLend() {
  const list = document.getElementById('borrowLendList');
  const lentEl = document.getElementById('borrowTotalLent');
  const borrowedEl = document.getElementById('borrowTotalBorrowed');
  if (!state.borrowLend) state.borrowLend = [];

  let totalLent = 0;
  let totalBorrowed = 0;

  state.borrowLend.forEach(item => {
    if (!item.settled) {
      if (item.type === 'lent') totalLent += (item.amount || 0);
      else totalBorrowed += (item.amount || 0);
    }
  });

  if (lentEl) {
    const formatted = totalLent.toLocaleString('en-IN');
    lentEl.innerText = currentLang === 'ne' ? `रू ${toDevanagariDigits(formatted)}` : `Rs. ${formatted}`;
  }
  if (borrowedEl) {
    const formatted = totalBorrowed.toLocaleString('en-IN');
    borrowedEl.innerText = currentLang === 'ne' ? `रू ${toDevanagariDigits(formatted)}` : `Rs. ${formatted}`;
  }

  if (!list) return;

  if (state.borrowLend.length === 0) {
    list.innerHTML = `
      <div class="py-6 text-center text-xs text-slate-400 dark:text-zinc-500 font-medium">
        ${currentLang === 'ne' ? 'कुनै लेनदेन हिसाब दर्ता छैन।\nमाथि "+ नयाँ सापटी" थप्नुहोस्।' : 'No borrow/lend records.\nTap "+ New Record" above.'}
      </div>
    `;
    return;
  }

  list.innerHTML = state.borrowLend.map(item => {
    const isLent = item.type === 'lent';
    const typeLabel = isLent 
      ? (currentLang === 'ne' ? 'मैले दिएको (Lent)' : 'Lent (Owed to me)')
      : (currentLang === 'ne' ? 'मैले लिएको (Borrowed)' : 'Borrowed (I owe)');
    const typeBadgeClass = isLent 
      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800';
    
    const amtFormatted = (item.amount || 0).toLocaleString('en-IN');
    const amtDisplay = currentLang === 'ne' ? `रू ${toDevanagariDigits(amtFormatted)}` : `Rs. ${amtFormatted}`;
    const opacityClass = item.settled ? 'opacity-50' : '';

    return `
      <div class="p-3.5 bg-white dark:bg-[#18202d] border border-slate-200 dark:border-[#283347] rounded-xl space-y-2 shadow-2xs ${opacityClass}">
        <div class="flex items-start justify-between">
          <div class="space-y-0.5">
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold text-slate-900 dark:text-slate-100">${escapeHtml(item.name)}</span>
              <span class="px-1.5 py-0.5 rounded text-[9px] font-bold ${typeBadgeClass}">${typeLabel}</span>
            </div>
            ${item.note ? `<p class="text-[11px] text-slate-600 dark:text-slate-300">${escapeHtml(item.note)}</p>` : ''}
            <span class="text-[10px] text-slate-400 dark:text-slate-400">${escapeHtml(item.date || '')}</span>
          </div>
          <div class="text-right">
            <span class="text-sm font-extrabold ${isLent ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}">${amtDisplay}</span>
          </div>
        </div>
        <div class="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-[#283347] text-[11px]">
          <div>
            ${item.settled ? `
              <span class="text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
                <span>✓</span>
                <span>${currentLang === 'ne' ? 'फर्छ्यौट भइसक्यो (Settled)' : 'Settled'}</span>
              </span>
            ` : `
              <button onclick="toggleSettleBorrow(${item.id})" class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#111722] hover:bg-emerald-100 text-slate-700 dark:text-slate-200 border border-transparent dark:border-[#283347] font-semibold transition">
                ${currentLang === 'ne' ? 'फर्छ्यौट भयो (Mark Settled)' : 'Mark Settled'}
              </button>
            `}
          </div>
          <div class="flex items-center space-x-2">
            ${item.settled ? `
              <button onclick="toggleSettleBorrow(${item.id})" class="text-slate-400 hover:text-slate-200 text-[10px] underline">
                ${currentLang === 'ne' ? 'पुनः सक्रिय' : 'Reactivate'}
              </button>
            ` : ''}
            <button onclick="deleteBorrowItem(${item.id})" class="text-slate-400 hover:text-rose-600 p-1" title="Delete">
              🗑️
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openBorrowModal() {
  const modal = document.getElementById('borrowModal');
  document.getElementById('borrowNameInput').value = '';
  document.getElementById('borrowAmountInput').value = '';
  document.getElementById('borrowNoteInput').value = '';
  if (modal) modal.classList.remove('hidden');
}

function closeBorrowModal() {
  const modal = document.getElementById('borrowModal');
  if (modal) modal.classList.add('hidden');
}

function saveBorrowLend(e) {
  if (e) e.preventDefault();
  const name = document.getElementById('borrowNameInput').value.trim();
  const amount = parseFloat(document.getElementById('borrowAmountInput').value);
  const note = document.getElementById('borrowNoteInput').value.trim();
  const typeRadio = document.querySelector('input[name="borrowType"]:checked');
  const type = typeRadio ? typeRadio.value : 'lent';

  if (!name || !amount || amount <= 0) return;

  const bs = getBikramSambatDate();
  const dateStr = currentLang === 'ne' 
    ? `${toDevanagariDigits(bs.year)}-${toDevanagariDigits(bs.month)}-${toDevanagariDigits(bs.day)}`
    : `${bs.year}-${bs.month}-${bs.day}`;

  if (!state.borrowLend) state.borrowLend = [];
  state.borrowLend.unshift({
    id: Date.now(),
    type,
    name,
    amount,
    note,
    date: dateStr,
    settled: false
  });

  saveState();
  closeBorrowModal();
  renderBorrowLend();
  petCelebrate('money');
  showToast(currentLang === 'ne' ? 'सापटी हिसाब सुरक्षित भयो' : 'Borrow/lend record saved');
}

function toggleSettleBorrow(id) {
  const item = state.borrowLend.find(b => b.id === id);
  if (!item) return;
  item.settled = !item.settled;
  saveState();
  renderBorrowLend();
  if (item.settled) {
    playSound('chime');
    showToast(currentLang === 'ne' ? 'हिसाब फर्छ्यौट भयो! ✓' : 'Settlement completed! ✓');
  }
}

function deleteBorrowItem(id) {
  requestConfirm(
    currentLang === 'ne' ? 'सापटी हिसाब हटाउने?' : 'Delete Borrow Record?',
    currentLang === 'ne' ? 'यो लेनदेन विवरण सधैंका लागि हट्नेछ।' : 'This record will be permanently deleted.',
    () => {
      state.borrowLend = state.borrowLend.filter(b => b.id !== id);
      saveState();
      renderBorrowLend();
      showToast(currentLang === 'ne' ? 'सापटी हिसाब हटाइयो' : 'Record deleted');
    }
  );
}

// ---------------------------------------------------------------------
// 11. HEALTH (ICE), MEDICINE ROUTINE & MULTI-VEHICLE FLEET
// ---------------------------------------------------------------------
function renderHealthSection() {
  const h = state.health || {};
  document.getElementById('iceBloodType').value = h.bloodType || '';
  document.getElementById('iceAllergies').value = h.allergies || '';
  document.getElementById('iceConditions').value = h.conditions || '';
  document.getElementById('iceMeds').value = h.medications || '';
  document.getElementById('iceInsurance').value = h.insurance || '';
  document.getElementById('iceHospital').value = h.hospital || '';

  renderEmergencyContacts();
  renderMedicineRoutine();
}

function saveHealthField(field, val) {
  if (!state.health) state.health = {};
  state.health[field] = val.trim();
  saveState();
  showToast(currentLang === 'ne' ? 'स्वास्थ्य विवरण सेभ भयो' : 'Health card updated');
}

function copyEmergencySummary() {
  const h = state.health || {};
  const text = `🚨 ICE EMERGENCY HEALTH CARD 🚨
• Blood Group: ${h.bloodType || 'N/A'}
• Allergies: ${h.allergies || 'None'}
• Conditions: ${h.conditions || 'None'}
• Medications: ${h.medications || 'None'}
• Hospital: ${h.hospital || 'Bir Hospital'}
• Insurance: ${h.insurance || 'N/A'}`;

  copyToClipboard(text, currentLang === 'ne' ? 'आपतकालीन कार्ड कपी भयो!' : 'Emergency card copied!');
}

function renderEmergencyContacts() {
  const container = document.getElementById('iceContactsList');
  if (!container) return;

  const contacts = state.emergencyContacts || [];
  container.innerHTML = contacts.map(c => `
    <div class="p-3 bg-white dark:bg-[#18202d] border border-slate-200 dark:border-[#283347] rounded-xl flex items-center justify-between shadow-xs">
      <div>
        <div class="text-xs font-bold text-slate-900 dark:text-slate-100">${escapeHtml(c.name)}</div>
        <div class="text-[10px] text-slate-500 dark:text-slate-300 font-medium">${escapeHtml(c.relation || '')} • <a href="tel:${escapeHtml(c.phone)}" class="text-emerald-600 dark:text-emerald-400 font-mono font-bold hover:underline">${escapeHtml(c.phone)}</a></div>
      </div>
      <a href="tel:${escapeHtml(c.phone)}" class="p-2 bg-emerald-50 dark:bg-[#111722] border border-transparent dark:border-[#283347] text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 transition">
        📞
      </a>
    </div>
  `).join('');
}

function addEmergencyContact(e) {
  if (e) e.preventDefault();
  const name = document.getElementById('contactName').value.trim();
  const rel = document.getElementById('contactRelation').value.trim();
  const phone = document.getElementById('contactPhone').value.trim();

  if (!name || !phone) return;

  if (!state.emergencyContacts) state.emergencyContacts = [];
  state.emergencyContacts.push({ id: Date.now(), name, relation: rel, phone });
  saveState();
  renderEmergencyContacts();

  document.getElementById('contactName').value = '';
  document.getElementById('contactRelation').value = '';
  document.getElementById('contactPhone').value = '';
  showToast(currentLang === 'ne' ? 'सम्पर्क थपियो' : 'Contact added');
}

// ---------------------------------------------------------------------
// 11.1 DAILY MEDICINE ROUTINE (दैनिक औषधि तालिका)
// ---------------------------------------------------------------------
function renderMedicineRoutine() {
  const container = document.getElementById('medicineRoutineList');
  if (!container) return;
  if (!state.health) state.health = {};
  if (!state.health.medicines) state.health.medicines = [];

  const todayBs = getBikramSambatDate();
  const todayKey = `${todayBs.year}-${todayBs.month}-${todayBs.day}`;

  if (state.health.medicines.length === 0) {
    container.innerHTML = `
      <div class="py-6 text-center text-xs text-slate-400 dark:text-zinc-500 font-medium">
        ${currentLang === 'ne' ? 'कुनै औषधि तालिका दर्ता छैन।\nमाथि "+ औषधि" थिचेर थप्नुहोस्।' : 'No medicines added.\nTap "+ Medicine" above.'}
      </div>
    `;
    return;
  }

  const slots = [
    { id: 'morning', defaultTime: '08:00', label: currentLang === 'ne' ? '🌅 बिहान (Morning)' : '🌅 Morning' },
    { id: 'afternoon', defaultTime: '13:00', label: currentLang === 'ne' ? '☀️ दिउँसो (Afternoon)' : '☀️ Afternoon' },
    { id: 'night', defaultTime: '20:00', label: currentLang === 'ne' ? '🌙 साँझ/राति (Night)' : '🌙 Night' }
  ];

  let html = '';

  slots.forEach(slot => {
    const medsInSlot = state.health.medicines.filter(m => m.slot === slot.id);
    if (medsInSlot.length === 0) return;

    html += `
      <div class="space-y-1.5">
        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300 block px-1">${slot.label}</span>
        <div class="space-y-2">
    `;

    medsInSlot.forEach(m => {
      const isTaken = Array.isArray(m.takenDates) && m.takenDates.includes(todayKey);
      const foodLabel = m.food === 'before' 
        ? (currentLang === 'ne' ? 'खानाअघि' : 'Before food')
        : (currentLang === 'ne' ? 'खानापछि' : 'After food');
      const foodClass = m.food === 'before'
        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
        : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300';
      const timeDisplay = m.time || slot.defaultTime;

      html += `
        <div class="p-3 bg-white dark:bg-[#18202d] border border-slate-200 dark:border-[#283347] rounded-xl flex items-center justify-between gap-2 shadow-2xs ${isTaken ? 'bg-emerald-50/50 dark:bg-emerald-950/30' : ''}">
          <div class="flex items-center space-x-3 min-w-0">
            <button onclick="toggleMedicineTaken(${m.id})" class="w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center border-2 transition ${isTaken ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 dark:border-[#334158] bg-slate-50 dark:bg-[#111722] text-transparent hover:border-emerald-500'}">
              <span class="text-sm font-bold">✓</span>
            </button>
            <div class="min-w-0">
              <div class="flex items-center space-x-2">
                <span class="text-xs font-extrabold text-slate-900 dark:text-slate-100 truncate ${isTaken ? 'line-through text-slate-400 dark:text-slate-400' : ''}">${escapeHtml(m.name)}</span>
                <span class="px-1.5 py-0.5 rounded text-[9px] font-bold ${foodClass}">${foodLabel}</span>
              </div>
              <div class="text-[11px] text-slate-500 dark:text-slate-300 font-medium flex items-center flex-wrap gap-1.5 mt-0.5">
                <span class="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#111722] text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-[#283347]">⏰ ${escapeHtml(timeDisplay)}</span>
                ${m.dosage ? `<span>${escapeHtml(m.dosage)}</span> • ` : ''}
                <span class="${isTaken ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400 dark:text-slate-400'}">${isTaken ? (currentLang === 'ne' ? 'आज खाइसकियो' : 'Taken today') : (currentLang === 'ne' ? 'खान बाँकी' : 'Pending')}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-1 flex-shrink-0">
            <button onclick="openMedicineModal(${m.id})" class="p-1 text-slate-400 hover:text-slate-200 text-xs">✏️</button>
            <button onclick="deleteMedicine(${m.id})" class="p-1 text-slate-400 hover:text-rose-500 text-xs">🗑️</button>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function onMedSlotChange(slot) {
  const timeInput = document.getElementById('medTimeInput');
  if (!timeInput) return;
  if (slot === 'morning') timeInput.value = '08:00';
  else if (slot === 'afternoon') timeInput.value = '13:00';
  else if (slot === 'night') timeInput.value = '20:00';
}

function openMedicineModal(editId) {
  const modal = document.getElementById('medicineModal');
  const heading = document.getElementById('medModalHeading');
  const editIdInput = document.getElementById('medEditId');

  if (editId) {
    const m = state.health.medicines.find(item => item.id === editId);
    if (!m) return;
    if (heading) heading.innerText = currentLang === 'ne' ? 'औषधि सच्याउनुहोस्' : 'Edit Medicine';
    if (editIdInput) editIdInput.value = m.id;
    document.getElementById('medNameInput').value = m.name || '';
    document.getElementById('medSlotInput').value = m.slot || 'morning';
    document.getElementById('medTimeInput').value = m.time || (m.slot === 'morning' ? '08:00' : m.slot === 'afternoon' ? '13:00' : '20:00');
    document.getElementById('medDosageInput').value = m.dosage || '१ चक्की';
    const radios = document.getElementsByName('medFood');
    radios.forEach(r => { if (r.value === m.food) r.checked = true; });
  } else {
    if (heading) heading.innerText = currentLang === 'ne' ? 'औषधि थप्नुहोस् (Add Medicine)' : 'Add Medicine';
    if (editIdInput) editIdInput.value = '';
    document.getElementById('medNameInput').value = '';
    document.getElementById('medSlotInput').value = 'morning';
    document.getElementById('medTimeInput').value = '08:00';
    document.getElementById('medDosageInput').value = '१ चक्की';
  }

  if (modal) modal.classList.remove('hidden');
}

function closeMedicineModal() {
  const modal = document.getElementById('medicineModal');
  if (modal) modal.classList.add('hidden');
}

function saveMedicine(e) {
  if (e) e.preventDefault();
  const editId = document.getElementById('medEditId').value;
  const name = document.getElementById('medNameInput').value.trim();
  const slot = document.getElementById('medSlotInput').value || 'morning';
  const time = document.getElementById('medTimeInput').value || (slot === 'morning' ? '08:00' : slot === 'afternoon' ? '13:00' : '20:00');
  const dosage = document.getElementById('medDosageInput').value.trim() || '१ चक्की';
  const foodRadio = document.querySelector('input[name="medFood"]:checked');
  const food = foodRadio ? foodRadio.value : 'after';

  if (!name) return;

  if (!state.health) state.health = {};
  if (!state.health.medicines) state.health.medicines = [];

  if (editId) {
    const idx = state.health.medicines.findIndex(m => m.id === parseInt(editId));
    if (idx !== -1) {
      state.health.medicines[idx] = { ...state.health.medicines[idx], name, slot, time, dosage, food };
    }
  } else {
    state.health.medicines.push({
      id: Date.now(),
      name,
      slot,
      time,
      dosage,
      food,
      takenDates: []
    });
  }

  saveState();
  closeMedicineModal();
  renderMedicineRoutine();
  showToast(currentLang === 'ne' ? 'औषधि तालिका सुरक्षित भयो' : 'Medicine saved');
}

function toggleMedicineTaken(id) {
  const m = state.health.medicines.find(item => item.id === id);
  if (!m) return;
  if (!Array.isArray(m.takenDates)) m.takenDates = [];

  const todayBs = getBikramSambatDate();
  const todayKey = `${todayBs.year}-${todayBs.month}-${todayBs.day}`;

  const idx = m.takenDates.indexOf(todayKey);
  if (idx !== -1) {
    m.takenDates.splice(idx, 1);
  } else {
    m.takenDates.push(todayKey);
    playSound('chime');
    petCelebrate('money');
    showToast(currentLang === 'ne' ? 'औषधि खाइयो! 💊 स्वस्थ रहनुहोस्!' : 'Medicine taken! 💊 Stay healthy!');
  }

  saveState();
  renderMedicineRoutine();
}

function deleteMedicine(id) {
  requestConfirm(
    currentLang === 'ne' ? 'औषधि हटाउने?' : 'Delete Medicine?',
    currentLang === 'ne' ? 'यो औषधि तालिकाबाट सधैंका लागि हट्नेछ।' : 'This medicine will be removed from your routine.',
    () => {
      state.health.medicines = state.health.medicines.filter(m => m.id !== id);
      saveState();
      renderMedicineRoutine();
      showToast(currentLang === 'ne' ? 'औषधि हटाइयो' : 'Medicine deleted');
    }
  );
}

// ---------------------------------------------------------------------
// 11.2 VAULT & MULTI-VEHICLE FLEET MANAGEMENT
// ---------------------------------------------------------------------
function renderVault() {
  const v = state.vault || {};
  const wifi = v.wifi || {};

  document.getElementById('wifiSsid').value = wifi.ssid || '';
  document.getElementById('wifiPass').value = wifi.pass || '';

  const notifToggle = document.getElementById('stickyNotifToggle');
  if (notifToggle) {
    notifToggle.checked = !!state.stickyNotifEnabled;
  }

  const petToggle = document.getElementById('petMasterToggle');
  if (petToggle) {
    petToggle.checked = !!state.petEnabled;
  }

  renderWifiQRCode();
  renderVehicleList();
  renderHomeServices();
}

function saveWifiConfig() {
  if (!state.vault) state.vault = {};
  state.vault.wifi = {
    ssid: document.getElementById('wifiSsid').value.trim(),
    pass: document.getElementById('wifiPass').value.trim()
  };
  saveState();
  renderWifiQRCode();
  showToast(currentLang === 'ne' ? 'वाई-फाई विवरण सेभ भयो' : 'Wi-Fi saved');
}

function renderWifiQRCode() {
  const canvas = document.getElementById('wifiQrCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width = 144;
  const h = canvas.height = 144;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);

  const wifi = (state.vault && state.vault.wifi) || {};
  const text = `WIFI:T:WPA;S:${wifi.ssid || 'Sangalo_Fiber_5G'};P:${wifi.pass || 'Family123'};;`;

  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = (hash << 5) - hash + text.charCodeAt(i);

  const cols = 21;
  const cellSize = Math.floor(w / cols);
  const offset = Math.floor((w - cols * cellSize) / 2);

  ctx.fillStyle = '#0f172a';

  function drawCorner(r, c) {
    ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize * 5, cellSize * 5);
    ctx.clearRect(offset + (c + 1) * cellSize, offset + (r + 1) * cellSize, cellSize * 3, cellSize * 3);
    ctx.fillRect(offset + (c + 2) * cellSize, offset + (r + 2) * cellSize, cellSize, cellSize);
  }
  drawCorner(1, 1);
  drawCorner(1, 15);
  drawCorner(15, 1);

  for (let r = 0; r < cols; r++) {
    for (let c = 0; c < cols; c++) {
      if ((r < 7 && (c < 7 || c > 13)) || (r > 13 && c < 7)) continue;
      const bit = Math.abs(Math.sin(hash + r * 17 + c * 31));
      if (bit > 0.45) {
        ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize - 0.5, cellSize - 0.5);
      }
    }
  }
}

function setVehType(type) {
  const input = document.getElementById('vehTypeInput');
  if (input) input.value = type;

  ['scooter', 'bike', 'car'].forEach(t => {
    const btn = document.getElementById(`vtype-${t}`);
    if (btn) {
      if (t === type) {
        btn.className = 'flex-1 py-1.5 px-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 text-center';
      } else {
        btn.className = 'flex-1 py-1.5 px-1 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-400 text-center';
      }
    }
  });
}

function renderVehicleList() {
  const container = document.getElementById('vehicleListContainer');
  if (!container) return;
  if (!state.vault) state.vault = {};
  if (!state.vault.vehicles) state.vault.vehicles = [];

  if (state.vault.vehicles.length === 0) {
    container.innerHTML = `
      <div class="py-6 text-center text-xs text-slate-400 dark:text-zinc-500 font-medium">
        ${currentLang === 'ne' ? 'कुनै सवारी दर्ता गरिएको छैन।\nमाथि "+ सवारी थप्नुहोस्" थिच्नुहोस्।' : 'No vehicles added.\nTap "+ Add Vehicle" above.'}
      </div>
    `;
    return;
  }

  container.innerHTML = state.vault.vehicles.map(v => {
    const icon = v.type === 'scooter' ? '🛵' : (v.type === 'car' ? '🚗' : '🏍️');
    const typeLabel = v.type === 'scooter' 
      ? (currentLang === 'ne' ? 'स्कुटर' : 'Scooter')
      : (v.type === 'car' ? (currentLang === 'ne' ? 'कार' : 'Car') : (currentLang === 'ne' ? 'बाइक' : 'Bike'));

    return `
      <div class="p-3.5 bg-white dark:bg-[#18202d] border border-slate-200 dark:border-[#283347] rounded-2xl space-y-2.5 shadow-2xs">
        <div class="flex items-start justify-between">
          <div class="flex items-start space-x-2.5">
            <span class="text-2xl">${icon}</span>
            <div>
              <div class="flex items-center space-x-1.5">
                <h4 class="text-sm font-extrabold text-slate-900 dark:text-slate-100">${escapeHtml(v.name)}</h4>
                <span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-[#111722] text-slate-600 dark:text-slate-300 border border-transparent dark:border-[#283347]">${typeLabel}</span>
              </div>
              <div class="mt-0.5">
                <span class="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-extrabold inline-block">
                  ${escapeHtml(v.plate)}
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-1">
            <button onclick="openVehicleModal(${v.id})" class="p-1.5 rounded-lg bg-slate-100 dark:bg-[#111722] text-slate-600 dark:text-slate-300 border border-transparent dark:border-[#283347] hover:bg-slate-200 text-xs font-semibold" title="Edit">
              ✏️
            </button>
            <button onclick="deleteVehicle(${v.id})" class="p-1.5 rounded-lg bg-slate-100 dark:bg-[#111722] text-slate-600 dark:text-slate-300 border border-transparent dark:border-[#283347] hover:text-rose-500 text-xs font-semibold" title="Delete">
              🗑️
            </button>
          </div>
        </div>

        ${v.notes ? `
          <div class="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#111722] p-2 rounded-xl border border-slate-100 dark:border-[#283347]">
            🔧 <span class="font-medium">${escapeHtml(v.notes)}</span>
          </div>
        ` : ''}

        <div class="flex items-center justify-between pt-1">
          <button onclick="openVehicleDetailModal(${v.id})" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#111722] hover:bg-slate-200 dark:hover:bg-[#151b26] text-slate-700 dark:text-slate-300 border border-transparent dark:border-[#283347] text-[11px] font-bold flex items-center space-x-1 transition">
            <span>⚙️</span>
            <span>${currentLang === 'ne' ? 'प्राविधिक विवरण (Specs)' : 'Technical Specs'}</span>
          </button>
          ${v.taxDue ? `
            <span class="text-[10px] font-semibold text-amber-700 dark:text-amber-300">
              📅 ${currentLang === 'ne' ? 'कर म्याद:' : 'Tax Due:'} ${escapeHtml(v.taxDue)}
            </span>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function openVehicleModal(editId) {
  const modal = document.getElementById('vehicleModal');
  const heading = document.getElementById('vehModalHeading');
  const editIdInput = document.getElementById('vehEditId');

  if (editId) {
    const v = state.vault.vehicles.find(item => item.id === editId);
    if (!v) return;
    if (heading) heading.innerText = currentLang === 'ne' ? 'सवारी विवरण सच्याउनुहोस्' : 'Edit Vehicle';
    if (editIdInput) editIdInput.value = v.id;
    setVehType(v.type || 'scooter');
    document.getElementById('vehNameInput').value = v.name || '';
    document.getElementById('vehPlateInput').value = v.plate || '';
    document.getElementById('vehNotesInput').value = v.notes || '';
    document.getElementById('vehEngineInput').value = v.engine || '';
    document.getElementById('vehVinInput').value = v.vin || '';
    document.getElementById('vehTaxDueInput').value = v.taxDue || '';
  } else {
    if (heading) heading.innerText = currentLang === 'ne' ? 'सवारी साधन थप्नुहोस्' : 'Add Vehicle';
    if (editIdInput) editIdInput.value = '';
    setVehType('scooter');
    document.getElementById('vehNameInput').value = '';
    document.getElementById('vehPlateInput').value = '';
    document.getElementById('vehNotesInput').value = '';
    document.getElementById('vehEngineInput').value = '';
    document.getElementById('vehVinInput').value = '';
    document.getElementById('vehTaxDueInput').value = '';
  }

  if (modal) modal.classList.remove('hidden');
}

function closeVehicleModal() {
  const modal = document.getElementById('vehicleModal');
  if (modal) modal.classList.add('hidden');
}

function saveVehicle(e) {
  if (e) e.preventDefault();
  const editId = document.getElementById('vehEditId').value;
  const type = document.getElementById('vehTypeInput').value || 'scooter';
  const name = document.getElementById('vehNameInput').value.trim();
  const plate = document.getElementById('vehPlateInput').value.trim();
  const notes = document.getElementById('vehNotesInput').value.trim();
  const engine = document.getElementById('vehEngineInput').value.trim();
  const vin = document.getElementById('vehVinInput').value.trim();
  const taxDue = document.getElementById('vehTaxDueInput').value.trim();

  if (!name || !plate) return;

  if (!state.vault) state.vault = {};
  if (!state.vault.vehicles) state.vault.vehicles = [];

  if (editId) {
    const idx = state.vault.vehicles.findIndex(v => v.id === parseInt(editId));
    if (idx !== -1) {
      state.vault.vehicles[idx] = { id: parseInt(editId), type, name, plate, notes, engine, vin, taxDue };
    }
  } else {
    state.vault.vehicles.push({
      id: Date.now(),
      type,
      name,
      plate,
      notes,
      engine,
      vin,
      taxDue
    });
  }

  saveState();
  closeVehicleModal();
  renderVehicleList();
  showToast(currentLang === 'ne' ? 'सवारी साधन सेभ भयो' : 'Vehicle details saved');
}

function deleteVehicle(id) {
  requestConfirm(
    currentLang === 'ne' ? 'सवारी साधन हटाउने?' : 'Delete Vehicle?',
    currentLang === 'ne' ? 'यो सवारीको सम्पूर्ण विवरण हट्नेछ।' : 'This vehicle record will be permanently deleted.',
    () => {
      state.vault.vehicles = state.vault.vehicles.filter(v => v.id !== id);
      saveState();
      renderVehicleList();
      showToast(currentLang === 'ne' ? 'सवारी विवरण हटाइयो' : 'Vehicle deleted');
    }
  );
}

function openVehicleDetailModal(id) {
  const modal = document.getElementById('vehicleDetailModal');
  const v = state.vault.vehicles.find(item => item.id === id);
  if (!v || !modal) return;

  document.getElementById('vehDetailTitle').innerText = v.name;
  const content = document.getElementById('vehDetailContent');

  const detailsText = `सवारी: ${v.name}
प्लेट: ${v.plate}
इन्जिन नं: ${v.engine || 'N/A'}
चेसिस नं (VIN): ${v.vin || 'N/A'}
कर तिर्ने म्याद: ${v.taxDue || 'N/A'}
सर्भिसिङ विवरण: ${v.notes || 'N/A'}`;

  content.innerHTML = `
    <div class="space-y-2 p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-100 dark:border-zinc-800 text-xs">
      <div class="flex justify-between py-1 border-b border-slate-200 dark:border-zinc-800">
        <span class="text-slate-500 font-medium">${currentLang === 'ne' ? 'नम्बर प्लेट' : 'Plate'}:</span>
        <span class="font-mono font-bold text-slate-900 dark:text-zinc-100">${escapeHtml(v.plate)}</span>
      </div>
      <div class="flex justify-between py-1 border-b border-slate-200 dark:border-zinc-800">
        <span class="text-slate-500 font-medium">${currentLang === 'ne' ? 'इन्जिन नम्बर' : 'Engine #'}:</span>
        <span class="font-mono font-bold text-slate-900 dark:text-zinc-100">${escapeHtml(v.engine || 'N/A')}</span>
      </div>
      <div class="flex justify-between py-1 border-b border-slate-200 dark:border-zinc-800">
        <span class="text-slate-500 font-medium">${currentLang === 'ne' ? 'चेसिस / VIN' : 'Chassis / VIN'}:</span>
        <span class="font-mono font-bold text-slate-900 dark:text-zinc-100">${escapeHtml(v.vin || 'N/A')}</span>
      </div>
      <div class="flex justify-between py-1 border-b border-slate-200 dark:border-zinc-800">
        <span class="text-slate-500 font-medium">${currentLang === 'ne' ? 'ब्लुबुक कर म्याद' : 'Tax Due'}:</span>
        <span class="font-bold text-amber-600 dark:text-amber-400">${escapeHtml(v.taxDue || 'N/A')}</span>
      </div>
      <div class="py-1">
        <span class="text-slate-500 font-medium block mb-0.5">${currentLang === 'ne' ? 'सर्भिसिङ / मोबिल टिपोट' : 'Service Notes'}:</span>
        <span class="text-slate-700 dark:text-zinc-300 font-medium">${escapeHtml(v.notes || 'N/A')}</span>
      </div>
    </div>
    <button onclick="copyToClipboard('${escapeHtml(detailsText).replace(/'/g, "\\'")}', '${currentLang === 'ne' ? 'सवारी विवरण कपी भयो!' : 'Vehicle specs copied!'}')" class="w-full py-2 bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 font-bold text-xs rounded-xl transition">
      📋 ${currentLang === 'ne' ? 'विवरण कपी गर्नुहोस्' : 'Copy Specs to Clipboard'}
    </button>
  `;

  modal.classList.remove('hidden');
}

function closeVehicleDetailModal() {
  const modal = document.getElementById('vehicleDetailModal');
  if (modal) modal.classList.add('hidden');
}

// ---------------------------------------------------------------------
// 11.3 HOME SERVICE DIRECTORY FULL CRUD
// ---------------------------------------------------------------------
function renderHomeServices() {
  const container = document.getElementById('homeContactsList');
  if (!container) return;

  const services = (state.vault && state.vault.homeServices) || [];
  if (services.length === 0) {
    container.innerHTML = `
      <div class="py-4 text-center text-xs text-slate-400 dark:text-zinc-500">
        ${currentLang === 'ne' ? 'कुनै सम्पर्क छैन।' : 'No contacts added.'}
      </div>
    `;
    return;
  }

  container.innerHTML = services.map(s => `
    <div class="p-3 bg-white dark:bg-[#18202d] border border-slate-200 dark:border-[#283347] rounded-xl flex items-center justify-between shadow-2xs">
      <div>
        <div class="text-xs font-bold text-slate-900 dark:text-slate-100">${escapeHtml(s.role)}: ${escapeHtml(s.name)}</div>
        <div class="text-[10px] text-slate-500 dark:text-slate-300 font-mono font-bold mt-0.5">
          <a href="tel:${escapeHtml(s.phone)}" class="text-emerald-600 dark:text-emerald-400 hover:underline">${escapeHtml(s.phone)}</a>
        </div>
      </div>
      <div class="flex items-center space-x-1.5">
        <a href="tel:${escapeHtml(s.phone)}" class="p-2 bg-emerald-50 dark:bg-[#111722] text-emerald-600 dark:text-emerald-400 border border-transparent dark:border-[#283347] rounded-xl hover:bg-emerald-100 transition" title="Call">
          📞
        </a>
        <button onclick="editHomeService(${s.id})" class="p-2 bg-slate-100 dark:bg-[#111722] text-slate-600 dark:text-slate-300 border border-transparent dark:border-[#283347] rounded-xl hover:bg-slate-200 transition" title="Edit">
          ✏️
        </button>
        <button onclick="deleteHomeService(${s.id})" class="p-2 bg-slate-100 dark:bg-[#111722] text-slate-600 dark:text-slate-300 border border-transparent dark:border-[#283347] hover:text-rose-500 rounded-xl hover:bg-slate-200 transition" title="Delete">
          🗑️
        </button>
      </div>
    </div>
  `).join('');
}

function openAddHomeServiceModal() {
  const modal = document.getElementById('homeServiceModal');
  const heading = document.getElementById('serviceModalHeading');
  if (heading) heading.innerText = currentLang === 'ne' ? 'घरायसी सम्पर्क थप्नुहोस्' : 'Add Home Service Contact';
  document.getElementById('serviceEditId').value = '';
  document.getElementById('serviceRoleInput').value = '';
  document.getElementById('serviceNameInput').value = '';
  document.getElementById('servicePhoneInput').value = '';
  if (modal) modal.classList.remove('hidden');
}

function editHomeService(id) {
  const modal = document.getElementById('homeServiceModal');
  const heading = document.getElementById('serviceModalHeading');
  const s = state.vault.homeServices.find(item => item.id === id);
  if (!s || !modal) return;

  if (heading) heading.innerText = currentLang === 'ne' ? 'सम्पर्क सच्याउनुहोस्' : 'Edit Contact';
  document.getElementById('serviceEditId').value = s.id;
  document.getElementById('serviceRoleInput').value = s.role || '';
  document.getElementById('serviceNameInput').value = s.name || '';
  document.getElementById('servicePhoneInput').value = s.phone || '';
  modal.classList.remove('hidden');
}

function closeHomeServiceModal() {
  const modal = document.getElementById('homeServiceModal');
  if (modal) modal.classList.add('hidden');
}

function saveHomeService(e) {
  if (e) e.preventDefault();
  const editId = document.getElementById('serviceEditId').value;
  const role = document.getElementById('serviceRoleInput').value.trim();
  const name = document.getElementById('serviceNameInput').value.trim();
  const phone = document.getElementById('servicePhoneInput').value.trim();

  if (!role || !name || !phone) return;

  if (!state.vault) state.vault = {};
  if (!state.vault.homeServices) state.vault.homeServices = [];

  if (editId) {
    const idx = state.vault.homeServices.findIndex(s => s.id === parseInt(editId));
    if (idx !== -1) {
      state.vault.homeServices[idx] = { id: parseInt(editId), role, name, phone };
    }
  } else {
    state.vault.homeServices.push({ id: Date.now(), role, name, phone });
  }

  saveState();
  closeHomeServiceModal();
  renderHomeServices();
  showToast(currentLang === 'ne' ? 'सम्पर्क सुरक्षित भयो' : 'Contact saved');
}

function deleteHomeService(id) {
  requestConfirm(
    currentLang === 'ne' ? 'सम्पर्क हटाउने?' : 'Delete Contact?',
    currentLang === 'ne' ? 'यो घरायसी सेवा सम्पर्क सधैंका लागि हट्नेछ।' : 'This contact will be permanently deleted.',
    () => {
      state.vault.homeServices = state.vault.homeServices.filter(s => s.id !== id);
      saveState();
      renderHomeServices();
      showToast(currentLang === 'ne' ? 'सम्पर्क हटाइयो' : 'Contact deleted');
    }
  );
}

function exportBackup() {
  const data = JSON.stringify(state, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sangalo-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast(currentLang === 'ne' ? 'ब्याकअप डाउनलोड भयो' : 'Backup exported');
}

function importBackup(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (imported) {
        state = { ...state, ...imported };
        saveState();
        updateAllTranslations();
        showToast(currentLang === 'ne' ? 'ब्याकअप रिस्टोर भयो!' : 'Backup restored!');
      }
    } catch (err) {
      showToast(currentLang === 'ne' ? 'अमान्य फाइल' : 'Invalid backup file');
    }
  };
  reader.readAsText(file);
}

// ---------------------------------------------------------------------
// 12. STICKY NOTIFICATION BAR (Hamro Patro Style) & ALARM BRIDGE
// ---------------------------------------------------------------------
function isAndroidNativeApp() {
  return typeof window.AndroidBridge !== 'undefined';
}

function toggleStickyNotification(e) {
  const enabled = e.target.checked;
  state.stickyNotifEnabled = enabled;
  saveState();

  if (enabled) {
    if (isAndroidNativeApp()) {
      if (typeof window.AndroidBridge.requestNotificationPermission === 'function') {
        window.AndroidBridge.requestNotificationPermission();
      }
      showStickyCalendarNotification();
    } else if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        showStickyCalendarNotification();
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            showStickyCalendarNotification();
          } else {
            e.target.checked = false;
            state.stickyNotifEnabled = false;
            saveState();
            showToast(currentLang === 'ne' ? 'नोटिफिकेसन अनुमति अस्वीकृत' : 'Notification permission denied');
          }
        });
      }
    } else {
      showToast(currentLang === 'ne' ? 'यो ब्राउजरमा वेब नोटिफिकेसन समर्थित छैन' : 'Web Notifications not supported');
    }
  } else {
    if (isAndroidNativeApp() && typeof window.AndroidBridge.cancelStickyNotification === 'function') {
      window.AndroidBridge.cancelStickyNotification();
    }
    showToast(currentLang === 'ne' ? 'नोटिफिकेसन बन्द गरियो' : 'Notification pinned date turned off');
  }
}

function showStickyCalendarNotification() {
  const bs = getBikramSambatDate();
  const festName = getFestival(bs.year, bs.month, bs.day);

  const title = `📅 ${bs.devanagariGateFormatted || bs.devanagariFormatted}`;
  const body = festName
    ? `🌸 ${festName} • ई.सं. (AD): ${bs.adFormatted}`
    : `ई.सं. (AD): ${bs.adFormatted}, ${bs.adWeekdayEn}`;

  // Sync 60-day calendar schedule to Android SharedPreferences for automatic midnight updates
  if (isAndroidNativeApp() && typeof window.AndroidBridge.syncCalendarSchedule === 'function') {
    try {
      const schedule = {};
      for (let i = 0; i < 60; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        const curBs = getBikramSambatDate(d);
        const fName = getFestival(curBs.year, curBs.month, curBs.day);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dayNum = String(d.getDate()).padStart(2, '0');
        const key = `${y}-${m}-${dayNum}`;
        schedule[key] = {
          title: `📅 ${curBs.devanagariGateFormatted || curBs.devanagariFormatted}`,
          body: fName ? `🌸 ${fName} • ई.सं. (AD): ${curBs.adFormatted}` : `ई.सं. (AD): ${curBs.adFormatted}, ${curBs.adWeekdayEn}`
        };
      }
      window.AndroidBridge.syncCalendarSchedule(JSON.stringify(schedule));
    } catch (e) {
      console.warn('Sync calendar schedule error:', e);
    }
  }

  if (isAndroidNativeApp() && typeof window.AndroidBridge.showStickyNotification === 'function') {
    window.AndroidBridge.showStickyNotification(title, body);
    showToast(currentLang === 'ne' ? 'आजको मिति नोटिफिकेसन बारमा राखियो 📌' : 'Today\'s date pinned in notifications 📌');
    return;
  }

  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  try {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http') && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification(title, {
          body: body,
          icon: 'icon.png',
          badge: 'icon.png',
          tag: 'sangalo-daily-patro',
          renotify: false,
          silent: true
        });
      });
    } else {
      new Notification(title, {
        body: body,
        icon: 'icon.png',
        tag: 'sangalo-daily-patro',
        silent: true
      });
    }
    showToast(currentLang === 'ne' ? 'आजको मिति नोटिफिकेसन बारमा राखियो 📌' : 'Today\'s date pinned in notifications 📌');
  } catch (err) {}
}

// ---------------------------------------------------------------------
// 12.1. AUTOMATED REMINDER & MEDICINE ROUTINE ALARM ENGINE
// ---------------------------------------------------------------------
let alarmTimerId = null;
const firedAlarmsToday = new Set();
let lastCheckedDateKey = '';
let currentRingingAlarmInfo = null;

function initAlarmEngine() {
  const toggle = document.getElementById('alarmMasterToggle');
  if (toggle) {
    toggle.checked = state.alarmsEnabled !== false;
  }

  // Run initial check and set periodic interval (every 20 seconds)
  checkDailyRemindersAndMedRoutine();
  if (alarmTimerId) clearInterval(alarmTimerId);
  alarmTimerId = setInterval(checkDailyRemindersAndMedRoutine, 20000);

  // Resume check when app comes to foreground or screen unlocks
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      checkDailyRemindersAndMedRoutine();
    }
  });
}

function toggleAlarmSystem(e) {
  const enabled = e.target.checked;
  state.alarmsEnabled = enabled;
  saveState();

  if (enabled) {
    if (isAndroidNativeApp()) {
      if (typeof window.AndroidBridge.requestNotificationPermission === 'function') {
        window.AndroidBridge.requestNotificationPermission();
      }
    } else {
      playAlarmTone();
      if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
    showToast(currentLang === 'ne' ? 'औषधि तथा सम्झना अलार्म सक्रिय गरियो ⏰' : 'Medicine & reminder alarms activated ⏰');
    checkDailyRemindersAndMedRoutine();
  } else {
    stopAlarmAudioAndVibration();
    closeAlarmPopupModal();
    showToast(currentLang === 'ne' ? 'अलार्म बन्द गरियो' : 'Alarms turned off');
  }
}

function playAlarmTone() {
  playSound('chime');
  setTimeout(() => playSound('happy'), 320);
}

function stopAlarmAudioAndVibration() {
  if (isAndroidNativeApp() && typeof window.AndroidBridge.stopAlarmSound === 'function') {
    window.AndroidBridge.stopAlarmSound();
  }
}

function closeAlarmPopupModal() {
  const modal = document.getElementById('medAlarmPopupModal');
  if (modal) modal.classList.add('hidden');
}

function fireAlarmNotice(title, body, type, payload) {
  if (state.alarmsEnabled === false) return;

  currentRingingAlarmInfo = { title, body, type, payload };

  // 1. Play Native Alarm / Vibration or Web Audio
  if (isAndroidNativeApp() && typeof window.AndroidBridge.triggerAlarm === 'function') {
    window.AndroidBridge.triggerAlarm(title, body, type || 'alarm');
  } else {
    playAlarmTone();
  }

  // 2. Open In-App Alarm Popup Modal
  const modal = document.getElementById('medAlarmPopupModal');
  if (modal) {
    const titleEl = document.getElementById('alarmPopupTitle');
    const subEl = document.getElementById('alarmPopupSubtitle');
    const nameEl = document.getElementById('alarmPopupItemName');
    const detEl = document.getElementById('alarmPopupDetails');
    const timeEl = document.getElementById('alarmPopupTime');
    const takeBtn = document.getElementById('alarmTakeBtn');
    const takeBtnText = document.getElementById('alarmTakeBtnText');

    const now = new Date();
    const curTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    if (timeEl) timeEl.innerText = curTime;

    if (type === 'medicine') {
      if (titleEl) titleEl.innerText = currentLang === 'ne' ? 'औषधि खाने बेला भयो!' : 'Time for Medicine!';
      if (subEl) subEl.innerText = currentLang === 'ne' ? 'औषधि तालिका सम्झना' : 'Daily Medicine Routine';
      if (nameEl) nameEl.innerText = payload && payload.name ? payload.name : (body || title);
      
      let details = '';
      if (payload && payload.dosage) details += payload.dosage;
      if (payload && payload.food) {
        details += (details ? ' • ' : '') + (payload.food === 'before' ? (currentLang === 'ne' ? 'खानाअघि' : 'Before food') : (currentLang === 'ne' ? 'खानापछि' : 'After food'));
      }
      if (detEl) detEl.innerText = details || (body || '');
      if (takeBtnText) takeBtnText.innerText = currentLang === 'ne' ? 'खाएँ (Mark as Taken)' : 'Mark as Taken';
      if (takeBtn) takeBtn.classList.remove('hidden');
    } else {
      if (titleEl) titleEl.innerText = currentLang === 'ne' ? 'पात्रो सम्झना अलार्म!' : 'Calendar Reminder!';
      if (subEl) subEl.innerText = currentLang === 'ne' ? 'तालिका अनुसारको सम्झना' : 'Scheduled reminder';
      if (nameEl) nameEl.innerText = body || title;
      if (detEl) detEl.innerText = title;
      if (takeBtnText) takeBtnText.innerText = currentLang === 'ne' ? 'बुझेँ (Acknowledge)' : 'Acknowledge';
      if (takeBtn) takeBtn.classList.remove('hidden');
    }

    modal.classList.remove('hidden');
  }

  // 3. Pet companion reaction
  petCelebrate('chime');
  const pukuBubble = document.getElementById('pukuBubble');
  if (pukuBubble && state.petEnabled !== false) {
    pukuBubble.innerText = currentLang === 'ne' ? `⏰ सम्झना: ${title}` : `⏰ Reminder: ${title}`;
    pukuBubble.classList.remove('hidden');
    setTimeout(() => pukuBubble.classList.add('hidden'), 7000);
  }

  // 4. Web notification fallback if browser supports it
  if (!isAndroidNativeApp() && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body: body,
        icon: 'icon.png',
        vibrate: [250, 150, 250, 150, 250]
      });
    } catch (err) {}
  }
}

function handleAlarmTakenAction() {
  stopAlarmAudioAndVibration();
  closeAlarmPopupModal();

  if (currentRingingAlarmInfo && currentRingingAlarmInfo.type === 'medicine' && currentRingingAlarmInfo.payload) {
    const medId = currentRingingAlarmInfo.payload.id;
    if (medId) {
      const todayBs = getBikramSambatDate();
      const todayKey = `${todayBs.year}-${todayBs.month}-${todayBs.day}`;
      const m = state.health.medicines.find(item => item.id === medId);
      if (m) {
        if (!Array.isArray(m.takenDates)) m.takenDates = [];
        if (!m.takenDates.includes(todayKey)) {
          m.takenDates.push(todayKey);
          saveState();
          renderMedicineRoutine();
        }
      }
    }
    showToast(currentLang === 'ne' ? 'औषधि खाइयो! 💊 स्वस्थ रहनुहोस्!' : 'Medicine taken! 💊 Stay healthy!');
  } else {
    showToast(currentLang === 'ne' ? 'सम्झना स्वीकृत भयो' : 'Reminder acknowledged');
  }
  currentRingingAlarmInfo = null;
}

function handleAlarmSnoozeAction(mins) {
  stopAlarmAudioAndVibration();
  closeAlarmPopupModal();

  const snoozedAlarm = currentRingingAlarmInfo;
  currentRingingAlarmInfo = null;

  const snoozeMins = mins || 5;
  showToast(currentLang === 'ne' ? `${snoozeMins} मिनेट पछि पुनः अलार्म बज्नेछ ⏰` : `Alarm snoozed for ${snoozeMins} min ⏰`);

  if (snoozedAlarm) {
    setTimeout(() => {
      fireAlarmNotice(snoozedAlarm.title, snoozedAlarm.body, snoozedAlarm.type, snoozedAlarm.payload);
    }, snoozeMins * 60 * 1000);
  }
}

function handleAlarmDismissAction() {
  stopAlarmAudioAndVibration();
  closeAlarmPopupModal();
  currentRingingAlarmInfo = null;
  showToast(currentLang === 'ne' ? 'अलार्म बन्द गरियो' : 'Alarm dismissed');
}

function checkDailyRemindersAndMedRoutine() {
  if (state.alarmsEnabled === false) return;

  const now = new Date();
  const curH = String(now.getHours()).padStart(2, '0');
  const curM = String(now.getMinutes()).padStart(2, '0');
  const curTime = `${curH}:${curM}`;

  const bs = getBikramSambatDate();
  const dateKey = `${bs.year}-${bs.month}-${bs.day}`;

  // Reset fired cache if day changed & refresh sticky notification automatically
  if (lastCheckedDateKey && lastCheckedDateKey !== dateKey) {
    firedAlarmsToday.clear();
    if (state.stickyNotifEnabled) {
      showStickyCalendarNotification();
    }
  }
  lastCheckedDateKey = dateKey;

  // 1. Calendar Event Reminders
  const events = (state.events && state.events[dateKey]) || (state.calendarEvents && state.calendarEvents[dateKey]) || [];
  events.forEach(ev => {
    if (ev.time) {
      const evTime = ev.time.trim();
      const fireKey = `cal_${dateKey}_${ev.id || ev.title}_${evTime}`;
      if (evTime === curTime && !firedAlarmsToday.has(fireKey)) {
        firedAlarmsToday.add(fireKey);
        const title = currentLang === 'ne' ? 'पात्रो सम्झना (Calendar Reminder)' : 'Calendar Reminder';
        const body = `${ev.title || ''} (${evTime})`;
        fireAlarmNotice(title, body, 'calendar', ev);
      }
    }
  });

  // 2. Daily Medicine Routine with Custom Times
  const medicines = (state.health && state.health.medicines) || [];
  medicines.forEach(m => {
    const medTime = m.time || (m.slot === 'morning' ? '08:00' : m.slot === 'afternoon' ? '13:00' : '20:00');
    if (medTime === curTime) {
      const fireKey = `med_${dateKey}_${m.id}_${medTime}`;
      if (!firedAlarmsToday.has(fireKey)) {
        const isTaken = Array.isArray(m.takenDates) && m.takenDates.includes(dateKey);
        if (!isTaken) {
          firedAlarmsToday.add(fireKey);
          const title = currentLang === 'ne' ? 'औषधि खाने बेला भयो' : 'Medicine Reminder';
          const body = `${m.name} (${m.dosage || '१ चक्की'})${m.food === 'before' ? (currentLang === 'ne' ? ' - खानाअघि' : ' - Before food') : (currentLang === 'ne' ? ' - खानापछि' : ' - After food')}`;
          fireAlarmNotice(title, body, 'medicine', m);
        }
      }
    }
  });
}

// ---------------------------------------------------------------------
// 12.5. DOCUMENT & PHOTO VAULT (IndexedDB + Auto Compression + Fullscreen Viewer)
// ---------------------------------------------------------------------
let vaultDBInstance = null;

function openVaultDB() {
  return new Promise((resolve, reject) => {
    if (vaultDBInstance) return resolve(vaultDBInstance);
    if (!('indexedDB' in window)) {
      return reject(new Error('IndexedDB not supported'));
    }
    const req = indexedDB.open('SangaloVaultDB', 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('documents')) {
        const store = db.createObjectStore('documents', { keyPath: 'id' });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
    req.onsuccess = (e) => {
      vaultDBInstance = e.target.result;
      resolve(vaultDBInstance);
    };
    req.onerror = (e) => {
      console.error('IndexedDB open error:', e.target.error);
      reject(e.target.error);
    };
  });
}

function getFallbackVaultDocs() {
  if (!state.vault) state.vault = {};
  if (!Array.isArray(state.vault.fallbackDocs)) state.vault.fallbackDocs = [];
  return state.vault.fallbackDocs;
}

async function getAllVaultDocs() {
  try {
    const db = await openVaultDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('documents', 'readonly');
      const store = tx.objectStore('documents');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve(getFallbackVaultDocs());
    });
  } catch (err) {
    console.warn('getAllVaultDocs using localStorage fallback:', err);
    return getFallbackVaultDocs();
  }
}

async function getVaultDoc(id) {
  try {
    const db = await openVaultDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('documents', 'readonly');
      const store = tx.objectStore('documents');
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || getFallbackVaultDocs().find(d => String(d.id) === String(id)));
      req.onerror = () => resolve(getFallbackVaultDocs().find(d => String(d.id) === String(id)));
    });
  } catch (err) {
    console.warn('getVaultDoc using localStorage fallback:', err);
    return getFallbackVaultDocs().find(d => String(d.id) === String(id)) || null;
  }
}

async function saveVaultDoc(doc) {
  try {
    const db = await openVaultDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('documents', 'readwrite');
      const store = tx.objectStore('documents');
      const req = store.put(doc);
      req.onsuccess = () => resolve(doc);
      req.onerror = () => {
        const list = getFallbackVaultDocs();
        const idx = list.findIndex(d => String(d.id) === String(doc.id));
        if (idx >= 0) list[idx] = doc; else list.unshift(doc);
        saveState();
        resolve(doc);
      };
    });
  } catch (err) {
    console.warn('saveVaultDoc using localStorage fallback:', err);
    const list = getFallbackVaultDocs();
    const idx = list.findIndex(d => String(d.id) === String(doc.id));
    if (idx >= 0) list[idx] = doc; else list.unshift(doc);
    saveState();
    return doc;
  }
}

async function deleteVaultDoc(id) {
  try {
    const db = await openVaultDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('documents', 'readwrite');
      const store = tx.objectStore('documents');
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => {
        state.vault.fallbackDocs = getFallbackVaultDocs().filter(d => String(d.id) !== String(id));
        saveState();
        resolve(true);
      };
    });
  } catch (err) {
    console.warn('deleteVaultDoc using localStorage fallback:', err);
    state.vault.fallbackDocs = getFallbackVaultDocs().filter(d => String(d.id) !== String(id));
    saveState();
    return true;
  }
}

function compressImageFile(file, maxWidth = 1200, maxHeight = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not an image'));
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not decode image'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const approxBytes = Math.round((dataUrl.length * 3) / 4);
        resolve({
          dataUrl,
          width,
          height,
          originalSize: file.size,
          compressedSize: approxBytes,
          fileName: file.name
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

let currentStagedDocImage = null;
let currentVaultFilter = 'all';
let activeViewerDoc = null;
let activeViewerZoom = 1.0;

function filterVaultCategory(cat) {
  currentVaultFilter = cat;
  renderVaultDocs();
}

function openAddDocModal() {
  currentStagedDocImage = null;
  const modal = document.getElementById('addDocPhotoModal');
  const fileInput = document.getElementById('docFileInput');
  const titleInput = document.getElementById('docTitleInput');
  const numInput = document.getElementById('docNumberInput');
  const expInput = document.getElementById('docExpiryInput');
  const notesInput = document.getElementById('docNotesInput');
  const previewContainer = document.getElementById('docPreviewContainer');
  const prompt = document.getElementById('docUploadPrompt');
  const previewImg = document.getElementById('docPreviewImg');

  if (fileInput) fileInput.value = '';
  if (titleInput) titleInput.value = '';
  if (numInput) numInput.value = '';
  if (expInput) expInput.value = '';
  if (notesInput) notesInput.value = '';
  if (previewImg) previewImg.src = '';
  if (previewContainer) previewContainer.classList.add('hidden');
  if (prompt) prompt.classList.remove('hidden');

  if (modal) modal.classList.remove('hidden');
}

function closeAddDocModal() {
  const modal = document.getElementById('addDocPhotoModal');
  if (modal) modal.classList.add('hidden');
  currentStagedDocImage = null;
}

async function handleDocFileSelection(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  try {
    showToast(currentLang === 'ne' ? 'फोटो तयार गर्दै...' : 'Processing photo...');
    const result = await compressImageFile(file, 1200, 1200, 0.82);
    currentStagedDocImage = result.dataUrl;

    const previewContainer = document.getElementById('docPreviewContainer');
    const previewImg = document.getElementById('docPreviewImg');
    const prompt = document.getElementById('docUploadPrompt');
    const sizeBadge = document.getElementById('docSizeBadge');

    if (previewImg) previewImg.src = result.dataUrl;
    if (sizeBadge) {
      const origKb = Math.round(result.originalSize / 1024);
      const compKb = Math.round(result.compressedSize / 1024);
      sizeBadge.innerText = `${result.width}×${result.height}px • ${compKb} KB (मूल: ${origKb} KB)`;
    }
    if (prompt) prompt.classList.add('hidden');
    if (previewContainer) previewContainer.classList.remove('hidden');
  } catch (err) {
    console.error('Image compression failed:', err);
    showToast(currentLang === 'ne' ? 'फोटो लोड हुन सकेन' : 'Failed to process image');
  }
}

async function saveVaultDocumentForm(e) {
  e.preventDefault();
  if (!currentStagedDocImage) {
    showToast(currentLang === 'ne' ? 'कृपया कागजातको फोटो छान्नुहोस्' : 'Please select or capture a photo');
    return;
  }
  const title = document.getElementById('docTitleInput').value.trim();
  const category = document.getElementById('docCategorySelect').value || 'other';
  const docNumber = document.getElementById('docNumberInput').value.trim();
  const expiryDate = document.getElementById('docExpiryInput').value.trim();
  const notes = document.getElementById('docNotesInput').value.trim();

  const docRecord = {
    id: 'doc_' + Date.now(),
    title: title || (currentLang === 'ne' ? 'नयाँ कागजात' : 'New Document'),
    category,
    docNumber,
    expiryDate,
    notes,
    imageData: currentStagedDocImage,
    createdAt: new Date().toISOString()
  };

  try {
    await saveVaultDoc(docRecord);
    closeAddDocModal();
    renderVaultDocs();
    showToast(currentLang === 'ne' ? 'कागजात सुरक्षित भण्डारमा सेभ भयो! 📄' : 'Document saved to Vault! 📄');
    playSound('chime');
  } catch (err) {
    console.error('Failed to save document:', err);
    showToast(currentLang === 'ne' ? 'कागजात सेभ गर्न सकिएन' : 'Failed to save document');
  }
}

async function renderVaultDocs() {
  const grid = document.getElementById('vaultDocGrid');
  if (!grid) return;

  let docs = [];
  try {
    docs = await getAllVaultDocs();
  } catch (err) {
    console.error('Error fetching vault docs:', err);
  }

  // Filter pills highlight
  const filterBtns = ['all', 'citizenship', 'bluebook', 'license', 'health', 'receipt', 'other'];
  filterBtns.forEach(cat => {
    const btn = document.getElementById('vaultFilter-' + cat);
    if (!btn) return;
    if (cat === currentVaultFilter) {
      btn.className = 'px-2.5 py-1 rounded-lg font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 whitespace-nowrap transition';
    } else {
      btn.className = 'px-2.5 py-1 rounded-lg font-medium bg-slate-100 dark:bg-[#111722] text-slate-600 dark:text-slate-300 border border-transparent dark:border-[#283347] whitespace-nowrap hover:bg-slate-200 transition';
    }
  });

  const filteredDocs = currentVaultFilter === 'all'
    ? docs
    : docs.filter(d => d.category === currentVaultFilter);

  if (filteredDocs.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-6 text-center text-slate-400 dark:text-slate-400 space-y-1">
        <svg class="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
        </svg>
        <p class="text-xs font-semibold">${currentLang === 'ne' ? 'कुनै कागजात थपिएको छैन' : 'No documents saved in this category'}</p>
        <p class="text-[10px]">${currentLang === 'ne' ? 'नागरिकता वा ब्लुबुकको फोटो सुरक्षित राख्न + कागजात थप्नुहोस् थिच्नुहोस्' : 'Tap + Add Document to store citizenship or bluebook photos'}</p>
      </div>
    `;
    return;
  }

  const categoryNames = {
    citizenship: { ne: 'नागरिकता', en: 'Citizenship', color: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' },
    bluebook: { ne: 'ब्लुबुक', en: 'Bluebook', color: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' },
    license: { ne: 'लाइसेन्स', en: 'License', color: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300' },
    health: { ne: 'स्वास्थ्य', en: 'Health', color: 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300' },
    receipt: { ne: 'रसिद', en: 'Receipt', color: 'bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300' },
    other: { ne: 'अन्य', en: 'Other', color: 'bg-slate-100 dark:bg-[#111722] text-slate-700 dark:text-slate-300' }
  };

  grid.innerHTML = filteredDocs.map(doc => {
    const catInfo = categoryNames[doc.category] || categoryNames.other;
    const catLabel = currentLang === 'ne' ? catInfo.ne : catInfo.en;
    return `
      <div class="group relative bg-white dark:bg-[#18202d] border border-slate-200 dark:border-[#283347] hover:border-emerald-500/50 rounded-xl overflow-hidden shadow-2xs transition flex flex-col justify-between">
        <div onclick="viewFullDocPhoto('${doc.id}')" class="cursor-pointer">
          <div class="h-28 bg-slate-100 dark:bg-[#111722] overflow-hidden relative flex items-center justify-center">
            <img src="${doc.imageData}" class="w-full h-full object-cover group-hover:scale-105 transition duration-200" alt="${escapeHtml(doc.title)}">
            <span class="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[9px] font-bold rounded shadow-2xs ${catInfo.color}">
              ${catLabel}
            </span>
          </div>
          <div class="p-2 space-y-0.5">
            <h4 class="text-xs font-bold text-slate-900 dark:text-slate-100 truncate" title="${escapeHtml(doc.title)}">${escapeHtml(doc.title)}</h4>
            ${doc.docNumber ? `<p class="text-[10px] font-mono text-slate-500 dark:text-slate-300 truncate">नं: ${escapeHtml(doc.docNumber)}</p>` : ''}
            ${doc.expiryDate ? `<p class="text-[9px] text-amber-600 dark:text-amber-400 font-semibold truncate">📅 ${escapeHtml(doc.expiryDate)}</p>` : ''}
          </div>
        </div>
        <div class="px-2 pb-2 pt-1 border-t border-slate-100 dark:border-[#283347] flex items-center justify-between">
          <button onclick="viewFullDocPhoto('${doc.id}')" class="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
            ${currentLang === 'ne' ? 'हेर्नुहोस्' : 'View'}
          </button>
          <div class="flex items-center space-x-1">
            <button onclick="downloadDocImageById('${doc.id}')" class="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded" title="Download to Device">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>
            </button>
            <button onclick="confirmDeleteDoc('${doc.id}', '${escapeHtml(doc.title)}')" class="p-1 text-slate-400 hover:text-rose-500 rounded" title="Delete">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

async function viewFullDocPhoto(docId) {
  try {
    const doc = await getVaultDoc(docId);
    if (!doc) return;
    activeViewerDoc = doc;
    activeViewerZoom = 1.0;

    const modal = document.getElementById('viewDocPhotoModal');
    const titleEl = document.getElementById('viewerDocTitle');
    const metaEl = document.getElementById('viewerDocMeta');
    const imgEl = document.getElementById('viewerDocImage');
    const zoomEl = document.getElementById('viewerZoomLevel');

    if (titleEl) titleEl.innerText = doc.title;
    if (metaEl) {
      const parts = [];
      if (doc.docNumber) parts.push(`No: ${doc.docNumber}`);
      if (doc.expiryDate) parts.push(`Date: ${doc.expiryDate}`);
      if (doc.notes) parts.push(doc.notes);
      metaEl.innerText = parts.join(' • ');
    }
    if (imgEl) {
      imgEl.src = doc.imageData;
      imgEl.style.transform = 'scale(1.0)';
    }
    if (zoomEl) zoomEl.innerText = '100%';
    if (modal) modal.classList.remove('hidden');
  } catch (err) {
    console.error('Error opening doc photo:', err);
  }
}

function closeViewDocModal() {
  const modal = document.getElementById('viewDocPhotoModal');
  if (modal) modal.classList.add('hidden');
  activeViewerDoc = null;
  activeViewerZoom = 1.0;
}

function zoomViewerDoc(delta) {
  activeViewerZoom = Math.max(0.5, Math.min(3.5, activeViewerZoom + delta));
  const imgEl = document.getElementById('viewerDocImage');
  const zoomEl = document.getElementById('viewerZoomLevel');
  if (imgEl) imgEl.style.transform = `scale(${activeViewerZoom.toFixed(2)})`;
  if (zoomEl) zoomEl.innerText = `${Math.round(activeViewerZoom * 100)}%`;
}

function resetViewerDocZoom() {
  activeViewerZoom = 1.0;
  const imgEl = document.getElementById('viewerDocImage');
  const zoomEl = document.getElementById('viewerZoomLevel');
  if (imgEl) imgEl.style.transform = 'scale(1.0)';
  if (zoomEl) zoomEl.innerText = '100%';
}

function downloadCurrentDocImage() {
  if (!activeViewerDoc || !activeViewerDoc.imageData) return;
  const link = document.createElement('a');
  link.href = activeViewerDoc.imageData;
  const sanitizedTitle = (activeViewerDoc.title || 'document').replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '_');
  link.download = `Sangalo_${sanitizedTitle}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast(currentLang === 'ne' ? 'कागजात डाउनलोड भयो 📥' : 'Document downloaded 📥');
}

async function downloadDocImageById(docId) {
  try {
    const doc = await getVaultDoc(docId);
    if (!doc || !doc.imageData) return;
    const link = document.createElement('a');
    link.href = doc.imageData;
    const sanitizedTitle = (doc.title || 'document').replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '_');
    link.download = `Sangalo_${sanitizedTitle}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(currentLang === 'ne' ? 'कागजात डाउनलोड भयो 📥' : 'Document downloaded 📥');
  } catch (err) {
    console.error('Error downloading doc:', err);
  }
}

function confirmDeleteDoc(docId, docTitle) {
  requestConfirm(
    currentLang === 'ne' ? 'कागजात हटाउने?' : 'Delete Document?',
    currentLang === 'ne' ? `"${docTitle}" भण्डारबाट सधैंका लागि हट्नेछ।` : `"${docTitle}" will be removed from your secure vault.`,
    async () => {
      try {
        await deleteVaultDoc(docId);
        renderVaultDocs();
        showToast(currentLang === 'ne' ? 'कागजात हटाइयो' : 'Document deleted');
      } catch (err) {
        console.error('Error deleting doc:', err);
      }
    }
  );
}

function deleteCurrentViewerDoc() {
  if (!activeViewerDoc) return;
  const docId = activeViewerDoc.id;
  const docTitle = activeViewerDoc.title;
  closeViewDocModal();
  confirmDeleteDoc(docId, docTitle);
}

// ---------------------------------------------------------------------
// 13. UNIVERSAL CONFIRMATION DIALOG, CLIPBOARD, THEME & TRANSLATIONS
// ---------------------------------------------------------------------
let pendingConfirmCallback = null;

function requestConfirm(title, msg, onConfirm) {
  const modal = document.getElementById('confirmActionModal');
  const titleEl = document.getElementById('confirmModalTitle');
  const msgEl = document.getElementById('confirmModalMsg');
  if (titleEl) titleEl.innerText = title || (currentLang === 'ne' ? 'हटाउन निश्चित हुनुहुन्छ?' : 'Are you sure?');
  if (msgEl) msgEl.innerText = msg || (currentLang === 'ne' ? 'यो विवरण सधैंका लागि हट्नेछ।' : 'This record will be permanently deleted.');
  pendingConfirmCallback = onConfirm;
  if (modal) modal.classList.remove('hidden');
}

function closeConfirmModal(confirmed) {
  const modal = document.getElementById('confirmActionModal');
  if (modal) modal.classList.add('hidden');
  if (confirmed && typeof pendingConfirmCallback === 'function') {
    pendingConfirmCallback();
  }
  pendingConfirmCallback = null;
}

function copyToClipboard(text, successMsg) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg || (currentLang === 'ne' ? 'कपी भयो!' : 'Copied!'));
    }).catch(() => fallbackCopy(text, successMsg));
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast(successMsg || (currentLang === 'ne' ? 'कपी भयो!' : 'Copied!'));
  } catch (err) {}
  document.body.removeChild(ta);
}

function openExternalLink(url) {
  if (!url) return;
  if (window.AndroidBridge && typeof window.AndroidBridge.openExternalUrl === 'function') {
    window.AndroidBridge.openExternalUrl(url);
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
window.openExternalLink = openExternalLink;

async function shareSangaloApp() {
  const shareData = {
    title: 'सँगालो (Sangalo) 🇳🇵',
    text: 'नेपाली घरपरिवारका लागि दैनिक डिजिटल साथी (पात्रो, औषधि अलार्म, हिसाब, कागजात भण्डार) — सँगालो एप डाउनलोड गर्नुहोस्:\nhttps://github.com/dahalsandesh/sangalo/releases/latest/download/Sangalo.apk',
    url: 'https://github.com/dahalsandesh/sangalo/releases/latest/download/Sangalo.apk'
  };
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (e) {
      // User cancelled share dialog or unsupported
    }
  }
  copyToClipboard(shareData.url, currentLang === 'ne' ? 'सँगालो डाउनलोड लिंक कपी भयो!' : 'Download link copied to clipboard!');
}
window.shareSangaloApp = shareSangaloApp;

function initTheme() {
  if (state.theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  state.theme = isDark ? 'dark' : 'light';
  saveState();
  drawBaghBoard();
}

function updateAllTranslations() {
  const bsDate = getBikramSambatDate();
  const headerDateEl = document.getElementById('headerDateDual');
  if (headerDateEl) {
    headerDateEl.innerHTML = currentLang === 'ne' 
      ? `<span>${bsDate.devanagariFormatted}</span> <span class="text-[9px] opacity-75">📅</span>`
      : `<span>${bsDate.englishFormatted} • ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span> <span class="text-[9px] opacity-75">📅</span>`;
  }

  const langBtn = document.getElementById('langToggleBtn');
  if (langBtn) {
    langBtn.innerText = currentLang === 'ne' ? 'English' : 'नेपाली';
  }

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key && t(key)) el.innerText = t(key);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key && t(key)) el.placeholder = t(key);
  });

  renderShopping();
  renderBudget();
  renderBorrowLend();
  renderFullCalendarGrid();
  renderRemindersList();
  renderHealthSection();
  renderMedicineRoutine();
  renderVehicleList();
  renderHomeServices();
  renderVaultDocs();
  updateBaghStats();
  initPetEngine();
  updatePukuHappinessDisplay();
}

function showToast(msg) {
  let toast = document.getElementById('sangaloToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'sangaloToast';
    toast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold rounded-2xl shadow-xl transition-all duration-300 pointer-events-none opacity-0';
    document.body.appendChild(toast);
  }

  toast.innerText = msg;
  toast.classList.remove('opacity-0', 'translate-y-2');
  toast.classList.add('opacity-100', 'translate-y-0');

  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-2');
  }, 2200);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ---------------------------------------------------------------------
// 14. TAB SWITCHING & ROUTING
// ---------------------------------------------------------------------
function setTab(tabName) {
  const tabs = ['shopping', 'budget', 'calendar', 'chautari', 'vault'];
  tabs.forEach(t => {
    const view = document.getElementById('view-' + t);
    const navBtn = document.getElementById('navBtn-' + t);
    if (t === tabName) {
      if (view) view.classList.remove('hidden');
      if (navBtn) {
        navBtn.classList.add('text-emerald-600', 'dark:text-emerald-400');
        navBtn.classList.remove('text-slate-400', 'dark:text-zinc-500');
      }
    } else {
      if (view) view.classList.add('hidden');
      if (navBtn) {
        navBtn.classList.remove('text-emerald-600', 'dark:text-emerald-400');
        navBtn.classList.add('text-slate-400', 'dark:text-zinc-500');
      }
    }
  });

  if (window.location.hash !== '#' + tabName) {
    history.replaceState(null, '', '#' + tabName);
  }

  if (tabName === 'shopping') renderShopping();
  if (tabName === 'budget') {
    renderBudget();
    renderBorrowLend();
  }
  if (tabName === 'calendar') {
    renderFullCalendarGrid();
    renderHealthSection();
    renderMedicineRoutine();
  }
  if (tabName === 'chautari') {
    setTimeout(drawBaghBoard, 60);
  }
  if (tabName === 'vault') {
    renderVault();
    renderVehicleList();
    renderHomeServices();
    renderVaultDocs();
    const alarmTgl = document.getElementById('alarmMasterToggle');
    if (alarmTgl) alarmTgl.checked = state.alarmsEnabled !== false;
  }
}

function handleHashChange() {
  const hash = window.location.hash.replace('#', '').trim();
  if (['shopping', 'budget', 'calendar', 'chautari', 'vault'].includes(hash)) {
    setTab(hash);
  } else {
    setTab('shopping');
  }
}

// Global aliases
window.tapPetInteractive = interactWithPet;
window.tapPuku = interactWithPet;

// ---------------------------------------------------------------------
// 15. INITIALIZATION
// ---------------------------------------------------------------------
function initApp() {
  initTheme();
  initCalendarState();
  updateAllTranslations();
  handleHashChange();
  window.addEventListener('hashchange', handleHashChange);

  // Setup Bagh-Chal Canvas Pointerdown Touch Listener (No touch delay!)
  const canvas = document.getElementById('baghCanvas');
  if (canvas) {
    canvas.addEventListener('pointerdown', handleBaghBoardClick);
    initBaghChal('vs_tiger_bot');
  }

  // Check if running inside Standalone APK or Web
  const isStandalone = window.location.protocol === 'file:' || 
                       (window.AndroidBridge && typeof window.AndroidBridge.isNativeApp === 'function' && window.AndroidBridge.isNativeApp());
  
  if (isStandalone) {
    const apkAction = document.getElementById('apkDownloadCardAction');
    if (apkAction) {
      apkAction.innerHTML = `
        <div class="space-y-2">
          <div class="p-2.5 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 rounded-xl text-xs font-bold text-emerald-900 dark:text-emerald-200 text-center">
            ✅ तपाईंले अहिले मोबाइल एप (.apk v1.0.0) चलाइरहनुभएको छ
          </div>
          <button type="button" onclick="shareSangaloApp()" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5 active:scale-95">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>
            <span>📲 साथी तथा परिवारलाई एप सेयर गर्नुहोस् (Share App)</span>
          </button>
        </div>
      `;
    }
  }

  // Restore Sticky Notification if enabled (on Android Native Bridge or HTTP/HTTPS)
  if (state.stickyNotifEnabled && (isAndroidNativeApp() || window.location.protocol.startsWith('http'))) {
    showStickyCalendarNotification();
  }

  // Initialize Automated Reminders & Medicine Alarms
  initAlarmEngine();

  // Register offline Service Worker only on HTTP/HTTPS
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').then(reg => {
      reg.update().catch(() => {});
    }).catch(() => {});
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
