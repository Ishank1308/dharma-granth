# Antigravity Agent Guidelines: Dharma Granth & Muse Spark 1.3 Contributor

## Meta Muse Spark 1.3 Contributor Integration

Antigravity has full access to Meta's **Muse Spark 1.3 Contributor** reasoning model configured for theological analysis, scriptural inquiry, and 3-pillar chapter commentary generation (भावार्थ, व्याख्या, आधुनिक संदर्भ) with `max` reasoning effort.

### How to Invoke Muse Spark from Antigravity:
- **Interactive Multi-Turn Chat**: Run `cmd /c npm run chat:muse` to start an interactive CLI chat session.
- **Direct Query Tool**: Run `cmd /c npm run ask:muse -- "<question>"` to consult Muse Spark on any philosophical, ethical, or scriptural question.
- **Commentary Drafting**: Run `cmd /c npx tsx scripts/generate-commentary-musespark.ts --scripture <id> --chapter <n> [--dry-run]` to draft 3-pillar commentaries adhering to the Gita Press standard.
- **Active Skill**: Use the `muse-spark` skill in `.agents/skills/muse-spark/SKILL.md`.

### Core Rules for Output:
1. **Language Register**: Default is standard, clear, dignified English (or matches the user's prompt). When responding in Hindi or generating Hindi commentaries, use simple, accessible, and dignified Hindi that any regular reader can understand. Everyday Hindi words (तनाव, शुरू, याद, थकान) are fine; only block Urdu/Persian vocabulary (खुदा, दुआ, इंसाफ, तसल्ली). Address the reader as 'आप'.
2. **Numbers**: Use standard ASCII digits (0-9). Do not output Devanagari numerals.
3. **Reasoning Tokens**: When using `max` reasoning effort, maintain a 32,000 `max_tokens` budget.
