"""
Command-Line Interface for the 15-Step Scripture Validation & Restoration Pipeline.
Usage:
    python -m dharma_ocr.validator.cli --book "sources/garuda-saroddhar.pdf"
    python -m dharma_ocr.validator.cli --all
"""

import sys
import glob
import argparse
from pathlib import Path
from typing import List, Dict, Any, Optional

from rich.console import Console
from rich.table import Table
from rich.panel import Panel

from dharma_ocr.validator.repair_pipeline import ScriptureValidationPipeline
from dharma_ocr.core.logger import get_logger

logger = get_logger()
console = Console()

# Canonical scripture titles mapping for publication grade metadata
CANONICAL_BOOK_TITLES = {
    "garuda-saroddhar": "Garuda Purana Saroddhara (गरुडपुराण सारोद्धार)",
    "garuda1": "Garuda Purana - Volume 1 Acharakhanda (गरुडपुराण आचारखण्ड)",
    "garuda_purana_text": "Garuda Purana Mula Text (गरुडपुराण मूल ग्रन्थ)",
    "kaushitaki": "Kaushitaki Brahmana Upanishad (कौषीतकि ब्राह्मणोपनिषत्)",
    "jabala": "Jabala Upanishad (जाबालोपनिषत्)",
    "amrtabindu_upan": "Amritabindu Upanishad (अमृतबिन्दूपनिषत्)"
}


def find_available_scriptures(sources_dir: str = "sources") -> List[Dict[str, Any]]:
    """Discovers all PDFs in sources/ that have matching checkpoints."""
    pdf_paths = glob.glob(f"{sources_dir}/*.pdf")
    scriptures = []

    for p in sorted(pdf_paths):
        pdf_file = Path(p).resolve()
        slug = pdf_file.stem.lower().replace(" ", "-")
        chk_path = Path(f"./ocr_workspace/checkpoints/{slug}_checkpoint.json")

        if chk_path.exists():
            scriptures.append({
                "slug": slug,
                "pdf_path": str(pdf_file),
                "checkpoint_path": str(chk_path),
                "title": CANONICAL_BOOK_TITLES.get(slug, slug.replace("-", " ").title())
            })
        else:
            logger.warning(f"No checkpoint found for PDF: {pdf_file.name} (checked {chk_path})")

    return scriptures


def run_pipeline_for_scripture(
    pipeline: ScriptureValidationPipeline,
    pdf_path: str,
    checkpoint_path: Optional[str] = None,
    title: Optional[str] = None
) -> Dict[str, Any]:
    """Runs the 15-step validation and restoration pipeline on a single scripture."""
    pdf_file = Path(pdf_path)
    slug = pdf_file.stem.lower().replace(" ", "-")
    resolved_title = title or CANONICAL_BOOK_TITLES.get(slug, pdf_file.stem.replace("-", " ").title())

    doc, report = pipeline.process_scripture(
        pdf_path=str(pdf_file),
        checkpoint_path=checkpoint_path,
        book_title=resolved_title
    )

    return {
        "slug": slug,
        "title": resolved_title,
        "doc": doc,
        "report": report
    }


def render_master_summary(results: List[Dict[str, Any]]):
    """Renders a publication-grade cross-scripture audit comparison table."""
    table = Table(
        title="🏛️ MASTER SCRIPTURE VALIDATION & RESTORATION AUDIT 🏛️",
        show_header=True,
        header_style="bold gold1"
    )
    table.add_column("Scripture", style="cyan", min_width=25)
    table.add_column("Pages", style="white", justify="right")
    table.add_column("Chapters", style="white", justify="right")
    table.add_column("Verses", style="bold green", justify="right")
    table.add_column("Stitched", style="magenta", justify="right")
    table.add_column("OCR Repairs", style="yellow", justify="right")
    table.add_column("Avg Conf", style="blue", justify="right")
    table.add_column("Integrity", style="bold gold1", justify="right")
    table.add_column("Status", style="bold green", justify="center")

    total_pages = 0
    total_chapters = 0
    total_verses = 0
    total_stitched = 0
    total_repairs = 0

    for item in results:
        r = item["report"]
        total_pages += r.total_pages
        total_chapters += r.total_chapters
        total_verses += r.total_verses
        total_stitched += r.missing_verses_restored
        total_repairs += r.ocr_errors_corrected

        status_str = "PUBLICATION GRADE" if r.final_scripture_integrity_score >= 80.0 else "AUDITED"

        table.add_row(
            r.book_title[:38],
            str(r.total_pages),
            str(r.total_chapters),
            str(r.total_verses),
            str(r.missing_verses_restored),
            str(r.ocr_errors_corrected),
            f"{r.average_ocr_confidence}%",
            f"{r.final_scripture_integrity_score}%",
            f"[bold green]{status_str}[/bold green]"
        )

    table.add_section()
    table.add_row(
        "[bold]TOTALS (Library Level)[/bold]",
        f"[bold]{total_pages}[/bold]",
        f"[bold]{total_chapters}[/bold]",
        f"[bold]{total_verses}[/bold]",
        f"[bold]{total_stitched}[/bold]",
        f"[bold]{total_repairs}[/bold]",
        "-",
        "-",
        "[bold gold1]COMPLETE[/bold gold1]"
    )

    console.print("\n")
    console.print(Panel(table, border_style="gold1"))


def main():
    parser = argparse.ArgumentParser(
        description="15-Step Sanskrit & Hindi Scripture Validation, Restoration, and Publication Engine."
    )
    parser.add_argument(
        "--book", "-b",
        type=str,
        help="Path to scripture PDF or book slug (e.g. 'sources/garuda-saroddhar.pdf' or 'garuda-saroddhar')"
    )
    parser.add_argument(
        "--all", "-a",
        action="store_true",
        help="Validate and restore all digitized scriptures in the library"
    )
    parser.add_argument(
        "--output-dir", "-o",
        type=str,
        default="./ocr_output",
        help="Base output directory for verified deliverables (defaults to ./ocr_output)"
    )
    parser.add_argument(
        "--checkpoint", "-c",
        type=str,
        help="Custom path to OCR checkpoint JSON"
    )
    parser.add_argument(
        "--title", "-t",
        type=str,
        help="Custom book title"
    )

    args = parser.parse_args()

    if not args.book and not args.all:
        parser.print_help()
        sys.exit(1)

    pipeline = ScriptureValidationPipeline(output_dir_base=Path(args.output_dir))

    if args.all:
        console.print("[bold gold1]Starting Multi-Scripture Library Validation & Restoration Pipeline...[/bold gold1]")
        scriptures = find_available_scriptures()
        if not scriptures:
            console.print("[bold red]No digitized scriptures with checkpoints found in sources/ and ocr_workspace/checkpoints/![/bold red]")
            sys.exit(1)

        console.print(f"Found [bold cyan]{len(scriptures)}[/bold cyan] scriptures ready for validation.")
        results = []
        for s in scriptures:
            console.print(f"\n[bold green]Processing Scripture:[/bold green] {s['title']} ({s['slug']})")
            res = run_pipeline_for_scripture(
                pipeline=pipeline,
                pdf_path=s["pdf_path"],
                checkpoint_path=s["checkpoint_path"],
                title=s["title"]
            )
            results.append(res)

        render_master_summary(results)

    elif args.book:
        # Resolve single book
        book_input = args.book.strip()
        pdf_path = None
        chk_path = args.checkpoint

        if Path(book_input).exists():
            pdf_path = str(Path(book_input).resolve())
        elif Path(f"sources/{book_input}.pdf").exists():
            pdf_path = str(Path(f"sources/{book_input}.pdf").resolve())
        elif Path(f"sources/{book_input}").exists():
            pdf_path = str(Path(f"sources/{book_input}").resolve())
        else:
            console.print(f"[bold red]Could not locate PDF for input: {book_input}[/bold red]")
            sys.exit(1)

        slug = Path(pdf_path).stem.lower().replace(" ", "-")
        if not chk_path:
            chk_candidate = Path(f"./ocr_workspace/checkpoints/{slug}_checkpoint.json")
            if chk_candidate.exists():
                chk_path = str(chk_candidate)

        console.print(f"[bold gold1]Validating Single Scripture:[/bold gold1] {pdf_path}")
        res = run_pipeline_for_scripture(
            pipeline=pipeline,
            pdf_path=pdf_path,
            checkpoint_path=chk_path,
            title=args.title
        )
        render_master_summary([res])


if __name__ == "__main__":
    main()
