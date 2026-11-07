import zipfile, re, json

epub1 = r'data/sources-local/gitapress_decrypted_epubs/gitapress_1897_Śrīmad_Devī-Bhāgavat_Mahāpurāṇ_–_Volume_I_(Hindi,_.epub'
epub2 = r'data/sources-local/gitapress_decrypted_epubs/gitapress_1898_Srimad_Devi-Bhagavat_Mahapuraṇ_–_Volume_II_(Hindi,.epub'

def clean_html(text):
    text = re.sub(r'<[^>]+>', '', text)
    text = text.replace('\xa0', ' ').replace('\u200d', '').replace('\u200c', '')
    return re.sub(r'\s+', ' ', text).strip()

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

def parse_html_verses(html_content):
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
            full_san = re.sub(r'^(श्रीमद्देवीभागवतमहापुराण|प्रथम: स्कन्ध:|द्वितीय: स्कन्ध:|तृतीय: स्कन्ध:|चतुर्थ: स्कन्ध:|पञ्चम: स्कन्ध:|षष्ठ: स्कन्ध:|सप्तम: स्कन्ध:|अष्टम: स्कन्ध:|नवम: स्कन्ध:|दशम: स्कन्ध:|एकादश: स्कन्ध:|द्वादश: स्कन्ध:|अथ [^\s]+ अध्याय:)\s*', '', full_san).strip()
            for v_num in pending_numbers:
                verses.append({
                    "raw_num": v_num,
                    "sanskrit": full_san,
                    "hindi": hi_text
                })
            current_lines = []
            pending_numbers = []
        else:
            if not any(k in p for k in ['अध्याय', 'स्कन्ध', 'उवाच', '॥ ॐ', '॥ श्री', 'महर्षि']):
                current_lines.append(p)
            else:
                current_lines = []
    return verses

skandha_configs = [
    # Vol 1
    (1, epub1, ['index_split_029.html', 'index_split_030.html']),
    (2, epub1, ['index_split_047.html', 'index_split_048.html']),
    (3, epub1, ['index_split_058_split1.html', 'index_split_059.html']),
    (4, epub1, ['index_split_088.html', 'index_split_089.html']),
    (5, epub1, ['index_split_111.html', 'index_split_112.html']),
    (6, epub1, ['index_split_145.html', 'index_split_146.html']),
    # Vol 2
    (7, epub2, ['index_split_001.html', 'index_split_002.html']),
    (8, epub2, ['index_split_011.html', 'index_split_012.html']),
    (9, epub2, ['index_split_014.html', 'index_split_015.html']),
    (10, epub2, ['index_split_027.html', 'index_split_028.html']),
    (11, epub2, ['index_split_030.html', 'index_split_031.html']),
    (12, epub2, ['index_split_036.html', 'index_split_037.html', 'index_split_040.html'])
]

skandha_titles = {
    1: "प्रथम स्कन्ध (मङ्गलाचरण एवं देवी-महिमा)",
    2: "द्वितीय स्कन्ध (व्यास-जन्म एवं पाण्डव-चरित्र)",
    3: "तृतीय स्कन्ध (ब्रह्मा-विष्णु-महेश द्वारा देवी-स्तवन)",
    4: "चतुर्थ स्कन्ध (श्रीकृष्ण-अवतार एवं भगवती-माहात्म्य)",
    5: "पञ्चम स्कन्ध (महिषासुर-मर्दिनी एवं शुम्भ-निशुम्भ वध)",
    6: "षष्ठ स्कन्ध (वृत्रासुर-वध एवं त्रिपुर-सुन्दरी आख्यान)",
    7: "सप्तम स्कन्ध (देवीगीता एवं तत्त्वज्ञान उपदेश)",
    8: "अष्टम स्कन्ध (भुवनकोश एवं देवीकी विविध उपासना)",
    9: "नवम स्कन्ध (प्रकृतिखण्ड — महालक्ष्मी, सरस्वती, राधा एवं दुर्गा-चरित)",
    10: "दशम स्कन्ध (स्वायम्भुव मनु एवं विन्ध्यवासिनी-चरित)",
    11: "एकादश स्कन्ध (सदाचार, भस्मधारण एवं रुद्राक्ष-महिमा)",
    12: "द्वादश स्कन्ध (गायत्री-रहस्य, मणिद्वीप-वर्णन एवं देवी-माहात्म्य)"
}

extracted = {}
for ch_id, epub_path, files in skandha_configs:
    all_vs = []
    with zipfile.ZipFile(epub_path, 'r') as z:
        for f in files:
            if f in z.namelist():
                html = z.read(f).decode('utf-8', errors='ignore')
                all_vs.extend(parse_html_verses(html))
    
    seen = set()
    formatted = []
    for item in all_vs:
        san = item['sanskrit']
        if san in seen or len(san) < 15 or len(item['hindi']) < 15:
            continue
        seen.add(san)
        translit = to_iast(san)
        expl = f"श्रीमद्देवीभागवतमहापुराण {skandha_titles[ch_id]} का श्लोक {len(formatted)+1}। शाक्तपरम्पराके इस परम ग्रन्थमें परात्पर भगवती जगदम्बाकी शक्ति, सृष्टि-स्थिति-संहार तथा मुक्तिप्रद स्वरूपका प्रामाणिक वर्णन है।"
        formatted.append({
            "id": len(formatted) + 1,
            "number": len(formatted) + 1,
            "sanskrit": san,
            "transliteration": translit,
            "translation": item['hindi'],
            "hindi": item['hindi'],
            "explanation": expl,
            "keywords": ["देवीभागवत", f"स्कन्ध {ch_id}"]
        })
        if len(formatted) >= 25: # 25 verses per Skandha
            break
    extracted[ch_id] = formatted
    print(f"Skandha {ch_id} ({skandha_titles[ch_id].split('—')[0]}): {len(formatted)} authentic verses")

with open('scripts/devibhagavat_extracted.json', 'w', encoding='utf-8') as out:
    json.dump(extracted, out, ensure_ascii=False, indent=2)

print("Saved all 12 Skandhas to scripts/devibhagavat_extracted.json!")
