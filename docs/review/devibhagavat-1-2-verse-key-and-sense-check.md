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

## Publication implementation (PR #260)

The first 40 Hindi meanings, keyed `2:1`–`2:40`, are now explicitly applied to the **generated public chapter-2 shards** by `scripts/lib/source-checked-meaning-overlays.ts` after misaligned-OCR filtering. Every number is checked against a distinctive Sanskrit phrase from the cited 1.2 source witness before any meaning is emitted. `hindiSource: 'ai'` makes the machine-assisted provenance visible to readers, while the old printed-OCR review marker is cleared **only for those replaced meanings**. Source Sanskrit is never modified.

The importer for the whole 65-entry file still stays guarded; chapter 1's 25 drafts are not published through this change. This is a 40-verse, source-key-checked release, **not** a claim of printed Gita Press Hindi proofreading or formal Sanskrit-scholar certification. The release remains conditional on green CI and verified production deployment.

## Follow-up after this release

1. Verify that CI has generated the public chapter-2 shard, checked all 40 Hindi meanings within the shard, and passed the full reader/static export tests.
2. Continue full critical comparison against the exact repository source edition and annotate any variant readings as discovered; currently a 40-verse opening-phrase and verse-key gate is enforced, not a complete critical apparatus.
3. Validate the new Hindi meanings at the verse level, correcting inaccurate or over-interpretive words; record any textual uncertainty, source variant, or unverified verse.
4. Keep chapter-1 and other uncertain entries outside the publication allowlist until individually checked; never remove the global `reviewStatus: unreviewed` merely because chapter 2 passed.
5. Recompute the **published** Hindi coverage after the 40-entry release, validate deployed page text and deployment SHA, then continue the next source-checked chapter.

No external editorial sign-off from the site owner is required to execute this workflow. Claims of completeness or scholarly certification require actual evidence. Source Sanskrit and raw full-book JSON have not been modified; the generated **reader-facing chapter-2 shard is now intentionally changed** at publish time after checks pass.
