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
  void reducedMotion;
}
