# Project setup

Use the existing checkout; do not create a Git worktree unless explicitly requested.
Preserve existing website code. No website has been built yet; build only when the
user asks. Do not purchase services as part of setup.

Thirteen selected capabilities are installed project-locally under `.agents/skills/`
(fourteen skill bundles because Hairline has create and adopt). Read the relevant
`SKILL.md` and its supporting files when using a capability:

- `ui-ux-pro-max`: design systems and searchable design data.
- `design-taste-frontend`: visual direction (upstream renamed `gpt-taste`).
- `motion-design`: animation principles.
- `hairline-create` and `hairline-adopt`: interactive technical illustrations.
- `impeccable`: interface quality reviews.
- `playwright-cli`: real browser testing.
- `cro`: conversion optimization.
- `copywriting`: marketing writing.
- `awesome-design-reference`: search and synthesize 84 licensed DESIGN.md
  analyses without copying another brand's identity.
- `liquid-glass-js`: WebGL refractive glass guidance and pinned upstream API.
- `react-three-fiber`: React Three.js scene architecture and performance guidance.
- `shadergradient`: branded animated 3D gradient implementation guidance.
- `liquid-logo`: reference-only liquid-logo workflow with PolyForm license limits.

Read `.agents/CAPABILITIES.md` for installation evidence and limitations. Run
`bash .agents/setup.sh` if dependencies need restoring. From the repository root,
source `. .agents/activate.sh` before calling Impeccable or Hairline helpers.
Use the local browser command `npx --no-install playwright cli`; its configuration
in `.playwright/cli.config.json` selects the cloud machine's system Chromium.

Never commit dependency folders, browser downloads, caches, credentials, or
temporary browser output. Do not disable TLS or artifact verification.
