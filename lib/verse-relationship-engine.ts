import { SCRIPTURE_ALIASES } from '@/data/scripture-aliases';
import { SCRIPTURE_NAMES } from '@/data/scripture-names';
import { CONNECTIONS, CONNECTION_LABEL, verseKey, type ConnectionKind } from '@/data/study-content';
import { getVerseIntegrations } from '@/lib/verse-integrations';
import { readHref } from '@/lib/verse-paths';

/** Titles only. The verse graph runs in the browser, so it cannot import data/scriptures. */
function scriptureTitle(id: string): { title: string; titleSanskrit?: string } | undefined {
  const canonical = SCRIPTURE_ALIASES[id] ?? id;
  return SCRIPTURE_NAMES[canonical] ?? SCRIPTURE_NAMES[id];
}

export type RelationshipType =
  | 'supporting'
  | 'contrasting'
  | 'parallel'
  | 'cross_scripture'
  | 'concept_connection';

export interface VerseGraphNode {
  id: string;
  label: string;
  labelHi?: string;
  reference: string;
  scriptureId: string;
  scriptureTitle: string;
  scriptureTitleSanskrit?: string;
  chapterId?: number;
  verseId?: string | number;
  type: RelationshipType;
  sanskrit?: string;
  translation?: string;
  explanation?: string;
  href: string;
  relationshipReason: string;
  isExternalScripture: boolean;
  conceptId?: string;
  category?: string;
}

export interface VerseGraphEdge {
  source: string;
  target: string;
  type: RelationshipType;
  label: string;
  labelHi: string;
}

export interface VerseGraphData {
  centralNode: {
    id: string;
    label: string;
    reference: string;
    scriptureId: string;
    scriptureTitle: string;
    scriptureTitleSanskrit?: string;
    chapterId: number;
    verseId: string | number;
    sanskrit?: string;
    translation?: string;
  };
  nodes: VerseGraphNode[];
  edges: VerseGraphEdge[];
  stats: {
    totalConnections: number;
    crossScriptureCount: number;
    parallelCount: number;
    supportingCount: number;
    contrastingCount: number;
    conceptCount: number;
  };
}

export const RELATIONSHIP_META: Record<
  RelationshipType,
  { label: string; labelHi: string; color: string; badgeCls: string; icon: string }
> = {
  supporting: {
    label: 'Supporting Verse',
    labelHi: 'पुष्टि / प्रमाण श्लोक',
    color: '#059669', // emerald
    badgeCls: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300',
    icon: '🟢',
  },
  parallel: {
    label: 'Parallel Teaching',
    labelHi: 'समान उपदेश',
    color: '#2563eb', // blue
    badgeCls: 'border-blue-500/40 bg-blue-500/10 text-blue-800 dark:text-blue-300',
    icon: '🔵',
  },
  contrasting: {
    label: 'Contrasting Focus',
    labelHi: 'वैकल्पिक / भिन्न दृष्टिकोण',
    color: '#d97706', // amber
    badgeCls: 'border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300',
    icon: '🟠',
  },
  cross_scripture: {
    label: 'Cross-Scriptural Link',
    labelHi: 'पार-ग्रंथ सम्बन्ध (गीता ↔ उपनिषद् ↔ रामायण)',
    color: '#7c3aed', // purple
    badgeCls: 'border-purple-500/40 bg-purple-500/10 text-purple-800 dark:text-purple-300',
    icon: '🟣',
  },
  concept_connection: {
    label: 'Philosophical Concept',
    labelHi: 'दार्शनिक सूत्र',
    color: '#ca8a04', // saffron / yellow
    badgeCls: 'border-saffron-500/40 bg-saffron-500/10 text-saffron-800 dark:text-saffron-300',
    icon: '🟡',
  },
};

/**
 * Classical Canonical Parallels Registry:
 * Maps celebrated verse connections across Gita, Upanishads, Vedas, and Epics.
 */
interface CanonicalEcho {
  targetScriptureId: string;
  targetScriptureTitle: string;
  targetChapter: number;
  targetVerse: number | string;
  targetReference: string;
  type: RelationshipType;
  sanskrit: string;
  translation: string;
  reason: string;
  reasonHi: string;
}

const CANONICAL_CROSS_ECHOS: Record<string, CanonicalEcho[]> = {
  'bhagavadgita:2:20': [
    {
      targetScriptureId: 'katha',
      targetScriptureTitle: 'Katha Upanishad',
      targetChapter: 2,
      targetVerse: 18,
      targetReference: 'Katha Upanishad 2.18',
      type: 'parallel',
      sanskrit: 'न जायते म्रियते वा विपश्चिन्नायं कुतश्चिन्न बभूव कश्चित् । अजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे ॥',
      translation: 'The knowing Self is never born, nor does it die. It sprang from nothing, and nothing sprang from it. It is unborn, eternal, everlasting and ancient; it is not slain when the body is slain.',
      reason: 'Direct verbatim parallel: Sri Krishna quotes the ancient Katha Upanishad mantra almost word-for-word to establish the immortality of the conscious witness.',
      reasonHi: 'प्रत्यक्ष श्रुति प्रमाण: भगवान श्रीकृष्ण ने कठोपनिषद् के इस प्रसिद्ध मंत्र को लगभग यथावत उद्धृत कर आत्मा की नित्यता सिद्ध की है।',
    },
    {
      targetScriptureId: 'bhagavadgita',
      targetScriptureTitle: 'Bhagavad Gita',
      targetChapter: 2,
      targetVerse: 23,
      targetReference: 'BG 2.23',
      type: 'supporting',
      sanskrit: 'नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः । न चैनं क्लेदयन्त्यापो न शोषयति मारुतः ॥',
      translation: 'Weapons do not cleave the Self, fire does not burn it, water does not wet it, and wind does not dry it.',
      reason: 'Metaphysical proof: Explains why the Self is unslain—it is completely impervious to the four material elements.',
      reasonHi: 'दार्शनिक पुष्टि: आत्मा के अवध्य होने का कारण स्पष्ट करता है कि वह चारों भौतिक तत्वों से परे और अभेद्य है।',
    },
  ],
  'bhagavadgita:2:47': [
    {
      targetScriptureId: 'ishavasya',
      targetScriptureTitle: 'Isha Upanishad',
      targetChapter: 1,
      targetVerse: 2,
      targetReference: 'Isha Upanishad 2',
      type: 'parallel',
      sanskrit: 'कुर्वन्नेवेह कर्माणि जिजीविषेच्छतं समाः । एवं त्वयि नान्यथेतोऽस्ति न कर्म लिप्यते नरे ॥',
      translation: 'Always performing karma in this world, one should desire to live a full hundred years. Thus for you, a human being, there is no other way by which action does not adhere to you.',
      reason: 'Vedic antecedent: The Isha Upanishad establishes the foundational Vedic doctrine that life is sanctified through unattached, selfless action.',
      reasonHi: 'वैदिक मूल आधार: ईशोपनिषद् का यह मंत्र निष्काम कर्म द्वारा जीवन जीने और कर्म-बन्धन से मुक्त रहने का आदि-स्रोत है।',
    },
    {
      targetScriptureId: 'bhagavadgita',
      targetScriptureTitle: 'Bhagavad Gita',
      targetChapter: 2,
      targetVerse: 48,
      targetReference: 'BG 2.48',
      type: 'supporting',
      sanskrit: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय । सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ॥',
      translation: 'Established in Yoga, perform your actions, casting off attachment, O Arjuna, remaining equal in success and failure. Equanimity is called Yoga.',
      reason: 'Direct continuation: Defines the mental state (Samatvam) required to execute the mandate of 2.47 without slipping into anxiety.',
      reasonHi: 'तात्विक विस्तार: 2.47 के उपदेश को व्यवहार में लाने हेतु आवश्यक समत्व बुद्धि की परिभाषा देता है।',
    },
    {
      targetScriptureId: 'bhagavadgita',
      targetScriptureTitle: 'Bhagavad Gita',
      targetChapter: 3,
      targetVerse: 19,
      targetReference: 'BG 3.19',
      type: 'supporting',
      sanskrit: 'तस्मादसक्तः सततं कार्यं कर्म समाचर । असक्तो ह्याचरन्कर्म परमाप्नोति पूरुषः ॥',
      translation: 'Therefore, unattached, always perform the action that must be done. Indeed, by performing action without attachment, a person attains the Supreme.',
      reason: 'Spiritual culmination: Affirms that unattached work is not merely a social obligation, but a direct pathway to ultimate liberation.',
      reasonHi: 'साधना पुष्टि: स्पष्ट करता है कि अनासक्त कर्म केवल कर्तव्य नहीं, अपितु मोक्ष का प्रत्यक्ष साधन है।',
    },
  ],
  'bhagavadgita:2:48': [
    {
      targetScriptureId: 'bhagavadgita',
      targetScriptureTitle: 'Bhagavad Gita',
      targetChapter: 2,
      targetVerse: 50,
      targetReference: 'BG 2.50',
      type: 'supporting',
      sanskrit: 'बुद्धियुक्तो जहातीह उभे सुकृतदुष्कृते । तस्माद्योगाय युज्यस्व योगः कर्मसु कौशलम् ॥',
      translation: 'One endowed with equanimity casts off both good and evil deeds here. Therefore, dedicate yourself to Yoga; Yoga is dexterity in action.',
      reason: 'Definition of Karmasu Kaushalam: Explains how equanimity produces supreme excellence and craftsmanship without psychological exhaustion.',
      reasonHi: 'कर्मसु कौशलम् की व्याख्या: समत्व बुद्धि किस प्रकार बिना उद्वेग के सर्वोच्च कार्य-कुशलता प्रदान करती है।',
    },
    {
      targetScriptureId: 'katha',
      targetScriptureTitle: 'Katha Upanishad',
      targetChapter: 2,
      targetVerse: 2,
      targetReference: 'Katha Upanishad 2.2',
      type: 'contrasting',
      sanskrit: 'श्रेयश्च प्रेयश्च मनुष्यमेतस्तौ संपरीत्य विविनक्ति धीरः । श्रेयो हि धीरोऽभि प्रेयसो वृणीते प्रेयो मन्दो योगक्षेमाद्वृणीते ॥',
      translation: 'Both the good (Shreya) and the pleasant (Preya) approach human beings. The wise examine both and discriminate; the wise choose Shreya over Preya, while the short-sighted choose Preya for worldly preservation.',
      reason: 'Discrimination between immediate gratification (Preya) and enduring spiritual equilibrium (Shreya).',
      reasonHi: 'श्रेयस और प्रेयस का विवेक: तात्कालिक सुख (प्रेय) और स्थायी आध्यात्मिक समत्व (श्रेय) का अंतर।',
    },
  ],
  'bhagavadgita:2:55': [
    {
      targetScriptureId: 'katha',
      targetScriptureTitle: 'Katha Upanishad',
      targetChapter: 6,
      targetVerse: 14,
      targetReference: 'Katha Upanishad 6.14',
      type: 'parallel',
      sanskrit: 'यदा सर्वे प्रमुच्यन्ते कामा येऽस्य हृदि श्रिताः । अथ मर्त्योऽमृतो भवत्यत्र ब्रह्म समश्नुते ॥',
      translation: 'When all desires that dwell in the heart are cast away, then the mortal becomes immortal and attains Brahman here itself.',
      reason: 'Upanishadic definition of Sthitaprajna: Both texts teach that the release of mental craving leads directly to unshakeable wisdom and immortality.',
      reasonHi: 'स्थितप्रज्ञ की उपनिषद् परिभाषा: हृदय की सभी वासनाओं के छूटने पर जीव यहीं ब्रह्मभाव प्राप्त करता है।',
    },
    {
      targetScriptureId: 'bhagavadgita',
      targetScriptureTitle: 'Bhagavad Gita',
      targetChapter: 2,
      targetVerse: 71,
      targetReference: 'BG 2.71',
      type: 'supporting',
      sanskrit: 'विहाय कामान्यः सर्वान्पुमांश्चरति निःस्पृहः । निर्ममो निरहङ्कारः स शान्तिमधिगच्छति ॥',
      translation: 'Abandoning all desires, that person who moves without longing, devoid of sense of ownership and free from egoism—he attains supreme peace.',
      reason: 'Culmination of chapter 2: Clarifies that inner shanti is attained only when identity is freed from egoic grasping.',
      reasonHi: 'अध्याय 2 की पूर्णता: ममता और अहंकार से मुक्ति ही वास्तविक शांति का द्वार है।',
    },
  ],
  'bhagavadgita:3:21': [
    {
      targetScriptureId: 'bhagavadgita',
      targetScriptureTitle: 'Bhagavad Gita',
      targetChapter: 3,
      targetVerse: 25,
      targetReference: 'BG 3.25',
      type: 'supporting',
      sanskrit: 'सक्ताः कर्मण्यविद्वांसो यथा कुर्वन्ति भारत । कुर्याद्विद्वांस्तथासक्तश्चिकीर्षुर्लोकसंग्रहम् ॥',
      translation: 'As the unlearned act with attachment to work, O Bharata, so should the wise act without attachment, desiring the welfare of the world (Lokasamgraha).',
      reason: 'Lokasamgraha principle: Identifies the motivation of the Dharmic leader as universal welfare rather than personal ambition.',
      reasonHi: 'लोकसंग्रह सिद्धांत: धर्मनिष्ठ नेतृत्व का उद्देश्य व्यक्तिगत यश नहीं, अपितु समाज का कल्याण है।',
    },
    {
      targetScriptureId: 'ramayana',
      targetScriptureTitle: 'Valmiki Ramayana',
      targetChapter: 2,
      // The library's text (DharmicData) numbers this shloka 109.10.
      targetVerse: '109.10',
      targetReference: 'Ayodhya Kanda 109.10',
      type: 'cross_scripture',
      sanskrit: 'सत्यमेवानृशंसं च राजवृत्तं सनातनम् । तस्मात्सत्यात्मको राजा सत्ये लोकः प्रतिष्ठितः ॥',
      translation: 'Truthfulness and non-cruelty constitute the eternal conduct of a sovereign ruler. Therefore, the ruler is rooted in truth, and the world is sustained by truth.',
      reason: 'Epic parallel: Sri Rama exemplifies the ideal sovereign conduct described in BG 3.21 by prioritizing exemplary moral conduct over personal comfort.',
      reasonHi: 'रामायण समानांतर: मर्यादा पुरुषोत्तम श्रीराम ने आचरण द्वारा नेतृत्व की मर्यादा स्थापित की।',
    },
  ],
  'bhagavadgita:4:7': [
    {
      targetScriptureId: 'bhagavadgita',
      targetScriptureTitle: 'Bhagavad Gita',
      targetChapter: 4,
      targetVerse: 8,
      targetReference: 'BG 4.8',
      type: 'supporting',
      sanskrit: 'परित्राणाय साधूनां विनाशाय च दुष्कृताम् । धर्मसंस्थापनार्थाय सम्भवामि युगे युगे ॥',
      translation: 'For the protection of the good, for the destruction of the wicked, and for the firm establishment of Dharma, I manifest in every age.',
      reason: 'The Tripartite Avatara Mission: Completes the declaration of 4.7 by detailing the exact cosmic purpose of divine descent.',
      reasonHi: 'अवतार का त्रिविध उद्देश्य: धर्म स्थापना, साधुओं की रक्षा और अधर्म के विनाश का स्पष्ट संकल्प।',
    },
  ],
  'bhagavadgita:6:5': [
    {
      targetScriptureId: 'katha',
      targetScriptureTitle: 'Katha Upanishad',
      targetChapter: 3,
      targetVerse: 3,
      targetReference: 'Katha Upanishad 3.3',
      type: 'parallel',
      sanskrit: 'आत्मानं रथिनं विद्धि शरीरं रथमेव तु । बुद्धिं तु सारथिं विद्धि मनः प्रग्रहमेव च ॥',
      translation: 'Know the Atman as the rider in the chariot, the body as the chariot, the intellect as the charioteer, and the mind as the reins.',
      reason: 'The Chariot Allegory: Provides the classical psychological map illustrating how the mind serves as the vehicle’s steering reins.',
      reasonHi: 'रथ रूपक: मन को लगाम और बुद्धि को सारथी बताकर आत्म-नियंत्रण का मनोवैज्ञानिक नक्शा प्रस्तुत करता है।',
    },
    {
      targetScriptureId: 'amritabindu',
      targetScriptureTitle: 'Amritabindu Upanishad',
      targetChapter: 1,
      targetVerse: 2,
      targetReference: 'Amritabindu Upanishad 2',
      type: 'cross_scripture',
      sanskrit: 'मन एव मनुष्याणां कारणं बन्धमोक्षयोः । बन्धाय विषयासक्तं मुक्तं निर्विषयं स्मृतम् ॥',
      translation: 'The mind alone is the cause of both bondage and liberation for human beings. Attached to sense-objects it binds, freed from them it liberates.',
      reason: 'Vedic psychology axiom: Confirms the core thesis of BG 6.5 that one’s own mind is the determining factor between suffering and freedom.',
      reasonHi: 'वैदिक मानसशास्त्र: मन ही मनुष्य के बन्धन और मोक्ष का मूल कारण है।',
    },
    {
      targetScriptureId: 'bhagavadgita',
      targetScriptureTitle: 'Bhagavad Gita',
      targetChapter: 6,
      targetVerse: 6,
      targetReference: 'BG 6.6',
      type: 'supporting',
      sanskrit: 'बन्धुरात्मात्मनस्तस्य येनात्मैवात्मना जितः । अनात्मनस्तु शत्रुत्वे वर्तेतात्मैव शत्रुवत् ॥',
      translation: 'The mind is a friend to one who has conquered it by oneself; but for one who has not conquered it, the mind remains hostile like an enemy.',
      reason: 'Psychological completion: Directly explains under what condition the mind functions as a friend versus a foe.',
      reasonHi: 'प्रत्यक्ष व्याख्या: स्पष्ट करता है कि अनियंत्रित मन किस प्रकार शत्रु और अनुशासित मन मित्र बन जाता है।',
    },
  ],
  'bhagavadgita:6:34': [
    {
      targetScriptureId: 'katha',
      targetScriptureTitle: 'Katha Upanishad',
      targetChapter: 3,
      targetVerse: 6,
      targetReference: 'Katha Upanishad 3.6',
      type: 'parallel',
      sanskrit: 'यस्त्वविज्ञानवान्भवत्ययुक्तेन मनसा सदा । तस्येन्द्रियाण्यवश्यानि दुष्टाश्वा इव सारथेः ॥',
      translation: 'He who is devoid of wisdom, with mind ever uncollected—his senses are unruly like the vicious horses of a charioteer.',
      reason: 'Parallel description of the restless, turbulent mind as an unbroken stallion.',
      reasonHi: 'कठोपनिषद् समानांतर: अनियंत्रित मन की उपमा दुष्ट घोड़ों से देकर चंचलता का स्वरूप स्पष्ट किया है।',
    },
    {
      targetScriptureId: 'bhagavadgita',
      targetScriptureTitle: 'Bhagavad Gita',
      targetChapter: 6,
      targetVerse: 35,
      targetReference: 'BG 6.35',
      type: 'supporting',
      sanskrit: 'असंशयं महाबाहो मनो दुर्निग्रहं चलम् । अभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते ॥',
      translation: 'Undoubtedly, O mighty-armed Arjuna, the mind is difficult to curb and restless. But by practice (Abhyasa) and dispassion (Vairagya), it is brought under control.',
      reason: 'The Twin Remedy: Sri Krishna answers Arjuna’s despair in 6.34 with the timeless two-fold discipline of Abhyasa and Vairagya.',
      reasonHi: 'समाधान सूत्र: अभ्यास और वैराग्य द्वारा चंचल मन को वश में करने का अचूक उपाय।',
    },
  ],
  'bhagavadgita:7:7': [
    {
      targetScriptureId: 'shvetashvatara',
      targetScriptureTitle: 'Shvetashvatara Upanishad',
      targetChapter: 3,
      targetVerse: 9,
      targetReference: 'Shvetashvatara Upanishad 3.9',
      type: 'parallel',
      sanskrit: 'यस्मात्परं नापरमस्ति किञ्चिद्यस्मान्नाणीयो न ज्यायोऽस्ति कश्चित् । वृक्ष इव स्तब्धो दिवि तिष्ठत्येकस्तेनेदं पूर्णं पुरुषेण सर्वम् ॥',
      translation: 'There is nothing higher than Him, nothing smaller or greater than Him. Rooted like a tree in heaven, that One Person fills this whole universe.',
      reason: 'Vedic parallel to the pearl-string metaphor: Confirms the singular Supreme Reality from which all manifestation hangs.',
      reasonHi: 'श्रुति प्रमाण: उस परम पुरुष से परे कुछ भी नहीं है, वही समस्त विश्व को व्याप्त किए हुए है।',
    },
  ],
  'bhagavadgita:9:22': [
    {
      targetScriptureId: 'bhagavadgita',
      targetScriptureTitle: 'Bhagavad Gita',
      targetChapter: 12,
      targetVerse: 6,
      targetReference: 'BG 12.6',
      type: 'supporting',
      sanskrit: 'ये तु सर्वाणि कर्माणि मयि संन्यस्य मत्पराः । अनन्येनैव योगेन मां ध्यायन्त उपासते ॥',
      translation: 'Those who surrender all actions to Me, regarding Me as supreme, and worship Me with unswerving yoga of devotion...',
      reason: 'Path of Ananya Bhakti: Reasserts the condition of total, undivided mindfulness that brings divine providence.',
      reasonHi: 'अनन्य भक्ति का मार्ग: समस्त कर्मों का समर्पण कर ईश्वर-परायण होने की साधना।',
    },
  ],
  'bhagavadgita:13:13': [
    {
      targetScriptureId: 'shvetashvatara',
      targetScriptureTitle: 'Shvetashvatara Upanishad',
      targetChapter: 3,
      targetVerse: 16,
      targetReference: 'Shvetashvatara Upanishad 3.16',
      type: 'parallel',
      sanskrit: 'सर्वतः पाणिपादं तत्सर्वतोऽक्षिशिरोमुखम् । सर्वतः श्रुतिमल्लोके सर्वमावृत्य तिष्ठति ॥',
      translation: 'With hands and feet everywhere, with eyes, heads, and faces on all sides, with ears in all worlds—It stands enveloping all that exists.',
      reason: 'Verbatim Vedic Mantra: This verse appears verbatim in both the Gita and the Shvetashvatara Upanishad, depicting the omniscient cosmic witness.',
      reasonHi: 'यथावत वैदिक मंत्र: गीता और श्वेताश्वतरोपनिषद् दोनों में यह मंत्र शब्दशः समान है।',
    },
  ],
  'bhagavadgita:15:1': [
    {
      targetScriptureId: 'katha',
      targetScriptureTitle: 'Katha Upanishad',
      targetChapter: 6,
      targetVerse: 1,
      targetReference: 'Katha Upanishad 6.1',
      type: 'parallel',
      sanskrit: 'ऊर्ध्वमूलोऽवाक्शाख एषोऽश्वत्थः सनातनः । तदेव शुक्रं तद्ब्रह्म तदेवामृतमुच्यते ॥',
      translation: 'This eternal Ashvattha tree has its roots above and branches below. That alone is the pure, that is Brahman, that alone is called immortal.',
      reason: 'Verbatim Cosmic Tree Symbolism: Both the Gita and Katha Upanishad use the inverted cosmic Ashvattha tree to depict the manifested universe originating from the supreme root above.',
      reasonHi: 'अश्वत्थ वृक्ष रूपक: संसार को ऊपर मूल वाले और नीचे शाखाओं वाले अश्वत्थ वृक्ष के रूप में वर्णित करने का वैदिक मूल।',
    },
    {
      targetScriptureId: 'bhagavadgita',
      targetScriptureTitle: 'Bhagavad Gita',
      targetChapter: 15,
      targetVerse: 3,
      targetReference: 'BG 15.3',
      type: 'supporting',
      sanskrit: 'न रूपमस्येह तथोपलभ्यते नान्तो न चादिर्न च संप्रतिष्ठा । अश्वत्थमेनं सुविरूढमूलमसङ्गशस्त्रेण दृढेन छित्त्वा ॥',
      translation: 'Its form is not perceived here as such, neither its end, nor origin, nor foundation. Having felled this deep-rooted Ashvattha with the strong weapon of detachment...',
      reason: 'Practical application: Instructs how to cut down worldly entanglement using the axe of non-attachment (Asanga-shastra).',
      reasonHi: 'साधना सूत्र: असङ्ग-शस्त्र (वैराग्य) द्वारा संसार-वृक्ष के बन्धन को काटने का निर्देश।',
    },
  ],
  'bhagavadgita:18:66': [
    {
      targetScriptureId: 'brihadaranyaka',
      targetScriptureTitle: 'Brihadaranyaka Upanishad',
      targetChapter: 25,
      targetVerse: '4.4.22',
      targetReference: 'Brihadaranyaka 4.4.22',
      type: 'cross_scripture',
      sanskrit: 'स वा एष महानज आत्मा योऽयं विज्ञानमयः प्राणेषु य एषोऽन्तर्हृदय आकाशस्तस्मिञ्छेते सर्वस्य वशी सर्वस्येशानः सर्वस्याधिपतिः स न साधुना कर्मणा भूयान्नो एवासाधुना कनीयानेष सर्वेश्वर एष भूताधिपतिरेष भूतपाल एष सेतुर्विधरण एषां लोकानामसम्भेदाय । तमेतं वेदानुवचनेन ब्राह्मणा विविदिषन्ति यज्ञेन दानेन तपसाऽनाशकेनैतमेव विदित्वा मुनिर्भवत्य्विदित्वा मुनिस्भवति एतमेव प्रव्राजिनो लोकमिच्छन्तः प्रव्रजन्त्येतद्ध स्म वै तत्पूर्वे विद्वाँसः प्रजां न कामयन्ते किं प्रजया करिष्यामो येषां नोऽयमात्माऽयं लोक इति । ते ह स्म पुत्रैषणायाश्च वित्तैषणायाश्च लोकैषणायाश्च व्युत्थायाथ भिक्षाचर्यं चरन्ति या ह्येव पुत्रैषणा सा वित्तैषणा या वित्तैषणा सा लोकैषणोभे ह्येते एषणे एव भवतः । स एष नेति नेत्यात्माऽगृह्यो न हि गृह्यते ऽशीर्यो न हि शीर्यतेऽसङ्गो न हि सज्यतेऽसितो न व्यथते न रिष्यत्येतमु हैवैते न तरत इत्यतः पापमकरवमित्यतः कल्याणमकरवमित्युभे उ हैवैष एते तरति नैनं कृताकृते तपतः',
      translation: 'That great, unborn Self is who resides in the intellect among the vital breaths. In the space within the heart, He rests as the controller of all, the Lord of all, the ruler of all.',
      reason: 'Supreme sanctuary: Explains who the ultimate refuge is when all relative dharmas and identities are surrendered.',
      reasonHi: 'परम शरण की व्याख्या: सर्वधर्मान्परित्यज्य में जिस परम तत्व की शरण की बात कही गई है, उसका उपनिषद् स्वरूप।',
    },
    {
      targetScriptureId: 'bhagavadgita',
      targetScriptureTitle: 'Bhagavad Gita',
      targetChapter: 9,
      targetVerse: 34,
      targetReference: 'BG 9.34',
      type: 'supporting',
      sanskrit: 'मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु । मामेवैष्यसि युक्त्वैवमात्मानं मत्परायणः ॥',
      translation: 'Fix your mind on Me, be devoted to Me, sacrifice to Me, bow to Me. Having disciplined your self thus and regarding Me as the supreme goal, you shall come to Me.',
      reason: 'Preparatory alignment: Outlines the emotional and intellectual surrender that matures into the absolute refuge of 18.66.',
      reasonHi: 'शरणागति का पूर्व-अभ्यास: 18.66 की पूर्ण शरणागति के लिए मन और बुद्धि का समर्पण मार्ग।',
    },
  ],
};

function getNodeDedupeKey(node: {
  type: RelationshipType;
  scriptureId?: string;
  chapterId?: number;
  verseId?: string | number;
  conceptId?: string;
  href?: string;
  reference?: string;
}): string {
  if (node.type === 'concept_connection' && node.conceptId) {
    return `concept:${node.conceptId}`;
  }
  if (node.scriptureId && node.chapterId != null && node.verseId != null) {
    return `verse:${node.scriptureId}:${node.chapterId}:${node.verseId}`;
  }
  if (node.href && node.href !== '#' && !node.href.startsWith('http')) {
    return `href:${node.href.toLowerCase().replace(/\/$/, '')}`;
  }
  return `ref:${(node.reference || '').toLowerCase().trim()}`;
}

/**
 * Builds a verse graph from reviewed links only: canonical echoes, study-content
 * connections, concept-verse listings, and cross-references stored with those concepts.
 * A verse with none of those stays empty. Adjacent verses are not called teachings.
 */
export function buildVerseGraphData(
  scriptureId: string,
  chapterId: number,
  verseId: string | number,
  currentVerse: {
    number: string | number;
    sanskrit?: string;
    transliteration?: string;
    hindi?: string;
    translation?: string;
    explanation?: string;
  },
): VerseGraphData {
  const meta = scriptureTitle(scriptureId);
  const vKey = verseKey(scriptureId, chapterId, verseId);
  const ref = `${meta?.title || scriptureId} ${chapterId}.${verseId}`;
  const centralId = `verse:${scriptureId}:${chapterId}:${verseId}`;

  const nodes: VerseGraphNode[] = [];
  const edges: VerseGraphEdge[] = [];

  // Track deduplication keys; prevent self-reference
  const seenDedupeKeys = new Set<string>([`verse:${scriptureId}:${chapterId}:${verseId}`]);

  function addNode(node: VerseGraphNode, edgeLabel: string, edgeLabelHi: string) {
    const key = getNodeDedupeKey(node);
    if (seenDedupeKeys.has(key)) {
      return false;
    }
    seenDedupeKeys.add(key);
    nodes.push(node);
    edges.push({
      source: centralId,
      target: node.id,
      type: node.type,
      label: edgeLabel,
      labelHi: edgeLabelHi,
    });
    return true;
  }

  // ── 1. Canonical Cross-Scripture Echoes (Gita ↔ Upanishads ↔ Vedas ↔ Epics) ───
  const canonicalEchoes = CANONICAL_CROSS_ECHOS[vKey] || [];
  canonicalEchoes.forEach((echo) => {
    const targetMeta = scriptureTitle(echo.targetScriptureId);
    const href = readHref(echo.targetScriptureId, echo.targetChapter, echo.targetVerse);
    const nodeId = `echo:${echo.targetScriptureId}:${echo.targetChapter}:${echo.targetVerse}`;

    addNode(
      {
        id: nodeId,
        label: `${echo.targetScriptureTitle} ${echo.targetReference}`,
        labelHi: echo.reasonHi,
        reference: echo.targetReference,
        scriptureId: echo.targetScriptureId,
        scriptureTitle: echo.targetScriptureTitle,
        scriptureTitleSanskrit: targetMeta?.titleSanskrit,
        chapterId: echo.targetChapter,
        verseId: echo.targetVerse,
        type: echo.type,
        sanskrit: echo.sanskrit,
        translation: echo.translation,
        href,
        relationshipReason: echo.reason,
        isExternalScripture: echo.targetScriptureId !== scriptureId,
      },
      RELATIONSHIP_META[echo.type].label,
      RELATIONSHIP_META[echo.type].labelHi,
    );
  });

  // ── 2. Editorial Reviewed Connections (from study-content.ts) ────────────
  const studyConnections = CONNECTIONS[vKey] || [];
  studyConnections.forEach((conn) => {
    const connScripture = conn.scriptureTitle.toLowerCase().replace(/\s+/g, '');
    const connScriptureId = connScripture.includes('gita') ? 'bhagavadgita' : scriptureId;

    // Parse chapter and verse if reference is of format "2.48"
    const parsedRef = conn.reference.match(/^(\d+)\.(\d+)$/);
    const connChapter = parsedRef ? parseInt(parsedRef[1], 10) : undefined;
    const connVerse = parsedRef ? parsedRef[2] : undefined;

    const href = connChapter && connVerse
      ? readHref(connScriptureId, connChapter, connVerse)
      : conn.href || '#';

    const relType: RelationshipType =
      conn.kind === 'different-emphasis'
        ? 'contrasting'
        : conn.kind === 'similar'
        ? 'parallel'
        : href && href.includes('scripture') && !href.includes(scriptureId)
        ? 'cross_scripture'
        : 'supporting';

    const nodeId = `study:${connScriptureId}:${conn.reference}`;

    addNode(
      {
        id: nodeId,
        label: `${conn.scriptureTitle} ${conn.reference}`,
        reference: conn.reference,
        scriptureId: connScriptureId,
        scriptureTitle: conn.scriptureTitle,
        chapterId: connChapter,
        verseId: connVerse,
        type: relType,
        translation: conn.summary,
        href,
        relationshipReason: conn.reason,
        isExternalScripture: Boolean(href && !href.includes(scriptureId)),
      },
      CONNECTION_LABEL[conn.kind] || RELATIONSHIP_META[relType].label,
      RELATIONSHIP_META[relType].labelHi,
    );
  });

  // ── 3. Concept Integration Connections ──────────────────────────────────
  const integrations = getVerseIntegrations(scriptureId, chapterId, verseId, {
    sanskrit: currentVerse.sanskrit,
    translation: currentVerse.translation,
    explanation: currentVerse.explanation,
  });

  // Concept pages only when this verse is listed on that concept, and the concept has a page.
  const conceptPageIds = new Set([
    'dharma', 'karma', 'atman', 'brahman', 'moksha', 'maya', 'bhakti', 'yoga', 'ahimsa', 'yajna', 'samsara', 'vairagya',
  ]);
  integrations.concepts.filter((c) => c.matchType === 'direct' && conceptPageIds.has(c.id)).forEach((c) => {
    const conceptNodeId = `concept:${c.id}`;
    addNode(
      {
        id: conceptNodeId,
        label: c.label,
        labelHi: c.sanskrit,
        reference: `Concept: ${c.label} (${c.sanskrit})`,
        scriptureId,
        scriptureTitle: meta?.title || scriptureId,
        type: 'concept_connection',
        conceptId: c.id,
        category: c.category,
        translation: c.shortDesc,
        href: `/concepts/${c.id}`,
        relationshipReason: `Listed with the ${c.label} concept in this library.`,
        isExternalScripture: false,
      },
      'Philosophical Anchor',
      'दार्शनिक आधार',
    );
  });

  // Connect cross-scriptural parallel verses from concepts
  integrations.crossReferences.slice(0, 2).forEach((xref) => {
    if (xref.scriptureId !== scriptureId) {
      const targetMeta = scriptureTitle(xref.scriptureId);
      const xrefId = `xref:${xref.scriptureId}:${xref.chapterId}:${xref.verseId}`;
      addNode(
        {
          id: xrefId,
          label: `${targetMeta?.title || xref.scriptureId} ${xref.reference}`,
          reference: xref.reference,
          scriptureId: xref.scriptureId,
          scriptureTitle: targetMeta?.title || xref.scriptureId,
          scriptureTitleSanskrit: targetMeta?.titleSanskrit,
          chapterId: xref.chapterId,
          verseId: xref.verseId,
          type: 'cross_scripture',
          sanskrit: xref.sanskrit,
          translation: xref.translation,
          href: xref.href,
          relationshipReason: `Listed beside ${xref.conceptLabel} in this library. The link does not say the passages teach the same thing.`,
          isExternalScripture: true,
        },
        'Parallel Scriptural Anchor',
        'पार-ग्रंथ समान सूत्र',
      );
    }
  });

  // Calculate statistics
  const stats = {
    totalConnections: nodes.length,
    crossScriptureCount: nodes.filter((n) => n.type === 'cross_scripture' || n.isExternalScripture).length,
    parallelCount: nodes.filter((n) => n.type === 'parallel').length,
    supportingCount: nodes.filter((n) => n.type === 'supporting').length,
    contrastingCount: nodes.filter((n) => n.type === 'contrasting').length,
    conceptCount: nodes.filter((n) => n.type === 'concept_connection').length,
  };

  return {
    centralNode: {
      id: centralId,
      label: ref,
      reference: ref,
      scriptureId,
      scriptureTitle: meta?.title || scriptureId,
      scriptureTitleSanskrit: meta?.titleSanskrit,
      chapterId,
      verseId,
      sanskrit: currentVerse.sanskrit,
      translation: currentVerse.translation,
    },
    nodes,
    edges,
    stats,
  };
}
