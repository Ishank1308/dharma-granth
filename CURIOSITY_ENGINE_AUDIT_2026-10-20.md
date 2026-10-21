# Curiosity Engine — Quality Audit, Audience Validation, Canonical Integrity & Production Hardening

**Date:** 2026-10-20
**Scope:** Curiosity-Driven Scripture Exploration Engine (`/curiosity/`, verse-level drawer, `data/curiosity-inquiry.ts`)
**Branch containing all fixes:** `cursor/cloud-agent-env-setup-0b64` (commits `7c1c79a3`, `6b97aad9`)
**Method:** 17-role review council, byte-level canonical comparison against `public/data/scriptures-full`, link resolution audit against `lib/verse-paths.ts` + seeded data, a11y/privacy/performance review, full build + Playwright verification.

---

## 1. Executive Summary

The Curiosity Engine is architecturally sound: inquiry-based, epistemically layered, child-safe by design, and correctly reuses the site's content architecture instead of duplicating it. The audit found **7 content/link defects (2 canonical-integrity class), 1 systematic canonical-text corruption, and 6 UX/a11y issues** — all fixed at source. A permanent automated regression check (`scripts/check-curiosity.ts`, wired into `npm run check`) now guards every defect class found. Production readiness: **ready**, with three documented open gaps that require sourcing decisions, not engineering (§6).

### Defects fixed in this pass

| # | Severity | Defect | Fix |
|---|---|---|---|
| D1 | **Canonical integrity** | Gita 1.29 anchor displayed the text of 1.29b+1.30a under the label "1.29"; wonder prompt and artha described the bow slipping (1.30) | Anchor corrected to canonical 1.29 (`सीदन्ति मम गात्राणि…`); prompts/arthas rewritten to match; English artha re-written in-house (was near-verbatim public-domain translation) |
| D2 | **Canonical integrity** | Gita 2.22 anchor contained injected Latin text: `जीर्णाfreqन्यन्यानि` | Restored canonical `जीर्णान्यन्यानि` |
| D3 | **Canonical integrity (source)** | Systematic Devanagari corruption across the canonical Gita: i-matra misordered after virama (`श्िच` for `श्चि`) — 30 occurrences in monolithic JSON + curated TS, 16 more in per-chapter `ch-*.json` (Gita 3.25 `तथासक्तश्िचिकीर्षु`, `निश्िचितम्`, `कश्िचित्`…) | Corrected at source in **all three copies**; `data/canonical-checksum.json` regenerated; `tsx scripts/canonical-checksum.ts --verify` passes |
| D4 | Broken link (404) | Rigveda anchor linked `/scripture/rigveda/chapter/1/verse/164.46/` — Rigveda has no verse pages (`VERSE_PAGE_SCRIPTURE_IDS`) and the seeded corpus has no such verse | Href → `/scripture/rigveda/`; verified RV 1.164.46 text itself is the standard recension |
| D5 | Broken link (404) ×3 | Katha links used scholarly numbering `3.3`/`3.4`; seeded data numbers Katha ch. 3 as 1–17 | `verse: 3` / `verse: 4`, hrefs `/scripture/katha/chapter/3/verse/3/` … `/4/` (anchor + 2 related) |
| D6 | Broken link (404) ×2 | Taittiriya links used `11.1`/`11.2`; seeded data has verse 11 (whole anuvaka) and no `11.x` | Anchor → verse 11 (`/verse/11/`); related → verse 12 (the study-opening peace chant) |
| D7 | UX defect | Deep links `/curiosity/#inquiry-<id>` failed silently for non-child audiences — the hub only renders the selected audience's items, so the target article never mounted and the hash scroll never happened | Hub now reads the hash on mount/hashchange, switches audience, expands, and scrolls |
| D8 | UX defect | "एक प्रश्न चुनें" (random pick) could select an inquiry hidden by the active category filter (scrollIntoView no-op) | Random pick now resets the category filter |
| D9 | HTML validity / a11y | `<h2>` nested inside `<button>` (flow content inside phrasing-only element); chevron icons unlabeled; category pills missing `aria-pressed`; search input missing accessible name | `role="heading" aria-level={2}` span pattern; `aria-hidden` on decorative icons; `aria-pressed`; `aria-label`; accordion `aria-controls`/`role="region"` pairing |
| D10 | a11y | Audience emojis in the verse drawer announced by screen readers | Wrapped in `aria-hidden` spans |
| D11 | Test gap | `/curiosity/` absent from Playwright smoke/a11y page lists | Restored in `tests/smoke.spec.ts` and `tests/a11y.spec.ts` |
| D12 | Regression risk | Nothing prevented the above classes of defect from returning | New `scripts/check-curiosity.ts` (structure, canonical containment, link resolution, corruption patterns, per-audience coverage, drawer reverse-lookup) — part of `npm run check` |

---

## 2. Review-Council Findings (17 perspectives)

**Curious child:** Language is warm, concrete, and dignified (puppy/monkey/mango-seed metaphors work). No fear imagery; death question uses the gentle "changing clothes" metaphor with an explicit no-nightmares boundary. Approves after D1/D2 fixes — previously the child-facing Gita 1.29 card taught a mis-quoted verse.

**Thoughtful teenager:** Questions are candid (smartphone algorithms, questioning tradition, detachment ≠ numbness) and directly name teen pressures without moralizing. Not leading — each ends with an open thinking prompt. Approves.

**Parent:** Every inquiry carries a Parent & Teacher Guide; the death and discipline entries explicitly ban shame/fear tactics ("never use frightening concepts of eternal torture", "avoid shaming about screen time"). Guides coach dialogue, not doctrine. Approves.

**Classroom teacher:** Content is dialogue-starter grade; the 7-step cycle maps to inquiry-based pedagogy (notice → question → anchor → meaning → independent thought → reflection → next question). Wish: printable/exportable class cards — deferred, not a defect.

**Adult beginner:** The "where do I start" and "canonical vs commentary" inquiries directly address beginner anxiety and the Mūlapāṭha/Artha/Vyākhyā/Bhāṣya/Vijñāna separation. The "65 scriptures / 187,490 verses" figure matches the checksum registry. Approves.

**Sanskrit textual-integrity editor:** D1–D3 were blocking; all fixed and now machine-verified per build. Taittiriya anchor is a deliberate excerpt (first three lines of anuvaka 11) — disclosed on the page as `Taittirīya Upaniṣad 1.11.1`. Rigveda anchor is self-hosted text pending the Rigveda seeding gap (§6).

**Hindi literary editor:** Hindi register is consistent (मानक हिंदी, Devanagari numerals in traditional contexts), natural idiom ("रोंगटे खड़े हो रहे हैं"), no awkward calques found. Minor: mixed register "Practice" in one Hindi string (child-where-does-mind-go parent guide) — acceptable as a borrowed school word.

**English literary editor:** Tone is non-condescending throughout. One near-verbatim public-domain translation (Gita 1.29 arthaEn) was replaced with an in-house rendering during this audit; remaining arthas are aligned rephrasings of the site's approved translations, not duplications of approved Vyākhyā.

**Indian philosophy researcher:** Content is accurate: Katha chariot metaphor attribution, Prashna Upanishad structure, Gita 4.34's `paripraśna`, Advaita/Dvaita debates as celebrated tradition. The pluralism answer correctly centers Ṛgveda 1.164.46 (एकं सत्).

**Inquiry-based learning specialist:** The cycle never asserts — it anchors each question in a canonical verse and ends with "the next question". No artificial filler questions; 11 inquiries cover distinct genuine wonderings. Approves.

**Child-safety reviewer:** No fear-based incentives, no sectarian exclusion, no request for personal data, no external links. Reflection exercises are somatic and safe (breathing, candle-with-parent). Death content reviewed and approved. Share button copies text to the user's own clipboard — no server round-trip.

**Accessibility engineer:** D9/D10 fixed; keyboard operability verified (all controls are native `<button>`/`<input>`/`<a>`; focus ring classes present). Automated a11y suite passes on `/curiosity/` in all three themes.

**Privacy engineer:** The engine stores nothing; no analytics on questions; clipboard share is client-side; the verse drawer computes from bundled data. Fully local. Approves.

**Scripture-data architect:** Anchor verses are now byte-verified against the seeded canonical JSON at build time (`check-curiosity.ts`). The architecture intentionally embeds one canonical copy per anchor (presentation requirement) with the checker enforcing equality — acceptable; a future optimization could render anchors from seed data directly at page level.

**QA lead:** D12 closes the loop; full `npm run check` chain, `tsc --noEmit`, `next lint`, production build (6,350 pages), and Playwright smoke + a11y (4/4) all pass.

**Performance engineer:** Hub page ships server HTML with JSON-LD; drawer is `next/dynamic` code-split; dataset ~11 items — negligible. No issues.

**Security reviewer:** No injection surface (static data), no secrets, clipboard API used defensively with try/catch. No issues.

---

## 3. Requirement Traceability Matrix

Statuses: ✅ Complete and verified · ◻︎ Complete but not verified · 🟡 Partially implemented · 🔧 Implemented with defects (fixed in this pass) · ⛔ Missing · ⏸ Intentionally deferred

| Req ID | Requirement | Implementation path | Component | Data file | Status | Evidence | Automated test | Browser test | A11y test | Remaining problem | Recommended action |
|---|---|---|---|---|---|---|---|---|---|---|---|
| CE-01 | Questions arise naturally from scripture | Wonder prompts → honest question per inquiry | `CuriosityHubClient` | `data/curiosity-inquiry.ts` | ✅ | §2 (child/teen/specialist) | `check-curiosity.ts` (field presence) | smoke `/curiosity/` | a11y themes | — | — |
| CE-02 | Answers reuse approved content | Artha layer aligned to site translations; deeper layers linked, not duplicated | hub + drawer | same | ✅ | similarity audit (§4) | — | smoke | — | English arthas echo public-domain phrasing | Keep attributions in epistemic notes |
| CE-03 | Canonical scripture untouched | Anchors byte-equal seeded canonical text | `check-curiosity.ts` | `scriptures-full/*.json` | ✅ | D1–D3 fixed; checksum `0ee965ce…` | `check-curiosity.ts` containment check + `canonical-checksum.ts --verify` | — | — | Rigveda anchor self-hosted (seed gap) | §6 G-1 |
| CE-04 | Children understand the language | `audience: 'child'`, graded vocabulary | hub audience switcher | `AUDIENCE_CONFIG` | ✅ | §2 child | per-audience coverage check | smoke | — | — | — |
| CE-05 | Teenagers find questions meaningful | Exam pressure, identity, algorithms, tradition | 3 teen inquiries | same | ✅ | §2 teen | coverage check | smoke | — | — | — |
| CE-06 | Adult beginners get context | "Where to start", "canonical vs commentary" | 2 beginner inquiries | same | ✅ | §2 beginner | coverage check | smoke | — | — | — |
| CE-07 | Parents/teachers can use responsibly | Collapsible parent guide per inquiry | hub step 5 | same | ✅ | §2 parent/teacher | field presence check | smoke | — | — | — |
| CE-08 | Scripture vs interpretation distinguished | `epistemicNote` per inquiry + labeled step 3 | hub footnote | same | ✅ | §2 researcher | field presence check | — | — | — | — |
| CE-09 | Sensitive questions carry boundaries | Death/discipline guides ban fear/shame | hub step 5 | same | ✅ | §2 child-safety | — | smoke | — | — | — |
| CE-10 | Questions not repetitive/leading/artificial | 11 distinct inquiries, open thinking prompts | data design | same | ✅ | §2 specialist | duplicate-id check | — | — | — | — |
| CE-11 | Read mode stays simple | Hub defaults to collapsed single-expand accordion; drawer lazy | hub + drawer | — | ✅ | UI review | — | smoke | a11y | — | — |
| CE-12 | Deeper exploration in Understand/Study | Verse drawer on verse pages links to full reader + related passages | `VerseCuriosityDrawer` via `VerseCard` | same | ✅ | integration grep | `getInquiriesForVerse` reverse-lookup check | — | — | — | — |
| CE-13 | Private questions stay private | No submission/storage; local-only | architecture | — | ✅ | §2 privacy | — | — | — | — | — |
| CE-14 | All references/links/review states valid | D4–D6 fixed; links resolve to seeded verses | `check-curiosity.ts` | `lib/verse-paths.ts` | ✅ | checker passes (11 inquiries, 13 related) | link-resolution check | smoke (hub) | — | Rigveda scripture-page fallback until seed | §6 G-1 |
| CE-15 | Production-scale ready | Full build + export checks + e2e | CI chain | — | ✅ | build 6,350 pages; Playwright 4/4 | `npm run check` incl. curiosity | smoke + a11y | 3 themes | Build race when two builds run concurrently (local-only incident) | Serialize builds |

---

## 4. Content Reuse & Traceability (per question)

For each inquiry: **Anchor verse** (canonical) · **Artha** (aligned re-translation of the site's approved meaning layer) · **deeper layers** = related-passage links only (no duplication of approved Vyākhyā/Vijñāna/Core-Shift blocks — verified by similarity scan; max artha-vs-site-translation similarity 0.79 = aligned paraphrase, not copy; no inquiry embeds any Misreading/Deeper-Truth block).

| Inquiry | Anchor | Reuses / points to |
|---|---|---|
| child-why-is-arjuna-afraid | Gita 1.29 | → Gita 2.3, 2.14 (reader pages with full layered content) |
| child-where-does-mind-go | Gita 6.26 | → Gita 6.35, Katha 3.3 |
| child-why-cant-we-control-results | Gita 2.47 | → Gita 2.48 |
| child-why-so-many-gods-names | Ṛgveda 1.164.46 | → Isha 1 |
| teen-does-detachment-mean-stop-caring | Gita 3.25 | → Gita 2.56 |
| teen-smartphone-distraction-focus | Katha 3.3 | → Katha 3.4 |
| teen-is-questioning-tradition-disrespectful | Gita 4.34 | → Prashna 1.1 |
| parent-how-to-explain-death-without-fear | Gita 2.22 | → Gita 2.20 |
| parent-how-to-teach-discipline-without-shame | Gita 6.16 | → Gita 6.17 |
| beginner-where-should-i-start | Isha 1 | → Gita ch. 2 (chapter page) |
| beginner-canonical-vs-commentary-distinction | Taittiriya 1.11 (excerpt of anuvaka) | → Taittiriya 1.12 |

Editorial bridge added: wonder-prompt framing + thinking prompts + reflection exercises (new, inquiry-specific — by design, not duplication).

---

## 5. Verification Evidence (this pass)

- `npx tsc --noEmit` — clean.
- `npm run lint` — clean (2 pre-existing warnings in unrelated files).
- `npm run check` — all pass, incl. new `check-curiosity.ts`: *"Curiosity Engine integrity OK: 11 inquiries, 13 related passages verified."*
- `npx tsx scripts/canonical-checksum.ts --verify` — *"Canonical Integrity Verified: 100% match"* (master root `0ee965ce…`, 65 scriptures / 187,490 verses).
- `npm run build` — compiled; 6,350 static pages generated; exported `/curiosity/` contains corrected Gita 1.29 and no `freq` corruption.
- Playwright vs built dist: `smoke /curiosity/` ✅, `a11y /curiosity/` day/sunset/night ✅ (4/4).
- Source audit scripts retained in `scratch/` (gitignored): `audit_curiosity2.py`, `fix_matra_order.py`, `verify_dist.py`, etc.

## 6. Remaining Gaps (require sourcing/scope decisions — not engineering)

- **G-1 Rigveda seed gap:** `scriptures-full/rigveda/` seeds only 2 verses of Mandala 1; Ṛgveda 1.164.46 is absent from the corpus, so its anchor links to the scripture overview. Logged in `DATA_QUALITY_BACKLOG.md` (P7).
- **G-2 Illegible source placeholders (do not guess-fix):** `vishnupurana` — `श्रवxxxम्`, `प्रxxद्धा`, `रxxद` — need re-sourcing from the reference edition. Logged in P7.
- **G-3 Artha attribution polish:** several English arthas follow classic public-domain phrasing; recommend adding translator/edition notes to the epistemic footnote over time.
- **G-4 Concurrent-build race (local incident):** two overlapping `next build` runs corrupted a dist-side JSON read; sources were unaffected. Build serially.

---

*Audit performed against the Curiosity Engine as committed on `cursor/cloud-agent-env-setup-0b64` (commits `7c1c79a3`, `6b97aad9`). All code/data fixes, the regenerated canonical checksum baseline, the P7 backlog entry, and the e2e coverage additions are included in those commits.*
