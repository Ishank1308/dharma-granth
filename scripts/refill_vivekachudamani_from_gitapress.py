"""
Refill Vivekachudamani authentic Hindi translations from the official Gita Press EPUB
(Book Code 133: Vivek Chudamani Hindi).

Extracts pure Unicode Hindi translations (anuvada) from the decrypted EPUB, cleans mechanical markers,
ensures ASCII numerals, and updates public/data/scriptures-full/vivekchudamani.json for all 580 verses.

Canonical Sanskrit text, transliteration, and verse numbering are NEVER changed.
Provenance recorded in data/refill/vivekachudamani-gitapress-2026-11-06.json.
"""

import zipfile
import re
import html
import json
import os
import sys

DATE = "2026-11-06"
EPUB_PATH = r"data/sources-local/gitapress_decrypted_epubs/gitapress_0133_Vivek_Chudamani_(Hindi).epub"
TARGET_JSON = r"public/data/scriptures-full/vivekchudamani.json"
REFILL_DIR = r"data/refill"
PROVENANCE_PATH = os.path.join(REFILL_DIR, f"vivekachudamani-gitapress-{DATE}.json")

def clean_text(raw):
    text = re.sub(r'<[^>]+>', ' ', raw)
    text = html.unescape(text)
    text = re.sub(r'\[\s*←\d+\s*\]', '', text)
    text = text.translate(str.maketrans('०१२३४५६७८९', '0123456789'))
    return re.sub(r'\s+', ' ', text).strip()

def extract_all_epub_verses(epub_path):
    epub_verses = {}
    with zipfile.ZipFile(epub_path, 'r') as z:
        for fname in ['index_split_004.html', 'index_split_005.html', 'index_split_006.html']:
            raw = z.read(fname).decode('utf-8', errors='ignore')
            ps = re.findall(r'<p\s+class="([^"]+)">(.*?)</p>', raw, re.DOTALL)
            
            curr_sk = []
            for i, (cls, b) in enumerate(ps):
                txt = clean_text(b)
                if 'block_18' in cls or 'block_15' in cls or 'block_16' in cls or 'block_27' in cls:
                    curr_sk.append(txt)
                    m = re.search(r'॥\s*([0-9]+)\s*॥', txt)
                    if m:
                        num = int(m.group(1))
                        full_sk = " ".join(curr_sk)
                        trans = clean_text(ps[i+1][1]) if i+1 < len(ps) else ""
                        trans = re.sub(r'॥\s*[0-9]+\s*॥\s*$', '', trans).strip()
                        epub_verses[num] = {
                            'sanskrit': full_sk,
                            'hindi': trans
                        }
                        curr_sk = []
                elif cls in ['block_29', 'block_19']:
                    curr_sk = []
    return epub_verses

def shingles(s):
    clean = re.sub(r'[\s|।॥०-९0-9\-_.,:;!?()\[\]\'"]+', '', s)
    return set(clean[i:i+3] for i in range(len(clean)-2))

def match_target_verses(target_verses, epub_verses):
    mapped = {}
    for t_v in target_verses:
        t_num = t_v['number']
        
        # Special merged cases:
        if t_num == 23 and 23 in epub_verses and 24 in epub_verses:
            mapped[t_num] = {
                'hindi': f"{epub_verses[23]['hindi']} {epub_verses[24]['hindi']}",
                'epub_nums': [23, 24]
            }
            continue
        if t_num == 329 and 329 in epub_verses and 330 in epub_verses:
            mapped[t_num] = {
                'hindi': f"{epub_verses[329]['hindi']} {epub_verses[330]['hindi']}",
                'epub_nums': [329, 330]
            }
            continue
            
        t_sh = shingles(t_v['sanskrit'])
        best_score = 0
        best_num = None
        best_e = None
        
        # Test candidate search around expected offset
        # Target <= 22 is ~ t_num, target > 23 is ~ t_num + 1
        expected = t_num if t_num <= 22 else t_num + 1
        candidates = [expected + delta for delta in range(-3, 4) if (expected + delta) in epub_verses]
        
        for c_num in candidates:
            e_v = epub_verses[c_num]
            e_sh = shingles(e_v['sanskrit'])
            score = len(t_sh & e_sh) / len(t_sh | e_sh) if (t_sh | e_sh) else 0
            if score > best_score:
                best_score = score
                best_num = c_num
                best_e = e_v
                
        if best_e and best_score >= 0.25:
            mapped[t_num] = {
                'hindi': best_e['hindi'],
                'epub_nums': [best_num]
            }
        else:
            # Fallback to full search
            for e_num, e_v in epub_verses.items():
                e_sh = shingles(e_v['sanskrit'])
                score = len(t_sh & e_sh) / len(t_sh | e_sh) if (t_sh | e_sh) else 0
                if score > best_score:
                    best_score = score
                    best_num = e_num
                    best_e = e_v
            if best_e:
                mapped[t_num] = {
                    'hindi': best_e['hindi'],
                    'epub_nums': [best_num]
                }
    return mapped

def main():
    dry_run = "--dry" in sys.argv or "--dry-run" in sys.argv

    if not os.path.exists(EPUB_PATH):
        print(f"Error: EPUB not found at {EPUB_PATH}")
        sys.exit(1)

    print(f"Loading EPUB: {EPUB_PATH}...")
    epub_verses = extract_all_epub_verses(EPUB_PATH)
    print(f"Extracted {len(epub_verses)} verses from EPUB.")

    with open(TARGET_JSON, 'r', encoding='utf-8') as f:
        target_data = json.load(f)

    target_verses = target_data['chapters'][0]['verses']
    mapped = match_target_verses(target_verses, epub_verses)
    print(f"Matched {len(mapped)} / {len(target_verses)} target verses.")

    stats = {
        'total': len(target_verses),
        'refilled': 0,
        'missing': 0
    }

    records = []
    for v in target_verses:
        v_num = v['number']
        if v_num in mapped:
            info = mapped[v_num]
            v['hindi'] = info['hindi']
            v['hindiSource'] = 'gitapress'
            v['translationSource'] = 'gitapress'
            stats['refilled'] += 1
            records.append({
                'verse': v_num,
                'epub_nums': info['epub_nums'],
                'hindi': info['hindi'][:80] + '...'
            })
        else:
            stats['missing'] += 1
            print(f"WARNING: Missing Target verse {v_num}!")

    print(f"\nVivekachudamani Refill Stats:")
    print(f"  Total Verses: {stats['total']}")
    print(f"  Refilled with Gita Press Hindi: {stats['refilled']}")
    print(f"  Missing: {stats['missing']}")

    if dry_run:
        print("\n[DRY RUN] No files written.")
        return

    os.makedirs(REFILL_DIR, exist_ok=True)
    with open(PROVENANCE_PATH, 'w', encoding='utf-8') as f:
        json.dump({
            'date': DATE,
            'source_epub': EPUB_PATH,
            'stats': stats,
            'records': records
        }, f, ensure_ascii=False, indent=2)
    print(f"Wrote provenance to {PROVENANCE_PATH}")

    with open(TARGET_JSON, 'w', encoding='utf-8') as f:
        json.dump(target_data, f, ensure_ascii=False, indent=2)
    print(f"Updated {TARGET_JSON}")

if __name__ == '__main__':
    main()
