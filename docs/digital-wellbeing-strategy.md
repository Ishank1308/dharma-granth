# Dharma Granth: Digital Wellbeing Product Strategy

**Status:** strategy, wellbeing foundation, shared reading preferences, and private reflection portability, 23 October 2026
**Product premise:** technology should help a person arrive, attend, understand, reflect, and leave freely. Dharma Granth is a contemplative learning companion grounded in Sanatan texts; it is not a mental-health treatment service.

## Executive decision

Move from a **scripture library with practice tools** toward a **wisdom and wellbeing companion** in the product experience. Keep the library as the trusted source layer and the primary route into the product. Do not market the service as a clinically effective mental-health platform without evidence and appropriate care infrastructure. “Powered by Sanatan Wisdom” describes the educational source, not a health claim.

The differentiation is a complete, source-visible learning loop: choose a life question, read a primary passage, explore a clearly labeled interpretation, pause, and keep a private reflection if desired. A useful session may end after one passage. Return is an invitation, never an obligation.

## Research foundation and design principles

1. **Protect choice and authorship.** Behaviour-change technology reviews describe autonomy and self-determined motivation as relevant design lenses, but also document weak theory-to-design links and limited long-term evidence. Offer optional durations, explicit controls, and reversible settings; do not use shame, streak loss, ranks, social comparison, or escalating rewards. [Review of self-determination theory in behaviour-change technologies](https://academic.oup.com/iwc/article/38/3/447/7760010).
2. **Support attention with a clear stopping point.** A 2024 systematic review of 28 mindfulness-app trials (5,963 adults) found effects that tended to favor apps for attention regulation, repetitive negative thinking, and decentering, while other outcomes were mixed and sustained engagement was a limitation. Treat short, user-chosen practice as a design hypothesis to test, not a promised result. [Systematic review, *npj Mental Health Research*](https://pubmed.ncbi.nlm.nih.gov/38609511/).
3. **Do not overclaim wellbeing outcomes.** A separate meta-analysis of 45 randomized trials found small average app effects for anxiety and depression versus control groups; evidence against active therapeutic comparisons was limited and not significant. No Dharma Granth screen should say it treats anxiety, grief, or depression. [Updated meta-analysis of mindfulness apps](https://pubmed.ncbi.nlm.nih.gov/38056219/).
4. **Make digital reading behave like reading.** A 2024 meta-analysis of 37 experiments found no overall comprehension difference between paper and digital reading, while identifying moderating conditions. Design for long-form reading anyway: stable layout, adjustable type, generous line height, low interruption, source navigation that does not pull the reader away, and a clear return point. [Paper-versus-digital reading meta-analysis](https://www.sciencedirect.com/science/article/pii/S2772503024000288).
5. **Measure only what helps the person.** Display compact, local summaries for user-recognizable activities. Do not infer a mood, build a behavioral profile, send events to analytics, or optimize time-on-site. Make the data window and source visible. Let users pause, clear, export, and restore data.
6. **Preserve tradition and editorial boundaries.** Keep canonical text, translation, traditional commentary, modern editorial explanation, and any scientific resonance visibly distinct. Cite the edition or source. Present a passage as an invitation to study, never as diagnosis or a substitute for care.
7. **Let absence be a valid outcome.** No push reminders by default. No infinite feed, autoplay, forced next step, “you are falling behind,” or reward for opening the app. A session-completion state should include a quiet exit.

## Product audit: current strengths and risks

### Strengths to preserve

- The scripture catalogue and verse reader provide a primary-source foundation with Hindi, Sanskrit, and English layers.
- `/practice/journal/` and the verse-note tools are local-first. `lib/study/storage.ts` and the study IndexedDB adapter support richer journal records; `lib/backup.ts` exports app-owned browser data as JSON.
- `/practice/` already has meditation, japa, reflection, gratitude, and reading tools. `StoragePersistenceRequest` asks for persistent browser storage where supported.
- `MobileFocusMode`, the reader's `dharma_ekagrata_mode`, reader-layer preferences, and the global theme provide a starting point for focused and night reading.
- `/wisdom-for-life/`, learning journeys, and topic pages already provide entry points beyond scripture hierarchy.
- The server renders static scripture content; personal browser data hydrates only on the client.

### Risks to resolve

- The study dashboard has used streaks, lifetime totals, badges/levels, completion percentages, quiz counts, and a recent-activity feed. These can turn contemplative practice into a performance loop. The first implementation removes that score-like summary and replaces it with four locally computed, non-comparative measures.
- Daily recommendations, a separate daily verse, activity feed, and practice preview can stack into a content feed. Keep one clear invitation and a visible end to each session.
- Mood routes can imply clinical guidance. Use reader-selected questions and neutral labels; never diagnose from journal content or claim that a verse resolves a condition.
- “AI-generated” material must remain labeled and editorially reviewed. Do not cite research as proof of a spiritual claim.
- Current local data is spread across localStorage and IndexedDB. Avoid an account backend or silent cross-device sync. The JSON backup is user initiated and should remain explicit about its unencrypted file contents.
- Reading and practice data may be sensitive even on one device. Explain exactly what is counted, where it is stored, and how to clear it. Keep private routes out of search indexes.

## Attention restoration and mindful reading UX

Build five modes as a small set of composable reading preferences, not five separate applications:

| Mode | Reader behavior | Existing foundation | Next work |
|---|---|---|---|
| Focus | Hides optional panels and keeps the current passage, source, and essential navigation | `MobileFocusMode`; ekāgratā toggle in `FullChapterVerses` | Make the same setting discoverable and persistent on desktop and mobile; keep keyboard exit and restore scroll position |
| Reflection | Opens a short optional prompt after a selected passage; skips without losing place | `/practice/journal/`, private verse notes | Add “reflect on this passage” deep link and store a verse reference with the user's note, never the note text in analytics |
| Deep reading | Stable typography, no recommendation rail, clear chapter context, optional self-timed session | Reader layout and local chapter history; new explicit timer on dashboard | Add a user-triggered reader session entry point and preserve a deliberate ending |
| Night reading | Uses the existing low-light theme and user font-size setting | Theme switcher and `ReaderFontSize` | Verify contrast and focus indicators in every theme; do not claim a medical sleep effect |
| Digital rest | Offers save/finish/leave actions; no reminders or app blocking claims | Private bookmark, journal, and backup | Add optional one-tap “leave quietly” after a passage; browser cannot block other apps, so explain limits |

Reading flow:

1. Ask what the reader wants now: read, understand, reflect, or simply pause.
2. Show one source passage with language and source controls close at hand.
3. Keep commentary collapsed until requested; visually distinguish modern analysis from canonical text.
4. Offer one small reflection prompt, plus “skip.”
5. End with “Save a note,” “Continue later,” and “Leave quietly.” Do not auto-advance.

## Emotional wellbeing and scripture discovery map

Treat these as **study starting points**, not prescriptions. The map should state why a passage is related, show the full canonical text and source, and let users choose another tradition or chapter. Editorial framing needs review by a knowledgeable human before publication.

| Reader-selected concern | Possible starting passages | Framing and safeguards |
|---|---|---|
| Stress / change | Bhagavad Gita 2.14; 2.47 | Reflection on change and the boundary between action and outcome; no promise of symptom relief |
| Anxiety / uncertainty | Bhagavad Gita 2.47; 6.26 | Attend to present responsibility and gently return attention; do not tell a person to suppress fear |
| Fear | Bhagavad Gita 2.20–2.23; Katha Upanishad 2.3.14 | Philosophical teachings on the Self and courage; handle death-related passages with care and context |
| Anger | Bhagavad Gita 2.62–2.63; 16.21 | Examine the described chain of attention, attachment, and judgment; avoid moralizing a person for having anger |
| Grief | Bhagavad Gita 2.11, 2.20, 2.22 | Acknowledge grief as real; never use metaphysics to dismiss a person's loss or urge premature acceptance |
| Loneliness / belonging | Isha Upanishad 1.6–1.7; Bhagavad Gita 6.29–6.32 | Explore shared being and regard for others; explicitly affirm that text does not replace human connection |
| Purpose | Bhagavad Gita 3.35; 18.45–18.46 | Explore svadharma and meaningful action with multiple traditional readings; do not reduce purpose to career productivity |
| Discipline | Yoga Sutras 1.12; Bhagavad Gita 6.26 | Explore sustained practice and returning attention; define discipline without punitive streaks |

The discovery engine should use explicit category choices (emotion, situation, question, or challenge), curated passage records, and transparent “why this passage” notes. Search and filters remain available. The system must not inspect journal text, infer emotion, or personalize from sensitive behavior.

## Reflection journal and local data architecture

### Storage boundaries

- **IndexedDB**: long-form journal entries and linked references, using the existing `lib/study/storage.ts` schema and migration/event model.
- **localStorage**: small preferences and bounded, non-text summary records only. The first new record uses `dharma.wellbeing.study-sessions.v1` and stores `{ id, day, minutes }` for sessions a user explicitly completes.
- **No server database for personal practice**: no account requirement and no silent synchronization. Public scripture and curated discovery data remain static and cacheable.
- **Backup**: the existing `lib/backup.ts` prefix allowlist already includes `dharma.*`; verify new keys are included in export/import tests whenever the schema changes. Imported values must keep the existing size and type checks.
- **Deletion**: clearing practice data must also clear the new session ledger and reading-day summary. The ledger keeps at most 400 sessions; the dashboard displays only the last 28 local calendar days.

### Ledger schema

```ts
interface StudySessionRecord {
  id: string;
  day: string; // local YYYY-MM-DD
  minutes: number; // integer, 1..180, explicitly confirmed by the reader
}
```

No scripture ID, URL, mood, search string, note, or exact start/end timestamp is stored in this record. A timer pauses when its page becomes hidden. Short sessions can end without being recorded. The metric describes time the user chose to set aside, not measured attention or comprehension.

### Wellbeing dashboard definitions

- Reading consistency: unique local dates with a chapter-open record in the latest 28 days.
- Reflection frequency: local dates with non-empty reflection text in the latest 28 days; display a count only, never reflection contents.
- Wisdom sessions: completed, user-confirmed timer sessions in the latest 28 days.
- Study hours: total user-confirmed timer minutes in the latest 28 days, displayed as time, never as a goal or ranking.

No scoring, target, red/green judgment, streak, lifetime ranking, or peer comparison is shown. An empty state is neutral. The dashboard remains `noindex` because its interface summarizes personal activity after hydration.

## Accessibility, mobile, performance, and SEO

- **Accessibility:** semantic headings; bilingual `lang` labels; visible keyboard focus; 44px minimum touch targets; screen-reader status only for meaningful timer state changes; timer digits are not announced every second; preserve reduced-motion settings; test zoom/reflow, contrast, VoiceOver and NVDA.
- **Mobile:** one-column reading flow, safe-area-aware controls, no bottom overlay obscuring scripture, no horizontal mode tabs that hide key actions, and return to the same passage after closing a tool.
- **Performance:** keep scripture text in static HTML; load journal, audio, and optional tools on demand; avoid adding a large state-management or animation dependency; use one interval only while the explicit timer runs.
- **SEO:** index public scripture, topic, and educational pages with canonical URLs and bilingual metadata. Set personal dashboards and private practice surfaces to `noindex`; never serialize local notes or activity into static HTML.
- **Security:** treat journal text as sensitive local content; escape display; validate imports; never send journal data or timer entries to analytics, ad networks, or generative models.

## Implementation in this release

| File | Change |
|---|---|
| `lib/wellbeing-ledger.ts` | Added a bounded, typed, local-only session ledger and rolling 28-day summary with defensive parsing |
| `app/components/dashboard/WellbeingSnapshot.tsx` | Added a voluntary timer, pause-on-hidden behavior, privacy disclosure, and four non-comparative wellbeing summaries |
| `app/practice/dashboard/DashboardClient.tsx` | Replaced streak/total/bookmark/note/progression score panels; removed the activity stream and external wisdom feed from this dashboard; simplified pathway cards |
| `app/components/dashboard/ScriptureCompletionCard.tsx` | Kept local return-to-reading links and removed distinct-verse activity counts |
| `app/practice/dashboard/page.tsx` | Added noindex metadata for the personal dashboard |
| `app/practice/PracticeDashboard.tsx` | Simplified a first visit to a daily verse, reflection, and reading plan; grouped optional tools by reading, pausing, reflecting, and keeping in view. Previously saved tool choices are preserved, and new choices remain local to the device. Collapsed alternate compressed transfer below the standard JSON backup, with a clear not-encrypted notice. |
| `app/practice/dashboard/DashboardClient.tsx` | Removed duplicate daily-verse, year-in-review, pathway, collection, and practice-preview feeds; kept the wellbeing summary, one private study hub, and the shared backup controls. Added a direct link to the practice tools. |
| `app/components/daily/DailyDharmaDashboard.tsx` | Removed recommendation promotion and completion percentages; retained plain continue links, history controls, and local saved-item access. Removed its unvalidated duplicate import/export controls in favor of the shared versioned backup UI, and removed unsupported editorial-review claims from onboarding labels. |
| `app/components/SadhanaPortability.tsx` | Corrected the privacy disclosure: the sync code and `.dharma` file use GZIP compression and are not encrypted. |
| `app/components/practice/PrivacyLockBanner.tsx`, `app/components/DailyPracticePreview.tsx`, `app/components/SiteFooter.tsx`, `app/components/BackupRestore.tsx` | Replaced absolute “100% private / zero tracking” marketing claims with concrete local-storage, account, and ad-free statements. Clarified that the optional PIN is a screen lock, and exported JSON is readable and unencrypted. |
| `scripts/test-wellbeing-ledger.ts` | Added test coverage for 28-day boundaries, malformed storage, reflection counting, and explicit sessions |
| `package.json` | Added `npm run test` as a small, named aggregate and `test:wellbeing` |
| `lib/useReaderSettings.ts` | Centralized shared reading preferences, migrated existing chapter-reader values, and merged same-tab updates safely |
| `app/components/reader/ReaderSettingsPanel.tsx` | Reused the accessible preferences sheet for chapter and verse reading, including translations, commentary, theme, typography, and chapter spotlight |
| `app/components/FullChapterVerses.tsx` and `app/components/VerseCard.tsx` | Applied shared chapter font, line-spacing, translation visibility, commentary, and spotlight preferences while retaining inline private verse notes |
| `app/components/reader/ReaderLayers.tsx` | Applied the shared study-layer preference to explanations, word meanings, reflections, and related study material while keeping source text and translations available |
| `app/components/MobileFocusMode.tsx` | Shared focus-reader type and layer preferences; moved mobile typography controls into its scrollable options panel to prevent header overflow; added focus trapping and focus restoration |
| `components/ui/PranaCapsule.tsx` | Routed its spotlight action through the shared preference store |
| `lib/study/journal-backup.ts` | Added a versioned, bounded JSON journal schema; validates each entry and passage reference; imports only journal entries from legacy full-study V2 files |
| `lib/study/storage.ts` | Added journal-only atomic merge/replace restore and clear operations; broadcasts store/action metadata across tabs without sending reflection text |
| `app/practice/journal/JournalClient.tsx` | Added JSON export/import, merge or journal-only replace, explicit journal clear, privacy disclosure, and cross-tab list refresh |
| `app/components/reader/VerseReader.tsx` | Added an on-demand “Reflect privately” action that opens the journal editor with the current source passage linked |
| `scripts/test-journal-backup.ts` | Added schema round-trip, legacy V2 extraction, and malformed/import-boundary checks |
| `app/privacy/page.tsx` | Clarified that the journal has a separate JSON backup and that backup files contain readable, unencrypted private data |
| `package.json` | Included journal-backup validation in the standard test command |
| `data/life-discovery-intents.ts` | Centralized 21 bilingual life-question, situation, and practice entries; separated quick picks and neutral SEO labels from search synonyms |
| `data/search-intent.ts` | Derived SEO labels from the same curated records so navigation and topic destinations cannot drift independently |
| `app/wisdom-for-life/WisdomClient.tsx` | Replaced 20 overlapping problem links plus 13 feeling chips with 13 distinct, explicitly chosen study filters and mapped search terms |
| `app/wisdom-for-life/page.tsx` | Removed healing language and clarified that the page offers study and reflection, not diagnosis or treatment |
| `data/wisdom-for-life.ts` | Corrected the worry topic's Yoga Sutra attribution; the Gita's 6.26 and 6.35 are described separately and listed as sources |
| `scripts/test-life-discovery.ts` | Validated unique intents, topic destinations, passage/source presence, SEO labels, and the corrected Gita explanation |
| `package.json` | Added `test:life-discovery` to the standard test command |
| `data/reading-journeys.ts` | Reframed the unreviewed anxiety course as a Gita study without relief promises; added one approval gate for search indexing |
| `app/learn/journeys/JourneysClient.tsx` | Removed streaks, lesson totals, milestone dots, personalized recommendations, and the default stress/anxiety course promotion; surfaced editorial review status |
| `app/learn/journeys/[id]/JourneyClient.tsx` | Removed streak, completion scoring, and celebration UI; added an editorial-draft notice, local read-marker controls, and a clear pause/exit action |
| `app/learn/journeys/[id]/page.tsx` and `app/learn/journeys/page.tsx` | Applied `noindex` while journeys remain unapproved and clarified page metadata |
| `lib/sitemap-sections.ts` | Excluded the unapproved journey index and detail routes from the sitemap |
| `scripts/test-journey-wellbeing.ts` | Guarded draft indexing, stress-course claims, the invalid topic link, review labels, and non-score journey UI |
| `package.json` | Added `test:journey-wellbeing` to the standard test command |

Existing reading, journal, learning paths, backups, and practice pages remain in place. The discovery work adds no new scripture or therapeutic claims. Existing life-topic interpretations remain subject to knowledgeable human review.

## Rollout roadmap

1. **Foundation (this slice):** evidence/claims boundary, local wellbeing snapshot, intentional timer, remove dashboard scoring, private-route noindex, unit checks.
2. **Reading modes (implemented):** chapter and verse reading use one accessible preferences sheet for the global theme, typography, language layers, commentary, and chapter spotlight. Those typography and layer choices carry into mobile focus, while the floating capsule shares the spotlight setting. Private notes remain attached to each verse. On a 365 × 617 mobile viewport, the focus-reader options were checked for fit, and closing the focus dialog restored focus to its launch button. Automated checks: typecheck and project tests pass; lint reports three pre-existing hook-dependency warnings in `FullChapterVerses` and `CoursePageClient`, with no errors.
3. **Reflection system (implemented):** a verse can open a lazily loaded private journal editor with its source reference attached. Journal JSON includes schema version and export time, validates bounded records, and can merge or replace only journal entries. Earlier full-study V2 files import their journal records only. Clear and export controls sit beside private writing; local same-tab events and cross-tab BroadcastChannel/storage signals refresh the entry list without sharing reflection text. Typecheck and the full project tests pass; lint reports three existing hook-dependency warnings. Isolated browser checks verified verse linking, two-tab refresh through both BroadcastChannel and storage fallback, merge/replace, JSON download schema, and journal-only clear. The final static build generated 8,053 routes.
4. **Discovery by life question (foundation implemented; editorial review remains):** 21 bilingual question, situation, and practice intents now share one map to existing topics. Quick picks are explicit user choices; typed search is not stored or used to infer a reader's state. Automated checks confirm each target has passages and citations. The stress/worry page no longer calls ordinary worry a diagnosis or misattributes that framing to Yoga Sutra 1.33: the Gita discussion is now anchored in 6.26 and 6.35. A knowledgeable human still needs to review the interpretation and source rationale for each existing topic page before the collection can be called fully reviewed.
5. **Mindful reading and practice consolidation (journey and dashboard slices implemented):** learning journeys no longer use streaks, progress scores, milestone dots, or auto-selected recommendations. A current reading can be resumed locally; the reader can mark passages read, clear those markers, and leave without losing their place. Unapproved journeys are labeled and excluded from search indexing and the sitemap. On a fresh device, the practice page starts with a verse, reflection, and reading plan; optional tools are grouped by purpose and individually selectable. Existing local tool selections are preserved. The study dashboard no longer duplicates the daily verse, year-in-review counts, pathways, collections, or practice preview, and the unvalidated secondary backup path has been removed. Further cross-route audit and manual accessibility review remain.
6. **Research and evaluation:** conduct consent-based usability sessions, test comprehension and perceived pressure, publish no health-effect claim until a suitable prospective study supports it. Evaluate usefulness with user interviews rather than background engagement telemetry.

## Release gates

- No accidental network request includes local reflection, session, mood, or search data.
- `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` pass.
- Manual mobile review: keyboard/assistive-tech control, reduced motion, theme contrast, hidden-tab timer pause, interrupted timer, restore/import, and clear-data flows, including journal merge/replace across tabs.
- Text review: canonical content unchanged; no therapeutic promises; all published cross-scripture mappings have source and editorial rationale.

### Phase 4 source check

The wording change was checked against the Gita Supersite's Bhagavad Gita 6.35 text and translation, and the Sanskrit Yoga-sutra 1.33 with Bhāṣya. Yoga-sutra 1.33 concerns cultivating friendliness, compassion, joy, and equanimity toward different experiences; the term *citta-vikṣepa* appears in 1.30, with a one-pointed practice named in 1.32. The former topic sentence incorrectly called chronic worry a diagnosis in 1.33, so that cross-text attribution was removed. [Gita Supersite, Bhagavad Gita 6.35](https://www.gitasupersite.iitk.ac.in/srimad?etadi=1&etassa=1&etgb=1&etpurohit=1&etradi=1&etsiva=1&etssa=1&field_chapter_value=6&field_nsutra_value=35&language=dv&setgb=1), [Yoga-sutra 1.33 with Bhāṣya (Sanskrit)](https://www.wisdomlib.org/hinduism/book/yoga-sutra-with-bhasya-sanskrit/d/doc1216830.html), [Yoga-sutras 1.30–32](https://www.wisdomlib.org/hinduism/book/yoga-sutras-study/d/doc628711.html).
