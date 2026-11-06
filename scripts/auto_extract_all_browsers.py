import os
import sys
import json
import base64
import ctypes
import shutil
import sqlite3
import glob
from ctypes import wintypes

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
        return None
    out_bytes = ctypes.string_at(blob_out.pbData, blob_out.cbData)
    ctypes.windll.kernel32.LocalFree(blob_out.pbData)
    return out_bytes

def get_master_key(user_data_path):
    local_state_path = os.path.join(user_data_path, "Local State")
    if not os.path.exists(local_state_path):
        return None
    try:
        with open(local_state_path, "r", encoding="utf-8") as f:
            local_state = json.load(f)
        encrypted_key = base64.b64decode(local_state["os_crypt"]["encrypted_key"])
        if encrypted_key.startswith(b'DPAPI'):
            return unprotect_data(encrypted_key[5:])
    except Exception as e:
        print(f"Error getting master key from {local_state_path}: {e}")
    return None

browser_roots = [
    r"C:\Users\ishan\AppData\Local\Google\Chrome\User Data",
    r"C:\Users\ishan\AppData\Local\Google\Chrome SxS\User Data",
    r"C:\Users\ishan\AppData\Local\Microsoft\Edge\User Data",
]

found_cookies = []

for root in browser_roots:
    if not os.path.exists(root):
        continue
    master_key = get_master_key(root)
    if not master_key:
        continue
    
    # Check all profile folders
    profiles = glob.glob(os.path.join(root, "Default")) + glob.glob(os.path.join(root, "Profile *"))
    for p in profiles:
        cookie_paths = [
            os.path.join(p, "Network", "Cookies"),
            os.path.join(p, "Cookies")
        ]
        for cpath in cookie_paths:
            if not os.path.exists(cpath):
                continue
            tmp_db = f"temp_cookies_{os.getpid()}.db"
            try:
                shutil.copyfile(cpath, tmp_db)
            except Exception as e:
                # File might be locked, try shadow or skip
                continue
            
            try:
                conn = sqlite3.connect(tmp_db)
                cursor = conn.cursor()
                cursor.execute("SELECT host_key, name, path, encrypted_value FROM cookies WHERE host_key LIKE '%gitapress%'")
                rows = cursor.fetchall()
                conn.close()
                if rows:
                    print(f"Found {len(rows)} gitapress cookies in {p}!")
                    for r in rows:
                        found_cookies.append({
                            'master_key_hex': master_key.hex(),
                            'host': r[0],
                            'name': r[1],
                            'path': r[2],
                            'enc_hex': r[3].hex(),
                            'source': p
                        })
            except Exception as e:
                pass
            finally:
                if os.path.exists(tmp_db):
                    try:
                        os.remove(tmp_db)
                    except:
                        pass

if found_cookies:
    # Save the best ones
    print(f"Total cookies found across all profiles: {len(found_cookies)}")
    with open("scripts/extracted_cookies_all.json", "w", encoding="utf-8") as f:
        json.dump(found_cookies, f, indent=2)
    sys.exit(0)
else:
    print("No gitapress cookies found across any browser profile.")
    sys.exit(1)
