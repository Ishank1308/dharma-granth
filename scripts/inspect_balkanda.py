import zipfile, re

epub = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0080_Shri_Ramcharitmanas_Hindi_–_Illustrated,_Annotated.epub'

with zipfile.ZipFile(epub, 'r') as z:
    html = z.read('index_split_007.html').decode('utf-8', errors='ignore')
    # print first 3000 chars of body
    idx = html.find('वर्णानामर्थसंघानां')
    if idx == -1:
        idx = html.find('बालकाण्ड')
    print(html[idx:idx+2500])
