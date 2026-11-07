/**
 * Build-Time Śabda-Kośa Concordance & Saṃvāda Dialogue Indexer
 * 
 * Generates:
 * 1. public/data/concordance-index.json:
 *    Maps core Sanskrit philosophical concepts (dharma, atman, brahman, karma,
 *    jnana, bhakti, yoga, maya, tapas, prana, moksha, sthitaprajna, nishkama,
 *    sattva, rajas, tamas, rta) to canonical defining verses across Vedas,
 *    Upanishads, Gita, Itihasa, and Puranas, including occurrence counts per category.
 * 
 * 2. public/data/samvada-dialogues.json:
 *    Indexes the major sacred dialogues by Speaker (वक्ता) and Listener (श्रोता)
 *    so readers can browse teachings by philosophical dialogue.
 */

import fs from 'node:fs';
import path from 'node:path';
import { scriptureCatalog } from '../data/scripture-meta';

const root = process.cwd();
const dataDir = path.join(root, 'public', 'data');
const fullScripturesDir = path.join(dataDir, 'scriptures-full');

interface VerseShardRecord {
  number?: number | string;
  sanskrit?: string;
  transliteration?: string;
  translation?: string;
  hindi?: string;
  wordMeaning?: string;
  padaccheda?: string;
  commentary?: string;
  speaker?: string;
  keywords?: string[];
}

interface ChapterShard {
  id?: string;
  chapter?: {
    number: number;
    title?: string;
    titleSanskrit?: string;
    verses?: VerseShardRecord[];
  };
}

interface ConceptDefinition {
  slug: string;
  titleSanskrit: string;
  titleIast: string;
  titleEn: string;
  etymology: string;
  briefDefinitionHi: string;
  briefDefinitionEn: string;
  terms: string[]; // Patterns to match in text
  canonicalVersesConfig: Array<{
    scriptureSlug: string;
    chapter: number;
    verseNum: string | number;
    contextHi: string;
    contextEn: string;
  }>;
}

const CORE_CONCEPTS: ConceptDefinition[] = [
  {
    slug: 'dharma',
    titleSanskrit: 'धर्म',
    titleIast: 'dharma',
    titleEn: 'Dharma (Cosmic Order, Righteous Duty & Purpose)',
    etymology: 'धृ (dhṛ) — "धारणाद्धर्म इत्याहुर्धर्मो धारयते प्रजाः" (That which sustains and upholds existence)',
    briefDefinitionHi: 'जो सम्पूर्ण सृष्टि, समाज और अंतरात्मा को धारण करे, संतुलित रखे और आत्म-कल्याण की ओर ले जाए, वह धर्म है।',
    briefDefinitionEn: 'Cosmic law, innate righteous order, sacred duty, and purpose that upholds and sustains individual and universal life.',
    terms: ['धर्म', 'dharma', 'righteous', 'duty', 'धारय'],
    canonicalVersesConfig: [
      { scriptureSlug: 'bhagavadgita', chapter: 2, verseNum: 40, contextHi: 'धर्म के सूक्ष्म अभ्यास की महिमा', contextEn: 'Even a little practice of this dharma saves from great fear' },
      { scriptureSlug: 'bhagavadgita', chapter: 4, verseNum: 7, contextHi: 'धर्म की पुनर्स्थापना का ईश्वरीय संकल्प', contextEn: 'Manifestation of the divine for the re-establishment of dharma' },
      { scriptureSlug: 'bhagavadgita', chapter: 18, verseNum: 66, contextHi: 'सर्वधर्म परित्याग और परम प्रपत्ति', contextEn: 'Surrendering all relative duties into the supreme sanctuary of truth' },
      { scriptureSlug: 'ishavasya', chapter: 1, verseNum: 15, contextHi: 'सत्य-धर्म के दर्शन हेतु प्रार्थना', contextEn: 'Unveiling the face of truth for the follower of dharma' },
    ],
  },
  {
    slug: 'atman',
    titleSanskrit: 'आत्मन्',
    titleIast: 'ātman',
    titleEn: 'Ātman (The Eternal Self & Pure Consciousness)',
    etymology: 'अत् (at) / आप् (āp) — "यच्चाप्नोति यदादत्ते यच्चात्ति विषयानिह" (The all-pervading, timeless witnessing consciousness)',
    briefDefinitionHi: 'शरीर, मन और बुद्धि से परे जो शाश्वत, अजर, अमर और सर्वव्यापी साक्षी चेतना है, वही आत्मा है।',
    briefDefinitionEn: 'The immortal, unconditioned, pure consciousness and witnessing Self within every living being.',
    terms: ['आत्मन्', 'आत्मा', 'atman', 'soul', 'pure self', 'witnessing self'],
    canonicalVersesConfig: [
      { scriptureSlug: 'bhagavadgita', chapter: 2, verseNum: 20, contextHi: 'आत्मा का अजन्मा, शाश्वत और नित्य स्वरूप', contextEn: 'The Self is never born, nor does it die; eternal and indestructible' },
      { scriptureSlug: 'katha', chapter: 1, verseNum: '1.2.18', contextHi: 'न जायते म्रियते वा विपश्चित्', contextEn: 'The wise soul is not born nor dies' },
      { scriptureSlug: 'mandukya', chapter: 1, verseNum: 2, contextHi: 'अयमात्मा ब्रह्म', contextEn: 'This innermost Self is Brahman' },
      { scriptureSlug: 'brihadaranyaka', chapter: 4, verseNum: '4.5.15', contextHi: 'आत्मा वा अरे द्रष्टव्यः', contextEn: 'The Self indeed is to be seen, heard, reflected upon' },
    ],
  },
  {
    slug: 'brahman',
    titleSanskrit: 'ब्रह्मन्',
    titleIast: 'brahman',
    titleEn: 'Brahman (Infinite, Non-Dual Ultimate Reality)',
    etymology: 'बृह् (bṛh) — वृधौ (To expand, swell, surpass all limits without boundary)',
    briefDefinitionHi: 'नाम और रूप से परे, सम्पूर्ण ब्रह्मांड का अधिष्ठान, सच्चिदानन्द (सत्-चित्-आनन्द) स्वरूप परमतत्व ब्रह्म है।',
    briefDefinitionEn: 'The boundless, non-dual, infinite substrate of all existence, pure consciousness and bliss (Sat-Chit-Ananda).',
    terms: ['ब्रह्मन्', 'ब्रह्म', 'brahman', 'absolute', 'supreme reality'],
    canonicalVersesConfig: [
      { scriptureSlug: 'taittiriya', chapter: 2, verseNum: '2.1.1', contextHi: 'सत्यं ज्ञानमनन्तं ब्रह्म', contextEn: 'Brahman is Truth, Knowledge, and Infinity' },
      { scriptureSlug: 'chandogya', chapter: 3, verseNum: '3.14.1', contextHi: 'सर्वं खल्विदं ब्रह्म', contextEn: 'All this universe is verily Brahman' },
      { scriptureSlug: 'bhagavadgita', chapter: 13, verseNum: 12, contextHi: 'ज्ञेयं यत्तत्प्रवक्ष्यामि', contextEn: 'I shall explain that supreme Brahman which has no beginning' },
      { scriptureSlug: 'kena', chapter: 1, verseNum: 4, contextHi: 'यद्वाचाऽनभ्युदितं येन वागभ्युद्यते', contextEn: 'That which speech cannot express, but by which speech is spoken' },
    ],
  },
  {
    slug: 'karma',
    titleSanskrit: 'कर्म',
    titleIast: 'karma',
    titleEn: 'Karma (Law of Cause, Action & Evolutionary Consequence)',
    etymology: 'कृ (kṛ) — करणे (Action, doing, intentional deed that bears fruit)',
    briefDefinitionHi: 'विचार, वाणी और शरीर द्वारा की गई क्रिया और उससे उत्पन्न होने वाला फल व संस्कार का सार्वभौमिक नियम।',
    briefDefinitionEn: 'The universal principle of cause and effect, deliberate action, and the impressions (samskaras) they leave.',
    terms: ['कर्म', 'karma', 'action', 'cause and effect', 'कर्मण्ये'],
    canonicalVersesConfig: [
      { scriptureSlug: 'bhagavadgita', chapter: 2, verseNum: 47, contextHi: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन', contextEn: 'Your right is to work only, but never to its fruits' },
      { scriptureSlug: 'bhagavadgita', chapter: 3, verseNum: 19, contextHi: 'तस्मादसक्तः सततं कार्यं कर्म समाचर', contextEn: 'Perform action unattached, for by unattached action one attains the Supreme' },
      { scriptureSlug: 'ishavasya', chapter: 1, verseNum: 2, contextHi: 'कुर्वन्नेवेह कर्माणि जिजीविषेच्छतं समाः', contextEn: 'Performing actions here, let a man wish to live a hundred years' },
    ],
  },
  {
    slug: 'jnana',
    titleSanskrit: 'ज्ञान',
    titleIast: 'jñāna',
    titleEn: 'Jñāna (Experiential Wisdom & Direct Intuitive Realization)',
    etymology: 'ज्ञा (jñā) — अवबोधने (To directly perceive, realize, and awaken)',
    briefDefinitionHi: 'संसार और आत्मा के सत्य का प्रत्यक्ष अपरोक्षानुभूति मूलक बोध, जिससे अज्ञान का संपूर्ण नाश होता है।',
    briefDefinitionEn: 'Direct spiritual realization and insight that dissolves the illusion of duality and ignorance.',
    terms: ['ज्ञान', 'jnana', 'knowledge', 'wisdom', 'विशुद्धबोध'],
    canonicalVersesConfig: [
      { scriptureSlug: 'bhagavadgita', chapter: 4, verseNum: 38, contextHi: 'न हि ज्ञानेन सदृशं पवित्रमिह विद्यते', contextEn: 'Verily, there is no purifier in this world like wisdom' },
      { scriptureSlug: 'bhagavadgita', chapter: 7, verseNum: 17, contextHi: 'तेषां ज्ञानी नित्ययुक्त एकभक्तिर्विशिष्यते', contextEn: 'Of these, the wise one who is constantly established in union is supreme' },
      { scriptureSlug: 'mundaka', chapter: 3, verseNum: '3.2.9', contextHi: 'ब्रह्म वेद ब्रह्मैव भवति', contextEn: 'He who knows the supreme Brahman becomes Brahman itself' },
    ],
  },
  {
    slug: 'bhakti',
    titleSanskrit: 'भक्ति',
    titleIast: 'bhakti',
    titleEn: 'Bhakti (Selfless Loving Devotion & Divine Resonance)',
    etymology: 'भज् (bhaj) — सेवायाम् / सम्भक्तौ (To share, revere, belong to, love unconditionally)',
    briefDefinitionHi: 'परमात्मा के प्रति निष्काम, अनन्य और उत्कट प्रेम तथा समर्पण की वह धारा जो साधक को अहं-शून्य कर दे।',
    briefDefinitionEn: 'Selfless, all-encompassing love and loving surrender to the Supreme Divine.',
    terms: ['भक्ति', 'bhakti', 'devotion', 'अनन्य', 'समर्पण'],
    canonicalVersesConfig: [
      { scriptureSlug: 'bhagavadgita', chapter: 9, verseNum: 26, contextHi: 'पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति', contextEn: 'Whosoever offers Me with devotion a leaf, flower, fruit, or water' },
      { scriptureSlug: 'bhagavadgita', chapter: 12, verseNum: 2, contextHi: 'मय्यावेश्य मनो ये मां नित्ययुक्ता उपासते', contextEn: 'Those who fix their mind on Me and worship Me with supreme faith' },
      { scriptureSlug: 'shvetashvatara', chapter: 6, verseNum: 23, contextHi: 'यस्य देवे परा भक्तिर्यथा देवे तथा गुरौ', contextEn: 'He who has supreme devotion to the Divine and to the Guru' },
    ],
  },
  {
    slug: 'yoga',
    titleSanskrit: 'योग',
    titleIast: 'yoga',
    titleEn: 'Yoga (Equanimity, Union & Mastery of Mind)',
    etymology: 'युज् (yuj) — समाधौ / संयमने (To integrate, harness, unite individual consciousness with the Infinite)',
    briefDefinitionHi: 'चित्त की वृत्तियों का निरोध तथा सुख-दुःख में समत्व का भाव योग कहलाता है।',
    briefDefinitionEn: 'The state of complete inner harmony, mental stillness, and conscious union with the Divine.',
    terms: ['योग', 'yoga', 'समतव', 'चित्तवृत्ति', 'samadhi'],
    canonicalVersesConfig: [
      { scriptureSlug: 'bhagavadgita', chapter: 2, verseNum: 48, contextHi: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय', contextEn: 'Established in Yoga perform action, equanimity is called Yoga' },
      { scriptureSlug: 'bhagavadgita', chapter: 2, verseNum: 50, contextHi: 'योगः कर्मसु कौशलम्', contextEn: 'Yoga is skill and wisdom in action' },
      { scriptureSlug: 'bhagavadgita', chapter: 6, verseNum: 23, contextHi: 'तं विद्याद् दुःखसंयोगवियोगं योगसञ्ज्ञितम्', contextEn: 'Let that state be known as Yoga which is severance from all contact with suffering' },
    ],
  },
  {
    slug: 'maya',
    titleSanskrit: 'माया',
    titleIast: 'māyā',
    titleEn: 'Māyā (The Power of Illusion, Measurement & Cosmic Play)',
    etymology: 'मा (mā) — माने (That which measures out, projects appearances, and veils the true reality)',
    briefDefinitionHi: 'ईश्वर की वह अचिन्त्य शक्ति जो सत्य को छिपाकर विविध रूपात्मक संसार की प्रतीति कराती है।',
    briefDefinitionEn: 'The enigmatic cosmic creative power that veils non-dual reality and projects the empirical world of forms.',
    terms: ['माया', 'maya', 'illusion', 'गुणमयी'],
    canonicalVersesConfig: [
      { scriptureSlug: 'bhagavadgita', chapter: 7, verseNum: 14, contextHi: 'दैवी ह्येषा गुणमयी मम माया दुरत्यया', contextEn: 'Verily this divine illusion of Mine consisting of the gunas is difficult to cross' },
      { scriptureSlug: 'shvetashvatara', chapter: 4, verseNum: 10, contextHi: 'मायां तु प्रकृतिं विद्यान्मायिनं च महेश्वरम्', contextEn: 'Know nature to be Maya, and the Supreme Lord as the master of Maya' },
    ],
  },
  {
    slug: 'tapas',
    titleSanskrit: 'तपस्',
    titleIast: 'tapas',
    titleEn: 'Tapas (Sacred Austerity, Discipline & Spiritual Fire)',
    etymology: 'तप् (tap) — संतापे (To heat, burn impurities, generate inner spiritual energy)',
    briefDefinitionHi: 'इंद्रिय-संयम, सत्य-निष्ठा और आत्म-शोधन के लिए किया जाने वाला पावन संकल्प और तितिक्षा।',
    briefDefinitionEn: 'Purifying spiritual discipline, patient endurance, and intense focused determination that burns impurities.',
    terms: ['तपस्', 'तप', 'tapas', 'austerity', 'discipline'],
    canonicalVersesConfig: [
      { scriptureSlug: 'bhagavadgita', chapter: 17, verseNum: 14, contextHi: 'शारीरिक तप का स्वरूप', contextEn: 'Austerity of the body: purity, straightness, celibacy, and non-violence' },
      { scriptureSlug: 'bhagavadgita', chapter: 17, verseNum: 15, contextHi: 'अनुद्वेगकरं वाक्यं सत्यं प्रियहितं च यत्', contextEn: 'Austerity of speech: words that cause no agitation, truthful, pleasant, and beneficial' },
      { scriptureSlug: 'taittiriya', chapter: 3, verseNum: '3.1.1', contextHi: 'तपसा ब्रह्म विजिज्ञासस्व', contextEn: 'Seek to know Brahman through tapas' },
    ],
  },
  {
    slug: 'prana',
    titleSanskrit: 'प्राण',
    titleIast: 'prāṇa',
    titleEn: 'Prāṇa (The Primordial Vital Force & Breath of Life)',
    etymology: 'प्र + अन् (pra + an) — जीवनकर्मणि (To breathe forth, animate, energize all existence)',
    briefDefinitionHi: 'शरीर और ब्रह्मांड में संचरण करने वाली वह सूक्ष्म जीवन-ऊर्जा जो श्वास-प्रश्वास और चेतना का संवहन करती है।',
    briefDefinitionEn: 'The primary life-force, vital breath, and bio-energy that sustains physical and subtle existence.',
    terms: ['प्राण', 'prana', 'life-force', 'breath'],
    canonicalVersesConfig: [
      { scriptureSlug: 'prashna', chapter: 2, verseNum: 1, contextHi: 'प्राण की सार्वभौमिक श्रेष्ठता', contextEn: 'Prana indeed is the fire, the sun, the rain, and the indwelling ruler' },
      { scriptureSlug: 'katha', chapter: 2, verseNum: '2.2.5', contextHi: 'न प्राणेन नापानेन मर्त्यो जीवति कश्चन', contextEn: 'Not by prana, not by apana does any mortal live, but by another upon which both depend' },
    ],
  },
  {
    slug: 'moksha',
    titleSanskrit: 'मोक्ष',
    titleIast: 'mokṣa',
    titleEn: 'Mokṣa (Liberation, Spiritual Freedom & Transcendence)',
    etymology: 'मुच् (muc) — मोचने (To release, untie knots, attain final emancipation from limitation)',
    briefDefinitionHi: 'अविद्या, काम और कर्म के बंधनों से मुक्त होकर अपने शुद्ध सच्चिदानन्द स्वरूप में नित्य स्थित होना।',
    briefDefinitionEn: 'Supreme liberation from the cycle of rebirth and worldly bondage, realization of oneness with the Absolute.',
    terms: ['मोक्ष', 'मुक्ति', 'moksha', 'liberation', 'freedom', 'कैवल्य'],
    canonicalVersesConfig: [
      { scriptureSlug: 'bhagavadgita', chapter: 18, verseNum: 66, contextHi: 'अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः', contextEn: 'I shall liberate you from all sins; do not grieve' },
      { scriptureSlug: 'mundaka', chapter: 3, verseNum: '3.2.6', contextHi: 'वेदान्तविज्ञानसुनिश्चितार्थाः', contextEn: 'Those who have ascertained the meaning of Vedanta attain liberation in the supreme state' },
    ],
  },
  {
    slug: 'sthitaprajna',
    titleSanskrit: 'स्थितप्रज्ञ',
    titleIast: 'sthitaprajña',
    titleEn: 'Sthitaprajña (The Sage of Unshakable, Steady Wisdom)',
    etymology: 'स्थित + प्रज्ञा (sthita + prajñā) — One whose intuitive understanding is unshakeably rooted in the Self',
    briefDefinitionHi: 'जो सम्पूर्ण कामनाओं का त्याग कर अपनी आत्मा में ही संतुष्ट रहता है और सुख-दुःख में निर्विकार रहता है।',
    briefDefinitionEn: 'The awakened sage whose intellect is steadfast, untouched by desire, fear, or worldly perturbation.',
    terms: ['स्थितप्रज्ञ', 'sthitaprajna', 'steady wisdom', 'प्रजहाति'],
    canonicalVersesConfig: [
      { scriptureSlug: 'bhagavadgita', chapter: 2, verseNum: 55, contextHi: 'प्रजहाति यदा कामान्सर्वान्पार्थ मनोगतान्', contextEn: 'When a man completely casts off all desires of the mind and is satisfied in the Self alone' },
      { scriptureSlug: 'bhagavadgita', chapter: 2, verseNum: 56, contextHi: 'दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः', contextEn: 'He whose mind is not shaken by adversity, who does not hanker after happiness' },
      { scriptureSlug: 'bhagavadgita', chapter: 2, verseNum: 71, contextHi: 'विहाय कामान्यः सर्वान्पुमांश्चरति निःस्पृहः', contextEn: 'He who abandons all desires and moves about free from longing and egoism attains peace' },
    ],
  },
  {
    slug: 'nishkama',
    titleSanskrit: 'निष्काम',
    titleIast: 'niṣkāma',
    titleEn: 'Niṣkāma Karma (Desireless, Selfless Action)',
    etymology: 'निस् + काम (nis + kāma) — Free from personal transactional desires and selfish calculations',
    briefDefinitionHi: 'व्यक्तिगत फल की लालसा और स्वार्थ से रहित होकर केवल कर्तव्य और लोक-कल्याण की भावना से कर्म करना।',
    briefDefinitionEn: 'Selfless action performed without clinging to outcomes or personal egoic rewards.',
    terms: ['निष्काम', 'nishkama', 'desireless', 'अनासक्त', 'फलेषु'],
    canonicalVersesConfig: [
      { scriptureSlug: 'bhagavadgita', chapter: 2, verseNum: 47, contextHi: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन', contextEn: 'Action alone is your domain, never its fruits' },
      { scriptureSlug: 'bhagavadgita', chapter: 3, verseNum: 25, contextHi: 'कुर्याद्विद्वांस्तथासक्तश्चिकीर्षुर्लोकसंग्रहम्', contextEn: 'The wise should act without attachment, desiring the welfare of the world' },
    ],
  },
  {
    slug: 'sattva',
    titleSanskrit: 'सत्त्व',
    titleIast: 'sattva',
    titleEn: 'Sattva (Quality of Purity, Clarity, Light & Harmony)',
    etymology: 'सत् (sat) + त्व (tva) — Truth, being, that which is luminous and wholesome',
    briefDefinitionHi: 'प्रकृति का वह गुण जो निर्मल, प्रकाशक, शान्तिदायक और ज्ञान को उत्पन्न करने वाला है।',
    briefDefinitionEn: 'The mode of illumination, equilibrium, purity, and clarity among the three gunas.',
    terms: ['सत्त्व', 'sattva', 'purity', 'प्रकाशक'],
    canonicalVersesConfig: [
      { scriptureSlug: 'bhagavadgita', chapter: 14, verseNum: 6, contextHi: 'तत्र सत्त्वं निर्मलत्वात्प्रकाशकमनामयम्', contextEn: 'Of these, Sattva, being stainless, is luminous and free from sorrow' },
      { scriptureSlug: 'bhagavadgita', chapter: 14, verseNum: 11, contextHi: 'सर्वद्वारेषु देहेऽस्मिन्प्रकाश उपजायते', contextEn: 'When the light of wisdom shines through every gate of the body, Sattva is predominant' },
    ],
  },
  {
    slug: 'rajas',
    titleSanskrit: 'रजस्',
    titleIast: 'rajas',
    titleEn: 'Rajas (Quality of Passion, Restless Drive & Ambition)',
    etymology: 'रञ्ज् (rañj) — रागे (To color, desire, generate intense craving and restless motion)',
    briefDefinitionHi: 'प्रकृति का वह गुण जो तृष्णा, आसक्ति और तीव्र कर्म-प्रवृत्ति को जन्म देता है।',
    briefDefinitionEn: 'The mode of passion, agitation, ambition, and burning attachment that fuels ceaseless activity.',
    terms: ['रजस्', 'रजो', 'rajas', 'passion', 'लोभः'],
    canonicalVersesConfig: [
      { scriptureSlug: 'bhagavadgita', chapter: 14, verseNum: 7, contextHi: 'रजो रागात्मकं विद्धि तृष्णासङ्गसमुद्भवम्', contextEn: 'Know Rajas to be of the nature of passion, arising from thirst and attachment' },
      { scriptureSlug: 'bhagavadgita', chapter: 14, verseNum: 12, contextHi: 'लोभः प्रवृत्तिरारम्भः कर्मणामशमः स्पृहा', contextEn: 'Greed, activity, the undertaking of actions, restlessness, longing arise when Rajas increases' },
    ],
  },
  {
    slug: 'tamas',
    titleSanskrit: 'तमस्',
    titleIast: 'tamas',
    titleEn: 'Tamas (Quality of Inertia, Delusion & Obscurity)',
    etymology: 'तम् (tam) — ग्लानौ / अन्धकारे (To choke, obscure, darken, induce lethargy)',
    briefDefinitionHi: 'प्रकृति का वह गुण जो अज्ञान, प्रमाद, आलस्य और निद्रा को उत्पन्न कर चेतना को आच्छादित करता है।',
    briefDefinitionEn: 'The mode of darkness, inertia, delusion, and dullness that obscures perception and understanding.',
    terms: ['तमस्', 'तमो', 'tamas', 'inertia', 'darkness', 'प्रमाद'],
    canonicalVersesConfig: [
      { scriptureSlug: 'bhagavadgita', chapter: 14, verseNum: 8, contextHi: 'तमस्त्वज्ञानजं विद्धि मोहनं सर्वदेहिनाम्', contextEn: 'Know Tamas, which deludes all embodied beings, to be born of ignorance' },
      { scriptureSlug: 'bhagavadgita', chapter: 14, verseNum: 13, contextHi: 'अप्रकाशोऽप्रवृत्तिश्च प्रमादो मोह एव च', contextEn: 'Darkness, stagnation, negligence, and delusion arise when Tamas increases' },
    ],
  },
  {
    slug: 'rta',
    titleSanskrit: 'ऋत',
    titleIast: 'ṛta',
    titleEn: 'Ṛta (Primordial Cosmic Harmony, Truth & Rhythm)',
    etymology: 'ऋ (ṛ) — गतौ (The foundational cosmic rhythm, inviolable harmony that orders sun, seasons, and beings)',
    briefDefinitionHi: 'वैदिक दृष्टि में सम्पूर्ण सृष्टि को संचालित करने वाला शाश्वत प्राकृतिक और नैतिक नियम।',
    briefDefinitionEn: 'The supreme Vedic principle of eternal cosmic harmony, natural law, and inviolable rhythm governing the universe.',
    terms: ['ऋत', 'rta', 'cosmic rhythm', 'ऋतं वदिष्यामि'],
    canonicalVersesConfig: [
      { scriptureSlug: 'taittiriya', chapter: 1, verseNum: '1.1.1', contextHi: 'ऋतं वदिष्यामि सत्यं वदिष्यामि', contextEn: 'I shall speak the eternal cosmic rhythm, I shall speak the truth' },
      { scriptureSlug: 'rigveda', chapter: 1, verseNum: '1.1.8', contextHi: 'राजन्तमध्वराणां गोपाामृतस्य दीदिविम्', contextEn: 'Lord of sacrifices, shining guardian of cosmic order (Rta)' },
    ],
  },
];

interface DialogueDefinition {
  id: string;
  titleEn: string;
  titleHi: string;
  speaker: {
    nameEn: string;
    nameHi: string;
    roleEn: string;
    roleHi: string;
  };
  listener: {
    nameEn: string;
    nameHi: string;
    roleEn: string;
    roleHi: string;
  };
  scriptureSlug: string;
  scriptureTitle: string;
  category: string;
  chapters: number[];
  summaryEn: string;
  summaryHi: string;
  themes: string[];
  keyVersesConfig: Array<{
    chapter: number;
    verseNum: string | number;
    contextHi: string;
    contextEn: string;
  }>;
}

const SACRED_DIALOGUES: DialogueDefinition[] = [
  {
    id: 'krishna-arjuna',
    titleEn: 'Śrī Kṛṣṇa ↔ Arjuna (The Divine Song of Kurukṣetra)',
    titleHi: 'श्रीकृष्ण ↔ अर्जुन संवाद (कुरुक्षेत्र की रणभूमि में गीता उपदेश)',
    speaker: {
      nameEn: 'Śrī Kṛṣṇa',
      nameHi: 'श्रीकृष्ण',
      roleEn: 'Supreme Guide & Avatar',
      roleHi: 'परब्रह्म पूर्ण पुरुषोत्तम, पार्थसारथी',
    },
    listener: {
      nameEn: 'Arjuna',
      nameHi: 'अर्जुन',
      roleEn: 'The Disciple / Embodied Seeker',
      roleHi: 'जिज्ञासु भक्त व धनुर्धर',
    },
    scriptureSlug: 'bhagavadgita',
    scriptureTitle: 'Bhagavad Gita',
    category: 'itihasa',
    chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    summaryEn: 'Spoken on the brink of battle, this timeless dialogue addresses existential despondency, duty without attachment, the immortality of the Self, and devotion.',
    summaryHi: 'महाभारत के रणक्षेत्र में विषादग्रस्त अर्जुन को श्रीकृष्ण द्वारा आत्म-स्वरूप, निष्काम कर्म, ज्ञान और अनन्य शरणागति का परम उपदेश।',
    themes: ['Karma Yoga', 'Jnana Yoga', 'Bhakti Yoga', 'Atman', 'Dharma', 'Sthitaprajna'],
    keyVersesConfig: [
      { chapter: 2, verseNum: 47, contextHi: 'कर्मण्येवाधिकारस्ते — निष्काम कर्म का मूल मंत्र', contextEn: 'Dedication to duty without clinging to results' },
      { chapter: 2, verseNum: 20, contextHi: 'न जायते म्रियते वा — आत्मा की अमरता', contextEn: 'The eternal, indestructible nature of the Self' },
      { chapter: 18, verseNum: 66, contextHi: 'सर्वधर्मान्परित्यज्य — परम शरणागति', contextEn: 'Final surrender into the supreme sanctuary' },
    ],
  },
  {
    id: 'yama-naciketa',
    titleEn: 'Yamarāja ↔ Naciketā (Dialogue of Death & Immortality)',
    titleHi: 'यमराज ↔ नचिकेता संवाद (मृत्यु के रहस्य और अमर आत्मा की खोज)',
    speaker: {
      nameEn: 'Yamarāja (Lord of Dharma & Death)',
      nameHi: 'यमराज (धर्मराज)',
      roleEn: 'Master of Transition & Immortality',
      roleHi: 'मृत्यु और धर्म के अधिष्ठाता देव',
    },
    listener: {
      nameEn: 'Naciketā',
      nameHi: 'नचिकेता',
      roleEn: 'Incorruptible Young Seeker of Truth',
      roleHi: 'अडिग, निष्कपट बाल ब्रह्मचारी',
    },
    scriptureSlug: 'katha',
    scriptureTitle: 'Katha Upanishad',
    category: 'upanishad',
    chapters: [1, 2],
    summaryEn: 'Refusing all worldly wealth, youth, and kingdoms, young Nachiketa demands the third boon: what lies beyond death? Yama reveals the secret of the imperishable Atman.',
    summaryHi: 'समस्त सांसारिक प्रलोभनों को ठुकराकर नचिकेता ने मृत्यु के रहस्य और आत्मा की अमरता का प्रश्न पूछा, जहाँ यमराज ने श्रेय और प्रेय का मार्ग उद्घाटित किया।',
    themes: ['Shreyas vs Preyas', 'Nature of Death', 'Immortal Atman', 'Chariot Metaphor', 'Om'],
    keyVersesConfig: [
      { chapter: 1, verseNum: '1.2.1', contextHi: 'अन्यच्छ्रेयोऽन्यदुतैव प्रेयः — श्रेय और प्रेय का विवेक', contextEn: 'The good (shreyas) is one thing; the pleasant (preyas) another' },
      { chapter: 1, verseNum: '1.2.18', contextHi: 'न जायते म्रियते वा विपश्चित् — आत्मा की अजरता', contextEn: 'The conscious Self is not born nor dies' },
      { chapter: 1, verseNum: '1.3.3', contextHi: 'आत्मानँ रथिनं विद्धि — शरीर रूपी रथ का दृष्टांत', contextEn: 'Know the Self as the lord of the chariot and the body as the vehicle' },
    ],
  },
  {
    id: 'yajnavalkya-maitreyi',
    titleEn: 'Yājñavalkya ↔ Maitreyī (Love, Wealth & Transcendental Self)',
    titleHi: 'याज्ञवल्क्य ↔ मैत्रेयी संवाद (अमृतत्व और प्रेम का परमतत्व)',
    speaker: {
      nameEn: 'Sage Yājñavalkya',
      nameHi: 'महर्षि याज्ञवल्क्य',
      roleEn: 'Brahmarṣi & Supreme Teacher of Non-Duality',
      roleHi: 'सर्वश्रेष्ठ ब्रह्मवेत्ता मुनि',
    },
    listener: {
      nameEn: 'Maitreyī',
      nameHi: 'विदुषी मैत्रेयी',
      roleEn: 'Philosopher Wife Seeking Immortality',
      roleHi: 'अमृतत्व की अभीप्सु तत्वज्ञानी विदुषी',
    },
    scriptureSlug: 'brihadaranyaka',
    scriptureTitle: 'Brihadaranyaka Upanishad',
    category: 'upanishad',
    chapters: [2, 4],
    summaryEn: 'When Yajnavalkya prepares to enter monastic life and divide his wealth, Maitreyi asks: "If the whole earth filled with wealth were mine, would I become immortal?" This sparks the sublime teaching on love and the Self.',
    summaryHi: 'सांसारिक धन-सम्पदा के स्थान पर मैत्रेयी ने अमृतत्व का साधन माँगा, जिसके प्रत्युत्तर में याज्ञवल्क्य ने बताया कि सब कुछ केवल आत्मा के प्रेम के लिए ही प्रिय होता है।',
    themes: ['Immortality', 'Atman as Supreme Love', 'Neti Neti', 'Universal Consciousness'],
    keyVersesConfig: [
      { chapter: 2, verseNum: '2.4.5', contextHi: 'न वा अरे पत्युः कामाय पतिः प्रियो भवति — आत्मन्स्तु कामाय सर्वं प्रियं भवति', contextEn: 'Not for the sake of all is all dear, but for the sake of the Self is all dear' },
      { chapter: 4, verseNum: '4.5.15', contextHi: 'यत्र हि द्वैतमिव भवति तदितर इतरं पश्यति — द्वैत और अद्वैत का बोध', contextEn: 'Where there is duality as it were, there one sees another; but where all has become the Self, what should one see and through what?' },
    ],
  },
  {
    id: 'ashtavakra-janaka',
    titleEn: 'Aṣṭāvakra ↔ Janaka (Direct Awakening into Non-Dual Freedom)',
    titleHi: 'अष्टावक्र ↔ राजा जनक संवाद (तत्काल आत्म-साक्षात्कार और निर्विकल्प मुक्ति)',
    speaker: {
      nameEn: 'Aṣṭāvakra',
      nameHi: 'ऋषि अष्टावक्र',
      roleEn: 'De-conditioned Seer of Pure Being',
      roleHi: 'अद्वैत बोध के मूर्तिमान द्रष्टा',
    },
    listener: {
      nameEn: 'Rāja Janaka',
      nameHi: 'महाराज जनक (विदेह)',
      roleEn: 'Philosopher King & Ready Seeker',
      roleHi: 'विदेह आत्म-जिज्ञासु राजा',
    },
    scriptureSlug: 'ashtavakra',
    scriptureTitle: 'Ashtavakra Gita',
    category: 'other',
    chapters: [1, 2, 3, 4, 5, 11, 12, 18],
    summaryEn: 'Without preliminary rituals or prolonged stages, Ashtavakra transmits instantaneous awakening to King Janaka: "You are not the body, you are pure awareness, witness of all worlds."',
    summaryHi: 'राजा जनक द्वारा ज्ञान, मुक्ति और वैराग्य के साधन पूछे जाने पर अष्टावक्र ने तत्क्षण निर्भय उद्घोष किया कि तुम शुद्ध, बोधरूप और मुक्त हो।',
    themes: ['Instant Enlightenment', 'Sakshi Chaitanya', 'Radical Non-Duality', 'Freedom from Karma'],
    keyVersesConfig: [
      { chapter: 1, verseNum: 4, contextHi: 'यदि देहं पृथक्कृत्य चिति विश्राम्य तिष्ठसि', contextEn: 'If you detach yourself from the body and rest in consciousness, you will immediately be happy and peaceful' },
      { chapter: 1, verseNum: 15, contextHi: 'निःसङ्गो निष्क्रियोऽसि त्वं स्वप्रकाशो निरञ्जनः', contextEn: 'You are unattached, actionless, self-luminous, and stainless' },
    ],
  },
  {
    id: 'pippalada-disciples',
    titleEn: 'Pippalāda ↔ The Six Seekers (The Cosmic Questions)',
    titleHi: 'महर्षि पिप्पलाद ↔ षड् मुनि संवाद (सृष्टि, प्राण और ओंकार का अन्वेषण)',
    speaker: {
      nameEn: 'Sage Pippalāda',
      nameHi: 'महर्षि पिप्पलाद',
      roleEn: 'Venerated Vedic Sage of Radiance',
      roleHi: 'तपःपूत वैदिक महर्षि',
    },
    listener: {
      nameEn: 'Six Munis (Kabandhi, Bhargava, Kausalya, Gargya, Satyakama, Sukesha)',
      nameHi: 'षड् ब्रह्मनिष्ठ मुनि (कबन्धी, भार्गव, कौसल्य, गार्ग्य, सत्यकाम, सुकेशा)',
      roleEn: 'Earnest Disciples Practicing Tapas & Brahmacharya',
      roleHi: 'एक वर्ष तक तप और श्रद्धापूर्वक निवास करने वाले छह जिज्ञासु',
    },
    scriptureSlug: 'prashna',
    scriptureTitle: 'Prashna Upanishad',
    category: 'upanishad',
    chapters: [1, 2, 3, 4, 5, 6],
    summaryEn: 'Six sincere seekers ask six ascending questions on the origin of beings, the sovereign power of Prana, dream consciousness, and the sixteenfold Purusha.',
    summaryHi: 'छह ब्रह्मनिष्ठ साधकों के छह गंभीर प्रश्नों के माध्यम से सृष्टि-उत्पत्ति, प्राण की सर्वोपरिता, स्वप्न-सुषुप्ति और षोडशकल पुरुष का निरूपण।',
    themes: ['Prana and Rayi', 'Origin of Life', 'Dream Consciousness', 'Om Meditation', 'Shodasha-kala Purusha'],
    keyVersesConfig: [
      { chapter: 2, verseNum: 1, contextHi: 'अथो ह प्राण उवाच — प्राण की श्रेष्ठता', contextEn: 'Prana said to the senses: Do not be deluded; I alone sustain this body' },
      { chapter: 5, verseNum: 2, contextHi: 'एतद्वै सत्यकाम परं चापरं च ब्रह्म यदोंकारः', contextEn: 'O Satyakama, this syllable Om is indeed both the higher and lower Brahman' },
    ],
  },
  {
    id: 'bhrigu-varuna',
    titleEn: 'Bhṛgu ↔ Varuṇa (The Stepped Ladder of Brahman)',
    titleHi: 'भृगु ↔ वरुण संवाद (अन्न से आनंद तक ब्रह्म की सोपान-यात्रा)',
    speaker: {
      nameEn: 'Varuṇa',
      nameHi: 'वरुण देव (पिता एवं गुरु)',
      roleEn: 'Cosmic Guide Pointing to Tapas',
      roleHi: 'तप द्वारा सत्य उद्घाटित करने वाले पिता व गुरु',
    },
    listener: {
      nameEn: 'Bhṛgu',
      nameHi: 'भृगु मुनि (पुत्र एवं शिष्य)',
      roleEn: 'Persistent Inquirer Penetrating Koshas',
      roleHi: 'तपस्या द्वारा स्वयं सत्य को खोजने वाले जिज्ञासु',
    },
    scriptureSlug: 'taittiriya',
    scriptureTitle: 'Taittiriya Upanishad',
    category: 'upanishad',
    chapters: [3],
    summaryEn: 'Bhrigu asks his father Varuna to teach him Brahman. Varuna repeatedly guides him: "Know Brahman through Tapas." Bhrigu progressively realizes Brahman as Anna, Prana, Manas, Vijnana, and finally Ananda.',
    summaryHi: 'वरुण ने पुत्र भृगु को बाहर से उत्तर देने के बजाय तप करने भेजा, जिससे भृगु ने अन्नमय, प्राणमय, मनोमय, विज्ञानमय से होते हुए आनंदमय ब्रह्म का साक्षात्कार किया।',
    themes: ['Pancha Koshas', 'Tapas as Investigation', 'Ananda Brahman', 'Progressive Realization'],
    keyVersesConfig: [
      { chapter: 3, verseNum: '3.1.1', contextHi: 'यतो वा इमानि भूतानि जायन्ते — ब्रह्म का लक्षण', contextEn: 'That from which all beings are born, by which they live, and into which they dissolve' },
      { chapter: 3, verseNum: '3.6.1', contextHi: 'आनन्दो ब्रह्मेति व्यजानात् — आनंद ही ब्रह्म है', contextEn: 'He knew that Ananda (Bliss) is Brahman' },
    ],
  },
  {
    id: 'shiva-parvati',
    titleEn: 'Śiva ↔ Pārvatī (Tantric & Purāṇic Dialogue of Essence)',
    titleHi: 'शिव ↔ पार्वती संवाद (शिव-शक्ति संवाद व पराज्ञान का प्रकाशन)',
    speaker: {
      nameEn: 'Lord Śiva (Mahādeva)',
      nameHi: 'भगवान शिव (महादेव)',
      roleEn: 'Transcendent Consciousness & Adi Guru',
      roleHi: 'परब्रह्म स्वरूप आदिगुरु',
    },
    listener: {
      nameEn: 'Devī Pārvatī',
      nameHi: 'माता पार्वती',
      roleEn: 'Divine Mother Asking for Universal Benefit',
      roleHi: 'जगन्माता, लोक-कल्याण हेतु प्रश्नकर्त्री',
    },
    scriptureSlug: 'shivpurana',
    scriptureTitle: 'Shiva Purana',
    category: 'purana',
    chapters: [1, 2],
    summaryEn: 'For the liberation of all beings in the modern age, the Divine Mother inquires into the essence of truth, breath awareness, devotion, and supreme stillness, answered by Mahadeva.',
    summaryHi: 'संसार के उद्धार के लिए देवी पार्वती ने शिवजी से धर्म, मुक्ति और साधना का मर्म पूछा, जहाँ भगवान शिव ने अद्वैत स्वरूप का ज्ञान दिया।',
    themes: ['Shiva and Shakti', 'Surrender', 'Inner Breath', 'Maha-Mrityunjaya', 'Self-Realization'],
    keyVersesConfig: [
      { chapter: 1, verseNum: 1, contextHi: 'शिव-तत्व की महिमा और ज्ञान-प्रकाश', contextEn: 'The glory of Shiva as infinite consciousness and grace' },
    ],
  },
  {
    id: 'suta-shaunaka',
    titleEn: 'Sūta ↔ Śaunaka (The Naimiṣāraṇya Conclave)',
    titleHi: 'सूत जी ↔ शौनक मुनि संवाद (नैमिषारण्य में ऋषियों की संगति)',
    speaker: {
      nameEn: 'Sūta Goswāmī (Ugraśravas)',
      nameHi: 'सूत जी (रोमहर्षण/उग्रश्रवा)',
      roleEn: 'Purāṇic Chronicler of Sacred Memory',
      roleHi: 'व्यास शिष्य, समस्त पुराणों के ज्ञाता वक्ता',
    },
    listener: {
      nameEn: 'Śaunaka & The 88,000 Rishis',
      nameHi: 'शौनक जी एवं नैमिषारण्य के ऋषिगण',
      roleEn: 'Seekers Conducting Continuous Sacrifice for Global Harmony',
      roleHi: 'कलियुग में मानवता के कल्याण हेतु सतत सत्र करने वाले मुनि',
    },
    scriptureSlug: 'bhagavatapurana',
    scriptureTitle: 'Bhagavata Purana',
    category: 'purana',
    chapters: [1],
    summaryEn: 'Gathered in the sacred forest of Naimisharanya, sage Shaunaka asks Suta: "What is the ultimate good for human beings? What is the essence of all scriptures?" Suta unfolds the nectar of divine knowledge.',
    summaryHi: 'नैमिषारण्य में शौनक मुनि ने पूछा कि संपूर्ण शास्त्रों का सार और मानव मात्र का चरम कल्याण किसमें है, जिसका उत्तर सूत जी ने विस्तार से दिया।',
    themes: ['Supreme Good of Humankind', 'Essence of Puranas', 'Pure Bhakti', 'Remembrance'],
    keyVersesConfig: [
      { chapter: 1, verseNum: 1, contextHi: 'जन्माद्यस्य यतोऽन्वयादितरतश्च — आदि श्लोक', contextEn: 'Meditating upon the Absolute Truth from whom the creation arises' },
    ],
  },
];

// Helper to safely read a chapter JSON shard
function readShard(scriptureSlug: string, chapter: number): ChapterShard | null {
  const filePath = path.join(fullScripturesDir, scriptureSlug, `ch-${chapter}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw) as ChapterShard;
  } catch {
    return null;
  }
}

// Find a verse in a shard by verse number (number or string format)
function findVerseInShard(shard: ChapterShard, verseNum: string | number): VerseShardRecord | null {
  const verses = shard.chapter?.verses;
  if (!verses || !Array.isArray(verses)) return null;

  const targetStr = String(verseNum).trim();
  const directMatch = verses.find((v) => String(v.number).trim() === targetStr);
  if (directMatch) return directMatch;

  // Handle dot notation (e.g. "1.2.18" -> match 18 or last component)
  if (targetStr.includes('.')) {
    const parts = targetStr.split('.');
    const lastPart = parts[parts.length - 1];
    const match = verses.find((v) => String(v.number).trim() === lastPart);
    if (match) return match;
  }

  return null;
}

async function main() {
  console.log('⚡ Starting build-time Śabda-Kośa Concordance & Saṃvāda index generation...');

  // Ensure output directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // 1. Build Concordance Index
  console.log('📖 Scanning scripture shards for core philosophical concepts...');
  const concordanceOutput: Record<string, unknown>[] = [];

  for (const concept of CORE_CONCEPTS) {
    const categoryCounts: Record<string, number> = {
      veda: 0,
      upanishad: 0,
      itihasa: 0,
      purana: 0,
      smriti: 0,
      other: 0,
      total: 0,
    };

    // Scan all scripture catalog entries
    for (const scripture of scriptureCatalog) {
      const cat = (scripture.category || 'other').toLowerCase();
      const scriptureDir = path.join(fullScripturesDir, scripture.id);
      if (!fs.existsSync(scriptureDir)) continue;

      // Count occurrences in up to 30 chapters to keep build super fast
      const maxCh = Math.min(scripture.totalChapters || 1, 30);
      for (let ch = 1; ch <= maxCh; ch++) {
        const shard = readShard(scripture.id, ch);
        if (!shard?.chapter?.verses) continue;

        for (const verse of shard.chapter.verses) {
          const textToSearch = `${verse.sanskrit || ''} ${verse.hindi || ''} ${verse.translation || ''} ${verse.commentary || ''}`.toLowerCase();
          const matches = concept.terms.some((term) => textToSearch.includes(term.toLowerCase()));
          if (matches) {
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
            categoryCounts.total++;
          }
        }
      }
    }

    // Hydrate canonical verses
    const canonicalVerses: Array<{
      scriptureSlug: string;
      scriptureTitle: string;
      chapter: number;
      verseNum: string | number;
      sanskrit: string;
      transliteration?: string;
      hindi?: string;
      translation?: string;
      contextHi: string;
      contextEn: string;
    }> = [];

    for (const cfg of concept.canonicalVersesConfig) {
      const meta = scriptureCatalog.find((s) => s.id === cfg.scriptureSlug) || {
        id: cfg.scriptureSlug,
        title: cfg.scriptureSlug,
      };

      const shard = readShard(cfg.scriptureSlug, cfg.chapter);
      let foundVerse: VerseShardRecord | null = null;
      if (shard) {
        foundVerse = findVerseInShard(shard, cfg.verseNum);
      }

      canonicalVerses.push({
        scriptureSlug: cfg.scriptureSlug,
        scriptureTitle: meta.title,
        chapter: cfg.chapter,
        verseNum: cfg.verseNum,
        sanskrit: foundVerse?.sanskrit || 'मूल श्लोक पाठ',
        transliteration: foundVerse?.transliteration,
        hindi: foundVerse?.hindi,
        translation: foundVerse?.translation,
        contextHi: cfg.contextHi,
        contextEn: cfg.contextEn,
      });
    }

    concordanceOutput.push({
      slug: concept.slug,
      titleSanskrit: concept.titleSanskrit,
      titleIast: concept.titleIast,
      titleEn: concept.titleEn,
      etymology: concept.etymology,
      briefDefinitionHi: concept.briefDefinitionHi,
      briefDefinitionEn: concept.briefDefinitionEn,
      categoryCounts,
      canonicalVerses,
    });
  }

  const concordancePath = path.join(dataDir, 'concordance-index.json');
  fs.writeFileSync(concordancePath, JSON.stringify(concordanceOutput, null, 2), 'utf8');
  console.log(`✅ Generated ${concordancePath} (${concordanceOutput.length} concepts indexed)`);

  // 2. Build Samvada Dialogues Index
  console.log('🗣️  Building Saṃvāda sacred dialogues index...');
  const dialoguesOutput: Record<string, unknown>[] = [];

  for (const dialogue of SACRED_DIALOGUES) {
    const keyVerses: Array<{
      chapter: number;
      verseNum: string | number;
      sanskrit: string;
      transliteration?: string;
      hindi?: string;
      translation?: string;
      contextHi: string;
      contextEn: string;
    }> = [];

    for (const cfg of dialogue.keyVersesConfig) {
      const shard = readShard(dialogue.scriptureSlug, cfg.chapter);
      let foundVerse: VerseShardRecord | null = null;
      if (shard) {
        foundVerse = findVerseInShard(shard, cfg.verseNum);
      }

      keyVerses.push({
        chapter: cfg.chapter,
        verseNum: cfg.verseNum,
        sanskrit: foundVerse?.sanskrit || 'मूल श्लोक',
        transliteration: foundVerse?.transliteration,
        hindi: foundVerse?.hindi,
        translation: foundVerse?.translation,
        contextHi: cfg.contextHi,
        contextEn: cfg.contextEn,
      });
    }

    dialoguesOutput.push({
      ...dialogue,
      keyVerses,
    });
  }

  const dialoguesPath = path.join(dataDir, 'samvada-dialogues.json');
  fs.writeFileSync(dialoguesPath, JSON.stringify(dialoguesOutput, null, 2), 'utf8');
  console.log(`✅ Generated ${dialoguesPath} (${dialoguesOutput.length} dialogues indexed)`);

  console.log('🎉 Phase 6 build-concordance-db completed successfully!');
}

main().catch((err) => {
  console.error('❌ Error in build-concordance-db:', err);
  process.exit(1);
});
