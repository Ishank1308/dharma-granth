import zipfile, re, json

epub_path = r'data/sources-local/test_decrypted_vivek_chudamani.epub'
with zipfile.ZipFile(epub_path, 'r') as z:
    all_html = ''
    for n in sorted(z.namelist()):
        if n.startswith('index_split_') and n.endswith('.html'):
            idx = int(n.split('_')[2].split('.')[0])
            if idx >= 4:
                all_html += z.read(n).decode('utf-8', errors='ignore') + '\n'

p_tags = re.findall(r'<p[^>]*>(.*?)</p>', all_html, re.DOTALL)
clean_p = [re.sub(r'<[^>]+>', '', p).strip() for p in p_tags if re.sub(r'<[^>]+>', '', p).strip()]

verses = []
curr_skt = []
headings = []

for p in clean_p:
    # Check if section heading
    if len(p) < 40 and not any(char in p for char in ['॥', '।', '—', ':']) and not re.search(r'\d+', p):
        headings.append(p)
        continue

    if '॥' in p and re.search(r'॥\s*\d+\s*॥', p):
        curr_skt.append(p)
        full_skt = ' '.join(curr_skt)
        # Clean header artifacts like 'विवेक-चूडामणि' from the start
        full_skt = re.sub(r'^विवेक[- ]चूडामणि\s*', '', full_skt).strip()
        m = re.search(r'॥\s*(\d+)\s*॥', p)
        vnum = int(m.group(1)) if m else len(verses) + 1
        heading = headings[-1] if headings else ''
        verses.append({
            'id': vnum,
            'sanskrit': full_skt,
            'section': heading
        })
        curr_skt = []
    elif any(char in p for char in ['—', '।', ':', 'है', 'होता', 'हैं', 'करे', 'जाता']) and len(verses) > 0 and 'hindi' not in verses[-1]:
        verses[-1]['hindi'] = p
    elif not ('॥' in p):
        curr_skt.append(p)

with open('scripts/vivekchudamani_extracted.json', 'w', encoding='utf-8') as f:
    json.dump(verses, f, ensure_ascii=False, indent=2)

print(f'Successfully extracted {len(verses)} verses to scripts/vivekchudamani_extracted.json')
