// test/rate-limiter.test.js
// Tests the in-memory sliding bucket rate limiter.

const test = require('node:test');
const assert = require('node:assert/strict');
const { _testExports } = require('../api/ai.js');
const { checkBucket } = _testExports;

test('checkBucket: allows requests up to the configured limit', () => {
  const bucket = new Map();
  const key = '127.0.0.1';
  const limit = 5;
  const windowMs = 60000;

  for (let i = 1; i <= limit; i++) {
    const allowed = checkBucket(bucket, key, limit, windowMs);
    assert.equal(allowed, true, `Request ${i} should be allowed`);
  }

  // Next request exceeds limit
  const denied = checkBucket(bucket, key, limit, windowMs);
  assert.equal(denied, false, 'Request over limit should be rejected');
});

test('checkBucket: tracks different keys independently', () => {
  const bucket = new Map();
  const limit = 2;
  const windowMs = 60000;

  assert.equal(checkBucket(bucket, 'user-A', limit, windowMs), true);
  assert.equal(checkBucket(bucket, 'user-A', limit, windowMs), true);
  assert.equal(checkBucket(bucket, 'user-A', limit, windowMs), false);

  // user-B is unaffected
  assert.equal(checkBucket(bucket, 'user-B', limit, windowMs), true);
  assert.equal(checkBucket(bucket, 'user-B', limit, windowMs), true);
  assert.equal(checkBucket(bucket, 'user-B', limit, windowMs), false);
});

test('checkBucket: resets after the window duration has elapsed', () => {
  const bucket = new Map();
  const key = 'user-timeout';
  const limit = 1;
  const windowMs = 50; // 50ms window for testing

  assert.equal(checkBucket(bucket, key, limit, windowMs), true);
  assert.equal(checkBucket(bucket, key, limit, windowMs), false);

  // Manually fast-forward entry reset time
  const entry = bucket.get(key);
  entry.resetAt = Date.now() - 10;

  assert.equal(checkBucket(bucket, key, limit, windowMs), true);
});
