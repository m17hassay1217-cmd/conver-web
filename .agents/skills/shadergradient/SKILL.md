---
name: shadergradient
description: >-
  Implement or review animated three-dimensional gradient backgrounds with
  @shadergradient/react, including camera, color, animation, responsive, and
  performance decisions. Use when a branded spatial gradient materially
  improves a hero or transition and a lightweight CSS gradient is insufficient.
license: MIT
metadata:
  source: ruucm/shadergradient
  source-revision: 68bdd740037a11c639f8b91fd775949c71d718d0
  version: "1.0.0"
---

# ShaderGradient

Read `references/UPSTREAM-README.md` before implementation. The upstream v2
React renderer depends on Three.js and React Three Fiber, so treat it as a
substantial visual dependency rather than a default background.

## Workflow

1. Establish the visual role, brand colors, contrast needs, movement character,
   and performance budget. Use CSS gradients when spatial depth is unnecessary.
2. Check the React compatibility matrix in the bundled README. Match the React
   major with the correct `@react-three/fiber` major.
3. When implementation is approved, install the published renderer and its
   documented peer dependencies. Commit the lockfile; do not vendor the full
   upstream monorepo.
4. Isolate the gradient behind content, contain its stacking context, and keep
   semantic content outside the canvas.
5. Tune a restrained composition, cap pixel density, and pause rendering when
   the effect is hidden. Avoid combining several full-screen WebGL effects.
6. Provide a representative static or CSS fallback for reduced motion, low-power
   devices, loading failure, and browsers without WebGL.
7. Test text contrast across the complete animation, desktop and mobile sizing,
   resize behavior, loading, and sustained frame time.

## Quality rules

- Derive colors from the project's design tokens rather than copying presets.
- Avoid uncontrolled random values; the same build should render predictably.
- Keep camera motion slow enough to support reading and orientation.
- Coordinate timing with the motion skill and verify the final result in-browser.

## Bundled material

- `references/UPSTREAM-README.md`: upstream v2 installation and API examples.
- `LICENSE-NOTICE.md`: upstream license statement and provenance.
- `NOTICE.md`: installation boundary.
