# Converdive

Opening splash implementation with React, TypeScript, Vite and CSS/SVG/Web
Animations. Only a minimal homepage handoff is included.

Private hosted preview: [Play intro](https://converdive-intro-preview.longgala1.chatgpt.site/?intro=1)
or [pause and scrub](https://converdive-intro-preview.longgala1.chatgpt.site/?intro=review).
Sign in with the owning ChatGPT account if prompted. These HTTPS links work
without running the project locally. The localhost addresses below require a
server running on your own computer.

```sh
npm ci
npm run dev
```

Open `http://localhost:5173/?intro=1` for playback or `?intro=review` for the
animation scrubber. Reduced-motion preferences always bypass the animation.

Build with `npm run build`; serve the production result with `npm run preview`.
The generated `dist/index.html` is also a self-contained visual preview.

See [the implementation and asset notes](docs/opening-splash.md) for timing,
component integration, missing source assets, and verification.

[Downloadable preview and stage screenshots](docs/preview/README.md)
