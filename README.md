# Shiplight Claude Code Plugin

AI-powered test automation for Claude Code — ship with confidence by letting the agent verify, test, and iterate autonomously.

## Features

- **MCP tools** — gives Claude Code a real browser so it can autonomously code, verify in the browser, and iterate — closing the loop without human intervention
- **Skills** — commands that cover the full test and review lifecycle:
  - `/verify` — visually confirm UI changes in the browser after a code change
  - `/create_e2e_tests` — spec-driven E2E test creation with structured discovery phases
  - `/cloud` — sync and share regression tests on the cloud platform for scheduled runs, team collaboration, and CI integration
  - `/review` — orchestrator that recommends the right reviews for your app
  - `/design-review` — visual quality, responsive, accessibility, typography, i18n
  - `/security-review` — OWASP Top 10, auth, injection, access control, supply chain
  - `/privacy-review` — PII leakage, consent, tracking, data flows, user rights
  - `/compliance-review` — HIPAA, SOC 2, PCI-DSS, GDPR technical requirements
  - `/resilience-review` — error handling, graceful degradation, edge states, API contracts
  - `/performance-review` — Core Web Vitals, bundles, resources, runtime performance
  - `/seo-review` — meta tags, structured data, crawlability, semantic HTML
  - `/geo-review` — AI citation readiness, llms.txt, entity clarity, AI search testing

## Install

Add marketplace and install the plugin:
```bash
claude plugin marketplace add ShiplightAI/claude-code-plugin && claude plugin install --scope project mcp-plugin@shiplight-plugins
```

After installation, exit and restart Claude Code for the plugin to take effect.

## Verify Installation

Run `/context` in Claude Code. You should see:

- **MCP tools** — `plugin:shiplight:shiplight` tools
- **Skills** — `/verify`, `/create_e2e_tests`, `/cloud`, `/review`, `/design-review`, `/security-review`, `/privacy-review`, `/compliance-review`, `/resilience-review`, `/performance-review`, `/seo-review`, `/geo-review`

## Links

- [Shiplight](https://shiplight.ai)
- [Documentation](https://docs.shiplight.ai)
