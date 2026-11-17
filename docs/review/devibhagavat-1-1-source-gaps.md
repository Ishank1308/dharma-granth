# Devi Bhagavata 1.1 — source and translation review (17 November 2026)

**State: Sanskrit source checked; Hindi draft remains UNREVIEWED for publication. Do not publish or apply yet.**

This review distinguishes the **published source** (`public/data/scriptures-full/devibhagavat.json`) from the **historical extraction staging file** (`scripts/devibhagavat_extracted.json`). The two must not be conflated. Draft #231 contains 25 independently phrased Hindi meanings in `data/written-meanings/devibhagavat.json`, with the explicit `reviewStatus: "unreviewed"` guard.

## Source comparison actually performed

1. Parsed the committed published Devi Bhagavata JSON at `master` (source identifies a proofread SanskritDocuments transcription by Vishwas Bhide). Chapter 1 contains complete two-line Sanskrit for 1:2, 1:3, 1:4, 1:6 and the full extended 1:13; all keys 1:1 through 1:25 exist.
2. Compared those 25 numbered Sanskrit readings manually with [SanskritDocuments Skandha 1, Adhyaya 1](https://sanskritdocuments.org/doc_purana/devIbhAgavatam01.html), including the speaker marker **शौनक उवाच** before 1:2 and the extended structure of 1:13. No missing half-line or numbering discrepancy was identified in the published 1:1–1:25.
3. Read each of the 25 *proposed* Hindi meanings against the same published Sanskrit verse and refined 1:7 (ब्रह्मसम्मितम्), 1:13 (त्रिविधानि पुराणानि), and 1:21 (धिक् सुधाम् / सद्यो) to preserve details omitted or softened in the first draft. This is an initial Sanskrit-semantic check, **not** independent Gita Press page-by-page review or certification of every nuance.

| Keys checked | Published Sanskrit | Draft Hindi | Open gate |
| --- | --- | --- | --- |
| 1:1–1:6 | Full, numbered readings present | Proposals checked against verse topic | Confirm exact print-edition variant, pages, and approval |
| 1:7–1:12 | Full, numbered readings present | Initial sense check; 1:7 refined | Confirm exact print-edition variant, pages, and approval |
| 1:13–1:18 | Full readings; 1:13 contains four Sanskrit lines in both online and published witnesses | 1:13 refined to include the threefold Purāṇa reference | Confirm exact print-edition variant, pages, and approval |
| 1:19–1:25 | Full, numbered readings present | 1:21 refined to retain strong source wording as an **attributed scriptural claim** | Confirm exact print-edition variant, pages, and approval |

## Historical staging defects — not defects in the published Sanskrit

| Key | Defect confined to `scripts/devibhagavat_extracted.json` | Published source finding |
| --- | --- | --- |
| 1:2 | The extract's `hindi` field contains Sanskrit from 1:3, not the Hindi meaning of 1:2. | Published 1:2 Sanskrit is complete. |
| 1:3 | Extracted `sanskrit` contains only the last line of 1:3. | Published 1:3 includes `अष्टादश पुराणानि…` and `कथितानि सुदिव्यानि…`. |
| 1:4 | Extracted `sanskrit` contains only the last line of 1:4; its Hindi paragraph is a grouped printed interpretation of 1:2–1:4. | Published 1:4 Sanskrit is complete. Do not treat grouped Hindi as a verse-owned Gita Press meaning. |
| 1:6 | Extracted `sanskrit` contains only the last line of 1:6. | Published 1:6 begins `समाजोऽयं मुनीनां हि…` and is complete. |
| 1:1–1:25 | Extracted `translation` duplicates `hindi`. | It is **not English translation coverage** and must never be counted as such. |

## Pending before promotion from Draft

- Identify and inspect **the actual Gita Press printed edition and page references** for each verse; record differences from the SanskritDocuments source. The Gita Press EPUB/OCR source paths referenced in repository scripts are local-only and were not present as reviewable files through GitHub. Do not claim those books were directly checked.
- Record a second editorial review of the independently phrased Hindi, including any uncertainty or interpretive additions. Avoid copying modern Gita Press language into a new public translation without rights clearance.
- Preserve verse-owned meaning separately from grouped commentary, with explicit span metadata for the latter.
- Confirm indexing and post-publish field audit on the final branch, run full `npm run check`, static export, link and browser tests.
- Only then change `reviewStatus` from `unreviewed` and apply the batch. The state intentionally remains blocked by the importer guard introduced in #256.

This document describes a concrete source-level advance, **not** complete editorial publication. Linked to issue #229.
