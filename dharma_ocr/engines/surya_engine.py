"""
Surya OCR Offline Deep Learning Engine.
Transformer-based OCR for archaic prints, multi-column layouts, and degraded scans.
"""

import time
from pathlib import Path
from typing import Optional, List
from PIL import Image

from dharma_ocr.engines.base import BaseOCREngine
from dharma_ocr.core.schemas import OCRResult
from dharma_ocr.core.logger import get_logger

logger = get_logger()


class SuryaEngine(BaseOCREngine):
    """
    Offline deep-learning OCR fallback engine.
    Utilizes transformer-based layout detection and text recognition
    to resolve damaged lithographs, multi-column commentary, and archaic fonts.
    """

    def __init__(self, device: str = "auto", batch_size: int = 4):
        self.device = self._resolve_device(device)
        self.batch_size = batch_size
        self._predictor = None
        self._detection_predictor = None
        self._is_initialized = False

    def _resolve_device(self, requested: str) -> str:
        """Determines computation device (CUDA GPU vs CPU)."""
        if requested in ["cuda", "cpu"]:
            return requested
        try:
            import torch
            if torch.cuda.is_available():
                logger.info(f"NVIDIA GPU detected: [bold green]{torch.cuda.get_device_name(0)}[/bold green]")
                return "cuda"
        except ImportError:
            pass
        return "cpu"

    def is_available(self) -> bool:
        """Checks if surya-ocr package is installed and can be imported."""
        try:
            import surya
            import shutil
            # In Surya 0.22+, backend requires Docker daemon for vllm inference
            if not shutil.which("docker"):
                return False
            return True
        except ImportError:
            return False

    def _lazy_init(self):
        """Initializes heavy deep learning model weights once on demand."""
        if self._is_initialized:
            return

        try:
            from surya.recognition import RecognitionPredictor
            from surya.detection import DetectionPredictor

            logger.info(f"Loading Surya OCR models on device: [bold cyan]{self.device}[/bold cyan]...")
            self._detection_predictor = DetectionPredictor()
            self._predictor = RecognitionPredictor()
            self._is_initialized = True
            logger.info("Surya OCR models loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to initialize Surya models: {e}")
            raise

    def recognize(self, image_path: Path) -> OCRResult:
        """Performs layout detection and transformer text recognition on page."""
        start_time = time.time()
        if not self.is_available():
            raise RuntimeError("Surya OCR package is not installed. Run `pip install surya-ocr`.")

        self._lazy_init()
        image = Image.open(str(image_path)).convert("RGB")

        try:
            # Surya recognition API
            # Handles both Surya v0.4+ legacy and v0.20+ calls
            try:
                predictions = self._predictor([image], full_page=True)
            except TypeError:
                predictions = self._predictor([image], det_predictor=self._detection_predictor)
            
            lines_text: List[str] = []
            confidences: List[float] = []
            bboxes = []

            if predictions and len(predictions) > 0:
                page_pred = predictions[0]
                for line in getattr(page_pred, "text_lines", []):
                    t = getattr(line, "text", "").strip()
                    conf = getattr(line, "confidence", 0.85) * 100.0
                    box = getattr(line, "bbox", [0, 0, 0, 0])

                    if t:
                        lines_text.append(t)
                        confidences.append(conf)
                        bboxes.append({
                            "text": t,
                            "confidence": round(conf, 1),
                            "bbox": box
                        })

            full_text = "\n".join(lines_text)
            avg_conf = float(sum(confidences) / len(confidences)) if confidences else 50.0

            return OCRResult(
                engine_name="surya",
                psm_mode=None,
                confidence=round(avg_conf, 2),
                raw_text=full_text,
                word_count=len(full_text.split()),
                processing_time_sec=round(time.time() - start_time, 2),
                bbox_words=bboxes
            )
        except Exception as e:
            logger.error(f"Surya OCR inference error: {e}")
            return OCRResult(
                engine_name="surya",
                psm_mode=None,
                confidence=0.0,
                raw_text="",
                word_count=0,
                processing_time_sec=round(time.time() - start_time, 2)
            )
