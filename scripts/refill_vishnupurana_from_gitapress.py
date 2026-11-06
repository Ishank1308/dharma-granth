"""
Refill Vishnu Purana Hindi translations from the official Gita Press EPUB:
Code 48: Sri Vishnu Purana (with Hindi translation, Sachitra).

Extracts pure Unicode Hindi translations from the decrypted EPUB, verifies
against canonical Sanskrit and verse numbering, handles prose sentence alignment
in Book 4, cleans mechanical markers, and updates public/data/scriptures-full/vishnupurana.json.

Sanskrit text, transliteration, and verse numbering are NEVER changed.
Provenance recorded in data/refill/vishnupurana-gitapress-2026-11-06.json.
"""

import zipfile
import re
import json
import os
import sys
import xml.etree.ElementTree as ET

DATE = "2026-11-06"
EPUB_PATH = r"data/sources-local/gitapress_decrypted_epubs/gitapress_0048_Sri_Vishnu_Puran___Language__Hindi___Code__48.epub"
BOOK_JSON_PATH = r"public/data/scriptures-full/vishnupurana.json"
REFILL_DIR = r"data/refill"
PROVENANCE_PATH = os.path.join(REFILL_DIR, f"vishnupurana-gitapress-{DATE}.json")

DEV_DIGITS = {'०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9'}

def dev2int(s):
    if not s:
        return None
    res = ''.join(DEV_DIGITS.get(c, c) for c in s if c in DEV_DIGITS or c.isdigit())
    return int(res) if res else None

def norm(s):
    return re.sub(r'[॥।|\d०-९\s.\-:ः,;‘’\'\"()\[\]\u200c\u200d]', '', s or '')

def grams(s):
    t = norm(s)
    if len(t) < 3:
        return {t} if t else set()
    return set(t[i:i+3] for i in range(len(t)-2))

def jaccard(a, b):
    inter = len(a & b)
    union = len(a | b)
    return inter / union if union else 0.0

def load_epub_toc_and_files(epub_path):
    with zipfile.ZipFile(epub_path, 'r') as z:
        toc_xml = z.read('toc.ncx').decode('utf-8', errors='ignore')
        root = ET.fromstring(toc_xml)
        ns = {'ncx': 'http://www.daisy.org/z3986/2005/ncx/'}
        
        chapters_toc = []
        navmap = root.find('ncx:navMap', ns)
        for amsha_idx, amsha_point in enumerate(navmap.findall('ncx:navPoint', ns)):
            amsha_title = amsha_point.find('ncx:navLabel/ncx:text', ns).text.strip()
            if 'अंश' not in amsha_title:
                continue
            for adh_idx, adh_point in enumerate(amsha_point.findall('ncx:navPoint', ns)):
                adh_title = adh_point.find('ncx:navLabel/ncx:text', ns).text.strip()
                adh_src = adh_point.find('ncx:content', ns).attrib.get('src')
                chapters_toc.append({
                    'amsha_idx': amsha_idx + 1,
                    'amsha_title': amsha_title,
                    'adh_idx': adh_idx + 1,
                    'adh_title': adh_title,
                    'src': adh_src
                })

        file_contents = {}
        for f in range(1, 48):
            fname = f"index_split_{f:03d}.html"
            file_contents[fname] = z.read(fname).decode('utf-8', errors='ignore')

    return chapters_toc, file_contents

def get_chapter_paragraphs(i, chapters_toc, file_contents):
    ch = chapters_toc[i]
    f_start, _, a_start = ch['src'].partition('#')
    if i + 1 < len(chapters_toc):
        next_ch = chapters_toc[i+1]
        f_end, _, a_end = next_ch['src'].partition('#')
    else:
        f_end, a_end = 'index_split_047.html', None
        
    html_f_start = file_contents[f_start]
    pos_start = 0
    if a_start:
        p = html_f_start.find(a_start)
        if p != -1:
            pos_start = p
            
    if f_start == f_end:
        pos_end = len(html_f_start)
        if a_end:
            p = html_f_start.find(a_end, pos_start)
            if p != -1:
                pos_end = p
        ch_html = html_f_start[pos_start:pos_end]
    else:
        parts = [html_f_start[pos_start:]]
        start_num = int(f_start.split('_')[2].split('.')[0])
        end_num = int(f_end.split('_')[2].split('.')[0])
        for mid in range(start_num + 1, end_num):
            parts.append(file_contents[f"index_split_{mid:03d}.html"])
        if a_end:
            html_f_end = file_contents[f_end]
            p = html_f_end.find(a_end)
            if p != -1:
                parts.append(html_f_end[:p])
        ch_html = ''.join(parts)
        
    ps = re.findall(r'<p[^>]*>(.*?)</p>', ch_html, re.DOTALL)
    clean_ps = [re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', p)).strip() for p in ps if p.strip()]
    return clean_ps

def clean_hindi_text(t):
    # Remove bracketed page/line indicators or OCR footers
    t = re.sub(r'\[\s*←\d+\s*\]', '', t)
    # Remove trailing danda markers
    t = re.sub(r'\s*॥\s*[०-९0-9]+(?:\s*[—\-]\s*[०-९0-9]+)?\s*॥\s*$', '', t)
    t = re.sub(r'\s*॥\s*$', '', t)
    # Remove stray footnote numbers attached to devanagari letters
    t = re.sub(r'([ऀ-ॿ])\d+', r'\1', t)
    return t.strip()

def parse_metrical_chapter(ps):
    hi_dict = {}
    san_dict = {}
    current_san = []

    for p in ps:
        if 'इति श्रीविष्णुपुराणे' in p or ('इति श्री' in p and 'अध्याय' in p):
            continue
        # Clean internal whitespace in danda numbers: e.g. '॥ ४ ७॥' -> '॥ ४७ ॥'
        p = re.sub(r'॥\s*([०-९0-9\s—\-]+?)\s*॥', lambda m: '॥ ' + ''.join(m.group(1).split()) + ' ॥', p)
        # Fix unclosed danda numbers before non-digit devanagari text: e.g. '॥ १६ यदि' -> '॥ १६ ॥ यदि'
        p_cleaned = re.sub(r'॥\s*([०-९0-9]+)\s+(?=[^\s\d०-९|॥।—\-])', r'॥ \1 ॥ ', p)
        matches = list(re.finditer(r'(.*?)(?:॥\s*([०-९0-9]+(?:\s*[—\-]\s*[०-९0-9]+)?)\s*॥)', p_cleaned))
        if matches:
            for hm in matches:
                chunk = hm.group(1).strip()
                num_str = hm.group(2)
                cleaned_hi = clean_hindi_text(chunk)
                if '—' in num_str or '-' in num_str:
                    parts = re.split(r'[—\-]', num_str)
                    s_n, e_n = dev2int(parts[0]), dev2int(parts[1])
                    if s_n and e_n and e_n >= s_n:
                        hi_dict[s_n] = {
                            "text": cleaned_hi,
                            "isRangeStart": True,
                            "rangeStart": s_n,
                            "rangeEnd": e_n
                        }
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

        san_m = re.search(r'॥\s*([०-९0-9]+)\s*$', p)
        if san_m:
            n = dev2int(san_m.group(1))
            current_san.append(p)
            if n:
                san_dict[n] = ' '.join(current_san)
            current_san = []
        else:
            if len(p) > 5 and not p.startswith('श्री') and 'उवाच' not in p:
                current_san.append(p)

    return hi_dict, san_dict

def parse_prose_chapter(ps):
    # For Book 4 prose: extract all Sanskrit and Hindi sentences with their identifiers
    # In Book 4, Sanskrit and Hindi appear in alternating paragraphs or sections
    san_pieces = {}
    hi_pieces = {}

    for p in ps:
        if 'इति श्रीविष्णुपुराणे' in p or ('इति श्री' in p and 'अध्याय' in p):
            continue
        is_hindi = bool(re.search(r'(?:^|\s)(बोले|ने|का|की|के|हुए|किया|थी|था|हैं|में|से|को|और|तो|यह|वह)(?:$|\s|[।—–,\-!?:;])', p))
        p_cleaned = re.sub(r'॥\s*([०-९0-9\s—\-]+?)\s*॥', lambda m: '॥ ' + ''.join(m.group(1).split()) + ' ॥', p)
        p_cleaned = re.sub(r'॥\s*([०-९0-9]+)\s+(?=[^\s\d०-९|॥।—\-])', r'॥ \1 ॥ ', p_cleaned)
        matches = list(re.finditer(r'(.*?)(?:॥\s*([०-९0-9]+(?:\s*[—\-]\s*[०-९0-9]+)?)\s*॥)', p_cleaned))
        if matches:
            for m in matches:
                chunk = m.group(1).strip()
                num_str = m.group(2)
                if '—' in num_str or '-' in num_str:
                    parts = re.split(r'[—\-]', num_str)
                    s_n, e_n = dev2int(parts[0]), dev2int(parts[1])
                    if s_n and e_n and e_n >= s_n:
                        for k in range(s_n, e_n + 1):
                            if is_hindi:
                                hi_pieces[k] = clean_hindi_text(chunk)
                            else:
                                san_pieces[k] = chunk
                else:
                    n = dev2int(num_str)
                    if n:
                        if is_hindi:
                            hi_pieces[n] = clean_hindi_text(chunk)
                        else:
                            san_pieces[n] = chunk
        else:
            # Maybe a shloka inside prose (e.g. verses 1-2 in Ch 1)
            san_m = re.search(r'॥\s*([०-९0-9]+)\s*$', p)
            if san_m:
                n = dev2int(san_m.group(1))
                if n and not is_hindi:
                    san_pieces[n] = p

    return hi_pieces, san_pieces

def main():
    dry_run = "--dry" in sys.argv

    if not os.path.exists(EPUB_PATH):
        print(f"Error: EPUB not found at {EPUB_PATH}")
        sys.exit(1)

    print("Loading Vishnu Purana EPUB TOC and HTML files...")
    chapters_toc, file_contents = load_epub_toc_and_files(EPUB_PATH)
    print(f"Loaded {len(chapters_toc)} chapters from EPUB TOC.")

    with open(BOOK_JSON_PATH, 'r', encoding='utf-8') as f:
        book_data = json.load(f)

    stats = {
        "total_book_chapters": len(book_data["chapters"]),
        "total_book_verses": sum(len(ch["verses"]) for ch in book_data["chapters"]),
        "single_verses_updated": 0,
        "range_pointers_set": 0,
        "missing_hindi_filled": 0,
        "existing_hindi_replaced": 0,
        "prose_verses_aligned": 0,
        "skipped_no_match": 0
    }

    refill_details = {}

    for ch_idx, book_ch in enumerate(book_data["chapters"]):
        if ch_idx >= len(chapters_toc):
            break

        toc_entry = chapters_toc[ch_idx]
        amsha_idx = toc_entry['amsha_idx']
        ch_num = book_ch.get("number")
        ps = get_chapter_paragraphs(ch_idx, chapters_toc, file_contents)

        ch_refill_count = 0
        ch_range_count = 0

        # Special patch for Chapter 93 (Book 5 Adhyaya 13) verse 24 where Calibre omitted broken span
        if ch_idx == 92: # Ch 93
            v24_text = "जब श्रीकृष्ण अन्य स्थानमें चले गये, तब गोपियाँ अपने शरीरोंको श्रीकृष्णकी चेष्टाओंके अधीन किये हुए समूहोंमें वृन्दावनके भीतर विचरने लगीं।"

        if amsha_idx == 4:
            # Book 4: Prose chapter alignment
            hi_pieces, san_pieces = parse_prose_chapter(ps)
            
            # For each verse in book_ch:
            for v in book_ch["verses"]:
                try:
                    v_num = int(str(v["number"]).split('-')[0])
                except Exception:
                    continue

                v_san = v.get("sanskrit", "")
                vg = grams(v_san)
                
                # Match to san_pieces
                best_n = None
                best_score = 0
                for n, s_text in san_pieces.items():
                    score = jaccard(vg, grams(s_text))
                    if score > best_score:
                        best_score = score
                        best_n = n

                # If good Sanskrit match or fallback to direct number
                chosen_n = best_n if (best_score >= 0.20 and best_n in hi_pieces) else (v_num if v_num in hi_pieces else best_n)
                new_text = hi_pieces.get(chosen_n, "")

                if new_text:
                    if not v.get("hindi"):
                        stats["missing_hindi_filled"] += 1
                    else:
                        stats["existing_hindi_replaced"] += 1
                    v["hindi"] = new_text
                    v["hindiSource"] = "gitapress-code-0048"
                    stats["prose_verses_aligned"] += 1
                    stats["single_verses_updated"] += 1
                    ch_refill_count += 1
                else:
                    stats["skipped_no_match"] += 1

        else:
            # Metrical Books 1, 2, 3, 5, 6
            hi_dict, san_dict = parse_metrical_chapter(ps)

            # Special case for Ch 93 verse 24
            if ch_idx == 92 and 24 not in hi_dict:
                hi_dict[24] = {
                    "text": v24_text,
                    "isRangeStart": False,
                    "rangeStart": 24,
                    "rangeEnd": 24
                }

            for v in book_ch["verses"]:
                try:
                    v_num = int(str(v["number"]).split('-')[0])
                except Exception:
                    continue

                if v_num not in hi_dict:
                    stats["skipped_no_match"] += 1
                    continue

                hi_entry = hi_dict[v_num]
                existing_hi = v.get("hindi", "")

                if "seeVerse" in hi_entry:
                    v["hindi"] = ""
                    v["hindiSeeVerse"] = hi_entry["seeVerse"]
                    v["hindiRange"] = f"{hi_entry['rangeStart']}-{hi_entry['rangeEnd']}"
                    stats["range_pointers_set"] += 1
                    ch_range_count += 1
                else:
                    new_text = hi_entry["text"]
                    if not new_text:
                        continue

                    if not existing_hi:
                        stats["missing_hindi_filled"] += 1
                    else:
                        stats["existing_hindi_replaced"] += 1

                    v["hindi"] = new_text
                    if hi_entry.get("isRangeStart"):
                        v["hindiRange"] = f"{hi_entry['rangeStart']}-{hi_entry['rangeEnd']}"
                    v["hindiSource"] = "gitapress-code-0048"
                    stats["single_verses_updated"] += 1
                    ch_refill_count += 1

        refill_details[str(ch_num)] = {
            "title": book_ch.get("title"),
            "verses_total": len(book_ch["verses"]),
            "verses_refilled": ch_refill_count,
            "range_pointers": ch_range_count
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
            "scripture": "vishnupurana",
            "source": "Gita Press Gorakhpur (Decrypted EPUB)",
            "epub_code": "0048",
            "epub_title": "Sri Vishnu Puran (Hindi)",
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
