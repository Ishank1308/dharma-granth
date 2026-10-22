'use client';

/**
 * One compact control row for the verse reader: reading depth (readerMode)
 * and reading perspective, side by side on wide screens and stacked on
 * phones, with a single line saying what the current pair means. Both are
 * plain toggle buttons (aria-pressed) because they change settings, not
 * panels. The perspective group steps aside in Lite mode, as before.
 */

import { BookOpen, Compass, GraduationCap, Microscope } from 'lucide-react';
import type { PerspectiveMode, ReaderModeTier, ReaderSettings } from '@/lib/useReaderSettings';

const MODES: Array<{ id: ReaderModeTier; hi: string; en: string; hint: string }> = [
  { id: 'quick', hi: 'त्वरित', en: 'Quick', hint: 'सार व व्यावहारिक प्रयोग' },
  { id: 'simple', hi: 'सरल', en: 'Simple', hint: 'सुबोध अर्थ व जीवन में प्रासंगिकता' },
  { id: 'deep', hi: 'गहन', en: 'Deep', hint: 'पदच्छेद, भाष्य व संदर्भ' },
  { id: 'traditional', hi: 'शास्त्रीय', en: 'Traditional', hint: 'मूल, पदच्छेद, अन्वय व प्रामाणिक भाष्य' },
];

const PERSPECTIVES: Array<{ id: PerspectiveMode; hi: string; en: string; hint: string; Icon: typeof BookOpen }> = [
  { id: 'beginner', hi: 'जिज्ञासु', en: 'Beginner', hint: 'सरल अर्थ और जीवनोपयोगी सार', Icon: GraduationCap },
  { id: 'student', hi: 'अध्येता', en: 'Student', hint: 'पदच्छेद, व्याकरण और मूल सिद्धांत', Icon: BookOpen },
  { id: 'practitioner', hi: 'साधक', en: 'Practitioner', hint: 'दैनिक आचरण और साधना', Icon: Compass },
  { id: 'researcher', hi: 'शोधार्थी', en: 'Researcher', hint: 'भाष्य-तुलना, छंद और संस्करण', Icon: Microscope },
];

const segment = (active: boolean) =>
  `focus-ring inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition sm:flex-none ${
    active ? 'bg-saffron-600 text-white shadow-sm' : 'text-dharma-muted hover:bg-dharma-bg/80 hover:text-dharma-text'
  }`;

export function ReaderControlBar({
  settings,
  onChange,
}: {
  settings: ReaderSettings;
  onChange: <K extends 'readerMode' | 'perspective'>(key: K, value: ReaderSettings[K]) => void;
}) {
  const mode = MODES.find((m) => m.id === settings.readerMode) ?? MODES[1];
  const perspective = PERSPECTIVES.find((p) => p.id === settings.perspective) ?? PERSPECTIVES[0];
  const showPerspective = !settings.liteMode;

  return (
    <section
      aria-label="Reading controls · पठन नियंत्रण"
      className="rounded-2xl border border-dharma-border bg-dharma-card/70 p-2 shadow-sm"
    >
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Reading depth · पठन गहराई" className="flex items-center gap-1">
          <span lang="hi" className="hidden shrink-0 px-1.5 font-devanagari text-[11px] font-bold text-saffron-800 dark:text-saffron-300 sm:inline">
            गहराई
          </span>
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={m.id === mode.id}
              title={`${m.en} · ${m.hint}`}
              onClick={() => onChange('readerMode', m.id)}
              className={segment(m.id === mode.id)}
            >
              <span lang="hi" className="font-devanagari">{m.hi}</span>
              <span className="hidden opacity-75 md:inline">{m.en}</span>
            </button>
          ))}
        </div>

        {showPerspective && (
          <div
            role="group"
            aria-label="Reading perspective · अध्ययन दृष्टि"
            className="flex items-center gap-1 border-t border-dharma-border/60 pt-2 lg:border-l lg:border-t-0 lg:pl-2 lg:pt-0"
          >
            <span lang="hi" className="hidden shrink-0 px-1.5 font-devanagari text-[11px] font-bold text-saffron-800 dark:text-saffron-300 sm:inline">
              दृष्टि
            </span>
            {PERSPECTIVES.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={p.id === perspective.id}
                aria-label={`${p.en} · ${p.hi}`}
                title={`${p.en} · ${p.hint}`}
                onClick={() => onChange('perspective', p.id)}
                className={segment(p.id === perspective.id)}
              >
                <p.Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span lang="hi" className="font-devanagari">{p.hi}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* One line for what the current pair means */}
      <p lang="hi" className="mt-1.5 px-1.5 font-devanagari text-[11px] leading-snug text-dharma-muted">
        {mode.hi}: {mode.hint}
        {showPerspective && (
          <>
            {' · '}
            {perspective.hi}: {perspective.hint}
          </>
        )}
      </p>
    </section>
  );
}
