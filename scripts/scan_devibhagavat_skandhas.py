import zipfile, re

epub1 = r'data/sources-local/gitapress_decrypted_epubs/gitapress_1897_Śrīmad_Devī-Bhāgavat_Mahāpurāṇ_–_Volume_I_(Hindi,_.epub'
epub2 = r'data/sources-local/gitapress_decrypted_epubs/gitapress_1898_Srimad_Devi-Bhagavat_Mahapuraṇ_–_Volume_II_(Hindi,.epub'

def scan_skandhas(epub_path, label):
    print(f"\n=== {label} ===")
    with zipfile.ZipFile(epub_path, 'r') as z:
        for name in z.namelist():
            if not name.endswith('.html'):
                continue
            data = z.read(name).decode('utf-8', errors='ignore')
            matches = re.findall(r'(?:प्रथम|द्वितीय|तृतीय|चतुर्थ|पञ्चम|षष्ठ|सप्तम|अष्टम|नवम|दशम|एकादश|द्वादश)\s*:\s*स्कन्ध', data)
            if matches:
                h = re.findall(r'<h[1-4][^>]*>(.*?)</h[1-4]>', data)
                clean_h = [re.sub(r'<[^>]+>', '', x).strip() for x in h if x.strip()]
                print(f"  {name}: {set(matches)} | headings={clean_h[:2]}")

scan_skandhas(epub1, "VOL 1")
scan_skandhas(epub2, "VOL 2")
