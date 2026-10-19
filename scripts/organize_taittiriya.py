import json, re

# Let's map accurately:
# Valli 1 (Shikshavalli): 12 Anuvakas
# Valli 2 (Brahmanandavalli): 9 Anuvakas
# Valli 3 (Bhriguvalli): 10 Anuvakas

with open('scripts/taittiriya_extracted.json', 'r', encoding='utf-8') as f:
    raw = json.load(f)

# raw['2'][0..12] are Shikshavalli (12 anuvakas + opening/closing)
# raw['2'][13..21] are Brahmanandavalli (9 anuvakas)
# raw['3'][0] is peace mantra, raw['3'][1..12] are Bhriguvalli (10 anuvakas)

shiksha_items = raw['2'][:13]
# Notice item 0 is Shantipatha, item 1..12 are Anuvakas 1..12
shiksha = []
for i, item in enumerate(shiksha_items[1:], 1): # 12 anuvakas
    shiksha.append({
        "id": i,
        "sanskrit": item["sanskrit"],
        "hindi": item["hindi"]
    })

brahmananda_items = raw['2'][13:] # 9 items
brahmananda = []
for i, item in enumerate(brahmananda_items, 1):
    brahmananda.append({
        "id": i,
        "sanskrit": item["sanskrit"],
        "hindi": item["hindi"]
    })

bhrigu_items = raw['3'][1:] # skip opening shantipatha
bhrigu = []
for i, item in enumerate(bhrigu_items, 1):
    bhrigu.append({
        "id": i,
        "sanskrit": item["sanskrit"],
        "hindi": item["hindi"]
    })

clean_map = {
    1: shiksha,       # 12 Anuvakas
    2: brahmananda,   # 9 Anuvakas
    3: bhrigu         # 10 Anuvakas (or 12 verses)
}

print(f"Shikshavalli: {len(shiksha)} anuvakas")
print(f"Brahmanandavalli: {len(brahmananda)} anuvakas")
print(f"Bhriguvalli: {len(bhrigu)} anuvakas")

with open('scripts/taittiriya_clean.json', 'w', encoding='utf-8') as out:
    json.dump(clean_map, out, ensure_ascii=False, indent=2)
