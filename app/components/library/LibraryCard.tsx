'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, Bookmark, BookOpen, ListChecks, FileClock } from 'lucide-react';
import type { ReactNode } from 'react';
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
  const countLabel = item.totalVerses > 0
    ? `${formatNumber(item.totalChapters)} Chapters · ${formatNumber(item.totalVerses)} Verses`
    : 'ग्रंथ सूची';

  return (
    <div className="mt-3 flex min-h-[24rem] items-center justify-center overflow-visible">
      <Realistic3DGranth
        compact
        title={item.titleSanskrit || item.title}
        englishTitle={GITA_PRESS_COVER_TITLES[item.id] ?? item.title}
        subTitle={item.author ? `Attributed to ${item.author}` : categoryLabel}
        verseCount={countLabel}
      />
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
