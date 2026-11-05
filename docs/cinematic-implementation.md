# Cinematic splash refinement

Restored the incumbent implementation from retained commit `4a67ce0` after its branch was deleted. The existing source, supplied logo and fonts were recovered intact; the current main-branch skill installation was preserved.

## Unified approach

Use measured DOM coordinates and a single deterministic clock. Canvas 2D suits planar elliptical paths and a short beam without adding a scene graph, camera, refraction capture, or WebGL dependency. This is a renderer decision, not a claim that Three.js or ShaderGradient packages are running.

The sequence follows attraction → collection → rotation → transfer → conversion. Magnetic illumination increases only during collection, the beam has a narrow white core with bounded colored filaments, and impact propagates under the original text colors.

## Changes

- Responsive orbital geometry replaces mobile rows.
- Curved paths preserve velocity at entry and continuity at their joins.
- Compression begins near the absorption core rather than on a mobile timer.
- Field curves respond to measured phrase positions; samples are cached once per frame.
- Field illumination and advected beam sparks share the master timestamp and deterministic seek behavior.
- Compact portrait and landscape typography retain the supplied font families and original text colors.

## Preview and evidence

Run `npm run dev`, then open `http://localhost:5173/?intro=review` on the machine running the server. The review slider pauses and seeks the same timeline used for production playback. `?intro=1` forces replay.

`npm run build` produces a standalone `dist/index.html` with fonts, logo, code and styling embedded. `npm run test:cinematic` runs the browser checks and saves evidence in `work/cinematic`.

## Known limits

The three reference images described in the pasted brief were not attached to that request. Geometry and beam detail were guided by their written descriptions. Cabinet Grotesk Semibold was not supplied; the incumbent supplied Medium font is preserved without synthesizing a weight. The existing handoff is a testable placeholder, not a complete homepage.
