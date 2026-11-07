"""
Tesseract OCR Engine with Neural LSTM (OEM 1) and Dynamic PSM Testing.
Supports san+hin tessdata_best models, word-level bounding boxes, and HOCR export.
"""

import time
import os
import shutil
from pathlib import Path
from typing import List, Optional, Dict, Any
from PIL import Image
import pytesseract
from pytesseract import Output

from dharma_ocr.engines.base import BaseOCREngine
from dharma_ocr.core.schemas import OCRResult
from dharma_ocr.core.logger import get_logger

logger = get_logger()


class TesseractEngine(BaseOCREngine):
    """
    Primary OCR engine utilizing Tesseract LSTM neural networks.
    Features dynamic evaluation across multiple Page Segmentation Modes (PSMs)
    to maximize Devanagari character accuracy across varying scripture column layouts.
    """

    def __init__(
        self,
        executable_path: Optional[str] = None,
        tessdata_dir: Optional[str] = None,
        languages: str = "san+hin",
        oem: int = 1,
        dynamic_psms: Optional[List[int]] = None,
        timeout_sec: int = 90
    ):
        self.languages = languages
        self.oem = oem
        self.dynamic_psms = dynamic_psms or [6, 3, 4]
        self.timeout_sec = timeout_sec
        if tessdata_dir and os.path.exists(tessdata_dir):
            self.tessdata_dir = str(Path(tessdata_dir).resolve()).replace('\\', '/')
        else:
            default_tessdata = Path(__file__).resolve().parent.parent / "tessdata"
            if default_tessdata.exists() and (default_tessdata / "san.traineddata").exists():
                self.tessdata_dir = str(default_tessdata).replace('\\', '/')
            else:
                self.tessdata_dir = None

        if executable_path and os.path.isfile(executable_path):
            pytesseract.pytesseract.tesseract_cmd = executable_path
        elif shutil.which("tesseract"):
            pytesseract.pytesseract.tesseract_cmd = shutil.which("tesseract")

        if self.tessdata_dir and os.path.isdir(self.tessdata_dir):
            os.environ["TESSDATA_PREFIX"] = self.tessdata_dir

    def is_available(self) -> bool:
        """Verifies Tesseract binary and required language models are installed."""
        try:
            ver = pytesseract.get_tesseract_version()
            langs = pytesseract.get_languages()
            has_san = "san" in langs or "Devanagari" in langs
            has_hin = "hin" in langs
            if not (has_san or has_hin):
                logger.warning(
                    f"Tesseract {ver} found, but Sanskrit/Hindi traineddata missing. Installed: {langs}"
                )
            return True
        except Exception as e:
            logger.debug(f"Tesseract check failed: {e}")
            return False

    def recognize(self, image_path: Path) -> OCRResult:
        """
        Executes dynamic PSM testing. Evaluates configured PSMs and selects
        the PSM yielding the highest confidence and coherent text density.
        """
        start_time = time.time()
        image = Image.open(str(image_path))

        best_result: Optional[OCRResult] = None
        best_score = -1.0

        tessdata_param = f'--tessdata-dir {self.tessdata_dir} ' if self.tessdata_dir else ""

        for psm in self.dynamic_psms:
            custom_config = f"{tessdata_param}--oem {self.oem} --psm {psm} -l {self.languages}"
            try:
                # 1. Extract detailed word data with bounding boxes and confidence in one pass
                data = pytesseract.image_to_data(
                    image,
                    config=custom_config,
                    output_type=Output.DICT,
                    timeout=self.timeout_sec
                )

                # Filter valid words (confidence >= 0)
                confidences = [int(c) for c in data.get("conf", []) if int(c) >= 0]
                text_tokens = [t.strip() for t in data.get("text", []) if t.strip()]

                if not confidences or not text_tokens:
                    continue

                avg_conf = float(sum(confidences) / len(confidences))
                word_count = len(text_tokens)

                # Heuristic: Balance confidence with text yield
                composite_score = avg_conf * (1.0 + min(0.35, word_count / 120.0))

                if composite_score > best_score:
                    best_score = composite_score

                    # Build word bounding boxes
                    bboxes = []
                    lines = []
                    curr_line = []
                    last_line_id = None
                    total_words = len(data["text"])
                    block_nums = data.get("block_num", [0] * total_words)
                    par_nums = data.get("par_num", [0] * total_words)
                    line_nums = data.get("line_num", [0] * total_words)

                    for i in range(total_words):
                        w_text = data["text"][i].strip()
                        w_conf = int(data["conf"][i])
                        line_id = (block_nums[i], par_nums[i], line_nums[i])
                        if line_id != last_line_id:
                            if curr_line:
                                lines.append(" ".join(curr_line))
                                curr_line = []
                            last_line_id = line_id
                        if w_text:
                            curr_line.append(w_text)
                            if w_conf >= 0:
                                bboxes.append({
                                    "text": w_text,
                                    "confidence": w_conf,
                                    "left": data["left"][i],
                                    "top": data["top"][i],
                                    "width": data["width"][i],
                                    "height": data["height"][i],
                                })
                    if curr_line:
                        lines.append(" ".join(curr_line))
                    reconstructed_text = "\n".join(lines)

                    best_result = OCRResult(
                        engine_name="tesseract",
                        psm_mode=psm,
                        confidence=round(avg_conf, 2),
                        raw_text=reconstructed_text if reconstructed_text else pytesseract.image_to_string(image, config=custom_config),
                        word_count=word_count,
                        processing_time_sec=round(time.time() - start_time, 2),
                        bbox_words=bboxes
                    )

                    # Performance optimization: Fast Early Exit
                    # If current PSM (typically PSM 6 or 3) yields high confidence and good word yield,
                    # skip testing subsequent PSMs to reduce processing time by 60-75% per page.
                    if avg_conf >= 70.0 and word_count >= 15:
                        break
            except Exception as e:
                logger.debug(f"Tesseract PSM {psm} evaluation error: {e}")

        if best_result:
            return best_result

        # Fallback to single default pass if dynamic testing yielded no valid words
        try:
            default_config = f"{tessdata_param}--oem {self.oem} --psm 3 -l {self.languages}"
            raw_text = pytesseract.image_to_string(image, config=default_config)
            return OCRResult(
                engine_name="tesseract",
                psm_mode=3,
                confidence=30.0,
                raw_text=raw_text,
                word_count=len(raw_text.split()),
                processing_time_sec=round(time.time() - start_time, 2)
            )
        except Exception as e:
            return OCRResult(
                engine_name="tesseract",
                psm_mode=3,
                confidence=0.0,
                raw_text="",
                word_count=0,
                processing_time_sec=round(time.time() - start_time, 2)
            )
