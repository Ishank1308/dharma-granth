/**
 * Chapter orientation: an editorial introduction shown before a chapter's
 * verses. It is NOT scripture. Every entry carries a review state; only
 * chapters listed here get the narrative panel, all others get the
 * factual panel (name, verse count, reading time) and nothing invented.
 */

export type ReviewState = 'draft' | 'editorial-review' | 'approved';

export interface OrientationStep {
  label: string;
  labelHi: string;
  text: string;
}

export interface ChapterMapNode {
  id: string;
  stageName: string;
  stageNameHi: string;
  verseRange: string;
  startVerse: number;
  endVerse: number;
  coreQuestion: string;
  concepts: string[];
  keyVerses: number[];
  summary: string;
  transitionNote?: string;
}

export interface ChapterOrientation {
  scriptureId: string;
  chapter: number;
  nameEn: string;
  nameHi: string;
  speakers: string;
  listeners: string;
  speakersList?: string[];
  listenersList?: string[];
  narrativeContext?: string;
  centralConflict?: string;
  mainQuestions?: string[];
  centralQuestion: string;
  concepts: string[];
  importantVerses: Array<{ verse: number; note: string }>;
  background: string;
  /** Concepts worth knowing before reading, by name. */
  prerequisiteConcepts: string[];
  structure: string[];
  /** Before this chapter, the problem, the teaching, the turning point, what follows. */
  sequence: [OrientationStep, OrientationStep, OrientationStep, OrientationStep, OrientationStep];
  /** A plain ordered flow of the chapter; each step links to the verse where it is best seen. */
  flow?: Array<{ label: string; labelHi: string; verse: number; range: string }>;
  mapNodes?: ChapterMapNode[];
  chapterConclusion?: string;
  editorialReviewer?: string;
  reviewDate?: string;
  review: ReviewState;
}

const stepLabels = [
  { label: 'Before this chapter', labelHi: 'इस अध्याय से पहले' },
  { label: 'The central problem', labelHi: 'केंद्रीय समस्या' },
  { label: 'The main teaching', labelHi: 'मुख्य शिक्षा' },
  { label: 'Important turning point', labelHi: 'महत्त्वपूर्ण मोड़' },
  { label: 'What follows next', labelHi: 'आगे क्या' },
];

function seq(texts: [string, string, string, string, string]): ChapterOrientation['sequence'] {
  return texts.map((text, i) => ({ ...stepLabels[i], text })) as ChapterOrientation['sequence'];
}

export const chapterOrientations: ChapterOrientation[] = [
  {
    scriptureId: 'bhagavadgita',
    chapter: 1,
    nameEn: "Arjuna's Despair",
    nameHi: 'अर्जुनविषादयोग',
    speakers: 'Sanjaya narrates; Dhritarashtra, Duryodhana and Arjuna also speak.',
    listeners: 'Dhritarashtra hears Sanjaya. Krishna, Arjuna’s charioteer, hears Arjuna.',
    speakersList: ['धृतराष्ट्र (Dhritarashtra)', 'संजय (Sanjaya)', 'दुर्योधन (Duryodhana)', 'अर्जुन (Arjuna)'],
    listenersList: ['संजय (Sanjaya)', 'द्रोणाचार्य (Dronacharya)', 'श्रीकृष्ण (Krishna)', 'धृतराष्ट्र (Dhritarashtra)'],
    narrativeContext: 'On the sacred field of Kurukshetra, the forces of the Pandavas and Kauravas stand assembled for a devastating dynastic war. The blind king Dhritarashtra asks Sanjaya for an account of the confrontation.',
    centralConflict: 'The clash between external duty (Kshatriya warrior duty to resist injustice) and internal affection/compassion for elders, family teachers, and kin.',
    mainQuestions: [
      'Can righteousness justify the slaughter of one\'s own family and preceptors?',
      'What social and moral ruin falls upon communities when family structure disintegrates in civil war?',
      'Is victory worth the grief and guilt of destroying one\'s own people?'
    ],
    centralQuestion: 'Can Arjuna fight a war against his own teachers and relatives, and what would it cost him?',
    concepts: ['Dharma', 'Kula-dharma (family duty)', 'Moha (confusion)', 'Vishaada (existential despair)'],
    importantVerses: [
      { verse: 1, note: 'Dhritarashtra asks what the armies gathered at Kurukshetra are doing.' },
      { verse: 21, note: 'Arjuna asks Krishna to station his chariot between the two armies.' },
      { verse: 28, note: 'Arjuna sees his relatives and his limbs give way in overwhelming grief.' },
      { verse: 47, note: 'Arjuna casts away his bow and arrows and sits down on the chariot seat.' }
    ],
    background: 'None needed. A short sense of the Mahabharata’s conflict over a kingdom helps.',
    prerequisiteConcepts: ['Dharma'],
    structure: [
      'The armies and warrior conches (1–19)',
      'Arjuna inspects both battle lines (20–27)',
      'Arjuna’s breakdown and grief (28–37)',
      'Arguments against the destruction of society (38–46)',
      'Laying down the bow (47)'
    ],
    sequence: seq([
      'The Mahabharata’s dispute between two branches of one family has led to war at Kurukshetra.',
      'Looking across both armies, Arjuna sees teachers, elders and relatives. He doubts that victory could be worth the loss.',
      'There is no teaching yet. The chapter sets out the human problem that the rest of the Gita answers.',
      'Arjuna puts down his bow and sits in the chariot, overcome by grief.',
      'In chapter 2, Krishna begins to speak.'
    ]),
    chapterConclusion: 'The chapter closes not in victory or philosophical doctrine, but in complete vulnerability: an undefeated hero immobilized by the agony of ethical collision.',
    mapNodes: [
      {
        id: 'bg1-stage1',
        stageName: 'Assembly & Royal Inquiry',
        stageNameHi: 'युद्धभूमि का दृश्य व शंखनाद',
        verseRange: '1–20',
        startVerse: 1,
        endVerse: 20,
        coreQuestion: 'How do the opposing armies array themselves at Kurukshetra?',
        concepts: ['Dharma-kshetra', 'Bhishma', 'Drona'],
        keyVerses: [1, 14, 19],
        summary: 'Dhritarashtra inquires about the battle. Duryodhana catalogs the commanders, and fierce conch blasts shake heaven and earth.',
        transitionNote: 'Arjuna asks Krishna to drive his chariot into the open space between the armies.'
      },
      {
        id: 'bg1-stage2',
        stageName: 'Inspection of the Battle Lines',
        stageNameHi: 'सेना-निरीक्षण',
        verseRange: '21–27',
        startVerse: 21,
        endVerse: 27,
        coreQuestion: 'Who actually stands in the opposing ranks?',
        concepts: ['Bandhu (Kinship)', 'Acharya (Teachers)'],
        keyVerses: [21, 26, 27],
        summary: 'Stationed between the hosts, Arjuna sees fathers, grandfathers, teachers, uncles, brothers, and lifelong companions ready to kill each other.',
        transitionNote: 'The visceral reality of kinship shatters Arjuna’s resolve.'
      },
      {
        id: 'bg1-stage3',
        stageName: 'The Paralysis of Grief',
        stageNameHi: 'विषाद व देह-कम्प',
        verseRange: '28–37',
        startVerse: 28,
        endVerse: 37,
        coreQuestion: 'What good is sovereign power if those for whom we desire it lie dead?',
        concepts: ['Kripa (Pity)', 'Vishaada (Grief)'],
        keyVerses: [28, 29, 35],
        summary: 'Arjuna’s mouth goes dry, his body trembles, his Gandiva bow slips from his grasp, and his mind spins in confusion.',
        transitionNote: 'Arjuna attempts to construct an intellectual defense for abstaining from combat.'
      },
      {
        id: 'bg1-stage4',
        stageName: 'Collapse into Inaction',
        stageNameHi: 'धनुष-त्याग व आत्म-समर्पण',
        verseRange: '38–47',
        startVerse: 38,
        endVerse: 47,
        coreQuestion: 'Is it not better to be slain unresisting than to participate in societal annihilation?',
        concepts: ['Kula-kshaya (Destruction of the line)', 'Svadharma collision'],
        keyVerses: [40, 45, 47],
        summary: 'Arjuna warns of civil chaos, lays down his bow and arrows, and sinks into the chariot weeping, refusing to fight.',
        transitionNote: 'The human dilemma is established. Krishna will open his dialogue in Chapter 2.'
      }
    ],
    editorialReviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-09-15',
    review: 'approved',
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 2,
    nameEn: 'The Yoga of Knowledge (Sankhya Yoga)',
    nameHi: 'सांख्ययोग',
    speakers: 'Sanjaya introduces the chapter; Arjuna asks; Krishna teaches.',
    listeners: 'Arjuna listens as Krishna’s student. Dhritarashtra hears the whole account through Sanjaya.',
    speakersList: ['संजय (Sanjaya)', 'अर्जुन (Arjuna)', 'श्रीभगवान् (Krishna)'],
    listenersList: ['धृतराष्ट्र (Dhritarashtra)', 'श्रीभगवान् (Krishna)', 'अर्जुन (Arjuna)'],
    narrativeContext: 'Krishna perceives Arjuna overwhelmed by tears and despondency. Refusing to flatter his paralysis, Krishna challenges him, accepts him as a formal disciple, and outlines the foundational wisdom of the entire Gita.',
    centralConflict: 'The illusion of mortality versus the eternal Self (Atman); and the paralyzing fear of consequences versus equanimous, dedicated action (Karma Yoga).',
    mainQuestions: [
      'Who is the true doer, and what in a human being is touched by death?',
      'How does one perform inevitable duties without accumulating guilt, anxiety, or karmic bondage?',
      'What are the observable marks and daily conduct of a person who has attained unshakable wisdom (Sthitaprajna)?'
    ],
    centralQuestion: 'How should one act when duty and grief pull in opposite directions?',
    concepts: ['Atman (the self)', 'Dharma', 'Karma Yoga', 'Sthitaprajna (steady wisdom)', 'Samatvam (equanimity)', 'Buddhi Yoga'],
    importantVerses: [
      { verse: 7, note: 'Arjuna asks Krishna to guide him as a student (शिष्यस्तेऽहं शाधि मां त्वां प्रपन्नम्).' },
      { verse: 11, note: 'The wise grieve neither for the living nor for the dead.' },
      { verse: 20, note: 'The Self is never born, nor does it ever die; weapons cut it not.' },
      { verse: 47, note: 'You have a right only to action, never to its fruits.' },
      { verse: 48, note: 'Perform action established in yoga, abandoning attachment: equanimity is yoga.' },
      { verse: 62, note: 'From dwelling on sensory objects, attachment is born; from attachment, desire; from desire, anger.' },
      { verse: 71, note: 'Attaining peace by relinquishing cravings, egoism, and the sense of "mine".' }
    ],
    background: 'Reading chapter 1 first is recommended.',
    prerequisiteConcepts: ['Atman', 'Dharma', 'Karma'],
    structure: [
      'Arjuna’s surrender and plea for discipleship (1–10)',
      'The imperishable nature of the Self (Sankhya) (11–30)',
      'The duty of action from the social standpoint (31–38)',
      'The wisdom of unattached action (Karma Yoga) (39–53)',
      'The qualities and tranquility of the steady sage (54–72)'
    ],
    sequence: seq([
      'Arjuna has put down his bow in grief (chapter 1).',
      'He asks Krishna for guidance, because he cannot see what is right.',
      'Krishna teaches about the lasting self, about acting without being bound to results, and about steady wisdom.',
      'Arjuna accepts Krishna as his teacher, and the instruction begins.',
      'Chapter 3 continues with Arjuna’s question about knowledge and action.'
    ]),
    flow: [
      { label: 'Arjuna’s conflict', labelHi: 'अर्जुन की दुविधा', verse: 7, range: '2.1 to 2.10' },
      { label: 'Teaching about the Self', labelHi: 'आत्मा का उपदेश', verse: 20, range: '2.11 to 2.30' },
      { label: 'Responsible action', labelHi: 'दायित्वपूर्ण कर्म', verse: 47, range: '2.31 to 2.47' },
      { label: 'Attachment to outcomes', labelHi: 'फल में आसक्ति', verse: 62, range: '2.62 to 2.63' },
      { label: 'Equanimity', labelHi: 'समत्व', verse: 48, range: '2.48' },
      { label: 'Disciplined intelligence', labelHi: 'स्थिरबुद्धि', verse: 54, range: '2.54 to 2.72' },
    ],
    chapterConclusion: 'Chapter 2 serves as the master blueprint of the entire Gita. It synthesizes intellectual discrimination (Sankhya), selfless dedication (Karma Yoga), and psychological stability (Sthitaprajna) into a single, cohesive way of living—revealing that inner peace directly empowers outer duty and universal welfare (Lokasamgraha).',
    mapNodes: [
      {
        id: 'bg2-stage1',
        stageName: 'Surrender & The Disciple\'s Plea',
        stageNameHi: 'शरणागति व शिष्य-भाव',
        verseRange: '1–10',
        startVerse: 1,
        endVerse: 10,
        coreQuestion: 'How does an overwhelmed mind transition from argument to receptivity?',
        concepts: ['Karpanya-dosha', 'Prapanna (Surrender)'],
        keyVerses: [7, 9],
        summary: 'Arjuna admits his judgment is clouded by weakness. He formally surrenders to Krishna as a disciple, pleading for instruction.',
        transitionNote: 'With the teacher-disciple relationship established, Krishna begins the philosophical exposition.'
      },
      {
        id: 'bg2-stage2',
        stageName: 'The Eternal Atman (Sankhya)',
        stageNameHi: 'आत्म-तत्त्व व अमरत्व',
        verseRange: '11–30',
        startVerse: 11,
        endVerse: 30,
        coreQuestion: 'What truly dies when a body falls in battle?',
        concepts: ['Atman', 'Nitya (Eternal)', 'Avinashi (Indestructible)'],
        keyVerses: [11, 20, 22],
        summary: 'Krishna clarifies the absolute distinction between the changing physical garment (deha) and the unchanging, eternal witness consciousness (dehi).',
        transitionNote: 'Having addressed the metaphysical nature of reality, Krishna turns to practical duty.'
      },
      {
        id: 'bg2-stage3',
        stageName: 'Svadharma & Social Responsibility',
        stageNameHi: 'स्वधर्म व कर्तव्य-बोध',
        verseRange: '31–38',
        startVerse: 31,
        endVerse: 38,
        coreQuestion: 'Can one escape the moral consequences of abandoning one’s legitimate station?',
        concepts: ['Svadharma', 'Kirti', 'Papa'],
        keyVerses: [31, 33, 38],
        summary: 'Krishna demonstrates that running away from unavoidable conflict brings ignominy, social degradation, and failure of integrity.',
        transitionNote: 'Krishna now introduces the revolutionary doctrine of Karma Yoga.'
      },
      {
        id: 'bg2-stage4',
        stageName: 'The Discipline of Karma Yoga',
        stageNameHi: 'कर्मयोग व समत्व-बुद्धि',
        verseRange: '39–53',
        startVerse: 39,
        endVerse: 53,
        coreQuestion: 'How can we work wholeheartedly without being destroyed by result anxiety?',
        concepts: ['Karma Yoga', 'Samatvam', 'Vyavasayatmika Buddhi'],
        keyVerses: [47, 48, 50],
        summary: 'You have mastery over your effort, never over outcomes. Equanimity in success and failure is yoga, and skill in action is yoga.',
        transitionNote: 'Arjuna asks how such a steady, equanimous person lives in practice.'
      },
      {
        id: 'bg2-stage5',
        stageName: 'The Sage of Steady Wisdom (Sthitaprajna)',
        stageNameHi: 'स्थितप्रज्ञ लक्षण व ब्राह्मी स्थिति',
        verseRange: '54–72',
        startVerse: 54,
        endVerse: 72,
        coreQuestion: 'How does an enlightened person sit, speak, and navigate sensory temptation?',
        concepts: ['Sthitaprajna', 'Indriya-samyama', 'Brahmi-sthiti', 'Shanti'],
        keyVerses: [55, 62, 63, 71],
        summary: 'The sage has quieted all selfish cravings, masters the sensory faculties like a tortoise withdrawing its limbs, and abides in oceanic peace.',
        transitionNote: 'Arjuna is left wondering why, if steady contemplation is supreme, he must engage in violent battle—opening Chapter 3.'
      }
    ],
    editorialReviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-09-20',
    review: 'approved',
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 3,
    nameEn: 'The Yoga of Action (Karma Yoga)',
    nameHi: 'कर्मयोग',
    speakers: 'Arjuna questions; Krishna instructs. Sanjaya narrates to Dhritarashtra.',
    listeners: 'Arjuna listens as Krishna’s student. Dhritarashtra hears the account through Sanjaya.',
    speakersList: ['अर्जुन (Arjuna)', 'श्रीभगवान् (Krishna)'],
    listenersList: ['श्रीभगवान् (Krishna)', 'अर्जुन (Arjuna)'],
    narrativeContext: 'Perplexed by Krishna’s praise of quiet wisdom in Chapter 2, Arjuna asks why he should be urged to fight. Krishna resolves the apparent contradiction between wisdom and work by revealing the cosmic interdependence of action and sacrifice.',
    centralConflict: 'The tension between monastic escapism (renouncing action) and dedicated, selfless action in the world (Karma Yoga).',
    mainQuestions: [
      'If wisdom is superior to action, why does Krishna urge Arjuna into a terrible conflict?',
      'Can any living being ever truly achieve total cessation of action?',
      'What invisible force drags a well-meaning person into destructive deeds as if against their will?'
    ],
    centralQuestion: 'How can a person act vigorously in the world without accumulating attachment and psychological bondage?',
    concepts: ['Karma', 'Dharma', 'Yajna (Sacrifice/Offering)', 'Lokasangraha (World maintenance)', 'Kama (Desire)'],
    importantVerses: [
      { verse: 9, note: 'Action performed as an offering (Yajna) frees rather than binds.' },
      { verse: 19, note: 'Constantly perform obligatory work without attachment to attain the highest.' },
      { verse: 20, note: 'Janaka and ancient seers attained perfection through action alone; act for the welfare and cohesion of the world (Lokasamgraha).' },
      { verse: 21, note: 'Whatever an exemplary leader does, the world follows.' },
      { verse: 25, note: 'As the unenlightened act with selfish attachment, the wise should act without attachment, devoted to universal welfare (Lokasamgraha).' },
      { verse: 30, note: 'Surrendering all actions to the Divine, free from longing and egoism.' },
      { verse: 35, note: 'Better is one’s own duty (Svadharma) imperfectly done than another’s done well.' },
      { verse: 37, note: 'It is desire and anger, born of Rajas, that are the all-devouring enemies.' }
    ],
    background: 'Reading chapter 2 first is recommended, especially verse 2.47.',
    prerequisiteConcepts: ['Karma', 'Dharma', 'Yajna'],
    structure: [
      'The impossibility of total physical inaction (1–8)',
      'The cosmic wheel of Yajna and mutual support (9–16)',
      'The enlightened person and duty of exemplary leadership (17–26)',
      'Prakriti’s agency and adherence to Svadharma (27–35)',
      'The root of wrongdoing and conquering inner desire (36–43)'
    ],
    sequence: seq([
      'Chapter 2 spoke about the eternal Self and acting with equanimity.',
      'Arjuna asks why, if knowledge is higher, he should engage in this terrible battle.',
      'Krishna explains that no embodied being can abandon action; work done as an unselfish offering (Yajna) produces no bondage.',
      'Arjuna asks what compels human beings toward moral transgression, and Krishna reveals selfish desire and anger.',
      'Chapter 4 continues with the ancient lineage of this wisdom and the sacred fire of knowledge.'
    ]),
    chapterConclusion: 'Chapter 3 establishes that liberation is achieved not by avoiding responsibility or escapism, but by sanctifying work through selfless intention and dedicated service for the welfare and moral order of humanity (Lokasamgraha), overcoming the instinctive drag of desire.',
    mapNodes: [
      {
        id: 'bg3-stage1',
        stageName: 'The Illusion of Inaction',
        stageNameHi: 'कर्म-संन्यास बनाम निष्काम कर्म',
        verseRange: '1–8',
        startVerse: 1,
        endVerse: 8,
        coreQuestion: 'Can mere physical abstention from work lead to inner freedom?',
        concepts: ['Mithyachara (Hypocrisy)', 'Karmendriya'],
        keyVerses: [1, 4, 8],
        summary: 'One who restrains the organs of action while dwelling mentally on sensory objects is a hypocrite. Honest, disciplined work is vastly superior to false renunciation.',
        transitionNote: 'Krishna explains the sacred framework that makes work purifying.'
      },
      {
        id: 'bg3-stage2',
        stageName: 'The Cosmic Wheel of Yajna',
        stageNameHi: 'यज्ञ-चक्र व पारस्परिक पोषण',
        verseRange: '9–16',
        startVerse: 9,
        endVerse: 16,
        coreQuestion: 'How does selfless contribution sustain universal order?',
        concepts: ['Yajna', 'Chakra-pravartana'],
        keyVerses: [9, 13, 16],
        summary: 'Creation is woven as a cycle of mutual nourishment. Those who consume without giving back live in vain, whereas food shared after sacrifice is sanctified.',
        transitionNote: 'Krishna describes how the fully realized sage engages with this cosmic order.'
      },
      {
        id: 'bg3-stage3',
        stageName: 'Lokasangraha: Inspiring the World',
        stageNameHi: 'लोकसंग्रह व श्रेष्ठ जन का आदर्श',
        verseRange: '17–26',
        startVerse: 17,
        endVerse: 26,
        coreQuestion: 'Why must the enlightened continue to work if they have nothing to gain?',
        concepts: ['Lokasangraha', 'Janaka', 'Shreshtha (Exemplar)'],
        keyVerses: [19, 21, 25],
        summary: 'Even when personal ambition is entirely dissolved, the wise must continue to work diligently to prevent societal cynicism and chaos, setting a standard for all.',
        transitionNote: 'Krishna cautions against confounding the doer with the instrument.'
      },
      {
        id: 'bg3-stage4',
        stageName: 'Gunas of Nature & Authentic Duty',
        stageNameHi: 'प्रकृति के गुण व स्वधर्म',
        verseRange: '27–35',
        startVerse: 27,
        endVerse: 35,
        coreQuestion: 'Who actually performs actions, and why is authentic duty essential?',
        concepts: ['Prakriti-guna', 'Ahankara', 'Svadharma', 'Paradharma'],
        keyVerses: [27, 30, 35],
        summary: 'All actions are enacted by the energies of nature (Gunas), yet the deluded ego claims "I am the doer." One should embrace their authentic vocation (Svadharma) without fear.',
        transitionNote: 'Arjuna asks why people stray into destructive habits despite knowing better.'
      },
      {
        id: 'bg3-stage5',
        stageName: 'Conquering the Hidden Foe',
        stageNameHi: 'काम-क्रोध रूपी शत्रु का संहार',
        verseRange: '36–43',
        startVerse: 36,
        endVerse: 43,
        coreQuestion: 'Where does desire hide, and how can it be conquered?',
        concepts: ['Kama', 'Krodha', 'Buddhi', 'Atma-bodha'],
        keyVerses: [37, 41, 43],
        summary: 'Desire clouds discrimination as smoke covers fire. Lurking in the senses, mind, and intellect, it is conquered only when the intellect anchors in the transcendent Self.',
        transitionNote: 'Krishna will trace the timeless historical lineage of this supreme discipline in Chapter 4.'
      }
    ],
    editorialReviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-09-22',
    review: 'approved',
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 4,
    nameEn: 'The Yoga of Knowledge and Action',
    nameHi: 'ज्ञानकर्मसंन्यासयोग',
    speakers: 'Krishna reveals divine heritage; Arjuna queries chronological paradox; Krishna expounds.',
    listeners: 'Arjuna listens as Krishna’s student. Dhritarashtra hears through Sanjaya.',
    speakersList: ['श्रीभगवान् (Krishna)', 'अर्जुन (Arjuna)'],
    listenersList: ['अर्जुन (Arjuna)', 'श्रीभगवान् (Krishna)'],
    narrativeContext: 'Krishna discloses that this science of yoga was taught at the dawn of civilization to the sun god Vivasvan. When Arjuna asks how Krishna could have taught ancients of the remote past, Krishna unveils the mystery of divine incarnation and the transforming fire of wisdom.',
    centralConflict: 'The mystery of the infinite operating within finite time, and how the fire of understanding dissolves the binding residue of past actions.',
    mainQuestions: [
      'How can an eternal principle appear in human historical form across epochs?',
      'How does one recognize action in inaction and inaction in action?',
      'How does spiritual knowledge act as a fire that burns all karmic entanglements?'
    ],
    centralQuestion: 'What is the origin of this wisdom, and how does transcendent knowledge turn everyday actions into liberating offerings?',
    concepts: ['Jnana', 'Karma', 'Avatara (Divine manifestation)', 'Yajna (Sacrifice)', 'Shraddha (Receptive faith)'],
    importantVerses: [
      { verse: 7, note: 'Whenever righteousness declines and injustice rises, the Divine manifests.' },
      { verse: 8, note: 'For the protection of the good and destruction of evil, I appear age after age.' },
      { verse: 18, note: 'One who sees inaction in action and action in inaction is truly wise.' },
      { verse: 24, note: 'Brahman is the offering, the oblation, the fire, and the one who attains it.' },
      { verse: 34, note: 'Learn this through humble inquiry, reverence, and service to wise seers.' },
      { verse: 38, note: 'Truly, there is nothing in this world as purifying as wisdom.' }
    ],
    background: 'Chapters 2 and 3 provide the necessary foundation for understanding Karma Yoga.',
    prerequisiteConcepts: ['Jnana', 'Karma', 'Yajna'],
    structure: [
      'The ancient solar lineage and doctrine of divine incarnation (1–8)',
      'Transcending birth and action through spiritual insight (9–15)',
      'The subtle paradox of action in inaction (16–24)',
      'Various forms of dedicated practice (Yajna) (25–33)',
      'The supremacy and purifying power of wisdom (34–42)'
    ],
    sequence: seq([
      'Chapter 3 concluded by identifying selfish desire as the inner adversary to be conquered through spiritual awareness.',
      'Arjuna questions Krishna’s claim to have taught solar monarchs millennia ago.',
      'Krishna explains the phenomenon of divine incarnation and the nature of selfless action untouched by personal desire.',
      'Krishna demonstrates that all diverse sacrificial disciplines culminate in the supreme fire of knowledge (Jnana-Yajna).',
      'Chapter 5 opens with Arjuna asking whether ascetic renunciation or dedicated action is definitely superior.'
    ]),
    chapterConclusion: 'Chapter 4 elevates Karma Yoga from a moral rule to a cosmic realization: when illuminated by knowledge, every endeavor becomes an oblation into the infinite reality of Brahman.',
    mapNodes: [
      {
        id: 'bg4-stage1',
        stageName: 'The Timeless Lineage & Avatara',
        stageNameHi: 'परम्परा व अवतार-तत्त्व',
        verseRange: '1–8',
        startVerse: 1,
        endVerse: 8,
        coreQuestion: 'Why and when does the transcendent truth manifest in human history?',
        concepts: ['Parampara', 'Dharma-samsthapana', 'Avatara'],
        keyVerses: [1, 7, 8],
        summary: 'This yoga was taught to kings of old and lost over time. Whenever righteousness wanes and chaos erupts, the divine assumes form to re-establish moral equilibrium.',
        transitionNote: 'Krishna explains how understanding this truth liberates the seeker.'
      },
      {
        id: 'bg4-stage2',
        stageName: 'Action in Inaction Paradox',
        stageNameHi: 'कर्म में अकर्म व अकर्म में कर्म',
        verseRange: '9–24',
        startVerse: 9,
        endVerse: 24,
        coreQuestion: 'How can an active person remain spiritually untouched by their deeds?',
        concepts: ['Akarma', 'Brahmarpanam', 'Vigata-jvara'],
        keyVerses: [14, 18, 24],
        summary: 'One who recognizes that the Self is the unmoving witness sees inaction in action, and realizes that even outwardly sedentary contemplation involves internal mental movement.',
        transitionNote: 'Krishna categorizes the diverse spiritual practices through which seekers purify their minds.'
      },
      {
        id: 'bg4-stage3',
        stageName: 'The Spectra of Yajna',
        stageNameHi: 'यज्ञ के विविध स्वरूप',
        verseRange: '25–33',
        startVerse: 25,
        endVerse: 33,
        coreQuestion: 'In what practical ways can daily disciplines be transformed into worship?',
        concepts: ['Pranayama', 'Indriya-samyama', 'Dravya-yajna'],
        keyVerses: [25, 33],
        summary: 'Some offer sensory functions into the fire of self-restraint; others offer wealth, breath, or scripture study. All these offerings find their fulfillment in the sacrifice of wisdom.',
        transitionNote: 'Krishna reveals how one receives and cultivates this transformative wisdom.'
      },
      {
        id: 'bg4-stage4',
        stageName: 'The Purifying Sword of Jnana',
        stageNameHi: 'ज्ञान की पावन अग्नि व संशय-नाश',
        verseRange: '34–42',
        startVerse: 34,
        endVerse: 42,
        coreQuestion: 'How does spiritual knowledge conquer paralyzing doubt?',
        concepts: ['Pranipata (Humility)', 'Pariprashna (Inquiry)', 'Samshaya (Doubt)'],
        keyVerses: [34, 38, 42],
        summary: 'Approaching realized seers with reverence, genuine questioning, and service unlocks wisdom. With the sword of knowledge, one cuts down doubts born of ignorance.',
        transitionNote: 'Arjuna asks for definitive clarity on renunciation versus engagement in Chapter 5.'
      }
    ],
    editorialReviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-09-24',
    review: 'approved',
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 5,
    nameEn: 'The Yoga of Renunciation of Action',
    nameHi: 'कर्मसंन्यासयोग',
    speakers: 'Arjuna asks for a final verdict; Krishna contrasts and reconciles Sannyasa with Karma Yoga.',
    listeners: 'Arjuna listens as Krishna’s student. Dhritarashtra hears through Sanjaya.',
    speakersList: ['अर्जुन (Arjuna)', 'श्रीभगवान् (Krishna)'],
    listenersList: ['श्रीभगवान् (Krishna)', 'अर्जुन (Arjuna)'],
    narrativeContext: 'Hearing Krishna praise both the renunciation of actions and their unattached execution, Arjuna asks which of the two is unequivocally superior. Krishna explains that both lead to liberation, but dedicated action is far easier and more reliable for embodied humans.',
    centralConflict: 'External renunciation (dropping social duties) versus internal renunciation (dropping ego and personal ownership while performing duty).',
    mainQuestions: [
      'Between monastic retirement and active duty in the world, which is decisively better?',
      'How does one remain untouched by flaws and sorrows while living amidst busy worldly life?',
      'What is the state of Brahman-consciousness (Brahma-nirvana)?'
    ],
    centralQuestion: 'Can one attain the peace of renunciation while fully immersed in everyday action?',
    concepts: ['Sannyasa (Renunciation)', 'Karma Yoga', 'Brahman', 'Brahma-nirvana', 'Samadarshana (Equal vision)'],
    importantVerses: [
      { verse: 2, note: 'Both renunciation and selfless action lead to the supreme good, but action is easier to practice.' },
      { verse: 4, note: 'Only the immature speak of knowledge and action as contradictory; the wise know they are one.' },
      { verse: 10, note: 'One who dedicates all actions to Brahman remains untouched by negativity, like a lotus leaf by water.' },
      { verse: 18, note: 'Sages see with equal vision a learned scholar, a cow, an elephant, a dog, and an outcaste.' },
      { verse: 22, note: 'Pleasures born of contact with sensory objects are wombs of sorrow; the wise do not delight in them.' },
      { verse: 29, note: 'Knowing the supreme friend of all beings, one attains enduring peace.' }
    ],
    background: 'Builds immediately upon Chapters 3 and 4.',
    prerequisiteConcepts: ['Karma', 'Jnana', 'Brahman'],
    structure: [
      'Comparison of Sannyasa and Karma Yoga (1–6)',
      'The practitioner who works untouched like a lotus leaf (7–13)',
      'The indwelling Self as non-doer and equal vision of sages (14–21)',
      'Freedom from inner turbulence and attainting Brahma-nirvana (22–29)'
    ],
    sequence: seq([
      'Chapter 4 praised both the cessation of work in wisdom and the performance of sacrifice.',
      'Arjuna asks Krishna to state definitively which is better: renouncing action or practicing Karma Yoga.',
      'Krishna declares that while both yield the same fruit, true renunciation is impossible without first practicing selfless action.',
      'Krishna describes the sage who acts without ego, untouched by the world like a lotus leaf in water.',
      'Chapter 6 expands the practical inner technique required to achieve this steadiness through meditation.'
    ]),
    chapterConclusion: 'Chapter 5 shows that true renunciation is psychological, not physical: one does not need to abandon the world, only the illusion of separate egoic ownership.',
    mapNodes: [
      {
        id: 'bg5-stage1',
        stageName: 'Renunciation vs Dedicated Action',
        stageNameHi: 'संन्यास व कर्मयोग की तुलना',
        verseRange: '1–6',
        startVerse: 1,
        endVerse: 6,
        coreQuestion: 'Is it better to abandon action or to dedicate action?',
        concepts: ['Sannyasa', 'Nishkama Karma'],
        keyVerses: [2, 4, 6],
        summary: 'Renunciation without Karma Yoga brings only sorrow. The person who engages wholeheartedly in dedicated duty quickly attains purity and union with Brahman.',
        transitionNote: 'Krishna illustrates the consciousness of the practitioner established in yoga.'
      },
      {
        id: 'bg5-stage2',
        stageName: 'Untouched Like a Lotus Leaf',
        stageNameHi: 'पद्मपत्रमिवाम्भसा: अलिप्त भाव',
        verseRange: '7–13',
        startVerse: 7,
        endVerse: 13,
        coreQuestion: 'How does an active person avoid picking up psychological residue?',
        concepts: ['Padmapatra', 'Nava-dvare pure (City of nine gates)'],
        keyVerses: [10, 11],
        summary: 'Just as a lotus petal repels water droplets, the seeker who offers actions to the supreme acts purely with the senses, mind, and body for inner refinement alone.',
        transitionNote: 'Krishna turns to the inner vision of equality.'
      },
      {
        id: 'bg5-stage3',
        stageName: 'The Sage\'s Equal Vision',
        stageNameHi: 'पण्डिताः समदर्शिनः: समत्व दृष्टि',
        verseRange: '14–21',
        startVerse: 14,
        endVerse: 21,
        coreQuestion: 'How does an enlightened person perceive diversity across living beings?',
        concepts: ['Samadarshana', 'Nirdosha', 'Brahma-sthiti'],
        keyVerses: [18, 19],
        summary: 'Recognizing the single radiant consciousness in all beings, the wise see beyond social rank and species. Established in equanimity, they dwell in Brahman even in this life.',
        transitionNote: 'Krishna provides the closing signposts of liberation.'
      },
      {
        id: 'bg5-stage4',
        stageName: 'Brahma-Nirvana & Eternal Shanti',
        stageNameHi: 'ब्रह्मनिर्वाण व परम शान्ति',
        verseRange: '22–29',
        startVerse: 22,
        endVerse: 29,
        coreQuestion: 'Where is true joy discovered, and who attains ultimate peace?',
        concepts: ['Sukha (True joy)', 'Brahma-nirvana', 'Suhrida (Universal friend)'],
        keyVerses: [22, 28, 29],
        summary: 'Sensory pleasures have beginnings and endings, and harbor sorrow. Sages find joy within, harmonize their breathing, master desire and fear, and attain peace.',
        transitionNote: 'The closing verses anticipate the direct discipline of seated meditation in Chapter 6.'
      }
    ],
    editorialReviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-09-25',
    review: 'approved',
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 6,
    nameEn: 'The Yoga of Meditation (Dhyana Yoga)',
    nameHi: 'ध्यानयोग',
    speakers: 'Krishna guides the inner science of meditation; Arjuna voices practical human struggles.',
    listeners: 'Arjuna listens as Krishna’s student. Dhritarashtra hears the account through Sanjaya.',
    speakersList: ['श्रीभगवान् (Krishna)', 'अर्जुन (Arjuna)'],
    listenersList: ['अर्जुन (Arjuna)', 'श्रीभगवान् (Krishna)'],
    narrativeContext: 'Having explained the philosophical basis of unattached action, Krishna provides specific instructions on seated meditation (Dhyana). When Arjuna objects that the mind is as restless and hard to tame as the wind, Krishna offers compassion, practical remedies, and reassurance.',
    centralConflict: 'The aspiration for contemplative stillness versus the turbulent, intractable momentum of a scattered mind.',
    mainQuestions: [
      'How does one prepare the body, posture, breath, and environment for successful meditation?',
      'How can a restless, easily distracted mind be steadied when it wanders?',
      'What becomes of an honest seeker who begins this path but dies before attaining perfection?'
    ],
    centralQuestion: 'How can a human being train and steady the mind to experience enduring inner tranquility?',
    concepts: ['Yoga', 'Dhyana (Meditation)', 'Abhyasa (Practice)', 'Vairagya (Non-attachment)', 'Yoga-bhrashta (The striving seeker)'],
    importantVerses: [
      { verse: 5, note: 'Elevate yourself by yourself; do not degrade yourself; the self alone is your friend or foe.' },
      { verse: 6, note: 'For one who has conquered the mind, the mind is a friend; for one who has not, it remains an enemy.' },
      { verse: 16, note: 'Yoga is not for one who eats too much or fasts excessively, nor for one who sleeps too much or stays awake.' },
      { verse: 17, note: 'For one who is temperate in eating, recreation, work, and sleep, yoga destroys all sorrow.' },
      { verse: 26, note: 'From whatever direction the restless mind wanders, gently bring it back to the Self.' },
      { verse: 35, note: 'The mind is undoubtedly restless and hard to curb, but it can be mastered through practice and non-attachment.' },
      { verse: 40, note: 'Neither in this world nor in the next is there destruction for the well-doer; no one striving for good comes to ruin.' }
    ],
    background: 'Chapters 2 and 5 prepare the psychological disposition needed for seated meditation.',
    prerequisiteConcepts: ['Yoga', 'Vairagya'],
    structure: [
      'Self-reliance and the mind as friend or adversary (1–9)',
      'Practical guidelines on posture, seat, and moderation (10–19)',
      'The inner experience and vision of Samadhi (20–32)',
      'Arjuna’s struggle with the turbulent mind and Krishna’s remedies (33–36)',
      'The reassuring destiny of the incomplete seeker (37–47)'
    ],
    sequence: seq([
      'Chapter 5 described internal renunciation and equal vision across life.',
      'Krishna outlines the physical and mental disciplines of seated contemplative meditation.',
      'Arjuna objects that the mind is as impossible to hold as a tempestuous wind.',
      'Krishna validates Arjuna’s struggle, but promises that steady practice (Abhyasa) and detachment (Vairagya) succeed.',
      'Chapter 7 shifts from introspective psychology to cosmic knowledge and understanding divine reality.'
    ]),
    chapterConclusion: 'Chapter 6 demystifies meditation: it is neither miraculous nor effortless, but an honest craft of compassionate patience, moderation, and regular practice.',
    mapNodes: [
      {
        id: 'bg6-stage1',
        stageName: 'The Mind: Friend or Foe',
        stageNameHi: 'आत्म-उद्धार व मन की मित्रता',
        verseRange: '1–9',
        startVerse: 1,
        endVerse: 9,
        coreQuestion: 'How does our internal dialogue determine our destiny?',
        concepts: ['Atma-ripu', 'Atma-bandhu', 'Jitatma'],
        keyVerses: [5, 6],
        summary: 'No one outside can rescue us if our own inner mind is turbulent. We must lift ourselves by our own disciplined awareness; the mastered mind is our greatest ally.',
        transitionNote: 'Krishna turns to the concrete outer setup for contemplative practice.'
      },
      {
        id: 'bg6-stage2',
        stageName: 'The Middle Way: Temperance & Posture',
        stageNameHi: 'युक्त-आहार-विहार व साधना-विधि',
        verseRange: '10–19',
        startVerse: 10,
        endVerse: 19,
        coreQuestion: 'What lifestyle habits make deep meditation possible?',
        concepts: ['Yuktahara', 'Asana', 'Brahmachari-vrata'],
        keyVerses: [10, 16, 17],
        summary: 'Meditation requires a clean, quiet space and steady posture. Extreme asceticism or careless indulgence destroys practice; moderation in food, rest, and effort is the golden key.',
        transitionNote: 'Krishna describes the luminous stillness of successful concentration.'
      },
      {
        id: 'bg6-stage3',
        stageName: 'The Stillness of Samadhi',
        stageNameHi: 'समाधि की स्थिरता व एकात्म-दर्शन',
        verseRange: '20–32',
        startVerse: 20,
        endVerse: 32,
        coreQuestion: 'What does consciousness feel like when thoughts settle completely?',
        concepts: ['Samadhi', 'Yogena dhyana', 'Sarvatra sama-darshana'],
        keyVerses: [20, 26, 30, 32],
        summary: 'Like a flame in a windless place that does not flicker, the mind abides in peaceful joy. The yogi sees the Self in all beings and all beings in the Self.',
        transitionNote: 'Arjuna raises his most realistic objection.'
      },
      {
        id: 'bg6-stage4',
        stageName: 'Taming the Wind: Practice & Detachment',
        stageNameHi: 'वायु की तरह चंचल मन: अभ्यास व वैराग्य',
        verseRange: '33–36',
        startVerse: 33,
        endVerse: 36,
        coreQuestion: 'How can ordinary people overcome mental storm and distraction?',
        concepts: ['Chanchalam manah', 'Abhyasa', 'Vairagya'],
        keyVerses: [34, 35],
        summary: 'Arjuna confesses the mind feels uncontrollably turbulent. Krishna agrees, but shows that patient, non-judgmental practice and cooling of cravings will gradually tame it.',
        transitionNote: 'Arjuna asks about those who try their best but fall short before the end.'
      },
      {
        id: 'bg6-stage5',
        stageName: 'No Good Effort is Ever Lost',
        stageNameHi: 'योगभ्रष्ट की सद्गति व आश्वासन',
        verseRange: '37–47',
        startVerse: 37,
        endVerse: 47,
        coreQuestion: 'What happens to someone who falters on the spiritual journey?',
        concepts: ['Yoga-bhrashta', 'Purva-abhyasa', 'Kalyana-krit'],
        keyVerses: [40, 45, 47],
        summary: 'Krishna offers the eternal promise: sincere spiritual effort is never destroyed. In future lifetimes, the seeker is drawn back to practice by accumulated momentum and reaches the goal.',
        transitionNote: 'Having explored the inner subjective self, Krishna opens the objective cosmic reality in Chapter 7.'
      }
    ],
    editorialReviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-09-26',
    review: 'approved',
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 7,
    nameEn: 'The Yoga of Knowledge and Realization',
    nameHi: 'ज्ञानविज्ञानयोग',
    speakers: 'Krishna reveals divine immanence; Sanjaya narrates.',
    listeners: 'Arjuna listens attentively without interruption.',
    speakersList: ['श्रीभगवान् (Krishna)'],
    listenersList: ['अर्जुन (Arjuna)'],
    narrativeContext: 'Moving beyond self-discipline, Krishna reveals the nature of ultimate reality. He explains how the universe manifests through lower material nature (Apara Prakriti) and higher conscious nature (Para Prakriti), and why the veil of Maya makes this truth hard to recognize.',
    centralConflict: 'The sensory world of names and forms versus the underlying conscious source that sustains all existence.',
    mainQuestions: [
      'What are the constituent elements that make up the physical and subtle universe?',
      'Why do human beings get captivated by appearances and fail to see the sacred underlying reality?',
      'Who are the different types of people who turn to the divine for help, and who among them is closest?'
    ],
    centralQuestion: 'How can one perceive the presence of the Divine in and through the everyday natural world?',
    concepts: ['Maya', 'Brahman', 'Prakriti (Higher and Lower Nature)', 'Bhakti', 'Jnana'],
    importantVerses: [
      { verse: 4, note: 'Earth, water, fire, air, space, mind, intellect, and ego constitute My eightfold material nature.' },
      { verse: 5, note: 'Beyond this is My higher nature: the living consciousness that sustains the whole cosmos.' },
      { verse: 7, note: 'There is nothing higher than Me; all creation is strung upon Me like pearls on a thread.' },
      { verse: 8, note: 'I am the taste in water, the radiance in the sun and moon, the sacred syllable OM in the Vedas.' },
      { verse: 14, note: 'My divine illusion (Maya) composed of the three Gunas is difficult to cross; those who surrender to Me cross beyond it.' },
      { verse: 16, note: 'Four kinds of virtuous people worship Me: the distressed, the seeker of knowledge, the seeker of wealth, and the wise.' },
      { verse: 19, note: 'After many births, the person of wisdom takes refuge in Me, realizing that Vasudeva is all that is.' }
    ],
    background: 'First 6 chapters focused on personal discipline (Tvam-pada); Chapter 7 begins the cosmic vision (Tat-pada).',
    prerequisiteConcepts: ['Maya', 'Brahman', 'Jnana'],
    structure: [
      'The eightfold material nature and the higher conscious nature (1–7)',
      'Divine immanence manifesting in elemental phenomena (8–12)',
      'The veil of the three Gunas (Maya) and the four types of seekers (13–19)',
      'Worship of secondary deities and attaining the supreme truth (20–30)'
    ],
    sequence: seq([
      'Chapter 6 concluded with the description of the yogi absorbed in devotion.',
      'Krishna begins by revealing how the cosmos is woven out of his material and conscious energies.',
      'He points out his presence in everyday experiences: taste in water, light in the sun, sound in ether.',
      'He explains the bewitching power of Maya and welcomes all four kinds of seekers who turn toward truth.',
      'Chapter 8 opens with Arjuna asking for precise philosophical definitions of terms introduced in the close of Chapter 7.'
    ]),
    chapterConclusion: 'Chapter 7 invites us to look at the world with poetic and spiritual reverence: God is not an absent monarch, but the very essence, fragrance, and vitality of creation itself.',
    mapNodes: [
      {
        id: 'bg7-stage1',
        stageName: 'Two Natures of Reality',
        stageNameHi: 'अपरा व परा प्रकृति',
        verseRange: '1–7',
        startVerse: 1,
        endVerse: 7,
        coreQuestion: 'What are the building blocks of both matter and consciousness?',
        concepts: ['Apara Prakriti', 'Para Prakriti', 'Sutra-mani'],
        keyVerses: [4, 5, 7],
        summary: 'Material nature comprises earth, water, fire, air, space, mind, intellect, and ego. Sustaining all of this is higher conscious energy; everything is strung on it like pearls on a thread.',
        transitionNote: 'Krishna illustrates where this presence can be directly sensed.'
      },
      {
        id: 'bg7-stage2',
        stageName: 'The Divine in Daily Elements',
        stageNameHi: 'तत्त्वों में दिव्यता का अनुभव',
        verseRange: '8–12',
        startVerse: 8,
        endVerse: 12,
        coreQuestion: 'Where can we observe the divine without visiting a temple?',
        concepts: ['Rasa (Taste)', 'Pranava (OM)', 'Paurusha (Strength)'],
        keyVerses: [8, 10],
        summary: 'The taste of pure water, the warmth of fire, the fragrance of earth, the sound echoing through space, and the vital strength of beings are all immediate manifestations of the Divine.',
        transitionNote: 'Krishna explains why this pervasive presence remains unnoticed by so many.'
      },
      {
        id: 'bg7-stage3',
        stageName: 'The Veil of Maya & Four Seekers',
        stageNameHi: 'त्रिगुणमयी माया व चार प्रकार के भक्त',
        verseRange: '13–19',
        startVerse: 13,
        endVerse: 19,
        coreQuestion: 'Why do people miss the sacred, and who approaches it?',
        concepts: ['Maya', 'Arta', 'Jijnasu', 'Artharthi', 'Jnani'],
        keyVerses: [14, 16, 19],
        summary: 'The three qualities of nature cast a mesmerizing spell (Maya). Those who seek relief, knowledge, worldly resources, or pure wisdom all approach; the wise seeker who sees unity is dearest.',
        transitionNote: 'Krishna addresses worship directed toward partial or temporary goals.'
      },
      {
        id: 'bg7-stage4',
        stageName: 'Transient Rewards vs Supreme Reality',
        stageNameHi: 'अल्प फल बनाम शाश्वत तत्त्व',
        verseRange: '20–30',
        startVerse: 20,
        endVerse: 30,
        coreQuestion: 'Why settle for superficial desires when the whole is available?',
        concepts: ['Antavat phalam', 'Brahman', 'Adhyatma'],
        keyVerses: [23, 28, 30],
        summary: 'Those driven by temporary ambitions worship limited forms and get temporary results. Those freed from delusion recognize the unmanifest reality and know it even at life’s end.',
        transitionNote: 'Arjuna asks for clarification on seven technical terms, introducing Chapter 8.'
      }
    ],
    editorialReviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-09-27',
    review: 'approved',
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 8,
    nameEn: 'The Yoga of the Imperishable Brahman',
    nameHi: 'अक्षरब्रह्मयोग',
    speakers: 'Arjuna poses seven philosophical questions; Krishna explains cosmic cycles and death.',
    listeners: 'Arjuna listens as student. Dhritarashtra hears through Sanjaya.',
    speakersList: ['अर्जुन (Arjuna)', 'श्रीभगवान् (Krishna)'],
    listenersList: ['श्रीभगवान् (Krishna)', 'अर्जुन (Arjuna)'],
    narrativeContext: 'Triggered by terms used at the end of Chapter 7, Arjuna asks for definitions of Brahman, the Self, Action, the Physical realm, the Divine realm, and the Lord of Sacrifice. Krishna answers each, and discusses the conscious transition of the soul at death.',
    centralConflict: 'The dread of death and mortality versus the power of lifelong contemplative remembrance.',
    mainQuestions: [
      'What are Brahman, Adhyatma, Karma, Adhibhuta, Adhidaiva, and Adhiyajna?',
      'How does one keep their mind steady and centered at the final moment of physical departure?',
      'What are the cosmic cycles of creation and dissolution, and what realm lies beyond them?'
    ],
    centralQuestion: 'How can a person live so that the transition of death is met with clarity, fearlessness, and liberation?',
    concepts: ['Brahman', 'Moksha', 'Samsara', 'Akshara (Imperishable)', 'Anta-kala (Final moment)'],
    importantVerses: [
      { verse: 3, note: 'Brahman is the Supreme Imperishable; its nature in the individual is Adhyatma; creation-causing force is Karma.' },
      { verse: 5, note: 'Whoever departs the body remembering Me alone at the time of death attains My being.' },
      { verse: 6, note: 'Whatever state of being one remembers at the end, that alone they attain, shaped by lifetime contemplation.' },
      { verse: 14, note: 'For the yogi who constantly remembers Me with single-minded devotion, I am easily attained.' },
      { verse: 20, note: 'Beyond the unmanifest material nature is another eternal unmanifest reality that never perishes.' },
      { verse: 28, note: 'Knowing this truth, the yogi transcends all merit of rituals, penance, and charity, reaching the primal abode.' }
    ],
    background: 'Builds directly upon the final three verses of Chapter 7.',
    prerequisiteConcepts: ['Brahman', 'Moksha', 'Samsara'],
    structure: [
      'Arjuna’s seven questions and Krishna’s concise definitions (1–4)',
      'The law of final contemplation and lifelong practice (5–14)',
      'Cycles of cosmic birth and dissolution (15–22)',
      'The two paths: solar light and lunar darkness (23–28)'
    ],
    sequence: seq([
      'Chapter 7 ended with mentions of Brahman, Adhyatma, and remembering God at the end of life.',
      'Arjuna asks seven specific questions regarding these cosmic principles.',
      'Krishna defines each principle and explains that whatever is deeply remembered at death is shaped by how one lived.',
      'He contrasts the cyclical perishability of cosmic worlds with the timeless imperishable state.',
      'Chapter 9 unlocks the sovereign, intimate secret of divine love and shelter.'
    ]),
    chapterConclusion: 'Chapter 8 removes the superstition around death: the final thought is not an accidental lottery, but the natural harvest of what the heart has faithfully loved throughout life.',
    mapNodes: [
      {
        id: 'bg8-stage1',
        stageName: 'Seven Cosmic Definitions',
        stageNameHi: 'सात दार्शनिक प्रश्न व उत्तर',
        verseRange: '1–4',
        startVerse: 1,
        endVerse: 4,
        coreQuestion: 'What are the foundational terms connecting the cosmos and the self?',
        concepts: ['Brahman', 'Adhyatma', 'Karma', 'Adhibhuta', 'Adhidaiva', 'Adhiyajna'],
        keyVerses: [1, 3, 4],
        summary: 'Krishna defines the supreme imperishable as Brahman, the indwelling conscious spirit as Adhyatma, creative generative impulse as Karma, and himself within as the Lord of Sacrifice.',
        transitionNote: 'Krishna explains how these realities relate to the human departure at death.'
      },
      {
        id: 'bg8-stage2',
        stageName: 'The Moment of Departure',
        stageNameHi: 'अंतकाल का स्मरण व साधना',
        verseRange: '5–14',
        startVerse: 5,
        endVerse: 14,
        coreQuestion: 'How does our state of mind at death shape what follows?',
        concepts: ['Anta-kala smarana', 'Abhyasa-yoga', 'Pranava (OM)'],
        keyVerses: [5, 6, 14],
        summary: 'Whatever state of being is remembered at the end determines one’s transition. But this final awareness cannot be manufactured on one’s deathbed; it requires unbroken lifetime devotion.',
        transitionNote: 'Krishna broadens the horizon to cosmic scale cycles of time.'
      },
      {
        id: 'bg8-stage3',
        stageName: 'Cosmic Day & Night Cycles',
        stageNameHi: 'ब्रह्मा का दिन-रात्रि व शाश्वत तत्त्व',
        verseRange: '15–22',
        startVerse: 15,
        endVerse: 22,
        coreQuestion: 'How long do created worlds last, and what lies beyond them?',
        concepts: ['Kalpa', 'Avyakta', 'Parama Gati'],
        keyVerses: [18, 20, 21],
        summary: 'Vast cosmic ages dawn and dissolve across trillions of solar years. Yet beyond this alternating flux of manifest and unmanifest nature lies an eternal state that is never destroyed.',
        transitionNote: 'Krishna describes the metaphorical trajectories of departing souls.'
      },
      {
        id: 'bg8-stage4',
        stageName: 'Paths of Light & Return',
        stageNameHi: 'शुक्ल व कृष्ण गति',
        verseRange: '23–28',
        startVerse: 23,
        endVerse: 28,
        coreQuestion: 'Why does the steadfast yogi never experience fear or confusion?',
        concepts: ['Shukla-gati (Path of light)', 'Krishna-gati (Path of return)'],
        keyVerses: [26, 27, 28],
        summary: 'The ancient texts describe the luminous path of non-return and the lunar path of return. The yogi who understands both is never deluded and remains grounded in yoga at all times.',
        transitionNote: 'Krishna turns to the deepest, most compassionate teaching in Chapter 9.'
      }
    ],
    editorialReviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-09-28',
    review: 'approved',
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 9,
    nameEn: 'The Yoga of the Sovereign Science and Secret',
    nameHi: 'राजविद्याराजगुह्ययोग',
    speakers: 'Krishna speaks out of love for Arjuna who is free from cynicism; Sanjaya narrates.',
    listeners: 'Arjuna listens silently with reverence.',
    speakersList: ['श्रीभगवान् (Krishna)'],
    listenersList: ['अर्जुन (Arjuna)'],
    narrativeContext: 'Because Arjuna is free from malice and cynicism (Anasuya), Krishna reveals the "Sovereign Knowledge and Supreme Secret": how the Divine holds the entire universe without being burdened or contained by it, and how even the simplest sincere offering is received with boundless love.',
    centralConflict: 'Complex, exhausting ritualism and transactional religion versus direct, intimate, and unconditional surrender.',
    mainQuestions: [
      'How does the Divine pervade and sustain all beings while remaining unattached and transcendent?',
      'Why is transactional worship for temporary heavenly rewards inadequate for genuine liberation?',
      'What makes the simplest offering—a leaf, a flower, a fruit, or water—infinitely sacred?'
    ],
    centralQuestion: 'What is the most direct, accessible, and loving way for any human being to relate to the Divine?',
    concepts: ['Bhakti', 'Maya', 'Raja Vidya (Sovereign wisdom)', 'Patram Pushpam (Loving offering)', 'Ananya-chinta (Unbroken focus)'],
    importantVerses: [
      { verse: 2, note: 'This is the sovereign science, sovereign secret, supreme purifier, known by direct experience, righteous, and joyful to practice.' },
      { verse: 4, note: 'All this cosmic world is pervaded by Me in My unmanifest form; all beings abide in Me, but I do not abide in them.' },
      { verse: 22, note: 'To those who meditate on Me with single-minded devotion, I personally carry what they lack and preserve what they have.' },
      { verse: 26, note: 'Whoever offers to Me with devotion a leaf, a flower, a fruit, or water—that offering of love from a pure heart I accept.' },
      { verse: 27, note: 'Whatever you do, whatever you eat, whatever you offer or give away, whatever austerity you practice—do that as an offering to Me.' },
      { verse: 30, note: 'Even if the most fallen person turns to Me with undivided devotion, they must be regarded as righteous, for they have resolved rightly.' },
      { verse: 34, note: 'Fix your mind on Me, be devoted to Me, worship Me, bow down to Me; united with Me, you will certainly attain Me.' }
    ],
    background: 'Requires an open, contemplative heart; builds upon the knowledge of Chapter 7.',
    prerequisiteConcepts: ['Bhakti', 'Brahman'],
    structure: [
      'The sovereign secret and divine immanence (1–10)',
      'Blindness of materialists and true seekers of the whole (11–19)',
      'Transient heavens of transactional faith vs eternal security (20–25)',
      'Radical accessibility, universal grace, and loving offerings (26–34)'
    ],
    sequence: seq([
      'Chapter 8 examined cosmic cycles, death, and steadfast contemplation.',
      'Krishna declares he will impart the highest secret to Arjuna because he is free from envy and cynicism.',
      'He reveals that he sustains all worlds while remaining untouched, and contrasts transactional piety with unconditional devotion.',
      'He assures that regardless of past mistakes, caste, or background, anyone who surrenders in love attains peace.',
      'Chapter 10 follows with a wondrous catalogue of how divine glory shines across created forms.'
    ]),
    chapterConclusion: 'Chapter 9 is the emotional heart of the Bhagavad Gita: a declaration of unconditional divine welcome, where neither caste, learning, nor wealth matters—only sincere devotion.',
    mapNodes: [
      {
        id: 'bg9-stage1',
        stageName: 'The Sovereign Secret',
        stageNameHi: 'राजविद्या व जगत्-धारण',
        verseRange: '1–10',
        startVerse: 1,
        endVerse: 10,
        coreQuestion: 'How does the Divine relate to the cosmos without being trapped in it?',
        concepts: ['Raja Vidya', 'Pratyaksha-avagama', 'Udasina (Witness)'],
        keyVerses: [2, 4, 10],
        summary: 'Directly verifiable and joyful to practice, this truth reveals that like space containing all winds, the Divine holds all creatures while remaining entirely free and unattached.',
        transitionNote: 'Krishna explains why people often dismiss or overlook this reality.'
      },
      {
        id: 'bg9-stage2',
        stageName: 'Superficial Vanity vs Reverence',
        stageNameHi: 'मोघाशा मोघकर्माणो बनाम महात्मानः',
        verseRange: '11–19',
        startVerse: 11,
        endVerse: 19,
        coreQuestion: 'Why do cynical minds misunderstand divine presence?',
        concepts: ['Moghasha (Futile hope)', 'Mahatman', 'Kirtana'],
        keyVerses: [11, 17, 19],
        summary: 'Confined to surface appearances, shallow minds scoff at divine consciousness in human form. The wise worship with awe, seeing God as mother, father, sustainer, refuge, and witness.',
        transitionNote: 'Krishna contrasts reward-seeking religion with wholehearted trust.'
      },
      {
        id: 'bg9-stage3',
        stageName: 'Transient Heavens vs Yogakshema',
        stageNameHi: 'स्वर्ग-सुख की नश्वरता व योगक्षेम',
        verseRange: '20–25',
        startVerse: 20,
        endVerse: 25,
        coreQuestion: 'Why is bartering with the divine for heavenly rewards a dead end?',
        concepts: ['Kshine punye (Exhausted merit)', 'Yogakshema'],
        keyVerses: [21, 22],
        summary: 'Ritual bargaining earns temporary residence in paradise, but when merits exhaust, the soul returns to mortal struggle. To those with undivided love, the Divine personally secures their needs.',
        transitionNote: 'Krishna reveals the breathtaking simplicity of true worship.'
      },
      {
        id: 'bg9-stage4',
        stageName: 'The Offering of Love & Universal Refuge',
        stageNameHi: 'पत्रं पुष्पं व परम शरणागति',
        verseRange: '26–34',
        startVerse: 26,
        endVerse: 34,
        coreQuestion: 'Can someone with a flawed past be welcomed into liberation?',
        concepts: ['Patram Pushpam', 'Sarva-samarpana', 'Shubha-ashubha phala-mukti'],
        keyVerses: [26, 27, 30, 34],
        summary: 'A simple leaf or water offered with love is cherished. Dedicate every meal, work, and breath. Even the deeply mistaken person who turns toward truth is swiftly transformed into a saint.',
        transitionNote: 'Arjuna asks in Chapter 10 how he can meditate on this divine presence across specific forms.'
      }
    ],
    editorialReviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-09-29',
    review: 'approved',
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 10,
    nameEn: 'The Yoga of Divine Splendour (Vibhuti Yoga)',
    nameHi: 'विभूतियोग',
    speakers: 'Krishna speaks of divine majesty; Arjuna requests specific manifestations for meditation.',
    listeners: 'Arjuna listens with wonder; Dhritarashtra hears through Sanjaya.',
    speakersList: ['श्रीभगवान् (Krishna)', 'अर्जुन (Arjuna)'],
    listenersList: ['अर्जुन (Arjuna)', 'श्रीभगवान् (Krishna)'],
    narrativeContext: 'Delighted by Arjuna’s receptive understanding, Krishna elaborates on his divine manifestations (Vibhuti). Arjuna asks specifically in what created entities he should visualize the Lord during contemplation, leading Krishna to list the pinnacle of excellence across all categories.',
    centralConflict: 'The difficulty of conceptualizing abstract formless divinity versus seeing tangible divine grandeur in excellence.',
    mainQuestions: [
      'How does recognizing the source of all virtues and beings transform one’s inner devotion?',
      'In which aspects of nature, history, and life should a seeker contemplate the divine presence?',
      'Can any catalogue ever exhaust the infinite manifestations of the supreme reality?'
    ],
    centralQuestion: 'How does divine glory manifest across every outstanding excellence and beauty in the created world?',
    concepts: ['Brahman', 'Bhakti', 'Vibhuti (Divine manifestation)', 'Tejas (Radiance)', 'Mahabhava (Deep love)'],
    importantVerses: [
      { verse: 8, note: 'I am the source of all; from Me everything evolves; knowing this, the wise worship Me with loving devotion.' },
      { verse: 9, note: 'With their minds absorbed in Me and their lives surrendered to Me, enlightening one another and speaking of Me, they are always content.' },
      { verse: 10, note: 'To those who are constantly devoted and worship with love, I grant the yoga of understanding by which they come to Me.' },
      { verse: 11, note: 'Out of sheer compassion for them, dwelling within their hearts, I destroy the darkness born of ignorance with the luminous lamp of wisdom.' },
      { verse: 20, note: 'I am the Self, O Gudakesha, seated in the hearts of all living beings; I am their beginning, middle, and end.' },
      { verse: 41, note: 'Whatever is glorious, beautiful, or powerful in creation—know that to be born of a mere spark of My splendour.' },
      { verse: 42, note: 'I support this entire universe with a single fraction of My being.' }
    ],
    background: 'Flows naturally from the intimacy and adoration developed in Chapter 9.',
    prerequisiteConcepts: ['Brahman', 'Bhakti'],
    structure: [
      'The primal source of beings, sages, and fourfold summary verses (1–11)',
      'Arjuna’s confession of faith and plea for specific Vibhutis (12–18)',
      'The catalogue of divine glories across nature, culture, and power (19–38)',
      'The spark of splendour and supporting the cosmos with a single fraction (39–42)'
    ],
    sequence: seq([
      'Chapter 9 revealed the sovereign secret of unconditional love and refuge.',
      'Krishna declares that neither gods nor great sages know his origin, for he is the source of all wisdom and virtue.',
      'Arjuna accepts Krishna as the supreme reality and asks where and how he should meditate upon him in daily life.',
      'Krishna describes himself as the best in every realm: the sun among lights, the Himalayas among mountains, the soul in all beings.',
      'Chapter 11 bursts open when Arjuna asks to directly witness this cosmic form with his own eyes.'
    ]),
    chapterConclusion: 'Chapter 10 teaches us to see the divine not as an alien intruder, but as the supreme pinnacle of all art, heroism, mountain grandeur, and inner consciousness.',
    mapNodes: [
      {
        id: 'bg10-stage1',
        stageName: 'The Chatuh-shloki Gita',
        stageNameHi: 'चतुःश्लोकी गीता: ज्ञान का दीप',
        verseRange: '1–11',
        startVerse: 1,
        endVerse: 11,
        coreQuestion: 'How does recognizing the origin of life inspire deep, joyful devotion?',
        concepts: ['Buddhi-yoga', 'Jnana-dipa', 'Tushti (Contentment)'],
        keyVerses: [8, 9, 10, 11],
        summary: 'These four famous verses summarize the Gita: knowing God as the source of all, seekers converse in joy, and the indwelling divine dispels all dark ignorance with the lamp of wisdom.',
        transitionNote: 'Arjuna affirms his faith and asks a practical question.'
      },
      {
        id: 'bg10-stage2',
        stageName: 'Arjuna\'s Plea for Meditation Focus',
        stageNameHi: 'अर्जुन की जिज्ञासा: किन भावों में चिंतन करूँ?',
        verseRange: '12–18',
        startVerse: 12,
        endVerse: 18,
        coreQuestion: 'How can an ordinary human mind meditate upon the unmanifest?',
        concepts: ['Param Brahma', 'Pavitram paramam', 'Amrita (Nectar)'],
        keyVerses: [12, 18],
        summary: 'Arjuna acknowledges Krishna as the supreme reality praised by sages like Narada and Vyasa, and asks which specific manifestations he should hold in his heart during contemplation.',
        transitionNote: 'Krishna begins his majestic recital of excellences.'
      },
      {
        id: 'bg10-stage3',
        stageName: 'The Panorama of Divine Excellences',
        stageNameHi: 'विभूतियों का विस्तार',
        verseRange: '19–38',
        startVerse: 19,
        endVerse: 38,
        coreQuestion: 'Where does divine excellence show up in the created world?',
        concepts: ['Himalaya', 'Gayatri', 'Omkara', 'Kala (Time)', 'Vasudeva'],
        keyVerses: [20, 25, 30],
        summary: 'Among lights I am the sun; among mantras, the sacred syllable OM; among mountains, the Himalayas; among seasons, spring; among seers, Vyasa; and in all living beings, the indwelling Self.',
        transitionNote: 'Krishna concludes with the scale of this manifestation.'
      },
      {
        id: 'bg10-stage4',
        stageName: 'A Single Spark of Splendour',
        stageNameHi: 'तेज का एक अंश व विश्व-धारण',
        verseRange: '39–42',
        startVerse: 39,
        endVerse: 42,
        coreQuestion: 'How much of divine reality does our universe actually represent?',
        concepts: ['Tejo-amsha-sambhava', 'Ekamsha'],
        keyVerses: [41, 42],
        summary: 'Every magnificent, beautiful, or mighty thing in existence is merely a spark from an infinite flame. With just a fraction of his being, the Divine sustains the entire cosmos.',
        transitionNote: 'Arjuna’s wonder turns into a burning desire to see this form visually in Chapter 11.'
      }
    ],
    editorialReviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-09-30',
    review: 'approved',
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 11,
    nameEn: 'The Yoga of the Vision of the Cosmic Form',
    nameHi: 'विश्वरूपदर्शनयोग',
    speakers: 'Arjuna pleads to see the cosmic form; Krishna grants divine vision; Sanjaya narrates the awesome spectacle.',
    listeners: 'Dhritarashtra hears Sanjaya’s terrified narration; Arjuna trembles before the vision.',
    speakersList: ['अर्जुन (Arjuna)', 'श्रीभगवान् (Krishna)', 'संजय (Sanjaya)'],
    listenersList: ['श्रीभगवान् (Krishna)', 'धृतराष्ट्र (Dhritarashtra)', 'अर्जुन (Arjuna)'],
    narrativeContext: 'Deeply moved by Krishna’s words in Chapter 10, Arjuna asks to witness the sovereign cosmic form with his own eyes. Krishna grants him supernatural divine vision (Divya Chakshu). Arjuna beholds the boundless, radiant, and terrifying majesty of time devouring all universes.',
    centralConflict: 'The comfortable human desire for pleasant, aesthetic divinity versus the staggering, overwhelming reality of all-consuming time and cosmic destruction.',
    mainQuestions: [
      'Can human physical eyes behold the boundless expanse of ultimate reality?',
      'How does one face the terrifying reality of mortality and cosmic destruction (Kala)?',
      'What remains of human agency when the broader arc of destiny has already resolved events?'
    ],
    centralQuestion: 'What happens when human consciousness is suddenly confronted with the unfiltered, infinite totality of existence?',
    concepts: ['Brahman', 'Vishvarupa (Cosmic form)', 'Divya Chakshu (Divine eye)', 'Kala (All-devouring time)', 'Nimitta-matra (Mere instrument)'],
    importantVerses: [
      { verse: 3, note: 'O Supreme Lord, I desire to see Your sovereign cosmic form.' },
      { verse: 8, note: 'You cannot see Me with your physical eyes; I grant you divine vision: behold My sovereign yoga!' },
      { verse: 12, note: 'If the radiance of a thousand suns were to burst forth at once in the sky, that might resemble the splendour of that Great Being.' },
      { verse: 15, note: 'Arjuna said: O Lord, in Your body I behold all the gods and hosts of diverse living beings.' },
      { verse: 32, note: 'I am Time, the great destroyer of worlds, arisen to consume all; even without you, none of these warriors will survive.' },
      { verse: 33, note: 'Therefore arise and win glory! By Me they have already been slain; be merely the outward instrument, O ambidextrous archer.' },
      { verse: 55, note: 'One who acts for Me, holds Me as supreme, is devoted to Me, free from attachment and enmity toward all beings—attains Me.' }
    ],
    background: 'Read after Chapter 10; marks the emotional and metaphysical climax of the Gita.',
    prerequisiteConcepts: ['Brahman', 'Bhakti', 'Karma'],
    structure: [
      'Arjuna’s request and Krishna’s granting of the divine vision (1–8)',
      'Sanjaya’s description of the dazzling cosmic splendor (9–14)',
      'Arjuna’s awe, wonder, and subsequent dread of the devouring mouths of Time (15–31)',
      'Krishna’s revelation: "I am Time" and the call to be a willing instrument (32–34)',
      'Arjuna’s trembling hymn of praise, plea for forgiveness, and return to the gentle form (35–55)'
    ],
    sequence: seq([
      'Chapter 10 described divine glory shining through excellences in the world.',
      'Arjuna asks to actually behold that all-encompassing divine form with his own eyes.',
      'Krishna bestows divine vision, revealing countless faces, sun-like radiance, and cosmic armies rushing into blazing jaws.',
      'Terrified, Arjuna acknowledges Krishna as Time itself, begs pardon for addressing him as mere friend, and asks him to resume his gentle form.',
      'Chapter 12 opens with Arjuna asking whether meditating on this formless cosmic reality or loving the personal Lord is better.'
    ]),
    chapterConclusion: 'Chapter 11 proves that reality is not tailored to comfort human egos: the universe contains both infinite beauty and awe-inspiring destruction, calling us to courageous surrender.',
    mapNodes: [
      {
        id: 'bg11-stage1',
        stageName: 'The Plea & The Divine Eye',
        stageNameHi: 'विश्वरूप देखने की प्रार्थना व दिव्य चक्षु',
        verseRange: '1–8',
        startVerse: 1,
        endVerse: 8,
        coreQuestion: 'Can our limited biological senses perceive the infinite?',
        concepts: ['Divya Chakshu', 'Yogeshvara'],
        keyVerses: [3, 8],
        summary: 'Recognizing that mortal eyes cannot withstand the unfiltered boundless truth, Krishna gifts Arjuna divine perception to behold the sovereign wonder.',
        transitionNote: 'Sanjaya attempts to capture the sudden cosmic explosion of light.'
      },
      {
        id: 'bg11-stage2',
        stageName: 'A Thousand Suns: Cosmic Splendor',
        stageNameHi: 'सहस्र सूर्यों का प्रकाश व चकित संजय',
        verseRange: '9–22',
        startVerse: 9,
        endVerse: 22,
        coreQuestion: 'What does the unified fabric of the cosmos look like?',
        concepts: ['Divi surya-sahasrasya', 'Ananta-rupa'],
        keyVerses: [12, 15],
        summary: 'Blazing brighter than thousands of simultaneous suns, all gods, sages, celestial serpents, and galaxies appear united in a single, infinite living organism.',
        transitionNote: 'Wonder gives way to sheer dread as Arjuna notices the devouring flames.'
      },
      {
        id: 'bg11-stage3',
        stageName: 'I am Time: The Crucible of Destiny',
        stageNameHi: 'कालोऽस्मि: काल रूप व निमित्त-भाव',
        verseRange: '23–34',
        startVerse: 23,
        endVerse: 34,
        coreQuestion: 'How does a seeker reconcile divine love with mortality and war?',
        concepts: ['Kala', 'Nimitta-matra', 'Loka-kshaya-krit'],
        keyVerses: [29, 32, 33],
        summary: 'Armies and kings rush helplessly into fiery mouths like moths into flame. Krishna announces: "I am Time, destroyer of worlds. These warriors are already slain by destiny; be merely my instrument."',
        transitionNote: 'Overcome with awe, Arjuna offers an ecstatic prayer of surrender.'
      },
      {
        id: 'bg11-stage4',
        stageName: 'Hymn of Surrender & Plea for Grace',
        stageNameHi: 'अर्जुन की स्तुति व क्षमा-याचना',
        verseRange: '35–46',
        startVerse: 35,
        endVerse: 46,
        coreQuestion: 'How does an individual respond after discovering their friend is the cosmos?',
        concepts: ['Namaskara', 'Kshama (Forgiveness)', 'Saumya-rupa'],
        keyVerses: [36, 40, 44],
        summary: 'Prostrating in all directions, Arjuna begs forgiveness for treating Krishna casually as a companion, and pleads for him to resume his familiar, gentle human form.',
        transitionNote: 'Krishna consoles his trembling disciple and shares the secret of attainment.'
      },
      {
        id: 'bg11-stage5',
        stageName: 'Return to Gentleness & Devotion',
        stageNameHi: 'सौम्य रूप व अनन्य भक्ति',
        verseRange: '47–55',
        startVerse: 47,
        endVerse: 55,
        coreQuestion: 'How can this supreme vision be attained by seekers?',
        concepts: ['Ananya Bhakti', 'Mat-karma-krit', 'Nirvaira (Free of enmity)'],
        keyVerses: [50, 54, 55],
        summary: 'Resuming his calm form, Krishna reassures Arjuna: neither Vedic study, charity, nor rituals can unlock this vision—only undivided love free from malice toward any being.',
        transitionNote: 'Arjuna asks in Chapter 12 whether the personal or unmanifest path is preferable.'
      }
    ],
    editorialReviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-10-01',
    review: 'approved',
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 12,
    nameEn: 'The Yoga of Devotion (Bhakti Yoga)',
    nameHi: 'भक्तियोग',
    speakers: 'Arjuna asks which path is superior; Krishna outlines the practical ladder of devotion.',
    listeners: 'Arjuna listens as student; Dhritarashtra hears through Sanjaya.',
    speakersList: ['अर्जुन (Arjuna)', 'श्रीभगवान् (Krishna)'],
    listenersList: ['श्रीभगवान् (Krishna)', 'अर्जुन (Arjuna)'],
    narrativeContext: 'Shaken by the awesome vision of the cosmic form, Arjuna asks whether it is better to worship the personal Lord with form or meditate on the unmanifest, formless Absolute. Krishna validates both, but explains why love for the personal Divine is far more accessible for embodied souls.',
    centralConflict: 'The steep, intellectually strenuous path of formless meditation versus the warm, heart-centered path of personal devotion.',
    mainQuestions: [
      'Between worship of the personal God and contemplation of the formless unmanifest, which is better?',
      'What practical steps can a person take if their mind cannot continuously sustain meditation?',
      'What are the real moral, psychological, and behavioural qualities of someone dear to the Divine?'
    ],
    centralQuestion: 'How can an ordinary person cultivate genuine spiritual love, and how does a true devotee live in the world?',
    concepts: ['Bhakti', 'Sakara and Nirakara (With form and formless)', 'Abhyasa (Practice)', 'Samatvam (Equanimity)', 'Karuna (Compassion)'],
    importantVerses: [
      { verse: 2, note: 'Those who fix their minds on Me with steadfast devotion and supreme faith are most perfect in yoga.' },
      { verse: 5, note: 'The trouble for those whose minds are attached to the unmanifest is greater; the formless path is hard for embodied beings.' },
      { verse: 8, note: 'Fix your mind on Me alone, rest your intellect in Me; you will dwell in Me hereafter without doubt.' },
      { verse: 10, note: 'If you cannot practice steady focus, be intent on working for My sake; even doing work for Me you will attain perfection.' },
      { verse: 12, note: 'Better than mechanical practice is knowledge; better than knowledge is meditation; better than meditation is relinquishing fruit of action, for peace follows immediately.' },
      { verse: 13, note: 'One who has no ill will toward any being, who is friendly and compassionate, free from egoism and possessiveness, equal in pleasure and pain...' },
      { verse: 15, note: 'One by whom the world is not agitated and who is not agitated by the world, free from agitation, anger, fear, and anxiety—is dear to Me.' }
    ],
    background: 'Follows directly upon the cosmic vision of Chapter 11.',
    prerequisiteConcepts: ['Bhakti', 'Yoga'],
    structure: [
      'Arjuna’s inquiry on the two paths: with form and formless (1–7)',
      'The descending practical ladder of spiritual practice (8–12)',
      'The twelve inner virtues of the beloved devotee (13–20)'
    ],
    sequence: seq([
      'Chapter 11 presented both the terrifying cosmic form and the gentle four-armed form.',
      'Arjuna asks whether devotion to the personal Lord or meditation on the formless unmanifest is superior.',
      'Krishna explains that while both attain the goal, the unmanifest path is fraught with hardship for embodied humans.',
      'He gives a step-by-step practical ladder: meditation, practice, selfless work, and surrendering results.',
      'Chapter 13 turns to philosophical inquiry, dissecting the body (the field) and the consciousness (the knower).'
    ]),
    chapterConclusion: 'Chapter 12 rescues devotion from sentimentalism: true love for God is proven not by emotional displays, but by harmlessness, friendliness, equanimity, and inner freedom from resentment.',
    mapNodes: [
      {
        id: 'bg12-stage1',
        stageName: 'Form vs The Formless Path',
        stageNameHi: 'सगुण बनाम निर्गुण उपासना',
        verseRange: '1–7',
        startVerse: 1,
        endVerse: 7,
        coreQuestion: 'Why is meditating on the formless Absolute so difficult for most people?',
        concepts: ['Sakara', 'Avyakta', 'Klesha (Hardship)'],
        keyVerses: [2, 5, 7],
        summary: 'Both paths reach the same summit, but meditating on the unmanifest is exceedingly difficult for embodied beings identified with flesh. Love for the divine form provides a natural, accessible anchor.',
        transitionNote: 'Krishna provides realistic fallback options for diverse spiritual capacities.'
      },
      {
        id: 'bg12-stage2',
        stageName: 'The Graded Ladder of Practice',
        stageNameHi: 'साधना की क्रमिक सीढ़ियाँ',
        verseRange: '8–12',
        startVerse: 8,
        endVerse: 12,
        coreQuestion: 'What should we do when our mind fails to concentrate steadily?',
        concepts: ['Abhyasa', 'Mat-karma (Work for the divine)', 'Phala-tyaga'],
        keyVerses: [8, 10, 12],
        summary: 'If you cannot fix your mind constantly, try repeated practice. If you cannot practice, do good work for the divine. If you cannot do that, surrender the fruits of action, which immediately brings peace.',
        transitionNote: 'Krishna presents the sublime portrait of the true devotee.'
      },
      {
        id: 'bg12-stage3',
        stageName: 'The Marks of the Beloved Devotee',
        stageNameHi: 'प्रिय भक्त के बारह लक्षण',
        verseRange: '13–20',
        startVerse: 13,
        endVerse: 20,
        coreQuestion: 'How does an authentic devotee treat the world and its people?',
        concepts: ['Adveshta (Without hatred)', 'Maitra (Friendly)', 'Karuna (Compassionate)', 'Nirapeksha'],
        keyVerses: [13, 15, 18, 20],
        summary: 'Without hatred toward any creature, patient, forgiving, causing no anxiety to the world and never agitated by it, equal in praise and blame, silent and content—such a person is infinitely dear.',
        transitionNote: 'Krishna turns to rigorous metaphysical analysis of body and soul in Chapter 13.'
      }
    ],
    editorialReviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-10-02',
    review: 'approved',
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 13,
    nameEn: 'The Yoga of the Field and Knower of the Field',
    nameHi: 'क्षेत्रक्षेत्रज्ञविभागयोग',
    speakers: 'Krishna dissects the objective field and subjective consciousness; Sanjaya narrates.',
    listeners: 'Arjuna listens as student; Dhritarashtra hears through Sanjaya.',
    speakersList: ['श्रीभगवान् (Krishna)'],
    listenersList: ['अर्जुन (Arjuna)'],
    narrativeContext: 'Beginning the final six chapters (focusing on the nature of reality and discernment), Krishna introduces the critical distinction between the Field (Kshetra—the body, mind, senses, and emotions) and the Knower of the Field (Kshetrajna—the unattached witnessing consciousness).',
    centralConflict: 'The confusion between our changing psychophysical instruments and our unchanging conscious core.',
    mainQuestions: [
      'What constitutes the "Field" of human experience (the body, desires, intelligence, ego)?',
      'What is the true nature of the "Knower of the Field" that witnesses all bodily and mental states?',
      'What are the twenty virtues that constitute genuine spiritual wisdom?'
    ],
    centralQuestion: 'How can one clearly differentiate between the changing world of thoughts and the unchanging witness within?',
    concepts: ['Jnana', 'Atman', 'Brahman', 'Kshetra (The field)', 'Kshetrajna (The knower)', 'Prakriti and Purusha'],
    importantVerses: [
      { verse: 1, note: 'This body is called the Field; one who knows it is called the Knower of the Field by the wise.' },
      { verse: 2, note: 'Know Me as the Knower of the Field in all fields; knowledge of both Field and Knower is true wisdom.' },
      { verse: 13, note: 'With hands and feet everywhere, eyes, heads, and mouths everywhere, ears everywhere, that supreme reality encompasses all.' },
      { verse: 27, note: 'One who sees the Supreme Lord dwelling equally in all perishing beings as the imperishable truth—truly sees.' },
      { verse: 34, note: 'Just as the one sun illumines this entire world, so the Lord of the Field illumines the whole field.' }
    ],
    background: 'Marks the opening of the final third of the Gita, focusing on discrimination (Viveka).',
    prerequisiteConcepts: ['Jnana', 'Atman', 'Brahman'],
    structure: [
      'The definition and constituents of the Field (1–6)',
      'The twenty practical virtues comprising spiritual wisdom (7–11)',
      'The nature of the Supreme Knower (Brahman) (12–18)',
      'Prakriti and Purusha: interaction of matter and spirit (19–34)'
    ],
    sequence: seq([
      'Chapter 12 described the inner virtues and devotion of the beloved devotee.',
      'Krishna introduces the analytical distinction between the body-mind (the Field) and witnessing awareness (the Knower).',
      'He lists twenty essential attitudes—humility, patience, detachment—that alone constitute true wisdom.',
      'He demonstrates that the witness consciousness in all living beings is one and the same indivisible light.',
      'Chapter 14 investigates how the three qualities of nature (Gunas) bind this witness to matter.'
    ]),
    chapterConclusion: 'Chapter 13 provides the ultimate diagnostic tool for psychological freedom: you are not your grief, anxiety, or bodily ailments; you are the silent witness observing them.',
    mapNodes: [
      {
        id: 'bg13-stage1',
        stageName: 'The Field & The Witness',
        stageNameHi: 'क्षेत्र व क्षेत्रज्ञ का भेद',
        verseRange: '1–6',
        startVerse: 1,
        endVerse: 6,
        coreQuestion: 'What parts of our experience are objects rather than the true self?',
        concepts: ['Kshetra', 'Kshetrajna', 'Vikara (Modifications)'],
        keyVerses: [1, 2],
        summary: 'The physical body, sensations, desires, aversions, intellect, and ego are all parts of the Field. The silent, observing consciousness that watches them is the Knower.',
        transitionNote: 'Krishna defines the specific psychological attitudes that constitute true knowing.'
      },
      {
        id: 'bg13-stage2',
        stageName: 'Twenty Virtues of Wisdom',
        stageNameHi: 'ज्ञान के बीस लक्षण',
        verseRange: '7–11',
        startVerse: 7,
        endVerse: 11,
        coreQuestion: 'What does genuine wisdom look like in everyday character?',
        concepts: ['Amanitva (Humility)', 'Adambhitva (Unpretentiousness)', 'Ahimsa', 'Shaucha'],
        keyVerses: [7, 8, 11],
        summary: 'Humility, unpretentiousness, non-harming, patience, straightforwardness, service to the teacher, purity, steadfastness, and unattached love—this is true knowledge; everything else is ignorance.',
        transitionNote: 'Krishna describes the ultimate reality to be realized through these virtues.'
      },
      {
        id: 'bg13-stage3',
        stageName: 'The Light Beyond Darkness',
        stageNameHi: 'ज्ञेय ब्रह्म: सर्वव्यापी प्रकाश',
        verseRange: '12–18',
        startVerse: 12,
        endVerse: 18,
        coreQuestion: 'How can the supreme reality be both within and without all beings?',
        concepts: ['Jneya', 'Jyotisham jyotih', 'Hridi sarvasya'],
        keyVerses: [13, 17],
        summary: 'It is neither existing nor non-existing, unattached yet supporting all, devoid of sensory organs yet experiencing everything, the light of lights dwelling in the hearts of all.',
        transitionNote: 'Krishna explains the dynamic interaction between soul and nature.'
      },
      {
        id: 'bg13-stage4',
        stageName: 'Equal Vision Across All Beings',
        stageNameHi: 'सर्वत्र सम-दर्शन व मोक्ष',
        verseRange: '19–34',
        startVerse: 19,
        endVerse: 34,
        coreQuestion: 'How does discriminating awareness liberate a human life?',
        concepts: ['Samam pashyan', 'Prakriti-Purusha', 'Surya-prakasha'],
        keyVerses: [27, 28, 34],
        summary: 'One who sees the deathless Lord dwelling equally in all dying bodies does not injure the self by the self. Like the sun illuminating the entire earth, the one witness illumines all fields.',
        transitionNote: 'Chapter 14 delves into the three Gunas that govern the operation of the Field.'
      }
    ],
    editorialReviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-10-03',
    review: 'approved',
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 14,
    nameEn: 'The Yoga of the Division of the Three Gunas',
    nameHi: 'गुणत्रयविभागयोग',
    speakers: 'Krishna expounds the three psychological qualities; Arjuna asks how to transcend them.',
    listeners: 'Arjuna listens as student; Dhritarashtra hears through Sanjaya.',
    speakersList: ['श्रीभगवान् (Krishna)', 'अर्जुन (Arjuna)'],
    listenersList: ['अर्जुन (Arjuna)', 'श्रीभगवान् (Krishna)'],
    narrativeContext: 'Krishna analyzes the three constituent forces of nature (Gunas): Sattva (clarity, harmony, lucidity), Rajas (passion, restless ambition, agitation), and Tamas (inertia, confusion, lethargy). He shows how they condition human psychology and how one rises beyond them to become "Gunatita".',
    centralConflict: 'Being pulled helplessly by mood swings, restlessness, and laziness versus abiding as an unshakeable, detached witness.',
    mainQuestions: [
      'What are Sattva, Rajas, and Tamas, and how does each bond the conscious self to the body?',
      'How do the three Gunas dictate our emotional moods, sleep habits, and ambitions?',
      'What are the marks of a person who has transcended all three qualities (Gunatita)?'
    ],
    centralQuestion: 'How can we understand our psychological moods and transcend our conditioned behavioral patterns?',
    concepts: ['Moksha', 'Gunas (Sattva, Rajas, Tamas)', 'Gunatita (Transcending the qualities)', 'Prakriti'],
    importantVerses: [
      { verse: 5, note: 'Sattva, Rajas, and Tamas are the qualities born of nature; they bind the imperishable embodied soul in the body.' },
      { verse: 6, note: 'Of these, Sattva is luminous and stainless, binding by attachment to happiness and knowledge.' },
      { verse: 11, note: 'When the light of wisdom shines through all the gateways of this body, one should know that Sattva is dominant.' },
      { verse: 17, note: 'From Sattva arises knowledge; from Rajas arises greed; and from Tamas arise heedlessness, delusion, and ignorance.' },
      { verse: 20, note: 'Transcending these three qualities born of the body, the soul is freed from birth, death, old age, and sorrow, attaining immortality.' },
      { verse: 22, note: 'One who does not hate illumination, activity, or delusion when present, nor longs for them when absent...' },
      { verse: 26, note: 'One who serves Me with unswerving devotion transcends these three qualities and is fit for attaining Brahman.' }
    ],
    background: 'Detailed psychological elaboration of the Field introduced in Chapter 13.',
    prerequisiteConcepts: ['Moksha', 'Yoga'],
    structure: [
      'The nature and binding mechanism of the three Gunas (1–9)',
      'The manifestations and consequences of each Guna (10–18)',
      'Transcending the qualities and Arjuna’s question (19–21)',
      'The conduct of the Gunatita and the path of devotion (22–27)'
    ],
    sequence: seq([
      'Chapter 13 examined the Field and the witnessing consciousness.',
      'Krishna explains how nature’s three psychological energies—Sattva, Rajas, and Tamas—color human experience.',
      'He charts how clarity binds to happiness, ambition binds to restlessness, and inertia binds to delusion.',
      'Arjuna asks what marks someone who has risen beyond the three qualities.',
      'Chapter 15 uses the ancient metaphor of the cosmic Ashvattha tree to show how to cut attachment to these qualities.'
    ]),
    chapterConclusion: 'Chapter 14 offers profound emotional intelligence: by observing our moods as natural fluctuations of the Gunas rather than our true identity, we gain freedom from their tyranny.',
    mapNodes: [
      {
        id: 'bg14-stage1',
        stageName: 'The Three Strands of Nature',
        stageNameHi: 'तीन गुणों का स्वरूप व बन्धन',
        verseRange: '1–9',
        startVerse: 1,
        endVerse: 9,
        coreQuestion: 'How do Sattva, Rajas, and Tamas influence our consciousness?',
        concepts: ['Sattva (Luminosity)', 'Rajas (Passion)', 'Tamas (Inertia)'],
        keyVerses: [5, 6],
        summary: 'Sattva is luminous and healthy, but binds to intellectual pride and comfort; Rajas is passionate craving that binds to intense work; Tamas is heedless lethargy that binds to sleep and apathy.',
        transitionNote: 'Krishna explains how these three battle for dominance in daily life.'
      },
      {
        id: 'bg14-stage2',
        stageName: 'The Cycles of the Gunas',
        stageNameHi: 'गुणों का प्रभाव व फल',
        verseRange: '10–18',
        startVerse: 10,
        endVerse: 18,
        coreQuestion: 'How can we diagnose which Guna is governing our current mindset?',
        concepts: ['Prakasha (Light)', 'Lobha (Greed)', 'Pramada (Heedlessness)'],
        keyVerses: [11, 17],
        summary: 'When Sattva rules, the senses radiate clarity; when Rajas surges, restlessness and ambition ignite; when Tamas takes over, dullness and confusion descend. We reap wisdom from Sattva, sorrow from Rajas, and ignorance from Tamas.',
        transitionNote: 'Arjuna asks how one transcends this emotional carousel.'
      },
      {
        id: 'bg14-stage3',
        stageName: 'The Gunatita: Transcending the Strands',
        stageNameHi: 'गुणातीत के लक्षण व आचरण',
        verseRange: '19–27',
        startVerse: 19,
        endVerse: 27,
        coreQuestion: 'How does an enlightened person experience emotional tides?',
        concepts: ['Gunatita', 'Udasinavat (As an onlooker)', 'Bhakti-yoga'],
        keyVerses: [20, 22, 26],
        summary: 'The sage observes the rise and fall of clarity, agitation, and dullness without clinging or resentment, knowing "the Gunas are merely interacting with Gunas." Serving the divine with unswerving love, one transcends all three.',
        transitionNote: 'Chapter 15 introduces the upside-down Ashvattha tree of worldly attachment.'
      }
    ],
    editorialReviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-10-04',
    review: 'approved',
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 15,
    nameEn: 'The Yoga of the Supreme Person (Purushottama Yoga)',
    nameHi: 'पुरुषोत्तमयोग',
    speakers: 'Krishna reveals the cosmic Ashvattha tree and the Supreme Person; Sanjaya narrates.',
    listeners: 'Arjuna listens attentively without interruption.',
    speakersList: ['श्रीभगवान् (Krishna)'],
    listenersList: ['अर्जुन (Arjuna)'],
    narrativeContext: 'Krishna uses the Vedic metaphor of the cosmic Ashvattha tree—with roots above in the unmanifest source and branches below in worldly phenomena—to explain Samsara. He instructs how to fell this tree with the axe of non-attachment, and reveals the triune doctrine of Kshara, Akshara, and Purushottama.',
    centralConflict: 'Entanglement in the dense foliage of worldly attachments versus cutting through to the foundational transcendent source.',
    mainQuestions: [
      'What is the meaning of the upside-down cosmic tree (Ashvattha)?',
      'What instrument can sever the tenacious, multi-branched roots of worldly craving?',
      'Who is the "Purushottama" that transcends both the perishable material cosmos and the imperishable witness?'
    ],
    centralQuestion: 'What is the ultimate nature of the Supreme Being that transcends both matter and individual souls?',
    concepts: ['Brahman', 'Vairagya', 'Samsara', 'Ashvattha (Cosmic tree)', 'Purushottama (Supreme Person)', 'Jivatman'],
    importantVerses: [
      { verse: 1, note: 'They speak of an eternal Ashvattha tree with roots above and branches below; its leaves are the hymns; one who knows it knows the Vedas.' },
      { verse: 3, note: 'Its true form is not perceived here... cut down this deep-rooted tree with the firm axe of non-attachment.' },
      { verse: 6, note: 'The sun does not illuminate it, nor the moon, nor fire; that is My supreme abode, reaching which one does not return.' },
      { verse: 7, note: 'An eternal fragment of My own self becomes a living soul in the world of life, drawing to itself the senses and mind.' },
      { verse: 15, note: 'I am seated in the hearts of all; from Me come memory, knowledge, and their loss; I alone am to be known through all the Vedas.' },
      { verse: 18, note: 'Because I transcend the perishable and am higher even than the imperishable, I am celebrated in the world and Vedas as Purushottama.' },
      { verse: 20, note: 'Thus this most secret teaching has been revealed by Me, O sinless one; understanding this, a person becomes wise and has fulfilled all duties.' }
    ],
    background: 'Often chanted as a daily prayer before meals; revered as the condensed essence of all Upanishadic wisdom.',
    prerequisiteConcepts: ['Brahman', 'Vairagya', 'Samsara'],
    structure: [
      'The cosmic upside-down Ashvattha tree and its felling with non-attachment (1–6)',
      'The transmigrating soul and the indwelling divine life in nature (7–15)',
      'The three categories: the Perishable (Kshara), Imperishable (Akshara), and Supreme Person (Purushottama) (16–20)'
    ],
    sequence: seq([
      'Chapter 14 explored the three Gunas that bind consciousness to the body.',
      'Krishna uses the imagery of the cosmic Ashvattha tree to depict the complex entanglement of Samsara.',
      'He urges the seeker to cut its tangled branches with the sharp axe of non-attachment (Asanga-shastra).',
      'He distinguishes between the perishable universe, the imperishable witness, and the Supreme Reality (Purushottama).',
      'Chapter 16 contrasts the noble divine virtues that help cut this tree with destructive egoic tendencies.'
    ]),
    chapterConclusion: 'Chapter 15 is the contemplative crown of the Gita: it reveals our shared identity as an eternal fragment of the Divine, calls us to detach from trivialities, and anchors us in the supreme reality.',
    mapNodes: [
      {
        id: 'bg15-stage1',
        stageName: 'The Cosmic Ashvattha Tree',
        stageNameHi: 'उर्ध्वमूलम्: संसार रूपी अश्वत्थ वृक्ष',
        verseRange: '1–6',
        startVerse: 1,
        endVerse: 6,
        coreQuestion: 'How can we free ourselves from the tangled branches of endless desires?',
        concepts: ['Urdhva-mula', 'Asanga-shastra (Axe of detachment)', 'Padam tat'],
        keyVerses: [1, 3, 6],
        summary: 'Rooted above in the unmanifest and branching downward into sensory objects, Samsara resembles a vast banyan tree. It cannot be analyzed endlessly—it must be severed cleanly with the axe of dispassion.',
        transitionNote: 'Krishna explains how consciousness navigates physical embodiment.'
      },
      {
        id: 'bg15-stage2',
        stageName: 'The Soul & Indwelling Vitality',
        stageNameHi: 'ममैवांशो जीवलोके: देह में जीवात्मा',
        verseRange: '7–15',
        startVerse: 7,
        endVerse: 15,
        coreQuestion: 'Who actually experiences our thoughts, memories, and nourishment?',
        concepts: ['Amsha (Spark/Fragment)', 'Vaishvanara', 'Sarvasya hridi'],
        keyVerses: [7, 10, 15],
        summary: 'An eternal spark of the divine consciousness animates every body, taking up mind and senses like wind carrying fragrance. Seated in the heart, it provides memory, insight, and vital digestion.',
        transitionNote: 'Krishna unveils the threefold cosmic architecture.'
      },
      {
        id: 'bg15-stage3',
        stageName: 'Purushottama: The Supreme Reality',
        stageNameHi: 'क्षर, अक्षर व पुरुषोत्तम तत्त्व',
        verseRange: '16–20',
        startVerse: 16,
        endVerse: 20,
        coreQuestion: 'What is the highest truth beyond both changing matter and silent spirit?',
        concepts: ['Kshara (Perishable)', 'Akshara (Imperishable)', 'Purushottama (Supreme Person)'],
        keyVerses: [16, 18, 20],
        summary: 'All changing matter is Kshara; the unchanging witness consciousness is Akshara. Transcending both and sustaining all is Purushottama, the Supreme Reality. Knowing this, all duties are fulfilled.',
        transitionNote: 'Chapter 16 examines the psychological attributes that foster or block this realization.'
      }
    ],
    editorialReviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-10-05',
    review: 'approved',
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 16,
    nameEn: 'The Yoga of the Division between Divine and Demonic Destinies',
    nameHi: 'दैवासुरसम्पद्विभागयोग',
    speakers: 'Krishna contrasts divine virtues with narcissistic and destructive impulses; Sanjaya narrates.',
    listeners: 'Arjuna listens as student; Dhritarashtra hears through Sanjaya.',
    speakersList: ['श्रीभगवान् (Krishna)'],
    listenersList: ['अर्जुन (Arjuna)'],
    narrativeContext: 'Krishna provides an uncompromising ethical diagnostic, contrasting the luminous "Divine Estate" (Daivi Sampad)—twenty-six virtues that lead to liberation—with the destructive "Demonic Estate" (Asuri Sampad)—egoism, greed, cruelty, and cynicism that lead to degradation and societal ruin.',
    centralConflict: 'Cultivating selfless, noble, and truthful character versus sliding into cynical materialism, hedonism, and predatory arrogance.',
    mainQuestions: [
      'What are the twenty-six divine qualities that liberate human consciousness?',
      'What are the warning signs and psychological traits of toxic, predatory egoism?',
      'What are the three direct gateways to psychological ruin and self-destruction?'
    ],
    centralQuestion: 'How can a person recognize and guard against self-destructive egoic tendencies while cultivating noble virtues?',
    concepts: ['Dharma', 'Ahimsa', 'Daivi Sampad (Divine virtues)', 'Asuri Sampad (Demonic traits)', 'Tri-vidham narakasya d駆aram (Three gates to ruin)'],
    importantVerses: [
      { verse: 1, note: 'Fearlessness, purity of heart, steadfastness in knowledge, charity, self-control, sacrifice, study of scriptures, austerity, straightforwardness...' },
      { verse: 2, note: 'Non-violence, truthfulness, absence of anger, renunciation, peacefulness, restraint from fault-finding, compassion for all, freedom from greed, gentleness, modesty, absence of fickleness...' },
      { verse: 4, note: 'Hypocrisy, arrogance, conceit, anger, harshness, and ignorance belong to one born of the demonic nature.' },
      { verse: 7, note: 'Those of demonic disposition know neither constructive action nor proper restraint; neither purity, nor good conduct, nor truth is found in them.' },
      { verse: 13, note: 'They boast: "I have gained this today; I will fulfill this desire; this wealth is mine, and more shall be mine tomorrow!"' },
      { verse: 21, note: 'Three are the gates to ruin that destroy the soul: lust (Kama), anger (Krodha), and greed (Lobha); therefore, one must abandon these three.' },
      { verse: 24, note: 'Therefore let scriptural wisdom be your guide in determining what should and should not be done.' }
    ],
    background: 'Practical psychological ethics supporting the metaphysical teachings of Chapter 15.',
    prerequisiteConcepts: ['Dharma', 'Ahimsa'],
    structure: [
      'The twenty-six luminous virtues of the Divine Estate (1–3)',
      'The psychological traits and worldview of the Demonic Estate (4–20)',
      'The three gates to ruin and the necessity of ethical discernment (21–24)'
    ],
    sequence: seq([
      'Chapter 15 described the Purushottama and severed worldly attachment with the axe of dispassion.',
      'Krishna details twenty-six noble qualities that unlock inner peace and liberation.',
      'He gives a chillingly accurate description of narcissistic greed, cynicism, and predatory materialism.',
      'He identifies lust, anger, and greed as the three primary gateways to personal ruin.',
      'Chapter 17 examines how faith, diet, and lifestyle are shaped by nature’s three qualities.'
    ]),
    chapterConclusion: 'Chapter 16 is a timeless moral mirror: it warns against rationalizing cruelty, arrogance, and greed, calling us to fearlessness, truthfulness, and compassion.',
    mapNodes: [
      {
        id: 'bg16-stage1',
        stageName: 'The Twenty-Six Divine Virtues',
        stageNameHi: 'छब्बीस दैवी गुण',
        verseRange: '1–3',
        startVerse: 1,
        endVerse: 3,
        coreQuestion: 'What qualities of heart and mind naturally foster spiritual liberation?',
        concepts: ['Abhayam (Fearlessness)', 'Sattva-samshuddhi (Purity)', 'Ahimsa', 'Satya'],
        keyVerses: [1, 2, 3],
        summary: 'Leading with fearlessness and purity of heart, Krishna lists non-violence, truth, absence of anger, generosity, compassion, and modesty as traits that unlock spiritual growth.',
        transitionNote: 'Krishna consoles Arjuna that he is born with divine traits, before cataloguing their opposite.'
      },
      {
        id: 'bg16-stage2',
        stageName: 'The Anatomy of Toxic Egoism',
        stageNameHi: 'आसुरी प्रवृत्ति का विश्लेषण',
        verseRange: '4–20',
        startVerse: 4,
        endVerse: 20,
        coreQuestion: 'How does unrestrained narcissism and cynicism destroy individuals and societies?',
        concepts: ['Asatyam apratishtham', 'Ahankara', 'Dambha (Hypocrisy)'],
        keyVerses: [4, 7, 13, 20],
        summary: 'Denying moral truth, claiming "the world has no moral foundation and exists only for selfish pleasure," predatory personalities obsess over wealth, domination, and vanity, trapped in self-deceit.',
        transitionNote: 'Krishna isolates the core psychological drivers of this downfall.'
      },
      {
        id: 'bg16-stage3',
        stageName: 'The Three Gateways to Ruin',
        stageNameHi: 'काम, क्रोध व लोभ: नरक के तीन द्वार',
        verseRange: '21–24',
        startVerse: 21,
        endVerse: 24,
        coreQuestion: 'What three impulses must be guarded against at all costs?',
        concepts: ['Kama', 'Krodha', 'Lobha', 'Shastra-pramana'],
        keyVerses: [21, 24],
        summary: 'Lust, anger, and greed are the three trapdoors to self-destruction. One who abandons them acts for the highest welfare, guided by ethical wisdom rather than impulsive whim.',
        transitionNote: 'Arjuna asks in Chapter 17 how ordinary faith operates when people do not study scriptures formally.'
      }
    ],
    editorialReviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-10-06',
    review: 'approved',
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 17,
    nameEn: 'The Yoga of the Threefold Division of Faith',
    nameHi: 'श्रद्धात्रयविभागयोग',
    speakers: 'Arjuna asks about worship conducted with faith without scriptural knowledge; Krishna answers.',
    listeners: 'Arjuna listens as student; Dhritarashtra hears through Sanjaya.',
    speakersList: ['अर्जुन (Arjuna)', 'श्रीभगवान् (Krishna)'],
    listenersList: ['श्रीभगवान् (Krishna)', 'अर्जुन (Arjuna)'],
    narrativeContext: 'Responding to Arjuna’s question about people who worship with genuine faith but without formal scriptural training, Krishna explains that faith (Shraddha) is colored by one’s underlying Gunas. He analyzes how faith, food, worship, austerity, and charity manifest in Sattvic, Rajasic, and Tamasic forms, concluding with the sacred purifying formula: OM TAT SAT.',
    centralConflict: 'Superficial, showy, or superstitious piety versus wholesome, pure, and sincere lifestyle and worship.',
    mainQuestions: [
      'How does an individual’s faith reflect their core psychological disposition?',
      'How do the foods we consume influence our mental clarity, energy, and dullness?',
      'What are genuine austerities of the body, speech, and mind?',
      'What is the spiritual significance of the ancient formula OM TAT SAT?'
    ],
    centralQuestion: 'How do our daily choices in food, speech, charity, and faith shape our spiritual evolution?',
    concepts: ['Shraddha (Faith)', 'Yajna', 'Tapas (Austerity)', 'Ahara (Food)', 'OM TAT SAT'],
    importantVerses: [
      { verse: 3, note: 'The faith of each person conforms to their mental temperament; a person is made of their faith; as one’s faith is, so one is.' },
      { verse: 8, note: 'Foods that promote longevity, vitality, strength, health, happiness, and cheerfulness, which are juicy, wholesome, and pleasing to the heart, are dear to the Sattvic.' },
      { verse: 14, note: 'Worship of the gods, teachers, and the wise, purity, straightforwardness, celibacy, and non-violence—these are the austerity of the body.' },
      { verse: 15, note: 'Speech that causes no distress, is truthful, pleasant, beneficial, and practiced through regular scripture reading—is called the austerity of speech.' },
      { verse: 16, note: 'Serenity of mind, gentleness, silence, self-control, and purity of feeling—this is the austerity of the mind.' },
      { verse: 20, note: 'Charity given to one from whom no return is expected, given in a worthy place, time, and to a deserving person—is considered Sattvic.' },
      { verse: 23, note: 'OM TAT SAT has been declared as the threefold designation of Brahman, by which priests, Vedas, and sacrifices were ordained of old.' }
    ],
    background: 'Addresses everyday living, diet, speech, and generosity.',
    prerequisiteConcepts: ['Yoga', 'Yajna'],
    structure: [
      'The threefold nature of human faith (1–6)',
      'Threefold food: impacts on body, mood, and mind (7–10)',
      'Threefold worship and sacrifice (11–13)',
      'Austerities of body, speech, and mind (14–19)',
      'Threefold charity and the sacred sanctifier OM TAT SAT (20–28)'
    ],
    sequence: seq([
      'Chapter 16 ended by emphasizing the guidance of scriptural wisdom.',
      'Arjuna asks about those who worship sincerely with faith but without book learning.',
      'Krishna explains that every person’s faith reflects their nature, and examines the food, worship, and charity they gravitate toward.',
      'He outlines practical austerities: gentle, truthful speech, peacefulness of mind, and unselfish charity.',
      'Chapter 18 gathers all eighteen chapters into the grand finale of liberation through renunciation.'
    ]),
    chapterConclusion: 'Chapter 17 is a handbook of spiritual hygiene: it shows that spirituality is built in the kitchen, in daily conversation, and in silent acts of unadvertised kindness.',
    mapNodes: [
      {
        id: 'bg17-stage1',
        stageName: 'A Person is Their Faith',
        stageNameHi: 'श्रद्धामयोऽयं पुरुषः: तीन प्रकार की श्रद्धा',
        verseRange: '1–6',
        startVerse: 1,
        endVerse: 6,
        coreQuestion: 'How does our inner temperament shape what we believe and revere?',
        concepts: ['Shraddha', 'Sattviki', 'Rajasi', 'Tamasi'],
        keyVerses: [2, 3],
        summary: 'Faith is not arbitrary; it mirrors the dominant energy in our character. A person is what they place their trust in. Forced, torturous austerities that injure the body are driven by pride, not spirituality.',
        transitionNote: 'Krishna examines how this temperament expresses itself on the dining plate.'
      },
      {
        id: 'bg17-stage2',
        stageName: 'Mindful Nutrition & Threefold Food',
        stageNameHi: 'त्रिविध आहार: भोजन और मनोभाव',
        verseRange: '7–10',
        startVerse: 7,
        endVerse: 10,
        coreQuestion: 'How does our food influence our thoughts and health?',
        concepts: ['Ayuh-sattva-balarogya', 'Katva-amla (Pungent/sour)', 'Yata-yama (Stale)'],
        keyVerses: [8, 9, 10],
        summary: 'Sattvic food is fresh, nourishing, juicy, and soothing to the heart; Rajasic food is excessively spicy, salty, or scorching, causing agitation and disease; Tamasic food is stale, tasteless, or unclean.',
        transitionNote: 'Krishna shifts to the disciplines of body, speech, and mind.'
      },
      {
        id: 'bg17-stage3',
        stageName: 'Tapas of Body, Speech & Mind',
        stageNameHi: 'शरीर, वाणी व मन का तप',
        verseRange: '11–19',
        startVerse: 11,
        endVerse: 19,
        coreQuestion: 'What does genuine austerity look like in modern life?',
        concepts: ['Sharira tapas', 'Vangmaya tapas', 'Manasa tapas'],
        keyVerses: [14, 15, 16],
        summary: 'Austerity of body is cleanliness and non-violence; austerity of speech is speaking words that are true, non-hurtful, agreeable, and beneficial; austerity of mind is serenity, gentleness, and inner silence.',
        transitionNote: 'Krishna concludes with charity and the ultimate seal of sanctity.'
      },
      {
        id: 'bg17-stage4',
        stageName: 'Sattvic Charity & OM TAT SAT',
        stageNameHi: 'सात्त्विक दान व ॐ तत्सत् का रहस्य',
        verseRange: '20–28',
        startVerse: 20,
        endVerse: 28,
        coreQuestion: 'How can any flawed endeavor be purified and consecrated?',
        concepts: ['Datavyam iti (Duty to give)', 'OM TAT SAT', 'Sad-bhava'],
        keyVerses: [20, 23, 28],
        summary: 'Charity given purely out of duty, with respect, to the right person at the right time without expecting return, is Sattvic. Any human imperfection in work or worship is sanctified by the utterance of OM TAT SAT.',
        transitionNote: 'Arjuna asks for the final synthesis of the entire Gita in Chapter 18.'
      }
    ],
    editorialReviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-10-07',
    review: 'approved',
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 18,
    nameEn: 'The Yoga of Liberation through Renunciation',
    nameHi: 'मोक्षसंन्यासयोग',
    speakers: 'Arjuna asks for the ultimate distinction; Krishna delivers the grand synthesis; Sanjaya concludes.',
    listeners: 'Arjuna listens as student and friend; Dhritarashtra hears the whole dialogue close through Sanjaya.',
    speakersList: ['अर्जुन (Arjuna)', 'श्रीभगवान् (Krishna)', 'संजय (Sanjaya)'],
    listenersList: ['श्रीभगवान् (Krishna)', 'अर्जुन (Arjuna)', 'धृतराष्ट्र (Dhritarashtra)'],
    narrativeContext: 'In this climactic finale, Arjuna asks for the definitive distinction between Sannyasa (monastic renunciation of action) and Tyaga (relinquishing attachment to the fruits of action). Krishna synthesizes the entire teaching of the Gita—action, knowledge, agency, authentic vocation, and unconditional surrender—bringing Arjuna to full clarity and readiness to act.',
    centralConflict: 'The debate between physical renunciation versus selfless participation in life, culminating in the surrender of all doubts to the divine will.',
    mainQuestions: [
      'What is the precise difference between Sannyasa and Tyaga?',
      'What are the five factors that cooperate in bringing every human action to fruition?',
      'Why is doing one’s authentic natural work (Svadharma) essential even if accompanied by flaws?',
      'What is the crowning teaching of the entire Bhagavad Gita (Charama Shloka)?'
    ],
    centralQuestion: 'What is the ultimate synthesis of all paths, and how does authentic surrender lead to fearless action in the world?',
    concepts: ['Moksha', 'Sannyasa and Tyaga (Renunciation and Relinquishment)', 'Svadharma', 'Sharanagati (Surrender)', 'Prasada (Grace)'],
    importantVerses: [
      { verse: 2, note: 'Sages understand Sannyasa to be renunciation of desire-driven actions; the wise declare Tyaga to be relinquishment of the fruits of all actions.' },
      { verse: 6, note: 'Even these actions—sacrifice, charity, and austerity—should be performed relinquishing attachment and fruits: this is My definite and best conviction.' },
      { verse: 14, note: 'The five factors of action: the physical body, the doer, the various instruments, the diverse efforts, and the unseen cosmic factor (Daivam).' },
      { verse: 20, note: 'The knowledge by which one sees the one imperishable reality in all diverse beings, undivided in the divided—is Sattvic.' },
      { verse: 37, note: 'That joy which is like poison at first but like nectar in the end, born of the clarity of self-realization—is Sattvic.' },
      { verse: 47, note: 'Better is one’s own duty, though imperfect, than the duty of another well performed; acting in accordance with one’s own nature, one incurs no guilt.' },
      { verse: 48, note: 'One should not abandon work natural to one’s disposition, even if flawed; for all endeavors are covered by imperfection as fire is by smoke.' },
      { verse: 55, note: 'Through devotion one knows Me in truth—who and what I am; having known Me in truth, one enters immediately into the supreme.' },
      { verse: 65, note: 'Fix your mind on Me, be devoted to Me, sacrifice to Me, bow to Me; you shall come to Me alone; this I truly promise you, for you are dear to Me.' },
      { verse: 66, note: 'Abandoning all external duties and dependencies, take refuge in Me alone; I will liberate you from all sorrows; do not grieve!' },
      { verse: 73, note: 'Arjuna said: Destroyed is my delusion, and memory is regained through Your grace, O Infallible One; I stand firm, my doubts dispelled; I will do Your word.' },
      { verse: 78, note: 'Sanjaya said: Wherever is Krishna, the Lord of Yoga, and wherever is Arjuna, the archer, there will certainly be fortune, victory, prosperity, and sound morality.' }
    ],
    background: 'The grand synthesis of all 17 preceding chapters; best read after familiarizing with earlier themes.',
    prerequisiteConcepts: ['Moksha', 'Karma', 'Bhakti', 'Jnana'],
    structure: [
      'The nature of Sannyasa vs Tyaga (1–12)',
      'The five factors of action and overcoming ego-agency (13–18)',
      'Threefold analysis of knowledge, action, actor, intellect, resolve, and joy (19–40)',
      'Svadharma, natural vocation, and sanctification of work (41–48)',
      'From Karma Yoga to supreme knowledge and deep devotion (49–57)',
      'The supreme secret: unconditional refuge and the Charama Shloka (58–66)',
      'Arjuna’s triumphant resolution and Sanjaya’s concluding prophecy (67–78)'
    ],
    sequence: seq([
      'Chapter 17 examined faith, diet, speech, and charity sanctified by OM TAT SAT.',
      'Arjuna asks for the ultimate distinction between Sannyasa and Tyaga.',
      'Krishna defines true renunciation as relinquishing attachment to results while continuing noble work, and analyzes the five factors of action.',
      'He gives his final, most tender instruction: surrender all dependencies and take shelter in the Divine alone, without fear.',
      'Arjuna declares his confusion has vanished and picks up his bow; Sanjaya ends the Mahabharata dialogue with a prophecy of righteousness and victory.'
    ]),
    chapterConclusion: 'Chapter 18 brings the entire epic journey to its triumphant resolution: not by fleeing from life, but by rising in heroic, unselfish duty, grounded in unbroken love and surrender.',
    mapNodes: [
      {
        id: 'bg18-stage1',
        stageName: 'Tyaga vs Sannyasa',
        stageNameHi: 'त्याग व संन्यास का भेद',
        verseRange: '1–12',
        startVerse: 1,
        endVerse: 12,
        coreQuestion: 'Should action itself be abandoned, or only the craving for its fruits?',
        concepts: ['Tyaga', 'Sannyasa', 'Karya-karma'],
        keyVerses: [2, 6, 11],
        summary: 'Abandoning obligatory actions out of fear of physical discomfort is Rajasic. Real renunciation is performing necessary duties faithfully while giving up selfish claims to fruits.',
        transitionNote: 'Krishna explains why no human being can claim to be the sole doer of actions.'
      },
      {
        id: 'bg18-stage2',
        stageName: 'The Five Factors of Action',
        stageNameHi: 'कर्म के पाँच अधिष्ठान',
        verseRange: '13–18',
        startVerse: 13,
        endVerse: 18,
        coreQuestion: 'Who actually accomplishes an action?',
        concepts: ['Adhishthana (Body)', 'Karta (Actor)', 'Karana (Organs)', 'Cheshta (Effort)', 'Daivam (Cosmic factor)'],
        keyVerses: [14, 17],
        summary: 'Every deed requires the physical body, the actor, the instruments, the various energies, and the cosmic factor. One who thinks their isolated ego is the sole doer lacks discernment.',
        transitionNote: 'Krishna categorizes human mental faculties through the three Gunas.'
      },
      {
        id: 'bg18-stage3',
        stageName: 'Threefold Intellect, Resolve & Joy',
        stageNameHi: 'बुद्धि, धृति व सुख के तीन प्रकार',
        verseRange: '19–40',
        startVerse: 19,
        endVerse: 40,
        coreQuestion: 'What kind of happiness and willpower stands the test of time?',
        concepts: ['Sattviki Buddhi', 'Dhriti (Resolve)', 'Amrita-samam sukha'],
        keyVerses: [20, 30, 37],
        summary: 'Sattvic intellect knows what to do and avoid; Sattvic resolve holds mind and senses steady; and Sattvic joy feels like poison initially through discipline, but tastes like pure nectar in the end.',
        transitionNote: 'Krishna relates these qualities to societal functions and authentic vocation.'
      },
      {
        id: 'bg18-stage4',
        stageName: 'Svadharma & Natural Aptitude',
        stageNameHi: 'स्वभावज कर्म व स्वधर्म',
        verseRange: '41–48',
        startVerse: 41,
        endVerse: 48,
        coreQuestion: 'Why should we embrace our authentic calling despite its imperfections?',
        concepts: ['Svabhava-niyata', 'Svadharma', 'Sahajam karma'],
        keyVerses: [45, 47, 48],
        summary: 'Every human temperament has its natural vocational expression. Even if accompanied by defects, one’s own duty is far safer than imitating another’s station, just as all fire produces smoke.',
        transitionNote: 'Krishna shows how work dedicated in this spirit leads directly to supreme peace.'
      },
      {
        id: 'bg18-stage5',
        stageName: 'The Supreme Secret: Sarva-Dharman Parityajya',
        stageNameHi: 'सर्वधर्मान्परित्यज्य: चरम श्लोक व शरणागति',
        verseRange: '49–66',
        startVerse: 49,
        endVerse: 66,
        coreQuestion: 'What is the single most important verse and message of the Bhagavad Gita?',
        concepts: ['Charama Shloka', 'Sharanagati', 'Ma shuchah (Grieve not)'],
        keyVerses: [54, 58, 65, 66],
        summary: 'Having synthesized all yoga, Krishna delivers his ultimate promise: "Relinquishing all contrived dependencies, take refuge in Me alone. I will liberate you from all sorrow; grieve not!"',
        transitionNote: 'Arjuna speaks his final words, and Sanjaya delivers his ecstatic conclusion.'
      },
      {
        id: 'bg18-stage6',
        stageName: 'Delusion Destroyed & Final Victory',
        stageNameHi: 'नष्टो मोहः: संशय-मुक्ति व यत्र योगेश्वरः',
        verseRange: '67–78',
        startVerse: 67,
        endVerse: 78,
        coreQuestion: 'What is the final outcome of the dialogue?',
        concepts: ['Nashto mohah (Delusion destroyed)', 'Smriti-labdha', 'Yatra Yogeshvarah'],
        keyVerses: [73, 78],
        summary: 'Arjuna declares: "My delusion is destroyed; memory has returned through grace; I stand firm, my doubts dispelled; I will act according to your word." Sanjaya prophesies eternal victory wherever wisdom and heroic courage unite.',
        transitionNote: 'The Bhagavad Gita is complete.'
      }
    ],
    editorialReviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-10-08',
    review: 'approved',
  },
  {
    scriptureId: 'ishavasya',
    chapter: 1,
    nameEn: 'Isha Upanishad (Vājasaneyi Saṁhitā Chapter 40)',
    nameHi: 'ईशावास्योपनिषद् (वाजसनेयि-संहिता ४०वां अध्याय)',
    speakers: 'Vedic Ṛṣi of the Shukla Yajurveda.',
    listeners: 'The spiritual seeker discerning the unity of life.',
    speakersList: ['ऋषि (Vedic Seer)'],
    listenersList: ['साधक (Spiritual Seeker)', 'मुमुक्षु (Aspirant for Liberation)'],
    narrativeContext: 'Embedded in the 40th chapter of the Shukla Yajurveda Samhita, this is the foundational Mukhya Upanishad reconciling world engagement, moral action, and non-dual realization.',
    centralConflict: 'The apparent paradox between acting in the temporal world (karma) and realizing formless transcendence (jnana/renunciation).',
    mainQuestions: [
      'How can a person live fully in this world without being chained by selfishness?',
      'What is the true relationship between individual consciousness and the cosmos?',
      'How do knowledge (vidya) and action (avidya) balance each other in daily life?'
    ],
    centralQuestion: 'How can one live an active, hundred-year life while remaining completely free from karmic bondage?',
    concepts: ['Isha (All-pervading Divine)', 'Tyaga (Renunciation)', 'Avidya & Vidya', 'Sambhuti & Asambhuti', 'Atman'],
    importantVerses: [
      { verse: 1, note: 'The supreme declaration of divine presence and renunciation of greed.' },
      { verse: 2, note: 'The call to live an active hundred-year life without bondage.' },
      { verse: 6, note: 'Seeing all beings in the Self dissolves aversion and hatred.' },
      { verse: 11, note: 'The harmonious synthesis of knowledge and selfless ethical duty.' },
      { verse: 15, note: 'The prayer for Truth to uncover its golden veil.' }
    ],
    background: 'The Isha Upanishad is the only primary Upanishad directly part of a Vedic Samhita text, bridging ritual poetry with profound Vedanta philosophy.',
    prerequisiteConcepts: ['Atman', 'Brahman', 'Karma'],
    structure: [
      'The foundational vision of divine all-pervasiveness (1–3)',
      'The nature and paradox of the unmoving Self (4–5)',
      'The psychology of non-dual compassion and freedom from sorrow (6–8)',
      'The synthesis of vidya and avidya, sambhuti and vinasha (9–14)',
      'The concluding prayers to Pushan and Agni for the vision of Truth (15–18)'
    ],
    sequence: seq([
      'Human beings often oscillate between cynical worldliness and escapist asceticism.',
      'How can one engage in life’s demands without falling into possessive greed or spiritual blindness?',
      'All reality is enveloped in the Divine; engage in duty without egoic grasping.',
      'Realizing the one Self in all living beings erases both hatred and sorrow at their roots.',
      'Life and death are integrated into an enduring offering to eternal Truth.'
    ]),
    chapterConclusion: 'The Upanishad concludes with an invocation of humility and surrender: praying to the inner light (Agni) to guide the seeker along the righteous path beyond crooked egoism.',
    mapNodes: [
      {
        id: 'isha-stage1',
        stageName: 'Divine Pervasion & Action',
        stageNameHi: 'ईशा वास्यम् व निष्काम कर्म',
        verseRange: '1–3',
        startVerse: 1,
        endVerse: 3,
        coreQuestion: 'How should one live and work in a constantly changing world?',
        concepts: ['Isha', 'Tyaktena bhunjitha', 'Jijivishet shatam samah'],
        keyVerses: [1, 2],
        summary: 'Everything belongs to the Divine. Work with detachment, aspiring for a vigorous life of service without coveting what belongs to others.',
        transitionNote: 'The seer reveals the paradoxical nature of the underlying consciousness.'
      },
      {
        id: 'isha-stage2',
        stageName: 'The Paradox of Consciousness',
        stageNameHi: 'अनेजदेकम्: चेतना का स्वरूप',
        verseRange: '4–8',
        startVerse: 4,
        endVerse: 8,
        coreQuestion: 'What is the true nature of the Self, and how does seeing it heal human grief?',
        concepts: ['Anejad ekam', 'Sarvabhuta-atma', 'Ekattva (Oneness)'],
        keyVerses: [4, 6, 7],
        summary: 'Unmoving yet faster than the mind, the Self is everywhere. One who beholds all beings within the Self loses all aversion, delusion, and sorrow.',
        transitionNote: 'The teaching examines how one-sided doctrines lead to spiritual blindness.'
      },
      {
        id: 'isha-stage3',
        stageName: 'The Harmonious Synthesis',
        stageNameHi: 'विद्या व अविद्या का समन्वय',
        verseRange: '9–14',
        startVerse: 9,
        endVerse: 14,
        coreQuestion: 'Why are pure ritualism and detached intellectualism both dangerous on their own?',
        concepts: ['Vidya', 'Avidya', 'Sambhuti', 'Vinasha'],
        keyVerses: [11, 14],
        summary: 'Neither blind action without insight nor arid theory without duty brings liberation. Integrating both leads to immortality.',
        transitionNote: 'The seeker offers the ultimate prayer as the manifest world fades.'
      },
      {
        id: 'isha-stage4',
        stageName: 'The Golden Veil & Final Prayer',
        stageNameHi: 'हिरण्मयेन पात्रेण: सत्य की प्रार्थना',
        verseRange: '15–18',
        startVerse: 15,
        endVerse: 18,
        coreQuestion: 'What is the seeker’s final realization at the horizon of life?',
        concepts: ['Hiranmayena patrena', 'So-ham asmi', 'Agne naya supatha'],
        keyVerses: [15, 16, 18],
        summary: 'The seeker asks the solar intelligence to draw back its glittering rays so that Truth may be seen directly: "That Person yonder—I am He."',
        transitionNote: 'The Upanishad concludes in complete serenity.'
      }
    ],
    editorialReviewer: 'Editorial Scripture Team (V. S. Sharma & S. Shastri)',
    reviewDate: '2026-10-09',
    review: 'approved',
  },
];

export function getChapterOrientation(scriptureId: string, chapter: number): ChapterOrientation | undefined {
  return chapterOrientations.find((o) => o.scriptureId === scriptureId && o.chapter === chapter);
}
