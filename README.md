# Eagle's Wings Community Group: website

Static website for Eagle's Wings Community Group (Kenya). Built with [Astro](https://astro.build) and TypeScript, deployed to GitHub Pages.
There is no server, database or login: it is HTML, CSS and a little JavaScript, which keeps it fast, cheap and hard to attack.

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321 (reloads as you edit)
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build` | Production build into `dist/` (also converts photos, see below) |
| `npm run preview` | Serve the production build locally |
| `npm run check` | Type-check everything (`astro check`) |
| `npm test` | Unit tests (form logic, torn-paper edge) and quality tests on the built pages (needs a build first) |
| `npm run launch-check` | Lists placeholders and settings that must be finished before going public |
| `npm run verify` | Everything the pipeline runs: check, build, test, dependency audit |

Requires Node 22.12 or newer.

## Where things live

| To change... | Edit |
| --- | --- |
| Words, numbers, phone, email, links | `src/data/site.ts` (one place for all content) |
| Photos | Put files in `assets/photos/` (see below) |
| Colors, fonts, spacing | Variables at the top of `src/styles/global.css` |
| A page | `src/pages/*.astro` (each page assembles sections) |
| A section | `src/components/sections/*.astro` |
| Privacy, Terms, Child Protection, Cookies | `src/pages/privacy.astro`, `terms.astro`, `child-protection.astro`, `cookies.astro` |

```
src/
  components/      Header, Footer, Photo, PageHero, ContactForm and sections/
  data/            site.ts (content), kenya.ts (country outline)
  layouts/         Base.astro (head, security policy, shell), Legal.astro
  lib/             forms.ts (validation), photos.ts, torn.ts, icons.ts, boot.ts
  pages/           one file per page
  scripts/         small modules: nav, reveal, slideshow, lightbox, cookie, forms
  styles/          global.css, sections.css
assets/stock/      stand-in photos (committed)
assets/photos/     YOUR photos (committed)
scripts/           image optimiser, launch checklist
tests/             unit and site-quality tests
public/            fonts, logo, robots.txt, security headers (copied as-is)
```

## Growing the site (team, news, events, reports, partners)

All of this lives in **`src/data/org.ts`**. Add only real information; sections that need content show an honest "coming soon" message or stay hidden until you add something.

| Section | Where it shows | How to add |
| --- | --- | --- |
| **Team** | `/team/` | Add a person: `{ slug: 'amina', name: '...', role: '...', bio: '...' }`. Photo: `assets/photos/team-amina.jpg` (Rev. Benard uses `benard.jpg`). Only with the person's agreement. |
| **Where your gift goes** | `/give/` | Replace the empty `share` values with real figures such as `'60%'`. Placeholders show until you do. |
| **Reports** | `/reports/` | Put the PDF in `public/documents/` and add `{ title, year, file: '/documents/name.pdf', summary }`. |
| **News** | `/news/`, home page teaser | Add a post `{ slug, title, date: '2026-12-01', summary, body: ['paragraph', 'paragraph'] }`, newest first. It gets its own page at `/news/<slug>/`. |
| **Events** | `/events/` | Add `{ title, date: '2026-12-05', time, place, description }`. Past events hide themselves. |
| **Partners** | home and About | Add `{ name, url, logo: '/images/partners/name.png' }` with their written permission. Hidden while empty. |
| **Social links** | footer | Add `{ name: 'Facebook', url: 'https://...' }`. Hidden while empty. |
| **Milestones** | About | Add `{ when: '2027', text: '...' }` to `timeline`. |
| **FAQ** | `/faq/` | Edit `faq`. Keep every answer true; the FAQ also feeds Google's structured data. |
| **Newsletter box** | footer | Create a list with an email service (MailerLite, Mailchimp...), then set `PUBLIC_NEWSLETTER_ENDPOINT` (see `.env.example`). Hidden until set. |

Run `npm run verify` after editing. The tests check that every page has a title, one heading, working links, and that every news or report link points to a real page or file.

## Photos

The site ships with generic stand-in photos. Replace them with your own by adding files to **`assets/photos/`** using these names
(`.jpg`, `.png` or `.webp`):

`kenya-portrait` (girl's portrait inside the map), `martin`, `feeding`, `mentorship`, `medical`, `bg-1` to `bg-8` (background slideshow),
`gallery-1` to `gallery-8`, `cap-1` to `cap-3`, `founder-2`, `founder-3`, `story`, `cta-1`, `cta-2`, `collage-2`, and `page-about`, `page-programs`,
`page-community`, `page-photos`, `page-give`, `page-contact` (header photos).

On every build the images are resized to several widths and converted to WebP, so large phone photos are fine. Only upload photos you own or have
**written permission** to use, and follow the consent rules in the Child Protection Policy for any photo of a child.
Your own photos use their file name as the description; add alt text by editing the component if you need something more specific.

## Contact forms

The forms validate in the browser, include a spam trap, and show loading, success and error states.

* **Without a form service** (current default): when someone presses Send, their email app opens with the message ready. This works but messages can be lost.
* **With a form service** (recommended): create a free form (Formspree, Web3Forms, Getform) and set its address:

  ```bash
  cp .env.example .env        # then set PUBLIC_FORM_ENDPOINT=https://...
  ```

  For the live site, add the same value as a repository **variable** named `PUBLIC_FORM_ENDPOINT` (GitHub: Settings, Secrets and variables, Actions, Variables).
  It is public by design (it is an address, not a secret key). Use the service's own settings for email notifications and spam rules.

Because the site is static, rate limiting and server-side validation must come from the form service. Do not treat the in-browser checks as security.

## Security

* **Content-Security-Policy** on every page: scripts only from this site (one inline script allowed by its hash), no third-party fonts or images, no embedding of this site.
* **No third-party requests** except the OpenStreetMap map on the Contact page and links the visitor clicks.
* Fonts and photos are served from this site.
* Dependencies are audited in CI (`npm audit --omit=dev --audit-level=high` must pass).
* `public/_headers` adds HSTS, `nosniff`, `frame-ancestors 'none'`, a Permissions-Policy and long caching. **GitHub Pages ignores this file**, so the headers only take effect on Netlify or Cloudflare Pages (see below).
* `public/.well-known/security.txt` tells researchers how to report a problem. Renew its `Expires` date every year.
* No secrets are stored in the repository. `.env` is git-ignored.

## Deployment (GitHub Pages)

1. Push to `main`. `.github/workflows/deploy.yml` runs the type-check, build, tests and dependency audit, then publishes `dist/`. A failing check stops the deploy.
2. Repository **Settings, Pages, Source: GitHub Actions**.
3. **Custom domain (read this first).** `public/CNAME` is `www.eagleswingscommunity.org`. Today the domain's DNS and email are at your web host (nameservers `cs11.hpcnoc.com` and `cs12.hpcnoc.com`): the bare domain `eagleswingscommunity.org` points at the host's server (`178.162.234.23`) and the `MX` (email) record points at the bare domain, so **your `info@` email depends on that record. Do not change the bare-domain `A` record, or email stops.** Only the `www` name needs to move:
   * In the host's DNS editor (cPanel, Zone Editor) replace the `www` record (currently a `CNAME` to `eagleswingscommunity.org`) with a `CNAME` named `www` pointing to `<your-github-username>.github.io`.
   * Keep the old site's files somewhere safe first. Once `www` moves, visitors see the new site and the old one goes offline.
   * Add a redirect from the bare domain to `https://www.eagleswingscommunity.org` in the host's control panel (Redirects), so both addresses open the site.
4. Tick **Enforce HTTPS** in Pages settings once the certificate is issued (can take up to an hour after DNS settles).
5. After the first deploy run `npm run launch-check` locally and test the live site (see the checklist in `docs/PRODUCTION.md`).

**Rollback:** every deploy is a commit. To roll back, `git revert <bad-commit>` and push (the pipeline redeploys the previous state in about two minutes), or re-run the workflow of the last good commit from the Actions tab.

**Better headers:** if you want the HTTP security headers to apply, host on Cloudflare Pages or Netlify (both free for a site like this). They read `public/_headers` with no further setup.

## Maintenance

* **Backups:** the Git repository is the backup of everything (code, content, photos). Keep a second copy: download the repository ZIP (or a mirror clone) every few months and store it somewhere other than your computer.
* **Updates:** run `npm outdated` and `npm audit` monthly; update, run `npm run verify`, then push.
* **Monitoring:** add a free uptime monitor (UptimeRobot or Better Stack) on the home page and contact page, and register the site in Google Search Console (submit `https://www.eagleswingscommunity.org/sitemap-index.xml`).
* Step-by-step uptime monitoring and Google Search Console setup: `docs/MONITORING.md`.
* More detail: see `docs/PRODUCTION.md`.
