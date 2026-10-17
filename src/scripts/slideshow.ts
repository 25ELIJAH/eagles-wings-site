// Background photo slideshows (hero and community band), and the stories slider.
// WCAG 2.2.2: anything that moves by itself has a pause control, and it does not start for visitors who prefer less motion.
import { $, $$, reducedMotion } from './dom';

export function initSlideshows() {
  $$('[data-slides]').forEach((stage, index) => {
    const slides = $$('.sl', stage);
    const toggle = $<HTMLButtonElement>('[data-slides-toggle]', stage.parentElement ?? document.body);
    if (slides.length < 2) { toggle?.remove(); return; }

    let current = 0;
    let paused = reducedMotion();
    let timer: number | undefined;
    const preload = (n: number) => {
      const el = slides[n];
      const url = el?.dataset.bg;
      if (url) { const img = new Image(); img.src = url; img.onload = () => { el.style.backgroundImage = `url('${url}')`; delete el.dataset.bg; }; }
    };
    const go = (n: number) => {
      current = (n + slides.length) % slides.length;
      const el = slides[current];
      if (el.dataset.bg) { el.style.backgroundImage = `url('${el.dataset.bg}')`; delete el.dataset.bg; }
      slides.forEach((s, i) => s.classList.toggle('on', i === current));
      preload((current + 1) % slides.length);
    };
    const stop = () => { window.clearInterval(timer); timer = undefined; };
    const start = () => { stop(); if (!paused && !document.hidden) timer = window.setInterval(() => go(current + 1), 6500); };
    const render = () => {
      toggle?.setAttribute('aria-pressed', String(paused));
      toggle?.setAttribute('aria-label', paused ? 'Play background photo slideshow' : 'Pause background photo slideshow');
      toggle?.classList.toggle('paused', paused);
    };

    toggle?.addEventListener('click', () => { paused = !paused; render(); paused ? stop() : start(); });
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    render();
    preload(1);
    window.setTimeout(start, index * 2500);   // stagger the two slideshows so they do not change together
  });

  // ---- stories: previous / next (no automatic movement) ----
  const quotes = $$('#tq .tq');
  if (quotes.length > 1) {
    let cur = 0;
    const show = (n: number) => {
      cur = (n + quotes.length) % quotes.length;
      quotes.forEach((q, i) => { q.classList.toggle('on', i === cur); q.setAttribute('aria-hidden', String(i !== cur)); });
    };
    show(0);
    $('#tq-prev')?.addEventListener('click', () => show(cur - 1));
    $('#tq-next')?.addEventListener('click', () => show(cur + 1));
  }
}
