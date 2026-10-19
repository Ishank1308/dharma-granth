export function readArgs(argv: string[]): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) out[key] = true;
    else {
      out[key] = next;
      i += 1;
    }
  }
  return out;
}

export function requireString(args: Record<string, string | boolean>, key: string): string {
  const value = args[key];
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Missing --${key}`);
  }
  return value.trim();
}

export function slugOf(value: string): string {
  const slug = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (!slug) throw new Error(`Empty slug: ${value}`);
  return slug;
}

/** "1-3,8,69-70" → sorted unique page numbers. */
export function parsePages(spec: string | undefined, total: number): number[] {
  if (!spec) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>();
  for (const part of spec.split(',')) {
    const piece = part.trim();
    if (!piece) continue;
    const range = piece.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      if (start < 1 || end < start) throw new Error(`Bad page range: ${piece}`);
      for (let n = start; n <= end; n += 1) pages.add(n);
    } else if (/^\d+$/.test(piece)) {
      pages.add(Number(piece));
    } else {
      throw new Error(`Bad page list: ${piece}`);
    }
  }
  const list = [...pages].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  if (!list.length) throw new Error(`No pages inside 1..${total} for "${spec}"`);
  return list;
}
