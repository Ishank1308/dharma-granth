# Windows install

The scanner uses only local programs. Nothing in the base install phones a model API.

1. Install Python 3.12 for the current user:

```
winget install -e --id Python.Python.3.12 --scope user --accept-package-agreements --accept-source-agreements
```

The executable is usually:

```
%LOCALAPPDATA%\Programs\Python\Python312\python.exe
```

2. Install Tesseract 5:

```
winget install -e --id UB-Mannheim.TesseractOCR --accept-package-agreements --accept-source-agreements
```

Default location: `C:\Program Files\Tesseract-OCR\tesseract.exe`.

3. Download `san.traineddata` and `hin.traineddata` from the `tessdata_best` tree (https://github.com/tesseract-ocr/tessdata_best). Also keep `osd.traineddata` and `eng.traineddata` beside them. Point `TESSDATA_DIR` at that folder. On this machine the models already live in `C:\Users\ishan\tessdata`.

```
setx TESSERACT_CMD "C:\Program Files\Tesseract-OCR\tesseract.exe"
setx TESSDATA_DIR "C:\Users\ishan\tessdata"
```

Open a new terminal after `setx`.

4. From `tools\granth-ocr`:

```
python -m pip install -r requirements.txt
```

5. Optional, and large. Skip these for a Tesseract-only run.

```
python -m pip install -r requirements-extra.txt
python -m pip install -r requirements-surya.txt
```

Surya will not download weights while `surya_offline: true`. Fetch them once with `surya_offline` set false, then turn it back on.

6. Searchable PDFs use `C:\Windows\Fonts\nirmala.ttf`, which ships with Windows.

7. Check the philology tests, then one page:

```
python tests\test_philology.py
python pipeline.py scan --input path\to\book.pdf --slug trial --pages 1 --dpi 150 --psm 6 --no-surya
```

Ghostscript is required only if you later run OCRmyPDF from `requirements-extra.txt`. The default searchable PDF is built by PyMuPDF and does not need it.
