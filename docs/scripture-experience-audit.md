# Scripture Experience Audit (reading-first redesign)

Date: 2026-10-24. Scope: every route that renders scripture for reading —
chapter reader, verse reader, Ashtavakra reader, and preview components.
Rule applied: scripture is the hero, reading is primary, one unified order
(Verse → Arth → Vyakhya → Modern Context → Reflection → Related Wisdom)
with zero exceptions.

## 1. Parallel reader systems (the root inconsistency)

| # | System | Files | Order it renders |
|---|--------|-------|------------------|
| A | Chapter reader (tabbed cards) | `app/components/FullChapterVerses.tsx` + `app/components/VerseCard.tsx` | Verse, then tabs: Arth → Vyakhya → Vigyan (study only) → Modern Context (lesson incl. reflection question) |
| B | Verse page (knowledge tree) | `app/components/reader/VerseReader.tsx` + `app/components/reader/ReaderLayers.tsx` + `VerseTreeStructure.tsx` | Sanskrit →/transliteration/padaccheda aids → Arth → Vyakhya → Commentary & Explanation (separate branch) → Vigyan branch (Reflection + Research mixed) → situations → CompareViews → Sources |
| C | Ashtavakra (parallel shell) | `app/ashtavakra/AshShell.tsx`, `ashtavakra.css`, `AshtavakraVerseReader.tsx`, `VerseView.tsx` | Sanskrit → IAST → padaccheda → literal Hindi → book-based → simple → philosophical + analogy → concept visual → modern example → misunderstanding → apply/reflection/practice → English → themes/related → sources |
| D | Preview card (unused) | `app/components/reader/ProgressiveVerseCard.tsx` (only re-exported, never rendered) | Tabs: Arth → Vyakhya → Vigyan → Modern Context |

Findings:

1. **Three live orders, none identical.** A reader moving from a chapter page
   (system A) to a verse page (system B) to Ashtavakra (system C) meets three
   different sequences with three different names for the same content.
2. **Tabs hide meaning (A, D).** Arth/Vyakhya/Vigyan/Modern sit behind
   mutually exclusive tabs with an animated gradient pill; only one layer is
   visible at a time, which harms comprehension of a connected teaching.
3. **Vigyan / Modern / Reflection naming is inconsistent.** The same
   `lifeLesson` field renders as “Modern Context” tab (A), inside a “Vigyan”
   tree branch (B), and as “आज के जीवन से उदाहरण + जीवन में प्रयोग” (C).
   The `science`/`research` field renders as “Vigyan” (A), “Comparative
   Research Note” (B), and has no Ashtavakra counterpart.
4. **Commentary is split from Vyakhya (B).** “व्याख्या” and “Commentary &
   Explanation” are sibling tree branches although both answer “what it
   means”; traditional bhashya sits inside the second, far from the first.
5. **Reflection is buried.** The चिंतन प्रश्न (parsed by
   `ModernContextBlock`) renders at the bottom of whichever container holds
   the lesson — tab (A) or Vigyan branch (B) — never as its own step.
6. **Ashtavakra is a parallel universe (C).** Own shell (`AshShell` with
   visual/motion/scheme settings duplicating the site theme), own stylesheet
   (`ashtavakra.css`, `--ash-*` variables), own reader chrome
   (`AshtavakraVerseReader` bottom nav), own section order. Its data model
   (`lib/ashtavakra.ts`: word meanings, verification status, editorial
   notes) is worth keeping; its shell/CSS/reader patterns are not.
7. **Related Wisdom has five names.** “Related teachings” (chapter card
   `<details>`), `RelatedWisdom` + `RelatedWisdomDiscovery` (verse page
   children), `RelatedTeachings`, `NextTeachings`, जीवन-प्रसंग chips, and
   keyword chips — placed differently on each surface.
8. **Marma / core-shift is triple-rendered (A).** `insight.marma` figure,
   curated “मर्म · In One Breath” gradient card, and share-card `coreShift`
   can stack on one card.
9. **Sources/provenance differ.** Verse page has a full “Sources and
   edition” layer; chapter cards have none; Ashtavakra has “स्रोत और
   सत्यापन”. (Kept: each surface keeps its honest minimum; verse-page
   provenance is the reference.)

## 2. Vyakhya → Modern Context disconnect (before)

- Chapter card: Vyakhya and Modern Context are separate tabs — the reader
  must leave “what it means” to see “how it appears in life”.
- Verse page: Vyakhya (branch 2) is separated from Reflection (branch 4) by
  the Commentary branch; research and reflection share one “Vigyan” frame
  although one is evidence and the other is contemplation.
- Ashtavakra: six sections (simple → philosophical → visual → modern →
  misunderstanding → apply) sit between explanation and application.
- Styling: each container is its own heavy card (amber gradient, indigo
  frame, emerald frame), so the eye reads “separate features”, not one flow.

## 3. UI noise inventory (removed or calmed)

- Cursor spotlight tracking the mouse on every chapter card (`VerseCard`
  `onPointerMove` + `.verse-card-spotlight`).
- Gilded gradient spine on every card; `card-3d-depth` tilt styling.
- Animated tab pill (`bg-gradient-to-r from-saffron-600 to-amber-500`,
  layoutId spring) on every card.
- `AmbientOrbs` glow blobs behind the chapter hero (`chapter-view.tsx`).
- Indigo/violet gradient frames: Vigyan card, ModernContext reflection card
  (`from-indigo-500/10`), note/highlight indigo accents (kept where they
  carry meaning: the reader's own note/highlight).
- Amber/orange gradient wash on the Marm card and the lesson card.
- Duplicate Svadhyaya “मनन टिप्पणी” pill in the card header next to the note
  action (kept: single note action in the toolbar).
- Ashtavakra `ModeControls` (visual/motion/theme parallel settings) and the
  “skip animation” control for decorative motion that no longer ships.

Kept deliberately (functional, not noise): audio recitation, bookmark,
collections, highlight, personal note, share, copy/citation, sandhi-split
and word-gloss pronunciation, verification badges, AI/editorial draft
badges, verse navigation, reading progress.

## 4. Mobile findings (320 / 375 / 390 / 412 / 768)

- Card toolbar previously squeezed eight buttons to ~22px at 320px; fixed
  earlier by wrapping the toolbar to its own full-width row — verified kept.
- Tab bar was a horizontally scrolling pill strip; replaced by vertical flow
  (no horizontal scroll, no 44px tab targets to miss).
- Ashtavakra bottom nav used `--ash-*` variables; converged to dharma
  tokens with the same 48px targets and safe-area padding.
- `.sacred-flow` rail narrows below 400px; `.verse-leaf` padding shrinks so
  the shloka never overflows at 320px.
- Touch targets: nav/buttons stay ≥44px; inline word-gloss chips stay 36px
  (inline text chips, WCAG target-size minimum is 24px).

## 5. After: the unified system

- `lib/sacred-reading-order.ts` — the one order, referenced by all readers.
- `app/components/reader/SacredReadingFlow.tsx` — `SacredSection` +
  `ConnectedFlow`, reused by the chapter card, the verse tree labels, and
  Ashtavakra by reference (no alternate section systems).
- `ModernContextBlock.tsx` — still parses `### आधुनिक संदर्भ` /
  `### आज के जीवन में प्रयोग` / `### चिंतन प्रश्न`; now exposes
  `ModernContextBody` (context + application) and `ReflectionBody`
  (question) so Modern Context and Reflection render as two connected
  steps; reflection card calmed to dharma tokens.
- Chapter card: sequential flow, Vigyan folded into Modern Context as a
  quiet “Modern perspective” block (study depth only, same gate as before).
- Verse page tree: Arth → Vyakhya (explanation + commentary + traditional
  bhashya) → Modern Context (lesson + research) → Reflection (question).
- Ashtavakra: same six sections in the same order, same dharma tokens,
  same `ConnectedFlow`; keeps all content fields, word meanings (in a
  `<details>`, still in the HTML), verification badges/notes, and English
  text (translation under Arth, simple explanation under Vyakhya).
- Preview card (`ProgressiveVerseCard`, unused): tabs realigned to
  Arth → Vyakhya → Modern Context → Reflection so no fourth order survives.

## 6. Session note (2026-10-24)

Mid-session, a concurrent implementation landed in the same worktree:
`VerseCard.tsx` (19:03) and `VerseView.tsx` + `ashtavakra/[chapter]/page.tsx`
(19:06). It removed the chapter-card tabs, consolidated the card toolbar
into the ActionMenu overflow, and drafted a six-section Ashtavakra layout.
That work is kept and completed here: the binding gaps it left — Vigyan
rendered as a separate step *after* Modern Context, the चिंतन प्रश्न still
buried inside the Modern block, misreading placed after Reflection,
amber/orange gradient cards, `ash-*` classes on verse content, and no
shared order module — are fixed by this change (shared
`lib/sacred-reading-order.ts` + `SacredReadingFlow`, split
Modern/Reflection steps, calm dharma-token styling, Ashtavakra
convergence). The “before” column above describes the worktree as found at
session start; the “after” column describes the final state.

## 7. Residual gaps (not in this change)

- Ashtavakra index/words/chapter-list pages still use `ash-*` classes
  (`ashtavakra.css` stays imported by the layout for them). Verse content
  no longer depends on it; converging the list pages is a follow-up.
- `AshShell` provider stays (persists the saved scheme without a flash);
  only the parallel `ModeControls` UI was removed.
- Verse-page children below the tree (`RelatedWisdom`, `NextTeachings`,
  diagrams) keep their names; they sit under the Related Wisdom step.
