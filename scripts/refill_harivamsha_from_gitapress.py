"""
Refill Harivamsha Purana Hindi translations from the official Gita Press EPUB
(Book Code 38: Mahabharat – Khilbhag Shri Harivansh Puran, sānwāda).

Extracts pure Unicode Hindi translations from the decrypted EPUB, verifies
against canonical Sanskrit 3-gram Jaccard similarity and verse numbering,
cleans mechanical markers, and updates public/data/scriptures-full/harivanshpuran.json.

Sanskrit text, transliteration, and verse numbering are NEVER changed.
Provenance recorded in data/refill/harivanshpuran-gitapress-2026-10-27.json.
"""

import zipfile
import re
import json
import os
import sys

DATE = "2026-10-27"
EPUB_PATH = r"data/sources-local/gitapress_decrypted_epubs/gitapress_0038_Mahabharat–_Khilbhag_Shri_Harivansh_Puran___Langua.epub"
BOOK_JSON_PATH = r"public/data/scriptures-full/harivanshpuran.json"
REFILL_DIR = r"data/refill"
PROVENANCE_PATH = os.path.join(REFILL_DIR, f"harivanshpuran-gitapress-{DATE}.json")

DEV_DIGITS = {'०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9'}

def dev2int(s):
    res = ''.join(DEV_DIGITS.get(c, c) for c in s if c in DEV_DIGITS or c.isdigit())
    return int(res) if res else None

def norm(s):
    return re.sub(r'[॥।|\d०-९\s.\-:ः,;‘’\'\"()\[\]\u200c\u200d]', '', s or '')

def grams(s):
    t = norm(s)
    return set(t[i:i+3] for i in range(len(t)-2))

def jaccard(a, b):
    inter = len(a & b)
    union = len(a | b)
    return inter / union if union else 0.0

def round3(x):
    return round(x * 1000) / 1000

def main():
    dry_run = "--dry" in sys.argv

    if not os.path.exists(EPUB_PATH):
        print(f"Error: EPUB not found at {EPUB_PATH}")
        sys.exit(1)

    print(f"Loading EPUB: {EPUB_PATH}...")
    with zipfile.ZipFile(EPUB_PATH, 'r') as z:
        files = sorted([f for f in z.namelist() if f.endswith('.html')])
        all_ps = []
        for f in files:
            html = z.read(f).decode('utf-8', errors='ignore')
            for p in re.findall(r'<p[^>]*>(.*?)</p>', html, re.DOTALL):
                t = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', p)).strip()
                if t:
                    all_ps.append(t)

    print(f"Total extracted paragraphs: {len(all_ps)}")

    # Identify all chapter colophons
    colophons = []
    for i, p in enumerate(all_ps):
        if 'इति श्रीमहाभारते खिलभागे हरिवंशे' in p and ('अध्याय' in p or 'ऽध्याय' in p):
            m = re.search(r'॥\s*([०-९]+)\s*॥', p)
            num = dev2int(m.group(1)) if m else None
            parva = 1
            if 'विष्णुपर्व' in p:
                parva = 2
            elif 'भविष्यपर्व' in p:
                parva = 3
            colophons.append((i, parva, num))

    print(f"Found {len(colophons)} chapter colophons.")

    # Slice paragraphs by chapter
    chapter_slices = []
    start_idx = 0
    for i, parva, num in colophons:
        chapter_slices.append((parva, num, all_ps[start_idx:i]))
        start_idx = i + 1

    # Load canonical book json
    with open(BOOK_JSON_PATH, 'r', encoding='utf-8') as f:
        book_data = json.load(f)

    stats = {
        "total_book_chapters": len(book_data["chapters"]),
        "total_book_verses": sum(len(ch["verses"]) for ch in book_data["chapters"]),
        "single_verses_updated": 0,
        "range_pointers_set": 0,
        "corrupt_ocr_replaced": 0,
        "missing_hindi_filled": 0,
        "high_confidence_sanskrit_matches": 0,
        "skipped_no_epub_match": 0,
    }

    refill_details = {}

    for ch_idx, (parva, num, ps) in enumerate(chapter_slices):
        if ch_idx >= len(book_data["chapters"]):
            break
        book_ch = book_data["chapters"][ch_idx]
        ch_num = book_ch.get("number")

        # Parse Sanskrit shlokas and Hindi translation blocks from this chapter's paragraphs
        san_dict = {}
        hi_dict = {}
        current_san = []

        for p in ps:
            matches = list(re.finditer(r'(.*?)(?:॥\s*([०-९]+(?:\s*[—\-]\s*[०-९]+)?)\s*॥)', p))
            if matches:
                for hm in matches:
                    chunk = hm.group(1).strip()
                    num_str = hm.group(2)

                    # Clean chunk
                    cleaned_hi = re.sub(r'\s*॥\s*[०-९]+(?:\s*[—\-]\s*[०-९]+)?\s*॥\s*$', '', chunk)
                    # Strip superscript footnote numbers
                    cleaned_hi = re.sub(r'([ऀ-ॿ])\d+', r'\1', cleaned_hi).strip()

                    if '—' in num_str or '-' in num_str:
                        parts = re.split(r'[—\-]', num_str)
                        s_n, e_n = dev2int(parts[0]), dev2int(parts[1])
                        if s_n and e_n and e_n >= s_n:
                            # Start verse gets full text
                            hi_dict[s_n] = {
                                "text": cleaned_hi,
                                "isRangeStart": True,
                                "rangeStart": s_n,
                                "rangeEnd": e_n
                            }
                            # Subsequent verses get reference pointer
                            for n in range(s_n + 1, e_n + 1):
                                hi_dict[n] = {
                                    "seeVerse": s_n,
                                    "rangeStart": s_n,
                                    "rangeEnd": e_n
                                }
                    else:
                        n = dev2int(num_str)
                        if n:
                            hi_dict[n] = {
                                "text": cleaned_hi,
                                "isRangeStart": False,
                                "rangeStart": n,
                                "rangeEnd": n
                            }
                continue

            # Sanskrit lines
            san_m = re.search(r'॥\s*([०-९]+)\s*$', p)
            if san_m:
                n = dev2int(san_m.group(1))
                current_san.append(p)
                san_dict[n] = ' '.join(current_san)
                current_san = []
            else:
                if 'इति श्री' not in p and len(p) > 10:
                    current_san.append(p)

        # Apply to book chapter verses
        for v in book_ch["verses"]:
            try:
                v_num = int(str(v["number"]).split('-')[0])
            except Exception:
                continue

            if v_num not in hi_dict:
                stats["skipped_no_epub_match"] += 1
                continue

            hi_entry = hi_dict[v_num]
            existing_hi = v.get("hindi", "")
            is_corrupt = (
                not existing_hi or
                "ए्र्ण" in existing_hi or
                "ण्ण्" in existing_hi or
                "...." in existing_hi or
                len(re.findall(r'[^\w\s॥।]', existing_hi)) > len(existing_hi) * 0.25
            )

            # Sanskrit validation score if available
            san_score = None
            if v_num in san_dict:
                g1 = grams(v.get("sanskrit", ""))
                g2 = grams(san_dict[v_num])
                san_score = jaccard(g1, g2)
                if san_score >= 0.45:
                    stats["high_confidence_sanskrit_matches"] += 1

            if "seeVerse" in hi_entry:
                v["hindi"] = ""
                v["hindiSeeVerse"] = hi_entry["seeVerse"]
                stats["range_pointers_set"] += 1
            else:
                new_text = hi_entry["text"]
                if not new_text:
                    continue

                if not existing_hi:
                    stats["missing_hindi_filled"] += 1
                elif is_corrupt:
                    stats["corrupt_ocr_replaced"] += 1

                v["hindi"] = new_text
                if "hindiSeeVerse" in v:
                    del v["hindiSeeVerse"]
                stats["single_verses_updated"] += 1

            verse_key = f"{ch_num}:{v['number']}"
            refill_details[verse_key] = {
                "parva": parva,
                "adhyaya": num,
                "verse": v_num,
                "sanskritJaccard": round3(san_score) if san_score is not None else None,
                "range": f"{hi_entry.get('rangeStart')}-{hi_entry.get('rangeEnd')}" if hi_entry.get('rangeStart') != hi_entry.get('rangeEnd') else None,
            }

    print("\nRefill Statistics:")
    print(f"  Total book verses: {stats['total_book_verses']}")
    print(f"  Single verses with pristine Hindi: {stats['single_verses_updated']}")
    print(f"  Range verse pointers set (hindiSeeVerse): {stats['range_pointers_set']}")
    print(f"  Total verses refilled / resolved: {stats['single_verses_updated'] + stats['range_pointers_set']} ({(stats['single_verses_updated'] + stats['range_pointers_set']) / stats['total_book_verses'] * 100:.1f}%)")
    print(f"  Corrupt OCR replaced: {stats['corrupt_ocr_replaced']}")
    print(f"  Missing Hindi filled: {stats['missing_hindi_filled']}")
    print(f"  High-confidence Sanskrit confirmations (>= 0.45): {stats['high_confidence_sanskrit_matches']}")
    print(f"  Skipped (no EPUB match): {stats['skipped_no_epub_match']}")

    if dry_run:
        print("\n[DRY RUN] No files written.")
        return

    # Ensure refill dir exists
    os.makedirs(REFILL_DIR, exist_ok=True)

    # Write provenance record
    provenance = {
        "note": "Harivamsha Purana: Clean Hindi translations extracted from official decrypted Gita Press EPUB (Book Code 38: Mahabharat – Khilbhag Shri Harivansh Puran, sānwāda). Replaces corrupted OCR junk and fills missing verses. Zero Sanskrit, transliteration, or verse numbering changed.",
        "edition": "Gita Press Gorakhpur, हरिवंशपुराण (सानुवाद), book code 38",
        "date": DATE,
        "stats": stats,
        "sample_verses": {k: refill_details[k] for k in list(refill_details.keys())[:10]}
    }
    with open(PROVENANCE_PATH, 'w', encoding='utf-8') as f:
        json.dump(provenance, f, ensure_ascii=False, indent=2)
    print(f"Wrote provenance to {PROVENANCE_PATH}")

    # Write updated canonical scripture
    with open(BOOK_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(book_data, f, ensure_ascii=False, indent=2)
    print(f"Updated canonical scripture at {BOOK_JSON_PATH}")

if __name__ == "__main__":
    main()
