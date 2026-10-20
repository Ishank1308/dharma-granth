/**
 * Curiosity-Driven Scripture Exploration & Guided Discovery Database
 * Dharma Granth (dharmagranth.in)
 *
 * Epistemic & Pedagogical Standard:
 * 1. Curiosity opens the door. Scripture begins the conversation. Reflection deepens understanding.
 * 2. Absolute integrity of canonical Sanskrit & Devanagari verses.
 * 3. Multi-layer epistemic separation (Mūlapāṭha, Artha, Vyākhyā, Editorial Analysis).
 * 4. Child-safety, dignity, and inquiry-based learning: simplify vocabulary without diminishing
 *    philosophical depth or emotional dignity.
 */

export type InquiryAudience = 'child' | 'teen' | 'parent' | 'beginner';

export type InquiryCategory =
  | 'mind-focus'
  | 'duty-results'
  | 'fear-courage'
  | 'identity-soul'
  | 'questions-tradition'
  | 'emotions-balance'
  | 'truth-ethics'
  | 'oneness-diversity';

export interface RelatedScripturePointer {
  scriptureId: string;
  scriptureTitle: string;
  scriptureTitleHi: string;
  chapter: number;
  verse: string | number;
  labelEn: string;
  labelHi: string;
  href: string;
}

export interface InquiryItem {
  id: string;
  audience: InquiryAudience;
  category: InquiryCategory;
  categoryLabelEn: string;
  categoryLabelHi: string;
  /** Step 1: Wonder (Notice something interesting...) */
  wonderPromptEn: string;
  wonderPromptHi: string;
  /** Step 2: Ask (The natural, honest question) */
  questionEn: string;
  questionHi: string;
  /** Step 3: Scripture Anchor (Byte-for-byte canonical verse) */
  scriptureAnchor: {
    scriptureId: string;
    scriptureTitle: string;
    scriptureTitleHi: string;
    chapter: number;
    verse: string | number;
    sanskrit: string;
    transliteration: string;
    arthaHi: string;
    arthaEn: string;
    href: string;
  };
  /** Step 4: Simple Answer (Clear, warm, dignified, non-condescending) */
  simpleAnswerEn: string;
  simpleAnswerHi: string;
  /** Step 5: Guidance for Parents & Teachers (How to converse without moral shame or fear) */
  parentGuideEn: string;
  parentGuideHi: string;
  /** Step 6: Think Independently (Open inquiry prompt) */
  thinkingPromptEn: string;
  thinkingPromptHi: string;
  /** Step 6b: Gentle Contemplative Reflection */
  reflectionExerciseEn: string;
  reflectionExerciseHi: string;
  /** Step 7: The Next Question (Deepening inquiry) */
  nextDeeperQuestionEn: string;
  nextDeeperQuestionHi: string;
  /** Related canonical discoveries */
  relatedPassages: RelatedScripturePointer[];
  /** Epistemic boundary clarification */
  epistemicNote: {
    canonicalSource: string;
    interpretationLayer: 'direct-artha' | 'contextual-dialogue' | 'educational-inquiry';
  };
}

export const INQUIRY_CATEGORIES: Array<{
  id: InquiryCategory;
  labelEn: string;
  labelHi: string;
  iconName: string;
}> = [
  { id: 'mind-focus', labelEn: 'Mind & Focus', labelHi: 'मन, ध्यान व एकाग्रता', iconName: 'Brain' },
  { id: 'duty-results', labelEn: 'Duty & Results', labelHi: 'कर्तव्य, कर्म व परीक्षा', iconName: 'Compass' },
  { id: 'fear-courage', labelEn: 'Fear & Courage', labelHi: 'भय, संशय व आंतरिक बल', iconName: 'Shield' },
  { id: 'identity-soul', labelEn: 'Soul & Who Am I?', labelHi: 'आत्म-स्वरूप व सच्ची पहचान', iconName: 'Sparkles' },
  { id: 'questions-tradition', labelEn: 'Questions & Tradition', labelHi: 'तर्क, जिज्ञासा व परंपरा', iconName: 'HelpCircle' },
  { id: 'emotions-balance', labelEn: 'Emotions & Peace', labelHi: 'क्रोध, शोक व आत्म-शांति', iconName: 'HeartHandshake' },
  { id: 'truth-ethics', labelEn: 'Truth & Dharmic Life', labelHi: 'सत्य, धर्म व आचरण', iconName: 'Scale' },
  { id: 'oneness-diversity', labelEn: 'Oneness & Many Names', labelHi: 'विविधता व एकात्मता', iconName: 'Sun' },
];

export const AUDIENCE_CONFIG: Record<
  InquiryAudience,
  {
    labelEn: string;
    labelHi: string;
    taglineEn: string;
    taglineHi: string;
    emoji: string;
    descriptionEn: string;
    descriptionHi: string;
  }
> = {
  child: {
    labelEn: 'Curious Child',
    labelHi: 'बाल जिज्ञासा',
    taglineEn: 'Wonder, Big Questions & Honest Answers',
    taglineHi: 'कौतूहल, सरल भाषा और शास्त्र से पहली मुलाकात',
    emoji: '🧒',
    descriptionEn: 'Clear, gentle explanations that respect a young mind’s natural philosophical wonder without talking down.',
    descriptionHi: 'सरल और आत्मीय भाषा, जो बच्चे की स्वाभाविक जिज्ञासा का आदर करती है और बिना भय या अंधविश्वास के गहरी बात समझाती है।',
  },
  teen: {
    labelEn: 'Curious Teenager',
    labelHi: 'किशोर मन',
    taglineEn: 'Real Pressures, Identity & Independence',
    taglineHi: 'परीक्षा का तनाव, तुलना, ध्यान का भटकाव और अपनी पहचान',
    emoji: '🧑',
    descriptionEn: 'Candid reflections on comparison, academic anxiety, smartphone distraction, and whether ancient texts still matter.',
    descriptionHi: 'सोशल मीडिया, प्रतिस्पर्धा, आत्म-संदेह और परंपरा पर बेझिझक प्रश्न पूछने की खुली जगह।',
  },
  parent: {
    labelEn: 'Parent & Educator',
    labelHi: 'अभिभावक व शिक्षक',
    taglineEn: 'Explaining Without Preaching',
    taglineHi: 'बिना उपदेश दिए बच्चों से संवाद की शुरुआत',
    emoji: '👨‍👩‍👧',
    descriptionEn: 'Dialogue starters that avoid moral guilt, fear, or sectarian bias while upholding authentic Sanskrit scriptures.',
    descriptionHi: 'बच्चों के कठिन प्रश्नों (जैसे मृत्यु, ईश्वर, असफलता) पर शांत, आश्वस्त और प्रमाणिक चर्चा के बिंदु।',
  },
  beginner: {
    labelEn: 'Adult Beginner',
    labelHi: 'आरंभिक स्वाध्यायी',
    taglineEn: 'Clear Doorways into the Vast Library',
    taglineHi: '६५ ग्रंथों और १,८७,४९० श्लोकों में कहाँ से शुरुआत करें?',
    emoji: '🌿',
    descriptionEn: 'Demystifying scripture terminology, separating canonical verses from commentaries, and finding where to begin.',
    descriptionHi: 'बिना किसी पूर्वाग्रह के मूल पाठ, भाष्य और संपादकीय व्याख्या के अंतर को समझते हुए अध्ययन का क्रम।',
  },
};

export const CURIOSITY_INQUIRIES: InquiryItem[] = [
  // ==========================================
  // 1. CURIOUS CHILD INQUIRIES
  // ==========================================
  {
    id: 'child-why-is-arjuna-afraid',
    audience: 'child',
    category: 'fear-courage',
    categoryLabelEn: 'Fear & Courage',
    categoryLabelHi: 'भय व साहस',
    wonderPromptEn: 'Arjuna is the greatest archer in the world. He has won countless challenges. Yet, right before the great test, his limbs grow weak, his mouth goes dry, and a tremor runs through his frame.',
    wonderPromptHi: 'अर्जुन संसार का सबसे कुशल धनुर्धर था। उसने बड़े-बड़े युद्ध जीते थे। फिर भी युद्ध शुरू होने से ठीक पहले उसके अंग शिथिल होने लगे, मुख सूखने लगा और शरीर में कंपकंपी छा गई।',
    questionEn: 'Why was someone as strong and brave as Arjuna trembling with fear and doubt?',
    questionHi: 'अर्जुन जैसा वीर और शक्तिशाली योद्धा भी युद्ध से पहले डर और संशय से क्यों कांप रहा था?',
    scriptureAnchor: {
      scriptureId: 'bhagavadgita',
      scriptureTitle: 'Bhagavad Gita',
      scriptureTitleHi: 'श्रीमद्भगवद्गीता',
      chapter: 1,
      verse: 29,
      sanskrit: 'सीदन्ति मम गात्राणि मुखं च परिशुष्यति ।\nवेपथुश्च शरीरे मे रोमहर्षश्च जायते ॥',
      transliteration: 'sīdanti mama gātrāṇi mukhaṃ ca pariśuṣyati |\nvepathuśca śarīre me romaharṣaśca jāyate ||',
      arthaHi: 'अर्जुन बोले: हे कृष्ण! मेरे अंग शिथिल हो रहे हैं, मुख सूख रहा है, शरीर में कंपकंपी हो रही है और रोंगटे खड़े हो रहे हैं।',
      arthaEn: 'Arjuna said: My limbs grow weak and my mouth is parched; a tremor shakes my body and the hairs stand on end.',
      href: '/scripture/bhagavadgita/chapter/1/verse/29/',
    },
    simpleAnswerEn: 'Being strong on the outside does not stop feelings from happening on the inside. Arjuna was not afraid of fighting enemies; he was heartbroken because the people standing across from him were his own beloved teachers, cousins, and elders. When we care deeply about people, our choices can feel painful and overwhelming. Krishna does not laugh at Arjuna or call him a coward. Instead, Krishna listens with patience and begins the most thoughtful conversation ever held.',
    simpleAnswerHi: 'बाहर से बलवान होने का मतलब यह नहीं कि भीतर भावनाएं और घबराहट नहीं होगी। अर्जुन शत्रुओं से नहीं डर रहा था; उसका हृदय इसलिए तड़प रहा था क्योंकि सामने उसके अपने गुरु, भाई और दादा खड़े थे। जब हम अपनों के सामने कोई कठिन निर्णय लेते हैं, तो मन का विचलित होना स्वाभाविक है। श्रीकृष्ण ने अर्जुन का उपहास नहीं किया, न उसे कायर कहा; बल्कि बड़े धैर्य से उसकी बात सुनी और एक गहरा संवाद शुरू किया।',
    parentGuideEn: 'Use this verse to normalize fear and nervousness in children before an exam, sports match, or stage performance. Explain that having physical signs of nervousness (shaking hands, dry throat) does not mean a person is weak; it simply means their caring heart is alert.',
    parentGuideHi: 'परीक्षा या खेल से पहले बच्चों में होने वाली घबराहट को सामान्य बताने के लिए यह उत्तम उदाहरण है। बच्चे को बताएं कि हाथ कांपना या डर लगना कायरता नहीं है; अर्जुन जैसा वीर भी ऐसा महसूस कर चुका है।',
    thinkingPromptEn: 'Can you remember a time when your stomach felt butterflies or your hands were sweaty even though you had practiced? What helped you take the first step anyway?',
    thinkingPromptHi: 'क्या आपको कभी ऐसा समय याद है जब आपने तैयारी की थी, फिर भी मंच पर जाने से पहले पेट में अजीब सी घबराहट हुई? उस समय आपने पहला कदम कैसे उठाया?',
    reflectionExerciseEn: 'Next time you feel nervous, place one hand gently over your heart. Take three slow breaths in through your nose and out through your mouth, reminding yourself: "It is normal to feel nervous when something matters to me."',
    reflectionExerciseHi: 'जब भी घबराहट हो, अपनी हथेली को सीने पर रखें और तीन बार गहरी, शांत सांस लें। मन में कहें: "महत्वपूर्ण काम से पहले घबराहट होना स्वाभाविक है, मैं शांत होकर आगे बढ़ूँगा।"',
    nextDeeperQuestionEn: 'If fear is natural, how did Krishna help Arjuna find calm courage without forcing him?',
    nextDeeperQuestionHi: 'यदि घबराहट स्वाभाविक है, तो श्रीकृष्ण ने अर्जुन को डांटने के बजाय किस ज्ञान से शांत किया?',
    relatedPassages: [
      {
        scriptureId: 'bhagavadgita',
        scriptureTitle: 'Bhagavad Gita',
        scriptureTitleHi: 'श्रीमद्भगवद्गीता',
        chapter: 2,
        verse: 3,
        labelEn: 'Gita 2.3 · Arise and Do Not Give In to Weakness',
        labelHi: 'गीता २.३ · क्लैब्यं मा स्म गमः पार्थ',
        href: '/scripture/bhagavadgita/chapter/2/verse/3/',
      },
      {
        scriptureId: 'bhagavadgita',
        scriptureTitle: 'Bhagavad Gita',
        scriptureTitleHi: 'श्रीमद्भगवद्गीता',
        chapter: 2,
        verse: 14,
        labelEn: 'Gita 2.14 · Pleasant and Unpleasant Moments Are Passing Weather',
        labelHi: 'गीता २.१४ · मात्रास्पर्शास्तु कौन्तेय',
        href: '/scripture/bhagavadgita/chapter/2/verse/14/',
      },
    ],
    epistemicNote: {
      canonicalSource: 'Mahābhārata, Bhīṣmaparva 25.29 / Bhagavad Gītā 1.29',
      interpretationLayer: 'contextual-dialogue',
    },
  },

  {
    id: 'child-where-does-mind-go',
    audience: 'child',
    category: 'mind-focus',
    categoryLabelEn: 'Mind & Focus',
    categoryLabelHi: 'मन व एकाग्रता',
    wonderPromptEn: 'You sit down with your drawing book or homework. Within thirty seconds, without anyone asking it to, your mind is thinking about an evening game, what someone said yesterday, or a funny video.',
    wonderPromptHi: 'आप अपनी किताब या ड्राइंग लेकर बैठते हैं। कुछ ही पलों में, बिना आपकी मर्जी के, मन शाम के खेल, कल की किसी बात या किसी खिलौने की सोचने लगता है।',
    questionEn: 'Where does the mind go when it wanders, and why is it so hard to make it sit still?',
    questionHi: 'जब मन भटकता है तो वह कहाँ चला जाता है? और उसे शांत बैठाना इतना कठिन क्यों होता है?',
    scriptureAnchor: {
      scriptureId: 'bhagavadgita',
      scriptureTitle: 'Bhagavad Gita',
      scriptureTitleHi: 'श्रीमद्भगवद्गीता',
      chapter: 6,
      verse: 26,
      sanskrit: 'यतो यतो निश्चरति मनश्चञ्चलमस्थिरम् ।\nततस्ततो नियम्यैतदात्मन्येव वशं नयेत् ॥',
      transliteration: 'yato yato niścarati manaścañcalamasthiram |\ntatastato niyamyaitadātmanyeva vaśaṃ nayet ||',
      arthaHi: 'यह चंचल और अस्थिर मन जिस-जिस विषय या विचार की ओर भागे, वहाँ-वहाँ से इसे धीरे-धीरे रोककर अपनी आत्म-चेतना में वापस ले आए।',
      arthaEn: 'From whatever cause the restless and unsteady mind wanders away, from that let him restrain it and bring it back under the control of the Self alone.',
      href: '/scripture/bhagavadgita/chapter/6/verse/26/',
    },
    simpleAnswerEn: 'The mind is like a lively puppy or a curious little monkey. It does not run away because it is bad; it runs because it noticed something bright, curious, or exciting. When a puppy runs off, you do not beat it with a stick — you gently call its name and lead it back on the leash. In the same way, Krishna says: whenever you notice your mind has run off to another thought, do not get angry at yourself. Just smile, gently take its reins, and bring it back to what you are doing.',
    simpleAnswerHi: 'मन कोई बुरा शत्रु नहीं है; वह तो एक नन्हे चंचल पिल्ले या बछड़े जैसा है जो हर नई चीज को सूंघने दौड़ता है। जब पिल्ला दूर भागता है, तो हम उस पर गुस्सा नहीं करते; प्यार से उसकी रस्सी पकड़कर उसे वापस लाते हैं। श्रीकृष्ण कहते हैं: जब भी ध्यान भटके, खुद पर नाराज मत हो। बस मुस्कुराकर ध्यान को प्यार से वापस अपने काम पर ले आओ।',
    parentGuideEn: 'Avoid telling children "You never pay attention!" Reframe concentration as an athletic skill that improves with gentle repetition. This verse gives permission to wander and focuses entirely on the gentle act of returning.',
    parentGuideHi: 'बच्चे को "तुम्हारा ध्यान कभी नहीं रहता" कहने के बजाय समझाएं कि ध्यान भटकना स्वाभाविक है, लेकिन उसे बिना चिढ़े वापस लाना ही असली साधना (Practice) है।',
    thinkingPromptEn: 'If you could watch your thoughts like birds flying across an open sky, would you need to grab every bird, or could you just watch them fly past?',
    thinkingPromptHi: 'अगर आप अपने विचारों को नीले आकाश में उड़ती चिड़ियों की तरह देख सकें, तो क्या हर चिड़िया को पकड़ना जरूरी है, या बस उन्हें उड़ते हुए देखा जा सकता है?',
    reflectionExerciseEn: 'The 3-Return Game: Sit comfortably for two minutes. Count your breaths up to ten. Each time your mind jumps to something else, whisper inside "returning" and start back at one with a smile.',
    reflectionExerciseHi: '२-मिनट का खेल: शांत बैठें। १ से १० तक आती-जाती सांसें गिनें। जब भी मन किसी और बात पर भागे, मन में कहें "वापसी" और मुस्कुराकर फिर से १ से शुरू करें।',
    nextDeeperQuestionEn: 'If the mind is like a wild horse, what are the reins that keep it steady?',
    nextDeeperQuestionHi: 'अगर मन एक चंचल घोड़े जैसा है, तो वह लगाम क्या है जो उसे सही रास्ते पर रखती है?',
    relatedPassages: [
      {
        scriptureId: 'bhagavadgita',
        scriptureTitle: 'Bhagavad Gita',
        scriptureTitleHi: 'श्रीमद्भगवद्गीता',
        chapter: 6,
        verse: 35,
        labelEn: 'Gita 6.35 · The Mind is Restrained by Practice and Dispassion',
        labelHi: 'गीता ६.३५ · अभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते',
        href: '/scripture/bhagavadgita/chapter/6/verse/35/',
      },
      {
        scriptureId: 'katha',
        scriptureTitle: 'Katha Upanishad',
        scriptureTitleHi: 'कठोपनिषद्',
        chapter: 3,
        verse: 3,
        labelEn: 'Katha 3.3 · The Body as Chariot and the Mind as Reins',
        labelHi: 'कठ ३.३ · आत्मानं रथिनं विद्धि',
        href: '/scripture/katha/chapter/3/verse/3/',
      },
    ],
    epistemicNote: {
      canonicalSource: 'Bhagavad Gītā 6.26',
      interpretationLayer: 'direct-artha',
    },
  },

  {
    id: 'child-why-cant-we-control-results',
    audience: 'child',
    category: 'duty-results',
    categoryLabelEn: 'Duty & Results',
    categoryLabelHi: 'कर्म व फल',
    wonderPromptEn: 'You practice hard for an art competition. You put your best colors on the paper. But another student wins the ribbon. You did everything right, so why didn’t you get the prize?',
    wonderPromptHi: 'आप चित्रकला प्रतियोगिता के लिए बहुत मेहनत करते हैं। सबसे सुंदर रंग भरते हैं। लेकिन पुरस्कार किसी और को मिल जाता है। जब आपने पूरी मेहनत की, तो जीत आपको क्यों नहीं मिली?',
    questionEn: 'Why can’t we control the final score or prize even when we worked as hard as we could?',
    questionHi: 'जब हम पूरी ईमानदारी से मेहनत करते हैं, तब भी जीत या परिणाम हमारे हाथ में क्यों नहीं होता?',
    scriptureAnchor: {
      scriptureId: 'bhagavadgita',
      scriptureTitle: 'Bhagavad Gita',
      scriptureTitleHi: 'श्रीमद्भगवद्गीता',
      chapter: 2,
      verse: 47,
      sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
      transliteration: 'karmaṇyevādhikāraste mā phaleṣu kadācana |\nmā karmaphalaheturbhūrmā te saṅgo\'stvakarmaṇi ||',
      arthaHi: 'तुम्हारा अधिकार केवल अपने कर्म करने में है, उसके फलों में कभी नहीं। इसलिए न तो तुम फल की लालसा से कर्म करो, और न ही कर्म न करने में तुम्हारी आसक्ति हो।',
      arthaEn: 'Thy right is to work only, but never with its fruits; let not the fruits of action be thy motive, nor let thy attachment be to inaction.',
      href: '/scripture/bhagavadgita/chapter/2/verse/47/',
    },
    simpleAnswerEn: 'Think of planting a mango seed in your garden. You can dig the soil, water the seed, and protect it from goats. That is 100% in your hands. But you cannot order the rain to fall on Tuesday, or force the sun to shine only on your tree, or pull the sprout to make it grow faster. The result depends on many things in the world. When you only obsess over the trophy, you feel anxious while drawing. When you love the drawing itself, you create your masterpiece with pure joy, no matter who takes the ribbon home.',
    simpleAnswerHi: 'जैसे आप बगीचे में आम की गुठली बोते हैं। मिट्टी तैयार करना, पानी देना और पौधे की रक्षा करना पूरी तरह आपके हाथ में है। लेकिन आप बादल को आदेश नहीं दे सकते कि मंगलवार को ही बरसे, न ही पौधे को खींचकर बड़ा कर सकते हैं। परिणाम में मौसम, हवा और बहुत सी बातें जुड़ी होती हैं। अगर आप केवल मेडल की सोचेंगे तो ड्राइंग बनाते समय हाथ कांपेंगे; पर अगर आप ड्राइंग के आनंद में डूब जाएंगे तो आपकी कला अपने आप अद्भुत बनेगी।',
    parentGuideEn: 'Clarify that this verse does not mean "do not care about doing well." It means "invest your energy where you actually have power — in the practice itself." Praise effort, curiosity, and learning rather than only report-card ranks.',
    parentGuideHi: 'बच्चे को स्पष्ट करें कि इसका अर्थ यह नहीं कि अच्छा करने की इच्छा छोड़ दो। इसका अर्थ है: अपनी पूरी ताकत उस चीज में लगाओ जो तुम्हारे हाथ में है — यानी तैयारी। केवल नंबरों की तुलना करने के बजाय सीखने की खुशी को सराहें।',
    thinkingPromptEn: 'When you play a board game with family, what is more fun: playing each turn with full energy and laughter, or only being happy if you win at the end?',
    thinkingPromptHi: 'जब आप दोस्तों के साथ कोई खेल खेलते हैं, तो ज्यादा आनंद किसमें आता है: हर चाल को हंसते-खेलते पूरे मन से खेलने में, या केवल जीतने पर ही खुश होने में?',
    reflectionExerciseEn: 'The Dedicated Craft: Pick one chore or hobby today (washing your plate, drawing, or tying your shoes). Do it as beautifully and carefully as you can, simply for the joy of doing it well, without waiting for anyone to praise you.',
    reflectionExerciseHi: 'आज कोई एक छोटा काम (अपनी थाली धोना, जूते के फीते बांधना या एक चित्र बनाना) इतनी सुंदरता से करें जैसे वह कोई प्रार्थना हो — बिना किसी से शाबाशी की उम्मीद किए।',
    nextDeeperQuestionEn: 'If we do not work for prizes, what is the highest reason to do good work?',
    nextDeeperQuestionHi: 'अगर हम केवल पुरस्कार के लिए काम नहीं करते, तो अच्छे काम करने की सबसे बड़ी प्रेरणा क्या हो सकती है?',
    relatedPassages: [
      {
        scriptureId: 'bhagavadgita',
        scriptureTitle: 'Bhagavad Gita',
        scriptureTitleHi: 'श्रीमद्भगवद्गीता',
        chapter: 2,
        verse: 48,
        labelEn: 'Gita 2.48 · Equanimity in Success and Failure is Yoga',
        labelHi: 'गीता २.४८ · समत्वं योग उच्यते',
        href: '/scripture/bhagavadgita/chapter/2/verse/48/',
      },
    ],
    epistemicNote: {
      canonicalSource: 'Bhagavad Gītā 2.47',
      interpretationLayer: 'direct-artha',
    },
  },

  {
    id: 'child-why-so-many-gods-names',
    audience: 'child',
    category: 'oneness-diversity',
    categoryLabelEn: 'Diversity & Oneness',
    categoryLabelHi: 'विविधता व एकात्मता',
    wonderPromptEn: 'In one temple people ring bells for Shiva; in another they light lamps for Krishna, Ganesha, or Devi. In school, your classmates might pray in a mosque, church, or gurdwara.',
    wonderPromptHi: 'एक मंदिर में लोग शिवजी की आरती करते हैं, दूसरे में श्रीकृष्ण, गणेशजी या देवी माँ के आगे दीप जलाते हैं। स्कूल में आपके दोस्त गुरुद्वारे, मस्जिद या चर्च में प्रार्थना करते हैं।',
    questionEn: 'Why are there so many gods, images, and different names in India? Is there one god or many?',
    questionHi: 'इतने सारे देवी-देवता और अलग-अलग नाम क्यों हैं? ईश्वर एक है या अनेक?',
    scriptureAnchor: {
      scriptureId: 'rigveda',
      scriptureTitle: 'Rigveda',
      scriptureTitleHi: 'ऋग्वेद',
      chapter: 1,
      verse: '164.46',
      sanskrit: 'इन्द्रं मित्रं वरुणमग्निमाहुरथो दिव्यः स सुपर्णो गरुत्मान् ।\nएकं सद्विप्रा बहुधा वदन्त्यग्निं यमं मातरिश्वानमाहुः ॥',
      transliteration: 'indraṃ mitraṃ varuṇamagnimāhuratho divyaḥ sa suparṇo garutmān |\nekaṃ sadviprā bahudhā vadantyagniṃ yamaṃ mātariśvānamāhuḥ ||',
      arthaHi: 'ज्ञानी जन उस एक ही परम सत्य (ईश्वर) को इंद्र, मित्र, वरुण, अग्नि और दिव्य गरुड़ कहते हैं। सत्य केवल एक है, जिसे विद्वान अनेक नामों से पुकारते हैं।',
      arthaEn: 'They call Him Indra, Mitra, Varuṇa, Agni, and He is the heavenly nobly-winged Garutman. To what is One, the sages give many a title: they call It Agni, Yama, Mātariśvan.',
      href: '/scripture/rigveda/',
    },
    simpleAnswerEn: 'Think of pure water. In Hindi someone calls it "Pani"; in English "Water"; in Sanskrit "Jalam"; in Bengali "Jol". The liquid is the exact same thirst-quenching drink. In the same way, the ancient sages of the Rigveda observed thousands of years ago: the supreme light and life of this universe is One, but people love to connect with that light in different ways — just like the same mother is called "Mom" by her child, "Doctor" by her patients, and "Daughter" by her parents. Different names celebrate the beauty of the One.',
    simpleAnswerHi: 'जैसे एक ही जल को कोई पानी कहता है, कोई जल, कोई नीर और कोई वाटर। भाषा बदलने से प्यास बुझाने वाला पानी नहीं बदलता। इसी तरह ऋग्वेद के ऋषियों ने हजारों साल पहले देखा कि इस सृष्टि की मूल चेतना एक ही है; पर लोग अपने भाव से उसे शिव, कृष्ण, राम या शक्ति कहते हैं — जैसे एक ही माँ को उसका बच्चा "माँ" कहता है, अस्पताल में मरीज "डॉक्टर" कहते हैं और उसके माता-पिता "बेटी" कहते हैं।',
    parentGuideEn: 'This Rigvedic insight is the cornerstone of Indian pluralism and mutual respect. Share it to instill natural reverence for all cultures and traditions without sectarian defensiveness.',
    parentGuideHi: 'ऋग्वेद का यह मंत्र भारतीय संस्कृति की सर्वसमावेशी दृष्टि का आधार है। इसे बच्चों को सुनाकर अन्य परंपराओं के प्रति सहज आदर और अपने मूल दर्शन के प्रति गौरव का भाव जगाएं।',
    thinkingPromptEn: 'If sunlight passes through red, blue, and green glass windows, the light on the floor looks different in each spot. But where did all that light come from?',
    thinkingPromptHi: 'अगर धूप लाल, नीले और पीले कांच की खिड़की से गुजरे, तो फर्श पर अलग-अलग रंग दिखते हैं। लेकिन वह सारी रोशनी किस एक सूरज से आ रही थी?',
    reflectionExerciseEn: 'The Many-Flavors Family: Notice three people in your home or class who have completely different favorite foods or favorite games, yet you all share the same warmth and friendship.',
    reflectionExerciseHi: 'अपने घर या कक्षा में ऐसे तीन दोस्तों को देखें जिनकी पसंद, भाषा या पूजा का तरीका अलग है, फिर भी आपस में कितना गहरा प्यार और सहयोग है।',
    nextDeeperQuestionEn: 'If the supreme truth is formless, why do Indian scriptures describe so many colorful stories and sacred forms?',
    nextDeeperQuestionHi: 'अगर परम सत्य एक और निराकार है, तो शास्त्रों में इतने सुंदर रूप, कहानियां और उत्सव क्यों बनाए गए?',
    relatedPassages: [
      {
        scriptureId: 'ishavasya',
        scriptureTitle: 'Isha Upanishad',
        scriptureTitleHi: 'ईशावास्योपनिषद्',
        chapter: 1,
        verse: 1,
        labelEn: 'Isha 1 · All That Moves in This Universe is Inhabited by the One',
        labelHi: 'ईशावास्य १ · ईशा वास्यमिदं सर्वम्',
        href: '/scripture/ishavasya/chapter/1/verse/1/',
      },
    ],
    epistemicNote: {
      canonicalSource: 'Ṛgveda Saṃhitā 1.164.46',
      interpretationLayer: 'direct-artha',
    },
  },

  // ==========================================
  // 2. CURIOUS TEENAGER INQUIRIES
  // ==========================================
  {
    id: 'teen-does-detachment-mean-stop-caring',
    audience: 'teen',
    category: 'emotions-balance',
    categoryLabelEn: 'Emotions & Peace',
    categoryLabelHi: 'समत्व व अनासक्ति',
    wonderPromptEn: 'Scripture talks constantly about "vairāgya" (dispassion) and "anāsakti" (detachment). To a modern teenager, that sounds like becoming cold, emotionally dead, or abandoning your friends and dreams.',
    wonderPromptHi: 'शास्त्रों में बार-बार "वैराग्य" और "अनासक्ति" की बात आती है। पहली नजर में ऐसा लगता है मानो शास्त्र कह रहे हों कि भावनाओं को मार दो, दोस्तों से दूर हो जाओ और जीवन से मुंह मोड़ लो।',
    questionEn: 'Does spiritual detachment mean I should become numb, stop caring about people, and give up all my ambitions?',
    questionHi: 'क्या अनासक्ति का मतलब यह है कि मैं पत्थर दिल बन जाऊँ, अपनों से प्यार करना छोड़ दूँ और अपने सपनों का त्याग कर दूँ?',
    scriptureAnchor: {
      scriptureId: 'bhagavadgita',
      scriptureTitle: 'Bhagavad Gita',
      scriptureTitleHi: 'श्रीमद्भगवद्गीता',
      chapter: 3,
      verse: 25,
      sanskrit: 'सक्ताः कर्मण्यविद्वांसो यथा कुर्वन्ति भारत ।\nकुर्याद्विद्वांस्तथासक्तश्चिकीर्षुर्लोकसंग्रहम् ॥',
      transliteration: 'saktāḥ karmaṇyavidvāṃso yathā kurvanti bhārata |\nkuryādvidvāṃstathāsaktaścikīrṣurlokasaṃgraham ||',
      arthaHi: 'हे भारत! अज्ञानी मनुष्य जिस प्रकार फल की आसक्ति से कर्म करते हैं, उसी प्रकार ज्ञानी मनुष्य को अनासक्त होकर संसार के कल्याण (लोकसंग्रह) के लिए पूर्ण उत्साह से कर्म करना चाहिए।',
      arthaEn: 'As the unlearned act from attachment to action, O Bharata, so should the learned act without attachment, desiring the welfare of the world.',
      href: '/scripture/bhagavadgita/chapter/3/verse/25/',
    },
    simpleAnswerEn: 'Attachment does not mean loving deeply; attachment means holding so tightly that you suffocate what you love with fear and possessiveness. Think of a surgeon doing open-heart surgery on an injured person. The surgeon cares profoundly about saving that life — but if the surgeon’s hands shake with panic and personal obsession, they cannot operate. Detachment is not cold indifference; it is clean, calm, courageous love that acts with total dedication without being paralyzed by anxiety. Krishna acted passionately throughout the Mahabharata — he guided, defended, and loved without being bound by personal greed.',
    simpleAnswerHi: 'आसक्ति का अर्थ सच्चा प्रेम नहीं, बल्कि किसी चीज को डर और स्वार्थ से इतनी जोर से जकड़ लेना है कि उसका दम घुट जाए। एक सर्जन का उदाहरण लें जो किसी का ऑपरेशन कर रहा है। सर्जन मरीज को बचाना चाहता है; लेकिन अगर वह डर और घबराहट से कांपने लगे तो सही चीरा नहीं लगा पाएगा। अनासक्ति उदासीनता नहीं है; यह वह शांत, साहसी प्रेम है जो बिना घबराए पूरे समर्पण से काम करता है। श्रीकृष्ण ने जीवन भर संसार की रक्षा और प्रेम के लिए कर्म किए, पर वे किसी स्वार्थ के बंधन में नहीं बंधे।',
    parentGuideEn: 'Reassure young people that passion, creativity, and deep friendships are celebrated in Dharmic thought. Help them distinguish between healthy dedication (giving your best) and unhealthy attachment (needing everyone to applaud you to feel worthy).',
    parentGuideHi: 'युवाओं को समझाएं कि निष्काम कर्म का अर्थ बेमन से काम करना नहीं है, बल्कि परिणाम के भय से मुक्त होकर काम में पूरी एकाग्रता और आनंद से उतरना है।',
    thinkingPromptEn: 'When you play a competitive video game or sport, do you perform better when your head is boiling with anger and fear of losing, or when you are in "the zone" — calm, sharp, and fully present?',
    thinkingPromptHi: 'जब आप कोई खेल या मैच खेलते हैं, तो आपका खेल कब बेहतर होता है: जब दिमाग में हार का डर और गुस्सा खौलता है, या जब आप बिल्कुल शांत और वर्तमान क्षण में केंद्रित होते हैं?',
    reflectionExerciseEn: 'The Open Palm Practice: Hold your fist clenched tightly for thirty seconds until your fingers ache. Notice the strain. Now open your palm flat, letting the air touch your skin. Notice the relief. Tell yourself: "I can hold my dreams on an open palm, not in a desperate fist."',
    reflectionExerciseHi: 'मुट्ठी का अभ्यास: ३० सेकंड तक अपनी मुट्ठी पूरी ताकत से भींच कर रखें। उंगलियों का तनाव महसूस करें। फिर हथेली को धीरे से खोलें। यह खुलापन ही अनासक्ति है — सपनों को खुली हथेली पर रखें, भींची हुई मुट्ठी में नहीं।',
    nextDeeperQuestionEn: 'If detachment gives clarity in action, how do we handle situations where friends or family misunderstand our boundaries?',
    nextDeeperQuestionHi: 'अगर अनासक्ति कर्म में स्पष्टता लाती है, तो जब आसपास के लोग हमारी शांति को बेरुखी समझें तब क्या करें?',
    relatedPassages: [
      {
        scriptureId: 'bhagavadgita',
        scriptureTitle: 'Bhagavad Gita',
        scriptureTitleHi: 'श्रीमद्भगवद्गीता',
        chapter: 2,
        verse: 56,
        labelEn: 'Gita 2.56 · The Sage of Steady Wisdom Free From Passion, Fear and Anger',
        labelHi: 'गीता २.५६ · वीतरागभयक्रोधः स्थितधीर्मु निरुच्यते',
        href: '/scripture/bhagavadgita/chapter/2/verse/56/',
      },
    ],
    epistemicNote: {
      canonicalSource: 'Bhagavad Gītā 3.25',
      interpretationLayer: 'contextual-dialogue',
    },
  },

  {
    id: 'teen-smartphone-distraction-focus',
    audience: 'teen',
    category: 'mind-focus',
    categoryLabelEn: 'Mind & Focus',
    categoryLabelHi: 'मन व एकाग्रता',
    wonderPromptEn: 'You intend to study for twenty minutes. A notification buzzes. You check one message, scroll for an hour, and wake up feeling drained, foggy, and guilty.',
    wonderPromptHi: 'आप तय करते हैं कि २० मिनट ध्यान से पढ़ेंगे। फोन पर एक नोटिफिकेशन बजता है। आप एक संदेश देखते हैं, और फिर एक घंटे तक रील स्क्रॉल करते रह जाते हैं। बाद में थकान और पछतावा होता है।',
    questionEn: 'How can ancient scriptures help me focus when algorithms are engineered specifically to steal my attention?',
    questionHi: 'जब आधुनिक ऐप्स और फोन हमारे ध्यान को खींचने के लिए ही बनाए गए हैं, तो प्राचीन शास्त्र इसमें मेरी क्या मदद कर सकते हैं?',
    scriptureAnchor: {
      scriptureId: 'katha',
      scriptureTitle: 'Katha Upanishad',
      scriptureTitleHi: 'कठोपनिषद्',
      chapter: 3,
      verse: 3,
      sanskrit: 'आत्मानं रथिनं विद्धि शरीरं रथमेव तु ।\nबुद्धिं तु सारथिं विद्धि मनः प्रग्रहमेव च ॥',
      transliteration: 'ātmānaṃ rathinaṃ viddhi śarīraṃ rathameva tu |\nbuddhiṃ tu sārathiṃ viddhi manaḥ pragrahameva ca ||',
      arthaHi: 'आत्मा को रथ का स्वामी जानो, शरीर को रथ, बुद्धि (विवेक) को सारथी और मन को लगाम समझो।',
      arthaEn: 'Know the Self as the master of the chariot, and the body as the chariot itself. Know the intellect as the charioteer, and the mind as the reins.',
      href: '/scripture/katha/chapter/3/verse/3/',
    },
    simpleAnswerEn: 'The Katha Upanishad gave the world the most precise psychology manual 2,500 years ago: the Chariot Metaphor. The horses are your five senses (eyes, ears, tongue). The reins are your impulsive mind. The driver holding the reins is your discriminating intellect (Buddhi). If the driver falls asleep, the horses pull the chariot toward every bright patch of grass on the roadside. Modern apps are designed to stimulate the horses. When your intellect wakes up, you realize: "I am not the app’s product; I am the owner of the chariot." You don’t destroy the phone; you train the driver to hold the reins steady.',
    simpleAnswerHi: 'कठोपनिषद् ने २५०० वर्ष पहले मन का सबसे सटीक मानचित्र दिया: रथ का रूपक। घोड़े हमारी पांचों इंद्रियां (आंख, कान आदि) हैं। लगाम हमारा चंचल मन है। और उस लगाम को थामने वाला सारथी हमारी विवेकशील बुद्धि है। अगर सारथी सो जाए, तो घोड़े सड़क के किनारे की हर हरी घास की तरफ रथ को घसीट ले जाएंगे। सोशल मीडिया ऐप्स घोड़ों को ललचाने वाली घास हैं। जब आपकी बुद्धि जागती है, तब आपको याद आता है: "मैं किसी ऐप का उत्पाद नहीं हूँ; मैं इस जीवन-रथ का स्वामी हूँ।"',
    parentGuideEn: 'Avoid shaming teenagers about screen time. Discuss the Chariot Metaphor together as an engineering challenge: How can we help the driver (Buddhi) stay awake so the horses (senses) don’t crash the cart?',
    parentGuideHi: 'फोन छीनने या डांटने के बजाय किशोरों के साथ रथ के रूपक पर वैज्ञानिक चर्चा करें: नोटिफिकेशन हमारे घोड़ों को कैसे भड़काते हैं और हम अपनी बुद्धि के सारथी को कैसे सजग रख सकते हैं।',
    thinkingPromptEn: 'When you pick up your phone first thing in the morning, did you make that choice, or did an automated habit make it for you before your intellect even opened its eyes?',
    thinkingPromptHi: 'सुबह आंख खुलते ही जब आप फोन उठाते हैं, तो क्या यह आपकी बुद्धि का सोचा-समझा निर्णय था, या उंगलियों की एक यांत्रिक आदत?',
    reflectionExerciseEn: 'The Charioteer Pause: Before unlocking your phone, pause for two deep breaths and ask the driver: "What specific task am I entering this machine to accomplish right now?"',
    reflectionExerciseHi: 'सारथी का विराम: फोन अनलॉक करने से पहले दो गहरी सांसें लें और अपनी बुद्धि से पूछें: "इस समय मैं इस स्क्रीन में किस निश्चित काम के लिए प्रवेश कर रहा हूँ?"',
    nextDeeperQuestionEn: 'What does scripture say happens when the senses, mind, and intellect work together in harmony?',
    nextDeeperQuestionHi: 'जब इंद्रियां, मन और बुद्धि एक दिशा में मिलकर काम करते हैं, तब मनुष्य की क्षमता में क्या परिवर्तन आता है?',
    relatedPassages: [
      {
        scriptureId: 'katha',
        scriptureTitle: 'Katha Upanishad',
        scriptureTitleHi: 'कठोपनिषद्',
        chapter: 3,
        verse: 4,
        labelEn: 'Katha 3.4 · The Senses Are the Horses and Sense-Objects Are the Paths',
        labelHi: 'कठ ३.४ · इन्द्रियाणि हयानाहुर्विषयांस्तेषु गोचरान्',
        href: '/scripture/katha/chapter/3/verse/4/',
      },
    ],
    epistemicNote: {
      canonicalSource: 'Kaṭha Upaniṣad 3.3',
      interpretationLayer: 'direct-artha',
    },
  },

  {
    id: 'teen-is-questioning-tradition-disrespectful',
    audience: 'teen',
    category: 'questions-tradition',
    categoryLabelEn: 'Questions & Tradition',
    categoryLabelHi: 'जिज्ञासा व परंपरा',
    wonderPromptEn: 'Many teenagers are told: "Don’t ask questions about rituals or sacred books, just follow what elders say." This makes thinking minds feel like religion is blind obedience.',
    wonderPromptHi: 'कई बार युवाओं को टोक दिया जाता है: "शास्त्रों और रीति-रिवाजों पर सवाल मत उठाओ, जैसा कहा गया है वैसा मान लो।" इससे सोचने वाले मन को लगता है कि धर्म केवल अंध-अनुकरण है।',
    questionEn: 'Is questioning our religious traditions and scriptures disrespectful, or is inquiry actually part of the tradition?',
    questionHi: 'क्या परंपरा और शास्त्रों पर तर्क या प्रश्न करना पाप है, या जिज्ञासा ही भारतीय ज्ञान परंपरा की आत्मा है?',
    scriptureAnchor: {
      scriptureId: 'bhagavadgita',
      scriptureTitle: 'Bhagavad Gita',
      scriptureTitleHi: 'श्रीमद्भगवद्गीता',
      chapter: 4,
      verse: 34,
      sanskrit: 'तद्विद्धि प्रणिपातेन परिप्रश्नेन सेवया ।\nउपदेक्ष्यन्ति ते ज्ञानं ज्ञानिनस्तत्त्वदर्शिनः ॥',
      transliteration: 'tadviddhi praṇipātena paripraśnena sevayā |\nupadekṣyanti te jñānaṃ jñāninastattvadarśinaḥ ||',
      arthaHi: 'उस ज्ञान को तुम विनम्रता, गहन प्रश्नों (परिप्रश्न) और निष्कपट सेवा से जानो। वे तत्त्वदर्शी ज्ञानी तुम्हें उस ज्ञान का उपदेश देंगे।',
      arthaEn: 'Know that by all means of humble reverence, by inquiry (pariprashna), and by service, the wise who have seen the truth will instruct thee in knowledge.',
      href: '/scripture/bhagavadgita/chapter/4/verse/34/',
    },
    simpleAnswerEn: 'Inquiry is not disrespectful in Hindu philosophy; it is the fundamental engine of discovery! Almost every major Upanishad is a question: the Prashna Upanishad is six students asking six direct questions to their sage; the Kena Upanishad begins with the word "By whom?" (Kena); the Bhagavad Gita only happened because Arjuna asked tough, agonizing questions instead of blindly fighting. The Sanskrit word used in Gita 4.34 is "paripraśna" — cross-examination from every angle until truth becomes clear. What the tradition cautions against is not honest doubt, but arrogant mockery that has already decided it knows everything.',
    simpleAnswerHi: 'भारतीय दर्शन में प्रश्न उठाना कोई अपराध नहीं, बल्कि ज्ञान की पहली सीढ़ी है! उपनिषद शब्द का इतिहास ही संवाद और प्रश्नों का है। "प्रश्नोपनिषद्" में छह ऋषि-कुमार गुरु से गंभीर प्रश्न पूछते हैं; "केनोपनिषद्" का पहला शब्द ही है "किसके द्वारा प्रेरित होकर मन दौड़ता है?"; और भगवद्गीता का जन्म ही इसलिए हुआ क्योंकि अर्जुन ने आंख मूंदकर लड़ने के बजाय श्रीकृष्ण के सामने अपने सारे संशय उड़ेल दिए। गीता ४.३४ में "परिप्रश्न" (चारों ओर से गहराई से जांचना) को ज्ञान का अनिवार्य अंग कहा गया है। शास्त्र केवल उस अहंकार का विरोध करते हैं जो बिना समझे उपहास करने आता है; सच्ची जिज्ञासा का वे सदा स्वागत करते हैं।',
    parentGuideEn: 'Celebrate a teenager’s skeptical questions. When you do not know the answer, say honestly: "That is a brilliant question. Let us look into the original verses together and find out what the sages actually said."',
    parentGuideHi: 'किशोरों के तार्किक प्रश्नों पर नाराज होने के बजाय उनकी बुद्धि की सराहना करें। यदि उत्तर न पता हो, तो ईमानदारी से कहें: "तुम्हारा प्रश्न बहुत गहरा है, आओ मिलकर मूल ग्रंथ में देखें कि ऋषियों ने इस पर क्या कहा है।"',
    thinkingPromptEn: 'What is the difference between asking a question because you genuinely want to understand, and arguing just to prove someone else wrong?',
    thinkingPromptHi: 'सच जानने की नीयत से पूछे गए प्रश्न में और केवल किसी को नीचा दिखाने के लिए की गई बहस में क्या अंतर होता है?',
    reflectionExerciseEn: 'The Question Journal: Write down the single hardest, most uncomfortable question you have ever had about religion or life. Look at it with respect, not fear.',
    reflectionExerciseHi: 'जिज्ञासा डायरी: धर्म, ईश्वर या जीवन से जुड़ा अपना सबसे कठिन और अनसुलझा सवाल एक पन्ने पर लिखें। उस सवाल को किसी डर के बिना एक वैज्ञानिक की दृष्टि से देखें।',
    nextDeeperQuestionEn: 'Why do different Indian philosophical schools (like Advaita, Dvaita, and Samkhya) disagree with each other, and why were their debates celebrated?',
    nextDeeperQuestionHi: 'भारतीय दर्शन में अद्वैत, द्वैत, सांख्य जैसी अलग-अलग धाराएं आपस में शास्त्रार्थ क्यों करती थीं और इस मतभेद को ज्ञान का आभूषण क्यों माना गया?',
    relatedPassages: [
      {
        scriptureId: 'prashna',
        scriptureTitle: 'Prashna Upanishad',
        scriptureTitleHi: 'प्रश्नोपनिषद्',
        chapter: 1,
        verse: 1,
        labelEn: 'Prashna 1.1 · The Sages Approach Pippalada Seeking Truth Through Questions',
        labelHi: 'प्रश्नोपनिषद् १.१ · सुकेशा च भारद्वाजः',
        href: '/scripture/prashna/chapter/1/verse/1/',
      },
    ],
    epistemicNote: {
      canonicalSource: 'Bhagavad Gītā 4.34',
      interpretationLayer: 'contextual-dialogue',
    },
  },

  // ==========================================
  // 3. PARENT & EDUCATOR INQUIRIES
  // ==========================================
  {
    id: 'parent-how-to-explain-death-without-fear',
    audience: 'parent',
    category: 'identity-soul',
    categoryLabelEn: 'Soul & Who Am I?',
    categoryLabelHi: 'आत्म-स्वरूप व मृत्यु',
    wonderPromptEn: 'A grandparent passes away, or a child sees an injured bird in the yard. The child looks up with wide, worried eyes and asks: "Where did they go? Will you die too? Am I going to disappear?"',
    wonderPromptHi: 'घर में किसी बुजुर्ग का देहांत होता है या बच्चा रास्ते में किसी मृत पक्षी को देखता है। वह सहमी आँखों से पूछता है: "वे कहाँ चले गए? क्या आप भी चले जाओगे? क्या मैं मिट जाऊँगा?"',
    questionEn: 'How can parents explain death to children without causing nightmares, horror, or superstition?',
    questionHi: 'मृत्यु के सच को बच्चों के सामने कैसे रखें जिससे उनके मन में कोई डर, आतंक या अंधविश्वास न बैठे?',
    scriptureAnchor: {
      scriptureId: 'bhagavadgita',
      scriptureTitle: 'Bhagavad Gita',
      scriptureTitleHi: 'श्रीमद्भगवद्गीता',
      chapter: 2,
      verse: 22,
      sanskrit: 'वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरोऽपराणि ।\nतथा शरीराणि विहाय जीर्णान्यन्यानि संयाति नवानि देही ॥',
      transliteration: 'vāsāṃsi jīrṇāni yathā vihāya navāni gṛhṇāti naro\'parāṇi |\ntathā śarīrāṇi vihāya jīrṇānyanyāni saṃyāti navāni dehī ||',
      arthaHi: 'जैसे मनुष्य पुराने वस्त्रों को त्यागकर दूसरे नए वस्त्र धारण कर लेता है, वैसे ही जीवात्मा पुराने और जीर्ण शरीरों को छोड़कर नए शरीरों को प्राप्त करता है।',
      arthaEn: 'Just as a person casts off worn-out garments and puts on others that are new, so does the embodied soul cast off worn-out bodies and enter into others that are new.',
      href: '/scripture/bhagavadgita/chapter/2/verse/22/',
    },
    simpleAnswerEn: 'The Bhagavad Gita offers the most comforting, fearless metaphor in world literature: changing clothes. When your favorite shirt gets too small or worn out, you do not cry that your body is gone; you simply take off the old shirt and put on a fresh, comfortable one. The body is the coat; the conscious Self (Atman) is the person wearing the coat. The coat may wear out, but the life within cannot be cut by swords, burned by fire, or erased by time. Love and memory do not vanish; they abide in the indestructible continuum of life.',
    simpleAnswerHi: 'भगवद्गीता में मृत्यु का सबसे शांत और अभयकारी रूपक दिया गया है: पुराने कपड़े बदलना। जब आपका कोई पुराना कुर्ता छोटा या घिस जाता है, तो आप यह नहीं रोते कि आप मिट गए; आप उसे उतारकर नया पहन लेते हैं। शरीर वह वस्त्र है, और उसके भीतर की चेतना (आत्मा) वह अमर यात्री है जो वस्त्र बदलती है। शरीर थकता और बदलता है, पर आत्मा को न आग जला सकती है, न जल गला सकता है। जो प्रेम और प्रकाश उनके भीतर था, वह कभी नष्ट नहीं होता।',
    parentGuideEn: 'Never use frightening concepts of eternal torture or dark voids with children. Emphasize continuity, peaceful release of tired bodies, and the timeless nature of consciousness. Give the child permission to feel sad about missing physical presence while resting in philosophical safety.',
    parentGuideHi: 'बच्चों को यमराज के डरावने चित्रों या सजा के अंधविश्वास से कतई न डराएं। उन्हें बताएं कि थके हुए शरीर को विश्राम मिला है। शारीरिक दूरी का दुख होना स्वाभाविक है, पर आत्मा कभी नहीं मरती।',
    thinkingPromptEn: 'If you take off your winter sweater when the warm spring sun comes out, did YOU change, or did only your outer layer change?',
    thinkingPromptHi: 'जब गर्मी आने पर आप अपना ऊनी स्वेटर उतार देते हैं, तो क्या आप बदल जाते हैं, या केवल आपकी बाहरी परत बदलती है?',
    reflectionExerciseEn: 'The Gratitude Candle: Light a small clay lamp or candle together. Share three sweet memories or lessons learned from the person who has passed, whispering: "Their love and good deeds are alive in our hearts today."',
    reflectionExerciseHi: 'स्मृति दीप: एक छोटा सा दीपक जलाएं। जो परिजन अब शरीर में नहीं हैं, उनकी सिखाई कोई अच्छी बात या प्यारी याद साझा करें और कहें: "उनका प्रेम और संस्कार आज भी हमारे भीतर जीवित हैं।"',
    nextDeeperQuestionEn: 'If the soul is indestructible, why does grief still hurt so deeply, and how does the Gita teach us to process sorrow?',
    nextDeeperQuestionHi: 'यदि आत्मा अमर है, तब भी अपनों के जाने पर इतना दुख क्यों होता है और गीता इस शोक को सहने का क्या उपाय बताती है?',
    relatedPassages: [
      {
        scriptureId: 'bhagavadgita',
        scriptureTitle: 'Bhagavad Gita',
        scriptureTitleHi: 'श्रीमद्भगवद्गीता',
        chapter: 2,
        verse: 20,
        labelEn: 'Gita 2.20 · The Soul is Never Born and Never Dies',
        labelHi: 'गीता २.२० · न जायते म्रियते वा कदाचित्',
        href: '/scripture/bhagavadgita/chapter/2/verse/20/',
      },
    ],
    epistemicNote: {
      canonicalSource: 'Bhagavad Gītā 2.22',
      interpretationLayer: 'direct-artha',
    },
  },

  {
    id: 'parent-how-to-teach-discipline-without-shame',
    audience: 'parent',
    category: 'emotions-balance',
    categoryLabelEn: 'Emotions & Peace',
    categoryLabelHi: 'अनुशासन व संतुलन',
    wonderPromptEn: 'Parents often struggle between two extremes: either rigid harshness ("Do this or you are a bad child!") or total laxity that leaves a child restless and addicted to instant gratification.',
    wonderPromptHi: 'अक्सर माता-पिता दो अतियों में उलझ जाते हैं: या तो कठोर डांट-फटकार और सजा, या फिर इतनी छूट कि बच्चा पूरी तरह अनुशासनहीन और बेचैन हो जाए।',
    questionEn: 'How do Indian scriptures teach discipline (Dama & Tapas) without harsh punishments, guilt, or moral shaming?',
    questionHi: 'शास्त्रों में कठोर दंड या अपराध-बोध (Guilt) के बिना बच्चों में आत्म-अनुशासन जगाने का क्या मार्ग है?',
    scriptureAnchor: {
      scriptureId: 'bhagavadgita',
      scriptureTitle: 'Bhagavad Gita',
      scriptureTitleHi: 'श्रीमद्भगवद्गीता',
      chapter: 6,
      verse: 16,
      sanskrit: 'नात्यश्नतस्तु योगोऽस्ति न चैकान्तमनश्नतः ।\nन चाति स्वप्नशीलस्य जाग्रतो नैव चार्जुन ॥',
      transliteration: 'nātyaśnatastu yogo\'sti na caikāntamanaśnataḥ |\nna cāti svapnaśīlasya jāgrato naiva cārjuna ||',
      arthaHi: 'हे अर्जुन! यह योग न तो बहुत अधिक खाने वाले के लिए सिद्ध होता है और न बिल्कुल न खाने वाले के लिए; न बहुत अधिक सोने वाले के लिए और न सदा जागने वाले के लिए।',
      arthaEn: 'Yoga is not for him who eats too much, nor for him who eats too little; nor for him who sleeps too much, nor for him who is too much awake, O Arjuna.',
      href: '/scripture/bhagavadgita/chapter/6/verse/16/',
    },
    simpleAnswerEn: 'Classical Dharmic discipline is not about punishing the body; it is about tuning a musical instrument (the Vina). If the string is pulled too tight, it snaps; if the string is left too loose, it produces no music. Krishna calls this "Yuktāhāra-vihāra" — the golden harmony of right food, right rest, and right play. True discipline is self-regulation born from inner clarity, not fear of being slapped or shamed. When children understand that balance gives them real power and energy, they embrace habits from self-respect rather than compliance.',
    simpleAnswerHi: 'भारतीय दर्शन में अनुशासन का अर्थ शरीर को प्रताड़ित करना नहीं, बल्कि वीणा के तार को सही सुर में मिलाना है। तार बहुत कस दिया जाए तो टूट जाएगा; बहुत ढीला छोड़ दिया जाए तो संगीत नहीं बजेगा। श्रीकृष्ण इसे "युक्ताहारविहार" यानी संतुलन कहते हैं। सच्चा अनुशासन किसी लाठी के डर से नहीं आता, बल्कि यह समझने से आता है कि सही समय पर सोना, खाना और खेलना शरीर को असली ताकत देता है। जब बच्चा इसे समझता है, तो वह आत्म-सम्मान से नियम अपनाता है, डांट के डर से नहीं।',
    parentGuideEn: 'Model moderation in your own daily screen time, bedtime, and speech. Involve children in setting their own family rhythm instead of imposing arbitrary rules from above.',
    parentGuideHi: 'बच्चे वही सीखते हैं जो वे बड़ों को करते देखते हैं। अपने दैनिक जीवन में स्क्रीन और सोने-जागने का संतुलन दिखाएं। नियमों को थोपने के बजाय बच्चे को साथ बैठाकर दिनचर्या तय करें।',
    thinkingPromptEn: 'When you eat until your stomach is uncomfortably stuffed, or stay awake until 2 AM, how do you actually feel the next morning? Does your body thank you or protest?',
    thinkingPromptHi: 'जब आप जरूरत से ज्यादा खा लेते हैं या देर रात तक जागते हैं, तो अगली सुबह कैसा लगता है? क्या शरीर में स्फूर्ति होती है या आलस्य?',
    reflectionExerciseEn: 'The Golden Middle Audit: Identify one habit in your house that is currently "too tight" (causing stress) or "too loose" (causing chaos). How can the family gently tune it to the middle?',
    reflectionExerciseHi: 'घर की वीणा का सुर: अपने दिन की किसी एक ऐसी आदत को पहचानें जो या तो बहुत ज्यादा है या बहुत कम। उसे बीच के संतुलित सुर पर लाने के लिए क्या छोटा कदम उठा सकते हैं?',
    nextDeeperQuestionEn: 'How does the Taittiriya Upanishad connect truthful living (Satyam) with natural duty (Dharmam chara)?',
    nextDeeperQuestionHi: 'तैत्तिरीयोपनिषद् में विद्यार्थी को दीक्षांत के समय "सत्यं वद, धर्मं चर" का उपदेश क्यों दिया गया था?',
    relatedPassages: [
      {
        scriptureId: 'bhagavadgita',
        scriptureTitle: 'Bhagavad Gita',
        scriptureTitleHi: 'श्रीमद्भगवद्गीता',
        chapter: 6,
        verse: 17,
        labelEn: 'Gita 6.17 · Yoga Destroys All Pain for One Moderate in Food and Recreation',
        labelHi: 'गीता ६.१७ · युक्ताहारविहारस्य युक्तचेष्टस्य कर्मसु',
        href: '/scripture/bhagavadgita/chapter/6/verse/17/',
      },
    ],
    epistemicNote: {
      canonicalSource: 'Bhagavad Gītā 6.16-17',
      interpretationLayer: 'direct-artha',
    },
  },

  // ==========================================
  // 4. CURIOUS ADULT BEGINNER INQUIRIES
  // ==========================================
  {
    id: 'beginner-where-should-i-start',
    audience: 'beginner',
    category: 'questions-tradition',
    categoryLabelEn: 'Questions & Tradition',
    categoryLabelHi: 'अध्ययन की शुरुआत',
    wonderPromptEn: 'Dharma Granth preserves 65 scriptures and 187,490 verses across Vedas, Upanishads, Epics, and Puranas. The scale can feel intimidating to someone opening a text for the first time.',
    wonderPromptHi: 'धर्म ग्रंथ में ६५ ग्रंथ और १,८७,४९० श्लोक सुरक्षित हैं। पहली बार आने वाले किसी भी पाठक के मन में यह सवाल उठना स्वाभाविक है कि इस अगाध समुद्र में पहला कदम कहाँ रखें?',
    questionEn: 'Where should a complete beginner start reading without feeling lost or overwhelmed?',
    questionHi: 'एक नया पाठक इस विशाल ग्रंथालय में कहाँ से पढ़ना शुरू करे ताकि वह भटके नहीं?',
    scriptureAnchor: {
      scriptureId: 'ishavasya',
      scriptureTitle: 'Isha Upanishad',
      scriptureTitleHi: 'ईशावास्योपनिषद्',
      chapter: 1,
      verse: 1,
      sanskrit: 'ईशा वास्यमिदं सर्वं यत्किञ्च जगत्यां जगत् ।\nतेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम् ॥',
      transliteration: 'īśā vāsyamidaṃ sarvaṃ yatkiñca jagatyāṃ jagat |\ntena tyaktena bhuñjīthā mā gṛdhaḥ kasyasviddhanam ||',
      arthaHi: 'इस परिवर्तनशील संसार में जो कुछ भी जड़ या चेतन है, वह सब ईश्वर से व्याप्त है। त्यागपूर्वक उसका उपभोग करो; किसी के भी धन या वस्तु का लोभ मत करो।',
      arthaEn: 'All this, whatever moves in this moving world, is enveloped by God. Therefore find your enjoyment in renunciation; do not covet what belongs to others.',
      href: '/scripture/ishavasya/chapter/1/verse/1/',
    },
    simpleAnswerEn: 'Do not attempt to read the entire library at once. We recommend three clear, gentle doorways: 1) Bhagavad Gita Chapter 2 (Sankhya Yoga) — in 72 verses, it synthesizes the entire philosophy of the soul, selfless action, and emotional composure. 2) Isha Upanishad — just 18 poetic verses that introduce the sublime vision of universal oneness and non-covetous living. 3) Ashtavakra Gita — direct, poetic non-dual realization for quiet contemplation. Start with just one verse a day, read the original Sanskrit aloud, reflect on the direct Hindi and English meanings, and let the idea settle.',
    simpleAnswerHi: 'पूरे पुस्तकालय को एक साथ पढ़ने का दबाव कभी न लें। तीन सहज प्रवेश द्वार हैं: १) श्रीमद्भगवद्गीता का दूसरा अध्याय (सांख्ययोग) — मात्र ७२ श्लोकों में आत्मा, निष्काम कर्म और स्थितप्रज्ञता का पूरा सार। २) ईशावास्योपनिषद् — केवल १८ मंत्रों में समूचे वेदान्त का सौंदर्य और संतोष का रहस्य। ३) अष्टावक्र गीता — शांत मन से अद्वैत दर्शन का सीधा दर्शन। प्रतिदिन केवल एक श्लोक पढ़ें, उसका सस्वर उच्चारण करें और दिन भर उस पर विचार करें।',
    parentGuideEn: 'Encourage learners of any age to read slowly and deeply rather than racing to "finish" books. In Indian philosophy, Svādhyāya (contemplative reading) is a mirror for the self, not a syllabus for speed.',
    parentGuideHi: 'पाठक को बताएं कि शास्त्रों को उपन्यास की तरह खत्म करने की जल्दी नहीं करनी चाहिए। यहाँ एक-एक श्लोक जीवन की दिशा बदलने की सामर्थ्य रखता है।',
    thinkingPromptEn: 'If one drop of pure honey is enough to taste sweetness, do you need to swallow the whole hive in one afternoon?',
    thinkingPromptHi: 'अगर शहद की एक बूंद ही पूरी मिठास का अनुभव कराने के लिए काफी है, तो क्या एक ही दिन में पूरा छत्ता निगलने की जरूरत है?',
    reflectionExerciseEn: 'The One-Verse Week: Choose either Gita 2.47 or Isha 1. Read it once every morning for seven days. Notice how its meaning reveals fresh depths as your week unfolds.',
    reflectionExerciseHi: 'एक श्लोक, सात दिन: गीता २.४७ या ईशावास्य १ को चुनें। सात दिनों तक रोज सुबह केवल इसी श्लोक को पढ़ें और देखें कि जीवन के अलग-अलग प्रसंगों में इसका अर्थ कितना गहरा होता जाता है।',
    nextDeeperQuestionEn: 'How does Dharma Granth preserve the strict separation between the canonical verse (Mūlapāṭha) and later commentaries?',
    nextDeeperQuestionHi: 'धर्म ग्रंथ में मूल श्लोक, पारंपरिक भाष्य और आधुनिक संपादकीय विश्लेषण के बीच क्या स्पष्ट अंतर रखा गया है?',
    relatedPassages: [
      {
        scriptureId: 'bhagavadgita',
        scriptureTitle: 'Bhagavad Gita',
        scriptureTitleHi: 'श्रीमद्भगवद्गीता',
        chapter: 2,
        verse: 1,
        labelEn: 'Gita Ch. 2 · The Doorway of Sankhya Yoga',
        labelHi: 'गीता अध्याय २ · सांख्ययोग का आरंभ',
        href: '/scripture/bhagavadgita/chapter/2/',
      },
    ],
    epistemicNote: {
      canonicalSource: 'Īśāvāsyopaniṣad 1',
      interpretationLayer: 'direct-artha',
    },
  },

  {
    id: 'beginner-canonical-vs-commentary-distinction',
    audience: 'beginner',
    category: 'questions-tradition',
    categoryLabelEn: 'Questions & Tradition',
    categoryLabelHi: 'मूलपाठ व भाष्य',
    wonderPromptEn: 'A reader opens a verse and sees the original Sanskrit, then a Hindi translation, then an elaborate commentary from an ancient Acharya, and then modern ethical reflections. How do we know what the text itself said versus what commentators added?',
    wonderPromptHi: 'जब कोई पाठक पृष्ठ खोलता है, तो उसे मूल संस्कृत श्लोक दिखता है, फिर हिंदी अर्थ, फिर किसी आचार्य का प्राचीन भाष्य और फिर आधुनिक विवेचन। पाठक यह कैसे पहचाने कि मूल शास्त्र क्या कह रहा है और व्याख्याकार का अपना दृष्टिकोण क्या है?',
    questionEn: 'How do I distinguish the authentic canonical text (Mūlapāṭha) from traditional commentary and modern editorial interpretation?',
    questionHi: 'मूल प्रामाणिक शास्त्र (मूलपाठ), पारंपरिक भाष्य और आधुनिक व्याख्या में क्या अंतर है और इसे कैसे पहचानें?',
    scriptureAnchor: {
      scriptureId: 'taittiriya',
      scriptureTitle: 'Taittiriya Upanishad',
      scriptureTitleHi: 'तैत्तिरीयोपनिषद्',
      chapter: 1,
      verse: 11,
      sanskrit: 'सत्यं वद । धर्मं चर । स्वाध्यायान्मा प्रमदः ।',
      transliteration: 'satyaṃ vada | dharmaṃ cara | svādhyāyānmā pramadaḥ |',
      arthaHi: 'सत्य बोलो। धर्म का आचरण करो। स्वाध्याय (आंतरिक अध्ययन) में कभी प्रमाद (आलस्य या लापरवाही) मत करो।',
      arthaEn: 'Speak the truth. Practice righteousness. Do not neglect your contemplative study (svadhyaya).',
      href: '/scripture/taittiriya/chapter/1/verse/11/',
    },
    simpleAnswerEn: 'Dharma Granth enforces the strictest multi-layer epistemic separation in digital publishing: 1) Mūlapāṭha (The Canonical Text) — the exact, byte-for-byte Sanskrit or Awadhi verse as transmitted in historical recensions, cryptographically locked with SHA-256 checksums. 2) Artha (Direct Meaning) — literal, faithful word-by-word meaning answering "What does the sentence literally say?" 3) Vyākhyā (Contextual Exposition) — how the verse functions within the story or chapter. 4) Bhāṣya (Traditional Commentary) — explicitly cited when referencing ancient masters like Shankara, Ramanuja, or Madhva without confusing their view with the core text. 5) Vijñāna (Modern Analytical Perspective) — clearly labeled editorial observations from psychology, ethics, or history. You are never misled about what is original scripture and what is interpretation.',
    simpleAnswerHi: 'धर्म ग्रंथ में ज्ञान के स्तरों का पूर्ण विभाजन रखा गया है: १) मूलपाठ — अपरिवर्तनीय संस्कृत/अवधी श्लोक जो SHA-256 क्रिप्टोग्राफिक चेकसम से सुरक्षित है। २) अर्थ — शब्द-दर-शब्द निष्पक्ष अनुवाद ("वाक्य वास्तव में क्या कह रहा है")। ३) व्याख्या — प्रसंग और कथा का संदर्भ। ४) भाष्य — जब शंकराचार्य, रामानुजाचार्य या मध्वाचार्य जैसे आचार्यों का संदर्भ हो, तो उसे स्पष्ट स्रोत के साथ अलग दिखाया जाता है। ५) विज्ञानसम्मत विवेचन — आधुनिक मनोविज्ञान, नीति और जीवन-मूल्यों से जुड़ा संपादकीय विश्लेषण, जिसे कभी मूल श्लोक के रूप में प्रस्तुत नहीं किया जाता।',
    parentGuideEn: 'Help young and new readers appreciate that commentators can disagree while respecting the same core Sanskrit verse. Disagreement among Acharyas is not a flaw; it is the intellectual richness of a living, thinking civilization.',
    parentGuideHi: 'पाठक को समझाएं कि अलग-अलग आचार्यों की व्याख्याओं में भिन्नता हो सकती है, पर मूल संस्कृत श्लोक अपरिवर्तित रहता है। यह मतभेद ग्रंथ की कमी नहीं, बल्कि स्वतंत्र चिंतन की समृद्ध परंपरा है।',
    thinkingPromptEn: 'When you read a constitution or law, why is it vital to know what the law text itself says before reading a lawyer’s opinion about it?',
    thinkingPromptHi: 'जब आप कोई नियम या संविधान पढ़ते हैं, तो किसी विशेषज्ञ की राय पढ़ने से पहले मूल कानून की पंक्ति को स्वयं पढ़ना क्यों जरूरी होता है?',
    reflectionExerciseEn: 'The 3-Layer Check: Open any verse on Dharma Granth (for example Gita 2.47). Look first at the Sanskrit, then at the direct Hindi Artha, and then at the commentary. Notice how clearly your own mind can separate the three.',
    reflectionExerciseHi: 'त्रि-स्तरीय दृष्टि: किसी भी श्लोक को खोलें। पहले केवल संस्कृत और सीधे हिंदी अर्थ को देखें, फिर भाष्य को पढ़ें। अपने विवेक से अनुभव करें कि मूल शास्त्र क्या कह रहा है और व्याख्या ने उसमें क्या नया पहलू जोड़ा है।',
    nextDeeperQuestionEn: 'What is the traditional hermeneutic method (Mimamsa) for interpreting Vedic statements?',
    nextDeeperQuestionHi: 'वेदों और उपनिषदों के अर्थ को समझने के लिए भारतीय परंपरा में मीमांसा के क्या नियम बताए गए हैं?',
    relatedPassages: [
      {
        scriptureId: 'taittiriya',
        scriptureTitle: 'Taittiriya Upanishad',
        scriptureTitleHi: 'तैत्तिरीयोपनिषद्',
        chapter: 1,
        verse: 12,
        labelEn: 'Taittiriya 1.12 · The Peace Chant Recited Before Study',
        labelHi: 'तैत्तिरीय १.१२ · शं नो मित्रः शं वरुणः (अध्ययन-पूर्व शांति)',
        href: '/scripture/taittiriya/chapter/1/verse/12/',
      },
    ],
    epistemicNote: {
      canonicalSource: 'Taittirīya Upaniṣad 1.11.1',
      interpretationLayer: 'direct-artha',
    },
  },
];

/**
 * Filter inquiries by target audience and optional category.
 */
export function getInquiriesByAudience(
  audience: InquiryAudience,
  category?: InquiryCategory
): InquiryItem[] {
  return CURIOSITY_INQUIRIES.filter((item) => {
    if (item.audience !== audience) return false;
    if (category && item.category !== category) return false;
    return true;
  });
}

/**
 * Find an inquiry by ID.
 */
export function getInquiryById(id: string): InquiryItem | undefined {
  return CURIOSITY_INQUIRIES.find((item) => item.id === id);
}

/**
 * Find curiosity inquiries relevant to a given scripture verse.
 */
export function getInquiriesForVerse(
  scriptureId: string,
  chapter: number,
  verse: string | number
): InquiryItem[] {
  const vStr = String(verse);
  return CURIOSITY_INQUIRIES.filter((item) => {
    const isDirectMatch =
      item.scriptureAnchor.scriptureId === scriptureId &&
      item.scriptureAnchor.chapter === chapter &&
      String(item.scriptureAnchor.verse) === vStr;
    if (isDirectMatch) return true;

    return item.relatedPassages.some(
      (rel) =>
        rel.scriptureId === scriptureId &&
        rel.chapter === chapter &&
        String(rel.verse) === vStr
    );
  });
}
