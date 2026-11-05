# Opening splash architecture

Scope: Converdive intro only. Existing homepage handoff and approved SVG remain unchanged.

- `OpeningSplash.tsx`: asset readiness, single master clock, WAAPI identity/text effects, review controls, resize and cleanup.
- `timeline.ts`: named durations, dependent absorption/rotation/beam/impact events, 8.2-second sequence and checkpoints.
- `geometry.ts`: deterministic orbital layout and cubic interpolation.
- `scene.ts`: measured logo and wordmark coordinates; nearest-first curved flights; wordmark avoidance; nonuniform compression into a shared absorption mask.
- `energy.ts`: Canvas 2D field planes, traveling arcs, event-driven absorption responses, propagating white-core beam, local impact and dissipation. DPR capped at 1.5; fewer filaments on mobile. Rendering uses master time without another timer or random state.
- `App.tsx` (unchanged): returning-visit storage, reduced-motion bypass, homepage focus and header boundary.

The wordmark stays Bespoke Stencil Medium, RGB 241/241/237. Final lines retain Cabinet Grotesk Medium and RGB 187/206/217, 240/249/255 and 241/241/237. Light renders behind the text; no brightness, hue or text-fill filters are applied.

Run `npm run build`, then `npm run test:intro` for the Playwright CLI browser suite. Review with `npm run dev` at `http://localhost:5173/?intro=review`. The harness starts its own production server on port 4173 and captures JPEGs under `work/reconstruction/`.

[Skill integration and limitations](cinematic-skill-audit.md) · [Visual/technical audit](cinematic-visual-audit.md) · [Internal architecture](cinematic-system.html).

Run `npm run test:cinematic` for the current regression suite. Screenshots and measurements are written to `work/cinematic`. A standalone preview is built at `dist/index.html`; every asset is embedded. The localhost address refers to the machine running Vite, not automatically to the user’s computer.
