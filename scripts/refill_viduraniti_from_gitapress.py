"""
Refill Vidura Niti authentic Hindi translations from the official Gita Press EPUB
(Book Code 136: Vidur Niti Hindi).

Replaces dummy template Hindi ("विदुरनीति श्लोक का अर्थ।") across all 594 verses
in public/data/scriptures-full/viduraniti.json with pure Unicode, authentic Gita Press translations.

Canonical Sanskrit text, transliteration, and verse numbering are NEVER changed.
Provenance recorded in data/refill/viduraniti-gitapress-2026-11-06.json.
"""

import zipfile
import re
import html
import json
import os
import sys

DATE = "2026-11-06"
EPUB_PATH = r"data/sources-local/gitapress_decrypted_epubs/gitapress_0136_Vidur_Niti_(Hindi).epub"
TARGET_JSON = r"public/data/scriptures-full/viduraniti.json"
REFILL_DIR = r"data/refill"
PROVENANCE_PATH = os.path.join(REFILL_DIR, f"viduraniti-gitapress-{DATE}.json")

def clean_text(raw):
    text = re.sub(r'<[^>]+>', ' ', raw)
    text = html.unescape(text)
    text = re.sub(r'\[\s*←\d+\s*\]', '', text)
    text = text.translate(str.maketrans('०१२३४५६७८९', '0123456789'))
    return re.sub(r'\s+', ' ', text).strip()

def extract_all_verses(epub_path):
    with zipfile.ZipFile(epub_path, 'r') as z:
        raw_5 = z.read('index_split_005.html').decode('utf-8', errors='ignore')
        idx4 = raw_5.find('चौथा अध्याय')
        
        ch_html = {
            1: z.read('index_split_003.html').decode('utf-8', errors='ignore'),
            2: z.read('index_split_004.html').decode('utf-8', errors='ignore'),
            3: raw_5[:idx4],
            4: raw_5[idx4:],
            5: z.read('index_split_006.html').decode('utf-8', errors='ignore'),
            6: z.read('index_split_007.html').decode('utf-8', errors='ignore'),
            7: z.read('index_split_008.html').decode('utf-8', errors='ignore'),
            8: z.read('index_split_009.html').decode('utf-8', errors='ignore')
        }

    extracted = {}
    for ch_num, raw in ch_html.items():
        ps = re.findall(r'<p\s+class="([^"]+)">(.*?)</p>', raw, re.DOTALL)
        clean_ps = [(c, clean_text(b)) for c, b in ps if clean_text(b)]
        
        ch_verses = {}
        for i, (cls, txt) in enumerate(clean_ps):
            m_range = re.search(r'॥\s*([0-9]+)\s*[-—–]\s*([0-9]+)\s*॥', txt)
            m_single = re.search(r'॥\s*([0-9]+)\s*॥', txt)
            
            if m_range and cls == 'block_18':
                start_v = int(m_range.group(1))
                end_v = int(m_range.group(2))
                trans = clean_ps[i+1][1] if i+1 < len(clean_ps) and clean_ps[i+1][0] == 'block_19' else ""
                trans = re.sub(r'॥\s*[0-9\s\-—–]+\s*॥\s*$', '', trans).strip()
                for v_n in range(start_v, end_v + 1):
                    ch_verses[v_n] = trans
            elif m_single and cls == 'block_18':
                v_n = int(m_single.group(1))
                trans = clean_ps[i+1][1] if i+1 < len(clean_ps) and clean_ps[i+1][0] == 'block_19' else ""
                trans = re.sub(r'॥\s*[0-9\s\-—–]+\s*॥\s*$', '', trans).strip()
                ch_verses[v_n] = trans

        # Colophon for Chapter 8 verse 40
        if ch_num == 8:
            ch_verses[40] = "इस प्रकार श्रीमहाभारत उद्योगपर्वके अन्तर्गत प्रजागरपर्वमें विदुरवाक्यविषयक चालीसवाँ अध्याय (विदुरनीति) सम्पूर्ण हुआ।"

        extracted[ch_num] = ch_verses

    return extracted

def main():
    dry_run = "--dry" in sys.argv or "--dry-run" in sys.argv

    if not os.path.exists(EPUB_PATH):
        print(f"Error: EPUB not found at {EPUB_PATH}")
        sys.exit(1)

    print(f"Loading EPUB: {EPUB_PATH}...")
    extracted = extract_all_verses(EPUB_PATH)
    total_extracted = sum(len(v) for v in extracted.values())
    print(f"Extracted {total_extracted} verses from EPUB across 8 chapters.")

    with open(TARGET_JSON, 'r', encoding='utf-8') as f:
        target_data = json.load(f)

    stats = {
        'total': 0,
        'refilled': 0,
        'missing': 0
    }

    records = []
    for ch_idx, ch in enumerate(target_data.get('chapters', []), 1):
        ch_verses = extracted.get(ch_idx, {})
        for v in ch.get('verses', []):
            stats['total'] += 1
            v_num = v.get('number')
            
            if v_num in ch_verses:
                hindi_text = ch_verses[v_num]
                v['hindi'] = hindi_text
                v['hindiSource'] = 'gitapress'
                v['translationSource'] = 'gitapress'
                
                # Clean template dummy text from wordMeaning or commentary if present
                if v.get('wordMeaning') and "विदुरनीति श्लोक का अर्थ" in v.get('wordMeaning', ''):
                    v.pop('wordMeaning', None)
                if v.get('commentary') and "विदुरनीति श्लोक का अर्थ" in v.get('commentary', ''):
                    v.pop('commentary', None)
                if v.get('explanation') and "विदुरनीति श्लोक का अर्थ" in v.get('explanation', ''):
                    v.pop('explanation', None)
                    
                stats['refilled'] += 1
                records.append({
                    'chapter': ch_idx,
                    'verse': v_num,
                    'hindi': hindi_text[:80] + '...'
                })
            else:
                stats['missing'] += 1
                print(f"WARNING: Missing Ch {ch_idx} v {v_num} in extraction!")

    print(f"\nVidura Niti Refill Stats:")
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

