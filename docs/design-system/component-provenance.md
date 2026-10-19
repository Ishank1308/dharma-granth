# Component Provenance & Licensing Record
## Dharma Granth Design System Modernization

This document tracks all external open-source component patterns, architectural inspirations, licenses, and adaptations integrated into the Dharma Granth codebase.

---

### Strict Licensing Guardrails
1. **Permissive Open-Source Only**: Only MIT, BSD, or Apache 2.0 licensed component architectures are considered.
2. **No Proprietary or Restricted Assets**: No closed-source, paywalled, or restrictive commercial snippets are used.
3. **Zero Third-Party Tracking**: All components run 100% locally on the client or during static generation. No telemetry, CDN scripts, or external API calls are introduced.
4. **Original Dharma Granth Visual Transformation**: No component retains default SaaS styling, colors, or tech-startup aesthetics. Every pattern is refactored into the sacred, contemplative manuscript identity of Dharma Granth.

---

## Provenance Registry

### 1. Accessible Segmented Tabs (`components/ui/tabs.tsx`)
- **Source Library**: [shadcn/ui](https://ui.shadcn.com/docs/components/tabs) / Radix UI WAI-ARIA Tabs pattern
- **Source Repository**: `https://github.com/shadcn-ui/ui`
- **License**: MIT License (Copyright (c) 2023 shadcn)
- **Copyright Requirement**: Notice preserved in project provenance; permissive re-licensing and modification.
- **Whether Modified**: **Substantially Modified**. Re-implemented as zero-dependency native WAI-ARIA primitive with roving tabindex, arrow-key navigation, local storage preference persistence, and custom Framer Motion sliding pill with `prefers-reduced-motion` fallback.
- **Dependencies Introduced**: None (uses project's existing `clsx`, `tailwind-merge`, and `framer-motion`).
- **Files Added**:
  - `components/ui/tabs.tsx`
  - `components/ui/reading-mode-selector.tsx`
- **Date Reviewed**: October 19, 2026

---

### 2. Accessible Disclosure Accordion & Collapsible (`components/ui/accordion.tsx`)
- **Source Library**: [shadcn/ui](https://ui.shadcn.com/docs/components/accordion)
- **Source Repository**: `https://github.com/shadcn-ui/ui`
- **License**: MIT License (Copyright (c) 2023 shadcn)
- **Copyright Requirement**: Preserved in provenance documentation.
- **Whether Modified**: **Substantially Modified**. Adapted for scripture study disclosures (Core Shift, Simple Meaning, Key Words, Misreading, Commentary, Sources). Canonical scripture is strictly prohibited from collapsing. Includes Devanagari badge integration and smooth CSS grid/height animations.
- **Dependencies Introduced**: None.
- **Files Added**:
  - `components/ui/accordion.tsx`
  - `components/ui/collapsible.tsx`
- **Date Reviewed**: October 19, 2026

---

### 3. Accessible Dropdown Menu & Mobile Drawer (`components/ui/dropdown-menu.tsx` & `components/ui/drawer.tsx`)
- **Source Library**: [shadcn/ui](https://ui.shadcn.com/docs/components/dropdown-menu) & [Vaul](https://github.com/emilkowalski/vaul) drawer pattern
- **Source Repository**: `https://github.com/shadcn-ui/ui`
- **License**: MIT License (Copyright (c) 2023 shadcn / Emil Kowalski)
- **Copyright Requirement**: Preserved in provenance documentation.
- **Whether Modified**: **Substantially Modified**. Built as a hybrid responsive primitive: renders a floating popover on desktop viewports and automatically shifts to a bottom-sheet drawer on mobile. Implements focus trap, backdrop scroll lock, Escape key dismissal, and focus restoration to the trigger button.
- **Dependencies Introduced**: None.
- **Files Added**:
  - `components/ui/dropdown-menu.tsx`
  - `components/ui/drawer.tsx`
- **Date Reviewed**: October 19, 2026

---

### 4. Contemplative Command Search (`components/ui/command-search.tsx`)
- **Source Library**: [shadcn/ui](https://ui.shadcn.com/docs/components/command) (inspired by Pacocoursey `cmdk`)
- **Source Repository**: `https://github.com/shadcn-ui/ui`
- **License**: MIT License (Copyright (c) 2023 shadcn)
- **Copyright Requirement**: Preserved in provenance documentation.
- **Whether Modified**: **Substantially Modified**. Transformed from a developer CLI tool into a serene scripture-seeking interface. Groups results by Scriptures, Chapters, Concepts, and Life Situations. Supports Devanagari input and transliteration matching, recent search history stored privately in `localStorage`, and full keyboard navigation (`/`, `Ctrl+K`, arrows, Enter, Escape).
- **Dependencies Introduced**: None.
- **Files Added**:
  - `components/ui/command-search.tsx`
- **Date Reviewed**: October 19, 2026

---

### 5. Calm Empty, Loading & Error States (`components/ui/empty-state.tsx`)
- **Source Library**: shadcn/ui empty pattern & modern editorial guidelines
- **Source Repository**: Original pattern design for Dharma Granth
- **License**: MIT License
- **Copyright Requirement**: Original Dharma Granth architectural asset.
- **Whether Modified**: Original implementation adhering to non-technical, serene Sanskrit and English messaging for empty search, bookmarks, missing translations, and offline states.
- **Dependencies Introduced**: None.
- **Files Added**:
  - `components/ui/empty-state.tsx`
- **Date Reviewed**: October 19, 2026

---

### 6. Editorial Bento Grid (`components/ui/bento-grid.tsx`)
- **Source Library**: [Magic UI](https://magicui.design/docs/components/bento-grid)
- **Source Repository**: `https://github.com/magicuidesign/magicui`
- **License**: MIT License (Copyright (c) 2024 Dillion Verma)
- **Copyright Requirement**: Preserved in provenance documentation.
- **Whether Modified**: **Substantially Modified**. Stripped of all continuous canvas animations, glowing borders, and particle effects. Adapted strictly for static layout composition on discovery pages (Homepage, Learn, Guidance). Uses pure CSS Grid with responsive column spanning and manuscript surfaces.
- **Dependencies Introduced**: None.
- **Files Added**:
  - `components/ui/bento-grid.tsx`
- **Date Reviewed**: October 19, 2026

---

### 7. Restrained Motion Wrappers (`components/ui/motion-wrapper.tsx`)
- **Source Library**: Framer Motion patterns / React Bits animation principles
- **Source Repository**: Standard Framer Motion accessibility patterns
- **License**: MIT License
- **Copyright Requirement**: Preserved in provenance documentation.
- **Whether Modified**: Created specifically for contemplative reading: provides subtle fade and vertical entrance transitions (<= 10px, 0.25s duration) with automatic zero-duration fallbacks when `prefers-reduced-motion` is detected. Rejects all text scrambling, particle bursts, and parallax.
- **Dependencies Introduced**: None (uses project's existing `framer-motion`).
- **Files Added**:
  - `components/ui/motion-wrapper.tsx`
- **Date Reviewed**: October 19, 2026
