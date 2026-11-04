---
name: liquid-logo
description: >-
  Evaluate and plan liquid-metal logo treatments using paper-design/liquid-logo
  as a visual and product reference. Use when a user explicitly wants a
  shader-based liquid logo, needs help preparing a compatible mark, or wants to
  assess a Paper Design workflow. Treat the upstream application as
  reference-only because it uses the PolyForm Shield License.
license: PolyForm-Shield-1.0.0
metadata:
  source: paper-design/liquid-logo
  source-revision: 689bb38a1e0d5a6a8baf2d34847635eefde19994
  version: "1.0.0"
---

# Liquid Logo

This is a reference skill for the upstream liquid-logo application. It is not a
general-purpose package and its source is covered by the PolyForm Shield License.
Read `LICENSE` before any reuse. Do not copy or adapt the application source into
a client project merely because this skill is installed.

## Workflow

1. Confirm that a liquid-metal treatment fits the brand and that the supplied
   logo asset is approved, high-resolution, and suitable for the effect.
2. Prefer the hosted tool linked in `references/UPSTREAM-README.md` for asset
   exploration and export when its terms and output satisfy the project.
3. If live rendering is required, evaluate a separately published and licensed
   shader package on its own terms. Do not assume the application repository's
   license transfers to a dependency or generated asset.
4. Keep the original flat logo available for accessibility, reduced motion,
   loading failure, small sizes, and contexts where the effect harms legibility.
5. Limit distortion so the mark remains recognizable. Test on dark and light
   backgrounds, desktop and mobile, and throughout the complete motion cycle.
6. Document the tool, package, license, and exported assets actually used in the
   implementation handoff.

## Restrictions

- Do not vendor, copy, or modify upstream application source without confirming
  that the intended use complies with the included PolyForm Shield License.
- Do not upload a third party mark to an external tool without authorization.
- Do not replace the approved identity with a generated or reinterpreted logo.

## Bundled material

- `references/UPSTREAM-README.md`: upstream project description and hosted tool.
- `LICENSE`: upstream PolyForm Shield License 1.0.0.
- `NOTICE.md`: provenance and reference-only boundary.
