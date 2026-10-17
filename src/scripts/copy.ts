// Copy buttons for giving details (M-Pesa, bank). Falls back to selecting the text when the clipboard is unavailable.
import { $$ } from './dom';

export function initCopy() {
  $$<HTMLButtonElement>('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const value = btn.dataset.copy ?? '';
      try {
        await navigator.clipboard.writeText(value);
        btn.textContent = 'Copied';
      } catch {
        const range = document.createRange();
        const target = btn.previousElementSibling;
        if (target) { range.selectNodeContents(target); const sel = window.getSelection(); sel?.removeAllRanges(); sel?.addRange(range); }
        btn.textContent = 'Press Ctrl+C';
      }
      window.setTimeout(() => { btn.textContent = 'Copy'; }, 2200);
    });
  });
}
