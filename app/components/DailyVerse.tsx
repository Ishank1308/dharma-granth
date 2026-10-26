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
  speakSanskritShloka,
  stopSanskritSpeech,
  isSpeakingSanskrit,
  startTanpuraDrone,
  stopTanpuraDrone,
  isTanpuraActive,
} from '@/lib/sacred-audio';
import { recordSadhanaActivity, useSadhanaStreak } from '@/lib/sadhana-streak';
import { istDate } from '@/lib/ist';
import { SacredShareModal } from '@/app/components/share/SacredShareModal';

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

    return () => {
      stopSanskritSpeech();
      stopTanpuraDrone();
    };
  }, []);

  if (!wisdom) return null;

  function toggleAudio() {
    if (!wisdom) return;
    if (isPlayingAudio) {
      stopSanskritSpeech();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakSanskritShloka(
        wisdom.sanskrit,
        0.85,
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
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
                <button
                  type="button"
                  onClick={toggleAudio}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition shadow-2xs ${
                    isPlayingAudio
                      ? 'bg-amber-600 text-white animate-pulse'
                      : 'border border-saffron-300 bg-white/80 dark:bg-stone-800 text-saffron-800 dark:text-saffron-200 hover:bg-saffron-50'
                  }`}
                  title="Listen to Sanskrit Recitation"
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

            {/* Sacred Sanskrit Shloka */}
            <div className="space-y-2">
              <p
                lang="sa"
                className="font-devanagari text-2xl sm:text-3xl md:text-4xl text-saffron-900 dark:text-saffron-100 font-bold leading-relaxed sm:leading-[1.8] drop-shadow-sm whitespace-pre-line"
              >
                {wisdom.sanskrit}
              </p>

              <p className="text-xs sm:text-sm text-saffron-700/80 dark:text-saffron-300/80 font-serif italic whitespace-pre-line">
                {wisdom.transliteration}
              </p>
            </div>

            <div className="w-16 h-0.5 bg-gradient-to-r from-saffron-500 to-transparent" />

            {/* Translations */}
            <div className="space-y-1.5">
              <p className="text-base sm:text-lg text-dharma-text font-serif leading-relaxed">
                {wisdom.translation}
              </p>
              <p lang="hi" className="text-xs sm:text-sm text-rose-900 dark:text-rose-300 font-devanagari font-medium leading-relaxed">
                {wisdom.hindi}
              </p>
            </div>

            {/* Practical Wisdom & Reflection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {/* Life Application */}
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3.5 space-y-1">
                <p className="text-2xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1">
                  <Compass className="w-3 h-3" />
                  <span>जीवन में प्रयोग · Practical Application</span>
                </p>
                <p className="text-xs text-dharma-text leading-relaxed">
                  {toAsciiDigits(wisdom.practicalTeaching)}
                </p>
              </div>

              {/* Reflection Prompt */}
              <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-3.5 space-y-1">
                <p className="text-2xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300 flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  <span>आज का आत्म-चिंतन · Reflection Prompt</span>
                </p>
                <p className="text-xs text-dharma-text leading-relaxed">
                  {toAsciiDigits(wisdom.reflectionPrompt)}
                </p>
              </div>
            </div>

            {/* Daily Sadhana Challenge Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
              <div className="space-y-0.5">
                <span className="text-2xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  🎯 आज का साधना संकल्प (Daily Challenge)
                </span>
                <p lang="hi" className="font-devanagari text-xs font-medium text-dharma-text">
                  {toAsciiDigits(wisdom.dailyChallengeHi)}
                </p>
                <p className="text-xs text-dharma-text-secondary">
                  {toAsciiDigits(wisdom.dailyChallenge)}
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
                  className="tap-target inline-flex items-center gap-1 text-xs font-semibold text-dharma-muted hover:text-saffron-700 transition"
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
          quote: wisdom.practicalTeaching,
          url: typeof window !== 'undefined' ? `${window.location.origin}${wisdom.href}` : `https://dharmagranth.dev${wisdom.href}`,
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
