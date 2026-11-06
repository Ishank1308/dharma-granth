# Master prompt: Dharma Granth improvements (for Muse Code)

You are working on **dharmagranth.dev**, a bilingual (Sanskrit / Hindi / English) Hindu scripture library. It is a Next.js app-router site with a static export (`dist/`); code lives in `app/` and `lib/`. Real people read these pages as sacred text, so accuracy and reverence come before everything else.

Before you start, read these, in this order:
1. `CLAUDE.md`: the six non-negotiable rules (crawler/SSR safety, edge-cache headers, one `SiteNav` with four themes, never truncate a shloka, zero-account privacy, trailing slashes).
2. `docs/vyakhya-guide.md`: the house standard for all Hindi study text.
3. This file, top to bottom.

Work through the parts **in order**, and stop at every **STOP** to report to the editor. Parts 1–3 matter most.

---

## Ground rules (apply to every part)

- **Other tools edit this checkout at the same time.**
  - Run `git status` before editing, and stage only your own files and hunks.
  - Never revert changes you did not make.
  - Do not push or deploy; another tool owns that.
- **Many files use CRLF line endings.** Keep them, and check scripted edits with `git diff --stat`.
- **Never change these:**
  - the Sanskrit text, its transliteration, or the verse numbering;
  - the printed translations (Gita Press Hindi by Jayadayal Goyandka, and the English editions). They are the editions' own words.
- **Hindi register:** dignified, tatsam-leaning Gita Press Hindi. No English words or slang. Honorifics with plural verbs (भगवान श्रीकृष्ण कहते हैं). The reader is addressed as आप. तू/तुम appear only inside Bhagavan's quoted words to Arjuna.
- **English register:** plain and respectful. No marketing or corporate wording ("sprint", "zero checking", "mastery", "Gen Z"), no ALL CAPS, sentence case for headings, and "Bhagavan Sri Krishna" on first mention.
- **Verify every scriptural reference** against `public/data/scriptures-full/<scripture>.json`. If you cannot confirm a reference, remove it.
- **Runtime data:** the site reads the published JSON (`public/data/…`), not `data/scriptures/*.ts`. Chapter shards in `public/data/scriptures-full/<id>/` are gitignored and rebuilt by `npm run shard:scriptures`.
- **Dev servers:**
  - Do not start `next dev` on the shared `dist/` (port 3001, owned by another tool) or on `.next`, which another tool's `next build` writes to.
  - Use the `dev-palm` entry in `.claude/launch.json` (port 3003, folder `.next-palm`), or a new folder of your own added to `.git/info/exclude`.
  - The dev server keeps commentary in memory, so restart it after `npm run publish:commentary`.
- **Decisions belong to the editor.** Where this prompt says **ASK**, list the options and wait.

---

## Part 0: Verify what is already done (uncommitted in the working tree)

These changes were made on 2026-10-25 and have not been committed. Do not redo them. Run the checks, and report anything that fails.

| Change | Files | Check |
|---|---|---|
| Tailwind opacity modifiers on `dharma-*` colours (committed `fc20d794`) | `tailwind.config.ts` | `bg-dharma-card/95` appears in the built CSS |
| Palm-leaf verse prototype, Gita 2.47 only | `data/verse-study.ts`, `app/components/reader/PalmLeaf.tsx`, `app/components/reader/palm-leaf.css`, `public/fonts/tiro-devanagari-sanskrit-400.woff2`, additions in `app/components/reader/ReaderLayers.tsx` | 2.47 shows the leaf, red daṇḍas, study key, highlights and margin notes; other verses are unchanged |
| Flat verse tree: every layer on one rail, full width on phones | `app/components/reader/VerseTreeStructure.tsx` | at 375px, every layer is about 343px wide |
| Cleaner layer labels (no repeated headings or false "literal" claims) | `ReaderLayers.tsx`, `lib/sacred-reading-order.ts` | headings read "Hindi translation / हिन्दी अनुवाद", "Explanation / व्याख्या", "Meaning / अर्थ" |
| Lexicon: short words such as mā no longer match inside ātman | `data/sanskrit-lexicon.ts` (`findLexiconEntry`) | on 2.47, "mā" shows no आत्मन् card |
| Wrong reference: "कर्म ब्रह्मोद्भवं…" is Gita 3.15, not 8.3, and was misspelled | `data/concept-verses.ts` | 2.47 related verses show "Bhagavad Gita 3.15" |
| False lineage line ("Taught through Yajnavalkya … Kabir") removed | `app/components/SourceStudyNotes.tsx` | no "Taught through" on any verse |
| 2.47 study panel rewritten to the house register | `data/pedagogical-gita-2-47.ts` | no तुम, नतीजा, टू-डू, "Sprint" |
| 2.47 shows the Gita Press Hindi and the approved व्याख्या (pilot record superseded) | `data/pilot/pilot-set.json` (`supersededBy`), `scripts/pilot/overlay.ts`, `scripts/pilot/lib.ts`, `data/ai-commentary/bhagavadgita.json`, `data/ai-commentary/staged/bhagavadgita-02.json`, `docs/vyakhya-guide.md` | 2.47 Hindi reads "कर्तव्य-कर्म करनेमें ही तेरा अधिकार है…"; the व्याख्या cites १८.१३–१४ |
| 2.47 research note and modern context brought to standard | `data/ai-commentary/bhagavadgita-research.json`, `data/hi-commentary/bhagavadgita.ts` | no "Carol Dweck", "outcome obsession" or "चार स्पष्ट पग" |

**STOP 0:** report the results of these checks.

---

## Part 1: Accuracy and trust problems (highest priority)

1. **Review claims that may be invented. ASK.** `data/modern-scenarios.ts` (several entries) and `data/chapter-orientation.ts` say "Reviewed by Editorial Scripture Team (V. S. Sharma & S. Shastri), 2026-09-20". The same pages say "No independent human review is recorded", and `data/review-records*` has no such reviewers. Ask the editor whether these are real people. If they are not, remove the claim everywhere, and show "Editorial draft, awaiting review" instead.
2. **Pilot verses that replace printed translations. ASK.**
   - Every unit in `data/pilot/pilot-set.json` with `arthaDecision` other than `preserve-existing` and no `supersededBy` replaces the edition's Hindi and English with an editorial rendering (`scripts/pilot/overlay.ts → patchPublishedVerse`). The Sources box may still credit the edition's translator.
   - List each such verse with the stored edition text beside the pilot text.
   - For each one, offer the editor two options: restore the edition text (as was done for 2.47, by adding `supersededBy`), or keep the pilot text and label it "editorial rendering, not the printed translation".
3. **Truncated shlokas (rule 4).** "Related verses" (and any card, preview, share or OG text) shows only the first half-line, e.g. "कर्मणो ह्यपि बोद्धव्यं बोद्धव्यं च विकर्मणः". Find every place that cuts a shloka (`data/concept-verses.ts`, related-verse and knowledge-graph components, share cards) and render the complete verse.
4. **Lexicon mismatches across the site.** For every verse that has `wordMeaning`, run each pada through `findLexiconEntry` and list matches where the matched term is not the word. Fix the matcher or the mapping. Do not change the glosses themselves.
5. **Glosses that add words.** Some dataset glosses add words not in the Sanskrit, e.g. "karmaṇi — in prescribed duties". Do not rewrite them. List the worst cases for the editor, with the source dataset.

**STOP 1:** report what you found and the decisions needed.

---

## Part 2: Scholarly review of all study text (after STOP 1)

Review every **व्याख्या**, **आधुनिक संदर्भ** (`lifeLesson`) and **शोध टिप्पणी** (`science`) the way a careful human scholar would. Start with the Bhagavad Gita (701 verses). **Finish chapter 1, publish it locally, then STOP** so the editor can approve the standard before you continue chapter by chapter. Other scriptures come only when asked. Skip pilot verses (no `supersededBy`) and list them in your report.

### Where each layer lives

| Layer | Edit | Publish |
|---|---|---|
| व्याख्या | `data/ai-commentary/staged/<scripture>-<NN>.json`, key `"<chapter>:<verse>"` | `node scripts/stage-commentary.mjs <file> --force`, then `npm run publish:commentary` |
| Modern context | `lifeLesson` in `data/hi-commentary/<scripture>.ts` (keep its `### आधुनिक संदर्भ`, `### आज के जीवन में प्रयोग`, `### चिंतन प्रश्न` sections) | `npm run publish:commentary` |
| Research note | `data/ai-commentary/<scripture>-research.json`: `{ "c:v": { "status": "approved", "science": "…" } }`; `""` withdraws it | `npm run publish:commentary` |

- Approved entries in the queue (`data/ai-commentary/<scripture>.json`) override the व्याख्या in the `.ts` source. Edit the staged draft, never the queue directly.
- `--force` overwrites every approved entry in the file you stage. To change only a few verses, stage a temporary file with just those keys (named like `bhagavadgita-2.json`), then copy the same text into the chapter's staged file.
- After publishing, `git diff` of the queue and `public/data/hi-commentary/<scripture>.json` must change only the verses you meant to change.

### Checklist for every verse (read the Sanskrit, printed Hindi and glosses first)

**A. Faithfulness**
- No invented events, dialogue, emotions, quotations or commentator positions.
- Every cited verse is looked up and correctly numbered.
- Lists the scripture itself gives are quoted in its own order.
- Genuine differences between commentators are presented neutrally, without choosing one.
- Sensitive verses (violence and duty, varna, gender, death) say what the verse does *not* license, and get a `reviewNote`.

**B. Reverence and register:** use the guide's substitution table (परन्तु, आवश्यक, उत्पन्न, स्मरण, आरम्भ…). No English or Roman script: remove things like "outcome obsession", "burnout", "flow", 100%, व्यूज, कामचोरी, मूड, कट-ऑफ, टू-डू. Honorifics, and आप-address.

**C. Readability:** fix any sentence a careful reader would stumble on:
- person or pronoun shifts (हमें … आपका);
- wrong tense;
- superlatives and over-claims ("सबसे गहरा सूत्र", "अत्यंत वैज्ञानिक", "सारी चिंता की जड़");
- padding and repetition;
- run-on sentences and unclear referents.

**D. Each layer has its own job; they must not repeat each other**
- व्याख्या: 200–280 words, in three movements (the moment and its bhava; one to three key Sanskrit words; what it asks of the reader).
- Modern context: application today, practices and a reflection question only. It must never restate the व्याख्या's steps.
- Research note: 60–100 words, an honest parallel framed as a resonance. No names, studies, dates, figures or pseudo-science. If there is no honest parallel, withdraw it.

### Process
1. For each verse, decide **keep**, **revise**, or **flag for a human**. Flagged verses keep their old text.
2. Every revision gets `confidence: "high"` and an English `reviewNote` listing exactly what changed and why. Never publish below high confidence.
3. `node scripts/check-hindi-register.mjs <file>` must print `sentences to fix 0`. For modern context, wrap the text as `{ "c:v": { "explanation": "<text>" } }` and check that file.
4. **Independent second pass:** re-read each revision fresh against the Sanskrit, as a reviewer who did not write it, then fix anything that fails.
5. Stage, publish, check the diff scope, restart the preview, and look at one or two verses in the browser.
6. Write a chapter report to `docs/reviews/<scripture>-<NN>.md` covering:
   - counts of verses kept, revised and flagged;
   - each `reviewNote`;
   - each flag with what a scholar must decide;
   - references removed;
   - pilot verses skipped.

### Worked example: Gita 2.47 (already done; match this standard)
- The unsupported list "काल, परिस्थिति, दूसरों के कर्म और प्रारब्ध" became the Gita's own five causes (१८.१३–१४: अधिष्ठान, कर्ता, करण, चेष्टा, दैव), verified in the data.
- The superlatives "सबसे कोमल और सबसे दृढ़" and "सारी चिंता की जड़" were removed.
- The हमें/आप shift was fixed. पर became परन्तु, and "उठा ही नहीं सकता था" became "उठा ही नहीं सकता".
- "स्वयं को फल का कारण मत मानो" became "स्वयं को कर्मफल का हेतु मत बनाओ", following मा कर्मफलहेतुर्भूः.
- The modern context had repeated the four steps; that section was removed.

**STOP 2:** after Gita chapter 1, and after every chapter if the editor asks.

---

## Part 3: Verse page clean-up (every verse; shared components)

Check on Gita 2.47 and two other verses, at 375px and at 1024px.

1. **Verse first.** Twelve action buttons sit above the Sanskrit (Save, Note, Reflect privately, Copy, Open context, Share Card, WhatsApp, श्लोक संबंध, Download Image, Embed, Download, Report error). Keep three visible (Save, Share, Listen if available) and move the rest into a "⋯ More" menu. Keep every action reachable by keyboard and screen reader.
2. **Duplicate sections.** "संबंधित ज्ञान · Related wisdom" renders twice, and "Related teachings" three times (`RelatedWisdom`, `RelatedWisdomDiscovery`, `RelatedTeachings`, `NextTeachings`, the knowledge graph). Show each kind of link once, in one place.
3. **Emoji.** Remove 🟣🔵🟢🟡 from `app/components/study/VerseGraphNetwork.tsx`; use a small coloured dot or a text label instead.
4. **Internal notes shown publicly.** For example: "Licence note (as recorded) Community dataset — verify license terms at source repo before redistribution." Rewrite such text for readers, or move it to `/sources/`.
5. **Stray labels**, such as "Explanation: simple" and "Create share card" floating without context. Either give them context or remove them.
6. **Repeated headings** inside `ModernContextBlock` ("आधुनिक संदर्भ · Modern Context" under a layer that already says it). That file has another tool's uncommitted edits, so change only the heading lines.
7. **Labels must be true.** Never label a translation "literal" or "अक्षरशः" unless the edition says so. The translator credit must match the text actually shown (see Part 1, item 2).
8. **Night theme.** Check the verse page in all four themes (`day`, `sunset`, `paper`, `night`) by switching through the site's own theme control. Setting `data-theme` by hand does not restyle everything.

**STOP 3**

---

## Part 4: Palm-leaf (ताडपत्र) verse design: finish, then roll out (after editor approval)

The prototype is on 2.47 only. Fix these, show the editor, and wait for approval before rolling out.

1. **Box inside a box.** The leaf sits inside the "Original Sanskrit" card, with its corner marks and header still around it. When a verse has a leaf, drop the card frame and corner marks, and keep only a small "मूल पाठ · Source scripture" label.
2. **It must read as a palm leaf, not lined paper.**
   - Make the fibre lines subtler.
   - Keep the leaf long and narrow: on phones, reduce the vertical padding so it doesn't become nearly square.
   - Keep the string holes in the margins.
3. **Verse number in Devanagari digits on the leaf:** ॥ २.४७ ॥, not ॥ 2.47 ॥.
4. **One calm colour family inside the व्याख्या card.** The card is blue, while the study colours are amber, coral and teal. Make the editorial card neutral when study colours are present, or tune the study colours to sit with it.
5. **Use the empty space on desktop.** From `lg` up, move the margin notes (टिप्पणी) into the side margin beside the व्याख्या. Keep the reading column about 740px.
6. **Rollout data:** `data/verse-study.ts` holds per-verse markup (word groups, highlight phrases, margin notes). Every phrase must already appear verbatim in the layer it marks, and the reader only wraps it.
   - Add data for the rest of Gita chapter 2 first.
   - Use only phrases taken from the published text, and only references you have verified.
   - Do not add a "two readings" box unless the published व्याख्या presents both readings.
7. **One look everywhere:** use the same leaf for the share image, the embed, the print view and Verse of the Day.
8. **Performance:** the Tiro font is 184 KB and should load only on pages that show a leaf. Check this.

**STOP 4**

---

## Part 5: Site-wide fixes from the 2026-10-25 audit

1. **Mobile homepage**
   - The floating ॐ button ("Prāṇa Sūtra" island, `components/ui/PranaCapsule.tsx`) covers "Not sure where to begin? Ask the Dharma Guide". Move it, or give the hero bottom padding.
   - The search placeholder is cut off at 375px ("…keyword or ques"). Shorten it, e.g. "Gita 2.47, कर्म, fear…".
   - The hidden `.splash` overlay keeps `pointer-events: auto` with `z-index: 100`. Set `pointer-events: none` once it has faded out.
2. **Homepage copy that reads like internal notes.** Move these to `/methodology/`:
   - Ashtavakra card: "Chapters 19 and 20 are published and marked review-required".
   - Gita card: "Chapter and verse totals on this site are counted from the library files".
3. **Overlapping sections. ASK which page should survive in each group.** Then merge, add 301s in `public/_redirects`, and update the sitemap and internal links, with trailing slashes everywhere:
   - `/pathways/` and `/wisdom-pathways/` (almost the same title);
   - `/learn/paths/`, `/learn/pathways/`, `/learn/plans/`, `/learn/start/`, `/learn/academy/`;
   - `/daily/` and `/daily-verse/`.
4. **Performance and SEO**
   - `/logo-splash.webp` is preloaded twice; keep one.
   - Preload only the fonts used above the fold (Merriweather is probably not needed).
   - Compress `public/og-default.png` (322 KB) to about 60 KB as WebP or JPEG, keeping 1200×630.
   - Make the `og:` and `twitter:` descriptions match.
5. **Verse sitemap: ASK.** Only 2,661 of about 234,000 verses have their own URL, because of the Cloudflare file limits. Propose a policy (for example: every Gita verse and the principal Upanishads), with the file-count impact.
6. **Console warnings** in `components/ui/PranaCapsule.tsx`: a framer-motion `ref` prop warning, and `inert={false}` passed as a boolean. Use `inert={open ? undefined : ''}` or the pattern React 18 accepts.
7. **Dev tooling.** `scripts/dev-isolated.mjs` claims it can run beside a production build, but another tool's `next build` writes to `.next` too, and the two corrupt each other. Give it its own folder (like `dev-palm`) and fix the comment.

**STOP 5:** final report.

---

## Reporting

At every STOP, report:
- what you changed, with file paths;
- what you checked, and how;
- what failed or was skipped;
- the decisions the editor needs to make.

Keep each report short and factual. Do not commit or push; the editor reviews the diff first.
