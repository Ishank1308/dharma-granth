'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, Bookmark, BookOpen, ListChecks, FileClock } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  LANGUAGES,
  isBeginnerFriendly,
  readingLevelOf,
  summaryOf,
  themesOf,
  verificationOf,
  formatNumber,
  type LibraryItem,
  type ViewMode,
} from '@/lib/library';

const NOT_RECORDED = 'Not yet recorded';

function formatDate(iso: string | undefined, withDay: boolean): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return new Intl.DateTimeFormat('en-IN', withDay ? { day: 'numeric', month: 'short', year: 'numeric' } : { month: 'short', year: 'numeric' }).format(d);
}

function StatusBadge({ item }: { item: LibraryItem }) {
  const status = verificationOf(item);
  const Icon = status.id === 'published' ? BookOpen : status.id === 'curated' || status.id === 'partial' ? ListChecks : FileClock;
  const tone =
    status.id === 'published'
      ? 'text-dharma-text'
      : status.id === 'curated' || status.id === 'partial'
        ? 'text-amber-800 dark:text-amber-300'
        : 'text-dharma-muted';
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${tone}`} title={status.hint}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {status.label}
    </span>
  );
}

function LanguageChips({ item }: { item: LibraryItem }) {
  const available = LANGUAGES.filter((l) => item.facts.languages[l.id]);
  return (
    <ul aria-label="Languages available" className="flex flex-wrap gap-1.5">
      {available.map((l) => (
        <li
          key={l.id}
          className="rounded-md border border-dharma-border bg-dharma-bg px-2 py-0.5 text-xs font-medium text-dharma-text"
          lang={l.id === 'en' ? 'en' : l.id}
          title={l.label}
        >
          <span className={l.id === 'en' ? '' : 'font-devanagari'}>{l.native}</span>
        </li>
      ))}
    </ul>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-dharma-muted">{label}</dt>
      <dd className="mt-0.5 text-sm leading-snug text-dharma-text">{children}</dd>
    </div>
  );
}

const missing = <span className="text-dharma-muted">{NOT_RECORDED}</span>;

// English cover names follow the local Gita Press editions when that title is
// present in the source collection; all other scriptures use the catalogue name.
const GITA_PRESS_COVER_TITLES: Readonly<Record<string, string>> = {
  ashtavakra: 'Ashtavakra Gita',
  bhagavadgita: 'Shrimad Bhagavad Gita',
  ishavasya: 'Ishavashya Upanishad',
  kena: 'Keno Upanishad',
  mundaka: 'Mundako Upanishad',
  chandogya: 'Chandogyo Upanishad',
  brihadaranyaka: 'Brihadaranyak Upanishad',
  shvetashvatara: 'Shwetashwatara Upanishad',
  taittiriya: 'Taitiriya Upanishad',
  prashna: 'Prashnopanishad',
  mahabharata: 'Mahabharat',
  garudpurana: 'Garuda Puran',
  harivanshpuran: 'Harivansh Puran',
  naradapuran: 'Narad Puran',
  padmapuran: 'Padma Puran',
  brahmasutra: 'Vedant Darshan (Brahma Sutra)',
  vivekchudamani: 'Vivek Chudamani',
  viduraniti: 'Vidura Niti',
  vinayapatrika: 'Vinaya Patrika',
};

const Realistic3DGranth = dynamic(
  () => import('@/app/components/motion/Realistic3DGranth').then((mod) => mod.Realistic3DGranth),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-80 w-64 items-center justify-center rounded-2xl border border-amber-400/30 bg-stone-900 text-sm text-amber-100 sm:w-72">
        Opening book preview…
      </div>
    ),
  },
);

function LibraryBookPreview({ item, categoryLabel }: { item: LibraryItem; categoryLabel: string }) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const countLabel = item.totalVerses > 0
    ? `${formatNumber(item.totalChapters)} Chapters · ${formatNumber(item.totalVerses)} Verses`
    : 'ग्रंथ सूची';
  const englishTitle = GITA_PRESS_COVER_TITLES[item.id] ?? item.title;
  const subTitle = item.author ? `Attributed to ${item.author}` : categoryLabel;

  useEffect(() => {
    const element = previewRef.current;
    if (!element) return;
    if (typeof IntersectionObserver === 'undefined') {
      setNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: '360px 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={previewRef} className="mt-3 flex min-h-[24rem] items-center justify-center overflow-visible">
      {nearViewport ? (
        <Realistic3DGranth
          compact
          title={item.titleSanskrit || item.title}
          englishTitle={englishTitle}
          subTitle={subTitle}
          verseCount={countLabel}
        />
      ) : (
        <div className="[perspective:1200px]" aria-hidden="true">
          <div
            className="relative h-[22.5rem] w-[15rem] rounded-r-2xl rounded-l-md border border-amber-400/35 bg-gradient-to-br from-[#7c2d12] via-[#451a03] to-[#1c0a00] p-4 shadow-[inset_4px_0_10px_rgba(0,0,0,0.8),12px_16px_40px_rgba(0,0,0,0.6)]"
            style={{ transform: 'rotateY(-7deg)', transformStyle: 'preserve-3d' }}
          >
            <span className="pointer-events-none absolute inset-2 rounded-xl border border-amber-400/40" />
            <span className="pointer-events-none absolute inset-3 rounded-lg border border-amber-300/20" />
            <span className="absolute inset-y-0 left-0 w-5 rounded-l-md border-r border-amber-400/20 bg-gradient-to-r from-[#1c0a00] via-[#7c2d12] to-[#451a03]" />
            <span className="absolute -right-2 top-2 bottom-2 w-2 bg-[repeating-linear-gradient(0deg,#fef3c7_0px,#d97706_1px,#fef3c7_2px)]" />
            <span className="absolute -top-1 left-16 h-24 w-4 bg-gradient-to-b from-amber-500 to-orange-700 shadow-lg [clip-path:polygon(0_0,100%_0,100%_90%,50%_100%,0_90%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between py-2 pl-3 text-center text-amber-100">
              <div className="flex items-center justify-between gap-2 text-xs font-bold text-amber-200">
                <span className="rounded-full border border-amber-400/30 bg-black/35 px-2 py-1 font-devanagari">पवित्र ग्रंथ</span>
                <span lang="sa" className="font-devanagari text-2xl">ॐ</span>
              </div>
              <div className="space-y-2">
                <p lang="sa" className="font-devanagari text-xl font-extrabold leading-relaxed text-amber-200">{item.titleSanskrit || item.title}</p>
                <p lang="en" className="font-serif text-sm font-bold leading-tight">{englishTitle}</p>
                <p className="font-serif text-xs italic text-amber-200/85">{subTitle}</p>
              </div>
              <p className="text-[10px] font-bold text-amber-200/90">{countLabel}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function LibraryCard({
  item,
  categoryLabel,
  view,
  saved,
  onToggleSave,
}: {
  item: LibraryItem;
  categoryLabel: string;
  view: ViewMode;
  saved: boolean;
  onToggleSave: (id: string) => void;
}) {
  const detailed = view === 'detailed';
  const headingId = `lib-${item.id}-title`;
  const level = readingLevelOf(item);
  const themes = themesOf(item).slice(0, 6);
  const updated = formatDate(item.facts.lastUpdated, true);
  const fetched = formatDate(item.facts.sourceFetched, false);
  const commentary: string[] = [];
  if (item.facts.hindiCommentary) commentary.push('Hindi verse-by-verse commentary');
  if (item.explanation) commentary.push('Book overview (English & Hindi)');
  const readingHref = item.id === 'ashtavakra' ? '/ashtavakra/' : `/scripture/${item.id}`;

  return (
    <article
      aria-labelledby={headingId}
      className="group flex h-full flex-col rounded-2xl border border-dharma-border bg-dharma-card p-5 shadow-sm transition hover:border-saffron-300 hover:shadow-md sm:p-6"
    >
      <header className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-saffron-800 dark:text-saffron-300">{categoryLabel}</p>
        <button
          type="button"
          onClick={() => onToggleSave(item.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${item.title} from saved` : `Save ${item.title}`}
          className={`focus-ring -mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition ${
            saved ? 'text-saffron-700 dark:text-saffron-300' : 'text-dharma-muted hover:text-saffron-700'
          }`}
        >
          <Bookmark className="h-5 w-5" fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
        </button>
      </header>

      <h3 id={headingId} className="sr-only">
        <span lang="sa" className="font-devanagari">{item.titleSanskrit}</span>
        <span lang="en">{item.title}</span>
        {detailed && item.titleIast && <span className="mt-0.5 block font-serif text-sm italic text-dharma-muted">{item.titleIast}</span>}
      </h3>

      <LibraryBookPreview item={item} categoryLabel={categoryLabel} />

      <p className={`mt-3 text-sm leading-relaxed text-dharma-muted ${detailed ? '' : 'line-clamp-3'}`}>
        {detailed ? item.description : summaryOf(item.description)}
      </p>
      {detailed && item.explanation && (
        <p lang="hi" className="mt-3 font-devanagari text-[0.95rem] leading-[1.75] text-dharma-text/90">
          {item.explanation.overview.hi}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <LanguageChips item={item} />
        <StatusBadge item={item} />
      </div>
      {!detailed && <p className="mt-2 text-sm text-dharma-muted">Reading level: {level.label}</p>}

      {detailed && (
        <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-dharma-border/70 pt-5 sm:grid-cols-2">
          <Detail label="Author">{item.author ?? missing}</Detail>
          <Detail label="Estimated reading level">
            {level.label}
            {isBeginnerFriendly(item) && <span className="ml-2 rounded bg-saffron-100 px-1.5 py-0.5 text-[11px] font-semibold text-saffron-900 dark:bg-saffron-900/40 dark:text-saffron-200">Beginner friendly</span>}
          </Detail>
          <Detail label="Major themes">
            {themes.length > 0 ? themes.join(' · ') : missing}
          </Detail>
          <Detail label="Available commentary">{commentary.length > 0 ? commentary.join('; ') : missing}</Detail>
          <Detail label="Last updated">{updated ?? missing}</Detail>
        </dl>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
        <Link
          href={readingHref}
          aria-label={`Start reading ${item.title}`}
          className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-full bg-saffron-700 px-5 text-sm font-semibold text-white transition hover:bg-saffron-800 group-hover:shadow-md"
        >
          Start reading
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
