import json, re

# Standard Devanagari text for Kaivalya Upanishad (all 25 mantras)
kaivalya_verses = [
    {
        "id": 1,
        "sanskrit": "ॐ अथाश्वलायनो भगवन्तं परमेष्ठिनमुपसमेत्योवाच । अधीहि भगवन् ब्रह्मविद्यां वरिष्ठां सदा सद्भिः सेव्यमानां निगूढाम् । ययाऽचिरात्सर्वपापं व्यपोह्य परात्परं पुरुषं याति विद्वान् ॥ १ ॥",
        "transliteration": "oṃ athāśvalāyano bhagavantaṃ parameṣṭhinamupasametyovāca | adhīhi bhagavan brahmavidyāṃ variṣṭhāṃ sadā sadbhiḥ sevyamānāṃ nigūḍhām | yayā'cirātsarvapāpaṃ vyapohya parātparaṃ puruṣaṃ yāti vidvān || 1 ||",
        "translation": "Then Ashvalayana approached the Lord Parameshtin (Brahma) and said: Teach me, O venerable one, the highest knowledge of Brahman, ever cultivated by the virtuous, deeply hidden, by which a wise person quickly washing away all sins reaches the Purusha higher than the highest.",
        "hindi": "तब महर्षि अश्वलायनने परमेष्ठी ब्रह्माजीके पास जाकर निवेदन किया—'हे भगवन्! मुझे सबमें श्रेष्ठ उस गुप्त ब्रह्मविद्याका उपदेश दीजिये, जिसका सत्पुरुष सदा सेवन करते हैं और जिसे जानकर ज्ञानी पुरुष शीघ्र ही समस्त पापोंको नष्ट करके परात्पर पुरुष परमात्माको प्राप्त कर लेता है।' ॥ १ ॥",
        "explanation": "कैवल्योपनिषद् का यह उद्घाटन मन्त्र है। ब्रह्मविद्या की पात्रता और जिज्ञासा का यहाँ आद्य प्रतिपादन है।"
    },
    {
        "id": 2,
        "sanskrit": "तस्मै स होवाच पितामहश्च श्रद्धाभक्तिध्यानयोगादवैहि ॥ २ ॥",
        "transliteration": "tasmai sa hovāca pitāmahaśca śraddhābhaktidhyānayogādavaihi || 2 ||",
        "translation": "To him the Grandsire said: Know this through faith, devotion, and the yoga of meditation.",
        "hindi": "उन (अश्वलायन)-से पितामह ब्रह्माजीने कहा—'श्रद्धा, भक्ति और ध्यानयोगके द्वारा तुम उस परम तत्त्वको जानो।' ॥ २ ॥",
        "explanation": "ब्रह्मविद्या की प्राप्ति केवल शुष्क तर्क से नहीं, अपितु श्रद्धा, भक्ति और एकाग्र ध्यानयोगके समन्वयसे होती है।"
    },
    {
        "id": 3,
        "sanskrit": "न कर्मणा न प्रजया धनेन त्यागेनैके अमृतत्वमानशुः । परेण नाकं निहितं गुहायां विभ्राजते यद्यतयो विशन्ति ॥ ३ ॥",
        "transliteration": "na karmaṇā na prajayā dhanena tyāgenaike amṛtatvamānaśuḥ | pareṇa nākaṃ nihitaṃ guhāyāṃ vibhrājate yadyatayo viśanti || 3 ||",
        "translation": "Neither by rituals, nor by offspring, nor by wealth, but by renunciation alone have some attained immortality. Shining beyond heaven, hidden in the heart's cave, into it the self-controlled ascetics enter.",
        "hindi": "न कर्मोंसे, न सन्तानसे और न धनसे—अपितु एकमात्र त्यागसे ही महापुरुषोंने अमृतत्व (मोक्ष) को प्राप्त किया है। स्वर्गसे भी परे हृदयगुहामें स्थित जो परम तत्त्व देदीप्यमान है, यत्नशील संन्यासी उसीमें प्रवेश करते हैं। ॥ ३ ॥",
        "explanation": "अद्वैत वेदान्तका यह महामन्त्र उद्घोषित करता है कि बाह्य संचयसे नहीं, प्रत्युत आसक्ति और अहङ्कारके त्यागसे ही अमृतत्व प्राप्त होता है।"
    },
    {
        "id": 4,
        "sanskrit": "वेदान्तविज्ञानसुनिश्चितार्थाः संन्यासयोगाद्यतयः शुद्धसत्त्वाः । ते ब्रह्मलोकेषु परान्तकाले परामृताः परिमुच्यन्ति सर्वे ॥ ४ ॥",
        "transliteration": "vedāntavijñānasuniścitārthāḥ saṃnyāsayogādyatayaḥ śuddhasattvāḥ | te brahmalokeṣu parāntakāle parāmṛtāḥ parimucyanti sarve || 4 ||",
        "translation": "Those whose understanding is firmly established in the wisdom of Vedanta, whose minds are purified through the yoga of renunciation, all of them becoming one with the supreme immortal reality are liberated in the world of Brahman at the final moment.",
        "hindi": "वेदान्तके यथार्थ ज्ञानसे जिनका अर्थ भलीभाँति निश्चित हो गया है और संन्यासयोगके द्वारा जिनका अन्तःकरण शुद्ध हो चुका है, वे समस्त यत्नशील मुनि परम अमृतस्वरूप होकर परान्तकालमें परमब्रह्ममें लीन होकर मुक्त हो जाते हैं। ॥ ४ ॥",
        "explanation": "शुद्ध अन्तःकरण और वेदान्त-विचारकी परिपक्वतासे ही आत्यन्तिक मोक्ष प्राप्त होता है।"
    },
    {
        "id": 5,
        "sanskrit": "विविक्तदेशे च सुखासनस्थः शुचिः समग्रीवशिरःशरीरः । अत्याश्रमस्थः सकलेन्द्रियाणि निरुध्य भक्त्या स्वगुरुं प्रणम्य ॥ ५ ॥",
        "transliteration": "viviktadeśe ca sukhāsanasthaḥ śuciḥ samagrīvaśiraḥśarīraḥ | atyāśramasthaḥ sakalendriyāṇi nirudhya bhaktyā svaguruṃ praṇamya || 5 ||",
        "translation": "Seated comfortably in a solitary, clean place, holding the neck, head, and body straight, transcending the stages of life, restraining all senses, bowing with devotion to one's guru.",
        "hindi": "एकान्त पवित्र स्थानमें सुखासनपर बैठकर, ग्रीवा, मस्तक और शरीरको सीधा रखकर, समस्त आश्रमोंसे परे होकर, सम्पूर्ण इन्द्रियोंको वशमें करके तथा भक्तिपूर्वक अपने गुरुको प्रणाम करके ध्यान करे। ॥ ५ ॥",
        "explanation": "ध्यानकी आदर्श शारीरिक और मानसिक स्थितिका यहाँ वर्णन है।"
    },
    {
        "id": 6,
        "sanskrit": "हृत्पुण्डरीकं विरजं विशुद्धं विचिन्त्य मध्ये विशदं विशोकम् । अचिन्त्यमव्यक्तमनन्तरूपं शिवं प्रशान्तममृतं ब्रह्मयोनिम् ॥ ६ ॥",
        "transliteration": "hṛtpuṇḍarīkaṃ virajaṃ viśuddhaṃ vicintya madhye viśadaṃ viśokam | acintyamavyaktamanantarūpaṃ śivaṃ praśāntamamṛtaṃ brahmayonim || 6 ||",
        "translation": "Meditating in the pure, sorrowless center of the lotus of the heart upon the inconceivable, unmanifest, infinite-formed, auspicious, peaceful, immortal source of all creation.",
        "hindi": "हृदयरूपी कमलके मध्यमें स्थित रजोगुणरहित, परम शुद्ध, शोकहीन, अचिन्त्य, अव्यक्त, अनन्तरूप, कल्याणमय (शिव), परम शान्त, अमर और सम्पूर्ण जगत्के कारणभूत ब्रह्मका ध्यान करे। ॥ ६ ॥",
        "explanation": "हृदय-कमलमें परमात्माके शिव-स्वरूपका ध्यान कैवल्यपदका साधन है।"
    },
    {
        "id": 7,
        "sanskrit": "तथाऽऽदिमध्यान्तविहीनमेकं विभुं चिदानन्दमरूपमद्भुतम् । उमासहायं परमेश्वरं प्रभुं त्रिलोचनं नीलकण्ठं प्रशान्तम् ॥ ७ ॥",
        "transliteration": "tathā''dimadhyāntavihīnamekaṃ vibhuṃ cidānandam arūpam adbhutam | umāsahāyaṃ parameśvaraṃ prabhuṃ trilocanaṃ nīlakaṇṭhaṃ praśāntam || 7 ||",
        "translation": "Meditating upon the One who is without beginning, middle, or end, all-pervading, consciousness and bliss, formless and wondrous, accompanied by Uma, the Supreme Lord, three-eyed, blue-necked, and tranquil.",
        "hindi": "जो आदि, मध्य और अन्तसे रहित, एक, सर्वव्यापी, सच्चिदानन्द, रूपरहित और अद्भुत हैं—उन भगवती उमासहित, त्रिनेत्र, नीलकण्ठ, परम शान्त परमेश्वरका ध्यान करे। ॥ ७ ॥",
        "explanation": "सगुण-निर्गुणके समन्वयके रूपमें उमा-महेश्वरका ध्यान यहाँ ऋषि प्रतिपादित करते हैं।"
    },
    {
        "id": 8,
        "sanskrit": "ध्यात्वा मुनिर्गच्छति भूतयोनिं समस्तसाक्षिं तमसः परस्तात् । स ब्रह्मा स शिवः स इन्द्रः सोऽक्षरः परमः स्वराट् ॥ ८ ॥",
        "transliteration": "dhyātvā munirgacchati bhūtayoniṃ samastasākṣiṃ tamasaḥ parastāt | sa brahmā sa śivaḥ sa indraḥ so'kṣaraḥ paramaḥ svarāṭ || 8 ||",
        "translation": "Meditating thus, the sage reaches the source of all beings, the witness of all, beyond darkness. He is Brahma, He is Shiva, He is Indra, He is the Imperishable, the Supreme, Self-luminous.",
        "hindi": "ऐसा ध्यान करके मुनि समस्त प्राणियोंके कारणभूत, सबके साक्षी और अज्ञानान्धकारसे परे परात्पर तत्त्वको प्राप्त कर लेता है। वही ब्रह्मा है, वही शिव है, वही इन्द्र है, वही अविनाशी परम स्वयंप्रकाश है। ॥ ८ ॥",
        "explanation": "एक ही परब्रह्म समस्त देवताओं और लोकोंके रूपमें प्रकाशित है।"
    },
    {
        "id": 9,
        "sanskrit": "स एव विष्णुः स प्राणः स कालोऽग्निः स चन्द्रमाः । स एव सर्वं यद्भूतं यच्च भव्यं सनातनम् ॥ ९ ॥",
        "transliteration": "sa eva viṣṇuḥ sa prāṇaḥ sa kālo'gniḥ sa candramāḥ | sa eva sarvaṃ yadbhūtaṃ yacca bhavyaṃ sanātanam || 9 ||",
        "translation": "He alone is Vishnu, He is Prana, He is Time and Fire, He is the Moon. He alone is all that has been and all that shall be, the Eternal.",
        "hindi": "वही विष्णु हैं, वही प्राण हैं, वही काल और अग्नि हैं, वही चन्द्रमा हैं। जो कुछ अतीतमें था और जो कुछ भविष्यमें होगा—वह सब एकमात्र वही सनातन परब्रह्म है। ॥ ९ ॥",
        "explanation": "सम्पूर्ण देश, काल और वस्तुके रूपमें एकमात्र ब्रह्म ही व्याप्त है।"
    },
    {
        "id": 10,
        "sanskrit": "ज्ञात्वा तं मृत्युमत्येति नान्यः पन्था विमुक्तये । सर्वभूतस्थमात्मानं सर्वभूतानि चात्मनि । सम्पश्यन् ब्रह्म परमं याति नान्येन हेतुना ॥ १० ॥",
        "transliteration": "jñātvā taṃ mṛtyumatyeti nānyaḥ panthā vimuktaye | sarvabhūtasthamātmānaṃ sarvabhūtāni cātmani | sampaśyan brahma paramaṃ yāti nānyena hetunā || 10 ||",
        "translation": "Knowing Him one transcends death; there is no other path to liberation. Seeing one's Self in all beings and all beings in the Self, one attains the Supreme Brahman and by no other means.",
        "hindi": "उस परम तत्त्वको जानकर मनुष्य मृत्युको पार कर जाता है, मोक्षके लिये इसके अतिरिक्त कोई दूसरा मार्ग नहीं है। अपने आत्माको सब प्राणियोंमें और सब प्राणियोंको अपने आत्मामें सम्यक् रूपसे देखता हुआ पुरुष परमब्रह्मको प्राप्त कर लेता है, अन्य किसी साधनसे नहीं। ॥ १० ॥",
        "explanation": "आत्मौपम्य दृष्टि और सर्वभूतस्थ आत्म-दर्शन ही कैवल्यकी पराकाष्ठा है।"
    },
    {
        "id": 11,
        "sanskrit": "आत्मानमरणिं कृत्वा प्रणवं चोत्तरारणिम् । ज्ञाननिर्मथनाभ्यासात्पाशं दहति पण्डितः ॥ ११ ॥",
        "transliteration": "ātmānamaraṇiṃ kṛtvā praṇavaṃ cottarāraṇim | jñānanirmathanābhyāsātpāśaṃ dahati paṇḍitaḥ || 11 ||",
        "translation": "Making one's own Self the lower piece of wood and OM the upper piece, through the practice of churning with knowledge, the wise person burns away all bonds.",
        "hindi": "अपने आत्माको नीचेकी अरणि और प्रणव (ॐ)-को ऊपरकी अरणि बनाकर, ज्ञानरूपी मन्थनके निरन्तर अभ्याससे ज्ञानी पुरुष अपने समस्त बन्धनोंको भस्म कर देता है। ॥ ११ ॥",
        "explanation": "अरणि-मन्थनका यह रूपक प्रणव-उपासना और आत्म-ज्ञानकी तीक्ष्णताको दर्शाता है।"
    },
    {
        "id": 12,
        "sanskrit": "स एव मायापरिमोहितात्मा शरीरमास्थाय करोति सर्वम् । स्त्रियन्नपानादिविचित्रभोगैः स एव जाग्रत्परितृप्तिमेति ॥ १२ ॥",
        "transliteration": "sa eva māyāparimohitātmā śarīramāsthāya karoti sarvam | striyannapānādivicitrabhogaiḥ sa eva jāgratparitṛptimeti || 12 ||",
        "translation": "That same Self, deluded by Maya, identifying with the body, does everything. In the waking state, through various enjoyments such as women, food, and drink, it finds satisfaction.",
        "hindi": "मायासे मोहित होकर वही जीवात्मा शरीरका आश्रय लेकर सम्पूर्ण कर्म करता है और जाग्रत् अवस्थामें स्त्री, अन्न, पान आदि नाना प्रकारके भोगोंसे तृप्ति प्राप्त करता है। ॥ १२ ॥",
        "explanation": "जाग्रत् अवस्थाका भोग और माया-जनित देहाभिमानका यह सटीक विश्लेषण है।"
    },
    {
        "id": 13,
        "sanskrit": "स्वप्ने स जीवः सुखदुःखभोक्ता स्वमायया कल्पितजीवलोके । सुषुप्तिकाले सकले विलीने तमोऽभिभूतः सुखरूपमेति ॥ १३ ॥",
        "transliteration": "svapne sa jīvaḥ sukhaduḥkhabhoktā svamāyayā kalpitajīvaloke | suṣuptikāle sakale vilīne tamo'bhibhūtaḥ sukharūpameti || 13 ||",
        "translation": "In dream, that jiva experiences pleasure and pain in the world created by its own Maya. In deep sleep, when everything merges, enveloped by tamas, it attains a state of bliss.",
        "hindi": "स्वप्नावस्थामें वही जीव अपनी मायासे रचित संसारमें सुख-दुःखका भोग करता है और सुषुप्ति-कालमें जब सब कुछ लीन हो जाता है, तब अज्ञानरूपी तमोभावसे आच्छादित होकर वह आनन्दस्वरूपको प्राप्त होता है। ॥ १३ ॥",
        "explanation": "अवस्थात्रय (जाग्रत्, स्वप्न, सुषुप्ति) का वेदान्ती मीमांसा।"
    },
    {
        "id": 14,
        "sanskrit": "पुनश्च जन्मान्तरकर्मयोगात्स एव जीवः स्वपिति प्रबुद्धः । पुरत्रये क्रीडति यश्च जीवस्ततस्तु जातं सकलं विचित्रम् । आधारमानन्दमखण्डबोधं यस्मिंल्लयं याति पुरत्रयं च ॥ १४ ॥",
        "transliteration": "punaśca janmāntarakarmayogātsa eva jīvaḥ svapiti prabuddhaḥ | puratraye krīḍati yaśca jīvastatastu jātaṃ sakalaṃ vicitram | ādhāramānandamakhaṇḍabodhaṃ yasmiṃllayaṃ yāti puratrayaṃ ca || 14 ||",
        "translation": "Again, due to karmas of previous lives, that same jiva wakes and sleeps. The jiva sports in the three cities (states), from which arose all this diversity. In Him alone, the blissful, undivided foundation of awareness, the three cities dissolve.",
        "hindi": "पुनः पूर्वजन्मके कर्मोंके संयोगसे वही जीव सोता है और जागता है। जो जीव इन तीनों शरीरों (स्थूल, सूक्ष्म, कारण) में क्रीड़ा करता है, उसीसे यह सम्पूर्ण विचित्र जगत् उत्पन्न हुआ है और उस अखण्ड चैतन्य आनन्दस्वरूप आधारमें ही यह तीनों पुर लीन हो जाते हैं। ॥ १४ ॥",
        "explanation": "त्रिपुर-क्रीड़ा और परब्रह्ममें सम्पूर्ण द्वैतका विलय।"
    },
    {
        "id": 15,
        "sanskrit": "एतस्माज्जायते प्राणो मनः सर्वेन्द्रियाणि च । खं वायुर्ज्योतिरापः पृथिवी विश्वस्य धारिणी ॥ १५ ॥",
        "transliteration": "etasmājjāyate prāṇo manaḥ sarvendriyāṇi ca | khaṃ vāyurjyotirāpaḥ pṛthivī viśvasya dhāriṇī || 15 ||",
        "translation": "From This (Brahman) is born life-breath (Prana), mind, all senses, space, air, fire, water, and the earth that supports all.",
        "hindi": "इसी परब्रह्मसे प्राण, मन, सम्पूर्ण इन्द्रियाँ तथा आकाश, वायु, अग्नि, जल और सम्पूर्ण विश्वको धारण करनेवाली पृथिवी उत्पन्न होती है। ॥ १५ ॥",
        "explanation": "सृष्टिकी उत्पत्ति और पञ्चमहाभूतोंका अधिष्ठान एकमात्र परब्रह्म ही है।"
    },
    {
        "id": 16,
        "sanskrit": "यत्परं ब्रह्म सर्वात्मा विश्वस्यायतनं महत् । सूक्ष्मात्सूक्ष्मतरं नित्यं तत्त्वमेव त्वमेव तत् ॥ १६ ॥",
        "transliteration": "yatparaṃ brahma sarvātmā viśvasyāyatanaṃ mahat | sūkṣmātsūkṣmataraṃ nityaṃ tattvameva tvameva tat || 16 ||",
        "translation": "That which is Supreme Brahman, the Self of all, the great support of the universe, subtler than the subtle, eternal — That Thou Art, and Thou Art That.",
        "hindi": "जो परमब्रह्म, सर्वात्मा, विश्वका महान् आश्रय, सूक्ष्मसे भी अतिसूक्ष्म और नित्य है—'वही तुम हो, और तुम ही वह हो।' ॥ १६ ॥",
        "explanation": "तत्त्वमसि महावाक्यका यह प्रत्यक्ष और स्पष्ट साक्षात्कार है।"
    },
    {
        "id": 17,
        "sanskrit": "जाग्रत्स्वप्नसुषुप्त्यादिप्रपञ्चं यत्प्रकाशते । तद्ब्रह्माहमिति ज्ञात्वा सर्वबन्धैः प्रमुच्यते ॥ १७ ॥",
        "transliteration": "jāgratsvapnasuṣuptyādiprapañcaṃ yatprakāśate | tadbrahmāhamiti jñātvā sarvabandhaiḥ pramucyate || 17 ||",
        "translation": "That which illuminates the waking, dream, and deep-sleep states — knowing 'I am that Brahman', one is freed from all bondage.",
        "hindi": "जो जाग्रत्, स्वप्न और सुषुप्ति आदिके प्रपञ्चको प्रकाशित करता है—'वह ब्रह्म मैं ही हूँ', ऐसा जानकर मनुष्य सम्पूर्ण बन्धनोंसे मुक्त हो जाता है। ॥ १७ ॥",
        "explanation": "साक्षी-चैतन्यके रूपमें अहम्-ब्रह्मास्मि बोध ही मुक्ति है।"
    },
    {
        "id": 18,
        "sanskrit": "त्रिषु धामसु यद्भोग्यं भोक्ता भोगश्च यद्भवेत् । तेभ्यो विलक्षणः साक्षी चिन्मात्रोऽहं सदाशिवः ॥ १८ ॥",
        "transliteration": "triṣu dhāmasu yadbhogyaṃ bhoktā bhogaśca yadbhavet | tebhyo vilakṣaṇaḥ sākṣī cinmātro'haṃ sadāśivaḥ || 18 ||",
        "translation": "Whatever in the three states is the enjoyable, the enjoyer, and the enjoyment — distinct from them all, I am the witness, pure consciousness, the ever-auspicious Shiva.",
        "hindi": "तीनों अवस्थाओंमें जो कुछ भोग्य, भोक्ता और भोग है—उन सबसे विलक्षण, शुद्ध साक्षी, चैतन्यमात्र 'सदाशिव मैं ही हूँ।' ॥ १८ ॥",
        "explanation": "त्रिपुटिरहित केवल चिन्मात्र शिव-स्वरूपका साक्षात्कार।"
    },
    {
        "id": 19,
        "sanskrit": "मय्येव सकलं जातं मयि सर्वं प्रतिष्ठितम् । मयि सर्वं लयं याति तद्ब्रह्माद्वयमस्म्यहम् ॥ १९ ॥",
        "transliteration": "mayyeva sakalaṃ jātaṃ mayi sarvaṃ pratiṣṭhitam | mayi sarvaṃ layaṃ yāti tadbrahmādvayamasmyaham || 19 ||",
        "translation": "In Me alone all is born, in Me all is sustained, and in Me all dissolves. I am that non-dual Brahman.",
        "hindi": "मुझमें ही सम्पूर्ण जगत् उत्पन्न हुआ है, मुझमें ही सब स्थित है और मुझमें ही सब विलीन हो जाता है—वह अद्वैत ब्रह्म मैं ही हूँ। ॥ १९ ॥",
        "explanation": "अद्वैत वेदान्तका सर्वोत्कृष्ट उद्घोष।"
    },
    {
        "id": 20,
        "sanskrit": "अणोरणीयानहमेव तद्वन्महानहं विश्वमहं विचित्रम् । पुरातनोऽहं पुरुषोऽहमीशो हिरण्मयोऽहं शिवरूपमस्मि ॥ २० ॥",
        "transliteration": "aṇoraṇīyānahameva tadvanmahānahaṃ viśvamahaṃ vicitram | purātano'haṃ puruṣo'hamīśo hiraṇmayo'haṃ śivarūpamasmi || 20 ||",
        "translation": "I am subtler than the subtle, and likewise vast; I am this wonderful universe; I am the Ancient One, the Purusha, the Lord, the Golden, the auspicious Shiva.",
        "hindi": "मैं अणुसे भी अणु हूँ और महान्‌से भी महान् हूँ। यह विचित्र विश्व मैं ही हूँ। मैं ही सनातन पुरुष हूँ, मैं ही ईश्वर हूँ, मैं ही हिरण्मय और परम कल्याणकारी शिवस्वरूप हूँ। ॥ २० ॥",
        "explanation": "अनन्त विराट् और सूक्ष्म आत्म-स्वरूपका दिव्य वर्णन।"
    },
    {
        "id": 21,
        "sanskrit": "अपाणिपादोऽहमचिन्त्यशक्तिः पश्याम्यचक्षुः स शृणोम्यकर्णः । अहं विजानामि विविक्तरूपो न चास्ति वेत्ता मम चित्सदाऽहम् ॥ २१ ॥",
        "transliteration": "apāṇipādo'hamacintyaśaktiḥ paśyāmyacakṣuḥ sa śṛṇomyakarṇaḥ | ahaṃ vijānāmi viviktarūpo na cāsti vettā mama citsadā'ham || 21 ||",
        "translation": "Without hands and feet, of inconceivable power, I see without eyes, I hear without ears. I know all in my solitary nature, but none knows me. I am ever pure awareness.",
        "hindi": "मैं हाथ-पैरसे रहित अचिन्त्य शक्तियुक्त हूँ; बिना नेत्रोंके देखता हूँ और बिना कानोंके सुनता हूँ। मैं सबको जानता हूँ, किन्तु मुझे कोई नहीं जानता; क्योंकि मैं सदा केवल शुद्ध ज्ञानस्वरूप हूँ। ॥ २१ ॥",
        "explanation": "इन्द्रियातीत सर्वज्ञ चैतन्यका उपनिषद्-सम्मत स्वरूप।"
    },
    {
        "id": 22,
        "sanskrit": "वेदैरनेकैरहमेव वेद्यो वेदान्तकृद्वेदविदेव चाहम् । न पुण्यपापे मम नास्ति नाशो न जन्म देहेन्द्रियबुद्धिरस्ति ॥ २२ ॥",
        "transliteration": "vedairanekairahameva vedyo vedāntakṛdvedavideva cāham | na puṇyapāpe mama nāsti nāśo na janma dehendriyabuddhirasti || 22 ||",
        "translation": "Through all the Vedas, I alone am to be known; I am the maker of Vedanta and the knower of the Vedas. To me there is neither merit nor demerit, no destruction, no birth, no body, senses, or intellect.",
        "hindi": "अनेक वेदोंके द्वारा मैं ही जाननेयोग्य हूँ, मैं ही वेदान्तका कर्ता और वेदोंका यथार्थ ज्ञाता हूँ। मेरे लिये न पुण्य है न पाप, न मेरा विनाश है और न जन्म, न देह है, न इन्द्रियाँ और न बुद्धि। ॥ २२ ॥",
        "explanation": "वेदोंका मुख्य तात्पर्य आत्म-स्वरूपमें ही पर्यवसित है।"
    },
    {
        "id": 23,
        "sanskrit": "न भूमिरापो न च वह्निरस्ति न चानिलो मेऽस्ति न चाम्बरं च । एवं विदित्वा परमात्मरूपं गुहाशयं निष्कलमद्वितीयम् ॥ २३ ॥",
        "transliteration": "na bhūmirāpo na ca vahnirasti na cānilo me'sti na cāmbaraṃ ca | evaṃ viditvā paramātmarūpaṃ guhāśayaṃ niṣkalamadvitīyam || 23 ||",
        "translation": "Neither earth, water, fire, air, nor space belongs to me. Knowing thus the nature of the Supreme Self, residing in the cave of the heart, partless, non-dual.",
        "hindi": "न पृथिवी, न जल, न अग्नि, न वायु और न आकाश ही मेरा स्वरूप है। इस प्रकार हृदयगुहामें स्थित, कलारहित और अद्वितीय परमात्मस्वरूपको जानकर— ॥ २३ ॥",
        "explanation": "पञ्चभूतातीत विशुद्ध स्वरूपका साक्षात्कार।"
    },
    {
        "id": 24,
        "sanskrit": "समस्तसाक्षिं सदसद्विहीनं प्रयाति शुद्धं परमात्मरूपम् ॥ २४ ॥",
        "transliteration": "samastasākṣiṃ sadasadvihīnaṃ prayāti śuddhaṃ paramātmarūpam || 24 ||",
        "translation": "The witness of all, beyond existence and non-existence, one attains that pure nature of the Supreme Self.",
        "hindi": "जो समस्त जगत्का साक्षी तथा सत् और असत्‌से परे है, मनुष्य उस परम शुद्ध परमात्म-स्वरूपको ही प्राप्त हो जाता है। ॥ २४ ॥",
        "explanation": "कैवल्य-पदकी पूर्ण सिद्धि।"
    },
    {
        "id": 25,
        "sanskrit": "यः शतरुद्रीयमधीते सोऽग्निपूतो भवति स वायुपूतो भवति स आत्मपूतो भवति स सुरापानात्पूतो भवति स ब्रह्महत्यात्पूतो भवति स सुवर्णस्तेयात्पूतो भवति स कृत्याकृत्यात्पूतो भवति तस्मादविमुक्तमाश्रितो भवति । अत्याश्रमी सर्वदा सकृद्वा जपेत् । अनेन ज्ञानमाप्नोति संसारार्णवनाशनम् । तस्मादेवं विदित्वैनं कैवल्यं पदमश्नुते कैवल्यं पदमश्नुत इति ॥ २५ ॥",
        "transliteration": "yaḥ śatarudrīyamadhīte so'gnipūto bhavati sa vāyupūto bhavati sa ātmapūto bhavati sa surāpānātpūto bhavati sa brahmahatyātpūto bhavati sa suvarṇasteyātpūto bhavati sa kṛtyākṛtyātpūto bhavati tasmādavimuktamāśrito bhavati | atyāśramī sarvadā sakṛdvā japet | anena jñānamāpnoti saṃsārārṇavanāśanam | tasmādevaṃ viditvainaṃ kaivalyaṃ padamaśnute kaivalyaṃ padamaśnuta iti || 25 ||",
        "translation": "Whoever studies this Kaivalya Upanishad becomes purified as by fire, purified as by air, purified in self; freed from the sin of all actions, attaining liberation. By this knowledge one destroys the ocean of worldly existence and attains the state of Kaivalya (absolute liberation).",
        "hindi": "जो मनुष्य इस कैवल्योपनिषद्का पाठ करता है, वह अग्नि और वायुके समान पवित्र हो जाता है; समस्त पापोंसे मुक्त होकर संसार-सागरको पार कर जाता है और परम कैवल्यपदको प्राप्त करता है। ॥ २५ ॥",
        "explanation": "कैवल्योपनिषद्की फलश्रुति और मोक्षका माहात्म्य।"
    }
]

code = """import { Scripture } from '../types';

export const kaivalya: Scripture = {
  id: 'kaivalya',
  title: 'Kaivalya Upanishad',
  titleSanskrit: 'कैवल्योपनिषद्',
  category: 'upanishad',
  description: 'A deeply revered Upanishad of the Atharvaveda tradition expounding Kaivalya — absolute non-dual Self-awareness beyond all conditioning. Features Ashvalayana’s dialogue with Brahma, meditation on the heart-lotus, and direct realization of the Self as Shiva and Para Brahman. Fully hydrated with all 25 canonical mantras.',
  totalVerses: 25,
  tags: ['Upanishad', 'Kaivalya', 'Advaita', 'Shiva', 'Liberation', 'Atharvaveda', 'Brahman'],
  chapters: [
    {
      id: 1,
      title: 'The Direct Path to Kaivalya',
      titleSanskrit: 'कैवल्य मार्ग',
      summary: 'Sage Ashvalayana approaches Brahma for the highest knowledge. Brahma expounds the direct path of renunciation (tyaga), meditation upon the heart-lotus, the nature of the witness consciousness across waking, dream, and deep sleep, and the identity of the Self with Supreme Shiva.',
      verses: [
"""

for v in kaivalya_verses:
    code += f"""        {{
          id: {v['id']},
          number: {v['id']},
          sanskrit: {json.dumps(v['sanskrit'])},
          transliteration: {json.dumps(v['transliteration'])},
          translation: {json.dumps(v['translation'])},
          hindi: {json.dumps(v['hindi'])},
          explanation: {json.dumps(v['explanation'])},
          keywords: ["कैवल्य", "मन्त्र {v['id']}"]
        }},
"""

code += """      ],
    },
  ],
};
"""

with open('data/scriptures/kaivalya.ts', 'w', encoding='utf-8') as f:
    f.write(code)

print("Successfully hydrated all 25 verses of Kaivalya Upanishad!")
