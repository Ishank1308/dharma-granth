---
name: dharma-ux
description: Dharma Granth UX workflow and design skill combining Antigravity IDE/2.0 interaction patterns (/ slash commands, @ scripture scoping, inline lenses, keyboard jumps, /browser inspection) with Generative UI studios and Dharma Granth bilingual design-system guardrails. Activate when designing, building, or auditing UI/UX components across Dharma Granth.
---

# Dharma Granth UX & Antigravity Workflow Skill (`dharma-ux`)

Use this skill whenever building, refining, or auditing UX flows across Dharma Granth (`app/`, `docs/design-system.md`). It unites **Antigravity 2.0 & IDE UX patterns**, **Generative UI interactive studios**, and **Dharma Granth's philological and bilingual accessibility standards**.

## 1. Antigravity Platform Modalities for Dharma Granth UX

- **Live Browser Verification (`/browser` subagent)**:
  - Check whether `next dev` is already running on `localhost:3001` before starting a server (`next.config.js` shares `dist/`).
  - Delegate visual checks at both desktop (`1440x900`) and phone (`390x844`) viewports in Sandhya (Light) and Ratri (Dark) themes.
- **Inline Command (`Ctrl+I`) & Supercomplete (`Tab`)**:
  - Use `Ctrl+I` inside the editor for surgical token swaps (`app/styles/tokens.css`, `app/styles/components.css`) without touching surrounding verse rendering.
- **Interactive Chat Prototypes (`generative_ui`)**:
  - When proposing multi-step UX layouts or comparing reader hierarchy options, render a compact (`<= 420px`) flush `<agent-embed>` HTML widget using semantic container variables (`--foreground`, `--muted-foreground`, `--card-border`, `--primary`).
- **Design Alignment (`/grill-me` & `/plan`)**:
  - For cross-route reader or navigation changes, resolve architecture and philological separation questions upfront before editing shared components.

## 2. In-App Antigravity UX Patterns in Dharma Granth

1. **Command & Context Palette (`GlobalSearchModal.tsx` & `AskDharmaClient.tsx`)**:
   - **`/` Slash Commands**: Instant keyboard-driven actions (`/gita`, `/panchang`, `/sadhana`, `/learn`, `/ask`, `/meditation`, `/theme`, `/resume`, and `/manana`, `/random`, `/journal`, `/clear` on `/ask/`).
   - **`@` Scripture Scoping**: Contextual filtering (`@gita`, `@ashtavakra`, `@upanishads`, `@manas`, `@rigveda`, `@yoga`) that preloads the target search shard and scopes results without leaving the keyboard.
2. **Inline Study Lenses & Keyboard Jumps (`ReaderLayers.tsx`, `VersePageLayout.tsx`, `VerseStageCard.tsx`)**:
   - Contextual action pills beneath the root Sanskrit shloka with subtle desktop keycaps: `I` (IAST), `W` (Padachheda Word Lens), `S` (4-Step Svadhyaya Studio), `N` (Focus Private Study Note), `B` (Save Verse), `F` (Focus Mode), `[ / ]` (Prev/Next Pada Jump), `← / →` or `k / j` (Prev/Next Verse), and `?` (Keyboard Shortcut Legend).
3. **Interactive Sanctuary Studios (`generative_ui` idiom in React)**:
   - Reader: `InteractiveSvadhyayaWidget.tsx` (4-stage Shravana -> Bhavartha -> Vyakhya -> Nididhyasana)
   - Wisdom for Life: `TopicInteractiveWalkthrough.tsx` (5-step compassionate inquiry & breath pacer)
   - Ask (`/ask/`): 3-Step Dharma Manana Studio inside `AskDharmaClient.tsx`
   - Panchang (`/panchang/`): `InteractiveKalaStudio.tsx` (5 Limbs orbital harmonics & Ahoratra solar rhythm)
   - Practice (`/practice/`): `GuidedSadhanaSessionWidget.tsx` (5-minute guided breath + 11-bead japa + 60s silent resolve)
   - Learn (`/learn/`): `InteractiveShravanaStudio.tsx` (active concept recall synced to `localStorage`)

## 3. Non-Negotiable UX & Editorial Guardrails

1. **Bilingual Heading Parity (`tests/ui-language-labels.spec.ts`)**:
   - Separate English and Hindi into distinct DOM spans (`<span data-bi="en">...</span>`, `<span data-bi="sep"> · </span>`, `<span lang="hi" data-bi="hi">...</span>`).
   - Never put `ml-*` margin on a `data-bi="en"` or `data-bi="hi"` span inside `h1`–`h4` (so when a single language is selected, the remaining span sits flush at `marginLeft: 0px` with no hanging `·` or `()`).
   - Never add `tracking-*` letter-spacing to Devanagari (`lang="hi"` / `lang="sa"`).
2. **Philological & Editorial Separation**:
   - Root Sanskrit always leads, un-truncated.
   - Any interactive reflection, timer, checklist, or modern takeaway must carry clear framing (`"संपादकीय अभ्यास · मूल शास्त्र नहीं · Editorial Application · Not Scripture"`).
3. **Hindi Register & Numerals**:
   - Simple, dignified Hindi addressing the reader as `आप` (never `तुम`/`तू`). Zero Urdu/Persian words (`खुदा`, `दुआ`, `इंसाफ`, `तसल्ली`, `सिर्फ`, `लेकिन`, `ज़िन्दगी`, `मुश्किल`, `मदद`).
   - Standard ASCII digits (`0-9`) only — zero Devanagari numerals.
4. **Mobile & Privacy Discipline**:
   - Minimum `44px` touch targets (`min-h-[44px]`), zero horizontal overflow at `390px` viewport width, trailing slashes on all internal `href`s, and 100% on-device `localStorage` / IndexedDB persistence with zero account walls.
