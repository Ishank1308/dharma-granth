import ctypes
import os
import sqlite3
import json
import base64
from ctypes import wintypes

class DATA_BLOB(ctypes.Structure):
    _fields_ = [('cbData', wintypes.DWORD), ('pbData', ctypes.POINTER(ctypes.c_char))]

def unprotect_data(encrypted_bytes):
    blob_in = DATA_BLOB(len(encrypted_bytes), ctypes.cast(ctypes.c_char_p(encrypted_bytes), ctypes.POINTER(ctypes.c_char)))
    blob_out = DATA_BLOB()
    res = ctypes.windll.crypt32.CryptUnprotectData(ctypes.byref(blob_in), None, None, None, None, 0, ctypes.byref(blob_out))
    if not res:
        return None
    out_bytes = ctypes.string_at(blob_out.pbData, blob_out.cbData)
    ctypes.windll.kernel32.LocalFree(blob_out.pbData)
    return out_bytes

def get_master_key():
    p = r"C:\Users\ishan\AppData\Local\Google\Chrome SxS\User Data\Local State"
    with open(p, 'r', encoding='utf-8') as f:
        local_state = json.load(f)
    k = base64.b64decode(local_state['os_crypt']['encrypted_key'])
    return unprotect_data(k[5:])

master_key = get_master_key()

kernel32 = ctypes.windll.kernel32
GENERIC_READ = 0x80000000
FILE_SHARE_READ = 1
FILE_SHARE_WRITE = 2
FILE_SHARE_DELETE = 4
OPEN_EXISTING = 3
FILE_ATTRIBUTE_NORMAL = 0x80

profiles = ['Default', 'Profile 1', 'Profile 2', 'Profile 4', 'Profile 6']
base = r"C:\Users\ishan\AppData\Local\Google\Chrome SxS\User Data"

all_extracted = []

for prof in profiles:
    cpath = os.path.join(base, prof, 'Network', 'Cookies')
    if not os.path.exists(cpath):
        continue
    h = kernel32.CreateFileW(cpath, GENERIC_READ, FILE_SHARE_READ | FILE_SHARE_WRITE | FILE_SHARE_DELETE, None, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, None)
    if h == -1:
        print(f"Cannot open {prof} (locked or access denied)")
        continue
    
    size = kernel32.GetFileSize(h, None)
    buf = ctypes.create_string_buffer(size)
    read_bytes = wintypes.DWORD()
    kernel32.ReadFile(h, buf, size, ctypes.byref(read_bytes), None)
    kernel32.CloseHandle(h)
    
    tmp_file = f"temp_{prof.replace(' ', '_')}.db"
    with open(tmp_file, 'wb') as f:
        f.write(buf.raw[:read_bytes.value])
        
    try:
        conn = sqlite3.connect(tmp_file)
        c = conn.cursor()
        c.execute("SELECT host_key, name, path, encrypted_value FROM cookies WHERE host_key LIKE '%gitapress%'")
        rows = c.fetchall()
        conn.close()
        if rows:
            print(f"Found {len(rows)} cookies in {prof}!")
            for r in rows:
                print(f"  [{prof}] {r[1]} ({len(r[3])} bytes)")
                all_extracted.append({
                    'profile': prof,
                    'name': r[1],
                    'enc_hex': r[3].hex()
                })
        else:
            print(f"No gitapress cookies in {prof}")
    except Exception as e:
        print(f"Error reading {prof}: {e}")
    finally:
        if os.path.exists(tmp_file):
            try:
                os.remove(tmp_file)
            except:
                pass

if all_extracted:
    with open('scripts/extracted_cookies_all.json', 'w', encoding='utf-8') as f:
        json.dump({'master_key_hex': master_key.hex(), 'cookies': all_extracted}, f, indent=2)
    print("SUCCESS! Saved to scripts/extracted_cookies_all.json")
else:
    print("No gitapress cookies found in any Chrome SxS profile.")
