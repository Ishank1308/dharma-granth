# Three-release plan: coverage audit

Status of the three-release brief against the repository as of 2026-10-08. "Built" means working in the app and checked in a browser; "Partial" says what is missing. Nothing is marked built that only exists as a wish.

## Foundation

| Item | Status |
|---|---|
| Shared formatting and correct plurals | Built: `lib/format.ts`, `npm run test:format`; applied in reader, search, collections, dictionary, topics, festivals, reading plan. Other hand-written counts may remain. |
| Canonical scripture and verse records | Not built. Titles, slugs and counts come from `data/scriptures`, `scripture-meta.ts` and the seeded JSON. Needs one registry with aliases, redirects and review fields (see below). |
| Loading, empty, error, offline states | Partial: Panchang, listen, pack, journeys, desk and search have them; the library and several older pages need an audit. |
| Stale dates and timezones | Partial: festival dates checked by `/editorial`; Panchang shows place and timezone. |

## Release 1: Understand and continue

| Item | Status |
|---|---|
| Scripture stage, actions | Built (listen, slow, save, copy with citation, share, download, report). |
| Quick / Simple / Deep | Built. Deep has no sandhi, grammar or review-history data, so it says so. |
| Verse in 30 seconds, simple explanation format, context panel, misunderstanding card | Built for Gita 2.47 only; 2.48 and Isha 1 have base data. Other verses show the verse layers only. This is a content limit. |
| Continue reading | Partial: component and desk exist. Missing: pause history, import and export of history alone, and surfacing on every page named. |
| Contextual next teaching (max three, with reasons) | Partial: approved, curated links now appear in a collapsed disclosure on matching chapter verse cards and on standalone verse pages. Each link shows its existing editorial reason; no link is inferred. Coverage remains limited to the verses with curated connections. |
| Saved verses and collections | Partial: bookmarks, notes and `dharma.collections` exist. Missing: default collections (Read Later, Favourites, Study Carefully, Daily Reflection, Share Later), rename, move, filters. |
| Library redesign | In another contributor's uncommitted work; not reviewed here. |
| Sources and interpretation panel | Built; correction history comes from GitHub issues, not a log. |

## Release 2: Personalise and return

| Item | Status |
|---|---|
| Personalised dashboard | Partial: Start My Journey and the desk exist; no returning-user dashboard with five cards. |
| Daily Dharma Journey | In progress by another contributor (`app/components/daily/*`, `data/daily-dharma-data.ts`). Do not duplicate. |
| Start My Journey | Built. |
| Guided journeys | 3 of 8 (focus, karma yoga, self). Missing: Gita in 18 lessons, students, bhakti, upanishads, beginners. Each needs verse choices and review. |
| Life-situation pages | Built (13 topics). "Uncertainty" and "Failure" are covered under other titles. |
| Explanation feedback | Built on the device. Reaching the editorial dashboard needs an endpoint (decision pending). |
| Weekly summary, reminders | Not built. Reminders need the Notification API and a decision on quiet hours. |
| Personal study desk | Built. |

## Release 3: Learn deeply and participate

| Item | Status |
|---|---|
| Audio-first | Partial: device voice only; no recorded reciter, repeat line, or reliable screen-off playback. |
| Sanskrit through scripture | Not built. Needs reviewed sandhi and grammar data. |
| Concept explorer | Partial: 12 concept pages (Yajna instead of Jnana); typed relationships and graph list alternative not built. |
| Translation and commentary comparison | Built; no traditional commentary exists to compare yet. |
| Visual story mode | Built; needs a fifth label, "Uncertain or disputed detail". |
| Ask Dharma Granth | Not built. A retrieval-only version (reviewed passages from search, never generated text) is feasible; see next steps. |
| Reviewed questions, contributor portal | Not built. Need a backend, accounts for reviewers, and a moderation process. Interim: structured GitHub issue forms. |
| Offline PWA | Partial: service worker exists; no download manager, sizes or update status. |
| Editorial dashboard | Built; version history is a field, with no diff view. |

## Suggested next order

1. Contextual next teaching after every verse (max three, with reasons).
2. Collections with the five defaults, rename, move and filters.
3. Canonical scripture registry with aliases and redirects, plus audit of remaining hand-written counts.
4. Retrieval-only Ask Dharma Granth with the required fallback message.
5. Continue-reading controls (pause, export, import).
6. Remaining journeys, after verse selection is approved.
