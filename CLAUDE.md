# dharmagranth.dev: project rules

Bilingual (Sanskrit / Hindi / English) scripture library. Next.js app router, static export (`dist/`). Code lives in `app/` and `lib/`, not `src/`.

## Non-negotiable rules

1. **Crawler and SSR safety.** Above-the-fold content on `/` and every route must pre-render cleanly, with no fragile client-only chunk blockers. Any Error Boundary fallback ("पृष्ठ लोड नहीं हो सका") must inject `<meta name="robots" content="noindex, nofollow" />`.
2. **Cloudflare edge cache hygiene.** HTML routes (`/*`) are never cached stale at the edge (`Cache-Control: public, max-age=0, must-revalidate`). Hashed bundles (`/_next/static/*`) and `/fonts/*` use `max-age=31536000, immutable`; `/search/*` uses `max-age=3600, s-maxage=86400, stale-while-revalidate=604800`. Asset rules in `public/_headers` start with `! Cache-Control` so they do not merge with the HTML rule. This is a Next export, so there are no `/assets/*` or `/_astro/*` paths.
3. **Global header and theme parity.** Every route uses one unified `<Header />` that supports all four themes (`Day`, `Sunset`, `Paper`, `Dark`) and all six primary routes (`/`, `/scriptures/`, `/bhagavad-gita/`, `/learn/`, `/practice/`, `/panchang/`). English and Hindi labels are separate elements in the DOM (`<span>Home</span> <span lang="hi">मुख</span>`) so crawlers never read `Homeमुख`.
4. **Philological integrity.** Never truncate a Sanskrit verse mid-shloka. A multi-verse range (for example `Katha Upanishad 1.3.3–4`) renders every included verse completely.
5. **Zero-account privacy.** All `/practice/` and `/learn/` state stays in `localStorage`, with local JSON export and import for backup.
6. **SEO and trailing-slash hygiene.** `trailingSlash: true`. Trailing slashes are consistent across internal links, `<link rel="canonical">`, `public/_redirects` and `sitemap.xml`, so Cloudflare Pages never loops on 308 redirects.

## Working notes

- Other tools (Cursor, other Claude sessions) edit this checkout at the same time. Run `git status` before editing, stage only your own files, and never revert changes you did not make.
- Many files are CRLF. Verify scripted edits with `git diff --stat`.
- UI work uses the design system in `docs/design-system.md`: tokens in `app/styles/tokens.css` (Tailwind names such as `text-title-2`, `rounded-card`, `shadow-raised`), shared components in `app/styles/components.css`, motion in `app/motion.css`. Prefer a token over a new hard-coded size, radius, shadow or duration.
- Runtime reads the `scriptures-full` JSON, not `data/scriptures/*.ts`. Build guards cap export size and file count for Cloudflare Pages.
- Verse व्याख्या (Hindi explanations): follow `docs/vyakhya-guide.md` for voice, register and workflow. Draft one chapter per file in `data/ai-commentary/staged/<scripture>-<chapter>.json`, check it with `node scripts/check-hindi-register.mjs`, then `node scripts/stage-commentary.mjs` and `npm run publish:commentary`. Never rewrite the printed translations.
- Ashtavakra Gita content pipeline: `scripts/ashtavakra-compose.mjs N`, then `scripts/ashtavakra-build.mjs N`. Reproduce the book's commentary in original words; omit polemic or derogatory passages.
