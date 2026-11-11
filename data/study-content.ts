/**
 * Reviewed study content for Phase 2 features. Three registries, all keyed by
 * verse. Nothing is generated at runtime: where a verse has no entry, the
 * interface says so instead of inventing a meaning, a commentary or a link.
 */

// Review labels, the verse key and the (empty) commentary registry live in a small module of their own, so a
// reader component that needs only them does not bundle the line explanations and connections below.
import type { ReviewStatus } from './study-review';

export { REVIEW_LABEL, verseKey, COMMENTARIES, type ReviewStatus, type CommentaryEntry } from './study-review';

/* ── Explain this line ─────────────────────────────────────────────── */

export interface LineExplanation {
  /** The line as it appears in the Sanskrit layer (used to match a selection). */
  line: string;
  simpleEn: string;
  simpleHi: string;
  terms: Array<{ word: string; iast: string; meaning: string }>;
  context: string;
  review: ReviewStatus;
}

export const LINE_EXPLANATIONS: Record<string, LineExplanation[]> = {
  'bhagavadgita:2:11': [
    {
      line: 'अशोच्यानन्वशोचस्त्वं प्रज्ञावादांश्च भाषसे',
      simpleEn: 'You grieve for those who should not be grieved for, yet you speak words of wisdom.',
      simpleHi: 'तुम उनके लिए शोक करते हो जो शोक के योग्य नहीं हैं, और विद्वानों जैसी बातें करते हो।',
      terms: [
        { word: 'अशोच्यान्', iast: 'aśocyān', meaning: 'those not to be grieved for' },
        { word: 'अन्वशोचः', iast: 'anvaśocaḥ', meaning: 'you have lamented / grieved' },
        { word: 'त्वम्', iast: 'tvam', meaning: 'you' },
        { word: 'प्रज्ञावादान्', iast: 'prajñā-vādān', meaning: 'words of wisdom / learned arguments' },
        { word: 'भाषसे', iast: 'bhāṣase', meaning: 'you speak' },
      ],
      context: 'Krishna directly addresses Arjuna’s contradiction: using sophisticated ethical arguments to justify an emotional breakdown.',
      review: 'approved',
    },
    {
      line: 'गतासूनगतासूंश्च नानुशोचन्ति पण्डिताः',
      simpleEn: 'The truly wise mourn neither for those whose breath has ceased nor for those whose breath remains.',
      simpleHi: 'ज्ञानी जन न तो उनके लिए शोक करते हैं जिनके प्राण चले गए हैं, और न उनके लिए जिनके प्राण बाकी हैं।',
      terms: [
        { word: 'गतासून्', iast: 'gata-asūn', meaning: 'the dead (those whose breath has gone)' },
        { word: 'अगतासून्', iast: 'agata-asūn', meaning: 'the living (those whose breath remains)' },
        { word: 'न अनुशोचन्ति', iast: 'na anuśocanti', meaning: 'do not grieve / mourn' },
        { word: 'पण्डिताः', iast: 'paṇḍitāḥ', meaning: 'the wise / knowers of truth' },
      ],
      context: 'Krishna establishes the eternal perspective of Atman: birth and death are transitions of bodily instruments, not of the soul.',
      review: 'approved',
    },
  ],
  'bhagavadgita:2:13': [
    {
      line: 'देहिनोऽस्मिन्यथा देहे कौमारं यौवनं जरा',
      simpleEn: 'Just as the embodied soul passes through childhood, youth, and old age within this body.',
      simpleHi: 'जैसे जीवात्मा इस शरीर में बाल्यावस्था, युवावस्था और वृद्धावस्था को प्राप्त होता है।',
      terms: [
        { word: 'देहिनः', iast: 'dehinaḥ', meaning: 'of the embodied soul' },
        { word: 'अस्मिन् देहे', iast: 'asmin dehe', meaning: 'in this body' },
        { word: 'कौमारम्', iast: 'kaumāram', meaning: 'childhood' },
        { word: 'यौवनम्', iast: 'yauvanam', meaning: 'youth' },
        { word: 'जरा', iast: 'jarā', meaning: 'old age' },
      ],
      context: 'Krishna uses observable biological stages within one lifetime to demonstrate that bodily change does not destroy the conscious observer.',
      review: 'approved',
    },
    {
      line: 'तथा देहान्तरप्राप्तिर्धीरस्तत्र न मुह्यति',
      simpleEn: 'So similarly it attains another body; the steady-minded are not deluded by this.',
      simpleHi: 'वैसे ही वह दूसरे शरीर को प्राप्त होता है; धीर पुरुष इसमें मोहित नहीं होते।',
      terms: [
        { word: 'तथा', iast: 'tathā', meaning: 'similarly, in the same way' },
        { word: 'देहान्तरप्राप्तिः', iast: 'dehāntara-prāptiḥ', meaning: 'attainment of another body' },
        { word: 'धीरः', iast: 'dhīraḥ', meaning: 'the steadfast / discerning person' },
        { word: 'तत्र न मुह्यति', iast: 'tatra na muhyati', meaning: 'is not bewildered / deluded thereby' },
      ],
      context: 'Krishna shows that passing from one body to another at death is simply the next natural transition, removing existential panic.',
      review: 'approved',
    },
  ],
  'bhagavadgita:2:14': [
    {
      line: 'मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः',
      simpleEn: 'The contacts of the senses with their objects, O Arjuna, give rise to cold, heat, pleasure, and pain.',
      simpleHi: 'हे कौन्तेय! इन्द्रियों और विषयों के संयोग शीत, उष्ण, सुख और दुःख को देने वाले हैं।',
      terms: [
        { word: 'मात्रास्पर्शाः', iast: 'mātrā-sparśāḥ', meaning: 'contacts of the senses with objects' },
        { word: 'कौन्तेय', iast: 'kaunteya', meaning: 'son of Kunti (Arjuna)' },
        { word: 'शीतोष्णसुखदुःखदाः', iast: 'śītoṣṇa-sukha-duḥkha-dāḥ', meaning: 'givers of cold, heat, pleasure, and pain' },
      ],
      context: 'Krishna explains the biological and psychological origin of all fluctuating dualities in experience.',
      review: 'approved',
    },
    {
      line: 'आगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत',
      simpleEn: 'They have a beginning and an end and are impermanent; endure them with patience, O descendant of Bharata.',
      simpleHi: 'वे आने-जाने वाले तथा अनित्य हैं; इसलिए हे भारत! तुम उन्हें धैर्यपूर्वक सहन करो।',
      terms: [
        { word: 'आगमापायिनः', iast: 'āgama-apāyinaḥ', meaning: 'subject to arrival and departure' },
        { word: 'अनित्याः', iast: 'anityāḥ', meaning: 'impermanent, transient' },
        { word: 'तितिक्षस्व', iast: 'titikṣasva', meaning: 'endure patiently with inner calm' },
      ],
      context: 'Krishna introduces the vital practice of titikṣā (forbearance) to overcome emotional volatility.',
      review: 'approved',
    },
  ],
  'bhagavadgita:2:20': [
    {
      line: 'न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः',
      simpleEn: 'The conscious Self is never born, nor does it ever die; nor having once existed does it ever cease to be.',
      simpleHi: 'आत्मा न कभी जन्म लेती है और न कभी मरती है; और न यह उत्पन्न होकर फिर कभी अभाव को प्राप्त होती है।',
      terms: [
        { word: 'न जायते', iast: 'na jāyate', meaning: 'is never born' },
        { word: 'म्रियते वा', iast: 'mriyate vā', meaning: 'or ever dies' },
        { word: 'कदाचित्', iast: 'kadācit', meaning: 'at any time' },
      ],
      context: 'Krishna declares the absolute uncreated and indestructible nature of conscious existence.',
      review: 'approved',
    },
    {
      line: 'अजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे',
      simpleEn: 'Unborn, eternal, ever-existing and ancient, it is not destroyed when the body is destroyed.',
      simpleHi: 'यह अजन्मा, नित्य, शाश्वत और पुरातन है; शरीर के मारे जाने पर भी यह नहीं मारी जाती।',
      terms: [
        { word: 'अजः', iast: 'ajaḥ', meaning: 'unborn' },
        { word: 'नित्यः', iast: 'nityaḥ', meaning: 'eternal, continuous' },
        { word: 'शाश्वतः', iast: 'śāśvataḥ', meaning: 'changeless, permanent' },
        { word: 'पुराणः', iast: 'purāṇaḥ', meaning: 'ancient yet ever-fresh' },
        { word: 'न हन्यते', iast: 'na hanyate', meaning: 'is not slain/destroyed' },
      ],
      context: 'Krishna emphasizes that bodily mortality does not touch the immortal witness self.',
      review: 'approved',
    },
  ],
  'bhagavadgita:2:22': [
    {
      line: 'वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरोऽपराणि',
      simpleEn: 'Just as a person casts off worn-out garments and puts on new ones.',
      simpleHi: 'जैसे मनुष्य पुराने वस्त्रों को त्यागकर दूसरे नए वस्त्रों को ग्रहण करता है।',
      terms: [
        { word: 'वासांसि', iast: 'vāsāṁsi', meaning: 'garments / clothes' },
        { word: 'जीर्णानि', iast: 'jīrṇāni', meaning: 'worn-out, decayed' },
        { word: 'विहाय', iast: 'vihāya', meaning: 'having cast off / shed' },
        { word: 'नवानि', iast: 'navāni', meaning: 'new ones' },
        { word: 'गृह्णाति', iast: 'gṛhṇāti', meaning: 'takes up / puts on' },
      ],
      context: 'Krishna introduces the everyday analogy of clothing to explain embodiment and physical death.',
      review: 'approved',
    },
    {
      line: 'तथा शरीराणि विहाय जीर्ण्यान्यन्यानि संयाति नवानि देही',
      simpleEn: 'So the embodied soul casts off worn-out bodies and enters other new ones.',
      simpleHi: 'वैसे ही जीवात्मा पुराने शरीरों को छोड़कर दूसरे नए शरीरों में प्रवेश करता है।',
      terms: [
        { word: 'शरीराणि', iast: 'śarīrāṇi', meaning: 'physical bodies' },
        { word: 'जीर्ण्यानि', iast: 'jīrṇyāni', meaning: 'worn-out, aged' },
        { word: 'अन्यानि संयाति', iast: 'anyāni saṁyāti', meaning: 'enters into others' },
        { word: 'देही', iast: 'dehī', meaning: 'the embodied soul' },
      ],
      context: 'The soul is the conscious wearer; the body is the temporary garment worn for a season of action.',
      review: 'approved',
    },
  ],
  'bhagavadgita:2:47': [
    {
      line: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
      simpleEn: 'Your right is to the action itself, never to its results.',
      simpleHi: 'तुम्हारा अधिकार केवल कर्म पर है, उसके फलों पर कभी नहीं।',
      terms: [
        { word: 'कर्मणि', iast: 'karmaṇi', meaning: 'in action (locative)' },
        { word: 'अधिकारः', iast: 'adhikāraḥ', meaning: 'right, entitlement' },
        { word: 'फलेषु', iast: 'phaleṣu', meaning: 'in the fruits, the results' },
      ],
      context: 'Krishna is telling Arjuna where his responsibility lies as he faces a duty with an uncertain outcome.',
      review: 'approved',
    },
    {
      line: 'मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि',
      simpleEn: 'Do not let the fruit of action be your motive, and do not hold on to inaction either.',
      simpleHi: 'कर्म के फल को अपना हेतु मत बनाओ, और अकर्म में भी तुम्हारी आसक्ति न हो।',
      terms: [
        { word: 'कर्मफलहेतुः', iast: 'karmaphalahetuḥ', meaning: 'one whose motive is the fruit of action' },
        { word: 'सङ्गः', iast: 'saṅgaḥ', meaning: 'attachment' },
        { word: 'अकर्मणि', iast: 'akarmaṇi', meaning: 'in inaction' },
      ],
      context: 'The second half guards against two errors: acting only for results, and withdrawing from action.',
      review: 'approved',
    },
  ],
  'bhagavadgita:2:48': [
    {
      line: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय',
      simpleEn: 'Established in Yoga, perform actions, casting off attachment, O Dhananjaya.',
      simpleHi: 'हे धनञ्जय! आसक्ति को त्यागकर और योग में स्थित होकर अपने कर्मों को करो।',
      terms: [
        { word: 'योगस्थः', iast: 'yoga-sthaḥ', meaning: 'established in equanimity / yoga' },
        { word: 'कुरु', iast: 'kuru', meaning: 'perform' },
        { word: 'कर्माणि', iast: 'karmāṇi', meaning: 'duties / actions' },
        { word: 'सङ्गम्', iast: 'saṅgam', meaning: 'attachment, clinging' },
        { word: 'त्यक्त्वा', iast: 'tyaktvā', meaning: 'having abandoned' },
      ],
      context: 'Krishna defines the inner stance of yoga before taking action in the world.',
      review: 'approved',
    },
    {
      line: 'सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते',
      simpleEn: 'Being balanced in success and failure; this evenness of mind is called Yoga.',
      simpleHi: 'सिद्धि और असिद्धि में समभाव रहो; यह समत्व ही योग कहलाता है।',
      terms: [
        { word: 'सिद्ध्यसिद्ध्योः', iast: 'siddhi-asiddhyoḥ', meaning: 'in success and failure' },
        { word: 'समः', iast: 'samaḥ', meaning: 'even-minded, balanced' },
        { word: 'समत्वम्', iast: 'samatvam', meaning: 'equanimity, balance of mind' },
        { word: 'योगः उच्यते', iast: 'yogaḥ ucyate', meaning: 'is called yoga' },
      ],
      context: 'Krishna provides the canonical definition of Yoga as Samatvam (equanimity).',
      review: 'approved',
    },
  ],
  'bhagavadgita:2:55': [
    {
      line: 'प्रजहाति यदा कामान् सर्वान् पार्थ मनोगतान्',
      simpleEn: 'When one completely abandons all desires arising in the mind, O Arjuna.',
      simpleHi: 'हे पार्थ! जब मनुष्य मन में उत्पन्न होने वाली समस्त कामनाओं का त्याग कर देता है।',
      terms: [
        { word: 'प्रजहाति', iast: 'prajahāti', meaning: 'completely relinquishes / casts off' },
        { word: 'सर्वान् कामान्', iast: 'sarvān kāmān', meaning: 'all desires / cravings' },
        { word: 'मनोगतान्', iast: 'manogatān', meaning: 'arisen in the mind' },
      ],
      context: 'Krishna begins his answer to Arjuna’s query about the sthitaprajña by targeting the internal root: mental desires.',
      review: 'approved',
    },
    {
      line: 'आत्मन्येवात्मना तुष्टः स्थितप्रज्ञस्तदोच्यते',
      simpleEn: 'And is satisfied in the Self alone by the Self, then one is said to be of steady wisdom.',
      simpleHi: 'और अपनी अंतरात्मा में ही अपने आप से संतुष्ट रहता है, तब वह स्थितप्रज्ञ कहलाता है।',
      terms: [
        { word: 'आत्मनि एव', iast: 'ātmani eva', meaning: 'in the Self alone' },
        { word: 'आत्मना तुष्टः', iast: 'ātmanā tuṣṭaḥ', meaning: 'contented by the Self' },
        { word: 'स्थितप्रज्ञः', iast: 'sthita-prajñaḥ', meaning: 'one of steady wisdom' },
        { word: 'तदा उच्यते', iast: 'tadā ucyate', meaning: 'is then called / said to be' },
      ],
      context: 'True wisdom is defined not by external speech, but by self-contained spiritual fulfillment that needs no external props.',
      review: 'approved',
    },
  ],
  'bhagavadgita:2:56': [
    {
      line: 'दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः',
      simpleEn: 'One whose mind is unperturbed in sorrow, and who is free from craving in pleasures.',
      simpleHi: 'जिसका मन दुःखों में विचलित नहीं होता, और जो सुखों में लालसा से रहित है।',
      terms: [
        { word: 'दुःखेषु', iast: 'duḥkheṣu', meaning: 'in sorrows / distress' },
        { word: 'अनुद्विग्नमनाः', iast: 'anudvigna-manāḥ', meaning: 'mind unagitated / free from panic' },
        { word: 'सुखेषु', iast: 'sukheṣu', meaning: 'in pleasures / joys' },
        { word: 'विगतस्पृहः', iast: 'vigata-spṛhaḥ', meaning: 'free from craving / thirst' },
      ],
      context: 'Krishna outlines the emotional poise of the enlightened sage when meeting worldly dualities.',
      review: 'approved',
    },
    {
      line: 'वीतरागभयक्रोधः स्थितधीर्मुनिरुच्यते',
      simpleEn: 'Free from passion, fear, and anger, such a person is called a sage of steady mind.',
      simpleHi: 'जिसके राग, भय और क्रोध समाप्त हो चुके हैं, वह स्थिरबुद्धि मुनि कहलाता है।',
      terms: [
        { word: 'वीत', iast: 'vīta', meaning: 'freed from / departed' },
        { word: 'राग-भय-क्रोधः', iast: 'rāga-bhaya-krodhaḥ', meaning: 'attachment, fear, and anger' },
        { word: 'स्थितधीः', iast: 'sthita-dhīḥ', meaning: 'of steady discernment / intellect' },
        { word: 'मुनिः उच्यते', iast: 'muniḥ ucyate', meaning: 'is called a contemplative sage' },
      ],
      context: 'Freedom from the toxic triad of rāga, bhaya, and krodha stabilizes the discriminative intellect.',
      review: 'approved',
    },
  ],
  'bhagavadgita:2:62': [
    {
      line: 'ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते',
      simpleEn: 'While contemplating sense objects, a person develops attachment to them.',
      simpleHi: 'विषयों का निरंतर चिंतन करने वाले पुरुष की उनमें आसक्ति हो जाती है।',
      terms: [
        { word: 'ध्यायतः', iast: 'dhyāyataḥ', meaning: 'contemplating / brooding upon' },
        { word: 'विषयान्', iast: 'viṣayān', meaning: 'sense objects' },
        { word: 'पुंसः', iast: 'puṁsaḥ', meaning: 'of a person' },
        { word: 'सङ्गः तेषु उपजायते', iast: 'saṅgaḥ teṣu upajāyate', meaning: 'attachment to them is born' },
      ],
      context: 'Krishna identifies the subtle initial spark of mental decline: passive mental daydreaming about sensory objects.',
      review: 'approved',
    },
    {
      line: 'सङ्गात् संजायते कामः कामात्क्रोधोऽभिजायते',
      simpleEn: 'From attachment desire is born; from desire anger arises.',
      simpleHi: 'आसक्ति से कामना उत्पन्न होती है, और कामना में विघ्न पड़ने से क्रोध पैदा होता है।',
      terms: [
        { word: 'सङ्गात्', iast: 'saṅgāt', meaning: 'from attachment' },
        { word: 'संजायते कामः', iast: 'saṁjāyate kāmaḥ', meaning: 'desire / longing arises' },
        { word: 'कामात्', iast: 'kāmāt', meaning: 'from thwarted desire' },
        { word: 'क्रोधः अभिजायते', iast: 'krodhaḥ abhijāyate', meaning: 'anger is born' },
      ],
      context: 'Krishna reveals the psychological link between frustrated craving and volcanic anger.',
      review: 'approved',
    },
  ],
  'bhagavadgita:2:63': [
    {
      line: 'क्रोधाद्भवति संमोहः संमोहात्स्मृतिविभ्रमः',
      simpleEn: 'From anger arises delusion, and from delusion comes confusion of memory.',
      simpleHi: 'क्रोध से सम्मोह (अविवेक) उत्पन्न होता है, और सम्मोह से स्मृति भ्रमित हो जाती है।',
      terms: [
        { word: 'क्रोधात्', iast: 'krodhāt', meaning: 'from anger' },
        { word: 'भवति संमोहः', iast: 'bhavati saṁmohaḥ', meaning: 'delusion / loss of perspective arises' },
        { word: 'संमोहात्', iast: 'saṁmohāt', meaning: 'from delusion' },
        { word: 'स्मृतिविभ्रमः', iast: 'smṛti-vibhramaḥ', meaning: 'confusion / loss of moral memory' },
      ],
      context: 'Anger blinds reason, causing one to forget past ethical lessons and core commitments.',
      review: 'approved',
    },
    {
      line: 'स्मृतिभ्रंशाद् बुद्धिनाशो बुद्धिनाशात्प्रणश्यति',
      simpleEn: 'From loss of memory comes ruin of the intellect; and from ruin of intellect, one perishes.',
      simpleHi: 'स्मृति के भ्रम से बुद्धि का नाश होता है, और बुद्धि के नाश से मनुष्य नष्ट हो जाता है।',
      terms: [
        { word: 'स्मृतिभ्रंशात्', iast: 'smṛti-bhraṁśāt', meaning: 'from decay of memory' },
        { word: 'बुद्धिनाशः', iast: 'buddhi-nāśaḥ', meaning: 'ruin / destruction of intellect' },
        { word: 'बुद्धिनाशात्', iast: 'buddhi-nāśāt', meaning: 'from ruin of intellect' },
        { word: 'प्रणश्यति', iast: 'praṇaśyati', meaning: 'one falls into total ruin' },
      ],
      context: 'The tragic climax of the downfall chain: when discernment dies, human spiritual potential is lost.',
      review: 'approved',
    },
  ],
};

/* ── Cross-scripture connections ───────────────────────────────────── */

export type ConnectionKind = 'similar' | 'complementary' | 'different-emphasis' | 'narrative' | 'commentary';

export const CONNECTION_LABEL: Record<ConnectionKind, string> = {
  similar: 'Similar teaching',
  complementary: 'Complementary teaching',
  'different-emphasis': 'Different emphasis',
  narrative: 'Narrative example',
  commentary: 'Commentary connection',
};

export interface Connection {
  kind: ConnectionKind;
  scriptureTitle: string;
  reference: string;
  /** Route in this library, when the verse exists here. */
  href?: string;
  summary: string;
  /** Why the editors link these two passages. */
  reason: string;
  review: ReviewStatus;
}

export const CONNECTIONS: Record<string, Connection[]> = {
  'bhagavadgita:2:11': [
    {
      kind: 'similar',
      scriptureTitle: 'Bhagavad Gita',
      reference: '2.12',
      href: '/scripture/bhagavadgita/chapter/2/verse/12',
      summary: 'Never was there a time when I, you, or these kings did not exist, nor shall we ever cease to be.',
      reason: 'Immediately reinforces Krishna’s opening statement that grief is unfounded because individual consciousness is eternal.',
      review: 'approved',
    },
    {
      kind: 'complementary',
      scriptureTitle: 'Bhagavad Gita',
      reference: '2.20',
      href: '/scripture/bhagavadgita/chapter/2/verse/20',
      summary: 'The conscious Self is never born, never dies, and is unslain when the body is slain.',
      reason: 'Provides the full metaphysical exposition for why the wise mourn neither the living nor the dead.',
      review: 'approved',
    },
  ],
  'bhagavadgita:2:13': [
    {
      kind: 'complementary',
      scriptureTitle: 'Bhagavad Gita',
      reference: '2.22',
      href: '/scripture/bhagavadgita/chapter/2/verse/22',
      summary: 'Just as a person casts off worn-out garments and puts on new ones, the Self casts off worn-out bodies.',
      reason: 'Pairs the transition of life stages (2.13) with the metaphor of changing garments at death (2.22).',
      review: 'approved',
    },
    {
      kind: 'similar',
      scriptureTitle: 'Bhagavad Gita',
      reference: '2.14',
      href: '/scripture/bhagavadgita/chapter/2/verse/14',
      summary: 'Sensory dualities of cold, heat, pleasure, and pain are transient and must be endured.',
      reason: 'Connects the changing physical vessel (2.13) with the fleeting sensory experiences felt through it (2.14).',
      review: 'approved',
    },
  ],
  'bhagavadgita:2:14': [
    {
      kind: 'complementary',
      scriptureTitle: 'Bhagavad Gita',
      reference: '2.15',
      href: '/scripture/bhagavadgita/chapter/2/verse/15',
      summary: 'The person whom these dualities do not agitate, who is steady in pain and pleasure, is fit for immortality.',
      reason: '2.15 explains the spiritual result of cultivating the forbearance taught in 2.14.',
      review: 'approved',
    },
    {
      kind: 'similar',
      scriptureTitle: 'Bhagavad Gita',
      reference: '2.48',
      href: '/scripture/bhagavadgita/chapter/2/verse/48',
      summary: 'Equanimity in action and outcome (samatvaṁ yoga ucyate).',
      reason: 'Titikṣā (enduring sensory dualities in 2.14) is the psychological precursor to Samatvam (equanimity in action in 2.48).',
      review: 'approved',
    },
  ],
  'bhagavadgita:2:20': [
    {
      kind: 'complementary',
      scriptureTitle: 'Bhagavad Gita',
      reference: '2.22',
      href: '/scripture/bhagavadgita/chapter/2/verse/22',
      summary: 'Just as a person casts off worn-out garments and puts on new ones, the Self casts off worn-out bodies and enters new ones.',
      reason: 'Provides the iconic metaphor illustrating the changelessness of the Self across bodily transitions described in 2.20.',
      review: 'approved',
    },
    {
      kind: 'similar',
      scriptureTitle: 'Bhagavad Gita',
      reference: '2.23',
      href: '/scripture/bhagavadgita/chapter/2/verse/23',
      summary: 'Weapons cannot cleave the Self, fire cannot burn it, water cannot wet it, nor can the wind dry it.',
      reason: 'Elaborates on the unslain and invulnerable nature of the conscious Self declared in 2.20.',
      review: 'approved',
    },
  ],
  'bhagavadgita:2:22': [
    {
      kind: 'similar',
      scriptureTitle: 'Bhagavad Gita',
      reference: '2.13',
      href: '/scripture/bhagavadgita/chapter/2/verse/13',
      summary: 'The embodied soul passes through childhood, youth, and old age within this body.',
      reason: 'Both verses explain the continuity of the indwelling soul through bodily transitions.',
      review: 'approved',
    },
    {
      kind: 'complementary',
      scriptureTitle: 'Bhagavad Gita',
      reference: '2.20',
      href: '/scripture/bhagavadgita/chapter/2/verse/20',
      summary: 'Unborn, eternal, ancient; not slain when the body is slain.',
      reason: 'Illustrates through vivid metaphor the immortality of the conscious occupant declared in 2.20.',
      review: 'approved',
    },
  ],
  'bhagavadgita:2:47': [
    {
      kind: 'complementary',
      scriptureTitle: 'Bhagavad Gita',
      reference: '2.48',
      href: '/scripture/bhagavadgita/chapter/2/verse/48',
      summary: 'Continues the thought: act steadily, give up attachment, stay balanced in success and failure.',
      reason: 'The next verse names the balance that 2.47 asks for.',
      review: 'approved',
    },
    {
      kind: 'complementary',
      scriptureTitle: 'Bhagavad Gita',
      reference: '3.19',
      href: '/scripture/bhagavadgita/chapter/3/verse/19',
      summary: 'Advises doing one’s duty without attachment.',
      reason: 'It returns to the same idea of unattached action in the chapter on Karma Yoga.',
      review: 'approved',
    },
    {
      kind: 'different-emphasis',
      scriptureTitle: 'Isha Upanishad',
      reference: '2',
      href: '/scripture/ishavasya/chapter/1/verse/2',
      summary: 'Speaks of continuing to act through life, and of action not binding the person.',
      reason: 'Both connect action with freedom, but this verse addresses how to live, not the motive behind one task. Whether the two teach the same thing is a matter for scholars, not asserted here.',
      review: 'approved',
    },
  ],
  'bhagavadgita:2:48': [
    {
      kind: 'complementary',
      scriptureTitle: 'Bhagavad Gita',
      reference: '2.47',
      href: '/scripture/bhagavadgita/chapter/2/verse/47',
      summary: 'Your entitlement is to work only, never to its fruits.',
      reason: '2.47 establishes unattached action, while 2.48 defines the mental poise (samatvam) necessary to practice it.',
      review: 'approved',
    },
    {
      kind: 'complementary',
      scriptureTitle: 'Bhagavad Gita',
      reference: '2.50',
      href: '/scripture/bhagavadgita/chapter/2/verse/50',
      summary: 'Yoga is skill and discernment in action (yogaḥ karmasu kauśalam).',
      reason: 'Complements the definition of Yoga as evenness (2.48) with Yoga as excellence in action (2.50).',
      review: 'approved',
    },
  ],
  'bhagavadgita:2:55': [
    {
      kind: 'complementary',
      scriptureTitle: 'Bhagavad Gita',
      reference: '2.56',
      href: '/scripture/bhagavadgita/chapter/2/verse/56',
      summary: 'Unshaken in sorrow, free from craving in pleasures, released from passion, fear, and anger.',
      reason: '2.55 establishes the internal foundation (content in Self), while 2.56 shows how that foundation behaves in worldly events.',
      review: 'approved',
    },
    {
      kind: 'similar',
      scriptureTitle: 'Bhagavad Gita',
      reference: '2.71',
      href: '/scripture/bhagavadgita/chapter/2/verse/71',
      summary: 'Attaining peace by relinquishing all desires, egoism, and possessiveness.',
      reason: 'Reaffirms that casting away desires leads directly to supreme tranquility (śānti).',
      review: 'approved',
    },
  ],
  'bhagavadgita:2:56': [
    {
      kind: 'similar',
      scriptureTitle: 'Bhagavad Gita',
      reference: '2.55',
      href: '/scripture/bhagavadgita/chapter/2/verse/55',
      summary: 'Marks of steady wisdom: content in the Self alone, casting off mental desires.',
      reason: 'The internal contentment of 2.55 directly fuels the emotional stability across sorrow and pleasure described in 2.56.',
      review: 'approved',
    },
    {
      kind: 'complementary',
      scriptureTitle: 'Bhagavad Gita',
      reference: '2.48',
      href: '/scripture/bhagavadgita/chapter/2/verse/48',
      summary: 'Equanimity in success and failure is yoga (samatvaṁ yoga ucyate).',
      reason: 'Connects the Karma Yoga practice of equanimity (2.48) with its fully realized embodiment in the sage (2.56).',
      review: 'approved',
    },
  ],
  'bhagavadgita:2:62': [
    {
      kind: 'complementary',
      scriptureTitle: 'Bhagavad Gita',
      reference: '2.63',
      href: '/scripture/bhagavadgita/chapter/2/verse/63',
      summary: 'From anger comes delusion, confusion of memory, ruin of intellect, and downfall.',
      reason: '2.62 and 2.63 together form the complete eight-step ladder of psychological downfall.',
      review: 'approved',
    },
    {
      kind: 'different-emphasis',
      scriptureTitle: 'Bhagavad Gita',
      reference: '2.64',
      href: '/scripture/bhagavadgita/chapter/2/verse/64',
      summary: 'Moving among sense objects with senses disciplined and free from attraction and aversion brings serenity.',
      reason: 'Contrasts the trap of mental fixation with the disciplined engagement that yields prasāda (serenity).',
      review: 'approved',
    },
  ],
  'bhagavadgita:2:63': [
    {
      kind: 'similar',
      scriptureTitle: 'Bhagavad Gita',
      reference: '2.62',
      href: '/scripture/bhagavadgita/chapter/2/verse/62',
      summary: 'Contemplating objects leads to attachment, desire, and anger.',
      reason: 'The preceding half of the psychological downfall sequence.',
      review: 'approved',
    },
    {
      kind: 'complementary',
      scriptureTitle: 'Bhagavad Gita',
      reference: '2.65',
      href: '/scripture/bhagavadgita/chapter/2/verse/65',
      summary: 'In serene clarity, all sorrows are dissolved and the intellect becomes firmly established.',
      reason: 'Presents the positive counterpart to ruin: how serene discernment protects the intellect from destruction.',
      review: 'approved',
    },
  ],
};
