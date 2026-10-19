import subprocess
import os

res = subprocess.run(['tasklist', '/FI', 'IMAGENAME eq chrome.exe'], capture_output=True, text=True)
chrome_running = 'chrome.exe' in res.stdout
print("Chrome running:", chrome_running)

# Try reading cookies if chrome is closed
if not chrome_running:
    print("Chrome is NOT running! Trying to read Cookies directly...")
    import shutil
    import sqlite3
    src = r"C:\Users\ishan\AppData\Local\Google\Chrome SxS\User Data\Profile 1\Network\Cookies"
    dst = "temp_cookies_unlocked.db"
    try:
        shutil.copyfile(src, dst)
        print("Successfully copied Cookies database!")
    except Exception as e:
        print("Failed to copy Cookies:", e)
