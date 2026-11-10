# Cycle 1 browser verification — 2026-11-09

## Tested (headless Chromium / inline source injection)
- [PASS] Ten numbered sections (`main > section`) render.
- [PASS] Four causal cards / four inspection points are generated without JS exceptions.
- [PASS] Desktop coverflow appears with readable active causal chain; next control changes displayed card.
- [PASS] Section 05 has four methodology controls plus differentiation synthesis control, and selection updates both instrument and text.
- [PASS] Section 09 illustrative arithmetic: 100 monthly enquiries × 5 percentage points uplift = 5 additional booked accounts/month; £1,000 gross value → £5,000 gross monthly scenario value.
- [PASS] Contact submission visibly states **not sent or stored**, avoiding false confirmation.
- [PASS] 375px, 768px, 1440px widths: no document horizontal overflow on tested viewport.
- [PASS] 390px mobile screenshot shows readable cross-section; selecting next works.
- [PASS] `prefers-reduced-motion` view preserves direct-selection controls.
- [PASS] No page-level JavaScript exceptions in performed tests.

## Limitations / blocked checks
- This environment blocks browser navigation to `localhost:` and `file:` URIs, so testing used a headless browser with the actual local HTML/CSS/JS injected inline. This verifies rendering and JavaScript logic, **not** static-server hosting or production routing.
- npm registry unavailable (DNS), so no Next.js/GSAP/R3F dependency installation, build or framework tests were possible here.
- Sections 01–03 and 06–10 are functional/structural previews, not fully implemented choreography. Section 04 uses CSS perspective instead of a true Three.js 3D mesh; Section 05 uses SVG/CSS instead of a WebGL instrument.
- No account credentials or providers connected; form, call scheduling, email and hosting are intentionally unconfigured.
- Visual resemblance to prior reference screenshots is conceptual and not formally pixel-matched.
- Accessibility was smoke-tested for button availability and reduced motion only; screen-reader audit pending.

## Screenshot evidence (within this folder)
`desktop-home.png`, `desktop-causes.png`, `desktop-method.png`, `mobile-home.png`, `mobile-causes.png`.

## Next QA cycle
Real localhost/preview server in Antigravity; Next.js build + lint + Playwright; performance budget; mobile scroll capture behavior; verify content and layout across Chrome, Firefox and Safari; add validated contact integrations.
