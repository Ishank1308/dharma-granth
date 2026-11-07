# Performance & Scalability Recommendations: Processing 500+ to 5000+ Page Purana Scans

This guide details enterprise-scale optimization techniques for digitizing multi-volume Hindu scriptures (18 Mahapuranas, Mahabharata, Ramayana, 108 Upanishads, and Vedic Samhitas) completely offline on local consumer or workstation hardware.

---

## 1. Scripture Scale & Computational Profile

The 18 Mahapuranas and Itihasas represent one of the largest classical literary corpora in human civilization:

| Scripture | Typical Volume | Average Pages | Shlokas / Verses | Estimated Raw PNG Size (600 DPI) |
| :--- | :--- | :--- | :--- | :--- |
| **Garuda Purana** | 1–2 Volumes | 800 – 1,200 | ~19,000 | 12 – 18 GB |
| **Shiv Purana** | 2–4 Volumes | 2,000 – 3,500 | ~24,000 | 30 – 52 GB |
| **Bhagavata Purana** | 2–4 Volumes | 2,500 – 4,000 | ~18,000 | 37 – 60 GB |
| **Mahabharata** | 6–10 Volumes | 5,000 – 8,000 | ~100,000 | 75 – 120 GB |
| **Skanda Purana** | 7–20 Volumes | 6,000 – 12,000 | ~81,000 | 90 – 180 GB |

---

## 2. Memory & Disk Management for Large Batches

### 2.1 The 600 DPI Disk Footprint Trap
- A single 600 DPI uncompressed RGB page rendered from a PDF is approximately `4960 x 7016` pixels, consuming **~100 MB of uncompressed memory in RAM** and **~15 MB as a PNG on disk**.
- If a pipeline attempts to render all 2,000 pages of a Purana up front, it requires **~30 GB of disk storage** just for raw images.
- **Solution implemented in Dharma OCR**:
  - **Batch Chunking**: Pages are rendered and processed in configurable streaming batches (default: 15–20 pages).
  - **Immediate Artifact Pruning (`low_memory_mode: true`)**: The raw 600 DPI PNG is unlinked immediately after preprocessing and OCR execution, keeping disk usage under 2 GB regardless of whether the book has 100 or 5,000 pages.

### 2.2 Python Garbage Collection & Subprocess Isolation
- PyMuPDF, OpenCV, and PyTorch allocate memory inside underlying C++ runtimes that standard Python garbage collection (`gc.collect()`) cannot always aggressively release when looping over thousands of pages.
- **Solution implemented in Dharma OCR**:
  - The `ProcessPoolExecutor` spawns dedicated worker processes that terminate and refresh between major batch boundaries. This provides an ironclad OS-level guarantee against RAM creep during 10+ hour continuous runs.

---

## 3. CPU vs GPU Hardware Allocation

### 3.1 Tesseract 5 (CPU-Optimized)
- Tesseract's neural LSTM engine runs on CPU using OpenMP and AVX2 vector instructions.
- **Optimal Worker Count**: Set `max_workers` to `CPU Physical Cores - 1`.
  - On an 8-core CPU (e.g. Ryzen 7 / Intel i7): Set `max_workers: 6` or `7`.
  - Running more workers than physical cores causes CPU throttling and context-switching overhead.
- **Throughput**: ~1.8 to 2.5 seconds per page on modern x86-64 processors.
  - A 1,000-page Purana finishes in **~35 to 45 minutes**.

### 3.2 Surya OCR (GPU-Accelerated)
- Surya utilizes Vision Transformers (`DetectionPredictor` + `RecognitionPredictor`) which achieve massive throughput gains on NVIDIA GPUs.
- **VRAM Requirements**:
  - `4 GB VRAM` (RTX 3050 / GTX 1650): Set `batch_size: 2`.
  - `8 GB VRAM` (RTX 3060 / 4060): Set `batch_size: 4`.
  - `16+ GB VRAM` (RTX 4080 / 4090 / A100): Set `batch_size: 8` or `12`.
- **Throughput**: ~0.4 to 0.8 seconds per page on an RTX 3060/4060.
  - A 1,000-page Purana finishes in **~12 to 15 minutes**.

---

## 4. Multi-Volume Pipeline Execution Strategy

When processing 18 Mahapuranas or multi-volume sets:

1. **Keep Volumes Separate**:
   Process each volume as an independent run with its own slug and checkpoint (e.g. `garuda-purana-vol-1`, `garuda-purana-vol-2`).
2. **Combine via Schema Manifest**:
   Use the JSON export schema to link multiple volumes together in the database or vector store under a parent `scripture_id`.
3. **Automate Nightly Batch Runs**:
   Use a simple PowerShell or Bash loop:
   ```bash
   for pdf in sources/*.pdf; do
       python -m dharma_ocr.cli process "$pdf" --workers 6
   done
   ```
4. **Instant Recovery**:
   If a system restart or power interruption occurs at Page 847 of a 1,500-page scan, run:
   ```bash
   python -m dharma_ocr.cli resume "sources/shiv_purana_vol1.pdf"
   ```
   The pipeline resumes seamlessly from Page 848 without repeating earlier work.
