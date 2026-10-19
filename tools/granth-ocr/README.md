# Offline Granth OCR

Local OCR for scanned Sanskrit and Hindi books. Tesseract (`san+hin`, OEM 1) reads every page. Surya runs only when that page is still below the confidence or quality threshold, and only if its weights are already on disk. No API, no cloud model, no paid library.

The engine string is kept as `text_raw`. A leading `ि` is moved after its consonant and that swap is logged. Dictionary hits such as `महाभागत` → `महाभारत` are suggestions. They are written into `text_normalized` only with `--apply-corrections`. Look-alike consonants (`घ`/`ध`, `भ`/`म`, `व`/`ब`, `य`/`प`) are not substituted. The pipeline does not invent a missing shloka and does not write the scripture catalog.

## Layout

```
tools/granth-ocr/
  pipeline.py              scan, report, export, audit
  config.yaml
  requirements.txt         base: PyMuPDF, OpenCV, Pillow, PyYAML, indic-transliteration
  requirements-surya.txt   optional torch stack
  requirements-extra.txt   optional SymSpell, IndicNLP, OCRmyPDF
  granth_ocr/              render, preprocess, engines, corrections, verses, export
  schemas/                 page and book JSON Schema
  tests/test_philology.py
  work/<slug>/             created by a scan, not committed
    input/source.json
    images/raw/            600 DPI grayscale PNG (deleted in low-memory mode)
    images/clean/
    ocr/page-N.json        engine, confidence, seconds, raw text, word boxes
    checkpoints/page-N.json
    chapters/chapters.json
    chapters/verses.json
    export/book.txt
    export/book.md
    export/book.json
    searchable/book.pdf
    logs/pipeline.log
    reports/quality.md
```

A scan also stages `.ocr-cache/<slug>/verses.json` for the site importer. That file is not the catalog. `npm run ocr:import` still refuses to replace a shloka that already has text, and it skips `needs_review` lines.

## Routing

1. Render the page with PyMuPDF at the configured DPI (600 unless low-memory mode or `--dpi` says otherwise).
2. Tesseract OSD may rotate the page when its orientation confidence clears `osd_min_confidence`. Deskew is limited to 0.4–10 degrees.
3. OpenCV deskews, crops the near-white border, divides out a median background (bleed and uneven ink), denoises with a 3×3 median, and applies CLAHE. Adaptive threshold stays off unless `binarize: true`.
4. A blur / contrast / ink score decides whether the page is weak.
5. Tesseract PSM 6 runs first. If confidence or the quality score is under the threshold, PSM 3, 4, and 11 run and the highest score wins (`psm_strategy: adaptive`). `sweep` runs all four on every page.
6. If the winner is still under the threshold and Surya is installed, Surya may replace it. The page JSON records `engine`, `attempts`, `confidence`, and `seconds`.

## Commands

```
python pipeline.py scan --input book.pdf --slug shiv-purana --pages 1-5 --dpi 300
python pipeline.py report --slug shiv-purana
python pipeline.py export --slug shiv-purana
python pipeline.py audit --slug shiv-purana
```

`audit` reads `ocr/page-N.json` and the page image path. It writes `reports/audit.md`, `reports/audit.json`, and `export/verified_text.md`, `.txt`, and `.json`. A skipped verse number stays skipped. A dictionary hit is recorded and not written into the line. A hyphen or a cut akshara is not completed. The command does not run Tesseract or Surya, and it does not write a verified searchable PDF or the scripture catalog.

From the site repo, the same entry points are:

```
npm run ocr:scan -- --input "./pdfs/book.pdf" --slug "shiv-purana" --pages 1-5 --dpi 300
npm run ocr:validate -- --slug "shiv-purana"
```

Stop the process whenever you want. The next scan of the same slug skips checkpoints with `"status": "complete"`. `--force` redoes the pages you name.

## Quality report

`reports/quality.md` lists mean confidence, the lowest page, engine counts, pages per minute, detected chapters, low-confidence pages, duplicate verse numbers, and gaps inside a dense chapter. The mean is Tesseract's word confidence. It is not a measured character-error rate.

## What a large Purana costs

A book page at 600 DPI is often 20–40 MB as PNG. Five hundred pages is on the order of 10–20 GB of images. Five thousand pages at 600 DPI can pass 150 GB. For a first pass use `--dpi 300` and `--psm 6`. Re-run only the low-confidence pages at 600 DPI without `--psm`, so the adaptive strategy tries the other PSM modes and Surya.

`san+hin` is often 15–60 seconds per page per PSM on a CPU. Adaptive mode spends that cost once on a clean page. On a 16 GB machine, `--workers 2` is a reasonable ceiling because each worker holds a full page. Under 8 GB, `low_memory: auto` forces one worker, 300 DPI, and deletes the raw PNG after the cleaned image is written.

Surya is slower than Tesseract on CPU and is not used for the bulk of a book. Leave `surya_offline: true`. Download its weights once on a machine that is allowed to, then later runs stay offline. This installer does not download them.

Set `searchable_pdf: false` while OCRing a multi-thousand-page book, then `python pipeline.py export --slug ...` when the page JSON is complete. The searchable file keeps the cleaned page image and an invisible Devanagari text layer. The font is the first one found among Nirmala UI, Mangal, Kokila, Aparaj, and Noto Sans Devanagari.

Install steps: [INSTALL-WINDOWS.md](INSTALL-WINDOWS.md), [INSTALL-LINUX.md](INSTALL-LINUX.md).
