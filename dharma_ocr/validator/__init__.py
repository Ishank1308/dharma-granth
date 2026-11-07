"""
Dharma Granth Scripture Validation, Sanskrit Text Restoration, and Digitization Audit Platform.
Implements the 15-step industrial validation pipeline for Sanskrit & Hindi Devanagari scriptures.
"""

from dharma_ocr.validator.schemas import (
    PageAuditResult,
    VerseAudit,
    ChapterAudit,
    ValidationQualityReport,
    VerifiedScriptureDocument,
    VerifiedChapter,
    VerifiedVerse,
)
from dharma_ocr.validator.repair_pipeline import ScriptureValidationPipeline

__all__ = [
    "PageAuditResult",
    "VerseAudit",
    "ChapterAudit",
    "ValidationQualityReport",
    "VerifiedScriptureDocument",
    "VerifiedChapter",
    "VerifiedVerse",
    "ScriptureValidationPipeline",
]
