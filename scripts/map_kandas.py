import zipfile, re

epub = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0080_Shri_Ramcharitmanas_Hindi_–_Illustrated,_Annotated.epub'

with zipfile.ZipFile(epub, 'r') as z:
    for name in z.namelist():
        if name.endswith('.html'):
            data = z.read(name).decode('utf-8', errors='ignore')
            for kanda in ['बालकाण्ड', 'अयोध्याकाण्ड', 'अरण्यकाण्ड', 'किष्किन्धाकाण्ड', 'सुन्दरकाण्ड', 'लंकाकाण्ड', 'उत्तरकाण्ड']:
                if kanda in data:
                    print(f"{name}: contains {kanda}")
                    break
