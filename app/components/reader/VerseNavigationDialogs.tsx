'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { THEMES, THEME_NAMES, type Theme } from '@/app/components/ThemeProvider';
import { openGlobalSearch } from '@/lib/search-events';
import { verseCount as fmtVerses } from '@/lib/format';
import { toAsciiDigits } from '@/lib/verse-format';
import { ReaderDialog } from './ReaderDialog';
import { isDottedVerseRoute, VerseRouteLink } from './VerseRouteLink';
import type { ReaderChapter, ReaderVerseLink } from './VerseReader';

const SITE_LINKS = [
  { href: '/', en: 'Home', hi: 'मुख' },
  { href: '/scriptures/', en: 'Scripture Library', hi: 'ग्रंथालय' },
  { href: '/scripture/bhagavadgita/', en: 'Bhagavad Gita', hi: 'गीता' },
  { href: '/learn/', en: 'Learn', hi: 'अध्ययन' },
  { href: '/practice/', en: 'Practice', hi: 'साधना' },
  { href: '/panchang/', en: 'Panchang', hi: 'पंचांग' },
] as const;

export function VerseNavigationDialogs({
  dialog,
  onClose,
  chapters,
  chapterId,
  verses,
  currentVerseNumber,
  savedInChapter,
  theme,
  setTheme,
}: {
  dialog: 'site' | 'chapters' | 'verses' | null;
  onClose: () => void;
  chapters: ReaderChapter[];
  chapterId: number;
  verses: ReaderVerseLink[];
  currentVerseNumber: number | string;
  savedInChapter: ReadonlySet<string>;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}) {
  const router = useRouter();
  const [pick, setPick] = useState('');
  const total = verses.length;
  const visibleVerses = pick.trim()
    ? verses.filter((v) => String(v.number).startsWith(pick.trim()))
    : verses;

  return (
    <>
      <ReaderDialog open={dialog === 'site'} onClose={onClose} title="Menu" titleHi="मेनू" variant="modal">
        <nav aria-label="Site pages">
          <ul className="space-y-1">
            {SITE_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={onClose}
                  className="focus-ring flex min-h-[48px] items-center gap-2 rounded-xl px-3 text-sm font-semibold text-dharma-text hover:bg-dharma-bg"
                >
                  <span>{l.en}</span>{' '}
                  <span lang="hi" className="font-devanagari font-normal text-dharma-muted">
                    {l.hi}
                  </span>
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openGlobalSearch();
                }}
                className="focus-ring flex min-h-[48px] w-full items-center gap-2 rounded-xl px-3 text-left text-sm font-semibold text-dharma-text hover:bg-dharma-bg"
              >
                <Search className="h-4 w-4 text-saffron-700" aria-hidden="true" />
                <span>Search</span>{' '}
                <span lang="hi" className="font-devanagari font-normal text-dharma-muted">
                  खोजें
                </span>
              </button>
            </li>
          </ul>
        </nav>
        <div role="radiogroup" aria-label="Theme" className="mt-5 border-t border-dharma-border pt-4">
          <p className="mb-2 px-1 text-sm font-semibold text-dharma-muted">
            Theme <span lang="hi" className="font-devanagari font-normal">थीम</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            {THEMES.map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={theme === t}
                onClick={() => setTheme(t)}
                title={THEME_NAMES[t].description}
                className={`focus-ring min-h-[48px] rounded-xl border px-3 text-sm font-semibold transition ${
                  theme === t
                    ? 'border-saffron-600 bg-saffron-500/10 text-dharma-text'
                    : 'border-dharma-border text-dharma-muted hover:border-saffron-400'
                }`}
              >
                <span>{THEME_NAMES[t].name}</span>{' '}
                <span lang="hi" className="font-devanagari font-normal">
                  {THEME_NAMES[t].hi}
                </span>
              </button>
            ))}
          </div>
        </div>
      </ReaderDialog>

      <ReaderDialog open={dialog === 'chapters'} onClose={onClose} title="Chapters" titleHi="अध्याय" variant="modal">
        <ul className="space-y-1">
          {chapters.map((c) => (
            <li key={c.id}>
              <Link
                href={c.href}
                onClick={onClose}
                aria-current={c.id === chapterId ? 'true' : undefined}
                className={`focus-ring flex min-h-[52px] items-center justify-between gap-3 rounded-xl px-3 py-2 transition ${
                  c.id === chapterId
                    ? 'bg-saffron-100 font-semibold text-saffron-950 dark:bg-saffron-900/40 dark:text-saffron-100'
                    : 'hover:bg-dharma-bg'
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm">
                    {toAsciiDigits(c.id)}. {c.title}
                  </span>
                  {c.titleSanskrit && (
                    <span lang="sa" className="block truncate font-devanagari text-sm text-dharma-muted">
                      {c.titleSanskrit}
                    </span>
                  )}
                </span>
                {c.verseCount ? (
                  <span className="shrink-0 text-xs text-dharma-muted">{fmtVerses(c.verseCount)}</span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </ReaderDialog>

      <ReaderDialog
        open={dialog === 'verses'}
        onClose={() => {
          onClose();
          setPick('');
        }}
        title="Go to verse"
        titleHi="श्लोक चुनें"
        variant="modal"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const exact = verses.find((v) => String(v.number) === pick.trim());
            if (exact) {
              onClose();
              if (isDottedVerseRoute(exact.href)) window.location.assign(exact.href);
              else router.push(exact.href);
            }
          }}
          className="mb-4"
        >
          <label htmlFor="reader-verse-pick" className="mb-1 block text-sm font-semibold text-dharma-text">
            Verse number
          </label>
          <input
            id="reader-verse-pick"
            inputMode="numeric"
            autoComplete="off"
            value={pick}
            onChange={(e) => setPick(e.target.value)}
            placeholder={`1 – ${toAsciiDigits(total)}`}
            className="min-h-[48px] w-full rounded-xl border border-dharma-border bg-dharma-bg px-3 text-base text-dharma-text outline-none focus:border-saffron-600 focus:ring-2 focus:ring-saffron-600/25"
          />
        </form>
        <ul className="grid grid-cols-5 gap-2 sm:grid-cols-6" aria-label="Verses in this chapter">
          {visibleVerses.map((v) => (
            <li key={String(v.number)}>
              <VerseRouteLink
                href={v.href}
                onClick={() => {
                  onClose();
                  setPick('');
                }}
                aria-current={String(v.number) === String(currentVerseNumber) ? 'true' : undefined}
                aria-label={savedInChapter.has(String(v.number)) ? `Verse ${toAsciiDigits(v.number)}, saved` : undefined}
                className={`focus-ring relative flex h-12 items-center justify-center rounded-xl border text-sm font-semibold tabular-nums transition ${
                  String(v.number) === String(currentVerseNumber)
                    ? 'border-saffron-700 bg-saffron-700 text-white'
                    : 'border-dharma-border bg-dharma-bg text-dharma-text hover:border-saffron-500'
                }`}
              >
                {toAsciiDigits(v.number)}
                {savedInChapter.has(String(v.number)) && (
                  <span
                    aria-hidden="true"
                    data-saved-dot
                    className={`verse-saved-dot ${
                      String(v.number) === String(currentVerseNumber) ? 'bg-current' : 'bg-dharma-saffron'
                    }`}
                  />
                )}
              </VerseRouteLink>
            </li>
          ))}
        </ul>
        {visibleVerses.length === 0 && <p className="mt-3 text-sm text-dharma-muted">No verse starts with “{pick}”.</p>}
      </ReaderDialog>
    </>
  );
}
