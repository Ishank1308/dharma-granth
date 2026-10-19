import re, json

itx_path = 'scratch/_sd/shivasaMhitA.itx'

with open(itx_path, 'r', encoding='utf-8') as f:
    text = f.read()

# ITRANS to Devanagari basic converter
itrans_rules = [
    (r'j~n', 'ज्ञ'), (r'Ch', 'छ'), (r'ch', 'च'), (r'shh', 'ष्'), (r'Sh', 'ष्'), (r'sh', 'श्'),
    (r'th', 'थ'), (r'Th', 'ठ'), (r'dh', 'ध'), (r'Dh', 'ढ'), (r'bh', 'भ'), (r'kh', 'ख'),
    (r'gh', 'घ'), (r'jh', 'झ'), (r'ph', 'फ'),
    (r'~N', 'ङ्'), (r'~n', 'ञ'), (r'N', 'ण्'), (r'T', 'ट्'), (r'D', 'ड्'),
    (r'k', 'क्'), (r'g', 'ग्'), (r'c', 'च्'), (r'j', 'ज्'), (r't', 'त्'), (r'd', 'द्'),
    (r'n', 'न्'), (r'p', 'प्'), (r'b', 'ब्'), (r'm', 'म्'), (r'y', 'य्'), (r'r', 'र्'),
    (r'l', 'ल्'), (r'v', 'व्'), (r's', 'स्'), (r'h', 'ह्'),
    (r'R\^i', 'ऋ'), (r'R\^I', 'ॠ'),
    (r'AA', 'आ'), (r'A', 'आ'), (r'aa', 'आ'), (r'ii', 'ई'), (r'I', 'ई'),
    (r'uu', 'ऊ'), (r'U', 'ऊ'), (r'ai', 'ऐ'), (r'au', 'औ'),
    (r'a', 'अ'), (r'i', 'इ'), (r'u', 'उ'), (r'e', 'ए'), (r'o', 'ओ'),
    (r'M', 'ं'), (r'H', 'ः')
]

# Let's inspect verses by patala
patala_matches = re.split(r'\\section\{([^}]+)\}', text)
print(f"Patala sections found: {len(patala_matches)}")

# Print patala headings
for i in range(1, len(patala_matches), 2):
    title = patala_matches[i]
    body = patala_matches[i+1]
    shlokas = re.findall(r'\|\|\s*(\d+)\\\.\s*(\d+)\s*\|\|', body)
    print(f"  {title}: {len(shlokas)} shlokas (e.g. {shlokas[:3]})")
