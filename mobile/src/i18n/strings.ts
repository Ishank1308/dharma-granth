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
    en: `${n(total)} scriptures in the library, ${n(offline)} readable offline. Larger texts (epics, Puranas, Rig Veda) open on the website.`,
    hi: `संग्रह में ${n(total)} ग्रन्थ हैं, जिनमें से ${n(offline)} बिना इंटरनेट पढ़े जा सकते हैं। बड़े ग्रन्थ (महाकाव्य, पुराण, ऋग्वेद) वेबसाइट पर खुलते हैं।`,
  }),
  privacyPolicy: { en: 'Privacy policy', hi: 'गोपनीयता नीति' },
} satisfies Record<string, Msg | ((...args: never[]) => Msg)>;

