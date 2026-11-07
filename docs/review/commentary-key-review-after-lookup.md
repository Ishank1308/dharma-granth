# Commentary key review after lookup change

`commentary-key-findings-next.json` is a fresh read-only snapshot using `lib/commentary-lookup.ts`. The modeled lookup prefers an exact verse number, then uses a normalized key only when it identifies a single verse in the full chapter. An ambiguous normalized alias is withheld rather than assigned to multiple verses. This report compares reader chapter shards with the monolithic data and does not establish behavior on a deployed site.

The report covers 5,430 entries in 72 files and has 325 findings. Reasons overlap:

| Reason | Count | Meaning |
| --- | ---: | --- |
| `reader_key_unmatched` | 292 | No verse in the modeled reader chapter maps to this published key. |
| `reader_alias_suppressed` | 18 | The normalized key is ambiguous and is not used as a fallback for at least one verse. |
| `reader_key_shadowed` | 14 | Another exact entry takes precedence over this key for its matched verses. |
| `reader_key_partially_shadowed` | 4 | The key is selected for some matched verses and another entry takes precedence for others. |
| `reader_monolith_disagree` | 70 | A key matches a verse in only one of the reader and monolithic views. |
| `monolith_key_unmatched` | 222 | The monolithic source has no match. |
| `monolith_key_ambiguous` | 18 | Multiple monolithic verses map to the key. |
| `snapshot_stale` | 1 | A queued Sanskrit snapshot differs from the monolithic source. |

These remain review candidates, not automatic corrections. In Mahabharata chapter 1, the old normalized `1:1` alias matches 225 verse numbers; the new lookup does not assign it to those dotted verses without an exact key. In Prashna 1.9, the exact `1:1.9` entry now takes precedence over `1:9`. The Agnipuran shard/monolith discrepancy and the stale Tejobindu 5:7 snapshot still need independent source review.

Run `npx tsx scripts/report-commentary-keys.ts --out <new-file.json>` to refresh the report. Nearby verse numbers are leads for review, not suggested remappings.
