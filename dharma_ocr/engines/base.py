"""
Abstract Base Class for OCR Engines.
"""

from abc import ABC, abstractmethod
from pathlib import Path
from dharma_ocr.core.schemas import OCRResult


class BaseOCREngine(ABC):
    """Interface required for all OCR engine implementations."""

    @abstractmethod
    def is_available(self) -> bool:
        """Checks if the engine binary or model weights are available offline."""
        pass

    @abstractmethod
    def recognize(self, image_path: Path) -> OCRResult:
        """Performs optical character recognition on an image file."""
        pass
