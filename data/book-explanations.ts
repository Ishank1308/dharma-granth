export interface LocalizedText {
  en: string;
  hi: string;
}

export interface BookExplanation {
  overview: LocalizedText;
  focus: LocalizedText;
}

export const bookExplanations: Record<string, BookExplanation> = {
  bhagavadgita: {
    overview: {
      en: "The Bhagavad Gita explains how to act with clarity when duty, fear, and attachment collide. Krishna guides Arjuna toward disciplined action, devotion, and self-knowledge.",
      hi: "भगवद्गीता बताती है कि कर्तव्य, भय और आसक्ति के बीच मनुष्य स्पष्टता से कैसे कर्म करे। कृष्ण अर्जुन को निष्काम कर्म, भक्ति और आत्मज्ञान की ओर ले जाते हैं।",
    },
    focus: {
      en: "Read it as a practical guide to dharma, inner steadiness, and surrender in daily life.",
      hi: "इसे दैनिक जीवन में धर्म, मन की स्थिरता और समर्पण का व्यावहारिक मार्गदर्शक समझकर पढ़ें।",
    },
  },
  ishavasya: {
    overview: {
      en: "The Isha Upanishad teaches that the whole world is pervaded by the Divine. Its central lesson is to live fully, act responsibly, and remain inwardly unattached.",
      hi: "ईशावास्य उपनिषद् सिखाता है कि यह संपूर्ण जगत ईश्वर से व्याप्त है। इसका मुख्य संदेश है कि संसार में रहते हुए कर्तव्य करें, पर भीतर से आसक्त न हों।",
    },
    focus: {
      en: "Read it for the balance between renunciation and active, ethical living.",
      hi: "इसे त्याग और सक्रिय, नैतिक जीवन के संतुलन को समझने के लिए पढ़ें।",
    },
  },
  kena: {
    overview: {
      en: "The Kena Upanishad asks what power stands behind speech, mind, sight, and breath. It points beyond the senses toward Brahman as the hidden source of awareness.",
      hi: "केन उपनिषद् पूछता है कि वाणी, मन, दृष्टि और प्राण के पीछे कौन सी शक्ति कार्य करती है। यह इंद्रियों से परे ब्रह्म को चेतना का गुप्त आधार बताता है।",
    },
    focus: {
      en: "Read it to reflect on humility, knowledge, and the mystery behind perception.",
      hi: "इसे विनम्रता, ज्ञान और अनुभव के पीछे छिपे रहस्य पर चिंतन करने के लिए पढ़ें।",
    },
  },
  katha: {
    overview: {
      en: "The Katha Upanishad follows Nachiketa's dialogue with Yama, the lord of death. It explains the eternal Self and the choice between lasting wisdom and temporary pleasure.",
      hi: "कठ उपनिषद् नचिकेता और यमराज के संवाद के माध्यम से मृत्यु, आत्मा और मुक्ति का रहस्य समझाता है। यह स्थायी ज्ञान और क्षणिक सुख के बीच चयन करना सिखाता है।",
    },
    focus: {
      en: "Read it for courage, discrimination, and the path from fear of death to Self-knowledge.",
      hi: "इसे साहस, विवेक और मृत्यु के भय से आत्मज्ञान तक की यात्रा समझने के लिए पढ़ें।",
    },
  },
  mundaka: {
    overview: {
      en: "The Mundaka Upanishad separates lower knowledge from higher knowledge. It teaches that rituals and learning are incomplete unless they lead to direct knowledge of Brahman.",
      hi: "मुण्डक उपनिषद् अपरा विद्या और परा विद्या में भेद करता है। यह बताता है कि कर्मकांड और अध्ययन तभी पूर्ण होते हैं जब वे ब्रह्मज्ञान तक ले जाएं।",
    },
    focus: {
      en: "Read it to understand spiritual maturity, renunciation, and the search for the imperishable.",
      hi: "इसे आध्यात्मिक परिपक्वता, वैराग्य और अविनाशी सत्य की खोज समझने के लिए पढ़ें।",
    },
  },
  prashna: {
    overview: {
      en: "The Prashna Upanishad is arranged as six sincere questions asked by students to sage Pippalada. It explains prana, creation, meditation, and the inner Self.",
      hi: "प्रश्न उपनिषद् में छह शिष्य ऋषि पिप्पलाद से छह गहरे प्रश्न पूछते हैं। इसमें प्राण, सृष्टि, उपासना और आत्मा का विवेचन है।",
    },
    focus: {
      en: "Read it as a disciplined question-and-answer path into the Upanishadic worldview.",
      hi: "इसे उपनिषदों की दृष्टि में प्रवेश कराने वाली अनुशासित प्रश्नोत्तर यात्रा के रूप में पढ़ें।",
    },
  },
  taittiriya: {
    overview: {
      en: "The Taittiriya Upanishad describes the layers of human experience through the five koshas. It moves from ethics and learning toward the realization of bliss as Brahman.",
      hi: "तैत्तिरीय उपनिषद् पांच कोशों के माध्यम से मनुष्य के अनुभव की परतों को समझाता है। यह शिक्षा, आचरण और आनंदस्वरूप ब्रह्म की अनुभूति तक ले जाता है।",
    },
    focus: {
      en: "Read it for the connection between character, knowledge, and inner bliss.",
      hi: "इसे चरित्र, ज्ञान और आंतरिक आनंद के संबंध को समझने के लिए पढ़ें।",
    },
  },
  chandogya: {
    overview: {
      en: "The Chandogya Upanishad is a vast text of stories, chants, and philosophical teachings. It is famous for 'Tat Tvam Asi', the teaching that the deepest Self is one with ultimate reality.",
      hi: "छान्दोग्य उपनिषद् कथाओं, उपासनाओं और दार्शनिक शिक्षाओं का विशाल ग्रंथ है। इसका प्रसिद्ध वाक्य 'तत्त्वमसि' बताता है कि गहन आत्मा ही परम सत्य से एक है।",
    },
    focus: {
      en: "Read it for symbolic teaching, meditation, and the unity of Self and Brahman.",
      hi: "इसे प्रतीकात्मक शिक्षा, ध्यान और आत्मा-ब्रह्म की एकता समझने के लिए पढ़ें।",
    },
  },
  brihadaranyaka: {
    overview: {
      en: "The Brihadaranyaka Upanishad is one of the most expansive Upanishads. Through dialogues and inquiry, it examines the Self, reality, and the method of negation known as 'neti, neti'.",
      hi: "बृहदारण्यक उपनिषद् सबसे विस्तृत उपनिषदों में से एक है। संवाद और विचार के माध्यम से यह आत्मा, वास्तविकता और 'नेति, नेति' की पद्धति को समझाता है।",
    },
    focus: {
      en: "Read it for deep philosophical inquiry and the search for what cannot be reduced to name or form.",
      hi: "इसे गहन दार्शनिक खोज और नाम-रूप से परे सत्य को समझने के लिए पढ़ें।",
    },
  },
  shvetashvatara: {
    overview: {
      en: "The Shvetashvatara Upanishad gives a devotional and yogic expression to Upanishadic wisdom. It speaks of the Divine as the source, ruler, and inner reality of all.",
      hi: "श्वेताश्वतर उपनिषद् उपनिषदिक ज्ञान को भक्ति और योग की भाषा में प्रस्तुत करता है। यह ईश्वर को जगत का स्रोत, नियंता और अंतर्यामी बताता है।",
    },
    focus: {
      en: "Read it for meditation, devotion, and the personal language of Vedanta.",
      hi: "इसे ध्यान, भक्ति और वेदांत की ईश्वर-केंद्रित भाषा को समझने के लिए पढ़ें।",
    },
  },
  aitareya: {
    overview: {
      en: "The Aitareya Upanishad reflects on creation, birth, and consciousness. It presents awareness as the essential reality by which life and meaning become possible.",
      hi: "ऐतरेय उपनिषद् सृष्टि, जन्म और चेतना पर विचार करता है। यह चेतना को वह मूल सत्य मानता है जिससे जीवन और अर्थ संभव होते हैं।",
    },
    focus: {
      en: "Read it to understand consciousness as the heart of the Upanishadic vision.",
      hi: "इसे उपनिषदों की दृष्टि में चेतना के केंद्रीय महत्व को समझने के लिए पढ़ें।",
    },
  },
  rigveda: {
    overview: {
      en: "The Rig Veda is a collection of ancient hymns addressed to deities and cosmic powers. It preserves early Vedic prayer, poetry, ritual imagination, and wonder before nature.",
      hi: "ऋग्वेद देवताओं और ब्रह्मांडीय शक्तियों को समर्पित प्राचीन सूक्तों का संग्रह है। इसमें वैदिक प्रार्थना, काव्य, यज्ञ-दृष्टि और प्रकृति के प्रति विस्मय सुरक्षित है।",
    },
    focus: {
      en: "Read it for the poetic roots of Vedic spirituality and sacred speech.",
      hi: "इसे वैदिक अध्यात्म और पवित्र वाणी की काव्यात्मक जड़ों को समझने के लिए पढ़ें।",
    },
  },
  yajurveda: {
    overview: {
      en: "The Yajur Veda gives the mantras and prose formulas used in Vedic rituals. It shows how sacred action, offering, and order were understood in ritual life.",
      hi: "यजुर्वेद वैदिक यज्ञों में प्रयुक्त मंत्रों और गद्य सूत्रों का ग्रंथ है। यह दिखाता है कि पवित्र कर्म, अर्पण और व्यवस्था को यज्ञ जीवन में कैसे समझा गया।",
    },
    focus: {
      en: "Read it for the relationship between action, sacrifice, and cosmic order.",
      hi: "इसे कर्म, यज्ञ और ऋत अर्थात् ब्रह्मांडीय व्यवस्था के संबंध को समझने के लिए पढ़ें।",
    },
  },
  samaveda: {
    overview: {
      en: "The Sama Veda transforms Vedic verses into melody and chant. It reveals the musical side of sacred recitation and the role of sound in worship.",
      hi: "सामवेद वैदिक मंत्रों को संगीत और गायन में रूपांतरित करता है। यह पवित्र पाठ के संगीतात्मक पक्ष और उपासना में ध्वनि की भूमिका को प्रकट करता है।",
    },
    focus: {
      en: "Read it for sacred sound, chant, and the devotional power of melody.",
      hi: "इसे पवित्र ध्वनि, सामगान और संगीत की भक्तिपूर्ण शक्ति को समझने के लिए पढ़ें।",
    },
  },
  atharvaveda: {
    overview: {
      en: "The Atharva Veda includes hymns connected with healing, protection, household life, kingship, and spiritual reflection. It brings Vedic thought close to daily human concerns.",
      hi: "अथर्ववेद में आरोग्य, रक्षा, गृहस्थ जीवन, राजधर्म और आध्यात्मिक चिंतन से जुड़े मंत्र मिलते हैं। यह वैदिक विचार को दैनिक जीवन की आवश्यकताओं के निकट लाता है।",
    },
    focus: {
      en: "Read it for the meeting point of spirituality, protection, health, and ordinary life.",
      hi: "इसे अध्यात्म, रक्षा, स्वास्थ्य और सामान्य जीवन के संगम को समझने के लिए पढ़ें।",
    },
  },
  ramayana: {
    overview: {
      en: "The Ramayana presents Rama's life as a model of dharma, courage, loyalty, and restraint. Its story explores family, exile, devotion, justice, and the cost of righteous action.",
      hi: "रामायण श्रीराम के जीवन को धर्म, साहस, निष्ठा और मर्यादा के आदर्श के रूप में प्रस्तुत करती है। इसकी कथा परिवार, वनवास, भक्ति, न्याय और धर्मपालन की कीमत को दिखाती है।",
    },
    focus: {
      en: "Read it for ideals of conduct, devotion, and the struggle to uphold dharma.",
      hi: "इसे आचरण, भक्ति और धर्म की रक्षा के संघर्ष को समझने के लिए पढ़ें।",
    },
  },
  mahabharata: {
    overview: {
      en: "The Mahabharata is a vast epic about family conflict, duty, politics, ethics, and destiny. It asks how dharma can be followed when every choice carries pain.",
      hi: "महाभारत परिवारिक संघर्ष, कर्तव्य, राजनीति, नीति और भाग्य का विशाल महाकाव्य है। यह पूछता है कि जब हर निर्णय पीड़ा से जुड़ा हो, तब धर्म कैसे निभाया जाए।",
    },
    focus: {
      en: "Read it for moral complexity, statecraft, devotion, and the human struggle for justice.",
      hi: "इसे नैतिक जटिलता, राज्यनीति, भक्ति और न्याय के मानवीय संघर्ष को समझने के लिए पढ़ें।",
    },
  },
  ramcharitmanas: {
    overview: {
      en: "Shri Ramcharitmanas retells Rama's story in the devotional voice of Tulsidas. It emphasizes bhakti, humility, service, and the sweetness of Rama's name.",
      hi: "श्रीरामचरितमानस तुलसीदास की भक्तिमय वाणी में रामकथा का पुनर्कथन है। इसमें भक्ति, विनम्रता, सेवा और रामनाम की मधुरता पर विशेष बल है।",
    },
    focus: {
      en: "Read it for accessible devotion, poetic beauty, and the ideal of loving surrender.",
      hi: "इसे सरल भक्ति, काव्य-सौंदर्य और प्रेमपूर्ण समर्पण के आदर्श को समझने के लिए पढ़ें।",
    },
  },
  vishnupurana: {
    overview: {
      en: "The Vishnu Purana explains creation, cosmic cycles, genealogies, and the glory of Vishnu. It presents preservation and divine order as central themes.",
      hi: "विष्णु पुराण सृष्टि, कल्पचक्र, वंशावलियों और भगवान विष्णु की महिमा का वर्णन करता है। इसमें पालन और दिव्य व्यवस्था मुख्य विषय हैं।",
    },
    focus: {
      en: "Read it for Vaishnava cosmology, avatars, and the sustaining power of the Divine.",
      hi: "इसे वैष्णव ब्रह्मांड-विज्ञान, अवतारों और ईश्वर की पालन शक्ति को समझने के लिए पढ़ें।",
    },
  },
  shivpurana: {
    overview: {
      en: "The Shiva Purana celebrates Shiva through mythology, devotion, cosmology, and sacred practices. It presents Shiva as both ascetic stillness and compassionate grace.",
      hi: "शिव पुराण कथा, भक्ति, ब्रह्मांड-विचार और पूजा-विधि के माध्यम से शिव की महिमा बताता है। इसमें शिव तपस्वी शांति और करुणामय अनुग्रह दोनों रूपों में प्रकट होते हैं।",
    },
    focus: {
      en: "Read it for Shaiva devotion, sacred stories, and the meaning of Shiva worship.",
      hi: "इसे शैव भक्ति, पवित्र कथाओं और शिव-उपासना के अर्थ को समझने के लिए पढ़ें।",
    },
  },
  bhagavatapurana: {
    overview: {
      en: "The Bhagavata Purana centers on devotion to Vishnu and Krishna. Its stories teach that loving remembrance of the Divine is a path to liberation.",
      hi: "भागवत पुराण विष्णु और विशेषतः कृष्ण भक्ति पर केंद्रित है। इसकी कथाएं बताती हैं कि ईश्वर का प्रेमपूर्ण स्मरण मुक्ति का मार्ग है।",
    },
    focus: {
      en: "Read it for Krishna bhakti, sacred storytelling, and the theology of loving devotion.",
      hi: "इसे कृष्ण भक्ति, पवित्र कथाओं और प्रेममयी उपासना के दर्शन को समझने के लिए पढ़ें।",
    },
  },
  devibhagavat: {
    overview: {
      en: "The Devi Bhagavata Purana presents the Divine Mother as supreme reality and compassionate power. It develops Shakta devotion through stories, cosmology, and worship.",
      hi: "देवी भागवत पुराण देवी को परम सत्य और करुणामयी शक्ति के रूप में प्रस्तुत करता है। इसमें कथाओं, सृष्टि-विचार और पूजा के माध्यम से शाक्त भक्ति विकसित होती है।",
    },
    focus: {
      en: "Read it for Shakti worship, goddess theology, and the motherly form of divine grace.",
      hi: "इसे शक्ति उपासना, देवी-दर्शन और ईश्वरीय कृपा के मातृरूप को समझने के लिए पढ़ें।",
    },
  },
  garudpurana: {
    overview: {
      en: "The Garuda Purana discusses cosmology, dharma, rituals, death, afterlife, and the journey of the soul. It is often read for reflection on mortality and righteous living.",
      hi: "गरुड़ पुराण सृष्टि, धर्म, संस्कार, मृत्यु, परलोक और जीव की यात्रा पर चर्चा करता है। इसे मृत्यु-स्मरण और धर्ममय जीवन के चिंतन के लिए पढ़ा जाता है।",
    },
    focus: {
      en: "Read it for impermanence, ethics, and the spiritual meaning of death rites.",
      hi: "इसे अनित्यता, नैतिकता और मृत्यु-संस्कारों के आध्यात्मिक अर्थ को समझने के लिए पढ़ें।",
    },
  },
  agnipuran: {
    overview: {
      en: "The Agni Purana is encyclopedic, covering ritual, iconography, politics, grammar, medicine, architecture, and spiritual practice. It shows the wide scope of Puranic knowledge.",
      hi: "अग्नि पुराण एक विश्वकोश जैसा ग्रंथ है, जिसमें पूजा, मूर्ति-विज्ञान, राजनीति, व्याकरण, चिकित्सा, वास्तु और साधना जैसे विषय हैं। यह पुराणों के व्यापक ज्ञान को दिखाता है।",
    },
    focus: {
      en: "Read it for the practical and cultural breadth of Hindu sacred learning.",
      hi: "इसे हिंदू परंपरा के व्यावहारिक और सांस्कृतिक विस्तार को समझने के लिए पढ़ें।",
    },
  },
  padmapuran: {
    overview: {
      en: "The Padma Purana contains narratives on creation, sacred geography, pilgrimage, devotion, and religious practice. It often links spiritual growth with holy places and stories.",
      hi: "पद्म पुराण में सृष्टि, पवित्र भूगोल, तीर्थ, भक्ति और धार्मिक आचरण से जुड़ी कथाएं हैं। यह आध्यात्मिक विकास को तीर्थों और कथाओं से जोड़ता है।",
    },
    focus: {
      en: "Read it for pilgrimage traditions, devotional stories, and sacred geography.",
      hi: "इसे तीर्थ-परंपरा, भक्तिपूर्ण कथाओं और पवित्र भूगोल को समझने के लिए पढ़ें।",
    },
  },
  brahmandpuran: {
    overview: {
      en: "The Brahmanda Purana discusses the cosmic egg, cycles of creation, sacred history, and goddess traditions. It gives a Puranic view of time and universe.",
      hi: "ब्रह्माण्ड पुराण ब्रह्मांड, सृष्टि-चक्र, पवित्र इतिहास और देवी-परंपराओं का वर्णन करता है। यह समय और जगत की पुराणिक दृष्टि देता है।",
    },
    focus: {
      en: "Read it for cosmology, sacred time, and the vast scale of Puranic imagination.",
      hi: "इसे ब्रह्मांड-विचार, पवित्र काल और पुराणों की विराट कल्पना को समझने के लिए पढ़ें।",
    },
  },
  markandeypuran: {
    overview: {
      en: "The Markandeya Purana includes many teachings and is especially known for the Devi Mahatmyam. It celebrates the Divine Mother as the power that protects and restores balance.",
      hi: "मार्कण्डेय पुराण अनेक शिक्षाओं वाला ग्रंथ है और विशेष रूप से देवी महात्म्य के लिए प्रसिद्ध है। यह देवी को रक्षा और संतुलन पुनर्स्थापित करने वाली शक्ति के रूप में प्रस्तुत करता है।",
    },
    focus: {
      en: "Read it for Devi devotion, courage, and the victory of sacred power over disorder.",
      hi: "इसे देवी भक्ति, साहस और अधर्म पर दिव्य शक्ति की विजय को समझने के लिए पढ़ें।",
    },
  },
  manusmriti: {
    overview: {
      en: "Manusmriti is an ancient dharma and legal text describing duties, conduct, social norms, and law. It should be read historically, with attention to context, ethics, and later debate.",
      hi: "मनुस्मृति प्राचीन धर्म और विधि से जुड़ा ग्रंथ है, जिसमें कर्तव्य, आचरण, सामाजिक नियम और कानून का वर्णन है। इसे इतिहास, संदर्भ, नैतिक विवेक और बाद की चर्चाओं को ध्यान में रखकर पढ़ना चाहिए।",
    },
    focus: {
      en: "Read it as a historical source for dharma discourse, not as a simple modern rulebook.",
      hi: "इसे धर्म-विमर्श के ऐतिहासिक स्रोत के रूप में पढ़ें, आधुनिक जीवन के सीधे नियम-पुस्तक की तरह नहीं।",
    },
  },
  vivekchudamani: {
    overview: {
      en: "Vivekachudamani teaches Advaita Vedanta through discrimination between the real Self and the changing world. It emphasizes inquiry, detachment, discipline, and liberation.",
      hi: "विवेकचूडामणि अद्वैत वेदांत को आत्मा और बदलते संसार के विवेक के माध्यम से समझाता है। इसमें आत्मचिंतन, वैराग्य, अनुशासन और मुक्ति पर बल है।",
    },
    focus: {
      en: "Read it for self-inquiry and the disciplined path toward non-dual realization.",
      hi: "इसे आत्म-विचार और अद्वैत अनुभूति की अनुशासित साधना समझने के लिए पढ़ें।",
    },
  },
  brahmasutra: {
    overview: {
      en: "The Brahma Sutra systematizes Vedanta in compact aphorisms. It interprets the Upanishads and becomes the foundation for major Vedantic commentarial traditions.",
      hi: "ब्रह्मसूत्र संक्षिप्त सूत्रों में वेदांत को व्यवस्थित करता है। यह उपनिषदों की व्याख्या करता है और प्रमुख वेदांत भाष्य-परंपराओं का आधार बनता है।",
    },
    focus: {
      en: "Read it for rigorous Vedantic reasoning and the structure behind later philosophy.",
      hi: "इसे वेदांत के कठोर तर्क और बाद के दर्शन की आधार-रचना को समझने के लिए पढ़ें।",
    },
  },
  durgasaptashati: {
    overview: {
      en: "Durga Saptashati, also called Devi Mahatmyam, praises the Goddess as the force that defeats chaos and protects the world. It is central to many Shakta traditions.",
      hi: "दुर्गा सप्तशती, जिसे देवी महात्म्य भी कहते हैं, देवी को अव्यवस्था का नाश करने और जगत की रक्षा करने वाली शक्ति के रूप में स्तुति करती है। यह शाक्त परंपराओं में अत्यंत महत्वपूर्ण है।",
    },
    focus: {
      en: "Read it for devotion to Durga, spiritual courage, and the symbolism of inner victory.",
      hi: "इसे दुर्गा भक्ति, आध्यात्मिक साहस और भीतर की विजय के प्रतीक को समझने के लिए पढ़ें।",
    },
  },
  yogavasishtha: {
    overview: {
      en: "Yoga Vasishtha presents a long dialogue between Rama and sage Vasishtha. Through stories and Advaita teaching, it examines mind, illusion, freedom, and the nature of reality.",
      hi: "योगवासिष्ठ राम और ऋषि वसिष्ठ के विस्तृत संवाद के रूप में है। कथाओं और अद्वैत शिक्षा के माध्यम से यह मन, माया, स्वतंत्रता और वास्तविकता की प्रकृति को समझाता है।",
    },
    focus: {
      en: "Read it for contemplative stories and a deep exploration of mind and liberation.",
      hi: "इसे मन, मुक्ति और चिंतनपूर्ण कथाओं की गहराई को समझने के लिए पढ़ें।",
    },
  },
  mandukya: {
    overview: {
      en: "The Mandukya Upanishad examines the sacred syllable Om (AUM) and the four states of consciousness: waking (Vaishvanara), dreaming (Taijasa), deep sleep (Prajna), and the transcendent Self (Turiya).",
      hi: "माण्डूक्य उपनिषद् ओंकार (ॐ) की चार मात्राओं और चेतना की चार अवस्थाओं—जाग्रत, स्वप्न, सुषुप्ति और तुरीय (परम शुद्ध चेतना)—का अत्यंत संक्षिप्त किंतु गहन निरूपण करता है।",
    },
    focus: {
      en: "Read it for meditation on Om and the direct inquiry into consciousness beyond waking perception.",
      hi: "इसे ओंकार की साधना और जाग्रत अवस्था से परे आत्मचेतना के अनुभव के लिए पढ़ें।",
    },
  },
  kaushitaki: {
    overview: {
      en: "The Kaushitaki Upanishad explores the journey of the soul after death, the identity of Prana and Prajna (life and consciousness) with Brahman, and the deeper meaning of sacrifice.",
      hi: "कौषीतकी उपनिषद् मृत्यु के उपरांत जीवात्मा की गति, प्राण और प्रज्ञा की एकता तथा ब्रह्म के स्वरूप का विवेचन प्रस्तुत करता है।",
    },
    focus: {
      en: "Read it for early Vedantic reflections on life-force, the path of the gods (Devayana), and inner awareness.",
      hi: "इसे प्राणशक्ति, मरणोपरांत यात्रा और चैतन्य की एकता को समझने के लिए पढ़ें।",
    },
  },
  maitri: {
    overview: {
      en: "The Maitri Upanishad addresses existential suffering, the transitory nature of worldly life, and the six-limbed yoga as the method for realizing the supreme radiant Self.",
      hi: "मैत्री उपनिषद् संसार के नश्वर स्वरूप और जीवन के दुःखों का विश्लेषण करते हुए षडंग योग और आत्मज्ञान को परम शरण बताता है।",
    },
    focus: {
      en: "Read it for the synthesis of Upanishadic metaphysics, samkhya cosmology, and yogic meditation.",
      hi: "इसे उपनिषदिक चिंतन और योग साधना के सामंजस्य को समझने के लिए पढ़ें।",
    },
  },
  mahanarayana: {
    overview: {
      en: "The Mahanarayana Upanishad offers sublime Vedic prayers and hymns, celebrating Narayana as the cosmic reality, the light shining in the lotus of the heart, and renunciation (nyasa) as the highest virtue.",
      hi: "महानारायण उपनिषद् परम सत्य नारायण की स्तुति, हृदय-गुहा में स्थित परमात्मा के ध्यान और संन्यास के महत्त्व का प्रतिपादन करता है।",
    },
    focus: {
      en: "Read it for devotional contemplation, universal peace chants, and the spiritual crown of the Taittiriya tradition.",
      hi: "इसे भक्तिपरक ध्यान, सार्वभौमिक प्रार्थनाओं और संन्यास-धर्म के लिए पढ़ें।",
    },
  },
  mahaupanishad: {
    overview: {
      en: "The Maha Upanishad is famed for the universal proclamation 'Vasudhaiva Kutumbakam' (the world is one family) and its profound discourse between Shukadeva and Janaka on living liberated in this world (Jivanmukti).",
      hi: "महा उपनिषद् 'वसुधैव कुटुम्बकम्' (संपूर्ण पृथ्वी एक परिवार है) के अमर संदेश और शुकदेव-जनक संवाद द्वारा जीवनमुक्ति की शांत, अनासक्त स्थिति का प्रतिपादन करता है।",
    },
    focus: {
      en: "Read it for the vision of universal brotherhood, mental freedom, and peaceful detachment from anxieties.",
      hi: "इसे विश्वबंधुत्व, मन की समता और जीवनमुक्ति की दृष्टि समझने के लिए पढ़ें।",
    },
  },
  kaivalya: {
    overview: {
      en: "The Kaivalya Upanishad outlines the path to absolute spiritual freedom (Kaivalya) through faith, devotion, and meditation on the non-dual Shiva-Brahman seated within the cave of the heart.",
      hi: "कैवल्य उपनिषद् श्रद्धा, भक्ति, ध्यान और आत्म-साक्षात्कार द्वारा परम कैवल्य (मोक्ष) की प्राप्ति का सरल और स्पष्ट मार्ग दिखाता है।",
    },
    focus: {
      en: "Read it for direct contemplation on the inner witness (Sakshi) and liberation from the cycle of bondage.",
      hi: "इसे ध्यान, वैराग्य और साक्षी चेतना के साक्षात्कार के साधन के रूप में पढ़ें।",
    },
  },
  amritabindu: {
    overview: {
      en: "The Amritabindu Upanishad reveals that the mind is the sole cause of both bondage and liberation. By purifying and dissolving the wandering mind in the heart, one attains immortal Brahman.",
      hi: "अमृतबिन्दु उपनिषद् सिखाता है कि मन ही मनुष्य के बंधन और मोक्ष का कारण है। मन के निग्रह और शुद्धि से अमर ब्रह्म की अनुभूति होती है।",
    },
    focus: {
      en: "Read it for psychological clarity, mastery over thoughts, and the essence of non-dual realization.",
      hi: "इसे मानसिक शुद्धि, मन के अनुशासन और अद्वैत ज्ञान के सार को समझने के लिए पढ़ें।",
    },
  },
  tejobindu: {
    overview: {
      en: "The Tejobindu Upanishad is an advanced text of radical non-duality and fifteen-limbed yoga, guiding the seeker into the radiant point of pure consciousness (Tejobindu).",
      hi: "तेजोबिन्दु उपनिषद् पंद्रह अंगों वाले गहन योग और अखंड अद्वैत ज्ञान द्वारा परम तेजोमय आत्मस्वरूप के साक्षात्कार का मार्ग प्रशस्त करता है।",
    },
    focus: {
      en: "Read it for fearless non-dual inquiry and meditation upon the luminous nature of pure awareness.",
      hi: "इसे परम तेजोमय चैतन्य के ध्यान और अद्वैत वेदांत के गंभीर चिंतन के लिए पढ़ें।",
    },
  },
  jabala: {
    overview: {
      en: "The Jabala Upanishad is a classical text on renunciation (Sannyasa) and sacred geography, explaining that the true Varanasi (Avimukta) is the meeting point of the eyebrows in one's own awareness.",
      hi: "जाबाल उपनिषद् काशी (अविमुक्त क्षेत्र) की आंतरिक महिमा, संन्यास आश्रम और भीतर स्थित शाश्वत तीर्थ के दर्शन का उपदेश देता है।",
    },
    focus: {
      en: "Read it to understand ascetic detachment, inner pilgrimage, and the timeless call of renunciation.",
      hi: "इसे संन्यास के आदर्श और अंतर-तीर्थ की पवित्रता को समझने के लिए पढ़ें।",
    },
  },
  niralamba: {
    overview: {
      en: "The Niralamba Upanishad poses essential spiritual questions—defining Brahman, Ishvara, Jiva, Prakriti, Samsara, and Moksha with concise, rigorous clarity.",
      hi: "निरालम्ब उपनिषद् ब्रह्म, ईश्वर, जीव, प्रकृति, संसार और मोक्ष जैसी मूलभूत आध्यात्मिक संकल्पनाओं की सीधी और स्पष्ट परिभाषाएं देता है।",
    },
    focus: {
      en: "Read it as a foundational philosophical dictionary of Hindu spiritual terminology.",
      hi: "इसे भारतीय दर्शन के मूलभूत सिद्धांतों को सरलता से समझने के लिए पढ़ें।",
    },
  },
  muktika: {
    overview: {
      en: "The Muktika Upanishad contains Lord Rama's teaching to Hanuman regarding the canon of the 108 Upanishads, the four stages of Mukti, and the power of self-knowledge.",
      hi: "मुक्तिका उपनिषद् श्रीराम द्वारा हनुमान जी को दिए गए उपदेश में १०८ उपनिषदों की प्रामाणिक सूची और मोक्ष के स्वरूप का वर्णन करता है।",
    },
    focus: {
      en: "Read it for the traditional canon of Upanishadic literature and the direct path to liberation.",
      hi: "इसे १०८ उपनिषदों की पारंपरिक सूची और आत्मज्ञान से मुक्ति का मार्ग समझने के लिए पढ़ें।",
    },
  },
  naradapuran: {
    overview: {
      en: "The Narada Purana is one of the eighteen Mahapuranas, narrated by sage Narada. It celebrates the nine forms of devotion (Navavidha Bhakti), sacred singing (nama-sankirtana), and the Gandharva Veda.",
      hi: "नारदपुराण १८ महापुराणों में से एक है, जिसमें देवर्षि नारद द्वारा नवविधा भक्ति, नाम-संकीर्तन, गंधर्व वेद (पवित्र संगीत) और धर्ममय जीवन का विस्तार से प्रतिपादन किया गया है।",
    },
    focus: {
      en: "Read it for the devotional path of divine love, sacred music, and the spiritual sanctification of daily life.",
      hi: "इसे भक्ति-योग, संकीर्तन और भगवन्नाम के प्रभाव को समझने के लिए पढ़ें।",
    },
  },
};

export function getBookExplanation(id: string): BookExplanation | undefined {
  return bookExplanations[id];
}
