import zipfile, re

epub = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0071_Taittiriya_Upanishad_–_Sanskrit_Text_with_Hindi_Tr.epub'

with zipfile.ZipFile(epub, 'r') as z:
    for name in z.namelist():
        if name.endswith('.html'):
            data = z.read(name).decode('utf-8', errors='ignore')
            m = re.findall(r'॥\s*[\d०-९]+\s*॥', data)
            h = re.findall(r'<h[1-4][^>]*>(.*?)</h[1-4]>', data)
            clean_h = [re.sub(r'<[^>]+>', '', x).strip() for x in h if x.strip()]
            print(f"{name}: len={len(data)}, danda markers={len(m)}, headings={clean_h[:3]}")
