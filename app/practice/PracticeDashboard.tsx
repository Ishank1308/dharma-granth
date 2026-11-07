'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { retryImport } from '@/lib/retry-import';
import Link from 'next/link';
import { PageHeader } from '@/app/components/apple/PageHeader';
import { Lock, Trash2, Bookmark, NotebookPen, LayoutDashboard, BarChart3, HardDriveDownload, BellRing, ScrollText } from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
const DailyVerse = dynamic(() => retryImport(() => import('@/app/components/DailyVerse').then((module) => module.DailyVerse)));
const DailyReflection = dynamic(() => retryImport(() => import('@/app/components/practice/DailyReflection').then((module) => module.DailyReflection)));
const ReadingPlan = dynamic(() => retryImport(() => import('@/app/components/practice/ReadingPlan').then((module) => module.ReadingPlan)));
const JapaMala = dynamic(() => retryImport(() => import('@/app/components/practice/JapaMala').then((module) => module.JapaMala)));
const MeditationTimer = dynamic(() => retryImport(() => import('@/app/components/practice/MeditationTimer').then((module) => module.MeditationTimer)));
const PranayamaPacer = dynamic(() => retryImport(() => import('@/app/components/practice/PranayamaPacer').then((module) => module.PranayamaPacer)));
const FestivalReminder = dynamic(() => retryImport(() => import('@/app/components/practice/FestivalReminder').then((module) => module.FestivalReminder)));
const SankalpaJournal = dynamic(() => retryImport(() => import('@/app/components/practice/SankalpaJournal').then((module) => module.SankalpaJournal)));
const GratitudeJournal = dynamic(() => retryImport(() => import('@/app/components/practice/GratitudeJournal').then((module) => module.GratitudeJournal)));
const RoutineBuilder = dynamic(() => retryImport(() => import('@/app/components/practice/RoutineBuilder').then((module) => module.RoutineBuilder)));
const PracticeHistory = dynamic(() => retryImport(() => import('@/app/components/practice/PracticeHistory').then((module) => module.PracticeHistory)));
const PrivacyLockBanner = dynamic(() => retryImport(() => import('@/app/components/practice/PrivacyLockBanner').then((module) => module.PrivacyLockBanner)));
const BackupRestore = dynamic(() => retryImport(() => import('@/app/components/BackupRestore').then((module) => module.BackupRestore)));
const SadhanaPortability = dynamic(() => retryImport(() => import('@/app/components/SadhanaPortability').then((module) => module.SadhanaPortability)));

/**
 * The redesigned daily practice (sādhanā) dashboard.
 *
 * Design commitments, deliberately:
 * - Peaceful, private daily spiritual practice sanctuary.
 * - Zero commercial, competitive, or productivity feel.
 * - Every tool is optional — users pick which ones appear, stored locally.
 * - Practice notes stay in local storage with optional local PIN protection.
 */

const TOOLS = [
  { id: 'verse', label: 'दैनिक श्लोक', sub: 'Daily verse' },
  { id: 'reflection', label: 'दैनिक चिंतन', sub: 'Daily reflection' },
  { id: 'reading', label: 'पठन योजना', sub: 'Reading plan' },
  { id: 'japa', label: 'जप माला', sub: 'Japa counter' },
  { id: 'meditation', label: 'ध्यान साधना', sub: 'Meditation timer' },
  { id: 'pranayama', label: 'प्राणायाम', sub: 'Breath pacer' },
  { id: 'festivals', label: 'उत्सव स्मरण', sub: 'Festival reminders' },
  { id: 'gratitude', label: 'कृतज्ञता', sub: 'Gratitude journal' },
  { id: 'sankalpa', label: 'संकल्प', sub: 'Saṅkalpa journal' },
  { id: 'routine', label: 'मेरा क्रम', sub: 'My routine' },
  { id: 'history', label: 'साधना इतिहास', sub: 'Practice history' },
] as const;

type ToolId = (typeof TOOLS)[number]['id'];

const DEFAULT_ENABLED: Record<ToolId, boolean> = {
  verse: true,
  reflection: true,
  reading: true,
  japa: false,
  meditation: false,
  pranayama: false,
  festivals: false,
  gratitude: false,
  sankalpa: false,
  routine: false,
  history: false,
};

const TOOL_GROUPS: Array<{
  id: string;
  title: string;
  titleHi: string;
  toolIds: ToolId[];
}> = [
  { id: 'read', title: 'Read', titleHi: 'पठन', toolIds: ['verse', 'reading'] },
  { id: 'pause', title: 'Pause', titleHi: 'विराम', toolIds: ['meditation', 'pranayama', 'japa'] },
  { id: 'reflect', title: 'Reflect', titleHi: 'मनन', toolIds: ['reflection', 'gratitude', 'sankalpa'] },
  { id: 'organize', title: 'Keep in view', titleHi: 'स्मरण', toolIds: ['festivals', 'routine', 'history'] },
];

const MY_SPACE = [
  { href: '/practice/gita-sankalpa/', hi: 'गीता संकल्प', en: 'Gita Sankalpa', Icon: ScrollText },
  { href: '/practice/bookmarks/', hi: 'सुरक्षित श्लोक', en: 'Saved verses', Icon: Bookmark },
  { href: '/practice/desk/', hi: 'अध्ययन-पटल', en: 'Study desk', Icon: LayoutDashboard },
  { href: '/practice/journal/', hi: 'स्वाध्याय डायरी', en: 'Journal', Icon: NotebookPen },
  { href: '/practice/dashboard/', hi: 'पठन प्रगति', en: 'Reading progress', Icon: BarChart3 },
  { href: '/practice/saved/', hi: 'ऑफ़लाइन ग्रंथ', en: 'Offline texts', Icon: HardDriveDownload },
  { href: '/practice/desk/#reminders-h', hi: 'स्मरण', en: 'Calendar reminders', Icon: BellRing },
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
        'क्या आप साधना का सारा निजी डेटा (जप, ध्यान, संकल्प, डायरी, इतिहास) हटाना चाहते हैं?\n\nAre you sure you want to delete all local Sadhana data from this browser? This action cannot be undone.',
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
        'dharma.practice.gratitude',
        'dharma.practice.sankalpa',
        'dharma.practice.routine',
        'dharma.practice.routine.done',
        'dharma.practice.pin',
        'dharma.practice.is_locked',
        'dharma.practice.last_backup',
        'dharma.japa.count',
        'dharma.japa.malas',
        'dharma.sankalpa',
        'dharma.gratitude',
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
            <span>A verse, a reflection, japa and a quiet timer. Pick the tools you want; there are no scores and no streaks.</span>{' '}
            <span lang="hi" className="font-devanagari">दैनिक श्लोक, चिन्तन, जप और ध्यान, बिना किसी गिनती या होड़ के।</span>
          </p>
        }
      >
        <p className="mt-3 inline-flex items-center gap-1.5 text-footnote text-dharma-muted">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Everything stays on this device. No account.</span>
        </p>
      </PageHeader>

      <div className="mx-auto max-w-content space-y-10 px-gutter pt-8">
        {/* My space: everything personal lives under /practice/ (saved verses, desk, journal, progress, offline). */}
        <nav aria-label="My space" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {MY_SPACE.map(({ href, hi, en, Icon }) => (
            <Link
              key={href}
              href={href}
              className="apple-card flex min-h-[64px] items-center gap-3 px-4 py-3 transition hover:-translate-y-0.5"
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
            {/* Tool picker */}
            <section aria-labelledby="practice-tools-heading">
              <h2 id="practice-tools-heading" className="text-title-2 font-semibold text-dharma-text">
                <span>Your tools</span>{' '}
                <span lang="hi" className="ml-1 font-devanagari text-base font-normal tracking-normal text-dharma-muted sm:text-[20px]">साधन</span>
              </h2>
              <p className="mt-1 text-subhead text-dharma-muted">
                <span>Tap to show or hide a tool. Your choice stays on this device.</span>{' '}
                <span lang="hi" className="font-devanagari">साधन जोड़ें या छिपाएँ।</span>
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
                                ? 'practice-tool-chip-on bg-dharma-saffron text-dharma-bg'
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

            {/* Daily verse — full width */}
            {on('verse') && <DailyVerse />}

            {/* Tool grid */}
            <div className="grid items-stretch gap-5 md:grid-cols-2">
              {on('reflection') && <DailyReflection />}
              {on('japa') && <JapaMala />}
              {on('meditation') && <MeditationTimer />}
              {on('pranayama') && <PranayamaPacer />}
              {on('reading') && <ReadingPlan />}
              {on('festivals') && <FestivalReminder />}
              {on('gratitude') && <GratitudeJournal />}
              {on('sankalpa') && <SankalpaJournal />}
              {on('routine') && <RoutineBuilder />}
              {on('history') && <PracticeHistory />}
            </div>
          </>
        )}

        {/* Private Backup, Restore & Clear Controls */}
        <div className="space-y-4 border-t border-dharma-text/10 pt-8">
          <BackupRestore />
          <details className="apple-group px-4">
            <summary className="flex min-h-12 cursor-pointer items-center font-semibold text-sm text-dharma-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500">
              वैकल्पिक उपकरण-स्थानांतरण · Alternate compressed transfer options
            </summary>
            <p className="pb-2 text-xs leading-relaxed text-dharma-muted">
              The alternate sync code and .dharma file are compressed, not encrypted. Keep them private; use the JSON backup above for the standard export and restore flow.
              <span lang="hi" className="ml-1 font-devanagari">वैकल्पिक सिंक कोड और .dharma फ़ाइल संपीड़ित हैं, कूटबद्ध नहीं। इन्हें निजी रखें; सामान्य बैकअप के लिए ऊपर दिया JSON विकल्प उपयोग करें।</span>
            </p>
            <div className="pb-4"><SadhanaPortability /></div>
          </details>
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
