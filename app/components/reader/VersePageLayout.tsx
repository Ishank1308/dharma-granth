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
  onToggleFocus: () => void;
  prevHref?: string;
  nextHref?: string;
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
 * Manages `selectedWordIndex`, syncs `focusMode`, and wires `ArrowLeft`, `ArrowRight`, and `f` shortcuts.
 */
export function VersePageLayout({
  verseIdentity,
  focusMode,
  onToggleFocus,
  prevHref,
  nextHref,
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
  }, [dialogOpen, prevHref, nextHref, onToggleFocus, router]);

  return (
    <div
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-5 lg:py-8 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start [[data-lite-mode=true]_&]:transition-none"
      {...swipeHandlers}
    >
      {!focusMode && mobileTopBar && (
        <div className="hidden sm:block lg:hidden min-w-0">
          {mobileTopBar}
        </div>
      )}

      {!focusMode && (
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
          focusMode
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

      {!focusMode && (
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
