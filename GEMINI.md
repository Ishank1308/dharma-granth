# Antigravity Workspace Instructions: Dharma Granth & Meta Muse Spark 1.3

## Meta Muse Spark 1.3 Contributor AI Agent Integration

This workspace has full integration with Meta's **Muse Spark 1.3 Contributor** model for philosophical reasoning, theological analysis, and scriptural commentary.

### Tools & Capabilities Available to the Antigravity Chat Agent:
1. **Interactive CLI Chat**: Run `cmd /c npm run chat:muse` (interactive multi-turn session with `muse-spark-1.3-contributor` and `effort: max`).
2. **Direct CLI Query**: Run `cmd /c npm run ask:muse -- "<query>"` (or with custom `--model` / `--effort`).
3. **MCP Tool**: `ask_muse_spark` (configured in `.agents/mcp_config.json` running `scripts/mcp-muse-server.mjs`).
4. **Commentary Generation**: `cmd /c npx tsx scripts/generate-commentary-musespark.ts --scripture <id> --chapter <n> [--verses 1-10] [--dry-run]`.
5. **Antigravity Skill**: `.agents/skills/muse-spark/SKILL.md`.

### Core Standards:
- **Default Model**: `muse-spark-1.3-contributor` (also supports `muse-spark-1.3`).
- **Reasoning Effort**: Defaults to `max` with a 32,000 token budget to allow deep contemplation without token truncation.
- **Language Register**: Default is standard, clear, dignified English (or matches inquiry prompt). For Hindi commentary or queries: dignified accessible Hindi (common words fine; Urdu/Persian blocked; 'आप' honorific).
- **Numerals**: ASCII 0-9 only, zero Devanagari numerals.
