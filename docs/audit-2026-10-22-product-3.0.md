# Dharma Granth: worst-case audit and 3.0 blueprint

Audit date: 22 October 2026. Evidence comes from the live site (https://dharmagranth.in), checked at desktop width and a 375×812 mobile viewport, and from the codebase at `deploy/scripture-opening-ux`. Where something was not measured, it says so. Search-volume figures are directional estimates, not keyword-tool data.

---

## 1. Executive summary

Dharma Granth has something few spiritual sites have: real depth. It has 67 texts, 234,193 verses, honest source labelling, bilingual content, no ads and a privacy-first design. The problem is not content. **The product buries its best asset, the verse, under its own features.**

- **Too much stands before the reading.** On mobile, the first verse of Gita chapter 2 is 1.5 screens down, behind a hero, five action chips and a collapsed "About this chapter" panel. On the verse page for Gita 2.47, the Sanskrit sits *below* a selector of 4 levels by 4 personas (16 combinations) and an editorial "core shift" headline. A floating ॐ button covers the first word of the verse.
- **The homepage is a brochure.** It is about 12.5 screens tall, with 10 sections, 44 buttons and 90 links. It has two separate mood pickers and shows the verse of the day twice. It also uses internal jargon such as "Catalogue records 700 verses", "counted from the library files" and "review-required".
- **The product has no clear shape.** There are 62 routes. About 16 of them overlap as hubs (`/guidance`, `/topics`, `/wisdom-for-life`, `/journeys`, `/learn`, `/start`, `/start-here`, `/daily`, `/daily-verse`, `/dashboard`, `/desk`, `/saved`, `/bookmarks`, `/journal`, `/practice`, `/collections`). A user cannot form a mental model: where is "my stuff"? Where do I go when I'm anxious?
- **The retention systems exist but are scattered.** Saved items, notes, sadhana, the journal and the dashboard all live in localStorage, which suits the privacy rule, but there is no single "Continue" loop.
- **SEO covers only a sliver of the library.** The sitemaps list 2,638 verse pages out of 234,193 verses, and there are about 12 topic hubs. The big intent clusters (anxiety, fear, anger, exams, purpose) are almost untouched as landing pages.

**The 3.0 thesis:** become *the calmest place on the internet to read one verse*, and build everything else as quiet doors into that verse. Three surfaces: **Read** (scripture → chapter → verse), **Seek** (feelings and questions → verses), **Mine** (continue, saved, notes, practice). Everything else folds into these three or is cut.

---

## 2. Critical risks

| # | Risk | Severity | Evidence | Consequence |
|---|---|---|---|---|
| 1 | The verse is buried behind chrome and options | **Critical** | Chapter: first verse at 1.5 screens on mobile, 2.6 on desktop. Verse page: a 16-combination selector before the Sanskrit; 117 buttons; about 25 sections (about 21 mobile screens) | Readers leave before reading. It defeats the site's own promise of "calm" |
| 2 | Homepage overload and duplication | **Critical** | 12.5 screens; two mood pickers; verse of the day twice; 1 MB transferred, 367 KB JS, 39 scripts | No clear first action; slow on mid-range Android |
| 3 | Route sprawl | **Critical** | 62 routes, about 16 overlapping hubs; the primary nav item `/bhagavad-gita/` 301-redirects to `/scripture/bhagavadgita/` | Lost users, diluted SEO, and a team maintaining duplicates |
| 4 | Mobile chrome and an overlay over text | **High** | Top nav 57px, floating capsule 58px and bottom tabs 57px take about 21% of the screen; the ॐ button overlaps the Sanskrit; 83 tap targets under 32px | Mis-taps; elderly users struggle; the text you came for is covered |
| 5 | Trust leaks through internal language | **High** | "Catalogue records 700 verses", "review-required", "Editorial, not scripture" shown before the verse; the H1 reads "Dharma Granthधर्म ग्रंथ" run together | Looks unfinished. Skeptics read "review-required" as "unreliable" |
| 6 | SEO coverage of the library | **High** | 2,638 verse URLs in the sitemaps out of 234k verses; about 12 topic hubs | Huge long-tail search demand goes elsewhere |
| 7 | No single retention loop | **High** | Saved, Sadhana, Journal, Dashboard and Desk are separate | Users don't come back, because nothing pulls them back to *where they were* |
| 8 | Component bloat | **Medium** | `SiteNav.tsx` 1,264 lines, `VerseCard.tsx` 1,462, `FullChapterVerses.tsx` 1,665; 110 components | Every UX fix becomes risky and slow |

---

## 3. Phase 1: first-impression audit

**Within 5 seconds (desktop):** a warm orange gradient, "Dharma Granth / धर्म ग्रंथ", a search bar, four quick-search chips and two buttons. It is understood as "a scripture library with search". That part works.

**Within 5 seconds (mobile):** the same hero, then the cards begin. The value proposition ("calm, ad-free, sourced") is clear but generic. Nothing says *why here and not a Gita PDF*.

| Question | Answer | Severity |
|---|---|---|
| Understood immediately | Scripture library, search, Gita | – |
| Confusing | Two mood pickers ("Find scripture guidance for your state of mind" and "How are you feeling right now?"); "Dharma Guide" versus search versus "Ask"; the meaning of "Catalogue records 700 verses" | High |
| Feels old | Long marketing-style sections, centred hero text, card grids of everything, bilingual labels doubling every heading | Medium |
| Feels modern | Theme switcher, the mood pathways idea, verse of the day, privacy-first local state | – |
| Why users leave | Too many choices and no single "start reading" moment; slow scroll; the first click lands on another menu, not on text | Critical |
| Why users stay | Quality of the verse content and explanations; no ads; the bilingual depth | – |
| Memorable? | Not yet. Nothing ownable: no signature interaction, no "the site where…" | High |

**Typography and hierarchy:** three families (Inter, Merriweather, Noto Sans Devanagari) are fine. But every heading is set twice ("Simple meaning / सरल अर्थ"), which doubles the visual load, and the hero subtitle has low contrast on the gradient. **Information density:** too high on the homepage and the verse page, appropriate on the scripture index (`/scripture/bhagavadgita/` is the best page on the site, with chapters visible almost at once).

---

## 4. Phase 2: worst-case journeys

**A. A new visitor wants to read the Gita.**
- The path: Home → "Start with the Bhagavad Gita" or the "Bhagavad Gita" nav item, which costs a 301 hop. The chapters list works.
- Chapter 2 has a hero, chips and a collapsed summary before verse 1.
- On the verse page, a selector matrix comes *before* the verse.
- **Friction:** 3 decisions before the first shloka.
- **Abandonment point:** the 16-option selector on the verse page.

**B. Someone searching for help with anxiety.**
- **Google:** there is no `/anxiety` landing page that ranks; `/wisdom-for-life/...` and `/guidance` exist, but each competes with the other.
- **On the site:** two mood pickers lead to different destinations; "I feel stressed" is good, but the user then lands on a hub with more choices instead of *one verse, read now*.
- **Dead end:** no "I'm still anxious, show me another" loop; no breathing or pause moment.

**C. A student preparing for exams.**
- There is no exam-shaped entry: no "Gita for focus before exams", no "chapter summaries in 2 minutes", no printable or offline summary list.
- Learn and Practice exist, but nothing frames them as *study*.
- **Friction:** has to know where to look.

**D. Someone wanting daily guidance.**
- The verse of the day is good but appears twice on the homepage.
- There is no opt-in reminder and no "today's verse" that remembers they read yesterday's.
- **Retention gap:** no daily return loop.

**E. A mobile-only user.**
- About 21% of the screen is fixed chrome.
- Floating buttons cover the text, and 83 tap targets are small.
- A chapter page is about 51k px long (lazy-loaded on mobile).
- The share, print and WhatsApp chips are useful, but they come *before* the content.

**F. An elderly Hindi reader.**
- **Good:** the Hindi meaning and Devanagari type are present, and a font-size control exists.
- **Bad:** English-first labels everywhere (the nav is "Home, Scriptures, Learn, Sadhana…"), small targets, the overlays, and mixed-language headings.
- **Missing:** a "Hindi-first interface" mode, and an audio-first mode (listen to the chapter) placed *above* the fold rather than as a chip.

**G. A first-time international user.**
- **Good:** an English translation is present, and the quick chip "fear" works.
- **Bad:** untranslated jargon (Sadhana, Panchang, Prakarana, Khanda, "पारायण" on the reader capsule) and no glossary hover.
- **Missing:** a one-screen explainer of what the Gita is, why there are 701 verses, and how to read.

---

## 5. Phase 3: reading experience (the core fix)

### Current architecture (measured)
- **Scripture page:** hero → chapters. *Already good; keep it.*
- **Chapter page:** hero (2 screens' worth of chips on mobile) → "About this chapter" → a toolbar of language toggles and audio → 72 verses inline (desktop DOM: 187k px, 37k characters).
- **Verse page:** reader bar → Save/Note/Copy/Open → depth selector × persona selector → "core shift" (editorial) → Sanskrit → 20 or so more sections (word explorer, teaching flow, modern example, misunderstanding, try-this, pause, a "was this clear?" poll, visual demo, cross-references, related teachings, concepts…).

### Target architecture: Read → Chapter → Verse, everything else optional

**Rule 1: the first thing on every reading surface is scripture text.** No hero, chips, selectors or editorial lines above it.

**Rule 2: one layer of options, hidden by default.** All controls live in one "Aa" reading sheet: script, language, font size, theme, meaning depth.

**Rule 3: the depth is progressive, not chosen up front.**

**Chapter page (new):**
```
[sticky slim header: ← Gita  ·  Ch 2 Sankhya Yoga  ·  Aa  ·  ⋯]
2.1  Sanskrit (large)
     Hindi meaning (one line, toggleable)
     English (toggleable)
     [tap verse → verse page]
2.2  …
— end of chapter: "Next: Chapter 3 →" · "Chapter summary" (collapsed) · Listen ▶
```
- The hero is gone. Chapter number and title fit in a 48px sticky header.
- The summary, audio, print, WhatsApp and share actions move under ⋯ (the overflow menu) and to the end of the chapter.
- Render verses in batches of 10 (virtualised or windowed); desktop no longer ships a 187k-px DOM.

**Verse page (new order):**
1. Sanskrit, with the transliteration toggle remembered.
2. Hindi meaning, then English meaning (each a single tap to hide).
3. **"Understand it":** the व्याख्या. One depth by default, with a small "deeper ▾" disclosure, not a 4×4 matrix. Personas become a *setting* in Aa, not a per-page choice.
4. A collapsed accordion: Word-by-word · Context · Common misreading · Try this today · Research note (AI-labelled) · Related verses.
5. A footer: ← Prev · Chapter list · Next →, plus Save and Note.

**Remove from the verse page:**
- The "Was this explanation clear?" poll. Ask once a week, not on every verse.
- The visual demonstration. Keep it only where one exists, as an accordion item.
- "Content status" and "Editorial, not scripture" as headings. Use a small "AI-drafted ⓘ" badge inline instead.

**Floating elements:** delete the ॐ floating button and the floating capsule on reading pages. Keep **one** fixed element on mobile: the bottom bar with Prev · ☰ Chapter · Aa · Next. The global tab bar hides while reading and returns on scroll-up.

**Implementation:**
- `app/scripture/[id]/chapter/[chapterId]/chapter-view.tsx`: drop the hero and move the chips into a `ReaderOverflowMenu`.
- `app/components/FullChapterVerses.tsx`: split it into `ChapterVerseList` (windowed) and `VerseRow`.
- `app/components/VerseCard.tsx`: split it into `VerseText`, `VerseMeanings`, `VerseExplain` and `VerseExtrasAccordion`. Delete the depth-by-persona grid and move the persona setting into the Aa sheet; the code already has a `ReaderLayers` concept.
- CLAUDE.md rule 1 (crawler safety) is unaffected: the verse text is server-rendered first, which is *better* for SEO.

---

## 6. Phase 4: retention

**Why return tomorrow?** Today: the verse of the day, and maybe a saved item. Too weak.

| System | Status | 3.0 design |
|---|---|---|
| Continue reading | Partial (localStorage) | **"Continue" card at the top of Home and Mine**: last scripture, chapter and verse, plus % of the chapter |
| Daily verse | Exists, duplicated | One "Today" card. "Read yesterday's?" if the user missed it. Rotate by the user's chosen text |
| Reading history | Scattered | Mine → History, by day |
| Library / favourites | `/saved` and `/bookmarks` both exist | Merge into **Mine → Saved**. One store |
| Notes | Exists | Notes attach to verses; Mine → Notes; export (already required) |
| Progress | Partial | Per-chapter ring; "You've read 46/72 of chapter 2" |
| Streaks | Sadhana | **Gentle continuity, not streak pressure**: "7 days of reading this month", with no broken-streak shame |
| Reminders | None | Opt-in web push / installable PWA reminder at a chosen time. No email (zero-account rule) |
| Collections | `/collections` exists | User-made lists ("Verses for exams"), shareable as a URL of verse ids |
| Learning paths | `/journeys`, `/learn`, `/start-here` | **One "Paths" system**: 7-day Gita intro, Upanishads in 21 days, Gita for students. Each day is one verse plus a 2-minute reflection |

**Retention roadmap:**
1. Continue card and merged Saved (P0).
2. Today card and paths (P1).
3. PWA reminders and progress rings (P1).
4. Private yearly "Your year in verses" summary, rendered locally (P2).

---

## 7. Phase 5: competitive benchmark

| Product | What they do that we don't | Adapt as |
|---|---|---|
| **Sefaria** | Sources sheet, a linked commentary sidebar, text-first reading, open citations | A **commentary side panel** on desktop (verse left, explanations right); "Copy citation" in standard form |
| **Quran.com** | Instant verse reader, word-by-word on hover, recitation per verse, a clean ayah URL | Word-by-word hover on Sanskrit; **per-verse audio**; URLs like `/gita/2/47` |
| **YouVersion** | Reading plans, verse images, highlight colours, daily reminders | Paths, verse cards (the share studio exists), **highlights** |
| **Wikipedia** | Fast, dense but scannable, hover previews of links | **Hover previews** for verse references ("see Katha 1.2.18") |
| **Headspace / Insight Timer** | Mood → one session; a calm onboarding | Mood → **one verse plus a 60-second pause**, not a hub |
| **Duolingo** | A tiny daily unit, visible progress, gentle reminders | A 2-minute daily verse unit; no hearts, no streak guilt |
| **Kindle** | Resume exactly; highlights; X-Ray glossary | Resume to the verse; a glossary for terms like yoga, karma, sattva |
| **Medium** | Reading time, clean typography | "4 min read" on chapter summaries |
| **Goodreads** | Shelves, "currently reading" | Mine → "Reading now" across texts |
| **Notion** | One-place personal workspace | Mine = Saved + Notes + Paths + History |
| **Spotify** | "Made for you", listen while doing something else | **Listen mode** with a background-audio chapter player |

**Biggest gaps:**
- per-verse audio
- a single personal space
- reading plans
- hover previews
- recognisable short URLs
- topic landing pages

---

## 8. Phase 6: Gen Z

**Would a 16–25-year-old enjoy it?** They'd respect it, then leave. It reads as *academic and heavy*: long pages, many labels, English-and-Hindi doubling, and no feeling of the site responding to *them*.

Respectful upgrades:
1. **"One verse for how you feel"**: a single tap from the home screen to a verse, with "another one" and "save" as the only actions.
2. **Shareable verse cards** in 9:16 story format. The studio exists; make it one tap from any verse.
3. **Plain-language toggle** ("Explain like I'm new"). It already exists as the सरल level; surface it as the default for new users.
4. **Micro-paths**, such as "Gita for exam stress (5 days)" and "Dealing with anger (3 days)".
5. **Audio**: a 60-second explanation per famous verse.
6. **Dark mode by default at night** (themes exist; make it automatic).

Avoid: leaderboards, XP, confetti, infinite feeds and notification nagging.

---

## 9. Phase 7: SEO

### Diagnosis
- **Indexable verse pages:** 2,638 of 234k. This is deliberate because of the Cloudflare Pages file limit (20k files), but the choice of *which* verses get pages should be driven by search demand. Today it is driven by curation.
- **Topic hubs:** about 12 under `/wisdom-for-life/[slug]`, plus overlapping `/guidance` and `/topics`. **Consolidate into one hub type.**
- **Redirect hop:** the nav links `/bhagavad-gita/`, which 301s. Link straight to the canonical page, or make `/bhagavad-gita/` the canonical, which is the better keyword.
- **H1 on the homepage:** "Dharma Granthधर्म ग्रंथ" runs together. Split it into separate elements per CLAUDE.md rule 3.
- **Verse titles** are good ("Bhagavad Gita 2.47 Meaning in Hindi & English | …"). Keep them.
- **JSON-LD:** present but un-typed at the top level (probably an `@graph`). Validate it in Google's Rich Results test. Add `Article` and `BreadcrumbList` for verse pages, and `FAQPage` for topic hubs.

### Topic page architecture
One template, `/topics/[slug]/` (with 301s from `/wisdom-for-life/*`, `/guidance/*`). Sections, in order:
1. H1, e.g. "What the Bhagavad Gita says about fear", with a Hindi H1 alternate.
2. The single best verse, shown in full.
3. 5–8 more verses with a one-line "why".
4. A short व्याख्या-style reflection (300 words).
5. A practice (2 minutes).
6. Related topics.
7. An FAQ (FAQPage schema).

Each verse links to its verse page; each verse page links back to its topics.

### 100+ hub opportunities (slug → cluster; estimated monthly global search potential across English and Hindi variants: H = 10k+, M = 1–10k, L = <1k)

**Emotions (Gita and Upanishads):**
1. `/gita-on-fear` H
2. `/gita-on-anxiety` H
3. `/gita-on-anger` H
4. `/gita-on-depression` H
5. `/gita-on-stress` H
6. `/gita-on-grief` M
7. `/gita-on-loneliness` M
8. `/gita-on-jealousy` M
9. `/gita-on-overthinking` M
10. `/gita-on-guilt` M
11. `/gita-on-ego` M
12. `/gita-on-greed` M
13. `/gita-on-desire` M
14. `/gita-on-attachment` H
15. `/gita-on-heartbreak` M
16. `/gita-on-failure` H
17. `/gita-on-confusion` M
18. `/gita-on-hope` M
19. `/gita-on-peace-of-mind` H
20. `/gita-on-happiness` H

**Life and work:**
21. `/gita-on-success` H
22. `/gita-on-hard-work` H
23. `/gita-on-discipline` M
24. `/gita-on-procrastination` M
25. `/gita-on-leadership` M
26. `/gita-on-decision-making` M
27. `/gita-on-career` M
28. `/gita-on-money` M
29. `/gita-on-time` M
30. `/gita-on-patience` M
31. `/gita-on-self-control` M
32. `/gita-on-focus` M
33. `/gita-on-motivation` H
34. `/gita-on-competition` L
35. `/gita-on-criticism` L

**Students:**
36. `/gita-for-students` H
37. `/gita-for-exams` M
38. `/gita-on-concentration` M
39. `/gita-on-education` M
40. `/gita-quotes-for-students` H
41. `/gita-on-results` M
42. `/gita-on-hard-times` M

**Relationships:**
43. `/gita-on-love` H
44. `/gita-on-marriage` M
45. `/gita-on-family` M
46. `/gita-on-friendship` M
47. `/gita-on-parents` M
48. `/gita-on-forgiveness` M
49. `/gita-on-trust` L
50. `/gita-on-betrayal` M
51. `/gita-on-relationships` H

**Big ideas:**
52. `/gita-on-karma` H
53. `/gita-on-dharma` H
54. `/gita-on-death` H
55. `/gita-on-soul` H
56. `/gita-on-rebirth` M
57. `/gita-on-god` H
58. `/gita-on-devotion` M
59. `/gita-on-meditation` H
60. `/gita-on-yoga` H
61. `/gita-on-mind` H
62. `/gita-on-detachment` M
63. `/gita-on-duty` H
64. `/gita-on-purpose-of-life` H
65. `/gita-on-truth` M
66. `/gita-on-equanimity` M
67. `/gita-on-surrender` M
68. `/gita-on-faith` M
69. `/gita-on-knowledge` M
70. `/gita-on-food` M
71. `/gita-on-nature-gunas` M

**Krishna and figures:**
72. `/krishna-on-duty` M
73. `/krishna-on-love` M
74. `/krishna-teachings` H
75. `/krishna-quotes` H
76. `/arjuna-dilemma` M
77. `/what-krishna-said-to-arjuna` M

**Hinduism-wide:**
78. `/hinduism-on-anxiety` M
79. `/hinduism-on-death` H
80. `/hinduism-on-karma` H
81. `/hinduism-on-meditation` M
82. `/upanishads-on-self` M
83. `/upanishad-quotes` H
84. `/vedanta-explained` M
85. `/what-is-moksha` H
86. `/what-is-dharma` H
87. `/what-is-atman` M
88. `/what-is-brahman` M
89. `/maya-meaning` M
90. `/om-meaning` H

**Famous verses** (each a strong single-verse landing page):
91. `/gita-2-47` H
92. `/gita-4-7` H
93. `/gita-18-66` M
94. `/gita-2-20` M
95. `/gita-9-22` M
96. `/gita-6-5` M
97. `/satyameva-jayate-meaning` H
98. `/tat-tvam-asi-meaning` M
99. `/aham-brahmasmi-meaning` H
100. `/asato-ma-sadgamaya-meaning` H
101. `/sarve-bhavantu-sukhinah-meaning` H
102. `/vasudhaiva-kutumbakam-meaning` H

**Hindi-first twins** (same pages, Hindi H1 and slug variants):
103. `/गीता-में-भय` M
104. `/गीता-में-क्रोध` M
105. `/गीता-सार` H
106. `/गीता-के-उपदेश` H
107. `/गीता-श्लोक-अर्थ-सहित` H

**Daily and festivals:**
108. `/gita-quote-of-the-day` M
109. `/janmashtami-gita-verses` M
110. `/gita-jayanti` M

The famous-verse pages 91–96 should be the existing verse pages under short canonical aliases. That is a cheap win with high volume. **Choose the 20k indexable verse pages by demand:** the Gita (all 701), principal Upanishads, famous mantras, and verses mapped to topics. Then retire low-demand Purana verse pages from static export, keeping them client-rendered and `noindex`.

---

## 10. Phase 8: donation and sustainability

`/contribute` exists with UPI and QR, and states that the UTR is the receipt. That is honest. I audited this from code, not the live flow.

Ethical architecture:
1. **Placement:**
   - One quiet line at the *end* of a chapter: "This chapter was read 1,2xx times this month. Help keep it free →"
   - One footer link.
   - Never mid-reading, never as a popup.
2. **Trust page:**
   - What it costs (hosting, editorial review, audio).
   - Where the money went (a monthly ledger).
   - Who runs it.
   - That there are no ads and no data sale.
3. **Friction:**
   - UPI deep link, QR, and card through a reputable gateway for international donors.
   - Preset amounts in INR and USD.
   - Optional "dedicate this to someone", in dignified wording.
4. **Recognition:** an optional name on a supporters page; no badges in the reading UI.
5. **Recurring:** monthly UPI autopay or card, framed as "sponsor a text" (e.g. "sponsor the Katha Upanishad audio").

---

## 11. Phase 9: discovery engine

**Today:** quick chips, two mood pickers, a Dharma Guide, search, topics and wisdom-for-life. There are many doors and no engine behind them.

**Design (all local, zero-account):**
- **Inputs:**
  - an explicit feeling (fear, anger, confusion, grief, loneliness, restlessness, purpose)
  - free-text search
  - the current verse
  - saved and read history (local)
- **Knowledge graph (already partly in `lib/`):** verse ↔ topic (`wisdom-verse-topics.ts`), verse ↔ concept, verse ↔ cross-reference. Make one table: `verse_id, topic, weight, reason_hi, reason_en`.
- **Feeling flow:**
  1. One verse (highest weight, not yet read).
  2. A 60-second pause (breath plus one reflective line).
  3. "Another verse" / "Read the chapter" / "Save".
  4. After 3 verses: "A path for this" (a 3–7 day micro-path).
- **Search:**
  - Typo-tolerant and transliteration-aware. "karmanye", "कर्मण्ये" and "karmanyevadhikaraste" should all resolve.
  - Search by reference (`2.47`, `gita 2 47`) jumps straight to the verse.
  - Results are grouped as Verses · Topics · Texts.
  - Ship a prebuilt index per language (the `search-index` route exists) using a small engine (e.g. MiniSearch) loaded on first focus.
- **Related verses** at the end of every verse: 3 cards, each with a reason ("also about fear", "explains the same word").

---

## 12. Phase 10: Dharma Granth 3.0

**Vision:** *The calmest, most trustworthy place in the world to read and live Sanatan wisdom, one verse at a time.*

**UX philosophy:**
1. Text first.
2. One decision at a time.
3. Calm by default, depth on request.
4. Private by design.
5. Honest about sources.
6. Bilingual without doubling the noise. The interface follows the reader's chosen language; the other language is a tap away.

**Information architecture (3 surfaces plus a utility):**
```
Read   /scriptures  → /[text]/ → /[text]/[ch]/ → /[text]/[ch]/[v]/
Seek   /topics (feelings, questions, life areas) · /paths · search
Mine   /me  (Continue · Saved · Notes · Paths · History · Practice) — localStorage + export
—      /panchang, /festivals, /about, /contribute (footer/utility)
```
Map the existing 62 routes into these. Merge:
- `/guidance`, `/wisdom-for-life`, `/topics` → `/topics`
- `/journeys`, `/learn`, `/start`, `/start-here` → `/paths`
- `/dashboard`, `/desk`, `/saved`, `/bookmarks`, `/journal`, `/practice` → `/me`

Keep 301s for every old URL.

**Navigation:**
- **Desktop:** Read · Seek · Mine · 🔍 · Aa · ☀. The Panchang moves to the utility menu.
- **Mobile:** a bottom bar of Home · Read · Seek · Mine · Search; the top bar shows only the logo and Aa.
- **While reading:** only the reader bar.
- English and Hindi labels stay separate elements (CLAUDE.md rule 3), but **show one language per the user's setting**. Render both in the DOM for crawlers; the visible one follows the setting.

**Homepage (one screen to act, three screens maximum):**
1. **Continue card** (returning users) or **Search plus "Start the Gita"** (new users).
2. **Today's verse**: one, with "Listen" and "Save".
3. **"How are you feeling?"**: 6 chips leading to the feeling flow.
4. **Paths**: 3 cards.
5. **Library**: 6 texts plus "All 67 texts".
6. Footer: trust line, contribute, sources.

Cut:
- the duplicate verse-of-day section
- the second mood picker
- the "Featured Scriptures" long descriptions (the Nitya Karma card alone is about 180 words)
- the "Explore by Category" and "Where this text comes from" blocks (move them to /about)

**Mobile-first:**
- At most 2 fixed bars.
- Every tap target at least 44px.
- Reading font 20px default on mobile.
- One-thumb reader bar.
- Pull-to-next-verse.
- Install as an app (PWA) for reminders and offline packs. `offline-packs.ts` exists; surface it.

**Personal dashboard (/me):**
- Continue (one big card).
- This month: verses read, days read (no streak guilt).
- Saved (with filters), Notes, Paths in progress.
- Export and import backup (already required by CLAUDE.md rule 5).

**Learning system (Paths):**
- Each day is one verse, a 2-minute reflection, one "try this" and a check-in.
- Paths are JSON (`data/paths/*.json`) built from existing verse ids.
- **Starter set:**
  - Gita in 18 days (one chapter a day, key verses)
  - 7 days of calm
  - Upanishads for beginners (Isha → Kena → Katha)
  - Gita for students
  - Anger, 3 days
  - Grief, 7 days

**Scripture reading system:** see Phase 3. Also:
- per-verse audio
- word-by-word hover
- desktop commentary sidebar
- a "Copy citation" button
- short URLs

**Search system:** see Phase 9.

**Contribution system:** see Phase 8.

---

## 13. Phase 11: prioritised roadmap

| P | Item | User | Business | SEO | Complexity | Recommendation |
|---|---|---|---|---|---|---|
| **P0** | Verse text first on verse and chapter pages (remove hero, selectors and editorial lines above the verse) | ★★★★★ | ★★★★ | ★★★ | M | Reorder `VerseCard` sections; move persona and depth into the Aa sheet |
| P0 | Remove the floating ॐ and capsule on reading pages; one reader bar on mobile | ★★★★★ | ★★ | – | S | Gate the floaters by route |
| P0 | Homepage cut to 5 sections; remove duplicates and jargon | ★★★★ | ★★★★ | ★★ | S | Edit `app/page.tsx` composition |
| P0 | Fix the homepage H1 concatenation; nav links to canonical URLs (no 301 hop) | ★★ | ★ | ★★★ | S | `HeroSection`, `SiteNav` |
| P0 | Tap targets ≥ 44px; fix hero-subtitle contrast | ★★★★ | ★ | ★ | S | CSS tokens |
| P0 | Continue-reading card on Home | ★★★★★ | ★★★★ | – | S | Read the existing localStorage history |
| **P1** | Route consolidation into Read / Seek / Mine with 301s | ★★★★ | ★★★★ | ★★★★ | M | `public/_redirects`, merged pages |
| P1 | Topic hub template plus the first 30 hubs from §9 | ★★★ | ★★★★★ | ★★★★★ | M | `/topics/[slug]` static; data in `data/topics/*.json` |
| P1 | Short famous-verse aliases (`/gita-2-47`) | ★★ | ★★★ | ★★★★ | S | Canonical points to the verse page, or make the alias canonical |
| P1 | Paths (5 starter paths) | ★★★★ | ★★★★ | ★★ | M | JSON plus one Path page |
| P1 | Merged Saved/Bookmarks into /me | ★★★★ | ★★★ | – | M | One localStorage schema, with migration |
| P1 | Search: reference jump and transliteration | ★★★★ | ★★★ | ★ | M | MiniSearch plus normaliser |
| P1 | Windowed chapter rendering | ★★★ | ★★ | ★ | M | Batches of 10, SSR first batch |
| P1 | Trust and transparency page plus end-of-chapter contribute line | ★★ | ★★★★ | ★ | S | `/about/funding` |
| **P2** | Per-verse audio (Gita first) | ★★★★★ | ★★★★ | ★★ | L | Recorded or TTS with review; CDN hosted (R2) |
| P2 | Desktop commentary sidebar; word-by-word hover | ★★★★ | ★★★ | ★★ | M | |
| P2 | PWA install plus opt-in reminders | ★★★★ | ★★★★ | – | M | Service worker; Notification API |
| P2 | Highlights and collections sharing | ★★★ | ★★★ | ★★ | M | URL-encoded verse lists |
| P2 | Demand-driven indexable verse set (20k) | ★ | ★★★★ | ★★★★★ | M | Build-time selection list |
| **P3** | Local "year in verses" summary | ★★★ | ★★★ | – | M | |
| P3 | Multi-language UI (Marathi, Tamil, Bengali…) | ★★★★ | ★★★★★ | ★★★★★ | L | |
| P3 | Community sources sheets (moderated) | ★★★ | ★★★ | ★★★ | L | |

---

## 14. Phase 12: codebase review

| Area | Finding | Recommendation |
|---|---|---|
| Component size | `FullChapterVerses.tsx` 1,665 lines, `VerseCard.tsx` 1,462, `SiteNav.tsx` 1,264 | Split by responsibility (see Phase 3). Target components under 300 lines |
| Route sprawl | 62 `page.tsx`; about 16 hubs overlap | Consolidate into 3 surfaces; a redirect map in `public/_redirects` (keep trailing slashes, CLAUDE.md rule 6) |
| State | 275 `localStorage` references across `app/` and `lib/` | One `lib/store.ts` with a versioned schema, migrations, and one export/import (rule 5) |
| Payload | Homepage about 1 MB transferred, 367 KB JS, 39 scripts | Make the home a server component, with islands only for search and the mood chips; defer the 3D/motion modules (`Experience3DSection`, `SacredSpace`) behind interaction |
| DOM | Desktop chapter 187k px, 37k characters, 73 `<article>` | Windowing; the first 10 verses rendered server-side for SEO |
| Fixed UI | Three fixed bars plus a floating button on mobile reading | One reader bar while reading |
| A11y | Concatenated H1; 83 small targets; overlay covers text; 117 tab stops on the verse page | Separate `lang` spans; 44px targets; roving tabindex in toolbars; accordions for extras |
| SEO | Nav links to redirecting URLs; un-typed JSON-LD; about 12 thin hubs | Canonical links; validate schema; topic template |
| Copy | Internal jargon in UI ("Catalogue records", "review-required") | A copy pass: move editorial status into an ⓘ tooltip |

---

## 15. The twenty-item lists

### Top 20 UX problems
1. Verse below hero and chips on chapter pages.
2. A 16-option selector before the Sanskrit on verse pages.
3. The floating ॐ covering the verse text.
4. Homepage 12.5 screens long.
5. Two mood pickers.
6. Verse of the day shown twice.
7. 62 routes and overlapping hubs.
8. `/saved` versus `/bookmarks` duplication.
9. `/start` versus `/start-here` versus `/journeys` versus `/learn`.
10. Every heading doubled in two languages.
11. Internal jargon in UI copy.
12. Action chips (Print, WhatsApp, Share) before content.
13. Editorial "core shift" line placed above scripture.
14. The "Was this clear?" poll on every verse.
15. No resume-reading on Home.
16. English-first nav for Hindi readers.
17. Untranslated jargon (Sadhana, Panchang, पारायण) for international users.
18. 117 buttons on one verse page.
19. Low-contrast hero subtitle.
20. Desktop chapter loads all 72 verses at once.

### Top 20 growth opportunities
1. Topic hubs (110 listed).
2. Famous-verse short URLs.
3. Hindi-first SEO twins.
4. Paths (shareable plans).
5. Story-format verse cards.
6. Per-verse audio.
7. PWA install.
8. Opt-in reminders.
9. Exam-season Gita hub.
10. Festival hubs (Janmashtami, Gita Jayanti).
11. A WhatsApp daily verse via the share studio.
12. School and college "Gita for students" pack.
13. Copy-citation for students and writers.
14. Embeddable verse widget for blogs.
15. Partnerships with satsang groups (collections).
16. International English landing pages ("What is the Gita?").
17. Upanishad mantra pages (Asato ma…, Sarve bhavantu…).
18. A newsletter-free "follow a path" model.
19. A transparent funding ledger, which builds trust.
20. Multi-Indian-language UI.

### Top 20 SEO opportunities
1. Topic template with FAQ schema.
2. Gita emotion hubs (fear, anxiety, anger…).
3. Famous-verse aliases.
4. All 701 Gita verses indexable (already).
5. Demand-driven selection of the 20k indexable verses.
6. Fix the nav 301 hops.
7. Split the H1 language spans.
8. Typed JSON-LD (Article, BreadcrumbList).
9. `hreflang`-style Hindi and English alternates where the content differs.
10. Internal links verse → topic → verse.
11. Hover previews that keep users on site, improving engagement signals.
12. "Meaning in Hindi" pages for top mantras.
13. Chapter summary pages with reading time.
14. Concept pages (karma, dharma, moksha) consolidated.
15. Image cards with alt text and Sanskrit.
16. Fast LCP on verse pages (text-first helps).
17. Sitemaps grouped by text with `lastmod`.
18. Remove thin duplicate hubs.
19. Glossary pages for Sanskrit terms.
20. Festival evergreen pages.

### Top 20 retention features
1. Continue card.
2. One Today verse.
3. Paths.
4. Progress rings per chapter.
5. Gentle monthly continuity (not streaks).
6. Merged Saved.
7. Verse notes.
8. Highlights.
9. User collections.
10. Reading history.
11. Opt-in reminders.
12. Offline packs.
13. Listen mode.
14. "Another verse for this feeling".
15. End-of-chapter "Next chapter" card.
16. Local "year in verses".
17. Reflection journal tied to verses.
18. Export and import backup.
19. Favourite translation and script remembered.
20. Night-time auto theme.

### Top 20 conversion improvements (to reading, saving, paths and contributing)
1. One primary CTA on Home ("Continue" or "Start the Gita").
2. Verse text at the top.
3. A "Read next verse" sticky action.
4. "Save" as one tap with no account.
5. End-of-chapter next-chapter card.
6. Feeling → one verse, not a hub.
7. Paths with start dates.
8. Short URLs for sharing.
9. Share cards one tap from the verse.
10. Contribute line at chapter end only.
11. A trust page linked from the contribute line.
12. INR and USD presets.
13. A UPI deep link on mobile.
14. Card payments for international donors.
15. "Sponsor a text" recurring option.
16. Supporters page (optional names).
17. Reduce choices on the first visit.
18. Remember language choice from the first tap.
19. Remove polls from verses.
20. Show reading time on summaries.

### Top 20 mobile improvements
1. Maximum of 2 fixed bars.
2. Hide the tab bar while reading.
3. Remove the floating ॐ.
4. 44px targets.
5. 20px reading font.
6. One-thumb reader bar.
7. Swipe for next or previous verse.
8. Collapse action chips into ⋯.
9. Windowed chapter lists.
10. Lazy-load motion and 3D modules.
11. Defer non-critical fonts.
12. PWA install.
13. Offline packs.
14. Background audio.
15. Safe-area insets checked on every fixed element.
16. Reduce the homepage to 3 screens.
17. Sticky chapter title of 48px or less.
18. Aa sheet as a bottom sheet.
19. Keep the language toggle in one place.
20. Test on low-end Android (4G throttled) as the release gate.

### Top 20 accessibility improvements
1. Split mixed-language headings into separate `lang` spans.
2. Fix the concatenated H1.
3. 44px targets.
4. Hero contrast at least 4.5:1.
5. No overlay over text.
6. Roving tabindex in toolbars (117 stops → about 15).
7. Accordions with `aria-expanded`.
8. A skip link to the verse text (exists; point it at the verse).
9. Visible focus rings on every theme.
10. Respect reduced-motion (partly done).
11. A screen-reader label for Sanskrit and transliteration (`lang="sa"`).
12. Audio with captions or text.
13. A font-size control that persists.
14. A line-height of at least 1.6 for Devanagari.
15. No colour-only status (AI badge also has text).
16. Landmarks: one `<main>`, `<nav>` labelled.
17. A dialog focus trap on the Aa sheet.
18. Error messages bilingual and announced.
19. Zoom to 200% without horizontal scroll.
20. An accessibility statement page.

---

## 16. Exact implementation strategy (first 6 weeks)

**Week 1 (P0 reading):**
1. In `VerseCard.tsx`, render order becomes VerseText → Meanings → Explain → Extras accordion. Move the depth and persona grid into a new `ReaderSettingsSheet`, stored in `lib/store.ts`.
2. Gate the floating ॐ and the capsule off for `/scripture/*`.
3. In `chapter-view.tsx`, replace the hero with `ChapterHeaderSlim`, and move Print, WhatsApp, Share and Listen into a `ReaderOverflowMenu` and an end-of-chapter block.
4. Verify CLAUDE.md rule 1: the verse text is in the static HTML. Add a build guard test.

**Week 2 (P0 home and nav):**
1. In `app/page.tsx`, keep the Hero (search plus a single CTA) → Continue/Today → Feelings (6) → Paths (3) → Library (6) → Footer.
2. Delete the duplicate mood and verse sections, and move the "source" blocks to `/about`.
3. In `SiteNav.tsx`, link canonical URLs and split the H1 spans.
4. Make tap targets 44px via a shared `Button` size token.

**Week 3 (P1 IA):**
1. Create `/topics/[slug]`, `/paths/[slug]` and `/me`.
2. Add the redirect map in `public/_redirects` for the 16 hubs, with trailing slashes.
3. Write one `lib/store.ts` migration that merges the saved and bookmarks keys.

**Week 4 (P1 SEO):**
1. Build the topic data for the first 30 hubs from `lib/wisdom-verse-topics.ts`.
2. Add FAQPage, Article and BreadcrumbList JSON-LD.
3. Add the famous-verse aliases.
4. Add sitemaps with `lastmod`.

**Week 5 (P1 search and paths):**
1. Add a MiniSearch index per language, a reference jump, and a transliteration normaliser.
2. Ship 5 starter paths as JSON.

**Week 6 (P1 performance and trust):**
1. Window the chapter list.
2. Defer the motion and 3D modules.
3. Set a budget of 150 KB JS on reading pages and 1.5 s LCP on 4G.
4. Publish `/about/funding` and add the end-of-chapter contribute line.

**Success metrics** (privacy-preserving, aggregate only, via Cloudflare Web Analytics):
- time to first verse under 1 s
- verse-page scroll depth to meanings
- percentage of sessions reaching a second verse
- returning visitors at 7 and 30 days
- organic sessions to topic hubs
- contributions per 1,000 readers

---

*Not measured in this audit:*
- the live donation flow end to end
- search result quality across languages
- Core Web Vitals field data
- screen-reader passes

The mobile numbers come from one 375×812 emulation.

---

## Implementation status (2026-10-23)

Done in this checkout (not committed): all P0 items; hub merge into `/wisdom-for-life/`, `/learn/` and `/practice/` with 301s; 8 new topic hubs (30 in total) and 18 `/gita-N-N/` short links; reference jump for 16 texts (`lib/citation-schemes.ts`, `scripts/build-citation-map.ts`) and vowel-dropped Hinglish matching; the Cornerstone path now lists the five verses its title promises; chapter verses beyond the first 10 hydrate as the reader nears them; ambient orbs only on desktop; `/about/funding/` plus an end-of-chapter contribute line; collection share links at `/practice/shared/`; a local "your year in verses" card.

Measured, not met: reading pages load about 360 KB gzip of JavaScript against the 150 KB budget (`scripts/check-js-budget.mjs` now reports this after every build; add `--strict` to fail on it). The largest chunks are react-dom (52 KB), the verse page (45 KB) and a framer-motion chunk (44 KB), so the next saving is the shared motion layer, not this file's markup.

PWA and reminders: reminders already existed as calendar (.ics) events the reader's own calendar delivers, which keeps the zero-account rule (Web Push would need a server). They are now linked from the /practice/ hub; the install banner no longer appears on chapter or verse pages; the stale `/dashboard/` manifest shortcut points to `/practice/dashboard/`.

Dropped by decision (2026-10-23): per-verse recorded audio.

Not started: the 20k demand-driven verse set, community source sheets, extra UI languages, a MiniSearch index, and the monthly funding ledger.
