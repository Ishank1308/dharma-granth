import zipfile, re, json
from collections import defaultdict

epub1 = r'data/sources-local/gitapress_decrypted_epubs/gitapress_1897_Śrīmad_Devī-Bhāgavat_Mahāpurāṇ_–_Volume_I_(Hindi,_.epub'
epub2 = r'data/sources-local/gitapress_decrypted_epubs/gitapress_1898_Srimad_Devi-Bhagavat_Mahapuraṇ_–_Volume_II_(Hindi,.epub'

def clean_html(text):
    text = re.sub(r'<[^>]+>', '', text)
    text = text.replace('\xa0', ' ').replace('\u200d', '').replace('\u200c', '')
    return re.sub(r'\s+', ' ', text).strip()

def devanagari_to_ascii(num_str):
    d_map = {'०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9'}
    return ''.join(d_map.get(c, c) for c in str(num_str))

HINDI_INDICATORS = re.compile(
    r'(?:'
    r'तदनन्तर|दूसरे|तीसरे|चौथे|पहला|पहले|सभी|समस्त|सम्पूर्ण|'
    r'बोले|बोलीं|कहा|सुना|देखा|पूछा|गया|गए|गई|गये|हुआ|हुए|हुई|होने|होता|होती|होते|'
    r'लगा|लगे|लगी|रहा|रहे|रही|सकता|सकते|सकती|चाहिए|चाहिये|'
    r'किया|किये|किए|दिये|दिए|लिये|लिए|बैठ|खड़े|प्राप्त|प्रदान|धारण|विचार|'
    r'अपने|अपनी|अपना|उनका|उनकी|उनके|इसका|इसकी|इसके|जिसका|जिसकी|जिसके|जिसने|जिन्होंने|उन्होंने|इन्होंने|मुझको|मुझे|मुझसे|उसे|उससे|उन्हें|उनसे|'
    r'सूतजी|व्यासजी|शौनकजी|नारदजी|शिवजी|ब्रह्माजी|श्रीहरि|भगवान्|मुनि|ऋषि|राजा|दैत्य|दानव|राक्षस|'
    r'नहीं|मत|बिना|भी|तो|ही|और|तथा|अथवा|या|किन्तु|परन्तु|क्योंकि|'
    r'[मनेकसप]े\b|[कसप]ो\b|[कसप]ी\b|[कस]ा\b|[मप]ें\b|'
    r'\s(?:ने|को|से|का|के|की|में|पर|तक|था|थी|थे|है|हैं)\s|'
    r'(?:ने|को|में|से|पर|है|हैं|था|थी|थे|गया|गए|गई|हुए|हुआ|हुई)\s*[।॥]|'
    r'[,\-–—;:?!\"“\'\(\)\[\]]'
    r')'
)

def is_hindi_vyakhya(text):
    return bool(HINDI_INDICATORS.search(text))

def parse_verse_range(verse_str):
    cleaned = re.sub(r'[/½]|(?:१/२|1/2)', '', verse_str)
    cleaned = re.sub(r'[^०-९0-9\-–—]', '', cleaned)
    parts = re.split(r'[-–—]', cleaned)
    if len(parts) == 1 and parts[0]:
        val = int(devanagari_to_ascii(parts[0]))
        return [val]
    elif len(parts) >= 2 and parts[0] and parts[1]:
        start = int(devanagari_to_ascii(parts[0]))
        end = int(devanagari_to_ascii(parts[1]))
        if start <= end and (end - start) < 60:
            return list(range(start, end + 1))
        return [start]
    return []

adhyaya_words = [
    (50, r'(?<!एकोन)(?<!ऊन)(?<!ैकोन)पञ्चाश'),
    (49, r'एकोनपञ्चाश|ऊनपञ्चाश|ैकोनपञ्चाश|ोनपञ्चाश'),
    (48, r'अष्टचत्वारिंशो|अथाष्टचत्वारिंशो|अष्टाचत्वारिंशो'),
    (47, r'सप्तचत्वारिंशो|अथसप्तचत्वारिंशो'),
    (46, r'षट्चत्वारिंशो|अथषट्चत्वारिंशो'),
    (45, r'पञ्चचत्वारिंशो|अथपञ्चचत्वारिंशो'),
    (44, r'चतुश्चत्वारिंशो|अथचतुश्चत्वारिंशो'),
    (43, r'त्रिचत्वारिंशो|अथत्रिचत्वारिंशो'),
    (42, r'द्विचत्वारिंशो|अथद्विचत्वारिंशो'),
    (41, r'एकचत्वारिंशो|अथैकचत्वारिंशो|ैकचत्वारिंशो'),
    (40, r'(?<!एकोन)(?<!ऊन)(?<!ैकोन)चत्वारिंशो'),
    (39, r'एकोनचत्वारिंशो|ऊनचत्वारिंशो|ैकोनचत्वारिंशो|ोनचत्वारिंशो'),
    (38, r'अष्टात्रिंशो|अथाष्टात्रिंशो|अष्टत्रिंशो|अथाष्टत्रिंशो'),
    (37, r'सप्तत्रिंशो|अथसप्तत्रिंशो'),
    (36, r'षट्त्रिंशो|अथषट्त्रिंशो'),
    (35, r'पञ्चत्रिंशो|अथपञ्चत्रिंशो'),
    (34, r'चतुस्त्रिंशो|अथचतुस्त्रिंशो'),
    (33, r'त्रयस्त्रिंशो|त्रयस्त्र\u200cिंशो|अथत्रयस्त्रिंशो'),
    (32, r'द्वात्रिंशो|अथद्वात्रिंशो'),
    (31, r'एकत्रिंशो|अथैकत्रिंशो|ैकत्रिंशो'),
    (30, r'(?<!एकोन)(?<!ऊन)(?<!ैकोन)त्रिंशो'),
    (29, r'एकोनत्रिंशो|ऊनत्रिंशो|ैकोनत्रिंशो|ोनत्रिंशो'),
    (28, r'अष्टाविंशो|अथाष्टाविंशो|अष्टविंशो'),
    (27, r'सप्तविंशो|अथसप्तविंशो'),
    (26, r'षड्विंशो|षड्\s*विंशो|अथषड्विंशो'),
    (25, r'पञ्चविंशो|अथपञ्चविंशो'),
    (24, r'चतुर्विंशो|अथचतुर्विंशो'),
    (23, r'त्रयोविंशो|अथत्रयोविंशो'),
    (22, r'द्वाविंशो|अथद्वाविंशो'),
    (21, r'एकविंशो|अथैकविंशो|ैकविंशो'),
    (20, r'(?<!एकोन)(?<!ऊन)(?<!ैकोन)विंशो'),
    (19, r'एकोनविंशो|ऊनविंशो|ैकोनविंशो|ोनविंशो'),
    (18, r'अष्टादशो|अथाष्टादशो|अष्टदशो'),
    (17, r'सप्तदशो|अथसप्तदशो'),
    (16, r'षोडशो|अथषोडशो'),
    (15, r'पञ्चदशो|अथपञ्चदशो'),
    (14, r'चतुर्दशो|अथचतुर्दशो'),
    (13, r'त्रयोदशो|अथत्रयोदशो'),
    (12, r'द्वादशो|अथद्वादशो'),
    (11, r'एकादशो|अथैकादशो|ैकादशो'),
    (10, r'दशमो|अथदशमो'),
    (9, r'नवमो|अथनवमो'),
    (8, r'अष्टमो|अथाष्टमो'),
    (7, r'सप्तमो|अथसप्तमो'),
    (6, r'षष्ठो|अथषष्ठो'),
    (5, r'पञ्चमो|अथपञ्चमो'),
    (4, r'चतुर्थो|अथचतुर्थो'),
    (3, r'तृतीयो|अथतृतीयो'),
    (2, r'द्वितीयो|अथद्वितीयो'),
    (1, r'प्रथमो|अथप्रथमो')
]

skandha_names = [
    (1, r'प्रथम[:\s]+स्कन्ध'),
    (2, r'द्वितीय[:\s]+स्कन्ध'),
    (3, r'तृतीय[:\s]+स्कन्ध'),
    (4, r'चतुर्थ[:\s]+स्कन्ध'),
    (5, r'पञ्चम[:\s]+स्कन्ध'),
    (6, r'षष्ठ[:\s]+स्कन्ध'),
    (7, r'सप्तम[:\s]+स्कन्ध'),
    (8, r'अष्टम[:\s]+स्कन्ध'),
    (9, r'नवम[:\s]+स्कन्ध'),
    (10, r'दशम[:\s]+स्कन्ध'),
    (11, r'एकादश[:\s]+स्कन्ध'),
    (12, r'द्वादश[:\s]+स्कन्ध'),
]

ADH_REGEX = re.compile(r'^अथ[^\n]*[ऽअ]ध्याय[:।]?$')

def parse_volume(epub_path, start_file, sk_range):
    results = defaultdict(dict)
    with zipfile.ZipFile(epub_path, 'r') as z:
        html_files = [f for f in z.namelist() if f.endswith('.html')]
        def sort_key(name):
            m = re.search(r'split_(\d+)', name)
            num = int(m.group(1)) if m else 9999
            sub = 1 if '_split1' in name else 0
            return (num, sub)
        html_files.sort(key=sort_key)
        start_key = sort_key(start_file)
        current_sk = sk_range[0]
        current_adh = 1
        accumulated_hindi = []
        
        for fname in html_files:
            if sort_key(fname) < start_key:
                continue
            html = z.read(fname).decode('utf-8', errors='ignore')
            blocks = re.findall(r'<(h[1-5]|p)[^>]*>([\s\S]*?)</\1>', html)
            for tag_name, content in blocks:
                txt = clean_html(content)
                if not txt:
                    continue
                if tag_name.startswith('h') and 'स्कन्ध' in txt:
                    for s_num, s_pat in skandha_names:
                        if s_num in sk_range and re.search(s_pat, txt):
                            if s_num != current_sk:
                                current_sk = s_num
                                current_adh = 1
                            break
                if ADH_REGEX.match(txt):
                    for a_num, a_pat in adhyaya_words:
                        if re.search(a_pat, txt):
                            current_adh = a_num
                            accumulated_hindi = []
                            break
                if txt.startswith('इति') or ('नाम' in txt and 'अध्याय:' in txt and '॥' in txt):
                    accumulated_hindi = []
                    continue
                    
                # Match verse marker at end or before trailing parenthetical, allowing ॥ or ॥। or ।
                m_hi = re.search(r'[।॥]+\s*([०-९0-9/½\s\-–—]+)\s*[।॥]*(?:\s*\(.*?\))?\s*$', txt)
                if m_hi and (is_hindi_vyakhya(txt) or bool(accumulated_hindi)):
                    r_str = m_hi.group(1)
                    verses = parse_verse_range(r_str)
                    clean_text = re.sub(r'[।॥]+\s*[०-९0-9/½\s\-–—]+\s*[।॥]*(?:\s*\(.*?\))?\s*$', '', txt).strip()
                    if accumulated_hindi:
                        full_hindi = ' '.join(accumulated_hindi) + ' ' + clean_text
                        accumulated_hindi = []
                    else:
                        full_hindi = clean_text
                    full_hindi = devanagari_to_ascii(full_hindi.strip())
                    if full_hindi and len(full_hindi) > 5:
                        for v in verses:
                            results[(current_sk, current_adh)][v] = full_hindi
                elif is_hindi_vyakhya(txt):
                    if re.match(r'^[०-९0-9]+[\.\s]', txt) or len(txt) > 20:
                        accumulated_hindi.append(txt)
    return results

def main():
    print('Reading Gita Press Volume 1 EPUB...')
    r1 = parse_volume(epub1, 'index_split_029.html', list(range(1, 7)))
    print(f'Volume 1 parsed: {len(r1)} adhyayas')

    print('Reading Gita Press Volume 2 EPUB...')
    r2 = parse_volume(epub2, 'index_split_001.html', list(range(7, 13)))
    print(f'Volume 2 parsed: {len(r2)} adhyayas')

    all_r = {**r1, **r2}
    print(f'Total Gita Press adhyayas: {len(all_r)}, total verse meanings: {sum(len(v) for v in all_r.values())}')

    # Load guarded 143-verse written meanings
    with open('data/written-meanings/devibhagavat.json', 'r', encoding='utf-8') as f:
        draft = json.load(f)
    draft_meanings = draft.get('meanings', {})
    print(f'Loaded {len(draft_meanings)} guarded meanings from data/written-meanings/devibhagavat.json')

    json_path = 'public/data/scriptures-full/devibhagavat.json'
    print(f'Loading {json_path}...')
    with open(json_path, 'r', encoding='utf-8') as f:
        db = json.load(f)

    total_verses = 0
    draft_143_verses = 0
    hydrated_verses = 0

    for ch in db['chapters']:
        ch_num = int(ch['number'])
        m = re.match(r'Skandha\s+(\d+),\s*Adhyāya\s+(\d+)', ch.get('title', ''))
        sk = int(m.group(1)) if m else None
        adh = int(m.group(2)) if m else None

        ch_ext = all_r.get((sk, adh), {}) if (sk and adh) else {}

        for v in ch['verses']:
            total_verses += 1
            raw_v_num = v['number']
            base_num = int(re.sub(r'[^0-9]', '', str(raw_v_num))) if re.sub(r'[^0-9]', '', str(raw_v_num)) else raw_v_num
            key = f"{ch_num}:{base_num}"

            # If this is one of the 143 guarded verses, set its drafted meaning
            if key in draft_meanings:
                v['hindi'] = draft_meanings[key]['hindi']
                v['hindiSource'] = 'ai'
                v.pop('hindiReviewRequired', None)
                v.pop('hindiUnproofread', None)
                draft_143_verses += 1
                continue

            # Look up Gita Press Hindi meaning
            ext = ch_ext.get(raw_v_num) or ch_ext.get(base_num)
            
            # Special edition alignments
            if not ext and sk == 8 and adh == 3 and base_num >= 24:
                ext = all_r.get((8, 4), {}).get(base_num)
            if not ext and sk == 7 and adh == 35 and base_num == 63:
                ext = ch_ext.get(62)
            if not ext and sk == 12 and adh == 11 and base_num == 112:
                ext = ch_ext.get(110)

            if ext:
                v['hindi'] = ext
                v['hindiSource'] = 'gitapress'
                v.pop('hindiReviewRequired', None)
                v.pop('hindiUnproofread', None)
                hydrated_verses += 1
            else:
                if v.get('hindi') and v['hindi'].strip():
                    v['hindi'] = devanagari_to_ascii(v['hindi'])
                    hydrated_verses += 1
                else:
                    raise ValueError(f"Unmatched verse: Chapter {ch_num} (Skandha {sk}, Adhyāya {adh}) verse {raw_v_num}")

    print(f"Validation:")
    print(f"  Total verses: {total_verses}")
    print(f"  Drafted 143 verses: {draft_143_verses}")
    print(f"  Hydrated Gita Press verses: {hydrated_verses}")
    print(f"  Sum: {draft_143_verses + hydrated_verses} == {total_verses}: {draft_143_verses + hydrated_verses == total_verses}")

    # Write out updated devibhagavat.json
    print(f'Writing updated {json_path}...')
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(db, f, ensure_ascii=False, indent=2)

    print('Successfully hydrated devibhagavat.json with 100% complete Hindi!')

if __name__ == '__main__':
    main()
