// Header: mobile menu and a short fade before moving to another page. The header itself stays put (no sliding in or out).
import { $, $$, reducedMotion } from './dom';

export function initNav() {
  const header = $('#top');
  const nav = $('#nav');
  const btn = $<HTMLButtonElement>('#menu-btn');
  if (!header || !nav || !btn) return;

  // ---- mobile menu ----
  const setOpen = (open: boolean) => {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  btn.setAttribute('aria-label', 'Open menu');
  btn.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { setOpen(false); btn.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') && !header.contains(e.target as Node)) setOpen(false);
  });

  // ---- desktop: one yellow underline glides to the link you point at, and rests under the current page ----
  const list = $('ul', nav);
  if (!list) return;
  const links = $$<HTMLAnchorElement>('a:not(.btn):not(.lang-switch)', nav);
  const ind = document.createElement('span');
  ind.className = 'nav-ind';
  ind.setAttribute('aria-hidden', 'true');
  list.append(ind);
  const mobile = window.matchMedia('(max-width: 860px)');
  const current = () => links.find((a) => a.hasAttribute('aria-current')) ?? null;
  let ready = false;
  const moveTo = (a: HTMLElement | null) => {
    if (mobile.matches || !a) { ind.classList.remove('on'); return; }
    const r = a.getBoundingClientRect();
    const p = list.getBoundingClientRect();
    ind.style.width = `${Math.max(0, r.width - 24)}px`;
    ind.style.transform = `translateX(${r.left - p.left + 12}px)`;
    ind.classList.add('on');
  };
  const rest = () => moveTo(current());
  const apply = () => {
    nav.classList.toggle('has-ind', !mobile.matches);
    ind.classList.remove('ready');
    rest();
    // switch the glide on only after the first position is set, so it does not fly in from the left on load
    requestAnimationFrame(() => requestAnimationFrame(() => { if (!ready || true) ind.classList.add('ready'); ready = true; }));
  };
  links.forEach((a) => {
    a.addEventListener('mouseenter', () => moveTo(a));
    a.addEventListener('focus', () => moveTo(a));
  });
  list.addEventListener('mouseleave', rest);
  nav.addEventListener('focusout', (e) => { if (!nav.contains((e as FocusEvent).relatedTarget as Node)) rest(); });
  window.addEventListener('resize', apply);
  mobile.addEventListener('change', apply);
  window.addEventListener('load', apply);
  document.fonts?.ready.then(apply);
  apply();
  void reducedMotion;
}
