import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * 15-second fly-through of the homepage. Server-rendered markup only: the video never
 * downloads until the reader presses play (preload="none"), so the page stays light.
 */
export function HomeTourVideo() {
  return (
    <section aria-labelledby="tour-heading" className="border-b border-dharma-border bg-dharma-card-soft/40 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-saffron-700 dark:text-saffron-400">
            <span lang="hi">एक झलक</span> · <span>A 15-second tour</span>
          </p>
          <h2 id="tour-heading" className="font-serif text-3xl font-bold text-dharma-text sm:text-4xl">
            See the library at a glance
          </h2>
          <p id="tour-description" className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-dharma-muted">
            A short, silent-friendly walk down this page: the search, the reading paths, the verse of the day and the
            featured scriptures. There is no narration; the closing card reads “Every scripture, one library — read in
            Sanskrit, Hindi and English.”
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-dharma-border bg-dharma-card shadow-sm">
          <video
            className="block aspect-[5/4] h-auto w-full bg-dharma-card"
            width={1080}
            height={864}
            controls
            playsInline
            preload="none"
            poster="/media/dharma-granth-tour-poster.jpg"
            aria-describedby="tour-description"
          >
            <source src="/media/dharma-granth-tour.mp4" type="video/mp4" />
            <a href="/media/dharma-granth-tour.mp4">Download the tour video (MP4, 3 MB)</a>
          </video>
        </div>

        <p className="mt-6 text-center">
          <Link
            href="/scriptures/"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-saffron-800 hover:underline dark:text-saffron-300"
          >
            Browse the full library
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </p>
      </div>
    </section>
  );
}
