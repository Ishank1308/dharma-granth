# Dharma Granth Scripture OCR: System Architecture

```mermaid
graph TD
    A[Scanned Scripture PDF<br/>100-5000 Pages] --> B[PDF Converter<br/>PyMuPDF @ 600 DPI]
    B --> C[Page Image Cache<br/>600 DPI PNG]
    
    subgraph Preprocessing [OpenCV Computer Vision Preprocessing]
        C --> D[Quality Analyzer<br/>Contrast, Blur, Skew, Bleed]
        D --> E[Deskew & Orientation<br/>Hough / MinAreaRect]
        E --> F[Border & Gutter Removal]
        F --> G[Bleed-Through Attenuation]
        G --> H[CLAHE & Bilateral Denoising]
        H --> I[Sauvola Adaptive Binarization]
        I --> J[Morphology Shirorekha Repair]
    end
    
    subgraph OCR_Routing [Hybrid Intelligent Engine Router]
        J --> K{Quality Score >= 45 &<br/>Not Blurred?}
        K -- Yes --> L[Tesseract Neural OCR<br/>san+hin, OEM 1, PSM 3,4,6,11]
        K -- No / Degraded --> M[Surya OCR Fallback<br/>Transformer Architecture]
        L --> N{Tesseract Confidence<br/>>= 72%?}
        N -- Yes --> O[Optimal OCR Result]
        N -- Low Confidence --> M
        M --> O
    end
    
    subgraph PostProcessing [Philological Correction & Extraction]
        O --> P[Unicode NFC Canonicalizer]
        P --> Q[PUA Ligature Decoder<br/>LaTeX XDvng / Legacy Maps]
        Q --> R[Matra & Floating Reph Normalizer]
        R --> S[Sanskrit Lexicon & Ligature Corrector<br/>Vedas, Puranas, Gita, Epics]
        S --> T[Hindi Corrector<br/>IndicNLP & SymSpell]
        T --> U[Chapter Detector<br/>Adhyaya, Skandha, Parva, Sarga]
        U --> V[Verse / Shloka Parser<br/>Cadences & Cross-Page Stitching]
    end
    
    subgraph Resilience [Fault-Tolerance & State Management]
        V --> W[Atomic Checkpoint Manager<br/>Page-by-Page Progress]
        W --> X[ProcessPoolExecutor<br/>Batch Memory Management]
    end
    
    subgraph Publication [Multi-Format Exports]
        V --> Y[Searchable PDF/A<br/>OCRmyPDF / PyMuPDF Overlay]
        V --> Z[Hierarchical Markdown<br/>Table of Contents & Stanzas]
        V --> AA[Master Scripture JSON<br/>+ RAG Vector Chunks]
        V --> AB[Plain Unicode TXT]
        V --> AC[Quality Reports<br/>HTML Dashboard, MD, JSON]
    end
```

---

## 1. Core Architectural Pillars

### 1.1 100% Offline Air-Gapped Invariant
- **Zero Cloud APIs**: No OpenAI, Google Vision, AWS Textract, or Azure Cognitive Services.
- **Local Neural Models**: Tesseract LSTM (`tessdata_best` models `san.traineddata` and `hin.traineddata`) and Surya OCR local weights run completely on local CPU or NVIDIA GPU.
- **Zero Subscription Costs**: Built entirely on free, open-source permissive tools (Apache 2.0 / MIT / BSD).

### 1.2 600 DPI Scripture Rendering
Devanagari script relies heavily on fine typographic details:
- **Shirorekha** (top horizontal headline).
- **Halants / Viramas** (्) denoting consonant clusters.
- **Vedic Swaras** (Udatta `॑` and Anudatta `॒`).
- **Anusvara** (ं) vs **Chandrabindu** (ँ).
- **Nuanced Matras** (ि vs ी, ु vs ू, ृ vs ॄ).

Standard 300 DPI scans blur these fine marks into ink specks. The pipeline enforces **600 DPI rasterization** via PyMuPDF C-native bindings, generating high-frequency edge information essential for accurate character recognition.

### 1.3 Hybrid Engine Routing (Tesseract + Surya)
- **Tesseract 5 LSTM (OEM 1)**: Highly optimized C++ implementation. Evaluates multiple Page Segmentation Modes (PSMs: 3, 4, 6, 11) dynamically and processes standard high-contrast pages at 1.5–3.0 seconds per page.
- **Surya OCR (Vision Transformer)**: Deep learning layout detection and sequence recognition model. Activated automatically whenever page quality is below threshold, text is severely warped or blurred, or Tesseract confidence falls below 72%. Excels at two-column commentaries, marginal glosses, and 19th-century lithographic script.

### 1.4 Philological Sanskrit & Hindi Post-Processing
Scanned Indian PDFs from the 1990s through 2010s often utilized non-Unicode legacy fonts (KrutiDev, Chanakya, DV-TTSurekh, or LaTeX XDvng font encodings using the Unicode Private Use Area `\uE000 - \uF8FF`).
- **PUA Ligature Decoder**: Maps over 50 legacy Private Use Area glyphs directly to canonical Unicode Devanagari conjuncts (`क्त`, `द्ध`, `द्य`, `द्व`, `ज्ञ`, `क्ष`, etc.).
- **Matra & Reph Normalization**: Corrects inverted reph markers (Consonant + Halant + Ra) and reconnects detached matras.
- **Domain Lexicon**: Built-in verification dictionary covering Vedas, Upanishads, Mahabharata, Ramayana, and Puranas, ensuring correct spelling of core vocabulary.

### 1.5 Cross-Page Boundary Stitcher
Traditional OCR pipelines process pages as isolated islands. In classical Puranas and epics, a 32-syllable Anustubh shloka frequently begins on the bottom line of Page N and concludes on the first line of Page N+1. The verse extraction engine preserves dangling lines across page transitions and stitches them into unified stanza objects.

### 1.6 Atomic Checkpoint & Fault Recovery
Processing a 1,500-page Purana scan can take several hours on CPU hardware. The pipeline employs an atomic write-and-replace checkpointing system. If power fails or the job is paused, execution resumes from the exact page where it stopped, saving hours of redundant compute.
