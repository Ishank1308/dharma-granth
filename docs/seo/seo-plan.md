# Dharma Granth SEO plan

Date: 2026-10-20. Branch: `feat/integrate-phase7`. Status: phase 0, the owner actions and the phase 2 technical fixes are done; nothing in code is deployed yet.

Principle from the brief: earn relevant traffic by being the clearest, most trustworthy and most accessible scripture
resource. No thin or doorway pages, no keyword stuffing, no fabricated reviewers or dates.

## 1. What the audit found (static export, 7,643 pages)

Measured by `node scripts/seo/audit-export.mjs` against `dist/` after `npm run build`, plus live checks of the edge.

| Area | Finding | Status |
|---|---|---|
| Crawl control | robots.txt allows all, blocks /dashboard/ and /bookmarks/, points at a sitemap index (4 sitemaps, about 7,600 URLs) | Sound |
| Edge | http to https 301; missing trailing slash 308 to the slashed URL (no loop); /guidance/* and /wisdom/ 301 to /wisdom-for-life/*; HTML `max-age=0, must-revalidate`; real 404s with `no-store` | Sound |
| Host | `https://www.dharmagranth.in/` serves 200 instead of redirecting; every page there declares the bare domain as canonical | Fixed 2026-10-20: Cloudflare redirect rule, 301 to the bare domain, path and query kept |
| Canonicals | Present and self-referencing with trailing slashes on all indexable pages except /journal/ and /network/ | Fixed |
| Structured data | JSON-LD on 7,642 of 7,643 pages | Sound; validate types in Rich Results Test |
| hreflang | None. Pages are bilingual on one URL, so none is needed | Correct as is |
| Headings | 14 concept pages had no H1 | Fixed |
| Sitemaps | /network/ and /concepts/visuals/ missing | Fixed |
| Private tools | /journal/ (browser-only diary) was indexable | Now noindex |
| Thin verse pages | 299 of 2,548 verse pages have no meaning or explanation; titles still promised "Meaning in Hindi & English" | Fixed: honest titles, noindex, out of the sitemap until content exists |
| Titles | 7,465 titles run past 70 characters, but every template front-loads the reference; what is cut is mostly "— Dharma Granth" | **Leave until Search Console shows a CTR problem; then test** |
| Duplicates | /guidance/* duplicates /wisdom-for-life/*; `yogavasistha` duplicates `yogavasishtha` | Fixed: no longer exported. The old /topics/* (also 301s) went too, and internal links, search and the sitemap now point at /wisdom-for-life/ directly |
| File count | 18,976 files against Cloudflare Pages' 20,000 | Improved: alias pages and 386 stale verse share images removed; og:verses now prunes images of verse pages that no longer exist |
| Measurement | No Search Console, no Bing Webmaster Tools, no analytics sink (lib/analytics.ts has the events but no transport), no IndexNow key | Search Console and Bing verified, sitemaps submitted, Cloudflare Web Analytics on, IndexNow runs after each deploy. Event-level funnel data still needs a decision |

## 2. Owner actions (need your accounts)

1. **Google Search Console**: add `dharmagranth.in` as a Domain property (DNS TXT in Cloudflare), submit `https://dharmagranth.in/sitemap.xml`.
2. **Bing Webmaster Tools**: import from Search Console, or verify with DNS. Bing also feeds several AI assistants' search.
3. **www redirect**: Cloudflare, Rules, Redirect Rules: `www.dharmagranth.in/*` to `https://dharmagranth.in/${1}`, 301, keep the query string.
4. **Analytics choice**: Cloudflare Web Analytics is cookieless and needs no consent banner; it gives page views, referrers and countries, which covers search landing pages. Event-level measurement (verse opened, continue reading) would need a sink for the existing `lib/analytics.ts` events; that is a privacy decision for you.
5. **IndexNow**: approve generating a key file and a post-deploy ping of changed URLs to Bing/Yandex (one HTTPS POST per deploy).

## 3. Roadmap

### Phase 1: measure (after the owner actions)
- Two weeks of Search Console data before any title or content change.
- A query-to-page map from real queries: which page each query lands on, CTR by page type, and queries with impressions but no good landing page.

### Phase 2: technical (low risk, can start now)
- Done: stopped exporting /guidance/*, /wisdom/, /topics/* and the `yogavasistha` alias (the edge redirects them).
- Done: IndexNow on deploy.
- Validate JSON-LD per page type and keep it consistent with what is visible (no FAQ markup for questions the page does not answer).
- `llms.txt`: a short, factual description of the library, its sources and how to cite a verse.

### Phase 3: search intent (driven by data, not page count)
- Multiscript discovery: verse pages already carry the Devanagari opening and the IAST; check that search finds verses by IAST, Romanised Hindi ("karmanye vadhikaraste") and Devanagari, and that chapter titles use the names people search ("Gita chapter 2 in Hindi").
- Improve existing pages that rank on page 2 for real queries before creating anything new.
- Fill meaning gaps where noindexed verse pages have demand (Ramcharitmanas once the Hindi license is settled; Brihadaranyaka Hindi, which was withdrawn as misaligned OCR. Brihadaranyaka Adhyaya 1 English is now filled from Müller).

### Phase 4: retention
- Measure passage-to-chapter continuation and return visits (needs the analytics decision).
- Next verse, chapter and related-passage links already exist; check their use before adding more.

### Phase 5: authority, ethically
- Clear source and methodology pages (they exist); cite editions per text.
- Outreach to teachers, study groups and Sanskrit departments with genuinely useful resources; no paid links.

## 4. Guardrails
- No page is added only because it can be generated. A new page needs a query it answers better than an existing page.
- Every editorial or AI-drafted layer keeps its visible review status; nothing is labelled scholar-reviewed without a named review.
- Canonical text is never changed for SEO.
