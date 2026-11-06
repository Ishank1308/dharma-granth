# Project audit — 2026-10-25

Scope: the whole repository, checked against the six non-negotiable rules in `CLAUDE.md`, plus security, data quality, deploy limits and code health.

Branch: `deploy/scripture-opening-ux` @ `880f64a8`. The working tree had 23 modified and 2 untracked files from other tools; this audit read them but did not change them.

## How this was measured

| Check | Command / method | Result |
|---|---|---|
| Types | `npm run typecheck` | Pass (0 errors) |
| Lint | `npx next lint` | Pass, 5 `react-hooks/exhaustive-deps` warnings |
| Unit tests | `npm test` (8 suites) | All pass |
| Content checks | `node scripts/check-all.mjs` | 10/10 pass, 0 errors, **81,048 warnings** |
| Internal links | Custom crawler over every `.html` in `build/` (8,045 files), resolving against files and `_redirects` | 10 broken targets (14 links) |
| Trailing slashes | Same crawler: internal `href`s without a trailing slash | ~30 verse URLs (Brihadaranyaka, Chandogya) |
| Sitemaps | `build/sitemap-*.xml` | 7,826 URLs, all end in `/` |
| Export size | `find build -type f` | **19,803 files** (Cloudflare Pages limit: 20,000) |

`build/` is the most recent full export on disk (2026-10-23 00:13). It was built with `NEXT_PUBLIC_SITE_URL=https://dharmagranth.in`. No dev server was running, so nothing was checked in a live browser. Findings from `build/` predate the last two days of commits. Re-run the crawlers after the next build (see Appendix A).

---

## Summary

| # | Severity | Finding | Rule |
|---|---|---|---|
| 1 | **P0 – Security** | Muse Spark API key gets bundled into client JS through `NEXT_PUBLIC_MUSE_SPARK_API_KEY` | — |
| 2 | **P0 – Deploy** | Export is 197 files below the Cloudflare 20,000-file limit | — |
| 3 | **P0 – SEO** | Canonical domain is split between `dharmagranth.dev` and `dharmagranth.in` | 6 |
| 4 | P1 – Feature | Browser chat agent calls `api.meta.ai`, but the CSP `connect-src` blocks it | 5 |
| 5 | P1 – Links | About 30 hand-built verse links skip `versePageHref()`: missing trailing slash, and 404 for scriptures without verse pages | 6 |
| 6 | P1 – Philology | Truncated Sanskrit ("…") shown as verse text in `/learn/paths/` and the word explorer | 4 |
| 7 | P1 – Privacy | The main JSON backup skips IndexedDB data (Manana items) | 5 |
| 8 | P1 – Content/SEO | 40,523 verses have no translation and no Hindi, yet their chapter pages are in the sitemap | — |
| 9 | P2 – Links | 10 broken internal links (concept and wisdom slugs, one wrong Upanishad reference) | — |
| 10 | P2 – Caching | `/data/*` (692 MB), `/search-index/*` and `/chapter-index.json` fall under the `max-age=0` HTML rule | 2 |
| 11 | P2 – Deploy | The Cloudflare deploy also runs from the stale branch `fix/audit-cloudflare-search` | — |
| 12 | P2 – Security | `/api/feedback` has no rate limit, and its read-then-write counters lose concurrent votes | — |
| 13 | P2 – Docs drift | `CLAUDE.md` names themes and a `<Header />` that differ from the code | 3 |
| 14 | P3 – Code health | About 48 unused modules, 3 search normalizers, a stray `src/`, tracked scratch files | — |
| 15 | P3 – Data checks | Duplicate baselines in `check-data.ts` should be lowered; the backlog doc is stale | — |
| 16 | P3 – Editorial | Unsupported "432Hz वैदिक तन्पूरा" claim in the nav | — |

### Resolution status (2026-10-25, end of day; not committed)

Owner decisions: the domain is **dharmagranth.dev**; the browser AI chat (Muse Spark) is **removed**; Sanskrit-only chapters are **noindexed until translated**; unused modules are **deleted**; the backup change (finding 7) was **dropped by the owner**.

| # | Status | What changed |
|---|---|---|
| 1 | Fixed; owner rotates the key | Env-key fallback removed. `next.config.js` refuses `next build` with a `NEXT_PUBLIC_*KEY/TOKEN/SECRET/PASSWORD` variable set (lint runs are exempt). |
| 2 | Warned, not reduced | `prune-export.mjs` warns above 18,500 files. Reducing the count needs the R2 move (E8). Removing 953 chapters from the sitemap does not remove their files. |
| 3 | Fixed | CI and the retired workflow use `.dev`. Pages and share fallbacks use `SITE_URL` (`lib/jsonld.ts`), and the metadata URLs got their trailing slashes. `CLAUDE.md` is retitled. Backup files still accept `source: 'dharmagranth.in'`. |
| 4 | Removed | `lib/muse-chat-agent.ts` and `copilot/MuseAgentResponseView.tsx` are deleted. `/ask/` and the Copilot modal now answer only from the library. The Node drafting scripts that use Muse Spark (`lib/muse-spark.ts`, `scripts/*muse*`) are unchanged. |
| 5 | Fixed | See E1. Only the untracked `ChapterOrientationDrawer.tsx:330,414` remains. |
| 6 | Fixed | 40 snippets replaced with the complete verse, copied by script from `scriptures-full` after checking that each snippet's opening matched its reference (40/40). Brihadaranyaka 4.4.22 is now complete. |
| 7 | Dropped | By the owner's decision. |
| 8 | Fixed | `chapterHasMeaning()` (`lib/verse-meaning.ts`) noindexes chapter and part pages, drops them from `sitemap-chapters.xml` (7,856 → 6,903 URLs) and shows a मूल पाठ notice. |
| 9 | Fixed in source | Related-concept links render only when the page exists (`lib/concept-pages.ts`). `purpose-of-life` now points to `meaning-of-life`. Brihadaranyaka 4.4.22 has the right verse id. `fear-and-anxiety` was already gone from the source. |
| 10 | Fixed | Cache rules added for `/data/*`, `/search-index/*` and `/chapter-index.json`. The two data fetches now use the base path. |
| 11 | Fixed | The deploy runs only from `master`. |
| 12 | Owner action | A code-level per-visitor limit would break the endpoint's documented "never reads the caller's address" promise. Add a Cloudflare rate-limiting rule for `/api/feedback` instead. |
| 13 | Fixed | `CLAUDE.md` rules 2 and 3 now match the code. The dead `[data-theme='dark']` selectors are removed. |
| 14 | Mostly fixed | 45 unused modules and `src/` deleted. Still open: the two remaining search normalizers, the top-level `components/` folder, and the tracked `scratch/` files. |
| 15 | Fixed | See E1. |
| 16 | Fixed | "वैदिक तन्पूरा" / "Vedic Tanpura" is now "तानपूरा (432Hz)". |

### Full build check (2026-10-25, with every change above plus other tools' uncommitted work)

`next build`, then the postbuild checks, run into a separate `audit-dist/` folder, which was deleted afterwards:

| Check | Result |
|---|---|
| Build | ✓ All 8,093 pages generated |
| Sitemap | ✓ 6,903 URLs, all on `https://dharmagranth.dev` |
| File count | ⚠ 19,493 files, 507 under the limit (the new warning fired) |
| JS ratchet | ✗ The chapter page grew to 411 KB (ceiling 365) and the verse page to 371 KB (ceiling 368). The cause is the other tool's uncommitted `ChapterOrientationDrawer` and `StickyVerseNavigator` (imported by `chapter-view.tsx` and `FullChapterVerses.tsx`) and its `VerseCard` edits. Trim that work; do not raise the ceilings. |
| Export weight | ✗ `/scripture/vivekchudamani/chapter/1/` HTML is 2,603 KB (budget 2,560 KB). The Gita chapter 2 page loads 380 KB gz of JS (budget 350 KB), the same cause as above. |
| Internal links | ✓ All 10 original broken targets are fixed. 12 more, already in HEAD from 2026-10-24 content, are now listed in `KNOWN_BROKEN`: 10 `/knowledge/*` hubs linked from `/pathways/*`, and Chandogya 6.8 / 6.9 on `/daily/`, which are cited by khanda; the verse pages are chapter 105, verse 6.8.N. `/api/*` paths are skipped because Pages Functions serve them. |

**Not fixed by finding 5: the dotted verse URLs still lose their trailing slash.** Next's `<Link>` deliberately strips a trailing slash when the last path segment contains a dot (it treats `4.3.7` as a file extension). So `readHref()` returning `/verse/4.3.7/` still renders as `/verse/4.3.7`. That leaves 21,857 links to 1,184 Brihadaranyaka and Chandogya verse pages costing a 308 each. **Owner chose (a), now implemented (2026-10-25):** `app/components/VerseHrefLink.tsx` renders a plain `<a>` when the last path segment contains a dot and `next/link` otherwise. It is used in `VerseText.tsx` (chapter-page verse headings), `VerseReader.tsx` (prev/next, the verse grid and the go-to-verse dialog), `NextTeachings.tsx`, and all 17 client-side `readHref` links. Typecheck, lint and a render test pass. The full-build measurement is still pending, because a `next dev` on port 3003 started by another tool overwrites `.next` mid-build. Rerun the build with no other Next process running, and expect the slashless count to fall from 21,857 to near zero.

The options were:
- (a) render dotted verse links as plain `<a>` (full page loads, slash kept);
- (b) change the dotted slugs to `4-3-7`, with 301s from the old URLs and new canonicals;
- (c) accept the 308s.

Rules found **compliant**: 1 (SSR and error-boundary `noindex`), 2 (the asset rules that exist), 3 (bilingual label separation, six primary routes), and the sitemap side of 6.

---

## P0 findings

### 1. API key reaches the browser bundle

> **Status 2026-10-25: code fixed.** `lib/muse-chat-agent.ts` no longer reads the env key. `next.config.js` now throws during `next build` if any non-empty `NEXT_PUBLIC_*` variable has KEY, TOKEN, SECRET or PASSWORD in its name. Still to do: the owner rotates the key and deletes the `NEXT_PUBLIC_MUSE_SPARK_API_KEY` line from `.env.local`.

- `.env.local:44` sets `NEXT_PUBLIC_MUSE_SPARK_API_KEY` to a 48-character value. Next.js inlines every `NEXT_PUBLIC_*` variable into client JavaScript.
- `lib/muse-chat-agent.ts:27-33` reads `process.env.NEXT_PUBLIC_MUSE_SPARK_API_KEY` as the fallback key.
- **Verified:** the key's literal value appears in `dist/static/chunks/app/page.js` and `dist/static/chunks/app/ask/page.js` (the dev build). Any local `npm run build` followed by a deploy publishes it. The CI builds checked (`build/`, and the workflows, which have no such secret) do not contain it.

**Fix**
1. Delete the three `NEXT_PUBLIC_MUSE_SPARK_*` lines from `.env.local`. Keep only the server-side `MUSE_SPARK_*` lines, which the scripts use.
2. Remove the `process.env.NEXT_PUBLIC_MUSE_SPARK_API_KEY` fallback in `lib/muse-chat-agent.ts`. The browser path should only use a key the reader pastes in (bring-your-own, kept in `localStorage`).
3. **Rotate the key** at the provider. It has been in local bundles, and in any export ever deployed from this machine.
4. Add a postbuild guard to `scripts/check-export.mjs` that fails if any `NEXT_PUBLIC_*KEY*`/`*TOKEN*` variable is set during the build.

Done when `grep -rF "<key>" dist build` finds nothing and the build fails if the variable is set again.

### 2. File count is at the Cloudflare limit

- `build/` has **19,803 files**. Cloudflare Pages rejects a deploy with more than 20,000.
- Adding one more scripture with verse pages, or splitting a few more chapters into parts, will break deploys.

**Fix (pick one or more)**
- Stop emitting the per-page `index.txt` RSC payload for verse pages. For each HTML page Next writes a `.txt` file too, so this would roughly halve the count for verse routes. See `docs/architecture-scripture-delivery-r2-migration.md`, which already describes serving `.txt` from R2.
- Move `public/data/scriptures-full/**` (692 MB) to R2 behind the existing Pages Function pattern.
- Make `scripts/prune-export.mjs` **warn at 18,500 files**, not only fail at 20,000, so the next feature author sees the limit coming.

### 3. The canonical domain is split

| Place | Domain |
|---|---|
| `public/CNAME` | `dharmagranth.dev` |
| `.github/workflows/deploy-cloudflare.yml:25` (the live deploy) | `dharmagranth.dev` |
| `netlify.toml:7` | `dharmagranth.dev` |
| Default in `app/layout.tsx`, `app/robots.ts` and ~30 page files | `dharmagranth.dev` (65 hard-coded uses) |
| `.github/workflows/ci.yml:17` | `dharmagranth.in` |
| `.github/workflows/deploy.yml:24` (retired GitHub Pages) | `dharmagranth.in` |
| `CLAUDE.md` title, `lib/study/*` comments | `dharmagranth.in` |
| `build/` canonicals and sitemaps | `dharmagranth.in` |

CI tests sitemaps and canonicals against a different origin from the one that deploys. So a regression that only shows up on `.dev` passes CI. Hard-coded share URLs, such as `app/components/daily/DailyDharmaJourneySession.tsx:1119`, ignore the environment variable entirely.

**Fix**
1. Decide on one domain. **This needs the owner.**
2. Set it in all three workflows, `netlify.toml`, `CNAME` and `CLAUDE.md`.
3. Replace the 65 hard-coded `https://dharmagranth.dev` strings with a single `SITE_URL` export (e.g. from `lib/og.ts` or a new `lib/site-url.ts`).
4. If both domains stay live, 301 the secondary one at the Cloudflare zone, not in `_redirects`.

---

## P1 findings

### 4. The CSP blocks the browser chat agent

- `public/_headers` sets `connect-src 'self' https://cloudflareinsights.com`.
- `lib/muse-chat-agent.ts:106` sends `fetch` to `https://api.meta.ai/v1/chat/completions` from the browser. It is used by `AskDharmaClient`, `DharmaCopilotModal` and `CopilotPanel`.
- In production the request is blocked, so the feature cannot work. If it were allowed, readers' questions would go from their browser to a third party. That conflicts with the "zero-account privacy" promise unless `/privacy/` discloses it, and it currently does not mention it.

**Fix (needs the owner's decision)**: either (a) remove the browser agent from production builds, or (b) proxy it through a Pages Function (server-side key, rate-limited), add only that function's path to `connect-src`, and disclose it on `/privacy/`.

### 5. Hand-built verse URLs

> **Status 2026-10-25: fixed** for every tracked file, and enforced by lint (see E1). Only the untracked `ChapterOrientationDrawer.tsx` remains.

`lib/verse-paths.ts:40` `versePageHref()` is the correct helper. It adds the trailing slash and returns `undefined` for scriptures without verse pages; only the 12 IDs in `VERSE_PAGE_SCRIPTURE_IDS` have them. About 30 call sites build the URL by hand instead:

```
app/components/ChapterOrientation.tsx:155,191
app/components/reader/ChapterOrientationDrawer.tsx:330,414   (untracked, in progress)
app/components/conversation/ConversationModeView.tsx:143
app/components/daily/DailyDharmaJourneySession.tsx:496,1073,1118,1119
app/components/daily/DailyDharmaDashboard.tsx:225
app/components/dashboard/RecentActivityFeed.tsx:71,89,107
app/components/InteractiveChapterMap.tsx:133,197,246
app/components/ScriptureReader.tsx:1701
app/components/study/RecommendationCards.tsx:54
app/components/understand/SanskritWordExplorerDrawer.tsx:108
app/concepts/ConceptRelations.tsx:26
app/concepts/relationships/page.tsx:56
app/learn/journeys/[id]/page.tsx:46
app/learn/paths/page.tsx:206
app/practice/bookmarks/page.tsx:616,671
app/practice/desk/DeskClient.tsx:50,269
app/practice/desk/SavedCollections.tsx:90
app/practice/journal/JournalClient.tsx:479
lib/sitemap-sections.ts:176   (sitemap output itself is correct)
```

Two failures follow from this:
- **Missing trailing slash.** Next's `<Link>` adds the slash for normal paths but **not** when the last segment contains a dot. It treats `4.3.7` as a file extension. The build has links such as `/scripture/brihadaranyaka/chapter/24/verse/4.3.7`, while the canonical and the sitemap say `.../4.3.7/`. Every such click or crawl costs a 308 redirect.
- **404s.** Bookmarks, journal, desk, dashboard and recommendation links for any scripture outside the 12 (Ramayana, Puranas and others) point at verse pages that do not exist.

**Fix**: add `verseHref(scriptureId, chapter, verse)` to `lib/verse-paths.ts`. It returns `versePageHref(...)` when that exists, otherwise `/scripture/${id}/chapter/${chapter}/#verse-${verse}`. Replace all the sites above with it. Add an ESLint `no-restricted-syntax` rule (or a `scripts/check-*.ts` grep) that rejects template literals containing `/verse/${`.

### 6. Truncated Sanskrit shown as verse text

Rule 4 forbids cutting a shloka mid-verse.
- `data/guided-reading-paths.ts`: 17 `sanskritSnippet` values end in `...` (lines 61, 71, 81, 112, 122, 132, 163, 173, …). `app/learn/paths/page.tsx:214-216` renders them as `lang="sa"` verse text.
- `data/sanskrit-lexicon.ts`: 23 `snippet` values end in `...` (lines 71-73, 101-102, 130-132, …). `app/components/understand/SanskritWordExplorerDrawer.tsx:105` renders them.
- `lib/verse-relationship-engine.ts:429` holds a cut Brihadaranyaka 4.4.22, shown in `VerseGraphNetwork`.
- Compliant already: `app/components/reader/SamvadaStrip.tsx:89` hides snippets that end in an ellipsis. Follow that pattern.

**Fix**: fill these from `scriptures-full` at build time (the full first half-verse or the full verse) instead of hand-typed snippets, or render only the reference and the takeaway. Do not hand-type Sanskrit.

### 7. The backup is incomplete for IndexedDB data

- The backup UI used on `/practice/` and `/learn/` (`app/components/BackupRestore.tsx` → `lib/backup.ts`) exports only `localStorage` keys with the `dharma.`/`dharma_`/`dharma-`/`dharmagranth_` prefixes.
- Manana items live in IndexedDB (`lib/db/granth-indexeddb.ts`, written by `MananaSelectionBar`). They are exported only by the separate sync-string tool (`lib/db/sadhana-sync.ts`).
- There are four backup formats in all: `lib/backup.ts`, `lib/sadhana-backup.ts`, `lib/db/sadhana-sync.ts` and `lib/study/journal-backup.ts`. A reader who uses "Export" loses their Manana notes when they change devices.
- All 77 `localStorage` keys found in the code do match the backup prefixes, which is good.

**Fix**: make `createBackup()` async and include `getAllMananaItems()`; restore them in `restoreBackup()`. Then treat the other three formats as import-only legacy formats. Extend `scripts/test-backup.ts` with a round trip that includes Manana items.

### 8. Thin chapters in the sitemap

`check-data` reports 40,203 verses (plus 320 in sub-numbered verses) with **neither a translation nor Hindi**, and an empty explanation:

| Scripture | Warnings (2 per verse) |
|---|---|
| devibhagavat | 36,752 |
| bhagavatapurana | 28,802 |
| harivanshpuran | 10,270 |
| vinayapatrika | 2,964 |
| shivasamhita | 1,288 |
| yogasutra | 390 (≈ all 195 sutras) |
| shandilyabhaktisutra | 196 |
| naradabhaktisutra | 154 |
| kaushitaki | 98 |
| others | < 75 each |

Verse pages already `noindex` themselves when there is no meaning (`app/scripture/[id]/chapter/[chapterId]/verse/[verseId]/page.tsx:186`), but **chapter** pages do not. `sitemap-chapters.xml` lists 652 Devi Bhagavata and Bhagavata chapter URLs that are Sanskrit-only. `DATA_QUALITY_BACKLOG.md` still marks "P1 — Missing English translations ✅ DONE"; that was true when written, but is no longer true across the corpus.

**Fix**
1. Apply the same rule to chapter pages: if no verse in the chapter has a meaning, set `robots: { index: false, follow: true }` and leave the chapter out of `sitemap-chapters.xml` (`lib/sitemap-sections.ts`).
2. Show the reader an honest "मूल पाठ — अर्थ शीघ्र" notice on those chapters.
3. Update `DATA_QUALITY_BACKLOG.md` with these counts.
4. Prioritise the Yoga Sutra and the Narada Bhakti Sutra: they are short, high-traffic texts. Follow `docs/vyakhya-guide.md` and the high-confidence rule; do not machine-fill.

---

## P2 findings

### 9. Broken internal links (from `build/`)

| Target | Linked from |
|---|---|
| `/concepts/karma-yoga/` (4) | `wisdom-for-life/contentment/` |
| `/concepts/satya/` (2) | `concepts/ahimsa/` |
| `/concepts/om/`, `/concepts/viveka/`, `/concepts/seva/`, `/concepts/guna/`, `/concepts/dhyana/` | concept and wisdom pages |
| `/wisdom-for-life/purpose-of-life/` | `learn/journeys/purpose-and-meaning/` |
| `/wisdom-for-life/fear-and-anxiety/` | `learn/journeys/stress-and-anxiety-relief/` |
| `/scripture/brihadaranyaka/chapter/25/verse/22/` | Gita 18.66 page. The source is `lib/verse-relationship-engine.ts:424`: `targetVerse: 22` should be `'4.4.22'`, the scheme Brihadaranyaka uses. |

**Fix**: either create the missing concept entries, or point the links at existing slugs. Then add this crawler (Appendix A) to `postbuild` so a broken internal link fails the build.

### 10. Data JSON inherits the `max-age=0` HTML rule

`public/_headers` has asset rules for `/_next/static/*`, `/fonts/*` and `/search/*`, but none for `/data/*` (scripture shards, commentary, concordance), `/search-index/*` or `/chapter-index.json`. Each read then revalidates against the origin. That works, but it is slow on mobile for files of several MB. They change only on deploy, so give them the same policy as `/search/*`:

```
/data/*
  ! Cache-Control
  Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800
/search-index/*
  ! Cache-Control
  Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800
```

Also: `fetch('/data/concordance-index.json')` and `fetch('/data/samvada-dialogues.json')` skip `BASE_PATH`, unlike every other fetch. That is harmless at the root domain but inconsistent.

The `/assets/*` and `/_astro/*` rules are harmless, but `CLAUDE.md` says these paths do not exist. Keep them (the comment says why) or delete them, as long as both say the same.

### 11. A stale branch can deploy to production

`.github/workflows/deploy-cloudflare.yml:10` deploys on push to `master` **and** `fix/audit-cloudflare-search`. A push to that old branch would overwrite production. Remove it from `branches:`, or route non-master branches to a preview deployment (`--branch` in `wrangler pages deploy`).

### 12. Feedback endpoint (`functions/api/feedback.ts` → `lib/feedback-server.ts`)

- `POST` has no rate limit and no per-client dedupe, so one script can skew any verse's rating without limit, and every vote is a KV write.
- `bump()` reads, then writes. Concurrent votes overwrite each other, and KV is eventually consistent.
- **Fix**: add a Cloudflare rate-limiting rule on `/api/feedback` (dashboard or WAF), or Turnstile. For accurate counts, move to a Durable Object or D1 counter. The GET side is fine: it is token-gated with a constant-time compare.

### 13. Docs and code disagree on header and themes

- `CLAUDE.md` rule 3 names `<Header />` and the themes `Day, Sunset, Paper, Dark`. The code has `SiteNav` (`app/components/SiteNav.tsx`) and `day, sunset, paper, night` plus `auto` (`lib/site-theme.ts:1`).
- `app/globals.css:1653,1668,1683` still has `:root[data-theme='dark']` selectors. These are dead: the theme is now `night`, and the `night` selector sits beside them.
- `/bhagavad-gita/` is listed as a primary route, but it is a 301 to `/scripture/bhagavadgita/` (`public/_redirects`), and the nav links the target directly. That is correct behaviour, but the rule text should say so.
- **Fix**: update `CLAUDE.md` to the real names (`SiteNav`, `night`/Rātri, `auto`) and remove the dead `dark` selectors.

What the audit confirmed: one `SiteNav` is rendered from `app/layout.tsx` for every route. The desktop nav links all six primary routes. The English and Hindi labels are separate elements (`<span>Home</span> <span lang="hi">मुख</span>`). The theme script sets `data-theme` before first paint.

---

## P3 findings

### 14. Code health

- **Probably unused modules** (no importer found; check dynamic and worker imports before deleting): `ScriptureReader.tsx` (1.7k lines), `ChapterOrientation.tsx` (superseded by the new drawer), `AdvancedSearch`, `BookExplanationPanel`, `BookLearningClient`, `CategoryExploreSection`, `HomeDiscoveryBento`, `LazyHomeSections`, `LifeSituationsSection`, `MoodCompass*`, `VerseOfTheDaySection`, `VersePageActions`, `VerseRelatedSection`, `VerseStudyNotes`, `copilot/CopilotPanel`, `dashboard/*` (4), `motion/*` (6), `svaadhyaya/SvaadhyayaEngine`, `components/study/OfflinePacksModal`, `components/study/PrivacyLock`, `lib/edge-chapter-renderer.ts`, `lib/private-study/{store,integration}.ts`, `lib/ocr/{devanagari-normalizer,verse-parser}.ts`, `lib/utils.ts`. `lib/workers/search.worker.ts` may load through `new URL(...)`, so verify it.
  Several of these hold the hand-built verse links from finding 5, so deleting them removes those bugs as well.
- **Three search normalizers**: `lib/normalize-search.ts` (6 importers), `lib/searchNormalizer.ts` (9), and `src/lib/searchNormalizer.ts`, which differs from the `lib/` copy. `CLAUDE.md` says there is no `src/`. Merge the first two and delete `src/`.
- **Top-level `components/`** (9 tracked files) next to `app/components/`. Choose one location.
- **Tracked scratch and stray files**: `scratch/` (10 files), `hi-analysis.json` (2.7 MB), `gitapress_ebook_page.js`, and the root audit files `CURIOSITY_ENGINE_AUDIT_2026-10-20.md` and `VERSE_AUDIT.md` (move them to `docs/`). The untracked `build/`, `wellbeing-dist/`, `reader-modes-build/`, `wellbeing-phase3-build/` and `*.log` at the root should go in `.gitignore`.
- **Lint warnings**: `app/components/FullChapterVerses.tsx:298,569,622,817` and `app/learn/[courseId]/CoursePageClient.tsx:86` (`exhaustive-deps`). The `FullChapterVerses` ones touch scroll-to-verse and chapter-change effects. Check for stale state when going from chapter N to N+1 on the client.
- **Heavy pages**: Gita chapter 2 is a 707 KB HTML page. The global shell loads `framer-motion` (`SiteNav`, `PageTransition`, `SpatialLightCursor`) on every route. The first-load JS budget in `scripts/check-export.mjs:334` is 350 KB gzip, which is generous. Consider CSS-only transitions in the shell.

### 15. Data-check upkeep

- `scripts/check-data.ts`: duplicate counts have dropped below their baselines (chandogya 26 → 10, ramcharitmanas 21 → 0). Lower `KNOWN_CROSS_CHAPTER_DUPLICATES` to the new numbers so the check ratchets.
- 81,048 warnings hide new problems. Split `check-data` output into "known gap (counted)" and "new regression (listed)", so a new empty verse shows up.

### 16. Editorial accuracy in the UI

`app/components/SiteNav.tsx` (soundscape button and drawer item) describes the drone as "432Hz वैदिक तन्पूरा". The tanpura is not Vedic, and the 432 Hz claim has no scriptural basis. For a site whose positioning is source transparency, say "तानपूरा व ॐ ध्वनि" instead. The drawer item "पवित्र ध्वनि" also links to `/practice` instead of toggling the sound.

---

## Suggested order of work

1. Today: finding 1 (remove the variable, rotate the key, add the guard).
2. Before the next content addition: finding 2 (file headroom), finding 3 (decide the domain), finding 11 (deploy branch).
3. Next sprint: finding 5 (`verseHref` helper and lint rule), finding 6 (Sanskrit snippets), finding 7 (backup), finding 8 (chapter noindex), finding 9 (links, plus the crawler in postbuild).
4. Then: finding 4 (decide on the chat agent), finding 10 (cache rules), finding 12 (rate limit), findings 13–16 (cleanup).

Items that need the owner's decision first: **3** (which domain), **4** (keep, proxy or remove the browser AI agent), **8** (whether Sanskrit-only chapters stay indexed).

---

## Part 2 — enhancements (beyond the fixes above)

This builds on `docs/audit-2026-10-22-product-3.0.md`. Its own status note (2026-10-23) says all its P0 items and most P1 items are done. The list below covers only what is still open there, plus gaps this audit found. It is ordered by value per unit of effort.

### E1. Guardrails, so the fixes stay fixed (small effort, high value)

> **Status 2026-10-25: four of the six rows are done** (the crawler, the e2e step, the file warning and the JS ratchet).
> - **E2E before deploy:** `deploy-cloudflare.yml` runs `npm run test:e2e` before the upload.
> - **Link check:** `npm run check:links` (`scripts/check-internal-links.mjs`) runs last in `postbuild` and `postbuild:pages`. It fails on any broken link not in its `KNOWN_BROKEN` list (the 10 from finding 9). Slashless links are reported, not failed: today there are 21,850 links to 1,183 pages, almost all dotted verse ids, plus `/scriptures` and `/scripture/bhagavadgita` on the 404 page.
> - **File-count warning:** `prune-export.mjs` warns above 18,500 files (and adds a GitHub `::warning`).
> - **JS ratchet:** `check-js-budget.mjs` fails when a page grows past its `ceiling` (360/363/347/242 KB measured, plus ~5 KB).
> - **Data ratchet:** `check-data.ts` has `KNOWN_MEANING_GAPS` (18 scriptures, 40,523 Sanskrit-only verses) instead of 81k per-verse warnings, and the duplicate baselines are lowered (chandogya 10, ramcharitmanas 0). The check now ends with 0 warnings; a new gap is an error.
> - **Verse URL rule:** `.eslintrc.json` rejects template literals ending in `/verse/` (except in `lib/verse-paths.ts`). All tracked sites now use `readHref()` / `chapterVerseHref()`, whose chapter fallback now has a trailing slash (`/chapter/3/#verse-12`). Still open: `app/components/reader/ChapterOrientationDrawer.tsx:330,414`, untracked work by another tool, fails the rule until it uses `readHref(scriptureId, chapterId, f.verse)`.

| Enhancement | Why | Where |
|---|---|---|
| Run the e2e smoke and a11y tests in the **deploy** workflow | `ci.yml` runs Playwright only on pull requests. A direct push to `master` deploys through `deploy-cloudflare.yml` with no e2e step. | `.github/workflows/deploy-cloudflare.yml` |
| Internal-link crawler in `postbuild` | Catches findings 5 and 9 automatically (Appendix A) | new `scripts/check-internal-links.mjs` |
| Warn at 18,500 files | Finding 2: the limit is close and nothing warns before it | `scripts/prune-export.mjs` |
| Ratchet the JS budget | Reading pages ship ~360 KB gz against a 150 KB target. Run `check-js-budget.mjs --strict` with the current number as the ceiling, then lower it. | `package.json` postbuild |
| Ratchet `check-data` | 81k warnings hide new regressions (finding 15) | `scripts/check-data.ts` |
| Ban hand-built verse URLs | Finding 5 | ESLint `no-restricted-syntax` |

### E2. Performance

- **Move framer-motion out of the global shell.** `SiteNav`, `PageTransition` and `SpatialLightCursor` pull a 44 KB gz motion chunk into every route. CSS transitions and `@starting-style` cover the fade and the shimmer. This is the largest single saving the 3.0 audit names.
- **Shrink the chapter HTML.** Gita chapter 2 is 707 KB. Hydration is already windowed; next, trim the per-verse markup in the pre-hydration `VerseText`, and do not embed the same data twice (HTML plus RSC payload) on routes that never navigate client-side.
- **Cache rules for `/data/*` and `/search-index/*`** (finding 10).

### E3. Measurement (needed before most other decisions)

The 3.0 audit's success metrics (time to first verse, second-verse rate, 7- and 30-day returns) assume Cloudflare Web Analytics. **The exported HTML has no analytics beacon**, so none of them are measured today. Turn on Web Analytics automatic setup in the Cloudflare dashboard; `_headers` already allows its domain. It is cookie-free, so it fits the zero-account rule. Add a line to `/privacy/` saying so.

### E4. Content coverage (the biggest reader-facing gap)

- About 40.5k verses have Sanskrit only (finding 8). Start with short, much-searched texts: **Yoga Sutra (195)**, **Narada Bhakti Sutra (84)** and **Shandilya Bhakti Sutra**, through the existing `docs/vyakhya-guide.md` workflow and the high-confidence rule.
- Add a public **coverage page** (e.g. under `/sources/`) showing, per scripture, whether it has the original, Hindi, English and व्याख्या. `scripts/content-integrity-report.ts --counts` already has the numbers. This fits the site's source-transparency positioning, and it tells readers what to expect.

### E5. Search quality

- The 3.0 audit lists a MiniSearch index as not started, and search quality across languages was never measured. `scripts/test-search-queries.ts` passes. Extend it into a scored set of about 100 real queries (Devanagari, Hinglish, IAST, "gita 2 47", topic words) with the expected top result, so search changes can be compared before switching engines.

### E6. Accessibility coverage

`tests/a11y.spec.ts` covers 20 routes, all Gita-centred. Add `/panchang/`, `/ashtavakra/`, `/ask/`, a long non-Gita chapter (e.g. a Ramcharitmanas kand), and a `chapter/N/part/P/` page. Check that every Sanskrit block carries `lang="sa"` and every Hindi block `lang="hi"`, so screen readers switch voice. A one-off manual pass with NVDA and TalkBack on a verse page was also never done.

### E7. Reader data

- **One backup format** covering localStorage and IndexedDB (finding 7). Keep the other three formats as import-only.
- Optionally, a reminder every 30 days on `/practice/` to export a backup. Everything is local, so a cleared browser loses it all.

### E8. Platform enablers (larger effort)

- **Move scripture JSON and RSC `.txt` files to R2** (`docs/architecture-scripture-delivery-r2-migration.md`; the canary function exists). This unblocks the 3.0 audit's "demand-driven 20k verse set" and verse pages beyond the current 12 scriptures, both currently impossible under the file limit.
- ~~AI chat through a Pages Function~~: not needed; the browser chat was removed (finding 4).

### Still open from the 3.0 audit (no change in priority)

Multi-language UI (Marathi, Tamil, Bengali…), moderated community source sheets, and the monthly funding ledger. Per-verse audio was dropped by decision on 2026-10-23.

### Suggested sequence

1. **E1 and E3 this week.** They are cheap, and they make every later change measurable and safe.
2. **E2 (motion out of the shell) and E4 (Yoga Sutra / Bhakti Sutras plus the coverage page).**
3. **E5 and E6.**
4. **E8 (R2)**, then larger verse-page coverage.

---

## Appendix A — re-running the checks

The two crawlers used here are small Node scripts (no dependencies). Run them after `npm run build`:

```bash
node scripts/check-all.mjs
npm test
npm run typecheck
```

The link crawler walks every `index.html` except under `_next/`, extracts `href="/…"`, and resolves each against the file tree (file, `dir/index.html`, `name.html`) and the patterns in `_redirects`. It reports unresolved targets and slashless non-file paths. Promoting it to `scripts/check-internal-links.mjs` and adding it to `postbuild` closes findings 5 and 9 for good.

## Appendix B — rules checked and found compliant

- **Rule 1**: `app/error.tsx`, `app/global-error.tsx`, `app/scriptures/error.tsx` and `app/components/ErrorBoundary.tsx` all render `<meta name="robots" content="noindex, nofollow">`, including in the "loading latest" state. `PageTransition` skips the opacity-0 start on first load, so pre-rendered content is visible. The home page above the fold is server components; only below-the-fold extras use `ssr: false`.
- **Rule 2**: the HTML rule is `public, max-age=0, must-revalidate`. `/_next/static/*` and `/fonts/*` are `immutable`. `/search/*` matches the specification. Every asset rule starts with `! Cache-Control`.
- **Rule 3**: see finding 13. The behaviour complies; only the documentation drifts.
- **Rule 6**: `trailingSlash: true`. All 7,826 sitemap URLs and the canonicals checked end in `/`. `_redirects` targets all end in `/`. The exceptions are the hand-built dotted verse links in finding 5.
