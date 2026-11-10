# Converdive

React, TypeScript and Vite website for UK commercial cleaning contractors. The current entry point is `src/site/Website.tsx`; older experiments are retained separately.

```sh
npm install
npm run dev -- --host 0.0.0.0
npm run build
```

Use `?intro=review` to replay the introduction and `?intro=skip` to open the website directly. Desktop 3D starts automatically; small screens provide a playback control.

See [setup and architecture](docs/site-build/README.md), [V2 verification and integration status](docs/site-build/v2/VERIFICATION.md), and [actual resources used](docs/site-build/v2/RESOURCE-AUDIT.md). The four V2 skill bundles are installed in `.agents/skills`. Contact delivery and booking are not configured; copy `.env.example` when connecting real services. Never place secrets in public Vite variables.
