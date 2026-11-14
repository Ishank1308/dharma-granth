'use client';

import dynamic from 'next/dynamic';
import { retryImport } from '@/lib/retry-import';
import Link from 'next/link';
import { PageHeader } from '@/app/components/apple/PageHeader';
import { Lock, Trash2, Bookmark, NotebookPen, ScrollText } from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';

const DailyVerse = dynamic(() => retryImport(() => import('@/app/components/DailyVerse').then((m) => m.DailyVerse)));
const DailyReflection = dynamic(() => retryImport(() => import('@/app/components/practice/DailyReflection').then((m) => m.DailyReflection)));
const ReadingPlan = dynamic(() => retryImport(() => import('@/app/components/practice/ReadingPlan').then((m) => m.ReadingPlan)));
const JapaMala = dynamic(() => retryImport(() => import('@/app/components/practice/JapaMala').then((m) => m.JapaMala)));
const MeditationTimer = dynamic(() => retryImport(() => import('@/app/components/practice/MeditationTimer').then((m) => m.MeditationTimer)));
const PranayamaPacer = dynamic(() => retryImport(() => import('@/app/components/practice/PranayamaPacer').then((m) => m.PranayamaPacer)));
const PrivacyLockBanner = dynamic(() => retryImport(() => import('@/app/components/practice/PrivacyLockBanner').then((m) => m.PrivacyLockBanner)));
const BackupRestore = dynamic(() => retryImport(() => import('@/app/components/BackupRestore').then((m) => m.BackupRestore)));

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

const MY_SPACE = [
  { href: '/practice/gita-sankalpa/', hi: 'गीता संकल्प', en: 'Gita Sankalpa', Icon: ScrollText },
  { href: '/practice/bookmarks/', hi: 'सुरक्षित श्लोक', en: 'Saved verses', Icon: Bookmark },
  { href: '/practice/journal/', hi: 'स्वाध्याय डायरी', en: 'Journal', Icon: NotebookPen },
];

export function PracticeDashboard() {
  const [enabled, setEnabled] = useLocalStorage<Record<ToolId, boolean>>(
    'dharma.practice.tools',
    DEFAULT_ENABLED,
  );
  const [pin] = useLocalStorage<string | null>('dharma.practice.pin', null);
  const [isLocked] = useLocalStorage<boolean>('dharma.practice.is_locked', false);

  function toggle(id: ToolId) {
    setEnabled({ ...enabled, [id]: !enabled[id] });
  }

  const on = (id: ToolId) => enabled[id] !== false;

  function handleDeleteAllData() {
    if (
      window.confirm(
        'क्या आप साधना का सारा निजी डेटा (जप, ध्यान, संकल्प, डायरी) हटाना चाहते हैं?\n\nAre you sure you want to delete all local Sadhana data from this browser? This action cannot be undone.',
      )
    ) {
      const keysToDelete = [
        'dharma.practice.tools',
        'dharma.practice.japa',
        'dharma.practice.japa.sound',
        'dharma.practice.japa.vibration',
        'dharma.practice.meditation',
        'dharma.practice.meditation.sound',
        'dharma.practice.pranayama',
        'dharma.practice.pranayama.vibration',
        'dharma.practice.reflections',
        'dharma.practice.sankalpa',
        'dharma.practice.pin',
        'dharma.practice.is_locked',
        'dharma.practice.last_backup',
        'dharma.japa.count',
        'dharma.japa.malas',
        'dharma.sankalpa',
        'dharma.reflection',
      ];
      keysToDelete.forEach((key) => {
        try {
          localStorage.removeItem(key);
        } catch {}
      });
      window.location.reload();
    }
  }

  return (
    <main className="apple-scope min-h-screen bg-dharma-bg pb-16 text-dharma-text">
      <PageHeader
        eyebrow="Sadhana"
        eyebrowHi="साधना"
        title="Daily practice"
        titleHi="शान्त मन, पवित्र अभ्यास"
        lead={
          <p>
            <span>108-bead japa counter, quiet meditation, sacred pranayama, and scripture reflection. Private on your device.</span>{' '}
            <span lang="hi" className="font-devanagari">108 मनका जप, शान्त ध्यान, प्राणायाम व दैनिक चिन्तन। पूर्णतः निजी व विज्ञापन-रहित।</span>
          </p>
        }
      >
        <p className="mt-3 inline-flex items-center gap-1.5 text-footnote text-dharma-muted">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Everything stays on this device. No account.</span>
        </p>
      </PageHeader>

      <div className="mx-auto max-w-content space-y-10 px-gutter pt-8">
        {/* Focused personal spaces: Gita Sankalpa, Saved Verses, and Journal */}
        <nav aria-label="Personal practice spaces" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {MY_SPACE.map(({ href, hi, en, Icon }) => (
            <Link
              key={href}
              href={href}
              className="apple-card flex min-h-[60px] items-center gap-3 px-4 py-3"
            >
              <span className="apple-tint-chip" aria-hidden="true">
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block text-subhead font-semibold tracking-[-0.01em] text-dharma-text">{en}</span>{' '}
                <span lang="hi" className="block font-devanagari text-footnote text-dharma-muted">{hi}</span>
              </span>
            </Link>
          ))}
        </nav>

        {/* Privacy, PIN Lock & Backup Notification Banner */}
        <PrivacyLockBanner />

        {/* If PIN is set and dashboard is locked, hide private practices */}
        {pin && isLocked ? (
          <div className="apple-card p-8 text-center text-dharma-muted">
            <Lock className="mx-auto mb-2 h-8 w-8 text-dharma-muted" />
            <p className="text-sm font-semibold text-dharma-text">
              निजी अभ्यास व डायरी पिन द्वारा सुरक्षित हैं
            </p>
            <p className="text-xs text-dharma-muted mt-1">
              उपरोक्त अनलॉक बॉक्स में पिन दर्ज करके अपनी साधना का अवलोकन करें।
            </p>
          </div>
        ) : (
          <>
            {/* Streamlined Tool Picker */}
            <section aria-labelledby="practice-tools-heading">
              <h2 id="practice-tools-heading" className="text-title-2 font-semibold text-dharma-text">
                <span>Core practices</span>{' '}
                <span lang="hi" className="ml-1 font-devanagari text-base font-normal tracking-normal text-dharma-muted sm:text-[20px]">दैनिक साधन</span>
              </h2>
              <p className="mt-1 text-subhead text-dharma-muted">
                <span>Choose which practices to keep active. Stays on this device.</span>{' '}
                <span lang="hi" className="font-devanagari">आवश्यकतानुसार साधन सक्रिय करें।</span>
              </p>
              <div className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {TOOL_GROUPS.map((group) => (
                  <fieldset key={group.id} className="min-w-0">
                    <legend className="mb-2 text-footnote text-dharma-muted">
                      <span>{group.title}</span> <span lang="hi" className="font-devanagari">· {group.titleHi}</span>
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
                              <span>{tool.sub}</span>{' '}
                              <span lang="hi" className="font-devanagari">{tool.label}</span>
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
            <h2 className="sr-only">साधन · Practice tools</h2>

            {/* Daily verse (if enabled) */}
            {on('verse') && <DailyVerse />}

            {/* Core Practice Grid: Japa, Meditation, Pranayama, Reflection, Reading */}
            <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2">
              {on('japa') && <JapaMala />}
              {on('meditation') && <MeditationTimer />}
              {on('pranayama') && <PranayamaPacer />}
              {on('reflection') && <DailyReflection />}
              {on('reading') && <ReadingPlan />}
            </div>
          </>
        )}

        {/* Private Backup, Restore & Clear Controls */}
        <div className="space-y-4 border-t border-dharma-text/10 pt-8">
          <BackupRestore />
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleDeleteAllData}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-[14px] text-rose-700 transition hover:bg-rose-500/10 dark:text-rose-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Reset Sadhana data</span>{' '}
              <span lang="hi" className="font-devanagari">साधना डेटा हटाएँ</span>
            </button>
          </div>
        </div>

        <p className="pb-4 text-center text-footnote text-dharma-muted">
          <span lang="hi" className="font-devanagari">साधना आत्मा का एकान्त है।</span>{' '}
          <span>Practice notes stay on this device; clearing browser data can erase them.</span>
        </p>
      </div>
    </main>
  );
}
