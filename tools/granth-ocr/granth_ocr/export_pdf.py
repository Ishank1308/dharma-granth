"""Write a searchable PDF. The page image stays visible. Unicode sits in an invisible text layer.

Nirmala UI (Windows) or Noto Sans Devanagari (Linux) supplies the ToUnicode map.
Without one of those fonts the PDF is still written as images and the text
exports remain the searchable copy.
"""

from __future__ import annotations

from pathlib import Path


def devanagari_font() -> str | None:
    candidates = [
        Path(r"C:\Windows\Fonts\nirmala.ttf"),
        Path(r"C:\Windows\Fonts\Nirmala.ttf"),
        Path(r"C:\Windows\Fonts\mangal.ttf"),
        Path(r"C:\Windows\Fonts\kokila.ttf"),
        Path(r"C:\Windows\Fonts\aparaj.ttf"),
        Path("/usr/share/fonts/truetype/noto/NotoSansDevanagari-Regular.ttf"),
        Path("/usr/share/fonts/noto/NotoSansDevanagari-Regular.ttf"),
    ]
    for path in candidates:
        if path.exists():
            return str(path)
    return None


def write_searchable_pdf(pages: list[dict], dest: Path, dpi: int) -> str | None:
    """Returns a warning string when the text layer could not be embedded.

    `dpi` is the fallback when a page record does not store its own DPI.
    Word boxes are in that page's pixels, so mixed-DPI books stay aligned.
    """
    import pymupdf

    fontfile = devanagari_font()
    dest.parent.mkdir(parents=True, exist_ok=True)
    doc = pymupdf.open()
    warning = None
    font = None
    if fontfile:
        font = pymupdf.Font(fontfile=fontfile)
    else:
        warning = "No Devanagari font found. Searchable text layer was skipped."
    try:
        for page in pages:
            image = page.get("clean_image") or page.get("raw_image")
            if not image or not Path(image).exists():
                continue
            from PIL import Image

            with Image.open(image) as picture:
                width_px, height_px = picture.size
            page_dpi = int(page.get("dpi") or dpi)
            scale = 72 / page_dpi
            pdf_page = doc.new_page(width=width_px * scale, height=height_px * scale)
            pdf_page.insert_image(pdf_page.rect, filename=image)
            if font is None:
                continue
            writer = pymupdf.TextWriter(pdf_page.rect)
            for word in page.get("words") or []:
                text = word.get("text") or ""
                box = word.get("bbox") or [0, 0, 0, 0]
                if not text or box[3] <= 0:
                    continue
                fontsize = max(4, box[3] * scale * 0.85)
                baseline = (box[0] * scale, (box[1] + box[3]) * scale)
                try:
                    writer.append(baseline, text, font=font, fontsize=fontsize)
                except Exception:
                    continue
            writer.write_text(pdf_page, render_mode=3)
        if doc.page_count == 0:
            return "No page images were available for the searchable PDF."
        doc.save(dest, deflate=True, garbage=4)
    finally:
        doc.close()
    return warning
