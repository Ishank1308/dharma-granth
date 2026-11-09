'use client';

import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { parseWordMeanings } from '@/lib/word-gloss';
import { SPRING } from './motion';
import type { BhashyaSource, ReaderMode } from './SpatialShloka';

/** The panel under a verse in spatial focus (see SpatialShloka), in its own chunk. */
export function SpatialPanel({ mode, wordMeaning, bhashya }: { mode: ReaderMode; wordMeaning?: string; bhashya: BhashyaSource[] }) {
  return mode === 'anvaya' ? <AnvayaGrid wordMeaning={wordMeaning} /> : <BhashyaSwitcher sources={bhashya} />;
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
