#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const DEFAULT_LOCAL = 'dist/scripture/bhagavadgita/chapter/2/index.txt';
const DEFAULT_URL = 'https://dharmagranth.dev/scripture/bhagavadgita/chapter/2/index.txt';

function option(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function fail(message) {
  console.error(`RSC canary verification failed: ${message}`);
  process.exitCode = 1;
}

const localPath = resolve(option('--local', DEFAULT_LOCAL));
const remoteUrl = option('--url', DEFAULT_URL);

let localBytes;
try {
  localBytes = await readFile(localPath);
} catch (error) {
  fail(`cannot read local payload ${localPath}: ${error.message}`);
  process.exit();
}

let response;
try {
  response = await fetch(remoteUrl, {
    headers: { Accept: 'text/plain' },
    redirect: 'manual',
  });
} catch (error) {
  fail(`cannot fetch ${remoteUrl}: ${error.message}`);
  process.exit();
}

if (!response.ok) {
  fail(`expected HTTP 200 from ${remoteUrl}, received ${response.status}`);
  process.exit();
}

const contentType = response.headers.get('content-type') || '';
if (!contentType.toLowerCase().startsWith('text/plain')) {
  fail(`expected text/plain content type, received ${contentType || '(missing)'}`);
  process.exit();
}

const remoteBytes = Buffer.from(await response.arrayBuffer());
const localDigest = sha256(localBytes);
const remoteDigest = sha256(remoteBytes);
const exactBody = Buffer.compare(localBytes, remoteBytes) === 0;

console.log(JSON.stringify({
  localPath,
  remoteUrl,
  localBytes: localBytes.length,
  remoteBytes: remoteBytes.length,
  localSha256: localDigest,
  remoteSha256: remoteDigest,
  exactBody,
  remoteEtag: response.headers.get('etag'),
  remoteContentType: contentType,
  remoteCacheControl: response.headers.get('cache-control'),
}, null, 2));

if (!exactBody) {
  fail('the R2/static response body differs from the local generated payload');
}
