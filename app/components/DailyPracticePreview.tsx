'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, Heart, Lock, Sparkles } from 'lucide-react';

export function DailyPracticePreview() {
  const tools = [
    { titleHi: 'दैनिक श्लोक', titleEn: 'Daily Verse', icon: <BookOpen className="h-4 w-4" />, desc: 'प्रतिदिन एक श्लोक का अर्थ सहित पारायण' },
    { titleHi: 'जप माला', titleEn: 'Japa Counter', icon: <Sparkles className="h-4 w-4" />, desc: '108 मनकों की शांत व एकाग्र जप माला' },
    { titleHi: 'ध्यान समय', titleEn: 'Meditation Timer', icon: <Clock className="h-4 w-4" />, desc: 'गोंग व तानपूरा की ध्वनि सहित मौन ध्यान' },
    { titleHi: 'कृतज्ञता डायरी', titleEn: 'Gratitude Journal', icon: <Heart className="h-4 w-4" />, desc: 'दैनिक कृतज्ञता व संकल्प का निजी आलेख' },
  ];

  return (
    <div className="rounded-2xl border border-dharma-border bg-dharma-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
              दैनिक साधना · Sādhanā
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
              <Lock className="h-3 w-3" />
              100% निजी (100% Private)
            </span>
          </div>
          <h3 className="font-serif text-xl font-bold text-dharma-text">
            Bring Sacred Study Into Your Routine
          </h3>
          <p className="mt-1 text-xs text-dharma-muted">
            Quiet, non-competitive tools for your daily spiritual practice. No accounts, no leaderboards, completely on your device.
          </p>
        </div>

        <Link
          href="/practice"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-saffron-600 to-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:from-saffron-700 hover:to-amber-700 shrink-0"
        >
          <span>साधना प्रारंभ करें</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-dharma-border/60 pt-4 sm:grid-cols-4">
        {tools.map((t) => (
          <div key={t.titleEn} className="rounded-xl border border-dharma-border/70 bg-dharma-bg/70 p-3.5">
            <div className="flex items-center gap-2 text-saffron-700 dark:text-saffron-400">
              {t.icon}
              <span className="font-devanagari text-xs font-bold">{t.titleHi}</span>
            </div>
            <p className="mt-0.5 text-[11px] font-medium text-dharma-text/80">{t.titleEn}</p>
            <p className="mt-1.5 text-[11px] text-dharma-muted leading-relaxed line-clamp-2">{t.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
