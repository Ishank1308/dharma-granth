/**
 * Dharma Granth: SEO Knowledge Universe Architecture
 * 
 * Scalable taxonomy and content metadata generator for high-intent seekers:
 * - Gita on Fear
 * - Gita on Stress
 * - Gita on Discipline
 * - Gita on Success
 * - Gita on Leadership
 * - Karma and Relationships
 * - Purpose According to Upanishads
 */

import type { SEOWisdomCluster } from './types';

export const SEO_WISDOM_CLUSTERS: readonly SEOWisdomCluster[] = [
  {
    slug: 'gita-on-fear',
    titleEn: 'Bhagavad Gita on Fear: Overcoming Anxiety and Dread',
    titleHi: 'भगवद्गीता में भय से मुक्ति: चिंता और संशय का निवारण',
    metaDescriptionEn: 'Discover what the Bhagavad Gita teaches about overcoming fear, anxiety, and mortality through verses 2.20, 2.23, and 18.66.',
    metaDescriptionHi: 'भगवद्गीता के अनुसार भय, चिंता और मृत्यु के भय से मुक्ति के उपाय। श्लोक 2.20, 2.23 और 18.66 का दार्शनिक विश्लेषण।',
    primaryScripture: 'bhagavadgita',
    keyVerseCitation: 'Bhagavad Gita 2.23',
    faqList: [
      {
        questionEn: 'What does Krishna say to Arjuna about fear?',
        questionHi: 'श्रीकृष्ण ने अर्जुन को भय के विषय में क्या समझाया?',
        answerEn: 'Krishna reveals that the conscious Self (Atman) can never be destroyed by fire, water, wind, or weapons. Fear dissolves when one identifies with the indestructible witness rather than the perishable body.',
        answerHi: 'श्रीकृष्ण बताते हैं कि आत्मा को न आग जला सकती है और न शस्त्र काट सकते हैं। जब मनुष्य स्वयं को नश्वर देह के बजाय अविनाशी साक्षी समझता है, तब समस्त भय नष्ट हो जाता है।',
      },
      {
        questionEn: 'Which Gita verse helps immediately with panic or anxiety?',
        questionHi: 'घबराहट में कौन-सा गीता श्लोक तुरंत शांति देता है?',
        answerEn: 'Bhagavad Gita 2.14 reminds us that sensory contacts (cold/heat, pleasure/pain) come and go and are impermanent; enduring them with equanimity restores calm.',
        answerHi: 'गीता 2.14 स्मरण कराता है कि सुख-दुःख आने-जाने वाले अनित्य हैं; इन्हें समभाव से सहन करने से मन शांत होता है।',
      },
    ],
  },
  {
    slug: 'gita-on-stress',
    titleEn: 'Bhagavad Gita on Stress: Healing Mental Overwhelm',
    titleHi: 'भगवद्गीता में मानसिक उद्वेग से मुक्ति: चित्त-शान्ति का समाधान',
    metaDescriptionEn: 'How to relieve work stress, deadline pressure, and mental exhaustion using Krishna’s teaching of Nishkama Karma in Gita 2.47.',
    metaDescriptionHi: 'गीता 2.47 के निष्काम कर्मयोग द्वारा कार्यक्षेत्र के उद्वेग और मानसिक भार को दूर करने की कला।',
    primaryScripture: 'bhagavadgita',
    keyVerseCitation: 'Bhagavad Gita 2.47',
    faqList: [
      {
        questionEn: 'Why do we feel work stress according to the Gita?',
        questionHi: 'गीता के अनुसार हमें मानसिक उद्वेग क्यों होता है?',
        answerEn: 'Stress is caused by mental attachment to future results. When we fixate on praise, profit, or fear of failure, our present focus is fractured.',
        answerHi: 'उद्वेग भविष्य के परिणामों से चिपके रहने के कारण होता है। जब हम केवल फल की चिंता करते हैं, तो वर्तमान कर्तव्य से एकाग्रता टूट जाती है।',
      },
    ],
  },
  {
    slug: 'gita-on-discipline',
    titleEn: 'Bhagavad Gita on Discipline: Cultivating Self-Mastery',
    titleHi: 'भगवद्गीता में आत्मसंयम और अनुशासन',
    metaDescriptionEn: 'Practical guidance from the Bhagavad Gita on mastering the restless mind, building daily habits, and achieving focused willpower.',
    metaDescriptionHi: 'चंचल मन को वश में करने और आत्मसंयम साधने के लिए भगवद्गीता का व्यावहारिक मार्गदर्शन।',
    primaryScripture: 'bhagavadgita',
    keyVerseCitation: 'Bhagavad Gita 6.5',
    faqList: [
      {
        questionEn: 'How can I control a wandering mind according to Krishna?',
        questionHi: 'भटकते हुए मन को कैसे साधें?',
        answerEn: 'Through consistent practice (Abhyasa) and non-attachment (Vairagya), as outlined in Gita 6.35.',
        answerHi: 'निरन्तर अभ्यास और वैराग्य के द्वारा, जैसा कि गीता 6.35 में प्रतिपादित है।',
      },
    ],
  },
  {
    slug: 'gita-on-success',
    titleEn: 'Bhagavad Gita on Success: Shreyas over Preyas',
    titleHi: 'भगवद्गीता में सफलता का सच्चा स्वरूप',
    metaDescriptionEn: 'Redefining success beyond material accumulation: equanimity in victory and defeat as the highest achievement.',
    metaDescriptionHi: 'भौतिक लाभ से परे वास्तविक सफलता: जय-पराजय में समभाव ही परम सिद्धि है।',
    primaryScripture: 'bhagavadgita',
    keyVerseCitation: 'Bhagavad Gita 2.48',
    faqList: [
      {
        questionEn: 'What is true success according to the Bhagavad Gita?',
        questionHi: 'गीता के अनुसार सच्ची सफलता क्या है?',
        answerEn: 'Equanimity of mind in both success and failure (Siddhy-asiddhyoh samo bhutva samatvam yoga ucyate).',
        answerHi: 'सफलता और विफलता दोनों में समान बुद्धि रखना—यही समत्व योग है।',
      },
    ],
  },
  {
    slug: 'gita-on-leadership',
    titleEn: 'Bhagavad Gita on Leadership: The Ideal of Lokasangraha',
    titleHi: 'भगवद्गीता में नेतृत्व: लोकसंग्रह का आदर्श',
    metaDescriptionEn: 'Leadership wisdom from the Gita: leading by example, ethical stewardship, and working for the welfare of all beings.',
    metaDescriptionHi: 'अपने आचरण से आदर्श स्थापित करना और सम्पूर्ण समाज के कल्याण (लोकसंग्रह) के लिए कार्य करना।',
    primaryScripture: 'bhagavadgita',
    keyVerseCitation: 'Bhagavad Gita 3.21',
    faqList: [
      {
        questionEn: 'What makes an ethical leader in the Gita?',
        questionHi: 'गीता के अनुसार श्रेष्ठ नेता के क्या लक्षण हैं?',
        answerEn: 'Whatever action a great leader performs, common people follow. Leaders set the standard by their own noble conduct (Gita 3.21).',
        answerHi: 'श्रेष्ठ पुरुष जैसा आचरण करते हैं, अन्य लोग भी वैसा ही करते हैं। नेता अपने आचरण से प्रमाण प्रस्तुत करते हैं।',
      },
    ],
  },
  {
    slug: 'karma-and-relationships',
    titleEn: 'Karma and Relationships: Living with Compassion and Non-Attachment',
    titleHi: 'कर्म और सम्बन्ध: निष्काम प्रेम और करुणा',
    metaDescriptionEn: 'Understanding karmic knots, resolving conflicts, and loving deeply without toxic codependency or possessiveness.',
    metaDescriptionHi: 'पारस्परिक सम्बन्धों में आसक्ति रहित प्रेम, क्षमा और करुणा का शास्त्रीय दृष्टिकोण।',
    primaryScripture: 'bhagavadgita',
    keyVerseCitation: 'Bhagavad Gita 6.29',
    faqList: [
      {
        questionEn: 'How does non-attachment improve human relationships?',
        questionHi: 'अनासक्ति से सम्बन्ध कैसे प्रगाढ़ होते हैं?',
        answerEn: 'Non-attachment frees relationships from the smothering grip of possessiveness, allowing true respect and unconditional care to flourish.',
        answerHi: 'अनासक्ति सम्बन्धों को अधिकार जताने के भय से मुक्त करती है, जिससे सच्चा सम्मान और निःस्वार्थ प्रेम खिलता है।',
      },
    ],
  },
  {
    slug: 'purpose-according-to-upanishads',
    titleEn: 'Purpose According to the Upanishads: Realizing the Infinite',
    titleHi: 'उपनिषदों के अनुसार जीवन का परम उद्देश्य',
    metaDescriptionEn: 'Upanishadic insights on human purpose: transcending finite limitations to realize the oneness of Atman and Brahman.',
    metaDescriptionHi: 'सीमित अहं भाव से ऊपर उठकर आत्मा और ब्रह्म के ऐक्य का साक्षात्कार ही मानव जीवन का परम ध्येय है।',
    primaryScripture: 'brihadaranyaka',
    keyVerseCitation: 'Brihadaranyaka Upanishad 1.3.28',
    faqList: [
      {
        questionEn: 'What is the highest purpose of human life in the Upanishads?',
        questionHi: 'उपनिषदों में मनुष्य जीवन का सर्वोच्च लक्ष्य क्या है?',
        answerEn: 'Moving from untruth to truth, from darkness to light, from death to immortality (Asato ma sadgamaya).',
        answerHi: 'असत्य से सत्य की ओर, अंधकार से प्रकाश की ओर और मृत्यु से अमरता की ओर यात्रा (असतो मा सद्गमय)।',
      },
    ],
  },
];

export function getSEOClusterBySlug(slug: string): SEOWisdomCluster | undefined {
  return SEO_WISDOM_CLUSTERS.find((c) => c.slug === slug);
}

export function generateFAQJsonLd(cluster: SEOWisdomCluster): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cluster.faqList.map((faq) => ({
      '@type': 'Question',
      name: faq.questionEn,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answerEn,
      },
    })),
  };
}
