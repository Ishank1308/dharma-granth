import zipfile, re, json

epub = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0071_Taittiriya_Upanishad_–_Sanskrit_Text_with_Hindi_Tr.epub'

# Mapping of file names and section titles
# Shikshavalli: 12 Anuvakas
# Brahmanandavalli: 9 Anuvakas
# Bhriguvalli: 10 Anuvakas

valli_names = {
    1: ("Śīkṣā Vallī — The Phonetics and Ethics Section", "शिक्षावल्ली"),
    2: ("Brahmānanda Vallī — The Bliss of Brahman", "ब्रह्मानन्दवल्ली"),
    3: ("Bhṛgu Vallī — Progressive Realization of Brahman", "भृगुवल्ली")
}

def clean_text(s):
    s = re.sub(r'<[^>]+>', ' ', s)
    s = s.replace('\xa0', ' ').replace('\u200d', '').replace('\u200c', '')
    s = re.sub(r'\s+', ' ', s)
    return s.strip()

with zipfile.ZipFile(epub, 'r') as z:
    all_mantras = []
    # inspect all html files in reading order
    names = [n for n in z.namelist() if n.endswith('.html')]
    # sort by split index if possible
    def split_key(n):
        m = re.search(r'split_(\d+)(?:_split(\d+))?', n)
        if m:
            return (int(m.group(1)), int(m.group(2) or 0))
        return (999, 0)
    names = sorted(names, key=split_key)

    current_valli = 1
    anuvaka_count = 0
    results = {1: [], 2: [], 3: []}

    for name in names:
        html = z.read(name).decode('utf-8', errors='ignore')
        if 'ब्रह्मानन्दवल्ली' in html and 'ब्रह्मानन्दवल्लीका शान्तिपाठ' in html:
            current_valli = 2
        elif 'भृगुवल्ली' in html and ('अथ भृगुवल्ली' in html or 'वरुणं पितरमुपससार' in html):
            current_valli = 3

        # extract mantr tags
        # pattern: <p id="Mantr_\d+" ...>(.*?)</p>\s*<p class="[^"]*">(.*?)</p>
        matches = re.finditer(r'<p\s+id="(Mantr_[^"]+)"[^>]*>(.*?)</p>\s*<p\s+class="[^"]*"[^>]*>(.*?)</p>', html, re.DOTALL)
        for m in matches:
            mantr_id = m.group(1)
            san_raw = clean_text(m.group(2))
            hi_raw = clean_text(m.group(3))
            if san_raw and hi_raw:
                results[current_valli].append({
                    "id": len(results[current_valli]) + 1,
                    "mantr_id": mantr_id,
                    "sanskrit": san_raw,
                    "hindi": hi_raw,
                    "file": name
                })

for v in [1, 2, 3]:
    print(f"Valli {v} ({valli_names[v][1]}): extracted {len(results[v])} mantras")
    for item in results[v]:
        print(f"  {v}.{item['id']}: {item['sanskrit'][:60]}...")

with open('scripts/taittiriya_extracted.json', 'w', encoding='utf-8') as out:
    json.dump(results, out, ensure_ascii=False, indent=2)

print("\nSaved extracted data to scripts/taittiriya_extracted.json")
