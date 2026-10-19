"""
Step 1: OCR Quality Audit Engine.
Evaluates page-level OCR confidence, text completeness, verse completeness, and chapter integrity.
"""

from typing import Dict, Any, List, Optional
import re
from dharma_ocr.validator.schemas import PageAuditResult


class PageQualityAuditor:
    """
    Audits page-level OCR completeness and integrity.
    Identifies broken lines, truncated verses, and low-confidence scans.
    """

    def __init__(self, min_confidence: float = 0.65):
        self.min_confidence = min_confidence

    def audit_page(
        self,
        page_num: int,
        page_record: Dict[str, Any],
        chapter_ctx: Optional[int] = None
    ) -> PageAuditResult:
        """
        Calculates multi-dimensional quality scores for a given OCR page record.
        """
        ocr_res = page_record.get("ocr_result", {})
        raw_conf = float(ocr_res.get("confidence", 0.0))
        # Normalize confidence to [0.0, 1.0]
        ocr_confidence = round(raw_conf / 100.0 if raw_conf > 1.0 else raw_conf, 2)

        text = page_record.get("normalized_text", "") or ocr_res.get("raw_text", "")
        lines = [l.strip() for l in text.splitlines() if l.strip()]

        issues: List[str] = []

        # 1. Text completeness assessment
        # Check for truncated lines (e.g. trailing hyphens, orphaned matras, broken words)
        text_completeness = 1.0
        if not lines:
            text_completeness = 0.0
            issues.append("Page has 0 recognized text lines")
        else:
            truncated_lines = 0
            for line in lines:
                # Ending with orphan hyphen, orphaned virama, or broken ligature
                if line.endswith(("-", "्", "ि")):
                    truncated_lines += 1
            if truncated_lines > 0:
                deduction = min(0.4, (truncated_lines / len(lines)) * 0.5)
                text_completeness = round(max(0.2, 1.0 - deduction), 2)
                issues.append(f"{truncated_lines} line(s) end with truncated hyphens or viramas")

        # 2. Verse completeness assessment
        # Check presence of canonical danda markers
        verse_completeness = 1.0
        danda_double = len(re.findall(r'॥', text))
        danda_single = len(re.findall(r'।', text))
        has_cadence = (danda_double + danda_single) > 0

        verses = page_record.get("verses_on_page", [])
        if verses:
            complete_verses = 0
            for v in verses:
                sanskrit = v.get("sanskrit", "") if isinstance(v, dict) else getattr(v, "sanskrit", "")
                if "॥" in sanskrit:
                    complete_verses += 1
            verse_completeness = round(complete_verses / len(verses), 2) if verses else 1.0
            if verse_completeness < 0.8:
                issues.append(f"Only {complete_verses}/{len(verses)} verses have canonical double danda (॥)")
        elif not has_cadence and len(text) > 80:
            verse_completeness = 0.70
            issues.append("Running Devanagari text contains no danda cadence markers")

        # 3. Chapter integrity assessment
        chapter_integrity = 1.0
        ch_title = page_record.get("detected_chapter_title")
        ch_num = page_record.get("detected_chapter_num")
        if ch_title:
            if not ch_num:
                chapter_integrity = 0.85
                issues.append(f"Chapter title '{ch_title}' found without parsed chapter number")
            else:
                chapter_integrity = 1.0

        # Status determination
        if ocr_confidence < self.min_confidence or text_completeness < 0.60:
            status = "NEEDS_REPAIR"
        else:
            status = "VALID"

        return PageAuditResult(
            page=page_num,
            ocr_confidence=ocr_confidence,
            text_completeness=text_completeness,
            verse_completeness=verse_completeness,
            chapter_integrity=chapter_integrity,
            status=status,
            issues_found=issues
        )
