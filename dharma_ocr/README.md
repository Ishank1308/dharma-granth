# Dharma Granth: 100% Offline Scripture OCR Platform

Production-grade, air-gapped, zero-cost OCR pipeline engineered specifically for high-accuracy digitization of large Sanskrit and Hindi scripture PDFs (Puranas, Mahabharata, Ramayana, Vedas, Upanishads, and Gita commentaries).

---

## Key Features

- **100% Offline & Free**: No paid APIs, no subscriptions, no data transmission. Runs entirely on local CPU and GPU hardware.
- **Hybrid Intelligent Architecture**: Combines **Tesseract 5 Neural LSTM** (`san+hin` from `tessdata_best`, dynamic PSMs 3, 4, 6, 11) with **Surya OCR (Vision Transformer)** as an automated fallback for degraded prints, blur, and complex layouts.
- **600 DPI Precision Rasterization**: High-resolution PyMuPDF rendering preserving delicate Devanagari ligatures, halants, and Vedic swaras.
- **Advanced OpenCV Computer Vision**: Automatic deskewing, orientation detection, border & gutter removal, bleed-through attenuation, bilateral denoising, CLAHE contrast enhancement, and Sauvola adaptive binarization.
- **Philological Sanskrit & Hindi Normalization**:
  - PUA (Private Use Area) ligature decoder for LaTeX dvng/xdvng legacy digitized prints.
  - Avagraha (ऽ), misplaced short-i (ि), and floating reph (र्) repairs.
  - IndicNLP phonetic normalization and SymSpell Devanagari candidate corrections.
  - Built-in classical Vedic & Purana domain dictionary (महाभारत, कृष्ण, विष्णु, शिव, नारायण, धर्म, अध्याय, etc.).
- **Scripture Structure Extraction**:
  - Chapter boundary detection (अध्याय, स्कन्ध, पर्व, सर्ग, काण्ड, खण्ड, प्रकरण, etc.).
  - Shloka / Verse detection using Devanagari double danda markers (`॥ १ ॥`, `॥ १२-१३ ॥`).
  - Cross-page boundary stitching (resolving verses split across consecutive physical pages).
- **Multi-Format Publication Exports**:
  - **Searchable PDF/A**: Embedding recognized Unicode text with original visual fidelity via OCRmyPDF / PyMuPDF.
  - **Hierarchical Markdown**: Table of Contents, chapter headings, and stanza blocks.
  - **Master JSON & RAG Chunks**: Vector database ready chunks with metadata and citation strings.
  - **Plain Unicode TXT**: Full text dump.
  - **OCR Quality Dashboard**: Responsive HTML, Markdown, and JSON confidence & accuracy reports.
- **Fault-Tolerant Checkpointing**: Atomic page-by-page progress recording. Resumes instantly from aborted runs without duplicating work.
- **Scalable Multiprocessing**: ProcessPoolExecutor with batch chunking and low-memory mode (< 8 GB RAM) capable of processing 100 to 5,000+ page scans.

---

## Directory Layout

```
dharma_ocr/
├── pipeline.py                 # Master pipeline orchestrator
├── cli.py                      # Command-line interface
├── config.yaml                 # Complete configuration options
├── requirements.txt            # Python dependencies
├── core/                       # Schemas, config, logger, checkpoint, quality scorer
├── preprocessing/              # 600 DPI rendering, OpenCV deskew, Sauvola, CLAHE
├── engines/                    # Tesseract multi-PSM, Surya Transformer, Hybrid Manager
├── postprocessing/             # Devanagari canonicalization, Sanskrit & Hindi correctors
├── dictionaries/               # Vedic & Classical Sanskrit and Hindi religious lexicons
├── export/                     # Searchable PDF, Markdown, JSON, RAG chunks, HTML reports
├── execution/                  # Multiprocessing batch executor with memory throttling
├── tests/                      # Unit & integration test suite
└── docs/                       # Architecture, Windows & Linux guides, Scalability
```

---

## Quick Start

### 1. Installation
Refer to:
- [Windows Installation Guide](docs/WINDOWS_INSTALLATION.md)
- [Linux Installation Guide](docs/LINUX_INSTALLATION.md)

### 2. Process a Scripture PDF
```bash
python -m dharma_ocr.cli process "sources/amrtabindu_upan.pdf" --title "Amritabindu Upanishad"
```

### 3. Process Specific Page Range
```bash
python -m dharma_ocr.cli process "sources/garuda1.pdf" --pages "1-20" --workers 4
```

### 4. Resume an Interrupted 1000-Page Purana Run
```bash
python -m dharma_ocr.cli resume "sources/garuda1.pdf"
```

### 5. Inspect Quality Dashboard
```bash
python -m dharma_ocr.cli report "ocr_output/amrtabindu-upan/reports/quality_report.json"
```

---

## Documentation Links

- 🏛️ [System Architecture & Data Flow](docs/ARCHITECTURE.md)
- 🪟 [Windows Installation Instructions](docs/WINDOWS_INSTALLATION.md)
- 🐧 [Linux Installation Instructions](docs/LINUX_INSTALLATION.md)
- ⚡ [Scalability Recommendations for 500+ Page Puranas](docs/SCALABILITY_RECOMMENDATIONS.md)
