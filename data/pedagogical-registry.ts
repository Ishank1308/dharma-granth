/**
 * Central Pedagogical Scripture Registry for Dharma Granth
 * Maps canonical scripture verses to educational breakdowns.
 */

import { GITA_2_47_PEDAGOGICAL, type PedagogicalVerseData } from './pedagogical-gita-2-47';
import {
  GITA_3_9_PEDAGOGICAL,
  GITA_3_21_PEDAGOGICAL,
  GITA_3_30_PEDAGOGICAL,
  GITA_3_35_PEDAGOGICAL,
  GITA_3_42_PEDAGOGICAL,
} from './pedagogical-gita-ch3';
import {
  ISHA_2_PEDAGOGICAL,
  ISHA_4_PEDAGOGICAL,
  ISHA_6_PEDAGOGICAL,
  ISHA_7_PEDAGOGICAL,
} from './pedagogical-isha';

export const GITA_2_11_PEDAGOGICAL: PedagogicalVerseData = {
  scriptureId: 'bhagavadgita',
  chapterId: 2,
  verseId: 11,
  scriptureTitle: 'Bhagavad Gita',
  scriptureTitleSanskrit: 'श्रीमद्भगवद्गीता',
  chapterTitle: 'Sankhya Yoga',
  chapterTitleSanskrit: 'सांख्ययोग',
  sanskrit: 'श्रीभगवानुवाच\nअशोच्यानन्वशोचस्त्वं प्रज्ञावादांश्च भाषसे ।\nगतासूनगतासूंश्च नानुशोचन्ति पण्डिताः ॥',
  transliteration: 'śrī-bhagavānuvāca\naśocyānanvaśocastvaṁ prajñāvādāṁśca bhāṣase |\ngatāsūnagatāsūṁśca nānuśocanti paṇḍitāḥ ||',
  meter: 'अनुष्टुप् (Anuṣṭubh — 32 syllables)',
  epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',

  inOneLineEn: 'You mourn for those who need no grief, yet speak words of wisdom; the truly wise mourn neither for the living nor for the dead.',
  inOneLineHi: 'तुम उनके लिए शोक करते हो जो शोक के योग्य नहीं हैं, और विद्वानों जैसी बातें करते हो; ज्ञानी लोग न जीवितों के लिए शोक करते हैं और न मृतकों के लिए।',

  simpleMeaningEn:
    'Krishna opens his formal teaching with a decisive diagnostic. Arjuna has spoken elaborately about ethics and social decay, yet his grief reveals that he still mistakes temporal bodily existence for ultimate reality. The truly wise understand the eternal nature of consciousness, grieving neither for those whose breath has ceased nor for those who still live in bodies.',
  simpleMeaningHi:
    'श्रीकृष्ण अर्जुन के शोक को दूर करने के लिए पहला उपदेश देते हैं। वे कहते हैं कि तुम ज्ञानियों जैसे तर्क दे रहे हो, परंतु तुम्हारा चित्त अज्ञानवश शोक में डूबा है। जो यथार्थ ज्ञानी हैं, वे जानते हैं कि आत्मा अविनाशी है; इसलिए वे न तो जीवित प्राणियों के लिए व्यर्थ चिंता करते हैं और न ही शरीर त्याग चुके लोगों के लिए शोक करते हैं।',

  keyWords: [
    {
      pada: 'अशोच्यान् (Aśocyān)',
      iast: 'aśocyān',
      root: 'अ + शुच् (शोक न करने योग्य)',
      functionalMeaning: 'Those who are not fit to be grieved over.',
      functionalMeaningHi: 'जो शोक करने योग्य नहीं हैं।',
    },
    {
      pada: 'अन्वशोचः (Anvaśocaḥ)',
      iast: 'anvaśocaḥ',
      root: 'अनु + शुच् (शोक करना)',
      functionalMeaning: 'You have been lamenting or mourning.',
      functionalMeaningHi: 'तुम शोक कर रहे हो।',
    },
    {
      pada: 'प्रज्ञावादान् (Prajñāvādān)',
      iast: 'prajñāvādān',
      root: 'प्रज्ञा + वाद (ज्ञानियों के तर्क)',
      functionalMeaning: 'Words that sound like learned wisdom or intellectual doctrine.',
      functionalMeaningHi: 'विद्वानों जैसे तर्क और वचन।',
    },
    {
      pada: 'पण्डिताः (Paṇḍitāḥ)',
      iast: 'paṇḍitāḥ',
      root: 'पण्डा (आत्मबुद्धि)',
      functionalMeaning: 'The truly wise who discern the eternal Self from the temporal vehicle.',
      functionalMeaningHi: 'तत्वदर्शी ज्ञानी पुरुष।',
    },
  ],

  whyItMattersToday: [
    {
      title: 'Rationalizing Fear with Logic',
      titleHi: 'तर्कों से भय को छुपाना',
      text: 'We often construct elaborate intellectual justifications to avoid uncomfortable duties or difficult confrontations.',
    },
    {
      title: 'Theoretical Knowledge vs Lived Equanimity',
      titleHi: 'सैद्धांतिक ज्ञान बनाम वास्तविक संतुलन',
      text: 'Quoting lofty principles while remaining emotionally destabilized by daily events exposes the gap between study and realization.',
    },
    {
      title: 'Freedom from Unnecessary Sorrow',
      titleHi: 'शोक और अवसाद से मुक्ति',
      text: 'Recognizing that changing external situations cannot destroy inner conscious dignity frees us from paralyzing grief.',
    },
  ],

  modernExample: {
    context: 'Intellectualizing Inaction or Anxiety in High-Stakes Moments',
    contextHi: 'मुश्किल फैसले से बचने के लिए बौद्धिक तर्कों का सहारा लेना',
    scenarioEn:
      'When faced with an unavoidable but painful professional confrontation or exam, you might write long essays or debate endlessly on why the system is unfair or why effort is meaningless. A good coach or mentor pierces through the intellectual fog and asks: Are you arguing out of wisdom, or using clever words to mask your reluctance to step onto the field?',
    scenarioHi:
      'जब कोई छात्र या पेशेवर किसी कठिन परीक्षा या चुनौती से बचने के लिए लंबे-लंबे तर्कों से यह सिद्ध करने लगे कि यह प्रयास ही व्यर्थ है, तो यह प्रज्ञावाद है। सच्चा मार्गदर्शक पहचान लेता है कि यह ज्ञान नहीं, बल्कि भय का आवरण है।',
    disclaimer: 'समसामयिक संपादकीय उदाहरण · प्राचीन शास्त्र का मूल भाग नहीं (Editorial Modern Illustration · Not Scripture)',
  },

  whatItDoesNotMean: [
    {
      title: 'It does NOT mean: "Cold callousness toward genuine bereavement"',
      titleHi: 'यह शोकग्रस्त लोगों के प्रति संवेदनहीनता नहीं है',
      text: 'Krishna is addressing Arjuna’s paralyzing existential confusion regarding duty, not forbidding human empathy or emotional healing.',
    },
    {
      title: 'It does NOT mean: "That intellectual analysis is inherently bad"',
      titleHi: 'यह बौद्धिक विश्लेषण का विरोध नहीं है',
      text: 'Analysis is vital, but when reasoning is hijacked to justify weakness and avoidance of dharma, it becomes a trap.',
    },
  ],

  tryThisToday: {
    title: 'The Motive Check',
    titleHi: 'निर्णय के पीछे की मंशा की जांच',
    instructionEn:
      'Before spending time debating or complaining about an uncomfortable duty today, pause for 60 seconds and ask: "Am I reasoning with clarity, or am I searching for clever excuses to avoid discomfort?"',
    instructionHi:
      'आज जब भी किसी कर्तव्य से बचने के लिए कोई तर्क देने लगें, तो एक मिनट रुककर खुद से पूछें कि क्या यह सच्चा विवेक है या केवल असुविधा से बचने का बहाना?',
    duration: '1 minute',
  },

  reflectionQuestion: {
    en: 'Where in your daily life are you using articulate intellectual arguments to cover up a challenge you simply fear facing?',
    hi: 'अपने जीवन में आप किस चुनौती का सामना करने से बचने के लिए चतुर तर्कों का सहारा ले रहे हैं?',
  },

  traditionalCommentary: {
    shankara: {
      author: 'आदि शंकराचार्य (Adi Shankaracharya)',
      tradition: 'अद्वैत वेदान्त (Advaita Vedanta)',
      work: 'श्रीमद्भगवद्गीताभाष्य (Gita Bhashya 2.11)',
      summaryEn:
        'True panditas are those whose intellect is established in knowledge of the Self (pandā). Since the Self is eternal and bodies naturally perish, grief has no rational or metaphysical foundation.',
      summaryHi:
        'पण्डित वे हैं जिनकी बुद्धि आत्म-तत्त्व में प्रतिष्ठित है। आत्मा नित्य और अविकारी है तथा शरीर स्वाभाविक रूप से अनित्य हैं, अतः ज्ञानी कभी शोक नहीं करते।',
    },
    ramanuja: {
      author: 'रामानुजाचार्य (Ramanujacharya)',
      tradition: 'विशिष्टाद्वैत वेदान्त (Vishishtadvaita Vedanta)',
      work: 'गीताभाष्य (Gita Bhashya 2.11)',
      summaryEn:
        'Arjuna confuses the perishable physical body with the imperishable conscious soul (jiva), creating sorrow where none belongs.',
      summaryHi:
        'शरीर विनाशी है और जीवात्मा नित्य है। इस मूलभूत विवेक के अभाव में ही अर्जुन व्यर्थ शोक में डूब रहे हैं।',
    },
    sridhara: {
      author: 'श्रीधर स्वामी (Sridhara Swami)',
      tradition: 'सुबोधिनी टीका (Subodhini 2.11)',
      work: 'भगवद्गीता सुबोधिनी',
      summaryEn:
        'Krishna begins dispelling Arjuna’s delusion (moha) by highlighting the glaring contradiction between his wise speech and grieving behavior.',
      summaryHi:
        'श्रीकृष्ण अर्जुन के वचनों और उनके आचरण के विरोधाभास को दिखाकर उनके मोह का निवारण प्रारंभ करते हैं।',
    },
  },

  sourceTransparency: {
    scripture: 'श्रीमद्भगवद्गीता (Bhagavad Gita)',
    reference: 'अध्याय 2, श्लोक 11 (Chapter 2, Verse 11)',
    epicContext: 'महाभारत, भीष्म पर्व, अध्याय 26 (Mahābhārata, Bhīṣma Parva 26.11)',
    sanskritEdition: 'गीताप्रेस गोरखपुर (Gita Press Gorakhpur) & भांडारकर प्राच्य विद्या संशोधन मंदिर (BORI Critical Edition)',
    meter: 'अनुष्टुप् छन्द (Anuṣṭubh — 8 syllables × 4 quarters)',
    epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',
    editorialNote:
      'Modern psychological reflections are contemporary educational aids, strictly distinct from ancient revealed text.',
  },
};

export const GITA_2_13_PEDAGOGICAL: PedagogicalVerseData = {
  scriptureId: 'bhagavadgita',
  chapterId: 2,
  verseId: 13,
  scriptureTitle: 'Bhagavad Gita',
  scriptureTitleSanskrit: 'श्रीमद्भगवद्गीता',
  chapterTitle: 'Sankhya Yoga',
  chapterTitleSanskrit: 'सांख्ययोग',
  sanskrit: 'देहिनोऽस्मिन्यथा देहे कौमारं यौवनं जरा ।\nतथा देहान्तरप्राप्तिर्धीरस्तत्र न मुह्यति ॥',
  transliteration: 'dehino\'sminyathā dehe kaumāraṁ yauvanaṁ jarā |\ntathā dehāntaraprāptirdhīrastatra na muhyati ||',
  meter: 'अनुष्टुप् (Anuṣṭubh — 32 syllables)',
  epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',

  inOneLineEn: 'Just as the embodied soul passes through childhood, youth, and old age within this body, so it passes into another body; the steady are not deluded by this.',
  inOneLineHi: 'जैसे जीवात्मा इस शरीर में बाल्यावस्था, युवावस्था और वृद्धावस्था को प्राप्त होता है, वैसे ही वह दूसरे शरीर को प्राप्त होता है; धीर पुरुष इससे मोहित नहीं होते।',

  simpleMeaningEn:
    'Within a single lifetime, our physical vehicle continually changes: infancy yields to youth, and youth matures into old age. Yet the indwelling observer knows itself to be continuous throughout these stages. In precisely the same way, crossing from one physical body to another at death is simply another natural transition for the indwelling spirit. One who possesses steadfast discernment (Dhira) does not despair over bodily transition.',
  simpleMeaningHi:
    'जैसे हमारे जीवन में शरीर बचपन से जवानी और जवानी से बुढ़ापे की ओर निरंतर बदलता है, पर भीतर का साक्षी वही रहता है, वैसे ही मृत्यु के बाद नया शरीर पाना भी एक सहज प्राकृतिक पड़ाव है। ज्ञानी और धैर्यवान (धीर) मनुष्य इस स्वाभाविक परिवर्तन से कभी विचलित नहीं होते।',

  keyWords: [
    {
      pada: 'देहिनः (Dehinaḥ)',
      iast: 'dehinaḥ',
      root: 'देहिन् (जीवात्मा)',
      functionalMeaning: 'Of the indwelling conscious entity in the body.',
      functionalMeaningHi: 'शरीर में वास करने वाले अंतरात्मा का।',
    },
    {
      pada: 'कौमारं यौवनं जरा (Kaumāraṁ yauvanaṁ jarā)',
      iast: 'kaumāraṁ yauvanaṁ jarā',
      root: 'कुमार + युवन् + जृ',
      functionalMeaning: 'Childhood, youth, and old age—the changing bodily phases.',
      functionalMeaningHi: 'बचपन, जवानी और बुढ़ापा।',
    },
    {
      pada: 'देहान्तरप्राप्तिः (Dehāntara-prāptiḥ)',
      iast: 'dehāntara-prāptiḥ',
      root: 'देह + अन्तर + प्राप्',
      functionalMeaning: 'Attainment of another physical embodiment.',
      functionalMeaningHi: 'दूसरे शरीर की प्राप्ति।',
    },
    {
      pada: 'धीरः (Dhīraḥ)',
      iast: 'dhīraḥ',
      root: 'धी + र',
      functionalMeaning: 'The steadfast, discerning person unaffected by illusion.',
      functionalMeaningHi: 'धैर्यवान और तत्त्वदर्शी विवेकी पुरुष।',
    },
  ],

  whyItMattersToday: [
    {
      title: 'Freedom from Aging Anxiety',
      titleHi: 'उम्र बढ़ने और शारीरिक बदलावों की चिंता से मुक्ति',
      text: 'Viewing aging and biological transitions as natural seasons of the vehicle preserves dignity and inner vitality.',
    },
    {
      title: 'Continuity of Self-Awareness',
      titleHi: 'निरंतर साक्षी-भाव की पहचान',
      text: 'The quiet awareness that experienced childhood is the exact same observer present today, untouched by accumulated years.',
    },
    {
      title: 'Graceful Transitions',
      titleHi: 'जीवन के नए पड़ावों का सहज स्वागत',
      text: 'Embracing major life closures and beginnings without existential panic.',
    },
  ],

  modernExample: {
    context: 'Facing Ageing, Physical Changes, or Career Transitions',
    contextHi: 'शारीरिक बदलाव, करियर का नया पड़ाव या बढ़ती उम्र का सामना',
    scenarioEn:
      'If you look at old photographs of yourself in childhood, every cell and memory pattern has shifted, yet you do not mourn the loss of your seven-year-old body; you accept the progression with gratitude. Recognize career phases, graying hair, or life chapters in the same way: as natural evolutions of the vehicle that leave your conscious core untouched.',
    scenarioHi:
      'जैसे बचपन छूटने पर हम विलाप नहीं करते बल्कि युवावस्था का स्वागत करते हैं, वैसे ही उम्र के अगले पड़ाव या जीवन के बड़े बदलावों को भी सहजता और गरिमा से स्वीकार करना चाहिए।',
    disclaimer: 'समसामयिक संपादकीय उदाहरण · प्राचीन शास्त्र का मूल भाग नहीं (Editorial Modern Illustration · Not Scripture)',
  },

  whatItDoesNotMean: [
    {
      title: 'It does NOT mean: "Neglecting physical health or nutrition"',
      titleHi: 'यह शारीरिक स्वास्थ्य या देखभाल की उपेक्षा नहीं है',
      text: 'Acknowledging that the body changes is a reason for respectful stewardship, not reckless disregard for wellbeing.',
    },
    {
      title: 'It does NOT mean: "Trivializing the pain of loss"',
      titleHi: 'यह वियोग के दर्द को नकारना नहीं है',
      text: 'Honoring loved ones remains deeply human; recognizing consciousness endures brings peaceful comfort during bereavement.',
    },
  ],

  tryThisToday: {
    title: 'The Unchanging Observer Exercise',
    titleHi: 'अपरिवर्तनीय साक्षी का अनुभव',
    instructionEn:
      'Close your eyes for 2 minutes and recall a vivid memory from 10 or 20 years ago. Notice how physical surroundings, appearance, and thoughts were completely different, but the awareness observing them is the very same awareness here right now.',
    instructionHi:
      'दो मिनट के लिए आंखें बंद करें और 10-15 वर्ष पुरानी कोई बात याद करें। महसूस करें कि सब कुछ बदल जाने के बावजूद उसे देखने वाली चेतना आज भी वही है।',
    duration: '2 minutes',
  },

  reflectionQuestion: {
    en: 'Which changing condition in your body or circumstances are you mistaking for a threat to your fundamental self?',
    hi: 'अपने शरीर या परिस्थिति के किस बदलाव को आप अपने मूल अस्तित्व के लिए खतरा मानकर परेशान हो रहे हैं?',
  },

  traditionalCommentary: {
    shankara: {
      author: 'आदि शंकराचार्य (Adi Shankaracharya)',
      tradition: 'अद्वैत वेदान्त (Advaita Vedanta)',
      work: 'श्रीमद्भगवद्गीताभाष्य (Gita Bhashya 2.13)',
      summaryEn:
        'Just as the soul does not grieve when childhood is destroyed and youth arrives, so too the dhira (wise person) does not grieve at bodily demise, knowing the self remains continuous.',
      summaryHi:
        'जैसे बाल्यावस्था नष्ट होकर युवावस्था आने पर कोई ज्ञानी शोक नहीं करता, वैसे ही इस शरीर के छूटने पर दूसरे शरीर की प्राप्ति में भी ज्ञानी पुरुष भ्रमित नहीं होते।',
    },
    ramanuja: {
      author: 'रामानुजाचार्य (Ramanujacharya)',
      tradition: 'विशिष्टाद्वैत वेदान्त (Vishishtadvaita Vedanta)',
      work: 'गीताभाष्य (Gita Bhashya 2.13)',
      summaryEn:
        'The conscious soul is eternal by nature; bodily transitions are merely modifications of insentient matter that do not diminish the jiva’s eternal reality.',
      summaryHi:
        'जीवात्मा नित्य है और उसका स्वरूप ज्ञानमय है। शरीर के बाल्यादि परिवर्तन प्रकृति के धर्म हैं, जो आत्मा के स्वरूप को स्पर्श नहीं करते।',
    },
    sridhara: {
      author: 'श्रीधर स्वामी (Sridhara Swami)',
      tradition: 'सुबोधिनी टीका (Subodhini 2.13)',
      work: 'भगवद्गीता सुबोधिनी',
      summaryEn:
        'By invoking daily observation of bodily changes from youth to old age, Krishna presents self-evident proof of the soul’s distinction from physical matter.',
      summaryHi:
        'बाल्यावस्था से वृद्धावस्था तक के प्रत्यक्ष अनुभव से श्रीकृष्ण शरीर और आत्मा के भेद को अत्यंत सरल और अकाट्य प्रमाण से सिद्ध करते हैं।',
    },
  },

  sourceTransparency: {
    scripture: 'श्रीमद्भगवद्गीता (Bhagavad Gita)',
    reference: 'अध्याय 2, श्लोक 13 (Chapter 2, Verse 13)',
    epicContext: 'महाभारत, भीष्म पर्व, अध्याय 26 (Mahābhārata, Bhīṣma Parva 26.13)',
    sanskritEdition: 'गीताप्रेस गोरखपुर (Gita Press Gorakhpur) & भांडारकर प्राच्य विद्या संशोधन मंदिर (BORI Critical Edition)',
    meter: 'अनुष्टुप् छन्द (Anuṣṭubh — 8 syllables × 4 quarters)',
    epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',
    editorialNote:
      'Modern psychological reflections are contemporary educational aids, strictly distinct from ancient revealed text.',
  },
};

export const GITA_2_14_PEDAGOGICAL: PedagogicalVerseData = {
  scriptureId: 'bhagavadgita',
  chapterId: 2,
  verseId: 14,
  scriptureTitle: 'Bhagavad Gita',
  scriptureTitleSanskrit: 'श्रीमद्भगवद्गीता',
  chapterTitle: 'Sankhya Yoga',
  chapterTitleSanskrit: 'सांख्ययोग',
  sanskrit: 'मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः ।\nआगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत ॥',
  transliteration: 'mātrāsparśāstu kaunteya śītoṣṇasukhaduḥkhadāḥ |\nāgamāpāyino\'nityāstāṁstitikṣasva bhārata ||',
  meter: 'अनुष्टुप् (Anuṣṭubh — 32 syllables)',
  epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',

  inOneLineEn: 'Sensory impressions of pleasure and pain are transient; endure them with calm, observant equanimity.',
  inOneLineHi: 'इन्द्रियों के अनुकूल और प्रतिकूल अनुभव क्षणभंगुर हैं; उन्हें धैर्यपूर्वक सहन करो।',

  simpleMeaningEn:
    'The contact of the senses with external objects produces sensations of heat and cold, joy and grief. These experiences have beginnings and endings, shifting like seasonal weather. Learn to bear their passing waves with patient endurance (Titiksha), rooted in your unchanging inner witness.',
  simpleMeaningHi:
    'इन्द्रियों का बाहरी विषयों से संपर्क ही सर्दी-गर्मी और सुख-दुःख जैसे अनुभवों को जन्म देता है। ये सभी अनुभव आने-जाने वाले और अनित्य हैं। हे अर्जुन! इन्हें विचलित हुए बिना धैर्यपूर्वक सहन करो और अपने शांत साक्षी भाव में स्थिर रहो।',

  keyWords: [
    {
      pada: 'मात्रास्पर्शाः (Mātrā-sparśāḥ)',
      iast: 'mātrā-sparśāḥ',
      root: 'मात्रा + स्पृश् (इन्द्रिय व विषय संपर्क)',
      functionalMeaning: 'Sensory contacts between perceptual faculties and physical stimuli.',
      functionalMeaningHi: 'इन्द्रियों का बाहरी विषयों के साथ संपर्क।',
    },
    {
      pada: 'शीतोष्णसुखदुःखदाः (Śītoṣṇa-sukha-duḥkha-dāḥ)',
      iast: 'śītoṣṇa-sukha-duḥkha-dāḥ',
      root: 'शीत + उष्ण + सुख + दुःख + दा',
      functionalMeaning: 'Givers of alternating physical sensations (cold/heat) and emotional states (joy/grief).',
      functionalMeaningHi: 'सर्दी-गर्मी और सुख-दुःख देने वाले द्वंद्व।',
    },
    {
      pada: 'आगमापायिनः (Āgamāpāyinaḥ)',
      iast: 'āgamāpāyinaḥ',
      root: 'आ-गम् + अप-इ (आना और जाना)',
      functionalMeaning: 'Having a beginning and an end; fleeting, transient, and inherently impermanent.',
      functionalMeaningHi: 'उत्पन्न होने और नष्ट होने वाले; क्षणिक।',
    },
    {
      pada: 'तितिक्षस्व (Titikṣasva)',
      iast: 'titikṣasva',
      root: 'तिज् (सहन करना / तितिक्षा)',
      functionalMeaning: 'Bear with conscious patience, spiritual endurance, and freedom from anxious reactivity.',
      functionalMeaningHi: 'धैर्यपूर्वक और अनासक्त होकर सहन करो।',
    },
  ],

  whyItMattersToday: [
    {
      title: 'Digital Overstimulation & Emotional Volatility',
      titleHi: 'डिजिटल जीवन में मानसिक अस्थिरता',
      text: 'Daily mood swings triggered by notification highs and quiet lows exhaust psychological energy. Titiksha restores emotional stability.',
    },
    {
      title: 'Physical Discomfort in Training & Work',
      titleHi: 'कठिन परिश्रम और असुविधा का सामना',
      text: 'Athletes, students, and professionals must endure uncomfortable training and effort without giving up.',
    },
    {
      title: 'Navigating Changing Life Circumstances',
      titleHi: 'जीवन के उतार-चढ़ाव में संतुलन',
      text: 'Economic, social, and personal climates change. Recognizing transience prevents panic in hard times and hubris in good times.',
    },
  ],

  modernExample: {
    context: 'Navigating Sudden Professional Setbacks or Academic Stress',
    contextHi: 'अचानक उत्पन्न हुए तनाव या कठिन परिस्थितियों का सामना',
    scenarioEn:
      'When winter brings freezing wind or summer brings scorching heat, you do not despair that warmth or cold has permanently ruined the world; you dress appropriately and proceed with your work. Treat sudden professional criticism, difficult exams, or temporary discomfort in the same way: as passing external weather that cannot touch your core integrity.',
    scenarioHi:
      'जैसे सर्दी और गर्मी का मौसम आता और चला जाता है और हम उससे परेशान होकर जीवन नहीं रोकते, वैसे ही परीक्षा का तनाव या कार्यालय की आलोचना भी क्षणिक है। यह समझकर शांत रहना ही तितिक्षा है।',
    disclaimer: 'समसामयिक संपादकीय उदाहरण · प्राचीन शास्त्र का मूल भाग नहीं (Editorial Modern Illustration · Not Scripture)',
  },

  whatItDoesNotMean: [
    {
      title: 'It does NOT mean: "Cold emotional suppression or numbness"',
      titleHi: 'यह उदासीनता या भावनाशून्यता नहीं है',
      text: 'Titiksha is not repressing trauma or pretending pain does not exist; it is observing passing sensation with spacious awareness so it does not overwhelm judgment.',
    },
    {
      title: 'It does NOT mean: "Tolerating ongoing injustice or abuse"',
      titleHi: 'यह अन्याय या दुर्व्यवहार को चुपचाप सहना नहीं है',
      text: 'Endurance applies to natural biological and circumstantial dualities (heat, cold, fatigue); it does not mean passive acceptance of wrongdoing.',
    },
  ],

  tryThisToday: {
    title: 'The 90-Second Weather Observation',
    titleHi: '90 सेकंड का मौसम-अवलोकन',
    instructionEn:
      'When a wave of irritation, anxiety, or craving hits you today, pause and observe it purely as physiological weather for 90 seconds without reacting or trying to distract yourself. Watch it rise, peak, and begin to fade.',
    instructionHi:
      'जब भी आज कोई झुंझलाहट या घबराहट आए, तुरंत प्रतिक्रिया देने के बजाय 90 सेकंड शांत रहकर उसे केवल एक शारीरिक संवेदन के रूप में देखें।',
    duration: '< 2 minutes',
  },

  reflectionQuestion: {
    en: 'Which passing discomfort or temporary irritation in your daily routine are you treating as an unbearable permanent crisis?',
    hi: 'अपनी दिनचर्या के किस क्षणिक तनाव या असुविधा को आप एक स्थायी संकट समझकर व्यर्थ परेशान हो रहे हैं?',
  },

  traditionalCommentary: {
    shankara: {
      author: 'आदि शंकराचार्य (Adi Shankaracharya)',
      tradition: 'अद्वैत वेदान्त (Advaita Vedanta)',
      work: 'श्रीमद्भगवद्गीताभाष्य (Gita Bhashya 2.14)',
      summaryEn:
        'Senses touch their respective objects, producing dualities like heat and cold. Since they come and go, they are impermanent and unreal in the highest sense; therefore, endure them with an undisturbed mind.',
      summaryHi:
        'इन्द्रियों के विषयों से संपर्क होने पर ही सुख-दुःख आदि द्वंद्व उत्पन्न होते हैं। क्योंकि ये आने-जाने वाले और अनित्य हैं, अतः इन्हें हर्ष और विषाद से रहित होकर सहन करना चाहिए।',
    },
    ramanuja: {
      author: 'रामानुजाचार्य (Ramanujacharya)',
      tradition: 'विशिष्टाद्वैत वेदान्त (Vishishtadvaita Vedanta)',
      work: 'गीताभाष्य (Gita Bhashya 2.14)',
      summaryEn:
        'Experiences of heat, cold, pleasure, and pain are physical qualities pertaining to the bodily instruments, not to the eternal soul. Realizing this distinction grants the seeker unshakeable fortitude in fulfilling obligatory duty.',
      summaryHi:
        'सुख-दुःख के अनुभव शरीर के धर्म हैं, अविनाशी आत्मा के नहीं। इस विवेक को जानकर अपने कर्तव्य पालन में आने वाले कष्टों को सहज भाव से सहना चाहिए।',
    },
    sridhara: {
      author: 'श्रीधर स्वामी (Sridhara Swami)',
      tradition: 'सुबोधिनी टीका (Subodhini 2.14)',
      work: 'भगवद्गीता सुबोधिनी',
      summaryEn:
        'Patient endurance (Titiksha) of transient dualities purifies the heart and prepares the mind for the realization of eternal truth.',
      summaryHi:
        'संसार के द्वंद्वों को धैर्यपूर्वक सहने से चित्त शुद्ध होता है और साधक आत्म-तत्त्व के साक्षात्कार के योग्य बनता है।',
    },
  },

  sourceTransparency: {
    scripture: 'श्रीमद्भगवद्गीता (Bhagavad Gita)',
    reference: 'अध्याय 2, श्लोक 14 (Chapter 2, Verse 14)',
    epicContext: 'महाभारत, भीष्म पर्व, अध्याय 26 (Mahābhārata, Bhīṣma Parva 26.14)',
    sanskritEdition: 'गीताप्रेस गोरखपुर (Gita Press Gorakhpur) & भांडारकर प्राच्य विद्या संशोधन मंदिर (BORI Critical Edition)',
    meter: 'अनुष्टुप् छन्द (Anuṣṭubh — 8 syllables × 4 quarters)',
    epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',
    editorialNote:
      'Modern psychological reflections are contemporary educational aids, strictly distinct from ancient revealed text.',
  },
};

export const GITA_2_20_PEDAGOGICAL: PedagogicalVerseData = {
  scriptureId: 'bhagavadgita',
  chapterId: 2,
  verseId: 20,
  scriptureTitle: 'Bhagavad Gita',
  scriptureTitleSanskrit: 'श्रीमद्भगवद्गीता',
  chapterTitle: 'Sankhya Yoga',
  chapterTitleSanskrit: 'सांख्ययोग',
  sanskrit: 'न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः ।\nअजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे ॥',
  transliteration: 'na jāyate mriyate vā kadācinnāyaṁ bhūtvā bhavitā vā na bhūyaḥ |\najo nityaḥ śāśvato\'yaṁ purāṇo na hanyate hanyamāne śarīre ||',
  meter: 'अनुष्टुप् (Anuṣṭubh — 32 syllables)',
  epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',

  inOneLineEn: 'The conscious Self is never born, never dies, and remains unslain when the physical body perishes.',
  inOneLineHi: 'यह आत्मा न कभी जन्म लेती है और न मरती है; शरीर के नष्ट होने पर भी यह कभी नष्ट नहीं होती।',

  simpleMeaningEn:
    'The conscious spirit within is not born at physical conception, nor does it perish at bodily death. Having existed once, it never ceases to be. It is unborn, eternal, unchanging, and ancient. While the physical frame alters, ages, and eventually falls away, the core witness consciousness is never destroyed.',
  simpleMeaningHi:
    'आत्मा का न कभी जन्म होता है और न कभी मृत्यु। यह पहले भी थी, अब भी है और आगे भी रहेगी। यह अजन्मा, नित्य, शाश्वत और पुरातन है। शरीर के रोगग्रस्त, वृद्ध या नष्ट होने पर भी यह चैतन्य आत्मा कभी मारी नहीं जाती।',

  keyWords: [
    {
      pada: 'न जायते म्रियते वा (Na jāyate mriyate vā)',
      iast: 'na jāyate mriyate vā',
      root: 'जन् + मृ (जन्म और मरण का अभाव)',
      functionalMeaning: 'Neither undergoes biological birth nor biological death.',
      functionalMeaningHi: 'न जन्म लेता है और न मृत्यु को प्राप्त होता है।',
    },
    {
      pada: 'अजो नित्यः (Ajo nityaḥ)',
      iast: 'ajaḥ nityaḥ',
      root: 'अ + जन् + नित्य (अजन्मा और शाश्वत)',
      functionalMeaning: 'Unborn and continuous throughout all cosmic periods.',
      functionalMeaningHi: 'जन्म-रहित और निरंतर विद्यमान।',
    },
    {
      pada: 'शाश्वतः पुराणः (Śāśvataḥ purāṇaḥ)',
      iast: 'śāśvataḥ purāṇaḥ',
      root: 'शाश्वत + पुरा + नव (सदा नवीन पुरातन)',
      functionalMeaning: 'Perpetual, undecaying, ancient yet ever fresh consciousness.',
      functionalMeaningHi: 'सदा रहने वाला और अनादि काल से निरंतर।',
    },
    {
      pada: 'न हन्यते शरीरे (Na hanyate śarīre)',
      iast: 'na hanyate hanyamāne śarīre',
      root: 'हन् (मारना) + शरीर',
      functionalMeaning: 'Is not slain or diminished when the physical vehicle is destroyed.',
      functionalMeaningHi: 'शरीर के नष्ट हो जाने पर भी इसका नाश नहीं होता।',
    },
  ],

  whyItMattersToday: [
    {
      title: 'Freedom from Existential Dread & Mortality Anxiety',
      titleHi: 'मृत्यु-भय और अस्तित्वगत चिंता से मुक्ति',
      text: 'Modern living often reduces human identity to a vulnerable biological machine. Knowing your consciousness is uncreated restores deep peace.',
    },
    {
      title: 'Resilience Through Life Changes & Aging',
      titleHi: 'आयु और शारीरिक बदलावों में संतुलन',
      text: 'Graying hair, declining stamina, and career transitions can threaten identity. The indwelling witness watches change without diminishing.',
    },
    {
      title: 'Compassionate Grief Support',
      titleHi: 'शोक में सांत्वना और आत्मिक संबल',
      text: 'Understanding that physical departure does not extinguish conscious essence brings solace when mourning departed relatives.',
    },
  ],

  modernExample: {
    context: 'Facing Deep Life Transitions, Aging, or Grief',
    contextHi: 'जीवन के बड़े बदलाव, शारीरिक परिवर्तन या प्रियजनों के वियोग का समय',
    scenarioEn:
      'Consider an actor who portrays many dramatic roles on stage—sometimes playing a wealthy king, sometimes a destitute beggar, sometimes a hero who falls in battle. When the play ends and the stage curtains close, the actor removes the costume and remains entirely unharmed. The body is the costume; the Atman is the enduring actor.',
    scenarioHi:
      'जैसे कोई नाटक का पात्र मंच पर बदलता रहता है और नाटक समाप्त होने पर भी अभिनेता सुरक्षित रहता है, वैसे ही शरीर रूपी वस्त्र के बदलने पर भी आत्मा सदैव सुरक्षित और अविनाशी रहती है।',
    disclaimer: 'समसामयिक संपादकीय उदाहरण · प्राचीन शास्त्र का मूल भाग नहीं (Editorial Modern Illustration · Not Scripture)',
  },

  whatItDoesNotMean: [
    {
      title: 'It does NOT mean: "Carelessness toward health or life"',
      titleHi: 'यह स्वास्थ्य या जीवन के प्रति लापरवाही नहीं है',
      text: 'Knowing the Self is deathless is not a justification for physical recklessness or neglecting self-care. The body is a sacred temple and instrument for Dharma.',
    },
    {
      title: 'It does NOT mean: "Coldness toward human grief"',
      titleHi: 'यह मानवीय संवेदनाओं या शोक की उपेक्षा नहीं है',
      text: 'Grief is a natural emotional expression of love; recognizing the eternity of consciousness provides grounding reassurance rather than emotional denial.',
    },
  ],

  tryThisToday: {
    title: 'The Witness Meditation',
    titleHi: 'साक्षी भाव का ध्यान',
    instructionEn:
      'Close your eyes for 3 minutes. Notice your breath moving in and out, and thoughts drifting past. Now ask: "Who is the silent awareness that is observing both breath and thoughts?" Rest quietly as that observer.',
    instructionHi:
      '3 मिनट के लिए आंखें बंद करें। अपनी सांस और विचारों को आते-जाते देखें और पहचानें कि आप वे विचार नहीं, बल्कि उन्हें देखने वाले शांत साक्षी हैं।',
    duration: '3 minutes',
  },

  reflectionQuestion: {
    en: 'How would you approach your daily challenges today if you knew that your innermost conscious self is completely immune to failure, aging, and death?',
    hi: 'यदि आपको यह पूर्ण विश्वास हो कि आपकी मूल आत्मा असफलता, उम्र और मृत्यु से परे है, तो आज आप अपने भय का सामना कैसे करेंगे?',
  },

  traditionalCommentary: {
    shankara: {
      author: 'आदि शंकराचार्य (Adi Shankaracharya)',
      tradition: 'अद्वैत वेदान्त (Advaita Vedanta)',
      work: 'श्रीमद्भगवद्गीताभाष्य (Gita Bhashya 2.20)',
      summaryEn:
        'The six modifications of being (birth, existence, growth, alteration, decay, death) belong only to physical matter, not to the unchanging, partless Atman.',
      summaryHi:
        'जन्म, स्थिति, वृद्धि, परिणाम, क्षय और विनाश — ये छह भाव-विकार शरीर के होते हैं, निर्विकार और नित्य आत्मा के नहीं।',
    },
    ramanuja: {
      author: 'रामानुजाचार्य (Ramanujacharya)',
      tradition: 'विशिष्टाद्वैत वेदान्त (Vishishtadvaita Vedanta)',
      work: 'गीताभाष्य (Gita Bhashya 2.20)',
      summaryEn:
        'The individual conscious soul (Jiva) is eternal and distinct from the insentient physical vessel it occupies through karma; destruction of the body cannot terminate consciousness.',
      summaryHi:
        'जीवात्मा नित्य और ज्ञानस्वरूप है। कर्मवश प्राप्त शरीर के नष्ट होने पर भी जीवात्मा का नाश कभी नहीं होता।',
    },
    sridhara: {
      author: 'श्रीधर स्वामी (Sridhara Swami)',
      tradition: 'सुबोधिनी टीका (Subodhini 2.20)',
      work: 'भगवद्गीता सुबोधिनी',
      summaryEn:
        'This verse affirms the teaching of the Katha Upanishad (1.2.18): the soul is unslain, self-evident consciousness that transcends the limitations of time and death.',
      summaryHi:
        'यह श्लोक कठोपनिषद् के प्रसिद्ध मंत्र के समान आत्मा की अमरता और अनादिता को सिद्ध करता है।',
    },
  },

  sourceTransparency: {
    scripture: 'श्रीमद्भगवद्गीता (Bhagavad Gita)',
    reference: 'अध्याय 2, श्लोक 20 (Chapter 2, Verse 20)',
    epicContext: 'महाभारत, भीष्म पर्व, अध्याय 26 (Mahābhārata, Bhīṣma Parva 26.20); कठोपनिषद् 1.2.18',
    sanskritEdition: 'गीताप्रेस गोरखपुर (Gita Press Gorakhpur) & भांडारकर प्राच्य विद्या संशोधन मंदिर (BORI Critical Edition)',
    meter: 'अनुष्टुप् छन्द (Anuṣṭubh — 8 syllables × 4 quarters)',
    epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',
    editorialNote:
      'Modern psychological reflections are contemporary educational aids, strictly distinct from ancient revealed text.',
  },
};

export const GITA_2_22_PEDAGOGICAL: PedagogicalVerseData = {
  scriptureId: 'bhagavadgita',
  chapterId: 2,
  verseId: 22,
  scriptureTitle: 'Bhagavad Gita',
  scriptureTitleSanskrit: 'श्रीमद्भगवद्गीता',
  chapterTitle: 'Sankhya Yoga',
  chapterTitleSanskrit: 'सांख्ययोग',
  sanskrit: 'वासांसि जीर्णानि यथा विहाय\nनवानि गृह्णाति नरोऽपराणि ।\nतथा शरीराणि विहाय जीर्णा\nन्यन्यानि संयाति नवानि देही ॥',
  transliteration: 'vāsāṁsi jīrṇāni yathā vihāya\nnavāni gṛhṇāti naro\'parāṇi |\ntathā śarīrāṇi vihāya jīrṇā\nnyanyāni saṁyāti navāni dehī ||',
  meter: 'अनुष्टुप् (Anuṣṭubh — 32 syllables)',
  epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',

  inOneLineEn: 'As a person sheds worn-out garments and puts on new ones, so the embodied soul sheds worn-out bodies and enters new ones.',
  inOneLineHi: 'जैसे मनुष्य पुराने वस्त्रों को त्यागकर नए वस्त्र धारण करता है, वैसे ही जीवात्मा पुराने शरीरों को छोड़कर नए शरीरों में प्रवेश करता है।',

  simpleMeaningEn:
    'Using the metaphor of changing clothes, Krishna clarifies the relationship between consciousness and form. When clothes become torn or frayed, a person removes them without grief and wears fresh attire. In identical fashion, the indwelling conscious soul discards an aging or spent physical frame and enters a fresh vessel. The soul is the wearer; the body is merely the worn fabric.',
  simpleMeaningHi:
    'जैसे फटे-पुराने कपड़े उतारकर नए वस्त्र पहनते समय मनुष्य कोई शोक नहीं करता, वैसे ही यह शरीर भी आत्मा का एक वस्त्र मात्र है। जब शरीर पुराना या रोगग्रस्त हो जाता है, तो आत्मा उसे छोड़कर नए रूप में प्रविष्ट हो जाती है। वस्त्र के बदलने से वस्त्र पहनने वाले का विनाश नहीं होता।',

  keyWords: [
    {
      pada: 'वासांसि जीर्णानि (Vāsāṁsi jīrṇāni)',
      iast: 'vāsāṁsi jīrṇāni',
      root: 'वासस् + जॄ (जीर्ण वस्त्र)',
      functionalMeaning: 'Worn-out, aged, or decaying garments.',
      functionalMeaningHi: 'पुराने और घिसे हुए कपड़े।',
    },
    {
      pada: 'विहाय (Vihāya)',
      iast: 'vihāya',
      root: 'वि + हा (छोड़ना / त्यागना)',
      functionalMeaning: 'Casting aside, discarding, relinquishing.',
      functionalMeaningHi: 'त्यागकर या उतारकर।',
    },
    {
      pada: 'नवानि गृह्णाति (Navāni gṛhṇāti)',
      iast: 'navāni gṛhṇāti',
      root: 'नव + ग्रह् (स्वीकार करना)',
      functionalMeaning: 'Takes up or accepts new ones.',
      functionalMeaningHi: 'नए वस्त्रों को ग्रहण करता है।',
    },
    {
      pada: 'देही (Dehī)',
      iast: 'dehī',
      root: 'देह + इन् (आत्मा / देहस्वामी)',
      functionalMeaning: 'The indwelling conscious soul that wears the physical body.',
      functionalMeaningHi: 'शरीर का स्वामी (जीवात्मा)।',
    },
  ],

  whyItMattersToday: [
    {
      title: 'Overcoming Hyper-Fixation on Appearance',
      titleHi: 'शारीरिक रूप-रंग की अत्यधिक चिंता से मुक्ति',
      text: 'Society obsessively equates identity with cosmetic appearance. Remembering you are the wearer restores healthy psychological distance.',
    },
    {
      title: 'Comfort in Facing Infirmity and Illness',
      titleHi: 'बीमारी और शारीरिक दुर्बलता में आत्मिक संबल',
      text: 'When disease or disability damages the physical vessel, knowing the conscious observer within remains undamaged preserves dignity.',
    },
    {
      title: 'Serene Processing of Bereavement',
      titleHi: 'शोक और वियोग में सांत्वना',
      text: 'Viewing the departure of loved ones as shedding an exhausted garment replaces despair with reverent gratitude.',
    },
  ],

  modernExample: {
    context: 'Facing Bodily Fragility, Surgery, or Loss of a Loved One',
    contextHi: 'शारीरिक बीमारी, शल्यक्रिया या किसी प्रियजन के देहावसान का समय',
    scenarioEn:
      'When your phone battery or casing finally degrades after years of hard service, you back up your data and transfer it to a new device without weeping over the discarded frame. The operating system and data continue unbroken. The body is the hardware; the Atman is the continuing conscious essence.',
    scenarioHi:
      'जैसे कंप्यूटर खराब होने पर हम उसका डेटा नए सिस्टम में सुरक्षित कर लेते हैं और पुराने आवरण के नष्ट होने पर रोते नहीं, वैसे ही शरीर के छूटने पर भी चैतन्य आत्मा निरंतर बनी रहती है।',
    disclaimer: 'समसामयिक संपादकीय उदाहरण · प्राचीन शास्त्र का मूल भाग नहीं (Editorial Modern Illustration · Not Scripture)',
  },

  whatItDoesNotMean: [
    {
      title: 'It does NOT mean: "Treating the body recklessly or with disrespect"',
      titleHi: 'यह शरीर की उपेक्षा या लापरवाही नहीं है',
      text: 'Just as one protects and maintains clothes so they remain serviceable, the body is cherished as a sacred temple of Dharma.',
    },
    {
      title: 'It does NOT mean: "Grief should be artificially suppressed"',
      titleHi: 'यह दुख या शोक की उपेक्षा नहीं है',
      text: 'Mourning the physical absence of someone we love is natural; the verse offers long-term metaphysical peace, not emotional repression.',
    },
  ],

  tryThisToday: {
    title: 'The Garment Awareness Check',
    titleHi: 'वस्त्र और धारणकर्ता का विवेक',
    instructionEn:
      'When changing your clothes today, take 30 seconds to reflect: "Just as I put on and take off this shirt, my inner conscious self inhabits this physical body. I am the observer, not the fabric."',
    instructionHi:
      'आज जब आप कपड़े बदलें, तो कुछ सेकंड के लिए विचार करें: जैसे मैं इन कपड़ों को पहनता और उतारता हूँ, वैसे ही मैं इस शरीर में निवास करने वाला साक्षी हूँ।',
    duration: '< 1 minute',
  },

  reflectionQuestion: {
    en: 'How would you treat your daily stresses differently if you viewed your body as an entrusted vehicle rather than your absolute identity?',
    hi: 'यदि आप अपने शरीर को अपनी अंतिम पहचान मानने के बजाय केवल एक साधन या वस्त्र मानें, तो आपका तनाव कैसे कम होगा?',
  },

  traditionalCommentary: {
    shankara: {
      author: 'आदि शंकराचार्य (Adi Shankaracharya)',
      tradition: 'अद्वैत वेदान्त (Advaita Vedanta)',
      work: 'श्रीमद्भगवद्गीताभाष्य (Gita Bhashya 2.22)',
      summaryEn:
        'Just as a person discards torn, useless garments and accepts fresh ones without suffering harm, so the immutable Self sheds worn bodies and takes up new embodiments without undergoing any destruction.',
      summaryHi:
        'जैसे फटे वस्त्रों को छोड़कर नए वस्त्र पहनने से मनुष्य को कोई हानि नहीं होती, वैसे ही अविकारी आत्मा जीर्ण शरीरों को त्यागकर नए शरीरों को प्राप्त होती है और उसका कोई विनाश नहीं होता।',
    },
    ramanuja: {
      author: 'रामानुजाचार्य (Ramanujacharya)',
      tradition: 'विशिष्टाद्वैत वेदान्त (Vishishtadvaita Vedanta)',
      work: 'गीताभाष्य (Gita Bhashya 2.22)',
      summaryEn:
        'The relationship between the jiva (soul) and its physical body is strictly instrumental, like clothing worn to accomplish a purpose. Giving up an old body for a righteous cause leads only to a higher state.',
      summaryHi:
        'शरीर जीवात्मा के लिए साधन मात्र है जैसे वस्त्र। धर्मयुद्ध में पुराना शरीर त्यागकर वीरगति या उच्च गति पाना शोक का नहीं, बल्कि कल्याण का विषय है।',
    },
    sridhara: {
      author: 'श्रीधर स्वामी (Sridhara Swami)',
      tradition: 'सुबोधिनी टीका (Subodhini 2.22)',
      work: 'भगवद्गीता सुबोधिनी',
      summaryEn:
        'The garment analogy is universal and intuitively understood by all human beings: death is merely shedding clothes; therefore lamentation is wholly irrational.',
      summaryHi:
        'वस्त्र का यह दृष्टांत लोक-प्रसिद्ध है। शरीर का छूटना केवल वस्त्र बदलने के समान है, अतः इसके लिए शोक करना सर्वथा अनुचित है।',
    },
  },

  sourceTransparency: {
    scripture: 'श्रीमद्भगवद्गीता (Bhagavad Gita)',
    reference: 'अध्याय 2, श्लोक 22 (Chapter 2, Verse 22)',
    epicContext: 'महाभारत, भीष्म पर्व, अध्याय 26 (Mahābhārata, Bhīṣma Parva 26.22)',
    sanskritEdition: 'गीताप्रेस गोरखपुर (Gita Press Gorakhpur) & भांडारकर प्राच्य विद्या संशोधन मंदिर (BORI Critical Edition)',
    meter: 'अनुष्टुप् छन्द (Anuṣṭubh — 8 syllables × 4 quarters)',
    epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',
    editorialNote:
      'Modern psychological reflections are contemporary educational aids, strictly distinct from ancient revealed text.',
  },
};

export const GITA_2_48_PEDAGOGICAL: PedagogicalVerseData = {
  scriptureId: 'bhagavadgita',
  chapterId: 2,
  verseId: 48,
  scriptureTitle: 'Bhagavad Gita',
  scriptureTitleSanskrit: 'श्रीमद्भगवद्गीता',
  chapterTitle: 'Sankhya Yoga',
  chapterTitleSanskrit: 'सांख्ययोग',
  sanskrit: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ॥',
  transliteration: 'yogasthaḥ kuru karmāṇi saṅgaṃ tyaktvā dhanañjaya |\nsiddhyasiddhyoḥ samo bhūtvā samatvaṃ yoga ucyate ||',
  meter: 'अनुष्टुप् (Anuṣṭubh — 32 syllables)',
  epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',

  inOneLineEn: 'Act with dedication and inner poise, remaining balanced in both success and failure.',
  inOneLineHi: 'सफलता और असफलता दोनों में समभाव रखते हुए निष्ठापूर्वक अपना कर्तव्य पूरा करो।',

  simpleMeaningEn:
    'Perform your duties anchored in spiritual presence, abandoning obsessive attachment to personal rewards. Remain mentally poised whether your endeavors meet with immediate success or temporary defeat. This unshakeable inner balance through all of life’s turbulence is the true definition of yoga.',
  simpleMeaningHi:
    'आसक्ति और अहंकार को छोड़कर, मन को शांत रखकर अपने कर्तव्यों का पालन करें। कार्य सिद्ध हो या असिद्ध, दोनों ही परिस्थितियों में अपने मानसिक संतुलन को न खोएं। मन का यही समभाव वास्तव में योग कहलाता है।',

  keyWords: [
    {
      pada: 'योगस्थः (Yogasthaḥ)',
      iast: 'yogasthaḥ',
      root: 'योग + स्था (योग में स्थित)',
      functionalMeaning: 'Anchored in steady presence and awareness while acting in the world.',
      functionalMeaningHi: 'आंतरिक सजगता और योग में स्थित होकर।',
    },
    {
      pada: 'सङ्गं त्यक्त्वा (Saṅgaṃ tyaktvā)',
      iast: 'saṅgaṃ tyaktvā',
      root: 'सङ्ग + त्यज् (आसक्ति छोड़ना)',
      functionalMeaning: 'Releasing clinginess, selfish craving, and fear of unfavorable outcomes.',
      functionalMeaningHi: 'स्वार्थ, आसक्ति और फल की पकड़ को त्यागकर।',
    },
    {
      pada: 'सिद्ध्यसिद्ध्योः (Siddhyasiddhyoḥ)',
      iast: 'siddhyasiddhyoḥ',
      root: 'सिद्धि + असिद्धि (सफलता और असफलता)',
      functionalMeaning: 'In both victory and setback; in both attainment and frustration.',
      functionalMeaningHi: 'कार्य के पूरा होने (सफलता) और न होने (विफलता) दोनों में।',
    },
    {
      pada: 'समत्वं योग उच्यते (Samatvaṃ yoga ucyate)',
      iast: 'samatvaṃ yoga ucyate',
      root: 'समत्वम् + योगः + उच्यते',
      functionalMeaning: 'Equanimity of mind is defined as yoga — mental equilibrium is mastery.',
      functionalMeaningHi: 'मन का यह समभाव (संतुलन) ही योग कहलाता है।',
    },
  ],

  whyItMattersToday: [
    {
      title: 'Emotional Volatility in High-Stakes Careers',
      titleHi: 'करियर के उतार-चढ़ाव में मानसिक स्थिरता',
      text: 'Experiencing euphoric highs during promotions and crushing depression during setbacks exhausts the nervous system. Samatvam (equanimity) provides emotional endurance.',
    },
    {
      title: 'Competitive Academic & Sports Performance',
      titleHi: 'खेल व शिक्षा में प्रदर्शन का दबाव',
      text: 'Great competitors know that fixating on winning produces muscle tension and panic. Focusing on the stroke or the question with centered calm brings flow.',
    },
    {
      title: 'Relationships & Criticism',
      titleHi: 'आलोचना और संबंधों में संतुलन',
      text: 'Taking applause and criticism in stride stops other people’s opinions from controlling your emotional thermostat.',
    },
    {
      title: 'Burnout Prevention',
      titleHi: 'थकान और बर्नआउट से बचाव',
      text: 'True mental exhaustion rarely comes from honest physical work; it comes from emotional resistance and obsessing over uncertainty.',
    },
  ],

  modernExample: {
    context: 'Handling Work Evaluations, Startup Launches, or Product Releases',
    contextHi: 'उत्पाद विमोचन, प्रोजेक्ट रिपोर्ट या मूल्यांकन का समय',
    scenarioEn:
      'Imagine launching a software project or delivering a major musical performance. You prepare with rigorous craft and perform your part with full dedication. If it receives glowing praise, you stay humble without becoming inflated. If it receives harsh critique, you examine the feedback calmly without falling into despair. You maintain the same centered dignity through both outcomes.',
    scenarioHi:
      'मान लीजिए आपने किसी बड़े प्रोजेक्ट पर महीनों मेहनत की है। यदि रिलीज के बाद उसकी बहुत प्रशंसा होती है, तो आप अहंकार से नहीं फूलते। यदि उसमें कुछ कमियां निकलती हैं, तो आप निराश होकर काम नहीं छोड़ते। दोनों ही स्थितियों में आप शांत रहकर सीखने और आगे बढ़ने का संकल्प रखते हैं।',
    disclaimer: 'समसामयिक संपादकीय उदाहरण · प्राचीन शास्त्र का मूल भाग नहीं (Editorial Modern Illustration · Not Scripture)',
  },

  whatItDoesNotMean: [
    {
      title: 'It does NOT mean: "Emotional numbness or cold apathy"',
      titleHi: 'यह उदासीनता या भावनाशून्यता नहीं है',
      text: 'Equanimity is not suppression or lifeless detachment; it is a profound, grounded peace that allows full joy without toxic clinginess.',
    },
    {
      title: 'It does NOT mean: "Physical postures (asanas) alone"',
      titleHi: 'यह केवल शारीरिक योगासन नहीं है',
      text: 'While physical yoga is helpful, Krishna defines Yoga here primarily as mental equilibrium (samatvam) amidst dynamic worldly actions.',
    },
    {
      title: 'It does NOT mean: "Lack of passion or excellence"',
      titleHi: 'यह कार्य में ढिलाई या रुचि की कमी नहीं है',
      text: 'Freedom from frantic agitation actually sharpens your focus, leading to the highest standard of craftsmanship.',
    },
  ],

  tryThisToday: {
    title: 'The 3-Breath Equanimity Pause',
    titleHi: '3 गहरी सांसों का समत्व-विराम',
    instructionEn:
      'When you encounter an unexpected interruption, sharp email, or small win today, pause for exactly 3 conscious breaths before reacting. Observe the feeling without letting it push your mind off balance.',
    instructionHi:
      'आज जब भी कोई अचानक तनाव या उत्तेजना आए, तुरंत प्रतिक्रिया देने से पहले 3 गहरी सांसें लें और मन को शांत केंद्र में लाएं।',
    duration: '< 2 minutes',
  },

  reflectionQuestion: {
    en: 'How much of your daily peace of mind is currently held hostage by external outcomes and other people’s validation?',
    hi: 'आपकी दैनिक मानसिक शांति का कितना हिस्सा बाहरी परिणामों और दूसरों की राय पर निर्भर करता है?',
  },

  traditionalCommentary: {
    shankara: {
      author: 'आदि शंकराचार्य (Adi Shankaracharya)',
      tradition: 'अद्वैत वेदान्त (Advaita Vedanta)',
      work: 'श्रीमद्भगवद्गीताभाष्य (Gita Bhashya 2.48)',
      summaryEn:
        'Samatvam (equanimity) means maintaining identical tranquil awareness whether duty brings fruits or not. This mental purity frees the mind from likes and dislikes (rāga-dveṣa).',
      summaryHi:
        'सिद्धि और असिद्धि में चित्त का एक जैसा रहना ही समत्व है। यह समभाव राग और द्वेष के द्वंद्वों को नष्ट करके चित्त को शुद्ध करता है।',
    },
    ramanuja: {
      author: 'रामानुजाचार्य (Ramanujacharya)',
      tradition: 'विशिष्टाद्वैत वेदान्त (Vishishtadvaita Vedanta)',
      work: 'गीताभाष्य (Gita Bhashya 2.48)',
      summaryEn:
        'Performing action as adoration of the Supreme Lord while discarding self-centered interest brings spontaneous equanimity in all conditions.',
      summaryHi:
        'कर्म को ईश्वर की प्रीति के लिए करना और अपने स्वार्थ को समर्पित कर देना ही समत्व योग का मार्ग है।',
    },
    sridhara: {
      author: 'श्रीधर स्वामी (Sridhara Swami)',
      tradition: 'सुबोधिनी टीका (Subodhini)',
      work: 'भगवद्गीता सुबोधिनी (Subodhini 2.48)',
      summaryEn:
        'True yoga is defined as stability of the intellect across dualities. One who achieves this is never broken by worldly fluctuations.',
      summaryHi:
        'सुख-दुख, लाभ-हानि में बुद्धि की स्थिरता ही योग है। ऐसा साधक संसार के थपेड़ों से कभी विचलित नहीं होता।',
    },
  },

  sourceTransparency: {
    scripture: 'श्रीमद्भगवद्गीता (Bhagavad Gita)',
    reference: 'अध्याय 2, श्लोक 48 (Chapter 2, Verse 48)',
    epicContext: 'महाभारत, भीष्म पर्व, अध्याय 26 (Mahābhārata, Bhīṣma Parva 26.48)',
    sanskritEdition: 'गीताप्रेस गोरखपुर (Gita Press Gorakhpur) & भांडारकर प्राच्य विद्या संशोधन मंदिर (BORI Critical Edition)',
    meter: 'अनुष्टुप् छन्द (Anuṣṭubh — 8 syllables × 4 quarters)',
    epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',
    editorialNote:
      'Modern psychological reflections are contemporary educational aids, strictly distinct from ancient revealed text.',
  },
};

export const GITA_2_55_PEDAGOGICAL: PedagogicalVerseData = {
  scriptureId: 'bhagavadgita',
  chapterId: 2,
  verseId: 55,
  scriptureTitle: 'Bhagavad Gita',
  scriptureTitleSanskrit: 'श्रीमद्भगवद्गीता',
  chapterTitle: 'Sankhya Yoga',
  chapterTitleSanskrit: 'सांख्ययोग',
  sanskrit: 'श्रीभगवानुवाच\nप्रजहाति यदा कामान् सर्वान् पार्थ मनोगतान् ।\nआत्मन्येवात्मना तुष्टः स्थितप्रज्ञस्तदोच्यते ॥',
  transliteration: 'śrī-bhagavānuvāca\nprajahāti yadā kāmān sarvān pārtha manogatān |\nātmanyevātmanā tuṣṭaḥ sthitaprajñastadocyate ||',
  meter: 'अनुष्टुप् (Anuṣṭubh — 32 syllables)',
  epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',

  inOneLineEn: 'When one renounces all desires originating in the mind and is satisfied in the Self alone, one is called steady in wisdom.',
  inOneLineHi: 'जब मनुष्य मन की समस्त कामनाओं को त्याग देता है और अपनी आत्मा से ही स्वयं में संतुष्ट रहता है, तब वह स्थितप्रज्ञ कहलाता है।',

  simpleMeaningEn:
    'In response to Arjuna’s question about the nature of an enlightened sage, Krishna defines steady wisdom (sthitaprajna). It begins with casting aside cravings and fantasies concocted by the restless mind. When an individual discovers complete, overflowing fulfillment within their own conscious being, they no longer look to external approval, acquisitions, or conditions to make them whole.',
  simpleMeaningHi:
    'श्रीकृष्ण स्थितप्रज्ञ (स्थिर प्रज्ञा वाले महापुरुष) का मूल लक्षण बताते हैं: जो अपने मन की समस्त स्वार्थपूर्ण कामनाओं को पूरी तरह त्याग देता है। ऐसा व्यक्ति आनंद और शांति के लिए बाहरी वस्तुओं या परिस्थितियों का मोहताज नहीं रहता; वह अपनी अंतरात्मा में ही परम संतुष्ट रहता है।',

  keyWords: [
    {
      pada: 'प्रजहाति (Prajahāti)',
      iast: 'prajahāti',
      root: 'प्र + हा (पूरी तरह छोड़ना)',
      functionalMeaning: 'Completely casts away or relinquishes.',
      functionalMeaningHi: 'भली-भांति त्याग देता है।',
    },
    {
      pada: 'सर्वान् कामान् मनोगतान् (Sarvān kāmān manogatān)',
      iast: 'sarvān kāmān manogatān',
      root: 'सर्व + काम + मनोगत',
      functionalMeaning: 'All cravings and fantasies harbored in the mind.',
      functionalMeaningHi: 'मन में उठने वाली समस्त कामनाएं।',
    },
    {
      pada: 'आत्मन्येवात्मना तुष्टः (Ātmanyevātmanā tuṣṭaḥ)',
      iast: 'ātmanyeva ātmanā tuṣṭaḥ',
      root: 'आत्मन् + तुष् (स्वयं में संतुष्ट)',
      functionalMeaning: 'Delighted and contented in the Self by the Self alone.',
      functionalMeaningHi: 'अपने आप से अपनी ही आत्मा में संतुष्ट।',
    },
    {
      pada: 'स्थितप्रज्ञः (Sthitaprajñaḥ)',
      iast: 'sthitaprajñaḥ',
      root: 'स्था + प्रज्ञा (स्थिर बुद्धि)',
      functionalMeaning: 'One of unwavering, stabilized wisdom and discernment.',
      functionalMeaningHi: 'स्थिर बुद्धि वाला आत्मज्ञानी।',
    },
  ],

  whyItMattersToday: [
    {
      title: 'Escaping the Hedonic Treadmill',
      titleHi: 'इच्छाओं की अंतहीन दौड़ से मुक्ति',
      text: 'Every satisfied material desire quickly generates three new cravings. Internal contentment stops this exhausting cycle.',
    },
    {
      title: 'Self-Sufficiency vs External Validation',
      titleHi: 'आत्म-संतोष बनाम बाहरी स्वीकृति की भूख',
      text: 'Anchoring self-worth in your own conscious presence ends addiction to notifications, social standing, and praise.',
    },
    {
      title: 'Deep Clarity and Focus',
      titleHi: 'मानसिक शांति और एकाग्रता',
      text: 'A mind liberated from obsessive wanting has immense creative and intellectual stamina to serve and create.',
    },
  ],

  modernExample: {
    context: 'Breaking Dependency on External Approval, Status, or Material Upgrades',
    contextHi: 'सोशल मीडिया लाइक्स या भौतिक वस्तुओं पर निर्भर खुशी से मुक्ति',
    scenarioEn:
      'If your peace of mind depends on buying the latest phone, receiving dozens of compliments on social media, or getting public praise from your manager, your happiness is hostage to outside factors. The sthitaprajna enjoys good things when present, but their baseline contentment is rooted in their own quiet presence, needing nothing external to feel complete.',
    scenarioHi:
      'यदि हमारी खुशी केवल फोन के नए मॉडल या सोशल मीडिया के लाइक्स पर निर्भर है, तो हम कभी शांत नहीं रह सकते। स्थितप्रज्ञ वह है जो अपने भीतर ही शांति का स्रोत खोज लेता है और बाहरी चीजों का गुलाम नहीं बनता।',
    disclaimer: 'समसामयिक संपादकीय उदाहरण · प्राचीन शास्त्र का मूल भाग नहीं (Editorial Modern Illustration · Not Scripture)',
  },

  whatItDoesNotMean: [
    {
      title: 'It does NOT mean: "Having no ambitions, goals, or creative drive"',
      titleHi: 'यह कार्य या सृजन के त्याग की बात नहीं है',
      text: 'The sage acts with vigorous excellence; they renounce personal selfish clinging, not constructive action.',
    },
    {
      title: 'It does NOT mean: "Becoming a cold, emotionless hermit"',
      titleHi: 'यह भावनाशून्यता या वैराग्य का पाखंड नहीं है',
      text: 'True contentment produces effortless warmth, generosity, and peace toward others.',
    },
  ],

  tryThisToday: {
    title: 'The Inner Wellspring Pause',
    titleHi: 'आत्म-संतोष का क्षण',
    instructionEn:
      'When you feel a sudden urge to buy something unnecessary or check your phone for validation today, take 3 deep breaths and repeat: "In this moment, I am already complete; nothing external is required for my peace."',
    instructionHi:
      'जब भी आज कुछ अनावश्यक खरीदने या फोन पर लाइक्स देखने की तीव्र इच्छा हो, तो 3 गहरी सांसें लें और महसूस करें कि आप इस पल में पूरी तरह पर्याप्त और शांत हैं।',
    duration: '1 minute',
  },

  reflectionQuestion: {
    en: 'What external circumstance or possession are you convinced you must attain before you can finally permit yourself to be peaceful?',
    hi: 'आप किस बाहरी वस्तु या परिस्थिति के मिलने का इंतजार कर रहे हैं, जिसके बिना आप खुद को शांत नहीं मान पाते?',
  },

  traditionalCommentary: {
    shankara: {
      author: 'आदि शंकराचार्य (Adi Shankaracharya)',
      tradition: 'अद्वैत वेदान्त (Advaita Vedanta)',
      work: 'श्रीमद्भगवद्गीताभाष्य (Gita Bhashya 2.55)',
      summaryEn:
        'When all desires prompted by avidya (ignorance) fall away, the wise realize their identity with the Supreme Self and rest perpetually fulfilled in non-dual bliss.',
      summaryHi:
        'अविद्याजन्य समस्त कामनाओं का त्याग होने पर विद्वान् अपनी अंतरात्मा में ही परमानंद का अनुभव कर स्थितप्रज्ञ बनता है।',
    },
    ramanuja: {
      author: 'रामानुजाचार्य (Ramanujacharya)',
      tradition: 'विशिष्टाद्वैत वेदान्त (Vishishtadvaita Vedanta)',
      work: 'गीताभाष्य (Gita Bhashya 2.55)',
      summaryEn:
        'By experiencing the intrinsic nectar of the conscious soul (jiva-svarupa), attraction toward worldly pleasures drops away spontaneously, establishing unshakeable wisdom.',
      summaryHi:
        'जब साधक को आत्म-स्वरूप के अलौकिक आनंद का स्वाद मिल जाता है, तो सांसारिक विषयों की तुच्छ कामनाएं अपने आप छूट जाती हैं।',
    },
    sridhara: {
      author: 'श्रीधर स्वामी (Sridhara Swami)',
      tradition: 'सुबोधिनी टीका (Subodhini 2.55)',
      work: 'भगवद्गीता सुबोधिनी',
      summaryEn:
        'Krishna emphasizes that contentment in the Self is the cardinal symptom of enlightenment, because one who tastes inner nectar ceases thirsting for brackish water.',
      summaryHi:
        'आत्म-संतोष ही ज्ञानी का सबसे बड़ा प्रमाण है; जिसे अमृत मिल गया हो, वह खारे पानी के पीछे नहीं भागता।',
    },
  },

  sourceTransparency: {
    scripture: 'श्रीमद्भगवद्गीता (Bhagavad Gita)',
    reference: 'अध्याय 2, श्लोक 55 (Chapter 2, Verse 55)',
    epicContext: 'महाभारत, भीष्म पर्व, अध्याय 26 (Mahābhārata, Bhīṣma Parva 26.55)',
    sanskritEdition: 'गीताप्रेस गोरखपुर (Gita Press Gorakhpur) & भांडारकर प्राच्य विद्या संशोधन मंदिर (BORI Critical Edition)',
    meter: 'अनुष्टुप् छन्द (Anuṣṭubh — 8 syllables × 4 quarters)',
    epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',
    editorialNote:
      'Modern psychological reflections are contemporary educational aids, strictly distinct from ancient revealed text.',
  },
};

export const GITA_2_56_PEDAGOGICAL: PedagogicalVerseData = {
  scriptureId: 'bhagavadgita',
  chapterId: 2,
  verseId: 56,
  scriptureTitle: 'Bhagavad Gita',
  scriptureTitleSanskrit: 'श्रीमद्भगवद्गीता',
  chapterTitle: 'Sankhya Yoga',
  chapterTitleSanskrit: 'सांख्ययोग',
  sanskrit: 'दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः ।\nवीतरागभयक्रोधः स्थितधीर्मुनिरुच्यते ॥',
  transliteration: 'duḥkheṣvanudvignamanāḥ sukheṣu vigataspṛhaḥ |\nvītarāgabhayakrodhaḥ sthitadhīrmunirucyate ||',
  meter: 'अनुष्टुप् (Anuṣṭubh — 32 syllables)',
  epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',

  inOneLineEn: 'Unshaken in sorrow, free from craving in pleasures, and released from passion, fear, and anger, one is a sage of steady mind.',
  inOneLineHi: 'दुःखों में जिसका मन उद्विग्न नहीं होता, सुखों में जो लालसा से मुक्त है, और जिसके राग, भय व क्रोध नष्ट हो चुके हैं, वह स्थिरबुद्धि मुनि कहलाता है।',

  simpleMeaningEn:
    'Krishna describes the emotional equilibrium of a stabilized sage in daily experience. When sorrow or misfortune strikes, their mind does not plunge into panic or resentment. When pleasant circumstances arise, they do not develop clinging addiction or thirst for more. Having transcended attachment (raga), dread (bhaya), and wrath (krodha), they remain an anchored contemplative thinker (sthitadhih munih).',
  simpleMeaningHi:
    'श्रीकृष्ण स्थितप्रज्ञ के व्यावहारिक आचरण का वर्णन करते हैं: जीवन के दुखों में जिसका मन घबराता या टूटता नहीं, सुखों के मिलने पर जो उसमें अंधा होकर और अधिक पाने की तृष्णा नहीं करता, और जिसके भीतर से आसक्ति, भय तथा क्रोध शांत हो चुके हैं, वही सच्चा स्थिरबुद्धि मुनि है।',

  keyWords: [
    {
      pada: 'दुःखेषु अनुद्विग्नमनाः (Duḥkheṣu anudvignamanāḥ)',
      iast: 'duḥkheṣu anudvigna-manāḥ',
      root: 'दुःख + अन्-उद्विज् + मनस्',
      functionalMeaning: 'Unagitated and free from panic amidst sorrow.',
      functionalMeaningHi: 'कष्टों में विचलित या व्यग्र न होने वाला।',
    },
    {
      pada: 'सुखेषु विगतस्पृहः (Sukheṣu vigataspṛhaḥ)',
      iast: 'sukheṣu vigata-spṛhaḥ',
      root: 'सुख + वि-गम् + स्पृह्',
      functionalMeaning: 'Free from craving and possessiveness amidst pleasant conditions.',
      functionalMeaningHi: 'सुखों में तृष्णा और लोभ से रहित।',
    },
    {
      pada: 'वीतरागभयक्रोधः (Vītarāgabhayakrodhaḥ)',
      iast: 'vīta-rāga-bhaya-krodhaḥ',
      root: 'वि-इ + राग + भय + क्रोध',
      functionalMeaning: 'Free from blind attachment, anxiety/fear, and anger.',
      functionalMeaningHi: 'जिसके राग, भय और क्रोध समाप्त हो चुके हैं।',
    },
    {
      pada: 'स्थितधीः मुनिः (Sthitadhīḥ muniḥ)',
      iast: 'sthitadhīḥ muniḥ',
      root: 'स्था + धी + मन्',
      functionalMeaning: 'A contemplative seeker of anchored, steady intellect.',
      functionalMeaningHi: 'स्थिर बुद्धि वाला मननशील ज्ञानी।',
    },
  ],

  whyItMattersToday: [
    {
      title: 'Emotional Resilience Under Pressure',
      titleHi: 'कठिन समय में भावनात्मक मजबूती',
      text: 'Adversity is guaranteed in life; suffering is caused by psychological panic. Anudvigna-manāḥ gives inner stamina.',
    },
    {
      title: 'Sobriety During Times of Success',
      titleHi: 'सफलता के समय संयम और संतुलन',
      text: 'Winning often leads to reckless overconfidence. Freedom from greedy craving maintains grounded perspective.',
    },
    {
      title: 'Freedom from the Triad of Distraction',
      titleHi: 'राग, भय और क्रोध से मुक्ति',
      text: 'Attachment creates fear of loss; fear of loss breeds anger at obstacles. Eliminating all three protects sanity.',
    },
  ],

  modernExample: {
    context: 'Managing Market Crashes, Sudden Illness, or Unexpected Windfalls',
    contextHi: 'अचानक आई विपत्ति, बीमारी या बड़ी सफलता के समय संयम',
    scenarioEn:
      'If a startup founder panics and lashes out at employees when an investment falls through, or becomes arrogant and reckless when a funding round closes, their mind lacks stability. A mature leader reviews setbacks without despair, greets windfalls without ego, and makes wise decisions from a place of unshakeable poise.',
    scenarioHi:
      'जब किसी प्रोजेक्ट में बड़ा नुकसान हो जाए तो हताश होकर दूसरों पर गुस्सा न करना, और जब बड़ी सफलता मिले तो घमंड में न आना — दोनों परिस्थितियों में शांत रहकर आगे का रास्ता देखना ही स्थितधी का लक्षण है।',
    disclaimer: 'समसामयिक संपादकीय उदाहरण · प्राचीन शास्त्र का मूल भाग नहीं (Editorial Modern Illustration · Not Scripture)',
  },

  whatItDoesNotMean: [
    {
      title: 'It does NOT mean: "Being completely unfeeling like a stone"',
      titleHi: 'यह पत्थर की तरह संवेदनहीन होना नहीं है',
      text: 'The sage feels life deeply, but their judgment is not hijacked by turbulent emotional reactivity.',
    },
    {
      title: 'It does NOT mean: "Never celebrating achievements"',
      titleHi: 'यह उपलब्धियों के आनंद का निषेध नहीं है',
      text: 'One can enjoy a joyful moment with gratitude while remaining free from obsessive clutching for more.',
    },
  ],

  tryThisToday: {
    title: 'The Triad Check: Attachment, Fear, Anger',
    titleHi: 'राग, भय और क्रोध की परख',
    instructionEn:
      'Whenever you feel agitated today, pause and diagnose: "Is this irritation coming from craving something I want (raga), dreading an outcome (bhaya), or frustration at an obstacle (krodha)?" Naming it immediately restores perspective.',
    instructionHi:
      'आज जब भी मन में अशांति आए, रुककर पहचानें: क्या यह किसी चीज की जिद (राग) है, अनहोनी का डर (भय), या बात न बनने का गुस्सा (क्रोध)? कारण पहचानते ही मन शांत होने लगता है।',
    duration: '< 2 minutes',
  },

  reflectionQuestion: {
    en: 'Which of the three—attachment, fear, or anger—most frequently knocks your intellect off balance during a typical week?',
    hi: 'राग (आसक्ति), भय या क्रोध — इनमें से कौन सा विकार आपकी बुद्धि को सबसे ज्यादा भटकाता है?',
  },

  traditionalCommentary: {
    shankara: {
      author: 'आदि शंकराचार्य (Adi Shankaracharya)',
      tradition: 'अद्वैत वेदान्त (Advaita Vedanta)',
      work: 'श्रीमद्भगवद्गीताभाष्य (Gita Bhashya 2.56)',
      summaryEn:
        'Sorrow arises from physical, mental, or cosmic distress; one who does not tremble in agony during these, nor craves fire-like pleasures, is a true muni (sage).',
      summaryHi:
        'आधिभौतिक, आधिदैविक और आध्यात्मिक दुखों में जिसका मन नहीं कांपता और जो सुखों में लोलुप नहीं होता, वही संन्यासी स्थितप्रज्ञ है।',
    },
    ramanuja: {
      author: 'रामानुजाचार्य (Ramanujacharya)',
      tradition: 'विशिष्टाद्वैत वेदान्त (Vishishtadvaita Vedanta)',
      work: 'गीताभाष्य (Gita Bhashya 2.56)',
      summaryEn:
        'The aspirant who constantly meditates on the divine nature of the Self purifies the mind of passion, dread, and fury, attaining durable mental equilibrium.',
      summaryHi:
        'आत्म-चिंतन में रत रहने से राग, भय और क्रोध की निवृत्ति होती है और बुद्धि सदा स्थिर बनी रहती है।',
    },
    sridhara: {
      author: 'श्रीधर स्वामी (Sridhara Swami)',
      tradition: 'सुबोधिनी टीका (Subodhini 2.56)',
      work: 'भगवद्गीता सुबोधिनी',
      summaryEn:
        'Equanimity across grief and joy proves that discernment has become a natural character trait rather than an intellectual pose.',
      summaryHi:
        'सुख और दुःख में मन का एक समान शांत रहना ही यह सिद्ध करता है कि ज्ञान केवल बातों में नहीं, बल्कि आचरण में उतर चुका है।',
    },
  },

  sourceTransparency: {
    scripture: 'श्रीमद्भगवद्गीता (Bhagavad Gita)',
    reference: 'अध्याय 2, श्लोक 56 (Chapter 2, Verse 56)',
    epicContext: 'महाभारत, भीष्म पर्व, अध्याय 26 (Mahābhārata, Bhīṣma Parva 26.56)',
    sanskritEdition: 'गीताप्रेस गोरखपुर (Gita Press Gorakhpur) & भांडारकर प्राच्य विद्या संशोधन मंदिर (BORI Critical Edition)',
    meter: 'अनुष्टुप् छन्द (Anuṣṭubh — 8 syllables × 4 quarters)',
    epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',
    editorialNote:
      'Modern psychological reflections are contemporary educational aids, strictly distinct from ancient revealed text.',
  },
};

export const GITA_2_62_PEDAGOGICAL: PedagogicalVerseData = {
  scriptureId: 'bhagavadgita',
  chapterId: 2,
  verseId: 62,
  scriptureTitle: 'Bhagavad Gita',
  scriptureTitleSanskrit: 'श्रीमद्भगवद्गीता',
  chapterTitle: 'Sankhya Yoga',
  chapterTitleSanskrit: 'सांख्ययोग',
  sanskrit: 'ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते ।\nसङ्गात् संजायते कामः कामात्क्रोधोऽभिजायते ॥',
  transliteration: 'dhyāyato viṣayānpuṁsaḥ saṅgasteṣūpajāyate |\nsaṅgāt saṁjāyate kāmaḥ kāmātkrodho\'bhijāyate ||',
  meter: 'अनुष्टुप् (Anuṣṭubh — 32 syllables)',
  epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',

  inOneLineEn: 'Dwelling on sense objects generates attachment; from attachment arises longing desire; from thwarted desire erupts anger.',
  inOneLineHi: 'विषयों का निरंतर ध्यान करने से उनमें आसक्ति पैदा होती है; आसक्ति से कामना उत्पन्न होती है, और कामना में रुकावट आने से क्रोध भड़कता है।',

  simpleMeaningEn:
    'Krishna exposes the psychological genesis of human downfall. Degradation does not begin with an overt catastrophe; it starts with innocent-looking mental brooding. When thoughts repeatedly dwell on sensory pleasures or worldly objects, an emotional bond (sanga) forms. This bond intensifies into compulsive longing (kama). And whenever that longing encounters resistance or delay, it inevitably ignites into burning anger (krodha).',
  simpleMeaningHi:
    'श्रीकृष्ण पतन के पहले तीन चरणों का सूक्ष्म मनोवैज्ञानिक विश्लेषण करते हैं। मनुष्य का पतन किसी बड़े अपराध से नहीं, बल्कि मन के छोटे से भटकाव से शुरू होता है। जब मन किसी भोग या वस्तु का बार-बार चिंतन करता है, तो उसमें लगाव (संग) हो जाता है। लगाव से तीव्र इच्छा (काम) पैदा होती है। और जब उस इच्छा में जरा सी भी रुकावट आती है, तो क्रोध भड़क उठता है।',

  keyWords: [
    {
      pada: 'ध्यायतः विषयान् (Dhyāyataḥ viṣayān)',
      iast: 'dhyāyataḥ viṣayān',
      root: 'ध्यै + विषय',
      functionalMeaning: 'Meditating on, brooding upon, or visualizing sense objects.',
      functionalMeaningHi: 'विषयों का निरंतर चिंतन करते हुए।',
    },
    {
      pada: 'सङ्गः उपजायते (Saṅgaḥ upajāyate)',
      iast: 'saṅgaḥ upajāyate',
      root: 'सञ्ज् + उप-जन्',
      functionalMeaning: 'Psychological attachment and emotional clinging is born.',
      functionalMeaningHi: 'आसक्ति और गहरा लगाव उत्पन्न होता है।',
    },
    {
      pada: 'कामात् क्रोधः अभिजायते (Kāmāt krodhaḥ abhijāyate)',
      iast: 'kāmāt krodhaḥ abhijāyate',
      root: 'काम + क्रोध + अभि-जन्',
      functionalMeaning: 'From obstructed longing, fury and frustration arise.',
      functionalMeaningHi: 'कामना पूरी न होने पर क्रोध पैदा होता है।',
    },
  ],

  whyItMattersToday: [
    {
      title: 'The Mechanics of Digital & Behavioral Addiction',
      titleHi: 'डिजिटल और मानसिक लत की प्रक्रिया',
      text: 'Passive visual browsing feeds dopamine loops that turn mild curiosity into compulsive craving and restless agitation.',
    },
    {
      title: 'Tracing Anger to Its Hidden Origin',
      titleHi: 'क्रोध के मूल कारण को समझना',
      text: 'We blame colleagues, spouses, or traffic for our anger; the Gita reveals anger is simply a frustrated selfish desire.',
    },
    {
      title: 'Guarding the Gates of Thought',
      titleHi: 'मानसिक विचारों पर सजग पहरा',
      text: 'Stopping downfall at stage one (visualizing) requires a fraction of the effort needed to control full-blown rage.',
    },
  ],

  modernExample: {
    context: 'Impulsive Online Shopping, Gaming, or Envy on Social Feeds',
    contextHi: 'ऑनलाइन शॉपिंग, गेमिंग या सोशल मीडिया पर दूसरों को देखकर ईर्ष्या',
    scenarioEn:
      'You see an expensive gadget or luxury vacation online and casually look at reviews. Soon you spend hours thinking about owning it (dhyana). Attachment forms, turning into urgent desire (kama). If a credit card declines or budget forces you to wait, sudden rage, irritation, or resentment toward family members flares up (krodha). The seed was simply dwelling on the object.',
    scenarioHi:
      'आपने इंटरनेट पर कोई महंगी चीज देखी। बार-बार उसके बारे में सोचने से इच्छा तीव्र हो गई। और जब किसी कारण से वह नहीं मिल पाई, तो परिवार या दोस्तों पर गुस्सा फूट पड़ा। इस गुस्से की जड़ वस्तु के निरंतर चिंतन में थी।',
    disclaimer: 'समसामयिक संपादकीय उदाहरण · प्राचीन शास्त्र का मूल भाग नहीं (Editorial Modern Illustration · Not Scripture)',
  },

  whatItDoesNotMean: [
    {
      title: 'It does NOT mean: "Sensory objects or the physical world are evil"',
      titleHi: 'यह संसार या वस्तुओं को बुरा बताना नहीं है',
      text: 'Objects are neutral; the flaw lies in obsessive mental rumination and unconscious dependency.',
    },
    {
      title: 'It does NOT mean: "All desires (like learning or serving) are destructive"',
      titleHi: 'यह ज्ञान या सेवा के पवित्र संकल्पों का विरोध नहीं है',
      text: 'Kama here refers to self-centered sensory cravings that hijack discernment, not dharmic aspirations.',
    },
  ],

  tryThisToday: {
    title: 'Catching the First Step: The Thought Snip',
    titleHi: 'शुरुआती विचार को पकड़ना',
    instructionEn:
      'Notice today whenever your mind begins daydreaming or looping compulsively about a luxury, complaint, or rival. Gently say "not now" and redirect your attention to your breathing or immediate task before attachment forms.',
    instructionHi:
      'आज जैसे ही मन किसी व्यर्थ की इच्छा या शिकायत में उलझने लगे, तुरंत सजग होकर अपना ध्यान अपनी सांस या वर्तमान काम पर ले आएं।',
    duration: '< 1 minute',
  },

  reflectionQuestion: {
    en: 'What thought or craving have you been passively entertaining that is quietly creating irritation or anger in your relationships?',
    hi: 'आप किस इच्छा या विचार को मन में पाल रहे हैं, जो आपके स्वभाव में झुंझलाहट और गुस्सा पैदा कर रहा है?',
  },

  traditionalCommentary: {
    shankara: {
      author: 'आदि शंकराचार्य (Adi Shankaracharya)',
      tradition: 'अद्वैत वेदान्त (Advaita Vedanta)',
      work: 'श्रीमद्भगवद्गीताभाष्य (Gita Bhashya 2.62)',
      summaryEn:
        'Thinking of sense objects creates closeness (sanga); closeness becomes longing (kama); and when kama is blocked, anger flares toward whatever stands in the way.',
      summaryHi:
        'विषयों के चिंतन से संग (आसक्ति) होता है, संग से तृष्णा होती है, और तृष्णा प्रतिहत होने पर रुकावट डालने वाले के प्रति क्रोध उत्पन्न होता है।',
    },
    ramanuja: {
      author: 'रामानुजाचार्य (Ramanujacharya)',
      tradition: 'विशिष्टाद्वैत वेदान्त (Vishishtadvaita Vedanta)',
      work: 'गीताभाष्य (Gita Bhashya 2.62)',
      summaryEn:
        'Without mastery of the senses directed in service of God, the restless mind naturally gravitates toward material stimuli, igniting the chain of spiritual decline.',
      summaryHi:
        'इन्द्रियों के वशीभूत न होने पर मन विषयों की ओर दौड़ता है, जिससे आसक्ति, कामना और क्रोध की विनाशकारी श्रृंखला जन्म लेती है।',
    },
    sridhara: {
      author: 'श्रीधर स्वामी (Sridhara Swami)',
      tradition: 'सुबोधिनी टीका (Subodhini 2.62)',
      work: 'भगवद्गीता सुबोधिनी',
      summaryEn:
        'This psychological sequence warns seekers that even mental contemplation of forbidden desires inevitably culminates in passionate fury.',
      summaryHi:
        'यह श्लोक साधकों को सावधान करता है कि केवल मन से भी विषयों का चिंतन करने पर अंततः क्रोध और पतन अवश्यंभावी है।',
    },
  },

  sourceTransparency: {
    scripture: 'श्रीमद्भगवद्गीता (Bhagavad Gita)',
    reference: 'अध्याय 2, श्लोक 62 (Chapter 2, Verse 62)',
    epicContext: 'महाभारत, भीष्म पर्व, अध्याय 26 (Mahābhārata, Bhīṣma Parva 26.62)',
    sanskritEdition: 'गीताप्रेस गोरखपुर (Gita Press Gorakhpur) & भांडारकर प्राच्य विद्या संशोधन मंदिर (BORI Critical Edition)',
    meter: 'अनुष्टुप् छन्द (Anuṣṭubh — 8 syllables × 4 quarters)',
    epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',
    editorialNote:
      'Modern psychological reflections are contemporary educational aids, strictly distinct from ancient revealed text.',
  },
};

export const GITA_2_63_PEDAGOGICAL: PedagogicalVerseData = {
  scriptureId: 'bhagavadgita',
  chapterId: 2,
  verseId: 63,
  scriptureTitle: 'Bhagavad Gita',
  scriptureTitleSanskrit: 'श्रीमद्भगवद्गीता',
  chapterTitle: 'Sankhya Yoga',
  chapterTitleSanskrit: 'सांख्ययोग',
  sanskrit: 'क्रोधाद्भवति संमोहः संमोहात्स्मृतिविभ्रमः ।\nस्मृतिभ्रंशाद् बुद्धिनाशो बुद्धिनाशात्प्रणश्यति ॥',
  transliteration: 'krodhādbhavati saṁmohaḥ saṁmohātsmṛtivibhramaḥ |\nsmṛtibhraṁśād buddhināśo buddhināśātpraṇaśyati ||',
  meter: 'अनुष्टुप् (Anuṣṭubh — 32 syllables)',
  epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',

  inOneLineEn: 'From anger comes delusion; from delusion confusion of memory; from lost memory the ruin of intellect; and from the ruin of intellect one perishes.',
  inOneLineHi: 'क्रोध से सम्मोह (अविवेक) उत्पन्न होता है, सम्मोह से स्मृति भ्रमित होती है, स्मृति के भ्रम से बुद्धि का नाश होता है, और बुद्धि के नाश से मनुष्य नष्ट हो जाता है।',

  simpleMeaningEn:
    'Krishna maps the final cascade of psychological ruin. Once anger erupts, clear discernment is clouded by delusion (sammoha). In that fog, the memory (smriti) of personal values, lessons of experience, and moral boundaries is forgotten. With memory eclipsed, the rational intellect (buddhi) is destroyed. Deprived of discriminative intellect, the human being loses the capacity to choose rightly and perishes.',
  simpleMeaningHi:
    'श्रीकृष्ण पतन की सीढ़ी के अंतिम चरणों का उद्घाटन करते हैं: क्रोध आने पर विवेक अंधा हो जाता है (सम्मोह)। इस अविवेक के कारण सही-गलत की समझ और मर्यादाओं की स्मृति खो जाती है (स्मृतिविभ्रम)। स्मृति नष्ट होने से भले-बुरे का निर्णय करने वाली बुद्धि समाप्त हो जाती है (बुद्धिनाश)। और जब बुद्धि ही नष्ट हो जाती है, तो मनुष्य जीवन के सच्चे लक्ष्य से गिरकर नष्ट हो जाता है।',

  keyWords: [
    {
      pada: 'क्रोधात् सम्मोहः (Krodhāt sammohaḥ)',
      iast: 'krodhāt sammohaḥ',
      root: 'क्रोध + सम्-मुह्',
      functionalMeaning: 'From wrath arises delusion and loss of moral clarity.',
      functionalMeaningHi: 'क्रोध से अविवेक और अंधापन पैदा होता है।',
    },
    {
      pada: 'स्मृतिविभ्रमः (Smṛti-vibhramaḥ)',
      iast: 'smṛti-vibhramaḥ',
      root: 'स्मृ + वि-भ्रम्',
      functionalMeaning: 'Bewilderment of memory and forgetfulness of ethical wisdom.',
      functionalMeaningHi: 'सीखे हुए ज्ञान और मर्यादाओं का विस्मरण।',
    },
    {
      pada: 'बुद्धिनाशः (Buddhi-nāśaḥ)',
      iast: 'buddhi-nāśaḥ',
      root: 'बुध् + नश्',
      functionalMeaning: 'Destruction of the discriminative faculty and discernment.',
      functionalMeaningHi: 'विवेक और निर्णय क्षमता का विनाश।',
    },
    {
      pada: 'प्रणश्यति (Praṇaśyati)',
      iast: 'praṇaśyati',
      root: 'प्र + नश्',
      functionalMeaning: 'Falls completely, perishes psychologically and spiritually.',
      functionalMeaningHi: 'मनुष्य का सर्वथा पतन हो जाता है।',
    },
  ],

  whyItMattersToday: [
    {
      title: 'Preventing Catastrophic Impulsive Outbursts',
      titleHi: 'क्रोध में अनर्थकारी फैसलों से बचाव',
      text: 'A 10-second flash of blind fury can wreck a decade of professional credibility, marriage, or health.',
    },
    {
      title: 'Safeguarding Executive Function & Memory',
      titleHi: 'निर्णय लेने की शक्ति की रक्षा',
      text: 'Neuroscience confirms that intense anger downregulates the prefrontal cortex; Krishna described this loss of buddhi millennia ago.',
    },
    {
      title: 'Recognizing the Point of No Return',
      titleHi: 'पतन की श्रृंखला को समय रहते तोड़ना',
      text: 'Awareness of the chain empowers you to halt emotional escalation before delusion blinds your moral compass.',
    },
  ],

  modernExample: {
    context: 'Road Rage, Workplace Outbursts, or Heated Domestic Fights',
    contextHi: 'सड़क पर विवाद, कार्यस्थल पर विवाद या गुस्से में रिश्ते तोड़ना',
    scenarioEn:
      'In a traffic altercation or marital argument, someone becomes enraged. In blinding anger, they forget decades of good reputation, legal consequences, and their love for their family (smriti-vibhrama). Their rational judgment fails (buddhi-nasha), and they do or say something catastrophic that permanently derails their life or career (pranasyati).',
    scenarioHi:
      'सड़क पर या घर में गुस्से के एक क्षण में मनुष्य भूल जाता है कि उसके संस्कार क्या हैं और इसके क्या परिणाम होंगे (स्मृतिभ्रम)। बुद्धि काम करना बंद कर देती है और वह ऐसा कदम उठा लेता है जिससे उसका पूरा जीवन या संबंध बर्बाद हो जाते हैं।',
    disclaimer: 'समसामयिक संपादकीय उदाहरण · प्राचीन शास्त्र का मूल भाग नहीं (Editorial Modern Illustration · Not Scripture)',
  },

  whatItDoesNotMean: [
    {
      title: 'It does NOT mean: "Physical death occurs the moment one feels angry"',
      titleHi: 'यह तुरंत शारीरिक मृत्यु की बात नहीं है',
      text: 'Pranasyati means spiritual ruin, loss of noble character, and collapse of meaningful human fulfillment.',
    },
    {
      title: 'It does NOT mean: "Repressing emotions until they explode"',
      titleHi: 'यह गुस्से को दबाने की बात नहीं है',
      text: 'True resolution comes from cultivating self-awareness at earlier stages, not building pressurized emotional denial.',
    },
  ],

  tryThisToday: {
    title: 'The Emergency Freeze Rule',
    titleHi: 'क्रोध में निर्णय रोकने का नियम',
    instructionEn:
      'Commit to one inviolable rule today: When you notice blood rushing with anger, do not send that email, do not reply to that message, and do not make that decision for at least 15 minutes until memory and intellect come back online.',
    instructionHi:
      'आज एक नियम बनाएं: जब भी अत्यधिक क्रोध आए, तो कम से कम 15 मिनट तक न तो कोई ईमेल भेजें, न कोई संदेश टाइप करें और न ही कोई बड़ा निर्णय लें।',
    duration: '15-minute rule',
  },

  reflectionQuestion: {
    en: 'Think of a past decision you bitterly regret: Can you trace how anger or impulsive desire shut down your intellect before you made it?',
    hi: 'अतीत के किसी ऐसे निर्णय को याद करें जिस पर आपको पछतावा हुआ हो: क्या आप देख सकते हैं कि कैसे क्रोध ने आपके विवेक को नष्ट कर दिया था?',
  },

  traditionalCommentary: {
    shankara: {
      author: 'आदि शंकराचार्य (Adi Shankaracharya)',
      tradition: 'अद्वैत वेदान्त (Advaita Vedanta)',
      work: 'श्रीमद्भगवद्गीताभाष्य (Gita Bhashya 2.63)',
      summaryEn:
        'From anger arises delusion (non-discrimination between right and wrong). Thence confusion of memory regarding teacher’s instruction. Thus intellect is incapacitated, and the person is ruined like a living corpse.',
      summaryHi:
        'क्रोध से अविवेक, अविवेक से शास्त्र और गुरु के उपदेश की विस्मृति, विस्मृति से बुद्धि का नाश होकर मनुष्य जीते-जी नष्ट हो जाता है।',
    },
    ramanuja: {
      author: 'रामानुजाचार्य (Ramanujacharya)',
      tradition: 'विशिष्टाद्वैत वेदान्त (Vishishtadvaita Vedanta)',
      work: 'गीताभाष्य (Gita Bhashya 2.63)',
      summaryEn:
        'Delusion caused by anger strips the seeker of effort in self-realization; with the loss of spiritual memory and intellect, the soul is plunged once more into samsara.',
      summaryHi:
        'क्रोध से उत्पन्न सम्मोह आत्मा के ज्ञान को ढक देता है, जिससे बुद्धि भ्रष्ट होकर साधक पुनः संसार चक्र में गिर जाता है।',
    },
    sridhara: {
      author: 'श्रीधर स्वामी (Sridhara Swami)',
      tradition: 'सुबोधिनी टीका (Subodhini 2.63)',
      work: 'भगवद्गीता सुबोधिनी',
      summaryEn:
        'Intellect (buddhi) is the distinguishing capacity of human life. When it is destroyed by the frenzy of wrath, a human being becomes no different from an animal.',
      summaryHi:
        'बुद्धि ही मनुष्य को पशु से भिन्न बनाती है। जब क्रोध से बुद्धि ही नष्ट हो गई, तो मनुष्य का सर्वस्व नष्ट हो गया।',
    },
  },

  sourceTransparency: {
    scripture: 'श्रीमद्भगवद्गीता (Bhagavad Gita)',
    reference: 'अध्याय 2, श्लोक 63 (Chapter 2, Verse 63)',
    epicContext: 'महाभारत, भीष्म पर्व, अध्याय 26 (Mahābhārata, Bhīṣma Parva 26.63)',
    sanskritEdition: 'गीताप्रेस गोरखपुर (Gita Press Gorakhpur) & भांडारकर प्राच्य विद्या संशोधन मंदिर (BORI Critical Edition)',
    meter: 'अनुष्टुप् छन्द (Anuṣṭubh — 8 syllables × 4 quarters)',
    epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',
    editorialNote:
      'Modern psychological reflections are contemporary educational aids, strictly distinct from ancient revealed text.',
  },
};

export const ISHA_1_PEDAGOGICAL: PedagogicalVerseData = {
  scriptureId: 'ishavasya',
  chapterId: 1,
  verseId: 1,
  scriptureTitle: 'Isha Upanishad',
  scriptureTitleSanskrit: 'ईशावास्योपनिषद्',
  chapterTitle: 'Mantra 1',
  chapterTitleSanskrit: 'प्रथम मंत्र',
  sanskrit: 'ईशा वास्यमिदं सर्वं यत्किञ्च जगत्यां जगत् ।\nतेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम् ॥',
  transliteration: 'īśā vāsyāmidaṃ sarvaṃ yatkiñca jagatyāṃ jagat |\ntena tyaktena bhuñjīthā mā gṛdhaḥ kasyasviddhanam ||',
  meter: 'अनुष्टुप् (Anuṣṭubh — 32 syllables)',
  epistemicTier: 'मूल श्रुति पाठ (Canonical Shruti Scripture)',

  inOneLineEn: 'All this transient universe is enveloped by the Divine; enjoy with renunciation, coveting no one’s wealth.',
  inOneLineHi: 'इस गतिशील जगत में सब कुछ ईश्वर से व्याप्त है; त्यागभाव से उपभोग करो, किसी के धन का लोभ मत करो।',

  simpleMeaningEn:
    'Recognize that every changing element in this universe is pervaded by a sacred, divine reality. Enjoy and care for what has been entrusted to you with a sense of detachment, without possessive greed. True joy comes not from hoarders, but from those who see the sacred unity in all things.',
  simpleMeaningHi:
    'संसार के प्रत्येक कण में परमात्मा की उपस्थिति को पहचानें। जो कुछ आपके पास है, उसे परमात्मा का प्रसाद मानकर त्यागभाव से उपयोग करें। किसी के धन या साधनों का लोभ न करें; यही आत्मिक शांति का मूल है।',

  keyWords: [
    {
      pada: 'ईशा वास्यम् (Īśā vāsyam)',
      iast: 'īśā vāsyam',
      root: 'ईश् + वास् (ईश्वर से व्याप्त/आच्छादित)',
      functionalMeaning: 'To be enveloped, indwelt, or clothed by the Supreme Consciousness.',
      functionalMeaningHi: 'ईश्वर के द्वारा व्याप्त या आच्छादित होना।',
    },
    {
      pada: 'जगत्यां जगत् (Jagatyāṃ jagat)',
      iast: 'jagatyāṃ jagat',
      root: 'गम् (चलना / गतिशील संसार)',
      functionalMeaning: 'Whatever is moving or changing in this constantly moving cosmos.',
      functionalMeaningHi: 'इस परिवर्तनशील और गतिशील ब्रह्मांड में जो कुछ भी है।',
    },
    {
      pada: 'त्यक्तेन भुञ्जीथाः (Tyaktena bhuñjīthāḥ)',
      iast: 'tyaktena bhuñjīthāḥ',
      root: 'त्यज् + भुज् (त्याग से उपभोग करना/रक्षा करना)',
      functionalMeaning: 'Enjoy through renunciation of selfish possessiveness; protect as a sacred trust.',
      functionalMeaningHi: 'आसक्ति के त्याग से आनंद पाना; धरोहर मानकर रक्षा करना।',
    },
    {
      pada: 'मा गृधः (Mā gṛdhaḥ)',
      iast: 'mā gṛdhaḥ',
      root: 'मा + गृध् (लोभ न करना)',
      functionalMeaning: 'Do not covet or grasp greedily at the possessions of anyone.',
      functionalMeaningHi: 'किसी के भी धन या संपत्ति का लोभ मत करो।',
    },
  ],

  whyItMattersToday: [
    {
      title: 'Mindful Consumption & Ecological Harmony',
      titleHi: 'पर्यावरण और संयमित उपभोग',
      text: 'Viewing nature as an exploitable resource destroys habitats. Seeing the divine in all creation fosters conservation, restraint, and sacred stewardship.',
    },
    {
      title: 'Freedom from Consumerism & Envy',
      titleHi: 'उपभोक्तावाद और ईर्ष्या से मुक्ति',
      text: 'Modern culture trains us to constantly covet what peers display on social feeds. Living with tyakta (renunciation of covetousness) brings contentment.',
    },
    {
      title: 'Seeing Sacred Unity in Diversity',
      titleHi: 'सर्वत्र दिव्यता का दर्शन',
      text: 'When we see the divine spark in every being, prejudice, malice, and cruelty dissolve naturally into empathy.',
    },
  ],

  modernExample: {
    context: 'Stewardship of Wealth, Technology, and Resources',
    contextHi: 'संसाधनों और तकनीकी सुविधाओं का विवेकपूर्ण उपयोग',
    scenarioEn:
      'Think of managing an environmental reserve or working as a trustee of a historic library. You do not treat the books or forest as your private property to pillage; you use them with care, enjoy their beauty, and preserve them for generations to come. Living in the world with this trustee mindset is the essence of Tyaktena Bhuñjīthāḥ.',
    scenarioHi:
      'जैसे कोई ट्रस्टी किसी पुस्तकालय या उद्यान की देखरेख करता है — वह उसका आनंद लेता है, पर उस पर व्यक्तिगत स्वामित्व का दावा नहीं करता। संसार की वस्तुओं को भी धरोहर मानकर उपयोग करना ही त्यागपूर्वक उपभोग है।',
    disclaimer: 'समसामयिक संपादकीय उदाहरण · प्राचीन शास्त्र का मूल भाग नहीं (Editorial Modern Illustration · Not Scripture)',
  },

  whatItDoesNotMean: [
    {
      title: 'It does NOT mean: "Fleeing into the forest or starvation"',
      titleHi: 'यह संसार छोड़कर भागने या भूखे रहने की बात नहीं है',
      text: 'The verse explicitly says bhuñjīthāḥ (enjoy / protect). It advocates ethical, joyful enjoyment free from toxic possessiveness.',
    },
    {
      title: 'It does NOT mean: "Condemning wealth"',
      titleHi: 'यह धन या समृद्धि का विरोध नहीं है',
      text: 'It condemns greed (gṛdhaḥ), corruption, and theft, encouraging ethical creation and mindful stewardship of wealth.',
    },
  ],

  tryThisToday: {
    title: 'The Gratitude Trust Exercise',
    titleHi: 'कृतज्ञता और धरोहर का भाव',
    instructionEn:
      'Look at three things in your living space or desk today (your computer, water glass, or a plant). Acknowledge that you did not create them from scratch; view them as sacred trusts to be treated with quiet reverence and gratitude.',
    instructionHi:
      'आज अपने आस-पास की किन्हीं 3 वस्तुओं को देखें और यह महसूस करें कि वे प्रकृति और समाज का उपहार हैं। उनके प्रति कृतज्ञता व्यक्त करें।',
    duration: '< 5 minutes',
  },

  reflectionQuestion: {
    en: 'If you viewed everything you currently possess as a sacred trust on loan rather than your exclusive property, how would your daily stress change?',
    hi: 'यदि आप अपनी हर वस्तु को अपना निजी दावा मानने के बजाय एक पवित्र धरोहर मानें, तो आपके तनाव में क्या अंतर आएगा?',
  },

  traditionalCommentary: {
    shankara: {
      author: 'आदि शंकराचार्य (Adi Shankaracharya)',
      tradition: 'अद्वैत वेदान्त (Advaita Vedanta)',
      work: 'ईशावास्योपनिषद्भाष्य (Isha Bhashya Mantra 1)',
      summaryEn:
        'All pluralistic worldly perceptions must be covered with the single vision of the Supreme Brahman. When everything is known as the Self, whom can one covet? There is no other.',
      summaryHi:
        'जगत के समस्त मिथ्या द्वैत को परम ब्रह्म के एकत्व भाव से आच्छादित कर देना चाहिए। जब सर्वत्र आत्मा ही है, तो किसका धन और कैसा लोभ?',
    },
    ramanuja: {
      author: 'रामानुजाचार्य (Ramanujacharya)',
      tradition: 'विशिष्टाद्वैत वेदान्त (Vishishtadvaita Vedanta)',
      work: 'उपनिषद् व्याख्यान',
      summaryEn:
        'All conscious souls and insentient nature form the body of the Supreme Lord, who dwells within all as the indwelling ruler (Antaryāmin).',
      summaryHi:
        'समस्त जड़-चेतन जगत परमात्मा का शरीर है और ईश्वर सबके अंतर्यामी शासक हैं।',
    },
    sridhara: {
      author: 'पारंपरिक आचार्य परंपरा',
      tradition: 'वेदान्त दर्शन',
      work: 'वैदिक भाष्य परंपरा',
      summaryEn:
        'The opening mantra sets the supreme ethical and metaphysical foundation of the Upanishadic worldview: unity of life and renunciation of greed.',
      summaryHi:
        'यह मंत्र वैदिक दर्शन का सर्वोच्च सूत्र है — जीवन की एकता और लोभ का त्याग।',
    },
  },

  sourceTransparency: {
    scripture: 'ईशावास्योपनिषद् (Isha Upanishad)',
    reference: 'मंत्र 1 (Mantra 1)',
    epicContext: 'शुक्ल यजुर्वेद, माध्यन्दिन संहिता, अध्याय 40 (Shukla Yajurveda 40.1)',
    sanskritEdition: 'चौखम्बा विद्याभवन / अद्वैत आश्रम / आदि शंकराचार्य भाष्य संस्करण',
    meter: 'अनुष्टुप् छन्द (Anuṣṭubh — 8 syllables × 4 quarters)',
    epistemicTier: 'मूल श्रुति पाठ (Canonical Shruti Scripture)',
    editorialNote:
      'Modern psychological reflections are contemporary educational aids, strictly distinct from ancient revealed text.',
  },
};

const PEDAGOGICAL_REGISTRY: Record<string, PedagogicalVerseData> = {
  'bhagavadgita:2:11': GITA_2_11_PEDAGOGICAL,
  'bhagavadgita:2:13': GITA_2_13_PEDAGOGICAL,
  'bhagavadgita:2:14': GITA_2_14_PEDAGOGICAL,
  'bhagavadgita:2:20': GITA_2_20_PEDAGOGICAL,
  'bhagavadgita:2:22': GITA_2_22_PEDAGOGICAL,
  'bhagavadgita:2:47': GITA_2_47_PEDAGOGICAL,
  'bhagavadgita:2:48': GITA_2_48_PEDAGOGICAL,
  'bhagavadgita:2:55': GITA_2_55_PEDAGOGICAL,
  'bhagavadgita:2:56': GITA_2_56_PEDAGOGICAL,
  'bhagavadgita:2:62': GITA_2_62_PEDAGOGICAL,
  'bhagavadgita:2:63': GITA_2_63_PEDAGOGICAL,
  'bhagavadgita:3:9': GITA_3_9_PEDAGOGICAL,
  'bhagavadgita:3:21': GITA_3_21_PEDAGOGICAL,
  'bhagavadgita:3:30': GITA_3_30_PEDAGOGICAL,
  'bhagavadgita:3:35': GITA_3_35_PEDAGOGICAL,
  'bhagavadgita:3:42': GITA_3_42_PEDAGOGICAL,
  'ishavasya:1:1': ISHA_1_PEDAGOGICAL,
  'ishavasya:1:2': ISHA_2_PEDAGOGICAL,
  'ishavasya:1:4': ISHA_4_PEDAGOGICAL,
  'ishavasya:1:6': ISHA_6_PEDAGOGICAL,
  'ishavasya:1:7': ISHA_7_PEDAGOGICAL,
};

export {
  GITA_3_9_PEDAGOGICAL,
  GITA_3_21_PEDAGOGICAL,
  GITA_3_30_PEDAGOGICAL,
  GITA_3_35_PEDAGOGICAL,
  GITA_3_42_PEDAGOGICAL,
  ISHA_2_PEDAGOGICAL,
  ISHA_4_PEDAGOGICAL,
  ISHA_6_PEDAGOGICAL,
  ISHA_7_PEDAGOGICAL,
};

export function getPedagogicalVerse(
  scriptureId: string,
  chapterId: number | string,
  verseId: number | string,
): PedagogicalVerseData | null {
  const key = `${scriptureId}:${chapterId}:${verseId}`;
  return PEDAGOGICAL_REGISTRY[key] ?? null;
}
