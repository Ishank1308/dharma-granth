'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { useFoldingTitle } from '@/lib/useFoldingTitle';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useTheme, type Theme } from './ThemeProvider';
import { useLanguagePreference } from '@/lib/useLanguagePreference';
import { triggerTactileFeedback } from '@/lib/haptics';
import { THEME_IDS } from '@/lib/site-theme';
import { readActiveStreak } from '@/lib/reading-history';
import { OPEN_SEARCH_EVENT, type OpenSearchDetail } from '@/lib/search-events';
import {
  buildDrawerSections,
  desktopPrimaryItems,
  isNavRouteActive,
  isTypingTarget,
} from './nav/nav-data';
import { DesktopExploreMenu } from './nav/DesktopExploreMenu';
import { HeaderThemeMenu } from './nav/HeaderThemeMenu';
import { MobileNavDrawer } from './nav/MobileNavDrawer';
import { MobileBottomTabBar } from './nav/MobileBottomTabBar';

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
  const formatCount = useCallback((value: number) => new Intl.NumberFormat('en-IN').format(value), []);
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchMounted, setSearchMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchAnchor, setSearchAnchor] = useState<HTMLButtonElement>();
  const [shortcutLabel, setShortcutLabel] = useState('Ctrl K');
  const [bookmarkCount, setBookmarkCount] = useState<number>(0);
  const [activeStreak, setActiveStreak] = useState<number>(0);
  // The theme icon swaps with a little turn, but only after the reader changes it, never on first paint.
  const [themeTouched, setThemeTouched] = useState(false);

  const { theme, setTheme } = useTheme();
  const { preference, setPreference } = useLanguagePreference();
  // The home page opens on its own hero, so only inner pages fold their title into the bar. Called
  // after the language hook, whose effect sets <html data-ui-lang> before the bar title reads it.
  const fold = useFoldingTitle(pathname, pathname !== '/', preference);

  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const isActive = useCallback(
    (href: string): boolean => isNavRouteActive(pathname, href),
    [pathname],
  );

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
      // Close search even if the lazily mounted dialog has not attached its key listener yet.
      if (e.key === 'Escape') {
        setSearchOpen(false);
        return;
      }
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

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const handleToggleDrawer = () => {
    triggerTactileFeedback('medium', 'softTap');
    setDrawerOpen((prev) => !prev);
  };

  const handleCloseDrawer = useCallback(() => {
    triggerTactileFeedback('light', 'softTap');
    setDrawerOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  const handleSelectTheme = useCallback(
    (next: Theme) => {
      setTheme(next);
      setThemeTouched(true);
    },
    [setTheme],
  );

  const handleOpenSearchModal = useCallback(() => {
    triggerTactileFeedback('light', 'softTap');
    setDrawerOpen(false);
    setSearchOpen(true);
  }, []);

  const drawerSections = useMemo(
    () =>
      buildDrawerSections({
        libraryVerses,
        gitaChapters,
        gitaVerses,
        ashtavakraChapters,
        ashtavakraVerses,
        bookmarkCount,
        activeStreak,
        formatCount,
      }),
    [
      libraryVerses,
      gitaChapters,
      gitaVerses,
      ashtavakraChapters,
      ashtavakraVerses,
      bookmarkCount,
      activeStreak,
      formatCount,
    ],
  );

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
              className="group flex min-h-[44px] min-w-[44px] shrink items-center gap-1.5 rounded-xl pr-0 max-lg:flex-1 sm:gap-2.5 sm:pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500/40"
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
                  <span className="min-w-0 truncate text-body font-semibold tracking-[-0.022em] text-dharma-text max-[359px]:text-[15px] max-[359px]:tracking-[-0.03em]">
                    Dharma Granth
                  </span>{' '}
                  <span lang="hi" className="hidden font-devanagari text-footnote text-dharma-muted sm:inline">
                    धर्म ग्रंथ
                  </span>
                </div>{' '}
                {/* The page's large title, once it has folded up under the bar (lib/useFoldingTitle). */}
                <span className="bar-page-title truncate text-body font-semibold tracking-[-0.022em] text-dharma-text" aria-hidden="true">
                  {fold.title}
                </span>
              </div>
            </Link>{' '}

            {/* Desktop Primary Navigation: Floating Frosted Glass Pill Track */}
            <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
              <div className="inline-flex items-center gap-0.5 rounded-full border border-white/60 bg-white/40 px-1.5 py-1 shadow-[inset_0_1px_0_var(--glass-specular-top),0_4px_18px_-6px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-white/12 dark:bg-white/[0.06]">
                {desktopPrimaryItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={`relative whitespace-nowrap rounded-full px-2.5 2xl:px-3.5 py-1.5 text-footnote transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-dharma-saffron/15 font-semibold text-dharma-saffron shadow-[inset_0_1px_0_var(--glass-specular-top)] ring-1 ring-dharma-saffron/30'
                        : 'text-dharma-text/85 hover:bg-white/50 hover:text-dharma-text dark:hover:bg-white/10'
                    }`}
                  >
                    <span className="inline-flex items-baseline gap-1">
                      <span data-bi="en">{item.label}</span>{' '}
                      <span lang="hi" data-bi="hi" data-bi-lead className="hidden text-[12.5px] font-devanagari text-dharma-muted xl:inline">
                        {item.labelHi}
                      </span>{' '}
                    </span>
                  </Link>
                ))}

                <DesktopExploreMenu pathname={pathname} isActive={isActive} />
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
                <kbd className="kbd-hint hidden 2xl:inline rounded-md bg-dharma-text/[0.07] px-1.5 py-0.5 font-sans text-[11px] text-dharma-text-secondary">
                  {shortcutLabel}
                </kbd>
              </button>{' '}

              {/* Desktop Language Toggle */}
              <LanguageToggle className="hidden lg:inline-flex" preference={preference} setPreference={setPreference} />

              {/* Desktop Segmented Theme Toggle: only where the bar has room for it */}
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

              {/* 2. Theme Button */}
              <HeaderThemeMenu
                theme={theme}
                themeTouched={themeTouched}
                onSelectTheme={handleSelectTheme}
              />

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
      <MobileNavDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        menuButtonRef={menuButtonRef}
        drawerSections={drawerSections}
        isActive={isActive}
        shortcutLabel={shortcutLabel}
        onOpenSearch={handleOpenSearchModal}
        preference={preference}
        setPreference={setPreference}
        theme={theme}
        onSelectTheme={handleSelectTheme}
      />

      {/* ── Mobile Bottom Navigation Bar ─────────────────────────────────── */}
      <MobileBottomTabBar
        isActive={isActive}
        bookmarkCount={bookmarkCount}
        onOpenSearch={handleOpenSearchModal}
      />

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
