// Header: mobile menu, hide on scroll-down / return on scroll-up, page-leave fade.
import { $, $$, reducedMotion } from './dom';

export function initNav() {
  const header = $('#top');
  const nav = $('#nav');
  const btn = $<HTMLButtonElement>('#menu-btn');
  const zone = $('#top-zone');
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

  // ---- header slides away on scroll-down, returns on scroll-up, top-edge hover or keyboard focus ----
  let lastY = window.scrollY;
  let ticking = false;
  let hideTimer: number | undefined;
  const show = () => { window.clearTimeout(hideTimer); header.classList.remove('hide'); };
  const canHide = () =>
    window.scrollY > 120 && !header.matches(':hover') && !header.contains(document.activeElement) && !nav.classList.contains('open');
  const hide = () => { if (canHide()) header.classList.add('hide'); };

  const onScroll = () => {
    const y = window.scrollY;
    if (y < 120) show();
    else if (y > lastY + 6) hide();
    else if (y < lastY - 6) show();
    lastY = y;
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  zone?.addEventListener('mouseenter', show);
  header.addEventListener('mouseenter', show);
  header.addEventListener('mouseleave', () => { window.clearTimeout(hideTimer); hideTimer = window.setTimeout(hide, 900); });
  header.addEventListener('focusin', show);
  onScroll();

  // ---- short fade before moving to another page of the site ----
  document.addEventListener('click', (e) => {
    if (reducedMotion()) return;
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
    if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.defaultPrevented) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || u.pathname === location.pathname || /^(mailto|tel):/.test(a.href)) return;
    e.preventDefault();
    document.body.classList.add('leaving');
    window.setTimeout(() => { location.href = a.href; }, 220);
  });
  window.addEventListener('pageshow', (e) => { if (e.persisted) document.body.classList.remove('leaving'); });
}
