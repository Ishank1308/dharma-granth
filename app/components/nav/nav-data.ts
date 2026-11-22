import {
  Bookmark,
  BookOpen,
  Calendar,
  Clock,
  Compass,
  FileText,
  Flame,
  GraduationCap,
  Heart,
  HelpCircle,
  History,
  Home,
  Layers,
  MapPin,
  Moon,
  Share2,
  Sparkles,
  Star,
  Sun,
  Sunset,
  Users,
} from 'lucide-react';
import type { Theme } from '../ThemeProvider';

export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

export function isNavRouteActive(pathname: string | null, href: string): boolean {
  const cleanHref = href.split('#')[0] || '/';
  const base = cleanHref === '/' ? '/' : cleanHref.replace(/\/+$/, '');
  const path = !pathname || pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  if (base === '/') return path === '/';
  if (base === '/scriptures') {
    return (
      path === '/scriptures' ||
      (path.startsWith('/scripture/') && !path.startsWith('/scripture/bhagavadgita'))
    );
  }
  return path === base || path.startsWith(`${base}/`);
}

export const THEME_ICONS: Record<Theme, typeof Sun> = {
  sunset: Sunset,
  night: Moon,
};

export const desktopPrimaryItems = [
  { label: 'Home', labelHi: 'मुख', href: '/' },
  { label: 'Scriptures', labelHi: 'ग्रंथालय', href: '/scriptures/' },
  { label: 'Bhagavad Gita', labelHi: 'गीता', href: '/scripture/bhagavadgita/' },
  { label: 'Learn', labelHi: 'अध्ययन', href: '/learn/' },
  { label: 'Sadhana', labelHi: 'साधना', href: '/practice/' },
  { label: 'Panchang', labelHi: 'पंचांग', href: '/panchang/' },
];

export interface DiscoveryGroup {
  name: string;
  nameEn: string;
  icon: typeof Compass;
  items: Array<{
    label: string;
    description: string;
    href: string;
    icon: typeof BookOpen;
  }>;
}

export const discoveryGroups: DiscoveryGroup[] = [
  {
    name: 'स्वाध्याय व मार्गदर्शन',
    nameEn: 'Study & Guidance',
    icon: Compass,
    items: [
      { label: 'अष्टावक्र गीता', description: 'अध्याय, मूल श्लोक, अर्थ और दार्शनिक व्याख्या', href: '/ashtavakra/', icon: Flame },
      { label: 'शास्त्रीय जीवन-मार्गदर्शन', description: 'उद्वेग, भय व क्रोध का शास्त्रीय समाधान', href: '/wisdom-for-life/', icon: Compass },
      { label: 'ज्ञान मार्ग', description: 'भाव, प्रश्न व संत से शास्त्र तक', href: '/wisdom-pathways/', icon: Sparkles },
      { label: 'धर्म सहायक', description: 'पुस्तकालय के श्लोकों से जीवन के प्रश्न', href: '/ask/', icon: HelpCircle },
      { label: 'दैनिक श्लोक', description: 'आज का श्लोक WhatsApp पर साझा करें', href: '/daily-verse/', icon: Sun },
      { label: 'गीता संकल्प साधना', description: '18-दिवसीय व 365-दिवसीय गीता पारायण', href: '/practice/gita-sankalpa/', icon: Clock },
    ],
  },
  {
    name: 'वैदिक संदर्भ',
    nameEn: 'Vedic Reference',
    icon: Layers,
    items: [
      { label: 'वैदिक मन्त्र व शान्ति पाठ', description: 'Sacred Mantras — पदच्छेद, शब्दार्थ व भावार्थ', href: '/mantras/', icon: Sparkles },
      { label: 'श्लोक संबंध जाल', description: 'गीता, उपनिषद् व वेद की कड़ियाँ', href: '/network/', icon: Share2 },
      { label: 'अवधारणाएँ', description: 'मुख्य दार्शनिक विचार व तत्व ज्ञान', href: '/concepts/', icon: FileText },
      { label: 'पात्र', description: 'कथाओं के प्रमुख चरित्र', href: '/characters/', icon: Users },
      { label: 'स्थान व तीर्थ', description: 'पवित्र और ऐतिहासिक तीर्थ स्थल', href: '/locations/', icon: MapPin },
      { label: 'कालखंड', description: 'समयरेखा और वैदिक परंपरा', href: '/timelines/', icon: History },
      { label: 'स्रोत पारदर्शिता', description: 'मूल पांडुलिपियाँ व संदर्भ ग्रंथ सूची', href: '/sources/', icon: BookOpen },
    ],
  },
  {
    name: 'पंचांग व पर्व',
    nameEn: 'Panchang & Festivals',
    icon: Calendar,
    items: [
      { label: 'वैदिक मुहूर्त निर्णय', description: 'पंचांग शुद्धि, ताराबल व चन्द्रबल', href: '/panchang/muhurta/', icon: Clock },
      { label: 'उत्सव ज्ञान केंद्र', description: 'प्रमुख पर्व और उनका शास्त्रीय अर्थ', href: '/festivals/', icon: Star },
      { label: 'अनुष्ठान व विधियाँ', description: 'वैदिक विधियाँ और नित्य परंपराएँ', href: '/rituals/', icon: Flame },
      { label: 'सहयोग व सेवा', description: 'प्रत्यक्ष UPI व QR द्वारा धर्म ग्रंथ का संवर्धन', href: '/contribute/', icon: Heart },
    ],
  },
];

export const desktopDiscoveryItems = discoveryGroups.flatMap((group) => group.items);

export const desktopPersonalItems = [
  { label: 'दैनिक साधना', href: '/practice/' },
  { label: 'सुरक्षित श्लोक', href: '/practice/bookmarks/' },
  { label: 'स्वाध्याय डायरी', href: '/practice/journal/' },
  { label: 'कथा-दर्शन', href: '/story/' },
  { label: 'संग्रह', href: '/collections/' },
  { label: 'ऐच्छिक सहयोग', href: '/contribute/' },
];

export interface DrawerItem {
  id: string;
  label: string;
  labelEn: string;
  description: string;
  href: string;
  icon: typeof Home;
  badge?: string;
  badgeType?: 'streak' | 'count' | 'accent';
}

export function buildDrawerSections({
  libraryVerses,
  gitaChapters,
  gitaVerses,
  ashtavakraChapters,
  ashtavakraVerses,
  bookmarkCount,
  activeStreak,
  formatCount,
}: {
  libraryVerses: number;
  gitaChapters: number;
  gitaVerses: number;
  ashtavakraChapters: number;
  ashtavakraVerses: number;
  bookmarkCount: number;
  activeStreak: number;
  formatCount: (value: number) => string;
}): DrawerItem[] {
  return [
    {
      id: 'home',
      label: 'मुख पृष्ठ',
      labelEn: 'Home',
      description: 'आरंभ व मुख्य द्वार',
      href: '/',
      icon: Home,
    },
    {
      id: 'library',
      label: 'सम्पूर्ण ग्रंथालय',
      labelEn: 'Scripture Library',
      description: `पुस्तकालय में ${formatCount(libraryVerses)} श्लोक`,
      href: '/scriptures/',
      icon: BookOpen,
      badge: formatCount(libraryVerses),
      badgeType: 'accent',
    },
    {
      id: 'gita',
      label: 'श्रीमद्भगवद्गीता',
      labelEn: 'Bhagavad Gita',
      description: `${formatCount(gitaChapters)} अध्याय · ${formatCount(gitaVerses)} श्लोक`,
      href: '/scripture/bhagavadgita/',
      icon: Flame,
      badge: `${formatCount(gitaVerses)} श्लोक`,
      badgeType: 'accent',
    },
    {
      id: 'ashtavakra',
      label: 'अष्टावक्र गीता',
      labelEn: 'Ashtavakra Gita',
      description: `${formatCount(ashtavakraChapters)} प्रकरण · ${formatCount(ashtavakraVerses)} श्लोक`,
      href: '/ashtavakra/',
      icon: BookOpen,
      badge: `${formatCount(ashtavakraVerses)} श्लोक`,
      badgeType: 'accent',
    },
    {
      id: 'learn',
      label: 'शास्त्र स्वाध्याय',
      labelEn: 'Learn',
      description: 'अध्ययन मार्ग, पाठ, फ्लैशकार्ड व प्रश्नोत्तरी',
      href: '/learn/',
      icon: GraduationCap,
    },
    {
      id: 'sadhana',
      label: 'दैनिक साधना',
      labelEn: 'Sadhana',
      description: '108 जप माला, ध्यान साधना, प्राणायाम व चिन्तन',
      href: '/practice/',
      icon: Sparkles,
    },
    {
      id: 'mantras',
      label: 'वैदिक मन्त्र व शान्ति पाठ',
      labelEn: 'Sacred Mantras',
      description: 'गायत्री, महामृत्युंजय व उपनिषद् शान्ति पाठ',
      href: '/mantras/',
      icon: Sparkles,
      badge: 'मन्त्र कोश',
      badgeType: 'accent',
    },
    {
      id: 'wisdom-for-life',
      label: 'जीवन मार्गदर्शन',
      labelEn: 'Wisdom for Life',
      description: '12 जीवन-विषय · उद्वेग, भय, कर्तव्य व आत्मज्ञान',
      href: '/wisdom-for-life/',
      icon: Compass,
      badge: 'जीवन-विषय',
      badgeType: 'accent',
    },
    {
      id: 'ask-dharma',
      label: 'धर्म सहायक',
      labelEn: 'Scripture guide',
      description: 'पुस्तकालय के श्लोकों से जीवन के प्रश्न',
      href: '/ask/',
      icon: BookOpen,
      badge: 'श्लोक से',
      badgeType: 'accent',
    },
    {
      id: 'panchang',
      label: 'वैदिक पंचांग',
      labelEn: 'Panchang',
      description: 'तिथि, पक्ष, नक्षत्र, योग व ऋतु',
      href: '/panchang/',
      icon: Calendar,
    },
    {
      id: 'festivals',
      label: 'उत्सव ज्ञान केंद्र',
      labelEn: 'Festivals',
      description: 'प्रमुख पर्व, व्रत व शास्त्रीय परंपरा',
      href: '/festivals/',
      icon: Star,
    },
    {
      id: 'saved',
      label: 'सहेजे गए श्लोक',
      labelEn: 'Saved verses',
      description: 'निजी संग्रह व पसंदीदा श्लोक',
      href: '/practice/bookmarks/',
      icon: Bookmark,
      badge: bookmarkCount > 0 ? `${bookmarkCount}` : undefined,
      badgeType: 'count',
    },
    {
      id: 'history',
      label: 'अध्ययन इतिहास',
      labelEn: 'Reading history',
      description: 'पठन प्रगति व अभ्यास डैशबोर्ड',
      href: '/practice/dashboard/',
      icon: Clock,
      badge: activeStreak > 0 ? `🔥 ${activeStreak} दिन` : undefined,
      badgeType: 'streak',
    },
    {
      id: 'contribute',
      label: 'ऐच्छिक सहयोग',
      labelEn: 'Support',
      description: 'प्रत्यक्ष UPI व QR द्वारा ग्रंथालय सेवा',
      href: '/contribute/',
      icon: Heart,
    },
  ];
}
