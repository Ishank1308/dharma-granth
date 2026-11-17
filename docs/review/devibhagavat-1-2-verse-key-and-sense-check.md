# Devī Bhāgavata Purāṇa 1.2 — independently written Hindi draft and source key audit

Date: 17 November 2026. Part of corpus completion tracker #229.

**Scope:** Skandha 1, Adhyāya 2, “ग्रन्थसङ्ख्याविषयवर्णनम्”, Sanskrit numbered verses **1–40**. Repository import key `2:1` through `2:40` (global chapter number 2). The existing chapter 1 batch `1:1`–`1:25` is untouched. Together the staged file has **65 individual Hindi meaning entries**.

## Evidence

- Numbered Sanskrit witness consulted: https://sanskritdocuments.org/doc_purana/devIbhAgavatam01.html# (Skandha 1, chapter 2). Sanskrit transcription attributed there to Vishwas Bhide, last updated 30 March 2024. This was consulted for private comparison and **no Sanskrit text was copied into the staged batch**.
- Repository chapter mapping: `scripts/fetch-devibhagavat.ts` creates one global library chapter per Sanskrit adhyāya, starting with 1.1 as chapter 1 and 1.2 as chapter 2. The same method must be checked after any edition or seed-source change.
- The repository's own `scripts/test-devibhagavat-source-integrity.ts` now asserts the published chapter 2 contains exactly 40 individually numbered Sanskrit verses, checks selected witness phrases in verses 1, 11, 18, 34, 40, and checks all 65 draft meaning keys against the published Sanskrit verse numbers. This verifies a *subset* of source text and complete draft key enumeration; it does **not** verify every gloss.
- Hindi wording is newly drafted verse by verse from the Sanskrit; it is not a transcription or modern translation from the Gita Press printed Hindi, and no print translation is represented as the author of these lines.

## Verse-range sense register

| Verses | Content in source | Safeguard |
|---|---|---|
| 1–5 | Sūta's gratitude, praise of Bhagavatī, creation/protection/dissolution | Keep the speaker and Goddess the subject; avoid suggesting empirical proof |
| 6–10 | Questions about Brahmā and Viṣṇu as independent creators; refuge and invocation of Śakti | Preserve the text's rhetorical questions and the saguna/nirguna distinction |
| 11–17 | Traditional description of 18,000 verses, 12 skandhas and 318 chapters, including counts per skandha | Attribute numeric statements to the work's own convention, not to modern audited corpus |
| 18–26 | Five Purāṇa marks; three Śakti forms; genealogies, Manvantaras, Mahābhārata as fifth Veda | Explain traditional terms and attribute the “125,000 verse” number as tradition |
| 27–34 | Śaunaka's questions and Naimiṣa forest wheel narrative; sacrificial description | Distinguish narrated belief from historical fact; preserve explicitly **animal-free** rites in 2.34 |
| 35–40 | Request for the text; dharma/artha/kāma/mokṣa and Bhagavatī's qualities | Keep praise of liberation/desire-fulfilment as the source's devotional claims |

## Next steps that do not require owner approval

1. Let CI verify the newly added chapter-key and source-phrase checks, including all other scripture-integrity checks.
2. Independently compare all 40 verse readings against the repository's exact source edition, not just selected phrases. Verify divergences without copying the restricted source transcription.
3. Validate the new Hindi meanings at the verse level, correcting inaccurate or over-interpretive words; record any textual uncertainty, source variant, or unverified verse.
4. Promote individually validated content through the existing written-meaning workflow. Do **not** remove the `reviewStatus: unreviewed` flag or publish 65 entries merely because a test passes: batch-wide source fidelity has not yet been established.
5. Recompute the **published** Hindi coverage after any promotion, validate generated shards and deployment SHA, then continue chapter 3 and the remaining skandhas.

No external editorial sign-off from the site owner is required to execute this workflow. Claims of completeness or scholarly certification require actual evidence. Existing source datasets, source Sanskrit, and reader-facing published language coverage have **not** been modified in this PR.
