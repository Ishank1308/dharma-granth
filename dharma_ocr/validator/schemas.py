"""
Pydantic v2 Data Models for Scripture Validation, Text Restoration, and Quality Reporting.
Complies with industrial scripture digitization specifications.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class PageAuditResult(BaseModel):
    """Page-level OCR quality and completeness assessment (Step 1)."""
    page: int
    ocr_confidence: float = Field(ge=0.0, le=1.0)
    verse_completeness: float = Field(ge=0.0, le=1.0)
    text_completeness: float = Field(ge=0.0, le=1.0, default=1.0)
    chapter_integrity: float = Field(ge=0.0, le=1.0)
    status: str = Field(default="VALID", description="'VALID', 'NEEDS_REPAIR', or 'REPROCESSED'")
    issues_found: List[str] = Field(default_factory=list)


class VerseAudit(BaseModel):
    """Detailed audit trail for individual verses."""
    verse_num: int
    chapter_num: int = 1
    source_page: int
    raw_text: str
    restored_text: str
    status: str = Field(default="verified", description="'verified', 'reconstructed', 'stitched'")
    confidence: float = Field(ge=0.0, le=1.0, default=0.95)
    corrections_applied: List[str] = Field(default_factory=list)


class ChapterAudit(BaseModel):
    """Chapter structure and sequence audit (Step 9)."""
    chapter_num: int
    title: str = ""
    start_page: int
    end_page: Optional[int] = None
    expected_verses: Optional[int] = None
    actual_verses: int = 0
    missing_verse_numbers: List[int] = Field(default_factory=list)
    status: str = "VALID"


class VerifiedVerse(BaseModel):
    """Structured publication-grade verse record."""
    verse: int
    text: str
    status: str = "verified"
    confidence: float = Field(ge=0.0, le=1.0, default=0.98)
    hindi: Optional[str] = None
    source_page: Optional[int] = None
    corrections: List[str] = Field(default_factory=list)


class VerifiedChapter(BaseModel):
    """Structured publication-grade chapter record."""
    chapter: int
    title: Optional[str] = None
    start_page: Optional[int] = None
    verses: List[VerifiedVerse] = Field(default_factory=list)


class VerifiedScriptureDocument(BaseModel):
    """Master publication-grade scripture schema (Step 14)."""
    book: str
    total_pages: int
    total_chapters: int
    total_verses: int
    integrity_score: float
    chapters: List[VerifiedChapter] = Field(default_factory=list)


class ValidationQualityReport(BaseModel):
    """Comprehensive 15-Step Quality and Audit Report (Step 15)."""
    book_title: str
    total_pages: int
    total_chapters: int
    total_verses: int
    missing_verses_found: int = 0
    missing_verses_restored: int = 0
    ocr_errors_corrected: int = 0
    sanskrit_corrections_applied: int = 0
    hindi_corrections_applied: int = 0
    duplicate_verses_removed: int = 0
    pages_reprocessed: int = 0
    average_ocr_confidence: float = 0.0
    final_scripture_integrity_score: float = 0.0
    reprocessed_pages: List[Dict[str, Any]] = Field(default_factory=list)
    page_audits: List[PageAuditResult] = Field(default_factory=list)
    chapter_audits: List[ChapterAudit] = Field(default_factory=list)
