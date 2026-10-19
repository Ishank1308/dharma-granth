import json

path = r'C:\Users\ishan\.gemini\antigravity-ide\brain\7e6631ae-2a86-4120-b9e9-51642dec3020\.system_generated\logs\transcript.jsonl'
with open(path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        idx = data.get('step_index')
        if idx and 2815 <= idx <= 2830:
            print(f"=== Step {idx} [{data.get('type')}] ===")
            print("Content:", str(data.get('content'))[:400])
            if data.get('tool_calls'):
                print("Tool calls:", data.get('tool_calls'))
