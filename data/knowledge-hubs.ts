/**
 * Knowledge hub content (Phase 5).
 * One hub per discovery concept. Verses, concepts, questions and topics are
 * derived from data/wisdom-concepts.ts and data/wisdom-questions.ts at render
 * time; this file holds only hub-specific editorial content (overview,
 * teachings, scriptures, modern applications) so nothing is duplicated.
 */
import type { WisdomConceptVerseRef } from './wisdom-concepts';

export interface HubTeaching {
  titleEn: string;
  titleHi: string;
  bodyEn: string;
  bodyHi: string;
}

export interface HubScripture {
  id: string;
  titleEn: string;
  titleHi: string;
  whyEn: string;
  whyHi: string;
}

export interface HubApplication {
  situationEn: string;
  situationHi: string;
  practiceEn: string;
  practiceHi: string;
}

export interface KnowledgeHub {
  /** URL slug under /knowledge/[slug]; matches a wisdom-concept id. */
  slug: string;
  conceptSlug: string;
  taglineEn: string;
  taglineHi: string;
  overviewEn: string;
  overviewHi: string;
  keyTeachings: HubTeaching[];
  /** Verses beyond the concept's own keyVerses. */
  extraVerses: WisdomConceptVerseRef[];
  scriptures: HubScripture[];
  modernApplications: HubApplication[];
  /** wisdom-question ids featured on this hub. */
  featuredQuestions: string[];
}

const gita = (chapter: number, verse: number, reference: string): WisdomConceptVerseRef => ({
  scriptureId: 'bhagavadgita',
  chapter,
  verse,
  reference,
});

export const KNOWLEDGE_HUB_SLUGS = [
  'dharma',
  'karma',
  'fear',
  'anger',
  'mind',
  'discipline',
  'attachment',
  'detachment',
  'bhakti',
  'wisdom',
] as const;

export type KnowledgeHubSlug = (typeof KNOWLEDGE_HUB_SLUGS)[number];

export const knowledgeHubs: KnowledgeHub[] = [
  {
    slug: 'dharma',
    conceptSlug: 'dharma',
    taglineEn: 'Do what is right because it is yours to do.',
    taglineHi: 'जो सही है वही करें, क्योंकि वह आपका कर्तव्य है।',
    overviewEn:
      'Dharma is the order that holds life together: the duties, ethics and laws — outer and inner — that keep individuals, families and societies from falling apart. The Gita presents it most sharply as svadharma, your own duty: better done imperfectly than another\u2019s duty done well.',
    overviewHi:
      'धर्म वह व्यवस्था है जो जीवन को धारण करती है: वे कर्तव्य, नीति और नियम — बाहरी और आंतरिक — जो व्यक्ति, परिवार और समाज को बिखरने से बचाते हैं। गीता इसे स्वधर्म के रूप में प्रस्तुत करती है: दूसरे के धर्म को अच्छी तरह निभाने से अच्छा है अपने धर्म को अपूर्णता से निभाना।',
    keyTeachings: [
      {
        titleEn: 'Your own duty comes first',
        titleHi: 'स्वधर्म सर्वोपरि',
        bodyEn: 'Arjuna\u2019s crisis is everyone\u2019s crisis: the wish to escape a hard role. The teaching is that escape is not freedom; doing your own duty, even imperfectly, is.',
        bodyHi: 'अर्जुन का संकट सबका संकट है: कठिन भूमिका से भागने की इच्छा। शिक्षा यह है कि पलायन स्वतंत्रता नहीं है; अपने कर्तव्य को अपूर्णता से करना ही स्वतंत्रता है।',
      },
      {
        titleEn: 'Dharma protects those who protect it',
        titleHi: 'धर्मो रक्षति रक्षितः',
        bodyEn: 'When conduct aligns with dharma, life holds. When it doesn\u2019t, the disorder returns to the doer. This is not punishment; it is structure.',
        bodyHi: 'जब आचरण धर्म के अनुरूप होता है, जीवन ठहरता है। जब नहीं होता, अव्यवस्था कर्ता पर ही लौटती है। यह दंड नहीं, व्यवस्था है।',
      },
      {
        titleEn: 'Duty is measured by role, not by reward',
        titleHi: 'कर्तव्य की माप भूमिका से, फल से नहीं',
        bodyEn: 'The student studies, the guardian protects, the leader serves the whole. Judging duty by applause or gain distorts it.',
        bodyHi: 'विद्यार्थी पढ़े, रक्षक रक्षा करे, नेता समष्टि की सेवा करे। तालियों या लाभ से कर्तव्य को मापना उसे विकृत करता है।',
      },
      {
        titleEn: 'Right action steadies the mind',
        titleHi: 'सही कर्म मन को स्थिर करता है',
        bodyEn: 'Guilt and evasion agitate; honest duty calms. Much restlessness is simply postponed right action.',
        bodyHi: 'अपराधबोध और पलायन मन को विचलित करते हैं; ईमानदार कर्तव्य शांत करता है। अधिकांश बेचैनी केवल टाला हुआ सही कर्म है।',
      },
    ],
    extraVerses: [gita(4, 7, 'Bhagavad Gita 4.7'), gita(4, 8, 'Bhagavad Gita 4.8')],
    scriptures: [
      {
        id: 'bhagavadgita',
        titleEn: 'Bhagavad Gita',
        titleHi: 'भगवद्गीता',
        whyEn: 'The central teaching on svadharma and selfless duty.',
        whyHi: 'स्वधर्म और निष्काम कर्तव्य का केंद्रीय उपदेश।',
      },
      {
        id: 'ramayana',
        titleEn: 'Ramayana',
        titleHi: 'रामायण',
        whyEn: 'Rama embodies dharma under extreme personal cost.',
        whyHi: 'राम अत्यंत व्यक्तिगत मूल्य पर धर्म का मूर्त रूप हैं।',
      },
    ],
    modernApplications: [
      {
        situationEn: 'A work decision that benefits you but harms the team.',
        situationHi: 'कार्यस्थल पर ऐसा निर्णय जो आपको लाभ दे पर टीम को हानि पहुँचाए।',
        practiceEn: 'Ask: what does my role owe here, regardless of gain? Act on that answer.',
        practiceHi: 'पूछें: लाभ की परवाह किए बिना मेरी भूमिका का यहाँ क्या दायित्व है? उसी के अनुसार कार्य करें।',
      },
      {
        situationEn: 'Family duty conflicts with personal ambition.',
        situationHi: 'पारिवारिक कर्तव्य व्यक्तिगत महत्वाकांक्षा से टकराता है।',
        practiceEn: 'Name both duties honestly, choose consciously, and own the cost without resentment.',
        practiceHi: 'दोनों कर्तव्यों को ईमानदारी से नाम दें, सचेत होकर चुनें, और बिना रोष के उसका मूल्य स्वीकारें।',
      },
      {
        situationEn: 'Temptation to cut corners when nobody is watching.',
        situationHi: 'जब कोई न देख रहा हो तब शॉर्टकट लेने का प्रलोभन।',
        practiceEn: 'Treat the unseen act as the real test of character — because it is.',
        practiceHi: 'अदृश्य कर्म को ही चरित्र की वास्तविक परीक्षा मानें — क्योंकि वही है।',
      },
    ],
    featuredQuestions: ['what-is-my-duty-in-difficult-situations', 'how-to-lead-without-ego'],
  },
  {
    slug: 'karma',
    conceptSlug: 'karma',
    taglineEn: 'You own the effort, never the outcome.',
    taglineHi: 'प्रयास आपका है, फल कभी नहीं।',
    overviewEn:
      'Karma is the law that every act — of body, speech and mind — shapes what follows. It binds when done with craving and liberates when done as offering. The Gita\u2019s nishkama karma turns daily work itself into the path.',
    overviewHi:
      'कर्म वह नियम है कि शरीर, वाणी और मन का प्रत्येक कार्य आगे आने वाले को गढ़ता है। तृष्णा से किया कर्म बाँधता है, अर्पण भाव से किया कर्म मुक्त करता है। गीता का निष्काम कर्म दैनिक कार्य को ही मार्ग बना देता है।',
    keyTeachings: [
      {
        titleEn: 'Right to act, never to the fruit',
        titleHi: 'कर्मण्येवाधिकारस्ते',
        bodyEn: 'Claiming ownership of outcomes is the root of anxiety. Effort is yours; results belong to conditions beyond you.',
        bodyHi: 'परिणामों पर स्वामित्व का दावा ही चिंता की जड़ है। प्रयास आपका है; फल आपसे परे परिस्थितियों के अधीन हैं।',
      },
      {
        titleEn: 'Inaction is also a choice with consequences',
        titleHi: 'अकर्म भी परिणाम वाला विकल्प है',
        bodyEn: 'Refusing to act does not escape karma; it merely chooses drift. Discernment means knowing what action, wrong action and inaction each cost.',
        bodyHi: 'कर्म न करना कर्म से बचना नहीं है; वह केवल भटकाव चुनता है। विवेक का अर्थ है जानना कि कर्म, विकर्म और अकर्म — प्रत्येक का क्या मूल्य है।',
      },
      {
        titleEn: 'Offered work purifies the worker',
        titleHi: 'अर्पित कर्म कर्ता को शुद्ध करता है',
        bodyEn: 'The same task done for ego tightens the knot; done as service it loosens it. Motive, not task, decides bondage or freedom.',
        bodyHi: 'अहंकार के लिए किया गया वही कार्य गाँठ कसता है; सेवा भाव से किया कार्य उसे ढीला करता है। कार्य नहीं, हेतु बंधन या मुक्ति तय करता है।',
      },
      {
        titleEn: 'Small acts compound across a lifetime',
        titleHi: 'छोटे कर्म जीवन भर जुड़ते हैं',
        bodyEn: 'Karma is not only dramatic fate; it is the slow accumulation of habits, impressions and tendencies.',
        bodyHi: 'कर्म केवल नाटकीय भाग्य नहीं है; यह आदतों, संस्कारों और प्रवृत्तियों का धीमा संचय है।',
      },
    ],
    extraVerses: [gita(3, 8, 'Bhagavad Gita 3.8'), gita(5, 11, 'Bhagavad Gita 5.11')],
    scriptures: [
      {
        id: 'bhagavadgita',
        titleEn: 'Bhagavad Gita',
        titleHi: 'भगवद्गीता',
        whyEn: 'Chapters 2–5 develop karma, vikarma and nishkama karma in full.',
        whyHi: 'अध्याय 2–5 में कर्म, विकर्म और निष्काम कर्म का पूर्ण विकास है।',
      },
    ],
    modernApplications: [
      {
        situationEn: 'Exam or interview anxiety about the result.',
        situationHi: 'परीक्षा या साक्षात्कार के परिणाम की चिंता।',
        practiceEn: 'Shift the goal from "I must get this" to "I will prepare fully today." Review effort nightly, not outcomes.',
        practiceHi: 'लक्ष्य को "मुझे यह पाना ही है" से बदलकर "मैं आज पूरी तैयारी करूँगा" करें। प्रतिदिन प्रयास की समीक्षा करें, परिणाम की नहीं।',
      },
      {
        situationEn: 'Work feels meaningless and mechanical.',
        situationHi: 'कार्य निरर्थक और यांत्रिक लगता है।',
        practiceEn: 'Dedicate one routine task daily as service to someone specific. Watch the texture of the work change.',
        practiceHi: 'प्रतिदिन एक नियमित कार्य किसी विशिष्ट व्यक्ति की सेवा के रूप में समर्पित करें। कार्य का स्वरूप बदलता देखें।',
      },
      {
        situationEn: 'Regret over a past mistake keeps looping.',
        situationHi: 'अतीत की भूल पर पछतावा बार-बार लौटता है।',
        practiceEn: 'Extract the lesson in one sentence, make amends where possible, then redirect energy to present right action.',
        practiceHi: 'शिक्षा को एक वाक्य में निकालें, जहाँ संभव हो प्रायश्चित करें, फिर ऊर्जा को वर्तमान सही कर्म में लगाएँ।',
      },
    ],
    featuredQuestions: [
      'how-to-act-without-anxiety-about-results',
      'how-to-find-purpose-in-work',
      'how-to-serve-without-burning-out',
    ],
  },
  {
    slug: 'fear',
    conceptSlug: 'fear',
    taglineEn: 'Face the duty; fear shrinks behind courage.',
    taglineHi: 'कर्तव्य का सामना करें; भय साहस के पीछे सिकुड़ जाता है।',
    overviewEn:
      'Fear narrows perception and freezes action. The tradition treats fear not as an enemy to hate but as a signal to examine: what outcome am I clinging to? Courage is trained through duty, knowledge and devotion — not by waiting until fear leaves.',
    overviewHi:
      'भय दृष्टि को सिकोड़ता है और कर्म को जमा देता है। परंपरा भय को घृणा योग्य शत्रु नहीं, जाँच योग्य संकेत मानती है: मैं किस परिणाम से चिपका हूँ? साहस कर्तव्य, ज्ञान और भक्ति से प्रशिक्षित होता है — भय के जाने की प्रतीक्षा से नहीं।',
    keyTeachings: [
      {
        titleEn: 'Fearlessness is a cultivated quality',
        titleHi: 'अभय साधित गुण है',
        bodyEn: 'The Gita lists fearlessness first among divine qualities — it is grown, not granted. Small brave acts compound.',
        bodyHi: 'गीता दैवी गुणों में अभय को प्रथम रखती है — यह बढ़ाया जाता है, दिया नहीं जाता। छोटे साहसी कार्य जुड़ते जाते हैं।',
      },
      {
        titleEn: 'Shame-fuelled fear must be named',
        titleHi: 'लज्जा से पोषित भय को नाम देना होगा',
        bodyEn: 'Krishna\u2019s first rebuke to Arjuna targets unmanly faint-heartedness born of confusion — naming it is the start of dissolving it.',
        bodyHi: 'अर्जुन को कृष्ण की पहली फटकार मोह से उत्पन्न क्लीवता पर है — उसे नाम देना ही उसे गलाने की शुरुआत है।',
      },
      {
        titleEn: 'The steady mind is not shaken by sorrow',
        titleHi: 'स्थिर मन दुःख से विचलित नहीं होता',
        bodyEn: 'One whose mind is undisturbed in sorrow and free of craving in pleasure is called steady. Fear loses its grip there.',
        bodyHi: 'दुःख में जिसका मन उद्विग्न न हो और सुख में जो तृष्णा से मुक्त हो, वह स्थिर कहलाता है। वहाँ भय की पकड़ छूट जाती है।',
      },
      {
        titleEn: 'Refuge dissolves fear',
        titleHi: 'शरणागति भय को गलाती है',
        bodyEn: 'Devotion redirects the question from "can I handle this?" to "am I held?" — and the grip of fear loosens.',
        bodyHi: 'भक्ति प्रश्न को "क्या मैं यह सँभाल सकता हूँ?" से बदलकर "क्या मैं थामा हुआ हूँ?" कर देती है — और भय की पकड़ ढीली होती है।',
      },
    ],
    extraVerses: [gita(2, 56, 'Bhagavad Gita 2.56'), gita(18, 66, 'Bhagavad Gita 18.66')],
    scriptures: [
      {
        id: 'bhagavadgita',
        titleEn: 'Bhagavad Gita',
        titleHi: 'भगवद्गीता',
        whyEn: 'Opens with Arjuna\u2019s fear and answers it across eighteen chapters.',
        whyHi: 'अर्जुन के भय से आरंभ होकर अठारह अध्यायों में उसका उत्तर देती है।',
      },
    ],
    modernApplications: [
      {
        situationEn: 'Panic before public speaking or a hard conversation.',
        situationHi: 'सार्वजनिक भाषण या कठिन वार्ता से पहले घबराहट।',
        practiceEn: 'Prepare the first two sentences thoroughly, breathe slowly, and begin. Courage follows the first step.',
        practiceHi: 'पहले दो वाक्यों की अच्छी तैयारी करें, धीरे साँस लें, और आरंभ करें। साहस पहले कदम के पीछे आता है।',
      },
      {
        situationEn: 'Fear of failure prevents starting at all.',
        situationHi: 'असफलता का भय शुरुआत ही रोक देता है।',
        practiceEn: 'Shrink the task until the first step feels trivial, then take only that step today.',
        practiceHi: 'कार्य को इतना छोटा करें कि पहला कदम तुच्छ लगे, फिर आज केवल वही कदम उठाएँ।',
      },
      {
        situationEn: 'Night-time worry loops that won\u2019t stop.',
        situationHi: 'रात में न रुकने वाले चिंता के चक्र।',
        practiceEn: 'Write tomorrow\u2019s single next action on paper, then a short prayer or verse recitation before sleep.',
        practiceHi: 'कल की एक अगली क्रिया कागज़ पर लिखें, फिर सोने से पहले संक्षिप्त प्रार्थना या श्लोक पाठ।',
      },
    ],
    featuredQuestions: ['how-to-overcome-fear', 'how-to-calm-a-restless-mind'],
  },
  {
    slug: 'anger',
    conceptSlug: 'anger',
    taglineEn: 'Catch the spark before it becomes the fire.',
    taglineHi: 'चिंगारी को आग बनने से पहले पकड़ें।',
    overviewEn:
      'Anger is mapped with unusual precision: frustrated desire breeds anger, anger breeds delusion, delusion destroys judgment. The chain is interrupted earliest — at desire — and latest through patience, discrimination and sense control.',
    overviewHi:
      'क्रोध का मानचित्र असामान्य सूक्ष्मता से दिया गया है: अतृप्त कामना से क्रोध, क्रोध से मोह, मोह से बुद्धि का नाश। शृंखला सबसे पहले — कामना पर — और सबसे बाद में धैर्य, विवेक और इंद्रिय-संयम से तोड़ी जाती है।',
    keyTeachings: [
      {
        titleEn: 'The chain: desire → anger → delusion → ruin',
        titleHi: 'शृंखला: काम → क्रोध → मोह → नाश',
        bodyEn: 'Memorize the sequence. Each link is an exit point; the earlier the exit, the cheaper the cost.',
        bodyHi: 'इस क्रम को याद रखें। प्रत्येक कड़ी निकास बिंदु है; जितना पहले निकलें, उतनी कम कीमत।',
      },
      {
        titleEn: 'Anger, greed and lust are the three gates of darkness',
        titleHi: 'काम, क्रोध, लोभ — नरक के तीन द्वार',
        bodyEn: 'They are to be abandoned deliberately. Naming anger as a gate — not a personality trait — makes release possible.',
        bodyHi: 'इन्हें जानबूझकर त्यागना है। क्रोध को द्वार मानना — व्यक्तित्व नहीं — मुक्ति संभव करता है।',
      },
      {
        titleEn: 'Sense withdrawal starves anger',
        titleHi: 'इंद्रिय-संयम क्रोध को भूखा रखता है',
        bodyEn: 'Like a tortoise withdrawing limbs, pulling senses back from provocation removes anger\u2019s fuel.',
        bodyHi: 'कछुए के अंग समेटने की तरह, उकसावे से इंद्रियों को समेटना क्रोध का ईंधन हटा देता है।',
      },
      {
        titleEn: 'Patience endures what anger cannot fix',
        titleHi: 'धैर्य वह सहता है जो क्रोध ठीक नहीं कर सकता',
        bodyEn: 'Contact with heat and cold, pleasure and pain, comes and goes. Enduring it without reaction is strength, not passivity.',
        bodyHi: 'सर्दी-गर्मी, सुख-दुःख का संयोग आता-जाता है। बिना प्रतिक्रिया उसे सहना शक्ति है, निष्क्रियता नहीं।',
      },
    ],
    extraVerses: [gita(2, 64, 'Bhagavad Gita 2.64'), gita(5, 23, 'Bhagavad Gita 5.23')],
    scriptures: [
      {
        id: 'bhagavadgita',
        titleEn: 'Bhagavad Gita',
        titleHi: 'भगवद्गीता',
        whyEn: 'Gita 2.62–63 and 16.21 give the classic anger psychology.',
        whyHi: 'गीता 2.62–63 और 16.21 क्रोध का शास्त्रीय मनोविज्ञान देते हैं।',
      },
    ],
    modernApplications: [
      {
        situationEn: 'Rage in traffic or at a rude message.',
        situationHi: 'ट्रैफ़िक में या असभ्य संदेश पर क्रोध।',
        practiceEn: 'Pause, exhale slowly, and name the frustrated desire underneath. Respond after ten breaths, not before.',
        practiceHi: 'रुकें, धीरे साँस छोड़ें, और नीचे दबी अतृप्त इच्छा को नाम दें। दस साँसों के बाद उत्तर दें, पहले नहीं।',
      },
      {
        situationEn: 'Recurring fights with a family member.',
        situationHi: 'परिवार के सदस्य से बार-बार झगड़ा।',
        practiceEn: 'Write the unmet need in one sentence before the next talk. Discuss the need, not the person.',
        practiceHi: 'अगली बातचीत से पहले अपूर्ण आवश्यकता को एक वाक्य में लिखें। व्यक्ति पर नहीं, आवश्यकता पर चर्चा करें।',
      },
      {
        situationEn: 'Anger at yourself for repeated failure.',
        situationHi: 'बार-बार असफलता पर स्वयं पर क्रोध।',
        practiceEn: 'Separate the act from the actor: condemn the pattern, coach the person — even when both are you.',
        practiceHi: 'कर्म को कर्ता से अलग करें: प्रवृत्ति की निंदा करें, व्यक्ति को प्रशिक्षित करें — भले दोनों आप ही हों।',
      },
    ],
    featuredQuestions: ['how-to-control-anger', 'how-to-let-go-of-attachment'],
  },
  {
    slug: 'mind',
    conceptSlug: 'mind',
    taglineEn: 'Train the mind; don\u2019t obey it.',
    taglineHi: 'मन को साधें; उसका अनुसरण न करें।',
    overviewEn:
      'The mind is declared both friend and foe: controlled, it lifts; uncontrolled, it drags down like an enemy. The method is twofold and repeated everywhere — practice (abhyasa) and dispassion (vairagya) — applied patiently to a naturally restless instrument.',
    overviewHi:
      'मन को मित्र और शत्रु दोनों घोषित किया गया है: वश में हो तो उठाता है, अवश हो तो शत्रु की तरह नीचे खींचता है। विधि दोहरी है और सर्वत्र दोहराई गई — अभ्यास और वैराग्य — स्वभाव से चंचल यंत्र पर धैर्यपूर्वक प्रयुक्त।',
    keyTeachings: [
      {
        titleEn: 'You are not your passing thoughts',
        titleHi: 'आप अपने क्षणिक विचार नहीं हैं',
        bodyEn: 'Thoughts arrive and leave; the witness remains. Identifying with every thought is the basic error practice corrects.',
        bodyHi: 'विचार आते-जाते हैं; साक्षी रहता है। हर विचार से तादात्म्य ही वह मूल भूल है जिसे अभ्यास सुधारता है।',
      },
      {
        titleEn: 'Abhyasa and vairagya, together',
        titleHi: 'अभ्यास और वैराग्य, साथ-साथ',
        bodyEn: 'Practice without dispassion becomes ambition; dispassion without practice becomes dullness. The restless mind needs both.',
        bodyHi: 'वैराग्यहीन अभ्यास महत्वाकांक्षा बनता है; अभ्यासहीन वैराग्य जड़ता। चंचल मन को दोनों चाहिए।',
      },
      {
        titleEn: 'Withdraw the senses like a tortoise',
        titleHi: 'कछुए की तरह इंद्रियाँ समेटें',
        bodyEn: 'Steadiness comes from drawing the senses back from their objects at will — a skill built in small daily repetitions.',
        bodyHi: 'स्थिरता इंद्रियों को इच्छानुसार विषयों से समेटने से आती है — छोटे दैनिक अभ्यासों में निर्मित कौशल।',
      },
      {
        titleEn: 'Lift yourself by yourself',
        titleHi: 'अपने द्वारा अपना उद्धार करें',
        bodyEn: 'No one else can do the inner work. The same mind that binds, trained, is the instrument of freedom.',
        bodyHi: 'आंतरिक कार्य कोई और नहीं कर सकता। जो मन बाँधता है, प्रशिक्षित होकर वही मुक्ति का साधन है।',
      },
    ],
    extraVerses: [gita(2, 68, 'Bhagavad Gita 2.68'), gita(6, 35, 'Bhagavad Gita 6.35')],
    scriptures: [
      {
        id: 'bhagavadgita',
        titleEn: 'Bhagavad Gita',
        titleHi: 'भगवद्गीता',
        whyEn: 'Chapter 6 is the classic manual of mind training.',
        whyHi: 'अध्याय 6 मन-प्रशिक्षण का शास्त्रीय ग्रंथ है।',
      },
    ],
    modernApplications: [
      {
        situationEn: 'Phone checking every few minutes.',
        situationHi: 'हर कुछ मिनट में फ़ोन देखना।',
        practiceEn: 'Fix two check-in windows daily. Notice the itch without obeying it — that noticing is the training.',
        practiceHi: 'दिन में दो नियत समय तय करें। खुजली को देखें, मानें नहीं — वही देखना प्रशिक्षण है।',
      },
      {
        situationEn: 'Overthinking a decision already made.',
        situationHi: 'लिए गए निर्णय पर अत्यधिक सोचना।',
        practiceEn: 'Write the decision and its reason once, close the file, and redirect returning thoughts to the next action.',
        practiceHi: 'निर्णय और उसका कारण एक बार लिखें, फ़ाइल बंद करें, और लौटते विचारों को अगली क्रिया की ओर मोड़ें।',
      },
      {
        situationEn: 'Mind races the moment you sit to meditate.',
        situationHi: 'ध्यान बैठते ही मन दौड़ने लगता है।',
        practiceEn: 'Expect the restlessness; count ten slow breaths. Returning attention — not holding it — is the rep.',
        practiceHi: 'बेचैनी की अपेक्षा रखें; दस धीमी साँसें गिनें। ध्यान टिकाना नहीं, लौटाना ही अभ्यास है।',
      },
    ],
    featuredQuestions: ['how-to-calm-a-restless-mind', 'how-to-find-inner-peace-amid-noise'],
  },
  {
    slug: 'discipline',
    conceptSlug: 'discipline',
    taglineEn: 'Small vows, kept daily, reshape the mind.',
    taglineHi: 'छोटे संकल्प, प्रतिदिन निभाए, मन को नया रूप देते हैं।',
    overviewEn:
      'Discipline (abhyasa) is steady practice sustained over time without interruption. The Gita is blunt: the restless mind is controlled by practice and dispassion — there is no third method and no shortcut. Regularity matters more than intensity.',
    overviewHi:
      'संयम (अभ्यास) बिना व्यवधान लंबे समय तक टिकी स्थिर साधना है। गीता स्पष्ट है: चंचल मन अभ्यास और वैराग्य से वश होता है — न कोई तीसरी विधि है, न कोई शॉर्टकट। तीव्रता से अधिक नियमितता मायने रखती है।',
    keyTeachings: [
      {
        titleEn: 'Practice, sustained and unbroken',
        titleHi: 'दीर्घकाल निरंतर अभ्यास',
        bodyEn: 'Yoga\u2019s method is practice held for a long time, without break, with devotion. Sporadic intensity cannot substitute for it.',
        bodyHi: 'योग की विधि लंबे समय तक, बिना व्यवधान, निष्ठा से टिका अभ्यास है। छिटपुट तीव्रता इसका विकल्प नहीं हो सकती।',
      },
      {
        titleEn: 'Regulate the basics first',
        titleHi: 'पहले बुनियाद नियमित करें',
        bodyEn: 'Yoga is declared impossible for the immoderate in food, sleep, work and rest. Mastery begins with the timetable, not the technique.',
        bodyHi: 'आहार, निद्रा, कर्म और विश्राम में अमर्यादित के लिए योग असंभव घोषित है। स्वामित्व तकनीक से नहीं, दिनचर्या से आरंभ होता है।',
      },
      {
        titleEn: 'Gradual withdrawal beats suppression',
        titleHi: 'क्रमिक समेटना दमन से बेहतर',
        bodyEn: 'The senses are withdrawn little by little with the intellect held firm — gentle persistence, not violent control.',
        bodyHi: 'इंद्रियाँ बुद्धि को स्थिर रखकर धीरे-धीरे समेटी जाती हैं — कोमल दृढ़ता, हिंसक नियंत्रण नहीं।',
      },
      {
        titleEn: 'Fall, return, repeat',
        titleHi: 'गिरें, लौटें, दोहराएँ',
        bodyEn: 'Wherever the mind wanders, bring it back under the self\u2019s control. The return — repeated ten thousand times — is the whole method.',
        bodyHi: 'मन जहाँ-जहाँ भटके, उसे आत्मा के वश में लौटाएँ। वह लौटना — दस हज़ार बार दोहराया — ही संपूर्ण विधि है।',
      },
    ],
    extraVerses: [gita(6, 16, 'Bhagavad Gita 6.16'), gita(6, 25, 'Bhagavad Gita 6.25')],
    scriptures: [
      {
        id: 'bhagavadgita',
        titleEn: 'Bhagavad Gita',
        titleHi: 'भगवद्गीता',
        whyEn: 'Chapter 6 details the daily discipline of the meditator.',
        whyHi: 'अध्याय 6 ध्यानी की दैनिक साधना का विवरण देता है।',
      },
    ],
    modernApplications: [
      {
        situationEn: 'Starting a habit and abandoning it within a week.',
        situationHi: 'आदत शुरू करके एक सप्ताह में छोड़ देना।',
        practiceEn: 'Shrink the vow until it is unbreakable (five minutes), and track only whether it was kept.',
        practiceHi: 'संकल्प को इतना छोटा करें कि टूटे ही नहीं (पाँच मिनट), और केवल यही देखें कि निभा या नहीं।',
      },
      {
        situationEn: 'Irregular sleep and scattered energy.',
        situationHi: 'अनियमित निद्रा और बिखरी ऊर्जा।',
        practiceEn: 'Fix sleep and waking times for two weeks before adding any new practice.',
        practiceHi: 'कोई नया अभ्यास जोड़ने से पहले दो सप्ताह तक सोने-जागने का समय स्थिर करें।',
      },
      {
        situationEn: 'Study or sadhana keeps getting postponed.',
        situationHi: 'अध्ययन या साधना बार-बार टलती है।',
        practiceEn: 'Anchor the practice to an existing routine (after morning tea) at the same place daily.',
        practiceHi: 'अभ्यास को मौजूदा दिनचर्या से जोड़ें (सुबह की चाय के बाद), प्रतिदिन उसी स्थान पर।',
      },
    ],
    featuredQuestions: ['how-to-build-discipline-that-lasts', 'how-to-calm-a-restless-mind'],
  },
  {
    slug: 'attachment',
    conceptSlug: 'attachment',
    taglineEn: 'Notice where preference hardens into bondage.',
    taglineHi: 'देखें कि पसंद कब बंधन में कठोर होती है।',
    overviewEn:
      'Attachment (asakti) is clinging: the insistence that people, outcomes and pleasures conform to our demand. Dwelling on sense objects breeds attachment, attachment breeds desire, and the chain runs to anger and ruined judgment. Freedom begins by watching the first link.',
    overviewHi:
      'आसक्ति पकड़ है: यह आग्रह कि लोग, परिणाम और सुख हमारी माँग के अनुरूप हों। विषयों का चिंतन आसक्ति जन्माता है, आसक्ति कामना, और शृंखला क्रोध और नष्ट विवेक तक जाती है। मुक्ति पहली कड़ी को देखने से आरंभ होती है।',
    keyTeachings: [
      {
        titleEn: 'Dwelling breeds clinging',
        titleHi: 'चिंतन से आसक्ति जन्मती है',
        bodyEn: 'Thinking about objects repeatedly is the mechanism. Attention, left unmanaged, manufactures bondage by itself.',
        bodyHi: 'विषयों का बार-बार चिंतन ही तंत्र है। अनियंत्रित ध्यान स्वयं बंधन गढ़ लेता है।',
      },
      {
        titleEn: 'Attraction and aversion both bind',
        titleHi: 'राग और द्वेष दोनों बाँधते हैं',
        bodyEn: 'The wise are warned against both pull and push of the senses — chasing and hating are the same knot from two sides.',
        bodyHi: 'ज्ञानी को इंद्रियों के राग और द्वेष दोनों से सावधान किया गया है — पीछा करना और घृणा करना एक ही गाँठ के दो छोर हैं।',
      },
      {
        titleEn: 'Disciplined enjoyment does not bind',
        titleHi: 'संयमित भोग नहीं बाँधता',
        bodyEn: 'Moving among objects with controlled senses, free of attraction and aversion, one attains clarity. The world is not the problem; clinging is.',
        bodyHi: 'राग-द्वेष से मुक्त होकर संयमित इंद्रियों से विषयों में विचरने वाला प्रसाद (स्पष्टता) पाता है। संसार समस्या नहीं; पकड़ समस्या है।',
      },
      {
        titleEn: 'Natural desire has its lawful place',
        titleHi: 'स्वाभाविक इच्छा का विधिसम्मत स्थान है',
        bodyEn: 'Desire aligned with dharma is not condemned. The target is compulsive clinging, not all wanting.',
        bodyHi: 'धर्म के अनुरूप कामना निंदित नहीं है। लक्ष्य बाध्यकारी पकड़ है, समस्त चाह नहीं।',
      },
    ],
    extraVerses: [gita(2, 64, 'Bhagavad Gita 2.64'), gita(3, 34, 'Bhagavad Gita 3.34')],
    scriptures: [
      {
        id: 'bhagavadgita',
        titleEn: 'Bhagavad Gita',
        titleHi: 'भगवद्गीता',
        whyEn: 'Gita 2.62–64 maps the full arc from dwelling to bondage to freedom.',
        whyHi: 'गीता 2.62–64 चिंतन से बंधन और मुक्ति तक का पूर्ण चक्र चित्रित करती है।',
      },
    ],
    modernApplications: [
      {
        situationEn: 'Cannot stop checking likes, messages or prices.',
        situationHi: 'लाइक्स, संदेश या दाम देखना रुकता नहीं।',
        practiceEn: 'Name the underlying demand aloud ("I need approval"), then act from the need\u2019s real remedy, not the screen.',
        practiceHi: 'नीचे दबी माँग को ज़ोर से नाम दें ("मुझे स्वीकृति चाहिए"), फिर स्क्रीन से नहीं, आवश्यकता के वास्तविक उपचार से कार्य करें।',
      },
      {
        situationEn: 'A relationship feels like possession, not love.',
        situationHi: 'संबंध प्रेम नहीं, स्वामित्व लगता है।',
        practiceEn: 'Practice one daily act of letting the other be — no advice, no correction, no monitoring.',
        practiceHi: 'प्रतिदिन एक कार्य दूसरे को वैसे ही रहने देने का अभ्यास करें — न सलाह, न सुधार, न निगरानी।',
      },
      {
        situationEn: 'Shopping or scrolling to fill an inner gap.',
        situationHi: 'आंतरिक खालीपन भरने के लिए खरीदारी या स्क्रॉलिंग।',
        practiceEn: 'Insert a 24-hour pause before every non-essential purchase; notice which cravings survive it.',
        practiceHi: 'प्रत्येक अनावश्यक खरीद से पहले 24 घंटे का विराम रखें; देखें कौन-सी तृष्णा बचती है।',
      },
    ],
    featuredQuestions: ['how-to-let-go-of-attachment', 'how-to-stay-steady-in-success-and-failure'],
  },
  {
    slug: 'detachment',
    conceptSlug: 'detachment',
    taglineEn: 'Engaged in everything, owned by nothing.',
    taglineHi: 'सब में लगे रहें, किसी के स्वामित्व में नहीं।',
    overviewEn:
      'Detachment (vairagya) is misunderstood as indifference. It is the opposite: full engagement in action with the fruit released. The lotus leaf holds water without being wetted — that image carries the whole teaching. Practice plus dispassion steadies even the restless mind.',
    overviewHi:
      'वैराग्य को उदासीनता समझना भूल है। यह विपरीत है: फल को छोड़कर कर्म में पूर्ण संलग्नता। कमल का पत्ता जल धारण करता है, भीगता नहीं — यह चित्र संपूर्ण शिक्षा वहन करता है। अभ्यास और वैराग्य चंचल मन को भी स्थिर करते हैं।',
    keyTeachings: [
      {
        titleEn: 'Equanimity in success and failure is yoga',
        titleHi: 'सिद्धि-असिद्धि में समत्व ही योग है',
        bodyEn: 'Act fully, then accept either outcome with the same mind. That evenness is not coldness; it is freedom to act well.',
        bodyHi: 'पूरी तरह कर्म करें, फिर दोनों परिणामों को समान मन से स्वीकारें। वह समता ठंडक नहीं; अच्छा कर्म करने की स्वतंत्रता है।',
      },
      {
        titleEn: 'The lotus-leaf standard',
        titleHi: 'कमल-पत्र का मानदंड',
        bodyEn: 'One who acts dedicating works to the highest is untouched, like a lotus leaf by water. Test every involvement against this image.',
        bodyHi: 'जो कर्मों को परम को अर्पित करके कार्य करता है वह अलिप्त रहता है, जल में कमल-पत्र की तरह। प्रत्येक संलग्नता को इस चित्र पर कसें।',
      },
      {
        titleEn: 'Dispassion is trained, not pretended',
        titleHi: 'वैराग्य साधा जाता है, ढोंग नहीं',
        bodyEn: 'Vairagya is paired with abhyasa everywhere. Without steady practice, "detachment" is avoidance wearing a holy name.',
        bodyHi: 'वैराग्य सर्वत्र अभ्यास के साथ जोड़ा गया है। स्थिर साधना के बिना "वैराग्य" पवित्र नाम ओढ़ा पलायन है।',
      },
      {
        titleEn: 'Relinquishing the fruit removes the fear',
        titleHi: 'फल का त्याग भय हरता है',
        bodyEn: 'Much fear is fruit-clinging in disguise. Release the demanded outcome and the dread around it collapses.',
        bodyHi: 'अधिकांश भय छद्म फलासक्ति है। माँगे गए परिणाम को छोड़ें और उसके इर्द-गिर्द का आतंक ढह जाता है।',
      },
    ],
    extraVerses: [gita(5, 10, 'Bhagavad Gita 5.10'), gita(12, 11, 'Bhagavad Gita 12.11')],
    scriptures: [
      {
        id: 'bhagavadgita',
        titleEn: 'Bhagavad Gita',
        titleHi: 'भगवद्गीता',
        whyEn: 'Chapters 2, 5 and 12 build vairagya step by step.',
        whyHi: 'अध्याय 2, 5 और 12 वैराग्य को क्रमशः निर्मित करते हैं।',
      },
    ],
    modernApplications: [
      {
        situationEn: 'Outcome anxiety ruins performance.',
        situationHi: 'परिणाम की चिंता प्रदर्शन बिगाड़ देती है।',
        practiceEn: 'Write the outcome worry down, set it aside, and define today\u2019s effort target only.',
        practiceHi: 'परिणाम की चिंता लिखकर अलग रखें, और केवल आज का प्रयास-लक्ष्य तय करें।',
      },
      {
        situationEn: 'Praise and criticism swing your mood wildly.',
        situationHi: 'प्रशंसा और आलोचना मन को बेतहाशा झुलाती हैं।',
        practiceEn: 'Receive both as weather reports about others\u2019 minds, not verdicts on your worth.',
        practiceHi: 'दोनों को अपने मूल्य का निर्णय नहीं, दूसरों के मन का मौसम-वृत्तांत मानकर ग्रहण करें।',
      },
      {
        situationEn: 'Possessions own more of you than you own of them.',
        situationHi: 'वस्तुएँ आपकी उतनी नहीं जितना आप उनका हैं।',
        practiceEn: 'Give one unused possession away monthly. Observe the lightness that follows.',
        practiceHi: 'मास में एक अनुपयुक्त वस्तु दान करें। उसके बाद आने वाली हल्कापन देखें।',
      },
    ],
    featuredQuestions: [
      'how-to-act-without-anxiety-about-results',
      'how-to-let-go-of-attachment',
      'how-to-stay-steady-in-success-and-failure',
    ],
  },
  {
    slug: 'bhakti',
    conceptSlug: 'bhakti',
    taglineEn: 'Love aimed at the highest steadies everything lower.',
    taglineHi: 'परम की ओर उन्मुख प्रेम निम्न सब को स्थिर करता है।',
    overviewEn:
      'Bhakti is love with direction: the heart\u2019s natural devotion turned toward the highest rather than scattered across passing objects. The Gita honours every sincere approach — leaf, flower, fruit or water offered with devotion is accepted — and describes the devotee\u2019s qualities as the portrait of a free human being.',
    overviewHi:
      'भक्ति दिशा-युक्त प्रेम है: हृदय की स्वाभाविक निष्ठा क्षणिक विषयों में बिखरने के बजाय परम की ओर मुड़ी हुई। गीता हर सच्चे भाव का सम्मान करती है — भक्ति से अर्पित पत्र, पुष्प, फल या जल स्वीकार्य है — और भक्त के गुणों को मुक्त मनुष्य के चित्र के रूप में वर्णित करती है।',
    keyTeachings: [
      {
        titleEn: 'Whatever is offered with love is accepted',
        titleHi: 'प्रेम से अर्पित सब स्वीकार्य है',
        bodyEn: 'The value lies in devotion, not in the gift\u2019s price. Sincerity outranks splendour in every offering.',
        bodyHi: 'मूल्य भक्ति में है, उपहार की कीमत में नहीं। प्रत्येक अर्पण में सच्चाई वैभव से बड़ी है।',
      },
      {
        titleEn: 'The devotee\u2019s portrait: kind, even, fearless',
        titleHi: 'भक्त का चित्र: दयालु, सम, निर्भय',
        bodyEn: 'Free of hatred and envy, friendly to all, undisturbed in sorrow, steady — devotion reshapes character visibly.',
        bodyHi: 'द्वेष-ईर्ष्या से मुक्त, सबका मित्र, दुःख में अविचलित, स्थिर — भक्ति चरित्र को दृश्यतः नया रूप देती है।',
      },
      {
        titleEn: 'Constant remembrance, whatever the work',
        titleHi: 'सतत स्मरण, चाहे जो कर्म हो',
        bodyEn: 'The devotee works in the world while the mind rests above it. Remembrance is portable; it needs no special setting.',
        bodyHi: 'भक्त संसार में कार्य करता है जबकि मन उससे ऊपर टिका रहता है। स्मरण साथ ले जाने योग्य है; उसे विशेष व्यवस्था नहीं चाहिए।',
      },
      {
        titleEn: 'Grace meets effort halfway — then carries it',
        titleHi: 'कृपा प्रयास से आधी राह मिलती है — फिर उसे वहन करती है',
        bodyEn: 'Steady devotion is answered: the darkness of ignorance is dispelled from within by the lamp of knowledge.',
        bodyHi: 'स्थिर भक्ति का उत्तर मिलता है: अज्ञान का अंधकार भीतर से ज्ञान के दीप से दूर होता है।',
      },
    ],
    extraVerses: [gita(9, 26, 'Bhagavad Gita 9.26'), gita(10, 10, 'Bhagavad Gita 10.10')],
    scriptures: [
      {
        id: 'bhagavadgita',
        titleEn: 'Bhagavad Gita',
        titleHi: 'भगवद्गीता',
        whyEn: 'Chapters 7–12 unfold bhakti from seed to full portrait.',
        whyHi: 'अध्याय 7–12 भक्ति को बीज से पूर्ण चित्र तक खोलते हैं।',
      },
      {
        id: 'ramcharitmanas',
        titleEn: 'Ramcharitmanas',
        titleHi: 'रामचरितमानस',
        whyEn: 'Devotion as lived poetry: bhakti in story, song and surrender.',
        whyHi: 'जीवंत काव्य के रूप में भक्ति: कथा, गीत और शरणागति में भक्ति।',
      },
    ],
    modernApplications: [
      {
        situationEn: 'Spiritual life feels separate from busy days.',
        situationHi: 'आध्यात्मिक जीवन व्यस्त दिनों से अलग लगता है।',
        practiceEn: 'Dedicate the first action of the day and the last thought of the night. Two hinges carry the whole door.',
        practiceHi: 'दिन का पहला कर्म और रात का अंतिम विचार समर्पित करें। दो कब्ज़े पूरा द्वार सँभालते हैं।',
      },
      {
        situationEn: 'Relationships strained by scorekeeping.',
        situationHi: 'हिसाब-किताब से तने संबंध।',
        practiceEn: 'Serve one person daily without telling anyone. Secret service dissolves the ledger.',
        practiceHi: 'प्रतिदिन एक व्यक्ति की सेवा बिना किसी को बताए करें। गुप्त सेवा खाता गलाती है।',
      },
      {
        situationEn: 'Grief that arguments cannot touch.',
        situationHi: 'शोक जिसे तर्क छू नहीं सकते।',
        practiceEn: 'Turn grief into remembrance: sing, chant or sit quietly with a verse rather than analysing the loss.',
        practiceHi: 'शोक को स्मरण में बदलें: हानि का विश्लेषण करने के बजाय गाएँ, जपें या श्लोक के साथ शांत बैठें।',
      },
    ],
    featuredQuestions: ['how-to-practice-devotion-daily', 'how-to-face-grief-and-loss'],
  },
  {
    slug: 'wisdom',
    conceptSlug: 'wisdom',
    taglineEn: 'See clearly, then act on what you see.',
    taglineHi: 'स्पष्ट देखें, फिर देखे पर कार्य करें।',
    overviewEn:
      'Wisdom (viveka/jnana) is discrimination applied: telling the permanent from the passing, the self from the non-self, and then living the difference. Knowledge that does not change conduct is information; wisdom is knowledge that has become character. It culminates in seeing the same reality in all beings.',
    overviewHi:
      'विवेक/ज्ञान प्रयुक्त भेद-बुद्धि है: नित्य को अनित्य से, आत्मा को अनात्मा से अलग करना, फिर उस भेद को जीना। जो ज्ञान आचरण न बदले वह सूचना है; विवेक वह ज्ञान है जो चरित्र बन गया है। इसकी पराकाष्ठा सभी प्राणियों में समान सत्य देखना है।',
    keyTeachings: [
      {
        titleEn: 'The unreal never is; the real never ceases',
        titleHi: 'असत् कभी नहीं; सत् कभी नष्ट नहीं',
        bodyEn: 'Seers perceive this directly. Every wise decision is an application of that one discernment.',
        bodyHi: 'द्रष्टा इसे प्रत्यक्ष देखते हैं। प्रत्येक बुद्धिमान निर्णय उसी एक विवेक का प्रयोग है।',
      },
      {
        titleEn: 'Knowledge becomes wisdom through conduct',
        titleHi: 'आचरण से ज्ञान विवेक बनता है',
        bodyEn: 'Yoga is praised as skill in action — wisdom proves itself in how work is done, not in how much is quoted.',
        bodyHi: 'योग कर्म में कुशलता कहकर प्रशंसित है — विवेक कार्य करने की शैली में सिद्ध होता है, उद्धरण की मात्रा में नहीं।',
      },
      {
        titleEn: 'Humility is the first mark of knowing',
        titleHi: 'विनम्रता ज्ञान का प्रथम लक्षण है',
        bodyEn: 'The wise see learning, cow, elephant, dog and outcaste with equal vision. Contempt is proof of not yet seeing.',
        bodyHi: 'ज्ञानी विद्वान, गाय, हाथी, कुत्ते और चांडाल को समदृष्टि से देखते हैं। तिरस्कार न देखने का प्रमाण है।',
      },
      {
        titleEn: 'The lamp within dispels the darkness',
        titleHi: 'भीतर का दीप अंधकार हरता है',
        bodyEn: 'For the devoted, ignorance is destroyed from within by the shining lamp of knowledge. Clarity is given, not merely earned.',
        bodyHi: 'भक्त के लिए अज्ञान भीतर से ज्ञान के दीप्त दीप द्वारा नष्ट होता है। स्पष्टता दी जाती है, केवल अर्जित नहीं।',
      },
    ],
    extraVerses: [gita(2, 16, 'Bhagavad Gita 2.16'), gita(5, 18, 'Bhagavad Gita 5.18')],
    scriptures: [
      {
        id: 'bhagavadgita',
        titleEn: 'Bhagavad Gita',
        titleHi: 'भगवद्गीता',
        whyEn: 'Chapter 2 lays the foundation of discriminating wisdom.',
        whyHi: 'अध्याय 2 विवेकपूर्ण ज्ञान की नींव रखता है।',
      },
    ],
    modernApplications: [
      {
        situationEn: 'A decision clouded by others\u2019 opinions.',
        situationHi: 'दूसरों की राय से धुँधला निर्णय।',
        practiceEn: 'Separate facts from voices: list what is permanent in the situation versus what merely feels urgent.',
        practiceHi: 'तथ्यों को आवाज़ों से अलग करें: स्थिति में जो स्थायी है बनाम जो केवल आवश्यक लगता है, सूची बनाएँ।',
      },
      {
        situationEn: 'Learning much but changing little.',
        situationHi: 'बहुत सीखना पर कम बदलना।',
        practiceEn: 'Convert each insight into one observable behaviour within 48 hours, or admit it was entertainment.',
        practiceHi: 'प्रत्येक अंतर्दृष्टि को 48 घंटों में एक प्रेक्षणीय व्यवहार में बदलें, या स्वीकारें कि वह मनोरंजन था।',
      },
      {
        situationEn: 'Judging people quickly and harshly.',
        situationHi: 'लोगों का त्वरित और कठोर मूल्यांकन।',
        practiceEn: 'Practice equal vision deliberately: find one shared reality between you and the person judged.',
        practiceHi: 'जानबूझकर समदृष्टि का अभ्यास करें: अपने और मूल्यांकित व्यक्ति के बीच एक साझा सत्य खोजें।',
      },
    ],
    featuredQuestions: [
      'what-is-my-duty-in-difficult-situations',
      'how-to-face-grief-and-loss',
      'how-to-find-purpose-in-work',
    ],
  },
];

export function getAllKnowledgeHubs(): KnowledgeHub[] {
  return knowledgeHubs;
}

export function getKnowledgeHub(slug: string): KnowledgeHub | undefined {
  return knowledgeHubs.find((h) => h.slug === slug.trim().toLowerCase());
}

export function knowledgeHubHref(slug: string): string {
  return `/knowledge/${slug}/`;
}

