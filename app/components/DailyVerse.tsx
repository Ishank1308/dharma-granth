'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Volume2,
  VolumeX,
  Share2,
  Radio,
  CheckCircle2,
  Target,
  Compass,
} from 'lucide-react';
import { FadeUp } from '@/app/components/motion/primitives';
import { Realistic3DCard } from '@/app/components/motion/Realistic3DCard';
import { MagneticButton } from '@/app/components/motion/MagneticButton';
import { getTodayWisdom, type DailyWisdomItem } from '@/data/daily-wisdom-engine';
import { toAsciiDigits } from '@/lib/verse-format';
import {
  startTanpuraDrone,
  stopTanpuraDrone,
} from '@/lib/sacred-audio';
import {
  startSoundscape,
  stopSoundscape,
  subscribeSoundscape,
  setCurrentVerseContext,
  type SoundscapeState,
} from '@/lib/sacred-soundscape';
import { hasRecordedVerseAudio } from '@/lib/verse-audio';
import { recordSadhanaActivity, useSadhanaStreak } from '@/lib/sadhana-streak';
import { istDate } from '@/lib/ist';
import { SacredShareModal } from '@/app/components/share/SacredShareModal';
import { SITE_URL } from '@/lib/jsonld';

export function DailyVerse() {
  const [wisdom, setWisdom] = useState<DailyWisdomItem | null>(null);
  const [dateStr, setDateStr] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isDroneOn, setIsDroneOn] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCompletedToday, setIsCompletedToday] = useState(false);
  const { streak } = useSadhanaStreak();

  useEffect(() => {
    const today = getTodayWisdom();
    setWisdom(today);
    setDateStr(
      new Intl.DateTimeFormat(navigator.language || 'en-IN', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }).format(new Date())
    );

    // Check if challenge completed today
    try {
      const todayKey = `dharma.daily.challenge.${today.id}.${istDate().iso}`;
      if (localStorage.getItem(todayKey)) {
        setIsCompletedToday(true);
      }
    } catch {}

    const unsub = subscribeSoundscape((st: SoundscapeState) => {
      setIsPlayingAudio(st.isPlaying && st.activeTrack === 'recitation');
    });

    return () => {
      unsub();
      stopSoundscape();
      stopTanpuraDrone();
    };
  }, []);

  const hasStudioAudio = wisdom
    ? hasRecordedVerseAudio(wisdom.scriptureId, wisdom.chapterId, wisdom.verseId)
    : false;

  if (!wisdom) return null;

  function toggleAudio() {
    if (!wisdom) return;
    if (isPlayingAudio) {
      stopSoundscape();
      setIsPlayingAudio(false);
    } else {
      setCurrentVerseContext(
        wisdom.sanskrit,
        `${wisdom.scriptureTitle} ${wisdom.chapterId}.${wisdom.verseId}`,
        wisdom.hindi,
        wisdom.translation,
        wisdom.scriptureId,
        wisdom.chapterId,
        wisdom.verseId
      );
      startSoundscape('recitation');
      setIsPlayingAudio(true);
    }
  }

  function toggleTanpura() {
    if (isDroneOn) {
      stopTanpuraDrone();
      setIsDroneOn(false);
    } else {
      const started = startTanpuraDrone(0.12);
      if (started) setIsDroneOn(true);
    }
  }

  function handleCompleteChallenge() {
    if (!wisdom || isCompletedToday) return;
    setIsCompletedToday(true);
    recordSadhanaActivity();
    try {
      const todayKey = `dharma.daily.challenge.${wisdom.id}.${new Date().toISOString().slice(0, 10)}`;
      localStorage.setItem(todayKey, 'true');
    } catch {}
  }

  return (
    <>
      <FadeUp>
        <Realistic3DCard
          maxTilt={6}
          depth={20}
          glareIntensity={0.2}
          className="daily-verse-card relative overflow-hidden rounded-3xl border border-saffron-300/60 dark:border-saffron-900/40 bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-saffron-100/40 dark:from-stone-900 dark:via-stone-900/90 dark:to-amber-950/20 shadow-xl"
          contentClassName="p-6 sm:p-9"
        >
          {/* Decorative mandala background watermark */}
          <div className="absolute inset-0 mandala-bg opacity-[0.04] dark:opacity-[0.02] pointer-events-none" />

          <div className="relative z-10 space-y-5">
            {/* Top Bar: Badge, Date & Audio Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-saffron-300/40 dark:border-stone-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/15 text-saffron-800 dark:text-saffron-300 text-xs font-bold uppercase tracking-wider border border-saffron-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-saffron-600 animate-spin-slow" />
                  <span>दैनिक धर्म सूत्र · Verse of the Day</span>
                </span>
                <span className="text-xs text-dharma-muted hidden sm:inline" suppressHydrationWarning>
                  {dateStr}
                </span>
              </div>

              {/* Audio Controls */}
              <div className="flex items-center gap-2">
                {hasStudioAudio && (
                  <span
                    className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider"
                    title="ElevenLabs उच्च गुणवत्ता ध्वनि · Studio Neural Recitation"
                  >
                    Studio
                  </span>
                )}
                <button
                  type="button"
                  onClick={toggleAudio}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition shadow-2xs ${
                    isPlayingAudio
                      ? 'bg-amber-600 text-white animate-pulse'
                      : 'border border-saffron-300 bg-white/80 dark:bg-stone-800 text-saffron-800 dark:text-saffron-200 hover:bg-saffron-50'
                  }`}
                  title={hasStudioAudio ? 'Listen to Studio Recitation with 432Hz Tanpura drone' : 'Listen to Sanskrit Recitation with Tanpura drone'}
                >
                  {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-saffron-600" />}
                  <span>{isPlayingAudio ? 'रोकें · Pause' : 'सुनें · Listen'}</span>
                </button>

                <button
                  type="button"
                  onClick={toggleTanpura}
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                    isDroneOn
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'border border-dharma-border bg-white/60 dark:bg-stone-800/60 text-dharma-muted hover:text-dharma-text'
                  }`}
                  title="Toggle Meditative Tanpura Acoustic Drone"
                >
                  <Radio className={`w-3.5 h-3.5 ${isDroneOn ? 'animate-pulse' : ''}`} />
                  <span className="hidden sm:inline">तानपुरा</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-saffron-300/80 bg-white/80 dark:bg-stone-800 px-3 py-1 text-xs font-semibold text-saffron-800 dark:text-saffron-200 hover:border-saffron-500 hover:bg-saffron-50 transition shadow-2xs"
                  title="Create 9:16 WhatsApp Status Card"
                >
                  <Share2 className="w-3.5 h-3.5 text-saffron-600" />
                  <span>साझा करें</span>
                </button>
              </div>
            </div>

            {/* Sacred Sanskrit Shloka on Apple Pranic Leaf */}
            <div className="verse-leaf apple-pranic-leaf relative rounded-2xl px-5 py-6 sm:px-8 sm:py-7 text-center">
              <span aria-hidden="true" className="verse-leaf-ornament left-3 top-2">❁</span>
              <span aria-hidden="true" className="verse-leaf-ornament right-3 top-2">❁</span>
              <p
                lang="sa"
                className="font-devanagari text-2xl sm:text-3xl md:text-4xl text-saffron-900 dark:text-saffron-100 font-bold leading-relaxed sm:leading-[1.8] drop-shadow-xs whitespace-pre-line"
              >
                {wisdom.sanskrit}
              </p>

              <p className="mt-3 text-xs sm:text-sm text-saffron-700/80 dark:text-saffron-300/80 font-serif italic whitespace-pre-line border-t border-amber-600/15 pt-3">
                {wisdom.transliteration}
              </p>
            </div>

            {/* ── 3 CANONICAL PILLARS: भावार्थ → व्याख्या → आधुनिक संदर्भ ── */}
            <div className="space-y-3.5 pt-1">
              {/* स्तम्भ १ : भावार्थ (Bhavartha) */}
              <div className="apple-pillar apple-pillar-bhavartha p-4.5 sm:p-5 shadow-2xs">
                <div className="mb-2.5 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-600 dark:bg-amber-400 animate-pulse" />
                    ॥ स्तम्भ १ : भावार्थ · Meaning ॥
                  </span>
                </div>
                <div className="space-y-1.5">
                  <p lang="hi" className="font-devanagari text-sm sm:text-base text-dharma-text font-medium leading-relaxed">
                    {wisdom.hindi}
                  </p>
                  <p className="font-serif text-xs sm:text-sm text-dharma-muted leading-relaxed">
                    {wisdom.translation}
                  </p>
                </div>
              </div>

              {/* स्तम्भ २ : व्याख्या (Vyakhya) */}
              <div className="apple-pillar apple-pillar-vyakhya p-4.5 sm:p-5 shadow-2xs">
                <div className="mb-2.5 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider bg-orange-500/20 text-orange-900 dark:text-orange-200 border border-orange-500/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-600 dark:bg-orange-400" />
                    ॥ स्तम्भ २ : व्याख्या · Exposition ॥
                  </span>
                </div>
                <div className="space-y-1.5">
                  <p lang="hi" className="font-devanagari text-xs sm:text-sm text-dharma-text leading-relaxed">
                    {toAsciiDigits(wisdom.practicalTeachingHi)}
                  </p>
                  <p className="font-serif text-xs sm:text-sm text-dharma-muted leading-relaxed">
                    {toAsciiDigits(wisdom.practicalTeaching)}
                  </p>
                </div>
              </div>

              {/* स्तम्भ ३ : आधुनिक संदर्भ (Modern Context) */}
              <div className="apple-pillar apple-pillar-modern p-4.5 sm:p-5 shadow-2xs">
                <div className="mb-2.5 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 border border-emerald-500/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                    ॥ स्तम्भ ३ : आधुनिक संदर्भ · Modern Context ॥
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {/* दैनिक जीवन सूत्र */}
                  <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3 space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      <span>दैनिक संकल्प · Daily Life Protocol</span>
                    </p>
                    <p lang="hi" className="font-devanagari text-xs text-dharma-text leading-relaxed font-medium">
                      {toAsciiDigits(wisdom.dailyChallengeHi)}
                    </p>
                    <p className="text-2xs text-dharma-muted">
                      {toAsciiDigits(wisdom.dailyChallenge)}
                    </p>
                  </div>

                  {/* आत्म-चिंतन प्रश्न */}
                  <div className="rounded-xl border border-sky-500/25 bg-sky-500/5 p-3 space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300 flex items-center gap-1">
                      <Compass className="w-3 h-3" />
                      <span>आत्म-चिंतन · Introspective Question</span>
                    </p>
                    <p lang="hi" className="font-devanagari text-xs text-dharma-text leading-relaxed font-medium">
                      {toAsciiDigits(wisdom.reflectionPromptHi)}
                    </p>
                    <p className="text-2xs text-dharma-muted">
                      {toAsciiDigits(wisdom.reflectionPrompt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Sadhana Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
              <div className="space-y-0.5">
                <span className="text-2xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  🎯 आज का साधना संकल्प (Sadhana Practice)
                </span>
                <p className="text-xs text-dharma-text">
                  Complete today&apos;s contemplation and anchor your mindfulness.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCompleteChallenge}
                disabled={isCompletedToday}
                className={`inline-flex items-center gap-1.5 self-start sm:self-center shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs ${
                  isCompletedToday
                    ? 'bg-emerald-800 text-white cursor-default'
                    : 'bg-emerald-800 hover:bg-emerald-700 text-white active:scale-95'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isCompletedToday ? 'पूर्ण हुआ' : 'पूर्ण करें'}</span>
              </button>
            </div>

            <DailyNote id={wisdom.id} />

            {/* Bottom Citation & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-saffron-300/40 dark:border-stone-800">
              <span className="text-xs font-bold text-saffron-800 dark:text-saffron-300 uppercase tracking-wider">
                {wisdom.scriptureTitle} ({wisdom.scriptureTitleSanskrit}) • Chapter {wisdom.chapterId} • Verse {wisdom.verseId}
              </span>

              <div className="flex items-center gap-2">
                <Link
                  href="/daily"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-dharma-muted hover:text-saffron-700 transition"
                >
                  <span>दैनिक धर्म यात्रा (Daily Hub)</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <MagneticButton
                  href={wisdom.href}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-saffron-600 to-amber-600 text-white text-xs font-bold shadow-md hover:from-saffron-700 hover:to-amber-700 transition"
                  strength={12}
                  tilt={6}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>श्लोक का संपूर्ण अध्ययन</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </MagneticButton>
              </div>
            </div>
          </div>
        </Realistic3DCard>
      </FadeUp>

      {/* Sacred Share Modal */}
      <SacredShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        data={{
          title: wisdom.scriptureTitle,
          reference: `${wisdom.scriptureTitle} ${wisdom.chapterId}.${wisdom.verseId}`,
          sanskrit: wisdom.sanskrit,
          transliteration: wisdom.transliteration,
          translation: wisdom.translation,
          hindi: wisdom.hindi,
          vyakhya: wisdom.translation,
          modernContext: wisdom.practicalTeachingHi || wisdom.practicalTeaching,
          quote: wisdom.practicalTeaching,
          url: typeof window !== 'undefined' ? `${window.location.origin}${wisdom.href}` : `${SITE_URL}${wisdom.href}`,
        }}
      />
    </>
  );
}

function DailyNote({ id }: { id: string }) {
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const day = new Date().toISOString().slice(0, 10);
    setDate(day);
    try {
      setNote(window.localStorage.getItem(`dharma.daily.note.${id}.${day}`) ?? '');
    } catch {
      setNote('');
    }
    setReady(true);
  }, [id]);

  if (!ready) return null;

  return (
    <label className="block text-sm text-dharma-text">
      <span lang="hi" className="font-devanagari font-semibold">आज की टिप्पणी</span>
      <textarea
        value={note}
        rows={3}
        onChange={(event) => {
          const value = event.target.value;
          setNote(value);
          try {
            window.localStorage.setItem(`dharma.daily.note.${id}.${date}`, value);
          } catch {
            /* this browser blocked storage */
          }
        }}
        className="mt-1 w-full rounded-xl border border-dharma-border bg-dharma-bg p-3 text-sm text-dharma-text"
      />
      <span lang="hi" className="mt-1 block text-xs text-dharma-text-secondary">यह टिप्पणी इसी ब्राउज़र में रहती है।</span>
    </label>
  );
}
