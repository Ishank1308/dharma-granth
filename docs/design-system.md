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
| `app/styles/colour.css` | Colour and life: the page aurora, dawn titles, coloured cards and icon tiles, gradient buttons, spectrum rules. Loaded last. |
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

Tailwind names the same colours: `text-label-primary` … `text-label-quaternary`,
`bg-fill-primary` … `bg-fill-quaternary`, `border-separator`, `border-separator-strong`,
`bg-surface-canvas` / `-raised` / `-elevated` / `-sunken`, `text-tint`, `bg-tint-fill` and
`text-on-tint`.

Materials are the canvas made translucent, for anything that floats over content:
`.material-ultrathin`, `.material-thin`, `.material-regular` (the header and tab bar) and
`.material-thick`. Without `backdrop-filter` they fall back to the solid canvas.

Elevation (`shadow-hairline`, `shadow-raised`, `shadow-lifted`, `shadow-overlay`) is a soft
neutral shadow on Usha, a warm one on Sandhyā and Bhojpatra, and none on Rātri, where a card
is lifted by a lighter surface instead, as in Apple's dark mode.

## Colour: the sacred spectrum

Beyond the one saffron tint, every page draws colour from seven hues in `tokens.css`, deep on
the light themes and luminous on Rātri:

| Token | Hue |
| --- | --- |
| `--hue-saffron` | agni, the tint's own family |
| `--hue-vermilion` | sindūr |
| `--hue-gold` | svarṇa |
| `--hue-lotus` | padma |
| `--hue-indigo` | nīla |
| `--hue-peacock` | mayūra |
| `--hue-tulsi` | tulsī |

Mixed from them: `--gradient-dawn` (saffron to vermilion to lotus, for titles and highlights),
`--gradient-spectrum` (all seven, for rules, progress and hairlines) and `--gradient-action`
(the filled button). `--tone-wash`, `--tone-edge`, `--tone-glow` and `--tone-aurora` set how
strongly colour shows in each theme, so a component never needs four copies.

`app/styles/colour.css` applies them to the existing hooks, so pages need no changes:

- **Aurora**: a fixed layer of soft colour pools behind every page that drifts on a 48s loop.
  Page wrappers with `bg-dharma-bg` let it show (the body paints the same colour). On chapter
  and verse pages it sinks to a whisper and holds still.
- **Titles**: `.ink-dawn` sets English display text in dawn ink (PageHeader titles, the hero's
  "Complete."). Never on Devanagari. `.eyebrow-capsule` turns a PageHeader eyebrow into a tinted
  capsule led by a breathing dot.
- **Cards**: every `.apple-card` carries `--card-hue`: the `--chip` colour set on the card, or
  else the next spectrum hue in turn, so a grid reads as a garland. The hue shows as a lit top
  edge, a corner wash and, on a link card, a glow under the pointer. Set `--chip` on the card,
  not on its icon tile, so both share it.
- **Icon tiles** (`.apple-tint-chip`) are lit from above and lean in on a spring when their card
  is hovered.
- **Actions**: `.apple-pill`, `.cta-primary` and any `a`/`button` with `bg-dharma-saffron` wear
  `--gradient-action` with a tinted glow.
- **Header and rules**: the current nav link has a dawn underline, the scroll-progress hairline
  and `.section-rule` are the spectrum, the footer opens with a spectrum hairline.
- **Library books** (`.home-book`) get a wash, spine and glow in the scripture's own colour.
- **Verse cards** come alive under the hand: the gradient edge turns round the card
  (`--vc-angle`, a registered property), the verse capsule lifts and glows and the gilt ॥ mark
  warms. Each study layer has its own hue, in reading order: अर्थ peacock, व्याख्या saffron,
  आधुनिक संदर्भ indigo, चिंतन lotus, संबंधित ज्ञान tulsī. On the verse page the knowledge tree
  (`data-branch` on each node) colours its rail, nodes, elbows and panels; an open node is a lit
  jewel. On the chapter card each `SacredSection` (`data-section`) is led by a jewel in its hue
  and the joining rail shades through them. Nothing on a reading page loops: every effect
  follows the pointer, the scroll or a tap.
- **Panchang** (`.panchang-scope`, `.panchang-limb[data-limb]` from the route layouts): each limb of
  time has its own pair of hues (`--limb`, `--limb-2`): तिथि indigo, वार saffron, नक्षत्र peacock,
  योग lotus, करण tulsī, मुहूर्त gold. The hero carries a slow kāla-chakra, cards and switcher pills
  take the limb's colour, and today's limb cards on `/panchang/` each wear their sub-page's hue.

Reduced motion, the lite, low-power and data-saver modes stop every loop; forced colours and
print drop the aurora and washes.

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
- The chapter reader's verse card (`.verse-card.book-verse` and its exported form `.verse-card.vt`) is styled here too: one card per verse in the scripture's own cover colours (`--v1..3`, `--foil` from `lib/scripture-vibes.ts`), with a gradient edge, a luminous shloka panel, a filled verse capsule and a gilt ॥ mark. Cards rise in and a band of light crosses the shloka as you scroll (view timelines; still under reduced motion and the quiet modes). The markup in `VerseCard.tsx` and `VerseText` is unchanged, and both forms share one box so hydration does not shift the page.

Use `/design-system-preview/` to review the reader card in all four themes and across the five cover materials, including larger Sanskrit text and a keyboard-operable study disclosure. The preview is noindex and does not appear in site navigation.
`tests/design-system.spec.ts` checks the white verse-pill label against every category palette and the scripture-specific Gita and epic palettes in all four themes.

### Reader contract

Present the original Sanskrit first, followed by अर्थ and व्याख्या. The reviewed मर्म sits right after the Sanskrit, labelled as editorial, not scripture. Label commentary or traditional explanation clearly when it exists; do not present a repeated translation as commentary. Modern context and reflection follow the explanation when available. Preserve the distinction between scripture, sourced commentary, and editorial material. The shared section order and labels live in `lib/sacred-reading-order.ts`.

On phones, keep previous and next verse controls reachable and clearly labeled. Reader controls use at least a 44px touch area, a visible keyboard focus state, and a clear selected state. Keep the verse and meaning readable before offering secondary actions.

React pieces:

- `PageHeader`: eyebrow, large title, Hindi line, lead. Server component. Every primary page uses
  it (library, Learn, Sadhana, Ask). `width="wide"` lines it up with a full-width grid, and
  `eyebrowLang="sa"` marks a Sanskrit phrase in the eyebrow.
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
4. **Reading pages stay calm.** Chapter and verse pages get the shared chrome and the verse card's scroll-linked arrival and light, nothing that loops.
5. **No new animation libraries** for page chrome. The JS budget is already over, so effects
   are CSS first; `CountUp` is one observer and a `requestAnimationFrame` loop.
