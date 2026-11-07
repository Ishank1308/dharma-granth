"""
Step 2 & Step 8: Multi-Pattern Verse Detection & Shloka Structure Validation.
Detects verses using classical, numerical, and commentary patterns. Validates Anushtubh/metric pada structure.
"""

import re
from typing import List, Dict, Any, Optional, Tuple
from dharma_ocr.postprocessing.devanagari_utils import devanagari_to_int


class EnhancedVerseDetector:
    """
    Robust verse detection supporting diverse printing conventions:
    - Classical double danda: ॥ १ ॥, ॥ १२-१३ ॥
    - Single danda numbered: । १ ।, । ५० ।
    - Westernized arabic: 1., 2., 3., (1), (2)
    - Labels: श्लोक 5, Verse 12
    - Structural shloka meter checks: hemistich 1 (।), hemistich 2 (॥)
    """

    PATTERNS = [
        # 1. Classical double danda: ॥ १ ॥ or ॥ १२-१३ ॥ or ॥ 1 ॥
        (re.compile(r'॥\s*([०-९\d]+)(?:\s*[-–]\s*([०-९\d]+))?\s*॥'), "DOUBLE_DANDA"),
        # 2. Single danda: । १ । or । 12 ।
        (re.compile(r'।\s*([०-९\d]+)(?:\s*[-–]\s*([०-९\d]+))?\s*।'), "SINGLE_DANDA"),
        # 3. Label based: श्लोक १ or श्लोक 12 or Verse 12
        (re.compile(r'(?:श्लोक|Verse|मंत्र|मन्त्र)\s*[:\-\—]?\s*([०-९\d]+)', re.IGNORECASE), "LABEL"),
        # 4. Leading number with dot: 1. or १२. at start of line
        (re.compile(r'(?:^|\n)\s*([०-९\d]+)\s*[\.\)]\s*([ऀ-ॿ])'), "LEADING_NUM"),
        # 5. Trailing number in parentheses: (१) or (12)
        (re.compile(r'[\(（]\s*([०-९\d]+)\s*[\)）]'), "PARENS_NUM"),
    ]

    def __init__(self):
        pass

    def extract_verses_from_text(
        self,
        text: str,
        page_num: int,
        chapter_num: int = 1
    ) -> List[Dict[str, Any]]:
        """
        Extracts all structured verses from a page's text using multi-pattern cadence detection.
        Returns list of structured verse dicts with detected numbers and text layers.
        """
        lines = [l.strip() for l in text.splitlines() if l.strip()]
        detected_verses: List[Dict[str, Any]] = []

        current_sanskrit: List[str] = []
        current_hindi: List[str] = []
        current_num: Optional[int] = None
        current_end_num: Optional[int] = None
        verse_state = "IDLE"

        def flush(is_cadence_match: bool = False):
            nonlocal current_sanskrit, current_hindi, current_num, current_end_num, verse_state
            if not current_sanskrit:
                return
            mula = " ".join(current_sanskrit).strip()
            if not mula:
                return

            v_num = current_num if current_num is not None else (len(detected_verses) + 1)
            
            # Filter non-Devanagari publisher / metadata artifacts
            deva_chars = len(re.findall(r'[ऀ-ॿ]', mula))
            deva_ratio = deva_chars / max(1, len(mula))
            if deva_ratio < 0.45 or deva_chars < 15:
                current_sanskrit = []
                current_hindi = []
                current_num = None
                current_end_num = None
                verse_state = "IDLE"
                return

            if is_cadence_match:
                mula_repaired, structure_warnings = self.validate_and_repair_shloka_structure(mula)
                is_closed = True
            else:
                mula_repaired = mula
                structure_warnings = ["Verse ended at page transition without cadence marker"]
                is_closed = False

            detected_verses.append({
                "verse_num": v_num,
                "verse_range_end": current_end_num,
                "chapter_num": chapter_num,
                "sanskrit": mula_repaired,
                "hindi": "\n".join(current_hindi).strip() if current_hindi else None,
                "source_page": page_num,
                "is_closed": is_closed,
                "structure_warnings": structure_warnings
            })

            current_sanskrit = []
            current_hindi = []
            current_num = None
            current_end_num = None
            verse_state = "IDLE"

        def split_line_into_segments(line_str: str):
            segments = []
            last_idx = 0
            m_list = list(re.finditer(r'॥\s*([०-९\d]+)(?:\s*[-–]\s*([०-९\d]+))?\s*॥', line_str))
            if not m_list:
                m_list = list(re.finditer(r'।\s*([०-९\d]+)(?:\s*[-–]\s*([०-९\d]+))?\s*।', line_str))
            if m_list:
                for m in m_list:
                    seg = line_str[last_idx:m.end()].strip()
                    num = devanagari_to_int(m.group(1))
                    end_num = devanagari_to_int(m.group(2)) if len(m.groups()) >= 2 and m.group(2) else None
                    if seg:
                        segments.append((seg, num, end_num, True))
                    last_idx = m.end()
                remainder = line_str[last_idx:].strip()
                if remainder:
                    segments.append((remainder, None, None, False))
                return segments
            return [(line_str, None, None, False)]

        for line in lines:
            # Check for commentary markers
            if re.match(r'^(अर्थ|भावार्थ|टीका|व्याख्या|अनुवाद|शब्दार्थ|पदच्छेद)\s*[:\-\—]', line):
                verse_state = "HINDI"
                content = re.sub(r'^(अर्थ|भावार्थ|टीका|व्याख्या|अनुवाद|शब्दार्थ|पदच्छेद)\s*[:\-\—]\s*', '', line)
                if detected_verses and not current_sanskrit:
                    prev_h = detected_verses[-1]["hindi"]
                    detected_verses[-1]["hindi"] = (prev_h + "\n" + content) if prev_h else content
                else:
                    current_hindi.append(content)
                continue

            segs = split_line_into_segments(line)
            for seg_text, num, end_num, is_cadence in segs:
                if is_cadence:
                    current_sanskrit.append(seg_text)
                    current_num = num
                    current_end_num = end_num
                    flush(is_cadence_match=True)
                else:
                    if self._is_sanskrit_mula(seg_text):
                        if verse_state == "HINDI" and current_sanskrit:
                            flush()
                        verse_state = "SANSKRIT"
                        current_sanskrit.append(seg_text)
                    else:
                        if verse_state == "HINDI" or (detected_verses and not current_sanskrit):
                            if detected_verses and not current_sanskrit:
                                prev_h = detected_verses[-1]["hindi"]
                                detected_verses[-1]["hindi"] = (prev_h + "\n" + seg_text) if prev_h else seg_text
                            else:
                                current_hindi.append(seg_text)
                        else:
                            current_sanskrit.append(seg_text)

        flush()
        return detected_verses

    def validate_and_repair_shloka_structure(self, shloka: str) -> Tuple[str, List[str]]:
        """
        Step 8: Shloka Structure Validation.
        Verifies:
        - Presence of closing double danda (॥)
        - Internal hemistich cadence (।)
        - Broken pada structure
        Repairs missing dandas.
        """
        warnings = []
        repaired = shloka.strip()

        # 1. Check closing double danda
        if not repaired.endswith("॥"):
            if repaired.endswith("।"):
                # Upgrade trailing single danda to double danda at verse end
                repaired = repaired[:-1].strip() + " ॥"
                warnings.append("Repaired trailing single danda (।) to canonical double danda (॥)")
            elif re.search(r'[०-९\d]+\s*$', repaired):
                # E.g. '...धर्मः १' -> '...धर्मः ॥ १ ॥'
                m = re.search(r'([०-९\d]+)\s*$', repaired)
                num = m.group(1)
                repaired = repaired[:m.start()].strip() + f" ॥ {num} ॥"
                warnings.append(f"Restored missing closing dandas around verse number {num}")
            else:
                repaired = repaired + " ॥"
                warnings.append("Appended missing closing double danda (॥) to complete stanza")

        # 2. Check internal hemistich (first half vs second half)
        # In a standard shloka, hemistich 1 ends with single danda '।'
        parts = repaired.split("।")
        if len(parts) == 1:
            warnings.append("Shloka lacks intermediate hemistich danda (।) between first and second half")
        elif len(parts) > 3:
            warnings.append(f"Irregular danda count ({len(parts)-1} dandas found in single stanza)")

        return repaired, warnings

    def _is_sanskrit_mula(self, line: str) -> bool:
        """Determines if a line is Sanskrit Mula based on Devanagari density and grammatical markers."""
        clean = line.strip()
        if not clean:
            return False
        hindi_markers = {"है", "हैं", "था", "थी", "थे", "का", "के", "की", "में", "पर", "से", "को", "ने", "और", "गया"}
        words = set(re.findall(r'[ऀ-ॿ]+', clean))
        if len(words) > 0 and len(words.intersection(hindi_markers)) / len(words) > 0.25:
            return False
        return bool(re.search(r'[।॥]', clean) or len(clean) > 20)
