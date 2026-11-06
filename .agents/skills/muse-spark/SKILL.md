---
name: muse-spark
description: Direct theological reasoning and scriptural analysis powered by Meta's Muse Spark 1.3 Contributor model with max reasoning effort. Use when the user asks for in-depth philosophical guidance, scriptural commentaries, ethical dilemma resolution, or Sanskrit analysis.
---

# Muse Spark 1.3 Contributor Skill for Antigravity

This skill connects Antigravity to **Meta Muse Spark 1.3 Contributor**, Meta's deep-reasoning model configured with `max` reasoning effort for exhaustive theological inquiry, scriptural commentary, and dignified Hindi analysis.

## When to Use

Activate this skill when:
- The user asks to "consult Muse", "ask Muse Spark", or use Muse for scriptural/theological reasoning.
- Running multi-turn interactive CLI chats with Muse.
- Generating, drafting, or auditing 3-pillar canonical chapter commentaries (भावार्थ, व्याख्या, आधुनिक संदर्भ) (`scripts/generate-commentary-musespark.ts`).
- Answering complex life dilemmas with canonical Sanskrit citations and Gita Press-style dignified Hindi.

## How to Query Muse Spark from Antigravity

### 1. Interactive Multi-Turn Chat
```powershell
cmd /c npm run chat:muse
```
Commands available inside chat:
- `/prompt [text|reset]`: View active system prompt, set custom prompt to work with, or reset
- `/lang <en|hi>`: Switch language (`en` default, `hi` for dignified Hindi)
- `/model <id>`: Switch model (e.g. `muse-spark-1.3-contributor`, `muse-spark-1.3`, `muse-spark-1.2`)
- `/effort <level>`: Change reasoning effort (`minimal`, `low`, `medium`, `high`, `xhigh`, `max`)
- `/clear`: Reset conversation history
- `/history`: Show message count
- `/exit`: End session

### 2. One-Shot Query Tool
```powershell
cmd /c npm run ask:muse -- "Your philosophical inquiry or custom prompt"
```

Options:
- `--prompt "<text>"`: Custom system prompt override to work with specific instructions.
- `--hi`: Force dignified accessible Hindi response.
- `--model "<model>"`: Model name (default: `muse-spark-1.3-contributor`).
- `--effort "<level>"`: Reasoning effort (default: `max`).
- `--key "<key>"`: Custom API key override (defaults to `MUSE_SPARK_API_KEY` in `.env.local`).

## Drafting Scripture Commentary
```powershell
cmd /c npm run generate:commentary:muse -- --scripture <id> --chapter <n> [--verses 1-10] [--dry-run]
```

## Guidelines for Muse Spark Outputs
1. **Core Theological Lens — Lokasamgraha (लोकसंग्रह)**: Ground all analysis, ethics, and commentary in the saintly perspective of Lokasamgraha (universal welfare, holding together of society, and selfless compassionate duty). Hindu saints were never escapists; their teachings turn wisdom into righteous social service (*सर्वभूतहिते रताः*).
2. **Language Register**: Default is clear, dignified English (or inquiry prompt language). For Hindi commentary/responses: simple, accessible, dignified Hindi (everyday words fine, no Urdu/Persian, 'आप' honorific).
3. **Numbers**: ASCII 0-9 only (1, 2, 3), zero Devanagari numerals.
4. **Token Budget**: With `max` reasoning effort, maintain a 32,000 `max_tokens` budget to prevent reasoning truncation.
