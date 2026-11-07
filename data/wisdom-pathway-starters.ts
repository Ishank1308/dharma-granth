/**
 * Wisdom Pathway starters (MISSION Phases 2-3, flagship set).
 * Ten flagship entrances — Discovering Dharma (purpose-and-dharma),
 * Understanding Karma (understanding-karma), Mastering the Mind
 * (mastering-the-mind), the Search for Self (search-for-self), Inner Peace
 * (stress-to-inner-balance), Fear to Courage (fear-to-courage), Bhakti and
 * Devotion (bhakti-and-devotion), Discipline and Focus
 * (distraction-to-focus), Leadership Through Dharma
 * (leadership-through-dharma), Living With Wisdom (living-with-wisdom) —
 * plus Anger to Self-Mastery and Failure to Resilience, which wait for
 * their canonical pathways. Each starter carries its own introduction and
 * an ordered stage arc built with the shared builders from
 * data/wisdom-pathway-types.ts. Stages point at the mapped canonical
 * pathway's verse lenses and reflections by index; nothing scriptural is
 * copied here. Starters with no canonical pathway yet (pathwaySlug: null)
 * carry editorial links to validated topics, questions and concepts only,
 * and are skipped by generateStaticParams — unknown slugs never render.
 */
import { getPathway } from './wisdom-pathways';
import {
  buildWisdomStages,
  type WisdomPathwayStage,
} from './wisdom-pathway-types';

export interface StarterPathway {
  slug: string;
  titleEn: string;
  titleHi: string;
  questionEn: string;
  questionHi: string;
  introductionEn: string;
  introductionHi: string;
  /** Canonical pathway slug in data/wisdom-pathways.ts, or null when none exists yet. */
  pathwaySlug: string | null;
  stages: WisdomPathwayStage[];
  /** Discovery question ids (data/wisdom-questions.ts); unknown ids resolve to []. */
  questionIds: string[];
  /** wisdom-for-life topic slugs; unknown slugs resolve to []. */
  topicSlugs: string[];
  /** wisdom-concept slugs; unknown slugs resolve to []. */
  conceptSlugs: string[];
}

/**
 * MISSION Phase 2 exemplar: Fear to Courage in 7 stages over the
 * gita-on-fear pathway (lens 0 = Gita 16.1 abhaya, lens 1 =
 * Taittiriya bliss beyond loss; 2 reflections, 2 contemplations).
 */
const fearToCourageStages = buildWisdomStages([
  {
    titleEn: 'Naming the trembling',
    titleHi: 'कँपकपी को नाम देना',
    focusEn: 'Arjuna enters the Gita paralyzed. Courage begins by admitting fear instead of performing fearlessness.',
    focusHi: 'अर्जुन गीता में भय से काँपते हुए प्रवेश करते हैं। साहस का आरंभ भय को स्वीकार करने से होता है, निर्भयता का दिखावा करने से नहीं।',
    reflectionIndexes: [0],
    conceptSlugs: ['fear'],
  },
  {
    titleEn: 'Where fear is born',
    titleHi: 'भय का जन्मस्थान',
    focusEn: 'Fear appears when identity rests only on what can be lost, and the mind divides the world into threats.',
    focusHi: 'भय तब प्रकट होता है जब पहचान केवल उसी पर टिकी हो जो छिन सकता है, और मन जगत को खतरों में बाँट देता है।',
    conceptSlugs: ['fear', 'detachment'],
  },
  {
    titleEn: 'Abhaya, the first quality',
    titleHi: 'अभय — प्रथम गुण',
    focusEn: 'Gita 16.1 names fearlessness the first mark of a purified heart. Read the verse slowly, then its Arth.',
    focusHi: 'गीता १६.१ अभय को शुद्ध अंतःकरण का पहला लक्षण कहती है। श्लोक को धीरे पढ़ें, फिर उसका अर्थ देखें।',
    lensIndexes: [0],
    conceptSlugs: ['fear', 'wisdom'],
  },
  {
    titleEn: 'Bliss beyond loss',
    titleHi: 'हानि से परे आनंद',
    focusEn: 'The Taittiriya Upanishad declares that one who knows the bliss of Brahman never fears.',
    focusHi: 'तैत्तिरीय उपनिषद् कहता है कि ब्रह्म के आनंद को जानने वाला कभी नहीं डरता।',
    lensIndexes: [1],
    conceptSlugs: ['wisdom'],
  },
  {
    titleEn: 'What the masters say',
    titleHi: 'आचार्यों का निर्णय',
    focusEn: 'Yajnavalkya traces fear to duality, Shankara makes abhaya the fruit of Self-knowledge, Ramana traces the frightened "I" to its source.',
    focusHi: 'याज्ञवल्क्य भय की जड़ द्वैत में बताते हैं, शंकर अभय को आत्मज्ञान का फल कहते हैं, रमण भयभीत “मैं” को उसके स्रोत तक ले जाते हैं।',
    conceptSlugs: ['wisdom', 'detachment'],
  },
  {
    titleEn: 'Ask yourself',
    titleHi: 'स्वयं से पूछें',
    focusEn: 'Sit with the two reflection questions. Answer in writing, briefly and honestly.',
    focusHi: 'दोनों चिंतन-प्रश्नों के साथ बैठें। संक्षेप में, ईमानदारी से लिखकर उत्तर दें।',
    reflectionIndexes: [0, 1],
  },
  {
    titleEn: 'One dutiful step',
    titleHi: 'एक कर्तव्य-पग',
    focusEn: 'Courage is attention returned to duty. Take one small dutiful action today without demanding its fruit.',
    focusHi: 'साहस ध्यान को कर्तव्य पर लौटाना है। आज एक छोटा कर्तव्य-कर्म फल की माँग किए बिना करें।',
    contemplationIndexes: [0, 1],
  },
]);

const stressToInnerBalanceStages = buildWisdomStages([
  {
    titleEn: 'The heavy duty',
    titleHi: 'भारी कर्तव्य',
    focusEn: 'Duty feels heavy when measured only by success, praise or blame. Name what is actually yours today.',
    focusHi: 'कर्तव्य तब भारी लगता है जब उसे केवल सफलता, प्रशंसा या निंदा से तौला जाए। आज वास्तव में आपका क्या है, उसे नाम दें।',
    conceptSlugs: ['duty', 'dharma'],
  },
  {
    titleEn: 'Steadiness first',
    titleHi: 'पहले स्थिरता',
    focusEn: 'Without inner integration there is no steady judgment and no peace. Read the verse on the centered mind.',
    focusHi: 'अंतःकरण के संयम के बिना निश्चयात्मक बुद्धि नहीं, शांति नहीं। स्थिर मन वाले श्लोक को पढ़ें।',
    lensIndexes: [0],
    conceptSlugs: ['duty', 'karma'],
  },
  {
    titleEn: 'Work as offering',
    titleHi: 'कर्म अर्पण के रूप में',
    focusEn: 'Duty done without clutching its fruit purifies rather than binds. Let the work be an offering, not a bargain.',
    focusHi: 'फल की आसक्ति छोड़ा हुआ कर्तव्य बाँधता नहीं, शुद्ध करता है। कार्य को सौदा नहीं, अर्पण बनने दें।',
    conceptSlugs: ['karma', 'dharma'],
  },
  {
    titleEn: 'One duty, one outcome',
    titleHi: 'एक कर्तव्य, एक परिणाम',
    focusEn: 'Separate effort from fruit: do the first fully, place the second in trustworthy hands.',
    focusHi: 'प्रयत्न को फल से अलग करें — पहले को पूर्णता से करें, दूसरे को योग्य हाथों में सौंपें।',
    reflectionIndexes: [0],
    contemplationIndexes: [0],
  },
]);

const distractionToFocusStages = buildWisdomStages([
  {
    titleEn: 'Attention, pulled not placed',
    titleHi: 'ध्यान — रखा नहीं, खींचा हुआ',
    focusEn: 'The mind wanders by habit toward craving and threat. Notice where your attention was pulled today.',
    focusHi: 'मन अभ्यासवश कामना और भय की ओर भटकता है। देखें, आज आपका ध्यान कहाँ-कहाँ खिंचा।',
    conceptSlugs: ['mind'],
  },
  {
    titleEn: 'Prepare the ground',
    titleHi: 'भूमि तैयार करें',
    focusEn: 'Solitude, restraint and freedom from grasping prepare the ground. Simplify one thing before sitting.',
    focusHi: 'एकांत, संयम और संग्रह-वृत्ति का त्याग ध्यान की भूमि तैयार करते हैं। बैठने से पहले एक वस्तु सरल करें।',
    lensIndexes: [1],
    conceptSlugs: ['meditation', 'discipline'],
  },
  {
    titleEn: 'Return, little by little',
    titleHi: 'धीरे-धीरे लौटें',
    focusEn: 'The restless mind is mastered little by little. Count returns, not minutes — each return is mastery.',
    focusHi: 'चंचल मन धीरे-धीरे वश में होता है। मिनट नहीं, लौटने की गिनती करें — प्रत्येक वापसी ही अधिकार है।',
    lensIndexes: [0],
    conceptSlugs: ['concentration', 'meditation'],
  },
  {
    titleEn: 'Patience with the wanderer',
    titleHi: 'भटकने वाले से धैर्य',
    focusEn: 'Bring the wandering mind back with patience, not frustration. The masters keep the aim on the Self, not on states.',
    focusHi: 'भटकते मन को खिन्नता से नहीं, धैर्य से लौटाएँ। आचार्य लक्ष्य को अवस्थाओं पर नहीं, आत्मा पर रखते हैं।',
    reflectionIndexes: [0],
    conceptSlugs: ['mind', 'discipline'],
  },
  {
    titleEn: 'Sit today',
    titleHi: 'आज बैठें',
    focusEn: 'Rest attention on the breath for a few minutes. Each return is the practice.',
    focusHi: 'कुछ मिनट श्वास पर ध्यान टिकाएँ। प्रत्येक वापसी ही अभ्यास है।',
    contemplationIndexes: [0],
  },
]);

const purposeAndDharmaStages = buildWisdomStages([
  {
    titleEn: 'Conduct under pressure',
    titleHi: 'दबाव में आचरण',
    focusEn: 'Hard times force conflicts of loyalty. Dharma here is conduct under pressure, not theory.',
    focusHi: 'कठिन समय निष्ठाओं का संघर्ष लाता है। यहाँ धर्म सिद्धांत नहीं, दबाव में आचरण है।',
    conceptSlugs: ['dharma', 'duty'],
  },
  {
    titleEn: 'Pause before deciding',
    titleHi: 'निर्णय से पहले ठहरें',
    focusEn: 'An unquiet mind cannot discern dharma. Pause, consult, then act — integration before decision.',
    focusHi: 'अशांत मन धर्म को पहचान नहीं सकता। ठहरें, परामर्श करें, तब कर्म करें — निर्णय से पहले संयम।',
    lensIndexes: [0],
    conceptSlugs: ['dharma', 'wisdom'],
  },
  {
    titleEn: 'Choose the harder right',
    titleHi: 'कठिन श्रेय चुनें',
    focusEn: 'Rama chooses the harder right over the easier expedient. Patience, truthfulness and service hold when fortune does not.',
    focusHi: 'राम सरल सुविधा पर कठिन श्रेय चुनते हैं। धैर्य, सत्य और सेवा तब थामते हैं जब भाग्य नहीं थामता।',
    conceptSlugs: ['dharma', 'service'],
  },
  {
    titleEn: 'Patience this week',
    titleHi: 'इस सप्ताह धैर्य',
    focusEn: 'Recall one Rama-like pause: where could patience replace haste this week?',
    focusHi: 'राम जैसा एक ठहराव स्मरण करें — इस सप्ताह धैर्य जल्दबाजी का स्थान कहाँ ले सकता है?',
    reflectionIndexes: [0],
    contemplationIndexes: [0],
  },
]);

/**
 * Flagship 2, Understanding Karma, over the krishna-on-duty pathway
 * (1 lens, 1 reflection, 1 contemplation — only index 0 is valid).
 */
const understandingKarmaStages = buildWisdomStages([
  {
    titleEn: 'Where action binds',
    titleHi: 'जहाँ कर्म बाँधता है',
    focusEn: 'Action binds when it is done to secure praise, avoid blame, or control what cannot be controlled. Notice which of these is driving your work today.',
    focusHi: 'कर्म तब बाँधता है जब वह प्रशंसा पाने, निंदा से बचने या जो वश में नहीं उसे वश में करने के लिए किया जाए। देखें, आज आपके कार्य को इनमें से क्या चला रहा है।',
    conceptSlugs: ['karma', 'duty'],
  },
  {
    titleEn: 'The centered mind',
    titleHi: 'स्थिर मन',
    focusEn: 'No steady judgment is possible without inner integration. Read the verse on the centered mind slowly, then its Arth.',
    focusHi: 'अंतःकरण के संयम के बिना निश्चयात्मक बुद्धि संभव नहीं। स्थिर मन वाले श्लोक को धीरे पढ़ें, फिर उसका अर्थ देखें।',
    lensIndexes: [0],
    conceptSlugs: ['duty', 'equanimity'],
  },
  {
    titleEn: 'Offering, not bargain',
    titleHi: 'सौदा नहीं, अर्पण',
    focusEn: 'The masters read duty as worship when its fruit is offered rather than demanded. Ask what would change if this task were an offering.',
    focusHi: 'आचार्य कर्तव्य को उपासना मानते हैं जब उसका फल माँगा नहीं, अर्पित किया जाता है। पूछें — यदि यह कार्य अर्पण हो तो क्या बदलेगा।',
    conceptSlugs: ['karma', 'service'],
  },
  {
    titleEn: 'Do yours, release the rest',
    titleHi: 'अपना करें, शेष छोड़ें',
    focusEn: 'Separate the sphere of effort from the sphere of fruit. Name one duty that is fully yours today, and one outcome you will place in trustworthy hands.',
    focusHi: 'प्रयत्न के क्षेत्र को फल के क्षेत्र से अलग करें। आज का एक कर्तव्य लिखें जो पूर्णतः आपका है, और एक परिणाम जिसे आप योग्य हाथों में सौंपेंगे।',
    reflectionIndexes: [0],
    contemplationIndexes: [0],
  },
]);

/**
 * Flagship 3, Mastering the Mind, over the yoga-on-mind pathway
 * (2 lenses, 1 reflection, 1 contemplation).
 */
const masteringTheMindStages = buildWisdomStages([
  {
    titleEn: 'Attention scatters by habit',
    titleHi: 'ध्यान अभ्यासवश बिखरता है',
    focusEn: 'Attention follows craving and threat by old habit. A scattered mind is untrained, not broken — today, simply notice where attention goes.',
    focusHi: 'ध्यान पुराने अभ्यास से कामना और भय का अनुसरण करता है। बिखरा मन टूटा नहीं, अप्रशिक्षित है — आज केवल देखें कि ध्यान कहाँ जाता है।',
    conceptSlugs: ['mind'],
  },
  {
    titleEn: 'Simplify before sitting',
    titleHi: 'बैठने से पहले सरल करें',
    focusEn: 'Solitude, restraint and freedom from grasping come before technique. Clear one small surface and set one craving aside before you sit.',
    focusHi: 'तकनीक से पहले एकांत, संयम और संग्रह-वृत्ति का त्याग आता है। बैठने से पहले एक छोटा स्थान स्वच्छ करें और एक कामना अलग रखें।',
    lensIndexes: [1],
    conceptSlugs: ['discipline', 'meditation'],
  },
  {
    titleEn: 'Each return is mastery',
    titleHi: 'प्रत्येक वापसी अधिकार है',
    focusEn: 'The restless mind is steadied gradually, never by force. When attention wanders, notice and return — the returning itself is the practice.',
    focusHi: 'चंचल मन बल से नहीं, धीरे-धीरे स्थिर होता है। जब ध्यान भटके, जानें और लौट आएँ — वही लौटना अभ्यास है।',
    lensIndexes: [0],
    conceptSlugs: ['concentration', 'meditation'],
  },
  {
    titleEn: 'Patience, not frustration',
    titleHi: 'खिन्नता नहीं, धैर्य',
    focusEn: 'Ask whether you meet the wandering mind with patience or with scolding. The masters keep the aim on the Self, not on passing states.',
    focusHi: 'पूछें — भटकते मन से आप धैर्य से मिलते हैं या झिड़की से। आचार्य लक्ष्य को अस्थायी अवस्थाओं पर नहीं, आत्मा पर रखते हैं।',
    reflectionIndexes: [0],
    conceptSlugs: ['mind', 'discipline'],
  },
  {
    titleEn: 'One sitting today',
    titleHi: 'आज एक बैठक',
    focusEn: 'Rest attention on the breath for a few unhurried minutes. Count returns, not minutes.',
    focusHi: 'कुछ अव्यग्र मिनटों तक श्वास पर ध्यान टिकाएँ। मिनट नहीं, लौटने की गिनती करें।',
    contemplationIndexes: [0],
  },
]);

/**
 * Flagship 4, the Search for Self, over the upanishads-on-self pathway
 * (1 lens, 1 reflection, 1 contemplation — only index 0 is valid).
 */
const searchForSelfStages = buildWisdomStages([
  {
    titleEn: 'The changing costumes',
    titleHi: 'बदलते वेश',
    focusEn: 'Roles, moods and strengths change, yet something unchanging watches them all. List three labels you call “me” and ask which of them has never changed.',
    focusHi: 'भूमिकाएँ, मनोदशाएँ और क्षमताएँ बदलती हैं, फिर भी कुछ अपरिवर्तनीय उन सबको देखता है। तीन संज्ञाएँ लिखें जिन्हें आप “मैं” कहते हैं और पूछें — इनमें क्या कभी नहीं बदला।',
    conceptSlugs: ['wisdom', 'truth'],
  },
  {
    titleEn: 'Tat Tvam Asi',
    titleHi: 'तत् त्वम् असि',
    focusEn: 'The teaching declares identity between the innermost Self and the ground of all. Read the verse slowly with its Arth, then sit with the sentence rather than arguing it.',
    focusHi: 'उपदेश अंतरतम आत्मा और सर्वाधार की एकता घोषित करता है। श्लोक को अर्थ सहित धीरे पढ़ें, फिर उस वाक्य के साथ बैठें — विवाद न करें।',
    lensIndexes: [0],
    conceptSlugs: ['wisdom', 'meditation'],
  },
  {
    titleEn: 'Who is the knower?',
    titleHi: 'ज्ञाता कौन है?',
    focusEn: 'Shift from “I am restless” to “restlessness is passing through awareness.” Ask who remains when the state passes, and observe without hurrying to answer.',
    focusHi: '“मैं बेचैन हूँ” से हटकर देखें — “बेचैनी चेतना से गुजर रही है।” पूछें, अवस्था बीत जाने पर कौन शेष रहता है, और उत्तर की शीघ्रता किए बिना अवलोकन करें।',
    reflectionIndexes: [0],
    contemplationIndexes: [0],
  },
]);

/**
 * Flagship 7, Bhakti and Devotion, over the saints-on-devotion pathway
 * (1 lens, 2 reflections, 1 contemplation).
 */
const bhaktiAndDevotionStages = buildWisdomStages([
  {
    titleEn: 'When prayer becomes performance',
    titleHi: 'जब प्रार्थना प्रदर्शन बने',
    focusEn: 'Devotion falters when crowded by display, resentment or bargain. Ask honestly whether your practice right now is refuge, performance, or bargain.',
    focusHi: 'दिखावे, रोष या लेन-देन से घिरकर भक्ति डगमगाती है। ईमानदारी से पूछें — इस समय आपकी साधना आश्रय है, प्रदर्शन है या सौदा।',
    conceptSlugs: ['bhakti', 'faith'],
  },
  {
    titleEn: 'The returning itself',
    titleHi: 'वही लौटना',
    focusEn: 'Wherever the mind wanders, bring it back without self-reproach. Read the verse on returning, and let small and sincere outlast grand and strained.',
    focusHi: 'मन जहाँ-जहाँ भटके, वहाँ से आत्म-धिक्कार के बिना लौटाएँ। लौटने वाले श्लोक को पढ़ें — छोटा और सच्चा बड़े और तनावपूर्ण से अधिक टिके।',
    lensIndexes: [0],
    conceptSlugs: ['bhakti', 'meditation'],
  },
  {
    titleEn: 'Refuge in one name',
    titleHi: 'एक नाम में आश्रय',
    focusEn: 'The saints held to one refuge through loss and waiting. Sit with the two reflection questions and answer briefly in writing.',
    focusHi: 'संतों ने हानि और प्रतीक्षा में एक आश्रय थामा। दोनों चिंतन-प्रश्नों के साथ बैठें और संक्षेप में लिखकर उत्तर दें।',
    reflectionIndexes: [0, 1],
    conceptSlugs: ['faith', 'compassion'],
  },
  {
    titleEn: 'One small service',
    titleHi: 'एक छोटी सेवा',
    focusEn: 'Choose one name, one breath, one small service today. Let sorrow soften into love through a single kind act done slowly.',
    focusHi: 'आज एक नाम, एक श्वास, एक छोटी सेवा चुनें। धीरे किए गए एक सत्कर्म से शोक को प्रेम में ढलने दें।',
    contemplationIndexes: [0],
    conceptSlugs: ['service', 'compassion'],
  },
]);

/**
 * Flagship 9, Leadership Through Dharma, over the ramayana-on-dharma
 * pathway (1 lens, 1 reflection, 1 contemplation — only index 0 is valid).
 */
const leadershipThroughDharmaStages = buildWisdomStages([
  {
    titleEn: 'Power reveals conduct',
    titleHi: 'सत्ता आचरण प्रकट करती है',
    focusEn: 'Authority tests what pressure hides: whether promises hold when they cost. Recall one decision where expediency and rightness pulled apart.',
    focusHi: 'अधिकार उसकी परीक्षा लेता है जिसे दबाव छिपाता है — वचन तब भी निभते हैं क्या जब उनकी कीमत चुकानी पड़े। एक ऐसा निर्णय स्मरण करें जहाँ सुविधा और श्रेय विपरीत खिंचे हों।',
    conceptSlugs: ['leadership', 'dharma'],
  },
  {
    titleEn: 'Pause, consult, then act',
    titleHi: 'ठहरें, परामर्श करें, तब कर्म करें',
    focusEn: 'Steadiness precedes righteous choice; an unquiet mind cannot discern dharma. Before the next hard call, write the promise involved and the person affected.',
    focusHi: 'धर्म-विवेक से पहले स्थिरता आती है; अशांत मन धर्म को पहचान नहीं सकता। अगले कठिन निर्णय से पहले निहित वचन और प्रभावित व्यक्ति लिखें।',
    lensIndexes: [0],
    conceptSlugs: ['dharma', 'wisdom'],
  },
  {
    titleEn: 'Serve, do not rule',
    titleHi: 'शासन नहीं, सेवा',
    focusEn: 'Patience, truthfulness and service hold when fortune does not. Ask whose burden your authority could lighten this week, and take one step.',
    focusHi: 'धैर्य, सत्य और सेवा तब थामते हैं जब भाग्य नहीं थामता। पूछें — इस सप्ताह आपका अधिकार किसका भार हल्का कर सकता है, और एक पग उठाएँ।',
    reflectionIndexes: [0],
    contemplationIndexes: [0],
    conceptSlugs: ['leadership', 'service'],
  },
]);

/**
 * Flagship 10, Living With Wisdom, over the sanatan-on-grief pathway
 * (2 lenses, 1 reflection, 2 contemplations).
 */
const livingWithWisdomStages = buildWisdomStages([
  {
    titleEn: 'Love, bound to a form',
    titleHi: 'रूप से बँधा प्रेम',
    focusEn: 'Grief binds love to a form that has changed; the heart protests impermanence because it loves deeply. Name what has changed and what love remains.',
    focusHi: 'शोक प्रेम को उस रूप से बाँध देता है जो बदल गया है; हृदय अनित्यता का विरोध करता है क्योंकि वह गहन प्रेम करता है। लिखें — क्या बदला है, और कौन सा प्रेम शेष है।',
    conceptSlugs: ['wisdom', 'faith'],
  },
  {
    titleEn: 'Fear that love has nowhere to go',
    titleHi: 'प्रेम का ठिकाना छिनने का भय',
    focusEn: 'Fearlessness includes grief’s own fear. Read the verse slowly; grief needs care, not fixing — heavy or persistent sorrow deserves trusted people and qualified counsel alongside reading.',
    focusHi: 'अभय में शोक का अपना भय भी समाहित है। श्लोक को धीरे पढ़ें; शोक को सुधार नहीं, देखभाल चाहिए — भारी या दीर्घस्थायी दुख में पठन के साथ विश्वस्त जनों और योग्य परामर्श का सहारा लें।',
    lensIndexes: [0],
    conceptSlugs: ['detachment', 'wisdom'],
  },
  {
    titleEn: 'Centering the remembering mind',
    titleHi: 'स्मरण करने वाले मन को स्थिर करना',
    focusEn: 'Peace returns not by forgetting but by steadying the mind that remembers. Turn one remembrance into one small act of service, done slowly.',
    focusHi: 'शांति भुलाने से नहीं, स्मरण करने वाले मन को स्थिर करने से लौटती है। एक स्मृति को धीरे की गई सेवा के एक छोटे कार्य में ढालें।',
    lensIndexes: [1],
    conceptSlugs: ['equanimity', 'detachment'],
  },
  {
    titleEn: 'One steady act today',
    titleHi: 'आज एक स्थिर कार्य',
    focusEn: 'Ask what love inside this grief can become service. Then do one small steady thing — one memory, one breath, one kind act.',
    focusHi: 'पूछें — इस शोक के भीतर कौन सा प्रेम सेवा बन सकता है। फिर एक छोटा स्थिर कार्य करें — एक स्मृति, एक श्वास, एक सत्कर्म।',
    reflectionIndexes: [0],
    contemplationIndexes: [0, 1],
    conceptSlugs: ['service', 'inner-peace'],
  },
]);

export const STARTER_PATHWAYS: StarterPathway[] = [
  {
    slug: 'fear-to-courage',
    titleEn: 'Fear to Courage',
    titleHi: 'भय से साहस तक',
    questionEn: 'How do I turn fear into courage?',
    questionHi: 'भय को साहस में कैसे बदलूँ?',
    introductionEn:
      'Fear shrinks the world to threats. This path follows Arjuna from trembling to clarity through the Gita and the Upanishads: name the fear, see its root, hear the verses, and take one dutiful step.',
    introductionHi:
      'भय जगत को खतरों तक सिकोड़ देता है। यह मार्ग अर्जुन का कँपकपी से स्पष्टता तक का साथ देता है — गीता और उपनिषदों के द्वारा : भय को नाम दें, उसकी जड़ देखें, श्लोक सुनें और एक कर्तव्य-पग उठाएँ।',
    pathwaySlug: 'gita-on-fear',
    stages: fearToCourageStages,
    questionIds: ['how-to-overcome-fear'],
    topicSlugs: ['fear-and-courage', 'stress-and-worry'],
    conceptSlugs: ['fear', 'wisdom', 'detachment'],
  },
  {
    slug: 'anger-to-self-mastery',
    titleEn: 'Anger to Self-Mastery',
    titleHi: 'क्रोध से आत्मसंयम तक',
    questionEn: 'How can I master anger before it masters me?',
    questionHi: 'क्रोध मुझ पर हावी हो, इससे पहले उस पर अधिकार कैसे करूँ?',
    introductionEn:
      'Anger arrives faster than judgment. No full pathway walks this arc yet, so begin where the library is strongest: the Gita verses on anger and the questions the masters have already answered.',
    introductionHi:
      'क्रोध विवेक से तेज़ आता है। इस मोड़ पर अभी कोई पूर्ण मार्ग नहीं है, इसलिए वहीं से आरंभ करें जहाँ ग्रंथालय सबसे सशक्त है — क्रोध पर गीता के श्लोक और वे प्रश्न जिनका आचार्यों ने उत्तर दिया है।',
    pathwaySlug: null,
    stages: [],
    questionIds: ['how-to-control-anger'],
    topicSlugs: ['anger'],
    conceptSlugs: ['anger', 'patience', 'self-control'],
  },
  {
    slug: 'stress-to-inner-balance',
    titleEn: 'Stress to Inner Balance',
    titleHi: 'तनाव से आंतरिक संतुलन तक',
    questionEn: 'How do I stay steady when life feels overwhelming?',
    questionHi: 'जीवन असह्य लगे तब स्थिर कैसे रहूँ?',
    introductionEn:
      'Pressure scatters effort into worry. This path follows Krishna’s teaching on duty: steady the mind first, separate effort from fruit, and let work become offering.',
    introductionHi:
      'दबाव प्रयत्न को चिंता में बिखेर देता है। यह मार्ग कर्तव्य पर श्रीकृष्ण के उपदेश का अनुसरण करता है — पहले मन स्थिर करें, प्रयत्न को फल से अलग करें, और कार्य को अर्पण बनने दें।',
    pathwaySlug: 'krishna-on-duty',
    stages: stressToInnerBalanceStages,
    questionIds: ['how-to-find-inner-peace-amid-noise', 'how-to-act-without-anxiety-about-results'],
    topicSlugs: ['stress-and-worry', 'duty-and-decision-making'],
    conceptSlugs: ['duty', 'dharma', 'karma'],
  },
  {
    slug: 'distraction-to-focus',
    titleEn: 'Distraction to Focus',
    titleHi: 'विक्षेप से एकाग्रता तक',
    questionEn: 'How can I gather a scattered mind?',
    questionHi: 'बिखरे मन को कैसे समेटूँ?',
    introductionEn:
      'A scattered mind is not a broken mind — only an untrained one. This path follows Patanjali and the Gita’s sixth chapter: prepare the ground, return little by little, and count returns, not minutes.',
    introductionHi:
      'बिखरा मन टूटा मन नहीं है — केवल अप्रशिक्षित है। यह मार्ग पतंजलि और गीता के छठे अध्याय का अनुसरण करता है — भूमि तैयार करें, धीरे-धीरे लौटें, और मिनट नहीं, लौटने की गिनती करें।',
    pathwaySlug: 'yoga-on-mind',
    stages: distractionToFocusStages,
    questionIds: ['how-to-calm-a-restless-mind'],
    topicSlugs: ['concentration', 'discipline'],
    conceptSlugs: ['mind', 'meditation', 'concentration'],
  },
  {
    slug: 'failure-to-resilience',
    titleEn: 'Failure to Resilience',
    titleHi: 'असफलता से पुनरुत्थान तक',
    questionEn: 'How do I rise after failure?',
    questionHi: 'असफलता के बाद कैसे उठूँ?',
    introductionEn:
      'Failure tempts two lies: that the result was everything, and that the effort was nothing. No full pathway walks this arc yet, so begin with equanimity — steadiness in success and failure alike.',
    introductionHi:
      'असफलता दो झूठ बोलती है — कि परिणाम ही सब कुछ था, और प्रयत्न कुछ भी नहीं था। इस मोड़ पर अभी कोई पूर्ण मार्ग नहीं है, इसलिए समत्व से आरंभ करें — सफलता और असफलता दोनों में स्थिरता।',
    pathwaySlug: null,
    stages: [],
    questionIds: ['how-to-stay-steady-in-success-and-failure'],
    topicSlugs: ['stress-and-worry', 'duty-and-decision-making'],
    conceptSlugs: ['equanimity', 'detachment', 'inner-peace'],
  },
  {
    slug: 'purpose-and-dharma',
    titleEn: 'Purpose and Dharma',
    titleHi: 'उद्देश्य और धर्म',
    questionEn: 'How do I find my purpose and live by dharma?',
    questionHi: 'अपना उद्देश्य कैसे पाऊँ और धर्म से कैसे जीऊँ?',
    introductionEn:
      'Purpose is not invented but recognized — in the promises kept and the people served. This path follows Rama’s conduct under pressure: pause, discern, and choose the harder right.',
    introductionHi:
      'उद्देश्य गढ़ा नहीं जाता, पहचाना जाता है — निभाए गए वचनों में और सेवा किए गए जनों में। यह मार्ग दबाव में राम के आचरण का अनुसरण करता है — ठहरें, विवेक करें, और कठिन श्रेय चुनें।',
    pathwaySlug: 'ramayana-on-dharma',
    stages: purposeAndDharmaStages,
    questionIds: ['how-to-find-purpose-in-work', 'what-is-my-duty-in-difficult-situations'],
    topicSlugs: ['duty-and-decision-making', 'meaning-of-life'],
    conceptSlugs: ['dharma', 'duty', 'purpose'],
  },
  {
    slug: 'understanding-karma',
    titleEn: 'Understanding Karma',
    titleHi: 'कर्म को समझना',
    questionEn: 'What is karma, and how do I act without anxiety?',
    questionHi: 'कर्म क्या है, और चिंता के बिना कर्म कैसे करूँ?',
    introductionEn:
      'Karma is not fate but the law of action and fruit. This path follows Krishna’s teaching on duty: steady the mind, separate effort from fruit, and let work become offering rather than bargain.',
    introductionHi:
      'कर्म भाग्य नहीं, क्रिया और फल का नियम है। यह मार्ग कर्तव्य पर श्रीकृष्ण के उपदेश का अनुसरण करता है — मन स्थिर करें, प्रयत्न को फल से अलग करें, और कार्य को सौदा नहीं, अर्पण बनने दें।',
    pathwaySlug: 'krishna-on-duty',
    stages: understandingKarmaStages,
    questionIds: ['how-to-act-without-anxiety-about-results'],
    topicSlugs: ['duty-and-decision-making', 'stress-and-worry'],
    conceptSlugs: ['karma', 'duty', 'equanimity'],
  },
  {
    slug: 'mastering-the-mind',
    titleEn: 'Mastering the Mind',
    titleHi: 'मन पर अधिकार',
    questionEn: 'How do I master a restless mind?',
    questionHi: 'चंचल मन पर अधिकार कैसे करूँ?',
    introductionEn:
      'The mind is steadied gradually, never by force. This path follows Patanjali and the Gita’s sixth chapter: simplify before sitting, return little by little, and meet the wanderer with patience.',
    introductionHi:
      'मन बल से नहीं, धीरे-धीरे स्थिर होता है। यह मार्ग पतंजलि और गीता के छठे अध्याय का अनुसरण करता है — बैठने से पहले सरल करें, धीरे-धीरे लौटें, और भटकने वाले से धैर्य से मिलें।',
    pathwaySlug: 'yoga-on-mind',
    stages: masteringTheMindStages,
    questionIds: ['how-to-calm-a-restless-mind'],
    topicSlugs: ['concentration', 'discipline'],
    conceptSlugs: ['mind', 'meditation', 'concentration'],
  },
  {
    slug: 'search-for-self',
    titleEn: 'The Search for Self',
    titleHi: 'आत्मा की खोज',
    questionEn: 'Who am I beneath changing roles?',
    questionHi: 'बदलती भूमिकाओं के पीछे मैं कौन हूँ?',
    introductionEn:
      'Roles, moods and strengths change, yet something unchanging watches them all. This path follows the Upanishads from passing labels to the knower that remains — asked slowly, never preached.',
    introductionHi:
      'भूमिकाएँ, मनोदशाएँ और क्षमताएँ बदलती हैं, फिर भी कुछ अपरिवर्तनीय उन सबको देखता है। यह मार्ग उपनिषदों के साथ अस्थायी संज्ञाओं से उस ज्ञाता तक जाता है जो शेष रहता है — धीरे पूछा गया, उपदेश नहीं।',
    pathwaySlug: 'upanishads-on-self',
    stages: searchForSelfStages,
    questionIds: ['how-to-find-purpose-in-work'],
    topicSlugs: ['self-knowledge', 'meaning-of-life'],
    conceptSlugs: ['wisdom', 'truth', 'meditation'],
  },
  {
    slug: 'bhakti-and-devotion',
    titleEn: 'Bhakti and Devotion',
    titleHi: 'भक्ति और उपासना',
    questionEn: 'How do I practice devotion in daily life?',
    questionHi: 'दैनिक जीवन में भक्ति का अभ्यास कैसे करूँ?',
    introductionEn:
      'The saints turned metaphysics into song: devotion as refuge when argument fails. This path follows Mira, Kabir and Chaitanya — hold to one refuge, return without reproach, and serve one small act today.',
    introductionHi:
      'संतों ने अध्यात्म को भजन बनाया — तर्क जहाँ थकता है वहाँ भक्ति आश्रय है। यह मार्ग मीरा, कबीर और चैतन्य का अनुसरण करता है — एक आश्रय थामें, बिना धिक्कार लौटें, और आज एक छोटी सेवा करें।',
    pathwaySlug: 'saints-on-devotion',
    stages: bhaktiAndDevotionStages,
    questionIds: ['how-to-practice-devotion-daily'],
    topicSlugs: ['devotion', 'grief-and-loss'],
    conceptSlugs: ['bhakti', 'faith', 'compassion'],
  },
  {
    slug: 'leadership-through-dharma',
    titleEn: 'Leadership Through Dharma',
    titleHi: 'धर्म से नेतृत्व',
    questionEn: 'How do I lead without ego?',
    questionHi: 'अहंकार के बिना नेतृत्व कैसे करूँ?',
    introductionEn:
      'Authority tests conduct: whether promises hold when they cost. This path follows Rama’s conduct under pressure — pause, consult, then act — and turns ruling into serving.',
    introductionHi:
      'अधिकार आचरण की परीक्षा लेता है — वचन तब भी निभते हैं क्या जब उनकी कीमत हो। यह मार्ग दबाव में राम के आचरण का अनुसरण करता है — ठहरें, परामर्श करें, तब कर्म करें — और शासन को सेवा में ढालता है।',
    pathwaySlug: 'ramayana-on-dharma',
    stages: leadershipThroughDharmaStages,
    questionIds: ['how-to-lead-without-ego'],
    topicSlugs: ['leadership', 'duty-and-decision-making'],
    conceptSlugs: ['leadership', 'dharma', 'service'],
  },
  {
    slug: 'living-with-wisdom',
    titleEn: 'Living With Wisdom',
    titleHi: 'ज्ञान के साथ जीना',
    questionEn: 'How do I live wisely through grief and change?',
    questionHi: 'शोक और परिवर्तन में ज्ञान से कैसे जीऊँ?',
    introductionEn:
      'Grief binds love to a form that has changed. This path follows Sanatan wisdom on loss: steady the remembering mind, turn remembrance into service, and take one small steady act today.',
    introductionHi:
      'शोक प्रेम को उस रूप से बाँध देता है जो बदल गया है। यह मार्ग हानि पर सनातन ज्ञान का अनुसरण करता है — स्मरण करने वाले मन को स्थिर करें, स्मरण को सेवा बनाएँ, और आज एक छोटा स्थिर कार्य करें।',
    pathwaySlug: 'sanatan-on-grief',
    stages: livingWithWisdomStages,
    questionIds: ['how-to-face-grief-and-loss'],
    topicSlugs: ['grief-and-loss', 'meaning-of-life'],
    conceptSlugs: ['wisdom', 'faith', 'detachment'],
  },
];

export function getStarterPathway(slug: string): StarterPathway | undefined {
  return STARTER_PATHWAYS.find((s) => s.slug === slug.trim().toLowerCase());
}

/**
 * Starters that resolve to a real canonical pathway (MISSION Phase 3:
 * unknown slugs skipped). Used by generateStaticParams.
 */
export function mappedStarterPathways(): StarterPathway[] {
  return STARTER_PATHWAYS.filter((s) => s.pathwaySlug !== null && getPathway(s.pathwaySlug) !== undefined);
}

/** Starters still waiting for a canonical pathway: intro plus editorial links. */
export function unmappedStarterPathways(): StarterPathway[] {
  return STARTER_PATHWAYS.filter((s) => !mappedStarterPathways().includes(s));
}
