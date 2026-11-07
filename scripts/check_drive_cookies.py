import sqlite3
import os
import json

base_dir = r"C:\Users\ishan\AppData\Local\Google\Chrome SxS\User Data\Profile 1\Network"
cookies_src = os.path.join(base_dir, "Cookies")
cookies_dst = "temp_google_cookies.db"

import shutil
shutil.copyfile(cookies_src, cookies_dst)
conn = sqlite3.connect(cookies_dst)
cursor = conn.cursor()
cursor.execute("SELECT host_key, name, path, encrypted_value FROM cookies WHERE host_key LIKE '%drive.google.com%' OR host_key LIKE '%.google.com%'")
rows = cursor.fetchall()
print(f"Found {len(rows)} cookies for Google/Drive in database.")
names = [r[1] for r in rows]
print("Cookie names sample:", names[:20])
conn.close()
os.remove(cookies_dst)
