'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, CalendarDays, Headphones, MessageCircle, Pause, Sparkles } from 'lucide-react';
import type { DailyWisdomItem } from '@/data/daily-wisdom-engine';
import { getTodayWisdom } from '@/data/daily-wisdom-engine';
import { readActiveStreak, useRecentChapters } from '@/lib/reading-history';
import { speakSanskritShloka, stopSanskritSpeech } from '@/lib/sacred-audio';
import { PanchangPreview } from '@/app/components/PanchangPreview';

function resumeHref(visit: NonNullable<ReturnType<typeof useRecentChapters>>[number]): string {
  return `/scripture/${visit.scriptureId}/chapter/${visit.chapterId}/${visit.verseId ? `#verse-${visit.verseId}` : ''}`;
}

function withTrailingSlash(href: string): string {
  const hashIndex = href.indexOf('#');
  const path = hashIndex < 0 ? href : href.slice(0, hashIndex);
  const hash = hashIndex < 0 ? '' : href.slice(hashIndex);
  return `${path.endsWith('/') ? path : `${path}/`}${hash}`;
}

export function HomeDiscoveryBento({ initialWisdom }: { initialWisdom: DailyWisdomItem }) {
  const [wisdom, setWisdom] = useState(initialWisdom);
  const [speaking, setSpeaking] = useState(false);
  const [streak, setStreak] = useState<number | null>(null);
  const visits = useRecentChapters();
  const latest = visits?.[0];

  useEffect(() => {
    setWisdom(getTodayWisdom());
    setStreak(readActiveStreak());
  }, []);

  function toggleAudio() {
    if (speaking) {
      stopSanskritSpeech();
      setSpeaking(false);
      return;
    }
    setSpeaking(speakSanskritShloka(wisdom.sanskrit, 0.85, () => setSpeaking(false), () => setSpeaking(false)));
  }

  return (
    <section aria-labelledby="home-discovery-heading" className="border-b border-dharma-border bg-dharma-bg py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-saffron-700 dark:text-saffron-400">
              <span lang="hi">आज का पठन</span><span aria-hidden="true"> · </span><span>A quiet place to begin</span>
            </p>
            <h2 id="home-discovery-heading" className="mt-1 font-serif text-2xl font-bold text-dharma-text sm:text-3xl">
              Begin with what speaks to you
            </h2>
          </div>
          <Link href="/scriptures/" className="hidden items-center gap-1 text-sm font-semibold text-saffron-700 hover:text-saffron-800 dark:text-saffron-300 sm:inline-flex">
            Browse library <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
          <article className="editorial-bento-card manuscript-surface min-h-[240px] p-5 sm:p-6 lg:col-span-7">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span lang="hi">दैनिक श्लोक</span><span aria-hidden="true"> · </span><span>Daily shloka</span>
              </div>
              <button type="button" onClick={toggleAudio} aria-pressed={speaking} aria-label={speaking ? 'Stop Sanskrit audio' : 'Listen to Sanskrit verse'} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-dharma-border bg-dharma-card text-dharma-muted transition hover:border-saffron-400 hover:text-saffron-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron-600">
                {speaking ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Headphones className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
            <p lang="sa" className="mt-4 whitespace-pre-line font-devanagari text-lg font-semibold leading-relaxed text-dharma-text sm:text-xl">{wisdom.sanskrit}</p>
            <p lang="hi" className="mt-2 line-clamp-2 text-sm leading-relaxed text-dharma-muted">{wisdom.hindi}</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-dharma-border/70 pt-3">
              <span className="text-xs text-dharma-muted">{wisdom.scriptureTitle} · {wisdom.chapterId}.{wisdom.verseId}</span>
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `🌸 आज का श्लोक — ${wisdom.scriptureTitle} ${wisdom.chapterId}.${wisdom.verseId} 🌸\n\n${wisdom.sanskrit.trim()}\n\n✨ भावार्थ: ${wisdom.hindi}\n\n📖 पूरा पाठ व व्याख्या:\nhttps://dharmagranth.dev${withTrailingSlash(wisdom.href)}?utm_source=whatsapp&utm_medium=daily_bento\n\n— Dharma Granth (dharmagranth.dev)`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[36px] items-center gap-1 rounded-full border border-emerald-600/40 bg-emerald-50/70 px-3 py-1 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 hover:border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700/60"
                  title="WhatsApp पर साझा करें"
                >
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>WhatsApp</span>
                </a>
                <Link href={withTrailingSlash(wisdom.href)} className="inline-flex min-h-11 items-center gap-1 text-sm font-bold text-saffron-700 hover:text-saffron-800 dark:text-saffron-300">
                  Read verse <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>

          <div className="editorial-bento-card min-h-[240px] p-3 sm:p-4 lg:col-span-5">
            <PanchangPreview compact />
          </div>

          <article className="editorial-bento-card flex min-h-[166px] flex-col justify-between p-5 sm:p-6 lg:col-span-7">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span lang="hi">पढ़ना जारी रखें</span><span aria-hidden="true"> · </span><span>Resume reading</span>
            </div>
            {latest ? (
              <div className="mt-3">
                <p className="text-sm text-dharma-muted">{latest.scriptureTitle}{latest.scriptureTitleSanskrit ? ` · ${latest.scriptureTitleSanskrit}` : ''}</p>
                <h3 className="mt-1 font-serif text-xl font-bold text-dharma-text">{latest.chapterTitle}</h3>
                <Link href={resumeHref(latest)} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-saffron-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-saffron-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron-600">
                  Continue where you left off <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            ) : (
              <div className="mt-3 flex items-center justify-between gap-4">
                <p className="max-w-sm text-sm leading-relaxed text-dharma-muted">{visits === null ? 'Your reading history stays on this device.' : 'Your next chapter is ready whenever you are.'}</p>
                <Link href="/scriptures/" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-dharma-border px-4 py-2 text-sm font-semibold text-dharma-text transition hover:border-saffron-400">
                  Choose a text <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            )}
          </article>

          <article className="editorial-bento-card flex min-h-[166px] flex-col justify-between p-5 sm:p-6 lg:col-span-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              <span lang="hi">नित्य पठन</span><span aria-hidden="true"> · </span><span>A gentle rhythm</span>
            </div>
            <div className="mt-3 flex items-end justify-between gap-4">
              <div>
                <p className="font-serif text-xl font-bold text-dharma-text">{streak === null ? 'At your own pace' : streak > 0 ? `${streak} ${streak === 1 ? 'day' : 'days'} of reading` : 'Begin whenever you are ready'}</p>
                <p className="mt-1 text-sm text-dharma-muted">A quiet reading rhythm, kept private on this device.</p>
              </div>
              <Link href="/practice/" aria-label="Open daily practice" className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border border-dharma-border text-saffron-700 transition hover:border-saffron-400 dark:text-saffron-300">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
