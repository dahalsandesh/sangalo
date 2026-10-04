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
    appVersionTitle: "एप संस्करण तथा अपडेट",
    checkUpdateBtn: "अपडेट जाँच गर्नुहोस्",
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
    doneBtn: "सकियो (Done)",
    forexBtn: "विदेशी विनिमय",
    unitConverterBtn: "जग्गा र सुन नाप",
    dateConverterBtn: "मिति रूपान्तरण",
    weatherModalTitle: "मौसम, वायु गुणस्तर र पञ्चाङ्ग",
    forexModalTitle: "विदेशी विनिमय दर (Forex Rates)",
    unitModalTitle: "नेपाली नाप रूपान्तरण (Unit Converter)",
    dateConverterModalTitle: "मिति रूपान्तरण (Date Converter)",
    remittanceCalcTitle: "रेमिट्यान्स / रकम हिसाब (Calculator)",
    currentTemp: "तापक्रम",
    humidityWind: "आर्द्रता र हावा",
    aqiTitle: "वायु गुणस्तर (Air Quality / AQI)",
    panchangaTitle: "दैनिक पञ्चाङ्ग तथा मुहूर्तः",
    sunrise: "सूर्योदय (Sunrise)",
    sunset: "सूर्यास्त (Sunset)",
    dayLength: "दिनमान (Day Length)",
    tithi: "आजको तिथि (Tithi)",
    rahuKaal: "राहु काल (अशुभ समय)",
    abhijitMuhurat: "शुभ मुहूर्त (अभिजीत)",
    nakshatra: "आजको नक्षत्र (Nakshatra)",
    moonPhaseTitle: "चन्द्रकला (Moon Phase)",
    upcomingHolidaysTitle: "आगामी सार्वजनिक बिदाहरू",
    upcomingSectionTitle: "आगामी चाडपर्व तथा सम्झनाहरू",
    upcomingTabAll: "सबै",
    upcomingTabHolidays: "सार्वजनिक बिदा",
    upcomingTabReminders: "मेरा सम्झना",
    govCalendarBadge: "नेपाल सरकार क्यालेन्डर",
    goldSilverBtn: "सुनचाँदी भाउ",
    goldModalTitle: "सुनचाँदी भाउ तथा हिसाब",
    emergencyBtn: "आकस्मिक सेवा",
    emergencyModalTitle: "नेपाल आकस्मिक तथा अत्यावश्यक सेवाहरू",
    closeBtn: "बन्द गर्नुहोस् (Close)",
    refreshBtn: "ताजा गर्नुहोस्",
    majorCurrencies: "प्रमुख विदेशी मुद्राहरू:",
    remitEquivalent: "नेपाली रुपैयाँमा:",

    // Daily Wellness & Focus
    dailyWellnessTitle: "दैनिक स्वास्थ्य तथा कार्यदक्षता",
    dailyWellnessSub: "पोमोडोरो एकाग्रता, पानी पिउने ट्र्याकर र आँखा आराम",
    openWellnessBtn: "खोल्नुहोस्",
    pomodoroMini: "पोमोडोरो",
    waterMini: "पानी ट्र्याकर",
    eyeMini: "आँखा आराम",
    wellnessModalTitle: "दैनिक स्वास्थ्य तथा ध्यान (Wellness & Focus)",
    wellnessModalSub: "पोमोडोरो, पानी पिउने सम्झना र आँखा आराम",
    wellnessTabPomodoro: "🍅 पोमोडोरो",
    wellnessTabWater: "💧 पानी ट्र्याकर",
    wellnessTabEye: "👁️ आँखा आराम",
    pomodoroFocusPreset: "२५ मि (फोकस)",
    pomodoroShortPreset: "५ मि (विश्राम)",
    pomodoroLongPreset: "१५ मि (लामो)",
    pomodoroResetBtn: "रिसेट (Reset)",
    pomodoroStart: "सुरु गर्नुहोस्",
    pomodoroPause: "रोक्नुहोस्",
    pomodoroResume: "पुनः सुरु",
    waterGoalText: "आज पिएको पानी (दैनिक लक्ष्य: ८ गिलास / २ लिटर)",
    waterAddOne: "💧 +१ गिलास थप्नुहोस्",
    waterSubOne: "-१ घटाउनुहोस्",
    waterHourlyTitle: "घन्टे पानी सम्झना (Hourly Chime)",
    waterHourlySub: "हरेक १ घण्टामा पानी पिउन घन्टी बजाउने",
    eyeRuleTitle: "२०-२०-२० नियम (20-20-20 Screen Rule)",
    eyeRuleDesc: "हरेक २० मिनेट स्क्रिन हेरेपछि, कम्तीमा २० फिट टाढा कुनै वस्तुलाई २० सेकेन्ड हेर्नुहोस्। यसले आँखाको थकान र टाउको दुखाइ हटाउँछ।",
    eyeNextBreakLabel: "अर्को आराम सम्झना:",
    eyeStartBtn: "आँखा आराम सम्झना सुरु गर्नुहोस्",
    eyeStopBtn: "आँखा आराम रोक्नुहोस्",

    // Gold & Silver Rates & Calculator
    goldLiveBadge: "प्रत्यक्ष FENEGOSIDA",
    goldOfficialRate: "आधिकारिक बजार दर:",
    goldTolaBtn: "तोला (Tola)",
    gold10gBtn: "१० ग्राम (10g)",
    gold24kLabel: "छापावाल सुन (24K)",
    gold22kLabel: "तेजाबी सुन (22K)",
    silverLabel: "चाँदी (Silver)",
    goldPerTola: "प्रति तोला",
    goldPer10g: "प्रति १० ग्राम",
    jewelryCalcTitle: "💍 गहना मूल्य हिसाब (Jewelry Calculator)",
    metalLabel: "धातु छनौट (Metal)",
    unitLabel: "तौल एकाइ (Unit)",
    weightLabel: "तौल (Weight)",
    wastageLabel: "जर्ती % (Wastage)",
    makingChargeLabel: "ज्याला (रू/Making)",
    netMetalCost: "शुद्ध धातु मूल्य (Net Metal):",
    wastageCost: "जर्ती बापत मूल्य (Wastage Cost):",
    makingCost: "ज्याला (Making Charge):",
    totalJewelryCost: "अनुमानित कुल रकम (Total):",

    // NEA Tariff Calculator
    neaModalTitle: "विद्युत महसुल हिसाब (NEA Tariff)",
    neaModalSub: "नेपाल विद्युत प्राधिकरण गार्हस्थ्य महसुल दर",
    meterCapacityLabel: "मिटर क्षमता (Ampere)",
    consumedUnitsLabel: "खपत युनिट (Units Consumed)",
    calcBillBtn: "महसुल हिसाब गर्नुहोस्",
    minServiceCharge: "न्यूनतम सेवा शुल्क (Service Charge):",
    energyCharge: "ऊर्जा शुल्क (Energy Charge):",
    totalBillAmount: "कुल तिर्नुपर्ने रकम (Total):",
    neaRebateTitle: "💡 छुट तथा जरिवाना नियम (NEA Rebate):",
    
    // Calendar & Dropdown
    calendarTodayBtn: "आज",
    nepaliCalendarBadge: "नेपाली पात्रो (वि.सं.)"
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
    appVersionTitle: "App Version & Updates",
    checkUpdateBtn: "Check for Updates",
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
    doneBtn: "Done",
    forexBtn: "Forex Rates",
    unitConverterBtn: "Unit Converter",
    dateConverterBtn: "Date Converter",
    weatherModalTitle: "Weather, Air Quality & Panchanga",
    forexModalTitle: "Foreign Exchange Rates (NRB)",
    unitModalTitle: "Nepali Unit Converter",
    dateConverterModalTitle: "BS ⇄ AD Date Converter",
    remittanceCalcTitle: "Remittance Calculator",
    currentTemp: "Temperature",
    humidityWind: "Humidity & Wind",
    aqiTitle: "Air Quality (AQI)",
    panchangaTitle: "Daily Panchanga & Timings:",
    sunrise: "Sunrise",
    sunset: "Sunset",
    dayLength: "Day Length",
    tithi: "Today's Tithi",
    rahuKaal: "Rahu Kaal (Inauspicious)",
    abhijitMuhurat: "Abhijit Muhurat (Auspicious)",
    nakshatra: "Today's Nakshatra",
    moonPhaseTitle: "Moon Phase",
    upcomingHolidaysTitle: "Upcoming Public Holidays",
    upcomingSectionTitle: "Upcoming Events & Festivals",
    upcomingTabAll: "All",
    upcomingTabHolidays: "Public Holidays",
    upcomingTabReminders: "My Reminders",
    govCalendarBadge: "Nepal Govt Calendar",
    goldSilverBtn: "Gold & Silver",
    goldModalTitle: "Gold & Silver Rates & Calculator",
    emergencyBtn: "Emergency Helplines",
    emergencyModalTitle: "Nepal Emergency & Helpline Directory",
    closeBtn: "Close",
    refreshBtn: "Refresh",
    majorCurrencies: "Major Currencies:",
    remitEquivalent: "Equivalent in NPR:",

    // Daily Wellness & Focus
    dailyWellnessTitle: "Daily Wellness & Focus",
    dailyWellnessSub: "Pomodoro focus timer, hydration tracker & eye rest",
    openWellnessBtn: "Open",
    pomodoroMini: "Pomodoro",
    waterMini: "Water",
    eyeMini: "Eye Rest",
    wellnessModalTitle: "Daily Wellness & Focus",
    wellnessModalSub: "Pomodoro timer, hydration tracker & 20-20-20 eye care",
    wellnessTabPomodoro: "🍅 Pomodoro",
    wellnessTabWater: "💧 Water Tracker",
    wellnessTabEye: "👁️ Eye Rest",
    pomodoroFocusPreset: "25m (Focus)",
    pomodoroShortPreset: "5m (Break)",
    pomodoroLongPreset: "15m (Long)",
    pomodoroResetBtn: "Reset",
    pomodoroStart: "Start Focus",
    pomodoroPause: "Pause",
    pomodoroResume: "Resume",
    waterGoalText: "Water Drank Today (Goal: 8 Glasses / 2L)",
    waterAddOne: "💧 +1 Glass",
    waterSubOne: "-1 Glass",
    waterHourlyTitle: "Hourly Water Chime",
    waterHourlySub: "Gentle chime every hour during the day to stay hydrated",
    eyeRuleTitle: "20-20-20 Screen Eye Rule",
    eyeRuleDesc: "Every 20 minutes of screen time, look at an object 20 feet away for 20 seconds to prevent digital eye strain.",
    eyeNextBreakLabel: "Next eye break in:",
    eyeStartBtn: "Start Eye Rest Timer",
    eyeStopBtn: "Stop Eye Rest Timer",

    // Gold & Silver Rates & Calculator
    goldLiveBadge: "Live FENEGOSIDA",
    goldOfficialRate: "Official Market Rates:",
    goldTolaBtn: "Tola",
    gold10gBtn: "10 Grams",
    gold24kLabel: "Fine Gold (24K)",
    gold22kLabel: "Tejabi Gold (22K)",
    silverLabel: "Silver",
    goldPerTola: "per tola",
    goldPer10g: "per 10g",
    jewelryCalcTitle: "💍 Jewelry Price Calculator",
    metalLabel: "Metal",
    unitLabel: "Weight Unit",
    weightLabel: "Weight",
    wastageLabel: "Wastage % (Jarti)",
    makingChargeLabel: "Making Charge (Rs.)",
    netMetalCost: "Net Metal Value:",
    wastageCost: "Wastage Cost:",
    makingCost: "Making Charge:",
    totalJewelryCost: "Estimated Total:",

    // NEA Tariff Calculator
    neaModalTitle: "Electricity Bill (NEA Tariff)",
    neaModalSub: "Official Nepal Electricity Authority Domestic Tariff",
    meterCapacityLabel: "Meter Capacity (Ampere)",
    consumedUnitsLabel: "Units Consumed (kWh)",
    calcBillBtn: "Calculate Bill",
    minServiceCharge: "Minimum Service Charge:",
    energyCharge: "Energy Charge:",
    totalBillAmount: "Total Amount Payable:",
    neaRebateTitle: "💡 Rebate & Penalty Guidelines:",
    
    // Calendar & Dropdown
    calendarTodayBtn: "Today",
    nepaliCalendarBadge: "Nepali Calendar (B.S.)"
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
  fontSize: 'normal',
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

// ---------------------------------------------------------------------
// NEPAL RASTRA BANK (NRB) OFFICIAL FOREX & REMITTANCE ENGINE
// ---------------------------------------------------------------------
const FOREX_STORAGE_KEY = 'sangalo_forex_cache_v1';
let forexState = {
  rates: [],
  date: null,
  isOffline: false
};

const defaultForexRates = [
  { iso3: 'USD', name: 'U.S. Dollar', unit: 1, buy: '134.20', sell: '134.80' },
  { iso3: 'QAR', name: 'Qatari Riyal', unit: 1, buy: '36.81', sell: '36.98' },
  { iso3: 'AED', name: 'UAE Dirham', unit: 1, buy: '36.54', sell: '36.70' },
  { iso3: 'SAR', name: 'Saudi Riyal', unit: 1, buy: '35.75', sell: '35.91' },
  { iso3: 'MYR', name: 'Malaysian Ringgit', unit: 1, buy: '31.25', sell: '31.39' },
  { iso3: 'AUD', name: 'Australian Dollar', unit: 1, buy: '89.50', sell: '89.90' },
  { iso3: 'EUR', name: 'European Euro', unit: 1, buy: '147.20', sell: '147.85' },
  { iso3: 'GBP', name: 'UK Pound Sterling', unit: 1, buy: '175.40', sell: '176.18' },
  { iso3: 'KWD', name: 'Kuwaiti Dinar', unit: 1, buy: '438.20', sell: '440.15' },
  { iso3: 'KRW', name: 'South Korean Won', unit: 100, buy: '10.15', sell: '10.20' },
  { iso3: 'JPY', name: 'Japanese Yen', unit: 10, buy: '9.25', sell: '9.29' },
  { iso3: 'INR', name: 'Indian Rupee', unit: 100, buy: '160.00', sell: '160.15' }
];

async function fetchForexRates(forceRefresh = false) {
  // Load cache first
  try {
    const cached = localStorage.getItem(FOREX_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && Array.isArray(parsed.rates) && parsed.rates.length > 0) {
        forexState = parsed;
        renderForexUI();
      }
    }
  } catch (e) {}

  if (forexState.rates.length === 0) {
    forexState.rates = defaultForexRates;
    renderForexUI();
  }

  // Fetch live from NRB Open API
  try {
    const res = await fetch('https://www.nrb.org.np/api/forex/v1/app-rate');
    if (res.ok) {
      const liveData = await res.json();
      if (Array.isArray(liveData) && liveData.length > 0) {
        forexState.rates = liveData;
        forexState.date = liveData[0].date || new Date().toISOString().split('T')[0];
        forexState.isOffline = false;
        try {
          localStorage.setItem(FOREX_STORAGE_KEY, JSON.stringify(forexState));
        } catch (e) {}
        renderForexUI();
      }
    }
  } catch (err) {
    forexState.isOffline = true;
    renderForexUI();
  }
}

function renderForexUI() {
  const tableBody = document.getElementById('forexTableBody');
  const summaryPill = document.getElementById('forexQuickSummary');
  const dateBadge = document.getElementById('forexDateBadge');

  if (dateBadge) {
    if (forexState.date) {
      dateBadge.innerText = currentLang === 'ne' 
        ? `नेपाल राष्ट्र बैंक आधिकारिक दर (${toDevanagariDigits(forexState.date)}${forexState.isOffline ? ' • अफलाइन' : ''})`
        : `NRB Official Rates (${forexState.date}${forexState.isOffline ? ' • Cached' : ''})`;
    }
  }

  // Quick summary pill on homepage
  if (summaryPill) {
    const usd = forexState.rates.find(r => r.iso3 === 'USD');
    const qar = forexState.rates.find(r => r.iso3 === 'QAR');
    if (usd && qar) {
      const uRate = parseFloat(usd.sell).toFixed(1);
      const qRate = parseFloat(qar.sell).toFixed(1);
      summaryPill.innerText = currentLang === 'ne'
        ? `USD: रू ${toDevanagariDigits(uRate)} • QAR: रू ${toDevanagariDigits(qRate)}`
        : `USD: Rs ${uRate} • QAR: Rs ${qRate}`;
    }
  }

  if (!tableBody) return;

  const targetCurrencies = ['USD', 'QAR', 'AED', 'SAR', 'MYR', 'AUD', 'EUR', 'GBP', 'KWD', 'KRW', 'JPY', 'INR'];
  let html = '';

  targetCurrencies.forEach(iso => {
    const r = forexState.rates.find(item => item.iso3 === iso) || defaultForexRates.find(item => item.iso3 === iso);
    if (!r) return;

    const buyFormatted = currentLang === 'ne' ? toDevanagariDigits(r.buy) : r.buy;
    const sellFormatted = currentLang === 'ne' ? toDevanagariDigits(r.sell) : r.sell;
    const unitFormatted = currentLang === 'ne' ? toDevanagariDigits(r.unit) : r.unit;

    html += `
      <tr class="hover:bg-slate-50 dark:hover:bg-[#202024] transition">
        <td class="px-3 py-2">
          <div class="font-bold text-slate-900 dark:text-slate-100">${r.iso3}</div>
          <div class="text-[10px] text-slate-500 dark:text-slate-400 font-sans truncate max-w-[110px]">${r.name}</div>
        </td>
        <td class="px-2 py-2 text-center text-slate-600 dark:text-slate-300 font-bold">${unitFormatted}</td>
        <td class="px-2 py-2 text-right font-bold text-emerald-700 dark:text-emerald-300">रू ${buyFormatted}</td>
        <td class="px-3 py-2 text-right font-bold text-slate-800 dark:text-slate-200">रू ${sellFormatted}</td>
      </tr>
    `;
  });

  tableBody.innerHTML = html;
  calculateRemittance();
}

function calculateRemittance() {
  const amtInput = document.getElementById('remitAmountInput');
  const currSelect = document.getElementById('remitCurrencySelect');
  const resultEl = document.getElementById('remitResultText');
  if (!amtInput || !currSelect || !resultEl) return;

  const amt = parseFloat(amtInput.value) || 0;
  const iso = currSelect.value;
  const r = forexState.rates.find(item => item.iso3 === iso) || defaultForexRates.find(item => item.iso3 === iso);

  if (!r) {
    resultEl.innerText = 'रू ०';
    return;
  }

  const buyRate = parseFloat(r.buy) || parseFloat(r.sell) || 1;
  const unit = parseFloat(r.unit) || 1;
  const totalNpr = (amt * buyRate) / unit;

  const formatted = totalNpr.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  resultEl.innerText = currentLang === 'ne' ? `रू ${toDevanagariDigits(formatted)}` : `Rs. ${formatted}`;
}

function openForexModal() {
  const modal = document.getElementById('forexRatesModal');
  if (modal) {
    modal.classList.remove('hidden');
    renderForexUI();
  }
}

function closeForexModal() {
  const modal = document.getElementById('forexRatesModal');
  if (modal) modal.classList.add('hidden');
}


// ---------------------------------------------------------------------
// NEPALI UNIT CONVERTER ENGINE (Land & Gold)
// ---------------------------------------------------------------------
let activeConverterTab = 'hill';

function openUnitConverterModal() {
  const modal = document.getElementById('unitConverterModal');
  if (modal) modal.classList.remove('hidden');
}

function closeUnitConverterModal() {
  const modal = document.getElementById('unitConverterModal');
  if (modal) modal.classList.add('hidden');
}

function switchConverterTab(tab) {
  activeConverterTab = tab;
  ['hill', 'terai', 'gold'].forEach(t => {
    const view = document.getElementById('convView-' + t);
    const btn = document.getElementById('tabBtn-conv-' + t);
    if (t === tab) {
      if (view) view.classList.remove('hidden');
      if (btn) {
        btn.classList.add('bg-white', 'dark:bg-[#121215]', 'text-emerald-700', 'dark:text-emerald-300', 'shadow-2xs');
        btn.classList.remove('text-slate-500', 'dark:text-slate-400');
      }
    } else {
      if (view) view.classList.add('hidden');
      if (btn) {
        btn.classList.remove('bg-white', 'dark:bg-[#121215]', 'text-emerald-700', 'dark:text-emerald-300', 'shadow-2xs');
        btn.classList.add('text-slate-500', 'dark:text-slate-400');
      }
    }
  });
}

function convertFromRopani() {
  const ropani = parseFloat(document.getElementById('ropaniInput')?.value) || 0;
  const aana = parseFloat(document.getElementById('aanaInput')?.value) || 0;
  const paisa = parseFloat(document.getElementById('paisaInput')?.value) || 0;
  const daam = parseFloat(document.getElementById('daamInput')?.value) || 0;

  // 1 Ropani = 5476 sq ft, 1 Aana = 342.25 sq ft, 1 Paisa = 85.5625 sq ft, 1 Daam = 21.390625 sq ft
  const totalSqFt = (ropani * 5476) + (aana * 342.25) + (paisa * 85.5625) + (daam * 21.390625);
  const totalSqM = totalSqFt * 0.092903;

  // Terai equivalent (1 Bigha = 72900 sq ft, 1 Kattha = 3645 sq ft, 1 Dhur = 182.25 sq ft)
  const bigha = Math.floor(totalSqFt / 72900);
  const remBigha = totalSqFt % 72900;
  const kattha = Math.floor(remBigha / 3645);
  const remKattha = remBigha % 3645;
  const dhur = (remKattha / 182.25).toFixed(1);

  const sqFtEl = document.getElementById('hillResultSqFt');
  const sqMEl = document.getElementById('hillResultSqM');
  const teraiEl = document.getElementById('hillResultTerai');

  const sqFtStr = totalSqFt.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  const sqMStr = totalSqM.toLocaleString('en-IN', { maximumFractionDigits: 2 });

  if (sqFtEl) sqFtEl.innerText = currentLang === 'ne' ? `${toDevanagariDigits(sqFtStr)} Sq. Ft` : `${sqFtStr} Sq. Ft`;
  if (sqMEl) sqMEl.innerText = currentLang === 'ne' ? `${toDevanagariDigits(sqMStr)} Sq. M` : `${sqMStr} Sq. M`;
  if (teraiEl) {
    teraiEl.innerText = currentLang === 'ne'
      ? `${toDevanagariDigits(bigha)} बिघा ${toDevanagariDigits(kattha)} कट्ठा ${toDevanagariDigits(dhur)} धुर`
      : `${bigha} Bigha ${kattha} Kattha ${dhur} Dhur`;
  }
}

function convertFromBigha() {
  const bigha = parseFloat(document.getElementById('bighaInput')?.value) || 0;
  const kattha = parseFloat(document.getElementById('katthaInput')?.value) || 0;
  const dhur = parseFloat(document.getElementById('dhurInput')?.value) || 0;

  const totalSqFt = (bigha * 72900) + (kattha * 3645) + (dhur * 182.25);
  const totalSqM = totalSqFt * 0.092903;

  // Hill equivalent (1 Ropani = 5476, 1 Aana = 342.25, 1 Paisa = 85.5625, 1 Daam = 21.390625)
  const ropani = Math.floor(totalSqFt / 5476);
  const remRopani = totalSqFt % 5476;
  const aana = Math.floor(remRopani / 342.25);
  const remAana = remRopani % 342.25;
  const paisa = Math.floor(remAana / 85.5625);
  const remPaisa = remAana % 85.5625;
  const daam = (remPaisa / 21.390625).toFixed(1);

  const sqFtEl = document.getElementById('teraiResultSqFt');
  const sqMEl = document.getElementById('teraiResultSqM');
  const hillEl = document.getElementById('teraiResultHill');

  const sqFtStr = totalSqFt.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  const sqMStr = totalSqM.toLocaleString('en-IN', { maximumFractionDigits: 2 });

  if (sqFtEl) sqFtEl.innerText = currentLang === 'ne' ? `${toDevanagariDigits(sqFtStr)} Sq. Ft` : `${sqFtStr} Sq. Ft`;
  if (sqMEl) sqMEl.innerText = currentLang === 'ne' ? `${toDevanagariDigits(sqMStr)} Sq. M` : `${sqMStr} Sq. M`;
  if (hillEl) {
    hillEl.innerText = currentLang === 'ne'
      ? `${toDevanagariDigits(ropani)} रोपनी ${toDevanagariDigits(aana)} आना ${toDevanagariDigits(paisa)} पैसा`
      : `${ropani} Ropani ${aana} Aana ${paisa} Paisa`;
  }
}

function convertFromGoldTola() {
  const tola = parseFloat(document.getElementById('goldTolaInput')?.value) || 0;
  const lal = tola * 100;
  const gram = tola * 11.664;

  const lalEl = document.getElementById('goldLalInput');
  const gramEl = document.getElementById('goldGramInput');
  const sumEl = document.getElementById('goldWeightSummary');

  if (lalEl) lalEl.value = lal.toFixed(1);
  if (gramEl) gramEl.value = gram.toFixed(3);
  if (sumEl) {
    const tolaStr = currentLang === 'ne' ? toDevanagariDigits(tola) : tola;
    const gramStr = currentLang === 'ne' ? toDevanagariDigits(gram.toFixed(3)) : gram.toFixed(3);
    sumEl.innerText = currentLang === 'ne' ? `${tolaStr} तोला (${gramStr} ग्राम)` : `${tolaStr} Tola (${gramStr} g)`;
  }
}

function convertFromGoldLal() {
  const lal = parseFloat(document.getElementById('goldLalInput')?.value) || 0;
  const tola = lal / 100;
  const gram = tola * 11.664;

  const tolaEl = document.getElementById('goldTolaInput');
  const gramEl = document.getElementById('goldGramInput');
  const sumEl = document.getElementById('goldWeightSummary');

  if (tolaEl) tolaEl.value = tola.toFixed(3);
  if (gramEl) gramEl.value = gram.toFixed(3);
  if (sumEl) {
    const tolaStr = currentLang === 'ne' ? toDevanagariDigits(tola.toFixed(2)) : tola.toFixed(2);
    const gramStr = currentLang === 'ne' ? toDevanagariDigits(gram.toFixed(3)) : gram.toFixed(3);
    sumEl.innerText = currentLang === 'ne' ? `${tolaStr} तोला (${gramStr} ग्राम)` : `${tolaStr} Tola (${gramStr} g)`;
  }
}

function convertFromGoldGram() {
  const gram = parseFloat(document.getElementById('goldGramInput')?.value) || 0;
  const tola = gram / 11.664;
  const lal = tola * 100;

  const tolaEl = document.getElementById('goldTolaInput');
  const lalEl = document.getElementById('goldLalInput');
  const sumEl = document.getElementById('goldWeightSummary');

  if (tolaEl) tolaEl.value = tola.toFixed(3);
  if (lalEl) lalEl.value = lal.toFixed(1);
  if (sumEl) {
    const tolaStr = currentLang === 'ne' ? toDevanagariDigits(tola.toFixed(2)) : tola.toFixed(2);
    const gramStr = currentLang === 'ne' ? toDevanagariDigits(gram.toFixed(3)) : gram.toFixed(3);
    sumEl.innerText = currentLang === 'ne' ? `${tolaStr} तोला (${gramStr} ग्राम)` : `${tolaStr} Tola (${gramStr} g)`;
  }
}


// ---------------------------------------------------------------------
// BIKRAM SAMBAT ⇄ AD DATE CONVERTER ENGINE
// ---------------------------------------------------------------------
let dateConvMode = 'bsToAd';

function openDateConverterModal() {
  const modal = document.getElementById('dateConverterModal');
  if (modal) {
    modal.classList.remove('hidden');
    renderDateConvInputs();
    calculateDateConversion();
  }
}

function closeDateConverterModal() {
  const modal = document.getElementById('dateConverterModal');
  if (modal) modal.classList.add('hidden');
}

function switchDateConvMode(mode) {
  dateConvMode = mode;
  const btnBsToAd = document.getElementById('tabBtn-conv-bsToAd');
  const btnAdToBs = document.getElementById('tabBtn-conv-adToBs');

  if (mode === 'bsToAd') {
    btnBsToAd?.classList.add('bg-white', 'dark:bg-[#121215]', 'text-emerald-700', 'dark:text-emerald-300', 'shadow-2xs');
    btnBsToAd?.classList.remove('text-slate-500', 'dark:text-slate-400');
    btnAdToBs?.classList.remove('bg-white', 'dark:bg-[#121215]', 'text-emerald-700', 'dark:text-emerald-300', 'shadow-2xs');
    btnAdToBs?.classList.add('text-slate-500', 'dark:text-slate-400');
  } else {
    btnAdToBs?.classList.add('bg-white', 'dark:bg-[#121215]', 'text-emerald-700', 'dark:text-emerald-300', 'shadow-2xs');
    btnAdToBs?.classList.remove('text-slate-500', 'dark:text-slate-400');
    btnBsToAd?.classList.remove('bg-white', 'dark:bg-[#121215]', 'text-emerald-700', 'dark:text-emerald-300', 'shadow-2xs');
    btnBsToAd?.classList.add('text-slate-500', 'dark:text-slate-400');
  }

  renderDateConvInputs();
  calculateDateConversion();
}

function renderDateConvInputs() {
  const container = document.getElementById('dateConvInputsContainer');
  if (!container) return;

  const todayBs = getBikramSambatDate();
  const now = new Date();

  if (dateConvMode === 'bsToAd') {
    // BS inputs (Year, Month, Day)
    let yOpts = '';
    for (let y = 2000; y <= 2090; y++) {
      const selected = y === todayBs.year ? 'selected' : '';
      const lbl = currentLang === 'ne' ? toDevanagariDigits(y) : y;
      yOpts += `<option value="${y}" ${selected}>${lbl}</option>`;
    }

    let mOpts = '';
    for (let m = 1; m <= 12; m++) {
      const selected = m === todayBs.month ? 'selected' : '';
      const lbl = currentLang === 'ne' ? nepaliMonths[m - 1] : nepaliMonthsEn[m - 1];
      mOpts += `<option value="${m}" ${selected}>${lbl}</option>`;
    }

    let dOpts = '';
    for (let d = 1; d <= 32; d++) {
      const selected = d === todayBs.day ? 'selected' : '';
      const lbl = currentLang === 'ne' ? toDevanagariDigits(d) : d;
      dOpts += `<option value="${d}" ${selected}>${lbl}</option>`;
    }

    container.innerHTML = `
      <div>
        <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">साल (Year BS)</label>
        <select id="convBsYear" onchange="calculateDateConversion()" class="w-full bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-xl p-2 text-xs font-bold text-slate-900 dark:text-slate-100">${yOpts}</select>
      </div>
      <div>
        <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">महिना (Month)</label>
        <select id="convBsMonth" onchange="calculateDateConversion()" class="w-full bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-xl p-2 text-xs font-bold text-slate-900 dark:text-slate-100">${mOpts}</select>
      </div>
      <div>
        <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">गते (Day)</label>
        <select id="convBsDay" onchange="calculateDateConversion()" class="w-full bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-xl p-2 text-xs font-bold text-slate-900 dark:text-slate-100">${dOpts}</select>
      </div>
    `;
  } else {
    // AD inputs (Year, Month, Day)
    let yOpts = '';
    const curAdYear = now.getFullYear();
    for (let y = 1944; y <= 2033; y++) {
      const selected = y === curAdYear ? 'selected' : '';
      yOpts += `<option value="${y}" ${selected}>${y}</option>`;
    }

    const adMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let mOpts = '';
    const curAdMonth = now.getMonth() + 1;
    for (let m = 1; m <= 12; m++) {
      const selected = m === curAdMonth ? 'selected' : '';
      mOpts += `<option value="${m}" ${selected}>${adMonths[m - 1]}</option>`;
    }

    let dOpts = '';
    const curAdDay = now.getDate();
    for (let d = 1; d <= 31; d++) {
      const selected = d === curAdDay ? 'selected' : '';
      dOpts += `<option value="${d}" ${selected}>${d}</option>`;
    }

    container.innerHTML = `
      <div>
        <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">Year (AD)</label>
        <select id="convAdYear" onchange="calculateDateConversion()" class="w-full bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-xl p-2 text-xs font-bold text-slate-900 dark:text-slate-100">${yOpts}</select>
      </div>
      <div>
        <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">Month</label>
        <select id="convAdMonth" onchange="calculateDateConversion()" class="w-full bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-xl p-2 text-xs font-bold text-slate-900 dark:text-slate-100">${mOpts}</select>
      </div>
      <div>
        <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">Day</label>
        <select id="convAdDay" onchange="calculateDateConversion()" class="w-full bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-xl p-2 text-xs font-bold text-slate-900 dark:text-slate-100">${dOpts}</select>
      </div>
    `;
  }
}

let lastConvertedBsDate = null;

function calculateDateConversion() {
  const resultMain = document.getElementById('dateConvResultMain');
  const resultSub = document.getElementById('dateConvResultSub');
  if (!resultMain || !resultSub) return;

  if (dateConvMode === 'bsToAd') {
    const y = parseInt(document.getElementById('convBsYear')?.value) || 2081;
    const m = parseInt(document.getElementById('convBsMonth')?.value) || 6;
    let d = parseInt(document.getElementById('convBsDay')?.value) || 18;

    const maxDays = getBsMonthDays(y, m);
    if (d > maxDays) d = maxDays;

    lastConvertedBsDate = { year: y, month: m, day: d };

    const adDate = bsToAdDate(y, m, d);
    const adFormatted = adDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const tithi = getLunarTithi(adDate);

    resultMain.innerText = adFormatted;
    resultSub.innerText = `${tithi.badge} • ${currentLang === 'ne' ? nepaliMonths[m - 1] : nepaliMonthsEn[m - 1]} ${currentLang === 'ne' ? toDevanagariDigits(d) : d}, ${currentLang === 'ne' ? toDevanagariDigits(y) : y}`;
  } else {
    const y = parseInt(document.getElementById('convAdYear')?.value) || 2024;
    const m = parseInt(document.getElementById('convAdMonth')?.value) || 10;
    const d = parseInt(document.getElementById('convAdDay')?.value) || 4;

    const adDate = new Date(y, m - 1, d);
    const bsDate = getBikramSambatDate(adDate);
    lastConvertedBsDate = { year: bsDate.year, month: bsDate.month, day: bsDate.day };

    const mName = currentLang === 'ne' ? nepaliMonths[bsDate.month - 1] : nepaliMonthsEn[bsDate.month - 1];
    const dStr = currentLang === 'ne' ? toDevanagariDigits(bsDate.day) : bsDate.day;
    const yStr = currentLang === 'ne' ? toDevanagariDigits(bsDate.year) : bsDate.year;
    const wName = currentLang === 'ne' ? nepaliWeekdays[adDate.getDay()] : nepaliWeekdaysEn[adDate.getDay()];
    const tithi = getLunarTithi(adDate);

    resultMain.innerText = `${mName} ${dStr}, ${yStr} (${wName})`;
    resultSub.innerText = `${tithi.badge} • ${adDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }
}

function jumpCalendarToConvertedDate() {
  if (lastConvertedBsDate) {
    calendarState.currentBsYear = lastConvertedBsDate.year;
    calendarState.currentBsMonth = lastConvertedBsDate.month;
    renderFullCalendarGrid();
    setTab('calendar');
    closeDateConverterModal();
  }
}

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

const FESTIVAL_EN_MAP = {
  "बुद्ध जयन्ती": "Buddha Jayanti",
  "बुद्ध जयन्ती / उभौली पर्व": "Buddha Jayanti / Ubhauli",
  "बुद्ध जयन्ती / उभौली": "Buddha Jayanti / Ubhauli",
  "जनैपूर्णिमा / रक्षाबन्धन": "Janai Purnima / Raksha Bandhan",
  "गाईजात्रा": "Gai Jatra",
  "श्रीकृष्ण जन्माष्टमी": "Krishna Janmashtami",
  "हरितालिका तीज": "Haritalika Teej",
  "ऋषि पञ्चमी": "Rishi Panchami",
  "इन्द्रजात्रा": "Indra Jatra",
  "घटस्थापना": "Ghatasthapana (Dashain Begins)",
  "फूलपाती": "Phulpati",
  "महाअष्टमी": "Maha Ashtami",
  "महानवमी": "Maha Navami",
  "विजया दशमी": "Vijaya Dashami (Dashain Tika)",
  "कोजाग्रत पूर्णिमा": "Kojagrat Purnima",
  "धनतेरस": "Dhanteras",
  "काग तिहार": "Kaag Tihar",
  "कुकुर तिहार": "Kukur Tihar",
  "कुकुर तिहार र लक्ष्मीपूजा": "Kukur Tihar & Laxmi Puja",
  "लक्ष्मीपूजा": "Laxmi Puja (Tihar)",
  "गाई पूजा": "Gai Puja",
  "गोवर्धन पूजा / म्हःपूजा": "Govardhan Puja / Mha Puja",
  "भाइटीका": "Bhai Tika",
  "छठ पर्व": "Chhath Parva",
  "बाला चतुर्दशी": "Bala Chaturdashi",
  "विवाह पञ्चमी": "Vivah Panchami",
  "उधौली पर्व / योमरी पुन्ही": "Udhauli / Yomari Punhi",
  "सोनाम ल्होसार": "Sonam Lhosar",
  "सरस्वती पूजा (श्रीपञ्चमी)": "Saraswati Puja / Shree Panchami",
  "सरस्वती पूजा / श्रीपञ्चमी": "Saraswati Puja / Shree Panchami",
  "महाशिवरात्रि": "Maha Shivaratri",
  "ग्याल्पो ल्होसार": "Gyalpo Lhosar",
  "फागु पूर्णिमा - पहाड": "Holi (Hilly Region)",
  "फागु पूर्णिमा - तराई": "Holi (Terai Region)",
  "फागु पूर्णिमा (होली)": "Holi Festival of Colors",
  "फागु पूर्णिमा": "Holi Festival",
  "घोडेजात्रा": "Ghode Jatra",
  "चैते दशैं": "Chaite Dashain",
  "रामनवमी": "Ram Navami",
  "नयाँ वर्ष": "Nepali New Year",
  "अन्तर्राष्ट्रिय श्रमिक दिवस": "International Labour Day",
  "राष्ट्रिय धान दिवस / असार १५": "National Paddy Day (Asar 15)",
  "खीर खाने दिन": "Kheer Khane Din (Shrawan 15)",
  "संविधान दिवस": "National Constitution Day",
  "तमु ल्होसार": "Tamu Lhosar",
  "माघे संक्रान्ति / माघी पर्व": "Maghe Sankranti",
  "शहीद दिवस": "Martyrs Day",
  "राष्ट्रिय प्रजातन्त्र दिवस": "National Democracy Day",
  "अन्तर्राष्ट्रिय नारी दिवस": "International Women's Day"
};

function getFestival(year, month, day, lang = currentLang) {
  const yStr = String(year);
  const mDStr = month + "-" + day;
  let raw = null;
  if (nepaliFestivalsByYear[yStr] && nepaliFestivalsByYear[yStr][mDStr]) {
    raw = nepaliFestivalsByYear[yStr][mDStr];
  } else if (nepaliSolarFestivals[mDStr]) {
    raw = nepaliSolarFestivals[mDStr];
  }
  if (!raw) return null;

  // Extract pure parts if raw has parenthetical format "नेपाली (English)"
  const match = raw.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    return lang === 'en' ? match[2].trim() : match[1].trim();
  }

  if (lang === 'en') {
    return FESTIVAL_EN_MAP[raw] || raw;
  }
  return raw;
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

// ---------------------------------------------------------------------
// LUNAR TITHI ENGINE (100% Offline Vedic Astronomy)
// ---------------------------------------------------------------------
const VEDIC_TITHIS = [
  "शुक्ल प्रतिपदा", "शुक्ल द्वितीया", "शुक्ल तृतीया", "शुक्ल चतुर्थी", "शुक्ल पञ्चमी",
  "शुक्ल षष्ठी", "शुक्ल सप्तमी", "शुक्ल अष्टमी", "शुक्ल नवमी", "शुक्ल दशमी",
  "शुक्ल एकादशी (एकादशी व्रत)", "शुक्ल द्वादशी", "शुक्ल त्रयोदशी", "शुक्ल चतुर्दशी", "पूर्णिमा (पूर्णिमा व्रत)",
  "कृष्ण प्रतिपदा", "कृष्ण द्वितीया", "कृष्ण तृतीया", "कृष्ण चतुर्थी", "कृष्ण पञ्चमी",
  "कृष्ण षष्ठी", "कृष्ण सप्तमी", "कृष्ण अष्टमी", "कृष्ण नवमी", "कृष्ण दशमी",
  "कृष्ण एकादशी (एकादशी व्रत)", "कृष्ण द्वादशी", "कृष्ण त्रयोदशी", "कृष्ण चतुर्दशी", "औंसी (दर्श / अमावस्या)"
];

function getLunarTithi(date) {
  const d = date ? new Date(date) : new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();

  // Astronomical Julian Date at Kathmandu Sunrise (06:01 NPT = 00:16 UTC, approx 0.25 UTC hours)
  // Udaya Tithi (सूर्योदय कालीन तिथि) determines the day's civil Tithi in authentic Vedic Panchanga
  const utcHour = 0.25;
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  const jd = jdn + (utcHour - 12.0) / 24.0;
  const T = (jd - 2451545.0) / 36525.0; // Julian centuries since J2000.0

  // 1. True Sun Longitude (Degrees)
  const L0 = (280.46646 + 36000.76983 * T) % 360;
  const M_sun = (357.52911 + 35999.05029 * T) % 360;
  const toRad = Math.PI / 180;
  const M_sun_rad = M_sun * toRad;
  const C_sun = (1.914602 - 0.004817 * T) * Math.sin(M_sun_rad) + (0.019993 - 0.000101 * T) * Math.sin(2 * M_sun_rad);
  const sun_true_lon = (L0 + C_sun + 360) % 360;

  // 2. True Moon Longitude with Jean Meeus / Surya Siddhanta Perturbations (Degrees)
  const L_moon = (218.3164477 + 481267.88123421 * T) % 360;
  const D = (297.8501921 + 445267.1114034 * T) % 360;      // Moon's mean elongation
  const M_moon = (134.9633964 + 477198.8675055 * T) % 360; // Moon's mean anomaly
  const F = (93.2720950 + 483202.0175233 * T) % 360;       // Moon's argument of latitude

  const moon_pert = 6.288774 * Math.sin(M_moon * toRad)
                  + 1.274027 * Math.sin((2 * D - M_moon) * toRad)
                  + 0.658314 * Math.sin(2 * D * toRad)
                  + 0.213618 * Math.sin(2 * M_moon * toRad)
                  - 0.185116 * Math.sin(M_sun * toRad)
                  - 0.114332 * Math.sin(2 * F * toRad)
                  + 0.058793 * Math.sin((2 * D - 2 * M_moon) * toRad)
                  + 0.057066 * Math.sin((2 * D - M_sun - M_moon) * toRad)
                  + 0.053322 * Math.sin((2 * D + M_moon) * toRad);

  const moon_true_lon = (L_moon + moon_pert + 360) % 360;

  // 3. True Elongation & Tithi Index (Each Tithi spans exactly 12 degrees)
  let elongation = (moon_true_lon - sun_true_lon) % 360;
  if (elongation < 0) elongation += 360;

  const index = Math.floor(elongation / 12) % 30;
  const name = VEDIC_TITHIS[index];
  const isShukla = index < 15;
  const isEkadashi = (index === 10 || index === 25);
  const isPurnima = (index === 14);
  const isAunsi = (index === 29);
  const phase = elongation / 360.0;

  let moonEmoji = '🌕';
  if (index === 29) moonEmoji = '🌑';
  else if (index >= 0 && index <= 5) moonEmoji = '🌒';
  else if (index >= 6 && index <= 8) moonEmoji = '🌓';
  else if (index >= 9 && index <= 13) moonEmoji = '🌔';
  else if (index === 14) moonEmoji = '🌕';
  else if (index >= 15 && index <= 20) moonEmoji = '🌖';
  else if (index >= 21 && index <= 23) moonEmoji = '🌗';
  else if (index >= 24 && index <= 28) moonEmoji = '🌘';

  let badge = name;
  if (isEkadashi) badge = "🌟 " + name;
  else if (isPurnima) badge = "🌕 " + name;
  else if (isAunsi) badge = "🌑 " + name;

  return { 
    index, 
    name, 
    paksha: isShukla ? "शुक्ल" : "कृष्ण", 
    isEkadashi, 
    isPurnima, 
    isAunsi, 
    badge, 
    phase, 
    elongation,
    moonEmoji,
    moonLon: moon_true_lon,
    sunLon: sun_true_lon
  };
}

const VEDIC_NAKSHATRAS_NE = [
  'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु', 'पुष्य',
  'आश्लेषा', 'मघा', 'पूर्वाफाल्गुनी', 'उत्तराफाल्गुनी', 'हस्त', 'चित्रा', 'स्वाती', 'विशाखा',
  'अनुराधा', 'ज्येष्ठा', 'मूल', 'पूर्वाषाढा', 'उत्तराषाढा', 'श्रवण', 'धनिष्ठा', 'शतभिषा',
  'पूर्वाभाद्रपदा', 'उत्तराभाद्रपदा', 'रेवती'
];
const VEDIC_NAKSHATRAS_EN = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya',
  'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha',
  'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

function getLunarNakshatra(date) {
  const tInfo = getLunarTithi(date);
  const ayanamsha = 24.23;
  let siderealMoon = (tInfo.moonLon - ayanamsha + 360) % 360;
  const index = Math.floor(siderealMoon / (360 / 27)) % 27;
  return {
    index,
    nameNe: VEDIC_NAKSHATRAS_NE[index],
    nameEn: VEDIC_NAKSHATRAS_EN[index],
    name: currentLang === 'ne' ? VEDIC_NAKSHATRAS_NE[index] : VEDIC_NAKSHATRAS_EN[index]
  };
}

// ---------------------------------------------------------------------
// WEATHER & SOLAR (SURYAUDAYA / SURYASTA) ENGINE
// ---------------------------------------------------------------------
function calculateOfflineSun(date, lat = 27.7172, lng = 85.3240) {
  const d = date ? new Date(date) : new Date();
  const startOfYear = new Date(d.getFullYear(), 0, 0);
  const diff = d - startOfYear;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  const declination = 23.45 * Math.sin(((360 / 365) * (dayOfYear - 81)) * (Math.PI / 180)) * (Math.PI / 180);
  const latRad = lat * (Math.PI / 180);
  const zenithRad = 90.833 * (Math.PI / 180);
  const cosH = (Math.cos(zenithRad) - Math.sin(latRad) * Math.sin(declination)) / (Math.cos(latRad) * Math.cos(declination));

  let H = 6.0;
  if (cosH >= -1 && cosH <= 1) {
    H = (Math.acos(cosH) * (180 / Math.PI)) / 15.0;
  }

  const B = ((360 / 365) * (dayOfYear - 81)) * (Math.PI / 180);
  const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  const localMeridian = 5.75 * 15.0;
  const timeCorrection = 4 * (lng - localMeridian) + eot;
  const solarNoonMinutes = 12 * 60 - timeCorrection;

  const sunriseMinutes = solarNoonMinutes - (H * 60);
  const sunsetMinutes = solarNoonMinutes + (H * 60);

  const formatHM = (mins) => {
    let h = Math.floor(mins / 60) % 24;
    let m = Math.floor(mins % 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  return { sunrise: formatHM(sunriseMinutes), sunset: formatHM(sunsetMinutes) };
}

// --- WEATHER, AIR QUALITY & VEDIC PANCHANGA ENGINE ---
let weatherState = {
  temp: null,
  apparentTemp: null,
  humidity: null,
  wind: null,
  weatherCode: 0,
  conditionText: 'सफा (Clear)',
  icon: '☀️',
  sunrise: '06:01',
  sunset: '17:45',
  dayLengthText: '११ घन्टा ४४ मिनेट',
  rahuKaalText: '१०:३० – १२:००',
  abhijitText: '११:४२ – १२:३०',
  tithiText: 'शुक्ल द्वितीया',
  aqiVal: null,
  pm25: null,
  pm10: null,
  aqiLevel: 'राम्रो (Good)'
};

function calculateOfflinePanchanga(dateObj) {
  const d = dateObj || new Date();
  const sun = calculateOfflineSun(d);
  
  // Parse sunrise & sunset in minutes
  const [sRh, sRm] = sun.sunrise.split(':').map(Number);
  const [sSh, sSm] = sun.sunset.split(':').map(Number);
  const sunriseMins = sRh * 60 + sRm;
  const sunsetMins = sSh * 60 + sSm;

  // Day length
  const dayLengthMins = Math.max(0, sunsetMins - sunriseMins);
  const dlHours = Math.floor(dayLengthMins / 60);
  const dlMinutes = dayLengthMins % 60;
  const dayLengthText = currentLang === 'ne'
    ? `${toDevanagariDigits(dlHours)} घन्टा ${toDevanagariDigits(dlMinutes)} मिनेट`
    : `${dlHours}h ${dlMinutes}m`;

  // Rahu Kaal calculation (Sunrise to Sunset divided into 8 equal slots)
  // Day of week: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  const rahuSlotMap = [7, 1, 6, 4, 5, 3, 2];
  const slotIndex = rahuSlotMap[d.getDay()];
  const slotLen = dayLengthMins / 8;
  const rahuStartMins = sunriseMins + slotIndex * slotLen;
  const rahuEndMins = rahuStartMins + slotLen;

  const fmtHM = (mins) => {
    const h = Math.floor(mins / 60) % 24;
    const m = Math.floor(mins % 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const rahuStart = fmtHM(rahuStartMins);
  const rahuEnd = fmtHM(rahuEndMins);
  const rahuKaalText = currentLang === 'ne'
    ? `${toDevanagariDigits(rahuStart)} – ${toDevanagariDigits(rahuEnd)}`
    : `${rahuStart} – ${rahuEnd}`;

  // Abhijit Muhurat calculation (midday ~48 mins centered on solar noon)
  const solarNoonMins = (sunriseMins + sunsetMins) / 2;
  const abhijitStart = fmtHM(solarNoonMins - 24);
  const abhijitEnd = fmtHM(solarNoonMins + 24);
  const abhijitText = currentLang === 'ne'
    ? `${toDevanagariDigits(abhijitStart)} – ${toDevanagariDigits(abhijitEnd)}`
    : `${abhijitStart} – ${abhijitEnd}`;

  const tithiInfo = getLunarTithi(d);
  const nakshatraInfo = getLunarNakshatra(d);

  return {
    sunrise: sun.sunrise,
    sunset: sun.sunset,
    dayLengthText,
    rahuKaalText,
    abhijitText,
    tithiText: `${tithiInfo.moonEmoji || ''} ${tithiInfo.badge || tithiInfo.name}`.trim(),
    nakshatraText: currentLang === 'ne' ? nakshatraInfo.nameNe : nakshatraInfo.nameEn,
    moonEmoji: tithiInfo.moonEmoji
  };
}

function updateWeatherSunUI() {
  const riseEl = document.getElementById('sunSunriseTime');
  const setEl = document.getElementById('sunSunsetTime');
  const tempValEl = document.getElementById('weatherTempVal');
  const iconSymbolEl = document.getElementById('weatherIconSymbol');
  const tithiEl = document.getElementById('calendarTodayTithi');

  if (riseEl && weatherState.sunrise) {
    riseEl.innerText = currentLang === 'ne' ? toDevanagariDigits(weatherState.sunrise) : weatherState.sunrise;
  }
  if (setEl && weatherState.sunset) {
    setEl.innerText = currentLang === 'ne' ? toDevanagariDigits(weatherState.sunset) : weatherState.sunset;
  }
  if (tempValEl && weatherState.temp !== null) {
    const tVal = Math.round(weatherState.temp);
    tempValEl.innerText = currentLang === 'ne' ? `${toDevanagariDigits(tVal)}°C` : `${tVal}°C`;
  }
  if (iconSymbolEl && weatherState.icon) {
    iconSymbolEl.innerText = weatherState.icon;
  }
  if (tithiEl && weatherState.tithiText) {
    tithiEl.innerText = weatherState.tithiText;
  }
}

async function fetchWeatherAndSun() {
  // 1. Initial 100% offline calculations immediately populate UI
  const now = new Date();
  const currentHour = now.getHours();
  const isNightOffline = currentHour < 6 || currentHour >= 18;
  const p = calculateOfflinePanchanga(now);
  weatherState.sunrise = p.sunrise;
  weatherState.sunset = p.sunset;
  weatherState.dayLengthText = p.dayLengthText;
  weatherState.rahuKaalText = p.rahuKaalText;
  weatherState.abhijitText = p.abhijitText;
  weatherState.tithiText = p.tithiText;
  weatherState.nakshatraText = p.nakshatraText;
  weatherState.moonEmoji = p.moonEmoji;
  weatherState.icon = isNightOffline ? '🌙' : '☀️';
  weatherState.conditionText = isNightOffline
    ? (currentLang === 'ne' ? 'सफा रात (Clear Night)' : 'Clear Night')
    : (currentLang === 'ne' ? 'सफा घाम (Clear)' : 'Clear Sky');
  updateWeatherSunUI();
  if (state.stickyNotifEnabled) {
    showStickyCalendarNotification(true);
  }

  // 2. Fetch Live Weather from Open-Meteo with is_day parameter
  try {
    const lat = 27.7172;
    const lng = 85.3240;
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=sunrise,sunset&timezone=Asia%2FKathmandu&forecast_days=1`;
    const res = await fetch(weatherUrl);
    if (res.ok) {
      const data = await res.json();
      if (data && data.current) {
        weatherState.temp = data.current.temperature_2m;
        weatherState.apparentTemp = data.current.apparent_temperature;
        weatherState.humidity = data.current.relative_humidity_2m;
        weatherState.wind = data.current.wind_speed_10m;
        weatherState.weatherCode = data.current.weather_code;

        // Interpret day vs night
        const isDay = data.current.is_day !== undefined 
          ? (data.current.is_day === 1) 
          : (new Date().getHours() >= 6 && new Date().getHours() < 18);
        const code = data.current.weather_code;

        if (code === 0) {
          weatherState.icon = isDay ? '☀️' : '🌙';
          weatherState.conditionText = isDay 
            ? (currentLang === 'ne' ? 'सफा घाम (Clear)' : 'Clear Sky')
            : (currentLang === 'ne' ? 'सफा रात (Clear Night)' : 'Clear Night');
        } else if (code <= 3) {
          weatherState.icon = isDay ? '🌤️' : '☁️';
          weatherState.conditionText = isDay 
            ? (currentLang === 'ne' ? 'आंशिक बदली (Partly Cloudy)' : 'Partly Cloudy')
            : (currentLang === 'ne' ? 'रात्रिकालीन बदली (Partly Cloudy)' : 'Partly Cloudy Night');
        } else if (code <= 48) {
          weatherState.icon = '🌫️';
          weatherState.conditionText = currentLang === 'ne' ? 'कुहिरो / हुस्सु (Foggy)' : 'Foggy / Haze';
        } else if (code <= 67) {
          weatherState.icon = '🌧️';
          weatherState.conditionText = currentLang === 'ne' ? 'पानी परेको (Rain)' : 'Rain';
        } else if (code <= 82) {
          weatherState.icon = isDay ? '🌦️' : '🌧️';
          weatherState.conditionText = currentLang === 'ne' ? 'क्षणिक वर्षा (Showers)' : 'Showers';
        } else {
          weatherState.icon = '⛈️';
          weatherState.conditionText = currentLang === 'ne' ? 'चट्याङ / वर्षा (Thunderstorm)' : 'Thunderstorm';
        }

        if (data.daily && data.daily.sunrise && data.daily.sunrise[0]) {
          weatherState.sunrise = data.daily.sunrise[0].split('T')[1];
        }
        if (data.daily && data.daily.sunset && data.daily.sunset[0]) {
          weatherState.sunset = data.daily.sunset[0].split('T')[1];
        }

        // Recompute panchanga with official sunrise/sunset
        const updatedP = calculateOfflinePanchanga(new Date());
        weatherState.dayLengthText = updatedP.dayLengthText;
        weatherState.rahuKaalText = updatedP.rahuKaalText;
        weatherState.abhijitText = updatedP.abhijitText;
        weatherState.nakshatraText = updatedP.nakshatraText;
        weatherState.moonEmoji = updatedP.moonEmoji;
        updateWeatherSunUI();
        if (state.stickyNotifEnabled) {
          showStickyCalendarNotification(true);
        }
      }
    }
  } catch (err) {
    // Offline resilience preserved
  }

  // 3. Fetch Live Air Quality (AQI) from Open-Meteo Air Quality API (Free, 0 Key)
  try {
    const lat = 27.7172;
    const lng = 85.3240;
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=pm2_5,pm10,european_aqi`;
    const resAqi = await fetch(aqiUrl);
    if (resAqi.ok) {
      const aqiData = await resAqi.json();
      if (aqiData && aqiData.current) {
        weatherState.pm25 = aqiData.current.pm2_5;
        weatherState.pm10 = aqiData.current.pm10;
        weatherState.aqiVal = aqiData.current.european_aqi;
      }
    }
  } catch (err) {
    // Stays offline
  }
}

function openWeatherDetailsModal() {
  const modal = document.getElementById('weatherDetailsModal');
  if (!modal) return;

  const tVal = weatherState.temp !== null ? Math.round(weatherState.temp) : 22;
  const tempStr = currentLang === 'ne' ? `${toDevanagariDigits(tVal)}°C` : `${tVal}°C`;
  
  const mTemp = document.getElementById('modalCurrentTemp');
  const mCond = document.getElementById('modalWeatherCondition');
  const mIcon = document.getElementById('modalWeatherIcon');
  const mHum = document.getElementById('modalHumidity');
  const mWind = document.getElementById('modalWind');
  const mRise = document.getElementById('modalSunriseTime');
  const mSet = document.getElementById('modalSunsetTime');
  const mDl = document.getElementById('modalDayLength');
  const mTithi = document.getElementById('modalTithiText');
  const mRahu = document.getElementById('modalRahuKaal');
  const mAbhijit = document.getElementById('modalAbhijitMuhurat');

  if (mTemp) mTemp.innerText = tempStr;
  if (mCond) mCond.innerText = weatherState.conditionText;
  if (mIcon) mIcon.innerText = weatherState.icon || '☀️';
  if (mHum) mHum.innerText = weatherState.humidity ? `${weatherState.humidity}%` : '६५%';
  if (mWind) mWind.innerText = weatherState.wind ? `${weatherState.wind} km/h` : '८ km/h';

  if (mRise) mRise.innerText = currentLang === 'ne' ? toDevanagariDigits(weatherState.sunrise) : weatherState.sunrise;
  if (mSet) mSet.innerText = currentLang === 'ne' ? toDevanagariDigits(weatherState.sunset) : weatherState.sunset;
  if (mDl) mDl.innerText = weatherState.dayLengthText;
  if (mTithi) mTithi.innerText = weatherState.tithiText;
  const mNak = document.getElementById('modalNakshatraText');
  if (mNak) mNak.innerText = weatherState.nakshatraText || (currentLang === 'ne' ? 'पुनर्वसु' : 'Punarvasu');
  const mMoon = document.getElementById('modalMoonPhaseText');
  if (mMoon) {
    const t = getLunarTithi(new Date());
    const moonEmoji = t.moonEmoji || '🌓';
    const moonName = currentLang === 'ne' ? t.name : (t.isShukla ? `Shukla ${t.name}` : `Krishna ${t.name}`);
    mMoon.innerText = `${moonEmoji} ${moonName}`;
  }
  if (mRahu) mRahu.innerText = weatherState.rahuKaalText;
  if (mAbhijit) mAbhijit.innerText = weatherState.abhijitText;

  // Render AQI details
  const mAqiVal = document.getElementById('modalAqiVal');
  const mPm25 = document.getElementById('modalPm25');
  const mPm10 = document.getElementById('modalPm10');
  const mAqiBadge = document.getElementById('modalAqiLevelBadge');
  const mAqiAdvice = document.getElementById('modalAqiAdvice');

  const aqiNum = weatherState.aqiVal || 52;
  const pm25Num = weatherState.pm25 !== null ? weatherState.pm25 : 18.4;
  const pm10Num = weatherState.pm10 !== null ? weatherState.pm10 : 28.6;

  if (mAqiVal) mAqiVal.innerText = currentLang === 'ne' ? toDevanagariDigits(aqiNum) : aqiNum;
  if (mPm25) mPm25.innerText = currentLang === 'ne' ? toDevanagariDigits(pm25Num.toFixed(1)) : pm25Num.toFixed(1);
  if (mPm10) mPm10.innerText = currentLang === 'ne' ? toDevanagariDigits(pm10Num.toFixed(1)) : pm10Num.toFixed(1);

  if (mAqiBadge && mAqiAdvice) {
    if (aqiNum <= 50) {
      mAqiBadge.innerText = currentLang === 'ne' ? 'राम्रो (Good)' : 'Good';
      mAqiBadge.className = 'text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-950 dark:text-emerald-200';
      mAqiAdvice.innerText = currentLang === 'ne'
        ? 'काठमाडौँको हावा स्वच्छ र श्वासप्रश्वासका लागि उत्तम छ।'
        : 'Air quality is ideal for all outdoor activities.';
    } else if (aqiNum <= 100) {
      mAqiBadge.innerText = currentLang === 'ne' ? 'सन्तोषजनक (Moderate)' : 'Moderate';
      mAqiBadge.className = 'text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-200';
      mAqiAdvice.innerText = currentLang === 'ne'
        ? 'वायु गुणस्तर स्वीकार्य छ; अति संवेदनशील व्यक्तिहरूले सावधानी अपनाउन सक्नुहुन्छ।'
        : 'Air quality is acceptable; sensitive groups may take light precautions.';
    } else {
      mAqiBadge.innerText = currentLang === 'ne' ? 'अस्वस्थ (Unhealthy)' : 'Unhealthy';
      mAqiBadge.className = 'text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-950 dark:text-rose-200';
      mAqiAdvice.innerText = currentLang === 'ne'
        ? 'धुवाँ र धुलो बढी छ। बाहिर निस्कँदा मास्क प्रयोग गर्न सिफारिस गरिन्छ।'
        : 'High particulate matter. Wearing a protective mask outdoors is recommended.';
    }
  }

  modal.classList.remove('hidden');
}

function closeWeatherDetailsModal() {
  const modal = document.getElementById('weatherDetailsModal');
  if (modal) modal.classList.add('hidden');
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
    const isSun = i === 0;
    let colorClass = 'text-slate-500 dark:text-zinc-400 font-semibold';
    if (isSat) {
      colorClass = 'text-rose-600 dark:text-rose-400 font-extrabold';
    } else if (isSun) {
      colorClass = 'text-rose-500/85 dark:text-rose-400/85 font-bold';
    }
    return `<div class="${colorClass}">${l}</div>`;
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
    html += `<div class="min-h-[58px] sm:min-h-[62px] rounded-xl bg-slate-50/40 dark:bg-zinc-900/10 border border-dashed border-slate-200/40 dark:border-zinc-800/40"></div>`;
  }

  // Active day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const adDate = bsToAdDate(year, month, day);
    const weekday = adDate.getDay();
    const isSaturday = weekday === 6;
    const isSunday = weekday === 0;
    const isToday = isCurrentMonth && (todayBs.day === day);

    const festKey = `${month}-${day}`;
    const festName = getFestival(year, month, day, currentLang);

    const dateKey = `${year}-${month}-${day}`;
    const userEvents = (state.events && state.events[dateKey]) || [];

    const devDay = toDevanagariDigits(day);
    const dayDisplay = currentLang === 'ne' ? devDay : day;
    const adDayNum = adDate.getDate();

    let borderClass = 'border-slate-200/90 dark:border-zinc-800/80';
    let bgClass = 'bg-white dark:bg-[#121215]';
    let textClass = 'text-slate-900 dark:text-zinc-200 font-bold';

    if (isSunday) {
      borderClass = 'border-rose-200/60 dark:border-rose-900/30';
      bgClass = 'bg-rose-50/30 dark:bg-rose-950/15';
      textClass = 'text-slate-900 dark:text-zinc-100 font-bold';
    }

    if (isSaturday) {
      borderClass = 'border-rose-200/80 dark:border-rose-900/40';
      bgClass = 'bg-rose-50/70 dark:bg-rose-950/25';
      textClass = 'text-rose-600 dark:text-rose-400 font-extrabold';
    }

    if (festName) {
      borderClass = 'border-amber-300/90 dark:border-amber-800/50';
      bgClass = isSaturday 
        ? 'bg-amber-50/80 dark:bg-amber-950/25' 
        : (isSunday ? 'bg-amber-50/75 dark:bg-amber-950/20' : 'bg-amber-50/70 dark:bg-amber-950/15');
      textClass = isSaturday 
        ? 'text-rose-600 dark:text-rose-400 font-extrabold' 
        : 'text-amber-800 dark:text-amber-300 font-extrabold';
    }

    if (isToday) {
      borderClass = 'border-emerald-500 ring-2 ring-emerald-500/25 dark:border-emerald-500/80 dark:ring-emerald-500/30';
      bgClass = 'bg-emerald-50/70 dark:bg-emerald-950/30';
      textClass = 'text-emerald-900 dark:text-emerald-200 font-black';
    }

    const tInfo = getLunarTithi(adDate);

    // Direct color-coded text lines (no bulky badge tags, fits more information cleanly)
    let eventLinesHtml = '';
    if (festName) {
      const festColor = isSaturday 
        ? 'text-rose-600 dark:text-rose-400 font-bold' 
        : 'text-amber-700 dark:text-amber-300 font-bold';
      eventLinesHtml += `<div class="text-[8.5px] ${festColor} truncate leading-tight select-none" title="${escapeHtml(festName)}">• ${escapeHtml(festName)}</div>`;
    }

    if (userEvents && userEvents.length > 0) {
      const ev = userEvents[0];
      const tLow = (ev.title || '').toLowerCase();
      let evColor = 'text-emerald-600 dark:text-emerald-400 font-bold';
      let evIcon = '• ';
      
      if (tLow.includes('जन्मदिन') || tLow.includes('birthday') || tLow.includes('bday') || tLow.includes('केक')) {
        evColor = 'text-purple-600 dark:text-purple-400 font-bold';
        evIcon = '🎂 ';
      } else if (tLow.includes('औषधि') || tLow.includes('medicine') || tLow.includes('चक्की') || tLow.includes('doc')) {
        evColor = 'text-sky-600 dark:text-sky-400 font-bold';
        evIcon = '💊 ';
      } else if (tLow.includes('पूजा') || tLow.includes('puja') || tLow.includes('व्रत') || tLow.includes('वर्तबन्ध')) {
        evColor = 'text-amber-600 dark:text-amber-400 font-bold';
        evIcon = '🪔 ';
      } else if (tLow.includes('बैठक') || tLow.includes('meeting') || tLow.includes('काम') || tLow.includes('office')) {
        evColor = 'text-indigo-600 dark:text-indigo-400 font-bold';
        evIcon = '💼 ';
      }

      eventLinesHtml += `<div class="text-[8.5px] ${evColor} truncate leading-tight select-none" title="${escapeHtml(ev.title)}">${evIcon}${escapeHtml(ev.title)}</div>`;
      
      if (userEvents.length > 1) {
        const extraCount = userEvents.length - 1;
        const extraText = currentLang === 'ne' ? `+${toDevanagariDigits(extraCount)} थप` : `+${extraCount} more`;
        eventLinesHtml += `<div class="text-[7.5px] text-slate-400 dark:text-zinc-500 font-mono leading-none select-none">${extraText}</div>`;
      }
    }

    html += `
      <div onclick="openDateDetails('${dateKey}', ${day}, '${festKey}')" 
           class="min-h-[62px] sm:min-h-[66px] p-1 sm:p-1.5 rounded-xl border ${borderClass} ${bgClass} cursor-pointer hover:border-emerald-400 dark:hover:border-zinc-600 flex flex-col justify-between transition-all select-none relative group active:scale-95 shadow-2xs">
        
        <!-- Top Row: Dynamic Moon Phase Emoji on Left, Gregorian (AD) Date on Right -->
        <div class="flex justify-between items-center leading-none">
          <span class="text-[10px] select-none opacity-85" title="${escapeHtml(tInfo.name)}">${tInfo.moonEmoji || '🌕'}</span>
          <span class="text-[9px] ${isSaturday ? 'text-rose-500 dark:text-rose-400 font-bold' : (isSunday ? 'text-rose-400 dark:text-rose-400/80 font-semibold' : 'text-slate-400 dark:text-zinc-500 font-mono')} ml-auto">${adDayNum}</span>
        </div>

        <!-- Center: Large, Bold Bikram Sambat Day Number -->
        <div class="flex items-center justify-center my-auto py-0.5 leading-none">
          <span class="text-sm sm:text-base ${textClass} tracking-tight select-none">${dayDisplay}</span>
        </div>

        <!-- Bottom Row: Direct Text Lines (No bulky badge tags, color-coded by category) -->
        <div class="space-y-0.5 overflow-hidden w-full leading-tight min-h-[14px]">
          ${eventLinesHtml}
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

function setQuickEventTitle(title) {
  const input = document.getElementById('eventTitleInput');
  if (input) {
    input.value = title;
    input.focus();
  }
}

function openDateDetails(dateKey, dayNum, festKey) {
  calendarState.selectedDateKey = dateKey;
  const parts = dateKey.split('-');
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);

  const modal = document.getElementById('calendarEventModal');
  const titleEl = document.getElementById('modalSelectedDate');
  const adEl = document.getElementById('modalSelectedDateAd');
  const festEl = document.getElementById('modalFestivalDesc');
  const input = document.getElementById('eventTitleInput');
  if (input) input.value = '';

  const mName = currentLang === 'ne' ? nepaliMonths[m - 1] : nepaliMonthsEn[m - 1];
  const dDev = currentLang === 'ne' ? toDevanagariDigits(d) : d;
  const yDev = currentLang === 'ne' ? toDevanagariDigits(y) : y;

  const adDate = bsToAdDate(y, m, d);
  const weekdayName = currentLang === 'ne' 
    ? ["आइतबार", "सोमबार", "मङ्गलबार", "बुधबार", "बिहीबार", "शुक्रबार", "शनिबार"][adDate.getDay()]
    : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][adDate.getDay()];

  if (titleEl) {
    titleEl.innerText = `${mName} ${dDev}, ${yDev} (${weekdayName})`;
  }

  if (adEl) {
    const adFormatted = adDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    adEl.innerText = `${adFormatted} (A.D.)`;
  }

  // Calculate Astronomical Panchanga for this specific day
  const p = calculateOfflinePanchanga(adDate);
  const tInfo = getLunarTithi(adDate);

  const tithiIcon = document.getElementById('modalTithiIcon');
  const tithiText = document.getElementById('modalTithiText');
  const nakshatraText = document.getElementById('modalNakshatraText');
  const sunTimes = document.getElementById('modalSunTimes');
  const rahuTime = document.getElementById('modalRahuTime');

  if (tithiIcon) tithiIcon.innerText = tInfo.moonEmoji || '🌕';
  if (tithiText) tithiText.innerText = tInfo.name || p.tithiText;
  if (nakshatraText) nakshatraText.innerText = p.nakshatraText ? `${p.nakshatraText} नक्षत्र` : (currentLang === 'ne' ? 'शुभ नक्षत्र' : 'Auspicious Nakshatra');
  if (sunTimes) {
    const sR = currentLang === 'ne' ? toDevanagariDigits(p.sunrise) : p.sunrise;
    const sS = currentLang === 'ne' ? toDevanagariDigits(p.sunset) : p.sunset;
    sunTimes.innerText = `${sR} - ${sS}`;
  }
  if (rahuTime) {
    const rTime = currentLang === 'ne' ? toDevanagariDigits(p.rahuKaalText) : p.rahuKaalText;
    rahuTime.innerText = `${currentLang === 'ne' ? 'राहु' : 'Rahu'}: ${rTime}`;
  }

  const festName = getFestival(y, m, d, currentLang);
  if (festEl) {
    if (festName) {
      festEl.innerHTML = `<span>🎉 ${escapeHtml(festName)}</span> <span class="text-[10px] px-2 py-0.5 ml-2 bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 rounded font-bold uppercase tracking-wider">${currentLang === 'ne' ? 'सार्वजनिक बिदा / चाडपर्व' : 'Public Holiday / Festival'}</span>`;
      festEl.classList.remove('hidden');
    } else {
      festEl.classList.add('hidden');
    }
  }

  renderModalEvents(dateKey);
  if (modal) modal.classList.remove('hidden');
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
  renderUpcomingHolidays();
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
    // Joyfully loving the petting: gentle loving tilt, wagging tail & paws, smiling face with tongue & closed happy eyes
    const petWiggle = Math.sin(Date.now() / 110) * 0.08;
    ctx.rotate(petWiggle);

    // Wagging Tail
    ctx.save();
    ctx.translate(-14, -2);
    ctx.rotate(Math.sin(Date.now() / 50) * 0.7);
    ctx.fillStyle = earColor;
    ctx.beginPath();
    ctx.ellipse(-6, -4, 4, 10, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Wiggling paws of pure joy
    const paw1 = Math.sin(Date.now() / 90) * 3;
    const paw2 = Math.cos(Date.now() / 90) * 3;
    ctx.fillStyle = earColor;
    ctx.fillRect(-10, 8 + paw1, 4, 8);
    ctx.fillRect(-6, 8 - paw1, 4, 8);
    ctx.fillRect(8, 8 + paw2, 4, 8);
    ctx.fillRect(12, 8 - paw2, 4, 8);

    // Body & Soft Belly
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(0, 4, 16, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = bellyColor;
    ctx.beginPath();
    ctx.ellipse(1, 6, 10, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head (Clear, loving, visible!)
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.arc(14, -6, 11, 0, Math.PI * 2);
    ctx.fill();

    // Snout & Cute Button Nose
    ctx.fillStyle = bellyColor;
    ctx.beginPath();
    ctx.ellipse(20, -4, 6, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(23, -5, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Happy Closed Arched Eyes (^ ^) of pure enjoyment
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(15, -8, 2.8, Math.PI, 0, false);
    ctx.stroke();

    // Cute Blushing Cheeks
    ctx.fillStyle = 'rgba(253, 164, 175, 0.85)';
    ctx.beginPath();
    ctx.arc(11, -3, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(19, -2, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Happy Panting Smile & Pink Tongue
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(18, -1.5, 2.5, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.ellipse(19, 0.5 + Math.sin(Date.now() / 80) * 0.8, 2.2, 3.2, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Floppy Ear resting back in bliss
    ctx.fillStyle = earColor;
    ctx.beginPath();
    ctx.ellipse(7, -7, 4.5, 9, 0.6 + Math.sin(Date.now() / 140) * 0.15, 0, Math.PI * 2);
    ctx.fill();
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
              class="px-2.5 py-1 bg-white dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 hover:border-emerald-500 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition shadow-2xs active:scale-95">
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
      <div class="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200">
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
        <div class="p-3 bg-white dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 rounded-2xl flex items-center justify-between gap-2 shadow-2xs transition">
          <div class="flex items-center space-x-3 min-w-0">
            <button onclick="toggleShoppingItem(${item.id})" class="w-6 h-6 flex-shrink-0 rounded-lg border-2 border-slate-300 dark:border-zinc-800 hover:border-emerald-500 flex items-center justify-center transition">
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
        <div class="p-2.5 bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-xl flex items-center justify-between gap-2">
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
      <div class="p-3.5 bg-white dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 rounded-2xl flex items-center justify-between shadow-2xs">
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
      <div class="p-3.5 bg-white dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 rounded-xl space-y-2 shadow-2xs ${opacityClass}">
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
        <div class="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-zinc-800 text-[11px]">
          <div>
            ${item.settled ? `
              <span class="text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
                <span>✓</span>
                <span>${currentLang === 'ne' ? 'फर्छ्यौट भइसक्यो (Settled)' : 'Settled'}</span>
              </span>
            ` : `
              <button onclick="toggleSettleBorrow(${item.id})" class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#18181b] hover:bg-emerald-100 text-slate-700 dark:text-slate-200 border border-transparent dark:border-zinc-800 font-semibold transition">
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
    <div class="p-3 bg-white dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 rounded-xl flex items-center justify-between shadow-xs">
      <div>
        <div class="text-xs font-bold text-slate-900 dark:text-slate-100">${escapeHtml(c.name)}</div>
        <div class="text-[10px] text-slate-500 dark:text-slate-300 font-medium">${escapeHtml(c.relation || '')} • <a href="tel:${escapeHtml(c.phone)}" class="text-emerald-600 dark:text-emerald-400 font-mono font-bold hover:underline">${escapeHtml(c.phone)}</a></div>
      </div>
      <a href="tel:${escapeHtml(c.phone)}" class="p-2 bg-emerald-50 dark:bg-[#18181b] border border-transparent dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 transition">
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
        <div class="p-3 bg-white dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 rounded-xl flex items-center justify-between gap-2 shadow-2xs ${isTaken ? 'bg-emerald-50/50 dark:bg-emerald-950/30' : ''}">
          <div class="flex items-center space-x-3 min-w-0">
            <button onclick="toggleMedicineTaken(${m.id})" class="w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center border-2 transition ${isTaken ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 dark:border-zinc-800 bg-slate-50 dark:bg-[#18181b] text-transparent hover:border-emerald-500'}">
              <span class="text-sm font-bold">✓</span>
            </button>
            <div class="min-w-0">
              <div class="flex items-center space-x-2">
                <span class="text-xs font-extrabold text-slate-900 dark:text-slate-100 truncate ${isTaken ? 'line-through text-slate-400 dark:text-slate-400' : ''}">${escapeHtml(m.name)}</span>
                <span class="px-1.5 py-0.5 rounded text-[9px] font-bold ${foodClass}">${foodLabel}</span>
              </div>
              <div class="text-[11px] text-slate-500 dark:text-slate-300 font-medium flex items-center flex-wrap gap-1.5 mt-0.5">
                <span class="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#18181b] text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-zinc-800">⏰ ${escapeHtml(timeDisplay)}</span>
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
      <div class="p-3.5 bg-white dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 rounded-2xl space-y-2.5 shadow-2xs">
        <div class="flex items-start justify-between">
          <div class="flex items-start space-x-2.5">
            <span class="text-2xl">${icon}</span>
            <div>
              <div class="flex items-center space-x-1.5">
                <h4 class="text-sm font-extrabold text-slate-900 dark:text-slate-100">${escapeHtml(v.name)}</h4>
                <span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-[#18181b] text-slate-600 dark:text-slate-300 border border-transparent dark:border-zinc-800">${typeLabel}</span>
              </div>
              <div class="mt-0.5">
                <span class="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-extrabold inline-block">
                  ${escapeHtml(v.plate)}
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-1">
            <button onclick="openVehicleModal(${v.id})" class="p-1.5 rounded-lg bg-slate-100 dark:bg-[#18181b] text-slate-600 dark:text-slate-300 border border-transparent dark:border-zinc-800 hover:bg-slate-200 text-xs font-semibold" title="Edit">
              ✏️
            </button>
            <button onclick="deleteVehicle(${v.id})" class="p-1.5 rounded-lg bg-slate-100 dark:bg-[#18181b] text-slate-600 dark:text-slate-300 border border-transparent dark:border-zinc-800 hover:text-rose-500 text-xs font-semibold" title="Delete">
              🗑️
            </button>
          </div>
        </div>

        ${v.notes ? `
          <div class="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#18181b] p-2 rounded-xl border border-slate-100 dark:border-zinc-800">
            🔧 <span class="font-medium">${escapeHtml(v.notes)}</span>
          </div>
        ` : ''}

        <div class="flex items-center justify-between pt-1">
          <button onclick="openVehicleDetailModal(${v.id})" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#18181b] hover:bg-slate-200 dark:hover:bg-[#202024] text-slate-700 dark:text-slate-300 border border-transparent dark:border-zinc-800 text-[11px] font-bold flex items-center space-x-1 transition">
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
    <div class="p-3 bg-white dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 rounded-xl flex items-center justify-between shadow-2xs">
      <div>
        <div class="text-xs font-bold text-slate-900 dark:text-slate-100">${escapeHtml(s.role)}: ${escapeHtml(s.name)}</div>
        <div class="text-[10px] text-slate-500 dark:text-slate-300 font-mono font-bold mt-0.5">
          <a href="tel:${escapeHtml(s.phone)}" class="text-emerald-600 dark:text-emerald-400 hover:underline">${escapeHtml(s.phone)}</a>
        </div>
      </div>
      <div class="flex items-center space-x-1.5">
        <a href="tel:${escapeHtml(s.phone)}" class="p-2 bg-emerald-50 dark:bg-[#18181b] text-emerald-600 dark:text-emerald-400 border border-transparent dark:border-zinc-800 rounded-xl hover:bg-emerald-100 transition" title="Call">
          📞
        </a>
        <button onclick="editHomeService(${s.id})" class="p-2 bg-slate-100 dark:bg-[#18181b] text-slate-600 dark:text-slate-300 border border-transparent dark:border-zinc-800 rounded-xl hover:bg-slate-200 transition" title="Edit">
          ✏️
        </button>
        <button onclick="deleteHomeService(${s.id})" class="p-2 bg-slate-100 dark:bg-[#18181b] text-slate-600 dark:text-slate-300 border border-transparent dark:border-zinc-800 hover:text-rose-500 rounded-xl hover:bg-slate-200 transition" title="Delete">
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

function showStickyCalendarNotification(isQuiet = false) {
  const bs = getBikramSambatDate();
  const festName = getFestival(bs.year, bs.month, bs.day);
  const tInfo = getLunarTithi(new Date());

  // Clean, high-signal single-line title
  const title = bs.devanagariGateFormatted || bs.devanagariFormatted;

  // Real-time temperature & weather icon
  const tempVal = weatherState.temp !== null ? Math.round(weatherState.temp) : 22;
  const tempStr = `${weatherState.icon || '☀️'} ${currentLang === 'ne' ? toDevanagariDigits(tempVal) : tempVal}°C`;
  const sunStr = `☼↑ ${toDevanagariDigits(weatherState.sunrise || '०६:०१')}  ☼↓ ${toDevanagariDigits(weatherState.sunset || '१७:४५')}`;

  // Format rich body with festival, Tithi, temperature & sunrise/sunset
  let body = '';
  if (festName) {
    body = `🌸 ${festName} • ${tInfo.badge || tInfo.name} • ${tempStr} • ${sunStr}`;
  } else if (tInfo.isEkadashi || tInfo.isPurnima || tInfo.isAunsi) {
    body = `${tInfo.badge} • ${tempStr} • ${sunStr}`;
  } else {
    body = `${tInfo.name} • ${tempStr} • ${sunStr}`;
  }

  // Sync 60-day calendar schedule to Android SharedPreferences for automatic midnight updates
  if (isAndroidNativeApp() && typeof window.AndroidBridge.syncCalendarSchedule === 'function') {
    try {
      const schedule = {};
      for (let i = 0; i < 60; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        const curBs = getBikramSambatDate(d);
        const fName = getFestival(curBs.year, curBs.month, curBs.day);
        const curTithi = getLunarTithi(d);
        const curPanchanga = calculateOfflinePanchanga(d);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dayNum = String(d.getDate()).padStart(2, '0');
        const key = `${y}-${m}-${dayNum}`;

        const curSunStr = `☼↑ ${toDevanagariDigits(curPanchanga.sunrise || '०६:०१')}  ☼↓ ${toDevanagariDigits(curPanchanga.sunset || '१७:४५')}`;
        let bText = '';
        if (fName) {
          bText = `🌸 ${fName} • ${curTithi.badge || curTithi.name} • ${curSunStr}`;
        } else if (curTithi.isEkadashi || curTithi.isPurnima || curTithi.isAunsi) {
          bText = `${curTithi.badge} • ${curSunStr}`;
        } else {
          bText = `${curTithi.name} • ${curSunStr}`;
        }

        schedule[key] = {
          title: curBs.devanagariGateFormatted || curBs.devanagariFormatted,
          body: bText,
          day: curBs.day
        };
      }
      window.AndroidBridge.syncCalendarSchedule(JSON.stringify(schedule));
    } catch (e) {
      console.warn('Sync calendar schedule error:', e);
    }
  }

  if (isAndroidNativeApp() && typeof window.AndroidBridge.showStickyNotification === 'function') {
    window.AndroidBridge.showStickyNotification(title, body, bs.day);
    if (!isQuiet) {
      showToast(currentLang === 'ne' ? 'आजको मिति बारमा राखियो 📌' : 'Today\'s date pinned in status bar 📌');
    }
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
    if (!isQuiet) {
      showToast(currentLang === 'ne' ? 'आजको मिति नोटिफिकेसन बारमा राखियो 📌' : 'Today\'s date pinned in notifications 📌');
    }
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
      btn.className = 'px-2.5 py-1 rounded-lg font-medium bg-slate-100 dark:bg-[#18181b] text-slate-600 dark:text-slate-300 border border-transparent dark:border-zinc-800 whitespace-nowrap hover:bg-slate-200 transition';
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
    other: { ne: 'अन्य', en: 'Other', color: 'bg-slate-100 dark:bg-[#18181b] text-slate-700 dark:text-slate-300' }
  };

  grid.innerHTML = filteredDocs.map(doc => {
    const catInfo = categoryNames[doc.category] || categoryNames.other;
    const catLabel = currentLang === 'ne' ? catInfo.ne : catInfo.en;
    return `
      <div class="group relative bg-white dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 hover:border-emerald-500/50 rounded-xl overflow-hidden shadow-2xs transition flex flex-col justify-between">
        <div onclick="viewFullDocPhoto('${doc.id}')" class="cursor-pointer">
          <div class="h-28 bg-slate-100 dark:bg-[#18181b] overflow-hidden relative flex items-center justify-center">
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
        <div class="px-2 pb-2 pt-1 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
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

function initFontSize() {
  const fs = state.fontSize || 'normal';
  document.documentElement.classList.remove('font-large', 'font-xl');
  if (fs === 'large') {
    document.documentElement.classList.add('font-large');
  } else if (fs === 'xl') {
    document.documentElement.classList.add('font-xl');
  }
  updateFontSizeBtnUI();
}

function updateFontSizeBtnUI() {
  const btn = document.getElementById('fontSizeBtn');
  if (!btn) return;
  const fs = state.fontSize || 'normal';
  if (fs === 'normal') {
    btn.innerText = 'A';
    btn.title = currentLang === 'ne' ? 'अक्षरको आकार: सामान्य (Normal)' : 'Font Size: Normal';
  } else if (fs === 'large') {
    btn.innerText = 'A+';
    btn.title = currentLang === 'ne' ? 'अक्षरको आकार: ठूलो (Large)' : 'Font Size: Large';
  } else if (fs === 'xl') {
    btn.innerText = 'A++';
    btn.title = currentLang === 'ne' ? 'अक्षरको आकार: धेरै ठूलो (Extra Large)' : 'Font Size: Extra Large';
  }
}

function cycleFontSize() {
  const current = state.fontSize || 'normal';
  if (current === 'normal') {
    state.fontSize = 'large';
    showToast(currentLang === 'ne' ? 'अक्षरको आकार: ठूलो (Large)' : 'Font Size: Large (A+)');
  } else if (current === 'large') {
    state.fontSize = 'xl';
    showToast(currentLang === 'ne' ? 'अक्षरको आकार: धेरै ठूलो (Extra Large)' : 'Font Size: Extra Large (A++)');
  } else {
    state.fontSize = 'normal';
    showToast(currentLang === 'ne' ? 'अक्षरको आकार: सामान्य (Normal)' : 'Font Size: Normal (A)');
  }
  saveState();
  initFontSize();
}

function updateAllTranslations() {
  const bsDate = getBikramSambatDate();
  const headerDateEl = document.getElementById('headerDateDual');
  if (headerDateEl) {
    const dayDev = toDevanagariDigits(bsDate.day);
    headerDateEl.innerHTML = currentLang === 'ne' 
      ? `<span>${bsDate.devanagariFormatted}</span> <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-400 dark:border-emerald-600/80 text-[10px] font-black text-emerald-800 dark:text-emerald-200 shadow-2xs">${dayDev}</span>`
      : `<span>${bsDate.englishFormatted} • ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span> <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-400 dark:border-emerald-600/80 text-[10px] font-black text-emerald-800 dark:text-emerald-200 shadow-2xs">${bsDate.day}</span>`;
  }

  const langBtn = document.getElementById('langToggleBtn');
  if (langBtn) {
    langBtn.innerText = currentLang === 'ne' ? 'English' : 'नेपाली';
  }

  const btnNe = document.getElementById('langBtn-ne');
  const btnEn = document.getElementById('langBtn-en');
  if (btnNe && btnEn) {
    if (currentLang === 'ne') {
      btnNe.className = 'px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs transition';
      btnEn.className = 'px-2 py-0.5 rounded-md text-slate-500 dark:text-zinc-400 font-medium hover:text-slate-900 dark:hover:text-zinc-200 transition';
    } else {
      btnEn.className = 'px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs transition';
      btnNe.className = 'px-2 py-0.5 rounded-md text-slate-500 dark:text-zinc-400 font-medium hover:text-slate-900 dark:hover:text-zinc-200 transition';
    }
  }

  const upAll = document.getElementById('upcomingTab-all');
  const upHol = document.getElementById('upcomingTab-holidays');
  const upRem = document.getElementById('upcomingTab-reminders');
  if (upAll) upAll.innerText = t('upcomingTabAll');
  if (upHol) upHol.innerText = t('upcomingTabHolidays');
  if (upRem) upRem.innerText = t('upcomingTabReminders');

  // Update Year Select options formatting
  const yearSelect = document.getElementById('calendarYearSelect');
  if (yearSelect) {
    const curVal = yearSelect.value;
    for (let opt of yearSelect.options) {
      const yNum = parseInt(opt.value, 10);
      opt.text = currentLang === 'ne' ? toDevanagariDigits(yNum) : String(yNum);
    }
    if (curVal) yearSelect.value = curVal;
  }

  // Update Month Select options formatting
  const monthSelect = document.getElementById('calendarMonthSelect');
  if (monthSelect) {
    const curMonth = monthSelect.value;
    for (let opt of monthSelect.options) {
      const mNum = parseInt(opt.value, 10);
      if (mNum >= 1 && mNum <= 12) {
        opt.text = currentLang === 'ne' 
          ? `${nepaliMonths[mNum - 1]} (${nepaliMonthsEn[mNum - 1]})`
          : `${nepaliMonthsEn[mNum - 1]} (${nepaliMonths[mNum - 1]})`;
      }
    }
    if (curMonth) monthSelect.value = curMonth;
  }

  updateFontSizeBtnUI();
  calculateJewelryPrice();

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
  renderUpcomingHolidays();
  const p = calculateOfflinePanchanga(new Date());
  weatherState.dayLengthText = p.dayLengthText;
  weatherState.rahuKaalText = p.rahuKaalText;
  weatherState.abhijitText = p.abhijitText;
  weatherState.tithiText = p.tithiText;
  weatherState.nakshatraText = p.nakshatraText;
  weatherState.moonEmoji = p.moonEmoji;
  updateWeatherSunUI();
  updateBaghStats();
  initPetEngine();
  updatePukuHappinessDisplay();
  updateWaterDisplay();
  updatePomodoroDisplay();
  updateEyeDisplay();
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
// UNIFIED UPCOMING EVENTS, HOLIDAYS & PERSONAL REMINDERS ENGINE
// ---------------------------------------------------------------------
let currentUpcomingFilter = 'all'; // 'all', 'holidays', 'reminders'

function setUpcomingFilter(filter) {
  currentUpcomingFilter = filter;
  ['all', 'holidays', 'reminders'].forEach(tab => {
    const el = document.getElementById(`upcomingTab-${tab}`);
    if (el) {
      if (tab === filter) {
        el.className = 'px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-400 font-bold shadow-2xs transition';
      } else {
        el.className = 'px-2.5 py-1 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200 font-medium transition';
      }
    }
  });
  renderUpcomingHolidays();
}

function renderUpcomingHolidays() {
  const container = document.getElementById('upcomingEventsContainer') || document.getElementById('holidaysQuickStrip');
  if (!container) return;

  const todayAd = new Date();
  todayAd.setHours(0, 0, 0, 0);

  const items = [];
  const curBs = getBikramSambatDate(todayAd);

  // 1. Gather verified official festivals for next 120 days
  for (let i = 0; i <= 120; i++) {
    const scanAd = new Date(todayAd);
    scanAd.setDate(scanAd.getDate() + i);
    const scanBs = getBikramSambatDate(scanAd);
    const festName = getFestival(scanBs.year, scanBs.month, scanBs.day, currentLang);

    if (festName) {
      const mName = currentLang === 'ne' ? nepaliMonths[scanBs.month - 1] : nepaliMonthsEn[scanBs.month - 1];
      const dStr = currentLang === 'ne' ? toDevanagariDigits(scanBs.day) : scanBs.day;
      const dateText = `${mName} ${dStr}`;
      const adFormatted = scanAd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      items.push({
        type: 'holiday',
        name: festName,
        dateText: `${dateText} (${adFormatted})`,
        daysLeft: i,
        dayNum: scanBs.day,
        year: scanBs.year,
        month: scanBs.month,
        dateKey: `${scanBs.year}-${scanBs.month}-${scanBs.day}`
      });
    }
  }

  // 2. Gather user personal reminders for next 120 days
  if (state.events) {
    Object.keys(state.events).forEach(key => {
      const parts = key.split('-').map(Number);
      if (parts.length === 3) {
        const y = parts[0], m = parts[1], d = parts[2];
        const evAd = bsToAdDate(y, m, d);
        evAd.setHours(0, 0, 0, 0);
        const diffDays = Math.round((evAd.getTime() - todayAd.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 120) {
          const mName = currentLang === 'ne' ? nepaliMonths[m - 1] : nepaliMonthsEn[m - 1];
          const dStr = currentLang === 'ne' ? toDevanagariDigits(d) : d;
          const adFormatted = evAd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          state.events[key].forEach(ev => {
            items.push({
              type: 'reminder',
              id: ev.id,
              name: ev.title,
              time: ev.time,
              dateText: `${mName} ${dStr} (${adFormatted})`,
              daysLeft: diffDays,
              dayNum: d,
              year: y,
              month: m,
              dateKey: key
            });
          });
        }
      }
    });
  }

  // Sort chronologically ascending
  items.sort((a, b) => a.daysLeft - b.daysLeft);

  // Filter based on active tab
  let filtered = items;
  if (currentUpcomingFilter === 'holidays') {
    filtered = items.filter(it => it.type === 'holiday');
  } else if (currentUpcomingFilter === 'reminders') {
    filtered = items.filter(it => it.type === 'reminder');
  }

  const displayItems = filtered.slice(0, 6);

  if (displayItems.length === 0) {
    let emptyMsg = currentLang === 'ne' ? 'हाल कुनै आगामी चाडपर्व वा सम्झना छैन' : 'No upcoming events or reminders';
    if (currentUpcomingFilter === 'holidays') {
      emptyMsg = currentLang === 'ne' ? 'हाल कुनै आगामी सार्वजनिक बिदा छैन' : 'No upcoming public holidays';
    } else if (currentUpcomingFilter === 'reminders') {
      emptyMsg = currentLang === 'ne' ? 'तपाईंले कुनै सम्झना थप्नुभएको छैन (पात्रोको मितिमा छोएर थप्नुहोस्)' : 'No reminders registered. Tap any date to add!';
    }
    container.innerHTML = `<div class="w-full text-center text-xs text-slate-400 dark:text-zinc-500 py-3 bg-slate-50 dark:bg-[#18181b]/50 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800">${emptyMsg}</div>`;
    return;
  }

  let html = '';
  displayItems.forEach(item => {
    let countdownBadge = '';
    if (item.daysLeft === 0) {
      countdownBadge = `<span class="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px]">${currentLang === 'ne' ? 'आज' : 'Today'}</span>`;
    } else if (item.daysLeft === 1) {
      countdownBadge = `<span class="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-extrabold text-[10px]">${currentLang === 'ne' ? 'भोलि' : 'Tomorrow'}</span>`;
    } else {
      const dLeftStr = currentLang === 'ne' ? `${toDevanagariDigits(item.daysLeft)} दिन बाँकी` : `${item.daysLeft} days left`;
      countdownBadge = `<span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold text-[10px] font-mono">${dLeftStr}</span>`;
    }

    const typeBadge = item.type === 'holiday'
      ? `<span class="inline-flex items-center text-[10px] text-rose-600 dark:text-rose-400 font-bold">🏛️ ${currentLang === 'ne' ? 'सार्वजनिक बिदा' : 'Public Holiday'}</span>`
      : `<span class="inline-flex items-center text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">📌 ${currentLang === 'ne' ? 'मेरो सम्झना' : 'My Reminder'}${item.time ? ' • ' + item.time : ''}</span>`;

    const clickAction = item.type === 'holiday'
      ? `jumpToCalendarFestival(${item.year}, ${item.month}, ${item.dayNum})`
      : `openDateDetails('${item.dateKey}', ${item.dayNum}, '${item.month}-${item.dayNum}')`;

    html += `
      <div onclick="${clickAction}" class="min-w-[215px] sm:min-w-[235px] max-w-[255px] snap-start flex-shrink-0 p-3 bg-slate-50 dark:bg-[#15171c] hover:bg-slate-100 dark:hover:bg-[#1c1e24] border border-slate-200 dark:border-zinc-800/80 rounded-2xl flex flex-col justify-between cursor-pointer transition select-none group shadow-2xs">
        <div class="flex justify-between items-center gap-1.5 mb-1.5">
          <span class="text-[11px] font-bold text-slate-500 dark:text-zinc-400 font-mono">${item.dateText}</span>
          ${countdownBadge}
        </div>
        <div class="text-xs font-extrabold text-slate-900 dark:text-zinc-100 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition mb-1" title="${escapeHtml(item.name)}">
          ${escapeHtml(item.name)}
        </div>
        <div class="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-zinc-800/60">
          ${typeBadge}
          <span class="text-[10px] text-slate-400 group-hover:translate-x-0.5 transition">→</span>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function jumpToCalendarFestival(year, month, day) {
  calendarState.currentBsYear = year;
  calendarState.currentBsMonth = month;
  renderFullCalendarGrid();
  setTab('calendar');
  const dateKey = `${year}-${month}-${day}`;
  openDateDetails(dateKey, day, `${month}-${day}`);
}

function openEmergencyModal() {
  const modal = document.getElementById('emergencyModal');
  if (modal) {
    modal.classList.remove('hidden');
    playSound('pop');
  }
}

function closeEmergencyModal() {
  const modal = document.getElementById('emergencyModal');
  if (modal) modal.classList.add('hidden');
}

window.openEmergencyModal = openEmergencyModal;
window.closeEmergencyModal = closeEmergencyModal;


// ---------------------------------------------------------------------
// NEA DOMESTIC ELECTRICITY TARIFF CALCULATOR ENGINE
// ---------------------------------------------------------------------
function openNeaTariffModal() {
  const modal = document.getElementById('neaTariffModal');
  if (modal) {
    modal.classList.remove('hidden');
    calculateNeaBill();
  }
}

function closeNeaTariffModal() {
  const modal = document.getElementById('neaTariffModal');
  if (modal) modal.classList.add('hidden');
}

function calculateNeaBill() {
  const amp = parseInt(document.getElementById('neaAmpSelect')?.value) || 5;
  const units = parseFloat(document.getElementById('neaUnitsInput')?.value) || 0;

  let serviceCharge = 0;
  let energyCharge = 0;

  if (amp === 5) {
    if (units <= 20) {
      serviceCharge = 30;
      energyCharge = 0; // Free energy for lifeline 5A
    } else if (units <= 30) {
      serviceCharge = 50;
      energyCharge = (20 * 3.0) + ((units - 20) * 7.0);
    } else if (units <= 50) {
      serviceCharge = 75;
      energyCharge = (20 * 3.0) + (10 * 7.0) + ((units - 30) * 8.0);
    } else if (units <= 100) {
      serviceCharge = 100;
      energyCharge = (20 * 3.0) + (10 * 7.0) + (20 * 8.0) + ((units - 50) * 9.5);
    } else if (units <= 250) {
      serviceCharge = 125;
      energyCharge = (20 * 3.0) + (10 * 7.0) + (20 * 8.0) + (50 * 9.5) + ((units - 100) * 10.0);
    } else {
      serviceCharge = 150;
      energyCharge = (20 * 3.0) + (10 * 7.0) + (20 * 8.0) + (50 * 9.5) + (150 * 10.0) + ((units - 250) * 11.0);
    }
  } else if (amp === 15) {
    serviceCharge = units <= 20 ? 50 : (units <= 30 ? 75 : (units <= 50 ? 100 : (units <= 100 ? 125 : (units <= 250 ? 150 : 175))));
    if (units <= 20) energyCharge = units * 4.0;
    else if (units <= 30) energyCharge = (20 * 4.0) + ((units - 20) * 7.0);
    else if (units <= 50) energyCharge = (20 * 4.0) + (10 * 7.0) + ((units - 30) * 8.0);
    else if (units <= 100) energyCharge = (20 * 4.0) + (10 * 7.0) + (20 * 8.0) + ((units - 50) * 9.5);
    else if (units <= 250) energyCharge = (20 * 4.0) + (10 * 7.0) + (20 * 8.0) + (50 * 9.5) + ((units - 100) * 10.0);
    else energyCharge = (20 * 4.0) + (10 * 7.0) + (20 * 8.0) + (50 * 9.5) + (150 * 10.0) + ((units - 250) * 11.0);
  } else if (amp === 30) {
    serviceCharge = units <= 50 ? 125 : (units <= 100 ? 150 : (units <= 250 ? 175 : 200));
    energyCharge = units * 10.0;
  } else {
    // 60A
    serviceCharge = 250;
    energyCharge = units * 11.5;
  }

  const total = serviceCharge + energyCharge;
  
  const scEl = document.getElementById('neaServiceCharge');
  const ecEl = document.getElementById('neaEnergyCharge');
  const totEl = document.getElementById('neaTotalBill');

  if (scEl) scEl.innerText = currentLang === 'ne' ? `रू ${toDevanagariDigits(serviceCharge.toFixed(2))}` : `Rs. ${serviceCharge.toFixed(2)}`;
  if (ecEl) ecEl.innerText = currentLang === 'ne' ? `रू ${toDevanagariDigits(energyCharge.toFixed(2))}` : `Rs. ${energyCharge.toFixed(2)}`;
  if (totEl) totEl.innerText = currentLang === 'ne' ? `रू ${toDevanagariDigits(total.toFixed(2))}` : `Rs. ${total.toFixed(2)}`;
}

// ---------------------------------------------------------------------
// DYNAMIC GOLD & SILVER BULLION RATES (FENEGOSIDA) & JEWELRY CALCULATOR
// ---------------------------------------------------------------------
const goldState = {
  fine24k: 291900,         // NPR per 1 tola (Default today baseline)
  tejabi22k: 290450,       // NPR per 1 tola
  silver: 4390,            // NPR per 1 tola
  fine24k10g: 250255,      // NPR per 10 grams
  silver10g: 3764,         // NPR per 10 grams
  yesterdayFine24k: 294800,
  yesterdaySilver: 4450,
  displayUnit: 'tola',     // 'tola' or '10g'
  lastUpdated: null,
  isLive: false,
  isFetching: false
};

const goldRates = {
  fine24k: goldState.fine24k,
  tejabi22k: goldState.tejabi22k,
  silver: goldState.silver
};

function setGoldDisplayUnit(unit) {
  goldState.displayUnit = unit;
  const tolaBtn = document.getElementById('goldDisplayTolaBtn');
  const g10Btn = document.getElementById('goldDisplay10gBtn');
  
  if (unit === 'tola') {
    if (tolaBtn) {
      tolaBtn.className = 'px-2.5 py-0.5 rounded-md bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs transition';
    }
    if (g10Btn) {
      g10Btn.className = 'px-2.5 py-0.5 rounded-md text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200 transition';
    }
  } else {
    if (tolaBtn) {
      tolaBtn.className = 'px-2.5 py-0.5 rounded-md text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200 transition';
    }
    if (g10Btn) {
      g10Btn.className = 'px-2.5 py-0.5 rounded-md bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs transition';
    }
  }
  updateGoldRatesDisplay();
}

function updateGoldRatesDisplay() {
  const is10g = goldState.displayUnit === '10g';
  const r24k = is10g ? (goldState.fine24k10g || Math.round(goldState.fine24k / 1.1664)) : goldState.fine24k;
  const r22k = is10g ? (Math.round((goldState.fine24k10g || goldState.fine24k / 1.1664) * 0.995)) : goldState.tejabi22k;
  const rSil = is10g ? (goldState.silver10g || Math.round(goldState.silver / 1.1664)) : goldState.silver;

  const formatNpr = (val) => currentLang === 'ne'
    ? 'रू ' + toDevanagariDigits(Number(val).toLocaleString('en-IN'))
    : 'Rs. ' + Number(val).toLocaleString('en-IN');

  const r24kEl = document.getElementById('goldRate24k');
  const r22kEl = document.getElementById('goldRate22k');
  const silEl = document.getElementById('silverRate');
  if (r24kEl) r24kEl.innerText = formatNpr(r24k);
  if (r22kEl) r22kEl.innerText = formatNpr(r22k);
  if (silEl) silEl.innerText = formatNpr(rSil);

  const u24kEl = document.getElementById('goldRate24kUnit');
  const u22kEl = document.getElementById('goldRate22kUnit');
  const uSilEl = document.getElementById('silverRateUnit');
  const unitText = is10g 
    ? (currentLang === 'ne' ? 'प्रति १० ग्राम' : 'per 10g')
    : (currentLang === 'ne' ? 'प्रति तोला' : 'per tola');
  if (u24kEl) u24kEl.innerText = unitText;
  if (u22kEl) u22kEl.innerText = unitText;
  if (uSilEl) uSilEl.innerText = unitText;

  // Calculate and format daily difference (delta)
  const d24kEl = document.getElementById('goldDelta24k');
  const dSilEl = document.getElementById('silverDelta');
  if (d24kEl && goldState.yesterdayFine24k) {
    const diff = goldState.fine24k - goldState.yesterdayFine24k;
    if (diff !== 0) {
      const isDrop = diff < 0;
      const absDiff = Math.abs(diff);
      const diffFormatted = currentLang === 'ne'
        ? (isDrop ? `▼ रू ${toDevanagariDigits(absDiff.toLocaleString('en-IN'))}` : `▲ रू ${toDevanagariDigits(absDiff.toLocaleString('en-IN'))}`)
        : (isDrop ? `▼ Rs. ${absDiff.toLocaleString('en-IN')}` : `▲ Rs. ${absDiff.toLocaleString('en-IN')}`);
      d24kEl.innerText = diffFormatted;
      d24kEl.className = isDrop 
        ? 'text-[9px] font-bold font-mono text-emerald-600 dark:text-emerald-400' 
        : 'text-[9px] font-bold font-mono text-rose-600 dark:text-rose-400';
    } else {
      d24kEl.innerText = currentLang === 'ne' ? 'स्थिर' : 'Steady';
      d24kEl.className = 'text-[9px] font-mono text-slate-400';
    }
  }

  if (dSilEl && goldState.yesterdaySilver) {
    const diff = goldState.silver - goldState.yesterdaySilver;
    if (diff !== 0) {
      const isDrop = diff < 0;
      const absDiff = Math.abs(diff);
      const diffFormatted = currentLang === 'ne'
        ? (isDrop ? `▼ रू ${toDevanagariDigits(absDiff.toLocaleString('en-IN'))}` : `▲ रू ${toDevanagariDigits(absDiff.toLocaleString('en-IN'))}`)
        : (isDrop ? `▼ Rs. ${absDiff.toLocaleString('en-IN')}` : `▲ Rs. ${absDiff.toLocaleString('en-IN')}`);
      dSilEl.innerText = diffFormatted;
      dSilEl.className = isDrop 
        ? 'text-[9px] font-bold font-mono text-emerald-600 dark:text-emerald-400' 
        : 'text-[9px] font-bold font-mono text-rose-600 dark:text-rose-400';
    } else {
      dSilEl.innerText = currentLang === 'ne' ? 'स्थिर' : 'Steady';
      dSilEl.className = 'text-[9px] font-mono text-slate-400';
    }
  }

  // Update live indicator & timestamp
  const indEl = document.getElementById('goldLiveIndicator');
  const upEl = document.getElementById('goldLastUpdated');
  if (indEl) {
    if (goldState.isLive) {
      indEl.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1"></span>${currentLang === 'ne' ? 'प्रत्यक्ष FENEGOSIDA' : 'Live FENEGOSIDA'}`;
      indEl.className = 'inline-flex items-center text-[10px] text-emerald-600 dark:text-emerald-400 font-bold';
    } else {
      indEl.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1"></span>${currentLang === 'ne' ? 'अफलाइन सुरक्षित दर' : 'Offline Cached'}`;
      indEl.className = 'inline-flex items-center text-[10px] text-amber-600 dark:text-amber-400 font-bold';
    }
  }
  if (upEl) {
    if (goldState.lastUpdated) {
      try {
        const d = new Date(goldState.lastUpdated);
        const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        upEl.innerText = currentLang === 'ne' ? `आज ${toDevanagariDigits(timeStr)}` : `Today ${timeStr}`;
      } catch (e) {
        upEl.innerText = currentLang === 'ne' ? 'आजको दर' : 'Today';
      }
    } else {
      upEl.innerText = currentLang === 'ne' ? 'आजको दर' : 'Today';
    }
  }

  // Sync to calculation rates object
  goldRates.fine24k = goldState.fine24k;
  goldRates.tejabi22k = goldState.tejabi22k;
  goldRates.silver = goldState.silver;
}

async function fetchGoldSilverRates(isManual = false) {
  if (goldState.isFetching) return;
  goldState.isFetching = true;

  const refreshIcon = document.getElementById('goldRefreshIcon');
  if (refreshIcon) refreshIcon.classList.add('animate-spin');

  if (isManual) {
    showToast(currentLang === 'ne' ? 'सुनचाँदी दर खोजिँदैछ...' : 'Fetching live bullion rates...');
  }

  // Endpoints to attempt sequentially
  const endpoints = [
    '/api/gold',
    'https://api.fenegosida.org/api/website/v1/Dashboard/today',
    'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://api.fenegosida.org/api/website/v1/Dashboard/today')
  ];

  let rawData = null;
  for (const url of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json) && json.length > 0) {
          rawData = json;
          break;
        }
      }
    } catch (err) {
      // Continue to next endpoint fallback
    }
  }

  if (rawData) {
    try {
      const S = pred => rawData.find(item => pred(item.rateType || ''));
      const fineTola = S(t => t.includes('सुन') && (t.includes('तोल') || t.includes('तोला')));
      const silverTola = S(t => t.includes('चाँदी') && (t.includes('तोल') || t.includes('तोला')));
      const fine10g = S(t => t.includes('सुन') && t.includes('ग्राम'));
      const silver10g = S(t => t.includes('चाँदी') && t.includes('ग्राम'));

      if (fineTola && fineTola.todayBaseRatePerGram > 0) {
        goldState.fine24k = fineTola.todayBaseRatePerGram;
        goldState.yesterdayFine24k = fineTola.yestardayBaseRatePerGram || fineTola.todayBaseRatePerGram;
        goldState.tejabi22k = Math.round(goldState.fine24k * 0.995);
        goldState.lastUpdated = fineTola.todayDate || new Date().toISOString();
        goldState.isLive = true;
      }

      if (silverTola && silverTola.todayBaseRatePerGram > 0) {
        goldState.silver = silverTola.todayBaseRatePerGram;
        goldState.yesterdaySilver = silverTola.yestardayBaseRatePerGram || silverTola.todayBaseRatePerGram;
      }

      if (fine10g && fine10g.todayBaseRatePerGram > 0) {
        goldState.fine24k10g = fine10g.todayBaseRatePerGram;
      }

      if (silver10g && silver10g.todayBaseRatePerGram > 0) {
        goldState.silver10g = silver10g.todayBaseRatePerGram;
      }

      // Cache locally
      localStorage.setItem('sangalo_gold_rates_cache', JSON.stringify({
        data: goldState,
        timestamp: Date.now()
      }));

      updateGoldRatesDisplay();
      calculateJewelryPrice();

      if (isManual) {
        showToast(currentLang === 'ne' ? 'नेपाल सुनचाँदी महासंघ दर ताजा भयो।' : 'Bullion rates refreshed from FENEGOSIDA.');
      }
    } catch (parseErr) {
      console.error('Error parsing gold rates:', parseErr);
    }
  } else {
    // If network failed, check localStorage cache
    loadCachedGoldRates();
    if (isManual) {
      showToast(currentLang === 'ne' ? 'इन्टरनेट नभएकाले सुरक्षित दर प्रयोग गरियो।' : 'Network unavailable. Using cached rates.');
    }
  }

  goldState.isFetching = false;
  if (refreshIcon) refreshIcon.classList.remove('animate-spin');
}

function loadCachedGoldRates() {
  try {
    const raw = localStorage.getItem('sangalo_gold_rates_cache');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.data) {
        Object.assign(goldState, parsed.data);
        goldState.isLive = false; // from cache
        updateGoldRatesDisplay();
        calculateJewelryPrice();
        return true;
      }
    }
  } catch (e) {
    console.error('Error loading gold rates cache:', e);
  }
  updateGoldRatesDisplay();
  calculateJewelryPrice();
  return false;
}

function initGoldRates() {
  loadCachedGoldRates();
  // Fetch live rates silently in background
  fetchGoldSilverRates(false);
}

function openGoldSilverModal() {
  const modal = document.getElementById('goldSilverModal');
  if (!modal) return;
  updateGoldRatesDisplay();
  calculateJewelryPrice();
  modal.classList.remove('hidden');

  // If last updated is null or older than 3 hours, refresh silently
  const cache = localStorage.getItem('sangalo_gold_rates_cache');
  if (!cache || (Date.now() - JSON.parse(cache).timestamp > 3 * 3600 * 1000)) {
    fetchGoldSilverRates(false);
  }
}

function closeGoldSilverModal() {
  const modal = document.getElementById('goldSilverModal');
  if (modal) modal.classList.add('hidden');
}

function calculateJewelryPrice() {
  const metal = document.getElementById('goldCalcMetal')?.value || '24k';
  const unit = document.getElementById('goldCalcUnit')?.value || 'tola';
  const weight = parseFloat(document.getElementById('goldCalcWeight')?.value || '0');
  const jartiPercent = parseFloat(document.getElementById('goldCalcJarti')?.value || '0');
  const jyala = parseFloat(document.getElementById('goldCalcJyala')?.value || '0');

  let ratePerTola = goldRates.fine24k;
  if (metal === '22k') ratePerTola = goldRates.tejabi22k;
  else if (metal === 'silver') ratePerTola = goldRates.silver;

  let weightInTolas = 0;
  if (unit === 'tola') weightInTolas = weight;
  else if (unit === 'lal') weightInTolas = weight / 100.0;
  else if (unit === 'gram') weightInTolas = weight / 11.664;

  const netMetalCost = Math.round(weightInTolas * ratePerTola);
  const jartiCost = Math.round(netMetalCost * (jartiPercent / 100.0));
  const finalPrice = Math.round(netMetalCost + jartiCost + jyala);

  const formatNpr = (val) => currentLang === 'ne' 
    ? 'रू ' + toDevanagariDigits(Number(val).toLocaleString('en-IN'))
    : 'Rs. ' + Number(val).toLocaleString('en-IN');

  const metalEl = document.getElementById('goldMetalPrice');
  const jartiEl = document.getElementById('goldJartiCost');
  const jyalaEl = document.getElementById('goldJyalaCost');
  const finalEl = document.getElementById('goldFinalPrice');
  const summaryEl = document.getElementById('goldRateSummary');

  if (metalEl) metalEl.innerText = formatNpr(netMetalCost);
  if (jartiEl) jartiEl.innerText = formatNpr(jartiCost);
  if (jyalaEl) jyalaEl.innerText = formatNpr(jyala);
  if (finalEl) finalEl.innerText = formatNpr(finalPrice);
  if (summaryEl) {
    summaryEl.innerText = currentLang === 'ne'
      ? `२४K: ${toDevanagariDigits(goldRates.fine24k.toLocaleString('en-IN'))}`
      : `24K: ${goldRates.fine24k.toLocaleString('en-IN')}`;
  }
}


// ---------------------------------------------------------------------
// FIRST-TIME INTERACTIVE ONBOARDING TOUR (PUKU HELPER)
// ---------------------------------------------------------------------
const tourStepsData = [
  {
    title: "दैनिक पात्रो र तिथि",
    badge: "चरण १ / ४ • पुकु गाइड",
    desc: "सँगालोमा स्वागत छ! यहाँ तपाईंले आजको नेपाली मिति (वि.सं.), चन्द्र तिथि, चाडपर्व र घरायसी सम्झनाहरू तुरुन्त हेर्न सक्नुहुन्छ। कुनै पनि गतेमा ट्याप गरेर विवरण हेर्न र नयाँ सम्झना थप्न सकिन्छ।"
  },
  {
    title: "मौसम, वायु गुणस्तर र पञ्चाङ्ग",
    badge: "चरण २ / ४ • पुकु गाइड",
    desc: "माथिको मौसम बारमा ट्याप गर्नुहोस्! त्यहाँबाट काठमाडौँको प्रत्यक्ष तापक्रम, वायु प्रदूषण (AQI), सूर्योदय, सूर्यास्त, दिनमान र दैनिक राहु काल (अशुभ समय) १००% अफलाइन हेर्न सकिन्छ।"
  },
  {
    title: "दैनिक उपयोगी सेवाहरू",
    badge: "चरण ३ / ४ • पुकु गाइड",
    desc: "नेपाल राष्ट्र बैंकको विदेशी विनिमय दर (डलर, रियाल आदि) र रेमिट्यान्स हिसाब, जग्गा (रोपनी, बिघा) र सुन (तोला, लाल) नाप, वि.सं. ⇄ ई.सं. मिति रूपान्तरण, र विद्युत प्राधिकरणको बिजुली बिल हिसाब १-ट्यापमा उपलब्ध छ।"
  },
  {
    title: "परिवार, किनमेल र सुरक्षा",
    badge: "चरण ४ / ४ • पुकु गाइड",
    desc: "घरको किनमेल सूची, खर्च बाँडफाँड, जेष्ठ नागरिकका लागि दैनिक औषधि अलार्म, र आपतकालीन स्वास्थ्य कार्ड (ICE) सबै इन्टरनेट नभए पनि सुरक्षित रूपमा चल्छन्। आवश्यकता परे पुकुसँग खेल्न वा बाघचाल खेल्न चौतारीमा जानुहोस्!"
  }
];

let curTourStepIdx = 0;

function startOnboardingTour() {
  curTourStepIdx = 0;
  const modal = document.getElementById('onboardingTourModal');
  if (modal) {
    modal.classList.remove('hidden');
    renderTourStep();
  }
}

function dismissOnboardingTour() {
  const modal = document.getElementById('onboardingTourModal');
  if (modal) modal.classList.add('hidden');
  localStorage.setItem('sangalo_onboarded_v1', 'true');
}

function nextTourStep() {
  if (curTourStepIdx < tourStepsData.length - 1) {
    curTourStepIdx++;
    renderTourStep();
  } else {
    dismissOnboardingTour();
    showToast('सँगालोमा स्वागत छ! 🎉');
  }
}

function prevTourStep() {
  if (curTourStepIdx > 0) {
    curTourStepIdx--;
    renderTourStep();
  }
}

function renderTourStep() {
  const step = tourStepsData[curTourStepIdx];
  const tTitle = document.getElementById('tourStepTitle');
  const tBadge = document.getElementById('tourStepBadge');
  const tContent = document.getElementById('tourStepContent');
  const prevBtn = document.getElementById('tourPrevBtn');
  const nextBtn = document.getElementById('tourNextBtn');
  const dotsCont = document.getElementById('tourDotsContainer');

  if (tTitle) tTitle.innerText = step.title;
  if (tBadge) tBadge.innerText = step.badge;
  if (tContent) tContent.innerHTML = `<p>${step.desc}</p>`;

  if (prevBtn) {
    if (curTourStepIdx === 0) prevBtn.classList.add('hidden');
    else prevBtn.classList.remove('hidden');
  }

  if (nextBtn) {
    if (curTourStepIdx === tourStepsData.length - 1) {
      nextBtn.innerText = 'सुरु गर्नुहोस् (Get Started)';
    } else {
      nextBtn.innerText = 'अगाडि बढ्नुहोस् →';
    }
  }

  if (dotsCont) {
    let dotsHtml = '';
    for (let i = 0; i < tourStepsData.length; i++) {
      const active = i === curTourStepIdx ? 'bg-emerald-600 w-4' : 'bg-slate-300 dark:bg-slate-700 w-2';
      dotsHtml += `<span class="h-2 rounded-full ${active} transition-all duration-200"></span>`;
    }
    dotsCont.innerHTML = dotsHtml;
  }
}

// ---------------------------------------------------------------------
// 14. TAB SWITCHING & ROUTING
// ---------------------------------------------------------------------
function setTab(tabName) {
  const tabs = ['calendar', 'shopping', 'budget', 'chautari', 'vault'];
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
    renderUpcomingHolidays();
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
  if (['calendar', 'shopping', 'budget', 'chautari', 'vault'].includes(hash)) {
    setTab(hash);
  } else {
    setTab('calendar');
  }
}

// Global aliases
window.tapPetInteractive = interactWithPet;
window.tapPuku = interactWithPet;

// ---------------------------------------------------------------------
// 14.5 GITHUB LIVE APP VERSION & UPDATE ENGINE (0-Backend REST API)
// ---------------------------------------------------------------------
const CURRENT_APP_VERSION = 'v1.2.0';
const GITHUB_REPO_LATEST_RELEASE = 'https://api.github.com/repos/dahalsandesh/sangalo/releases/latest';

function compareSemVer(v1, v2) {
  const p1 = (v1 || '').replace(/^[^\d]*/, '').split('.').map(n => parseInt(n, 10) || 0);
  const p2 = (v2 || '').replace(/^[^\d]*/, '').split('.').map(n => parseInt(n, 10) || 0);
  const len = Math.max(p1.length, p2.length);
  for (let i = 0; i < len; i++) {
    const a = p1[i] || 0;
    const b = p2[i] || 0;
    if (a > b) return 1;
    if (a < b) return -1;
  }
  return 0;
}

async function checkForAppUpdates(isManual = false) {
  if (isManual) {
    showToast(currentLang === 'ne' ? 'अपडेट खोजिँदैछ...' : 'Checking for updates...');
  }
  try {
    const res = await fetch(GITHUB_REPO_LATEST_RELEASE, {
      headers: { 'Accept': 'application/vnd.github.v3+json' },
      cache: 'no-cache'
    });
    if (!res.ok) {
      if (isManual) {
        showToast(currentLang === 'ne' ? 'अपडेट सर्भरमा जडान हुन सकेन' : 'Could not reach update server');
      }
      return;
    }
    // Only save timestamp on successful HTTP response
    localStorage.setItem('sangalo_last_update_check', String(Date.now()));

    const data = await res.json();
    const latestTag = data.tag_name || CURRENT_APP_VERSION;
    const hasUpdate = compareSemVer(latestTag, CURRENT_APP_VERSION) > 0;

    if (hasUpdate) {
      let apkUrl = 'https://github.com/dahalsandesh/sangalo/releases/latest/download/Sangalo.apk';
      if (data.assets && Array.isArray(data.assets)) {
        const apkAsset = data.assets.find(a => a.name && a.name.toLowerCase().endsWith('.apk'));
        if (apkAsset && apkAsset.browser_download_url) {
          apkUrl = apkAsset.browser_download_url;
        }
      }
      showAppUpdateModal(latestTag, data.name || latestTag, data.body || '', apkUrl);
    } else {
      if (isManual) {
        showToast(currentLang === 'ne' 
          ? `तपाईंको एप पछिल्लो संस्करण (${CURRENT_APP_VERSION}) मा अद्यावधिक छ।` 
          : `Sangalo is up to date (${CURRENT_APP_VERSION}).`);
      }
    }
  } catch (err) {
    console.warn('Update check error:', err);
    if (isManual) {
      showToast(currentLang === 'ne' ? 'इन्टरनेट नभएकोले अपडेट जाँच्न सकिएन' : 'Offline: Could not check for updates');
    }
  }
}

function showAppUpdateModal(newVersion, title, bodyMarkdown, apkDownloadUrl) {
  const modal = document.getElementById('appUpdateModal');
  if (!modal) return;
  const verBadge = document.getElementById('updateModalVerBadge');
  const titleEl = document.getElementById('updateModalTitle');
  const changelogEl = document.getElementById('updateModalChangelog');
  const downloadBtn = document.getElementById('updateModalDownloadBtn');

  if (verBadge) verBadge.innerText = `${CURRENT_APP_VERSION} → ${newVersion}`;
  if (titleEl) titleEl.innerText = title || (currentLang === 'ne' ? 'नयाँ अपडेट उपलब्ध छ!' : 'New Version Available!');
  if (changelogEl) {
    const cleanLines = (bodyMarkdown || '')
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.startsWith('-') || l.startsWith('*') || l.startsWith('•'))
      .map(l => l.replace(/^[-*•]\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1'))
      .slice(0, 5);

    if (cleanLines.length > 0) {
      changelogEl.innerHTML = cleanLines.map(l => `• ${escapeHtml(l)}`).join('<br>');
    } else {
      changelogEl.innerText = currentLang === 'ne' 
        ? 'नयाँ सुधार, क्यालेन्डर सटीकता तथा सुविधाहरू सहित नवीनतम संस्करण उपलब्ध छ।' 
        : 'New improvements, calendar accuracy, and bug fixes are available.';
    }
  }
  if (downloadBtn) {
    downloadBtn.onclick = () => {
      openExternalLink(apkDownloadUrl);
      closeAppUpdateModal();
    };
  }
  modal.classList.remove('hidden');

  // Also post native Android OS notification in the system drawer
  if (window.AndroidBridge && typeof window.AndroidBridge.notifyAppUpdate === 'function') {
    try {
      window.AndroidBridge.notifyAppUpdate(newVersion, title || '', apkDownloadUrl);
    } catch (e) {
      console.warn('AndroidBridge notifyAppUpdate error:', e);
    }
  }
}

function closeAppUpdateModal() {
  const modal = document.getElementById('appUpdateModal');
  if (modal) modal.classList.add('hidden');
}

// ---------------------------------------------------------------------
// 14. DAILY WELLNESS & FOCUS SUITE (POMODORO, WATER & EYE REST)
// ---------------------------------------------------------------------
const wellnessState = {
  activeTab: 'pomodoro',
  // Pomodoro
  pomodoroDuration: 25,
  pomodoroRemaining: 25 * 60,
  pomodoroRunning: false,
  pomodoroTimerId: null,
  pomodoroMode: 'work', // 'work' or 'break'
  // Water
  waterGlasses: 0,
  waterGoal: 8,
  waterHourlyReminder: false,
  waterLastLogDate: null,
  waterReminderIntervalId: null,
  // 20-20-20 Eye Break
  eyeRunning: false,
  eyeRemaining: 20 * 60,
  eyeTimerId: null
};

// Gentle Audio Synthesizer (Zero asset bloat, pure Web Audio)
function playWellnessChime(type = 'bell') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    
    if (type === 'bell') {
      // Tibetan bell / singing bowl pitch
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
    } else if (type === 'water') {
      // Soft water droplet pitch
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15);
    } else {
      // Eye rest gentle hum
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    }
    
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.2);
  } catch (e) {
    // Graceful fallback
  }
}

function openWellnessModal(initialTab = 'pomodoro') {
  const modal = document.getElementById('wellnessModal');
  if (!modal) return;
  switchWellnessTab(initialTab);
  updatePomodoroDisplay();
  updateWaterDisplay();
  updateEyeDisplay();
  modal.classList.remove('hidden');
}

function closeWellnessModal() {
  const modal = document.getElementById('wellnessModal');
  if (modal) modal.classList.add('hidden');
}

function switchWellnessTab(tab) {
  wellnessState.activeTab = tab;
  ['pomodoro', 'water', 'eye'].forEach(t => {
    const btn = document.getElementById(`wellnessTab-${t}`);
    const panel = document.getElementById(`wellnessPanel-${t}`);
    if (btn) {
      if (t === tab) {
        btn.className = 'py-1.5 rounded-lg bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-2xs transition';
      } else {
        btn.className = 'py-1.5 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200 transition';
      }
    }
    if (panel) {
      if (t === tab) panel.classList.remove('hidden');
      else panel.classList.add('hidden');
    }
  });
}

// --- POMODORO TIMER ENGINE ---
function setPomodoroDuration(mins) {
  if (wellnessState.pomodoroRunning) {
    clearInterval(wellnessState.pomodoroTimerId);
    wellnessState.pomodoroRunning = false;
  }
  wellnessState.pomodoroDuration = mins;
  wellnessState.pomodoroRemaining = mins * 60;
  wellnessState.pomodoroMode = mins <= 5 ? 'break' : 'work';
  updatePomodoroDisplay();
  updatePomodoroControls();
}

function togglePomodoroTimer() {
  if (wellnessState.pomodoroRunning) {
    // Pause
    clearInterval(wellnessState.pomodoroTimerId);
    wellnessState.pomodoroRunning = false;
  } else {
    // Start
    wellnessState.pomodoroRunning = true;
    playWellnessChime('bell');
    wellnessState.pomodoroTimerId = setInterval(() => {
      if (wellnessState.pomodoroRemaining > 0) {
        wellnessState.pomodoroRemaining--;
        updatePomodoroDisplay();
      } else {
        // Interval finished
        clearInterval(wellnessState.pomodoroTimerId);
        wellnessState.pomodoroRunning = false;
        playWellnessChime('bell');
        
        if (wellnessState.pomodoroMode === 'work') {
          showToast(currentLang === 'ne' ? '🍅 एकाग्रता सत्र सकियो! ५ मिनेट आराम गर्नुहोस्।' : '🍅 Focus session complete! Take a 5-minute break.');
          setPomodoroDuration(5);
        } else {
          showToast(currentLang === 'ne' ? '🔔 आराम समय सकियो! नयाँ एकाग्रता सत्र सुरु गर्नुहोस्।' : '🔔 Break over! Ready for next focus session.');
          setPomodoroDuration(25);
        }
      }
    }, 1000);
  }
  updatePomodoroControls();
}

function resetPomodoroTimer() {
  if (wellnessState.pomodoroRunning) {
    clearInterval(wellnessState.pomodoroTimerId);
    wellnessState.pomodoroRunning = false;
  }
  wellnessState.pomodoroRemaining = wellnessState.pomodoroDuration * 60;
  updatePomodoroDisplay();
  updatePomodoroControls();
}

function updatePomodoroDisplay() {
  const m = Math.floor(wellnessState.pomodoroRemaining / 60);
  const s = wellnessState.pomodoroRemaining % 60;
  const timeFormatted = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  
  const dispEl = document.getElementById('pomodoroTimeDisplay');
  const dotEl = document.getElementById('pomodoroModeDot');
  const textEl = document.getElementById('pomodoroModeText');

  if (dispEl) {
    dispEl.innerText = currentLang === 'ne' ? toDevanagariDigits(timeFormatted) : timeFormatted;
  }
  if (dotEl) {
    dotEl.className = wellnessState.pomodoroMode === 'work' 
      ? 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse' 
      : 'w-2 h-2 rounded-full bg-amber-500 animate-pulse';
  }
  if (textEl) {
    if (wellnessState.pomodoroMode === 'work') {
      textEl.innerText = currentLang === 'ne' ? `एकाग्रता समय (${toDevanagariDigits(wellnessState.pomodoroDuration)} मिनेट)` : `Focus Time (${wellnessState.pomodoroDuration}m)`;
    } else {
      textEl.innerText = currentLang === 'ne' ? `विश्राम समय (${toDevanagariDigits(wellnessState.pomodoroDuration)} मिनेट)` : `Break Time (${wellnessState.pomodoroDuration}m)`;
    }
  }

  const miniPomoEl = document.getElementById('miniPomodoroStatus');
  if (miniPomoEl) {
    miniPomoEl.innerText = wellnessState.pomodoroRunning
      ? (currentLang === 'ne' ? `${toDevanagariDigits(timeFormatted)} सक्रिय` : `${timeFormatted} active`)
      : (currentLang === 'ne' ? `${toDevanagariDigits(wellnessState.pomodoroDuration)} मिनेट` : `${wellnessState.pomodoroDuration} mins`);
  }
}

function updatePomodoroControls() {
  const btn = document.getElementById('pomodoroToggleBtn');
  const icon = document.getElementById('pomodoroToggleIcon');
  const text = document.getElementById('pomodoroToggleText');
  
  if (btn && text) {
    if (wellnessState.pomodoroRunning) {
      btn.className = 'py-2.5 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5';
      text.innerText = currentLang === 'ne' ? 'रोक्नुहोस् (Pause)' : 'Pause';
      if (icon) {
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />';
      }
    } else {
      btn.className = 'py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5';
      text.innerText = currentLang === 'ne' ? 'सुरु गर्नुहोस् (Start)' : 'Start';
      if (icon) {
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />';
      }
    }
  }
}

// --- WATER HYDRATION ENGINE ---
function addWaterGlass(delta) {
  checkDailyWaterReset();
  wellnessState.waterGlasses = Math.max(0, Math.min(16, wellnessState.waterGlasses + delta));
  saveWellnessState();
  updateWaterDisplay();
  if (delta > 0) {
    playWellnessChime('water');
    if (wellnessState.waterGlasses === wellnessState.waterGoal) {
      showToast(currentLang === 'ne' ? '🎉 बधाई छ! आजको ८ गिलास पानीको लक्ष्य पूरा भयो।' : '🎉 Congratulations! Daily 8-glass water goal achieved.');
    }
  }
}

function updateWaterDisplay() {
  checkDailyWaterReset();
  const progressEl = document.getElementById('waterProgressText');
  const gridEl = document.getElementById('waterGlassesGrid');
  const chautariSummaryEl = document.getElementById('chautariWaterSummary');
  const miniWaterEl = document.getElementById('miniWaterStatus');
  
  const gCount = wellnessState.waterGlasses;
  const goal = wellnessState.waterGoal;
  
  if (progressEl) {
    progressEl.innerText = currentLang === 'ne' 
      ? `${toDevanagariDigits(gCount)} / ${toDevanagariDigits(goal)} गिलास`
      : `${gCount} / ${goal} glasses`;
  }
  
  if (chautariSummaryEl) {
    chautariSummaryEl.innerText = currentLang === 'ne'
      ? `पानी: ${toDevanagariDigits(gCount)}/${toDevanagariDigits(goal)} गिलास`
      : `Water: ${gCount}/${goal} glasses`;
  }

  if (miniWaterEl) {
    miniWaterEl.innerText = currentLang === 'ne'
      ? `${toDevanagariDigits(gCount)}/${toDevanagariDigits(goal)} गिलास`
      : `${gCount}/${goal} glasses`;
  }

  if (gridEl) {
    gridEl.innerHTML = '';
    for (let i = 1; i <= goal; i++) {
      const isFilled = i <= gCount;
      const glassBtn = document.createElement('button');
      glassBtn.type = 'button';
      glassBtn.onclick = () => {
        wellnessState.waterGlasses = i;
        saveWellnessState();
        playWellnessChime('water');
        updateWaterDisplay();
      };
      glassBtn.className = `w-8 h-10 rounded-lg flex flex-col items-center justify-center transition border ${
        isFilled 
          ? 'bg-sky-500 text-white border-sky-400 shadow-2xs scale-105' 
          : 'bg-slate-100 dark:bg-zinc-800/80 text-slate-400 border-slate-200 dark:border-zinc-700/60 hover:border-sky-400'
      }`;
      glassBtn.innerHTML = `
        <span class="text-xs">${isFilled ? '💧' : '🥛'}</span>
        <span class="text-[9px] font-mono font-bold">${currentLang === 'ne' ? toDevanagariDigits(i) : i}</span>
      `;
      gridEl.appendChild(glassBtn);
    }
  }

  const toggleEl = document.getElementById('waterHourlyReminderToggle');
  if (toggleEl) {
    toggleEl.checked = wellnessState.waterHourlyReminder;
  }
}

function checkDailyWaterReset() {
  const todayStr = new Date().toISOString().split('T')[0];
  if (wellnessState.waterLastLogDate !== todayStr) {
    wellnessState.waterGlasses = 0;
    wellnessState.waterLastLogDate = todayStr;
    saveWellnessState();
  }
}

function toggleWaterReminder(e) {
  wellnessState.waterHourlyReminder = e.target.checked;
  saveWellnessState();
  if (wellnessState.waterHourlyReminder) {
    showToast(currentLang === 'ne' ? '💧 हरेक घण्टा पानी पिउने सम्झना सुरु भयो।' : '💧 Hourly hydration reminders enabled.');
    setupWaterInterval();
  } else {
    if (wellnessState.waterReminderIntervalId) {
      clearInterval(wellnessState.waterReminderIntervalId);
      wellnessState.waterReminderIntervalId = null;
    }
  }
}

function setupWaterInterval() {
  if (wellnessState.waterReminderIntervalId) clearInterval(wellnessState.waterReminderIntervalId);
  wellnessState.waterReminderIntervalId = setInterval(() => {
    if (wellnessState.waterHourlyReminder) {
      playWellnessChime('water');
      showToast(currentLang === 'ne' ? '💧 पानी पिउने समय भयो! १ गिलास पानी पिउनुहोस्।' : '💧 Time to drink water! Have a glass of water.');
    }
  }, 60 * 60 * 1000);
}

// --- 20-20-20 EYE REST ENGINE ---
function toggleEyeBreakTimer() {
  if (wellnessState.eyeRunning) {
    // Stop
    clearInterval(wellnessState.eyeTimerId);
    wellnessState.eyeRunning = false;
    wellnessState.eyeRemaining = 20 * 60;
  } else {
    // Start
    wellnessState.eyeRunning = true;
    showToast(currentLang === 'ne' ? '👁️ २० मिनेटको स्क्रिन आँखा आराम सम्झना सुरु भयो।' : '👁️ 20-20-20 Eye break reminder active.');
    wellnessState.eyeTimerId = setInterval(() => {
      if (wellnessState.eyeRemaining > 0) {
        wellnessState.eyeRemaining--;
        updateEyeDisplay();
      } else {
        // 20 minutes reached
        playWellnessChime('bell');
        wellnessState.eyeRemaining = 20 * 60;
        showToast(currentLang === 'ne' 
          ? '👁️ आँखा आराम: २० फिट टाढा २० सेकेन्ड हेर्नुहोस्!' 
          : '👁️ Eye Rest: Look 20 feet away for 20 seconds!');
        updateEyeDisplay();
      }
    }, 1000);
  }
  updateEyeDisplay();
}

function updateEyeDisplay() {
  const m = Math.floor(wellnessState.eyeRemaining / 60);
  const s = wellnessState.eyeRemaining % 60;
  const timeFormatted = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  
  const dispEl = document.getElementById('eyeTimerDisplay');
  const btn = document.getElementById('eyeBreakToggleBtn');
  const text = document.getElementById('eyeBreakToggleText');
  
  if (dispEl) {
    dispEl.innerText = currentLang === 'ne' ? toDevanagariDigits(timeFormatted) : timeFormatted;
  }
  if (btn && text) {
    if (wellnessState.eyeRunning) {
      btn.className = 'w-full py-2.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5';
      text.innerText = currentLang === 'ne' ? 'आँखा आराम सम्झना रोक्नुहोस्' : 'Stop Eye Break Reminders';
    } else {
      btn.className = 'w-full py-2.5 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5';
      text.innerText = currentLang === 'ne' ? 'आँखा आराम सम्झना सुरु गर्नुहोस्' : 'Start 20-20-20 Eye Break';
    }
  }

  const miniEyeEl = document.getElementById('miniEyeStatus');
  if (miniEyeEl) {
    miniEyeEl.innerText = wellnessState.eyeRunning
      ? (currentLang === 'ne' ? `${toDevanagariDigits(timeFormatted)} सक्रिय` : `${timeFormatted} active`)
      : (currentLang === 'ne' ? '२०-२०-२०' : '20-20-20');
  }
}

// Persistence
function saveWellnessState() {
  try {
    localStorage.setItem('sangalo_wellness_state', JSON.stringify({
      waterGlasses: wellnessState.waterGlasses,
      waterLastLogDate: wellnessState.waterLastLogDate,
      waterHourlyReminder: wellnessState.waterHourlyReminder
    }));
  } catch (e) {}
}

function loadWellnessState() {
  try {
    const raw = localStorage.getItem('sangalo_wellness_state');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed) {
        wellnessState.waterGlasses = parsed.waterGlasses || 0;
        wellnessState.waterLastLogDate = parsed.waterLastLogDate || null;
        wellnessState.waterHourlyReminder = !!parsed.waterHourlyReminder;
      }
    }
    checkDailyWaterReset();
    if (wellnessState.waterHourlyReminder) {
      setupWaterInterval();
    }
  } catch (e) {}
}

function initWellnessSuite() {
  loadWellnessState();
  updateWaterDisplay();
  updatePomodoroDisplay();
  updateEyeDisplay();
}

window.checkForAppUpdates = checkForAppUpdates;
window.showAppUpdateModal = showAppUpdateModal;
window.closeAppUpdateModal = closeAppUpdateModal;
window.openGoldSilverModal = openGoldSilverModal;
window.closeGoldSilverModal = closeGoldSilverModal;
window.calculateJewelryPrice = calculateJewelryPrice;
window.fetchGoldSilverRates = fetchGoldSilverRates;
window.setGoldDisplayUnit = setGoldDisplayUnit;
window.initGoldRates = initGoldRates;
window.cycleFontSize = cycleFontSize;

window.openWellnessModal = openWellnessModal;
window.closeWellnessModal = closeWellnessModal;
window.switchWellnessTab = switchWellnessTab;
window.setPomodoroDuration = setPomodoroDuration;
window.togglePomodoroTimer = togglePomodoroTimer;
window.resetPomodoroTimer = resetPomodoroTimer;
window.addWaterGlass = addWaterGlass;
window.toggleWaterReminder = toggleWaterReminder;
window.toggleEyeBreakTimer = toggleEyeBreakTimer;
window.initWellnessSuite = initWellnessSuite;

// ---------------------------------------------------------------------
// 15. INITIALIZATION
// ---------------------------------------------------------------------
function initApp() {
  initTheme();
  initFontSize();
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
            ✅ तपाईंले अहिले मोबाइल एप (.apk ${CURRENT_APP_VERSION}) चलाइरहनुभएको छ
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
    showStickyCalendarNotification(true);
  }

  // Initialize Automated Reminders & Medicine Alarms
  initAlarmEngine();

  // Initialize Dynamic Weather, Solar (Sunrise/Sunset) & Tithi
  fetchWeatherAndSun();

  // Initialize NRB Official Forex Rates
  fetchForexRates();

  // Initialize FENEGOSIDA Official Live Gold & Silver Rates
  initGoldRates();

  // Initialize Daily Wellness & Focus Suite (Pomodoro, Hydration, Eye Rest)
  initWellnessSuite();

  // Check first-time visitor onboarding tour
  if (!localStorage.getItem('sangalo_onboarded_v1')) {
    setTimeout(startOnboardingTour, 600);
  }

  // Check for app updates silently in background (throttled to once every 6h on successful check)
  setTimeout(() => {
    if (navigator.onLine) {
      const lastCheck = parseInt(localStorage.getItem('sangalo_last_update_check') || '0', 10);
      const now = Date.now();
      if (now - lastCheck > 6 * 60 * 60 * 1000) {
        checkForAppUpdates(false);
      }
    }
  }, 4000);

  // Register offline Service Worker only on HTTP/HTTPS
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').then(reg => {
      reg.update().catch(() => {});
    }).catch(() => {});
  }

  // Smooth entrance transition - dismiss splash screen
  const splash = document.getElementById('appSplashScreen');
  if (splash) {
    setTimeout(() => {
      splash.style.opacity = '0';
      setTimeout(() => splash.remove(), 350);
    }, 250);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
