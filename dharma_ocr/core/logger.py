"""
High-Resolution Logging Framework for Dharma Granth Scripture OCR Pipeline.
Supports colored Rich terminal logging and detailed UTF-8 disk logging.
"""

import sys
import logging
from pathlib import Path
from typing import Optional
from rich.logging import RichHandler
from rich.console import Console

console = Console(highlight=False)
_logger: Optional[logging.Logger] = None


def setup_logger(
    log_dir: Optional[Path] = None,
    level: str = "INFO",
    log_file_name: str = "ocr_pipeline.log",
    rich_console: bool = True
) -> logging.Logger:
    """Configures global pipeline logger with Rich console and file handlers."""
    global _logger

    log_level = getattr(logging, level.upper(), logging.INFO)
    logger = logging.getLogger("dharma_ocr")
    logger.setLevel(log_level)
    logger.handlers.clear()

    # 1. Console Handler (Rich)
    if rich_console:
        rich_h = RichHandler(
            console=console,
            show_time=True,
            show_path=False,
            rich_tracebacks=True,
            markup=True
        )
        rich_h.setLevel(log_level)
        logger.addHandler(rich_h)
    else:
        stream_h = logging.StreamHandler(sys.stdout)
        stream_h.setFormatter(logging.Formatter("[%(asctime)s] [%(levelname)s] %(message)s"))
        stream_h.setLevel(log_level)
        logger.addHandler(stream_h)

    # 2. File Handler (UTF-8 for Devanagari scripture logging)
    if log_dir:
        log_dir = Path(log_dir)
        log_dir.mkdir(parents=True, exist_ok=True)
        file_path = log_dir / log_file_name

        file_h = logging.FileHandler(file_path, mode="a", encoding="utf-8")
        file_formatter = logging.Formatter(
            "%(asctime)s.%(msecs)03d | %(levelname)-7s | %(name)s | %(module)s:%(lineno)d | %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        file_h.setFormatter(file_formatter)
        file_h.setLevel(logging.DEBUG)  # Always log verbose debug details to file
        logger.addHandler(file_h)

    _logger = logger
    return logger


def get_logger() -> logging.Logger:
    """Returns initialized logger or defaults to standard console logger."""
    global _logger
    if _logger is None:
        return setup_logger()
    return _logger
