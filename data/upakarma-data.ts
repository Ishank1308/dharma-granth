/**
 * Canonical Upakarma & Yajnopavita Sanskara Data
 * 
 * Historical, scriptural, and liturgical documentation for:
 * - Rigvedic, Yajurvedic, and Samavedic Upakarma
 * - The anatomy and sacred symbolism of the Yajnopavita (3 strands, 9 strings, Brahmagranthi)
 * - The 5 core ritual stages (Kamokarshita Japam, Brahma-Yajna, Dharana, Visarjana, Veda-arambha)
 * - Authentic Sanskrit mantras, IAST, padaccheda, and translations
 * 
 * Conforms to:
 * - ASCII digits 0-9 only (No Devanagari numerals)
 * - Accessible, dignified Hindi addressing reader as 'आप'
 */

export interface UpakarmaMantra {
  id: string;
  title: string;
  titleHi: string;
  sanskrit: string;
  iast: string;
  hindi: string;
  english: string;
  significance: string;
  significanceHi: string;
  repetitions?: number;
}

export interface UpakarmaStep {
  stepNumber: number;
  name: string;
  nameHi: string;
  duration: string;
  durationHi: string;
  description: string;
  descriptionHi: string;
  rituals: string[];
  ritualsHi: string[];
  mantraRef?: string;
}

export interface YajnopavitaTantu {
  number: number;
  deity: string;
  deityHi: string;
  principle: string;
  principleHi: string;
}

export const YAJNOPAVITA_TANTUS: YajnopavitaTantu[] = [
  { number: 1, deity: 'Omkara (Pranava)', deityHi: 'ॐकार (प्रणव)', principle: 'The primordial unstruck sound and source of all Vedas.', principleHi: 'सृष्टि का मूल नाद और समस्त वेदों का उद्गम स्रोत।' },
  { number: 2, deity: 'Agni (Fire)', deityHi: 'अग्निदेव (पावक)', principle: 'Divine purifier, carrier of oblations, and inner metabolic radiance.', principleHi: 'परम पावक, हविष्य के वाहक और जठराग्नि व ज्ञान-तेज के प्रतीक।' },
  { number: 3, deity: 'Naga (Serpent / Earth)', deityHi: 'नागदेव (अनन्त)', principle: 'Prithivi firmness, patience, and awakening of vital life force.', principleHi: 'पृथ्वी की स्थिरता, धैर्य और प्राण-शक्ति की जागृति।' },
  { number: 4, deity: 'Soma (Moon)', deityHi: 'सोम (चन्द्रदेव)', principle: 'Cooling mind, divine nectar (Amrita), and emotional tranquility.', principleHi: 'शीतल मन, अमृत-तत्त्व और मानसिक सन्तुलन।' },
  { number: 5, deity: 'Pitris (Ancestors)', deityHi: 'पितृगण (पूर्वज)', principle: 'Gratitude to the lineage and preservation of ancestral values.', principleHi: 'पूर्वजों के प्रति कृतज्ञता और कुल-परम्परा का संरक्षण।' },
  { number: 6, deity: 'Prajapati (Creator)', deityHi: 'प्रजापति (स्रष्टा)', principle: 'Procreative responsibility, universal stewardship, and dharma.', principleHi: 'सृजनशीलता, विश्व-कल्याण और धर्म-पालन का दायित्व।' },
  { number: 7, deity: 'Vayu (Wind / Prana)', deityHi: 'वायुदेव (प्राण)', principle: 'Vital breath, unattached movement, and dynamic action.', principleHi: 'प्राण-वायु, अनासक्त गतिशीलता और कर्म-स्फूर्ति।' },
  { number: 8, deity: 'Surya (Sun)', deityHi: 'सूर्यनारायण (सविता)', principle: 'Supreme intellectual illumination and spiritual awakening.', principleHi: 'सविता का प्रकाश, प्रज्ञा और आत्म-ज्ञान की ज्योति।' },
  { number: 9, deity: 'Vishve-Devas (All Deities)', deityHi: 'विश्वेदेवाः (समस्त देव)', principle: 'Cosmic harmony and reverence toward all sentient beings.', principleHi: 'समस्त ब्रह्माण्डीय शक्तियों के प्रति समादर और सामञ्जस्य।' },
];

export const UPAKARMA_MANTRAS: Record<string, UpakarmaMantra> = {
  kamokarshin: {
    id: 'kamokarshin',
    title: 'Kamokarshin Manyurakarshin Prayashchitta Mantra',
    titleHi: 'कामोऽकार्षीन्मन्युरकार्षीन् प्रायश्चित्त मन्त्र',
    sanskrit: 'ॐ कामोऽकार्षीन्नमो नमः ।\nकामोऽकार्षीत्कामः करोति नाहं करोमि कामः कर्ता नाहं कर्ता कामः कारयिता नाहं कारयिता एष ते काम कामाय स्वाहा ॥\nमन्युरकार्षीन्नमो नमः ।\nमन्युरकार्षीन्मन्युः करोति नाहं करोमि मन्युः कर्ता नाहं कर्ता मन्युः कारयिता नाहं कारयिता एष ते मन्यो मन्यवे स्वाहा ॥',
    iast: 'oṃ kāmo\'kārṣīnnamo namaḥ |\nkāmo\'kārṣītkāmaḥ karoti nāhaṃ karomi kāmaḥ kartā nāhaṃ kartā kāmaḥ kārayitā nāhaṃ kārayitā eṣa te kāma kāmāya svāhā ||\nmanyurakārṣīnnamo namaḥ |\nmanyurakārṣīnmanyuḥ karoti nāhaṃ karomi manyuḥ kartā nāhaṃ kartā manyuḥ kārayitā nāhaṃ kārayitā eṣa te manyo manyave svāhā ||',
    hindi: 'काम (इच्छा/वासना) ने मुझसे त्रुटि करवाई, काम को नमस्कार। काम ही करता है, मैं वास्तविक कर्ता नहीं हूँ; काम ही कराने वाला है, मैं केवल साक्षी हूँ। हे काम! यह आहुति तुम्हें समर्पित है। क्रोध (अहंकार/आवेश) ने मुझसे भूल करवाई, क्रोध को नमस्कार। क्रोध ही करता है, मैं कर्ता नहीं हूँ। हे क्रोध! यह समर्पण तुम्हें समर्पित है।',
    english: 'Desire caused the error, salutations unto Desire. Desire acts, I am not the true doer; Desire is the instigator, I am but the witness. O Desire, this oblation is offered unto you! Anger caused the slip, salutations unto Anger. Anger acts, I am not the doer. O Anger, this expiation is offered unto you.',
    significance: 'The supreme psychological confession in Vedic liturgy. Rather than suppressing guilt, the seeker objectively dissociates the pure Atman (Self) from Kama (desire) and Manyu (wrath), offering both back to their cosmic roots.',
    significanceHi: 'यह वैदिक प्रायश्चित्त का सर्वोच्च मनोवैज्ञानिक मन्त्र है। इसमें साधक अपराध-बोध में डूबने के बजाय काम और क्रोध को प्रकृति के विकार मानकर आत्म-स्वरूप से पृथक करता है और 108 बार जप कर शुद्ध होता है।',
    repetitions: 108,
  },
  dharana: {
    id: 'dharana',
    title: 'Yajnopavita Dharana Mantra',
    titleHi: 'यज्ञोपवीत धारण मन्त्र',
    sanskrit: 'यज्ञोपवीतं परमं पवित्रं प्रजापतेर्यत्सहजं पुरस्तात् ।\nआयुष्यमग्र्यं प्रतिमुञ्च शुभ्रं यज्ञोपवीतं बलमस्तु तेजः ॥',
    iast: 'yajñopavītaṃ paramaṃ pavitraṃ prajāpateryatsahajaṃ purastāt |\nāyuṣyamagryaṃ pratimuñca śubhraṃ yajñopavītaṃ balamastu tejaḥ ||',
    hindi: 'यह यज्ञोपवीत परम पवित्र है, जो सृष्टि के आरम्भ में प्रजापति ब्रह्मा जी के साथ ही प्रकट हुआ था। यह दीर्घायु, तेजस्विता और अग्रगामी चेतना प्रदान करने वाला है। मैं इस शुभ्र (श्वेत) यज्ञोपवीत को धारण करता हूँ; यह मुझे शारीरिक बल, मानसिक ओज और आध्यात्मिक तेज प्रदान करे।',
    english: 'The sacred thread (Yajnopavita) is supremely pure, born in the beginning alongside Prajapati the Creator. Bestower of longevity, foremost brilliance, and vigor, I put on this radiant white thread; may it endow me with physical strength and spiritual effulgence.',
    significance: 'Chanted while holding the new Yajnopavita with both hands, palms facing upward toward Surya, passing it over the head onto the left shoulder across the right hip (Upavita position).',
    significanceHi: 'नूतन यज्ञोपवीत को दोनों हाथों में फैलाकर सूर्यदेव को अर्घ्य रूप में दिखाते हुए सिर के ऊपर से बाएं कंधे पर और दाईं कमर के नीचे धारण करते समय यह मन्त्र बोला जाता है।',
  },
  visarjana: {
    id: 'visarjana',
    title: 'Yajnopavita Visarjana Mantra',
    titleHi: 'यज्ञोपवीत विसर्जन मन्त्र',
    sanskrit: 'एतावद्दिनपर्यन्तं ब्रह्मत्वं धारितं मया ।\nजीर्णत्वात्ते परित्यागो गच्छ सूत्र यथासुखम् ॥',
    iast: 'etāvaddinaparyantaṃ brahmatvaṃ dhāritaṃ mayā |\njīrṇatvātte parityāgo gaccha sūtra yathāsukham ||',
    hindi: 'इतने दिनों तक आपने मेरे ब्रह्म-तेज और गायत्री साधना की रक्षा की और ब्रह्मत्व को धारण कराया। अब जीर्ण (पुराना) हो जाने के कारण मैं आपका श्रद्धापूर्वक परित्याग करता हूँ। हे पवित्र सूत्र! आप सुखपूर्वक अपने मूल तत्त्व (जल/प्रकृति) में विलीन हो जाएं।',
    english: 'Until this day, you have upheld and preserved the sacred Brahma-consciousness within me. Having become worn and aged, I now release you with gratitude; depart gracefully, O sacred thread, into the peaceful elements.',
    significance: 'Recited while removing the old thread from beneath the arms, without letting it touch the ground, and immersing it into flowing water, well, or placing at the base of a sacred tree.',
    significanceHi: 'पुराने यज्ञोपवीत को उतारते समय यह कृतज्ञता मन्त्र बोला जाता है। इसे कभी भी भूमि पर नहीं गिराया जाता; बहते जल में अथवा पवित्र वृक्ष की जड़ में विसर्जित किया जाता है।',
  },
};

export const UPAKARMA_STEPS: UpakarmaStep[] = [
  {
    stepNumber: 1,
    name: 'Maha-Sankalpa & Kamokarshita Japam (Expiation)',
    nameHi: 'महा-सङ्कल्प एवं कामोऽकार्षीत् जप (प्रायश्चित्त)',
    duration: '20-30 mins',
    durationHi: '20-30 मिनट',
    description: 'The ritual purification acknowledging all slips of speech, thought, and sensory indulgence accumulated over the past Vedic calendar year.',
    descriptionHi: 'विगत एक वर्ष में वाणी, मन, कर्म और इन्द्रिय-आसक्ति से हुई त्रुटियों का विसर्जन और अन्तःकरण की शुद्धि।',
    rituals: [
      'Take ritual bath (Panchagavya, sacred river water, or Ganga-jal).',
      'Wear clean dhoti and uttariya with sacred darbha grass ring (Pavitram) on the right ring finger.',
      'Take achamana and pronounce the grand temporal coordinates (Maha-Sankalpa).',
      'Perform 108 repetitions of the Kamokarshin Manyurakarshin mantra.',
    ],
    ritualsHi: [
      'पवित्र नदी-जल अथवा गंगाजल से मार्जन एवं स्नान करें।',
      'दाहिने हाथ की अनामिका अँगुली में कुशा की पवित्री धारण करें।',
      'आचमन कर देश-काल-पात्र का उच्चारण करते हुए महा-सङ्कल्प लें।',
      'कामोऽकार्षीन्मन्युरकार्षीत् मन्त्र का 108 बार शान्त भाव से जप करें।',
    ],
    mantraRef: 'kamokarshin',
  },
  {
    stepNumber: 2,
    name: 'Brahma-Yajna & Devarshi-Pitru Tarpana',
    nameHi: 'ब्रह्म-यज्ञ एवं देवर्षि-पितृ तर्पण',
    duration: '15-20 mins',
    durationHi: '15-20 मिनट',
    description: 'Offering sacred water oblations to Brahma, the divine seers of the Veda branches, and the ancestors of the lineage.',
    descriptionHi: 'ऋग्वेद, यजुर्वेद, सामवेद और अथर्ववेद के ऋषियों, काण्ड-ऋषियों एवं पितृगणों को जल-अञ्जलि अर्पित करना।',
    rituals: [
      'Recite the opening suktas of the four Vedas to honor the lineage of Knowledge.',
      'Deva Tarpana: Water poured across the tips of the fingers (Deva-Tirtha).',
      'Rishi Tarpana: Water poured across the base of the little finger (Arsha-Tirtha).',
      'Pitru Tarpana: Water mixed with black sesame poured between thumb and index finger (Pitru-Tirtha).',
    ],
    ritualsHi: [
      'चारों वेदों के प्रारम्भिक सूक्तों का पाठ कर विद्या-परम्परा को प्रणाम करें।',
      'देव-तर्पण: अँगुलियों के अग्रभाग (देव-तीर्थ) से जल अर्पित करें।',
      'ऋषि-तर्पण: कनिष्ठिका के मूल (ऋषि-तीर्थ) से जल अर्पित करें।',
      'पितृ-तर्पण: अँगूठे और तर्जनी के मध्य (पितृ-तीर्थ) से काले तिल मिश्रित जल अर्पित करें।',
    ],
  },
  {
    stepNumber: 3,
    name: 'Yajnopavita Dharana (Investiture of New Thread)',
    nameHi: 'नूतन यज्ञोपवीत धारण',
    duration: '10 mins',
    durationHi: '10 मिनट',
    description: 'Consecrating and donning the new sacred thread endowed with Gayatri and Aditya effulgence.',
    descriptionHi: 'गायत्री मन्त्र और सूर्य-ऊर्जा से अभिमन्त्रित नूतन यज्ञोपवीत को विधिवत् धारण करना।',
    rituals: [
      'Hold the new Yajnopavita with both thumbs and index fingers, facing East toward the Sun.',
      'Chant Gayatri Mantra 10 times over the thread to awaken its spiritual potency.',
      'Recite the Yajnopavita Dharana Mantra and slip the thread over the head onto the left shoulder.',
      'Touch water, perform achamana, and offer namaskara to Surya Narayana.',
      'Married men (Grihasthas) wear two Yajnopavitas (one for self, one representing the spouse\'s spiritual partnership); those with Uttariya vow wear three.',
    ],
    ritualsHi: [
      'नूतन जनेऊ को दोनों हाथों के अँगूठों से फैलाकर पूर्व दिशा में सूर्य के सम्मुख रखें।',
      '10 बार गायत्री मन्त्र पढ़कर जनेऊ को अभिमन्त्रित करें।',
      'यज्ञोपवीत धारण मन्त्र बोलते हुए बाएं कंधे से दाहिनी कमर की ओर पहनें।',
      'आचमन करें और भगवान् सूर्य को प्रणाम करें।',
      'गृहस्थ दो यज्ञोपवीत (एक स्वयं का और एक धर्मपत्नी के निमित्त) धारण करते हैं।',
    ],
    mantraRef: 'dharana',
  },
  {
    stepNumber: 4,
    name: 'Yajnopavita Visarjana (Removal of Old Thread)',
    nameHi: 'जीर्ण यज्ञोपवीत विसर्जन',
    duration: '5 mins',
    durationHi: '5 मिनट',
    description: 'Respectfully removing the old, worn thread without allowing it to touch the ground.',
    descriptionHi: 'वर्ष भर धारण किए गए पुराने यज्ञोपवीत को आदरपूर्वक विसर्जित करना।',
    rituals: [
      'Bring the old Yajnopavita down from the left shoulder beneath the arm.',
      'Recite the Visarjana Mantra expressing gratitude for protection of Brahma-tejas.',
      'Immerse into a river, clean lake, well, or place at the roots of a sacred Peepal/Tulsi plant.',
      'Perform achamana to seal the ritual.',
    ],
    ritualsHi: [
      'पुराने जनेऊ को कंधे से नीचे उतारकर हाथ में लें (भूमि पर न गिरने दें)।',
      'विसर्जन मन्त्र का श्रद्धापूर्वक पाठ करें।',
      'इसे बहती नदी, कुएं अथवा पीपल/तुलसी के मूल में विसर्जित करें।',
      'आचमन कर शुद्धि प्राप्त करें।',
    ],
    mantraRef: 'visarjana',
  },
  {
    stepNumber: 5,
    name: 'Kanda Rishi Tarpana & Veda-Arambha (Study Resumption)',
    nameHi: 'काण्ड ऋषि तर्पण एवं वेद-आरम्भ',
    duration: '20 mins',
    durationHi: '20 मिनट',
    description: 'Formally inaugurating the fresh cycle of Vedic self-study (Svadhyaya) after the monsoon consolidation.',
    descriptionHi: 'वर्षा ऋतु में स्वाध्याय के विराम के पश्चात् पुनः वेदों के अध्ययन का मङ्गल शुभारम्भ।',
    rituals: [
      'Offer oblations to the specific Kanda Rishis of one\'s Shakha (e.g. Prajapati, Soma, Agni, Vishve-Devas for Taittiriya).',
      'Chant the first verse of one\'s Shakha Samhita with correct svara (accents).',
      'Commit to daily Gayatri Sandhyavandanam for the coming year.',
      'Seek blessings from preceptors, elders, and distribute prasad.',
    ],
    ritualsHi: [
      'अपनी वेद-शाखा के काण्ड-ऋषियों (प्रजापति, सोम, अग्नि आदि) का तर्पण करें।',
      'अपनी शाखा के प्रथम मन्त्र का सस्वर पाठ करें।',
      'आगामी वर्ष के लिए नित्य त्रिकाल सन्ध्यावन्दन का सङ्कल्प लें।',
      'गुरुजनों और माता-पिता का चरण-स्पर्श कर आशीर्वाद प्राप्त करें।',
    ],
  },
];

export const REGIONAL_UPAKARMA_TRADITIONS = [
  {
    region: 'Tamil Nadu & Kerala',
    name: 'Avani Avittam & Gayatri Japam',
    nameHi: 'आवनि अवित्तम एवं गायत्री जपम्',
    timing: 'Shravana Purnima (Tamil month of Avani)',
    description: 'Celebrated with great solemnity. The day immediately following Upakarma is celebrated as Gayatri Japam Day, dedicated to reciting 1,008 Gayatri Mantras to recharge spiritual vitality.',
    descriptionHi: 'तमिल आवनि मास की पूर्णिमा को आवनि अवित्तम कहा जाता है। इसके अगले दिन ‘गायत्री जपम्’ होता है, जिसमें कम से कम 1008 गायत्री मन्त्रों का जप किया जाता है।',
  },
  {
    region: 'Karnataka & Andhra Pradesh',
    name: 'Shravana Upakarma & Rishi Panchami',
    nameHi: 'श्रावण उपाकर्म एवं ऋषि पञ्चमी',
    timing: 'Shravana Shukla Purnima',
    description: 'Rigvedic and Yajurvedic families gather in temples or riverbanks. The following Shukla Panchami (Rishi Panchami) is observed with special veneration of the Saptarshis.',
    descriptionHi: 'नदियों और सरोवरों के तट पर सामूहिक उपाकर्म होता है। इसके बाद ऋषि पञ्चमी पर सप्तर्षियों का विशेष पूजन किया जाता है।',
  },
  {
    region: 'Maharashtra & Gujarat',
    name: 'Shravani Parva & Baleve',
    nameHi: 'श्रावणी पर्व एवं नारली पूर्णिमा',
    timing: 'Shravana Purnima / Narali Purnima',
    description: 'Along the Konkan coast, Shravani Upakarma coincides with Narali Purnima, offering coconuts to Varuna Deva for calm seas alongside sacred thread renewal.',
    descriptionHi: 'महाराष्ट्र और कोंकण में श्रावणी पर्व के साथ समुद्र-देव वरुण को नारियल अर्पित किया जाता है और जनेऊ बदला जाता है।',
  },
  {
    region: 'North India & Varanasi',
    name: 'Shravani Snana & Raksha Parva',
    nameHi: 'श्रावणी स्नान एवं रक्षा पर्व',
    timing: 'Shravana Purnima (Raksha Bandhan)',
    description: 'Pundits and scholars gather at holy ghats (Dashashwamedha, Har Ki Pauri) for Homa, Veda chanting, and collective Yajnopavita investiture before sisters tie the sacred Raksha sutra.',
    descriptionHi: 'काशी और हरिद्वार के घाटों पर वैदिक विद्वान सामूहिक हवन, वेद-पाठ और जनेऊ परिवर्तन करते हैं, जिसके पश्चात् रक्षा-सूत्र बाँधा जाता है।',
  },
];

export const UPAKARMA_FAQS = [
  {
    question: 'What is the literal meaning and spiritual purpose of Upakarma?',
    questionHi: 'उपाकर्म का शाब्दिक अर्थ और आध्यात्मिक उद्देश्य क्या है?',
    answer: 'Upakarma literally means "bringing near" or "inaugural commencement" (Upa + Karma). In the Vedic educational system, students studied outdoors during the cool months. During the torrential monsoon (Shravana), study paused; Upakarma marks the sacred resumption of Veda study (Adhyayana), expiating lapses through 108 Kamokarshita Japa and renewing the Yajnopavita.',
    answerHi: '‘उपाकर्म’ का अर्थ है किसी कार्य के समीप जाना अथवा मङ्गल शुभारम्भ करना। प्राचीन काल में वर्षा ऋतु में वेद-पाठ स्थगित रहता था। श्रावण पूर्णिमा को वर्ष भर के प्रमादों का प्रायश्चित्त कर पुनः वेदों का अध्ययन आरम्भ किया जाता था, जिसे उपाकर्म कहते हैं।',
  },
  {
    question: 'What do the three strands and nine threads of the Yajnopavita symbolize?',
    questionHi: 'यज्ञोपवीत के तीन सूत्रों और नौ तन्तुओं का क्या आध्यात्मिक रहस्य है?',
    answer: 'The three strands represent the Trimurtis (Brahma, Vishnu, Shiva), the three Gunas (Sattva, Rajas, Tamas), and the three fundamental cosmic debts: Deva Rina (to the gods), Rishi Rina (to the seers), and Pitru Rina (to ancestors). The nine threads within each strand symbolize nine divine principles: Omkara, Agni, Naga, Soma, Pitris, Prajapati, Vayu, Surya, and the Vishve-Devas. The sacred knot (Brahmagranthi) signifies non-dual Brahman.',
    answerHi: 'यज्ञोपवीत के तीन सूत्र तीन ऋणों (देव-ऋण, ऋषि-ऋण, पितृ-ऋण) और तीन गुणों के प्रतीक हैं। प्रत्येक सूत्र के नौ तन्तु नौ दिव्य शक्तियों (ॐकार, अग्नि, नाग, सोम, पितृ, प्रजापति, वायु, सूर्य और विश्वेदेवाः) के प्रतीक हैं। इसकी ब्रह्मग्रन्थि अद्वैत ब्रह्म की एकता को दर्शाती है।',
  },
  {
    question: 'Why do married men wear two or three Yajnopavitas?',
    questionHi: 'विवाहित गृहस्थ दो अथवा तीन यज्ञोपवीत क्यों धारण करते हैं?',
    answer: 'A bachelor (Brahmachari) wears one Yajnopavita of three strands. Upon marriage, the householder (Grihastha) wears two Yajnopavitas (six strands total)—the second set spiritually represents and protects his spouse, as Vedic rituals require husband and wife to act as an indivisible unit (Dampati). Those taking a vow of Uttariya (upper cloth) wear a third set.',
    answerHi: 'ब्रह्मचारी एक यज्ञोपवीत (3 धागे) पहनता है। विवाह के पश्चात् गृहस्थ दो यज्ञोपवीत (कुल 6 धागे) धारण करता है, जिसमें दूसरा यज्ञोपवीत धर्मपत्नी के आध्यात्मिक प्रतिनिधित्व का प्रतीक है क्योंकि सनातन धर्म में दम्पति मिलकर ही यज्ञ के अधिकारी होते हैं।',
  },
  {
    question: 'Why is the Kamokarshin Manyurakarshin mantra chanted 108 times during Upakarma?',
    questionHi: 'उपाकर्म में ‘कामोऽकार्षीन्मन्युरकार्षीत्’ मन्त्र का 108 बार जप क्यों किया जाता है?',
    answer: 'The Taittiriya Aranyaka prescribes this mantra for psychological catharsis and spiritual expiation. It acknowledges that human lapses arise from the impulses of Kama (desire) and Manyu (wrath). By chanting it 108 times, the seeker detaches pure consciousness from primal drives, restoring inner clarity before recommencing sacred studies.',
    answerHi: 'तैत्तिरीय आरण्यक के अनुसार मनुष्य से जो भी पाप या त्रुटियाँ होती हैं, वे काम (वासना) और मन्यु (क्रोध) के वशीभूत होकर होती हैं। इस मन्त्र का 108 बार जप करने से साधक इन विकारों को साक्षी भाव से त्याग कर अन्तःकरण की शुद्धि प्राप्त करता है।',
  },
];
