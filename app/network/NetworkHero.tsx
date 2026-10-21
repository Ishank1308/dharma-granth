import Link from 'next/link';
import { Network } from 'lucide-react';

/** Breadcrumb and heading for /network/. Shared with the Suspense fallback so the exported HTML has the H1 and intro. */
export function NetworkHero() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-dharma-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="inline-flex min-h-[44px] items-center hover:text-dharma-text transition">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="opacity-40">/</li>
          <li>
            <Link href="/learn" className="inline-flex min-h-[44px] items-center hover:text-dharma-text transition">
              Learn
            </Link>
          </li>
          <li aria-hidden="true" className="opacity-40">/</li>
          <li aria-current="page" className="font-semibold text-saffron-600 dark:text-saffron-400">
            Verse Network · श्लोक संबंध जाल
          </li>
        </ol>
      </nav>

      <header className="rounded-3xl border border-saffron-500/20 bg-gradient-to-br from-saffron-500/10 via-amber-500/5 to-transparent p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-saffron-500/10 blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-saffron-500/30 bg-saffron-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-saffron-800 dark:text-saffron-300">
            <Network className="h-3.5 w-3.5 text-saffron-600" />
            <span>Interactive Verse Relationship Engine · ज्ञान-जाल</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-dharma-text">
            Exploring Scriptural Echoes & Connections
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-dharma-muted">
            Hindu scriptures do not exist in isolation. Every truth in the Bhagavad Gita echoes the Vedic Upanishads, roots itself in ancient hymns, and expands in the Epics and Puranas. Explore verified canonical relationships, supporting verses, parallel mantras, and contrasting philosophical perspectives.
          </p>
        </div>
      </header>
    </>
  );
}
