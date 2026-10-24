/** @type {import('next').NextConfig} */
// Base path for subdirectory deploys (e.g. GitHub Pages project sites served
// from /<repo>). Set via NEXT_PUBLIC_BASE_PATH in CI; empty for root/local.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

// GitHub Actions sets CI and already runs lint and `tsc --noEmit` before
// `next build`. Skipping Next's second pass saves about half a minute per deploy.
const skipBuildChecks = process.env.CI === 'true';

const nextConfig = {
  output: 'export',
  // NEXT_DIST_DIR lets a second dev server run beside another one without both rewriting dist/.
  distDir: process.env.NEXT_DIST_DIR || 'dist',
  basePath: basePath,
  assetPrefix: basePath || undefined,
  eslint: { ignoreDuringBuilds: skipBuildChecks },
  typescript: { ignoreBuildErrors: skipBuildChecks },
  // Emit directory-style pages (practice/index.html instead of practice.html)
  // so URLs typed with a trailing slash also resolve on GitHub Pages.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    // Tree-shake barrel imports (lucide-react icons) per-module so page
    // bundles only carry the icons they render.
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = nextConfig;
