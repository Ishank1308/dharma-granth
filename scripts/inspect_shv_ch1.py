import zipfile, re

epub_path = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0073_Shvetashvatara_Upanishad_–_Sanskrit_Text_with_Hind.epub'
with zipfile.ZipFile(epub_path, 'r') as z:
    data = z.read('index_split_005.html').decode('utf-8', errors='ignore')
    p_tags = re.findall(r'<p[^>]*>(.*?)</p>', data, re.DOTALL)
    clean_p = [re.sub(r'<[^>]+>', '', p).strip() for p in p_tags if re.sub(r'<[^>]+>', '', p).strip()]
    for i, p in enumerate(clean_p[:40]):
        print(f'{i}: {p[:90]}')
