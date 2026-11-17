# Devī Bhāgavata — 1.3 verses 6–10, source-checked publication batch

Source witness: https://sanskritdocuments.org/doc_purana/devIbhAgavatam01.html (Skandha 1, Adhyāya 3, ślokas 6–10). Reference checked 17 November 2026.

These five verses continue Sūta's Purāṇa enumeration. The text states conventional figures as follows:
- 3:6: Brahmāṇḍa 12,100; Brahmavaivarta 18,000.
- 3:7: Vāmana 10,000; Vāyu 24,600. In the Sanskrit the `षट्शतानि` and `चतुर्विंशति...सहस्राणि` together express 24,600.
- 3:8: Viṣṇu 23,000; Varāha 24,000.
- 3:9: Agni 16,000; Nārada 25,000.
- 3:10: Padma 55,000; Liṅga 11,000. The final epithet's variant reading is not over-interpreted.

**Caution:** these are numbers as stated by this witness in its Purāṇa-list passage; they do **not** assert the verse count of every extant modern edition. The newly written Hindi meanings and तीन-खण्ड व्याख्या are AI-assisted, not Gita Press transcriptions or independently scholar-certified. The Sanskrit text and verse IDs remain unchanged.

Release protocol:
1. Existing 70 source-keyed entries remain; add exactly five for 3:6–3:10 (75 meanings and 75 unique explanations).
2. Explicit source-opening and verse allowlists must verify all five. No bulk approval and no newly unlocked unrelated verses.
3. The integrity test must check generated `public/data/scriptures-full/devibhagavat/ch-3.json` and `public/data/hi-commentary/devibhagavat.json` and preserve all 43 original Sanskrit verses; five new entries must be reader-visible and bear AI attribution.
4. Run Sanskrit/data integrity, formal-Hindi register, TypeScript/lint, static build, preview, browser tests; merge/deploy only after green checks. Live website verification remains separate.
5. All subsequent verses 3:11–3:43, later chapters, and the remaining scriptures stay incomplete.
