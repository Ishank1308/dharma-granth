# Linux install

Tested commands are for Debian or Ubuntu. The same packages exist under other names on Fedora.

```
sudo apt update
sudo apt install -y python3 python3-venv python3-pip tesseract-ocr
python3 -m venv .venv
source .venv/bin/activate
```

Tesseract from apt often has `eng` and `osd` only. Download `san.traineddata` and `hin.traineddata` from https://github.com/tesseract-ocr/tessdata_best and put them in a directory you control:

```
mkdir -p "$HOME/tessdata"
# copy san.traineddata, hin.traineddata, osd.traineddata, eng.traineddata into it
export TESSERACT_CMD="$(command -v tesseract)"
export TESSDATA_DIR="$HOME/tessdata"
```

Add those exports to the shell profile you use for long runs.

```
python -m pip install -r requirements.txt
```

Optional stacks, same as Windows:

```
python -m pip install -r requirements-extra.txt
python -m pip install -r requirements-surya.txt
```

The invisible text layer needs a Devanagari font:

```
sudo apt install -y fonts-noto-core
```

The lookup path is `/usr/share/fonts/truetype/noto/NotoSansDevanagari-Regular.ttf`. If the package installs it elsewhere, symlink that file or set the font next to the other candidates in `granth_ocr/export_pdf.py`.

One-page check:

```
python tests/test_philology.py
python pipeline.py scan --input book.pdf --slug trial --pages 1 --dpi 150 --psm 6 --no-surya
```

`poppler-utils` is not required. Rendering uses PyMuPDF. Install `ghostscript` only if you switch the export to OCRmyPDF.
