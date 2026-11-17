'use client';

import { useEffect, useState } from 'react';
import { readRecentChapters } from '@/lib/reading-history';

/** Optional, browser-local shortcut to the last verse in this chapter. */
export function ResumeVersePrompt({ scriptureId, chapterId, splitChapter = false }: { scriptureId: string; chapterId: number; splitChapter?: boolean }) {
  const [verseId, setVerseId] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const saved = readRecentChapters().find(
      (visit) => visit.scriptureId === scriptureId && visit.chapterId === chapterId,
    );
    setVerseId(saved?.verseId ?? null);
    setDismissed(false);
  }, [scriptureId, chapterId]);

  if (!verseId || dismissed) return null;

  function resume() {
    const target = document.getElementById(`verse-${verseId}`);
    if (!target) {
      // A saved verse may live in a different part of a split chapter.
      // The existing ChapterPartRedirect resolves its canonical hash.
      if (splitChapter) {
        window.location.assign(`/scripture/${scriptureId}/chapter/${chapterId}/#verse-${verseId}`);
      } else {
        setDismissed(true);
      }
      return;
    }
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#verse-${verseId}`);
    setDismissed(true);
  }

  return (
    <aside aria-label="पिछला अध्ययन स्थान" className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-dharma-border bg-dharma-card-soft px-3 py-2.5 text-sm">
      <p lang="hi" className="font-devanagari text-dharma-text">
        पिछली बार श्लोक {verseId} तक पढ़ा था
      </p>
      <div className="flex items-center gap-2">
        <button type="button" onClick={resume} className="min-h-11 rounded-lg bg-saffron-600 px-3 text-xs font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500">
          वहीं से पढ़ें
        </button>
        <button type="button" onClick={() => setDismissed(true)} aria-label="पिछला स्थान सुझाव हटाएँ" className="min-h-11 rounded-lg px-3 text-xs text-dharma-muted underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500">
          अभी नहीं
        </button>
      </div>
    </aside>
  );
}
