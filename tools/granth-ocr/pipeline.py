"""Offline Sanskrit/Hindi scripture OCR.

    python pipeline.py scan --input book.pdf --slug shiv-purana --pages 1-5 --dpi 300
    python pipeline.py report --slug shiv-purana
    python pipeline.py export --slug shiv-purana
    python pipeline.py audit --slug shiv-purana

Completed pages are skipped on the next scan. text_raw is the engine output.
"""

from __future__ import annotations

import argparse
import json
import logging
import sys
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))

from granth_ocr.audit import attach_images, audit_pages, load_ocr_pages as load_audit_pages, unit_confidence, write_audit  # noqa: E402
from granth_ocr.config import apply_runtime, load_config  # noqa: E402
from granth_ocr.export_docs import website_verses, write_book_json, write_markdown, write_txt  # noqa: E402
from granth_ocr.export_pdf import write_searchable_pdf  # noqa: E402
from granth_ocr.render import page_count  # noqa: E402
from granth_ocr.report import build_report, write_report  # noqa: E402
from granth_ocr.verses import stitch_pages  # noqa: E402
from granth_ocr.worker import process_page  # noqa: E402

REPO = HERE.parents[1] if (HERE.parents[1] / "package.json").exists() else None
LOG = logging.getLogger("granth_ocr")


def parse_page_spec(spec: str | None, total: int) -> list[int]:
    if not spec:
        return list(range(1, total + 1))
    pages: set[int] = set()
    for part in spec.split(","):
        piece = part.strip()
        if not piece:
            continue
        if "-" in piece:
            start_s, end_s = piece.split("-", 1)
            start, end = int(start_s), int(end_s)
            if start < 1 or end < start:
                raise SystemExit(f"Bad page range: {piece}")
            pages.update(range(start, end + 1))
        else:
            pages.add(int(piece))
    chosen = sorted(page for page in pages if 1 <= page <= total)
    if not chosen:
        raise SystemExit(f"No pages inside 1..{total} for {spec}")
    return chosen


def ensure_dirs(work: Path) -> None:
    for rel in (
        "input", "images/raw", "images/clean", "ocr", "chapters",
        "export", "searchable", "logs", "checkpoints", "reports",
    ):
        (work / rel).mkdir(parents=True, exist_ok=True)


def setup_log(work: Path) -> None:
    ensure_dirs(work)
    LOG.setLevel(logging.INFO)
    LOG.handlers.clear()
    formatter = logging.Formatter("%(asctime)s %(levelname)s %(message)s")
    file_handler = logging.FileHandler(work / "logs" / "pipeline.log", encoding="utf-8")
    file_handler.setFormatter(formatter)
    stream = logging.StreamHandler()
    stream.setFormatter(formatter)
    LOG.addHandler(file_handler)
    LOG.addHandler(stream)


def completed_pages(work: Path) -> set[int]:
    done: set[int] = set()
    folder = work / "checkpoints"
    if not folder.exists():
        return done
    for path in folder.glob("page-*.json"):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            continue
        if data.get("status") == "complete":
            done.add(int(data["page"]))
    return done


def load_ocr_pages(work: Path) -> list[dict]:
    folder = work / "ocr"
    if not folder.exists():
        return []
    pages = []
    paths = sorted(folder.glob("page-*.json"), key=lambda path: int(path.stem.split("-")[1]))
    for path in paths:
        pages.append(json.loads(path.read_text(encoding="utf-8")))
    return pages


def load_failures(work: Path) -> list[dict]:
    failures = []
    folder = work / "checkpoints"
    if not folder.exists():
        return failures
    for path in sorted(folder.glob("page-*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        if data.get("status") == "failed":
            failures.append(data)
    return failures


def export_book(slug: str, work: Path, cfg: dict) -> dict:
    pages = load_ocr_pages(work)
    mode = cfg["corrections"]["mode"]
    reorder = bool(cfg["corrections"].get("reorder_prebase_i", True))
    verses, chapters = stitch_pages(pages, mode=mode, reorder_i=reorder)
    page_flags = {page.get("pdf_page"): list(page.get("flags") or []) for page in pages}
    for verse in verses:
        verse["is_ai_assisted"] = False
        for flag in page_flags.get(verse.get("pdf_page"), []):
            if flag not in verse["flags"]:
                verse["flags"].append(flag)
        if isinstance(verse.get("confidence"), (int, float)) and verse["confidence"] < float(cfg["confidence_threshold"]):
            if "low OCR confidence" not in verse["flags"]:
                verse["flags"].append("low OCR confidence")
    failures = load_failures(work)
    source = ""
    source_file = work / "input" / "source.json"
    if source_file.exists():
        source = json.loads(source_file.read_text(encoding="utf-8")).get("source_pdf", "")
    book = {
        "slug": slug,
        "source_pdf": source,
        "is_ai_assisted": False,
        "dpi": cfg.get("dpi"),
        "chapters": [
            {**chapter, "verses": [verse for verse in verses if verse.get("chapter") == chapter["number"]]}
            for chapter in chapters
        ],
        "verses": verses,
    }
    write_book_json(book, work / "export" / "book.json")
    write_book_json({"chapters": chapters}, work / "chapters" / "chapters.json")
    write_book_json({"verses": verses}, work / "chapters" / "verses.json")
    write_txt(pages, work / "export" / "book.txt")
    write_markdown(slug, chapters, verses, work / "export" / "book.md")
    report = build_report(slug, pages, verses, chapters, failures, cfg)
    write_report(report, work / "reports" / "quality.md")
    if cfg.get("searchable_pdf") and pages:
        warning = write_searchable_pdf(pages, work / "searchable" / "book.pdf", int(cfg["dpi"]))
        if warning:
            LOG.warning("%s", warning)
            (work / "reports" / "searchable-pdf.txt").write_text(warning + "\n", encoding="utf-8")
    if REPO is not None:
        cache = REPO / ".ocr-cache" / slug
        cache.mkdir(parents=True, exist_ok=True)
        payload = website_verses(slug, verses, float(cfg["confidence_threshold"]))
        (cache / "verses.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        (cache / "ocr-review-report.md").write_text((work / "reports" / "quality.md").read_text(encoding="utf-8"), encoding="utf-8")
        LOG.info("website staging written to %s", cache)
    LOG.info(
        "export %s pages=%s verses=%s mean_confidence=%s",
        slug, report["pages"], report["verses"], report["mean_confidence"],
    )
    return report


def run_scan(args: argparse.Namespace) -> int:
    pdf = Path(args.input).resolve()
    if not pdf.exists():
        raise SystemExit(f"PDF not found: {pdf}")
    cfg = load_config(Path(args.config) if args.config else HERE / "config.yaml")
    if args.dpi:
        cfg["dpi"] = args.dpi
    if args.workers:
        cfg["workers"] = args.workers
    if args.psm:
        cfg["psm_modes"] = [int(args.psm)]
        cfg["primary_psm"] = int(args.psm)
        cfg["psm_strategy"] = "sweep"
    if args.no_surya:
        cfg["surya_enabled"] = False
    if args.apply_corrections:
        cfg["corrections"]["mode"] = "apply"
    cfg = apply_runtime(cfg, low_memory_flag=bool(args.low_memory))
    work = Path(args.out).resolve() if args.out else HERE / "work" / args.slug
    setup_log(work)
    total = page_count(str(pdf))
    pages = parse_page_spec(args.pages, total)
    (work / "input" / "source.json").write_text(json.dumps({
        "source_pdf": pdf.name,
        "source_path": str(pdf),
        "page_count": total,
    }, indent=2) + "\n", encoding="utf-8")
    done = set() if args.force else completed_pages(work)
    if args.force:
        for page in pages:
            checkpoint = work / "checkpoints" / f"page-{page}.json"
            if checkpoint.exists():
                checkpoint.unlink()
    pending = [page for page in pages if page not in done]
    LOG.info(
        "%s: %s pages, scanning %s (%s cached) at %s DPI, workers=%s, strategy=%s",
        pdf.name, total, len(pending), len(pages) - len(pending), cfg["dpi"], cfg["workers"], cfg["psm_strategy"],
    )
    jobs = [{"pdf": str(pdf), "page": page, "work": str(work), "cfg": cfg} for page in pending]
    results: list[dict] = []
    if not jobs:
        results = []
    elif cfg["workers"] == 1:
        for job in jobs:
            result = process_page(job)
            results.append(result)
            LOG.info("page %s %s confidence=%s seconds=%s", result.get("page"), result.get("status"), result.get("confidence"), result.get("seconds"))
    else:
        with ProcessPoolExecutor(max_workers=cfg["workers"]) as pool:
            for result in pool.map(process_page, jobs, chunksize=max(1, int(cfg["batch_size"]))):
                results.append(result)
                LOG.info("page %s %s confidence=%s seconds=%s", result.get("page"), result.get("status"), result.get("confidence"), result.get("seconds"))
    report = export_book(args.slug, work, cfg)
    failed = [item for item in results if item.get("status") == "failed"]
    LOG.info("report %s", work / "reports" / "quality.md")
    if failed:
        LOG.error("%s page(s) failed", len(failed))
        return 1
    if report["pages"] == 0:
        return 1
    return 0


def run_audit(args: argparse.Namespace) -> int:
    """Score OCR already on disk. Does not call Tesseract, Surya, or the importer."""
    cfg = load_config(Path(args.config) if args.config else HERE / "config.yaml")
    work = Path(args.out).resolve() if args.out else HERE / "work" / args.slug
    if not (work / "ocr").is_dir():
        raise SystemExit(f"No OCR pages in {work}. Run scan first.")
    setup_log(work)
    pages = load_audit_pages(work)
    if not pages:
        LOG.error("no page JSON in %s", work / "ocr")
        return 1
    threshold = unit_confidence(cfg.get("confidence_threshold")) or 0.75
    report = audit_pages(pages, threshold=threshold)
    attach_images(report, work, threshold=threshold)
    dest = write_audit(args.slug, report, work)
    summary = report["summary"]
    LOG.info(
        "audit %s pages=%s verses=%s status=%s integrity=%s queued=%s report=%s",
        args.slug,
        summary["total_pages"],
        summary["total_verses"],
        ",".join(f"{row['page']}:{row['status']}" for row in report["pages"]),
        summary["scripture_integrity_score"],
        summary["pages_queued"],
        dest,
    )
    return 0


def run_export(args: argparse.Namespace) -> int:
    cfg = load_config(Path(args.config) if args.config else HERE / "config.yaml")
    cfg = apply_runtime(cfg, low_memory_flag=False)
    if args.no_pdf:
        cfg["searchable_pdf"] = False
    work = Path(args.out).resolve() if args.out else HERE / "work" / args.slug
    if not (work / "ocr").exists():
        raise SystemExit(f"No OCR pages in {work}. Run scan first.")
    setup_log(work)
    export_book(args.slug, work, cfg)
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Offline Sanskrit and Hindi scripture OCR")
    sub = parser.add_subparsers(dest="command", required=True)

    scan = sub.add_parser("scan", help="Render, OCR, and export a PDF")
    scan.add_argument("--config", default=str(HERE / "config.yaml"))
    scan.add_argument("--input", required=True)
    scan.add_argument("--slug", required=True)
    scan.add_argument("--pages", help="Example: 1-5,8,69")
    scan.add_argument("--dpi", type=int)
    scan.add_argument("--workers", type=int)
    scan.add_argument("--psm", help="Use only this PSM, for a faster pass")
    scan.add_argument("--out")
    scan.add_argument("--force", action="store_true")
    scan.add_argument("--low-memory", action="store_true")
    scan.add_argument("--no-surya", action="store_true")
    scan.add_argument("--apply-corrections", action="store_true", help="Write dictionary variants into text_normalized")
    scan.set_defaults(func=run_scan)

    report = sub.add_parser("report", help="Reprint the quality report from checkpoints")
    report.add_argument("--config", default=str(HERE / "config.yaml"))
    report.add_argument("--slug", required=True)
    report.add_argument("--out")
    report.add_argument("--no-pdf", action="store_true")
    report.set_defaults(func=run_export)

    export = sub.add_parser("export", help="Rebuild TXT, Markdown, JSON, and the searchable PDF")
    export.add_argument("--config", default=str(HERE / "config.yaml"))
    export.add_argument("--slug", required=True)
    export.add_argument("--out")
    export.add_argument("--no-pdf", action="store_true")
    export.set_defaults(func=run_export)

    audit = sub.add_parser("audit", help="Score completed OCR without re-reading the page or changing the text")
    audit.add_argument("--config", default=str(HERE / "config.yaml"))
    audit.add_argument("--slug", required=True)
    audit.add_argument("--out")
    audit.set_defaults(func=run_audit)
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    try:
        code = args.func(args)
    except KeyboardInterrupt:
        raise SystemExit(130)
    raise SystemExit(code)


if __name__ == "__main__":
    main()
