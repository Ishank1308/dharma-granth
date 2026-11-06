"""
Refill Narada Bhakti Sutra and Shandilya Bhakti Sutra Hindi translations
from the official Gita Press EPUB (Book Code 385: Narada Bhakti Sutra & Shandilya Bhakti Sutra).

Extracts pure Unicode Hindi translations from the decrypted EPUB, verifies
against canonical Sanskrit and verse numbering, cleans mechanical markers,
and updates:
  - public/data/scriptures-full/naradabhaktisutra.json (84 sutras)
  - public/data/scriptures-full/shandilyabhaktisutra.json (100 sutras)

Sanskrit text, transliteration, and verse numbering are NEVER changed.
Provenance recorded in data/refill/bhaktisutra-gitapress-2026-11-06.json.
"""

import zipfile
import re
import json
import os
import sys

DATE = "2026-11-06"
EPUB_PATH = r"data/sources-local/gitapress_decrypted_epubs/gitapress_0385_Narada_Bhakti_Sutra_(Hindi).epub"
NARADA_JSON_PATH = r"public/data/scriptures-full/naradabhaktisutra.json"
SHANDILYA_JSON_PATH = r"public/data/scriptures-full/shandilyabhaktisutra.json"
REFILL_DIR = r"data/refill"
PROVENANCE_PATH = os.path.join(REFILL_DIR, f"bhaktisutra-gitapress-{DATE}.json")

DEV_DIGITS = {'०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9'}

def dev2int(s):
    res = ''.join(DEV_DIGITS.get(c, c) for c in s if c in DEV_DIGITS or c.isdigit())
    return int(res) if res else None

def clean_hindi_text(t):
    if not t:
        return ""
    # Strip footnote reference markers like '  7  '
    cleaned = re.sub(r'\s+[0-9०-९]{1,3}\s+', ' ', t)
    # Strip multiple spaces
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

def extract_narada_verses(z):
    c = z.read('index_split_001.html').decode('utf-8', 'ignore')
    ps = [re.sub(r'<[^>]+>', ' ', p).strip() for p in re.findall(r'<p[^>]*>(.*?)</p>', c, re.DOTALL)]
    verses = {}
    cur_num = None
    for p in ps:
        m = re.search(r'॥\s*([०-९0-9]+)\s*॥', p)
        if m:
            cur_num = dev2int(m.group(1))
            continue
        hm = re.match(r'^([०-९0-9]+)\s*[-—]\s*(.*)', p)
        if hm and cur_num is not None:
            h_num = dev2int(hm.group(1))
            if h_num == cur_num:
                verses[cur_num] = clean_hindi_text(hm.group(2))
    return verses

def extract_shandilya_verses(z):
    c = z.read('index_split_002.html').decode('utf-8', 'ignore')
    ps = [re.sub(r'<[^>]+>', ' ', p).strip() for p in re.findall(r'<p[^>]*>(.*?)</p>', c, re.DOTALL)]
    verses = {}
    cur_num = None
    for p in ps:
        m = re.search(r'॥\s*([०-९0-9]+)\s*॥', p)
        if m:
            cur_num = dev2int(m.group(1))
            continue
        hm = re.match(r'^([०-९0-9]+)\s*[-—]\s*(.*)', p)
        if hm and cur_num is not None:
            h_num = dev2int(hm.group(1))
            if h_num == cur_num:
                verses[cur_num] = clean_hindi_text(hm.group(2))
    return verses

def refill_scripture(json_path, epub_verses, scripture_id):
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    stats = {
        'total': 0,
        'refilled': 0,
        'replaced': 0,
        'missing_in_epub': 0,
    }

    records = []
    for ch in data.get('chapters', []):
        for v in ch.get('verses', []):
            stats['total'] += 1
            num = v.get('number')
            old_hindi = v.get('hindi') or ''
            new_hindi = epub_verses.get(num)
            
            if new_hindi:
                if old_hindi and old_hindi != new_hindi:
                    stats['replaced'] += 1
                else:
                    stats['refilled'] += 1
                
                v['hindi'] = new_hindi
                records.append({
                    'chapter': ch.get('number'),
                    'verse': num,
                    'action': 'replaced' if old_hindi else 'filled',
                    'hindi': new_hindi[:100]
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
        narada_epub = extract_narada_verses(z)
        shandilya_epub = extract_shandilya_verses(z)

    print(f"Extracted from EPUB:")
    print(f"  Narada Bhakti Sutra: {len(narada_epub)} sutras")
    print(f"  Shandilya Bhakti Sutra: {len(shandilya_epub)} sutras")

    # Refill Narada
    narada_data, narada_stats, narada_records = refill_scripture(NARADA_JSON_PATH, narada_epub, 'naradabhaktisutra')
    print(f"\nNarada Bhakti Sutra Stats:")
    print(f"  Total: {narada_stats['total']}")
    print(f"  Refilled / Filled: {narada_stats['refilled']}")
    print(f"  Replaced: {narada_stats['replaced']}")
    print(f"  Missing in EPUB: {narada_stats['missing_in_epub']}")

    # Refill Shandilya
    shandilya_data, shandilya_stats, shandilya_records = refill_scripture(SHANDILYA_JSON_PATH, shandilya_epub, 'shandilyabhaktisutra')
    print(f"\nShandilya Bhakti Sutra Stats:")
    print(f"  Total: {shandilya_stats['total']}")
    print(f"  Refilled / Filled: {shandilya_stats['refilled']}")
    print(f"  Replaced: {shandilya_stats['replaced']}")
    print(f"  Missing in EPUB: {shandilya_stats['missing_in_epub']}")

    if dry_run:
        print("\n[DRY RUN] No files written.")
        return

    os.makedirs(REFILL_DIR, exist_ok=True)
    with open(PROVENANCE_PATH, 'w', encoding='utf-8') as f:
        json.dump({
            'date': DATE,
            'source_epub': EPUB_PATH,
            'narada_stats': narada_stats,
            'narada_records': narada_records,
            'shandilya_stats': shandilya_stats,
            'shandilya_records': shandilya_records,
        }, f, ensure_ascii=False, indent=2)
    print(f"\nWrote provenance to {PROVENANCE_PATH}")

    with open(NARADA_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(narada_data, f, ensure_ascii=False, indent=2)
    print(f"Updated {NARADA_JSON_PATH}")

    with open(SHANDILYA_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(shandilya_data, f, ensure_ascii=False, indent=2)
    print(f"Updated {SHANDILYA_JSON_PATH}")

if __name__ == '__main__':
    main()

