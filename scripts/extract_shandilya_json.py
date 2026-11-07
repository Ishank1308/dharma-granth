import zipfile, re, json

epub_path = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0385_Narada_Bhakti_Sutra_(Hindi).epub'
with zipfile.ZipFile(epub_path, 'r') as z:
    content = z.read('index_split_002.html').decode('utf-8', errors='ignore')
    p_tags = re.findall(r'<p[^>]*>(.*?)</p>', content, re.DOTALL)
    clean_p = [re.sub(r'<[^>]+>', '', p).strip() for p in p_tags if re.sub(r'<[^>]+>', '', p).strip()]
    
    sutras = []
    for i in range(len(clean_p)):
        m = re.search(r'॥\s*(\d+)\s*॥', clean_p[i])
        if m:
            num = int(m.group(1))
            skt = clean_p[i]
            trans = clean_p[i+1] if i+1 < len(clean_p) else ''
            trans = re.sub(r'^\d+[-\.]\s*', '', trans)
            sutras.append({ 'id': num, 'sanskrit': skt, 'hindi': trans })

with open('scripts/shandilya_sutras.json', 'w', encoding='utf-8') as f:
    json.dump(sutras, f, ensure_ascii=False, indent=2)

print(f'Successfully exported {len(sutras)} sutras to scripts/shandilya_sutras.json')
