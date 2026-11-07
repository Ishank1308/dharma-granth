import json
import urllib.request
import urllib.parse
import os
import sys

def search_archive_org(title, code):
    # Clean title
    clean_title = title.split('–')[0].split('|')[0].strip()
    query = f'"{clean_title}" "Gita Press"'
    params = urllib.parse.urlencode({
        'q': query,
        'fl[]': 'identifier,title,downloads',
        'sort[]': 'downloads desc',
        'rows': '3',
        'output': 'json'
    })
    url = f'https://archive.org/advancedsearch.php?{params}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            docs = data.get('response', {}).get('docs', [])
            return docs
    except Exception as e:
        return []

def get_best_pdf(identifier):
    url = f'https://archive.org/metadata/{identifier}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            files = data.get('files', [])
            pdfs = [f for f in files if f.get('name', '').lower().endswith('.pdf')]
            if not pdfs: return None
            # Prefer text PDF if available, otherwise smallest full PDF
            text_pdfs = [f for f in pdfs if '_text.pdf' in f.get('name', '').lower()]
            if text_pdfs: return text_pdfs[0]
            # sort by size
            pdfs.sort(key=lambda x: int(x.get('size', 0)))
            return pdfs[-1] # Largest is usually full quality
    except:
        return None

if __name__ == '__main__':
    with open('scripts/gitapress_free_books.json', 'r', encoding='utf-8') as f:
        books = json.load(f)
    
    print(f"Loaded {len(books)} Gita Press catalog entries.")
    # Check first 15 books
    for b in books[:15]:
        code = b.get('code')
        title = b.get('title')
        docs = search_archive_org(title, code)
        if docs:
            print(f"[Code {code}] FOUND ON ARCHIVE: {docs[0]['identifier']} ({docs[0]['title']})")
        else:
            print(f"[Code {code}] Not found directly: {title[:45]}...")
