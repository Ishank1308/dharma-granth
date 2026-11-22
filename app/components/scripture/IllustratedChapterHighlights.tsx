import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { ChapterPreview } from '@/lib/read-seeded-chapters';
import { SCENES, type SceneId } from '@/lib/chapter-scenes';
import { chapterPhoto } from '@/lib/scene-photos';

/**
 * Small, curated entry points for well-grounded chapter scenes.
 * Each card shows the photograph or classical painting the chapter itself opens with
 * (lib/scene-photos.ts); a chapter without one, and Data Saver, keep the drawn painting, still.
 * Only chapters with published verses are linked; the full contents list stays primary.
 */
type Artwork = 'kurukshetra' | 'yajna' | 'yogi' | 'palace' | 'forest' | 'ocean' | 'devi' | 'kailash';

interface Highlight {
  id: number;
  painting: Artwork;
  scene: SceneId;
}

const HIGHLIGHTS: Readonly<Record<string, readonly Highlight[]>> = {
  bhagavadgita: [
    { id: 1, painting: 'kurukshetra', scene: 'kurukshetra' },
    { id: 3, painting: 'yajna', scene: 'yajna' },
    { id: 6, painting: 'yogi', scene: 'dhyana' },
  ],
  ramayana: [
    { id: 1, painting: 'palace', scene: 'ayodhya' },
    { id: 2, painting: 'forest', scene: 'exile' },
    { id: 5, painting: 'ocean', scene: 'sundara' },
  ],
  durgasaptashati: [
    { id: 1, painting: 'ocean', scene: 'cosmic-ocean' },
    { id: 2, painting: 'devi', scene: 'devi-battle' },
    { id: 5, painting: 'kailash', scene: 'devi-himalaya' },
  ],
};

export function IllustratedChapterHighlights({
  scriptureId,
  chapters,
}: {
  scriptureId: string;
  chapters: ChapterPreview[];
}) {
  const configured = HIGHLIGHTS[scriptureId];
  if (!configured) return null;

  const byId = new Map(chapters.map((chapter) => [chapter.id, chapter]));
  const items = configured.flatMap((highlight) => {
    const chapter = byId.get(highlight.id);
    if (!chapter || chapter.verseCount <= 0) return [];
    return [{ ...highlight, chapter }];
  });

  if (items.length < 2) return null;
  const sectionLabel = scriptureId === 'ramayana' ? 'काण्ड' : 'अध्याय';

  return (
    <section className="mb-8" aria-labelledby="chapter-highlights-title">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="editorial-section-eyebrow">ग्रन्थ प्रवेश · Illustrated entry points</p>
          <h2 id="chapter-highlights-title" className="editorial-section-title mt-1">Explore a section</h2>
        </div>
        <a href="/sources/#picture-credits" className="focus-ring inline-flex min-h-6 items-center rounded-pill px-1 text-caption-1 text-dharma-muted underline decoration-dharma-border underline-offset-2 hover:text-dharma-text">
          <span data-bi="en">Picture credits</span> <span aria-hidden="true" data-bi="sep">·</span>{' '}
          <span lang="hi" data-bi="hi" className="font-devanagari">चित्र-श्रेय</span>
        </a>
      </div>
      <ol className="mt-4 grid snap-x snap-mandatory grid-flow-col auto-cols-[minmax(248px,82vw)] gap-3 overflow-x-auto pb-3 scrollbar-none md:auto-cols-auto md:grid-flow-row md:grid-cols-3 md:overflow-visible">
        {items.map(({ id, painting, scene, chapter }) => (
          <li key={id} className="min-w-0 snap-start">
            <Link
              href={`/scripture/${scriptureId}/chapter/${id}/`}
              className="chapter-highlight-link focus-ring group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-dharma-border bg-dharma-card shadow-raised hover:border-dharma-saffron/50"
            >
              <span className="block overflow-hidden bg-dharma-bg">
                <span
                  aria-hidden="true"
                  data-decorative
                  data-painting={painting}
                  data-photo={chapterPhoto(scriptureId, id)}
                  className="chapter-highlight-art"
                />
              </span>
              <span className="flex flex-1 items-start justify-between gap-2 p-4">
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-dharma-saffron">{sectionLabel} {id} · {chapter.verseCount} श्लोक</span>
                  <span className="mt-1 block text-base font-semibold leading-snug text-dharma-text">{chapter.title}</span>
                  <span lang="hi" className="mt-1.5 block font-devanagari text-xs leading-relaxed text-dharma-muted">
                    {SCENES[scene].hi}
                  </span>
                </span>
                <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-dharma-saffron" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
