# Roadmap: personalised, source-transparent learning

Principle: simplify the language and the path, never the teaching. Editorial content is never shown as scripture, and nothing is invented where reviewed content is missing.

## Phase 1 (built)

| Item | Where | Notes |
|---|---|---|
| Start My Journey | `/start`, `data/journeys.ts` | 5 questions, skippable, no sign-in. Answers in `dharma.journey.v1`; also sets reader language and depth (disclosed on the page). Up to 3 paths from existing routes only. Reset button. |
| Chapter orientation | `app/components/ChapterOrientation.tsx`, `data/chapter-orientation.ts` | Gita ch. 1–2 only, flagged "draft, awaiting editorial review". Other chapters show nothing rather than invented text. Sequence is an ordered list (its own text alternative), horizontal on desktop and vertical on mobile. |
| Reading comfort (focus) mode | `VerseReader.tsx`, `lib/useReaderSettings.ts` | Hides rails, toolbar and related sections. Keeps verse, explanation, prev/next, settings. Tone, width, text size, line spacing, reduced motion, full screen, position. |
| Content density | existing Quick / Simple / Deep | Quick ≈ Essential, Simple ≈ Balanced, Deep ≈ Complete. A second control would duplicate it. Rename the labels only if the editorial team wants. |
| Explanation feedback | `understand/ExplanationFeedback.tsx` | Yes / Partly / No plus fixed reasons, no free text. Stored in `dharma.feedback.v1` on the device. Separate from Report correction. |

## Open decisions and gaps in Phase 1

- **Feedback dashboard:** feedback stays on the device, so an editorial dashboard cannot see patterns. This needs a small collection endpoint (anonymous, rate-limited) and a privacy decision. Until then, only local export is possible.
- **Chapter audio:** "Listen to chapter" is not built. There is no chapter-level player; verse audio is device speech.
- **Orientation content:** needs a scholar's review; extend per scripture only with reviewed text.
- **Numbering:** the Gita uses the library's 701-verse numbering; check linked verse numbers after any renumbering.

## Phase 2 (design)

1. **Concept explorer:** build on `/concepts` and `data/concept-details.ts`. Desktop graph, mobile expandable list; relationships as text. Each node uses the 10 fields in the brief; fields without reviewed data show "not yet prepared".
2. **Explain this line:** needs line-level reviewed data (`lineExplanations[verseKey][lineIndex]`). Selection without data shows "Editorial review required". No generated meanings.
3. **Translation comparison:** pick any two of Sanskrit, transliteration, word-by-word, literal and simple Hindi/English. Two columns on desktop, stacked on mobile. Show translator and edition (already in provenance).
4. **Commentary comparison:** requires per-commentary metadata (commentator, tradition, edition, translator, review status). Reuse `SourcesAndInterpretation`.
5. **Cross-scripture connections:** `relations[]` with type (similar, complementary, different emphasis, narrative, commentary), editorial reason, review state. Never label "same teaching" without evidence.

## Phase 3 (design)

Audio-first mode (needs recorded recitation and a queue; sleep timer and screen-off playback need a real audio element, not speech synthesis). Visual story mode (every visual labelled: scriptural description, traditional representation, editorial reconstruction, generated illustration, with text alternatives). Reading journeys (extend `learning-paths.ts`: curator, review date, calm progress language). Personal study desk (extend `/dashboard` and `/bookmarks`; reuse `lib/backup.ts`; PIN already exists in Sadhana).

## Phase 4 (design)

Intent search (extend the theme matcher in `lib/search-themes.ts`; results must link to verified passages, with no generated answers). Recommendation cards with reasons (local reading history only; hide, reset and disable controls). Study packs (print stylesheet with Devanagari fonts, no private notes by default). Learning cards (extend `ShareCard`). Editorial dashboard (extend `scripts/check-*.ts` into a report; statuses draft, editorial review, source review, approved, published, correction pending, archived).

## Cross-cutting requirements

- **Accessibility:** every visual has a text alternative; controls at least 44px; no colour-only meaning; `role="status"` for confirmations; reduced motion respected.
- **Privacy:** local-only by default; each feature states what it stores; all `dharma.*` keys are covered by export and backup.
- **Acceptance:** a feature ships only when its content is reviewed or it displays an explicit "not yet prepared" state.
- **Testing:** extend `tests/smoke.spec.ts`, `a11y.spec.ts` and `keyboard.spec.ts` for `/start`, focus mode and feedback.

## Phase 2 status (built)

| Item | Where | Data |
|---|---|---|
| Explain this line | `app/components/study/ExplainLine.tsx` | `LINE_EXPLANATIONS` in `data/study-content.ts`. Only Gita 2.47 has entries (draft). Any other line shows "Editorial review required" and stays inside its verse. A button per line, plus a text selection offers it. |
| Translation comparison | `study/CompareViews.tsx` (Deep mode) | Built from the verse's own layers; any two views, two columns on desktop and stacked on phones; lines are paired only when both have the same line count. Choice kept locally. AI translations are labelled. |
| Commentary comparison | `study/CommentaryCompare.tsx` (Deep mode) | `COMMENTARIES` is empty: no traditional commentary has been entered. The five layers show, the commentary panel says so, and the filters (commentator, tradition, language, detail) and metadata appear once entries exist. |
| Cross-scripture connections | `study/RelatedTeachings.tsx` | `CONNECTIONS`: three draft links for Gita 2.47 (2.48, 3.19, Isha 2) with type, reason and review status. |
| Concept explorer | existing `/concepts` and `/concepts/[id]` | Detail pages already carry definition, derivation, contexts, verses, traditions, misunderstandings, related concepts and sources. Gap: Jnana has no entry (Yajna is there instead); a mobile list for the graph is not verified. |

## Phase 3 status (built)

| Item | Where | Notes |
|---|---|---|
| Reading journeys | `/journeys`, `data/reading-journeys.ts`, `scripts/check-journeys.ts` | Three drafts (Seven Days of Focus, Understanding Karma Yoga, Understanding the Self). Verse text is read from the library at build time; the check script fails if a lesson's reference no longer contains its expected Sanskrit. Progress in `dharma.journeys.v1`, worded "You have completed 3 of 7 readings." Curator is the editorial team; no lesson has been reviewed. Five of the eight journeys named in the brief are not written. |
| Audio-first mode | removed | The `/listen` page and all device-speech controls were removed on 2026-10-08. No narration is offered. |
| Visual story mode | `/story` | Built from existing characters and narrative timelines. Each block carries one of the four labels; diagrams have a text list. No generated illustrations are used. Location map is not included (links to `/locations`). |
| Personal study desk | `/desk` | Saved verses, notes, reading queue (reorderable), recent chapters, active journeys, offline indicator, optional PIN (salted SHA-256, a privacy screen only), export and import (existing backup), per-record delete, clear all. `lib/backup.ts` gained `clearOwnData`. |

Known gaps: no recorded recitation or reciter attribution; screen-off playback depends on the browser; the story views reuse paraphrased dialogue and need editorial review. The dashboard reading overview now counts distinct verses present in the local activity log and shows recent chapter visits without estimating completion from that capped history.

## Phase 4 status (built)

| Item | Where | Notes |
|---|---|---|
| Intent search | `lib/search-intent.ts`, used by `GlobalSearchModal` | Recognises comparison ("difference between A and B", "A vs B", "how does A relate to B"), definition ("what is", "meaning of") and topic ("verses about", "what does the Gita teach about") questions. It looks each term up with the normal search, puts matching concept pages first, and says how it read the question. It writes no answer. Added synonyms (failure, setback, success, work) to the duty theme. References and transliteration queries are untouched. |
| Recommendations with reasons | `study/RecommendationCards.tsx`, shown on `/desk` | Built only from this browser's last chapter, journey progress and reviewed links. Each card shows what it is based on and a reason, with "Why am I seeing this?", Hide, Reset hidden, Turn off and Forget reading history. |
| Study packs | `/pack` | Pick verses (saved, a journey, or by reference) and layers; browser print gives page numbers (`@page`), a sources footer and no verse split across pages. AI translations are labelled; notes only if ticked; commentary prints a "none reviewed" line. Simple explanation and reflection appear only for journey verses, because no other reviewed text exists. |
| Learning cards | `understand/ShareCard.tsx` | Four formats: verse only, with translation, with one-line explanation, and a concept card (on every concept page). Lower blocks are labelled "TRANSLATION" (or AI) and "EXPLANATION, NOT SCRIPTURE". Text shrinks to fit, so it cannot run into the attribution. |
| Editorial dashboard | `/editorial` (noindex), `scripts/quality-report.ts`, `data/content-status.ts` | `npm run report:quality` scans 187k verses and the study data into `data/quality-report.json` (gitignored); the page renders it at build time. Seven-status workflow with allowed transitions and a history field per item. |

Not measurable by the dashboard: clarity feedback (stored only on readers' devices) and pending corrections (GitHub issues).
