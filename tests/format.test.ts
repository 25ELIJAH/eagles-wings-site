import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatDate, isUpcoming, escapeHtmlText } from '../src/lib/format.ts';

test('dates are shown in a clear Kenyan English format', () => {
  assert.equal(formatDate('2026-12-05'), '5 December 2026');
  assert.equal(formatDate('2027-01-01'), '1 January 2027');
});

test('an invalid date is returned unchanged rather than breaking the page', () => {
  assert.equal(formatDate('soon'), 'soon');
});

test('today and later are upcoming; earlier dates are not', () => {
  const today = new Date('2026-10-17T08:00:00Z');
  assert.equal(isUpcoming('2026-10-17', today), true);
  assert.equal(isUpcoming('2026-10-18', today), true);
  assert.equal(isUpcoming('2026-10-16', today), false);
  assert.equal(isUpcoming('2025-01-01', today), false);
});

test('text from the content files is escaped before it reaches HTML', () => {
  assert.equal(escapeHtmlText('<script>alert("x")</script> & \'y\''), '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;y&#39;');
});
