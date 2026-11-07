/**
 * Pre-generate per-scripture OG share images as static PNGs.
 *
 * Why this exists: Next 14.2 has a bug with `app/.../opengraph-image.tsx`
 * under `output: 'export'` — the build worker returns empty prerenderRoutes
 * regardless of what generateStaticParams returns. So we sidestep the
 * metadata-route machinery and pre-bake PNGs at build time using the same
 * underlying engine (satori) that @vercel/og uses.
 *
 * Output:
 *   public/og/<scriptureId>.png        1200 x 630 share image
 *   public/og/thumb/<scriptureId>.webp 720px card thumbnail (~15 KB vs ~220 KB)
 *   public/og-default.png              site-wide share image / JSON-LD logo
 *   public/icons/*, public/favicon.svg app icons for tabs, home screens, manifest
 *
 *   public/og/verse/<id>/<chapter>-<verse>.jpg   per-verse share image (`npm run og:verses`)
 *
 * Run: npm run og:build
 *      npm run og:verses
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
// @ts-expect-error — wawoff2 ships no types
import wawoff2 from "wawoff2";
import { scriptureCatalog } from "../data/scripture-meta";
import type { ScriptureMeta } from "../data/types";
import { readSeededChapter } from "../lib/read-seeded-chapters";
import { withPassageMeaning } from "../lib/verse-format";
import { VERSE_PAGE_SCRIPTURE_IDS, verseSlug, verseStaticParams } from "../lib/verse-pages";
import { SACRED_MANTRAS, type SacredMantra } from "../data/mantras";
import { NAKSHATRA_DATA, nakshatraSlug, UNIQUE_TITHI_ARCHETYPES, type UniqueTithi, YOGA_DATA, type YogaMeta, getAllKaranas, type KaranaMeta, VARA_DATA, type VaraMeta } from "../lib/panchang";

const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "public/og");
const THUMB_DIR = resolve(OUT_DIR, "thumb");
const ICON_DIR = resolve(ROOT, "public/icons");
const FONT_CACHE = resolve(ROOT, "scripts/.fonts");
// Sits in the cached verse-image directory. Bump when the layout changes.
// prune-export removes the copy Next places in dist/ so it is not deployed.
const VERSE_IMAGE_REV = "1";
const VERSE_STAMPS = resolve(OUT_DIR, "verse", "_stamps.json");

// Library cards are at most ~360 CSS px wide; 720 covers 2x screens.
const THUMB_WIDTH = 720;

const WIDTH = 1200;
const HEIGHT = 630;

// SIL Open Font License — permissive, fine to embed in distributed images.
// Satori needs static TTF instances. @fontsource ships .woff2 only, so we
// decode each one to TTF at script time and cache the result on disk.
const FONTS = [
  {
    cacheName: "NotoSans-Regular.ttf",
    woff2: "node_modules/@fontsource/noto-sans/files/noto-sans-latin-400-normal.woff2",
    family: "Noto Sans",
    weight: 400 as const,
  },
  {
    cacheName: "NotoSans-Bold.ttf",
    woff2: "node_modules/@fontsource/noto-sans/files/noto-sans-latin-700-normal.woff2",
    family: "Noto Sans",
    weight: 700 as const,
  },
  // Latin Extended (ā ṇ ṣ ṛ ṁ ḥ …) for IAST transliteration. Its own family
  // name, listed after "Noto Sans" in fontFamily: satori does not fall back
  // between two fonts registered under the same name.
  {
    cacheName: "NotoSans-LatinExt-Regular.ttf",
    woff2: "node_modules/@fontsource/noto-sans/files/noto-sans-latin-ext-400-normal.woff2",
    family: "Noto Sans Ext",
    weight: 400 as const,
  },
  {
    cacheName: "NotoSans-LatinExt-Bold.ttf",
    woff2: "node_modules/@fontsource/noto-sans/files/noto-sans-latin-ext-700-normal.woff2",
    family: "Noto Sans Ext",
    weight: 700 as const,
  },
  {
    cacheName: "NotoSansDevanagari-Bold.ttf",
    woff2: "node_modules/@fontsource/noto-sans-devanagari/files/noto-sans-devanagari-devanagari-700-normal.woff2",
    family: "Noto Sans Devanagari",
    weight: 700 as const,
  },
];

interface SatoriFont {
  name: string;
  data: Buffer;
  weight: 400 | 700;
  style: "normal";
}

async function woff2ToTtf(woff2Buffer: Buffer): Promise<Buffer> {
  const ttfUint8 = (await wawoff2.decompress(woff2Buffer)) as Uint8Array;
  return Buffer.from(ttfUint8);
}

async function loadFont(spec: (typeof FONTS)[number]): Promise<Buffer> {
  const cachePath = resolve(FONT_CACHE, spec.cacheName);
  if (existsSync(cachePath)) return readFileSync(cachePath);

  const woff2Path = resolve(ROOT, spec.woff2);
  if (!existsSync(woff2Path)) {
    throw new Error(`Missing source woff2 at ${woff2Path}. Did npm install run?`);
  }
  mkdirSync(FONT_CACHE, { recursive: true });
  const ttf = await woff2ToTtf(readFileSync(woff2Path));
  writeFileSync(cachePath, ttf);
  return ttf;
}

async function loadFonts(): Promise<SatoriFont[]> {
  const out: SatoriFont[] = [];
  for (const f of FONTS) {
    const data = await loadFont(f);
    out.push({ name: f.family, data, weight: f.weight, style: "normal" });
  }
  return out;
}

function categoryAccent(category: ScriptureMeta["category"]): { from: string; to: string; label: string } {
  switch (category) {
    case "veda":
      return { from: "#7c2d12", to: "#ea580c", label: "Veda" };
    case "upanishad":
      return { from: "#1e3a8a", to: "#3b82f6", label: "Upanishad" };
    case "itihasa":
      return { from: "#9a3412", to: "#f59e0b", label: "Itihasa" };
    case "purana":
      return { from: "#7e22ce", to: "#c084fc", label: "Purana" };
    case "smriti":
      return { from: "#374151", to: "#9ca3af", label: "Smriti" };
    case "tantra":
      return { from: "#831843", to: "#ec4899", label: "Tantra" };
    case "stotra":
      return { from: "#92400e", to: "#fbbf24", label: "Stotra" };
    default:
      return { from: "#1f2937", to: "#6b7280", label: "Scripture" };
  }
}

function shortDescription(s: string, maxLen = 180): string {
  if (s.length <= maxLen) return s;
  const cut = s.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + "…";
}

function ogTemplate(meta: ScriptureMeta) {
  const accent = categoryAccent(meta.category);
  const titleFontSize = meta.titleSanskrit.length > 18 ? 56 : 72;

  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 80px",
        background: `linear-gradient(135deg, ${accent.from} 0%, ${accent.to} 100%)`,
        color: "white",
        fontFamily: "Noto Sans",
      },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column" },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 22,
                    opacity: 0.85,
                    letterSpacing: 8,
                    textTransform: "uppercase",
                    marginBottom: 28,
                  },
                  children: `Dharma Granth · ${accent.label}`,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: titleFontSize,
                    fontWeight: 700,
                    lineHeight: 1.05,
                    maxWidth: 1040,
                  },
                  children: meta.title,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 44,
                    marginTop: 24,
                    opacity: 0.92,
                    fontFamily: "Noto Sans Devanagari",
                  },
                  children: meta.titleSanskrit,
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column" },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 24,
                    opacity: 0.88,
                    lineHeight: 1.4,
                    maxWidth: 1040,
                    marginBottom: 24,
                  },
                  children: shortDescription(meta.description),
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 22,
                    opacity: 0.75,
                    letterSpacing: 2,
                  },
                  children: "Verse by verse · Sanskrit · Hindi · English",
                },
              },
            ],
          },
        },
      ],
    },
  };
}

async function renderOne(meta: ScriptureMeta, fonts: SatoriFont[]): Promise<void> {
  const svg = await satori(ogTemplate(meta) as Parameters<typeof satori>[0], {
    width: WIDTH,
    height: HEIGHT,
    fonts,
  });
  const rawPng = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } }).render().asPng();
  const optPng = await sharp(rawPng)
    .png({ quality: 85, compressionLevel: 9, palette: true })
    .toBuffer();
  writeFileSync(resolve(OUT_DIR, `${meta.id}.png`), optPng);
  await sharp(rawPng)
    .resize({ width: THUMB_WIDTH })
    .webp({ quality: 75, effort: 6 })
    .toFile(resolve(THUMB_DIR, `${meta.id}.webp`));
}

/* ── Section OG Templates: Mantras, Nakshatras, Tithis & Hubs ──────── */

function mantraOgTemplate(mantra: SacredMantra) {
  const titleFontSize = mantra.title.length > 24 ? 54 : 64;
  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 76px",
        background: "linear-gradient(135deg, #7c2d12 0%, #b45309 45%, #ea580c 100%)",
        color: "white",
        fontFamily: "Noto Sans",
      },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column" },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 20,
                    opacity: 0.9,
                    letterSpacing: 6,
                    textTransform: "uppercase",
                    marginBottom: 22,
                  },
                  children: `Dharma Granth · ${mantra.categoryLabel}`,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: titleFontSize,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    maxWidth: 1050,
                  },
                  children: mantra.title,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 42,
                    marginTop: 18,
                    opacity: 0.95,
                    fontFamily: "Noto Sans Devanagari",
                  },
                  children: mantra.titleHi,
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column" },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 23,
                    opacity: 0.9,
                    lineHeight: 1.4,
                    maxWidth: 1040,
                    marginBottom: 22,
                  },
                  children: shortDescription(mantra.significance, 170),
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid rgba(255,255,255,0.25)",
                    paddingTop: 16,
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: { fontSize: 20, opacity: 0.85, letterSpacing: 1.5 },
                        children: mantra.sourceCoordinates,
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: { fontSize: 20, opacity: 0.85, letterSpacing: 1.5 },
                        children: "Sanskrit · Meaning · Translation",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

function nakshatraOgTemplate(n: (typeof NAKSHATRA_DATA)[number]) {
  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 76px",
        background: "linear-gradient(135deg, #090d16 0%, #1e1b4b 45%, #312e81 100%)",
        color: "white",
        fontFamily: "Noto Sans",
      },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column" },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 20,
                    opacity: 0.85,
                    letterSpacing: 6,
                    textTransform: "uppercase",
                    marginBottom: 22,
                  },
                  children: `Dharma Granth · 27 Vedic Nakshatras (${n.index + 1}/27)`,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 66,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    maxWidth: 1050,
                  },
                  children: `${n.name} Nakshatra`,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 42,
                    marginTop: 18,
                    opacity: 0.95,
                    fontFamily: "Noto Sans Devanagari",
                  },
                  children: `${n.nameHi} नक्षत्र`,
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column" },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 23,
                    opacity: 0.9,
                    lineHeight: 1.4,
                    maxWidth: 1040,
                    marginBottom: 22,
                  },
                  children: shortDescription(n.explanation, 170),
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid rgba(255,255,255,0.2)",
                    paddingTop: 16,
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: { fontSize: 20, opacity: 0.85 },
                        children: `Deity: ${n.deity} · Lord: ${n.rulingPlanet}`,
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: { fontSize: 20, opacity: 0.85 },
                        children: `Zodiac Arc: ${n.longitude}`,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

function tithiOgTemplate(t: UniqueTithi) {
  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 76px",
        background: "linear-gradient(135deg, #18181b 0%, #27272a 45%, #78350f 100%)",
        color: "white",
        fontFamily: "Noto Sans",
      },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column" },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 20,
                    opacity: 0.85,
                    letterSpacing: 6,
                    textTransform: "uppercase",
                    marginBottom: 22,
                  },
                  children: "Dharma Granth · 16 Vedic Tithis",
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 66,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    maxWidth: 1050,
                  },
                  children: `${t.name} Tithi`,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 42,
                    marginTop: 18,
                    opacity: 0.95,
                    fontFamily: "Noto Sans Devanagari",
                  },
                  children: `${t.nameHi} (${t.categoryTypeHi})`,
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column" },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 23,
                    opacity: 0.9,
                    lineHeight: 1.4,
                    maxWidth: 1040,
                    marginBottom: 22,
                  },
                  children: shortDescription(t.explanation, 170),
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid rgba(255,255,255,0.2)",
                    paddingTop: 16,
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: { fontSize: 20, opacity: 0.85 },
                        children: `Class: ${t.categoryType} · Lord: ${t.deity}`,
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: { fontSize: 20, opacity: 0.85 },
                        children: `Arc: ${t.lunarDegrees}`,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

function yogaOgTemplate(y: YogaMeta) {
  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 76px",
        background: "linear-gradient(135deg, #022c22 0%, #064e3b 45%, #059669 100%)",
        color: "white",
        fontFamily: "Noto Sans",
      },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column" },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 20,
                    opacity: 0.85,
                    letterSpacing: 6,
                    textTransform: "uppercase",
                    marginBottom: 22,
                  },
                  children: `Dharma Granth · 27 Nitya Yogas (${y.index + 1}/27)`,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 66,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    maxWidth: 1050,
                  },
                  children: `${y.name} Yoga`,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 42,
                    marginTop: 18,
                    opacity: 0.95,
                    fontFamily: "Noto Sans Devanagari",
                  },
                  children: `${y.nameHi} (${y.natureHi})`,
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column" },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 23,
                    opacity: 0.9,
                    lineHeight: 1.4,
                    maxWidth: 1040,
                    marginBottom: 22,
                  },
                  children: shortDescription(y.explanation, 170),
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid rgba(255,255,255,0.2)",
                    paddingTop: 16,
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: { fontSize: 20, opacity: 0.85 },
                        children: `Deity: ${y.deity}`,
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: { fontSize: 20, opacity: 0.85 },
                        children: `Arc: ${y.arc}`,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

function karanaOgTemplate(k: KaranaMeta) {
  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 76px",
        background: "linear-gradient(135deg, #4c0519 0%, #881337 45%, #be123c 100%)",
        color: "white",
        fontFamily: "Noto Sans",
      },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column" },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 20,
                    opacity: 0.85,
                    letterSpacing: 6,
                    textTransform: "uppercase",
                    marginBottom: 22,
                  },
                  children: "Dharma Granth · 11 Vedic Karanas",
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 66,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    maxWidth: 1050,
                  },
                  children: `${k.name} Karana`,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 42,
                    marginTop: 18,
                    opacity: 0.95,
                    fontFamily: "Noto Sans Devanagari",
                  },
                  children: `${k.nameHi} (${k.natureHi})`,
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column" },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 23,
                    opacity: 0.9,
                    lineHeight: 1.4,
                    maxWidth: 1040,
                    marginBottom: 22,
                  },
                  children: shortDescription(k.explanation, 170),
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid rgba(255,255,255,0.2)",
                    paddingTop: 16,
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: { fontSize: 20, opacity: 0.85 },
                        children: `Deity: ${k.deity}`,
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: { fontSize: 20, opacity: 0.85 },
                        children: "6° Half-Tithi",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

function varaOgTemplate(v: VaraMeta) {
  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 76px",
        background: "linear-gradient(135deg, #451a03 0%, #7c2d12 45%, #ea580c 100%)",
        color: "white",
        fontFamily: "Noto Sans",
      },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column" },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 20,
                    opacity: 0.85,
                    letterSpacing: 6,
                    textTransform: "uppercase",
                    marginBottom: 22,
                  },
                  children: `Dharma Granth · 7 Vedic Varas · Day ${v.index + 1}`,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 66,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    maxWidth: 1050,
                  },
                  children: `${v.name} (${v.nameHi})`,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 38,
                    marginTop: 18,
                    opacity: 0.95,
                    fontFamily: "Noto Sans Devanagari",
                  },
                  children: `${v.grahaLordHi} · ${v.natureHi}`,
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column" },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 23,
                    opacity: 0.9,
                    lineHeight: 1.4,
                    maxWidth: 1040,
                    marginBottom: 22,
                  },
                  children: shortDescription(v.explanation, 170),
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid rgba(255,255,255,0.2)",
                    paddingTop: 16,
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: { fontSize: 20, opacity: 0.85 },
                        children: `Lord: ${v.grahaLord} · Element: ${v.element}`,
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: { fontSize: 20, opacity: 0.85 },
                        children: `Gemstone: ${v.gemstone}`,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

function hubOgTemplate(title: string, subtitleHi: string, description: string, tag: string, gradient: string) {
  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 80px",
        background: gradient,
        color: "white",
        fontFamily: "Noto Sans",
      },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column" },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 22,
                    opacity: 0.85,
                    letterSpacing: 8,
                    textTransform: "uppercase",
                    marginBottom: 28,
                  },
                  children: `Dharma Granth · ${tag}`,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 72,
                    fontWeight: 700,
                    lineHeight: 1.05,
                    maxWidth: 1040,
                  },
                  children: title,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 44,
                    marginTop: 24,
                    opacity: 0.92,
                    fontFamily: "Noto Sans Devanagari",
                  },
                  children: subtitleHi,
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column" },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 25,
                    opacity: 0.9,
                    lineHeight: 1.45,
                    maxWidth: 1040,
                    marginBottom: 24,
                  },
                  children: description,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 20,
                    opacity: 0.8,
                    letterSpacing: 2,
                  },
                  children: "Canonical Vedic & Upanishadic Knowledge Base · dharmagranth.dev",
                },
              },
            ],
          },
        },
      ],
    },
  };
}

async function renderMantras(fonts: SatoriFont[]): Promise<void> {
  const mantraDir = resolve(OUT_DIR, "mantra");
  mkdirSync(mantraDir, { recursive: true });
  for (const m of SACRED_MANTRAS) {
    const svg = await renderSvg(mantraOgTemplate(m), WIDTH, HEIGHT, fonts);
    const optPng = await svgToOptimizedPng(svg, WIDTH);
    writeFileSync(resolve(mantraDir, `${m.slug}.png`), optPng);
  }
  console.log(`  ✓ ${SACRED_MANTRAS.length} mantra OG images in public/og/mantra/`);
}

async function renderNakshatras(fonts: SatoriFont[]): Promise<void> {
  const nakshatraDir = resolve(OUT_DIR, "nakshatra");
  mkdirSync(nakshatraDir, { recursive: true });
  for (const n of NAKSHATRA_DATA) {
    const slug = nakshatraSlug(n.name);
    const svg = await renderSvg(nakshatraOgTemplate(n), WIDTH, HEIGHT, fonts);
    const optPng = await svgToOptimizedPng(svg, WIDTH);
    writeFileSync(resolve(nakshatraDir, `${slug}.png`), optPng);
  }
  console.log(`  ✓ ${NAKSHATRA_DATA.length} nakshatra OG images in public/og/nakshatra/`);
}

async function renderTithis(fonts: SatoriFont[]): Promise<void> {
  const tithiDir = resolve(OUT_DIR, "tithi");
  mkdirSync(tithiDir, { recursive: true });
  for (const t of UNIQUE_TITHI_ARCHETYPES) {
    const svg = await renderSvg(tithiOgTemplate(t), WIDTH, HEIGHT, fonts);
    const optPng = await svgToOptimizedPng(svg, WIDTH);
    writeFileSync(resolve(tithiDir, `${t.slug}.png`), optPng);
  }
  console.log(`  ✓ ${UNIQUE_TITHI_ARCHETYPES.length} tithi OG images in public/og/tithi/`);
}

async function renderYogas(fonts: SatoriFont[]): Promise<void> {
  const yogaDir = resolve(OUT_DIR, "yoga");
  mkdirSync(yogaDir, { recursive: true });
  for (const y of YOGA_DATA) {
    const svg = await renderSvg(yogaOgTemplate(y), WIDTH, HEIGHT, fonts);
    const optPng = await svgToOptimizedPng(svg, WIDTH);
    writeFileSync(resolve(yogaDir, `${y.slug}.png`), optPng);
  }
  console.log(`  ✓ ${YOGA_DATA.length} yoga OG images in public/og/yoga/`);
}

async function renderKaranas(fonts: SatoriFont[]): Promise<void> {
  const karanaDir = resolve(OUT_DIR, "karana");
  mkdirSync(karanaDir, { recursive: true });
  for (const k of getAllKaranas()) {
    const svg = await renderSvg(karanaOgTemplate(k), WIDTH, HEIGHT, fonts);
    const optPng = await svgToOptimizedPng(svg, WIDTH);
    writeFileSync(resolve(karanaDir, `${k.slug}.png`), optPng);
  }
  console.log(`  ✓ ${getAllKaranas().length} karana OG images in public/og/karana/`);
}

async function renderVaras(fonts: SatoriFont[]): Promise<void> {
  const varaDir = resolve(OUT_DIR, "vara");
  mkdirSync(varaDir, { recursive: true });
  for (const v of VARA_DATA) {
    const svg = await renderSvg(varaOgTemplate(v), WIDTH, HEIGHT, fonts);
    const optPng = await svgToOptimizedPng(svg, WIDTH);
    writeFileSync(resolve(varaDir, `${v.slug}.png`), optPng);
  }
  console.log(`  ✓ ${VARA_DATA.length} vara OG images in public/og/vara/`);
}

async function renderHubCards(fonts: SatoriFont[]): Promise<void> {
  const hubs = [
    {
      file: "mantras.png",
      title: "Sacred Mantras & Stotras",
      subtitleHi: "पवित्र वैदिक मन्त्र एवं स्तोत्र",
      desc: "Complete lyrics, word-by-word padaccheda meanings, Hindi & English translations, and spiritual significance of the most sacred hymns.",
      tag: "Mantras & Suktas",
      gradient: "linear-gradient(135deg, #7c2d12 0%, #b45309 45%, #ea580c 100%)",
    },
    {
      file: "nakshatras.png",
      title: "The 27 Vedic Nakshatras",
      subtitleHi: "27 वैदिक नक्षत्र मण्डल",
      desc: "Comprehensive Vedic astronomy and spiritual wisdom for all 27 lunar asterisms from Ashwini to Revati, with presiding deities, symbols, and Taittiriya Brahmana Suktas.",
      tag: "Vedic Astronomy",
      gradient: "linear-gradient(135deg, #090d16 0%, #1e1b4b 45%, #312e81 100%)",
    },
    {
      file: "tithis.png",
      title: "The 16 Vedic Tithis",
      subtitleHi: "16 वैदिक तिथियाँ",
      desc: "The classical 16 lunar phases of the Vedic calendar, categorized across the 5 harmonic Pancha Tithi classes: Nanda, Bhadra, Jaya, Rikta, and Poorna.",
      tag: "Vedic Calendar",
      gradient: "linear-gradient(135deg, #18181b 0%, #27272a 45%, #78350f 100%)",
    },
    {
      file: "varas.png",
      title: "The 7 Vedic Varas",
      subtitleHi: "सप्त वासर (7 वार)",
      desc: "The seven planetary weekdays of the Vedic calendar from Ravivara to Shanivara, with presiding Graha lords, elements, and fasts.",
      tag: "Vedic Calendar",
      gradient: "linear-gradient(135deg, #451a03 0%, #7c2d12 45%, #ea580c 100%)",
    },
    {
      file: "yogas.png",
      title: "The 27 Nitya Yogas",
      subtitleHi: "27 नित्य योग",
      desc: "The 27 additive solar-lunar arcs of Vedic astronomy from Vishkambha to Vaidhriti, with presiding deities and svadhyaya contemplation.",
      tag: "Vedic Astronomy",
      gradient: "linear-gradient(135deg, #022c22 0%, #064e3b 45%, #059669 100%)",
    },
    {
      file: "karanas.png",
      title: "The 11 Vedic Karanas",
      subtitleHi: "11 करण व भद्रा विचार",
      desc: "Micro-division of the lunar month into 6° half-tithis — 7 movable (Chara) and 4 fixed (Sthira) archetypes, including Bhadra guidelines.",
      tag: "Vedic Calendar",
      gradient: "linear-gradient(135deg, #4c0519 0%, #881337 45%, #be123c 100%)",
    },
    {
      file: "panchang.png",
      title: "Vedic Panchang",
      subtitleHi: "दैनिक वैदिक पञ्चाङ्ग",
      desc: "Precise astronomical calculations for Tithi, Nakshatra, Yoga, Karana, Sunrise, Sunset, Moonrise, and sacred vratas based on the Surya-Siddhanta.",
      tag: "Panchang Calculator",
      gradient: "linear-gradient(135deg, #451a03 0%, #9a3412 50%, #d97706 100%)",
    },
    {
      file: "gita-journey.png",
      title: "Gita 18 Adhyayas Journey",
      subtitleHi: "श्रीमद्भगवद्गीता 18 अध्याय यात्रा",
      desc: "Interactive roadmap across the 3 classical Shatkas: mapping Arjuna’s inner crises to Sri Krishna’s counsel, centerpiece Mahavakyas, and dilemma resolutions.",
      tag: "Dilemma Compass",
      gradient: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 45%, #b45309 100%)",
    },
    {
      file: "solar-vratas.png",
      title: "Sacred Solar Vratas & Arghya",
      subtitleHi: "प्रमुख सौर व्रत एवं अर्घ्य विधान",
      desc: "Complete guide to Chhath Puja, Ratha Saptami, Makar Sankranti, and Bhanu Saptami with Vedic mantras and astronomical timings.",
      tag: "Solar Liturgy",
      gradient: "linear-gradient(135deg, #7c2d12 0%, #c2410c 45%, #f59e0b 100%)",
    },
    {
      file: "muhurta.png",
      title: "Vedic Muhurta Decision Matrix",
      subtitleHi: "शास्त्रीय मुहूर्त निर्णय तालिका",
      desc: "Interactive Panchanga-Shuddhi evaluation for learning, home entry, travel, enterprise, and vows with Rahu Kalam alerts and custom simulator.",
      tag: "Muhurta Shastra",
      gradient: "linear-gradient(135deg, #1e1b4b 0%, #1e40af 45%, #0284c7 100%)",
    },
    {
      file: "upakarma.png",
      title: "Upakarma & Yajnopavita Sanskara",
      subtitleHi: "उपाकर्म एवं यज्ञोपवीत संस्कार विधान",
      desc: "Vedic guide to Shravani Upakarma and Avani Avittam: Kamokarshita Japam (108 repetitions), sacred thread investiture, and the 9 divine tantus.",
      tag: "Vedic Sanskara",
      gradient: "linear-gradient(135deg, #7c2d12 0%, #b45309 45%, #d97706 100%)",
    },
  ];
  for (const h of hubs) {
    const svg = await renderSvg(hubOgTemplate(h.title, h.subtitleHi, h.desc, h.tag, h.gradient), WIDTH, HEIGHT, fonts);
    const optPng = await svgToOptimizedPng(svg, WIDTH);
    writeFileSync(resolve(OUT_DIR, h.file), optPng);
  }
  console.log(`  ✓ ${hubs.length} hub OG images in public/og/`);
}

/* ── Site-wide brand assets ─────────────────────────────────────────── */

const BRAND_FROM = "#c2410c";
const BRAND_TO = "#f59e0b";
/** Cream behind the logo emblem, matching the artwork's own background. */
const EMBLEM_BG = "#fdf6ea";

/** The logo emblem (sage, book, halo) as a data URI; built by `npm run logo:build`. */
function loadEmblem(): string {
  const path = resolve(ROOT, "assets/logo-emblem.png");
  if (!existsSync(path)) throw new Error(`${path} missing — run \`npm run logo:build\` first`);
  return `data:image/png;base64,${readFileSync(path).toString("base64")}`;
}

/** The emblem in a round cream badge. */
function emblemBadge(emblem: string, size: number, ring: string) {
  return {
    type: "div",
    props: {
      style: {
        width: size,
        height: size,
        display: "flex",
        borderRadius: size / 2,
        overflow: "hidden",
        background: EMBLEM_BG,
        border: `${Math.round(size * 0.02)}px solid ${ring}`,
        boxShadow: "0 18px 48px rgba(0,0,0,0.25)",
      },
      children: [{ type: "img", props: { src: emblem, width: size, height: size } }],
    },
  };
}

function defaultOgTemplate(emblem: string) {
  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        padding: "64px 88px",
        background: `linear-gradient(135deg, #7c2d12 0%, ${BRAND_FROM} 45%, ${BRAND_TO} 100%)`,
        color: "white",
        fontFamily: "Noto Sans",
      },
      children: [
        { type: "div", props: { style: { display: "flex", marginRight: 72 }, children: [emblemBadge(emblem, 300, "rgba(255,237,213,0.85)")] } },
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column" },
            children: [
              // No Devanagari title line: satori doesn't shape conjuncts
              // (र्म, ग्र render with a visible halant).
              { type: "div", props: { style: { fontSize: 84, fontWeight: 700, lineHeight: 1.05 }, children: "Dharma Granth" } },
              {
                type: "div",
                props: {
                  style: { fontSize: 28, marginTop: 36, opacity: 0.9, lineHeight: 1.4, maxWidth: 640 },
                  children: "Hindu scriptures, verse by verse — Sanskrit, Hindi and English. Free and ad-free.",
                },
              },
            ],
          },
        },
      ],
    },
  };
}

/**
 * ॐ on a saffron tile. `padding` is the inset as a fraction of the size;
 * maskable icons need the glyph inside the central 80% safe zone.
 */
function iconTemplate(size: number, { rounded, padding }: { rounded: boolean; padding: number }) {
  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${BRAND_FROM} 0%, ${BRAND_TO} 100%)`,
        borderRadius: rounded ? size * 0.22 : 0,
        color: "white",
        fontFamily: "Noto Sans Devanagari",
        fontWeight: 700,
        // Devanagari ॐ sits high in its em box (visual centre ~36% down);
        // top padding shifts the centred content down to the optical middle.
        fontSize: size * (1 - padding * 2) * 0.9,
        lineHeight: 1,
        paddingTop: size * 0.28 * (1 - padding * 2),
      },
      children: "ॐ",
    },
  };
}

/**
 * The logo emblem on cream, for icons large enough to show it (≥180px).
 * `padding` is the inset as a fraction of the size; maskable icons need the
 * emblem inside the central 80% safe zone.
 */
function emblemIconTemplate(
  emblem: string,
  size: number,
  { rounded, padding }: { rounded: boolean; padding: number },
) {
  const inner = Math.round(size * (1 - padding * 2));
  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: EMBLEM_BG,
        borderRadius: rounded ? size * 0.22 : 0,
      },
      children: [{ type: "img", props: { src: emblem, width: inner, height: inner } }],
    },
  };
}

async function renderSvg(tree: unknown, width: number, height: number, fonts: SatoriFont[]): Promise<string> {
  return satori(tree as Parameters<typeof satori>[0], { width, height, fonts });
}

function svgToPng(svg: string, width: number): Buffer {
  return new Resvg(svg, { fitTo: { mode: "width", value: width } }).render().asPng();
}

async function svgToOptimizedPng(svg: string, width: number): Promise<Buffer> {
  const rawPng = new Resvg(svg, { fitTo: { mode: "width", value: width } }).render().asPng();
  return sharp(rawPng)
    .png({ quality: 85, compressionLevel: 9, palette: true })
    .toBuffer();
}

type VerseStamps = { rev: string; files: Record<string, string> };

function loadVerseStamps(): VerseStamps {
  if (!existsSync(VERSE_STAMPS)) return { rev: VERSE_IMAGE_REV, files: {} };
  try {
    const parsed = JSON.parse(readFileSync(VERSE_STAMPS, "utf8")) as Partial<VerseStamps>;
    if (parsed.rev !== VERSE_IMAGE_REV || !parsed.files || typeof parsed.files !== "object") {
      return { rev: VERSE_IMAGE_REV, files: {} };
    }
    return { rev: parsed.rev, files: parsed.files };
  } catch {
    return { rev: VERSE_IMAGE_REV, files: {} };
  }
}

function verseImageStamp(label: string, opening: string, english: string): string {
  return createHash("sha256")
    .update(VERSE_IMAGE_REV)
    .update("\0")
    .update(label)
    .update("\0")
    .update(opening)
    .update("\0")
    .update(english)
    .digest("hex");
}

async function renderVerseImages(fonts: SatoriFont[]): Promise<void> {
  const params = verseStaticParams();
  console.log(`[og] rendering up to ${params.length} verse share images`);
  const stamps = loadVerseStamps();
  const nextFiles: Record<string, string> = {};
  // One parse per chapter. The param list hits the same shard once per verse.
  const chapters = new Map<string, ReturnType<typeof readSeededChapter>>();
  let written = 0;
  for (const param of params) {
    const chapterId = Number(param.chapterId);
    // JPEG: ~5× smaller than PNG for this gradient, and every link-preview
    // consumer accepts it. Path must match verseOgPath() in lib/verse-paths.
    const fileName = `${chapterId}-${param.verseId.replace(/\./g, "-")}.jpg`;
    const dir = resolve(OUT_DIR, "verse", param.id);
    const file = resolve(dir, fileName);
    const rel = `${param.id}/${fileName}`;
    const cacheKey = `${param.id}:${chapterId}`;
    if (!chapters.has(cacheKey)) chapters.set(cacheKey, readSeededChapter(param.id, chapterId));
    const seeded = chapters.get(cacheKey) ?? null;
    const verses = (seeded?.chapter.verses ?? []) as Array<{
      number?: number | string;
      transliteration?: string;
      translation?: string;
      translationSeeVerse?: number | string;
    }>;
    const found = verses.find((item) => verseSlug(item.number) === param.verseId);
    const verse = found && withPassageMeaning(verses, found);
    const meta = scriptureCatalog.find((item) => item.id === param.id);
    // Latin script only: satori does not shape Devanagari conjuncts
    // (कर्मण्येवाधिकारस्ते renders as कर्‌मण्‌ये… with visible halants), so the
    // verse is identified by its IAST opening line and English meaning. The
    // page itself carries the Devanagari.
    const clip = (text: string, max: number) =>
      text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
    const opening = clip(
      (verse?.transliteration ?? "")
        .split(/\n+|\|/)
        .map((line) => line.trim())
        .filter(Boolean)[0]
        ?.replace(/[।॥|0-9.\s]+$/g, "")
        .trim() ?? "",
      70,
    );
    const english = clip((verse?.translation ?? "").replace(/\s+/g, " ").trim(), 150);
    const label = `${meta?.title ?? param.id} ${chapterId}.${param.verseId}`;
    const stamp = verseImageStamp(label, opening, english);
    nextFiles[rel] = stamp;
    // Existence alone is not enough: a restored cache can hold a JPEG whose
    // verse text has since changed. The stamp is the text that was drawn.
    if (existsSync(file) && stamps.files[rel] === stamp) continue;
    const tree = {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #9a3412 100%)",
          color: "white",
          padding: "56px 72px",
          fontFamily: "Noto Sans, Noto Sans Ext",
        },
        children: [
          {
            type: "div",
            props: {
              style: { fontSize: 30, fontWeight: 700, opacity: 0.9 },
              children: label,
            },
          },
          ...(opening
            ? [
                {
                  type: "div",
                  props: {
                    style: { fontSize: 42, fontWeight: 700, marginTop: 28, lineHeight: 1.3 },
                    children: opening,
                  },
                },
              ]
            : []),
          ...(english
            ? [
                {
                  type: "div",
                  props: {
                    style: { fontSize: 26, marginTop: 24, opacity: 0.92, lineHeight: 1.45 },
                    children: english,
                  },
                },
              ]
            : []),
          {
            type: "div",
            props: {
              style: { fontSize: 22, marginTop: 36, opacity: 0.75 },
              children: "Dharma Granth · Sanskrit · Hindi · English",
            },
          },
        ],
      },
    };
    mkdirSync(dir, { recursive: true });
    const svg = await renderSvg(tree, WIDTH, HEIGHT, fonts);
    writeFileSync(file, await sharp(svgToPng(svg, WIDTH)).jpeg({ quality: 82, mozjpeg: true }).toBuffer());
    written++;
    if (written % 50 === 0) console.log(`  ${written} new verse images`);
  }
  mkdirSync(resolve(OUT_DIR, "verse"), { recursive: true });
  // A restored CI cache still holds images for verse pages that no longer exist (renumbered or noindexed);
  // they would be deployed and count against the Cloudflare Pages file limit.
  let removed = 0;
  for (const entry of readdirSync(resolve(OUT_DIR, "verse"), { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = resolve(OUT_DIR, "verse", entry.name);
    for (const name of readdirSync(dir)) {
      if (!name.endsWith(".jpg") || nextFiles[`${entry.name}/${name}`]) continue;
      rmSync(resolve(dir, name));
      removed++;
    }
    if (readdirSync(dir).length === 0) rmSync(dir, { recursive: true });
  }
  writeFileSync(VERSE_STAMPS, JSON.stringify({ rev: VERSE_IMAGE_REV, files: nextFiles }));
  console.log(
    `  ✓ ${written} new, ${params.length - written} already present, ${removed} stale removed (${VERSE_PAGE_SCRIPTURE_IDS.length} books)`,
  );
}

async function renderBrandAssets(fonts: SatoriFont[]): Promise<void> {
  mkdirSync(ICON_DIR, { recursive: true });
  const emblem = loadEmblem();

  const ogSvg = await renderSvg(defaultOgTemplate(emblem), WIDTH, HEIGHT, fonts);
  writeFileSync(resolve(ROOT, "public/og-default.png"), await svgToOptimizedPng(ogSvg, WIDTH));
  console.log("  ✓ og-default.png");

  // Satori emits glyphs as paths, so the SVG favicon needs no font at runtime.
  const faviconSvg = await renderSvg(iconTemplate(64, { rounded: true, padding: 0.1 }), 64, 64, fonts);
  writeFileSync(resolve(ROOT, "public/favicon.svg"), faviconSvg);
  console.log("  ✓ favicon.svg");

  // Tab-size icons keep the ॐ glyph (the emblem is illegible at 16–32px);
  // home-screen sizes carry the logo emblem.
  const pngIcons: Array<{ file: string; size: number; rounded: boolean; padding: number; emblem?: boolean }> = [
    { file: "icon-32.png", size: 32, rounded: true, padding: 0.08 },
    { file: "icon-192.png", size: 192, rounded: true, padding: 0.04, emblem: true },
    { file: "icon-512.png", size: 512, rounded: true, padding: 0.04, emblem: true },
    // Full-bleed: iOS and Android mask these themselves.
    { file: "apple-touch-icon.png", size: 180, rounded: false, padding: 0.06, emblem: true },
    { file: "icon-maskable-512.png", size: 512, rounded: false, padding: 0.12, emblem: true },
  ];
  for (const icon of pngIcons) {
    const tree = icon.emblem ? emblemIconTemplate(emblem, icon.size, icon) : iconTemplate(icon.size, icon);
    const svg = await renderSvg(tree, icon.size, icon.size, fonts);
    writeFileSync(resolve(ICON_DIR, icon.file), await svgToOptimizedPng(svg, icon.size));
    console.log(`  ✓ icons/${icon.file}`);
  }
}

async function main(): Promise<void> {
  mkdirSync(THUMB_DIR, { recursive: true });
  console.log(`[og] loading fonts...`);
  const fonts = await loadFonts();
  if (process.argv.includes("--verses")) {
    await renderVerseImages(fonts);
    console.log(`[og] verse images done.`);
    return;
  }
  if (process.argv.includes("--sections-only")) {
    console.log(`[og] rendering section OG images (mantras, nakshatras, tithis, yogas, karanas, varas, hubs)...`);
    await renderMantras(fonts);
    await renderNakshatras(fonts);
    await renderTithis(fonts);
    await renderYogas(fonts);
    await renderKaranas(fonts);
    await renderVaras(fonts);
    await renderHubCards(fonts);
    console.log(`[og] section OG images done.`);
    return;
  }
  // --brand-only: just the share image and app icons (e.g. after a logo change).
  if (!process.argv.includes("--brand-only")) {
    console.log(`[og] rendering ${scriptureCatalog.length} OG images + thumbnails to ${OUT_DIR}`);
    for (const meta of scriptureCatalog) {
      await renderOne(meta, fonts);
      process.stdout.write(`  ✓ ${meta.id}\n`);
    }
    console.log(`[og] rendering section OG images (mantras, nakshatras, tithis, yogas, karanas, varas, hubs)...`);
    await renderMantras(fonts);
    await renderNakshatras(fonts);
    await renderTithis(fonts);
    await renderYogas(fonts);
    await renderKaranas(fonts);
    await renderVaras(fonts);
    await renderHubCards(fonts);
  }
  console.log(`[og] rendering brand assets`);
  await renderBrandAssets(fonts);
  console.log(`[og] done.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
