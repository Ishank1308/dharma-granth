# Windows Installation Guide: Dharma Granth Scripture OCR

Complete step-by-step setup guide for running the 100% offline Sanskrit & Hindi OCR pipeline on Windows 10 and Windows 11 (64-bit).

---

## Prerequisites Overview

1. **Python 3.10 or 3.11 (64-bit)**
2. **Tesseract OCR 5.4+ (UB-Mannheim 64-bit)**
3. **Sanskrit & Hindi `tessdata_best` Language Models**
4. **Poppler for Windows** (Optional, for pdf2image fallback)
5. **NVIDIA CUDA Toolkit 12.x** (Optional, for GPU acceleration with Surya OCR)

---

## Step 1: Install Python 3.11

Open PowerShell as Administrator (or standard user with Winget):

```powershell
# Option A: Fast install via Winget
winget install --id Python.Python.3.11 --scope user -e

# Option B: Manual installer
# Download python-3.11.9-amd64.exe from https://www.python.org/downloads/
# CRITICAL: Check the box "Add python.exe to PATH" during installation.
```

Verify in a new PowerShell window:
```powershell
python --version
pip --version
```

---

## Step 2: Install Tesseract 5 on Windows

1. Download the official 64-bit Windows installer from the UB-Mannheim repository:
   👉 [https://github.com/UB-Mannheim/tesseract/wiki](https://github.com/UB-Mannheim/tesseract/wiki)
   Look for: `tesseract-ocr-w64-setup-5.4.0.20240606.exe` (or latest).

2. Run the installer:
   - Default install path: `C:\Program Files\Tesseract-OCR`
   - In the component selector, expand **Additional script data** and check **Devanagari script**.
   - Expand **Additional language data** and check **Sanskrit** and **Hindi**.

3. Add Tesseract to your Windows System PATH:
   - Press `Win + R`, type `sysdm.cpl`, press Enter.
   - Go to **Advanced** tab -> **Environment Variables**.
   - Under **System variables**, select `Path` -> **Edit** -> **New**.
   - Add: `C:\Program Files\Tesseract-OCR`
   - Click **OK**.

Verify:
```powershell
tesseract --version
tesseract --list-langs
```
You should see `hin` and `san` in the output.

---

## Step 3: Install High-Accuracy `tessdata_best` Models

The default models included with installers are fast models (`tessdata_fast`). For ancient scriptures and ligatures, **`tessdata_best`** models provide vastly superior accuracy.

1. Download the `best` models directly from the official repository:
   - [san.traineddata (Sanskrit Best)](https://github.com/tesseract-ocr/tessdata_best/raw/main/san.traineddata)
   - [hin.traineddata (Hindi Best)](https://github.com/tesseract-ocr/tessdata_best/raw/main/hin.traineddata)

2. Copy both `.traineddata` files into your Tesseract directory:
   ```powershell
   Copy-Item "san.traineddata" "C:\Program Files\Tesseract-OCR\tessdata\"
   Copy-Item "hin.traineddata" "C:\Program Files\Tesseract-OCR\tessdata\"
   ```

---

## Step 4: Install Poppler for Windows (Optional Fallback)

If using `pdf2image` as secondary fallback:
1. Download Poppler for Windows from: [https://github.com/oschwartz10612/poppler-windows/releases/](https://github.com/oschwartz10612/poppler-windows/releases/)
2. Extract to `C:\Program Files\poppler`
3. Add `C:\Program Files\poppler\Library\bin` to your System PATH.

*(Note: PyMuPDF is the primary rasterizer and does not require external Poppler).*

---

## Step 5: Create Python Virtual Environment & Install Dependencies

In PowerShell, navigate to the project directory:

```powershell
cd c:\Users\ishan\Music\dharma\dharma-granth

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1
```

*(If script execution is disabled in PowerShell, run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned`)*

### Install PyTorch:

**For CPU-Only:**
```powershell
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

**For NVIDIA GPU Acceleration (CUDA 12.1):**
```powershell
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
```

### Install Pipeline Requirements:
```powershell
pip install -r dharma_ocr/requirements.txt
```

---

## Step 6: Verify Installation

Run the automated scripture test suite:

```powershell
python -m unittest discover dharma_ocr/tests
```

Run a sample benchmark on an included scripture PDF:
```powershell
python -m dharma_ocr.cli process "sources/amrtabindu_upan.pdf" --pages "1-3" --title "Amritabindu Upanishad"
```

Outputs will be generated in:
- `ocr_output/amrtabindu-upan/amrtabindu-upan.md`
- `ocr_output/amrtabindu-upan/amrtabindu-upan.json`
- `ocr_output/amrtabindu-upan/amrtabindu-upan_searchable.pdf`
- `ocr_output/amrtabindu-upan/reports/quality_report.html`
