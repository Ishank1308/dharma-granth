'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFoldingTitle } from '@/lib/useFoldingTitle';
import { useEffect, useRef, useState, useCallback, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import {
  Bookmark,
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Compass,
  Flame,
  Globe,
  Heart,
  HelpCircle,
  History,
  Home,
  Layers,
  MapPin,
  Menu,
  Moon,
  Search,
  Settings2,
  Share2,
  Sparkles,
  Star,
  Sun,
  Sunset,
  Users,
  FileText,
  X,
} from 'lucide-react';
import { usePresence } from '@/app/components/motion/usePresence';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { THEMES, THEME_NAMES, useTheme, type Theme } from './ThemeProvider';
import {
  useLanguagePreference,
  type LanguagePreference,
  LANGUAGE_OPTIONS,
} from '@/lib/useLanguagePreference';
import { triggerTactileFeedback } from '@/lib/haptics';
import { THEME_IDS } from '@/lib/site-theme';
import { readActiveStreak } from '@/lib/reading-history';
import { OPEN_SEARCH_EVENT, type OpenSearchDetail } from '@/lib/search-events';

// Lazy-load the heavy search modal to avoid bundling search index in the critical path
const loadSearchModal = () =>
  import('./GlobalSearchModal').then((m) => {
    // Hover/focus warms the index JSON before first open; the modal dedupes repeats.
    m.warmSearchIndexes();
    return m;
  });
const GlobalSearchModal = dynamic(
  () => loadSearchModal().then((m) => m.GlobalSearchModal),
  { ssr: false },
);

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

const THEME_ICONS: Record<Theme, typeof Sun> = {
  auto: Sparkles,
  day: Sun,
  sunset: Sunset,
  paper: BookOpen,
  night: Moon,
};


const desktopPrimaryItems = [
  { label: 'Home', labelHi: 'मुख', href: '/' },
  { label: 'Scriptures', labelHi: 'ग्रंथालय', href: '/scriptures/' },
  { label: 'Bhagavad Gita', labelHi: 'गीता', href: '/scripture/bhagavadgita/' },
  { label: 'Sadhana', labelHi: 'साधना', href: '/practice/' },
  { label: 'Panchang', labelHi: 'पंचांग', href: '/panchang/' },
];

interface DiscoveryGroup {
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

const discoveryGroups: DiscoveryGroup[] = [
  {
    name: 'स्वाध्याय व मार्गदर्शन',
    nameEn: 'Study & Guidance',
    icon: Compass,
    items: [
      { label: 'अष्टावक्र गीता', description: 'अलग पठन — मूल संस्कृत व सरल व्याख्या', href: '/ashtavakra/', icon: Flame },
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

const desktopDiscoveryItems = discoveryGroups.flatMap((group) => group.items);

const desktopPersonalItems = [
  { label: 'दैनिक साधना', href: '/practice/' },
  { label: 'सुरक्षित श्लोक', href: '/practice/bookmarks/' },
  { label: 'स्वाध्याय डायरी', href: '/practice/journal/' },
  { label: 'कथा-दर्शन', href: '/story/' },
  { label: 'संग्रह', href: '/collections/' },
  { label: 'ऐच्छिक सहयोग', href: '/contribute/' },
];

interface DrawerItem {
  id: string;
  label: string;
  labelEn: string;
  description: string;
  href: string;
  icon: typeof Home;
  badge?: string;
  badgeType?: 'streak' | 'count' | 'accent';
}



export function SiteNav({
  libraryVerses,
  gitaChapters,
  gitaVerses,
  ashtavakraChapters,
  ashtavakraVerses,
}: {
  /** Verses counted from the published library. */
  libraryVerses: number;
  gitaChapters: number;
  gitaVerses: number;
  ashtavakraChapters: number;
  ashtavakraVerses: number;
}) {
  const formatCount = (value: number) => new Intl.NumberFormat('en-IN').format(value);
  const pathname = usePathname();
  // The home page opens on its own hero, so only inner pages fold their title into the bar.
  const fold = useFoldingTitle(pathname, pathname !== '/');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchMounted, setSearchMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchAnchor, setSearchAnchor] = useState<HTMLButtonElement>();
  const [shortcutLabel, setShortcutLabel] = useState('Ctrl K');
  const [bookmarkCount, setBookmarkCount] = useState<number>(0);
  const [activeStreak, setActiveStreak] = useState<number>(0);

  const { theme, setTheme } = useTheme();
  const { preference, setPreference } = useLanguagePreference();

  const discoverRef = useRef<HTMLDivElement>(null);
  const discoverButtonRef = useRef<HTMLButtonElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const themeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerCloseBtnRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const discoverMenu = usePresence(discoverOpen, 140);
  const drawer = usePresence(drawerOpen, 200);
  // The theme icon swaps with a little turn, but only after the reader changes it, never on first paint.
  const [themeTouched, setThemeTouched] = useState(false);

  const isActive = useCallback(
    (href: string): boolean => {
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
    },
    [pathname],
  );

  const discoveryIsActive = desktopDiscoveryItems.some((item) => isActive(item.href));

  // Sync saved bookmarks count & streak
  const refreshStorageMetrics = useCallback(() => {
    try {
      const saved = localStorage.getItem('dharma.bookmarkedVerses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setBookmarkCount(parsed.length);
      } else {
        setBookmarkCount(0);
      }
    } catch {
      setBookmarkCount(0);
    }
    setActiveStreak(readActiveStreak());
  }, []);

  useEffect(() => {
    refreshStorageMetrics();
    window.addEventListener('storage', refreshStorageMetrics);
    window.addEventListener('dharma:streak-change', refreshStorageMetrics);
    window.addEventListener('dharma-bookmark-updated', refreshStorageMetrics);
    return () => {
      window.removeEventListener('storage', refreshStorageMetrics);
      window.removeEventListener('dharma:streak-change', refreshStorageMetrics);
      window.removeEventListener('dharma-bookmark-updated', refreshStorageMetrics);
    };
  }, [refreshStorageMetrics, pathname]);

  useEffect(() => {
    if (searchOpen) setSearchMounted(true);
    else {
      setSearchQuery('');
      setSearchAnchor(undefined);
    }
  }, [searchOpen]);

  // Global search event listener
  useEffect(() => {
    function handleOpenSearch(e: Event) {
      const { query, anchor } = (e as CustomEvent<OpenSearchDetail>).detail ?? {};
      setSearchQuery(query ?? '');
      setSearchAnchor(anchor);
      setSearchOpen(true);
    }
    window.addEventListener(OPEN_SEARCH_EVENT, handleOpenSearch);
    return () => window.removeEventListener(OPEN_SEARCH_EVENT, handleOpenSearch);
  }, []);

  // Keyboard shortcut detection
  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) {
      setShortcutLabel('⌘K');
    }
  }, []);

  // Global key bindings
  useEffect(() => {
    function handleGlobalKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (
        e.key === '/' &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !isTypingTarget(e.target)
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // Close drawer and popover on route change
  useEffect(() => {
    setDrawerOpen(false);
    setDiscoverOpen(false);
  }, [pathname]);

  // Escape closes the desktop discovery menu and returns focus to its button
  useEffect(() => {
    if (!discoverOpen) return;
    function handleEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setDiscoverOpen(false);
      discoverButtonRef.current?.focus();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [discoverOpen]);

  // The theme menu closes on Escape (focus back to its button) or a tap outside it
  useEffect(() => {
    if (!themeMenuOpen) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setThemeMenuOpen(false);
      themeButtonRef.current?.focus();
    }
    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (!themeMenuRef.current?.contains(event.target as Node)) setThemeMenuOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [themeMenuOpen]);

  // Outside click to close desktop discovery
  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!discoverRef.current?.contains(event.target as Node)) {
        setDiscoverOpen(false);
      }
    }
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  // Background scroll lock & layout shift prevention
  useEffect(() => {
    if (!drawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [drawerOpen]);

  // Focus trapping and Escape key support for navigation drawer
  useEffect(() => {
    if (!drawerOpen) return;

    const timer = setTimeout(() => {
      drawerCloseBtnRef.current?.focus();
    }, 50);

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setDrawerOpen(false);
        triggerTactileFeedback('light', 'softTap');
        menuButtonRef.current?.focus();
        return;
      }

      if (e.key === 'Tab') {
        if (!drawerRef.current) return;
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [drawerOpen]);

  const handleToggleDrawer = () => {
    triggerTactileFeedback('medium', 'softTap');
    setDrawerOpen((prev) => !prev);
  };

  const handleCloseDrawer = () => {
    triggerTactileFeedback('light', 'softTap');
    setDrawerOpen(false);
    menuButtonRef.current?.focus();
  };

  const handlePickTheme = (next: Theme) => {
    triggerTactileFeedback('medium', 'softTap');
    setTheme(next);
    setThemeTouched(true);
    setThemeMenuOpen(false);
    themeButtonRef.current?.focus();
  };

  const handleOpenSearchModal = () => {
    triggerTactileFeedback('light', 'softTap');
    setDrawerOpen(false);
    setSearchOpen(true);
  };

  // 10 Dedicated Drawer Sections
  const drawerSections: DrawerItem[] = [
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

  const ThemeIcon = THEME_ICONS[theme] || Sun;

  return (
    <>
      {/* ── Compact Sticky Header ────────────────────────────────────────── */}
      <nav
        data-site-header="true"
        data-library-verse-count={libraryVerses}
        data-theme-options={THEME_IDS.join(',')}
        data-title-folded={fold.folded && fold.title ? 'true' : undefined}
        className="apple-bar sticky top-0 z-40 border-b transition-colors duration-200"
        aria-label="Primary navigation"
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-6 2xl:max-w-[1760px]">
          <div className="flex h-[52px] items-center justify-between gap-1 sm:gap-4 lg:gap-1 xl:gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="group flex min-h-[44px] min-w-[44px] shrink items-center gap-1.5 rounded-xl pr-0 sm:gap-2.5 sm:pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500/40"
              aria-label="Dharma Granth Home"
            >
              <span
                className="chrome-press flex h-8 w-8 shrink-0 overflow-hidden rounded-full bg-[#fdf6ea] ring-1 ring-dharma-border"
                aria-hidden="true"
              >
                <Image
                  src="/logo-mark.webp"
                  alt=""
                  width={40}
                  height={40}
                  priority
                  className="h-full w-full object-cover"
                />
              </span>
              <div className="bar-title-stack grid min-w-0 grid-cols-[minmax(0,1fr)]">
                <div className="bar-wordmark flex min-w-0 items-baseline gap-2">
                  <span className="min-w-0 truncate text-body font-semibold tracking-[-0.022em] text-dharma-text">
                    Dharma Granth
                  </span>{' '}
                  <span lang="hi" className="hidden font-devanagari text-footnote text-dharma-muted sm:inline">
                    धर्म ग्रंथ
                  </span>
                </div>
                {/* The page's large title, once it has folded up under the bar (lib/useFoldingTitle). */}
                <span className="bar-page-title truncate text-body font-semibold tracking-[-0.022em] text-dharma-text" aria-hidden="true">
                  {fold.title}
                </span>
              </div>
            </Link>{' '}

            {/* Desktop Primary Navigation */}
            <div className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex">
              {desktopPrimaryItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`relative whitespace-nowrap px-2 xl:px-3 py-2 text-footnote transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-dharma-saffron'
                      : 'text-dharma-text/80 hover:text-dharma-text'
                  }`}
                >
                  <span className="inline-flex items-baseline gap-1">
                    <span>{item.label}</span>{' '}
                    <span lang="hi" className="hidden text-[12.5px] font-devanagari text-dharma-muted xl:inline">
                      {item.labelHi}
                    </span>{' '}
                  </span>
                </Link>
              ))}

              {/* Desktop Discovery Dropdown */}
              <div className="relative" ref={discoverRef}>
                <button
                  ref={discoverButtonRef}
                  type="button"
                  onClick={() => setDiscoverOpen((open) => !open)}
                  className={`flex items-center gap-1 px-2 xl:px-3 py-2 text-footnote transition-colors ${
                    discoveryIsActive || discoverOpen
                      ? 'text-dharma-saffron'
                      : 'text-dharma-text/80 hover:text-dharma-text'
                  }`}
                  aria-expanded={discoverOpen}
                  aria-controls="desktop-discovery-menu"
                  aria-haspopup="true"
                >
                  <span>Explore</span>{' '}
                  <span lang="hi" className="hidden font-devanagari text-[12.5px] text-dharma-muted xl:inline">
                    अन्वेषण
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${discoverOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                {discoverMenu.mounted && (
                    <div
                      id="desktop-discovery-menu"
                      data-closing={discoverMenu.closing || undefined}
                      className="chrome-pop absolute right-0 top-[calc(100%+0.75rem)] w-[46rem] max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-4.5rem)] overflow-y-auto rounded-2xl border border-dharma-border bg-dharma-card p-4 shadow-2xl z-50 divide-y divide-dharma-border/60"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pb-3">
                        {discoveryGroups.map((group) => {
                          const GroupIcon = group.icon;
                          return (
                            <div key={group.name} className="space-y-1.5">
                              <div className="flex items-center gap-1.5 px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-300">
                                <GroupIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                <span>{group.name}</span>
                              </div>
                              <div className="space-y-0.5">
                                {group.items.map((item) => {
                                  const ItemIcon = item.icon;
                                  return (
                                    <Link
                                      key={item.href}
                                      href={item.href}
                                      className={`group flex items-start gap-2.5 rounded-lg px-2.5 py-1.5 transition-colors ${
                                        isActive(item.href)
                                          ? 'bg-saffron-50 text-saffron-800 dark:bg-saffron-950/40 dark:text-saffron-300'
                                          : 'hover:bg-dharma-bg'
                                      }`}
                                    >
                                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-dharma-muted group-hover:text-saffron-600">
                                        <ItemIcon className="h-3.5 w-3.5" aria-hidden="true" />
                                      </span>
                                      <div className="min-w-0 flex-1">
                                        <span className="block text-xs font-bold text-dharma-text">
                                          {item.label}
                                        </span>
                                        <span className="mt-0.5 block text-[11px] text-dharma-muted line-clamp-1">
                                          {item.description}
                                        </span>
                                      </div>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="pt-2.5 flex flex-wrap items-center justify-between gap-1.5 px-1">
                        <div className="flex flex-wrap gap-1.5">
                          {desktopPersonalItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="inline-flex min-h-[32px] items-center rounded-lg px-2.5 py-1 text-xs font-semibold text-dharma-muted transition hover:bg-dharma-bg hover:text-saffron-700 dark:hover:text-saffron-300"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                        <Link
                          href="/about/funding/"
                          className="text-[11px] font-medium text-dharma-muted hover:text-dharma-text underline-offset-2 hover:underline"
                        >
                          वित्तीय पारदर्शिता
                        </Link>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Header Right Cluster */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              {/* Desktop Live Status Indicator */}
              <div
                className="hidden items-center gap-2 pr-1 text-xs text-dharma-muted min-[2200px]:flex"
                aria-hidden="true"
              >
                <span className="size-1.5 rounded-full bg-saffron-600 animate-status-pulse" />
                <span className="tracking-tight">{formatCount(libraryVerses)} श्लोक पुस्तकालय में</span>
              </div>

              {/* Desktop Search Button */}
              <button
                type="button"
                onClick={handleOpenSearchModal}
                onPointerEnter={() => void loadSearchModal()}
                onFocus={() => void loadSearchModal()}
                className="apple-icon-button hidden lg:flex h-9 gap-2 px-2.5 text-footnote text-dharma-muted"
                aria-label="खोजें (Search)"
                aria-keyshortcuts="Control+K Meta+K /"
              >
                <Search className="h-4 w-4 text-dharma-text" aria-hidden="true" />
                <kbd className="kbd-hint hidden xl:inline rounded-md bg-dharma-text/[0.07] px-1.5 py-0.5 font-sans text-[11px] text-dharma-text-secondary">
                  {shortcutLabel}
                </kbd>
              </button>{' '}

              {/* Desktop Language Toggle */}
              <LanguageToggle className="hidden lg:inline-flex" />

              {/* Desktop Segmented Theme Toggle: only where the bar has room for it
                  beside the full nav; below that the single cycle button (2. Theme Button) stands in. */}
              <div className="hidden min-[1800px]:inline-block">
                <ThemeToggle />
              </div>

              {/* Desktop CTA */}{' '}
              <Link
                href="/scripture/bhagavadgita/"
                className="hidden min-[1800px]:inline-flex items-center rounded-full bg-dharma-saffron px-3.5 py-1.5 text-footnote text-dharma-bg transition hover:opacity-90"
              >
                पठन आरम्भ करें
              </Link>

              {/* ── Mobile Compact Controls (≥ 44px Touch Targets) ─────── */}
              {/* 1. Search Button */}
              <button
                type="button"
                onClick={handleOpenSearchModal}
                onPointerEnter={() => void loadSearchModal()}
                onFocus={() => void loadSearchModal()}
                className="apple-icon-button lg:hidden h-11 w-11 min-h-[44px] min-w-[44px]"
                aria-label="खोजें (Search)"
                title="खोजें (Search)"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
              </button>

              {/* 2. Theme Button: opens a menu of the named themes (cycling through five unnamed states confused readers) */}
              <div ref={themeMenuRef} className="relative min-[1800px]:hidden">
              <button
                ref={themeButtonRef}
                type="button"
                onClick={() => setThemeMenuOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={themeMenuOpen}
                className="apple-icon-button h-11 w-11 min-h-[44px] min-w-[44px] lg:h-9 lg:w-auto lg:min-h-0 lg:min-w-0 lg:px-2.5 lg:gap-1.5"
                aria-label={`थीम बदलें · Theme: ${THEME_NAMES[theme].name}`}
                title={`थीम: ${THEME_NAMES[theme].name} · ${THEME_NAMES[theme].hi}`}
              >
                <span
                  key={theme}
                  className={`flex items-center justify-center ${themeTouched ? 'chrome-icon-swap' : ''}`}
                >
                  <ThemeIcon className="h-5 w-5 lg:h-4 lg:w-4" aria-hidden="true" />
                </span>{' '}
                <span lang="hi" className="hidden xl:inline font-devanagari text-xs font-medium text-dharma-text-secondary">
                  {THEME_NAMES[theme].hi}
                </span>
              </button>
              {themeMenuOpen && (
                <div
                  role="menu"
                  aria-label="Theme · थीम"
                  className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-dharma-border bg-dharma-card p-1 shadow-xl"
                >
                  {THEME_IDS.map((id) => {
                    const Icon = THEME_ICONS[id] || Sun;
                    const active = id === theme;
                    return (
                      <button
                        key={id}
                        type="button"
                        role="menuitemradio"
                        aria-checked={active}
                        onClick={() => handlePickTheme(id)}
                        title={THEME_NAMES[id].description}
                        className={`flex min-h-11 w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm font-semibold transition ${
                          active ? 'bg-saffron-500/15 text-dharma-text' : 'text-dharma-muted hover:bg-saffron-500/10 hover:text-dharma-text'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-saffron-600 dark:text-amber-400" aria-hidden="true" />
                        <span>{THEME_NAMES[id].name}</span>{' '}
                        <span lang="hi" className="ml-auto font-devanagari font-normal text-dharma-muted">{THEME_NAMES[id].hi}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              </div>

              {/* 3. Menu Button */}
              <button
                ref={menuButtonRef}
                type="button"
                onClick={handleToggleDrawer}
                className={`apple-icon-button lg:hidden h-11 w-11 min-h-[44px] min-w-[44px] ${
                  drawerOpen ? 'text-dharma-saffron' : ''
                }`}
                aria-label={drawerOpen ? 'नेविगेशन मेनू बंद करें' : 'नेविगेशन मेनू खोलें'}
                aria-expanded={drawerOpen}
                aria-controls="mobile-navigation-drawer"
              >
                {drawerOpen ? (
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Progress Indicator Bar */}
        <div aria-hidden="true" className="nav-progress absolute inset-x-0 bottom-0 h-px bg-dharma-saffron/70" />
      </nav>

      {/* ── Accessible Navigation Drawer ─────────────────────────────────── */}
      {drawer.mounted && (
          <div className="lg:hidden">
            {/* Backdrop Overlay */}
            <div
              data-closing={drawer.closing || undefined}
              onClick={handleCloseDrawer}
              className="chrome-fade fixed inset-0 z-[60] bg-stone-950/65 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Slide-out Drawer Panel */}
            <div
              ref={drawerRef}
              id="mobile-navigation-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="नेविगेशन दराज (Navigation Drawer)"
              data-closing={drawer.closing || undefined}
              className="chrome-sheet fixed inset-y-0 right-0 z-[70] flex w-full max-w-[360px] sm:max-w-md flex-col border-l border-dharma-border bg-dharma-card shadow-2xl"
              style={{
                paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0.75rem))',
                paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))',
              }}
            >
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between border-b border-dharma-border/80 px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fdf6ea] shadow-sm ring-1 ring-saffron-500/30">
                    <Image src="/logo-mark.webp" alt="" width={36} height={36} className="h-full w-full object-cover" />
                  </span>
                  <div>
                    <h2 className="font-serif text-base font-bold text-dharma-text leading-tight">
                      Dharma Granth
                    </h2>
                    <p className="font-devanagari text-[11px] text-dharma-muted">
                      ज्ञान, साधना व वैदिक दर्शन
                    </p>
                  </div>
                </div>

                {/* Close Button (≥ 44px touch target) */}
                <button
                  ref={drawerCloseBtnRef}
                  type="button"
                  onClick={handleCloseDrawer}
                  className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-dharma-border bg-dharma-bg text-dharma-text transition active:scale-95 hover:bg-saffron-500/10 hover:text-saffron-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
                  aria-label="नेविगेशन बंद करें (Esc)"
                  title="नेविगेशन बंद करें (Esc)"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3 sm:px-6 space-y-6">
                {/* Quick Search Card (≥ 44px target) */}
                <button
                  type="button"
                  onClick={handleOpenSearchModal}
                  className="flex h-12 min-h-[48px] w-full items-center justify-between rounded-xl border border-dharma-border bg-dharma-bg px-3.5 text-xs font-semibold text-dharma-muted shadow-sm transition active:scale-[0.99] hover:border-saffron-400 hover:text-dharma-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
                >
                  <div className="flex items-center gap-2.5">
                    <Search className="h-4 w-4 text-saffron-600" aria-hidden="true" />
                    <span className="font-devanagari text-sm">ग्रंथ, श्लोक या विषय खोजें...</span>
                  </div>
                  <kbd className="kbd-hint rounded border border-dharma-border bg-dharma-card px-2 py-0.5 font-mono text-[10px] text-dharma-muted">
                    {shortcutLabel}
                  </kbd>
                </button>

                {/* ── Main Navigation Sections ─────────────────────────── */}
                <section aria-labelledby="drawer-nav-heading">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <h3
                      id="drawer-nav-heading"
                      className="text-[11px] font-bold uppercase tracking-wider text-dharma-muted"
                    >
                      मुख्य अनुभाग · Navigation
                    </h3>
                    <span className="text-[10px] text-dharma-muted font-devanagari">
                      {drawerSections.length} पावन विभाग
                    </span>
                  </div>

                  <div className="space-y-0.5 sm:space-y-1">
                    {drawerSections.map((item) => {
                      const hasMoreSpecificMatch = drawerSections.some(
                        (other) =>
                          other.id !== item.id &&
                          other.href.length > item.href.length &&
                          other.href.startsWith(item.href) &&
                          isActive(other.href),
                      );
                      const active = isActive(item.href) && !hasMoreSpecificMatch;
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={handleCloseDrawer}
                          aria-current={active ? 'page' : undefined}
                          className={`group relative flex min-h-[48px] items-center justify-between rounded-xl px-2.5 py-1.5 transition active:scale-[0.98] sm:px-3 sm:py-2.5 ${
                            active
                              ? 'border border-saffron-300 bg-saffron-50 font-bold text-saffron-900 shadow-sm dark:border-saffron-700/60 dark:bg-saffron-950/40 dark:text-saffron-300'
                              : 'border border-transparent text-dharma-text hover:border-dharma-border hover:bg-dharma-bg'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Icon with active glow */}
                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition sm:h-9 sm:w-9 ${
                                active
                                  ? 'bg-gradient-to-br from-saffron-500 to-amber-600 text-white shadow-sm'
                                  : 'bg-dharma-bg border border-dharma-border/80 text-dharma-muted group-hover:text-saffron-600'
                              }`}
                            >
                              <Icon className="h-4 w-4" aria-hidden="true" />
                            </span>

                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="truncate text-sm font-bold">{item.label}</span>
                                <span className="hidden xs:inline text-xs font-normal text-dharma-muted truncate">
                                  ({item.labelEn})
                                </span>
                              </div>
                              <span className="truncate text-[11px] font-normal text-dharma-muted">
                                {item.description}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            {/* On phones the badge repeats the line under the label and squeezes it;
                                only the practice streak, which says something new, stays. */}
                            {item.badge && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.badgeType === 'streak' ? '' : 'hidden sm:inline'} ${
                                  item.badgeType === 'streak'
                                    ? 'bg-amber-100 text-amber-950 border border-amber-800/40 dark:bg-amber-950 dark:text-amber-100 dark:border-amber-700/50'
                                    : item.badgeType === 'count'
                                    ? 'bg-saffron-100 text-saffron-900 border border-saffron-800/40 dark:bg-saffron-900 dark:text-saffron-100 dark:border-saffron-700/50'
                                    : 'bg-dharma-bg text-dharma-muted border border-dharma-border'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                            <ChevronRight
                              className={`h-4 w-4 transition-transform ${
                                active
                                  ? 'text-saffron-600 translate-x-0.5'
                                  : 'text-dharma-muted group-hover:translate-x-0.5 group-hover:text-dharma-text'
                              }`}
                              aria-hidden="true"
                            />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>

                {/* ── 10. Language & Theme Settings ─────────────────────── */}
                <section
                  aria-labelledby="drawer-settings-heading"
                  className="rounded-2xl border border-dharma-border/80 bg-dharma-bg p-3.5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3
                      id="drawer-settings-heading"
                      className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-dharma-muted"
                    >
                      <Settings2 className="h-3.5 w-3.5 text-saffron-600" aria-hidden="true" />
                      भाषा व थीम सेटिंग्स · Preferences
                    </h3>
                  </div>

                  {/* Language Selector (≥ 44px touch targets) */}
                  <div>
                    <p className="mb-2 block text-xs font-semibold text-dharma-text">
                      पठन भाषा · Reading Language
                    </p>
                    <div className="grid grid-cols-2 gap-1.5" role="radiogroup" aria-label="भाषा प्राथमिकता">
                      {LANGUAGE_OPTIONS.map((opt) => {
                        const isSelected = opt.id === preference;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => {
                              setPreference(opt.id as LanguagePreference);
                              triggerTactileFeedback('light', 'softTap');
                            }}
                            className={`flex min-h-[44px] flex-col justify-center rounded-xl px-2.5 py-1.5 text-left transition active:scale-95 ${
                              isSelected
                                ? 'border border-saffron-500/50 bg-saffron-500/15 text-saffron-800 dark:text-saffron-200 font-bold shadow-xs'
                                : 'border border-dharma-border/80 bg-dharma-card text-dharma-text hover:border-saffron-300'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span>{opt.shortLabel}</span>
                              {isSelected && (
                                <Check className="h-3 w-3 text-saffron-600" aria-hidden="true" />
                              )}
                            </div>
                            <span className="text-[10px] text-dharma-muted truncate">
                              {opt.sub}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Theme Selector (≥ 44px touch targets) */}
                  <div>
                    <p className="mb-2 block text-xs font-semibold text-dharma-text">
                      थीम मोड · Display Theme
                    </p>
                    <div className="grid grid-cols-2 gap-1.5" role="radiogroup" aria-label="थीम मोड">
                      {THEMES.map((opt) => {
                        const isSelected = opt === theme;
                        const Icon = THEME_ICONS[opt];
                        return (
                          <button
                            key={opt}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => {
                              setTheme(opt);
                              setThemeTouched(true);
                              triggerTactileFeedback('light', 'softTap');
                            }}
                            className={`flex min-h-[44px] items-center gap-2 rounded-xl px-2.5 py-2 transition active:scale-95 ${
                              isSelected
                                ? 'border border-saffron-500/60 bg-saffron-500/20 text-saffron-800 dark:text-saffron-200 font-bold shadow-xs'
                                : 'border border-dharma-border/80 bg-dharma-card text-dharma-text hover:border-saffron-300'
                            }`}
                            title={THEME_NAMES[opt].description}
                          >
                            <span
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                                isSelected
                                  ? 'bg-saffron-600 text-white'
                                  : 'bg-dharma-bg text-dharma-muted'
                              }`}
                            >
                              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                            </span>
                            <div className="flex flex-col text-left min-w-0">
                              <span className="text-xs font-semibold truncate leading-none">
                                {THEME_NAMES[opt].name}
                              </span>
                              <span lang="hi" className="text-[10px] text-dharma-muted truncate leading-tight mt-0.5">
                                {THEME_NAMES[opt].hi}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </section>

                {/* De-duplicated Reference Links */}
                {(() => {
                  const drawerHrefs = new Set(drawerSections.map((s) => s.href));
                  const groupsWithUniqueItems = discoveryGroups
                    .map((group) => ({
                      ...group,
                      items: group.items.filter((item) => !drawerHrefs.has(item.href)),
                    }))
                    .filter((group) => group.items.length > 0);

                  return (
                    <section aria-labelledby="drawer-discover-heading" className="pt-2">
                      <h3
                        id="drawer-discover-heading"
                        className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-dharma-muted"
                      >
                        अतिरिक्त संदर्भ व साधन · More Reference
                      </h3>
                      <div className="space-y-3">
                        {groupsWithUniqueItems.map((group) => {
                          const GroupIcon = group.icon;
                          return (
                            <div key={group.name} className="space-y-1.5">
                              <div className="flex items-center gap-1.5 px-1 text-[10.5px] font-semibold text-saffron-700 dark:text-saffron-300 uppercase tracking-wider">
                                <GroupIcon className="h-3 w-3" aria-hidden="true" />
                                <span>{group.name}</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {group.items.map((item) => (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={handleCloseDrawer}
                                    className={`inline-flex min-h-[38px] items-center rounded-xl border px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
                                      isActive(item.href)
                                        ? 'border-saffron-400 bg-saffron-500/10 text-saffron-700 dark:text-saffron-300 font-bold'
                                        : 'border-dharma-border/80 bg-dharma-bg text-dharma-muted hover:border-saffron-300 hover:text-dharma-text'
                                    }`}
                                  >
                                    {item.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  );
                })()}

                <div className="pt-3 text-center border-t border-dharma-border/60">
                  <p className="font-devanagari text-xs text-dharma-muted">
                    ॐ असतो मा सद्गमय · तमसो मा ज्योतिर्गमय
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* ── Mobile Bottom Navigation Bar (Thumb Usability) ────────────────── */}
      {/* Strictly limited to the 5 requested items: Home, Search, Library, Sadhana, Saved */}
      <nav
        aria-label="Mobile quick navigation"
        className="apple-bar fixed bottom-0 inset-x-0 z-30 lg:hidden border-t"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div className="grid grid-cols-5 h-14">
          {/* 1. Home */}
          <Link
            href="/"
            onClick={() => setTimeout(() => triggerTactileFeedback('light', 'softTap'), 0)}
            aria-current={isActive('/') ? 'page' : undefined}
            className={`group relative flex min-h-[44px] flex-col items-center justify-center gap-0.5 transition active:scale-95 ${
              isActive('/')
                ? 'text-dharma-saffron'
                : 'text-dharma-muted hover:text-dharma-text'
            }`}
          >
            <Home className="h-5 w-5" aria-hidden="true" />
            <span className="text-xs tracking-tight">Home</span>
          </Link>

          {/* 2. Search Button */}
          <button
            type="button"
            onClick={handleOpenSearchModal}
            className="group relative flex min-h-[44px] flex-col items-center justify-center gap-0.5 text-dharma-muted transition active:scale-95 hover:text-dharma-text"
            aria-label="खोजें (Search)"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
            <span className="text-xs tracking-tight">Search</span>
          </button>

          {/* 3. Library */}
          <Link
            href="/scriptures/"
            onClick={() => setTimeout(() => triggerTactileFeedback('light', 'softTap'), 0)}
            aria-current={isActive('/scriptures/') ? 'page' : undefined}
            className={`group relative flex min-h-[44px] flex-col items-center justify-center gap-0.5 transition active:scale-95 ${
              isActive('/scriptures/')
                ? 'text-dharma-saffron'
                : 'text-dharma-muted hover:text-dharma-text'
            }`}
          >
            <BookOpen className="h-5 w-5" aria-hidden="true" />
            <span className="text-xs tracking-tight">Library</span>
          </Link>

          {/* 4. Sadhana */}
          <Link
            href="/practice/"
            onClick={() => setTimeout(() => triggerTactileFeedback('light', 'softTap'), 0)}
            aria-current={isActive('/practice/') && !isActive('/practice/bookmarks/') ? 'page' : undefined}
            className={`group relative flex min-h-[44px] flex-col items-center justify-center gap-0.5 transition active:scale-95 ${
              isActive('/practice/') && !isActive('/practice/bookmarks/')
                ? 'text-dharma-saffron'
                : 'text-dharma-muted hover:text-dharma-text'
            }`}
          >
            <Sparkles className="h-5 w-5" aria-hidden="true" />
            <span className="text-xs tracking-tight">Sadhana</span>
          </Link>

          {/* 5. Saved Verses */}
          <Link
            href="/practice/bookmarks/"
            onClick={() => setTimeout(() => triggerTactileFeedback('light', 'softTap'), 0)}
            aria-current={isActive('/practice/bookmarks/') ? 'page' : undefined}
            className={`group relative flex min-h-[44px] flex-col items-center justify-center gap-0.5 transition active:scale-95 ${
              isActive('/practice/bookmarks/')
                ? 'text-dharma-saffron'
                : 'text-dharma-muted hover:text-dharma-text'
            }`}
          >
            <div className="relative">
              <Bookmark className="h-5 w-5" aria-hidden="true" />
              {bookmarkCount > 0 && (
                <span className="absolute -top-1 -right-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-dharma-saffron px-1 text-[9px] font-semibold text-dharma-bg">
                  {bookmarkCount > 9 ? '9+' : bookmarkCount}
                </span>
              )}
            </div>
            <span className="text-xs tracking-tight">Saved</span>
          </Link>
        </div>
      </nav>

      {/* Global Search Modal Lazy Mount */}
      {searchMounted && (
        <GlobalSearchModal
          isOpen={searchOpen}
          initialQuery={searchQuery}
          anchor={searchAnchor}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </>
  );
}

export { SiteNav as GlobalHeader };
