/**
 * Work that can wait until the first screen is up and settled.
 *
 * A cold start on a budget phone has one busy JS thread drawing the first screen. Housekeeping such as
 * re-planning the 30 daily verse notifications (31 native calls) or redrawing the home-screen widget
 * used to start in the same frames and push the first scroll back. `afterStartup()` resolves a few
 * seconds after launch, once the thread is idle; later calls resolve at once.
 */

/** When this module was first evaluated: close enough to when the app's JavaScript started. */
const STARTED_AT = Date.now();
/** How long after launch housekeeping waits. The first screen is drawn well within this on an entry-level phone. */
export const STARTUP_QUIET_MS = 3000;
/** Never wait more than this for an idle moment once the quiet period is over. */
const IDLE_TIMEOUT_MS = 2000;

let settled: Promise<void> | null = null;

export function afterStartup(): Promise<void> {
  if (!settled) {
    settled = new Promise<void>((resolve) => {
      const wait = Math.max(0, STARTED_AT + STARTUP_QUIET_MS - Date.now());
      setTimeout(() => {
        const idle = (globalThis as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => unknown }).requestIdleCallback;
        if (typeof idle === 'function') idle(() => resolve(), { timeout: IDLE_TIMEOUT_MS });
        else resolve();
      }, wait);
    });
  }
  return settled;
}
