"""
Advanced Computer Vision Preprocessor for Ancient Sanskrit & Hindi Scripture Prints.
Implements deskewing, orientation correction, border removal, bleed-through reduction,
CLAHE contrast enhancement, bilateral denoising, and Sauvola/adaptive binarization.
"""

import cv2
import numpy as np
from pathlib import Path
from typing import Tuple, Optional
from dharma_ocr.core.schemas import PageQualityMetrics
from dharma_ocr.preprocessing.quality_analyzer import ImageQualityAnalyzer
from dharma_ocr.core.logger import get_logger

logger = get_logger()


class ImagePreprocessor:
    """
    Production-grade preprocessing engine tailored for Devanagari scriptures.
    Restores degraded 19th/20th-century lithographic prints for optimal OCR recognition.
    """

    def __init__(self, config: dict, output_dir: Optional[Path] = None):
        self.config = config
        self.output_dir = Path(output_dir) if output_dir else Path("./ocr_workspace/cleaned_images")
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.analyzer = ImageQualityAnalyzer(
            blur_threshold=config.get("quality_routing", {}).get("blur_threshold", 100.0),
            min_quality_score=config.get("quality_routing", {}).get("min_quality_score", 45.0)
        )

    def process(self, image_path: Path, page_number: int) -> Tuple[Path, PageQualityMetrics]:
        """
        Executes the full preprocessing pipeline on a raw 600 DPI page image.
        Returns: (cleaned_image_path, quality_metrics)
        """
        raw_bgr = cv2.imread(str(image_path))
        if raw_bgr is None:
            raise FileNotFoundError(f"Failed to load image for preprocessing: {image_path}")

        # Step 1: Pre-analysis of raw scan quality
        metrics = self.analyzer.analyze(image_path)

        img = raw_bgr.copy()

        # Step 2: Deskew Correction
        if self.config.get("deskew", {}).get("enabled", True) and abs(metrics.skew_angle_deg) > 0.5:
            max_angle = self.config.get("deskew", {}).get("max_angle_deg", 25.0)
            if abs(metrics.skew_angle_deg) <= max_angle:
                img = self._deskew(img, metrics.skew_angle_deg)
                logger.debug(f"Page {page_number}: deskewed by {metrics.skew_angle_deg}°")

        # Step 3: Border & Binding Shadow Removal
        if self.config.get("border_removal", {}).get("enabled", True):
            img = self._remove_borders_and_margins(img)

        # Step 4: Bleed-Through Attenuation (Rear-page ink leakage)
        if self.config.get("bleed_through", {}).get("removal_enabled", True) and metrics.bleed_ratio > 0.15:
            img = self._attenuate_bleed_through(img)

        # Convert to Grayscale for text enhancement
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) if len(img.shape) == 3 else img

        # Step 5: CLAHE (Contrast Limited Adaptive Histogram Equalization)
        if self.config.get("contrast", {}).get("use_clahe", True):
            clip_limit = self.config.get("contrast", {}).get("clip_limit", 2.5)
            grid = tuple(self.config.get("contrast", {}).get("tile_grid_size", [8, 8]))
            clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=grid)
            gray = clahe.apply(gray)

        # Step 6: Edge-Preserving Denoising (Bilateral Filter)
        if self.config.get("denoise", {}).get("enabled", True):
            gray = cv2.bilateralFilter(gray, d=5, sigmaColor=40, sigmaSpace=40)

        # Step 7: Binarization (Sauvola or Adaptive Gaussian)
        bin_method = self.config.get("binarization", {}).get("method", "sauvola")
        if bin_method == "sauvola":
            binarized = self._sauvola_threshold(gray, window_size=25, k=0.2)
        elif bin_method == "otsu":
            _, binarized = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        else:
            binarized = cv2.adaptiveThreshold(
                gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 25, 11
            )

        # Step 8: Morphological Repair for Broken Devanagari Shirorekhas
        # Small 2x1 horizontal structuring element to connect chipped horizontal top lines
        kernel_horiz = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 1))
        # Note: in binarized, ink is 0 (black), background is 255 (white). Invert for morphology:
        inv = cv2.bitwise_not(binarized)
        repaired_inv = cv2.morphologyEx(inv, cv2.MORPH_CLOSE, kernel_horiz)
        final_binary = cv2.bitwise_not(repaired_inv)

        # Save cleaned image
        cleaned_path = self.output_dir / f"{image_path.stem}_clean.png"
        cv2.imwrite(str(cleaned_path), final_binary)

        return cleaned_path, metrics

    def _deskew(self, image: np.ndarray, angle: float) -> np.ndarray:
        """Rotates image by specified angle with white background padding."""
        h, w = image.shape[:2]
        center = (w // 2, h // 2)
        rot_mat = cv2.getRotationMatrix2D(center, angle, 1.0)
        deskewed = cv2.warpAffine(
            image,
            rot_mat,
            (w, h),
            flags=cv2.INTER_CUBIC,
            borderMode=cv2.BORDER_CONSTANT,
            borderValue=(255, 255, 255)
        )
        return deskewed

    def _remove_borders_and_margins(self, image: np.ndarray) -> np.ndarray:
        """Trims black scanner borders and binding gutter shadows."""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) if len(image.shape) == 3 else image
        h, w = gray.shape

        # Sample border margins (2.5% on each edge)
        margin_x = int(w * 0.025)
        margin_y = int(h * 0.025)

        # If borders are excessively dark (scanner lid shadow), paint them white
        cleaned = image.copy()
        cleaned[0:margin_y, :] = 255
        cleaned[h - margin_y:h, :] = 255
        cleaned[:, 0:margin_x] = 255
        cleaned[:, w - margin_x:w] = 255
        return cleaned

    def _attenuate_bleed_through(self, image: np.ndarray) -> np.ndarray:
        """
        Suppresses faint rear-page ink bleed-through.
        Uses morphological background illumination estimation.
        """
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) if len(image.shape) == 3 else image
        # Background estimation via large morphological dilation
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (19, 19))
        background = cv2.dilate(gray, kernel)

        # Difference
        diff = cv2.absdiff(background, gray)
        # Normalize
        norm = cv2.normalize(diff, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_8U)
        # Re-invert to white background
        return cv2.cvtColor(cv2.bitwise_not(norm), cv2.COLOR_GRAY2BGR)

    def _sauvola_threshold(self, gray: np.ndarray, window_size: int = 25, k: float = 0.2, r: float = 128.0) -> np.ndarray:
        """
        Sauvola binarization: Optimal for historical documents with uneven illumination.
        Threshold T = m * (1 + k * ((s / r) - 1))
        where m is local mean, s is local standard deviation.
        """
        if window_size % 2 == 0:
            window_size += 1

        gray_float = gray.astype(np.float32)
        # Compute local mean
        mean = cv2.blur(gray_float, (window_size, window_size))
        # Compute local variance & standard deviation
        mean_sq = cv2.blur(gray_float ** 2, (window_size, window_size))
        variance = np.maximum(0.0, mean_sq - (mean ** 2))
        std = np.sqrt(variance)

        # Compute Sauvola threshold
        threshold = mean * (1.0 + k * ((std / r) - 1.0))

        # Binary output
        binary = np.zeros_like(gray, dtype=np.uint8)
        binary[gray_float >= threshold] = 255
        return binary
