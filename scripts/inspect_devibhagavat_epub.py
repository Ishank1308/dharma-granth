import zipfile, re

epub1 = r'data/sources-local/gitapress_decrypted_epubs/gitapress_1897_Śrīmad_Devī-Bhāgavat_Mahāpurāṇ_–_Volume_I_(Hindi,_.epub'
epub2 = r'data/sources-local/gitapress_decrypted_epubs/gitapress_1898_Srimad_Devi-Bhagavat_Mahapuraṇ_–_Volume_II_(Hindi,.epub'

print("=== DEVI BHAGAVAT VOL 1 ===")
with zipfile.ZipFile(epub1, 'r') as z:
    for name in z.namelist()[:10]:
        if name.endswith('.html'):
            data = z.read(name).decode('utf-8', errors='ignore')
            m = re.findall(r'॥\s*[\d०-९]+\s*॥', data)
            h = re.findall(r'<h[1-4][^>]*>(.*?)</h[1-4]>', data)
            clean_h = [re.sub(r'<[^>]+>', '', x).strip() for x in h if x.strip()]
            print(f"  {name}: len={len(data)}, danda={len(m)}, headings={clean_h[:2]}")

print("\n=== DEVI BHAGAVAT VOL 2 ===")
with zipfile.ZipFile(epub2, 'r') as z:
    for name in z.namelist()[:10]:
        if name.endswith('.html'):
            data = z.read(name).decode('utf-8', errors='ignore')
            m = re.findall(r'॥\s*[\d०-९]+\s*॥', data)
            h = re.findall(r'<h[1-4][^>]*>(.*?)</h[1-4]>', data)
            clean_h = [re.sub(r'<[^>]+>', '', x).strip() for x in h if x.strip()]
            print(f"  {name}: len={len(data)}, danda={len(m)}, headings={clean_h[:2]}")
