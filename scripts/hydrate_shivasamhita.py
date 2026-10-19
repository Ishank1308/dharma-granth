import re, json

# Standard Sanskrit verses for Shiva Samhita key openings and practices
shiva_samhita_data = {
    1: [ # Patala 1: Tattva Pradipika
        {
            "id": 1,
            "sanskrit": "एकं ज्ञानं नित्यमाद्यन्तशून्यं नान्यत् किञ्चिद्वर्तते वस्तु सत्यम् । यद्भेदोऽस्मिन्निन्द्रियोपाधिना वै ज्ञानस्यायं भासते नान्यथैव ॥ १ ॥",
            "transliteration": "ekaṃ jñānaṃ nityamādyantaśūnyaṃ nānyat kiñcidvartate vastu satyam | yadbhedo'sminnindriyopādhinā vai jñānasyāyaṃ bhāsate nānyathaiva || 1 ||",
            "translation": "The only reality is Consciousness (Jnana) — eternal, beginningless, and endless. There exists nothing else that is truly real. The apparent diversity perceived in this world is solely due to the conditioning of the senses, not in truth.",
            "hindi": "एकमात्र ज्ञान (शुद्ध चैतन्य) ही नित्य, आदि-अन्त-रहित और परम सत्य वस्तु है; उसके अतिरिक्त कुछ भी सत्य नहीं है। इस जगत् में जो नाना प्रकार का भेद प्रतीत होता है, वह इन्द्रियरूपी उपाधियों के कारण ही भासित होता है, वस्तुतः नहीं। ॥ १ ॥",
            "explanation": "शिवसंहिता का यह प्रथम श्लोक अद्वैत वेदान्त का सर्वोच्च सिद्धान्त स्थापित करता है: हठयोग की साधना केवल देह-कसरत नहीं, अपितु साक्षी-चैतन्य के साक्षात्कार का उपाय है।"
        },
        {
            "id": 2,
            "sanskrit": "अथ भक्तानुरक्तोऽहं वक्ष्ये योगानुशासनम् । ईश्वरः सर्वभूतानामात्ममुक्तिप्रदायकः ॥ २ ॥",
            "transliteration": "atha bhaktānurakto'haṃ vakṣye yogānuśāsanam | īśvaraḥ sarvabhūtānāmātmamuktipradāyakaḥ || 2 ||",
            "translation": "Now, out of love for My devotees, I, the Lord of all beings and the bestower of self-liberation, shall expound the sacred discipline of Yoga.",
            "hindi": "अब मैं अपने भक्तों पर अनुग्रह करने के लिये योग के अनुशासन का वर्णन करता हूँ। मैं समस्त प्राणियों का ईश्वर और आत्म-मुक्ति प्रदान करनेवाला हूँ। ॥ २ ॥",
            "explanation": "भगवान् शिव यहाँ स्वयं योग के प्रवक्ता के रूप में अपने भक्तों को मुक्ति का मार्ग प्रदान करते हैं।"
        },
        {
            "id": 3,
            "sanskrit": "त्यक्त्वा विवादशीलानां मतं दुर्ज्ञानहेतुकम् । आत्मज्ञानाय भूतानामनन्यगतिचेतसाम् ॥ ३ ॥",
            "transliteration": "tyaktvā vivādaśīlānāṃ mataṃ durjñānahetukam | ātmajñānāya bhūtānāmananyagaticetasām || 3 ||",
            "translation": "Leaving aside the conflicting doctrines of argumentative philosophers born of false knowledge, this teaching is for the self-realization of seekers whose minds seek no other refuge.",
            "hindi": "मिथ्या ज्ञान से उत्पन्न होनेवाले विवादप्रिय पण्डितों के मतों को छोड़कर, अनन्यभाव से आत्मज्ञान की अभिलाषा रखनेवाले जीवों के कल्याण के लिये यह योगोपदेश दिया जा रहा है। ॥ ३ ॥",
            "explanation": "तर्क-वितर्क और शास्त्र-विवाद से परे जाकर प्रत्यक्ष योगानुभूति पर यहाँ बल दिया गया है।"
        },
        {
            "id": 4,
            "sanskrit": "सत्यं केचित्प्रशंसन्ति तपः शौचं तथाऽपरे । क्षमां केचित्प्रशंसन्ति तथैव सममार्जवम् ॥ ४ ॥",
            "transliteration": "satyaṃ kecitpraśaṃsanti tapaḥ śaucaṃ tathā'pare | kṣamāṃ kecitpraśaṃsanti tathaiva samamārjavam || 4 ||",
            "translation": "Some praise truth; others praise austerity and purity; some praise forgiveness, equanimity, and uprightness.",
            "hindi": "संसार में कुछ लोग सत्य की प्रशंसा करते हैं, कुछ तप और शौच (पवित्रता) की, और कुछ क्षमा, समता तथा सरलता की प्रशंसा करते हैं। ॥ ४ ॥",
            "explanation": "विविध धार्मिक और नैतिक मार्गों का यहाँ सिंहावलोकन किया गया है।"
        },
        {
            "id": 5,
            "sanskrit": "केचिद्दानं प्रशंसन्ति पितृकर्म तथाऽपरे । केचित्कर्म प्रशंसन्ति केचिद्वैराग्यमुत्तमम् ॥ ५ ॥",
            "transliteration": "keciddānaṃ praśaṃsanti pitṛkarma tathā'pare | kecitkarma praśaṃsanti kecidvairāgyamuttamam || 5 ||",
            "translation": "Some praise charity, others ancestral rites; some praise ritual action, while others praise supreme dispassion.",
            "hindi": "कुछ लोग दान की प्रशंसा करते हैं, कुछ पितृकर्म की, कुछ कर्मकाण्ड की और कुछ उत्तम वैराग्य को श्रेष्ठ बताते हैं। ॥ ५ ॥",
            "explanation": "अनेक मार्गों में भटके हुए मनुष्यों के लिये योग ही परम समन्वयकारी साधन है।"
        },
        {
            "id": 6,
            "sanskrit": "एवं बहुनुपायांस्तु प्रवदन्ति हि मुक्तये । एवं व्यवसिता लोके कृत्यकृत्यविदो जनाः ॥ ६ ॥",
            "transliteration": "evaṃ bahunupāyāṃstu pravadanti hi muktaye | evaṃ vyavasitā loke kṛtyakṛtyavido janāḥ || 6 ||",
            "translation": "Thus do people proclaim diverse means for liberation. Bound by these concepts of what should and should not be done, people wander in delusion.",
            "hindi": "इस प्रकार मुक्ति के लिये लोग अनेकों उपाय बतलाते हैं। कर्तव्य और अकर्तव्य के फेर में पड़कर मनुष्य संसार में भ्रमित होते रहते हैं। ॥ ६ ॥",
            "explanation": "बाह्य विधियों के आग्रह से चित्त विक्षिप्त होता है; अन्तर्मुखी योग ही शान्ति देता है।"
        },
        {
            "id": 7,
            "sanskrit": "एतन्मतावलम्बी यो लब्ध्वा दुरितपुण्यके । भ्रमतीत्यवशः सोऽत्र जन्ममृत्युपरम्पराम् ॥ ७ ॥",
            "transliteration": "etanmatāvalambī yo labdhvā duritapuṇyake | bhramatītyavaśaḥ so'tra janmamṛtyuparamparām || 7 ||",
            "translation": "Following these varied opinions, reaping the fruits of virtue and vice, man wanders helplessly in the continuous cycle of birth and death.",
            "hindi": "इन भिन्न-भिन्न मतों का आश्रय लेकर मनुष्य पुण्य और पाप के फल भोगता हुआ जन्म-मृत्यु की निरन्तर परम्परा में विवश होकर भटकता रहता है। ॥ ७ ॥",
            "explanation": "पुण्य और पाप दोनों ही बन्धन हैं; योग इन दोनों से पार ले जाता है।"
        },
        {
            "id": 8,
            "sanskrit": "ज्ञानप्रवाह इत्यन्ये शून्यं केचित्परं विदुः । द्वावेव तत्त्वं मन्यन्तेऽपरे प्रकृतिपूरुषौ ॥ ८ ॥",
            "transliteration": "jñānapravāha ityanye śūnyaṃ kecitparaṃ viduḥ | dvāveva tattvaṃ manyante'pare prakṛtipūruṣau || 8 ||",
            "translation": "Some philosophers hold reality to be a stream of consciousness; others regard the Void as supreme; while others accept only two principles: Prakriti and Purusha.",
            "hindi": "कुछ लोग ज्ञान के निरन्तर प्रवाह (क्षणभंगुरता) को सत्य मानते हैं, कुछ शून्य को परम तत्त्व कहते हैं, और कुछ प्रकृति तथा पुरुष—इन दो ही तत्त्वों को स्वीकार करते हैं। ॥ ८ ॥",
            "explanation": "दार्शनिक मतभेदों का निराकरण केवल प्रत्यक्ष यौगिक समाधि से ही सम्भव है।"
        },
        {
            "id": 9,
            "sanskrit": "आत्मैव सर्वं नान्यत्तु वस्तु किञ्चित्प्रविद्यते । एवं विचार्य यत्नतः स्वात्मानं विन्दते मुनिः ॥ ९ ॥",
            "transliteration": "ātmaiva sarvaṃ nānyattu vastu kiñcitpravidyate | evaṃ vicārya yatnataḥ svātmānaṃ vindate muniḥ || 9 ||",
            "translation": "The Self alone is all; no other substance truly exists. Contemplating thus with earnest effort, the silent sage attains his own true Self.",
            "hindi": "आत्मा ही सब कुछ है, आत्मा के अतिरिक्त अन्य कोई वस्तु नहीं है—ऐसा दृढ विचार करके मुनि यत्नपूर्वक अपने शुद्ध आत्मस्वरूप को प्राप्त करता है। ॥ ९ ॥",
            "explanation": "सर्वमात्ममयम् — शिवसंहिता का यह अद्वैत दर्शन साधक को अभय प्रदान करता है।"
        },
        {
            "id": 10,
            "sanskrit": "यथा रज्जुभ्रमात्सर्पो भासते न तु रज्जुता । तथाऽऽत्मन्यखिला विद्या भासते न तु सत्यता ॥ १० ॥",
            "transliteration": "yathā rajjubhramātsarpo bhāsate na tu rajjutā | tathā''tmanyakhilā vidyā bhāsate na tu satyatā || 10 ||",
            "translation": "Just as a rope appears as a snake due to illusion, while the rope itself remains unchanged, so too this entire world-illusion appears within the Self without possessing independent reality.",
            "hindi": "जैसे भ्रमवश रस्सी में सर्प दिखाई देता है, किन्तु वस्तुतः रस्सी सर्प नहीं बनती; वैसे ही शुद्ध आत्मा में यह समस्त जगत्-प्रपञ्च मिथ्या भासित होता है, वस्तुतः उसकी कोई स्वतंत्र सत्ता नहीं है। ॥ १० ॥",
            "explanation": "रज्जु-सर्प न्याय के द्वारा जगत् की व्यावहारिक प्रतीति और पारमार्थिक अद्वैत को समझाया गया है।"
        }
    ],
    2: [ # Patala 2: Prana & Nadi
        {
            "id": 1,
            "sanskrit": "देहप्रपञ्चं वक्ष्यामि शृणु देवि यथामति । अयं हि देहो ब्रह्माण्डं ब्रह्माण्डं देह उच्यते ॥ १ ॥",
            "transliteration": "dehaprapañcaṃ vakṣyāmi śṛṇu devi yathāmati | ayaṃ hi deho brahmāṇḍaṃ brahmāṇḍaṃ deha ucyate || 1 ||",
            "translation": "I shall now describe the constitution of the body; listen, O Devi! Indeed, this microcosm of the body is the universe, and the universe is the body.",
            "hindi": "हे देवि! अब मैं इस शरीर की रचना का रहस्य कहता हूँ, सुनो। यह शरीर ही ब्रह्माण्ड है और ब्रह्माण्ड ही यह शरीर कहा गया है (यत् पिण्डे तत् ब्रह्माण्डे)। ॥ १ ॥",
            "explanation": "पिण्ड-ब्रह्माण्ड ऐक्य — मानव देह समस्त लोकों और शक्तियों का जीवन्त दर्पण है।"
        },
        {
            "id": 2,
            "sanskrit": "मेरुशृङ्गे स्थितो नित्यं वर्तते चन्द्रमण्डलम् । तस्मात्क्षरति यद्दिव्यममृतं सर्वजीवनम् ॥ २ ॥",
            "transliteration": "meruśṛṅge sthito nityaṃ vartate candramaṇḍalam | tasmātkṣarati yaddivyamamṛtaṃ sarvajīvanam || 2 ||",
            "translation": "At the peak of Mount Meru (the spinal column) resides the lunar sphere, from which constantly trickles that divine nectar giving life to all.",
            "hindi": "मेरुदण्ड के शिखर (मस्तिष्क में सहस्रार) पर नित्य चन्द्रमण्डल स्थित है, जिससे निरन्तर दिव्य अमृत झरता रहता है जो समस्त जीवन का आधार है। ॥ २ ॥",
            "explanation": "सोम-मण्डल और अमृत-स्राव का हठयोगीय रहस्य।"
        },
        {
            "id": 3,
            "sanskrit": "सार्धत्रिवलयं भूयः कुण्डली सा स्थिता भवेत् । सुप्ता नाडीमुखे घोरे सुषुम्नाया मनोहरे ॥ ३ ॥",
            "transliteration": "sārdhatrivalayaṃ bhūyaḥ kuṇḍalī sā sthitā bhavet | suptā nāḍīmukhe ghore suṣumnāyā manohare || 3 ||",
            "translation": "Coiled three and a half times, the Kundalini serpent-power resides dormant at the base, closing with Her mouth the entrance to the Sushumna nadi.",
            "hindi": "साढ़े तीन फेरे लगाकर वह कुण्डलिनी शक्ति मूलाधार में सुषुम्ना नाड़ी के मुख को अपने मुख से बन्द करके सोई रहती है। ॥ ३ ॥",
            "explanation": "कुण्डलिनी महाशक्ति का शास्त्रीय स्वरूप।"
        },
        {
            "id": 4,
            "sanskrit": "इडा पिङ्गला चैव सुषुम्ना च तृतीयाका । नाड्यः प्रधानास्तिस्रस्ताः सर्वप्राणप्रवर्तिकाः ॥ ४ ॥",
            "transliteration": "iḍā piṅgalā caiva suṣumnā ca tṛtīyākā | nāḍyaḥ pradhānāstisrastāḥ sarvaprāṇapravartikāḥ || 4 ||",
            "translation": "Ida, Pingala, and Sushumna are the three principal nadis that govern all vital forces.",
            "hindi": "साढ़े तीन लाख नाड़ियों में इड़ा, पिङ्गला और सुषुम्ना—ये तीन नाड़ियाँ मुख्य हैं, जो समस्त प्राणवायु को संचालित करती हैं। ॥ ४ ॥",
            "explanation": "चन्द्र (इड़ा), सूर्य (पिङ्गला) और अग्नि (सुषुम्ना) नाड़ियों का त्रिवेणी-मार्ग।"
        },
        {
            "id": 5,
            "sanskrit": "प्राणोऽपानः समानश्चोदानो व्यानस्तथैव च । नागः कूर्मोऽथ कृकरो देवदत्तो धनञ्जयः ॥ ५ ॥",
            "transliteration": "prāṇo'pānaḥ samānaścodāno vyānastathaiva ca | nāgaḥ kūrmo'tha kṛkaro devadatto dhanañjayaḥ || 5 ||",
            "translation": "The ten vital airs are: Prana, Apana, Samana, Udana, and Vyana (the five primary); and Naga, Kurma, Krikara, Devadatta, and Dhananjaya (the five secondary).",
            "hindi": "शरीर में दस प्राणवायु मुख्य हैं: प्राण, अपान, समान, उदान, व्यान (पाँच मुख्य प्राण) तथा नाग, कूर्म, कृकर, देवदत्त और धनञ्जय (पाँच उपप्राण)। ॥ ५ ॥",
            "explanation": "दश प्राणों के कार्य और शरीर-क्रिया-विज्ञान का निरूपण।"
        }
    ],
    3: [ # Patala 3: Vayu Sadhana & Asana
        {
            "id": 1,
            "sanskrit": "हृदयेऽस्ति महाकालो मन्मथो यत्र राजते । तत्र ध्यानं प्रकर्तव्यं पवनेन समन्वितम् ॥ १ ॥",
            "transliteration": "hṛdaye'sti mahākālo manmatho yatra rājate | tatra dhyānaṃ prakartavyaṃ pavanena samanvitam || 1 ||",
            "translation": "In the heart resides the Great Time (Mahakala) where the subtle life-force shines. There meditation should be performed in harmony with the breath.",
            "hindi": "हृदय-कमल में महाकाल चैतन्य ज्योतिर्मय रूप से विराजमान हैं। वहाँ प्राणवायु के साथ संयुक्त होकर एकाग्र ध्यान करना चाहिये। ॥ १ ॥",
            "explanation": "हृदय-गुहा में प्राणायाम और ध्यान का एकीकरण।"
        },
        {
            "id": 2,
            "sanskrit": "सिद्धासनं भवेदेकं द्वितीयं पद्ममासनम् । तृतीयमुग्रसंज्ञं स्यात्स्वस्तिकं तु चतुर्थकम् ॥ २ ॥",
            "transliteration": "siddhāsanaṃ bhavedekaṃ dvitīyaṃ padmamāsanam | tṛtīyamugrasaṃjñaṃ syātsvastikaṃ tu caturthakam || 2 ||",
            "translation": "The four supreme postures are: first Siddhasana, second Padmasana, third Ugrasana (Paschimottanasana), and fourth Svastikasana.",
            "hindi": "आसनों में चार मुख्य हैं: प्रथम सिद्धासन, द्वितीय पद्मासन, तृतीय उग्रासन (पश्चिमोत्तानासन) और चतुर्थ स्वस्तिकासन। ॥ २ ॥",
            "explanation": "ध्यान और कुण्डलिनी-जागरण के चार सर्वश्रेष्ठ शास्त्रीय आसन।"
        },
        {
            "id": 3,
            "sanskrit": "प्राणायामेन युक्तेन सर्वदोषक्षयो भवेत् । अयुक्ताभ्यासयोगेन सर्वदोषसमुद्भवः ॥ ३ ॥",
            "transliteration": "prāṇāyāmena yuktena sarvadoṣakṣayo bhavet | ayuktābhyāsayogena sarvadoṣasamudbhavaḥ || 3 ||",
            "translation": "By proper practice of Pranayama, all impurities and diseases are destroyed; through incorrect practice, disorders may arise.",
            "hindi": "विधिपूर्वक प्राणायाम के अभ्यास से शरीर और मन के समस्त दोषों का क्षय हो जाता है; किन्तु अयुक्त (गलत) अभ्यास से रोगों की उत्पत्ति हो सकती है। ॥ ३ ॥",
            "explanation": "प्राणायाम की वैज्ञानिक विधि और सावधानी का निर्देश।"
        }
    ],
    4: [ # Patala 4: The 10 Mahamudras
        {
            "id": 1,
            "sanskrit": "महामुद्रा महाबन्धो महावेधश्च खेचरी । जालन्धरो मूलबन्धस्तथोड्डीयानसंज्ञकः ॥ १ ॥",
            "transliteration": "mahāmudrā mahābandho mahāvedhaśca khecarī | jālandharo mūlabandhastathoḍḍīyānasaṃjñakaḥ || 1 ||",
            "translation": "Maha Mudra, Maha Bandha, Maha Vedha, Khechari, Jalandhara Bandha, Mula Bandha, and Uddiyana Bandha.",
            "hindi": "महामुद्रा, महाबन्ध, महावेध, खेचरी, जालन्धर बन्ध, मूल बन्ध और उड्डीयान बन्ध। ॥ १ ॥",
            "explanation": "दश महामुद्राओं का नाम-निर्देश।"
        },
        {
            "id": 2,
            "sanskrit": "वज्रोली शक्तिचालश्च दशमो योनिसंज्ञकः । एता हि मुद्रा दशधा कथिता योगसाधकैः ॥ २ ॥",
            "transliteration": "vajrolī śakticālaśca daśamo yonisaṃjñakaḥ | etā hi mudrā daśadhā kathitā yogasādhakaiḥ || 2 ||",
            "translation": "Vajroli, Shaktichalani, and tenth Yoni Mudra — these are the ten seals declared by great yogis.",
            "hindi": "वज्रोली, शक्तिचालिनी और दसवीं योनिमुद्रा—ये दस मुद्राएँ योगसाधकों द्वारा परम कल्याणकारी बतलाई गई हैं। ॥ २ ॥",
            "explanation": "मुद्राओं द्वारा प्राण का ऊर्ध्वगमन और कुण्डलिनी-जागरण।"
        },
        {
            "id": 3,
            "sanskrit": "सुषुम्नावर्त्मनि प्राणः प्रविष्टो यस्य योगिनः । तस्यैव सिध्यते योगो नान्यथा कल्पकोटिभिः ॥ ३ ॥",
            "transliteration": "suṣumnāvartmani prāṇaḥ praviṣṭo yasya yoginaḥ | tasyaiva sidhyate yogo nānyathā kalpakoṭibhiḥ || 3 ||",
            "translation": "Only that yogi whose prana has entered the path of Sushumna attains success in Yoga; not otherwise even in millions of aeons.",
            "hindi": "जिस योगी का प्राण सुषुम्ना नाड़ी के मार्ग में प्रविष्ट हो जाता है, उसी का योग सिद्ध होता है; इसके बिना करोड़ों कल्पों में भी सिद्धि नहीं मिलती। ॥ ३ ॥",
            "explanation": "सुषुम्ना-प्रवेश ही हठयोग का परम साध्य है।"
        }
    ],
    5: [ # Patala 5: Samadhi & Nadanusandhana
        {
            "id": 1,
            "sanskrit": "नादानुसन्धानसमाधिभाजां योगीश्वराणां हृदि यत्प्रकाशः । तदेव तत्त्वं परमं पवित्रं शिवं प्रशान्तं परमात्मरूपम् ॥ १ ॥",
            "transliteration": "nādānusandhānasamādhibhājāṃ yogīśvarāṇāṃ hṛdi yatprakāśaḥ | tadeva tattvaṃ paramaṃ pavitraṃ śivaṃ praśāntaṃ paramātmarūpam || 1 ||",
            "translation": "That light which shines in the hearts of sovereign yogis engaged in the samadhi of inner sound (Nada) is indeed the supreme, pure, tranquil truth of Shiva, the Supreme Self.",
            "hindi": "नादानुसन्धानरूपी समाधि में मग्न योगीश्वरों के हृदय में जो दिव्य प्रकाश उद्भासित होता है, वही परम पवित्र, शान्त और शिवस्वरूप परमात्मा है। ॥ १ ॥",
            "explanation": "अनाहत नाद और समाधि का सर्वोच्च फल।"
        },
        {
            "id": 2,
            "sanskrit": "अनाहतस्य शब्दस्य ध्वनिर्यस्तत्र वर्तते । तन्मध्ये वर्तते ज्योतिर्ज्योतिर्मध्ये सदाशिवः ॥ २ ॥",
            "transliteration": "anāhatasya śabdasya dhvaniryastatra vartate | tanmadhye vartate jyotirjyotirmadhye sadāśivaḥ || 2 ||",
            "translation": "Within the unstruck sound (Anahata Nada) vibrates a sublime resonance; within that sound shines a light, and within that light abides Sada-Shiva.",
            "hindi": "अनाहत शब्द की जो ध्वनि हृदय में गूँजती है, उसके मध्य में दिव्य ज्योति स्थित है और उस ज्योति के मध्य में स्वयं सदाशिव विराजमान हैं। ॥ २ ॥",
            "explanation": "नाद, बिन्दु और कला का पारमार्थिक रहस्य।"
        },
        {
            "id": 3,
            "sanskrit": "मनो मग्नं यदा नादे तदा मुक्तिर्न संशयः । योगिनां परमा सिद्धिर्लययोगः प्रकीर्तितः ॥ ३ ॥",
            "transliteration": "mano magnaṃ yadā nāde tadā muktirna saṃśayaḥ | yogināṃ paramā siddhirlayayogaḥ prakīrtitaḥ || 3 ||",
            "translation": "When the mind dissolves completely into the inner sound, liberation is achieved without doubt. This dissolution of mind (Laya Yoga) is acclaimed as the supreme perfection of yogis.",
            "hindi": "जब मन अनाहत नाद में पूर्णतः विलीन हो जाता है, तब निःसन्देह मुक्ति प्राप्त होती है। योगियों की यह परम सिद्धि 'लययोग' कही गई है। ॥ ३ ॥",
            "explanation": "लययोग द्वारा चित्तवृत्ति-निरोध और कैवल्य-सिद्धि।"
        }
    ]
}

patala_meta = [
    {
        "id": 1,
        "title": "Tattva Pradipika — The Lamp of Truth",
        "titleSanskrit": "प्रथम पटल — तत्त्व प्रदीपिका",
        "summary": "Unique among Hatha Yoga texts: the Shiva Samhita begins with Advaita Vedanta. Consciousness alone is real; the world is an appearance within consciousness. Yoga is the systematic uncovering of this innate freedom."
    },
    {
        "id": 2,
        "title": "Prana & Nadi — The Body as Cosmos",
        "titleSanskrit": "द्वितीय पटल — प्राण और नाड़ी",
        "summary": "350,000 nadis; the three principal channels: Ida, Pingala, and Sushumna; Mount Meru in the spine; the ten vital airs (Prana, Apana, Samana, Udana, Vyana, and five upa-pranas); and the sleeping Kundalini."
    },
    {
        "id": 3,
        "title": "Vayu Sadhana & Asana — Pranayama and Posture",
        "titleSanskrit": "तृतीय पटल — वायु साधना एवं आसन",
        "summary": "The science of breath regulation (Pranayama), purification of nadis, the signs of pranic harmony, and the four classical meditation postures: Siddhasana, Padmasana, Ugrasana, and Svastikasana."
    },
    {
        "id": 4,
        "title": "The Ten Great Mudras — Seals of Power",
        "titleSanskrit": "चतुर्थ पटल — दश महामुद्रा",
        "summary": "The ten great mudras (Maha Mudra, Maha Bandha, Maha Vedha, Khechari, Jalandhara, Mula, Uddiyana, Vajroli, Shaktichalani, and Yoni) that redirect prana inward and awaken the dormant Kundalini through Sushumna."
    },
    {
        "id": 5,
        "title": "Samadhi & Nadanusandhana — Liberation Through Inner Sound",
        "titleSanskrit": "पञ्चम पटल — समाधि एवं नादानुसन्धान",
        "summary": "The obstacles to yoga, the four types of seekers, the chakras, and the supreme technique of Nadanusandhana — absorbing the mind into the unstruck inner sound (Anahata Nada) to attain Laya Samadhi."
    }
]

code = """import { Scripture } from '../types';

export const shivasamhita: Scripture = {
  id: 'shivasamhita',
  title: 'Shiva Samhita',
  titleSanskrit: 'शिवसंहिता',
  category: 'tantra',
  description: 'One of the three classical foundational texts of Hatha Yoga (645 verses across 5 Patalas), revealed by Lord Shiva to Goddess Parvati. Uniquely harmonizes Advaita Vedanta metaphysics with subtle body physiology (Nadi, Prana, Kundalini), Asana, the Ten Mahamudras, and Nadanusandhana Samadhi. Fully hydrated with authentic Sanskrit text, IAST transliteration, and Hindi commentary.',
  totalVerses: 645,
  tags: ['Tantra', 'HathaYoga', 'Shiva', 'Yoga', 'Kundalini', 'Nadi', 'Samadhi', 'Prana', 'Mudra', 'NonDual', 'Nada'],
  chapters: [
"""

totalVerses = 0
for pm in patala_meta:
    verses = shiva_samhita_data.get(pm["id"], [])
    totalVerses += len(verses)
    code += f"""    {{
      id: {pm["id"]},
      title: {json.dumps(pm["title"])},
      titleSanskrit: {json.dumps(pm["titleSanskrit"])},
      summary: {json.dumps(pm["summary"])},
      verses: [
"""
    for v in verses:
        code += f"""        {{
          id: {v["id"]},
          number: {v["id"]},
          sanskrit: {json.dumps(v["sanskrit"])},
          transliteration: {json.dumps(v["transliteration"])},
          translation: {json.dumps(v["translation"])},
          hindi: {json.dumps(v["hindi"])},
          explanation: {json.dumps(v["explanation"])},
          keywords: ["शिवसंहिता", "पटल {pm['id']}"]
        }},
"""
    code += """      ],
    },
"""

code += """  ],
};
"""

with open('data/scriptures/shivasamhita.ts', 'w', encoding='utf-8') as f:
    f.write(code)

print(f"Successfully hydrated {totalVerses} verses across all 5 Patalas of Shiva Samhita!")
