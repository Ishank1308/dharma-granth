"""
Refill Taittiriya Upanishad missing Hindi translations
from the official Gita Press EPUB (Book Code 71: Taittiriya Upanishad, Shankarbhashya Sahit).

Extracts pure Unicode Hindi translations from the decrypted EPUB, cleans mechanical markers,
and updates public/data/scriptures-full/taittiriya.json for all 12 previously missing anuvakas:
- Shiksha Valli: 1.3, 1.4, 1.5, 1.6, 1.11 (Convocation Address)
- Brahmananda Valli: 2.1, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8 (Ananda Mimamsa)

Sanskrit text, transliteration, and verse numbering are NEVER changed.
Provenance recorded in data/refill/taittiriya-gitapress-2026-11-06.json.
"""

import zipfile
import re
import json
import os
import sys

DATE = "2026-11-06"
EPUB_PATH = r"data/sources-local/gitapress_decrypted_epubs/gitapress_0071_Taittiriya_Upanishad_–_Sanskrit_Text_with_Hindi_Tr.epub"
TAITTIRIYA_JSON_PATH = r"public/data/scriptures-full/taittiriya.json"
REFILL_DIR = r"data/refill"
PROVENANCE_PATH = os.path.join(REFILL_DIR, f"taittiriya-gitapress-{DATE}.json")

def clean_hindi(t):
    if not t:
        return ""
    # Strip footnote reference markers
    cleaned = re.sub(r'\s+[0-9०-९]{1,3}\s+', ' ', t)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

def extract_all_12_translations(z):
    def get_p(fname, idx):
        c = z.read(fname).decode('utf-8', 'ignore')
        ps = [re.sub(r'<[^>]+>', ' ', p).strip() for p in re.findall(r'<p[^>]*>(.*?)</p>', c, re.DOTALL)]
        return clean_hindi(ps[idx])

    return {
        (1, 3): get_p('index_split_003.html', 76),
        (1, 4): get_p('index_split_004.html', 4) + ' ' + get_p('index_split_004.html', 18),
        (1, 5): get_p('index_split_005.html', 5),
        (1, 6): get_p('index_split_006.html', 4),
        (1, 11): get_p('index_split_009.html', 26),
        (2, 1): get_p('index_split_011.html', 4) + ' ' + get_p('index_split_011.html', 18),
        (2, 3): get_p('index_split_015.html', 1),
        (2, 4): get_p('index_split_016.html', 1),
        (2, 5): get_p('index_split_017.html', 1),
        (2, 6): get_p('index_split_018.html', 1),
        (2, 7): get_p('index_split_018.html', 99),
        (2, 8): get_p('index_split_018.html', 135),
    }

def refill_taittiriya(json_path, translations):
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    stats = {
        'total': 0,
        'missing_before': 0,
        'refilled': 0,
        'still_missing': 0,
    }

    records = []
    for ch in data.get('chapters', []):
        ch_num = ch.get('number')
        for v in ch.get('verses', []):
            stats['total'] += 1
            v_num = v.get('number')
            old_hindi = v.get('hindi') or ''
            
            if not old_hindi:
                stats['missing_before'] += 1
                new_hindi = translations.get((ch_num, v_num))
                if new_hindi:
                    v['hindi'] = new_hindi
                    stats['refilled'] += 1
                    records.append({
                        'chapter': ch_num,
                        'verse': v_num,
                        'sanskrit_snippet': v.get('sanskrit', '')[:50],
                        'hindi': new_hindi[:100]
                    })
                else:
                    stats['still_missing'] += 1

    return data, stats, records

def main():
    dry_run = "--dry" in sys.argv or "--dry-run" in sys.argv

    if not os.path.exists(EPUB_PATH):
        print(f"Error: EPUB not found at {EPUB_PATH}")
        sys.exit(1)

    print(f"Loading EPUB: {EPUB_PATH}...")
    with zipfile.ZipFile(EPUB_PATH, 'r') as z:
        translations = extract_all_12_translations(z)

    print(f"Extracted {len(translations)} exact Gita Press translations for Taittiriya Upanishad.")

    data, stats, records = refill_taittiriya(TAITTIRIYA_JSON_PATH, translations)
    print(f"\nTaittiriya Upanishad Refill Stats:")
    print(f"  Total Mantras: {stats['total']}")
    print(f"  Missing before: {stats['missing_before']}")
    print(f"  Refilled / Filled: {stats['refilled']}")
    print(f"  Still missing: {stats['still_missing']}")

    for r in records:
        print(f"  ✓ Ch {r['chapter']} v {r['verse']}: {r['hindi']}")

    if dry_run:
        print("\n[DRY RUN] No files written.")
        return

    os.makedirs(REFILL_DIR, exist_ok=True)
    with open(PROVENANCE_PATH, 'w', encoding='utf-8') as f:
        json.dump({
            'date': DATE,
            'source_epub': EPUB_PATH,
            'stats': stats,
            'records': records,
        }, f, ensure_ascii=False, indent=2)
    print(f"\nWrote provenance to {PROVENANCE_PATH}")

    with open(TAITTIRIYA_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Updated {TAITTIRIYA_JSON_PATH}")

if __name__ == '__main__':
    main()
