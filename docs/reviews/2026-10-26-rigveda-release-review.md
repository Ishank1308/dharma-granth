# Rigveda source and citation review — 2026-10-26

Reviewed base: `f2ecafe1` (PR #40). The corpus contains 10,531 verses in 10 mandalas and 1,027 hymns. Hymn 8.67, comprising 21 verses in the repository's count table, is absent from the source and remains unavailable. Only 7 verses retain curated translations and notes. Catalogue and source metadata disclose the missing hymn and limited translations.

## Source preservation

- Compared every published hymn with the corresponding [DharmicData Rigveda source](https://github.com/bhavykhatri/DharmicData/tree/main/Rigveda), retrieved on 2026-10-26. All 1,027 normalized Sanskrit letter sequences matched in order. Normalization removed source headers/colophons, layout, verse-number marks and svara marks, and converted colon-shaped visargas as documented by the importer.
- Separately compared the counts of each svara-mark character per hymn: all 1,027 matched. Accent placement has not been independently collated against a printed edition.
- Verified the documented source numbering correction: the item filed as source hymn 8.67 supplies published hymn 8.66. No text was invented for the unavailable 8.67.
- Every available hymn has the expected verse count. There are no duplicate verse identifiers or blank Sanskrit verses. The canonical-manifest comparison with `d6abd506` changes only Rigveda.
- Inspected all 7 curated verse records against their published Sanskrit references: 1.1.1, 3.62.10, 8.48.3, 8.58.2, 10.90.1, 10.129.1 and 10.129.6. Editorial notes remain subject to the site's review labels; independent translation review and scholarly approval remain outstanding.

## Citation correction

The deployed search accepted `rv 1.1.999` as an exact reference and generated a link to a nonexistent verse. The resolver now uses the hymn-level verse-count table already used by the importer. It rejects a rik beyond the hymn's end while continuing to exclude unavailable hymn 8.67.

The search regression test checks every published Rigveda verse, rejects the next rik after each available hymn, covers zero/out-of-range mandalas and hymns, and checks the missing hymn and Devanagari digit input. Existing Gita and Katha citation checks remain included.

## Validation

Search query checks and TypeScript validation passed. Lint passed with the 3 existing hook-dependency warnings in unrelated components. The isolated checkout was hydrated with Git LFS and scripture shards were generated before its first production build. The production build completed successfully, including all 10 canonical/content/pilot/commentary checks, export validation, site rules and sitemap validation. The export has 19,496 files after pruning. The advisory JavaScript budgets remain exceeded on the 4 measured page types; their non-strict check returns success and the budgets were not changed. Deployment verification is recorded by the release workflow.

Independent printed-edition collation and full scholarly review remain outside this automated release check. Do not describe the corpus as fully complete while hymn 8.67 is absent.

## Reconciliation with PR #41

Master advanced to `1babe66d` during validation, adding the Atharvaveda rebuild. The publication guard stopped the stale-base push, and the citation fix was rebased onto the new master. Rigveda source output is unchanged by that PR.

The added Atharvaveda corpus was checked against all 20 [DharmicData source files](https://github.com/bhavykhatri/DharmicData/tree/main/AtharvaVeda). Its 5,985 mantras form 729 available hymns. All per-hymn normalized letter sequences and svara character counts matched after the importer's documented heading, duplicate-block and paryaya grouping adjustments. All hymn counts matched the repository table, with no duplicate verse identifiers or blank Sanskrit. Unavailable hymns 20.3 and 20.13 remain absent. English and Hindi translations are withheld pending alignment. The 5 retained Hindi note references (4.13.6, 11.5.1, 11.5.17, 12.1.1 and 12.1.12) point to the corresponding published Sanskrit verses. The same independent-edition and scholarly-review limits apply.

After reconciliation, search regression checks, the full production build (including canonical/content checks, export, site rules and sitemap validation), and all 11 local smoke URLs passed again. The final pruned export contains 19,350 files. The advisory JavaScript budget warnings remain as described above.
