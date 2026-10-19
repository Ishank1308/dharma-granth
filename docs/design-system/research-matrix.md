# Open-Source Component Research Matrix & Architectural Evaluation
## Dharma Granth Design System Modernization

This document evaluates candidate open-source component patterns from **shadcn/ui**, **Magic UI**, **React Bits**, and **Aceternity UI** against Dharma Granth's sacred scripture-first requirements across all 24 evaluation dimensions.

---

### Evaluation Criteria (24 Dimensions)
1. **User Problem Solved**
2. **Suitability for Scripture Reading**
3. **Framework Compatibility** (React 18 / Next.js 14 App Router)
4. **React Version Compatibility** (React 18.3+)
5. **Next.js Compatibility** (Next.js 14.2+)
6. **Tailwind Compatibility** (Tailwind CSS v3.4+)
7. **TypeScript Quality** (Strict types, no `any`, generic polymorphism)
8. **Accessibility Behavior** (WAI-ARIA compliance, screen reader announcements)
9. **Keyboard Support** (Tab, Arrows, Enter, Space, Escape, Home, End)
10. **Focus Management** (Visible ring, focus trap in modals, focus restoration)
11. **Reduced-Motion Support** (`prefers-reduced-motion` compliance, instant transitions)
12. **Mobile Behavior** (Touch targets >= 44px, safe area padding, no horizontal overflow)
13. **JavaScript Cost** (Zero runtime bloat, tree-shakeable, zero unneeded dependencies)
14. **Animation Dependency** (CSS transitions / Framer Motion without heavy physics engines)
15. **Server-Rendering Safety** (SSR / SSG hydration safety, zero client-only crashes)
16. **Static-Export Safety** (`output: 'export'` compatible across 6,349+ static pages)
17. **License** (Permissive open source: MIT / Apache 2.0 / BSD)
18. **Attribution Requirement** (Clear provenance without disruptive visual branding)
19. **Maintenance Status** (Active community / standalone zero-dependency code)
20. **Adaptation Effort** (Effort to restyle from SaaS to contemplative manuscript aesthetic)
21. **Existing-Component Overlap** (Avoids duplicate state machines or competing UI logic)
22. **Security Risk** (No eval, no external CDNs, no unsafe HTML injections)
23. **Visual Suitability** (Warm, organic manuscript, calm typography, no tech-neon)
24. **Final Recommendation** (`Adopt` | `Adapt` | `Use as inspiration only` | `Reject` | `Requires license review`)

---

## 1. Candidate Evaluation Matrix

| ID | Candidate Component | Source Library | Primary Purpose | 24-Dimension Assessment Summary | Recommendation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **C1** | **Segmented Tabs** | shadcn/ui | Reading-mode selector (पाठ · बोध · स्वाध्याय) | Fully accessible WAI-ARIA tablist/tab semantics, roving tabindex, arrow-key navigation. High scripture suitability, zero external dependencies needed, supports local storage persistence. | **ADAPT** |
| **C2** | **Collapsible / Accordion** | shadcn/ui | Progressive disclosure of commentary, words, and sources | Solves vertical scrolling fatigue. Single-level nesting ensures canonical passage remains dominant. WAI-ARIA `aria-expanded` and `aria-controls` with keyboard toggle (Enter/Space). | **ADAPT** |
| **C3** | **Dropdown Menu / Drawer** | shadcn/ui + Vaul pattern | More Actions menu (desktop popover, mobile drawer) | Replaces 12 cluttered inline buttons with a calm 3-button primary bar and accessible overflow menu. Focus trap and Escape restoration on mobile. | **ADAPT** |
| **C4** | **Contents Sheet / Drawer** | shadcn/ui Sheet | Mobile chapter / verse table-of-contents navigation | Prevents reader from getting lost in 72-verse chapters. Traps focus, locks body scroll, handles safe-area insets cleanly. | **ADAPT** |
| **C5** | **Command Palette** | shadcn/ui (cmdk pattern) | Multi-criteria search (scripture, verse, topic, situation) | Adapts developer command-palette into a warm, contemplative scripture seeker. Keyboard navigation (`/`, `Ctrl+K`), zero tech-monochrome aesthetic. | **ADAPT** |
| **C6** | **Empty & Error States** | shadcn/ui patterns | Consolidating calm, honest empty/offline states | Provides reassuring, non-technical feedback when search has no results, bookmarks are empty, or offline pack is absent. | **ADAPT** |
| **C7** | **Editorial Bento Grid** | Magic UI | Discovery layouts on Homepage, Guidance, & Learn | Restrained asymmetric grid for editorial discovery. REJECT continuous marquee and particles. ADAPT layout proportions for scripture categories. | **ADAPT** (Layout only) |
| **C8** | **Animated Tabs Pill** | Magic UI | Smooth sliding background pill behind active tab | Restrained sliding pill using Framer Motion layoutId with instant jump fallback on `prefers-reduced-motion`. | **ADAPT** |
| **C9** | **Particles / Retro Grid** | Magic UI | Background particle effects | Fails criteria #2, #11, #13, #23. Continuous canvas rendering drains mobile battery, distracts reader, and violates calm scripture aesthetic. | **REJECT** |
| **C10** | **Decrypted / Scramble Text**| React Bits | Text reveal animation | Fails criteria #2, #8, #23. Scrambling characters ruins sacred Devanagari and IAST ligatures, confuses screen readers, and feels like a cyberpunk gimmick. | **REJECT** |
| **C11** | **Manuscript Spotlight** | React Bits | Subtle cursor-following light on manuscript border | Replaces harsh borders with warm, subtle illumination. Pure CSS variable-driven, disabled on touch and reduced motion. | **ADAPT** |
| **C12** | **Background Beams / Waves** | Aceternity UI | Continuous animated background rays | Fails criteria #2, #12, #13, #15. Heavy WebGL / SVG canvas operations cause frame drops on low-end Android devices and distract from contemplative reading. | **REJECT** |
| **C13** | **3D Card Hover Tilt** | Aceternity UI | Perspective card tilt on hover | Fails criteria #2, #8, #12, #23. Unstable text rendering during 3D transform creates eye strain and reading fatigue. | **REJECT** |

---

## 2. In-Depth 24-Dimension Analysis of Selected Components

### C1: Segmented Tabs (shadcn/ui Adapted)
1. **User Problem**: Users were confused about what layer they were reading, or had to see all 18 layers at once.
2. **Suitability**: Excellent. Clearly delineates पाठ (Scripture), बोध (Understanding), and स्वाध्याय (Deep Study).
3. **Framework**: 100% Next.js 14 / React 18 compatible.
4. **React Version**: Fully compatible with React 18.3.
5. **Next.js**: Clean SSR and client hydration.
6. **Tailwind**: Styled via `dharma` semantic tokens (`bg-dharma-panel`, `text-dharma-text`).
7. **TypeScript**: Strongly typed generic tabs interface with strict `as const` keys.
8. **Accessibility**: `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`.
9. **Keyboard**: Left/Right arrows navigate tabs, Home/End jump to ends, Enter/Space select.
10. **Focus**: Visible saffron focus ring (`focus-visible:ring-2 focus-visible:ring-saffron-500`).
11. **Reduced Motion**: Disables Framer Motion layout sliding; uses instant CSS active states.
12. **Mobile**: Flex-wrap / horizontal scrolling container with touch-friendly min 44px height.
13. **JS Cost**: Minimal (~1.5 KB), zero external npm packages.
14. **Animation**: Restrained Framer Motion `layoutId` pill.
15. **SSR Safety**: Renders initial active tab server-side without hydration mismatch.
16. **Static Export**: 100% compatible with `output: 'export'`.
17. **License**: MIT (shadcn/ui).
18. **Attribution**: Documented in `docs/design-system/component-provenance.md`.
19. **Maintenance**: Standalone project-owned code.
20. **Adaptation Effort**: Moderate (custom saffron/manuscript styling replacing zinc/slate).
21. **Overlap**: Replaces fragmented buttons and consolidates reading mode.
22. **Security**: Zero security risk.
23. **Visual**: Calming, warm, manuscript aesthetic.
24. **Verdict**: **ADAPT**.

---

### C2: Collapsible & Accordion (shadcn/ui Adapted)
1. **User Problem**: Long commentary and scholarly glosses forced 1,600px+ vertical scrolls per verse.
2. **Suitability**: High. Canonical verse is never collapsed; only editorial and commentary sections collapse.
3. **Framework**: React 18 / Next.js 14 compatible.
4. **React Version**: 18.3 compatible.
5. **Next.js**: SSR-safe with predictable default open/closed states.
6. **Tailwind**: Clean semantic classes with border and surface tokens.
7. **TypeScript**: Generic item interfaces with strictly typed disclosure keys.
8. **Accessibility**: `aria-expanded`, `aria-controls`, `role="region"`.
9. **Keyboard**: Enter and Space toggle; Tab moves between triggers.
10. **Focus**: High-contrast focus rings for keyboard users.
11. **Reduced Motion**: Instant opacity/height toggles without animation duration.
12. **Mobile**: Large tap targets (>= 48px header), zero horizontal shift.
13. **JS Cost**: Lightweight (~2 KB).
14. **Animation**: Smooth height animation via CSS grid or Framer Motion `AnimatePresence`.
15. **SSR Safety**: Fully safe.
16. **Static Export**: Generates clean static markup.
17. **License**: MIT.
18. **Attribution**: Documented in provenance file.
19. **Maintenance**: Standalone.
20. **Adaptation Effort**: Low.
21. **Overlap**: Consolidates separate custom toggle states into one predictable system.
22. **Security**: Zero risk.
23. **Visual**: Elegant lotus and chevron indicators with warm parchment card surfaces.
24. **Verdict**: **ADAPT**.

---

### C3: Dropdown Menu & Mobile Drawer (shadcn/ui + Vaul Pattern)
1. **User Problem**: 12 toolbar buttons cluttered every verse header on mobile.
2. **Suitability**: High. Preserves Bookmark, Copy, and expands secondary tools (Citations, Story Deck, Studio, Notes) only on click.
3. **Framework**: Next.js 14 compatible.
4. **React Version**: 18.3 compatible.
5. **Next.js**: Client component with clean backdrop portal.
6. **Tailwind**: Styled with `bg-dharma-card`, `border-dharma-border`, and `shadow-lg`.
7. **TypeScript**: Full prop typing for menu items, dividers, and custom trigger slots.
8. **Accessibility**: `role="menu"`, `role="menuitem"`, `aria-haspopup="true"`.
9. **Keyboard**: Escape closes, Arrow Down/Up navigates items, Enter executes.
10. **Focus**: Traps focus inside open drawer/menu; restores focus to trigger on close.
11. **Reduced Motion**: Disables slide-in animation in favor of immediate appearance.
12. **Mobile**: Gracefully switches from desktop floating popover to mobile bottom sheet.
13. **JS Cost**: ~3 KB.
14. **Animation**: Restrained fade/slide.
15. **SSR Safety**: Safe with portal mounted check.
16. **Static Export**: 100% compatible.
17. **License**: MIT.
18. **Attribution**: Documented in provenance file.
19. **Maintenance**: Standalone.
20. **Adaptation Effort**: Moderate.
21. **Overlap**: Replaces ad-hoc floating menus.
22. **Security**: Zero risk.
23. **Visual**: Clean, rounded-2xl manuscript aesthetic with bilingual labels.
24. **Verdict**: **ADAPT**.

---

### C5: Command Search Interface (shadcn/ui cmdk Pattern)
1. **User Problem**: Readers searching across 65 scriptures need instant filtering by title, Devanagari, chapter, or theme without a developer CLI vibe.
2. **Suitability**: Excellent for rapid scripture lookup.
3. **Framework**: Next.js 14 compatible.
4. **React Version**: 18.3 compatible.
5. **Next.js**: Safe client modal.
6. **Tailwind**: Semantic styling using `dharma` colors.
7. **TypeScript**: Typed results groups (Scriptures, Chapters, Concepts, Life Situations).
8. **Accessibility**: `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded`.
9. **Keyboard**: `/` or `Ctrl+K` to open, Up/Down to navigate, Enter to select, Escape to close.
10. **Focus**: Auto-focuses input upon opening, traps focus while open, restores focus upon exit.
11. **Reduced Motion**: Instant transition without zoom/bounce.
12. **Mobile**: Full-screen modal on mobile with touch-friendly scroll lists.
13. **JS Cost**: Lightweight (~4 KB).
14. **Animation**: Subtle fade-in.
15. **SSR Safety**: Portal mounts only on client.
16. **Static Export**: 100% compatible.
17. **License**: MIT.
18. **Attribution**: Documented in provenance file.
19. **Maintenance**: Standalone.
20. **Adaptation Effort**: Moderate.
21. **Overlap**: Replaces or enhances legacy search dialog with unified keyboard handling.
22. **Security**: Zero risk (search inputs sanitized).
23. **Visual**: Warm parchment styling with Devanagari font rendering and category tags.
24. **Verdict**: **ADAPT**.

---

### C7: Editorial Bento Grid (Magic UI Inspired)
1. **User Problem**: Discovery pages (Homepage, Learn Pathways, Guidance) needed clear visual hierarchy without looking like a generic SaaS template.
2. **Suitability**: High for overview pages. (Strictly prohibited inside continuous scripture reading).
3. **Framework**: React 18 / Next.js 14 compatible.
4. **React Version**: 18.3 compatible.
5. **Next.js**: SSR-safe pure CSS grid.
6. **Tailwind**: Uses responsive CSS Grid columns (`grid-cols-1 md:grid-cols-3 lg:grid-cols-4`).
7. **TypeScript**: Clean layout prop interfaces.
8. **Accessibility**: Standard semantic HTML (`section`, `article`, `header`).
9. **Keyboard**: Standard tab flow through cards.
10. **Focus**: Card focus indicators matching theme ring.
11. **Reduced Motion**: Disables hover micro-scales.
12. **Mobile**: Automatically collapses to single column on small screens.
13. **JS Cost**: 0 KB runtime overhead (pure CSS + HTML).
14. **Animation**: Pure CSS hover transitions.
15. **SSR Safety**: 100% SSR / SSG safe.
16. **Static Export**: 100% compatible.
17. **License**: MIT.
18. **Attribution**: Documented in provenance file.
19. **Maintenance**: Standalone.
20. **Adaptation Effort**: Low.
21. **Overlap**: Reorganizes scattered cards into cohesive visual clusters.
22. **Security**: Zero risk.
23. **Visual**: Manuscript card styling with warm saffron and gold accents.
24. **Verdict**: **ADAPT (Layout only)**.
