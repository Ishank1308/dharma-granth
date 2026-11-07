import json

with open('scripts/shvetashvatara_extracted.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for ch in data:
    v = ch['verses'][0]
    print(f"Chapter {ch['chapter']} (total {len(ch['verses'])} mantras):")
    print('  Mantra 1 Sanskrit:', v['sanskrit'][:80])
    print('  Mantra 1 Hindi:', v['hindi'][:80])
