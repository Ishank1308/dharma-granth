'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { BackupRestore } from '@/app/components/BackupRestore';
import { WellbeingSnapshot } from '@/app/components/dashboard/WellbeingSnapshot';

// Personal browser state loads after the public dashboard shell.
const DailyDharmaDashboard = dynamic(
  () => import('@/app/components/daily/DailyDharmaDashboard').then((module) => module.DailyDharmaDashboard),
  { ssr: false },
);

export function DashboardClient() {
  return (
    <main className="min-h-screen bg-dharma-bg">
      <section className="bg-gradient-to-br from-saffron-900 via-saffron-800 to-amber-900 py-12 text-white sm:py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div className="fade-up-in">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-saffron-200">
              Private study space · निजी स्वाध्याय
            </p>
            <h1 className="mb-3 font-serif text-3xl font-bold sm:text-4xl md:text-5xl">
              Make room for a little study
            </h1>
            <p className="max-w-2xl text-base opacity-90 sm:text-lg">
              Read, reflect, or pause. Your personal practice stays in this browser, and you can return whenever it feels useful.
            </p>
          </div>
          <Link
            href="/practice/"
            className="focus-ring inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-saffron-900 transition hover:bg-saffron-50"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Open practice tools
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <WellbeingSnapshot />
        <DailyDharmaDashboard />
        <BackupRestore />
        <p className="pb-4 text-center text-xs leading-relaxed text-dharma-muted">
          Your summary stays here on this device. You can pause local reading history, export a backup, or leave at any time.
        </p>
      </div>
    </main>
  );
}
