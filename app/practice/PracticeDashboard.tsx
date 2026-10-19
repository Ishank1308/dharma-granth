'use client';

import { useState } from 'react';
import { Lock, Settings2, Trash2, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { FadeUp } from '@/app/components/motion/primitives';
import { DailyVerse } from '@/app/components/DailyVerse';
import { DailyReflection } from '@/app/components/practice/DailyReflection';
import { ReadingPlan } from '@/app/components/practice/ReadingPlan';
import { JapaCounter } from '@/app/components/practice/JapaCounter';
import { MeditationTimer } from '@/app/components/practice/MeditationTimer';
import { PranayamaPacer } from '@/app/components/practice/PranayamaPacer';
import { FestivalReminder } from '@/app/components/practice/FestivalReminder';
import { SankalpaJournal } from '@/app/components/practice/SankalpaJournal';
import { GratitudeJournal } from '@/app/components/practice/GratitudeJournal';
import { RoutineBuilder } from '@/app/components/practice/RoutineBuilder';
import { PracticeHistory } from '@/app/components/practice/PracticeHistory';
import { PrivacyLockBanner } from '@/app/components/practice/PrivacyLockBanner';
import { BackupRestore } from '@/app/components/BackupRestore';
import { SadhanaPortability } from '@/app/components/SadhanaPortability';

/**
 * The redesigned daily practice (sādhanā) dashboard.
 *
 * Design commitments, deliberately:
 * - Peaceful, private daily spiritual practice sanctuary.
 * - Zero commercial, competitive, or productivity feel.
 * - Every tool is optional — users pick which ones appear, stored locally.
 * - Everything is private: localStorage only, optional PIN protection, zero tracking.
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

const ALL_ON: Record<ToolId, boolean> = {
  verse: true,
  reflection: true,
  reading: true,
  japa: true,
  meditation: true,
  pranayama: true,
  festivals: true,
  gratitude: true,
  sankalpa: true,
  routine: true,
  history: true,
};

export function PracticeDashboard() {
  const [enabled, setEnabled] = useLocalStorage<Record<ToolId, boolean>>(
    'dharma.practice.tools',
    ALL_ON,
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
              <span>100% निजी · सारा डेटा केवल आपके डिवाइस पर सहेजा जाता है (Zero public profiles, zero tracking)</span>
            </div>
          </FadeUp>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
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
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-dharma-muted mb-3">
                <Settings2 className="w-3.5 h-3.5 text-saffron-600" />
                <span>अपने साधन चुनें · choose your tools</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {TOOLS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggle(t.id)}
                    aria-pressed={on(t.id)}
                    className={`practice-tool-chip px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                      on(t.id)
                        ? 'practice-tool-chip-on bg-saffron-100 dark:bg-saffron-950/40 border-saffron-300 dark:border-saffron-800 text-saffron-800 dark:text-saffron-200 shadow-xs'
                        : 'border-dharma-border text-dharma-muted hover:border-saffron-200 dark:hover:border-saffron-800/60'
                    }`}
                  >
                    <span lang="hi" className="font-devanagari">{t.label}</span>
                    <span> · {t.sub}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Daily verse — full width */}
            {on('verse') && <DailyVerse />}

            {/* Tool grid */}
            <div className="grid md:grid-cols-2 gap-6 items-stretch">
              {on('reflection') && <DailyReflection />}
              {on('japa') && <JapaCounter />}
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
          <SadhanaPortability />
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
          साधना आत्मा का एकांत है — this page keeps no score, no rankings, and shares nothing. Clearing your browser data erases it completely.
        </p>
      </div>
    </main>
  );
}
