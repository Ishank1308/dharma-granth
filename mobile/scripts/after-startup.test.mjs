// Housekeeping waits for the first screen on a cold start, then runs straight away. Run with `npm test`.
import assert from 'node:assert/strict';
import test from 'node:test';

const loadedAt = Date.now();
const { afterStartup, STARTUP_QUIET_MS } = await import('../src/lib/after-startup.ts');

test('waits out the quiet period once, then resolves at once', async () => {
  await afterStartup();
  assert.ok(Date.now() - loadedAt >= STARTUP_QUIET_MS - 50, 'resolved before the quiet period ended');
  const t = Date.now();
  await afterStartup();
  assert.ok(Date.now() - t < 50, 'a later call should not wait');
});
