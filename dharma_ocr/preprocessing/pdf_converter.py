"""
High-Resolution PDF to Image Rasterization Engine.
Converts PDF scriptures to 600 DPI PNG images using PyMuPDF (fitz) or pdf2image.
"""

import os
from pathlib import Path
from typing import Optional, List, Generator
from PIL import Image
from dharma_ocr.core.logger import get_logger

logger = get_logger()


class PDFConverter:
    """
    Renders PDF pages to crisp 600 DPI PNGs required for Vedic & Devanagari OCR.
    Operates in streaming fashion to handle 100 to 5000+ page scriptures without RAM exhaustion.
    """

    def __init__(self, dpi: int = 600, output_dir: Optional[Path] = None):
        self.dpi = dpi
        self.output_dir = Path(output_dir) if output_dir else Path("./ocr_workspace/extracted_images")
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def get_page_count(self, pdf_path: str) -> int:
        """Determines total number of pages in PDF document."""
        try:
            try:
                import pymupdf as fitz
            except ImportError:
                import fitz
            doc = fitz.open(pdf_path)
            count = len(doc)
            doc.close()
            return count
        except ImportError:
            try:
                from pypdf import PdfReader
                reader = PdfReader(pdf_path)
                return len(reader.pages)
            except Exception as e:
                logger.error(f"Failed to read page count from {pdf_path}: {e}")
                return 0

    def render_page(self, pdf_path: str, page_number: int, force: bool = False) -> Path:
        """
        Renders a single page (1-indexed) to PNG.
        Returns path to the generated image.
        """
        pdf_slug = Path(pdf_path).stem
        out_file = self.output_dir / f"{pdf_slug}_page_{page_number:05d}.png"
        if out_file.exists() and not force:
            return out_file

        # Primary: PyMuPDF (fast C-native rendering)
        try:
            try:
                import pymupdf as fitz
            except ImportError:
                import fitz
            doc = fitz.open(pdf_path)
            page_idx = page_number - 1
            if page_idx < 0 or page_idx >= len(doc):
                raise IndexError(f"Page {page_number} is out of bounds (total: {len(doc)})")

            page = doc[page_idx]
            # Standard PDF resolution is 72 DPI. Zoom factor = dpi / 72.0
            zoom = self.dpi / 72.0
            matrix = fitz.Matrix(zoom, zoom)
            pix = page.get_pixmap(matrix=matrix, alpha=False)
            pix.save(str(out_file))
            doc.close()
            return out_file
        except ImportError:
            logger.warning("PyMuPDF not installed, attempting fallback to pdf2image.")

        # Secondary fallback: pdf2image
        try:
            from pdf2image import convert_from_path
            images = convert_from_path(
                pdf_path,
                dpi=self.dpi,
                first_page=page_number,
                last_page=page_number,
                fmt="png"
            )
            if images:
                images[0].save(str(out_file), "PNG")
                return out_file
            raise RuntimeError(f"pdf2image returned 0 images for page {page_number}")
        except Exception as e:
            logger.error(f"Failed to render page {page_number} via pdf2image: {e}")
            raise
