# Component research matrix (design-system modernization)

Date: 2026-10-19. Status: **research and recommendation only; no component code was added by this pass.** Another tool (Antigravity) is doing the same mission in parallel, so this document avoids touching components to prevent conflicting changes. Reconcile the decisions below with that work before anything is installed.

## What the repository already has (observed)

- Next.js 14.2 (static export), React 18.3, Tailwind 3.4, framer-motion 12, lucide-react, clsx, tailwind-merge.
- **Not installed:** any `@radix-ui/*`, `cmdk`, `vaul`, `class-variance-authority`, or a `components.json` (shadcn is not initialised).
- Semantic colour tokens already exist as CSS variables (`--dharma-bg`, `--dharma-text`, `--dharma-card`, `--dharma-reading-surface` and others) mapped in `tailwind.config.ts`, with four themes: `day` (default), `sunset`, `night`, `paper`.
- Already built in-house and working: a Read / Understand / Study switch (native radio buttons), a mobile navigation drawer with focus trap, Escape, scroll lock and focus restore (`SiteNav.tsx`), a global search modal, Story Deck and Quote Studio dialogs (focus handling added this week), `Breadcrumbs`, and an offline manager.

## Licence and maintenance (checked against GitHub on 2026-10-19)

| Source | Licence | Last push | Notes |
|---|---|---|---|
| shadcn/ui | MIT | 2026-10-19 | Copy-the-code model; no runtime package to depend on |
| Radix primitives | MIT | 2026-10-14 | The accessible behaviour shadcn wraps |
| Magic UI | MIT | 2026-10-17 | Copy-the-code; some components are purely decorative |
| React Bits | **MIT + Commons Clause** | 2026-10-19 | Use in a website is allowed; selling or redistributing the components themselves is not. GitHub reports it as non-standard. Treat as "requires licence review" |
| cmdk | MIT | 2025-10-29 | Command-menu primitive |
| vaul | MIT | 2025-10-03 | Drawer primitive; slower release cadence |
| Aceternity UI | **not verified** | n/a | No public repository was found to read a licence from; part of its catalogue is paid. Do not use without reading its current terms |

## Candidate evaluation

"Adopt" = take as the behavioural foundation. "Adapt" = copy the pattern, rebuild the look. Bundle cost is **not measured**; any figure would need a build comparison before a decision.

| # | Need | Candidate | Overlap with what exists | Fit for scripture reading | Concerns | Recommendation |
|---|---|---|---|---|---|---|
| A | Reading-mode selector | Radix Tabs (via shadcn Tabs) | A native radio-group switch is live and keyboard-operable | High: roving focus, arrow keys, selected state | A tablist implies panels; this control changes display density, not panels, so radio semantics are arguably more accurate | **Keep the current native control.** Adopt Tabs only if the three depths become three separate panels |
| B | Explanation disclosures | Radix Collapsible / Accordion | Explanations are tabs inside each card | High: correct `aria-expanded`, keyboard, reduced-motion friendly | One more primitive package; the canonical passage must stay outside every disclosure | **Adopt** Collapsible (smaller than Accordion); one nesting level |
| C | "More actions" menu | Radix DropdownMenu (shadcn) | Currently a row of 6+ icon buttons per verse card | High: the clearest observed clutter | Needs a bottom-sheet variant on phones | **Adopt** DropdownMenu on wide screens; reuse the existing drawer pattern on phones |
| D | Mobile contents drawer | vaul, or Radix Dialog as a sheet | `SiteNav` already has a correct drawer | Medium | vaul adds a dependency for behaviour that exists; drag-to-dismiss is the only real gain | **Adapt** the existing drawer into a reusable `Sheet`; do not add vaul |
| E | Search command interface | cmdk | `GlobalSearchModal` exists and was just improved (citations, phonetics) | Medium | cmdk filtering is generic; scripture search needs its own ranking and context lines; risk of a developer-palette feel | **Inspiration only.** Keep the existing search; borrow the listbox keyboard model if gaps appear |
| F | Empty / loading / error states | none needed | Ad-hoc messages across pages | n/a | n/a | **Build in-house** one `StateMessage` component; no library |
| G | Editorial bento layouts | Magic UI Bento Grid | Home sections are already card grids | Medium, for the library and Life Guidance landing pages only | Must never appear inside continuous reading | **Adapt** the layout idea with plain CSS grid; no package |
| H | Motion wrappers | Magic UI Blur Fade, React Bits reveals | framer-motion is already installed | Low to medium | Blur reveals and text effects conflict with the brief's own bans | **Adapt** a short opacity/translate reveal in framer-motion; reject the rest |

Not adopted anywhere (these match the brief's reject list): text scrambling, cursor trails, click sparks, electric borders, marquees, magnetic buttons, rotating or particle backgrounds, WebGL backgrounds, large-blur reveals, parallax.

## Recommended order (smallest dependency footprint first)

1. `StateMessage` (F): no dependency.
2. `Collapsible` for explanation sections (B): one Radix package.
3. "More actions" `DropdownMenu` (C): one Radix package.
4. A reusable `Sheet` extracted from `SiteNav` (D): no new package.
5. Bento layout for `/scriptures/` and `/wisdom-for-life/` only (G): CSS only.

Before any of these: measure first-load JS on `/` and on a chapter page with and without the Radix packages (`scripts/check-export.mjs` enforces a 300 KB gzip budget on `/`), and confirm the static export still passes.

## Open questions

- What is Antigravity changing? Two tools editing the same components will conflict; one should own `app/components/reader/*` and `VerseCard.tsx`.
- Is a tablist (A) wanted for any reason other than looks? Replacing a correct control is churn.
