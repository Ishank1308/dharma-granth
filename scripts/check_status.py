import ctypes
import os
import subprocess

# Check if chrome is running
res = subprocess.run(['tasklist', '/FI', 'IMAGENAME eq chrome.exe'], capture_output=True, text=True)
chrome_running = 'chrome.exe' in res.stdout
print("Chrome running:", chrome_running)

# Check Windows Clipboard
CF_UNICODETEXT = 13
ctypes.windll.user32.OpenClipboard(None)
h_clip = ctypes.windll.user32.GetClipboardData(CF_UNICODETEXT)
if h_clip:
    p_clip = ctypes.c_wchar_p(h_clip)
    clip_text = p_clip.value
    ctypes.windll.user32.CloseClipboard()
    print("Clipboard length:", len(clip_text))
    if "user" in clip_text or "token" in clip_text or "session" in clip_text or "{" in clip_text:
        print("Relevant content on clipboard:")
        print(clip_text[:300])
        with open("scripts/session_from_clipboard.json", "w", encoding="utf-8") as f:
            f.write(clip_text)
        print("Saved to scripts/session_from_clipboard.json")
    else:
        print("Clipboard preview:", clip_text[:100])
else:
    ctypes.windll.user32.CloseClipboard()
    print("Clipboard is empty or not unicode text")
