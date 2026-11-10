# Converdive V2 review build

V2 refines the existing ten-section implementation. The approved business copy, causal chains, section order, vessel metaphor, persistent instrument, four demonstrations, three outcomes and calculator formulas remain in place. Source: React 19, TypeScript, Vite, GSAP 3.15.1, Three 0.187 and R3F 9. This is a review preview; contact infrastructure and production performance validation remain open.

## Implemented and verified

- Installed the complete four requested skill bundles at pinned revisions. Every copied file matched its upstream checkout. See [resource audit](RESOURCE-AUDIT.md) and [installation manifest](skill-installation.json).
- Real ScrollTrigger progress, 0.65 scrub, CSS sticky layout, direct selection and reverse scrolling. Scroll distances: causal 3.1, method 3.6, outcomes 1.95, implementation 3.0 viewport heights. Mobile and reduced motion use ordinary flow and explicit controls.
- Actual MotionPath intro and 3D transfer; SplitText typography; DrawSVG connection progression; Flip workflow expansion/consolidation. CSS and GSAP have distinct property ownership.
- The two open vessels retain their overhead extraction/travel/release mechanism. The Three/R3F chunk is separate from initial delivery. A complete still precedes shader preparation; precomputed industrial lighting preserves all six cubemap faces and all six roughness levels without regenerating the room on visitors' devices.
- Desktop starts the 3D transfer automatically. At 820px and below, the still appears immediately and **Play 3D transfer** enables the real renderer. Reduced motion keeps the still without automatic playback. This is an intentional mobile simplification, recorded rather than represented as automatic 3D everywhere.
- Causal surfaces: calibrated 0.84 neighbor scale, 22° yaw and 150px depth; four levels readable together; keyboard, touch, native problem inspection, explicit float pause and focus restoration.
- Four methodology states plus final differentiation. Six-step timed playback in each workflow, AI/automation/human responsibilities, pause/replay/reset, retained completion and unified workflow branch.
- Exactly three owner ripples. One persistent implementation diagram retains all five original workflow nodes while testing, safeguards and monitoring layers accumulate. No invented live statistics.
- Calculator: defaults 2 additional bookings/month, £24,000 monthly gross booking value, £288,000 annualized scenario.99% current booking rate caps additional bookings at 0.4 for 40 enquiries; zero enquiries returns zero. A 100pp assumption caps the resulting total booking rate at 100%. Keyboard slider and number field agree. Efficiency remains separate from booking value, profit and payroll savings.
- Contact preview validates details and says nothing was sent. Voice request, custom telephone error focus, native privacy dialog, Escape and form-close focus restoration are functional. No external enquiry was sent by testing.

## Actual browser evidence

Chromium via Playwright at **1440×900, 768×1024, 375×812**. Full scenes were exercised, not only photographed at rest. Generated screenshot inventory: [screenshots.json](screenshots.json). The preview's `/review/` gallery displays these real captures.

| Evidence | Result |
|---|---|
| [Cross-site checks](verification.json) | 41/41: order, anchors, production chunk, scroll reversal, calculator arithmetic, contact, viewport overflow, intro, returning visitor, reduced motion and fallbacks. Final assertion rerun reused prior captures rather than regenerating every image. |
| [Continuity checks](continuity.json) | 14/14: scene exits, complete implementation composition inside900px, live preference changes, invalid-field focus and720px reflow. |
| [Renderer checks](renderer.json) | 11/11: paused rendered pixels remain identical, resumed frames change, context loss, mobile opt-in WebGL, overflow and lighting fallback. |
| [Causal checks](causes-qa.json) | 27/27: all four chains, four levels, manual selection, reverse scroll, keyboard, inspection, touch and reduced motion. |
| [Outcomes / implementation](outcomes-implementation-qa.json) | 42/42: three cumulative outcomes, persistent nodes, retained layers, approvals, monitoring cycle, mobile and reduced motion. |
| [Method / workflow checks](method-workflows-qa.txt) |Passed: every timed state in all four demonstrations, completion, guidance, pause/replay/reset, unified branch and small-screen reduced motion. |

That is 135 individually recorded checks plus the separate detailed methodology/workflow suite. No unexpected runtime errors were recorded. Build/typecheck and application-source whitespace checks passed. Upstream skill files and generated audit HTML retain their original formatting. Earlier development-only section measurements remain identified in the section notes; the central evidence above uses the built application on port 4195.

## Performance and accessibility findings

Lighthouse 13.6, local production output, Chromium using **software WebGL (SwiftShader)**. Audited `?intro=skip`; these scores do not measure a first visitor's introduction or certify accessibility compliance. One browser ran at a time. Two serving conditions are retained so network compression is explicit.

| Local serving condition | Desktop performance / accessibility | Mobile performance / accessibility |
|---|---|---|
| Plain HTTP static server |67 / 100 |71 / 100 |
| HTTP gzip for ordinary text assets |69 / 100 |71 / 100 |

For compressed delivery, desktop LCP 0.3s, TBT 1,460ms, CLS 0.001; mobile LCP 0.9s, TBT 2,130ms, CLS 0.032. Uncompressed mobile LCP 3.9s and TBT 320ms demonstrate that task placement and network conditions materially affect this synthetic result. Reports: [desktop](lighthouse-compressed-desktop.report.html), [mobile](lighthouse-compressed-mobile.report.html); raw JSON and uncompressed reports are retained alongside them.

The audit exposed and led to repairs for SplitText paragraph semantics, visible control-name mismatches and dim unrevealed copy. Both final accessibility audits report 100. Manual keyboard and responsive checks supplement that score. **Performance remains a limitation**: initial script/renderer work still generates long tasks in this cloud browser. A real GPU, real phone and hosted network performance pass is still needed; this is not advertised as a 90+ performance build.

Main JS 491.45kB minified / 164.81kB gzip; optional renderer 933.84kB / 247.71kB gzip; CSS 122.08kB / 25.14kB gzip. The precomputed lighting asset is 1,090,070 bytes gzip, requested only when 3D is enabled. Vite's optional-renderer chunk-size advisory remains visible. Fonts use `swap` and declared logo dimensions reduce layout movement.

## Implemented but not fully verified

- Optional Turnstile explicit-render adapter and token/error/expiry cleanup are in source. No real keys, server token verification or end-to-end anti-bot integration was supplied or tested.
- Configurable HTTPS booking link and acknowledged-response enquiry interface exist. Real booking, message delivery, backend failure behavior and production data handling await the actual services.
- Browser evidence uses emulation and software rendering, not physical iOS/Android hardware. Automated audits do not establish full WCAG conformance or final production performance.
- CSS/SVG depth remains the deliberate lighter alternative for causal materials and the optical instrument; they are not ray-traced meshes or physical cleaning/fluid simulations. Method synthesis uses the permitted restrained transform/opacity alternative to particle disintegration.

## Awaiting assets or integration

- Actual delivery endpoint and server-side validation/rate limiting, booking destination, optional public Turnstile key plus backend secret, verified business contact routes and final business privacy details. No secret belongs in a `VITE_*` variable.
- The architectural screenshot named as the sole global color reference is absent from accessible attachments. Existing approved styling and the written charcoal/stone/warm/cyan direction were preserved; exact screenshot matching is not claimed.
- Only the supplied Cabinet Grotesk **Medium** file is present. An authentic Semibold file for the originally requested positioning weight has not been supplied. Existing Medium, Bespoke Stencil and Space Grotesk remain in use.
- Both Codrops articles and Motion Primitives Animated Number returned403. Their code was not inspected or copied. Documented CSS perspective, native controls and GSAP mechanisms are used instead. No React Bits, React Flow, Magic UI, shadcn, 21st.dev, Poly Haven or ambientCG runtime asset is falsely claimed as installed.

## Reproduce

`npm install`, `npm run build`, then serve `dist` at port 4195. Run `node tests/site-v2.mjs`, `node tests/site-v2-continuity.mjs`, `node tests/site-v2-renderer.mjs`; the earlier section suites accept the base URLs documented in their source. Work outputs go to ignored `work/`. `node tools/preview-compressed.mjs` supplies the explicitly compressed local audit server on 4196. Lighting generation instructions are in [HERO.md](HERO.md). All runtime assets, source, tests and the four skill bundles accompany this build.
