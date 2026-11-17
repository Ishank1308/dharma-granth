# Concept visualization: motion performance and accessibility audit (17 November 2026)

## Why this change

The interactive concept mandala in `app/components/visuals/InteractiveVisualLayer.tsx` previously used `setInterval` every **40 ms** and `setRotationAngle(...)` on each tick, scheduling up to **25 React component updates per second**. The interval kept running even when the component showed the knowledge map, flowchart or stages tab. On low-end phones and battery-limited devices, that was unnecessary work.

## New behavior

- The SVG turns at the same approximate speed with a `48s linear` **CSS transform animation**. React is no longer asked to re-render on each frame.
- The built-in rotation button pauses/resumes via `animation-play-state`, preserving the current angle rather than resetting the picture.
- `IntersectionObserver` pauses the animation while the visualizer is offscreen (and the SVG unmounts entirely in other tabs).
- The operating system's `prefers-reduced-motion` preference is observed, including changes while the page is open.
- Existing site `data-low-power`, `data-data-saver`, `data-lite-mode` and `data-reading-lite` settings all disable decorative animation.
- The main image, labels and source links remain visible and interactive without the animation. No added runtime dependency or new image download.
- Three browser tests cover normal rotation/pause/tab switching, reduced-motion behavior and data-saver fallback.

## Design direction

Use motion where it conveys spatial relationships or supports exploration, not inside Sanskrit verse bodies or Hindi व्याख्या. The concept gallery is a natural home for occasional rotation; the primary reader remains static.

The earlier Behance/Dribbble gallery review is in `docs/design/behance-dribbble-library-motion-research-2026-11-17.md`. This is the corresponding **performance/calmness pass** for an already-shipped visual, not a third-party project copy.

## Acceptance

Green lint/TypeScript, built static export, responsive browser tests (including the three new motion tests), and full production SHA check before describing the fix as deployed.

**What we can measure:** Timer-driven React updates have been removed from this component. This alone does not establish a measured improvement in Core Web Vitals; compare production performance traces to make that claim.
