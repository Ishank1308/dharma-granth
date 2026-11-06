import zipfile
import re
import json
import os

epub_path = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0038_Mahabharat–_Khilbhag_Shri_Harivansh_Puran___Langua.epub'

if not os.path.exists(epub_path):
    print("EPUB not found:", epub_path)
    exit(1)

devanagari_to_ascii = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
}

def to_int(devanagari_str):
    ascii_str = ''.join(devanagari_to_ascii.get(c, c) for c in devanagari_str if c in devanagari_to_ascii or c.isdigit())
    return int(ascii_str) if ascii_str else None

def clean_text(html):
    # remove tags
    t = re.sub(r'<[^>]+>', ' ', html)
    t = t.replace('\xa0', ' ').replace('\u200d', '').replace('\u200c', '')
    return re.sub(r'\s+', ' ', t).strip()

def parse_html_chapter(html):
    # Split by <p> tags
    p_tags = re.findall(r'<p[^>]*>(.*?)</p>', html, re.DOTALL)
    cleaned_ps = [clean_text(p) for p in p_tags if clean_text(p)]
    
    adhyaya_num = None
    adhyaya_title = ""
    
    # Check for title
    h2_match = re.search(r'<h2[^>]*>(.*?)</h2>', html, re.DOTALL)
    if h2_match:
        adhyaya_title = clean_text(h2_match.group(1))

    verses = []
    current_sanskrit_lines = []
    pending_numbers = []

    for p in cleaned_ps:
        # Check if adhyaya heading
        if 'अध्याय:' in p and not adhyaya_num:
            adh_match = re.search(r'([०-९]+)\s*अध्याय', p)
            if adh_match:
                adhyaya_num = to_int(adh_match.group(1))
            continue
            
        # Match shloka end: ॥ <number> (without trailing ॥)
        # e.g., '...॥ १' or '...॥ १२'
        num_m = re.search(r'॥\s*([०-९]+)\s*$', p)
        if num_m:
            current_sanskrit_lines.append(p)
            pending_numbers.append(to_int(num_m.group(1)))
            continue
            
        # Match translation end: ॥ <number>॥ or ॥ <num1>—<num2>॥ or ॥ <num1>-<num2>॥
        trans_m = re.search(r'॥\s*([०-९]+)(?:[—\-]([०-९]+))?\s*॥', p)
        if trans_m:
            start_num = to_int(trans_m.group(1))
            end_num = to_int(trans_m.group(2)) if trans_m.group(2) else start_num
            
            san_joined = " ".join(current_sanskrit_lines).strip()
            # Clean leading prefixes from Sanskrit
            san_joined = re.sub(r'^(ॐ\s*|श्रीपरमात्मने नम:\s*|श्रीमहाभारतम्\s*|तस्य खिलभागो हरिवंश:\s*|[^\s]+ऽध्याय:\s*)+', '', san_joined).strip()
            
            verses.append({
                'startVerse': start_num,
                'endVerse': end_num,
                'isRange': (start_num != end_num),
                'sanskrit': san_joined,
                'hindi': p
            })
            current_sanskrit_lines = []
            pending_numbers = []
            continue

    return adhyaya_num, adhyaya_title, verses

with zipfile.ZipFile(epub_path, 'r') as z:
    html_files = sorted([f for f in z.namelist() if f.endswith('.html')])
    
    extracted_chapters = []
    total_verses = 0
    
    for f in html_files:
        html = z.read(f).decode('utf-8', errors='ignore')
        if '॥' not in html:
            continue
            
        adh_num, title, verses = parse_html_chapter(html)
        if verses:
            total_verses += len(verses)
            extracted_chapters.append({
                'file': f,
                'adhyaya': adh_num,
                'title': title,
                'verseCount': len(verses),
                'verses': verses
            })

    print(f"Extracted {len(extracted_chapters)} chapters with {total_verses} total verse units.")
    out_file = 'data/sources-local/harivansh_clean_gitapress.json'
    with open(out_file, 'w', encoding='utf-8') as out:
        json.dump(extracted_chapters, out, ensure_ascii=False, indent=2)
    print(f"Saved clean Gita Press text to {out_file}")
