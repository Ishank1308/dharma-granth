'use client';

import { useId, useState, type MouseEvent, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { parseWordMeanings } from '@/lib/word-gloss';
import { SPRING } from './motion';

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
  const reduce = useReducedMotion();

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
      <AnimatePresence initial={false}>
        {showPanel && (
          <motion.div
            key={mode}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={SPRING}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 px-1 pb-2 pt-5 sm:px-2">
              {mode === 'anvaya' ? <AnvayaGrid wordMeaning={wordMeaning} /> : <BhashyaSwitcher sources={bhashya} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Padaccheda / Anvaya: each word of the verse with its meaning, as printed in the source. */
function AnvayaGrid({ wordMeaning }: { wordMeaning?: string }) {
  const words = parseWordMeanings(wordMeaning);
  if (words.length === 0) {
    return (
      <p className="text-sm text-dharma-muted">
        <span lang="hi">इस श्लोक का पदच्छेद अभी उपलब्ध नहीं है।</span>{' '}
        <span lang="en">No word-by-word breakdown is published for this verse yet.</span>
      </p>
    );
  }
  return (
    <section aria-label="पदच्छेद · Word by word">
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-dharma-muted">
        <span lang="hi" className="font-devanagari normal-case tracking-normal">पदच्छेद</span> · Anvaya
      </p>
      <ul className="flex flex-wrap gap-2">
        {words.map((w, i) => (
          <motion.li
            key={`${w.pada}-${i}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: Math.min(i * 0.025, 0.4) }}
            className="anvaya-pill rounded-2xl border px-3 py-2"
          >
            <span className="block font-serif text-subhead italic text-dharma-text">{w.pada}</span>
            <span className="block text-xs text-dharma-muted">{w.meaning}</span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

/** Switches between the commentaries this verse carries, with a liquid indicator. */
function BhashyaSwitcher({ sources }: { sources: BhashyaSource[] }) {
  const [active, setActive] = useState(sources[0]?.id);
  const group = useId();
  if (sources.length === 0) {
    return (
      <p className="text-sm text-dharma-muted">
        <span lang="hi">इस श्लोक पर अभी कोई भाष्य या व्याख्या प्रकाशित नहीं है।</span>{' '}
        <span lang="en">No commentary is published for this verse yet.</span>
      </p>
    );
  }
  const current = sources.find((s) => s.id === active) ?? sources[0];
  return (
    <section aria-label="भाष्य · Commentary">
      <div role="tablist" aria-label="भाष्य चुनें · Choose a commentary" className="mb-4 inline-flex flex-wrap gap-1 rounded-full border border-dharma-border/60 p-1">
        {sources.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={s.id === current.id}
            onClick={() => setActive(s.id)}
            className="relative min-h-[36px] rounded-full px-3.5 text-xs font-medium text-dharma-muted transition-colors aria-selected:text-dharma-text"
          >
            {s.id === current.id && (
              <motion.span layoutId={`bhashya-pill-${group}`} transition={SPRING} className="bhashya-active absolute inset-0 rounded-full" />
            )}
            <span className="relative">
              <span lang="hi" className="font-devanagari">{s.labelHi}</span> · <span lang="en">{s.labelEn}</span>
            </span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current.id}
          role="tabpanel"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={SPRING}
        >
          {current.draft && (
            <p className="mb-2 text-[11px] font-medium text-violet-700/80 dark:text-violet-300/80">
              संपादकीय प्रारूप · समीक्षा बाकी · Editor draft, review pending
            </p>
          )}
          <p
            lang={current.lang}
            className={`whitespace-pre-line leading-[1.85] text-dharma-text ${current.lang === 'hi' ? 'font-devanagari text-base' : 'font-serif text-body'}`}
          >
            {current.text}
          </p>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
