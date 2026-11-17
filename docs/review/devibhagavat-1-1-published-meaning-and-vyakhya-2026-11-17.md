# Devī Bhāgavata Purāṇa — Skandha 1, Adhyāya 1 (Śaunaka-praśna)

**Release date:** 17 November 2026. **Scope:** Reader-visible original AI-assisted Hindi meaning and structured व्याख्या for chapter **1:1–1:25**, adding to the already published **2:1–2:40**.

## Numbered source witness

[स्रोत: SanskritDocuments, Devī Bhāgavata Skandha 1](https://sanskritdocuments.org/doc_purana/devIbhAgavatam01.html), heading **१.१ प्रथमोऽध्यायः । शौनकप्रश्नः ।** (verses 1–25). The publishing overlay in `scripts/lib/source-checked-meaning-overlays.ts` checks all **25 unique current source verse keys** and distinctive literal Sanskrit openings before overlaying new original Hindi text. The commentary publication gate in `data/hi-commentary/_ai-queue.ts` checks the same 25 exact opening/witness pairs and refuses mismatched keys. The source text itself is unchanged. The full book/printed Gita Press edition has **not** been critically collated for all variants.

## Verse-specific content register

| Range | Actual subject of verses | Commentary safeguards |
|---|---|---|
| 1 | Invocation to the first knowledge / Mother of consciousness | Prayer, not empirically proven causal claim |
| 2–7 | Śaunaka's welcome, Vyāsa's Purāṇas, five lakṣaṇas, Naimiṣa assembly and blessings | Preserve speaker and chronology; distinguish conventional count from modern verified edition |
| 8–10 | Hearing and taste analogies, serpent-as-hearer simile | Treat as literary analogy; do not assert biological claim about snake hearing or demean people with disabilities |
| 11–15 | Kali-age concerns, use of time, polemical dialectics, philosophical guṇa classification and Purāṇa structure | Report guṇa categories as the source's own view, never devalue philosophical groups or contemporary communities |
| 16–20 | The Goddess's Bhāgavata, expanded hearing request, guru-transmission, nectar simile | Distinguish Devī Bhāgavata from similarly named texts; preserve the devotee's perspective |
| 21–25 | Nectar, yajña and temporary svarga versus spiritual knowledge and liberation; Śaunaka's final plea | Religious beliefs, not medical or physical guarantees; distinguish religious merit from historical proof |

Each chapter-1 entry uses the site's dignified 200–280-word guideline with **प्रसंग एवं भाव / पद-विवेचन / जीवन-साधना** as three distinct, reader-visible paragraphs. The commentary is marked `ai: true`; original AI-assisted Hindi meaning is marked `hindiSource: 'ai'`. No Gita Press printed Hindi has been copied into new published entries, and no scholar certification is claimed.

## How the release verifies what readers actually receive

- `scripts/test-devibhagavat-source-integrity.ts` checks the 25 source keys and 25 Hindi values in the **generated public chapter-1 shard**, alongside the existing 40 chapter-2 values. It verifies all 65 published commentary JSON entries, their Sanskrit openings, AI labels, three movements, 200–280 word length and zero Hindi-register violations.
- `scripts/test-ocr-hindi-review.ts` preserves unverified printed OCR in canonical data and holds other queue entries, while explicitly allowing the 25 independently drafted Hindi meanings to supersede chapter-1 OCR in the reader.
- `scripts/shard-scriptures-full.ts` has a revised cache stamp to prevent stale chapter shards from being reused.
- Full build, export/SEO checks, automated browser tests and Cloudflare deploy SHA must pass before marking this release live.

**Definition of complete here:** Both first two chapters have original meaning and structured व्याख्या for all their 65 verses, with limited numbered-source comparison, not proof of completion of the 18,385-item work or the site's 67-text corpus.
