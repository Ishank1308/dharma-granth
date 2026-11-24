'use client';

import dynamic from 'next/dynamic';
import { retryImport } from '@/lib/retry-import';
import { PageHeader } from '@/app/components/apple/PageHeader';
import { PageCover } from '@/app/components/PagePhoto';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { PracticeOpening } from './PracticeOpening';
import { PracticeSubNav } from '@/app/components/practice/PracticeSubNav';
import { ObservanceNotice } from '@/app/components/puja/ObservanceNotice';

const TodayVerseCard = dynamic(() => retryImport(() => import('@/app/components/home/TodayVerseCard').then((m) => m.TodayVerseCard)));
const DailyReflection = dynamic(() => retryImport(() => import('@/app/components/practice/DailyReflection').then((m) => m.DailyReflection)));
const ReadingPlan = dynamic(() => retryImport(() => import('@/app/components/practice/ReadingPlan').then((m) => m.ReadingPlan)));
const JapaMala = dynamic(() => retryImport(() => import('@/app/components/practice/JapaMala').then((m) => m.JapaMala)));
const MeditationTimer = dynamic(() => retryImport(() => import('@/app/components/practice/MeditationTimer').then((m) => m.MeditationTimer)));
const PranayamaPacer = dynamic(() => retryImport(() => import('@/app/components/practice/PranayamaPacer').then((m) => m.PranayamaPacer)));
const GuidedSadhanaSessionWidget = dynamic(() =>
  retryImport(() => import('@/app/components/practice/GuidedSadhanaSessionWidget').then((m) => m.GuidedSadhanaSessionWidget)),
);

/**
 * Streamlined, calm daily spiritual practice (साधना) sanctuary:
 * - Pure 108 Japa Mala counter with bead feedback
 * - Quiet meditation timer
 * - Rhythmic pranayama breath pacer
 * - Daily contemplation & scripture reflection
 * - Private, local-first on this device with zero tracking
 */

const TOOLS = [
  { id: 'japa', label: 'जप माला', sub: '108 Japa counter' },
  { id: 'meditation', label: 'ध्यान साधना', sub: 'Meditation timer' },
  { id: 'pranayama', label: 'प्राणायाम', sub: 'Breath pacer' },
  { id: 'reflection', label: 'दैनिक चिन्तन', sub: 'Daily reflection' },
  { id: 'reading', label: 'पठन योजना', sub: 'Reading plan' },
  { id: 'verse', label: 'दैनिक श्लोक', sub: 'Daily verse' },
] as const;

type ToolId = (typeof TOOLS)[number]['id'];

const DEFAULT_ENABLED: Record<ToolId, boolean> = {
  japa: true,
  meditation: true,
  pranayama: true,
  reflection: true,
  reading: false,
  verse: false,
};

const TOOL_GROUPS: Array<{
  id: string;
  title: string;
  titleHi: string;
  toolIds: ToolId[];
}> = [
  { id: 'dhyana', title: 'Japa & Meditation', titleHi: 'जप, ध्यान व प्राण', toolIds: ['japa', 'meditation', 'pranayama'] },
  { id: 'svadhyaya', title: 'Svadhyaya & Contemplation', titleHi: 'स्वाध्याय व चिन्तन', toolIds: ['reflection', 'reading', 'verse'] },
];

export function PracticeDashboard() {
  const [enabled, setEnabled] = useLocalStorage<Record<ToolId, boolean>>(
    'dharma.practice.tools',
    DEFAULT_ENABLED,
  );

  function toggle(id: ToolId) {
    setEnabled({ ...enabled, [id]: !enabled[id] });
  }

  const on = (id: ToolId) => enabled[id] !== false;

  return (
    <main data-deva-labels className="apple-scope min-h-screen bg-dharma-bg pb-16 text-dharma-text">
      <PageHeader
        eyebrow="Sadhana"
        eyebrowHi="साधना"
        title="Daily practice"
        cover={<PageCover photo="dawn" />}
        titleHi="शान्त मन, पवित्र अभ्यास"
        lead={
          <p>
            <span data-bi="en">108-bead japa counter, quiet meditation, sacred pranayama, and scripture reflection.</span>{' '}
            <span lang="hi" data-bi="hi" className="font-devanagari">108 मनका जप, शान्त ध्यान, प्राणायाम व दैनिक चिन्तन।</span>
          </p>
        }
      >
      </PageHeader>

      <div className="mx-auto max-w-content space-y-10 px-gutter pt-8">
        <PracticeSubNav />
        <ObservanceNotice className="-mb-4" />
        {/* Today's sadhana, large, beside the reader's own spaces: Gita Sankalpa, Saved verses, Journal */}
        <nav aria-label="Today and your practice spaces">
          <PracticeOpening active={on} />
        </nav>

        <GuidedSadhanaSessionWidget />

        {/* If PIN is set and dashboard is locked, hide private practices */}
            {/* Streamlined Tool Picker */}
            <section aria-labelledby="practice-tools-heading">
              <h2 id="practice-tools-heading" className="text-title-2 font-semibold text-dharma-text">
                <span data-bi="en">Core practices</span>{' '}
                <span lang="hi" data-bi="hi" data-bi-lead className="ml-1 font-devanagari text-base font-normal tracking-normal text-dharma-muted sm:text-[20px]">दैनिक साधन</span>
              </h2>
              <p className="mt-1 text-subhead text-dharma-muted">
                <span data-bi="en">Choose which practices to keep active.</span>{' '}
                <span lang="hi" data-bi="hi" className="font-devanagari">आवश्यकतानुसार साधन सक्रिय करें।</span>
              </p>
              <div className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {TOOL_GROUPS.map((group) => (
                  <fieldset key={group.id} className="min-w-0">
                    <legend className="mb-2 text-footnote text-dharma-muted">
                      <span data-bi="en">{group.title}</span> <span data-bi="sep" aria-hidden="true">· </span><span lang="hi" data-bi="hi" className="font-devanagari">{group.titleHi}</span>
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {group.toolIds.map((toolId) => {
                        const tool = TOOLS.find((item) => item.id === toolId);
                        if (!tool) return null;
                        return (
                          <button
                            key={tool.id}
                            type="button"
                            onClick={() => toggle(tool.id)}
                            aria-pressed={on(tool.id)}
                            className={`practice-tool-chip inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-[14px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dharma-saffron focus-visible:ring-offset-2 ${
                              on(tool.id)
                                ? 'practice-tool-chip-on bg-dharma-saffron text-dharma-bg font-medium shadow-xs'
                                : 'bg-dharma-text/[0.06] text-dharma-text hover:bg-dharma-text/[0.1]'
                            }`}
                          >
                            <span>
                              <span data-bi="en">{tool.sub}</span>{' '}
                              <span lang="hi" data-bi="hi" className="font-devanagari">{tool.label}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>
            </section>

            {/* Parent heading for the tool cards' h3s. */}
            <h2 className="sr-only"><span lang="hi" data-bi="hi">साधन</span><span data-bi="sep"> · </span><span data-bi="en">Practice tools</span></h2>

            {/* Daily verse (if enabled) — unified with Homepage 3-step Sankalpa Bento */}
            {on('verse') && (
              <div id="practice-verse" className="scroll-mt-24">
                <TodayVerseCard />
              </div>
            )}

            {/* Core Practice Grid: Japa, Meditation, Pranayama, Reflection, Reading */}
            <div className="reveal-grid grid grid-cols-1 items-stretch gap-5 md:grid-cols-2">
              {/* Each tool sits in a named cell, so a row of today's tile above can jump to it. */}
              {on('japa') && <div id="practice-japa" className="grid min-w-0 scroll-mt-24"><JapaMala /></div>}
              {on('meditation') && <div id="practice-meditation" className="grid min-w-0 scroll-mt-24"><MeditationTimer /></div>}
              {on('pranayama') && <div id="practice-pranayama" className="grid min-w-0 scroll-mt-24"><PranayamaPacer /></div>}
              {on('reflection') && <div id="practice-reflection" className="grid min-w-0 scroll-mt-24"><DailyReflection /></div>}
              {on('reading') && <div id="practice-reading" className="grid min-w-0 scroll-mt-24"><ReadingPlan /></div>}
            </div>
      </div>
    </main>
  );
}
