import zipfile, re

epub1 = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0026_Shrimad_Bhagavat_Mahapuran_Hindi_-_First_Part_with.epub'
epub2 = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0027_Shrimad_Bhagavat_Mahapuran_Hindi_–_Second_Part_wit.epub'

def map_skandha_files(epub_path, label):
    print(f"\n================== {label} ==================")
    with zipfile.ZipFile(epub_path, 'r') as z:
        for name in z.namelist():
            if not name.endswith('.html'):
                continue
            data = z.read(name).decode('utf-8', errors='ignore')
            # Look for major Skandha headings like 'प्रथम: स्कन्ध:', 'द्वितीय: स्कन्ध:', etc.
            sk_match = re.search(r'(प्रथम|द्वितीय|तृतीय|चतुर्थ|पञ्चम|षष्ठ|सप्तम|अष्टम|नवम|दशम|एकादश|द्वादश)\s*:\s*स्कन्ध', data)
            if sk_match:
                print(f"FOUND SKANDHA: {sk_match.group(0)} in {name}")
                # print first few lines of text
                text = re.sub(r'<[^>]+>', ' ', data)
                lines = [l.strip() for l in text.split('\n') if l.strip()]
                for l in lines[:5]:
                    print("   ", l[:80])

map_skandha_files(epub1, "PART 1")
map_skandha_files(epub2, "PART 2")
