'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { VerseHrefLink } from '@/app/components/VerseHrefLink';
import { BookmarkPlus, Check } from 'lucide-react';
import { BOOKMARKS_KEY, readBookmarks, type SavedVerse } from '@/lib/reader-actions';
import { parseSharePath, verseKey, type SharedList } from '@/lib/verse-collections';
import { versePageHref } from '@/lib/verse-paths';
import { verseCount } from '@/lib/format';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

interface Line {
  ref: SharedList['refs'][number];
  title: string;
  href: string;
  sanskrit: string;
  meaning: string;
  found: boolean;
}

/**
 * Shows a list received as a link. Verse text comes from the published chapter files, so the
 * page shows exactly what the library holds; a reference the library does not have is marked.
 */
export function SharedListClient({ titles }: { titles: Record<string, string> }) {
  const [list, setList] = useState<SharedList | null>(null);
  const [lines, setLines] = useState<Line[] | null>(null);
  const [saved, setSaved] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setList(parseSharePath(window.location.search));
  }, []);

  useEffect(() => {
    if (!list) return;
    let cancelled = false;
    type ChapterVerse = { number?: number | string; sanskrit?: string; hindi?: string; translation?: string };
    const chapters = new Map<string, Promise<ChapterVerse[]>>();
    // The export drops a chapter's JSON when its page already carries the verses (scripts/prune-export.mjs),
    // so fall back to the plain verses in the chapter page itself.
    const fromPage = async (id: string, chapter: number): Promise<ChapterVerse[]> => {
      const res = await fetch(`${BASE}/scripture/${id}/chapter/${chapter}/`);
      if (!res.ok) return [];
      const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
      return Array.from(doc.querySelectorAll<HTMLElement>('article.vt[id^="verse-"]')).map((a) => {
        const sa = a.querySelector('.vt-sa');
        sa?.querySelector('.vt-num')?.remove();
        return {
          number: a.id.slice('verse-'.length),
          sanskrit: Array.from(sa?.children ?? []).map((s) => s.textContent ?? '').join(' '),
          hindi: a.querySelector('.vt-hi')?.textContent ?? '',
          translation: a.querySelector('.vt-en')?.textContent ?? '',
        };
      });
    };
    const load = (id: string, chapter: number) => {
      const key = `${id}:${chapter}`;
      if (!chapters.has(key)) {
        chapters.set(
          key,
          fetch(`${BASE}/data/scriptures-full/${id}/ch-${chapter}.json`)
            .then((r) => (r.ok ? r.json() : null))
            .then((j) => (j?.chapter?.verses as ChapterVerse[] | undefined) ?? fromPage(id, chapter))
            .catch(() => fromPage(id, chapter).catch(() => [])),
        );
      }
      return chapters.get(key)!;
    };
    Promise.all(
      list.refs.map(async (ref) => {
        const verses = titles[ref.scriptureId] ? await load(ref.scriptureId, ref.chapterId) : [];
        const v = verses.find((x) => String(x.number) === String(ref.verseId));
        // A dotted label (Chandogya "6.8.7") is already the full reference; otherwise chapter.verse.
        const shownRef = String(ref.verseId).includes('.') ? String(ref.verseId) : `${ref.chapterId}.${ref.verseId}`;
        const title = `${titles[ref.scriptureId] ?? ref.scriptureId} ${shownRef}`;
        return {
          ref,
          title,
          href: versePageHref(ref.scriptureId, ref.chapterId, ref.verseId) ?? `/scripture/${ref.scriptureId}/chapter/${ref.chapterId}/#verse-${ref.verseId}`,
          sanskrit: (v?.sanskrit ?? '').replace(/\s+/g, ' ').trim(),
          meaning: (v?.hindi || v?.translation || '').replace(/\s+/g, ' ').trim(),
          found: Boolean(v?.sanskrit),
        };
      }),
    ).then((result) => {
      if (!cancelled) setLines(result);
    });
    return () => {
      cancelled = true;
    };
  }, [list, titles]);

  const saveAll = () => {
    if (!lines) return;
    try {
      const have = new Set(readBookmarks().map(verseKey));
      const fresh: SavedVerse[] = lines
        .filter((l) => l.found && !have.has(verseKey(l.ref)))
        .map((l) => ({
          scriptureId: l.ref.scriptureId,
          scriptureTitle: titles[l.ref.scriptureId] ?? l.ref.scriptureId,
          chapterId: l.ref.chapterId,
          chapterTitle: `अध्याय ${l.ref.chapterId}`,
          verseId: l.ref.verseId,
          sanskrit: l.sanskrit,
          translation: l.meaning,
          timestamp: new Date().toISOString(),
        }));
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...fresh, ...readBookmarks()]));
      setSaved(fresh.length);
    } catch {
      setError('Your browser blocked storage, so the verses could not be saved.');
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-6 lg:py-16">
      <header className="mb-8">
        <p lang="hi" className="font-devanagari text-sm font-semibold text-saffron-700 dark:text-saffron-300">साझा श्लोक-सूची</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-dharma-text">{list?.name || 'A shared list of verses'}</h1>
        <p className="mt-3 text-sm leading-relaxed text-dharma-muted">
          Someone shared these verses with you. The link holds only the references and the list name; no notes or personal data.
        </p>
      </header>

      {!list || !lines ? (
        <p role="status" className="text-sm text-dharma-muted">Loading the verses…</p>
      ) : list.refs.length === 0 ? (
        <p className="text-sm text-dharma-muted">
          This link has no verses in it. <Link href="/scriptures/" className="font-semibold underline underline-offset-4">Browse the library</Link>
        </p>
      ) : (
        <>
          <ol className="space-y-3">
            {lines.map((l) => (
              <li key={verseKey(l.ref)} className="rounded-2xl border border-dharma-border bg-dharma-card p-4">
                {l.found ? (
                  <VerseHrefLink href={l.href} className="font-serif text-base font-bold text-dharma-text hover:text-saffron-700">
                    {l.title}
                  </VerseHrefLink>
                ) : (
                  <span className="font-serif text-base font-bold text-dharma-muted">{l.title}</span>
                )}
                {l.found ? (
                  <>
                    <p lang="sa" className="mt-2 font-devanagari leading-relaxed text-dharma-text">{l.sanskrit}</p>
                    {l.meaning && <p className="mt-1 text-sm leading-relaxed text-dharma-muted">{l.meaning}</p>}
                  </>
                ) : (
                  <p className="mt-1 text-sm text-dharma-muted">This reference is not in the library.</p>
                )}
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={saveAll}
              disabled={saved !== null}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-saffron-700 px-5 text-sm font-semibold text-white transition hover:bg-saffron-800 disabled:opacity-70"
            >
              {saved === null ? <BookmarkPlus className="h-4 w-4" aria-hidden="true" /> : <Check className="h-4 w-4" aria-hidden="true" />}
              {saved === null ? 'Save these to my verses' : `${verseCount(saved)} saved`}
            </button>
            <Link href="/practice/bookmarks/" className="inline-flex min-h-11 items-center text-sm font-semibold text-saffron-700 underline-offset-4 hover:underline dark:text-saffron-300">
              Open my saved verses
            </Link>
          </div>
          <p role="status" aria-live="polite" className="mt-2 text-sm text-dharma-muted">
            {error || (saved !== null ? 'Saved in this browser only. Nothing was sent anywhere.' : '')}
          </p>
        </>
      )}
    </main>
  );
}
