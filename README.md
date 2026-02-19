# Shiplight Claude Code Plugin

AI-powered test automation for Claude Code — browser testing via MCP, cloud API via skill.

## Install

```bash
# Add the marketplace (one-time)
/plugin marketplace add ShiplightAI/claude-code-plugin

# Install the plugin (prompts for API_TOKEN)
/plugin install shiplight@shiplight-plugin
```

## Verify

Run `/context` in Claude Code. You should see:

- **MCP tools** — `mcp__plugin_shiplight_browser__*` tools (browser automation)
- **Skills** — `shiplight-skill` (REST API for cloud operations)

## What's included

- **MCP server** — live browser automation (sessions, navigation, actions, inspection)
- **Skill file** — direct REST API access for test cases, runs, environments, folders, accounts

## Links

- [Shiplight](https://shiplight.ai)
- [Documentation](https://docs.shiplight.ai)
