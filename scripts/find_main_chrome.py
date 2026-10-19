import subprocess
import json

cmd = ["powershell", "-NoProfile", "-Command", "Get-CimInstance Win32_Process -Filter \"Name like 'chrome%'\" | Select-Object ProcessId, CommandLine | ConvertTo-Json"]
res = subprocess.run(cmd, capture_output=True, text=True)
try:
    data = json.loads(res.stdout)
    if isinstance(data, dict):
        data = [data]
    for p in data:
        cl = p.get('CommandLine') or ''
        if '--type=' not in cl: # main browser process
            print(f"MAIN CHROME: PID={p.get('ProcessId')}")
            print(f"CommandLine: {cl}")
except Exception as e:
    print("Error parsing:", e)
    print("Raw output:", res.stdout[:500])
