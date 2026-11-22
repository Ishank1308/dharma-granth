# Commentary storage

How verse commentary (व्याख्या, research notes, modern context) is stored, published and loaded, so that
every verse of every book can carry it. Written 2026-11-21.

## Why it changed

Until November 2026 `npm run publish:commentary` wrote one JSON file per book,
`public/data/hi-commentary/<scripture>.json`, the reader downloaded the whole book's file for any chapter, and
the publisher refused to write more than 60 MB (later 70 MB) in total. That held about 13,000 explained verses.

The library has about 319,000 verses. At the size of today's entries (about 4.4 KB published, 5.8 KB in the
review queue) full coverage is about 1.4 GB published. One file per book cannot hold that:

| Limit | Per-book layout at full coverage |
|---|---|
| Cloudflare Pages: 25 MiB per file | Mahabharata alone would be ~325 MB; about 18 books pass 25 MiB |
| GitHub: 100 MB per file (warns at 50 MB) | Mahabharata's review queue would be ~430 MB |
| Reader | a chapter of the Mahabharata would download the whole epic's commentary |
| Page weight (`scripts/check-export.mjs`: 2.5 MB raw, 475 KB gz per page) | long chapters would carry megabytes of commentary in their HTML |
| Every publish rewrites the whole book's file | each batch adds a full copy of a multi-MB file to git history |

## The layout

Published commentary is one file per section of a chapter:

```
public/data/hi-commentary/<scripture>/<chapter>-<unit>.json
```

The unit comes from the commentary key alone (`lib/commentary-units.mjs`):

| Key | Unit | File |
|---|---|---|
| `5:12.45` (dotted: section 12 of chapter 5, e.g. a Mahabharata adhyaya) | `s12` | `5-s12.json` |
| `1:1.3.3` | `s1` | `1-s1.json` |
| `2:47` (plain numbers, in blocks of 250) | `b0` | `2-b0.json` |
| `2:251` | `b1` | `2-b1.json` |
| anything else | `x` | `2-x.json` |

Each file holds the same `"chapter:verse"` keys and entries as before, so nothing that reads an entry changed.
Because the unit depends only on the key, a data repair never moves commentary between files, and the reader can
work out which files a page needs from its verse numbers.

Measured over the current catalogue (319,205 verses): about 10,300 files at full coverage, the largest section
420 verses (Manusmriti), roughly 1.9 MB. On 22 November 2026 the 12,929 published entries are 922 files (64.5 MB), the largest 1.67 MB.

## Who reads it

- **Build time** (`lib/read-seeded-chapters.ts`, `readChapterCommentary`): chapter pages, verse pages, the
  verse sitemap and search index read one chapter's files from disk. Only the last 24 chapters are cached, so
  a build never holds whole books in memory.
- **Chapter pages** (`app/scripture/[id]/chapter/[chapterId]/chapter-view.tsx`): the page's commentary goes
  into its HTML in reading order up to `INLINE_COMMENTARY_MAX_BYTES` (1 MB, `lib/commentary-budget.ts`). The
  page lists the section files that hold the rest, and the reader (`FullChapterVerses`) loads them once the
  page has rendered. On 22 November 2026 seven pages pass the budget (Maha Upanishad ch. 5, Shiva Samhita ch. 5, Brahma Sutra
  ch. 3 and four Sama Veda parts); with full coverage, long chapters will.
- **Verse pages** carry their own verse's commentary in full, as before.
- **Scripts** read and write through `scripts/lib/commentary-store.mjs` (`readPublishedCommentary(id)` gives
  a whole book merged, the same object the per-book file held).

## Where it is served from

The published folder is about 10,000 files at full coverage, against Cloudflare's 20,000 files per
deployment and a site already at ~17,500. It goes up as a third deployment of the same Pages project, the
`commentary` branch at `https://commentary.dharma-granth.pages.dev`, the same way verse share images go to
the `share` branch. Details and how to undo it: `docs/deploy-cloudflare.md`, "Published commentary".

A local build (`NEXT_PUBLIC_COMMENTARY_ORIGIN` unset) serves the files from `public/` itself.

## Sources: review queues and modern context

`data/ai-commentary/<id>.json` (review queue), `data/ai-commentary/proposals/<id>.json`,
`data/ai-commentary/<id>-research.json` and `data/hi-commentary/<id>-rest.json` (modern context) may each be
either one file or a folder of the same section files, `<id>/<chapter>-<unit>.json`.
`scripts/lib/commentary-store.mjs` reads both forms (a key found in both is an error, never silently merged)
and writes a record as one file until it would pass 40 MB, then as a folder. A folder stays a folder.

So small books are unchanged, and a big book's sources never come near GitHub's 100 MB limit. The staging
workflow (`stage-commentary.mjs`, `approve-commentary.mjs`, `npm run publish:commentary`) handles both forms.
To start a big book split from the first batch, create the empty folder `data/ai-commentary/<id>/` (or
`data/hi-commentary/<id>-rest/`) before staging. The older generators (`generate-verse-commentary.ts`,
`generate-commentary-musespark.ts`, `apply-ai-artha.ts`, `queue-brihadaranyaka-hindi.ts`) write single files
only; `generate-verse-commentary.ts` refuses a split queue.

## Guards

- `npm run publish:commentary`: no section file over 8 MB; warns above 15,000 files, fails above 19,500.
  It deletes per-book files left from the old layout and folders of books that no longer have sources.
- `scripts/test-commentary-storage.mjs` (in `npm run check`): no per-book file in the published folder, every
  file holds only its own section's keys, and the store round-trips records exactly.
- `scripts/test-ai-commentary-review-holds.ts`: the 990 held Yajurveda drafts stay out of the published files.
- `scripts/prune-export.mjs`: counts the site, share images and commentary as separate deployments.

## Still to watch

- **Repository size.** Full coverage adds about 1.4 GB of published JSON plus about 1.8 GB of sources to
  git. Per-section files keep each publish's change small, but a clone grows. `npm run build` already runs
  `publish:commentary` in `prebuild`, so the published folder could later be generated in CI and ignored by git,
  once no thread depends on committing it.
- **Search index.** `/search-index/verses.json` adds a 260-character व्याख्या excerpt for every verse of the
  verse-page books, including all 23,595 Ramayana verses: about 16 MB more once the Ramayana is explained.
