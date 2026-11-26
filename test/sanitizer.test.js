// test/sanitizer.test.js
// Tests HTML escaping, XSS neutralization, and secret redaction.

const test = require('node:test');
const assert = require('node:assert/strict');
const { _testExports } = require('../api/ai.js');
const { _testExports: runExports } = require('../api/run.js');
const { escHtml, redactSecrets, userStr, cleanText, sanitizePlayerName } = _testExports;
const { sanitizeJavaCode, sanitizeStdin } = runExports;

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

test('cleanText: preserves apostrophes and quotes without HTML-entity mangling while redacting secrets', () => {
  const txt = "Hello! I'm Meowger. Use System.out.println(\"Hi\"); AIzaSyA_testKey1234567890abcdefghijklmn";
  const out = cleanText(txt, 500);
  assert.equal(out.includes("I'm Meowger"), true);
  assert.equal(out.includes('&#x27;'), false);
  assert.equal(out.includes('&quot;'), false);
  assert.equal(out.includes('AIzaSyA_testKey'), false);
  assert.equal(out.includes('[REDACTED_SECRET]'), true);
});

test('sanitizePlayerName: strips control chars, tags, and backticks safely and falls back when empty', () => {
  assert.equal(sanitizePlayerName('Advaith_99'), 'Advaith_99');
  assert.equal(sanitizePlayerName('meow\n<script>x`hi`'), 'meow script x hi');
  assert.equal(sanitizePlayerName('A'.repeat(60)).length, 32);
  assert.equal(sanitizePlayerName('   '), 'JavaLearner');
  assert.equal(sanitizePlayerName(null), 'JavaLearner');
});

test('sanitizeJavaCode: strips zero-width/bidi bytes, normalizes smart quotes & typos', () => {
  const dirty = '\uFEFFport\u00A0java.util.Scanner;\r\npublic class Main {\n  String s = \u201CHello\u201D + \u2018!\u2019;\u200B\u202E\n}';
  const cleaned = sanitizeJavaCode(dirty);
  assert.equal(cleaned.includes('\uFEFF'), false);
  assert.equal(cleaned.includes('\u200B'), false);
  assert.equal(cleaned.includes('\u202E'), false);
  assert.equal(cleaned.includes('\u00A0'), false);
  assert.equal(cleaned.includes('\r'), false);
  assert.equal(cleaned.startsWith('import java.util.Scanner;'), true);
  assert.equal(cleaned.includes('String s = "Hello" + \'!\';'), true);
  assert.equal(cleaned.includes('class Main {'), true);
});

test('sanitizeStdin: strips unsafe control chars and caps length', () => {
  const dirty = 'alice\u0000\u200B\r\nbob\u0007';
  assert.equal(sanitizeStdin(dirty), 'alice\nbob');
  assert.equal(sanitizeStdin('x'.repeat(5000)).length <= 2048, true);
});
