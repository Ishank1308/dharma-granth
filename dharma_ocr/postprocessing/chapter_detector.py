"""
Scripture Chapter Boundary and Hierarchy Detector.
Identifies अध्याय, स्कन्ध, पर्व, सर्ग, काण्ड, खण्ड, प्रकरण, and colophons across multi-page scriptures.
"""

import re
from typing import Optional, Tuple, List, Dict
from dharma_ocr.core.schemas import ExtractedChapter
from dharma_ocr.postprocessing.devanagari_utils import devanagari_to_int
from dharma_ocr.core.logger import get_logger

logger = get_logger()

# Ordinal Sanskrit chapter title mappings
SANSKRIT_ORDINALS: Dict[str, int] = {
    "प्रथम": 1, "प्रथमो": 1,
    "द्वितीय": 2, "द्वितीयो": 2,
    "तृतीय": 3, "तृतीयो": 3,
    "चतुर्थ": 4, "चतुर्थो": 4,
    "पञ्चम": 5, "पञ्चमो": 5, "पंचम": 5, "पंचमो": 5,
    "षष्ठ": 6, "षष्ठो": 6,
    "सप्तम": 7, "सप्तमो": 7,
    "अष्टम": 8, "अष्टमो": 8,
    "नवम": 9, "नवमो": 9,
    "दशम": 10, "दशमो": 10,
    "एकादश": 11, "एकादशो": 11,
    "द्वादश": 12, "द्वादशो": 12,
    "त्रयोदश": 13, "त्रयोदशो": 13,
    "चतुर्दश": 14, "चतुर्दशो": 14,
    "पञ्चदश": 15, "पञ्चदशो": 15,
    "षोडश": 16, "षोडशो": 16,
    "सप्तदश": 17, "सप्तदशो": 17,
    "अष्टादश": 18, "अष्टादशो": 18,
    "एकोनविंश": 19, "विंश": 20
}


class ChapterDetector:
    """
    Detects scripture division markers, hierarchies, and concluding colophons.
    """

    def __init__(self, hierarchies: Optional[List[str]] = None):
        self.hierarchies = hierarchies or [
            "अध्याय", "स्कन्ध", "स्कंध", "पर्व", "सर्ग", "काण्ड", "खण्ड", "प्रकरण", "वल्ली", "सूक्त", "Chapter"
        ]

    def detect_chapter_header(self, line: str) -> Optional[Tuple[int, str, str]]:
        """
        Tests if a line contains a chapter header.
        Returns: (chapter_number, title_clean, hierarchy_type) or None.
        """
        clean = line.strip()
        if len(clean) > 80:  # Headings are concise
            return None

        # Check each hierarchy keyword
        for h_type in self.hierarchies:
            # Pattern 1: e.g. "अध्याय १", "अध्याय-२", "Chapter 5"
            match_num = re.search(rf'{h_type}\s*[-:—]?\s*([०-९\d]+)', clean, re.IGNORECASE)
            if match_num:
                num = devanagari_to_int(match_num.group(1))
                return (num if num > 0 else 1, clean, h_type)

            # Pattern 2: Sanskrit ordinal heading, e.g. "॥ प्रथमोऽध्यायः ॥" or "प्रथमोऽध्यायः"
            for ord_str, num_val in SANSKRIT_ORDINALS.items():
                if ord_str in clean and (h_type in clean or ("ध्याय" in clean and h_type == "अध्याय")):
                    return (num_val, clean, h_type)

        return None

    def detect_colophon(self, line: str) -> Optional[str]:
        """
        Detects concluding chapter colophon (पुष्पिका):
        e.g., "इति श्रीमहाभारते शतसहस्रिकायां संहितायां ... समाप्तः"
        """
        clean = line.strip()
        colophon_regex = r'(?:इति\s+.*(?:समाप्तः|समाप्तम्|सम्पूर्णम्|पूर्णम्)|पुष्पिका)'
        if re.search(colophon_regex, clean):
            return clean
        return None

    def build_chapters(
        self,
        page_records: list,
        total_pages: int
    ) -> List[ExtractedChapter]:
        """
        Assembles continuous page records into coherent chapters with page ranges.
        """
        chapters: List[ExtractedChapter] = []
        current_ch: Optional[ExtractedChapter] = None

        for record in page_records:
            page_num = record.page_number

            # Check if this page initiated a new chapter
            if record.detected_chapter_num is not None:
                # Finalize previous chapter
                if current_ch:
                    current_ch.page_end = page_num - 1
                    chapters.append(current_ch)

                # Start new chapter
                title = record.detected_chapter_title or f"अध्याय {record.detected_chapter_num}"
                current_ch = ExtractedChapter(
                    chapter_number=record.detected_chapter_num,
                    title=title,
                    title_sanskrit=record.detected_chapter_title,
                    hierarchy_type="अध्याय",
                    page_start=page_num,
                    page_end=page_num,
                    verses=[]
                )

            # Append verses from this page into current chapter
            if current_ch and record.verses_on_page:
                current_ch.verses.extend(record.verses_on_page)

        # Finalize last chapter
        if current_ch:
            current_ch.page_end = total_pages
            chapters.append(current_ch)

        return chapters
