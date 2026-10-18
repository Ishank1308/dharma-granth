# dharmagranth.in: project rules

Bilingual (Sanskrit / Hindi / English) scripture library. Next.js app router, static export (`dist/`). Code lives in `app/` and `lib/`, not `src/`.

## Non-negotiable rules

1. **Crawler and SSR safety.** Above-the-fold content on `/` and every route must pre-render cleanly, with no fragile client-only chunk blockers. Any Error Boundary fallback ("पृष्ठ लोड नहीं हो सका") must inject `<meta name="robots" content="noindex, nofollow" />`.
2. **Global header and theme parity.** Every route uses one unified `<Header />` that supports all four themes (`Day`, `Sunset`, `Paper`, `Dark`) and all six primary routes (`/`, `/scriptures/`, `/bhagavad-gita/`, `/learn/`, `/practice/`, `/panchang/`). English and Hindi labels are separate elements in the DOM (`<span>Home</span> <span lang="hi">मुख</span>`) so crawlers never read `Homeमुख`.
3. **Philological integrity.** Never truncate a Sanskrit verse mid-shloka. A multi-verse range (for example `Katha Upanishad 1.3.3–4`) renders every included verse completely.
4. **Zero-account privacy.** All `/practice/` and `/learn/` state stays in `localStorage`, with local JSON export and import for backup.
5. **SEO hygiene.** Trailing slashes are consistent across internal links, `<link rel="canonical">` and `sitemap.xml`.

## Working notes

- Other tools (Cursor, other Claude sessions) edit this checkout at the same time. Run `git status` before editing, stage only your own files, and never revert changes you did not make.
- Many files are CRLF. Verify scripted edits with `git diff --stat`.
- Runtime reads the `scriptures-full` JSON, not `data/scriptures/*.ts`. Build guards cap export size and file count for Cloudflare Pages.
- Ashtavakra Gita content pipeline: `scripts/ashtavakra-compose.mjs N`, then `scripts/ashtavakra-build.mjs N`. Reproduce the book's commentary in original words; omit polemic or derogatory passages.
