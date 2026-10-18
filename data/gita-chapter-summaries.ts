/**
 * Short chapter summaries of the Bhagavad Gita (गीता सार), in Hindi and English.
 *
 * Editorial text, not scripture: a plain retelling of what each chapter
 * covers, consistent with the reviewed orientations in
 * data/chapter-orientation.ts. Shown on /scripture/bhagavadgita/summary/ and
 * at the top of each Gita chapter. `review` follows the same states as the
 * chapter orientations; set it to 'approved' (with reviewer and date) once a
 * reviewer has read the entry against the text.
 */

import type { ReviewState } from './chapter-orientation';

export interface GitaChapterSummary {
  chapter: number;
  summaryHi: string;
  summaryEn: string;
  review: ReviewState;
  reviewer?: string;
  reviewDate?: string;
}

export const gitaChapterSummaries: GitaChapterSummary[] = [
  {
    chapter: 1,
    summaryHi:
      'कुरुक्षेत्र में धृतराष्ट्र संजय से युद्धभूमि का हाल पूछते हैं। दोनों सेनाएँ आमने-सामने हैं और शंखनाद होता है। अर्जुन श्रीकृष्ण से रथ को दोनों सेनाओं के बीच ले चलने को कहते हैं। सामने अपने गुरु, पितामह, भाई और संबंधियों को देखकर वे शोक और करुणा से भर जाते हैं। कुल-नाश और धर्म-नाश के तर्क देते हुए वे युद्ध न करने का निश्चय करते हैं और धनुष रखकर रथ में बैठ जाते हैं।',
    summaryEn:
      'On the field of Kurukshetra, Dhritarashtra asks Sanjaya what is happening. The two armies face each other and the conches sound. Arjuna asks Krishna to place the chariot between the armies, sees his teachers, elders and kinsmen ready to fight, and is overcome by grief. Arguing that killing his own family would destroy dharma, he refuses to fight and sets down his bow.',
    review: 'draft',
  },
  {
    chapter: 2,
    summaryHi:
      'शोक में डूबे अर्जुन श्रीकृष्ण के शिष्य बनकर मार्गदर्शन माँगते हैं। श्रीकृष्ण बताते हैं कि आत्मा न जन्म लेती है, न मरती है; शरीर बदलते हैं, आत्मा नहीं। वे क्षत्रिय-धर्म की याद दिलाते हैं और कर्मयोग का सूत्र देते हैं: तुम्हारा अधिकार केवल कर्म पर है, फल पर नहीं। अध्याय के अंत में स्थितप्रज्ञ, अर्थात् स्थिर बुद्धि वाले व्यक्ति के लक्षण बताए गए हैं। यह अध्याय पूरी गीता का सार माना जाता है।',
    summaryEn:
      'Overwhelmed by grief, Arjuna asks Krishna to teach him as a disciple. Krishna explains that the Self is never born and never dies; bodies change, the Self does not. He reminds Arjuna of his duty as a warrior and gives the core of karma yoga: you have a right to your action, never to its fruits. The chapter ends with the marks of the sthitaprajna, the person of steady wisdom. It is often called the Gita in brief.',
    review: 'draft',
  },
  {
    chapter: 3,
    summaryHi:
      'अर्जुन पूछते हैं कि यदि ज्ञान श्रेष्ठ है तो उन्हें कर्म में क्यों लगाया जा रहा है। श्रीकृष्ण समझाते हैं कि कोई भी क्षण भर बिना कर्म के नहीं रह सकता, इसलिए कर्म छोड़ना नहीं, आसक्ति छोड़नी है। यज्ञ-भाव से किया गया कर्म बाँधता नहीं। श्रेष्ठ लोग जैसा आचरण करते हैं, दूसरे उसी का अनुसरण करते हैं, इसलिए लोक-कल्याण के लिए कर्म करना चाहिए। अंत में काम और क्रोध को मनुष्य का सबसे बड़ा शत्रु बताया गया है।',
    summaryEn:
      'Arjuna asks why he is urged to act if knowledge is higher. Krishna explains that no one can stay without action even for a moment, so what must be given up is attachment, not action. Work done as an offering (yajna) does not bind. Others follow what the best people do, so one should act for the welfare of the world. The chapter closes by naming desire and anger as the great enemy within.',
    review: 'draft',
  },
  {
    chapter: 4,
    summaryHi:
      'श्रीकृष्ण बताते हैं कि यह योग प्राचीन काल से गुरु-परंपरा में चला आ रहा है। वे कहते हैं कि जब-जब धर्म की हानि होती है, तब-तब वे धर्म की स्थापना के लिए प्रकट होते हैं। कर्म में अकर्म और अकर्म में कर्म देखने वाला ही ज्ञानी है। अनेक प्रकार के यज्ञों का वर्णन करके वे ज्ञान-यज्ञ को श्रेष्ठ बताते हैं, और कहते हैं कि यह ज्ञान विनम्रता, प्रश्न और सेवा के साथ गुरु से सीखना चाहिए।',
    summaryEn:
      'Krishna reveals that this yoga has come down through a lineage of teachers since ancient times, and that whenever dharma declines he appears to restore it. The wise see inaction in action and action in inaction. Describing many kinds of sacrifice, he calls the sacrifice of knowledge the highest, and says this knowledge is to be learned from a teacher through humility, questions and service.',
    review: 'draft',
  },
  {
    chapter: 5,
    summaryHi:
      'अर्जुन फिर पूछते हैं कि संन्यास और कर्मयोग में कौन श्रेष्ठ है। श्रीकृष्ण कहते हैं कि दोनों मुक्ति की ओर ले जाते हैं, पर कर्मयोग अधिक सरल और श्रेष्ठ है। जो फल ब्रह्म को अर्पित करके कर्म करता है, वह पाप से वैसे ही अछूता रहता है जैसे कमल का पत्ता जल से। ज्ञानी व्यक्ति सबको समान दृष्टि से देखता है और भीतर की शांति में स्थित रहता है।',
    summaryEn:
      'Arjuna asks again which is better, renunciation or the path of action. Krishna says both lead to freedom, but karma yoga is easier and better. One who acts while offering the results to Brahman stays untouched by sin, like a lotus leaf by water. The wise look on all beings with an equal eye and rest in the peace within.',
    review: 'draft',
  },
  {
    chapter: 6,
    summaryHi:
      'इस अध्याय में ध्यान की विधि बताई गई है: एकांत, स्थिर आसन, संयमित भोजन और नींद, और मन को आत्मा में टिकाना। श्रीकृष्ण कहते हैं कि मनुष्य स्वयं अपना मित्र है और स्वयं अपना शत्रु, इसलिए अपने द्वारा अपना उद्धार करे। अर्जुन कहते हैं कि मन बहुत चंचल है; श्रीकृष्ण उत्तर देते हैं कि अभ्यास और वैराग्य से वह वश में आता है। योग के मार्ग पर किया गया प्रयास कभी व्यर्थ नहीं जाता।',
    summaryEn:
      'This chapter teaches the practice of meditation: a quiet place, a steady seat, moderation in food and sleep, and a mind settled in the Self. Krishna says a person is their own friend and their own enemy, so one should lift oneself by oneself. When Arjuna says the mind is restless, Krishna answers that it is mastered by practice and detachment. No effort made on the path of yoga is ever lost.',
    review: 'draft',
  },
  {
    chapter: 7,
    summaryHi:
      'श्रीकृष्ण अपनी दो प्रकृतियों का वर्णन करते हैं: जड़ प्रकृति (पृथ्वी, जल, अग्नि आदि) और चेतन प्रकृति, जो जीवों का आधार है। सारा जगत उनमें वैसे ही पिरोया है जैसे धागे में मणियाँ। उनकी त्रिगुणमयी माया को पार करना कठिन है, पर जो उनकी शरण लेता है वह पार हो जाता है। चार प्रकार के भक्तों का वर्णन है, जिनमें ज्ञानी भक्त उन्हें सबसे प्रिय है।',
    summaryEn:
      'Krishna describes his two natures: the material nature (earth, water, fire and the rest) and the higher, conscious nature that sustains all beings. The whole world is strung on him like pearls on a thread. His maya, made of the three gunas, is hard to cross, but those who take refuge in him cross it. He names four kinds of devotees, of whom the one who knows is dearest to him.',
    review: 'draft',
  },
  {
    chapter: 8,
    summaryHi:
      'अर्जुन ब्रह्म, अध्यात्म, कर्म, अधिभूत, अधिदैव, अधियज्ञ और मृत्यु के समय ईश्वर के स्मरण के बारे में प्रश्न पूछते हैं। श्रीकृष्ण बताते हैं कि अंतकाल में मनुष्य जिस भाव का स्मरण करता है, उसी को प्राप्त होता है, इसलिए हर समय उनका स्मरण करते हुए कर्म करना चाहिए। ॐ के जप और ध्यान का महत्व बताया गया है, और प्रकाश तथा अंधकार के दो मार्गों का वर्णन है।',
    summaryEn:
      'Arjuna asks about Brahman, the Self, action, the material and divine realms, sacrifice, and how God is remembered at the time of death. Krishna explains that whatever one remembers at the end, one attains; so one should remember him at all times while doing one’s work. The chapter speaks of meditation on Om and describes the two paths of light and darkness after death.',
    review: 'draft',
  },
  {
    chapter: 9,
    summaryHi:
      'श्रीकृष्ण इसे राजविद्या और सबसे गोपनीय ज्ञान कहते हैं। सारा जगत उनमें स्थित है, फिर भी वे उससे बँधे नहीं। जो अनन्य भाव से उनका चिंतन करते हैं, उनके योगक्षेम का भार वे स्वयं उठाते हैं। प्रेम से अर्पित एक पत्ता, फूल, फल या जल भी वे स्वीकार करते हैं। भक्ति का मार्ग हर किसी के लिए खुला है, चाहे उसका जन्म या अतीत कुछ भी हो।',
    summaryEn:
      'Krishna calls this the royal knowledge and the deepest secret. The whole world rests in him, yet he is not bound by it. For those who think of him with undivided devotion, he himself provides what they lack and protects what they have. He accepts even a leaf, a flower, a fruit or a little water offered with love. The path of devotion is open to everyone, whatever their birth or past.',
    review: 'draft',
  },
  {
    chapter: 10,
    summaryHi:
      'श्रीकृष्ण बताते हैं कि वे ही सबके मूल हैं और सब कुछ उन्हीं से उत्पन्न होता है। अर्जुन के अनुरोध पर वे अपनी विभूतियों का वर्णन करते हैं: देवताओं में इंद्र, नदियों में गंगा, पर्वतों में हिमालय, अक्षरों में अकार। अंत में वे कहते हैं कि जो भी ऐश्वर्यपूर्ण, सुंदर या शक्तिशाली है, वह उनके तेज के एक अंश से ही उत्पन्न हुआ है।',
    summaryEn:
      'Krishna explains that he is the source of everything and that all things arise from him. At Arjuna’s request he describes his glories: among gods he is Indra, among rivers the Ganga, among mountains the Himalaya, among letters the sound "a". He ends by saying that whatever is glorious, beautiful or powerful springs from a single spark of his splendour.',
    review: 'draft',
  },
  {
    chapter: 11,
    summaryHi:
      'अर्जुन श्रीकृष्ण का विश्वरूप देखने की इच्छा प्रकट करते हैं। श्रीकृष्ण उन्हें दिव्य दृष्टि देते हैं और अपना विराट रूप दिखाते हैं, जिसमें संपूर्ण सृष्टि, अनगिनत मुख और भुजाएँ, और युद्ध के सभी योद्धा काल के मुख में जाते दिखते हैं। श्रीकृष्ण कहते हैं, "मैं लोकों का नाश करने वाला काल हूँ।" भयभीत अर्जुन स्तुति करते हैं और श्रीकृष्ण फिर अपना सौम्य रूप धारण करते हैं।',
    summaryEn:
      'Arjuna asks to see Krishna’s universal form. Krishna gives him divine sight and shows the cosmic form, holding all of creation, countless faces and arms, with the warriors of both armies rushing into the mouths of Time. "I am Time, the destroyer of worlds," Krishna says. Shaken, Arjuna praises him and asks forgiveness, and Krishna returns to his gentle human form.',
    review: 'draft',
  },
  {
    chapter: 12,
    summaryHi:
      'अर्जुन पूछते हैं कि साकार भगवान की भक्ति करने वाले और निराकार अक्षर ब्रह्म की उपासना करने वालों में कौन श्रेष्ठ है। श्रीकृष्ण कहते हैं कि दोनों उन्हें प्राप्त करते हैं, पर साकार भक्ति अधिक सरल है। जो जितना कर सके उसके लिए वे क्रम से मार्ग बताते हैं। अंत में प्रिय भक्त के गुण बताए गए हैं: द्वेष-रहित, करुणामय, क्षमाशील, सुख-दुःख में सम और संतुष्ट।',
    summaryEn:
      'Arjuna asks who is better: those who worship God with form, or those who meditate on the formless imperishable. Krishna says both reach him, but devotion to the personal form is easier. He gives a graded set of practices for whatever one is able to do. The chapter ends with the qualities of the devotee dear to him: free of hatred, compassionate, forgiving, even in joy and sorrow, and content.',
    review: 'draft',
  },
  {
    chapter: 13,
    summaryHi:
      'श्रीकृष्ण शरीर को क्षेत्र (खेत) और उसे जानने वाले को क्षेत्रज्ञ कहते हैं, और बताते हैं कि सभी क्षेत्रों में क्षेत्रज्ञ वे ही हैं। वे ज्ञान के लक्षण गिनाते हैं, जैसे विनम्रता, अहिंसा, धैर्य और आत्म-संयम। प्रकृति और पुरुष का भेद समझाया गया है: कर्म प्रकृति करती है, जबकि आत्मा साक्षी है। जो यह भेद जान लेता है, वह मुक्त हो जाता है।',
    summaryEn:
      'Krishna calls the body the field (kshetra) and the one who knows it the knower of the field (kshetrajna), and says he is the knower in every field. He lists the qualities that make up true knowledge, such as humility, non-violence, patience and self-control. The chapter explains the difference between prakriti and purusha: nature does the acting, the Self is the witness. Whoever knows this difference is freed.',
    review: 'draft',
  },
  {
    chapter: 14,
    summaryHi:
      'श्रीकृष्ण प्रकृति के तीन गुणों का वर्णन करते हैं: सत्त्व, रज और तम। सत्त्व सुख और ज्ञान से, रज आसक्ति और कर्म से, और तम आलस्य और मोह से बाँधता है। हर गुण के लक्षण और परिणाम बताए गए हैं। अंत में अर्जुन के प्रश्न पर वे गुणातीत, यानी तीनों गुणों से परे गए व्यक्ति के लक्षण बताते हैं, जो अटल भक्ति से इस अवस्था को प्राप्त करता है।',
    summaryEn:
      'Krishna describes the three qualities of nature: sattva, rajas and tamas. Sattva binds through happiness and knowledge, rajas through attachment and activity, tamas through laziness and delusion. He gives the signs and results of each. At Arjuna’s question he describes the person who has gone beyond all three gunas, a state reached through unwavering devotion.',
    review: 'draft',
  },
  {
    chapter: 15,
    summaryHi:
      'संसार को एक उलटे अश्वत्थ (पीपल) वृक्ष के रूप में बताया गया है, जिसकी जड़ें ऊपर और शाखाएँ नीचे हैं। इसे वैराग्य के शस्त्र से काटकर उस परम पद को खोजना चाहिए जहाँ से लौटना नहीं होता। श्रीकृष्ण कहते हैं कि जीव उनका ही सनातन अंश है। नश्वर और अविनाशी, दोनों से परे वे पुरुषोत्तम हैं, और जो उन्हें इस रूप में जानता है, वह सब कुछ जान लेता है।',
    summaryEn:
      'The world is pictured as an upside-down ashvattha tree, roots above and branches below. One should cut it with the axe of detachment and seek the state from which there is no return. Krishna says every living being is an eternal part of himself. Beyond both the perishable and the imperishable, he is the Supreme Person (Purushottama), and whoever knows him so knows everything.',
    review: 'draft',
  },
  {
    chapter: 16,
    summaryHi:
      'श्रीकृष्ण दैवी और आसुरी संपदा का भेद बताते हैं। निर्भयता, पवित्रता, दान, संयम, सत्य, अहिंसा और करुणा दैवी गुण हैं, जो मुक्ति की ओर ले जाते हैं। दंभ, घमंड, क्रोध, कठोरता और अज्ञान आसुरी गुण हैं, जो बंधन में डालते हैं। काम, क्रोध और लोभ को नरक के तीन द्वार बताया गया है। अंत में शास्त्र को कर्तव्य-अकर्तव्य का प्रमाण मानने की सीख दी गई है।',
    summaryEn:
      'Krishna contrasts the divine and the demonic nature. Fearlessness, purity, generosity, self-control, truthfulness, non-violence and compassion are divine qualities that lead to freedom. Hypocrisy, arrogance, anger, harshness and ignorance are demonic qualities that bind. Desire, anger and greed are named the three gates to hell. The chapter closes by advising that scripture be the guide to what should and should not be done.',
    review: 'draft',
  },
  {
    chapter: 17,
    summaryHi:
      'अर्जुन पूछते हैं कि जो शास्त्र-विधि छोड़कर पर श्रद्धा से पूजा करते हैं, उनकी स्थिति क्या है। श्रीकृष्ण बताते हैं कि श्रद्धा तीन प्रकार की होती है: सात्त्विक, राजसिक और तामसिक। इसी तरह भोजन, यज्ञ, तप (शरीर, वाणी और मन का) और दान भी तीन प्रकार के होते हैं। अंत में "ॐ तत् सत्" का अर्थ और महत्व बताया गया है।',
    summaryEn:
      'Arjuna asks about those who worship with faith but outside the rules of scripture. Krishna explains that faith is of three kinds: sattvic, rajasic and tamasic. Food, sacrifice, austerity (of body, speech and mind) and charity likewise each take three forms. The chapter ends by explaining the meaning and use of "Om Tat Sat".',
    review: 'draft',
  },
  {
    chapter: 18,
    summaryHi:
      'अंतिम अध्याय पूरी गीता का निचोड़ है। श्रीकृष्ण संन्यास और त्याग का अंतर बताते हैं: कर्म छोड़ना नहीं, कर्मफल की आसक्ति छोड़ना ही सच्चा त्याग है। ज्ञान, कर्म, कर्ता, बुद्धि, धृति और सुख के तीन-तीन प्रकार बताए गए हैं। अपने स्वभाव के अनुसार कर्तव्य (स्वधर्म) करना श्रेष्ठ है। अंत में वे कहते हैं, "सब धर्मों को छोड़कर मेरी शरण में आओ।" अर्जुन का मोह नष्ट हो जाता है और वे युद्ध के लिए तैयार होते हैं।',
    summaryEn:
      'The final chapter draws the whole Gita together. Krishna distinguishes renunciation from relinquishment: true renunciation is giving up attachment to results, not giving up action. Knowledge, action, the doer, intellect, resolve and happiness are each shown in three kinds. Doing one’s own duty according to one’s nature is best. Finally he says, "Give up all duties and take refuge in me alone." Arjuna’s delusion is gone, and he is ready to act.',
    review: 'draft',
  },
];

export function getGitaChapterSummary(chapter: number): GitaChapterSummary | undefined {
  return gitaChapterSummaries.find((s) => s.chapter === chapter);
}
