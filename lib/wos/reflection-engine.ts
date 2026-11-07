/**
 * Dharma Granth: Guided Reflection System Engine
 * 
 * Local-First, Zero-Surveillance Architecture for Shravana -> Manana -> Nididhyasana.
 * Manages post-verse reflection prompts, local storage persistence,
 * and metacognitive inquiry.
 */

import type { GuidedReflectionPrompt, StoredReflection, ReflectionPromptType } from './types';

export const CANONICAL_REFLECTION_PROMPTS: readonly GuidedReflectionPrompt[] = [
  {
    type: 'insight',
    labelEn: 'Core Insight',
    labelHi: 'मूल भाव',
    questionEn: 'What specific word, line, or insight arrested your attention in this verse?',
    questionHi: 'इस श्लोक में किस विशेष शब्द, पंक्ति या भाव ने आपके चित्त को आकर्षित किया?',
    guidanceEn: 'Notice without rushing. What illuminated something unexpected for you?',
    guidanceHi: 'शीघ्रता न करें। किस शब्द ने आपके भीतर कोई नई समझ जगाई?',
  },
  {
    type: 'resonance',
    labelEn: 'Life Resonance',
    labelHi: 'जीवन से सम्बन्ध',
    questionEn: 'How does this teaching relate directly to a relationship, dilemma, or circumstance in your life today?',
    questionHi: 'यह उपदेश आज आपके जीवन की किस परिस्थिति, सम्बन्ध या दुविधा से सीधे मेल खाता है?',
    guidanceEn: 'Connect timeless scripture to your immediate living reality.',
    guidanceHi: 'शाश्वत ज्ञान को अपने दैनिक व्यावहारिक जीवन से जोड़ें।',
  },
  {
    type: 'action',
    labelEn: 'Practical Action',
    labelHi: 'व्यावहारिक आचरण',
    questionEn: 'What is one concrete, observable micro-action you can take in the next 12 hours based on this wisdom?',
    questionHi: 'इस ज्ञान के आधार पर अगले 12 घंटों में आप कौन-सा एक व्यावहारिक आचरण या कार्य करेंगे?',
    guidanceEn: 'Wisdom that is not embodied in conduct remains mere theory.',
    guidanceHi: 'जो ज्ञान आचरण में नहीं उतरता, वह केवल कोरा विचार रह जाता है।',
  },
  {
    type: 'challenge',
    labelEn: 'Belief Challenged',
    labelHi: 'धारणा की परीक्षा',
    questionEn: 'What unexamined assumption, prejudice, or fear of yours does this passage quietly challenge?',
    questionHi: 'यह श्लोक आपके किस पूर्वाग्रह, पुरानी धारणा या भय को चुनौती देता है?',
    guidanceEn: 'True growth begins when comfortable illusions are peacefully deconstructed.',
    guidanceHi: 'सच्चा आत्म-विकास तब आरम्भ होता है जब पुरानी भ्रांतियाँ टूटती हैं।',
  },
];

export const WOS_REFLECTIONS_STORAGE_KEY = 'dharma.wos.reflections.v1';
export const WOS_REFLECTION_EVENT = 'dharma-wos-reflection-saved';

export function getReflectionPrompt(type: ReflectionPromptType): GuidedReflectionPrompt {
  return CANONICAL_REFLECTION_PROMPTS.find((p) => p.type === type) || CANONICAL_REFLECTION_PROMPTS[0];
}

export function readReflections(): StoredReflection[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(WOS_REFLECTIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveReflection(
  reflection: Omit<StoredReflection, 'id' | 'createdAt' | 'updatedAt'>
): StoredReflection {
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? `refl:${crypto.randomUUID()}`
    : `refl:${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  
  const now = new Date().toISOString();
  const entry: StoredReflection = {
    ...reflection,
    id,
    createdAt: now,
    updatedAt: now,
  };

  if (typeof window !== 'undefined') {
    try {
      const existing = readReflections();
      const updated = [entry, ...existing].slice(0, 500); // Keep max 500 local reflections
      window.localStorage.setItem(WOS_REFLECTIONS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(WOS_REFLECTION_EVENT, { detail: entry }));
    } catch {
      // Storage quota or restriction handled gracefully
    }
  }

  return entry;
}

export function getReflectionsForVerse(
  scriptureId: string,
  chapterNumber: number,
  verseNumber: number | string
): StoredReflection[] {
  const all = readReflections();
  return all.filter((r) =>
    r.verseReference.scriptureId === scriptureId &&
    r.verseReference.chapterNumber === chapterNumber &&
    String(r.verseReference.verseNumber) === String(verseNumber)
  );
}
