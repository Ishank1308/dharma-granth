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
- **Recitation** (pilot: Bhagavad Gita chapter 12): a play button on each recited verse, "Listen" to
  recite the whole chapter, and a mini player. Audio streams from dharmagranth.dev and is cached on the phone.
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
- `src/content/generated/books/<id>.json`: verse text for each bundled scripture
- `src/content/generated/loaders.ts`: lazy `require()` map, so a book is parsed only when opened

A book is bundled when its chapter data is at most 2.6 MB (`--max-mb=N` changes this), plus the books
in `ALWAYS_BUNDLE` (Ramcharitmanas). The bundle is about 24 MB of Hermes bytecode today. Generated files are git-ignored.

Verse formatting (references, meaning notices) mirrors `lib/verse-format.ts` at the repo root.

## Recitation audio

Verse audio is not bundled. Each verse is one MP3 at `public/audio/<scripture>/<chapter>/<verse>.mp3`
in the website repo, served as `https://dharmagranth.dev/audio/...` (cache rule in `public/_headers`).
`src/audio/recitations.json` lists which verses have audio, so the play button appears only there; add a
chapter to it in the same change that adds its files. The first play streams the file and saves it in the
app's cache folder (`src/audio/recitation.ts`); later plays are offline. `src/audio/player.tsx` holds one
shared `expo-audio` player, so one verse sounds at a time and "Listen" moves through the chapter.

Playback is foreground only. The `expo-audio` plugin in `app.json` turns off recording and the background
playback service, so the only permission it adds is `MODIFY_AUDIO_SETTINGS` (a normal, install-time
permission with no prompt). No data is collected: the app makes plain GET requests for public files.

The pilot was generated with ElevenLabs (`eleven_v4`, voice "Kuber J - Calm, Devotional & Meditative"),
one generation per verse from the Sanskrit text with `[slowly] [softly]` in front and the verse number
removed. The app shows the credit line from `recitations.json`.

## Checks

```bash
npm run typecheck
npm run lint
npm test          # unit tests, plus a check that every bundled verse keeps all its Sanskrit lines
```

To publish on Google Play, follow [RELEASE.md](RELEASE.md).
