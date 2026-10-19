import os
import sys
import json
import base64
import ctypes
import shutil
import sqlite3
import time
from ctypes import wintypes
import urllib.request

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
    if encrypted_key.startswith(b'DPAPI'):
        return unprotect_data(encrypted_key[5:])
    raise RuntimeError("Unexpected encrypted key format")

def main():
    print("Waiting for Chrome to close...")
    base_dir = r"C:\Users\ishan\AppData\Local\Google\Chrome SxS\User Data\Profile 1\Network"
    cookies_src = os.path.join(base_dir, "Cookies")
    cookies_dst = "temp_gitapress_cookies.db"

    # Wait up to 60 seconds for user to close Chrome
    for attempt in range(60):
        try:
            shutil.copyfile(cookies_src, cookies_dst)
            print("Successfully copied Chrome cookies database!")
            break
        except Exception:
            if attempt % 5 == 0:
                print(f"Waiting for Chrome to close... ({attempt}/60s)")
            time.sleep(1)
    else:
        print("ERROR: Chrome is still holding the Cookies file. Please make sure Chrome is completely closed.")
        return False

    master_key = get_chrome_master_key()
    print(f"Master key ready ({len(master_key)} bytes).")

    conn = sqlite3.connect(cookies_dst)
    cursor = conn.cursor()
    cursor.execute("SELECT host_key, name, path, encrypted_value FROM cookies WHERE host_key LIKE '%gitapress%'")
    rows = cursor.fetchall()
    print(f"Found {len(rows)} cookies for gitapress.org in database:")

    # Save encrypted cookies for Node decryption
    extracted = []
    for r in rows:
        host, name, path, enc_val = r
        extracted.append({
            'host': host,
            'name': name,
            'path': path,
            'enc_hex': enc_val.hex()
        })
        print(f"  - {name} ({len(enc_val)} bytes)")

    conn.close()
    try:
        os.remove(cookies_dst)
    except:
        pass

    with open("scripts/extracted_cookies.json", "w", encoding="utf-8") as f:
        json.dump({
            'master_key_hex': master_key.hex(),
            'cookies': extracted
        }, f, indent=2)

    print("Saved extracted cookies metadata to scripts/extracted_cookies.json.")
    return True

if __name__ == '__main__':
    main()
