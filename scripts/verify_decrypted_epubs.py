import os
import zipfile
import re
import json
import xml.etree.ElementTree as ET

EPUB_DIR = r"data/sources-local/gitapress_decrypted_epubs"

def verify_all_epubs():
    if not os.path.exists(EPUB_DIR):
        print(f"Directory not found: {EPUB_DIR}")
        return

    files = [f for f in os.listdir(EPUB_DIR) if f.endswith('.epub')]
    print(f"Total EPUB files to inspect: {len(files)}")

    results = []
    corrupted = []
    zero_or_tiny = []
    languages = {}

    for f in sorted(files):
        path = os.path.join(EPUB_DIR, f)
        size = os.path.getsize(path)
        
        if size < 10000: # less than 10KB
            zero_or_tiny.append((f, size))
            continue

        try:
            with zipfile.ZipFile(path, 'r') as z:
                # Test zip integrity
                bad_file = z.testzip()
                if bad_file:
                    corrupted.append((f, f"Corrupted file inside zip: {bad_file}"))
                    continue

                namelist = z.namelist()
                html_files = [n for n in namelist if n.endswith(('.html', '.xhtml', '.htm'))]
                
                # Extract title from content.opf if available
                title = ""
                language = ""
                opf_files = [n for n in namelist if n.endswith('.opf')]
                if opf_files:
                    try:
                        opf_content = z.read(opf_files[0]).decode('utf-8', errors='ignore')
                        t_m = re.search(r'<dc:title[^>]*>(.*?)</dc:title>', opf_content, re.IGNORECASE | re.DOTALL)
                        if t_m:
                            title = t_m.group(1).strip()
                        l_m = re.search(r'<dc:language[^>]*>(.*?)</dc:language>', opf_content, re.IGNORECASE)
                        if l_m:
                            language = l_m.group(1).strip()
                    except Exception as e:
                        pass

                # Check sample text for Devanagari / readability
                total_text_len = 0
                devanagari_chars = 0
                sample_snippet = ""
                
                for h in html_files[:5]:
                    raw = z.read(h).decode('utf-8', errors='ignore')
                    # Strip tags
                    clean = re.sub(r'<[^>]+>', ' ', raw)
                    clean = re.sub(r'\s+', ' ', clean).strip()
                    total_text_len += len(clean)
                    dev_count = len(re.findall(r'[\u0900-\u097F]', clean))
                    devanagari_chars += dev_count
                    if not sample_snippet and len(clean) > 50:
                        sample_snippet = clean[:120]

                is_devanagari = (devanagari_chars > 100)
                lang_tag = language or ("hindi/sanskrit" if is_devanagari else "other")
                languages[lang_tag] = languages.get(lang_tag, 0) + 1

                results.append({
                    "filename": f,
                    "size_mb": round(size / (1024 * 1024), 2),
                    "title": title or f,
                    "language": language,
                    "html_file_count": len(html_files),
                    "has_devanagari": is_devanagari,
                    "sample": sample_snippet
                })

        except Exception as e:
            corrupted.append((f, str(e)))

    print("\n--- SUMMARY AUDIT ---")
    print(f"Successfully verified & valid EPUBs: {len(results)} / {len(files)}")
    print(f"Corrupted or invalid zip archives: {len(corrupted)}")
    if corrupted:
        for c, err in corrupted:
            print(f"  [CORRUPT] {c}: {err}")
    print(f"Tiny or empty files (< 10KB): {len(zero_or_tiny)}")
    if zero_or_tiny:
        for zf, sz in zero_or_tiny:
            print(f"  [TINY] {zf}: {sz} bytes")

    print(f"\nLanguage / Script Breakdown:")
    for l, count in sorted(languages.items(), key=lambda x: -x[1]):
        print(f"  {l}: {count} books")

    print("\n--- KEY SCRIPTURES DEEP INSPECTION ---")
    key_codes = ["0038", "0026", "0027", "1930", "1897", "1898", "0006", "0010", "0073", "0517", "0557", "0574", "1737", "0064", "2296"]
    for r in results:
        for kc in key_codes:
            if f"_{kc}_" in r["filename"] or f"_{int(kc)}_" in r["filename"]:
                print(f"\nBook Code {kc}:")
                print(f"  File: {r['filename']}")
                print(f"  Title: {r['title']}")
                print(f"  Size: {r['size_mb']} MB")
                print(f"  HTML sections: {r['html_file_count']}")
                print(f"  Devanagari text verified: {r['has_devanagari']}")
                print(f"  Sample snippet: {r['sample'][:100]}...")

    # Write full catalog report to json
    out_report = r"data/sources-local/gitapress_decrypted_catalog_audit.json"
    with open(out_report, 'w', encoding='utf-8') as out:
        json.dump({
            "total_books": len(files),
            "valid_books": len(results),
            "corrupted_count": len(corrupted),
            "tiny_count": len(zero_or_tiny),
            "books": results
        }, out, ensure_ascii=False, indent=2)
    print(f"\nFull audit written to: {out_report}")

if __name__ == "__main__":
    verify_all_epubs()
