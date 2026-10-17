---
name: run-eagleswingscomunity
description: Build, run, preview, test, audit and screenshot the Eagle's Wings Community Group website (Astro static site). Use when asked to run, start, build, preview, test, check, audit, lighthouse or screenshot the site, its forms, motion or accessibility.
---

# Run: Eagle's Wings website (Astro 7 + TypeScript)

Static site, no backend. Run everything from the project root (the folder with `package.json`). Node 22.12+.
Content: `src/data/site.ts`. Pages: `src/pages`. Sections: `src/components/sections`. Scripts: `src/scripts/*.ts` (one small module each, entry `main.ts`).
Full setup, deployment and rollback: `README.md` and `docs/PRODUCTION.md`.

## Commands (all verified)
```bash
npm install                 # first time; slow inside OneDrive
npm run dev                 # http://localhost:4321 (runs the image optimiser first)
npm run build               # production build to dist/ (also converts photos to WebP)
npm run preview             # serve dist/
npm run check               # astro check (type-check). Expect: 0 errors, 0 warnings, 0 hints
npm test                    # 42 tests: form logic, dates, torn edge, quality of every built page (build first)
npm run launch-check        # lists placeholders / settings to finish before going public (exits 1 until done)
npm run verify              # check + build + test + npm audit (what CI runs)
```

## Photos
Put your photos in `assets/photos/<name>.jpg` (names in README). They override the stand-ins in `assets/stock/`.
`npm run images` (runs automatically on dev/build) writes `public/img/*.webp` and `src/data/images.generated.json` (both git-ignored).

## Browser testing (agent path)
- Test the PRODUCTION build: `npm run build`, then `npx astro preview --port 4326`. Production pages carry a strict Content-Security-Policy, so a violation shows as a console error.
- Check the browser pane's console, and measure with `javascript_tool` (e.g. `document.documentElement.scrollWidth - innerWidth` should be <= 0).
- **Automated accessibility scan (axe-core):** the production CSP blocks test iframes and injected scripts. Build a throwaway copy without the policy:
  `PUBLIC_NO_CSP=1 npx astro build --outDir dist-test`, copy `node_modules/axe-core/axe.min.js` into `dist-test/`, serve it with `python -m http.server 4330 --directory dist-test`, then load each page in a same-origin iframe, inject `/axe.min.js`, call `axe.run`. Run it fire-and-forget storing results on `window`, and poll: `javascript_tool` times out after 45 s.
- Lighthouse: `npx -y lighthouse@12 <url> --chrome-path="C:/Program Files/Google/Chrome/Application/chrome.exe" --chrome-flags="--headless=new --no-sandbox"` (add `--preset=desktop` for desktop).

## Gotchas
- **Old dev servers keep ports.** Each `npm run dev` takes the next free port (4322, 4323...). Stale servers from before the Astro 7 upgrade show `__SERVER_FORWARD_CONSOLE__ is not defined`. Close old terminals and run one `npm run dev`.
- `prefers-reduced-motion`: continuous and large motion is switched off (slideshows do not autoplay, no parallax). Turn Windows "Animation effects" on to see all motion. The in-app browser reports reduced motion.
- Forms: with no `PUBLIC_FORM_ENDPOINT` they open the visitor's email app. Set it (see `.env.example`) for real delivery.
- `npm test` needs `dist/`. Tests check titles, one h1, canonical URLs, links, alt text, labels, CSP hash, sitemap, no third-party hosts.
- Windows: a long `cat <<'EOF'` after `&&` can make the shell fail; write files with the editor tool or a small script file.
