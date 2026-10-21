# Phase 7.1 audit: what was actually implemented

Date: 2026-10-19. Scope: the Phase 7 work (literary layer, Mood Compass, Story Deck, Patrikā Quote Studio) and its effect on canonical text.

**Where the code is.** Phase 7 exists only as *uncommitted* changes in the main checkout (`C:\...\dharma-granth`, branch `cursor/cloud-agent-env-setup-0b64`), mixed with other sessions' work (Phase 6 concordance, Upanishad data rebuilds, panchang and error-handling edits). There is no Phase 7 commit, so a clean "Phase 7 diff" does not exist. Findings below are from `git status`/`git diff` against that branch's HEAD (`c985c823`) and from running that checkout's dev server.

Labels follow the brief: **Verified** = seen working in the running app; **Unverified** = code exists, not run; **Defect** = observed wrong.

## 1. Canonical-content immutability (highest priority)

Method: for every scripture JSON modified in the working tree, compare each verse's number, `sanskrit` and `transliteration` against HEAD.

| Scripture | Verses HEAD → now | Sanskrit changed | Cause |
|---|---|---|---|
| vamanpuran, kurmapuran, markandeypuran, naradapuran, brahmapuran, brahmandpuran, harivanshpuran, tejobindu, yajurveda, viduraniti, ramcharitmanas | unchanged counts | **0** | Added or swapped *editorial* fields only (see section 2) |
| aitareya | 27 → 33 | 4 | Upanishad rebuild (other session), not Phase 7 |
| chandogya | 595 → 628 | 24 | Upanishad rebuild (other session), not Phase 7 |
| brihadaranyaka | 386 → 386 | 0 (but all 366 verse numbers re-keyed) | Upanishad rebuild (other session), not Phase 7 |

**Result:** no Phase 7 change to canonical Sanskrit or IAST was found. The three Upanishad files do change canonical text, but through a separate data rebuild that should be reviewed on its own.

**New automated guard** (this branch): `scripts/check-canonical-integrity.ts` with `data/canonical-manifest.json` (SHA-256 per chapter over verse number + Sanskrit + IAST; 67 scriptures, 4,216 chapters; baseline commit recorded). It ignores editorial fields, so editorial work cannot trip it, and any canonical edit fails it with scripture, chapter, verse, previous value and current value (read from the baseline commit). It never restores text. Re-baseline only with `--update` after review. It is wired into `npm run check`. `CANON_DATA_DIR` lets it run against another checkout.

Note: running it against the main checkout reports ~1,290 mismatches, but almost all are *branch differences* (that checkout lacks this branch's Bhagavata/Harivamsa/Vinaya rebuilds), not damage. The valid Phase 7 comparison is against that checkout's own HEAD, as above.

## 2. Editorial schema audit

| Required separation | Finding |
|---|---|
| Editorial text kept out of canonical fields | **Partly.** Canonical `sanskrit`/`transliteration` untouched. |
| Typed overlay instead of copying verse objects | **Not met.** `lifeLesson` and `keywords` were written *into* the scripture JSON verse objects (vamanpuran, yajurveda, viduraniti, ramcharitmanas). `lib/literary-commentary.ts` (343 lines) holds situations and per-verse meta as a TypeScript map, with no `VerseEditorialLayer`, no review status and no "Editorial · Not Scripture" label field. |
| Review status (`draft` … `approved`) | **Missing.** |
| Editorial label | **Missing** as a data field. |

**Defect, data semantics (needs repair before merge):**
- `ramcharitmanas.json`: 70 verses had the English `translation` replaced by Hindi text, and the `science` field was dropped.
- `viduraniti.json`: 608 `science` values changed from Hindi to English ("Research on …"). 
- `vamanpuran.json`: 142 `hindi` values changed from empty to text; `yajurveda.json`: 4 `translation` values.
These look like a script that wrote into the wrong field per language. Fields that carry a language need to hold that language.

## 3. Requirement-to-implementation matrix (as far as inspected)

| Phase 7 item | Status | Evidence |
|---|---|---|
| Literary essay-style explanations | **Unverified.** Content lives in `lib/literary-commentary.ts`; not read end to end for filler phrases or accuracy. | file inspected, not run |
| Core Shift callouts | Unverified | referenced from `VerseCard.tsx`, not opened in the browser |
| Situational discovery | Partially implemented (moment taxonomy exists) | `SITUATIONAL_MOMENTS` |
| Common Misreading / Deeper Truth blocks | Unverified; no typed fields | see section 2 |
| Mood Compass (home page) | **Complete and verified** for the click path: 6 moods, clicking "Restless / Overwhelmed" shows Gita 6.26, 2.14, 6.35 and a Wisdom-for-Life link; verse links use `/scripture/<id>/chapter/<n>/verse/<v>/` | browser test, dev server |
| Mood Compass accessibility | **Defect.** The six mood buttons expose no `aria-pressed` state; the three "listen" icon buttons have a `title` but no `aria-label` (no accessible name) | DOM inspection |
| Five-card Story Deck | **Unverified, probable defect.** `app/components/reader/StoryDeckModal.tsx` is one line, `export * from '@/components/reader/StoryDeckModal'`, i.e. the real component lives in the untracked top-level `components/` folder; same pattern for `SvadhyayaSplitDrawer.tsx`. It is imported from `VerseCard`, `VerseOfTheDaySection` and `TopicDetailClient`. | file inspection |
| Patrikā Quote Studio + PNG export | Unverified. `PatrikaShareStudioModal.tsx` (517 lines) is wired from `ShareVerseButton.tsx`. PNG export not run | file inspection |
| Motion/swipe interactions | Unverified | not run |
| Theme refinements | Unverified | not run |
| Mobile one-thumb control bar | Unverified (`MobileOneThumbControlBar.tsx`, 318 lines, new) | file inspection |

Not tested at all: Story Deck swipe, Quote Studio PNG output, reduced-motion behaviour, keyboard operation of the modals, mobile widths, performance (bundle, first-load JS) of the new components.

## 4. Other observations

- Homepage: Phase 7 did not shorten it. In that checkout the Verse-of-the-day section is still ~2,980 px tall. This branch already replaces it with a compact card.
- The old `FloatingCompanion`, `MobileAudioPill` and `useHaptics` files are deleted in that working tree; whatever imported them must be checked (typecheck was not run on that checkout).
- Production build size on the merged branch: `dist` is **3,097 MB in 18,450 files**; Cloudflare Pages allows 20,000 files and 25 MiB per file. Only ~1,550 files of headroom remain, so new pages or shards can break deploys.
- Merged branch gate (this branch, not the Phase 7 checkout): `npm run build` exits 0; export and sitemap checks pass (7,567 URLs, trailing-slash clean).

## 5. Prioritised repair plan (not started; awaiting go-ahead)

1. Commit Phase 7 in separate slices, so it can be reviewed apart from the data rebuilds.
2. Revert the wrong-language field writes in ramcharitmanas / viduraniti / vamanpuran / yajurveda, or fix their generator.
3. Move `lifeLesson`, `keywords` and the literary map into one typed editorial overlay (`VerseEditorialLayer`: core shift, situations, misreading, deeper truth, micro-practice, status, label) keyed by verse id, defaulting every record to `review-required`.
4. Run the real browser tests: Story Deck, Quote Studio PNG, keyboard and reduced-motion, 375 px.
5. Fix the Mood Compass accessibility gaps.
6. Replace the one-line re-export shims with the actual component files in `app/`.
7. Watch the 20,000-file deploy limit.

## 6. Repairs done (2026-10-19, in the main checkout's working tree; not yet committed there)

Re-reading the data field by field corrected part of section 2.

- **Real data loss, repaired:** `ramcharitmanas.json`: all 35 English `translation` values had been overwritten with Hindi (the Hindi was already in `hindi`). Restored the 35 English translations from HEAD. `viduraniti.json`: verses 4.31 and 7.21 had `translation` replaced by the two characters "चन"; restored the English from HEAD.
- **Not defects after all:** the Purana files (vamanpuran, kurmapuran, markandeypuran, naradapuran, brahmapuran, brahmandpuran, harivanshpuran, yajurveda, tejobindu) only *added* text to previously empty verses, each in the right language (translation English, hindi Hindi, science English). Vidur Niti's 276 removed `science` values were duplicates of text kept in `hindi`; Ramcharitmanas' removed `science` was likewise a duplicate of `hindi`. These are an architecture issue (editorial text stored inside scripture JSON), not language errors. Section 2's wording on those files was too strong.
- **Verified after repair:** per-field language comparison against HEAD shows no remaining `translation` language changes; canonical Sanskrit and IAST unchanged (earlier check).
- **Accessibility (Mood Compass):** the six mood buttons now carry `aria-pressed` (1 of 6 true); the three listen buttons now have an `aria-label` ("श्लोक उच्चारण सुनें · Gita 6.26", etc.). Checked in the running app: 0 buttons without an accessible name.

Still open from the plan: commit Phase 7 in slices, the typed `VerseEditorialLayer` overlay, replacing the re-export shims, browser tests of Story Deck / Quote Studio / swipe / reduced motion / 375 px, and the 20,000-file deploy limit.

## 7. UI follow-up (2026-10-20)

- The modern-life lesson now lives in its own fourth `VerseCard` tab alongside Arth, Vyakhya and Vigyan. This keeps the lesson available without adding another always-visible block below every verse.
- The tab row scrolls horizontally on narrow screens, uses 44 px minimum touch targets, and retains its existing arrow/Home/End keyboard navigation and animated selected-pill indicator.
- The lesson remains labelled as reflection/editorial content. No scripture or editorial source data was changed in this UI follow-up.
- Verification: TypeScript, ESLint, production build (7,609 routes), export check (4,212 chapters and 2,548 verse pages), sitemap check (7,383 URLs), and the focused 375 px Playwright keyboard/selection test all passed.
- The older checklist above records the 2026-10-19 audit snapshot; this follow-up updates the VerseCard tab/navigation item only. Other listed editorial-review and integration work remains separate.
