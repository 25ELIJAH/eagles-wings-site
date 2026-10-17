// Accessible photo viewer: focus moves into the dialog, Tab stays inside it, Esc closes, focus returns to the photo.
import { $, $$ } from './dom';

export function initLightbox() {
  const box = $('#lightbox');
  const img = $<HTMLImageElement>('#lb-i');
  const shots = $$<HTMLButtonElement>('.shot[data-full]');
  if (!box || !img || !shots.length) return;

  const closeBtn = $<HTMLButtonElement>('#lb-x')!;
  const prevBtn = $<HTMLButtonElement>('#lb-p')!;
  const nextBtn = $<HTMLButtonElement>('#lb-nx')!;
  let current = 0;
  let opener: HTMLElement | null = null;

  const show = (n: number) => {
    current = (n + shots.length) % shots.length;
    img.src = shots[current].dataset.full ?? '';
    img.alt = shots[current].dataset.alt ?? '';
  };
  const open = (n: number, from: HTMLElement) => {
    opener = from;
    show(n);
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };
  const close = () => {
    box.hidden = true;
    document.body.style.overflow = '';
    opener?.focus();
  };

  shots.forEach((s, n) => s.addEventListener('click', () => open(n, s)));
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(current - 1));
  nextBtn.addEventListener('click', () => show(current + 1));
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
    else if (e.key === 'Tab') {
      const items = [closeBtn, prevBtn, nextBtn];
      const i = items.indexOf(document.activeElement as HTMLButtonElement);
      e.preventDefault();
      items[(i + (e.shiftKey ? items.length - 1 : 1)) % items.length].focus();
    }
  });
}
