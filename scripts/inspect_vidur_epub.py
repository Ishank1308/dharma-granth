import zipfile, re

epub_path = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0136_Vidur_Niti_(Hindi).epub'

with zipfile.ZipFile(epub_path, 'r') as z:
    for name in sorted(z.namelist()):
        if name.endswith('.html') and 'split' in name:
            data = z.read(name).decode('utf-8', errors='ignore')
            m = re.findall(r'॥\s*[\d०-९]+\s*॥', data)
            # check chapter header
            clean = re.sub(r'<[^>]+>', ' ', data)
            lines = [l.strip() for l in clean.split('\n') if l.strip()]
            header = lines[0] if lines else ''
            print(f'{name}: len {len(data)}, markers: {len(m)}, top: {header[:60]}')
