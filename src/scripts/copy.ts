// Copy buttons for giving details (M-Pesa, bank). Falls back to selecting the text when the clipboard is unavailable.
import { $$ } from './dom';

export function initCopy() {
  $$<HTMLButtonElement>('[data-copy]').forEach((btn) => {
    const idle = btn.textContent ?? 'Copy';
    const done = btn.dataset.done ?? 'Copied';
    btn.addEventListener('click', async () => {
      const value = btn.dataset.copy ?? '';
      try {
        await navigator.clipboard.writeText(value);
        btn.textContent = done;
      } catch {
        const range = document.createRange();
        const target = btn.previousElementSibling;
        if (target) { range.selectNodeContents(target); const sel = window.getSelection(); sel?.removeAllRanges(); sel?.addRange(range); }
        btn.textContent = 'Press Ctrl+C';
      }
      window.setTimeout(() => { btn.textContent = idle; }, 2200);
    });
  });
}
