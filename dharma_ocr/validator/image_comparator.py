"""
Step 10 & Step 11: Source PDF Image Comparator and Re-OCR Workflow.
Cross-verifies OCR text presence against the original physical page image and reprocesses deficient scans.
"""

from typing import Dict, Any, Optional, Tuple, List
from pathlib import Path
import os
from dharma_ocr.core.logger import get_logger

logger = get_logger()


class ImageComparatorAndReOCREngine:
    """
    Step 10: Compares OCR extraction against the source PDF page rendering.
    Step 11: Selectively re-runs OCR with targeted segmentation modes (PSM 3/4/6)
             on deficient pages and selects the highest-confidence result.
    """

    def __init__(self, tesseract_cmd: Optional[str] = None, tessdata_dir: Optional[str] = None):
        self.tesseract_cmd = tesseract_cmd or r"C:\Program Files\Tesseract-OCR\tesseract.exe"
        self.tessdata_dir = tessdata_dir or str(Path(__file__).resolve().parent.parent / "tessdata")

    def compare_and_reocr_if_needed(
        self,
        pdf_path: str,
        page_num: int,
        current_page_record: Dict[str, Any],
        confidence_threshold: float = 0.50
    ) -> Tuple[Dict[str, Any], Optional[Dict[str, Any]]]:
        """
        Evaluates page quality. If page is deficient (< threshold or missing lines),
        renders page and executes Re-OCR with alternate PSM modes.
        Returns: (updated_page_record, reocr_event_dict_or_None)
        """
        ocr_res = current_page_record.get("ocr_result", {})
        conf = float(ocr_res.get("confidence", 0.0))
        normalized_conf = conf / 100.0 if conf > 1.0 else conf
        text = current_page_record.get("normalized_text", "")

        # Check if page is deficient (low confidence or missing text)
        is_deficient = (
            (normalized_conf < confidence_threshold and len(text.strip()) > 0)
            or (len(text.strip()) == 0)
        )

        if not is_deficient:
            return current_page_record, None

        # Re-OCR Workflow (Step 11)
        try:
            import pymupdf as fitz
            import pytesseract
            import cv2
            import numpy as np

            if os.path.isfile(self.tesseract_cmd):
                pytesseract.pytesseract.tesseract_cmd = self.tesseract_cmd
            if os.path.isdir(self.tessdata_dir):
                os.environ["TESSDATA_PREFIX"] = self.tessdata_dir

            doc = fitz.open(pdf_path)
            if page_num - 1 >= len(doc):
                return current_page_record, None

            page = doc[page_num - 1]
            pix = page.get_pixmap(matrix=fitz.Matrix(300 / 72, 300 / 72), alpha=False)
            img = np.frombuffer(pix.samples, dtype=np.uint8).reshape((pix.height, pix.width, 3))
            doc.close()

            # Preprocessing: Grayscale + CLAHE + Sauvola
            gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
            # If page is physically blank or whitespace with no text ink, skip re-OCR
            if float(np.std(gray)) < 8.0:
                return current_page_record, None

            clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8)).apply(gray)
            bf = cv2.bilateralFilter(clahe, d=5, sigmaColor=40, sigmaSpace=40)

            best_conf = conf
            best_text = text
            best_engine = "original"

            # Try alternate PSMs: PSM 3 (auto), PSM 4 (variable column), PSM 6 (single block)
            for psm in [3, 4, 6]:
                try:
                    tess_cfg = f"--oem 1 --psm {psm} -l san+hin"
                    data = pytesseract.image_to_data(bf, config=tess_cfg, output_type=pytesseract.Output.DICT)
                    valid_confs = [int(c) for c in data.get("conf", []) if int(c) >= 0]
                    words = [w for w in data.get("text", []) if w.strip()]
                    if valid_confs and words:
                        avg_c = sum(valid_confs) / len(valid_confs)
                        if avg_c > best_conf and len(words) >= len(text.split()):
                            best_conf = avg_c
                            best_engine = f"Tesseract_PSM{psm}"
                            # Reconstruct lines
                            lines = []
                            curr_line = []
                            last_lid = None
                            for idx in range(len(data["text"])):
                                w = data["text"][idx].strip()
                                lid = (data["block_num"][idx], data["par_num"][idx], data["line_num"][idx])
                                if lid != last_lid:
                                    if curr_line:
                                        lines.append(" ".join(curr_line))
                                        curr_line = []
                                    last_lid = lid
                                if w:
                                    curr_line.append(w)
                            if curr_line:
                                lines.append(" ".join(curr_line))
                            best_text = "\n".join(lines)
                except Exception as e:
                    logger.debug(f"Re-OCR PSM {psm} failed on page {page_num}: {e}")

            if best_engine != "original":
                reocr_event = {
                    "page": page_num,
                    "engine_used": best_engine,
                    "previous_confidence": round(conf, 2),
                    "new_confidence": round(best_conf, 2)
                }
                # Update page record
                updated = dict(current_page_record)
                updated["normalized_text"] = best_text
                ocr_copy = dict(updated.get("ocr_result", {}))
                ocr_copy["confidence"] = best_conf
                ocr_copy["engine_name"] = best_engine
                updated["ocr_result"] = ocr_copy
                return updated, reocr_event

        except Exception as e:
            logger.warning(f"Re-OCR workflow error on page {page_num}: {e}")

        return current_page_record, None
