# Releasing to Google Play

The app ID is `dev.dharmagranth.app`. It can never change after the first upload.

## 1. Build the release bundle

```bash
cd mobile
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile production
```

- On the first build, let EAS generate the Android keystore. EAS keeps it. This key becomes the
  **upload key**, and Google holds the real app signing key (Play App Signing). Download a backup with
  `npx eas-cli@latest credentials` and store it somewhere safe outside the repo.
- `versionCode` lives on EAS (`appVersionSource: remote`) and goes up by one on every production build.
  Change `version` in `app.json` (1.0.0, 1.0.1…) for the version name users see.

## 2. First upload (by hand, once)

Google's API cannot create an app, so the first bundle goes up through the Play Console:

1. Play Console → **Create app**: name "Dharma Granth", default language, App, Free.
2. **Testing → Internal testing → Create release**, upload the `.aab` from the EAS build page,
   and accept Play App Signing.
3. Add yourself as a tester and install from the opt-in link.

## 3. Store listing and policy forms

Fill these under **Grow → Store presence** and **Policy → App content**:

- **Privacy policy:** https://dharmagranth.dev/privacy/
- **Data safety:** the app collects no data and shares none. Bookmarks, settings and backups stay on the
  phone, and there is no account, analytics or ads. Links to dharmagranth.dev open in the browser.
- **Ads:** no ads. **Content rating:** fill the questionnaire (reference/education, no user content).
- **Target audience:** 13+ is the simplest choice (picking under-13 brings the Families policy).
- **Listing assets:** 512×512 icon, 1024×500 feature graphic, at least 2 phone screenshots,
  short description (80 characters) and full description, in English and Hindi.

## 4. Closed testing (personal accounts made after Nov 2023)

Such accounts need a closed test with at least 12 testers opted in for 14 days in a row before
**Apply for production** appears. Organization accounts and older personal accounts can skip this.

## 5. Later releases with EAS Submit

1. Play Console → **Setup → API access**: create a Google Cloud service account, grant it
   "Release to testing tracks" (and production when ready), and download its JSON key.
2. Save the key as `mobile/play-service-account.json` (git-ignored, never commit it).
3. Build and submit in one go:

```bash
npx eas-cli@latest build --platform android --profile production --auto-submit
```

`eas.json` sends builds to the **internal** track as a **draft**, so nothing reaches users until you
roll it out in the Play Console. Use a staged rollout (for example 20%, then 100%) for production.

## Permissions

`app.json` asks only for `INTERNET` and blocks microphone, overlay and storage permissions that
libraries can add by default, so the Data safety answers stay true. Check
**App bundle explorer → Permissions** in the Play Console after each build that adds a native module.
