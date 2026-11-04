---
name: react-three-fiber
description: >-
  Design, implement, and review Three.js scenes in React with
  @react-three/fiber. Use for genuinely three-dimensional, interactive, or
  shader-driven experiences that benefit from React composition and lifecycle;
  avoid it for effects that CSS, SVG, Canvas 2D, or ordinary DOM animation can
  deliver more simply.
license: MIT
metadata:
  source: pmndrs/react-three-fiber
  source-revision: d74622ea8ed717f7212d7e19d65ff3e325508389
  version: "1.0.0"
---

# React Three Fiber

Read `references/UPSTREAM-README.md` for the upstream API and compatibility
notes. This skill supplies implementation guidance; it does not add a WebGL
renderer to every page automatically.

## Decision gate

Use React Three Fiber when the requested result needs a 3D scene graph, camera,
lighting, materials, raycasting, or custom shaders. For flat layout, typography,
glow, and ordinary motion, continue with DOM, CSS, SVG, or Canvas 2D.

## Workflow

1. Inspect the project React version and choose the matching major version of
   `@react-three/fiber`. Upstream pairs v8 with React 18 and v9 with React 19.
2. Define the scene's visual purpose, camera, geometry, lighting, interactions,
   loading state, static fallback, and performance budget.
3. Add `three`, `@react-three/fiber`, and TypeScript types only when an approved
   implementation uses them. Commit the lockfile.
4. Keep the `<Canvas>` boundary and scene components modular. Dispose custom
   textures, render targets, geometries, materials, and listeners correctly.
5. Use `useFrame` for render-loop work and mutate refs inside the loop. Avoid
   React state updates every frame.
6. Validate appearance and interaction at desktop and mobile sizes. Test context
   loss, loading, keyboard alternatives, reduced motion, and no-WebGL fallback.

## Performance and accessibility

- Cap device pixel ratio, minimize transparent overdraw, and reuse geometry and
  materials.
- Pause or reduce work when the scene is hidden or outside the viewport.
- Lazy-load large scenes when they are not required for initial comprehension.
- Keep essential content and controls in semantic DOM, with the canvas treated
  as enhancement unless the product itself is the 3D experience.
- Provide a still composition when reduced motion is requested.

## Bundled material

- `references/UPSTREAM-README.md`: upstream introduction and examples.
- `LICENSE`: upstream MIT license.
- `NOTICE.md`: provenance and dependency boundary.
