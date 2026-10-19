import zipfile, re

epub1 = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0026_Shrimad_Bhagavat_Mahapuran_Hindi_-_First_Part_with.epub'
epub2 = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0027_Shrimad_Bhagavat_Mahapuran_Hindi_–_Second_Part_wit.epub'

def check_html_classes(epub_path, sample_files):
    with zipfile.ZipFile(epub_path, 'r') as z:
        for f in sample_files:
            html = z.read(f).decode('utf-8', errors='ignore')
            # find all <p class="([^"]*)">([^<]*॥[^<]*)
            matches = re.findall(r'<p\s+class="([^"]*)"[^>]*>(.*?)</p>', html, re.DOTALL)
            verse_classes = set()
            for cls, content in matches:
                if '॥' in content:
                    verse_classes.add(cls)
            print(f"{f}: {len(matches)} total p tags, classes with '॥' = {verse_classes}")

print("PART 1:")
check_html_classes(epub1, ['index_split_022.html', 'index_split_042.html', 'index_split_087.html', 'index_split_119.html', 'index_split_164.html'])
print("PART 2:")
check_html_classes(epub2, ['index_split_001.html', 'index_split_020.html', 'index_split_036.html', 'index_split_043_split1.html'])
