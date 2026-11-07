/**
 * Dharma Granth — Voluntary Contribution System Configuration
 *
 * Ethos:
 * "Invite support with gratitude, never with guilt, pressure, fear or promises of spiritual reward."
 *
 * This system is 100% voluntary, zero-commission, direct UPI and verified QR.
 * Dharma Granth remains free and ad-free for every seeker.
 */

export interface UpiConfiguration {
  upiId: string;
  payeeName: string;
  purpose: string;
  currency: string;
  contactEmail?: string;
}

export const UPI_CONFIG: UpiConfiguration = {
  upiId: 'shubhamshukla71156-2@okhdfcbank',
  payeeName: 'Dharma Granth',
  purpose: 'Support Dharma Granth',
  currency: 'INR',
  contactEmail: 'contact@dharmagranth.dev',
};

export interface ContributionTier {
  id: string;
  amount: number | null; // null for custom
  labelHi: string;
  labelEn: string;
  meaningHi: string;
  meaningEn: string;
  isPopular?: boolean;
}

export const CONTRIBUTION_TIERS: ContributionTier[] = [
  {
    id: 't-51',
    amount: 51,
    labelHi: '₹51',
    labelEn: '₹51',
    meaningHi: 'सद्भावना व आशीर्वाद',
    meaningEn: 'Token of Goodwill & Blessings',
  },
  {
    id: 't-108',
    amount: 108,
    labelHi: '₹108',
    labelEn: '₹108',
    meaningHi: 'शुभ संकल्प व ग्रंथ सेवा',
    meaningEn: 'Auspicious Study & Scripture Care',
    isPopular: true,
  },
  {
    id: 't-251',
    amount: 251,
    labelHi: '₹251',
    labelEn: '₹251',
    meaningHi: 'विद्या दान व संरक्षण',
    meaningEn: 'Manuscript & Commentary Preservation',
  },
  {
    id: 't-501',
    amount: 501,
    labelHi: '₹501',
    labelEn: '₹501',
    meaningHi: 'ज्ञान संवर्धन व सर्वर सेवा',
    meaningEn: 'High-speed Ad-free Infrastructure',
  },
  {
    id: 't-1008',
    amount: 1008,
    labelHi: '₹1,008',
    labelEn: '₹1,008',
    meaningHi: 'महासहयोग व डिजिटल धर्म-प्रचार',
    meaningEn: 'Patron of Open Digital Dharma',
  },
];

/**
 * Builds a standardized NPCI UPI URI.
 * Works seamlessly across all UPI apps (GPay, PhonePe, Paytm, BHIM, Navi, CRED, etc.).
 */
export function buildUpiUri(amount?: number | null): string {
  const params = new URLSearchParams();
  params.set('pa', UPI_CONFIG.upiId);
  params.set('pn', UPI_CONFIG.payeeName);
  params.set('tn', UPI_CONFIG.purpose);
  params.set('cu', UPI_CONFIG.currency);

  if (amount && amount > 0) {
    // UPI standard requires amount formatted with up to 2 decimal places or integer
    params.set('am', Number(amount).toFixed(2).replace(/\.00$/, ''));
  }

  // Some UPI apps reject a percent-encoded VPA (`%40`), so keep `@` literal.
  return `upi://pay?${params.toString().replace(/%40/g, '@')}`;
}

export interface UpiAppShortcut {
  id: 'generic' | 'gpay' | 'phonepe' | 'paytm' | 'bhim';
  name: string;
  nameHi: string;
  iconName: string;
  accentColor: string;
  getUri: (amount?: number | null) => string;
}

export const UPI_APP_SHORTCUTS: UpiAppShortcut[] = [
  {
    id: 'generic',
    name: 'Any UPI App',
    nameHi: 'कोई भी UPI ऐप',
    iconName: 'Smartphone',
    accentColor: '#c2410c', // saffron
    getUri: (amount) => buildUpiUri(amount),
  },
  {
    id: 'gpay',
    name: 'Google Pay',
    nameHi: 'गूगल पे',
    iconName: 'Globe',
    accentColor: '#1a73e8',
    getUri: (amount) => {
      const upi = buildUpiUri(amount);
      return upi.replace(/^upi:\/\//, 'tez://upi/');
    },
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    nameHi: 'फ़ोनपे',
    iconName: 'Smartphone',
    accentColor: '#5f259f',
    getUri: (amount) => {
      const upi = buildUpiUri(amount);
      return upi.replace(/^upi:\/\//, 'phonepe://');
    },
  },
  {
    id: 'paytm',
    name: 'Paytm',
    nameHi: 'पेटीएम',
    iconName: 'CreditCard',
    accentColor: '#00b9f1',
    getUri: (amount) => {
      const upi = buildUpiUri(amount);
      return upi.replace(/^upi:\/\//, 'paytmmp://');
    },
  },
  {
    id: 'bhim',
    name: 'BHIM UPI',
    nameHi: 'भीम यूपीआई',
    iconName: 'ShieldCheck',
    accentColor: '#00875a',
    getUri: (amount) => buildUpiUri(amount),
  },
];

export interface ContributionPillar {
  icon: string;
  titleHi: string;
  titleEn: string;
  descriptionHi: string;
  descriptionEn: string;
}

export const CONTRIBUTION_PILLARS: ContributionPillar[] = [
  {
    icon: 'ShieldCheck',
    titleHi: '100% विज्ञापन-मुक्त व पवित्र पठन',
    titleEn: '100% Ad-Free Reading Sanctuary',
    descriptionHi:
      'कोई व्यावसायिक विज्ञापन, ट्रैकिंग या पॉपअप नहीं। पाठक का मन केवल पवित्र श्लोकों और शांत अध्ययन में लीन रहता है।',
    descriptionEn:
      'Zero commercial advertising, zero behavioral trackers, zero popups. Readers immerse uninterrupted in sacred shlokas.',
  },
  {
    icon: 'BookOpen',
    titleHi: 'पांडुलिपि व भाष्य संवर्धन',
    titleEn: 'Scripture & Commentary Preservation',
    descriptionHi:
      'गीताप्रेस, बोरी (BORI) व प्रामाणिक संस्करणों का सूक्ष्म अध्ययन, उच्च गुणवत्ता देवनागरी ओसीआर और बहुभाषी व्याख्या का संपादन।',
    descriptionEn:
      'Acquisition and careful digitization of classical editions, high-precision Devanagari OCR, and verified Hindi/English commentaries.',
  },
  {
    icon: 'Zap',
    titleHi: 'तीव्र गति व अखंड वैश्विक सर्वर',
    titleEn: 'Global High-Speed Edge Infrastructure',
    descriptionHi:
      'क्लाउड होस्टिंग, सीडीएन (CDN) और डोमेन नवीनीकरण ताकि भारत और विश्वभर के पाठक बिना किसी रुकावट के तुरंत श्लोक पढ़ सकें।',
    descriptionEn:
      'Fast edge caching and cloud servers ensuring instant shloka loading and offline capability across India and worldwide.',
  },
  {
    icon: 'Heart',
    titleHi: 'सदा सर्वदा निःशुल्क व सार्वजनिक',
    titleEn: 'Always Free & Public Knowledge',
    descriptionHi:
      'कोई भी श्लोक, टीका या अध्ययन साधन पेवॉल (Paywall) के पीछे नहीं है। विद्या सभी जिज्ञासुओं के लिए निष्काम भाव से उपलब्ध है।',
    descriptionEn:
      'Every single verse, translation, and study tool remains unconditionally accessible to all without login or subscription.',
  },
];

export interface ContributionFaq {
  questionHi: string;
  questionEn: string;
  answerHi: string;
  answerEn: string;
}

export const CONTRIBUTION_FAQS: ContributionFaq[] = [
  {
    questionHi: 'क्या धर्म ग्रंथ पर कोई भी श्लोक या सुविधा सशुल्क (paid) है?',
    questionEn: 'Are any verses or features on Dharma Granth behind a paywall?',
    answerHi:
      'नहीं। धर्म ग्रंथ का संपूर्ण पुस्तकालय, सभी श्लोक, अनुवाद, भाष्य, पंचांग व साधना उपकरण सदैव पूर्णतः निःशुल्क और विज्ञापन-मुक्त हैं। सहयोग केवल उन पाठकों के लिए एक ऐच्छिक अवसर है जो इस डिजिटल सेवा का संवर्धन करना चाहते हैं।',
    answerEn:
      'Never. The entire scripture library, every verse, translation, commentary, Panchang, and daily practice tool is 100% free and ad-free. Contribution is strictly voluntary for those who wish to sustain this independent cultural effort.',
  },
  {
    questionHi: 'मेरा सहयोग सीधे कहाँ पहुँचता है?',
    questionEn: 'Where does my contribution go?',
    answerHi:
      'यह 100% प्रत्यक्ष NPCI UPI द्वारा आधिकारिक खाते में जाता है। इसमें किसी तीसरे पक्ष या पेमेंट गेटवे का कोई कमीशन या कटौती नहीं होती।',
    answerEn:
      '100% of your contribution reaches directly via NPCI UPI with zero gateway fees, zero transaction cuts, and zero middlemen.',
  },
  {
    questionHi: 'क्या यह दान धारा 80G के अंतर्गत कर-मुक्त (tax-deductible) है?',
    questionEn: 'Is this contribution tax-deductible under Section 80G?',
    answerHi:
      'पारदर्शिता के साथ स्पष्ट कर दें: धर्म ग्रंथ वर्तमान में धारा 80G के अंतर्गत पंजीकृत नहीं है। यह सहयोग व्यक्तिगत ऐच्छिक सहायता (voluntary personal support) है जो केवल सर्वर व डिजिटल रखरखाव के लिए प्रयुक्त होता है, अतः कर-छूट हेतु मान्य नहीं है।',
    answerEn:
      'In full transparency: Dharma Granth is currently not registered under Section 80G. Contributions are personal voluntary gifts towards server, domain, and preservation costs, and are not eligible for tax exemption.',
  },
  {
    questionHi: 'सहयोग के बाद क्या मुझे कोई पुष्टि या पावती मिल सकती है?',
    questionEn: 'Can I get a confirmation or receipt after contributing?',
    answerHi:
      'आपके UPI ऐप (Google Pay, PhonePe, Paytm, BHIM) में प्राप्त 12-अंकों का UTR / बैंक संदर्भ नंबर ही आधिकारिक वित्तीय प्रमाण है। यदि आप कृतज्ञता पावती या संपर्क करना चाहते हैं, तो आप GitHub या ईमेल द्वारा संदेश भेज सकते हैं।',
    answerEn:
      'The 12-digit UTR / Bank Reference Number in your UPI app serves as your authentic transaction record. If you wish to connect or receive a warm note of gratitude, you are welcome to reach out via GitHub or email.',
  },
];
