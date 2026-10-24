/**
 * Dharma Granth: Digital Wellbeing Attentional Modes Manager
 * 
 * Configures and manages the 7 contemplative interaction modes:
 * 1. Focus Mode (एकाग्रता)
 * 2. Deep Reading Mode (गहन अध्ययन)
 * 3. Reflection Mode (मनन)
 * 4. Silent Mode (मौन)
 * 5. Study Session Mode (साधना सत्र)
 * 6. Digital Detox Mode (डिजिटल उपराम)
 * 7. Reading Retreat Mode (स्वाध्याय अनुष्ठान)
 */

import type { AttentionalMode, AttentionalModeConfig } from './types';

export const ATTENTIONAL_MODE_CONFIGS: Record<AttentionalMode, AttentionalModeConfig> = {
  standard: {
    mode: 'standard',
    nameEn: 'Standard',
    nameHi: 'सामान्य',
    descriptionEn: 'Full library navigation with commentary and exploration pathways.',
    descriptionHi: 'भाष्य, संदर्भ और अन्वेषण के साथ पूर्ण पुस्तकालय दृश्य।',
    hideNavigation: false,
    hideChrome: false,
    disableAudio: false,
    enableTimer: false,
    encourageScreenClose: false,
  },
  focus: {
    mode: 'focus',
    nameEn: 'Focus Mode',
    nameHi: 'एकाग्रता मोड',
    descriptionEn: 'Strips away all chrome, menus, and sidebars. Only the verse and pure text remain.',
    descriptionHi: 'समस्त मेनू और विकर्षण हटाकर केवल मूल श्लोक और अनुवाद पर ध्यान।',
    hideNavigation: true,
    hideChrome: true,
    disableAudio: false,
    enableTimer: false,
    encourageScreenClose: false,
  },
  'deep-reading': {
    mode: 'deep-reading',
    nameEn: 'Deep Reading Mode',
    nameHi: 'गहन अध्ययन मोड',
    descriptionEn: 'Continuous vertical flow, generous 1.8 line height, serif typography, hidden commentary disclosures.',
    descriptionHi: 'विशाल पंक्ति अंतराल, शांत फ़ॉन्ट और बिना रुकावट निरंतर पठन प्रवाह।',
    hideNavigation: false,
    hideChrome: true,
    disableAudio: false,
    enableTimer: false,
    encourageScreenClose: false,
  },
  reflection: {
    mode: 'reflection',
    nameEn: 'Reflection Mode',
    nameHi: 'मनन मोड',
    descriptionEn: 'Pins the sacred verse at the top while opening a spacious distraction-free journal below.',
    descriptionHi: 'श्वास और श्लोक को स्थिर रखकर नीचे शांत मनन और विचार लेखन क्षेत्र।',
    hideNavigation: true,
    hideChrome: true,
    disableAudio: false,
    enableTimer: false,
    encourageScreenClose: false,
  },
  silent: {
    mode: 'silent',
    nameEn: 'Silent Mode',
    nameHi: 'मौन मोड',
    descriptionEn: 'Disables all audio, ambient soundscapes, animations, and visual badges for absolute silence.',
    descriptionHi: 'पूर्ण मौन के लिए सभी ध्वनियों, ऑडियो और एनिमेशन को बंद रखना।',
    hideNavigation: false,
    hideChrome: false,
    disableAudio: true,
    enableTimer: false,
    encourageScreenClose: false,
  },
  'study-session': {
    mode: 'study-session',
    nameEn: 'Study Session Mode',
    nameHi: 'साधना सत्र',
    descriptionEn: 'Voluntary timed immersion (20 mins default). The timer pauses automatically when the tab is hidden.',
    descriptionHi: 'निश्चित समय (20 मिनट) का संकल्पित अध्ययन; स्क्रीन हटने पर समय स्वतः रुक जाता है।',
    hideNavigation: false,
    hideChrome: false,
    disableAudio: false,
    enableTimer: true,
    defaultTimerMinutes: 20,
    encourageScreenClose: false,
  },
  'digital-detox': {
    mode: 'digital-detox',
    nameEn: 'Digital Detox Mode',
    nameHi: 'डिजिटल उपराम',
    descriptionEn: 'Designed to get you off the screen. Reads one verse, prompts 60 seconds of contemplation, then advises closing the device.',
    descriptionHi: 'एक श्लोक पढ़ें, 60 सेकेण्ड मनन करें और स्क्रीन बंद कर वास्तविक जीवन में लौटें।',
    hideNavigation: true,
    hideChrome: true,
    disableAudio: true,
    enableTimer: true,
    defaultTimerMinutes: 2,
    encourageScreenClose: true,
  },
  'reading-retreat': {
    mode: 'reading-retreat',
    nameEn: 'Reading Retreat Mode',
    nameHi: 'स्वाध्याय अनुष्ठान',
    descriptionEn: 'Extended contemplative immersion with scheduled 2-minute breathing interludes every 15 minutes.',
    descriptionHi: 'विस्तृत स्वाध्याय सत्र जिसमें हर 15 मिनट पर 2 मिनट का मौन विराम मिलता है।',
    hideNavigation: false,
    hideChrome: true,
    disableAudio: false,
    enableTimer: true,
    defaultTimerMinutes: 45,
    encourageScreenClose: false,
  },
};

export const WOS_ATTENTIONAL_MODE_KEY = 'dharma.wos.attentional-mode.v1';
export const WOS_ATTENTIONAL_MODE_EVENT = 'dharma-wos-mode-changed';

export function readAttentionalMode(): AttentionalMode {
  if (typeof window === 'undefined') return 'standard';
  try {
    const saved = window.localStorage.getItem(WOS_ATTENTIONAL_MODE_KEY) as AttentionalMode | null;
    return saved && saved in ATTENTIONAL_MODE_CONFIGS ? saved : 'standard';
  } catch {
    return 'standard';
  }
}

export function setAttentionalMode(mode: AttentionalMode): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(WOS_ATTENTIONAL_MODE_KEY, mode);
    window.dispatchEvent(new CustomEvent(WOS_ATTENTIONAL_MODE_EVENT, { detail: mode }));
  } catch {
    // Safe fallback
  }
}
