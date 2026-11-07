"""
Atomic Checkpoint and Resume Framework for Scripture OCR.
Enables fault-tolerant pause, resume, and recovery across 100 to 5000+ page scans.
"""

import json
import os
import time
from pathlib import Path
from typing import Dict, Any, List, Optional
from dharma_ocr.core.schemas import PageRecord
from dharma_ocr.core.logger import get_logger

logger = get_logger()


class CheckpointManager:
    """
    Manages atomic page-by-page progress checkpointing.
    Uses atomic temp-rename writes to guarantee state integrity upon sudden termination.
    """

    def __init__(self, checkpoint_dir: Path, checkpoint_file: str = "checkpoint.json"):
        self.checkpoint_dir = Path(checkpoint_dir)
        self.checkpoint_dir.mkdir(parents=True, exist_ok=True)
        self.checkpoint_path = self.checkpoint_dir / checkpoint_file
        self.temp_path = self.checkpoint_dir / f"{checkpoint_file}.tmp"

        self.data: Dict[str, Any] = {
            "source_pdf": "",
            "file_size_bytes": 0,
            "total_pages": 0,
            "completed_pages": {},  # str(page_num) -> PageRecord dict
            "failed_pages": {},     # str(page_num) -> error message
            "last_updated": 0.0,
            "pipeline_version": "2.0.0"
        }

        self._load()

    def _load(self):
        """Loads existing checkpoint if present."""
        if self.checkpoint_path.exists():
            try:
                with open(self.checkpoint_path, "r", encoding="utf-8") as f:
                    loaded = json.load(f)
                    self.data.update(loaded)
                logger.info(
                    f"Resuming from checkpoint: [bold green]{len(self.data['completed_pages'])}[/bold green] "
                    f"pages already completed."
                )
            except Exception as e:
                logger.warning(f"Could not load checkpoint ({e}). Starting fresh.")

    def initialize_job(self, pdf_path: str, total_pages: int):
        """Sets up job metadata. If source PDF changes, resets checkpoint."""
        resolved_path = str(Path(pdf_path).resolve())
        file_size = os.path.getsize(resolved_path) if os.path.exists(resolved_path) else 0

        if self.data["source_pdf"] and self.data["source_pdf"] != resolved_path:
            logger.warning("Checkpoint source PDF mismatch. Resetting checkpoint for new scripture.")
            self.reset()

        self.data["source_pdf"] = resolved_path
        self.data["file_size_bytes"] = file_size
        self.data["total_pages"] = total_pages
        self.commit()

    def is_page_completed(self, page_number: int) -> bool:
        """Returns True if the page has already been successfully processed."""
        return str(page_number) in self.data["completed_pages"]

    def save_page(self, page_record: PageRecord):
        """Records a successfully processed page in memory."""
        page_key = str(page_record.page_number)
        self.data["completed_pages"][page_key] = page_record.model_dump()
        if page_key in self.data["failed_pages"]:
            del self.data["failed_pages"][page_key]

    def record_failure(self, page_number: int, error_msg: str):
        """Records a page processing failure."""
        page_key = str(page_number)
        self.data["failed_pages"][page_key] = error_msg
        self.commit()

    def commit(self):
        """Atomically persists the current state to disk."""
        self.data["last_updated"] = time.time()
        try:
            with open(self.temp_path, "w", encoding="utf-8") as f:
                json.dump(self.data, f, ensure_ascii=False, indent=2)
            # Atomic replace
            os.replace(self.temp_path, self.checkpoint_path)
        except Exception as e:
            logger.error(f"Failed to commit checkpoint: {e}")

    def get_completed_records(self) -> List[PageRecord]:
        """Returns all completed PageRecord models sorted by page number."""
        records = []
        for k, v in self.data["completed_pages"].items():
            try:
                records.append(PageRecord(**v))
            except Exception as e:
                logger.error(f"Error deserializing page {k}: {e}")
        records.sort(key=lambda r: r.page_number)
        return records

    def get_completed_count(self) -> int:
        return len(self.data["completed_pages"])

    def reset(self):
        """Clears all checkpoint data."""
        self.data["completed_pages"] = {}
        self.data["failed_pages"] = {}
        if self.checkpoint_path.exists():
            try:
                self.checkpoint_path.unlink()
            except Exception as e:
                logger.error(f"Could not remove checkpoint file: {e}")
