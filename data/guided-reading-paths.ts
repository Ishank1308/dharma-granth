/**
 * Curated Guided Reading Paths for Dharma Granth
 * Text-first, source-transparent pedagogical journeys organized by:
 * 1. Life questions
 * 2. Philosophical themes
 * 3. Beginner sequences
 * 4. Character studies
 * 5. Decision-making dilemmas
 */

export interface GuidedPathVerse {
  scriptureId: string;
  chapter: number;
  verse: number;
  title: string;
  titleHi: string;
  takeaway: string;
  takeawayHi: string;
  sanskritSnippet: string;
}

export interface GuidedReadingPath {
  id: string;
  title: string;
  titleHi: string;
  category: 'life-questions' | 'philosophical-themes' | 'beginner-sequences' | 'character-studies' | 'decision-making';
  purpose: string;
  purposeHi: string;
  estimatedMinutes: number;
  prerequisites: string[];
  verses: GuidedPathVerse[];
  coreInsight: string;
  coreInsightHi: string;
  practicalReflection: string;
  practicalReflectionHi: string;
  selfCheckQuestion: string;
  selfCheckQuestionHi: string;
  suggestedAnswer: string;
  suggestedAnswerHi: string;
}

export const GUIDED_READING_PATHS: GuidedReadingPath[] = [
  {
    id: 'anxiety-overwhelm',
    title: 'Overcoming Anxiety & Overwhelm',
    titleHi: 'मानसिक उद्वेग और तनाव से मुक्ति',
    category: 'life-questions',
    purpose: 'Understand how psychological paralysis arises from fixating on uncontrollable outcomes, and cultivate grounded mental calm.',
    purposeHi: 'यह समझना कि परिणामों की चिंता से मानसिक तनाव कैसे उत्पन्न होता है और मन को शांत व स्थिर कैसे रखा जाए।',
    estimatedMinutes: 12,
    prerequisites: ['Basic familiarity with the dialogue between Krishna and Arjuna'],
    verses: [
      {
        scriptureId: 'bhagavadgita',
        chapter: 2,
        verse: 47,
        title: 'Sovereignty of Action',
        titleHi: 'कर्म में अधिकार, फल में नहीं',
        takeaway: 'Focus strictly on your sphere of responsibility; release neurotic attachment to outcomes.',
        takeawayHi: 'केवल अपने कर्तव्य और कर्म पर ध्यान दें; परिणाम की अनिश्चितता से मन को विचलित न होने दें।',
        sanskritSnippet: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि',
      },
      {
        scriptureId: 'bhagavadgita',
        chapter: 2,
        verse: 48,
        title: 'Equanimity is Yoga',
        titleHi: 'समत्वं योग उच्यते',
        takeaway: 'Perform duties with inner balance, unaffected by temporary victory or temporary defeat.',
        takeawayHi: 'सफलता और असफलता दोनों में समभाव रखकर कर्तव्य का पालन करें।',
        sanskritSnippet: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय। सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते',
      },
      {
        scriptureId: 'bhagavadgita',
        chapter: 2,
        verse: 56,
        title: 'The Calm Sage',
        titleHi: 'दुःखेष्वनुद्विग्नमनाः',
        takeaway: 'One whose mind is undisturbed in distress and free from cravings in pleasure retains steady peace.',
        takeawayHi: 'दुःखों में जिसका मन व्याकुल नहीं होता और सुखों में जिसकी आसक्ति नहीं होती, वह स्थिर प्रज्ञ है।',
        sanskritSnippet: 'दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः। वीतरागभयक्रोधः स्थितधीर्मुनिरुच्यते',
      },
    ],
    coreInsight: 'Anxiety is energy leaking into an imagined future you cannot command. When you retreat your awareness to present craftsmanship, anxiety dissolves into focused action.',
    coreInsightHi: 'चिंता उस भविष्य की कल्पना से उत्पन्न होती है जो आपके वश में नहीं है। जब चेतना वर्तमान कर्तव्य पर लौटती है, तो शांति स्वतः स्थापित हो जाती है।',
    practicalReflection: 'Identify one project or situation causing you dread today. Write down what you control (preparation, tone, diligence) and what you do not control (evaluation, algorithm, opinions). Surrender the second list.',
    practicalReflectionHi: 'आज जो कार्य आपको तनाव दे रहा है, उसमें अपनी ज़िम्मेदारी और बाहरी परिणामों को अलग-अलग पहचानें। परिणामों की चिंता छोड़कर कार्य में लीन हों।',
    selfCheckQuestion: 'When I feel anxious right now, am I attempting to control the fruit or the effort?',
    selfCheckQuestionHi: 'जब मुझे घबराहट महसूस होती है, तो क्या मैं कर्म पर ध्यान दे रहा हूँ या फल पर नियंत्रण पाना चाहता हूँ?',
    suggestedAnswer: 'Almost universally, anxiety arises when consciousness attempts to grasp and manipulate the future outcome. Shifting attention back to the immediate task restores sovereign agency.',
    suggestedAnswerHi: 'घबराहट हमेशा परिणाम पर कब्ज़ा करने की इच्छा से आती है। जैसे ही ध्यान वर्तमान प्रयास पर लौटता है, मन शांत हो जाता है।'
  },

  {
    id: 'atman-witness',
    title: 'The Indestructible Witness: Nature of Self',
    titleHi: 'अविनाशी आत्मा: स्वरूप का बोध',
    category: 'philosophical-themes',
    purpose: 'Examine the classical distinction between the mortal physical body and the unchanging conscious observer (Atman).',
    purposeHi: 'नश्वर शरीर और शाश्वत चेतन तत्त्व (आत्मा) के भेद को समझना।',
    estimatedMinutes: 15,
    prerequisites: ['Openness to contemplative inquiry beyond purely materialist assumptions'],
    verses: [
      {
        scriptureId: 'bhagavadgita',
        chapter: 2,
        verse: 20,
        title: 'Unborn and Undying',
        titleHi: 'न जायते म्रियते वा',
        takeaway: 'Pure awareness is neither born nor slain when physical forms perish.',
        takeawayHi: 'चेतन आत्मा का न कभी जन्म होता है और न कभी मृत्यु।',
        sanskritSnippet: 'न जायते म्रियते वा कदाचि न्नायं भूत्वा भविता वा न भूयः। अजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे',
      },
      {
        scriptureId: 'bhagavadgita',
        chapter: 2,
        verse: 22,
        title: 'Changing Garments',
        titleHi: 'वासांसि जीर्णानि यथा विहाय',
        takeaway: 'Just as a person discards worn-out clothes, the conscious Self transcends changing bodily vessels.',
        takeawayHi: 'जैसे मनुष्य पुराने वस्त्र त्यागकर नए धारण करता है, वैसे ही आत्मा शरीर बदलती है।',
        sanskritSnippet: 'वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरोऽपराणि। तथा शरीराणि विहाय जीर्णा न्यन्यानि संयाति नवानि देही',
      },
      {
        scriptureId: 'bhagavadgita',
        chapter: 2,
        verse: 24,
        title: 'Impenetrable Essence',
        titleHi: 'अच्छेद्योऽयमदाह्योऽयम्',
        takeaway: 'The Self cannot be cleaved, burned, wetted, or withered; it is eternal and omnipresent.',
        takeawayHi: 'यह आत्मा काटा नहीं जा सकता, जलाया नहीं जा सकता, यह नित्य और सर्वव्यापी है।',
        sanskritSnippet: 'अच्छेद्योऽयमदाह्योऽयमक्लेद्योऽशोष्य एव च। नित्यः सर्वगतः स्थाणुरचलोऽयं सनातनः',
      },
    ],
    coreInsight: 'You are the observing presence of your thoughts, not the fleeting contents of your mind. Realizing this creates deep psychological immunity to existential dread.',
    coreInsightHi: 'आप अपने विचारों के द्रष्टा हैं, विचार स्वयं नहीं। इस साक्षी भाव से जीवन का भय समाप्त होता है।',
    practicalReflection: 'Take three deep breaths. Notice your thoughts, bodily sensations, and background noises. Ask: "Who is the silent observer witnessing all three?"',
    practicalReflectionHi: 'शांत बैठकर मन में उठने वाले विचारों को देखें और स्वयं से पूछें: "इन बदलते विचारों को देखने वाला कौन है?"',
    selfCheckQuestion: 'If bodily conditions and emotional moods constantly fluctuate, what remains constant throughout your life?',
    selfCheckQuestionHi: 'यदि शरीर और भावनाएं निरंतर बदलती रहती हैं, तो वह कौन-सा तत्त्व है जो जन्म से आज तक एक समान बना हुआ है?',
    suggestedAnswer: 'The subjective light of awareness itself (Sakshi Chaitanya) remains the unwavering observer across childhood, youth, joy, and sorrow.',
    suggestedAnswerHi: 'वह शुद्ध साक्षी चेतना है जो बाल्यावस्था से वृद्धावस्था तक हर अनुभव को तटस्थ होकर देखती है।'
  },

  {
    id: 'first-steps-gita',
    title: 'First Steps: The 5 Cornerstone Verses',
    titleHi: 'प्रारम्भिक पाँच आधारभूत श्लोक',
    category: 'beginner-sequences',
    purpose: 'A gentle, zero-jargon orientation for first-time scripture readers covering ethics, agency, and steady mind.',
    purposeHi: 'प्रथम बार गीता पढ़ने वाले जिज्ञासुओं के लिए पाँच सबसे महत्वपूर्ण और व्यावहारिक श्लोक।',
    estimatedMinutes: 10,
    prerequisites: ['None'],
    verses: [
      {
        scriptureId: 'bhagavadgita',
        chapter: 2,
        verse: 47,
        title: 'The Law of Action',
        titleHi: 'कर्मण्येवाधिकारस्ते',
        takeaway: 'Dedication to action without obsession over fruits.',
        takeawayHi: 'कर्म में निष्ठा और फल की चिंता से मुक्ति।',
        sanskritSnippet: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि',
      },
      {
        scriptureId: 'bhagavadgita',
        chapter: 2,
        verse: 50,
        title: 'Skill in Action',
        titleHi: 'योगः कर्मसु कौशलम्',
        takeaway: 'Yoga is mastery and craftsmanship in fulfilling your duties.',
        takeawayHi: 'कर्मों में कुशलता ही योग है।',
        sanskritSnippet: 'बुद्धियुक्तो जहातीह उभे सुकृतदुष्कृते। तस्माद्योगाय युज्यस्व योगः कर्मसु कौशलम्',
      },
      {
        scriptureId: 'bhagavadgita',
        chapter: 2,
        verse: 14,
        title: 'Enduring the Pairs of Opposites',
        titleHi: 'मात्रास्पर्शास्तु कौन्तेय',
        takeaway: 'Pleasure and pain, heat and cold come and go; learn to bear them steadily.',
        takeawayHi: 'सुख-दुःख और शीत-उष्ण आते-जाते रहते हैं; उन्हें धैर्यपूर्वक सहन करना सीखें।',
        sanskritSnippet: 'मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः। आगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत',
      },
      {
        scriptureId: 'bhagavadgita',
        chapter: 3,
        verse: 21,
        title: 'Conduct Sets the Example',
        titleHi: 'यद्यदाचरति श्रेष्ठः',
        takeaway: 'Others follow what the best person does; your conduct teaches more than your words.',
        takeawayHi: 'श्रेष्ठ मनुष्य जैसा आचरण करता है, अन्य लोग वैसा ही करते हैं; आपका आचरण आपके वचनों से अधिक सिखाता है।',
        sanskritSnippet: 'यद्यदाचरति श्रेष्ठस्तत्तदेवेतरो जनः। स यत्प्रमाणं कुरुते लोकस्तदनुवर्तते',
      },
      {
        scriptureId: 'bhagavadgita',
        chapter: 6,
        verse: 5,
        title: 'Elevating the Self',
        titleHi: 'उद्धरेदात्मनात्मानम्',
        takeaway: 'Elevate yourself through your own mind; your own disciplined mind is your greatest ally.',
        takeawayHi: 'अपने उद्धार के लिए स्वयं प्रयास करें; अनुशासित मन ही सबसे बड़ा मित्र है।',
        sanskritSnippet: 'उद्धरेदात्मनाऽऽत्मानं नात्मानमवसादयेत्। आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः',
      },
    ],
    coreInsight: 'Sanatana scripture does not impose guilt; it invites sovereign self-mastery, compassionate duty, and inner poise.',
    coreInsightHi: 'शास्त्र किसी पर भय या अपराधबोध नहीं थोपते, बल्कि आत्म-विकास और मन के संतुलन का मार्ग प्रशस्त करते हैं।',
    practicalReflection: 'Select one verse from this sequence that resonated most. Write down one concrete way you will apply its principle before the day ends.',
    practicalReflectionHi: 'इस क्रम में से एक श्लोक चुनें और सोचें कि आज के दिन आप उसे अपने व्यवहार में कैसे उतार सकते हैं।',
    selfCheckQuestion: 'How does viewing spiritual study as self-refinement differ from viewing it as rigid ritual compliance?',
    selfCheckQuestionHi: 'आत्म-सुधार के रूप में स्वाध्याय को देखना, केवल कर्मकांड करने से किस प्रकार भिन्न है?',
    suggestedAnswer: 'Self-refinement transforms everyday interactions, emotional resilience, and integrity, whereas empty compliance leaves the ego unchanged.',
    suggestedAnswerHi: 'आत्म-सुधार चरित्र, शांति और व्यवहार को परिष्कृत करता है, जबकि मात्र कर्मकांड मन के अहंकार को नहीं बदलता।'
  },

  {
    id: 'arjuna-transformation',
    title: "Arjuna's Crisis: From Collapse to Clarity",
    titleHi: 'अर्जुन का विषाद: संशय से संकल्प तक',
    category: 'character-studies',
    purpose: 'Trace how an accomplished hero collapses under moral confusion and grief, and the structured psychological counsel that restores his dignity.',
    purposeHi: 'यह समझना कि जब एक श्रेष्ठ व्यक्ति भी असमंजस में टूट जाता है, तो विवेक और ज्ञान कैसे पुनः संकल्प जगाते हैं।',
    estimatedMinutes: 14,
    prerequisites: ['Understanding the setting of the Kurukshetra battlefield'],
    verses: [
      {
        scriptureId: 'bhagavadgita',
        chapter: 1,
        verse: 28,
        title: 'The Physical Breakdown',
        titleHi: 'शरीर का कम्पन व विषाद',
        takeaway: 'Arjuna trembling and limbs failing when confronted with moral crisis.',
        takeawayHi: 'धर्म-संकट के सम्मुख अर्जुन के हाथ से धनुष गिरना और मन का अवसाद।',
        sanskritSnippet: 'अर्जुन उवाच कृपया परयाऽऽविष्टो विषीदन्निदमब्रवीत्। दृष्ट्वेमं स्वजनं कृष्ण युयुत्सुं समुपस्थितम्',
      },
      {
        scriptureId: 'bhagavadgita',
        chapter: 2,
        verse: 7,
        title: 'Surrender as a Disciple',
        titleHi: 'शिष्यस्तेऽहं शाधि मां त्वां प्रपन्नम्',
        takeaway: 'Arjuna honestly admits his confusion and asks for structured guidance.',
        takeawayHi: 'अर्जुन का अपनी दुर्बलता स्वीकार कर श्रीकृष्ण की शरण में शिष्य बनना।',
        sanskritSnippet: 'कार्पण्यदोषोपहतस्वभावः पृच्छामि त्वां धर्मसंमूढचेताः। यच्छ्रेयः स्यान्निश्चितं ब्रूहि तन्मे शिष्यस्तेऽहं शाधि मां त्वां प्रपन्नम्',
      },
      {
        scriptureId: 'bhagavadgita',
        chapter: 2,
        verse: 11,
        title: 'Krishna Strikes the Root',
        titleHi: 'अशोच्यानन्वशोचस्त्वम्',
        takeaway: 'Krishna confronts his grief by examining the fundamental reality of life and consciousness.',
        takeawayHi: 'श्रीकृष्ण का शोक के मूल कारण पर प्रहार—जो शोक करने योग्य नहीं है, उसके लिए शोक क्यों?',
        sanskritSnippet: 'श्री भगवानुवाच अशोच्यानन्वशोचस्त्वं प्रज्ञावादांश्च भाषसे। गतासूनगतासूंश्च नानुशोचन्ति पण्डिताः',
      },
    ],
    coreInsight: 'Admitting your helplessness and seeking genuine wisdom is not weakness—it is the indispensable turning point toward authentic mastery.',
    coreInsightHi: 'अपनी सीमा को स्वीकार कर मार्गदर्शन मांगना दुर्बलता नहीं, बल्कि आत्म-ज्ञान की पहली सीढ़ी है।',
    practicalReflection: 'When you face a complex dilemma, do you retreat into defensive rationalizations, or do you seek clarity with honest humility like Arjuna in Gita 2.7?',
    practicalReflectionHi: 'जब आप किसी धर्म-संकट में होते हैं, तो क्या आप बहाने बनाते हैं या विनम्रता से सच को समझने का प्रयास करते हैं?',
    selfCheckQuestion: 'What transformed Arjuna from a weeping warrior into an aligned student of wisdom?',
    selfCheckQuestionHi: 'अर्जुन को विषाद से शिष्यत्व की ओर किसने मोड़ा?',
    suggestedAnswer: 'The conscious surrender of his ego and the willingness to ask for disciplined teaching rather than self-serving comforting words.',
    suggestedAnswerHi: 'अपनी सीमाओं को स्वीकार करना और झूठी तसल्ली के बजाय सत्य को सुनने की तत्परता।'
  },

  {
    id: 'conflicting-duties',
    title: 'Decision Dilemmas: When Duties Collide',
    titleHi: 'धर्म-संकट: जब कर्तव्य परस्पर टकराएं',
    category: 'decision-making',
    purpose: 'Explore how classical scripture provides discernment (viveka) when multiple noble obligations seem to pull in opposite directions.',
    purposeHi: 'जब दो सही बातों के बीच चयन करना हो, तो विवेक से निर्णय कैसे लिया जाए।',
    estimatedMinutes: 15,
    prerequisites: ['Basic understanding of Svadharma and ethical integrity'],
    verses: [
      {
        scriptureId: 'bhagavadgita',
        chapter: 3,
        verse: 35,
        title: 'Authentic Duty vs Imitation',
        titleHi: 'श्रेयान्स्वधर्मो विगुणः',
        takeaway: 'One’s own authentic duty, though imperfect, is far better than an alien duty executed flawlessly.',
        takeawayHi: 'दूसरों की नकल करने से कहीं श्रेष्ठ है अपने स्वभाव के अनुकूल कर्तव्य का पालन करना।',
        sanskritSnippet: 'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्। स्वधर्मे निधनं श्रेयः परधर्मो भयावहः',
      },
      {
        scriptureId: 'bhagavadgita',
        chapter: 18,
        verse: 47,
        title: 'Nature-Aligned Responsibility',
        titleHi: 'सहजं कर्म कौन्तेय',
        takeaway: 'No duty in this world is entirely free of flaws; act with sincerity and dedication.',
        takeawayHi: 'संसार का कोई भी कर्म पूर्णतः निर्दोष नहीं होता, अतः निष्काम भाव से कार्य करें।',
        sanskritSnippet: 'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्। स्वभावनियतं कर्म कुर्वन्नाप्नोति किल्बिषम्',
      },
      {
        scriptureId: 'bhagavadgita',
        chapter: 18,
        verse: 63,
        title: 'Autonomous Discernment',
        titleHi: 'यथेच्छसि तथा कुरु',
        takeaway: 'Having reflected on this profound wisdom, deliberate thoroughly and act according to your sovereign conscience.',
        takeawayHi: 'ज्ञान को भली-भांति समझकर, अपने विवेक से स्वतंत्र निर्णय लो।',
        sanskritSnippet: 'इति ते ज्ञानमाख्यातं गुह्याद्गुह्यतरं मया। विमृश्यैतदशेषेण यथेच्छसि तथा कुरु',
      },
    ],
    coreInsight: 'Scripture does not reduce ethical life to robotic dogmas. It trains your inner faculty of discernment (buddhi) so you can make courageous, principled choices aligned with your deepest nature.',
    coreInsightHi: 'शास्त्र कोई अंध नियम नहीं थोपते, बल्कि बुद्धि को विवेकशील बनाते हैं ताकि व्यक्ति अपने स्वभाव और स्थिति के अनुसार श्रेष्ठ निर्णय ले सके।',
    practicalReflection: 'Recall a decision where you conformed to external expectations rather than your authentic svadharma. What did that experience teach you?',
    practicalReflectionHi: 'अपने जीवन के किसी ऐसे निर्णय को याद करें जहां आपने दूसरों के दबाव में काम किया था। उससे आपको क्या सीख मिली?',
    selfCheckQuestion: 'Why does Krishna tell Arjuna "यथेच्छसि तथा कुरु" (Act as you choose) in Gita 18.63 instead of giving a compulsory command?',
    selfCheckQuestionHi: 'गीता १८.६३ में श्रीकृष्ण ने अर्जुन को आदेश देने के बजाय यह क्यों कहा कि "जैसा उचित समझो, वैसा करो"?',
    suggestedAnswer: 'Because true spiritual maturity and moral integrity cannot be coerced; wisdom must be embraced autonomously with personal responsibility.',
    suggestedAnswerHi: 'क्योंकि सच्चा धर्म स्वतंत्रता और आत्म-विवेक पर आधारित होता है; आदेश थोपने से कभी वास्तविक रूपांतरण नहीं होता।'
  }
];

export function getGuidedPath(id: string): GuidedReadingPath | undefined {
  return GUIDED_READING_PATHS.find((p) => p.id === id);
}
