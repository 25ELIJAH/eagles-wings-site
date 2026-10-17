# Uptime monitoring and Google Search Console

Do this **after** the site is live on `https://www.eagleswingscommunity.org` (DNS and HTTPS working).
Both services below are free for a site this size. Each needs an account that only you can create, so these are your steps.
Screen labels change from time to time; if a button is named differently, look for the closest match.

What the site already provides:

* `https://www.eagleswingscommunity.org/health.txt` returns the single word `ok` (a tiny, fast page for monitors).
* `https://www.eagleswingscommunity.org/sitemap-index.xml` lists every page, and `robots.txt` points to it.
* An optional verification tag for Search Console (`PUBLIC_GSC_VERIFICATION`), if you prefer not to use DNS.

## 1. Uptime monitor (UptimeRobot, free plan)

Use an email address that you check daily, and turn on two-factor authentication.

1. Sign up at uptimerobot.com and confirm your email.
2. **Add new monitor**, then create these three:

   | Monitor | Type | URL / settings |
   | --- | --- | --- |
   | Website (is the page really working?) | **Keyword** | URL `https://www.eagleswingscommunity.org/`, keyword `Eagle's Wings`, alert when keyword **does not exist** |
   | Contact page | HTTP(s) | `https://www.eagleswingscommunity.org/contact/` |
   | Quick check | HTTP(s) | `https://www.eagleswingscommunity.org/health.txt` |

3. Check interval: 5 minutes (the free plan's minimum).
4. **Alert contacts:** add your email, and a second person's email or phone if you can, so one missed message does not mean a missed outage.
5. Turn on **SSL / domain expiry** reminders if offered, so an expiring certificate or domain never surprises you.
6. Test it once: temporarily pause the site's DNS record or point a monitor at a wrong address and confirm you receive an alert, then fix it.

Better Stack (betterstack.com) is an equally good free alternative.

## 2. Google Search Console

1. Go to search.google.com/search-console and sign in with a Google account that you control long term (an organisation account, not one person's private one, if possible).
2. **Add property**, then choose **Domain** and enter `eagleswingscommunity.org`. This covers `www`, the bare domain and both http and https.
3. Google shows a **TXT record**. Add it where your DNS is managed. For this domain that is your **web host's control panel** (the nameservers are `cs11.hpcnoc.com` and `cs12.hpcnoc.com`), usually under **Zone Editor** in cPanel. Add a *new* `TXT` record (name = the bare domain, value exactly as Google shows, starting `google-site-verification=`). Do **not** edit or delete the existing `v=spf1` TXT record: it keeps your email working. Wait a few minutes, then press **Verify**. DNS changes can take up to a day.

   *Alternative if you cannot edit DNS:* add a **URL prefix** property for `https://www.eagleswingscommunity.org/`, choose the **HTML tag** method, copy only the `content="..."` value, set it as the repository variable `PUBLIC_GSC_VERIFICATION` (GitHub: Settings, Secrets and variables, Actions, Variables), push so the site rebuilds, then press **Verify**.
4. Open **Sitemaps** and submit `sitemap-index.xml`. The status should become **Success**, with 11 pages discovered.
5. Open **URL inspection**, paste the home page address and press **Request indexing**. Do the same for `/give/` and `/contact/`.
6. Add a second owner or full user (another trusted person) under **Settings, Users and permissions** so you are never locked out.

Do not expect instant results. Pages usually appear in Google within days to weeks, and Google decides rankings. Nothing here can guarantee a position.

## 3. Optional: Bing

In Bing Webmaster Tools choose **Import from Google Search Console**. It re-uses your verification.

## 4. What to check, and when

| When | What | Where |
| --- | --- | --- |
| Every alert | Is the site really down? Open it on mobile data | Your phone |
| Weekly for the first month, then monthly | Pages indexed, search queries, any errors | Search Console: Pages, Performance |
| Monthly | Send yourself a test message from the contact form and confirm it arrives | The site and your inbox |
| Monthly | Core Web Vitals report | Search Console: Experience |
| Monthly | `npm audit`, `npm outdated` | Project folder |
| Every year | Renew `public/.well-known/security.txt` (`Expires`), the domain and your policies | Repository |

## 5. If the site goes down

1. Check GitHub: **Actions** tab. A red run on `main` means a bad deploy. Roll back with `git revert <commit>` and push (see the README).
2. If the last deploy was fine, check **Settings, Pages** (is the custom domain still set, is HTTPS still enforced?).
3. Check DNS at your domain provider (the `www` CNAME must still point to `<your-github-username>.github.io`) and that the domain has not expired.
4. Check githubstatus.com for a GitHub outage.
5. Write down what happened and what fixed it, so the next person can fix it faster.

## 6. Privacy note

Uptime monitors and Search Console do not add anything to the site, so the Cookie and Privacy policies do not change. If you later add visitor analytics, update the Cookie Policy first and ask for consent where the law requires it.
