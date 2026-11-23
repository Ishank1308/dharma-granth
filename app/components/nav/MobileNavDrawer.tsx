'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, type RefObject } from 'react';
import { Check, ChevronRight, Search, Settings2, X } from 'lucide-react';
import { usePresence } from '@/app/components/motion/usePresence';
import { THEMES, THEME_NAMES, type Theme } from '../ThemeProvider';
import {
  LANGUAGE_OPTIONS,
  type LanguagePreference,
} from '@/lib/useLanguagePreference';
import { triggerTactileFeedback } from '@/lib/haptics';
import {
  discoveryGroups,
  THEME_ICONS,
  type DrawerItem,
} from './nav-data';

export function MobileNavDrawer({
  open,
  onClose,
  menuButtonRef,
  drawerSections,
  isActive,
  shortcutLabel,
  onOpenSearch,
  preference,
  setPreference,
  theme,
  onSelectTheme,
}: {
  open: boolean;
  onClose: () => void;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  drawerSections: DrawerItem[];
  isActive: (href: string) => boolean;
  shortcutLabel: string;
  onOpenSearch: () => void;
  preference: LanguagePreference;
  setPreference: (pref: LanguagePreference) => void;
  theme: Theme;
  onSelectTheme: (next: Theme) => void;
}) {
  const drawer = usePresence(open, 200);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerCloseBtnRef = useRef<HTMLButtonElement>(null);

  // Background scroll lock & layout shift prevention
  useEffect(() => {
    if (!open) return;

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
  }, [open]);

  // Close the drawer automatically if the viewport widens past the lg breakpoint so desktop scroll lock cannot stick.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const handleViewport = () => {
      if (mq.matches) onClose();
    };
    handleViewport();
    mq.addEventListener('change', handleViewport);
    return () => mq.removeEventListener('change', handleViewport);
  }, [open, onClose]);

  // Focus trapping and Escape key support for navigation drawer
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      drawerCloseBtnRef.current?.focus();
    }, 50);

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        if (!drawerRef.current) return;
        const focusable = Array.from(
          drawerRef.current.querySelectorAll<HTMLElement>(
            'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((el) => el.offsetParent !== null);
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !drawerRef.current.contains(document.activeElement)) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last || !drawerRef.current.contains(document.activeElement)) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose, menuButtonRef]);

  if (!drawer.mounted) return null;

  const drawerHrefs = new Set(drawerSections.map((s) => s.href));
  const groupsWithUniqueItems = discoveryGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !drawerHrefs.has(item.href)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="lg:hidden">
      {/* Backdrop Overlay */}
      <div
        data-closing={drawer.closing || undefined}
        onClick={onClose}
        className="chrome-fade fixed inset-0 z-[60] bg-stone-950/65 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Slide-out Drawer Panel */}
      <div
        ref={drawerRef}
        id="mobile-navigation-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="मोबाइल नेविगेशन मेनू"
        data-closing={drawer.closing || undefined}
        className="chrome-sheet material-thick fixed inset-y-0 right-0 z-[70] flex w-full max-w-[360px] sm:max-w-md flex-col border-l border-dharma-border/80 bg-dharma-card/90 shadow-2xl backdrop-blur-2xl"
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
            onClick={onClose}
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
            onClick={onOpenSearch}
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
                    onClick={onClose}
                    aria-current={active ? 'page' : undefined}
                    className={`group relative flex min-h-[48px] items-center justify-between rounded-xl px-2.5 py-1.5 transition active:scale-[0.98] sm:px-3 sm:py-2.5 ${
                      active
                        ? 'border border-saffron-300 bg-saffron-50 font-bold text-saffron-900 shadow-sm dark:border-saffron-700/60 dark:bg-saffron-950/40 dark:text-saffron-300'
                        : 'border border-transparent text-dharma-text hover:border-dharma-border hover:bg-dharma-bg'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
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
                          <span className="hidden min-[380px]:inline text-xs font-normal text-dharma-muted truncate">
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

          {/* ── Language & Theme Settings ─────────────────────── */}
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
                <span><span lang="hi" data-bi="hi">भाषा व थीम सेटिंग्स</span><span data-bi="sep"> · </span><span data-bi="en">Preferences</span></span>
              </h3>
            </div>

            {/* Language Selector (≥ 44px touch targets) */}
            <div>
              <p className="mb-2 block text-xs font-semibold text-dharma-text">
                <span lang="hi" data-bi="hi">पठन भाषा</span><span data-bi="sep"> · </span><span data-bi="en">Reading Language</span>
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
                <span lang="hi" data-bi="hi">थीम मोड</span><span data-bi="sep"> · </span><span data-bi="en">Display Theme</span>
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
                        onSelectTheme(opt);
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
          <section aria-labelledby="drawer-discover-heading" className="pt-2">
            <h3
              id="drawer-discover-heading"
              className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-dharma-muted"
            >
              <span><span lang="hi" data-bi="hi">अतिरिक्त संदर्भ व साधन</span><span data-bi="sep"> · </span><span data-bi="en">More Reference</span></span>
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
                          onClick={onClose}
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

          <div className="pt-3 text-center border-t border-dharma-border/60">
            <p className="font-devanagari text-xs text-dharma-muted">
              ॐ असतो मा सद्गमय · तमसो मा ज्योतिर्गमय
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
