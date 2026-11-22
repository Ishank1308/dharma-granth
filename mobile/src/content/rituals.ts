/**
 * The website's temple and ritual explainer (/rituals/) and its Upakarma guide (/rituals/upakarma/), from
 * data/rituals.ts and data/upakarma-data.ts, copied in at build time by scripts/build-explore.mjs. The ritual
 * texts are in Hindi, as on the website. The short Upakarma passages the website writes inside its page
 * (the three debts, the Brahmagranthi) are copied here with an English rendering beside them.
 */
import type { Msg } from '@/i18n/strings';
import { rituals, type Ritual } from './generated/explore/rituals';
import {
  REGIONAL_UPAKARMA_TRADITIONS,
  UPAKARMA_FAQS,
  UPAKARMA_MANTRAS,
  UPAKARMA_STEPS,
  YAJNOPAVITA_TANTUS,
  type UpakarmaMantra,
  type UpakarmaStep,
  type YajnopavitaTantu,
} from './generated/explore/upakarma';

export type { Ritual, UpakarmaMantra, UpakarmaStep, YajnopavitaTantu };
export { REGIONAL_UPAKARMA_TRADITIONS, UPAKARMA_FAQS, UPAKARMA_MANTRAS, UPAKARMA_STEPS, YAJNOPAVITA_TANTUS };

export const RITUALS: Ritual[] = rituals;

export function ritualById(id: string): Ritual | undefined {
  return rituals.find((r) => r.id === id);
}

export type RitualCategory = 'all' | 'daily' | 'temple' | 'homa' | 'sacred-forms';
export const RITUAL_CATEGORIES: RitualCategory[] = ['all', 'daily', 'temple', 'homa', 'sacred-forms'];

/** The website's grouping of rituals into its four filter chips (app/rituals/page.tsx CATEGORY_MAP). */
const CATEGORY_MAP: Record<string, Exclude<RitualCategory, 'all'>> = {
  puja: 'daily',
  arati: 'daily',
  prasada: 'daily',
  darshana: 'temple',
  abhisheka: 'temple',
  parikrama: 'temple',
  'temple-architecture': 'temple',
  'murti-puja': 'temple',
  homa: 'homa',
  samskara: 'homa',
  mantra: 'sacred-forms',
  mudra: 'sacred-forms',
  yantra: 'sacred-forms',
};

export function ritualCategory(id: string): Exclude<RitualCategory, 'all'> {
  return CATEGORY_MAP[id] ?? 'daily';
}

/** The website's search: name, Sanskrit, transliteration, summary and meaning, case-insensitive. */
export function filterRituals(category: RitualCategory, query: string): Ritual[] {
  const q = query.trim().toLowerCase();
  return rituals.filter((r) => {
    if (category !== 'all' && ritualCategory(r.id) !== category) return false;
    if (!q) return true;
    return [r.name, r.sanskrit, r.transliteration, r.shortDesc, r.meaning].some((s) => s.toLowerCase().includes(q));
  });
}

/** The three strands of the sacred thread: the three debts (UpakarmaClient.tsx). */
export const THREE_RINAS: { name: Msg; guna: Msg; text: Msg }[] = [
  {
    name: { en: 'Deva rina (देव-ऋण)', hi: 'देव-ऋण' },
    guna: { en: 'Sattva', hi: 'सत्त्व गुण' },
    text: {
      hi: 'सूर्य, वायु, जल और अग्नि आदि प्राकृतिक शक्तियों के प्रति कृतज्ञता। यह ऋण नित्य यज्ञ, सन्ध्या और पर्यावरण संरक्षण से चुकाया जाता है।',
      en: 'Gratitude to the powers of nature: sun, wind, water and fire. It is repaid through daily yajna, sandhya and care for the environment.',
    },
  },
  {
    name: { en: 'Rishi rina (ऋषि-ऋण)', hi: 'ऋषि-ऋण' },
    guna: { en: 'Rajas', hi: 'रजस् गुण' },
    text: {
      hi: 'ऋषियों द्वारा दिए गए वेद, उपनिषद् और ज्ञान-परम्परा के प्रति आभार। यह स्वाध्याय (अध्ययन) और ज्ञान के प्रचार-प्रसार से चुकता होता है।',
      en: 'Gratitude for the Vedas, Upanishads and the tradition of knowledge the rishis gave. It is repaid through svadhyaya (study) and passing that knowledge on.',
    },
  },
  {
    name: { en: 'Pitru rina (पितृ-ऋण)', hi: 'पितृ-ऋण' },
    guna: { en: 'Tamas', hi: 'तमस् गुण' },
    text: {
      hi: 'माता-पिता और पूर्वजों के प्रति ऋण। यह कुल-मर्यादा का पालन करने, सन्तानों को सुसंस्कृत बनाने और पितृ-तर्पण से पूरा होता है।',
      en: 'The debt to parents and ancestors. It is fulfilled by keeping the family’s dignity, raising children with good values, and pitru tarpana.',
    },
  },
];

export const BRAHMAGRANTHI: Msg = {
  hi: 'जनेऊ के तीनों सूत्रों को एक साथ बांधने वाली ग्रन्थि को ‘ब्रह्मग्रन्थि’ कहते हैं। यह इस सत्य का स्मरण कराती है कि सृष्टि के समस्त रूप, गुण और ऋण अन्ततः उस एक अद्वैत परब्रह्म (सच्चिदानन्द) में ही प्रतिष्ठित हैं।',
  en: 'The knot that binds the three strands of the sacred thread is the Brahmagranthi. It is a reminder that every form, quality and debt in creation rests, in the end, in the one non-dual Brahman (Sachchidananda).',
};

export const UPAKARMA_INTRO: Msg = {
  hi: 'तैत्तिरीय आरण्यक और गृह्यसूत्रों पर आधारित श्रावणी उपाकर्म की समग्र वैदिक दर्शिका। जानिए वर्ष भर के प्रमादों के निष्कासन हेतु कामोऽकार्षीत् प्रायश्चित्त जप (108 आवर्तन), ब्रह्म-यज्ञ, नूतन यज्ञोपवीत धारण-विसर्जन मन्त्र और जनेऊ के नौ तन्तुओं का गूढ़ आध्यात्मिक रहस्य।',
  en: 'A complete Vedic guide to Shravani Upakarma, after the Taittiriya Aranyaka and the Grihya Sutras: the Kamokarshit atonement japa (108 times), Brahma-yajna, the mantras for wearing the new sacred thread and laying the old one to rest, and the meaning of its nine threads.',
};

export const SACRED_THREAD_INTRO: Msg = {
  hi: 'जनेऊ मात्र एक सूती धागा नहीं, अपितु सम्पूर्ण ब्रह्माण्डीय शक्तियों और तीन ऋणों का देह पर प्रत्यक्ष आवरण है।',
  en: 'The sacred thread is not just a cotton cord: it is the powers of the cosmos and the three debts, worn on the body.',
};

export const JAPA_TARGET = 108;
