/**
 * Interface text for the study desk, compare, the study sheet and the About / Methodology / Sources page,
 * in English and Hindi. Kept beside ./strings (same rules: everyday phone Hindi, Western digits) in its own
 * file so parallel work on other screens does not collide in one long object.
 */
import type { Msg } from './strings';

const n = (value: number) => value.toLocaleString('en-IN');

export const D = {
  // Study desk (src/app/desk/index.tsx), after the website's /practice/desk and /practice/dashboard
  deskTitle: { en: 'Study desk', hi: 'अध्ययन-पटल' },
  deskEyebrow: { en: 'Private · on this phone', hi: 'निजी · इसी फ़ोन में' },
  deskSub: {
    en: 'Your reading queue, saved verses, reflections and reading record. No account, nothing uploaded.',
    hi: 'आपकी पठन-सूची, सहेजे श्लोक, चिन्तन और पढ़ाई का हिसाब। न खाता, न कुछ अपलोड।',
  },
  deskEntry: { en: 'Queue, saved, notes and your week', hi: 'सूची, सहेजे, टिप्पणियाँ और आपका सप्ताह' },
  statVerses: { en: 'Verses read', hi: 'श्लोक पढ़े' },
  statDays: { en: 'Days of reading', hi: 'पढ़ाई के दिन' },
  statChapters: (chapters: number, books: number) => ({
    en: `${n(chapters)} ${chapters === 1 ? 'chapter' : 'chapters'} in ${n(books)} ${books === 1 ? 'text' : 'texts'}`,
    hi: `${n(books)} ग्रन्थों के ${n(chapters)} अध्याय`,
  }),
  statStreak: (current: number, best: number) => ({
    en: `${n(current)} in a row now · best ${n(best)}`,
    hi: `अभी लगातार ${n(current)} · सबसे अधिक ${n(best)}`,
  }),
  weekTitle: { en: 'This week', hi: 'इस सप्ताह' },
  weekProgress: (done: number, goal: number) => ({
    en: `${n(done)} of ${n(goal)} reading days`,
    hi: `${n(goal)} में से ${n(done)} दिन पढ़ा`,
  }),
  weekMet: { en: 'This week’s goal is met.', hi: 'इस सप्ताह का लक्ष्य पूरा हुआ।' },
  weekGoal: { en: 'Days to read this week', hi: 'इस सप्ताह कितने दिन पढ़ें' },
  weekGoalA11y: (days: number) => ({ en: `${days} ${days === 1 ? 'day' : 'days'}`, hi: `${days} दिन` }),
  /** Monday first, comma separated: short labels, then full names for TalkBack. */
  weekdaysShort: { en: 'M,T,W,T,F,S,S', hi: 'सो,मं,बु,गु,शु,श,र' },
  weekdaysLong: {
    en: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
    hi: 'सोमवार,मंगलवार,बुधवार,गुरुवार,शुक्रवार,शनिवार,रविवार',
  },
  weekDayA11y: (day: string, read: boolean) => ({ en: `${day}: ${read ? 'read' : 'not read'}`, hi: `${day}: ${read ? 'पढ़ा' : 'नहीं पढ़ा'}` }),
  deskNoJudging: {
    en: 'Built only from this phone. It describes what you read; it never scores you or compares you with anyone.',
    hi: 'यह सिर्फ़ इसी फ़ोन से बनता है। यह बताता है कि क्या पढ़ा; न अंक देता है, न किसी से तुलना करता है।',
  },
  continueReading: { en: 'Continue reading', hi: 'पढ़ना जारी रखें' },
  inProgress: { en: 'Texts in progress', hi: 'चल रहे ग्रन्थ' },
  bookProgressA11y: (title: string, percent: number) => ({ en: `${title}, ${percent}% read`, hi: `${title}, ${percent}% पढ़ा` }),

  queueTitle: { en: 'Reading queue', hi: 'पठन-सूची' },
  queueEmpty: {
    en: 'Your queue is empty. Add saved verses to read them in the order you choose.',
    hi: 'सूची खाली है। सहेजे श्लोक जोड़ें और अपने क्रम में पढ़ें।',
  },
  queueAddSaved: { en: 'Add saved verses', hi: 'सहेजे श्लोक जोड़ें' },
  queueAddAll: (count: number) => ({ en: `Add all ${n(count)}`, hi: `सभी ${n(count)} जोड़ें` }),
  queueAdded: (count: number) => ({
    en: count === 0 ? 'Already in your queue' : `${n(count)} added to your queue`,
    hi: count === 0 ? 'पहले से सूची में है' : `${n(count)} सूची में जोड़े`,
  }),
  queueUp: (label: string) => ({ en: `Move ${label} up`, hi: `${label} ऊपर करें` }),
  queueDown: (label: string) => ({ en: `Move ${label} down`, hi: `${label} नीचे करें` }),
  queueRemove: (label: string) => ({ en: `Remove ${label} from the queue`, hi: `${label} सूची से हटाएँ` }),
  queueRemoved: { en: 'Removed from the queue', hi: 'सूची से हटाया' },
  queuePickTitle: { en: 'Add to the queue', hi: 'सूची में जोड़ें' },
  queuePickEmpty: { en: 'Every saved verse is already in the queue.', hi: 'सभी सहेजे श्लोक पहले से सूची में हैं।' },
  noSavedYet: { en: 'Save a verse with the bookmark in the reader first.', hi: 'पहले पढ़ते समय किसी श्लोक को सहेजें।' },

  savedTitle: { en: 'Saved verses', hi: 'सहेजे श्लोक' },
  savedCount: (count: number) => ({ en: `${n(count)} saved`, hi: `${n(count)} सहेजे` }),
  openSaved: { en: 'Open saved verses', hi: 'सहेजे श्लोक खोलें' },
  notesTitle: { en: 'Reflections and notes', hi: 'चिन्तन और टिप्पणियाँ' },
  notesEmpty: { en: 'No reflections yet. Write one about any verse; it stays on this phone.', hi: 'अभी कोई चिन्तन नहीं। किसी श्लोक पर लिखें; यह इसी फ़ोन में रहेगा।' },
  openJournal: { en: 'Open the journal', hi: 'डायरी खोलें' },
  newReflection: { en: 'New reflection', hi: 'नया चिन्तन' },
  untitled: { en: 'Untitled reflection', hi: 'बिना शीर्षक का चिन्तन' },
  toolsTitle: { en: 'Study tools', hi: 'अध्ययन के साधन' },

  // Compare (src/app/compare/*), after the website's /compare
  compareTitle: { en: 'Side by side', hi: 'साथ-साथ' },
  compareEyebrow: { en: 'Scripture pages', hi: 'शास्त्र' },
  compareSub: {
    en: 'Pages placed next to each other. No school is decided here, and nothing is said that the library does not hold.',
    hi: 'ये पृष्ठ साथ रखे गए हैं। कोई मत यहाँ तय नहीं किया गया। जो बात इस पुस्तकालय में नहीं है, वह यहाँ नहीं लिखी गई।',
  },
  compareEntry: { en: 'Two scriptures, side by side', hi: 'दो शास्त्र, साथ-साथ' },
  comparePairTitle: { en: 'Compare two verses', hi: 'दो श्लोक मिलाकर पढ़ें' },
  comparePairSub: { en: 'Pick any two saved or queued verses.', hi: 'सहेजे या सूची के कोई दो श्लोक चुनें।' },
  compareSlot: (slot: 'A' | 'B') => ({ en: `Verse ${slot}`, hi: `श्लोक ${slot}` }),
  compareChoose: { en: 'Choose a verse', hi: 'श्लोक चुनें' },
  compareShow: { en: 'Show side by side', hi: 'साथ-साथ देखें' },
  compareSets: { en: 'Pages set side by side', hi: 'साथ रखे पृष्ठ' },
  compareSwap: { en: 'Swap the two verses', hi: 'दोनों श्लोक बदलें' },
  compareNotOnPhone: {
    en: 'This text is not on the phone yet. Download it from its book page, or read it on dharmagranth.dev.',
    hi: 'यह ग्रन्थ अभी फ़ोन में नहीं है। इसके पेज से डाउनलोड करें, या dharmagranth.dev पर पढ़ें।',
  },
  compareMissing: { en: 'This verse could not be found.', hi: 'यह श्लोक नहीं मिला।' },
  compareOpenWeb: { en: 'Open on dharmagranth.dev', hi: 'dharmagranth.dev पर खोलें' },
  comparePickSource: { en: 'From your saved verses and queue', hi: 'सहेजे श्लोक और सूची से' },
  compareSheetAdd: { en: 'Put both on a study sheet', hi: 'दोनों को अध्ययन-पत्र में रखें' },

  // Study sheet (src/app/sheet.tsx), after the website's /pack
  sheetTitle: { en: 'Study sheet', hi: 'अध्ययन-पत्र' },
  sheetEyebrow: { en: 'Print or share as PDF', hi: 'प्रिंट करें या PDF भेजें' },
  sheetSub: {
    en: 'Choose verses and what to include. The PDF is made on this phone; your reflections are added only if you turn that on.',
    hi: 'श्लोक और उनके साथ क्या छपे, चुनें। PDF इसी फ़ोन पर बनती है; आपका चिन्तन तभी जुड़ता है जब आप उसे चालू करें।',
  },
  sheetEntry: { en: 'Verses on one page, as a PDF', hi: 'श्लोक एक पत्र पर, PDF में' },
  sheetStepVerses: { en: '1. Add verses', hi: '1. श्लोक जोड़ें' },
  sheetStepLayers: { en: '2. What to include', hi: '2. क्या शामिल करें' },
  sheetStepMake: { en: '3. Make the sheet', hi: '3. पत्र बनाएँ' },
  sheetAllSaved: (count: number) => ({ en: `All saved (${n(count)})`, hi: `सभी सहेजे (${n(count)})` }),
  sheetQueue: (count: number) => ({ en: `Reading queue (${n(count)})`, hi: `पठन-सूची (${n(count)})` }),
  sheetClear: { en: 'Clear', hi: 'सब हटाएँ' },
  sheetRemove: (label: string) => ({ en: `Remove ${label}`, hi: `${label} हटाएँ` }),
  sheetEmpty: { en: 'Add at least one verse.', hi: 'कम से कम एक श्लोक जोड़ें।' },
  sheetReady: (count: number) => ({ en: `${n(count)} ${count === 1 ? 'verse' : 'verses'} ready`, hi: `${n(count)} श्लोक तैयार` }),
  sheetSkipped: (count: number) => ({
    en: `${n(count)} could not be read from the phone and are left out.`,
    hi: `${n(count)} फ़ोन से पढ़े नहीं जा सके, इसलिए छोड़ दिए गए।`,
  }),
  sheetNameLabel: { en: 'Title for the sheet', hi: 'पत्र का शीर्षक' },
  sheetDefaultName: { en: 'My study sheet', hi: 'मेरा अध्ययन-पत्र' },
  sheetShare: { en: 'Share as PDF', hi: 'PDF के रूप में भेजें' },
  sheetPrint: { en: 'Print', hi: 'प्रिंट करें' },
  sheetFailed: { en: 'The sheet could not be made', hi: 'पत्र नहीं बन पाया' },
  sheetDialog: { en: 'Share the study sheet', hi: 'अध्ययन-पत्र भेजें' },
  layerVerse: { en: 'Original verse', hi: 'मूल श्लोक' },
  layerTranslit: { en: 'Transliteration', hi: 'लिप्यंतरण' },
  layerHindi: { en: 'Hindi meaning', hi: 'हिन्दी अर्थ' },
  layerEnglish: { en: 'English translation', hi: 'अंग्रेज़ी अनुवाद' },
  layerWords: { en: 'Word meanings', hi: 'शब्दार्थ' },
  layerNotes: { en: 'My reflections', hi: 'मेरा चिन्तन' },
  sheetPrepared: (date: string) => ({
    en: `Prepared from Dharma Granth · ${date} · Notes marked AI are machine translations, not scripture.`,
    hi: `धर्म ग्रन्थ से तैयार · ${date} · AI वाले अर्थ मशीन-अनुवाद हैं, शास्त्र नहीं।`,
  }),
  sheetHindi: { en: 'Hindi', hi: 'हिन्दी' },
  sheetEnglish: { en: 'English', hi: 'English' },
  sheetWords: { en: 'Word meanings', hi: 'शब्दार्थ' },
  sheetNote: { en: 'My reflection', hi: 'मेरा चिन्तन' },
  sheetAi: { en: 'AI-assisted', hi: 'AI-सहायता से' },
  sheetFooter: {
    en: 'Dharma Granth · dharmagranth.dev · Sanskrit text from open digital archives; see About, methodology and sources in the app.',
    hi: 'धर्म ग्रन्थ · dharmagranth.dev · संस्कृत पाठ खुले डिजिटल संग्रहों से; ऐप में "परिचय, कार्यपद्धति और स्रोत" देखें।',
  },

  // About, methodology and sources (src/app/about.tsx), after the website's /methodology and /sources
  aboutTitle: { en: 'About this app', hi: 'इस ऐप के बारे में' },
  aboutRow: { en: 'About, methodology and sources', hi: 'परिचय, कार्यपद्धति और स्रोत' },
  aboutEyebrow: { en: 'How it is made', hi: 'यह कैसे बना है' },
  aboutIntro: {
    en: 'Dharma Granth is a free library of Indian scripture in the original Sanskrit with Hindi and English meanings. This page says plainly where each kind of text comes from, what is machine-assisted, and what has not yet been reviewed by a person.',
    hi: 'धर्म ग्रन्थ भारतीय शास्त्रों का निःशुल्क पुस्तकालय है: मूल संस्कृत, हिन्दी और अंग्रेज़ी अर्थ के साथ। यह पेज साफ़ बताता है कि हर पाठ कहाँ से आया, क्या मशीन की मदद से बना, और किसकी अभी किसी व्यक्ति ने जाँच नहीं की।',
  },
  aboutPrivacyTitle: { en: 'Your privacy', hi: 'आपकी निजता' },
  aboutPrivacy: {
    en: 'There is no account. Saved verses, reflections, your reading queue and progress stay on this phone, and leave it only in a backup file you export yourself.',
    hi: 'कोई खाता नहीं है। सहेजे श्लोक, चिन्तन, पठन-सूची और प्रगति इसी फ़ोन में रहते हैं; ये तभी बाहर जाते हैं जब आप ख़ुद बैकअप फ़ाइल बनाएँ।',
  },
  mSourcesTitle: { en: 'Source texts', hi: 'मूल पाठ' },
  mSources: {
    en: 'The Sanskrit is imported from open digital archives, mainly sanskritdocuments.org and the DharmicData collection on GitHub. These are digitised texts, not critical editions made by this project, so spelling, sandhi and verse numbering can differ from the printed edition you use. Numbering follows the imported source.',
    hi: 'संस्कृत पाठ खुले डिजिटल संग्रहों से लिया गया है, मुख्यतः sanskritdocuments.org और GitHub के DharmicData संग्रह से। ये डिजिटल पाठ हैं, इस परियोजना के बनाए समीक्षित संस्करण नहीं; इसलिए वर्तनी, सन्धि और श्लोक-संख्या आपके छपे संस्करण से अलग हो सकती है। संख्या मूल स्रोत के अनुसार है।',
  },
  mTranslationsTitle: { en: 'Translations', hi: 'अनुवाद' },
  mTranslations: {
    en: 'Where the archive supplies a Hindi or English translation, it is used as supplied. Where it does not, a translation was drafted with AI assistance, and the reader marks it “AI-assisted”. These have not been checked by a Sanskrit scholar: treat them as reading aids, and check the Sanskrit and a printed translation for anything that matters.',
    hi: 'जहाँ संग्रह में हिन्दी या अंग्रेज़ी अनुवाद है, वही दिया गया है। जहाँ नहीं है, वहाँ अनुवाद AI की मदद से बना, और उस पर "AI-सहायता से" लिखा रहता है। इनकी किसी संस्कृत विद्वान ने जाँच नहीं की है: इन्हें पढ़ने का सहारा मानें, और ज़रूरी बात के लिए संस्कृत और छपा अनुवाद देखें।',
  },
  mExplainTitle: { en: 'Explanations and commentary', hi: 'व्याख्या और टीका' },
  mExplain: {
    en: 'Summaries, व्याख्या, modern examples and reflection questions are editorial, written to help new readers, and marked as not scripture. Classical commentators are named only where a short paraphrase is attributed to them; those are not quotations of the original commentaries.',
    hi: 'सार, व्याख्या, आज के उदाहरण और चिन्तन के प्रश्न सम्पादकीय हैं, नए पाठकों की मदद के लिए लिखे गए, और "शास्त्र नहीं" के रूप में चिह्नित हैं। पारम्परिक टीकाकारों का नाम वहीं आता है जहाँ उनकी बात का छोटा सार दिया है; यह मूल टीका का उद्धरण नहीं है।',
  },
  mAiTitle: { en: 'AI assistance', hi: 'AI की मदद' },
  mAi: {
    en: 'AI (Anthropic’s Claude, among other tools) helped draft translations, summaries and explanations, and helped build the website and this app. AI can make confident-sounding mistakes, which is why such text is flagged and kept apart from the Sanskrit.',
    hi: 'AI (Anthropic का Claude और अन्य साधन) ने अनुवाद, सार और व्याख्या का प्रारूप बनाने में, और वेबसाइट व यह ऐप बनाने में मदद की। AI आत्मविश्वास से भरी ग़लती भी कर सकता है, इसलिए ऐसा पाठ चिह्नित है और संस्कृत से अलग रखा गया है।',
  },
  mReviewTitle: { en: 'Human review and corrections', hi: 'व्यक्ति द्वारा जाँच और सुधार' },
  mReview: {
    en: 'No systematic human review is recorded yet, so the app shows no “verified” badges. Fixes are made in the public project repository, whose history is the record of every change.',
    hi: 'अभी तक व्यवस्थित जाँच दर्ज नहीं है, इसलिए ऐप कोई "सत्यापित" चिह्न नहीं दिखाता। सुधार सार्वजनिक परियोजना-भंडार में होते हैं, जिसका इतिहास हर बदलाव का रिकॉर्ड है।',
  },
  mArtTitle: { en: 'Cover paintings', hi: 'आवरण के चित्र' },
  mArt: {
    en: 'The paintings on the book covers are old works in the public domain, most by Raja Ravi Varma (1848–1906) and the Ravi Varma Press, with a few older Indian paintings by unknown hands. They come from Wikimedia Commons and are cropped to fit the cover.',
    hi: 'ग्रन्थों के आवरण पर लगे चित्र पुराने, सार्वजनिक डोमेन के चित्र हैं: अधिकतर राजा रवि वर्मा (1848–1906) और रवि वर्मा प्रेस के, और कुछ उनसे पुराने भारतीय चित्र जिनके चित्रकार अज्ञात हैं। ये विकिमीडिया कॉमन्स से लिए गए हैं और आवरण के आकार में काटे गए हैं।',
  },
  mRightsTitle: { en: 'Rights', hi: 'अधिकार' },
  mRights: {
    en: 'The classical texts are ancient and not under copyright, but a particular edition or translation can be. If you hold rights in material shown here, tell the editors through dharmagranth.dev and it will be reviewed.',
    hi: 'प्राचीन शास्त्र कॉपीराइट में नहीं हैं, पर कोई ख़ास संस्करण या अनुवाद हो सकता है। अगर यहाँ दिखी किसी सामग्री पर आपका अधिकार है, तो dharmagranth.dev के ज़रिए सम्पादकों को बताएँ; उसकी समीक्षा होगी।',
  },
  sourcesTitle: { en: 'Editions behind the texts', hi: 'ग्रन्थों के संस्करण' },
  sourcesSub: (count: number) => ({
    en: `The reference edition named for ${n(count)} texts in this app.`,
    hi: `इस ऐप के ${n(count)} ग्रन्थों के लिए बताया गया संदर्भ-संस्करण।`,
  }),
  srcEdition: { en: 'Edition', hi: 'संस्करण' },
  srcPublisher: { en: 'Publisher or archive', hi: 'प्रकाशक या संग्रह' },
  srcTranslator: { en: 'Translation', hi: 'अनुवाद' },
  srcCommentary: { en: 'Commentary', hi: 'टीका' },
  srcNumbering: { en: 'Numbering', hi: 'श्लोक-संख्या' },
  fullMethodology: { en: 'Full methodology on the website', hi: 'पूरी कार्यपद्धति वेबसाइट पर' },
  fullSources: { en: 'All sources on the website', hi: 'सभी स्रोत वेबसाइट पर' },
} satisfies Record<string, Msg | ((...args: never[]) => Msg)>;
