# Behance and Dribbble design research — Dharma Granth visual discovery
**Research:** 17 November 2026. **Scope:** homepage, scripture library, introductory chapter discovery. This document records inspiration and independent UX recommendations, **not** permission to reuse artists' screenshots, photography, brand marks or unlicensed artwork.

## Read before adding another animation
The production homepage already mounts `HomeHero`, `HeroHalo`, `HomeDynamicBackground`, `HomeScriptureTabs`, `TodayVerseCard` and more. `app/motion.css` already implements scroll reveals, animated rings and subtle 3D tilt; `MotionLayer.tsx` handles pointer tilt. `Experience3DSection.tsx` and `Realistic3DGranth.tsx` exist as optional components, but are **not currently mounted on the main homepage**; do not mistake installed code for a shipped homepage feature.

There is more motion infrastructure than photographic/editorial hierarchy. New high-cost visual systems would duplicate the halo, fluid background or cursor tracking. Protect verse reading; do not scroll-lock, autoplay video or animate body text on chapter pages.

## Inspiration reviewed (pattern, not a layout to copy)

| Source | Usable idea | Dharma Granth decision |
| --- | --- | --- |
| [Behance — Museum Archive: Art & History Exploration Website UI](https://www.behance.net/gallery/150209125/Museum-Archive-Art-History-Exploration-Website-UI) | Large visual artifacts surrounded by restrained editorial typography | Locally held, category-specific atmospheric art at the top of each library tile; original Sanskrit remains plain text |
| [Behance — Il Saggiatore website](https://www.behance.net/gallery/149768503/Il-Saggiatore-website) | Covers as the visual rhythm of an otherwise minimal discovery grid | Give each collection a distinct visual crop, generous spacing, intact readable titles |
| [Behance — Hungry Minds](https://www.behance.net/gallery/246564833/Hungry-Minds) | 3D story world and layered scroll narrative | Reserve heavier 3D for an explicitly entered, optional visual experience; not a requirement to discover or read a verse |
| [Behance — The Fossil Archive](https://www.behance.net/gallery/247382079/The-Fossil-Archive-Digital-Museum-Experience) | Restrained darkness, soft shadows, single focal artifact | Prefer a single atmospheric subject to multiple decorative effects competing with the text |
| [Dribbble — Museum Website Chapter Navigation (tubik)](https://dribbble.com/shots/27749078-Museum-Website-Chapter-Navigation) | Short editorial chapters, anchored labels, timeline that works as a shortcut | Consider a direct-jump chapter strip / progress breadcrumb rather than a forced camera fly-through |
| [Dribbble — Museum Website Design: Atelier Meridian](https://dribbble.com/shots/27306724-Museum-Website-Design-Atelier-Meridian) | One dramatic 3D entrance but clear typography and photographic hierarchy | Keep any 3D opt-in, lazy-loaded, and secondary to immediate search and text |
| [Dribbble — InkScribe Library](https://dribbble.com/shots/24149525-InkScribe-Library-Ink-and-Pixels-Book-Website-Design) | Distinctive covers and scan-friendly grouped book tiles | Add visual identity to tabbed library tiles without turning every scripture into a commercial product card |

## Implemented in this branch

- Add small, already compressed locally hosted category art from `public/verse-bg/{veda,upanishad,smriti,itihasa,purana,other}.webp` to `HomeScriptureTabs`. These images are **illustrations**, not original manuscript scans or visual historical evidence.
- Keep a reserved image aspect/height and semantic title, verse excerpt and one direct read action. Images have empty alt because the text already supplies the information; decorative artwork is omitted from screen reader output.
- Use native Next.js `Image`, deferred loading and `sizes`, plus fixed-height crop to minimize layout shifts.
- Apply a **subtle 650 ms transform-only** image zoom/vertical shift on fine-pointer hover or keyboard focus. Never animate the Sanskrit or meaning.
- Disable image movement under reduced-motion, data saver, low power and Reading Lite. No parallax scroll listeners and no new 3D or animation dependency.

## Further research-backed experiments (NOT yet implemented)

1. **One focal artifact on the homepage.** Consider a rights-cleared Indian manuscript photograph in a viewer that links to the actual source catalogue. Only if licences, attribution, mobile crop, and LCP measurements pass.
2. **Chapter navigator.** Add the static chapter number rail and illustrated scene label inside an expandable discovery index, with a conventional, keyboard-friendly list fallback. Avoid animated camera flight on text reading routes.
3. **Optional 3D inspection.** Reuse `Realistic3DGranth` in an opt-in dedicated entry point, lazily import and provide a static fallback. Do not mount on all scripture pages.
4. **Page transition discipline.** Motion should reinforce navigation feedback (150–300 ms), not delay the next verse. Never add decorative motion to each word of a 200–280 word व्याख्या.
5. **Photo governance.** All new museum/archive images require verified licence, creator and source-credit metadata; prefer official institution/Commons records. Do not copy Behance/Dribbble project imagery or unverified depictions of historical scriptures.

## Rights-clear candidates for a **later** imagery release (not imported in this PR)
- **Valmiki Ramayana illustration:** [The Met — Rama, Sita, and Lakshmana at the Hermitage of Bharadvaja](https://www.metmuseum.org/art/collection/search/37955?showOnly=openAccess). The Met labels it Open Access; verify asset-level licence and preserve descriptive provenance before adding it.
- **Bhagavad Gita historic codex:** [Wikimedia Commons — Bhagavad Gita, a 19th century manuscript](https://commons.wikimedia.org/wiki/File:Bhagavad_Gita%2C_a_19th_century_manuscript.jpg). Commons lists public-domain status; review its exact file page/creator/date and image description before reproduction.
- **Palm-leaf manuscript:** [Wikimedia Commons — Bhagavad Gita Grantha script Sanskrit](https://commons.wikimedia.org/wiki/File:Bhagavad_Gita_Grantha_script_Sanskrit.jpg). Visually relevant to a manuscript viewer, but its source-language/script and date must be labelled correctly.
- **Optional 3D artefacts:** [Smithsonian Open Access / 3D](https://3d.si.edu/collections/openaccesshighlights) permits remix for assets specifically marked CC0. Do not attribute an unrelated museum object to a Hindu scripture.
- **Rights caution:** [National Museum, New Delhi image requests](https://nationalmuseumindia.gov.in/en/request-for-photography) describes one-time image-use permission and a formal request process. Do **not** assume that images displayed on its website may be copied onto Dharma Granth.
- **Textual distinction:** A photograph illustrating a scripture's tradition is not necessarily a photographed leaf of that specific edition or chapter. Record `illustrative` vs `source-facsimile` in future media metadata.

## Acceptance checklist
- Confirm responsive 360px, 768px, desktop: no clipping, legible Devanagari, CTA minimum 44px.
- Confirm keyboard tab categories, tab panel semantics, focus visibility, and the new artwork never steals focus.
- Confirm `prefers-reduced-motion: reduce` and site data-saver/low-power/Reading Lite disable decorative movement.
- Confirm production source page still renders meaningful HTML without JavaScript and images are not needed for labels.
- Confirm full CI, browser checks, static export and deployed production SHA.
- Monitor Core Web Vitals before/after: page LCP, CLS and interaction responsiveness. No unsupported performance claims.

## Accessibility reference
[W3C WCAG 2.3.3 — Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions) and [web.dev — Accessibility: motion](https://web.dev/learn/accessibility/motion).
