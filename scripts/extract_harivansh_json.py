import zipfile, re, json

epub = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0038_Mahabharat–_Khilbhag_Shri_Harivansh_Puran___Langua.epub'

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
            full_san = re.sub(r'^(ॐ श्रीपरमात्मने नम:|श्रीमहाभारतम्|तस्य खिलभागो हरिवंश:|हरिवंशपर्व|विष्णुपर्व|भविष्यपर्व|अथ [^\s]+ अध्याय:)\s*', '', full_san).strip()
            for v_num in pending_numbers:
                verses.append({
                    "raw_num": v_num,
                    "sanskrit": full_san,
                    "hindi": hi_text
                })
            current_lines = []
            pending_numbers = []
        else:
            if not any(k in p for k in ['अध्याय', 'पर्व', 'उवाच', '॥ ॐ', '॥ श्री']):
                current_lines.append(p)
            else:
                current_lines = []
    return verses

parva_files = {
    1: [f'index_split_{str(i).zfill(3)}.html' for i in range(2, 10)],
    2: [f'index_split_{str(i).zfill(3)}.html' for i in range(56, 64)],
    3: [f'index_split_{str(i).zfill(3)}.html' for i in range(184, 192)]
}

parva_titles = {
    1: "हरिवंशपर्व (आदिसृष्टि, स्वायम्भुव मनु एवं वृष्णिवंश वर्णन)",
    2: "विष्णुपर्व (गोकुल-वृन्दावन लीला एवं श्रीकृष्ण-चरित्र)",
    3: "भविष्यपर्व (पौराणिक भविष्यवाणी एवं हरिवंश-माहात्म्य)"
}

extracted = {}
with zipfile.ZipFile(epub, 'r') as z:
    for parva_id in [1, 2, 3]:
        files = parva_files[parva_id]
        vs = []
        for f in files:
            if f in z.namelist():
                html = z.read(f).decode('utf-8', errors='ignore')
                vs.extend(parse_html_verses(html))
        
        seen = set()
        formatted = []
        for idx, item in enumerate(vs, 1):
            san = item['sanskrit']
            if san in seen or len(san) < 15 or len(item['hindi']) < 15:
                continue
            seen.add(san)
            translit = to_iast(san)
            expl = f"हरिवंशपुराण {parva_titles[parva_id]} का श्लोक {len(formatted)+1}। महर्षि वेदव्यासकृत इस पावन खिलभाग में भगवान् श्रीहरिके वंश, अवतार एवं दिव्य लीलाओंका विशद निरूपण है।"
            formatted.append({
                "id": len(formatted) + 1,
                "number": len(formatted) + 1,
                "sanskrit": san,
                "transliteration": translit,
                "translation": item['hindi'],
                "hindi": item['hindi'],
                "explanation": expl,
                "keywords": ["हरिवंश", f"पर्व {parva_id}"]
            })
            if len(formatted) >= 35:
                break
        extracted[parva_id] = formatted
        print(f"Parva {parva_id}: {len(formatted)} authentic verses extracted")

with open('scripts/harivansh_extracted.json', 'w', encoding='utf-8') as out:
    json.dump(extracted, out, ensure_ascii=False, indent=2)

print("Saved to scripts/harivansh_extracted.json!")
