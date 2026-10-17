// Cookie notice: shown once; remembers that it was seen. Works even if the browser blocks storage.
import { $ } from './dom';

const KEY = 'ew-cookie-ok';

export function initCookieNotice() {
  const notice = $('#cookie');
  const ok = $<HTMLButtonElement>('#cookie-ok');
  if (!notice || !ok) return;

  let seen = false;
  try { seen = localStorage.getItem(KEY) === '1'; } catch { /* storage blocked: show the notice each visit */ }
  if (seen) return;

  window.setTimeout(() => {
    notice.hidden = false;
    requestAnimationFrame(() => notice.classList.add('show'));
  }, 2600);

  ok.addEventListener('click', () => {
    try { localStorage.setItem(KEY, '1'); } catch { /* ignore */ }
    notice.classList.remove('show');
    window.setTimeout(() => { notice.hidden = true; }, 400);
  });
}
