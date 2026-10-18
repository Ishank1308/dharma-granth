export interface TopicVerseRef {
  scriptureId: string;
  chapterId?: number;
  verseId?: number | string;
  sanskrit: string;
  transliteration?: string;
  translation: string;
  reference: string;
}

export interface TopicPractice {
  title: string;
  description: string;
}

export interface TopicReflection {
  question: string;
  prompt: string;
}

export interface Topic {
  id: string;
  title: string;
  sanskrit?: string;
  icon: string;
  category: 'career' | 'wellbeing' | 'relationships' | 'lifestyle' | 'society' | 'emotions';
  shortDesc: string;
  description: string;
  gradient: string;
  verses: TopicVerseRef[];
  teachings: string[];
  practices: TopicPractice[];
  reflections: TopicReflection[];
  relatedConcepts: string[];
}

export const topicCategories: {
  key: Topic['category'];
  label: string;
  gradient: string;
}[] = [
  { key: 'career', label: 'Career & Work', gradient: 'from-blue-500 to-indigo-600' },
  { key: 'wellbeing', label: 'Wellbeing', gradient: 'from-emerald-500 to-teal-600' },
  { key: 'relationships', label: 'Relationships', gradient: 'from-rose-500 to-pink-600' },
  { key: 'lifestyle', label: 'Lifestyle', gradient: 'from-amber-500 to-orange-600' },
  { key: 'society', label: 'Society', gradient: 'from-violet-500 to-purple-600' },
  { key: 'emotions', label: 'Emotions', gradient: 'from-red-500 to-rose-600' },
];

export const topics: Topic[] = [
  {
    id: 'career-workplace-ethics',
    title: 'Career & Workplace Ethics',
    sanskrit: 'कर्म योग',
    icon: '💼',
    category: 'career',
    shortDesc: 'How to work with integrity, purpose, and detachment from results.',
    description:
      'The Bhagavad Gita teaches Karma Yoga — the path of selfless action. In today\'s workplace, this means performing your duties with excellence, integrity, and without obsessive attachment to outcomes like promotions or recognition. When you focus on the work itself rather than the reward, you find flow, reduce anxiety, and naturally produce better results.',
    gradient: 'from-blue-500 to-indigo-600',
    verses: [
      {
        scriptureId: 'bhagavadgita',
        chapterId: 2,
        verseId: 47,
        sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
        transliteration: 'karmaṇy-evādhikāras te mā phaleṣhu kadāchana |\nmā karma-phala-hetur bhūr mā te saṅgo ’stvakarmaṇi ||',
        translation: 'You have a right to perform your prescribed duties, but never to the fruits of action.',
        reference: 'Bhagavad Gita 2.47',
      },
      {
        scriptureId: 'bhagavadgita',
        chapterId: 3,
        verseId: 19,
        sanskrit: 'तस्मादसक्तः सततं कार्यं कर्म समाचर ।\nअसक्तो ह्याचरन्कर्म परमाप्नोति पूरुषः ॥',
        transliteration: 'tasmād asaktaḥ satataṁ kāryaṁ karma samāchara |\nasakto hyācharan karma param āpnoti pūruṣhaḥ ||',
        translation: 'Therefore, without attachment, always perform your duty, for by working without attachment one attains the Supreme.',
        reference: 'Bhagavad Gita 3.19',
      },
      {
        scriptureId: 'bhagavadgita',
        chapterId: 16,
        verseId: 1,
        sanskrit: 'श्री भगवानुवाच ।\nअभयं सत्त्वसंशुद्धिः ज्ञानयोगव्यवस्थितिः ।\nदानं दमश्च यज्ञश्च स्वाध्यायस्तप आर्जवम् ॥',
        transliteration: 'śhrī-bhagavān uvācha |\nabhayaṁ sattva-sanśhuddhir jñāna-yoga-vyavasthitiḥ |\ndānaṁ damaśh cha yajñaśh cha svādhyāyas tapa ārjavam ||',
        translation: 'Fearlessness, purity of heart, steadfastness in knowledge and yoga — these are divine qualities.',
        reference: 'Bhagavad Gita 16.1',
      },
    ],
    teachings: [
      'Focus on the quality of your work, not on the reward it brings. Excellence becomes its own satisfaction.',
      'Act with integrity even when no one is watching. The Gita calls this performing actions as an offering, not for personal gain.',
      'Do not avoid difficult responsibilities. Running from duty is worse than imperfect action.',
      'Treat colleagues with respect regardless of hierarchy — the same divine spark (Atman) dwells in all.',
      'When faced with ethical dilemmas, choose dharma (righteousness) over convenience. "Better to fail in one\'s own dharma than succeed in another\'s" (Gita 3.35).',
    ],
    practices: [
      { title: 'Process Over Outcome', description: 'Before starting a major task, set an intention: "I will focus on doing this well, not on what I\'ll get from it." Review your effort, not just the result.' },
      { title: 'Daily Integrity Check', description: 'At the end of each workday, ask: "Did I cut any corners today? Did I act honestly even when it was inconvenient?"' },
      { title: 'Seva at Work', description: 'Reframe your job as service. Whether you write code, teach, or manage — see your work as contributing to others\' wellbeing, not just earning a paycheck.' },
    ],
    reflections: [
      { question: 'What drives my career?', prompt: 'Am I working primarily for money and status, or for the satisfaction of doing something meaningful? How would my work change if I treated it as karma yoga?' },
      { question: 'Where do I compromise?', prompt: 'Think of a recent situation where I chose convenience over integrity. What would the "divine qualities" of Gita 16 have guided me to do instead?' },
    ],
    relatedConcepts: ['karma', 'karma-yoga', 'dharma'],
  },
  {
    id: 'stress-anxiety',
    title: 'Stress & Anxiety',
    sanskrit: 'शमः',
    icon: '🧘',
    category: 'wellbeing',
    shortDesc: 'Ancient tools for calming the restless mind and finding inner stillness.',
    description:
      'The Gita addresses Arjuna\'s paralyzing anxiety on the battlefield — a situation not unlike the overwhelming stress modern life brings. Krishna\'s counsel combines practical action with philosophical perspective: do your part, surrender the rest, and remember that the Self within is untouched by external turbulence. The Yoga Sutras add systematic techniques for quieting the mind.',
    gradient: 'from-emerald-500 to-teal-600',
    verses: [
      {
        scriptureId: 'bhagavadgita',
        chapterId: 2,
        verseId: 48,
        sanskrit: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ॥',
        transliteration: 'yoga-sthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya |\nsiddhy-asiddhyoḥ samo bhūtvā samatvaṁ yoga uchyate ||',
        translation: 'Equanimity of mind is called yoga. Perform your duty abandoning attachment, and remain even-minded in success and failure.',
        reference: 'Bhagavad Gita 2.48',
      },
      {
        scriptureId: 'bhagavadgita',
        chapterId: 6,
        verseId: 5,
        sanskrit: 'उद्धरेदात्मनाऽऽत्मानं नात्मानमवसादयेत् ।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ॥',
        transliteration: 'uddhared ātmanātmānaṁ nātmānam avasādayet |\nātmaiva hyātmano bandhur ātmaiva ripur ātmanaḥ ||',
        translation: 'Lift yourself by your own Self; do not degrade yourself. The Self alone is the friend of the self, and the Self alone is its enemy.',
        reference: 'Bhagavad Gita 6.5',
      },
      {
        scriptureId: 'bhagavadgita',
        chapterId: 6,
        verseId: 6,
        sanskrit: 'बन्धुरात्माऽऽत्मनस्तस्य येनात्मैवात्मना जितः ।\nअनात्मनस्तु शत्रुत्वे वर्तेतात्मैव शत्रुवत् ॥',
        transliteration: 'bandhur ātmātmanas tasya yenātmaivātmanā jitaḥ |\nanātmanas tu śhatrutve vartetātmaiva śhatru-vat ||',
        translation: 'For the one who has conquered the mind, the Self is the friend; but for the unconquered mind, the Self remains hostile.',
        reference: 'Bhagavad Gita 6.6',
      },
    ],
    teachings: [
      'Anxiety arises from attachment to outcomes you cannot control. Shift focus to what is in your hands — your effort — and let go of the rest.',
      'Equanimity (samatva) is not suppressing emotion but meeting both success and failure with the same steady mind.',
      'The mind can be your greatest friend or worst enemy. Train it through consistent practice (abhyāsa) and detachment (vairāgya).',
      'Remember your true nature: the Atman is eternal and untouched by any external event. No failure, rejection, or loss can harm what you truly are.',
      'When overwhelmed, Krishna advises: bring the mind back, again and again. It will wander; your job is simply to return.',
    ],
    practices: [
      { title: 'Equanimity Pause', description: 'When stress spikes, pause for 30 seconds. Breathe slowly and say internally: "I control my effort, not the outcome. I meet this with a steady mind."' },
      { title: 'Mind-Training (Abhyāsa)', description: 'Set a timer for 5 minutes daily. Sit quietly and observe the breath. When the mind wanders — and it will — gently bring it back. This is the core practice Krishna recommends in Chapter 6.' },
      { title: 'Worry Audit', description: 'Write down everything causing anxiety. Next to each, mark "in my control" or "not in my control." Focus your energy only on the first column.' },
    ],
    reflections: [
      { question: 'What am I attached to?', prompt: 'What specific outcome am I afraid of losing? If I let go of that attachment and focused only on doing my best, how would my stress level change?' },
      { question: 'Friend or enemy?', prompt: 'Has my mind been my friend or my enemy today? What one practice could I start to train it toward being an ally?' },
    ],
    relatedConcepts: ['samatva', 'vairagya', 'dhyana', 'atman'],
  },
  {
    id: 'relationships-marriage',
    title: 'Relationships & Marriage',
    sanskrit: 'स्नेहः',
    icon: '❤️',
    category: 'relationships',
    shortDesc: 'Wisdom on love, partnership, and seeing the divine in each other.',
    description:
      'Hindu scriptures see relationships as a sacred bond (sanskāra) — not merely a contract but a spiritual partnership. The Gita teaches seeing the same Atman in all beings, which transforms how we treat our partner. The Upanishads describe the union of two souls as a reflection of the cosmic unity. Love, when freed from possessiveness, becomes a path to the divine.',
    gradient: 'from-rose-500 to-pink-600',
    verses: [
      {
        scriptureId: 'bhagavadgita',
        chapterId: 6,
        verseId: 29,
        sanskrit: 'सर्वभूतस्थमात्मानं सर्वभूतानि चात्मनि ।\nईक्षते योगयुक्तात्मा सर्वत्र समदर्शनः ॥',
        transliteration: 'sarva-bhūta-stham ātmānaṁ sarva-bhūtāni chātmani |\nīkṣhate yoga-yuktātmā sarvatra sama-darśhanaḥ ||',
        translation: 'The one established in yoga sees the Self in all beings and all beings in the Self.',
        reference: 'Bhagavad Gita 6.29',
      },
      {
        scriptureId: 'bhagavadgita',
        chapterId: 13,
        verseId: 28,
        sanskrit: 'समं सर्वेषु भूतेषु तिष्ठन्तं परमेश्वरम्।विनश्यत्स्वविनश्यन्तं यः पश्यति स पश्यति ॥',
        transliteration: 'samaṁ sarveṣhu bhūteṣhu tiṣhṭhantaṁ parameśhvaram |\nvinaśhyatsv avinaśhyantaṁ yaḥ paśhyati sa paśhyati ||',
        translation: 'One who sees the Supreme Lord dwelling equally in all beings does not destroy the Self by the self — and thus attains the supreme goal.',
        reference: 'Bhagavad Gita 13.28',
      },
      {
        scriptureId: 'brihadaranyaka',
        sanskrit: 'यथा पूर्वं तथा परम्',
        transliteration: 'yathā pūrvaṃ tathā param',
        translation: 'As before, so after — the bond that unites two souls is eternal, a reflection of the unity that underlies all existence.',
        reference: 'Brihadaranyaka Upanishad 2.4.7',
      },
    ],
    teachings: [
      'See your partner as a manifestation of the same divine Self that dwells in you. This dissolves the hierarchy of "me first."',
      'Love without possessiveness is the highest form. Attachment (moha) creates suffering; genuine love (prema) liberates.',
      'A relationship is a partnership of growth — two people helping each other on the path of dharma, not just emotional gratification.',
      'Practice patience and forgiveness. The Gita lists forbearance (kṣamā) among the divine qualities that elevate a person.',
      'Communication rooted in truthfulness (satya) and non-violence (ahiṃsā) builds trust. Speak honestly but never to wound.',
    ],
    practices: [
      { title: 'Divine Seeing', description: 'Before a difficult conversation with your partner, take a moment to see them not as "my spouse" but as a soul on their own journey. How does this shift your tone?' },
      { title: 'Gratitude Offering', description: 'Each morning, silently acknowledge one thing your partner does that you take for granted. This cultivates appreciation rather than entitlement.' },
      { title: 'Truthful Speech', description: 'For one week, practice speaking only what is true, kind, and necessary in your relationship. Notice the difference in connection.' },
    ],
    reflections: [
      { question: 'Love or attachment?', prompt: 'When I feel upset with my partner, is it because they violated my needs, or because I\'m attached to a specific outcome? How would love without possessiveness respond?' },
      { question: 'Do I see the divine in them?', prompt: 'When was the last time I truly saw my partner as a soul, not just as someone fulfilling a role? What would change if I treated them as a manifestation of the same Self?' },
    ],
    relatedConcepts: ['bhakti', 'ahimsa', 'satya', 'atman'],
  },
  {
    id: 'parenting',
    title: 'Parenting',
    sanskrit: 'वात्सल्यम्',
    icon: '👨‍👩‍👧',
    category: 'relationships',
    shortDesc: 'Raising children with wisdom, love, and non-attachment to their choices.',
    description:
      'Parenting is considered one of life\'s sacred duties (dharma) in Hindu thought. The scriptures teach that children are not possessions but souls entrusted to your care. Your role is to guide, nurture, and model dharma — then release them to walk their own path. The Gita\'s teaching on detached action applies profoundly: raise them with love, but do not bind them to your expectations.',
    gradient: 'from-rose-500 to-pink-600',
    verses: [
      {
        scriptureId: 'bhagavadgita',
        chapterId: 3,
        verseId: 35,
        sanskrit: 'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात् ।\nस्वधर्मे निधनं श्रेयः परधर्मो भयावहः ॥',
        transliteration: 'śhreyān swa-dharmo viguṇaḥ para-dharmāt sv-anuṣhṭhitāt |\nswa-dharme nidhanaṁ śhreyaḥ para-dharmo bhayāvahaḥ ||',
        translation: 'Better is one\'s own dharma though imperfectly performed than the dharma of another well performed.',
        reference: 'Bhagavad Gita 3.35',
      },
      {
        scriptureId: 'bhagavadgita',
        chapterId: 17,
        verseId: 15,
        sanskrit: 'अनुद्वेगकरं वाक्यं सत्यं प्रियहितं च यत्।स्वाध्यायाभ्यसनं चैव वाङ्मयं तप उच्यते ॥',
        transliteration: 'anudvega-karaṁ vākyaṁ satyaṁ priya-hitaṁ cha yat |\nsvādhyāyābhyasanaṁ chaiva vāṅ-mayaṁ tapa uchyate ||',
        translation: 'Speech that does not cause distress, that is truthful, pleasant, and beneficial — that is the austerity of speech.',
        reference: 'Bhagavad Gita 17.15',
      },
      {
        scriptureId: 'bhagavadgita',
        chapterId: 5,
        verseId: 18,
        sanskrit: 'विद्याविनयसंपन्ने ब्राह्मणे गवि हस्तिनि ।\nशुनि चैव श्वपाके च पण्डिताः समदर्शिनः ॥',
        transliteration: 'vidyā-vinaya-sampanne brāhmaṇe gavi hastini |\nśhuni chaiva śhva-pāke cha paṇḍitāḥ sama-darśhinaḥ ||',
        translation: 'The wise see the same Self in a learned Brahmin, a cow, an elephant, a dog, and an outcaste — equanimity of vision.',
        reference: 'Bhagavad Gita 5.18',
      },
    ],
    teachings: [
      'Children are souls on their own karmic journey, not extensions of your ego. Guide them, but do not impose your unfulfilled dreams.',
      'Each child has their own svadharma (personal calling). "Better to fail in one\'s own dharma than succeed in another\'s" — help them find their path, not yours.',
      'Discipline through example, not just instruction. Children learn more from what you do than what you say.',
      'Speak to children with the same care the Gita prescribes: truthful, pleasant, beneficial, and non-distressing.',
      'Practice loving detachment. Care deeply, act wisely, but do not bind your happiness to their choices.',
    ],
    practices: [
      { title: 'See Their Dharma', description: 'Observe your child\'s natural inclinations without judgment. What activities make them come alive? Support those, even if they differ from what you envisioned.' },
      { title: 'Model, Don\'t Lecture', description: 'Choose one quality you want to instill (honesty, patience, generosity). Practice it visibly for a week. Let them see you doing it, not just telling them to.' },
      { title: 'Release the Outcome', description: 'After making a thoughtful parenting decision, say internally: "I have done my duty with love. The result is not mine to control." This prevents anxiety-driven overparenting.' },
    ],
    reflections: [
      { question: 'Whose dream am I living?', prompt: 'Am I guiding my child toward their own path or trying to fulfill my own unmet ambitions through them? What would change if I truly honored their svadharma?' },
      { question: 'How do I speak to them?', prompt: 'Does my speech to my children meet the Gita\'s standard — truthful, pleasant, beneficial, non-distressing? Where could I improve?' },
    ],
    relatedConcepts: ['dharma', 'karma', 'ahimsa', 'satya'],
  },
  {
    id: 'student-life',
    title: 'Student Life',
    sanskrit: 'ब्रह्मचर्यम्',
    icon: '📚',
    category: 'lifestyle',
    shortDesc: 'Discipline, focus, and the art of learning from the guru-shishya tradition.',
    description:
      'In the Vedic tradition, the student stage (brahmacarya āśrama) is the foundation of life — a time for disciplined learning, self-restraint, and reverence for knowledge. The Upanishads depict students sitting at the feet of teachers, asking questions, and pursuing truth. The Gita\'s teaching on consistent practice (abhyāsa) and the Yoga Sutras\' methods for focus are directly applicable to modern students facing distractions.',
    gradient: 'from-amber-500 to-orange-600',
    verses: [
      {
        scriptureId: 'bhagavadgita',
        chapterId: 4,
        verseId: 38,
        sanskrit: 'न हि ज्ञानेन सदृशं पवित्रमिह विद्यते ।\nतत्स्वयं योगसंसिद्धः कालेनात्मनि विन्दति ॥',
        transliteration: 'na hi jñānena sadṛiśhaṁ pavitramiha vidyate |\ntatsvayaṁ yogasansiddhaḥ kālenātmani vindati ||',
        translation: 'There is nothing in this world as purifying as knowledge. One who is purified by knowledge attains perfection in due time.',
        reference: 'Bhagavad Gita 4.38',
      },
      {
        scriptureId: 'bhagavadgita',
        chapterId: 6,
        verseId: 35,
        sanskrit: 'श्री भगवानुवाच ।\nअसंशयं महाबाहो मनो दुर्निग्रहं चलं ।\nअभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते ॥',
        transliteration: 'śhrī bhagavān uvācha |\nasanśhayaṁ mahā-bāho mano durnigrahaṁ chalam |\nabhyāsena tu kaunteya vairāgyeṇa cha gṛihyate ||',
        translation: 'The restless mind is undoubtedly difficult to control, but it can be controlled through practice (abhyāsa) and detachment (vairāgya).',
        reference: 'Bhagavad Gita 6.35',
      },
      {
        scriptureId: 'taittiriya',
        sanskrit: 'आचार्यादेव विद्या विद्या चाचार्याद्धम्',
        transliteration: 'ācāryādeva vidyā vidyā cācāryāddham',
        translation: 'From the teacher comes learning; from learning, understanding. Approach knowledge with reverence and humility.',
        reference: 'Taittiriya Upanishad 1.1',
      },
    ],
    teachings: [
      'Knowledge is the supreme purifier. No ritual or offering is as purifying as the pursuit of wisdom.',
      'Focus is a trainable skill. The mind will wander — that is its nature — but through consistent practice (abhyāsa), you can bring it back.',
      'Approach learning with humility. The Upanishads teach that the student approaches the teacher with reverence and an open mind.',
      'Detachment from results applies to exams too. Study deeply for the love of understanding, not just for grades.',
      'Discipline (tapas) is not punishment but joyful self-mastery. The energy you save by avoiding distraction becomes fuel for learning.',
    ],
    practices: [
      { title: 'Single-Task Study', description: 'Study in 25-minute blocks with your phone in another room. This is modern abhyāsa — training the mind to stay with one task.' },
      { title: 'Learn to Understand', description: 'After reading a chapter, close the book and explain the core idea in your own words. If you can\'t, you memorized without understanding.' },
      { title: 'Reverence Ritual', description: 'Before studying, take 30 seconds to set an intention: "I approach this learning with respect and openness." This shifts you from passive consumption to active engagement.' },
    ],
    reflections: [
      { question: 'Why am I learning?', prompt: 'Am I studying only for grades and credentials, or do I genuinely want to understand? How would my approach change if I treated knowledge as the Gita does — as purifying and sacred?' },
      { question: 'How is my focus?', prompt: 'When I study, how often does my mind wander? What one practice from the Gita\'s teaching on abhyāsa could I start tomorrow?' },
    ],
    relatedConcepts: ['jnana', 'viveka', 'tapas', 'abhyasa'],
  },
  {
    id: 'social-media-addiction',
    title: 'Social Media Addiction',
    sanskrit: 'मोहः',
    icon: '📱',
    category: 'lifestyle',
    shortDesc: 'Breaking free from the cycle of craving, comparison, and digital distraction.',
    description:
      'The Gita\'s analysis of desire and attachment maps directly onto modern digital addiction. Krishna explains how constant contact with sense objects creates attachment (rāga), which leads to craving (kāma), which becomes anger and frustration when unfulfilled (krodha). Social media is engineered to trigger this exact cycle. The Yoga Sutras offer practical tools for cultivating mastery over impulses.',
    gradient: 'from-amber-500 to-orange-600',
    verses: [
      {
        scriptureId: 'bhagavadgita',
        chapterId: 2,
        verseId: 62,
        sanskrit: 'ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते ।\nसङ्गात् संजायते कामः कामात्क्रोधोऽभिजायते ॥',
        transliteration: 'dhyāyato viṣhayān puṁsaḥ saṅgas teṣhūpajāyate |\nsaṅgāt sañjāyate kāmaḥ kāmāt krodho ’bhijāyate ||',
        translation: 'While contemplating sense objects, attachment develops. From attachment comes desire; from desire comes anger.',
        reference: 'Bhagavad Gita 2.62',
      },
      {
        scriptureId: 'bhagavadgita',
        chapterId: 2,
        verseId: 70,
        sanskrit: 'आपूर्यमाणमचलप्रतिष्ठं ।\nसमुद्रमापः प्रविशन्ति यद्वत् ।\nतद्वत्कामा यं प्रविशन्ति सर्वे ।\nस शान्तिमाप्नोति न कामकामी ॥',
        transliteration: 'āpūryamāṇam achala-pratiṣhṭhaṁ |\nsamudram āpaḥ praviśhanti yadvat |\ntadvat kāmā yaṁ praviśhanti sarve |\nsa śhāntim āpnoti na kāma-kāmī ||',
        translation: 'As rivers flow into the ocean without disturbing its stillness, so desires flow into a person of steady wisdom — they find peace, not the seeker of desires.',
        reference: 'Bhagavad Gita 2.70',
      },
      {
        scriptureId: 'bhagavadgita',
        chapterId: 7,
        verseId: 11,
        sanskrit: 'बलं बलवतां चाहं कामरागविवर्जितम् ।\nधर्माविरुद्धो भूतेषु कामोऽस्मि भरतर्षभ ॥',
        transliteration: 'balaṁ balavatāṁ chāhaṁ kāma-rāga-vivarjitam |\ndharmāviruddho bhūteṣhu kāmo ’smi bharatarṣhabha ||',
        translation: 'I am the strength of the strong, free from desire and attachment — the strength that is not driven by craving.',
        reference: 'Bhagavad Gita 7.11',
      },
    ],
    teachings: [
      'The Gita maps the addiction cycle: contemplation → attachment → desire → anger → delusion → loss of judgment. Social media is designed to trigger this exact chain.',
      'Constant exposure to sense stimuli strengthens attachment. Reducing contact with the trigger is the first step — not willpower, but environment design.',
      'True strength is not the ability to resist temptation while immersed in it, but the wisdom to limit exposure in the first place.',
      'The person of steady wisdom (sthitaprajña) is not free from desires entering their mind, but desires do not disturb their stillness. Be the ocean, not the rivers.',
      'Comparison is the root of social media suffering. The Gita teaches equanimity — neither elated by praise nor crushed by comparison.',
    ],
    practices: [
      { title: 'Digital Vairāgya', description: 'Remove social media apps from your phone for one week. Notice the withdrawal, the reflexive reaching. This awareness itself is the beginning of detachment.' },
      { title: 'Conscious Consumption', description: 'Before opening a feed, ask: "What am I seeking right now?" If the answer is boredom, anxiety, or loneliness, address that directly instead of numbing it.' },
      { title: 'Ocean Practice', description: 'When you feel the pull to scroll, pause and visualize yourself as the ocean — desires are rivers that flow in but do not disturb your depth.' },
    ],
    reflections: [
      { question: 'What am I really seeking?', prompt: 'When I reach for my phone to scroll, what feeling am I trying to escape? What would happen if I sat with that feeling for two minutes instead?' },
      { question: 'Am I the ocean or the rivers?', prompt: 'Do desires and impulses disturb my peace, or do I remain steady like the ocean receiving rivers? What would help me deepen?' },
    ],
    relatedConcepts: ['moha', 'raga', 'kama', 'vairagya'],
  },
  {
    id: 'money-responsible-wealth',
    title: 'Money & Responsible Wealth',
    sanskrit: 'अर्थः',
    icon: '💰',
    category: 'lifestyle',
    shortDesc: 'Earning, saving, and giving with wisdom — wealth as a tool, not a master.',
    description:
      'Hindu thought does not condemn wealth — Artha (prosperity) is one of the four legitimate aims of life (purushārthas). The issue is not money itself but attachment to it. The Gita teaches that wealth should flow through you, not stagnate. The tradition of dāna (charitable giving) is not optional generosity but a duty — a recognition that all wealth ultimately belongs to the divine and is entrusted to you for the welfare of all.',
    gradient: 'from-amber-500 to-orange-600',
    verses: [
      {
        scriptureId: 'bhagavadgita',
        chapterId: 3,
        verseId: 12,
        sanskrit: 'देवान्भावयतानेन ते देवा भावयन्तु वः',
        transliteration: 'devānbhāvayatānena te devā bhāvayantu vaḥ',
        translation: 'With this sacrifice, nourish the gods; let the gods nourish you. Nourishing one another, you shall attain the highest good.',
        reference: 'Bhagavad Gita 3.12',
      },
      {
        scriptureId: 'bhagavadgita',
        chapterId: 17,
        verseId: 20,
        sanskrit: 'दातव्यमिति यद्दानं दीयतेऽनुपकारिणे।देशे काले च पात्रे च तद्दानं सात्त्विकं स्मृतम् ॥',
        transliteration: 'dātavyam iti yad dānaṁ dīyate ‘nupakāriṇe |\ndeśhe kāle cha pātre cha tad dānaṁ sāttvikaṁ smṛitam ||',
        translation: 'Charity given as a duty, to one who cannot return the favor, at the proper place and time — that is pure (sāttvic) giving.',
        reference: 'Bhagavad Gita 17.20',
      },
      {
        scriptureId: 'bhagavadgita',
        chapterId: 9,
        verseId: 27,
        sanskrit: 'यत्करोषि यदश्नासि यज्जुहोषि ददासि यत् ।\nयत्तपस्यसि कौन्तेय तत्कुरुष्व मदर्पणम् ॥',
        transliteration: 'yat karoṣhi yad aśhnāsi yaj juhoṣhi dadāsi yat |\nyat tapasyasi kaunteya tat kuruṣhva mad-arpaṇam ||',
        translation: 'Whatever you do, whatever you eat, whatever you offer, whatever you give — do it as an offering to Me.',
        reference: 'Bhagavad Gita 9.27',
      },
    ],
    teachings: [
      'Wealth is not the problem — attachment to wealth is. Earn honestly, spend wisely, give generously, and hold it loosely.',
      'The cycle of prosperity: you earn, you give (dāna), the giving sustains society, society sustains you. Hoarding breaks this cycle.',
      'Pure charity is given as a duty, without expectation of return, to those who cannot repay you. It is not philanthropy for recognition.',
      'See your wealth as entrusted to you by the divine. You are a steward, not an owner. This shift dissolves anxiety about money.',
      'The Gita classifies giving: sāttvic (pure, duty-based, no expectation), rājasic (for recognition or return), tāmasic (given contemptuously). Strive for the first.',
    ],
    practices: [
      { title: 'Percentage Practice', description: 'Commit to giving a fixed percentage of your income regularly — before spending on anything else. This makes dāna a habit, not an afterthought.' },
      { title: 'Wealth as Offering', description: 'Before paying bills or making purchases, mentally offer the action: "This is done as service." This transforms mundane transactions into spiritual practice.' },
      { title: 'Attachment Audit', description: 'Review your financial decisions this month. Which were driven by need, which by comparison or fear? Awareness is the first step to loosening attachment.' },
    ],
    reflections: [
      { question: 'Owner or steward?', prompt: 'Do I treat my wealth as mine to hoard, or as something entrusted to me for the welfare of all? How would my spending change if I truly saw myself as a steward?' },
      { question: 'How do I give?', prompt: 'Is my giving sāttvic — done as duty, without expectation of return? Or do I give for recognition, tax benefits, or social standing?' },
    ],
    relatedConcepts: ['artha', 'dana', 'raga', 'dharma'],
  },
  {
    id: 'leadership',
    title: 'Leadership',
    sanskrit: 'नेतृत्वम्',
    icon: '👑',
    category: 'society',
    shortDesc: 'Leading with dharma, serving those you lead, and acting as an instrument of the divine.',
    description:
      'The Bhagavad Gita is fundamentally a text about leadership — Krishna counsels Arjuna, a warrior-prince paralyzed by indecision. The Gita\'s model of leadership is servant leadership: the leader acts not for personal glory but as an instrument of dharma. The Ramayana\'s Rama exemplifies this — putting duty above personal desire. True leadership in the Hindu tradition is about lifting others, not elevating oneself.',
    gradient: 'from-violet-500 to-purple-600',
    verses: [
      {
        scriptureId: 'bhagavadgita',
        chapterId: 3,
        verseId: 21,
        sanskrit: 'यद्यदाचरति श्रेष्ठस्तत्तदेवेतरो जनः ।\nस यत्प्रमाणं कुरुते लोकस्तदनुवर्तते ॥',
        transliteration: 'yad yad ācharati śhreṣhṭhas tat tad evetaro janaḥ |\nsa yat pramāṇaṁ kurute lokas tad anuvartate ||',
        translation: 'Whatever the superior person does, others follow. Whatever standard they set, the world pursues.',
        reference: 'Bhagavad Gita 3.21',
      },
      {
        scriptureId: 'bhagavadgita',
        chapterId: 3,
        verseId: 22,
        sanskrit: 'न मे पार्थास्ति कर्तव्यं त्रिषु लोकेषु किञ्चन ।\nनानवाप्तमवाप्तव्यं वर्त एव च कर्मणि ॥',
        transliteration: 'na me pārthāsti kartavyaṁ triṣhu lokeṣhu kiñchana |\nnānavāptam avāptavyaṁ varta eva cha karmaṇi ||',
        translation: 'There is nothing in the three worlds that I need to do, nothing unattained that needs attaining — yet I engage in action.',
        reference: 'Bhagavad Gita 3.22',
      },
      {
        scriptureId: 'bhagavadgita',
        chapterId: 11,
        verseId: 33,
        sanskrit: 'तस्मात्त्वमुत्तिष्ठ यशो लभस्व ।\nजित्वा शत्रून् भुङ्क्ष्व राज्यं समृद्धम् ।\nमयैवैते निहताः पूर्वमेव ।\nनिमित्तमात्रं भव सव्यसाचिन् ॥',
        transliteration: 'tasmāt tvam uttiṣhṭha yaśho labhasva |\njitvā śhatrūn bhuṅkṣhva rājyaṁ samṛiddham |\nmayaivaite nihatāḥ pūrvam eva |\nnimitta-mātraṁ bhava savya-sāchin ||',
        translation: 'Therefore, arise! Gain glory! Having conquered your enemies, enjoy a prosperous kingdom — by Me alone have they been slain already.',
        reference: 'Bhagavad Gita 11.33',
      },
    ],
    teachings: [
      'Leaders set the standard by their own conduct, not by their commands. "Whatever the superior person does, others follow."',
      'The highest leader acts not from need but from dharma. Krishna says he needs nothing, yet acts — because leadership is duty, not ambition.',
      'See yourself as an instrument (nimitta), not the cause. This frees you from both the burden of ego and the paralysis of self-doubt.',
      'A dharmic leader prioritizes the welfare of those they lead over their own comfort. Rama abandoned his throne to honor a promise — duty above desire.',
      'Lead by empowering, not controlling. The best leaders make those around them capable and confident.',
    ],
    practices: [
      { title: 'Instrument Mindset', description: 'Before a leadership decision, say internally: "I am an instrument of dharma, not the doer." This reduces ego-driven decisions and anxiety about outcomes.' },
      { title: 'Set the Standard', description: 'Identify one behavior you want to see in your team. Practice it visibly and consistently for two weeks before asking others to adopt it.' },
      { title: 'Welfare First', description: 'In your next decision, ask: "Does this serve those I lead, or does it serve my ego?" Choose accordingly.' },
    ],
    reflections: [
      { question: 'Why do I lead?', prompt: 'Am I leading for personal glory and power, or because it is my dharma? How would my leadership change if I truly saw myself as an instrument?' },
      { question: 'What standard do I set?', prompt: 'If my team did exactly what I do (not what I say), would that produce the culture I want? Where is there a gap?' },
    ],
    relatedConcepts: ['dharma', 'karma-yoga', 'ishvara'],
  },
  {
    id: 'environmental-responsibility',
    title: 'Environmental Responsibility',
    sanskrit: 'पृथ्वी',
    icon: '🌍',
    category: 'society',
    shortDesc: 'Seeing the Earth as divine and caring for nature as a sacred duty.',
    description:
      'Hindu scriptures revere nature as a manifestation of the divine. The Atharva Veda calls the Earth "Mother," and the Upanishads identify the elements with cosmic principles. The Gita teaches that the universe is an interconnected web sustained by sacrifice (yajña) — mutual nourishment. Environmental destruction is not just a practical problem but a spiritual one: it violates the sacred order (ṛta) and the principle of interconnectedness.',
    gradient: 'from-violet-500 to-purple-600',
    verses: [
      {
        scriptureId: 'bhagavadgita',
        chapterId: 3,
        verseId: 14,
        sanskrit: 'अन्नाद्भवन्ति भूतानि पर्जन्यादन्नसम्भवः ।\nयज्ञाद्भवति पर्जन्यो यज्ञः कर्मसमुद्भवः ॥',
        transliteration: 'annād bhavanti bhūtāni parjanyād anna-sambhavaḥ |\nyajñād bhavati parjanyo yajñaḥ karma-samudbhavaḥ ||',
        translation: 'All beings come from food; food comes from rain; rain from sacrifice; sacrifice from prescribed action.',
        reference: 'Bhagavad Gita 3.14',
      },
      {
        scriptureId: 'bhagavadgita',
        chapterId: 7,
        verseId: 9,
        sanskrit: 'पुण्यो गन्धः पृथिव्यां च तेजश्चास्मि विभावसौ ।\nजीवनं सर्वभूतेषु तपश्चास्मि तपस्विषु ॥',
        transliteration: 'puṇyo gandhaḥ pṛithivyāṁ cha tejaśh chāsmi vibhāvasau |\njīvanaṁ sarva-bhūteṣhu tapaśh chāsmi tapasviṣhu ||',
        translation: 'I am the fragrance in the earth; I am the heat in fire, the life in all beings.',
        reference: 'Bhagavad Gita 7.9',
      },
      {
        scriptureId: 'atharvaveda',
        sanskrit: 'पृथिवी माता मम अहं पृथिव्याः सूनुः',
        transliteration: 'pṛthivī mātā mama ahaṃ pṛthivyaḥ sūnuḥ',
        translation: 'The Earth is my mother, and I am the child of the Earth.',
        reference: 'Atharva Veda 12.1.12',
      },
    ],
    teachings: [
      'The Earth is not a resource to exploit but a divine mother to revere. The Atharva Veda addresses the Earth as "Mother" and humans as her children.',
      'The Gita describes a cosmic cycle of mutual nourishment (yajña): humans act in harmony with nature → rain falls → food grows → beings live. Breaking this cycle harms everyone.',
      'The divine pervades all elements — the fragrance in the earth, the heat in fire, the life in all beings. Harming nature is harming the divine itself.',
      'The principle of ṛta (cosmic order) includes ecological balance. Living in harmony with natural rhythms is dharma; disrupting them is adharma.',
      'The practice of ahimsa (non-violence) extends beyond humans to all living beings. Minimize harm in how you consume, travel, and eat.',
    ],
    practices: [
      { title: 'Earth as Mother', description: 'Before using water, electricity, or resources, pause and offer gratitude: "This comes from the Earth, who sustains me." This simple shift changes consumption patterns.' },
      { title: 'Harm Reduction', description: 'Choose one area — food, transport, packaging — and reduce your impact for a month. This is ahimsa in practice, not just philosophy.' },
      { title: 'Yajña Mindset', description: 'Ask before each purchase: "Does this honor the cycle of mutual nourishment, or does it break it?" Choose products that regenerate rather than deplete.' },
    ],
    reflections: [
      { question: 'Do I treat Earth as mother?', prompt: 'If I truly saw the Earth as my mother — as the Gita and Vedas describe — how would my daily choices change? Where am I taking without giving back?' },
      { question: 'What is my ecological dharma?', prompt: 'What is one concrete way I can participate in the cycle of yajña — mutual nourishment — rather than extraction? What would that look like this week?' },
    ],
    relatedConcepts: ['prakriti', 'ahimsa', 'dharma'],
  },
  {
    id: 'anger-jealousy',
    title: 'Anger & Jealousy',
    sanskrit: 'क्रोधः',
    icon: '🔥',
    category: 'emotions',
    shortDesc: 'Understanding the roots of destructive emotions and transforming them.',
    description:
      'The Gita provides one of the most precise psychological analyses of anger in world literature. It traces anger to frustrated desire: when we want something and don\'t get it, anger arises. Jealousy is anger\'s cousin — it comes from comparing our lot with others\'. The Gita\'s solution is not to suppress these emotions but to address their root: attachment and the ego-sense that says "I deserve."',
    gradient: 'from-red-500 to-rose-600',
    verses: [
      {
        scriptureId: 'bhagavadgita',
        chapterId: 2,
        verseId: 63,
        sanskrit: 'क्रोधाद्भवति संमोहः संमोहात्स्मृतिविभ्रमः ।\nस्मृतिभ्रंशाद् बुद्धिनाशो बुद्धिनाशात्प्रणश्यति ॥',
        transliteration: 'krodhād bhavati sammohaḥ sammohāt smṛiti-vibhramaḥ |\nsmṛiti-bhranśhād buddhi-nāśho buddhi-nāśhāt praṇaśhyati ||',
        translation: 'From anger comes delusion; from delusion, loss of memory; from loss of memory, destruction of discrimination — and one perishes.',
        reference: 'Bhagavad Gita 2.63',
      },
      {
        scriptureId: 'bhagavadgita',
        chapterId: 16,
        verseId: 4,
        sanskrit: 'दम्भो दर्पोऽभिमानश्च क्रोधः पारुष्यमेव च।अज्ञानं चाभिजातस्य पार्थ सम्पदमासुरीम् ॥',
        transliteration: 'dambho darpo ’bhimānaśh cha krodhaḥ pāruṣhyam eva cha |\najñānaṁ chābhijātasya pārtha sampadam āsurīm ||',
        translation: 'Hypocrisy, arrogance, conceit, anger, harshness, and ignorance — these belong to the demonic nature.',
        reference: 'Bhagavad Gita 16.4',
      },
      {
        scriptureId: 'bhagavadgita',
        chapterId: 2,
        verseId: 56,
        sanskrit: 'दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः ।\nवीतरागभयक्रोधः स्थितधीर्मुनिरुच्यते ॥',
        transliteration: 'duḥkheṣhv-anudvigna-manāḥ sukheṣhu vigata-spṛihaḥ |\nvīta-rāga-bhaya-krodhaḥ sthita-dhīr munir uchyate ||',
        translation: 'The sage whose mind is untroubled in sorrow, who has no longing for joy, and who is free from attachment, fear, and anger — is called a person of steady wisdom.',
        reference: 'Bhagavad Gita 2.56',
      },
    ],
    teachings: [
      'Anger does not arise in a vacuum. Trace it back: anger ← frustrated desire ← attachment ← contemplation of sense objects. Address the root, not the symptom.',
      'Jealousy is comparison rooted in ego. The Gita teaches equanimity — seeing the same Self in all, there is nothing to compare and no one to be jealous of.',
      'Anger clouds judgment. The Gita warns: anger → delusion → loss of memory → loss of discrimination → ruin. The cost of anger is always higher than it seems.',
      'The person of steady wisdom (sthitaprajña) is free from attachment, fear, and anger — not because they suppress these, but because they have addressed the roots.',
      'When anger arises, pause. The Gita does not say "never feel anger" — it says do not let anger drive your actions. The gap between feeling and acting is where wisdom lives.',
    ],
    practices: [
      { title: 'Root Trace', description: 'When anger or jealousy arises, trace it backward: What desire was frustrated? What attachment created that desire? Address the attachment, not just the anger.' },
      { title: 'The Sacred Pause', description: 'When anger surges, wait 90 seconds before responding. Breathe. This is not suppression — it is creating the space Krishna describes between stimulus and action.' },
      { title: 'Equanimity Vision', description: 'When jealousy strikes, remind yourself: "The same Self dwells in them and me. Their success does not diminish me." This is the Gita\'s antidote to comparison.' },
    ],
    reflections: [
      { question: 'What is the root?', prompt: 'The next time I feel angry, can I trace it back to a frustrated desire? What attachment is feeding that desire? What would happen if I loosened that attachment?' },
      { question: 'Who am I comparing to?', prompt: 'When I feel jealous, am I seeing the other person as a separate competitor, or as a manifestation of the same Self? How does equanimity change this?' },
    ],
    relatedConcepts: ['krodha', 'raga', 'kama', 'samatva'],
  },
  {
    id: 'grief-death',
    title: 'Grief & Death',
    sanskrit: 'शोकः',
    icon: '🕊️',
    category: 'emotions',
    shortDesc: 'Finding peace in the face of loss through the wisdom of impermanence.',
    description:
      'The Bhagavad Gita opens with Arjuna\'s grief — overwhelming sorrow at the prospect of losing his family in war. Krishna\'s response addresses grief at its deepest level: the soul is eternal, bodies are temporary, and death is not an ending but a transition. The Upanishads teach that the Self cannot be cut, burned, wet, or dried. This does not mean grief is wrong — it means grief can be held within a larger understanding that eventually brings peace.',
    gradient: 'from-red-500 to-rose-600',
    verses: [
      {
        scriptureId: 'bhagavadgita',
        chapterId: 2,
        verseId: 20,
        sanskrit: 'न जायते म्रियते वा कदाचि ।\nन्नायं भूत्वा भविता वा न भूयः ।\nअजो नित्यः शाश्वतोऽयं पुराणो ।\nन हन्यते हन्यमाने शरीरे ॥',
        transliteration: 'na jāyate mriyate vā kadāchin |\nnāyaṁ bhūtvā bhavitā vā na bhūyaḥ |\najo nityaḥ śhāśhvato ’yaṁ purāṇo |\nna hanyate hanyamāne śharīre ||',
        translation: 'The Self is never born and never dies. Unborn, eternal, ever-existing, it is not destroyed when the body is destroyed.',
        reference: 'Bhagavad Gita 2.20',
      },
      {
        scriptureId: 'bhagavadgita',
        chapterId: 2,
        verseId: 22,
        sanskrit: 'वासांसि जीर्णानि यथा विहाय ।\nनवानि गृह्णाति नरोऽपराणि ।\nतथा शरीराणि विहाय जीर्णा ।\nन्यन्यानि संयाति नवानि देही ॥',
        transliteration: 'vāsānsi jīrṇāni yathā vihāya |\nnavāni gṛihṇāti naro ’parāṇi |\ntathā śharīrāṇi vihāya jīrṇānya |\nnyāni sanyāti navāni dehī ||',
        translation: 'As a person casts off worn-out garments and puts on new ones, so the embodied soul casts off worn-out bodies and enters new ones.',
        reference: 'Bhagavad Gita 2.22',
      },
      {
        scriptureId: 'bhagavadgita',
        chapterId: 2,
        verseId: 23,
        sanskrit: 'नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः ।\nन चैनं क्लेदयन्त्यापो न शोषयति मारुतः ॥',
        transliteration: 'nainaṁ chhindanti śhastrāṇi nainaṁ dahati pāvakaḥ |\nna chainaṁ kledayantyāpo na śhoṣhayati mārutaḥ ||',
        translation: 'The soul cannot be cut by weapons, burned by fire, wet by water, or dried by the wind.',
        reference: 'Bhagavad Gita 2.23',
      },
    ],
    teachings: [
      'The Self (Atman) is eternal — never born, never dying. What we call death is the soul casting off a worn-out body, like changing clothes.',
      'Grief is natural and human. Krishna does not tell Arjuna not to feel — he gives him a larger perspective in which to hold the grief.',
      'Do not grieve for what is inevitable. "Death is certain for the born; rebirth is certain for the dead" (Gita 2.27). Accepting this brings peace.',
      'The person you love has not ceased to exist — they have changed form. The essence, the Atman, is untouched by any transition.',
      'Holding the eternal perspective does not erase pain but prevents it from becoming despair. Grief with wisdom moves toward acceptance; grief without wisdom stagnates.',
    ],
    practices: [
      { title: 'Eternal Perspective', description: 'When grief feels overwhelming, read Gita 2.20-23 slowly. Let the words settle: the soul is not destroyed. This is not denial — it is a larger frame for your pain.' },
      { title: 'Honor the Transition', description: 'Create a ritual — light a candle, offer a prayer, write a letter. Hindu tradition uses ritual (śrāddha) not to cling but to honor the soul\'s journey onward.' },
      { title: 'Grief with Wisdom', description: 'Allow yourself to feel fully, but when despair threatens, remind yourself: "They are not gone — they have changed form. The Self cannot be destroyed."' },
    ],
    reflections: [
      { question: 'What am I really grieving?', prompt: 'Am I grieving the person, or my attachment to their physical presence? How does it change the quality of my grief to know their soul continues?' },
      { question: 'Can I hold both?', prompt: 'Can I honor my pain while holding the Gita\'s teaching that the Self is eternal? What would grief look like if it moved toward acceptance rather than despair?' },
    ],
    relatedConcepts: ['atman', 'samsara', 'moksha', 'vairagya'],
  },
  {
    id: 'discipline-habit-formation',
    title: 'Discipline & Habit Formation',
    sanskrit: 'तपः',
    icon: '⚡',
    category: 'lifestyle',
    shortDesc: 'Building lasting habits through the science of tapas and consistent practice.',
    description:
      'The Gita and Yoga Sutras offer a sophisticated understanding of habit formation. The Gita calls disciplined practice tapas — the fire of self-mastery that burns through old patterns. The Yoga Sutras describe saṃskāras (mental impressions) that create habits, and explain that new saṃskāras must be repeatedly reinforced to replace old ones. This is strikingly similar to modern neuroscience\'s understanding of neuroplasticity. The key insight: consistency matters more than intensity.',
    gradient: 'from-amber-500 to-orange-600',
    verses: [
      {
        scriptureId: 'bhagavadgita',
        chapterId: 6,
        verseId: 16,
        sanskrit: 'नात्यश्नतस्तु योगोऽस्ति न चैकान्तमनश्नतः ।\nन चातिस्वप्नशीलस्य जाग्रतो नैव चार्जुन ॥',
        transliteration: 'nātyaśhnatastu yogo ’sti na chaikāntam anaśhnataḥ |\nna chāti-svapna-śhīlasya jāgrato naiva chārjuna ||',
        translation: 'Yoga is not for one who eats too much or too little, sleeps too much or too little. For one who is moderate in eating, recreation, and effort, yoga becomes the destroyer of sorrow.',
        reference: 'Bhagavad Gita 6.16',
      },
      {
        scriptureId: 'bhagavadgita',
        chapterId: 17,
        verseId: 14,
        sanskrit: 'देवद्विजगुरुप्राज्ञपूजनं शौचमार्जवम्।ब्रह्मचर्यमहिंसा च शारीरं तप उच्यते ॥',
        transliteration: 'deva-dwija-guru-prājña- pūjanaṁ śhaucham ārjavam |\nbrahmacharyam ahinsā cha śhārīraṁ tapa uchyate ||',
        translation: 'Worship of the divine, the twice-born, the teacher, and the wise; purity, straightforwardness, celibacy, and non-violence — these are the austerities of the body.',
        reference: 'Bhagavad Gita 17.14',
      },
      {
        scriptureId: 'bhagavadgita',
        chapterId: 6,
        verseId: 24,
        sanskrit: 'सङ्कल्पप्रभवान्कामांस्त्यक्त्वा सर्वानशेषतः ।\nमनसैवेन्द्रियग्रामं विनियम्य समन्ततः ॥',
        transliteration: 'saṅkalpa-prabhavān kāmāns tyaktvā sarvān aśheṣhataḥ |\nmanasaivendriya-grāmaṁ viniyamya samantataḥ ||',
        translation: 'Let go of all desires born of imagination, completely, and restrain the senses from all sides with the mind.',
        reference: 'Bhagavad Gita 6.24',
      },
    ],
    teachings: [
      'Moderation is the foundation of discipline. The Gita warns against extremes — not too much, not too little. Sustainable habits are built in the middle path.',
      'Tapas (austerity) is not self-punishment but the joyful fire of self-mastery. It is the energy that transforms intention into consistent action.',
      'Habits are saṃskāras — mental grooves. New ones form through repetition (abhyāsa), not through intensity. Small, consistent actions beat grand, sporadic efforts.',
      'Discipline starts with the body and speech — the Gita lists physical and verbal austeries first. Master the body, and the mind follows.',
      'Let go of the desires that pull you away from your practice. Discipline is not just doing the right thing but releasing the cravings that distract you.',
    ],
    practices: [
      { title: 'Moderation First', description: 'Before adding a new habit, check your foundation: Are you sleeping 7-8 hours? Eating moderately? The Gita says yoga (discipline) fails without moderation.' },
      { title: 'Small Fire, Daily', description: 'Choose one tiny action you can do every day — 2 minutes of meditation, 5 push-ups, one page of reading. Consistency (abhyāsa) builds the saṃskāra; size matters less than repetition.' },
      { title: 'Tapas Tracking', description: 'Mark each day you complete your practice. The visual chain becomes its own motivation — you don\'t want to break the fire.' },
    ],
    reflections: [
      { question: 'Am I moderate?', prompt: 'The Gita says discipline fails without moderation. Where am I extreme — too much or too little in eating, sleeping, working? What would the middle path look like?' },
      { question: 'Consistency or intensity?', prompt: 'Am I trying to change everything at once, or building one small saṃskāra at a time? What one tiny practice could I commit to daily for 30 days?' },
    ],
    relatedConcepts: ['tapas', 'abhyasa', 'samskara', 'vairagya'],
  },
];

export function getTopic(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}

export function getTopicsByCategory(category: Topic['category']): Topic[] {
  return topics.filter((t) => t.category === category);
}
