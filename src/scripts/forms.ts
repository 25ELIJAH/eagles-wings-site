// Contact forms: validation, spam trap, loading / success / error states, recoverable errors.
// With a form service configured (formEndpoint in src/data/site.ts) the message is sent in the background.
// Without one, the visitor's email app opens with the message ready to send, and the form says so honestly.
import { $, $$ } from './dom';
import { translateMessage } from '../lib/i18n';
import { validate, looksLikeBot, buildMailto, MIN_FILL_MS, type FormKind, type Values } from '../lib/forms';

const TIMEOUT_MS = 12000;

export function initForms() {
  $$<HTMLFormElement>('form.js-form').forEach(setup);
}

function setup(form: HTMLFormElement) {
  const kind = (form.dataset.kind as FormKind) ?? 'contact';
  const endpoint = form.dataset.endpoint ?? '';
  const email = form.dataset.email ?? '';
  const button = $<HTMLButtonElement>('button[type="submit"]', form)!;
  const label = $('.btn-label', form)!;
  const status = $('.form-status', form)!;
  const idleLabel = label.textContent ?? 'Send';
  const tr = (m: string) => (form.dataset.lang === 'sw' ? translateMessage(m) : m);
  let startedAt = Date.now();

  const setStatus = (kindOfMessage: 'ok' | 'err' | 'info', text: string, retry = false) => {
    status.hidden = false;
    status.className = `form-status ${kindOfMessage}`;
    status.textContent = tr(text);
    if (retry) {
      const again = document.createElement('button');
      again.type = 'button';
      again.className = 'link-btn';
      again.textContent = tr('Try again');
      again.addEventListener('click', () => form.requestSubmit());
      status.append(' ', again);
    }
  };
  const setLoading = (on: boolean) => {
    form.toggleAttribute('aria-busy', on);
    button.disabled = on;
    button.classList.toggle('loading', on);
    label.textContent = on ? tr('Sending…') : idleLabel;
  };
  const clearErrors = () => {
    $$('.field-error', form).forEach((p) => { p.hidden = true; p.textContent = ''; });
    $$('input, textarea', form).forEach((i) => i.removeAttribute('aria-invalid'));
    status.hidden = true;
  };
  const showErrors = (errors: Record<string, string>) => {
    let first: HTMLElement | null = null;
    for (const [field, message] of Object.entries(errors)) {
      const input = $<HTMLInputElement>(`[name="${field}"]`, form);
      const err = input?.id ? document.getElementById(`${input.id}-err`) : null;
      if (!input || !err) continue;
      err.textContent = tr(message);
      err.hidden = false;
      input.setAttribute('aria-invalid', 'true');
      first ??= input;
    }
    first?.focus();
    const n = Object.keys(errors).length;
    setStatus('err', n === 1 ? 'Please fix the field marked below.' : `Please fix the ${n} fields marked below.`);
  };

  // typing clears that field's error
  form.addEventListener('input', (e) => {
    const input = e.target as HTMLInputElement;
    if (input.getAttribute('aria-invalid') !== 'true') return;
    input.removeAttribute('aria-invalid');
    const err = input.id ? document.getElementById(`${input.id}-err`) : null;
    if (err) { err.hidden = true; err.textContent = ''; }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (button.disabled) return;   // ignore double clicks and double submits
    clearErrors();

    const values = Object.fromEntries([...new FormData(form).entries()].map(([k, v]) => [k, String(v)])) as Values;

    // Spam trap filled in: pretend it worked and send nothing.
    if (values.website?.trim()) { setStatus('ok', 'Thank you. We will be in touch soon.'); return; }

    const result = validate(kind, values);
    if (!result.ok) { showErrors(result.errors); return; }

    // Filled in suspiciously fast (autofill and an instant click): ask for one more press instead of risking a lost message.
    if (looksLikeBot(values, Date.now() - startedAt)) {
      startedAt = Date.now() - MIN_FILL_MS;
      setStatus('info', 'Please check your details, then press Send again to confirm.');
      return;
    }

    setLoading(true);
    if (!endpoint) {
      window.location.href = buildMailto(email, kind, values);
      setLoading(false);
      setStatus('info', `Your email app should open with your message ready to send. If nothing opens, please email us at ${email}.`);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      startedAt = Date.now();
      setStatus('ok', kind === 'newsletter' ? 'Thank you. Please check your email to confirm your sign-up.' : 'Thank you. We have received your message and will reply soon.');
    } catch {
      setStatus('err', `We could not send your message just now. Please try again, or email us at ${email}.`, true);
    } finally {
      window.clearTimeout(timer);
      setLoading(false);
    }
  });
}
