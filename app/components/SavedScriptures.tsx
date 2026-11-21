'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowRight, BookMarked, X } from 'lucide-react';
import { scriptureCatalog } from '@/data/scripture-meta';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { countLabel } from '@/lib/library';

const SAVED_KEY = 'dharma.saved_scriptures';
const NONE: string[] = [];

/** Whole texts saved from the library (verse bookmarks are listed separately below). Renders nothing when empty. */
export function SavedScriptures() {
  const [savedIds, setSavedIds] = useLocalStorage<string[]>(SAVED_KEY, NONE);

  const saved = useMemo(
    () =>
      (Array.isArray(savedIds) ? savedIds : [])
        .map((id) => scriptureCatalog.find((s) => s.id === id))
        .filter((s): s is NonNullable<typeof s> => Boolean(s)),
    [savedIds],
  );

  if (saved.length === 0) return null;

  return (
    <section aria-labelledby="saved-texts-heading" className="mb-10">
      <h2 id="saved-texts-heading" className="mb-4 flex items-center gap-2 font-serif text-xl font-bold text-dharma-text">
        <BookMarked className="h-5 w-5 text-saffron-700 dark:text-saffron-300" aria-hidden="true" />
        <span data-bi="en">Saved texts</span>
        <span lang="hi" data-bi="hi" data-bi-lead className="font-devanagari text-base font-normal text-dharma-muted">
          सहेजे ग्रंथ
        </span>
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {saved.map((s) => {
          const counts = countLabel(s);
          return (
            <li key={s.id} className="relative rounded-2xl border border-dharma-border bg-dharma-card p-4 pr-14">
              <Link href={`/scripture/${s.id}`} className="focus-ring block rounded-lg">
                <span lang="sa" className="block font-devanagari text-lg font-semibold leading-snug text-dharma-text">
                  {s.titleSanskrit}
                </span>
                <span className="mt-0.5 block font-serif text-base font-bold text-dharma-text">{s.title}</span>
                <span className="mt-2 block text-sm text-dharma-muted">
                  {counts.chapters} · {counts.verses}
                </span>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-saffron-800 dark:text-saffron-300">
                  Continue <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setSavedIds((prev) => prev.filter((id) => id !== s.id))}
                aria-label={`Remove ${s.title} from saved texts`}
                className="focus-ring absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-full text-dharma-muted transition hover:text-dharma-text"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
