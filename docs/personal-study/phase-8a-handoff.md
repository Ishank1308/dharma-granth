# Phase 8A foundation handoff

Freeze date: 2026-10-19 (Asia/Calcutta)

Phase 8A implementation is feature-frozen. UI integration and product-scope
expansion are deferred until Phase 7 is complete.

## Repository state

- Worktree: `C:/Users/ishan/.codex/worktrees/phase-8a-private-study-foundation/dharma-granth`
- Branch: `codex/phase-8a-private-study-foundation`
- Starting commit: `eeb44b6c45982de72ce91029c80cf62fb04cc73a`
- Ending foundation commit: `02127c215f27e7d9bcf980295e19a40824b1aa2d`
- Final status: clean after the handoff-documentation commit
- Modified existing files: none
- Added files: this report, two other documents under
  `docs/personal-study/`, and five modules under `lib/private-study/`

The final changed-file assertion permits only `lib/private-study/` and
`docs/personal-study/`. No Phase 7 UI file or canonical scripture dataset is
part of the Phase 8A diff.

## Architecture

### Domain types

`StudyRecord` represents one device-local bookmark, note, highlight, or reading
record. Every record has a caller-owned ID, a canonical verse reference, and
created/updated ISO date strings. Notes may contain text and highlights may
contain a constrained color identifier. `StudyArchive` is the versioned backup
envelope.

### Persistence

- Technology: browser IndexedDB
- Database: `dharma-private-study`
- Database schema version: `1`
- Object store: `records`, keyed by `id`
- Index `verse`: non-unique index over the encoded canonical tuple
- Index `kind`: non-unique index over record kind

The module opens IndexedDB only when a browser calls the storage API. It does
not access browser globals during module evaluation.

### Migration strategy

Version 1 creates the `records` store and its two indexes in
`onupgradeneeded`. No later database migration exists yet. Legacy localStorage
migration is documented as a post-Phase-7 operation: preserve/export legacy
data first, resolve every identity canonically, write in one transaction, mark
completion only after commit, remain idempotent, and retain legacy keys until
rollback is verified.

### Errors

Validation failures throw ordinary `Error` instances. IndexedDB open, request,
blocked-open, transaction, and availability failures reject promises with
human-readable messages. There are no typed error subclasses or recovery UI.

### Canonical references

A reference is the tuple `scriptureId/chapterId/verseId`. Syntax normalization
lowercases the scripture ID, trims all segments, rejects unsafe segment shapes,
and encodes the tuple as JSON to avoid key collisions. Syntax validity does not
prove content existence. The typed `CanonicalReferenceResolver` contract
requires the settled canonical content layer to return exactly one published
reference and canonical path, or reject it as invalid, missing, ambiguous, or
unpublished. Matching by display text, Sanskrit, IAST, translation, mutable
labels, or display order is prohibited.

### Backup and import

- Format discriminator: `dharma-private-study`
- Archive version: `1`
- Payload: export timestamp plus validated records
- Export: serializes all records to a plain object for a future JSON download
- Import: parses JSON, checks format/version/record array, validates every
  record, rejects duplicate IDs, then merges by ID in one IndexedDB transaction

Validation completes before the import transaction begins. This prevents a
known-invalid archive from partially writing records.

### Privacy boundaries

The foundation stores data on the current device and contains no account,
authentication, cloud synchronization, analytics, or network code. Canonical
scripture content is referenced by ID rather than copied into private records.
Host diagnostics must not read or log note text. Data becomes portable only
when a future UI explicitly exports an archive.

## Capability status

| Capability | Status | Scope in the frozen foundation |
|---|---|---|
| Annotations | Implemented but integration pending | `note` and `highlight` records, text/color validation, CRUD persistence |
| Journal entries | Deferred | No journal domain or editor |
| Saved references | Implemented but integration pending | `bookmark` records and canonical tuple lookup |
| Collections | Deferred | No collection model |
| Reading history | Implemented but integration pending | Generic `reading` records; no capture UI |
| Reading positions | Deferred | No position or scroll-offset model |
| Preferences | Deferred | No preference store |
| Storage health checks | Deferred | Availability/open failures exist; no diagnostic service |
| Schema migrations | Contract only | Version 1 creation exists; later upgrade and legacy migration rules are documented |
| Backup serialization | Implemented but integration pending | Version 1 archive object export |
| Backup validation | Implemented but integration pending | Full pre-write validation and duplicate-ID rejection |
| Import planning | Contract only | Transactional, idempotent legacy migration plan documented |
| Data-clearing operations | Deferred | Single-record deletion exists; no clear-all operation |
| Canonical-reference resolution | Contract only | Syntax normalization and typed host resolver; dataset binding deferred |
| Static-build safety | Implemented but integration pending | No browser-global access at module evaluation; dedicated import test absent |

No capability is classified as `Implemented and tested` because the frozen
foundation has compile validation but no runtime unit or browser persistence
suite.

## Executed checks

- Targeted typecheck:
  `C:\Users\ishan\Music\dharma\dharma-granth\node_modules\.bin\tsc.cmd --noEmit --incremental false --skipLibCheck --lib dom,es2022 --target es2022 --module esnext lib/private-study/types.ts lib/private-study/canonical.ts lib/private-study/store.ts lib/private-study/integration.ts`
- Whitespace/error check: `git diff --check`
- Changed-file boundary: automated comparison of every path in
  `git diff --name-only eeb44b6c45982de72ce91029c80cf62fb04cc73a..HEAD`
  against the two permitted prefixes

The targeted typecheck and `git diff --check` passed. Dedicated unit,
validation-behavior, IndexedDB persistence, migration, backup round-trip,
privacy, and static-import tests are not present and were not executed. No
claim is made for those test categories.

## Known limitations

- IndexedDB can be disabled, unavailable, cleared by the browser, or evicted.
- Private browsing may provide temporary storage, reduce persistence, or block
  IndexedDB depending on the browser.
- Quota is browser-managed; there is no quota estimate, capacity warning, or
  recovery workflow.
- Only initial schema creation exists. No database-version upgrade has been
  exercised.
- Existing localStorage data is not migrated and remains authoritative.
- Canonical references are not yet bound to the repository's published content
  registry; the resolver is a contract only.
- All UI, navigation, editor, save-action, Story Deck, Patrika, homepage, and
  theme work is deferred.
- Offline packs have no integration with private records. Saved references may
  point to canonical content that is unavailable offline.
- Export, import, clear-all, diagnostics, and recovery are not exposed through
  product UI.
- Post-Phase-7 integration requires a refreshed protected-file manifest,
  overlap review, canonical resolver implementation, backup/clear-data wiring,
  and runtime tests before reader-facing release.
