'use client';

/**
 * Structural screen-to-screen motion with the browser's View Transitions API.
 *
 * Next's App Router swaps screens on the client, so `navigateWithTransition` wraps
 * `router.push` in `document.startViewTransition` and waits for the new route to commit
 * (`RouteTransitions` calls `notifyRouteCommitted` when `pathname` updates).
 *
 * Every internal navigation is mapped onto Dharma Granth's spatial topology (`data-vt` on <html>):
 *   next / prev          sequential sibling step (verse ↔ verse, chapter ↔ chapter)
 *   nav-next / nav-prev  lateral glide along the primary navigation rail
 *   open                 hierarchical drill-in (hub → book → chapter → verse, with shared `verse-hero` morph)
 *   back                 hierarchical step-out (child screen contracts back into parent container)
 *   navigate             peer cross-plane settle
 *
 * Without the API, under `prefers-reduced-motion: reduce`, or in quiet modes, it falls back
 * cleanly to an immediate `router.push`.
 */

export type TransitionKind =
  | 'next'
  | 'prev'
  | 'open'
  | 'back'
  | 'nav-next'
  | 'nav-prev'
  | 'navigate';

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

const cleanPath = (p: string) => (p === '/' ? '/' : p.replace(/\/+$/, '') || '/');

const PRIMARY_RAIL = [
  '/',
  '/scriptures',
  '/scripture/bhagavadgita',
  '/learn',
  '/practice',
  '/panchang',
] as const;

const VERSE_PATH = /^\/scripture\/([^/]+)\/chapter\/(\d+)\/verse\/([^/]+)$/;
const CHAPTER_PATH = /^\/scripture\/([^/]+)\/chapter\/(\d+)(?:\/part\/(\d+))?$/;
const SCRIPTURE_PATH = /^\/scripture\/([^/]+)(?:\/summary)?$/;
const ASHTAVAKRA_VERSE = /^\/ashtavakra\/(\d+)\/(\d+)$/;
const ASHTAVAKRA_CHAPTER = /^\/ashtavakra\/(\d+)$/;

/** Spatial depth of a route in the library's containment hierarchy (0 = home .. 4 = verse). */
export function routeDepth(rawPath: string): number {
  const p = cleanPath(rawPath);
  if (p === '/') return 0;
  if (VERSE_PATH.test(p) || ASHTAVAKRA_VERSE.test(p)) return 4;
  if (CHAPTER_PATH.test(p) || ASHTAVAKRA_CHAPTER.test(p) || /^\/ashtavakra\/words\/[^/]+$/.test(p)) return 3;
  if (
    SCRIPTURE_PATH.test(p) ||
    p === '/ashtavakra' ||
    p === '/ashtavakra/words' ||
    /^\/(concepts|mantras|festivals|characters|dictionary|ask|wisdom-for-life|wisdom-pathways|knowledge|learn|panchang|practice|rituals|about)\/[^/]+/.test(p)
  ) {
    return 2;
  }
  return 1;
}

function parseNumericToken(v: string | undefined): number | null {
  if (!v) return null;
  const m = /^(\d+)/.exec(v);
  return m ? Number(m[1]) : null;
}

/** Infers the structural motion kind connecting `fromPath` → `toPath`. */
export function inferRouteTransition(
  fromPath: string,
  toPath: string,
  opts?: { rel?: string[]; vtAttr?: string },
): TransitionKind {
  const rel = opts?.rel ?? [];
  if (rel.includes('next')) return 'next';
  if (rel.includes('prev')) return 'prev';

  const to = cleanPath(toPath);
  const from = cleanPath(fromPath);

  if (opts?.vtAttr === 'open' || VERSE_PATH.test(to) || ASHTAVAKRA_VERSE.test(to)) {
    // Sibling verse-to-verse step keeps directional turn; entering from anywhere else opens in.
    const fv = VERSE_PATH.exec(from);
    const tv = VERSE_PATH.exec(to);
    if (fv && tv && fv[1] === tv[1] && fv[2] === tv[2] && !opts?.vtAttr) {
      const a = parseNumericToken(fv[3]);
      const b = parseNumericToken(tv[3]);
      if (a !== null && b !== null && a !== b) return b > a ? 'next' : 'prev';
    }
    const fav = ASHTAVAKRA_VERSE.exec(from);
    const tav = ASHTAVAKRA_VERSE.exec(to);
    if (fav && tav && fav[1] === tav[1] && !opts?.vtAttr) {
      const a = Number(fav[2]);
      const b = Number(tav[2]);
      if (a !== b) return b > a ? 'next' : 'prev';
    }
    return 'open';
  }
  if (opts?.vtAttr === 'back') return 'back';

  // Sibling chapter-to-chapter (or part-to-part) turn within the same scripture
  const fc = CHAPTER_PATH.exec(from);
  const tc = CHAPTER_PATH.exec(to);
  if (fc && tc && fc[1] === tc[1]) {
    const chA = Number(fc[2]);
    const chB = Number(tc[2]);
    if (chA !== chB) return chB > chA ? 'next' : 'prev';
    const ptA = Number(fc[3] ?? '1');
    const ptB = Number(tc[3] ?? '1');
    if (ptA !== ptB) return ptB > ptA ? 'next' : 'prev';
  }
  const fac = ASHTAVAKRA_CHAPTER.exec(from);
  const tac = ASHTAVAKRA_CHAPTER.exec(to);
  if (fac && tac) {
    const a = Number(fac[1]);
    const b = Number(tac[1]);
    if (a !== b) return b > a ? 'next' : 'prev';
  }

  // Primary navigation rail lateral continuity
  const railFrom = PRIMARY_RAIL.indexOf(from as (typeof PRIMARY_RAIL)[number]);
  const railTo = PRIMARY_RAIL.indexOf(to as (typeof PRIMARY_RAIL)[number]);
  if (railFrom !== -1 && railTo !== -1 && railFrom !== railTo) {
    return railTo > railFrom ? 'nav-next' : 'nav-prev';
  }

  const dFrom = routeDepth(from);
  const dTo = routeDepth(to);
  if (dTo > dFrom) return 'open';
  if (dTo < dFrom) return 'back';

  return 'navigate';
}

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

/** The hero or verse panel on the destination page that receives a shared-element morph. */
function landingFolio(): HTMLElement | null {
  return document.querySelector<HTMLElement>('main [data-vt-hero], main .verse-folio');
}

/**
 * Navigate to `href`, animating the change.
 * `hero` is the element on the current page that grows into the new page's hero/folio (for kind "open").
 */
export function navigateWithTransition(
  router: Router,
  href: string,
  kind: TransitionKind,
  hero?: HTMLElement | null,
) {
  // Static export places dotted verse slugs (e.g. `4.4.5/`) under `4.4.5/index.txt`, whereas Next router fetches `4.4.5.txt`.
  if (/\/[^/?#]+\.[^/?#]+\/?(?:$|[?#])/.test(href)) {
    window.location.assign(href);
    return;
  }
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
  if (hero && kind === 'open') hero.style.setProperty('view-transition-name', 'verse-hero');

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
    if (hero && kind === 'open') {
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
