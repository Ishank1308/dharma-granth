import zipfile, re

epub_path = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0073_Shvetashvatara_Upanishad_–_Sanskrit_Text_with_Hind.epub'
with zipfile.ZipFile(epub_path, 'r') as z:
    for i in range(5, 11):
        name = f'index_split_{i:03d}.html'
        if name in z.namelist():
            data = z.read(name).decode('utf-8', errors='ignore')
            p_tags = re.findall(r'<p[^>]*>(.*?)</p>', data, re.DOTALL)
            clean_p = [re.sub(r'<[^>]+>', '', p).strip() for p in p_tags if re.sub(r'<[^>]+>', '', p).strip()]
            mantras = [p for p in clean_p if re.search(r'॥\s*\d+\s*॥', p)]
            print(f'{name}: Adhyaya candidate, found {len(mantras)} mantra markers. Sample:')
            for m in mantras[:2]:
                print(' ', m[:100])
