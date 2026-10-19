import zipfile, re

epub1 = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0026_Shrimad_Bhagavat_Mahapuran_Hindi_-_First_Part_with.epub'

def clean_html(text):
    text = re.sub(r'<[^>]+>', '', text)
    text = text.replace('\xa0', ' ').replace('\u200d', '').replace('\u200c', '')
    return re.sub(r'\s+', ' ', text).strip()

with zipfile.ZipFile(epub1, 'r') as z:
    html = z.read('index_split_022.html').decode('utf-8', errors='ignore')
    p_tags = re.findall(r'<p[^>]*>(.*?)</p>', html, re.DOTALL)
    cleaned_ps = [clean_html(p) for p in p_tags if clean_html(p)]
    
    for i in range(16, 26):
        print(f"[{i}] {cleaned_ps[i]}")
