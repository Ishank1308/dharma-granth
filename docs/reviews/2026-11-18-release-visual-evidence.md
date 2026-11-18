# Dharma Granth — 18 November 2026 release visual evidence

## Purpose
Run the pre-existing `tests/ui-visual-evidence.spec.ts` suite against the exact production-equivalent static export in GitHub Actions. This is evidence collection, not a claim that screenshots have already received human review.

## Reproducible screenshot matrix
- Pages: homepage, scripture library, Bhagavad Gita index/chapter/verse, Ramayana index, Durga Saptashati index, a long Bhagavata Purana index, Ashtavakra chapter reader, Panchang and daily practice.
- Both public themes: `sunset` and `night`.
- Desktop-browser viewports: 320, 390, 768 and 1280 pixels.
- Supplemental cases: 200% text on selected critical routes; touch/coarse-pointer contexts at 320 and 390 pixels.
- Evidence: full top-of-page Chromium screenshot and JSON layout metrics per case, plus artwork and verse-area screenshots where relevant.
- Gates: no horizontal overflow, clipped H1, wrong settled theme, transition-in-flight capture, or broken main-content image.

## How to collect
The PR title includes `[visual audit]`, which enables `CAPTURE_UI_VISUAL_AUDIT=true` in the four Playwright CI shards. CI uploads `ui-visual-audit-shard-1` through `-4` artifacts with seven-day retention.

## Sign-off boundaries
A green Playwright run establishes the *automated assertions above*. Pixel-level editorial checks for composition, Hindi glyph legibility, dark-mode contrast, image relevance, and physical-device motion still require inspection of the actual screenshots / devices; do not call these manually verified without doing that work.

The Cloudflare production upload check is separate from the public custom-domain WAF/access issue tracked in #323. Sanskrit source accuracy and unpublished Yajurveda drafts are separately gated in #229 and the 990-key review-hold registry.

## Release actions
1. Capture and retain the screenshots and JSON measurements from all shards.
2. Verify all CI shards pass and report failures rather than bypassing them.
3. After successful checks, merge this evidence-only document without changing public UI styles or scripture data.
