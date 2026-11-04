# Installed website capabilities

Repository: `/workspace/conver-web`; GitHub: `m17hassay1217-cmd/conver-web`.
Verified 2026-10-24. No website was generated and no paid service was used.
Original README and source files are unchanged.

## Installed files and status

Paths below are relative to `/workspace/conver-web/.agents/skills/`.
All ten SKILL.md metadata blocks, required supporting files and bundled JSON
were checked. Nine capabilities contain ten skills because Hairline has two.
Counts exclude Python caches.

| Capability / folder | Files | Supporting content | Status |
| --- | ---: | --- | --- |
| UI UX Pro Max / `ui-ux-pro-max` | 68 | Python scripts, design CSV/JSON data, tests and fixtures | Search works; full data integrity check passed |
| Taste / `design-taste-frontend` | 38 | Scripts, visual library, CSS/JS assets, references, evaluation examples | Direction catalog loads; browser launcher passed |
| Motion Design / `motion-design` | 17 | Direction guides, patterns and reference tables | Complete instruction bundle; no extra runtime required |
| Hairline / `hairline-create` | 13 | Build/validation/screenshot scripts, kernel, HTML bench, examples and guides | Both bundled examples build and validate in memory; automatic screenshots blocked by missing managed browser |
| Hairline / `hairline-adopt` | 1 | SKILL.md only, intentionally delegates to hairline-create | Complete; shares create's screenshot limitation |
| Impeccable / `impeccable` | 62 | Launcher, browser helpers, font data, references and agent configurations | Checksum-verified engine 0.1.17 probe passed |
| Playwright CLI / `playwright-cli` | 11 | SKILL.md and browser testing reference guides | Real DOM button interaction passed with system Chromium |
| Conversion optimization / `cro` | 4 | References and evaluation examples | Complete instruction bundle; no extra runtime required |
| Copywriting / `copywriting` | 5 | References and evaluation examples | Complete instruction bundle; no extra runtime required |
| Awesome Design Reference / `awesome-design-reference` | 91 | 84 DESIGN.md analyses, catalog, deterministic search/show helpers and tests | User-supplied VoltAgent collection; MIT licensed; search and tests pass |

Exact instruction path for each folder is `<folder>/SKILL.md`.
Instruction-only skills were checked for completeness, not applied to a website.

## What belongs in GitHub

Preserve the complete `.agents/skills/` bundles, including scripts, data,
references, examples, assets and upstream test fixtures. Those are reusable
source materials, not generated downloads. Also preserve `AGENTS.md`, this file,
`.agents/activate.sh`, `.agents/setup.sh`, `.agents/verify-skills.py`,
`skills-lock.json`, `package.json`, `package-lock.json`, `.gitignore`, and
`.playwright/cli.config.json`.

Do not commit `node_modules/`, `.cache/`, `__pycache__/`, or `.playwright-cli/`.
They contain installable dependencies, downloaded engines or disposable output.
All are ignored. No global skill installation is required.

## Reproduction and Codex discovery

`AGENTS.md` directs future Codex sessions to project-local `.agents/skills/`.
From the repository root, `bash .agents/setup.sh` verifies the bundles, restores
npm dependencies, installs/probes the checksum-verified Impeccable engine, and
validates the UI UX data. It does not reinstall or overwrite the skill bundles.
The cloud setup configuration calls this script automatically.

Before directly using Impeccable or Hairline helpers, the agent sources
`. .agents/activate.sh` from the repository root. No manual shell work is required
from the user. Scripts assume the cloud image has Node 22+, npm, Python 3 and
system Chromium at `/usr/bin/chromium`; verified versions were Node 24.19.0,
npm 11.9.0, Python 3.12.14 and Chromium 154.

A clean temporary checkout of the staged project files successfully ran the
complete setup script without the original dependency folder or engine cache.
This verifies checkout completeness and reproducible installation on this
machine. No separate Codex Cloud task was launched; task creation/publication
is not available through this chat's tools. Only that separate task can confirm
its own runtime discovery and snapshot restoration. GitHub push confirmation is
reported in chat after the remote commit is checked.

## Dependencies and installer corrections

- `@playwright/cli@0.1.22` is pinned through `package-lock.json`.
- CLI path: `/workspace/conver-web/node_modules/@playwright/cli/`.
- Playwright paths: `/workspace/conver-web/node_modules/playwright/` and
  `/workspace/conver-web/node_modules/playwright-core/`.
- Impeccable engine: `/workspace/conver-web/.cache/impeccable/bin/0.1.17/impeccable`.
- Browser configuration: `/workspace/conver-web/.playwright/cli.config.json`.
- Use `npx --no-install playwright cli` for project-local browser commands.
- UI UX installer v2.15.0 bundled six unrequested skills; those new folders were
  removed. Only requested skills remain.
- Taste upstream renamed `gpt-taste` to `design-taste-frontend`.
- Playwright skill registration succeeded using the existing system Chromium
  and the supported `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` option. Re-registration
  is unnecessary because the complete skill is now preserved in GitHub.

## Remaining browser download issue and cloud settings

Playwright CLI and Taste already work with `/usr/bin/chromium`. Hairline's
`look.mjs` instead chooses Chrome or a Playwright-managed browser; its current
launcher has no system executable override. Its required `playwright-core`
resolves locally via `HAIRLINE_LOOK_CACHE`, but the managed browser is absent.

`cdn.playwright.dev` is now reachable. The browser ZIP redirects to
`storage.googleapis.com/chrome-for-testing-public/...`, which returns HTTP 403
under the current network policy. Both domains have been saved in the cloud
settings draft, preserving the package-manager preset. Saving a draft does not
apply or publish it. The user must review/save the settings and publish through
the environment UI; this chat cannot do that action. The agent can then retry
`npx --no-install playwright install chromium` and validate Hairline's automatic
screenshot helper. Keep all TLS/checksum verification enabled.

Proposed cloud install setting: `bash /workspace/conver-web/.agents/setup.sh`.
Startup instructions point to `AGENTS.md`, source the activation helper, and
include readiness checks. Browser processes must be restarted in each task.
No website server is started and no website content is generated by setup.
