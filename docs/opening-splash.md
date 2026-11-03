# Converdive opening splash

Scope: the introduction and a minimal homepage handoff only. Built in React, TypeScript and Vite without Emergent code.

## Review

- Private hosted playback: https://converdive-intro-preview.longgala1.chatgpt.site/?intro=1
- Private review scrubber: https://converdive-intro-preview.longgala1.chatgpt.site/?intro=review
- Local development: `npm ci && npm run dev`, then `http://localhost:5173/?intro=review`
- Production check: `npm run build && npm run test:intro`

Localhost only works while the local development server is running on your own computer. The hosted preview works without a local server. Review mode pauses and scrubs without setting the returning-visitor flag.

## Timing and implementation

| Stage | Approximate time |
| --- | --- |
| Approved logo entrance | 0.12s |
| Center wordmark entrance | 0.65s |
| Seven phrases, 200ms apart | 1.10–2.62s |
| Expanding orbital travel | 1.40–6.60s (continues until each phrase is attracted) |
| Moving magnetic field builds | 5.40s |
| Nearest-first curved absorption with pulses | 6.60–8.84s |
| Concentration and 90° clockwise turn | 8.95–10.05s |
| Beam arrives at wordmark | 10.10–10.48s |
| Sequential For / UK / Cleaning Companies | 10.80–11.84s |
| Upward handoff | 13.20–14.40s |

`OpeningSplash` owns a single seekable animation clock and measured attraction geometry. `App` owns the visit flag, reduced-motion bypass, and future homepage boundary. The animated atmosphere and beam are CSS/SVG. The approved uploaded SVG is cropped to its emblem in the SVG viewBox; the presentation board, embedded wordmark, and swatches are excluded without drawing a replacement logo.

The supplied Bespoke Stencil Medium and Cabinet Grotesk Medium files and Fontsource Space Grotesk Medium are bundled. The V3 final statement specifically uses the supplied Cabinet Grotesk Medium; no font asset is missing for this revision. The asphalt texture is procedural.

The browser suite verifies stage visibility, floating, magnetic field, sequential absorption, rotation, beam, final copy, mobile fit, Skip Intro, returning visits, and no runtime errors. An additional reduced-motion Chromium check passed. The handoff remains a placeholder pending future website work.

V3 geometry lives in `geometry.ts`. The deterministic ellipse expands gradually; dimensions measured after fonts load reserve space around both identity elements and all seven labels. Mobile uses separated upper/lower orbital arcs because full-width phrases cannot pass beside the wordmark legibly. Sampled layouts at 1366×768, 1440×900, 1920×1080, and 390×844 had no clipping or overlaps. `geometry-checks.json` records these checks.
