import zipfile, re, json

to_devanagari_num = lambda n: ''.join('०१२३४५६७८९'[int(d)] for d in str(n))
from_devanagari_num = lambda s: int(''.join(str('०१२३४५६७८९'.index(c)) for c in s if c in '०१२३४५६७८९'))

epub_path = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0136_Vidur_Niti_(Hindi).epub'

with zipfile.ZipFile(epub_path, 'r') as z:
    all_text = ""
    for i in range(3, 10):
        name = f'index_split_{i:03d}.html'
        data = z.read(name).decode('utf-8', errors='ignore')
        all_text += f"\n<!-- NEW_SPLIT_{i} -->\n" + data

# Replace chapter headings with clean markers
chapter_names = [
    'पहला अध्याय', 'दूसरा अध्याय', 'तीसरा अध्याय', 'चौथा अध्याय',
    'पाँचवाँ अध्याय', 'छठा अध्याय', 'सातवाँ अध्याय', 'आठवाँ अध्याय'
]

# Split text by chapter headings
# Let's find positions
sections = []
pos_list = []
for idx, ch_name in enumerate(chapter_names):
    pos = all_text.find(ch_name)
    pos_list.append((pos, idx + 1, ch_name))

pos_list.sort()

chapters_data = []
for i in range(len(pos_list)):
    start_pos = pos_list[i][0]
    end_pos = pos_list[i+1][0] if i + 1 < len(pos_list) else len(all_text)
    ch_num = pos_list[i][1]
    ch_text = all_text[start_pos:end_pos]
    
    p_tags = re.findall(r'<p[^>]*>(.*?)</p>', ch_text, re.DOTALL)
    clean_p = [re.sub(r'<[^>]+>', '', p).strip() for p in p_tags if re.sub(r'<[^>]+>', '', p).strip()]
    
    # Parse verses
    verses = []
    curr_skt = []
    
    for p in clean_p:
        # Check if danda with number
        m = re.search(r'॥\s*([०-९\d]+)\s*॥', p)
        if m:
            curr_skt.append(p)
            v_num = from_devanagari_num(m.group(1)) if any(c in '०१२३४५६७८९' for c in m.group(1)) else int(m.group(1))
            full_skt = ' '.join(curr_skt)
            verses.append({
                'id': v_num,
                'sanskrit': full_skt
            })
            curr_skt = []
        elif any(w in p for w in ['कहते हैं', 'बोले', 'कहा', 'अर्थात्', 'चाहिये', 'होता है', 'होते हैं', 'नहीं']) and len(verses) > 0 and 'hindi' not in verses[-1]:
            verses[-1]['hindi'] = p
        elif not re.search(r'॥', p) and len(p) < 200:
            curr_skt.append(p)
            
    # Filter duplicate verse numbers if any (take first with translation)
    unique_verses = []
    seen = set()
    for v in verses:
        if v['id'] not in seen:
            seen.add(v['id'])
            unique_verses.append(v)
            
    print(f'Chapter {ch_num} ({chapter_names[ch_num-1]}): {len(unique_verses)} verses')
    chapters_data.append({
        'chapter': ch_num,
        'title': chapter_names[ch_num-1],
        'verses': unique_verses
    })

with open('scripts/viduraniti_extracted.json', 'w', encoding='utf-8') as f:
    json.dump(chapters_data, f, ensure_ascii=False, indent=2)

print('Saved to scripts/viduraniti_extracted.json')
