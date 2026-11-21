/** Splits "word—meaning; word—meaning" glosses into chips. Mirrors lib/word-gloss.ts on the website. */
export interface WordGloss {
  pada: string;
  meaning: string;
}

/** Returns [] when the text is not in that form (many fields hold prose instead). */
export function parseWordMeanings(text?: string): WordGloss[] {
  if (!text) return [];
  const out: WordGloss[] = [];
  text
    .split(/;\s*|\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((item) => {
      const cut = item.search(/\s*[—–]\s*|\s-\s/);
      if (cut > 0) {
        const pada = item.slice(0, cut).trim();
        const meaning = item.slice(cut).replace(/^\s*[—–-]\s*/, '').trim();
        const unquotedPada = pada.replace(/^[\"'“”]+|[\"'“”]+$/g, '').trim();
        // Many legacy wordMeaning fields actually contain long editorial prose.
        // A dash in an English sentence is not evidence of Sanskrit word glosses.
        const isWordLike =
          unquotedPada.length > 0 &&
          unquotedPada.length <= 48 &&
          unquotedPada.split(/\s+/).length <= 3 &&
          !/[.!?:;]/.test(unquotedPada) &&
          !/^(?:the|this|that|these|those|a|an|when|where|how|why)\b/i.test(unquotedPada);
        const isConciseMeaning = meaning.length > 0 && meaning.length <= 160;
        if (isWordLike && isConciseMeaning) out.push({ pada, meaning });
      }
    });
  return out;
}
