# V2 accessibility and interface review

Source reviewed 10 November 2026 against the freshly fetched [Vercel Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md), Scrollcraft's contrast/verification guidance, and the user's fixed ten-section brief. Scope: `src/site`, global typography, entry point, and production bundling. This is a source review with calculated color-pair evidence; rendered-frame and interaction checks belong to the parent V2 verification run.

## Initial findings sent for repair

Locations identify the initial review snapshot; later implementation can move lines. Keep an issue here until the affected final behavior is verified.

| Priority | Source location | Finding and required repair | Initial evidence |
| --- | --- | --- | --- |
| High | `src/site/method-workflows.css:49` | Method selectors, prefixes, resume control, and scroll instruction fall below normal-text contrast. Raise the actual text colors, including inactive controls. | `#647e8b` / `#08141c`: 4.35:1; prefix `#4b6674`: 3.06:1; resume `#5a7c8d`: 4.17:1; instruction `#4c6878`: 3.16:1. Normal text needs 4.5:1. |
| High | `src/site/method-workflows.css:52` | Workflow explored counter needs stronger text contrast. | `#4d6a7a` / `#0a1922`: 3.11:1. |
| High | `src/site/method-workflows.css:53` | Workflow subtitles/state labels are too dim; `.is-secondary { opacity:.57 }` further reduces real copy contrast. Dim decoration separately. | Subtitle `#647e8c` / expanded `#10242f`: 3.73:1 before ancestor opacity. |
| High | `src/site/method-workflows.css:55` | Waiting workflow roles/order numbers need readable contrast; progress cannot make labels unreadable. | Order color `#486574` and 8px role/order labels warrant targeted repair and final rendered contrast check. |
| High | `src/site/method-workflows.css:56` | Workflow counter and responsibility detail need brighter text. | Counter `#587888` / `#10242f`: 3.39:1; responsibility `#6f8b9b`: 4.44:1. |
| High | `src/site/method-workflows.css:57` | Workflow control/authority note is real disclosure, not decorative text; raise contrast and keep readable mobile size. | Color `#476c80`, 10px desktop / 9px mobile. |
| High | `src/site/method-workflows.css:58` | Unified-workflow disclaimer needs stronger contrast. | `#587f91` / `#0a1922`: 4.14:1. |
| High | `src/site/ContactSection.tsx:35` | Privacy dialog uses `<dialog open>` rather than the native modal lifecycle. Use `showModal()` / `close()`, reliable Escape dismissal and focus return to the invoker. | Initial implementation manually traps Tab to one button and does not restore invoker focus. Background content is not made inert by setting `open` alone. |
| Medium | `src/site/WorkflowsSection.tsx:73` | Completing a demo removes the focused panel controls. Restore focus to that workflow's trigger when a focused panel collapses. | `finish()` sets `active` to null; panel buttons unmount. Includes timed completion while a control is focused. |
| Medium | `src/site/WorkflowsSection.tsx:23` | Decorative track is a direct `<span>` child of `<ol>`; move it outside the list so only list items form the workflow. | Source-confirmed invalid list structure. |
| Medium | `src/styles.css:6` | Both supplied brand fonts use `font-display:block`; change to `swap` and confirm readable fallback. | Initial declarations at lines 6 and 13 permit invisible text while fonts load. |
| Medium | `src/site/decision-sections.css:1` | Footer legal copy is below normal-text contrast. | `#5e7a8b` / `#071219`: 4.18:1. |
| Medium | `src/site/HeroSection.tsx:4`, `vite.config.ts:3` | Initial static Three/R3F import and single-file build make the full 3D renderer part of initial delivery. Use a lazy boundary with complete static fallback and real production chunks. | Source-confirmed initial delivery issue, not a measured Lighthouse result. |
| Low | `src/site/Website.tsx:25`, `src/site/ContactSection.tsx:34` | Logo `<img>` elements lack HTML width/height attributes. Add intrinsic dimensions matching their CSS footprint. | CSS supplies a fixed visual size, limiting current risk; intrinsic dimensions still make the asset contract explicit. |
| Low | `src/site/ContactSection.tsx:28` | Add `spellCheck={false}` to email field. | Existing type/name/autocomplete/label are present. |
| Low | `src/site/ContactSection.tsx:14` | Custom telephone validation reports a message without focusing the invalid field. Focus the field and associate its error when custom validation fails. | Native `reportValidity()` handles built-in invalid fields; the seven-digit custom check is a separate path. |

## Source repair follow-up

The final-source reinspection confirms these implementation repairs, pending the parent browser results:

- `method-workflows.css:73`–`107` raises methodology/workflow control, explanatory and disclosure text colors and sizes. The secondary-rail opacity reduction was removed. `#8da7b4` is now the minimum methodology helper color, replacing the failing pairs above. Original contrast calculations are preserved in `work/v2/contrast-source-initial.json`, reproducible with `node work/v2/contrast-source-probe.mjs`.
- `ContactSection.tsx:14`–`17` remembers the privacy invoker and calls native `showModal()`/`close()`. The mounted dialog has Escape/cancel/close handling; `site.css` styles the native backdrop. Real browser focus restoration still needs confirmation.
- `WorkflowsSection.tsx:139`–`147` restores focus to the invoking workflow trigger before removing a focused panel. The decorative connector SVG now sits outside its ordered list (`:67`–`:76`).
- Both brand font declarations now use `swap` (`styles.css:5`, `:12`). `HeroSection.tsx:12` lazy-loads the Three/R3F scene with `HeroFallback`; `vite.config.ts` no longer invokes the single-file plugin. Production resource timing and bundle totals still require the final build.
- Header/footer logos now declare intrinsic width/height. The email field disables spellcheck; the custom telephone error focuses the telephone field. An explicit `aria-describedby`/`aria-invalid` link for that custom error is still a small follow-up opportunity.
- `decision-sections.css:2` raises footer legal text to `#8da7b4` and 11px, replacing the failing initial color.
- The added calculator range now shares the 0–100 bound with the number input, so its thumb, displayed assumption and `aria-valuetext` describe the same value. Desktop problem-card floating motion now has an explicit pause state/control.

The initial findings are retained as a repair history, not a claim that those original defects remain in final source. No rendering pass or full accessibility conformance is inferred from these source fixes.

## Sound existing patterns

- Native buttons and links, visible global `:focus-visible` rules, named navigation, a skip link, one semantic hero `h1`, labelled calculator/contact controls, native disclosure elements, and polite calculator result updates are present.
- The problem inspection uses `showModal()`, Escape/close handling and a remembered invoking button. This is the local pattern recommended for the privacy repair.
- The 3D hero has semantic figure description outside its hidden render subtree, a static SVG fallback, WebGL error/context-loss handling, reduced-motion state, a pause/resume control for its longer motion, bounded device pixel ratio, and render gating when offscreen/hidden.
- Causal carousel controls support explicit previous/next/selection buttons, keyboard arrows/Home/End and touch swipe. Its diagram is not gesture-only.
- Essential hypothetical/disclaimer copy remains real text. Client-only calculator outputs use `Intl.NumberFormat`, saturation and separate booking-value/staff-cost concepts.
- Contact submission has native validation, labels/names, explicit loading/error/success feedback, timeout and response verification. An absent endpoint produces a clear preview state, not a delivery claim.

## Required final browser checks

The parent verification pass should record results against final source, with screenshots where visual judgement matters:

1. Desktop opening/midpoint/exit for each authored scene; final tablet, 390px phone and compact 360×640 compositions; 200% zoom/reflow and no horizontal document overflow.
2. Tab entry through menu, carousel, inspected problem, methodology, workflow playback, calculator, contact and privacy. Verify visible rings are not covered by sticky navigation, Escape works, and closing/removing content restores a useful focus target.
3. Actual text contrast after ancestor opacity, gradients, disabled states and reveals. The color pairs above are calculated source evidence, not a replacement for composited-pixel testing. Keep real copy in the accessibility check.
4. Reduced-motion page entry and a runtime preference change; no trapped pinned space or essential hidden copy. No-WebGL must retain a complete comparable illustration and readable copy.
5. Intro skip/Escape/completion, returning-visitor suppression, repeated mounts without duplicate motion, scrolling reversal and resizing across the 820px motion breakpoint.
6. Workflow guided completion, paused state, manual completion, focus restoration, replay and unified diagram; readable AI/automation/human roles without relying on color alone.
7. Form built-in invalid-field focus, custom telephone error, preview-copy outcome, network failure/timeout, success only for acknowledged receipt, and privacy focus/scroll behavior. Use isolated test endpoints; do not send real enquiries.
8. Production chunk sizes, real scene request timing, font requests/fallback behavior, console errors, failed requests, accessible names and automated accessibility results. Lighthouse is supporting evidence and does not replace manual keyboard and visual checks.

No browser was launched by this reviewer, avoiding a concurrent browser conflict with the parent pass. V1 screenshots or successful TypeScript compilation are not reported as V2 accessibility evidence.
