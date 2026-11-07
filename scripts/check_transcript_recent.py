import json

path = r'C:\Users\ishan\.gemini\antigravity-ide\brain\7e6631ae-2a86-4120-b9e9-51642dec3020\.system_generated\logs\transcript.jsonl'
with open(path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        idx = data.get('step_index')
        if idx and 2800 <= idx <= 2835:
            calls = [c['name'] for c in data.get('tool_calls', [])]
            if calls:
                print(f"Step {idx}: tool_calls={calls}, args={data.get('tool_calls')}")
