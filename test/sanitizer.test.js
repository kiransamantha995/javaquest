// test/sanitizer.test.js
// Tests HTML escaping, XSS neutralization, and secret redaction.

const test = require('node:test');
const assert = require('node:assert/strict');
const { _testExports } = require('../api/ai.js');
const { escHtml, redactSecrets, userStr } = _testExports;

test('escHtml: escapes all dangerous HTML characters', () => {
  const dangerousInput = '<script>alert("XSS")</script>&foo=\'bar\'';
  const escaped = escHtml(dangerousInput);

  assert.equal(escaped.includes('<script>'), false);
  assert.equal(escaped.includes('&lt;script&gt;'), true);
  assert.equal(escaped.includes('&quot;XSS&quot;'), true);
  assert.equal(escaped.includes('&#x27;bar&#x27;'), true);
  assert.equal(escaped.includes('&amp;foo='), true);
});

test('escHtml: handles null, undefined, and non-string inputs safely', () => {
  assert.equal(escHtml(null), '');
  assert.equal(escHtml(undefined), '');
  assert.equal(escHtml(12345), '12345');
});

test('escHtml: prevents event-handler and tag breakout attacks', () => {
  const attack = '" onmouseover="alert(1)" <img src=x onerror=alert(2)>';
  const escaped = escHtml(attack);

  assert.equal(escaped.includes('<img'), false);
  assert.equal(escaped.includes('&quot; onmouseover='), true);
  assert.equal(escaped.includes('&lt;img src=x'), true);
});

test('redactSecrets: masks Google API keys, Bearer tokens, and secrets', () => {
  const sampleWithKey = 'AIzaSyA_testKey1234567890abcdefghijklmn is my key';
  const redacted = redactSecrets(sampleWithKey);
  assert.equal(redacted.includes('AIzaSyA_testKey'), false);
  assert.equal(redacted.includes('[REDACTED_SECRET]'), true);

  const sampleWithBearer = 'Authorization: Bearer secretToken1234567890';
  const redactedBearer = redactSecrets(sampleWithBearer);
  assert.equal(redactedBearer.includes('secretToken'), false);
  assert.equal(redactedBearer.includes('[REDACTED_SECRET]'), true);
});

test('userStr: enforces length caps and converts types cleanly', () => {
  const longStr = 'a'.repeat(200);
  assert.equal(userStr(longStr, 50).length, 50);
  assert.equal(userStr(null, 50), '');
  assert.equal(userStr(undefined, 50), '');
  assert.equal(userStr(42, 50), '42');
});
