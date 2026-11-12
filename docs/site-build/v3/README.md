# V3 hero — awaiting original background file

The supplied inline chat reference is visually available to the agent, but no image file or downloadable attachment handle is available in this workspace. Do not regenerate it or use a substitute. The V2 published site remains unchanged until the original image can be integrated and visually verified.

Prepared `src/site/HeroV3.tsx` and `hero-v3.css`. The isolated review entry is `?hero=v3`; the existing website remains the default entry. This route contains no navbar, vessels, ball simulation or additional sections. The CTA links to the existing contact route rather than an empty anchor.

Place the exact original image at `public/brand/neon-swept-st-pauls.png`, or pass its actual URL through the `backgroundUrl` prop. Do not change its architecture or grading. The expected file is intentionally absent rather than filled with a placeholder. The route is not ready for publication while this file is missing.

Motion Design skill guidance was read and applied: premium motion without overshoot, question-first staging, restrained secondary illumination, reversible choreography and reduced motion. The user's specific effects take precedence over generic entrance patterns. SVG curved clipping boundaries progressively replace diffuse text with crisp real HTML copies; a clipped, moving chromatic intersection colors only affected glyph regions. Supporting text resolves separately. The CTA contour traces before the surface resolves; hover lifts2px and moves the SVG arrow4px in220ms. No new animation dependency was introduced.

The timeline is scroll-linked across240svh on desktop and205svh on phones, with0.65 smoothing. Progress0–0.22 reveals the question;0.22–0.36 settles it upward6vh;0.36–0.54 resolves the statement;0.54–0.82 reserves installation space;0.82–1 assembles the CTA. The future installation must connect to this reserved interval before the CTA is integrated into its final sequence. Reduced motion presents the completed composition without sticky scroll distance.

Typography uses the already installed Space Grotesk600 font asset under a V3-only family name, keeping V2 font matching unchanged. The headline is constrained to three lines, keeping enquiry-to-booking together. Phone sizing is reduced to fit rather than allowing overflow. Desktop centering is based on the supplied1440×900 coordinates. Image positioning, tonal contrast and light alignment require final inspection with the actual asset.

Build/typecheck passed. `tests/site-hero-v3.mjs` verified50 layout and motion checks at1440×900,768×1024 and375×812: reversal, text separation, maximum line count, no horizontal overflow, CTA visibility, absence of navigation/3D and reduced motion. See `layout-qa.json`. These checks do **not** establish background fidelity, final contrast or aesthetic approval. Local diagnostic screenshots are explicitly labelled “layout-only-no-background” and are not final preview images.
