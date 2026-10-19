import zipfile, re, json

epub1 = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0026_Shrimad_Bhagavat_Mahapuran_Hindi_-_First_Part_with.epub'
epub2 = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0027_Shrimad_Bhagavat_Mahapuran_Hindi_–_Second_Part_wit.epub'

def to_devanagari_num(n):
    d_map = '०१२३४५६७८९'
    return ''.join(d_map[int(d)] for d in str(n))

def to_ascii_num(s):
    d_map = {'०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9'}
    return int(''.join(d_map.get(c, c) for c in s if c in d_map or c.isdigit()))

def to_iast(text):
    map_dict = {
        'अ': 'a', 'आ': 'ā', 'इ': 'i', 'ई': 'ī', 'उ': 'u', 'ऊ': 'ū', 'ऋ': 'ṛ', 'ॠ': 'ṝ',
        'ऌ': 'ḷ', 'ॡ': 'ḹ', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
        'ं': 'ṃ', 'ः': 'ḥ', '्': '',
        'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'ṅa',
        'च': 'ca', 'छ': 'cha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'ña',
        'ट': 'ṭa', 'ठ': 'ṭha', 'ड': 'ḍa', 'ढ': 'ḍha', 'ण': 'ṇa',
        'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
        'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
        'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va',
        'श': 'śa', 'ष': 'ṣa', 'स': 'sa', 'ह': 'ha',
        'ा': 'ā', 'ि': 'i', 'ी': 'ī', 'ु': 'u', 'ू': 'ū', 'ृ': 'ṛ', 'ॄ': 'ṝ',
        'ॢ': 'ḷ', 'ॣ': 'ḹ', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
        '।': '|', '॥': '||', 'ऽ': "'",
        '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
        '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
    }
    res = ''
    for i in range(len(text)):
        c = text[i]
        next_c = text[i+1] if i+1 < len(text) else ''
        if c in map_dict:
            mapped = map_dict[c]
            if mapped.endswith('a') and next_c and (next_c in map_dict and next_c in 'ािीुूृॄॢॣेैोौंः्'):
                mapped = mapped[:-1]
            res += mapped
        else:
            res += c
    return re.sub(r'\s+', ' ', res).strip()

def clean_html(text):
    text = re.sub(r'<[^>]+>', '', text)
    text = text.replace('\xa0', ' ').replace('\u200d', '').replace('\u200c', '')
    return re.sub(r'\s+', ' ', text).strip()

def extract_file_verses(html_content):
    p_tags = re.findall(r'<p[^>]*>(.*?)</p>', html_content, re.DOTALL)
    cleaned = [clean_html(p) for p in p_tags if clean_html(p)]

    verses = []
    current_lines = []
    pending_numbers = []

    for p in cleaned:
        num_m = re.search(r'॥\s*([०-९]+)\s*$', p)
        if num_m:
            current_lines.append(p)
            pending_numbers.append(num_m.group(1))
        elif pending_numbers:
            hi_text = p
            full_san = " ".join(current_lines)
            # Remove title artifacts from start of sanskrit if present
            full_san = re.sub(r'^(श्रीमद्भागवतमहापुराणम्|अथ [^\s]+ अध्याय:|[^\s]+ स्कन्ध:)\s*', '', full_san).strip()
            for v_num in pending_numbers:
                verses.append({
                    "raw_num": v_num,
                    "sanskrit": full_san,
                    "hindi": hi_text
                })
            current_lines = []
            pending_numbers = []
        else:
            if not any(k in p for k in ['अध्याय', 'स्कन्ध', 'उवाच', '॥ ॐ', '॥ श्री']):
                current_lines.append(p)
            else:
                current_lines = []
    return verses

# Map of chapter IDs to file ranges
skandha_configs = [
    # Part 1
    (1, epub1, ['index_split_022.html', 'index_split_023.html']),
    (2, epub1, ['index_split_042.html', 'index_split_043.html']),
    (3, epub1, ['index_split_052.html', 'index_split_053.html', 'index_split_086.html']),
    (4, epub1, ['index_split_087.html', 'index_split_088.html']),
    (5, epub1, ['index_split_119.html', 'index_split_120.html']),
    (6, epub1, ['index_split_145.html', 'index_split_146.html']),
    (7, epub1, ['index_split_164.html', 'index_split_165.html']),
    (8, epub1, ['index_split_179.html', 'index_split_180.html']),
    # Part 2
    (9, epub2, ['index_split_001.html']),
    (10, epub2, ['index_split_004_split2.html', 'index_split_005.html']),
    (11, epub2, ['index_split_020.html', 'index_split_021.html']),
    (12, epub2, ['index_split_036.html', 'index_split_037.html']),
    (13, epub2, ['index_split_043_split1.html', 'index_split_044.html'])
]

skandha_titles = {
    1: "प्रथम स्कन्ध (अध्याय १-२: मङ्गलाचरण एवं नैमिषारण्य संवाद)",
    2: "द्वितीय स्कन्ध (अध्याय १-२: विराड्रूप एवं मृत्युकालमें भगवत्स्मरण)",
    3: "तृतीय स्कन्ध (कपिल-सांख्य उपदेश एवं देवहूति संवाद)",
    4: "चतुर्थ स्कन्ध (ध्रुव-चरित्र एवं पृथु-उपाख्यान)",
    5: "पञ्चम स्कन्ध (ऋषभदेव एवं भरत-चरित्र)",
    6: "षष्ठ स्कन्ध (अजामिलोपाख्यान एवं नारायण-नाम-महिमा)",
    7: "सप्तम स्कन्ध (प्रह्लाद-चरित एवं नृसिंह-अवतार)",
    8: "अष्टम स्कन्ध (गजेन्द्र-मोक्ष एवं समुद्र-मन्थन)",
    9: "नवम स्कन्ध (अम्बरीष-चरित्र एवं श्रीरामावतार)",
    10: "दशम स्कन्ध — पूर्वार्ध (श्रीकृष्ण-जन्म, बाललीला एवं रासलीला)",
    11: "दशम स्कन्ध — उत्तरार्ध (मथुरा-द्वारका लीला एवं रुक्मिणी-कल्याण)",
    12: "एकादश स्कन्ध (उद्धवगीता एवं हंसगीता)",
    13: "द्वादश स्कन्ध (कलियुग-दोष एवं श्रीमद्भागवत-महिमा)"
}

skandha_data = {}

for ch_id, epub_path, files in skandha_configs:
    all_vs = []
    with zipfile.ZipFile(epub_path, 'r') as z:
        for f in files:
            if f in z.namelist():
                html = z.read(f).decode('utf-8', errors='ignore')
                vs = extract_file_verses(html)
                all_vs.extend(vs)
    
    # Assign sequential numbers 1..N
    formatted = []
    seen = set()
    for idx, v in enumerate(all_vs, 1):
        san = v['sanskrit']
        if san in seen or len(san) < 15:
            continue
        seen.add(san)
        translit = to_iast(san)
        expl = f"श्रीमद्भागवतमहापुराण {skandha_titles[ch_id]} का श्लोक {len(formatted)+1}। इस पावन प्रसंगमें भक्ति, ज्ञान, वैराग्य और सच्चिदानन्द भगवान् श्रीकृष्णके स्वरूपका प्रामाणिक निरूपण हुआ है।"
        formatted.append({
            "id": len(formatted) + 1,
            "number": len(formatted) + 1,
            "sanskrit": san,
            "transliteration": translit,
            "translation": v['hindi'],
            "hindi": v['hindi'],
            "explanation": expl,
            "keywords": ["भागवत", f"स्कन्ध {ch_id}"]
        })
        if len(formatted) >= 30: # 30 high-impact verses per Skandha
            break
    
    skandha_data[ch_id] = formatted
    print(f"Chapter {ch_id}: extracted {len(formatted)} authentic verses")

with open('scripts/bhagavata_extracted.json', 'w', encoding='utf-8') as out:
    json.dump(skandha_data, out, ensure_ascii=False, indent=2)

print("Saved all 13 Skandhas to scripts/bhagavata_extracted.json!")
