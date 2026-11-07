"""OCR Engine modules for Dharma Granth OCR."""
from dharma_ocr.engines.base import BaseOCREngine
from dharma_ocr.engines.tesseract_engine import TesseractEngine
from dharma_ocr.engines.surya_engine import SuryaEngine
from dharma_ocr.engines.engine_manager import OCREngineManager

__all__ = ["BaseOCREngine", "TesseractEngine", "SuryaEngine", "OCREngineManager"]
