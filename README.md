# Shiplight Claude Code Plugins

AI-powered test automation for Claude Code — browser testing via MCP and cloud test management.

## Plugins

### shiplight-mcp (free)

Browser automation MCP tools + UI verification skill.

- **MCP tools** — live browser sessions, navigation, actions, page inspection, debugging
- **Skill** — `/verify` (aka `/shiplight-mcp:verify`) — verify UI changes in the browser using MCP tools

### shiplight-cloud (paid)

Cloud test case management via REST API.

- **Skill** — `/shiplight` (aka `/shiplight-cloud:shiplight`) — create, run, and manage test cases, environments, folders, and accounts

## Install

```bash
# Add the marketplace (one-time)
/plugin marketplace add ShiplightAI/claude-code-plugin

# Install the free plugin (browser MCP tools + verify skill)
/plugin install mcp-plugin@shiplight-plugins

# Install the cloud plugin (requires API token)
/plugin install cloud-plugin@shiplight-plugins
```

After installation, exit and restart Claude Code for the plugins to take effect.

## Verify

Run `/context` in Claude Code. You should see:

- **MCP tools** (mcp-plugin only) — `plugin:shiplight-mcp:browser` tools
- **Skills** — depends on which plugin you installed

## Known Issues

On first use, you may see a `readMcpResource` error like `Server "plugin_shiplight-mcp_browser" not found`. This is a benign Claude Code bug — it uses underscores instead of colons when resolving MCP resource names. The tool calls themselves work correctly. Simply retry the failed tool call and it will succeed.

## Links

- [Shiplight](https://shiplight.ai)
- [Documentation](https://docs.shiplight.ai)
