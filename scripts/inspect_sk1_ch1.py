import zipfile

epub1 = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0026_Shrimad_Bhagavat_Mahapuran_Hindi_-_First_Part_with.epub'

with zipfile.ZipFile(epub1, 'r') as z:
    html = z.read('index_split_022.html').decode('utf-8', errors='ignore')
    print("Length of index_split_022.html:", len(html))
    # print first 2500 chars
    print(html[:2500])
