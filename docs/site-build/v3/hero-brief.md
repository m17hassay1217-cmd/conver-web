# CONVERDIVE V3 — HERO SECTION 01
## Visual Composition, Typography and Motion Specification

### 1. Reference and objective

Use the attached image **“Neon-Swept View of St. Paul’s at Dusk”** as the exact background.

Preserve its architecture, curved clean-swept opening, frosted glass, condensation, cyan/green/red edge illumination, color grading and atmospheric depth.

Do not regenerate, redesign or replace the image.

Create a premium, visually distinctive hero for **Converdive**, an AI-enabled workflow implementation agency serving UK commercial cleaning contractors.

This task covers the background, headline, supporting text and CTA only.

**Do not create the enquiry-to-booked-jobs vessels or ball animation yet.** Reserve their space and integrate them later.

No navbar, header links, pricing, testimonials, additional cards or decorative UI.

### 2. Layout coordinates

Use **1440 × 900** as the desktop design reference.

All positions should scale responsively rather than remaining fixed pixels.

**Initial state:**

- Main headline horizontally centered.
- Headline center approximately X = 720px, Y = 310px.
- Maximum headline width: 1100px.
- Headline font size: `clamp(46px, 5.2vw, 76px)`.
- Line-height: 1.08.
- Font weight: 600–650.
- Clean contemporary sans-serif with excellent legibility.
- Maximum three lines.

**After subsequent content appears:**

- Headline moves upward approximately 45–65px and slightly reduces in scale.
- Supporting paragraph occupies the region beneath it, centered.
- Paragraph maximum width: 740px.
- Paragraph font size: 18–21px.
- Line-height: 1.5.
- Reserve approximately Y = 450–735px for the future physical ball-transfer installation.
- CTA eventually appears centered around Y = 795px.

Preserve generous spacing and prevent overlap at every viewport size.

The text must remain readable over the architectural image without concealing its defining clean-sweep shape.

### 3. Exact headline

**How well does your enquiry-to-booking process actually work?**

Use off-white as the base text color, approximately `#F2F2EC`.

Do not render the headline as a flat, permanently uniform white block.

Apply restrained warm/cool gradient highlights where the background illumination interacts with it.

### 4. Headline emergence — named effect

**Effect: Optical Clarity Sweep Reveal**

The headline should appear as though a moving cleaning-sweep boundary is bringing it into optical focus.

Sequence:

1. The headline initially exists as a soft, low-definition typographic impression, not a completely invisible object.
2. A broad, gently curved clarity boundary progresses diagonally across its letters.
3. As the boundary passes, affected letter segments transform from diffused, low-contrast forms into sharp, fully readable typography.
4. A subtle illuminated rim accompanies the moving boundary.
5. The motion completes with the entire headline crisp and stable.

Suggested duration: **1000–1350ms**.

Suggested easing: `power2.inOut`.

Implementation technique: **animated SVG mask / clip-path with localized blur reduction and sharp-text reveal**.

Avoid generic slide-in, typewriter animation, bouncing letters, explosive particles or a simple opacity fade.

### 5. Reactive typography — named effect

**Effect: Chromatic Intersection Mask**

Use the luminous curved sweep already present in the background as the source of the color interaction.

As a soft illumination moves **behind the headline**, only the portions of the letters directly overlapping that illuminated region should temporarily change color.

The change must follow the actual intersection between the text geometry and the projected light shape.

Color relationships:

- Off-white text outside the illuminated region.
- Muted jade-green where green light intersects.
- Soft cyan-blue where blue light intersects.
- Restrained warm coral-red where red light intersects.
- Smooth color blending at the boundaries.

The text remains sharp during the interaction.

The luminous area should not cover all letters simultaneously.

It should feel as though the background light is interacting with the typography in the same visual space.

Use **duplicate text layers with a dynamic intersection mask**, preserving accessible real text in the underlying layer.

Avoid permanently rainbow-colored typography, strong neon outlines or exaggerated glow.

### 6. Supporting text

Exact copy:

**We design targeted AI-enabled workflows to reduce unnecessary manual work and help commercial enquiries progress more smoothly.**

Initial color: muted warm-gray/off-white, approximately `#D2D7D3`.

Selected words may receive a very restrained cool/warm gradient treatment, but the supporting paragraph must remain secondary to the headline.

**Emergence effect: Secondary Clarity Transmission**

Reuse a softer version of the headline's optical reveal.

Instead of the text sliding upward:

- A narrow, diffuse light boundary travels horizontally across the paragraph.
- The wording sharpens progressively as the boundary crosses.
- Individual words resolve into clear, readable text.
- The effect is understated and synchronized with the background illumination.

Duration: **550–800ms**.

The headline remains visible and stable while the supporting text emerges.

### 7. CTA

Text:

**Discuss your workflow**

Design:

- Horizontally centered.
- Rounded pill or softly rounded rectangle.
- Approximately 235–255px wide and 52–58px high.
- Warm off-white/stone fill, with a subtle teal undertone.
- Dark charcoal text.
- Small arrow icon on the right.
- Minimal soft shadow and restrained border highlight.

**Emergence effect: Luminous Contour Assembly**

A narrow highlight traces the button's rounded contour before its surface resolves into a complete clickable shape.

The button becomes fully readable as the contour closes.

Duration: **450–650ms**.

**Hover effect: Magnetic Micro-Lift**

- Translate upward approximately 2px.
- Increase border illumination slightly.
- Shift the arrow 3–4px toward the right.
- Duration: 180–240ms.
- Easing: `power2.out`.

No exaggerated scaling, pulsing or persistent glowing animation.

### 8. Hero animation order

Build the sequence using scroll-linked progress ranges, not fixed mouse-wheel counts.

**Beat 01 — Post-splash arrival**

Show the background and reveal the main question.

The question is the only foreground content initially visible.

**Beat 02 — Text stabilization**

Headline settles slightly higher, making room for the supporting paragraph.

The chromatic light interaction passes behind selected headline segments.

**Beat 03 — Supporting statement**

The paragraph resolves through the secondary clarity transmission effect.

**Beat 04 — Reserved installation**

Leave the designated space available for the upcoming enquiry-to-booked-jobs vessel animation.

Do not invent a placeholder graphic or substitute a generic workflow diagram.

**Beat 05 — CTA**

The CTA enters last.

In the final integrated hero, this beat must happen **after the bucket-and-ball animation has progressed**, not before it.

All transitions must support reverse scrolling, fast scrolling and reduced-motion preferences.

### 9. Background behavior

The reference image stays visually intact.

Apply only restrained, separately controllable overlays:

- Very subtle image parallax, approximately 2–4% vertical travel.
- A softly moving, low-opacity light mask aligned to the existing curved sweep.
- Minimal local luminance variation around the typography.
- A gentle darkening scrim beneath the main text only if required for readability.

Do not create additional aurora ribbons, unrelated lights, architectural objects or artificial 3D elements.

The background must remain visually dominant enough to communicate its distinctive cleaned-glass architecture, but not overpower the words.

### 10. Quality requirements

The finished hero should feel:

- Premium and distinctive.
- Clean but visually alive.
- Cinematic without excessive movement.
- Technically precise.
- Readable and conversion-focused.
- Connected to commercial cleaning through the background's clarity-sweep concept.

Keep foreground text as genuine HTML whenever building the actual website.

Use masks, gradients and motion layers for visual effects rather than baking the typography into the background.

Do not add new sections or features.

**Final output target:** A coherent animated hero composition where a realistic clean-swept architectural background interacts with distinctive typography, the supporting message follows naturally, and a polished CTA completes the experience—while preserving the central space for the separately designed enquiry-to-booked-jobs animation.