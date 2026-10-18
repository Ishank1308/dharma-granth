'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import {
  Atom,
  BookOpen,
  ChevronDown,
  Compass,
  GraduationCap,
  Languages,
  Lightbulb,
  Microscope,
  Quote,
  ScrollText,
  Sparkles,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { cleanVerseField, toDevanagari, verseLines } from '@/lib/verse-format';
import { parseWordMeanings } from '@/lib/word-gloss';
import { ExplainLine } from '@/app/components/study/ExplainLine';
import { CompareViews } from '@/app/components/study/CompareViews';
import { CommentaryCompare } from '@/app/components/study/CommentaryCompare';
import { SanskritWordExplorerDrawer } from '@/app/components/understand/SanskritWordExplorerDrawer';
import { findLexiconEntry, type SanskritLexiconEntry } from '@/data/sanskrit-lexicon';
import type { ReaderProvenance, ReaderVerseText } from '@/lib/reader-actions';
import type { PerspectiveMode, ReaderSettings } from '@/lib/useReaderSettings';

/* ── Type scale: full class strings so Tailwind keeps them ──────────── */

const SANSKRIT_SIZE = {
  sm: 'text-xl sm:text-2xl',
  md: 'text-2xl sm:text-3xl',
  lg: 'text-[1.75rem] sm:text-4xl',
  xl: 'text-3xl sm:text-5xl',
} as const;

const TRANSLATION_SIZE = {
  sm: 'text-[0.95rem]',
  md: 'text-base sm:text-[1.075rem]',
  lg: 'text-lg sm:text-xl',
  xl: 'text-xl sm:text-2xl',
} as const;

// Devanagari carries stacked marks above and below the line, so it needs more leading than Latin.
const DEVANAGARI_LEADING = {
  compact: 'leading-[1.7]',
  normal: 'leading-[1.85]',
  relaxed: 'leading-[2.05]',
  loose: 'leading-[2.35]',
} as const;

const LATIN_LEADING = {
  compact: 'leading-snug',
  normal: 'leading-normal',
  relaxed: 'leading-relaxed',
  loose: 'leading-loose',
} as const;

/* ── The six kinds of content, each with its own frame, chip and icon ─── */

type Kind = 'source' | 'aid' | 'translation' | 'tradition' | 'editorial' | 'reflection' | 'research' | 'sources';

const KINDS: Record<Kind, { chip: string; chipHi: string; frame: string; chipCls: string; Icon: typeof BookOpen }> = {
  source: {
    chip: 'Source scripture',
    chipHi: 'मूल पाठ',
    frame: 'border-2 border-amber-700/35 bg-amber-50/70 dark:border-amber-500/30 dark:bg-amber-950/25',
    chipCls: 'border-amber-700/40 bg-amber-100 text-amber-950 dark:border-amber-500/40 dark:bg-amber-900/40 dark:text-amber-100',
    Icon: ScrollText,
  },
  aid: {
    chip: 'Reading aid for the source',
    chipHi: 'मूल पाठ सहायक',
    frame: 'border border-amber-700/25 bg-amber-50/40 dark:border-amber-500/20 dark:bg-amber-950/15',
    chipCls: 'border-amber-700/30 bg-amber-50 text-amber-950 dark:border-amber-500/30 dark:bg-amber-900/30 dark:text-amber-100',
    Icon: Languages,
  },
  translation: {
    chip: 'Translation',
    chipHi: 'अनुवाद',
    frame: 'border border-dharma-border border-l-4 border-l-saffron-600 bg-dharma-card',
    chipCls: 'border-saffron-600/40 bg-saffron-100 text-saffron-950 dark:border-saffron-500/40 dark:bg-saffron-900/40 dark:text-saffron-100',
    Icon: Languages,
  },
  tradition: {
    chip: 'Traditional commentary',
    chipHi: 'परम्परागत भाष्य',
    frame: 'border border-stone-400/50 border-l-4 border-l-stone-600 bg-stone-100/70 dark:border-stone-600/50 dark:border-l-stone-400 dark:bg-stone-900/40',
    chipCls: 'border-stone-500/40 bg-stone-200 text-stone-900 dark:border-stone-500/40 dark:bg-stone-800 dark:text-stone-100',
    Icon: Quote,
  },
  editorial: {
    chip: 'Editorial explanation',
    chipHi: 'संपादकीय व्याख्या',
    frame: 'border border-sky-500/30 border-l-4 border-l-sky-600 bg-sky-50/60 dark:border-sky-500/25 dark:bg-sky-950/20',
    chipCls: 'border-sky-600/40 bg-sky-100 text-sky-950 dark:border-sky-500/40 dark:bg-sky-900/40 dark:text-sky-100',
    Icon: Lightbulb,
  },
  reflection: {
    chip: 'Modern reflection · not scripture',
    chipHi: 'आधुनिक चिंतन',
    frame: 'border border-emerald-600/30 border-l-4 border-l-emerald-600 bg-emerald-50/60 dark:border-emerald-500/25 dark:bg-emerald-950/20',
    chipCls: 'border-emerald-600/40 bg-emerald-100 text-emerald-950 dark:border-emerald-500/40 dark:bg-emerald-900/40 dark:text-emerald-100',
    Icon: Compass,
  },
  research: {
    chip: 'Research context · not scripture',
    chipHi: 'शोध संदर्भ',
    frame: 'border border-indigo-500/30 border-l-4 border-l-indigo-600 bg-indigo-50/60 dark:border-indigo-400/25 dark:bg-indigo-950/20',
    chipCls: 'border-indigo-600/40 bg-indigo-100 text-indigo-950 dark:border-indigo-400/40 dark:bg-indigo-900/40 dark:text-indigo-100',
    Icon: Atom,
  },
  sources: {
    chip: 'Sources and edition',
    chipHi: 'स्रोत',
    frame: 'border border-dharma-border bg-dharma-card/70',
    chipCls: 'border-dharma-border bg-dharma-bg text-dharma-text',
    Icon: BookOpen,
  },
};

const PERSPECTIVE_CONFIG: Record<
  PerspectiveMode,
  {
    label: string;
    labelHi: string;
    description: string;
    descriptionHi: string;
    Icon: typeof BookOpen;
  }
> = {
  beginner: {
    label: 'Beginner',
    labelHi: 'जिज्ञासु',
    description: 'Direct entry: original verse, clear literal translation, and accessible life takeaway.',
    descriptionHi: 'मूल श्लोक, सरल शब्दार्थ और जीवनोपयोगी सार।',
    Icon: GraduationCap,
  },
  student: {
    label: 'Student',
    labelHi: 'अध्येता',
    description: 'Linguistic study: word-by-word padas, grammatical roots (dhatus), and foundational concepts.',
    descriptionHi: 'पदच्छेद, धातु-प्रत्यय, व्याकरण और मूल दार्शनिक सिद्धांत।',
    Icon: BookOpen,
  },
  practitioner: {
    label: 'Practitioner',
    labelHi: 'साधक',
    description: 'Contemplative focus: practical reflection, avoiding common traps, and daily sadhana application.',
    descriptionHi: 'दैनिक आचरण, मानसिक समत्व और साधना का व्यावहारिक मार्ग।',
    Icon: Compass,
  },
  researcher: {
    label: 'Researcher',
    labelHi: 'शोधार्थी',
    description: 'Comparative apparatus: traditional commentaries, line alignment, meter, and textual provenance.',
    descriptionHi: 'परम्परागत भाष्यों की तुलना, छंद, संस्करण और ऐतिहासिक संदर्भ।',
    Icon: Microscope,
  },
};

/** Quiet corner brackets for the source verse only. Decorative: hidden from assistive tech and by the "hide decorative" setting. */
function CornerMarks() {
  const c = 'absolute h-3 w-3 border-amber-700/50 dark:border-amber-400/40';
  return (
    <span aria-hidden="true" data-decor="">
      <span className={`${c} left-2 top-2 border-l-2 border-t-2 rounded-tl-md`} />
      <span className={`${c} right-2 top-2 border-r-2 border-t-2 rounded-tr-md`} />
      <span className={`${c} bottom-2 left-2 border-b-2 border-l-2 rounded-bl-md`} />
      <span className={`${c} bottom-2 right-2 border-b-2 border-r-2 rounded-br-md`} />
    </span>
  );
}

function AiBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/40 bg-violet-100 px-2 py-0.5 text-[11px] font-semibold text-violet-950 dark:border-violet-400/40 dark:bg-violet-900/40 dark:text-violet-100">
      <Sparkles className="h-3 w-3" aria-hidden="true" />
      {children}
    </span>
  );
}

/**
 * One layer of the page. `collapsible` layers are native <details>: open in
 * the server HTML (so every reader and crawler gets the text), then closed on
 * phones after mount so a long verse page stays scannable.
 */
function Layer({
  id,
  kind,
  title,
  titleHi,
  badge,
  collapsible = false,
  children,
}: {
  id: string;
  kind: Kind;
  title: string;
  titleHi?: string;
  badge?: ReactNode;
  collapsible?: boolean;
  children: ReactNode;
}) {
  const k = KINDS[kind];
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (collapsible && ref.current && window.matchMedia('(max-width: 639px)').matches) ref.current.open = false;
  }, [collapsible]);

  const head = (
    <>
      <span aria-hidden="true" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${k.chipCls}`}>
        <k.Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`inline-flex flex-wrap items-center gap-x-2 rounded-full border px-2.5 py-0.5 text-xs font-bold ${k.chipCls}`}>
          <span lang="hi" className="font-devanagari text-[0.8125rem] leading-snug">
            {k.chipHi}
          </span>
          <span aria-hidden="true" className="opacity-50">
            ·
          </span>
          <span>{k.chip}</span>
        </span>
        <span className="mt-1 block font-serif text-base font-bold text-dharma-text sm:text-lg">
          <span id={`${id}-title`}>{title}</span>
          {titleHi && (
            <span lang="hi" className="ml-2 font-devanagari text-[0.95rem] font-normal text-dharma-muted">
              {titleHi}
            </span>
          )}
        </span>
      </span>
      {badge}
    </>
  );

  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`relative rounded-2xl shadow-sm ${k.frame}`}>
      {kind === 'source' && <CornerMarks />}
      {collapsible ? (
        <details ref={ref} open className="group">
          <summary className="focus-ring flex min-h-[56px] cursor-pointer list-none items-center gap-3 rounded-2xl px-4 py-3 sm:px-6 [&::-webkit-details-marker]:hidden">
            {head}
            <ChevronDown className="h-5 w-5 shrink-0 text-dharma-muted transition group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="px-4 pb-5 sm:px-6">{children}</div>
        </details>
      ) : (
        <>
          <div className="flex items-center gap-3 px-4 pt-4 sm:px-6">{head}</div>
          <div className="px-4 pb-5 pt-3 sm:px-6">{children}</div>
        </>
      )}
    </section>
  );
}

/* ── Word-by-word ──────────────────────────────────────────────────── */

export { parseWordMeanings, type WordGloss } from '@/lib/word-gloss';

const dash = (s: string) => s.replace(/[\s|।॥0-9.]+$/, '');

/* ── The ten layers, in the required order ─────────────────────────── */

export function ReaderLayers({
  scriptureId,
  verse,
  chapterId,
  provenance: p,
  settings,
  onReport,
  onUpdateSetting,
}: {
  scriptureId: string;
  verse: ReaderVerseText;
  chapterId: number;
  provenance: ReaderProvenance;
  settings: ReaderSettings;
  onReport: () => void;
  onUpdateSetting?: <K extends keyof ReaderSettings>(key: K, value: ReaderSettings[K]) => void;
}) {
  const [activeLexiconEntry, setActiveLexiconEntry] = useState<SanskritLexiconEntry | null>(null);

  const sanskrit = cleanVerseField(verse.sanskrit);
  const lines = sanskrit ? verseLines(sanskrit) : [];
  const glosses = parseWordMeanings(verse.wordMeaning);
  const devLeading = DEVANAGARI_LEADING[settings.lineSpacing];
  const latinLeading = LATIN_LEADING[settings.lineSpacing];
  const tSize = TRANSLATION_SIZE[settings.translationSize];
  const aiCommentary = p.commentaryIsAi ? <AiBadge>AI-drafted · reviewed</AiBadge> : undefined;

  const perspective = settings.perspective || 'beginner';
  const perspCfg = PERSPECTIVE_CONFIG[perspective];

  const isQuick = settings.readerMode === 'quick';
  const isTraditional = settings.readerMode === 'traditional';
  const isDeep = settings.readerMode === 'deep' || isTraditional || perspective === 'researcher' || perspective === 'student';

  // Language preferences
  const showHindiTrans =
    settings.showHindi &&
    (settings.preferredLanguage === 'all' || settings.preferredLanguage === 'hindi' || isDeep);
  const showEnglishTrans =
    settings.showEnglish &&
    (settings.preferredLanguage === 'all' || settings.preferredLanguage === 'english' || isDeep);

  const handleInspectPada = (pada: string) => {
    const entry = findLexiconEntry(pada);
    if (entry) {
      setActiveLexiconEntry(entry);
    }
  };

  return (
    <article id={`verse-${verse.number}`} className="space-y-5" aria-label={`Verse ${verse.number}`}>
      {/* ── Perspective Switcher Bar ─────────────────────────────── */}
      {!settings.liteMode ? (
        <section
          aria-label="Perspective Switcher"
          className="rounded-2xl border border-dharma-border bg-dharma-card p-3.5 sm:p-4 shadow-xs"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-dharma-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                Perspective Switcher · अध्ययन दृष्टिकोण
              </span>
            </div>
            <span className="text-xs text-dharma-muted">
              Preserves original scripture. Adapts linguistic and contemplative depth.
            </span>
          </div>

          {/* 4 Perspective Tabs */}
          <div
            role="tablist"
            aria-label="Choose reading perspective"
            className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4"
          >
            {(
              [
                { id: 'beginner', label: 'Beginner', labelHi: 'जिज्ञासु', Icon: GraduationCap },
                { id: 'student', label: 'Student', labelHi: 'अध्येता', Icon: BookOpen },
                { id: 'practitioner', label: 'Practitioner', labelHi: 'साधक', Icon: Compass },
                { id: 'researcher', label: 'Researcher', labelHi: 'शोधार्थी', Icon: Microscope },
              ] as const
            ).map((m) => {
              const isActive = perspective === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onUpdateSetting?.('perspective', m.id)}
                  className={`focus-ring flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? 'border-saffron-600 bg-saffron-600 text-white shadow-xs'
                      : 'border-dharma-border bg-dharma-bg/80 text-dharma-muted hover:border-saffron-400 hover:text-dharma-text'
                  }`}
                >
                  <m.Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    <span lang="hi" className="font-devanagari">{m.labelHi}</span>
                    <span className="mx-1 opacity-60">·</span>
                    <span>{m.label}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Perspective Context Explainer */}
          <p className="mt-2.5 text-xs text-dharma-muted flex items-start gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-saffron-600 shrink-0 mt-0.5" />
            <span>
              <strong>{perspCfg.label} ({perspCfg.labelHi}):</strong> {perspCfg.description}{' '}
              <span lang="hi" className="font-devanagari">({perspCfg.descriptionHi})</span>
            </span>
          </p>
        </section>
      ) : (
        <div className="flex items-center justify-between rounded-xl border border-dharma-border/60 bg-dharma-card/50 px-3.5 py-2 text-xs text-dharma-muted">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span className="font-semibold text-dharma-text">विशुद्ध पाठ (Reading Lite Mode)</span>
            <span>· Distraction-free scripture focus</span>
          </div>
          <button
            type="button"
            onClick={() => onUpdateSetting?.('liteMode', false)}
            className="focus-ring inline-flex min-h-[44px] items-center rounded-lg px-3 font-semibold text-saffron-700 dark:text-saffron-400 hover:underline"
          >
            Exit Lite Mode
          </button>
        </div>
      )}

      {/* 1 · Original Sanskrit */}
      <Layer id="layer-sanskrit" kind="source" title="Original Sanskrit" titleHi="मूल संस्कृत">
        {lines.length > 0 ? (
          <>
          <p id="sanskrit-text" lang="sa" className={`text-center font-devanagari font-semibold text-dharma-text ${SANSKRIT_SIZE[settings.sanskritSize]} ${devLeading}`}>
            {lines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
            <span aria-hidden="true" className="mt-2 block text-[0.6em] font-bold text-amber-800 dark:text-amber-300">
              ॥ {toDevanagari(chapterId)}.{toDevanagari(verse.number)} ॥
            </span>
          </p>
          {!settings.liteMode && (
            <ExplainLine scriptureId={scriptureId} chapterId={chapterId} verseNumber={verse.number} lines={lines} scopeId="sanskrit-text" verseLabel={`${chapterId}.${verse.number}`} fullTranslation={cleanVerseField(verse.translation)} />
          )}
          </>
        ) : (
          <p className="text-center text-sm text-dharma-muted">The Sanskrit text is not available for this verse.</p>
        )}
      </Layer>

      {/* 2 · Roman transliteration (Shown in Simple and Deep modes) */}
      {!isQuick && settings.showTransliteration && verse.transliteration && (
        <Layer id="layer-transliteration" kind="aid" title="Roman transliteration" titleHi="लिप्यन्तरण (IAST)">
          <p lang="sa-Latn" className={`whitespace-pre-line font-serif italic text-dharma-text/90 ${tSize} ${latinLeading}`}>
            {dash(cleanVerseField(verse.transliteration))}
          </p>
        </Layer>
      )}

      {/* 3 · Pada / word-by-word (Deep mode or expanded aid in Simple mode) */}
      {!isQuick && !settings.liteMode && verse.wordMeaning && (
        <Layer
          id="layer-padas"
          kind="aid"
          title="Word by word (पदच्छेद व अन्वय)"
          titleHi="पदच्छेद"
          collapsible={!isTraditional && (perspective === 'beginner' || perspective === 'practitioner')}
        >
          <div className="mb-2.5 flex items-center justify-between text-xs text-dharma-muted">
            <span>Tap on highlighted terms to inspect classical root (धातु), grammatical case, and philosophical clarity:</span>
          </div>
          {glosses.length > 1 ? (
            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {glosses.map((g, i) => {
                const lexiconMatch = findLexiconEntry(g.pada);
                return (
                  <li
                    key={i}
                    className={`rounded-xl border p-2.5 transition ${
                      lexiconMatch
                        ? 'border-saffron-500/40 bg-saffron-50/20 dark:bg-saffron-950/20 hover:border-saffron-500'
                        : 'border-amber-700/20 bg-dharma-card/70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span lang="sa-Latn" className="font-serif text-sm font-bold italic text-amber-900 dark:text-amber-200">
                        {g.pada}
                      </span>
                      {lexiconMatch && (
                        <button
                          type="button"
                          onClick={() => handleInspectPada(g.pada)}
                          className="focus-ring inline-flex min-h-[30px] items-center gap-1 rounded-md border border-saffron-500/40 bg-saffron-100/70 dark:bg-saffron-900/40 px-2 py-0.5 text-[11px] font-bold text-saffron-800 dark:text-saffron-200 hover:border-saffron-600 transition"
                        >
                          <Search className="h-3 w-3" />
                          <span>धातु देखें</span>
                        </button>
                      )}
                    </div>
                    <p className={`mt-1 text-sm text-dharma-text ${latinLeading}`}>{g.meaning}</p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={`text-dharma-text ${tSize} ${latinLeading}`}>{verse.wordMeaning}</p>
          )}
        </Layer>
      )}

      {/* 4 · Hindi translation */}
      {showHindiTrans && verse.hindi && (
        <Layer
          id="layer-hindi"
          kind="translation"
          title="Literal Hindi Translation"
          titleHi="मूल हिन्दी अनुवाद (अक्षरशः)"
          badge={
            <span className="inline-flex items-center gap-1 rounded-full border border-saffron-500/40 bg-saffron-100/60 dark:bg-saffron-900/30 px-2.5 py-0.5 text-[11px] font-bold text-saffron-900 dark:text-saffron-200">
              मूलानुवाद · Literal
            </span>
          }
        >
          <p lang="hi" className={`whitespace-pre-line font-devanagari text-dharma-text ${tSize} ${devLeading}`}>
            {cleanVerseField(verse.hindi)}
          </p>
          <p className="mt-2 text-[11px] text-dharma-muted border-t border-dharma-border/50 pt-2">
            अक्षरशः अनुवाद — मूल संस्कृत श्लोक के प्रत्येक पद का प्रत्यक्ष अर्थ।
          </p>
        </Layer>
      )}

      {/* 5 · English translation */}
      {showEnglishTrans && verse.translation && (
        <Layer
          id="layer-english"
          kind="translation"
          title="Literal English Translation"
          badge={
            <span className="inline-flex items-center gap-1 rounded-full border border-saffron-500/40 bg-saffron-100/60 dark:bg-saffron-900/30 px-2.5 py-0.5 text-[11px] font-bold text-saffron-900 dark:text-saffron-200">
              Literal Text
            </span>
          }
        >
          <p lang="en" className={`font-serif text-dharma-text ${tSize} ${latinLeading}`}>
            {cleanVerseField(verse.translation)}
          </p>
          <p className="mt-2 text-[11px] text-dharma-muted border-t border-dharma-border/50 pt-2">
            Direct literal rendering preserving Sanskrit philosophical terminology.
          </p>
        </Layer>
      )}

      {/* 6 · Traditional commentary (Shown in Deep mode or collapsible in Simple) */}
      {!isQuick && !settings.liteMode && (
        <Layer
          id="layer-tradition"
          kind="tradition"
          title="Traditional Commentary (परम्परागत भाष्य)"
          titleHi="परम्परागत भाष्य"
          collapsible={!isTraditional && perspective !== 'researcher'}
        >
          <div className="rounded-xl border border-stone-300 bg-stone-50/70 dark:border-stone-700 dark:bg-stone-900/40 p-3.5 mb-3 text-xs text-stone-700 dark:text-stone-300">
            <p className="font-semibold text-stone-900 dark:text-stone-200">Pluralistic Tradition Neutrality (सम्प्रदाय-तटस्थता):</p>
            <p className="mt-1 leading-relaxed">
              Classical commentaries represent distinct philosophical darshanas (Advaita, Vishishtadvaita, Dvaita). Dharma Granth presents multiple traditional viewpoints without declaring any single tradition as universal or exclusive.
            </p>
          </div>
          <CommentaryCompare scriptureId={scriptureId} chapterId={chapterId} verse={verse} />
        </Layer>
      )}

      {/* 7 · Simple explanation */}
      {verse.explanation && (
        <Layer
          id="layer-explanation"
          kind="editorial"
          title={isQuick ? "Key Message" : "Simple Explanation (सरल व्याख्या)"}
          titleHi={isQuick ? "मुख्य संदेश" : "सरल व्याख्या"}
          badge={
            <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/40 bg-sky-100/70 dark:bg-sky-900/40 px-2.5 py-0.5 text-[11px] font-bold text-sky-900 dark:text-sky-200">
              Editorial Exposition · Not Scripture
            </span>
          }
          collapsible={false}
        >
          <p
            lang={/[ऀ-ॿ]/.test(verse.explanation) ? 'hi' : 'en'}
            className={`whitespace-pre-line text-dharma-text ${tSize} ${/[ऀ-ॿ]/.test(verse.explanation) ? devLeading : latinLeading} ${/[ऀ-ॿ]/.test(verse.explanation) ? 'font-devanagari' : 'font-serif'}`}
          >
            {verse.explanation}
          </p>
        </Layer>
      )}

      {/* 8 · Modern reflection / Practical action */}
      {!settings.liteMode && verse.reflection && (
        <Layer
          id="layer-reflection"
          kind="reflection"
          title={isQuick ? "Practical Action & Takeaway" : "Contemplative Reflection & Action"}
          titleHi={isQuick ? "दैनिक आचरण" : "आधुनिक चिंतन"}
          badge={aiCommentary}
          collapsible={perspective === 'researcher'}
        >
          <p
            lang={/[ऀ-ॿ]/.test(verse.reflection) ? 'hi' : 'en'}
            className={`whitespace-pre-line text-dharma-text ${tSize} ${/[ऀ-ॿ]/.test(verse.reflection) ? devLeading : latinLeading} ${/[ऀ-ॿ]/.test(verse.reflection) ? 'font-devanagari' : 'font-serif'}`}
          >
            {verse.reflection}
          </p>
        </Layer>
      )}

      {/* 9 · Research note (Deep or Simple modes) */}
      {!isQuick && !settings.liteMode && verse.research && (
        <Layer id="layer-research" kind="research" title="Comparative Research Note" titleHi="शोध टिप्पणी" badge={aiCommentary} collapsible={perspective !== 'researcher'}>
          <p
            lang={/[ऀ-ॿ]/.test(verse.research) ? 'hi' : 'en'}
            className={`whitespace-pre-line text-dharma-text ${tSize} ${/[ऀ-ॿ]/.test(verse.research) ? devLeading : latinLeading} ${/[ऀ-ॿ]/.test(verse.research) ? 'font-devanagari' : 'font-serif'}`}
          >
            {verse.research}
          </p>
          <p className="mt-3 text-xs text-dharma-muted">
            A modern parallel offered for reflection. It is not part of the scripture, and it has not been checked against the original
            sources it may allude to.
          </p>
        </Layer>
      )}

      {isDeep && !settings.liteMode && (
        <CompareViews scriptureId={scriptureId} chapterId={chapterId} verse={verse} provenance={p} />
      )}

      {/* 10 · Sources and edition details (Always accessible, collapsible) */}
      <Layer id="layer-sources" kind="sources" title="Sources and edition" titleHi="स्रोत एवं संस्करण" collapsible>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-dharma-muted">Sanskrit text</dt>
            <dd className="mt-0.5 text-dharma-text">
              {p.sourceHost ? (
                p.sourceUrl ? (
                  <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex min-h-[44px] items-center rounded font-medium underline underline-offset-4">
                    {p.sourceHost}
                  </a>
                ) : (
                  p.sourceHost
                )
              ) : (
                <span className="text-dharma-muted">Not recorded</span>
              )}
              {p.sourceFetched && <span className="text-dharma-muted"> · fetched {p.sourceFetched.slice(0, 10)}</span>}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-dharma-muted">Translations</dt>
            <dd className="mt-0.5 text-dharma-text">
              {[p.hindiIsAi ? 'Hindi: AI translation' : 'Hindi: not flagged as AI', p.englishIsAi ? 'English: AI translation' : 'English: not flagged as AI']
                .join(' · ')}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-dharma-muted">Explanation, reflection, research</dt>
            <dd className="mt-0.5 text-dharma-text">{p.commentaryIsAi ? 'AI-drafted and editor-reviewed' : 'Editorial text; no AI flag recorded'}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-dharma-muted">Last updated</dt>
            <dd className="mt-0.5 text-dharma-text">{p.lastUpdated ? p.lastUpdated.slice(0, 10) : <span className="text-dharma-muted">Not recorded</span>}</dd>
          </div>
          {p.sourceLicense && (
            <div className="sm:col-span-2">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-dharma-muted">Licence note (as recorded)</dt>
              <dd className="mt-0.5 text-dharma-muted">{p.sourceLicense}</dd>
            </div>
          )}
        </dl>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-dharma-muted">
          <p className="flex flex-wrap items-center gap-x-2">
            Found a mistake?{' '}
            <button type="button" onClick={onReport} className="focus-ring inline-flex min-h-[44px] items-center rounded font-semibold text-saffron-800 underline underline-offset-4 dark:text-saffron-300">
              Report a textual error
            </button>
          </p>
          <a
            href="#sources-interpretation-heading"
            className="focus-ring inline-flex min-h-[44px] items-center gap-1 font-semibold text-saffron-700 hover:text-saffron-800 dark:text-saffron-300 underline underline-offset-4"
          >
            <span>विस्तृत स्रोत एवं भाष्य वर्गीकरण</span>
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </Layer>

      {/* Sanskrit Word Explorer Modal/Drawer */}
      <SanskritWordExplorerDrawer
        entry={activeLexiconEntry}
        isOpen={activeLexiconEntry !== null}
        onClose={() => setActiveLexiconEntry(null)}
      />
    </article>
  );
}
