# Design system

Dharma Granth's visual language, in Apple's idiom: content first, one tint, quiet surfaces,
type that does the work, and motion that explains rather than decorates. Every page builds
from the same tokens, so it reads the same in all four themes (Usha, Sandhyā, Bhojpatra, Rātri).

## Files

| File | What it holds |
| --- | --- |
| `app/styles/tokens.css` | All tokens: type, spacing, radii, surfaces and materials, elevation, motion. Loaded first. |
| `app/globals.css` | Fonts, the four theme palettes (`--dharma-*`), base styles and older component rules. |
| `app/styles/components.css` | Shared components built only from tokens (`.apple-*`, `.material-*`). |
| `app/motion.css` | The motion system: reveals, cascades, hero, tilt, sheen, ticker, theme transition. |
| `tailwind.config.ts` | Tailwind names for the same tokens. |
| `app/components/apple/PageHeader.tsx` | `PageHeader`, `SectionTitle` and `Eyebrow`. |

Theme colours stay in `globals.css`. Everything in `tokens.css` is mixed from them, so a new
token never needs four copies.

## Type

Roles follow Apple's text styles. Sizes above body are fluid between a 375px phone and a
1200px desktop, and tracking tightens as size grows.

| Tailwind | Token | Size | Use |
| --- | --- | --- | --- |
| `text-display` | `--text-display` | 44 → 80 | The home hero only |
| `text-large-title` | `--text-large-title` | 34 → 48 | A page's `h1` (`PageHeader`) |
| `text-title-1` | `--text-title-1` | 26 → 40 | Main sections of a page |
| `text-title-2` | `--text-title-2` | 22 → 28 | Sections (`SectionTitle` default) |
| `text-title-3` | `--text-title-3` | 19 → 21 | Card titles, the Hindi line of a heading |
| `text-body` | `--text-body` | 17 | Running text, buttons, links |
| `text-callout` | `--text-callout` | 16 | Secondary paragraphs |
| `text-subhead` | `--text-subhead` | 15 | Sub lines, list detail |
| `text-footnote` | `--text-footnote` | 13 | Eyebrows, metadata |
| `text-caption` | `--text-caption` | 12 | Badges, fine print |

Rules:

- **Devanagari is never letter-spaced.** `tokens.css` resets tracking on every `lang="hi"`,
  `lang="sa"`, `.font-devanagari` and `.font-sanskrit` element, so a Hindi span inside a tightly
  tracked English heading no longer inherits it. Don't add `tracking-*` to Devanagari.
- English and Hindi are separate elements with a space between them:
  `<span>Library</span> <span lang="hi">ग्रन्थालय</span>`.
- Shlokas use `.shloka-text` (Tiro Devanagari Sanskrit, weight 400, no synthesis). Never
  shorten a verse to fit a layout.

## Spacing and layout

A 4-point grid (`--space-1` = 4px up to `--space-24` = 96px; Tailwind's own scale matches it).
Page rhythm:

| Tailwind | Token | Value |
| --- | --- | --- |
| `px-gutter` | `--space-gutter` | 20 → 24px side gutter |
| `py-section`, `pt-section` | `--space-section` | 56 → 96px between sections |
| `max-w-content` | `--width-content` | 980px, the content column |
| `max-w-reading` | `--width-reading` | 760px, the reading column |
| `max-w-text` | `--width-text` | 680px, a paragraph's measure |
| `min-h-tap` | `--tap-target` | 44px, the smallest touch target |

## Corner radii

Named by what they round. Keep nested shapes concentric: an inner radius is the outer radius
minus the padding between them.

| Tailwind | Value | Use |
| --- | --- | --- |
| `rounded-chip` | 6px | Tags, badges |
| `rounded-control` | 8px | Segments, icon tiles |
| `rounded-track` | 10px | The segmented control's track |
| `rounded-field` | 12px | Text fields, search |
| `rounded-group` | 14px | Grouped lists |
| `rounded-card` | 22px | Cards |
| `rounded-panel` | 28px | Hero cards, large panels, sheets |
| `rounded-pill` | full | Buttons, capsules |

## Surfaces, materials and elevation

| Token | Meaning |
| --- | --- |
| `--label-primary` … `--label-quaternary` | Text, from strongest to faintest |
| `--surface-canvas` / `-raised` / `-elevated` / `-sunken` | Page, card, popover, inset well |
| `--fill-primary` … `--fill-quaternary` | Translucent ink for controls, hovers and wells |
| `--separator`, `--separator-strong` | Hairlines; the stronger one for outlines |
| `--tint`, `--on-tint`, `--tint-fill` | The one accent (saffron), text on it, a faint wash of it |
| `--focus-ring` | A soft tinted ring for custom focus states |
| `--color-absolute-white` / `--color-absolute-black` | Fixed endpoints for color mixing, never direct component colors |
| `--scripture-accent-fallback`, `--scripture-foil-fallback`, `--scripture-pill-foreground` | Semantic fallbacks and text color for scripture cover treatments |

Materials are the canvas made translucent, for anything that floats over content:
`.material-ultrathin`, `.material-thin`, `.material-regular` (the header and tab bar) and
`.material-thick`. Without `backdrop-filter` they fall back to the solid canvas.

Elevation (`shadow-hairline`, `shadow-raised`, `shadow-lifted`, `shadow-overlay`) is a soft
neutral shadow on Usha, a warm one on Sandhyā and Bhojpatra, and none on Rātri, where a card
is lifted by a lighter surface instead, as in Apple's dark mode.

## Components

All in `components.css`, built from named tokens and the scripture cover variables:

- `.apple-card` (and `.apple-card-link` for a card that is a link: it rises under the pointer
  and gives under a tap)
- `.apple-group` with `.apple-row` children and an `.apple-chevron` (a Settings-style list)
- `.apple-segmented` with `<button aria-pressed>` children
- `.apple-field`
- `.apple-pill` (filled), `.apple-pill .apple-pill-tinted` (quiet)
- `.apple-tint-chip` (set `--chip` for its colour)
- `.apple-stat` (tabular figures for numbers)
- `.apple-scope` on a page wrapper quiets older components inside it
- The chapter reader's verse card (`.verse-card.book-verse` and its exported form `.verse-card.vt`) is styled here too: one card per verse in the scripture's own cover colours (`--v1..3`, `--foil` from `lib/scripture-vibes.ts`), with a gradient edge, a luminous shloka panel, a filled verse capsule and a gilt ॥ mark. Chapter and verse reading cards remain still as the reader scrolls. The markup in `VerseCard.tsx` and `VerseText` is unchanged, and both forms share one box so hydration does not shift the page.

Use `/design-system-preview/` to review the reader card in all four themes and across the five cover materials, including larger Sanskrit text and a keyboard-operable study disclosure. The preview is noindex and does not appear in site navigation.
`tests/design-system.spec.ts` checks the white verse-pill label against every category palette and the scripture-specific Gita and epic palettes in all four themes.

### Reader contract

Present the original Sanskrit first, followed by अर्थ and व्याख्या. The reviewed मर्म belongs with the editorial explanation after अर्थ. Label commentary or traditional explanation clearly when it exists; do not present a repeated translation as commentary. Modern context and reflection follow the explanation when available. Preserve the distinction between scripture, sourced commentary, and editorial material. The shared section order and labels live in `lib/sacred-reading-order.ts`.

On phones, keep previous and next verse controls reachable and clearly labeled. Reader controls use at least a 44px touch area, a visible keyboard focus state, and a clear selected state. Keep the verse and meaning readable before offering secondary actions.

React pieces:

- `PageHeader`: eyebrow, large title, Hindi line, lead. Server component.
- `SectionTitle`: optional eyebrow, title and Hindi line, sub line, trailing link, and the
  accent rule that draws itself in. Use it for every section heading.
- `CountUp` (`app/components/motion/CountUp.tsx`): a number that counts up once when it scrolls
  into view. The HTML always has the true value.
- `WisdomTicker` (`app/components/home/WisdomTicker.tsx`): the slow band of mahāvākyas on home.

## Motion

| Tailwind | Token | Value | Use |
| --- | --- | --- | --- |
| `duration-instant` | `--duration-instant` | 120ms | Press feedback |
| `duration-fast` | `--duration-fast` | 180ms | Colour and hover changes |
| `duration-standard` | `--duration-standard` | 280ms | Small UI moves |
| `duration-base` | `--duration-base` | 420ms | Entrances |
| `duration-deliberate` | `--duration-deliberate` | 600ms | Larger scene changes |
| `duration-slow` | `--duration-slow` | 900ms | Sheens, slow settles |
| `ease-standard` | `--ease-standard` | | The default |
| `ease-out-soft` | `--ease-out` | | Things arriving |
| `ease-in-soft` | `--ease-in` | | Things leaving |
| `ease-in-out-soft` | `--ease-in-out` | | Things moving across |
| `ease-spring` | `--motion-spring` | | A real spring (CSS `linear()`), for settles and presses |

Classes in `motion.css`:

- `.reveal`: rises in on its own scroll timeline.
- `.reveal-grid`: its children cascade in as a wave, 0 to 3 steps along a row.
- `.hero-rise`, `.hero-stage`, `.hero-halo`: the home hero.
- `[data-tilt]`, `[data-depth]`: 3D tilt toward a fine pointer (`MotionLayer.tsx`).
- `.cta-primary` (sheen and lift), `.btn-sheen` (sheen only; `.apple-pill` has it built in).
- `.chevron-nudge`, `.link-lift`, `.lift-hover`: small pointer responses.
- `.section-rule`: the heading accent that grows in.
- `.ticker`: the marquee band.

Rules:

1. **The exported HTML is the readable state.** No text starts at `opacity: 0` in the HTML.
   Scroll effects use CSS view timelines, so the first screen is already past its range and
   browsers without them simply show everything.
2. **Compositor only.** Animate `transform`, `opacity` and briefly `filter`, never layout.
3. **Reduced motion is respected everywhere.** Every token duration collapses to 1ms, and each
   looping or scroll-linked effect has its own `prefers-reduced-motion` guard. The lite,
   low-power and data-saver modes turn off loops and tilt too.
4. **Reading pages stay calm.** Chapter and verse cards do not move or fade as the reader scrolls.
5. **No new animation libraries** for page chrome. The JS budget is already over, so effects
   are CSS first; `CountUp` is one observer and a `requestAnimationFrame` loop.
