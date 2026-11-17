# Devi Bhagavata 1.1 — source/verse review log (2026-11-17)

**Status: UNREVIEWED. Do not apply or publish this batch yet.**

This log records an initial cross-check for draft PR #231's 25 independent Hindi meanings. It is not an editorial approval, an endorsement of one edition over another, or a licence to reproduce a modern translation.

## Sources examined

- Committed staging file: `scripts/devibhagavat_extracted.json` (the existing Gita Press-derived OCR/extraction; **not** an authoritative edition).
- Independent ancient Sanskrit witness: [SanskritDocuments, Devi Bhagavata Skandha 1, Adhyaya 1](https://sanskritdocuments.org/doc_purana/devIbhAgavatam01.html).
- Draft meanings: `data/written-meanings/devibhagavat.json`, still marked `reviewStatus: "unreviewed"`.

The actual printed Gita Press edition's verse breaks, especially where a meaning spans several verses, still need to be checked against the edition/page scans before approval.

## Specific staging defects

| Key | Finding | Required review |
| --- | --- | --- |
| 1:2 | Staged Hindi is the opening Sanskrit half-line of the following verse, not a Hindi meaning for 1:2. | Restore proper alignment; do not count it as translated Hindi. |
| 1:3 | Staged Sanskrit contains only the second half-line; the independent Sanskrit witness includes a first half about the eighteen Purāṇas. | Check actual published Sanskrit and printed edition; preserve complete verse boundaries. |
| 1:4 | Staged Sanskrit contains only the second half-line; an earlier half-line about the five Purāṇa characteristics is omitted there. | Reconcile Sanskrit splitting before placing a verse-owned meaning. |
| 1:4 Hindi | The extracted printed Hindi paragraph covers verses 2–4 as a group. | Preserve passage attribution; do not represent a grouped explanation as a one-verse translation. |
| 1:6 | Staged Sanskrit contains only the second half-line, excluding the line introducing the assembled sages. | Verify source completeness and verse numbering. |
| 1:1–1:25 | Extracted `translation` duplicates `hindi`, not independently translated English. | Never count duplicated extracted Hindi as English coverage. |

These defects are established **for the staged extraction**. They are not proof that the currently published full-book Sanskrit has the same missing halves.

## Approval criteria

1. Record the edition identifier and printed page(s) for each 1:1–1:25 verse.
2. Verify complete Sanskrit and verse numbering against the selected edition; record any variant readings.
3. Confirm the independently written Hindi meaning belongs to that same Sanskrit verse. Where the printed Hindi spans several verses, keep its range visible rather than duplicating or misattributing it.
4. Preserve historical/theological interpretation separately from literal meaning, and confirm redistribution rights.
5. Resolve all 25 reviews; only then update the draft's review marker and consider applying the meanings.

Ref: corpus-completion issue #229.
