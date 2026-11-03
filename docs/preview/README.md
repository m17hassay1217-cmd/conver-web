# Opening animation — review snapshot

This is the first functional splash, pending integration of the approved logo's
image file and Cabinet Grotesk Semibold. It currently shows the supplied stencil
wordmark. The homepage is a handoff placeholder only.

Open the private hosted preview directly:

- [Play the intro](https://converdive-intro-preview.longgala1.chatgpt.site/?intro=1)
- [Pause and scrub between stages](https://converdive-intro-preview.longgala1.chatgpt.site/?intro=review)

Sign in with the owning ChatGPT account if prompted. No local setup is needed.
The localhost URLs below are alternatives for a server on your own computer;
they cannot connect to the Codex cloud workspace.

Download **[converdive-intro.html](converdive-intro.html)** using GitHub's
“Download raw file” button. All JavaScript, CSS and fonts are embedded.
For representative browser storage behavior, serve this folder:

```sh
python3 -m http.server 4173 --directory docs/preview
```

- Playback: `http://localhost:4173/converdive-intro.html?intro=1`
- Scrub and review: `http://localhost:4173/converdive-intro.html?intro=review`

For source development, use `npm run dev` and `http://localhost:5173/?intro=review`.
The same snapshot is available at the private hosted URL above.
The cloud browser's administrator policy blocks `file://` URLs; the production
HTTP preview is the version validated in Chromium.

The following requested screenshots are retained as review deliverables, with
the scrubber hidden. These are deliberate snapshots, not browser cache output.

| Reading hold | Magnetic attraction |
| --- | --- |
| ![Seven outcomes around the Converdive wordmark](01-outcomes-desktop.jpg) | ![Nearest phrases absorbing into the identity](02-attraction-desktop.jpg) |

| Energy transfer | Positioning |
| --- | --- |
| ![Controlled colored transfer](03-energy-desktop.jpg) | ![For UK Commercial Cleaning Companies](04-positioning-desktop.jpg) |

| Upward handoff | Permanent header after playback |
| --- | --- |
| ![Splash sliding upward](05-handoff-desktop.jpg) | ![Minimal homepage handoff and header](08-homepage-handoff.jpg) |

| Mobile reading hold | Mobile positioning |
| --- | --- |
| ![Seven phrases on mobile](06-outcomes-mobile.jpg) | ![Positioning statement on mobile](07-positioning-mobile.jpg) |

[Browser check results](checks.json) · [Implementation and asset inventory](../opening-splash.md)

Hosting identity for future updates: `appgprj_6ae9246de40481918121f5e6f21b7ab6`.
Sites source commit: `8c811d7b5f603283bae4ad1a33c944d91add97e6`.
The private Site serves the standalone HTML snapshot; implementation source
remains in `conver-web`. Reuse this project ID when updating the hosted preview.
