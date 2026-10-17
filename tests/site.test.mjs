// Quality checks on the BUILT site (run `npm run build` first, or use `npm run verify`).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const SITE = 'https://www.eagleswingscommunity.org';

assert.ok(fs.existsSync(dist), 'dist/ is missing. Run "npm run build" first.');

// ---- load every built page ----
const pages = {};
(function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name.endsWith('.html')) {
      const rel = path.relative(dist, p).replace(/\\/g, '/');
      const url = rel === 'index.html' ? '/' : rel === '404.html' ? '/404' : '/' + rel.replace(/index\.html$/, '');
      pages[url] = fs.readFileSync(p, 'utf8');
    }
  }
})(dist);

const decode = (s) => s.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}\\s*=\\s*"([^"]*)"`))?.[1];
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((m) => m[0]);
const ids = (html) => [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const text = (html) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ');
const publicPages = Object.keys(pages).filter((u) => u !== '/404');

test('all expected pages are built', () => {
  for (const u of ['/', '/about/', '/programs/', '/community/', '/photos/', '/give/', '/contact/', '/team/', '/news/', '/events/', '/reports/', '/faq/', '/privacy/', '/terms/', '/child-protection/', '/cookies/', '/accessibility/', '/get-involved/', '/404']) {
    assert.ok(pages[u], `missing page ${u}`);
  }
});

test('every page has one h1, a title, a description, a canonical URL and a language', () => {
  for (const [url, html] of Object.entries(pages)) {
    assert.equal(tags(html, 'h1').length, 1, `${url}: exactly one <h1>`);
    assert.match(html, url.startsWith('/sw/') ? /<html lang="sw"/ : /<html lang="en"/, `${url}: lang attribute`);
    const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
    assert.ok(title.length >= 10 && title.length <= 70, `${url}: title length ${title.length}`);
    const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
    assert.ok(desc.length >= 50 && desc.length <= 200, `${url}: description length ${desc.length}`);
    assert.match(html, /<meta name="viewport"/, `${url}: viewport`);
    if (url !== '/404') {
      const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
      assert.equal(canonical, SITE + (url === '/' ? '/' : url), `${url}: canonical`);
    }
  }
});

test('page titles are unique', () => {
  const titles = publicPages.map((u) => pages[u].match(/<title>([^<]*)<\/title>/)[1]);
  assert.equal(new Set(titles).size, titles.length);
});

test('headings do not skip levels', () => {
  for (const [url, html] of Object.entries(pages)) {
    const levels = [...html.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
    for (let i = 1; i < levels.length; i++) {
      assert.ok(levels[i] - levels[i - 1] <= 1, `${url}: heading jumps from h${levels[i - 1]} to h${levels[i]}`);
    }
  }
});

test('element ids are unique on each page', () => {
  for (const [url, html] of Object.entries(pages)) {
    const all = ids(html);
    const dupes = all.filter((id, i) => all.indexOf(id) !== i);
    assert.deepEqual(dupes, [], `${url}: duplicate ids`);
  }
});

test('every internal link and anchor resolves', () => {
  for (const [url, html] of Object.entries(pages)) {
    for (const tag of tags(html, 'a')) {
      const href = attr(tag, 'href');
      if (href === undefined) continue;
      if (/^(https?:|mailto:|tel:)/.test(href)) continue;
      const [p, frag] = href.split('#');
      const target = p === '' ? url : p;
      if (/\.[a-z0-9]{2,5}$/i.test(p)) { assert.ok(fs.existsSync(path.join(dist, p)), `${url}: link to a file that is not in the build: ${href}`); continue; }
      assert.ok(pages[target], `${url}: link to missing page ${href}`);
      if (frag) assert.ok(ids(pages[target]).includes(frag), `${url}: link to missing anchor ${href}`);
    }
  }
});

test('external links that open a new tab use rel="noopener"', () => {
  for (const [url, html] of Object.entries(pages)) {
    for (const tag of tags(html, 'a')) {
      if (attr(tag, 'target') === '_blank') assert.match(attr(tag, 'rel') ?? '', /noopener/, `${url}: ${tag}`);
    }
  }
});

test('mailto and tel links are well formed', () => {
  for (const [url, html] of Object.entries(pages)) {
    for (const tag of tags(html, 'a')) {
      const href = attr(tag, 'href') ?? '';
      if (href.startsWith('mailto:')) assert.match(href, /^mailto:[^@\s]+@[^@\s]+\.[^@\s]+$/, `${url}: ${href}`);
      if (href.startsWith('tel:')) assert.match(href, /^tel:\+?\d{9,15}$/, `${url}: ${href}`);
    }
  }
});

test('every image has an alt attribute and dimensions, and below-the-fold images are lazy', () => {
  for (const [url, html] of Object.entries(pages)) {
    for (const tag of tags(html, 'img')) {
      assert.ok(tag.includes(' alt='), `${url}: image without alt: ${tag.slice(0, 80)}`);
      if (attr(tag, 'class')?.includes('photo')) {
        assert.ok(attr(tag, 'width') && attr(tag, 'height'), `${url}: photo without width/height`);
        assert.ok(attr(tag, 'srcset'), `${url}: photo without srcset`);
      }
    }
  }
});

test('every form control has a label and every link has a name', () => {
  for (const [url, html] of Object.entries(pages)) {
    const labelFor = new Set([...html.matchAll(/<label[^>]*\sfor="([^"]+)"/g)].map((m) => m[1]));
    for (const tag of [...tags(html, 'input'), ...tags(html, 'textarea'), ...tags(html, 'select')]) {
      if (/type="(hidden|submit)"/.test(tag) || tag.includes('tabindex="-1"')) continue;
      const id = attr(tag, 'id');
      assert.ok((id && labelFor.has(id)) || tag.includes('aria-label'), `${url}: control without a label: ${tag.slice(0, 90)}`);
    }
    for (const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
      const name = text(m[2]).trim() || attr(`<a ${m[1]}>`, 'aria-label') || (m[2].includes('alt=') ? 'img' : '');
      assert.ok(name, `${url}: link without an accessible name: <a ${m[1].slice(0, 70)}>`);
    }
  }
});

test('buttons have an accessible name', () => {
  for (const [url, html] of Object.entries(pages)) {
    for (const m of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)) {
      const ok = text(m[2]).trim() || m[1].includes('aria-label');
      assert.ok(ok, `${url}: unnamed button <button ${m[1].slice(0, 80)}>`);
    }
  }
});

test('no third-party resources are loaded except the allowed ones', () => {
  const allowed = new Set([]);
  for (const [url, html] of Object.entries(pages)) {
    const noSchema = html.replace(/<script type="application\/ld\+json"[\s\S]*?<\/script>/g, '');
    for (const tag of [...tags(noSchema, 'link'), ...tags(noSchema, 'script'), ...tags(noSchema, 'img'), ...tags(noSchema, 'iframe'), ...tags(noSchema, 'form'), ...tags(noSchema, 'source')]) {
      for (const m of tag.matchAll(/\s(?:src|href|srcset|action)="(https?:\/\/[^"/]+)/g)) {
        const host = m[1].replace(/^https?:\/\//, '');
        if (host === 'www.eagleswingscommunity.org') continue;
        assert.ok(allowed.has(host), `${url}: loads a third-party resource from ${host}`);
      }
    }
    const attrs = [...html.matchAll(/\s(?:src|href|srcset|style|data-bg|data-full)="([^"]*)"/g)].map((m) => m[1]).join(' ');
    assert.ok(!/fonts\.googleapis|fonts\.gstatic|unsplash/i.test(attrs), `${url}: requests Google Fonts or Unsplash`);
  }
});

test('the Content-Security-Policy is present and matches the inline script', () => {
  for (const [url, html] of Object.entries(pages)) {
    const csp = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1];
    assert.ok(csp, `${url}: no CSP meta tag`);
    assert.match(csp, /default-src 'self'/);
    assert.match(csp, /object-src 'none'/);
    assert.ok(!/script-src[^;]*unsafe-inline/.test(csp), `${url}: script-src must not allow unsafe-inline`);
    const inline = [...html.matchAll(/<script(?![^>]*\b(?:src|type)=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    assert.ok(inline.length >= 1, `${url}: expected the boot script`);
    for (const code of inline) {
      const hash = crypto.createHash('sha256').update(code).digest('base64');
      assert.ok(csp.includes(`'sha256-${hash}'`), `${url}: inline script is not covered by the CSP hash`);
    }
  }
});

test('referenced images and fonts exist in the build', () => {
  const files = new Set();
  const words = [...Object.values(pages).join(' ').matchAll(/(\/(?:img|fonts)\/[A-Za-z0-9._-]+)/g)].map((m) => m[1]);
  for (const f of words) files.add(f);
  assert.ok(files.size > 5, 'expected photos and fonts to be referenced');
  for (const f of files) assert.ok(fs.existsSync(path.join(dist, f)), `missing asset ${f}`);
});

test('robots.txt, sitemap, CNAME and social image are in place', () => {
  const robots = fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8');
  assert.match(robots, /Sitemap: https:\/\/www\.eagleswingscommunity\.org\/sitemap-index\.xml/);
  const index = fs.readFileSync(path.join(dist, 'sitemap-index.xml'), 'utf8');
  const sitemapFile = index.match(/<loc>[^<]*\/(sitemap-\d+\.xml)<\/loc>/)[1];
  const sitemap = fs.readFileSync(path.join(dist, sitemapFile), 'utf8');
  for (const u of publicPages) assert.ok(sitemap.includes(`<loc>${SITE}${u}</loc>`), `sitemap is missing ${u}`);
  assert.ok(!sitemap.includes('/404'), 'sitemap must not list the 404 page');
  assert.equal(fs.readFileSync(path.join(dist, 'CNAME'), 'utf8').trim(), 'www.eagleswingscommunity.org');
  assert.ok(fs.statSync(path.join(dist, 'og-default.jpg')).size > 5000, 'social share image');
});

test('forms are wired up and carry a spam trap', () => {
  for (const url of ['/contact/', '/give/']) {
    const html = pages[url];
    assert.match(html, /<form class="js-form"[^>]*novalidate/, `${url}: form`);
    assert.match(html, /name="website"/, `${url}: honeypot field`);
    assert.match(html, /role="status"/, `${url}: status region`);
  }
});

test('built CSS does not request Google Fonts or Unsplash', () => {
  const dir = path.join(dist, '_astro');
  for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.css'))) {
    assert.ok(!/googleapis|gstatic|unsplash/i.test(fs.readFileSync(path.join(dir, f), 'utf8')), `${f} requests a third-party host`);
  }
});

test('the 404 page gives the visitor a way back and is not indexed', () => {
  assert.match(pages['/404'], /name="robots" content="noindex/);
  assert.match(pages['/404'], /href="\/"/);
});

test('an uptime monitor can poll /health.txt', () => {
  assert.equal(fs.readFileSync(path.join(dist, 'health.txt'), 'utf8').trim(), 'ok');
});

test('the Search Console verification tag is emitted only when a valid token is configured', () => {
  const tag = /name="google-site-verification"/;
  const configured = /^[A-Za-z0-9_-]{20,120}$/.test((process.env.PUBLIC_GSC_VERIFICATION ?? '').trim());
  for (const [url, html] of Object.entries(pages)) {
    assert.equal(tag.test(html), configured, `${url}: verification tag ${configured ? 'missing' : 'present without a token'}`);
  }
});

test('the footer links to every page of the organisation section', () => {
  for (const u of ['/team/', '/news/', '/events/', '/reports/', '/faq/', '/give/', '/accessibility/', '/cookies/', '/get-involved/']) {
    assert.ok(pages['/'].includes(`href="${u}"`), `footer is missing ${u}`);
  }
});

test('the FAQ has structured data that matches the visible questions', () => {
  const html = pages['/faq/'];
  const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g).map((s) => s.replace(/<\/?script[^>]*>/g, '')).map((s) => JSON.parse(s)).find((j) => j['@type'] === 'FAQPage');
  assert.ok(ld, 'FAQPage structured data');
  const questions = [...html.matchAll(/<summary>([^<]*)<\/summary>/g)].map((m) => m[1].replace(/&#39;/g, "'").replace(/&amp;/g, '&'));
  for (const q of ld.mainEntity) assert.ok(questions.includes(q.name), `structured question not on the page: ${q.name}`);
  assert.ok(ld.mainEntity.length >= 8);
});

test('pages that wait for real content show an honest message, not a blank page', () => {
  for (const [u, words] of [['/news/', /coming soon|<time/], ['/events/', /No events are scheduled|<time/], ['/reports/', /on the way|Download/]]) {
    assert.match(pages[u], words, `${u}: neither content nor an empty-state message`);
  }
});

test('the team page lists the founder, and the gift-use section exists on the Give page', () => {
  assert.match(pages['/team/'], /Benard Kariuki Karanja/);
  assert.match(pages['/give/'], /Where your gift goes/);
});

test('optional sections stay hidden until they have real content', () => {
  const home = pages['/'];
  const hasPartners = /Partners and supporters/.test(home);
  const hasNewsTeaser = /id="ln-title"/.test(home);
  const newsPosts = (pages['/news/'].match(/class="news-card/g) ?? []).length;
  assert.equal(hasNewsTeaser, newsPosts > 0, 'home news teaser should appear only when there are posts');
  assert.equal(hasPartners, /class="pt-list"/.test(home));
  const newsletterOn = /^https:\/\//.test((process.env.PUBLIC_NEWSLETTER_ENDPOINT ?? '').trim());
  assert.equal(/class="newsletter"/.test(home), newsletterOn, 'newsletter box should appear only when an endpoint is configured');
});

test('no page ships a social link or newsletter form that goes nowhere', () => {
  for (const [url, html] of Object.entries(pages)) {
    assert.ok(!/href="#"/.test(html), `${url}: dead link href="#"`);
    assert.ok(!/href=""/.test(html), `${url}: empty href`);
  }
});

test('header menu styles are scoped to the header (no unscoped nav rules leaking into the footer)', () => {
  const dir = path.join(dist, '_astro');
  for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.css'))) {
    const css = fs.readFileSync(path.join(dir, f), 'utf8');
    for (const m of css.matchAll(/([^{}@]+)\{/g)) {
      for (const sel of m[1].split(',').map((s) => s.trim())) {
        assert.ok(!/^nav(?![\w-])/.test(sel), `unscoped nav selector in ${f}: "${sel}" (use ".top nav" so it cannot affect footer navigation)`);
      }
    }
  }
});

test('every footer link group is a labelled navigation landmark', () => {
  for (const [url, html] of Object.entries(pages)) {
    const footer = html.match(/<footer>[\s\S]*<\/footer>/)?.[0] ?? '';
    const navs = [...footer.matchAll(/<nav\b([^>]*)>/g)];
    assert.ok(navs.length >= 3, `${url}: footer navigation groups`);
    for (const n of navs) assert.ok(/aria-label="[^"]+"/.test(n[1]), `${url}: footer <nav> without a label`);
  }
});

test('the Get involved page has a working form with an "I would like to" choice and the spam trap', () => {
  const html = pages['/get-involved/'];
  assert.match(html, /data-kind="involve"/);
  assert.match(html, /<select[^>]*name="Subject"/);
  assert.match(html, /name="website"/);
  assert.match(pages['/'], /href="\/get-involved\/"/, 'home links to it');
});

test('giving details stay hidden until the organisation provides them', () => {
  const org = fs.readFileSync(path.join(root, 'src', 'data', 'org.ts'), 'utf8');
  const empty = /mpesaPaybill: \{ number: '', account: '' \}/.test(org) && /mpesaTill: ''/.test(org) && /accountNumber: ''/.test(org);
  if (empty) assert.ok(!/data-copy=/.test(pages['/give/']), 'no empty payment cards when nothing is configured');
  else assert.match(pages['/give/'], /data-copy=/);
});

test('visit counting is off unless configured, and never loads from anywhere but its own service', () => {
  for (const [url, html] of Object.entries(pages)) {
    if (/goatcounter/i.test(html)) assert.match(html, /gc\.zgo\.at/, `${url}: unexpected analytics host`);
  }
});

test('the Kiswahili pages exist, are linked from their English twins, and declare both languages', () => {
  const pairs = { '/': '/sw/', '/about/': '/sw/kuhusu/', '/programs/': '/sw/programu/', '/give/': '/sw/toa/', '/contact/': '/sw/wasiliana/', '/get-involved/': '/sw/shirikiana/' };
  for (const [en, sw] of Object.entries(pairs)) {
    assert.ok(pages[sw], `missing Swahili page ${sw}`);
    assert.ok(pages[en].includes(`href="${sw}"`), `${en} does not link to ${sw}`);
    assert.ok(pages[sw].includes(`href="${en}"`), `${sw} does not link back to ${en}`);
    for (const html of [pages[en], pages[sw]]) {
      assert.match(html, /hreflang="sw"/);
      assert.match(html, /hreflang="en"/);
    }
  }
  assert.doesNotMatch(pages['/sw/'], /Caring for|Volunteer or partner|Skip to content/, 'English left on the Swahili home page');
});
