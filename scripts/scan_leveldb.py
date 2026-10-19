import os

dir_path = r"C:\Users\ishan\AppData\Local\Google\Chrome SxS\User Data\Profile 1\Local Storage\leveldb"
for fname in os.listdir(dir_path):
    fpath = os.path.join(dir_path, fname)
    if not os.path.isfile(fpath): continue
    try:
        with open(fpath, "rb") as f:
            content = f.read()
        if b"gitapress" in content:
            print(f"File {fname} has {len(content)} bytes and contains 'gitapress'")
            # find all occurrences of gitapress
            pos = 0
            while True:
                idx = content.find(b"gitapress", pos)
                if idx == -1: break
                s = max(0, idx - 50)
                e = min(len(content), idx + 200)
                chunk = content[s:e]
                # printable
                cleaned = "".join(chr(b) if 32 <= b < 127 else "." for b in chunk)
                print(f"  [{idx}]: {cleaned}")
                pos = idx + len(b"gitapress")
    except Exception as e:
        print(f"Could not read {fname}: {e}")
