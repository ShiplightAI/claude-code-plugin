# Shiplight Claude Code Plugin

AI-powered test automation for Claude Code — ship with confidence by letting the agent verify, test, and iterate autonomously.

## Features

- **MCP tools** — gives Claude Code a real browser so it can autonomously code, verify in the browser, and iterate — closing the loop without human intervention
- **Skills** — three commands that cover the full test lifecycle:
  - `/verify` — visually confirm UI changes in the browser after a code change
  - `/create_tests` — generate e2e regression tests from code changes or app exploration
  - `/cloud` — sync and share regression tests on the cloud platform for scheduled runs, team collaboration, and CI integration

## Install

Add marketplace and install the plugin:
```bash
claude plugin marketplace add ShiplightAI/claude-code-plugin && claude plugin install --scope project mcp-plugin@shiplight-plugins
```

After installation, exit and restart Claude Code for the plugin to take effect.

## Verify Installation

Run `/context` in Claude Code. You should see:

- **MCP tools** — `plugin:shiplight:shiplight` tools
- **Skills** — `/verify`, `/create_tests`, `/cloud`

## Links

- [Shiplight](https://shiplight.ai)
- [Documentation](https://docs.shiplight.ai)
