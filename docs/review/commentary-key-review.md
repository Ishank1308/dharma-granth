# Commentary key review: pre-fix snapshot

The accompanying `commentary-key-findings.json` is the read-only snapshot from before the collision-aware lookup change. At that time, the modeled lookup preferred the normalized key over the raw verse number. For the current behavior and a refreshed report, see `commentary-key-review-after-lookup.md` and `commentary-key-findings-next.json`.

The snapshot covers 5,430 entries in 72 files and contains 333 findings. A finding can have more than one reason, so the following counts overlap:

| Finding | Count | Meaning |
| --- | ---: | --- |
| `reader_key_unmatched` | 292 | No verse in the modeled reader chapter maps to this published key. |
| `reader_key_ambiguous` | 18 | The same published key is selected for more than one verse in the modeled reader lookup. |
| `reader_key_shadowed` | 22 | A raw-number entry is bypassed because the normalized key is present. |
| `reader_monolith_disagree` | 70 | A key matches a verse in one source view but not the other. |
| `monolith_key_unmatched` | 222 | No verse in the monolithic source maps to the key. |
| `monolith_key_ambiguous` | 18 | Multiple monolithic verses map to the same key. |
| `snapshot_stale` | 1 | A queued Sanskrit snapshot differs exactly from the monolithic source. |

These are review candidates, not proof that each commentary is wrong. The report lists matched source verse identifiers, the modeled selected key, the source paths, exact snapshot matches when available, and up to five nearby reader verse numbers. Nearby numbers are clues for inspection, not proposed remappings. This models the named lookup function and does not establish the behavior of every reader surface or live deployment.

## Representative findings

- **Mahabharata 1:1:** 225 verse numbers in chapter 1 mapped to the normalized key `1:1` in the earlier modeled lookup. The same published entry would have been selected for each. Review the reader's numbering and commentary provenance before changing either the keys or text.
- **Prashna 1:1.9:** the earlier lookup shadowed raw key `1:1.9` with normalized key `1:9` for verse number `1.9`. Compare the two entries and their intended verses before choosing a remedy.
- **Agnipuran 1:1:** the monolith has a matching verse, while the current chapter 1 shard has zero verses. Determine why the shard and monolith differ before rebuilding or altering either.
- **Tejobindu 5:7:** the pending queue snapshot includes material now split into 5:6 and 5:7; the current monolith's 5:7 contains only the latter portion. Review the original explanation against the current split; do not simply replace its Sanskrit snapshot.

## Reproduce

```bash
npx tsx scripts/report-commentary-keys.ts --out docs/review/commentary-key-findings-refresh.json
npx tsx scripts/report-commentary-keys.ts --out docs/review/muktika-key-findings.json --scripture muktika
```

The report command requires a new output filename and refuses to overwrite one that already exists. It does not modify scripture or commentary data. Run the separate `check-commentary-keys.ts` command when a nonzero exit status for key or snapshot issues is required.
