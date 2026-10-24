# Antigravity Agent Guidelines: Dharma Granth & Muse Spark 1.3 Contributor

## Meta Muse Spark 1.3 Contributor Integration

Antigravity has full access to Meta's **Muse Spark 1.3 Contributor** reasoning model configured for theological analysis, scriptural inquiry, and 4-layer chapter commentary generation with `max` reasoning effort.

### How to Invoke Muse Spark from Antigravity:
- **Interactive Multi-Turn Chat**: Run `cmd /c npm run chat:muse` to start an interactive CLI chat session.
- **Direct Query Tool**: Run `cmd /c npm run ask:muse -- "<question>"` to consult Muse Spark on any philosophical, ethical, or scriptural question.
- **Commentary Drafting**: Run `cmd /c npx tsx scripts/generate-commentary-musespark.ts --scripture <id> --chapter <n> [--dry-run]` to draft 4-layer commentaries adhering to the Gita Press standard.
- **Active Skill**: Use the `muse-spark` skill in `.agents/skills/muse-spark/SKILL.md`.

### Core Rules for Output:
1. **Hindi Register**: Dignified tatsam Hindi (Gita Press standard), addressing the user as 'आप'. Avoid colloquialisms and Urdu/Persian vocabulary.
2. **Numbers**: Use standard ASCII digits (0-9). Do not output Devanagari numerals.
3. **Reasoning Tokens**: When using `max` reasoning effort, maintain a 32,000 `max_tokens` budget.
