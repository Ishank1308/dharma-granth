"""
Batch Scripture Processor for Dharma Granth Digital Preservation Archive.
Processes all scripture PDFs in sources/ sequentially with automated recovery and reporting.
"""

import os
import glob
import time
from pathlib import Path
from typing import List, Dict, Any

from dharma_ocr.pipeline import DharmaOCRPipeline
from dharma_ocr.core.logger import get_logger, console
from rich.table import Table
from rich.panel import Panel

logger = get_logger()

# Master registry of scripture metadata in sources/
SCRIPTURE_REGISTRY = {
    "amrtabindu_upan.pdf": {"title": "Amritabindu Upanishad", "type": "Upanishad"},
    "jabala.pdf": {"title": "Jabala Upanishad", "type": "Upanishad"},
    "kaushitaki.pdf": {"title": "Kaushitaki Upanishad", "type": "Upanishad"},
    "garuda-saroddhar.pdf": {"title": "Garuda Purana Saroddhara", "type": "Purana"},
    "garuda_purana_text.pdf": {"title": "Garuda Purana Devanagari Mula", "type": "Purana"},
    "garuda1.pdf": {"title": "Garuda Purana Volume 1", "type": "Purana"},
}


def run_batch_pipeline(
    pdf_pattern: str = "sources/*.pdf",
    max_workers: int = 12,
    limit_pages_per_book: int = None
):
    """Executes OCR pipeline sequentially over all discovered scripture PDFs."""
    pdf_files = sorted(glob.glob(pdf_pattern))
    if not pdf_files:
        console.print(f"[bold red]No scripture PDFs found matching pattern: {pdf_pattern}[/bold red]")
        return

    pipeline = DharmaOCRPipeline()
    summary_results: List[Dict[str, Any]] = []
    total_start_time = time.time()

    console.print(Panel(
        f"[bold gold1]Starting Dharma Granth Batch Scripture Digitization[/bold gold1]\n"
        f"Found [bold cyan]{len(pdf_files)} scriptures[/bold cyan] queued for processing.\n"
        f"Parallel Workers: [bold green]{max_workers}[/bold green]",
        border_style="gold1"
    ))

    for idx, pdf_path in enumerate(pdf_files, 1):
        pdf_name = Path(pdf_path).name
        meta = SCRIPTURE_REGISTRY.get(pdf_name, {"title": Path(pdf_path).stem.replace("-", " ").title(), "type": "Scripture"})
        title = meta["title"]

        console.print(f"\n[bold gold1]─────────────────────────────────────────────────────────────────[/bold gold1]")
        console.print(f"[bold cyan]▶ [{idx}/{len(pdf_files)}] Processing {meta['type']}: {title} ({pdf_name})[/bold cyan]")
        console.print(f"[bold gold1]─────────────────────────────────────────────────────────────────[/bold gold1]")

        book_start = time.time()
        try:
            pages = None
            if limit_pages_per_book:
                pages = list(range(1, limit_pages_per_book + 1))

            doc = pipeline.process_pdf(
                pdf_path=pdf_path,
                pages=pages,
                title=title,
                max_workers=max_workers
            )
            elapsed = time.time() - book_start

            summary_results.append({
                "title": title,
                "file": pdf_name,
                "status": "Completed",
                "pages": f"{doc.processed_pages}/{doc.total_pages}",
                "confidence": f"{doc.quality_report.average_confidence}%",
                "accuracy": f"{doc.quality_report.estimated_text_accuracy_percent}%",
                "verses": doc.quality_report.detected_verses_count,
                "duration": f"{elapsed:.1f}s"
            })
        except Exception as e:
            logger.error(f"Error processing {pdf_name}: {e}")
            summary_results.append({
                "title": title,
                "file": pdf_name,
                "status": f"Failed ({e})",
                "pages": "-",
                "confidence": "-",
                "accuracy": "-",
                "verses": 0,
                "duration": f"{time.time() - book_start:.1f}s"
            })

    # Render Final Master Library Table
    total_elapsed = time.time() - total_start_time
    table = Table(title="🏛️ Dharma Granth Scripture Digitization: Library Summary", show_header=True)
    table.add_column("Scripture", style="bold cyan")
    table.add_column("Pages", style="green")
    table.add_column("Confidence", style="bold gold1")
    table.add_column("Accuracy", style="bold green")
    table.add_column("Verses", style="cyan")
    table.add_column("Duration", style="magenta")
    table.add_column("Status", style="bold")

    for r in summary_results:
        status_style = "bold green" if r["status"] == "Completed" else "bold red"
        table.add_row(
            r["title"],
            r["pages"],
            r["confidence"],
            r["accuracy"],
            str(r["verses"]),
            r["duration"],
            f"[{status_style}]{r['status']}[/{status_style}]"
        )

    console.print("\n")
    console.print(Panel(table, expand=False, border_style="gold1"))
    console.print(f"[bold green]✓ All scriptures processed in {total_elapsed / 60.0:.1f} minutes![/bold green]\n")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Dharma Granth Batch Scripture Runner")
    parser.add_argument("--pattern", default="sources/*.pdf", help="Glob pattern for PDFs")
    parser.add_argument("--workers", type=int, default=12, help="Parallel worker processes")
    parser.add_argument("--limit-pages", type=int, default=None, help="Optional page limit per book for fast testing")
    args = parser.parse_args()

    run_batch_pipeline(
        pdf_pattern=args.pattern,
        max_workers=args.workers,
        limit_pages_per_book=args.limit_pages
    )
