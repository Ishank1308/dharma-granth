import zipfile
import re

epub_path = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0574_Sankshipt_Yogavasishtha_–_A_Concise_Edition_of_the.epub'
with zipfile.ZipFile(epub_path, 'r') as z:
    names = z.namelist()
    html_files = [n for n in names if n.endswith(('.xhtml', '.html'))]
    print(f"Total HTML files: {len(html_files)}")
    for f in html_files[:10]:
        content = z.read(f).decode('utf-8', errors='ignore')
        clean = re.sub(r'<[^>]+>', ' ', content)
        clean = re.sub(r'\s+', ' ', clean).strip()
        print(f"- {f}: {clean[:120]}")
