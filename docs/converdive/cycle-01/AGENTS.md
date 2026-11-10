# Converdive agent instructions (binding project rules)

## Mission
Implement a premium, responsive, technically reliable website for a UK commercial-cleaning-focused enquiry-to-contract workflow agency. Preserve the ten-section narrative and bounded, truthful offer. The site is a **provisional commercial presentation**, not evidence of completed customer deployments or guaranteed financial results.

## Source priority
1. `docs/website-master-spec.md` and section-specific specs.
2. `docs/design.md` and motion storyboard specifications.
3. `docs/acceptance-tests.md` and `docs/decisions.md`.
4. `prototype/` for behavior and visual proof of concept.
5. `docs/source-workflows.md` for **methods only**; tutorial creator claims and demonstrated interfaces are not evidence for Converdive's performance.

## Non-negotiables
- Always **PLAN before editing** if touching more than one section or introducing a dependency.
- Scope each task to named files/sections. Preserve sections that already pass acceptance criteria.
- Do not replace established design semantics with generic templates, unrelated visual effects or invented claims.
- Keep section boundaries continuous: explicitly record start/end states and check the adjacent section.
- One dominant animation per viewport; maintain readable text, keyboard navigation and `prefers-reduced-motion` fallback.
- Do not invent client testimonials, results, quotes, adoption rates, performance metrics, phone numbers, email addresses or service guarantees.
- AI may prepare suggestions and routine actions; pricing/contract approval and material commercial decisions remain with authorized humans.
- No plaintext secrets, credentials, API keys, paid-service activation or real contact form submissions without explicit user action.
- After each change: run the project, inspect viewport screenshots, test interactions, and report exactly what was verified vs not verified.
- Keep git checkpoints and refuse infinite cosmetic iteration: one named issue per repair round with a specific acceptance test.

## Preferred eventual production stack
Next.js + React + TypeScript + Tailwind/CSS tokens + GSAP ScrollTrigger + SVG + selectively React Three Fiber/Three.js; Playwright for E2E. The existing prototype is deliberately dependency-free and should be ported, not wholesale regenerated.

## First development cycle stop condition
Deliver reproducible, browser-validated Section 04 & 05 technical prototypes and a functional ten-section skeleton. Do not claim a production-ready full site until actual browser QA, integration, deployment and content validation pass.
