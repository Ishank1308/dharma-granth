"""
Searchable PDF Generator.
Preserves scanned page visual fidelity while embedding searchable Unicode text layers
via OCRmyPDF or PyMuPDF invisible text layer injection.
"""

import subprocess
import shutil
from pathlib import Path
from typing import List, Optional
from dharma_ocr.core.schemas import PageRecord
from dharma_ocr.core.logger import get_logger

logger = get_logger()


class SearchablePDFGenerator:
    """
    Generates standards-compliant searchable PDF/A files with recognized Devanagari text.
    """

    def __init__(self, tesseract_path: Optional[str] = None):
        self.tesseract_path = tesseract_path

    def generate(
        self,
        source_pdf: Path,
        page_records: List[PageRecord],
        output_pdf: Path,
        languages: str = "san+hin"
    ) -> Path:
        """
        Creates a searchable PDF.
        Attempts OCRmyPDF first; falls back to PyMuPDF text-layer embedding.
        """
        output_pdf = Path(output_pdf)
        output_pdf.parent.mkdir(parents=True, exist_ok=True)

        # Method 1: OCRmyPDF (Industry gold standard for PDF/A)
        if shutil.which("ocrmypdf"):
            try:
                logger.info("Generating searchable PDF via [bold green]OCRmyPDF[/bold green]...")
                cmd = [
                    "ocrmypdf",
                    "--skip-text",             # Do not overwrite pages that already have text
                    "--deskew",
                    "--clean",
                    "-l", languages,
                    "--output-type", "pdfa",
                    str(source_pdf),
                    str(output_pdf)
                ]
                res = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
                if res.returncode == 0 and output_pdf.exists():
                    logger.info(f"Searchable PDF generated: {output_pdf}")
                    return output_pdf
                logger.warning(f"OCRmyPDF exited with code {res.returncode}: {res.stderr}")
            except Exception as e:
                logger.warning(f"OCRmyPDF execution failed ({e}), falling back to PyMuPDF overlay.")

        # Method 2: Fallback PyMuPDF Text Layer Overlay
        return self._generate_pymupdf_overlay(source_pdf, page_records, output_pdf)

    def _generate_pymupdf_overlay(
        self,
        source_pdf: Path,
        page_records: List[PageRecord],
        output_pdf: Path
    ) -> Path:
        """
        Injects recognized Unicode text into an invisible layer on each page using PyMuPDF.
        Retains original page aesthetics while allowing text selection and searching.
        """
        try:
            try:
                import pymupdf as fitz
            except ImportError:
                import fitz
            doc = fitz.open(str(source_pdf))
            record_map = {r.page_number: r for r in page_records}

            for page_idx, page in enumerate(doc):
                page_num = page_idx + 1
                record = record_map.get(page_num)
                if not record or not record.normalized_text:
                    continue

                # Insert recognized Unicode text into an invisible overlay rect at page top
                rect = page.rect
                text_to_embed = record.normalized_text

                # Insert textbox with render_mode 3 (invisible text: searchable & selectable)
                try:
                    page.insert_textbox(
                        rect,
                        text_to_embed,
                        fontsize=10,
                        render_mode=3  # 3 = invisible text
                    )
                except Exception as e:
                    logger.debug(f"Could not insert invisible text on page {page_num}: {e}")

            doc.save(str(output_pdf), deflate=True)
            doc.close()
            logger.info(f"Searchable PDF created via PyMuPDF invisible text layer: {output_pdf}")
            return output_pdf
        except Exception as e:
            logger.error(f"Failed to generate searchable PDF overlay: {e}")
            # If all fails, copy original PDF to destination
            shutil.copy(str(source_pdf), str(output_pdf))
            return output_pdf
