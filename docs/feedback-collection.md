# Clarity feedback collection (optional)

Readers can answer "Was this explanation clear?" on any simplified explanation. By default the answer stays in their browser. A reader can tick **Also share my answers anonymously with the editors**; only then is anything sent.

## What is sent, and what is stored

Sent: a verse reference such as `bhagavadgita:2:47`, a rating (`yes`, `partly`, `no`) and fixed reason ids (`language`, `example`, `long`, `context`, `source`, `vocabulary`, `source-concern`, `textual`, `other`). Nothing else: no text, no account, no identifier.

Stored: one counter per verse, rating and reason (`fb:<verse>:r:<rating>`, `fb:<verse>:w:<reason>`), plus two daily budget counters (`rl:day:<date>`, `rl:new:<date>`) that hold only a number and delete themselves after two days. The collector never reads or stores the caller's address, user agent or cookies. Sharing is off when the browser sends Do Not Track. Counts are approximate (concurrent submissions can lose an increment) and describe only readers who chose to share.

Clarity feedback is separate from correction reports, which go to GitHub issues.

## Deploying the collector

The collector is a Cloudflare Pages Function (`functions/api/feedback.ts`; logic in `lib/feedback-server.ts`, tested by `npm run test:release1`).

1. Create a KV namespace (Workers & Pages, KV) and bind it to the Pages project as `FEEDBACK` (Settings, Functions, KV namespace bindings).
2. Add a secret named `EDITORIAL_TOKEN` (Settings, Environment variables, encrypted) with a long random value. Without it, the read endpoint does not exist.
3. Deploy with `wrangler pages deploy dist` from the repository root, so the `functions` folder is included.
4. Open `/editorial`, enter the token under "Clarity feedback shared by readers", and load.

Until these are set, a share attempt gets a 503 and the reader is told nothing was sent. The CSP already allows requests to the site's own origin.

## Limits

The collector does not look at who is calling, so it cannot limit one caller. It protects itself with two shared budgets per UTC day (`lib/feedback-server.ts`):

- `DAILY_SUBMISSION_LIMIT` (300): answers accepted in a day, across all readers and verses. This caps what a script can add to the counts and how many KV writes a day can cost.
- `DAILY_NEW_COUNTER_LIMIT` (50): how many of those may start a counter that did not exist before. This stops invented verse references from filling the store and pushing real verses out of the editors' list, which reads at most 2,000 counters.

When a budget is spent the collector answers `429` with `Retry-After`, counts nothing, and the reader is told their answer stayed on the device. Budgets reset at 00:00 UTC.

What this does not do:

- The budgets are shared. Someone who spends them pauses sharing for everyone until the next day. To limit a single caller, add a Cloudflare rate limiting rule for the path `/api/feedback` in the zone's security settings, with a low per-IP threshold and the Block action. Cloudflare applies it at its edge, so the collector still never sees an address.
- KV has no atomic increment, so a burst of simultaneous requests can overshoot a budget slightly, and counts are approximate.
- A handful of answers is enough to flag a verse for editors (`LOW_CLARITY_MIN_ANSWERS`). Treat a flag as a prompt to re-read the explanation, not as a measurement.
- Verified by unit tests against an in-memory store (`npm run test:release1`); not run against a live Cloudflare deployment.
