import { lifeProblemTopics } from './wisdom-life-problems';
import { coreTeachingTopics } from './wisdom-core-teachings';

export interface ScriptureReference {
  id: string;
  scriptureId: string;
  scriptureName: string;
  scriptureNameHi: string;
  chapterNumber: number;
  verseNumber: number | string;
  referenceDisplay: string;
  referenceDisplayHi: string;
  sanskritDevanagari: string;
  sanskritTransliteration: string;
  literalTranslationHi: string;
  literalTranslationEn: string;
  traditionalContext: {
    speaker: string;
    addressee: string;
    setting: string;
    settingHi: string;
    commentaryNote: string;
    commentaryNoteHi: string;
  };
  readerHref: string;
  /** Where this verse sits in the Dharma Granth library, when its numbering differs from the traditional citation shown. */
  libraryRef?: { chapter: number; verse: number | string };
}

export interface PracticalReflection {
  title: string;
  titleHi: string;
  insight: string;
  insightHi: string;
  contemplationPrompt: string;
  contemplationPromptHi: string;
  dailyPractice: string;
  dailyPracticeHi: string;
}

export interface RelatedConceptItem {
  id: string;
  labelEn: string;
  labelHi: string;
  sanskrit: string;
  description: string;
  descriptionHi: string;
  href: string;
}

export interface RelatedScriptureItem {
  id: string;
  title: string;
  titleHi: string;
  titleSanskrit: string;
  description: string;
  descriptionHi: string;
  href: string;
}

export interface SourceCitation {
  citation: string;
  textName: string;
  section: string;
}

export interface WisdomTopic {
  id: string;
  slug: string;
  titleEn: string;
  titleHi: string;
  sanskritSubtitle: string;
  category: 'inner-peace' | 'action-duty' | 'discipline-focus' | 'relationships-devotion' | 'self-knowledge-purpose';
  categoryLabelEn: string;
  categoryLabelHi: string;
  shortDescEn: string;
  shortDescHi: string;
  colorGradient: string;
  accentColor: string;
  searchKeywords: string[];
  readingTimeMinutes: number;
  compassionateIntro: {
    leadEn: string;
    leadHi: string;
    bodyEn: string;
    bodyHi: string;
    spiritualFoundationEn: string;
    spiritualFoundationHi: string;
  };
  verses: ScriptureReference[];
  traditionalContextOverview: {
    titleEn: string;
    titleHi: string;
    bodyEn: string;
    bodyHi: string;
    keyThemes: string[];
    keyThemesHi: string[];
  };
  reflections: PracticalReflection[];
  relatedConcepts: RelatedConceptItem[];
  relatedScriptures: RelatedScriptureItem[];
  sources: SourceCitation[];
  contextualNote: {
    headlineEn: string;
    headlineHi: string;
    bodyEn: string;
    bodyHi: string;
    clinicalDisclaimerEn: string;
    clinicalDisclaimerHi: string;
  };
}

export const wisdomCategories = [
  {
    key: 'all',
    labelEn: 'All Topics',
    labelHi: 'सभी विषय',
    description: 'Explore all life dimensions guided by sacred texts',
  },
  {
    key: 'inner-peace',
    labelEn: 'Inner Peace & Emotions',
    labelHi: 'मन की शांति और संवेग',
    description: 'Working with anxiety, fear, anger, and loss',
  },
  {
    key: 'action-duty',
    labelEn: 'Duty & Action',
    labelHi: 'कर्तव्य और निर्णय',
    description: 'Right decisions, ethics, and dharmic leadership',
  },
  {
    key: 'discipline-focus',
    labelEn: 'Discipline & Focus',
    labelHi: 'संयम और एकाग्रता',
    description: 'Mental clarity, self-mastery, and steadfast habit',
  },
  {
    key: 'relationships-devotion',
    labelEn: 'Family & Devotion',
    labelHi: 'परिवार और भक्ति',
    description: 'Heart-centered living, mutual care, and surrender',
  },
  {
    key: 'self-knowledge-purpose',
    labelEn: 'Self-Knowledge & Purpose',
    labelHi: 'आत्मज्ञान और जीवन का अर्थ',
    description: 'Ultimate liberation, identity, and the meaning of life',
  },
] as const;

export const wisdomTopics: WisdomTopic[] = [
  // 1. Stress and worry
  {
    id: 'stress-and-worry',
    slug: 'stress-and-worry',
    titleEn: 'Stress and Worry',
    titleHi: 'तनाव और चिंता',
    sanskritSubtitle: 'चित्तप्रसादनम् एवं अशान्तस्य कुतः सुखम्',
    category: 'inner-peace',
    categoryLabelEn: 'Inner Peace & Emotions',
    categoryLabelHi: 'मन की शांति और संवेग',
    shortDescEn: 'Calming the agitated mind through detachment from uncontrollable outcomes and resting in present awareness.',
    shortDescHi: 'अनियंत्रित परिणामों की व्यग्रता छोड़कर वर्तमान सजगता और चित्त-प्रसाद में स्थिर होना।',
    colorGradient: 'from-teal-600 via-cyan-700 to-slate-800',
    accentColor: '#0d9488',
    searchKeywords: ['anxiety', 'panic', 'overthinking', 'worry', 'stress', 'racing mind', 'calm', 'peace', 'चित्त', 'तनाव', 'चिंता'],
    readingTimeMinutes: 7,
    compassionateIntro: {
      leadEn: 'If you are carrying a racing mind, a tight chest, or the invisible weight of tomorrow, you are not broken.',
      leadHi: 'यदि आपका मन भविष्य की आशंकाओं से अशांत है और भीतर एक निरंतर दबाव बना हुआ है, तो स्वयं को दोषी न मानें।',
      bodyEn: 'Worry is often the natural mind attempting to control what has not yet arrived. The Upanishads and the Gita remind us that our awareness is greater than the transient ripples (vrittis) moving across the mind. By separating what is within our rightful sphere of action from the fruit that belongs to the cosmic order, the mind naturally exhales and settles.',
      bodyHi: 'चिंता दरअसल उस भविष्य को नियंत्रित करने का प्रयास है जो अभी घटित ही नहीं हुआ। उपनिषद् और गीता हमें स्मरण कराते हैं कि हमारी चेतना मन की इन चंचल लहरों (वृत्तियों) से कहीं अधिक गहरी है। जब हम अपने कर्म और उसके अनपेक्षित फलों के बीच अंतर को पहचान लेते हैं, तब भीतर एक शांत अवकाश उत्पन्न होता है।',
      spiritualFoundationEn: 'True tranquility (shanti) does not mean the absence of outer demands; it is the inner anchor that prevents the waves from capsizing your boat.',
      spiritualFoundationHi: 'सच्ची शांति का अर्थ बाहरी जिम्मेदारियों से पलायन नहीं है, बल्कि उस अंतरात्मा में लंगर डालना है जहाँ तूफान भी आपको विचलित न कर सके।'
    },
    verses: [
      {
        id: 'bg-2-66',
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 2,
        verseNumber: 66,
        referenceDisplay: 'Bhagavad Gita 2.66',
        referenceDisplayHi: 'भगवद्गीता २.६६',
        sanskritDevanagari: 'नास्ति बुद्धिरयुक्तस्य न चायुक्तस्य भावना ।\nन चाभावयतः शान्तिरशान्तस्य कुतः सुखम् ॥',
        sanskritTransliteration: "nāsti buddhirayuktasya na cāyuktasya bhāvanā |\nna cābhāvayataḥ śāntiraśāntasya kutaḥ sukham ||",
        literalTranslationHi: 'जिसका मन आत्म-संयम से युक्त नहीं है, उसमें निश्चयात्मक बुद्धि नहीं होती; और असंयत व्यक्ति में एकाग्र भावना (ध्यान) नहीं होती। भावनाहीन को शांति नहीं मिलती, और जो अशांत है उसे सुख कहाँ?',
        literalTranslationEn: 'For one who is not centered, there is no resolute intellect; for one without integration, there is no contemplation. Without contemplation there is no peace, and for the peaceless, how can there be happiness?',
        traditionalContext: {
          speaker: 'Shri Krishna',
          addressee: 'Arjuna',
          setting: 'Kurukshetra battlefield dialogue on the nature of steady wisdom (sthitaprajna)',
          settingHi: 'कुरुक्षेत्र युद्धभूमि में स्थितप्रज्ञ के लक्षणों पर श्रीकृष्ण का उपदेश',
          commentaryNote: '',
          commentaryNoteHi: '',
        },
        readerHref: '/scripture/bhagavadgita/chapter/2/verse/66'
      },
      {
        id: 'bg-6-26',
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 6,
        verseNumber: 26,
        referenceDisplay: 'Bhagavad Gita 6.26',
        referenceDisplayHi: 'भगवद्गीता ६.२६',
        sanskritDevanagari: 'यतो यतो निश्चरति मनश्चञ्चलमस्थिरम् ।\nततस्ततो नियम्यैतदात्मन्येव वशं नयेत् ॥',
        sanskritTransliteration: "yato yato niścarati manaścañcalamasthiram |\ntatastato niyamyaitadātmanyeva vaśaṁ nayet ||",
        literalTranslationHi: 'यह चंचल और अस्थिर मन जिस-जिस सांसारिक विषय की ओर भटकता है, वहाँ-वहाँ से इसे रोककर बार-बार आत्मा के ही अधीन करना चाहिए।',
        literalTranslationEn: 'From wherever the unsteady and restless mind wanders away, one must restrain it and bring it back under the sway of the Self alone.',
        traditionalContext: {
          speaker: 'Shri Krishna',
          addressee: 'Arjuna',
          setting: 'Chapter 6 (Dhyana Yoga), addressing Arjuna’s complaint that the mind is as hard to curb as the gale wind',
          settingHi: 'अध्याय ६ (ध्यान योग), जब अर्जुन कहते हैं कि मन को रोकना वायु को रोकने जैसा कठिन है',
          commentaryNote: '',
          commentaryNoteHi: '',
        },
        readerHref: '/scripture/bhagavadgita/chapter/6/verse/26'
      }
    ],
    traditionalContextOverview: {
      titleEn: 'The Restless Mind in the Bhagavad Gita',
      titleHi: 'भगवद्गीता में चंचल मन का प्रसंग',
      bodyEn: 'The Gita describes the mind as restless without naming ordinary worry as a medical condition. In 6.26, Krishna teaches Arjuna to bring the wandering mind back; in 6.35, he acknowledges how difficult restraint can be and names practice (abhyāsa) and dispassion (vairāgya). This page places those teachings alongside selected passages for study. It does not diagnose chronic worry or promise treatment.',
      bodyHi: 'गीता मन की चंचलता का वर्णन करती है, सामान्य चिंता को रोग का नाम नहीं देती। अध्याय ६ के श्लोक २६ में भटके हुए मन को पुनः आत्मा की ओर लाने का उपदेश है; श्लोक ३५ मन को वश में करना कठिन मानते हुए अभ्यास और वैराग्य का उल्लेख करता है। यहाँ इन उपदेशों को चयनित श्लोकों के साथ अध्ययन हेतु रखा गया है; यह किसी अवस्था का निदान या उपचार का आश्वासन नहीं है।',
      keyThemes: ['Chitta-Prasadana (Clarity of Mind)', 'Kripa & Sharanagati (Surrendering Outcome)', 'Sakshi Bhava (Witness Consciousness)'],
      keyThemesHi: ['चित्त-प्रसादन (मन की निर्मलता)', 'फलासक्ति-त्याग (परिणाम से अनासक्ति)', 'साक्षी भाव (तटस्थ अवलोकन)']
    },
    reflections: [
      {
        title: 'The Sphere of Influence vs. The Sphere of Fruit',
        titleHi: 'अधिकार क्षेत्र और फल क्षेत्र का विवेक',
        insight: 'We exhaust our nervous system trying to guarantee outcomes that depend on a thousand invisible cosmic variables.',
        insightHi: 'हम उन परिणामों की गारंटी चाहने में अपनी ऊर्जा व्यर्थ कर देते हैं जो सहस्रों अज्ञात परिस्थितियों पर निर्भर हैं।',
        contemplationPrompt: 'Ask yourself right now: "What part of this dilemma is my direct duty today, and what part is anxiety about a future I cannot orchestrate?"',
        contemplationPromptHi: 'अभी स्वयं से पूछें: "इस परिस्थिति में आज मेरा वास्तविक कर्तव्य क्या है, और कौन सा हिस्सा केवल अनिश्चित भविष्य का भय मात्र है?"',
        dailyPractice: 'When your mind begins racing, pause for 60 seconds. Take three slow belly breaths, repeat the silent thought: "My duty is sincere effort; the fruit rests with the universe."',
        dailyPracticeHi: 'जब मन में घबराहट हो, तो १ मिनट का मौन लें। तीन गहरी श्वासें भरें और दोहराएं: "कर्म मेरा कर्तव्य है, परिणाम ईश्वर के हाथ में है।"'
      }
    ],
    relatedConcepts: [
      { id: 'shanti', labelEn: 'Shanti (Peace)', labelHi: 'शान्ति', sanskrit: 'शान्तिः', description: 'Tranquility of the inner instruments (antahkarana).', descriptionHi: 'अंतःकरण की शांत और स्थिर अवस्था।', href: '/concepts' },
      { id: 'vairagya', labelEn: 'Vairagya (Dispassion)', labelHi: 'वैराग्य', sanskrit: 'वैराग्यम्', description: 'Freedom from craving and obsessive control.', descriptionHi: 'वस्तुओं और परिणामों के प्रति राग-द्वेष का अभाव।', href: '/concepts' },
      { id: 'atman', labelEn: 'Atman (Witness Self)', labelHi: 'आत्मन्', sanskrit: 'आत्मन्', description: 'The timeless seer unaffected by transient mental storms.', descriptionHi: 'मन के उतार-चढ़ावों से सर्वथा अछूता साक्षी चैतन्य।', href: '/concepts' }
    ],
    relatedScriptures: [
      { id: 'bhagavadgita', title: 'Bhagavad Gita', titleHi: 'भगवद्गीता', titleSanskrit: 'श्रीमद्भगवद्गीता', description: 'The dialogical manual for inner equanimity in times of acute crisis.', descriptionHi: 'संकट के समय अंतःकरण को समत्व में स्थापित करने वाला अमर संवाद।', href: '/scripture/bhagavadgita' },
      { id: 'katha', title: 'Katha Upanishad', titleHi: 'कठोपनिषद्', titleSanskrit: 'कठोपनिषत्', description: 'Illuminates the chariot of the senses and the mastery of the mind.', descriptionHi: 'इंद्रिय रूपी घोड़ों और मन रूपी लगाम के नियंत्रण का दिव्य रूपक।', href: '/scripture/katha' }
    ],
    sources: [
      { citation: 'Bhagavad Gita 2.66, 6.26, and 6.35', textName: 'Bhagavad Gita', section: 'Chapter 2, Verse 66; Chapter 6, Verses 26 and 35' }
    ],
    contextualNote: {
      headlineEn: 'Important Contextual & Mental Health Note',
      headlineHi: 'शास्त्रीय एवं स्वास्थ्य संदर्भ सूचना',
      bodyEn: 'This scriptural guidance offers spiritual contemplation and philosophical clarity for everyday stress and inner unrest. It is NOT a clinical diagnosis or medical treatment.',
      bodyHi: 'यह शास्त्रीय चिंतन सामान्य जीवन के तनाव और मानसिक बेचैनी में दार्शनिक संबल प्रदान करता है। यह कोई चिकित्सीय निदान या उपचार नहीं है।',
      clinicalDisclaimerEn: 'Scripture does not replace licensed medical, psychiatric, or psychological care. If you are experiencing panic disorders, clinical depression, or prolonged severe anxiety, please consult a qualified healthcare professional.',
      clinicalDisclaimerHi: 'शास्त्र कभी भी योग्य चिकित्सक या मनोविज्ञानी की सलाह का विकल्प नहीं है। गंभीर अवसाद, पैनिक अटैक या निरंतर अत्यधिक चिंता की स्थिति में तुरंत विशेषज्ञ से संपर्क करें।'
    }
  },

  // 2. Fear and courage
  {
    id: 'fear-and-courage',
    slug: 'fear-and-courage',
    titleEn: 'Fear and Courage',
    titleHi: 'भय और साहस',
    sanskritSubtitle: 'अभयं सत्त्वसंशुद्धिः एवं द्वितीयाद्वै भयं भवति',
    category: 'inner-peace',
    categoryLabelEn: 'Inner Peace & Emotions',
    categoryLabelHi: 'मन की शांति और संवेग',
    shortDescEn: 'Transcending dread by recognizing the indivisible Self and stepping forward with dharmic conviction.',
    shortDescHi: 'द्वैत के भ्रम को मिटाकर अद्वैत आत्म-तत्व में निर्भयता और धर्मसम्मत साहस पाना।',
    colorGradient: 'from-amber-600 via-orange-700 to-stone-900',
    accentColor: '#d97706',
    searchKeywords: ['fear', 'courage', 'dread', 'terror', 'bravery', 'strength', 'uncertainty', 'abhaya', 'भय', 'साहस', 'अभय'],
    readingTimeMinutes: 7,
    compassionateIntro: {
      leadEn: 'Fear is not a personal failure; it is the natural whisper of a fragile identity feeling separate from the whole.',
      leadHi: 'भयभीत होना कोई दुर्बलता नहीं है; यह तब उत्पन्न होता है जब हम स्वयं को एकाकी और असुरक्षित अनुभव करते हैं।',
      bodyEn: 'Whenever we look only through the physical eyes, everything appears fragile: reputations can tarnish, resources can dwindle, and bodies age. Yet the Vedic seers uncovered a revolutionary secret: "Fear arises only where a second is perceived" (Brihadaranyaka Upanishad). When you remember that your foundational nature is immortal and interconnected with divine reality, fear loses its tyranny.',
      bodyHi: 'जब तक हम केवल नाशवान शरीर और परिस्थितियों से अपनी पहचान जोड़ते हैं, तब तक भय बना रहता है। बृहदारण्यक उपनिषद् उद्घोष करता है: "द्वितीयाद्वै भयं भवति"—भय वहीं है जहाँ दूसरा दिखाई देता है। जब साधक समझता है कि संपूर्ण अस्तित्व एक ही परब्रह्म का विस्तार है, तब भय का आधार ही समाप्त हो जाता है।',
      spiritualFoundationEn: 'Abhaya (fearlessness) is not reckless bravado; it is the calm assurance of one who knows they are held by the eternal.',
      spiritualFoundationHi: 'अभय का अर्थ उच्छृंखल दुस्साहस नहीं, बल्कि उस शाश्वत सत्य की अनुभूति है जहाँ आत्मा को कोई अस्त्र काट नहीं सकता।'
    },
    verses: [
      {
        id: 'bg-16-1',
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 16,
        verseNumber: 1,
        referenceDisplay: 'Bhagavad Gita 16.1',
        referenceDisplayHi: 'भगवद्गीता १६.१',
        sanskritDevanagari: 'अभयं सत्त्वसंशुद्धिः ज्ञानयोगव्यवस्थितिः ।\nदानं दमश्च यज्ञश्च स्वाध्यायस्तप आर्जवम् ॥',
        sanskritTransliteration: "abhayaṁ sattvasaṁśuddhirjñānayogavyavasthitiḥ |\ndānaṁ damaśca yajñaśca svādhyāyastapa ārjavam ||",
        literalTranslationHi: 'भय का सर्वथा अभाव (अभय), अंतःकरण की पूर्ण शुद्धि, ज्ञान और योग में दृढ़ स्थिति, दान, इंद्रिय-दमन, यज्ञ, स्वाध्याय, तप और सरलता—ये दैवी गुण हैं।',
        literalTranslationEn: 'Fearlessness, purity of heart, steadfastness in knowledge and yoga, charity, restraint of the senses, sacrifice, scriptural study, austerity, and uprightness—these are divine attributes.',
        traditionalContext: {
          speaker: 'Shri Krishna',
          addressee: 'Arjuna',
          setting: 'Introduction to Chapter 16 on Divine (Daivi) versus Demonic (Asuri) endowments',
          settingHi: 'अध्याय १६ के आरंभ में दैवी और आसुरी संपदा का विवेचन',
          commentaryNote: '',
          commentaryNoteHi: '',
        },
        readerHref: '/scripture/bhagavadgita/chapter/16/verse/1'
      },
      {
        id: 'taittiriya-2-4-1',
        scriptureId: 'taittiriya',
        scriptureName: 'Taittiriya Upanishad',
        scriptureNameHi: 'तैत्तिरीयोपनिषद्',
        chapterNumber: 2,
        verseNumber: '4.1',
        referenceDisplay: 'Taittiriya Upanishad 2.4.1',
        libraryRef: { chapter: 2, verse: 4 },
        referenceDisplayHi: 'तैत्तिरीयोपनिषद् २.४.१',
        sanskritDevanagari: 'आनन्दं ब्रह्मणो विद्वान् न बिभेति कदाचनेति ।',
        sanskritTransliteration: "ānandaṁ brahmaṇo vidvān na bibheti kadācaneti |",
        literalTranslationHi: 'ब्रह्म के आनन्द को जानने वाला विद्वान् कभी भयभीत नहीं होता।',
        literalTranslationEn: 'The one who knows the bliss of Brahman never fears.',
        traditionalContext: {
          speaker: 'The teacher of the Brahmānandavallī',
          addressee: 'The student',
          setting: 'Anandavalli section concluding the progressive realization of the five sheaths (pancha kosha)',
          settingHi: 'आनंदवल्ली का सार जहाँ पञ्चकोशों से परे ब्रह्म के स्वरूप का साक्षात्कार होता है',
          commentaryNote: 'When one realizes the bliss that is independent of worldly objects, the fear of losing worldly status or bodily security dissolves entirely.',
          commentaryNoteHi: 'जब साधक उस आनंद का अनुभव करता है जो बाह्य पदार्थों का मोहताज नहीं है, तब किसी भी हानि का भय शेष नहीं रहता।'
        },
        readerHref: '/scripture/taittiriya/chapter/2'
      }
    ],
    traditionalContextOverview: {
      titleEn: 'Abhaya: The First Quality of the Spiritual Seeker',
      titleHi: 'अभय: साधक की पहली और मूलभूत संपदा',
      bodyEn: 'In Vedic metaphysics, fear stems from "Dvaita" (perceived separation). The moment we divide the universe into "me" and "threats against me", anxiety is guaranteed. Courage is born when we realize that the same cosmic thread (Sutratman) binds everyone.',
      bodyHi: 'वैदिक दर्शन के अनुसार भय का मूल कारण "द्वैत" (अलगाव की भ्रांति) है। जब हम जगत को "मैं" और "मुझे नुकसान पहुँचाने वाले अन्य" में बाँट देते हैं, तो डर निश्चित है। अभय तब जन्म लेता है जब हम सबमें एक ही चेतना का दर्शन करते हैं।',
      keyThemes: ['Abhaya (Fearlessness)', 'Daivi Sampad (Divine Heritage)', 'Atma-Nishtha (Steadfastness in the Self)'],
      keyThemesHi: ['अभय (निर्भयता)', 'दैवी संपद (दिव्य गुण)', 'आत्म-निष्ठा (स्व-स्वरूप में विश्राम)']
    },
    reflections: [
      {
        title: 'Meeting the Shadow of What Could Go Wrong',
        titleHi: 'आशंकाओं का सामना करने का विवेक',
        insight: 'Most fears are paper tigers projected by an unchecked imagination onto an unwritten future.',
        insightHi: 'अधिकांश भय हमारी कल्पना द्वारा भविष्य पर थोपे गए कल्पित साए मात्र होते हैं।',
        contemplationPrompt: 'What would you do today if you were entirely certain that your deepest essence cannot be harmed by worldly outcome?',
        contemplationPromptHi: 'यदि आपको यह पूर्ण विश्वास हो जाए कि आपकी अंतरात्मा को कोई सांसारिक घटना नष्ट नहीं कर सकती, तो आज आप क्या कदम उठाएंगे?',
        dailyPractice: 'In moments of dread, stand tall, place your palm over your heart, and remember Gita 2.20: "The Self is unborn, eternal, undying."',
        dailyPracticeHi: 'जब भय सताए, तो सीधे खड़े होकर हृदय पर हाथ रखें और स्मरण करें: "आत्मा अजर, अमर और शाश्वत है।"'
      }
    ],
    relatedConcepts: [
      { id: 'abhaya', labelEn: 'Abhaya (Fearlessness)', labelHi: 'अभय', sanskrit: 'अभयम्', description: 'Transcendence of existential and circumstantial terror.', descriptionHi: 'संसार और मृत्यु के भय से मुक्ति।', href: '/concepts' },
      { id: 'atman', labelEn: 'Atman (True Self)', labelHi: 'आत्मन्', sanskrit: 'आत्मन्', description: 'The indestructible immortal core of consciousness.', descriptionHi: 'अविनाशी चेतना का मूल स्वरूप।', href: '/concepts' },
      { id: 'dharma', labelEn: 'Dharma (Righteous Courage)', labelHi: 'धर्म', sanskrit: 'धर्मः', description: 'Moral truth that gives backbone to the spirit.', descriptionHi: 'सत्य और न्याय की शक्ति जो अंतरात्मा को संबल देती है।', href: '/concepts' }
    ],
    relatedScriptures: [
      { id: 'bhagavadgita', title: 'Bhagavad Gita', titleHi: 'भगवद्गीता', titleSanskrit: 'श्रीमद्भगवद्गीता', description: 'Where Arjuna enters paralyzed by fear and leaves as a fearless warrior of Dharma.', descriptionHi: 'जहाँ अर्जुन का विषाद और भय निष्काम साहस में बदल जाता है।', href: '/scripture/bhagavadgita' },
      { id: 'taittiriya', title: 'Taittiriya Upanishad', titleHi: 'तैत्तिरीयोपनिषद्', titleSanskrit: 'तैत्तिरीयोपनिषत्', description: 'Reveals the supreme joy that obliterates all fear.', descriptionHi: 'आनंद के उस महासागर का वर्णन जो हर भय को मिटा देता है।', href: '/scripture/taittiriya' }
    ],
    sources: [
      { citation: 'Bhagavad Gita 16.1', textName: 'Bhagavad Gita', section: 'Chapter 16, Verse 1' },
      { citation: 'Taittiriya Upanishad 2.4.1', textName: 'Taittiriya Upanishad', section: 'Anandavalli, Chapter 2, Section 4' }
    ],
    contextualNote: {
      headlineEn: 'Contextual Disclaimer Regarding Acute Trauma & Phobias',
      headlineHi: 'अति-आघात एवं भय से संबंधित संदर्भ सूचना',
      bodyEn: 'Contemplation on spiritual fearlessness strengthens character and moral resolve. It does not replace psychological interventions for post-traumatic stress or panic disorders.',
      bodyHi: 'यह दार्शनिक मार्गदर्शन जीवन में साहस और आत्मबल जगाने के लिए है। यह किसी गंभीर मानसिक आघात (PTSD) या फोबिया का चिकित्सीय उपचार नहीं है।',
      clinicalDisclaimerEn: 'If fear paralyzes your ability to function or stems from past trauma, reach out to a licensed trauma-informed psychologist.',
      clinicalDisclaimerHi: 'यदि भय आपके दैनिक जीवन को पंगु बना रहा है या किसी गहरे आघात से उपजा है, तो पेशेवर मनोवैज्ञानिक से परामर्श लें।'
    }
  },

  // 3. Anger
  {
    id: 'anger',
    slug: 'anger',
    titleEn: 'Anger and Composure',
    titleHi: 'क्रोध और आत्म-संयम',
    sanskritSubtitle: 'क्रोधाद्भवति संमोहः एवं अक्रोधेन जयेत्क्रोधम्',
    category: 'inner-peace',
    categoryLabelEn: 'Inner Peace & Emotions',
    categoryLabelHi: 'मन की शांति और संवेग',
    shortDescEn: 'Understanding how thwarted desire sparks rage, and mastering the pause that protects clarity and wisdom.',
    shortDescHi: 'इच्छाओं के टूटने से भड़कने वाले क्रोध के चक्र को समझना और विवेक द्वारा शांति पाना।',
    colorGradient: 'from-rose-700 via-red-800 to-zinc-900',
    accentColor: '#e11d48',
    searchKeywords: ['anger', 'rage', 'temper', 'frustration', 'irritation', 'calmness', 'patience', 'krodha', 'क्रोध', 'गुस्सा', 'शांति'],
    readingTimeMinutes: 8,
    compassionateIntro: {
      leadEn: 'Anger feels powerful in the moment, but it almost always leaves behind a trail of regret and clouded judgment.',
      leadHi: 'क्रोध के क्षण में लगता है कि हम शक्तिशाली हैं, किंतु वह केवल पश्चाताप और क्षत-विक्षत विवेक छोड़ जाता है।',
      bodyEn: 'The Bhagavad Gita offers an astonishingly precise psychological analysis: anger is not an isolated demon; it is the child of frustrated attachment. When we obsessively fixate on people, plans, or outcomes acting according to our script, any obstruction instantly inflames our ego into wrath. Understanding this sequence frees us from being its helpless puppet.',
      bodyHi: 'भगवद्गीता क्रोध का अत्यंत सूक्ष्म मनोवैज्ञानिक विश्लेषण करती है: क्रोध कोई स्वतंत्र विकार नहीं है, बल्कि अपूर्ण कामना की संतान है। जब हमारी कोई इच्छा या अपेक्षा टूटती है, तो अहंकार तिलमिला उठता है। जब हम इस शृंखला को समझ लेते हैं, तब क्रोध के आवेग को साक्षी बनकर शांत किया जा सकता है।',
      spiritualFoundationEn: 'True strength is not the roaring fire that consumes everything; it is the diamond-like coolness of a mind that refuses to be provoked.',
      spiritualFoundationHi: 'सच्ची शक्ति वह दावानल नहीं है जो सब कुछ जला दे, बल्कि वह शीतल धीरता है जो किसी के उकसावे में नहीं आती।'
    },
    verses: [
      {
        id: 'bg-2-62-63',
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 2,
        verseNumber: '62-63',
        referenceDisplay: 'Bhagavad Gita 2.62–63',
        libraryRef: { chapter: 2, verse: 62 },
        referenceDisplayHi: 'भगवद्गीता २.६२–६३',
        sanskritDevanagari: 'ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते ।\nसङ्गात्संजायते कामः कामात्क्रोधोऽभिजायते ॥\nक्रोधाद्भवति संमोहः संमोहात्स्मृतिविभ्रमः ।\nस्मृतिभ्रंशाद् बुद्धिनाशो बुद्धिनाशात्प्रणश्यति ॥',
        sanskritTransliteration: "dhyāyato viṣayāṅpuṁsaḥ saṅgasteṣūpajāyate |\nsaṅgātsaṁjāyate kāmaḥ kāmātkrodho'bhijāyate ||\nkrodhādbhavati saṁmohaḥ saṁmohātsmṛtivibhramaḥ |\nsmṛtibhraṁśād buddhināśo buddhināśātpraṇaśyati ||",
        literalTranslationHi: 'विषयों का निरंतर चिंतन करने से उनमें आसक्ति पैदा होती है; आसक्ति से कामना उत्पन्न होती है; और कामना में बाधा पड़ने पर क्रोध पैदा होता है। क्रोध से सम्मोहन (अविवेक), सम्मोहन से स्मृति का भ्रम, स्मृति के भ्रम से बुद्धि का नाश, और बुद्धि का नाश होने पर मनुष्य का पतन हो जाता है।',
        literalTranslationEn: 'Brooding on objects of the senses begets attachment to them; from attachment springs craving; from thwarted craving flares anger. From anger arises delusion; from delusion, confusion of memory; from lost memory comes ruin of the discerning intellect; and when intellect is ruined, a person is lost.',
        traditionalContext: {
          speaker: 'Shri Krishna',
          addressee: 'Arjuna',
          setting: 'Warning about the psychological descent of the senses when left unanchored',
          settingHi: 'असंयत मन के पतन की आठ सीढ़ियों का वैज्ञानिक चित्रण',
          commentaryNote: '',
          commentaryNoteHi: '',
        },
        readerHref: '/scripture/bhagavadgita/chapter/2/verse/63'
      },
      {
        id: 'vidura-7-72',
        scriptureId: 'viduraniti',
        scriptureName: 'Vidura Niti',
        scriptureNameHi: 'विदुर नीति',
        chapterNumber: 7,
        verseNumber: 72,
        referenceDisplay: 'Vidura Niti 7.72',
        referenceDisplayHi: 'विदुर नीति ७.७२',
        sanskritDevanagari: 'अक्रोधेन जयेत्क्रोधमसाधुं साधुना जयेत् ।\nजयेत्कदर्यं दानेन जयेत्सत्येन चानृतम् ॥',
        sanskritTransliteration: "akrodhena jayetkrodhamasādhuṁ sādhunā jayet |\njayetkadaryaṁ dānena jayetsatyena cānṛtam ||",
        literalTranslationHi: 'क्रोध को अक्रोध (शांति) से जीतना चाहिए, दुष्ट को भलाई से जीतना चाहिए; कृपण को दान से जीतना चाहिए और असत्य को सत्य से जीतना चाहिए।',
        literalTranslationEn: 'Conquer anger with non-anger; conquer evil with benevolence; conquer the miser with generosity; and conquer falsehood with truth.',
        traditionalContext: {
          speaker: 'Mahatma Vidura',
          addressee: 'King Dhritarashtra',
          setting: 'The eve before the catastrophic war, counseling the king on masteries of the righteous mind',
          settingHi: 'महाभारत युद्ध से पूर्व महाराज धृतराष्ट्र को महात्मा विदुर का नीति उपदेश',
          commentaryNote: 'Fighting fire with fire only burns the house down; anger cannot be pacified through counter-anger, but through conscious non-reactivity.',
          commentaryNoteHi: 'आग को आग से नहीं बुझाया जा सकता; क्रोध का प्रतिकार केवल विवेकपूर्ण संयम और क्षमा से ही संभव है।'
        },
        readerHref: '/scripture/viduraniti'
      }
    ],
    traditionalContextOverview: {
      titleEn: 'The Anatomy of Rage and the Practice of Titiksha',
      titleHi: 'क्रोध की संरचना और तितिक्षा (सहनशीलता) का मार्ग',
      bodyEn: 'In Hindu psychology, anger (Krodha) is one of the six inner enemies (shad-ripu). It is not solved by bottling it up in resentment, nor by exploding carelessly, but by cooling the root expectations and cultivating Titiksha (forbearing endurance).',
      bodyHi: 'सनातन परंपरा में क्रोध को षड्रिपु (छह आंतरिक शत्रुओं) में गिना गया है। इसका समाधान उसे दबाकर घुटने में नहीं, बल्कि उन अवास्तविक अपेक्षाओं को पहचानकर छोड़ देने में है जो क्रोध को हवा देती हैं।',
      keyThemes: ['Shad-Ripu (Six Inner Foes)', 'Titiksha (Endurance)', 'Kshama (Magnanimous Forgiveness)'],
      keyThemesHi: ['षड्रिपु (आंतरिक शत्रु)', 'तितिक्षा (सहिष्णुता)', 'क्षमा (उदारता)']
    },
    reflections: [
      {
        title: 'The Sacred Ten-Second Gap',
        titleHi: 'क्रोध के आवेग में दस सेकंड का विराम',
        insight: 'Between stimulus and response lies your entire spiritual freedom.',
        insightHi: 'उत्तेजना और प्रतिक्रिया के बीच का छोटा सा ठहराव ही आपकी आत्म-मुक्ति की कुंजी है।',
        contemplationPrompt: 'When anger surges, ask: "Am I angry at this person, or am I angry that reality did not obey my secret demands?"',
        contemplationPromptHi: 'जब क्रोध आए, तो परखें: "क्या मुझे उस व्यक्ति पर गुस्सा है, या इस बात पर कि परिस्थिति ने मेरी मनचाही बात नहीं मानी?"',
        dailyPractice: 'When you feel your throat tightening with fury, consciously remain silent for five breaths before speaking a single syllable.',
        dailyPracticeHi: 'जब क्रोध से स्वर कड़वा होने लगे, तो एक शब्द भी बोलने से पहले पाँच गहरी सांसों तक मौन साधें।'
      }
    ],
    relatedConcepts: [
      { id: 'krodha', labelEn: 'Krodha (Anger)', labelHi: 'क्रोध', sanskrit: 'क्रोधः', description: 'Mental fire born of frustrated desire.', descriptionHi: 'कामना टूटने से उपजा मानसिक ताप।', href: '/concepts' },
      { id: 'dama', labelEn: 'Dama (Sense Restraint)', labelHi: 'दम', sanskrit: 'दमः', description: 'Restraining the motor organs from impulsive harmful reaction.', descriptionHi: 'इंद्रियों और वाणी का विवेकपूर्ण नियंत्रण।', href: '/concepts' },
      { id: 'kshama', labelEn: 'Kshama (Forgiveness)', labelHi: 'क्षमा', sanskrit: 'क्षमा', description: 'The inner power to absorb friction without returning venom.', descriptionHi: 'द्वेष और कटुता को आत्मसात कर समाप्त करने की सामर्थ्य।', href: '/concepts' }
    ],
    relatedScriptures: [
      { id: 'bhagavadgita', title: 'Bhagavad Gita', titleHi: 'भगवद्गीता', titleSanskrit: 'श्रीमद्भगवद्गीता', description: 'The second chapter masterclass on preventing mental ruin.', descriptionHi: 'बुद्धिनाश से रक्षा करने वाला अमर मनोवैज्ञानिक मार्गदर्शन।', href: '/scripture/bhagavadgita' },
      { id: 'viduraniti', title: 'Vidura Niti', titleHi: 'विदुर नीति', titleSanskrit: 'विदुरनीतिः', description: 'Practical statesman wisdom on ruling one’s own tongue and temper.', descriptionHi: 'वाणी और चित्त के अनुशासन पर विदुर का व्यावहारिक उपदेश।', href: '/scripture/viduraniti' }
    ],
    sources: [
      { citation: 'Bhagavad Gita 2.62–63', textName: 'Bhagavad Gita', section: 'Chapter 2, Verses 62–63' },
      { citation: 'Vidura Niti 7.72 (Prajāgara section of the Mahābhārata, Udyoga Parva)', textName: 'Vidura Niti', section: 'Traditional reference 7.72; library chapter 7, verse 58' }
    ],
    contextualNote: {
      headlineEn: 'Important Note Regarding Chronic Rage & Safety',
      headlineHi: 'क्रोध प्रबंधन और सुरक्षा संबंधी संदर्भ सूचना',
      bodyEn: 'Spiritual texts encourage emotional self-regulation, empathy, and forgiveness. They are never an excuse to tolerate physical abuse or violence.',
      bodyHi: 'शास्त्र आत्म-नियंत्रण और क्षमा सिखाते हैं। इसका यह अर्थ कदापि नहीं है कि किसी प्रकार के घरेलू या शारीरिक दुर्व्यवहार को सहन किया जाए।',
      clinicalDisclaimerEn: 'If explosive anger harms relationships, causes safety risks, or feels uncontrollable, please seek anger management counseling or family therapy.',
      clinicalDisclaimerHi: 'यदि अनियंत्रित क्रोध से आपके संबंधों में हिंसा या खतरे की स्थिति बनती है, तो तुरंत पेशेवर परामर्शदाता से सहायता लें।'
    }
  },

  // 4. Grief and loss
  {
    id: 'grief-and-loss',
    slug: 'grief-and-loss',
    titleEn: 'Grief and Loss',
    titleHi: 'शोक और वियोग',
    sanskritSubtitle: 'अशोच्यानन्वशोचस्त्वम् एवं नानुशोचन्ति पण्डिताः',
    category: 'inner-peace',
    categoryLabelEn: 'Inner Peace & Emotions',
    categoryLabelHi: 'मन की शांति और संवेग',
    shortDescEn: 'Honoring tears while seeing through the veil of physical death to the eternal, indestructible consciousness.',
    shortDescHi: 'शोक के आंसुओं का सम्मान करते हुए देह के नश्वर वस्त्र और आत्मा की अमरता का साक्षात्कार।',
    colorGradient: 'from-indigo-900 via-slate-800 to-stone-900',
    accentColor: '#6366f1',
    searchKeywords: ['grief', 'loss', 'mourning', 'death', 'sorrow', 'bereavement', 'crying', 'heartbreak', 'शोक', 'वियोग', 'मृत्यु'],
    readingTimeMinutes: 8,
    compassionateIntro: {
      leadEn: 'Loss breaks the heart open, and the ache you feel is testament to the deep love you have shared.',
      leadHi: 'प्रियजन का वियोग हृदय को झकझोर देता है, और यह वेदना इस बात का प्रमाण है कि आपने कितना गहरा प्रेम किया है।',
      bodyEn: 'The Bhagavad Gita itself does not begin with cheerful philosophy; it begins with an overwhelming breakdown. Arjuna falls to the floor of his chariot, weeping, trembling, unable to hold his bow. Shri Krishna does not shame his tears; instead, He tenderly elevates his vision from the perishable garment (the physical body) to the imperishable light (Atman) that has never died and can never be lost.',
      bodyHi: 'भगवद्गीता किसी उथले उपदेश से आरंभ नहीं होती; वह अर्जुन के विषाद और बहते आंसुओं से शुरू होती है। श्रीकृष्ण अर्जुन की वेदना का उपहास नहीं उड़ाते, बल्कि अत्यंत करुणा के साथ उसकी दृष्टि को देह के बदलते वस्त्रों से उठाकर उस अविनाशी आत्म-चैतन्य की ओर मोड़ते हैं जिसे न शस्त्र काट सकते हैं, न अग्नि जला सकती है।',
      spiritualFoundationEn: 'We do not suppress grief; we hold our grief within the boundless arms of eternity.',
      spiritualFoundationHi: 'शोक को दबाना नहीं है, बल्कि उस असीम शाश्वत सत्य की गोद में सिर रखकर शांति पानी है।'
    },
    verses: [
      {
        id: 'bg-2-11',
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 2,
        verseNumber: 11,
        referenceDisplay: 'Bhagavad Gita 2.11',
        referenceDisplayHi: 'भगवद्गीता २.११',
        sanskritDevanagari: 'अशोच्यानन्वशोचस्त्वं प्रज्ञावादांश्च भाषसे ।\nगतासूनगतासूंश्च नानुशोचन्ति पण्डिताः ॥',
        sanskritTransliteration: "aśocyānanvaśocastvaṁ prajñāvādāṁśca bhāṣase |\ngatāsūnagatāsūṁśca nānuśocanti paṇḍitāḥ ||",
        literalTranslationHi: 'तुम उन बातों का शोक करते हो जो शोक करने योग्य नहीं हैं, और विद्वानों जैसी बातें भी बोलते हो! बुद्धिमान लोग न तो जिनके प्राण चले गए हैं (मृतक) उनके लिए शोक करते हैं, और न ही जिनके प्राण नहीं गए हैं (जीवित) उनके लिए।',
        literalTranslationEn: 'You grieve for those who do not warrant grief, yet you speak words that sound like wisdom. The truly wise grieve neither for the dead nor for the living.',
        traditionalContext: {
          speaker: 'Shri Krishna',
          addressee: 'Arjuna',
          setting: 'The pivotal moment where Krishna smiles gently (prahasanniva) and begins His direct spiritual discourse',
          settingHi: 'जब विषादग्रस्त अर्जुन के सामने श्रीकृष्ण मुस्कुराते हुए अमर उपदेश आरंभ करते हैं',
          commentaryNote: '',
          commentaryNoteHi: '',
        },
        readerHref: '/scripture/bhagavadgita/chapter/2/verse/11'
      },
      {
        id: 'bg-2-22',
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 2,
        verseNumber: 22,
        referenceDisplay: 'Bhagavad Gita 2.22',
        referenceDisplayHi: 'भगवद्गीता २.२२',
        sanskritDevanagari: 'वासांसि जीर्णानि यथा विहाय\nनवानि गृह्णाति नरोऽपराणि ।\nतथा शरीराणि विहाय जीर्णा\nन्यन्यानि संयाति नवानि देही ॥',
        sanskritTransliteration: "vāsāṁsi jīrṇāni yathā vihāya\nnavāni gṛhṇāti naro'parāṇi |\ntathā śarīrāṇi vihāya jīrṇā-\nnyanyāni saṁyāti navāni dehī ||",
        literalTranslationHi: 'जैसे मनुष्य पुराने फटे हुए वस्त्रों को त्यागकर दूसरे नए वस्त्र धारण कर लेता है, वैसे ही यह जीवात्मा पुराने शरीरों को छोड़कर नए शरीरों को प्राप्त करती है।',
        literalTranslationEn: 'Just as a person discards worn-out garments and puts on new ones, likewise the embodied Self casts off worn-out bodies and enters into others that are new.',
        traditionalContext: {
          speaker: 'Shri Krishna',
          addressee: 'Arjuna',
          setting: 'The sublime metaphor of clothing to illustrate the transition of physical death',
          settingHi: 'मृत्यु को मात्र वस्त्र बदलने के समान स्वाभाविक बताने वाला अमर रूपक',
          commentaryNote: 'This verse reassures that love and soul are not destroyed when the form changes; the true connection between souls transcends physical presence.',
          commentaryNoteHi: 'यह श्लोक आश्वस्त करता है कि देह छूटने पर भी आत्मा का अस्तित्व नष्ट नहीं होता; चेतना का प्रवाह कभी खंडित नहीं होता।'
        },
        readerHref: '/scripture/bhagavadgita/chapter/2/verse/22'
      }
    ],
    traditionalContextOverview: {
      titleEn: 'Kala, Karma, and the Immortality of the Consciousness',
      titleHi: 'काल, कर्म और चेतना की अमरता',
      bodyEn: 'Vedic philosophy does not deny the pain of parting, but it places loss in the vast cosmic arc of Samsara and Moksha. Every meeting in this world is like logs of wood meeting briefly on the river of life, then drifting to their appointed destinies (Mahabharata Shanti Parva).',
      bodyHi: 'सनातन दर्शन वियोग की पीड़ा को नकारता नहीं, बल्कि उसे काल और पुनर्जन्म के विशाल परिप्रेक्ष्य में देखता है। जैसे नदी में बहते हुए दो काष्ठ खंड कुछ देर साथ बहते हैं और फिर अपनी दिशाओं में मुड़ जाते हैं, वैसे ही इस संसार में सभी संबंध पावन किंतु सामयिक हैं।',
      keyThemes: ['Nitya Atman (Eternal Soul)', 'Anitya Sharira (Ephemeral Form)', 'Kripa (Divine Compassion)'],
      keyThemesHi: ['नित्य आत्मन् (अविनाशी चेतना)', 'अनित्य शरीर (नश्वर देह)', 'संस्कार और विदाई']
    },
    reflections: [
      {
        title: 'Loving Beyond the Form',
        titleHi: 'देह से परे प्रेम की शाश्वत डोर',
        insight: 'Death can end a biological life, but it cannot end the love, values, and blessings that were shared.',
        insightHi: 'मृत्यु देह को छीन सकती है, किंतु आपके बीच बहे प्रेम और संस्कारों को कोई नहीं मिटा सकता।',
        contemplationPrompt: 'Close your eyes and visualize your departed loved one: What noble virtue or lesson did they leave in your custody to carry forward?',
        contemplationPromptHi: 'नेत्र बंद कर दिवंगत प्रियजन का स्मरण करें: वे आपके जीवन में कौन सा ऐसा पावन गुण या सीख छोड़ गए हैं जिसे आप आगे बढ़ा सकते हैं?',
        dailyPractice: 'Light a small ghee or oil lamp. Dedicate its steady flame to the peaceful ongoing journey of their soul, chanting: "ॐ शान्तिः शान्तिः शान्तिः।"',
        dailyPracticeHi: 'एक छोटा सा दीपक प्रज्वलित करें और उस पावन आत्मा की शांति के लिए मौन प्रार्थना करें: "ॐ शान्तिः शान्तिः शान्तिः।"'
      }
    ],
    relatedConcepts: [
      { id: 'atman', labelEn: 'Atman (Immortality)', labelHi: 'आत्मन्', sanskrit: 'आत्मन्', description: 'The soul that was never born and never dies.', descriptionHi: 'अज, अमर और अविनाशी चैतन्य।', href: '/concepts' },
      { id: 'samsara', labelEn: 'Samsara (Cosmic Cycle)', labelHi: 'संसार', sanskrit: 'संसारः', description: 'The continuous sacred cycle of birth, growth, and rebirth.', descriptionHi: 'जन्म और मृत्यु का सतत प्रवाह।', href: '/concepts' },
      { id: 'moksha', labelEn: 'Moksha (Final Liberation)', labelHi: 'मोक्ष', sanskrit: 'मोक्षः', description: 'Freedom from all cycles of grief and separation.', descriptionHi: 'समस्त दुःखों और विरह से अंतिम मुक्ति।', href: '/concepts' }
    ],
    relatedScriptures: [
      { id: 'bhagavadgita', title: 'Bhagavad Gita', titleHi: 'भगवद्गीता', titleSanskrit: 'श्रीमद्भगवद्गीता', description: 'Chapter 2 contains the world’s most profound teachings on grief.', descriptionHi: 'शोक से मुक्ति और आत्मा की नित्यता पर दूसरा अध्याय।', href: '/scripture/bhagavadgita' },
      { id: 'katha', title: 'Katha Upanishad', titleHi: 'कठोपनिषद्', titleSanskrit: 'कठोपनिषत्', description: 'Nachiketa faces Death itself and learns the secret of immortality.', descriptionHi: 'नचिकेता और यमराज का अमर संवाद मृत्यु के रहस्य पर।', href: '/scripture/katha' }
    ],
    sources: [
      { citation: 'Bhagavad Gita 2.11 and 2.22', textName: 'Bhagavad Gita', section: 'Chapter 2, Verses 11 and 22' }
    ],
    contextualNote: {
      headlineEn: 'Important Note on Complicated Grief & Depression',
      headlineHi: 'शोक और मानसिक अवसाद संबंधी संदर्भ सूचना',
      bodyEn: 'Philosophical insights provide comforting spiritual meaning during bereavement, but grief is also a deep neurobiological and emotional journey.',
      bodyHi: 'यह शास्त्रीय चिंतन शोक के समय दार्शनिक ढांचा प्रदान करता है। किंतु तीव्र वियोग मस्तिष्क और मन पर गहरा प्रभाव डालता है।',
      clinicalDisclaimerEn: 'If grief leads to clinical depression, inability to care for yourself, or persistent thoughts of self-harm, please contact a bereavement counselor or crisis helpline immediately.',
      clinicalDisclaimerHi: 'यदि शोक के कारण आप स्वयं की देखभाल करने में असमर्थ महसूस कर रहे हैं या मन में निराशा का गहरा अंधकार छा गया है, तो तुरंत पेशेवर मनोचिकित्सक या हेल्पलाइन से संपर्क करें।'
    }
  },

  // 5. Duty and decision-making
  {
    id: 'duty-and-decision-making',
    slug: 'duty-and-decision-making',
    titleEn: 'Duty and Decision-Making',
    titleHi: 'कर्तव्य और निर्णय',
    sanskritSubtitle: 'कर्मण्येवाधिकारस्ते एवं स्वधर्मे निधनं श्रेयः',
    category: 'action-duty',
    categoryLabelEn: 'Duty & Action',
    categoryLabelHi: 'कर्तव्य और निर्णय',
    shortDescEn: 'Navigating moral crossroads, ending choice-paralysis, and acting wholeheartedly without anxiety over outcomes.',
    shortDescHi: 'द्वंद्व और अनिर्णय की स्थिति से निकलकर स्वधर्म के प्रकाश में निष्काम भाव से कर्म करना।',
    colorGradient: 'from-blue-700 via-indigo-800 to-slate-900',
    accentColor: '#2563eb',
    searchKeywords: ['duty', 'decision', 'choices', 'paralysis', 'dilemma', 'ethics', 'karma yoga', 'swadharma', 'धर्म', 'कर्तव्य', 'निर्णय'],
    readingTimeMinutes: 8,
    compassionateIntro: {
      leadEn: 'When you stand at a crossroads where every road feels heavy, the fear of making the wrong choice can freeze your steps.',
      leadHi: 'जब जीवन ऐसे मोड़ पर खड़ा हो जहाँ कोई भी निर्णय आसान न लगे, तो गलत चुनाव का डर हमें निष्क्रिय बना देता है।',
      bodyEn: 'Arjuna faced the ultimate ethical paralysis: to act would bring pain, but to refuse would be a betrayal of justice. Krishna did not hand him an easy shortcut. Instead, He introduced Karma Yoga: the science of disentangling action from selfish craving. When you dedicate your effort to Swadharma (your authentic, righteous calling) and release the obsession with applause or guarantees, decision-making becomes clean, bold, and light.',
      bodyHi: 'अर्जुन भी ऐसे ही विकट नैतिक द्वंद्व में फंस गए थे जहाँ कर्म करना भी कठिन था और कर्म छोड़ना भी अनुचित था। श्रीकृष्ण ने उन्हें कोई सस्ता आश्वासन नहीं दिया, बल्कि "कर्मयोग" का दिव्य विज्ञान सिखाया। जब कर्म फल की लिप्सा छोड़कर स्वधर्म और लोक-कल्याण की भावना से किया जाता है, तब निर्णय का बोझ उतर जाता है और कर्म में सहज कुशलता आ जाती है।',
      spiritualFoundationEn: 'Do not measure your decisions only by whether the sky stayed sunny; measure them by whether you acted with truth, dignity, and sincere dedication.',
      spiritualFoundationHi: 'अपने निर्णयों की सफलता केवल इस बात से न नापें कि परिणाम मनचाहा मिला या नहीं; यह देखें कि क्या आपने सत्य, निष्ठा और पूर्ण समर्पण से कार्य किया।'
    },
    verses: [
      {
        id: 'bg-2-47',
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 2,
        verseNumber: 47,
        referenceDisplay: 'Bhagavad Gita 2.47',
        referenceDisplayHi: 'भगवद्गीता २.४७',
        sanskritDevanagari: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
        sanskritTransliteration: "karmaṇyevādhikāraste mā phaleṣu kadācana |\nmā karmaphalaheturbhūrmā te saṅgo'stvakarmaṇi ||",
        literalTranslationHi: 'तुम्हारा अधिकार केवल कर्म करने में ही है, उसके फलों में कभी नहीं। इसलिए तुम कर्म के फल की वासना वाले मत बनो, और न ही तुम्हारी कर्म न करने (निष्क्रियता) में आसक्ति हो।',
        literalTranslationEn: 'Your right is to perform your prescribed duty alone, never to its fruits. Let not the fruit of action be your motive, nor let there be any attachment in you to inaction.',
        traditionalContext: {
          speaker: 'Shri Krishna',
          addressee: 'Arjuna',
          setting: 'The foundational bedrock formula of Karma Yoga in Chapter 2',
          settingHi: 'निष्काम कर्मयोग का सार्वभौमिक सिद्धांत',
          commentaryNote: '',
          commentaryNoteHi: '',
        },
        readerHref: '/scripture/bhagavadgita/chapter/2/verse/47'
      },
      {
        id: 'bg-3-35',
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 3,
        verseNumber: 35,
        referenceDisplay: 'Bhagavad Gita 3.35',
        referenceDisplayHi: 'भगवद्गीता ३.३५',
        sanskritDevanagari: 'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात् ।\nस्वधर्मे निधनं श्रेयः परधर्मो भयावहः ॥',
        sanskritTransliteration: "śreyān svadharmo viguṇaḥ paradharmāt svanuṣṭhitāt |\nsvadharme nidhanaṁ śreyaḥ paradharmo bhayāvahaḥ ||",
        literalTranslationHi: 'अच्छी तरह आचरण किए हुए दूसरे के धर्म (कर्तव्य) की अपेक्षा गुणों से रहित भी अपना धर्म (स्वधर्म) अधिक श्रेयस्कर है। अपने धर्म में तो मरना भी कल्याणकारी है, परंतु दूसरे का धर्म भय को देने वाला है।',
        literalTranslationEn: 'Better is one’s own duty, even if devoid of external brilliance, than the duty of another well performed. Death in one’s own duty brings blessing; the duty of another is fraught with danger.',
        traditionalContext: {
          speaker: 'Shri Krishna',
          addressee: 'Arjuna',
          setting: 'Addressing Arjuna’s temptation to flee the battlefield and live as an ascetic beggar',
          settingHi: 'जब अर्जुन युद्ध छोड़कर संन्यासियों की तरह भिक्षाटन का विचार करते हैं',
          commentaryNote: '',
          commentaryNoteHi: '',
        },
        readerHref: '/scripture/bhagavadgita/chapter/3/verse/35'
      }
    ],
    traditionalContextOverview: {
      titleEn: 'Karma Yoga and Swadharma: The Dharmic Framework for Decisions',
      titleHi: 'कर्मयोग और स्वधर्म: निर्णय लेने का शास्त्रीय ढांचा',
      bodyEn: 'When choices confront us, Hindu ethics recommends filtering through three lenses: 1) Dharma (Is this aligned with cosmic truth and ethics?), 2) Swadharma (Does this belong to my genuine duty and role?), and 3) Nishkama (Am I doing this for the welfare of the situation or for petty vanity?).',
      bodyHi: 'जब भी कोई दुविधा आए, तो तीन कसौटियों पर निर्णय को परखें: १) धर्म (क्या यह न्यायसंगत है?), २) स्वधर्म (क्या यह मेरी वास्तविक जिम्मेदारी है?), और ३) निष्काम भाव (क्या मैं इसे अहंकारवश कर रहा हूँ या कर्तव्यबोध से?)।',
      keyThemes: ['Swadharma (Authentic Calling)', 'Nishkama Karma (Selfless Duty)', 'Yogah Karmasu Kaushalam (Skill in Action)'],
      keyThemesHi: ['स्वधर्म (स्वाभाविक कर्तव्य)', 'निष्काम कर्म (फल-आसक्ति से मुक्ति)', 'योगः कर्मसु कौशलम् (कर्म में कुशलता)']
    },
    reflections: [
      {
        title: 'Cutting Through Decision Paralysis',
        titleHi: 'अनिर्णय के चक्रव्यूह से मुक्ति',
        insight: 'No action can guarantee total perfection, but running away guarantees regret.',
        insightHi: 'संसार का कोई भी कर्म दोषमुक्त नहीं हो सकता, किंतु निर्णय टालना सदैव पश्चाताप लाता है।',
        contemplationPrompt: 'If you had to decide purely based on what is righteous (Dharma) rather than what will win social praise, what would you choose right now?',
        contemplationPromptHi: 'यदि आपको केवल यह देखकर चुनना हो कि सही और नीतिसंगत क्या है, न कि लोग क्या कहेंगे—तो आपका उत्तर क्या होगा?',
        dailyPractice: 'Write down your two choices. Against each, write the primary duty involved. Make the choice that aligns with integrity, and commit fully with a sincere prayer.',
        dailyPracticeHi: 'दोनों विकल्पों को कागज पर लिखें। जो विकल्प अंतरात्मा और कर्तव्य के अधिक निकट हो, उसे चुनकर ईश्वर को समर्पित कर दें।'
      }
    ],
    relatedConcepts: [
      { id: 'dharma', labelEn: 'Dharma (Moral Order)', labelHi: 'धर्म', sanskrit: 'धर्मः', description: 'The cosmic axis of righteousness and duty.', descriptionHi: 'सृष्टि और जीवन को धारण करने वाला नैतिक विधान।', href: '/concepts' },
      { id: 'karma', labelEn: 'Karma (Action & Cause)', labelHi: 'कर्म', sanskrit: 'कर्म', description: 'The universal law of intentional deed and consequence.', descriptionHi: 'कर्म और उसके परिणाम का सार्वभौमिक नियम।', href: '/concepts' },
      { id: 'viveka', labelEn: 'Viveka (Discernment)', labelHi: 'विवेक', sanskrit: 'विवेकः', description: 'Sharp intellectual discernment between the eternal and transient.', descriptionHi: 'उचित-अनुचित और नित्य-अनित्य का स्पष्ट बोध।', href: '/concepts' }
    ],
    relatedScriptures: [
      { id: 'bhagavadgita', title: 'Bhagavad Gita', titleHi: 'भगवद्गीता', titleSanskrit: 'श्रीमद्भगवद्गीता', description: 'The world’s supreme treatise on action without paralysis.', descriptionHi: 'कर्म और कर्तव्य पर संपूर्ण मानव जाति का मार्गदर्शक।', href: '/scripture/bhagavadgita' },
      { id: 'viduraniti', title: 'Vidura Niti', titleHi: 'विदुर नीति', titleSanskrit: 'विदुरनीतिः', description: 'Pragmatic ethical guidelines for high-stakes decisions.', descriptionHi: 'जटिल परिस्थितियों में नीतिसंगत निर्णय के सुनहरे सूत्र।', href: '/scripture/viduraniti' }
    ],
    sources: [
      { citation: 'Bhagavad Gita 2.47 and 3.35', textName: 'Bhagavad Gita', section: 'Chapters 2 and 3' }
    ],
    contextualNote: {
      headlineEn: 'Important Note on Legal & Professional Guidance',
      headlineHi: 'कानूनी एवं व्यावसायिक संदर्भ सूचना',
      bodyEn: 'Scriptural principles of duty help refine your personal conscience and ethical compass. They do not replace legal, financial, or regulatory expertise.',
      bodyHi: 'यह दार्शनिक चिंतन व्यक्तिगत अंतरात्मा और नैतिक विवेक को जागृत करने के लिए है। यह किसी कानूनी या वित्तीय परामर्श का स्थानापन्न नहीं है।',
      clinicalDisclaimerEn: 'For corporate contracts, legal disputes, or complex financial audits, always seek certified legal or financial professionals.',
      clinicalDisclaimerHi: 'कानूनी विवादों या वित्तीय निर्णयों के लिए संबंधित पेशेवर विशेषज्ञों की सलाह अवश्य लें।'
    }
  },

  // 6. Discipline
  {
    id: 'discipline',
    slug: 'discipline',
    titleEn: 'Discipline and Self-Mastery',
    titleHi: 'अनुशासन और संयम',
    sanskritSubtitle: 'तपःस्वाध्यायेश्वरप्रणिधानानि एवं युक्ताहारविहारस्य',
    category: 'discipline-focus',
    categoryLabelEn: 'Discipline & Focus',
    categoryLabelHi: 'संयम और एकाग्रता',
    shortDescEn: 'Cultivating joyful, balanced self-restraint (Tapas) rather than self-punishment to unlock boundless creative vitality.',
    shortDescHi: 'कठोर आत्म-दमन नहीं, बल्कि युक्त आहार-विहार और सहज तप द्वारा जीवन को दिव्य शक्ति देना।',
    colorGradient: 'from-amber-700 via-orange-800 to-stone-900',
    accentColor: '#c2410c',
    searchKeywords: ['discipline', 'habits', 'willpower', 'self-control', 'tapas', 'moderation', 'laziness', 'sloth', 'संयम', 'अनुशासन', 'तप'],
    readingTimeMinutes: 7,
    compassionateIntro: {
      leadEn: 'If you have often made promises to yourself only to stumble into procrastination and distraction, do not despair.',
      leadHi: 'यदि आप बार-बार संकल्प लेते हैं और फिर आलस्य या भटकाव में फिसल जाते हैं, तो स्वयं को हीन न समझें।',
      bodyEn: 'In modern culture, discipline is often painted as grim punishment or joyless austerity. But in the Vedic tradition, discipline is called Tapas: a warm, radiant fire that burns away lethargy and refines raw gold. True yoga is neither extreme starvation nor hedonistic indulgence; it is Yuktata—the joyful art of calibrated moderation in food, sleep, work, and recreation.',
      bodyHi: 'आधुनिक समाज में अनुशासन को अक्सर एक बोझिल और दंडात्मक प्रक्रिया माना जाता है। किंतु सनातन परंपरा में इसे "तप" कहा गया है—वह पावन अग्नि जो मनुष्य के कच्चेपन को तपाकर कुंदन बना देती है। गीता स्पष्ट करती है कि योग न तो भूखे मरने का नाम है और न ही अति-भोग का; यह "युक्तता" यानी संतुलन और सहज मर्यादा की साधना है।',
      spiritualFoundationEn: 'Discipline is not the prison of your desires; it is the key that unlocks your freedom from impulses that degrade you.',
      spiritualFoundationHi: 'अनुशासन आपकी स्वतंत्रता का हनन नहीं है; यह उन क्षणिक प्रलोभनों से मुक्ति का द्वार है जो आपको भीतर से दुर्बल करते हैं।'
    },
    verses: [
      {
        id: 'bg-6-16-17',
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 6,
        verseNumber: '16-17',
        referenceDisplay: 'Bhagavad Gita 6.16–17',
        libraryRef: { chapter: 6, verse: 16 },
        referenceDisplayHi: 'भगवद्गीता ६.१६–१७',
        sanskritDevanagari: 'नात्यश्नतस्तु योगोऽस्ति न चैकान्तमनश्नतः ।\nन चातिस्वप्नशीलस्य जाग्रतो नैव चार्जुन ॥\nयुक्ताहारविहारस्य युक्तचेष्टस्य कर्मसु ।\nयुक्तस्वप्नावबोधस्य योगो भवति दुःखहा ॥',
        sanskritTransliteration: "nātyaśnatastu yogo'sti na caikāntamanaśnataḥ |\nna cātisvapnaśīlasya jāgrato naiva cārjuna ||\nyuktāhāravihārasya yuktaceṣṭasya karmasu |\nyuktasvapnāvabodhasya yogo bhavati duḥkhahā ||",
        literalTranslationHi: 'हे अर्जुन! यह योग न तो बहुत अधिक खाने वाले का सिद्ध होता है, न बिल्कुल न खाने वाले का; न बहुत सोने वाले का और न ही सदा जागते रहने वाले का। यथायोग्य (संतुलित) आहार और विहार करने वाले का, कर्मों में उचित चेष्टा रखने वाले का तथा समय पर सोने और जागने वाले का योग ही सब दुःखों का नाश करने वाला होता है।',
        literalTranslationEn: 'Yoga is not possible for one who gorges too much, nor for one who fasts completely; nor for one given to excessive sleep, nor for one perpetually sleepless, O Arjuna. For one who is moderate in eating and recreation, regulated in working, and balanced in sleep and wakefulness, Yoga destroys all sorrows.',
        traditionalContext: {
          speaker: 'Shri Krishna',
          addressee: 'Arjuna',
          setting: 'Practical instructions for a steady meditative lifestyle in Dhyana Yoga',
          settingHi: 'अध्याय ६ में ध्यान और जीवनचर्या के व्यावहारिक संतुलन का उपदेश',
          commentaryNote: '',
          commentaryNoteHi: '',
        },
        readerHref: '/scripture/bhagavadgita/chapter/6/verse/17'
      },
      {
        id: 'katha-1-3-3-4',
        scriptureId: 'katha',
        scriptureName: 'Katha Upanishad',
        scriptureNameHi: 'कठोपनिषद्',
        chapterNumber: 1,
        verseNumber: '3.3-4',
        referenceDisplay: 'Katha Upanishad 1.3.3–4',
        libraryRef: { chapter: 3, verse: 3 },
        referenceDisplayHi: 'कठोपनिषद् १.३.३–४',
        sanskritDevanagari: 'आत्मानं रथिनं विद्धि शरीरं रथमेव तु ।\nबुद्धिं तु सारथिं विद्धि मनः प्रग्रहमेव च ॥\nइन्द्रियाणि हयानाहुर्विषयांस्तेषु गोचरान् ।\nआत्मेन्द्रियमनोयुक्तं भोक्तेत्याहुर्मनीषिणः ॥',
        sanskritTransliteration: "ātmānaṁ rathinaṁ viddhi śarīraṁ rathameva tu |\nbuddhiṁ tu sārathiṁ viddhi manaḥ pragrahameva ca ||\nindriyāṇi hayānāhurviṣayāṁsteṣu gocarān |\nātmendriyamanoyuktaṁ bhoktetyāhurmanīṣiṇaḥ ||",
        literalTranslationHi: 'आत्मा को रथ का स्वामी (सवार) जानो, और शरीर को रथ समझो। बुद्धि को सारथि जानो और मन को लगाम। इंद्रियों को घोड़े कहा गया है और सांसारिक विषयों को वे मार्ग जिन पर वे दौड़ते हैं। शरीर, इंद्रियों और मन से युक्त आत्मा को विद्वान् “भोक्ता” (भोगने वाला) कहते हैं।',
        literalTranslationEn: 'Know the Self as the master of the chariot, and the body as the chariot itself. Know the intellect as the charioteer, and the mind as the reins. The senses are called the horses, and the objects of the senses are their path. The wise call the Self, joined with body, senses and mind, the enjoyer.',
        traditionalContext: {
          speaker: 'Yamaraja',
          addressee: 'Nachiketa',
          setting: 'The celebrated chariot parable of human psychology and self-mastery',
          settingHi: 'यमराज द्वारा नचिकेता को दिया गया रथ का प्रसिद्ध रूपक',
          commentaryNote: 'If the charioteer (intellect) falls asleep and drops the reins (mind), the wild horses (senses) will plunge the chariot over the precipice.',
          commentaryNoteHi: 'यदि सारथि (बुद्धि) सो जाए और लगाम (मन) ढीली पड़ जाए, तो अनियंत्रित घोड़े (इंद्रियां) रथ को खाई में गिरा देते हैं।'
        },
        readerHref: '/scripture/katha/chapter/1'
      }
    ],
    traditionalContextOverview: {
      titleEn: 'Tapas and the Chariot of Consciousness',
      titleHi: 'तप और अंतःकरण का दिव्य रथ',
      bodyEn: 'In Sanatana Dharma, discipline is the art of alignment. You are not fighting your body; your intellect is gently training your senses, like a seasoned horse-trainer. When intellect, mind, and senses pull in harmonious unison, extraordinary spiritual and worldly achievements unfold.',
      bodyHi: 'सनातन धर्म में अनुशासन कोई युद्ध नहीं, बल्कि संतुलन की कला है। बुद्धि रूपी सारथी को मन रूपी लगाम द्वारा इंद्रियों को सही दिशा देनी होती है। जब सब मिलकर एक लक्ष्य की ओर बढ़ते हैं, तो जीवन स्वतः तेजस्वी बन जाता है।',
      keyThemes: ['Yuktahara (Balanced Living)', 'Tapas (Transformative Heat)', 'Indriya-Nigraha (Senses under Reins)'],
      keyThemesHi: ['युक्ताहार-विहार (संतुलन)', 'तप (ऊर्जा का रूपांतरण)', 'इंद्रिय-निग्रह (संयम)']
    },
    reflections: [
      {
        title: 'Tightening the Reins with Kindness',
        titleHi: 'स्नेह और दृढ़ता के साथ लगाम थामना',
        insight: 'Habits are not formed by harsh self-condemnation, but by clear, repeated daily rituals.',
        insightHi: 'अच्छी आदतें स्वयं को कोसने से नहीं, बल्कि शांत और निरंतर दैनिक नियमों से बनती हैं।',
        contemplationPrompt: 'Which of your "senses/horses" has broken loose lately: screen time, diet, sleep, or speech? What would a gentle tightening of the rein look like today?',
        contemplationPromptHi: 'आपकी कौन सी इंद्रिय हाल ही में अनियंत्रित हुई है: स्क्रीन का समय, भोजन, नींद या कटु वाणी? आज आप उसे कैसे संतुलित करेंगे?',
        dailyPractice: 'Select one non-negotiable daily habit (e.g., wake up at a set time, 15 minutes of screen-free contemplation). Keep it unbroken for seven days as a sacred offering (Yajna).',
        dailyPracticeHi: 'एक छोटा सा संकल्प लें (जैसे नियत समय पर उठना या १५ मिनट का मौन) और उसे सात दिन तक ईश्वर के प्रति यज्ञ मानकर निभाएं।'
      }
    ],
    relatedConcepts: [
      { id: 'tapas', labelEn: 'Tapas (Spiritual Austerity)', labelHi: 'तप', sanskrit: 'तपः', description: 'Purifying self-discipline that strengthens will.', descriptionHi: 'संकल्प और आत्मबल को प्रखर करने वाली साधना।', href: '/concepts' },
      { id: 'dama', labelEn: 'Dama (Sensory Control)', labelHi: 'दम', sanskrit: 'दमः', description: 'Holding the senses steady in the presence of temptation.', descriptionHi: 'प्रलोभनों के बीच इंद्रियों को स्थिर रखने की शक्ति।', href: '/concepts' },
      { id: 'abhyasa', labelEn: 'Abhyasa (Steady Practice)', labelHi: 'अभ्यास', sanskrit: 'अभ्यासः', description: 'Continuous uninterrupted effort over time.', descriptionHi: 'दीर्घकाल तक निरंतर और सत्कारपूर्वक किया गया प्रयास।', href: '/concepts' }
    ],
    relatedScriptures: [
      { id: 'bhagavadgita', title: 'Bhagavad Gita', titleHi: 'भगवद्गीता', titleSanskrit: 'श्रीमद्भगवद्गीता', description: 'Chapter 6 reveals the middle way of supreme self-regulation.', descriptionHi: 'छठा अध्याय जो अति-भोग और अति-तप दोनों से परे मध्यमार्ग दिखाता है।', href: '/scripture/bhagavadgita' },
      { id: 'katha', title: 'Katha Upanishad', titleHi: 'कठोपनिषद्', titleSanskrit: 'कठोपनिषत्', description: 'The timeless allegory of the chariot and the horses of the senses.', descriptionHi: 'रथ, सारथि और घोड़ों का अमर मनोवैज्ञानिक रूपक।', href: '/scripture/katha' }
    ],
    sources: [
      { citation: 'Bhagavad Gita 6.16–17', textName: 'Bhagavad Gita', section: 'Chapter 6, Verses 16–17' },
      { citation: 'Katha Upanishad 1.3.3–4', textName: 'Katha Upanishad', section: 'Chapter 1, Valli 3' }
    ],
    contextualNote: {
      headlineEn: 'Important Note Regarding Eating & Compulsive Disorders',
      headlineHi: 'आहार एवं बाध्यकारी विकारों संबंधी संदर्भ सूचना',
      bodyEn: 'Scriptural moderation encourages healthy daily rhythms. It is not intended as medical nutrition advice or a substitute for therapy.',
      bodyHi: 'यह शास्त्रीय संदेश जीवनशैली के संतुलन के लिए है। यह किसी पोषण विशेषज्ञ या चिकित्सक की सलाह का स्थान नहीं ले सकता।',
      clinicalDisclaimerEn: 'If you struggle with anorexia, bulimia, obsessive-compulsive rituals, or severe sleep disorders, seek clinical medical evaluation.',
      clinicalDisclaimerHi: 'यदि आप ईटिंग डिसऑर्डर, गंभीर अनिद्रा या ओसीडी जैसी समस्याओं से जूझ रहे हैं, तो तुरंत योग्य चिकित्सक से परामर्श लें।'
    }
  },

  // 7. Concentration
  {
    id: 'concentration',
    slug: 'concentration',
    titleEn: 'Concentration and Mental Focus',
    titleHi: 'एकाग्रता और ध्यान',
    sanskritSubtitle: 'व्यवसायात्मिका बुद्धिः एवं यथा दीपो निवातस्थः',
    category: 'discipline-focus',
    categoryLabelEn: 'Discipline & Focus',
    categoryLabelHi: 'संयम और एकाग्रता',
    shortDescEn: 'Gathering fragmented attention into a single-pointed laser beam (Ekagrata) to penetrate the deepest truths.',
    shortDescHi: 'बिखरे हुए मन को समेटकर निश्चयात्मक बुद्धि में एकटक और निष्कंप दीपक की भांति स्थिर करना।',
    colorGradient: 'from-cyan-700 via-blue-800 to-slate-950',
    accentColor: '#0891b2',
    searchKeywords: ['concentration', 'focus', 'attention', 'meditation', 'dhyana', 'distraction', 'brain fog', 'ekagrata', 'एकाग्रता', 'ध्यान', 'मन'],
    readingTimeMinutes: 7,
    compassionateIntro: {
      leadEn: 'Living in an environment engineered to fragment your attention every three seconds is exhausting.',
      leadHi: 'आज की तीव्र और सूचनाओं से भरी दुनिया में मन का बार-बार भटकना और थक जाना अत्यंत स्वाभाविक है।',
      bodyEn: 'Long before smartphones, the seers noted: "Endless and multi-branched are the thoughts of the irresolute" (Gita 2.41). When attention is scattered into a hundred puddles, none of them run deep. Scripture teaches that the mind is like a lamp in a windless sanctuary: when protected from the cross-drafts of unnecessary sensory inputs, its flame burns steady, upright, and brilliantly clear.',
      bodyHi: 'स्मार्टफोन और स्क्रीन से सदियों पहले भगवान श्रीकृष्ण ने कहा था: "अव्यवसायी लोगों की बुद्धियाँ अनन्त शाखाओं वाली और बिखरी होती हैं।" जब चेतना सौ दिशाओं में बहती है, तो कहीं भी गहराई नहीं मिल पाती। उपनिषद् और गीता मन को वायु-रहित स्थान में रखे दीपक के समान बनाने का मार्ग दिखाते हैं, जो बिना कंपित हुए प्रज्वलित रहता है।',
      spiritualFoundationEn: 'Focus is not forced strain of the forehead; it is the natural consequence of falling in love with what truly matters.',
      spiritualFoundationHi: 'एकाग्रता माथे पर बल देने से नहीं आती; यह तब सहज घटित होती है जब मन अपने लक्ष्य के प्रति अगाध प्रेम और निष्ठा से भर जाता है।'
    },
    verses: [
      {
        id: 'bg-2-41',
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 2,
        verseNumber: 41,
        referenceDisplay: 'Bhagavad Gita 2.41',
        referenceDisplayHi: 'भगवद्गीता २.४१',
        sanskritDevanagari: 'व्यवसायात्मिका बुद्धिरेकेह कुरुनन्दन ।\nबहुशाखा ह्यनन्ताश्च बुद्धयोऽव्यवसायिनाम् ॥',
        sanskritTransliteration: "vyavasāyātmikā buddhirekeha kurunandana |\nbahuśākhā hyanantāśca buddhayo'vyavasāyinām ||",
        literalTranslationHi: 'हे कुरुनन्दन! इस कल्याण-मार्ग में निश्चयात्मक बुद्धि केवल एक ही होती है; किंतु अस्थिर विचार वाले विवेकहीन मनुष्यों की बुद्धियाँ बहुत शाखाओं वाली और अनंत होती हैं।',
        literalTranslationEn: 'In this path, the resolute intellect is single-pointed, O joy of the Kurus; but the intellect of the indecisive is many-branched and truly endless.',
        traditionalContext: {
          speaker: 'Shri Krishna',
          addressee: 'Arjuna',
          setting: 'Contrast between single-pointed Vedantic dedication and scattered ritualistic desires',
          settingHi: 'एकाग्र निश्चयी बुद्धि और भटके हुए विचारों के अंतर का उद्घाटन',
          commentaryNote: '',
          commentaryNoteHi: '',
        },
        readerHref: '/scripture/bhagavadgita/chapter/2/verse/41'
      },
      {
        id: 'mundaka-2-2-4',
        scriptureId: 'mundaka',
        scriptureName: 'Mundaka Upanishad',
        scriptureNameHi: 'मुण्डकोपनिषद्',
        chapterNumber: 2,
        verseNumber: '2.4',
        referenceDisplay: 'Mundaka Upanishad 2.2.4',
        libraryRef: { chapter: 4, verse: 4 },
        referenceDisplayHi: 'मुण्डकोपनिषद् २.२.४',
        sanskritDevanagari: 'प्रणवो धनुः शरो ह्यात्मा ब्रह्म तल्लक्ष्यमुच्यते ।\nअप्रमत्तेन वेद्धव्यं शरवत्तन्मयो भवेत् ॥',
        sanskritTransliteration: "praṇavo dhanuḥ śaro hyātmā brahma tallakṣyamucyate |\napramattena veddhavyaṁ śaravattanmayo bhavet ||",
        literalTranslationHi: 'प्रणव (ॐ) धनुष है, आत्मा बाण है, और ब्रह्म उसका लक्ष्य कहा गया है। प्रमाद-रहित (पूर्ण एकाग्र) होकर इस लक्ष्य को भेदना चाहिए, और बाण की भाँति उसमें तन्मय (एकाकार) हो जाना चाहिए।',
        literalTranslationEn: 'The Pranava (Om) is the bow; the Self is the arrow; Brahman is declared to be the target. It must be pierced with unswerving alertness; then one becomes one with the target, just as an arrow sinks into the mark.',
        traditionalContext: {
          speaker: 'Rishi Angiras',
          addressee: 'Shaunaka',
          setting: 'The master archer meditation instruction on piercing transcendent reality',
          settingHi: 'धनुर्विद्या के रूपक द्वारा ध्यान की पराकाष्ठा का उपदेश',
          commentaryNote: 'Apramatta means without distraction or mental sleep. The archer does not look at the grass or the sky; every cell is dedicated to the center of the target.',
          commentaryNoteHi: 'अप्रमत्त का अर्थ है तनिक भी असावधान न होना। जैसे कुशल धनुर्धर केवल लक्ष्य को देखता है, वैसे ही ध्यानी को परमात्मा में लीन होना चाहिए।'
        },
        readerHref: '/scripture/mundaka/chapter/2'
      }
    ],
    traditionalContextOverview: {
      titleEn: 'Ekagrata and Dharana: The Vedic Art of Single-Pointedness',
      titleHi: 'एकाग्रता और धारणा: वैदिक ध्यान की विधि',
      bodyEn: 'Concentration (Dharana) is the binding of awareness to a single spatial or contemplative point (desha-bandhash chittasya). When this continuous stream of attention flows uninterrupted like oil poured from one vessel to another, it ripens into Dhyana (true meditation).',
      bodyHi: 'योग दर्शन में चित्त को किसी एक पावन बिंदु या विचार पर स्थिर करने को "धारणा" कहते हैं। जब यह एकाग्रता तेल की अविरल धार के समान बिना टूटे बहने लगती है, तब वह "ध्यान" कहलाती है।',
      keyThemes: ['Ekagrata (Single-Pointedness)', 'Dharana & Dhyana (Focus into Meditation)', 'Apramada (Vigilant Alertness)'],
      keyThemesHi: ['एकाग्रता (एक लक्ष्य पर स्थिति)', 'धारणा और ध्यान (सतत प्रवाह)', 'अप्रमाद (जागरूकता)']
    },
    reflections: [
      {
        title: 'Building the Sanctuary Against Distraction',
        titleHi: 'भटकावों से परे मन का एकांत बनाना',
        insight: 'Every time you resist a mindless notification, you are building the spiritual muscle of concentration.',
        insightHi: 'हर बार जब आप किसी अनावश्यक आकर्षण को त्यागते हैं, तो आप अपनी एकाग्रता की शक्ति को मजबूत कर रहे होते हैं।',
        contemplationPrompt: 'What single task in your life right now deserves your 100% undivided devotion, with no second tab and no secondary screen?',
        contemplationPromptHi: 'इस समय आपके जीवन का कौन सा एक कार्य ऐसा है जो आपकी शत-प्रतिशत एकाग्रता और समर्पण की मांग करता है?',
        dailyPractice: 'Practice "Trataka" or single-point breath meditation for 5 minutes daily. Whenever thoughts wander, gently bring attention back without irritation, like training an innocent puppy.',
        dailyPracticeHi: 'प्रतिदिन ५ मिनट केवल अपनी श्वास पर ध्यान दें। जब भी मन भटके, बिना किसी झुंझलाहट के उसे स्नेहपूर्वक वापस ले आएं।'
      }
    ],
    relatedConcepts: [
      { id: 'dhyana', labelEn: 'Dhyana (Meditation)', labelHi: 'ध्यान', sanskrit: 'ध्यानम्', description: 'The uninterrupted flow of awareness toward the sacred.', descriptionHi: 'ध्येय वस्तु में चित्त का अविरल प्रवाह।', href: '/concepts' },
      { id: 'buddhi', labelEn: 'Buddhi (Intellect)', labelHi: 'बुद्धि', sanskrit: 'बुद्धिः', description: 'The discerning faculty capable of sharp resolve.', descriptionHi: 'निश्चय करने वाली प्रज्ञा।', href: '/concepts' },
      { id: 'om', labelEn: 'Om (Pranava)', labelHi: 'ॐ (प्रणव)', sanskrit: 'ॐ', description: 'The primordial sound serving as the bow for the arrow of the Self.', descriptionHi: 'परब्रह्म का मूल नाद जो ध्यान का परम आलंबन है।', href: '/concepts' }
    ],
    relatedScriptures: [
      { id: 'mundaka', title: 'Mundaka Upanishad', titleHi: 'मुण्डकोपनिषद्', titleSanskrit: 'मुण्डकोपनिषत्', description: 'Presents the bow, arrow, and target allegory of focus.', descriptionHi: 'धनुष और बाण के माध्यम से ध्यान की अद्वितीय विधि।', href: '/scripture/mundaka' },
      { id: 'bhagavadgita', title: 'Bhagavad Gita', titleHi: 'भगवद्गीता', titleSanskrit: 'श्रीमद्भगवद्गीता', description: 'Chapter 6 details sitting posture, gaze, and mental stilling.', descriptionHi: 'आसन, दृष्टि और मन की शांति की संपूर्ण पद्धति।', href: '/scripture/bhagavadgita' }
    ],
    sources: [
      { citation: 'Bhagavad Gita 2.41', textName: 'Bhagavad Gita', section: 'Chapter 2, Verse 41' },
      { citation: 'Mundaka Upanishad 2.2.4', textName: 'Mundaka Upanishad', section: 'Mundaka 2, Khanda 2' }
    ],
    contextualNote: {
      headlineEn: 'Important Note Regarding Attention Disorders (ADHD)',
      headlineHi: 'ध्यान संबंधी विकारों (ADHD) पर संदर्भ सूचना',
      bodyEn: 'Contemplative focus exercises enhance attention stamina. However, neurodevelopmental attention conditions are medical realities.',
      bodyHi: 'यह ध्यान अभ्यास एकाग्रता को साधने में सहायक है। किंतु तंत्रिका संबंधी विकार एक चिकित्सीय वास्तविकता हैं।',
      clinicalDisclaimerEn: 'If chronic attention deficits, executive dysfunction, or cognitive fog severely impede your career or studies, consult a licensed neuropsychiatrist or clinical psychologist.',
      clinicalDisclaimerHi: 'यदि गंभीर ध्यान अभाव या भ्रम की समस्या आपकी पढ़ाई या कार्य को प्रभावित कर रही है, तो विशेषज्ञ चिकित्सक से जांच कराएं।'
    }
  },

  // 8. Leadership
  {
    id: 'leadership',
    slug: 'leadership',
    titleEn: 'Leadership and Public Example',
    titleHi: 'नेतृत्व और लोकसंग्रह',
    sanskritSubtitle: 'यद्यदाचरति श्रेष्ठः एवं लोकसंग्रहमेवापि संपश्यन्',
    category: 'action-duty',
    categoryLabelEn: 'Duty & Action',
    categoryLabelHi: 'कर्तव्य और निर्णय',
    shortDescEn: 'Leading not through domination or ego, but through personal integrity, service, and upholding the fabric of society.',
    shortDescHi: 'अहंकार से नहीं, बल्कि उदात्त आचरण, सेवा और लोक-कल्याण की भावना से समाज का मार्गदर्शन।',
    colorGradient: 'from-amber-700 via-yellow-800 to-stone-900',
    accentColor: '#b45309',
    searchKeywords: ['leadership', 'influence', 'example', 'integrity', 'governance', 'loka-sangraha', 'responsibility', 'नेतृत्व', 'लोकसंग्रह', 'धर्म'],
    readingTimeMinutes: 7,
    compassionateIntro: {
      leadEn: 'Whenever people look to you for guidance—whether as a parent, mentor, executive, or elder—the weight can feel immense.',
      leadHi: 'जब लोग मार्गदर्शन के लिए आपकी ओर देखते हैं—चाहे परिवार में, कार्यक्षेत्र में या समाज में—तो उत्तरदायित्व का भार गहरा होता है।',
      bodyEn: 'Scripture does not define leadership by titles, power, or authoritarian command. The Vedic model of leadership is Lokasangraha: the preservation, nourishment, and ethical upliftment of the entire community. People do not follow what leaders proclaim; they follow how leaders actually live. When a leader acts with genuine selflessness, society finds its moral compass.',
      bodyHi: 'सनातन परंपरा में नेतृत्व किसी पद, सत्ता या अहंकार का प्रदर्शन नहीं है। यहाँ नेतृत्व का सिद्धांत "लोकसंग्रह" है—यानी समाज को जोड़कर रखना, उनका पोषण करना और नैतिक मर्यादा की रक्षा करना। लोग उपदेशों से नहीं, बल्कि नेता के आचरण से सीखते हैं। जब मार्गदर्शक स्वयं धर्म पर चलता है, तो समाज स्वतः प्रकाशित हो उठता है।',
      spiritualFoundationEn: 'A true leader is not a king seated on a pedestal demanding tribute; a leader is a banyan tree providing shade to weary travelers.',
      spiritualFoundationHi: 'सच्चा नेता वह नहीं जो सिंहासन पर बैठकर जयकार चाहे; वह तो उस विशाल वटवृक्ष के समान है जो सबको शीतल छाया देता है।'
    },
    verses: [
      {
        id: 'bg-3-21',
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 3,
        verseNumber: 21,
        referenceDisplay: 'Bhagavad Gita 3.21',
        referenceDisplayHi: 'भगवद्गीता ३.२१',
        sanskritDevanagari: 'यद्यदाचरति श्रेष्ठस्तत्तदेवेतरो जनः ।\nस यत्प्रमाणं कुरुते लोकस्तदनुवर्तते ॥',
        sanskritTransliteration: "yadyadācarati śreṣṭhastattadevetaro janaḥ |\nsa yatpramāṇaṁ kurute lokastadanuvartate ||",
        literalTranslationHi: 'श्रेष्ठ पुरुष जैसा-जैसा आचरण करता है, अन्य लोग भी वैसा ही आचरण करते हैं। वह जो कुछ प्रमाण (आदर्श) बना देता है, समस्त समाज उसी का अनुसरण करने लगता है।',
        literalTranslationEn: 'Whatever the exemplary leader performs, ordinary people follow that very thing. Whatever standard they set by their deed, the world follows suit.',
        traditionalContext: {
          speaker: 'Shri Krishna',
          addressee: 'Arjuna',
          setting: 'Reminding Arjuna that his public choices will define the moral baseline of future generations',
          settingHi: 'श्रीकृष्ण का अर्जुन को स्मरण कराना कि उनका आचरण आने वाली पीढ़ियों की मर्यादा तय करेगा',
          commentaryNote: '',
          commentaryNoteHi: '',
        },
        readerHref: '/scripture/bhagavadgita/chapter/3/verse/21'
      },
      {
        id: 'bg-3-20',
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 3,
        verseNumber: 20,
        referenceDisplay: 'Bhagavad Gita 3.20',
        referenceDisplayHi: 'भगवद्गीता ३.२०',
        sanskritDevanagari: 'कर्मणैव हि संसिद्धिमास्थिता जनकादयः ।\nलोकसंग्रहमेवापि संपश्यन्कर्तुमर्हसि ॥',
        sanskritTransliteration: "karmaṇaiva hi saṁsiddhimāsthitā janakādayaḥ |\nlokasaṁgrahamevāpi saṁpaśyankartumarhasi ||",
        literalTranslationHi: 'राजा जनक जैसे ज्ञानी महापुरुषों ने भी कर्म द्वारा ही परम सिद्धि प्राप्त की थी। इसलिए लोक-संग्रह (संसार के कल्याण और व्यवस्था) को देखते हुए भी तुम्हें कर्म करना ही चाहिए।',
        literalTranslationEn: 'Janaka and other great rulers attained supreme perfection through action alone. Even having an eye solely to the welfare and cohesion of the world (Lokasangraha), you ought to perform your duty.',
        traditionalContext: {
          speaker: 'Shri Krishna',
          addressee: 'Arjuna',
          setting: 'Citing King Janaka of Mithila as the exemplar of enlightened administrative leadership',
          settingHi: 'विदेह राजा जनक का उदाहरण देकर कर्मयोग और लोक-कल्याण का प्रतिपादन',
          commentaryNote: 'Loka-sangraha means preventing society from disintegrating into lawlessness and cynicism by demonstrating righteous participation.',
          commentaryNoteHi: 'लोकसंग्रह का अर्थ है समाज को मर्यादाहीनता और निराशा में गिरने से बचाकर संगठित और धर्ममय बनाए रखना।'
        },
        readerHref: '/scripture/bhagavadgita/chapter/3/verse/20'
      }
    ],
    traditionalContextOverview: {
      titleEn: 'Rajadharma and Lokasangraha: The Servant-Leader Ethos',
      titleHi: 'राजधर्म और लोकसंग्रह: सेवा-आधारित नेतृत्व',
      bodyEn: 'In both the Ramayana (Maryada Purushottama) and Mahabharata Shanti Parva, the ruler is not the owner of the realm, but its first servant and guardian. Leadership is a heavy Tapasya where personal preferences must yield to collective justice and truth.',
      bodyHi: 'रामायण और महाभारत के शांतिपर्व में नेतृत्व को भोग नहीं, बल्कि एक कठिन तपस्या माना गया है। राजा प्रजा का स्वामी नहीं, बल्कि उसका प्रथम सेवक और रक्षक होता है।',
      keyThemes: ['Loka-Sangraha (Welfare of the Whole)', 'Rajadharma (Ethics of Governance)', 'Shreshthata (Exemplary Conduct)'],
      keyThemesHi: ['लोकसंग्रह (विश्व-कल्याण)', 'राजधर्म (न्यायपूर्ण शासन)', 'श्रेष्ठ आचरण']
    },
    reflections: [
      {
        title: 'Leading by the Unspoken Example',
        titleHi: 'मौन आचरण से नेतृत्व करना',
        insight: 'People may doubt what you say, but they will always believe what you consistently do.',
        insightHi: 'लोग आपके वचनों पर भले संदेह करें, किंतु आपके निरंतर आचरण पर वे स्वतः विश्वास करेंगे।',
        contemplationPrompt: 'If your team, family, or students adopted your daily habits, speech, and patience, what kind of culture would emerge?',
        contemplationPromptHi: 'यदि आपके अनुयायी या परिवारजन आपके दैनिक आचरण और वाणी की हूबहू नकल करें, तो कैसा वातावरण बनेगा?',
        dailyPractice: 'Before correcting someone else today, reflect: "Am I embodying this standard myself?" Lead the next conversation with humble listening rather than assertion.',
        dailyPracticeHi: 'किसी दूसरे को सुधारने से पहले स्वयं से पूछें: "क्या मैं स्वयं इसका पालन कर रहा हूँ?" आदेश देने के बजाय पहले ध्यान से सुनें।'
      }
    ],
    relatedConcepts: [
      { id: 'dharma', labelEn: 'Dharma (Moral Order)', labelHi: 'धर्म', sanskrit: 'धर्मः', description: 'The foundation of ethical guidance.', descriptionHi: 'सत्य और न्याय की मर्यादा।', href: '/concepts' },
      { id: 'seva', labelEn: 'Seva (Selfless Service)', labelHi: 'सेवा', sanskrit: 'सेवा', description: 'Action performed without demanding praise.', descriptionHi: 'अहंकार-रहित परोपकार।', href: '/concepts' },
      { id: 'karma-yoga', labelEn: 'Karma Yoga (Dedicated Action)', labelHi: 'कर्मयोग', sanskrit: 'कर्मयोगः', description: 'Action offered for the collective welfare.', descriptionHi: 'ईश्वरार्पण बुद्धि से लोक-कल्याण का कार्य।', href: '/concepts' }
    ],
    relatedScriptures: [
      { id: 'bhagavadgita', title: 'Bhagavad Gita', titleHi: 'भगवद्गीता', titleSanskrit: 'श्रीमद्भगवद्गीता', description: 'Chapter 3 provides the ultimate definition of Lokasangraha.', descriptionHi: 'लोकसंग्रह और श्रेष्ठ आचरण पर तीसरा अध्याय।', href: '/scripture/bhagavadgita' },
      { id: 'viduraniti', title: 'Vidura Niti', titleHi: 'विदुर नीति', titleSanskrit: 'विदुरनीतिः', description: 'Principles of wise statesmanship and guarding against sycophancy.', descriptionHi: 'सच्चे नेतृत्व और चापलूसों से बचने के विदुर के नियम।', href: '/scripture/viduraniti' }
    ],
    sources: [
      { citation: 'Bhagavad Gita 3.20 and 3.21', textName: 'Bhagavad Gita', section: 'Chapter 3, Verses 20 and 21' }
    ],
    contextualNote: {
      headlineEn: 'Important Note on Corporate & Governance Compliance',
      headlineHi: 'प्रशासनिक एवं संगठनात्मक संदर्भ सूचना',
      bodyEn: 'Scriptural leadership wisdom cultivates personal integrity and empathy. It does not supersede statutory corporate governance or employment laws.',
      bodyHi: 'यह शास्त्रीय दृष्टि नेतृत्व में नैतिक ईमानदारी और करुणा जगाने के लिए है। यह प्रशासनिक या श्रम कानूनों का विकल्प नहीं है।',
      clinicalDisclaimerEn: 'If addressing toxic workplaces, harassment, or workplace mental distress, consult formal HR, legal, or workplace counseling services.',
      clinicalDisclaimerHi: 'कार्यस्थल पर प्रताड़ना या गंभीर मानसिक तनाव की स्थिति में विधिवत मानव संसाधन (HR) या कानूनी सहायता लें।'
    }
  },

  // 9. Family responsibilities
  {
    id: 'family-responsibilities',
    slug: 'family-responsibilities',
    titleEn: 'Family Responsibilities and Grihastha',
    titleHi: 'पारिवारिक दायित्व और गृहस्थ धर्म',
    sanskritSubtitle: 'मातृदेवो भव पितृदेवो भव एवं गृहस्थमाश्रित्य',
    category: 'relationships-devotion',
    categoryLabelEn: 'Family & Devotion',
    categoryLabelHi: 'परिवार और भक्ति',
    shortDescEn: 'Honoring household duties, caring for elders and children, and transforming domestic life into a sacred field of selfless yoga.',
    shortDescHi: 'माता-पिता, संतान और गृहस्थी के कर्तव्यों को बोझ नहीं, बल्कि पावन साधना और यज्ञ मानकर निभाना।',
    colorGradient: 'from-rose-600 via-pink-700 to-stone-900',
    accentColor: '#e11d48',
    searchKeywords: ['family', 'parents', 'marriage', 'children', 'household', 'responsibilities', 'grihastha', 'duty', 'परिवार', 'माता-पिता', 'गृहस्थ'],
    readingTimeMinutes: 7,
    compassionateIntro: {
      leadEn: 'Balancing the emotional, financial, and relational demands of family can often feel overwhelming and unappreciated.',
      leadHi: 'परिवार की आर्थिक, मानसिक और भावनात्मक जिम्मेदारियों को संभालते हुए कई बार थकान और अकेलापन महसूस होता है।',
      bodyEn: 'In popular imagination, spirituality is often associated with the solitary hermit in a Himalayan cave. Yet the Vedic tradition places the Grihastha (householder) at the supreme center of society: "Just as all living beings depend upon air to live, all stages of life depend upon the householder" (Manusmriti 3.77). Providing for family, showing tender patience to children, and revering aging parents is not an obstacle to spiritual realization; it is its very altar.',
      bodyHi: 'कई लोग सोचते हैं कि अध्यात्म केवल हिमालय की कंदराओं में मिलता है। किंतु वैदिक परंपरा में गृहस्थ आश्रम को सर्वोच्च सम्मान दिया गया है: "जैसे सभी प्राणी वायु के सहारे जीवित रहते हैं, वैसे ही समाज के सभी आश्रम गृहस्थ के सहारे पलते हैं।" परिवार का भरण-पोषण, बच्चों में संस्कार और वृद्ध माता-पिता की सेवा कोई सांसारिक बंधन नहीं, बल्कि साक्षात् ईश्वर की आराधना है।',
      spiritualFoundationEn: 'Your home is not a distraction from spiritual life; with love and mutual honor, your home is your mandir.',
      spiritualFoundationHi: 'आपका घर आध्यात्मिक मार्ग की बाधा नहीं है; यदि उसमें प्रेम, क्षमा और सेवा हो, तो वह स्वयं देवालय बन जाता है।'
    },
    verses: [
      {
        id: 'taittiriya-1-11-1',
        scriptureId: 'taittiriya',
        scriptureName: 'Taittiriya Upanishad',
        scriptureNameHi: 'तैत्तिरीयोपनिषद्',
        chapterNumber: 1,
        verseNumber: '11.1-2',
        referenceDisplay: 'Taittiriya Upanishad 1.11.1–2',
        libraryRef: { chapter: 1, verse: 11 },
        referenceDisplayHi: 'तैत्तिरीयोपनिषद् १.११.१–२',
        sanskritDevanagari: 'मातृदेवो भव । पितृदेवो भव ।\nआचार्यदेवो भव । अतिथिदेवो भव ।\nयान्यनवद्यानि कर्माणि तानि सेवितव्यानि । नो इतराणि ॥',
        sanskritTransliteration: "mātṛdevo bhava | pitṛdevo bhava |\nācāryadevo bhava | atithidevo bhava |\nyānyanavadyāni karmāṇi tāni sevitavyāni | no itarāṇi ||",
        literalTranslationHi: 'माता को देवता के समान पूज्य मानो। पिता को देवता के समान पूज्य मानो। आचार्य को देवता के समान पूज्य मानो। अतिथि को देवता के समान पूज्य मानो। जो दोषरहित और कल्याणकारी कर्म हैं, उन्हीं का सेवन करो; दूसरों का नहीं।',
        literalTranslationEn: 'Let your mother be to you as a deity. Let your father be to you as a deity. Let your teacher be to you as a deity. Let your guest be to you as a deity. Whatever actions are blameless and noble, those should be practiced; not others.',
        traditionalContext: {
          speaker: 'The Guru / Rishi',
          addressee: 'The graduating student (Shishya)',
          setting: 'Shikshavalli convocation address given to students stepping out into family and civic life',
          settingHi: 'शिक्षावल्ली में गुरुकुल से गृहस्थाश्रम में प्रवेश करते शिष्यों को दिया गया दीक्षांत उपदेश',
          commentaryNote: '',
          commentaryNoteHi: '',
        },
        readerHref: '/scripture/taittiriya/chapter/1'
      },
      {
        id: 'bg-3-11',
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 3,
        verseNumber: 11,
        referenceDisplay: 'Bhagavad Gita 3.11',
        referenceDisplayHi: 'भगवद्गीता ३.११',
        sanskritDevanagari: 'देवान्भावयतानेन ते देवा भावयन्तु वः ।\nपरस्परं भावयन्तः श्रेयः परमवाप्स्यथ ॥',
        sanskritTransliteration: "devānbhāvayatānena te devā bhāvayantu vaḥ |\nparasparaṁ bhāvayantaḥ śreyaḥ paramavāpsyatha ||",
        literalTranslationHi: 'इस यज्ञ (त्याग और सेवा) के द्वारा तुम देवताओं को संवर्धित करो और वे देव तुम्हें संवर्धित करें। इस प्रकार परस्पर एक-दूसरे का संवर्धन करते हुए तुम परम कल्याण को प्राप्त करोगे।',
        literalTranslationEn: 'Nourish the divine powers through this spirit of sacrifice, and may those divine powers nourish you. Nurturing one another in mutual harmony, you will attain the highest good.',
        traditionalContext: {
          speaker: 'Shri Krishna',
          addressee: 'Arjuna',
          setting: 'The cosmic cycle of mutual reciprocity and supportive community living',
          settingHi: 'परस्पर सहयोग और यज्ञीय भाव से जीने का सार्वभौमिक नियम',
          commentaryNote: 'Within the family, "parasparam bhavayantah" means a husband, wife, children, and parents cherishing each other without selfish score-keeping.',
          commentaryNoteHi: 'पारिवारिक जीवन में इसका अर्थ है बिना किसी स्वार्थी लेन-देन के एक-दूसरे के प्रति समर्पण और आदर का भाव रखना।'
        },
        readerHref: '/scripture/bhagavadgita/chapter/3/verse/11'
      }
    ],
    traditionalContextOverview: {
      titleEn: 'Grihastha Ashram: The Sacred Hub of Civilization',
      titleHi: 'गृहस्थाश्रम: समाज की धुरी और महायज्ञ',
      bodyEn: 'The householder is asked to perform the Pancha Maha Yajnas (five daily offerings: to nature, sages, ancestors, human beings, and animals). Domestic life is thus elevated from petty consumerism into a continuous, loving sanctuary of service.',
      bodyHi: 'शास्त्रों में गृहस्थ को पंचमहायज्ञों का पालन करने का निर्देश है—जिसमें प्रकृति, माता-पिता, समाज और असहाय प्राणियों की सेवा सम्मिलित है। गृहस्थ धर्म मनुष्य को स्वार्थ से उठाकर परमार्थ की ओर ले जाता है।',
      keyThemes: ['Pitri-Rina (Gratitude to Ancestors)', 'Parasparam Bhavayantah (Mutual Cherishing)', 'Seva at Home (Sacred Care)'],
      keyThemesHi: ['पितृ-ऋण (माता-पिता के प्रति कृतज्ञता)', 'परस्पर संवर्धन (आपसी सामंजस्य)', 'गृह-सेवा (त्याग और प्रेम)']
    },
    reflections: [
      {
        title: 'Re-Enchanting the Ordinary Domestic Day',
        titleHi: 'दैनिक घरेलू कार्यों को साधना बनाना',
        insight: 'Cooking a meal, wiping a counter, or holding an aging parent’s hand with love is as sacred as chanting mantras.',
        insightHi: 'प्रेमपूर्वक भोजन बनाना, घर की सफाई करना या माता-पिता का हाथ थामना किसी भी महायज्ञ से कम नहीं है।',
        contemplationPrompt: 'Where has resentment crept into your family duties lately? How can you reframe that task as an offering of love rather than a burden?',
        contemplationPromptHi: 'पारिवारिक जिम्मेदारियों में कहाँ झुंझलाहट आ रही है? आप उस कर्तव्य को बोझ के बजाय प्रेम की भेंट कैसे बना सकते हैं?',
        dailyPractice: 'Express genuine verbal gratitude to a family member today for an act they do routinely without being thanked.',
        dailyPracticeHi: 'आज परिवार के किसी सदस्य को उनके किसी नियमित कार्य के लिए हृदय से धन्यवाद कहें जिसे अक्सर अनदेखा कर दिया जाता है।'
      }
    ],
    relatedConcepts: [
      { id: 'grihastha', labelEn: 'Grihastha (Householder)', labelHi: 'गृहस्थ', sanskrit: 'गृहस्थः', description: 'The pillar stage of life supporting all others.', descriptionHi: 'समस्त समाज को आश्रय देने वाला आश्रम।', href: '/concepts' },
      { id: 'dharma', labelEn: 'Dharma (Sacred Duty)', labelHi: 'धर्म', sanskrit: 'धर्मः', description: 'Ethical living grounded in love and duty.', descriptionHi: 'कर्तव्य और मर्यादा का पालन।', href: '/concepts' },
      { id: 'seva', labelEn: 'Seva (Selfless Service)', labelHi: 'सेवा', sanskrit: 'सेवा', description: 'Loving service performed for kin and community.', descriptionHi: 'निस्वार्थ भाव से की गई देखभाल।', href: '/concepts' }
    ],
    relatedScriptures: [
      { id: 'taittiriya', title: 'Taittiriya Upanishad', titleHi: 'तैत्तिरीयोपनिषद्', titleSanskrit: 'तैत्तिरीयोपनिषत्', description: 'The beloved convocation speech honoring parents and teachers.', descriptionHi: 'मातृदेवो भव और पितृदेवो भव का दिव्य उद्घोष।', href: '/scripture/taittiriya' },
      { id: 'bhagavadgita', title: 'Bhagavad Gita', titleHi: 'भगवद्गीता', titleSanskrit: 'श्रीमद्भगवद्गीता', description: 'Sacred mutual nourishment in Chapter 3.', descriptionHi: 'पारस्परिक पोषण और सहयोग का सार्वभौमिक सिद्धांत।', href: '/scripture/bhagavadgita' }
    ],
    sources: [
      { citation: 'Taittiriya Upanishad 1.11.1–2', textName: 'Taittiriya Upanishad', section: 'Chapter 1, Anuvaka 11' },
      { citation: 'Bhagavad Gita 3.11', textName: 'Bhagavad Gita', section: 'Chapter 3, Verse 11' }
    ],
    contextualNote: {
      headlineEn: 'Important Note on Family Safety & Domestic Abuse',
      headlineHi: 'पारिवारिक सुरक्षा एवं घरेलू दुर्व्यवहार संबंधी संदर्भ सूचना',
      bodyEn: 'Scriptural teachings celebrate harmony, mutual sacrifice, and respectful domestic life. They do NOT condone domestic violence, emotional abuse, or forced servitude.',
      bodyHi: 'शास्त्र पारिवारिक प्रेम और आपसी सम्मान का संदेश देते हैं। वे किसी भी रूप में घरेलू हिंसा, मानसिक उत्पीड़न या शोषण का समर्थन नहीं करते।',
      clinicalDisclaimerEn: 'If you or your children are experiencing domestic abuse, neglect, or endangerment, contact family crisis support services or local protective authorities.',
      clinicalDisclaimerHi: 'यदि आप या आपके बच्चे घरेलू हिंसा अथवा प्रताड़ना के शिकार हैं, तो तुरंत पारिवारिक सुरक्षा हेल्पलाइन या कानूनी अधिकारियों से सहायता लें।'
    }
  },

  // 10. Relationships
  {
    id: 'relationships',
    slug: 'relationships',
    titleEn: 'Relationships and Empathy',
    titleHi: 'सम्बन्ध, सौहार्द और करुणा',
    sanskritSubtitle: 'आत्मौपम्येन सर्वत्र एवं मित्रस्य चक्षुषा समीक्षामहे',
    category: 'relationships-devotion',
    categoryLabelEn: 'Family & Devotion',
    categoryLabelHi: 'परिवार और भक्ति',
    shortDescEn: 'Cultivating deep empathy, honest communication, and mutual reverence in personal and social relationships through the eye of universal oneness.',
    shortDescHi: 'सभी में अपने समान आत्मा को देखकर संबंधों में निष्कपट प्रेम, संवेदनशीलता और क्षमा का भाव जाग्रत करना।',
    colorGradient: 'from-pink-600 via-rose-700 to-stone-900',
    accentColor: '#db2777',
    searchKeywords: ['relationships', 'friendship', 'love', 'empathy', 'compassion', 'communication', 'conflict', 'forgiveness', 'मित्रता', 'सम्बन्ध', 'प्रेम', 'करुणा', 'सौहार्द'],
    readingTimeMinutes: 7,
    compassionateIntro: {
      leadEn: 'Human connections are the deepest source of joy, yet often where we experience the sharpest misunderstandings and heartache.',
      leadHi: 'मानवीय सम्बन्ध हमारे जीवन में सबसे गहरे सुख का आधार हैं, किंतु यहीं सबसे अधिक गलतफहमियाँ और आहत भावनाएं भी जन्म लेती हैं।',
      bodyEn: 'When we perceive others as competing rivals or demanding burdens, relationships inevitably break down into transactional bargaining. The Vedic and Gita traditions teach Atmaupamya—the sacred art of seeing others through the lens of your own soul. When you recognize that the other person feels pain, fears rejection, and yearns for dignity just as you do, defensive walls dissolve into genuine understanding and grace.',
      bodyHi: 'जब हम दूसरों को प्रतिद्वंद्वी या अपने सुख का साधन समझने लगते हैं, तब सम्बंधों में खटास और तनाव आ जाता है। वेद और गीता हमें "आत्मौपम्य" का पाठ पढ़ाते हैं—अर्थात दूसरों को अपनी ही आत्मा के समान देखना। जब हम यह समझ लेते हैं कि सामने वाला भी हमारी ही तरह दुख, भय और सम्मान की चाह रखता है, तब क्रोध की जगह करुणा और अपनत्व जन्म लेता है।',
      spiritualFoundationEn: 'True love does not seek to possess or control; it sees the sacred divine presence walking alongside you in another form.',
      spiritualFoundationHi: 'सच्चा प्रेम दूसरे पर अधिकार जताना नहीं है; यह सामने वाले में भी उसी एक परमात्मा की उपस्थिति का सम्मान करना है।'
    },
    verses: [
      {
        id: 'bg-6-32',
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 6,
        verseNumber: 32,
        referenceDisplay: 'Bhagavad Gita 6.32',
        referenceDisplayHi: 'भगवद्गीता ६.३२',
        sanskritDevanagari: 'आत्मौपम्येन सर्वत्र समं पश्यति योऽर्जुन ।\nसुखं वा यदि वा दुःखं सः योगी परमो मतः ॥',
        sanskritTransliteration: "ātmaupamyena sarvatra samaṁ paśyati yo'rjuna |\nsukhaṁ vā yadi vā duḥkhaṁ saḥ yogī paramo mataḥ ||",
        literalTranslationHi: 'हे अर्जुन! जो योगी अपनी ही आत्मा की उपमा से (जैसे मुझे सुख-दुख होता है वैसे ही सबको होता है) संपूर्ण प्राणियों में समभाव से देखता है, वह परम श्रेष्ठ माना गया है।',
        literalTranslationEn: 'One who, by comparison with oneself, sees equality everywhere in all beings, whether in pleasure or in pain—that person, O Arjuna, is regarded as the highest yogi.',
        traditionalContext: {
          speaker: 'Shri Krishna',
          addressee: 'Arjuna',
          setting: 'Chapter 6 (Dhyana Yoga), describing the social consciousness of the self-realized sage',
          settingHi: 'अध्याय ६ में आत्मसाक्षात्कारी योगी की सामाजिक और मानवीय संवेदनशीलता का निरूपण',
          commentaryNote: 'Atmaupamya is the definitive Hindu foundation of empathy: treat nobody as alien, for their nervous system experiences joy and sorrow just like yours.',
          commentaryNoteHi: 'आत्मौपम्य सनातन संस्कृति में करुणा का सर्वोच्च आधार है—सभी के सुख-दुख को अपने समान महसूस करना।'
        },
        readerHref: '/scripture/bhagavadgita/chapter/6/verse/32'
      },
      {
        id: 'yajurveda-36-18',
        scriptureId: 'yajurveda',
        scriptureName: 'Yajurveda',
        scriptureNameHi: 'यजुर्वेद',
        chapterNumber: 36,
        verseNumber: 18,
        referenceDisplay: 'Yajurveda 36.18',
        referenceDisplayHi: 'यजुर्वेद ३६.१८',
        sanskritDevanagari: 'दृते॒ दृᳪह॑ मा मि॒त्रस्य॑ मा॒ चक्षु॑षा॒ सर्वा॑णि भू॒तानि॒ समी॑क्षन्ताम् ।\nमि॒त्रस्या॒हं चक्षु॑षा॒ सर्वा॑णि भू॒तानि॒ समी॑क्षे ।\nमि॒त्रस्य॒ चक्षु॑षा॒ समी॑क्षामहे ॥',
        sanskritTransliteration: 'dṛte dṛha mā mitrasya mā cakṣuṣā sarvāṇi bhūtāni samīkṣantām |\nmitrasyāhaṁ cakṣuṣā sarvāṇi bhūtāni samīkṣe |\nmitrasya cakṣuṣā samīkṣāmahe ||',
        literalTranslationHi: 'समस्त प्राणी मुझे मित्र की दृष्टि से देखें। मैं भी समस्त प्राणियों को मित्र की दृष्टि से देखूँ। हम परस्पर एक-दूसरे को मित्रता और प्रेम की दृष्टि से देखें।',
        literalTranslationEn: 'May all beings look upon me with the eye of a friend. May I look upon all beings with the eye of a friend. May we all look upon one another with the eye of friendship.',
        traditionalContext: {
          speaker: 'Vedic Rishi',
          addressee: 'Universal Collective Prayer',
          setting: 'Shanti Mantra of the Yajurveda invocations for universal societal goodwill and peace',
          settingHi: 'यजुर्वेद का शांति मंत्र—समस्त जगत में अद्वेष और पारस्परिक सौहार्द की प्रार्थना',
          commentaryNote: 'Maitri (friendship) dissolves prejudice before it can crystallize into conflict.',
          commentaryNoteHi: 'मैत्री भाव मन से कटुता और पूर्वाग्रह को समाप्त कर देता है।'
        },
        readerHref: '/scripture/yajurveda/chapter/36'
      }
    ],
    traditionalContextOverview: {
      titleEn: 'Atmaupamya and Maitri: Universal Empathy and Friendship',
      titleHi: 'आत्मौपम्य और मैत्री: सर्वत्र आत्म-दर्शन एवं सौहार्द',
      bodyEn: 'In both Vedic prayers and the Upanishads, interpersonal harmony is founded not on cold etiquette, but on seeing the same divine consciousness seated within the heart of every companion, partner, friend, and stranger.',
      bodyHi: 'सनातन परंपरा में सम्बन्ध केवल औपचारिकता नहीं हैं, बल्कि हर व्यक्ति के भीतर उसी एक परमात्मा का वास देखकर आदर और संवेदनशीलता से जीने का अभ्यास हैं।',
      keyThemes: ['Atmaupamya (Empathetic Self-Identification)', 'Maitri (Unconditional Benevolence)', 'Kshama (Wise Forgiveness)'],
      keyThemesHi: ['आत्मौपम्य (सहानुभूतिपूर्ण दृष्टि)', 'मैत्री (सच्चा सौहार्द)', 'क्षमा (विशाल हृदयता)']
    },
    reflections: [
      {
        title: 'Listening Beyond the Defensive Wall',
        titleHi: 'तर्क के पार जाकर भावना को सुनना',
        insight: 'When people react with hostility or criticism, they are usually expressing an unmet need or hidden fear. Respond to their fear, not their armor.',
        insightHi: 'जब कोई क्रोध या कटुता से बात करता है, तो वह अक्सर किसी अनकहे डर या पीड़ा से जूझ रहा होता है। उसके तीखे शब्दों के बजाय उसके भीतर की व्यथा को समझें।',
        contemplationPrompt: 'In your closest relationship, where are you still waiting for the other person to change first?',
        contemplationPromptHi: 'अपने सबसे करीबी सम्बन्ध में, क्या आप अब भी इस प्रतीक्षा में हैं कि पहले सामने वाला बदले?',
        dailyPractice: 'During a disagreement today, take a deep breath and ask: "Help me understand what this feels like from your side." Listen for 2 full minutes without defending yourself.',
        dailyPracticeHi: 'आज किसी भी मतभेद के समय कहें: "कृपया मुझे समझाएं कि आप कैसा महसूस कर रहे हैं।" बिना टोके २ मिनट ध्यान से सुनें।'
      }
    ],
    relatedConcepts: [
      { id: 'ahimsa', labelEn: 'Ahimsa (Non-Harm)', labelHi: 'अहिंसा', sanskrit: 'अहिंसा', description: 'Gentleness in speech, thought, and deed.', descriptionHi: 'वाणी और व्यवहार में निर्वैरता।', href: '/concepts' },
      { id: 'dharma', labelEn: 'Dharma (Harmonious Conduct)', labelHi: 'धर्म', sanskrit: 'धर्मः', description: 'Conduct preserving cosmic and social harmony.', descriptionHi: 'सत्य और न्याय की मर्यादा।', href: '/concepts' },
      { id: 'bhakti', labelEn: 'Bhakti (Loving Devotion)', labelHi: 'भक्ति', sanskrit: 'भक्तिः', description: 'Universal love transcending petty ego.', descriptionHi: 'अहंकार-रहित सच्चा प्रेम।', href: '/concepts' }
    ],
    relatedScriptures: [
      { id: 'bhagavadgita', title: 'Bhagavad Gita', titleHi: 'भगवद्गीता', titleSanskrit: 'श्रीमद्भगवद्गीता', description: 'Gita Chapter 6 on the supreme yogi who sees others as oneself.', descriptionHi: 'अध्याय ६ में आत्मौपम्य दृष्टि का वर्णन।', href: '/scripture/bhagavadgita' },
      { id: 'yajurveda', title: 'Yajurveda', titleHi: 'यजुर्वेद', titleSanskrit: 'यजुर्वेदः', description: 'The famous friendship prayer Mitrasya Chakshusha.', descriptionHi: 'मित्रस्य चक्षुषा समीक्षामहे का अमर शांति मंत्र।', href: '/scripture/yajurveda' }
    ],
    sources: [
      { citation: 'Bhagavad Gita 6.32', textName: 'Bhagavad Gita', section: 'Chapter 6, Verse 32' },
      { citation: 'Yajurveda 36.18', textName: 'Yajurveda', section: 'Chapter 36, Verse 18' }
    ],
    contextualNote: {
      headlineEn: 'Important Note on Healthy Boundaries and Professional Help',
      headlineHi: 'सम्बन्ध, मर्यादा एवं परामर्श संबंधी सूचना',
      bodyEn: 'Empathy and forgiveness do not mean submitting to physical violence, emotional abuse, or deceit. Dharma requires maintaining clear, compassionate personal boundaries.',
      bodyHi: 'सहानुभूति और क्षमा का अर्थ किसी के शोषण या दुर्व्यवहार को चुपचाप सहना नहीं है। धर्म अपनी मर्यादा और आत्मसम्मान की रक्षा करने का भी निर्देश देता है।',
      clinicalDisclaimerEn: 'If dealing with chronic relationship trauma, marital distress, or emotional coercion, seek licensed marriage, family, or relationship counseling.',
      clinicalDisclaimerHi: 'गंभीर मानसिक तनाव या वैवाहिक संकट की स्थिति में प्रमाणित काउंसलर या मनोवैज्ञानिक की सहायता अवश्य लें।'
    }
  },

  // 11. Devotion
  {
    id: 'devotion',
    slug: 'devotion',
    titleEn: 'Devotion and Surrender',
    titleHi: 'भक्ति और शरणागति',
    sanskritSubtitle: 'पत्रं पुष्पं फलं तोयं एवं सर्वधर्मान्परित्यज्य',
    category: 'relationships-devotion',
    categoryLabelEn: 'Family & Devotion',
    categoryLabelHi: 'परिवार और भक्ति',
    shortDescEn: 'Resting the tired ego in the boundless grace of the Divine through heartfelt love, simplicity, and complete surrender.',
    shortDescHi: 'अहंकार के बोझ को उतारकर परमात्मा के प्रेम, सरल समर्पण और शरणागति में परम विश्राम पाना।',
    colorGradient: 'from-amber-600 via-rose-700 to-slate-900',
    accentColor: '#d97706',
    searchKeywords: ['devotion', 'bhakti', 'surrender', 'faith', 'love of god', 'grace', 'prayer', 'sharanagati', 'भक्ति', 'शरणागति', 'प्रेम'],
    readingTimeMinutes: 7,
    compassionateIntro: {
      leadEn: 'When you are exhausted from trying to figure everything out on your own, devotion invites you to simply come home.',
      leadHi: 'जब बुद्धि संसार के सारे उपाय करके थक जाती है, तब भक्ति हमें परमात्मा की करुणामयी गोद में विश्राम देती है।',
      bodyEn: 'Intellectual analysis can clarify, but it cannot heal a lonely or broken heart. Bhakti is the path of supreme transcendent love (Parama-Prema-Rupa). God does not demand opulent wealth, complicated rituals, or pedantic scholarship; the Gita promises that even a simple leaf, a single flower, a wild fruit, or a palmful of water offered with pure love is received with overflowing joy by the Lord of the Universe.',
      bodyHi: 'बौद्धिक तर्क मस्तिष्क को संतुष्ट कर सकते हैं, किंतु वे हृदय की प्यास नहीं बुझा सकते। भक्ति परम प्रेम का मार्ग है। ईश्वर को किसी आडंबर, धन-दौलत या गूढ़ पांडित्य की आवश्यकता नहीं है; भगवद्गीता कहती है कि यदि कोई निष्कपट भाव से केवल एक पत्ता, एक फूल, एक फल या थोड़ा सा जल भी अर्पित कर दे, तो वह उसे सहर्ष स्वीकार करते हैं।',
      spiritualFoundationEn: 'Surrender is not defeat; it is entrusting your fragile little rowboat to the infinite ocean of divine care.',
      spiritualFoundationHi: 'शरणागति कोई पराजय नहीं है; यह अपनी छोटी सी नाव को ईश्वर के असीम अनुग्रह के हाथों सौंप देना है।'
    },
    verses: [
      {
        id: 'bg-9-26',
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 9,
        verseNumber: 26,
        referenceDisplay: 'Bhagavad Gita 9.26',
        referenceDisplayHi: 'भगवद्गीता ९.२६',
        sanskritDevanagari: 'पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति ।\nतदहं भक्त्युपहृतमश्नामि प्रयतात्मनः ॥',
        sanskritTransliteration: "patraṁ puṣpaṁ phalaṁ toyaṁ yo me bhaktyā prayacchati |\ntadahaṁ bhaktyupahṛtamaśnāmi prayatātmanaḥ ||",
        literalTranslationHi: 'जो कोई भक्त प्रेमपूर्वक मुझे एक पत्ता, फूल, फल या जल भी भेंट करता है, उस शुद्ध अंतःकरण वाले निष्काम भक्त द्वारा प्रेम से अर्पित उस उपहार को मैं साक्षात् स्वीकार करता हूँ।',
        literalTranslationEn: 'Whoever offers to Me with love even a leaf, a flower, a fruit, or water—that offering of love from the pure-hearted seeker I accept with joy.',
        traditionalContext: {
          speaker: 'Shri Krishna',
          addressee: 'Arjuna',
          setting: 'Chapter 9 (Raja Vidya Raja Guhya Yoga), revealing the extreme accessibility of the Divine',
          settingHi: 'अध्याय ९ में भक्ति की सहज सुलभता और अगाध प्रेम का वर्णन',
          commentaryNote: '',
          commentaryNoteHi: '',
        },
        readerHref: '/scripture/bhagavadgita/chapter/9/verse/26'
      },
      {
        id: 'bg-18-66',
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 18,
        verseNumber: 66,
        referenceDisplay: 'Bhagavad Gita 18.66',
        referenceDisplayHi: 'भगवद्गीता १८.६६',
        sanskritDevanagari: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज ।\nअहं त्वा सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ॥',
        sanskritTransliteration: "sarvadharmānparityajya māmekaṁ śaraṇaṁ vraja |\nahaṁ tvā sarvapāpebhyo mokṣayiṣyāmi mā śucaḥ ||",
        literalTranslationHi: 'संपूर्ण धर्मों (कर्तव्यों और आश्रयों) को मुझमें समर्पित करके केवल मेरी एक की शरण में आ जाओ। मैं तुम्हें समस्त पापों और बंधनों से मुक्त कर दूँगा; तुम शोक मत करो।',
        literalTranslationEn: 'Abandoning all external reliances and rigid doctrines, take refuge in Me alone. I will liberate you from all sorrows and sins; do not grieve.',
        traditionalContext: {
          speaker: 'Shri Krishna',
          addressee: 'Arjuna',
          setting: 'The Charama Shloka (ultimate culminating verse) of the entire Bhagavad Gita',
          settingHi: 'संपूर्ण गीता का चरम श्लोक—परम शरणागति का महावाक्य',
          commentaryNote: 'In the Vaishnava and Vedantic traditions, this is the crest-jewel of Sharanagati: unconditional reliance on God removes every residual anxiety.',
          commentaryNoteHi: 'वैष्णव और वेदांत परंपरा में यह शरणागति का शिखर है: जब जीव सब छोड़कर परमात्मा की शरण में आता है, तो भगवान उसका संपूर्ण भार उठा लेते हैं।'
        },
        readerHref: '/scripture/bhagavadgita/chapter/18/verse/66'
      }
    ],
    traditionalContextOverview: {
      titleEn: 'Sharanagati and the Nine Limbs of Bhakti (Navadha Bhakti)',
      titleHi: 'शरणागति और नवधा भक्ति का पावन मार्ग',
      bodyEn: 'Narada Bhakti Sutras define devotion as nectar (Amrita-Swarupa). Whether through hearing sacred names (Shravana), singing praise (Kirtana), or heartfelt surrender (Atma-Nivedana), Bhakti dissolves the rigid ego through sweetness rather than dry austerity.',
      bodyHi: 'नारद भक्ति सूत्र में भक्ति को "अमृतस्वरूपा" कहा गया है। नवधा भक्ति के माध्यम से साधक अपने अहंकार को शुष्क तप से नहीं, बल्कि ईश्वरीय प्रेम के माधुर्य में पिघला देता है।',
      keyThemes: ['Sharanagati (Unconditional Surrender)', 'Preman (Pure Spiritual Love)', 'Nirvyaja Kripa (Uncaused Grace)'],
      keyThemesHi: ['शरणागति (पूर्ण समर्पण)', 'परम प्रेम (ईश्वरीय अनुराग)', 'अहैतुकी कृपा (ईश्वर का अनुग्रह)']
    },
    reflections: [
      {
        title: 'Laying Down the Armor',
        titleHi: 'अहंकार का कवच उतारना',
        insight: 'You do not need to present an edited, flawless version of yourself to the Divine; bring your weary, honest heart as it is.',
        insightHi: 'ईश्वर के सम्मुख आपको कोई मुखौटा लगाने की आवश्यकता नहीं है; अपने थके हुए, सच्चे हृदय को जैसा है वैसा ही उनके चरणों में रख दें।',
        contemplationPrompt: 'What heavy burden have you been trying to carry entirely on your own shoulders today? Can you mentally lay it at the feet of the Divine?',
        contemplationPromptHi: 'ऐसा कौन सा भारी बोझ है जिसे आप अकेले खींचने की कोशिश कर रहे हैं? क्या आप उसे मन ही मन ईश्वर को समर्पित कर सकते हैं?',
        dailyPractice: 'Spend 3 minutes in silence. Whisper a simple prayer of trust: "Lord, I offer my day, my worries, and my breath into Your hands. त्वमेव सर्वं मम देव देव।"',
        dailyPracticeHi: '३ मिनट मौन होकर बैठें और सरल भाव से कहें: "हे प्रभु, मेरा जीवन और मेरी चिंताएं आपकी शरण में हैं। त्वमेव सर्वं मम देव देव।"'
      }
    ],
    relatedConcepts: [
      { id: 'bhakti', labelEn: 'Bhakti (Devotion)', labelHi: 'भक्ति', sanskrit: 'भक्तिः', description: 'Supreme selfless love directed toward the Divine.', descriptionHi: 'परमात्मा के प्रति अगाध निष्काम प्रेम।', href: '/concepts' },
      { id: 'sharanagati', labelEn: 'Sharanagati (Surrender)', labelHi: 'शरणागति', sanskrit: 'शरणागतिः', description: 'Complete trusting refuge in divine grace.', descriptionHi: 'ईश्वर की असीम करुणा में पूर्ण विश्राम।', href: '/concepts' },
      { id: 'ishvara', labelEn: 'Ishvara (Personal God)', labelHi: 'ईश्वर', sanskrit: 'ईश्वरः', description: 'The loving divine reality accessible to the human heart.', descriptionHi: 'सगुण-साकार और करुणामय परम प्रभु।', href: '/concepts' }
    ],
    relatedScriptures: [
      { id: 'bhagavadgita', title: 'Bhagavad Gita', titleHi: 'भगवद्गीता', titleSanskrit: 'श्रीमद्भगवद्गीता', description: 'Chapter 9 and Chapter 18 contain the climax of divine surrender.', descriptionHi: 'शरणागति और प्रेम भक्ति की पराकाष्ठा।', href: '/scripture/bhagavadgita' },
      { id: 'naradabhaktisutra', title: 'Narada Bhakti Sutra', titleHi: 'नारद भक्ति सूत्र', titleSanskrit: 'नारदभक्तिसूत्रम्', description: 'The classical aphorisms on the nectar of divine love.', descriptionHi: 'परम प्रेम के स्वरूप पर देवर्षि नारद के अमर सूत्र।', href: '/scripture/naradabhaktisutra' }
    ],
    sources: [
      { citation: 'Bhagavad Gita 9.26 and 18.66', textName: 'Bhagavad Gita', section: 'Chapters 9 and 18' }
    ],
    contextualNote: {
      headlineEn: 'Important Note on Healthy Faith vs. Passivity',
      headlineHi: 'सच्ची श्रद्धा बनाम अंधविश्वास संबंधी संदर्भ सूचना',
      bodyEn: 'Spiritual surrender provides profound inner strength and peace. It does NOT mean abandoning personal responsibility or adopting blind fatalism.',
      bodyHi: 'सच्ची भक्ति अंतरात्मा को असीम संबल देती है। इसका अर्थ कर्म से भागना या भाग्यवादी बनकर निष्क्रिय हो जाना नहीं है।',
      clinicalDisclaimerEn: 'Scriptural prayer is a source of hope, not an alternative to seeking professional medical or psychiatric treatment for illnesses.',
      clinicalDisclaimerHi: 'प्रार्थना आत्मिक शांति देती है, किंतु शारीरिक या मानसिक रोगों के समय उचित चिकित्सीय उपचार अवश्य कराएं।'
    }
  },

  // 11. Self-knowledge
  {
    id: 'self-knowledge',
    slug: 'self-knowledge',
    titleEn: 'Self-Knowledge and the Witness',
    titleHi: 'आत्मज्ञान और साक्षी भाव',
    sanskritSubtitle: 'तत्त्वमसि एवं प्रज्ञानं ब्रह्म एवं आत्मानं विद्धि',
    category: 'self-knowledge-purpose',
    categoryLabelEn: 'Self-Knowledge & Purpose',
    categoryLabelHi: 'आत्मज्ञान और जीवन का अर्थ',
    shortDescEn: 'Looking beyond the fleeting identities of body, career, and emotions to encounter the unchanging witness consciousness within.',
    shortDescHi: 'शरीर, पद और मन की क्षणिक उपाधियों से परे भीतर विद्यमान अमर साक्षी चेतना (आत्मन्) का बोध।',
    colorGradient: 'from-purple-800 via-indigo-900 to-stone-950',
    accentColor: '#9333ea',
    searchKeywords: ['self-knowledge', 'atman', 'who am i', 'witness', 'consciousness', 'identity', 'ego', 'advaita', 'आत्मज्ञान', 'साक्षी', 'सत्य'],
    readingTimeMinutes: 8,
    compassionateIntro: {
      leadEn: 'If you have felt tired of wearing endless masks and performing for the expectations of others, there is a sanctuary within you that has never been touched by the world.',
      leadHi: 'यदि आप समाज की अपेक्षाओं के बोझ और लगातार मुखौटे बदलने से थक चुके हैं, तो जान लें कि आपके भीतर एक ऐसा पावन धाम है जिसे संसार कभी छू भी नहीं सका।',
      bodyEn: "We spend our lives asking: \"What will people think of me?\" while completely forgetting to ask: \"Who is the 'I' that is observing all this?\" The Upanishads proclaim that you are not merely this physical frame that ages, nor are you the bundle of anxieties that passes through your brain. You are the timeless, silent seer (Drashta) in whose radiant presence thoughts arise and subside.",
      bodyHi: "हम पूरा जीवन यह सोचने में गंवा देते हैं कि लोग हमारे बारे में क्या सोचते हैं, किंतु यह कभी नहीं पूछते: \"यह सब अनुभव करने वाला 'मैं' वास्तव में कौन हूँ?\" उपनिषदों की गर्जना है कि आप केवल यह हाड़-मांस का शरीर नहीं हैं जो पुराना होता है, न ही आप वे चिंताएं हैं जो मन में आती-जाती हैं। आप वह नित्य, शांत साक्षी (दृष्टा) हैं जिसके प्रकाश में सारा जगत प्रकाशित होता है।",
      spiritualFoundationEn: 'You do not have to create your inner peace; you only have to stop identifying with the turbulence that obscures it.',
      spiritualFoundationHi: 'आपको भीतर की शांति कहीं बाहर से नहीं लानी; केवल उन तूफानों से अपनी पहचान जोड़ना छोड़ना है जो उस शांति को ढक लेते हैं।'
    },
    verses: [
      {
        id: 'chandogya-6-8-7',
        scriptureId: 'chandogya',
        scriptureName: 'Chandogya Upanishad',
        scriptureNameHi: 'छांदोग्योपनिषद्',
        chapterNumber: 6,
        verseNumber: '8.7',
        referenceDisplay: 'Chandogya Upanishad 6.8.7',
        libraryRef: { chapter: 105, verse: '6.8.7' },
        referenceDisplayHi: 'छांदोग्योपनिषद् ६.८.७',
        sanskritDevanagari: 'स य एषोऽणिमैतदात्म्यमिदं सर्वं तत्सत्यं स आत्मा तत्त्वमसि श्वेतकेतो इति ।',
        sanskritTransliteration: "sa ya eṣo'ṇimaitadātmyamidaṁ sarvaṁ tatsatyaṁ sa ātmā tattvamasi śvetaketo iti |",
        literalTranslationHi: 'वह जो यह अत्यंत सूक्ष्म सार-तत्व है, उसी से यह संपूर्ण जगत आत्मवान् है। वही सत्य है, वही आत्मा है, और हे श्वेतकेतु! तू वही है (तत् त्वम् असि)।',
        literalTranslationEn: 'That which is the subtlest essence—all this world has that for its Self. That is Truth. That is the Atman. That Thou Art (Tat Tvam Asi), O Shvetaketu!',
        traditionalContext: {
          speaker: 'Rishi Uddalaka Aruni',
          addressee: 'His son Shvetaketu',
          setting: 'The famous Mahavakya teaching on the salt dissolved in water, revealing universal omnipresent consciousness',
          settingHi: 'उद्दालक ऋषि द्वारा श्वेतकेतु को जल में घुले नमक के दृष्टांत से दिया गया महावाक्य उपदेश',
          commentaryNote: '',
          commentaryNoteHi: '',
        },
        readerHref: '/scripture/chandogya/chapter/6'
      },
      {
        id: 'bg-2-20',
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 2,
        verseNumber: 20,
        referenceDisplay: 'Bhagavad Gita 2.20',
        referenceDisplayHi: 'भगवद्गीता २.२०',
        sanskritDevanagari: 'न जायते म्रियते वा कदाचिन्\nनायं भूत्वा भविता वा न भूयः ।\nअजो नित्यः शाश्वतोऽयं पुराणो\nन हन्यते हन्यमाने शरीरे ॥',
        sanskritTransliteration: "na jāyate mriyate vā kadācin\nnāyaṁ bhūtvā bhavitā vā na bhūyaḥ |\najo nityaḥ śāśvato'yaṁ purāṇo\nna hanyate hanyamāne śarīre ||",
        literalTranslationHi: 'यह आत्मा किसी काल में भी न तो जन्म लेती है और न कभी मरती है; और न यह उत्पन्न होकर फिर होने वाली है। यह अजन्मी, नित्य, सनातन और पुरातन है; शरीर के मारे जाने पर भी इसका नाश नहीं होता।',
        literalTranslationEn: 'The Self is never born, nor does it ever die; nor having come into being does it cease to be. Unborn, eternal, permanent, and ancient, it is not slain when the body is slain.',
        traditionalContext: {
          speaker: 'Shri Krishna',
          addressee: 'Arjuna',
          setting: 'Revealing the indestructible metaphysical nature of the indwelling Atman',
          settingHi: 'कुरुक्षेत्र के मैदान में अंतःकरण की नित्य अमरता का उद्घाटन',
          commentaryNote: 'This verse directly echoes Katha Upanishad (1.2.18); it is the ultimate antidote to existential vulnerability.',
          commentaryNoteHi: 'यह श्लोक कठोपनिषद् की ऋचा से सादृश्य रखता है और मृत्यु के समस्त भय को निर्मूल कर देता है।'
        },
        readerHref: '/scripture/bhagavadgita/chapter/2/verse/20'
      }
    ],
    traditionalContextOverview: {
      titleEn: 'The Four Mahavakyas and the Neti-Neti Method',
      titleHi: 'चार महावाक्य और "नेति-नेति" का आत्म-अन्वेषण',
      bodyEn: 'Advaita Vedanta uses the method of Vivek (discernment) through "Neti, Neti" (not this, not this). Whatever you can observe—your body, sensations, memories, or mood—is an object of perception. You are the Perceiver. The subject cannot be the object.',
      bodyHi: 'अद्वैत वेदांत "नेति, नेति" (यह नहीं, यह नहीं) की विधि अपनाता है। जिस किसी को भी आप देख सकते हैं—आपका शरीर, विचार या भावनाएं—वे सब दृश्य हैं। आप उनके द्रष्टा हैं। जो देखा जा रहा है, वह देखने वाला नहीं हो सकता।',
      keyThemes: ['Sakshi Bhava (Witness Consciousness)', 'Mahavakya (Tat Tvam Asi)', 'Drig-Drishya Viveka (Seer vs. Seen)'],
      keyThemesHi: ['साक्षी भाव (तटस्थ अवलोकन)', 'महावाक्य (तत्त्वमसि)', 'दृग्-दृश्य विवेक (दृष्टा और दृश्य का भेद)']
    },
    reflections: [
      {
        title: 'Shifting from Actor to Witness',
        titleHi: 'अभिनेता से साक्षी बनने का अभ्यास',
        insight: 'Clouds cross the sky every day, some dark and stormy, some light and fluffy. The sky itself never gets wet, burned, or stained.',
        insightHi: 'आकाश में कभी काले मेघ आते हैं, कभी सुनहरी धूप। किंतु आकाश स्वयं कभी न जलता है, न भीगता है। आप वही आकाश हैं।',
        contemplationPrompt: 'Notice the thought currently running through your head. Now ask: "Who is the silent presence that is aware of that thought?"',
        contemplationPromptHi: 'अभी अपने मन में उठते विचार को देखें। फिर पूछें: "वह शांत चैतन्य कौन है जो इस विचार को जान रहा है?"',
        dailyPractice: 'During any tense moment today, take a mental step backward and silently say: "I am the awareness watching this emotion; I am not this emotion."',
        dailyPracticeHi: 'दिन में जब भी तनाव हो, एक कदम पीछे हटें और मन में कहें: "मैं इस भावना को देखने वाला साक्षी हूँ, मैं यह भावना नहीं हूँ।"'
      }
    ],
    relatedConcepts: [
      { id: 'atman', labelEn: 'Atman (Witness Consciousness)', labelHi: 'आत्मन्', sanskrit: 'आत्मन्', description: 'The indestructible conscious core of every being.', descriptionHi: 'समस्त प्राणियों में विद्यमान साक्षी चैतन्य।', href: '/concepts' },
      { id: 'brahman', labelEn: 'Brahman (Ultimate Reality)', labelHi: 'ब्रह्मन्', sanskrit: 'ब्रह्मन्', description: 'The infinite ground of all existence.', descriptionHi: 'अनंत, नित्य और सर्वव्यापी परम सत्य।', href: '/concepts' },
      { id: 'viveka', labelEn: 'Viveka (Discernment)', labelHi: 'विवेक', sanskrit: 'विवेकः', description: 'Separating the eternal truth from transient appearance.', descriptionHi: 'नित्य और अनित्य के बीच का स्पष्ट भेद।', href: '/concepts' }
    ],
    relatedScriptures: [
      { id: 'chandogya', title: 'Chandogya Upanishad', titleHi: 'छांदोग्योपनिषद्', titleSanskrit: 'छान्दोग्योपनिषत्', description: 'Contains the luminous dialogue of Tat Tvam Asi.', descriptionHi: 'तत्त्वमसि के नौ दृष्टांतों वाला अमर उपनिषद्।', href: '/scripture/chandogya' },
      { id: 'bhagavadgita', title: 'Bhagavad Gita', titleHi: 'भगवद्गीता', titleSanskrit: 'श्रीमद्भगवद्गीता', description: 'Chapter 2’s immortal verses on the unborn Self.', descriptionHi: 'आत्मा की अमरता पर दूसरा अध्याय।', href: '/scripture/bhagavadgita' }
    ],
    sources: [
      { citation: 'Chandogya Upanishad 6.8.7', textName: 'Chandogya Upanishad', section: 'Prapathaka 6, Khanda 8' },
      { citation: 'Bhagavad Gita 2.20', textName: 'Bhagavad Gita', section: 'Chapter 2, Verse 20' }
    ],
    contextualNote: {
      headlineEn: 'Important Note on Depersonalization & Dissociation',
      headlineHi: 'अहंकार-मुक्ति बनाम मनोविकार संबंधी संदर्भ सूचना',
      bodyEn: 'Spiritual witness-consciousness brings serene connection and deep compassion for life. It is fundamentally different from clinical dissociation.',
      bodyHi: 'सच्चा साक्षी भाव जीवन के प्रति गहरी करुणा और समरसता लाता है। यह किसी प्रकार के मानसिक अलगाव (Dissociation) से भिन्न है।',
      clinicalDisclaimerEn: 'If feelings of "not being real" feel terrifying, emotionally numbing, or disorienting, consult a licensed clinical mental health professional.',
      clinicalDisclaimerHi: 'यदि स्वयं से अलग होने का अनुभव भयभीत या सुन्न करने लगे, तो पेशेवर मनोचिकित्सक से परामर्श लें।'
    }
  },

  // 12. Meaning of life
  {
    id: 'meaning-of-life',
    slug: 'meaning-of-life',
    titleEn: 'Meaning of Life and Moksha',
    titleHi: 'जीवन का अर्थ और मोक्ष',
    sanskritSubtitle: 'असतो मा सद्गमय एवं धर्मार्थकाममोक्षाणाम्',
    category: 'self-knowledge-purpose',
    categoryLabelEn: 'Self-Knowledge & Purpose',
    categoryLabelHi: 'आत्मज्ञान और जीवन का अर्थ',
    shortDescEn: 'Integrating the four aims of human life (Purusharthas) and yearning for the ultimate awakening into freedom.',
    shortDescHi: 'धर्म, अर्थ, काम और मोक्ष के संतुलन से जीवन को सार्थकता देना और परम सत्य की ओर बढ़ना।',
    colorGradient: 'from-amber-600 via-purple-800 to-stone-950',
    accentColor: '#d97706',
    searchKeywords: ['meaning of life', 'purpose', 'moksha', 'purushartha', 'why are we here', 'liberation', 'dharma', 'truth', 'जीवन का अर्थ', 'मोक्ष', 'उद्देश्य'],
    readingTimeMinutes: 8,
    compassionateIntro: {
      leadEn: 'If you have achieved worldly goals only to find an unexpected emptiness waiting on the other side, take heart.',
      leadHi: 'यदि आपने सांसारिक सफलताएं पा ली हैं फिर भी भीतर एक अनबुझी प्यास और खालीपन शेष है, तो निराश न हों।',
      bodyEn: 'That holy restlessness is not your enemy; it is the soul’s reminder that finite things cannot satisfy an infinite consciousness. Sanatana Dharma honors the full richness of human living through the Purusharthas: righteous duty (Dharma), honest prosperity (Artha), and joyful love (Kama). Yet it crowns them all with Moksha: the ultimate awakening from the dream of separateness into boundless freedom, truth, and light.',
      bodyHi: 'यह आंतरिक छटपटाहट कोई दोष नहीं है; यह इस बात का प्रमाण है कि नश्वर वस्तुएं कभी अनंत चेतना को तृप्त नहीं कर सकतीं। सनातन धर्म जीवन के चारों आयामों (पुरुषार्थों) का सम्मान करता है: न्यायपूर्ण कर्तव्य (धर्म), ईमानदार समृद्धि (अर्थ) और सुरुचिपूर्ण सुख (काम)। किंतु वह इन सबका मुकुट "मोक्ष" को बनाता है—यानी समस्त सीमाओं से परे अमर स्वतंत्रता और परमानंद की प्राप्ति।',
      spiritualFoundationEn: 'You are not here merely to pay bills, collect possessions, and vanish; you are a spark of the Divine on an adventure of remembrance.',
      spiritualFoundationHi: 'आप यहाँ केवल सांसारिक दौड़ में भाग लेने नहीं आए हैं; आप परमात्मा की वह ज्योति हैं जो अपनी ही अमर पहचान को खोजने निकली है।'
    },
    verses: [
      {
        id: 'brihadaranyaka-1-3-28',
        scriptureId: 'brihadaranyaka',
        scriptureName: 'Brihadaranyaka Upanishad',
        scriptureNameHi: 'बृहदारण्यकोपनिषद्',
        chapterNumber: 1,
        verseNumber: '3.28',
        referenceDisplay: 'Brihadaranyaka Upanishad 1.3.28',
        libraryRef: { chapter: 3, verse: '1.3.28' },
        referenceDisplayHi: 'बृहदारण्यकोपनिषद् १.३.२८',
        sanskritDevanagari: 'असतो मा सद्गमय ।\nतमसो मा ज्योतिर्गमय ।\nमृत्योर्माऽमृतं गमय ॥\n',
        sanskritTransliteration: "asato mā sadgamaya |\ntamaso mā jyotirgamaya |\nmṛtyormā'mṛtaṁ gamaya ||\nom śāntiḥ śāntiḥ śāntiḥ ||",
        literalTranslationHi: 'मुझे असत्य से सत्य की ओर ले चलो। मुझे अंधकार (अज्ञान) से प्रकाश (ज्ञान) की ओर ले चलो। मुझे मृत्यु (नश्वरता) से अमरता की ओर ले चलो। ॐ शांति, शांति, शांति।',
        literalTranslationEn: 'Lead me from the unreal to the Real. Lead me from darkness to Light. Lead me from death to Immortality. Om Peace, Peace, Peace.',
        traditionalContext: {
          speaker: 'The Vedic Seer / Aspirant',
          addressee: 'The Supreme Divine',
          setting: 'Pavamana Abhyaroha mantra chanted during the sacred Somayaga',
          settingHi: 'पवमान अभ्यारोह मंत्र जो संपूर्ण मानव जीवन की सर्वोच्च आध्यात्मिक अभीप्सा है',
          commentaryNote: '',
          commentaryNoteHi: '',
        },
        readerHref: '/scripture/brihadaranyaka/chapter/3'
      },
      {
        id: 'isha-1',
        scriptureId: 'ishavasya',
        scriptureName: 'Isha Upanishad',
        scriptureNameHi: 'ईशावास्योपनिषद्',
        chapterNumber: 1,
        verseNumber: 1,
        referenceDisplay: 'Isha Upanishad 1',
        referenceDisplayHi: 'ईशावास्योपनिषद् १',
        sanskritDevanagari: 'ईशावास्यमिदं सर्वं यत्किञ्च जगत्यां जगत् ।\nतेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम् ॥',
        sanskritTransliteration: "īśāvāsyamidaṁ sarvaṁ yatkiñca jagatyāṁ jagat |\ntena tyaktena bhuñjīthā mā gṛdhaḥ kasyasviddhanam ||",
        literalTranslationHi: 'इस परिवर्तनशील संसार में जो कुछ भी गतिशील है, वह सब ईश्वर से व्याप्त है। इसलिए त्यागभाव से उसका उपभोग करो; किसी के भी धन या सुख की लालसा मत करो।',
        literalTranslationEn: 'All this, whatever moves in this changing universe, is enveloped by the Divine. Therefore, enjoy through renunciation and detachment; do not covet anyone’s wealth.',
        traditionalContext: {
          speaker: 'The Vedic Sage',
          addressee: 'All humanity',
          setting: 'Opening proclamation of the Shukla Yajurveda Samhita',
          settingHi: 'शुक्ल यजुर्वेद का प्रथम और सबसे प्रसिद्ध उपनिषदिक उद्घोष',
          commentaryNote: '',
          commentaryNoteHi: '',
        },
        readerHref: '/scripture/ishavasya/chapter/1'
      }
    ],
    traditionalContextOverview: {
      titleEn: 'The Four Purusharthas: An Integrated Architecture of Meaning',
      titleHi: 'चार पुरुषार्थ: सार्थक जीवन का वैदिक ढांचा',
      bodyEn: 'Vedic culture does not pit spirituality against worldly living. It lays out the fourfold balanced life: Dharma (ethical grounding), Artha (honest prosperity), Kama (aesthetic joy and love), all aligned to serve Moksha (liberation). Living with this balance makes every ordinary day purposeful.',
      bodyHi: 'वैदिक दृष्टि भौतिक जीवन और अध्यात्म को विरोधी नहीं मानती। वह चार पुरुषार्थों का संतुलन सिखाती है: धर्म, अर्थ, काम और मोक्ष। जब अर्थ और काम धर्म की नींव पर टिकते हैं, तो वे जीवन को मोक्ष के आनंद की ओर ले जाते हैं।',
      keyThemes: ['Chatur-Varga (Fourfold Aims)', 'Ishavasyam (Divinity in All Things)', 'Moksha (Ultimate Freedom)'],
      keyThemesHi: ['चतुर्वर्ग पुरुषार्थ (धर्म, अर्थ, काम, मोक्ष)', 'ईशावास्यम् (सर्वत्र ईश्वरीय उपस्थिति)', 'मोक्ष (परम मुक्ति)']
    },
    reflections: [
      {
        title: 'Enjoying the World with Open Palms',
        titleHi: 'त्यागपूर्वक आनंद लेने की कला',
        insight: 'When you grasp sand tightly in your fist, it slips away. When your palm is open and relaxed, the sand rests peacefully.',
        insightHi: 'जब आप मुट्ठी भींचकर वस्तुओं को पकड़ना चाहते हैं, तो वे फिसल जाती हैं। खुली हथेली में ही जीवन का सच्चा आनंद ठहरता है।',
        contemplationPrompt: 'If you looked back on your life from its final chapter, what will have mattered most: the things you accumulated, or the love, wisdom, and peace you embodied?',
        contemplationPromptHi: 'जीवन के अंतिम पड़ाव पर आपके लिए क्या अधिक मूल्यवान होगा: वे वस्तुएं जो आपने इकट्ठी कीं, या वह प्रेम, शांति और विवेक जो आपने जिया?',
        dailyPractice: 'Begin each morning by reciting the sacred aspiration: "Lead me from the unreal to the Real, from darkness to Light, from death to Immortality."',
        dailyPracticeHi: 'प्रत्येक प्रातः इस पावन प्रार्थना से दिन का आरंभ करें: "असतो मा सद्गमय, तमसो मा ज्योतिर्गमय, मृत्योर्माऽमृतं गमय।"'
      }
    ],
    relatedConcepts: [
      { id: 'moksha', labelEn: 'Moksha (Liberation)', labelHi: 'मोक्ष', sanskrit: 'मोक्षः', description: 'The ultimate freedom and awakening of consciousness.', descriptionHi: 'संसार-चक्र और अविद्या से अंतिम मुक्ति।', href: '/concepts' },
      { id: 'dharma', labelEn: 'Dharma (Righteous Living)', labelHi: 'धर्म', sanskrit: 'धर्मः', description: 'The foundation for all prosperity and joy.', descriptionHi: 'समस्त जीवन का नैतिक आधार।', href: '/concepts' },
      { id: 'brahman', labelEn: 'Brahman (Infinite Reality)', labelHi: 'ब्रह्मन्', sanskrit: 'ब्रह्मन्', description: 'The one supreme existence enveloping all.', descriptionHi: 'सबमें व्याप्त परब्रह्म।', href: '/concepts' }
    ],
    relatedScriptures: [
      { id: 'ishavasya', title: 'Isha Upanishad', titleHi: 'ईशावास्योपनिषद्', titleSanskrit: 'ईशावास्योपनिषत्', description: 'The supreme manual of living detached in a sacred world.', descriptionHi: 'संसार में ईश्वर का दर्शन करते हुए जीने का मार्ग।', href: '/scripture/ishavasya' },
      { id: 'brihadaranyaka', title: 'Brihadaranyaka Upanishad', titleHi: 'बृहदारण्यकोपनिषद्', titleSanskrit: 'बृहदारण्यकोपनिषत्', description: 'Contains the immortal Pavamana prayer: Asato Ma Sadgamaya.', descriptionHi: 'असतो मा सद्गमय का विश्व-विख्यात अमर उद्घोष।', href: '/scripture/brihadaranyaka' }
    ],
    sources: [
      { citation: 'Brihadaranyaka Upanishad 1.3.28', textName: 'Brihadaranyaka Upanishad', section: 'Chapter 1, Brahmana 3, Verse 28' },
      { citation: 'Isha Upanishad 1', textName: 'Isha Upanishad', section: 'Verse 1' }
    ],
    contextualNote: {
      headlineEn: 'Important Note Regarding Existential Crisis & Hopelessness',
      headlineHi: 'अस्तित्वगत संकट एवं निराशा संबंधी संदर्भ सूचना',
      bodyEn: 'Contemplation on the ultimate meaning of life is a noble spiritual pursuit. However, feelings of pervasive meaninglessness, worthlessness, or profound emptiness may also accompany depressive disorders.',
      bodyHi: 'जीवन के परम अर्थ का चिंतन एक उदात्त साधना है। किंतु यदि यह निरंतर निराशा, शून्यता या जीने की इच्छा समाप्त होने के रूप में प्रकट हो, तो यह अवसाद का लक्षण हो सकता है।',
      clinicalDisclaimerEn: 'If you or someone you care about is experiencing persistent suicidal thoughts, severe depression, or hopelessness, please contact a crisis line right away. In India, Tele-MANAS is a free 24×7 helpline at 14416 (or 1-800-891-4416); elsewhere, call your local emergency number or crisis line.',
      clinicalDisclaimerHi: 'यदि आपके मन में जीवन समाप्त करने के विचार आ रहे हैं या गहरा अंधकार महसूस हो रहा है, तो कृपया तुरंत संकटकालीन हेल्पलाइन (KIRAN 1800-599-0019 / AASRA 91-9820466726) से संपर्क करें। भारत में Tele-MANAS (14416) एक निःशुल्क, २४×७ हेल्पलाइन है।'
    }
  },

  // 14. Uncertainty
  {
    "id": "uncertainty",
    "slug": "uncertainty",
    "titleEn": "Uncertainty",
    "titleHi": "अनिश्चितता",
    "sanskritSubtitle": "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः",
    "category": "inner-peace",
    "categoryLabelEn": "Inner Peace & Emotions",
    "categoryLabelHi": "मन की शांति और संवेग",
    "shortDescEn": "Living with not knowing: how the Gita speaks about changing conditions, doubt and a restless mind.",
    "shortDescHi": "न जानने के साथ जीना: बदलती परिस्थितियों, संशय और चंचल मन पर गीता क्या कहती है।",
    "colorGradient": "from-slate-600 via-blue-700 to-indigo-900",
    "accentColor": "#4f46e5",
    "searchKeywords": [
      "uncertainty",
      "unknown",
      "doubt",
      "change",
      "indecision",
      "future",
      "confusion",
      "अनिश्चितता",
      "संशय",
      "दुविधा"
    ],
    "readingTimeMinutes": 7,
    "compassionateIntro": {
      "leadEn": "Not knowing what comes next is one of the most ordinary human experiences, and it is allowed to be uncomfortable.",
      "leadHi": "आगे क्या होगा, यह न जानना मनुष्य के सबसे सामान्य अनुभवों में से एक है, और उसका असहज लगना स्वाभाविक है।",
      "bodyEn": "The Gita does not offer a way to remove uncertainty. It describes how conditions come and go, warns about the pull of doubt, and admits that the mind is restless. These verses may give you a way of thinking about uncertainty that is steadier, while you still plan and act.",
      "bodyHi": "गीता अनिश्चितता को मिटाने का उपाय नहीं देती। वह बताती है कि परिस्थितियाँ आती और जाती हैं, संशय के खिंचाव से सावधान करती है, और मानती है कि मन चंचल है। ये श्लोक अनिश्चितता को देखने का एक अधिक स्थिर ढंग दे सकते हैं, जबकि आप योजना बनाना और कर्म करना जारी रखते हैं।",
      "spiritualFoundationEn": "A recurring idea in these verses is endurance without hardness: to meet changing conditions as they are, without being carried away by them.",
      "spiritualFoundationHi": "इन श्लोकों में बार-बार आने वाला विचार है कठोर हुए बिना सहनशीलता: बदलती परिस्थितियों को जैसी हैं वैसी स्वीकार करना, बिना उनमें बह जाए।"
    },
    "verses": [
      {
        "id": "bg-2-14",
        "scriptureId": "bhagavadgita",
        "scriptureName": "Bhagavad Gita",
        "scriptureNameHi": "भगवद्गीता",
        "chapterNumber": 2,
        "verseNumber": 14,
        "referenceDisplay": "Bhagavad Gita 2.14",
        "referenceDisplayHi": "भगवद्गीता २.१४",
        "sanskritDevanagari": "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः ।\nआगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत ॥",
        "sanskritTransliteration": "mātrā-sparśhās tu kaunteya śhītoṣhṇa-sukha-duḥkha-dāḥ\nāgamāpāyino ’nityās tans-titikṣhasva bhārata ||",
        "literalTranslationHi": "हे कुन्तीनन्दन! इन्द्रियोंके जो विषय (जड पदार्थ) हैं, वो तो शीत (अनुकूलता) और उष्ण (प्रतिकूलता) - के द्वारा सुख और दुःख देनेवाले हैं तथा आने-जानेवाले और अनित्य हैं। हे भरतवंशोद्भव अर्जुन! उनको तुम सहन करो।",
        "literalTranslationEn": "The contact of the senses with their objects, O Arjuna, gives rise to feelings of cold and heat, pleasure and pain. They come and go, never lasting long. Endure them, O Arjuna.",
        "traditionalContext": {
          "speaker": "Shri Krishna",
          "addressee": "Arjuna",
          "setting": "Chapter 2: Krishna begins to teach Arjuna about changing conditions and the self.",
          "settingHi": "अध्याय २: कृष्ण अर्जुन को बदलती परिस्थितियों और आत्मा के विषय में समझाना आरंभ करते हैं।",
          "commentaryNote": "",
          "commentaryNoteHi": ""
        },
        "readerHref": "/scripture/bhagavadgita/chapter/2/verse/14"
      },
      {
        "id": "bg-4-40",
        "scriptureId": "bhagavadgita",
        "scriptureName": "Bhagavad Gita",
        "scriptureNameHi": "भगवद्गीता",
        "chapterNumber": 4,
        "verseNumber": 40,
        "referenceDisplay": "Bhagavad Gita 4.40",
        "referenceDisplayHi": "भगवद्गीता ४.४०",
        "sanskritDevanagari": "अज्ञश्चाश्रद्दधानश्च संशयात्मा विनश्यति ।\nनायं लोकोऽस्ति न परो न सुखं संशयात्मनः ॥",
        "sanskritTransliteration": "ajñaśh chāśhraddadhānaśh cha sanśhayātmā vinaśhyati\nnāyaṁ loko ’sti na paro na sukhaṁ sanśhayātmanaḥ ||",
        "literalTranslationHi": "विवेकहीन और श्रद्धारहित संशयात्मा मनुष्यका पतन हो जाता है। ऐसे संशयात्मा मनुष्यके लिये न यह लोक  है न परलोक है और न सुख ही है।",
        "literalTranslationEn": "The ignorant, the faithless, and the doubting one perish; for the doubting one, there is neither this world nor the one beyond, nor happiness.",
        "traditionalContext": {
          "speaker": "Shri Krishna",
          "addressee": "Arjuna",
          "setting": "Chapter 4: Krishna speaks about knowledge, faith and the cost of persistent doubt.",
          "settingHi": "अध्याय ४: कृष्ण ज्ञान, श्रद्धा और निरंतर संशय की हानि पर कहते हैं।",
          "commentaryNote": "",
          "commentaryNoteHi": ""
        },
        "readerHref": "/scripture/bhagavadgita/chapter/4/verse/40"
      },
      {
        "id": "bg-6-35",
        "scriptureId": "bhagavadgita",
        "scriptureName": "Bhagavad Gita",
        "scriptureNameHi": "भगवद्गीता",
        "chapterNumber": 6,
        "verseNumber": 35,
        "referenceDisplay": "Bhagavad Gita 6.35",
        "referenceDisplayHi": "भगवद्गीता ६.३५",
        "sanskritDevanagari": "श्री भगवानुवाच\nअसंशयं महाबाहो मनो दुर्निग्रहं चलम् ।\nअभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते ॥",
        "sanskritTransliteration": "śhrī bhagavān uvācha\nasanśhayaṁ mahā-bāho mano durnigrahaṁ chalam\nabhyāsena tu kaunteya vairāgyeṇa cha gṛihyate ||",
        "literalTranslationHi": "श्रीभगवान् बोले -- हे महाबाहो ! यह मन बड़ा चञ्चल है और इसका निग्रह करना भी बड़ा कठिन है -- यह तुम्हारा कहना बिलकुल ठीक है। परन्तु हे कुन्तीनन्दन ! अभ्यास और वैराग्यके द्वारा इसका निग्रह किया जाता है।",
        "literalTranslationEn": "The Lord said, \"The mind is indeed hard to subdue and fickle, O mighty-armed one, but, O son of Kunti, it can be brought under control through practice and the exercise of dispassion.\"",
        "traditionalContext": {
          "speaker": "Shri Krishna",
          "addressee": "Arjuna",
          "setting": "Chapter 6: Arjuna has said the mind is hard to hold, and Krishna replies.",
          "settingHi": "अध्याय ६: अर्जुन ने कहा कि मन को रोकना कठिन है, और कृष्ण उत्तर देते हैं।",
          "commentaryNote": "",
          "commentaryNoteHi": ""
        },
        "readerHref": "/scripture/bhagavadgita/chapter/6/verse/35"
      }
    ],
    "traditionalContextOverview": {
      "titleEn": "Change, doubt and practice in the Gita",
      "titleHi": "गीता में परिवर्तन, संशय और अभ्यास",
      "bodyEn": "In chapter 2, conditions such as heat and cold, pleasure and pain are described as coming and going, and the reader is asked to endure them. In chapter 4, persistent doubt is named as something that undermines a person. In chapter 6, Krishna accepts that the mind is hard to steady and names practice and non-attachment as supports. Commentators emphasise different parts of this, so read the commentary alongside the verses.",
      "bodyHi": "अध्याय २ में सर्दी-गर्मी और सुख-दुःख जैसी स्थितियों को आने-जाने वाला बताया गया है और उन्हें सहने को कहा गया है। अध्याय ४ में निरंतर संशय को व्यक्ति को गिराने वाला कहा गया है। अध्याय ६ में कृष्ण मानते हैं कि मन को स्थिर करना कठिन है और अभ्यास तथा वैराग्य को सहारा बताते हैं। टीकाकार इनके अलग-अलग पक्षों पर बल देते हैं, इसलिए श्लोकों के साथ टीका भी पढ़ें।",
      "keyThemes": [
        "Titiksha (patient endurance)",
        "Samshaya (doubt)",
        "Abhyasa and Vairagya (practice and non-attachment)"
      ],
      "keyThemesHi": [
        "तितिक्षा (धैर्यपूर्वक सहना)",
        "संशय",
        "अभ्यास और वैराग्य"
      ]
    },
    "reflections": [
      {
        "title": "What can I do now?",
        "titleHi": "अभी मैं क्या कर सकता हूँ?",
        "insight": "Uncertainty often feels larger when the whole future is held at once. The verses suggest meeting conditions as they come and returning to the next step.",
        "insightHi": "जब पूरा भविष्य एक साथ मन में रखा जाता है तो अनिश्चितता बड़ी लगती है। श्लोक सुझाते हैं कि परिस्थितियों का सामना जैसे वे आएँ वैसे करें और अगले कदम पर लौटें।",
        "contemplationPrompt": "Which part of this situation can I act on today, and which part can I only wait for?",
        "contemplationPromptHi": "इस स्थिति का कौन-सा भाग मैं आज कर सकता हूँ, और कौन-सा भाग केवल प्रतीक्षा का है?",
        "dailyPractice": "Write down one decision you are facing, then one small step you can take today. Do only that step.",
        "dailyPracticeHi": "किसी एक निर्णय को लिखें जिसका आप सामना कर रहे हैं, फिर आज उठाया जा सकने वाला एक छोटा कदम लिखें। केवल वही कदम उठाएँ।"
      }
    ],
    "relatedConcepts": [
      {
        "id": "vairagya",
        "labelEn": "Vairagya (Non-attachment)",
        "labelHi": "वैराग्य",
        "sanskrit": "वैराग्यम्",
        "description": "Loosening the grip on outcomes so that action and attention stay steady.",
        "descriptionHi": "परिणामों पर पकड़ ढीली करना ताकि कर्म और ध्यान स्थिर रहें।",
        "href": "/concepts/vairagya"
      },
      {
        "id": "yoga",
        "labelEn": "Yoga (Steadiness)",
        "labelHi": "योग",
        "sanskrit": "योगः",
        "description": "In the Gita, an evenness of mind that remains while one acts.",
        "descriptionHi": "गीता में कर्म करते हुए बनी रहने वाली मन की समता।",
        "href": "/concepts/yoga"
      }
    ],
    "relatedScriptures": [
      {
        "id": "bhagavadgita",
        "title": "Bhagavad Gita",
        "titleHi": "भगवद्गीता",
        "titleSanskrit": "श्रीमद्भगवद्गीता",
        "description": "The dialogue between Krishna and Arjuna at Kurukshetra, where each of these verses is spoken.",
        "descriptionHi": "कुरुक्षेत्र में कृष्ण और अर्जुन का संवाद, जहाँ ये श्लोक कहे गए हैं।",
        "href": "/scripture/bhagavadgita"
      }
    ],
    "sources": [
      {
        "citation": "Bhagavad Gita 2.14, 4.40 and 6.35",
        "textName": "Bhagavad Gita",
        "section": "Chapter 2, Verse 14; Chapter 4, Verse 40; Chapter 6, Verse 35"
      }
    ],
    contextualNote: {
        headlineEn: 'Important Contextual & Mental Health Note',
        headlineHi: 'शास्त्रीय एवं स्वास्थ्य संदर्भ सूचना',
        bodyEn: 'This scriptural guidance offers spiritual contemplation and philosophical clarity for everyday stress and inner unrest. It is NOT a clinical diagnosis or medical treatment.',
        bodyHi: 'यह शास्त्रीय चिंतन सामान्य जीवन के तनाव और मानसिक बेचैनी में दार्शनिक संबल प्रदान करता है। यह कोई चिकित्सीय निदान या उपचार नहीं है।',
        clinicalDisclaimerEn: 'Scripture does not replace licensed medical, psychiatric, or psychological care. If you are experiencing panic disorders, clinical depression, or prolonged severe anxiety, please consult a qualified healthcare professional.',
        clinicalDisclaimerHi: 'शास्त्र कभी भी योग्य चिकित्सक या मनोविज्ञानी की सलाह का विकल्प नहीं है। गंभीर अवसाद, पैनिक अटैक या निरंतर अत्यधिक चिंता की स्थिति में तुरंत विशेषज्ञ से संपर्क करें।'
      }
  },

  // 15. Failure and setbacks
  {
    "id": "failure-and-setbacks",
    "slug": "failure-and-setbacks",
    "titleEn": "Failure and Setbacks",
    "titleHi": "असफलता और बाधाएँ",
    "sanskritSubtitle": "सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते",
    "category": "action-duty",
    "categoryLabelEn": "Action, Duty & Decisions",
    "categoryLabelHi": "कर्म, कर्तव्य और निर्णय",
    "shortDescEn": "When effort does not bring the result you hoped for: what the Gita says about outcomes, balance and imperfect work.",
    "shortDescHi": "जब प्रयास से आशा के अनुसार फल न मिले: परिणाम, संतुलन और अपूर्ण कर्म पर गीता क्या कहती है।",
    "colorGradient": "from-amber-700 via-orange-700 to-stone-800",
    "accentColor": "#c2410c",
    "searchKeywords": [
      "failure",
      "setback",
      "disappointment",
      "rejection",
      "mistake",
      "loss",
      "result",
      "असफलता",
      "निराशा",
      "हार"
    ],
    "readingTimeMinutes": 7,
    "compassionateIntro": {
      "leadEn": "A result that falls short can hurt, even when you tried honestly.",
      "leadHi": "जब परिणाम अपेक्षा से कम रहता है तो पीड़ा होती है, भले ही आपने ईमानदारी से प्रयास किया हो।",
      "bodyEn": "The Gita does not say that results are unimportant or that you should stop caring. It separates the part you act on from the part you cannot fully control, asks for balance in success and failure, and says that every undertaking carries some imperfection. These verses may help you respond to a setback without giving up the work.",
      "bodyHi": "गीता यह नहीं कहती कि परिणाम महत्त्वहीन हैं या आप परवाह करना छोड़ दें। वह उस भाग को अलग करती है जिस पर आप कर्म करते हैं और उस भाग को जिस पर आपका पूरा नियंत्रण नहीं, सफलता और असफलता में समता माँगती है, और कहती है कि हर आरंभ में कुछ दोष रहता है। ये श्लोक किसी असफलता का उत्तर देने में सहायक हो सकते हैं, कर्म को छोड़े बिना।",
      "spiritualFoundationEn": "The central idea is that your responsibility lies in the quality of the effort, and that balance of mind is part of doing it well.",
      "spiritualFoundationHi": "केंद्रीय विचार यह है कि आपका दायित्व प्रयास की गुणवत्ता में है, और मन की समता अच्छे कर्म का ही अंग है।"
    },
    "verses": [
      {
        "id": "bg-2-47",
        "scriptureId": "bhagavadgita",
        "scriptureName": "Bhagavad Gita",
        "scriptureNameHi": "भगवद्गीता",
        "chapterNumber": 2,
        "verseNumber": 47,
        "referenceDisplay": "Bhagavad Gita 2.47",
        "referenceDisplayHi": "भगवद्गीता २.४७",
        "sanskritDevanagari": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
        "sanskritTransliteration": "karmaṇy-evādhikāras te mā phaleṣhu kadāchana\nmā karma-phala-hetur bhūr mā te saṅgo ’stvakarmaṇi ||",
        "literalTranslationHi": "कर्तव्य-कर्म करनेमें ही तेरा अधिकार है, फलोंमें कभी नहीं। अतः तू कर्मफलका हेतु भी मत बन और तेरी अकर्मण्यतामें भी आसक्ति न हो।",
        "literalTranslationEn": "You have the right to work alone, but not to the fruits of it. Do not be driven by the results of your work, nor have attachment to inaction.",
        "traditionalContext": {
          "speaker": "Shri Krishna",
          "addressee": "Arjuna",
          "setting": "Chapter 2: Krishna tells Arjuna where his responsibility lies as he faces an uncertain outcome.",
          "settingHi": "अध्याय २: कृष्ण अर्जुन को बताते हैं कि अनिश्चित परिणाम के सामने उसका दायित्व कहाँ है।",
          "commentaryNote": "",
          "commentaryNoteHi": ""
        },
        "readerHref": "/scripture/bhagavadgita/chapter/2/verse/47"
      },
      {
        "id": "bg-2-48",
        "scriptureId": "bhagavadgita",
        "scriptureName": "Bhagavad Gita",
        "scriptureNameHi": "भगवद्गीता",
        "chapterNumber": 2,
        "verseNumber": 48,
        "referenceDisplay": "Bhagavad Gita 2.48",
        "referenceDisplayHi": "भगवद्गीता २.४८",
        "sanskritDevanagari": "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ॥",
        "sanskritTransliteration": "yoga-sthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya\nsiddhy-asiddhyoḥ samo bhūtvā samatvaṁ yoga uchyate ||",
        "literalTranslationHi": "हे धनञ्जय ! तू आसक्तिका त्याग करके सिद्धि-असिद्धिमें सम होकर योगमें स्थित हुआ कर्मोंको कर; क्योंकि समत्व ही योग कहा जाता है।",
        "literalTranslationEn": "Abandoning attachment and established in Yoga, perform works, viewing success and failure with an even mind. Evenness of mind is said to be Yoga.",
        "traditionalContext": {
          "speaker": "Shri Krishna",
          "addressee": "Arjuna",
          "setting": "Chapter 2: the next verse names the balance the previous verse asks for.",
          "settingHi": "अध्याय २: अगला श्लोक उस समता का नाम बताता है जो पिछला श्लोक माँगता है।",
          "commentaryNote": "",
          "commentaryNoteHi": ""
        },
        "readerHref": "/scripture/bhagavadgita/chapter/2/verse/48"
      },
      {
        "id": "bg-18-48",
        "scriptureId": "bhagavadgita",
        "scriptureName": "Bhagavad Gita",
        "scriptureNameHi": "भगवद्गीता",
        "chapterNumber": 18,
        "verseNumber": 48,
        "referenceDisplay": "Bhagavad Gita 18.48",
        "referenceDisplayHi": "भगवद्गीता १८.४८",
        "sanskritDevanagari": "सहजं कर्म कौन्तेय सदोषमपि न त्यजेत् ।\nसर्वारम्भा हि दोषेण धूमेनाग्निरिवावृताः ॥",
        "sanskritTransliteration": "saha-jaṁ karma kaunteya sa-doṣham api na tyajet\nsarvārambhā hi doṣheṇa dhūmenāgnir ivāvṛitāḥ ||",
        "literalTranslationHi": "हे कुन्तीनन्दन ! दोषयुक्त होनेपर भी सहज कर्मका त्याग नहीं करना चाहिये; क्योंकि सम्पूर्ण कर्म धुएँसे अग्निकी तरह किसी-न-किसी दोषसे युक्त हैं।",
        "literalTranslationEn": "One should not relinquish one's work, O Arjuna, though it may be imperfect; for, all endeavors are enveloped by imperfections as fire is by smoke.",
        "traditionalContext": {
          "speaker": "Shri Krishna",
          "addressee": "Arjuna",
          "setting": "Chapter 18: in the closing chapter Krishna speaks about natural duty and its imperfection.",
          "settingHi": "अध्याय १८: अंतिम अध्याय में कृष्ण स्वाभाविक कर्म और उसके दोष की बात करते हैं।",
          "commentaryNote": "",
          "commentaryNoteHi": ""
        },
        "readerHref": "/scripture/bhagavadgita/chapter/18/verse/48"
      }
    ],
    "traditionalContextOverview": {
      "titleEn": "Effort, outcome and balance in the Gita",
      "titleHi": "गीता में प्रयास, परिणाम और समता",
      "bodyEn": "In chapter 2, the right to action but not to its fruits is stated, followed by the instruction to act with balance in success and failure, which the verse calls yoga. In chapter 18, the text adds that every undertaking is accompanied by fault, as fire is by smoke, and advises against abandoning one’s natural work for that reason. Traditions interpret these verses in different ways, particularly the idea of natural duty, so read the commentary alongside them.",
      "bodyHi": "अध्याय २ में कर्म का अधिकार और फल पर अधिकार न होना कहा गया है, उसके बाद सफलता-असफलता में समता से कर्म करने का निर्देश है जिसे श्लोक योग कहता है। अध्याय १८ में यह जोड़ा गया है कि हर आरंभ में दोष रहता है, जैसे अग्नि के साथ धुआँ, और इस कारण अपना स्वाभाविक कर्म न छोड़ने की सलाह दी गई है। परंपराएँ इन श्लोकों की, विशेषकर स्वाभाविक कर्म की, अलग-अलग व्याख्या करती हैं, इसलिए टीका भी साथ पढ़ें।",
      "keyThemes": [
        "Nishkama karma (action without clinging to results)",
        "Samatva (balance)",
        "Sahaja karma (natural work)"
      ],
      "keyThemesHi": [
        "निष्काम कर्म",
        "समत्व",
        "सहज कर्म"
      ]
    },
    "reflections": [
      {
        "title": "Learning from the result",
        "titleHi": "परिणाम से सीखना",
        "insight": "A setback can be read as a verdict on you or as information about the effort. The verses point toward the second, while staying with the work.",
        "insightHi": "असफलता को आप पर निर्णय की तरह भी पढ़ा जा सकता है और प्रयास की जानकारी की तरह भी। श्लोक दूसरे पढ़ने की ओर संकेत करते हैं, और कर्म के साथ बने रहने की।",
        "contemplationPrompt": "What did I control in this attempt, and what is one thing I would adjust next time?",
        "contemplationPromptHi": "इस प्रयास में मेरे नियंत्रण में क्या था, और अगली बार मैं कौन-सी एक बात बदलूँगा?",
        "dailyPractice": "Write down one result that disappointed you. List what you did well, one thing to change, and one thing outside your control. Then choose the next small step.",
        "dailyPracticeHi": "किसी एक निराश करने वाले परिणाम को लिखें। उसमें आपने क्या अच्छा किया, क्या बदलना है, और क्या आपके नियंत्रण से बाहर था, यह लिखें। फिर अगला छोटा कदम चुनें।"
      }
    ],
    "relatedConcepts": [
      {
        "id": "karma",
        "labelEn": "Karma (Action)",
        "labelHi": "कर्म",
        "sanskrit": "कर्म",
        "description": "Action and its results, and how the Gita asks one to relate to both.",
        "descriptionHi": "कर्म और उसके फल, और गीता उनसे कैसा संबंध रखने को कहती है।",
        "href": "/concepts/karma"
      },
      {
        "id": "yoga",
        "labelEn": "Yoga (Balance)",
        "labelHi": "योग",
        "sanskrit": "योगः",
        "description": "In the Gita, evenness in success and failure while one acts.",
        "descriptionHi": "गीता में कर्म करते हुए सफलता-असफलता में समता।",
        "href": "/concepts/yoga"
      }
    ],
    "relatedScriptures": [
      {
        "id": "bhagavadgita",
        "title": "Bhagavad Gita",
        "titleHi": "भगवद्गीता",
        "titleSanskrit": "श्रीमद्भगवद्गीता",
        "description": "The dialogue between Krishna and Arjuna at Kurukshetra, where each of these verses is spoken.",
        "descriptionHi": "कुरुक्षेत्र में कृष्ण और अर्जुन का संवाद, जहाँ ये श्लोक कहे गए हैं।",
        "href": "/scripture/bhagavadgita"
      }
    ],
    "sources": [
      {
        "citation": "Bhagavad Gita 2.47, 2.48 and 18.48",
        "textName": "Bhagavad Gita",
        "section": "Chapter 2, Verses 47 and 48; Chapter 18, Verse 48"
      }
    ],
    contextualNote: {
        headlineEn: 'Important Contextual & Mental Health Note',
        headlineHi: 'शास्त्रीय एवं स्वास्थ्य संदर्भ सूचना',
        bodyEn: 'This scriptural guidance offers spiritual contemplation and philosophical clarity for everyday stress and inner unrest. It is NOT a clinical diagnosis or medical treatment.',
        bodyHi: 'यह शास्त्रीय चिंतन सामान्य जीवन के तनाव और मानसिक बेचैनी में दार्शनिक संबल प्रदान करता है। यह कोई चिकित्सीय निदान या उपचार नहीं है।',
        clinicalDisclaimerEn: 'Scripture does not replace licensed medical, psychiatric, or psychological care. If you are experiencing panic disorders, clinical depression, or prolonged severe anxiety, please consult a qualified healthcare professional.',
        clinicalDisclaimerHi: 'शास्त्र कभी भी योग्य चिकित्सक या मनोविज्ञानी की सलाह का विकल्प नहीं है। गंभीर अवसाद, पैनिक अटैक या निरंतर अत्यधिक चिंता की स्थिति में तुरंत विशेषज्ञ से संपर्क करें।'
      }
  },
  ...lifeProblemTopics,
  ...coreTeachingTopics,
];

export function getAllWisdomTopics(): WisdomTopic[] {
  return wisdomTopics;
}

export function getWisdomTopic(slugOrId: string): WisdomTopic | undefined {
  return wisdomTopics.find((t) => t.id === slugOrId || t.slug === slugOrId);
}
