import zipfile, re

epub = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0080_Shri_Ramcharitmanas_Hindi_–_Illustrated,_Annotated.epub'

with zipfile.ZipFile(epub, 'r') as z:
    names = z.namelist()
    htmls = [n for n in names if n.endswith('.html')]
    print(f"Total HTML files in Ramcharitmanas: {len(htmls)}")
    for name in htmls[:12]:
        data = z.read(name).decode('utf-8', errors='ignore')
        m = re.findall(r'॥\s*[\d०-९]+\s*॥', data)
        h = re.findall(r'<h[1-4][^>]*>(.*?)</h[1-4]>', data)
        clean_h = [re.sub(r'<[^>]+>', '', x).strip() for x in h if x.strip()]
        print(f"  {name}: len={len(data)}, danda markers={len(m)}, headings={clean_h[:2]}")
