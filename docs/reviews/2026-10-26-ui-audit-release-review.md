# UI audit integration review — 2026-10-26

## Scope and isolation

Reviewed the frozen `fix/ui-audit-fixes` snapshot `3ffa3ae7d0c95907985abf6258c13d5a418f1fd6` (17 commits over `1babe66d`) in a fresh worktree based on the verified live `e122350a` release. The integration merges the real histories, preserving the released Rigveda citation bounds. The source checkout and unrelated primary-checkout changes were not edited or copied into this integration.

The batch changes search readiness/results, mobile controls and spacing, verse-reader navigation and named themes, bilingual labels, local font loading, homepage SVG geometry, and mobile content order. Canonical scripture files, canonical manifest, commentary, verse-path helpers, and `lib/search-citation.ts` have no changes against `e122350a`. The Gita 2.47 editorial card changes only number glyphs to ASCII digits.

## Local validation

- Git LFS hydration, `npm ci`, and `npm run shard:scriptures` completed before the first build (4,218 shards). Only ignored, stamped verse-image cache assets were reused from the previously validated owned checkout; the build verified all 2,548 images without stale text.
- Lint and typecheck passed. The three existing hook dependency warnings remain.
- Search-query and search-normalizer checks passed, including exhaustive published Rigveda references and invalid hymn boundaries. Added regression coverage for `2.47` not becoming chapter 247, the genuine `247` chapter query, readable scripture names, and slash-terminated chapter links.
- All eight `npm test` suites passed after sharding, including backup/storage, study plans, journeys, daily verse, and OCR review gates. Sitemap checks passed.
- Full production build passed canonical/content/pilot/commentary checks, compilation, export, site rules and sitemap generation. Export validation covered 4,212 chapter files, 36 split chapters and 2,548 verse pages. Final pruned export contains 19,336 files. All 11 export smoke URLs passed.
- Existing non-strict JavaScript budget advisories remain exceeded for chapter, verse, home and topic pages. No budget was relaxed. Removing the homepage WebGL layer does not establish a measured Core Web Vitals improvement.

Build log: `%TEMP%\dharma-ui-audit-release-build.log`.

## Browser checks on the local production export

Served the finished export using `scripts/serve-dist.mjs` on a separate local origin, `http://localhost:4177`. Checked desktop at 1280 x 900 and mobile at 390 x 844; reset the viewport and closed the temporary tab afterwards. Only the owned preview server was stopped.

- Search reached its ready state. `karmanye` returned Gita 2.47 with its complete verse preview and visible unreviewed status. `2.47` returned the intended Gita result without the false chapter 247 match; other broadly matching chapter results remain.
- `rv 1.1.999` and unavailable `rv 8.67.1` returned no results and no invalid exact-reference link. `rv 1.164.46` reached mandala 1 part 6 and displayed both full accented Sanskrit lines.
- The mobile verse Menu exposes six site destinations, search, and five named theme choices. Usha selection, the reader settings dialog, Escape closure and restored menu-trigger focus worked. The site theme menu selected Sandhya, Bhojpatra, Ratri and Auto; Auto's checked state and Escape focus restoration were verified.
- Reader line-spacing preference survived reload, with the other selected preferences retained. The temporary spacing and theme changes were restored through the UI. The verse back link returned to chapter 2.
- Chapter inline study opened and closed at the unchanged chapter URL, with focus restored to its study trigger. The mobile chapter exposes one reader dock and hides the global quick-navigation dock. The long Rigveda chapter's parts chooser opened with all seven parts.
- Desktop verse reading showed one visible chapter progress indicator. The complete Gita 2.47 text and editorial distinction were visible. Library bilingual accessible names and wider cards rendered; home used SVG geometry without a canvas. Mobile Panchang displayed its explanatory content before the decorative wheel, and Practice rendered its tools.
- Enabling the meditation tool survived a Practice-page reload, then the temporary choice was restored. No notes, reflections, backups, PINs or personal entries were created or reset.
- No horizontal overflow was observed on the checked mobile home, chapter, verse, Panchang and Practice views. No captured browser console errors were found.

## Limits and preserved editorial boundaries

These are bounded functional and visual checks, not an axe audit, laboratory accessibility certification, measured CWV audit, or independent Panchang astronomy review. Source-dataset completeness and scholarly approval are not inferred from UI checks. Rigveda/Atharvaveda missing-hymn disclosures and withheld-translation boundaries remain part of the earlier verified release. Yoga Sutra summaries remain editorial drafts. The separate guided-reading Gita 18.47/18.48 opener mismatch is not changed by this batch.

Publication still requires a fresh remote-branch check, the current-master Cloudflare workflow's actual deployment, smoke and deployed RSC parity success, followed by checks on both public domains. The deployment marker branch must advance only after those checks pass.
