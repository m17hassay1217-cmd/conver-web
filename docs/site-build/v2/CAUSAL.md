# V2 targeted changes: Sections 02–04

The existing industry scanner, problem inspector and four-level coverflow remain the composition. Section order, all eight industries, the three reasons, the four material identities and the exact four causal chains in `causal-data.ts` are preserved.

## Design and motion decisions

The existing deep navy, cyan, pale paper and warm material palette remains. Cabinet Grotesk carries the headings and Space Grotesk carries reading text. The scanner stays a field on the left with its explanation on the right; problems remain an offset constellation paired with material specimens; the causal chain stays a complete cross-section. No generic feature-card grid or replacement visual system was introduced.

The cross-section is the main reading plane. Its body annotations are 16px on the tested desktop, 15px on the tested tablet and 13px on the tested phone, with 12px level labels. All four levels remain visible together. Desktop neighboring scenes use an immediate-neighbor scale of 0.84, yaw of 22 degrees and Z distance of 150px; the active scene is scale 1, yaw 0 and Z 0. Farther scenes continue to recede. The old immediate-neighbor depth of 340px was removed. The desktop section is 310svh including its held viewport, with stable reading intervals before each transition. Tablet, phone and reduced-motion layouts use ordinary document flow and direct selectors.

The shared GSAP ScrollTrigger hook owns smoothed progress (`scrub: 0.65`), while CSS sticky holds the scene. Section-local code does not add a second pin, a second scroll listener or another transform tween. CSS transforms read that progress, and the old competing CSS transform transition was removed.

## Resources actually used

| Resource | Use in this change |
|---|---|
| Installed `scroll-craft/SKILL.md`, `references/taste.md`, `references/hero-depth.md`, `references/approved-collection.md` | Reading-plane hierarchy, restrained independent depth, readable responsive composition, real visual verification. Hero guidance was applied only as relevant to shared physical anchors and depth; no new hero was built in this scope. |
| Installed `frontend-design/SKILL.md` | Preserve the subject-specific scanner, specimen and cross-section language; keep the existing typography and palette. |
| Installed `web-design-guidelines/SKILL.md` | Review keyboard controls, focus, contrast, reduced motion and usable labels. Its requested fresh GitHub guidelines fetch failed because the execution proxy was unavailable; this document does not claim the remote guidelines were read. |
| Installed `playwright-cli/SKILL.md` and local Playwright/Chromium | Actual browser captures and interaction checks against the parent's latest Vite server. |
| GSAP 3.15.1 + DrawSVGPlugin | Scoped, paused timelines draw the selected-industry thread and exit, problem-to-material paths, causal-level connections, and four root-marker joins into the right-to-left U-turn exit. The timelines are advanced by shared scene progress and reverted on unmount. |
| Existing procedural material treatments | Glass reflection and clouding, carpet weave and misalignment, industrial tile joint and interruption, brushed steel and disconnected marks. Strengthened edge lighting, contact shadow and carpet weave provide material separation without downloaded or generated assets. |

The parent attempted both Codrops articles, [3D infinite carousel](https://tympanus.net/codrops/2025/11/11/building-a-3d-infinite-carousel-with-reactive-background-gradients/) and [on-scroll 3D stack](https://tympanus.net/codrops/2024/03/06/on-scroll-3d-stack-motion-effect/). Both returned HTTP 403; neither article nor linked demo was inspected. The coverflow is the repository's existing `translate3d`/`rotateY`/`scale` construction, locally calibrated to the values above. It is a documented mathematical approximation, not an implementation copied from those inaccessible references.

GSAP Flip was considered for the inspector and deliberately not added. The existing native modal already has a clear material-to-explanation relationship; a spatial morph would add competing motion without improving the inspection task. Native `showModal()`, the close control, Escape, backdrop dismissal, the focus loop and return focus are retained. The explanation is now linked through `aria-describedby`.

## Continuity and controls

Problem card destinations are measured against their matching material specimens. The end transition therefore moves each card toward its own specimen rather than using one universal translation. The pair paths use the same measured anchors. Floating motion is bounded to 10px, pauses on hover and focus, and has a persistent accessible **Pause floating** toggle. Hover scale is 1.035. Touch and reduced-motion modes omit the ambient drift.

The root exit has four distinct joins from the root-marker positions to the shared connection. DrawSVG draws the shared path from right to left, rounds the left U-turn, descends, then withdraws its tail as the specimens leave. This is an HTML/CSS/SVG spatial illustration: reflections and surface marks are procedural metaphors, not photographs or a physically based material simulation.

## Verification evidence

- `npx tsc --noEmit` passed after the final code changes.
- Actual captures are in `work/site/v2-causal/`: three held desktop states at 1440×900, three manual phone states at 375×812, and three tablet states at 768×1024. Desktop frames show Qualification, Specification integrity and Account expansion; the final browser pass additionally checks Proposal progression at every size.
- `work/site/v2-causal/qa.json` contains measured annotation bounds, computed font sizes, horizontal-overflow checks and browser error results.
- Native inspector verification checks initial close-button focus, Escape dismissal and restoration of focus to its originating problem card. The final pass also checks that the explicit pause control stops the card animation.
- These are development-server checks. The parent performs the combined production build and final integrated verification after all section work is frozen.
