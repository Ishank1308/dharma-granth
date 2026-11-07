"""
Step 3 & Step 9: Sequential Integrity, Missing Verse Detection, and Chapter Validation.
Identifies gaps in verse sequences (e.g. 1, 2, 3, 5 -> verse 4 missing), missing chapters, and sequencing errors.
"""

from typing import List, Dict, Any, Tuple, Set, Optional
from dharma_ocr.validator.schemas import ChapterAudit


class SequenceAnalyzer:
    """
    Validates sequential continuity of chapters and verses across the scripture document.
    """

    def __init__(self):
        pass

    def analyze_verse_sequence(
        self,
        verses: List[Dict[str, Any]]
    ) -> Tuple[List[int], Dict[str, Any]]:
        """
        Step 3: Missing Verse Detection.
        Analyzes verse numbering sequence within a chapter.
        Returns: (missing_numbers, sequence_summary)
        """
        if not verses:
            return [], {"expected_count": 0, "found_count": 0, "continuity_ratio": 0.0}

        found_numbers: List[int] = []
        for v in verses:
            num = v.get("verse_num")
            if num is not None:
                found_numbers.append(num)
                # If there is a range (e.g. 12-13), include the end number too
                end_num = v.get("verse_range_end")
                if end_num and end_num > num:
                    found_numbers.extend(range(num + 1, end_num + 1))

        if not found_numbers:
            return [], {"expected_count": len(verses), "found_count": len(verses), "continuity_ratio": 1.0}

        min_num = min(found_numbers)
        max_num = max(found_numbers)

        expected_set = set(range(min_num, max_num + 1))
        found_set = set(found_numbers)
        missing_numbers = sorted(list(expected_set - found_set))

        continuity_ratio = round(len(found_set) / len(expected_set), 4) if expected_set else 1.0

        summary = {
            "min_verse": min_num,
            "max_verse": max_num,
            "expected_count": len(expected_set),
            "found_count": len(found_set),
            "missing_count": len(missing_numbers),
            "continuity_ratio": continuity_ratio
        }

        return missing_numbers, summary

    def validate_chapter_sequence(
        self,
        chapters: List[Dict[str, Any]],
        total_pages: int
    ) -> Tuple[List[ChapterAudit], List[int]]:
        """
        Step 9: Chapter Validation.
        Validates chapter sequential ordering (1, 2, 3...) and reports start/end pages.
        Returns: (chapter_audits, missing_chapters)
        """
        audits: List[ChapterAudit] = []
        found_chapter_nums: List[int] = []

        for idx, ch in enumerate(chapters):
            ch_num = ch.get("chapter_num") or (idx + 1)
            title = ch.get("title", f"अध्याय {ch_num}")
            start_page = ch.get("start_page", 1)
            end_page = ch.get("end_page", total_pages)
            verses = ch.get("verses", [])

            missing_verses, summary = self.analyze_verse_sequence(verses)

            status = "VALID" if not missing_verses else "GAPS_DETECTED"

            audits.append(ChapterAudit(
                chapter_num=ch_num,
                title=title,
                start_page=start_page,
                end_page=end_page,
                expected_verses=summary["expected_count"],
                actual_verses=len(verses),
                missing_verse_numbers=missing_verses,
                status=status
            ))
            found_chapter_nums.append(ch_num)

        # Detect missing chapter numbers
        missing_chapters: List[int] = []
        if found_chapter_nums:
            max_ch = max(found_chapter_nums)
            missing_chapters = sorted(list(set(range(1, max_ch + 1)) - set(found_chapter_nums)))

        return audits, missing_chapters

    ORDINALS = {
        'पहला': 1, 'प्रथमो': 1, 'प्रथम': 1,
        'दूसरा': 2, 'द्वितीय': 2, 'द्वितीयो': 2,
        'तीसरा': 3, 'ततीयो': 3, 'तृतीय': 3, 'तृतीयो': 3,
        'चौथा': 4, 'चोथा': 4, 'चतुर्थ': 4, 'चतुर्थो': 4,
        'पाँचवाँ': 5, 'पांचवां': 5, 'पंचम': 5, 'पञ्चम': 5, 'पंचमो': 5, 'पञ्चमो': 5,
        'छठा': 6, 'षष्ठ': 6, 'षष्ठो': 6,
        'सातवाँ': 7, 'सातवां': 7, 'सप्तम': 7, 'सप्तमो': 7,
        'आठवाँ': 8, 'आठवां': 8, 'अष्टम': 8, 'अष्टमो': 8,
        'नवाँ': 9, 'नवां': 9, 'नवम': 9, 'नवमो': 9, 'नौवाँ': 9, 'नौवां': 9, 'नता': 9,
        'दसवाँ': 10, 'दसवां': 10, 'दशम': 10, 'दशमो': 10,
        'ग्यारहवाँ': 11, 'ग्यारहवां': 11, 'एकादश': 11, 'एकादशो': 11,
        'बारहवाँ': 12, 'बारहवां': 12, 'द्वादश': 12, 'द्वादशो': 12,
        'तेरहवाँ': 13, 'तेरहवां': 13, 'त्रयोदश': 13, 'त्रयोदशो': 13,
        'चौदहवाँ': 14, 'चौदहवां': 14, 'चतुर्दश': 14, 'चतुर्दशो': 14,
        'पन्द्रहवाँ': 15, 'पन्द्रहवां': 15, 'पंद्रहवाँ': 15, 'पंद्रहवां': 15, 'पंचदश': 15, 'पञ्चदश': 15,
        'सोलहवाँ': 16, 'सोलहवां': 16, 'षोडश': 16, 'षोडशो': 16
    }

    def detect_chapter_header(self, text: str, current_ch: int) -> Optional[Tuple[int, str]]:
        """
        Detects chapter title/number from text lines (Step 9).
        Supports:
        - Ordinals: 'पहला अध्याय', 'द्वितीयोऽध्यायः', 'चौथा अध्याय'
        - Numbered: 'अध्याय १', 'अध्याय 12'
        - Scripture section headings: स्कन्ध, पर्व, सर्ग, Chapter
        """
        import re
        from dharma_ocr.postprocessing.devanagari_utils import devanagari_to_int

        lines = [l.strip() for l in text.splitlines() if l.strip()]
        header_text = "\n".join(lines[:8])

        # 1. Ordinal patterns
        for word, val in self.ORDINALS.items():
            pattern = rf'(?:^|\n)\s*(?:[।॥\*\s]*)(?:{word}\s*(?:अध्याय|स्कन्ध|सर्ग|पर्व)|(?:अध्याय|स्कन्ध|सर्ग|पर्व)\s*[:\-\—]?\s*{word})'
            if re.search(pattern, header_text):
                return val, f"अध्याय {val}"

        # 2. Digit patterns: अध्याय १ or अध्याय 1
        m = re.search(r'(?:^|\n)\s*(?:अथ\s+)?(?:अध्याय|स्कन्ध|सर्ग|पर्व|Chapter)\s*[:\-\—]?\s*([०-९\d]+)', header_text, re.IGNORECASE)
        if m:
            val = devanagari_to_int(m.group(1))
            if val:
                return val, f"अध्याय {val}"

        # 3. Sanskrit colophon patterns: ...ऽध्यायः ॥ N ॥
        m_col = re.search(r'([०-९\w]+)ऽध्यायः\s*॥\s*([०-९\d]+)\s*॥', header_text)
        if m_col:
            val = devanagari_to_int(m_col.group(2))
            if val:
                return val, f"अध्याय {val}"

        return None

