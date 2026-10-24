/**
 * Dharma Granth: Emotion-First Wisdom Exploration Engine
 * 
 * Maps 10 core emotional challenges into grounding pauses, primary verses,
 * root philosophical insights, reflection inquiries, and practical micro-actions.
 */

import type { EmotionWisdomRecord, CanonicalVerseRef } from './types';

export const CORE_EMOTIONS: readonly EmotionWisdomRecord[] = [
  {
    id: 'anxious',
    emotionEn: 'I am anxious',
    emotionHi: 'मैं चिंतित / व्याकुल हूँ',
    sanskritTerm: 'उद्विग्न (Udveg / Chitta-Vikshepa)',
    intensityBadgeEn: 'Restless mind & racing thoughts',
    intensityBadgeHi: 'मन की चंचलता और अनिश्चितता',
    rootInsightEn: 'The mind is by nature restless and turbulent, like the wind. Do not fight it with hostility; patiently and gently guide attention back to the breath and the single duty of this present moment.',
    rootInsightHi: 'मन स्वभाव से ही वायु की तरह चंचल और वेगवान है। इसके साथ युद्ध करने के बजाय धैर्यपूर्वक और प्रेम से अपनी चेतना को श्वास और वर्तमान कर्तव्य पर वापस लाएँ।',
    pauseExercise: {
      durationSeconds: 90,
      titleEn: 'Prana-Samhita Breath Anchor',
      titleHi: 'प्राण-संयम श्वास ध्यान',
      instructionsEn: 'Inhale gently for 4 counts, hold effortlessly for 2 counts, exhale slowly for 6 counts. Repeat for 6 breath cycles. Notice that awareness remains still while breath moves.',
      instructionsHi: '4 गिनती तक श्वास भीतर लें, 2 गिनती तक सहज रोकें, 6 गिनती में धीरे-धीरे बाहर छोड़ें। 6 बार दोहराएँ। अनुभव करें कि श्वास के आने-जाने के बीच आपकी चेतना स्थिर है।',
    },
    primaryVerses: [
      {
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 6,
        verseNumber: 26,
        citation: 'Bhagavad Gita 6.26',
        citationHi: 'भगवद्गीता 6.26',
        sanskritDevanagari: 'यतो यतो निश्चरति मनश्चञ्चलमस्थिरम्।\nततस्ततो नियम्यैतदात्मन्येव वशं नयेत्॥',
        sanskritTransliteration: 'yato yato niścarati manaś cañcalam asthiram | tatas tato niyamyaitad ātmany eva vaśaṁ nayet ||',
        translationHi: 'यह चंचल और अस्थिर मन जिस-जिस कारण से सांसारिक विषयों में भटकता है, उस-उस विषय से इसे रोककर बार-बार आत्मा में ही स्थिर करना चाहिए।',
        translationEn: 'From wherever the fickle and unsteady mind wanders away, from there one should gently bring it back and center it firmly upon the Self.',
        readerHref: '/scripture/bhagavadgita/chapter/6/verse/26/',
      },
      {
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 6,
        verseNumber: 35,
        citation: 'Bhagavad Gita 6.35',
        citationHi: 'भगवद्गीता 6.35',
        sanskritDevanagari: 'असंशयं महाबाहो मनो दुर्निग्रहं चलम्।\nअभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते॥',
        sanskritTransliteration: 'asaṁśayaṁ mahā-bāho mano durnigrahaṁ calam | abhyāsena tu kaunteya vairāgyeṇa ca gṛhyate ||',
        translationHi: 'हे महाबाहो! इसमें तनिक भी संदेह नहीं कि मन चंचल और वश में करने में अत्यन्त कठिन है; किन्तु हे कौन्तेय, यह अभ्यास और वैराग्य से वश में हो जाता है।',
        translationEn: 'O mighty-armed one, undoubtedly the mind is restless and difficult to curb; but, O son of Kunti, by sustained practice and non-attachment, it is brought under mastery.',
        readerHref: '/scripture/bhagavadgita/chapter/6/verse/35/',
      },
    ],
    reflectionQuestions: [
      {
        questionEn: 'What imagined catastrophe is your mind currently treating as an absolute certainty?',
        questionHi: 'मन किस कल्पित संकट को अभी से निश्चित मानकर भयभीत हो रहा है?',
        hintEn: 'Notice that 95% of what the anxious mind forecasts never occurs.',
        hintHi: 'स्मरण रखें कि मन द्वारा कल्पित अधिकांश आशंकाएँ कभी घटित नहीं होतीं।',
      },
      {
        questionEn: 'What is the single constructive step within your physical control right now?',
        questionHi: 'इस क्षण आपके प्रत्यक्ष नियंत्रण में कौन-सा एक व्यावहारिक कदम है?',
      },
    ],
    practicalActions: [
      {
        actionEn: 'Place both feet firmly on the ground. Drink a glass of water slowly, feeling the coolness.',
        actionHi: 'दोनों पैर भूमि पर जमाएँ। एक गिलास जल धीरे-धीरे पिएँ और उसकी शीतलता का अनुभव करें।',
        timeframe: 'immediate',
      },
      {
        actionEn: 'Write down your worry on paper, then close the notebook. Tell yourself: "I have recorded it; for the next 2 hours I am free to attend to my duty."',
        actionHi: 'अपनी चिंता को कागज़ पर लिख लें, फिर डायरी बंद कर दें। मन से कहें: "मैंने इसे नोट कर लिया है; अब अगले 2 घंटे मैं अपने कार्य में लगूँगा।"',
        timeframe: 'today',
      },
    ],
  },
  {
    id: 'stressed',
    emotionEn: 'I am stressed',
    emotionHi: 'मैं उद्विग्न / भारग्रस्त हूँ',
    sanskritTerm: 'श्राम / विशाद (Shrama / Vishada)',
    intensityBadgeEn: 'Overwhelmed by outcomes & deadlines',
    intensityBadgeHi: 'परिणामों और उत्तरदायित्व का अत्यधिक भार',
    rootInsightEn: 'Stress occurs when you mentally claim ownership over the cosmic results of action. Perform wholehearted action as an offering, and leave the unfolding of results to the vast universe.',
    rootInsightHi: 'उद्वेग तब उत्पन्न होता है जब हम भविष्य के परिणामों को अपने सिर पर लाद लेते हैं। निष्काम भाव से केवल अपने कर्तव्य पर ध्यान दें, परिणाम की चिंता ईश्वर पर छोड़ दें।',
    pauseExercise: {
      durationSeconds: 60,
      titleEn: 'Shoulder & Jaw Release',
      titleHi: 'कंधों और जबड़े का विश्राम',
      instructionsEn: 'Drop your shoulders down from your ears. Unclench your jaw and let your tongue rest loosely. Exhale fully with a soft sigh.',
      instructionsHi: 'कंधों को शिथिल छोड़ें, जबड़े का खिंचाव दूर करें और एक गहरी उसांस के साथ समस्त उद्वेग बाहर निकाल दें।',
    },
    primaryVerses: [
      {
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 2,
        verseNumber: 47,
        citation: 'Bhagavad Gita 2.47',
        citationHi: 'भगवद्गीता 2.47',
        sanskritDevanagari: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
        sanskritTransliteration: 'karmaṇy evādhikāras te mā phaleṣu kadācana | mā karma-phala-hetur bhūr mā te saṅgo \'stv akarmaṇi ||',
        translationHi: 'तुम्हारा अधिकार केवल कर्म में ही है, उसके फलों में कभी नहीं। इसलिए कर्मों के फल के हेतु मत बनो और तुम्हारी अकर्मण्यता में भी आसक्ति न हो।',
        translationEn: 'You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of results, nor let your mind attach to inaction.',
        readerHref: '/scripture/bhagavadgita/chapter/2/verse/47/',
      },
    ],
    reflectionQuestions: [
      {
        questionEn: 'Are you confusing hard work with emotional anxiety? Can you work diligently while remaining inwardly relaxed?',
        questionHi: 'क्या आप कठिन परिश्रम को मानसिक उद्वेग समझने की भूल कर रहे हैं? क्या शांत मन से कर्तव्य नहीं किया जा सकता?',
      },
    ],
    practicalActions: [
      {
        actionEn: 'Step away from all screens for 5 minutes. Walk 100 paces observing nature or physical surroundings.',
        actionHi: 'स्क्रीन से 5 मिनट दूर हटें। 100 कदम शांत होकर चलें।',
        timeframe: 'immediate',
      },
    ],
  },
  {
    id: 'angry',
    emotionEn: 'I feel angry',
    emotionHi: 'मुझे अत्यधिक क्रोध आ रहा है',
    sanskritTerm: 'क्रोध / अमर्ष (Krodha / Amarsha)',
    intensityBadgeEn: 'Inner heat & destructive urge',
    intensityBadgeHi: 'भीतरी जलन और प्रतिशोध का वेग',
    rootInsightEn: 'Anger blinds wisdom. A single sentence uttered in fury can burn bridges constructed over decades. Treat anger as a sudden inner fire: do not pour speech upon it; step back and let the flames starve.',
    rootInsightHi: 'क्रोध बुद्धि को अंधा कर देता है। आवेश में बोला गया एक शब्द वर्षों के सम्बंध जला देता है। क्रोध को अग्नि की तरह देखें—उसमें वाणी का ईंधन न डालें; मौन रहकर उसे शांत होने दें।',
    pauseExercise: {
      durationSeconds: 120,
      titleEn: 'Sheetali Cooling Practice',
      titleHi: 'शीतली प्राणायाम',
      instructionsEn: 'Inhale through the mouth like sipping cool water; exhale slowly through both nostrils. Feel the immediate reduction of cranial heat.',
      instructionsHi: 'मुख से शीतल वायु भीतर खींचें और नासिका से धीरे-धीरे गर्म श्वास बाहर छोड़ें। सिर और हृदय की तपन शांत होगी।',
    },
    primaryVerses: [
      {
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 2,
        verseNumber: 63,
        citation: 'Bhagavad Gita 2.63',
        citationHi: 'भगवद्गीता 2.63',
        sanskritDevanagari: 'क्रोधाद्भवति संमोहः संमोहात्स्मृतिविभ्रमः।\nस्मृतिभ्रंशाद् बुद्धिनाशो बुद्धिनाशात्प्रणश्यति॥',
        sanskritTransliteration: 'krodhād bhavati saṁmohaḥ saṁmohāt smṛti-vibhramaḥ | smṛti-bhraṁśād buddhi-nāśo buddhi-nāśāt praṇaśyati ||',
        translationHi: 'क्रोध से अविवेक और मूढ़भाव उत्पन्न होता है; मूढ़भाव से स्मृति भ्रमित हो जाती है; स्मृति-भ्रम से बुद्धि का नाश होता है और बुद्धि के नाश से मनुष्य का पतन हो जाता है।',
        translationEn: 'From anger arises delusion; from delusion confusion of memory; from confusion of memory destruction of discernment; and by destruction of discernment, one is ruined.',
        readerHref: '/scripture/bhagavadgita/chapter/2/verse/63/',
      },
    ],
    reflectionQuestions: [
      {
        questionEn: 'If you wait 24 hours before responding, what will you regret not saying? (Usually, nothing.)',
        questionHi: 'यदि आप 24 घंटे उत्तर न दें, तो क्या आपको मौन रहने पर पश्चाताप होगा?',
      },
    ],
    practicalActions: [
      {
        actionEn: 'Do not hit "Send" or speak a critical word right now. Put down your phone for 15 minutes.',
        actionHi: 'इस क्षण कोई संदेश न भेजें और न कोई कटु वचन बोलें। 15 मिनट के लिए फोन रख दें।',
        timeframe: 'immediate',
      },
    ],
  },
  {
    id: 'lonely',
    emotionEn: 'I feel lonely',
    emotionHi: 'मैं अकेला / उपेक्षित अनुभव कर रहा हूँ',
    sanskritTerm: 'एकाकीत्व / असहायता (Ekakitva / Asahayatva)',
    intensityBadgeEn: 'Feeling unseen & separated',
    intensityBadgeHi: 'अलगाव और स्नेह की शून्यता',
    rootInsightEn: 'Solitude is not a curse; when illuminated by wisdom, loneliness transforms into sacred stillness (Ekanta). The Supreme indweller resides in the heart of all beings and never abandons you.',
    rootInsightHi: 'अकेलापन कोई अभिशाप नहीं है; ज्ञान से देखने पर यह पवित्र एकांत बन जाता है। परमात्मा आपके हृदय-गुहा में सदा विद्यमान हैं और कभी आपका साथ नहीं छोड़ते।',
    pauseExercise: {
      durationSeconds: 90,
      titleEn: 'Hridaya Heart Presence',
      titleHi: 'हृदय ध्यान',
      instructionsEn: 'Rest your right palm on the center of your chest. Feel the warmth of your own heartbeat. Whisper: "The eternal Friend is here within."',
      instructionsHi: 'अपनी दाईं हथेली छाती के मध्य में रखें। हृदय की धड़कन का अनुभव करें और मन में कहें: "परम सखा मेरे भीतर सदा उपस्थित हैं।"',
    },
    primaryVerses: [
      {
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 6,
        verseNumber: 30,
        citation: 'Bhagavad Gita 6.30',
        citationHi: 'भगवद्गीता 6.30',
        sanskritDevanagari: 'यो मां पश्यति सर्वत्र सर्वं च मयि पश्यति।\nतस्याहं न प्रणश्यामि स च मे न प्रणश्यति॥',
        sanskritTransliteration: 'yo māṁ paśyati sarvatra sarvaṁ ca mayi paśyati | tasyāhaṁ na praṇaśyāmi sa ca me na praṇaśyati ||',
        translationHi: 'जो पुरुष मुझे सब भूतों में देखता है और सब भूतों को मुझमें देखता है, उसके लिए मैं कभी अदृश्य नहीं होता और वह मेरे लिए कभी अदृश्य नहीं होता।',
        translationEn: 'For one who sees Me everywhere and sees everything in Me, I am never lost, nor is that person ever lost to Me.',
        readerHref: '/scripture/bhagavadgita/chapter/6/verse/30/',
      },
    ],
    reflectionQuestions: [
      {
        questionEn: 'How can you shift from demanding connection from the world to offering kindness to someone else today?',
        questionHi: 'संसार से ध्यान माँगने के बजाय आज आप किसी अन्य व्यक्ति को निःस्वार्थ स्नेह कैसे दे सकते हैं?',
      },
    ],
    practicalActions: [
      {
        actionEn: 'Send a genuine message of encouragement or gratitude to an old acquaintance or elder family member.',
        actionHi: 'किसी पुराने मित्र या परिवार के बुजुर्ग को एक कृतज्ञता भरा संदेश भेजें।',
        timeframe: 'today',
      },
    ],
  },
  {
    id: 'lost',
    emotionEn: 'I feel lost',
    emotionHi: 'मैं दिग्भ्रमित / दिशाहीन महसूस कर रहा हूँ',
    sanskritTerm: 'मोह / भ्रान्ति (Moha / Bhranti)',
    intensityBadgeEn: 'Confusion at the crossroads',
    intensityBadgeHi: 'कर्तव्य और निर्णय का अंधकार',
    rootInsightEn: 'Arjuna himself collapsed on the battlefield, helpless and confused. Sincere bewilderment is not failure; it is the essential prerequisite for receiving higher wisdom.',
    rootInsightHi: 'अर्जुन भी कुरुक्षेत्र में धनुष रखकर व्याकुल हो गया था। यह संशय दुर्बलता नहीं, बल्कि सच्चे आत्म-ज्ञान और मार्गदर्शन की पहली सीढ़ी है।',
    pauseExercise: {
      durationSeconds: 90,
      titleEn: 'Surrender of the Intellectual Burden',
      titleHi: 'शरणागति भाव',
      instructionsEn: 'Breathe out and silently acknowledge: "Right now I do not know. I surrender the need to solve everything in this hour."',
      instructionsHi: 'श्वास छोड़ते हुए मन से स्वीकार करें: "इस समय मुझे उत्तर नहीं पता। मैं इस घबराहट को शांत करता हूँ।"',
    },
    primaryVerses: [
      {
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 2,
        verseNumber: 7,
        citation: 'Bhagavad Gita 2.7',
        citationHi: 'भगवद्गीता 2.7',
        sanskritDevanagari: 'कार्पण्यदोषोपहतस्वभावः\nपृच्छामि त्वां धर्मसंमूढचेताः।\nयच्छ्रेयः स्यान्निश्चितं ब्रूहि तन्मे\nशिष्यस्तेऽहं शाधि मां त्वां प्रपन्नम्॥',
        sanskritTransliteration: 'kārpaṇya-doṣopahata-svabhāvaḥ pṛcchāmi tvāṁ dharma-saṁmūḍha-cetāḥ | yac chreyaḥ syān niścitaṁ brūhi tan me śiṣyas te \'haṁ śādhi māṁ tvāṁ prapannam ||',
        translationHi: 'कायरतारूप दोष से उपहत स्वभाव वाला और धर्म के विषय में भ्रमित-चित्त हुआ मैं आपसे पूछता हूँ कि जो निश्चित रूप से श्रेयस्कर हो, वह मुझे बताइए। मैं आपका शिष्य हूँ, आपकी शरण में आया हूँ, मुझे उपदेश दीजिए।',
        translationEn: 'My nature is stricken by the weakness of pity; my mind is bewildered about my duty. I ask You: tell me clearly what is best for me. I am Your disciple; instruct me, for I have taken refuge in You.',
        readerHref: '/scripture/bhagavadgita/chapter/2/verse/7/',
      },
    ],
    reflectionQuestions: [
      {
        questionEn: 'What is the one basic, unglamorous moral duty directly in front of you today?',
        questionHi: 'आज आपके ठीक सामने कौन-सा एक सीधा और सच्चा कर्तव्य उपस्थित है?',
      },
    ],
    practicalActions: [
      {
        actionEn: 'Do not make any irreversible life decisions while in confusion. Clean your immediate physical workspace.',
        actionHi: 'भ्रम की स्थिति में कोई बड़ा निर्णय न लें। अपने आस-पास का कमरा या मेज व्यवस्थित करें।',
        timeframe: 'today',
      },
    ],
  },
  {
    id: 'grieving',
    emotionEn: 'I am grieving',
    emotionHi: 'मैं शोक में हूँ / प्रियजन का वियोग',
    sanskritTerm: 'शोक / विपाद (Shoka / Vishada)',
    intensityBadgeEn: 'Heartache of loss & departure',
    intensityBadgeHi: 'गहरा वियोग और हृदय का भार',
    rootInsightEn: 'Grief is the holy testament of love. Yet the soul of your loved one was never born and never dies. Like garments worn and laid aside, consciousness travels forward unblemished and eternal.',
    rootInsightHi: 'शोक प्रेम का साक्ष्य है। परन्तु आत्मा न कभी जन्म लेती है और न कभी मरती है। जैसे मनुष्य पुराने वस्त्र त्यागकर नए धारण करता है, वैसे ही आत्मा अमर यात्रा करती है।',
    pauseExercise: {
      durationSeconds: 120,
      titleEn: 'Peace to the Departed',
      titleHi: 'शांति-प्रार्थना',
      instructionsEn: 'Envision the soul surrounded by golden, sacred light. Breathe peace toward their journey: "Om Shanti Shanti Shanti."',
      instructionsHi: 'दिवंगत आत्मा को दिव्य प्रकाश से घिरा देखें और उनके लिए मंगल प्रार्थना करें: "ॐ शान्तिः शान्तिः शान्तिः।"',
    },
    primaryVerses: [
      {
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 2,
        verseNumber: 22,
        citation: 'Bhagavad Gita 2.22',
        citationHi: 'भगवद्गीता 2.22',
        sanskritDevanagari: 'वासांसि जीर्णानि यथा विहाय\nनवानि गृह्णाति नरोऽपराणि।\nतथा शरीराणि विहाय जीर्णा-\nन्यन्यानि संयाति नवानि देही॥',
        sanskritTransliteration: 'vāsāṁsi jīrṇāni yathā vihāya navāni gṛhṇāti naro \'parāṇi | tathā śarīrāṇi vihāya jīrṇāny anyāni saṁyāti navāni dehī ||',
        translationHi: 'जैसे मनुष्य पुराने वस्त्रों को त्यागकर दूसरे नए वस्त्रों को ग्रहण करता है, वैसे ही जीवात्मा पुराने शरीरों को त्यागकर दूसरे नए शरीरों को प्राप्त करता है।',
        translationEn: 'Just as a person casts off worn-out garments and puts on others that are new, even so does the embodied soul cast off worn-out bodies and enter into others that are new.',
        readerHref: '/scripture/bhagavadgita/chapter/2/verse/22/',
      },
    ],
    reflectionQuestions: [
      {
        questionEn: 'How can you honor the noble qualities of the one you lost through your own daily actions and compassion?',
        questionHi: 'आप अपने प्रियजन के सद्गुणों को अपने आचरण और सेवा में कैसे जीवित रख सकते हैं?',
      },
    ],
    practicalActions: [
      {
        actionEn: 'Allow tears without self-criticism. Light a quiet lamp or sit in serene reflection for 10 minutes.',
        actionHi: 'अपने आँसुओं को दबाएँ नहीं। एक दीपक जलाकर 10 मिनट शांत भाव से बैठें।',
        timeframe: 'evening',
      },
    ],
  },
  {
    id: 'directionless',
    emotionEn: 'I feel directionless',
    emotionHi: 'मुझे कोई मार्ग दिखाई नहीं दे रहा',
    sanskritTerm: 'निर्दिशा / उत्साह-हीनता (Nirdisha)',
    intensityBadgeEn: 'Apathy & lack of vitality',
    intensityBadgeHi: 'उत्साह की कमी और ठहराव',
    rootInsightEn: 'You do not need a grand 10-year master plan to live meaningfully. When you offer your present work with dedication, the next stepping stone is illuminated naturally.',
    rootInsightHi: 'जीवन के लिए पचास वर्षों की योजना की आवश्यकता नहीं है। जो कर्तव्य अभी आपके हाथ में है, उसे पूरी निष्ठा से करें; अगला मार्ग अपने आप खुल जाएगा।',
    pauseExercise: {
      durationSeconds: 60,
      titleEn: 'Awakening the Inner Sun',
      titleHi: 'सूर्य-स्मरण',
      instructionsEn: 'Inhale deeply envisioning golden sunlight filling your solar plexus. Exhale lethargy and doubt.',
      instructionsHi: 'गहरी श्वास लेते हुए नाभि-केन्द्र में सूर्य के तेज का स्मरण करें। समस्त आलस्य को बाहर छोड़ें।',
    },
    primaryVerses: [
      {
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 18,
        verseNumber: 46,
        citation: 'Bhagavad Gita 18.46',
        citationHi: 'भगवद्गीता 18.46',
        sanskritDevanagari: 'यतः प्रवृत्तिर्भूतानां येन सर्वमिदं ततम्।\nस्वकर्मणा तमभ्यर्च्य सिद्धिं विन्दति मानवः॥',
        sanskritTransliteration: 'yataḥ pravṛttir bhūtānāṁ yena sarvam idaṁ tatam | sva-karmaṇā tam abhyarcya siddhiṁ vindati mānavaḥ ||',
        translationHi: 'जिस परमात्मा से संपूर्ण प्राणियों की उत्पत्ति हुई है और जिससे यह संपूर्ण संसार व्याप्त है, उस ईश्वर की अपने स्वाभाविक कर्मों द्वारा पूजा करके मनुष्य परम सिद्धि को प्राप्त कर लेता है।',
        translationEn: 'By worshiping Him from whom all beings arise and by whom all this universe is pervaded through the performance of one’s own duty, a human being attains perfection.',
        readerHref: '/scripture/bhagavadgita/chapter/18/verse/46/',
      },
    ],
    reflectionQuestions: [
      {
        questionEn: 'If your daily work was an altar of service rather than a career race, how would your posture change today?',
        questionHi: 'यदि आपका दैनिक कार्य केवल जीविका न होकर साधना बन जाए, तो आपका दृष्टिकोण कैसे बदलेगा?',
      },
    ],
    practicalActions: [
      {
        actionEn: 'Pick one neglected chore or work item and finish it completely with total presence.',
        actionHi: 'किसी एक छोटे अधूरे काम को आज पूरे मनोयोग से पूरा करें।',
        timeframe: 'today',
      },
    ],
  },
  {
    id: 'fear-failure',
    emotionEn: 'I fear failure',
    emotionHi: 'मुझे असफलता का भय सता रहा है',
    sanskritTerm: 'पराजय-भीति (Parajaya-Bhiti)',
    intensityBadgeEn: 'Performance anxiety & dread of judgment',
    intensityBadgeHi: 'प्रतिष्ठा जाने और हारने का डर',
    rootInsightEn: 'In the cosmic university of Dharma, there is no wasted effort. Sincere labor permanently purifies the soul; setbacks are merely adjustments from the cosmic guide.',
    rootInsightHi: 'धर्म के मार्ग में किया गया निष्कपट प्रयास कभी व्यर्थ नहीं जाता। बाहरी हार केवल नई सीख है; आत्मा सदा अजेय रहती है।',
    pauseExercise: {
      durationSeconds: 90,
      titleEn: 'Abhaya Mudra Grounding',
      titleHi: 'अभय-मुद्रा ध्यान',
      instructionsEn: 'Raise your right hand gently facing forward (Abhaya Mudra). Breathe fearlessness into your spine.',
      instructionsHi: 'दायाँ हाथ अभय मुद्रा में रखें और रीढ़ को सीधा करके आत्म-विश्वास की श्वास लें।',
    },
    primaryVerses: [
      {
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 2,
        verseNumber: 40,
        citation: 'Bhagavad Gita 2.40',
        citationHi: 'भगवद्गीता 2.40',
        sanskritDevanagari: 'नेहाभिक्रमनाशोऽस्ति प्रत्यवायो न विद्यते।\nस्वल्पमप्यस्य धर्मस्य त्रायते महतो भयात्॥',
        sanskritTransliteration: 'nehābhikrama-nāśo \'sti pratyavāyo na vidyate | sv-alpam apy asya dharmasya trāyate mahato bhayāt ||',
        translationHi: 'इस निष्काम कर्मयोग के मार्ग में आरम्भ किए गए प्रयास का कभी नाश नहीं होता और न कोई विपरीत फल होता है। इस धर्म का थोड़ा-सा भी आचरण बड़े भारी भय से रक्षा कर लेता है।',
        translationEn: 'In this path of selfless action there is no loss of effort, nor is there any adverse result. Even a little practice of this Dharma protects one from the greatest fear.',
        readerHref: '/scripture/bhagavadgita/chapter/2/verse/40/',
      },
    ],
    reflectionQuestions: [
      {
        questionEn: 'Are you fearing the outcome, or are you fearing what other people might think of you?',
        questionHi: 'क्या आप काम के परिणाम से डर रहे हैं, या इस बात से कि लोग क्या कहेंगे?',
      },
    ],
    practicalActions: [
      {
        actionEn: 'Do the task you are avoiding for just 10 minutes without judging the quality of output.',
        actionHi: 'जिस कार्य से भय लग रहा है, उसे केवल 10 मिनट के लिए बिना किसी परिणाम की चिंता किए आरम्भ करें।',
        timeframe: 'today',
      },
    ],
  },
  {
    id: 'need-courage',
    emotionEn: 'I need courage',
    emotionHi: 'मुझे साहस और बल की आवश्यकता है',
    sanskritTerm: 'धैर्य / शौर्य (Dhairya / Shaurya)',
    intensityBadgeEn: 'Confronting daunting adversity',
    intensityBadgeHi: 'कठिन परीक्षा का सामना करने की शक्ति',
    rootInsightEn: 'Heroic courage (*Dhairya*) is your birthright. Cast away petty faint-heartedness; rise up like a lion of Dharma and stand your ground.',
    rootInsightHi: 'साहस आपका जन्मसिद्ध अधिकार है। क्षुद्र हृदय-दुर्बलता को त्यागें और धर्म-योद्धा की तरह सत्य के पक्ष में खड़े हों।',
    pauseExercise: {
      durationSeconds: 60,
      titleEn: 'Klaibyam Release',
      titleHi: 'दुर्बलता का त्याग',
      instructionsEn: 'Inhale deeply, straightening your spine. With a firm exhale, release all self-doubt and hesitation.',
      instructionsHi: 'रीढ़ सीधी करें, गहरी श्वास लें और दृढ़तापूर्वक आत्म-संशय को बाहर निकाल दें।',
    },
    primaryVerses: [
      {
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 2,
        verseNumber: 3,
        citation: 'Bhagavad Gita 2.3',
        citationHi: 'भगवद्गीता 2.3',
        sanskritDevanagari: 'क्लैब्यं मा स्म गमः पार्थ नैतत्त्वय्युपपद्यते।\nक्षुद्रं हृदयदौर्बल्यं त्यक्त्वोत्तिष्ठ परन्तप॥',
        sanskritTransliteration: 'klaibyaṁ mā sma gamaḥ pārtha naitat tvayy upapadyate | kṣudraṁ hṛdaya-daurbalyaṁ tyaktvottiṣṭha paran-tapa ||',
        translationHi: 'हे पार्थ! नपुंसकता (कायरता) को मत प्राप्त हो, यह तुम्हारे योग्य नहीं है। हे परन्तप! हृदय की इस तुच्छ दुर्बलता को त्यागकर युद्ध के लिए खड़े हो जाओ।',
        translationEn: 'Do not yield to unmanliness, O son of Pritha; it does not befit you. Shake off this petty faint-heartedness and arise, O chastiser of the enemy!',
        readerHref: '/scripture/bhagavadgita/chapter/2/verse/3/',
      },
    ],
    reflectionQuestions: [
      {
        questionEn: 'What brave truth or difficult boundary must you speak today to remain true to your soul?',
        questionHi: 'आज आपको अपने आत्म-सम्मान और सत्य के लिए कौन-सा साहसिक कदम उठाना है?',
      },
    ],
    practicalActions: [
      {
        actionEn: 'Take the first decisive step you have been postponing for weeks. Take it now.',
        actionHi: 'जिस कठिन निर्णय को आप हफ्तों से टाल रहे थे, उसका पहला कदम अभी उठाएँ।',
        timeframe: 'immediate',
      },
    ],
  },
  {
    id: 'need-discipline',
    emotionEn: 'I need discipline',
    emotionHi: 'मुझे आत्म-नियंत्रण और संकल्प चाहिए',
    sanskritTerm: 'तपस् व संयम (Tapas & Sanyama)',
    intensityBadgeEn: 'Overcoming lethargy & distraction',
    intensityBadgeHi: 'आलस्य और भटकाव पर विजय',
    rootInsightEn: 'Discipline is not grim austerity or self-punishment; it is the focused laser of prana cutting through delusion. Self-mastery lifts you to spiritual sovereignty.',
    rootInsightHi: 'अनुशासन स्वयं को कष्ट देना नहीं है; यह अपनी बिखरी हुई शक्तियों को एकाग्र करके जीवन को दिव्य बनाने की कला है।',
    pauseExercise: {
      durationSeconds: 90,
      titleEn: 'Trataka Center Focus',
      titleHi: 'एकाग्रता दृष्टि',
      instructionsEn: 'Fix your physical gaze on a single distant point without blinking for 30 seconds. Feel the mental chatter stop.',
      instructionsHi: '30 सेकेण्ड तक किसी एक बिंदु पर पलक झपकाए बिना देखें। मन की चंचलता तुरंत शांत होगी।',
    },
    primaryVerses: [
      {
        scriptureId: 'bhagavadgita',
        scriptureName: 'Bhagavad Gita',
        scriptureNameHi: 'भगवद्गीता',
        chapterNumber: 6,
        verseNumber: 5,
        citation: 'Bhagavad Gita 6.5',
        citationHi: 'भगवद्गीता 6.5',
        sanskritDevanagari: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥',
        sanskritTransliteration: 'uddhared ātmanātmānaṁ nātmānam avasādayet | ātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ ||',
        translationHi: 'मनुष्य को चाहिए कि वह अपने मन द्वारा अपना उद्धार करे, अपना पतन न होने दे; क्योंकि यह मन ही अपना मित्र है और यही मन अपना शत्रु है।',
        translationEn: 'One must elevate oneself by one’s own mind, and not degrade oneself; for the mind alone is the friend of the conditioned soul, and the mind alone is its enemy.',
        readerHref: '/scripture/bhagavadgita/chapter/6/verse/5/',
      },
    ],
    reflectionQuestions: [
      {
        questionEn: 'Is your mind your trusted friend right now, or is it behaving like a runaway rebel?',
        questionHi: 'क्या आपका मन इस समय आपका मित्र है, या आपके ही विरुद्ध कार्य कर रहा है?',
      },
    ],
    practicalActions: [
      {
        actionEn: 'Commit to one micro-practice: no phone for the first 30 minutes after waking tomorrow morning.',
        actionHi: 'कल प्रातः सोकर उठने के बाद पहले 30 मिनट तक फोन को स्पर्श न करने का संकल्प लें।',
        timeframe: 'evening',
      },
    ],
  },
];

export function getEmotionById(id: string): EmotionWisdomRecord | undefined {
  return CORE_EMOTIONS.find((e) => e.id === id);
}

export function searchEmotions(query: string): EmotionWisdomRecord[] {
  const q = query.toLowerCase().trim();
  if (!q) return [...CORE_EMOTIONS];
  return CORE_EMOTIONS.filter((e) =>
    e.emotionEn.toLowerCase().includes(q) ||
    e.emotionHi.includes(q) ||
    e.sanskritTerm.toLowerCase().includes(q) ||
    e.rootInsightEn.toLowerCase().includes(q) ||
    e.rootInsightHi.includes(q)
  );
}
