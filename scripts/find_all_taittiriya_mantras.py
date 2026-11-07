import zipfile, re

epub = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0071_Taittiriya_Upanishad_–_Sanskrit_Text_with_Hindi_Tr.epub'

with zipfile.ZipFile(epub, 'r') as z:
    for name in z.namelist():
        if name.endswith('.html'):
            html = z.read(name).decode('utf-8', errors='ignore')
            mantras = re.findall(r'<p\s+id="(Mantr_[^"]+)"[^>]*>(.*?)</p>\s*<p\s+class="[^"]*"[^>]*>(.*?)</p>', html, re.DOTALL)
            for m in mantras:
                san = re.sub(r'<[^>]+>', '', m[1]).strip()
                hi = re.sub(r'<[^>]+>', '', m[2]).strip()
                print(f"[{name}] {m[0]}:\n  SAN: {san[:80]}\n  HI:  {hi[:80]}")
