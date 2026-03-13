# Shiplight Claude Code Plugin

AI-powered test automation for Claude Code — browser testing, local YAML test authoring, and cloud test management in a single plugin.

## Features

- **MCP tools** — live browser sessions, navigation, actions, page inspection, debugging, and cloud sync
- **Skills:**
  - `/verify` — verify UI changes in the browser using MCP tools
  - `/create_tests` — scaffold a local test project, configure credentials, and write YAML tests by walking through the app in a browser
  - `/cloud` — create, run, and manage test cases, environments, folders, and accounts in the cloud

Cloud tools (`save_test_case`, `get_test_case`, etc.) are automatically available when `SHIPLIGHT_API_TOKEN` is set in the project's `.env` file.

## Install

Add marketplace and install the plugin:
```bash
claude plugin marketplace add ShiplightAI/claude-code-plugin && claude plugin install --scope project mcp-plugin@shiplight-plugins
```

After installation, exit and restart Claude Code for the plugin to take effect.

## Verify

Run `/context` in Claude Code. You should see:

- **MCP tools** — `plugin:shiplight:shiplight` tools
- **Skills** — `/verify`, `/create_tests`, `/cloud`

## Known Issues

On first use, you may see a `readMcpResource` error like `Server "plugin_shiplight_shiplight" not found`. This is a benign Claude Code bug — it uses underscores instead of colons when resolving MCP resource names. The tool calls themselves work correctly. Simply retry the failed tool call and it will succeed.

## Links

- [Shiplight](https://shiplight.ai)
- [Documentation](https://docs.shiplight.ai)
