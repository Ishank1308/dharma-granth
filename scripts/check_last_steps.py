import json

path = r'C:\Users\ishan\.gemini\antigravity-ide\brain\7e6631ae-2a86-4120-b9e9-51642dec3020\.system_generated\logs\transcript.jsonl'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for line in lines[-10:]:
    data = json.loads(line)
    print(f"Step {data.get('step_index')} [{data.get('type')}] Source={data.get('source')}:")
    content = str(data.get('content', ''))
    if len(content) > 200:
        print("  Content (truncated):", content[:200])
    else:
        print("  Content:", content)
