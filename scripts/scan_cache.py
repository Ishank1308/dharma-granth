import os

cache_dir = r"C:\Users\ishan\AppData\Local\Google\Chrome SxS\User Data\Profile 1\Cache\Cache_Data"
if os.path.exists(cache_dir):
    files = os.listdir(cache_dir)
    print(f"Total files in Cache_Data: {len(files)}")
    matches = []
    for f in files:
        fpath = os.path.join(cache_dir, f)
        if not os.path.isfile(fpath): continue
        try:
            with open(fpath, "rb") as fp:
                data = fp.read()
                if b"gitapress.org/api" in data:
                    matches.append((f, len(data)))
        except:
            pass
    print(f"Files matching gitapress.org/api: {len(matches)}")
    for m in matches[:10]:
        print(f"  {m[0]} (size {m[1]})")
else:
    print("Cache dir does not exist")
