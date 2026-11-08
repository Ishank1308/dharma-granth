'use client';

/**
 * Page transitions on client navigation, with the browser's View Transitions API.
 *
 * Next's app router swaps the page on the client, so the CSS-only cross-document
 * transitions never fire. `navigateWithTransition` wraps `router.push` in
 * `document.startViewTransition` and waits for the new route to commit (the
 * RouteTransitions component calls `notifyRouteCommitted` when the pathname changes),
 * so the browser can animate between the two screens. app/styles/page-transitions.css
 * draws the motion, keyed by `data-vt` on <html>:
 *
 *   next / prev  the reading pane slides like a turned page (verse to verse, chapter to chapter)
 *   open         the tapped verse grows into the verse page (shared element "verse-hero")
 *
 * Without the API, under reduced motion and in the quiet modes it is a plain router.push.
 */

export type TransitionKind = 'next' | 'prev' | 'open';

type Router = { push: (href: string, options?: { scroll?: boolean }) => void };
type ViewTransitionDoc = Document & {
  startViewTransition?: (update: () => Promise<void> | void) => {
    finished: Promise<void>;
    ready: Promise<void>;
  };
};

/** Longest we hold the old screen while the next route loads; then it just appears. */
const COMMIT_TIMEOUT_MS = 2500;

let resolvePending: (() => void) | null = null;
let running = false;

/** RouteTransitions calls this after the new pathname has rendered. */
export function notifyRouteCommitted() {
  const resolve = resolvePending;
  resolvePending = null;
  resolve?.();
}

/** False under reduced motion and the quiet modes (lite, Reading Lite, low power, data saver). */
export function motionAllowed(): boolean {
  if (typeof document === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const root = document.documentElement;
  return !(
    root.hasAttribute('data-lite-mode') ||
    root.hasAttribute('data-reading-lite') ||
    root.getAttribute('data-low-power') === 'true' ||
    root.getAttribute('data-data-saver') === 'true'
  );
}

export function canTransition(): boolean {
  if (!motionAllowed()) return false;
  return typeof (document as ViewTransitionDoc).startViewTransition === 'function';
}

function waitForCommit(): Promise<void> {
  return new Promise((resolve) => {
    const timer = window.setTimeout(() => {
      if (resolvePending === done) resolvePending = null;
      resolve();
    }, COMMIT_TIMEOUT_MS);
    const done = () => {
      window.clearTimeout(timer);
      resolve();
    };
    resolvePending = done;
  });
}

/** The verse panel on the page that has just rendered (the verse page's Sanskrit). */
function landingFolio(): HTMLElement | null {
  return document.querySelector<HTMLElement>('main [data-vt-hero], main .verse-folio');
}

/**
 * Navigate to `href`, animating the change.
 * `hero` is the element on the current page that should grow into the new page's verse
 * panel (for kind "open").
 */
export function navigateWithTransition(
  router: Router,
  href: string,
  kind: TransitionKind,
  hero?: HTMLElement | null,
) {
  // The commit signal is a pathname change, so a same-page link (a #hash) goes straight through.
  const samePath = new URL(href, window.location.href).pathname === window.location.pathname;
  if (running || samePath || !canTransition()) {
    router.push(href);
    return;
  }
  const doc = document as ViewTransitionDoc;
  const root = document.documentElement;
  running = true;
  root.setAttribute('data-vt', kind);
  if (hero) hero.style.setProperty('view-transition-name', 'verse-hero');

  const transition = doc.startViewTransition!(async () => {
    const committed = waitForCommit();
    router.push(href);
    await committed;
    // Next's own scroll-to-top can miss while the transition holds rendering, so the new
    // page could open at the old scroll offset. Start it at the top (or at its #anchor).
    if (window.location.hash) {
      document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView();
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
    if (hero) {
      hero.style.removeProperty('view-transition-name');
      const target = landingFolio();
      target?.style.setProperty('view-transition-name', 'verse-hero');
    }
  });

  transition.finished.finally(() => {
    running = false;
    root.removeAttribute('data-vt');
    document
      .querySelectorAll<HTMLElement>('[style*="view-transition-name"]')
      .forEach((el) => el.style.removeProperty('view-transition-name'));
  });
}
