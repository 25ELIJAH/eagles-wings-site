# Production notes

## Architecture decisions

| Decision | Why |
| --- | --- |
| Static site (Astro), no server, no database, no login | The site's job is to inform and let people get in touch. A static site has almost no attack surface, costs nothing to host and rarely breaks. A CMS, admin area or database would add risk and running cost without a present need. |
| Content in `src/data/site.ts` | One place to edit words and numbers, with type checking. |
| Forms via an external form service | A static site cannot store messages. A form service (Formspree, Web3Forms, Getform) provides storage, email notification and spam filtering. |
| Self-hosted fonts and photos, build-time WebP conversion | Faster pages, no data sent to Google or Unsplash, and no third party can change what loads. |
| Content-Security-Policy as a `<meta>` tag | GitHub Pages cannot send HTTP headers. The tag gives most of the protection. `_headers` adds the rest on Netlify or Cloudflare Pages. |
| Motion respects `prefers-reduced-motion` | Large and continuous movement stops for visitors whose system asks for less motion. |

## Features deliberately not built (they need your decision)

* **Content management / admin login.** Only worth adding if staff will update news or events often. Options: a Git-based CMS such as Decap CMS or TinaCMS (still static, no database), or a hosted CMS. Needs a decision on who edits and how often.
* **Search.** Not worth it below roughly 30 pages. News, events, reports, FAQ, team and partners ARE built and wait for your real content (see the README, "Growing the site").
* **Donation processing.** The site explains how to give but does not take payments. Taking M-Pesa or card payments needs a provider account (Safaricom Daraja/Paybill, Flutterwave, Pesapal, Stripe or PayPal), your legal registration, and a data-protection review. Recommended: collect nothing on the site; use the provider's hosted payment page.
* **Staff directory, volunteer portal, registrations, beneficiary tracking.** These hold personal data and need authentication and a database. Build only against a specific need, with a data protection impact assessment.

## Pre-launch checklist

Run `npm run build && npm run launch-check`. Then:

- [ ] Replace every yellow placeholder (registration numbers, address, child protection lead, team note, gift-use percentages). `launch-check` lists them.
- [ ] Have a Kenyan advocate review the Privacy, Terms, Child Protection and Cookie pages.
- [ ] Decide whether you must register with the Office of the Data Protection Commissioner (odpc.go.ke) and record the number in the Privacy page.
- [ ] Set `PUBLIC_FORM_ENDPOINT`, then send a real test message and confirm it reaches the right inbox.
- [ ] Add your real photographs (see README). Remove any stand-in that is not from your community.
- [ ] Confirm the phone number, WhatsApp link and email address.
- [ ] Set the exact address for the map on the Contact page, if you want a marker.
- [ ] DNS: only the `www` CNAME moves to GitHub Pages. **Leave the bare-domain `A` and `MX` records alone: email depends on them.** HTTPS enforced; the bare domain redirects to `https://www.`; confirm `info@` email still works afterwards.
- [ ] Open every page on a real phone and a real computer, and on slow mobile data.
- [ ] Submit the sitemap in Google Search Console.
- [ ] Renew `public/.well-known/security.txt` (`Expires`) each year.

## Data protection (Kenya, Data Protection Act, 2019)

* The site itself stores no personal data. Messages go to your email or form service, which become your responsibility as data controller.
* Keep messages only as long as needed; delete old enquiries; keep donor records as long as the law requires financial records.
* Use strong, unique passwords and two-factor authentication on the email account, the form service account and GitHub.
* If personal data is ever lost or exposed, the Act expects you to notify the Data Commissioner (and affected people where there is a high risk) within 72 hours. Write down who will do this.
* Do not publish photographs of children without written parental consent (see the Child Protection Policy).

## Monitoring, logging and recovery

Exact setup steps for the uptime monitor and Google Search Console are in `docs/MONITORING.md`. The site provides `/health.txt` and `/sitemap-index.xml` for them.

| Need | Suggested tool (free tiers exist) |
| --- | --- |
| Is the site up? | UptimeRobot or Better Stack: monitor the home page and `/contact/`, alert by email/SMS |
| Do messages arrive? | Send a monthly test message; the form service dashboard shows delivery |
| Search visibility | Google Search Console (coverage, Core Web Vitals) |
| Build or deploy failures | GitHub Actions emails you when a run fails |
| Visitor numbers (optional) | A privacy-friendly counter such as Plausible or Cloudflare Web Analytics. If added, update the Cookie Policy first. |
| Error tracking | Not needed for a static site. Add only if you later add server code. |
| Recovery | Restore = `git clone` the repository (or the ZIP backup) and push. Domain and DNS settings live at your domain provider: write them down and keep a copy. |

## Known limits

* GitHub Pages cannot set HTTP headers, so HSTS, `frame-ancestors` and `X-Frame-Options` are not active there. The CSP meta tag is.
* Rate limiting and server-side validation depend on the form service you choose.
* The CSP allows inline `style` attributes (`style-src 'unsafe-inline'`). The site uses them for animation delays and photo placement. Scripts are locked down.
* Testing was done in one browser engine (Chromium). Test Safari on iPhone before launch.
