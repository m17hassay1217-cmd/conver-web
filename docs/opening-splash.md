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
| Seven phrases, 200ms apart, then floating | 1.10–2.62s |
| Magnetic field builds | 3.12s |
| Nearest-first curved absorption | 3.70–5.38s |
| Logo intensifies and rotates 90° clockwise | 5.60–6.63s |
| Energy beam and exact positioning replacement | 6.63–7.93s |
| Upward handoff | 8.70–9.80s |

`OpeningSplash` owns a single seekable animation clock and measured attraction geometry. `App` owns the visit flag, reduced-motion bypass, and future homepage boundary. The animated atmosphere and beam are CSS/SVG. The approved uploaded SVG is cropped to its emblem in the SVG viewBox; the presentation board, embedded wordmark, and swatches are excluded without drawing a replacement logo.

The supplied Bespoke Stencil Medium and Cabinet Grotesk Medium files and Fontsource Space Grotesk Medium are bundled. Cabinet Grotesk Semibold remains an outstanding asset, so the final statement uses Medium for now. The asphalt texture is procedural.

The browser suite verifies stage visibility, floating, magnetic field, sequential absorption, rotation, beam, final copy, mobile fit, Skip Intro, returning visits, and no runtime errors. An additional reduced-motion Chromium check passed. The handoff remains a placeholder pending future website work.
