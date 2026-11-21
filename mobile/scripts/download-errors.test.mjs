// Download failures are sorted into codes that the screen words in English or Hindi, and the
// transient ones are retried. Run with `npm test`.
import assert from 'node:assert/strict';
import test from 'node:test';

import { DownloadError, downloadErrorCode, RETRYABLE, RETRY_DELAYS_MS } from '../src/content/download-errors.ts';

test('a lost connection reads as offline, whatever words the platform uses', () => {
  for (const message of [
    'Network request failed',
    'Unable to resolve host "dharmagranth.dev": No address associated with hostname',
    'timeout',
    'The request timed out.',
    'java.net.SocketTimeoutException',
    'Connection reset by peer',
    'Failed to connect to dharmagranth.dev/104.21.0.1:443',
    'SSL handshake aborted',
  ]) {
    assert.equal(downloadErrorCode(new TypeError(message)), 'offline', message);
  }
});

test('other failures get their own codes', () => {
  assert.equal(downloadErrorCode(new Error('ENOSPC: no space left on device')), 'space');
  assert.equal(downloadErrorCode(new SyntaxError('JSON Parse error: Unexpected end of input')), 'damaged');
  assert.equal(downloadErrorCode(new Error('Download failed with status 503')), 'server');
  assert.equal(downloadErrorCode(new Error('something odd')), 'failed');
  assert.equal(downloadErrorCode('not an error'), 'failed');
  assert.equal(downloadErrorCode(new DownloadError('update')), 'update');
  assert.equal(new DownloadError('space').name, 'DownloadError');
});

test('only transient failures are retried, three tries in all', () => {
  for (const code of ['offline', 'server', 'damaged', 'failed']) assert.ok(RETRYABLE.has(code), code);
  for (const code of ['space', 'unavailable', 'update', 'incomplete']) assert.ok(!RETRYABLE.has(code), code);
  assert.equal(RETRY_DELAYS_MS.length, 2);
});
