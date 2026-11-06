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
import { triggerTactileFeedback } from '@/lib/haptics';

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
  `focus-ring inline-flex min-h-[36px] sm:min-h-[38px] flex-1 items-center justify-center gap-1.5 rounded-pill px-3 py-1.5 text-xs transition-all duration-fast select-none sm:flex-none ${
    active
      ? 'bg-surface-elevated text-label-primary font-semibold shadow-xs ring-1 ring-black/5 dark:ring-white/10 scale-[1.01]'
      : 'text-label-secondary font-medium hover:text-label-primary hover:bg-fill-quaternary/60 active:scale-[0.98]'
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
      className="rounded-card border border-separator/80 bg-surface-raised/95 backdrop-blur-md p-2.5 sm:p-3 shadow-xs transition-colors"
    >
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <span lang="hi" className="hidden shrink-0 font-devanagari text-caption-2 font-semibold uppercase tracking-wider text-label-secondary sm:inline pl-1">
            गहराई
          </span>
          <div role="group" aria-label="Reading depth · पठन गहराई" className="flex flex-1 items-center gap-1 rounded-pill bg-fill-tertiary p-1 border border-separator/40">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={m.id === mode.id}
                title={`${m.en} · ${m.hint}`}
                onClick={() => {
                  triggerTactileFeedback('selection', 'softTap');
                  onChange('readerMode', m.id);
                }}
                className={segment(m.id === mode.id)}
              >
                <span lang="hi" className="font-devanagari">{m.hi}</span>
                <span className="hidden text-[10px] uppercase tracking-wider opacity-75 md:inline">{m.en}</span>
              </button>
            ))}
          </div>
        </div>

        {showPerspective && (
          <div className="flex flex-1 items-center gap-2 border-t border-separator/40 pt-2 lg:border-l lg:border-t-0 lg:pl-3 lg:pt-0">
            <span lang="hi" className="hidden shrink-0 font-devanagari text-caption-2 font-semibold uppercase tracking-wider text-label-secondary sm:inline pl-1">
              दृष्टि
            </span>
            <div role="group" aria-label="Reading perspective · अध्ययन दृष्टि" className="flex flex-1 items-center gap-1 rounded-pill bg-fill-tertiary p-1 border border-separator/40">
              {PERSPECTIVES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={p.id === perspective.id}
                  aria-label={`${p.en} · ${p.hi}`}
                  title={`${p.en} · ${p.hint}`}
                  onClick={() => {
                    triggerTactileFeedback('selection', 'softTap');
                    onChange('perspective', p.id);
                  }}
                  className={segment(p.id === perspective.id)}
                >
                  <p.Icon className={`h-3.5 w-3.5 shrink-0 ${p.id === perspective.id ? 'text-accent' : 'opacity-70'}`} aria-hidden="true" />
                  <span lang="hi" className="font-devanagari">{p.hi}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* One line for what the current pair means */}
      <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-fill-quaternary/40 px-3 py-1.5 text-caption-1 text-label-secondary border border-separator/20">
        <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
        <p lang="hi" className="font-devanagari leading-snug">
          <span className="font-semibold text-label-primary">{mode.hi}:</span> {mode.hint}
          {showPerspective && (
            <>
              <span className="mx-1.5 opacity-40">|</span>
              <span className="font-semibold text-label-primary">{perspective.hi}:</span> {perspective.hint}
            </>
          )}
        </p>
      </div>
    </section>
  );
}
