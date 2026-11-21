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
  listenVerseA11y: (ref: string) => ({ en: `Listen to verse ${ref}`, hi: `श्लोक ${ref} सुनें` }),
  pauseVerseA11y: (ref: string) => ({ en: `Pause verse ${ref}`, hi: `श्लोक ${ref} रोकें` }),
  retryVerseA11y: (ref: string) => ({ en: `Verse ${ref} could not load. Try again`, hi: `श्लोक ${ref} नहीं चल सका। फिर से कोशिश करें` }),

  // Recitation (reader toolbar)
  listenChapterA11y: (verse: string) => ({
    en: `Listen to the Sanskrit recitation from verse ${verse}`,
    hi: `श्लोक ${verse} से संस्कृत पाठ सुनें`,
  }),
  pauseRecitation: { en: 'Pause recitation', hi: 'पाठ रोकें' },
  resumeRecitation: { en: 'Resume recitation', hi: 'पाठ फिर से चलाएँ' },
  retryRecitation: { en: 'Recitation could not load. Try again', hi: 'पाठ नहीं चल सका। फिर से कोशिश करें' },
  stopRecitation: { en: 'Stop recitation', hi: 'पाठ बंद करें' },
  recitingVerse: (verse: string, total: number) => ({ en: `Reciting ${verse} of ${n(total)}`, hi: `पाठ: श्लोक ${verse} / ${n(total)}` }),
  recitationCredit: { en: 'Recitation voice made with ElevenLabs', hi: 'पाठ की आवाज़ ElevenLabs से बनी है' },
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
  dailyChannelName: { en: 'Verse of the day', hi: 'आज का श्लोक' },
  dailyChannelDescription: {
    en: 'One Bhagavad Gita verse a day, at the time you choose.',
    hi: 'हर दिन भगवद्गीता का एक श्लोक, आपके चुने समय पर।',
  },
  bhagavadGita: { en: 'Bhagavad Gita', hi: 'श्रीमद्भगवद्गीता' },
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
  sanskritScript: { en: 'Sanskrit script', hi: 'संस्कृत की लिपि' },
  lineSpacing: { en: 'Line spacing', hi: 'पंक्तियों में दूरी' },
  spacingCompact: { en: 'Compact', hi: 'सघन' },
  spacingNormal: { en: 'Normal', hi: 'सामान्य' },
  spacingRelaxed: { en: 'Relaxed', hi: 'खुली' },
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

  // Chapter summaries (सार)
  summaryHeading: (unit: { en: string; hi: string }) => ({
    en: `${unit.en.charAt(0).toUpperCase()}${unit.en.slice(1)} summary`,
    hi: `${unit.hi} सार`,
  }),
  /** Switches the summary to the other language, so each label is written in the language it opens. */
  summaryReadOther: { en: 'हिन्दी में पढ़ें', hi: 'Read in English' },
  summaryMore: { en: 'Read more', hi: 'पूरा पढ़ें' },
  summaryLess: { en: 'Show less', hi: 'कम दिखाएँ' },
  summaryKeyVerses: (sutras: boolean) => (sutras ? { en: 'Key sutras', hi: 'मुख्य सूत्र' } : { en: 'Key verses', hi: 'मुख्य श्लोक' }),
  summaryDraft: {
    en: 'Editorial summary, not scripture. Awaiting editorial review.',
    hi: 'संपादकीय सार, मूल ग्रन्थ का पाठ नहीं। संपादकीय जाँच बाकी है।',
  },
  summaryReviewed: { en: 'Editorial summary, not scripture.', hi: 'संपादकीय सार, मूल ग्रन्थ का पाठ नहीं।' },
  summaryAllSub: { en: 'What each chapter covers, at a glance', hi: 'हर अध्याय में क्या है, एक नज़र में' },
  summaryReadChapter: (unit: { en: string; hi: string }) => ({ en: `Read this ${unit.en}`, hi: `यह ${unit.hi} पढ़ें` }),
  keyVerseA11y: (verse: number, note: string) => ({ en: `Verse ${verse}: ${note}. Go to the verse`, hi: `श्लोक ${verse}: ${note}। श्लोक पर जाएँ` }),

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
  // Knowledge pages and Wisdom for life (src/app/knowledge, src/app/wisdom)
  knowledgeTitle: { en: 'Knowledge', hi: 'ज्ञान कोश' },
  knowledgeEyebrow: { en: 'Learn the tradition', hi: 'परंपरा को समझें' },
  knowledgeSummary: { en: 'Ideas, words, people, places and the long story of the texts', hi: 'विचार, शब्द, पात्र, स्थान और ग्रन्थों की लंबी कहानी' },
  knowledgeEntryDetail: {
    en: 'Concepts, dictionary, characters, places, timelines',
    hi: 'अवधारणाएँ, शब्दकोश, पात्र, स्थान, कालक्रम',
  },
  kConcepts: { en: 'Concepts', hi: 'अवधारणाएँ' },
  kConceptsBlurb: { en: 'Brahman, karma, maya and how they connect', hi: 'ब्रह्म, कर्म, माया और उनके आपसी संबंध' },
  kDictionary: { en: 'Sanskrit dictionary', hi: 'संस्कृत शब्दकोश' },
  kDictionaryBlurb: { en: 'Key words, their roots and the verses that use them', hi: 'मुख्य शब्द, उनकी धातु और उनसे जुड़े श्लोक' },
  kCharacters: { en: 'Characters', hi: 'पात्र' },
  kCharactersBlurb: { en: 'Krishna, Sita, Vyasa and the people of the epics', hi: 'कृष्ण, सीता, व्यास और महाकाव्यों के पात्र' },
  kPlaces: { en: 'Sacred places', hi: 'पवित्र स्थान' },
  kPlacesBlurb: { en: 'Cities, rivers, forests and mountains of the texts', hi: 'ग्रन्थों के नगर, नदियाँ, वन और पर्वत' },
  kTimelines: { en: 'Timelines', hi: 'कालक्रम' },
  kTimelinesBlurb: { en: 'Story order, traditional and academic dates', hi: 'कथा-क्रम, पारंपरिक और शैक्षणिक तिथियाँ' },
  kEntries: (count: number) => ({ en: `${n(count)} entries`, hi: `${n(count)} प्रविष्टियाँ` }),
  kFilter: (kind: string) => ({ en: `Filter ${kind.toLowerCase()}`, hi: `${kind} में खोजें` }),
  kNoMatch: (query: string) => ({ en: `Nothing matches “${query}”.`, hi: `“${query}” से कुछ नहीं मिला।` }),
  // Shown only when the content is not in the reader's interface language.
  kEnglishOnly: { en: 'In English, as on the website.', hi: 'यह सामग्री वेबसाइट पर भी अभी केवल अंग्रेज़ी में है।' },
  kHindiOnly: { en: 'This text is in Hindi, as on the website.', hi: 'यह सामग्री हिन्दी में है।' },
  kMeaning: { en: 'Meaning', hi: 'अर्थ' },
  kDescription: { en: 'In brief', hi: 'संक्षेप में' },
  kDerivation: { en: 'Root and derivation', hi: 'धातु और व्युत्पत्ति' },
  kRoot: (root: string) => ({ en: `Root: ${root}`, hi: `धातु: ${root}` }),
  kContextual: { en: 'Meaning by context', hi: 'संदर्भ के अनुसार अर्थ' },
  kTraditions: { en: 'How the traditions read it', hi: 'परंपराएँ इसे कैसे देखती हैं' },
  kMisunderstandings: { en: 'Common misunderstandings', hi: 'आम भ्रांतियाँ' },
  kMyth: { en: 'Misreading', hi: 'भ्रम' },
  kCorrection: { en: 'Closer to the texts', hi: 'ग्रन्थों के अनुसार' },
  kVerses: { en: 'In the scriptures', hi: 'ग्रन्थों में' },
  kConnected: { en: 'Connected ideas', hi: 'जुड़े हुए विचार' },
  kSources: { en: 'Sources', hi: 'स्रोत' },
  kDefinition: { en: 'Definition', hi: 'परिभाषा' },
  kEtymology: { en: 'Etymology', hi: 'व्युत्पत्ति' },
  kKeyTexts: { en: 'Key texts', hi: 'मुख्य ग्रन्थ' },
  kRelatedTerms: { en: 'Related terms', hi: 'संबंधित शब्द' },
  kCrossTradition: { en: 'Across traditions', hi: 'विभिन्न परंपराओं में' },
  kBiography: { en: 'Life', hi: 'जीवन परिचय' },
  kRelations: { en: 'Family and relations', hi: 'परिवार और संबंध' },
  kEvents: { en: 'Key events', hi: 'मुख्य घटनाएँ' },
  kDialogues: { en: 'In their own words', hi: 'उनके अपने शब्द' },
  kDilemmas: { en: 'Moral dilemmas', hi: 'धर्म-संकट' },
  kResolution: { en: 'How it resolved', hi: 'समाधान' },
  kInterpretations: { en: 'Interpretations', hi: 'व्याख्याएँ' },
  kSignificance: { en: 'Significance', hi: 'महत्त्व' },
  kAssociations: { en: 'Associated with', hi: 'जुड़े हुए' },
  kIdentification: { en: 'Where it is', hi: 'यह कहाँ है' },
  kTraditional: { en: 'In tradition', hi: 'परंपरा में' },
  kPresentDay: { en: 'Today', hi: 'आज' },
  kDebated: { en: 'Debated', hi: 'मतभेद' },
  kSymbolic: { en: 'Symbolic reading', hi: 'प्रतीकात्मक अर्थ' },
  kOpenMap: { en: 'Open in Maps', hi: 'मैप में खोलें' },
  kOpenMapA11y: (name: string) => ({ en: `Open ${name} in Maps`, hi: `${name} को मैप में खोलें` }),
  kEventCount: (count: number) => ({ en: `${n(count)} events`, hi: `${n(count)} घटनाएँ` }),
  kTexts: { en: 'Texts', hi: 'ग्रन्थ' },
  kFigures: { en: 'People', hi: 'व्यक्ति' },
  kReadVerse: { en: 'Read in the scripture', hi: 'ग्रन्थ में पढ़ें' },
  kReadVerseA11y: (ref: string) => ({ en: `Read ${ref} in the scripture`, hi: `${ref} ग्रन्थ में पढ़ें` }),
  kOpenEntryA11y: (title: string) => ({ en: `Open ${title}`, hi: `${title} खोलें` }),

  wisdomTitle: { en: 'Wisdom for life', hi: 'जीवन के लिए ज्ञान' },
  wisdomEyebrow: { en: 'Guidance from the texts', hi: 'शास्त्रों से मार्गदर्शन' },
  wisdomSummary: {
    en: 'Pick what you are facing and read the verses that speak to it',
    hi: 'आप जिससे गुज़र रहे हैं, उसे चुनें और उससे जुड़े श्लोक पढ़ें',
  },
  wisdomAsk: { en: 'What are you facing? Fear, anger, grief…', hi: 'आप किससे जूझ रहे हैं? डर, गुस्सा, दुख…' },
  wisdomTopics: (count: number) => ({ en: `${n(count)} topics`, hi: `${n(count)} विषय` }),
  wisdomMinutes: (min: number) => ({ en: `${n(min)} min read`, hi: `${n(min)} मिनट` }),
  wisdomVerseCount: (count: number) => ({ en: `${n(count)} ${count === 1 ? 'verse' : 'verses'}`, hi: `${n(count)} श्लोक` }),
  wisdomIntro: { en: 'Where you are', hi: 'आप जहाँ हैं' },
  wisdomVerses: { en: 'Verses for this', hi: 'इसके लिए श्लोक' },
  wisdomSpeaker: (speaker: string, addressee: string) => ({ en: `${speaker} to ${addressee}`, hi: `${speaker} → ${addressee}` }),
  wisdomContext: { en: 'Traditional context', hi: 'पारंपरिक संदर्भ' },
  wisdomReflection: { en: 'Practical reflection', hi: 'व्यावहारिक चिंतन' },
  wisdomInsight: { en: 'Insight', hi: 'अंतर्दृष्टि' },
  wisdomContemplate: { en: 'Contemplate', hi: 'मनन करें' },
  wisdomPractice: { en: 'Today’s practice', hi: 'आज का अभ्यास' },
  wisdomConcepts: { en: 'Related concepts', hi: 'संबंधित अवधारणाएँ' },
  wisdomScriptures: { en: 'Read further', hi: 'आगे पढ़ें' },
  wisdomPrev: { en: 'Previous topic', hi: 'पिछला विषय' },
  wisdomNext: { en: 'Next topic', hi: 'अगला विषय' },
  wisdomOpenA11y: (title: string, verses: number) => ({
    en: `${title}, ${n(verses)} ${verses === 1 ? 'verse' : 'verses'}`,
    hi: `${title}, ${n(verses)} श्लोक`,
  }),
  wisdomEntryDetail: { en: 'Fear, anger, grief, duty and more', hi: 'डर, गुस्सा, दुख, कर्तव्य और भी' },

  // Accessibility (TalkBack labels, hints and announcements)
  verseOfTheDayFullA11y: (ref: string, text: string) => ({ en: `Verse of the day, ${ref}. ${text}`, hi: `आज का श्लोक, ${ref}। ${text}` }),
  verseSavedAnnounce: { en: 'Verse saved', hi: 'श्लोक सहेजा गया' },
  verseRemovedAnnounce: { en: 'Removed from saved verses', hi: 'सहेजे गए श्लोकों से हटाया गया' },
  readingNowA11y: { en: 'reading now', hi: 'अभी पढ़ रहे हैं' },

  // Verse search screen: large header, the field at the bottom in the thumb zone
  searchTitle: { en: 'Search verses', hi: 'श्लोक खोजें' },
  searchEyebrow: { en: 'Works offline', hi: 'बिना इंटरनेट' },
  searchField: { en: 'Words from a verse', hi: 'श्लोक के शब्द' },
  clearSearch: { en: 'Clear search', hi: 'खोज मिटाएँ' },
  searchTry: { en: 'Try', hi: 'ऐसे खोजें' },
  searchForA11y: (example: string) => ({ en: `Search for ${example}`, hi: `${example} खोजें` }),
  searchNoVerse: (query: string, inSection: boolean) => ({
    en: `No verse matches “${query}”${inSection ? ' in this section' : ''}. Try fewer words or another spelling.`,
    hi: `${inSection ? 'इस वर्ग में ' : ''}“${query}” से मिलता कोई श्लोक नहीं मिला। कम शब्द या दूसरी वर्तनी आज़माएँ।`,
  }),
  searchResultA11y: (ref: string, text: string) => ({ en: `${ref}. ${text}. Opens the verse`, hi: `${ref}। ${text}। श्लोक खोलता है` }),
} satisfies Record<string, Msg | ((...args: never[]) => Msg)>;
