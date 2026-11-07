import { defineConfig, devices } from '@playwright/test';

/**
 * Browser smoke test of the built site: `npm run build && npm run test:e2e`.
 * Serves dist/ with scripts/serve-dist.mjs, which applies public/_headers
 * (CSP included) the way Cloudflare Pages does.
 */
const PORT = process.env.PORT || '4180';

export default defineConfig({
  testDir: 'tests',
  // Browser specs only: *.test.* files are node:test unit tests (npm run test:*).
  testMatch: '**/*.spec.ts',
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    ...devices['Desktop Chrome'],
  },
  webServer: {
    command: 'node scripts/serve-dist.mjs',
    url: `http://localhost:${PORT}`,
    env: { PORT },
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
