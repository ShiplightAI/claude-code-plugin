---
name: create_tests
description: "Scaffold a local Shiplight test project, configure credentials, and write YAML tests by walking through the app in a browser."
---

# Create Local Tests

Set up a local Shiplight test project and write YAML test files by interacting with the target app in a real browser. Tests run with `npx shiplight test` — no cloud infrastructure required.

## When to use

Use `/shiplight-mcp:create_tests` when the user wants to:
- Create a new local test project from scratch
- Add YAML tests for a web application
- Set up authentication for a test project

## Prerequisites

- **Node.js** >= 22
- **AI API key** — at least one of `ANTHROPIC_API_KEY` or `GOOGLE_API_KEY`

## Steps

### 1. Gather project info

Ask the user for:
- **Project path** — where to create the project (e.g., `./my-tests`)
- **Target URL** — the web app to test (e.g., `https://app.example.com`)
- **Login credentials** (if the app requires authentication) — URL, username, password

### 2. Scaffold the project

Call `init_local_project` with the absolute project path. This creates:
- `package.json` with `shiplightai` and `@playwright/test`
- `playwright.config.ts` with `shiplightConfig()`
- `.env.example` with placeholder API keys
- `.gitignore` and `tests/` directory

### 3. Configure API keys

Create a `.env` file in the project directory with at least one AI API key:

```
ANTHROPIC_API_KEY=sk-ant-...
# or
GOOGLE_API_KEY=...
```

Ask the user which API key they want to use if not already known.

### 4. Install dependencies

Run these commands in the project directory:

```bash
npm install
npx playwright install chromium
```

### 5. Set up authentication (if needed)

If the app requires login, create `shiplight.config.json` inside a test subdirectory (e.g., `tests/my-app/shiplight.config.json`):

```json
{
  "url": "https://app.example.com",
  "username": "testuser@example.com",
  "password": "secret123"
}
```

If the app uses 2FA/TOTP, include the `totp_secret` field.

Then set up global setup for authentication:

1. Create `global-setup.ts` in the project root using `resolveLoginConfig` from `shiplightai` and `WebAgent.loginPage()` from `@shiplightai/sdk-pro` for AI-driven login.
2. Add `globalSetup: "./global-setup.ts"` and `use: { storageState: ".auth/storage-state.json" }` to `playwright.config.ts`.
3. Add `.auth/` to `.gitignore`.

See the [local testing docs](https://docs.shiplight.ai/local/local-testing#authentication-optional) for the full `global-setup.ts` code.

### 6. Write YAML tests

For each test the user wants to create:

1. **Open a browser session** — call `new_session` with the app's `starting_url`.
2. **Walk through the flow** — use `get_dom` to see the page, then `act` to perform each action. This captures locators from the response.
3. **Capture locators** — use `get_locator` for additional element info when needed.
4. **Build the YAML** — construct the `.test.yaml` content with ACTION statements using captured locators. Use `VERIFY:` for assertions.
5. **Save the test** — call `save_yaml_test` with the file path and YAML content. This validates locator coverage (minimum 50% required).
6. **Close the session** — call `close_session` when done.

**Important:** Do NOT write YAML tests from imagination. Always walk through the app in a browser session first to capture real locators. Tests without locators are rejected by `save_yaml_test`.

### 7. Verify tests run

```bash
npx shiplight test
```

## YAML Test Format

Before writing any `.test.yaml` files, read the MCP resource `shiplight://schemas/testflow-yaml-v1.3.0` for the full YAML spec including statement types, actions, templates, variables, and examples.

## Project Structure

```
my-tests/
├── playwright.config.ts
├── package.json
├── .env                          # API keys (gitignored)
├── .gitignore
├── global-setup.ts               # Only if app requires login
│
├── public-app/                   # No login needed
│   ├── search.test.yaml
│   └── filter.test.yaml
│
└── my-saas-app/                  # Requires login
    ├── shiplight.config.json     # Login credentials
    ├── dashboard.test.yaml
    └── settings.test.yaml
```

## Tips

- ACTION statements with locators replay ~10x faster than DRAFTs. Always prefer ACTIONs.
- Use `get_dom` as the primary way to understand page state. Only use `take_screenshot` when you need visual info.
- Run a specific project's tests with: `npx shiplight test my-saas-app/`
- The `.env` file is auto-discovered by `shiplightConfig()` — no manual dotenv setup needed.
