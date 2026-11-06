# Independent release assistance for Claude — 2026-10-27

Requested by the owner: "check what claude is doing and help them".

## Ownership and candidate

Claude's active session is "Improve dharma-granth UI, content and deploys", with its session worktree at `.claude/worktrees/gallant-meninsky-4d2699` and release checkout at `C:/Users/ishan/Music/dharma/dharma-granth-ship`.

Reviewed candidate: `ccde1930dc152281f0e417ed59763b07febdb460` (detached HEAD at inspection). Claude owns integration, push and deployment. Codex has not modified its release source, generated data, build output or Git index.

The candidate merges misplaced-meaning suppression, the Agni printed-footnote fix, Shiva Purana refill data, catalogue/filler fixes and bounded exact-byte RSC parity retries. The refill remains withheld pending the owner's review decision; this review does not approve its publication.

## Additional verification completed by Codex

- `cmd /c npm run test:smoke`: PASS, all 11 routes return HTTP 200 with no error-boundary markers.
- `PORT=4196`, then `cmd /c npx playwright test tests/smoke.spec.ts --workers=2 --reporter=line --output=C:/Users/ishan/AppData/Local/Temp/dharma-codex-help-20261027`: PASS, all 21 tests in 1.0 minute. Includes console/CSP errors, chapter hydration, deep-link navigation, part redirects, verse schema/share image, mobile graph/island behavior, offline service-worker behavior and backup restore.
- `cmd /c node scripts/check-js-budget.mjs`: exits 0 but reports every sampled page over its target: chapter 371 KiB / 150, verse 370 / 150, home 245 / 200, topic 254 / 180 (gzip).
- Claude's build log confirms compilation and all 7,560 pages generated. Its export check passed: 27 key routes, 4,149/4,212 chapter pages with their text, 18 split chapters, 2,548 verse pages. Site-rule check passed across 7,550 pages.
- Final build log now confirms `BUILD_EXIT=0`. Sitemap check passed: 7,270 URLs on `https://dharmagranth.dev` (199 pages, 68 scripture entries, 4,342 chapter entries, 2,661 verse entries). Pruned export: 2,529 MB in 18,465 files, leaving 1,535 files under Cloudflare's 20,000-file limit. Build success does not resolve the UI omissions or prove deployment.

## Findings to resolve or explicitly account for before claiming the requested UI is live

### 1. Candidate does not include the owner's approved decluttering

Evidence in the release checkout:

- `app/components/reader/ReaderLayers.tsx:386-395` still renders `insight.marma` as "The Core Shift". The string is also present in `dist/scripture/bhagavadgita/chapter/2/verse/47/index.html`.
- `ReaderLayers.tsx:19,332` still imports and renders `ExplainLine`.
- `app/layout.tsx:261,264,270` still mounts `PranaCapsule`, `MananaSelectionBar` and `PwaInstallBanner`.
- The dedicated verse reader has not received this chat's shared three-pillar regrouping.

These are features the owner explicitly asked to remove on 2026-10-25. The approved edits exist in the dirty primary checkout. Do not copy that checkout wholesale: it also contains unrelated editorial changes and deletions. Port a bounded UI patch on top of the candidate, or clearly distinguish a content-only release from completion of the requested UI work.

### 2. Direct-push deployment still bypasses browser tests

`.github/workflows/deploy-cloudflare.yml` runs no `test:e2e`/Playwright step before upload when it builds a fallback export. The reusable artifact path checks successful `ci.yml` runs; the fallback path does not receive that browser gate. Also, the workflow still triggers on `fix/audit-cloudflare-search` as well as `master` while its deploy command always uses `--branch=master`.

Suggested fix: limit production push triggers to `master`; run Chromium installation and the browser suite after the export is built/unpacked and before upload for the fallback path. Preserve the existing successful-CI artifact verification.

### 3. Earlier audit guardrails are absent from the candidate

- `scripts/check-js-budget.mjs` is the report-only version; the primary checkout contains the ratchet, but it has not been integrated here. All four pages above their targets still exit 0.
- `package.json` postbuild does not include `check:links`; `scripts/check-internal-links.mjs` is absent in the candidate.

Do not claim those earlier E1 changes are deployed. Integrate them with measured baselines and fix new failures instead of raising ceilings silently.

## Release follow-through

After the final local build and file-limit checks finish, Claude should keep ownership of any authorized push. Verify the Cloudflare workflow, public affected pages and exact bytes of the Gita 2 Flight payload against that same build. The bounded retry preserves the byte-equality check; it must still fail if the mismatch persists.

The UI was in active use during attempted coordination; Windows automation reported user-input/focus conflicts. This note is the durable handoff; it does not claim Claude has read or accepted it.
