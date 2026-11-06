"""
Refill Shvetashvatara Upanishad authentic Hindi translations and Shankara Bhashya commentaries
from the official Gita Press EPUB (Book Code 73: Shvetashvatara Upanishad, Shankarbhashya Sahit).

Extracts pure Unicode Hindi translations (anuvada) and full Hindi Shankara Bhashya commentary
from the decrypted EPUB, cleans mechanical markers, ensures ASCII numerals,
and updates public/data/scriptures-full/shvetashvatara.json for all 113 verses across 6 chapters.

Canonical Sanskrit text, transliteration, and verse numbering are NEVER changed.
Provenance recorded in data/refill/shvetashvatara-gitapress-2026-11-06.json.
"""

import zipfile
import re
import html
import json
import os
import sys

DATE = "2026-11-06"
EPUB_PATH = r"data/sources-local/gitapress_decrypted_epubs/gitapress_0073_Shvetashvatara_Upanishad_–_Sanskrit_Text_with_Hind.epub"
TARGET_JSON = r"public/data/scriptures-full/shvetashvatara.json"
REFILL_DIR = r"data/refill"
PROVENANCE_PATH = os.path.join(REFILL_DIR, f"shvetashvatara-gitapress-{DATE}.json")

CH_FILES = {
    1: ['index_split_005.html', 'index_split_006.html'],
    2: ['index_split_007.html'],
    3: ['index_split_008.html'],
    4: ['index_split_009.html'],
    5: ['index_split_010.html'],
    6: ['index_split_011.html']
}

def clean_text(raw):
    text = re.sub(r'<[^>]+>', ' ', raw)
    text = html.unescape(text)
    # clean footnote references like [ ←12 ]
    text = re.sub(r'\[\s*←\d+\s*\]', '', text)
    # convert any Devanagari numerals to ASCII
    text = text.translate(str.maketrans('०१२३४५६७८९', '0123456789'))
    return re.sub(r'\s+', ' ', text).strip()

def is_hindi(txt):
    return bool(re.search(r'(?:^|\s)(है|हैं|होता|होती|होते|था|थे|थी|किया|गया|गयी|गये|कहा|अपने|इस|उस|और|तथा|कि|से|को|का|के|की|में|पर)(?:$|\s|[।—–,\-!?:;])', txt))

def extract_all_verses(epub_path):
    extracted = {}
    with zipfile.ZipFile(epub_path, 'r') as z:
        for ch_num, fnames in CH_FILES.items():
            all_p = []
            for fname in fnames:
                raw = z.read(fname).decode('utf-8', errors='ignore')
                for cls, body in re.findall(r'<p\s+class="([^"]+)">(.*?)</p>', raw, re.DOTALL):
                    t = clean_text(body)
                    if t:
                        all_p.append((cls, t))
            
            # Find mantra markers: ॥ N ॥
            m_indices = []
            for i, (cls, t) in enumerate(all_p):
                m = re.search(r'॥\s*([0-9]+)\s*॥', t)
                if m and ('block_13' in cls):
                    num = int(m.group(1))
                    m_indices.append((i, num))
            
            for k in range(len(m_indices)):
                idx, num = m_indices[k]
                next_idx = m_indices[k+1][0] if k+1 < len(m_indices) else len(all_p)
                
                # Immediate next paragraph is translation
                trans = all_p[idx+1][1] if idx+1 < len(all_p) else ""
                trans = re.sub(r'॥\s*[0-9]+\s*॥\s*$', '', trans).strip()
                
                # Subsequent Hindi paragraphs are Shankara Bhashyartha commentary
                comm_paras = []
                for j in range(idx+2, next_idx):
                    p_cls, p_txt = all_p[j]
                    if is_hindi(p_txt) and not p_txt.startswith('इति') and not p_txt.startswith('अथ ') and 'अध्याय:' not in p_txt:
                        p_clean = re.sub(r'॥\s*[0-9]+\s*॥\s*$', '', p_txt).strip()
                        if p_clean and len(p_clean) > 5:
                            comm_paras.append(p_clean)
                
                comm = "\n\n".join(comm_paras)
                extracted[(ch_num, num)] = {
                    'hindi': trans,
                    'commentary': comm
                }
    return extracted

def main():
    dry_run = "--dry" in sys.argv or "--dry-run" in sys.argv

    if not os.path.exists(EPUB_PATH):
        print(f"Error: EPUB not found at {EPUB_PATH}")
        sys.exit(1)

    print(f"Loading EPUB: {EPUB_PATH}...")
    extracted = extract_all_verses(EPUB_PATH)
    print(f"Extracted {len(extracted)} mantras from EPUB.")

    with open(TARGET_JSON, 'r', encoding='utf-8') as f:
        target_data = json.load(f)

    stats = {
        'total': 0,
        'refilled': 0,
        'with_commentary': 0,
        'missing': 0
    }

    records = []
    for ch in target_data.get('chapters', []):
        ch_num = ch.get('number')
        for v in ch.get('verses', []):
            stats['total'] += 1
            v_num = v.get('number')
            key = (ch_num, v_num)
            
            if key in extracted:
                info = extracted[key]
                v['hindi'] = info['hindi']
                v['hindiSource'] = 'gitapress'
                v['translationSource'] = 'gitapress'
                if info['commentary']:
                    v['commentary'] = info['commentary']
                    stats['with_commentary'] += 1
                stats['refilled'] += 1
                records.append({
                    'chapter': ch_num,
                    'verse': v_num,
                    'hindi': info['hindi'][:80] + '...',
                    'has_commentary': bool(info['commentary'])
                })
            else:
                stats['missing'] += 1
                print(f"WARNING: Missing Ch {ch_num} v {v_num} in extraction!")

    print(f"\nShvetashvatara Refill Stats:")
    print(f"  Total Verses: {stats['total']}")
    print(f"  Refilled with Gita Press Hindi: {stats['refilled']}")
    print(f"  With Shankara Bhashya Commentary: {stats['with_commentary']}")
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

