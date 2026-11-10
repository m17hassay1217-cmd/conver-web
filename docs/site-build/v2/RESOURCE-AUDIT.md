# V2 resource audit

Reviewed 10 November 2026. This is a record of resources actually installed, read, or used in the active website. Installation does not mean a library was shipped. The V2 brief preserves the existing ten sections, fixed copy, brand assets, and hero without a CTA; references supply mechanisms, not a replacement design.

## Skills installed and applied

The complete copied bundles and pinned revisions are recorded in [skill-installation.json](skill-installation.json). No scripts from these new bundles were executed. The four `SKILL.md` files were read for this review; supporting files are listed below.

| Skill | Installed revision / files | Applied to actual source | Deliberately not applied |
| --- | --- | --- | --- |
| `scroll-craft` | `75d81f74e83692add18cd7a8a8e078b8a887a579` / 25 regular files | Read `references/hero-depth.md`, `taste.md`, `approved-collection.md`, and the applicable contrast verification guidance. Reviewed semantic copy, restrained dimensional hero, mobile composition, scene pacing, static fallback, offscreen work, reduced motion, and intermediate-state evidence in `src/site/HeroInstallation.tsx`, `motion.ts`, and section styles. The preserved journey and intentional exceptions are in [BRIEF.md](BRIEF.md). | No Scrollcraft runtime engine import, Kie asset generation, fresh-site skeleton, replacement brand, or new section order. The user's preservation instruction governs those choices. |
| `frontend-design` | `2c5958ecac7cee2b583967a2c4981d0f4a75c579` / 2 | Read the skill. Applied its restraint, visible focus, typography, readable measure, and subject-specific visual review to the existing Cabinet/Space/Bespoke typography and procedural illustrations. Contrast and small-text issues were sent as file/line findings before implementation fixes. | No new aesthetic direction or copy rewrite. A third brand wordmark face is retained because it is an existing supplied identity asset. |
| `vercel-react-best-practices` | `1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62` / 76 regular files | Read the skill and `bundle-dynamic-imports`, `bundle-conditional`, `client-passive-event-listeners`, `rerender-use-ref-transient-values`. Reviewed `HeroSection.tsx` lazy scene boundary, `HeroInstallation.tsx` frame mutation and render gating, `motion.ts` scene updates, and `vite.config.ts` chunking. | No Next.js migration or unrelated server/RSC rules. This is a client-rendered Vite application. Lazy imports must be confirmed in the production package, not inferred from source alone. |
| `web-design-guidelines` | `1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62` / 1 | Read the skill and fetched the current guideline source immediately before reviewing the active `src/site` files. Applied accessible names, focus, dialogs, form states, contrast, responsive layout, motion, font loading, and image sizing guidance. See [ACCESSIBILITY-REVIEW.md](ACCESSIBILITY-REVIEW.md). | Content/capitalization suggestions do not override the user's fixed copy. No claim that automated checks alone certify accessibility. |

These are the four new V2 skill bundles. Earlier project skills remain installed under `.agents/skills`; this audit does not claim all earlier skills were newly installed, read, or applied in V2.

Regular-file counts were checked from the copied directories. The manifest now records 25/2/76/1 files. An independent byte comparison against the fetched repository checkouts matched every copied file, with no changes or missing files; the repository HEADs matched all three pinned revisions. Evidence: `work/v2/skills-copy-integrity.json`. Scrollcraft's copied license was compared to its repository-root license. No bundled skill script was run.

The fresh Web Interface Guidelines request succeeded: <https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md>, 8,055 bytes. Local review snapshot: `work/v2/web-interface-guidelines-2026-11-10.md`; SHA-256 `d246b026f4f29b5823a9cc857f9edf3d2507002e055e32040cadeaf3b38e0234`. It was inspected as documentation, not executed.

## Runtime resources and optional references

| Resource | Actual V2 use | Status / reason |
| --- | --- | --- |
| GSAP 3.15.1 | Real dependency. `src/site/animation.ts` registers `ScrollTrigger`; `motion.ts` uses a scrubbed playhead. `HeroSection.tsx` imports `MotionPathPlugin` and `SplitText` for the entrance. | Used. Timelines must clean up and reduced-motion paths must remain complete. Package version verified in `node_modules/gsap/package.json`; not described as MIT. |
| GSAP ScrollTrigger, MotionPath, SplitText, DrawSVG, Flip | Actual source imports, not a visual imitation of the named APIs. `IndustrySection`, `ProblemsSection`, `CausesSection` and `MethodSection` use DrawSVG; `WorkflowsSection` registers Flip/DrawSVG/MotionPath; `ImplementationSection` registers DrawSVG/MotionPath. | Used. Production build/browser evidence determines whether the final interactions pass. |
| Three.js and React Three Fiber | Existing dependencies used by `HeroInstallation.tsx` for vessel geometry, physically responding materials, lights, transfer mechanism, and scene rendering. | Used only where true 3D supports the existing metaphor. Static fallback, pixel-ratio cap, offscreen pause, and context-loss handling remain required. |
| Drei | No `@react-three/drei` dependency or active-source import. Three's `RoomEnvironment` is used by the local lighting bake tool. The runtime loads all prefiltered cubemap levels without regenerating them. | Not needed; do not describe the room environment as a Drei implementation. |
| Native SVG / CSS / React | Active causal structures, workflow rails, ripple diagrams, connectors, forms and responsive composition. | Used. Preserves semantic copy and useful controls without importing a general diagram/UI framework. |
| Codrops [3D infinite carousel](https://tympanus.net/codrops/2025/11/11/building-a-3d-infinite-carousel-with-reactive-background-gradients/) and [on-scroll 3D stack](https://tympanus.net/codrops/2024/03/06/on-scroll-3d-stack-motion-effect/) | The parent web-tool requests returned HTTP 403 for both articles. Their contents were unavailable to inspect. No linked demo was visited. | Inaccessible. No claim to have read, reproduced, or copied their code. Existing perspective, thickness, yaw and coverflow are calibrated locally. |
| React Bits Particle Text | No React Bits component import or copied implementation. | Not adopted. The existing entrance uses the approved logo/copy with GSAP; an extra particle renderer is unnecessary. |
| React Bits Target Cursor / Magic Rings | No component import or custom replacement pointer. | Optional references not adopted; native pointer and focused reading remain appropriate. |
| Motion Primitives Animated Number / Spotlight | No Motion Primitives dependency or source import. The parent request for Animated Number documentation returned 403; its contents are not claimed as inspected. | Not adopted. Calculator number transitions use the app's GSAP mechanism and a native range control; no extra spotlight layer is needed. |
| Magic UI Animated Beam | No Magic UI dependency or copied beam component. | Not adopted. The implementation uses local SVG connectors and controlled scene state. |
| 21st.dev | No component source imported from the service. | Not needed for the fixed bespoke sections. No blanket claim that its catalog was reviewed. |
| shadcn/ui | No shadcn component import or generated component files in the active website. | Not needed; existing native controls are retained. |
| React Flow | No React Flow dependency or import. | Not needed for illustrative fixed workflows; they are not a diagram editor. |
| ambientCG / Poly Haven | No stock asset downloaded or shipped. A locally generated, compressed lighting map is included. | Not needed: current scene materials and geometry are procedural. Asset provenance is not invented for procedural effects. |
| Cal.com embed | No embed or fabricated calendar. The existing contact flow accepts a verified HTTPS booking destination through `VITE_BOOKING_URL`. | Not integrated without actual booking configuration. Its absence is disclosed by the interface. |
| Cloudflare Turnstile | `TurnstileField.tsx` implements an optional adapter to the official explicit-render script. `ContactSection.tsx` mounts it only with both an endpoint and `VITE_TURNSTILE_SITE_KEY`, and attaches the token to the submission. | Integration interface implemented; no real site key or receiving-server verification configured or tested. The preview honeypot/cooldown is not represented as server-side bot protection. Actual receiving infrastructure must verify every token. |
| Existing supplied fonts and logo | Existing assets retained. `SpaceGrotesk-OFL.txt` accompanies the Space Grotesk asset. | No new stock identity or image/font asset was downloaded for V2. The architectural screenshot remains unavailable in accessible attachments, so it is not claimed as inspected. |

## License and copying evidence

GSAP's installed README line 91 and package metadata identify the **standard “no charge” license**, linking to <https://gsap.com/standard-license>. A fresh direct request to that license page returned HTTP 403 in this review, so the full live terms are not claimed as read. This is a normal marketing website use; no GSAP source is repackaged as a competing animation tool. Preserve the package's license references and do not relabel it MIT.

The new skill bundles are instruction/reference material with their own upstream licensing and pinned provenance. Reading or copying a skill into `.agents` does not add its example runtime or authorize unrelated asset reuse. No large third-party UI snippet, Codrops source, stock texture, HDRI, or reference-brand asset was copied into the active V2 source in this review.

## Evidence limits

This audit inspects source and resource provenance. The parent integration pass owns production build sizes, Playwright screenshots/interactions, Lighthouse, no-WebGL, and reduced-motion results. Existing V1 screenshots and reports do not establish a V2 pass. No real phone, production booking, real message delivery or external anti-bot configuration is claimed from local source review.
