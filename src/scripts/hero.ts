// Landing page life: headline word rotation, portraits taking turns inside the map, gentle parallax and tilt.
// Everything stops with the pause button, never starts for visitors who prefer less motion, and pauses in background tabs.
import { $, $$, reducedMotion, finePointer } from './dom';

export function initHero() {
  const hero = $('.hero');
  if (!hero) return;
  const paused = () => document.hidden;
  const calm = reducedMotion();

  // ---- rotating headline word ----
  const rot = $('.rot', hero);
  const words: string[] = rot ? JSON.parse(rot.dataset.words ?? '[]') : [];
  if (rot && words.length > 1 && true) {
    let i = 0;
    window.setInterval(() => {
      if (paused()) return;
      i = (i + 1) % words.length;
      const old = rot.lastElementChild as HTMLElement | null;
      const next = document.createElement('span');
      next.className = 'rot-word hl enter';
      next.textContent = words[i];
      next.setAttribute('aria-hidden', 'true');   // the heading is read once, not on every change
      rot.append(next);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        next.classList.remove('enter');
        old?.classList.add('leave');
      }));
      window.setTimeout(() => old?.remove(), 800);
    }, 2800);
  }

  // ---- portraits take turns inside the map ----
  const faces = $$('.kimg', hero) as unknown as SVGImageElement[];
  if (faces.length > 1) {
    let cur = 0;
    const load = (el?: SVGImageElement) => {
      const url = el?.dataset.href;
      if (url) { el!.setAttribute('href', url); delete el!.dataset.href; }
    };
    load(faces[1]);
    const next = () => {
      faces[cur].classList.remove('on');
      cur = (cur + 1) % faces.length;
      load(faces[cur]);
      faces[cur].classList.add('on');
      load(faces[(cur + 1) % faces.length]);
    };
    let timer = window.setInterval(() => { if (!paused()) next(); }, 4200);
    // click or tap the map to see the next face (keyboard: the "Next photo" button)
    const again = () => { next(); window.clearInterval(timer); timer = window.setInterval(() => { if (!paused()) next(); }, 4200); };
    $('.kenya', hero)?.addEventListener('click', again);
  }

  // ---- buttons lean toward the pointer, and a soft light follows it across the hero ----
  if (!calm && finePointer()) {
    $$('.hero .btn').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.translate = `${((e.clientX - r.left) / r.width - 0.5) * 10}px ${((e.clientY - r.top) / r.height - 0.5) * 8}px`;
      });
      b.addEventListener('pointerleave', () => { b.style.translate = ''; });
    });
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', `${e.clientX - r.left}px`);
      hero.style.setProperty('--my', `${e.clientY - r.top}px`);
      hero.classList.add('lit');
    });
    hero.addEventListener('pointerleave', () => hero.classList.remove('lit'));
  }

  if (calm) return;

  // ---- slow parallax: decorations drift as you scroll away ----
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    if (y < hero.clientHeight * 1.2) hero.style.setProperty('--sy', String(Math.round(y)));
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  // ---- the map leans toward the pointer ----
  const art = $('.hero-art', hero);
  const map = $('.kenya', hero);
  if (art && map && finePointer()) {
    art.addEventListener('pointermove', (e) => {
      const r = art.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      map.style.setProperty('--ry', `${(x * 7).toFixed(2)}deg`);
      map.style.setProperty('--rx', `${(-y * 7).toFixed(2)}deg`);
    });
    art.addEventListener('pointerleave', () => { map.style.setProperty('--rx', '0deg'); map.style.setProperty('--ry', '0deg'); });
  }
}
