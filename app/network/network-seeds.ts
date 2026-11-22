export interface SeedVerse {
  key: string;
  scriptureId: string;
  scriptureTitle: string;
  scriptureTitleHi: string;
  chapterId: number;
  verseId: number | string;
  theme: string;
  themeHi: string;
  sanskrit: string;
  translation: string;
  description: string;
}

export const FEATURED_SEEDS: SeedVerse[] = [
  {
    key: 'bhagavadgita:2:47',
    scriptureId: 'bhagavadgita',
    scriptureTitle: 'Bhagavad Gita',
    scriptureTitleHi: 'श्रीमद्भगवद्गीता',
    chapterId: 2,
    verseId: 47,
    theme: 'Nishkama Karma (Selfless Action)',
    themeHi: 'निष्काम कर्मयोग',
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
    translation:
      'You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to inaction.',
    description: 'The crowning doctrine of Karma Yoga, echoing the foundational teaching of the ancient Isha Upanishad.',
  },
  {
    key: 'bhagavadgita:2:20',
    scriptureId: 'bhagavadgita',
    scriptureTitle: 'Bhagavad Gita',
    scriptureTitleHi: 'श्रीमद्भगवद्गीता',
    chapterId: 2,
    verseId: 20,
    theme: 'Immortality of the Conscious Witness (Atman)',
    themeHi: 'आत्मा की नित्यता व अवध्यता',
    sanskrit: 'न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः । अजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे ॥',
    translation:
      'The soul is never born, nor does it die at any time; having once existed, it never ceases to be. It is unborn, eternal, ever-existing, and primeval; it is not slain when the body is slain.',
    description: 'Verbatim parallel to Katha Upanishad 2.18, proving the unbroken transmission of Vedic Vedanta into the Gita.',
  },
  {
    key: 'bhagavadgita:15:1',
    scriptureId: 'bhagavadgita',
    scriptureTitle: 'Bhagavad Gita',
    scriptureTitleHi: 'श्रीमद्भगवद्गीता',
    chapterId: 15,
    verseId: 1,
    theme: 'The Cosmic Ashvattha Tree (World Metaphor)',
    themeHi: 'संसार-वृक्ष रूपक',
    sanskrit: 'ऊर्ध्वमूलमधःशाखमश्वत्थं प्राहुरव्ययम् । छन्दांसि यस्य पर्णानि यस्तं वेद स वेदवित् ॥',
    translation:
      'They speak of an eternal Ashvattha tree with its root above and branches below, whose leaves are the Vedic hymns. One who knows this tree knows the true essence of the Vedas.',
    description: 'Direct cosmological parallel to Katha Upanishad 2.3.1, describing the universe rooted in the Supreme transcendent Source.',
  },
  {
    key: 'bhagavadgita:6:34',
    scriptureId: 'bhagavadgita',
    scriptureTitle: 'Bhagavad Gita',
    scriptureTitleHi: 'श्रीमद्भगवद्गीता',
    chapterId: 6,
    verseId: 34,
    theme: 'Mastery of the Restless Mind',
    themeHi: 'मन का निग्रह व साधना',
    sanskrit: 'चञ्चलं हि मनः कृष्ण प्रमाथि बलवद् दृढम् । तस्याहं निग्रहं मन्ये वायोरिव सुदुष्करम् ॥',
    translation:
      'The mind is restless, turbulent, obstinate, and very strong, O Krishna. To curb it, I think, is harder than controlling the wind.',
    description: 'Parallels Katha Upanishad 1.3.3–4 (The Chariot Metaphor), addressing the universal challenge of mental turbulence.',
  },
  {
    key: 'bhagavadgita:18:66',
    scriptureId: 'bhagavadgita',
    scriptureTitle: 'Bhagavad Gita',
    scriptureTitleHi: 'श्रीमद्भगवद्गीता',
    chapterId: 18,
    verseId: 66,
    theme: 'The Ultimate Surrender (Charama Shloka)',
    themeHi: 'चरम श्लोक — सर्वात्म-समर्पण',
    sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज । अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ॥',
    translation:
      'Abandon all varieties of dharmas and simply surrender unto Me alone. I shall liberate you from all sinful reactions; do not grieve.',
    description: 'The highest synthesis of Bhakti, Jnana, and Sharanagati, transcending dualistic ritualism for direct union with the Divine.',
  },
  {
    key: 'bhagavadgita:13:13',
    scriptureId: 'bhagavadgita',
    scriptureTitle: 'Bhagavad Gita',
    scriptureTitleHi: 'श्रीमद्भगवद्गीता',
    chapterId: 13,
    verseId: 13,
    theme: 'The Omnipresent Reality (Brahman)',
    themeHi: 'सर्वव्यापी परब्रह्म तत्त्व',
    sanskrit: 'सर्वतःपाणिपादं तत्सर्वतोऽक्षिशिरोमुखम् । सर्वतःश्रुतिमल्लोके सर्वमावृत्य तिष्ठति ॥',
    translation:
      'Everywhere are Its hands and feet, eyes, heads, and faces; everywhere are Its ears. Pervading everything in the universe, It exists.',
    description: 'Echoes Shvetashvatara Upanishad 3.16 and the Rigvedic Purusha Sukta, meditating upon the cosmic consciousness.',
  },
  {
    key: 'bhagavadgita:4:7',
    scriptureId: 'bhagavadgita',
    scriptureTitle: 'Bhagavad Gita',
    scriptureTitleHi: 'श्रीमद्भगवद्गीता',
    chapterId: 4,
    verseId: 7,
    theme: 'Descent of the Avatar for Dharma Restoration',
    themeHi: 'धर्म-संस्थापनार्थ अवतार',
    sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत । अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥',
    translation:
      'Whenever and wherever there is a decline in righteousness, O descendant of Bharata, and an ascent of unrighteousness, at that time I manifest Myself.',
    description: 'The timeless spiritual law connecting the Gita to the Epics (Mahabharata and Ramayana), promising divine intervention.',
  },
  {
    key: 'bhagavadgita:2:56',
    scriptureId: 'bhagavadgita',
    scriptureTitle: 'Bhagavad Gita',
    scriptureTitleHi: 'श्रीमद्भगवद्गीता',
    chapterId: 2,
    verseId: 56,
    theme: 'The Sthitaprajna Ideal (Equanimous Sage)',
    themeHi: 'स्थितप्रज्ञ का स्वरूप',
    sanskrit: 'दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः । वीतरागभयक्रोधः स्थितधीर्मुनिरुच्यते ॥',
    translation:
      'One whose mind is undisturbed amidst misery, who has no craving for pleasures, and is free from attachment, fear, and anger, is called a sage of steady contemplation.',
    description: 'Practical psychological framework for mastering inner tranquility, connected to Patanjali Yoga Sutra principles.',
  },
];
