import zipfile, re

epub = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0038_Mahabharat–_Khilbhag_Shri_Harivansh_Puran___Langua.epub'

with zipfile.ZipFile(epub, 'r') as z:
    for name in z.namelist():
        if name.endswith('.html'):
            data = z.read(name).decode('utf-8', errors='ignore')
            for parva in ['हरिवंशपर्व', 'विष्णुपर्व', 'भविष्यपर्व']:
                if parva in data:
                    h = re.findall(r'<h[1-4][^>]*>(.*?)</h[1-4]>', data)
                    clean_h = [re.sub(r'<[^>]+>', '', x).strip() for x in h if x.strip()]
                    print(f"{name}: FOUND {parva} -> headings={clean_h[:3]}")
