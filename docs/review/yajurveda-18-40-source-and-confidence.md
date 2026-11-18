# Yajurveda 18–40 — source alignment, confidence and release gate (17 November 2026)

**Draft PR #227 — source structurally checked; all 990 new AI commentaries held unpublished until editorial review.**

## What was checked

- The 23 staged chapter files `data/ai-commentary/staged/yajurveda-18.json` … `yajurveda-40.json` contain **1,026** explanatory draft entries. These are *draft commentaries*, not 1,026 independently checked Hindi translations.
- The cumulative `data/ai-commentary/yajurveda.json` increases from **983** existing queue entries on `master` to **1,973** on this branch: **990 new** entries, with 36 existing keys from chapter 18 already present in master. All 990 new queue records are labelled `status:"approved"`.
- Each of those 990 new queue records has a Sanskrit witness and a unique matching key in the current published 40-chapter Yajurveda source (1,975 Sanskrit verses); after the same whitespace/verse-punctuation normalization used by the queue, **990/990 match**. **0** missing, duplicate or mismatched keys were found. This validates *identity/placement only*, not the content of the translation or commentary.
- Among the 990 new queue entries, **283 are `confidence:"low"` and 707 are `confidence:"medium"`**. Low-confidence entries are especially concentrated in chapters 24, 25, 29, and 30.
- The same generic Yajurveda opening paragraph appears in **1,026 of 1,026** staged explanations; the statement that this edition lacks a printed Hindi meaning appears in **1,012 of 1,026**. These claims must be checked against the named edition rather than treated as per-verse original scholarship.

## Mitigation applied in the PR

- Added `data/ai-commentary/review-holds/yajurveda.json` with **all 990 new draft keys** (283 low-confidence and 707 medium-confidence), pending individual source and editorial review.
- `approvedAiEntries` now excludes held keys **even if the imported queue happens to call them approved**.
- `scripts/convert-commentary-to-json.ts` also skips companion `lifeLesson` and research notes in curated `yajurveda-rest.json` for held keys. This prevents uncertain modern context from appearing on the public site. The earlier PR's large rest-file changes are preserved separately as `data/ai-commentary/quarantine/yajurveda-modern-context-unreviewed.json`; that file is not imported by the publishing pipeline.
- Added a regression check `scripts/test-ai-commentary-review-holds.ts` to the content quality checks. The hold does not affect Sanskrit, previously published approved Yajurveda entries, or curated hand-written commentary.
- This is a non-destructive, source-controlled hold system because the large (~5 MB) queue file cannot reliably be replaced through the current GitHub connector; the registry itself is authoritative for publication. Do **not** remove a hold merely to satisfy a coverage target.

## Editorial gates still open

1. The All 990 new explanations require *individual* edition-aware Sanskrit/Griffith/Uvaṭa–Mahīdhara and editorial review before release. The 283 low-confidence drafts need additional uncertainty and ritual-context scrutiny; medium confidence does not constitute approval.
2. High-impact chapters 23 (Aśvamedha), 24 (animal-offering lists), 29 (ritual references), and 30 (Puruṣamedha) must separate literal/historical reading from present-day ethical interpretation. Do not state a symbolic explanation as the only historically attested meaning without evidence.
3. The common introductory paragraphs should be moved to chapter-level source context or shortened in a deliberate editorial/UI change; repeated template text does not make each verse explanation more reliable.
4. Compare against the *actual named print edition and pages* (the local Gita Press EPUB/OCR referenced by repository scripts was not accessible through GitHub in this review). Record who reviewed what and any variant readings.
5. Rebuild a clean merge tree against the current `master`, regenerate the `public/data/hi-commentary` output, verify held verse explanations and modern notes are absent from the resulting export, and run lint/types/CI/browser/deploy previews.

**Verdict:** Source/ID alignment is clear, but this 23-chapter AI commentary PR remains a **draft**. Passing technical checks must not be interpreted as a final scholarly imprimatur.

Related: #229.

## 17 November conflict-resolution integrity note

The clean rebase retains the 23 verse-specific Sanskrit-keyed staged chapter drafts and the independent 990-key hold ledger. The former PR's modified `yajurveda-rest.json` was not copied over the currently published rest source, because its new modern-context material is unreviewed and would also overwrite older curated content. Instead its exact blob is stored at `data/ai-commentary/quarantine/yajurveda-modern-context-unreviewed.json` for later editorial comparison; this directory is never part of `aiQueueScriptureIds` or the published `data/hi-commentary` fragments. The published JSON remains generated from current master sources and explicit hold filters.
