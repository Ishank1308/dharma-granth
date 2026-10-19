import zipfile, re

epub_path = r'data\sources-local\gitapress_decrypted_epubs\gitapress_0385_Narada_Bhakti_Sutra_(Hindi).epub'
with zipfile.ZipFile(epub_path, 'r') as z:
    content = z.read('index_split_001.html').decode('utf-8', errors='ignore')
    paragraphs = re.findall(r'<p[^>]*>(.*?)</p>', content, re.DOTALL)
    for p in paragraphs:
        clean = re.sub(r'<[^>]+>', '', p).strip()
        if not re.search(r'॥\s*\d+\s*॥', clean) and not re.search(r'^\d+[-\.]', clean) and len(clean) < 80 and clean:
            print(f'HEADING: {clean}')
