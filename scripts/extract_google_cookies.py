import sqlite3
import os
import json
import base64
import ctypes
from ctypes import wintypes
import shutil

class DATA_BLOB(ctypes.Structure):
    _fields_ = [
        ('cbData', wintypes.DWORD),
        ('pbData', ctypes.POINTER(ctypes.c_char))
    ]

def unprotect_data(encrypted_bytes):
    blob_in = DATA_BLOB(len(encrypted_bytes), ctypes.cast(ctypes.c_char_p(encrypted_bytes), ctypes.POINTER(ctypes.c_char)))
    blob_out = DATA_BLOB()
    res = ctypes.windll.crypt32.CryptUnprotectData(
        ctypes.byref(blob_in), None, None, None, None, 0, ctypes.byref(blob_out)
    )
    if not res:
        raise RuntimeError("CryptUnprotectData failed")
    out_bytes = ctypes.string_at(blob_out.pbData, blob_out.cbData)
    ctypes.windll.kernel32.LocalFree(blob_out.pbData)
    return out_bytes

def get_chrome_master_key():
    local_state_path = r"C:\Users\ishan\AppData\Local\Google\Chrome SxS\User Data\Local State"
    with open(local_state_path, "r", encoding="utf-8") as f:
        local_state = json.load(f)
    encrypted_key = base64.b64decode(local_state["os_crypt"]["encrypted_key"])
    return unprotect_data(encrypted_key[5:])

master_key = get_chrome_master_key()

base_dir = r"C:\Users\ishan\AppData\Local\Google\Chrome SxS\User Data\Profile 1\Network"
cookies_src = os.path.join(base_dir, "Cookies")
cookies_dst = "temp_google_cookies.db"
shutil.copyfile(cookies_src, cookies_dst)

conn = sqlite3.connect(cookies_dst)
cursor = conn.cursor()
cursor.execute("SELECT host_key, name, path, encrypted_value FROM cookies WHERE host_key LIKE '%drive.google.com%' OR host_key LIKE '%.google.com%'")
rows = cursor.fetchall()

extracted = []
for r in rows:
    host, name, path, enc_val = r
    extracted.append({
        'host': host,
        'name': name,
        'path': path,
        'enc_hex': enc_val.hex()
    })

conn.close()
os.remove(cookies_dst)

with open("scripts/extracted_google_cookies.json", "w", encoding="utf-8") as f:
    json.dump({
        'master_key_hex': master_key.hex(),
        'cookies': extracted
    }, f, indent=2)

print(f"Extracted {len(extracted)} Google cookies to scripts/extracted_google_cookies.json")
