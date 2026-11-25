'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { navigateWithTransition } from '@/lib/view-transition';
import { LITE_COMPAT } from './verse-rail-styles';

export interface VerseLayoutRenderState {
  focusMode: boolean;
  onToggleFocus: () => void;
  selectedWordIndex: number;
  setSelectedWordIndex: (index: number) => void;
}

export interface VersePageLayoutProps {
  /** Unique key per verse (`scriptureId:chapterId:verseNumber`) to reset active word selection cleanly. */
  verseIdentity: string;
  focusMode: boolean;
  liteMode?: boolean;
  onToggleFocus: () => void;
  prevHref?: string;
  nextHref?: string;
  /** Number of interactive padachheda glosses available for `[` and `]` keyboard jumps. */
  padaCount?: number;
  /** Suppresses global shortcuts while a modal/drawer is open. */
  dialogOpen?: boolean;
  swipeHandlers?: Record<string, unknown>;
  paneStyle?: CSSProperties;
  /** Compact mobile chapter/verse bar rendered below `lg` when not in focus mode. */
  mobileTopBar?: ReactNode;
  /** Left sticky rail (`lg:col-span-3`), hidden in focus mode. */
  leftRail: ReactNode;
  /** Center primary verse stage (`lg:col-span-6`, expanding to `lg:col-span-8 lg:col-start-3` in focus mode). */
  renderCenter: (state: VerseLayoutRenderState) => ReactNode;
  /** Right sticky study companion rail (`lg:col-span-3`), hidden in focus mode and stacked below center on `< lg`. */
  renderRight: (state: { selectedWordIndex: number; setSelectedWordIndex: (index: number) => void }) => ReactNode;
}

/**
 * Responsive 12-column desktop reading grid for the Dharma Granth verse detail page.
 * Manages `selectedWordIndex`, syncs `focusMode`, and wires `ArrowLeft`, `ArrowRight`, `[`, `]`, `s`, `w`, `i`, `n`, `b`, `?`, and `f` shortcuts.
 */
export function VersePageLayout({
  verseIdentity,
  focusMode,
  liteMode = false,
  onToggleFocus,
  prevHref,
  nextHref,
  padaCount = 0,
  dialogOpen = false,
  swipeHandlers,
  paneStyle,
  mobileTopBar,
  leftRail,
  renderCenter,
  renderRight,
}: VersePageLayoutProps) {
  const router = useRouter();
  const [selectedWordIndex, setSelectedWordIndex] = useState(0);
  const singleColumn = focusMode || liteMode;

  useEffect(() => {
    setSelectedWordIndex(0);
  }, [verseIdentity]);

  useEffect(() => {
    if (dialogOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable ||
          Boolean(
            target.closest(
              'button, a, summary, [role="tab"], [role="menuitem"], [role="menuitemradio"], [role="option"], [role="combobox"], [role="radiogroup"]',
            ),
          ))
      ) {
        return;
      }

      if (event.key === 'f' || event.key === 'F') {
        event.preventDefault();
        onToggleFocus();
        return;
      }
      if (event.key === '[' && padaCount > 0 && !liteMode) {
        event.preventDefault();
        setSelectedWordIndex((prev) => (prev - 1 + padaCount) % padaCount);
        return;
      }
      if (event.key === ']' && padaCount > 0 && !liteMode) {
        event.preventDefault();
        setSelectedWordIndex((prev) => (prev + 1) % padaCount);
        return;
      }
      if (event.key === 's' || event.key === 'S') {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent('dharma:toggle-svadhyaya'));
        return;
      }
      if (event.key === 'w' || event.key === 'W') {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent('dharma:toggle-padas'));
        return;
      }
      if (event.key === 'i' || event.key === 'I') {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent('dharma:toggle-iast'));
        return;
      }
      if (event.key === 'b' || event.key === 'B') {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent('dharma:toggle-bookmark'));
        return;
      }
      if ((event.key === 'n' || event.key === 'N') && !singleColumn) {
        const noteBox = document.querySelector<HTMLTextAreaElement>(
          'aside[aria-label="Study companion"] textarea',
        );
        if (noteBox) {
          event.preventDefault();
          noteBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
          noteBox.focus();
        }
        return;
      }
      if (event.key === '?') {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent('dharma:toggle-shortcuts'));
        return;
      }
      if ((event.key === 'ArrowLeft' || event.key === 'h' || event.key === 'k') && prevHref) {
        event.preventDefault();
        navigateWithTransition(router, prevHref, 'prev');
        return;
      }
      if ((event.key === 'ArrowRight' || event.key === 'l' || event.key === 'j') && nextHref) {
        event.preventDefault();
        navigateWithTransition(router, nextHref, 'next');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dialogOpen, prevHref, nextHref, padaCount, liteMode, singleColumn, onToggleFocus, router]);

  return (
    <div
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-5 lg:py-8 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start [[data-lite-mode=true]_&]:transition-none"
      {...swipeHandlers}
    >
      {!singleColumn && mobileTopBar && (
        <div className="hidden sm:block lg:hidden min-w-0">
          {mobileTopBar}
        </div>
      )}

      {!singleColumn && (
        <aside
          aria-label="Chapter navigation"
          className={`hidden lg:flex lg:flex-col lg:col-span-3 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-hidden min-w-0 pr-0.5 ${LITE_COMPAT}`}
        >
          {leftRail}
        </aside>
      )}

      <main
        data-chapter-reading
        data-vt-pane
        style={paneStyle}
        className={`min-w-0 ${
          singleColumn
            ? 'lg:col-span-8 lg:col-start-3 pb-28 sm:pb-20'
            : 'lg:col-span-6 pb-4 lg:pb-20'
        }`}
      >
        {renderCenter({
          focusMode,
          onToggleFocus,
          selectedWordIndex,
          setSelectedWordIndex,
        })}
      </main>

      {!singleColumn && (
        <aside
          aria-label="Study companion"
          className={`min-w-0 lg:col-span-3 lg:sticky lg:top-20 space-y-5 pb-28 sm:pb-20 lg:pb-6 ${LITE_COMPAT}`}
        >
          {renderRight({ selectedWordIndex, setSelectedWordIndex })}
        </aside>
      )}
    </div>
  );
}
