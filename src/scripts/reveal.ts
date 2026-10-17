// Scroll reveal (in on entering, out when leaving the top, replays), rolling numbers, photo skeleton loading.
import { $$, reducedMotion } from './dom';

export function initReveal() {
  const calm = reducedMotion() || !('IntersectionObserver' in window);

  // ---- reveal ----
  const reveals = $$('.reveal');
  if (calm) {
    reveals.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        const el = e.target as HTMLElement;
        if (e.isIntersecting) { el.classList.remove('gone-up'); el.classList.add('in'); }
        else { el.classList.remove('in'); el.classList.toggle('gone-up', e.boundingClientRect.top < 0); }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' },
    );
    reveals.forEach((el) => io.observe(el));
  }

  // ---- rolling numbers: each digit is a reel that slides to its value ----
  const rolls = $$('[data-roll]');
  rolls.forEach((el) => {
    const value = String(el.dataset.roll);
    el.setAttribute('role', 'text');
    el.setAttribute('aria-label', value);
    el.replaceChildren(...value.split('').map((d, k) => {
      const digit = document.createElement('span');
      digit.className = 'digit';
      digit.setAttribute('aria-hidden', 'true');
      const reel = document.createElement('span');
      reel.className = 'reel';
      reel.style.setProperty('--to', d);
      reel.style.setProperty('--k', String(k));
      for (let n = 0; n < 10; n++) { const s = document.createElement('span'); s.textContent = String(n); reel.append(s); }
      digit.append(reel);
      return digit;
    }));
  });
  if (calm) rolls.forEach((el) => el.classList.add('rolled'));
  else {
    const ro = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        const el = e.target as HTMLElement;
        if (e.isIntersecting) requestAnimationFrame(() => el.classList.add('rolled'));
        else el.classList.remove('rolled');
      }),
      { threshold: 0.5 },
    );
    rolls.forEach((el) => ro.observe(el));
  }

  // ---- photo skeleton: shimmer until each image has loaded ----
  $$<HTMLImageElement>('img.photo').forEach((img) => {
    const done = () => img.classList.add('is-loaded');
    if (img.complete) done();
    else { img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true }); }
  });
}
