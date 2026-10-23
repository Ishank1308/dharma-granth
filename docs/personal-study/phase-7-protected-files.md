# Phase 7 protected-file manifest

Snapshot date: 2026-10-19 (Asia/Calcutta)

This manifest is a coordination boundary for Phase 8A. It records the paths
observed in the Phase 7 working directory before Phase 8A integration work.
It is not evidence that every dirty path belongs exclusively to Phase 7. The
safe rule is stronger: Phase 8A will not modify any path listed here, any file
under a listed untracked directory, or any other path that becomes dirty in
the Phase 7 checkout.

## Checkout evidence

- Phase 7 working directory: `C:/Users/ishan/Music/dharma/dharma-granth`
- Phase 7 observed HEAD: `eeb44b6c45982de72ce91029c80cf62fb04cc73a`
- Phase 7 observed branch: `cursor/cloud-agent-env-setup-0b64`
- Phase 8A working directory: `C:/Users/ishan/.codex/worktrees/phase-8a-private-study-foundation/dharma-granth`
- Phase 8A starting commit: `eeb44b6c45982de72ce91029c80cf62fb04cc73a`
- Phase 8A branch: `codex/phase-8a-private-study-foundation`
- First Phase 8A commit: `6cb9826001e30894e1647fb86ccf3ad51f58e17f`

`git worktree list --porcelain` confirmed these are separate registered
worktrees. The Phase 8A worktree was clean after its first commit. No Phase 7
working-tree changes are present in the Phase 8A checkout.

## Protected tracked paths observed as modified or deleted

```text
app/components/FloatingCompanion.tsx
app/components/FullChapterVerses.tsx
app/components/GlobalSearchModal.tsx
app/components/SadhanaPortability.tsx
app/components/ShareVerseButton.tsx
app/components/VerseCard.tsx
app/components/VerseOfTheDaySection.tsx
app/globals.css
app/layout.tsx
app/page.tsx
app/wisdom-for-life/WisdomClient.tsx
app/wisdom-for-life/[slug]/TopicDetailClient.tsx
data/scripture-meta.ts
data/scriptures/aitareya.ts
data/scriptures/brihadaranyaka.ts
data/scriptures/chandogya.ts
data/wisdom-for-life.ts
lib/useHaptics.ts
package.json
public/data/scriptures-full/aitareya.json
public/data/scriptures-full/brahmandpuran.json
public/data/scriptures-full/brahmapuran.json
public/data/scriptures-full/brihadaranyaka.json
public/data/scriptures-full/chandogya.json
public/data/scriptures-full/harivanshpuran.json
public/data/scriptures-full/kurmapuran.json
public/data/scriptures-full/markandeypuran.json
public/data/scriptures-full/naradapuran.json
public/data/scriptures-full/tejobindu.json
public/data/scriptures-full/vamanpuran.json
public/data/scriptures-full/yajurveda.json
public/search/core-index.json
public/search/shards/brihadaranyaka.json
scripts/check-data.ts
tsconfig.json
```

## Protected untracked paths and directory scopes

```text
app/components/reader/MobileOneThumbControlBar.tsx
app/components/reader/StoryDeckModal.tsx
app/components/reader/SvadhyayaSplitDrawer.tsx
app/components/share/PatrikaShareStudioModal.tsx
app/journal/
app/network/
components/
data/offline-packs.ts
data/sources-local/
lib/db/
lib/literary-commentary.ts
lib/study/
lib/workers/
public/data/concordance-index.json
public/data/samvada-dialogues.json
scripts/build-concordance-db.ts
```

Generated OCR and scratch work observed in the Phase 7 checkout is also out of
scope for Phase 8A: `dharma_ocr/`, `ocr_output/`, `ocr_workspace/`, and
`scratch/`.

## Permanent content protections

Regardless of later Git status, Phase 8A must not edit canonical scripture
datasets, Sanskrit or IAST fields, source citations, Phase 7 editorial data,
homepage presentation, verse presentation, Story Deck, Mood Compass, Patrika
Studio, shared visual tokens, theme CSS, or motion utilities.

## Integration-sensitive paths confirmed in the repository

These paths exist in the present Phase 7 working directory and are protected
integration surfaces even when they are not listed as modified by Git:

```text
app/bookmarks/layout.tsx
app/bookmarks/page.tsx
app/journal/JournalClient.tsx
app/journal/page.tsx
lib/ashtavakra-progress.ts
lib/backup.ts
lib/sadhana-backup.ts
lib/useLanguagePreference.ts
lib/useStudyProgress.ts
public/sw.js
```

The search boundary includes `app/search-index/`,
`app/components/AdvancedSearch.tsx`, `app/components/GlobalSearchModal.tsx`,
`lib/search-*`, `lib/search.ts`, `lib/searchNormalizer.ts`,
`lib/verse-search-data.ts`, and `lib/workers/search*`. Phase 8A must not add
private notes, highlights, journal text, reading history, or preferences to
public search indexes, generated search artifacts, or search-worker messages.

The exact Story Deck and Patrika paths currently remain:

```text
app/components/reader/StoryDeckModal.tsx
app/components/share/PatrikaShareStudioModal.tsx
```

Their untracked status in the Phase 7 checkout does not weaken the protection.
Phase 8A must treat them as Phase 7-owned until post-Phase-7 integration begins.

Before post-Phase-7 integration, regenerate this manifest from a fresh status
check and review every intended shared-file edit against the completed Phase 7
diff.
