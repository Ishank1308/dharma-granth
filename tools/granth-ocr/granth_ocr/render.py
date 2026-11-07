"""Rasterize one PDF page. PyMuPDF is offline and does not use Poppler."""

from __future__ import annotations

from pathlib import Path


def render_page(pdf_path: str, page_number: int, dpi: int, dest: Path) -> None:
    import pymupdf

    dest.parent.mkdir(parents=True, exist_ok=True)
    doc = pymupdf.open(pdf_path)
    try:
        if doc.is_encrypted and not doc.authenticate(""):
            raise RuntimeError("Password-protected PDFs are not opened.")
        if page_number < 1 or page_number > doc.page_count:
            raise RuntimeError(f"Page {page_number} is outside 1..{doc.page_count}.")
        page = doc[page_number - 1]
        pix = page.get_pixmap(dpi=dpi, colorspace=pymupdf.csGRAY, alpha=False)
        pix.save(str(dest))
    finally:
        doc.close()


def page_count(pdf_path: str) -> int:
    import pymupdf

    doc = pymupdf.open(pdf_path)
    try:
        return doc.page_count
    finally:
        doc.close()
