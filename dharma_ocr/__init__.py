"""
Dharma Granth Industrial-Grade 100% Offline Scripture OCR Platform.
Digitization and text extraction pipeline for multi-gigabyte Sanskrit and Hindi scripture PDFs.
"""

from dharma_ocr.pipeline import DharmaOCRPipeline
from dharma_ocr.core.config import PipelineConfig
from dharma_ocr.core.schemas import BookScriptureDocument, ExtractedVerse, ExtractedChapter
from dharma_ocr.preprocessing.preprocessor import ImagePreprocessor
from dharma_ocr.engines.engine_manager import OCREngineManager

__version__ = "2.0.0"
__all__ = [
    "DharmaOCRPipeline",
    "PipelineConfig",
    "BookScriptureDocument",
    "ExtractedVerse",
    "ExtractedChapter",
    "ImagePreprocessor",
    "OCREngineManager"
]
