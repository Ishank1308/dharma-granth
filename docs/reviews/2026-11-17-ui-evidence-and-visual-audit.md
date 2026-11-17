# Dharma Granth UI audit — automated evidence and visual-review gates

**Date:** 17 November 2026  
**Scope:** Homepage, scripture landing pages, chapter/verse readers, long chapter indices, chapter illustrations, and shared site chrome. Review `master` and the completed CI for PR #304 ([workflow run 44113723252](https://github.com/Ishank1308/dharma-granth/actions/runs/44113723252)).

## What is verified

- PR #304 CI reported **42 passing browser tests per shard, four shards = 168 passing tests**. Static export, typecheck and lint passed.
- The [sitewide route reflow test](../../tests/sitewide-route-reflow.spec.ts) checked **90 representative pages across 91 route templates**, with no reported HTTP failures. The test records **`/learn/journeys/[id]/` as not currently published**. This is not equivalent to all 91 routes having been visually reviewed.
- Dedicated tests exercise the new Gita/Ramayana illustrated chapter links, local `#still` scene backgrounds, reduced motion, 320px document bounds, and chapter contents search controls.
- Accessibility tests cover two public themes (`sunset` and `night`) on a selected set of pages, plus search, mobile nav and touch-target rules. They fail for **serious/critical** axe findings; moderate/minor findings are logged, not blocking.
- Recent production deployment jobs are successful, but CI success alone does **not** prove the exact live page composition on every device.

## Confirmed source-level defect (corrected in companion PR)

`app/components/ThemeProvider.tsx` previously disabled the circular View Transition only under OS reduced motion, Low Power and Lite Mode, **omitting Data Saver and Reading Lite**. A theme toggle could thus play a 750ms circular reveal while a quiet reading/performance mode was selected. The gate now also checks `data-data-saver` and `data-reading-lite`, with a regression test validating both instant switching and unchanged regular transitions.

## Visual and interaction review still required (not claimed as passed)

| Priority | Surface | Screens and conditions | What to inspect |
| --- | --- | --- | --- |
| P1 | Homepage + global nav | 320/390/768/1280px, Light/Dark | Image crop, hero card contrast, two-theme switcher, title wrap, mobile menu and touch reach |
| P1 | Scripture landing pages | Gita, Ramayana, Durga Saptashati; 320/390/1280px | Scene-to-chapter relevance; illustrations fully rendered (not missing SVGs), horizontal shelf discoverability, long Hindi labels |
| P1 | Chapter and verse reader | Gita 2, a long Purana chapter, Ashtavakra; 320/390px, 200% text | Sanskrit glyph shaping, source label visibility, no text-image collision, stable jump controls, reading-lite layout |
| P1 | Accessibility | Both themes, keyboard-only, reduced-motion, focus indicators | Actual contrast in interactive/hover states and no hidden focus; manually inspect *moderate* axe findings |
| P2 | Heavy indices | Bhagavata/Garuda Purana; 320px | All-chapters initial DOM density, range-filter discoverability, scroll performance (measure on midrange Android) |
| P2 | Site-wide chrome | Library, practice, Panchang, learning paths | Consistent card hierarchy and spacing, moon/chart legend correctness, long localised labels |
| P2 | Production | Latest custom domain and Cloudflare deployment commit | Confirm new artworks and interaction styles are served and cache is fresh; monitor LCP/CLS/INP |

The checks above require **real screenshots or a connected browser with desktop/mobile viewport controls**. No screenshots were available to this audit session; a screenshot-based audit, visual diff and physical-device motion evaluation **have not been performed**. Automated tests and code inspection cannot substitute for that evidence.

## Non-blocking follow-ups

1. Widen the responsive + zoom matrix beyond the single 200%-text library check: include homepage, Purana chapter list, chapter reader and Ashtavakra.
2. Consider reducing initial full-list rendering for very large scripture indices only after measuring DOM size and interaction cost; no performance claim without metrics.
3. Check the 32px `ThemeToggle` radio hit areas manually on 320px devices before enlarging; changing site-chrome sizes without screenshots can cause new header overflow.
4. Extend a11y review to moderate violations and interactive states (scrolling shelves, hover/focus, note dialogs) beyond initial page load.
5. Publish a representative learning-journey detail page **only if source content exists**, then restore the missing route to the 91-template smoke audit.

**Release gate:** Until screenshot verification across both themes is complete, call the UI **functionally regression-tested**, not **fully visually audited**.
