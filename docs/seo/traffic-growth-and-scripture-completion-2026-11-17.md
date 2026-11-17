# Dharma Granth: Scripture completion and organic search growth
**Research date:** 17 November 2026  
**Primary site:** https://dharmagranth.dev/  
**Canonical corpus tracker:** https://github.com/Ishank1308/dharma-granth/issues/229

## Scope and evidence discipline

This is a practical SEO and editorial backlog, not a claim that the entire catalog is complete or that live traffic has been measured today. Search analytics below are **historical** figures copied from `docs/seo/search-baseline-2026-10-20.md`: Google Search Console 151 clicks / 8,240 impressions / 1.8% CTR / 7.6 average position, with Bing 7 clicks / 387 impressions in a shorter reported window. The former domain `dharmagranth.in` migrated to `dharmagranth.dev` on 6 November 2026. Compare new-domain Search Console data and indexed landing pages before interpreting any change as SEO growth.

## Findings from the existing repository

- The site already implements a sectioned sitemap index (`/sitemap.xml`), trailing-slash canonical URLs, robots rules, per-verse noindex for pages without usable meanings, JSON-LD, source/methodology pages, and a post-deploy IndexNow sender. Preserve these and test every release.
- `scripts/seo/audit-export.mjs`, `scripts/check-sitemap.mjs`, and `scripts/seo/indexnow.mjs` provide an executable SEO foundation. Do not reinvent these reports.
- The 20 October baseline indicates **exact verse lookup** queries (Devanagari, Latin transliteration, chapter/verse number and “meaning in Hindi/English”) and searches for distinctive works such as Ravana Samhita or Atharvaveda. Improve the existing ranking URLs before expanding indexable page count.
- Before this change, verse detail JSON-LD generated six synthetic `FAQPage` questions from meaning text even when the corresponding questions and answers were not on the page as a visible FAQ, and its `Article.headline` claimed Hindi **and** English meaning irrespective of language coverage. This PR removes the synthetic FAQ layer and reflects actual meaning availability. Google restricts FAQ rich results largely to authoritative government and health sites, and requires structured data to represent visible content.
- The existing `docs/seo/seo-plan.md` should be treated as prior work, not a to-do list that all needs implementing again.

## Editorial coverage is the growth bottleneck

The issue #229 definition of complete applies independently to **original text**, **verse numbering**, **Hindi meaning**, **English meaning**, **verse-specific explanation**, **source rights/provenance**, **review status** and **actual published visibility**. Raw populated fields or a book title in the catalog do not prove completeness.

1. **Measure the published layer**, not only raw JSON: regenerate the published coverage audit per scripture and reconcile the old totals. Separate fully verified original text, selections, missing meanings, hidden misaligned meanings and staged AI drafts.
2. **Finish source-backed translations, chapter by chapter**, using exact verse keys, edition information, and an omission register. Retain original source material even where an interpretation is controversial; represent historical content faithfully with appropriate context instead of rewriting source meaning to fit modern preferences.
3. **Do not call drafts reviewed** until evidence supports that status. User sign-off is not a workflow dependency; source alignment, accuracy, and content integrity still are. Independently verifiable batches should be releasable without waiting for unrelated unfinished chapters.
4. **Active Mahabharata chain**: #235 → #236 → #237 → #238 → #245. Recheck the cumulative file and gzip reconstruction against master; stacked PR mergeability is not production CI. Audit reported untranslated counts and exact verse IDs, and preserve provenance.
5. **Other immediate work**: #227 Yajurveda staged commentary, Devi Bhagavata, Harivamsha, Rigveda/Atharvaveda, large Puranas, and clearly tagged selections. Do not create indexable thin verse pages as a workaround for source gaps.

## Search growth work: prioritized experiments

| Priority | Change | Validation | Why |
| --- | --- | --- | --- |
| P0 | Review new `.dev` indexing after the 6 November migration, 301s, canonical, Search Console index coverage and sitemap index | Google Search Console URL inspection and Performance; Bing Webmaster Tools; `npm run check:sitemap` | Migration can obscure trends or split discovery |
| P0 | Fix misleading schema and metadata claims on actual verse pages | Google Rich Results Test + exported HTML inspection; compare with visible rendered text | Trust and crawl quality, not guaranteed ranking boost |
| P1 | Choose existing pages with high impressions, position 5–20 and below-site-median CTR; test titles/snippets and first-screen content | 28-day before/after query-page cohort, seasonality, same canonical URL | Most promising measured demand |
| P1 | Improve current pages for karma, samsara, ahimsa and yajna; link explanations to cited original verses and back | Manual editorial audit, internal-link crawl, Search Console query groups | Existing query demand and genuine helpfulness |
| P1 | Make searches work for original Devanagari, proper IAST, common Romanized Hindi spelling and exact chapter.verse references | Existing search-normalizer/typeahead/query tests, real query samples | Better on-site discovery and share/retention |
| P2 | Measure mobile LCP, INP and CLS on home, scripture, chapter, verse and search flows; reduce JS and layout shift based on measured bottlenecks | Search Console CWV, CrUX or PSI and build JS budget; avoid unsupported “faster” claims | Better reading experience on phones |
| P2 | Consolidate chapter ↔ verse ↔ topic internal links; add edition/provenance and clear availability labels near the verse | Inspect HTML anchors, accessible reading paths, sources registry | Helps visitors and crawlers navigate |
| P2 | Share original, attributed verse study cards and topic explainers on relevant communities; offer free embed/lesson references to teachers | Referral landing pages; qualified engaged sessions; no link schemes | Earn natural referrals and recognition |

**Do not:** mass-produce near-identical “meaning in Hindi” landing pages; introduce fake FAQs or reviews; claim modern science proves religious statements; buy backlinks; label incomplete selections “complete”; change canonical Sanskrit to improve keywords; create uncontrolled query-parameter indexation.

## Practical measurement

Record a reproducible baseline each month using the **same property**, date range and filters:

- **Acquisition:** organic clicks, impressions, CTR, branded vs nonbranded search, top queries, top landing URLs, indexable and indexed counts.
- **Reader value:** verse-to-chapter continuation, useful on-site search usage, reading depth and returning readers. Prefer privacy-preserving aggregate analytics; do not send private notes, bookmarks or prayers.
- **Quality:** published and source-checked verse counts by book and language; count of real noindex thin pages, duplicate canonicals, failed internal links, misleading structured data, unresolved exact verse omissions.
- **Performance:** real-user p75 mobile CWV where available: LCP, INP, CLS; per-template JS payload and Cloudflare export file count.

Set targets after collecting comparable post-migration data; the October baseline is not evidence of November gains. Judge experiments against matched Search Console query-page groups, not total rankings or sitemap submissions alone.

## Verified guidance

- Google people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google SEO starter guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google structured data policies: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Google FAQ rich-result change: https://developers.google.com/search/blog/2023/08/howto-faq-changes
- Google JavaScript SEO: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Google Core Web Vitals: https://developers.google.com/search/docs/appearance/core-web-vitals
- Bing IndexNow: https://www.bing.com/webmasters/help/indexnow-0z209wby
- Existing repo baseline and plan: `docs/seo/search-baseline-2026-10-20.md`, `docs/seo/seo-plan.md`.

This file is a dated research note; current performance requires connected Search Console/Web Analytics data and a recent export audit.
