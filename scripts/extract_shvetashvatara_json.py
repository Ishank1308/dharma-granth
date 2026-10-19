import zipfile, re, json

to_devanagari_num = lambda n: ''.join('०१२३४५६७८९'[int(d)] for d in str(n))

epub_path = r'data/sources-local/gitapress_decrypted_epubs/gitapress_0073_Shvetashvatara_Upanishad_–_Sanskrit_Text_with_Hind.epub'
splits = [5, 7, 8, 9, 10, 11]
expected_counts = [16, 17, 21, 22, 14, 23]

chapters = []

with zipfile.ZipFile(epub_path, 'r') as z:
    for adhyaya_idx, s in enumerate(splits, 1):
        name = f'index_split_{s:03d}.html'
        data = z.read(name).decode('utf-8', errors='ignore')
        p_tags = re.findall(r'<p[^>]*>(.*?)</p>', data, re.DOTALL)
        clean_p = [re.sub(r'<[^>]+>', '', p).strip() for p in p_tags if re.sub(r'<[^>]+>', '', p).strip()]
        
        expected = expected_counts[adhyaya_idx - 1]
        verses = []
        
        for m_num in range(1, expected + 1):
            dev_num = to_devanagari_num(m_num)
            pattern = rf'॥\s*{dev_num}\s*॥'
            
            matched_indices = [i for i, p in enumerate(clean_p) if re.search(pattern, p)]
            
            skt = ""
            hindi = ""
            
            if matched_indices:
                idx = matched_indices[0]
                skt_parts = []
                # Check preceding line if part of shloka
                if idx > 0 and not re.search(r'॥', clean_p[idx-1]) and len(clean_p[idx-1]) < 180 and not any(w in clean_p[idx-1] for w in ['कहते हैं', 'अर्थात्', 'टीका', 'भाष्य', 'इत्यादि', 'इति']):
                    skt_parts.append(clean_p[idx-1])
                skt_parts.append(clean_p[idx])
                skt = ' '.join(skt_parts)
                
                # Hindi translation is usually the second occurrence of ॥ dev_num ॥ or subsequent paragraph
                if len(matched_indices) > 1:
                    hindi = clean_p[matched_indices[1]]
                elif idx + 1 < len(clean_p):
                    hindi = clean_p[idx + 1]
                    
            verses.append({
                'id': m_num,
                'sanskrit': skt,
                'hindi': hindi
            })
            
        print(f'Adhyaya {adhyaya_idx}: extracted {len(verses)} mantras')
        chapters.append({
            'chapter': adhyaya_idx,
            'verses': verses
        })

with open('scripts/shvetashvatara_extracted.json', 'w', encoding='utf-8') as f:
    json.dump(chapters, f, ensure_ascii=False, indent=2)

print('Saved to scripts/shvetashvatara_extracted.json')
