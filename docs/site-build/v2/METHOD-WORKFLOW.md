# V2 method and workflow implementation

Sections 05–06 retain the four methods — Diagnose, Prioritize, Engineer and Verify — plus a separate synthesis state. The original method, workflow, responsibility and conceptual-system copy is retained. The instrument is one persistent SVG instance, and the four demonstrations still each contain six nodes. Completion reveals the seven-stage connected workflow and its existing-account branch, joining specification before quotation.

## Motion and resource use

- **GSAP 3.15.1, installed dependency.** Direct imports use `gsap/SplitText`, `gsap/Flip`, `gsap/DrawSVGPlugin` and `gsap/MotionPathPlugin`. The installed package declares GSAP's [standard no-charge license](https://gsap.com/standard-license/), not MIT. No new dependency was added for these sections.
- **Actual SplitText.** Method copy splits after `document.fonts.ready`, uses `autoSplit` to recalculate lines on font/width changes, and returns each reveal timeline from `onSplit`. Diagnose reconstructs words; Prioritize opens line masks; Engineer assembles staggered words; Verify sharpens characters. A scoped GSAP context and explicit `SplitText.revert()` clean up on phase changes/unmount. CSS keyframes on those properties were removed.
- **Actual DrawSVG.** It draws the method entry connection and verification trace. In workflow playback it activates each real connection path only as the signal traverses that edge. Waiting edges remain visibly distinct.
- **Actual MotionPath.** The signal follows the same measured native SVG paths that connect the six HTML nodes. Five timeline callbacks update React's semantic step; frame-by-frame travel stays outside React state. One active timeline controls the approximately 3.9-second demonstration. Pause/play operates on that retained timeline. Replay creates a new playback; a width change recalculates geometry while preserving playback time and pause state.
- **Actual Flip.** Event handlers capture `Flip.getState` before expansion, collapse, completion and reset. `useLayoutEffect` calls `Flip.from` after React commits the new layout. Persistent rails, lower controls and the result wrapper participate, including the unified workflow appearing or disappearing. CSS does not animate the height or transform of these layout targets.
- **React Flow mechanism reference:** [Animating Edges](https://reactflow.dev/examples/edges/animating-edges), reviewed in the parent resource pass. Its path-following signal is a mechanism reference. This implementation uses native fixed SVG plus GSAP, with no copied React Flow source and no graph-editor dependency. React Flow's MIT licensing does not describe GSAP's separate license.
- **Shared scroll contract.** These sections continue using `useSceneProgress(5)` from `motion.ts`; they add no scroll listeners or independent pinned-scroll controller.

The precision instrument remains a restrained SVG material study rather than a 3D renderer. The machined-metal gradient, offset material shadow and glass layers improve depth. Existing discrete lens, aperture and module phase transitions remain CSS on separate targets; signal reconstruction, focus selection and verification traces use GSAP. This is the explicitly permitted lightweight fallback, not a claim that an R3F scene or photoreal model was implemented.

## Pacing, legibility and controls

The intended movement is confidence from a method that visibly reconstructs, focuses, connects and calibrates, followed by clarity from watching an actual workflow hand work between roles. Synthesis remains the fifth reading state rather than a fifth method. The method span is 3.6 desktop viewport heights; mobile becomes a compact composition with explicit stage buttons.

Workflow body copy and responsibility lists are 16–18 px. Method detail is 22 px on desktop and 17 px at 375 px. Meaningful secondary text uses brighter colors, and inactive rails retain readable text instead of applying opacity to the entire rail. Human control keeps its warm role treatment during completed states. Workflow triggers receive an inset focus outline so the Flip overflow boundary cannot clip it. Completing a panel restores focus to its trigger when a control inside it held focus. The ordered node list contains only six `li` children; decorative SVG connections sit outside the list.

Reduced motion bypasses timed travel and reveals the complete selected diagram. Completion, replay, selection, role descriptions and the unified branch remain available without animation.

## Verification

- `npm run build`: passes, including TypeScript. The overall site's separately loaded 3D hero chunk still produces Vite's existing size advisory.
- `node tests/site-method-workflows.mjs`: passes. It observes all six timed states in every workflow; verifies completion/collapse, next-workflow guidance, pause, replay, reset, the seven unified nodes and account branch; and checks reduced-motion/mobile states and local overflow.
- Development Chromium viewport checks at **1440×900**: method span **3.6** viewport heights; complete control group ends at **884.14 px**, inside the viewport. Actual SplitText wrappers are present.
- Development Chromium checks at **375×812**: all four method states retain the complete control group, ending at **797.08 px**. No document-level horizontal overflow. Meaningful method detail remains **17 px**.
- A paused workflow frame contains one fully drawn edge, a partially drawn current edge, and three waiting edges. The signal's SVG transform follows the active path. All six ordered-list children are `li`. No page errors were recorded.

Screenshots: [desktop method](screens/method-desktop.png), [phone method](screens/method-mobile.png), [paused workflow](screens/workflow-desktop.png).

Limitations: these are fixed conceptual illustrations, not an editable graph or evidence of a live client deployment. Dense workflow diagrams scroll within their own regions on a phone. The inline unified SVG uses smaller diagram annotations while keeping the surrounding narrative and responsibility lists at readable body sizes.
