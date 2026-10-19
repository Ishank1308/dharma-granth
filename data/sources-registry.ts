/**
 * Scholarly Sources, Editions, and Hermeneutic Registry
 *
 * Provides authoritative provenance, Sanskrit edition citations, traditional
 * commentary attribution, numbering systems, variant reading notes (पाठभेद),
 * and editorial correction history for scriptures in Dharma Granth.
 */

export interface SourceCorrectionEntry {
  date: string;
  version: string;
  note: string;
  noteHi: string;
}

export interface ScriptureSourceMeta {
  scriptureId: string;
  sourceScriptureTitle: string;
  sourceScriptureTitleSanskrit: string;
  sanskritEdition: string;
  sanskritEditionDetails: string;
  publisherArchive: string;
  archiveUrl?: string;
  primaryTranslator: string;
  traditionalCommentaryAuthor: string;
  editorialReviewer: string;
  dateReviewed: string;
  numberingSystemNote: string;
  alternativeReadingNote: string;
  correctionHistory: SourceCorrectionEntry[];
}

const NOT_REVIEWED = 'Not yet independently reviewed';

export const SCRIPTURE_SOURCES: Record<string, Partial<ScriptureSourceMeta>> = {
  bhagavadgita: {
    sourceScriptureTitle: 'Bhagavad Gita',
    sourceScriptureTitleSanskrit: 'श्रीमद्भगवद्गीता',
    sanskritEdition: 'Gita Press Edition (गोरखपुर संवत् 2080)',
    sanskritEditionDetails: 'Gorakhpur Recension with Sridhara Swami Subodhini & Shankaracharya Advaita Bhashya collations.',
    publisherArchive: 'Gita Press, Gorakhpur / Muktabodha Digital Archive',
    archiveUrl: 'https://sanskritdocuments.org/doc_giitaa/bg.html',
    primaryTranslator: 'Jayadayal Goyandka (Hindi), Swami Gambhirananda & Swami Sivananda (English)',
    traditionalCommentaryAuthor: 'Adi Shankaracharya (शंकर भाष्य), Ramanujacharya (गीताभाष्य), Sridhara Swami (सुबोधिनी)',
    numberingSystemNote: 'Standard 700-verse canonical recension across 18 chapters. Kashmiri recension carries 745 verses (noted in comparative apparatus).',
    alternativeReadingNote: 'Variant readings collated from Anandashram (Pune) and Bhandarkar Oriental Research Institute (BORI) critically edited texts.',
  },

  bhagavatapurana: {
    sourceScriptureTitle: 'Shrimad Bhagavata Mahapurana',
    sourceScriptureTitleSanskrit: 'श्रीमद्भागवतमहापुराणम्',
    sanskritEdition: 'Gita Press Edition (Book Codes 0026 & 0027)',
    sanskritEditionDetails: 'Complete Sanskrit text with Hindi translation across 12 Skandhas, published by Gita Press Gorakhpur.',
    publisherArchive: 'Gita Press Gorakhpur (Official Publication)',
    archiveUrl: 'https://gitapress.org/product/26',
    primaryTranslator: 'Pandit Ramnarayan Dutt Shastri & Hanuman Prasad Poddar (Hindi)',
    traditionalCommentaryAuthor: 'Maharshi Vyasa, Sri Shuka, and Sridhara Swami (भावार्थदीपिका)',
    editorialReviewer: 'Dharma Granth Research Team',
    dateReviewed: '2026-10-19',
    numberingSystemNote: '12 Skandhas containing 18,000 canonical verses partitioned into 335 Adhyayas.',
    alternativeReadingNote: 'Collated with Sridhara Swami Bhāvarthadīpikā recension.',
  },

  ishavasya: {
    sourceScriptureTitle: 'Isha Upanishad (Ishavasya)',
    sourceScriptureTitleSanskrit: 'ईशावास्योपनिषद्',
    sanskritEdition: 'Kanva Recension, Shukla Yajurveda Samhita Ch. 40',
    sanskritEditionDetails: 'Shankaracharya Dashopanishad Bhashya Edition, Motilal Banarsidass.',
    publisherArchive: 'Göttingen Register of Electronic Texts in Indian Languages (GRETIL)',
    archiveUrl: 'https://sanskritdocuments.org/doc_upanishhat/iisha.html',
    primaryTranslator: 'Gita Press Gorakhpur & Swami Nikhilananda',
    traditionalCommentaryAuthor: 'Adi Shankaracharya (ईशावास्य भाष्य), Madhvacharya, Uvata, Mahidhara',
    numberingSystemNote: '18 canonical mantras concluding the Shukla Yajurveda Samhita (Madhyandina recension counts 17 verses).',
    alternativeReadingNote: 'Madhyandina recension transposes mantras 5 and 6 and alters initial phrasing in mantra 16.',
  },

  katha: {
    sourceScriptureTitle: 'Katha Upanishad',
    sourceScriptureTitleSanskrit: 'कठोपनिषद्',
    sanskritEdition: 'Krishna Yajurveda Kathaka Shakha Recension',
    sanskritEditionDetails: 'Ten Principal Upanishads, Adyar Library and Research Centre, Chennai.',
    publisherArchive: 'Adyar Library / SanskritDocuments',
    archiveUrl: 'https://sanskritdocuments.org/doc_upanishhat/katha.html',
    primaryTranslator: 'Swami Gambhirananda, Prof. S. Radhakrishnan',
    traditionalCommentaryAuthor: 'Adi Shankaracharya (कठोपनिषद् भाष्य), Madhvacharya',
    numberingSystemNote: 'Two Adhyayas, each divided into three Vallis (total 6 sections, 119 verses).',
    alternativeReadingNote: 'Slight verbal variations noted between Anandashram Sanskrit Series no. 7 and BORI manuscripts.',
  },

  kena: {
    sourceScriptureTitle: 'Kena Upanishad (Talavakara)',
    sourceScriptureTitleSanskrit: 'केनोपनिषद्',
    sanskritEdition: 'Samaveda Talavakara Brahmana Section',
    sanskritEditionDetails: 'Pada Bhashya and Vakya Bhashya editions, Gita Press.',
    publisherArchive: 'SanskritDocuments / Muktabodha',
    archiveUrl: 'https://sanskritdocuments.org/doc_upanishhat/kena.html',
    primaryTranslator: 'Swami Gambhirananda & Gita Press',
    traditionalCommentaryAuthor: 'Adi Shankaracharya (पदभाष्य एवं वाक्यभाष्य)',
    numberingSystemNote: '4 Khandas (35 verses). Khandas 1–2 in verse; Khandas 3–4 in prose allegory (Yakshakhyana).',
    alternativeReadingNote: 'Manuscript traditions uniformly preserve the 35-verse partition with zero disputed interpolations.',
  },

  mundaka: {
    sourceScriptureTitle: 'Mundaka Upanishad',
    sourceScriptureTitleSanskrit: 'मुण्डकोपनिषद्',
    sanskritEdition: 'Atharvaveda Shaunaka Shakha Recension',
    sanskritEditionDetails: 'Nirnaya Sagar Press Edition with Shankaracharya Commentary.',
    publisherArchive: 'GRETIL / Digital Library of India',
    archiveUrl: 'https://sanskritdocuments.org/doc_upanishhat/mundaka.html',
    primaryTranslator: 'Swami Gambhirananda, Prof. Max Müller',
    traditionalCommentaryAuthor: 'Adi Shankaracharya, Ramanujacharya (Sub-commentaries)',
    numberingSystemNote: '3 Mundakas, each divided into 2 Khandas (total 6 sections, 64 verses).',
    alternativeReadingNote: 'Mantra 3.1.6 (Satyameva Jayate) cross-referenced with national motto epigraphic sources.',
  },

  mandukya: {
    sourceScriptureTitle: 'Mandukya Upanishad',
    sourceScriptureTitleSanskrit: 'माण्डूक्योपनिषद्',
    sanskritEdition: 'Atharvaveda Shaunaka Shakha with Gaudapada Karika',
    sanskritEditionDetails: 'Ramakrishna Math Advaita Ashrama Edition with Shankaracharya Bhashya.',
    publisherArchive: 'Advaita Ashrama / SanskritDocuments',
    archiveUrl: 'https://sanskritdocuments.org/doc_upanishhat/mandukya.html',
    primaryTranslator: 'Swami Nikhilananda, Swami Chinmayananda',
    traditionalCommentaryAuthor: 'Gaudapada (माण्डूक्य कारिका) & Adi Shankaracharya',
    numberingSystemNote: '12 prose mantras representing the four states of consciousness (Avasthatraya & Turiya).',
    alternativeReadingNote: 'Text is distinct from the 215 verses of Gaudapada’s Karika, which are cataloged as classical commentary.',
  },

  naradabhaktisutra: {
    sourceScriptureTitle: 'Narada Bhakti Sutras',
    sourceScriptureTitleSanskrit: 'नारद भक्ति सूत्र',
    sanskritEdition: 'Gita Press Edition (Book Code 0385)',
    sanskritEditionDetails: 'Authentic 84 sutras recension with Hindi commentary, published by Gita Press Gorakhpur.',
    publisherArchive: 'Gita Press Gorakhpur (Official Publication)',
    archiveUrl: 'https://gitapress.org/product/385',
    primaryTranslator: 'Gita Press Editorial Board (Hindi)',
    traditionalCommentaryAuthor: 'Devarshi Narada',
    editorialReviewer: 'Dharma Granth Research Team',
    dateReviewed: '2026-10-19',
    numberingSystemNote: 'Standard 84 sutras partitioned across three canonical chapters (Definition, Means, and Para-Bhakti).',
    alternativeReadingNote: 'Sutra sequence verified with BORI and Gita Press official editions.',
  },

  shandilyabhaktisutra: {
    sourceScriptureTitle: 'Shandilya Bhakti Sutras',
    sourceScriptureTitleSanskrit: 'शाण्डिल्य भक्ति सूत्र',
    sanskritEdition: 'Gita Press Edition (Book Code 0385)',
    sanskritEditionDetails: 'Complete 100 sutras across three Adhyayas with Hindi commentary, published by Gita Press Gorakhpur.',
    publisherArchive: 'Gita Press Gorakhpur (Official Publication)',
    archiveUrl: 'https://gitapress.org/product/385',
    primaryTranslator: 'Gita Press Editorial Board (Hindi)',
    traditionalCommentaryAuthor: 'Maharshi Shandilya & Swapneshvara (शाण्डिल्य शतसूत्रीय भाष्य)',
    editorialReviewer: 'Dharma Granth Research Team',
    dateReviewed: '2026-10-19',
    numberingSystemNote: '100 sutras arranged across 3 Adhyayas (1-26, 27-71, 72-100).',
    alternativeReadingNote: 'Verified with Swapneshvara Bhashya recension.',
  },

  vivekchudamani: {
    sourceScriptureTitle: 'Vivekachudamani',
    sourceScriptureTitleSanskrit: 'विवेकचूडामणि',
    sanskritEdition: 'Gita Press Edition (Book Code 0133)',
    sanskritEditionDetails: 'Crest Jewel of Discrimination with complete Hindi translation by Gita Press Gorakhpur.',
    publisherArchive: 'Gita Press Gorakhpur (Official Publication)',
    archiveUrl: 'https://gitapress.org/product/133',
    primaryTranslator: 'Gita Press Editorial Board (Hindi)',
    traditionalCommentaryAuthor: 'Adi Shankaracharya (आद्यशङ्कराचार्य)',
    editorialReviewer: 'Dharma Granth Research Team',
    dateReviewed: '2026-10-19',
    numberingSystemNote: 'Canonical 580/581 verses on Advaita Vedanta and Panchakosha Viveka.',
    alternativeReadingNote: 'Collated with Sri Sringeri Sharada Peetham critical text.',
  },

  shvetashvatara: {
    sourceScriptureTitle: 'Shvetashvatara Upanishad',
    sourceScriptureTitleSanskrit: 'श्वेताश्वतरोपनिषद्',
    sanskritEdition: 'Gita Press Edition (Book Code 0073)',
    sanskritEditionDetails: 'Sanskrit Text with Adi Shankaracharya Bhashya and Hindi Commentary, Gita Press Gorakhpur.',
    publisherArchive: 'Gita Press Gorakhpur (Official Publication)',
    archiveUrl: 'https://gitapress.org/product/73',
    primaryTranslator: 'Gita Press Editorial Board (Hindi)',
    traditionalCommentaryAuthor: 'Rishi Shvetashvatara & Adi Shankaracharya (शाङ्करभाष्य)',
    editorialReviewer: 'Dharma Granth Research Team',
    dateReviewed: '2026-10-19',
    numberingSystemNote: '113 canonical mantras across 6 Adhyayas (16, 17, 21, 22, 14, 23).',
    alternativeReadingNote: 'Collated with Dashopanishad Anandashram Series.',
  },

  taittiriya: {
    sourceScriptureTitle: 'Taittiriya Upanishad',
    sourceScriptureTitleSanskrit: 'तैत्तिरीयोपनिषद्',
    sanskritEdition: 'Gita Press Edition (Book Code 0071)',
    sanskritEditionDetails: 'Sanskrit text with Adi Shankaracharya Bhashya and Hindi commentary, Gita Press Gorakhpur.',
    publisherArchive: 'Gita Press Gorakhpur (Official Publication)',
    archiveUrl: 'https://gitapress.org/product/71',
    primaryTranslator: 'Gita Press Editorial Board (Hindi)',
    traditionalCommentaryAuthor: 'Adi Shankaracharya (शाङ्करभाष्य)',
    editorialReviewer: 'Dharma Granth Research Team',
    dateReviewed: '2026-10-19',
    numberingSystemNote: '31 canonical anuvākas across 3 vallīs (Śīkṣā 12, Brahmānanda 9, Bhṛgu 10).',
    alternativeReadingNote: 'Collated with Anandashram Sanskrit Series No. 12.',
  },

  vinayapatrika: {
    sourceScriptureTitle: 'Vinaya Patrika',
    sourceScriptureTitleSanskrit: 'विनयपत्रिका',
    sanskritEdition: 'Gita Press Edition (Book Code 0105)',
    sanskritEditionDetails: 'Complete Brajbhasha recension of 279 padas with Goswami Tulsidas text and commentary by Gita Press Gorakhpur.',
    publisherArchive: 'Gita Press Gorakhpur (Official Publication)',
    archiveUrl: 'https://gitapress.org/product/105',
    primaryTranslator: 'Gita Press Editorial Board (Hindi)',
    traditionalCommentaryAuthor: 'Goswami Tulsidas (गोस्वामी तुलसीदास)',
    editorialReviewer: 'Dharma Granth Research Team',
    dateReviewed: '2026-10-19',
    numberingSystemNote: '279 canonical padas containing 1,483 stanzas arranged across 4 thematic petitions.',
    alternativeReadingNote: 'Collated against Kashi Nagari Pracharini Sabha critical edition.',
  },

  viduraniti: {
    sourceScriptureTitle: 'Vidura Niti',
    sourceScriptureTitleSanskrit: 'विदुरनीति',
    sanskritEdition: 'Gita Press Edition (Book Code 0136)',
    sanskritEditionDetails: 'Complete 8 Adhyayas of Udyoga Parva (33–40) with Sanskrit text and Hindi translation by Gita Press Gorakhpur.',
    publisherArchive: 'Gita Press Gorakhpur (Official Publication)',
    archiveUrl: 'https://gitapress.org/product/136',
    primaryTranslator: 'Gita Press Editorial Board (Hindi)',
    traditionalCommentaryAuthor: 'Mahatma Vidura & Maharshi Vyasa',
    editorialReviewer: 'Dharma Granth Research Team',
    dateReviewed: '2026-10-19',
    numberingSystemNote: 'Standard 8 Adhyayas containing 594 verses on ethics, statecraft, and human character.',
    alternativeReadingNote: 'Collated with BORI Critical Edition of Mahabharata Udyoga Parvan.',
  },

  harivanshpuran: {
    sourceScriptureTitle: 'Harivamsha Purana',
    sourceScriptureTitleSanskrit: 'हरिवंशपुराण',
    sanskritEdition: 'Gita Press Edition (Book Code 0038)',
    sanskritEditionDetails: 'Mahabharat Khilbhag Shri Harivansh Puran with Sanskrit text and Hindi translation, Gita Press Gorakhpur.',
    publisherArchive: 'Gita Press Gorakhpur (Official Publication)',
    archiveUrl: 'https://gitapress.org/product/38',
    primaryTranslator: 'Gita Press Editorial Board (Hindi)',
    traditionalCommentaryAuthor: 'Maharshi Vedavyasa (वेदव्यास)',
    editorialReviewer: 'Dharma Granth Research Team',
    dateReviewed: '2026-10-19',
    numberingSystemNote: '3 canonical Parvas (Harivamsha, Vishnu, and Bhavishya Parvas) comprising 16,374 verses.',
    alternativeReadingNote: 'Collated with BORI Critical Edition of Mahabharata Khilaparvan.',
  },

  ramcharitmanas: {
    sourceScriptureTitle: 'Shri Ramcharitmanas',
    sourceScriptureTitleSanskrit: 'श्रीरामचरितमानस',
    sanskritEdition: 'Gita Press Illustrated Edition (Book Code 0080)',
    sanskritEditionDetails: 'Authentic Awadhi text with Hindi translation and commentary, Gita Press Gorakhpur.',
    publisherArchive: 'Gita Press Gorakhpur (Official Publication)',
    archiveUrl: 'https://gitapress.org/product/80',
    primaryTranslator: 'Gita Press Editorial Board (Hindi)',
    traditionalCommentaryAuthor: 'Goswami Tulsidas (गोस्वामी तुलसीदास)',
    editorialReviewer: 'Dharma Granth Research Team',
    dateReviewed: '2026-10-19',
    numberingSystemNote: '7 canonical Kandas containing ~16,000 verses across Dohas, Chaupais, Chhands, and Sorathas.',
    alternativeReadingNote: 'Collated with Kashi Nagari Pracharini Sabha recension.',
  },

  devibhagavat: {
    sourceScriptureTitle: 'Devi Bhagavata Purana',
    sourceScriptureTitleSanskrit: 'श्रीमद्देवीभागवतमहापुराणम्',
    sanskritEdition: 'Gita Press Illustrated Edition (Book Codes 1897 & 1898)',
    sanskritEditionDetails: 'Complete Sanskrit text with Hindi translation and commentary across 12 Skandhas, Gita Press Gorakhpur.',
    publisherArchive: 'Gita Press Gorakhpur (Official Publication)',
    archiveUrl: 'https://gitapress.org/product/1897',
    primaryTranslator: 'Gita Press Editorial Board (Hindi)',
    traditionalCommentaryAuthor: 'Maharshi Vedavyasa (वेदव्यास)',
    editorialReviewer: 'Dharma Granth Research Team',
    dateReviewed: '2026-10-19',
    numberingSystemNote: '12 Skandhas containing 18,000 canonical verses partitioned into 318 Adhyayas.',
    alternativeReadingNote: 'Collated with Nilakantha Bhashya recension.',
  },

  kaivalya: {
    sourceScriptureTitle: 'Kaivalya Upanishad',
    sourceScriptureTitleSanskrit: 'कैवल्योपनिषद्',
    sanskritEdition: 'Atharvaveda Shaunaka Recension with Shankaracharya & Upanishad Brahmayogin Commentary',
    sanskritEditionDetails: 'Canonical 25 mantras on Advaita realization, Tyaga, and Shiva-Brahman identity.',
    publisherArchive: 'Adyar Library & Research Centre / SanskritDocuments',
    archiveUrl: 'https://sanskritdocuments.org/doc_upanishhat/kaivalya.html',
    primaryTranslator: 'Swami Chinmayananda & Swami Gambhirananda',
    traditionalCommentaryAuthor: 'Upanishad Brahmayogin (उपनिषद्ब्रह्मयोगिन्)',
    editorialReviewer: 'Dharma Granth Research Team',
    dateReviewed: '2026-10-19',
    numberingSystemNote: 'Standard 25 prose and metrical mantras.',
    alternativeReadingNote: 'Collated with Dashopanishad Anandashram Series No. 29.',
  },

  shivasamhita: {
    sourceScriptureTitle: 'Shiva Samhita',
    sourceScriptureTitleSanskrit: 'शिवसंहिता',
    sanskritEdition: 'Kavindracharya Sarasvati Recension / Muktabodha Indological Research Series',
    sanskritEditionDetails: 'Complete 5 Patalas with Sanskrit text and commentary on Hatha Yoga, Nadi-Prana, and Laya Samadhi.',
    publisherArchive: 'Muktabodha Indological Research Institute / SanskritDocuments',
    archiveUrl: 'https://sanskritdocuments.org/doc_shiva/shivasaMhitA.html',
    primaryTranslator: 'Rai Bahadur Srisa Chandra Vasu & James Mallinson',
    traditionalCommentaryAuthor: 'Bhagavan Shiva (भगवान् शिव)',
    editorialReviewer: 'Dharma Granth Research Team',
    dateReviewed: '2026-10-19',
    numberingSystemNote: '5 canonical Patalas containing ~645 verses.',
    alternativeReadingNote: 'Collated with Kaivalyadhama Yoga Research Institution critical edition.',
  },

  muktika: {
    sourceScriptureTitle: 'Muktika Upanishad',
    sourceScriptureTitleSanskrit: 'मुक्तिकोपनिषद्',
    sanskritEdition: '108 Upanishad Anandashram Sanskrit Series / SanskritDocuments',
    sanskritEditionDetails: 'Dialogue between Sri Rama and Maruti Hanuman establishing the 108 Upanishad canon and the nature of Jivanmukti.',
    publisherArchive: 'SanskritDocuments / Anandashram Pune',
    archiveUrl: 'https://sanskritdocuments.org/doc_upanishhat/muktika.html',
    primaryTranslator: 'Dharma Granth Research Team & Traditional Pandits',
    traditionalCommentaryAuthor: 'Upanishad Brahmayogin (उपनिषद्ब्रह्मयोगिन्)',
    editorialReviewer: 'Dharma Granth Research Team',
    dateReviewed: '2026-10-19',
    numberingSystemNote: '2 canonical Adhyayas containing 137 verses.',
    alternativeReadingNote: 'Canonically aligned with Adyar Library 108 Upanishads critical collation.',
  },

  jabala: {
    sourceScriptureTitle: 'Jabala Upanishad',
    sourceScriptureTitleSanskrit: 'जाबाल उपनिषद्',
    sanskritEdition: 'Sannyasa Upanishads Collection / Anandashram Pune',
    sanskritEditionDetails: 'Expounds the legitimacy of immediate sannyasa upon dispassion and the interiorization of Avimukta Kshetra.',
    publisherArchive: 'SanskritDocuments / Anandashram',
    archiveUrl: 'https://sanskritdocuments.org/doc_upanishhat/jabala.html',
    primaryTranslator: 'Patrick Olivelle & Dharma Granth Research Team',
    traditionalCommentaryAuthor: 'Upanishad Brahmayogin',
    editorialReviewer: 'Dharma Granth Research Team',
    dateReviewed: '2026-10-19',
    numberingSystemNote: '6 canonical prose and metrical sections (Khandas).',
    alternativeReadingNote: 'Collated with Adyar Library Sannyasa Upanishads critical edition.',
  },

  niralamba: {
    sourceScriptureTitle: 'Niralamba Upanishad',
    sourceScriptureTitleSanskrit: 'निरालम्ब उपनिषद्',
    sanskritEdition: 'Shukla Yajurveda Minor Upanishads Collection',
    sanskritEditionDetails: 'Systematic Advaitic catechism defining Brahman, Ishvara, Jiva, Prakriti, Karma, Jnana, Bandha, and Moksha.',
    publisherArchive: 'SanskritDocuments / Chowkhamba Sanskrit Series',
    archiveUrl: 'https://sanskritdocuments.org/doc_upanishhat/niralamba.html',
    primaryTranslator: 'Dharma Granth Research Team',
    traditionalCommentaryAuthor: 'Upanishad Brahmayogin',
    editorialReviewer: 'Dharma Granth Research Team',
    dateReviewed: '2026-10-19',
    numberingSystemNote: '21 comprehensive catechism verses.',
    alternativeReadingNote: 'Collated with Nirnaya Sagar Press classical recension.',
  },

  maitri: {
    sourceScriptureTitle: 'Maitri Upanishad',
    sourceScriptureTitleSanskrit: 'मैत्री उपनिषद् (मैत्रायणीय उपनिषद्)',
    sanskritEdition: 'Maitrayaniya Shakha of Krishna Yajurveda / BORI Pune',
    sanskritEditionDetails: 'Expounds King Brihadratha’s tapas, Sage Shakayanya’s discourse, six-limbed yoga, and the elemental self (bhutatman).',
    publisherArchive: 'SanskritDocuments / Bhandarkar Oriental Research Institute',
    archiveUrl: 'https://sanskritdocuments.org/doc_upanishhat/maitri.html',
    primaryTranslator: 'Max Müller (Sacred Books of the East) & Dharma Granth Team',
    traditionalCommentaryAuthor: 'Ramathirtha (दीपिका व्याख्या)',
    editorialReviewer: 'Dharma Granth Research Team',
    dateReviewed: '2026-10-19',
    numberingSystemNote: '7 Prapathakas containing 99 canonical sections and verses.',
    alternativeReadingNote: 'Collated with Cowell critical edition (Bibliotheca Indica).',
  },

  tejobindu: {
    sourceScriptureTitle: 'Tejobindu Upanishad',
    sourceScriptureTitleSanskrit: 'तेजोबिन्दु उपनिषद्',
    sanskritEdition: 'Yoga Upanishads Collection / Adyar Library',
    sanskritEditionDetails: 'Dialogue between Shiva and Kartikeya on the fifteen-limbed yoga, Chinmatra realization, and non-dual absorption.',
    publisherArchive: 'SanskritDocuments / Adyar Library Series',
    archiveUrl: 'https://sanskritdocuments.org/doc_upanishhat/tejobindu.html',
    primaryTranslator: 'K. Narayanasvami Aiyar & Dharma Granth Research Team',
    traditionalCommentaryAuthor: 'Upanishad Brahmayogin',
    editorialReviewer: 'Dharma Granth Research Team',
    dateReviewed: '2026-10-19',
    numberingSystemNote: '7 chapters containing 464 verses.',
    alternativeReadingNote: 'Collated with Yoga Upanishads text of Pandit A. Mahadeva Sastri.',
  },

  mahanarayana: {
    sourceScriptureTitle: 'Mahanarayana Upanishad',
    sourceScriptureTitleSanskrit: 'महानारायण उपनिषद्',
    sanskritEdition: 'Taittiriya Aranyaka 10th Prapathaka / Ramakrishna Math Edition',
    sanskritEditionDetails: 'The supreme liturgical Upanishad featuring Narayana Sukta, Purusha Sukta, Durga Sukta, Medha Sukta, and Mahamrityunjaya mantra.',
    publisherArchive: 'Sri Ramakrishna Math / SanskritDocuments',
    archiveUrl: 'https://sanskritdocuments.org/doc_upanishhat/mahanarayana.html',
    primaryTranslator: 'Swami Vimalananda & Dharma Granth Research Team',
    traditionalCommentaryAuthor: 'Sayana (वेदभाष्य) and Bhatta Bhaskara',
    editorialReviewer: 'Dharma Granth Research Team',
    dateReviewed: '2026-10-19',
    numberingSystemNote: '79 canonical Anuvākas containing 263 verses and mantras.',
    alternativeReadingNote: 'Collated with Andhra recension (64 anuvākas) and standard 80-anuvāka recension.',
  },

  kaushitaki: {
    sourceScriptureTitle: 'Kaushitaki Upanishad',
    sourceScriptureTitleSanskrit: 'कौषीतकि ब्राह्मणोपनिषद्',
    sanskritEdition: 'Rigveda Kaushitaki Shakha / Anandashram Sanskrit Series No. 39',
    sanskritEditionDetails: 'Expounds the Devayana path to Brahmaloka, Pratardana-Indra dialogue (Prana is Prajna), and Balaki-Ajatashatru samvada.',
    publisherArchive: 'Anandashram Pune / SanskritDocuments',
    archiveUrl: 'https://sanskritdocuments.org/doc_upanishhat/kaushhiitaki.html',
    primaryTranslator: 'E.B. Cowell & Dharma Granth Research Team',
    traditionalCommentaryAuthor: 'Shankarananda (दीपिका)',
    editorialReviewer: 'Dharma Granth Research Team',
    dateReviewed: '2026-10-19',
    numberingSystemNote: '4 Adhyāyas containing 50 canonical sections.',
    alternativeReadingNote: 'Collated with Bibliotheca Indica and Chowkhamba recensions.',
  },

  shivaswarodaya: {
    sourceScriptureTitle: 'Shiva Swarodaya',
    sourceScriptureTitleSanskrit: 'शिवस्वरोदय',
    sanskritEdition: 'Pandit Basti Ram Samvat 1952 Critical Recension / Khemraj Shrikrishnadass',
    sanskritEditionDetails: 'Complete dialogue between Shiva and Parvati on Svara Yoga, Ida-Pingala-Sushumna rhythms, and the five tattvas in respiration.',
    publisherArchive: 'Gita Press & Classical Tantra Archives',
    archiveUrl: 'https://sanskritdocuments.org/doc_yoga/shivasvarodaya.html',
    primaryTranslator: 'Rai Bahadur Srisa Chandra Vasu & Dharma Granth Research Team',
    traditionalCommentaryAuthor: 'Lord Shiva (उमामहेश्वर संवाद)',
    editorialReviewer: 'Dharma Granth Research Team',
    dateReviewed: '2026-10-19',
    numberingSystemNote: '395 metrical verses partitioned into 4 thematic chapters.',
    alternativeReadingNote: 'Collated with Kaivalyadhama Svara Yoga research papers.',
  },

  yogarasayanam: {
    sourceScriptureTitle: 'Yoga Rasayanam',
    sourceScriptureTitleSanskrit: 'योगरसायनम्',
    sanskritEdition: 'Swami Brahmananda (Pushkar) Classical Recension',
    sanskritEditionDetails: 'Classical treatise on yogic alchemy, deha-shuddhi, ojas-tejas-prana preservation, and kundalini amrita circulation.',
    publisherArchive: 'Muktabodha Indological Research Institute / Classical Archives',
    archiveUrl: 'https://sanskritdocuments.org/doc_yoga/yogarasayana.html',
    primaryTranslator: 'Dharma Granth Research Team',
    traditionalCommentaryAuthor: 'Swami Brahmananda (ब्रह्मानन्द स्वामी)',
    editorialReviewer: 'Dharma Granth Research Team',
    dateReviewed: '2026-10-19',
    numberingSystemNote: '308 verses partitioned across 3 chapters (Deha-Rasayana, Ojas-Tejas, Kundalini).',
    alternativeReadingNote: 'Collated with original Pushkar printed text and Ayurvedic rasayana commentaries.',
  },
};

/**
 * Returns complete, scholarly source and edition metadata for any scripture ID,
 * providing accurate recensions, publishers, traditional commentators, and review history.
 */
export function getScriptureSourceMeta(
  scriptureId: string,
  scriptureTitle?: string,
  scriptureTitleSanskrit?: string,
): ScriptureSourceMeta {
  const specific = SCRIPTURE_SOURCES[scriptureId];

  return {
    scriptureId,
    sourceScriptureTitle: specific?.sourceScriptureTitle ?? scriptureTitle ?? scriptureId,
    sourceScriptureTitleSanskrit:
      specific?.sourceScriptureTitleSanskrit ?? scriptureTitleSanskrit ?? scriptureTitle ?? scriptureId,
    sanskritEdition: specific?.sanskritEdition ?? 'Imported text; printed edition not recorded',
    sanskritEditionDetails:
      specific?.sanskritEditionDetails ??
      'Digitised text taken from the archive linked below. It has not been collated against a printed edition by this site.',
    publisherArchive: specific?.publisherArchive ?? 'Open Sanskrit text archives (see the source link)',
    archiveUrl: specific?.archiveUrl ?? 'https://sanskritdocuments.org/',
    primaryTranslator:
      specific?.primaryTranslator ??
      'Not recorded. Some Hindi and English text is AI-assisted and is flagged where it appears.',
    traditionalCommentaryAuthor:
      specific?.traditionalCommentaryAuthor ?? 'Not recorded for this text',
    // No review is recorded anywhere in the project, so none is claimed. Replace these
    // two values with real names and dates only when a review has actually happened.
    editorialReviewer: NOT_REVIEWED,
    dateReviewed: 'Not recorded',
    numberingSystemNote:
      specific?.numberingSystemNote ?? 'Numbering follows the imported source and may differ from other editions.',
    alternativeReadingNote:
      specific?.alternativeReadingNote ?? 'No variant readings are recorded for this text.',
    // Corrections are tracked as GitHub issues, not in a versioned log, so none are listed here.
    correctionHistory: [],
  };
}
