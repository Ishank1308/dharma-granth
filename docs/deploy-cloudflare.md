# Deploying to Cloudflare Pages

The site outgrew GitHub Pages: with every chapter's verses in the HTML and a
page per verse, the export is ~1.3 GB, over GitHub Pages' 1 GB site limit.
Cloudflare Pages has no total-size limit (it allows 20,000 files and 25 MiB
per file, which `npm run build` checks), serves `public/_headers` (HSTS,
CSP, caching), and has edge locations across India.

The build still runs in GitHub Actions
(`.github/workflows/deploy-cloudflare.yml`) and uploads the result with
`wrangler`. Until the two secrets below exist, that workflow builds and checks
but does not deploy — the live site stays on GitHub Pages, untouched.

Nothing here changes the live site until step 5 (the domain switch).

## 1. Cloudflare account and project

1. Sign up at <https://dash.cloudflare.com> (the free plan is enough).
2. Create the Pages project **`dharma-granth`** (the name the workflow uses):
   - **Workers & Pages → Create → Pages → Upload assets**, name it
     `dharma-granth`, and upload any small folder to create it; or
   - from this repo: `npx wrangler login`, then
     `npx wrangler pages project create dharma-granth --production-branch=master`.
3. Note your **Account ID** (Workers & Pages overview, right-hand sidebar).

## 2. API token

1. **My Profile → API Tokens → Create Token → Create Custom Token.**
2. Permissions: **Account · Cloudflare Pages · Edit**. Account resources:
   your account. No zone permissions needed.
3. Create it and copy the token (shown once).

## 3. GitHub secrets

In the GitHub repo: **Settings → Secrets and variables → Actions → New
repository secret**, add:

| Name | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | the token from step 2 |
| `CLOUDFLARE_ACCOUNT_ID` | the Account ID from step 1 |

## 4. First deploy (on the preview domain)

Push to `master`, or run **Actions → Deploy Cloudflare Pages → Run workflow**.
A cold build takes about 15 minutes. The slow part is GitHub Actions, before
Cloudflare receives the upload: checkout, the static export of about 6,200
pages, then the browser smoke test. Verse share images are the large
avoidable piece (about 2,300 images, ~3.5 minutes) and are redrawn only when
that verse's text or the image template changes. Later builds also reuse the
Next.js compile cache and the Playwright browser.

Check the preview at **<https://dharma-granth.pages.dev>**:

```bash
curl -sI https://dharma-granth.pages.dev/ | grep -iE "strict-transport|content-security|x-content-type"
curl -s https://dharma-granth.pages.dev/scripture/bhagavadgita/chapter/2/ | grep -c "कर्मण्येवाधिकारस्ते"
curl -s https://dharma-granth.pages.dev/scripture/bhagavadgita/chapter/2/verse/47/ | grep -c FAQPage
```

Expect the three headers, and a count of 1 or more for the other two. Open a
few pages in a browser and check the console shows no "Content Security
Policy" errors.

## 5. Configure dharmagranth.dev on Cloudflare Pages

Since `dharmagranth.dev` was purchased directly on Cloudflare Registrar:

1. **Attach it to Pages:**
   - In Cloudflare Dashboard → **Workers & Pages** → select **`dharma-granth`** project.
   - Go to the **Custom domains** tab.
   - Click **Set up a custom domain** → enter `dharmagranth.dev` → **Continue** → **Activate domain**.
   - Repeat for `www.dharmagranth.dev` (enter `www.dharmagranth.dev` → **Activate domain**).
   - Cloudflare automatically manages the DNS CNAME/ALIAS records because the domain is registered on Cloudflare.

2. **Remove the old dharmagranth.in domain:**
   - Under the same **Custom domains** tab in `dharma-granth` Pages project:
   - Find `dharmagranth.in` and `www.dharmagranth.in` in the list.
   - Click the `...` (three dots) menu on the right of each → select **Remove domain** and confirm.
   - (Optional) If you still own `dharmagranth.in`: Go to the `dharmagranth.in` zone → **Rules** → **Redirect Rules** → Create rule: Redirect all requests to `https://dharmagranth.dev/$1` (301 Permanent) to preserve existing backlinks and SEO traffic.

3. **SSL/TLS & Security:**
   - For `dharmagranth.dev`: In **SSL/TLS → Overview**, ensure encryption mode is **Full** or **Full (strict)**.
   - In **Edge Certificates**, enable **Always Use HTTPS**.

4. **Verify deployment:**
   - Test against `https://dharmagranth.dev`:
   ```bash
   curl -sI https://dharmagranth.dev/ | grep -iE "strict-transport|content-security|x-content-type"
   curl -s https://dharmagranth.dev/scripture/bhagavadgita/chapter/2/ | grep -c "कर्मण्येवाधिकारस्ते"
   ```

## 6. Retire GitHub Pages and Update Search Console

Once `dharmagranth.dev` serves from Cloudflare:

1. GitHub repo **Settings → Pages**: set the source to **None**.
2. In Google Search Console, add `dharmagranth.dev` as a Domain property and submit `https://dharmagranth.dev/sitemap.xml`.
3. Delete `.github/workflows/deploy.yml` (already manual-only).

## From pull request to live site

- **CI on a pull request** (`ci.yml`) runs lint, type check and sitemap tests
  in one job while another builds the export. The browser tests then run in
  four parallel shards, and the same export is deployed as a preview at
  `https://pr-<number>.dharma-granth.pages.dev` (linked in a comment on the
  pull request; Cloudflare marks previews `noindex`). The required check
  **Validate static export** passes only when lint, build and every shard pass.
- **Merging** pushes to `master`. When the merged tree is exactly the one the
  pull request's last passing CI run built, `deploy-cloudflare.yml` downloads
  that export (kept three days as an Actions artifact) and deploys it without
  building again. It checks out only `functions/`, `lib/` and the three
  post-deploy scripts and skips `npm ci`, so this path takes about two
  minutes. Files the preview already uploaded are not sent again. If
  master moved in between, CI failed, or the artifact is gone, the deploy
  builds and checks the export itself, as it always did.
- **Build ID**: `next build` runs with a fixed placeholder ID, and
  `scripts/stabilize-build-id.mjs` (first postbuild step) replaces it with a
  hash of `_next/static`. Two builds of the same code give byte-identical
  pages, so Cloudflare uploads only pages whose content changed instead of
  all ~15,500 that carry the ID. Any change to browser code still gives a new
  ID, so Next's reload on a version mismatch keeps working.
- **Auto-merge**: enable it under **Settings → General → Pull Requests →
  Allow auto-merge**, and make **Validate static export** a required check on
  `master` (**Settings → Branches**). A pull request set to auto-merge then
  merges, and goes live, as soon as CI passes.

## Optional

- **Web Analytics:** Workers & Pages → `dharma-granth` → Metrics → enable
  Web Analytics. The CSP in `public/_headers` already allows its script.
- **HSTS preload:** `_headers` sends HSTS without `preload` on purpose.
  Add `preload` and submit at <https://hstspreload.org> only once every
  subdomain is permanently HTTPS — it is hard to undo.

## Rollback

Workers & Pages → `dharma-granth` → Deployments → pick an earlier deployment
→ **Rollback**. (Pointing DNS back to GitHub Pages is not an option: the
current export is too large for it.)

## Limits the build enforces

`npm run build` fails before deploy if the export has more than 20,000 files
or any file over 25 MiB (`scripts/prune-export.mjs`). It also prunes files no
page needs (chapter data already inlined, full-book JSON, unlinked `.zip`
archives). Test the production build locally, with `_headers` applied:

```bash
npm run build
npm run serve:dist
```
