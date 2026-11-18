# Mahabharata cumulative Hindi draft — repeated-meaning cross-check (17 November 2026)

**Scope:** PR #235, `data/written-meanings/mahabharata.json`, blob `32d1c2896279a61917c92ecaf713965db0d6ea5e`. This report **does not approve the translations or their publication**.

## Source and method

1. Parsed all **43,823** independently drafted Hindi-meaning keys for parvas 1–8.
2. Grouped entries with an **exactly identical nontrivial Hindi meaning** at more than one key: **25 groups**.
3. For every key in those 25 groups, read the Sanskrit `text` at matching `book:chapter.shloka` from the upstream [DharmicData Mahabharata files](https://github.com/bhavykhatri/DharmicData/tree/main/Mahabharata), which the repository's `scripts/seed-mahabharata.ts` names as its seed source.
4. Compared the Sanskrit after whitespace normalization, **not** a critical-edition manuscript collation and **not** a comparison with the local Gita Press books.

**Result:** all repeated-meaning keys existed in the upstream Sanskrit files. **14 groups** have exactly the same normalized Sanskrit text at every key; **11 groups** have Sanskrit variants that require semantic/editorial comparison. Many are apparently repeated refrains or very similar variant readings, not automatically a copying mistake.

## Groups inspected

| Parva | Repeated keys | Sanskrit comparison | Editorial interpretation |
| --- | --- | --- | --- |
| 1 | 79.9, 79.16, 79.26 | Variants | Refrain about returning youth after a thousand years, wording differs |
| 1 | 122.3, 122.36 | Same | Shared stanza about kings and friendship |
| 1 | 122.9, 122.37 | Variants | Nearly parallel social-status comparison |
| 2 | 54.7, 54.15, 54.18, 54.23, 54.27, 54.29, 58.4, 58.6, 58.8, 58.10, 58.15, 58.21, 58.25, 58.28 | Same | Identical repeated dice-game `जितम्` refrain — **do not flag as duplicated by default** |
| 2 | 66.19, 67.10 | Same | Repeated exile condition |
| 3 | 67.9, 72.18 | Same | Repeated narrative question |
| 3 | 68.10, 72.27 | Same | Repeated narrative statement |
| 3 | 96.6, 96.11, 96.17 | Same | Repeated accounting statement |
| 3 | 96.10, 96.16 | Variants | Different pronouns; compare rendering |
| 4 | 3.10, 9.13 | Variants | Synonymous introductory particles |
| 5 | 36.58, 62.19 | Same | Shared family metaphor |
| 5 | 88.78, 135.14 | Same | Shared kṣatriya passage |
| 5 | 88.80, 135.20 | Variants | Small lexical differences in Bhīma-Arjuna simile |
| 5 | 88.84, 135.16 | Variants | Differing word order, similar sense |
| 5 | 157.6, 158.9 | Same | Repeated appeal to Pandava |
| 6 | 16.25, 18.5 | Variants | Similar description of decorated elephants/rathas |
| 6 | 41.36, 41.51, 41.66, 41.77 | Same | **Identical Sanskrit** `अर्थस्य पुरुषो दासो...` — legitimate refrain |
| 6 | 45.61, 55.20 | Same | Repeated attack description |
| 6 | 114.13, 114.46 | Same | Repeated attack on Bhīṣma |
| 7 | 65.26, 72.12 | Variants | Orthographic difference in a battle passage |
| 7 | 94.11, 115.15 | Variants | Different verb `विभिद्य` / `विदार्य` |
| 7 | 108.30, 109.2 | Variants | Orthographic difference in arrows/elephants simile |
| 7 | 131.117, 136.7 | Variants | Different descriptions of severed elephant trunks (`विचलद्भिर` / `लुठमानैः`); compare nuance |
| 7 | 132.38, 136.11 | Same | Repeated passage |
| 7 | 132.40, 136.13 | Same | Repeated passage |

Counts are source-structure checks, **not proof that the Hindi choices preserve every lexical shade**. The **11 variant groups** should have a second human/qualified Sanskrit review where word choice matters. Avoid automatic deduplication or blanket failure merely because Hindi strings recur.

## Remaining merge gates

- Write/commit a machine-readable omission register for the **161 Karṇa Parva meaning keys** described as deliberately skipped by PR #235, with a reason and status for each. Readers must not see the source's omission silently represented as a translated verse.
- Audit all non-repeated meanings against the same source (this report addresses only 25 repeated-string clusters, not the 43,823 distinct keys).
- Independently check the printed edition/variant provenance, the `.json.gz` clean-checkout unpack sequence, link/reading routes and the final merged-tree CI. Never present a statistical audit as human editorial sign-off.

Related to #229; PR #235 remains draft.
