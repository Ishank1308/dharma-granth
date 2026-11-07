import zipfile

epub = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0071_Taittiriya_Upanishad_–_Sanskrit_Text_with_Hindi_Tr.epub'

with zipfile.ZipFile(epub, 'r') as z:
    html = z.read('index_split_003.html').decode('utf-8', errors='ignore')
    idx = html.find('शं नो मित्र')
    print(html[idx-100:idx+600])
