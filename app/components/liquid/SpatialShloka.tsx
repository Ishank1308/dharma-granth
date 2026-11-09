'use client';

import { type MouseEvent, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { useReducedMotionPreference } from '@/lib/useReducedMotionPreference';

// The Anvaya grid and Bhashya switcher (and the framer-motion they animate with) load only when a
// reader first opens a verse in spatial focus, so a chapter page does not download them up front.
const SpatialPanel = dynamic(() => import('./SpatialPanel').then((m) => m.SpatialPanel), { ssr: false });

export type ReaderMode = 'samhita' | 'anvaya' | 'bhashya';

/** One commentary the verse actually carries. Never invented: absent sources are not listed. */
export interface BhashyaSource {
  id: string;
  labelHi: string;
  labelEn: string;
  text: string;
  lang: 'hi' | 'en';
  /** AI-assisted or editorial draft: shown with its notice. */
  draft?: boolean;
}

const INTERACTIVE = 'a,button,input,select,textarea,summary,label,[role="button"],[role="menuitem"],[contenteditable="true"]';

/**
 * visionOS-style spatial focus for one shloka. Clicking a verse lifts it
 * (scale 1.02) into a Liquid Glass card; the others recede (scale 0.97,
 * 45% opacity, 3px blur). The lifted card opens the Anvaya word grid or the
 * Bhāṣya switcher below it, by the dock's mode. Reduced motion keeps the
 * focus state but drops the scale and blur.
 */
export function SpatialShloka({
  focused,
  dimmed,
  onFocusChange,
  mode,
  wordMeaning,
  bhashya,
  children,
}: {
  focused: boolean;
  dimmed: boolean;
  onFocusChange: (focused: boolean) => void;
  mode: ReaderMode;
  wordMeaning?: string;
  bhashya: BhashyaSource[];
  children: ReactNode;
}) {
  const reduce = useReducedMotionPreference();

  function onClick(e: MouseEvent<HTMLDivElement>) {
    // Buttons, links and text selection keep their own meaning.
    if ((e.target as HTMLElement).closest(INTERACTIVE)) return;
    if (window.getSelection()?.toString()) return;
    onFocusChange(!focused);
  }

  const showPanel = focused && mode !== 'samhita';

  return (
    // A plain div with CSS transitions, not a motion.div: a long chapter has one of these per verse, and
    // framer-motion measured every one on load (Uttar Kanda: 873 of them, about 10 s on a mid-range phone).
    // Transform and filter are set only while needed, so a resting verse is never a containing block for
    // fixed children. The click is a pointer shortcut; keyboard users have the card's own focus button.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      data-spatial={focused ? 'focused' : dimmed ? 'dimmed' : undefined}
      onClick={onClick}
      style={{
        transform: !reduce && (focused || dimmed) ? `scale(${focused ? 1.02 : 0.97})` : undefined,
        opacity: dimmed ? 0.45 : undefined,
        filter: !reduce && dimmed ? 'blur(3px)' : undefined,
      }}
      className={`relative origin-center rounded-panel transition-[transform,opacity,filter] duration-[var(--duration-base)] ease-[var(--ease-out)] motion-reduce:transition-opacity ${dimmed ? 'cursor-pointer' : ''} ${
        focused ? 'liquid-glass spatial-focused z-10 px-3 py-3 sm:px-5 sm:py-4' : ''
      }`}
    >
      {children}
      {showPanel && (
        <div key={mode} className="liquid-reveal border-t border-white/10 px-1 pb-2 pt-5 sm:px-2">
          <SpatialPanel mode={mode} wordMeaning={wordMeaning} bhashya={bhashya} />
        </div>
      )}
    </div>
  );
}
