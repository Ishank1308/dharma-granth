import { Scripture } from "../types";

export const taittiriya: Scripture = {
  id: "taittiriya",
  title: "Taittiriya Upanishad",
  titleSanskrit: "तैत्तिरीयोपनिषद्",
  category: "upanishad",
  description:
    "Belongs to the Kṛṣṇa Yajur Veda. 31 anuvākas across 3 vallīs — Śīkṣā (phonetics-and-ethics), Brahmānanda (the five-sheath doctrine and bliss-calculation), and Bhṛgu (progressive inquiry into Brahman from food to bliss). Famous for satyaṃ-vada-dharmaṃ-cara and the pañca-kośa model.",
  totalVerses: 31,
  tags: ["Upanishad", "Koshas", "Ethics", "Ananda", "SatyamVada"],
  chapters: [
    {
      id: 1,
      title: "Śīkṣā Vallī — The Phonetics and Ethics Section",
      titleSanskrit: "शिक्षावल्ली",
      summary:
        "12 anuvākas. Opens with the peace invocation 'śaṃ no mitraḥ.' Teaches phonetics (śīkṣā), correlations of letters and meditations (sambhāva-upāsanā), the heart-space, OM as Brahman, the value of svādhyāya, and the famous graduation address: satyaṃ vada, dharmaṃ cara.",
      verses: [
        {
          id: 1,
          sanskrit:
            "ॐ शं नो मित्रः शं वरुणः । शं नो भवत्वर्यमा । शं न इन्द्रो बृहस्पतिः । शं नो विष्णुरुरुक्रमः । नमो ब्रह्मणे । नमस्ते वायो । त्वमेव प्रत्यक्षं ब्रह्मासि । त्वामेव प्रत्यक्षं ब्रह्म वदिष्यामि । ऋतं वदिष्यामि । सत्यं वदिष्यामि । तन्मामवतु । तद्वक्तारमवतु । अवतु माम् । अवतु वक्तारम् । ॐ शान्तिः शान्तिः शान्तिः ॥",
          transliteration:
            "oṃ śaṃ no mitraḥ śaṃ varuṇaḥ | śaṃ no bhavatvaryamā | śaṃ na indro bṛhaspatiḥ | śaṃ no viṣṇururukramaḥ | namo brahmaṇe | namaste vāyo | tvameva pratyakṣaṃ brahmāsi | tvāmeva pratyakṣaṃ brahma vadiṣyāmi | ṛtaṃ vadiṣyāmi | satyaṃ vadiṣyāmi | tanmāmavatu | tadvaktāramavatu | avatu mām | avatu vaktāram | oṃ śāntiḥ śāntiḥ śāntiḥ ||",
          translation:
            "OM. May Mitra be propitious to us; may Varuṇa be propitious; may Aryaman be propitious; may Indra and Bṛhaspati be propitious; may the far-striding Viṣṇu be propitious. Salutation to Brahman. Salutation to thee, O Vāyu — thou alone art the visible Brahman. I declare thee alone to be the visible Brahman. I will speak ṛta. I will speak satya. May That protect me; may That protect the speaker. OM. Peace, peace, peace.",
          hindi:
            'ॐ। मित्र हमारे प्रति शान्त हों, वरुण शान्त हों, अर्यमा शान्त हों, इन्द्र और बृहस्पति शान्त हों, उरुक्रम विष्णु शान्त हों। ब्रह्म को नमस्कार। हे वायु, तुम्हें नमस्कार — तुम ही प्रत्यक्ष ब्रह्म हो। तुम्हीं को प्रत्यक्ष ब्रह्म कहूँगा। मैं ऋत बोलूँगा; सत्य बोलूँगा। वह मेरी रक्षा करे; वह वक्ता की रक्षा करे। ॐ शान्तिः शान्तिः शान्तिः।',
          explanation:
            "The opening peace-invocation. Six devas are called by name — each a face of the same Brahman. The student commits to speaking both ṛta (cosmic order) and satya (truth-in-speech). The closing threefold śāntiḥ asks peace from the three classes of disturbance.",
          science:
            "Pre-task invocations measurably improve focus and ethical commitment. Ritual openings function as cognitive primers, not mere ceremony.",
          lifeLesson:
            "Open important undertakings with an invocation — your own, simple words if you wish. The brief turning of attention itself shifts what follows.",
          keywords: ["PeaceInvocation", "Vayu", "Opening"],
        },
        {
          id: 2,
          sanskrit:
            "ॐ शीक्षां व्याख्यास्यामः । वर्णः स्वरः । मात्रा बलम् । साम सन्तानः । इत्युक्तः शीक्षाध्यायः ॥",
          transliteration:
            "oṃ śīkṣāṃ vyākhyāsyāmaḥ | varṇaḥ svaraḥ | mātrā balam | sāma santānaḥ | ityuktaḥ śīkṣādhyāyaḥ ||",
          translation:
            "OM. We shall expound śīkṣā (phonetics). The letter, the accent, the quantity, the effort, the modulation, the connection — thus has been stated the chapter on śīkṣā.",
          hindi:
            'ॐ। हम शिक्षा (उच्चारण-विज्ञान) की व्याख्या करते हैं — वर्ण, स्वर, मात्रा, बल, साम (मधुरता), सन्तान (सम्बन्ध) — इस प्रकार शिक्षा-अध्याय कहा गया।',
          explanation:
            "The Upanishad takes phonetics seriously. Six elements of precise speech — letter, accent, length, force, modulation, continuity. Right speech is the foundation of all teaching.",
          science:
            "Articulatory phonetics today identifies essentially the same parameters: place, manner, voice, length, stress, prosody. The Upanishad's six map onto these closely.",
          lifeLesson:
            "Pronounce mantras carefully. The instrument shapes the effect. Sloppy speech is sloppy thought made audible.",
          keywords: ["Shiksha", "Phonetics", "Speech"],
        },
        {
          id: 7,
          sanskrit:
            "पृथिव्यन्तरिक्षं द्यौर्दिशोऽवान्तरदिशाः । अग्निर्वायुरादित्यश्चन्द्रमा नक्षत्राणि । आप ओषधयो वनस्पतयः । आकाश आत्मा । इत्यधिभूतम् । अथाध्यात्मम् । प्राणो व्यानोऽपान उदानः समानः । चक्षुः श्रोत्रं मनो वाक् त्वक् । चर्म मांसं स्नावास्थि मज्जा । एतदधिविधाय ऋषिरवोचत् । पाङ्क्तं वा इदं सर्वम् । पाङ्क्तेनैव पाङ्क्तँ्स्पृणोतीति ॥",
          transliteration:
            "pṛthivyantarikṣaṃ dyaurdiśo'vāntaradiśāḥ | agnirvāyurādityaścandramā nakṣatrāṇi | āpa oṣadhayo vanaspatayaḥ | ākāśa ātmā | ityadhibhūtam | athādhyātmam | prāṇo vyāno'pāna udānaḥ samānaḥ | cakṣuḥ śrotraṃ mano vāk tvak | carma māṃsaṃ snāvāsthi majjā | etadadhividhāya ṛṣiravocat | pāṅktaṃ vā idaṃ sarvam | pāṅktenaiva pāṅktagaṃspṛṇotīti ||",
          translation:
            "Earth, atmosphere, heaven, the directions, the intermediate directions; Agni, Vāyu, Āditya, Moon, stars; waters, plants, trees; space, the Self — this is the bhūta-level. Now the personal: prāṇa, vyāna, apāna, udāna, samāna; eye, ear, mind, speech, skin; skin, flesh, sinew, bone, marrow. Having ordered all this, the seer said: 'All this is fivefold. By the fivefold one strengthens the fivefold.'",
          hindi:
            'पृथ्वी, अन्तरिक्ष, द्यु, दिशाएँ, अवान्तर-दिशाएँ; अग्नि, वायु, आदित्य, चन्द्र, नक्षत्र; जल, ओषधि, वनस्पति; आकाश, आत्मा — यह अधिभूत है। अध्यात्म — प्राण, व्यान, अपान, उदान, समान; नेत्र, श्रोत्र, मन, वाक्, त्वक्; चर्म, मांस, स्नायु, अस्थि, मज्जा। ऋषि ने कहा — यह सब "पाङ्क्त" (पंचक) है। पाङ्क्त से ही पाङ्क्त पोषित होता है।',
          explanation:
            "Pañkta-meditation: everything is fivefold. Cosmic fives (worlds, devas, plants, etc.) match bodily fives (prāṇas, senses, tissues). 'By the fivefold one strengthens the fivefold' — alignment of inner and outer fives.",
          science:
            "Fivefold groupings recur across biology: five senses, five limbs (head + four extremities), five organ-systems in many models. The Upanishad's intuition has biological grounding.",
          lifeLesson:
            "When seeking balance, list the five components of any situation. Five is often the natural taxonomy. Adjust the weak one.",
          keywords: ["Pankta", "Fives", "Correspondence"],
        },
        {
          id: 9,
          sanskrit:
            "ऋतं च स्वाध्यायप्रवचने च । सत्यं च स्वाध्यायप्रवचने च । तपश्च स्वाध्यायप्रवचने च । दमश्च स्वाध्यायप्रवचने च । शमश्च स्वाध्यायप्रवचने च । अग्नयश्च स्वाध्यायप्रवचने च । अग्निहोत्रं च स्वाध्यायप्रवचने च । अतिथयश्च स्वाध्यायप्रवचने च । मानुषं च स्वाध्यायप्रवचने च । प्रजा च स्वाध्यायप्रवचने च । प्रजनश्च स्वाध्यायप्रवचने च । प्रजातिश्च स्वाध्यायप्रवचने च । सत्यमिति सत्यवचा राथीतरः । तप इति तपोनित्यः पौरुशिष्टिः । स्वाध्यायप्रवचने एवेति नाको मौद्गल्यः । तद्धि तपस्तद्धि तपः ॥",
          transliteration:
            "ṛtaṃ ca svādhyāyapravacane ca | satyaṃ ca svādhyāyapravacane ca | tapaśca svādhyāyapravacane ca | damaśca svādhyāyapravacane ca | śamaśca svādhyāyapravacane ca | agnayaśca svādhyāyapravacane ca | agnihotraṃ ca svādhyāyapravacane ca | atithayaśca svādhyāyapravacane ca | mānuṣaṃ ca svādhyāyapravacane ca | prajā ca svādhyāyapravacane ca | prajanaśca svādhyāyapravacane ca | prajātiśca svādhyāyapravacane ca | satyamiti satyavacā rāthītaraḥ | tapa iti taponityaḥ pauruśiṣṭiḥ | svādhyāyapravacane eveti nāko maudgalyaḥ | taddhi tapastaddhi tapaḥ ||",
          translation:
            "Ṛta and svādhyāya-pravacana (self-study and teaching); satya and svādhyāya-pravacana; tapas and svādhyāya-pravacana; dama and svādhyāya-pravacana; śama and svādhyāya-pravacana; the fires and svādhyāya-pravacana; agnihotra and svādhyāya-pravacana; guests and svādhyāya-pravacana; the human duty and svādhyāya-pravacana; offspring and svādhyāya-pravacana; procreation and svādhyāya-pravacana; lineage and svādhyāya-pravacana. Satyavacā Rāthītara says: 'Truth is the chief.' Taponitya Pauruśiṣṭi says: 'Tapas.' Nāka Maudgalya says: 'Only svādhyāya-pravacana — for that is tapas, that is tapas.'",
          hindi:
            'ऋत और स्वाध्याय-प्रवचन; सत्य और स्वाध्याय-प्रवचन; तप और स्वाध्याय-प्रवचन; दम और स्वाध्याय-प्रवचन; शम और स्वाध्याय-प्रवचन; अग्नियाँ और स्वाध्याय-प्रवचन; अग्निहोत्र और स्वाध्याय-प्रवचन; अतिथि और स्वाध्याय-प्रवचन; मानुष-कर्तव्य और स्वाध्याय-प्रवचन; प्रजा, प्रजन, प्रजाति और स्वाध्याय-प्रवचन। सत्यवचा राथीतर — "सत्य"; तपोनित्य पौरुशिष्टि — "तप"; नाक मौद्गल्य — "केवल स्वाध्याय-प्रवचन — वही तप है, वही तप है।"',
          explanation:
            "Twelve duties paired with svādhyāya-pravacana. Three teachers disagree about which is primary: truth, tapas, or self-study-and-teaching. Nāka Maudgalya's view — that svādhyāya-pravacana itself is tapas — closes with the doubled emphasis.",
          science:
            "Educational continuity: societies that institutionalize ongoing study-and-teaching produce more durable cultural transmission. The Upanishad recognizes the central role.",
          lifeLesson:
            "Every other duty matters, but study-and-teaching is the duty that makes other duties knowable. Without it, all others fade.",
          keywords: ["Svadhyaya", "Duties", "Tapas"],
        },
        {
          id: 10,
          sanskrit:
            "अहं वृक्षस्य रेरिवा । कीर्तिः पृष्ठं गिरेरिव । ऊर्ध्वपवित्रो वाजिनीव स्वमृतमस्मि । द्रविणं सवर्चसम् । सुमेधा अमृतोऽक्षितः । इति त्रिशङ्कोर्वेदानुवचनम् ॥",
          transliteration:
            "ahaṃ vṛkṣasya rerivā | kīrtiḥ pṛṣṭhaṃ gireriva | ūrdhvapavitro vājinīva svamṛtamasmi | draviṇaṃ savarcasam | sumedhā amṛto'kṣitaḥ | iti triśaṅkorvedānuvacanam ||",
          translation:
            "I am the mover of the tree (of life). My glory is like the back of a mountain. Upward-purified, like a swift mare, I am immortal essence. I am wealth full of radiance — a sage of fine intellect, immortal, undecaying. — Thus the Veda-recitation of Triśaṅku.",
          hindi:
            'मैं इस वृक्ष (संसार-वृक्ष) का प्रेरक हूँ। मेरी कीर्ति पर्वत के पृष्ठ की तरह है। ऊर्ध्व-पवित्र, वाजी-घोड़ी की तरह — मैं स्व-अमृत हूँ। द्रविण-सम्पन्न, तेजोयुक्त — सुमेधा, अमर, अक्षय हूँ। — यह त्रिशङ्कु का वेद-अनुवचन है।',
          explanation:
            "The seer Triśaṅku declares his realization: he is the mover of the tree-of-life, the immortal essence, wealth full of radiance. A first-person celebration of self-knowledge.",
          science:
            "Self-affirmation research: precise verbal articulation of one's deepest values measurably stabilizes identity. Triśaṅku's recitation is a refined form.",
          lifeLesson:
            "Compose your own brief 'declaration of being' — three or four lines that name who you really are. Recite them when you forget.",
          keywords: ["Trishanku", "Declaration", "Realization"],
        },
        {
          id: 12,
          sanskrit:
            "शं नो मित्रः शं वरुणः । शं नो भवत्वर्यमा । शं न इन्द्रो बृहस्पतिः । शं नो विष्णुरुरुक्रमः । नमो ब्रह्मणे । नमस्ते वायो । त्वमेव प्रत्यक्षं ब्रह्मासि । त्वामेव प्रत्यक्षं ब्रह्मावादिषम् । ऋतमवादिषम् । सत्यमवादिषम् । तन्मामावीत् । तद्वक्तारमावीत् । आवीन्माम् । आवीद्वक्तारम् । ॐ शान्तिः शान्तिः शान्तिः ॥",
          transliteration:
            "śaṃ no mitraḥ śaṃ varuṇaḥ | śaṃ no bhavatvaryamā | śaṃ na indro bṛhaspatiḥ | śaṃ no viṣṇururukramaḥ | namo brahmaṇe | namaste vāyo | tvameva pratyakṣaṃ brahmāsi | tvāmeva pratyakṣaṃ brahmāvādiṣam | ṛtamavādiṣam | satyamavādiṣam | tanmāmāvīt | tadvaktāramāvīt | āvīnmām | āvīdvaktāram | oṃ śāntiḥ śāntiḥ śāntiḥ ||",
          translation:
            "May Mitra be propitious to us; may Varuṇa be propitious; Aryaman; Indra and Bṛhaspati; far-striding Viṣṇu. Salutation to Brahman. Salutation to thee, Vāyu — thou alone art the visible Brahman; I have declared thee alone the visible Brahman. I have spoken ṛta; I have spoken satya. That has protected me; that has protected the speaker. It has protected me; it has protected the speaker. OM. Peace, peace, peace.",
          hindi:
            'मित्र शान्त हों, वरुण शान्त हों, अर्यमा शान्त हों, इन्द्र-बृहस्पति शान्त हों, उरुक्रम विष्णु शान्त हों। ब्रह्म को नमस्कार। हे वायु, तुम्हें नमस्कार — तुम्हीं प्रत्यक्ष ब्रह्म हो; तुम्हीं को प्रत्यक्ष ब्रह्म कहा। मैंने ऋत बोला; सत्य बोला। उसने मेरी रक्षा की; वक्ता की भी रक्षा की। ॐ शान्तिः शान्तिः शान्तिः।',
          explanation:
            "Closing peace mantra. Same opening invocation now spoken in past tense — 'I have spoken truth' — marking completion. The threefold śāntiḥ closes the vallī.",
          science:
            "Bookending with parallel invocations is a known mnemonic and emotional-closure technique. The Upanishad uses it for the whole Śīkṣā vallī.",
          lifeLesson:
            "End in the same posture you began. Symmetry of opening and closing is itself a kind of completeness.",
          keywords: ["ClosingPeace", "Symmetry", "Completion"],
        },
      
        {
          id: 8,
          sanskrit: 'ओमिति॒ ब्रह्म॑ । ओमिती॒दँसर्वम्" । ओमित्ये॒तद॑नुकृतिर्हस्म॒ वा अ॒प्योश्रा॑व॒येत्याश्रा॑वयन्ति । ओमिति॒ सामा॑नि गायन्ति । ॐँशोमिति॑ श॒स्त्राणि॑ शँसन्ति । ओमित्य॑ध्व॒र्युः प्र॑तिग॒रं प्रति॑गृणाति । ओमिति॒ ब्रह्मा॒ प्रसौ॑ति । ओमित्य॑ग्निहो॒त्रमनु॑जानाति । ओमिति॒ ब्राह्म॒णः प्र॑व॒क्ष्यन्ना॑ह॒ ब्रह्मोपा"प्नवा॒नीति॑ । ब्रह्मै॒वोपा"प्नोति',
          transliteration: 'omiti\\` brahma\\\' . omitI\\`da{\\m+}sarvam.h\\" . omitye\\`tada\\\'nukR^itirhasma\\` vA a\\`pyoshrA\\\'va\\`yetyAshrA\\\'vayanti . omiti\\` sAmA\\\'ni gAyanti . OM{\\m+}shomiti\\\' sha\\`strANi\\\' sha{\\m+}santi . omitya\\\'dhva\\`ryuH pra\\\'tiga\\`raM prati\\\'gR^iNAti . omiti\\` brahmA\\` prasau\\\'ti . omitya\\\'gniho\\`tramanu\\\'jAnAti . omiti\\` brAhma\\`NaH pra\\\'va\\`kShyannA\\\'ha\\` brahmopA\\"pnavA\\`nIti\\\' . brahmai\\`vopA\\"pnoti',
          translation: 'OM — that is Brahman. OM — all this. OM is the assent of recital: \'recite!\' — they reply OM. By OM the sāman is sung; with OM-Śom the śastras are recited; with OM the adhvaryu replies; with OM the brahmā priest commands; with OM the agnihotra is consented to. With OM the Brahmin says: \'May I attain Brahman!\' — and he indeed attains Brahman.',
          hindi: 'ॐ — यही ब्रह्म है। ॐ — यह सब है। ॐ ही श्रावण-अनुकरण है। ॐ से साम गाये जाते हैं; ॐ-शोम् से शस्त्र पढ़े जाते हैं; ॐ से अध्वर्यु प्रतिगर बोलता है; ॐ से ब्रह्मा प्रसौति करता है; ॐ से अग्निहोत्र की अनुज्ञा होती है; ॐ से ब्राह्मण कहता है — "मैं ब्रह्म को प्राप्त करूँ" — और वह ब्रह्म ही प्राप्त करता है।',
          explanation: 'OM permeates every priestly function — every assent, every recital. To say OM is to invoke Brahman. The Brahmin\'s intention to attain Brahman, voiced as OM, is itself the attainment.',
          keywords: [],
        },
      ],
    },
    {
      id: 2,
      title: "Brahmānanda Vallī — The Bliss of Brahman",
      titleSanskrit: "ब्रह्मानन्दवल्ली",
      summary:
        "9 anuvākas. Opens with the great formulation 'satyaṃ jñānam anantaṃ brahma.' The pañca-kośa doctrine: five sheaths of the Self — annamaya, prāṇamaya, manomaya, vijñānamaya, ānandamaya. The famous bliss-calculation (one human bliss × 100 = bliss of a gandharva, etc.). Closes with the verse 'yato vāco nivartante' — from which speech turns back, unattained.",
      verses: [
        {
          id: 2,
          sanskrit:
            "अन्नाद्वै प्रजाः प्रजायन्ते । याः काश्च पृथिवीँ्श्रिताः । अथो अन्नेनैव जीवन्ति । अथैनदपि यन्त्यन्ततः । अन्नँ्हि भूतानां ज्येष्ठम् । तस्मात्सर्वौषधमुच्यते । सर्वं वै तेऽन्नमाप्नुवन्ति । येऽन्नं ब्रह्मोपासते । अन्नँ्हि भूतानां ज्येष्ठम् । तस्मात्सर्वौषधमुच्यते । अन्नाद्भूतानि जायन्ते । जातान्यन्नेन वर्धन्ते । अद्यतेऽत्ति च भूतानि । तस्मादन्नं तदुच्यते ॥",
          transliteration:
            "annādvai prajāḥ prajāyante | yāḥ kāśca pṛthivīṃśritāḥ | atho annenaiva jīvanti | athainadapi yantyantataḥ | annaṃhi bhūtānāṃ jyeṣṭham | tasmātsarvauṣadhamucyate | sarvaṃ vai te'nnamāpnuvanti | ye'nnaṃ brahmopāsate | annaṃhi bhūtānāṃ jyeṣṭham | tasmātsarvauṣadhamucyate | annādbhūtāni jāyante | jātānyannena vardhante | adyate'tti ca bhūtāni | tasmādannaṃ taducyate ||",
          translation:
            "From food are creatures born — all creatures that dwell on earth. By food they live; into food they finally return. Food is the eldest of beings. Therefore it is called the universal medicine. Those who worship food as Brahman attain all food. Food is the eldest; food is the medicine. From food beings are born; born, they grow by food; food is eaten and food eats beings. Therefore it is called anna (food).",
          hindi:
            'अन्न से ही प्रजाएँ उत्पन्न होती हैं — पृथ्वी पर रहने वाली। अन्न से ही जीते हैं; अन्त में अन्न में ही लौटते हैं। अन्न ही भूतों का ज्येष्ठ है; इसलिये "सर्वौषध" कहलाता है। जो अन्न को ब्रह्म-रूप में उपासते हैं — उन्हें सब अन्न मिलता है। अन्न से भूत उत्पन्न होते हैं, अन्न से बढ़ते हैं; अन्न खाया जाता है और भूतों को खाता है — इसलिये "अन्न" कहलाता है।',
          explanation:
            "Food as Brahman. Beings emerge from, live by, return to food. Food eats and is eaten — etymology of 'anna' itself. Worshipping food as Brahman is no trivial practice — it is a doorway.",
          science:
            "Trophic ecology: every ecosystem is a food-web. Everything eats and is eaten. The Upanishad's etymology captures the cycle.",
          lifeLesson:
            "Before each meal, pause briefly. You are eating — and being prepared to be eaten. Both directions deserve attention.",
          keywords: ["Anna", "Eating", "Eldest"],
        },
        {
          id: 9,
          sanskrit:
            "यतो वाचो निवर्तन्ते । अप्राप्य मनसा सह । आनन्दं ब्रह्मणो विद्वान् । न बिभेति कदाचनेति । एतँ्ह वाव न तपति । किमहँ्साधु नाकरवम् । किमहं पापमकरवमिति । स य एवं विद्वानेते आत्मानँ्स्पृणुते । उभे ह्येवैष एते आत्मानँ्स्पृणुते । य एवं वेद । इत्युपनिषत् ॥",
          transliteration:
            "yato vāco nivartante | aprāpya manasā saha | ānandaṃ brahmaṇo vidvān | na bibheti kadācaneti | etagaṃha vāva na tapati | kimahaṃsādhu nākaravam | kimahaṃ pāpamakaravamiti | sa ya evaṃ vidvānete ātmānaṃspṛṇute | ubhe hyevaiṣa ete ātmānaṃspṛṇute | ya evaṃ veda | ityupaniṣat ||",
          translation:
            "From which words turn back, unattained, with the mind — knowing the bliss of Brahman, he never fears. He is not tormented by: 'Why did I not do good? Why did I do evil?' He who knows thus accepts both as the Self — both are nourishing to the Self for him who knows thus. — This is the upaniṣad.",
          hindi:
            'जिससे वाणी मन के साथ लौटती है — उसको प्राप्त किये बिना — ब्रह्म-आनन्द को जानने वाला कभी नहीं डरता। उसे "मैंने साधु क्यों नहीं किया?", "मैंने पाप क्यों किया?" — ये नहीं तपाते। ऐसा ज्ञानी इन दोनों को आत्मा-रूप मानता है — दोनों ही आत्मा को पोषित करते हैं उसके लिये। यह उपनिषद् है।',
          explanation:
            "Closing of Brahmānanda Vallī. The famous 'yato vāco nivartante' returns. The realized one is beyond moral self-torture — he accepts both 'I did this good / why this bad' as movements of the Self. Equanimity is the fruit.",
          science:
            "Self-compassion research (Neff): non-judgmental self-acceptance correlates with sustained ethical growth more than guilt does. Counter-intuitive but well-replicated.",
          lifeLesson:
            "Drop the cycle of 'why did I not do better?' Accept what happened. From a non-tormented place, the next action is more likely to be good.",
          keywords: ["YatoVacho", "Fearless", "Equanimity"],
        },
      
      ],
    },
    {
      id: 3,
      title: "Bhṛgu Vallī — The Bhṛgu Inquiry",
      titleSanskrit: "भृगुवल्ली",
      summary:
        "10 anuvākas. Bhṛgu, son of Varuṇa, approaches his father: 'Teach me Brahman.' Varuṇa points him to inquiry. Bhṛgu meditates and successively realizes: food is Brahman, prāṇa is Brahman, mind is Brahman, vijñāna is Brahman — finally, ānanda is Brahman. Each return to the father is met with the same instruction: 'continue inquiring.' Closes with practical teachings on food.",
      verses: [
        {
          id: 1,
          sanskrit:
            "भृगुर्वै वारुणिः । वरुणं पितरमुपससार । अधीहि भगवो ब्रह्मेति । तस्मा एतत्प्रोवाच । अन्नं प्राणं चक्षुः श्रोत्रं मनो वाचमिति । तँ्होवाच । यतो वा इमानि भूतानि जायन्ते । येन जातानि जीवन्ति । यत्प्रयन्त्यभिसंविशन्ति । तद्विजिज्ञासस्व । तद्ब्रह्मेति । स तपोऽतप्यत । स तपस्तप्त्वा ॥",
          transliteration:
            "bhṛgurvai vāruṇiḥ | varuṇaṃ pitaramupasasāra | adhīhi bhagavo brahmeti | tasmā etatprovāca | annaṃ prāṇaṃ cakṣuḥ śrotraṃ mano vācamiti | tagaṃhovāca | yato vā imāni bhūtāni jāyante | yena jātāni jīvanti | yatprayantyabhisaṃviśanti | tadvijijñāsasva | tadbrahmeti | sa tapo'tapyata | sa tapastaptvā ||",
          translation:
            "Bhṛgu, son of Varuṇa, approached his father: 'Sir, teach me Brahman.' Varuṇa said: food, prāṇa, sight, hearing, mind, speech. He added: 'That from which beings are born, by which when born they live, into which they enter at departure — desire to know That. That is Brahman.' He performed tapas. Having performed tapas...",
          hindi:
            'वरुण-पुत्र भृगु पिता वरुण के पास गए — "हे भगवन्, मुझे ब्रह्म का उपदेश दीजिये।" वरुण ने कहा — "अन्न, प्राण, चक्षु, श्रोत्र, मन, वाक्।" फिर कहा — "जिससे ये भूत उत्पन्न होते हैं, जिससे जीते हैं, जिसमें अन्त में लीन होते हैं — उसे जानने की इच्छा करो; वही ब्रह्म है।" उसने तप किया। तप करके...',
          explanation:
            "The classic teaching-method. The father does not answer but instructs: 'inquire.' He gives criteria: source, sustainer, destination. He gives faculties: food, prāṇa, sight, etc. — pointing the inquiry through them.",
          science:
            "Socratic-style guided discovery produces deeper understanding than direct answer. The Upanishad models the method precisely.",
          lifeLesson:
            "When teaching anything that matters, give criteria and method — not conclusions. The student will own what they discover.",
          keywords: ["Inquiry", "Bhrigu", "Criteria"],
        },
        {
          id: 2,
          sanskrit:
            "अन्नं ब्रह्मेति व्यजानात् । अन्नाद्ध्येव खल्विमानि भूतानि जायन्ते । अन्नेन जातानि जीवन्ति । अन्नं प्रयन्त्यभिसंविशन्तीति । तद्विज्ञाय । पुनरेव वरुणं पितरमुपससार । अधीहि भगवो ब्रह्मेति । तँ्होवाच । तपसा ब्रह्म विजिज्ञासस्व । तपो ब्रह्मेति । स तपोऽतप्यत । स तपस्तप्त्वा ॥",
          transliteration:
            "annaṃ brahmeti vyajānāt | annāddhyeva khalvimāni bhūtāni jāyante | annena jātāni jīvanti | annaṃ prayantyabhisaṃviśantīti | tadvijñāya | punareva varuṇaṃ pitaramupasasāra | adhīhi bhagavo brahmeti | tagaṃhovāca | tapasā brahma vijijñāsasva | tapo brahmeti | sa tapo'tapyata | sa tapastaptvā ||",
          translation:
            "He knew: 'Food is Brahman.' From food beings are born; by food they live; into food they enter at departure. Having understood this, he approached his father again: 'Sir, teach me Brahman.' He said: 'By tapas know Brahman; tapas is Brahman.' He performed tapas. Having performed tapas...",
          hindi:
            'उसने जाना — "अन्न ब्रह्म है।" अन्न से भूत उत्पन्न होते हैं, अन्न से जीते हैं, अन्न में लीन होते हैं। यह जानकर फिर वरुण के पास गया — "ब्रह्म का उपदेश दीजिये।" उसने कहा — "तप से ब्रह्म जानो; तप ब्रह्म है।" उसने तप किया।',
          explanation:
            "First answer: food fits the criteria. But Bhṛgu returns — sensing it's incomplete. Father redirects: 'do more tapas.' The inquiry continues.",
          science:
            "Material-substrate is the starting hypothesis of every cosmology. The Upanishad uses it as the first answer — partial but legitimate.",
          lifeLesson:
            "Trust the urge to return to the question. If an answer satisfies but you sense more — there is more. Press on.",
          keywords: ["AnnaBrahma", "FirstAnswer", "Continue"],
        },
        {
          id: 3,
          sanskrit:
            "प्राणो ब्रह्मेति व्यजानात् । प्राणाद्ध्येव खल्विमानि भूतानि जायन्ते । प्राणेन जातानि जीवन्ति । प्राणं प्रयन्त्यभिसंविशन्तीति । तद्विज्ञाय पुनरेव वरुणं पितरमुपससार । अधीहि भगवो ब्रह्मेति । तँ्होवाच । तपसा ब्रह्म विजिज्ञासस्व । तपो ब्रह्मेति । स तपोऽतप्यत । स तपस्तप्त्वा ॥",
          transliteration:
            "prāṇo brahmeti vyajānāt | prāṇāddhyeva khalvimāni bhūtāni jāyante | prāṇena jātāni jīvanti | prāṇaṃ prayantyabhisaṃviśantīti | tadvijñāya punareva varuṇaṃ pitaramupasasāra | adhīhi bhagavo brahmeti | tagaṃhovāca | tapasā brahma vijijñāsasva | tapo brahmeti | sa tapo'tapyata | sa tapastaptvā ||",
          translation:
            "He knew: 'Prāṇa is Brahman.' From prāṇa beings are born; by prāṇa they live; into prāṇa they return. Knowing this, he approached his father again. Father: 'By tapas inquire. Tapas is Brahman.' He performed tapas. Having performed tapas...",
          hindi:
            'उसने जाना — "प्राण ब्रह्म है।" प्राण से भूत उत्पन्न होते हैं, प्राण से जीते हैं, प्राण में लीन होते हैं। यह जानकर फिर पिता के पास गया। पिता ने कहा — "तप से जानो; तप ब्रह्म है।" तप किया।',
          explanation:
            "Second answer: prāṇa. Better than food — life-energy is more fundamental than substance. But still partial.",
          science:
            "Bio-energetics: life is metabolism. Many theories of life propose energy-flow as primary. Bhṛgu's second answer reflects this kind of theory.",
          lifeLesson:
            "When you advance one rung, do not stop. Each level satisfies briefly before revealing what lies beyond.",
          keywords: ["PranaBrahma", "SecondAnswer", "Lifeforce"],
        },
        {
          id: 4,
          sanskrit:
            "मनो ब्रह्मेति व्यजानात् । मनसो ह्येव खल्विमानि भूतानि जायन्ते । मनसा जातानि जीवन्ति । मनः प्रयन्त्यभिसंविशन्तीति । तद्विज्ञाय पुनरेव वरुणं पितरमुपससार । अधीहि भगवो ब्रह्मेति । तँ्होवाच । तपसा ब्रह्म विजिज्ञासस्व । तपो ब्रह्मेति । स तपोऽतप्यत । स तपस्तप्त्वा ॥",
          transliteration:
            "mano brahmeti vyajānāt | manaso hyeva khalvimāni bhūtāni jāyante | manasā jātāni jīvanti | manaḥ prayantyabhisaṃviśantīti | tadvijñāya punareva varuṇaṃ pitaramupasasāra | adhīhi bhagavo brahmeti | tagaṃhovāca | tapasā brahma vijijñāsasva | tapo brahmeti | sa tapo'tapyata | sa tapastaptvā ||",
          translation:
            "He knew: 'Mind is Brahman.' From mind beings are born; by mind they live; into mind they return. Knowing, he approached his father. Father: 'By tapas inquire.' He performed tapas.",
          hindi:
            'उसने जाना — "मन ब्रह्म है।" मन से भूत उत्पन्न होते हैं, मन से जीते हैं, मन में लीन होते हैं। फिर पिता के पास गया। पिता ने कहा — "तप करो।"',
          explanation:
            "Third answer: mind. Mind is closer than prāṇa — without it, even prāṇa is unintelligible. Yet still not the deepest.",
          science:
            "Cognitive primacy: many philosophies (Berkeley, Kastrup) argue mind is more fundamental than matter or energy. Bhṛgu's third answer matches.",
          lifeLesson:
            "Test each candidate-answer against the criteria. Mind fits more than energy did — but the test is rigor, not satisfaction.",
          keywords: ["ManoBrahma", "ThirdAnswer", "Mind"],
        },
        {
          id: 5,
          sanskrit:
            "विज्ञानं ब्रह्मेति व्यजानात् । विज्ञानाद्ध्येव खल्विमानि भूतानि जायन्ते । विज्ञानेन जातानि जीवन्ति । विज्ञानं प्रयन्त्यभिसंविशन्तीति । तद्विज्ञाय पुनरेव वरुणं पितरमुपससार । अधीहि भगवो ब्रह्मेति । तँ्होवाच । तपसा ब्रह्म विजिज्ञासस्व । तपो ब्रह्मेति । स तपोऽतप्यत । स तपस्तप्त्वा ॥",
          transliteration:
            "vijñānaṃ brahmeti vyajānāt | vijñānāddhyeva khalvimāni bhūtāni jāyante | vijñānena jātāni jīvanti | vijñānaṃ prayantyabhisaṃviśantīti | tadvijñāya punareva varuṇaṃ pitaramupasasāra | adhīhi bhagavo brahmeti | tagaṃhovāca | tapasā brahma vijijñāsasva | tapo brahmeti | sa tapo'tapyata | sa tapastaptvā ||",
          translation:
            "He knew: 'Vijñāna (deep knowing) is Brahman.' From vijñāna beings are born... Knowing, he approached his father again. Father: 'By tapas inquire.' He performed tapas.",
          hindi:
            'उसने जाना — "विज्ञान ब्रह्म है।" विज्ञान से भूत उत्पन्न होते हैं... फिर पिता के पास गया। पिता ने कहा — "तप करो।"',
          explanation:
            "Fourth answer: vijñāna — the discerning intelligence behind mind. Subtler than mind, more fundamental. But still — not the end.",
          science:
            "Meta-cognition: the awareness that knows it knows. The Upanishad has Bhṛgu reach this level — and signal that more lies beyond.",
          lifeLesson:
            "Even your highest intelligence is not the bedrock. Press on past it. Something quieter holds even discernment.",
          keywords: ["VijnanaBrahma", "FourthAnswer", "Discernment"],
        },
        {
          id: 6,
          sanskrit:
            "आनन्दो ब्रह्मेति व्यजानात् । आनन्दाद्ध्येव खल्विमानि भूतानि जायन्ते । आनन्देन जातानि जीवन्ति । आनन्दं प्रयन्त्यभिसंविशन्तीति । सैषा भार्गवी वारुणी विद्या । परमे व्योमन् प्रतिष्ठिता । स य एवं वेद प्रतितिष्ठति । अन्नवानन्नादो भवति । महान् भवति प्रजया पशुभिर्ब्रह्मवर्चसेन । महान् कीर्त्या ॥",
          transliteration:
            "ānando brahmeti vyajānāt | ānandāddhyeva khalvimāni bhūtāni jāyante | ānandena jātāni jīvanti | ānandaṃ prayantyabhisaṃviśantīti | saiṣā bhārgavī vāruṇī vidyā | parame vyoman pratiṣṭhitā | sa ya evaṃ veda pratitiṣṭhati | annavānannādo bhavati | mahān bhavati prajayā paśubhirbrahmavarcasena | mahān kīrtyā ||",
          translation:
            "He knew: 'Ānanda (bliss) is Brahman.' From bliss are beings born; by bliss they live; into bliss they merge and return. — This is the Bhārgavī-Vāruṇī Vidyā, established in the supreme space. He who knows it is established; becomes possessor of food and an eater of food; great by progeny, cattle, brahma-radiance, and fame.",
          hindi:
            'उसने जाना — "आनन्द ब्रह्म है।" आनन्द से भूत उत्पन्न होते हैं, आनन्द से जीते हैं, आनन्द में लीन हो जाते हैं। — यह "भार्गवी-वारुणी विद्या" है — परम व्योम में प्रतिष्ठित। जो इसे ऐसा जानता है, वह प्रतिष्ठित होता है; अन्नवान्, अन्न-भोक्ता हो जाता है; प्रजा, पशु, ब्रह्म-वर्चस् और कीर्ति से महान् होता है।',
          explanation:
            "The terminus. ānanda is Brahman. The criteria are satisfied at the deepest level. The 'Bhārgavī-Vāruṇī vidyā' — the inquiry of Bhṛgu son of Varuṇa — concludes. Fruits enumerated.",
          science:
            "Bliss as substrate: the deepest contemplative reports describe a layer of pure unconditioned well-being underlying all experience. The Upanishad names this Brahman.",
          lifeLesson:
            "Beneath every joy and even every sorrow is a ground of unconditioned well-being. Touch it daily; it is your inheritance.",
          keywords: ["AnandaBrahma", "FifthAnswer", "Terminus"],
        },
        {
          id: 7,
          sanskrit:
            "अन्नं न निन्द्यात् । तद्व्रतम् । प्राणो वा अन्नम् । शरीरमन्नादम् । प्राणे शरीरं प्रतिष्ठितम् । शरीरे प्राणः प्रतिष्ठितः । तदेतदन्नमन्ने प्रतिष्ठितम् । स य एतदन्नमन्ने प्रतिष्ठितं वेद प्रतितिष्ठति । अन्नवानन्नादो भवति । महान् भवति प्रजया पशुभिर्ब्रह्मवर्चसेन । महान् कीर्त्या ॥",
          transliteration:
            "annaṃ na nindyāt | tadvratam | prāṇo vā annam | śarīramannādam | prāṇe śarīraṃ pratiṣṭhitam | śarīre prāṇaḥ pratiṣṭhitaḥ | tadetadannamanne pratiṣṭhitam | sa ya etadannamanne pratiṣṭhitaṃ veda pratitiṣṭhati | annavānannādo bhavati | mahān bhavati prajayā paśubhirbrahmavarcasena | mahān kīrtyā ||",
          translation:
            "Do not despise food — that is the vow. Prāṇa is food; the body is the eater of food. The body rests in prāṇa; prāṇa rests in the body. Thus food rests in food. He who knows this is established; becomes possessor and eater of food, great by progeny, cattle, brahma-radiance, fame.",
          hindi:
            '"अन्न की निन्दा मत कर" — यह व्रत है। प्राण ही अन्न है; शरीर अन्न-भोक्ता। प्राण में शरीर प्रतिष्ठित, शरीर में प्राण प्रतिष्ठित — इस प्रकार अन्न अन्न में प्रतिष्ठित है। जो इसे ऐसा जानता है — प्रतिष्ठित होता है; अन्नवान्, अन्न-भोक्ता, प्रजा-पशु-ब्रह्म-वर्चस्-कीर्ति से महान् होता है।',
          explanation:
            "First of three food-vows. Do not despise food. Food and the eater are interdependent — prāṇa is food, body eats; body is food (someday), prāṇa eats. The cycle is honored, not denigrated.",
          science:
            "Trophic interdependence: every eater is eaten. The biosphere is a single nested-eating system. The Upanishad's recognition is structural.",
          lifeLesson:
            "Never complain about food. Even bad food was offered by some chain of generosity. Eat with gratitude or do not eat.",
          keywords: ["FoodVow", "Reverence", "Cycle"],
        },
        {
          id: 8,
          sanskrit:
            "अन्नं न परिचक्षीत । तद्व्रतम् । आपो वा अन्नम् । ज्योतिरन्नादम् । अप्सु ज्योतिः प्रतिष्ठितम् । ज्योतिष्यापः प्रतिष्ठिताः । तदेतदन्नमन्ने प्रतिष्ठितम् । स य एतदन्नमन्ने प्रतिष्ठितं वेद प्रतितिष्ठति । अन्नवानन्नादो भवति । महान् भवति प्रजया पशुभिर्ब्रह्मवर्चसेन । महान् कीर्त्या ॥",
          transliteration:
            "annaṃ na paricakṣīta | tadvratam | āpo vā annam | jyotirannādam | apsu jyotiḥ pratiṣṭhitam | jyotiṣyāpaḥ pratiṣṭhitāḥ | tadetadannamanne pratiṣṭhitam | sa ya etadannamanne pratiṣṭhitaṃ veda pratitiṣṭhati | annavānannādo bhavati | mahān bhavati prajayā paśubhirbrahmavarcasena | mahān kīrtyā ||",
          translation:
            "Do not neglect food — that is the vow. Water is food; light is the eater. Light rests in water; water rests in light. Thus food rests in food. He who knows this is established; the rewards as above.",
          hindi:
            '"अन्न की उपेक्षा मत कर" — यह व्रत है। जल ही अन्न; ज्योति अन्न-भोक्ता। जल में ज्योति प्रतिष्ठित; ज्योति में जल प्रतिष्ठित। अन्न अन्न में प्रतिष्ठित। फल पूर्ववत्।',
          explanation:
            "Second food-vow. Do not neglect food. Water and light are mutual eaters/eaten. Different level of the same reciprocity.",
          science:
            "Photosynthesis: light + water → biological energy. The relationship is the foundation of nearly all earthly life. The Upanishad's metaphor is precise.",
          lifeLesson:
            "Feed yourself attentively — like the most important guest at your own table. Neglect is a form of disrespect to the prāṇa that runs you.",
          keywords: ["FoodVow", "Attentive", "Water"],
        },
        {
          id: 9,
          sanskrit:
            "अन्नं बहु कुर्वीत । तद्व्रतम् । पृथिवी वा अन्नम् । आकाशोऽन्नादः । पृथिव्यामाकाशः प्रतिष्ठितः । आकाशे पृथिवी प्रतिष्ठिता । तदेतदन्नमन्ने प्रतिष्ठितम् । स य एतदन्नमन्ने प्रतिष्ठितं वेद प्रतितिष्ठति । अन्नवानन्नादो भवति । महान् भवति प्रजया पशुभिर्ब्रह्मवर्चसेन । महान् कीर्त्या ॥",
          transliteration:
            "annaṃ bahu kurvīta | tadvratam | pṛthivī vā annam | ākāśo'nnādaḥ | pṛthivyāmākāśaḥ pratiṣṭhitaḥ | ākāśe pṛthivī pratiṣṭhitā | tadetadannamanne pratiṣṭhitam | sa ya etadannamanne pratiṣṭhitaṃ veda pratitiṣṭhati | annavānannādo bhavati | mahān bhavati prajayā paśubhirbrahmavarcasena | mahān kīrtyā ||",
          translation:
            "Produce abundant food — that is the vow. Earth is food; space is the eater. Space rests in earth; earth rests in space. Thus food rests in food. The fruit as above.",
          hindi:
            '"अन्न बहुत बना" — यह व्रत है। पृथ्वी ही अन्न; आकाश अन्न-भोक्ता। पृथ्वी में आकाश प्रतिष्ठित; आकाश में पृथ्वी प्रतिष्ठित। अन्न अन्न में प्रतिष्ठित। फल पूर्ववत्।',
          explanation:
            "Third food-vow. Produce much food. Generosity in food-production is itself the vow. Earth + space relate as food + eater.",
          science:
            "Food-security research: societies that produce surplus and distribute generously are most stable. The Upanishad's third vow is policy.",
          lifeLesson:
            "Be a net producer, not just a consumer. Whatever your domain, leave more than you take.",
          keywords: ["FoodVow", "Production", "Generosity"],
        },
        {
          id: 10,
          sanskrit:
            "न कञ्चन वसतौ प्रत्याचक्षीत । तद्व्रतम् । तस्माद्यया कया च विधया बह्वन्नं प्राप्नुयात् । अराध्यस्मा अन्नमित्याचक्षते । एतद्वै मुखतोऽन्नँ्राद्धम् । मुखतोऽस्मा अन्नँ्राध्यते । एतद्वै मध्यतोऽन्नँ्राद्धम् । मध्यतोऽस्मा अन्नँ्राध्यते । एतद्वा अन्ततोऽन्नँ्राद्धम् । अन्ततोऽस्मा अन्नँ्राध्यते । य एवं वेद । क्षेम इति वाचि । योगक्षेम इति प्राणापानयोः । कर्मेति हस्तयोः । गतिरिति पादयोः । विमुक्तिरिति पायौ । इति मानुषीः समाज्ञाः । अथ दैवीः । तृप्तिरिति वृष्टौ । बलमिति विद्युति । यश इति पशुषु । ज्योतिरिति नक्षत्रेषु । प्रजातिरमृतमानन्द इत्युपस्थे । सर्वमित्याकाशे । तत्प्रतिष्ठेत्युपासीत । प्रतिष्ठावान् भवति । तन्महमिति । महानुपासीत । महान् भवति । तन्मन इत्युपासीत । मानवान् भवति । तन्नम इत्युपासीत । नम्यन्तेऽस्मै कामाः । तद्ब्रह्मेत्युपासीत । ब्रह्मवान् भवति । तद्ब्रह्मणः परिमर इत्युपासीत । पर्येणं म्रियन्ते द्विषन्तः सपत्नाः । परि येऽप्रिया भ्रातृव्याः । स यश्चायं पुरुषे । यश्चासावादित्ये । स एकः । स य एवंवित् । अस्माल्लोकात्प्रेत्य । एतमन्नमयमात्मानमुपसंक्रम्य । एतं प्राणमयमात्मानमुपसंक्रम्य । एतं मनोमयमात्मानमुपसंक्रम्य । एतं विज्ञानमयमात्मानमुपसंक्रम्य । एतमानन्दमयमात्मानमुपसंक्रम्य । इमाँ्लोकान् कामान्नी कामरूप्यनुसंचरन् । एतत्साम गायन्नास्ते । हा३वु हा३वु हा३वु । अहमन्नमहमन्नमहमन्नम् । अहमन्नादोऽहमन्नादोऽहमन्नादः । अहं श्लोककृदहं श्लोककृदहं श्लोककृत् । अहमस्मि प्रथमजा ऋतस्य । पूर्वं देवेभ्योऽमृतस्य नाभायि । यो मा ददाति स इदेव माऽऽवाः । अहमन्नमन्नमदन्तमादि । अहं विश्वं भुवनमभ्यभवाम् । सुवर्ण ज्योतीः । य एवं वेद । इत्युपनिषत् ॥",
          transliteration:
            "na kañcana vasatau pratyācakṣīta | tadvratam | tasmādyayā kayā ca vidhayā bahvannaṃ prāpnuyāt | arādhyasmā annamityācakṣate | etadvai mukhato'nnaṃrāddham | mukhato'smā annaṃrādhyate | etadvai madhyato'nnaṃrāddham | madhyato'smā annaṃrādhyate | etadvā antato'nnaṃrāddham | antato'smā annaṃrādhyate | ya evaṃ veda | kṣema iti vāci | yogakṣema iti prāṇāpānayoḥ | karmeti hastayoḥ | gatiriti pādayoḥ | vimuktiriti pāyau | iti mānuṣīḥ samājñāḥ | atha daivīḥ | tṛptiriti vṛṣṭau | balamiti vidyuti | yaśa iti paśuṣu | jyotiriti nakṣatreṣu | prajātiramṛtamānanda ityupasthe | sarvamityākāśe | tatpratiṣṭhetyupāsīta | pratiṣṭhāvān bhavati | tanmahamiti | mahānupāsīta | mahān bhavati | tanmana ityupāsīta | mānavān bhavati | tannama ityupāsīta | namyante'smai kāmāḥ | tadbrahmetyupāsīta | brahmavān bhavati | tadbrahmaṇaḥ parimara ityupāsīta | paryeṇaṃ mriyante dviṣantaḥ sapatnāḥ | pari ye'priyā bhrātṛvyāḥ | sa yaścāyaṃ puruṣe | yaścāsāvāditye | sa ekaḥ | sa ya evaṃvit | asmāllokātpretya | etamannamayamātmānamupasaṃkramya | etaṃ prāṇamayamātmānamupasaṃkramya | etaṃ manomayamātmānamupasaṃkramya | etaṃ vijñānamayamātmānamupasaṃkramya | etamānandamayamātmānamupasaṃkramya | imāṃlokān kāmānnī kāmarūpyanusaṃcaran | etatsāma gāyannāste | hā³vu hā³vu hā³vu | ahamannamahamannamahamannam | ahamannādo'hamannādo'hamannādaḥ | ahaṃ ślokakṛdahaṃ ślokakṛdahaṃ ślokakṛt | ahamasmi prathamajā ṛtasya | pūrvaṃ devebhyo'mṛtasya nābhāyi | yo mā dadāti sa ideva mā''vāḥ | ahamannamannamadantamādi | ahaṃ viśvaṃ bhuvanamabhyabhavām | suvarṇa jyotīḥ | ya evaṃ veda | ityupaniṣat ||",
          translation:
            "Refuse no one shelter — that is the vow. Therefore by some means or another, gather food in abundance — they call this food 'arādhya' (worthy of welcome). [Various correspondences enumerated: human and divine.] He who knows all this — passing from this world, ascending through annamaya, prāṇamaya, manomaya, vijñānamaya, ānandamaya selves — wandering these worlds, eating what he wishes, taking form as he wishes — sits singing this Sāman: 'Hā vu hā vu hā vu! I am food! I am food! I am food! I am the eater of food! I am the eater of food! I am the eater of food! I am the verse-maker! I am the verse-maker! I am the verse-maker! I am the firstborn of ṛta — before the gods, in the navel of immortality. He who gives me to others by that has shared me. I, food, eat the eater of food. I have entered the whole world. I am golden-light, like the sun.' — He who knows thus. This is the Upaniṣad.",
          hindi:
            '"किसी को आवास से मना मत कर" — यह व्रत है। इसलिये किसी भी विधि से बहु-अन्न प्राप्त करो — उसे "अराध्य अन्न" कहते हैं। [विभिन्न मानुष-दैव संज्ञाएँ।] जो ऐसा जानता है — इस लोक से जाकर — अन्नमय, प्राणमय, मनोमय, विज्ञानमय, आनन्दमय आत्मा को क्रमशः पार करके — कामरूप होकर लोकों में विचरता है — यह साम गाता हुआ रहता है — "हा³वु हा³वु हा³वु! मैं अन्न, मैं अन्न, मैं अन्न! मैं अन्न-भोक्ता, मैं अन्न-भोक्ता, मैं अन्न-भोक्ता! मैं श्लोक-कर्ता, मैं श्लोक-कर्ता, मैं श्लोक-कर्ता! मैं ऋत का प्रथमजा — देवों से पहले, अमृत-नाभि में। जो मुझे देता है — उसने मुझे ही पाया। मैं — अन्न — अन्न-भोक्ता को खाता हूँ। मैंने पूरे भुवन में प्रवेश किया है। मैं सुवर्ण-ज्योति हूँ।" — जो ऐसा जानता है। यह उपनिषद् है।',
          explanation:
            "The grand finale. Refuse no guest shelter — third great vow. Many correspondences enumerated (human and divine). The realized seeker, having passed through all five kośas, sings the great Sāman: 'I am food, I am the eater of food.' Identity-claim of the cosmic Self. The final 'iti upaniṣat' marks the close of the entire teaching.",
          science:
            "Self-recognition across all roles is the highest contemplative attainment. The 'I am food / I am the eater' is a non-dual recognition that transcends the eater-eaten polarity.",
          lifeLesson:
            "Refuse no one shelter you can give. Refuse no one food you can offer. Such generosity is itself the door — the realized seeker is the one who has long practiced it.",
          keywords: ["Hospitality", "AhamAnnam", "Closing"],
        },
      
      ],
    },
  ],
};
