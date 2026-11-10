# Hero V2 enhancement notes

Scope: `HeroSection.tsx`, `HeroInstallation.tsx`, `HeroFallback.tsx`, `hero-section.css`, and `materials.ts`. The approved text, two open vessels, overhead transfer rail, sequence, and absence of a hero CTA are retained.

## Source use

- Read the installed `.agents/skills/scroll-craft/SKILL.md` and `references/hero-depth.md`: retained distinct semantic copy, atmospheric backdrop, dimensional apparatus and foreground plinth; kept the mobile composition and still fallback complete.
- Read `.agents/skills/frontend-design/SKILL.md`: retained this site's industrial apparatus as its characteristic visual, kept the surroundings restrained, and avoided adding decorative sections or changing business copy.
- Read `.agents/skills/react-three-fiber/SKILL.md` and `references/UPSTREAM-README.md`: retained React 19 / R3F 9 compatibility, shared resources, bounded DPR, offscreen suspension, modular Canvas, and lightweight fallback.
- Consulted installed GSAP 3.15.1 `types/motion-path-plugin.d.ts`, `MotionPathPlugin.js`, and `types/split-text.d.ts` for numeric path properties, `curviness`, context cleanup and SplitText accessibility/reversion. Official reference entry points: [MotionPathPlugin](https://gsap.com/docs/v3/Plugins/MotionPathPlugin/), [SplitText](https://gsap.com/docs/v3/Plugins/SplitText/), [gsap.context](https://gsap.com/docs/v3/GSAP/gsap.context/).
- Used Three's installed `MeshPhysicalMaterial` API and `WebGLRenderer.transmissionResolutionScale`. The glass uses nonmetallic IOR 1.46, restrained transmission and thickness; steel and bead surfaces reuse a shared PBR material kit. No additional dependencies, custom refraction render targets, postprocessing or shadow maps were added.

## Motion ownership and loading

- The optional intro has one scoped GSAP timeline lasting **4.40 seconds**, with a **4.50-second** completion escape hatch. Seven viewport-relative MotionPaths converge along arcs. SplitText animates wordmark characters and positioning words while retaining readable accessible text. Skip, Escape, preference changes, and unmount all have idempotent completion or cleanup.
- CSS keyframes were removed from the intro. GSAP alone owns its animated transforms and opacity; CSS supplies layout and static appearance.
- Hero transfer has one GSAP timeline with exactly two cycles. MotionPath interpolates numeric `x`, `y`, and `z` proxy values through extraction, overhead travel and landing. R3F `useFrame` copies these values into objects; it does not increment time or run another animation clock.
- The Canvas uses demand rendering, at most 30 requested animation frames per second, DPR 1–1.5, one precomputed room environment and two static directional lights. The transmission buffer is half resolution. Repeated beads reuse one geometry; industrial materials are created once per installation and disposed on cleanup.
- Transfer pauses when the user selects Pause, the document is hidden, the illustration is offscreen, or reduced motion is requested. The second landing ends the timeline. Initial reduced motion shows the complete initial still composition.
- `React.lazy` keeps R3F/Three behind `HeroInstallation`; Suspense uses the separate lightweight SVG installation. The same open-vessel SVG handles absent/lost WebGL and rendering errors; a lightweight outer boundary also covers a failed optional chunk import. Essential business text and labels remain in DOM.
- Desktop headline is capped at **72px**, including the wide-screen media query. Desktop top spacing and scene height are tightened so the vessel bodies and labels fit at 1440×900. Mobile keeps its own existing typography and apparatus framing.

## Verification

- `npx tsc --noEmit` passed after the final material/render-budget changes.
- Chromium, 1440×900 and 390×844: no page errors and no horizontal document overflow during the initial WebGL run. Inspected pixels for the phrase arcs and positioning, the apparatus, its open rim geometry and plinth, and both desktop/mobile compositions.
- That initial inspection exposed excessive glass milkiness from the first physical-material values. The final revision lowered opacity/environment contribution and halved transmission resolution. Final WebGL appearance and pause/offscreen/context-loss checks are handed to the shared central V2 QA pass to avoid simultaneous GPU-heavy browser runs.
- Temporary browser evidence is under `work/site/v2-hero/`; the first screenshot run clicked Pause through Puppeteer, which scrolled the apparatus into view. Those apparatus screenshots do not prove the opening's final fold fit. Opening measurements and final shared screenshots must be taken at `scrollY = 0`.

- Lightweight Chromium no-WebGL checks: natural completion, Skip and Escape passed; reduced motion omitted both intro and Pause control; fallback retained the two open vessels; no horizontal overflow at 1440×900 or 390×844. Final opening measurements at `scrollY = 0`: headline 72px, vessel labels end at 887px desktop and 823px mobile. No hero link/CTA was introduced. The first natural-completion observation saw removal after 4.97s while the heavy optional module was loading; to leave more scheduling margin, the timeline was shortened from 4.65s to 4.40s and its escape hatch to 4.50s, retaining margin under the 4.75s requirement.

## Final startup correction

Lighthouse exposed expensive live PMREM generation (roughly3 seconds of desktop blocking in software WebGL). Three0.187 clamps its PMREM generator to a minimum256px face, so lowering the requested size to64 did not reduce that work. After inspecting the installed implementation, the final version precomputes the same `RoomEnvironment`, sigma0.04, six faces and all six roughness levels into a1,090,070-byte gzip asset. `lighting.ts` uses Three's supported RGBA half-float compressed-container upload path and native streaming decompression. No lighting detail is discarded. The still remains visible while lighting and asynchronous shader compilation prepare; the transfer clock waits for renderer readiness.

Rebuild the lighting asset only when the room or pinned Three version changes: run Vite, then `node tools/bake-industrial-lighting.mjs` (optional `LIGHTING_BAKE_URL`). The tool is local development tooling, never shipped in the website runtime. The asset is generated from Three's MIT-licensed procedural room, not Poly Haven or ambientCG.
