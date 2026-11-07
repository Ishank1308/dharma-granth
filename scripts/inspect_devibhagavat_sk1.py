import zipfile, re

epub1 = r'data/sources-local/gitapress_decrypted_epubs/gitapress_1897_Śrīmad_Devī-Bhāgavat_Mahāpurāṇ_–_Volume_I_(Hindi,_.epub'

with zipfile.ZipFile(epub1, 'r') as z:
    html = z.read('index_split_029.html').decode('utf-8', errors='ignore')
    print("Length:", len(html))
    print(html[:2000])
