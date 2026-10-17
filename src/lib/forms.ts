// Form validation and message building. Pure functions (no DOM), so they can be unit tested.
export type FormKind = 'contact' | 'quick' | 'newsletter' | 'involve';
export type Values = Record<string, string>;
export interface Result { ok: boolean; errors: Record<string, string> }

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE_RE = /^\+?[0-9(][0-9 ()-]{6,18}[0-9]$/;
export const LIMITS = { name: 100, subject: 150, message: 2000 } as const;
/** A real person needs a moment to fill a form; bots submit instantly. */
export const MIN_FILL_MS = 2500;

const clean = (v: unknown) => String(v ?? '').replace(/\s+/g, ' ').trim();

export function isEmail(v: string) { return EMAIL_RE.test(v.trim()); }
export function isPhone(v: string) { return PHONE_RE.test(v.trim()); }

export function validate(kind: FormKind, raw: Values): Result {
  const v = Object.fromEntries(Object.entries(raw).map(([k, x]) => [k, clean(x)]));
  const errors: Record<string, string> = {};

  if (!v.Name) errors.Name = 'Please tell us your name.';
  else if (v.Name.length < 2) errors.Name = 'Your name looks too short.';
  else if (v.Name.length > LIMITS.name) errors.Name = `Please keep your name under ${LIMITS.name} characters.`;

  if (kind === 'newsletter') {
    delete errors.Name;
    if (!v.Email) errors.Email = 'Please add your email address.';
    else if (!isEmail(v.Email)) errors.Email = 'That email address does not look right.';
  } else if (kind === 'quick') {
    if (!v.Contact) errors.Contact = 'Please add a phone number or email so we can reply.';
    else if (!isEmail(v.Contact) && !isPhone(v.Contact)) errors.Contact = 'That does not look like a phone number or email address.';
  } else {
    if (!v.Email) errors.Email = 'Please add your email address.';
    else if (!isEmail(v.Email)) errors.Email = 'That email address does not look right.';
    if (v.Phone && !isPhone(v.Phone)) errors.Phone = 'That phone number does not look right.';
    if (v.Subject && v.Subject.length > LIMITS.subject) errors.Subject = `Please keep the subject under ${LIMITS.subject} characters.`;
    if (!v.Message) errors.Message = 'Please write a short message.';
    else if (v.Message.length > LIMITS.message) errors.Message = `Please keep your message under ${LIMITS.message} characters.`;
  }
  return { ok: Object.keys(errors).length === 0, errors };
}

/** Honeypot filled in, or submitted too fast: treat as a bot. */
export function looksLikeBot(raw: Values, elapsedMs: number): boolean {
  return clean(raw.website) !== '' || elapsedMs < MIN_FILL_MS;
}

/** The mailto: link used when no form service is configured. */
export function buildMailto(to: string, kind: FormKind, raw: Values): string {
  const lines = Object.entries(raw)
    .filter(([k, v]) => k !== 'website' && clean(v))
    .map(([k, v]) => `${k}: ${String(v).trim()}`);
  const subject = clean(raw.Subject) || (kind === 'quick' ? 'Message from the website' : kind === 'involve' ? 'Volunteer or partner enquiry' : 'Website enquiry');
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
}
