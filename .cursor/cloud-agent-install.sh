#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if command -v git-lfs >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git lfs pull
fi

npm ci
npm run publish:data
npm run search:core

# Browser smoke tests (npm run test:e2e) need Chromium.
if ! npx playwright install --with-deps chromium; then
  npx playwright install chromium
fi
