---
name: liquid-glass-js
description: >-
  Plan, implement, or review WebGL-powered refractive liquid-glass controls and
  containers using dashersw/liquid-glass-js as a pinned technical reference.
  Use when a web interface needs real refraction, nested glass, tinting, or
  pointer-reactive glass that CSS backdrop-filter cannot provide by itself.
license: MIT
metadata:
  source: dashersw/liquid-glass-js
  source-revision: 78cb6ccb0b9987bb60a88b14ccbd13a9e6e8ab2a
  version: "1.0.0"
---

# Liquid Glass JS

Use this skill for deliberate WebGL glass treatments. Read
`references/UPSTREAM-README.md` before choosing the API or copying an example.
The upstream project is a JavaScript source library rather than an Agent Skill
or a conventional npm dependency.

## Workflow

1. Inspect the existing stack, visual hierarchy, performance budget, and browser
   targets. Confirm that real refraction adds meaning; prefer CSS when a simple
   translucent surface is enough.
2. Define the glass surface, sampled background, interaction, dimensions, and
   fallback before writing code.
3. If upstream source is adopted, vendor only the files the implementation uses,
   retain `LICENSE`, and record the pinned source revision above. Keep the vendor
   code separate from application components.
4. Wrap the effect in a framework component with explicit setup, resize, and
   teardown. Do not let rendering objects leak across mounts.
5. Supply a readable CSS fallback for unavailable WebGL, low-power devices, and
   reduced motion. Preserve contrast and focus visibility over every background.
6. Render and test desktop, mobile, keyboard focus, resize, reduced motion, and
   a browser without WebGL. Measure frame rate and memory before expanding use.

## Quality rules

- Limit expensive page capture and texture updates; update only when the sampled
  content changes.
- Cap device pixel ratio and keep the number and size of glass surfaces small.
- Keep text and controls in semantic DOM above the effect when possible.
- Do not use Apple names, marks, or claims of visual equivalence in the product.
- Coordinate entrance and interaction timing with the project motion skill.

## Bundled material

- `references/UPSTREAM-README.md`: upstream API and examples at the pinned revision.
- `LICENSE`: upstream MIT license.
- `NOTICE.md`: provenance and installation boundary.
