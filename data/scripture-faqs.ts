/**
 * Scripture & Tradition FAQs Database
 * Sourced, neutral, non-dogmatic explanations across four core domains:
 * 1. Scripture & Canon (श्रुति एवं स्मृति)
 * 2. Ethics & Practical Life (नीति एवं कर्म)
 * 3. Philosophical Schools (दर्शन परम्परा)
 * 4. Common Misunderstandings & Corrections (भ्रम एवं निवारण)
 */

export interface ScriptureFaqItem {
  id: string;
  category: 'canon' | 'ethics' | 'philosophy' | 'misconceptions';
  questionEn: string;
  questionHi: string;
  answerEn: string;
  answerHi: string;
  canonicalReferences?: string[];
  /** Set only when a named person has reviewed this answer. */
  reviewer?: string;
  /** ISO date, YYYY-MM-DD, of that review. */
  lastReviewed?: string;
}

export const SCRIPTURE_FAQS: ScriptureFaqItem[] = [
  {
    id: 'shruti-smriti-diff',
    category: 'canon',
    questionEn: 'What is the distinction between Shruti and Smriti?',
    questionHi: 'श्रुति और स्मृति में क्या भेद है?',
    answerEn: 'Shruti ("that which is heard") refers to the primary, eternal revelation encompassing the four Vedas and the Upanishads. It is considered authorless (Apaurusheya) and inviolable. Smriti ("that which is remembered") denotes secondary texts composed by realized sages—including the Bhagavad Gita, the Epics (Ramayana, Mahabharata), Dharmashastras, and Puranas—which apply eternal principles to specific historical, societal contexts. If a conflict arises between the two, Shruti holds ultimate epistemological authority.',
    answerHi: 'श्रुति ("जो सुना गया") का अर्थ है वेदों और उपनिषदों की मूल संहिता, जिसे अपौरुषेय और शाश्वत माना जाता है। स्मृति ("जो स्मरण रखा गया") महर्षियों द्वारा रचित ग्रंथ हैं, जैसे भगवद्गीता, रामायण, महाभारत और पुराण। यदि दोनों में कोई विरोधाभास प्रतीत हो, तो श्रुति को ही सर्वोपरि प्रमाण माना जाता है।',
    canonicalReferences: ['मनुस्मृति 2.10', 'मीमांसा सूत्र 1.3.3'],
  },
  {
    id: 'vedic-oral-transmission',
    category: 'canon',
    questionEn: 'How were the Vedas preserved with phonetic precision for thousands of years without writing?',
    questionHi: 'हजारों वर्षों तक बिना लिखे वेदों को शुद्ध रूप में कैसे सुरक्षित रखा गया?',
    answerEn: 'The Vedic corpus was preserved through an extraordinarily sophisticated mnemonic oral system comprising eight modification recitation styles (Ashtavikriti): Samhita-patha (continuous text), Pada-patha (separated words), Krama (stepwise pairs), Jata (braided), and Ghana (complex multi-directional permutation). These mathematical phonetic safeguards prevented a single vowel, pitch accent (svara), or syllable from being lost or altered across millennia.',
    answerHi: 'वैदिक ज्ञान को अष्टविकृति पाठ (संहिता, पद, क्रम, जटा, माला, शिखा, रेखा, घन) की अत्यंत जटिल गणितीय और ध्वन्यात्मक पद्धति द्वारा कंठस्थ रखा गया। इस व्यवस्था के कारण सदियों तक एक भी मात्रा, स्वर (उदात्त, अनुदात्त, स्वरित) या अक्षर में विकार नहीं आ सका।',
    canonicalReferences: ['ऋग्वेद प्रातिशाख्य', 'शौनकीय शिक्षा'],
  },
  {
    id: 'karma-fatalism-distinction',
    category: 'ethics',
    questionEn: 'Does the law of Karma mean everything is pre-determined fatalism?',
    questionHi: 'क्या कर्म सिद्धांत का अर्थ भाग्यवादी होकर बैठ जाना है?',
    answerEn: 'No. Fatalism (Niyativada) denies personal agency, whereas Karma insists upon absolute responsibility for current choices. Classical thinkers divide karma into three aspects: Sanchita (accumulated reservoir of past actions), Prarabdha (that portion currently bearing fruit as present circumstances), and Kriyamana / Agami (the dynamic sovereign choices being made right now). You cannot change the cards you were dealt (Prarabdha), but how you play those cards today (Kriyamana) is entirely within your free agency.',
    answerHi: 'कदापि नहीं। कर्म सिद्धांत भाग्य का नहीं, बल्कि वर्तमान पुरुषार्थ और उत्तरदायित्व का विज्ञान है। संचित कर्म भूतकाल का संचय है, प्रारब्ध वर्तमान की परिस्थितियां हैं, पर क्रियमाण कर्म वह वर्तमान चयन है जो पूर्णतः आपके हाथ में है। परिस्थितियां प्रारब्ध तय करता है, पर आचरण मनुष्य का अपना संकल्प तय करता है।',
    canonicalReferences: ['भगवद्गीता 2.47', 'योगवासिष्ठ 2.5.10 (दैवं न विद्यते)'],
  },
  {
    id: 'svadharma-meaning',
    category: 'ethics',
    questionEn: 'What does "Svadharma" actually mean in practical life?',
    questionHi: 'व्यावहारिक जीवन में "स्वधर्म" का वास्तविक अर्थ क्या है?',
    answerEn: 'Svadharma is not a rigid socio-economic caste straightjacket; it is your authentic duty aligned with your inherent natural temperament (Svabhava), inner capacities, and life stage. In Gita 3.35 and 18.47, Krishna warns against imitating the life or calling of another, because authentic growth only occurs when you act in harmony with your constitutional nature and sincere obligations.',
    answerHi: 'स्वधर्म कोई संकीर्ण व्यवस्था नहीं, बल्कि व्यक्ति के स्वाभाविक स्वभाव (स्वभाव), अंतर्निहित गुणों और वर्तमान उत्तरदायित्व के अनुरूप कर्तव्य है। दूसरों की नकल करने के बजाय अपने स्वभाव के अनुकूल निष्ठा से कार्य करना ही स्वधर्म है।',
    canonicalReferences: ['भगवद्गीता 3.35', 'भगवद्गीता 18.47'],
  },
  {
    id: 'darshanas-overview',
    category: 'philosophy',
    questionEn: 'What are the Shad-Darshanas (Six Orthodox Schools of Indian Philosophy)?',
    questionHi: 'षड्-दर्शन (छह आस्तिक दर्शन) क्या हैं?',
    answerEn: 'The six classical schools that accept the authority of the Vedas are: (1) Nyaya (rigorous logic and epistemology, founded by Gautama), (2) Vaisheshika (atomism and metaphysics of reality, founded by Kanada), (3) Samkhya (dualistic analysis of consciousness / Purusha and nature / Prakriti, founded by Kapila), (4) Yoga (experiential psychological integration, founded by Patanjali), (5) Purva Mimamsa (hermeneutics of Vedic ethics and action, founded by Jaimini), and (6) Uttara Mimamsa or Vedanta (inquiry into ultimate reality / Brahman, founded by Badarayana).',
    answerHi: 'छह आस्तिक दर्शन हैं: (1) न्याय (तर्क व प्रमाण विद्या), (2) वैशेषिक (पदार्थ व परमाणु विज्ञान), (3) सांख्य (प्रकृति और पुरुष का विवेक), (4) योग (चित्तवृत्ति निरोध व समाधि), (5) पूर्व मीमांसा (कर्म व धर्म मीमांसा), और (6) उत्तर मीमांसा / वेदांत (ब्रह्म ज्ञान)।',
    canonicalReferences: ['न्याय सूत्र', 'सांख्यकारिका', 'ब्रह्म सूत्र'],
  },
  {
    id: 'vedanta-schools-contrast',
    category: 'philosophy',
    questionEn: 'How do the main schools of Vedanta (Advaita, Vishishtadvaita, Dvaita) differ?',
    questionHi: 'अद्वैत, विशिष्टाद्वैत और द्वैत वेदांत में मुख्य भेद क्या है?',
    answerEn: 'All three revere the Upanishads, Bhagavad Gita, and Brahma Sutras, but differ on the relationship between the individual soul (Jiva), the cosmos (Jagat), and God (Brahman). Advaita (Adi Shankara) holds radical non-duality: the Jiva and Brahman are essentially identical; apparent multiplicity is due to Maya. Vishishtadvaita (Ramanuja) holds qualified non-duality: souls and the cosmos are real organic attributes/body of Brahman, united in devoted loving communion. Dvaita (Madhva) holds rigorous dualism: God, souls, and matter are fundamentally and eternally distinct realities.',
    answerHi: 'अद्वैत वेदांत (आदि शंकराचार्य) के अनुसार जीव और ब्रह्म तत्त्वतः एक हैं (अहं ब्रह्मास्मि)। विशिष्टाद्वैत (रामानुजाचार्य) के अनुसार जीव और प्रकृति ब्रह्म के अभिन्न शरीर व विशेषण हैं। द्वैत वेदांत (मध्वाचार्य) के अनुसार ईश्वर, जीव और संसार सदा के लिए एक-दूसरे से भिन्न और सत्य सत्ताएं हैं।',
    canonicalReferences: ['माण्डूक्य कारिका', 'श्रीभाष्य', 'अनुव्याख्यान'],
  },
  {
    id: 'polytheism-misconception',
    category: 'misconceptions',
    questionEn: 'Is Sanatana Dharma polytheistic, monotheistic, or pantheistic?',
    questionHi: 'क्या सनातन धर्म बहु-ईश्वरवादी है या एकेश्वरवादी?',
    answerEn: 'Rigveda 1.164.46 states: "Ekam Sad Vipra Bahudha Vadanti" (Truth is One; sages call It by many names). Classical Sanatana thought is best understood as Panentheistic Monism: Ultimate Reality (Brahman) is one infinite, formless, unconditioned Consciousness that simultaneously pervades and transcends all phenomena. The diverse forms (Devalokas, Ishta-devatas) are valid, accessible manifestations through which finite human minds commune with the one transcendent Divine.',
    answerHi: 'ऋग्वेद (1.164.46) का उद्घोष है: "एकं सद् विप्रा बहुधा वदन्ति" — सत्य एक ही है, ज्ञानी उसे भिन्न-भिन्न नामों से पुकारते हैं। सनातन दर्शन परब्रह्म को एक और अनंत मानता है, और विभिन्न देवी-देवता उसी एक परमात्मा के विविध दिव्य स्वरूप और अभिव्यक्तियाँ हैं।',
    canonicalReferences: ['ऋग्वेद 1.164.46', 'श्वेताश्वतरोपनिषद् 6.11'],
  },
  {
    id: 'renunciation-misconception',
    category: 'misconceptions',
    questionEn: 'Does spiritual liberation (Moksha) require abandoning family, career, and society?',
    questionHi: 'क्या मोक्ष के लिए परिवार, समाज और कर्म छोड़ना अनिवार्य है?',
    answerEn: 'No. The Bhagavad Gita explicitly elevates Karma Yoga—remaining active in societal duties while relinquishing egoic claim over fruits—above external physical renunciation. Figures like King Janaka in the Upanishads attained the highest liberation while governing a kingdom. True renunciation (Tyaga) is the internal dissolution of selfishness, greed, and anxiety, not physical escapism from duty.',
    answerHi: 'कदापि नहीं। गीता स्पष्ट रूप से कर्म-संन्यास (सब कुछ छोड़ देना) की तुलना में कर्मयोग (कर्तव्य करते हुए आसक्ति छोड़ना) को श्रेष्ठ बताती है। राजा जनक ने राज्य चलाते हुए भी आत्म-ज्ञान प्राप्त किया। सच्चा संन्यास मन के अहंकार और लोभ का त्याग है, कर्तव्यों से पलायन नहीं।',
    canonicalReferences: ['भगवद्गीता 5.2', 'भगवद्गीता 18.2'],
  }
];
