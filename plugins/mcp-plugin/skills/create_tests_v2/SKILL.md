---
name: create_tests_v2
description: "Spec-driven test creation: plan what to test through structured discovery phases, then scaffold a local Shiplight test project and write YAML tests by walking through the app in a browser."
---

# Create Local YAML Tests

A spec-driven workflow that front-loads testing expertise through structured planning before any tests are written. Tests run with `npx shiplight test --headed` — no cloud infrastructure required.

## When to use

Use `/shiplight:create_tests_v2` when the user wants to:
- Create a new local test project from scratch
- Add YAML tests for a web application
- Set up authentication for a test project
- Plan what to test before writing tests

## Phase Overview

```
Phase 1: Discover  → test-specs/test-strategy.md   (understand the app & user goals)
Phase 2: Specify   → test-specs/test-spec.md        (define what to test in Given/When/Then)
Phase 3: Clarify   → updates test-spec.md      (surface testing-specific unknowns)
Phase 4: Plan      → test-specs/test-plan.md        (prioritize, structure, per-test guidance)
Phase 5: Implement → *.test.yaml files         (write tests, guided by plan)
```

## Skip / Fast-Track

Before starting, check for existing artifacts and user intent:

| User says | Behavior |
|-----------|----------|
| "skip to implement" / "just write the tests" | Phase 5 only (original unguided flow) |
| "skip clarify" | Phases 1→2→4→5 |
| Existing `test-specs/test-strategy.md` found | Offer to skip Phase 1 |
| Existing `test-specs/test-spec.md` found | Offer to skip Phases 1-2 |
| Existing `test-specs/test-plan.md` found | Offer to skip to Phase 5 |

---

## Phase 1: Discover (Adaptive Intake)

**Goal:** Understand the application, the user's role, and what matters most to test.

**Output:** `test-specs/test-strategy.md`

### Steps

1. **Get project path** — ask the user where to create the test project (e.g., `./my-tests`). All spec artifacts and tests will be written here. Create the `test-specs/` directory inside this path immediately.

2. **Silent scan** — before asking questions, gather context from what's available:
   - Codebase: routes, components, `package.json`, framework
   - Git branch diff (what changed recently)
   - Existing tests (what's already covered)
   - PRDs, docs, README files
   - Cloud environments (if cloud MCP tools available)

3. **Open question** — ask the user:
   > What would you like to test?

4. **Classify context** — based on the user's response, determine their persona:
   - **Developer + codebase**: has the code, wants tests for their changes
   - **QA + scenarios**: knows what to test, wants it automated
   - **PM + PRD**: has requirements, wants coverage
   - **URL-only**: just has a URL, needs guidance on everything

5. **Ask 3-5 targeted questions** — ask one at a time, each with a recommendation based on your scan. Cover:
   - Risk areas (what breaks would hurt most?)
   - User roles and permissions
   - Authentication requirements
   - Data strategy (test data creation, cleanup)
   - Critical user journeys

6. **Write `test-strategy.md`** — save to `<project>/test-specs/test-strategy.md` containing:
   - **App profile**: name, URL, framework, key pages/features
   - **Risk profile**: what matters most, what's fragile
   - **Testing scope**: what's in/out, user roles to cover
   - **Data strategy**: how test data will be created and cleaned up
   - **Environment**: target URL, auth method, any special setup

---

## Phase 2: Specify (Define What to Test)

**Goal:** Define concrete test scenarios in structured Given/When/Then format, prioritized by risk.

**Input:** reads `test-specs/test-strategy.md`

**Output:** `test-specs/test-spec.md`

### Steps

1. **Read** `test-strategy.md` to understand scope and priorities.

2. **Generate user journey specs** — for each critical journey, write:
   - **Title**: descriptive name (e.g., "New user signup with email verification")
   - **Priority**: P0 (must-have), P1 (should-have), P2 (nice-to-have)
   - **Preconditions**: what must be true before the test starts (Given)
   - **Happy path**: step-by-step actions and expected outcomes (When/Then)
   - **Edge cases**: at least 2 per journey (e.g., invalid input, timeout, empty state)
   - **Data requirements**: what test data is needed

3. **Write `test-spec.md`** — save to `<project>/test-specs/test-spec.md` with all journey specs.

4. **Checkpoint** — present a summary table to the user for review:

   | # | Journey | Priority | Happy Path Steps | Edge Cases |
   |---|---------|----------|-----------------|------------|
   | 1 | User signup | P0 | 5 | 3 |
   | 2 | ... | ... | ... | ... |

   Ask: "Does this look right? Any journeys to add, remove, or reprioritize?"

---

## Phase 3: Clarify (Surface Unknowns) — skippable

**Goal:** Proactively surface testing-specific ambiguities that would cause flaky or incomplete tests.

**Input:** reads `test-specs/test-spec.md`

### Steps

1. **Ambiguity scan** — review the spec for unknowns across these 8 categories:
   - **Data dependencies**: does the test rely on specific data existing? Can it create its own?
   - **Timing / async**: are there loading spinners, animations, or background processes to wait for?
   - **Dynamic content**: dates, random IDs, user-generated content that changes between runs?
   - **Auth boundaries**: does the test cross permission levels or require multiple users?
   - **Third-party dependencies**: payment processors, email services, OAuth providers?
   - **State isolation**: does one test's data affect another? Cleanup needed?
   - **Flakiness risks**: race conditions, viewport-dependent behavior, network sensitivity?
   - **Environment variance**: does behavior differ between staging/prod? Feature flags?

2. **Ask up to 5 questions** — one at a time, each with:
   - The specific ambiguity found
   - A recommended answer (your best guess based on context)
   - An impact statement (what happens if this isn't addressed)

   Example:
   > The "checkout" journey expects a product in the cart, but I don't see a data setup step. **Recommendation:** Add a precondition that navigates to a product page and adds it to cart. **Impact:** Without this, the test will fail if the cart is empty from a previous test run.

3. **Update `test-spec.md`** — add a "Clarifications" section at the end with resolved answers.

---

## Phase 4: Plan (Prioritize & Structure) — skippable

**Goal:** Create an actionable implementation plan with per-test guidance.

**Input:** reads `test-specs/test-spec.md`

**Output:** `test-specs/test-plan.md`

### Steps

1. **Read** `test-spec.md` (including any clarifications from Phase 3).

2. **Define test file structure** — map journeys to test files:
   ```
   tests/
   ├── auth.setup.ts          (if auth needed)
   ├── signup.test.yaml        (Journey 1)
   ├── checkout.test.yaml      (Journey 2)
   └── ...
   ```

3. **Set implementation order** — ordered by:
   - Dependencies first (auth setup before authenticated tests)
   - Then by priority (P0 before P1)
   - Then by risk (highest risk first)

4. **Per-test guidance** — for each test file, specify:
   - **Estimated statement count**: how many YAML statements expected
   - **Statement type breakdown**: e.g., "8 ACTION, 3 VERIFY, 1 WAIT_UNTIL"
   - **Data strategy**: what data to create/use, cleanup approach
   - **Wait strategy**: where to use WAIT_UNTIL vs WAIT, expected loading points
   - **Flakiness risks**: specific things to watch for in this test

5. **Write `test-plan.md`** — save to `<project>/test-specs/test-plan.md`.

6. **Checkpoint** — present summary to user:
   > Ready to implement **N** test files with ~**M** total statements. Shall I proceed?

---

## Phase 5: Implement

Write the actual YAML tests. If a `test-plan.md` exists, follow its per-test guidance. Otherwise, fall back to the original unguided flow.

**This phase has two parts: Setup (get the project ready) then Write Tests (the core task). Setup is only needed once — the real work is writing tests. Do NOT stop after setup.**

### Part A: Project Setup

Skip any steps that are already done (project exists, deps installed, auth configured).

**A1. Check API keys** — ensure the user has `ANTHROPIC_API_KEY` or `GOOGLE_API_KEY` for browser actions. If the key is already available (e.g. `act` tool works without error), skip this. Otherwise ask:

> To create tests, I need an Anthropic or Google API key for AI-powered browser interactions. Do you have one of these?

If provided, save it to the project's `.env` file (create if needed) and tell them: "Saved to `<project>/.env` — make sure `.env` is in your `.gitignore`." The MCP server must be reconnected (`/mcp`) for new keys to take effect.

**A2. Gather project info** — ask the user for:
- **Project path** — where to create the project (e.g., `./my-tests`)
- **Target URL** — the web app to test (e.g., `https://app.example.com`)
- **Login credentials** (if the app requires authentication) — URL, username, password, etc

**Cloud shortcut:** If cloud MCP tools are available (i.e. `SHIPLIGHT_API_TOKEN` is set), use the `/shiplight:cloud` skill to fetch environments and test accounts from the cloud — this can pre-fill the target URL and login credentials, saving the user from entering them manually.

**A3. Scaffold the project** — call `scaffold_project` with the absolute project path. This creates:
- `package.json` with `shiplightai` and `@playwright/test`
- `playwright.config.ts` with `shiplightConfig()`
- `.env.example` with placeholder API keys
- `.gitignore` and `tests/` directory

Save the API key from step A1 to the project's `.env` file.

**A4. Install dependencies** — run in the project directory:

```bash
npm install
npx playwright install chromium
```

**A5. Set up authentication (if needed)** — if the app requires login, follow the standard [Playwright authentication pattern](https://playwright.dev/docs/auth).

Add credentials as variables in `playwright.config.ts` using these standard names:

```ts
{
  name: 'my-app',
  testDir: './tests/my-app',
  dependencies: ['my-app-setup'],
  use: {
    baseURL: 'https://app.example.com',
    storageState: 'tests/my-app/.auth/storage-state.json',
    variables: {
      username: process.env.MY_APP_EMAIL,
      password: { value: process.env.MY_APP_PASSWORD, sensitive: true },
      // otp_secret_key: { value: process.env.MY_APP_TOTP_SECRET, sensitive: true },
    },
  },
},
```

Standard variable names: `username`, `password`, `otp_secret_key`. Use `{ value, sensitive: true }` for secrets so they are masked in logs. Add the actual values to `.env`.

Write `auth.setup.ts` with standard Playwright code (fill fields, click submit, save storage state). For apps that require 2FA/TOTP, the `otplib` package can generate time-based codes:

```ts
import { authenticator } from 'otplib';
const code = authenticator.generate(process.env.MY_APP_TOTP_SECRET!);
```

### Part B: Write Tests ← this is the core task, do NOT skip

**Once setup is complete, immediately proceed to writing tests. Do not stop, summarize, or ask permission to continue.**

For each test in the plan (or each test the user wants):

1. **Open a browser session** — call `new_session` with the app's `starting_url`.
2. **Walk through the flow** — use `inspect_page` to see the page, then `act` to perform each action. This captures locators from the response.
3. **Capture locators** — use `get_locators` for additional element info when needed.
4. **Build the YAML** — construct the `.test.yaml` content following the best practices below.
5. **Save and validate** — write the `.test.yaml` file, then call `validate_yaml_test` with the file path to check locator coverage (minimum 50% required).
6. **Close the session** — call `close_session` when done.

**Important:** Do NOT write YAML tests from imagination. Always walk through the app in a browser session first to capture real locators. Tests without locators are rejected by `validate_yaml_test`.

**Plan-guided enhancement:** If `test-plan.md` exists, use its per-test guidance:
- Follow the recommended statement types and counts
- Apply the specified wait strategy at loading points
- Test the edge cases and assertions defined in the spec
- After each test file, validate against the spec: are all specified scenarios covered?

### Part C: Verify and fix — always run this

**After writing tests, always run them. Do not stop or summarize before running.**

```bash
npx shiplight test --headed
```

**When a test fails, follow this protocol:**

1. **Report** — tell the user which test failed and why (one sentence).
2. **Classify** the failure:
   - **Implementation fix** (wrong locator, missing wait, timing issue) → fix the test and retry. Maximum **2 retry attempts** per test.
   - **Spec mismatch** (the app doesn't behave as the spec describes) → stop and ask the user: "The app does X but the spec says Y. Should I update the spec and adjust the test, or skip this scenario?"
3. **Escalate after 2 retries** — if a test still fails after 2 fix attempts, stop and ask:
   > Test [name] is failing because [reason]. Want me to adjust the test, skip it, or try a different approach?

**Do not silently retry more than twice.** The user should always know what's happening.

**Coverage summary (plan-guided only):** If a `test-spec.md` exists, present a final coverage summary table:

| Spec Journey | Priority | Scenarios Specified | Tests Written | Coverage |
|-------------|----------|--------------------:|-------------:|----------|
| User signup | P0 | 4 | 4 | ✓ |
| Checkout | P0 | 3 | 3 | ✓ |
| ... | ... | ... | ... | ... |

Flag any spec scenarios that were not covered and explain why.

### Part D: Verify against spec (plan-guided only)

After all tests pass, do a read-only check of every test file against `test-spec.md`:

- For each spec journey, confirm the test covers the **happy path** and all listed **edge cases**
- Flag gaps: scenarios in the spec that have no corresponding YAML statements
- Flag extras: test steps that aren't in the spec (not necessarily wrong — but worth noting)

Present findings to the user. Do not modify any files in this step.

### Part E: Reconcile spec artifacts (plan-guided only)

During implementation, the spec will have drifted — skipped scenarios, changed approaches, user-resolved mismatches. Update the spec artifacts to match what was actually written:

1. **Read** all `.test.yaml` files and compare against `test-spec.md` and `test-plan.md`
2. **Update `test-spec.md`** — mark skipped scenarios as "Skipped" with reason, add any new scenarios that emerged during implementation, update edge cases to reflect what was actually tested
3. **Update `test-plan.md`** — correct statement counts, update file structure, note any deviations from the original plan
4. **Show diff summary** — tell the user what changed and why

This keeps the spec artifacts accurate for future test maintenance and expansion.

## YAML Format Reference

Read the MCP resource `shiplight://yaml-test-spec-v1.3.0` for the full language spec (statement types, templates, variables, suites, hooks, parameterized tests).

Read the MCP resource `shiplight://schemas/action-entity` for the full list of available actions and their parameters.

## YAML Authoring Best Practices

These best practices bridge the YAML language spec and the action catalog to help you write fast, reliable tests.

### Statement type selection

- **ACTION is the default.** Capture locators via MCP tools (`act`, `get_locators`) during browser sessions, then write ACTION statements. ACTIONs replay deterministically (~1s).
- **DRAFT is a last resort.** Only use DRAFT when the locator is genuinely unknowable at authoring time. DRAFTs are slow (~5-10s each, AI resolution at runtime). Tests with too many DRAFTs are rejected by `validate_yaml_test`.
- **VERIFY for assertions.** Use `VERIFY:` for all assertions. Do not write assertion DRAFTs like `"Check that the button is visible"`.
- **URL for navigation.** Use `URL: /path` for navigation instead of `action: go_to_url`.
- **CODE for scripting.** Use `CODE:` for network mocking, localStorage manipulation, page-level scripting. Not for clicks, assertions, or navigation.

### The `intent` field

`intent` is the **intent** of the step — it defines _what_ the step should accomplish. The `action`/`locator` or `js` fields are **caches** of _how_ to do it. When a cache fails (stale locator, changed DOM), the AI agent uses `intent` to re-inspect the page and regenerate the action from scratch.

Because `intent` drives self-healing, it must be specific enough for an agent to act on without any other context. Describe the **user goal**, not the DOM element — avoid element indices, CSS selectors, or positional references that break when the UI changes:

```yaml
# BAD: vague, agent can't re-derive the action
- intent: Click button

# BAD: tied to DOM structure that can change
- intent: Click the 3rd button in the form
- intent: Click element at index 42

# GOOD: describes the user goal, stable across UI changes
- intent: Click the Submit button to save the new project
  action: click
  locator: "getByRole('button', { name: 'Submit' })"
```

### ACTION: structured format vs `js:` shorthand

**Use structured format by default** for all supported actions. Read the MCP resource `shiplight://schemas/action-entity` for the full list of available actions and their parameters.

**Use `js:` only when the action doesn't map to a supported action** — e.g., complex multi-step interactions, custom Playwright API calls, or chained operations:

```yaml
- intent: Drag slider to 50% position
  js: "await page.getByRole('slider').first().fill('50')"

- intent: Wait for network idle after form submit
  js: "await page.waitForLoadState('networkidle')"
```

### `js:` coding rules

- Always resolve locators to a single element (e.g., `.first()`, `.nth(1)`) to avoid Playwright strict-mode errors
- Always include `{ timeout: 5000 }` on actions for predictable timing
- The `intent` is critical — it's the input for self-healing when `js` fails
- `page`, `agent`, and `expect` are available in scope

### VERIFY best practices

- Always set a short timeout (e.g., `{ timeout: 2000 }`) on `js:` assertions that have an AI fallback, so stale locators fall back to AI quickly instead of waiting the default 5s
- Always use `VERIFY:` shorthand — do not use `action: verify` directly
- **Be aware of false negatives with `js:` assertions.** The AI fallback only triggers when `js` **throws** (element not found, timeout). If `js` passes against the wrong element (stale selector matching a different element), the assertion silently succeeds — no fallback occurs. Keep `js:` assertions simple and specific to minimize this risk.

### IF/WHILE `js:` condition best practices

- **Use natural language (AI) conditions for DOM-based checks** (element visible, text present, page state). AI conditions self-heal against DOM changes; `js:` conditions are brittle and cannot auto-heal.
- **Use `js:` conditions only for counter/state logic** — e.g., `js: counter++ < 10`, `js: retryCount < 3`. Never use `js:` for DOM inspection like `js: document.querySelector('.modal') !== null`.
- If you need a JavaScript-based DOM check, use `CODE:` to evaluate it and store the result, or use `VERIFY:` with `js:` (which at least has AI fallback on failure).

### Waiting best practices

- **Use `WAIT_UNTIL:` for smart waits** — AI checks the condition repeatedly until met or timeout:

```yaml
- WAIT_UNTIL: Dashboard data has finished loading
  timeout_seconds: 60

- WAIT_UNTIL: Spinner has disappeared
```

Default timeout is 60 seconds. Each AI condition check takes 10–15 seconds, so set `timeout_seconds` to at least 15. For waits under 10 seconds, use `WAIT:` instead.

- **Use `WAIT:` for short waits (<10s) or when no observable condition exists** (e.g., animations):

```yaml
- WAIT: Wait for animation to complete
  seconds: 3
```

### General conventions

- Put `intent` first in ACTION statements for readability
- `xpath` is only needed when an ACTION has neither `locator` nor `js`.
- Single-test vs Suite: isolated test → single-test file; shared setup/teardown or sequential tests with shared browser state → suite; same structure, different data → `parameters`

## Project Structure

```
my-tests/
├── test-specs/                   # Spec-driven planning artifacts
│   ├── test-strategy.md          # Phase 1: app & risk profile
│   ├── test-spec.md              # Phase 2: Given/When/Then specs
│   └── test-plan.md              # Phase 4: implementation plan
│
├── playwright.config.ts
├── package.json
├── .env                          # API keys + credentials (gitignored)
├── .gitignore
│
├── tests/
│   ├── public-app/               # No login needed
│   │   ├── search.test.yaml
│   │   └── filter.test.yaml
│   │
│   └── my-saas-app/              # Requires login
│       ├── auth.setup.ts         # Playwright login setup — you write this
│       ├── dashboard.test.yaml
│       └── settings.test.yaml
```

The `test-specs/` directory contains human-readable markdown artifacts that are version-controllable. Do NOT add `test-specs/` to `.gitignore`.

## Tips

- ACTION statements with locators replay ~10x faster than DRAFTs. Always prefer ACTIONs.
- Use `inspect_page` to understand page state. **Always read the DOM file first** — it provides element indices needed for `act` and consumes far fewer tokens. Only view the screenshot when you specifically need visual information (layout, colors, images), as screenshots consume significantly more tokens than DOM.
- Run a specific project's tests with: `npx shiplight test --headed my-saas-app/`
- The `.env` file is auto-discovered by `shiplightConfig()` — no manual dotenv setup needed.
