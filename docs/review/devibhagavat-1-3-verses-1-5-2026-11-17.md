# Devī Bhāgavata Purāṇa 1.3 — reader-visible verses 1–5

Date: 17 November 2026.

## Edition and scope

- Numbered Sanskrit witness: https://sanskritdocuments.org/doc_purana/devIbhAgavatam01.html, **Skandha 1, Adhyāya 3**, first five verses (of 43).
- The full local Sanskrit corpus is preserved unchanged. Chapter numbering in the application is global: Skandha 1 Adhyāya 3 is library chapter 3.
- Source openings are checked verse by verse at publication time. A matching opening does **not** certify the whole text against every manuscript or prove translation perfection.
- This release contains original AI-assisted Hindi meanings and 200–280-word **प्रसंग एवं भाव / पद-विवेचन / जीवन-साधना** explanations for `3:1` through `3:5` only; all are visibly AI-labelled and not attributed to Gita Press.
- Sanskrit meanings were checked against their numbered verse sense: 3:1 Sūta's promise to transmit what he heard from Vyāsa; 3:2 the mnemonic of Purāṇa initials; 3:3 Matsya and Mārkaṇḍeya counts; 3:4 Bhaviṣya count; 3:5 Bhāgavata and Brahma counts.
- **Ambiguity:** at `3:3`, the witness has `ग्रहसहस्रं` for the Mārkaṇḍeya tally. The Hindi meaning quotes this textual expression without manufacturing a precise number. A critical-edition or traditional-commentary collation remains necessary to resolve that lexical reading.

## Release proof

- Existing 65 entry corpus remains; this adds exactly five meaning and five structured-explanation entries (total 70).
- Guarded meaning overlay targets only keys `3:1`–`3:5`, checks source openings, and requires **all 43 original chapter verses** to remain present.
- AI commentary allowlist admits only those five additional entries if original Sanskrit and witness URL match.
- `scripts/test-devibhagavat-source-integrity.ts` checks the actual generated `ch-3.json` and public `hi-commentary/devibhagavat.json`, AI labels, source preservation and 200–280-word distinct explanations.
- Normal full CI/static export/browser checks must pass before merging. Production and live custom-domain content must be independently checked after deploy.
- Remaining `3:6`–`3:43` and later chapters still require separately source-aligned writing; this is **not** completion of all 18,385 historically listed Devī Bhāgavata verse records or the 67-text library.
