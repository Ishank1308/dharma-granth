const fs = require('fs');
const path = require('path');

const aitareyaJsonPath = path.resolve('public/data/scriptures-full/aitareya.json');
const aitareyaTsPath = path.resolve('data/scriptures/aitareya.ts');

const oldJson = JSON.parse(fs.readFileSync(aitareyaJsonPath, 'utf8'));

// Define the 10 mantras of 1.3.1 to 1.3.10
const missingMantras1_3 = [
  {
    number: 1,
    sanskrit: "स ईक्षतेमौ नु लोकाश्च लोकपालाश्चान्नमभ्य एभ्यः सृजा इति ॥ १ ॥",
    transliteration: "sa īkṣatemau nu lokāśca lokapālāścānnamabhya ebhyaḥ sṛjā iti || 1 ||",
    translation: "He reflected: 'Here are the worlds and the world-guardians. Let me now create food for them.'",
    hindi: "उसने विचार किया — 'ये लोक और लोकपाल तो बन गए; अब इनके लिये अन्न की सृष्टि करूँ।' ॥ १ ॥",
    explanation: "The cosmic drama moves from structure to nourishment. Having created the faculties and their presiding devas, the Self recognizes that embodiment requires sustenance. Creation without food cannot endure.",
    science: "Thermodynamics of living systems (Schrödinger, 'What is Life?'): living organisms maintain negative entropy only by continually importing free energy from the environment as food.",
    lifeLesson: "Every creative endeavor requires ongoing nourishment to survive. Ideation without execution and sustenance quickly dissipates.",
    keywords: ["CreationOfFood", "Nourishment", "Entropy", "Sustenance"]
  },
  {
    number: 2,
    sanskrit: "सोऽपोऽभ्यतपत्ताभ्योऽभितप्ताभ्यो मूर्तिरजायत । या वै सा मूर्तिरजायतान्नं वै तत् ॥ २ ॥",
    transliteration: "so'po'bhyatapattābhyo'bhitaptābhyo mūrtirajāyata | yā vai sā mūrtirajāyatānnaṃ vai tat || 2 ||",
    translation: "He heated the waters with tapas. From the waters thus heated, a solid form arose. That form which was born is food indeed.",
    hindi: "उसने जलों पर तप (सङ्कल्प) किया। उस तप्त जल से एक मूर्ति (ठोस रूप) उत्पन्न हुई। जो वह मूर्ति उत्पन्न हुई, वही वस्तुतः अन्न है। ॥ २ ॥",
    explanation: "Food emerges from the union of energy (tapas/heat) and primal matter (water). Solid forms crystallize from energetic fluid substrates.",
    science: "Abiogenesis and prebiotic chemistry: hydrothermal vents and thermal gradients in ancient oceans generated the organic molecules and amino acids that formed primal food.",
    lifeLesson: "Crystallization requires focused heat (effort) applied to fluid ideas. Pressure and dedication turn fluid possibilities into concrete reality.",
    keywords: ["Tapas", "Crystallization", "SolidForm", "PrebioticChemistry"]
  },
  {
    number: 3,
    sanskrit: "तदेतत्सृष्टं पराङत्यजिघांसत्तद्वाचाजिघृक्षत्तन्नाशक्नोद्वाचा ग्रहीतुम् । स यद्धैनद्वाचाग्रहैष्यदभिव्याहृत्य हैवान्नमत्रप्स्यत् ॥ ३ ॥",
    transliteration: "tadētatsṛṣṭaṃ parāṅatyajighāṃsattadvācājighṛkṣattannāśaknodvācā grahītum | sa yaddhainadvācāgrahaiṣyadabhivyāhṛtya haivānnamatrapsyat || 3 ||",
    translation: "That food, being created, tried to flee. He sought to grasp it with speech. He could not grasp it with speech. Had he grasped it with speech, merely by naming food one would be satisfied.",
    hindi: "वह उत्पन्न हुआ अन्न भागने लगा। उसने उसे वाणी से पकड़ना चाहा, पर वाणी से न पकड़ सका। यदि वाणी से पकड़ लेता, तो केवल अन्न का नाम लेने मात्र से मनुष्य तृप्त हो जाता। ॥ ३ ॥",
    explanation: "A profound psychological and physical truth: speaking about a thing is not experiencing or consuming it. Words represent reality, but speech cannot nourish the body.",
    science: "Semiotics and cognitive neuroscience: the linguistic representation of an object (signifier) does not possess the physical or biochemical properties of the object itself.",
    lifeLesson: "Don't confuse talking about goals with achieving them. Merely discussing wisdom, fitness, or projects does not provide the substance of doing them.",
    keywords: ["SpeechVsReality", "ActionOverWords", "Semiotics", "CognitiveBias"]
  },
  {
    number: 4,
    sanskrit: "तत्प्राणेनाजिघृक्षत्तन्नाशक्नोत्प्राणेन ग्रहीतुम् । स यद्धैनत्प्राणेनाग्रहैष्यदभिप्राण्य हैवान्नमत्रप्स्यत् ॥ ४ ॥",
    transliteration: "tatprāṇenājighṛkṣattannāśaknotprāṇena grahītum | sa yaddhainatprāṇenāgrahaiṣyadabhiprāṇya haivānnamatrapsyat || 4 ||",
    translation: "He sought to grasp it with breath (olfaction). He could not grasp it with breath. Had he grasped it with breath, merely by smelling food one would be satisfied.",
    hindi: "उसने उसे प्राण (घ्राण-शक्ति) से पकड़ना चाहा, पर न पकड़ सका। यदि प्राण से पकड़ लेता, तो केवल अन्न को सूंघने मात्र से मनुष्य तृप्त हो जाता। ॥ ४ ॥",
    explanation: "Olfaction senses the chemical signature of nourishment and primes digestive enzymes, but smell alone cannot sustain cellular life.",
    science: "Cephalic phase response: olfactory stimulation triggers anticipatory salivary and gastric acid secretion, but cannot deliver caloric intake.",
    lifeLesson: "Proximity to excellence or inspiration can inspire you, but passive proximity is not genuine assimilation.",
    keywords: ["Olfaction", "CephalicResponse", "Assimilation", "DirectExperience"]
  },
  {
    number: 5,
    sanskrit: "तच्चक्षुषाजिघृक्षत्तन्नाशक्नोच्चक्षुषा ग्रहीतुम् । स यद्धैनच्चक्षुषाग्रहैष्यद्दृष्ट्वा हैवान्नमत्रप्स्यत् ॥ ५ ॥",
    transliteration: "taccakṣuṣājighṛkṣattannāśaknoccakṣuṣā grahītum | sa yaddhainaccakṣuṣāgrahaiṣyaddṛṣṭvā haivānnamatrapsyat || 5 ||",
    translation: "He sought to grasp it with sight (the eye). He could not grasp it with sight. Had he grasped it with sight, merely by looking at food one would be satisfied.",
    hindi: "उसने उसे चक्षु (नेत्र) से पकड़ना चाहा, पर न पकड़ सका। यदि नेत्र से पकड़ लेता, तो केवल अन्न को देखने मात्र से मनुष्य तृप्त हो जाता। ॥ ५ ॥",
    explanation: "Visual appraisal gauges nutritional freshness, but visual photons carry no metabolic fuel to nourish living tissue.",
    science: "Visual processing in the occipital cortex decodes light frequencies, but metabolic sustenance requires chemical catabolism of macronutrients.",
    lifeLesson: "Consuming content visually (social feeds, tutorials) creates an illusion of competence without real mastery.",
    keywords: ["VisualAppraisal", "IllusionOfCompetence", "Spectatorship", "Substance"]
  },
  {
    number: 6,
    sanskrit: "तच्छ्रोत्रेणाजिघृक्षत्तन्नाशक्नोच्छ्रोत्रेण ग्रहीतुम् । स यद्धैनच्छ्रोत्रेणाग्रहैष्यच्छ्रुत्वा हैवान्नमत्रप्स्यत् ॥ ६ ॥",
    transliteration: "tacchrotreṇājighṛkṣattannāśaknocchrotreṇa grahītum | sa yaddhainacchrotreṇāgrahaiṣyacchrutvā haivānnamatrapsyat || 6 ||",
    translation: "He sought to grasp it with hearing (the ear). He could not grasp it with hearing. Had he grasped it with hearing, merely by hearing of food one would be satisfied.",
    hindi: "उसने उसे श्रोत्र (कान) से पकड़ना चाहा, पर न पकड़ सका। यदि कान से पकड़ लेता, तो केवल अन्न की चर्चा सुनने मात्र से मनुष्य तृप्त हो जाता। ॥ ६ ॥",
    explanation: "Auditory perception receives sound waves and descriptions. Hearing about liberation is not liberation; direct digestion is required.",
    science: "Auditory cortex signals transduce mechanical air vibrations; they do not alter systemic blood glucose or cellular metabolism.",
    lifeLesson: "Listening to self-help podcasts or talks changes nothing until the principles are digested into daily conduct.",
    keywords: ["AuditoryInput", "ListeningVsDoing", "DirectPractice", "Integration"]
  },
  {
    number: 7,
    sanskrit: "तत्त्वचाजिघृक्षत्तन्नाशक्नोत्त्वचा ग्रहीतुम् । स यद्धैनत्त्वचाग्रहैष्यत्स्पृष्ट्वा हैवान्नमत्रप्स्यत् ॥ ७ ॥",
    transliteration: "tattvacājighṛkṣattannāśaknottvacā grahītum | sa yaddhainattvacāgrahaiṣyatspṛṣṭvā haivānnamatrapsyat || 7 ||",
    translation: "He sought to grasp it with the skin (touch). He could not grasp it with the skin. Had he grasped it with the skin, merely by touching food one would be satisfied.",
    hindi: "उसने उसे त्वचा (स्पर्श) से पकड़ना चाहा, पर न पकड़ सका। यदि त्वचा से पकड़ लेता, तो केवल अन्न को छूने मात्र से मनुष्य तृप्त हो जाता। ॥ ७ ॥",
    explanation: "Tactile contact confirms the physical texture and presence of an object, yet surface contact cannot metabolize substance into vital energy.",
    science: "Somatosensory mechanoreceptors register pressure and temperature; transdermal nutrient absorption is negligible for bulk metabolic fuel.",
    lifeLesson: "Skimming the surface of relationships or disciplines gives superficial contact, not genuine fulfillment.",
    keywords: ["Touch", "SurfaceContact", "Depth", "Metabolism"]
  },
  {
    number: 8,
    sanskrit: "तन्मनसाजिघृक्षत्तन्नाशक्नोन्मनसा ग्रहीतुम् । स यद्धैनन्मनसाग्रहैष्यद्ध्यात्वा हैवान्नमत्रप्स्यत् ॥ ८ ॥",
    transliteration: "tanmanasājighṛkṣattannāśaknonmanasā grahītum | sa yaddhainanmanasāgrahaiṣyaddhyātvā haivānnamatrapsyat || 8 ||",
    translation: "He sought to grasp it with the mind. He could not grasp it with the mind. Had he grasped it with the mind, merely by meditating on food one would be satisfied.",
    hindi: "उसने उसे मन से पकड़ना चाहा, पर न पकड़ सका। यदि मन से पकड़ लेता, तो केवल अन्न का ध्यान या चिन्तन करने मात्र से मनुष्य तृप्त हो जाता। ॥ ८ ॥",
    explanation: "Pure mental contemplation of nourishment does not nourish the physical frame. Thought must bridge into somatic action.",
    science: "Cognitive mental simulation activates motor and sensory networks, but produces no adenosine triphosphate (ATP) for cellular survival.",
    lifeLesson: "Overthinking is not execution. You cannot think your way into physical stamina or emotional peace without embodiment.",
    keywords: ["MindVsAction", "MentalSimulation", "Embodiment", "Execution"]
  },
  {
    number: 9,
    sanskrit: "तच्छिश्नेनाजिघृक्षत्तन्नाशक्नोच्छिश्नेन ग्रहीतुम् । स यद्धैनच्छिश्नेनाग्रहैष्यद्विसृज्य हैवान्नमत्रप्स्यत् ॥ ९ ॥",
    transliteration: "tacchiśnenājighṛkṣattannāśaknocchiśnena grahītum | sa yaddhainacchiśnenāgrahaiṣyadvisṛjya haivānnamatrapsyat || 9 ||",
    translation: "He sought to grasp it with the generative organ. He could not grasp it with the generative organ. Had he grasped it so, merely by emission one would be satisfied.",
    hindi: "उसने उसे जननेन्द्रिय से पकड़ना चाहा, पर न पकड़ सका। यदि उससे पकड़ लेता, तो केवल विसर्जन मात्र से मनुष्य तृप्त हो जाता। ॥ ९ ॥",
    explanation: "The reproductive organ expends creative vitality for propagation; it cannot internalize nourishment for individual self-preservation.",
    science: "Reproductive biology governs gene transmission across generations, requiring massive energy expenditure rather than caloric assimilation.",
    lifeLesson: "Creative output drains energy unless balanced by continuous inward nourishment and restoration.",
    keywords: ["Generation", "Propagation", "EnergyExpenditure", "Restoration"]
  },
  {
    number: 10,
    sanskrit: "तदपानेनाजिघृक्षत्तदावयत् । सैषोऽन्नस्य ग्रहो यदपानो ह्यन्नायुर्वा एष यदपानः ॥ १० ॥",
    transliteration: "tadapānenājighṛkṣattadāvayat | saiṣo'nnasya graho yadapāno hyannāyurvā eṣa yadapānaḥ || 10 ||",
    translation: "He sought to grasp it with Apāna (digestive vital breath). He caught it! This Apāna is the grasper of food; Apāna is that which lives on food.",
    hindi: "उसने उसे अपान-वायु (पाचक व आन्तरिक शक्ति) से पकड़ना चाहा; और उसने उसे पकड़ लिया! यह अपान ही अन्न का ग्रहणकर्ता है, और अपान ही अन्न से आयु प्राप्त करता है। ॥ १० ॥",
    explanation: "Apāna is the inward-drawing, assimilative bio-energy that digests food and sustains physical life. It represents true internalization: not merely perceiving, but metabolizing reality into being.",
    science: "Enteric nervous system and gastrointestinal assimilation: digestive motility, nutrient absorption across epithelial villi, and ATP synthesis constitute Apana.",
    lifeLesson: "To transform your life, you must metabolize experiences — digest lessons, absorb nutrition, and eliminate waste.",
    keywords: ["Apana", "Assimilation", "Digestion", "Metabolism", "LifeEnergy"]
  }
];

// Reconstruct 5 canonical chapters for Aitareya Upanishad
// Ch 1: Adhyāya 1 · Khaṇḍa 1 (4 mantras: 1.1.1 - 1.1.4)
const ch1_verses = oldJson.chapters[0].verses.slice(0, 4).map((v, i) => ({
  id: i + 1,
  number: i + 1,
  sanskrit: v.sanskrit,
  transliteration: v.transliteration,
  translation: v.translation,
  hindi: v.hindi,
  explanation: v.commentary || v.explanation,
  science: v.science,
  lifeLesson: "Recognize that consciousness precedes manifestation. Cultivate awareness of what your thoughts create in your inner and outer world.",
  keywords: ["Creation", "CosmicPuruṣa", "ConsciousnessFirst", "Self"]
}));

// Ch 2: Adhyāya 1 · Khaṇḍa 2 (5 mantras: 1.2.1 - 1.2.5)
const ch2_verses = oldJson.chapters[1].verses.slice(0, 5).map((v, i) => ({
  id: i + 1,
  number: i + 1,
  sanskrit: v.sanskrit,
  transliteration: v.transliteration,
  translation: v.translation,
  hindi: v.hindi,
  explanation: v.commentary || v.explanation,
  science: v.science,
  lifeLesson: "The human body is recognized as 'sukṛtam' — well-made. Treat the body as a sacred temple housing divine faculties.",
  keywords: ["Devas", "Embodiment", "HumanTemple", "Sukritam"]
}));

// Ch 3: Adhyāya 1 · Khaṇḍa 3 (14 mantras: 1.3.1 - 1.3.14)
// Mantras 1 to 10 from missingMantras1_3
// Mantras 11 to 14 from existing oldJson.chapters[2].verses (1.3.11 - 1.3.14)
const ch3_existing = oldJson.chapters[2].verses.slice(0, 4).map((v, i) => ({
  id: 11 + i,
  number: 11 + i,
  sanskrit: v.sanskrit,
  transliteration: v.transliteration,
  translation: v.translation,
  hindi: v.hindi,
  explanation: v.commentary || v.explanation,
  science: v.science,
  lifeLesson: i === 0 ? "Ask the fundamental inquiry: When all senses function by their nature, who am I?" : "Look closely at reality until you recognize: Idam adarsham — I have seen the One behind all appearances.",
  keywords: ["SelfInquiry", "WhoAmI", "CrownEntry", "Indra", "IdamAdarsham"]
}));

const ch3_verses = [
  ...missingMantras1_3.map((m, i) => ({
    id: i + 1,
    number: i + 1,
    sanskrit: m.sanskrit,
    transliteration: m.transliteration,
    translation: m.translation,
    hindi: m.hindi,
    explanation: m.explanation,
    science: m.science,
    lifeLesson: m.lifeLesson,
    keywords: m.keywords
  })),
  ...ch3_existing
];

// Ch 4: Adhyāya 2 (6 mantras: 2.1.1 - 2.1.6)
const ch4_verses = oldJson.chapters[3].verses.slice(0, 6).map((v, i) => ({
  id: i + 1,
  number: i + 1,
  sanskrit: v.sanskrit,
  transliteration: v.transliteration,
  translation: v.translation,
  hindi: v.hindi,
  explanation: v.commentary || v.explanation,
  science: v.science,
  lifeLesson: "Understand the continuity of life across generations and rebirths. Align your actions with enduring spiritual purpose.",
  keywords: ["ThreeBirths", "Rebirth", "SageVamadeva", "Lineage", "Continuity"]
}));

// Ch 5: Adhyāya 3 (4 mantras: 3.1.1 - 3.1.4)
const ch5_verses = oldJson.chapters[4].verses.slice(0, 4).map((v, i) => ({
  id: i + 1,
  number: i + 1,
  sanskrit: v.sanskrit,
  transliteration: v.transliteration,
  translation: v.translation,
  hindi: v.hindi,
  explanation: v.commentary || v.explanation,
  science: v.science,
  lifeLesson: "Live from the supreme recognition: Prajñānaṃ Brahma. Consciousness is not a product of life; life is an expression of Consciousness.",
  keywords: ["PrajnanamBrahma", "Mahavakya", "PureConsciousness", "Immortality", "Liberation"]
}));

const newChapters = [
  {
    number: 1,
    title: "Adhyāya 1 · Khaṇḍa 1 — Creation of the Worlds and the Cosmic Puruṣa",
    titleSanskrit: "प्रथम अध्याय · प्रथम खण्ड — लोक एवं पुरुष-सृष्टि",
    summary: "In the beginning the Self alone existed. It thought: 'Let me create the worlds.' From it emerged the four cosmic regions — Ambhas, Marīci, Mara, and Āpaḥ. Then it brought forth the cosmic Puruṣa.",
    verses: ch1_verses
  },
  {
    number: 2,
    title: "Adhyāya 1 · Khaṇḍa 2 — The Devas Seek a Home in the Human Form",
    titleSanskrit: "प्रथम अध्याय · द्वितीय खण्ड — देवताओं का देह-प्रवेश",
    summary: "The devas, afflicted by hunger and thirst in the cosmic ocean, request a dwelling. After declining animal forms, they joyfully accept the human person (Sukṛtam) and enter its faculties.",
    verses: ch2_verses
  },
  {
    number: 3,
    title: "Adhyāya 1 · Khaṇḍa 3 — Creation of Food and the Entry of the Self",
    titleSanskrit: "प्रथम अध्याय · तृतीय खण्ड — अन्न-सृष्टि एवं आत्मा का प्रवेश",
    summary: "Food is created from heated waters. The senses try to grasp it in vain until Apāna catches it. The Self reflects 'Who am I without these?' and enters through the crown (Vidṛti), realizing 'Idam adarśam' (I have seen This).",
    verses: ch3_verses
  },
  {
    number: 4,
    title: "Adhyāya 2 — The Three Births of the Soul and Sage Vamadeva",
    titleSanskrit: "द्वितीय अध्याय — आत्मा के तीन जन्म एवं वामदेव-उपाख्यान",
    summary: "The soul's threefold birth: as embryo in the father, through birth from the mother, and departing at physical death. Sage Vamadeva awakens to immortality while still in the womb.",
    verses: ch4_verses
  },
  {
    number: 5,
    title: "Adhyāya 3 — Prajñānaṃ Brahma (Consciousness is Brahman)",
    titleSanskrit: "तृतीय अध्याय — प्रज्ञानं ब्रह्म (महावाक्य)",
    summary: "The ultimate inquiry into the nature of the Self. All sensations, faculties, intellect, and cosmic powers are guided by Prajñāna (Consciousness). Culminates in the Rigvedic Mahāvākya: 'Prajñānaṃ Brahma'.",
    verses: ch5_verses
  }
];

const totalVerses = newChapters.reduce((sum, c) => sum + c.verses.length, 0);
console.log(`Reconstructed Aitareya with ${newChapters.length} chapters and ${totalVerses} verses (Canonical 33)!`);

// Write to public/data/scriptures-full/aitareya.json
const updatedJson = {
  ...oldJson,
  totalVerses: totalVerses,
  totalChapters: newChapters.length,
  chapters: newChapters.map(c => ({
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

fs.writeFileSync(aitareyaJsonPath, JSON.stringify(updatedJson, null, 2), 'utf8');
console.log(`Updated ${aitareyaJsonPath} with all 33 canonical verses!`);

// Write to data/scriptures/aitareya.ts
const tsContent = `import { Scripture } from '../types';

export const aitareya: Scripture = {
  id: 'aitareya',
  title: 'Aitareya Upanishad',
  titleSanskrit: 'ऐतरेयोपनिषद्',
  category: 'upanishad',
  description:
    "Belongs to the Ṛg Veda (Aitareya Āraṇyaka, chapters 4–6). 33 mantras across 3 adhyāyas (5 khaṇḍas). Complete canonical recension tracing creation from the Self through the cosmic Person; the devas' embodiment in man (sukṛtam); the creation and assimilation of food through Apāna; the threefold birth of the soul; and culminating in the supreme Mahāvākya 'Prajñānaṃ Brahma' — Consciousness is Brahman.",
  totalVerses: ${totalVerses},
  tags: ['Upanishad', 'Consciousness', 'Creation', 'Mahavakya', 'PrajnanamBrahma', 'Rigveda', 'Vamadeva'],
  chapters: ${JSON.stringify(newChapters.map(c => ({
    id: c.number,
    title: c.title,
    titleSanskrit: c.titleSanskrit,
    summary: c.summary,
    verses: c.verses
  })), null, 2)}
};
`;

fs.writeFileSync(aitareyaTsPath, tsContent, 'utf8');
console.log(`Updated ${aitareyaTsPath} with all 33 canonical verses!`);
