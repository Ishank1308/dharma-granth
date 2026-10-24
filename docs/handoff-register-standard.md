# Handoff: site-wide Hindi register standard

For any tool (Cursor, Kimi, another Claude session) continuing this work. Read `docs/vyakhya-guide.md` first; it is the house standard. Do not commit or push; another tool owns commits and deploys.

## The goal

Apply the full व्याख्या standard across the site:
- dignified tatsam Hindi, as in a Gita Press commentary
- no colloquial, Urdu-Persian or English words
- the reader addressed as आप
- every scriptural reference verified, and sensitive verses handled carefully
- every व्याख्या draft at confidence `high`; a draft with any doubt is fixed, never published at medium

## Decisions already made (user, 2026-10-22)

1. **Printed Hindi meanings:** fix only broken or AI-generated ones. Never rewrite genuine edition translations, such as Gita Press for the Gita.
2. **UI tech terms stay:** मोड, थीम, डाउनलोड, ऐप, टेक्स्ट, सेटिंग, UPI, QR are familiar to readers.
3. **Leave alone:**
   - `तुम`/`तू` inside Gita and Upanishad quotations, where the teacher addresses the listener
   - search regexes that match what users type (`lib/copilot.ts`)
   - editorial-pilot verses (`data/pilot/records/`)

## Done

- **UI prose:** 26 lines in 13 files moved to the register. "तनाव" became "उद्वेग", "थकान" became "श्रान्ति", "शुरुआत" became "आरम्भ", and so on.
- **Vivekchudamani व्याख्या:** verses 1–300 are published (298 AI drafts, all high). It is paused at 300; continue from 301.
- **Vivekchudamani printed Hindi:** 49 meanings repaired.
  - 39 were half-English.
  - 9 belonged to other verses because the seed script's `FAMOUS_VERSES` was keyed to another edition's numbering. That script is fixed too, so a re-run can't restore them.
  - 1 (verse 201) was mistranslated.
- **Narada Bhakti Sutras:** all 84 have a व्याख्या.
- **Research notes:** English-bearing and filler research notes are cleaned corpus-wide.

## Remaining work, in recommended order

1. **58 flagged commentary fields** (20 explanation, 16 research, 22 life-lesson). Run `node scripts/register/survey.cjs` to list them by scripture.
   - Skip pilot-owned verses: Gita 2:14, 2:20, 2:47, 18:66; Katha 2:23; Ishavasya 1:1; Durgasaptashati 5:77; Mandukya 1:7; Yogasutra 1:2, 1:5, 1:12; Vinayapatrika 1:1; Vishnupurana 1:17, 1:19, 2:7.
   - Fix the others through `data/ai-commentary/<id>-research.json`. For example, `{"1:2": {"status":"approved","lifeLesson":[["old phrase","new phrase"]]}}`, or set a full string. Then run `npm run publish:commentary`.
2. **224 Latin-script printed meanings** in verses tagged `hindiSource: "ai"`, in mahanarayana, mahaupanishad, maitri and tejobindu.
   - Write each meaning fresh from the Sanskrit and check it against the verse's English `translation`.
   - Edit `public/data/scriptures-full/<id>.json` **and** its shard `public/data/scriptures-full/<id>/ch-N.json`. Use exact string replacement so the CRLF formatting survives.
   - If a seed script under `scripts/seed-*` writes the same text, fix it too.
3. **Mismatched printed meanings** (a meaning that belongs to another verse). For Vivekchudamani, `node scripts/register/vivek-match-score.cjs` flags suspects. Check each by eye against the Sanskrit and English before changing anything.
4. **Vivekchudamani व्याख्या, verses 301–580.** Follow the vyakhya guide's workflow:
   - Draft into `data/ai-commentary/staged/vivekchudamani-NN.json` (01–05 exist, so the next is `-06`).
   - Run `node scripts/check-hindi-register.mjs <file>`; it must print `sentences to fix 0`.
   - Run `node scripts/stage-commentary.mjs <file>`, then `npm run publish:commentary`.
   - Note: verse 213's "ते" is ambiguous ("yours" or "those"), and its व्याख्या gives both readings.
5. **Other scriptures' व्याख्या**, one scripture at a time, with the user's approval of each.

## Checks before publishing any batch

- `node scripts/check-hindi-register.mjs <staged.json>` gives `sentences to fix 0`. Words it misses but that still violate the register: तलवार, औज़ार, जहर, अक्सर, फ़ोन; use खड्ग, उपकरण, विष, प्रायः.
- `node scripts/register/bracket-scan.cjs` prints nothing.
- `node scripts/register/agreement-scan.cjs` reports only known-good lines. Watch for gender slips after word swaps: शुरुआत is feminine but आरम्भ is masculine, so "की आरम्भ" must become "का आरम्भ".
- No leftover drafting notes ("…बदलें") in any `reviewNote`.
- Every outside citation (Upanishad, Gita) is checked against its source and named in `reviewNote`.
- Sensitive verses (caste, gender, the body, death, disability) state plainly what the verse does not license, and carry a `reviewNote`. Verse 287's "चाण्डालवत्" is the model case.

## Pitfalls

- Shell quoting in Git Bash strips backslashes from inline `node -e` code. Put regexes in script files.
- The register checker reads the `explanation` key only. To check printed meanings, wrap them as `{"1:N": {"explanation": "…"}}` in a temporary file.
- The dev server caches commentary, so restart it to see published changes. The user stopped it; ask before restarting.
