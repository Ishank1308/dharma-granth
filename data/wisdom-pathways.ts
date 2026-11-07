/**
 * Wisdom Pathways (Phases 1–2).
 * Each pathway begins with a real human challenge and guides the visitor
 * through authentic scriptural teachings. The scripture is the authority;
 * this file is only the bridge. Sanskrit lines are never stored here:
 * verses resolve at runtime from validated wisdom topics (see lib/wisdom-pathways).
 */

export interface PathwayVerseLens {
  /** Wisdom-for-Life topic holding the validated verse. */
  topicSlug: string;
  /** Verse id inside that topic; when omitted the topic's first verse is used. */
  verseId?: string;
  arthEn: string;
  arthHi: string;
  vyakhyaEn: string;
  vyakhyaHi: string;
  modernContextEn: string;
  modernContextHi: string;
  lineageIds: string[];
}

export interface PathwaySection {
  en: string;
  hi: string;
}

export interface WisdomPathway {
  id: string;
  slug: string;
  titleEn: string;
  titleHi: string;
  sanskritSubtitle: string;
  /** Genuine question this pathway answers (Phase 8 SEO). */
  questionEn: string;
  questionHi: string;
  mastersFocusEn: string;
  introduction: PathwaySection;
  whyHumansFace: PathwaySection;
  scripturalFoundations: PathwaySection;
  verseLenses: PathwayVerseLens[];
  lineageIds: string[];
  sageNote: PathwaySection;
  reflectionQuestions: PathwaySection[];
  contemplationPrompts: PathwaySection[];
  relatedPathways: string[];
  discovery: {
    emotions: string[];
    challenges: string[];
    questions: string[];
    scriptures: string[];
    saints: string[];
    concepts: string[];
  };
  searchKeywords: string[];
  readingTimeMinutes: number;
}

export const wisdomPathways: WisdomPathway[] = [
  {
    id: 'gita-on-fear',
    slug: 'gita-on-fear',
    titleEn: 'What the Bhagavad Gita Teaches About Fear',
    titleHi: 'भय पर भगवद्गीता का उपदेश',
    sanskritSubtitle: 'अभयं सत्त्वसंशुद्धिः',
    questionEn: 'How do scriptures explain fear?',
    questionHi: 'शास्त्र भय को कैसे समझाते हैं?',
    mastersFocusEn: 'Krishna to Arjuna, Yajnavalkya on duality, Shankara on the fearless Self.',
    introduction: {
      en: 'Arjuna enters the Gita paralyzed: his limbs tremble and his resolve collapses. Krishna does not mock that fear; he traces it to a forgotten identity and rebuilds courage from the Self.',
      hi: 'अर्जुन गीता में भय से काँपते हुए प्रवेश करते हैं। श्रीकृष्ण उस भय का उपहास नहीं करते; वे उसकी जड़ भूली हुई आत्म-पहचान में दिखाते हैं और आत्मज्ञान से साहस का पुनर्निर्माण करते हैं।',
    },
    whyHumansFace: {
      en: 'Fear appears when we identify only with what can be lost: reputation, resources, health, and outcomes. The mind then divides the world into “me” and “threats against me.”',
      hi: 'भय तब प्रकट होता है जब हम अपनी पहचान केवल उसी से जोड़ लेते हैं जो छिन सकता है — प्रतिष्ठा, साधन, स्वास्थ्य और परिणाम। तब मन जगत को “मैं” और “मुझे हानि पहुँचाने वाले” में बाँट देता है।',
    },
    scripturalFoundations: {
      en: 'Gita 16.1 names fearlessness (abhaya) the first divine quality. The Taittiriya Upanishad declares that one who knows the bliss of Brahman never fears. Brihadaranyaka traces fear to perceiving “a second.”',
      hi: 'गीता १६.१ अभय को दैवी संपदा का पहला गुण कहती है। तैत्तिरीय उपनिषद् कहता है कि ब्रह्म के आनंद को जानने वाला कभी नहीं डरता। बृहदारण्यक भय की जड़ “दूसरे” की प्रतीति में बताता है।',
    },
    verseLenses: [
      {
        topicSlug: 'fear-and-courage',
        verseId: 'bg-16-1',
        arthEn: 'Fearlessness is not the absence of danger but the first mark of a purified heart that stands in knowledge.',
        arthHi: 'अभय का अर्थ संकट का अभाव नहीं, बल्कि ज्ञान में स्थित शुद्ध अंतःकरण का पहला लक्षण है।',
        vyakhyaEn: 'Shankara reads this list as Daivi Sampad: qualities that free perception. Abhaya comes first because every other practice needs a mind that is not fleeing.',
        vyakhyaHi: 'शंकराचार्य इसे दैवी संपदा के रूप में पढ़ते हैं — दृष्टि को मुक्त करने वाले गुण। अभय सबसे पहले है क्योंकि प्रत्येक साधना को भागते हुए नहीं, ठहरे हुए मन की आवश्यकता है।',
        modernContextEn: 'Before a difficult conversation or decision, name one outcome you cannot control and set it aside. Courage is attention returned to duty.',
        modernContextHi: 'कठिन संवाद या निर्णय से पहले एक ऐसा परिणाम लिखें जो आपके वश में नहीं, और उसे अलग रखें। साहस ध्यान को कर्तव्य पर लौटाना है।',
        lineageIds: ['yajnavalkya', 'shankara'],
      },
      {
        topicSlug: 'fear-and-courage',
        verseId: 'taittiriya-2-4-1',
        arthEn: 'One who has tasted the bliss of Brahman does not fear, because nothing external remains to threaten the Self.',
        arthHi: 'जिसने ब्रह्म के आनंद को जान लिया, वह नहीं डरता — क्योंकि आत्मा को कोई बाह्य वस्तु हानि नहीं पहुँचा सकती।',
        vyakhyaEn: 'The Brahmānandavallī reaches this after the five sheaths: bliss independent of objects dissolves the basis of loss.',
        vyakhyaHi: 'पञ्चकोशों के विवेचन के बाद ब्रह्मानंदवल्ली यहाँ पहुँचती है — पदार्थों से स्वतंत्र आनंद हानि के आधार को ही मिटा देता है।',
        modernContextEn: 'When dread loops, ask: “What part of me cannot be harmed by this outcome?” Rest attention there for a minute.',
        modernContextHi: 'जब आशंका घूमती रहे, पूछें — “मुझमें वह क्या है जिसे यह परिणाम हानि नहीं पहुँचा सकता?” एक मिनट वहीं विश्राम करें।',
        lineageIds: ['yajnavalkya', 'ramana'],
      },
    ],
    lineageIds: ['yajnavalkya', 'vyasa', 'shankara', 'ramana'],
    sageNote: {
      en: 'Yajnavalkya names duality as fear’s root; Shankara’s Gita commentary makes abhaya the fruit of Self-knowledge; Ramana’s inquiry traces the frightened “I” back to its source.',
      hi: 'याज्ञवल्क्य भय की जड़ द्वैत में बताते हैं; शंकर का गीता-भाष्य अभय को आत्मज्ञान का फल कहता है; रमण की विचार-साधना भयभीत “मैं” को उसके स्रोत तक ले जाती है।',
    },
    reflectionQuestions: [
      { en: 'Which attachment is producing this fear — reputation, money, health, or being right?', hi: 'इस भय के पीछे कौन सी आसक्ति है — प्रतिष्ठा, धन, स्वास्थ्य या सही सिद्ध होने की चाह?' },
      { en: 'If your deepest essence cannot be harmed, what would you do today?', hi: 'यदि आपकी गहनतम सत्ता को हानि नहीं हो सकती, तो आज आप क्या करेंगे?' },
    ],
    contemplationPrompts: [
      { en: 'Pause and reflect: how does this teaching appear in your life right now?', hi: 'ठहरकर चिंतन करें — यह उपदेश आपके जीवन में इस समय कैसे दिख रहा है?' },
      { en: 'What is one small dutiful action you can take today without demanding its fruit?', hi: 'आज ऐसा कौन सा एक छोटा कर्तव्य-कर्म है जिसे आप फल की माँग किए बिना कर सकते हैं?' },
    ],
    relatedPathways: ['krishna-on-duty', 'upanishads-on-self', 'sanatan-on-grief'],
    discovery: {
      emotions: ['fear', 'anxiety', 'dread'],
      challenges: ['uncertainty', 'courage before a decision'],
      questions: ['How do scriptures explain fear?', 'What does Gita teach about anxiety?'],
      scriptures: ['bhagavadgita', 'taittiriya'],
      saints: ['yajnavalkya', 'shankara', 'ramana'],
      concepts: ['fear', 'wisdom', 'detachment'],
    },
    searchKeywords: ['gita on fear', 'fearlessness abhaya', 'how do scriptures explain fear', 'भय पर गीता', 'अभय'],
    readingTimeMinutes: 8,
  },
  {
    id: 'krishna-on-duty',
    slug: 'krishna-on-duty',
    titleEn: 'What Krishna Teaches About Duty',
    titleHi: 'कर्तव्य पर श्रीकृष्ण का उपदेश',
    sanskritSubtitle: 'कर्मण्येवाधिकारस्ते',
    questionEn: 'What does Krishna teach about duty?',
    questionHi: 'श्रीकृष्ण कर्तव्य के बारे में क्या सिखाते हैं?',
    mastersFocusEn: 'Krishna to Arjuna, Ramanuja on offering, Madhva on effort.',
    introduction: {
      en: 'Arjuna wants to abandon his post because action feels tainted. Krishna answers that duty done without clutching its fruit purifies rather than binds.',
      hi: 'अर्जुन अपना स्थान छोड़ना चाहते हैं क्योंकि कर्म दूषित लगता है। श्रीकृष्ण उत्तर देते हैं कि फल की आसक्ति छोड़ा हुआ कर्तव्य बाँधता नहीं, शुद्ध करता है।',
    },
    whyHumansFace: {
      en: 'Duty becomes heavy when we measure it only by success, praise, or blame. Then even right action feels like a burden.',
      hi: 'कर्तव्य तब भारी लगता है जब हम उसे केवल सफलता, प्रशंसा या निंदा से तौलते हैं। तब उचित कर्म भी बोझ लगता है।',
    },
    scripturalFoundations: {
      en: 'The Gita’s karma teaching separates the sphere of effort from the sphere of fruit. Chapters 2 and 3 return to this: act steadily, offer the result, and let equanimity be the sign.',
      hi: 'गीता का कर्म-उपदेश प्रयत्न के क्षेत्र को फल के क्षेत्र से अलग करता है। अध्याय २ और ३ इसी पर लौटते हैं — स्थिर होकर कर्म करो, परिणाम अर्पित करो, समत्व ही लक्षण है।',
    },
    verseLenses: [
      {
        topicSlug: 'stress-and-worry',
        verseId: 'bg-2-66',
        arthEn: 'Without inner integration there is no steady judgment and no peace; duty needs a centered mind first.',
        arthHi: 'अंतःकरण के संयम के बिना निश्चयात्मक बुद्धि नहीं, शांति नहीं — कर्तव्य को पहले स्थिर मन चाहिए।',
        vyakhyaEn: 'Ramanuja reads steadiness as the ground of offering: a scattered mind cannot offer its work. Centering precedes right action.',
        vyakhyaHi: 'रामानुज स्थिरता को अर्पण की भूमि मानते हैं — बिखरा मन अपना कर्म अर्पित नहीं कर सकता। सम्यक् कर्म से पहले चित्त का स्थिर होना आवश्यक है।',
        modernContextEn: 'Name today’s one duty and one outcome. Do the first fully; place the second in trustworthy hands.',
        modernContextHi: 'आज का एक कर्तव्य और एक परिणाम लिखें। पहले को पूर्णता से करें; दूसरे को योग्य हाथों में सौंपें।',
        lineageIds: ['ramanuja', 'madhva'],
      },
    ],
    lineageIds: ['vyasa', 'ramanuja', 'madhva'],
    sageNote: {
      en: 'Ramanuja turns duty into worship by offering; Madhva joins dependence on the Lord with disciplined effort.',
      hi: 'रामानुज कर्तव्य को अर्पण से उपासना बनाते हैं; मध्व भगवान पर निर्भरता को अनुशासित प्रयत्न से जोड़ते हैं।',
    },
    reflectionQuestions: [
      { en: 'What part of this situation is your direct duty today, and what part is anxiety about the fruit?', hi: 'इस परिस्थिति में आज आपका प्रत्यक्ष कर्तव्य क्या है, और कौन सा भाग केवल फल की चिंता है?' },
    ],
    contemplationPrompts: [
      { en: 'What would change if this work were an offering rather than a bargain?', hi: 'यदि यह कार्य सौदा न होकर अर्पण हो, तो क्या बदलेगा?' },
    ],
    relatedPathways: ['gita-on-fear', 'ramayana-on-dharma', 'yoga-on-mind'],
    discovery: {
      emotions: ['pressure', 'confusion'],
      challenges: ['duty in conflict', 'decision-making'],
      questions: ['What does Krishna teach about duty?', 'How can Dharma help during difficult times?'],
      scriptures: ['bhagavadgita'],
      saints: ['ramanuja', 'madhva', 'vyasa'],
      concepts: ['duty', 'dharma', 'karma'],
    },
    searchKeywords: ['krishna on duty', 'gita karma yoga duty', 'कर्तव्य पर कृष्ण', 'कर्मयोग'],
    readingTimeMinutes: 7,
  },
  {
    id: 'upanishads-on-self',
    slug: 'upanishads-on-self',
    titleEn: 'What the Upanishads Teach About the Self',
    titleHi: 'आत्मा पर उपनिषदों का उपदेश',
    sanskritSubtitle: 'तत् त्वम् असि',
    questionEn: 'What do Hindu scriptures say about the Self?',
    questionHi: 'हिंदू शास्त्र आत्मा के बारे में क्या कहते हैं?',
    mastersFocusEn: 'Uddalaka to Shvetaketu, Yajnavalkya, Shankara, Ramana.',
    introduction: {
      en: 'The Upanishads ask a simple question with vast consequences: who is the knower that remains when roles, moods, and bodies change?',
      hi: 'उपनिषद् एक सरल प्रश्न पूछते हैं जिसके परिणाम अपार हैं — भूमिकाएँ, मनोदशाएँ और शरीर बदल जाएँ तब भी वह ज्ञाता कौन है जो शेष रहता है?',
    },
    whyHumansFace: {
      en: 'We confuse ourselves with passing states: success, grief, praise, and fatigue. Then every change feels like a threat to “me.”',
      hi: 'हम स्वयं को अस्थायी अवस्थाओं से मिला देते हैं — सफलता, शोक, प्रशंसा, थकान। तब प्रत्येक परिवर्तन “मैं” के लिए संकट लगता है।',
    },
    scripturalFoundations: {
      en: 'Chandogya’s “Tat Tvam Asi,” Taittiriya’s bliss of Brahman, and the witness teaching of the Gita point to one Self, timeless and unafraid.',
      hi: 'छान्दोग्य का “तत् त्वम् असि”, तैत्तिरीय का ब्रह्मानंद और गीता का साक्षी-उपदेश एक ही नित्य, निर्भय आत्मा की ओर संकेत करते हैं।',
    },
    verseLenses: [
      {
        topicSlug: 'fear-and-courage',
        verseId: 'taittiriya-2-4-1',
        arthEn: 'Bliss is the nature of Brahman; knowing it, fear has nowhere to stand.',
        arthHi: 'आनंद ब्रह्म का स्वरूप है; उसे जान लेने पर भय को खड़े होने का स्थान नहीं रहता।',
        vyakhyaEn: 'Shankara’s commentary places this after the sheaths: the Self is not the perishing layer but its witness and ground.',
        vyakhyaHi: 'शंकर-भाष्य इसे कोशों के विवेचन के बाद रखता है — आत्मा नश्वर आवरण नहीं, उसका साक्षी और आधार है।',
        modernContextEn: 'In restlessness, shift from “I am anxious” to “anxiety is passing through awareness.” Notice the knower.',
        modernContextHi: 'बेचैनी में “मैं चिंतित हूँ” से हटकर देखें — “चिंता चेतना से गुजर रही है।” उस ज्ञाता को पहचानें।',
        lineageIds: ['uddalaka', 'shankara', 'ramana'],
      },
    ],
    lineageIds: ['uddalaka', 'yajnavalkya', 'shankara', 'ramana'],
    sageNote: {
      en: 'Uddalaka gives the identity, Yajnavalkya removes the second, Shankara systematizes it, Ramana makes it a question to live.',
      hi: 'उद्दालक तादात्म्य देते हैं, याज्ञवल्क्य द्वितीय को मिटाते हैं, शंकर उसे व्यवस्थित करते हैं, रमण उसे जीने का प्रश्न बनाते हैं।',
    },
    reflectionQuestions: [
      { en: 'Which passing state are you calling “me” today?', hi: 'आज आप किस अस्थायी अवस्था को “मैं” कह रहे हैं?' },
    ],
    contemplationPrompts: [
      { en: 'Sit quietly and ask “Who am I apart from this role?” Do not answer quickly; observe.', hi: 'शांत बैठकर पूछें — “इस भूमिका से पृथक् मैं कौन हूँ?” शीघ्र उत्तर न दें; अवलोकन करें।' },
    ],
    relatedPathways: ['gita-on-fear', 'yoga-on-mind', 'sanatan-on-grief'],
    discovery: {
      emotions: ['confusion', 'restlessness'],
      challenges: ['purpose', 'identity'],
      questions: ['What do Hindu scriptures say about purpose?', 'Who am I?'],
      scriptures: ['chandogya', 'taittiriya', 'katha'],
      saints: ['uddalaka', 'shankara', 'ramana'],
      concepts: ['wisdom', 'truth', 'meditation'],
    },
    searchKeywords: ['upanishads on self', 'tat tvam asi meaning', 'आत्मा पर उपनिषद', 'मैं कौन हूँ'],
    readingTimeMinutes: 7,
  },
  {
    id: 'yoga-on-mind',
    slug: 'yoga-on-mind',
    titleEn: 'What the Yoga Sutras Teach About Mastering the Mind',
    titleHi: 'मन पर योगसूत्रों का उपदेश',
    sanskritSubtitle: 'योगश्चित्तवृत्तिनिरोधः',
    questionEn: 'What does Yoga teach about mastering the mind?',
    questionHi: 'योग मन पर अधिकार के बारे में क्या सिखाता है?',
    mastersFocusEn: 'Patanjali on stilling, Krishna on practice and dispassion.',
    introduction: {
      en: 'Patanjali defines yoga as the stilling of the mind’s turnings. The Gita agrees in chapter 6: the restless mind is mastered little by little, by practice held with patience.',
      hi: 'पतंजलि योग को चित्तवृत्तियों के निरोध के रूप में परिभाषित करते हैं। गीता अध्याय ६ में सहमत है — चंचल मन धीरे-धीरे, धैर्ययुक्त अभ्यास से वश में होता है।',
    },
    whyHumansFace: {
      en: 'The mind wanders by habit toward craving and threat. Without training, attention is pulled rather than placed.',
      hi: 'मन अभ्यासवश कामना और भय की ओर भटकता है। प्रशिक्षण के बिना ध्यान रखा नहीं जाता, खींचा जाता है।',
    },
    scripturalFoundations: {
      en: 'Yoga Sutra 1.2 gives the definition; 1.12–1.14 give the method: practice (abhyasa) and dispassion (vairagya), sustained over time. Gita 6.10–6.26 shows the same path on a seat, with breath and return.',
      hi: 'योगसूत्र १.२ परिभाषा देता है; १.१२–१.१४ विधि — दीर्घकालीन अभ्यास और वैराग्य। गीता ६.१०–६.२६ उसी मार्ग को आसन, श्वास और लौटने के अभ्यास में दिखाती है।',
    },
    verseLenses: [
      {
        topicSlug: 'meditation',
        verseId: 'bg-6-25',
        arthEn: 'Little by little the mind is withdrawn and settled in the Self; then think of nothing else.',
        arthHi: 'धीरे-धीरे मन को विषयों से हटाकर आत्मा में स्थापित करें; फिर अन्य कुछ न सोचें।',
        vyakhyaEn: 'Patanjali’s commentarial tradition hears 1.14 here: practice becomes firm when done long, without break, and with devotion.',
        vyakhyaHi: 'परंपरागत व्याख्या यहाँ १.१४ सुनती है — दीर्घकाल, नैरंतर्य और सत्कार से सेवन ही दृढ़ अभ्यास है।',
        modernContextEn: 'Count returns, not minutes. Each noticing and returning is one repetition of mastery.',
        modernContextHi: 'मिनट नहीं, लौटने की गणना करें। प्रत्येक स्मरण और वापसी अधिकार की एक आवृत्ति है।',
        lineageIds: ['patanjali', 'shankara'],
      },
      {
        topicSlug: 'meditation',
        verseId: 'bg-6-10',
        arthEn: 'Solitude, restraint, and freedom from grasping prepare the ground for meditation.',
        arthHi: 'एकांत, संयम और संग्रह-वृत्ति का त्याग ध्यान की भूमि तैयार करते हैं।',
        vyakhyaEn: 'The seat and setting are moral before they are technical: fewer claims, steadier attention.',
        vyakhyaHi: 'स्थान और आसन तकनीक से पहले नैतिक हैं — जितने कम दावे, उतना स्थिर ध्यान।',
        modernContextEn: 'Clear one small surface and silence one craving before sitting. Simplicity is method.',
        modernContextHi: 'बैठने से पहले एक छोटा स्थान स्वच्छ करें और एक कामना को शांत करें। सादगी ही विधि है।',
        lineageIds: ['patanjali'],
      },
    ],
    lineageIds: ['patanjali', 'vyasa', 'shankara', 'ramana'],
    sageNote: {
      en: 'Patanjali defines the stilling; Krishna shows Arjuna the returning; Shankara and Ramana keep the aim on the Self, not on states.',
      hi: 'पतंजलि निरोध की परिभाषा देते हैं; श्रीकृष्ण अर्जुन को लौटना सिखाते हैं; शंकर और रमण लक्ष्य को अवस्थाओं पर नहीं, आत्मा पर रखते हैं।',
    },
    reflectionQuestions: [
      { en: 'Do you bring the wandering mind back with patience or with frustration?', hi: 'भटकते मन को आप धैर्य से लौटाते हैं या खिन्नता से?' },
    ],
    contemplationPrompts: [
      { en: 'For a few minutes, rest attention on the breath. Each return is the practice.', hi: 'कुछ मिनट श्वास पर ध्यान टिकाएँ। प्रत्येक वापसी ही अभ्यास है।' },
    ],
    relatedPathways: ['gita-on-fear', 'upanishads-on-self', 'krishna-on-duty'],
    discovery: {
      emotions: ['restlessness', 'overthinking'],
      challenges: ['focus', 'meditation'],
      questions: ['What does Yoga teach about mastering the mind?', 'How to meditate?'],
      scriptures: ['bhagavadgita'],
      saints: ['patanjali', 'shankara'],
      concepts: ['mind', 'meditation', 'concentration', 'discipline'],
    },
    searchKeywords: ['yoga sutras mind', 'gita meditation 6', 'मन पर योग', 'ध्यान कैसे करें'],
    readingTimeMinutes: 8,
  },
  {
    id: 'ramayana-on-dharma',
    slug: 'ramayana-on-dharma',
    titleEn: 'What Ramayana Teaches About Dharma',
    titleHi: 'धर्म पर रामायण का उपदेश',
    sanskritSubtitle: 'रामो विग्रहवान् धर्मः',
    questionEn: 'How can Dharma help during difficult times?',
    questionHi: 'कठिन समय में धर्म कैसे सहायता करता है?',
    mastersFocusEn: 'Valmiki and Tulsidas on Rama’s conduct; the Gita on steady action.',
    introduction: {
      en: 'Rama is called dharma made visible: exile accepted, promises kept, and compassion extended even to adversaries. The Ramayana teaches dharma as conduct under pressure, not as theory.',
      hi: 'राम को विग्रहवान् धर्म कहा गया — वनवास स्वीकार, वचन-पालन और विरोधी के प्रति भी करुणा। रामायण धर्म को सिद्धांत नहीं, दबाव में आचरण सिखाता है।',
    },
    whyHumansFace: {
      en: 'Hard times force conflicts of loyalty: family and principle, obedience and conscience, loss and responsibility.',
      hi: 'कठिन समय निष्ठाओं का संघर्ष लाता है — परिवार और सिद्धांत, आज्ञा और विवेक, हानि और उत्तरदायित्व।',
    },
    scripturalFoundations: {
      en: 'Valmiki shows Rama choosing the harder right over the easier expedient. Tulsidas retells it for households: patience, truthfulness, and service hold when fortune does not.',
      hi: 'वाल्मीकि राम को सरल सुविधा पर कठिन श्रेय चुनते दिखाते हैं। तुलसी उसे घर-घर के लिए कहते हैं — धैर्य, सत्य और सेवा तब थामते हैं जब भाग्य नहीं थामता।',
    },
    verseLenses: [
      {
        topicSlug: 'stress-and-worry',
        verseId: 'bg-2-66',
        arthEn: 'Steadiness is the precondition of righteous choice; an unquiet mind cannot discern dharma.',
        arthHi: 'धर्म-विवेक की पूर्वशर्त स्थिरता है; अशांत मन धर्म को पहचान नहीं सकता।',
        vyakhyaEn: 'Valmiki’s Rama pauses, consults, and then acts. The Gita verse gives the inner side of that pause: integration before decision.',
        vyakhyaHi: 'वाल्मीकि के राम ठहरते हैं, परामर्श करते हैं, तब कर्म करते हैं। गीता का श्लोक उस ठहराव का आंतरिक पक्ष देता है — निर्णय से पहले संयम।',
        modernContextEn: 'Before a hard call, write the promise involved and the person affected. Let dharma be conduct, not victory.',
        modernContextHi: 'कठिन निर्णय से पहले निहित वचन और प्रभावित व्यक्ति लिखें। धर्म को विजय नहीं, आचरण बनने दें।',
        lineageIds: ['valmiki', 'tulsidas'],
      },
    ],
    lineageIds: ['valmiki', 'tulsidas', 'vyasa'],
    sageNote: {
      en: 'Valmiki establishes the ideal, Tulsidas translates it into household life: exile, waiting, and forgiveness as daily dharma.',
      hi: 'वाल्मीकि आदर्श स्थापित करते हैं, तुलसी उसे गृहस्थ जीवन में उतारते हैं — वनवास, प्रतीक्षा और क्षमा दैनिक धर्म के रूप में।',
    },
    reflectionQuestions: [
      { en: 'Which promise or responsibility is asking for your steadiness today?', hi: 'आज कौन सा वचन या उत्तरदायित्व आपकी स्थिरता माँग रहा है?' },
    ],
    contemplationPrompts: [
      { en: 'Recall one Rama-like pause: where could patience replace haste this week?', hi: 'राम जैसा एक ठहराव स्मरण करें — इस सप्ताह धैर्य जल्दबाजी का स्थान कहाँ ले सकता है?' },
    ],
    relatedPathways: ['krishna-on-duty', 'saints-on-devotion', 'sanatan-on-grief'],
    discovery: {
      emotions: ['conflict', 'loss'],
      challenges: ['dharma in conflict', 'family duty'],
      questions: ['How can Dharma help during difficult times?', 'What does Ramayana teach about Dharma?'],
      scriptures: ['bhagavadgita'],
      saints: ['valmiki', 'tulsidas'],
      concepts: ['dharma', 'duty', 'service'],
    },
    searchKeywords: ['ramayana dharma teaching', 'dharma difficult times', 'रामायण धर्म', 'धर्म संकट'],
    readingTimeMinutes: 7,
  },
  {
    id: 'saints-on-devotion',
    slug: 'saints-on-devotion',
    titleEn: 'What Great Saints Teach About Devotion',
    titleHi: 'भक्ति पर संतों का उपदेश',
    sanskritSubtitle: 'भक्त्या मामभिजानाति',
    questionEn: 'What do saints teach about forgiveness and devotion?',
    questionHi: 'संत भक्ति और क्षमा के बारे में क्या सिखाते हैं?',
    mastersFocusEn: 'Mirabai, Tulsidas, Kabir, Chaitanya, Ramakrishna on love that survives loss.',
    introduction: {
      en: 'The saints turned metaphysics into song: devotion as refuge when argument fails and grief remains. Their lives show love that forgives, waits, and serves.',
      hi: 'संतों ने अध्यात्म को भजन बनाया — तर्क जहाँ थकता है और शोक शेष रहता है, वहाँ भक्ति आश्रय है। उनके जीवन क्षमा करने, प्रतीक्षा करने और सेवा करने वाले प्रेम को दिखाते हैं।',
    },
    whyHumansFace: {
      en: 'Devotion falters when crowded by display, resentment, or transaction: prayer as performance or bargain.',
      hi: 'दिखावा, रोष या लेन-देन से घिरकर भक्ति डगमगाती है — प्रदर्शन या सौदे के रूप में प्रार्थना।',
    },
    scripturalFoundations: {
      en: 'The Gita places the devotee who is undisturbed and undisturbing among the dearest to the Lord. The saints live this: Mira’s refuge, Kabir’s inwardness, Chaitanya’s humility.',
      hi: 'गीता उस भक्त को भगवान का प्रिय कहती है जो न उद्विग्न करता है, न होता है। संत इसे जीते हैं — मीरा का आश्रय, कबीर की अंतर्मुखता, चैतन्य की विनम्रता।',
    },
    verseLenses: [
      {
        topicSlug: 'stress-and-worry',
        verseId: 'bg-6-26',
        arthEn: 'Devotion is the returning itself: wherever the mind wanders, bring it back to the Lord.',
        arthHi: 'भक्ति वही लौटना है — मन जहाँ-जहाँ भटके, वहाँ से उसे प्रभु की ओर लाएँ।',
        vyakhyaEn: 'Chaitanya’s humility and Mira’s constancy give this verse a devotional reading: return without self-reproach.',
        vyakhyaHi: 'चैतन्य की विनम्रता और मीरा की निष्ठा इस श्लोक को भक्तिपरक अर्थ देती हैं — आत्म-धिक्कार के बिना लौटना।',
        modernContextEn: 'Choose one name, one breath, one small service today. Small and sincere outlasts grand and strained.',
        modernContextHi: 'आज एक नाम, एक श्वास, एक छोटी सेवा चुनें। छोटा और सच्चा बड़े और तनावपूर्ण से अधिक टिकता है।',
        lineageIds: ['mirabai', 'chaitanya', 'tulsidas'],
      },
    ],
    lineageIds: ['mirabai', 'kabir', 'chaitanya', 'tulsidas', 'ramakrishna'],
    sageNote: {
      en: 'Mira holds to one refuge, Kabir strips display, Chaitanya softens pride into song, Ramakrishna harmonizes paths.',
      hi: 'मीरा एक आश्रय थामती हैं, कबीर दिखावा छाँटते हैं, चैतन्य अभिमान को भजन में ढालते हैं, रामकृष्ण मार्गों का समन्वय करते हैं।',
    },
    reflectionQuestions: [
      { en: 'Is your practice refuge, performance, or bargain right now?', hi: 'इस समय आपकी साधना आश्रय है, प्रदर्शन है या सौदा?' },
      { en: 'Whom could you forgive today as an act of devotion?', hi: 'भक्ति के रूप में आज आप किसे क्षमा कर सकते हैं?' },
    ],
    contemplationPrompts: [
      { en: 'Sing or repeat one line with attention. Let grief soften into love.', hi: 'एक पंक्ति ध्यान से गाएँ या दोहराएँ। शोक को प्रेम में ढलने दें।' },
    ],
    relatedPathways: ['ramayana-on-dharma', 'sanatan-on-grief', 'gita-on-fear'],
    discovery: {
      emotions: ['grief', 'longing'],
      challenges: ['forgiveness', 'devotion'],
      questions: ['What do saints teach about forgiveness?', 'What do saints teach about devotion?'],
      scriptures: ['bhagavadgita'],
      saints: ['mirabai', 'kabir', 'chaitanya', 'tulsidas', 'ramakrishna'],
      concepts: ['bhakti', 'faith', 'compassion'],
    },
    searchKeywords: ['saints on devotion', 'bhakti forgiveness teaching', 'संत भक्ति', 'क्षमा भक्ति'],
    readingTimeMinutes: 7,
  },
  {
    id: 'sanatan-on-grief',
    slug: 'sanatan-on-grief',
    titleEn: 'What Sanatan Wisdom Says About Grief',
    titleHi: 'शोक पर सनातन ज्ञान',
    sanskritSubtitle: 'अशोच्यानन्वशोचस्त्वम्',
    questionEn: 'What do Hindu scriptures say about grief and purpose?',
    questionHi: 'हिंदू शास्त्र शोक और जीवन-उद्देश्य के बारे में क्या कहते हैं?',
    mastersFocusEn: 'Krishna to grieving Arjuna, the Upanishadic Self, saints who sang through loss.',
    introduction: {
      en: 'Gita 2.11 begins where grief begins: “You grieve for those who should not be grieved for.” Krishna neither dismisses tears nor leaves Arjuna inside them; he widens the seer.',
      hi: 'गीता २.११ वहीं आरंभ होती है जहाँ शोक आरंभ होता है — “अशोच्यों के लिए तुम शोक करते हो।” श्रीकृष्ण आँसुओं का तिरस्कार नहीं करते, न ही अर्जुन को उसी में छोड़ते हैं; वे दृष्टा को विस्तार देते हैं।',
    },
    whyHumansFace: {
      en: 'Grief binds love to a form that has changed. The heart protests impermanence because it loves deeply.',
      hi: 'शोक प्रेम को उस रूप से बाँध देता है जो बदल गया है। हृदय अनित्यता का विरोध करता है क्योंकि वह गहन प्रेम करता है।',
    },
    scripturalFoundations: {
      en: 'The Gita distinguishes the perishing body from the imperishable Self; the Upanishads place bliss beyond loss. The saints add the lived portion: Mira, Tulsidas, and Ramakrishna carried grief into song and service.',
      hi: 'गीता नश्वर शरीर को अविनाशी आत्मा से पृथक् करती है; उपनिषद् हानि से परे आनंद रखते हैं। संत अनुभूत भाग जोड़ते हैं — मीरा, तुलसी और रामकृष्ण ने शोक को भजन और सेवा में ढाला।',
    },
    verseLenses: [
      {
        topicSlug: 'fear-and-courage',
        verseId: 'bg-16-1',
        arthEn: 'Fearlessness here includes grief’s fear: the dread that love has nowhere to go.',
        arthHi: 'यहाँ अभय में शोक का भय भी समाहित है — वह आशंका कि प्रेम का अब कोई ठिकाना नहीं।',
        vyakhyaEn: 'Ramakrishna’s counsel after loss was practice, not theory: hold to the holy name and to serving the living.',
        vyakhyaHi: 'हानि के बाद रामकृष्ण का परामर्श सिद्धांत नहीं, साधना था — पवित्र नाम थामो और जीवों की सेवा करो।',
        modernContextEn: 'Grief needs care, not fixing. If sorrow is heavy or persistent, lean on trusted people and qualified counsel alongside reading.',
        modernContextHi: 'शोक को सुधार नहीं, देखभाल चाहिए। यदि दुख भारी या दीर्घस्थायी हो, तो पठन के साथ विश्वस्त जनों और योग्य परामर्श का सहारा लें।',
        lineageIds: ['ramakrishna', 'mirabai', 'tulsidas'],
      },
      {
        topicSlug: 'stress-and-worry',
        verseId: 'bg-2-66',
        arthEn: 'Peace returns not by forgetting the departed but by centering the mind that remembers them.',
        arthHi: 'शांति दिवंगत को भुलाने से नहीं, उनका स्मरण करने वाले मन को स्थिर करने से लौटती है।',
        vyakhyaEn: 'Tulsidas shows remembrance turned into service; the Gita verse gives the inner discipline of that turn.',
        vyakhyaHi: 'तुलसी स्मरण को सेवा में ढालते दिखाते हैं; गीता का श्लोक उस मोड़ का आंतरिक अनुशासन देता है।',
        modernContextEn: 'One small steady act of remembrance or service today — done slowly — more than a day of scrolling.',
        modernContextHi: 'आज स्मरण या सेवा का एक छोटा स्थिर कार्य — धीरे-धीरे — पूरे दिन स्क्रॉल करने से अधिक है।',
        lineageIds: ['tulsidas', 'chaitanya'],
      },
    ],
    lineageIds: ['vyasa', 'yajnavalkya', 'tulsidas', 'mirabai', 'ramakrishna'],
    sageNote: {
      en: 'Scripture authorizes grief and refuses to end there; the saints demonstrate the crossing, each in their own voice.',
      hi: 'शास्त्र शोक को स्वीकार करता है और वहीं समाप्त नहीं होता; संत अपने-अपने स्वर में उस पार जाना दिखाते हैं।',
    },
    reflectionQuestions: [
      { en: 'What love inside this grief can become service?', hi: 'इस शोक के भीतर कौन सा प्रेम सेवा बन सकता है?' },
    ],
    contemplationPrompts: [
      { en: 'Light no feed. Sit with one memory, then one breath, then one kind act.', hi: 'कोई फ़ीड न जलाएँ। एक स्मृति, फिर एक श्वास, फिर एक सत्कर्म के साथ बैठें।' },
      { en: 'If distress feels unmanageable, reach a counselor or helpline. Scripture is not a substitute for care.', hi: 'यदि व्यथा असह्य लगे, तो परामर्शदाता या सहायता-सेवा से संपर्क करें। शास्त्र देखभाल का विकल्प नहीं।' },
    ],
    relatedPathways: ['gita-on-fear', 'saints-on-devotion', 'upanishads-on-self'],
    discovery: {
      emotions: ['grief', 'sorrow', 'loss'],
      challenges: ['bereavement', 'purpose after loss'],
      questions: ['What do Hindu scriptures say about grief?', 'What do Hindu scriptures say about purpose?'],
      scriptures: ['bhagavadgita', 'taittiriya'],
      saints: ['tulsidas', 'mirabai', 'ramakrishna'],
      concepts: ['wisdom', 'faith', 'detachment'],
    },
    searchKeywords: ['sanatan grief wisdom', 'gita on grief loss', 'शोक पर शास्त्र', 'जीवन उद्देश्य शास्त्र'],
    readingTimeMinutes: 8,
  },
];

export function getPathway(slugOrId: string): WisdomPathway | undefined {
  return wisdomPathways.find((p) => p.slug === slugOrId || p.id === slugOrId);
}
