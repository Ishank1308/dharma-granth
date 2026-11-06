'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  GraduationCap,
  Heart,
  Home,
  Menu,
  Moon,
  Radio,
  Search,
  Settings2,
  Sparkles,
  Star,
  Sun,
  Sunset,
  X,
} from 'lucide-react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  LayoutGroup,
  useScroll,
  useSpring,
} from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { subscribeSoundscape, toggleSoundscape } from '@/lib/sacred-soundscape';
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
  { label: 'Scriptures', labelHi: 'ग्रंथालय', href: '/scriptures' },
  { label: 'Bhagavad Gita', labelHi: 'गीता', href: '/scripture/bhagavadgita' },
  { label: 'Learn', labelHi: 'सीखें', href: '/learn' },
  { label: 'Sadhana', labelHi: 'साधना', href: '/practice' },
  { label: 'Panchang', labelHi: 'पंचांग', href: '/panchang' },
];

const desktopDiscoveryItems = [
  { label: 'अष्टावक्र गीता', description: 'अलग पठन — मूल संस्कृत, हिन्दी भावार्थ और सरल व्याख्या', href: '/ashtavakra' },
  { label: 'धर्म सहायक', description: 'पुस्तकालय के श्लोकों से जीवन के प्रश्न', href: '/ask' },
  { label: 'श्लोक संबंध जाल', description: 'Verse Relationship Network — गीता, उपनिषद् व वेद की कड़ियाँ', href: '/network' },
  { label: 'स्वाध्याय यात्राएँ', description: 'Guided Learning Journeys — 12 क्रमिक साधना पथ', href: '/learn/journeys/' },
  { label: 'स्वाध्याय मार्ग', description: 'Guided Reading Paths — विषयवार अध्ययन', href: '/learn/paths' },
  { label: 'पठन योजनाएँ', description: 'Reading Plans — 18 दिवसीय गीता आदि', href: '/learn/plans' },
  { label: 'जिज्ञासा समाधान', description: 'Scripture FAQs — श्रुति-स्मृति व नीति', href: '/learn/faq' },
  { label: 'स्रोत पारदर्शिता', description: 'Source Library — मूल पांडुलिपियाँ व संस्करण', href: '/sources' },
  { label: 'शास्त्रीय जीवन-मार्गदर्शन', description: 'Dharmic Guidance — उद्वेग, भय, क्रोध व धर्मसंकट का समाधान', href: '/wisdom-for-life/' },
  { label: 'ज्ञान मार्ग', description: 'Wisdom Pathways — भाव, प्रश्न व संत से शास्त्र तक', href: '/wisdom-pathways/' },
  { label: 'दैनिक श्लोक', description: 'Daily Verse — आज का श्लोक WhatsApp पर भेजें', href: '/daily-verse' },
  { label: 'पंचांग', description: 'दैनिक वैदिक काल व ऋतु', href: '/panchang' },
  { label: 'अवधारणाएँ', description: 'मुख्य दार्शनिक विचार', href: '/concepts' },
  { label: 'विषय', description: 'जीवन और साधना के विषय', href: '/wisdom-for-life' },
  { label: 'पात्र', description: 'कथाओं के प्रमुख चरित्र', href: '/characters' },
  { label: 'स्थान', description: 'पवित्र और ऐतिहासिक स्थल', href: '/locations' },
  { label: 'कालखंड', description: 'समयरेखा और परंपरा', href: '/timelines' },
  { label: 'उत्सव', description: 'पर्व और उनका अर्थ', href: '/festivals' },
  { label: 'अनुष्ठान', description: 'विधियाँ और परंपराएँ', href: '/rituals' },
  { label: 'सहयोग व सेवा', description: 'Voluntary Support — प्रत्यक्ष UPI व QR द्वारा धर्म ग्रंथ का संवर्धन', href: '/contribute' },
];

const desktopPersonalItems = [
  { label: 'मेरा डैशबोर्ड', href: '/practice/dashboard/' },
  { label: 'यात्रा आरम्भ करें', href: '/learn/start/' },
  { label: 'पठन यात्राएँ', href: '/learn/journeys/' },
  { label: 'स्वाध्याय योजनाएँ', href: '/learn/plans' },
  { label: 'कथा-दर्शन', href: '/story' },
  { label: 'अध्ययन-पटल', href: '/practice/desk/' },
  { label: 'बुकमार्क व नोट्स', href: '/practice/bookmarks/' },
  { label: 'संग्रह', href: '/collections' },
  { label: 'अध्ययन पथ', href: '/learn/pathways' },
  { label: 'ऐच्छिक सहयोग', href: '/contribute' },
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

function SoundscapeNavButton({ className = '' }: { className?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    return subscribeSoundscape((st) => {
      setIsPlaying(st.isPlaying);
    });
  }, []);

  const handleToggle = () => {
    triggerTactileFeedback('selection', 'softTap');
    toggleSoundscape();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`relative flex items-center justify-center rounded-xl border transition active:scale-95 ${
        isPlaying
          ? 'border-amber-400 bg-amber-500/15 text-amber-600 dark:text-amber-400 shadow-sm'
          : 'border-dharma-border/80 bg-dharma-bg/90 text-dharma-muted hover:border-saffron-400 hover:text-dharma-text'
      } ${className}`}
      aria-label={isPlaying ? 'पवित्र ध्वनि बंद करें' : 'पवित्र ध्वनि चालू करें'}
      title={isPlaying ? 'पवित्र ध्वनि: चालू (Tap to pause)' : 'पवित्र ध्वनि: तानपूरा (432Hz) व ॐ ध्यान'}
    >
      {isPlaying ? (
        shouldReduceMotion ? (
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-amber-400/40" />
        ) : (
          <span className="flex items-center gap-0.5 px-0.5">
            <span className="inline-block h-3 w-0.5 rounded-full bg-amber-500 animate-pulse motion-reduce:animate-none" />
            <span className="inline-block h-4 w-0.5 rounded-full bg-amber-500 animate-pulse motion-reduce:animate-none [animation-delay:150ms]" />
            <span className="inline-block h-2.5 w-0.5 rounded-full bg-amber-500 animate-pulse motion-reduce:animate-none [animation-delay:300ms]" />
          </span>
        )
      ) : (
        <Radio className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchMounted, setSearchMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [shortcutLabel, setShortcutLabel] = useState('Ctrl K');
  const [bookmarkCount, setBookmarkCount] = useState<number>(0);
  const [activeStreak, setActiveStreak] = useState<number>(0);

  const { theme, setTheme, cycleTheme } = useTheme();
  const { preference, setPreference } = useLanguagePreference();

  const discoverRef = useRef<HTMLDivElement>(null);
  const discoverButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerCloseBtnRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.6,
  });

  const isActive = useCallback(
    (href: string): boolean => {
      if (href === '/') return pathname === '/';
      if (href === '/scriptures') {
        return (
          pathname === '/scriptures' ||
          (pathname.startsWith('/scripture/') && !pathname.startsWith('/scripture/bhagavadgita'))
        );
      }
      return pathname.startsWith(href);
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
    else setSearchQuery('');
  }, [searchOpen]);

  // Global search event listener
  useEffect(() => {
    function handleOpenSearch(e: Event) {
      const { query } = (e as CustomEvent<OpenSearchDetail>).detail ?? {};
      setSearchQuery(query ?? '');
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

  const handleThemeCycle = () => {
    triggerTactileFeedback('medium', 'softTap');
    cycleTheme();
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
      href: '/scriptures',
      icon: BookOpen,
      badge: formatCount(libraryVerses),
      badgeType: 'accent',
    },
    {
      id: 'gita',
      label: 'श्रीमद्भगवद्गीता',
      labelEn: 'Bhagavad Gita',
      description: `${formatCount(gitaChapters)} अध्याय · ${formatCount(gitaVerses)} श्लोक`,
      href: '/scripture/bhagavadgita',
      icon: Flame,
      badge: `${formatCount(gitaVerses)} श्लोक`,
      badgeType: 'accent',
    },
    {
      id: 'ashtavakra',
      label: 'अष्टावक्र गीता',
      labelEn: 'Ashtavakra Gita',
      description: `${formatCount(ashtavakraChapters)} प्रकरण · ${formatCount(ashtavakraVerses)} श्लोक`,
      href: '/ashtavakra',
      icon: BookOpen,
      badge: `${formatCount(ashtavakraVerses)} श्लोक`,
      badgeType: 'accent',
    },
    {
      id: 'learn',
      label: 'स्वाध्याय व सीखें',
      labelEn: 'Learn',
      description: 'अध्ययन पथ, प्रश्नोत्तरी व दर्शन',
      href: '/learn',
      icon: GraduationCap,
    },
    {
      id: 'sadhana',
      label: 'दैनिक साधना',
      labelEn: 'Sadhana',
      description: 'जप माला, ध्यान, संकल्प व चिंतन',
      href: '/practice',
      icon: Sparkles,
    },
    {
      id: 'wisdom-for-life',
      label: 'जीवन मार्गदर्शन',
      labelEn: 'Wisdom for Life',
      description: '12 जीवन-विषय · उद्वेग, भय, कर्तव्य व आत्मज्ञान',
      href: '/wisdom-for-life',
      icon: Compass,
      badge: 'जीवन-विषय',
      badgeType: 'accent',
    },
    {
      id: 'ask-dharma',
      label: 'धर्म सहायक',
      labelEn: 'Scripture guide',
      description: 'पुस्तकालय के श्लोकों से जीवन के प्रश्न',
      href: '/ask',
      icon: BookOpen,
      badge: 'श्लोक से',
      badgeType: 'accent',
    },
    {
      id: 'panchang',
      label: 'वैदिक पंचांग',
      labelEn: 'Panchang',
      description: 'तिथि, पक्ष, नक्षत्र, योग व ऋतु',
      href: '/panchang',
      icon: Calendar,
    },
    {
      id: 'festivals',
      label: 'उत्सव ज्ञान केंद्र',
      labelEn: 'Festivals',
      description: 'प्रमुख पर्व, व्रत व शास्त्रीय परंपरा',
      href: '/festivals',
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
      href: '/contribute',
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
        className="sticky top-0 z-40 border-b border-dharma-border/80 bg-dharma-card/95 backdrop-blur-xl shadow-[0_4px_24px_rgba(45,42,38,0.05)] transition-colors duration-200"
        aria-label="Primary navigation"
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-6 2xl:max-w-[1760px]">
          <div className="flex h-14 sm:h-16 lg:h-[72px] items-center justify-between gap-1 sm:gap-4 lg:gap-1 xl:gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="group flex min-h-[44px] min-w-[44px] shrink-0 items-center gap-1.5 rounded-xl pr-0 sm:gap-2.5 sm:pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500/40"
              aria-label="Dharma Granth Home"
            >
              <motion.span
                className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 overflow-hidden rounded-full bg-[#fdf6ea] shadow-sm ring-1 ring-saffron-500/30 transition group-hover:ring-saffron-500/70"
                whileHover={reduce ? undefined : { scale: 1.05 }}
                whileTap={reduce ? undefined : { scale: 0.95 }}
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
              </motion.span>
              <div className="flex flex-col">
                <span className="whitespace-nowrap font-serif text-sm min-[400px]:text-base sm:text-xl font-bold tracking-tight text-dharma-text transition group-hover:text-saffron-700">
                  Dharma Granth
                </span>
                <span className="hidden font-devanagari text-[10px] text-dharma-muted -mt-0.5 sm:block">
                  धर्म ग्रंथ · ज्ञान अमृत
                </span>
              </div>
            </Link>

            {/* Desktop Primary Navigation */}
            <div className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex">
              {desktopPrimaryItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative whitespace-nowrap rounded-xl px-1.5 xl:px-3 py-2 text-[13px] xl:text-sm font-semibold transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-saffron-700 font-bold'
                      : 'text-dharma-text hover:bg-saffron-50/50 hover:text-saffron-700'
                  }`}
                >
                  {isActive(item.href) && (
                    <motion.span
                      layoutId="desktop-nav-active"
                      className="absolute inset-0 rounded-xl border border-saffron-200 bg-gradient-to-r from-saffron-50 to-amber-50 shadow-sm dark:border-saffron-800 dark:bg-saffron-950/40"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10 inline-flex items-center gap-1.5">
                    <span>{item.label}</span>{' '}
                    <span lang="hi" className="hidden text-[11px] font-devanagari opacity-75 font-normal 2xl:inline">
                      {item.labelHi}
                    </span>
                  </span>
                </Link>
              ))}

              {/* Desktop Discovery Dropdown */}
              <div className="relative" ref={discoverRef}>
                <button
                  ref={discoverButtonRef}
                  type="button"
                  onClick={() => setDiscoverOpen((open) => !open)}
                  className={`flex items-center gap-1 rounded-xl px-1.5 xl:px-3 py-2 text-[13px] xl:text-sm font-semibold transition-colors ${
                    discoveryIsActive || discoverOpen
                      ? 'bg-saffron-50 text-saffron-700 dark:bg-saffron-950/40'
                      : 'text-dharma-text hover:bg-saffron-50/50 hover:text-saffron-700'
                  }`}
                  aria-expanded={discoverOpen}
                  aria-controls="desktop-discovery-menu"
                  aria-haspopup="true"
                >
                  <span>Explore</span>{' '}
                  <span lang="hi" className="hidden font-devanagari text-[11px] font-normal opacity-75 2xl:inline">
                    अन्वेषण
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${discoverOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence>
                  {discoverOpen && (
                    <motion.div
                      id="desktop-discovery-menu"
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: reduce ? 0 : 0.16 }}
                      className="absolute right-0 top-[calc(100%+0.75rem)] w-[34rem] rounded-2xl border border-dharma-border bg-dharma-card p-3 shadow-2xl z-50"
                    >
                      <p className="px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-[0.16em] text-dharma-muted">
                        ज्ञान संसार
                      </p>
                      <div className="grid grid-cols-2 gap-1">
                        {desktopDiscoveryItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`rounded-xl px-3 py-2.5 transition-colors ${
                              isActive(item.href)
                                ? 'bg-saffron-50 text-saffron-800 dark:bg-saffron-950/40'
                                : 'hover:bg-dharma-bg'
                            }`}
                          >
                            <span className="block text-sm font-bold text-dharma-text">
                              {item.label}
                            </span>
                            <span className="mt-0.5 block text-xs text-dharma-muted">
                              {item.description}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-2 flex gap-2 border-t border-dharma-border px-2 pt-3">
                        {desktopPersonalItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-lg px-3 py-2 text-xs font-semibold text-dharma-muted transition hover:bg-dharma-bg hover:text-saffron-700"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                className="hidden lg:flex items-center gap-2 rounded-xl border border-dharma-border/80 bg-dharma-bg/80 px-3 py-2 text-xs font-semibold text-dharma-muted transition hover:border-saffron-400 hover:text-dharma-text focus:outline-none focus:ring-2 focus:ring-saffron-500/20"
                aria-label="खोजें (Search)"
                aria-keyshortcuts="Control+K Meta+K /"
              >
                <Search className="h-3.5 w-3.5 text-saffron-600" />
                <span className="hidden xl:inline">खोजें...</span>
                <kbd className="hidden xl:inline rounded border border-dharma-border bg-dharma-card px-1.5 py-0.5 font-mono text-[10px] text-dharma-muted">
                  {shortcutLabel}
                </kbd>
              </button>

              {/* Desktop Language Toggle */}
              <LanguageToggle className="hidden lg:inline-flex" />

              {/* Desktop Segmented Theme Toggle: only where the bar has room for it
                  beside the full nav; below that the single cycle button (2. Theme Button) stands in. */}
              <div className="hidden min-[1800px]:inline-block">
                <ThemeToggle />
              </div>

              {/* Desktop CTA */}
              <Link
                href="/scripture/bhagavadgita"
                className="hidden min-[1800px]:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-saffron-600 to-amber-600 px-4 py-2 text-sm font-bold text-white shadow-md transition hover:from-saffron-700 hover:to-amber-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-saffron-500/30"
              >
                <Flame className="h-4 w-4" aria-hidden="true" />
                पठन आरम्भ करें
              </Link>

              {/* ── Mobile Compact Controls (≥ 44px Touch Targets) ─────── */}
              {/* 1. Search Button */}
              <button
                type="button"
                onClick={handleOpenSearchModal}
                onPointerEnter={() => void loadSearchModal()}
                onFocus={() => void loadSearchModal()}
                className="lg:hidden flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-dharma-border/80 bg-dharma-bg/90 text-dharma-muted transition active:scale-95 hover:border-saffron-400 hover:text-dharma-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
                aria-label="खोजें (Search)"
                title="खोजें (Search)"
              >
                <Search className="h-5 w-5 text-saffron-600" aria-hidden="true" />
              </button>

              {/* 2. Theme Button */}
              <button
                type="button"
                onClick={handleThemeCycle}
                className="min-[1800px]:hidden flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-dharma-border/80 bg-dharma-bg/90 text-dharma-text transition active:scale-95 hover:border-saffron-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
                aria-label={`थीम बदलें (${THEME_NAMES[theme].name})`}
                title={`थीम: ${THEME_NAMES[theme].name} · ${THEME_NAMES[theme].hi}`}
              >
                {/* initial={false}: server-rendered visible; only later theme changes animate. */}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={theme}
                    initial={{ scale: 0.7, opacity: 0, rotate: -20 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.7, opacity: 0, rotate: 20 }}
                    transition={{ duration: reduce ? 0 : 0.16 }}
                    className="flex items-center justify-center text-saffron-600 dark:text-amber-400"
                  >
                    <ThemeIcon className="h-5 w-5" aria-hidden="true" />
                  </motion.span>
                </AnimatePresence>
              </button>

              {/* 3. Menu Button */}
              <button
                ref={menuButtonRef}
                type="button"
                onClick={handleToggleDrawer}
                className={`lg:hidden flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 ${
                  drawerOpen
                    ? 'border-saffron-500 bg-saffron-500/10 text-saffron-700 dark:text-saffron-300'
                    : 'border-dharma-border/80 bg-dharma-bg/90 text-dharma-text hover:border-saffron-400'
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
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-saffron-500 via-amber-400 to-emerald-400"
          style={{ scaleX: reduce ? scrollYProgress : progress }}
        />
      </nav>

      {/* ── Accessible Navigation Drawer ─────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="lg:hidden">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.2 }}
              onClick={handleCloseDrawer}
              className="fixed inset-0 z-[60] bg-stone-950/65 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Slide-out Drawer Panel */}
            <motion.div
              ref={drawerRef}
              id="mobile-navigation-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="नेविगेशन दराज (Navigation Drawer)"
              initial={reduce ? { opacity: 0 } : { x: '100%' }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: '100%' }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { type: 'spring', damping: 30, stiffness: 320, mass: 0.8 }
              }
              className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[360px] sm:max-w-md flex-col border-l border-dharma-border bg-dharma-card shadow-2xl"
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
                  <kbd className="rounded border border-dharma-border bg-dharma-card px-2 py-0.5 font-mono text-[10px] text-dharma-muted">
                    {shortcutLabel}
                  </kbd>
                </button>

                {/* Sacred soundscape: kept out of the header so it stays uncluttered. */}
                <div className="flex min-h-[48px] items-center justify-between rounded-xl border border-dharma-border bg-dharma-bg px-3.5 py-1.5">
                  <span className="text-sm text-dharma-text">
                    <span lang="hi" className="font-devanagari font-semibold">पवित्र ध्वनि</span>
                    <span className="ml-1.5 text-xs text-dharma-muted">· तानपूरा (432Hz) व ॐ</span>
                  </span>
                  <SoundscapeNavButton className="h-11 w-11 min-h-[44px] min-w-[44px]" />
                </div>

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

                  <div className="space-y-1">
                    {drawerSections.map((item) => {
                      const active = isActive(item.href);
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={handleCloseDrawer}
                          aria-current={active ? 'page' : undefined}
                          className={`group relative flex min-h-[48px] items-center justify-between rounded-xl px-3 py-2.5 transition active:scale-[0.98] ${
                            active
                              ? 'border border-saffron-300 bg-saffron-50 font-bold text-saffron-900 shadow-sm dark:border-saffron-700/60 dark:bg-saffron-950/40 dark:text-saffron-300'
                              : 'border border-transparent text-dharma-text hover:border-dharma-border hover:bg-dharma-bg'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Icon with active glow */}
                            <span
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
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
                            {item.badge && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
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

                {/* Discovery Quick Links */}
                <section aria-labelledby="drawer-discover-heading" className="pt-2">
                  <h3
                    id="drawer-discover-heading"
                    className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-dharma-muted"
                  >
                    अन्वेषण व ज्ञान विषय
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {desktopDiscoveryItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={handleCloseDrawer}
                        className={`inline-flex min-h-[44px] items-center rounded-xl border px-3 py-2 text-xs font-semibold transition active:scale-95 ${
                          isActive(item.href)
                            ? 'border-saffron-400 bg-saffron-500/10 text-saffron-700 dark:text-saffron-300'
                            : 'border-dharma-border/80 bg-dharma-bg text-dharma-muted hover:border-saffron-300 hover:text-dharma-text'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </section>

                <div className="pt-3 text-center border-t border-dharma-border/60">
                  <p className="font-devanagari text-xs text-dharma-muted">
                    ॐ असतो मा सद्गमय · तमसो मा ज्योतिर्गमय
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Mobile Bottom Navigation Bar (Thumb Usability) ────────────────── */}
      {/* Strictly limited to the 5 requested items: Home, Search, Library, Sadhana, Saved */}
      <nav
        aria-label="Mobile quick navigation"
        className="fixed bottom-0 inset-x-0 z-30 lg:hidden border-t border-dharma-border/80 bg-dharma-card/95 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
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
                ? 'text-saffron-700 dark:text-saffron-400 font-bold'
                : 'text-dharma-muted hover:text-dharma-text'
            }`}
          >
            {isActive('/') && (
              <span
                aria-hidden="true"
                className="absolute top-0.5 h-1 w-6 rounded-full bg-saffron-500 animate-in fade-in duration-150"
              />
            )}
            <Home className="h-5 w-5" aria-hidden="true" />
            <span className="text-[10px] tracking-tight">Home</span>
          </Link>

          {/* 2. Search Button */}
          <button
            type="button"
            onClick={handleOpenSearchModal}
            className="group relative flex min-h-[44px] flex-col items-center justify-center gap-0.5 text-dharma-muted transition active:scale-95 hover:text-dharma-text"
            aria-label="खोजें (Search)"
          >
            <Search className="h-5 w-5 text-saffron-600" aria-hidden="true" />
            <span className="text-[10px] tracking-tight">Search</span>
          </button>

          {/* 3. Library */}
          <Link
            href="/scriptures"
            onClick={() => setTimeout(() => triggerTactileFeedback('light', 'softTap'), 0)}
            aria-current={isActive('/scriptures') ? 'page' : undefined}
            className={`group relative flex min-h-[44px] flex-col items-center justify-center gap-0.5 transition active:scale-95 ${
              isActive('/scriptures')
                ? 'text-saffron-700 dark:text-saffron-400 font-bold'
                : 'text-dharma-muted hover:text-dharma-text'
            }`}
          >
            {isActive('/scriptures') && (
              <span
                aria-hidden="true"
                className="absolute top-0.5 h-1 w-6 rounded-full bg-saffron-500 animate-in fade-in duration-150"
              />
            )}
            <BookOpen className="h-5 w-5" aria-hidden="true" />
            <span className="text-[10px] tracking-tight">Library</span>
          </Link>

          {/* 4. Sadhana */}
          <Link
            href="/practice"
            onClick={() => setTimeout(() => triggerTactileFeedback('light', 'softTap'), 0)}
            aria-current={isActive('/practice') ? 'page' : undefined}
            className={`group relative flex min-h-[44px] flex-col items-center justify-center gap-0.5 transition active:scale-95 ${
              isActive('/practice')
                ? 'text-saffron-700 dark:text-saffron-400 font-bold'
                : 'text-dharma-muted hover:text-dharma-text'
            }`}
          >
            {isActive('/practice') && (
              <span
                aria-hidden="true"
                className="absolute top-0.5 h-1 w-6 rounded-full bg-saffron-500 animate-in fade-in duration-150"
              />
            )}
            <Sparkles className="h-5 w-5" aria-hidden="true" />
            <span className="text-[10px] tracking-tight">Sadhana</span>
          </Link>

          {/* 5. Saved Verses */}
          <Link
            href="/practice/bookmarks/"
            onClick={() => setTimeout(() => triggerTactileFeedback('light', 'softTap'), 0)}
            aria-current={isActive('/practice/bookmarks/') ? 'page' : undefined}
            className={`group relative flex min-h-[44px] flex-col items-center justify-center gap-0.5 transition active:scale-95 ${
              isActive('/practice/bookmarks/')
                ? 'text-saffron-700 dark:text-saffron-400 font-bold'
                : 'text-dharma-muted hover:text-dharma-text'
            }`}
          >
            {isActive('/practice/bookmarks/') && (
              <span
                aria-hidden="true"
                className="absolute top-0.5 h-1 w-6 rounded-full bg-saffron-500 animate-in fade-in duration-150"
              />
            )}
            <div className="relative">
              <Bookmark className="h-5 w-5" aria-hidden="true" />
              {bookmarkCount > 0 && (
                <span className="absolute -top-1 -right-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-saffron-600 px-1 text-[9px] font-bold text-white shadow-xs">
                  {bookmarkCount > 9 ? '9+' : bookmarkCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight">Saved</span>
          </Link>
        </div>
      </nav>

      {/* Global Search Modal Lazy Mount */}
      {searchMounted && (
        <GlobalSearchModal
          isOpen={searchOpen}
          initialQuery={searchQuery}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </>
  );
}

export { SiteNav as GlobalHeader };
