'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@/app/components/ThemeProvider';
import { useEverTrue } from '@/lib/use-ever-true';
import { SACRED_SECTION_LABEL } from '@/lib/sacred-reading-order';
import { useReaderSettings } from '@/lib/useReaderSettings';

const ReaderSettingsPanel = dynamic(
  () => import('@/app/components/reader/ReaderSettingsPanel').then((m) => m.ReaderSettingsPanel),
  { ssr: false },
);

const SIZE_ORDER = ['sm', 'md', 'lg', 'xl'] as const;
const STUDY_STEPS = ['arth', 'vyakhya', 'modern', 'reflection'] as const;

/**
 * Matches the common reader's अध्ययन मार्ग and type-size controls.
 * The verse body remains server-rendered; only its scoped typography
 * attributes are synchronised from the shared reader preferences.
 */
export function AshtavakraReadingGuide({ verseId }: { verseId: string }) {
  const { settings, update, reset, reducedMotion } = useReaderSettings();
  const { theme, setTheme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsLoaded = useEverTrue(settingsOpen);

  useEffect(() => {
    const verse = document.getElementById(verseId);
    if (!verse) return;
    verse.dataset.ashVerseSize = settings.sanskritSize;
    verse.dataset.ashVerseLeading = settings.lineSpacing;
    verse.dataset.ashTranslationSize = settings.translationSize;
    verse.dataset.ashContrast = settings.contrast;
    verse.dataset.ashWidth = settings.readingWidth;
  }, [verseId, settings.sanskritSize, settings.translationSize, settings.lineSpacing, settings.contrast, settings.readingWidth]);

  const resize = (direction: number) => {
    const i = SIZE_ORDER.indexOf(settings.sanskritSize);
    const next = SIZE_ORDER[Math.max(0, Math.min(SIZE_ORDER.length - 1, i + direction))];
    update('sanskritSize', next);
    update('translationSize', next);
  };

  return (
    <>
    <nav
      id="reader-study-guide"
      aria-label="श्लोक अध्ययन मार्ग · Verse study guide"
      className="scroll-mt-28 rounded-[20px] border border-dharma-border/80 bg-dharma-card/85 px-3 py-3 shadow-sm sm:px-4"
    >
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p lang="hi" className="font-devanagari text-sm font-bold text-dharma-text">अध्ययन मार्ग</p>
          <p className="text-[11px] font-medium text-dharma-muted">मूल श्लोक से चिंतन तक · Study this verse</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <div role="group" aria-label="Verse and translation text size" className="flex shrink-0 items-center gap-1 rounded-full border border-dharma-border bg-dharma-bg/70 p-0.5">
            <button
              type="button"
              onClick={() => resize(-1)}
              disabled={settings.sanskritSize === 'sm'}
              aria-label="Decrease verse and translation text size"
              title="अक्षर छोटे करें"
              className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-dharma-text hover:bg-dharma-text/[0.08] disabled:opacity-35"
            >A−</button>
            <button
              type="button"
              onClick={() => resize(1)}
              disabled={settings.sanskritSize === 'xl'}
              aria-label="Increase verse and translation text size"
              title="अक्षर बड़े करें"
              className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full text-base font-semibold text-dharma-text hover:bg-dharma-text/[0.08] disabled:opacity-35"
            >A+</button>
          </div>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-haspopup="dialog"
            aria-label="Reader settings · पठन व्यवस्था"
            title="पठन व्यवस्था · Reader settings"
            className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-dharma-border bg-dharma-bg/70 font-serif text-sm font-bold text-dharma-text transition-colors hover:border-saffron-500/60 hover:bg-dharma-text/[0.08]"
          >
            <span aria-hidden="true">Aa</span>
          </button>
        </div>
      </div>
      <div className="-mx-1 flex min-w-0 snap-x snap-proximity gap-2 overflow-x-auto px-1 pb-1">
        <a
          href={`#${verseId}-verse`}
          aria-label="मूल श्लोक · Original Sanskrit"
          className="focus-ring inline-flex min-h-[44px] shrink-0 snap-start items-center rounded-full border border-amber-500/40 bg-amber-500/10 px-3 text-xs font-semibold text-dharma-text"
        ><span lang="hi" className="font-devanagari">मूल श्लोक</span></a>
        {STUDY_STEPS.map((step, i) => (
          <a
            key={step}
            href={`#${verseId}-${step}`}
            aria-label={`${SACRED_SECTION_LABEL[step].hi} · ${SACRED_SECTION_LABEL[step].en}`}
            className="focus-ring inline-flex min-h-[44px] shrink-0 snap-start items-center gap-2 rounded-full border border-dharma-border bg-dharma-bg/70 px-3 text-xs font-semibold text-dharma-text transition-colors hover:border-saffron-500/60 hover:bg-saffron-500/10"
          >
            <span aria-hidden="true" className="font-mono text-[10px] font-bold tabular-nums text-saffron-700 dark:text-saffron-300">{String(i + 1).padStart(2, '0')}</span>
            <span lang="hi" className="font-devanagari">{SACRED_SECTION_LABEL[step].hi}</span>
          </a>
        ))}
        <a
          href={`#${verseId}-related`}
          aria-label="संबंधित ज्ञान · Related wisdom"
          className="focus-ring inline-flex min-h-[44px] shrink-0 snap-start items-center rounded-full border border-dharma-border bg-dharma-bg/70 px-3 text-xs font-semibold text-dharma-text hover:border-saffron-500/60"
        ><span lang="hi" className="font-devanagari">संबंधित ज्ञान</span></a>
        <a
          href={`#${verseId}-sources`}
          aria-label="स्रोत एवं सत्यापन · Sources and verification"
          className="focus-ring inline-flex min-h-[44px] shrink-0 snap-start items-center rounded-full border border-dharma-border bg-dharma-bg/70 px-3 text-xs font-semibold text-dharma-text hover:border-saffron-500/60"
        ><span lang="hi" className="font-devanagari">स्रोत</span></a>
      </div>
    </nav>
    {settingsLoaded && (
      <ReaderSettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        update={update}
        reset={reset}
        reducedMotion={reducedMotion}
        theme={theme}
        setTheme={setTheme}
        scope="verse"
      />
    )}
    </>
  );
}
