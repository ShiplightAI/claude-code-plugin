# Shiplight Claude Code Plugins

AI-powered test automation for Claude Code — browser testing via MCP, local verification, and cloud test management.

## Plugins

### shiplight (free)

Browser automation MCP tools + local test verification.

- **MCP tools** — live browser sessions, navigation, actions, page inspection
- **Skill** — `/shiplight-mcp:verify` — verify UI changes in the browser using MCP tools

### shiplight-cloud (paid)

Browser automation MCP tools + cloud test case management via REST API.

- **MCP tools** — live browser sessions, navigation, actions, page inspection
- **Skill** — `/shiplight-cloud:shiplight` — create, run, and manage test cases, environments, folders, and accounts

## Install

```bash
# Add the marketplace (one-time)
/plugin marketplace add ShiplightAI/claude-code-plugin

# Install the free plugin
/plugin install shiplight@shiplight-plugin

# Install the cloud plugin (requires API token)
/plugin install shiplight-cloud@shiplight-plugin
```

## Verify

Run `/context` in Claude Code. You should see:

- **MCP tools** — `mcp__plugin_shiplight_browser__*` (or `mcp__plugin_shiplight-cloud_browser__*`)
- **Skills** — depends on which plugin you installed

## Links

- [Shiplight](https://shiplight.ai)
- [Documentation](https://docs.shiplight.ai)
