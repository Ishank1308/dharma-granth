import zipfile, re, json

epub1 = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0026_Shrimad_Bhagavat_Mahapuran_Hindi_-_First_Part_with.epub'
epub2 = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0027_Shrimad_Bhagavat_Mahapuran_Hindi_–_Second_Part_wit.epub'

def clean_html(text):
    text = re.sub(r'<[^>]+>', '', text)
    text = text.replace('\xa0', ' ').replace('\u200d', '').replace('\u200c', '')
    return re.sub(r'\s+', ' ', text).strip()

def parse_html_verses(html_content):
    p_tags = re.findall(r'<p[^>]*>(.*?)</p>', html_content, re.DOTALL)
    cleaned = [clean_html(p) for p in p_tags if clean_html(p)]

    verses = []
    current_sanskrit_lines = []
    pending_numbers = []

    for p in cleaned:
        num_match = re.search(r'॥\s*([०-९]+)\s*$', p)
        if num_match:
            current_sanskrit_lines.append(p)
            v_num = num_match.group(1)
            pending_numbers.append(v_num)
        elif pending_numbers:
            # Check if this paragraph contains hindi markers or matches the translation pattern
            hi_text = p
            full_san = " ".join(current_sanskrit_lines)
            for v_num in pending_numbers:
                verses.append({
                    "number": v_num,
                    "sanskrit": full_san,
                    "hindi": hi_text
                })
            current_sanskrit_lines = []
            pending_numbers = []
        else:
            if not any(k in p for k in ['अध्याय', 'स्कन्ध', 'उवाच', '॥ ॐ', '॥ श्री']):
                current_sanskrit_lines.append(p)
            else:
                current_sanskrit_lines = []
    return verses

print("Testing parser on index_split_022.html:")
with zipfile.ZipFile(epub1, 'r') as z:
    html = z.read('index_split_022.html').decode('utf-8', errors='ignore')
    vs = parse_html_verses(html)
    print(f"Extracted {len(vs)} verses from Skandha 1 Chapter 1!")
    for v in vs[:5]:
        print(f"  v{v['number']}: SAN={v['sanskrit'][:50]}... | HI={v['hindi'][:60]}...")
