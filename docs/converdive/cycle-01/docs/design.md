# Converdive design system v0.1 — provisional implementation tokens

Brand name **Converdive**. Audience: UK commercial cleaning contractors. Voice: diagnostic, precise, professional, curiosity-driven; no guaranteed ROI or presumptive claims about a visitor's actual systems.

## Visual identity
- Base canvas: blue-black `#07101c`; elevated navy `#0c1929`; surface glass `rgba(15, 28, 45, .68)`; hairline `rgba(150, 193, 223, .18)`.
- Primary text `#f1f6ff`; secondary `#a8bbce`; cyan `#5edbe9`; blue `#648cfa`; violet `#9972ff`; mild green `#66dfb7` as 'validated/ready' indicator **only**, not proof of achieved business outcomes.
- Problem indicator muted coral `#e9998b`. Avoid painting *other industries* red as intrinsically bad.
- Section background shifts are subtle and purposeful (shift radial gradient positions/hues, not wholesale full-screen flashes).
- Typography: system sans fallbacks; headings heavy enough for legibility but not exaggerated; body 15–18px desktop; clear line height. Replace only after approved brand-font evaluation.
- Geometry: 16–24px corner radii for panels; 1px hairlines; layered depth through scale, blur and perspective, restrained glow.
- Motion: one focal animation at a time; avoid redundant energy beams, auto-sliding text walls or excessive section scroll hijacking.

## Motion contracts
- Desktop sticky scenes; mobile shorten distances or substitute accessible horizontal selector.
- Prefer compositor-safe `transform`/`opacity`. Use canvas/WebGL only when physically meaningful (cross-section/instrument), not for basic text.
- Avoid forced smooth-scroll libraries in the initial technical prototype. Animate using scroll position with native `requestAnimationFrame`, upgraded later to GSAP ScrollTrigger.
- All interactive content accessible by click, keyboard and programmatic state. Hover-only information prohibited.
- `prefers-reduced-motion: reduce`: no pinned scroll-driving, no perpetual floating, no camera spins; show static selected state and controls.

## Aesthetic references
`assets/references/s4-coverflow-reference-*.png` indicate active foreground card vs reduced-opacity, scaled-back adjacent cards. `assets/references/s8-*.png` depict a persistent existing workflow plus successive lifecycle layers. These are concept illustrations, not pixel-perfect final web specifications. See `docs/reference-index.md`.
