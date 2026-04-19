# Shiplight Claude Code Plugin (deprecated)

> **This repo is deprecated.** Skills and MCP installation have moved to [ShiplightAI/agent-skills](https://github.com/ShiplightAI/agent-skills), which supports Claude Code and 40+ other coding agents from a single source.

## Migrate

Install skills and the MCP server in one step:

```bash
npx -y skills add ShiplightAI/agent-skills -a claude-code -y && \
npx -y add-mcp "npx -y @shiplightai/mcp@latest" -n shiplight --env PWDEBUG=console -a claude-code -y
```

Restart Claude Code after install. Run `/context` to verify the `shiplight` MCP tools and the `/verify`, `/create_e2e_tests`, `/triage`, `/cloud`, and review skills are available.

Full install guide: [docs.shiplight.ai quick start](https://docs.shiplight.ai/getting-started/quick-start).

## Why this moved

The Claude Code / Cursor / Codex plugin repos have been consolidated into a single source of truth. The [`skills`](https://www.npmjs.com/package/skills) CLI installs skills across 40+ agents; [`add-mcp`](https://www.npmjs.com/package/add-mcp) installs the MCP server. One update reaches every supported agent.

## Existing installs

The old marketplace install still works, but it won't receive new skills or fixes. Re-install with the commands above to stay current.

## Links

- [Shiplight](https://shiplight.ai)
- [Documentation](https://docs.shiplight.ai)
- [New skills repo](https://github.com/ShiplightAI/agent-skills)
