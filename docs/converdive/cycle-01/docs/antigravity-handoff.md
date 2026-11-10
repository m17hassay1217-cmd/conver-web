# FIRST PROMPT TO GOOGLE ANTIGRAVITY — Converdive Cycle 2

Read `AGENTS.md`, `docs/website-master-spec.md`, `docs/design.md`, `docs/decisions.md`, `docs/acceptance-tests.md`, both Section 04/05 motion-storyboards, and `docs/reference-index.md`. Inspect the existing `prototype/index.html`, `prototype/css/site.css`, `prototype/js/site.js` and its browser behavior **before writing code**.

**Objective:** Port the existing browser-tested static prototype into a maintainable Next.js + React + TypeScript project, preserving all content sequencing and Section 04/05 interactions. Do **not** redesign the entire website or introduce unsupported client claims. The static prototype must remain accessible as a visual reference/checkpoint.

1. Produce a file-by-file migration plan and identify any mismatches between docs and prototype.
2. Create a Next.js App Router structure using React components split by ten sections; use design tokens for consistent styling. Choose versions compatible with the environment and record them in the lockfile.
3. Implement GSAP ScrollTrigger only where scroll-linked choreography materially requires it. Use React Three Fiber/Three.js for Section 04 cross-section **only if** measured browser performance and visual fidelity justify WebGL over CSS 3D. Keep simple 2D controls in DOM/SVG.
4. Preserve keyboard, tap, reduced-motion, and accessible static copy equivalents. Respect fixed causal-hypothesis labels and human approval boundaries.
5. Run local server and test at 375/768/1440 widths; take before/after screenshots; test Section 04 sticky scrolling in both directions, four selector buttons, and Section 05 four methodology states + final synthesis. Fix visual diffs only in affected components.
6. Report: modified files, implemented behavior, screenshot evidence, failed checks, performance bottlenecks and chosen fallbacks. **Stop after validated Section 04 and 05 port** rather than building all remaining effects at once.

**Permission boundary:** Do not connect paid media providers, email/phone/CRM accounts, deploy externally, use real customer data, or store credentials until explicitly authorized. Do not enable unattended broad terminal permissions when approval is needed.
