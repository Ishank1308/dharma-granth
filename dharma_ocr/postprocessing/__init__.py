"""Post-processing and extraction modules for Dharma Granth OCR."""
from dharma_ocr.postprocessing.devanagari_utils import (
    canonicalize_devanagari,
    devanagari_to_int,
    decode_pua_ligatures,
    normalize_matras_and_reph,
    normalize_dandas_and_punctuation
)
from dharma_ocr.postprocessing.sanskrit_corrector import SanskritCorrector
from dharma_ocr.postprocessing.hindi_corrector import HindiCorrector
from dharma_ocr.postprocessing.chapter_detector import ChapterDetector
from dharma_ocr.postprocessing.verse_extractor import VerseExtractor

__all__ = [
    "canonicalize_devanagari",
    "devanagari_to_int",
    "decode_pua_ligatures",
    "normalize_matras_and_reph",
    "normalize_dandas_and_punctuation",
    "SanskritCorrector",
    "HindiCorrector",
    "ChapterDetector",
    "VerseExtractor"
]
