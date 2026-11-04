# Installed website capabilities

Repository: `/workspace/conver-web`; GitHub: `m17hassay1217-cmd/conver-web`.
Verified 2026-11-04. No paid service was used during skill installation.

## Installed files and status

Paths below are relative to `/workspace/conver-web/.agents/skills/`.
All thirty-one SKILL.md metadata blocks, required supporting files and bundled
JSON were checked.
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
| Liquid Glass JS / `liquid-glass-js` | 4 | Pinned upstream README, MIT license and provenance | Reference skill; runtime source and dependencies intentionally not installed |
| React Three Fiber / `react-three-fiber` | 4 | Pinned upstream README, MIT license and provenance | Reference skill; published runtime dependencies installed only when used |
| ShaderGradient / `shadergradient` | 4 | Pinned upstream README, license statement and provenance | Reference skill; WebGL dependencies intentionally not installed |
| Liquid Logo / `liquid-logo` | 4 | Pinned upstream README, PolyForm Shield license and provenance | Reference-only skill; upstream application source intentionally not copied |
| Superpowers / 15 skill folders | 95 | Complete methodology skills, prompts, scripts, templates, references and MIT license | Native skills from `obra/superpowers` revision `22f0b463e7a5e579904dd6211a520321035526f7`; bundle integrity verified |
| Hallmark / `hallmark` | 187 | Fifty themes, design references, visual-lint scripts, tests, imagery metadata and MIT license | Native skill from `nutlope/hallmark` revision `de4999e0cd7a7a41df0b4e6903fa02fe9f1492a8`; reference check and five non-browser tests pass; this cloud image cannot launch Chromium through Puppeteer because its SUID sandbox is unavailable |
| Diagram Design / `diagram-design` | 291 | Diagram references, import/export/self-check scripts, templates and extensive HTML examples | Native skill from `cathrynlavery/diagram-design` revision `f24d98b05e2d7a5e68c2dedfe46e5b7173f50118`; example self-check run during installation |

Exact instruction path for each folder is `<folder>/SKILL.md`.
Instruction-only skills were checked for completeness, not applied to a website.
The four visual-technology repositories added on 2026-11-04 were not native
Agent Skills. Their project-local wrappers pin source documentation and license
terms without installing runtime packages or copying application source.

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
- `puppeteer-core@25.16.0` is pinned for Hallmark browser linting; it uses an
  existing Chrome/Chromium installation and does not download a browser.
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
