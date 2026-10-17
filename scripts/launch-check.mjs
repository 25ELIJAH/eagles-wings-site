// Pre-launch checklist: finds placeholders and missing configuration that must be resolved before going public.
// Run after a build:   npm run build && npm run launch-check
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(import.meta.dirname, '..', 'dist');
const root = path.resolve(import.meta.dirname, '..');
if (!fs.existsSync(dist)) { console.error('dist/ not found. Run "npm run build" first.'); process.exit(2); }

const found = {};
const problems = [];
const warnings = [];

// 1. visible placeholders ("[Add ...]", yellow highlight) left in any page
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) {
      const html = fs.readFileSync(p, 'utf8');
      const rel = '/' + path.relative(dist, p).replace(/\\/g, '/').replace(/index\.html$/, '');
      for (const m of html.matchAll(/<span class="fill"[^>]*>([\s\S]*?)<\/span>/g)) { const text = m[1].replace(/<[^>]+>/g, '').trim(); (found[text] ??= new Set()).add(rel); }
    }
  }
})(dist);

for (const [text, where] of Object.entries(found)) problems.push(`placeholder on ${where.size} page${where.size > 1 ? 's' : ''} (${[...where].slice(0, 3).join(', ')}${where.size > 3 ? ', ...' : ''}): ${text}`);

// 2. form service configured?
const env = fs.existsSync(path.join(root, '.env')) ? fs.readFileSync(path.join(root, '.env'), 'utf8') : '';
const endpoint = process.env.PUBLIC_FORM_ENDPOINT || env.match(/^PUBLIC_FORM_ENDPOINT=(.+)$/m)?.[1];
if (!endpoint) warnings.push('No PUBLIC_FORM_ENDPOINT: forms fall back to opening the visitor\'s email app (messages can be lost).');

// 3. real photographs instead of stand-ins
const own = path.join(root, 'assets', 'photos');
const ownCount = fs.existsSync(own) ? fs.readdirSync(own).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).length : 0;
if (ownCount === 0) warnings.push('No photos in assets/photos: the site is showing generic stand-in photos, not your community.');

if (problems.length) { console.log(`\nMUST FIX before launch (${problems.length}):`); problems.forEach((p) => console.log('  x ' + p)); }
if (warnings.length) { console.log(`\nShould fix (${warnings.length}):`); warnings.forEach((w) => console.log('  ! ' + w)); }
if (!problems.length && !warnings.length) console.log('Launch checklist clean.');
process.exit(problems.length ? 1 : 0);
