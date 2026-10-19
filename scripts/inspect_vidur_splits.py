import zipfile, re

epub_path = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0136_Vidur_Niti_(Hindi).epub'

with zipfile.ZipFile(epub_path, 'r') as z:
    for i in range(3, 10):
        name = f'index_split_{i:03d}.html'
        data = z.read(name).decode('utf-8', errors='ignore')
        clean = re.sub(r'<[^>]+>', ' ', data)
        lines = [l.strip() for l in clean.split('\n') if l.strip()]
        print(f'=== {name} ===')
        for l in lines[:6]:
            print(' ', l[:90])
