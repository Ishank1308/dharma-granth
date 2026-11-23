import type { Metadata, Viewport } from "next";
import { SiteNav } from "@/app/components/SiteNav";
import { SiteFooter } from "@/app/components/SiteFooter";
import { getSiteShellData } from "@/lib/site-shell-data";
import { DEFAULT_THEME, THEME_IDS } from "@/lib/site-theme";
import { ThemeProvider } from "@/app/components/ThemeProvider";
import { PageTransition } from "@/app/components/motion/PageTransition";
import { RouteTransitions } from "@/app/components/motion/RouteTransitions";
import { DEFAULT_OG_IMAGE } from "@/lib/og";
import { TactileLayer } from "@/app/components/TactileLayer";
import { MotionLayer } from "@/app/components/motion/MotionLayer";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";
import { OfflineIndicator } from "@/app/components/OfflineIndicator";

import { MananaSelectionBar } from "@/app/components/ClientOverlays";
// Fonts: @font-face rules for /fonts live in globals.css (one source per weight, 400/600/700).
// Design system: tokens first, then the base styles, the shared components and motion (docs/design-system.md).
import "./styles/tokens.css";
import "./globals.css";
import "./styles/components.css";
// The motion system (reveals, tilt, hero halo, theme transition) sits over the base styles.
import "./motion.css";
// Chapter scenes behind the shloka (lib/chapter-scenes.ts); only pages with data-scene use them.
import "./styles/scenes.css";
// Page transitions (lib/view-transition.ts): verse to verse, chapter to chapter, opening a verse.
import "./styles/page-transitions.css";
import "./styles/title-fold.css";
// Colour and life (the sacred spectrum on cards, buttons, titles and the page aurora) goes last.
import "./styles/colour.css";
import "./styles/scene-photos.css";
import "./styles/scene-photos.generated.css";
// The same photos at the top of festival, character, mantra and section pages (lib/page-photos.ts).
import "./styles/page-photos.css";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";
import { PwaInstallBanner } from "./components/PwaInstallBanner";
import { StoragePersistenceRequest } from "@/app/components/StoragePersistenceRequest";

/**
 * Inline script that runs synchronously before React hydrates so the
 * theme attribute is set on <html> in the first paint. Without this,
 * users would see a flash of the default (day) theme before the
 * ThemeProvider's useEffect runs and applies their stored preference.
 */
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var saved = localStorage.getItem('dharma-theme');
    // Light is the existing sunset palette; Dark is the existing night palette.
    // Migrate old preferences before first paint so neither page nor toolbar flashes.
    var lightLegacy = saved === 'sunset' || saved === 'day' || saved === 'paper' || saved === 'light';
    var darkLegacy = saved === 'night' || saved === 'dark';
    var normalized = lightLegacy ? 'sunset'
      : darkLegacy ? 'night'
      : saved === 'auto'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'sunset')
        : ${JSON.stringify(DEFAULT_THEME)};
    document.documentElement.setAttribute('data-theme', normalized);
    if (saved !== normalized) {
      try { localStorage.setItem('dharma-theme', normalized); } catch (e) {}
    }
  } catch (e) {}
  // Data Saver (lib/performance-mode.ts decides it the same way at hydration), so no chapter or
  // page photo starts downloading before then.
  try {
    var ds = localStorage.getItem('dharma.perf.dataSaver');
    var conn = navigator.connection;
    if (ds === 'true' || (ds === null && conn && (conn.saveData || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g'))) {
      document.documentElement.setAttribute('data-data-saver', 'true');
    }
  } catch (e) {}
  // The time of day, for the home hero's light and greeting (app/styles/colour.css): the
  // hour before dawn (brahma muhurta), morning, day, the evening sandhya, night.
  try {
    var h = new Date().getHours();
    document.documentElement.setAttribute('data-daypart', h < 4 ? 'night' : h < 6 ? 'brahma' : h < 11 ? 'morning' : h < 16 ? 'day' : h < 19 ? 'sandhya' : 'night');
  } catch (e) {}
  // The reader's language choice (lib/useLanguagePreference.ts), so two-language labels show
  // in that language from the first paint. द्विभाषी, the default, sets nothing.
  try {
    var lang = JSON.parse(localStorage.getItem('dharma.language_preference') || 'null');
    if (lang === 'hindi' || lang === 'english' || lang === 'sanskrit') {
      document.documentElement.setAttribute('data-ui-lang', lang);
      document.documentElement.setAttribute('lang', lang === 'english' ? 'en' : lang === 'sanskrit' ? 'sa' : 'hi');
    }
  } catch (e) {}
  // The home-page splash plays once per browser session; later page loads
  // skip it before first paint. Landing on any other page first also counts
  // as seen. Without storage it simply plays on each home-page load.
  try {
    var base = ${JSON.stringify(process.env.NEXT_PUBLIC_BASE_PATH || "")};
    var path = location.pathname;
    if (base && path.indexOf(base) === 0) path = path.slice(base.length);
    var isHome = path === '' || path === '/';
    if (sessionStorage.getItem('dharma-splash') || !isHome) {
      document.documentElement.setAttribute('data-splash', 'seen');
    }
    sessionStorage.setItem('dharma-splash', '1');
  } catch (e) {}
})();
`;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dharmagranth.dev";
const SITE_NAME = "Dharma Granth";
const DEFAULT_TITLE = "Dharma Granth — Hindu Scriptures, Verse by Verse";
const DEFAULT_DESCRIPTION =
  "Scriptural study, verse by verse: the Bhagavad Gita, Upanishads, and more in original Sanskrit, with Hindi and English study aids. A free, ad-free research edition.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s — Dharma Granth",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Bhagavad Gita",
    "Upanishads",
    "Hindu scripture",
    "Sanskrit verses",
    "Vedas",
    "Hindi commentary",
    "scriptural study",
    "traditional perspectives",
    "dharma",
    "verse meaning",
  ],
  authors: [{ name: "Dharma Granth" }],
  creator: "Dharma Granth",
  publisher: "Dharma Granth",
  openGraph: {
    type: "website",
    locale: "hi_IN",
    alternateLocale: ["en_US"],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
  // Generated by `npm run og:build` (scripts/generate-og-images.ts).
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  // Google Search Console ownership proof for https://dharmagranth.dev/
  // (URL-prefix property). Env var overrides for other environments.
  // Two tokens: the original one, and the one for the Google account that
  // owns the dharmagranth.in property (needed for Change of address).
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      : [
          "YWMSMR_2e_0e1w2nqm5_sMRIgnkVNgF-6IRNRRdyYS4",
          "t9brLjsi00E56cVIRni03_3yypFjqsJ5NRA0WQBLhRk",
        ],
  },
  category: "religion",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff4e5" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: ["Dharm Granth", "Dharam Granth", "Dharmagranth", "DharmaGranth", "धर्म ग्रंथ", "धर्मग्रंथ"],
      url: `${SITE_URL}/`,
      // Square, per Google's logo guidelines (min 112×112). Built by
      // scripts/build-logo.mjs from assets/logo-source.webp.
      logo: `${SITE_URL}/logo.png`,
      image: `${SITE_URL}${DEFAULT_OG_IMAGE.url}`,
      description: DEFAULT_DESCRIPTION,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      // Spellings readers search with (Search Console, 2026-10): "dharm granth", "dharam granth", "dharmgranth", "धर्म ग्रंथ".
      alternateName: ["Dharm Granth", "Dharam Granth", "Dharmagranth", "DharmaGranth", "धर्म ग्रंथ", "धर्मग्रंथ"],
      description: DEFAULT_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: ["hi", "sa", "en"],
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/scriptures/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const shell = getSiteShellData();

  return (
    <html lang="hi" data-theme={DEFAULT_THEME} suppressHydrationWarning>
      <head>
        <meta name="dharma-library-verse-count" content={String(shell.libraryVerses)} />
        <meta name="dharma-theme-options" content={THEME_IDS.join(',')} />
        <meta name="dharma-ui-script" content="Devanagari,Latin" />
        {/* Preload only critical font files to minimize layout shifts (CLS) and accelerate LCP */}
        <link
          rel="preload"
          href="/fonts/noto-devanagari-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/inter-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/newsreader-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Dharma Granth — Daily Sacred Verse &amp; Wisdom"
          href="/feed.xml"
        />
        {/* The splash logo is preloaded by its own priority <Image> on the home page only, not
            on every page (it was fetched at high priority everywhere and never shown). */}

        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </head>
      <body className="font-sans bg-dharma-bg text-dharma-text antialiased">
        <ThemeProvider>
          <a href="#main-content" className="skip-link" lang="en">
            Skip to main content
          </a>
          <SiteNav
            libraryVerses={shell.libraryVerses}
            gitaChapters={shell.gita.chapters}
            gitaVerses={shell.gita.verses}
            ashtavakraChapters={shell.ashtavakra.chapters}
            ashtavakraVerses={shell.ashtavakra.verses}
          />
          <div id="main-content" tabIndex={-1} className="outline-none">
            <ErrorBoundary name="Main Content">
              <PageTransition>{children}</PageTransition>
            </ErrorBoundary>
            <SiteFooter />
          </div>
          <ErrorBoundary name="Manana Selection">
            <MananaSelectionBar />
          </ErrorBoundary>
          <TactileLayer />
          <MotionLayer />
          <RouteTransitions />
          <OfflineIndicator />
          <ServiceWorkerRegister />
          <StoragePersistenceRequest />
          <PwaInstallBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
