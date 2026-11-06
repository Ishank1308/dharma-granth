"""
Refill Brahmasutra (Vedanta Darshan) authentic word meanings and commentaries
from the official Gita Press EPUB (Book Code 65: Vedanta Darshan / Brahmasutra, Harikrishnadas Goyandka).

Extracts pure Unicode word meanings (padachheda) and authoritative Goyandka Vyakhya commentaries
from the decrypted EPUB, cleans mechanical markers, ensures ASCII numerals,
and updates public/data/scriptures-full/brahmasutra.json for all 564 sutras across 4 adhyayas.

Canonical Sanskrit text, transliteration, and sutra numbering (e.g. 1.1.1) are NEVER changed.
Provenance recorded in data/refill/brahmasutra-gitapress-2026-11-06.json.
"""

import zipfile
import re
import html
import json
import os
import sys

DATE = "2026-11-06"
EPUB_PATH = r"data/sources-local/gitapress_decrypted_epubs/gitapress_0065_Vedanta_Darshan_(Brahmasutra)___Shrimad_Vedavyasap.epub"
TARGET_JSON = r"public/data/scriptures-full/brahmasutra.json"
REFILL_DIR = r"data/refill"
PROVENANCE_PATH = os.path.join(REFILL_DIR, f"brahmasutra-gitapress-{DATE}.json")

def clean_text(raw):
    text = re.sub(r'<[^>]+>', ' ', raw)
    text = html.unescape(text)
    text = re.sub(r'\[\s*←\d+\s*\]', '', text)
    text = text.translate(str.maketrans('०१२३४५६७८९', '0123456789'))
    return re.sub(r'\s+', ' ', text).strip()

def normalize_sk(s):
    s = s.replace(':', 'ः')
    m = re.findall(r'ॐ\s*(.*?)\s*ॐ', s)
    if m:
        s = m[-1]
    s = re.sub(r'पाठभेद[^\n]+', '', s)
    s = re.sub(r'इति[^\n]+', '', s)
    s = s.replace('ं', 'म').replace('ं', 'न')
    s = re.sub(r'[\s|।॥०-९0-9\-_.,:;!?()\[\]\'"ॐ]+', '', s)
    return s

def shingles(s):
    clean = normalize_sk(s)
    if len(clean) <= 2:
        return {clean}
    return set(clean[i:i+3] for i in range(len(clean)-2))

def extract_all_pada_entries(epub_path):
    pada_files = {}
    split_idx = 3
    for a in range(1, 5):
        for p in range(1, 5):
            pada_files[(a, p)] = f"index_split_{split_idx:03d}.html"
            split_idx += 1

    pada_entries = {}
    with zipfile.ZipFile(epub_path, 'r') as z:
        for (a, p), fname in pada_files.items():
            raw = z.read(fname).decode('utf-8', errors='ignore')
            ps = re.findall(r'<p\s+class="([^"]+)">(.*?)</p>', raw, re.DOTALL)
            
            entries = []
            curr_sutra = []
            curr_paras = []
            for cls, body in ps:
                t = clean_text(body)
                if not t: continue
                if cls == 'block_5':
                    if curr_paras:
                        entries.append({'sutra': " ".join(curr_sutra), 'paras': curr_paras})
                        curr_sutra = []
                        curr_paras = []
                    curr_sutra.append(t)
                else:
                    if curr_sutra:
                        curr_paras.append((cls, t))
            if curr_sutra:
                entries.append({'sutra': " ".join(curr_sutra), 'paras': curr_paras})
            pada_entries[(a, p)] = entries
    return pada_entries

def main():
    dry_run = "--dry" in sys.argv or "--dry-run" in sys.argv

    if not os.path.exists(EPUB_PATH):
        print(f"Error: EPUB not found at {EPUB_PATH}")
        sys.exit(1)

    print(f"Loading EPUB: {EPUB_PATH}...")
    pada_entries = extract_all_pada_entries(EPUB_PATH)
    total_ep_sutras = sum(len(e) for e in pada_entries.values())
    print(f"Extracted {total_ep_sutras} sutra blocks across 16 Padas.")

    with open(TARGET_JSON, 'r', encoding='utf-8') as f:
        target_data = json.load(f)

    stats = {
        'total': 0,
        'refilled_wm': 0,
        'refilled_comm': 0,
        'missing': 0
    }

    records = []
    for ch in target_data['chapters']:
        for v in ch['verses']:
            stats['total'] += 1
            parts = [int(x) for x in v['number'].split('.')]
            a, p, s_num = parts[0], parts[1], parts[2]
            
            t_sh = shingles(v['sanskrit'])
            ep_list = pada_entries.get((a, p), [])
            
            best_score = 0
            best_entry = None
            for entry in ep_list:
                e_sh = shingles(entry['sutra'])
                score = len(t_sh & e_sh) / len(t_sh | e_sh) if (t_sh | e_sh) else 0
                if score > best_score:
                    best_score = score
                    best_entry = entry
                    
            if best_entry and best_score > 0:
                paras = best_entry['paras']
                if paras:
                    # First paragraph is padachheda word meaning
                    wm = paras[0][1]
                    v['wordMeaning'] = wm
                    stats['refilled_wm'] += 1
                    
                    # Subsequent paragraphs are commentary (vyakhya, sambandha)
                    if len(paras) > 1:
                        comm = "\n\n".join(p[1] for p in paras[1:])
                        v['commentary'] = comm
                        v['explanation'] = comm
                        stats['refilled_comm'] += 1
                        
                v['hindiSource'] = 'gitapress'
                v['translationSource'] = 'gitapress'
                records.append({
                    'number': v['number'],
                    'has_wm': bool(v.get('wordMeaning')),
                    'has_comm': bool(v.get('commentary'))
                })
            else:
                stats['missing'] += 1
                print(f"WARNING: Unmatched sutra {v['number']}!")

    print(f"\nBrahmasutra Refill Stats:")
    print(f"  Total Sutras: {stats['total']}")
    print(f"  Refilled with Gita Press Word Meaning: {stats['refilled_wm']}")
    print(f"  Refilled with Gita Press Commentary: {stats['refilled_comm']}")
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
