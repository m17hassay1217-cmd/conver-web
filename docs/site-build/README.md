# Converdive — complete ten-section website

## Run and build

```sh
npm install
npm run dev -- --host 0.0.0.0
npm run build
npm run preview
npm run test:site
```

The app uses the existing React19/TypeScript/Vite architecture and R3F9/Three.js. All ten sections are imported by `src/site/Website.tsx`. Older intro and effect-study source files remain as checkpoints but are not imported by this website. V2 adds GSAP 3.15.1 for shared scroll/timeline orchestration and the selected plugins. The four targeted design/review skills are installed under `.agents/skills`; see [V2 resource audit](v2/RESOURCE-AUDIT.md) for exact usage and pinned revisions.

`?intro=review` forces the new skippable intro, `?intro=skip` opens the website directly. Returning visitors skip the intro via a browser-local flag. OS reduced motion bypasses it.

## Architecture

- `HeroSection.tsx` / `HeroInstallation.tsx`: concise intro and genuine open-vessel R3F transfer scene.
- `IndustrySection.tsx`, `ProblemsSection.tsx`, `CausesSection.tsx`: scanner/wipes, paired material inspection, four-layer causal coverflow.
- `MethodSection.tsx`, `WorkflowsSection.tsx`: persistent precision instrument, methodology synthesis, guided responsibility-labelled simulations.
- `OutcomesSection.tsx`, `ImplementationSection.tsx`: exactly three proportional ripples and cumulative lifecycle layers on an existing workflow.
- `CalculatorSection.tsx`: bounded illustrative commercial/efficiency scenarios and transparent formulas.
- `ContactSection.tsx`: contact routes, validated request interface and preview privacy disclosure.
- `animation.ts` / `motion.ts`: shared GSAP ScrollTrigger state (scrub 0.65), CSS sticky layout and manual override. Upward scrolling reverses state; small screens and reduced motion use explicit controls.

## Contact configuration and production boundary

Use `.env.example` as the configuration template. All `VITE_*` values are public build-time values. Never put private email/API credentials in them.

- `VITE_BOOKING_URL`: verified HTTPS calendar link. Absent → clearly disclosed local call-request interface.
- `VITE_CONTACT_ENDPOINT`: HTTPS or same-origin POST endpoint. Absent → no request is made and no delivery success is shown.
- `VITE_BUSINESS_EMAIL` / `VITE_BUSINESS_PHONE`: optional verified business alternatives.
- `VITE_TURNSTILE_SITE_KEY`: optional public widget key, mounted only with a delivery endpoint. The receiving server must verify tokens using its private secret; no real keys or backend are configured.

The request JSON contains business, name, email, optional phone, preferred communication and description. Only a successful HTTP response with `{"received":true}` is treated as confirmed acceptance. Network errors, invalid responses and a15secondtimeout report failure. Preview-copy action is separate from sending.

Client validation, a honeypot and cooldown are included. A real receiving backend must independently validate and sanitize input, enforce origin policy and server-side rate limits/spam controls, store credentials securely and arrange actual message delivery. Client checks are not a security boundary. No real backend delivery, booking provider, legal business identity or final production privacy policy was supplied or fabricated.

## Rendering fallbacks

- Architectural screenshot described in the brief was not attached. Styling follows the written palette and material direction; no unrelated external reference was substituted.
- Hero: real hollow lathed vessel geometry, rims, solid base,18left/6right beads, two bounded upward/overhead/downward transfers. Renderer error/context loss → equivalent static SVG installation.
- Section04: CSS3D yaw, thickness and exploded layers; not claimed as a physically ray-traced mesh.
- Section05: persistent procedural SVG instrument. The explicitly permitted scale/position/opacity synthesis replaces expensive particle fragmentation.
- Surface textures, scanners, ripples and diagrams are CSS/SVG, not physical cleaning/fluid simulations.
- Workflow and implementation states are illustrative, not real customer activity or monitoring data.

See `master-brief.md` for the full authoritative request, `IMPLEMENTATION.md` for decisions, and the generated verification report/screenshots for observed browser results.

V2 evidence, limitations, browser state captures and audit findings are documented in [v2/VERIFICATION.md](v2/VERIFICATION.md). The optional Three.js chunk loads after the complete SVG still first paints, with failed-load and no-WebGL fallbacks. No single-file production bundle is used in V2.
