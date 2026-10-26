import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export interface FullVerse {
  number: number | string;
  sanskrit?: string;
  transliteration?: string;
  translation?: string;
  /** "ai" when the translation was machine-generated from the Sanskrit. */
  translationSource?: "ai";
  /** The English translates a range of verses together ("1.1-1.63", a whole hymn); stored on its first verse. */
  translationRange?: string;
  /** This verse's English is in the passage stored on that verse (the first of its range). */
  translationSeeVerse?: number | string;
  hindi?: string;
  /** "ai" when the Hindi meaning was machine-generated from the Sanskrit. */
  hindiSource?: "ai";
  /** The Hindi translates a range of verses together ("15-17"); stored on its first verse. */
  hindiRange?: string;
  /** This verse's Hindi is in the passage stored on that verse (the first of its range). */
  hindiSeeVerse?: number | string;
  wordMeaning?: string;
  commentary?: string;
  explanation?: string;
  science?: string;
  lifeLesson?: string;
  keywords?: string[];
}

export interface FullChapter {
  number: number;
  title?: string;
  titleSanskrit?: string;
  verses: FullVerse[];
}

export interface FullScripture {
  id: string;
  title: string;
  titleSanskrit: string;
  category: string;
  source: {
    repo: string;
    license?: string;
    fetchedAt: string;
  };
  totalVerses: number;
  totalChapters: number;
  chapters: FullChapter[];
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUT_ROOT = resolve(__dirname, "../../public/data/scriptures-full");

export function writeScripture(scripture: FullScripture): string {
  const outPath = resolve(OUT_ROOT, `${scripture.id}.json`);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(scripture, null, 2), "utf8");
  return outPath;
}

export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`);
  }
  return (await res.json()) as T;
}

export function log(msg: string): void {
  const t = new Date().toISOString().slice(11, 19);
  console.log(`[${t}] ${msg}`);
}
