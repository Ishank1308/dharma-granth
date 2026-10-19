import zipfile, re

epub_path = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0073_Shvetashvatara_Upanishad_–_Sanskrit_Text_with_Hind.epub'
splits = [5, 7, 8, 9, 10, 11]

with zipfile.ZipFile(epub_path, 'r') as z:
    for adhyaya, s in enumerate(splits, 1):
        name = f'index_split_{s:03d}.html'
        data = z.read(name).decode('utf-8', errors='ignore')
        # match p tags that contain ॥ N॥
        mantra_paras = re.findall(r'<p[^>]*class="([^"]*)"[^>]*>(.*?॥\s*\d+\s*॥.*?)</p>', data, re.DOTALL)
        classes = set(c[0] for c in mantra_paras)
        print(f'Adhyaya {adhyaya}: {len(mantra_paras)} mantras ending with danda. Classes: {classes}')
