import zipfile, re

epub1 = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0026_Shrimad_Bhagavat_Mahapuran_Hindi_-_First_Part_with.epub'

with zipfile.ZipFile(epub1, 'r') as z:
    for h in ['index_split_002.html', 'index_split_003.html', 'index_split_007.html']:
        data = z.read(h).decode('utf-8', errors='ignore')
        text = re.sub(r'<[^>]+>', ' ', data)
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        print(f'=== {h} ===')
        for l in lines[:12]:
            print(' ', l[:100])
