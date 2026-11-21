# Dharma Granth for Android

A React Native (Expo SDK 58, Expo Router) reader for the dharmagranth.dev library: Sanskrit, Hindi
and English, readable offline, no account.

## What it does

- **Library** of all 66 scriptures, grouped like the website (Vedas, Upanishads, Itihasa, Puranas…),
  with search, a verse of the day and "continue reading".
- **Offline reader** for 44 texts whose verse data ships inside the app (Bhagavad Gita, the principal
  Upanishads, Yoga Sutras, Brahma Sutra, Durga Saptashati, Vidura Niti, Manusmriti, Sama and Yajur Veda,
  Vinaya Patrika, Ramcharitmanas and more). Each verse shows the complete Sanskrit, transliteration, Hindi and English,
  with word meanings and commentary under Notes. The other large texts (Ramayana, Mahabharata, Puranas, Rig and Atharva Veda)
  open on dharmagranth.dev.
- **Verse search** inside the 44 offline texts, in Sanskrit, Hindi, transliteration or English
  (Library → Search inside verses). It runs on the phone from a prebuilt index, no network needed.
- **Saved verses**, share a verse, four reading themes (Day, Sunset, Paper, Dark) and text size.
- **Privacy**: bookmarks and settings live in on-device storage only. Settings → Backup exports a JSON
  file and imports it on another phone.

## Run it

```bash
# once, at the repo root: build the cleaned chapter shards the website also reads
npm install
npm run shard:scriptures

cd mobile
npm install
npm run content        # copies scripture text from ../public/data into src/content/generated/
npm start              # then press "a" for an Android emulator, or scan the QR code with Expo Go
```

`npm start` and `npm run android` build the content automatically if it is missing. Run
`npm run content` again after the scripture data changes.

## Build an APK

The app uses EAS Build, so no local Android Studio is needed:

```bash
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile preview      # installable .apk
npx eas-cli@latest build --platform android --profile production   # .aab for the Play Store
```

EAS runs `npm run content` after installing dependencies (the `eas-build-post-install` script), so the
build always carries the current scripture text. EAS uploads the whole repository because the content
script reads `../public/data`. With a local Android SDK, `npm run android` builds and installs a debug build.

## Content

`scripts/build-content.mjs` reads `../public/data/scriptures-full/<id>/manifest.json` and `ch-N.json`
(falling back to the full-book JSON when shards are missing) and writes:

- `src/content/generated/catalog.json`: every scripture and its chapters
- `src/content/generated/books/<id>/ch-N.json`: verse text for each chapter of a bundled scripture
- `src/content/generated/loaders.ts`: lazy `require()` map per chapter, so opening a chapter parses only that chapter
- `src/content/generated/search/<id>.json` and `search-loaders.ts`: the verse search index, built by
  `scripts/build-search-index.mjs` (needs Node 22.18+, which runs the shared TypeScript fold code directly)

A book is bundled when its chapter data is at most 2.6 MB (`--max-mb=N` changes this), plus the books
in `ALWAYS_BUNDLE` (Ramcharitmanas). The bundle is about 24 MB of Hermes bytecode today. Generated files are git-ignored.

Verse formatting (references, meaning notices) mirrors `lib/verse-format.ts` at the repo root.

## Checks

```bash
npm run typecheck
npm run lint
npm test          # unit tests, plus a check that every bundled verse keeps all its Sanskrit lines
```

To publish on Google Play, follow [RELEASE.md](RELEASE.md).

## Verse search

The index keeps one line per verse: Sanskrit and Hindi, folded transliteration, and the English
translation (commentary and word meanings stay out). Devanagari is stored one ASCII character per
letter, so Hermes holds it at one byte per character, and matching is by substring, so any part of a
Sanskrit compound finds it. Spelling variants meet: शांति / शान्ति, krishna / kṛṣṇa / krsna. Nothing
loads until the first search, and each book's index is then kept for later queries. The index adds
about 10 MB to the Hermes bundle (about 4 MB compressed). Logic and tests: `src/lib/verse-search.ts`,
`scripts/search.test.mjs`.
