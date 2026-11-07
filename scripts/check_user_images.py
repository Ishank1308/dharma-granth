import json

path = r'C:\Users\ishan\.gemini\antigravity-ide\brain\7e6631ae-2a86-4120-b9e9-51642dec3020\.system_generated\logs\transcript.jsonl'
with open(path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('type') == 'USER_INPUT':
            print(f"--- Step {data.get('step_index')} ---")
            print(data.get('content')[:300] if data.get('content') else 'None')
            if 'image' in str(data):
                print("  Contains 'image' key!")
