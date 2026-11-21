# Dharma Granth for Android

A React Native (Expo SDK 58, Expo Router) reader for the dharmagranth.dev library: Sanskrit, Hindi
and English, readable offline, no account.

## What it does

- **Library** of all 66 scriptures, grouped like the website (Vedas, Upanishads, Itihasa, Puranas…),
  with search, a verse of the day (with an opt-in daily notification and a home-screen widget) and "continue reading".
- **Offline reader** for 44 texts whose verse data ships inside the app (Bhagavad Gita, the principal
  Upanishads, Yoga Sutras, Brahma Sutra, Durga Saptashati, Vidura Niti, Manusmriti, Sama and Yajur Veda,
  Vinaya Patrika, Ramcharitmanas and more). Each verse shows the complete Sanskrit, transliteration, Hindi and English,
  with word meanings and commentary under Notes.
- **Downloads** for the 22 large texts (Ramayana, Mahabharata, Puranas, Rig and Atharva Veda): tap Download on the
  text's page to read it offline. The card shows the size and progress; Settings → Downloaded texts lists what is on the
  phone and deletes it. Until downloaded, chapters open on dharmagranth.dev.
- **Verse search** inside the 44 offline texts and any large texts you have downloaded, in Sanskrit,
  Hindi, transliteration or English (Library → Search inside verses). It runs on the phone from a prebuilt index, no network needed.
- **Recitation** (pilot: Bhagavad Gita chapter 12): a play button on each recited verse, and Play in the reader's
  toolbar recites the chapter from the verse on screen, with Pause and Stop beside it. Audio streams from
  dharmagranth.dev and is cached on the phone.
- **Saved verses**, share a verse, four reading themes (Day, Sunset, Paper, Dark) and text size.
- **Hindi or English interface**: Settings → Language switches menus, buttons and messages between
  English and Hindi, and starts on the phone's language. Verse text is unaffected.
- **Privacy**: bookmarks and settings live in on-device storage only. Settings → Backup exports a JSON
  file and imports it on another phone.

## Interface text

All interface strings live in `src/i18n/strings.ts` as `{ en, hi }` pairs (or functions returning one
for counts and names). Read them with `const { t } = useI18n(); t(S.someKey)`, or spread a pair into
components that take `en` and `hi` props (`<SectionTitle {...S.theme} />`). Add every new string there
with both languages instead of writing it inline. Scripture text is content and never goes through it.

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

### Downloadable texts

The books that are not bundled are published by the website build: `scripts/build-app-data.mjs` (root `postbuild`)
writes `dist/app-data/v1/index.json` and content-hashed parts under `dist/app-data/v1/parts/`, about 67 files and 73 MB
compressed. Both builds share `scripts/content-lib.mjs` (verse fields and the bundling rule), so a downloaded book reads
exactly like a bundled one. A part holds whole verses only; a chapter larger than a part is split by verse and joined again
on the phone (`src/content/downloads.ts`), which stores one file per chapter under the app's document folder.

The app only makes plain file requests to dharmagranth.dev: no account, no identifiers, and no permission beyond INTERNET.
Bump `FORMAT` in both `scripts/build-app-data.mjs` and `src/content/downloads.ts` (and the `v1` path) if the part layout changes.

## Recitation audio

Verse audio is not bundled. Each verse is one MP3 at `public/audio/<scripture>/<chapter>/<verse>.mp3`
in the website repo, served as `https://dharmagranth.dev/audio/...` (cache rule in `public/_headers`).
`src/audio/recitations.json` lists which verses have audio, so the play button appears only there; add a
chapter to it in the same change that adds its files. The first play streams the file and saves it in the
app's cache folder (`src/audio/recitation.ts`); later plays are offline. `src/audio/player.tsx` holds one
shared `expo-audio` player, so one verse sounds at a time; Play in the reader's floating toolbar moves through the chapter.

Playback is foreground only. The `expo-audio` plugin in `app.json` turns off recording and the background
playback service, so the only permission it adds is `MODIFY_AUDIO_SETTINGS` (a normal, install-time
permission with no prompt). No data is collected: the app makes plain GET requests for public files.

The pilot was generated with ElevenLabs (`eleven_v4`, voice "Kuber J - Calm, Devotional & Meditative"),
one generation per verse from the Sanskrit text with `[slowly] [softly]` in front and the verse number
removed. The reader shows a credit line (`S.recitationCredit`) on chapters with audio.

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

Downloaded texts are searched too. While a large text downloads, the app folds its verses with the
same code (`verseToCorpusLine`) into `downloads/<id>/search/`: chunks of about 1.5 MB of index plus a
`manifest.json` (`src/content/download-index.ts`). A search reads one chunk at a time and keeps only a
few in a small cache, so memory stays flat even with the Mahabharata (37 MB of index, 25 chunks)
downloaded. The index lives inside the book's folder, so deleting the book deletes it, and it adds about
a third to the size on the phone. A text downloaded before this existed gets its index built in the
background the first time the search screen opens. Bump `INDEX_FORMAT` when the fold changes, so old
indexes are built again.

## Home-screen widget

"Verse of the day · आज का श्लोक" is an Android widget (4×2, resizable) built with
[react-native-android-widget](https://github.com/sAleksovski/react-native-android-widget). Its config plugin in
`app.json` writes the widget provider during `expo prebuild`; `index.ts` registers the headless task that
draws it (`src/widget/task-handler.tsx`), so it works while the app is closed.

- Shows the whole shloka (Android shrinks the text to fit, it never cuts a verse), the label in the interface
  language and the reference. The light version uses the reader's light theme, the dark one follows the
  phone's dark mode.
- Tapping opens `dharmagranth://scripture/<id>/<chapter>?verse=<n>` in the reader, with the library behind it.
- Android redraws it hourly, so the verse changes within an hour of midnight; the app also redraws it when it
  comes to the front or the language or theme changes. Settings → Daily verse has a button to place it.
- No runtime permission prompts. The library schedules its redraws with AndroidX WorkManager, which adds the
  install-time `WAKE_LOCK` and `ACCESS_NETWORK_STATE`; `FOREGROUND_SERVICE` is blocked in `app.json` because
  nothing starts a foreground service. `assets/images/widget-preview.png` is the picker preview.
