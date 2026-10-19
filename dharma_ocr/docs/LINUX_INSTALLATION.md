# Linux Installation Guide: Dharma Granth Scripture OCR

Complete step-by-step setup guide for Ubuntu, Debian, RHEL, Fedora, and Arch Linux servers and workstations.

---

## 1. System Package Installation (Ubuntu / Debian)

Update system repositories and install Tesseract 5, language packs, Poppler, and OpenGL libraries:

```bash
sudo apt update && sudo apt install -y \
    python3 \
    python3-pip \
    python3-venv \
    tesseract-ocr \
    tesseract-ocr-san \
    tesseract-ocr-hin \
    tesseract-ocr-script-deva \
    libtesseract-dev \
    poppler-utils \
    libgl1 \
    libglib2.0-0 \
    ocrmypdf \
    build-essential
```

For **RHEL / Rocky / Fedora**:
```bash
sudo dnf install -y \
    python3 \
    python3-pip \
    tesseract \
    tesseract-langpack-san \
    tesseract-langpack-hin \
    poppler-utils \
    mesa-libGL
```

For **Arch Linux**:
```bash
sudo pacman -Syu --noconfirm \
    python \
    python-pip \
    tesseract \
    tesseract-data-san \
    tesseract-data-hin \
    poppler \
    ocrmypdf
```

---

## 2. Install High-Accuracy `tessdata_best` Models

Standard Linux package repositories install the fast LSTM models. For high philological accuracy on Vedic conjuncts, replace them with `tessdata_best`:

```bash
# Locate active tessdata directory
TESSDATA_DIR=$(dpkg -L tesseract-ocr | grep -m1 "tessdata$" || echo "/usr/share/tesseract-ocr/5/tessdata")

# Download Sanskrit and Hindi tessdata_best models
sudo wget -O "${TESSDATA_DIR}/san.traineddata" \
    https://github.com/tesseract-ocr/tessdata_best/raw/main/san.traineddata

sudo wget -O "${TESSDATA_DIR}/hin.traineddata" \
    https://github.com/tesseract-ocr/tessdata_best/raw/main/hin.traineddata

# Verify languages are active
tesseract --list-langs
```

---

## 3. Python Virtual Environment Setup

Create an isolated virtual environment:

```bash
cd /path/to/dharma-granth

# Create venv
python3 -m venv venv
source venv/bin/activate

# Upgrade packaging tools
pip install --upgrade pip setuptools wheel
```

### PyTorch Setup:

**For CPU-Only Servers:**
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

**For NVIDIA GPU Servers (CUDA 12.1):**
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
```

### Install Dharma OCR Dependencies:
```bash
pip install -r dharma_ocr/requirements.txt
```

---

## 4. Headless Execution & Systemd Daemon (Optional)

For unattended processing of multi-volume scripture sets (e.g. 18 Mahapuranas):

```bash
# Process a 1,000-page Purana in the background using nohup
nohup python3 -m dharma_ocr.cli process "sources/garuda1.pdf" \
    --workers 8 \
    --title "Garuda Purana Volume 1" > garuda_run.log 2>&1 &

# Monitor real-time progress
tail -f ocr_workspace/logs/ocr_pipeline.log
```

---

## 5. Verify Installation

Run the test suite:
```bash
python3 -m unittest discover dharma_ocr/tests
```
