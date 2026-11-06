'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Volume2,
  VolumeX,
  Share2,
  Radio,
  CheckCircle2,
  Target,
  Compass,
} from 'lucide-react';
import { FadeUp } from '@/app/components/motion/primitives';
import { PadaLine } from '@/app/components/PadaLine';
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
          className="daily-verse-card apple-card relative overflow-hidden"
          contentClassName="p-6 sm:p-9"
        >

          <div className="relative z-10 space-y-5">
            {/* Top Bar: Badge, Date & Audio Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-dharma-saffron">
                  <span>Verse of the day</span> <span aria-hidden="true">·</span>{' '}
                  <span lang="hi" className="font-devanagari">दैनिक श्लोक</span>
                </span>
                <span className="hidden text-[13px] text-dharma-muted sm:inline" suppressHydrationWarning>
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
                      : 'bg-dharma-text/[0.06] text-dharma-text hover:bg-dharma-text/[0.1]'
                  }`}
                  title="Listen to Sanskrit Recitation"
                >
                  {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isPlayingAudio ? 'रोकें · Pause' : 'सुनें · Listen'}</span>
                </button>

                <button
                  type="button"
                  onClick={toggleTanpura}
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                    isDroneOn
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-dharma-text/[0.06] text-dharma-text hover:bg-dharma-text/[0.1]'
                  }`}
                  title="Toggle Meditative Tanpura Acoustic Drone"
                >
                  <Radio className={`w-3.5 h-3.5 ${isDroneOn ? 'animate-pulse' : ''}`} />
                  <span className="hidden sm:inline">तानपुरा</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-dharma-text/[0.06] px-3 py-1 text-xs font-semibold text-dharma-text transition hover:bg-dharma-text/[0.1]"
                  title="Create 9:16 WhatsApp Status Card"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>साझा करें</span>
                </button>
              </div>
            </div>

            {/* Sacred Sanskrit Shloka */}
            <div className="space-y-2">
              <p
                lang="sa"
                className="shloka-text text-[22px] leading-[1.7] text-dharma-text sm:text-[34px]"
              >
                {wisdom.sanskrit.split('\n').map((line, i) => (
                  <span key={i} className="block">
                    <PadaLine line={line} />
                  </span>
                ))}
              </p>

              <p className="whitespace-pre-line text-[14px] italic text-dharma-muted">
                {wisdom.transliteration}
              </p>
            </div>


            {/* Translations */}
            <div className="space-y-1.5">
              <p className="text-[17px] leading-relaxed text-dharma-text sm:text-[19px]">
                {wisdom.translation}
              </p>
              <p lang="hi" className="font-devanagari text-[16px] leading-relaxed text-dharma-text-secondary">
                {wisdom.hindi}
              </p>
            </div>

            {/* Practical Wisdom & Reflection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {/* Life Application */}
              <div className="space-y-1 rounded-[14px] bg-dharma-text/[0.04] p-4">
                <p className="flex items-center gap-1 text-[13px] font-semibold text-dharma-text">
                  <Compass className="w-3 h-3" />
                  <span>जीवन में प्रयोग · Practical Application</span>
                </p>
                <p className="text-[14px] leading-relaxed text-dharma-text-secondary">
                  {toAsciiDigits(wisdom.practicalTeaching)}
                </p>
              </div>

              {/* Reflection Prompt */}
              <div className="space-y-1 rounded-[14px] bg-dharma-text/[0.04] p-4">
                <p className="flex items-center gap-1 text-[13px] font-semibold text-dharma-text">
                  <Target className="w-3 h-3" />
                  <span>आज का आत्म-चिंतन · Reflection Prompt</span>
                </p>
                <p className="text-[14px] leading-relaxed text-dharma-text-secondary">
                  {toAsciiDigits(wisdom.reflectionPrompt)}
                </p>
              </div>
            </div>

            {/* Daily Sadhana Challenge Strip */}
            <div className="flex flex-col justify-between gap-3 rounded-[14px] bg-dharma-text/[0.04] p-4 sm:flex-row sm:items-center">
              <div className="space-y-0.5">
                <span className="text-[13px] font-semibold text-dharma-text">
                  <span>One step today</span> <span lang="hi" className="font-devanagari font-normal text-dharma-muted">आज का संकल्प</span>
                </span>
                <p lang="hi" className="font-devanagari text-[14px] text-dharma-text">
                  {toAsciiDigits(wisdom.dailyChallengeHi)}
                </p>
                <p className="text-[13px] text-dharma-text-secondary">
                  {toAsciiDigits(wisdom.dailyChallenge)}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCompleteChallenge}
                disabled={isCompletedToday}
                className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 self-start rounded-full px-4 text-[14px] transition sm:self-center ${
                  isCompletedToday
                    ? 'cursor-default text-emerald-700 dark:text-emerald-400'
                    : 'bg-dharma-text/[0.06] text-dharma-text hover:bg-dharma-text/[0.1]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isCompletedToday ? 'पूर्ण हुआ' : 'पूर्ण करें'}</span>
              </button>
            </div>

            <DailyNote id={wisdom.id} />

            {/* Bottom Citation & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-dharma-text/10 pt-4">
              <span className="text-[13px] text-dharma-muted">
                {wisdom.scriptureTitle} ({wisdom.scriptureTitleSanskrit}) • Chapter {wisdom.chapterId} • Verse {wisdom.verseId}
              </span>

              <div className="flex items-center gap-2">
                <Link
                  href="/daily"
                  className="tap-target inline-flex items-center gap-1 text-[14px] text-dharma-saffron hover:underline"
                >
                  <span>Daily hub</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <MagneticButton
                  href={wisdom.href}
                  className="apple-pill"
                  strength={12}
                  tilt={6}
                >
                  <span>Read the verse</span>
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
        className="mt-1 w-full rounded-[12px] border-0 bg-dharma-text/[0.06] p-3 text-[15px] text-dharma-text"
      />
      <span lang="hi" className="mt-1 block text-xs text-dharma-text-secondary">यह टिप्पणी इसी ब्राउज़र में रहती है।</span>
    </label>
  );
}
