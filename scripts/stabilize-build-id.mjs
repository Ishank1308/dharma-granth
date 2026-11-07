// Give the export a build ID that changes only when the browser code does.
// Run first in postbuild, before the export checks.
//
// Next writes its build ID into every page (the "b" field of the RSC payload in
// index.html and index.txt) and names _next/static/<id>/ after it. The default
// ID is random, so every build changed ~15,500 files and Cloudflare Pages
// uploaded all of them again (2.5 to 4 minutes per deploy). next.config.js now
// builds with a fixed placeholder; this script swaps it for a hash of
// _next/static (every chunk, stylesheet and manifest). Two builds of the same
// code then produce byte-identical pages, and Cloudflare uploads only the
// pages whose content changed.
//
// The ID still changes whenever any browser code changes, so Next's
// skew protection (a hard reload when the deployed build differs from the one
// in the open tab) works as before.
import { closeSync, existsSync, openSync, readFileSync, readdirSync, renameSync, statSync, writeSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative, resolve, sep } from 'node:path';

const DIST = resolve(process.cwd(), process.env.NEXT_DIST_DIR || 'dist');
const STATIC = join(DIST, '_next', 'static');
// Keep in step with next.config.js. Same length as the final ID, so each
// occurrence is overwritten in place and no file changes length.
const PLACEHOLDER = 'dgbuildidplaceholder';
const LENGTH = PLACEHOLDER.length;

function fail(message) {
  console.error(`✗ stabilize-build-id: ${message}`);
  process.exit(1);
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

if (!existsSync(join(STATIC, PLACEHOLDER))) {
  if (existsSync(STATIC)) {
    const ids = readdirSync(STATIC).filter((n) => !['chunks', 'css', 'media'].includes(n));
    fail(`dist/_next/static/${PLACEHOLDER}/ not found (found: ${ids.join(', ') || 'none'}). Is generateBuildId in next.config.js returning the placeholder?`);
  }
  fail('dist/_next/static not found; run next build first.');
}

// 1. Hash the browser code. Paths are hashed with the placeholder dir name, so
// the result does not depend on itself.
const hash = createHash('sha256');
for (const file of walk(STATIC).sort()) {
  hash.update(relative(STATIC, file).split(sep).join('/'));
  hash.update('\0');
  hash.update(readFileSync(file));
  hash.update('\0');
}
const buildId = hash.digest('hex').slice(0, LENGTH);

// 2. Overwrite the placeholder in every page in place.
const needle = Buffer.from(PLACEHOLDER);
const replacement = Buffer.from(buildId);
let files = 0;
let hits = 0;
(function rewrite(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      if (path === join(DIST, 'cache') || path === join(DIST, '_next')) continue;
      rewrite(path);
      continue;
    }
    if (!/\.(html|txt)$/.test(name)) continue;
    const buf = readFileSync(path);
    let at = buf.indexOf(needle);
    if (at === -1) continue;
    const fd = openSync(path, 'r+');
    try {
      while (at !== -1) {
        writeSync(fd, replacement, 0, LENGTH, at);
        hits++;
        at = buf.indexOf(needle, at + LENGTH);
      }
    } finally {
      closeSync(fd);
    }
    files++;
  }
})(DIST);

renameSync(join(STATIC, PLACEHOLDER), join(STATIC, buildId));
console.log(`✓ build ID ${buildId}: set in ${files} pages (${hits} places)`);
