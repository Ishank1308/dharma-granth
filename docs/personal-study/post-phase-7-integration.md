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

## Merge order

1. Finish and commit Phase 7 in its own worktree.
2. Refresh this branch from the chosen integration base without carrying dirty
   files between worktrees.
3. Regenerate the protected-file manifest and review overlaps.
4. Implement the resolver in the settled canonical content layer.
5. Add UI integration in small commits, followed by legacy migration and
   backup/clear-data integration in separate commits.
