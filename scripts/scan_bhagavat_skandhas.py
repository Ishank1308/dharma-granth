import zipfile, re

epub1 = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0026_Shrimad_Bhagavat_Mahapuran_Hindi_-_First_Part_with.epub'
epub2 = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0027_Shrimad_Bhagavat_Mahapuran_Hindi_–_Second_Part_wit.epub'

def scan_skandhas(epub_path, label):
    print(f"\n=== SCANNING {label} ===")
    with zipfile.ZipFile(epub_path, 'r') as z:
        for name in z.namelist():
            if not name.endswith('.html'):
                continue
            data = z.read(name).decode('utf-8', errors='ignore')
            # Look for skandha headers
            matches = re.findall(r'(?:प्रथम|द्वितीय|तृतीय|चतुर्थ|पञ्चम|षष्ठ|सप्तम|अष्टम|नवम|दशम|एकादश|द्वादश)\s*स्कन्ध', data)
            if matches:
                # also check for chapter 1 of that skandha
                title_match = re.search(r'<title>([^<]+)</title>', data)
                h_match = re.findall(r'<h[1-4][^>]*>(.*?)</h[1-4]>', data, re.DOTALL)
                clean_h = [re.sub(r'<[^>]+>', '', h).strip() for h in h_match if h.strip()]
                print(f"{name}: matches={set(matches)}, headings={clean_h[:3]}")

scan_skandhas(epub1, "PART 1")
scan_skandhas(epub2, "PART 2")
