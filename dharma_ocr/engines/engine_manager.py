"""
Intelligent Hybrid OCR Engine Manager & Dynamic Router.
Routes pages between Tesseract and Surya based on scan quality, confidence, and layout.
"""

from pathlib import Path
from typing import Optional, Dict, Any
from dharma_ocr.core.schemas import OCRResult, PageQualityMetrics
from dharma_ocr.engines.tesseract_engine import TesseractEngine
from dharma_ocr.engines.surya_engine import SuryaEngine
from dharma_ocr.core.logger import get_logger

logger = get_logger()


class OCREngineManager:
    """
    Orchestrates OCR engine selection and intelligent fallback.
    Executes primary recognition via Tesseract with dynamic PSMs, then automatically
    triggers Surya OCR fallback if confidence falls below threshold or if page quality is damaged.
    """

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        ocr_cfg = config.get("ocr_engines", {})
        self.strategy = ocr_cfg.get("routing_strategy", "hybrid_intelligent")

        tess_cfg = ocr_cfg.get("tesseract", {})
        self.tesseract = TesseractEngine(
            executable_path=tess_cfg.get("executable_path"),
            tessdata_dir=tess_cfg.get("tessdata_dir"),
            languages=tess_cfg.get("languages", "san+hin"),
            oem=tess_cfg.get("oem", 1),
            dynamic_psms=tess_cfg.get("test_psms", [3, 4, 6, 11]),
            timeout_sec=tess_cfg.get("timeout_per_page_sec", 90)
        )

        surya_cfg = ocr_cfg.get("surya", {})
        self.surya = SuryaEngine(
            device=surya_cfg.get("device", "auto"),
            batch_size=surya_cfg.get("batch_size", 4)
        )

        self.confidence_threshold = float(tess_cfg.get("confidence_threshold", 72.0))
        self.min_quality_score = float(config.get("preprocessing", {}).get("quality_routing", {}).get("min_quality_score", 45.0))
        self.surya_enabled = surya_cfg.get("enabled", True)

    def process_page(
        self,
        image_path: Path,
        quality: Optional[PageQualityMetrics] = None,
        page_number: int = 1
    ) -> OCRResult:
        """
        Processes a page image through the hybrid OCR pipeline.
        Logs routing decisions and engine metadata.
        """
        # Scenario A: Forced Surya Mode
        if self.strategy == "surya_only":
            logger.info(f"Page {page_number}: Routing directly to Surya (strategy=surya_only)")
            return self.surya.recognize(image_path)

        # Scenario B: Forced Tesseract Mode
        if self.strategy == "tesseract_only" or not self.surya_enabled:
            return self.tesseract.recognize(image_path)

        # Scenario C: Intelligent Quality Pre-Routing
        # If the page is severely degraded, blurred, or warped, Surya's transformer architecture
        # handles it significantly better than classical LSTM
        if quality:
            if quality.quality_score < self.min_quality_score or quality.is_blurred:
                if self.surya.is_available():
                    logger.info(
                        f"Page {page_number}: Quality score {quality.quality_score} below threshold "
                        f"({self.min_quality_score}) or blur detected. Routing directly to [bold magenta]Surya OCR[/bold magenta]."
                    )
                    return self.surya.recognize(image_path)

        # Primary Pass: Tesseract with dynamic PSMs
        tess_result = self.tesseract.recognize(image_path)

        # Scenario D: Fallback Trigger on Low Confidence
        if tess_result.confidence < self.confidence_threshold:
            if self.surya.is_available():
                logger.info(
                    f"Page {page_number}: Tesseract confidence ({tess_result.confidence}%) < cutoff "
                    f"({self.confidence_threshold}%). Switching to fallback: [bold magenta]Surya OCR[/bold magenta]."
                )
                surya_result = self.surya.recognize(image_path)
                # Pick the higher result
                if surya_result.confidence > tess_result.confidence:
                    return surya_result

        logger.debug(
            f"Page {page_number}: Tesseract PSM {tess_result.psm_mode} selected "
            f"with confidence {tess_result.confidence}%"
        )
        return tess_result
