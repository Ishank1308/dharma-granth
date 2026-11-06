# Data Quality Backlog — `scriptures-full`

_Audit of `public/data/scriptures-full/*.json` — the JSON the web and mobile
apps read directly. 66 scriptures, 187,395 verses (re-counted 2026-09-30;
the older 316,102 figure was not a count of these files). Coverage:
`npx tsx scripts/_coverage-report.ts` and `scripts/_hindi-coverage-report.ts`._

## Status (re-measured 2026-09-30)

| Item | State |
|---|---|
| **P4** — invented "filler" verses in ~40 scriptures | ✅ **Done** — removed from JSON, curated `.ts` and Hindi commentary; `scripts/check-filler.ts` (part of `npm run check`) blocks them and caps principal-Upanishad counts; the curated merge no longer appends curated-only chapters to a real seed |
| **P5** — Upanishads rebuilt from source | ✅ **Done** for Kaivalya, Jabala, Shvetashvatara (113), Tejobindu, Niralamba, Maitri, Mahanarayana, Muktika (`scripts/rebuild-upanishads.ts`); Brahma Sutra, Vivekachudamani, Samaveda re-seeded in full. **Open:** Taittiriya (accented source), Kaushitaki, Amritabindu (no source found) |
| **P6** — newly rebuilt texts have no translation/Hindi | ✅ **Done** — 100% complete for tejobindu, mahanarayana, maitri, muktika, samaveda, brahmasutra, vivekchudamani, shvetashvatara |
| **P7** — Hindi and English that belong to other verses | ⚠️ **Hidden at publish, not fixed** (2026-10-25) — see P7 below. About 172,500 Hindi and 100,800 English meanings, plus 353,000 notes built from them, are left out of the chapter shards; source JSON untouched; `scripts/check-meaning-alignment.ts` (part of `npm run check`) blocks them |

Earlier status (2026-09-29), kept for the items below:

| Item | State |
|---|---|
| **P0** — romanized → Devanagari | ✅ **Done** — `npm run migrate:devanagari` |
| **P2** — header-artifact verses | ✅ **Done** — `tsx scripts/strip-header-artifacts.ts` |
| **P1** — missing English translations | ⚠️ **Open** — 48/65 complete; worst: mahabharata (10%, 29k missing), agnipuran, naradapuran, brahmapuran (`npx tsx scripts/_coverage-report.ts`) |
| **P1b** — missing Hindi (bulk corpus) | ⚠️ **Open** — 53/65 complete; worst: shivpurana, brahmapuran, brahmandpuran, skandapuran, manusmriti (35%), durgasaptashati (2%) (`npx tsx scripts/_hindi-coverage-report.ts`) |
| **P3** — durgasaptashati misalignment | ✅ **Done** — structural `chapter.id` + `verse.id` merge (16/16 aligned) |
| **P2b** — mangled mixed-script headers | ✅ **Done** — parser fix + `fix-mixed-script-verses.ts` (0 mixed-script verses remain) |

## P7 — Hindi and English that belong to other verses ⚠️ HIDDEN AT PUBLISH (2026-10-25)

Most Puranas, the Mahabharata and several other texts were filled from OCR of a printed translation laid over
the Sanskrit in reading order. The printed book does not break where the Sanskrit edition does, so the meanings
drift onto other verses. Examples: Shiva Purana 21.26 (ganas striking heads) showed Upamanyu asking his mother for
milk; one Hindi line, "शिवको मेरा नमस्कार है", was the Hindi of 3,372 different verses; Mahabharata 22.35 showed a
Sanskrit half-line from another verse as its "Hindi". The explanation and research notes were then generated as
"<that Hindi>। <one of ~10 stock sentences>", so they drifted too.

**How it is measured** (`scripts/lib/meaning-alignment.ts`). A Hindi meaning shares words with its own Sanskrit,
and an English one carries its proper names. Per chapter we compare how often a meaning shares a word with its own
verse against a verse half a chapter away. Aligned text scores far above the baseline (Gita Hindi 89% vs 12%,
Harivamsha Hindi 87% vs 8%); drifted text scores at the baseline (Shiva Purana Hindi 2% vs 1%, Mahabharata 6% vs
3%). English made for one verse at a time (`translationSource: "ai"`) is verse-aligned and is kept.

**What publishing now does** (`scripts/shard-scriptures-full.ts`, SHARD_REV 3): leaves out every meaning in a
chapter that fails the test, every Hindi or English value repeated on 3+ verses with different Sanskrit, every
note ending in a stock sentence, and the notes generated from a removed meaning. The source JSON keeps all of it.
Pages left without a meaning show the मूल पाठ notice and drop out of the sitemap through `chapterHasMeaning()`.

| | Hidden | Main texts |
|---|--:|---|
| Hindi | ~172,500 | Mahabharata (all), Shiva, Brahma, Brahmanda, Naradiya, Garuda, Agni, Matsya, Vayu, Linga, Vamana, Vishnu, Kurma, Markandeya, Narasimha, Skanda; Atharvaveda, Yajurveda, Manusmriti, Chandogya |
| English (non-"ai") | ~100,800 | Garuda, Matsya, Vayu, Linga, Kurma, Atharvaveda, Brahmanda, Naradiya, Vamana, Brahma, Agni, Shiva, Markandeya, Vishnu, Mahabharata (Ganguli part), Skanda, Narasimha, Harivamsha |
| Notes | ~353,000 | everywhere the stock sentences were used, including the Gita, Katha, Ramayana and Rigveda |

Kept as aligned: Gita, Upanishads with curated meanings, Durga Saptashati (27 repeated Hindi lines removed),
Harivamsha Hindi, Samaveda, Vivekachudamani, the Max Müller, Bühler and Griffith (Yajurveda) English, and all
"ai" English.

**Open:** bring meanings back only from verse-aligned sources, a text at a time. Re-running the seeders' prose
mapping will not pass `check-meaning-alignment`.

**Ramayana and Rig Veda rebuilt from the full text (2026-10-25).** Both had shrunk to 82 and 67 entries
(25 and 28 distinct ślokas, repeated under new numbers) when commit 3a17ed9a rewrote every full JSON from the
curated TS data; nothing had decided that. They are now the full DharmicData text again:

- `ramayana.json`: 7 kandas, 22,742 shlokas numbered `sarga.shloka`. The source repeats 61 sarga.shloka pairs
  (Aranya 34, Kishkindha 10); the second copies are suffixed `b` (`34.1b`).
- `rigveda.json`: 10 mandalas, 10,489 mantras numbered `sukta.mantra`, svara marks kept. The source separates
  10,489 of the 10,552 mantras: a missing marker merges two mantras in 1.100, 1.136, 1.139, 2.35, 3.32 and 7.56
  (their later mantras keep their printed numbers), and 1.66, 1.67, 3.39, 4.7, 7.17, 8.29, 9.109 and 10.172 hold
  fewer mantras than their headers count. (The 10,499 recorded earlier came from the old parser, which also
  dropped the first half of each sukta's first mantra and repeated numbers at broken markers such as ॥४॥३ in
  1.164.)
- The published meanings were carried only where the quoted Sanskrit is that verse: 5 Ramayana and 9 Rig Veda
  verses. The rest were quotations from other texts (Katha, Mundaka, Brihadaranyaka, the Gita, later stotras) or
  garbled; each decision is in `data/realign/ramayana-rigveda-2026-10-25.json`, and their commentary is kept
  verbatim in `….orphans.json` for review. Ramayana 3.37.13 (रामो विग्रहवान् धर्मः) needs a new translation: the
  old one translated a variant reading.
- Ramayana verse pages exist only for verses with a meaning (`PARTIAL_VERSE_PAGE_SCRIPTURE_IDS`,
  `lib/verse-page-subsets.json`); the 80 old verse URLs that lost their page are 301s in `public/_redirects`.

---

## TL;DR

The corpus is broad but, after the P0/P2 fixes, now renders in clean
Devanagari throughout. What remains is depth (translations) plus two small,
bounded cleanups.

---

## P0 — Romanized Sanskrit → Devanagari ✅ DONE

~24 scriptures (**0 romanized files remain**) stored their `sanskrit` as
romanized text instead of Devanagari, seeded from a romanized source without
the transliteration step `scripts/seed-puranas.ts` applies to sanskritdocuments
ITRANS files.

**Fix applied** via `scripts/migrate-romanize-to-devanagari.ts`
(`npm run migrate:devanagari -- --write`): converted **130,807 verses** across
24 files. The files used two schemes — IAST (the big Puranas) and ITRANS (the
smaller Upanishads/sutras) — so the script detects each file's scheme and
converts with the right one; converting with the wrong scheme produces garbage.
The original romanization is preserved in the `transliteration` field. The
script only touches purely-romanized verses (zero Devanagari), so the mangled
mixed-script lines in P2b are deliberately left untouched. Idempotent.

---

## P2 — Header artifacts removed ✅ DONE

GRETIL/source metadata ingested as fake verses: Upanishad title lines
(`.. Maitri (Maitrayani) Upanishad ..##`, `॥ … ॥ .. XopaniShat ..endtitles`)
and bare section markers (`.. 8..`).

**Fix applied** via `scripts/strip-header-artifacts.ts`: removed **34 artifact
verses across 18 files** and decremented each `totalVerses`. The matcher is
deliberately precise — it does NOT touch real verses that merely begin with
".." (harivanshpuran) or the mixed-script lines in P2b. Verified: removals
exposed the real first verses (e.g. ishavasya now opens on
`ॐ ईशा वास्यमिदँ सर्वं…`).

---

## P2b — Mangled mixed-script lines ✅ DONE

_Newly discovered during P0/P2._ Some verses mix Devanagari, Latin and ITRANS
markup in a single `sanskrit` field. They split into two kinds:

**(a) Clean verse + English editorial note — FIXED (7).** A real, complete
Devanagari śloka with an English annotation stuck on: a source credit
(atharvaveda `By Dr. … Lucknow, India. <verse>`), a "(verses missing)" note
(manusmriti 3.57), or a Brahmasutra variant label (`पाठभेद 1.4.5 and 6 combined
ॐ … ॐ`). Dropping the non-Devanagari cleanly recovers the verse. Fixed via
`scripts/clean-mixed-headers.ts` (an explicit, hand-verified allowlist — a
blanket strip is unsafe, see below). atharvaveda ×1, manusmriti ×1,
brahmasutra ×5.

**(b) Conflated title/invocation/verse blobs — NOT auto-fixable (45).** These
need a fix in the **seed pipeline** (`scripts/seed-puranas.ts`), not a data
patch, because the romanized text often *is* real verse content:

- **Purana canto headers (36): `bhagavatapurana` 13, `devibhagavat` 12,
  `shivpurana` 11.** Each chapter's first entry is a blob of mangled-Devanagari
  title + maṅgala invocation + (for bhag/devibhag) **verse 1.1.1 in ITRANS**.
  Blindly stripping Latin reduces the blob to just its title — *losing the
  opening verse of the Bhagavatam / Devi Bhagavatam*. The seed parser should
  separate title, invocation, and verse 1 instead.

  **Root cause + fix DRAFTED (pending re-seed).** Confirmed two bugs in
  `scripts/lib/itrans-parser.ts`: (1) `cleanItx` *unpacked* `\engtitle{}` /
  `\itxtitle{}` document-title tags into the body, so the English title
  ("…Bhagavatam Canto 1…") was transliterated into the `ष्रिमद् Bहगवतम्`
  gibberish; (2) the maṅgala invocation (unnumbered, bare `||`) before verse 1
  was folded into verse 1 by `extractVerses`. Fixed by dropping title tags +
  `endtitles` in `cleanItx`, and a new `stripFrontMatter()` that cuts to the
  first numbered verse — wired into `seed-puranas.ts`. Verified offline on a
  fixture (`npm run test:parser`): the first verse now resolves to a clean
  `जन्माद्यस्य यतोऽन्वयादितरतः…`. **To apply, re-run `npm run seed:puranas`**
  (needs network to sanskritdocuments.org); eyeball verse 1 of each Purana
  afterward, especially `devibhagavat` whose verse-marker format differs.
- **`brihadaranyaka` (4):** a Devanagari mantra followed by a duplicate of
  itself in ITRANS, plus `[IV.iv.3]` refs and `मर्क्` markers — needs de-duping.
- **`manusmriti` (2, verses 7.87/7.206):** Devanagari verse + transliterated
  English commentary note + a second verse in ITRANS, conflated in one field.
- **`yogavasishtha` 1, `vivekchudamani` 1, `brahmasutra` 1:** leftover title
  blobs (e.g. `॥ विवेकचूडामणिः ॥एndtitles`) that P2 missed because `endtitles`
  was partly transliterated. Safe to drop once confirmed the real text follows.

**Fix applied (2026-06-23).** Purana canto headers were already clean in
`scriptures-full` (parser fix in `itrans-parser.ts` verified via
`npm run test:parser`). Remaining 16 mixed-script verses fixed via
`scripts/fix-mixed-script-verses.ts --write`: shivpurana ×5 title blobs
removed, brihadaranyaka ×4, manusmriti ×2, yogarasayanam ×5. Verify:
`python scripts/audit-data-quality.py` (`mix` column — 0 across corpus).

---

## P1 — Missing English translations ⚠️ REOPENED (2026-10-25)

> **Correction 2026-10-25:** "100%" below meant *filled*, not *correct*. Most of the prose-mapped English
> belongs to other verses; see P7. Real coverage is the verse-aligned English only.

All **65** `scriptures-full` JSON files now have **100% English translation
coverage** (316k+ verses). Seeded via public-domain sources (GRETIL, Tagare,
Ganguli, Griffith, Dutt, Pargiter, etc.) with sequential prose→śloka mapping
where 1:1 alignment does not exist. Verify: `npx tsx scripts/_coverage-report.ts`.

---

## P1b — Missing Hindi (bulk corpus still open)

Curated highlight verses (~1,261 in the reader UI) have Hindi; the bulk
`scriptures-full` corpus does not. Needs *sourced* Hindi (machine translation
of śloka isn't trustworthy for a scripture app). Sequence by reader demand:

- **Tier A:** the 10 mukhya Upanishads, Ramayana, Bhagavata Purana, Vishnu
  Purana, Manusmriti, Vidura Niti.
- **Tier B:** remaining Upanishads, Durga Saptashati (finish + fix P3 mapping).
- **Tier C:** the large Puranas (huge verse counts, lower per-verse demand).

The reader degrades gracefully (Sanskrit-only when no translation exists).
Consider a catalog `hasTranslation` flag so the UI can label "Sanskrit only".
Largest gaps:

| Scripture | Verses |
|---|--:|
| `mahabharata` | 73,821 |
| `shivpurana` | 25,198 |
| `ramayana` | 22,742 |
| `devibhagavat` | 18,386 |
| `naradapuran` | 15,600 |
| `bhagavatapurana` | 14,103 |
| `brahmapuran` | 13,796 |
| `brahmandpuran` | 13,745 |
| `rigveda` | 10,489 |
| `skandapuran` | 6,724 |

_Only `bhagavadgita` (701) and `nityakarmakriya` (16) have full translation + Hindi; `durgasaptashati` ~3%._

---

## P3 — Misaligned translations (durgasaptashati) ✅ DONE

`mergeCuratedChapters()` in `scripts/lib/curated-merge.ts` now matches curated
verses by **Sanskrit fingerprint** (not verse-number suffix). One-off cleanup:
`scripts/lib/curated-merge.ts` now matches by the predefined structure:
curated `chapter.id` + `verse.id` ↔ seeded `"{chapter}.{id}"` (e.g. ch2 id10 →
`2.10`). One-off cleanup: `npx tsx scripts/fix-durgasaptashati-alignment.ts
--write` — all 16 hand-authored verses aligned, 634 mūla verses preserved.
Future re-seeds via `npm run seed:missing` inherit this automatically.

---

## Appendix — full per-scripture table (current)

| Scripture | Verses | Script | Tr % | Hi % | MixedHdr |
|---|--:|---|--:|--:|--:|
| `mahabharata` | 32,540 | devanagari | 100 | 100 | 0 |
| `shivpurana` | 12,982 | devanagari | 0 | 100 | 0 | 0 |
| `ramayana` | 22,742 | devanagari | 0 | 0 | 0 |
| `devibhagavat` | 18,386 | devanagari | 0 | 0 | 0 | 0 |
| `naradapuran` | 15,198 | devanagari | 100 | 100 | 0 |
| `bhagavatapurana` | 14,103 | devanagari | 0 | 0 | 0 | 0 |
| `brahmapuran` | 13,443 | devanagari | 100 | 100 | 0 |
| `brahmandpuran` | 13,496 | devanagari | 100 | 100 | 0 |
| `garudpurana` | 11,877 | devanagari | 0 | 100 | 0 |
| `agnipuran` | 11,043 | devanagari | 100 | 100 | 0 |
| `rigveda` | 10,489 | devanagari | 0 | 0 | 0 |
| `matsyapuran` | 8,330 | devanagari | 100 | 100 | 0 |
| `vayupuran` | 7,641 | devanagari | 100 | 100 | 0 |
| `lingapuran` | 6,726 | devanagari | 100 | 100 | 0 |
| `skandapuran` | 6,724 | devanagari | 100 | 100 | 0 |
| `atharvaveda` | 5,627 | devanagari | 100 | 100 | 0 |
| `harivanshpuran` | 6,069 | devanagari | 100 | 100 | 0 |
| `kurmapuran` | 5,822 | devanagari | 100 | 100 | 0 |
| `vamanpuran` | 5,683 | devanagari | 100 | 100 | 0 |
| `vishnupurana` | 5,488 | devanagari | 100 | 100 | 0 |
| `markandeypuran` | 4,522 | devanagari | 100 | 100 | 0 |
| `narasimhapuran` | 3,470 | devanagari | 100 | 100 | 0 |
| `manusmriti` | 1,801 | devanagari | 100 | 100 | 0 |
| `ramcharitmanas` | 2,247 | devanagari | 0 | 0 | 0 |
| `yajurveda` | 1,809 | devanagari | 100 | 100 | 0 |
| `samaveda` | 1,873 | devanagari | 0 | 0 | 0 |
| `tejobindu` | 973 | devanagari | 0 | 0 | 0 |
| `maitri` | 931 | devanagari | 0 | 0 | 0 |
| `mahanarayana` | 800 | devanagari | 0 | 0 | 0 |
| `bhagavadgita` | 701 | devanagari | 100 | 100 | 0 |
| `yogavasishtha` | 650 | devanagari | 0 | 0 | 0 | 0 |
| `durgasaptashati` | 634 | devanagari | 3 | 3 | 0 | 0 |
| `chandogya` | 618 | devanagari | 100 | 100 | 0 |
| `vivekchudamani` | 589 | devanagari | 0 | 0 | 0 | 0 |
| `brahmasutra` | 566 | devanagari | 0 | 0 | 0 | 0 |
| `viduraniti` | 299 | devanagari | 100 | 100 | 0 |
| `brihadaranyaka` | 397 | devanagari | 100 | 100 | 0 | 0 |
| `muktika` | 355 | devanagari | 0 | 0 | 0 |
| `shandilyabhaktisutra` | 289 | devanagari | 0 | 0 | 0 |
| `shvetashvatara` | 125 | devanagari | 0 | 0 | 0 |
| `katha` | 119 | devanagari | 0 | 0 | 0 |
| `niralamba` | 108 | devanagari | 0 | 0 | 0 |
| `jabala` | 87 | devanagari | 0 | 0 | 0 |
| `aitareya` | 73 | devanagari | 0 | 0 | 0 |
| `kaivalya` | 70 | devanagari | 0 | 0 | 0 |
| `mundaka` | 67 | devanagari | 0 | 0 | 0 |
| `prashna` | 66 | devanagari | 0 | 0 | 0 |
| `taittiriya` | 52 | devanagari | 0 | 0 | 0 |
| `ravanasamhita` | 44 | devanagari | 0 | 0 | 0 |
| `kena` | 34 | devanagari | 0 | 0 | 0 |
| `naradabhaktisutra` | 26 | devanagari | 0 | 0 | 0 |
| `amritabindu` | 22 | devanagari | 0 | 0 | 0 |
| `ishavasya` | 18 | devanagari | 0 | 0 | 0 |
| `padmapuran` | 18 | devanagari | 0 | 0 | 0 |
| `nityakarmakriya` | 16 | devanagari | 100 | 100 | 0 |
| `shivaswarodaya` | 16 | devanagari | 0 | 0 | 0 |
| `kaushitaki` | 14 | devanagari | 0 | 0 | 0 |
| `shivasamhita` | 14 | devanagari | 0 | 0 | 0 |
| `yogavasistha` | 14 | devanagari | 0 | 0 | 0 |
| `vinayapatrika` | 13 | devanagari | 0 | 0 | 0 |
| `brahmavaivartapuran` | 11 | devanagari | 0 | 0 | 0 |
| `mandukya` | 11 | devanagari | 0 | 0 | 0 |
| `yogarasayanam` | 11 | devanagari | 0 | 0 | 0 | 0 |
| `kalkipuran` | 10 | devanagari | 0 | 0 | 0 |
| `varahapuran` | 10 | devanagari | 0 | 0 | 0 |

---

## P4 — Chapters with mixed verse numbering (needs a human decision)

`node scripts/fix-verse-order.mjs` re-sorts verses only where every number has one shape. These 18 chapters mix schemes (e.g. `1`, `1.2`) or step back across sections, so they are reported, not changed. Ramayana ch1-7 and Manusmriti ch1 look like curated selections; Shivpurana ch9/ch10 and atharvaveda ch20 were plain text-order sorts with a few odd numbers; fixed on 2026-09-29 via the FORCE_MIXED allowlist in the script. The rest need a human decision.

```
  bhagavatapurana.json ch1: mixed numbering (2/1), 6 out of order — left as is
  brahmasutra.json ch1: mixed numbering (1/3), 4 out of order — left as is
  devibhagavat.json ch7: mixed numbering (1/2), 2 out of order — left as is
  devibhagavat.json ch12: steps back across sections, 3 out of order — left as is
  mahabharata.json ch7: mixed numbering (1/2), 7 out of order — left as is
  manusmriti.json ch1: mixed numbering (1/2), 5 out of order — left as is
  ramayana.json ch1: mixed numbering (1/2), 12 out of order — left as is
  ramayana.json ch2: steps back across sections, 3 out of order — left as is
  ramayana.json ch3: mixed numbering (1/2), 4 out of order — left as is
  ramayana.json ch4: mixed numbering (1/2), 7 out of order — left as is
  ramayana.json ch5: mixed numbering (1/2), 7 out of order — left as is
  ramayana.json ch6: mixed numbering (1/2), 2 out of order — left as is
  ramayana.json ch7: mixed numbering (1/2), 12 out of order — left as is
  shivpurana.json ch1: mixed numbering (2/1), 3 out of order — left as is
  shivpurana.json ch6: mixed numbering (2/1), 3 out of order — left as is
```

---

## Why the translation gaps must not be "refilled" from the seed caches

The English/Hindi gaps in P1/P1b are what is left after `scripts/dedupe-bulk-translations.ts`
removed passage-level text that the Purana and Mahabharata seeders had copied onto every verse
of a passage. Re-running e.g. `npm run seed:mahabharata-translations` reports 100% coverage but
re-creates the problem (checked 2026-09-29: Mahabharata 8.1.6 showed Janamejaya's opening
paragraph as the "translation" of a Duryodhana verse; ~3,200 distinct texts across 32,540
verses, one repeated 208 times, plus `[paragraph continues]` scraping artifacts).
Closing these gaps needs a **verse-aligned** source, not more passage-level text.

### P4 resolution (2026-09-29)

The remaining 15 chapters were inspected: Ramayana ch1–7 are curated 13–16-verse selections per kanda
(numbers like `1, 1.2, 3, 4, 1.6 … 2.10, 1.14` are selection order, not a sort bug) and Manusmriti ch1 is a
sparse selection (`1, 1.2, 3, 4, 1.15, 1.20, 1.25`). Their order is intentional — leave them. (Since the
2026-10-25 rebuild the Ramayana is the full text in source order, so its seven entries above no longer apply.) The
bhagavatapurana/devibhagavat/mahabharata/shivpurana/brahmasutra entries are 2–7 verses each and are left as is.
