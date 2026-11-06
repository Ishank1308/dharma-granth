"""
Refill Patanjali Yoga Sutra (Yoga Darshan) Hindi translations & commentaries
from the official Gita Press EPUB (Book Code 135: Patanjali Yoga Darshan, Sadharan Hindi Tika Sahit).

Extracts pure Unicode Hindi translations, word-by-word meanings (पदच्छेद),
and authoritative commentaries (व्याख्या) from the decrypted EPUB, verifies
against canonical Sanskrit and verse numbering, cleans mechanical markers,
and updates public/data/scriptures-full/yogasutra.json (195 sutras across 4 padas).

Sanskrit text, transliteration, and verse numbering are NEVER changed.
Provenance recorded in data/refill/yogasutra-gitapress-2026-11-06.json.
"""

import zipfile
import re
import json
import os
import sys

DATE = "2026-11-06"
EPUB_PATH = r"data/sources-local/gitapress_decrypted_epubs/gitapress_0135_Patanjali_Yoga_Darshan_(Hindi).epub"
YOGASUTRA_JSON_PATH = r"public/data/scriptures-full/yogasutra.json"
REFILL_DIR = r"data/refill"
PROVENANCE_PATH = os.path.join(REFILL_DIR, f"yogasutra-gitapress-{DATE}.json")

DEV_DIGITS = {'०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9'}

def dev2int(s):
    res = ''.join(DEV_DIGITS.get(c, c) for c in s if c in DEV_DIGITS or c.isdigit())
    return int(res) if res else None

def clean_text(t):
    if not t:
        return ""
    # Strip footnote reference markers
    cleaned = re.sub(r'\s+[0-9०-९]{1,3}\s+', ' ', t)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

def clean_vyakhya(v):
    if not v:
        return ""
    # Strip terminal verse numbers like ॥ १॥
    v = re.sub(r'॥\s*[०-९0-9]+\s*॥\s*$', '', v).strip()
    return clean_text(v)

def extract_yogasutra_padas(z):
    files = [
        (1, 'index_split_003.html', 51),
        (2, 'index_split_004.html', 55),
        (3, 'index_split_005.html', 55),
        (4, 'index_split_006.html', 34),
    ]

    all_sutras = {}
    for pada, fname, expected_count in files:
        c = z.read(fname).decode('utf-8', 'ignore')
        ps = [re.sub(r'<[^>]+>', ' ', p).strip() for p in re.findall(r'<p[^>]*>(.*?)</p>', c, re.DOTALL)]
        
        expected_num = 1
        i = 0
        while i < len(ps) and expected_num <= expected_count:
            p = ps[i]
            m = re.search(r'॥\s*([०-९0-9]+)\s*॥', p)
            if m and dev2int(m.group(1)) == expected_num and not re.match(r'^(व्याख्या|सम्बन्ध|टिप्पणी|नोट)\s*[-—]', p):
                sanskrit = p
                word_meaning = []
                vyakhya = []
                j = i + 1
                in_vyakhya = False
                while j < len(ps):
                    pj = ps[j]
                    if pj.startswith(('सम्बन्ध—', 'सम्बन्ध –', 'सम्बन्ध -')):
                        break
                    nm = re.search(r'॥\s*([०-९0-9]+)\s*॥', pj)
                    if nm and dev2int(nm.group(1)) == expected_num + 1 and not re.match(r'^(व्याख्या|सम्बन्ध|टिप्पणी|नोट)\s*[-—]', pj):
                        break
                    if pj.startswith(('व्याख्या—', 'व्याख्या –', 'व्याख्या -')):
                        in_vyakhya = True
                    if in_vyakhya:
                        vyakhya.append(pj)
                    else:
                        word_meaning.append(pj)
                    j += 1

                wm_str = ' '.join(word_meaning).strip()
                vy_str = ' '.join(vyakhya).strip()

                all_sutras[(pada, expected_num)] = {
                    'sanskrit': clean_text(sanskrit),
                    'wordMeaning': clean_text(wm_str),
                    'vyakhya': clean_vyakhya(vy_str)
                }
                expected_num += 1
                i = j
            else:
                i += 1

    return all_sutras

def refill_yogasutra(json_path, epub_sutras):
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    stats = {
        'total': 0,
        'refilled': 0,
        'missing_in_epub': 0,
    }

    records = []
    for ch in data.get('chapters', []):
        pada = ch.get('number')
        for v in ch.get('verses', []):
            stats['total'] += 1
            num = v.get('number')
            entry = epub_sutras.get((pada, num))

            if entry and entry['wordMeaning']:
                stats['refilled'] += 1
                v['hindi'] = entry['wordMeaning']
                v['wordMeaning'] = entry['wordMeaning']
                if entry['vyakhya']:
                    v['commentary'] = entry['vyakhya']
                    exp = re.sub(r'^व्याख्या\s*[-—]\s*', '', entry['vyakhya'])
                    v['explanation'] = exp
                
                records.append({
                    'pada': pada,
                    'verse': num,
                    'hindi': v['hindi'][:80],
                    'has_vyakhya': bool(entry['vyakhya'])
                })
            else:
                stats['missing_in_epub'] += 1

    return data, stats, records

def main():
    dry_run = "--dry" in sys.argv or "--dry-run" in sys.argv

    if not os.path.exists(EPUB_PATH):
        print(f"Error: EPUB not found at {EPUB_PATH}")
        sys.exit(1)

    print(f"Loading EPUB: {EPUB_PATH}...")
    with zipfile.ZipFile(EPUB_PATH, 'r') as z:
        epub_sutras = extract_yogasutra_padas(z)

    print(f"Extracted {len(epub_sutras)} Yoga Sutras from EPUB (Expected 195).")

    data, stats, records = refill_yogasutra(YOGASUTRA_JSON_PATH, epub_sutras)
    print(f"\nYoga Sutra Refill Stats:")
    print(f"  Total Sutras: {stats['total']}")
    print(f"  Refilled / Filled: {stats['refilled']}")
    print(f"  Missing in EPUB: {stats['missing_in_epub']}")

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

    with open(YOGASUTRA_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Updated {YOGASUTRA_JSON_PATH}")

if __name__ == '__main__':
    main()
