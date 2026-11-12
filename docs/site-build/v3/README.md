# Converdive V3 — isolated hero review

The V3 preview is `?hero=v3`. The existing ten-section V2 website remains the default route. This hero has no navbar, vessels, balls, placeholder diagram or extra sections. The CTA opens the existing contact route.

## Original asset

The image was extracted from the supplied RAR using libarchive, without executing archive content. `public/brand/neon-swept-st-pauls.png` is byte-for-byte identical to the extracted PNG: SHA-256 `2f08cb05332f61fde3098649872e05c1f5998ef89cfa17891e49cf0e51afbc9b`, dimensions 1672 × 941. No regeneration, recoloring, resizing or replacement was performed. Responsive cover cropping keeps St Paul’s visible on phones. Separate CSS layers provide a local reading scrim, a faint masked luminance pass using the same image, and 2.65% vertical travel. Reduced motion removes the movement.

## Implementation

`src/site/HeroV3.tsx` and `hero-v3.css` contain the isolated composition. The exact question and supporting statement remain HTML. Space Grotesk 600 uses an existing installed font file under a V3-only family name, preserving V2 font matching.

The repository Motion Design skill supplied premium pacing, restrained secondary motion, no overshoot, keyboard feedback and motion reduction. The user’s named effects override generic entrance patterns. GSAP ScrollTrigger drives one reversible timeline; CSS owns the button hover.

- Optical Clarity Sweep Reveal: diffuse HTML beneath a sharp duplicate with a curved SVG clipping boundary and a narrow illuminated rim.
- Chromatic Intersection Mask: a masked, text-clipped coral/cyan/jade layer intersects only selected glyph regions. Its colors follow the source image’s lighting family; the whole title is never permanently rainbow-colored.
- Secondary Clarity Transmission: a separate curved boundary resolves the paragraph without sliding its words upward.
- Luminous Contour Assembly: SVG contour tracing precedes the resolved CTA surface.
- Magnetic Micro-Lift: 2px lift, 4px SVG-arrow travel and stronger border illumination over 220ms.

Desktop scroll distance is 240svh; phone distance is 205svh, with 0.65 smoothing. Progress 0–0.22 resolves the question, 0.22–0.36 raises it by 6vh (54px at 900px), 0.36–0.54 resolves the statement, 0.54–0.82 reserves the future installation, and 0.82–1 assembles the CTA. The headline’s first reveal is intentionally scroll-linked. Reduced motion presents a crisp final composition without pinned distance. Fast/reverse scrolling remains supported.

The future ball-transfer installation is not implemented here. Its integration must use the reserved interval and complete before the final CTA beat. Background URL and CTA destination are component props. The original V3 brief is retained in `hero-brief.md`.

## Verification

Build/typecheck passed. Playwright checks at 1440 × 900, 768 × 1024 and 375 × 812 verify the original image loads, three-line heading limit, text separation, no horizontal overflow, reverse scrolling, CTA visibility, reduced motion and absence of navigation/canvas. See `layout-qa.json`.

The review gallery supplies actual browser captures of arrival, partial clarity, chromatic interaction, supporting statement, reserved installation, contour assembly, completed composition, hover and focus at all three sizes. Review images are JPEG-compressed browser screenshots; the deployed background PNG remains unchanged. Background coverage and measured arrow movement are recorded in `visual-checks.json`. These are Chromium/emulated-viewport results; physical Safari/iOS behavior has not been verified. The screenshot gallery and source bundle are published under `/review/v3/`.
