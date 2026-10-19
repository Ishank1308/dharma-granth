import urllib.request
import urllib.parse
import json
import os
import sys

TARGETS = [
    {
        "id": "vivekachudamani",
        "code": "133",
        "title": "Vivek Chudamani Gita Press",
        "query": "title:(Vivek Chudamani) AND (Gita Press)",
        "filename": "gitapress_0133_vivek_chudamani.pdf"
    },
    {
        "id": "viduraniti",
        "code": "136",
        "title": "Vidur Niti Gita Press",
        "query": "title:(Vidur Niti) AND (Gita Press)",
        "filename": "gitapress_0136_vidur_niti.pdf"
    },
    {
        "id": "yogadarshan",
        "code": "135",
        "title": "Patanjali Yoga Darshan Gita Press",
        "query": "title:(Yoga Darshan) AND (Gita Press)",
        "filename": "gitapress_0135_yoga_darshan.pdf"
    },
    {
        "id": "brahmasutra",
        "code": "65",
        "title": "Brahmasutra Vedanta Darshan Gita Press",
        "query": "title:(Vedanta Darshan) AND (Gita Press)",
        "filename": "gitapress_0065_brahmasutra.pdf"
    },
    {
        "id": "vinayapatrika",
        "code": "105",
        "title": "Vinaya Patrika Gita Press",
        "query": "title:(Vinaya Patrika OR Vinay Patrika) AND (Gita Press)",
        "filename": "gitapress_0105_vinaya_patrika.pdf"
    },
    {
        "id": "upanishad_prashna",
        "code": "70",
        "title": "Prashna Upanishad Gita Press",
        "query": "title:(Prashna Upanishad) AND (Gita Press)",
        "filename": "gitapress_0070_prashna_upanishad.pdf"
    },
    {
        "id": "upanishad_taittiriya",
        "code": "71",
        "title": "Taittiriya Upanishad Gita Press",
        "query": "title:(Taittiriya Upanishad) AND (Gita Press)",
        "filename": "gitapress_0071_taittiriya_upanishad.pdf"
    },
    {
        "id": "upanishad_shvetashvatara",
        "code": "73",
        "title": "Shvetashvatara Upanishad Gita Press",
        "query": "title:(Shvetashvatara Upanishad) AND (Gita Press)",
        "filename": "gitapress_0073_shvetashvatara_upanishad.pdf"
    }
]

def find_best_archive_pdf(query):
    params = urllib.parse.urlencode({
        'q': query,
        'fl[]': 'identifier,title,downloads',
        'sort[]': 'downloads desc',
        'rows': '5',
        'output': 'json'
    })
    url = f'https://archive.org/advancedsearch.php?{params}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            docs = data.get('response', {}).get('docs', [])
            for doc in docs:
                ident = doc.get('identifier')
                meta_url = f'https://archive.org/metadata/{ident}'
                m_req = urllib.request.Request(meta_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(m_req, timeout=12) as m_resp:
                    m_data = json.loads(m_resp.read().decode('utf-8'))
                    files = m_data.get('files', [])
                    pdf_files = [f for f in files if f.get('name', '').lower().endswith('.pdf')]
                    if not pdf_files: continue
                    # Prefer text pdf if available, otherwise primary pdf
                    text_pdf = next((f for f in pdf_files if '_text.pdf' in f.get('name', '').lower()), None)
                    chosen = text_pdf or pdf_files[0]
                    download_url = f"https://archive.org/download/{ident}/{urllib.parse.quote(chosen['name'])}"
                    return {
                        'identifier': ident,
                        'title': doc.get('title'),
                        'pdf_name': chosen.get('name'),
                        'size': int(chosen.get('size', 0)),
                        'url': download_url
                    }
    except Exception as e:
        print(f"Error querying {query}: {e}")
    return None

def download_file(url, out_path, size_bytes):
    print(f"  Downloading: {url} -> {out_path} ({size_bytes / (1024*1024):.1f} MB)")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=60) as resp, open(out_path, 'wb') as f:
        downloaded = 0
        chunk_size = 512 * 1024
        while True:
            chunk = resp.read(chunk_size)
            if not chunk: break
            f.write(chunk)
            downloaded += len(chunk)
    print(f"  Saved {out_path} successfully ({downloaded} bytes).")

def main():
    os.makedirs(r'data\sources-local', exist_ok=True)
    for target in TARGETS:
        out_path = os.path.join(r'data\sources-local', target['filename'])
        if os.path.exists(out_path) and os.path.getsize(out_path) > 10000:
            print(f"[ALREADY EXISTS] {target['title']} ({target['filename']})")
            continue
        print(f"\nSearching for: {target['title']}...")
        match = find_best_archive_pdf(target['query'])
        if match:
            print(f"  Found: {match['title']} ({match['identifier']})")
            try:
                download_file(match['url'], out_path, match['size'])
            except Exception as e:
                print(f"  Download failed for {target['title']}: {e}")
        else:
            print(f"  No archive match found for: {target['query']}")

if __name__ == '__main__':
    main()
