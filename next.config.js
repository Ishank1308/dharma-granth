/** @type {import('next').NextConfig} */
const { PHASE_PRODUCTION_BUILD } = require('next/constants');

// Next inlines every NEXT_PUBLIC_* value into client JavaScript, so a secret
// set under that prefix ships to every visitor. Refuse to build with one.
const SECRET_NAME = /(KEY|TOKEN|SECRET|PASSWORD)/;
function assertNoPublicSecrets() {
  const leaked = Object.keys(process.env).filter(
    (name) => name.startsWith('NEXT_PUBLIC_') && SECRET_NAME.test(name) && process.env[name],
  );
  if (leaked.length > 0) {
    throw new Error(
      `Refusing to build: ${leaked.join(', ')} would be inlined into the public bundle. ` +
        'Remove it from .env.local / the environment; server-side scripts read the unprefixed name.',
    );
  }
}

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
    // Tree-shake barrel imports per-module so page
    // bundles only carry the components and icons they render.
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

module.exports = (phase) => {
  // `next lint` loads the config in the build phase too; it bundles nothing.
  if (phase === PHASE_PRODUCTION_BUILD && !process.argv.includes('lint')) assertNoPublicSecrets();
  return nextConfig;
};
