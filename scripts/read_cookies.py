import sqlite3
import shutil
import os
import subprocess
import json

base_dir = r"C:\Users\ishan\AppData\Local\Google\Chrome SxS\User Data"
profiles = ["Profile 1", "Default", "Profile 2", "Profile 4", "Profile 6"]

for prof in profiles:
    cookie_path = os.path.join(base_dir, prof, "Network", "Cookies")
    if os.path.exists(cookie_path):
        temp_copy = f"temp_cookies_{prof.replace(' ', '_')}.db"
        try:
            shutil.copyfile(cookie_path, temp_copy)
            conn = sqlite3.connect(temp_copy)
            cursor = conn.cursor()
            cursor.execute("SELECT host_key, name, path, encrypted_value FROM cookies WHERE host_key LIKE '%gitapress%'")
            rows = cursor.fetchall()
            print(f"[{prof}] Found {len(rows)} cookies for gitapress:")
            for r in rows:
                print(f"  {r[0]} | {r[1]} | length: {len(r[3])}")
            conn.close()
            os.remove(temp_copy)
        except Exception as e:
            print(f"[{prof}] Error: {e}")
