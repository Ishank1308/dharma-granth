import re

with open('data/scriptures/harivanshpuran.ts', 'r', encoding='utf-8') as f:
    text = f.read()

chapters = re.findall(r'id:\s*(\d+),\s*title:\s*["\']([^"\']*)["\']', text)
print(f"Total chapters: {len(chapters)}")
for ch in chapters[:10]:
    print(f"  Ch {ch[0]}: {ch[1]}")
print("...")
for ch in chapters[-5:]:
    print(f"  Ch {ch[0]}: {ch[1]}")
