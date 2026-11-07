const fs = require('fs');
const path = require('path');
const Sanscript = require('@indic-transliteration/sanscript');

// Load SBE translations for chapters 1 to 7
const sbeTranslations = {};
for (let p = 22; p <= 28; p++) {
  const khanda = p - 21;
  const html = fs.readFileSync(`scripts/cache/chandogya-sbe/sbe010${p}.htm`, 'utf8');
  const cleaned = html
    .replace(/<font[\s\S]*?<\/font>/gi, '')
    .replace(/<a[\s\S]*?<\/a>/gi, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#146;/g, "'")
    .replace(/&#145;/g, "'")
    .replace(/&amp;/g, '&');
  
  const vMatches = [...cleaned.matchAll(/<p>\s*(\d+)\.\s*([\s\S]*?)<\/p>/gi)];
  sbeTranslations[khanda] = vMatches.map(m => ({
    number: parseInt(m[1]),
    text: m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  }));
}

// 63 Canonical Sanskrit mantras for Khandas 1 to 7
const KHANDA_1_7_DATA = [
  // Khanda 1 (1.1) - 10 mantras
  {
    khanda: 1,
    title: "Prapathaka 1 · Khanda 1 — Meditation on OM as the Udgitha",
    titleSanskrit: "प्रथम प्रपाठक · प्रथम खण्ड — ओंकारोद्गीथोपासना",
    summary: "The opening of the Chandogya Upanishad: meditation on the sacred syllable OM as the Udgitha — the essence of all essences, from earth to water, plants, person, speech, Rig, Saman, and OM.",
    verses: [
      {
        num: 1,
        sanskrit: "ओमित्येतदक्षरमुद्गीथमुपासीत । ओमिति ह्युद्गायति तस्योपव्याख्यानम् ॥ १ ॥",
        hindi: "ॐ यह अक्षर उद्गीथ है, इसकी उपासना करनी चाहिए। 'ओम्' ऐसा उच्चारण करके ही उद्गाता सामगान प्रारम्भ करता है। अब उसी की व्याख्या की जाती है।",
        explanation: "The Chandogya Upanishad opens with the foundational instruction: meditate on OM as the Udgitha. OM is the sonic symbol of the Absolute (Brahman).",
        keywords: ["Om", "Udgitha", "Meditation", "Brahman"]
      },
      {
        num: 2,
        sanskrit: "एषां भूतानां पृथिवी रसः पृथिव्या आपो रसोऽपामोषधयो रस ओषधीनां पुरुषो रसः पुरुषस्य वाग्रसो वाच ऋग्रस ऋचः साम रसः साम्न उद्गीथो रसः ॥ २ ॥",
        hindi: "इन समस्त प्राणियों का सार (रस) पृथिवी है, पृथिवी का रस जल है, जल का रस ओषधियाँ हैं, ओषधियों का रस पुरुष है, पुरुष का रस वाणी है, वाणी का रस ऋक् है, ऋक् का रस साम है, और साम का रस उद्गीथ (ओंकार) है।",
        explanation: "The hierarchical condensation of cosmic reality: from dense physical elements (earth, water) to organic life (plants, man), to consciousness (speech, poetry), culminating in musical transcendence (Saman) and the sonic Absolute (Udgitha/OM).",
        keywords: ["EssenceOfEssences", "CosmicOrder", "EarthToConsciousness", "Rasa"]
      },
      {
        num: 3,
        sanskrit: "स एष रसानां रसतमः परमः परार्ध्योऽष्टमो यदुद्गीथः ॥ ३ ॥",
        hindi: "वह यह उद्गीथ समस्त रसों में परम रसतम (सर्वोत्तम सार), परात्पर, परमात्मा का प्रतीक होने के योग्य और आठवाँ रस है।",
        explanation: "Udgitha is the eighth and quintessential essence ('rasānāṃ rasatamaḥ'). It represents the supreme pinnacle of all manifest existence.",
        keywords: ["Rasatama", "PinnacleOfBeing", "SupremeEssence"]
      },
      {
        num: 4,
        sanskrit: "कतमा कतमर्क् कतमत् कतमत्साम कतमः कतम उद्गीथ इति विमृष्टं भवति ॥ ४ ॥",
        hindi: "कौन-सी ऋक् है? कौन-सा साम है? कौन-सा उद्गीथ है? — इस प्रकार विचार किया जाता है।",
        explanation: "The philosophical inquiry begins with careful questioning and discrimination into the nature of speech, melody, and divine sound.",
        keywords: ["Inquiry", "Discrimination", "Vimrsta"]
      },
      {
        num: 5,
        sanskrit: "वागेवर्क् प्राणः सामोमित्येतदक्षरमुद्गीथः । तद्वा एतन्मिथुनं यद्वाक् च प्राणश्चर्च साम च ॥ ५ ॥",
        hindi: "वाणी ही ऋक् है, प्राण ही साम है, और 'ॐ' यह अक्षर उद्गीथ है। वाणी और प्राण तथा ऋक् और साम — यह परस्पर संयुक्त युगल (मिथुन) है।",
        explanation: "Speech is the manifest form; breath (Prana) is the living spirit. Their harmonious union produces sacred chant and divine attunement.",
        keywords: ["VakAndPrana", "SacredUnion", "Mithuna", "SpeechAndBreath"]
      },
      {
        num: 6,
        sanskrit: "तदेतन्मिथुनमोमित्येतस्मिन्नक्षरे संसृज्यते यदा वै मिथुनौ समागच्छत आपयतो वै तावअन्योन्यस्य कामम् ॥ ६ ॥",
        hindi: "यह युगल इस 'ॐ' अक्षर में संयुक्त होता है। जब दो परस्पर पूरक तत्त्व मिलते हैं, तो वे एक-दूसरे की कामना को पूर्ण करते हैं।",
        explanation: "In the syllable OM, speech and vital breath unite completely, fulfilling all intrinsic aspirations through non-dual integration.",
        keywords: ["Fulfillment", "NonDualIntegration", "Harmony"]
      },
      {
        num: 7,
        sanskrit: "आपयिता ह वै कामानां भवति य एतदेवं विद्वानक्षरमुद्गीथमुपास्ते ॥ ७ ॥",
        hindi: "जो इस प्रकार जानकर इस 'ॐ' रूप अक्षर उद्गीथ की उपासना करता है, वह समस्त कामनाओं को पूर्ण करने वाला बन जाता है।",
        explanation: "One who realizes this unity becomes fulfilled in desire, for one who is aligned with the source lacks nothing.",
        keywords: ["DesireFulfillment", "Completeness", "InnerAbundance"]
      },
      {
        num: 8,
        sanskrit: "तद्वा एतदनुज्ञाक्षरं यद्धि किञ्चानुजानात्योमित्येव तदाहैषो एव समृद्धिर्यदनुज्ञा समर्धयिता ह वै कामानां भवति य एतदेवं विद्वानक्षरमुद्गीथमुपास्ते ॥ ८ ॥",
        hindi: "यह 'ॐ' अक्षर निश्चय ही अनुमति (सहमति) का वाचक है। जब कोई किसी बात की अनुमति देता है, तो 'ॐ' (हाँ/स्वीकार) ही कहता है। अनुमति ही समृद्धि है। जो ऐसा जानकर उपासना करता है, वह दूसरों की कामनाओं को समृद्ध करता है।",
        explanation: "OM is the ultimate cosmic affirmation — the universal 'Yes' of existence. Total assent to reality is the source of spiritual wealth.",
        keywords: ["Affirmation", "UniversalYes", "Prosperity", "Samriddhi"]
      },
      {
        num: 9,
        sanskrit: "तेनेयं त्रयी विद्या वर्तत ओमित्याश्रावयत्योमिति शंसत्योमित्युद्गायत्येतस्यैवाक्षरस्यापचितये महिम्ना रसेन ॥ ९ ॥",
        hindi: "इसी ओंकार के द्वारा तीनों वेदों की विद्या प्रवृत्त होती है। ओंकार से ही आदेश दिया जाता है, ओंकार से ही स्तुति की जाती है, और ओंकार से ही उद्गान किया जाता है।",
        explanation: "All sacred learning across Rig, Yajur, and Sama Vedas is anchored in and energized by the single vibration OM.",
        keywords: ["ThreeVedas", "SacredVibration", "UniversalKnowledge"]
      },
      {
        num: 10,
        sanskrit: "तेनोभौ कुरुतो यश्चैतदेवं वेद यश्च न वेद । नाना तु विद्या चाविद्या च यदेव विद्यया करोति श्रद्धयोपनिषदा तदेव वीर्यवत्तरं भवतीति खल्वेत्तस्यैवाक्षरस्योपव्याख्यानं भवति ॥ १० ॥",
        hindi: "इस कर्म को दोनों करते हैं — वह भी जो इसे इस प्रकार जानता है, और वह भी जो नहीं जानता। परन्तु विद्या और अविद्या में महान भेद है। जो कर्म विद्या (ज्ञान), श्रद्धा और उपनिषद् (रहस्य-भावना) के साथ किया जाता है, वही अधिक सामर्थ्यवान् (वीर्यवत्तर) होता है।",
        explanation: "One of the most famous verses in Vedic philosophy: Action done with conscious awareness, faith, and philosophical understanding possesses far greater power than mere mechanical routine.",
        keywords: ["KnowledgeVsRoutine", "Shraddha", "Viryavattaram", "ConsciousAction"]
      }
    ]
  },
  // Khanda 2 (1.2) - 14 mantras
  {
    khanda: 2,
    title: "Prapathaka 1 · Khanda 2 — The War of Devas and Asuras & the Invincible Prana",
    titleSanskrit: "प्रथम प्रपाठक · द्वितीय खण्ड — देवासुर-संग्राम एवं मुख्य प्राण",
    summary: "Devas and Asuras contend for mastery. The Asuras pierce nose, speech, eye, ear, and mind with evil; but when they attack the central Prana (Mukhya Prana), they are shattered like a clod of earth against stone.",
    verses: [
      {
        num: 1,
        sanskrit: "देवासुरा ह वै यत्र संयेतिरे उभये प्राजापत्यास्तद्ध देवा उद्गीथमाजह्रुरनेनैनानभिभविष्याम इति ॥ १ ॥",
        hindi: "जब प्रजापति के दोनों पुत्र — देव और असुर — परस्पर युद्ध करने लगे, तब देवताओं ने उद्गीथ (ओंकार) का आश्रय लिया कि 'इसके द्वारा हम असुरों को परास्त करेंगे।' ॥ १ ॥",
        explanation: "The perpetual conflict between luminous impulses (devas) and dark, egotistical drives (asuras) in the human psyche.",
        keywords: ["DevasAndAsuras", "InnerBattle", "LuminousVsDark"]
      },
      {
        num: 2,
        sanskrit: "ते ह नासक्यं प्राणमुद्गीथमुपासाञ्चक्रिरे तं हासुराः पाप्मना विविधुस्तस्मात्तेनोभयं जिघ्रति सुरभि च दुर्गन्धि च पाप्मना ह्येष विद्धः ॥ २ ॥",
        hindi: "देवताओं ने नासिकास्थित प्राण की उद्गीथ रूप में उपासना की; असुरों ने उसे पाप (द्वैत) से बींध दिया। इसीलिये मनुष्य नासिका से सुगन्ध और दुर्गन्ध दोनों सूंघता है। ॥ २ ॥",
        explanation: "The sensory faculties are dualistic — affected by both pleasure and aversion, beauty and revulsion.",
        keywords: ["Duality", "SensoryVulnerability", "NosePrana"]
      },
      {
        num: 3,
        sanskrit: "अथ ह वाचमुद्गीथमुपासाञ्चक्रिरे तां हासुराः पाप्मना विविधुस्तस्मात्तयोभयं वदति सत्यं चानृतं च पाप्मना ह्येष विद्धा ॥ ३ ॥",
        hindi: "फिर उन्होंने वाणी की उपासना की; असुरों ने उसे भी पाप से बींध दिया। इसीलिये वाणी से सत्य और असत्य दोनों बोले जाते हैं। ॥ ३ ॥",
        explanation: "Speech is double-edged: capable of divine truth and deceitful malice.",
        keywords: ["Speech", "TruthAndUntruth", "Vak"]
      },
      {
        num: 4,
        sanskrit: "अथ ह चक्षुरुद्गीथमुपासाञ्चक्रिरे तद्धासुराः पाप्मना विविधुस्तस्मात्तेनोभयं पश्यति दर्शनीयं चादर्शनीयं च पाप्मना ह्येतद्विद्धम् ॥ ४ ॥",
        hindi: "फिर उन्होंने चक्षु की उपासना की; असुरों ने उसे भी पाप से बींध दिया। इसीलिये आँख से दर्शनीय और अदर्शनीय दोनों दिखाई देता है। ॥ ४ ॥",
        explanation: "Visual perception is vulnerable to distortion and craving.",
        keywords: ["Sight", "Eye", "PerceptualVulnerability"]
      },
      {
        num: 5,
        sanskrit: "अथ ह श्रोत्रमुद्गीथमुपासाञ्चक्रिरे तद्धासुराः पाप्मना विविधुस्तस्मात्तेनोभयं शृणोति श्रवणीयं चाश्रवणीयं च पाप्मना ह्येतद्विद्धम् ॥ ५ ॥",
        hindi: "फिर उन्होंने कान की उपासना की; असुरों ने उसे भी पाप से बींध दिया। इसीलिये कान से सुनने योग्य और न सुनने योग्य दोनों सुनाई देता है। ॥ ५ ॥",
        explanation: "Hearing receives both truth and slander, flattery and noise.",
        keywords: ["Hearing", "Ear", "SoundVulnerability"]
      },
      {
        num: 6,
        sanskrit: "अथ ह मन उद्गीथमुपासाञ्चक्रिरे तद्धासुराः पाप्मना विविधुस्तस्मात्तेनोभयं सङ्कल्पयते सङ्कल्पनीयं चासङ्कल्पनीयं च पाप्मना ह्येतद्विद्धम् ॥ ६ ॥",
        hindi: "फिर उन्होंने मन की उपासना की; असुरों ने उसे भी पाप से बींध दिया। इसीलिये मन से शुभ और अशुभ दोनों सङ्कल्प उठते हैं। ॥ ६ ॥",
        explanation: "The mind oscillates between noble resolve and selfish temptation.",
        keywords: ["Mind", "Sankalpa", "MentalOscillation"]
      },
      {
        num: 7,
        sanskrit: "अथ ह य एवायं मुख्यः प्राणस्तमुद्गीथमुपासाञ्चक्रिरे तं हासुरा ऋत्वा विदध्वंसुर्यथाश्मानमाखणमृत्वा विध्वंसेत ॥ ७ ॥",
        hindi: "अन्त में उन्होंने इस मुख्य प्राण की उपासना की। जब असुरों ने उस पर प्रहार किया, तो वे वैसे ही चूर-चूर हो गए जैसे कठोर चट्टान से टकराकर मिट्टी का ढेला टूट जाता है। ॥ ७ ॥",
        explanation: "The fundamental life-force (Mukhya Prana) is non-dual, free from moral corruption, and utterly indestructible.",
        keywords: ["MukhyaPrana", "IndestructibleLife", "Invincibility"]
      },
      {
        num: 8,
        sanskrit: "एवं यथाश्मानमाखणमृत्वा विध्वंसत एवमेव स विध्वंसते य एवंविदि पापं कामयते यश्चैनमभिदासति स एषोऽश्माखणः ॥ ८ ॥",
        hindi: "जैसे पत्थर से टकराकर मिट्टी का ढेला नष्ट हो जाता है, वैसे ही जो ऐसे ज्ञानी का अनिष्ट सोचता है, वह स्वयं नष्ट हो जाता है; क्योंकि ज्ञानी अभेद्य चट्टान के समान है। ॥ ८ ॥",
        explanation: "One rooted in the uncorrupted source is protected by the inherent power of truth.",
        keywords: ["ProtectionOfTruth", "RockOfAwareness", "AsmaKhana"]
      },
      {
        num: 9,
        sanskrit: "नैवैतेन सुरभि न दुर्गन्धि विजानात्यपहतपाप्मा ह्येष तेन यदश्नाति यत्पिबति तेनेतरान् प्राणानवत्येतमु एवान्ततोऽवित्त्वोत्क्रामति व्याददात्येवान्तत इति ॥ ९ ॥",
        hindi: "यह मुख्य प्राण न सुगन्ध को जानता है न दुर्गन्ध को, क्योंकि यह समस्त पाप से रहित है। यह जो खाता-पीता है उससे अन्य सब इन्द्रियों की रक्षा करता है। ॥ ९ ॥",
        explanation: "Prana functions beyond sensory likes and dislikes; it nourishes the entire organism without bias.",
        keywords: ["ImpartialNourishment", "BeyondBias", "LifeGiver"]
      },
      {
        num: 10,
        sanskrit: "तं हाङ्गिरा उद्गीथमुपासाञ्चक्र एतमु एवाङ्गिरसं मन्यन्तेऽङ्गानां यद्रसः ॥ १० ॥",
        hindi: "अङ्गिरा ऋषि ने इस मुख्य प्राण की उद्गीथ रूप में उपासना की; इसीलिये वे अङ्गिरा कहलाए, क्योंकि प्राण समस्त अंगों का रस है। ॥ १० ॥",
        explanation: "Angiras represents the vital essence pervading every limb and cell.",
        keywords: ["SageAngiras", "LimbEssence", "Vitality"]
      },
      {
        num: 11,
        sanskrit: "तेन तँ ह बृहस्पतिरुद्गीथमुपासाञ्चक्र एतमु एव बृहस्पतिं मन्यन्ते वाग्धि बृहती तस्या एष पतिः ॥ ११ ॥",
        hindi: "बृहस्पति ने इसकी उपासना की; वाणी बृहती है और प्राण उसका पति (स्वामी) है, अतः वे बृहस्पति कहलाए। ॥ ११ ॥",
        explanation: "Prana is the master and energizer of expansive speech (Brihati).",
        keywords: ["Brihaspati", "MasterOfSpeech", "PranaPower"]
      },
      {
        num: 12,
        sanskrit: "तेन तँ हायास्य उद्गीथमुपासाञ्चक्र एतमु एवायास्यं मन्यन्त आस्याद्यदयते ॥ १२ ॥",
        hindi: "अयास्य ऋषि ने इसकी उपासना की; मुख (आस्य) से गति करने के कारण प्राण ही अयास्य है। ॥ १२ ॥",
        explanation: "Ayasya refers to the breath emerging unobstructed from the oral cavity.",
        keywords: ["SageAyasya", "BreathFlow", "Spontaneity"]
      },
      {
        num: 13,
        sanskrit: "तेन तं ह बको दाल्भ्यो विदाञ्चकार । स ह नैमिशीयानामुद्गाता बभूव स ह स्मैभ्यः कामानागायति ॥ १३ ॥",
        hindi: "दालभ्य के पुत्र बक ऋषि ने इसे जाना। वे नैमिषारण्य के ऋषियों के उद्गाता बने और उनके लिये अभीष्ट कामनाओं का गायन करते थे। ॥ १३ ॥",
        explanation: "Sage Baka Dalbhya channeled this vital understanding to uplift the seekers of Naimisharanya.",
        keywords: ["BakaDalbhya", "Naimisharanya", "AltruisticSinging"]
      },
      {
        num: 14,
        sanskrit: "आगाता ह वै कामानां भवति य एतदेवं विद्वानक्षरमुद्गीथमुपास्त इत्यध्यात्मम् ॥ १४ ॥",
        hindi: "जो इस प्रकार जानकर अक्षर उद्गीथ की उपासना करता है, वह समस्त कामनाओं को प्राप्त कराने वाला उद्गाता बन जाता है। यह अध्यात्म-विषयक ज्ञान है। ॥ १४ ॥",
        explanation: "This concludes the esoteric subjective (adhyatma) teaching on the supremacy of Prana.",
        keywords: ["Adhyatma", "InnerRealization", "SelfSufficiency"]
      }
    ]
  },
  // Khanda 3 (1.3) - 12 mantras
  {
    khanda: 3,
    title: "Prapathaka 1 · Khanda 3 — The Sun, the Breaths (Vyana), and the Syllables of Udgitha",
    titleSanskrit: "प्रथम प्रपाठक · तृतीय खण्ड — आदित्य, व्यान एवं उद्गीथाक्षर",
    summary: "Meditation on Udgitha externally in the Sun, internally in Vyana (the junction of Prana and Apana where speech and vigorous action occur), and in the syllables Ud-gi-tha.",
    verses: [
      {
        num: 1,
        sanskrit: "अथाधिदैवतं य एवासौ तपति तमुद्गीथमुपासीतोद्यन्वा एष प्रजाभ्य उद्गायति । उद्यँस्तमो भयपहन्त्यपहन्ता ह वै भयस्य तमसो भवति य एवं वेद ॥ १ ॥",
        hindi: "अब अधिदैवत ज्ञान: जो यह सूर्य तप रहा है, उसकी उद्गीथ रूप में उपासना करे। उदय होता हुआ यह प्राणियों के लिये उद्गान करता है तथा अन्धकार और भय को नष्ट करता है।",
        explanation: "The Sun is the cosmic Udgitha, dispelling darkness and fear for all living beings.",
        keywords: ["Adhidaivata", "Sun", "DispellingDarkness", "Fearlessness"]
      },
      {
        num: 2,
        sanskrit: "समान उ एवायं चासौ चोष्णोऽयमुष्णोऽसौ स्वर इतीममाचक्षते स्वर इति प्रत्यास्वर इत्यमुं तस्माद्वा एतमिमममुं चोद्गीथमुपासीत ॥ २ ॥",
        hindi: "यह (शरीरस्थ प्राण) और वह (सूर्य) दोनों समान हैं; यह भी उष्ण है और वह भी उष्ण है। इसे स्वर कहते हैं और उसे स्वर तथा प्रत्यास्वर कहते हैं।",
        explanation: "Identity of internal bodily heat (Prana) and external cosmic radiation (Sun).",
        keywords: ["SunAndPrana", "ThermalContinuity", "CosmicIdentity"]
      },
      {
        num: 3,
        sanskrit: "अथ खलु व्यानमेवोद्गीथमुपासीत यद्वै प्राणिति स प्राणो यदपानिति सोऽपानः । अथ यः प्राणापानयोः सन्धिः स व्यानो यो व्यानः सा वाक् । तस्मादप्राणन्ननपानन्वाचमभिव्याहरति ॥ ३ ॥",
        hindi: "अब व्यान की उद्गीथ रूप में उपासना करे। जो श्वास लेता है वह प्राण है, जो छोड़ता है वह अपान है; और जो दोनों का सन्धि-स्थल है वह व्यान है। व्यान ही वाणी है।",
        explanation: "Vyana is the still point between inhalation and exhalation where conscious speech and focused action emerge.",
        keywords: ["Vyana", "StillPoint", "PranaApanaJunction", "BreathControl"]
      },
      {
        num: 4,
        sanskrit: "या वाक् सर्क् तस्मादप्राणन्ननपानन्नृचमभिव्याहरति यार्क तत्साम तस्मादप्राणन्ननपानन् साम गायति यत्साम स उद्गीथस्तस्मादप्राणन्ननपानन्नुद्गायति ॥ ४ ॥",
        hindi: "जो वाणी है वही ऋक् है, जो ऋक् है वही साम है, जो साम है वही उद्गीथ है। इसलिये बिना श्वास खींचे या छोड़े (कुम्भक में) उद्गान किया जाता है।",
        explanation: "Chanting occurs during the retention of breath, focusing psychic power.",
        keywords: ["Kumbhaka", "ChantFocus", "BreathSuspension"]
      },
      {
        num: 5,
        sanskrit: "अतो यान्यन्यानि वीर्यवन्ति कर्माणि यथाग्नेर्मन्थनमाजौ सरणं दृढस्य धनुष आयमनमप्राणन्ननपानंस्तानि करोत्येतस्य हेतोर्व्यानमेवोद्गीथमुपासीत ॥ ५ ॥",
        hindi: "अतः अग्नि-मंथन, युद्ध-दौड़, या दृढ़ धनुष को खींचना — ये सभी पराक्रम के कार्य बिना श्वास लिए-छोड़े किए जाते हैं; इसीलिये व्यान की उपासना करनी चाहिए।",
        explanation: "All intense physical feats require breath retention and core stillness (Vyana).",
        keywords: ["PeakPerformance", "StillnessInAction", "VyanaPower"]
      },
      {
        num: 6,
        sanskrit: "अथ खलूद्गीथाक्षराण्युपासीतोद्गीथ इति । प्राण एवोत् प्राणेन ह्युत्तिष्ठति वाग्गीर्वाचो ह गिर इत्याचक्षतेऽन्नं थमन्ने हीदं सर्वं स्थितम् ॥ ६ ॥",
        hindi: "अब 'उद्गीथ' के अक्षरों की उपासना करे: 'उद्' प्राण है (क्योंकि प्राण से ही सब उठता है), 'गी' वाणी है, और 'थ' अन्न है (क्योंकि अन्न में ही सब स्थित है)।",
        explanation: "Etymological meditation on the three syllables: Ud (ascension/breath), Gi (speech/sound), Tha (nourishment/stability).",
        keywords: ["UdGiTha", "Ascension", "Speech", "Nourishment"]
      },
      {
        num: 7,
        sanskrit: "द्यौरेवोदन्तरिक्षं गीः पृथिवी थमादित्य एवोद्वायुर्गीरग्निस्थम् सामवेद एवोद्यजुर्वेदोगीर्ऋग्वेदस्थम् दुग्धेऽस्मै वाग्दोहं यो वाचो दोहोऽन्नवानन्नादो भवति य एतान्येवं विद्वानुद्गीथाक्षराण्युपास्त उद्गीथ इति ॥ ७ ॥",
        hindi: "द्युलोक ही 'उद्' है, अन्तरिक्ष 'गी' है, पृथिवी 'थ' है। सूर्य 'उद्' है, वायु 'गी' है, अग्नि 'थ' है। सामवेद 'उद्' है, यजुर्वेद 'गी' है, ऋग्वेद 'थ' है। जो ऐसा जानता है, उसे वाणी समस्त अभिलाषाओं का दोहन कराती है।",
        explanation: "The threefold cosmos, elements, and Vedas mapped onto the tripartite structure of Udgitha.",
        keywords: ["CosmicTriad", "MilkingDesires", "Integration"]
      },
      {
        num: 8,
        sanskrit: "अथ खल्वाशीः समृद्धिरुपसरणानीत्युपासीत येन साम्ना स्तोष्यन्त्स्यात्तत्सामोपधावेत् ॥ ८ ॥",
        hindi: "अब अभीष्ट सिद्धि के लिये ध्यान की विधि: जिस साम से स्तुति करनी हो, उस साम के स्वरूप का अनुचिन्तन करे।",
        explanation: "Preparation for prayer: mentally align with the melody and rhythm before vocalizing.",
        keywords: ["SadhanaMethod", "MentalAlignment", "Resonance"]
      },
      {
        num: 9,
        sanskrit: "यस्यामृचि तामृचं यमर्षिं तमर्षिं यां देवतामभिष्टोष्यन्त्स्यात्तां देवतामुपधावेत् ॥ ९ ॥",
        hindi: "जिस ऋचा में वह साम स्थित हो, उस ऋचा का, जिस ऋषि का वह मन्त्र हो, उस ऋषि का, और जिस देवता की स्तुति हो, उस देवता का ध्यान करे।",
        explanation: "Honor the lineage: poetic meter (Rik), visionary sage (Rishi), and divine archetype (Devata).",
        keywords: ["Lineage", "Rishi", "Devata", "Reverence"]
      },
      {
        num: 10,
        sanskrit: "येन च्छन्दसा स्तोष्यन्त्स्यात्तच्छन्द उपधावेद्येन स्तोमेन स्तोष्यमाणः स्यात्तं स्तोममुपधावेत् ॥ १० ॥",
        hindi: "जिस छन्द में स्तुति हो उस छन्द का, और जिस स्तोम से गान हो उस स्तोम का चिन्तन करे।",
        explanation: "Mindfulness of rhythmic meter and cadence.",
        keywords: ["Chandas", "Meter", "Cadence"]
      },
      {
        num: 11,
        sanskrit: "यां दिशमभिष्टोष्यन्त्स्यात्तां दिशमुपधावेत् ॥ ११ ॥",
        hindi: "जिस दिशा की ओर अभिमुख होकर स्तुति करनी हो, उस दिशा का ध्यान करे।",
        explanation: "Spatial and orientational awareness in contemplation.",
        keywords: ["Direction", "SpatialAwareness", "Orientation"]
      },
      {
        num: 12,
        sanskrit: "आत्मानमन्तत उपसृत्य स्तुवीत कामं ध्यायन्नप्रमत्तोऽभ्याशो ह यदस्मै स कामः समृद्ध्येत यत्कामः स्तुवीतेति यत्कामः स्तुवीतेति ॥ १२ ॥",
        hindi: "अन्त में अपने ही आत्मा का आश्रय लेकर, एकाग्रचित्त और अप्रमत्त होकर, अपनी अभीष्ट कामना का ध्यान करते हुए स्तुति करे। उसकी वह कामना निश्चय ही सिद्ध होती है।",
        explanation: "The ultimate climax: after aligning with cosmos, sage, and meter, rest in one's own Self ('ātmānam antata upasṛtya') in unwavering presence.",
        keywords: ["RestingInSelf", "AtmaSamadhi", "UnwaveringPresence"]
      }
    ]
  },
  // Khanda 4 (1.4) - 5 mantras
  {
    khanda: 4,
    title: "Prapathaka 1 · Khanda 4 — The Devas Take Shelter in OM to Conquer Death",
    titleSanskrit: "प्रथम प्रपाठक · चतुर्थ खण्ड — मृत्यु-भय से मुक्ति एवं ओंकार",
    summary: "Devas, fearing death, take shelter in Vedic meters (Chandas). Death pursues them in ritual sounds; finally the Devas enter the pure immortal sanctuary of OM and attain fearless immortality.",
    verses: [
      {
        num: 1,
        sanskrit: "ओमित्येतदक्षरमुद्गीथमुपासीतोमिति ह्युद्गायति तस्योपव्याख्यानम् ॥ १ ॥",
        hindi: "ओंकार इस अक्षर की उद्गीथ रूप में उपासना करे। 'ओम्' ऐसा उच्चारण करके उद्गान किया जाता है; उसी की व्याख्या है।",
        explanation: "Opening restatement emphasizing OM as the path to immortality.",
        keywords: ["Om", "Udgitha", "Immortality"]
      },
      {
        num: 2,
        sanskrit: "देवा वै मृत्योर्बिभ्यतस्त्रयीं विद्यां प्राविशंस्ते छन्दोभिरच्छादयन् यदेभिरच्छादयंस्तच्छन्दसां छन्दस्त्वम् ॥ २ ॥",
        hindi: "मृत्यु से भयभीत देवताओं ने त्रयी विद्या (तीन वेदों) में प्रवेश किया; उन्होंने छन्दों से अपने-आपको ढँक लिया। चूँकि छन्दों से उन्होंने आच्छादित किया, इसीलिये छन्दों को 'छन्दस्' कहते हैं।",
        explanation: "Chandas comes from the root 'chad' (to cover/protect). Rituals offer temporary shelter from mortality.",
        keywords: ["Chandas", "ShelterFromMortality", "Etymology"]
      },
      {
        num: 3,
        sanskrit: "तानु तत्र मृत्युर्यथा मत्स्यमुदके परिविध्येदेवं पर्यविध्यदृचि साम्नि यजुषि । ते नु वित्त्वोर्ध्वा ऋचः साम्नो यजुषः स्वरमेव प्राविशन् ॥ ३ ॥",
        hindi: "जैसे जल में मछली को जाल से पकड़ लिया जाता है, वैसे ही मृत्यु ने ऋक्, साम और यजुष् में भी उन्हें देख लिया। यह जानकर देवता ऋक्, साम, यजुष् से ऊपर उठकर 'स्वर' (ओंकार) में प्रविष्ट हो गए।",
        explanation: "Ritual action without self-knowledge remains subject to time and death. The wise transcend ritual form into the pure tone of consciousness.",
        keywords: ["TranscendingRitual", "PureTone", "Svara", "FreedomFromDeath"]
      },
      {
        num: 4,
        sanskrit: "यदा वा ऋचमाप्नोत्योमित्येवातिस्वरत्येवं सामैवं यजुरेष उ स्वरो यदेतदक्षरमेतदमृतमभयं तत्प्रविश्य देवा अमृता अभया अभवन् ॥ ४ ॥",
        hindi: "जब कोई ऋक्, साम या यजुष् को प्राप्त करता है, तो 'ओम्' के द्वारा ही उसका विस्तार करता है। यह ओंकार ही अमृत और अभय पद है; इसमें प्रवेश करके देवता अमृत और अभय हो गए।",
        explanation: "OM is the fearless sanctuary (Abhayam). Entering OM, mortal fear dissolves into timeless being.",
        keywords: ["Abhayam", "FearlessSanctuary", "Amritam", "Timeless"]
      },
      {
        num: 5,
        sanskrit: "स य एतदेवं विद्वानक्षरं प्रणौत्येतदेवाक्षरममृतमभयं प्रविशति तत्प्रविश्य यदमृता देवास्तदमृतो भवति ॥ ५ ॥",
        hindi: "जो इस प्रकार जानकर इस अक्षर की स्तुति करता है, वह इस अमृत और अभय ओंकार में ही प्रवेश करता है; और जैसे देवता अमृत हुए, वैसे ही वह भी अमृत हो जाता है।",
        explanation: "Whosoever meditates on OM with this realization enters the identical state of fearless immortality.",
        keywords: ["ImmortalityAttainment", "DirectRealization", "Liberation"]
      }
    ]
  },
  // Khanda 5 (1.5) - 5 mantras
  {
    khanda: 5,
    title: "Prapathaka 1 · Khanda 5 — Identity of Udgitha and Pranava",
    titleSanskrit: "प्रथम प्रपाठक · पञ्चम खण्ड — उद्गीथ एवं प्रणव की एकता",
    summary: "Udgitha in Sama Veda is identical to Pranava (OM) in Rig Veda. Sage Kaushitaki's counsel on harmonizing external cosmic rays and internal vital breaths.",
    verses: [
      {
        num: 1,
        sanskrit: "अथ खलु य उद्गीथः स प्रणवो यः प्रणवः स उद्गीथ इत्यसौ वा आदित्य उद्गीथ एष प्रणव ओमिति ह्येष स्वरन्नेति ॥ १ ॥",
        hindi: "जो उद्गीथ है वही प्रणव है, जो प्रणव है वही उद्गीथ है। यह जो सूर्य है वही उद्गीथ है और वही प्रणव है, क्योंकि वह 'ओम्' करता हुआ ही गतिमान होता है।",
        explanation: "Pranava (Rigvedic OM) and Udgitha (Samavedic chant) are one. The Sun radiates cosmic sound as it illuminates.",
        keywords: ["PranavaAndUdgitha", "CosmicSun", "SoundAndLight"]
      },
      {
        num: 2,
        sanskrit: "एतमु एवाहमभ्यगासिषं तस्मान्मम त्वमेकोऽसीति ह कौषीतकिः पुत्रमुवाच रश्मींस्त्वं पर्यावर्तयाद्बहवो वै ते भविष्यन्तीत्यधिदैवतम् ॥ २ ॥",
        hindi: "कौषीतकि ऋषि ने अपने पुत्र से कहा: 'मैंने केवल एक सूर्य की उपासना की, इसलिये तुम मेरे अकेले पुत्र हो। तुम उसकी विविध किरणों की उपासना करो, जिससे तुम्हारे बहुत पुत्र होंगे।' यह अधिदैवत है।",
        explanation: "A traditional allegory on meditating not only on the single source but on its manifold radiant expressions.",
        keywords: ["Kaushitaki", "RadiantExpressions", "Abundance"]
      },
      {
        num: 3,
        sanskrit: "अथाध्यात्मं य एवायं मुख्यः प्राणस्तमुद्गीथमुपासीतोमिति ह्येष स्वरन्नेति ॥ ३ ॥",
        hindi: "अब अध्यात्म में: जो यह मुख्य प्राण है, उसकी उद्गीथ रूप में उपासना करे; क्योंकि यह भी 'ओम्' उच्चरित करता हुआ ही संचार करता है।",
        explanation: "The central life-breath continuously intones OM throughout the physiological system.",
        keywords: ["SpontaneousOm", "InnerPrana", "AjapaJapa"]
      },
      {
        num: 4,
        sanskrit: "एतमु एवाहमभ्यगासिषं तस्मान्मम त्वमेकोऽसीति ह कौषीतकिः पुत्रमुवाच प्राणांस्त्वं भूमानमभिगायताद्बहवो वै मे भविष्यन्तीति ॥ ४ ॥",
        hindi: "कौषीतकि ने पुत्र से कहा: 'तुम प्राणों के वैविध्य और बहुलता का गायन करो, जिससे तुम्हें दीर्घ जीवन और सन्तति प्राप्त हो।' ॥ ४ ॥",
        explanation: "Harmonizing the manifold currents of life-force produces resilience and vitality.",
        keywords: ["VitalCurrents", "PranaMultiplicity", "Wholeness"]
      },
      {
        num: 5,
        sanskrit: "अथ खलु य उद्गीथः स प्रणवो यः प्रणवः स उद्गीथ इति होतृषदनाद्धैवापि दुरुद्गीथमनुसमादधातीत्यनुसमादधातीति ॥ ५ ॥",
        hindi: "जो उद्गीथ है वही प्रणव है; इस ज्ञान के द्वारा यदि उद्गाता से कोई त्रुटि भी हो जाए, तो होता के आसन से वह त्रुटि पूर्णतया सुधर जाती है। ॥ ५ ॥",
        explanation: "True philosophical understanding heals and rectifies any external mechanical mistake in ritual or life.",
        keywords: ["HealingErrors", "KnowledgeRectifies", "Completeness"]
      }
    ]
  },
  // Khanda 6 (1.6) - 8 mantras
  {
    khanda: 6,
    title: "Prapathaka 1 · Khanda 6 — The Golden Person in the Sun (Hiranmaya Purusha)",
    titleSanskrit: "प्रथम प्रपाठक · षष्ठ खण्ड — आदित्यमण्डलस्थ हिरण्मय पुरुष",
    summary: "The cosmic correspondence of Rik and Saman in Earth and Fire, Sky and Wind, Heaven and Sun. Within the Sun dwells the Golden Person — pure gold from head to toe, utterly transcending all sin.",
    verses: [
      {
        num: 1,
        sanskrit: "इयमेवर्गग्निः साम तदेतदेतस्यामृच्यध्यूढं साम तस्मादृच्यध्यूढं साम गीयत इयमेव साग्निरमस्तत्साम ॥ १ ॥",
        hindi: "यह पृथिवी ही ऋक् है और अग्नि साम है। यह साम इस ऋक् पर प्रतिष्ठित है, इसीलिये ऋचा पर स्थित करके साम गाया जाता है। पृथिवी 'सा' है, अग्नि 'अम' है — इसी से 'साम' बना।",
        explanation: "Earth is the grounding matrix (Sa/Rik); Fire is the rising energy (Ama/Saman). Together they constitute the harmony of existence (Saman).",
        keywords: ["EarthAndFire", "GroundAndFlame", "SamanHarmony"]
      },
      {
        num: 2,
        sanskrit: "अन्तरिक्षमेवर्ग वायुः साम तदेतदेतस्यामृच्यध्यूढं साम तस्मादृच्यध्यूढं साम गीयतेऽन्तरिक्षमेव सा वायुरमस्तत्साम ॥ २ ॥",
        hindi: "अन्तरिक्ष ही ऋक् है और वायु साम है। अन्तरिक्ष 'सा' है, वायु 'अम' है — यही साम है।",
        explanation: "Space is the vessel; atmospheric wind is the animating vibration.",
        keywords: ["SpaceAndWind", "AtmosphericHarmony"]
      },
      {
        num: 3,
        sanskrit: "द्यौरेवर्गादित्यः साम तदेतदेतस्यामृच्यध्यूढं साम तस्मादृच्यध्यूढं साम गीयते द्यौरेव सादित्योऽमस्तत्साम ॥ ३ ॥",
        hindi: "द्युलोक ही ऋक् है और सूर्य साम है। द्युलोक 'सा' है, सूर्य 'अम' है — यही साम है।",
        explanation: "The celestial sphere is the realm; the solar orb is the crowning light.",
        keywords: ["HeavenAndSun", "CelestialLight"]
      },
      {
        num: 4,
        sanskrit: "नक्षत्राण्येवर्क् चन्द्रमाः साम तदेतदेतस्यामृच्यध्यूढं साम तस्मादृच्यध्यूढं साम गीयते नक्षत्राण्येव सा चन्द्रमा अमस्तत्साम ॥ ४ ॥",
        hindi: "नक्षत्र ही ऋक् हैं और चन्द्रमा साम है। नक्षत्र 'सा' हैं, चन्द्रमा 'अम' है — यही साम है।",
        explanation: "The stars are the background field; the moon is the reflective mind.",
        keywords: ["StarsAndMoon", "NocturnalHarmony"]
      },
      {
        num: 5,
        sanskrit: "अथ यदेतदादित्यस्य शुक्लं भाः सैवर्गथ यन्नीलं परः कृष्णं तत्साम तदेतदेतस्यामृच्यध्यूढं साम तस्मादृच्यध्यूढं साम गीयते ॥ ५ ॥",
        hindi: "सूर्य का जो यह श्वेत प्रकाश है वह ऋक् है, और जो गहरा नीला-काला प्रकाश है वह साम है। यह साम उस ऋक् पर प्रतिष्ठित है।",
        explanation: "Light and dark spectra within the solar radiance symbolize manifest brilliance and mysterious depth.",
        keywords: ["LightAndDarkSpectra", "SolarRadiance", "DeepMystery"]
      },
      {
        num: 6,
        sanskrit: "अथ यदेवैतदादित्यस्य शुक्लं भाः सैव साऽथ यन्नीलं परः कृष्णं तदमस्तत्साम । अथ य एषोऽन्तररादित्ये हिरण्मयः पुरुषो दृश्यते हिरण्यश्मश्रुर्हिरण्यकेश आप्रणखात् सर्व एव सुवर्णः ॥ ६ ॥",
        hindi: "उस सूर्य-मण्डल के भीतर जो यह हिरण्मय (स्वर्णमय/प्रकाशमय) पुरुष दिखाई देता है, उसकी दाढ़ी सुनहरी है, केश सुनहरे हैं — वह नख से लेकर शिखा तक सर्वथा सुवर्णमय है।",
        explanation: "The visionary revelation of the Hiranmaya Purusha — the Supreme Being visualized as radiant golden light within the sun.",
        keywords: ["HiranmayaPurusha", "GoldenBeing", "SolarDeity", "VisionaryLight"]
      },
      {
        num: 7,
        sanskrit: "तस्य यथा कप्यासं पुण्डरीकमेवमक्षिणी तस्योदिति नाम स एष सर्वेभ्यः पाप्मभ्य उदित उदेति ह वै सर्वेभ्यः पाप्मभ्यो य एवं वेद ॥ ७ ॥",
        hindi: "उसके नेत्र खिले हुए रक्त-कमल (पुण्डरीक) के समान सुन्दर हैं। उसका नाम 'उद्' है, क्योंकि वह समस्त पापों से ऊपर उठ चुका है। जो ऐसा जानता है, वह समस्त पापों से ऊपर उठ जाता है।",
        explanation: "The Lotus Eyes of the Divine: The name 'Ut' signifies rising above all limitation and negativity.",
        keywords: ["LotusEyes", "TranscendenceOfSin", "RisingAbove", "Pundarika"]
      },
      {
        num: 8,
        sanskrit: "तस्यर्क् च साम च गेष्णौ तस्मादुद्गीथस्तस्मात्त्वेवोद्गातास्य हि गाता स एष ये चामुष्मात्पराञ्चो लोकास्तेषां चेष्टे देवकामानां चेत्यधिदैवतम् ॥ ८ ॥",
        hindi: "ऋक् और साम उसके चरण-गान हैं; इसीलिये वह उद्गीथ है। वह सूर्य से परे के समस्त लोकों और देवताओं की समस्त कामनाओं का स्वामी है। यह अधिदैवत रूप है।",
        explanation: "The Golden Person governs all celestial realms and supreme spiritual aspirations.",
        keywords: ["Sovereignty", "SupremeRuler", "AdhidaivataClimax"]
      }
    ]
  },
  // Khanda 7 (1.7) - 9 mantras
  {
    khanda: 7,
    title: "Prapathaka 1 · Khanda 7 — The Person within the Eye (Akshi Purusha)",
    titleSanskrit: "प्रथम प्रपाठक · सप्तम खण्ड — नेत्रस्थ पुरुष एवं उभय-सिद्धि",
    summary: "The internal correspondence: Speech is Rik, Prana is Saman; Eye is Rik, Atman is Saman. The Person seen within the human eye is identical to the Golden Person in the Sun. He who knows this attains all cosmic and earthly fulfillment.",
    verses: [
      {
        num: 1,
        sanskrit: "अथाध्यात्मं वागेवर्ग प्राणः साम तदेतदेतस्यामृच्यध्यूढं साम तस्मादृच्यध्यूढं साम गीयते वागेव सा प्राणोऽमस्तत्साम ॥ १ ॥",
        hindi: "अब अध्यात्म में: वाणी ही ऋक् है और प्राण साम है। वाणी 'सा' है, प्राण 'अम' है — यही साम है।",
        explanation: "The internal subjective correspondence: voice and breath.",
        keywords: ["VoiceAndBreath", "Adhyatma"]
      },
      {
        num: 2,
        sanskrit: "चक्षुरेवर्ग आत्मा साम तदेतदेतस्यामृच्यध्यूढं साम तस्मादृच्यध्यूढं साम गीयते चक्षुरेव सात्मामस्तत्साम ॥ २ ॥",
        hindi: "नेत्र ही ऋक् है और आत्मा (छाया/प्रतिबिम्ब) साम है। नेत्र 'सा' है, आत्मा 'अम' है — यही साम है।",
        explanation: "The faculty of sight and the inner self that perceives through it.",
        keywords: ["EyeAndSelf", "Perceiver"]
      },
      {
        num: 3,
        sanskrit: "श्रोत्रमेवर्ग मनः साम तदेतदेतस्यामृच्यध्यूढं साम तस्मादृच्यध्यूढं साम गीयते श्रोत्रमेव सा मनोऽमस्तत्साम ॥ ३ ॥",
        hindi: "कान ही ऋक् है और मन साम है। कान 'सा' है, मन 'अम' है — यही साम है।",
        explanation: "The ear receives external acoustics; the mind interprets inner meaning.",
        keywords: ["EarAndMind", "AcousticsAndMeaning"]
      },
      {
        num: 4,
        sanskrit: "अथ यदेतदक्ष्णः शुक्लं भाः सैवर्गथ यन्नीलं परः कृष्णं तत्साम तदेतदेतस्यामृच्यध्यूढं साम तस्मादृच्यध्यूढं साम गीयते यच्चैवाक्ष्णः शुक्लं भाः सैव साऽथ यन्नीलं परः कृष्णं तदमस्तत्साम ॥ ४ ॥",
        hindi: "आँख का जो यह श्वेत भाग है वह ऋक् है, और जो गहरा काला तारा है वह साम है। यह साम उस ऋक् पर प्रतिष्ठित है।",
        explanation: "Microcosmic optical structure mirroring the macrocosmic solar spectrum.",
        keywords: ["OpticalStructure", "MicroMacroMirror"]
      },
      {
        num: 5,
        sanskrit: "अथ य एषोऽन्तरक्षिणि पुरुषो दृश्यते सैवर्ग तत्साम तदुक्थं तद्यजुस्तद्ब्रह्म तस्यैतस्य तदेव रूपं यदमुष्य रूपं यावमुष्य गेष्णौ तौ गेष्णौ यन्नाम तन्नाम ॥ ५ ॥",
        hindi: "आँख के भीतर जो यह पुरुष दिखाई देता है, वही ऋक् है, वही साम है, वही उक्थ है, वही यजुष् है, वही ब्रह्म है! उसका वही रूप है जो उस सूर्यस्थ पुरुष का है; जो उसका नाम है, वही इसका नाम है।",
        explanation: "The supreme non-dual identification: The Seer in the eye is none other than the Golden Person in the Sun. The inner consciousness is the universal consciousness.",
        keywords: ["AkshiPurusha", "IdentityWithSun", "NonDualKnower", "TatTvamAsiRoots"]
      },
      {
        num: 6,
        sanskrit: "स एष ये चैतस्मादर्वाञ्चो लोकास्तेषां चेष्टे मनुष्यकामानां चेति तद्य इमे वीणायां गायन्त्येतं ते गायन्ति तस्मात्ते धनसनयः ॥ ६ ॥",
        hindi: "यह जो नेत्रस्थ पुरुष है, वह पृथ्वी आदि नीचे के समस्त लोकों और मनुष्यों की समस्त कामनाओं का स्वामी है। जो लोग वीणा पर गान करते हैं, वे वस्तुतः इसी का गान करते हैं।",
        explanation: "All human music, poetry, and art are unconscious celebrations of this inner divine witness.",
        keywords: ["SourceOfMusic", "VeenaChant", "DivineWitness"]
      },
      {
        num: 7,
        sanskrit: "अथ य एतदेवं विद्वान् साम गायत्युभावपि स गायत्येतस्यैव स य एषोऽमुष्मात्पराञ्चो लोकास्तांश्चाप्नोति देवकामांश्र्च ॥ ७ ॥",
        hindi: "जो इस प्रकार जानकर सामगान करता है, वह दोनों का गान करता है — वह सूर्य के उस पार के देवलोकों को और देव-कामनाओं को प्राप्त करता है।",
        explanation: "Knowing this identity, one's awareness encompasses both higher transcendent realms and divine joy.",
        keywords: ["TranscendentJoy", "CosmicRealization"]
      },
      {
        num: 8,
        sanskrit: "अथानेनैव ये चैतस्मादर्वाञ्चो लोकास्तांश्चाप्नोति मनुष्यकामांश्च तस्मादु हैवंविदुद्गाता ब्रूयात् ॥ ८ ॥",
        hindi: "और इसके द्वारा वह इस लोक के समस्त मानवीय सुखों और कामनाओं को भी प्राप्त करता है। इसलिये ऐसे ज्ञानी उद्गाता को यजमान से कहना चाहिए...",
        explanation: "Spiritual realization does not alienate one from the world; it harmonizes both worldly and spiritual fulfillment.",
        keywords: ["BothRealms", "WorldlyAndSpiritualFulfillment"]
      },
      {
        num: 9,
        sanskrit: "कं ते काममागायानीत्येष ह्येव कामागानस्यष्टे य एवं विद्वान् साम गायति साम गायति ॥ ९ ॥",
        hindi: "'मैं तुम्हारे लिये किस कामना का गान करूँ?' — क्योंकि जो ऐसा जानकर सामगान करता है, वह समस्त कामनाओं को प्रदान करने में पूर्ण समर्थ होता है।",
        explanation: "The realized sage possesses the power to bless and elevate others, having become one with the all-bounteous Self.",
        keywords: ["BlessingPower", "AllBounteousSelf", "UdgithaComplete"]
      }
    ]
  }
];

// Helper to generate IAST transliteration
function toIast(sanskrit) {
  const clean = sanskrit.replace(/॥\s*[\d०-९]+\s*॥/g, '').replace(/[।॥\n]/g, ' ').replace(/\s+/g, ' ').trim();
  try {
    return Sanscript.t(clean, 'devanagari', 'iast').replace(/\s+/g, ' ').trim() + ' ||';
  } catch {
    return '';
  }
}

// Build Chapters 1 to 7
const newChapters1_7 = KHANDA_1_7_DATA.map(k => {
  const sbeVerses = sbeTranslations[k.khanda] || [];
  return {
    id: k.khanda,
    number: k.khanda,
    title: k.title,
    titleSanskrit: k.titleSanskrit,
    summary: k.summary,
    verses: k.verses.map((v, idx) => {
      const sbeMatch = sbeVerses.find(sv => sv.number === v.num) || sbeVerses[idx];
      const translation = sbeMatch ? sbeMatch.text : v.hindi;
      const numStr = `1.${k.khanda}.${v.num}`;
      return {
        id: v.num,
        number: numStr,
        sanskrit: v.sanskrit,
        transliteration: toIast(v.sanskrit),
        translation: translation,
        hindi: v.hindi,
        explanation: v.explanation,
        science: "Cognitive resonance and autonomic regulation: rhythmic sacred phonemes and coordinated breathwork reduce amygdala arousal and increase heart rate variability.",
        lifeLesson: "Connect your daily routine with mindful presence. Simple, conscious repetition transforms ordinary action into profound mastery.",
        keywords: v.keywords
      };
    })
  };
});

console.log(`Constructed new Chapters 1 to 7 with ${newChapters1_7.reduce((sum, c) => sum + c.verses.length, 0)} canonical verses!`);

// Load existing chandogya.json for Chapters 8 to 154
const existingJson = JSON.parse(fs.readFileSync('public/data/scriptures-full/chandogya.json', 'utf8'));

// Take chapters 8 to 154 (indices 7 to 153)
const chapters8to154 = existingJson.chapters.slice(7).map((ch, chIdx) => {
  const chNum = ch.number;
  const cleanedVerses = ch.verses.map((v, vIdx) => {
    // verse number string (e.g. "1.8.1")
    const numStr = typeof v.number === 'string' ? v.number : `${chNum}.${vIdx + 1}`;
    // Generate clean sequential ID
    const cleanId = vIdx + 1;
    
    // Generate meaningful keywords if empty
    let kw = v.keywords;
    if (!kw || kw.length === 0) {
      kw = ["Chandogya", "Upanishad", `Adhyaya${chNum}`, "Brahman", "Udgitha"];
    }

    return {
      id: cleanId,
      number: numStr,
      sanskrit: v.sanskrit,
      transliteration: v.transliteration,
      translation: v.translation,
      hindi: v.hindi,
      explanation: v.commentary || v.explanation || v.translation,
      science: v.science || "Integrated neurophysiology of contemplation: sustained awareness deepens cortical integration and parasympathetic tone.",
      lifeLesson: v.lifeLesson || "Reflect on how the unchanging witness within you remains serene amidst changing circumstances.",
      keywords: kw
    };
  });

  return {
    id: chNum,
    number: chNum,
    title: ch.title,
    titleSanskrit: ch.titleSanskrit || `प्रपाठक खण्ड ${chNum}`,
    summary: ch.summary || `Khanda ${chNum} of the Chandogya Upanishad.`,
    verses: cleanedVerses
  };
});

console.log(`Processed Chapters 8 to 154 with ${chapters8to154.reduce((sum, c) => sum + c.verses.length, 0)} verses!`);

// Combine all 154 chapters!
const allChapters = [...newChapters1_7, ...chapters8to154];
const totalVerses = allChapters.reduce((sum, c) => sum + c.verses.length, 0);

console.log(`Total 154 chapters combined: ${allChapters.length} chapters, ${totalVerses} verses (Canonical 628)!`);

// Write to public/data/scriptures-full/chandogya.json
const updatedJson = {
  id: "chandogya",
  title: "Chandogya Upanishad",
  titleSanskrit: "छान्दोग्योपनिषद्",
  category: "upanishad",
  source: existingJson.source,
  totalVerses: totalVerses,
  totalChapters: allChapters.length,
  chapters: allChapters.map(c => ({
    number: c.number,
    title: c.title,
    titleSanskrit: c.titleSanskrit,
    verses: c.verses.map(v => ({
      number: v.number,
      sanskrit: v.sanskrit,
      transliteration: v.transliteration,
      translation: v.translation,
      hindi: v.hindi,
      commentary: v.explanation,
      wordMeaning: v.explanation,
      science: v.science,
      lifeLesson: v.lifeLesson,
      keywords: v.keywords
    }))
  }))
};

fs.writeFileSync('public/data/scriptures-full/chandogya.json', JSON.stringify(updatedJson, null, 2), 'utf8');
console.log('Successfully wrote public/data/scriptures-full/chandogya.json!');

// Write to data/scriptures/chandogya.ts
const tsContent = `import { Scripture } from '../types';

export const chandogya: Scripture = {
  id: 'chandogya',
  title: 'Chandogya Upanishad',
  titleSanskrit: 'छान्दोग्योपनिषद्',
  category: 'upanishad',
  description: 'One of the oldest and most extensive Mukhya Upanishads belonging to the Sama Veda (8 Prapathakas, 154 Khandas). Celebrated for the foundational Mahavakya "Tat Tvam Asi" (That Thou Art) taught by Uddalaka Aruni to Shvetaketu, the cosmic proclamation "Sarvam khalvidam Brahma" (All this is Brahman), the profound Dahara Vidya (the inner sky in the heart), and the invincible nature of the vital Prana.',
  totalVerses: ${totalVerses},
  tags: ['Upanishad', 'TatTvamAsi', 'Mahavakya', 'Unity', 'Brahman', 'Udgitha', 'Samaveda', 'DaharaVidya'],
  chapters: ${JSON.stringify(allChapters.map(c => ({
    id: c.id,
    title: c.title,
    titleSanskrit: c.titleSanskrit,
    summary: c.summary,
    verses: c.verses.map(v => ({
      id: v.id,
      number: v.number,
      sanskrit: v.sanskrit,
      transliteration: v.transliteration,
      translation: v.translation,
      hindi: v.hindi,
      explanation: v.explanation,
      science: v.science,
      lifeLesson: v.lifeLesson,
      keywords: v.keywords
    }))
  })), null, 2)}
};
`;

fs.writeFileSync('data/scriptures/chandogya.ts', tsContent, 'utf8');
console.log('Successfully wrote data/scriptures/chandogya.ts!');
