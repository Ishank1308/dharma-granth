# Post-Phase-7 integration contract

Phase 8A exposes a browser-local persistence service from `lib/private-study/`
and does not wire it into protected Phase 7 presentation files. Integration
begins only after Phase 7 is complete and its branch has been reviewed.

## Canonical identity boundary

The display layer implements `CanonicalReferenceResolver` from
`lib/private-study/integration.ts`. It must resolve a normalized
`scriptureId/chapterId/verseId` tuple against published canonical content.
Syntax validation alone does not prove that a verse exists.

The resolver must:

1. return the canonical reference and canonical site path for one published
   match;
2. reject missing, ambiguous, unpublished, or malformed references;
3. avoid matching on translated text, Sanskrit text, IAST text, display order,
   editorial headings, or mutable labels; and
4. leave canonical datasets and citation fields unchanged.

Only a `resolved` result may be used to create a new private study record.

## Intended insertion points

These are documentation targets, not Phase 8A edits:

- The final verse-card action layer may call the resolver before saving or
  removing a bookmark, note, highlight, or reading marker.
- The final dedicated verse page may read records by canonical reference and
  render controls through its settled client-side action component.
- The bookmarks or collections surface may list stored records and use the
  resolver-provided path when opening canonical content.
- The existing backup and clear-data surface must include IndexedDB archives
  before the new store is exposed to readers.
- Storage diagnostics may report availability and record counts without
  reading or logging note text.

The exact file paths must be chosen after regenerating the protected-file
manifest. Current protected candidates include `app/components/VerseCard.tsx`,
verse-page presentation components, Story Deck, Patrika Studio, homepage
components, and shared theme files.

## Verse save and annotation integration

The settled verse action component may expose bookmark, note, and highlight
commands only after `CanonicalReferenceResolver` returns `resolved`. UI state
must update after the IndexedDB transaction completes or explicitly surface a
write failure. A display label, translated excerpt, Sanskrit text, IAST text,
or DOM position must never be used as the persisted identity.

Existing bookmark and annotation data remains readable from its current
localStorage owner during migration. The integration must avoid rendering a
legacy mark and an IndexedDB record as two separate marks.

## Story Deck and journal boundary

`app/components/reader/StoryDeckModal.tsx` and `app/journal/` are Phase 7-owned.
Phase 8A does not attach actions to them. In Phase 8B, Story Deck may open a
journal flow with a resolved canonical reference and an explicitly selected
public excerpt. It must not silently create a private record, copy unrelated
reader history, or place journal text in shareable Story Deck state.

Journal domain types and journal-entry persistence are deferred. They require
a separate schema decision rather than overloading the current `note` record.

## Patrika privacy boundary

`app/components/share/PatrikaShareStudioModal.tsx` may receive canonical public
verse content that the reader explicitly chooses. It must never read, infer,
serialize, render, cache, or share private notes, highlights, journal entries,
reading history, reading positions, storage diagnostics, or preference data.
Private study exports must not be accepted as Patrika templates or payloads.

## Personal-study routes and navigation

The existing `app/bookmarks/` and `app/journal/` routes remain Phase 7-owned.
Any future personal-study route and navigation entry is Phase 8B work. Choose
the final route only after reviewing those settled routes, and keep route code
as a client-side consumer of `lib/private-study/`; static page generation must
not open IndexedDB. Do not add navigation during the Phase 8A handoff.

## Preference compatibility

Review `lib/useLanguagePreference.ts`, theme preferences, reader typography,
and other existing localStorage preferences before integration. Phase 8B must
not migrate them into the private-study `records` store or change their keys.
Backup and clear-data work must distinguish content records from preferences
so a reader can understand which data is exported or removed.

## Reading-progress compatibility

Review `lib/useStudyProgress.ts`, `lib/ashtavakra-progress.ts`, study-plan or
journey progress, and recent-reading keys before enabling the generic
`reading` record. Existing progress remains authoritative until a versioned,
idempotent migration is tested. Do not translate completion, position,
history, and streak concepts into one another; they have different semantics.

## Search boundary

Private study content must remain outside public and generated search indexes,
search shards, search-worker payloads, analytics, and query telemetry. A future
local private search, if approved, must query IndexedDB locally and present its
results separately from canonical scripture search. It must not log note or
journal text.

## Service-worker and offline boundary

`public/sw.js`, offline packs, and worker code are Phase 7-owned integration
surfaces. IndexedDB records are not precache assets. Backup archives and private
record payloads must not enter Cache Storage, service-worker logs, background
sync, or offline-pack manifests. A saved reference may remain visible offline,
but opening it must handle canonical content that is absent from the installed
offline pack.

## Migration contract

Existing localStorage data remains authoritative until a separately reviewed
migration is implemented. Migration must:

1. export or preserve the legacy data before writing;
2. map legacy identities through `CanonicalReferenceResolver`;
3. skip and report unresolved entries without inventing references;
4. write records in one transaction;
5. record a versioned migration marker only after the transaction completes;
6. be repeatable without creating duplicate records; and
7. keep the legacy keys until backup, restore, and rollback behavior is tested.

## Rebase, integration, and regression sequence

1. Finish and commit Phase 7 in its own worktree.
2. Confirm both worktrees are clean and record both commit SHAs.
3. Refresh this branch from the chosen integration base without carrying dirty
   files between worktrees; do not merge an unfinished or dirty Phase 7 tree.
4. Regenerate the protected-file manifest and review the completed Phase 7 diff
   for ownership changes and overlapping paths.
5. Resolve conflicts by preserving Phase 7 presentation and canonical content,
   then reapply the Phase 8A contract at settled client-side insertion points.
6. Run the repository typecheck/build gates and the Phase 7 visual,
   accessibility, motion, verse-presentation, Story Deck, Patrika, homepage,
   search, and offline regression checks before adding UI behavior.
7. Implement the canonical resolver and test missing, ambiguous, unpublished,
   and valid references.
8. Integrate verse save and annotation actions in one small commit.
9. Integrate personal-study routes and reading-progress compatibility in
   separate commits.
10. Add legacy migration, backup/restore, diagnostics, and clear-data behavior
    only with runtime persistence, rollback, privacy, and corruption tests.
11. Re-run static export, service-worker/offline, search-boundary, privacy,
    backup round-trip, and Phase 7 regression suites before release.

Expected conflict surfaces are verse action components, bookmarks and journal
routes, backup/clear-data controls, progress hooks, navigation, search UI and
workers, service-worker/offline configuration, and shared package or TypeScript
configuration. Story Deck, Patrika Studio, homepage, global CSS, canonical
datasets, and editorial files remain protected unless a later integration task
explicitly assigns ownership.
