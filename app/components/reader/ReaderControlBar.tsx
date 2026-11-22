'use client';

/**
 * The verse reader's perspective row (who is reading: beginner, student, practitioner,
 * researcher), with one line saying what the chosen perspective adds. Plain toggle buttons
 * (aria-pressed) because they change a setting, not a panel. It steps aside in Lite mode.
 *
 * Reading depth used to sit here as four verse-only levels (Quick, Simple, Deep, Traditional).
 * It is now the one Read / Understand / Study switch shared with chapter pages
 * (ReadingDepthSwitch, lib/reading-depth); VERSE_DEPTH_HINTS says what each step shows here.
 */

import { BookOpen, Compass, GraduationCap, Microscope } from 'lucide-react';
import type { PerspectiveMode, ReaderModeTier, ReaderSettings } from '@/lib/useReaderSettings';
import { triggerTactileFeedback } from '@/lib/haptics';

/** What the verse page shows at each depth (its readerMode views). */
export const VERSE_DEPTH_HINTS: Record<ReaderModeTier, { en: string; hi: string }> = {
  quick: { en: 'The key message and a practical takeaway', hi: 'सार व व्यावहारिक प्रयोग' },
  simple: { en: 'A simple explanation and its meaning for life', hi: 'सुबोध अर्थ व जीवन में प्रासंगिकता' },
  deep: { en: 'Word by word, commentary and context', hi: 'पदच्छेद, भाष्य व संदर्भ' },
  traditional: { en: 'Text, word by word, prose order and classical commentary', hi: 'मूल, पदच्छेद, अन्वय व प्रामाणिक भाष्य' },
};

const PERSPECTIVES: Array<{ id: PerspectiveMode; hi: string; en: string; hint: string; Icon: typeof BookOpen }> = [
  { id: 'beginner', hi: 'जिज्ञासु', en: 'Beginner', hint: 'सरल अर्थ और जीवनोपयोगी सार', Icon: GraduationCap },
  { id: 'student', hi: 'अध्येता', en: 'Student', hint: 'पदच्छेद, व्याकरण और मूल सिद्धांत', Icon: BookOpen },
  { id: 'practitioner', hi: 'साधक', en: 'Practitioner', hint: 'दैनिक आचरण और साधना', Icon: Compass },
  { id: 'researcher', hi: 'शोधार्थी', en: 'Researcher', hint: 'भाष्य-तुलना, छंद और संस्करण', Icon: Microscope },
];

const segment = (active: boolean) =>
  `focus-ring inline-flex min-h-[44px] sm:min-h-[38px] flex-1 items-center justify-center gap-1 sm:gap-1.5 rounded-pill px-2 sm:px-3 py-1.5 text-xs transition-all duration-fast select-none sm:flex-none ${
    active
      ? 'bg-surface-elevated text-label-primary font-semibold shadow-xs ring-1 ring-black/5 dark:ring-white/10 scale-[1.01]'
      : 'text-label-secondary font-medium hover:text-label-primary hover:bg-fill-quaternary/60 active:scale-[0.98]'
  }`;

export function ReaderControlBar({
  settings,
  onChange,
}: {
  settings: ReaderSettings;
  onChange: (key: 'perspective', value: PerspectiveMode) => void;
}) {
  if (settings.liteMode) return null;
  const perspective = PERSPECTIVES.find((p) => p.id === settings.perspective) ?? PERSPECTIVES[0];

  return (
    <div
      className="rounded-card border border-separator/80 bg-surface-raised/95 backdrop-blur-md p-2.5 sm:p-3 shadow-xs transition-colors"
    >
      <div role="group" aria-label="Reading perspective · अध्ययन दृष्टि" className="flex items-center gap-1 rounded-pill bg-fill-tertiary p-1 border border-separator/40">
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

      {/* One line for what the chosen perspective adds */}
      <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-fill-quaternary/40 px-3 py-1.5 text-caption-1 text-label-secondary border border-separator/20">
        <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
        <p lang="hi" className="font-devanagari leading-snug">
          <span className="font-semibold text-label-primary">{perspective.hi}:</span> {perspective.hint}
        </p>
      </div>
    </div>
  );
}
