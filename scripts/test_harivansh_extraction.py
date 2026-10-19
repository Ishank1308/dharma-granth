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
            full_san = re.sub(r'^(श्रीमद्भगवतमहापुराणम्|अथ [^\s]+ अध्याय:|[^\s]+ पर्व)\s*', '', full_san).strip()
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

# Let's inspect Harivamsha Parva (split 2, 3), Vishnu Parva (split 57, 58), Bhavishya Parva (split 185, 186)
with zipfile.ZipFile(epub, 'r') as z:
    for parva_idx, sample_files in [
        (1, ['index_split_002.html', 'index_split_003.html']),
        (2, ['index_split_056.html', 'index_split_057.html']),
        (3, ['index_split_184.html', 'index_split_185.html'])
    ]:
        all_vs = []
        for sf in sample_files:
            if sf in z.namelist():
                html = z.read(sf).decode('utf-8', errors='ignore')
                vs = parse_html_verses(html)
                all_vs.extend(vs)
        print(f"Parva {parva_idx}: extracted {len(all_vs)} verses from sample files")
        if all_vs:
            print(f"  Sample v1: SAN={all_vs[0]['sanskrit'][:50]} | HI={all_vs[0]['hindi'][:50]}")
