import sqlite3
import os

conn = sqlite3.connect("temp_history.db")
cursor = conn.cursor()
cursor.execute("SELECT url, title, visit_count, last_visit_time FROM urls WHERE url LIKE '%gitapress%' ORDER BY last_visit_time DESC LIMIT 30")
rows = cursor.fetchall()
print(f"Found {len(rows)} visited gitapress URLs:")
for r in rows:
    print(f"  {r[0]} | {r[1]}")
conn.close()
os.remove("temp_history.db")
