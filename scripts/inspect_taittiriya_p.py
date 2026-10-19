import zipfile, re

epub = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0071_Taittiriya_Upanishad_–_Sanskrit_Text_with_Hindi_Tr.epub'

with zipfile.ZipFile(epub, 'r') as z:
    html = z.read('index_split_003.html').decode('utf-8', errors='ignore')
    # find all p tags
    p_tags = re.findall(r'<p\s+class="([^"]*)"[^>]*>(.*?)</p>', html, re.DOTALL)
    for i, (cls, content) in enumerate(p_tags[:30]):
        clean = re.sub(r'<[^>]+>', '', content).strip()
        if clean:
            print(f"[{i}] ({cls}): {clean[:100]}")
