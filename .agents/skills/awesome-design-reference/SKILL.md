---
name: awesome-design-reference
description: >-
  Search and synthesize a bundled library of 84 DESIGN.md analyses when choosing
  a visual direction, comparing design systems, creating a project DESIGN.md,
  or refining a website or product interface. Use references as evidence and
  inspiration while preserving the user's brand, content, assets, accessibility,
  and existing product decisions.
license: MIT
metadata:
  source: VoltAgent/awesome-design-md
  source-revision: 3b605329240ce735b510037cca322f1831fdd7f8
  version: "1.0.0"
---

# Awesome Design Reference

This skill turns a curated collection of public-site design analyses into a
research workflow. It does not authorize copying another company's identity.
Use the library to understand patterns, then make a design system that belongs
to the user's product.

## When to use it

Use this skill when the user asks to:

- choose or compare visual directions;
- make a site feel like a named reference;
- research patterns for a sector, tone, or interface type;
- create, revise, or audit a `DESIGN.md`;
- extract design tokens or implementation rules from comparable systems;
- refine a page or application while preserving an existing brand.

Do not use it for backend-only work, copywriting, data analysis, or tasks where
the user already supplied an authoritative design specification and does not
ask for reference research.

## Source of truth

The user's brief, existing implementation, approved assets, and project-local
design documents outrank this library. The bundled documents are analyses of
public websites. They may contain proprietary font names, brand colors, and
signature motifs that are unsuitable for another project.

Read [references/CATALOG.md](references/CATALOG.md) only when you need the
original categorized collection overview. The individual references live at
`references/design-md/<name>/DESIGN.md`.

## Workflow

### 1. Establish the project's truth

Inspect the existing code, assets, fonts, tokens, `DESIGN.md`, and relevant
screens before searching. Write down the fixed constraints: product, audience,
surface type, content, brand assets, accessibility needs, and available media.

If the project already has a design language, treat the task as refinement
unless the user explicitly requested a redesign.

### 2. Search by design qualities

Search with three to eight concrete qualities, such as surface, density,
typography, interaction, and mood:

```bash
python3 <skill>/scripts/search.py "dark cinematic editorial restrained motion" --top 6
python3 <skill>/scripts/search.py "dense technical dashboard green accent" --top 5
python3 <skill>/scripts/search.py --list
```

Search for a brand name only when the user named that reference or you need to
inspect its exact analysis. Do not pick a reference solely because its category
matches the user's category.

### 3. Read a small comparison set completely

Choose two or three candidates with meaningfully different strengths. Read each
selected `DESIGN.md` completely. Do not combine snippets from many references
without understanding their full systems.

Use the helper to locate a reference:

```bash
python3 <skill>/scripts/show.py linear.app --path
python3 <skill>/scripts/show.py apple --summary
```

Compare them on:

| Dimension | What to extract |
| --- | --- |
| Atmosphere | Emotional effect and density |
| Composition | Grid, hierarchy, whitespace, image role |
| Typography | Scale relationships and rhythm, not proprietary font copying |
| Color | Proportions and semantic roles, not another brand's exact palette |
| Components | Shape language, states, grouping, and affordances |
| Motion | Purpose, timing character, and continuity |
| Responsive | What changes structurally on narrow screens |
| Guardrails | Repeated do/don't rules and failure modes |

For every observation, distinguish a **portable principle** from a
**brand-specific signature**. Only portable principles may enter the synthesis
by default.

### 4. Synthesize for the user's product

Create one coherent direction. Do not average references into a collage.
State the idea in one sentence:

> For this product, **[product-specific material or behavior]** becomes
> **[the main compositional device]**.

Map existing brand values onto semantic roles. Use only fonts and assets the
project can legally and technically ship. When a proprietary typeface is named
in a reference, preserve its typographic function with an approved project font
instead of claiming or silently substituting the font itself.

When writing a project `DESIGN.md`, include:

1. design intent and product-specific idea;
2. semantic color tokens and contrast requirements;
3. typography roles and available font files;
4. spacing, grid, and responsive rules;
5. component anatomy and interaction states;
6. imagery and illustration rules;
7. motion principles and reduced-motion behavior;
8. accessibility requirements;
9. do/don't guardrails;
10. provenance: references consulted and principles borrowed.

Do not paste an entire bundled `DESIGN.md` into a project unless the user
explicitly requests that exact licensed reference as a starting point. Even
then, label it as a reference-derived draft and reconcile it with the user's
brand and content before implementation.

### 5. Implement and verify

Apply the synthesized system to the requested surface. Render it in a browser
at representative desktop and mobile sizes. Verify hierarchy, text wrapping,
contrast, focus, overflow, touch targets, states, and reduced motion. Compare
the result against the project-specific direction, not against superficial
similarity to the source brands.

## Guardrails

- Never present another company's identity as the user's original brand.
- Never copy logos, trademarks, proprietary assets, product screenshots, or
  distinctive copy from the references.
- Do not reproduce exact palettes, typefaces, and signature compositions as a
  bundle unless the user explicitly asks for a faithful study and has the right
  to use those assets.
- Do not invent access to proprietary fonts. Report missing assets.
- Preserve factual content, accessibility, and familiar interaction behavior.
- Cite the consulted reference names in the handoff and explain the portable
  principle taken from each.

## Handoff

Report:

- the references consulted;
- the portable principle taken from each;
- what was deliberately excluded as brand-specific;
- the resulting project-specific direction;
- what was implemented or written;
- browser checks performed and remaining limitations.

The bundled source is MIT licensed. Preserve [LICENSE](LICENSE) when copying or
redistributing substantial portions of this skill.
