import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate, looksLikeBot, buildMailto, isEmail, isPhone, MIN_FILL_MS, LIMITS } from '../src/lib/forms.ts';

const good = { Name: 'Amina Wanjiru', Email: 'amina@example.org', Phone: '+254 712 345 678', Subject: 'Volunteering', Message: 'I would like to help.' };

test('a complete contact message is valid', () => {
  assert.deepEqual(validate('contact', good), { ok: true, errors: {} });
});

test('contact form requires name, email and message', () => {
  const r = validate('contact', { Name: '', Email: '', Message: '' });
  assert.equal(r.ok, false);
  assert.deepEqual(Object.keys(r.errors).sort(), ['Email', 'Message', 'Name']);
});

test('phone is optional on the contact form, but must look like a phone number when given', () => {
  assert.equal(validate('contact', { ...good, Phone: '' }).ok, true);
  assert.equal(validate('contact', { ...good, Phone: 'abc' }).errors.Phone !== undefined, true);
});

test('email addresses are checked', () => {
  for (const bad of ['plain', 'a@b', 'a b@c.org', '@x.org', 'a@@x.org']) assert.equal(isEmail(bad), false, bad);
  for (const ok of ['a@b.co', 'first.last+tag@sub.example.org']) assert.equal(isEmail(ok), true, ok);
});

test('Kenyan and international phone formats are accepted', () => {
  for (const ok of ['0712345678', '+254712345678', '+254 712 345 678', '(020) 123-4567']) assert.equal(isPhone(ok), true, ok);
  for (const bad of ['12', 'phone', '+', '123abc456']) assert.equal(isPhone(bad), false, bad);
});

test('quick form accepts a phone number or an email, not neither', () => {
  assert.equal(validate('quick', { Name: 'Joseph', Contact: '0712345678' }).ok, true);
  assert.equal(validate('quick', { Name: 'Joseph', Contact: 'joseph@example.org' }).ok, true);
  assert.equal(validate('quick', { Name: 'Joseph', Contact: 'call me' }).errors.Contact !== undefined, true);
  assert.equal(validate('quick', { Name: 'Joseph', Contact: '' }).errors.Contact !== undefined, true);
});

test('over-long input is rejected and whitespace is normalised', () => {
  assert.equal(validate('contact', { ...good, Message: 'x'.repeat(LIMITS.message + 1) }).errors.Message !== undefined, true);
  assert.equal(validate('contact', { ...good, Name: '  Amina   Wanjiru  ' }).ok, true);
  assert.equal(validate('contact', { ...good, Name: '   ' }).errors.Name !== undefined, true);
});

test('honeypot and instant submissions are treated as bots', () => {
  assert.equal(looksLikeBot({ website: 'http://spam.example' }, 60_000), true);
  assert.equal(looksLikeBot({ website: '' }, 500), true);
  assert.equal(looksLikeBot({ website: '' }, MIN_FILL_MS), false);
  assert.equal(looksLikeBot({}, 30_000), false);
});

test('mailto link is encoded, skips the honeypot, and cannot inject headers', () => {
  const url = buildMailto('info@example.org', 'contact', { ...good, website: '', Subject: 'Hello & welcome\r\nBcc: evil@example.org' });
  assert.match(url, /^mailto:info@example\.org\?subject=/);
  assert.equal(url.includes('\n'), false);
  assert.equal(url.includes('\r'), false);
  assert.equal(decodeURIComponent(url).includes('website:'), false);
  const subject = decodeURIComponent(url.split('subject=')[1].split('&body=')[0]);
  assert.equal(subject.includes('\n'), false);
});
