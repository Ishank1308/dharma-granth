/**
 * Reads a value saved in localStorage without trusting its shape.
 *
 * A stored value can be wrong for reasons the reader never sees: a hand-edited
 * or partial backup, a format from an older version of the site, a write cut
 * off by a storage quota. Read raw, such a value used to throw during render,
 * and the error boundary then replaced the whole page (for example, a `null`
 * streak blanked every chapter page) with no way out short of clearing site
 * data. These helpers return the fallback instead.
 *
 * Rules, judged against the fallback the caller passes:
 * - a different kind (null, array, object, string, number, boolean) gives the fallback;
 * - an array loses its `null` and `undefined` items;
 * - a plain object with fields is laid over the fallback, so a missing field
 *   takes the fallback's value instead of `undefined`.
 */

type Kind = 'null' | 'array' | 'object' | 'string' | 'number' | 'boolean' | 'other';

function kindOf(value: unknown): Kind {
  if (value === null || value === undefined) return 'null';
  if (Array.isArray(value)) return 'array';
  const t = typeof value;
  if (t === 'object') return 'object';
  if (t === 'string' || t === 'number' || t === 'boolean') return t;
  return 'other';
}

/** Coerces an already-parsed value to the fallback's shape (see the rules above). */
export function coerceStored<T>(value: unknown, fallback: T): T {
  const want = kindOf(fallback);
  const got = kindOf(value);
  // A null fallback means "anything goes": the caller checks the value itself.
  if (want === 'null') return value as T;
  if (got !== want) return fallback;
  if (got === 'number' && !Number.isFinite(value as number)) return fallback;
  if (got === 'array') return (value as unknown[]).filter((item) => item !== null && item !== undefined) as T;
  if (got === 'object') {
    const base = fallback as Record<string, unknown>;
    if (Object.keys(base).length === 0) return value as T;
    const merged: Record<string, unknown> = { ...base };
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      // A field the fallback defines keeps its kind (a saved null is allowed, as in a
      // location without coordinates); fields the fallback lacks pass through.
      if (k in base && kindOf(base[k]) !== 'null' && kindOf(v) !== 'null' && kindOf(v) !== kindOf(base[k])) continue;
      merged[k] = v;
    }
    return merged as T;
  }
  return value as T;
}

/** Parses a raw stored string and coerces it; bad JSON or no value gives the fallback. */
export function parseStored<T>(raw: string | null | undefined, fallback: T): T {
  if (raw === null || raw === undefined || raw === '') return fallback;
  try {
    return coerceStored(JSON.parse(raw) as unknown, fallback);
  } catch {
    return fallback;
  }
}

/** Reads and coerces a localStorage key; any storage error gives the fallback. */
export function readStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    return parseStored(window.localStorage.getItem(key), fallback);
  } catch {
    return fallback;
  }
}
