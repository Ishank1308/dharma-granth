/**
 * Short summaries of the four padas of the Patanjali Yoga Sutra (योगसूत्र सार),
 * in Hindi and English, with the key sutras of each pada.
 *
 * Editorial text, not scripture: a plain retelling of what each pada covers.
 * Sutra numbers follow the text in public/data/scriptures-full/yogasutra.json
 * (51, 55, 55 and 34 sutras). Shown on /scripture/yogasutra/summary/ and at
 * the top of each pada. Set `review` to 'approved' (with reviewer and date)
 * once a reviewer has read the entry against the text.
 */

import type { ChapterSummary } from './chapter-summaries';

export const yogasutraPadaSummaries: ChapterSummary[] = [
  {
    chapter: 1,
    nameHi: 'समाधि पाद',
    nameEn: 'Samādhi Pāda: on absorption',
    summaryHi:
      'पहला पाद योग की परिभाषा से आरम्भ होता है: चित्त की वृत्तियों का निरोध ही योग है। तब द्रष्टा अपने स्वरूप में स्थित होता है; अन्य समय वह वृत्तियों के समान रूप वाला प्रतीत होता है। पाँच वृत्तियाँ बताई गई हैं: प्रमाण, विपर्यय, विकल्प, निद्रा और स्मृति। इनका निरोध अभ्यास और वैराग्य से होता है। सम्प्रज्ञात और असम्प्रज्ञात समाधि का वर्णन है, और ईश्वर-प्रणिधान को एक स्वतन्त्र मार्ग बताया गया है; ईश्वर का वाचक प्रणव (ॐ) है। साधना के नौ विघ्नों और उनके उपायों के बाद पाद निर्बीज समाधि पर समाप्त होता है।',
    summaryEn:
      'The first pada opens with the definition: yoga is the stilling of the movements of the mind. Then the seer rests in its own nature; at other times it seems to take the form of those movements. Five kinds of mental movement are named: valid knowledge, error, imagination, sleep and memory. They are stilled through steady practice and non-attachment. Patanjali describes samadhi with and without an object, and offers devotion to Ishvara as a path of its own, Ishvara being expressed by the syllable Om. After naming nine obstacles to practice and their remedies, the pada ends with seedless samadhi.',
    keyVerses: [
      { verse: 2, note: 'Yoga is the stilling of the movements of the mind (yogaś citta-vṛtti-nirodhaḥ).' },
      { verse: 3, note: 'Then the seer abides in its own true form.' },
      { verse: 12, note: 'The movements are stilled by practice (abhyāsa) and non-attachment (vairāgya).' },
      { verse: 23, note: 'Or through devotion to Ishvara (īśvara-praṇidhāna).' },
      { verse: 27, note: 'Ishvara is expressed by the pranava, Om.' },
      { verse: 33, note: 'Friendliness, compassion, gladness and equanimity bring clarity to the mind.' },
    ],
    review: 'draft',
  },
  {
    chapter: 2,
    nameHi: 'साधन पाद',
    nameEn: 'Sādhana Pāda: on practice',
    summaryHi:
      'दूसरा पाद साधना का मार्ग बताता है। तप, स्वाध्याय और ईश्वर-प्रणिधान को क्रियायोग कहा गया है, जो क्लेशों को क्षीण करता है। पाँच क्लेश हैं: अविद्या, अस्मिता, राग, द्वेष और अभिनिवेश, और अविद्या ही शेष सबकी भूमि है। सूत्र कहता है कि जो दुःख अभी आया नहीं, वही त्यागने योग्य है; उसका कारण द्रष्टा और दृश्य का संयोग है, और उसका उपाय अविचल विवेक-ख्याति है। इसके लिए योग के आठ अंग बताए गए हैं। पाँच यम (अहिंसा, सत्य, अस्तेय, ब्रह्मचर्य, अपरिग्रह), पाँच नियम (शौच, सन्तोष, तप, स्वाध्याय, ईश्वर-प्रणिधान), स्थिर और सुखद आसन, प्राणायाम और प्रत्याहार इस पाद में विस्तार से समझाए गए हैं।',
    summaryEn:
      'The second pada lays out the path of practice. Austerity, self-study and devotion to Ishvara together form kriya yoga, which weakens the afflictions. The five afflictions are ignorance, the sense of I-am, attachment, aversion and clinging to life, and ignorance is the ground of all the rest. Suffering that has not yet come is what is to be avoided; its cause is the joining of the seer with the seen, and its remedy is unwavering discernment. For this Patanjali gives the eight limbs of yoga. This pada explains the first five in detail: the five restraints (non-violence, truthfulness, non-stealing, continence, non-possessiveness), the five observances (purity, contentment, austerity, self-study, devotion to Ishvara), a steady and easy posture, breath regulation and withdrawal of the senses.',
    keyVerses: [
      { verse: 1, note: 'Austerity, self-study and devotion to Ishvara are kriya yoga.' },
      { verse: 3, note: 'The five afflictions (kleśas): avidyā, asmitā, rāga, dveṣa, abhiniveśa.' },
      { verse: 16, note: 'Suffering that is yet to come is to be avoided (heyaṃ duḥkham anāgatam).' },
      { verse: 26, note: 'Unwavering discernment (viveka-khyāti) is the means of release.' },
      { verse: 29, note: 'The eight limbs of yoga, from yama to samādhi.' },
      { verse: 46, note: 'Posture should be steady and easy (sthira-sukham āsanam).' },
    ],
    review: 'draft',
  },
  {
    chapter: 3,
    nameHi: 'विभूति पाद',
    nameEn: 'Vibhūti Pāda: on inner powers',
    summaryHi:
      'तीसरा पाद योग के तीन अन्तरङ्ग अंगों से आरम्भ होता है। चित्त को एक स्थान पर बाँधना धारणा है, उसी में प्रत्यय का एकतान प्रवाह ध्यान है, और जब केवल ध्येय ही भासित हो और अपना स्वरूप शून्य-सा हो जाए, वह समाधि है। तीनों का एक विषय पर साथ होना संयम कहलाता है। चित्त के निरोध, समाधि और एकाग्रता परिणामों के बाद विभिन्न विषयों पर संयम से उत्पन्न होने वाली विभूतियों (सिद्धियों) का वर्णन है। पर सूत्र स्पष्ट चेतावनी देता है कि ये समाधि में विघ्न हैं और केवल व्युत्थान की अवस्था में सिद्धियाँ लगती हैं। इनमें भी वैराग्य होने पर बन्धन का बीज नष्ट होता है, और सत्त्व तथा पुरुष की शुद्धि समान होने पर कैवल्य होता है।',
    summaryEn:
      'The third pada begins with the three inner limbs of yoga. Holding the mind to one place is concentration (dharana); an unbroken flow of attention there is meditation (dhyana); and when only the object shines forth, as if empty of the mind’s own form, that is samadhi. The three together on one object are called samyama. After describing the transformations of the mind toward stillness and one-pointedness, Patanjali lists the powers (vibhutis, siddhis) that arise from samyama on various objects. He warns plainly that these are obstacles to samadhi and only seem like powers to the outward-turned mind. Through non-attachment even to them, the seed of bondage is destroyed, and when the purity of the mind equals that of the purusha, there is kaivalya, freedom.',
    keyVerses: [
      { verse: 1, note: 'Concentration (dhāraṇā) is binding the mind to one place.' },
      { verse: 2, note: 'Meditation (dhyāna) is the unbroken flow of attention there.' },
      { verse: 3, note: 'Samādhi: only the object shines, as if empty of one’s own form.' },
      { verse: 4, note: 'The three together are samyama.' },
      { verse: 37, note: 'The powers are obstacles to samādhi, though they seem powers to the outward mind.' },
      { verse: 55, note: 'Kaivalya comes when mind and purusha are equal in purity.' },
    ],
    review: 'draft',
  },
  {
    chapter: 4,
    nameHi: 'कैवल्य पाद',
    nameEn: 'Kaivalya Pāda: on freedom',
    summaryHi:
      'अन्तिम पाद बताता है कि सिद्धियाँ जन्म, औषधि, मन्त्र, तप और समाधि से उत्पन्न होती हैं, और समाधि से उत्पन्न चित्त ही संस्कारों से मुक्त होता है। योगी का कर्म न शुक्ल होता है न कृष्ण। वासनाओं, संस्कारों और काल के क्रम का विवेचन है। एक ही वस्तु को भिन्न चित्त भिन्न रूप से देखते हैं, इसलिए वस्तु और चित्त अलग हैं। चित्त स्वयं प्रकाशित नहीं है, वह पुरुष द्वारा देखा जाता है और पुरुष के लिए ही कार्य करता है। जिसे यह भेद दिख जाता है, उसका चित्त विवेक की ओर झुककर कैवल्य की ओर बढ़ता है। धर्ममेघ समाधि से क्लेश और कर्म निवृत्त होते हैं, और गुण अपने कारण में लीन हो जाते हैं। यही कैवल्य है: चिति-शक्ति का अपने स्वरूप में प्रतिष्ठित होना।',
    summaryEn:
      'The last pada says that powers arise from birth, herbs, mantra, austerity or samadhi, and only the mind born of meditation is free of stored impressions. The yogi’s action is neither white nor black. Patanjali examines latent tendencies, impressions and the sequence of time. Because different minds see the same object differently, the object is distinct from the mind. The mind is not self-luminous; it is seen by the purusha and works for the purusha’s sake. For one who sees this distinction, the mind bends toward discernment and leans toward freedom. In dharma-megha samadhi the afflictions and karma cease, and the gunas, their purpose fulfilled, return to their source. That is kaivalya: the power of pure awareness established in its own nature.',
    keyVerses: [
      { verse: 1, note: 'Powers arise from birth, herbs, mantra, austerity or samādhi.' },
      { verse: 15, note: 'The same object, seen by different minds: object and mind are distinct.' },
      { verse: 26, note: 'The mind, bent toward discernment, leans toward kaivalya.' },
      { verse: 29, note: 'Dharma-megha samādhi, the “cloud of dharma”.' },
      { verse: 34, note: 'Kaivalya: the gunas return to their source; awareness rests in itself.' },
    ],
    review: 'draft',
  },
];
