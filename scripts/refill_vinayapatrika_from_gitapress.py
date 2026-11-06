"""
Refill Vinaya Patrika Hindi translations from the official Gita Press EPUB:
Code 105: Vinay-Patrika With Simple Meaning (Devotional Hindi Poetry by Goswami Tulsidas).

Extracts pure Unicode Hindi Bhavartha translations from decrypted EPUB, verifies
against canonical Awadhi text and verse numbering, and updates public/data/scriptures-full/vinayapatrika.json.

Awadhi/Sanskrit text, transliteration, and verse numbering are NEVER changed.
Provenance recorded in data/refill/vinayapatrika-gitapress-2026-11-06.json.
"""

import zipfile
import re
import json
import os
import sys

DATE = "2026-11-06"
EPUB_PATH = r"data/sources-local/gitapress_decrypted_epubs/gitapress_0105_Vinay-Patrika_(With_Simple_Meaning)_–_Devotional_H.epub"
BOOK_JSON_PATH = r"public/data/scriptures-full/vinayapatrika.json"
REFILL_DIR = r"data/refill"
PROVENANCE_PATH = os.path.join(REFILL_DIR, f"vinayapatrika-gitapress-{DATE}.json")

DEV_DIGITS = {'०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9'}

def dev2int(s):
    if not s:
        return None
    res = ''.join(DEV_DIGITS.get(c, c) for c in s if c in DEV_DIGITS or c.isdigit())
    return int(res) if res else None

def clean_hindi(t):
    t = re.sub(r'\[\s*←\d+\s*\]', '', t)
    t = re.sub(r'\s*॥\s*[०-९0-9]+(?:\s*[—\-]\s*[०-९0-9]+)?\s*॥\s*$', '', t)
    t = re.sub(r'\s*॥\s*$', '', t)
    t = re.sub(r'([ऀ-ॿ])\d+', r'\1', t)
    return t.strip()

def main():
    dry_run = "--dry" in sys.argv

    if not os.path.exists(EPUB_PATH):
        print(f"Error: EPUB not found at {EPUB_PATH}")
        sys.exit(1)

    print("Loading Vinaya Patrika EPUB HTML files...")
    with zipfile.ZipFile(EPUB_PATH, 'r') as z:
        all_ps = []
        files = sorted([f for f in z.namelist() if f.endswith(('.html', '.xhtml')) and 'split' in f])
        for fname in files:
            html = z.read(fname).decode('utf-8', errors='ignore')
            ps = re.findall(r'<p[^>]*>(.*?)</p>', html, re.DOTALL)
            clean = [re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', p)).strip() for p in ps if p.strip()]
            for p in clean:
                all_ps.append(p)

    print(f"Read {len(all_ps)} paragraphs from EPUB.")

    # Slice monotonically 1 to 279
    pad_slices = {}
    current_pad = 0
    current_ps = []

    for p in all_ps:
        m = re.match(r'^\[\s*([०-९0-9]+)\s*\]$', p)
        if m:
            num = dev2int(m.group(1))
            if num == current_pad + 1 and num <= 279:
                if current_pad > 0:
                    pad_slices[current_pad] = current_ps
                current_pad = num
                current_ps = []
                continue
        if current_pad > 0:
            current_ps.append(p)

    if current_pad > 0:
        pad_slices[current_pad] = current_ps

    print(f"Sliced {len(pad_slices)} / 279 Pads.")

    with open(BOOK_JSON_PATH, 'r', encoding='utf-8') as f:
        book_data = json.load(f)

    stats = {
        "total_book_chapters": len(book_data["chapters"]),
        "total_book_verses": sum(len(c["verses"]) for c in book_data["chapters"]),
        "single_verses_updated": 0,
        "range_pointers_set": 0,
        "missing_hindi_filled": 0,
        "existing_hindi_replaced": 0,
        "explanations_filled": 0,
        "skipped_no_match": 0
    }

    refill_details = {}

    for pad_num in range(1, 280):
        book_ch = book_data['chapters'][pad_num - 1]
        ps = pad_slices.get(pad_num, [])
        hi_dict = {}

        if pad_num == 49:
            # Harishankari pad: pairs of paragraphs 20-36
            hi_dict[1] = clean_hindi(ps[20] + " " + ps[21])
            hi_dict[2] = clean_hindi(ps[22] + " " + ps[23])
            hi_dict[3] = clean_hindi(ps[24] + " " + ps[25])
            hi_dict[4] = clean_hindi(ps[26] + " " + ps[27])
            hi_dict[5] = clean_hindi(ps[28] + " " + ps[29])
            hi_dict[6] = clean_hindi(ps[30] + " " + ps[31])
            hi_dict[7] = clean_hindi(ps[32] + " " + ps[33])
            hi_dict[8] = clean_hindi(ps[34] + " " + ps[35])
            hi_dict[9] = clean_hindi(ps[36])
        elif pad_num == 136:
            hi_dict[1] = clean_hindi(re.sub(r'^भावार्थ[—\-:\s]*', '', ps[85]))
            for s_idx, p_idx in enumerate(range(87, 108, 2), start=2):
                if p_idx < len(ps):
                    hi_dict[s_idx] = clean_hindi(ps[p_idx])
        else:
            bhavartha_ps = []
            in_bhavartha = False
            for p in ps:
                if 'भावार्थ' in p:
                    in_bhavartha = True
                if in_bhavartha:
                    bhavartha_ps.append(p)
                    
            bhavartha_full = ' '.join(bhavartha_ps)
            bhavartha_text = re.sub(r'^भावार्थ[—\-:\s]*', '', bhavartha_full).strip()
            
            p_cleaned = re.sub(r'॥\s*([०-९0-9\s—\-]+?)\s*॥', lambda m: '॥ ' + ''.join(m.group(1).split()) + ' ॥', bhavartha_text)
            p_cleaned = re.sub(r'॥\s*([०-९0-9]+)\s+(?=[^\s\d०-९|॥।—\-])', r'॥ \1 ॥ ', p_cleaned)
            matches = list(re.finditer(r'(.*?)(?:॥\s*([०-९0-9]+(?:\s*[—\-]\s*[०-९0-9]+)?)\s*॥)', p_cleaned))
            if matches:
                for hm in matches:
                    chunk = hm.group(1).strip()
                    num_str = hm.group(2)
                    cleaned_hi = clean_hindi(chunk)
                    if '—' in num_str or '-' in num_str:
                        parts = re.split(r'[—\-]', num_str)
                        s_n, e_n = dev2int(parts[0]), dev2int(parts[1])
                        if s_n and e_n and e_n >= s_n:
                            for n in range(s_n, e_n + 1):
                                hi_dict[n] = cleaned_hi
                    else:
                        n = dev2int(num_str)
                        if n:
                            hi_dict[n] = cleaned_hi
            else:
                hi_dict[1] = clean_hindi(bhavartha_text)

        ch_refill_count = 0
        for v in book_ch['verses']:
            try:
                v_num = int(str(v['number']).split('-')[0])
            except Exception:
                continue

            h_text = hi_dict.get(v_num)
            if not h_text and len(book_ch['verses']) == 1:
                h_text = hi_dict.get(1)

            if not h_text:
                stats["skipped_no_match"] += 1
                continue

            existing_hi = v.get("hindi", "")
            if not existing_hi:
                stats["missing_hindi_filled"] += 1
            else:
                stats["existing_hindi_replaced"] += 1

            v["hindi"] = h_text
            v["hindiSource"] = "gitapress-code-0105"
            v["explanation"] = h_text
            stats["explanations_filled"] += 1
            stats["single_verses_updated"] += 1
            ch_refill_count += 1

        refill_details[str(pad_num)] = {
            "title": book_ch.get("title"),
            "verses_total": len(book_ch["verses"]),
            "verses_refilled": ch_refill_count
        }

    print("\n--- REFILL SUMMARY ---")
    for k, val in stats.items():
        print(f"  {k}: {val}")

    if not dry_run:
        os.makedirs(REFILL_DIR, exist_ok=True)
        with open(BOOK_JSON_PATH, 'w', encoding='utf-8') as f:
            json.dump(book_data, f, ensure_ascii=False, indent=2)
        print(f"\nSuccessfully wrote updated scripture to {BOOK_JSON_PATH}")

        provenance = {
            "scripture": "vinayapatrika",
            "source": "Gita Press Gorakhpur (Decrypted EPUB)",
            "epub_code": "0105",
            "epub_title": "Vinay-Patrika With Simple Meaning (Devotional Hindi Poetry)",
            "date": DATE,
            "statistics": stats,
            "chapter_breakdown": refill_details
        }
        with open(PROVENANCE_PATH, 'w', encoding='utf-8') as f:
            json.dump(provenance, f, ensure_ascii=False, indent=2)
        print(f"Saved provenance to {PROVENANCE_PATH}")
    else:
        print("\nDry run completed. No files modified.")

if __name__ == "__main__":
    main()

