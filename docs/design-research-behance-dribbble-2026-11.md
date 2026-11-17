# Dharma Granth — design research translation (17 November 2026)

This is **visual reference research**, not evidence of user testing or measured conversion improvements. We adapt patterns rather than copy artwork, branding, commercial upsells or mockup imagery. Dharma Granth keeps only **Sandhya Light** and **Ratri Dark**; the original Sanskrit and provenance are never decor.

## Reviewed references

| Source and example | What is useful | Dharma Granth application |
| --- | --- | --- |
| [Booki — Mobile Reading App, Behance, Jan 2026](https://www.behance.net/gallery/242274183/Booki-Mobile-Reading-App-UIUX-Case-Study) | Quiet interface, book-led hierarchy, design-system discipline | Give verses and explanations greater visual priority; reduce decorative card density |
| [REDORA — E-Library UX, Behance, Jan 2026](https://www.behance.net/gallery/241487063/REDORA-E-Library-Mobile-App-UXUI-Case-Study) | Reader mode, contextual explanations, reading comfort | Maintain Sanskrit-first study tree, meaning/word analysis, accessible anchors |
| [Valto Digital Library, Behance, Mar 2026](https://www.behance.net/gallery/245314581/Digital-Library-App-Valto-UIUX-Design-Case-Study) | Streamlined library navigation and read/listen choices | Saved collections should be navigable without bulky stacked rows |
| [BacaanKu E-Reader, Dribbble](https://dribbble.com/shots/27110216-BacaanKu-Digital-Library-E-Reader-App-Design) | Small, unobtrusive reading controls; adjustable text sizes; progress | Manual Sanskrit size remains primary and works alongside fluid base sizes |
| [Read.io Mobile Reading, Dribbble](https://dribbble.com/shots/23085823-Read-io-Mobile-Reading-App) | Content-first book detail, direct start-reading action | Guide the eye to a primary reading action rather than competing CTAs |
| [Lunara Story Reading, Dribbble](https://dribbble.com/shots/27338235-Lunara-Story-Reading-App-UI-Design) | Editorial title scale, warm restrained highlights, breathing room | Softer Saved Library header, fluid heading and generous spacing |
| [Masaar E-Learning, Behance, Mar 2026](https://www.behance.net/gallery/244711385/E-Learning-App-UI-UX-Case-Study) | Modular learning paths and visible progress | Show lesson completion early in Course hero, then offer clear sections |
| [YARSY EdTech, Behance, Jan 2026](https://www.behance.net/gallery/243151469/YARSY-UXUI-Design-for-Scalable-EdTech-Product) | Scalable navigation, progress and systemized dashboard UI | Consistent tabs and page hierarchy across learning and practice |
| [Cultural collections: British Museum redesign, Behance, Dec 2025](https://www.behance.net/gallery/240044795/Corporate-Website-The-British-Museum) | Editorial collection story, responsible visual hierarchy across screens | Scripture discovery that respects actual tradition, sources and text |

## Decisions applied in PR

### Course learning screen (Masaar × Booki)
- Devanagari introduction and English title scale fluidly; mobile content uses 16px inner gutters
- A contained 1.5px progress track, text label and numeric completion state appear before long content
- Progress bar is decorative within an accessible progressbar; no artificial streak urgency
- Dark cinematic chapter cover uses restrained saffron atmosphere, not new site themes
- Keyboard navigation in Course Sections: Arrow keys, Home/End, roving focus, 44px hit areas
- Course tabs stay below the 52px site header

### Saved Verse / Sanctuary (Lunara × Valto)
- Quiet editorial hero, subtle saffron light and comfortably wrapped title
- Single-row, horizontally scrollable pills; tabs remain keyboard-operable and labelled
- Original saved verses, highlights, private notes and privacy statements unchanged

## What **not** to transfer
- Unverified popularity numbers, rankings, star ratings or social features
- Over-animated gradients, infinite parallax, large autoplay backgrounds or inaccessible text contrast
- Western book-cover treatments that make the original Sanskrit secondary
- Extra theme palettes; use the existing Sandhya Light and Ratri Dark tokens
- AI summarization that pretends to be a verified scripture translation

## Next phase after the 91-template audit
- The main scripture page, chapter cards and Ashtavakra already have separate accessibility/typography PRs; do not duplicate them
- Unify library/card discovery hierarchy, source transparency, quiet manuscript surfaces and learning progress across remaining page families
- Validate at 320, 390, 768 and desktop CSS px, 200% text resize, keyboard-only, two themes, reduced motion and no-JS mode
- Review illustrations and hero effects for rendering performance on midrange Android phones

## Follow-up: contextual artwork and motion safety (17 November 2026)

Additional references reviewed:

- [Ramayana Khand reading app, Dribbble](https://dribbble.com/shots/26284514-Ramayana-Khand-reading-app): chapter-level illustration communicates setting without replacing the original text.
- [ISKCON spiritual web concept, Dribbble](https://dribbble.com/shots/25878617-Iskcon-website-UI-Modern-Spiritual-and-UX-centered-website): strong editorial type beside devotional atmosphere; do not transfer its commercial CTAs or portrait artwork.
- [Vedapath app redesign, Behance](https://www.behance.net/gallery/240928851/Vedapath-App-Redesign): a distinct, approachable visual system is compatible with a restrained reader experience.
- [Museum Archive, Behance](https://www.behance.net/gallery/150209125/Museum-Archive-Art-History-Exploration-Website-UI): collection-specific imagery and an exhibition rhythm; not a license to use the project's actual designs.
- [Google Chrome guidance on scroll motion](https://developer.chrome.com/docs/modern-web-guidance/guides/ui-behaviors/scroll-entry-exit-effects): respect reduced motion and avoid costly layout changes.

### Existing asset audit (master, 17 November)

- The site already includes 22 full-colour scene SVGs under `app/styles/paintings/`, 38 reusable scene layers under `app/styles/scenes/`, and local compressed category art under `public/verse-bg/` (9 WebP assets).
- `HomeScriptureTabs.tsx` already uses those category illustrations with `next/image`. The hero already had CSS-based 3D rings and pointer tilt. Introducing another scrolling engine, Three.js or autoplay video would duplicate work and add cost to a text-first site.
- Both reading themes and the original Sanskrit-first content hierarchy remain unchanged.

### Small implementation in this branch

1. The featured Bhagavad Gita 2.47 card gets the existing `/verse-bg/itihasa.webp` as a faint, masked **decorative** texture. It is category-context art only, **not** claimed as a historically exact depiction of that verse; Sanskrit and action remain foregrounded. No external asset or new bundle dependency.
2. The ambient hero halo pulse is no longer an unconditional inline animation. CSS gates it on `prefers-reduced-motion: no-preference` and disables it in all quiet settings.
3. The pointer-driven background checks quiet settings and tab visibility during active animation, not just at initial mount; switching to Lite/low-power mode can stop an existing animation frame loop.

### Further recommendations, not implemented here

| Page area | Visual opportunity | Priority and constraints |
| --- | --- | --- |
| Scripture landing pages | Curated episode art from the existing SVG scene library, with alt text only when image conveys new information | High, after scripture-to-scene editorial mapping is checked |
| Chapter discovery | One meaningful vignette per actual chapter/episode (avoid arbitrary or identical thumbnails) | High, with attribution or explicitly labelled artistic interpretation |
| Reader cards | Still manuscript grain or very faint motifs; keep text contrast and the complete verse visible | High, **no** continuous motion beneath Sanskrit |
| Panchang | Responsive moon-phase and season diagrams driven by existing calculated data | Medium, educational visuals must not imply false astronomical precision |
| Collection transitions | Optional small opacity/transform transition on interactive navigation | Medium, under 200–300ms and disabled in reduced motion |
| 3D and parallax | Keep existing small card depth on hover-capable devices; no full-screen WebGL or continuous camera movement | Defer; prove value before adding performance/accessibility cost |

**Validation gate:** 320/390/768/1280px, light and dark themes, 200% text zoom, reduced-motion, Lite and data-saver modes, keyboard and touch, no-JS HTML, and deployed Lighthouse/Core Web Vitals. The source inspection and code changes here do **not** claim those browser checks have passed yet. No performance improvements are claimed without measurement.
