import re

with open('data/scriptures/taittiriya.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# find each chapter id and verse ids
chapters = re.findall(r'id:\s*(\d+),\s*title:\s*["\']([^"\']+)["\'](.*?)(?={ id:|\Z)', content, re.DOTALL)
for ch_id, ch_title, ch_body in chapters:
    verses = re.findall(r'id:\s*(\d+)', ch_body)
    print(f"Chapter {ch_id} ({ch_title}): existing verse IDs = {verses}")
