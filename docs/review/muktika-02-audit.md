# Muktika chapter 2: commentary review

Review scope: the 78 entries that were `pending` in `data/ai-commentary/muktika.json` at the time of review, compared with the current chapter 2 source in `public/data/scriptures-full/muktika.json` and the requested Hindi व्याख्या specification. Four were subsequently replaced and approved at the user's direction; their original entries are preserved in `docs/review/muktika-02-originals.json`. The other 74 remain pending.

## Findings across the pending drafts

- All 78 explanations are shorter than the requested 200–280 words. Their lengths range from 122 to 177 words, using the register checker's whitespace-based count.
- All 78 explanations are single paragraphs. The requested format calls for paragraphs separated by blank lines, with the verse's setting, key words and a practical close.
- 73 explanations do not contain the reader address `आप` or its common inflected forms. A text search for this word is a screening check, not proof that the remaining five end with an appropriate practice.
- The repository register checker flags sentences in 15 pending verses: 2:6, 2:10, 2:11, 2:17, 2:20, 2:25, 2:30, 2:37, 2:44, 2:47, 2:50, 2:57, 2:58, 2:60 and 2:65. The two flags in 2:17 are false positives: `गलती` and `गलते` are forms of `गलना`, not the prohibited adjective `गलत`. The informal-address warning in 2:25 is valid because it directly addresses the reader as `तुम्हारा`.
- A separate literal scan for words in the user's list that are absent from the repository checker found candidates in 2:2, 2:10, 2:30, 2:36, 2:40, 2:48, 2:50 and 2:69. Check each occurrence in context before editing; a substring match alone is not proof of a prohibited word.
- 2:24 contains Latin text in the explanation. Source and editorial discussion should be placed in the review note, not the reader-facing explanation.
- 2:34's stored Sanskrit snapshot differs from the current source. Its draft and note describe verses 33 and 34 as one unit, while the current source has a separate 2:33 and a revised 2:34. Re-read the current 2:34 before preparing a new draft; do not merely replace its snapshot. The publisher's stale-text gate would skip the current draft if it were approved unchanged.

## Content observations from a sample

The following observations come from reading verses 2:1–10, 2:24–25, 2:34, 2:44, 2:47, 2:50, 2:56–57 and 2:65 against their local source text. They are examples for editorial review, not an exhaustive semantic review of the 78 entries.

- **2:6:** The reference to modern habit science is unsupported in the draft. Either substantiate it separately or remove it from the verse explanation.
- **2:24:** The text discusses competing English renderings inside the explanation and offers an interpretation of an uncertain compound. Preserve the uncertainty in a review note and check the Sanskrit against a reliable source.
- **2:25:** The closing directly addresses the reader informally. It also gives an interpretive causal account of birth and death that needs careful wording and review.
- **2:34:** The draft begins with material now assigned to 2:33 and its source note is outdated. Its expanded list of qualities should be clearly distinguished from the verse's `मैत्र्यादि`.
- **2:50 and 2:56:** Both include conjectures about difficult Sanskrit in the reader-facing explanation. The detailed sequence in 2:50 and the interpretation of the unusual compound in 2:56 need source verification; do not present conjectural repairs as established readings.
- **2:47:** The account of a breaking fibre making the elephant more agitated adds a detail that requires checking against the verse.

## Recommended next actions

1. Compare the uncertain readings and segmentation with a reliable source, especially 2:24, 2:34, 2:50 and 2:56. The local Hindi translations are marked as AI-generated and are not evidence of a printed edition.
2. Review each remaining draft for fidelity, sensitive claims and a concrete reader practice. Preserve the existing drafts and prepare revisions separately for review.
3. Recheck revised entries for the full requested register, 200–280 words, paragraph structure and respectful address. Approve only after editorial and source review; retain uncertainty in `reviewNote`.
4. Independently review the already approved 2:33 and 2:80 source notes. Their medium-confidence notes call for source verification even though the staging command marked them approved and publication included them locally.

The repository does not currently contain `scripts/check-commentary-keys.ts`; a general replacement must account for scripture-specific numbering. A targeted check previously confirmed that the published 2:33 and 2:80 keys and Sanskrit snapshots match the current Muktika source.

## Follow-up: source comparison and proposed revisions

The [Sanskrit Documents transcription of the Muktika Upanishad](https://sanskritdocuments.org/doc_upanishhat/muktika.html) presents 2:33 and 2:34 separately and reproduces the difficult phrases in 2:24, 2:50 and 2:56 as they appear in the current local Sanskrit. This establishes agreement with that transcription, not the independence or accuracy of its textual source. It does not establish a correct grammatical interpretation or validate a conjectured emendation. A reliable printed source and a Sanskrit specialist remain necessary for the uncertain readings.

Replacements for 2:24, 2:34, 2:50 and 2:56 are in `docs/review/muktika-02-revisions.json`. The user approved their publication; they were staged and published locally. The original queue entries and their snapshots are preserved in `docs/review/muktika-02-originals.json`. The replacements retain medium-confidence source notes, and the wording avoids presenting uncertain interpretations as settled. The chapter's other 74 pending entries still require individual editorial review and revision.
