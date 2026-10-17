// Date helpers (dates are written as YYYY-MM-DD in src/data/org.ts).
export function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('en-KE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
}

/** True when the date is today or later (compared as plain dates, in UTC). */
export function isUpcoming(iso: string, today = new Date()): boolean {
  return iso >= today.toISOString().slice(0, 10);
}

export function escapeHtmlText(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}
