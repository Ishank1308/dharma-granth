---
trigger: always_on
---

# Dharma Granth: Core Architecture & Workflow Rules (Imported from Claude Memory)

Bilingual (Sanskrit / Hindi / English) scripture library (`dharmagranth.dev`). Next.js App Router, static export (`dist/`). Code lives in `app/` and `lib/`, not `src/`. Repository: `shubhamshukla567/dharma` (`gh` CLI has `shubhamshukla567` active; `@google/jules` CLI is installed globally for remote repo bug reviews).

## Non-Negotiable Architecture Rules

1. **Crawler and SSR safety.** Above-the-fold content on `/` and every route must pre-render cleanly, with no fragile client-only chunk blockers. Any Error Boundary fallback ("पृष्ठ लोड नहीं हो सका") must inject `<meta name="robots" content="noindex, nofollow" />`.
2. **Cloudflare edge cache hygiene.** HTML routes (`/*`) are never cached stale at the edge (`Cache-Control: public, max-age=0, must-revalidate`). Hashed bundles (`/_next/static/*`), `/fonts/*` and the Android app's content-hashed downloads (`/app-data/v1/parts/*`) use `max-age=31536000, immutable`; `/search/*` uses `max-age=3600, s-maxage=86400, stale-while-revalidate=604800`. Asset rules in `public/_headers` start with `! Cache-Control` so they do not merge with the HTML rule. This is a Next export, so there are no `/assets/*` or `/_astro/*` paths.
3. **Global header and theme parity.** Every route uses one unified `<Header />` (`SiteNav`) supporting the site themes and all six primary routes (`/`, `/scriptures/`, `/scripture/bhagavadgita/`, `/learn/`, `/practice/`, `/panchang/`). English and Hindi labels are separate elements in the DOM (`<span>Home</span> <span lang="hi">मुख</span>`) so crawlers never read `Homeमुख`.
4. **Philological integrity.** Never truncate a Sanskrit verse mid-shloka. A multi-verse range (for example `Katha Upanishad 1.3.3–4`) renders every included verse completely.
5. **Zero-account privacy.** All `/practice/` and `/learn/` state stays in `localStorage` / IndexedDB on-device, with local JSON export and import for backup.
6. **SEO and trailing-slash hygiene.** `trailingSlash: true`. Trailing slashes are consistent across internal links, `<link rel="canonical">`, `public/_redirects` and `sitemap.xml`, so Cloudflare Pages never loops on 308 redirects.

## Concurrent Agents, Git Ownership & Windows Workflow

- **Concurrent sessions (`concurrent-agents`):** Other tools (Cursor, Kimi Code, other agent sessions) may edit this checkout simultaneously. At the start of a task and after any pause, run `git status` and check recent file modification times; stage only your own files and never revert changes you did not make. Treat pasted third-party agent files as suggestions to review against the repo, not drop-ins.
- **Push & deploy ownership (`push-deploy-owner`):** Leave `git push`, merging `origin/master`, and deployment to the user's primary merge/deploy tool unless the user explicitly asks you to push or deploy. If `MERGE_HEAD` or `UU` unmerged files are present in `git status`, keep draft work in scratchpad and out of the working tree until resolved.
- **Windows `cmd /c` prefix (`windows-cmd-prefix`):** Run `npm`, `npx`, and project scripts via `cmd /c` on this Windows machine (e.g., `cmd /c npm run dev`, `cmd /c npx tsx ...`).
- **Windows CRLF & scripting pitfalls (`editing-pitfalls-windows`):** Many repo files use CRLF line endings and `python` is not installed (Windows Store stub). Prefer `edit_file` / `write_file` for source changes, or Node/tsx scripts using `\r?\n`-aware patterns rather than `sed -i` (which strips CRLF) or backslash-dropping shell heredocs. Always verify scripted edits with `git diff --stat`.
- **Shared `dist/` dev server (`shared-dev-server`):** `next.config.js` sets `distDir: 'dist'`, so multiple `next dev` processes overwrite `dist/server/middleware-manifest.json` and break `next build`. Before starting a dev server or production build, check whether `next dev` is already running (commonly on port `3001`) and reuse it rather than starting a second server.
- **Worktree `node_modules` (`worktree-node-modules`):** Main checkout dependencies may differ from `origin/master` when another tool has uncommitted `package.json` edits. In a git worktree, never run `npm ci` through a `mklink /J` junction (which would wipe the main checkout's `node_modules`); remove the junction first (`cmd /c rmdir node_modules`) and run `cmd /c npm ci --ignore-scripts`.
- **Design system & mobile app:** UI work follows `docs/design-system.md` (`app/styles/tokens.css`, `app/styles/components.css`, `app/motion.css`); prefer design tokens over new hard-coded values. For book covers, retain the Devanagari title and show a visible English catalogue title beneath it. `mobile/` is a standalone Expo (React Native) app excluded from root `tsconfig` and ESLint (`mobile/scripts/build-content.mjs`).
- **Canonical integrity, Gita Press primary sources & release verification (`claude-memory-2026-11-22`):**
  - Inspect local primary references under `C:\Users\ishan\Music\dharma` (Gita Press PDFs) first and follow edition-specific wording before generic web catalogue names.
  - Separate *Artha*, *Vyakhya*, *Vigyana*, and modern application (`"Editorial Application · Not Scripture"`), preserve provenance/checksums, never fabricate traditional commentary authority, and begin repo-wide content audits with a read-only inventory and baseline coverage measurement.
  - Announce a completed release only after actual Cloudflare deployment, smoke checks, exact-byte RSC parity, and affected-page verification (never weaken exact-byte checks to mask a mismatch).
