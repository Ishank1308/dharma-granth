import zipfile, re

epub1 = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0026_Shrimad_Bhagavat_Mahapuran_Hindi_-_First_Part_with.epub'
epub2 = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0027_Shrimad_Bhagavat_Mahapuran_Hindi_–_Second_Part_wit.epub'

print('=== INSPECTING BHAGAVAT MAHAPURAN PART 1 ===')
with zipfile.ZipFile(epub1, 'r') as z:
    names = z.namelist()
    htmls = [n for n in names if n.endswith('.html')]
    print(f'HTML files count: {len(htmls)}')
    for h in htmls[:8]:
        data = z.read(h).decode('utf-8', errors='ignore')
        m = re.findall(r'॥\s*[\d०-९]+\s*॥', data)
        print(f'  {h}: len {len(data)}, danda markers: {len(m)}')

print('\n=== INSPECTING BHAGAVAT MAHAPURAN PART 2 ===')
with zipfile.ZipFile(epub2, 'r') as z:
    names = z.namelist()
    htmls = [n for n in names if n.endswith('.html')]
    print(f'HTML files count: {len(htmls)}')
    for h in htmls[:8]:
        data = z.read(h).decode('utf-8', errors='ignore')
        m = re.findall(r'॥\s*[\d०-९]+\s*॥', data)
        print(f'  {h}: len {len(data)}, danda markers: {len(m)}')
