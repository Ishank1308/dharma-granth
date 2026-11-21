/**
 * Every piece of interface text in the app, in English and Hindi, side by side.
 *
 * Add new strings here rather than writing them inline in a screen, so a translation is never missed
 * and parallel work on different screens touches different lines of this one file. Each entry is
 * either a pair `{ en, hi }` or a function that returns one (for counts and names). Read them with
 * `t()` from `useI18n()`; components that take `en` and `hi` props accept a pair spread in (`{...S.theme}`).
 *
 * Scripture text (Sanskrit, the printed Hindi and English translations, chapter titles) is content,
 * not interface, and never goes through here.
 *
 * Hindi register: everyday spoken Hindi as on a phone's own menus ("सहेजें", "खोजें", "बैकअप"),
 * not heavy tatsama. Numbers stay in Western digits, as most Hindi apps show them.
 */
export interface Msg {
  en: string;
  hi: string;
}

const n = (value: number) => value.toLocaleString('en-IN');

export const S = {
  // App and tabs
  appName: { en: 'Dharma Granth', hi: 'धर्म ग्रन्थ' },
  tabLibrary: { en: 'Library', hi: 'ग्रन्थ' },
  tabSaved: { en: 'Saved', hi: 'सहेजे गए' },
  tabSettings: { en: 'Settings', hi: 'सेटिंग्स' },
  tabExplore: { en: 'Explore', hi: 'अन्वेषण' },

  // Library
  libraryEyebrow: { en: 'Scripture library', hi: 'ग्रन्थ संग्रह' },
  continueReading: { en: 'Continue reading', hi: 'पढ़ना जारी रखें' },
  continueReadingA11y: (title: string, chapter: number) => ({
    en: `Continue reading ${title}, chapter ${chapter}`,
    hi: `${title}, अध्याय ${chapter} पढ़ना जारी रखें`,
  }),
  verseOfTheDay: { en: 'Verse of the day', hi: 'आज का श्लोक' },
  verseOfTheDayA11y: { en: 'Open the verse of the day', hi: 'आज का श्लोक खोलें' },
  gitaRef: (ref: string) => ({ en: `Bhagavad Gita ${ref}`, hi: `भगवद्गीता ${ref}` }),
  searchPlaceholder: { en: 'Search scriptures', hi: 'ग्रन्थ खोजें' },
  filterAll: { en: 'All', hi: 'सभी' },
  bookSummary: (chapters: number, verses: number) => ({
    en: `${n(chapters)} ch · ${n(verses)} verses`,
    hi: `${n(chapters)} अध्याय · ${n(verses)} श्लोक`,
  }),
  bookA11y: (title: string, chapters: number) => ({ en: `${title}, ${n(chapters)} chapters`, hi: `${title}, ${n(chapters)} अध्याय` }),
  availableOffline: { en: 'Available offline', hi: 'बिना इंटरनेट उपलब्ध' },
  opensOnWebsite: { en: 'Opens on dharmagranth.dev', hi: 'dharmagranth.dev पर खुलेगा' },
  noMatch: (query: string) => ({ en: `No scripture matches “${query}”.`, hi: `“${query}” से मिलता कोई ग्रन्थ नहीं मिला।` }),
  searchInsideVerses: { en: 'Search inside verses', hi: 'श्लोकों में खोजें' },
  searchVersesFor: (query: string) => ({ en: `Search verses for “${query}”`, hi: `श्लोकों में “${query}” खोजें` }),

  // Verse search results
  searchResultCount: (total: number) => ({ en: `${n(total)} ${total === 1 ? 'verse' : 'verses'}`, hi: `${n(total)} श्लोक` }),
  searchResultBest: (shown: number, total: number) => ({
    en: `Best ${n(shown)} of ${n(total)} verses`,
    hi: `${n(total)} श्लोकों में से सबसे मिलते ${n(shown)}`,
  }),
  searching: { en: 'Searching…', hi: 'खोज रहे हैं…' },
  searchTooShort: { en: 'Type at least two letters.', hi: 'कम से कम दो अक्षर लिखें।' },

  // Explore tab: Panchang, festivals, mantras (content from the website's lib/panchang.ts and data/)
  exploreTitle: { en: 'Explore', hi: 'अन्वेषण' },
  exploreEyebrow: { en: 'Time, festivals and mantras', hi: 'काल, पर्व और मन्त्र' },
  todayAt: (city: string) => ({ en: `Today in ${city}`, hi: `आज ${city} में` }),
  openPanchangA11y: { en: 'Open today’s Panchang', hi: 'आज का पंचांग खोलें' },
  nextFestival: { en: 'Next festival', hi: 'अगला पर्व' },
  inDays: (days: number) =>
    days === 0
      ? { en: 'Today', hi: 'आज' }
      : days === 1
        ? { en: 'Tomorrow', hi: 'कल' }
        : { en: `In ${n(days)} days`, hi: `${n(days)} दिन में` },
  panchangTitle: { en: 'Panchang', hi: 'पंचांग' },
  panchangRow: { en: 'Tithi, nakshatra, yoga, karana, muhurta', hi: 'तिथि, नक्षत्र, योग, करण, मुहूर्त' },
  festivalsTitle: { en: 'Festivals', hi: 'पर्व और त्योहार' },
  festivalsRow: { en: 'Dates, meaning, practices and chants', hi: 'तिथियाँ, अर्थ, परम्परा और मन्त्र' },
  mantrasTitle: { en: 'Mantras', hi: 'मन्त्र' },
  mantrasRow: { en: 'Vedic mantras, शान्ति पाठ and stotras with word meanings', hi: 'वैदिक मन्त्र, शान्ति पाठ और स्तोत्र, पदच्छेद सहित' },
  exploreStudy: { en: 'Study', hi: 'अध्ययन' },
  exploreCalendar: { en: 'Calendar', hi: 'पंचांग और पर्व' },
  panchangEyebrow: { en: 'Vedic calendar', hi: 'वैदिक पंचांग' },
  cityLabel: { en: 'City', hi: 'शहर' },
  chooseCity: { en: 'Choose a city', hi: 'शहर चुनें' },
  cityA11y: (city: string) => ({ en: `City: ${city}. Change city`, hi: `शहर: ${city}। शहर बदलें` }),
  previousDay: { en: 'Previous day', hi: 'पिछला दिन' },
  nextDay: { en: 'Next day', hi: 'अगला दिन' },
  pickDate: { en: 'Pick a date', hi: 'तारीख़ चुनें' },
  pickDateA11y: (date: string) => ({ en: `${date}. Pick another date`, hi: `${date}। दूसरी तारीख़ चुनें` }),
  backToToday: { en: 'Today', hi: 'आज' },
  illumination: (pct: number) => ({ en: `${pct}% lit`, hi: `${pct}% प्रकाशित` }),
  waxing: { en: 'Waxing', hi: 'शुक्ल पक्ष' },
  waning: { en: 'Waning', hi: 'कृष्ण पक्ष' },
  lunarDay: (num: number) => ({ en: `Lunar day ${num} of 30`, hi: `30 में से ${num}वीं तिथि` }),
  tithiProgress: (pct: number) => ({ en: `${pct}% of the tithi passed at local noon`, hi: `स्थानीय मध्याह्न तक तिथि का ${pct}% बीता` }),
  dayFocus: { en: 'Focus for the day', hi: 'आज का साधना संकेत' },
  fiveLimbs: { en: 'The five limbs', hi: 'पञ्चाङ्ग' },
  limbTithi: { en: 'Tithi', hi: 'तिथि' },
  limbPaksha: { en: 'Paksha', hi: 'पक्ष' },
  limbNakshatra: { en: 'Nakshatra', hi: 'नक्षत्र' },
  limbYoga: { en: 'Yoga', hi: 'योग' },
  limbKarana: { en: 'Karana', hi: 'करण' },
  limbVara: { en: 'Weekday', hi: 'वार' },
  limbRitu: { en: 'Season', hi: 'ऋतु' },
  pada: (num: number) => ({ en: `Pada ${num} of 4`, hi: `चरण ${num}/4` }),
  deityLord: (deity: string, lord: string) => ({ en: `Deity ${deity} · Lord ${lord}`, hi: `देवता ${deity} · स्वामी ${lord}` }),
  yogaNature: (nature: string) =>
    nature === 'Auspicious'
      ? { en: 'Auspicious', hi: 'शुभ' }
      : nature === 'Neutral'
        ? { en: 'Neutral', hi: 'सम' }
        : { en: 'Reflective', hi: 'विचारणीय' },
  showMeaning: { en: 'What it means', hi: 'इसका अर्थ' },
  hideMeaning: { en: 'Hide meaning', hi: 'अर्थ छिपाएँ' },
  sunAndMuhurta: { en: 'Sun and muhurta', hi: 'सूर्य और मुहूर्त' },
  sunrise: { en: 'Sunrise', hi: 'सूर्योदय' },
  sunset: { en: 'Sunset', hi: 'सूर्यास्त' },
  dayLength: { en: 'Day length', hi: 'दिनमान' },
  solarNoon: { en: 'Solar noon', hi: 'मध्याह्न' },
  brahmaMuhurta: { en: 'Brahma muhurta', hi: 'ब्रह्म मुहूर्त' },
  abhijitMuhurta: { en: 'Abhijit muhurta', hi: 'अभिजित मुहूर्त' },
  abhijitWednesday: { en: 'Not observed on Wednesday', hi: 'बुधवार को नहीं माना जाता' },
  rahuKaal: { en: 'Rahu Kaal', hi: 'राहु काल' },
  rahuNote: { en: 'Traditionally avoided for new beginnings', hi: 'नए कार्य के आरम्भ में परम्परा से टाला जाता है' },
  timeRange: (from: string, to: string) => ({ en: `${from} to ${to}`, hi: `${from} से ${to}` }),
  sunUnavailable: { en: 'Sunrise and sunset aren’t available for this place today.', hi: 'आज इस स्थान के लिए सूर्योदय-सूर्यास्त उपलब्ध नहीं है।' },
  vratDates: { en: 'Vrat dates', hi: 'व्रत तिथियाँ' },
  vratEkadashi: { en: 'Ekadashi', hi: 'एकादशी' },
  vratPurnima: { en: 'Purnima', hi: 'पूर्णिमा' },
  vratAmavasya: { en: 'Amavasya', hi: 'अमावस्या' },
  vratPradosh: { en: 'Pradosh', hi: 'प्रदोष' },
  vratNone: { en: 'No more dates in the calendar yet.', hi: 'कैलेंडर में अभी आगे की तिथियाँ नहीं हैं।' },
  panchangAccuracy: {
    en: 'An educational panchang, worked out on this phone for local noon, as on dharmagranth.dev. Printed almanacs are set for one city and can differ near a tithi boundary; for vows and ceremonies follow your own tradition and family ācārya.',
    hi: 'यह अध्ययन के लिए पंचांग है, जो dharmagranth.dev की तरह इसी फ़ोन पर स्थानीय मध्याह्न के लिए निकाला जाता है। छपे पंचांग किसी एक शहर के लिए होते हैं और तिथि बदलने के समय के पास अलग हो सकते हैं; व्रत और संस्कार के लिए अपनी परम्परा और कुल-आचार्य का पालन करें।',
  },
  upcoming: { en: 'Coming up', hi: 'आने वाले' },
  allFestivals: { en: 'Festival guides', hi: 'पर्व परिचय' },
  festivalsEyebrow: { en: 'Festivals and vrats', hi: 'पर्व और व्रत' },
  festivalDatesNote: {
    en: 'Widely published dates for India. Lunar festivals can fall a day apart by region, so confirm locally.',
    hi: 'भारत के लिए प्रचलित तिथियाँ। चान्द्र पर्व क्षेत्र के अनुसार एक दिन आगे-पीछे हो सकते हैं, स्थानीय पंचांग से पुष्टि करें।',
  },
  festivalA11y: (name: string, date: string) => ({ en: `${name}, ${date}`, hi: `${name}, ${date}` }),
  festivalMeaning: { en: 'Meaning', hi: 'अर्थ' },
  festivalTiming: { en: 'When', hi: 'कब' },
  festivalNext: (date: string) => ({ en: `Next: ${date}`, hi: `अगली बार: ${date}` }),
  festivalStory: { en: 'Story', hi: 'कथा' },
  festivalDeity: { en: 'Deity', hi: 'देवता' },
  festivalPractices: { en: 'Practices', hi: 'परम्पराएँ' },
  festivalChants: { en: 'Chants', hi: 'मन्त्र' },
  festivalRegions: { en: 'Across India', hi: 'क्षेत्रीय परम्पराएँ' },
  festivalFood: { en: 'Food', hi: 'व्यंजन' },
  festivalSources: { en: 'In the scriptures', hi: 'शास्त्रीय सन्दर्भ' },
  festivalScriptureVsCustom: { en: 'Scripture and custom', hi: 'शास्त्र और रीति' },
  scriptural: { en: 'Scripture', hi: 'शास्त्र' },
  custom: { en: 'Custom', hi: 'रीति' },
  festivalEnvironment: { en: 'Caring for nature', hi: 'पर्यावरण का ध्यान' },
  mantrasEyebrow: { en: 'Mantras and शान्ति पाठ', hi: 'मन्त्र और शान्ति पाठ' },
  mantraCount: (count: number) => ({ en: `${n(count)} mantras`, hi: `${n(count)} मन्त्र` }),
  mantraCatVedic: { en: 'Vedic', hi: 'वैदिक' },
  mantraCatShanti: { en: 'Shanti path', hi: 'शान्ति पाठ' },
  mantraCatStotra: { en: 'Stotras', hi: 'स्तोत्र' },
  mantraWords: { en: 'Word by word (पदच्छेद)', hi: 'पदच्छेद और शब्दार्थ' },
  mantraMeaning: { en: 'Meaning (भावार्थ)', hi: 'भावार्थ' },
  mantraSignificance: { en: 'Why it is recited', hi: 'महत्त्व' },
  mantraSource: { en: 'Source', hi: 'स्रोत' },
  mantraRishi: { en: 'Rishi', hi: 'ऋषि' },
  mantraDevata: { en: 'Devata', hi: 'देवता' },
  mantraChhandas: { en: 'Metre', hi: 'छन्द' },
  mantraQuestions: { en: 'Questions', hi: 'प्रश्न' },
  showTranslit: { en: 'Show transliteration', hi: 'लिप्यन्तरण दिखाएँ' },

  // Scripture (chapter list)
  notFoundTitle: { en: 'Not found', hi: 'नहीं मिला' },
  scriptureNotFound: { en: 'This scripture is not in the library.', hi: 'यह ग्रन्थ संग्रह में नहीं है।' },
  chaptersVerses: (chapters: number, verses: number) => ({
    en: `${n(chapters)} chapters · ${n(verses)} verses`,
    hi: `${n(chapters)} अध्याय · ${n(verses)} श्लोक`,
  }),
  readOnWebsite: { en: 'Read on dharmagranth.dev', hi: 'dharmagranth.dev पर पढ़ें' },
  readOnWebsiteBody: {
    en: 'This text is too large to ship inside the app. Chapters open in your browser.',
    hi: 'यह ग्रन्थ ऐप में रखने के लिए बहुत बड़ा है। अध्याय आपके ब्राउज़र में खुलेंगे।',
  },
  chapterN: (num: number) => ({ en: `Chapter ${num}`, hi: `अध्याय ${num}` }),
  verseCount: (count: number) => ({ en: `${n(count)} verses`, hi: `${n(count)} श्लोक` }),
  chapterA11y: (num: number, title: string) => ({ en: `Chapter ${num}, ${title}`, hi: `अध्याय ${num}, ${title}` }),

  // Chapter reader
  chapterUnavailable: { en: 'This chapter is not available in the app.', hi: 'यह अध्याय ऐप में उपलब्ध नहीं है।' },
  noVersesYet: { en: 'No verses in this chapter yet.', hi: 'इस अध्याय में अभी कोई श्लोक नहीं है।' },
  prevChapterA11y: (title: string) => ({ en: `Previous chapter, ${title}`, hi: `पिछला अध्याय, ${title}` }),
  nextChapterA11y: (title: string) => ({ en: `Next chapter, ${title}`, hi: `अगला अध्याय, ${title}` }),

  // Verse card
  verseA11y: (ref: string) => ({ en: `Verse ${ref}`, hi: `श्लोक ${ref}` }),
  shareVerseA11y: (ref: string) => ({ en: `Share verse ${ref}`, hi: `श्लोक ${ref} शेयर करें` }),
  bookmarkVerseA11y: (ref: string) => ({ en: `Save verse ${ref}`, hi: `श्लोक ${ref} सहेजें` }),
  unbookmarkVerseA11y: (ref: string) => ({ en: `Remove saved verse ${ref}`, hi: `सहेजा श्लोक ${ref} हटाएँ` }),
  labelHindi: { en: 'Hindi', hi: 'हिन्दी अर्थ' },
  labelEnglish: { en: 'English', hi: 'अंग्रेज़ी अनुवाद' },
  labelHindiRange: (range: string) => ({ en: `Hindi for verses ${range.replace('-', '–')}`, hi: `श्लोक ${range.replace('-', '–')} का हिन्दी अर्थ` }),
  labelEnglishRange: (range: string) => ({
    en: `English for verses ${range.replace('-', '–')}, translated together`,
    hi: `श्लोक ${range.replace('-', '–')} का अंग्रेज़ी अनुवाद`,
  }),
  labelNotes: { en: 'Notes', hi: 'टिप्पणी' },
  labelWordMeaning: { en: 'Word meaning', hi: 'शब्दार्थ' },
  labelCommentary: { en: 'Commentary', hi: 'व्याख्या' },
  labelExplanation: { en: 'Explanation', hi: 'विवेचन' },

  // Saved verses
  savedEyebrow: { en: 'Your collection', hi: 'आपका संग्रह' },
  savedTitle: { en: 'Saved verses', hi: 'सहेजे गए श्लोक' },
  savedEmpty: {
    en: 'Tap the bookmark on any verse to keep it here. Saved verses stay on this phone only.',
    hi: 'किसी भी श्लोक पर बुकमार्क दबाएँ, वह यहाँ आ जाएगा। सहेजे गए श्लोक केवल इसी फ़ोन में रहते हैं।',
  },
  openSavedA11y: (ref: string) => ({ en: `Open ${ref}`, hi: `${ref} खोलें` }),
  removeSavedA11y: (ref: string) => ({ en: `Remove saved verse ${ref}`, hi: `सहेजा श्लोक ${ref} हटाएँ` }),

  // Settings
  settingsEyebrow: { en: 'Preferences', hi: 'पसंद' },
  settingsTitle: { en: 'Settings', hi: 'सेटिंग्स' },
  language: { en: 'Language', hi: 'भाषा' },
  languageSystem: { en: 'Phone language', hi: 'फ़ोन की भाषा' },
  languageNote: {
    en: 'Changes the menus, buttons and messages. Verses always show Sanskrit with the Hindi and English you pick below.',
    hi: 'इससे मेन्यू, बटन और संदेशों की भाषा बदलती है। श्लोक हमेशा संस्कृत में दिखते हैं, साथ में नीचे चुने गए हिन्दी और अंग्रेज़ी अर्थ।',
  },
  dailyVerse: { en: 'Daily verse', hi: 'दैनिक श्लोक' },
  dailyVerseNotification: { en: 'Verse of the day notification', hi: 'आज के श्लोक की सूचना' },
  reminderTime: { en: 'Time', hi: 'समय' },
  reminderTimeA11y: (time: string) => ({ en: `Notification time ${time}. Change`, hi: `सूचना का समय ${time}। बदलें` }),
  dailyVerseNote: {
    en: 'One Bhagavad Gita verse each day, in full, at the time you pick. Scheduled on this phone; nothing is sent anywhere.',
    hi: 'हर दिन भगवद्गीता का एक पूरा श्लोक, आपके चुने समय पर। सूचना इसी फ़ोन पर तय होती है, कहीं कुछ नहीं भेजा जाता।',
  },
  notificationsOffTitle: { en: 'Notifications are off', hi: 'सूचनाएँ बंद हैं' },
  notificationsOffBody: {
    en: 'Allow notifications for Dharma Granth in your phone settings to get the daily verse.',
    hi: 'रोज़ का श्लोक पाने के लिए फ़ोन की सेटिंग्स में धर्म ग्रन्थ की सूचनाएँ चालू करें।',
  },
  notificationsBlocked: {
    en: 'Notifications are turned off for this app. Open phone settings to allow them.',
    hi: 'इस ऐप की सूचनाएँ बंद हैं। उन्हें चालू करने के लिए फ़ोन की सेटिंग्स खोलें।',
  },
  notNow: { en: 'Not now', hi: 'अभी नहीं' },
  widgetAdd: { en: 'Add the verse to your home screen', hi: 'श्लोक को होम स्क्रीन पर लगाएँ' },
  widgetHowTitle: { en: 'Add the widget', hi: 'विजेट लगाएँ' },
  widgetHowBody: {
    en: 'Touch and hold an empty spot on your home screen, tap Widgets, then pick Dharma Granth.',
    hi: 'होम स्क्रीन पर किसी खाली जगह को दबाकर रखें, विजेट चुनें, फिर धर्म ग्रन्थ चुनें।',
  },
  openSettings: { en: 'Open settings', hi: 'सेटिंग्स खोलें' },
  theme: { en: 'Theme', hi: 'रंग-रूप' },
  themeA11y: (name: string) => ({ en: `${name} theme`, hi: `${name} थीम` }),
  textSize: { en: 'Text size', hi: 'अक्षर का आकार' },
  textSizeA11y: (percent: number) => ({ en: `Text size ${percent} percent`, hi: `अक्षर का आकार ${percent} प्रतिशत` }),
  showInVerses: { en: 'Show in verses', hi: 'श्लोक में दिखाएँ' },
  showTransliteration: { en: 'Transliteration', hi: 'लिप्यन्तरण' },
  showHindi: { en: 'Hindi meaning', hi: 'हिन्दी अर्थ' },
  showEnglish: { en: 'English translation', hi: 'अंग्रेज़ी अनुवाद' },
  showNotes: { en: 'Open notes by default', hi: 'टिप्पणी पहले से खुली रखें' },
  effects: { en: 'Visual effects', hi: 'दृश्य प्रभाव' },
  effectsAuto: { en: 'Automatic', hi: 'अपने-आप' },
  effectsFull: { en: 'Full glass', hi: 'पूरा ग्लास' },
  effectsLight: { en: 'Light', hi: 'हल्का' },
  effectsNote: (lightNow: boolean) => ({
    en: `Light keeps the colours but drops the shadows and sheen on cards, so long lists scroll smoothly on budget phones. Automatic picks it on older or entry-level phones and when animations are turned off. In use now: ${lightNow ? 'Light' : 'Full glass'}.`,
    hi: `हल्का प्रभाव रंग वैसे ही रखता है, पर कार्ड की छाया और चमक हटा देता है, ताकि सस्ते फ़ोन पर भी लम्बी सूचियाँ आराम से स्क्रॉल हों। 'अपने-आप' पुराने या कम क्षमता वाले फ़ोन पर, और ऐनिमेशन बंद होने पर, इसे चुन लेता है। अभी: ${lightNow ? 'हल्का' : 'पूरा ग्लास'}।`,
  }),
  sanskritAlwaysFull: { en: 'The Sanskrit text is always shown in full.', hi: 'संस्कृत मूल पाठ हमेशा पूरा दिखाया जाता है।' },
  backup: { en: 'Backup', hi: 'बैकअप' },
  backupBody: (saved: number) => ({
    en: `No account, nothing uploaded. Your ${n(saved)} saved verses and settings live only on this phone. Export a JSON file to keep a copy, and import it on a new phone.`,
    hi: `न कोई खाता, न कुछ अपलोड। आपके ${n(saved)} सहेजे गए श्लोक और सेटिंग्स केवल इसी फ़ोन में हैं। एक कॉपी रखने के लिए JSON फ़ाइल एक्सपोर्ट करें, और नए फ़ोन में उसे इम्पोर्ट करें।`,
  }),
  exportBtn: { en: 'Export', hi: 'एक्सपोर्ट' },
  importBtn: { en: 'Import', hi: 'इम्पोर्ट' },
  saveBackupDialog: { en: 'Save backup', hi: 'बैकअप सहेजें' },
  backupSaved: { en: 'Backup saved', hi: 'बैकअप सहेज लिया गया' },
  exportFailed: { en: 'Could not export', hi: 'एक्सपोर्ट नहीं हो सका' },
  importFailed: { en: 'Could not import', hi: 'इम्पोर्ट नहीं हो सका' },
  backupRestored: { en: 'Backup restored', hi: 'बैकअप वापस आ गया' },
  backupRestoredBody: (added: number) => ({
    en: `${n(added)} saved verses added. Settings restored.`,
    hi: `${n(added)} सहेजे गए श्लोक जोड़े गए। सेटिंग्स वापस आ गईं।`,
  }),
  backupNotJson: { en: 'This file is not valid JSON.', hi: 'यह फ़ाइल सही JSON नहीं है।' },
  backupWrongFile: { en: 'This is not a Dharma Granth backup file.', hi: 'यह धर्म ग्रन्थ की बैकअप फ़ाइल नहीं है।' },
  backupTooNew: { en: 'This backup was made by a newer version of the app.', hi: 'यह बैकअप ऐप के नए संस्करण से बना है। पहले ऐप अपडेट करें।' },
  about: { en: 'About', hi: 'परिचय' },
  aboutBody: (total: number, offline: number) => ({
    en: `${n(total)} scriptures in the library, ${n(offline)} readable offline out of the box. Larger texts (epics, Puranas, Rig Veda) can be downloaded from dharmagranth.dev to read offline.`,
    hi: `संग्रह में ${n(total)} ग्रन्थ हैं, जिनमें से ${n(offline)} शुरू से बिना इंटरनेट पढ़े जा सकते हैं। बड़े ग्रन्थ (महाकाव्य, पुराण, ऋग्वेद) dharmagranth.dev से डाउनलोड करके बिना इंटरनेट पढ़ सकते हैं।`,
  }),
  privacyPolicy: { en: 'Privacy policy', hi: 'गोपनीयता नीति' },

  // Downloads of the large texts (src/content/downloads.ts)
  canDownload: { en: 'Can be downloaded', hi: 'डाउनलोड किया जा सकता है' },
  downloadedOffline: { en: 'Downloaded, available offline', hi: 'डाउनलोड हो चुका, बिना इंटरनेट उपलब्ध' },
  downloadTitle: { en: 'Download to read offline', hi: 'बिना इंटरनेट पढ़ने के लिए डाउनलोड करें' },
  downloadSize: (download: string, onPhone: string) => ({
    en: `About ${download} to download, ${onPhone} on your phone.`,
    hi: `लगभग ${download} डाउनलोड होगा, फ़ोन में ${onPhone} जगह लेगा।`,
  }),
  downloadChecking: { en: 'Checking size…', hi: 'साइज़ देख रहे हैं…' },
  downloadOffline: { en: 'Could not reach dharmagranth.dev. Check your connection.', hi: 'dharmagranth.dev से जुड़ नहीं पाए। इंटरनेट कनेक्शन देखें।' },
  downloadNotYet: { en: 'This text is not available for download yet.', hi: 'यह ग्रन्थ अभी डाउनलोड के लिए उपलब्ध नहीं है।' },
  downloadBtn: { en: 'Download', hi: 'डाउनलोड' },
  downloadA11y: (title: string) => ({ en: `Download ${title}`, hi: `${title} डाउनलोड करें` }),
  readOnline: { en: 'Read online', hi: 'ऑनलाइन पढ़ें' },
  downloading: (pct: number) => ({ en: `Downloading… ${pct}%`, hi: `डाउनलोड हो रहा है… ${pct}%` }),
  downloadProgress: (done: string, total: string) => ({ en: `${done} of ${total}`, hi: `${total} में से ${done}` }),
  downloadStarting: { en: 'Starting…', hi: 'शुरू हो रहा है…' },
  cancel: { en: 'Cancel', hi: 'रद्द करें' },
  cancelDownloadA11y: { en: 'Cancel download', hi: 'डाउनलोड रद्द करें' },
  downloadedSize: (size: string) => ({ en: `Downloaded · ${size}`, hi: `डाउनलोड हो चुका · ${size}` }),
  downloadReady: { en: 'Readable offline.', hi: 'बिना इंटरनेट पढ़ सकते हैं।' },
  downloadUpdateAvailable: { en: 'A corrected edition is available.', hi: 'सुधरा हुआ संस्करण उपलब्ध है।' },
  updateBtn: { en: 'Update', hi: 'अपडेट' },
  updateDownloadA11y: { en: 'Update download', hi: 'डाउनलोड अपडेट करें' },
  deleteBtn: { en: 'Delete', hi: 'हटाएँ' },
  deleteFromPhoneA11y: (title: string) => ({ en: `Delete ${title} from this phone`, hi: `${title} को इस फ़ोन से हटाएँ` }),
  deleteDownloadTitle: (title: string) => ({ en: `Delete ${title}?`, hi: `${title} हटाएँ?` }),
  deleteDownloadBody: (size: string) => ({
    en: `This frees ${size}. You can download it again at any time.`,
    hi: `इससे ${size} जगह खाली होगी। आप इसे कभी भी फिर से डाउनलोड कर सकते हैं।`,
  }),
  downloadsSection: { en: 'Downloaded texts', hi: 'डाउनलोड किए ग्रन्थ' },
  downloadsEmpty: {
    en: 'No texts downloaded yet. Open a large text such as the Mahabharata or a Purana and tap Download to read it offline.',
    hi: 'अभी कोई ग्रन्थ डाउनलोड नहीं हुआ। महाभारत या कोई पुराण खोलें और बिना इंटरनेट पढ़ने के लिए डाउनलोड दबाएँ।',
  },
  downloadsSummary: (count: number, size: string, active: number) => ({
    en: `${n(count)} ${count === 1 ? 'text' : 'texts'} on this phone, ${size} in all.${active ? ` ${n(active)} downloading.` : ''}`,
    hi: `इस फ़ोन में ${n(count)} ग्रन्थ, कुल ${size}।${active ? ` ${n(active)} डाउनलोड हो रहे हैं।` : ''}`,
  }),
  chapterNeedsDownload: (title: string) => ({
    en: `Download ${title} to read this chapter offline.`,
    hi: `यह अध्याय बिना इंटरनेट पढ़ने के लिए ${title} डाउनलोड करें।`,
  }),
  goToDownload: { en: 'Go to download', hi: 'डाउनलोड पर जाएँ' },

  // Verse search over downloaded texts (src/content/download-index.ts)
  searchIntro: (texts: number, downloaded: number) => ({
    en: `Sanskrit, Hindi, transliteration or English, across ${n(texts)} texts${downloaded ? `, including the ${n(downloaded)} you downloaded` : ''}. Works offline.`,
    hi: `संस्कृत, हिन्दी, लिप्यन्तरण या अंग्रेज़ी में, ${n(texts)} ग्रन्थों में${downloaded ? `, जिनमें आपके डाउनलोड किए ${n(downloaded)} भी हैं` : ''}। बिना इंटरनेट चलता है।`,
  }),
  searchPreparingDownloads: (titles: string) => ({
    en: `Getting ${titles} ready for search. Their verses will show up here in a moment.`,
    hi: `${titles} को खोज के लिए तैयार कर रहे हैं। इनके श्लोक थोड़ी देर में यहाँ दिखेंगे।`,
  }),

  // Redesign: floating tab bar, large headers, reader toolbar and sheets
  tabA11y: (label: string, position: number, count: number) => ({
    en: `${label}, tab ${position} of ${count}`,
    hi: `${label}, ${count} में से टैब ${position}`,
  }),
  librarySummary: (offline: number, toDownload: number) => ({
    en: `${n(offline)} texts on this phone${toDownload ? ` · ${n(toDownload)} to download` : ''}`,
    hi: `इस फ़ोन में ${n(offline)} ग्रन्थ${toDownload ? ` · ${n(toDownload)} डाउनलोड के लिए` : ''}`,
  }),
  onThisPhone: { en: 'On this phone', hi: 'इस फ़ोन में' },
  savedCount: (count: number) => ({ en: `${n(count)} saved`, hi: `${n(count)} सहेजे गए` }),
  readingNow: { en: 'Reading now', hi: 'अभी पढ़ रहे हैं' },
  continueChapter: (num: number) => ({ en: `Continue at chapter ${num}`, hi: `अध्याय ${num} से आगे पढ़ें` }),
  readingOptions: { en: 'Reading options', hi: 'पढ़ने के विकल्प' },
  close: { en: 'Close', hi: 'बंद करें' },
  jumpToVerse: { en: 'Go to verse', hi: 'श्लोक पर जाएँ' },
  jumpToVerseA11y: (verse: string, total: number) => ({
    en: `Verse ${verse} of ${n(total)}. Go to another verse`,
    hi: `${n(total)} में से श्लोक ${verse}। किसी और श्लोक पर जाएँ`,
  }),
  verseOf: (verse: string, total: number) => ({ en: `Verse ${verse} of ${n(total)}`, hi: `श्लोक ${verse} / ${n(total)}` }),
  nextChapterLabel: { en: 'Next chapter', hi: 'अगला अध्याय' },
  firstChapter: { en: 'This is the first chapter', hi: 'यह पहला अध्याय है' },
  lastChapter: { en: 'This is the last chapter', hi: 'यह आख़िरी अध्याय है' },
  savedSummary: (count: number) => ({
    en: `${n(count)} ${count === 1 ? 'verse' : 'verses'} · kept on this phone only`,
    hi: `${n(count)} श्लोक · केवल इसी फ़ोन में`,
  }),
  savedEmptyTitle: { en: 'Keep the verses that speak to you', hi: 'जो श्लोक मन को छुएँ, उन्हें सहेजें' },
  startWithGita: { en: 'Start with the Bhagavad Gita', hi: 'भगवद्गीता से शुरू करें' },
} satisfies Record<string, Msg | ((...args: never[]) => Msg)>;
