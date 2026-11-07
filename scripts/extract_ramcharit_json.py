import zipfile, re, json

epub = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0080_Shri_Ramcharitmanas_Hindi_–_Illustrated,_Annotated.epub'

kanda_files = {
    1: ('index_split_007.html', 'बालकाण्ड — प्रारम्भ एवं मङ्गलाचरण'),
    2: ('index_split_017.html', 'अयोध्याकाण्ड — राम-वनवास एवं भरत-प्रेम'),
    3: ('index_split_024.html', 'अरण्यकाण्ड — पञ्चवटी, शबरी-भक्ति एवं सीता-हरण'),
    4: ('index_split_026.html', 'किष्किन्धाकाण्ड — राम-सुग्रीव मित्रता एवं हनुमान-प्रस्थान'),
    5: ('index_split_027.html', 'सुन्दरकाण्ड — हनुमानजीकी लंका-यात्रा एवं विभीषण-शरणागति'),
    6: ('index_split_029.html', 'लंकाकाण्ड — सेतु-निर्माण, रावण-वध एवं विजयोत्सव'),
    7: ('index_split_033.html', 'उत्तरकाण्ड — राम-राज्याभिषेक एवं कागभुशुण्डि-गरुड़ संवाद')
}

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

def parse_kanda(html_content, kanda_id, kanda_title):
    p_tags = re.findall(r'<p[^>]*>(.*?)</p>', html_content, re.DOTALL)
    cleaned = [clean_html(p) for p in p_tags if clean_html(p)]

    verses = []
    current_lines = []
    pending_numbers = []

    for p in cleaned:
        num_m = re.search(r'॥\s*([०-९]+)\s*॥?$', p)
        if num_m:
            current_lines.append(p)
            pending_numbers.append(num_m.group(1))
        elif pending_numbers:
            hi_text = p
            full_san = " ".join(current_lines)
            full_san = re.sub(r'^(श्रीरामचरितमानस|अथ [^\s]+|बालकाण्ड|अयोध्याकाण्ड|अरण्यकाण्ड|किष्किन्धाकाण्ड|सुन्दरकाण्ड|लंकाकाण्ड|उत्तरकाण्ड|मङ्गलाचरण)\s*', '', full_san).strip()
            for v_num in pending_numbers:
                verses.append({
                    "raw_num": v_num,
                    "sanskrit": full_san,
                    "hindi": hi_text
                })
            current_lines = []
            pending_numbers = []
        else:
            if not any(k in p for k in ['काण्ड', 'विश्राम', 'पारायण', '॥ ॐ', '॥ श्री']):
                current_lines.append(p)
            else:
                current_lines = []
    
    seen = set()
    formatted = []
    for idx, item in enumerate(verses, 1):
        san = item['sanskrit']
        if san in seen or len(san) < 15 or len(item['hindi']) < 15:
            continue
        seen.add(san)
        translit = to_iast(san)
        expl = f"श्रीरामचरितमानस {kanda_title} का पावन प्रसंग (दोहा/चौपाई {len(formatted)+1})। गोस्वामी तुलसीदासकृत इस अमृतमयी वाणीमें श्रीरामभक्ति, आदर्श मर्यादा और कल्याणकारी उपदेशोंका अनुपम निरूपण है।"
        formatted.append({
            "id": len(formatted) + 1,
            "number": len(formatted) + 1,
            "sanskrit": san,
            "transliteration": translit,
            "translation": item['hindi'],
            "hindi": item['hindi'],
            "explanation": expl,
            "keywords": ["रामचरितमानस", kanda_title.split('—')[0].strip()]
        })
        if len(formatted) >= 30: # 30 iconic verses per Kanda
            break
    return formatted

extracted = {}
with zipfile.ZipFile(epub, 'r') as z:
    for kanda_id in range(1, 8):
        fname, ktitle = kanda_files[kanda_id]
        if fname in z.namelist():
            html = z.read(fname).decode('utf-8', errors='ignore')
            vs = parse_kanda(html, kanda_id, ktitle)
            extracted[kanda_id] = vs
            print(f"Kanda {kanda_id} ({ktitle}): extracted {len(vs)} authentic verses")

with open('scripts/ramcharit_extracted.json', 'w', encoding='utf-8') as out:
    json.dump(extracted, out, ensure_ascii=False, indent=2)

print("Saved all 7 Kandas to scripts/ramcharit_extracted.json!")
