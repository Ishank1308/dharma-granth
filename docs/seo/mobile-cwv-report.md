# Mobile Core Web Vitals & JS Payload Baseline

Measured 2026-11-22 by `scripts/seo/measure-mobile-cwv.mjs` against static export (`dist/`) in headless Chromium (`390×844`, DPR 3).
Note: Local unthrottled loopback measurement isolates layout stability (CLS), render blocking (FCP/LCP), main-thread interaction latency, and gzipped JS payload size. Field 75th-percentile CrUX / Search Console metrics on slow 4G devices will have higher network latency.

| Template | Route | FCP (ms) | LCP (ms) | CLS | Interaction (ms) | Upfront JS (KB gz) | Total w/ Prefetch (KB gz) |
|---|---|---:|---:|---:|---:|---:|---:|
| Home | `/` | 640 | 1176 | 0 | 103 | 179 KB (13) | 682 KB |
| Scripture Library | `/scriptures/` | 1108 | 1212 | 0 | 116 | 213 KB (15) | 621 KB |
| Scripture Overview (Gita) | `/scripture/bhagavadgita/` | 984 | 1004 | 0 | 35 | 153 KB (11) | 414 KB |
| Chapter Reader (Gita 2) | `/scripture/bhagavadgita/chapter/2/` | 1232 | 1296 | 0 | 68 | 206 KB (17) | 659 KB |
| Verse Page (Gita 2.47) | `/scripture/bhagavadgita/chapter/2/verse/47/` | 1104 | 1148 | 0 | 24 | 182 KB (14) | 319 KB |
| Sutra Verse Page (Yoga Sutra 1.2) | `/scripture/yogasutra/chapter/1/verse/2/` | 1224 | 1304 | 0 | 32 | 182 KB (14) | 323 KB |
| Ask Hub (Search & Q&A) | `/ask/` | 956 | 956 | 0 | 99 | 247 KB (13) | 620 KB |
