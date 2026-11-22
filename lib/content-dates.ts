import { execFileSync } from 'node:child_process';

/**
 * Real "last changed" dates for the sitemap and structured data, from git
 * history (build time only). A file's date is its last commit, so a page's
 * lastmod moves only when its content does — unlike the build time, which
 * Google ignores because it changes for every URL on every deploy.
 *
 * Returns undefined when history is unavailable (no git, or a shallow clone
 * where every file would report the same checkout commit): omitting lastmod
 * is better than a wrong one. CI must check out with `fetch-depth: 0`.
 */
let historyUsable: boolean | undefined;
const cache = new Map<string, Date | undefined>();

function git(args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
}

function hasFullHistory(): boolean {
  if (historyUsable === undefined) {
    try {
      historyUsable = git(['rev-parse', '--is-shallow-repository']) === 'false';
    } catch {
      historyUsable = false;
    }
  }
  return historyUsable;
}

/** Latest commit date touching any of `paths` (repo-relative), or undefined. */
export function lastChanged(...paths: string[]): Date | undefined {
  if (!hasFullHistory()) return undefined;
  const key = paths.join('\n');
  if (cache.has(key)) return cache.get(key);
  let date: Date | undefined;
  try {
    const iso = git(['log', '-1', '--format=%cI', '--', ...paths]);
    date = iso ? new Date(iso) : undefined;
  } catch {
    date = undefined;
  }
  cache.set(key, date);
  return date;
}

/** When a scripture's text or its Hindi commentary last changed. */
export function scriptureLastChanged(scriptureId: string): Date | undefined {
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(scriptureId)) return undefined;
  return lastChanged(
    `public/data/scriptures-full/${scriptureId}.json`,
    // Commentary is published per section in a folder (docs/commentary-storage.md); the .json path keeps the history from before.
    `public/data/hi-commentary/${scriptureId}`,
    `public/data/hi-commentary/${scriptureId}.json`,
  );
}
