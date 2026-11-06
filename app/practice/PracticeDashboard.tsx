'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { retryImport } from '@/lib/retry-import';
import Link from 'next/link';
import { Lock, Settings2, Trash2, ShieldCheck, Heart, Sparkles, Bookmark, NotebookPen, LayoutDashboard, BarChart3, HardDriveDownload, BellRing } from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { FadeUp } from '@/app/components/motion/primitives';
const DailyVerse = dynamic(() => retryImport(() => import('@/app/components/DailyVerse').then((module) => module.DailyVerse)));
const SadhanaPlaylistStrip = dynamic(() => retryImport(() => import('@/app/components/SadhanaPlaylistStrip').then((module) => module.SadhanaPlaylistStrip)));
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
  { id: 'sadhana_chanting', label: 'नित्य संकलन', sub: 'Sadhana Chanting' },
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
  sadhana_chanting: true,
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
  { id: 'read', title: 'Read', titleHi: 'पठन', toolIds: ['verse', 'sadhana_chanting', 'reading'] },
  { id: 'pause', title: 'Pause', titleHi: 'विराम', toolIds: ['meditation', 'pranayama', 'japa'] },
  { id: 'reflect', title: 'Reflect', titleHi: 'मनन', toolIds: ['reflection', 'gratitude', 'sankalpa'] },
  { id: 'organize', title: 'Keep in view', titleHi: 'स्मरण', toolIds: ['festivals', 'routine', 'history'] },
];

const MY_SPACE = [
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
    <main className="min-h-screen bg-dharma-bg text-dharma-text">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#451a03] via-[#78350f] to-[#9a3412] text-white py-14 shadow-sm border-b border-amber-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeUp>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-200 mb-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>साधना · Daily Practice Sanctuary</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-3 tracking-tight">
              शांत मन, पवित्र अभ्यास
            </h1>
            <p className="text-base sm:text-lg opacity-90 max-w-2xl font-normal leading-relaxed text-amber-100/90">
              दैनिक श्लोक, आत्म-चिंतन, जप माला, ध्यान और व्यक्तिगत डायरी का एक सुरक्षित, एकांत आध्यात्मिक स्थल।
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-xs sm:text-sm bg-white/10 border border-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
              <Lock className="w-3.5 h-3.5 text-amber-200" />
              <span>स्थानीय साधना · आपकी निजी प्रविष्टियाँ इसी उपकरण पर रहती हैं (Local practice, no public profiles)</span>
            </div>
          </FadeUp>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        {/* My space: everything personal lives under /practice/ (saved verses, desk, journal, progress, offline). */}
        <nav aria-label="मेरा स्थान · My space" className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {MY_SPACE.map(({ href, hi, en, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex min-h-[56px] items-center gap-2.5 rounded-xl border border-dharma-border bg-dharma-card px-3 py-2 shadow-sm transition hover:border-saffron-400"
            >
              <Icon className="h-4 w-4 shrink-0 text-saffron-600" aria-hidden="true" />
              <span className="min-w-0 leading-tight">
                <span lang="hi" className="block font-devanagari text-sm font-semibold text-dharma-text">{hi}</span>{' '}
                <span lang="en" className="block text-[11px] text-dharma-muted">{en}</span>
              </span>
            </Link>
          ))}
        </nav>

        {/* Privacy, PIN Lock & Backup Notification Banner */}
        <PrivacyLockBanner />

        {/* If PIN is set and dashboard is locked, hide private practices */}
        {pin && isLocked ? (
          <div className="p-8 text-center text-dharma-muted rounded-2xl border border-dashed border-dharma-border bg-dharma-card/50">
            <Lock className="w-8 h-8 mx-auto text-amber-600/60 mb-2" />
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
            <section aria-label="Choose your tools" className="rounded-2xl border border-dharma-border bg-dharma-card p-4 sm:p-5 shadow-sm">
              <div className="mb-4">
                <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-dharma-muted">
                  <Settings2 className="w-3.5 h-3.5 text-saffron-600" />
                  <span>Choose what appears here · यहाँ दिखने वाले साधन चुनें</span>
                </p>
                <p className="mt-1 text-xs leading-relaxed text-dharma-muted">
                  Start with a verse and reflection. Add or hide any tool; your choices stay on this device.
                  <span lang="hi" className="ml-1 font-devanagari">श्लोक और चिंतन से आरम्भ करें। साधन जोड़ें या छिपाएँ; आपका चयन इसी उपकरण पर सुरक्षित रहता है।</span>
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {TOOL_GROUPS.map((group) => (
                  <fieldset key={group.id} className="min-w-0 rounded-xl border border-dharma-border/70 bg-dharma-bg/40 p-3">
                    <legend className="px-1 text-xs font-semibold text-dharma-muted">
                      {group.title}<span lang="hi" className="ml-1.5 font-devanagari">· {group.titleHi}</span>
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
                            className={`practice-tool-chip inline-flex min-h-11 items-center rounded-xl border px-3 text-left text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2 ${
                              on(tool.id)
                                ? 'practice-tool-chip-on bg-saffron-100 dark:bg-saffron-950/40 border-saffron-300 dark:border-saffron-800 text-saffron-800 dark:text-saffron-200 shadow-xs'
                                : 'border-dharma-border text-dharma-muted hover:border-saffron-300 hover:text-dharma-text'
                            }`}
                          >
                            <span lang="hi" className="font-devanagari">{tool.label}</span>
                            <span className="ml-1 opacity-80">· {tool.sub}</span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>
            </section>

            {/* Daily verse — full width */}
            {on('verse') && <DailyVerse />}

            {/* Curated Sadhana Chanting Journeys */}
            {on('sadhana_chanting') && <SadhanaPlaylistStrip />}

            {/* Tool grid */}
            <div className="grid md:grid-cols-2 gap-6 items-stretch">
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
        <div className="border-t border-dharma-border/80 pt-8 space-y-4">
          <BackupRestore />
          <details className="rounded-2xl border border-dharma-border bg-dharma-card px-4">
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
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 dark:border-rose-900/50 bg-rose-50/80 dark:bg-rose-950/30 px-4 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 transition hover:bg-rose-100 dark:hover:bg-rose-900/40"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>साधना डेटा हटाएं (Reset Sadhana data)</span>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-dharma-muted pb-4">
          साधना आत्मा का एकांत है — no scores or rankings. Practice notes stay on this device; clearing browser data can erase them.
        </p>
      </div>
    </main>
  );
}
