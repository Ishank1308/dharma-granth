"""
Confidence Scoring & Quality Assessment Framework.
Combines raw engine confidence with Devanagari philological validation metrics.
"""

import time
from typing import List, Dict, Set, Optional
from dharma_ocr.core.schemas import PageRecord, OCRQualityReport


class ScriptureQualityScorer:
    """
    Computes rigorous confidence metrics for Sanskrit and Hindi OCR outputs.
    Evaluates engine confidence, Devanagari character densities, and lexical hit ratios.
    """

    def __init__(self, domain_lexicon: Optional[Set[str]] = None):
        self.domain_lexicon = domain_lexicon or set()

    def evaluate_page_text_quality(self, text: str, engine_confidence: float) -> float:
        """
        Calculates composite confidence score [0.0 - 100.0] by balancing:
        - 50% Engine raw confidence
        - 25% Devanagari character density (filters out noise/scanning artifacts)
        - 15% Lexical dictionary hit ratio
        - 10% Danda & punctuation cadence sanity
        """
        clean_text = text.strip()
        if not clean_text:
            return 0.0

        total_chars = len(clean_text)
        devanagari_chars = sum(1 for ch in clean_text if '\u0900' <= ch <= '\u097F')
        dev_ratio = min(1.0, (devanagari_chars / total_chars) * 1.2) if total_chars > 0 else 0.0

        # Lexicon check
        words = clean_text.split()
        if words and self.domain_lexicon:
            hits = sum(1 for w in words if w in self.domain_lexicon)
            lex_ratio = min(1.0, hits / max(1, len(words)))
        else:
            lex_ratio = 0.5  # Neutral default if lexicon is empty

        # Danda cadence presence
        has_danda = 1.0 if ('।' in clean_text or '॥' in clean_text) else 0.4

        # Composite score
        composite = (
            (engine_confidence * 0.50) +
            (dev_ratio * 100.0 * 0.25) +
            (lex_ratio * 100.0 * 0.15) +
            (has_danda * 100.0 * 0.10)
        )
        return round(max(0.0, min(100.0, composite)), 2)

    def generate_book_quality_report(
        self,
        records: List[PageRecord],
        total_time_sec: float,
        detected_chapters_count: int,
        detected_verses_count: int
    ) -> OCRQualityReport:
        """Generates comprehensive book-level statistics."""
        if not records:
            return OCRQualityReport(
                total_pages=0,
                processed_pages=0,
                average_confidence=0.0,
                total_processing_time_sec=total_time_sec,
                average_speed_sec_per_page=0.0,
                detected_chapters_count=0,
                detected_verses_count=0,
                estimated_text_accuracy_percent=0.0
            )

        total_pages = len(records)
        conf_sum = 0.0
        histogram = {"90-100": 0, "75-89": 0, "50-74": 0, "below-50": 0}
        low_confidence_pages = []
        engine_dist = {"tesseract": 0, "surya": 0}

        for r in records:
            conf = r.ocr_result.confidence if r.ocr_result else 0.0
            conf_sum += conf

            if conf >= 90.0:
                histogram["90-100"] += 1
            elif conf >= 75.0:
                histogram["75-89"] += 1
            elif conf >= 50.0:
                histogram["50-74"] += 1
            else:
                histogram["below-50"] += 1
                low_confidence_pages.append(r.page_number)

            eng = r.ocr_result.engine_name.lower() if r.ocr_result else "unknown"
            engine_dist[eng] = engine_dist.get(eng, 0) + 1

        avg_conf = round(conf_sum / total_pages, 2)
        avg_speed = round(total_time_sec / total_pages, 2) if total_pages > 0 else 0.0

        # Accuracy estimate based on confidence and low-confidence outlier penalty
        penalty = (len(low_confidence_pages) / total_pages) * 5.0
        estimated_accuracy = round(max(0.0, min(100.0, avg_conf - penalty)), 2)

        return OCRQualityReport(
            total_pages=total_pages,
            processed_pages=total_pages,
            average_confidence=avg_conf,
            confidence_histogram=histogram,
            low_confidence_pages=low_confidence_pages,
            engine_selection_distribution=engine_dist,
            total_processing_time_sec=round(total_time_sec, 2),
            average_speed_sec_per_page=avg_speed,
            detected_chapters_count=detected_chapters_count,
            detected_verses_count=detected_verses_count,
            estimated_text_accuracy_percent=estimated_accuracy
        )
