# Converdive opening splash — first implementation

Scope: the introduction and a minimal homepage handoff only. Built from the clean
repository setup with React, TypeScript and Vite. No Emergent code is used.

## Run and review

```sh
npm ci
npm run dev
```

- Normal visitor behavior: `http://localhost:5173/`
- Replay regardless of the saved visit: `http://localhost:5173/?intro=1`
- Pause, scrub and jump between stages: `http://localhost:5173/?intro=review`
- Production: `npm run build`, then `npm run preview`; use port **4173**.

`dist/index.html` is self-contained, including all fonts and the procedural
texture. It can be opened directly as a file for visual review. Use HTTP for
representative returning-visitor storage behavior. Review mode does not write
the saved-visit flag. Reduced-motion preferences always take priority.

## Timing

| Time       | Action                                        |
| ---------- | --------------------------------------------- |
| 0.10–0.70s | Identity settles                              |
| 0.70–1.90s | Seven phrases begin clockwise, 200ms apart    |
| 2.18s      | Last phrase finishes appearing                |
| 2.18–3.18s | Full one-second reading hold                  |
| 2.68s      | Magnetic glow starts preparing                |
| 3.18–4.60s | Nearest-first attraction, curved energy paths |
| 4.60s      | Cyan/violet/magenta transfer resolves         |
| 5.20–5.85s | Positioning statement appears                 |
| 6.80–7.90s | Splash slides upward; homepage is revealed    |

The installed Motion Design skill informs the controlled premium easing,
outward anticipation, curved attraction, restrained secondary glow, staged
settling, and motion accessibility. The requested 200ms phrase stagger is
preserved even though the skill's generic stagger budget is shorter.

## Component boundary

`OpeningSplash` accepts `logoSrc`, `onComplete(reason)` and optional `review`.
It owns its animation clock, responsive distance measurements, pause/seek
behavior and reduced-motion exit. It does not own visit storage or homepage
content. All animations share one clock and are cancelled on unmount. Hidden
tabs preserve the reading time; resizing remeasures distances without restarting.

`App` owns the versioned localStorage flag (`converdive:intro-seen:v1`), initial
reduced-motion bypass, scroll lock, homepage focus, and permanent header. Replace
the contents of `.homepage-handoff` with the future homepage; preserve the shared
header and the gate. Blocked storage never prevents entry to the website.

## Asset inventory and pending integration

| Asset                             | Status                                                                                                                                                                  |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Approved logo image shown in chat | User confirmed this is the approved logo. Its image bytes were not exposed as a downloadable workspace attachment. Awaiting PNG/SVG; no substitute logo has been drawn. |
| Bespoke Stencil Medium            | User's WOFF2 bundled locally; wordmark uses weight 500.                                                                                                                 |
| Space Grotesk Medium              | Locally bundled through Fontsource, weight 500, SIL OFL.                                                                                                                |
| Cabinet Grotesk Semibold          | Missing. User supplied Medium (500); used temporarily with font synthesis disabled.                                                                                     |
| Asphalt reference image           | Visible in chat, unavailable as a downloadable file. Current texture is procedural SVG grain.                                                                           |

Set `approvedLogo` in `src/App.tsx` to an imported asset to update both the
splash and header. The positioning statement uses the identity's measured
height so adding the logo will not overlap it. The logo shown in chat has glow
and rendered shading; no flattened reinterpretation has been generated. If an
approved flat 2D export exists, use that export; otherwise retain the approved
artwork supplied by the user.

## Verification

`npm run build` passes TypeScript checking and produces a 338KB standalone HTML
file (about 150KB gzip). Chromium production-build verification passed **38
checks**, covering the exact stagger and hold, measured nearest-first order,
absorption and statement reveal, uninterrupted playback, pause, keyboard skip,
focus transfer, repeat visits, replay, blocked storage, and initial/live
reduced-motion preferences. No runtime errors occurred.

Responsive geometry checks passed at 1440×900, 768×1024, 390×844, 320×568 and
844×390, including phrase clipping and overlap checks. Stage screenshots were
captured for reading, attraction, transfer, positioning, handoff, and mobile.
Safari/Firefox and physical-device performance have not been tested.

For a reproducible browser pass, build first and run `npm run test:intro`.
The test harness starts its own production server, uses the installed Playwright
CLI with system Chromium, captures JPEGs under ignored `work/`, and closes its
browser and server afterward.
