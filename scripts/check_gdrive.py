import urllib.request
import urllib.parse
import http.cookiejar
import re

file_id = '1BLJEJzGBNc8YTVeGFp7OuXR9vx3Ej5NU'
cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

# First request to get confirm token and cookies
url = f'https://drive.google.com/uc?export=download&id={file_id}'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with opener.open(req) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

print("Page HTML sample:")
print(html[:1000])

# Look for confirm token or form action
# Patterns: confirm=([0-9A-Za-z_]+) or name="uuid" or name="confirm"
match = re.search(r'confirm=([0-9A-Za-z_]+)', html)
uuid_match = re.search(r'name="uuid"\s+value="([^"]+)"', html)
print("Confirm token match:", match.group(1) if match else None)
print("UUID match:", uuid_match.group(1) if uuid_match else None)
