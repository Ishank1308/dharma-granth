"""
Computer Vision Page Quality Analyzer for Devanagari Scripture Documents.
Computes Laplacian blur, contrast, skew, and bleed-through metrics to route pages to OCR engines.
"""

import cv2
import numpy as np
from pathlib import Path
from dharma_ocr.core.schemas import PageQualityMetrics
from dharma_ocr.core.logger import get_logger

logger = get_logger()


class ImageQualityAnalyzer:
    """
    Evaluates physical scan quality and artifact severity of a scripture page.
    Generates quantitative quality metrics used for intelligent engine routing.
    """

    def __init__(self, blur_threshold: float = 100.0, min_quality_score: float = 45.0):
        self.blur_threshold = blur_threshold
        self.min_quality_score = min_quality_score

    def analyze(self, image_path: Path) -> PageQualityMetrics:
        """Analyzes an image and returns PageQualityMetrics."""
        # Load grayscale
        img_gray = cv2.imread(str(image_path), cv2.IMREAD_GRAYSCALE)
        if img_gray is None:
            logger.warning(f"Failed to read image at {image_path} for quality analysis.")
            return PageQualityMetrics(
                contrast=0.0,
                blur_variance=0.0,
                skew_angle_deg=0.0,
                bleed_ratio=1.0,
                quality_score=0.0,
                is_blurred=True,
                is_skewed=False
            )

        # 1. Blur Variance (Laplacian operator)
        laplacian = cv2.Laplacian(img_gray, cv2.CV_64F)
        blur_variance = float(laplacian.var())
        is_blurred = blur_variance < self.blur_threshold

        # 2. Contrast (RMS contrast: standard deviation of pixel intensities)
        contrast = float(np.std(img_gray) / 128.0)  # Normalized around [0.0 - 1.0]

        # 3. Skew Angle Estimation
        skew_angle = self._detect_skew_angle(img_gray)
        is_skewed = abs(skew_angle) > 1.2

        # 4. Bleed-Through Ratio Estimation
        # In historical Indian paper, bleed-through shows up as mid-tone grey pixels
        # between pure dark ink (< 80) and white background (> 210)
        total_pixels = img_gray.size
        mid_tone_pixels = np.count_nonzero((img_gray >= 90) & (img_gray <= 180))
        bleed_ratio = float(mid_tone_pixels / total_pixels) if total_pixels > 0 else 0.0

        # 5. Composite Quality Score [0 - 100]
        # High contrast, high blur variance, low bleed, low skew = high quality
        blur_score = min(1.0, blur_variance / 300.0) * 40.0
        contrast_score = min(1.0, contrast) * 30.0
        bleed_score = max(0.0, 1.0 - (bleed_ratio * 3.0)) * 20.0
        skew_score = max(0.0, 1.0 - (abs(skew_angle) / 10.0)) * 10.0

        quality_score = round(blur_score + contrast_score + bleed_score + skew_score, 2)

        return PageQualityMetrics(
            contrast=round(contrast, 3),
            blur_variance=round(blur_variance, 2),
            skew_angle_deg=round(skew_angle, 2),
            bleed_ratio=round(bleed_ratio, 3),
            quality_score=quality_score,
            is_blurred=is_blurred,
            is_skewed=is_skewed
        )

    def _detect_skew_angle(self, gray: np.ndarray) -> float:
        """Calculates skew angle in degrees using Otsu binarization and minAreaRect."""
        try:
            # Downsample for faster computation
            h, w = gray.shape
            scale = min(1.0, 1200.0 / max(h, w))
            if scale < 1.0:
                small = cv2.resize(gray, (0, 0), fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
            else:
                small = gray

            # Invert Otsu threshold: text is white foreground
            _, thresh = cv2.threshold(small, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

            # Find coordinates of all text pixels
            coords = np.column_stack(np.where(thresh > 0))
            if len(coords) < 100:
                return 0.0

            # Compute rotated bounding box around all text
            rect = cv2.minAreaRect(coords)
            angle = rect[-1]

            # Adjust angle convention for OpenCV minAreaRect
            if angle < -45.0:
                angle = -(90.0 + angle)
            elif angle > 45.0:
                angle = 90.0 - angle
            else:
                angle = -angle

            # Clamp outlier noise
            if abs(angle) > 30.0:
                return 0.0
            return float(angle)
        except Exception as e:
            logger.debug(f"Skew detection error: {e}")
            return 0.0
