# Dharma Granth: next-stage enhancement audit (Phases 1–3)

Scope of this pass: Phase 1 (investigation), Phase 2 (baseline) and Phase 3 (homepage). Phase 4 onward is not started; see "Deferred".
Labels: **Observed** = tested in the running site or by a command; **Inferred** = read from code, not tested; **Proposed** = not done.

## 1. Architecture (observed from the repo)

- Next.js 14 app router, static export to `dist/` (`trailingSlash: true`), Cloudflare Pages. Tailwind with `dharma-*` colour tokens. framer-motion for motion.
- Scripture data: runtime reads `public/data/scriptures-full/*.json` (sharded per chapter). `data/scriptures/*.ts` is the curated source, not the runtime source.
- Checks: `npm run check` (data, topic shlokas, filler, wisdom, commentary quality, published scriptures); `check:export` (first-load JS budget); `check:sitemap`; Playwright e2e in `tests/`.
- Project rules are in `CLAUDE.md` (crawler safety, edge cache headers, header parity, philology, zero-account privacy, trailing slashes).

## 2. Baseline (Phase 2)

| Check | Result |
|---|---|
| `tsc --noEmit` before changes | exit 0 |
| Homepage page height, 698 px-wide pane | 11,253 px |
| Hero section height | 945 px, 12 interactive controls |
| "Verse of the day" section height | 3,030 px |
| Console, dev mode | hydration warning in `VerseOfTheDaySection` share links (server URL is the production origin, client URL is `localhost`; **inferred** dev-only) |
| Console, dev mode | `ref is not a prop` warning from `components/ui/PranaCapsule.tsx` (**observed**; file belongs to another in-progress change) |

Not run in this pass: full `next build`, Playwright, Lighthouse, axe. Other sessions run builds on this checkout; a full build was not started here to avoid clobbering `.next`.

## 3. Observed homepage problems (before)

1. Hero carried: an OM medallion button, four floating Sanskrit cards, mandala rings, 24 particles, mouse parallax, three call-to-action buttons plus a surprise-verse button, six suggestion pills, a three-line tagline, and an extra "beginners / returning readers / inquiries" line. **Observed:** 12 controls.
2. "Verse of the day" was a 3,030 px long-form study block on the home page.
3. Panchang preview and a "Touch & Contemplate" 3D section sat below practice, pushing trust information off the page.
4. No trust or sourcing statement on the home page.

## 4. Changes made

- `app/components/HeroSection.tsx`: rewritten. Eyebrow, one headline, one sentence, one search field, four quick searches, one primary action (start with the Gita), one secondary action (browse all), and a quiet "ask the guide" link. No animated background or parallax; respects reduced motion by having none.
- `app/components/VerseOfTheDayCompact.tsx` (new): reference, canonical verse, one-line meaning, first sentence of the reflection, "Read full explanation". Uses the **Indian-calendar day** (`getTodayWisdom`), so everyone sees the same verse; the old section used the visitor's local day.
- `app/components/HomeTrustStrip.tsx` (new): short statement that source text is separate from translation and commentary, with links to Sources and Methodology.
- `app/page.tsx`: new order: hero, continue reading / start here, compact verse, browse by category, life situations, featured scriptures, practice preview, trust strip, footer. The Panchang preview and 3D section are no longer on the home page (their routes are unchanged; `/panchang/` is reachable from the header and bottom bar).
- The old `VerseOfTheDaySection`, `PanchangPreviewSection` and `Experience3DSection` files are left in place, unused.

## 5. After (observed, dev server)

- Hero 945 → 683 px, 9 controls; verse section 3,030 → 463 px.
- Typecheck exit 0; ESLint clean on the four changed files.
- Screenshots at the pane width show the new hero and verse card render correctly.
- Total page height only fell 11,253 → 10,866 px, because Category (1,322), Life Situations (1,820) and Featured (2,716) are themselves long. **Proposed:** make those three horizontally scrollable or cap them to a first row with "See all".

## 6. Deferred (not started)

- Phase 4 navigation and breadcrumbs: `SiteNav.tsx`, `ThemeProvider.tsx` and `ThemeToggle.tsx` have uncommitted edits from another session; editing them now risks conflicts. Do this after those changes land.
- Search quality, reader hierarchy, design-system consistency, accessibility audit (axe), Lighthouse performance, e2e additions.
- The global floating widgets (Dharma Copilot button, "प्रणव ॐ ध्यान" capsule, bottom bar) overlap the page at phone width. **Observed**; they come from `components/ui/` which another session is editing.

## 7. Testing strategy for the rest

Typecheck + lint per phase; `npm run check` for data; one full `npm run build` (runs `check:export`, the 300 KB first-load budget) after the other sessions finish; Playwright on `/`, `/scriptures/`, a chapter page and `/search/`; axe on the same routes.

## 8. Follow-up pass (observed)

- Breadcrumbs: visible `Library > Scripture > Chapter > Verse` trail added to scripture, chapter and verse pages (`app/components/Breadcrumbs.tsx`); structured-data breadcrumbs on the scripture and verse pages now use the same hierarchy and trailing-slash URLs. Checked on `/scripture/bhagavadgita/chapter/2/verse/47/`, `/scripture/bhagavatapurana/chapter/2/` and `/scripture/bhagavatapurana/`.
- Desktop "Explore" menu: Escape closes it and returns focus to the button; English and Hindi labels are separate elements.
- Phone-width trimming: the category tiles (first 4 of 8), life-situation cards (first 4) and featured scriptures (first 3 of 6) show on phones; the rest appear from the `sm` breakpoint up. Each section keeps its link to the full list.
- Measured after these changes: 375 px emulation, page height 10,234 px, no horizontal overflow; 1,024 px width, page height 7,132 px. The earlier 11,253 → 10,866 px figures were taken in a narrower desktop pane and are not comparable with these two. There is no same-width baseline for the old homepage.
- Still long on phones: Life Situations (1,645 px), Featured (1,830 px) and the Sadhana preview (1,407 px). **Proposed:** a horizontal scroller for each, or a single-row preview.
